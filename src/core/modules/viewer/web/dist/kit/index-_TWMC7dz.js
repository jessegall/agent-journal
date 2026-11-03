/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as me, createElementVNode as p, normalizeClass as Z, Fragment as G, renderList as se, normalizeStyle as pe, defineComponent as Di, Comment as Ni, h as ia, cloneVNode as Pi, createBlock as V, withCtx as F, unref as z, createVNode as D, toDisplayString as b, createCommentVNode as C, inject as Oe, useAttrs as Hn, computed as L, ref as B, resolveDynamicComponent as xt, mergeProps as tt, Transition as Bt, watch as be, shallowRef as Un, createTextVNode as le, TransitionGroup as Do, reactive as la, onMounted as Fe, onUnmounted as Ie, nextTick as Lt, useId as No, Teleport as ca, withModifiers as xe, isRef as Da, onBeforeUnmount as Dt, resolveComponent as ji, resolveDirective as qi, withDirectives as dt, useModel as Bs, getCurrentInstance as Fi, mergeModels as Ls, getCurrentScope as Po, onScopeDispose as jo, provide as Wi, onErrorCaptured as Hi, toHandlers as Ui, createSlots as zi, vShow as Vi, useSlots as Gi, withKeys as Kt, vModelText as Ds, defineAsyncComponent as Ki } from "vue";
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Yi = { class: "skeleton-line" }, Ji = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Yi, [
      me(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(G, null, se(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: pe({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ft = /* @__PURE__ */ K(Ji, [["__scopeId", "data-v-0ebb6933"]]), ln = Di({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Ni);
      return s.length !== 1 ? ia(G, { key: n }, s) : s[0].key == null ? Pi(s[0], { key: n }) : s[0];
    };
  }
}), Zi = ["aria-label"], Xi = ["aria-label"], Qi = ["aria-label"], el = ["aria-label"], tl = ["aria-label"], nl = ["aria-label"], sl = ["aria-label"], al = {
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
    return (l, u) => (c(), V(ln, { value: e.shape }, {
      messages: F(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(G, null, se(t, (d) => p("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: pe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, Zi)
      ]),
      older: F(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, se(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: pe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, Xi)
      ]),
      cards: F(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(G, null, se(n, (f) => D(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Qi)
      ]),
      file: F(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            D(ft, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(G, null, se(a, (f) => D(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, el)
      ]),
      page: F(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          D(ft, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(G, null, se(e.count, (d) => (c(), V(ft, {
            key: d,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, tl)
      ]),
      text: F(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, se(e.count, (d) => (c(), V(ft, {
            key: d,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, nl)
      ]),
      default: F(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, se(e.count, (d) => (c(), V(ft, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, sl)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Nt = /* @__PURE__ */ K(al, [["__scopeId", "data-v-1392eacb"]]), ol = {
  key: 1,
  class: "empty-state titled"
}, rl = { class: "empty-state-title" }, il = { class: "empty-state-text" }, ll = {
  key: 2,
  class: "empty-state"
}, cl = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), V(Nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", ol, [
      p("p", rl, b(e.title), 1),
      p("p", il, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", ll, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Bn = /* @__PURE__ */ K(cl, [["__scopeId", "data-v-b27e89b0"]]), ul = { class: "fold-group" }, dl = ["aria-expanded"], hl = { class: "fold-label" }, fl = {
  key: 0,
  class: "fold-count"
}, ml = {
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
    return (s, a) => (c(), h("div", ul, [
      p("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", hl, b(e.label), 1),
        e.count !== "" ? (c(), h("span", fl, b(e.count), 1)) : C("", !0),
        p("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, dl),
      e.open ? me(s.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, Fk = /* @__PURE__ */ K(ml, [["__scopeId", "data-v-9ef1865c"]]), pl = Symbol("open-view"), Re = Symbol.for("journal.window-context");
function zn() {
  const e = Oe(Re, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const gl = ["stroke-width", "innerHTML"], ye = {
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
    }, null, 12, gl));
  }
}, vl = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: pe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, yl = /* @__PURE__ */ K(vl, [["__scopeId", "data-v-eb453d6f"]]), wl = 120, kl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Hn(), s = L(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), a = B(!1), o = L(() => t.busy || a.value), r = Oe(Re, null), i = L(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function l(u) {
      const d = [n.onClick].flat().filter(Boolean).map((g) => g(u)).filter((g) => g instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => a.value = !0, wl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), a.value = !1;
      }
    }
    return (u, d) => (c(), V(xt(e.href ? "a" : "button"), tt(s.value, {
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
          e.icon ? (c(), V(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : C("", !0),
          me(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), V(yl, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ve = /* @__PURE__ */ K(kl, [["__scopeId", "data-v-033d70ca"]]), bl = {
  class: "running",
  "data-running-command": ""
}, xl = ["title"], $l = {
  key: "idle",
  class: "running-idle"
}, Ml = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", bl, [
      D(Bt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: F(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, xl)) : (c(), h("span", $l, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Wk = /* @__PURE__ */ K(Ml, [["__scopeId", "data-v-d3240219"]]), Sl = ["aria-checked", "aria-label", "title"], _l = {
  key: 0,
  class: "switch-inner"
}, El = {
  key: 0,
  class: "switch-word"
}, Al = {
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
        e.labelled ? (c(), h("span", _l, b(e.word), 1)) : C("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", El, b(e.word), 1)) : C("", !0)
    ], 10, Sl));
  }
}, Hk = /* @__PURE__ */ K(Al, [["__scopeId", "data-v-1bfb90f3"]]);
function qo(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Yt(e, t) {
  return qo(() => localStorage, e, t);
}
function Fo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Vn(e, t) {
  return Fo(() => localStorage, e, t);
}
function Wo(e, t) {
  be(t, (n) => Vn(e, n), { deep: !0 });
}
function Cl(e, t) {
  return qo(() => sessionStorage, e, t);
}
function Ol(e, t) {
  return Fo(() => sessionStorage, e, t);
}
const Ln = "journal.environment", Ho = B(Cl(Ln, Yt(Ln, "")));
function Tl(e) {
  Ho.value = e, Ol(Ln, e), Vn(Ln, e);
}
const Dn = B(location.hash), Na = Un(null), Pa = { integrations: "mcp", library: "team" };
function Il() {
  if (!Na.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Pa[n]) {
    location.replace(`#/${[Pa[n], ...s].join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash;
    return;
  }
  !n || Na.value(n) || (Tl(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Dn.value = location.hash, Il();
});
const Ze = L(() => {
  const [e, t = ""] = Dn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: Ho.value,
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
function Rl(e = "", t = 0, n = "") {
  location.hash = Gn.page(e, t, n);
}
const Bl = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Uo(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Bl).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ot = {};
function Uk(e, t) {
  return Ot[e] = t, () => Ot[e] === t && delete Ot[e];
}
function zo(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Ot[e]) != null && r.call(Ot, t))) return;
  const a = Ze.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Uo([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Ll(e, t, n, s = 0, a = "") {
  if (e === Ze.value.env) return zo(t, n, s, a);
  const o = Ze.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Uo([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Xe(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Ll(s, a, Number(o), 0, t) : zo(a, Number(o), 0, t);
}
function Dl(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ct(e) {
  const t = Dl(e);
  t && Xe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Kn = typeof document < "u" && document.documentElement.classList.contains("phone"), Nl = "Files are attached on the computer; the phone sends text.", os = [
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
}, Pl = ["secrets", "plugins"], Vo = Object.keys(cn).filter((e) => !(Kn && Pl.includes(e)));
L(() => Vo.map((e) => ({ name: e, ...cn[e] })));
const un = (e) => cn[e], Go = new Map(Vo.flatMap((e) => [e, e.replace(/s$/, ""), cn[e].title.toLowerCase()].map((t) => [t, e]))), kt = (e) => Go.get(String(e).toLowerCase()) || "", Ko = [...Go.keys()].sort((e, t) => t.length - e.length).join("|"), Yn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), V(ve, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: F(() => [
        D(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, jl = {
  key: 1,
  class: "row-list-failure"
}, ql = ["data-row"], Fl = {
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
    const t = e, n = L(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = B(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), V(Nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", jl, b(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), V(Bn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: F(() => [
        le(b(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(G, { key: 3 }, [
      (c(), V(xt(e.arrival ? Do : "ul"), tt(n.value, { class: "row-list" }), {
        default: F(() => [
          (c(!0), h(G, null, se(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            me(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, ql))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : C("", !0)
    ], 64));
  }
}, Wl = /* @__PURE__ */ K(Fl, [["__scopeId", "data-v-aa6ad7ff"]]), Hl = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ul = {
  key: 1,
  class: "agent-rows-note"
}, zl = {
  key: 2,
  class: "agent-rows-note"
}, Vl = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Gl = ["data-agent-row", "onClick"], Kl = { class: "agent-row-name" }, Yl = { class: "agent-row-state" }, Jl = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = L(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = L(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Hl, [
      e.loaded ? e.failure ? (c(), h("p", Ul, b(e.failure), 1)) : e.rows.length ? (c(), h(G, { key: 3 }, [
        p("p", Vl, b(s.value) + " running", 1),
        (c(!0), h(G, null, se(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(Xe)(`agents:${r.id}`)
        }, [
          p("span", Kl, "#" + b(r.id) + " " + b(r.session), 1),
          p("span", Yl, b(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Gl))), 128))
      ], 64)) : (c(), h("p", zl, b(e.none), 1)) : (c(), V(Nt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, zk = /* @__PURE__ */ K(Jl, [["__scopeId", "data-v-a01e5a17"]]), Zl = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, b(e.text), 3));
  }
}, Yo = /* @__PURE__ */ K(Zl, [["__scopeId", "data-v-9e7e1157"]]), Xl = ["aria-valuenow", "aria-valuemax"], Ql = {
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
    const t = e, n = L(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
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
    ], 10, Xl));
  }
}, ec = /* @__PURE__ */ K(Ql, [["__scopeId", "data-v-9eba6a85"]]), tc = { class: "bars" }, nc = { class: "bar-name" }, sc = { class: "bar-value" }, ac = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = L(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = L(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", tc, [
      (c(!0), h(G, null, se(e.items, (l, u) => (c(), V(xt(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: Z(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: F(() => [
          p("span", nc, b(l.label), 1),
          D(ec, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", sc, b(l.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, oc = /* @__PURE__ */ K(ac, [["__scopeId", "data-v-663427f4"]]), rc = { class: "bars" }, ic = {
  key: 0,
  class: "bars-title"
}, lc = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", rc, [
      e.node.title ? (c(), h("span", ic, b(e.node.title), 1)) : C("", !0),
      D(oc, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, cc = /* @__PURE__ */ K(lc, [["__scopeId", "data-v-7135bb11"]]), uc = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = L(() => n[s.node.type](s.node));
    return (r, i) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: pe(o.value)
    }, [
      (c(!0), h(G, null, se(e.node.children || [], (l, u) => (c(), V(Sr, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Cn = /* @__PURE__ */ K(uc, [["__scopeId", "data-v-d142a3f4"]]), dc = {
  key: 0,
  class: "card-head"
}, hc = { class: "card-title" }, fc = {
  key: 0,
  class: "card-note"
}, mc = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", dc, [
        p("span", hc, b(e.node.title), 1),
        e.node.note ? (c(), h("span", fc, b(e.node.note), 1)) : C("", !0)
      ])) : C("", !0),
      D(Cn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, pc = /* @__PURE__ */ K(mc, [["__scopeId", "data-v-67b72d40"]]), gc = (e) => "task_ids" in e, Jo = 1024, vc = Jo * 1024 * 1024, yc = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Jo} MB limit for one file.`;
function wc() {
  return () => {
  };
}
function Ns(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Zo(e = window) {
  if (!Ns(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ns(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ps = "journal.stale-build-reload", kc = 'script[type="module"][src*="/assets/index-"]', ja = (e) => {
  var t;
  return ((t = e.querySelector(kc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function bc(e = document, t = fetch, n = () => Zo(window)) {
  const s = ja(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = ja(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
let rs = "";
function xc(e, t = () => Zo(window)) {
  if (!e) return !1;
  const n = !!rs && rs !== e;
  return rs = e, n && t(), n;
}
const $c = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Mc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ps) === e.message) return !1;
    t.setItem(Ps, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Sc(e = window.sessionStorage) {
  try {
    e.removeItem(Ps);
  } catch {
    return;
  }
}
const _c = 2e3, Ec = 3e4, ze = la({ starting: !1, external: !1, late: !1, offline: !1 }), ua = () => ze.starting, Ac = 3;
let wn = 0, js = 0, Xo = 0, Qo = [];
async function Cc() {
  try {
    const e = await je.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
function Oc() {
  clearInterval(js), clearTimeout(Xo), js = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), Qo.splice(0).forEach((e) => e()), bc();
}
let is = !1;
async function Tc() {
  if (ze.offline = !navigator.onLine, is) return;
  is = !0;
  const e = await Cc();
  if (is = !1, ze.external = e.updating, wn = !e.restarting && !e.updating && e.reachable ? wn + 1 : 0, wn < Ac) return;
  wn = 0, (!xc(e.started_at) || Ns()) && Oc();
}
function qa() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, js = setInterval(Tc, _c), Xo = setTimeout(() => ze.late = !0, Ec));
}
const Ic = () => ze.starting ? new Promise((e) => Qo.push(e)) : Promise.resolve(), Fa = 2e4, Rc = 3e5, Ke = 6e5, kn = 6, Bc = 500, Lc = "/journal/summary", Dc = "/api/server-state", Nc = 5e3, Wa = Kn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Pc = (e) => e.split("?")[0].endsWith(Lc), er = (e, t) => Object.assign(new Error(t), { status: e });
async function jc(e, t, n = er) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const qc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Fc {
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
        body: qc(s),
        signal: AbortSignal.timeout(a || (i ? Rc : Fa))
      });
    } catch (l) {
      if (l instanceof TypeError && qa(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Bc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = kn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : wc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return jc(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Wa, signal: AbortSignal.timeout(Fa) });
    if (!n.ok) throw er(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, kn, o).then((l) => (this.written(n), l));
    if (ua() && !Pc(n))
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
    return fetch(Dc, { cache: "no-store", signal: AbortSignal.timeout(Nc) });
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
const je = new Fc(), Be = (e) => encodeURIComponent(e);
function he(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const jt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), qt = "the page does not know its environment yet", Wc = "X-Journal-Env", Hc = "X-Journal-Request-At", ls = "/viewer/voices/figures/";
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
    return { [Hc]: String(Date.now()), ...this.env() ? { [Wc]: this.env() } : {} };
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
    if (Kn) return Promise.reject(Object.assign(new Error(Nl), { status: 403 }));
    if (s.size > vc) return Promise.reject(new Error(yc(s)));
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
const Ve = new da({ base: Kn ? "/p" : "" }), Uc = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), Ha = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), zc = 6e4, Vc = 4, Gc = 300, Kc = 5e3, tr = /* @__PURE__ */ new Map();
function Jn(e) {
  if (!(e in Ha)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ha[e];
}
function Yc(e) {
  const t = Jn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Kc;
  }
}
const Jc = (e) => e / 2 + Math.random() * e / 2, nr = (e) => [...e.users.values()].pop(), ha = (e) => tr.get(e.place) === e, Zc = () => Math.random() * Gc, fa = () => document.hidden;
function Xc(e) {
  const t = Yc(e);
  return e.failures ? Jc(Math.min(zc, t * 2 ** e.failures)) : Math.max(t, Vc * e.took);
}
function sr(e, t) {
  clearTimeout(e.timer), !(!ha(e) || fa()) && (e.timer = setTimeout(() => Qc(e), t));
}
function Qc(e) {
  return ha(e) ? e.running ? (e.again = !0, e.running) : (e.running = su(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const eu = (e) => {
  var t, n;
  return !fa() && (((n = (t = Jn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && nr(e).active() && !ua();
};
async function tu(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => Jn(e.key).read(nr(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function nu(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Jn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function su(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      eu(e) && nu(e, await tu(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ha(e));
  sr(e, Xc(e));
}
const au = () => fa() || tr.forEach((e) => sr(e, Zc()));
document.addEventListener("visibilitychange", au);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, ar = (e) => `${e.table}:${e.id}`, Ua = (e) => (e || "").split(`
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
}, ou = (e) => (Va[e.table] ? Va[e.table](e) : e.title || "") || "", ru = ["done", "cancelled"], qs = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => ru.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, iu = (e) => qs[e.table] ? qs[e.table](e) : 0, or = (e) => iu(e) > 0, lu = (e) => !!qs[e], bt = (e) => Ee(e.created_at), ma = (e) => Ee(e.updated_at) || bt(e), cu = 60, uu = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - cu, du = (e, t) => e.id > 0 && e.table === t.table && uu(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), pa = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => du(s, n))), hu = { me: 1, people: [] }, ue = la({
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
  people: hu,
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
Wo("journal.activity", () => ue.activity);
Wo("journal.side.mini", () => ue.sideMini);
const fu = 50, rr = 100, mu = { messages: 25 }, He = (e) => mu[e] || fu;
function pu(e, t) {
  if (e !== "messages") return Math.max(t.length - He(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === He(e)) return s;
  return 0;
}
const ht = /* @__PURE__ */ new Set(), ga = B(0), dn = /* @__PURE__ */ new Set(), hn = /* @__PURE__ */ new Set(), rt = /* @__PURE__ */ new Set(), Fs = /* @__PURE__ */ new Set(), gu = /* @__PURE__ */ new Map(), vu = /* @__PURE__ */ new Map();
let Ft = !1, Wt = null;
const yu = (e, t) => e.id - t.id, wu = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, ku = { messages: wu }, ir = (e) => ku[e] || yu;
function lr(e) {
  return ga.value, ht.has(e) || (ht.add(e), ue.booted && (!dn.has(e) || hn.has(e)) && queueMicrotask(() => va([e], !1))), ue.rows[e] || [];
}
function bu(e) {
  const t = ue.rows[e] || [], n = pu(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ue.rows[e] = t.filter((a) => s.has(a) || lu(e) && !or(a)), ue.paging.size[e] = He(e), ue.paging.more[e] = !0;
}
const xu = /* @__PURE__ */ new Set();
function $u() {
  ht.forEach(bu), ht.clear(), gu.clear(), vu.clear(), ga.value += 1;
}
be(() => `${Ze.value.env}/${Ze.value.page}/${Ze.value.open ? Ze.value.open.table : ""}`, $u);
be(
  () => ue.booted,
  (e) => e && va(
    [...ht].filter((t) => !dn.has(t)),
    !1
  )
);
const Ws = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !gc(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function cr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Ws(s) && !Ws(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function ur(e, t) {
  dn.add(e), ga.value += 1;
  const n = ue.rows[e] || [];
  ue.rows[e] = [...cr(n, t.rows), ...pa(n.filter((s) => s.id === 0), t.rows)], ue.paging.size[e] = ue.paging.size[e] || He(e), ue.paging.more[e] = !t.is_last_page;
}
async function Mu(e) {
  const t = new Set((ue.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: He(e) });
  Zn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = pa((ue.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return ur(e, { ...n, rows: [...n.rows, ...a].sort(ir(e)) }), ue.paging.size[e] = He(e), dr.has(e) && await hr(e), ue.rows[e];
}
const Zn = (e, t) => ue.counts = { ...ue.counts, [e]: t };
async function Su(e) {
  const t = ue.rows[e] || [], n = Math.max(0, ...t.map(ma)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: He(e), since: n, after: s });
  if (Zn(e, a.counts), !a.is_last_page) return Mu(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = pa(t.filter((i) => !o.has(i.id)), a.rows).concat(cr(t, a.rows));
  return ue.rows[e] = r.sort(ir(e)), ue.paging.size[e] = ue.rows[e].length, ue.rows[e];
}
const us = /* @__PURE__ */ new Set();
async function _u(e, t = !1) {
  e.forEach((n) => hn.delete(n)), e.forEach((n) => Fs.add(n));
  try {
    await Ru(e, t);
  } finally {
    e.forEach((n) => Fs.delete(n));
  }
}
async function Eu(e) {
  const t = await Ve.list(e, { limit: He(e) });
  Zn(e, t.counts), ur(e, t);
}
async function Au(e) {
  Zn(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const dr = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function hr(e) {
  const t = (ue.rows[e] || []).filter((a) => Ws(a) && (e !== "plans" || !or(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ue.rows[e] = (ue.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Cu = (e, t) => !dn.has(e) || t && (ue.paging.size[e] || He(e)) === He(e) && !xu.has(e);
async function Ou(e, t) {
  if (!ht.has(e)) return Au(e);
  const n = await (Cu(e, t) ? Eu(e) : Su(e));
  return dr.has(e) && await hr(e), n;
}
async function fr() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ue.settings) && (ue.settings = e);
}
async function Tu() {
  const [e] = await Promise.all([Ve.entries(0, rr), fr()]);
  Du([...Yt(pr(), []), ...e]);
}
const Iu = (e, t) => Ou(e, t).then(
  () => null,
  () => e
);
async function Ru(e, t) {
  const n = (await Promise.all(e.map((s) => Iu(s, t)))).filter(Boolean);
  if (n.forEach((s) => (rt.add(s), hn.add(s))), t && await Tu(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const mr = 1e3, Bu = 15e3;
let bn = mr;
async function Lu() {
  return Wt || (Wt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...rt].some((e) => !us.has(e)) || Ft; ) {
      const e = Ft, t = [...e ? Object.keys(ue.rows) : rt].filter((s) => cn[s] && (ht.has(s) || s in ue.rows)).filter((s) => e || !ht.has(s) || hn.has(s) || !dn.has(s)).filter((s) => !us.has(s)), n = [...rt].filter((s) => us.has(s));
      rt.clear(), n.forEach((s) => rt.add(s)), Ft = !1;
      try {
        await _u(t, e), bn = mr;
      } catch {
        Ft = Ft || e, await new Promise((a) => setTimeout(a, bn)), bn = Math.min(bn * 2, Bu);
      }
    }
  })().finally(() => Wt = null), Wt);
}
function va(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Fs.has(n)).forEach((n) => {
    rt.add(n), t && hn.add(n);
  }), rt.delete("settings") && fr(), Lu();
}
const pr = () => {
  var e;
  return `typed-entries:${((e = ue.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function Du(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ue.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-rr), Vn(pr(), ue.entries.slice(-50));
}
Uc((e) => ue.streamOpen || va([e]));
const Hs = [], Nu = 2e3, ot = /* @__PURE__ */ new Map(), Pu = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, ju = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function $t(e, { first: t = !1 } = {}) {
  t ? Hs.unshift(e) : Hs.push(e), ot.clear();
}
function gr(e, t, n) {
  var a;
  const s = lr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const qu = (e) => lr(e.table).find((t) => t.id === e.id) === e.row, Fu = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Wu(e, t) {
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
  return Hu(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Hu(e) {
  return e.split(ju).map((t, n) => n % 2 ? t : t.replace(Pu, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ga(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Uu(e) {
  const [t, , ...n] = e, s = Ga(t).map((o) => `<th>${Jt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Ga(o).map((r) => `<td>${Jt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function zu(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Jt(a)}</li>`).join("")}</${s}>`;
}
const Ka = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function vr(e) {
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
      n.push(Uu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(zu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${vr(
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
const Vu = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Gu = (e) => e.kind !== "text" && !Vu.test(e.html);
function Ku(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(vr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Gu(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Us(e, t = { env: "" }) {
  const n = Fu(e, t), s = ot.get(n);
  if (ot.delete(n), s && s.reads.every(qu))
    return ot.set(n, s), s.html;
  const a = [], o = Ku(Wu(e, { ...t, reads: a }));
  return ot.set(n, { html: o, reads: a }), ot.size > Nu && ot.delete(ot.keys().next().value), o;
}
const yr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Zt = (e) => String(e || "").replace(yr, (t, n, s, a) => a), Yu = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), xn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Ju = /^Traceback \(most recent call last\):/m, Zu = 8;
function wr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Zu).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Xu(e) {
  const t = [...e.matchAll(Yu)].map((s) => s.index);
  if (xn.lastIndex = 0, !t.length || !xn.test(e)) return null;
  xn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(xn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: wr(n), tail: "" } : null;
}
function Qu(e) {
  const t = Ju.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: wr([o]), tail: n.slice(a).join(`
`) };
}
$t((e) => {
  const t = Zt(e), n = Qu(t) || Xu(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const ed = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, td = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, nd = /[\w\]]\(/, sd = /^[\w$.[\]'"]+\s*=\s*[^=]/, ad = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, od = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, rd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, id = /[[({,]$/, ld = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, cd = /^(\t|\s{2,})\S/, ud = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*\/?|<!--)/, dd = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, hd = /[{}()[\];=<>$&|*\\@+^~%]/g, kr = /^\s*(?:[-*+]|\d+[.)])\s/, fd = /^\s*>/, md = /^\s*\|/, pd = 0.6, gd = 0.4, vd = 5, yd = 0.03, br = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= vd && t.every((n) => dd.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(hd) ?? []).length / e.length < yd;
}, ds = (e) => {
  const t = e.trim();
  return [ed, td, nd, sd, ad, od, rd, id, ld].some((n) => n.test(t)) || /[;{}]$/.test(t) || cd.test(e) && !kr.test(e) && !br(e);
};
function wd(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || kr.test(t[0]) || t.every((o) => fd.test(o) || md.test(o))) return "text";
  const n = t.filter((o) => !ud.test(o.trim()));
  if (t.length === 1) return !n.length || ds(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(ds).length, a = n.filter((o) => !ds(o) && br(o)).length;
  return s >= n.length * pd && a <= n.length * gd ? "code" : "text";
}
const zs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", kd = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", bd = `${zs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, xd = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", $d = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ya = {
  js: { keywords: zs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: kd, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: bd, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: zs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: xd, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: $d, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Md = {
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
function Sd(e, t) {
  const n = Ya[Md[t] ?? t] || Ya.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
function _d(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Sd(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? et(r) : `<span class="tok-${s}">${et(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Ed(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Ad = 1500, Za = /* @__PURE__ */ new WeakMap();
async function Cd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Ed(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Za.get(t)), Za.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Ad)
  )));
}
typeof document < "u" && document.addEventListener("click", Cd, !0);
const Od = /\n\s*\n/, Td = /^(```|~~~)\s*(\w+)?\s*$/, Id = /^\s{4,}\S/, Rd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Vs = /^\s*(?:[-*+]|\d+[.)])\s/, xr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Bd = [
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
function Ld(e) {
  const t = ya(e.join(`
`));
  return (Bd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Dd = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && xr.test(t) && !Vs.test(t);
}, Nd = (e, t) => Vs.test(t) || Vs.test([...e].reverse().find((n) => n.trim()) || "");
function Gs(e, t) {
  const n = t || Ld(e), s = _d(ya(e.join(`
`)), n).map((a) => `<span class="code-line">${a}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${s}</code></pre></div>` };
}
function Pd(e) {
  const t = e.split(Od).map((r) => ({ paragraph: r, kind: wd(ya(r).split(`
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
function jd(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...Pd(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Td);
    if (r) {
      const l = t.findIndex((d, f) => f > o && d.trim().startsWith(r[1])), u = l < 0 ? t.length : l;
      a(), n.push(Gs(t.slice(o + 1, u).map(Zt), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Dd(s) ? Rd : Id;
    if (i.test(t[o]) && !Nd(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && xr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
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
$t((e) => jd(e));
const qd = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Fd = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Wd(e) {
  const t = qd.exec(e);
  if (t && kt(t[1])) return { at: t.index, length: t[0].length, table: kt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Fd.exec(e), s = n && kt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Hd(e, t, n, s) {
  const a = gr(s, e, t), o = Zt(a ? ou(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${et(un(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
$t(
  (e, t) => {
    const n = Wd(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Hd(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ud = /\.(png|jpe?g|gif|webp|svg)$/i, zd = (e) => Ud.test(e), Vd = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Gd = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Kd(e, t) {
  const n = Vd.exec(e), [, s, a, o, r, i] = n || [], l = n && kt(s || o), u = l && gr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = Ve.in(t.env).fileUrl(l, u.id, i), f = `${un(l).title} ${u.id} · ${et(i)}`, g = zd(i) ? `<img class="file-card-image" src="${d}" alt="${et(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(i)}">${g}<span class="file-card-name">${f}</span></a>` };
}
function Yd(e) {
  const t = Gd.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
$t(
  (e, t) => {
    if (t.inline) return null;
    const n = Kd(e, t) || Yd(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Jd = /`([^`\n]+)`/g;
$t((e) => e.replace(Jd, (t, n) => `<code>${n}</code>`));
const Xa = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Gn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
$t(
  (e, t) => e.replace(yr, (n, s, a, o) => Xa[s] ? Xa[s](a, o, t) : o)
);
const Zd = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, $r = new RegExp(`\\b(${Ko}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Mr = new RegExp(`\\b(${Ko}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Xd = new RegExp(`<code>((?:${$r.source}|${Mr.source}))</code>`, "gi"), Qd = (e) => e.replace(Xd, "$1"), eh = (e, t) => `<a class="row-pill" href="#" data-peek="${kt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, th = (e) => e.replace(Mr, (t, n, s) => s.replace(/\d+/g, (a) => eh(n.replace(/s$/i, ""), a))), nh = (e) => th(e).replace(
  $r,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${kt(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
$t(
  (e, t) => t.rowNames === !1 ? e : Qd(e).split(Zd).map((n, s) => s % 2 ? n : nh(n)).join("")
);
const sh = ["innerHTML"], ah = ["innerHTML"], oh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = L(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Us(s, { env: Ze.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(Ct) && z(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, sh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(Ct) && z(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, ah));
  }
}, lt = /* @__PURE__ */ K(oh, [["__scopeId", "data-v-1a43d211"]]), rh = { class: "fact" }, ih = { class: "fact-label" }, lh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", rh, [
      p("span", ih, b(e.label), 1),
      D(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, ch = /* @__PURE__ */ K(lh, [["__scopeId", "data-v-3a88ecf8"]]), uh = { class: "list" }, dh = { class: "list-label" }, hh = {
  key: 1,
  class: "list-note"
}, fh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", uh, [
      (c(!0), h(G, null, se(e.items, (o, r) => (c(), V(xt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: F(() => [
          p("span", dh, b(o.label), 1),
          o.badge ? (c(), V(Yo, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : C("", !0),
          o.note ? (c(), h("span", hh, b(o.note), 1)) : C("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, mh = /* @__PURE__ */ K(fh, [["__scopeId", "data-v-ebe2ae0a"]]), ph = { class: "table" }, gh = {
  key: 0,
  class: "table-row empty"
}, vh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = L(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", ph, [
      p("div", {
        class: "table-row head",
        style: pe(a.value)
      }, [
        (c(!0), h(G, null, se(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, b(i), 1))), 128))
      ], 4),
      (c(!0), h(G, null, se(e.rows, (i, l) => (c(), V(xt(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: Z(["table-row", i.tone, { opens: i.open }]),
        style: pe(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: F(() => [
          (c(!0), h(G, null, se(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", gh, b(e.empty), 1)) : C("", !0)
    ]));
  }
}, yh = /* @__PURE__ */ K(vh, [["__scopeId", "data-v-9326a52e"]]), wh = { class: "stat-value" }, kh = { class: "stat-label" }, bh = {
  key: 0,
  class: "stat-note"
}, xh = {
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
    return (s, a) => (c(), V(xt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: F(() => [
        p("span", wh, b(e.value), 1),
        p("span", kh, b(e.label), 1),
        e.note ? (c(), h("span", bh, b(e.note), 1)) : C("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, $h = /* @__PURE__ */ K(xh, [["__scopeId", "data-v-ad0db6d6"]]), Mh = { class: "code" }, Sh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), V(ln, {
      value: e.node.type
    }, {
      stack: F(() => [
        D(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: F(() => [
        D(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: F(() => [
        D(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: F(() => [
        D(pc, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: F(() => [
        p("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, b(e.node.text), 3)
      ]),
      divider: F(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: F(() => [
        D($h, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: F(() => [
        D(cc, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: F(() => [
        D(yh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: F(() => [
        D(mh, {
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
        D(ch, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: F(() => [
        D(Yo, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: F(() => [
        p("pre", Mh, [
          p("code", null, b(e.node.text), 1)
        ])
      ]),
      file: F(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, b(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Sr = /* @__PURE__ */ K(Sh, [["__scopeId", "data-v-cbdcf540"]]), _h = { class: "dashboard" }, Eh = { class: "trail" }, Ah = ["onClick"], Ch = {
  key: 0,
  class: "gone",
  role: "status"
}, Oh = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (g) => g in (n.document.pages || {}), o = B(!!n.page && !a(n.page)), r = B(n.page && !o.value ? [n.page] : []), i = L(() => r.value.at(-1) || n.document.start), l = L(() => (n.document.pages || {})[i.value] || null), u = (g) => ((n.document.pages || {})[g] || {}).title || g, d = (g) => {
      o.value = !1, r.value = [...r.value, g];
    }, f = (g) => {
      o.value = !1, r.value = r.value.slice(0, g);
    };
    return be(
      () => n.document.start,
      () => r.value = []
    ), (g, v) => (c(), h("div", _h, [
      e.document.broken ? (c(), V(Bn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: F(() => [
          le(b(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), V(Bn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: F(() => [
          le(b(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(G, { key: 2 }, [
        p("nav", Eh, [
          p("button", {
            type: "button",
            class: Z(["step", { current: !r.value.length }]),
            onClick: v[0] || (v[0] = (I) => f(0))
          }, b(u(e.document.start)), 3),
          (c(!0), h(G, null, se(r.value, (I, M) => (c(), h(G, {
            key: `${M}-${I}`
          }, [
            v[2] || (v[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: Z(["step", { current: M === r.value.length - 1 }]),
              onClick: (_) => f(M + 1)
            }, b(u(I)), 11, Ah)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Ch, "What you opened is no longer in this dashboard. Here is its start page.")) : C("", !0),
        D(Bt, {
          name: "page",
          mode: "out-in"
        }, {
          default: F(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              D(Sr, {
                node: l.value.view,
                onOpen: d,
                onFile: v[1] || (v[1] = (I) => s("file", I))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : C("", !0)
    ]));
  }
}, Vk = /* @__PURE__ */ K(Oh, [["__scopeId", "data-v-fbe83734"]]);
function Th(e, t, n, s = () => window) {
  Fe(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ie(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Ih = (e, t = () => !0) => Th("keydown", (n) => n.key === "Escape" && t() && e());
function _r(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = B(!1), a = L(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Ih(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Rh = 80, Et = la([]);
function Er(e) {
  const t = Symbol("layer"), n = () => Et.includes(t) && Et.splice(Et.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !Et.includes(t) && Et.push(t), s || n();
    },
    { immediate: !0 }
  ), Ie(n), L(() => Rh + Math.max(0, Et.indexOf(t)));
}
let Ar = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Ar = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Bh = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Lh(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Bh)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Fe(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : Ar, document.addEventListener("keydown", a), Lt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Dh = ["aria-modal", "aria-label", "aria-labelledby"], Nh = {
  key: 0,
  class: "dialog-head"
}, Ph = ["id", "tabindex"], jh = {
  key: 1,
  class: "dialog-foot"
}, qh = 500, Fh = 400, Wh = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = _r(s, n), i = Er(a), l = B(null), u = B(null), d = B(null), f = No(), g = B(!1), v = Date.now();
    n.modal && Lh(u, () => s("escape"), d);
    function I() {
      if (!n.modal) return n.closable && o();
      g.value = !0, setTimeout(() => g.value = !1, Fh);
    }
    function M(T) {
      !n.modal || Date.now() - v >= qh || ![" ", "Enter"].includes(T.key) || (T.preventDefault(), T.stopPropagation());
    }
    const _ = () => l.value && (l.value.scrollTop = l.value.scrollHeight), x = new MutationObserver(_);
    return be(l, (T) => {
      x.disconnect(), T && n.follow && (x.observe(T, { childList: !0, subtree: !0, characterData: !0 }), _());
    }), Ie(() => x.disconnect()), (T, Y) => (c(), V(ca, { to: "body" }, [
      D(Bt, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: F(() => [
          z(a) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: pe({ zIndex: z(i) }),
            onClick: xe(I, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: g.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(f) : void 0,
              onKeydownCapture: M
            }, [
              e.bare ? C("", !0) : (c(), h("header", Nh, [
                p("h3", {
                  id: z(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, Ph),
                e.closable ? (c(), V(Yn, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : C("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: l,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                me(T.$slots, "default", {}, void 0, !0)
              ], 2),
              T.$slots.foot ? (c(), h("footer", jh, [
                me(T.$slots, "foot", {}, void 0, !0)
              ])) : C("", !0)
            ], 42, Dh)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Hh = /* @__PURE__ */ K(Wh, [["__scopeId", "data-v-6d1ecd98"]]), at = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Uh = 6;
function wa(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const zh = (e) => {
  const t = wa(e, at.lineChars), n = Math.max(at.minWidth, Math.max(...t.map((s) => s.length)) * at.charWidth + at.padX * 2);
  return { name: e, lines: t, line: at.line, padY: at.padY, width: n, height: t.length * at.line + at.padY * 2 };
};
function Vh(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function Gh(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Kh(e, t, n) {
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
  for (let r = 0; r < Uh; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((g) => g[i ? 1 : 0] === f).map((g) => g[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function Yh(e, t) {
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
function Jh(e) {
  const t = [...new Set(e.flatMap(([O, y]) => [O, y]))], n = new Set(e.map(([, O]) => O)), s = t.filter((O) => !n.has(O)), a = Vh(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((O, y) => !a.has(y)), r = Gh(t, o), i = Kh(t, o, r), l = new Map(t.map((O) => [O, zh(O)])), u = i.map((O) => O.reduce((y, $) => y + l.get($).width, 0) + Pe.across * (O.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = Xh(e, r, i.length), g = /* @__PURE__ */ new Map();
  let v = Pe.margin;
  i.forEach((O, y) => {
    let $ = (d - u[y]) / 2;
    const E = Math.max(...O.map((S) => l.get(S).height));
    O.forEach((S) => {
      const w = l.get(S);
      g.set(S, { ...w, x: $, y: v + (E - w.height) / 2 }), $ += w.width + Pe.across;
    }), v += E + (f[y] ?? Pe.down);
  });
  const I = e.map(([O, y, $], E) => ({ from: O, to: y, label: $ || "", back: a.has(E) || r.get(y) <= r.get(O) }));
  Yh(I, g);
  const M = I.map((O) => Qh(O, g.get(O.from), g.get(O.to))), _ = [...g.values()], x = sf(M, _), T = Math.max(v - Pe.down, ...x.filter((O) => O.label).map((O) => O.label.y + O.label.height));
  return { width: Math.max(d - Pe.margin, ...x.filter((O) => O.label).map((O) => O.label.x + O.label.width)) + Pe.margin, height: T + Pe.margin, nodes: _, arrows: x };
}
const Zh = (e) => e ? wa(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function Xh(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += Zh(r) + Pe.labelSpace);
  }), s.map((a) => Math.max(Pe.down, a));
}
function Qh(e, t, n) {
  const s = e.label ? wa(e.label, qe.lineChars) : [], a = s.length ? Math.max(...s.map((g) => g.length)) * qe.charWidth + qe.pad * 2 : 0, o = s.length * qe.line + (s.length ? qe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const ef = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, tf = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], nf = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function sf(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = ef(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = nf.flatMap((l) => tf.map((u) => a(u, l))).find((l) => !n.some((u) => Qa(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => Qa(i, l)); ) i.y += qe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: qe.line, pad: qe.pad } };
  });
}
const Qa = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, af = { class: "flowchart-tools" }, of = ["width", "height", "viewBox", "aria-label"], rf = ["d"], lf = ["x", "y", "width", "height"], cf = ["x", "y"], uf = ["x", "dy"], df = {
  key: 0,
  class: "flowchart-label"
}, hf = ["x", "y", "width", "height"], ff = ["x", "y"], mf = ["x", "dy"], pf = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = L(() => Jh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = B(null), i = B({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var x;
      const M = (x = r.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(M != null && M.width)) return;
      const _ = Math.min(M.width / a.value.width, M.height / a.value.height, 1.5);
      i.value = { zoom: _, x: (M.width - a.value.width * _) / 2, y: (M.height - a.value.height * _) / 2 };
    }
    function d(M, _, x) {
      const { zoom: T, x: Y, y: O } = i.value, y = Math.min(o.most, Math.max(o.least, T * M));
      i.value = { zoom: y, x: _ - (_ - Y) * y / T, y: x - (x - O) * y / T };
    }
    function f(M) {
      const _ = r.value.getBoundingClientRect();
      d(M, _.width / 2, _.height / 2);
    }
    function g(M) {
      const _ = r.value.getBoundingClientRect();
      M.ctrlKey || M.metaKey ? d(M.deltaY < 0 ? o.step : 1 / o.step, M.clientX - _.left, M.clientY - _.top) : i.value = { ...i.value, x: i.value.x - M.deltaX, y: i.value.y - M.deltaY };
    }
    function v(M) {
      var _, x, T;
      M.preventDefault(), (_ = window.getSelection()) == null || _.removeAllRanges(), l = { x: M.clientX - i.value.x, y: M.clientY - i.value.y }, (T = (x = r.value).setPointerCapture) == null || T.call(x, M.pointerId);
    }
    function I(M) {
      l && (i.value = { ...i.value, x: M.clientX - l.x, y: M.clientY - l.y });
    }
    return Fe(u), (M, _) => (c(), V(Hh, {
      title: e.title,
      large: "",
      onClose: _[4] || (_[4] = (x) => s("close"))
    }, {
      default: F(() => [
        p("div", af, [
          D(ve, {
            small: "",
            onClick: _[0] || (_[0] = (x) => f(o.step))
          }, {
            default: F(() => [..._[5] || (_[5] = [
              le("Zoom in", -1)
            ])]),
            _: 1
          }),
          D(ve, {
            small: "",
            onClick: _[1] || (_[1] = (x) => f(1 / o.step))
          }, {
            default: F(() => [..._[6] || (_[6] = [
              le("Zoom out", -1)
            ])]),
            _: 1
          }),
          D(ve, {
            small: "",
            onClick: u
          }, {
            default: F(() => [..._[7] || (_[7] = [
              le("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: xe(g, ["prevent"]),
          onPointerdown: v,
          onPointermove: I,
          onPointerup: _[2] || (_[2] = (x) => Da(l) ? l.value = null : l = null),
          onPointercancel: _[3] || (_[3] = (x) => Da(l) ? l.value = null : l = null)
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
            (c(!0), h(G, null, se(a.value.arrows, (x, T) => (c(), h("path", {
              key: `arrow-${T}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, rf))), 128)),
            (c(!0), h(G, null, se(a.value.nodes, (x) => (c(), h("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, lf),
              p("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (c(!0), h(G, null, se(x.lines, (T, Y) => (c(), h("tspan", {
                  key: Y,
                  x: x.x + x.width / 2,
                  dy: Y ? x.line : 0
                }, b(T), 9, uf))), 128))
              ], 8, cf)
            ]))), 128)),
            (c(!0), h(G, null, se(a.value.arrows, (x, T) => (c(), h(G, {
              key: `label-${T}`
            }, [
              x.label ? (c(), h("g", df, [
                p("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, hf),
                p("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (c(!0), h(G, null, se(x.label.lines, (Y, O) => (c(), h("tspan", {
                    key: O,
                    x: x.label.x + x.label.width / 2,
                    dy: O ? x.label.line : 0
                  }, b(Y), 9, mf))), 128))
                ], 8, ff)
              ])) : C("", !0)
            ], 64))), 128))
          ], 12, of))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, gf = /* @__PURE__ */ K(pf, [["__scopeId", "data-v-51d24cfe"]]), eo = {
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
}, vf = ["innerHTML"], yf = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = L(() => eo[t.name] || eo.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, vf));
  }
}, nt = /* @__PURE__ */ K(yf, [["__scopeId", "data-v-beb5935c"]]), wf = {
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
}, Xt = /* @__PURE__ */ K(wf, [["__scopeId", "data-v-d03899bb"]]), kf = ["data-tip", "aria-label"], bf = {
  key: 0,
  class: "mact-word"
}, xf = {
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
      e.open ? (c(), h("span", bf, b(e.label), 1)) : C("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, kf));
  }
}, Cr = /* @__PURE__ */ K(xf, [["__scopeId", "data-v-3b292e09"]]), $f = 120, hs = 280, Mf = 160, Sf = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, _f = ["leaving", "resizing", "entering"];
function Or(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Ef(e) {
  const t = _f.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = Or(e);
  return e.classList.add(...t), n;
}
function Tr(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = B(t()), a = B("");
  let o = 0;
  const r = (u, d) => Object.assign(u.style, { width: `${d.width}px`, height: `${d.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const d = e.value, f = ++o;
    if (!d || !d.offsetWidth || Sf()) {
      s.value = u;
      return;
    }
    const g = Or(d);
    if (r(d, g), a.value = "leaving", await n($f), f !== o) return;
    s.value = u, a.value = "resizing", await Lt(), i(d);
    const v = Ef(d);
    r(d, g), d.offsetWidth, d.style.transition = `width ${hs}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${hs}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(d, v), await n(hs), f === o && (i(d), a.value = "entering", await n(Mf), f === o && (a.value = ""));
  }
  return be(t, (u) => l(u)), Dt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Af = { class: "growing-card-top" }, Cf = ["aria-expanded"], Of = { class: "growing-card-avatar" }, Tf = { class: "growing-card-title" }, If = { class: "growing-card-more" }, Rf = { class: "growing-card-body" }, Bf = {
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
    const n = e, s = t, a = B(!1), o = B(null), { folded: r, phase: i } = Tr(o, () => !a.value), l = L(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = L(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", z(i), { open: !z(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Af, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (g) => a.value = !a.value)
        }, [
          p("span", Of, [
            e.bad ? (c(), V(nt, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(G, { key: 1 }, [
              le(b(l.value), 1)
            ], 64)) : (c(), V(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Tf, b(e.title), 1),
          D(Xt, { open: a.value }, null, 8, ["open"])
        ], 8, Cf),
        e.action ? (c(), V(Cr, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (g) => s("act"))
        }, null, 8, ["label", "open"])) : C("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (g) => s("comment"))
        }, [
          D(ye, {
            name: "bubble",
            size: 13
          })
        ])) : C("", !0)
      ]),
      p("div", If, [
        p("div", Rf, [
          (c(!0), h(G, null, se(u.value, (g, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, b(g), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Lf = /* @__PURE__ */ K(Bf, [["__scopeId", "data-v-08411e3a"]]), Df = ["title", "aria-label"], Nf = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Pf = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, jf = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = L(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: Z(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", Nf, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", Pf)) : C("", !0)
      ]))
    ], 10, Df));
  }
}, qf = /* @__PURE__ */ K(jf, [["__scopeId", "data-v-6dc92808"]]);
function Ff(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Wf(e, t = Date.now()) {
  const n = Ff(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
function Ir(e) {
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
function Hf(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${fs(t % 60)}s` : `${Math.floor(t / 3600)}h ${fs(Math.floor(t % 3600 / 60))}m ${fs(t % 60)}s`;
}
const Uf = "img,pre,table";
function zf(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Vf(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Gf(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Uf)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = zf(Vf(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Kf(e, t) {
  let n = null;
  const s = () => e.value && Gf(e.value);
  Fe(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const Yf = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Jf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Zf = ["data-incoming", "data-ref"], Xf = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Qf = { class: "message-body" }, e1 = ["title"], t1 = ["innerHTML"], n1 = ["title"], s1 = ["innerHTML"], a1 = {
  class: "message-faces",
  "data-message-faces": ""
}, o1 = ["title", "data-face", "onClick"], r1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, i1 = ["title", "data-reaction", "onClick"], l1 = {
  key: 0,
  class: "message-reaction-count"
}, c1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, u1 = ["href", "title"], d1 = ["src", "alt"], h1 = ["href"], f1 = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, m1 = {
  key: 1,
  "data-message-links-rows": ""
}, p1 = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, g1 = ["data-sent-worker", "title", "onClick"], v1 = { class: "message-foot" }, y1 = { class: "message-time" }, w1 = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, k1 = 140, b1 = 2, x1 = 1500, $1 = "An earlier message", M1 = "about", S1 = "sent_to", _1 = 3, E1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var de;
    const n = e, s = t, a = B(!1), o = B(null), r = L(() => ["user", "comment"].includes(n.message.type)), i = L(() => {
      const [Q, ee] = (n.message.commented_row || ":").split(":"), J = kt(Q);
      return J ? { ref: `${J}:${ee}`, label: `${un(J).title.toLowerCase()} ${ee}` } : null;
    }), l = L(() => n.message.worker_id ?? null), u = B(!1), d = L(() => l.value !== null && ((n.message.text ?? "").length > k1 || (n.message.text ?? "").split(`
`).filter((Q) => Q.trim()).length > b1)), f = L(() => r.value && !n.message.read_at && !n.message.local);
    async function g() {
      var Q;
      await ((Q = navigator.clipboard) == null ? void 0 : Q.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, x1);
    }
    const v = L(() => Us(n.message.text ?? "", { env: "" })), I = L(() => JSON.parse(n.message.flowchart_edges || "[]")), M = B(!1), _ = L(() => Us(n.quote || $1, { env: "" }));
    function x() {
      const Q = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Q ? Q.scrollIntoView({ block: "center", behavior: "smooth" }) : Xe(`messages:${n.message.parent_id}`);
    }
    Kf(o, () => `${n.message.text} ${n.quote}`);
    const T = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, Y = (Q) => `/api/files/message/${n.message.id}/${encodeURIComponent(Q)}`, O = L(() => JSON.parse(n.message.captions || "{}")), y = L(() => (n.message.files ?? []).map((Q) => ({ name: Q, address: Y(Q), isImage: T.test(Q), title: O.value[Q] || Q }))), $ = L(() => Ir(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Oe(Re, null), S = B([]), w = B([]), A = B(!1), k = L(() => `Linked: ${S.value.join(", ")}`), m = L(() => S.value.length >= _1), N = L(() => `${S.value.length} linked ${S.value.every((Q) => Q.startsWith("task ")) ? "tasks" : "rows"}`);
    async function P() {
      if (!r.value || !(E != null && E.read) || n.message.local) return;
      const Q = await E.read(`link list --source message:${n.message.id}`);
      if (!Q.ok) return;
      const ee = Q.value.rows ?? Q.value ?? [];
      S.value = ee.filter((J) => J.link_type === M1).map((J) => `${J.target_model} ${J.target_id}`), w.value = ee.filter((J) => J.link_type === S1).map((J) => J.target_id);
    }
    P(), (de = E == null ? void 0 : E.follow) == null || de.call(E, ["link.*"], P);
    const W = B(!1), re = L(() => Jf(n.message.reactions));
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
      D(Lf, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (J) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Zf)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", Qf, [
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
            D(ye, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + b(i.value.label), 1)
          ], 8, e1)) : C("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(x, ["stop"]),
            innerHTML: _.value
          }, null, 8, t1)) : C("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: ee[2] || (ee[2] = xe((J) => z(Xe)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + b(l.value), 9, n1)) : C("", !0),
          p("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: v.value
          }, null, 10, s1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ee[3] || (ee[3] = xe((J) => u.value = !u.value, ["stop"]))
          }, b(u.value ? "Show less" : "Show more"), 1)) : C("", !0),
          I.value.length ? (c(), h(G, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[4] || (ee[4] = (J) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (c(), V(gf, {
              key: 0,
              title: e.message.text,
              edges: I.value,
              onClose: ee[5] || (ee[5] = (J) => M.value = !1)
            }, null, 8, ["title", "edges"])) : C("", !0)
          ], 64)) : C("", !0)
        ], 2),
        p("div", {
          class: Z(["message-tools", { picking: W.value }]),
          "data-message-tools": ""
        }, [
          W.value ? (c(), h(G, { key: 0 }, [
            p("div", a1, [
              (c(!0), h(G, null, se(z(Yf), (J) => (c(), h("button", {
                key: J,
                type: "button",
                class: "message-face",
                title: `React ${J}`,
                "data-face": J,
                onClick: (Le) => ce(J)
              }, b(J), 9, o1))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[7] || (ee[7] = (J) => W.value = !1)
            }, [
              D(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(G, { key: 1 }, [
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
              onClick: g
            }, b(a.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ee[10] || (ee[10] = (J) => s("delete", e.message))
            }, "Delete")) : C("", !0)
          ], 64))
        ], 2)
      ]),
      re.value.length ? (c(), h("div", r1, [
        (c(!0), h(G, null, se(re.value, (J) => (c(), h("button", {
          key: J.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: J.mine }]),
          title: J.title,
          "data-reaction": J.emoji,
          onClick: (Le) => s("react", e.message, J.emoji)
        }, [
          le(b(J.emoji) + " ", 1),
          J.count > 1 ? (c(), h("span", l1, b(J.count), 1)) : C("", !0)
        ], 10, i1))), 128))
      ])) : C("", !0),
      y.value.length ? (c(), h("div", c1, [
        (c(!0), h(G, null, se(y.value, (J) => (c(), h(G, {
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
            }, null, 8, d1)
          ], 8, u1)) : (c(), h("a", {
            key: 1,
            href: J.address,
            target: "_blank",
            class: "message-file"
          }, b(J.name), 9, h1))
        ], 64))), 128))
      ])) : C("", !0),
      S.value.length ? (c(), h("div", f1, [
        D(nt, {
          class: "message-links-icon",
          name: "linked"
        }),
        m.value && !A.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: ee[11] || (ee[11] = (J) => A.value = !0)
        }, b(N.value), 1)) : (c(), h("span", m1, [
          D(lt, {
            text: k.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : C("", !0),
      w.value.length ? (c(), h("div", p1, [
        D(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(G, null, se(w.value, (J) => (c(), h("button", {
          key: J,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": J,
          title: `Open worker ${J}`,
          onClick: xe((Le) => z(Xe)(`agents:${J}`), ["stop"])
        }, "Also sent to worker " + b(J), 9, g1))), 128))
      ])) : C("", !0),
      p("div", v1, [
        p("time", y1, b($.value), 1),
        Number.isInteger(e.message.id) ? (c(), h("span", w1, "message " + b(e.message.id), 1)) : C("", !0),
        r.value ? (c(), V(qf, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : C("", !0)
      ])
    ], 8, Xf));
  }
}, Gk = /* @__PURE__ */ K(E1, [["__scopeId", "data-v-817edd99"]]), A1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = ji("SkeletonParts", !0);
      return c(!0), h(G, null, se(e.parts, (l, u) => (c(), h(G, { key: u }, [
        (c(!0), h(G, null, se(l.count, (d) => (c(), V(ln, {
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
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: F(() => [
            p("div", {
              class: "skeleton-stack",
              style: pe(s(l))
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
              style: pe(s(l))
            }, [
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: F(() => [
            p("div", {
              class: "skeleton-grid",
              style: pe(a(l))
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
}), C1 = /* @__PURE__ */ K(A1, [["__scopeId", "data-v-576c95e1"]]), O1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, T1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", O1, [
      D(C1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Rr = /* @__PURE__ */ K(T1, [["__scopeId", "data-v-52f66b64"]]), Nn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ms = 200, Br = (e) => {
  var t;
  return ((t = Nn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Nn[0].key;
}, Kk = (e) => {
  var t;
  return ((t = Nn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, I1 = ["aria-label"], R1 = 300, no = 400, B1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ms } },
  setup(e) {
    const t = e, n = L(() => Br(t.value)), s = L(() => n.value < ms ? [1, 0.25, 0.25] : n.value === ms ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= no, high: n.value >= R1 && n.value < no }]),
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
    ], 10, I1));
  }
}, Yk = /* @__PURE__ */ K(B1, [["__scopeId", "data-v-b10e610f"]]), L1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, so = (e) => L1[e.card.state] || "idle", D1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), ao = { working: 0, waiting: 1, idle: 2, stopped: 3 }, oo = (e, t) => ao[so(e)] - ao[so(t)], ro = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, Jk = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => oo(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || D1(s, a)) : [...e].sort((s, a) => oo(s, a) || (ro[t] || ro.state)(s, a)), N1 = ["aria-checked", "aria-haspopup", "onClick"], P1 = {
  key: 0,
  class: "segmented-dot"
}, j1 = {
  key: 1,
  class: "segmented-count"
}, q1 = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = No();
    return (a, o) => {
      const r = qi("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(G, null, se(e.options, (i) => dt((c(), h("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Z(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), h("span", P1)) : C("", !0),
          le(" " + b(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", j1, b(i.count), 1)) : C("", !0)
        ], 10, N1)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Lr = /* @__PURE__ */ K(q1, [["__scopeId", "data-v-ca953072"]]), F1 = { class: "form-field" }, W1 = { class: "form-field-head" }, H1 = ["for"], U1 = {
  key: 0,
  class: "form-field-aside"
}, z1 = {
  key: 0,
  class: "form-field-help"
}, V1 = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", F1, [
      p("div", W1, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, b(e.label), 9, H1),
        t.$slots.aside ? (c(), h("span", U1, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", z1, b(e.help), 1)) : C("", !0)
    ]));
  }
}, Zk = /* @__PURE__ */ K(V1, [["__scopeId", "data-v-dd7cdcff"]]), G1 = { class: "list-row" }, K1 = {
  key: 0,
  class: "list-row-kind"
}, Y1 = { class: "list-row-main" }, J1 = {
  key: 0,
  class: "list-row-title"
}, Z1 = { class: "list-row-body" }, X1 = {
  key: 1,
  class: "list-row-end"
}, Q1 = {
  key: 1,
  class: "list-row-text"
}, em = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", G1, [
      e.kind ? (c(), h("span", K1, b(e.kind), 1)) : C("", !0),
      p("div", Y1, [
        e.title ? (c(), h("span", J1, b(e.title), 1)) : C("", !0),
        p("div", Z1, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", X1, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (c(), h("span", Q1, b(e.text), 1)) : C("", !0)
    ]));
  }
}, Xk = /* @__PURE__ */ K(em, [["__scopeId", "data-v-63155fba"]]), tm = {
  claude: [
    { key: "haiku", label: "haiku", note: "fast, for mechanical work" },
    { key: "sonnet", label: "sonnet", note: "careful work without invention" },
    { key: "opus", label: "opus", note: "judgement" }
  ],
  codex: [
    { key: "gpt-6.1-sol", label: "gpt-6.1-sol", note: "the workhorse for coding, Codex's default" },
    { key: "gpt-6-astra", label: "gpt-6-astra", note: "frontier, for the most demanding work" },
    { key: "gpt-6-luna", label: "gpt-6-luna", note: "fast and affordable, for easier tasks" },
    { key: "gpt-5.6-sol", label: "gpt-5.6-sol", note: "the older workhorse" },
    { key: "gpt-5.6-terra", label: "gpt-5.6-terra", note: "older and balanced" },
    { key: "gpt-5.6-luna", label: "gpt-5.6-luna", note: "older and fast" }
  ]
}, nm = { claude: "Claude Code", codex: "Codex" }, sm = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, am = {
  key: 1,
  class: "menu-item-text"
}, om = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", sm, b(e.checked ? "✓" : ""), 1)) : C("", !0),
      e.description ? (c(), h("span", am, [
        p("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, b(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, It = /* @__PURE__ */ K(om, [["__scopeId", "data-v-fec99974"]]), rm = (e, t, n) => Math.max(t, Math.min(n, e)), im = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Dr = /* @__PURE__ */ new WeakMap(), lm = (e, t) => Dr.set(e, t);
function cm(e, t) {
  for (let n = t; n; n = Dr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function um(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !cm(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const At = 8, dm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = B(null), o = (m) => m ? `${m}px` : void 0, r = L(() => ({
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
      const N = m.closest(".pane, .float-window");
      return N ? d(N.getBoundingClientRect()) : u();
    }, g = (m, N) => `${Math.max(0, m ? Math.min(m, N) : N)}px`;
    function v(m, N) {
      return {
        below: m.bottom - N.bottom - s.gap - At,
        above: N.top - m.top - s.gap - At,
        across: m.right - m.left - 2 * At
      };
    }
    function I(m) {
      const N = f(s.anchor), P = v(N, m);
      return i.value.w <= P.across && i.value.h <= Math.max(P.below, P.above) ? N : u();
    }
    const M = L(() => {
      if (!l.value) return r.value;
      const m = l.value, N = I(m), P = v(N, m), { w: W, h: re } = i.value, ce = s.align === "auto" ? m.left + m.right > N.left + N.right : s.align === "right", de = rm(ce ? m.right - W : m.left, N.left + At, Math.max(N.left + At, N.right - W - At)), ee = re > P.below && P.above > P.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: g(s.maxHeight, P.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: g(s.maxHeight, P.below) };
      return { ...r.value, ...ee, left: `${de}px`, maxWidth: g(s.maxWidth, P.across) };
    }), _ = n, x = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function T(m) {
      const N = x(), P = N.indexOf(document.activeElement);
      N[(P + m + N.length) % N.length].focus();
    }
    const Y = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => _("close") }, O = (m) => Y[m.key] && (m.preventDefault(), Y[m.key]()), y = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let $ = 0;
    const E = new ResizeObserver(() => {
      cancelAnimationFrame($), $ = requestAnimationFrame(y);
    });
    um(a, (m) => s.anchor && !s.anchor.contains(m.target) && _("close"));
    const S = (m, N) => ["top", "left", "right", "bottom"].some((P) => Math.abs(m[P] - N[P]) > 1), w = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let A = 0;
    function k() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || w(m)) return _("close");
        S(m, l.value) && (l.value = m);
      }
      A = requestAnimationFrame(k);
    }
    return Fe(() => {
      s.anchor && a.value && lm(a.value, s.anchor), y(), a.value && E.observe(a.value), !s.plain && x()[0] && x()[0].focus(), k();
    }), Ie(() => {
      E.disconnect(), cancelAnimationFrame(A), cancelAnimationFrame($);
    }), t({ element: a }), (m, N) => (c(), V(ca, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", tt({
        ref_key: "panel",
        ref: a
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: O
      }), [
        me(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ka = /* @__PURE__ */ K(dm, [["__scopeId", "data-v-3d203970"]]), hm = ["aria-expanded"], fm = { class: "drop-label" }, mm = ["value"], pm = {
  key: 1,
  class: "drop-lead"
}, gm = { class: "drop-item-text" }, vm = {
  key: 2,
  class: "drop-note"
}, ym = {
  key: 1,
  class: "drop-none"
}, wm = {
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
    const n = e, s = t, a = B(!1), o = B(null), r = B(""), i = L(() => {
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
        e.icon ? (c(), V(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : C("", !0),
        p("span", fm, b(e.label), 1),
        D(ye, {
          name: "down",
          size: 11
        })
      ], 10, hm),
      a.value ? (c(), V(ka, {
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
          }, null, 40, mm)) : C("", !0),
          (c(!0), h(G, null, se(i.value, (f) => (c(), V(It, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (g) => l(f)
          }, {
            default: F(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : C("", !0),
              f.lead ? (c(), h("span", pm, b(f.lead), 1)) : C("", !0),
              p("span", gm, b(f.label), 1),
              f.note ? (c(), h("span", vm, b(f.note), 1)) : C("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? C("", !0) : (c(), h("p", ym, b(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, km = /* @__PURE__ */ K(wm, [["__scopeId", "data-v-29dfcce5"]]), Qk = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = L(() => [
      ...tm[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = L(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (r, i) => (c(), V(km, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${z(nm)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, bm = ["aria-label"], xm = { class: "head" }, $m = { class: "names" }, Mm = { class: "body" }, Sm = {
  key: 0,
  class: "foot"
}, _m = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = _r(s, n), i = Er(a);
    return (l, u) => (c(), V(ca, { to: "body" }, [
      D(Bt, {
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
              e.title ? (c(), h(G, { key: 0 }, [
                p("header", xm, [
                  p("div", $m, [
                    p("h2", null, b(e.title), 1),
                    e.abstract ? (c(), V(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : C("", !0)
                  ]),
                  me(l.$slots, "actions", {}, void 0, !0),
                  D(Yn, {
                    title: e.closeLabel,
                    onClick: z(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                p("div", Mm, [
                  me(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", Sm, [
                  me(l.$slots, "foot", {}, void 0, !0)
                ])) : C("", !0)
              ], 64)) : me(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, bm)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, eb = /* @__PURE__ */ K(_m, [["__scopeId", "data-v-c9a3f43a"]]), Ks = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Em = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Hn(), n = L(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => dt((c(), h("textarea", tt({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [z(Ks), z(t).value]
    ]);
  }
}), tb = /* @__PURE__ */ K(Em, [["__scopeId", "data-v-e130a5b9"]]), Am = {
  key: 1,
  class: "text-field-label"
}, Cm = {
  key: 2,
  class: "text-field-end"
}, Om = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ls({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Bs(e, "modelValue"), s = Hn(), a = "onUpdate:modelValue" in (((d = Fi()) == null ? void 0 : d.vnode.props) || {}), o = L(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = L(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = L(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = B(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, g) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, z(s).class]),
      style: pe(z(s).style)
    }, [
      e.icon ? (c(), V(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : C("", !0),
      e.label ? (c(), h("span", Am, b(e.label), 1)) : C("", !0),
      dt(p("input", tt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(Ks), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Cm, [
        me(f.$slots, "end", {}, void 0, !0)
      ])) : C("", !0)
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
}), nb = /* @__PURE__ */ K(Om, [["__scopeId", "data-v-d9c38ca8"]]), Tm = 150;
function Nr(e, t, n = Tm, s = performance.now()) {
  const a = e + n - s;
  if (a <= 0) return void t();
  setTimeout(t, a);
}
const io = (e) => e.page * e.size < e.total;
function Im(e, t, { incremental: n = !1 } = {}) {
  const s = zn(), a = B([]), o = B(""), r = B(!1), i = performance.now(), l = B(!1), u = B(""), d = B(null);
  async function f(x) {
    const T = await s.read(`${e} --before-id ${x + 1} --limit 1`);
    if (!T.ok) return M();
    const Y = T.value.rows.find((O) => O.id === x);
    a.value = Y ? a.value.map((O) => O.id === x ? Y : O) : a.value.filter((O) => O.id !== x);
  }
  async function g(x) {
    if (n && String((x == null ? void 0 : x.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter(($) => $.id !== x.row_id));
    if (n && (x != null && x.row_id) && !String(x.event ?? "").endsWith(".create") && a.value.some(($) => $.id === x.row_id)) return f(x.row_id);
    if (!(n && a.value.length && String((x == null ? void 0 : x.event) ?? "").endsWith(".create"))) return M();
    const Y = Math.max(...a.value.map(($) => $.id)), O = await s.read(`${e} --after-id ${Y}`);
    if (!O.ok) return M();
    const y = new Set(a.value.map(($) => $.id));
    a.value = [...O.value.rows.filter(($) => !y.has($.id)), ...a.value];
  }
  async function v() {
    if (!a.value.length) return !1;
    const x = Math.min(...a.value.map((O) => O.id)), T = await s.read(`${e} --before-id ${x}`);
    if (!T.ok || !T.value.rows.length) return l.value = !1;
    l.value = io(T.value);
    const Y = new Set(a.value.map((O) => O.id));
    return a.value = [...a.value, ...T.value.rows.filter((O) => !Y.has(O.id))], !0;
  }
  let I = 0;
  async function M() {
    const x = ++I, T = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (x !== I) return;
    const Y = T.ok ? s.shared ? [T.value] : T.value.rows : [], O = Y.length ? Math.min(...Y.map((y) => y.id)) : 0;
    a.value = n && T.ok && O ? [...a.value.filter((y) => y.id > Math.max(...Y.map(($) => $.id))), ...Y, ...a.value.filter((y) => y.id < O)] : Y, T.ok && !a.value.some((y) => y.id < O) && (l.value = !s.shared && io(T.value)), o.value = T.ok ? "" : T.error, Nr(i, () => r.value = !0);
  }
  async function _(x, T = null) {
    const Y = a.value;
    T && (a.value = T(Y));
    const O = await s.run(x);
    return T && !O.ok && (a.value = Y), u.value = O.ok ? "" : O.error, d.value = O.ok ? O.value : null, await M(), O;
  }
  return s.follow(t, g), M(), { rows: a, failure: o, loaded: r, more: l, load: M, older: v, act: _, actionFailure: u, answer: d, context: s };
}
const Rm = { class: "title" }, Bm = { class: "state" }, Lm = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Im(t.line, t.events);
    return (o, r) => (c(), V(Wl, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: F(({ row: i }) => [
        p("span", Rm, b(i.title), 1),
        p("span", Bm, b(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, sb = /* @__PURE__ */ K(Lm, [["__scopeId", "data-v-a69084cd"]]);
function Dm(e = 1e3, t = null) {
  const n = B(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? be(t, a, { immediate: !0 }) : a(!0), Ie(() => clearInterval(s)), n;
}
const ps = B(Date.now() / 1e3);
let lo = 0, $n = 0;
function Nm() {
  return $n || (ps.value = Date.now() / 1e3, lo = setInterval(() => ps.value = Date.now() / 1e3, 1e3)), $n += 1, Po() && jo(() => {
    $n -= 1, $n || clearInterval(lo);
  }), ps;
}
const Pm = ["title", "data-figure-mark", "data-folded", "data-open"], jm = {
  key: 2,
  class: "worker"
}, qm = { class: "head" }, Fm = { key: 0 }, Wm = {
  key: 3,
  class: "status"
}, Hm = {
  key: 0,
  class: "figure"
}, Um = {
  key: 1,
  class: "ran-for"
}, zm = { key: 2 }, Vm = {
  key: 3,
  class: "news"
}, Gm = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Km = {
  key: 6,
  class: "settled"
}, Ym = {
  key: 1,
  class: "bar"
}, Jm = {
  key: 3,
  class: "detail body"
}, Zm = {
  key: 0,
  class: "body-label"
}, Xm = ["title"], Qm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Hn(), s = ["onClick", "onAct"], a = L(() => Object.fromEntries(Object.entries(n).filter(([Q]) => !s.includes(Q)))), o = B(!1), r = L(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = L(() => t.open !== void 0), l = L(() => i.value || r.value), u = L(() => i.value ? t.open : o.value), d = L(() => i.value ? !t.open : r.value && !o.value), f = L(() => !!(t.mark.action && n.onAct)), g = L(() => l.value || f.value || !!n.onClick), v = B(null), I = B(null), { folded: M, phase: _ } = Tr(v, () => d.value);
    function x(Q) {
      var ee, J;
      if (!(Q.target !== v.value && !I.value.contains(Q.target))) {
        if (i.value) return (ee = n.onClick) == null ? void 0 : ee.call(n, Q);
        if (r.value) return void (o.value = !o.value);
        (J = n.onAct || n.onClick) == null || J(Q);
      }
    }
    const T = (Q) => n.onAct(Q), Y = ["failed", "unfinished"], O = L(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Y.includes(t.mark.state) ? "danger" : "good" : ""), y = L(() => t.mark.color ? t.mark.color : O.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : O.value ? `var(--tone-${O.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), $ = L(() => y.value || "var(--tone-work)"), E = L(() => !t.mark.ending && !t.mark.ended && O.value !== "stopped"), S = Nm(), w = L(
      () => t.mark.began_at && E.value && !t.mark.figure && !t.mark.counting ? Hf(S.value - t.mark.began_at) : ""
    ), A = L(() => {
      const { started: Q, ended: ee } = t.mark;
      return Q ? ee ? `ran ${to(ee - Q, !0)}` : to(S.value - Q, !0) : w.value;
    }), k = ["bad", "danger", "warn"], m = L(() => k.includes(O.value) || t.mark.asks ? "attention" : E.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), N = ["bad", "danger"], P = L(() => N.includes(O.value)), W = L(() => m.value === "process" ? "running" : P.value ? "cross" : O.value === "stopped" ? "stopped" : O.value === "good" ? "tick" : ""), re = L(
      () => !!(t.mark.figure || A.value || t.mark.docked || t.mark.stopping || W.value || t.mark.settled || t.mark.news)
    ), ce = L(() => [t.mark.title, t.mark.time ? Ir(t.mark.time) : ""].filter(Boolean).join(" · ")), de = L(() => ({
      ...y.value ? { "--mark": y.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (Q, ee) => (c(), h("div", tt(a.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${m.value}`,
        z(_),
        {
          open: u.value,
          folding: i.value && d.value,
          live: g.value,
          failed: P.value,
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
      onClick: x
    }), [
      (c(), V(xt(g.value ? "button" : "span"), {
        ref_key: "top",
        ref: I,
        class: "top",
        type: g.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: F(() => [
          e.mark.markIcon ? (c(), V(nt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), V(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", jm, b(e.mark.worker), 1)) : C("", !0),
          p("span", qm, [
            D(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Fm, b(e.mark.name), 1)) : C("", !0),
            l.value ? (c(), V(Xt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          re.value ? (c(), h("span", Wm, [
            e.mark.figure ? (c(), h("span", Hm, b(e.mark.figure), 1)) : C("", !0),
            A.value ? (c(), h("span", Um, b(A.value), 1)) : C("", !0),
            e.mark.stopping ? (c(), h("span", zm, "Stopping")) : C("", !0),
            e.mark.news ? (c(), h("span", Vm, b(e.mark.news), 1)) : C("", !0),
            W.value === "running" ? (c(), h("span", Gm)) : W.value ? (c(), V(nt, {
              key: 5,
              class: Z(["sign", W.value]),
              name: W.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (c(), h("span", Km, b(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), V(Cr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: xe(T, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && E.value ? (c(), h("span", Ym, [
        p("span", {
          class: "progress",
          style: pe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: $.value })
        }, null, 4)
      ])) : C("", !0),
      e.mark.detail && !z(M) ? (c(), V(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      e.mark.body && !z(M) ? (c(), h("div", Jm, [
        e.mark.bodyLabel ? (c(), h("p", Zm, b(e.mark.bodyLabel), 1)) : C("", !0),
        D(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : C("", !0),
      e.mark.command && !z(M) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, Xm)) : C("", !0),
      e.mark.card ? (c(), V(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      me(Q.$slots, "default", {
        shown: !z(M)
      }, void 0, !0)
    ], 16, Pm));
  }
}), Pr = /* @__PURE__ */ K(Qm, [["__scopeId", "data-v-74d78abb"]]), ep = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function jr(e) {
  var n;
  const t = ep[e] || ((n = un(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const tp = (e) => jr(String(e).split(":")[0]), qr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), np = { passed: "good", failed: "danger", warned: "warn", running: "" }, sp = { good: "good", warn: "warn", danger: "danger" }, co = {
  "open row": (e) => Xe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Rl(e.target_model, e.target_id || 0)
}, ap = { "open row": (e) => tp(e.target_model), "open page": () => jr("pages") };
function op(e, t) {
  const n = t || {}, s = co[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? np[e.outcome] || "" : sp[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? ap[s](e) : "",
    handlers: s ? { onAct: () => co[s](e) } : {}
  };
}
const rp = 24, ip = 1e3, uo = 2e3, lp = 0.25, cp = 5e3;
function up(e, t = rp, n = () => !0) {
  const s = B(!1), a = B(0), o = B(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const O = u();
    return O ? O.scrollHeight - O.scrollTop - O.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function g(O) {
    if (clearTimeout(r), !O) {
      o.value = !1, l = Date.now();
      return;
    }
    const y = Date.now() - l < uo ? uo : ip;
    r = setTimeout(() => o.value = s.value, y);
  }
  function v() {
    clearTimeout(i), s.value = !1, a.value = 0, g(!1);
  }
  function I(O = !1) {
    const y = u();
    y && O && y.scrollTo ? y.scrollTo({ top: y.scrollHeight, behavior: "smooth" }) : y && (y.scrollTop = y.scrollHeight), v();
  }
  function M() {
    x(), !s.value && (s.value = !0, g(!0));
  }
  const _ = () => !!u() && d() <= u().clientHeight * lp;
  function x() {
    clearTimeout(i), _() && (i = setTimeout(() => s.value && _() && n() && I(!0), cp));
  }
  function T() {
    f() ? v() : M();
  }
  function Y(O = 1, y = !1) {
    s.value ? a.value += Math.max(0, O) : I(y);
  }
  return Po() && jo(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: I, left: M, scrolled: T, arrived: Y };
}
const dp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, hp = (e) => String(e ?? "").replace(dp, ""), fp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(null), { away: o, scrolled: r, arrived: i, toBottom: l } = up(a);
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
      le(b(z(hp)(e.lines.join(`
`)) || e.empty), 1),
      z(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (g) => z(l)(!0))
      }, "Follow")) : C("", !0)
    ], 544));
  }
}, mp = /* @__PURE__ */ K(fp, [["__scopeId", "data-v-d9fa8127"]]), pp = 1e4;
class gp {
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
    return this.heardAt !== null && t - this.heardAt > pp;
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
const vp = {
  key: 0,
  class: "frame-note"
}, yp = {
  key: 0,
  class: "frame-note"
}, wp = ["src", "title"], kp = 1e3, bp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = zn(), s = B(null), a = B(!1), o = B(!1);
    let r = null, i = 0;
    return Fe(() => {
      r = new gp(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, kp);
    }), Ie(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", vp, "This window was closed because it stopped answering.")) : (c(), h(G, { key: 1 }, [
      a.value ? (c(), h("div", yp, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        D(ve, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: F(() => [...u[1] || (u[1] = [
            le("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : C("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: z(n).window
      }, null, 8, wp)
    ], 64));
  }
}, xp = /* @__PURE__ */ K(bp, [["__scopeId", "data-v-32a49046"]]), $p = 0, Mp = "/api/lines", Sp = "/api/line";
class _p {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), $p));
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
        const n = await je.raw(Mp, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(Sp, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Ep = new _p();
class Ap {
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
      n.patterns.some((s) => Fr(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Fr(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Cp = Symbol("pane-page"), Op = { 1: "refused", 2: "usage", 3: "fault" }, Tp = 100, Ip = 50, Rp = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Bp({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = B({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: g = "", tabs: v = [], search: I = {}, readOnly: M = !1, shared: _ = null }) {
  const x = /* @__PURE__ */ new Map(), T = new AbortController(), Y = B(!1), O = performance.now();
  let y = 0, $ = 0;
  const E = () => {
    clearTimeout($), $ = setTimeout(() => {
      y === 0 && Nr(O, () => Y.value = !0);
    }, Ip);
  }, S = (w) => {
    const A = x.get(w);
    if (A && performance.now() - A.at < Tp) return A.answer;
    y += 1;
    const k = Hr(e, w, t, T.signal).finally(() => {
      y -= 1, E();
    });
    return x.set(w, { answer: k, at: performance.now() }), k;
  };
  return {
    answered: Y,
    settle: E,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: L(() => s()),
    permissions: a,
    autoScroll: g,
    tabs: v,
    search: I,
    readOnly: M,
    shared: _,
    read: S,
    run: (w) => en(e, w, t, T.signal),
    upload: (w) => Dp(w, T.signal),
    cancel: () => T.abort(),
    subscriptions: r,
    follow: (w, A) => r.follow(e, w.filter((k) => o.some((m) => Fr(m, k))), A, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (w) => L(() => {
      var A;
      return l.value[w] ?? ((A = u.find((k) => k.key === w)) == null ? void 0 : A.default);
    }),
    setting: async (w, A) => {
      const k = await S(`window setting ${e} ${w}`);
      return k.ok ? k.value.value : A;
    },
    setOption: f,
    keep: (w, A) => en(e, ["window", "save-setting", e, w, JSON.stringify(A)], t, T.signal)
  };
}
function Lp(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Qt = { ok: !1, failure: "cancelled", error: "" }, Wr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function en(e, t, n, s = void 0) {
  try {
    const a = await Ep.add({ window: e, line: Array.isArray(t) ? t : Np(t), environment: n }, s);
    return s != null && s.aborted ? Qt : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Op[a.code] || "fault", error: Lp(a.error) };
  } catch {
    return s != null && s.aborted ? Qt : { ok: !1, failure: "unreachable", error: Wr };
  }
}
async function Hr(e, t, n, s) {
  const a = await en(e, t, n, s);
  return a.failure !== "unreachable" || !ua() ? a : (await Ic(), s.aborted ? Qt : Hr(e, t, n, s));
}
async function Dp(e, t = void 0) {
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? Qt : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Qt : { ok: !1, failure: "unreachable", error: Wr };
  }
}
function Np(e) {
  return [...e.matchAll(Rp)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Pp({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const jp = {
  class: "allowance-prompt",
  role: "dialog"
}, qp = { class: "allowance-prompt-text" }, Fp = { class: "allowance-prompt-buttons" }, Wp = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", jp, [
      p("p", qp, b(z(Pp)(e.request)), 1),
      p("div", Fp, [
        D(ve, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            le("Allow", -1)
          ])]),
          _: 1
        }),
        D(ve, {
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
}, Hp = /* @__PURE__ */ K(Wp, [["__scopeId", "data-v-102dc765"]]), gs = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), V(Bn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: F(() => [
        le(b(e.reason) + " ", 1),
        e.retry ? (c(), V(ve, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            le("Retry", -1)
          ])]),
          _: 1
        })) : C("", !0),
        e.removable ? (c(), V(ve, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            le("Remove tab", -1)
          ])]),
          _: 1
        })) : C("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Up = ["data-window", "data-agent"], zp = {
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
    const n = e, s = t, a = B(""), o = B(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Oe(pl, null), l = Bp({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: L(() => n.options),
      declared: n.declared,
      page: Oe(Cp, null),
      setOption: (f, g) => s("option", f, g),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, g) => {
        s("open", f, g), i == null || i(f, g);
      }
    });
    Wi(Re, l), be(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Fe(l.settle), Ie(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), Hi((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => ia(n.component), d = () => {
      var f, g;
      return ((g = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : g.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, g) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), V(Hp, {
        key: 0,
        request: d(),
        onAnswer: g[0] || (g[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : C("", !0),
      e.unavailableReason ? (c(), V(gs, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), V(gs, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(G, { key: 4 }, [
        (c(), V(u, { key: o.value })),
        e.skeleton.length && !z(l).answered.value ? (c(), V(Rr, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : C("", !0)
      ], 64)) : (c(), V(gs, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: g[1] || (g[1] = (v) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Up));
  }
}, Ur = /* @__PURE__ */ K(zp, [["__scopeId", "data-v-1db91f82"]]), Vp = {
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
    const n = e, s = t, a = { render: () => ia(xp, { src: n.entry.entry_url }) };
    return (o, r) => (c(), V(Ur, {
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
}, Gp = ["data-window"], Kp = {
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
    const n = e, s = t, a = Un(null), o = B("");
    return be(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, Sc();
          } catch (i) {
            if ($c(i) && Mc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      D(Rr, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Gp)) : (c(), V(Ur, {
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
}, ho = "*.*", Yp = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var u;
    const t = e, n = Oe(Re, null), s = new Ap(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [ho], (d) => s.dispatch(d));
    Ie(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? "", r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = L(() => !!(t.declaration.shipped || t.declaration.trusted)), l = L(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [ho] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), V(Kp, {
      key: 0,
      entry: l.value,
      subscriptions: z(s),
      environment: z(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), V(Vp, {
      key: 1,
      entry: l.value,
      subscriptions: z(s),
      environment: z(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Jp = { class: "mark-more-inner" }, Zp = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Xp = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Qp = {
  key: 3,
  class: "mark-lines"
}, eg = "process", fo = "task", tg = 2e3, ng = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Oe(Re), s = L(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = L(() => qr.has(t.mark.variant) && t.mark.detail || ""), o = L(() => t.mark.target_model === fo ? t.mark.target_id : 0), r = B([]), i = B(!1), l = B(""), u = L(() => t.mark.target_model === eg && !!t.mark.target_id);
    async function d() {
      const v = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, l.value = v.ok ? "" : v.error, v.ok && (r.value = v.value.lines);
    }
    let f = null;
    const g = () => clearInterval(f);
    return be(() => t.shown && u.value, (v) => {
      g(), v && (d(), t.mark.ended_at || (f = setInterval(d, tg)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (v) => v && t.shown && u.value && (g(), d())), Ie(g), (v, I) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: I[1] || (I[1] = xe(() => {
      }, ["stop"]))
    }, [
      p("div", Jp, [
        e.declaration.body_url ? (c(), V(Yp, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(G, { key: 1 }, [
          a.value ? (c(), h(G, { key: 0 }, [
            I[2] || (I[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Zp, b(a.value), 1)
          ], 64)) : C("", !0),
          u.value && l.value ? (c(), h("p", Xp, b(l.value), 1)) : u.value && i.value ? (c(), h(G, { key: 2 }, [
            I[3] || (I[3] = p("p", { class: "mark-label" }, "Output", -1)),
            D(mp, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", Qp, b(s.value.join(`
`)), 1)) : C("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: I[0] || (I[0] = xe((M) => z(Xe)(`${fo}:${o.value}`), ["stop"]))
          }, "Open task " + b(o.value) + " and its proofs", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Ys = /* @__PURE__ */ K(ng, [["__scopeId", "data-v-51f69bf1"]]), sg = (e) => `show-${e}`, ab = (e, t, n) => e.filter((s) => {
  var a;
  return n(sg((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), ag = "messages.chat", og = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), ba = (e, t, n) => en(ag, og(e, t), n), rg = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, ig = ["title", "aria-label", "onClick"], lg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, cg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = L(() => rg(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = B(""), a = Oe(Re);
    async function o(r) {
      const i = await ba(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(G, null, [
      (c(!0), h(G, null, se(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: xe((u) => o(l), ["stop"])
      }, [
        D(nt, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, ig))), 128)),
      s.value ? (c(), h("span", lg, b(s.value), 1)) : C("", !0)
    ], 64));
  }
}, ug = /* @__PURE__ */ K(cg, [["__scopeId", "data-v-0dfda102"]]);
function zr(e, t) {
  const n = Un(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const Vr = zr("/api/marks", "marks"), ob = Vr.fetchAll, dg = Vr.find, hg = 2e3;
function Gr(e, t, n = hg) {
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
  }), Dt(() => clearTimeout(s));
}
const fg = ["data-ref"], mg = ["data-ref"], pg = { class: "mark-row" }, gg = "dock add", vg = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = L(() => dg(s.mark.type)), o = Oe(Re, null), r = L(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = B(null);
    Gr(async () => {
      if (!r.value) return;
      const v = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      v.ok && v.value.rows.length && (i.value = v.value.rows[0].progress);
    }, () => r.value);
    const l = L(() => {
      const v = op(s.mark, a.value), I = !v.figure || v.figure.endsWith("%");
      return i.value && r.value && I ? { ...v, figure: `${i.value}%`, fraction: i.value / 100 } : v;
    }), u = L(() => {
      var v;
      return !!(s.mark.lines || s.mark.detail && qr.has(s.mark.variant) || t.has(s.mark.target_model) || (v = a.value) != null && v.body_url);
    }), d = B(!1);
    function f(v) {
      if (l.value.handlers.onAct && !v.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const g = L(() => {
      var v, I, M;
      return s.docked ? (I = (v = a.value) == null ? void 0 : v.buttons) == null ? void 0 : I.filter((_) => {
        var x;
        return !((x = _.runs) != null && x.startsWith(gg));
      }) : (M = a.value) == null ? void 0 : M.buttons;
    });
    return (v, I) => {
      var M, _;
      return (M = a.value) != null && M.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        D(Ys, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, fg)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (_ = a.value) == null ? void 0 : _.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", pg, [
          D(Pr, tt({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, Ui(l.value.handlers), { onClick: f }), zi({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: F(({ shown: x }) => [
                D(Ys, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: x
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          D(ug, {
            buttons: g.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, mg));
    };
  }
}, yg = /* @__PURE__ */ K(vg, [["__scopeId", "data-v-cc29b2a4"]]), wg = ["data-ref"], kg = ["inert"], bg = { class: "group-fold" }, xg = { class: "thread-group" }, $g = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = B(!1), s = B(!1), a = B(!1), o = B(null);
    be(n, async (i) => {
      var l;
      s.value = !0, await Lt(), (l = o.value) == null || l.offsetHeight, a.value = i;
    });
    const r = L(() => ({
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
      D(Pr, {
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
        p("div", bg, [
          p("div", xg, [
            (c(!0), h(G, null, se(e.group.marks, (u) => (c(), V(yg, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, kg)) : C("", !0)
    ], 8, wg));
  }
}, rb = /* @__PURE__ */ K($g, [["__scopeId", "data-v-594fc44f"]]);
function Mg(e) {
  const t = B(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Fe(() => n.observe(e.value)), Dt(() => n.disconnect()), t;
}
const Sg = { class: "chat-dock-fold" }, _g = ["aria-label"], Eg = { class: "chat-dock-head" }, Ag = { class: "chat-dock-inner" }, Kr = 700, Cg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = B(null), s = B(null), a = Mg(s), o = B(!1);
    let r = 0;
    return Fe(() => r = setTimeout(() => o.value = !0, Kr)), Dt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", Sg, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          me(i.$slots, "edge"),
          p("header", Eg, [
            me(i.$slots, "head")
          ]),
          p("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", Ag, [
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
        ], 10, _g)
      ])
    ], 2));
  }
}, Yr = /* @__PURE__ */ K(Cg, [["__scopeId", "data-v-63e4dcfc"]]), Og = {
  class: "dock-leave",
  "aria-hidden": "true"
}, vs = 5, Tg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(vs, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${vs}s`, animationDelay: `${(n - vs).toFixed(2)}s` };
    return (a, o) => (c(), h("span", Og, [
      p("i", { style: s })
    ]));
  }
}, Jr = /* @__PURE__ */ K(Tg, [["__scopeId", "data-v-d0c4b012"]]), Zr = zr("/api/docks", "docks"), ib = Zr.fetchAll, Js = Zr.find, Ig = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Zs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), Rg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Bg = (e) => e.kept ? Zs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : Zs("keep", "pin", "Pin", `dock keep ${e.id}`), Lg = ["pin", "stop"], Dg = (e) => ({ ...e, iconOnly: Lg.includes(e.icon) });
function Ng(e, t) {
  var n;
  return [
    ...Rg(e, t) ? [Bg(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || un(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Zs("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(Dg);
}
const Pg = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Ig(e, t),
  buttons: Ng(e, t)
}), jg = { class: "dock-title" }, qg = ["aria-expanded", "title"], Fg = { class: "chat-dock-acts dock-acts" }, Wg = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Hg = {
  key: 1,
  class: "dock-text"
}, Ug = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = L(() => Js(s.item.type)), o = B(null), r = L(() => Pg(s.item, a.value)), i = Oe(Re), l = B(/* @__PURE__ */ new Set()), u = B("");
    async function d(v) {
      if (v.action === "open") return Xe(`${s.item.target_model}:${s.item.target_id}`);
      v.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, v.label])), u.value = "";
      const M = await ba(v, s.item, i.environment);
      (M == null ? void 0 : M.ok) === !1 && (l.value = new Set([...l.value].filter((_) => _ !== v.label)), u.value = M.error);
    }
    const f = L(() => r.value.buttons.filter((v) => v.action !== "undock" && !l.value.has(v.label))), g = L(() => r.value.buttons.find((v) => v.action === "undock"));
    return (v, I) => (c(), V(Yr, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: F(() => [
        e.leaving ? (c(), V(Jr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : C("", !0)
      ]),
      head: F(() => {
        var M, _, x;
        return [
          (M = a.value) != null && M.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(G, { key: 1 }, [
            D(ye, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", jg, b(r.value.title), 1)
          ], 64)),
          (_ = a.value) != null && _.badge ? (c(), h("span", {
            key: 2,
            class: Z(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, b(a.value.badge), 3)) : C("", !0),
          (x = a.value) != null && x.draws_head ? C("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: I[0] || (I[0] = (T) => n("fold"))
          }, [
            D(Xt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, qg)),
          p("span", Fg, [
            (c(!0), h(G, null, se(f.value, (T) => (c(), h(G, {
              key: T.action + T.runs
            }, [
              T.iconOnly ? (c(), V(ve, {
                key: 0,
                kind: "icon",
                "aria-label": T.label,
                title: T.label,
                "data-dock-action": T.action,
                onClick: (Y) => d(T)
              }, {
                default: F(() => [
                  D(ye, {
                    name: T.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), V(ve, {
                key: 1,
                small: "",
                kind: T.primary ? "primary" : "ghost",
                bordered: !T.primary,
                "data-dock-action": T.action,
                onClick: (Y) => d(T)
              }, {
                default: F(() => [
                  le(b(T.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          D(Yn, {
            title: g.value.label,
            "data-dock-action": "undock",
            onClick: I[1] || (I[1] = (T) => n("undock", g.value))
          }, null, 8, ["title"])
        ];
      }),
      default: F(() => {
        var M, _;
        return [
          u.value || e.refusal ? (c(), h("p", Wg, b(u.value || e.refusal), 1)) : C("", !0),
          e.item.text && !((M = a.value) != null && M.body_url) ? (c(), h("p", Hg, b(e.item.text), 1)) : C("", !0),
          (_ = a.value) != null && _.body_url ? (c(), V(Ys, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : C("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded", "data-figure-closing"]));
  }
}, mo = /* @__PURE__ */ K(Ug, [["__scopeId", "data-v-1ac9db13"]]), zg = 6, Vg = 3, po = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, yt = (e) => !!(e.leaves_at && !e.kept), Gg = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!yt(e) || t < e.leaves_at || n.has(e.id)), Kg = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => Gg(s, t, n)).sort((s, a) => s.id - a.id);
function Yg(e, t, n = zg) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const Jg = (e, t, n = e) => n < 2 ? !1 : e >= Vg ? !0 : t, Zg = ["title", "aria-label"], Xg = { class: "run-chip-in" }, Qg = {
  key: 0,
  class: "run-chip-ring"
}, e0 = { class: "run-chip-name" }, t0 = { class: "run-chip-bar" }, n0 = "processes.output", s0 = 5e3, a0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = Oe(Re, null)) == null ? void 0 : d.environment) ?? "", o = B(null), r = L(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = L(() => {
      var f, g;
      return ((f = o.value) == null ? void 0 : f.title) || ((g = o.value) == null ? void 0 : g.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = L(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await en(n0, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return Gr(u, () => r.value, s0), (f, g) => {
      var v;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: pe({ "--tone": l.value })
      }, [
        z(yt)(e.item) ? (c(), V(Jr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : C("", !0),
        p("span", Xg, [
          r.value ? (c(), h("span", Qg)) : (c(), V(nt, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", e0, b(i.value), 1)
        ]),
        p("span", t0, [
          p("i", {
            style: pe({ width: r.value ? `${((v = o.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, Zg);
    };
  }
}, o0 = /* @__PURE__ */ K(a0, [["__scopeId", "data-v-597b05d2"]]), r0 = 24, i0 = 8, lb = 420;
function cb({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= r0 && e > t ? !0 : e < t && a > i0 ? !1 : null;
}
const l0 = (e, t) => e === void 0 ? t : e, c0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, u0 = { class: "dock-runs-chips" }, d0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = Dm(500), s = B(/* @__PURE__ */ new Set()), a = B(!1), o = B(!1), r = Oe(Re), i = B(/* @__PURE__ */ new Set()), l = B({});
    async function u($, E) {
      i.value = /* @__PURE__ */ new Set([...i.value, $.id]);
      const S = await ba(E, $, r.environment);
      (S == null ? void 0 : S.ok) === !1 && (i.value = new Set([...i.value].filter((w) => w !== $.id)), l.value = { ...l.value, [$.id]: S.error });
    }
    const d = L(() => Kg(t.items.filter(($) => !i.value.has($.id)), n.value, s.value)), f = L(() => Yg(d.value.filter(($) => po($, Js)), n.value)), g = L(() => d.value.filter(($) => !f.value.includes($) && !po($, Js))), v = L(() => f.value.filter(($) => !yt($))), I = L(() => (a.value = Jg(f.value.length, a.value, v.value.length)) && !o.value), M = B({}), _ = ($) => l0(M.value[$.id], t.folded);
    function x($) {
      M.value = { ...M.value, [$.id]: !_($) };
    }
    function T($) {
      M.value = { ...M.value, ...Object.fromEntries(f.value.map((E) => [E.id, E.id !== $.id])) }, o.value = !0;
    }
    function Y() {
      M.value = Object.fromEntries(Object.entries(M.value).filter(([$]) => !f.value.some((E) => String(E.id) === $))), o.value = !1;
    }
    function O($) {
      s.value = /* @__PURE__ */ new Set([...s.value, $.id]);
    }
    function y($) {
      s.value = new Set([...s.value].filter((E) => E !== $.id));
    }
    return ($, E) => (c(), V(Do, {
      tag: "div",
      name: "dock",
      duration: z(Kr),
      class: "dock-stack"
    }, {
      default: F(() => [
        (c(!0), h(G, null, se(g.value, (S) => (c(), V(mo, {
          key: S.id,
          item: S,
          class: Z({ timed: z(yt)(S) }),
          leaving: z(yt)(S) && !s.value.has(S.id),
          folded: _(S),
          refusal: l.value[S.id],
          onFold: (w) => x(S),
          onUndock: (w) => u(S, w),
          onMouseenter: (w) => O(S),
          onMouseleave: (w) => y(S)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", c0, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: Y
          }, [
            le(b(f.value.length) + " runs ", 1),
            D(Xt, { open: "" })
          ])
        ])) : C("", !0),
        (c(!0), h(G, null, se(I.value ? [] : f.value, (S) => (c(), V(mo, {
          key: S.id,
          item: S,
          class: Z({ timed: z(yt)(S) }),
          leaving: z(yt)(S) && !s.value.has(S.id),
          folded: _(S),
          refusal: l.value[S.id],
          onFold: (w) => x(S),
          onUndock: (w) => u(S, w),
          onMouseenter: (w) => O(S),
          onMouseleave: (w) => y(S)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        I.value ? (c(), V(Yr, {
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
              onClick: E[0] || (E[0] = (S) => o.value = !0)
            }, [
              D(nt, { name: "runs" }),
              le(" " + b(f.value.length) + " runs ", 1),
              D(Xt)
            ]),
            p("span", u0, [
              (c(!0), h(G, null, se(f.value, (S) => (c(), V(o0, {
                key: S.id,
                item: S,
                onClick: (w) => T(S)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : C("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, ub = /* @__PURE__ */ K(d0, [["__scopeId", "data-v-7f46f4cf"]]), wt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, On = (e) => Math.min(Math.max(e, 0), 1), h0 = (e) => {
  const t = On(e);
  return t * t * (3 - 2 * t);
}, mt = (e, t, n) => h0((e - t) / (n - t));
function db(e) {
  const t = On(e), n = On((t - 0.12) / 0.76) * wt.shuffles, s = Math.min(Math.floor(n), wt.shuffles - 1), a = n - s, o = mt(a, 0.26, 0.38) * (1 - mt(a, 0.76, 0.96)), r = mt(a, 0.38, 0.76), i = mt(t, 0, 0.12) * (1 - mt(t, 0.88, 1)), l = mt(a, 0.2, 0.34) * (1 - mt(a, 0.84, 1)), u = Math.sin(Math.PI * On((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / wt.shuffles, lift: wt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function hb(e, t, n, s, a) {
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
}, fb = (e) => go[e] ?? go.butler, xa = 2400, f0 = 0.05;
function m0({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, f0), r = Math.min(t + xa * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function mb(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function p0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function pb(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const gb = (e, t) => ({ ...e, stretch: t.stretch }), vb = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Xr = (e, t) => t >= (e.least ?? 0);
function yb(e, t, n) {
  if (!Xr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const wb = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), g0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", vo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), v0 = (e) => e.right > e.left && e.bottom > e.top;
function kb(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(g0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = vo(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = vo(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), v0(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function Qr(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, g] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[g]) && (i = -1);
      else {
        const I = (o[f] - e[d]) / v, M = (o[g] - e[d]) / v;
        r = Math.max(r, Math.min(I, M)), i = Math.min(i, Math.max(I, M));
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), y0 = (e) => e * e * (3 - 2 * e), _e = (e, [t, n]) => y0(tn(e, t, n)), w0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ct = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Mn = ([e, t], n) => e + n() * (t - e);
function k0(e) {
  return w0.map(() => {
    const t = Mn(ct.speed, e), n = Mn(ct.angle, e) * Math.PI / 180, s = Mn(ct.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Mn(ct.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const b0 = k0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function x0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ct.gravity * (t[2] - ct.floor))) / ct.gravity;
}
function bb(e, t, n = b0) {
  const s = Se.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = x0(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= ct.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const xb = (e, t) => e && Se[e.name] ? { name: e.name, u: t / e.frames } : null;
function $b(e, t) {
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
const Mb = () => Array.from({ length: Se.pogo.count }, (e, t) => Se.pogo.bounce * (t + 1) / Se.pogo.count), Tt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Sb(e, t, n) {
  const { away: s, side: a } = Se.bug_smash, o = a * s * n, [r, i] = [t.left + Tt.margin * n, t.right - Tt.margin * n], l = Math.min(Math.max(e + o + a * Tt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function _b(e, t, n) {
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
function Eb(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Tt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = m0({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Te = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function Ab(e) {
  const t = Te.least + Math.floor(e() * (Te.most - Te.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Te.walls[Math.floor(e() * Te.walls.length)],
    along: Te.margin + e() * (1 - 2 * Te.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Xs(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Te.margin, r = ((e.along - Te.margin + e.way * Te.speed * n / s) / a % 2 + 2) % 2, i = Te.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Te.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Te.inset : t.right - Te.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function $0(e, t) {
  const n = Se.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = p0(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function Cb(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Se.bug_shot, { frame: r, bug: i, shot: l } = $0(n, e.length), u = e.map((x, T) => ({ ...Xs(x, t, Math.min(n / o.fps, Tn(T).shot)), shot: T < l })), d = _e(r / o.frames, o.aim), [f, g] = [u[Math.max(i - 1, 0)], u[i]], v = e.map((x, T) => ({ bug: x, index: T, seconds: n / o.fps - Tn(T).shot, spot: Xs(x, t, Tn(T).shot) })).filter((x) => x.seconds >= 0), I = v.flatMap((x) => {
    const T = (a == null ? void 0 : a.get(x.index)) ?? A0(x.bug, t, x.spot, a ? [] : s);
    return a == null || a.set(x.index, T), a && C0(T, x.seconds, s), O0(T, x.seconds, s);
  }), M = v.filter((x) => _0(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), _ = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (g.x - f.x) * d, y: f.y + (g.y - f.y) * d, back: _ }, slush: I, camera: M };
}
function Tn(e) {
  const t = Se.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function Ob(e, t, n, s) {
  const { limit: a, margin: o } = Se.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Tn(d), g = Xs(u, t, f.shot), v = Math.abs(g.y - n.y) / Math.tan(a * Math.PI / 180), I = g.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - g.x), M = Math.abs(g.x - l) >= v ? l : g.x + I * v, _ = I > 0 ? Math.max(l, Math.min(M, i)) : Math.min(l, Math.max(M, r)), x = { from: l, to: _, begin: f.walk, end: f.aim };
    return l = _, x;
  });
}
function Tb(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, M0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function S0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const _0 = (e) => e.along * 97 % 1 < $e.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function E0(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += $e.step) {
    const d = Math.min(u + $e.step, r.t), f = nn(e, d), g = Qr(i, f, n);
    if (g) return { ...g, t: u + (d - u) * g.share };
    i = f;
  }
  const l = nn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function A0(e, t, n, s = []) {
  const a = S0(e.along + 1), [o, r] = M0[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: $e.count }, () => {
    const l = i + (a() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + a() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: $e.radius[0] + a() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...E0(d, t, s) };
  });
}
function C0(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += $e.step) {
      const r = Math.min(o + $e.step, a), i = Qr(nn(s, o), nn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function O0(e, t, n = []) {
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
function Ib(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Se.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = _e(e, [0, u]), g = _e(e, [u, u + d]);
  return r.map((v) => {
    const I = { x: s.x + v.at[0] * t, y: s.y + v.at[1] * t };
    return {
      x: n.x + (I.x - n.x) * f,
      y: n.y + (I.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: g * g * t * 1.2,
      fade: 1 - g,
      landed: f >= 1
    };
  });
}
function Rb(e, t, n, s, a) {
  const { sway: o, above: r } = Se.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (M) => {
    const [_, x] = [M.x - e.at.x, M.y - e.at.y];
    return { x: i.x + _ * u - x * d, y: i.y + _ * d + x * u };
  }, [g, v] = [...n].sort((M, _) => M.x - _.x), I = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: I.map((M, _) => ({ from: M, to: _ < I.length / 2 ? g : v })) };
}
const Bb = (e, t) => _e(t, e.grows) * (1 - _e(t, e.sinks));
function Pn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Lb(e, t) {
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
const Db = (e) => e === "pack_box";
function Nb(e) {
  const { into: t, out: n } = Pn(Se.rope_swing, e);
  return 1 - _e(t, [0, 1]) * (1 - _e(n, [0, 1]));
}
function Pb(e) {
  const t = Se.rope_swing, { into: n, out: s } = Pn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return _e(n, [0, 1]) * (1 - _e(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const T0 = { after: 3 }, $a = 10, I0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, R0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, B0 = { weight: 19 }, ei = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, L0 = { every: 120 }, ti = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, ni = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, D0 = {
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
}, fn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: $a }), te = (e, t, n = {}) => fn(e, "clip", t, n), ys = (e, t, n = {}) => fn(e, "look", t, n), yo = (e, t, n = {}) => fn(e, "gaze", t, n), fe = (e, t, n = {}, s = {}) => ({ ...fn(e, "pick", t, n), ...s }), we = (e) => fn("nothing", "nothing", e, {}), N0 = 120, P0 = 300, ws = (e, t) => ({ ...te(e, t), cooldown: P0 }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), j0 = () => [te("joy", 2)], pt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), gt = (e) => ({ ...e, cooldown: I0[e.name] }), Ht = (e) => ({ ...e, shenanigan: !0, lasts: R0[e.name] }), Xn = [
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
  ...oe("bar_done", { holds: !0 }, j0()),
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
  ...Object.entries(D0).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [ys(t, 1)])),
  ...Object.entries(ti).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(ni).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
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
  ...oe("held:search", { cooldown: N0 }, [ws("search", 3), { ...ws("binoculars", 2), when: { home: !0 } }, { ...ws("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...oe("unit", { cooldown: ei.build.cooldown }, [fe("unit", B0.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...fe("hang", 1, { hands: !0, free: !0 }), cooldown: L0.every }, fe("stand", 5)]),
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
], si = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), ai = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), q0 = (e) => Array.isArray(e) ? e[0] : e, F0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, W0 = (e) => Xn.some((t) => t.when.moment === e);
function H0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || ai(d).every(([f, g]) => n(f) >= q0(g)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Xn.filter((d) => si(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= T0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = H0(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (oi(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function oi(e, t, n) {
  var s;
  for (const [a, o] of ai(t)) (s = e.memory) == null || s.set(a, e.now + F0(o, n));
}
function jb(e, t, n) {
  oi(e, Xn.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const qb = (e) => Object.values(ei).find((t) => si(t.when, e)) ?? null, U0 = (e, t, n) => n - t <= (e.lifetime ?? $a), Fb = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Xr(e.clip, t));
class ri {
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
}, Wb = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), ii = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), Hb = {
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
}, Ub = 120, z0 = 20, zb = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < z0), V0 = (e) => Qs[e] || Qs.idle, Vb = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, li = "airborne", G0 = "landing", K0 = "travelling", ci = "grounded", Gb = ({ airborne: e, landing: t, trip: n }) => e ? li : t ? G0 : n != null && n.started ? K0 : ci;
function Kb(e, t) {
  var a;
  const n = Y0(e, t);
  return e.mode === ci && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function Y0(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: g = null } = e;
  if (n === li && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...J0(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const v = g !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? g : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : V0(u), facing: v ? g : i.posture === "sit" ? i.face : f };
}
function J0(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const ea = (e) => e.outcome, Z0 = "plugin:code-commandments:sins:", wo = (e) => e.type === "plugins.card" && e.markKey.startsWith(Z0), X0 = [
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
], Yb = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: ar(n) })).sort((n, s) => n.time - s.time), ko = { user: "reacted", agent: "agent_reacted" };
function Jb(e, t) {
  return e.filter((n) => ko[n.author] && bt(n) > t).map((n) => ({ beat: `${ko[n.author]}:${n.emoji}`, time: bt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const Q0 = [.../* @__PURE__ */ new Set([...Object.values(ti).flatMap((e) => Object.keys(e)), ...Object.keys(ni)])];
function Zb(e, t) {
  return e.filter((n) => n.author === "agent" && bt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = Q0.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: bt(n), card: ar(n) })).sort((n, s) => n.time - s.time);
}
const ev = (e) => new ri(e).isTest(), jn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ea(e)] || "";
}, tv = 1800, nv = (e, t) => {
  if (jn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && jn(n) !== "finished" && Number(e.time) - Number(n.time) <= tv ? "tests_fixed" : "tests_passed";
};
function Xb(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(ev), a = s.filter((i) => jn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, jn(i))), o.map((i) => ({ beat: nv(i, a), time: Number(i.time), card: i.key }));
}
function Qb(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ea(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: ea(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const e5 = (e) => e.map((t) => {
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
function t5(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function n5(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function s5(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = X0.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function Ma(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const bo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function sv(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    Ma(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function a5(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : W0(`held:${e}`) ? "idle" : e;
}
const Ce = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function o5(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Ce.ahead * n ? 180 : Math.sign(s) * Ce.turn;
}
const xo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function r5(e, t) {
  const n = Math.min(Ce.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Ce.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Ce.lines, Math.floor((e.bottom - e.top - 2 * s) / Ce.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ce.sweep) % a, i = o % Ce.sweep, l = Ce.sweep - Ce.returnSeconds, u = xo((i - l) / Ce.returnSeconds), d = i <= l ? xo(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Ce.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const $o = 3, ui = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Mo = 12, i5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function l5(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!ui(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= $o ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * Mo) / Mo, lasts: $o } };
}
const c5 = (e) => e.posture === "hang" && !ui(e.face), av = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), ov = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function u5(e, t, n) {
  return av.has(e) ? 1 / 0 : !ov.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(di(n - t.began, t.share) - Qe.lead, 0);
}
const rv = 5;
function d5(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= rv ? { beat: "long_walk", time: n } : null };
}
const iv = 30, Sn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function h5(e, t, n, s, a = null) {
  if (t && n < t.until || !Sn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = Sn.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + Sn.every } : { state: e, began: 0, until: 0, next: n + Sn.every };
}
const f5 = (e, t, n) => t && n < t.until && ii.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, di = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function m5(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = di(o, e.share);
  return a ? { eager: lv(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function lv(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const cv = 1, uv = { look: "look", gaze: "gaze" };
function dv(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [uv[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const hv = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), fv = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > cv * t, memory: s, now: a, room: o }, n).name === "backflip", mv = { work: ["building"], idle: ["standing"] };
function p5(e, t, n, s) {
  const a = Qs[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(mv[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), ii.has(e) ? { moments: o, began: n || s } : (n && s - n >= iv && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function pv(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const So = { pondering: pv };
function g5(e, t, n, s, a, o) {
  if (So[e.beat]) {
    const i = So[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = dv(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== $a && { lifetime: r.lifetime } } } : null;
}
function v5(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = hv(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const y5 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function w5(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function k5(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const b5 = (e, t) => !!(e != null && e.watches) && !t.once, x5 = 10, $5 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || U0(s, s.queuedAt, n)), M5 = (e, t) => t ? null : e[0] ?? null;
function S5(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const _5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), gv = 2 * Math.PI, vv = 500;
function E5(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / vv, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), g = gv * r / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, M = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !l ? a && !t.behind && !v.behind ? wv(v, t, n, g, a) : bv(v, t, n, g) : t) ?? v, _ = M != null && M.behind && M.mood === "reading" ? yv(e.point, M, n, r, a) : M;
  return { point: _ ?? null, toward: _ ? { x: _.x - n.x, y: _.y - n.y } : null, amount: f, at: s };
}
function yv(e, t, n, s, a) {
  const o = (w) => w * 180 / Math.PI, r = (w) => o(Math.atan2(Math.sin(w * Math.PI / 180), Math.cos(w * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), g = f ? r(e.readingFacing - i) : 0, v = f ? e.readingYaw + g : d, I = v + r(u - v), M = Math.min(Math.max(s / 1e3, 0), 0.1), _ = Ce.turnSpeed * M, x = f ? v + Math.min(Math.max(I - v, -_), _) : I, T = f ? e.readingFollow + g : x, Y = T + (x - T) * (1 - Math.exp(-M / Ce.followSeconds)), O = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, y = o(Ma(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), $ = Math.min(Math.max(y, -O.up), O.down), E = Ce.tipSpeed * M, S = f ? e.readingPitch + Math.min(Math.max($ - e.readingPitch, -E), E) : $;
  return { ...t, readingYaw: x, readingFollow: Y, readingPitch: S, readingFacing: i };
}
function wv(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (T) => {
    const { yaw: Y, pitch: O } = Ma(T.x - n.x, a, n.y - T.y, o);
    return { yaw: Y, pitch: Math.min(Math.max(O, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [bo(i(e)), bo(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [g, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [I, M, _] = l.map((T, Y) => g * T + v * u[Y]), x = a * I / M;
  return { ...t, x: n.x + x, y: n.y - sv(x, a, -Math.asin(Math.min(Math.max(_, -1), 1)), o) };
}
const kv = 0.15;
function A5(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= kv;
}
function bv(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const xv = (e) => !(e != null && e.on);
function C5(e, t, n) {
  if (xv(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const sn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ye = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ks = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), _o = (e) => e * e * (3 - 2 * e);
function $v(e) {
  if (e < 0 || e >= Ye.seconds) return null;
  const t = ks(e, ...Ye.flicker), n = Math.floor(t * Ye.flickers * 2) % 2 === 0, s = e < Ye.flicker[1] ? n ? 0.35 + 0.5 * t : Ye.dim : 1;
  return { strength: 1 - _o(ks(e, ...Ye.fade)), lit: s, white: e < Ye.flash[0] ? 0 : 1 - _o(ks(e, ...Ye.flash)) };
}
const O5 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function T5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = $v(t - e.at);
  return s && { colour: sn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ye.signs[e.tone], ...s } };
}
function I5(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function R5(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= sn.looks || s === null && n - e.since >= sn.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function B5(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const it = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, L5 = { behind: 39, figure: 40, ahead: 41 }, Mv = "[data-figure-pile]", Sv = { amber: [1, 0.69, 0.125], good: sn.colours.good, bad: sn.colours.bad }, In = { phases: 4, ms: 230, dim: 0.25 }, D5 = (e, t, n) => e !== "amber" || (t + n) % In.phases < In.phases / 2 ? 1 : In.dim, N5 = (e) => e === "amber" ? In.phases : 1;
function P5(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const j5 = Object.keys(Sv), Ue = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ut = ([e, t], n) => e + n() * (t - e);
function q5(e) {
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
function F5(e) {
  const t = Math.floor(e / bs.high);
  return { left: -(it.inside + it.width / 2 + t * (it.width + bs.gap)), up: e % bs.high * (it.height - it.top) };
}
const _v = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, Ev = { after: 5 }, Av = (e) => e.filter((t) => t.active && (t.process || t.watch) && new ri(t).isBuild());
function W5(e, t, n) {
  const s = Av(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= Ev.after ? a : null;
}
function H5(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: _v(n, s, a) } : null;
}
const Eo = { ahead: 140, up: 70 };
function U5(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * Eo.ahead, y: s - Eo.up } } : o ? { at: { x: n(o), y: s - o.up - it.height } } : t ? { at: null } : null;
}
const xs = { least: 4e3, most: 1e4 }, Cv = (e) => xs.least + e() * (xs.most - xs.least), vt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function z5(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Cv(t);
    if (n.length >= vt.most || t() >= vt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (vt.at[0] + t() * (vt.at[1] - vt.at[0]));
    n.push({ from: o, to: o + vt.ms }), s = o + vt.ms;
  }
}
const V5 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), G5 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), hi = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), K5 = new Set(Xn.filter((e) => hi.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), Ov = (e) => e.some((t) => t.state === "built"), Y5 = (e, t) => Ov(t) ? e.filter((n) => !hi.has(n.beat)) : e, ut = { reach: 40, room: 6 }, Tv = (e, t) => t <= e - ut.reach + 2, J5 = (e, t, n) => Tv(e, n) ? t - ut.reach : e - ut.reach - ut.room, Z5 = (e, t, n, s) => s > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, $s = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, X5 = (e) => Ut(e() < $s.longShare ? $s.long : $s.short, e), Iv = 2 * it.width;
function Q5(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= Iv ? o : e + (o - e + a / 2) % a;
}
const Rv = 60, e4 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= Rv, Ao = "[data-figure-home]", mn = () => {
  var t;
  const e = document.querySelector(Ao);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ao)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Bv = "[data-figure-docked-bars]", Lv = "[data-figure-chat-foot]", Dv = [0.85, 0.6, 0.35, 0.15], Nv = ["question", "waiting", "suggestion"], t4 = (e, t) => Nv.find((n) => e[n] > 0 && t[n] === "behind") || null;
function n4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Pv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", jv = "[data-figure-newest]";
function fi() {
  var s, a;
  const e = (s = mn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(jv), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
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
function an(e, t, n = fi()) {
  if (!e || !n) return !0;
  const s = st(e, t), a = es(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ae.top * t.size, bottom: s.top + Ae.bottom * t.size }, r = wt.gap;
  return !Qn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function s4(e, t, n, s = fi()) {
  if (!s || an(t, e, s)) return null;
  const a = es(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = Mt(), l = t.posture === "stand" ? Ea * e.size : bi * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - wt.gap - r, s.right + wt.gap + o].map((g) => ({ ...t, x: g })).filter((g) => g.x >= u && g.x <= d && an(g, e, s) && my(g, e)).sort((g, v) => Math.abs(g.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const Ms = 0.26, mi = 0.54, qv = 1.25 / 5.4, pn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ms, travels: "stand" },
  lounge: { drop: Ms, travels: "stand" },
  composed: { drop: Ms, travels: "stand" },
  hang: { drop: mi, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, a4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * qv * Math.cos(t * Math.PI / 180),
  y: 1 - n - mi
}), zt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Fv = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), o4 = (e, t) => (e === "sit" ? Fv.has(t) : zt.has(e)) ? e : "stand";
function r4(e, t) {
  return e.facing === t.facing || !zt.has(e.posture) && !zt.has(t.posture) ? t : { posture: "stand", facing: zt.has(e.posture) ? e.facing : t.facing };
}
const i4 = 0.25, l4 = (e, t) => zt.has(e) && pn[t].drop === 0, pi = 2, Wv = 90, Hv = 180, Uv = 140, zv = 280, Vv = 420, Gv = 0.25, Kv = 290, Yv = 600, Jv = "cubic-bezier(0.2, 0.7, 0.4, 1)", Zv = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ss = 5;
function qn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: g = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ss) return null;
  (r || i) && (o = Math.max(o, pi));
  const v = o > 1, I = Math.abs(t.x - e.x), M = I < Ss ? 0 : I / (Wv * o) * 1e3, _ = Math.min(M, v ? Uv : Hv), x = Math.abs(t.y - e.y), T = t.y < e.y, Y = T && !g && fv(x, n, l, u, d, f), O = T ? Vv + Math.min(x, 400) * Gv : Math.sqrt(2 * x / xa) * 1e3, y = {
    x: t.x,
    y: t.y,
    ms: x > Ss ? Y ? Yv : O : 0,
    lead: Y ? Kv : T ? zv : 0,
    easing: T ? Jv : Zv,
    hopping: !0,
    clip: Y ? "backflip" : T ? "jump" : "fall"
  }, $ = { x: t.x, y: t.y, ms: M + _, lead: 0, easing: "linear", ramp: _, ...v ? { clip: "run" } : {} }, E = g ? Xv(t, n) : y, S = T && !s ? [{ ...$, y: e.y }, E] : [{ ...y, x: e.x }, $];
  return { way: Math.sign(t.x - e.x) || 1, legs: S, lands: !a, pace: o, running: v };
}
const Xv = (e, t) => ({ x: e.x, y: e.y, ms: Se.pogo.frames / Se.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Qv = (e, t) => e.postures.includes(t) ? t : e.postures[0], c4 = (e, t, n) => e.posture === "walk" && n ? "walk" : Qv(e.clip, t), st = (e, { size: t, below: n }, s = e.posture) => {
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
function u4(e, t, n = Mt()) {
  const s = st(e, t);
  return s.left >= n.left + Co && s.right <= n.right - Co;
}
function _a(e, t, n = Mt()) {
  const s = st(e, t), a = s.right - s.left, o = es(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - _n && i <= n.right + _n && s.top >= n.top - _n && l <= n.bottom + _n;
}
const Fn = [0.35, 0.5, 0.65], Wn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ae = { left: Fn[0], right: Fn.at(-1), top: Wn[0], bottom: Wn.at(-1) }, ey = 0.24;
function es(e) {
  if (e.posture === "stand") return { left: Ae.left, right: Ae.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + ey * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ae.left, t), right: Math.max(Ae.right, t) };
}
function ty(e, { size: t }, n = Mt()) {
  const s = es(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Ea = (Ae.right - Ae.left) / 2 + 0.08;
function d4(e, t) {
  return e === "hang" ? Ae : { ...Ae, bottom: Math.min(Ae.bottom, 1 - t - pn[e].drop) };
}
const ny = "[data-figure-agent]";
function gi(e, t, n = "", s = "") {
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
const vi = (e) => Wn.flatMap(
  (t) => Fn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Aa(e, t, n = "") {
  if (!an(e, t)) return Fn.length * Wn.length;
  const s = st(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Pv)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && Qn(a, l) && Sa(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return vi(a).filter(([i, l]) => r(i, l) || gi(i, l, n)).length;
}
function sy(e, t) {
  const n = st(e, t);
  return vi({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => gi(s, a, "", ny)).length;
}
const Oo = 4;
function h4(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Oo; o <= a; o += Oo)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!sy(i, e) && an(i, e)) return i;
    }
  return null;
}
function on(e, t, n) {
  const s = Mt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => _a(r, t, s) && an(r, t)).map((r) => ({ spot: r, covered: Aa(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const yi = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), ay = [0.5, 0.25, 0.75], oy = (e) => yi(e.getBoundingClientRect(), ay), wi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, ry = Ea, iy = (e, t, { size: n }, s = ry) => ki(e, wi[t], s * n, "stand");
function ki(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const ly = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, bi = 0.1, cy = (e, t, { size: n }) => ki(e, ly[t], bi * n, "sit"), uy = (e) => ((e + 180) % 360 + 360) % 360 - 180, _s = 60;
function f4(e, t) {
  const n = uy(t);
  return !e.aside || Math.abs(n) >= _s ? t : n < 0 ? 360 - _s : _s;
}
const Vt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, dy = (e) => [.../* @__PURE__ */ new Set([e, ...Vt.turns.map((t) => (t + 360) % 360)])];
function m4(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = dy(t), r = Vt.every[0] + s() * (Vt.every[1] - Vt.every[0]);
  return { face: t, from: a ? hy(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function hy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Vt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function p4(e, t) {
  const { element: n, edge: s } = ts(), a = ["left", "right"].map((i) => gn(cy(s, i, e), e)).filter((i) => n && _a(i, e) && !Aa(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function g4(e, t, { size: n }) {
  const s = (Ae.right - Ae.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - xi } : e;
}
const xi = 7;
function $i() {
  const e = [...document.querySelectorAll(Mv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function fy(e, t) {
  const n = st(e, t), s = n.right - n.left;
  return { left: n.left + Ae.left * s, right: n.left + Ae.right * s, top: n.top + Ae.top * s, bottom: n.bottom };
}
function my(e, t) {
  const n = $i();
  return !n || !Qn(fy(e, t), n);
}
const py = 4;
function ts() {
  const e = vn(), t = $i(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > py || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - xi - n, 0) } };
}
const v4 = ({ size: e, below: t }) => (1 - t) * e;
function gn(e, t) {
  const n = Mt(), { size: s, below: a } = t, o = pn[e.posture].drop * s;
  return { ...ty(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const ta = (e, t) => Object.keys(wi).map((n) => gn(iy(e, n, t), t)), Ca = (e, t) => yi(e, Dv).map((n) => gn(n, t)), Mi = (e, t, n) => on(e, t, n) ?? e[0];
function y4(e, t) {
  const { element: n, edge: s } = ts();
  return { ...Mi(ta(s, e), e, t), view: null, on: n };
}
function w4(e, t, n, s) {
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
  const e = mn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Bv);
  if (!t) return { ...ns(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const To = { within: 2 };
function k4(e) {
  const { element: t, docked: n, edge: s } = vn();
  if (!n || e.on !== t) return !0;
  const a = ns().edge;
  return s.left > a.left + To.within || s.left + s.width < a.left + a.width - To.within;
}
const gy = "[data-figure-closing]";
function b4() {
  var n;
  const { element: e, docked: t } = vn();
  return t && !!((n = e.firstElementChild) != null && n.matches(gy));
}
const Si = "[data-figure-progress]";
function x4(e) {
  const t = e.querySelector(Si);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function $4(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const vy = { across: 300, above: 380, below: 60 };
function M4(e) {
  const { across: t, above: n, below: s } = vy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: yy(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const yy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), _i = "[data-figure-bar]", na = { back: 144, along: 0.4 };
function S4(e) {
  const { element: t, docked: n, edge: s } = vn(), a = n ? t.querySelector(_i) : null;
  if (!(a != null && a.querySelector(Si))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...gn({ x: o - na.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function _4(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < na.along * s.size ? t.x + na.along * s.size : e.x, y: e.y, behind: !0 };
}
function E4(e) {
  const t = e.querySelector(_i), n = t == null ? void 0 : t.firstElementChild;
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
function A4(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = ns(), l = n === null ? wy(i, e, o === null ? t : { x: o, y: i.top }, s, a) : gn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function wy(e, t, n, s, a) {
  const o = Ca(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + it.width < a && l.x + s - ut.reach - ut.room >= r);
  return on(i.length ? i : o, t, n);
}
const ky = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function C4(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: g = !1 } = {}) {
  (o || r) && (a = Math.max(a, pi));
  const v = (Y) => {
    const O = st(Y, n, pn[Y.posture].travels);
    return { x: O.left, y: O.top };
  }, I = t.ladder ?? e.ladder;
  if (I && !(t.ladder && e.ladder)) return by(v(e), v(t), v({ ...I.foot, posture: "stand" }), I.way, !!t.ladder, n, a);
  const [M, ..._] = [e, ...l, t].map(v), x = qn(M, _[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: g }), T = _.slice(1).map((Y, O) => {
    var y;
    return (y = qn(_[O], Y, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : y.legs.find(($) => $.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...T.filter(Boolean)] };
}
function by(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / ky.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? qn(e, n, o.size, { pace: r }) : qn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function O4(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function T4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && on(oy(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = ts();
  return { ...Mi(Ca(a, t), t, n), view: null, on: s };
}
const xy = "[data-figure-bubble]", $y = 250;
let Gt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ei = 0;
const Pt = () => Gt, Es = /* @__PURE__ */ new WeakMap();
let My = 0;
function Oa(e) {
  return Es.has(e) || Es.set(e, `floor-${++My}`), Es.get(e);
}
const Sy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, _y = () => {
  var e, t;
  return ((t = (e = mn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Ey(e, t) {
  var s;
  const n = (s = e.querySelector(Lv)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Ay(e, t) {
  const n = e && Ey(e, t), s = e ? [...e.querySelectorAll(xy)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Sy(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Oa(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Cy = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= $y ? (t.top - s.top) / a * 1e3 : 0;
};
function Ai(e = Gt, t = performance.now()) {
  const n = Mt(), s = _y(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = vn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = ns();
  return u.element && l.push({ id: Oa(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Ay(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: Cy(e, d, t) }))) });
}
const sa = /* @__PURE__ */ new Set();
function Oy(e) {
  return sa.add(e), () => sa.delete(e);
}
function Ty() {
  Ci();
  const e = () => {
    Ei = requestAnimationFrame(e), !document.hidden && (Gt = Ai(Gt), sa.forEach((t) => t(Gt)));
  };
  e();
}
function Ci() {
  cancelAnimationFrame(Ei);
}
const Ta = 5, Iy = 56, Ry = { share: 0.6 }, By = (e) => -Math.sqrt(2 * xa * Ry.share * e), Rt = (e, t) => e.find((n) => n.id === t) ?? null;
function I4(e, t = Ai().floors) {
  const n = Rt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : Oa(e.on) : null, o = a && Rt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function Oi({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Pt().floors) {
  const u = Rt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || Ly(u, d, o)) && Dy(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Ia = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Ly = (e, t, n) => !Ia({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function R4(e, t = Pt().floors) {
  if (!Ia(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= Ta && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Dy(e, t, n = Pt().floors) {
  const s = Rt(n, "home");
  return e.posture === "hang" && s && st(e, t).bottom >= s.top ? !1 : _a(e, t);
}
function B4(e, t, n, s = Pt().floors) {
  const a = Oi(e, n, s);
  if (!e.home) return Ny(e, t, a, s);
  if (!a) return null;
  const o = Rt(s, "home"), r = a.y - t.y, i = r > Ta ? "dropping" : -r > Iy ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Ny(e, t, n, s) {
  const a = n ? Rt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: By(e.risen) };
  if (!n) return null;
  if (Ia(t) && n.y - t.y > Ta) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function L4(e, t, n) {
  const s = Ea * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function D4(e, t, n, s = Pt().floors) {
  const a = t && Oi(t, n, s);
  return a ? { ...e, ...a } : e;
}
const Py = ["data-kind"], jy = { class: "figure-floor-name" }, qy = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: pe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", jy, b(e.floor.kind), 1)
    ], 12, Py));
  }
}, Fy = /* @__PURE__ */ K(qy, [["__scopeId", "data-v-8f6132da"]]), Wy = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Hy = {
  __name: "FigureFloors",
  setup(e) {
    const t = Un(Pt().floors);
    let n = () => {
    };
    return Fe(() => {
      n = Oy((s) => t.value = s.floors), Ty();
    }), Ie(() => {
      n(), Ci();
    }), (s, a) => (c(), h("div", Wy, [
      (c(!0), h(G, null, se(t.value, (o) => (c(), V(Fy, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, N4 = /* @__PURE__ */ K(Hy, [["__scopeId", "data-v-e519168b"]]), As = (e) => typeof e == "number" ? e : Date.parse(e);
function P4(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: As(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => As(a.row.created_at) - As(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Uy = 3, Cs = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function zy(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Cs[n.grouping]) == null ? void 0 : s.call(Cs, e.row, n)) || "";
}
function Vy(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function j4(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Uy ? [Vy(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = zy(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Gy = 1e3;
function Ky() {
  const e = B(Date.now()), t = setInterval(() => e.value = Date.now(), Gy);
  return Dt(() => clearInterval(t)), e;
}
const Yy = ["datetime", "title"], ss = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ky(), s = L(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, b(z(Wf)(e.at, z(n))), 9, Yy));
  }
}, q4 = (e) => (t) => t.filter((n) => n.id !== e), F4 = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), W4 = (e) => (t) => [...t, e], H4 = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function U4(e) {
  const t = zn(), n = B(null), s = B("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const En = /* @__PURE__ */ new Map();
function Jy(e, t) {
  if (En.has(e)) return En.get(e);
  const n = t().finally(() => En.delete(e));
  return En.set(e, n), n;
}
function z4() {
  const e = zn(), t = B(null), n = B("");
  async function s() {
    const a = await Jy(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const Zy = { class: "cards-page" }, Xy = { class: "cards-bar" }, Qy = { class: "cards-count" }, ew = { class: "cards" }, tw = {
  key: 1,
  class: "cards-note"
}, nw = {
  key: 2,
  class: "cards-note"
}, sw = ["data-row", "onClick"], aw = { class: "card-head" }, ow = { class: "card-title" }, rw = { class: "card-foot" }, iw = {
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
    return (s, a) => (c(), h("div", Zy, [
      p("div", Xy, [
        p("span", Qy, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        D(ve, tt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: F(() => [
            D(ye, {
              name: "plus",
              size: 12
            }),
            le(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", ew, [
        e.loaded ? e.failure ? (c(), h("p", tw, b(e.failure), 1)) : e.rows.length ? C("", !0) : (c(), h("p", nw, "No " + b(e.noun) + "s yet", 1)) : (c(), V(Nt, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(G, null, se(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          p("span", aw, [
            D(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            le(" " + b(e.head(o)), 1),
            D(ss, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          p("span", ow, b(e.title(o)), 1),
          p("span", rw, b(e.foot(o)), 1)
        ], 8, sw))), 128))
      ]),
      me(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, V4 = /* @__PURE__ */ K(iw, [["__scopeId", "data-v-990e6b37"]]), Io = "newest";
function G4(e, { title: t, isOpen: n = null }) {
  const s = B(""), a = B(Io), o = B("all"), r = L(() => {
    const l = s.value.trim().toLowerCase(), u = e.value.filter((d) => (!l || JSON.stringify(d).toLowerCase().includes(l)) && (o.value === "all" || !n || n(d) === (o.value === "open")));
    return a.value === Io ? u : [...u].sort((d, f) => t(d).localeCompare(t(f)));
  }), i = L(() => !!s.value.trim() || !!n && o.value !== "all");
  return { words: s, order: a, state: o, shown: r, filtering: i, hasStates: !!n };
}
const lw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, cw = 40, uw = "top", dw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = Oe(Re, null)) == null ? void 0 : f.autoScroll, a = L(() => s === uw), o = B(null), r = B(!1), i = (g) => a.value ? g.scrollTop : g.scrollHeight - g.scrollTop - g.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= cw;
    }
    return be(() => n.rowCount, async () => {
      await Lt(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (g, v) => (c(), h("div", lw, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        me(g.$slots, "default", {}, void 0, !0)
      ], 34),
      D(Bt, {
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
            D(ye, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = le(" Newest ", -1))
          ], 512), [
            [Vi, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, K4 = /* @__PURE__ */ K(dw, [["__scopeId", "data-v-3accb764"]]), hw = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, fw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Oe(Re, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (c(), h("div", hw, [
      (c(!0), h(G, null, se(z(s), (i) => {
        var l;
        return c(), V(ve, {
          key: i.key,
          kind: "text",
          class: Z(["inner-tab", { on: ((l = e.active) == null ? void 0 : l.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: F(() => [
            le(b(i.label) + " " + b(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, Y4 = /* @__PURE__ */ K(fw, [["__scopeId", "data-v-cf3bb39f"]]), mw = {}, pw = { class: "menu-label" };
function gw(e, t) {
  return c(), h("span", pw, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const aa = /* @__PURE__ */ K(mw, [["render", gw], ["__scopeId", "data-v-aa955b3e"]]), vw = {
  class: "search-bar",
  "data-search-bar": ""
}, yw = { class: "search-bar-control" }, ww = ["value", "placeholder", "aria-label"], kw = ["aria-expanded"], bw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const s = e, a = n, o = Gi(), r = ((x = Oe(Re, null)) == null ? void 0 : x.search) ?? {}, i = L(() => r.placeholder || s.placeholder), l = r.context ?? [], u = B(null), d = B(null), f = B([]), g = L(() => f.value.length ? f.value[f.value.length - 1].next : l), v = L(() => !!o.menu || l.length > 0), I = (T) => {
      f.value = [], d.value = d.value ? null : T.currentTarget;
    };
    function M(T) {
      if (T.next.length) {
        f.value = [...f.value, T];
        return;
      }
      d.value = null, a("pick", T.click);
    }
    function _() {
      var T;
      a("update:modelValue", ""), (T = u.value) == null || T.focus();
    }
    return t({ focus: () => {
      var T;
      return (T = u.value) == null ? void 0 : T.focus();
    } }), (T, Y) => {
      var O;
      return c(), h("div", vw, [
        p("div", yw, [
          D(ye, {
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
            onInput: Y[0] || (Y[0] = (y) => a("update:modelValue", y.target.value)),
            onKeydown: Kt(_, ["esc"])
          }, null, 40, ww),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: _
          }, [
            D(ye, {
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
            onClick: I
          }, [
            D(ye, {
              name: "caret",
              size: 12
            })
          ], 8, kw)) : C("", !0)
        ]),
        (O = z(r).button) != null && O.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: Y[1] || (Y[1] = (y) => a("pick", z(r).button.click))
        }, b(z(r).button.title), 1)) : C("", !0),
        me(T.$slots, "default", {}, void 0, !0),
        d.value ? (c(), V(ka, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: Y[3] || (Y[3] = xe(() => {
          }, ["stop"])),
          onClose: Y[4] || (Y[4] = (y) => d.value = null)
        }, {
          default: F(() => [
            f.value.length ? (c(), V(It, {
              key: 0,
              "data-search-back": "",
              onClick: Y[2] || (Y[2] = (y) => f.value = f.value.slice(0, -1))
            }, {
              default: F(() => [
                le("‹ " + b(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : C("", !0),
            (c(!0), h(G, null, se(g.value, (y) => (c(), V(It, {
              key: y.title,
              description: y.subtext,
              "data-search-entry": y.title,
              onClick: ($) => M(y)
            }, {
              default: F(() => [
                le(b(y.title) + b(y.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? C("", !0) : me(T.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : C("", !0)
      ]);
    };
  }
}, xw = /* @__PURE__ */ K(bw, [["__scopeId", "data-v-5904a3de"]]), $w = {
  class: "list-tools",
  "data-list-tools": ""
}, Mw = {
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
    return (o, r) => (c(), h("div", $w, [
      D(xw, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": "",
        onPick: r[1] || (r[1] = (i) => n("pick", i))
      }, {
        menu: F(() => [
          D(aa, null, {
            default: F(() => [...r[2] || (r[2] = [
              le("Order", -1)
            ])]),
            _: 1
          }),
          (c(), h(G, null, se(s, (i) => D(It, {
            key: i.key,
            checked: e.tools.order.value === i.key,
            "data-list-order": i.key,
            onClick: (l) => e.tools.order.value = i.key
          }, {
            default: F(() => [
              le(b(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (c(), h(G, { key: 0 }, [
            D(aa, null, {
              default: F(() => [...r[3] || (r[3] = [
                le("Show", -1)
              ])]),
              _: 1
            }),
            (c(), h(G, null, se(a, (i) => D(It, {
              key: i.key,
              checked: e.tools.state.value === i.key,
              "data-list-state": i.key,
              onClick: (l) => e.tools.state.value = i.key
            }, {
              default: F(() => [
                le(b(i.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : C("", !0)
        ]),
        default: F(() => [
          me(o.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, J4 = /* @__PURE__ */ K(Mw, [["__scopeId", "data-v-24c1740c"]]);
function Z4() {
  const e = B(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Sw = 86400, oa = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function _w(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((oa(t) - oa(e)) / Sw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function X4(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = oa(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: _w(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Os = 280, Ts = 240, Is = 120, Ew = 6, Aw = 14, rn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Cw(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Ti(e, t) {
  const n = Math.max(0, Cw(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function Ow(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Aw}px)` }), e.offsetHeight, e.style.transition = `height ${Os}ms ${rn}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1;
  const u = () => {
    n() && (t.scrollTop = Ti(t, e));
    const d = a() - i;
    if (!l && d >= Os && (l = !0, e.style.transition = `opacity ${Ts}ms ease-out, transform ${Ts}ms ${rn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), d < Os + Ts) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function Q4(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Ew}px)` }), e.offsetHeight, e.style.transition = `opacity ${Is}ms ease-out, transform ${Is}ms ${rn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = Ti(t, e)), a() - r < Is) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const Tw = 140, An = 220, Iw = 5;
function ex({ gap: e = Tw, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, Iw);
    if (s = i.length > 0, !s) return;
    let l = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), l -= 1, l || t(o, e);
      });
  }
  const r = (i, l, u, d = Ow) => {
    if (!l.pane || !l.follows()) return u();
    const f = { el: i, options: l, done: u, arrival: d, display: i.style.display || "" };
    if (!s)
      return s = !0, d(i, l, () => a(f));
    i.style.display = "none", n.push(f);
  };
  return r.flush = () => {
    for (const i of n.splice(0))
      i.el.style.display = i.display, i.done();
  }, r;
}
function tx(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${An}ms ${rn}, opacity ${An}ms ease-in, margin ${An}ms ${rn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, An);
}
const Ii = "chat.pins.minimised", Rn = B(Yt(Ii, !1));
function Ro(e) {
  Rn.value = e, Vn(Ii, e);
}
function Rw(e) {
  const t = L(() => e()), n = L(() => Rn.value ? [] : e()), s = () => Ro(!Rn.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => bt(o) > a).length,
    (o, r) => o > r && Ro(!1)
  ), { pins: t, visible: n, minimised: Rn, toggle: s };
}
const Bw = ["title"], Lw = {
  key: 0,
  class: "pins-count"
}, Dw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Rw(() => t.pinRows);
    return (o, r) => z(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = xe((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      D(ye, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (c(), h("span", Lw, b(z(n).length), 1)) : C("", !0)
    ], 10, Bw)) : C("", !0);
  }
}, nx = /* @__PURE__ */ K(Dw, [["__scopeId", "data-v-d073c504"]]), Nw = ["title"], Pw = ["title"], jw = { class: "diff-card-dir" }, qw = { class: "diff-card-name" }, Fw = ["title"], Ww = ["title"], Hw = {
  key: 0,
  class: "diff-card-note"
}, Uw = ["href"], zw = ["src", "alt"], Vw = { class: "diff-card-rows" }, Gw = { class: "diff-row-num" }, Kw = { class: "diff-row-sign" }, Yw = { class: "diff-row-code" }, Jw = {
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
    function o(A) {
      (A.metaKey || A.ctrlKey) && (A.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = L(() => n.path.lastIndexOf("/") + 1), u = L(() => n.path.slice(0, l.value)), d = L(() => n.path.slice(l.value)), f = L(() => n.kind === "deleted"), g = L(() => r[n.kind]), v = L(() => new Set(n.rows.filter((A) => A.line_type === "add").map((A) => A.line))), I = B("after"), M = L(() => I.value === "before" ? n.whole.old : n.whole.text), _ = L(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map((A, k) => ({ line_type: I.value === "after" && v.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: A })) : n.rows.filter(
      (A) => !(n.editsOnly && ["ctx", "fold"].includes(A.line_type)) && !(n.hideRemovals && A.line_type === "del")
    )), x = B(!1), T = L(() => n.lines && !x.value && !n.whole), Y = L(() => T.value ? _.value.slice(0, n.lines) : _.value), O = L(() => _.value.length - Y.value.length), y = (A) => A.line === null || A.line_type === "del" ? "" : A.line, $ = (A) => A.line_type === "fold" ? A.hidden ? `⋯ ${A.hidden} lines` : "⋯" : A.text, E = B(null), S = B(null);
    let w = null;
    return Fe(() => {
      if (!S.value) return;
      let A = !0;
      w = new ResizeObserver(() => {
        !E.value || !S.value || (E.value.style.transition = A ? "none" : "", E.value.style.height = `${S.value.offsetHeight}px`, A = !1);
      }), w.observe(S.value);
    }), Ie(() => w && w.disconnect()), (A, k) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (m) => !f.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${z(a)}-click to open it`,
          onClick: o
        }, [
          p("span", jw, b(u.value), 1),
          p("span", qw, b(d.value), 1),
          g.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.kind])
          }, b(g.value), 3)) : C("", !0)
        ], 8, Pw),
        p("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        p("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        D(ss, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: I.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = xe((m) => I.value = I.value === "after" ? "before" : "after", ["stop"]))
        }, b(I.value === "after" ? "After" : "Before"), 9, Fw)) : C("", !0),
        f.value ? C("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = xe((m) => s("whole"), ["stop"]))
        }, [
          D(ye, {
            name: "file",
            size: 12
          })
        ], 10, Ww))
      ], 8, Nw),
      e.whole && e.whole.error ? (c(), h("p", Hw, b(e.whole.error), 1)) : C("", !0),
      !f.value && !e.folded ? (c(), h(G, { key: 1 }, [
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
          }, null, 8, zw)
        ], 8, Uw)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: E,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: S,
            class: "diff-card-diff"
          }, [
            p("div", Vw, [
              (c(!0), h(G, null, se(Y.value, (m, N) => (c(), h("div", {
                key: N,
                class: Z(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                p("span", Gw, b(y(m)), 1),
                p("span", Kw, b(i[m.line_type]), 1),
                p("span", Yw, b($(m)), 1)
              ], 2))), 128)),
              O.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = xe((m) => x.value = !0, ["stop"]))
              }, b(O.value) + " more " + b(O.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, sx = /* @__PURE__ */ K(Jw, [["__scopeId", "data-v-fed58c18"]]), Zw = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), V(ve, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: F(() => [
        D(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Je = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Xw = {
  draft: [{ word: "ready", label: "Mark ready" }, Je],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Je],
  approved: [{ word: "start", label: "Start", main: !0 }, Je],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Je],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Je],
  completed: [],
  cancelled: []
}, Qw = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Je],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Je],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, Je],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Je],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, e2 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], t2 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], n2 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], s2 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], a2 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }], o2 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? a2(t) : e === "agent" ? [...n2(t), ...t2(t)] : e === "check" ? s2(t) : e === "question" ? e2(t) : ((n = { plan: Xw, task: Qw }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, r2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, i2 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, l2 = { class: "ask-text" }, c2 = ["placeholder", "aria-label"], u2 = ["placeholder", "aria-label"], d2 = {
  key: 3,
  class: "moves"
}, h2 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = L(() => o2(s.kind, s.row)), r = B(""), i = B(null), l = B(""), u = B("");
    be(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(v, I = "") {
      const M = await s.read([v.noun ?? s.kind, v.word, String(s.id), ...v.flag ? [v.flag, I] : v.positional ? [I] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = M.ok ? "" : M.error, M.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (v) => v.confirm ? i.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (i.value = v, l.value = "") : d(v), g = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (v, I) => {
      var M;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", r2, b(r.value), 1)) : C("", !0),
        (M = i.value) != null && M.confirm ? (c(), h("div", i2, [
          p("span", l2, b(i.value.confirm), 1),
          D(ve, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: I[0] || (I[0] = (_) => d(i.value))
          }, {
            default: F(() => [
              le(b(i.value.label), 1)
            ]),
            _: 1
          }),
          D(ve, {
            small: "",
            kind: "ghost",
            onClick: I[1] || (I[1] = (_) => i.value = null)
          }, {
            default: F(() => [...I[7] || (I[7] = [
              le("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: xe(g, ["prevent"])
        }, [
          dt(p("input", {
            "onUpdate:modelValue": I[2] || (I[2] = (_) => l.value = _),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: I[3] || (I[3] = Kt(xe((_) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, c2), [
            [Ds, l.value]
          ]),
          i.value.opener ? dt((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": I[4] || (I[4] = (_) => u.value = _),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: I[5] || (I[5] = Kt(xe((_) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, u2)), [
            [Ds, u.value]
          ]) : C("", !0),
          D(ve, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: F(() => [
              le(b(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          D(ve, {
            small: "",
            kind: "ghost",
            onClick: I[6] || (I[6] = (_) => i.value = null)
          }, {
            default: F(() => [...I[8] || (I[8] = [
              le("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", d2, [
          (c(!0), h(G, null, se(o.value, (_) => (c(), V(ve, {
            key: _.word,
            small: !_.bordered,
            bordered: _.bordered,
            icon: _.icon,
            kind: _.main ? "primary" : "ghost",
            "data-move": _.word,
            onClick: (x) => f(_)
          }, {
            default: F(() => [
              le(b(_.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : C("", !0);
    };
  }
}, f2 = /* @__PURE__ */ K(h2, [["__scopeId", "data-v-ed426b4f"]]), m2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), p2 = (e) => m2.has(e), ra = (e) => p2(e) ? "done" : e, g2 = { class: "facts" }, v2 = { class: "fact wide" }, y2 = { class: "fact-value" }, w2 = {
  key: 0,
  class: "fact"
}, k2 = { class: "fact-value" }, b2 = {
  key: 1,
  class: "fact"
}, x2 = { class: "fact-value" }, $2 = { class: "fact wide" }, M2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, S2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Nn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return c(), h("div", g2, [
        p("div", v2, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", y2, b((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", w2, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", k2, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.state === "started" && e.task.holder_id ? (c(), h("div", b2, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", x2, "Agent " + b(e.task.holder_id), 1)
        ])) : C("", !0),
        p("div", $2, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          D(Lr, {
            options: z(n),
            value: String(z(Br)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (l) => s("priority", l))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", M2, b(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, _2 = /* @__PURE__ */ K(S2, [["__scopeId", "data-v-2018762d"]]), E2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, A2 = { ...E2, done: "Completed" }, C2 = { class: "task-status-icon" }, O2 = ["width", "height", "aria-label"], T2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", C2, [
      D(Bt, {
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
            "aria-label": z(A2)[e.status]
          }, [
            D(ln, { value: e.status }, {
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
          ], 10, O2))
        ]),
        _: 1
      })
    ]));
  }
}, Ri = /* @__PURE__ */ K(T2, [["__scopeId", "data-v-2ab7e404"]]), I2 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, R2 = ["onClick"], B2 = { class: "wait-id" }, L2 = { class: "wait-title" }, D2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, N2 = { class: "text" }, P2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, j2 = 180, q2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = B(!1);
    return (a, o) => (c(), h(G, null, [
      e.task.waits.length ? (c(), h("section", I2, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (c(!0), h(G, null, se(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          D(Ri, {
            status: z(ra)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", B2, b(r.id), 1),
          p("span", L2, b(r.title), 1)
        ], 8, R2))), 128))
      ])) : C("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", D2, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", N2, b(e.task.outcome), 1)
      ])) : C("", !0),
      e.task.brief ? (c(), h("section", P2, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: Z(["text", { clamped: !s.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > j2 && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : C("", !0)
      ])) : C("", !0)
    ], 64));
  }
}, F2 = /* @__PURE__ */ K(q2, [["__scopeId", "data-v-8e4d95ae"]]), W2 = {
  class: "task-details",
  "data-task-details": ""
}, H2 = { class: "since" }, U2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, z2 = { class: "text" }, V2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, G2 = {
  key: 1,
  class: "note"
}, K2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Y2 = { class: "text" }, J2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, s = (a) => a.slice(0, 1).toUpperCase() + a.slice(1);
    return (a, o) => {
      var r;
      return c(), h("div", W2, [
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
            D(Ri, {
              status: z(ra)(e.task.state)
            }, null, 8, ["status"]),
            le(" " + b(s(e.task.state)), 1)
          ]),
          p("span", H2, [
            o[3] || (o[3] = le(" since ", -1)),
            D(ss, {
              at: z(ma)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", U2, [
          o[4] || (o[4] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
          p("p", z2, b(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", V2, "Opens by itself when " + b(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", G2, "Nothing opens it by itself. Unblock it when that is done."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", K2, [
          o[5] || (o[5] = p("span", { class: "label" }, "Why it was cancelled", -1)),
          p("p", Y2, b(e.task.reason), 1)
        ])) : C("", !0),
        D(_2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (i) => n("priority", i))
        }, null, 8, ["task", "place", "refusal"]),
        D(F2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (i) => n("select", i))
        }, null, 8, ["task"])
      ]);
    };
  }
}, Z2 = /* @__PURE__ */ K(J2, [["__scopeId", "data-v-4a8b1505"]]), X2 = {
  class: "task-log",
  "aria-label": "Task log"
}, Q2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, ek = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, tk = { class: "entries" }, nk = ["datetime"], sk = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, ak = {
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
    ), Dt(() => {
      i += 1;
    }), (u, d) => (c(), h("section", X2, [
      o.value ? (c(), V(Nt, { key: 0 })) : r.value ? (c(), h(G, { key: 1 }, [
        p("p", Q2, b(r.value), 1),
        D(ve, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => l(s.value))
        }, {
          default: F(() => [...d[3] || (d[3] = [
            le("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(G, { key: 2 }, [
        n.value.length ? C("", !0) : (c(), h("p", ek, "No log entries yet.")),
        p("ol", tk, [
          (c(!0), h(G, null, se(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            p("time", {
              datetime: f.created_at
            }, b(new Date(f.created_at).toLocaleString()), 9, nk),
            p("p", null, b(f.line), 1)
          ]))), 128))
        ]),
        s.value > 1 || !a.value ? (c(), h("nav", sk, [
          D(ve, {
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
          p("span", null, "Page " + b(s.value), 1),
          D(ve, {
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
        ])) : C("", !0)
      ], 64))
    ]));
  }
}, ok = /* @__PURE__ */ K(ak, [["__scopeId", "data-v-953605e5"]]), rk = { class: "comment-side-head" }, ik = {
  key: 0,
  class: "comment-none"
}, lk = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", rk, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        D(Yn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? C("", !0) : (c(), h("p", ik, "No comments yet")),
      (c(!0), h(G, null, se(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, b(e.words(s)), 1))), 128))
    ], 2));
  }
}, ck = /* @__PURE__ */ K(lk, [["__scopeId", "data-v-19fdbdd4"]]);
var Lo;
/Mac|iPhone|iPad/.test(((Lo = navigator.userAgentData) == null ? void 0 : Lo.platform) || navigator.platform);
function uk(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const dk = ["placeholder"], hk = { class: "actions" }, fk = { class: "error" }, mk = {
  key: 1,
  class: "card closed"
}, pk = { class: "mark" }, gk = { class: "prompt" }, vk = {
  key: 0,
  class: "draft"
}, yk = {
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
    const s = e, a = n, o = Bs(e, "draft"), r = Bs(e, "error"), i = B(!!r.value), l = B(!1), u = B(!1), d = B(null);
    async function f() {
      var I, M;
      i.value = !0, l.value = !1, await Lt(), (M = ((I = d.value) == null ? void 0 : I.querySelector("input")) || d.value) == null || M.focus();
    }
    function g() {
      i.value = !1, r.value = "";
    }
    async function v() {
      const I = o.value.trim();
      if (!(!I || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(I), i.value = !1, l.value = !0;
        } catch (M) {
          o.value = I, r.value = M.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (I, M) => (c(), h("div", {
      class: Z(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(v, ["prevent"]),
        onKeydown: Kt(g, ["esc"])
      }, [
        me(I.$slots, "who", {}, void 0, !0),
        dt(p("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": M[0] || (M[0] = (_) => o.value = _),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: M[1] || (M[1] = Kt((_) => z(uk)(_, v), ["enter"]))
        }, null, 40, dk), [
          [Ds, o.value]
        ]),
        p("div", hk, [
          p("span", fk, b(r.value), 1),
          D(ve, {
            small: "",
            onClick: g
          }, {
            default: F(() => [...M[3] || (M[3] = [
              le("Cancel", -1)
            ])]),
            _: 1
          }),
          D(ve, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: F(() => [...M[4] || (M[4] = [
              le("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", mk, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          p("span", pk, [
            D(ye, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", gk, b(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", vk, "Draft kept")) : C("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: M[2] || (M[2] = (_) => a("show"))
        }, [
          p("span", null, b(z(im)(e.count, "comment")), 1),
          D(ye, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, wk = /* @__PURE__ */ K(yk, [["__scopeId", "data-v-81f478d2"]]);
function kk(e, t) {
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
      throw n.value = n.value.filter((I) => I !== g && I.id !== g.id), new Error(v.error);
    await i();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const bk = { class: "top" }, xk = {
  class: "crumb",
  "data-task-crumb": ""
}, $k = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Mk = {
  key: 1,
  class: "body"
}, Sk = { class: "summary" }, _k = { class: "stamp" }, Ek = {
  class: "title",
  "data-resource-title": ""
}, Ak = {
  class: "tabs",
  "data-task-tabs": ""
}, Ck = { class: "panels" }, Ok = {
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
    ], v = kk(
      () => o.value ? { kind: "task", id: s.id, title: o.value.title } : {},
      (O) => s.read(O)
    );
    let I = 0;
    const M = L(() => {
      var O;
      return (O = r.value) != null && O.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function _() {
      const O = ++I, [y, $] = await Promise.all([
        s.read(["task", "inspect", String(s.id)]),
        s.read(["plan", "place", String(s.id)])
      ]);
      O === I && (i.value = y.ok ? "" : y.error, o.value = y.ok ? y.value : null, r.value = $.ok ? $.value : null);
    }
    be(
      () => s.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", _();
      },
      { immediate: !0 }
    ), be(() => s.changes, _), be(v.open, (O) => {
      O && (f.value = "comments");
    });
    async function x(O) {
      const y = o.value.priority;
      o.value.priority = Number(O);
      const $ = await s.read(["task", "edit", String(s.id), "--priority", O]);
      if (l.value = $.ok ? "" : $.error, $.ok) return _();
      o.value.priority = y;
    }
    function T(O) {
      u.value = null, d.value.press(O);
    }
    const Y = (O) => {
      var y;
      return ((y = d.value) == null ? void 0 : y.moves.length) && (u.value = O);
    };
    return t({ openStatus: Y }), (O, y) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", bk, [
        e.backed ? (c(), V(Zw, {
          key: 0,
          onBack: y[0] || (y[0] = ($) => a("back"))
        })) : C("", !0),
        p("span", xk, b(M.value), 1),
        y[9] || (y[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(G, { key: 1 }, [
          D(ve, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: y[1] || (y[1] = ($) => a("step", -1))
          }, {
            default: F(() => [
              D(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          D(ve, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: y[2] || (y[2] = ($) => a("step", 1))
          }, {
            default: F(() => [
              D(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : C("", !0),
        D(ve, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: y[3] || (y[3] = ($) => a("close"))
        }, {
          default: F(() => [
            D(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", $k, b(i.value), 1)) : o.value ? (c(), h(G, { key: 2 }, [
        D(f2, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: _
        }, null, 8, ["id", "row", "read"]),
        p("header", Sk, [
          p("div", _k, [
            le(" Task " + b(o.value.id) + " · updated ", 1),
            D(ss, {
              at: z(ma)(o.value)
            }, null, 8, ["at"])
          ]),
          p("h3", Ek, b(o.value.title), 1)
        ]),
        p("div", Ak, [
          D(Lr, {
            options: g,
            value: f.value,
            onPick: y[4] || (y[4] = ($) => f.value = $)
          }, null, 8, ["value"])
        ]),
        p("div", Ck, [
          D(ln, { value: f.value }, {
            details: F(() => [
              D(Z2, {
                task: o.value,
                place: r.value,
                refusal: l.value,
                onStatus: Y,
                onPriority: x,
                onSelect: y[5] || (y[5] = ($) => a("select", $))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: F(() => [
              D(ck, {
                below: "",
                comments: z(v).comments.value,
                words: z(v).words,
                onClose: y[6] || (y[6] = ($) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: F(() => [
              D(ok, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        D(wk, {
          send: z(v).send,
          count: z(v).comments.value.length,
          onShow: y[7] || (y[7] = ($) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", Mk, [
        D(Nt)
      ])),
      u.value ? (c(), V(ka, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: y[8] || (y[8] = ($) => u.value = null)
      }, {
        default: F(() => [
          D(aa, null, {
            default: F(() => [
              le("Change the status of task " + b(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(G, null, se(d.value.moves, ($) => (c(), V(It, {
            key: $.word,
            onClick: (E) => T($)
          }, {
            default: F(() => [
              le(b($.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : C("", !0)
    ], 2));
  }
}, ax = /* @__PURE__ */ K(Ok, [["__scopeId", "data-v-43f3b122"]]);
function Tk(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Rs = { exports: {} }, Bo;
function Ik() {
  return Bo || (Bo = 1, (function(e, t) {
    var n = (function() {
      var s = function(y, $) {
        var E = 236, S = 17, w = y, A = o[$], k = null, m = 0, N = null, P = [], W = {}, re = function(j, q) {
          m = w * 4 + 17, k = (function(R) {
            for (var H = new Array(R), U = 0; U < R; U += 1) {
              H[U] = new Array(R);
              for (var X = 0; X < R; X += 1)
                H[U][X] = null;
            }
            return H;
          })(m), ce(0, 0), ce(m - 7, 0), ce(0, m - 7), ee(), Q(), Le(j, q), w >= 7 && J(j), N == null && (N = Bi(w, A, P)), Ge(N, q);
        }, ce = function(j, q) {
          for (var R = -1; R <= 7; R += 1)
            if (!(j + R <= -1 || m <= j + R))
              for (var H = -1; H <= 7; H += 1)
                q + H <= -1 || m <= q + H || (0 <= R && R <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (R == 0 || R == 6) || 2 <= R && R <= 4 && 2 <= H && H <= 4 ? k[j + R][q + H] = !0 : k[j + R][q + H] = !1);
        }, de = function() {
          for (var j = 0, q = 0, R = 0; R < 8; R += 1) {
            re(!0, R);
            var H = i.getLostPoint(W);
            (R == 0 || j > H) && (j = H, q = R);
          }
          return q;
        }, Q = function() {
          for (var j = 8; j < m - 8; j += 1)
            k[j][6] == null && (k[j][6] = j % 2 == 0);
          for (var q = 8; q < m - 8; q += 1)
            k[6][q] == null && (k[6][q] = q % 2 == 0);
        }, ee = function() {
          for (var j = i.getPatternPosition(w), q = 0; q < j.length; q += 1)
            for (var R = 0; R < j.length; R += 1) {
              var H = j[q], U = j[R];
              if (k[H][U] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? k[H + X][U + ae] = !0 : k[H + X][U + ae] = !1;
            }
        }, J = function(j) {
          for (var q = i.getBCHTypeNumber(w), R = 0; R < 18; R += 1) {
            var H = !j && (q >> R & 1) == 1;
            k[Math.floor(R / 3)][R % 3 + m - 8 - 3] = H;
          }
          for (var R = 0; R < 18; R += 1) {
            var H = !j && (q >> R & 1) == 1;
            k[R % 3 + m - 8 - 3][Math.floor(R / 3)] = H;
          }
        }, Le = function(j, q) {
          for (var R = A << 3 | q, H = i.getBCHTypeInfo(R), U = 0; U < 15; U += 1) {
            var X = !j && (H >> U & 1) == 1;
            U < 6 ? k[U][8] = X : U < 8 ? k[U + 1][8] = X : k[m - 15 + U][8] = X;
          }
          for (var U = 0; U < 15; U += 1) {
            var X = !j && (H >> U & 1) == 1;
            U < 8 ? k[8][m - U - 1] = X : U < 9 ? k[8][15 - U - 1 + 1] = X : k[8][15 - U - 1] = X;
          }
          k[m - 8][8] = !j;
        }, Ge = function(j, q) {
          for (var R = -1, H = m - 1, U = 7, X = 0, ae = i.getMaskFunction(q), ne = m - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (k[H][ne - ke] == null) {
                  var Me = !1;
                  X < j.length && (Me = (j[X] >>> U & 1) == 1);
                  var ie = ae(H, ne - ke);
                  ie && (Me = !Me), k[H][ne - ke] = Me, U -= 1, U == -1 && (X += 1, U = 7);
                }
              if (H += R, H < 0 || m <= H) {
                H -= R, R = -R;
                break;
              }
            }
        }, St = function(j, q) {
          for (var R = 0, H = 0, U = 0, X = new Array(q.length), ae = new Array(q.length), ne = 0; ne < q.length; ne += 1) {
            var ke = q[ne].dataCount, Me = q[ne].totalCount - ke;
            H = Math.max(H, ke), U = Math.max(U, Me), X[ne] = new Array(ke);
            for (var ie = 0; ie < X[ne].length; ie += 1)
              X[ne][ie] = 255 & j.getBuffer()[ie + R];
            R += ke;
            var De = i.getErrorCorrectPolynomial(Me), Ne = u(X[ne], De.getLength() - 1), Ra = Ne.mod(De);
            ae[ne] = new Array(De.getLength() - 1);
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
        }, Bi = function(j, q, R) {
          for (var H = d.getRSBlocks(j, q), U = f(), X = 0; X < R.length; X += 1) {
            var ae = R[X];
            U.put(ae.getMode(), 4), U.put(ae.getLength(), i.getLengthInBits(ae.getMode(), j)), ae.write(U);
          }
          for (var ne = 0, X = 0; X < H.length; X += 1)
            ne += H[X].dataCount;
          if (U.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + U.getLengthInBits() + ">" + ne * 8 + ")";
          for (U.getLengthInBits() + 4 <= ne * 8 && U.put(0, 4); U.getLengthInBits() % 8 != 0; )
            U.putBit(!1);
          for (; !(U.getLengthInBits() >= ne * 8 || (U.put(E, 8), U.getLengthInBits() >= ne * 8)); )
            U.put(S, 8);
          return St(U, H);
        };
        W.addData = function(j, q) {
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
              R = I(j);
              break;
            case "Kanji":
              R = M(j);
              break;
            default:
              throw "mode:" + q;
          }
          P.push(R), N = null;
        }, W.isDark = function(j, q) {
          if (j < 0 || m <= j || q < 0 || m <= q)
            throw j + "," + q;
          return k[j][q];
        }, W.getModuleCount = function() {
          return m;
        }, W.make = function() {
          if (w < 1) {
            for (var j = 1; j < 40; j++) {
              for (var q = d.getRSBlocks(j, A), R = f(), H = 0; H < P.length; H++) {
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
          re(!1, de());
        }, W.createTableTag = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var R = "";
          R += '<table style="', R += " border-width: 0px; border-style: none;", R += " border-collapse: collapse;", R += " padding: 0px; margin: " + q + "px;", R += '">', R += "<tbody>";
          for (var H = 0; H < W.getModuleCount(); H += 1) {
            R += "<tr>";
            for (var U = 0; U < W.getModuleCount(); U += 1)
              R += '<td style="', R += " border-width: 0px; border-style: none;", R += " border-collapse: collapse;", R += " padding: 0px; margin: 0px;", R += " width: " + j + "px;", R += " height: " + j + "px;", R += " background-color: ", R += W.isDark(H, U) ? "#000000" : "#ffffff", R += ";", R += '"/>';
            R += "</tr>";
          }
          return R += "</tbody>", R += "</table>", R;
        }, W.createSvgTag = function(j, q, R, H) {
          var U = {};
          typeof arguments[0] == "object" && (U = arguments[0], j = U.cellSize, q = U.margin, R = U.alt, H = U.title), j = j || 2, q = typeof q > "u" ? j * 4 : q, R = typeof R == "string" ? { text: R } : R || {}, R.text = R.text || null, R.id = R.text ? R.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var X = W.getModuleCount() * j + q * 2, ae, ne, ke, Me, ie = "", De;
          for (De = "l" + j + ",0 0," + j + " -" + j + ",0 0,-" + j + "z ", ie += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ie += U.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ie += ' viewBox="0 0 ' + X + " " + X + '" ', ie += ' preserveAspectRatio="xMinYMin meet"', ie += H.text || R.text ? ' role="img" aria-labelledby="' + _t([H.id, R.id].join(" ").trim()) + '"' : "", ie += ">", ie += H.text ? '<title id="' + _t(H.id) + '">' + _t(H.text) + "</title>" : "", ie += R.text ? '<description id="' + _t(R.id) + '">' + _t(R.text) + "</description>" : "", ie += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ie += '<path d="', ke = 0; ke < W.getModuleCount(); ke += 1)
            for (Me = ke * j + q, ae = 0; ae < W.getModuleCount(); ae += 1)
              W.isDark(ke, ae) && (ne = ae * j + q, ie += "M" + ne + "," + Me + De);
          return ie += '" stroke="transparent" fill="black"/>', ie += "</svg>", ie;
        }, W.createDataURL = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var R = W.getModuleCount() * j + q * 2, H = q, U = R - q;
          return O(R, R, function(X, ae) {
            if (H <= X && X < U && H <= ae && ae < U) {
              var ne = Math.floor((X - H) / j), ke = Math.floor((ae - H) / j);
              return W.isDark(ke, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, W.createImgTag = function(j, q, R) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var H = W.getModuleCount() * j + q * 2, U = "";
          return U += "<img", U += ' src="', U += W.createDataURL(j, q), U += '"', U += ' width="', U += H, U += '"', U += ' height="', U += H, U += '"', R && (U += ' alt="', U += _t(R), U += '"'), U += "/>", U;
        };
        var _t = function(j) {
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
        }, Li = function(j) {
          var q = 1;
          j = typeof j > "u" ? q * 2 : j;
          var R = W.getModuleCount() * q + j * 2, H = j, U = R - j, X, ae, ne, ke, Me, ie = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, De = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ne = "";
          for (X = 0; X < R; X += 2) {
            for (ne = Math.floor((X - H) / q), ke = Math.floor((X + 1 - H) / q), ae = 0; ae < R; ae += 1)
              Me = "█", H <= ae && ae < U && H <= X && X < U && W.isDark(ne, Math.floor((ae - H) / q)) && (Me = " "), H <= ae && ae < U && H <= X + 1 && X + 1 < U && W.isDark(ke, Math.floor((ae - H) / q)) ? Me += " " : Me += "█", Ne += j < 1 && X + 1 >= U ? De[Me] : ie[Me];
            Ne += `
`;
          }
          return R % 2 && j > 0 ? Ne.substring(0, Ne.length - R - 1) + Array(R + 1).join("▀") : Ne.substring(0, Ne.length - 1);
        };
        return W.createASCII = function(j, q) {
          if (j = j || 1, j < 2)
            return Li(q);
          j -= 1, q = typeof q > "u" ? j * 2 : q;
          var R = W.getModuleCount() * j + q * 2, H = q, U = R - q, X, ae, ne, ke, Me = Array(j + 1).join("██"), ie = Array(j + 1).join("  "), De = "", Ne = "";
          for (X = 0; X < R; X += 1) {
            for (ne = Math.floor((X - H) / j), Ne = "", ae = 0; ae < R; ae += 1)
              ke = 1, H <= ae && ae < U && H <= X && X < U && W.isDark(ne, Math.floor((ae - H) / j)) && (ke = 0), Ne += ke ? Me : ie;
            for (ne = 0; ne < j; ne += 1)
              De += Ne + `
`;
          }
          return De.substring(0, De.length - 1);
        }, W.renderTo2dContext = function(j, q) {
          q = q || 2;
          for (var R = W.getModuleCount(), H = 0; H < R; H++)
            for (var U = 0; U < R; U++)
              j.fillStyle = W.isDark(H, U) ? "black" : "white", j.fillRect(H * q, U * q, q, q);
        }, W;
      };
      s.stringToBytesFuncs = {
        default: function(y) {
          for (var $ = [], E = 0; E < y.length; E += 1) {
            var S = y.charCodeAt(E);
            $.push(S & 255);
          }
          return $;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(y, $) {
        var E = (function() {
          for (var w = T(y), A = function() {
            var Q = w.read();
            if (Q == -1) throw "eof";
            return Q;
          }, k = 0, m = {}; ; ) {
            var N = w.read();
            if (N == -1) break;
            var P = A(), W = A(), re = A(), ce = String.fromCharCode(N << 8 | P), de = W << 8 | re;
            m[ce] = de, k += 1;
          }
          if (k != $)
            throw k + " != " + $;
          return m;
        })(), S = 63;
        return function(w) {
          for (var A = [], k = 0; k < w.length; k += 1) {
            var m = w.charCodeAt(k);
            if (m < 128)
              A.push(m);
            else {
              var N = E[w.charAt(k)];
              typeof N == "number" ? (N & 255) == N ? A.push(N) : (A.push(N >>> 8), A.push(N & 255)) : A.push(S);
            }
          }
          return A;
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
        ], $ = 1335, E = 7973, S = 21522, w = {}, A = function(k) {
          for (var m = 0; k != 0; )
            m += 1, k >>>= 1;
          return m;
        };
        return w.getBCHTypeInfo = function(k) {
          for (var m = k << 10; A(m) - A($) >= 0; )
            m ^= $ << A(m) - A($);
          return (k << 10 | m) ^ S;
        }, w.getBCHTypeNumber = function(k) {
          for (var m = k << 12; A(m) - A(E) >= 0; )
            m ^= E << A(m) - A(E);
          return k << 12 | m;
        }, w.getPatternPosition = function(k) {
          return y[k - 1];
        }, w.getMaskFunction = function(k) {
          switch (k) {
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
              throw "bad maskPattern:" + k;
          }
        }, w.getErrorCorrectPolynomial = function(k) {
          for (var m = u([1], 0), N = 0; N < k; N += 1)
            m = m.multiply(u([1, l.gexp(N)], 0));
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
          for (var m = k.getModuleCount(), N = 0, P = 0; P < m; P += 1)
            for (var W = 0; W < m; W += 1) {
              for (var re = 0, ce = k.isDark(P, W), de = -1; de <= 1; de += 1)
                if (!(P + de < 0 || m <= P + de))
                  for (var Q = -1; Q <= 1; Q += 1)
                    W + Q < 0 || m <= W + Q || de == 0 && Q == 0 || ce == k.isDark(P + de, W + Q) && (re += 1);
              re > 5 && (N += 3 + re - 5);
            }
          for (var P = 0; P < m - 1; P += 1)
            for (var W = 0; W < m - 1; W += 1) {
              var ee = 0;
              k.isDark(P, W) && (ee += 1), k.isDark(P + 1, W) && (ee += 1), k.isDark(P, W + 1) && (ee += 1), k.isDark(P + 1, W + 1) && (ee += 1), (ee == 0 || ee == 4) && (N += 3);
            }
          for (var P = 0; P < m; P += 1)
            for (var W = 0; W < m - 6; W += 1)
              k.isDark(P, W) && !k.isDark(P, W + 1) && k.isDark(P, W + 2) && k.isDark(P, W + 3) && k.isDark(P, W + 4) && !k.isDark(P, W + 5) && k.isDark(P, W + 6) && (N += 40);
          for (var W = 0; W < m; W += 1)
            for (var P = 0; P < m - 6; P += 1)
              k.isDark(P, W) && !k.isDark(P + 1, W) && k.isDark(P + 2, W) && k.isDark(P + 3, W) && k.isDark(P + 4, W) && !k.isDark(P + 5, W) && k.isDark(P + 6, W) && (N += 40);
          for (var J = 0, W = 0; W < m; W += 1)
            for (var P = 0; P < m; P += 1)
              k.isDark(P, W) && (J += 1);
          var Le = Math.abs(100 * J / m / m - 50) / 5;
          return N += Le * 10, N;
        }, w;
      })(), l = (function() {
        for (var y = new Array(256), $ = new Array(256), E = 0; E < 8; E += 1)
          y[E] = 1 << E;
        for (var E = 8; E < 256; E += 1)
          y[E] = y[E - 4] ^ y[E - 5] ^ y[E - 6] ^ y[E - 8];
        for (var E = 0; E < 255; E += 1)
          $[y[E]] = E;
        var S = {};
        return S.glog = function(w) {
          if (w < 1)
            throw "glog(" + w + ")";
          return $[w];
        }, S.gexp = function(w) {
          for (; w < 0; )
            w += 255;
          for (; w >= 256; )
            w -= 255;
          return y[w];
        }, S;
      })();
      function u(y, $) {
        if (typeof y.length > "u")
          throw y.length + "/" + $;
        var E = (function() {
          for (var w = 0; w < y.length && y[w] == 0; )
            w += 1;
          for (var A = new Array(y.length - w + $), k = 0; k < y.length - w; k += 1)
            A[k] = y[k + w];
          return A;
        })(), S = {};
        return S.getAt = function(w) {
          return E[w];
        }, S.getLength = function() {
          return E.length;
        }, S.multiply = function(w) {
          for (var A = new Array(S.getLength() + w.getLength() - 1), k = 0; k < S.getLength(); k += 1)
            for (var m = 0; m < w.getLength(); m += 1)
              A[k + m] ^= l.gexp(l.glog(S.getAt(k)) + l.glog(w.getAt(m)));
          return u(A, 0);
        }, S.mod = function(w) {
          if (S.getLength() - w.getLength() < 0)
            return S;
          for (var A = l.glog(S.getAt(0)) - l.glog(w.getAt(0)), k = new Array(S.getLength()), m = 0; m < S.getLength(); m += 1)
            k[m] = S.getAt(m);
          for (var m = 0; m < w.getLength(); m += 1)
            k[m] ^= l.gexp(l.glog(w.getAt(m)) + A);
          return u(k, 0).mod(w);
        }, S;
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
        ], $ = function(w, A) {
          var k = {};
          return k.totalCount = w, k.dataCount = A, k;
        }, E = {}, S = function(w, A) {
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
        return E.getRSBlocks = function(w, A) {
          var k = S(w, A);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + w + "/errorCorrectionLevel:" + A;
          for (var m = k.length / 3, N = [], P = 0; P < m; P += 1)
            for (var W = k[P * 3 + 0], re = k[P * 3 + 1], ce = k[P * 3 + 2], de = 0; de < W; de += 1)
              N.push($(re, ce));
          return N;
        }, E;
      })(), f = function() {
        var y = [], $ = 0, E = {};
        return E.getBuffer = function() {
          return y;
        }, E.getAt = function(S) {
          var w = Math.floor(S / 8);
          return (y[w] >>> 7 - S % 8 & 1) == 1;
        }, E.put = function(S, w) {
          for (var A = 0; A < w; A += 1)
            E.putBit((S >>> w - A - 1 & 1) == 1);
        }, E.getLengthInBits = function() {
          return $;
        }, E.putBit = function(S) {
          var w = Math.floor($ / 8);
          y.length <= w && y.push(0), S && (y[w] |= 128 >>> $ % 8), $ += 1;
        }, E;
      }, g = function(y) {
        var $ = a.MODE_NUMBER, E = y, S = {};
        S.getMode = function() {
          return $;
        }, S.getLength = function(k) {
          return E.length;
        }, S.write = function(k) {
          for (var m = E, N = 0; N + 2 < m.length; )
            k.put(w(m.substring(N, N + 3)), 10), N += 3;
          N < m.length && (m.length - N == 1 ? k.put(w(m.substring(N, N + 1)), 4) : m.length - N == 2 && k.put(w(m.substring(N, N + 2)), 7));
        };
        var w = function(k) {
          for (var m = 0, N = 0; N < k.length; N += 1)
            m = m * 10 + A(k.charAt(N));
          return m;
        }, A = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return S;
      }, v = function(y) {
        var $ = a.MODE_ALPHA_NUM, E = y, S = {};
        S.getMode = function() {
          return $;
        }, S.getLength = function(A) {
          return E.length;
        }, S.write = function(A) {
          for (var k = E, m = 0; m + 1 < k.length; )
            A.put(
              w(k.charAt(m)) * 45 + w(k.charAt(m + 1)),
              11
            ), m += 2;
          m < k.length && A.put(w(k.charAt(m)), 6);
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
        return S;
      }, I = function(y) {
        var $ = a.MODE_8BIT_BYTE, E = s.stringToBytes(y), S = {};
        return S.getMode = function() {
          return $;
        }, S.getLength = function(w) {
          return E.length;
        }, S.write = function(w) {
          for (var A = 0; A < E.length; A += 1)
            w.put(E[A], 8);
        }, S;
      }, M = function(y) {
        var $ = a.MODE_KANJI, E = s.stringToBytesFuncs.SJIS;
        if (!E)
          throw "sjis not supported.";
        (function(A, k) {
          var m = E(A);
          if (m.length != 2 || (m[0] << 8 | m[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var S = E(y), w = {};
        return w.getMode = function() {
          return $;
        }, w.getLength = function(A) {
          return ~~(S.length / 2);
        }, w.write = function(A) {
          for (var k = S, m = 0; m + 1 < k.length; ) {
            var N = (255 & k[m]) << 8 | 255 & k[m + 1];
            if (33088 <= N && N <= 40956)
              N -= 33088;
            else if (57408 <= N && N <= 60351)
              N -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + N;
            N = (N >>> 8 & 255) * 192 + (N & 255), A.put(N, 13), m += 2;
          }
          if (m < k.length)
            throw "illegal char at " + (m + 1);
        }, w;
      }, _ = function() {
        var y = [], $ = {};
        return $.writeByte = function(E) {
          y.push(E & 255);
        }, $.writeShort = function(E) {
          $.writeByte(E), $.writeByte(E >>> 8);
        }, $.writeBytes = function(E, S, w) {
          S = S || 0, w = w || E.length;
          for (var A = 0; A < w; A += 1)
            $.writeByte(E[A + S]);
        }, $.writeString = function(E) {
          for (var S = 0; S < E.length; S += 1)
            $.writeByte(E.charCodeAt(S));
        }, $.toByteArray = function() {
          return y;
        }, $.toString = function() {
          var E = "";
          E += "[";
          for (var S = 0; S < y.length; S += 1)
            S > 0 && (E += ","), E += y[S];
          return E += "]", E;
        }, $;
      }, x = function() {
        var y = 0, $ = 0, E = 0, S = "", w = {}, A = function(m) {
          S += String.fromCharCode(k(m & 63));
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
          for (y = y << 8 | m & 255, $ += 8, E += 1; $ >= 6; )
            A(y >>> $ - 6), $ -= 6;
        }, w.flush = function() {
          if ($ > 0 && (A(y << 6 - $), y = 0, $ = 0), E % 3 != 0)
            for (var m = 3 - E % 3, N = 0; N < m; N += 1)
              S += "=";
        }, w.toString = function() {
          return S;
        }, w;
      }, T = function(y) {
        var $ = y, E = 0, S = 0, w = 0, A = {};
        A.read = function() {
          for (; w < 8; ) {
            if (E >= $.length) {
              if (w == 0)
                return -1;
              throw "unexpected end of file./" + w;
            }
            var m = $.charAt(E);
            if (E += 1, m == "=")
              return w = 0, -1;
            if (m.match(/^\s$/))
              continue;
            S = S << 6 | k(m.charCodeAt(0)), w += 6;
          }
          var N = S >>> w - 8 & 255;
          return w -= 8, N;
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
        return A;
      }, Y = function(y, $) {
        var E = y, S = $, w = new Array(y * $), A = {};
        A.setPixel = function(P, W, re) {
          w[W * E + P] = re;
        }, A.write = function(P) {
          P.writeString("GIF87a"), P.writeShort(E), P.writeShort(S), P.writeByte(128), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(255), P.writeByte(255), P.writeByte(255), P.writeString(","), P.writeShort(0), P.writeShort(0), P.writeShort(E), P.writeShort(S), P.writeByte(0);
          var W = 2, re = m(W);
          P.writeByte(W);
          for (var ce = 0; re.length - ce > 255; )
            P.writeByte(255), P.writeBytes(re, ce, 255), ce += 255;
          P.writeByte(re.length - ce), P.writeBytes(re, ce, re.length - ce), P.writeByte(0), P.writeString(";");
        };
        var k = function(P) {
          var W = P, re = 0, ce = 0, de = {};
          return de.write = function(Q, ee) {
            if (Q >>> ee)
              throw "length over";
            for (; re + ee >= 8; )
              W.writeByte(255 & (Q << re | ce)), ee -= 8 - re, Q >>>= 8 - re, ce = 0, re = 0;
            ce = Q << re | ce, re = re + ee;
          }, de.flush = function() {
            re > 0 && W.writeByte(ce);
          }, de;
        }, m = function(P) {
          for (var W = 1 << P, re = (1 << P) + 1, ce = P + 1, de = N(), Q = 0; Q < W; Q += 1)
            de.add(String.fromCharCode(Q));
          de.add(String.fromCharCode(W)), de.add(String.fromCharCode(re));
          var ee = _(), J = k(ee);
          J.write(W, ce);
          var Le = 0, Ge = String.fromCharCode(w[Le]);
          for (Le += 1; Le < w.length; ) {
            var St = String.fromCharCode(w[Le]);
            Le += 1, de.contains(Ge + St) ? Ge = Ge + St : (J.write(de.indexOf(Ge), ce), de.size() < 4095 && (de.size() == 1 << ce && (ce += 1), de.add(Ge + St)), Ge = St);
          }
          return J.write(de.indexOf(Ge), ce), J.write(re, ce), J.flush(), ee.toByteArray();
        }, N = function() {
          var P = {}, W = 0, re = {};
          return re.add = function(ce) {
            if (re.contains(ce))
              throw "dup key:" + ce;
            P[ce] = W, W += 1;
          }, re.size = function() {
            return W;
          }, re.indexOf = function(ce) {
            return P[ce];
          }, re.contains = function(ce) {
            return typeof P[ce] < "u";
          }, re;
        };
        return A;
      }, O = function(y, $, E) {
        for (var S = Y(y, $), w = 0; w < $; w += 1)
          for (var A = 0; A < y; A += 1)
            S.setPixel(A, w, E(A, w));
        var k = _();
        S.write(k);
        for (var m = x(), N = k.toByteArray(), P = 0; P < N.length; P += 1)
          m.writeByte(N[P]);
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
var Rk = Ik();
const Bk = /* @__PURE__ */ Tk(Rk), Lk = ["width", "height", "viewBox"], Dk = ["width", "height"], Nk = ["d"], Pk = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = L(() => {
      const s = Bk(0, "M");
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
      }, null, 8, Dk),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Nk)
    ], 8, Lk));
  }
}, ox = /* @__PURE__ */ K(Pk, [["__scopeId", "data-v-489f0852"]]), jk = {
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
}, rx = /* @__PURE__ */ K(jk, [["__scopeId", "data-v-47e67f04"]]), ix = Ki(() => import("./VoiceFigure-CaHCY_zy.js").then((e) => e.V)), lx = "1.0.0", cx = "3.5";
export {
  Ol as $,
  Se as A,
  Ae as B,
  b4 as C,
  Qn as D,
  st as E,
  w4 as F,
  iy as G,
  c5 as H,
  p4 as I,
  my as J,
  Mt as K,
  Fv as L,
  Ea as M,
  ky as N,
  fy as O,
  Xn as P,
  L5 as Q,
  Wb as R,
  In as S,
  q5 as T,
  Bb as U,
  _e as V,
  Pn as W,
  Rb as X,
  Ib as Y,
  Cl as Z,
  K as _,
  Mb as a,
  s4 as a$,
  yy as a0,
  Hb as a1,
  Ub as a2,
  Re as a3,
  t5 as a4,
  e5 as a5,
  bt as a6,
  zb as a7,
  f5 as a8,
  fb as a9,
  Y5 as aA,
  I5 as aB,
  Ov as aC,
  v5 as aD,
  y5 as aE,
  k4 as aF,
  pi as aG,
  j5 as aH,
  mn as aI,
  wb as aJ,
  gb as aK,
  c4 as aL,
  pn as aM,
  f4 as aN,
  l5 as aO,
  R5 as aP,
  B5 as aQ,
  T5 as aR,
  sn as aS,
  wt as aT,
  mb as aU,
  k0 as aV,
  C5 as aW,
  qb as aX,
  fi as aY,
  Rt as aZ,
  Pt as a_,
  a4 as aa,
  d4 as ab,
  xb as ac,
  Lb as ad,
  Db as ae,
  Xb as af,
  Qb as ag,
  n5 as ah,
  Ab as ai,
  Ao as aj,
  Vb as ak,
  h5 as al,
  M4 as am,
  S5 as an,
  $5 as ao,
  x5 as ap,
  s5 as aq,
  Jb as ar,
  Yb as as,
  Zb as at,
  P5 as au,
  d5 as av,
  m5 as aw,
  E4 as ax,
  zt as ay,
  p5 as az,
  Ty as b,
  _4 as b$,
  sy as b0,
  h4 as b1,
  H5 as b2,
  W5 as b3,
  U0 as b4,
  ei as b5,
  e4 as b6,
  u5 as b7,
  ns as b8,
  it as b9,
  z5 as bA,
  Z5 as bB,
  ut as bC,
  F5 as bD,
  X5 as bE,
  g5 as bF,
  _5 as bG,
  w5 as bH,
  Ce as bI,
  i5 as bJ,
  Q5 as bK,
  L4 as bL,
  D4 as bM,
  db as bN,
  $0 as bO,
  o5 as bP,
  V5 as bQ,
  Sb as bR,
  $4 as bS,
  U5 as bT,
  G5 as bU,
  K5 as bV,
  a5 as bW,
  Tv as bX,
  r5 as bY,
  b5 as bZ,
  x4 as b_,
  J5 as ba,
  bs as bb,
  ar as bc,
  C4 as bd,
  I4 as be,
  N5 as bf,
  l4 as bg,
  hb as bh,
  M5 as bi,
  O4 as bj,
  Gb as bk,
  Kb as bl,
  Ob as bm,
  Fb as bn,
  yb as bo,
  r4 as bp,
  _b as bq,
  Eb as br,
  Tb as bs,
  A5 as bt,
  p0 as bu,
  m4 as bv,
  hy as bw,
  Cb as bx,
  kb as by,
  E5 as bz,
  Ve as c,
  ax as c$,
  vb as c0,
  pb as c1,
  k5 as c2,
  R4 as c3,
  Ia as c4,
  B4 as c5,
  Oi as c6,
  i4 as c7,
  Pb as c8,
  Nb as c9,
  cx as cA,
  Xk as cB,
  J4 as cC,
  Ys as cD,
  rb as cE,
  yg as cF,
  It as cG,
  aa as cH,
  ka as cI,
  Gk as cJ,
  Qk as cK,
  pl as cL,
  nx as cM,
  Yk as cN,
  ox as cO,
  V4 as cP,
  Wl as cQ,
  Wk as cR,
  lb as cS,
  xw as cT,
  Lr as cU,
  eb as cV,
  Nt as cW,
  C1 as cX,
  sb as cY,
  Hk as cZ,
  ln as c_,
  w0 as ca,
  bb as cb,
  uy as cc,
  O5 as cd,
  Ma as ce,
  Sv as cf,
  D5 as cg,
  Vt as ch,
  Tt as ci,
  zk as cj,
  K4 as ck,
  ve as cl,
  Yn as cm,
  Vk as cn,
  Hh as co,
  sx as cp,
  ub as cq,
  km as cr,
  Bn as cs,
  N4 as ct,
  Fk as cu,
  Xt as cv,
  Zk as cw,
  ye as cx,
  Y4 as cy,
  lx as cz,
  H0 as d,
  Ri as d0,
  tb as d1,
  lt as d2,
  nb as d3,
  ss as d4,
  ix as d5,
  rx as d6,
  Rr as d7,
  W4 as d8,
  Ff as d9,
  Gr as dA,
  U4 as dB,
  Im as dC,
  z4 as dD,
  zn as dE,
  X4 as dF,
  Wf as da,
  ex as db,
  Q4 as dc,
  tx as dd,
  cb as de,
  ib as df,
  ob as dg,
  j4 as dh,
  P4 as di,
  dg as dj,
  Uk as dk,
  Jk as dl,
  F4 as dm,
  H4 as dn,
  Xe as dp,
  Kk as dq,
  q4 as dr,
  ab as ds,
  kt as dt,
  Jy as du,
  G4 as dv,
  Ky as dw,
  Z4 as dx,
  um as dy,
  Rw as dz,
  We as e,
  m0 as f,
  jb as g,
  A4 as h,
  an as i,
  g4 as j,
  T4 as k,
  o4 as l,
  v4 as m,
  Dy as n,
  u4 as o,
  $b as p,
  Aa as q,
  Ai as r,
  Ci as s,
  je as t,
  y4 as u,
  V0 as v,
  S4 as w,
  t4 as x,
  n4 as y,
  vn as z
};
