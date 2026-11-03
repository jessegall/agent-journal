/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as he, createElementVNode as p, normalizeClass as X, Fragment as Y, renderList as te, normalizeStyle as fe, defineComponent as Fi, Comment as Wi, h as la, cloneVNode as Hi, createBlock as K, withCtx as W, unref as V, createVNode as L, toDisplayString as x, createCommentVNode as A, inject as Ee, useAttrs as Hn, computed as B, ref as I, resolveDynamicComponent as xt, mergeProps as tt, Transition as Lt, watch as ke, shallowRef as Un, createTextVNode as oe, TransitionGroup as jo, reactive as ca, onMounted as qe, onUnmounted as Ie, nextTick as Nt, useId as qo, Teleport as ua, withModifiers as be, isRef as Da, onBeforeUnmount as Dt, resolveComponent as Ui, resolveDirective as zi, withDirectives as ht, useModel as Ls, getCurrentInstance as Vi, mergeModels as Ns, getCurrentScope as Fo, onScopeDispose as Wo, provide as Gi, onErrorCaptured as Ki, toHandlers as Yi, createSlots as Ji, vShow as Zi, useSlots as Xi, withKeys as Yt, vModelText as Ds, defineAsyncComponent as Qi } from "vue";
const J = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, el = { class: "skeleton-line" }, tl = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", el, [
      he(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(Y, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: fe({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, mt = /* @__PURE__ */ J(tl, [["__scopeId", "data-v-0ebb6933"]]), ln = Fi({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Wi);
      return s.length !== 1 ? la(Y, { key: n }, s) : s[0].key == null ? Hi(s[0], { key: n }) : s[0];
    };
  }
}), nl = ["aria-label"], sl = ["aria-label"], al = ["aria-label"], ol = ["aria-label"], rl = ["aria-label"], il = ["aria-label"], ll = ["aria-label"], cl = {
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
    return (l, u) => (c(), K(ln, { value: e.shape }, {
      messages: W(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(Y, null, te(t, (d) => p("div", {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, nl)
      ]),
      older: W(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, te(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, sl)
      ]),
      cards: W(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(Y, null, te(n, (f) => L(mt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, al)
      ]),
      file: W(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            L(mt, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(Y, null, te(a, (f) => L(mt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ol)
      ]),
      page: W(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          L(mt, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(Y, null, te(e.count, (d) => (c(), K(mt, {
            key: d,
            bars: V(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, rl)
      ]),
      text: W(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, te(e.count, (d) => (c(), K(mt, {
            key: d,
            bars: V(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, il)
      ]),
      default: W(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, te(e.count, (d) => (c(), K(mt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, ll)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Pt = /* @__PURE__ */ J(cl, [["__scopeId", "data-v-1392eacb"]]), ul = {
  key: 1,
  class: "empty-state titled"
}, dl = { class: "empty-state-title" }, hl = { class: "empty-state-text" }, fl = {
  key: 2,
  class: "empty-state"
}, ml = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), K(Pt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", ul, [
      p("p", dl, x(e.title), 1),
      p("p", hl, [
        he(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", fl, [
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Bn = /* @__PURE__ */ J(ml, [["__scopeId", "data-v-b27e89b0"]]), pl = { class: "fold-group" }, gl = ["aria-expanded"], vl = { class: "fold-label" }, yl = {
  key: 0,
  class: "fold-count"
}, wl = {
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
    return (s, a) => (c(), h("div", pl, [
      p("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", vl, x(e.label), 1),
        e.count !== "" ? (c(), h("span", yl, x(e.count), 1)) : A("", !0),
        p("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, gl),
      e.open ? he(s.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, Q2 = /* @__PURE__ */ J(wl, [["__scopeId", "data-v-9ef1865c"]]), kl = Symbol("open-view"), Ce = Symbol.for("journal.window-context");
function zn() {
  const e = Ee(Ce, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const bl = ["stroke-width", "innerHTML"], ge = {
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
    }, null, 12, bl));
  }
}, xl = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, $l = /* @__PURE__ */ J(xl, [["__scopeId", "data-v-eb453d6f"]]), Ml = 120, Sl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Hn(), s = B(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), a = I(!1), o = B(() => t.busy || a.value), r = Ee(Ce, null), i = B(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function l(u) {
      const d = [n.onClick].flat().filter(Boolean).map((g) => g(u)).filter((g) => g instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => a.value = !0, Ml);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), a.value = !1;
      }
    }
    return (u, d) => (c(), K(xt(e.href ? "a" : "button"), tt(s.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.kind, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: l
    }), {
      default: W(() => [
        p("span", {
          class: X(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), K(ge, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          he(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), K($l, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ J(Sl, [["__scopeId", "data-v-033d70ca"]]), _l = {
  class: "running",
  "data-running-command": ""
}, El = ["title"], Al = {
  key: "idle",
  class: "running-idle"
}, Cl = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", _l, [
      L(Lt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: W(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, x(e.text), 9, El)) : (c(), h("span", Al, x(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, eb = /* @__PURE__ */ J(Cl, [["__scopeId", "data-v-d3240219"]]), Ol = ["aria-checked", "aria-label", "title"], Tl = {
  key: 0,
  class: "switch-inner"
}, Il = {
  key: 0,
  class: "switch-word"
}, Rl = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("button", {
      type: "button",
      class: X(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: X(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", Tl, x(e.word), 1)) : A("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Il, x(e.word), 1)) : A("", !0)
    ], 10, Ol));
  }
}, tb = /* @__PURE__ */ J(Rl, [["__scopeId", "data-v-1bfb90f3"]]);
function Ho(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Jt(e, t) {
  return Ho(() => localStorage, e, t);
}
function Uo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Vn(e, t) {
  return Uo(() => localStorage, e, t);
}
function zo(e, t) {
  ke(t, (n) => Vn(e, n), { deep: !0 });
}
function Bl(e, t) {
  return Ho(() => sessionStorage, e, t);
}
function Ll(e, t) {
  return Uo(() => sessionStorage, e, t);
}
const Ln = "journal.environment", Vo = I(Bl(Ln, Jt(Ln, "")));
function Nl(e) {
  Vo.value = e, Ll(Ln, e), Vn(Ln, e);
}
const Nn = I(location.hash), Pa = Un(null), ja = { integrations: "mcp", library: "team" };
function Dl() {
  if (!Pa.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (ja[n]) {
    location.replace(`#/${[ja[n], ...s].join("/")}${t ? `?${t}` : ""}`), Nn.value = location.hash;
    return;
  }
  !n || Pa.value(n) || (Nl(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Nn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Nn.value = location.hash, Dl();
});
const Xe = B(() => {
  const [e, t = ""] = Nn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: Vo.value,
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
function Pl(e = "", t = 0, n = "") {
  location.hash = Gn.page(e, t, n);
}
const jl = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Go(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(jl).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ot = {};
function nb(e, t) {
  return Ot[e] = t, () => Ot[e] === t && delete Ot[e];
}
function Ko(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Ot[e]) != null && r.call(Ot, t))) return;
  const a = Xe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Go([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function ql(e, t, n, s = 0, a = "") {
  if (e === Xe.value.env) return Ko(t, n, s, a);
  const o = Xe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Go([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Ue(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? ql(s, a, Number(o), 0, t) : Ko(a, Number(o), 0, t);
}
function Fl(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ct(e) {
  const t = Fl(e);
  t && Ue(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Kn = typeof document < "u" && document.documentElement.classList.contains("phone"), Wl = "Files are attached on the computer; the phone sends text.", os = [
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
}), cn = {
  messages: me("Message", "mail", "What the user left for the agent, or the agent for the user", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: me("Question", "help", "Something the agent asks the user, with choices to pick", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: me("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
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
  tasks: me("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: os
  }),
  reports: me("Report", "report", "What was checked and what was found, written for the user", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: me("Collection", "folder", "Rows that belong together, gathered under a name", {
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
  rules: me("Rule", "list", "A ruling that binds every environment of the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: me("Reminder", "clock", "An instruction said again until it is retired", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: me("Pin", "band", "One line pinned to the chat while it matters", { filters: os }),
  reactions: me("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: me("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", { scope: "project" }),
  environments: me("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", { scope: "project" }),
  agents: me("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: me("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: me("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
  verifiers: me("Verifier", "verifier", "An agent the journal sends by itself to judge whether a dismissed reader report was dismissed rightly"),
  test_turns: me("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: me("Reviewer", "reviewer", "An agent the journal sends by itself, in orchestrator mode with the reviewer on, to test and check each worker's work and report each point to the agent"),
  subagents: me("Subagent", "bot", "A helper the agent started inside its own session for one job", { nested: !0 }),
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
  triggers: me("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
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
      { key: "closed", title: "Waits", shows: "closed", empty: "No wait has a check of its own." }
    ],
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0
  }),
  dumps: me("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: me("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: me("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Hl = ["secrets", "plugins"], Yo = Object.keys(cn).filter((e) => !(Kn && Hl.includes(e)));
B(() => Yo.map((e) => ({ name: e, ...cn[e] })));
const un = (e) => cn[e], Jo = new Map(Yo.flatMap((e) => [e, e.replace(/s$/, ""), cn[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => Jo.get(String(e).toLowerCase()) || "", Zo = [...Jo.keys()].sort((e, t) => t.length - e.length).join("|"), Yn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), K(pe, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: W(() => [
        L(ge, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Ul = {
  key: 1,
  class: "row-list-failure"
}, zl = ["data-row"], Vl = {
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
    const t = e, n = B(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = I(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), K(Pt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Ul, x(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), K(Bn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: W(() => [
        oe(x(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(Y, { key: 3 }, [
      (c(), K(xt(e.arrival ? jo : "ul"), tt(n.value, { class: "row-list" }), {
        default: W(() => [
          (c(!0), h(Y, null, te(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            he(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, zl))), 128))
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
}, Gl = /* @__PURE__ */ J(Vl, [["__scopeId", "data-v-aa6ad7ff"]]), Kl = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Yl = {
  key: 1,
  class: "agent-rows-note"
}, Jl = {
  key: 2,
  class: "agent-rows-note"
}, Zl = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Xl = ["data-agent-row", "onClick"], Ql = { class: "agent-row-name" }, ec = { class: "agent-row-state" }, tc = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = B(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Kl, [
      e.loaded ? e.failure ? (c(), h("p", Yl, x(e.failure), 1)) : e.rows.length ? (c(), h(Y, { key: 3 }, [
        p("p", Zl, x(s.value) + " running", 1),
        (c(!0), h(Y, null, te(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => V(Ue)(`agents:${r.id}`)
        }, [
          p("span", Ql, "#" + x(r.id) + " " + x(r.session), 1),
          p("span", ec, x(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Xl))), 128))
      ], 64)) : (c(), h("p", Jl, x(e.none), 1)) : (c(), K(Pt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, sb = /* @__PURE__ */ J(tc, [["__scopeId", "data-v-a01e5a17"]]), nc = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, x(e.text), 3));
  }
}, Xo = /* @__PURE__ */ J(nc, [["__scopeId", "data-v-9e7e1157"]]), sc = ["aria-valuenow", "aria-valuemax"], ac = {
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
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: fe({ width: n.value })
      }, null, 4)
    ], 10, sc));
  }
}, oc = /* @__PURE__ */ J(ac, [["__scopeId", "data-v-9eba6a85"]]), rc = { class: "bars" }, ic = { class: "bar-name" }, lc = { class: "bar-value" }, cc = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = B(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", rc, [
      (c(!0), h(Y, null, te(e.items, (l, u) => (c(), K(xt(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: X(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: W(() => [
          p("span", ic, x(l.label), 1),
          L(oc, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", lc, x(l.value) + x(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, uc = /* @__PURE__ */ J(cc, [["__scopeId", "data-v-663427f4"]]), dc = { class: "bars" }, hc = {
  key: 0,
  class: "bars-title"
}, fc = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", dc, [
      e.node.title ? (c(), h("span", hc, x(e.node.title), 1)) : A("", !0),
      L(uc, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, mc = /* @__PURE__ */ J(fc, [["__scopeId", "data-v-7135bb11"]]), pc = {
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
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: fe(o.value)
    }, [
      (c(!0), h(Y, null, te(e.node.children || [], (l, u) => (c(), K(Ar, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Cn = /* @__PURE__ */ J(pc, [["__scopeId", "data-v-d142a3f4"]]), gc = {
  key: 0,
  class: "card-head"
}, vc = { class: "card-title" }, yc = {
  key: 0,
  class: "card-note"
}, wc = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", gc, [
        p("span", vc, x(e.node.title), 1),
        e.node.note ? (c(), h("span", yc, x(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      L(Cn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, kc = /* @__PURE__ */ J(wc, [["__scopeId", "data-v-67b72d40"]]), bc = (e) => "task_ids" in e, Qo = 1024, xc = Qo * 1024 * 1024, $c = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Qo} MB limit for one file.`;
function Mc() {
  return () => {
  };
}
function Ps(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function er(e = window) {
  if (!Ps(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ps(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const js = "journal.stale-build-reload", Sc = 'script[type="module"][src*="/assets/index-"]', qa = (e) => {
  var t;
  return ((t = e.querySelector(Sc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function _c(e = document, t = fetch, n = () => er(window)) {
  const s = qa(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = qa(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
let rs = "";
function Ec(e, t = () => er(window)) {
  if (!e) return !1;
  const n = !!rs && rs !== e;
  return rs = e, n && t(), n;
}
const Ac = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Cc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(js) === e.message) return !1;
    t.setItem(js, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Oc(e = window.sessionStorage) {
  try {
    e.removeItem(js);
  } catch {
    return;
  }
}
const Tc = 2e3, Ic = 3e4, ze = ca({ starting: !1, external: !1, late: !1, offline: !1 }), da = () => ze.starting, Rc = 3;
let wn = 0, qs = 0, tr = 0, nr = [];
async function Bc() {
  try {
    const e = await Pe.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
function Lc() {
  clearInterval(qs), clearTimeout(tr), qs = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), nr.splice(0).forEach((e) => e()), _c();
}
let is = !1;
async function Nc() {
  if (ze.offline = !navigator.onLine, is) return;
  is = !0;
  const e = await Bc();
  if (is = !1, ze.external = e.updating, wn = !e.restarting && !e.updating && e.reachable ? wn + 1 : 0, wn < Rc) return;
  wn = 0, (!Ec(e.started_at) || Ps()) && Lc();
}
function Fa() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, qs = setInterval(Nc, Tc), tr = setTimeout(() => ze.late = !0, Ic));
}
const Dc = () => ze.starting ? new Promise((e) => nr.push(e)) : Promise.resolve(), Wa = 2e4, Pc = 3e5, Ye = 6e5, kn = 6, jc = 500, qc = "/journal/summary", Fc = "/api/server-state", Wc = 5e3, Ha = Kn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Hc = (e) => e.split("?")[0].endsWith(qc), sr = (e, t) => Object.assign(new Error(t), { status: e });
async function Uc(e, t, n = sr) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const zc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Vc {
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
        headers: { ...Ha, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: zc(s),
        signal: AbortSignal.timeout(a || (i ? Pc : Wa))
      });
    } catch (l) {
      if (l instanceof TypeError && Fa(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, jc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = kn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Mc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Uc(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ha, signal: AbortSignal.timeout(Wa) });
    if (!n.ok) throw sr(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, kn, o).then((l) => (this.written(n), l));
    if (da() && !Hc(n))
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
    return fetch(Fc, { cache: "no-store", signal: AbortSignal.timeout(Wc) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (s) {
      throw s instanceof TypeError && Fa(), s;
    }
  }
}
const Pe = new Vc(), Be = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const qt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Ft = "the page does not know its environment yet", Gc = "X-Journal-Env", Kc = "X-Journal-Request-At", ls = "/viewer/voices/figures/";
class ha {
  constructor({ env: t = () => Xe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ha({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Kc]: String(Date.now()), ...this.env() ? { [Gc]: this.env() } : {} };
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
    if (Kn) return Promise.reject(Object.assign(new Error(Wl), { status: 403 }));
    if (s.size > xc) return Promise.reject(new Error($c(s)));
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
    return Pe.request("GET", ls + "figures.json");
  }
  voiceFigureUrl(t) {
    return ls + t;
  }
  figureDecoderUrl() {
    return ls + "draco/";
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
    return `${this.base}/${t ? `?env=${Be(t)}` : ""}${Gn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const Ve = new ha({ base: Kn ? "/p" : "" }), Yc = (e) => Pe.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), Ua = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), Jc = 6e4, Zc = 4, Xc = 300, Qc = 5e3, ar = /* @__PURE__ */ new Map();
function Jn(e) {
  if (!(e in Ua)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ua[e];
}
function eu(e) {
  const t = Jn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Qc;
  }
}
const tu = (e) => e / 2 + Math.random() * e / 2, or = (e) => [...e.users.values()].pop(), fa = (e) => ar.get(e.place) === e, nu = () => Math.random() * Xc, ma = () => document.hidden;
function su(e) {
  const t = eu(e);
  return e.failures ? tu(Math.min(Jc, t * 2 ** e.failures)) : Math.max(t, Zc * e.took);
}
function rr(e, t) {
  clearTimeout(e.timer), !(!fa(e) || ma()) && (e.timer = setTimeout(() => au(e), t));
}
function au(e) {
  return fa(e) ? e.running ? (e.again = !0, e.running) : (e.running = lu(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const ou = (e) => {
  var t, n;
  return !ma() && (((n = (t = Jn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && or(e).active() && !da();
};
async function ru(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Pe.attemptOnce(() => Jn(e.key).read(or(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function iu(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Jn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function lu(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      ou(e) && iu(e, await ru(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && fa(e));
  rr(e, su(e));
}
const cu = () => ma() || ar.forEach((e) => rr(e, nu()));
document.addEventListener("visibilitychange", cu);
const _e = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, ir = (e) => `${e.table}:${e.id}`, za = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", cs = 80;
function Va(e) {
  return e.length <= cs ? e : `${e.slice(0, cs + 1).replace(/\s+\S*$/, "") || e.slice(0, cs)}…`;
}
const Ga = {
  messages: (e) => Va(za(e.text)),
  comments: (e) => Va(za(e.text)),
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
}, uu = (e) => (Ga[e.table] ? Ga[e.table](e) : e.title || "") || "", du = ["done", "cancelled"], Fs = {
  tasks: (e) => _e(e.completed_at) || (e.state === "cancelled" ? _e(e.updated_at) : 0),
  questions: (e) => e.answer ? _e(e.updated_at) : 0,
  plans: (e) => du.includes(e.state) ? _e(e.updated_at) : 0,
  pins: (e) => _e(e.closed_at),
  secrets: (e) => _e(e.deleted_at),
  workers: (e) => e.state === "stopped" ? _e(e.updated_at) : 0,
  shares: (e) => _e(e.stopped_at),
  dumps: (e) => _e(e.completed_at),
  agents: (e) => e.state === "ended" ? _e(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? _e(e.created_at) : 0
}, hu = (e) => Fs[e.table] ? Fs[e.table](e) : 0, lr = (e) => hu(e) > 0, fu = (e) => !!Fs[e], bt = (e) => _e(e.created_at), pa = (e) => _e(e.updated_at) || bt(e), mu = 60, pu = (e, t) => _e(e.created_at) >= _e(t.created_at) - mu, gu = (e, t) => e.id > 0 && e.table === t.table && pu(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ga = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => gu(s, n))), vu = { me: 1, people: [] }, ie = ca({
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
  people: vu,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Jt("journal.activity", !0),
  wide: !1,
  sideMini: Jt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
zo("journal.activity", () => ie.activity);
zo("journal.side.mini", () => ie.sideMini);
const yu = 50, cr = 100, wu = { messages: 25 }, We = (e) => wu[e] || yu;
function ku(e, t) {
  if (e !== "messages") return Math.max(t.length - We(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === We(e)) return s;
  return 0;
}
const ft = /* @__PURE__ */ new Set(), va = I(0), dn = /* @__PURE__ */ new Set(), hn = /* @__PURE__ */ new Set(), rt = /* @__PURE__ */ new Set(), Ws = /* @__PURE__ */ new Set(), bu = /* @__PURE__ */ new Map(), xu = /* @__PURE__ */ new Map();
let Wt = !1, Ht = null;
const $u = (e, t) => e.id - t.id, Mu = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Su = { messages: Mu }, ur = (e) => Su[e] || $u;
function dr(e) {
  return va.value, ft.has(e) || (ft.add(e), ie.booted && (!dn.has(e) || hn.has(e)) && queueMicrotask(() => ya([e], !1))), ie.rows[e] || [];
}
function _u(e) {
  const t = ie.rows[e] || [], n = ku(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ie.rows[e] = t.filter((a) => s.has(a) || fu(e) && !lr(a)), ie.paging.size[e] = We(e), ie.paging.more[e] = !0;
}
const Eu = /* @__PURE__ */ new Set();
function Au() {
  ft.forEach(_u), ft.clear(), bu.clear(), xu.clear(), va.value += 1;
}
ke(() => `${Xe.value.env}/${Xe.value.page}/${Xe.value.open ? Xe.value.open.table : ""}`, Au);
ke(
  () => ie.booted,
  (e) => e && ya(
    [...ft].filter((t) => !dn.has(t)),
    !1
  )
);
const Hs = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !bc(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function hr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Hs(s) && !Hs(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function fr(e, t) {
  dn.add(e), va.value += 1;
  const n = ie.rows[e] || [];
  ie.rows[e] = [...hr(n, t.rows), ...ga(n.filter((s) => s.id === 0), t.rows)], ie.paging.size[e] = ie.paging.size[e] || We(e), ie.paging.more[e] = !t.is_last_page;
}
async function Cu(e) {
  const t = new Set((ie.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: We(e) });
  Zn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ga((ie.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return fr(e, { ...n, rows: [...n.rows, ...a].sort(ur(e)) }), ie.paging.size[e] = We(e), mr.has(e) && await pr(e), ie.rows[e];
}
const Zn = (e, t) => ie.counts = { ...ie.counts, [e]: t };
async function Ou(e) {
  const t = ie.rows[e] || [], n = Math.max(0, ...t.map(pa)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: We(e), since: n, after: s });
  if (Zn(e, a.counts), !a.is_last_page) return Cu(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = ga(t.filter((i) => !o.has(i.id)), a.rows).concat(hr(t, a.rows));
  return ie.rows[e] = r.sort(ur(e)), ie.paging.size[e] = ie.rows[e].length, ie.rows[e];
}
const us = /* @__PURE__ */ new Set();
async function Tu(e, t = !1) {
  e.forEach((n) => hn.delete(n)), e.forEach((n) => Ws.add(n));
  try {
    await Pu(e, t);
  } finally {
    e.forEach((n) => Ws.delete(n));
  }
}
async function Iu(e) {
  const t = await Ve.list(e, { limit: We(e) });
  Zn(e, t.counts), fr(e, t);
}
async function Ru(e) {
  Zn(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const mr = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function pr(e) {
  const t = (ie.rows[e] || []).filter((a) => Hs(a) && (e !== "plans" || !lr(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ie.rows[e] = (ie.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Bu = (e, t) => !dn.has(e) || t && (ie.paging.size[e] || We(e)) === We(e) && !Eu.has(e);
async function Lu(e, t) {
  if (!ft.has(e)) return Ru(e);
  const n = await (Bu(e, t) ? Iu(e) : Ou(e));
  return mr.has(e) && await pr(e), n;
}
async function gr() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ie.settings) && (ie.settings = e);
}
async function Nu() {
  const [e] = await Promise.all([Ve.entries(0, cr), gr()]);
  Fu([...Jt(yr(), []), ...e]);
}
const Du = (e, t) => Lu(e, t).then(
  () => null,
  () => e
);
async function Pu(e, t) {
  const n = (await Promise.all(e.map((s) => Du(s, t)))).filter(Boolean);
  if (n.forEach((s) => (rt.add(s), hn.add(s))), t && await Nu(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const vr = 1e3, ju = 15e3;
let bn = vr;
async function qu() {
  return Ht || (Ht = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...rt].some((e) => !us.has(e)) || Wt; ) {
      const e = Wt, t = [...e ? Object.keys(ie.rows) : rt].filter((s) => cn[s] && (ft.has(s) || s in ie.rows)).filter((s) => e || !ft.has(s) || hn.has(s) || !dn.has(s)).filter((s) => !us.has(s)), n = [...rt].filter((s) => us.has(s));
      rt.clear(), n.forEach((s) => rt.add(s)), Wt = !1;
      try {
        await Tu(t, e), bn = vr;
      } catch {
        Wt = Wt || e, await new Promise((a) => setTimeout(a, bn)), bn = Math.min(bn * 2, ju);
      }
    }
  })().finally(() => Ht = null), Ht);
}
function ya(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Ws.has(n)).forEach((n) => {
    rt.add(n), t && hn.add(n);
  }), rt.delete("settings") && gr(), qu();
}
const yr = () => {
  var e;
  return `typed-entries:${((e = ie.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function Fu(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ie.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-cr), Vn(yr(), ie.entries.slice(-50));
}
Yc((e) => ie.streamOpen || ya([e]));
const Us = [], Wu = 2e3, ot = /* @__PURE__ */ new Map(), Hu = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Uu = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function $t(e, { first: t = !1 } = {}) {
  t ? Us.unshift(e) : Us.push(e), ot.clear();
}
function wr(e, t, n) {
  var a;
  const s = dr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const zu = (e) => dr(e.table).find((t) => t.id === e.id) === e.row, Vu = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Gu(e, t) {
  const n = [{ kind: "text", text: et(e).replace(/\r\n/g, `
`) }];
  for (const s of Us)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Zt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Ku(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Ku(e) {
  return e.split(Uu).map((t, n) => n % 2 ? t : t.replace(Hu, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ka(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Yu(e) {
  const [t, , ...n] = e, s = Ka(t).map((o) => `<th>${Zt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Ka(o).map((r) => `<td>${Zt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Ju(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Zt(a)}</li>`).join("")}</${s}>`;
}
const Ya = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function kr(e) {
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
      n.push(`<h${i}>${Zt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ya(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Yu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(Ju(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${kr(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Ya(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Zt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Zu = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Xu = (e) => e.kind !== "text" && !Zu.test(e.html);
function Qu(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(kr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Xu(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function zs(e, t = { env: "" }) {
  const n = Vu(e, t), s = ot.get(n);
  if (ot.delete(n), s && s.reads.every(zu))
    return ot.set(n, s), s.html;
  const a = [], o = Qu(Gu(e, { ...t, reads: a }));
  return ot.set(n, { html: o, reads: a }), ot.size > Wu && ot.delete(ot.keys().next().value), o;
}
const br = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Xt = (e) => String(e || "").replace(br, (t, n, s, a) => a), ed = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), xn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, td = /^Traceback \(most recent call last\):/m, nd = 8;
function xr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, nd).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function sd(e) {
  const t = [...e.matchAll(ed)].map((s) => s.index);
  if (xn.lastIndex = 0, !t.length || !xn.test(e)) return null;
  xn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(xn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: xr(n), tail: "" } : null;
}
function ad(e) {
  const t = td.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: xr([o]), tail: n.slice(a).join(`
`) };
}
$t((e) => {
  const t = Xt(e), n = ad(t) || sd(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const od = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, rd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, id = /[\w\]]\(/, ld = /^[\w$.[\]'"]+\s*=\s*[^=]/, cd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, ud = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, dd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, hd = /[[({,]$/, fd = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, md = /^(\t|\s{2,})\S/, pd = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*\/?|<!--)/, gd = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, vd = /[{}()[\];=<>$&|*\\@+^~%]/g, $r = /^\s*(?:[-*+]|\d+[.)])\s/, yd = /^\s*>/, wd = /^\s*\|/, kd = 0.6, bd = 0.4, xd = 5, $d = 0.03, Mr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= xd && t.every((n) => gd.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(vd) ?? []).length / e.length < $d;
}, ds = (e) => {
  const t = e.trim();
  return [od, rd, id, ld, cd, ud, dd, hd, fd].some((n) => n.test(t)) || /[;{}]$/.test(t) || md.test(e) && !$r.test(e) && !Mr(e);
};
function Md(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || $r.test(t[0]) || t.every((o) => yd.test(o) || wd.test(o))) return "text";
  const n = t.filter((o) => !pd.test(o.trim()));
  if (t.length === 1) return !n.length || ds(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(ds).length, a = n.filter((o) => !ds(o) && Mr(o)).length;
  return s >= n.length * kd && a <= n.length * bd ? "code" : "text";
}
const Vs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Sd = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", _d = `${Vs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ed = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Ad = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ja = {
  js: { keywords: Vs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Sd, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: _d, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Vs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Ed, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Ad, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Cd = {
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
function Za(e, t, n) {
  return n && e.startsWith(n, t);
}
function Od(e, t) {
  const n = Ja[Cd[t] ?? t] || Ja.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Za(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Za(e, o, n.block[0])) {
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
function Td(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Od(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? et(r) : `<span class="tok-${s}">${et(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Id(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Rd = 1500, Xa = /* @__PURE__ */ new WeakMap();
async function Bd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Id(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Xa.get(t)), Xa.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Rd)
  )));
}
typeof document < "u" && document.addEventListener("click", Bd, !0);
const Ld = /\n\s*\n/, Nd = /^(```|~~~)\s*(\w+)?\s*$/, Dd = /^\s{4,}\S/, Pd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Gs = /^\s*(?:[-*+]|\d+[.)])\s/, Sr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, jd = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function wa(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function qd(e) {
  const t = wa(e.join(`
`));
  return (jd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Fd = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Sr.test(t) && !Gs.test(t);
}, Wd = (e, t) => Gs.test(t) || Gs.test([...e].reverse().find((n) => n.trim()) || "");
function Ks(e, t) {
  const n = t || qd(e), s = Td(wa(e.join(`
`)), n).map((a) => `<span class="code-line">${a}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${s}</code></pre></div>` };
}
function Hd(e) {
  const t = e.split(Ld).map((r) => ({ paragraph: r, kind: Md(wa(r).split(`
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
      a(), n.push(Ks(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(Xt), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function Ud(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...Hd(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Nd);
    if (r) {
      const l = t.findIndex((d, f) => f > o && d.trim().startsWith(r[1])), u = l < 0 ? t.length : l;
      a(), n.push(Ks(t.slice(o + 1, u).map(Xt), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Fd(s) ? Pd : Dd;
    if (i.test(t[o]) && !Wd(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && Sr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (l - o + u.length >= 2) {
        a(), n.push(Ks([...u, ...t.slice(o, l)].map(Xt), "")), o = l;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
$t((e) => Ud(e));
const zd = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Vd = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Gd(e) {
  const t = zd.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = Vd.exec(e), s = n && ut(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Kd(e, t, n, s) {
  const a = wr(s, e, t), o = Xt(a ? uu(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${et(un(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
$t(
  (e, t) => {
    const n = Gd(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Kd(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Yd = /\.(png|jpe?g|gif|webp|svg)$/i, Jd = (e) => Yd.test(e), Zd = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Xd = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Qd(e, t) {
  const n = Zd.exec(e), [, s, a, o, r, i] = n || [], l = n && ut(s || o), u = l && wr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = Ve.in(t.env).fileUrl(l, u.id, i), f = `${un(l).title} ${u.id} · ${et(i)}`, g = Jd(i) ? `<img class="file-card-image" src="${d}" alt="${et(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(i)}">${g}<span class="file-card-name">${f}</span></a>` };
}
function eh(e) {
  const t = Xd.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
$t(
  (e, t) => {
    if (t.inline) return null;
    const n = Qd(e, t) || eh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const th = /`([^`\n]+)`/g;
$t((e) => e.replace(th, (t, n) => `<code>${n}</code>`));
const Qa = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Gn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
$t(
  (e, t) => e.replace(br, (n, s, a, o) => Qa[s] ? Qa[s](a, o, t) : o)
);
const nh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, _r = new RegExp(`\\b(${Zo}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Er = new RegExp(`\\b(${Zo}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), sh = new RegExp(`<code>((?:${_r.source}|${Er.source}))</code>`, "gi"), ah = (e) => e.replace(sh, "$1"), oh = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, rh = (e) => e.replace(Er, (t, n, s) => s.replace(/\d+/g, (a) => oh(n.replace(/s$/i, ""), a))), ih = (e) => rh(e).replace(
  _r,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${ut(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
$t(
  (e, t) => t.rowNames === !1 ? e : ah(e).split(nh).map((n, s) => s % 2 ? n : ih(n)).join("")
);
const lh = ["innerHTML"], ch = ["innerHTML"], uh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = B(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = zs(s, { env: Xe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => V(Ct) && V(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, lh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => V(Ct) && V(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, ch));
  }
}, lt = /* @__PURE__ */ J(uh, [["__scopeId", "data-v-1a43d211"]]), dh = { class: "fact" }, hh = { class: "fact-label" }, fh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", dh, [
      p("span", hh, x(e.label), 1),
      L(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, mh = /* @__PURE__ */ J(fh, [["__scopeId", "data-v-3a88ecf8"]]), ph = { class: "list" }, gh = { class: "list-label" }, vh = {
  key: 1,
  class: "list-note"
}, yh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", ph, [
      (c(!0), h(Y, null, te(e.items, (o, r) => (c(), K(xt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: W(() => [
          p("span", gh, x(o.label), 1),
          o.badge ? (c(), K(Xo, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (c(), h("span", vh, x(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, wh = /* @__PURE__ */ J(yh, [["__scopeId", "data-v-ebe2ae0a"]]), kh = { class: "table" }, bh = {
  key: 0,
  class: "table-row empty"
}, xh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", kh, [
      p("div", {
        class: "table-row head",
        style: fe(a.value)
      }, [
        (c(!0), h(Y, null, te(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, x(i), 1))), 128))
      ], 4),
      (c(!0), h(Y, null, te(e.rows, (i, l) => (c(), K(xt(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: X(["table-row", i.tone, { opens: i.open }]),
        style: fe(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: W(() => [
          (c(!0), h(Y, null, te(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, x(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", bh, x(e.empty), 1)) : A("", !0)
    ]));
  }
}, $h = /* @__PURE__ */ J(xh, [["__scopeId", "data-v-9326a52e"]]), Mh = { class: "stat-value" }, Sh = { class: "stat-label" }, _h = {
  key: 0,
  class: "stat-note"
}, Eh = {
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
    return (s, a) => (c(), K(xt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: W(() => [
        p("span", Mh, x(e.value), 1),
        p("span", Sh, x(e.label), 1),
        e.note ? (c(), h("span", _h, x(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Ah = /* @__PURE__ */ J(Eh, [["__scopeId", "data-v-ad0db6d6"]]), Ch = { class: "code" }, Oh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), K(ln, {
      value: e.node.type
    }, {
      stack: W(() => [
        L(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: W(() => [
        L(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: W(() => [
        L(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: W(() => [
        L(kc, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: W(() => [
        p("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, x(e.node.text), 3)
      ]),
      divider: W(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: W(() => [
        L(Ah, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: W(() => [
        L(mc, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: W(() => [
        L($h, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: W(() => [
        L(wh, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: W(() => [
        L(lt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: W(() => [
        L(mh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: W(() => [
        L(Xo, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: W(() => [
        p("pre", Ch, [
          p("code", null, x(e.node.text), 1)
        ])
      ]),
      file: W(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, x(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Ar = /* @__PURE__ */ J(Oh, [["__scopeId", "data-v-cbdcf540"]]), Th = { class: "dashboard" }, Ih = { class: "trail" }, Rh = ["onClick"], Bh = {
  key: 0,
  class: "gone",
  role: "status"
}, Lh = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (g) => g in (n.document.pages || {}), o = I(!!n.page && !a(n.page)), r = I(n.page && !o.value ? [n.page] : []), i = B(() => r.value.at(-1) || n.document.start), l = B(() => (n.document.pages || {})[i.value] || null), u = (g) => ((n.document.pages || {})[g] || {}).title || g, d = (g) => {
      o.value = !1, r.value = [...r.value, g];
    }, f = (g) => {
      o.value = !1, r.value = r.value.slice(0, g);
    };
    return ke(
      () => n.document.start,
      () => r.value = []
    ), (g, w) => (c(), h("div", Th, [
      e.document.broken ? (c(), K(Bn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: W(() => [
          oe(x(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), K(Bn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: W(() => [
          oe(x(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(Y, { key: 2 }, [
        p("nav", Ih, [
          p("button", {
            type: "button",
            class: X(["step", { current: !r.value.length }]),
            onClick: w[0] || (w[0] = ($) => f(0))
          }, x(u(e.document.start)), 3),
          (c(!0), h(Y, null, te(r.value, ($, M) => (c(), h(Y, {
            key: `${M}-${$}`
          }, [
            w[2] || (w[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: X(["step", { current: M === r.value.length - 1 }]),
              onClick: (_) => f(M + 1)
            }, x(u($)), 11, Rh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Bh, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        L(Lt, {
          name: "page",
          mode: "out-in"
        }, {
          default: W(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              L(Ar, {
                node: l.value.view,
                onOpen: d,
                onFile: w[1] || (w[1] = ($) => s("file", $))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, ab = /* @__PURE__ */ J(Lh, [["__scopeId", "data-v-fbe83734"]]);
function Nh(e, t, n, s = () => window) {
  qe(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ie(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Dh = (e, t = () => !0) => Nh("keydown", (n) => n.key === "Escape" && t() && e());
function Cr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = I(!1), a = B(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Dh(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Ph = 80, Et = ca([]);
function Or(e) {
  const t = Symbol("layer"), n = () => Et.includes(t) && Et.splice(Et.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !Et.includes(t) && Et.push(t), s || n();
    },
    { immediate: !0 }
  ), Ie(n), B(() => Ph + Math.max(0, Et.indexOf(t)));
}
let Tr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Tr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const jh = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function qh(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(jh)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  qe(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : Tr, document.addEventListener("keydown", a), Nt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Fh = ["aria-modal", "aria-label", "aria-labelledby"], Wh = {
  key: 0,
  class: "dialog-head"
}, Hh = ["id", "tabindex"], Uh = {
  key: 1,
  class: "dialog-foot"
}, zh = 500, Vh = 400, Gh = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Cr(s, n), i = Or(a), l = I(null), u = I(null), d = I(null), f = qo(), g = I(!1), w = Date.now();
    n.modal && qh(u, () => s("escape"), d);
    function $() {
      if (!n.modal) return n.closable && o();
      g.value = !0, setTimeout(() => g.value = !1, Vh);
    }
    function M(q) {
      !n.modal || Date.now() - w >= zh || ![" ", "Enter"].includes(q.key) || (q.preventDefault(), q.stopPropagation());
    }
    const _ = () => l.value && (l.value.scrollTop = l.value.scrollHeight), C = new MutationObserver(_);
    return ke(l, (q) => {
      C.disconnect(), q && n.follow && (C.observe(q, { childList: !0, subtree: !0, characterData: !0 }), _());
    }), Ie(() => C.disconnect()), (q, G) => (c(), K(ua, { to: "body" }, [
      L(Lt, {
        name: "dialog",
        appear: "",
        onAfterLeave: V(r)
      }, {
        default: W(() => [
          V(a) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: V(i) }),
            onClick: be($, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: g.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? V(f) : void 0,
              onKeydownCapture: M
            }, [
              e.bare ? A("", !0) : (c(), h("header", Wh, [
                p("h3", {
                  id: V(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, x(e.title), 9, Hh),
                e.closable ? (c(), K(Yn, {
                  key: 0,
                  onClick: V(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: l,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                he(q.$slots, "default", {}, void 0, !0)
              ], 2),
              q.$slots.foot ? (c(), h("footer", Uh, [
                he(q.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, Fh)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Kh = /* @__PURE__ */ J(Gh, [["__scopeId", "data-v-6d1ecd98"]]), at = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, je = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, De = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Yh = 6;
function ka(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Jh = (e) => {
  const t = ka(e, at.lineChars), n = Math.max(at.minWidth, Math.max(...t.map((s) => s.length)) * at.charWidth + at.padX * 2);
  return { name: e, lines: t, line: at.line, padY: at.padY, width: n, height: t.length * at.line + at.padY * 2 };
};
function Zh(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function Xh(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Qh(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, l) => [i, l]))), o = (r, i) => {
    const l = a(), u = (d) => {
      const f = i(d).map((g) => l.get(g));
      return f.length ? f.reduce((g, w) => g + w, 0) / f.length : l.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < Yh; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((g) => g[i ? 1 : 0] === f).map((g) => g[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function ef(e, t) {
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
function tf(e) {
  const t = [...new Set(e.flatMap(([N, y]) => [N, y]))], n = new Set(e.map(([, N]) => N)), s = t.filter((N) => !n.has(N)), a = Zh(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((N, y) => !a.has(y)), r = Xh(t, o), i = Qh(t, o, r), l = new Map(t.map((N) => [N, Jh(N)])), u = i.map((N) => N.reduce((y, E) => y + l.get(E).width, 0) + De.across * (N.length - 1)), d = Math.max(...u) + De.margin * 2, f = sf(e, r, i.length), g = /* @__PURE__ */ new Map();
  let w = De.margin;
  i.forEach((N, y) => {
    let E = (d - u[y]) / 2;
    const k = Math.max(...N.map((T) => l.get(T).height));
    N.forEach((T) => {
      const v = l.get(T);
      g.set(T, { ...v, x: E, y: w + (k - v.height) / 2 }), E += v.width + De.across;
    }), w += k + (f[y] ?? De.down);
  });
  const $ = e.map(([N, y, E], k) => ({ from: N, to: y, label: E || "", back: a.has(k) || r.get(y) <= r.get(N) }));
  ef($, g);
  const M = $.map((N) => af(N, g.get(N.from), g.get(N.to))), _ = [...g.values()], C = cf(M, _), q = Math.max(w - De.down, ...C.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(d - De.margin, ...C.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + De.margin, height: q + De.margin, nodes: _, arrows: C };
}
const nf = (e) => e ? ka(e, je.lineChars).length * je.line + je.pad * 2 : 0;
function sf(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => De.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += nf(r) + De.labelSpace);
  }), s.map((a) => Math.max(De.down, a));
}
function af(e, t, n) {
  const s = e.label ? ka(e.label, je.lineChars) : [], a = s.length ? Math.max(...s.map((g) => g.length)) * je.charWidth + je.pad * 2 : 0, o = s.length * je.line + (s.length ? je.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const of = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, rf = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], lf = [0, -1, 1, -2, 2, -3, 3].map((e) => e * je.line);
function cf(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = of(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = lf.flatMap((l) => rf.map((u) => a(u, l))).find((l) => !n.some((u) => eo(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => eo(i, l)); ) i.y += je.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: je.line, pad: je.pad } };
  });
}
const eo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, uf = { class: "flowchart-tools" }, df = ["width", "height", "viewBox", "aria-label"], hf = ["d"], ff = ["x", "y", "width", "height"], mf = ["x", "y"], pf = ["x", "dy"], gf = {
  key: 0,
  class: "flowchart-label"
}, vf = ["x", "y", "width", "height"], yf = ["x", "y"], wf = ["x", "dy"], kf = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => tf(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = I(null), i = I({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var C;
      const M = (C = r.value) == null ? void 0 : C.getBoundingClientRect();
      if (!(M != null && M.width)) return;
      const _ = Math.min(M.width / a.value.width, M.height / a.value.height, 1.5);
      i.value = { zoom: _, x: (M.width - a.value.width * _) / 2, y: (M.height - a.value.height * _) / 2 };
    }
    function d(M, _, C) {
      const { zoom: q, x: G, y: N } = i.value, y = Math.min(o.most, Math.max(o.least, q * M));
      i.value = { zoom: y, x: _ - (_ - G) * y / q, y: C - (C - N) * y / q };
    }
    function f(M) {
      const _ = r.value.getBoundingClientRect();
      d(M, _.width / 2, _.height / 2);
    }
    function g(M) {
      const _ = r.value.getBoundingClientRect();
      M.ctrlKey || M.metaKey ? d(M.deltaY < 0 ? o.step : 1 / o.step, M.clientX - _.left, M.clientY - _.top) : i.value = { ...i.value, x: i.value.x - M.deltaX, y: i.value.y - M.deltaY };
    }
    function w(M) {
      var _, C, q;
      M.preventDefault(), (_ = window.getSelection()) == null || _.removeAllRanges(), l = { x: M.clientX - i.value.x, y: M.clientY - i.value.y }, (q = (C = r.value).setPointerCapture) == null || q.call(C, M.pointerId);
    }
    function $(M) {
      l && (i.value = { ...i.value, x: M.clientX - l.x, y: M.clientY - l.y });
    }
    return qe(u), (M, _) => (c(), K(Kh, {
      title: e.title,
      large: "",
      onClose: _[4] || (_[4] = (C) => s("close"))
    }, {
      default: W(() => [
        p("div", uf, [
          L(pe, {
            small: "",
            onClick: _[0] || (_[0] = (C) => f(o.step))
          }, {
            default: W(() => [..._[5] || (_[5] = [
              oe("Zoom in", -1)
            ])]),
            _: 1
          }),
          L(pe, {
            small: "",
            onClick: _[1] || (_[1] = (C) => f(1 / o.step))
          }, {
            default: W(() => [..._[6] || (_[6] = [
              oe("Zoom out", -1)
            ])]),
            _: 1
          }),
          L(pe, {
            small: "",
            onClick: u
          }, {
            default: W(() => [..._[7] || (_[7] = [
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
          onPointerdown: w,
          onPointermove: $,
          onPointerup: _[2] || (_[2] = (C) => Da(l) ? l.value = null : l = null),
          onPointercancel: _[3] || (_[3] = (C) => Da(l) ? l.value = null : l = null)
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
            (c(!0), h(Y, null, te(a.value.arrows, (C, q) => (c(), h("path", {
              key: `arrow-${q}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, hf))), 128)),
            (c(!0), h(Y, null, te(a.value.nodes, (C) => (c(), h("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, ff),
              p("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (c(!0), h(Y, null, te(C.lines, (q, G) => (c(), h("tspan", {
                  key: G,
                  x: C.x + C.width / 2,
                  dy: G ? C.line : 0
                }, x(q), 9, pf))), 128))
              ], 8, mf)
            ]))), 128)),
            (c(!0), h(Y, null, te(a.value.arrows, (C, q) => (c(), h(Y, {
              key: `label-${q}`
            }, [
              C.label ? (c(), h("g", gf, [
                p("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, vf),
                p("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (c(!0), h(Y, null, te(C.label.lines, (G, N) => (c(), h("tspan", {
                    key: N,
                    x: C.label.x + C.label.width / 2,
                    dy: N ? C.label.line : 0
                  }, x(G), 9, wf))), 128))
                ], 8, yf)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, df))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, bf = /* @__PURE__ */ J(kf, [["__scopeId", "data-v-51d24cfe"]]), to = {
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
}, xf = ["innerHTML"], $f = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => to[t.name] || to.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, xf));
  }
}, nt = /* @__PURE__ */ J($f, [["__scopeId", "data-v-beb5935c"]]), Mf = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      L(nt, { name: "fold" })
    ], 2));
  }
}, It = /* @__PURE__ */ J(Mf, [["__scopeId", "data-v-d03899bb"]]), Sf = ["data-tip", "aria-label"], _f = {
  key: 0,
  class: "mact-word"
}, Ef = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      L(nt, { name: "open" }),
      e.open ? (c(), h("span", _f, x(e.label), 1)) : A("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Sf));
  }
}, Ir = /* @__PURE__ */ J(Ef, [["__scopeId", "data-v-3b292e09"]]), Af = 120, hs = 280, Cf = 160, Of = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Tf = ["leaving", "resizing", "entering"];
function Rr(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function If(e) {
  const t = Tf.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = Rr(e);
  return e.classList.add(...t), n;
}
function Br(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = I(t()), a = I("");
  let o = 0;
  const r = (u, d) => Object.assign(u.style, { width: `${d.width}px`, height: `${d.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const d = e.value, f = ++o;
    if (!d || !d.offsetWidth || Of()) {
      s.value = u;
      return;
    }
    const g = Rr(d);
    if (r(d, g), a.value = "leaving", await n(Af), f !== o) return;
    s.value = u, a.value = "resizing", await Nt(), i(d);
    const w = If(d);
    r(d, g), d.offsetWidth, d.style.transition = `width ${hs}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${hs}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(d, w), await n(hs), f === o && (i(d), a.value = "entering", await n(Cf), f === o && (a.value = ""));
  }
  return ke(t, (u) => l(u)), Dt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Rf = { class: "growing-card-top" }, Bf = ["aria-expanded"], Lf = { class: "growing-card-avatar" }, Nf = { class: "growing-card-title" }, Df = { class: "growing-card-more" }, Pf = { class: "growing-card-body" }, jf = {
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
    const n = e, s = t, a = I(!1), o = I(null), { folded: r, phase: i } = Br(o, () => !a.value), l = B(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = B(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", V(i), { open: !V(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Rf, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (g) => a.value = !a.value)
        }, [
          p("span", Lf, [
            e.bad ? (c(), K(nt, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(Y, { key: 1 }, [
              oe(x(l.value), 1)
            ], 64)) : (c(), K(ge, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Nf, x(e.title), 1),
          L(It, { open: a.value }, null, 8, ["open"])
        ], 8, Bf),
        e.action ? (c(), K(Ir, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (g) => s("act"))
        }, null, 8, ["label", "open"])) : A("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (g) => s("comment"))
        }, [
          L(ge, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      p("div", Df, [
        p("div", Pf, [
          (c(!0), h(Y, null, te(u.value, (g, w) => (c(), h("p", {
            key: w,
            class: "growing-card-text"
          }, x(g), 1))), 128))
        ])
      ])
    ], 2));
  }
}, qf = /* @__PURE__ */ J(jf, [["__scopeId", "data-v-08411e3a"]]), Lr = /* @__PURE__ */ new WeakMap(), Ff = (e, t) => Lr.set(e, t);
function Wf(e, t) {
  for (let n = t; n; n = Lr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Nr(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Wf(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const Hf = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, Uf = {
  key: 0,
  class: "message-links-many"
}, zf = ["aria-expanded"], Vf = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Gf = ["onClick"], Kf = { class: "row-pill message-links-chip" }, Yf = { class: "message-links-title" }, fs = 3, no = "task", Jf = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Ee(Ce, null), s = B(() => t.links.length), a = B(() => t.links.every((g) => g.model === no) ? "tasks" : "items"), o = B(() => `Linked: ${t.links.map((g) => `${g.model} ${g.id}`).join(" ")}`), r = I(!1), i = I({}), l = I(null);
    Nr(l, () => r.value = !1);
    async function u() {
      const g = t.links.filter(($) => $.model === no && !($.id in i.value)), w = await Promise.all(g.map(($) => n.read(`task show ${$.id}`)));
      i.value = { ...i.value, ...Object.fromEntries(w.filter(($) => $.ok).map(($) => [$.value.id, $.value.title])) };
    }
    function d() {
      r.value = !r.value, r.value && u();
    }
    function f(g) {
      r.value = !1, Ue(`${ut(g.model)}:${g.id}`);
    }
    return (g, w) => (c(), h("div", {
      ref_key: "line",
      ref: l,
      class: X(["message-links", { many: s.value > fs, three: s.value === fs, open: r.value }]),
      "data-message-links": ""
    }, [
      L(nt, {
        class: "message-links-icon",
        name: "linked"
      }),
      p("span", Hf, [
        L(lt, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      s.value >= fs ? (c(), h("span", Uf, [
        p("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: d
        }, [
          oe(x(s.value) + " linked " + x(a.value) + " ", 1),
          L(It, { open: r.value }, null, 8, ["open"])
        ], 8, zf)
      ])) : A("", !0),
      r.value ? (c(), h("div", Vf, [
        (c(!0), h(Y, null, te(e.links, ($) => (c(), h("button", {
          key: `${$.model}:${$.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (M) => f($)
        }, [
          p("span", Kf, x($.model) + " " + x($.id), 1),
          p("span", Yf, x(i.value[$.id]), 1)
        ], 8, Gf))), 128))
      ])) : A("", !0)
    ], 2));
  }
}, Zf = /* @__PURE__ */ J(Jf, [["__scopeId", "data-v-24868afd"]]), Xf = ["title", "aria-label"], Qf = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, e1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, t1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = B(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: X(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", Qf, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", e1)) : A("", !0)
      ]))
    ], 10, Xf));
  }
}, n1 = /* @__PURE__ */ J(t1, [["__scopeId", "data-v-6dc92808"]]);
function s1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function a1(e, t = Date.now()) {
  const n = s1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
function Dr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function so(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const ms = (e) => String(e).padStart(2, "0");
function o1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ms(t % 60)}s` : `${Math.floor(t / 3600)}h ${ms(Math.floor(t % 3600 / 60))}m ${ms(t % 60)}s`;
}
const r1 = "img,pre,table";
function i1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function l1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function c1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(r1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = i1(l1(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function u1(e, t) {
  let n = null;
  const s = () => e.value && c1(e.value);
  qe(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const d1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function h1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const f1 = ["data-incoming", "data-ref"], m1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], p1 = { class: "message-body" }, g1 = ["title"], v1 = ["innerHTML"], y1 = ["title"], w1 = ["innerHTML"], k1 = {
  class: "message-faces",
  "data-message-faces": ""
}, b1 = ["title", "data-face", "onClick"], x1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, $1 = ["title", "data-reaction", "onClick"], M1 = {
  key: 0,
  class: "message-reaction-count"
}, S1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, _1 = ["href", "title"], E1 = ["src", "alt"], A1 = ["href"], C1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, O1 = ["data-sent-worker", "title", "onClick"], T1 = { class: "message-foot" }, I1 = { class: "message-time" }, R1 = {
  class: "message-id",
  "data-message-id": ""
}, B1 = 140, L1 = 2, N1 = 1500, D1 = "An earlier message", P1 = "about", j1 = "sent_to", q1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var P;
    const n = e, s = t, a = I(!1), o = I(null), r = B(() => ["user", "comment"].includes(n.message.type)), i = B(() => {
      const [R, Z] = (n.message.commented_row || ":").split(":"), z = ut(R);
      return z ? { ref: `${z}:${Z}`, label: `${un(z).title.toLowerCase()} ${Z}` } : null;
    }), l = B(() => n.message.worker_id ?? null), u = I(!1), d = B(() => l.value !== null && ((n.message.text ?? "").length > B1 || (n.message.text ?? "").split(`
`).filter((R) => R.trim()).length > L1)), f = B(() => r.value && !n.message.read_at && !n.message.local);
    async function g() {
      var R;
      await ((R = navigator.clipboard) == null ? void 0 : R.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, N1);
    }
    const w = B(() => zs(n.message.text ?? "", { env: "" })), $ = B(() => JSON.parse(n.message.flowchart_edges || "[]")), M = I(!1), _ = B(() => zs(n.quote || D1, { env: "" }));
    function C() {
      const R = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      R ? R.scrollIntoView({ block: "center", behavior: "smooth" }) : Ue(`messages:${n.message.parent_id}`);
    }
    u1(o, () => `${n.message.text} ${n.quote}`);
    const q = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, G = (R) => `/api/files/message/${n.message.id}/${encodeURIComponent(R)}`, N = B(() => JSON.parse(n.message.captions || "{}")), y = B(() => (n.message.files ?? []).map((R) => ({ name: R, address: G(R), isImage: q.test(R), title: N.value[R] || R }))), E = B(() => Dr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), k = Ee(Ce, null), T = I([]), v = I([]);
    async function S() {
      if (!r.value || !(k != null && k.read) || n.message.local) return;
      const R = await k.read(`link list --source message:${n.message.id}`);
      if (!R.ok) return;
      const Z = R.value.rows ?? R.value ?? [];
      T.value = Z.filter((z) => z.link_type === P1).map((z) => ({ model: z.target_model, id: z.target_id })), v.value = Z.filter((z) => z.link_type === j1).map((z) => z.target_id);
    }
    S(), (P = k == null ? void 0 : k.follow) == null || P.call(k, ["link.*"], S);
    const b = I(!1), m = B(() => h1(n.message.reactions));
    function D(R) {
      b.value = !1, s("react", n.message, R);
    }
    return (R, Z) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      L(qf, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: Z[0] || (Z[0] = (z) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, f1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", p1, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: i.value }]),
          onClick: Z[6] || (Z[6] = (...z) => V(Ct) && V(Ct)(...z))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: Z[1] || (Z[1] = be((z) => V(Ue)(i.value.ref), ["stop"]))
          }, [
            L(ge, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + x(i.value.label), 1)
          ], 8, g1)) : A("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(C, ["stop"]),
            innerHTML: _.value
          }, null, 8, v1)) : A("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: Z[2] || (Z[2] = be((z) => V(Ue)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + x(l.value), 9, y1)) : A("", !0),
          p("div", {
            class: X({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: w.value
          }, null, 10, w1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: Z[3] || (Z[3] = be((z) => u.value = !u.value, ["stop"]))
          }, x(u.value ? "Show less" : "Show more"), 1)) : A("", !0),
          $.value.length ? (c(), h(Y, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: Z[4] || (Z[4] = (z) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (c(), K(bf, {
              key: 0,
              title: e.message.text,
              edges: $.value,
              onClose: Z[5] || (Z[5] = (z) => M.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        p("div", {
          class: X(["message-tools", { picking: b.value }]),
          "data-message-tools": ""
        }, [
          b.value ? (c(), h(Y, { key: 0 }, [
            p("div", k1, [
              (c(!0), h(Y, null, te(V(d1), (z) => (c(), h("button", {
                key: z,
                type: "button",
                class: "message-face",
                title: `React ${z}`,
                "data-face": z,
                onClick: (ce) => D(z)
              }, x(z), 9, b1))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: Z[7] || (Z[7] = (z) => b.value = !1)
            }, [
              L(ge, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(Y, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: Z[8] || (Z[8] = (z) => b.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: Z[9] || (Z[9] = (z) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: g
            }, x(a.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: Z[10] || (Z[10] = (z) => s("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      m.value.length ? (c(), h("div", x1, [
        (c(!0), h(Y, null, te(m.value, (z) => (c(), h("button", {
          key: z.emoji,
          type: "button",
          class: X(["message-reaction", { mine: z.mine }]),
          title: z.title,
          "data-reaction": z.emoji,
          onClick: (ce) => s("react", e.message, z.emoji)
        }, [
          oe(x(z.emoji) + " ", 1),
          z.count > 1 ? (c(), h("span", M1, x(z.count), 1)) : A("", !0)
        ], 10, $1))), 128))
      ])) : A("", !0),
      y.value.length ? (c(), h("div", S1, [
        (c(!0), h(Y, null, te(y.value, (z) => (c(), h(Y, {
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
            }, null, 8, E1)
          ], 8, _1)) : (c(), h("a", {
            key: 1,
            href: z.address,
            target: "_blank",
            class: "message-file"
          }, x(z.name), 9, A1))
        ], 64))), 128))
      ])) : A("", !0),
      v.value.length ? (c(), h("div", C1, [
        L(ge, {
          name: "send",
          size: 12
        }),
        (c(!0), h(Y, null, te(v.value, (z) => (c(), h("button", {
          key: z,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": z,
          title: `Open worker ${z}`,
          onClick: be((ce) => V(Ue)(`agents:${z}`), ["stop"])
        }, "Also sent to worker " + x(z), 9, O1))), 128))
      ])) : A("", !0),
      p("div", T1, [
        p("time", I1, x(E.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(Y, { key: 0 }, [
          Z[11] || (Z[11] = p("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          p("span", R1, "message " + x(e.message.id), 1)
        ], 64)) : A("", !0),
        r.value ? (c(), K(n1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      T.value.length ? (c(), K(Zf, {
        key: 3,
        links: T.value
      }, null, 8, ["links"])) : A("", !0)
    ], 8, m1));
  }
}, ob = /* @__PURE__ */ J(q1, [["__scopeId", "data-v-b057248a"]]), F1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = Ui("SkeletonParts", !0);
      return c(!0), h(Y, null, te(e.parts, (l, u) => (c(), h(Y, { key: u }, [
        (c(!0), h(Y, null, te(l.count, (d) => (c(), K(ln, {
          key: d,
          value: l.shape
        }, {
          line: W(() => [
            p("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: fe({ width: l.width, height: `${t[l.size]}px` })
            }, null, 4)
          ]),
          circle: W(() => [
            p("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: fe({ width: `${n[l.size]}px`, height: `${n[l.size]}px` })
            }, null, 4)
          ]),
          block: W(() => [
            p("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: fe({ width: l.width, height: `${l.height}px` })
            }, null, 4)
          ]),
          grow: W(() => [...r[0] || (r[0] = [
            p("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: W(() => [
            p("div", {
              class: "skeleton-row",
              style: fe(s(l))
            }, [
              L(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: W(() => [
            p("div", {
              class: "skeleton-stack",
              style: fe(s(l))
            }, [
              L(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: W(() => [
            p("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: fe(s(l))
            }, [
              L(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: W(() => [
            p("div", {
              class: "skeleton-grid",
              style: fe(a(l))
            }, [
              L(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), W1 = /* @__PURE__ */ J(F1, [["__scopeId", "data-v-576c95e1"]]), H1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, U1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", H1, [
      L(W1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Pr = /* @__PURE__ */ J(U1, [["__scopeId", "data-v-52f66b64"]]), Dn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ps = 200, jr = (e) => {
  var t;
  return ((t = Dn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Dn[0].key;
}, rb = (e) => {
  var t;
  return ((t = Dn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, z1 = ["aria-label"], V1 = 300, ao = 400, G1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ps } },
  setup(e) {
    const t = e, n = B(() => jr(t.value)), s = B(() => n.value < ps ? [1, 0.25, 0.25] : n.value === ps ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: n.value >= ao, high: n.value >= V1 && n.value < ao }]),
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
    ], 10, z1));
  }
}, ib = /* @__PURE__ */ J(G1, [["__scopeId", "data-v-b10e610f"]]), K1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, oo = (e) => K1[e.card.state] || "idle", Y1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), ro = { working: 0, waiting: 1, idle: 2, stopped: 3 }, io = (e, t) => ro[oo(e)] - ro[oo(t)], lo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, lb = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => io(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || Y1(s, a)) : [...e].sort((s, a) => io(s, a) || (lo[t] || lo.state)(s, a)), J1 = ["aria-checked", "aria-haspopup", "onClick"], Z1 = {
  key: 0,
  class: "segmented-dot"
}, X1 = {
  key: 1,
  class: "segmented-count"
}, Q1 = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = qo();
    return (a, o) => {
      const r = zi("tip");
      return c(), h("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(Y, null, te(e.options, (i) => ht((c(), h("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: X(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), h("span", Z1)) : A("", !0),
          oe(" " + x(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", X1, x(i.count), 1)) : A("", !0)
        ], 10, J1)), [
          [r, i.tip || i.title, `${V(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, qr = /* @__PURE__ */ J(Q1, [["__scopeId", "data-v-ca953072"]]), em = { class: "form-field" }, tm = { class: "form-field-head" }, nm = ["for"], sm = {
  key: 0,
  class: "form-field-aside"
}, am = {
  key: 0,
  class: "form-field-help"
}, om = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", em, [
      p("div", tm, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, x(e.label), 9, nm),
        t.$slots.aside ? (c(), h("span", sm, [
          he(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      he(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", am, x(e.help), 1)) : A("", !0)
    ]));
  }
}, cb = /* @__PURE__ */ J(om, [["__scopeId", "data-v-dd7cdcff"]]), rm = { class: "list-row" }, im = {
  key: 0,
  class: "list-row-kind"
}, lm = { class: "list-row-main" }, cm = {
  key: 0,
  class: "list-row-title"
}, um = { class: "list-row-body" }, dm = {
  key: 1,
  class: "list-row-end"
}, hm = {
  key: 1,
  class: "list-row-text"
}, fm = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", rm, [
      e.kind ? (c(), h("span", im, x(e.kind), 1)) : A("", !0),
      p("div", lm, [
        e.title ? (c(), h("span", cm, x(e.title), 1)) : A("", !0),
        p("div", um, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", dm, [
          he(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (c(), h("span", hm, x(e.text), 1)) : A("", !0)
    ]));
  }
}, ub = /* @__PURE__ */ J(fm, [["__scopeId", "data-v-63155fba"]]), mm = {
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
}, pm = { claude: "Claude Code", codex: "Codex" }, gm = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, vm = {
  key: 1,
  class: "menu-item-text"
}, ym = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", gm, x(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (c(), h("span", vm, [
        p("span", null, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, x(e.description), 1)
      ])) : he(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Rt = /* @__PURE__ */ J(ym, [["__scopeId", "data-v-fec99974"]]), wm = (e, t, n) => Math.max(t, Math.min(n, e)), km = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, At = 8, bm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = I(null), o = (m) => m ? `${m}px` : void 0, r = B(() => ({
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
      const D = m.closest(".pane, .float-window");
      return D ? d(D.getBoundingClientRect()) : u();
    }, g = (m, D) => `${Math.max(0, m ? Math.min(m, D) : D)}px`;
    function w(m, D) {
      return {
        below: m.bottom - D.bottom - s.gap - At,
        above: D.top - m.top - s.gap - At,
        across: m.right - m.left - 2 * At
      };
    }
    function $(m) {
      const D = f(s.anchor), P = w(D, m);
      return i.value.w <= P.across && i.value.h <= Math.max(P.below, P.above) ? D : u();
    }
    const M = B(() => {
      if (!l.value) return r.value;
      const m = l.value, D = $(m), P = w(D, m), { w: R, h: Z } = i.value, z = s.align === "auto" ? m.left + m.right > D.left + D.right : s.align === "right", ce = wm(z ? m.right - R : m.left, D.left + At, Math.max(D.left + At, D.right - R - At)), ye = Z > P.below && P.above > P.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: g(s.maxHeight, P.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: g(s.maxHeight, P.below) };
      return { ...r.value, ...ye, left: `${ce}px`, maxWidth: g(s.maxWidth, P.across) };
    }), _ = n, C = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function q(m) {
      const D = C(), P = D.indexOf(document.activeElement);
      D[(P + m + D.length) % D.length].focus();
    }
    const G = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => _("close") }, N = (m) => G[m.key] && (m.preventDefault(), G[m.key]()), y = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let E = 0;
    const k = new ResizeObserver(() => {
      cancelAnimationFrame(E), E = requestAnimationFrame(y);
    });
    Nr(a, (m) => s.anchor && !s.anchor.contains(m.target) && _("close"));
    const T = (m, D) => ["top", "left", "right", "bottom"].some((P) => Math.abs(m[P] - D[P]) > 1), v = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let S = 0;
    function b() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || v(m)) return _("close");
        T(m, l.value) && (l.value = m);
      }
      S = requestAnimationFrame(b);
    }
    return qe(() => {
      s.anchor && a.value && Ff(a.value, s.anchor), y(), a.value && k.observe(a.value), !s.plain && C()[0] && C()[0].focus(), b();
    }), Ie(() => {
      k.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(E);
    }), t({ element: a }), (m, D) => (c(), K(ua, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", tt({
        ref_key: "panel",
        ref: a
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: N
      }), [
        he(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ba = /* @__PURE__ */ J(bm, [["__scopeId", "data-v-3d203970"]]), xm = ["aria-expanded"], $m = { class: "drop-label" }, Mm = ["value"], Sm = {
  key: 1,
  class: "drop-lead"
}, _m = { class: "drop-item-text" }, Em = {
  key: 2,
  class: "drop-note"
}, Am = {
  key: 1,
  class: "drop-none"
}, Cm = {
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
    const n = e, s = t, a = I(!1), o = I(null), r = I(""), i = B(() => {
      const u = r.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function l(u) {
      a.value = !1, s("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: X(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      p("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: X(["drop-head", { on: a.value }]),
        "aria-expanded": a.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => a.value = !a.value)
      }, [
        e.icon ? (c(), K(ge, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        p("span", $m, x(e.label), 1),
        L(ge, {
          name: "down",
          size: 11
        })
      ], 10, xm),
      a.value ? (c(), K(ba, {
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
          }, null, 40, Mm)) : A("", !0),
          (c(!0), h(Y, null, te(i.value, (f) => (c(), K(Rt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (g) => l(f)
          }, {
            default: W(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: X(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (c(), h("span", Sm, x(f.lead), 1)) : A("", !0),
              p("span", _m, x(f.label), 1),
              f.note ? (c(), h("span", Em, x(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? A("", !0) : (c(), h("p", Am, x(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, Om = /* @__PURE__ */ J(Cm, [["__scopeId", "data-v-29dfcce5"]]), db = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => [
      ...mm[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = B(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (r, i) => (c(), K(Om, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${V(pm)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Tm = ["aria-label"], Im = { class: "head" }, Rm = { class: "names" }, Bm = { class: "body" }, Lm = {
  key: 0,
  class: "foot"
}, Nm = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Cr(s, n), i = Or(a);
    return (l, u) => (c(), K(ua, { to: "body" }, [
      L(Lt, {
        name: "side",
        appear: "",
        onAfterLeave: V(r)
      }, {
        default: W(() => [
          V(a) ? (c(), h("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: V(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = be((...d) => V(o) && V(o)(...d), ["self"]))
          }, [
            p("aside", {
              class: X(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(Y, { key: 0 }, [
                p("header", Im, [
                  p("div", Rm, [
                    p("h2", null, x(e.title), 1),
                    e.abstract ? (c(), K(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  he(l.$slots, "actions", {}, void 0, !0),
                  L(Yn, {
                    title: e.closeLabel,
                    onClick: V(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                p("div", Bm, [
                  he(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", Lm, [
                  he(l.$slots, "foot", {}, void 0, !0)
                ])) : A("", !0)
              ], 64)) : he(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, Tm)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, hb = /* @__PURE__ */ J(Nm, [["__scopeId", "data-v-c9a3f43a"]]), Ys = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Dm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Hn(), n = B(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => ht((c(), h("textarea", tt({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [V(Ys), V(t).value]
    ]);
  }
}), fb = /* @__PURE__ */ J(Dm, [["__scopeId", "data-v-e130a5b9"]]), Pm = {
  key: 1,
  class: "text-field-label"
}, jm = {
  key: 2,
  class: "text-field-end"
}, qm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ns({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Ls(e, "modelValue"), s = Hn(), a = "onUpdate:modelValue" in (((d = Vi()) == null ? void 0 : d.vnode.props) || {}), o = B(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = B(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = B(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, g) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: f.$slots.end }, V(s).class]),
      style: fe(V(s).style)
    }, [
      e.icon ? (c(), K(ge, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (c(), h("span", Pm, x(e.label), 1)) : A("", !0),
      ht(p("input", tt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [V(Ys), o.value]
      ]),
      f.$slots.end ? (c(), h("span", jm, [
        he(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : ht((c(), h("input", tt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [V(Ys), o.value]
    ]);
  }
}), mb = /* @__PURE__ */ J(qm, [["__scopeId", "data-v-d9c38ca8"]]), Fm = 150;
function Fr(e, t, n = Fm, s = performance.now()) {
  const a = e + n - s;
  if (a <= 0) return void t();
  setTimeout(t, a);
}
const co = (e) => e.page * e.size < e.total;
function Wm(e, t, { incremental: n = !1 } = {}) {
  const s = zn(), a = I([]), o = I(""), r = I(!1), i = performance.now(), l = I(!1), u = I(""), d = I(null);
  async function f(G) {
    const N = $, y = await s.read(`${e} --before-id ${G + 1} --limit 1`);
    if (N !== $) return;
    if (!y.ok) return _();
    const E = y.value.rows.find((k) => k.id === G);
    a.value = E ? a.value.map((k) => k.id === G ? E : k) : a.value.filter((k) => k.id !== G);
  }
  async function g(G) {
    if (n && String((G == null ? void 0 : G.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((v) => v.id !== G.row_id));
    if (n && (G != null && G.row_id) && !String(G.event ?? "").endsWith(".create") && a.value.some((v) => v.id === G.row_id)) return f(G.row_id);
    if (!(n && a.value.length && String((G == null ? void 0 : G.event) ?? "").endsWith(".create"))) return _();
    const y = Math.max(...a.value.map((v) => v.id)), E = $, k = await s.read(`${e} --after-id ${y}`);
    if (E !== $) return;
    if (!k.ok) return _();
    const T = new Set(a.value.map((v) => v.id));
    a.value = [...k.value.rows.filter((v) => !T.has(v.id)), ...a.value];
  }
  async function w() {
    if (!a.value.length) return !1;
    const G = $, N = Math.min(...a.value.map((k) => k.id)), y = await s.read(`${e} --before-id ${N}`);
    if (G !== $) return !1;
    if (!y.ok || !y.value.rows.length) return l.value = !1;
    l.value = co(y.value);
    const E = new Set(a.value.map((k) => k.id));
    return a.value = [...a.value, ...y.value.rows.filter((k) => !E.has(k.id))], !0;
  }
  let $ = 0;
  async function M(G) {
    const N = ++$, y = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (N !== $) return;
    const E = y.ok ? s.shared ? [y.value] : y.value.rows : [];
    a.value = G(E);
    const k = E.length ? Math.min(...E.map((T) => T.id)) : 0;
    y.ok && !a.value.some((T) => T.id < k) && (l.value = !s.shared && co(y.value)), o.value = y.ok ? "" : y.error, Fr(i, () => r.value = !0);
  }
  function _() {
    return M((G) => {
      if (!n || !G.length) return G;
      const N = Math.min(...G.map((E) => E.id)), y = Math.max(...G.map((E) => E.id));
      return [...a.value.filter((E) => E.id > y), ...G, ...a.value.filter((E) => E.id < N)];
    });
  }
  const C = () => M((G) => G);
  async function q(G, N = null) {
    const y = a.value;
    N && (a.value = N(y));
    const E = await s.run(G);
    return N && !E.ok && (a.value = y), u.value = E.ok ? "" : E.error, d.value = E.ok ? E.value : null, await _(), E;
  }
  return s.follow(t, g), _(), { rows: a, failure: o, loaded: r, more: l, load: _, loadLatest: C, older: w, act: q, actionFailure: u, answer: d, context: s };
}
const Hm = { class: "title" }, Um = { class: "state" }, zm = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Wm(t.line, t.events);
    return (o, r) => (c(), K(Gl, {
      rows: V(n),
      failure: V(s),
      loaded: V(a),
      empty: e.empty
    }, {
      default: W(({ row: i }) => [
        p("span", Hm, x(i.title), 1),
        p("span", Um, x(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, pb = /* @__PURE__ */ J(zm, [["__scopeId", "data-v-a69084cd"]]);
function Vm(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ke(t, a, { immediate: !0 }) : a(!0), Ie(() => clearInterval(s)), n;
}
const gs = I(Date.now() / 1e3);
let uo = 0, $n = 0;
function Gm() {
  return $n || (gs.value = Date.now() / 1e3, uo = setInterval(() => gs.value = Date.now() / 1e3, 1e3)), $n += 1, Fo() && Wo(() => {
    $n -= 1, $n || clearInterval(uo);
  }), gs;
}
const Km = ["title", "data-figure-mark", "data-folded", "data-open"], Ym = {
  key: 2,
  class: "worker"
}, Jm = { class: "head" }, Zm = { key: 0 }, Xm = {
  key: 3,
  class: "status"
}, Qm = {
  key: 0,
  class: "figure"
}, ep = {
  key: 1,
  class: "ran-for"
}, tp = { key: 2 }, np = {
  key: 3,
  class: "news"
}, sp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, ap = {
  key: 6,
  class: "settled"
}, op = {
  key: 1,
  class: "bar"
}, rp = {
  key: 3,
  class: "detail body"
}, ip = {
  key: 0,
  class: "body-label"
}, lp = ["title"], cp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Hn(), s = ["onClick", "onAct"], a = B(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = I(!1), r = B(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = B(() => t.open !== void 0), l = B(() => i.value || r.value), u = B(() => i.value ? t.open : o.value), d = B(() => i.value ? !t.open : r.value && !o.value), f = B(() => !!(t.mark.action && n.onAct)), g = B(() => l.value || f.value || !!n.onClick), w = I(null), $ = I(null), { folded: M, phase: _ } = Br(w, () => d.value);
    function C(le) {
      var ye, Re;
      if (!(le.target !== w.value && !$.value.contains(le.target))) {
        if (i.value) return (ye = n.onClick) == null ? void 0 : ye.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Re = n.onAct || n.onClick) == null || Re(le);
      }
    }
    const q = (le) => n.onAct(le), G = ["failed", "unfinished"], N = B(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? G.includes(t.mark.state) ? "danger" : "good" : ""), y = B(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), E = B(() => y.value || "var(--tone-work)"), k = B(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), T = Gm(), v = B(
      () => t.mark.began_at && k.value && !t.mark.figure && !t.mark.counting ? o1(T.value - t.mark.began_at) : ""
    ), S = B(() => {
      const { started: le, ended: ye } = t.mark;
      return le ? ye ? `ran ${so(ye - le, !0)}` : so(T.value - le, !0) : v.value;
    }), b = ["bad", "danger", "warn"], m = B(() => b.includes(N.value) || t.mark.asks ? "attention" : k.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), D = ["bad", "danger"], P = B(() => D.includes(N.value)), R = B(() => m.value === "process" ? "running" : P.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), Z = B(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), z = B(() => [t.mark.title, t.mark.time ? Dr(t.mark.time) : ""].filter(Boolean).join(" · ")), ce = B(() => ({
      ...y.value ? { "--mark": y.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ye) => (c(), h("div", tt(a.value, {
      ref_key: "root",
      ref: w,
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
          tinted: y.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ce.value,
      title: z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": V(M) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: C
    }), [
      (c(), K(xt(g.value ? "button" : "span"), {
        ref_key: "top",
        ref: $,
        class: "top",
        type: g.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: W(() => [
          e.mark.markIcon ? (c(), K(nt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), K(ge, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Ym, x(e.mark.worker), 1)) : A("", !0),
          p("span", Jm, [
            L(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Zm, x(e.mark.name), 1)) : A("", !0),
            l.value ? (c(), K(It, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          Z.value ? (c(), h("span", Xm, [
            e.mark.figure ? (c(), h("span", Qm, x(e.mark.figure), 1)) : A("", !0),
            S.value ? (c(), h("span", ep, x(S.value), 1)) : A("", !0),
            e.mark.stopping ? (c(), h("span", tp, "Stopping")) : A("", !0),
            e.mark.news ? (c(), h("span", np, x(e.mark.news), 1)) : A("", !0),
            R.value === "running" ? (c(), h("span", sp)) : R.value ? (c(), K(nt, {
              key: 5,
              class: X(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (c(), h("span", ap, x(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), K(Ir, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: be(q, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && k.value ? (c(), h("span", op, [
        p("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: E.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !V(M) ? (c(), K(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !V(M) ? (c(), h("div", rp, [
        e.mark.bodyLabel ? (c(), h("p", ip, x(e.mark.bodyLabel), 1)) : A("", !0),
        L(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !V(M) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, x(e.mark.command), 9, lp)) : A("", !0),
      e.mark.card ? (c(), K(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      he(le.$slots, "default", {
        shown: !V(M)
      }, void 0, !0)
    ], 16, Km));
  }
}), Wr = /* @__PURE__ */ J(cp, [["__scopeId", "data-v-74d78abb"]]), up = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Hr(e) {
  var n;
  const t = up[e] || ((n = un(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const dp = (e) => Hr(String(e).split(":")[0]), Ur = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), hp = { passed: "good", failed: "danger", warned: "warn", running: "" }, fp = { good: "good", warn: "warn", danger: "danger" }, ho = {
  "open row": (e) => Ue(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Pl(e.target_model, e.target_id || 0)
}, mp = { "open row": (e) => dp(e.target_model), "open page": () => Hr("pages") };
function pp(e, t) {
  const n = t || {}, s = ho[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? hp[e.outcome] || "" : fp[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? mp[s](e) : "",
    handlers: s ? { onAct: () => ho[s](e) } : {}
  };
}
const gp = 24, vp = 1e3, fo = 2e3, yp = 0.25, wp = 5e3;
function kp(e, t = gp, n = () => !0) {
  const s = I(!1), a = I(0), o = I(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const N = u();
    return N ? N.scrollHeight - N.scrollTop - N.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function g(N) {
    if (clearTimeout(r), !N) {
      o.value = !1, l = Date.now();
      return;
    }
    const y = Date.now() - l < fo ? fo : vp;
    r = setTimeout(() => o.value = s.value, y);
  }
  function w() {
    clearTimeout(i), s.value = !1, a.value = 0, g(!1);
  }
  function $(N = !1) {
    const y = u();
    y && N && y.scrollTo ? y.scrollTo({ top: y.scrollHeight, behavior: "smooth" }) : y && (y.scrollTop = y.scrollHeight), w();
  }
  function M() {
    C(), !s.value && (s.value = !0, g(!0));
  }
  const _ = () => !!u() && d() <= u().clientHeight * yp;
  function C() {
    clearTimeout(i), _() && (i = setTimeout(() => s.value && _() && n() && $(!0), wp));
  }
  function q() {
    f() ? w() : M();
  }
  function G(N = 1, y = !1) {
    s.value ? a.value += Math.max(0, N) : $(y);
  }
  return Fo() && Wo(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: w, toBottom: $, left: M, scrolled: q, arrived: G };
}
const bp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, xp = (e) => String(e ?? "").replace(bp, ""), $p = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(null), { away: o, scrolled: r, arrived: i, toBottom: l } = kp(a);
    ke(
      () => n.lines.length,
      () => Nt(() => i()),
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
      oe(x(V(xp)(e.lines.join(`
`)) || e.empty), 1),
      V(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (g) => V(l)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, Mp = /* @__PURE__ */ J($p, [["__scopeId", "data-v-d9fa8127"]]), Sp = 1e4;
class _p {
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
    return this.heardAt !== null && t - this.heardAt > Sp;
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
const Ep = {
  key: 0,
  class: "frame-note"
}, Ap = {
  key: 0,
  class: "frame-note"
}, Cp = ["src", "title"], Op = 1e3, Tp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = zn(), s = I(null), a = I(!1), o = I(!1);
    let r = null, i = 0;
    return qe(() => {
      r = new _p(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Op);
    }), Ie(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", Ep, "This window was closed because it stopped answering.")) : (c(), h(Y, { key: 1 }, [
      a.value ? (c(), h("div", Ap, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        L(pe, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: W(() => [...u[1] || (u[1] = [
            oe("Close the window", -1)
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
        title: V(n).window
      }, null, 8, Cp)
    ], 64));
  }
}, Ip = /* @__PURE__ */ J(Tp, [["__scopeId", "data-v-32a49046"]]), Rp = 0, Bp = "/api/lines", Lp = "/api/line";
class Np {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Rp));
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
        const n = await Pe.raw(Bp, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Pe.raw(Lp, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Dp = new Np();
class Pp {
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
      n.patterns.some((s) => zr(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function zr(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const jp = Symbol("pane-page"), qp = { 1: "refused", 2: "usage", 3: "fault" }, Fp = 100, Wp = 50, Hp = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Up({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: g = "", tabs: w = [], search: $ = {}, readOnly: M = !1, shared: _ = null }) {
  const C = /* @__PURE__ */ new Map(), q = new AbortController(), G = I(!1), N = performance.now();
  let y = 0, E = 0;
  const k = () => {
    clearTimeout(E), E = setTimeout(() => {
      y === 0 && Fr(N, () => G.value = !0);
    }, Wp);
  }, T = (v) => {
    const S = C.get(v);
    if (S && performance.now() - S.at < Fp) return S.answer;
    y += 1;
    const b = Gr(e, v, t, q.signal).finally(() => {
      y -= 1, k();
    });
    return C.set(v, { answer: b, at: performance.now() }), b;
  };
  return {
    answered: G,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: B(() => s()),
    permissions: a,
    autoScroll: g,
    tabs: w,
    search: $,
    readOnly: M,
    shared: _,
    read: T,
    run: (v) => en(e, v, t, q.signal),
    upload: (v) => Vp(v, q.signal),
    cancel: () => q.abort(),
    subscriptions: r,
    follow: (v, S) => r.follow(e, v.filter((b) => o.some((m) => zr(m, b))), S, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (v) => B(() => {
      var S;
      return l.value[v] ?? ((S = u.find((b) => b.key === v)) == null ? void 0 : S.default);
    }),
    setting: async (v, S) => {
      const b = await T(`window setting ${e} ${v}`);
      return b.ok ? b.value.value : S;
    },
    setOption: f,
    keep: (v, S) => en(e, ["window", "save-setting", e, v, JSON.stringify(S)], t, q.signal)
  };
}
function zp(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Qt = { ok: !1, failure: "cancelled", error: "" }, Vr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function en(e, t, n, s = void 0) {
  try {
    const a = await Dp.add({ window: e, line: Array.isArray(t) ? t : Gp(t), environment: n }, s);
    return s != null && s.aborted ? Qt : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: qp[a.code] || "fault", error: zp(a.error) };
  } catch {
    return s != null && s.aborted ? Qt : { ok: !1, failure: "unreachable", error: Vr };
  }
}
async function Gr(e, t, n, s) {
  const a = await en(e, t, n, s);
  return a.failure !== "unreachable" || !da() ? a : (await Dc(), s.aborted ? Qt : Gr(e, t, n, s));
}
async function Vp(e, t = void 0) {
  try {
    const n = await Pe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? Qt : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Qt : { ok: !1, failure: "unreachable", error: Vr };
  }
}
function Gp(e) {
  return [...e.matchAll(Hp)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Kp({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Yp = {
  class: "allowance-prompt",
  role: "dialog"
}, Jp = { class: "allowance-prompt-text" }, Zp = { class: "allowance-prompt-buttons" }, Xp = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Yp, [
      p("p", Jp, x(V(Kp)(e.request)), 1),
      p("div", Zp, [
        L(pe, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: W(() => [...a[2] || (a[2] = [
            oe("Allow", -1)
          ])]),
          _: 1
        }),
        L(pe, {
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
}, Qp = /* @__PURE__ */ J(Xp, [["__scopeId", "data-v-102dc765"]]), vs = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), K(Bn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: W(() => [
        oe(x(e.reason) + " ", 1),
        e.retry ? (c(), K(pe, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: W(() => [...a[2] || (a[2] = [
            oe("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (c(), K(pe, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: W(() => [...a[3] || (a[3] = [
            oe("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, eg = ["data-window", "data-agent"], tg = {
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
    const i = Ee(kl, null), l = Up({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: B(() => n.options),
      declared: n.declared,
      page: Ee(jp, null),
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
    Gi(Ce, l), ke(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), qe(l.settle), Ie(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), Ki((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => la(n.component), d = () => {
      var f, g;
      return ((g = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : g.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, g) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), K(Qp, {
        key: 0,
        request: d(),
        onAnswer: g[0] || (g[0] = (w) => e.prompts.answer(w))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (c(), K(vs, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), K(vs, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(Y, { key: 4 }, [
        (c(), K(u, { key: o.value })),
        e.skeleton.length && !V(l).answered.value ? (c(), K(Pr, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (c(), K(vs, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: g[1] || (g[1] = (w) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, eg));
  }
}, Kr = /* @__PURE__ */ J(tg, [["__scopeId", "data-v-1db91f82"]]), ng = {
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
    const n = e, s = t, a = { render: () => la(Ip, { src: n.entry.entry_url }) };
    return (o, r) => (c(), K(Kr, {
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
}, sg = ["data-window"], ag = {
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
    return ke(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, Oc();
          } catch (i) {
            if (Ac(i) && Cc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      L(Pr, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, sg)) : (c(), K(Kr, {
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
}, mo = "*.*", og = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var u;
    const t = e, n = Ee(Ce, null), s = new Pp(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [mo], (d) => s.dispatch(d));
    Ie(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? "", r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = B(() => !!(t.declaration.shipped || t.declaration.trusted)), l = B(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [mo] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), K(ag, {
      key: 0,
      entry: l.value,
      subscriptions: V(s),
      environment: V(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), K(ng, {
      key: 1,
      entry: l.value,
      subscriptions: V(s),
      environment: V(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, rg = { class: "mark-more-inner" }, ig = {
  class: "mark-lines",
  "data-mark-reason": ""
}, lg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, cg = {
  key: 3,
  class: "mark-lines"
}, ug = "process", po = "task", dg = 2e3, hg = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ee(Ce), s = B(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = B(() => Ur.has(t.mark.variant) && t.mark.detail || ""), o = B(() => t.mark.target_model === po ? t.mark.target_id : 0), r = I([]), i = I(!1), l = I(""), u = B(() => t.mark.target_model === ug && !!t.mark.target_id);
    async function d() {
      const w = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, l.value = w.ok ? "" : w.error, w.ok && (r.value = w.value.lines);
    }
    let f = null;
    const g = () => clearInterval(f);
    return ke(() => t.shown && u.value, (w) => {
      g(), w && (d(), t.mark.ended_at || (f = setInterval(d, dg)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (w) => w && t.shown && u.value && (g(), d())), Ie(g), (w, $) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: $[1] || ($[1] = be(() => {
      }, ["stop"]))
    }, [
      p("div", rg, [
        e.declaration.body_url ? (c(), K(og, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(Y, { key: 1 }, [
          a.value ? (c(), h(Y, { key: 0 }, [
            $[2] || ($[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", ig, x(a.value), 1)
          ], 64)) : A("", !0),
          u.value && l.value ? (c(), h("p", lg, x(l.value), 1)) : u.value && i.value ? (c(), h(Y, { key: 2 }, [
            $[3] || ($[3] = p("p", { class: "mark-label" }, "Output", -1)),
            L(Mp, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", cg, x(s.value.join(`
`)), 1)) : A("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: $[0] || ($[0] = be((M) => V(Ue)(`${po}:${o.value}`), ["stop"]))
          }, "Open task " + x(o.value) + " and its proofs", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Js = /* @__PURE__ */ J(hg, [["__scopeId", "data-v-51f69bf1"]]), fg = (e) => `show-${e}`, gb = (e, t, n) => e.filter((s) => {
  var a;
  return n(fg((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), mg = "messages.chat", pg = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), xa = (e, t, n) => en(mg, pg(e, t), n), gg = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, vg = ["title", "aria-label", "onClick"], yg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, wg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = B(() => gg(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = I(""), a = Ee(Ce);
    async function o(r) {
      const i = await xa(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(Y, null, [
      (c(!0), h(Y, null, te(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: be((u) => o(l), ["stop"])
      }, [
        L(nt, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, vg))), 128)),
      s.value ? (c(), h("span", yg, x(s.value), 1)) : A("", !0)
    ], 64));
  }
}, kg = /* @__PURE__ */ J(wg, [["__scopeId", "data-v-0dfda102"]]);
function Yr(e, t) {
  const n = Un(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await Pe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const Jr = Yr("/api/marks", "marks"), vb = Jr.fetchAll, bg = Jr.find, xg = 2e3;
function Zr(e, t, n = xg) {
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
const $g = ["data-ref"], Mg = ["data-ref"], Sg = { class: "mark-row" }, _g = "dock add", Eg = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = B(() => bg(s.mark.type)), o = Ee(Ce, null), r = B(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = I(null);
    Zr(async () => {
      if (!r.value) return;
      const w = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      w.ok && w.value.rows.length && (i.value = w.value.rows[0].progress);
    }, () => r.value);
    const l = B(() => {
      const w = pp(s.mark, a.value), $ = !w.figure || w.figure.endsWith("%");
      return i.value && r.value && $ ? { ...w, figure: `${i.value}%`, fraction: i.value / 100 } : w;
    }), u = B(() => {
      var w;
      return !!(s.mark.lines || s.mark.detail && Ur.has(s.mark.variant) || t.has(s.mark.target_model) || (w = a.value) != null && w.body_url);
    }), d = I(!1);
    function f(w) {
      if (l.value.handlers.onAct && !w.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const g = B(() => {
      var w, $, M;
      return s.docked ? ($ = (w = a.value) == null ? void 0 : w.buttons) == null ? void 0 : $.filter((_) => {
        var C;
        return !((C = _.runs) != null && C.startsWith(_g));
      }) : (M = a.value) == null ? void 0 : M.buttons;
    });
    return (w, $) => {
      var M, _;
      return (M = a.value) != null && M.card ? (c(), h("div", {
        key: 0,
        class: X(["thread-turn", "card", "whole-card", { "user-side": V(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        L(Js, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, $g)) : (c(), h("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (_ = a.value) == null ? void 0 : _.full_width, docked: e.docked, "user-side": V(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", Sg, [
          L(Wr, tt({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, Yi(l.value.handlers), { onClick: f }), Ji({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: W(({ shown: C }) => [
                L(Js, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: C
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          L(kg, {
            buttons: g.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Mg));
    };
  }
}, Ag = /* @__PURE__ */ J(Eg, [["__scopeId", "data-v-cc29b2a4"]]), Cg = ["data-ref"], Og = ["inert"], Tg = { class: "group-fold" }, Ig = { class: "thread-group" }, Rg = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), s = I(!1), a = I(!1), o = I(null);
    ke(n, async (i) => {
      var l;
      s.value = !0, await Nt(), (l = o.value) == null || l.offsetHeight, a.value = i;
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
      L(Wr, {
        mark: r.value,
        open: n.value,
        onClick: l[0] || (l[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: X(["group-rows", { open: a.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", Tg, [
          p("div", Ig, [
            (c(!0), h(Y, null, te(e.group.marks, (u) => (c(), K(Ag, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Og)) : A("", !0)
    ], 8, Cg));
  }
}, yb = /* @__PURE__ */ J(Rg, [["__scopeId", "data-v-45b58b9b"]]);
function Bg(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return qe(() => n.observe(e.value)), Dt(() => n.disconnect()), t;
}
const Lg = { class: "chat-dock-fold" }, Ng = ["aria-label"], Dg = { class: "chat-dock-head" }, Pg = { class: "chat-dock-inner" }, Xr = 700, jg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), s = I(null), a = Bg(s), o = I(!1);
    let r = 0;
    return qe(() => r = setTimeout(() => o.value = !0, Xr)), Dt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", Lg, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          he(i.$slots, "edge"),
          p("header", Dg, [
            he(i.$slots, "head")
          ]),
          p("div", {
            class: X(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", Pg, [
              p("div", {
                class: X(["chat-dock-grow", { settled: o.value }]),
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
        ], 10, Ng)
      ])
    ], 2));
  }
}, Qr = /* @__PURE__ */ J(jg, [["__scopeId", "data-v-63e4dcfc"]]), qg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ys = 5, Fg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ys, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${ys}s`, animationDelay: `${(n - ys).toFixed(2)}s` };
    return (a, o) => (c(), h("span", qg, [
      p("i", { style: s })
    ]));
  }
}, ei = /* @__PURE__ */ J(Fg, [["__scopeId", "data-v-d0c4b012"]]), ti = Yr("/api/docks", "docks"), wb = ti.fetchAll, Zs = ti.find, Wg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Xs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), Hg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Ug = (e) => e.kept ? Xs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : Xs("keep", "pin", "Pin", `dock keep ${e.id}`), zg = ["pin", "stop"], Vg = (e) => ({ ...e, iconOnly: zg.includes(e.icon) });
function Gg(e, t) {
  var n;
  return [
    ...Hg(e, t) ? [Ug(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || un(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Xs("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(Vg);
}
const Kg = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Wg(e, t),
  buttons: Gg(e, t)
}), Yg = { class: "dock-title" }, Jg = ["aria-expanded", "title"], Zg = { class: "chat-dock-acts dock-acts" }, Xg = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Qg = {
  key: 1,
  class: "dock-text"
}, e0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = B(() => Zs(s.item.type)), o = I(null), r = B(() => Kg(s.item, a.value)), i = Ee(Ce), l = I(/* @__PURE__ */ new Set()), u = I("");
    async function d(w) {
      if (w.action === "open") return Ue(`${s.item.target_model}:${s.item.target_id}`);
      w.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, w.label])), u.value = "";
      const M = await xa(w, s.item, i.environment);
      (M == null ? void 0 : M.ok) === !1 && (l.value = new Set([...l.value].filter((_) => _ !== w.label)), u.value = M.error);
    }
    const f = B(() => r.value.buttons.filter((w) => w.action !== "undock" && !l.value.has(w.label))), g = B(() => r.value.buttons.find((w) => w.action === "undock"));
    return (w, $) => (c(), K(Qr, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: W(() => [
        e.leaving ? (c(), K(ei, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0)
      ]),
      head: W(() => {
        var M, _, C;
        return [
          (M = a.value) != null && M.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(Y, { key: 1 }, [
            L(ge, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", Yg, x(r.value.title), 1)
          ], 64)),
          (_ = a.value) != null && _.badge ? (c(), h("span", {
            key: 2,
            class: X(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, x(a.value.badge), 3)) : A("", !0),
          (C = a.value) != null && C.draws_head ? A("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: $[0] || ($[0] = (q) => n("fold"))
          }, [
            L(It, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, Jg)),
          p("span", Zg, [
            (c(!0), h(Y, null, te(f.value, (q) => (c(), h(Y, {
              key: q.action + q.runs
            }, [
              q.iconOnly ? (c(), K(pe, {
                key: 0,
                kind: "icon",
                "aria-label": q.label,
                title: q.label,
                "data-dock-action": q.action,
                onClick: (G) => d(q)
              }, {
                default: W(() => [
                  L(ge, {
                    name: q.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), K(pe, {
                key: 1,
                small: "",
                kind: q.primary ? "primary" : "ghost",
                bordered: !q.primary,
                "data-dock-action": q.action,
                onClick: (G) => d(q)
              }, {
                default: W(() => [
                  oe(x(q.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          L(Yn, {
            title: g.value.label,
            "data-dock-action": "undock",
            onClick: $[1] || ($[1] = (q) => n("undock", g.value))
          }, null, 8, ["title"])
        ];
      }),
      default: W(() => {
        var M, _;
        return [
          u.value || e.refusal ? (c(), h("p", Xg, x(u.value || e.refusal), 1)) : A("", !0),
          e.item.text && !((M = a.value) != null && M.body_url) ? (c(), h("p", Qg, x(e.item.text), 1)) : A("", !0),
          (_ = a.value) != null && _.body_url ? (c(), K(Js, {
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
}, go = /* @__PURE__ */ J(e0, [["__scopeId", "data-v-1ac9db13"]]), t0 = 6, n0 = 3, vo = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, wt = (e) => !!(e.leaves_at && !e.kept), s0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < e.leaves_at || n.has(e.id)), a0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => s0(s, t, n)).sort((s, a) => s.id - a.id);
function o0(e, t, n = t0) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const r0 = (e, t, n = e) => n < 2 ? !1 : e >= n0 ? !0 : t, i0 = ["title", "aria-label"], l0 = { class: "run-chip-in" }, c0 = {
  key: 0,
  class: "run-chip-ring"
}, u0 = { class: "run-chip-name" }, d0 = { class: "run-chip-bar" }, h0 = "processes.output", f0 = 5e3, m0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = Ee(Ce, null)) == null ? void 0 : d.environment) ?? "", o = I(null), r = B(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = B(() => {
      var f, g;
      return ((f = o.value) == null ? void 0 : f.title) || ((g = o.value) == null ? void 0 : g.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = B(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await en(h0, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return Zr(u, () => r.value, f0), (f, g) => {
      var w;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: fe({ "--tone": l.value })
      }, [
        V(wt)(e.item) ? (c(), K(ei, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0),
        p("span", l0, [
          r.value ? (c(), h("span", c0)) : (c(), K(nt, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", u0, x(i.value), 1)
        ]),
        p("span", d0, [
          p("i", {
            style: fe({ width: r.value ? `${((w = o.value) == null ? void 0 : w.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, i0);
    };
  }
}, p0 = /* @__PURE__ */ J(m0, [["__scopeId", "data-v-597b05d2"]]), g0 = 24, v0 = 8, kb = 420;
function bb({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= g0 && e > t ? !0 : e < t && a > v0 ? !1 : null;
}
const y0 = (e, t) => e === void 0 ? t : e, ni = "journal.viewer.";
function w0(e, t, n) {
  try {
    const s = n.getItem(ni + e);
    return s === null ? t : JSON.parse(s);
  } catch {
    return t;
  }
}
function k0(e, t, n) {
  try {
    n.setItem(ni + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function b0(e, t, n = window.localStorage) {
  const s = I(w0(e, t, n));
  return ke(s, (a) => k0(e, a, n), { deep: !0 }), s;
}
const x0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, $0 = { class: "dock-runs-chips" }, M0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var E;
    const t = e, n = Vm(500), s = I(/* @__PURE__ */ new Set()), a = I(!1), o = I(!1), r = Ee(Ce), i = I(/* @__PURE__ */ new Set()), l = I({});
    async function u(k, T) {
      i.value = /* @__PURE__ */ new Set([...i.value, k.id]);
      const v = await xa(T, k, r.environment);
      (v == null ? void 0 : v.ok) === !1 && (i.value = new Set([...i.value].filter((S) => S !== k.id)), l.value = { ...l.value, [k.id]: v.error });
    }
    const d = B(() => a0(t.items.filter((k) => !i.value.has(k.id)), n.value, s.value)), f = B(() => o0(d.value.filter((k) => vo(k, Zs)), n.value)), g = B(() => d.value.filter((k) => !f.value.includes(k) && !vo(k, Zs))), w = B(() => f.value.filter((k) => !wt(k))), $ = B(() => (a.value = r0(f.value.length, a.value, w.value.length)) && !o.value), M = b0(`dock-folded:${((E = ie.identity) == null ? void 0 : E.root) || location.host}`, {}), _ = (k) => y0(M.value[k.id], t.folded);
    function C(k) {
      M.value = { ...M.value, [k.id]: !_(k) };
    }
    function q(k) {
      M.value = { ...M.value, ...Object.fromEntries(f.value.map((T) => [T.id, T.id !== k.id])) }, o.value = !0;
    }
    function G() {
      M.value = Object.fromEntries(Object.entries(M.value).filter(([k]) => !f.value.some((T) => String(T.id) === k))), o.value = !1;
    }
    function N(k) {
      s.value = /* @__PURE__ */ new Set([...s.value, k.id]);
    }
    function y(k) {
      s.value = new Set([...s.value].filter((T) => T !== k.id));
    }
    return (k, T) => (c(), K(jo, {
      tag: "div",
      name: "dock",
      duration: V(Xr),
      class: "dock-stack"
    }, {
      default: W(() => [
        (c(!0), h(Y, null, te(g.value, (v) => (c(), K(go, {
          key: v.id,
          item: v,
          class: X({ timed: V(wt)(v) }),
          leaving: V(wt)(v) && !s.value.has(v.id),
          folded: _(v),
          refusal: l.value[v.id],
          onFold: (S) => C(v),
          onUndock: (S) => u(v, S),
          onMouseenter: (S) => N(v),
          onMouseleave: (S) => y(v)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", x0, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: G
          }, [
            oe(x(f.value.length) + " runs ", 1),
            L(It, { open: "" })
          ])
        ])) : A("", !0),
        (c(!0), h(Y, null, te($.value ? [] : f.value, (v) => (c(), K(go, {
          key: v.id,
          item: v,
          class: X({ timed: V(wt)(v) }),
          leaving: V(wt)(v) && !s.value.has(v.id),
          folded: _(v),
          refusal: l.value[v.id],
          onFold: (S) => C(v),
          onUndock: (S) => u(v, S),
          onMouseenter: (S) => N(v),
          onMouseleave: (S) => y(v)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        $.value ? (c(), K(Qr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: W(() => [
            p("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: T[0] || (T[0] = (v) => o.value = !0)
            }, [
              L(nt, { name: "runs" }),
              oe(" " + x(f.value.length) + " runs ", 1),
              L(It)
            ]),
            p("span", $0, [
              (c(!0), h(Y, null, te(f.value, (v) => (c(), K(p0, {
                key: v.id,
                item: v,
                onClick: (S) => q(v)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : A("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, xb = /* @__PURE__ */ J(M0, [["__scopeId", "data-v-65c310f9"]]), kt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, On = (e) => Math.min(Math.max(e, 0), 1), S0 = (e) => {
  const t = On(e);
  return t * t * (3 - 2 * t);
}, pt = (e, t, n) => S0((e - t) / (n - t));
function $b(e) {
  const t = On(e), n = On((t - 0.12) / 0.76) * kt.shuffles, s = Math.min(Math.floor(n), kt.shuffles - 1), a = n - s, o = pt(a, 0.26, 0.38) * (1 - pt(a, 0.76, 0.96)), r = pt(a, 0.38, 0.76), i = pt(t, 0, 0.12) * (1 - pt(t, 0.88, 1)), l = pt(a, 0.2, 0.34) * (1 - pt(a, 0.84, 1)), u = Math.sin(Math.PI * On((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / kt.shuffles, lift: kt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function Mb(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const yo = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, Sb = (e) => yo[e] ?? yo.butler, $a = 2400, _0 = 0.05;
function E0({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, _0), r = Math.min(t + $a * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function _b(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function A0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function Eb(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const Ab = (e, t) => ({ ...e, stretch: t.stretch }), Cb = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, si = (e, t) => t >= (e.least ?? 0);
function Ob(e, t, n) {
  if (!si(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const Tb = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), C0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", wo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), O0 = (e) => e.right > e.left && e.bottom > e.top;
function Ib(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(C0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = wo(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = wo(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), O0(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function ai(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, g] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const w = t[d] - e[d];
      if (Math.abs(w) < 1e-9)
        (e[d] < o[f] || e[d] > o[g]) && (i = -1);
      else {
        const $ = (o[f] - e[d]) / w, M = (o[g] - e[d]) / w;
        r = Math.max(r, Math.min($, M)), i = Math.min(i, Math.max($, M));
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), T0 = (e) => e * e * (3 - 2 * e), Se = (e, [t, n]) => T0(tn(e, t, n)), I0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ct = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Mn = ([e, t], n) => e + n() * (t - e);
function R0(e) {
  return I0.map(() => {
    const t = Mn(ct.speed, e), n = Mn(ct.angle, e) * Math.PI / 180, s = Mn(ct.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Mn(ct.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const B0 = R0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function L0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ct.gravity * (t[2] - ct.floor))) / ct.gravity;
}
function Rb(e, t, n = B0) {
  const s = Me.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = L0(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= ct.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const Bb = (e, t) => e && Me[e.name] ? { name: e.name, u: t / e.frames } : null;
function Lb(e, t) {
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
const Nb = () => Array.from({ length: Me.pogo.count }, (e, t) => Me.pogo.bounce * (t + 1) / Me.pogo.count), Tt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Db(e, t, n) {
  const { away: s, side: a } = Me.bug_smash, o = a * s * n, [r, i] = [t.left + Tt.margin * n, t.right - Tt.margin * n], l = Math.min(Math.max(e + o + a * Tt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function Pb(e, t, n) {
  const s = Me.bug_smash, a = Se(t, s.walk), o = ([r, i]) => r + (i - r) * a;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Tt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Tt.tall * n * (1 - Se(t, s.emerge)),
      turn: 90 * (1 - Se(t, s.climb)),
      whole: t < s.blow,
      flat: t >= s.blow ? 1 : 0,
      shows: 1 - Se(t, s.gone)
    }
  };
}
function jb(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Tt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = E0({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Te = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function qb(e) {
  const t = Te.least + Math.floor(e() * (Te.most - Te.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Te.walls[Math.floor(e() * Te.walls.length)],
    along: Te.margin + e() * (1 - 2 * Te.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Qs(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Te.margin, r = ((e.along - Te.margin + e.way * Te.speed * n / s) / a % 2 + 2) % 2, i = Te.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Te.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Te.inset : t.right - Te.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function N0(e, t) {
  const n = Me.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = A0(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function Fb(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Me.bug_shot, { frame: r, bug: i, shot: l } = N0(n, e.length), u = e.map((C, q) => ({ ...Qs(C, t, Math.min(n / o.fps, Tn(q).shot)), shot: q < l })), d = Se(r / o.frames, o.aim), [f, g] = [u[Math.max(i - 1, 0)], u[i]], w = e.map((C, q) => ({ bug: C, index: q, seconds: n / o.fps - Tn(q).shot, spot: Qs(C, t, Tn(q).shot) })).filter((C) => C.seconds >= 0), $ = w.flatMap((C) => {
    const q = (a == null ? void 0 : a.get(C.index)) ?? F0(C.bug, t, C.spot, a ? [] : s);
    return a == null || a.set(C.index, q), a && W0(q, C.seconds, s), H0(q, C.seconds, s);
  }), M = w.filter((C) => j0(C.bug)).map((C) => ({ seconds: C.seconds, from: C.spot })), _ = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (g.x - f.x) * d, y: f.y + (g.y - f.y) * d, back: _ }, slush: $, camera: M };
}
function Tn(e) {
  const t = Me.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function Wb(e, t, n, s) {
  const { limit: a, margin: o } = Me.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Tn(d), g = Qs(u, t, f.shot), w = Math.abs(g.y - n.y) / Math.tan(a * Math.PI / 180), $ = g.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - g.x), M = Math.abs(g.x - l) >= w ? l : g.x + $ * w, _ = $ > 0 ? Math.max(l, Math.min(M, i)) : Math.min(l, Math.max(M, r)), C = { from: l, to: _, begin: f.walk, end: f.aim };
    return l = _, C;
  });
}
function Hb(e, t, n) {
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
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, D0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function P0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const j0 = (e) => e.along * 97 % 1 < xe.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function q0(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += xe.step) {
    const d = Math.min(u + xe.step, r.t), f = nn(e, d), g = ai(i, f, n);
    if (g) return { ...g, t: u + (d - u) * g.share };
    i = f;
  }
  const l = nn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function F0(e, t, n, s = []) {
  const a = P0(e.along + 1), [o, r] = D0[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: xe.count }, () => {
    const l = i + (a() - 0.5) * 2 * (xe.spread * Math.PI / 180), u = xe.speed[0] + a() * (xe.speed[1] - xe.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: xe.radius[0] + a() * (xe.radius[1] - xe.radius[0]) };
    return { ...d, ...q0(d, t, s) };
  });
}
function W0(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += xe.step) {
      const r = Math.min(o + xe.step, a), i = ai(nn(s, o), nn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function H0(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((s) => {
    if (t < s.t) return [{ ...nn(s, t), r: s.r, flying: !0 }];
    const a = t - s.t, o = 1 - Math.min(Math.max((a - xe.hold) / xe.fade, 0), 1);
    if (o <= 0) return [];
    const r = s.on === "surface" ? n.find((d) => d.id === s.surface) : null;
    if (s.on === "surface" && !r) return [];
    const i = r ? r.left + s.dx : s.x, l = r ? r.top + s.dy : s.y, u = r ? Math.min(a * a * 12, 48, Math.max(0, r.bottom - l)) : ["left", "right"].includes(s.on) ? Math.min(a * a * 8, 32) : 0;
    return [{ x: i, y: l, r: s.r * (1 + 1.2 * Math.min(a / 0.1, 1)), flying: !1, on: s.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function Ub(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Me.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = Se(e, [0, u]), g = Se(e, [u, u + d]);
  return r.map((w) => {
    const $ = { x: s.x + w.at[0] * t, y: s.y + w.at[1] * t };
    return {
      x: n.x + ($.x - n.x) * f,
      y: n.y + ($.y - n.y) * f,
      r: w.size * t * (0.15 + 0.85 * f * f),
      run: g * g * t * 1.2,
      fade: 1 - g,
      landed: f >= 1
    };
  });
}
function zb(e, t, n, s, a) {
  const { sway: o, above: r } = Me.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (M) => {
    const [_, C] = [M.x - e.at.x, M.y - e.at.y];
    return { x: i.x + _ * u - C * d, y: i.y + _ * d + C * u };
  }, [g, w] = [...n].sort((M, _) => M.x - _.x), $ = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: $.map((M, _) => ({ from: M, to: _ < $.length / 2 ? g : w })) };
}
const Vb = (e, t) => Se(t, e.grows) * (1 - Se(t, e.sinks));
function Pn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Gb(e, t) {
  const n = Me[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Pn(n, t), r = 1 - (1 - n.small) * Se(s, n.shrinks) * (1 - Se(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Pn(n, t), o = n.flat * Se(s, n.squashes) * (1 - Se(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * tn(a, ...n.springs)) * (1 - tn(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const Kb = (e) => e === "pack_box";
function Yb(e) {
  const { into: t, out: n } = Pn(Me.rope_swing, e);
  return 1 - Se(t, [0, 1]) * (1 - Se(n, [0, 1]));
}
function Jb(e) {
  const t = Me.rope_swing, { into: n, out: s } = Pn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Se(n, [0, 1]) * (1 - Se(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const U0 = { after: 3 }, Ma = 10, z0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, V0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, G0 = { weight: 19 }, oi = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, K0 = { every: 120 }, ri = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, ii = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Y0 = {
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
}, fn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Ma }), ee = (e, t, n = {}) => fn(e, "clip", t, n), ws = (e, t, n = {}) => fn(e, "look", t, n), ko = (e, t, n = {}) => fn(e, "gaze", t, n), de = (e, t, n = {}, s = {}) => ({ ...fn(e, "pick", t, n), ...s }), ve = (e) => fn("nothing", "nothing", e, {}), J0 = 120, Z0 = 300, ks = (e, t) => ({ ...ee(e, t), cooldown: Z0 }), ae = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), X0 = () => [ee("joy", 2)], gt = (e, t, n, s, a = {}) => ({ ...ee(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), vt = (e) => ({ ...e, cooldown: z0[e.name] }), Ut = (e) => ({ ...e, shenanigan: !0, lasts: V0[e.name] }), Xn = [
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
  ...ae("reported", { cooldown: 90 }, [ko("read", 3), ee("nod", 1), ve(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ae("read_message", { cooldown: 30 }, [ko("read", 3), ve(1)]),
  ...ae("fact_filed", { cooldown: 120 }, [ee("file_card", 3), ee("nod", 1), ve(6)]),
  ...ae("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ee("nod", 2), ve(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ae("bar_done", { holds: !0 }, X0()),
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
  ...Object.entries(Y0).flatMap(([e, t]) => ae(`reacted:${e}`, {}, [ws(t, 1)])),
  ...Object.entries(ri).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ae(`agent_reacted:${n}`, {}, [ee(s, 1, { voices: [e] })])[0])),
  ...Object.entries(ii).flatMap(([e, t]) => ae(`agent_reacted:${e}`, {}, [ee(t, 1)])),
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
    { ...Ut(vt(ee("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Ut(vt(ee("disco", 2, { ball: "bubble" }))),
    ve(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ae("held:search", { cooldown: J0 }, [ks("search", 3), { ...ks("binoculars", 2), when: { home: !0 } }, { ...ks("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...ae("jump", {}, [Ut(vt(ee("backflip", 7, { high: !0 }))), ee("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ae("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ae("unit", { cooldown: oi.build.cooldown }, [de("unit", G0.weight), ve(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ae("progress_jump", { cooldown: 6 }, [ee("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ae("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: K0.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...ae("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ae("roam", {}, [
    de("rest", 35, {}, { stay: [25, 60] }),
    de("seat", 15, {}, { stay: [15, 40] }),
    de("edge", 25, {}, { stay: [8, 20] }),
    Ut(de("bubble", 15, {}, { stay: [30, 80] })),
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
    Ut(vt(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], li = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), ci = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Q0 = (e) => Array.isArray(e) ? e[0] : e, ev = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, tv = (e) => Xn.some((t) => t.when.moment === e);
function nv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || ci(d).every(([f, g]) => n(f) >= Q0(g)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Xn.filter((d) => li(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= U0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function Fe(e, t) {
  const n = nv(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (ui(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function ui(e, t, n) {
  var s;
  for (const [a, o] of ci(t)) (s = e.memory) == null || s.set(a, e.now + ev(o, n));
}
function Zb(e, t, n) {
  ui(e, Xn.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const Xb = (e) => Object.values(oi).find((t) => li(t.when, e)) ?? null, sv = (e, t, n) => n - t <= (e.lifetime ?? Ma), Qb = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || si(e.clip, t));
class di {
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
const ea = {
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
}, e5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), hi = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), t5 = {
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
}, n5 = 120, av = 20, s5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < av), ov = (e) => ea[e] || ea.idle, a5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, fi = "airborne", rv = "landing", iv = "travelling", mi = "grounded", o5 = ({ airborne: e, landing: t, trip: n }) => e ? fi : t ? rv : n != null && n.started ? iv : mi;
function r5(e, t) {
  var a;
  const n = lv(e, t);
  return e.mode === mi && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function lv(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: g = null } = e;
  if (n === fi && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...cv(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const w = g !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: w ? g : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : ov(u), facing: w ? g : i.posture === "sit" ? i.face : f };
}
function cv(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const ta = (e) => e.outcome, uv = "plugin:code-commandments:sins:", bo = (e) => e.type === "plugins.card" && e.markKey.startsWith(uv), dv = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => bo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => bo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], i5 = (e, t) => e.filter((n) => n.author === "user" && _e(n.read_at) > t).map((n) => ({ beat: "read_message", time: _e(n.read_at), card: ir(n) })).sort((n, s) => n.time - s.time), xo = { user: "reacted", agent: "agent_reacted" };
function l5(e, t) {
  return e.filter((n) => xo[n.author] && bt(n) > t).map((n) => ({ beat: `${xo[n.author]}:${n.emoji}`, time: bt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const hv = [.../* @__PURE__ */ new Set([...Object.values(ri).flatMap((e) => Object.keys(e)), ...Object.keys(ii)])];
function c5(e, t) {
  return e.filter((n) => n.author === "agent" && bt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = hv.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: bt(n), card: ir(n) })).sort((n, s) => n.time - s.time);
}
const fv = (e) => new di(e).isTest(), jn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ta(e)] || "";
}, mv = 1800, pv = (e, t) => {
  if (jn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && jn(n) !== "finished" && Number(e.time) - Number(n.time) <= mv ? "tests_fixed" : "tests_passed";
};
function u5(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(fv), a = s.filter((i) => jn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, jn(i))), o.map((i) => ({ beat: pv(i, a), time: Number(i.time), card: i.key }));
}
function d5(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ta(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: ta(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const h5 = (e) => e.map((t) => {
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
function f5(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function m5(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function p5(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = dv.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function Sa(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const $o = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function gv(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    Sa(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function g5(e, t, n, s = {}) {
  const a = Fe({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : tv(`held:${e}`) ? "idle" : e;
}
const Oe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function v5(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Oe.ahead * n ? 180 : Math.sign(s) * Oe.turn;
}
const Mo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function y5(e, t) {
  const n = Math.min(Oe.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Oe.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Oe.lines, Math.floor((e.bottom - e.top - 2 * s) / Oe.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Oe.sweep) % a, i = o % Oe.sweep, l = Oe.sweep - Oe.returnSeconds, u = Mo((i - l) / Oe.returnSeconds), d = i <= l ? Mo(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Oe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const So = 3, pi = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, _o = 12, w5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function k5(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!pi(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= So ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * _o) / _o, lasts: So } };
}
const b5 = (e) => e.posture === "hang" && !pi(e.face), vv = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), yv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function x5(e, t, n) {
  return vv.has(e) ? 1 / 0 : !yv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(gi(n - t.began, t.share) - Qe.lead, 0);
}
const wv = 5;
function $5(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= wv ? { beat: "long_walk", time: n } : null };
}
const kv = 30, Sn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function M5(e, t, n, s, a = null) {
  if (t && n < t.until || !Sn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Fe({ moment: "spell", state: e, tally: a }, s), [r, i] = Sn.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + Sn.every } : { state: e, began: 0, until: 0, next: n + Sn.every };
}
const S5 = (e, t, n) => t && n < t.until && hi.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, gi = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function _5(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = gi(o, e.share);
  return a ? { eager: bv(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Fe({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function bv(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const xv = 1, $v = { look: "look", gaze: "gaze" };
function Mv(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = Fe({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [$v[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const Sv = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => Fe({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), _v = (e, t, n, s, a, o = 0) => Fe({ moment: "jump", high: e > xv * t, memory: s, now: a, room: o }, n).name === "backflip", Ev = { work: ["building"], idle: ["standing"] };
function E5(e, t, n, s) {
  const a = ea[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(Ev[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), hi.has(e) ? { moments: o, began: n || s } : (n && s - n >= kv && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function Av(e, t, n) {
  return !Fe({ moment: "pondering", memory: e, now: t }, n) || !Fe({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Fe({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Eo = { pondering: Av };
function A5(e, t, n, s, a, o) {
  if (Eo[e.beat]) {
    const i = Eo[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = Mv(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== Ma && { lifetime: r.lifetime } } } : null;
}
function C5(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = Sv(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const O5 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function T5(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function I5(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const R5 = (e, t) => !!(e != null && e.watches) && !t.once, B5 = 10, L5 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || sv(s, s.queuedAt, n)), N5 = (e, t) => t ? null : e[0] ?? null;
function D5(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const P5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), Cv = 2 * Math.PI, Ov = 500;
function j5(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / Ov, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), g = Cv * r / 1e3, w = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, M = (u ? w : t != null && t.behind && t.mood === "reading" ? { ...t } : t && w && !l ? a && !t.behind && !w.behind ? Iv(w, t, n, g, a) : Bv(w, t, n, g) : t) ?? w, _ = M != null && M.behind && M.mood === "reading" ? Tv(e.point, M, n, r, a) : M;
  return { point: _ ?? null, toward: _ ? { x: _.x - n.x, y: _.y - n.y } : null, amount: f, at: s };
}
function Tv(e, t, n, s, a) {
  const o = (v) => v * 180 / Math.PI, r = (v) => o(Math.atan2(Math.sin(v * Math.PI / 180), Math.cos(v * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), g = f ? r(e.readingFacing - i) : 0, w = f ? e.readingYaw + g : d, $ = w + r(u - w), M = Math.min(Math.max(s / 1e3, 0), 0.1), _ = Oe.turnSpeed * M, C = f ? w + Math.min(Math.max($ - w, -_), _) : $, q = f ? e.readingFollow + g : C, G = q + (C - q) * (1 - Math.exp(-M / Oe.followSeconds)), N = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, y = o(Sa(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), E = Math.min(Math.max(y, -N.up), N.down), k = Oe.tipSpeed * M, T = f ? e.readingPitch + Math.min(Math.max(E - e.readingPitch, -k), k) : E;
  return { ...t, readingYaw: C, readingFollow: G, readingPitch: T, readingFacing: i };
}
function Iv(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (q) => {
    const { yaw: G, pitch: N } = Sa(q.x - n.x, a, n.y - q.y, o);
    return { yaw: G, pitch: Math.min(Math.max(N, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [$o(i(e)), $o(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [g, w] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [$, M, _] = l.map((q, G) => g * q + w * u[G]), C = a * $ / M;
  return { ...t, x: n.x + C, y: n.y - gv(C, a, -Math.asin(Math.min(Math.max(_, -1), 1)), o) };
}
const Rv = 0.15;
function q5(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= Rv;
}
function Bv(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const Lv = (e) => !(e != null && e.on);
function F5(e, t, n) {
  if (Lv(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const sn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, bs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Ao = (e) => e * e * (3 - 2 * e);
function Nv(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = bs(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, s = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - Ao(bs(e, ...Je.fade)), lit: s, white: e < Je.flash[0] ? 0 : 1 - Ao(bs(e, ...Je.flash)) };
}
const W5 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function H5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = Nv(t - e.at);
  return s && { colour: sn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...s } };
}
function U5(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function z5(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= sn.looks || s === null && n - e.since >= sn.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function V5(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const it = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, G5 = { behind: 39, figure: 40, ahead: 41 }, Dv = "[data-figure-pile]", Pv = { amber: [1, 0.69, 0.125], good: sn.colours.good, bad: sn.colours.bad }, In = { phases: 4, ms: 230, dim: 0.25 }, K5 = (e, t, n) => e !== "amber" || (t + n) % In.phases < In.phases / 2 ? 1 : In.dim, Y5 = (e) => e === "amber" ? In.phases : 1;
function J5(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const Z5 = Object.keys(Pv), He = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, zt = ([e, t], n) => e + n() * (t - e);
function X5(e) {
  const t = He.least + Math.floor(e() * (He.most - He.least + 1));
  return Array.from({ length: Math.min(t, He.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * He.spread, [s, a] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = zt(He.start, e), r = zt(He.reach, e);
    return {
      text: Fe({ moment: "digit" }, e).name,
      x: s * o,
      y: He.middle + a * o,
      dx: s * r,
      dy: a * r,
      moveMs: Math.round(zt(He.moveMs, e)),
      fadeMs: Math.round(zt(He.fadeMs, e))
    };
  });
}
const xs = { high: 3, gap: 1 };
function Q5(e) {
  const t = Math.floor(e / xs.high);
  return { left: -(it.inside + it.width / 2 + t * (it.width + xs.gap)), up: e % xs.high * (it.height - it.top) };
}
const jv = (e, t, n) => Fe({ moment: "unit", memory: e, now: t }, n) !== null, qv = { after: 5 }, Fv = (e) => e.filter((t) => t.active && (t.process || t.watch) && new di(t).isBuild());
function e4(e, t, n) {
  const s = Fv(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= qv.after ? a : null;
}
function t4(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: jv(n, s, a) } : null;
}
const Co = { ahead: 140, up: 70 };
function n4(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * Co.ahead, y: s - Co.up } } : o ? { at: { x: n(o), y: s - o.up - it.height } } : t ? { at: null } : null;
}
const $s = { least: 4e3, most: 1e4 }, Wv = (e) => $s.least + e() * ($s.most - $s.least), yt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function s4(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Wv(t);
    if (n.length >= yt.most || t() >= yt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (yt.at[0] + t() * (yt.at[1] - yt.at[0]));
    n.push({ from: o, to: o + yt.ms }), s = o + yt.ms;
  }
}
const a4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), o4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), vi = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), r4 = new Set(Xn.filter((e) => vi.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), Hv = (e) => e.some((t) => t.state === "built"), i4 = (e, t) => Hv(t) ? e.filter((n) => !vi.has(n.beat)) : e, dt = { reach: 40, room: 6 }, Uv = (e, t) => t <= e - dt.reach + 2, l4 = (e, t, n) => Uv(e, n) ? t - dt.reach : e - dt.reach - dt.room, c4 = (e, t, n, s) => s > 0 && t < e && t + dt.reach >= e - 2 ? Math.min(n, Math.max(e, t + dt.reach)) : e, Ms = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, u4 = (e) => zt(e() < Ms.longShare ? Ms.long : Ms.short, e), zv = 2 * it.width;
function d4(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= zv ? o : e + (o - e + a / 2) % a;
}
const Vv = 60, h4 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= Vv, Oo = "[data-figure-home]", mn = () => {
  var t;
  const e = document.querySelector(Oo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Oo)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Gv = "[data-figure-docked-bars]", Kv = "[data-figure-chat-foot]", Yv = [0.85, 0.6, 0.35, 0.15], Jv = ["question", "waiting", "suggestion"], f4 = (e, t) => Jv.find((n) => e[n] > 0 && t[n] === "behind") || null;
function m4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Zv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Xv = "[data-figure-newest]";
function yi() {
  var s, a;
  const e = (s = mn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Xv), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !_a(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function an(e, t, n = yi()) {
  if (!e || !n) return !0;
  const s = st(e, t), a = es(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ae.top * t.size, bottom: s.top + Ae.bottom * t.size }, r = kt.gap;
  return !Qn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function p4(e, t, n, s = yi()) {
  if (!s || an(t, e, s)) return null;
  const a = es(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = Mt(), l = t.posture === "stand" ? Aa * e.size : _i * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - kt.gap - r, s.right + kt.gap + o].map((g) => ({ ...t, x: g })).filter((g) => g.x >= u && g.x <= d && an(g, e, s) && Ey(g, e)).sort((g, w) => Math.abs(g.x - t.x) - Math.abs(w.x - t.x))[0] ?? null;
}
const Ss = 0.26, wi = 0.54, Qv = 1.25 / 5.4, pn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ss, travels: "stand" },
  lounge: { drop: Ss, travels: "stand" },
  composed: { drop: Ss, travels: "stand" },
  hang: { drop: wi, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, g4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Qv * Math.cos(t * Math.PI / 180),
  y: 1 - n - wi
}), Vt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), ey = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), v4 = (e, t) => (e === "sit" ? ey.has(t) : Vt.has(e)) ? e : "stand";
function y4(e, t) {
  return e.facing === t.facing || !Vt.has(e.posture) && !Vt.has(t.posture) ? t : { posture: "stand", facing: Vt.has(e.posture) ? e.facing : t.facing };
}
const w4 = 0.25, k4 = (e, t) => Vt.has(e) && pn[t].drop === 0, ki = 2, ty = 90, ny = 180, sy = 140, ay = 280, oy = 420, ry = 0.25, iy = 290, ly = 600, cy = "cubic-bezier(0.2, 0.7, 0.4, 1)", uy = "cubic-bezier(0.55, 0, 0.9, 0.6)", _s = 5;
function qn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: g = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < _s) return null;
  (r || i) && (o = Math.max(o, ki));
  const w = o > 1, $ = Math.abs(t.x - e.x), M = $ < _s ? 0 : $ / (ty * o) * 1e3, _ = Math.min(M, w ? sy : ny), C = Math.abs(t.y - e.y), q = t.y < e.y, G = q && !g && _v(C, n, l, u, d, f), N = q ? oy + Math.min(C, 400) * ry : Math.sqrt(2 * C / $a) * 1e3, y = {
    x: t.x,
    y: t.y,
    ms: C > _s ? G ? ly : N : 0,
    lead: G ? iy : q ? ay : 0,
    easing: q ? cy : uy,
    hopping: !0,
    clip: G ? "backflip" : q ? "jump" : "fall"
  }, E = { x: t.x, y: t.y, ms: M + _, lead: 0, easing: "linear", ramp: _, ...w ? { clip: "run" } : {} }, k = g ? dy(t, n) : y, T = q && !s ? [{ ...E, y: e.y }, k] : [{ ...y, x: e.x }, E];
  return { way: Math.sign(t.x - e.x) || 1, legs: T, lands: !a, pace: o, running: w };
}
const dy = (e, t) => ({ x: e.x, y: e.y, ms: Me.pogo.frames / Me.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), hy = (e, t) => e.postures.includes(t) ? t : e.postures[0], b4 = (e, t, n) => e.posture === "walk" && n ? "walk" : hy(e.clip, t), st = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - pn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Qn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, _a = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Mt() {
  var t;
  const e = (t = mn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const _n = 0.5, To = 20;
function x4(e, t, n = Mt()) {
  const s = st(e, t);
  return s.left >= n.left + To && s.right <= n.right - To;
}
function Ea(e, t, n = Mt()) {
  const s = st(e, t), a = s.right - s.left, o = es(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - _n && i <= n.right + _n && s.top >= n.top - _n && l <= n.bottom + _n;
}
const Fn = [0.35, 0.5, 0.65], Wn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ae = { left: Fn[0], right: Fn.at(-1), top: Wn[0], bottom: Wn.at(-1) }, fy = 0.24;
function es(e) {
  if (e.posture === "stand") return { left: Ae.left, right: Ae.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + fy * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ae.left, t), right: Math.max(Ae.right, t) };
}
function my(e, { size: t }, n = Mt()) {
  const s = es(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Aa = (Ae.right - Ae.left) / 2 + 0.08;
function $4(e, t) {
  return e === "hang" ? Ae : { ...Ae, bottom: Math.min(Ae.bottom, 1 - t - pn[e].drop) };
}
const py = "[data-figure-agent]";
function bi(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !_a(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const xi = (e) => Wn.flatMap(
  (t) => Fn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Ca(e, t, n = "") {
  if (!an(e, t)) return Fn.length * Wn.length;
  const s = st(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Zv)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && Qn(a, l) && _a(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return xi(a).filter(([i, l]) => r(i, l) || bi(i, l, n)).length;
}
function gy(e, t) {
  const n = st(e, t);
  return xi({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => bi(s, a, "", py)).length;
}
const Io = 4;
function M4(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Io; o <= a; o += Io)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!gy(i, e) && an(i, e)) return i;
    }
  return null;
}
function on(e, t, n) {
  const s = Mt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Ea(r, t, s) && an(r, t)).map((r) => ({ spot: r, covered: Ca(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const $i = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), vy = [0.5, 0.25, 0.75], yy = (e) => $i(e.getBoundingClientRect(), vy), Mi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, wy = Aa, ky = (e, t, { size: n }, s = wy) => Si(e, Mi[t], s * n, "stand");
function Si(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const by = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, _i = 0.1, xy = (e, t, { size: n }) => Si(e, by[t], _i * n, "sit"), $y = (e) => ((e + 180) % 360 + 360) % 360 - 180, Es = 60;
function S4(e, t) {
  const n = $y(t);
  return !e.aside || Math.abs(n) >= Es ? t : n < 0 ? 360 - Es : Es;
}
const Gt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, My = (e) => [.../* @__PURE__ */ new Set([e, ...Gt.turns.map((t) => (t + 360) % 360)])];
function _4(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = My(t), r = Gt.every[0] + s() * (Gt.every[1] - Gt.every[0]);
  return { face: t, from: a ? Sy(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function Sy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Gt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function E4(e, t) {
  const { element: n, edge: s } = ts(), a = ["left", "right"].map((i) => gn(xy(s, i, e), e)).filter((i) => n && Ea(i, e) && !Ca(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function A4(e, t, { size: n }) {
  const s = (Ae.right - Ae.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - Ei } : e;
}
const Ei = 7;
function Ai() {
  const e = [...document.querySelectorAll(Dv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function _y(e, t) {
  const n = st(e, t), s = n.right - n.left;
  return { left: n.left + Ae.left * s, right: n.left + Ae.right * s, top: n.top + Ae.top * s, bottom: n.bottom };
}
function Ey(e, t) {
  const n = Ai();
  return !n || !Qn(_y(e, t), n);
}
const Ay = 4;
function ts() {
  const e = vn(), t = Ai(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Ay || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Ei - n, 0) } };
}
const C4 = ({ size: e, below: t }) => (1 - t) * e;
function gn(e, t) {
  const n = Mt(), { size: s, below: a } = t, o = pn[e.posture].drop * s;
  return { ...my(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const na = (e, t) => Object.keys(Mi).map((n) => gn(ky(e, n, t), t)), Oa = (e, t) => $i(e, Yv).map((n) => gn(n, t)), Ci = (e, t, n) => on(e, t, n) ?? e[0];
function O4(e, t) {
  const { element: n, edge: s } = ts();
  return { ...Ci(na(s, e), e, t), view: null, on: n };
}
function T4(e, t, n, s) {
  const { element: a, edge: o } = ts(), r = (s ? na(o, t) : [...na(o, t), ...Oa(o, t)]).filter(
    (u) => !Qn(st(u, t), e)
  ), i = on(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !Ca(i, t) ? i : on(r, t, n);
  return l && { ...l, view: null, on: a };
}
function vn() {
  var s;
  const e = mn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Gv);
  if (!t) return { ...ns(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Ro = { within: 2 };
function I4(e) {
  const { element: t, docked: n, edge: s } = vn();
  if (!n || e.on !== t) return !0;
  const a = ns().edge;
  return s.left > a.left + Ro.within || s.left + s.width < a.left + a.width - Ro.within;
}
const Cy = "[data-figure-closing]";
function R4() {
  var n;
  const { element: e, docked: t } = vn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Cy));
}
const Oi = "[data-figure-progress]";
function B4(e) {
  const t = e.querySelector(Oi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function L4(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const Oy = { across: 300, above: 380, below: 60 };
function N4(e) {
  const { across: t, above: n, below: s } = Oy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: Ty(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const Ty = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Ti = "[data-figure-bar]", sa = { back: 144, along: 0.4 };
function D4(e) {
  const { element: t, docked: n, edge: s } = vn(), a = n ? t.querySelector(Ti) : null;
  if (!(a != null && a.querySelector(Oi))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...gn({ x: o - sa.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function P4(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < sa.along * s.size ? t.x + sa.along * s.size : e.x, y: e.y, behind: !0 };
}
function j4(e) {
  const t = e.querySelector(Ti), n = t == null ? void 0 : t.firstElementChild;
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
function q4(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = ns(), l = n === null ? Iy(i, e, o === null ? t : { x: o, y: i.top }, s, a) : gn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function Iy(e, t, n, s, a) {
  const o = Oa(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + it.width < a && l.x + s - dt.reach - dt.room >= r);
  return on(i.length ? i : o, t, n);
}
const Ry = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function F4(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: g = !1 } = {}) {
  (o || r) && (a = Math.max(a, ki));
  const w = (G) => {
    const N = st(G, n, pn[G.posture].travels);
    return { x: N.left, y: N.top };
  }, $ = t.ladder ?? e.ladder;
  if ($ && !(t.ladder && e.ladder)) return By(w(e), w(t), w({ ...$.foot, posture: "stand" }), $.way, !!t.ladder, n, a);
  const [M, ..._] = [e, ...l, t].map(w), C = qn(M, _[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: g }), q = _.slice(1).map((G, N) => {
    var y;
    return (y = qn(_[N], G, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : y.legs.find((E) => E.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...q.filter(Boolean)] };
}
function By(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Ry.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? qn(e, n, o.size, { pace: r }) : qn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function W4(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function H4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && on(yy(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = ts();
  return { ...Ci(Oa(a, t), t, n), view: null, on: s };
}
const Ly = "[data-figure-bubble]", Ny = 250;
let Kt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ii = 0;
const jt = () => Kt, As = /* @__PURE__ */ new WeakMap();
let Dy = 0;
function Ta(e) {
  return As.has(e) || As.set(e, `floor-${++Dy}`), As.get(e);
}
const Py = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, jy = () => {
  var e, t;
  return ((t = (e = mn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function qy(e, t) {
  var s;
  const n = (s = e.querySelector(Kv)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Fy(e, t) {
  const n = e && qy(e, t), s = e ? [...e.querySelectorAll(Ly)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Py(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Ta(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Wy = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Ny ? (t.top - s.top) / a * 1e3 : 0;
};
function Ri(e = Kt, t = performance.now()) {
  const n = Mt(), s = jy(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = vn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = ns();
  return u.element && l.push({ id: Ta(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Fy(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: Wy(e, d, t) }))) });
}
const aa = /* @__PURE__ */ new Set();
function Hy(e) {
  return aa.add(e), () => aa.delete(e);
}
function Uy() {
  Bi();
  const e = () => {
    Ii = requestAnimationFrame(e), !document.hidden && (Kt = Ri(Kt), aa.forEach((t) => t(Kt)));
  };
  e();
}
function Bi() {
  cancelAnimationFrame(Ii);
}
const Ia = 5, zy = 56, Vy = { share: 0.6 }, Gy = (e) => -Math.sqrt(2 * $a * Vy.share * e), Bt = (e, t) => e.find((n) => n.id === t) ?? null;
function U4(e, t = Ri().floors) {
  const n = Bt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : Ta(e.on) : null, o = a && Bt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function Li({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = jt().floors) {
  const u = Bt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || Ky(u, d, o)) && Yy(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Ra = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Ky = (e, t, n) => !Ra({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function z4(e, t = jt().floors) {
  if (!Ra(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= Ia && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Yy(e, t, n = jt().floors) {
  const s = Bt(n, "home");
  return e.posture === "hang" && s && st(e, t).bottom >= s.top ? !1 : Ea(e, t);
}
function V4(e, t, n, s = jt().floors) {
  const a = Li(e, n, s);
  if (!e.home) return Jy(e, t, a, s);
  if (!a) return null;
  const o = Bt(s, "home"), r = a.y - t.y, i = r > Ia ? "dropping" : -r > zy ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Jy(e, t, n, s) {
  const a = n ? Bt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Gy(e.risen) };
  if (!n) return null;
  if (Ra(t) && n.y - t.y > Ia) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function G4(e, t, n) {
  const s = Aa * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function K4(e, t, n, s = jt().floors) {
  const a = t && Li(t, n, s);
  return a ? { ...e, ...a } : e;
}
const Zy = ["data-kind"], Xy = { class: "figure-floor-name" }, Qy = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", Xy, x(e.floor.kind), 1)
    ], 12, Zy));
  }
}, ew = /* @__PURE__ */ J(Qy, [["__scopeId", "data-v-8f6132da"]]), tw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, nw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Un(jt().floors);
    let n = () => {
    };
    return qe(() => {
      n = Hy((s) => t.value = s.floors), Uy();
    }), Ie(() => {
      n(), Bi();
    }), (s, a) => (c(), h("div", tw, [
      (c(!0), h(Y, null, te(t.value, (o) => (c(), K(ew, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Y4 = /* @__PURE__ */ J(nw, [["__scopeId", "data-v-e519168b"]]), Cs = (e) => typeof e == "number" ? e : Date.parse(e);
function J4(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Cs(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Cs(a.row.created_at) - Cs(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const sw = 3, Os = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function aw(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Os[n.grouping]) == null ? void 0 : s.call(Os, e.row, n)) || "";
}
function ow(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Z4(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= sw ? [ow(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = aw(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const rw = 1e3;
function iw() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), rw);
  return Dt(() => clearInterval(t)), e;
}
const lw = ["datetime", "title"], ss = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = iw(), s = B(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, x(V(a1)(e.at, V(n))), 9, lw));
  }
};
function cw(e, t, n = []) {
  return (n.length ? n.map((a) => e[a]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const X4 = (e) => (t) => t.filter((n) => n.id !== e), Q4 = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), ex = (e) => (t) => [...t, e], tx = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function nx(e) {
  const t = zn(), n = I(null), s = I("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const En = /* @__PURE__ */ new Map();
function uw(e, t) {
  if (En.has(e)) return En.get(e);
  const n = t().finally(() => En.delete(e));
  return En.set(e, n), n;
}
function sx() {
  const e = zn(), t = I(null), n = I("");
  async function s() {
    const a = await uw(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const dw = { class: "cards-page" }, hw = { class: "cards-bar" }, fw = { class: "cards-count" }, mw = { class: "cards" }, pw = {
  key: 1,
  class: "cards-note"
}, gw = {
  key: 2,
  class: "cards-note"
}, vw = ["data-row", "onClick"], yw = { class: "card-head" }, ww = { class: "card-title" }, kw = { class: "card-foot" }, bw = {
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
    return (s, a) => (c(), h("div", dw, [
      p("div", hw, [
        p("span", fw, x(e.rows.length) + " " + x(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        L(pe, tt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: W(() => [
            L(ge, {
              name: "plus",
              size: 12
            }),
            oe(" New " + x(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", mw, [
        e.loaded ? e.failure ? (c(), h("p", pw, x(e.failure), 1)) : e.rows.length ? A("", !0) : (c(), h("p", gw, "No " + x(e.noun) + "s yet", 1)) : (c(), K(Pt, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(Y, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          p("span", yw, [
            L(ge, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            oe(" " + x(e.head(o)), 1),
            L(ss, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          p("span", ww, x(e.title(o)), 1),
          p("span", kw, x(e.foot(o)), 1)
        ], 8, vw))), 128))
      ]),
      he(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ax = /* @__PURE__ */ J(bw, [["__scopeId", "data-v-990e6b37"]]), Bo = "newest";
function ox(e, { title: t, isOpen: n = null }) {
  var u;
  const s = (u = Ee(Ce, null)) == null ? void 0 : u.search, a = I(""), o = I(Bo), r = I("all"), i = B(() => {
    const d = a.value.trim().toLowerCase(), f = e.value.filter((g) => cw(g, d, s == null ? void 0 : s.fields) && (r.value === "all" || !n || n(g) === (r.value === "open")));
    return o.value === Bo ? f : [...f].sort((g, w) => t(g).localeCompare(t(w)));
  }), l = B(() => !!a.value.trim() || !!n && r.value !== "all");
  return { words: a, order: o, state: r, shown: i, filtering: l, hasStates: !!n };
}
const xw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, $w = 40, Mw = "top", Sw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = Ee(Ce, null)) == null ? void 0 : f.autoScroll, a = B(() => s === Mw), o = I(null), r = I(!1), i = (g) => a.value ? g.scrollTop : g.scrollHeight - g.scrollTop - g.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= $w;
    }
    return ke(() => n.rowCount, async () => {
      await Nt(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (g, w) => (c(), h("div", xw, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: X(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        he(g.$slots, "default", {}, void 0, !0)
      ], 34),
      L(Lt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: W(() => [
          ht(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            L(ge, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            w[0] || (w[0] = oe(" Newest ", -1))
          ], 512), [
            [Zi, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, rx = /* @__PURE__ */ J(Sw, [["__scopeId", "data-v-3accb764"]]), _w = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, Ew = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Ee(Ce, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (c(), h("div", _w, [
      (c(!0), h(Y, null, te(V(s), (i) => {
        var l;
        return c(), K(pe, {
          key: i.key,
          kind: "text",
          class: X(["inner-tab", { on: ((l = e.active) == null ? void 0 : l.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: W(() => [
            oe(x(i.label) + " " + x(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, ix = /* @__PURE__ */ J(Ew, [["__scopeId", "data-v-cf3bb39f"]]), Aw = {}, Cw = { class: "menu-label" };
function Ow(e, t) {
  return c(), h("span", Cw, [
    he(e.$slots, "default", {}, void 0, !0)
  ]);
}
const oa = /* @__PURE__ */ J(Aw, [["render", Ow], ["__scopeId", "data-v-aa955b3e"]]), Tw = {
  class: "search-bar",
  "data-search-bar": ""
}, Iw = { class: "search-bar-control" }, Rw = ["value", "placeholder", "aria-label"], Bw = ["aria-expanded"], Lw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var C;
    const s = e, a = n, o = Xi(), r = ((C = Ee(Ce, null)) == null ? void 0 : C.search) ?? {}, i = B(() => r.placeholder || s.placeholder), l = r.context ?? [], u = I(null), d = I(null), f = I([]), g = B(() => f.value.length ? f.value[f.value.length - 1].next : l), w = B(() => !!o.menu || l.length > 0), $ = (q) => {
      f.value = [], d.value = d.value ? null : q.currentTarget;
    };
    function M(q) {
      if (q.next.length) {
        f.value = [...f.value, q];
        return;
      }
      d.value = null, a("pick", q.click);
    }
    function _() {
      var q;
      a("update:modelValue", ""), (q = u.value) == null || q.focus();
    }
    return t({ focus: () => {
      var q;
      return (q = u.value) == null ? void 0 : q.focus();
    } }), (q, G) => {
      var N;
      return c(), h("div", Tw, [
        p("div", Iw, [
          L(ge, {
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
            onInput: G[0] || (G[0] = (y) => a("update:modelValue", y.target.value)),
            onKeydown: Yt(_, ["esc"])
          }, null, 40, Rw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: _
          }, [
            L(ge, {
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
            onClick: $
          }, [
            L(ge, {
              name: "caret",
              size: 12
            })
          ], 8, Bw)) : A("", !0)
        ]),
        (N = V(r).button) != null && N.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: G[1] || (G[1] = (y) => a("pick", V(r).button.click))
        }, x(V(r).button.title), 1)) : A("", !0),
        he(q.$slots, "default", {}, void 0, !0),
        d.value ? (c(), K(ba, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: G[3] || (G[3] = be(() => {
          }, ["stop"])),
          onClose: G[4] || (G[4] = (y) => d.value = null)
        }, {
          default: W(() => [
            f.value.length ? (c(), K(Rt, {
              key: 0,
              "data-search-back": "",
              onClick: G[2] || (G[2] = (y) => f.value = f.value.slice(0, -1))
            }, {
              default: W(() => [
                oe("‹ " + x(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (c(!0), h(Y, null, te(g.value, (y) => (c(), K(Rt, {
              key: y.title,
              description: y.subtext,
              "data-search-entry": y.title,
              onClick: (E) => M(y)
            }, {
              default: W(() => [
                oe(x(y.title) + x(y.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? A("", !0) : he(q.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, Nw = /* @__PURE__ */ J(Lw, [["__scopeId", "data-v-43c4837e"]]), Dw = {
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
    return (o, r) => (c(), K(Nw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (i) => n("pick", i))
    }, {
      menu: W(() => [
        L(oa, null, {
          default: W(() => [...r[2] || (r[2] = [
            oe("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(Y, null, te(s, (i) => L(Rt, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (l) => e.tools.order.value = i.key
        }, {
          default: W(() => [
            oe(x(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(Y, { key: 0 }, [
          L(oa, null, {
            default: W(() => [...r[3] || (r[3] = [
              oe("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(Y, null, te(a, (i) => L(Rt, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (l) => e.tools.state.value = i.key
          }, {
            default: W(() => [
              oe(x(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : A("", !0)
      ]),
      default: W(() => [
        he(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, lx = /* @__PURE__ */ J(Dw, [["__scopeId", "data-v-dab0064d"]]);
function cx() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Pw = 86400, ra = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function jw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ra(t) - ra(e)) / Pw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function ux(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ra(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: jw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Ts = 280, Is = 240, Rs = 120, qw = 6, Fw = 14, rn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Ww(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Ni(e, t) {
  const n = Math.max(0, Ww(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function Hw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Fw}px)` }), e.offsetHeight, e.style.transition = `height ${Ts}ms ${rn}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Ni(t, e));
    const g = a() - i;
    if (!l && g >= Ts && (l = !0, e.style.transition = `opacity ${Is}ms ease-out, transform ${Is}ms ${rn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), g < Ts + Is) return s(f);
    d();
  };
  return s(f), d;
}
function dx(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${qw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Rs}ms ease-out, transform ${Rs}ms ${rn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = Ni(t, e)), a() - r < Rs) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const Uw = 140, An = 220, Lo = 5;
function hx({ gap: e = Uw, later: t = setTimeout } = {}) {
  const n = [], s = /* @__PURE__ */ new Set();
  let a = !1, o = 0, r = !1;
  function i(d, f) {
    s.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      s.delete(d), d.done(), f();
    });
  }
  function l() {
    const d = n.splice(0, Lo);
    if (a = d.length > 0, !a) return;
    let f = d.length;
    for (const g of d)
      g.el.style.display = g.display, i(g, () => {
        f -= 1, f || (o = t(l, e));
      });
  }
  const u = (d, f, g, w = Hw) => {
    if (r || !f.pane || !f.follows()) return g();
    const $ = { el: d, options: f, done: g, arrival: w, display: d.style.display || "" };
    if (!a)
      return a = !0, i($, () => o = t(l, e));
    d.style.display = "none", n.push($), n.length >= Lo && u.flush();
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
function fx(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${An}ms ${rn}, opacity ${An}ms ease-in, margin ${An}ms ${rn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, An);
}
const Di = "chat.pins.minimised", Rn = I(Jt(Di, !1));
function No(e) {
  Rn.value = e, Vn(Di, e);
}
function zw(e) {
  const t = B(() => e()), n = B(() => Rn.value ? [] : e()), s = () => No(!Rn.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => bt(o) > a).length,
    (o, r) => o > r && No(!1)
  ), { pins: t, visible: n, minimised: Rn, toggle: s };
}
const Vw = ["title"], Gw = {
  key: 0,
  class: "pins-count"
}, Kw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = zw(() => t.pinRows);
    return (o, r) => V(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: V(s), inline: e.inline }]),
      title: V(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = be((...i) => V(a) && V(a)(...i), ["stop"]))
    }, [
      L(ge, {
        name: V(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      V(s) ? (c(), h("span", Gw, x(V(n).length), 1)) : A("", !0)
    ], 10, Vw)) : A("", !0);
  }
}, mx = /* @__PURE__ */ J(Kw, [["__scopeId", "data-v-d073c504"]]), Yw = ["title"], Jw = ["title"], Zw = { class: "diff-card-dir" }, Xw = { class: "diff-card-name" }, Qw = ["title"], ek = ["title"], tk = {
  key: 0,
  class: "diff-card-note"
}, nk = ["href"], sk = ["src", "alt"], ak = { class: "diff-card-rows" }, ok = { class: "diff-row-num" }, rk = { class: "diff-row-sign" }, ik = { class: "diff-row-code" }, lk = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = B(() => n.path.lastIndexOf("/") + 1), u = B(() => n.path.slice(0, l.value)), d = B(() => n.path.slice(l.value)), f = B(() => n.kind === "deleted"), g = B(() => r[n.kind]), w = B(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), $ = I("after"), M = B(() => $.value === "before" ? n.whole.old : n.whole.text), _ = B(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map((S, b) => ({ line_type: $.value === "after" && w.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), C = I(!1), q = B(() => n.lines && !C.value && !n.whole), G = B(() => q.value ? _.value.slice(0, n.lines) : _.value), N = B(() => _.value.length - G.value.length), y = (S) => S.line === null || S.line_type === "del" ? "" : S.line, E = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, k = I(null), T = I(null);
    let v = null;
    return qe(() => {
      if (!T.value) return;
      let S = !0;
      v = new ResizeObserver(() => {
        !k.value || !T.value || (k.value.style.transition = S ? "none" : "", k.value.style.height = `${T.value.offsetHeight}px`, S = !1);
      }), v.observe(T.value);
    }), Ie(() => v && v.disconnect()), (S, b) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (m) => !f.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${V(a)}-click to open it`,
          onClick: o
        }, [
          p("span", Zw, x(u.value), 1),
          p("span", Xw, x(d.value), 1),
          g.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.kind])
          }, x(g.value), 3)) : A("", !0)
        ], 8, Jw),
        p("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + x(e.added), 3),
        p("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + x(e.removed), 3),
        L(ss, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: $.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = be((m) => $.value = $.value === "after" ? "before" : "after", ["stop"]))
        }, x($.value === "after" ? "After" : "Before"), 9, Qw)) : A("", !0),
        f.value ? A("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = be((m) => s("whole"), ["stop"]))
        }, [
          L(ge, {
            name: "file",
            size: 12
          })
        ], 10, ek))
      ], 8, Yw),
      e.whole && e.whole.error ? (c(), h("p", tk, x(e.whole.error), 1)) : A("", !0),
      !f.value && !e.folded ? (c(), h(Y, { key: 1 }, [
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
          }, null, 8, sk)
        ], 8, nk)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: k,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: T,
            class: "diff-card-diff"
          }, [
            p("div", ak, [
              (c(!0), h(Y, null, te(G.value, (m, D) => (c(), h("div", {
                key: D,
                class: X(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                p("span", ok, x(y(m)), 1),
                p("span", rk, x(i[m.line_type]), 1),
                p("span", ik, x(E(m)), 1)
              ], 2))), 128)),
              N.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = be((m) => C.value = !0, ["stop"]))
              }, x(N.value) + " more " + x(N.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, px = /* @__PURE__ */ J(lk, [["__scopeId", "data-v-fed58c18"]]), ck = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), K(pe, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: W(() => [
        L(ge, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Ze = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, uk = {
  draft: [{ word: "ready", label: "Mark ready" }, Ze],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Ze],
  approved: [{ word: "start", label: "Start", main: !0 }, Ze],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ze],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ze],
  completed: [],
  cancelled: []
}, dk = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Ze],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Ze],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, Ze],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ze],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, hk = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], fk = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], mk = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], pk = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], gk = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }], vk = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? gk(t) : e === "agent" ? [...mk(t), ...fk(t)] : e === "check" ? pk(t) : e === "question" ? hk(t) : ((n = { plan: uk, task: dk }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, yk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, wk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, kk = { class: "ask-text" }, bk = ["placeholder", "aria-label"], xk = ["placeholder", "aria-label"], $k = {
  key: 3,
  class: "moves"
}, Mk = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = B(() => vk(s.kind, s.row)), r = I(""), i = I(null), l = I(""), u = I("");
    ke(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(w, $ = "") {
      const M = await s.read([w.noun ?? s.kind, w.word, String(s.id), ...w.flag ? [w.flag, $] : w.positional ? [$] : [], ...w.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = M.ok ? "" : M.error, M.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (w) => w.confirm ? i.value = w : w.said ? d(w, w.said) : w.flag || w.positional ? (i.value = w, l.value = "") : d(w), g = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (w, $) => {
      var M;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: X(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", yk, x(r.value), 1)) : A("", !0),
        (M = i.value) != null && M.confirm ? (c(), h("div", wk, [
          p("span", kk, x(i.value.confirm), 1),
          L(pe, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: $[0] || ($[0] = (_) => d(i.value))
          }, {
            default: W(() => [
              oe(x(i.value.label), 1)
            ]),
            _: 1
          }),
          L(pe, {
            small: "",
            kind: "ghost",
            onClick: $[1] || ($[1] = (_) => i.value = null)
          }, {
            default: W(() => [...$[7] || ($[7] = [
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
            "onUpdate:modelValue": $[2] || ($[2] = (_) => l.value = _),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: $[3] || ($[3] = Yt(be((_) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, bk), [
            [Ds, l.value]
          ]),
          i.value.opener ? ht((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": $[4] || ($[4] = (_) => u.value = _),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: $[5] || ($[5] = Yt(be((_) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, xk)), [
            [Ds, u.value]
          ]) : A("", !0),
          L(pe, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: W(() => [
              oe(x(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          L(pe, {
            small: "",
            kind: "ghost",
            onClick: $[6] || ($[6] = (_) => i.value = null)
          }, {
            default: W(() => [...$[8] || ($[8] = [
              oe("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", $k, [
          (c(!0), h(Y, null, te(o.value, (_) => (c(), K(pe, {
            key: _.word,
            small: !_.bordered,
            bordered: _.bordered,
            icon: _.icon,
            kind: _.main ? "primary" : "ghost",
            "data-move": _.word,
            onClick: (C) => f(_)
          }, {
            default: W(() => [
              oe(x(_.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : A("", !0);
    };
  }
}, Sk = /* @__PURE__ */ J(Mk, [["__scopeId", "data-v-ed426b4f"]]), _k = /* @__PURE__ */ new Set(["completed", "cancelled"]), Ek = (e) => _k.has(e), ia = (e) => Ek(e) ? "done" : e, Ak = { class: "facts" }, Ck = { class: "fact wide" }, Ok = { class: "fact-value" }, Tk = {
  key: 0,
  class: "fact"
}, Ik = { class: "fact-value" }, Rk = {
  key: 1,
  class: "fact"
}, Bk = { class: "fact-value" }, Lk = { class: "fact wide" }, Nk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Dk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Dn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return c(), h("div", Ak, [
        p("div", Ck, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", Ok, x((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Tk, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", Ik, x(e.place.phase_number) + " of " + x(e.place.phase_total) + ": " + x(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.state === "started" && e.task.holder_id ? (c(), h("div", Rk, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", Bk, "Agent " + x(e.task.holder_id), 1)
        ])) : A("", !0),
        p("div", Lk, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          L(qr, {
            options: V(n),
            value: String(V(jr)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (l) => s("priority", l))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", Nk, x(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, Pk = /* @__PURE__ */ J(Dk, [["__scopeId", "data-v-2018762d"]]), jk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, qk = { ...jk, done: "Completed" }, Fk = { class: "task-status-icon" }, Wk = ["width", "height", "aria-label"], Hk = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", Fk, [
      L(Lt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: W(() => [
          (c(), h("svg", {
            key: e.status,
            class: X(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": V(qk)[e.status]
          }, [
            L(ln, { value: e.status }, {
              blocked: W(() => [...n[0] || (n[0] = [
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
              done: W(() => [...n[1] || (n[1] = [
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
              started: W(() => [...n[2] || (n[2] = [
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
              asked: W(() => [...n[3] || (n[3] = [
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
              paused: W(() => [...n[4] || (n[4] = [
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
              planned: W(() => [...n[5] || (n[5] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: W(() => [...n[6] || (n[6] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Wk))
        ]),
        _: 1
      })
    ]));
  }
}, Pi = /* @__PURE__ */ J(Hk, [["__scopeId", "data-v-2ab7e404"]]), Uk = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, zk = ["onClick"], Vk = { class: "wait-id" }, Gk = { class: "wait-title" }, Kk = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Yk = { class: "text" }, Jk = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, Zk = 180, Xk = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = I(!1);
    return (a, o) => (c(), h(Y, null, [
      e.task.waits.length ? (c(), h("section", Uk, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (c(!0), h(Y, null, te(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          L(Pi, {
            status: V(ia)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", Vk, x(r.id), 1),
          p("span", Gk, x(r.title), 1)
        ], 8, zk))), 128))
      ])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", Kk, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", Yk, x(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (c(), h("section", Jk, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: X(["text", { clamped: !s.value }])
        }, x(e.task.brief), 3),
        e.task.brief.length > Zk && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0)
    ], 64));
  }
}, Qk = /* @__PURE__ */ J(Xk, [["__scopeId", "data-v-8e4d95ae"]]), e2 = {
  class: "task-details",
  "data-task-details": ""
}, t2 = { class: "since" }, n2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, s2 = { class: "text" }, a2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, o2 = {
  key: 1,
  class: "note"
}, r2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, i2 = { class: "text" }, l2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, s = (a) => a.slice(0, 1).toUpperCase() + a.slice(1);
    return (a, o) => {
      var r;
      return c(), h("div", e2, [
        p("div", {
          class: X(["state-line", V(ia)(e.task.state)])
        }, [
          p("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            L(Pi, {
              status: V(ia)(e.task.state)
            }, null, 8, ["status"]),
            oe(" " + x(s(e.task.state)), 1)
          ]),
          p("span", t2, [
            o[3] || (o[3] = oe(" since ", -1)),
            L(ss, {
              at: V(pa)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", n2, [
          o[4] || (o[4] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
          p("p", s2, x(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", a2, "Opens by itself when " + x(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", o2, "Nothing opens it by itself. Unblock it when that is done."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", r2, [
          o[5] || (o[5] = p("span", { class: "label" }, "Why it was cancelled", -1)),
          p("p", i2, x(e.task.reason), 1)
        ])) : A("", !0),
        L(Pk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (i) => n("priority", i))
        }, null, 8, ["task", "place", "refusal"]),
        L(Qk, {
          task: e.task,
          onSelect: o[2] || (o[2] = (i) => n("select", i))
        }, null, 8, ["task"])
      ]);
    };
  }
}, c2 = /* @__PURE__ */ J(l2, [["__scopeId", "data-v-4a8b1505"]]), u2 = {
  class: "task-log",
  "aria-label": "Task log"
}, d2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, h2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, f2 = { class: "entries" }, m2 = ["datetime"], p2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, g2 = {
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
    }), (u, d) => (c(), h("section", u2, [
      o.value ? (c(), K(Pt, { key: 0 })) : r.value ? (c(), h(Y, { key: 1 }, [
        p("p", d2, x(r.value), 1),
        L(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => l(s.value))
        }, {
          default: W(() => [...d[3] || (d[3] = [
            oe("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(Y, { key: 2 }, [
        n.value.length ? A("", !0) : (c(), h("p", h2, "No log entries yet.")),
        p("ol", f2, [
          (c(!0), h(Y, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            p("time", {
              datetime: f.created_at
            }, x(new Date(f.created_at).toLocaleString()), 9, m2),
            p("p", null, x(f.line), 1)
          ]))), 128))
        ]),
        s.value > 1 || !a.value ? (c(), h("nav", p2, [
          L(pe, {
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
          p("span", null, "Page " + x(s.value), 1),
          L(pe, {
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
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, v2 = /* @__PURE__ */ J(g2, [["__scopeId", "data-v-953605e5"]]), y2 = { class: "comment-side-head" }, w2 = {
  key: 0,
  class: "comment-none"
}, k2 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: X(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", y2, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        L(Yn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? A("", !0) : (c(), h("p", w2, "No comments yet")),
      (c(!0), h(Y, null, te(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, x(e.words(s)), 1))), 128))
    ], 2));
  }
}, b2 = /* @__PURE__ */ J(k2, [["__scopeId", "data-v-19fdbdd4"]]);
var Po;
/Mac|iPhone|iPad/.test(((Po = navigator.userAgentData) == null ? void 0 : Po.platform) || navigator.platform);
function x2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const $2 = ["placeholder"], M2 = { class: "actions" }, S2 = { class: "error" }, _2 = {
  key: 1,
  class: "card closed"
}, E2 = { class: "mark" }, A2 = { class: "prompt" }, C2 = {
  key: 0,
  class: "draft"
}, O2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ns({
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
  emits: /* @__PURE__ */ Ns(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Ls(e, "draft"), r = Ls(e, "error"), i = I(!!r.value), l = I(!1), u = I(!1), d = I(null);
    async function f() {
      var $, M;
      i.value = !0, l.value = !1, await Nt(), (M = (($ = d.value) == null ? void 0 : $.querySelector("input")) || d.value) == null || M.focus();
    }
    function g() {
      i.value = !1, r.value = "";
    }
    async function w() {
      const $ = o.value.trim();
      if (!(!$ || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send($), i.value = !1, l.value = !0;
        } catch (M) {
          o.value = $, r.value = M.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), ($, M) => (c(), h("div", {
      class: X(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: be(w, ["prevent"]),
        onKeydown: Yt(g, ["esc"])
      }, [
        he($.$slots, "who", {}, void 0, !0),
        ht(p("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": M[0] || (M[0] = (_) => o.value = _),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: M[1] || (M[1] = Yt((_) => V(x2)(_, w), ["enter"]))
        }, null, 40, $2), [
          [Ds, o.value]
        ]),
        p("div", M2, [
          p("span", S2, x(r.value), 1),
          L(pe, {
            small: "",
            onClick: g
          }, {
            default: W(() => [...M[3] || (M[3] = [
              oe("Cancel", -1)
            ])]),
            _: 1
          }),
          L(pe, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: w
          }, {
            default: W(() => [...M[4] || (M[4] = [
              oe("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", _2, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          p("span", E2, [
            L(ge, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", A2, x(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", C2, "Draft kept")) : A("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: M[2] || (M[2] = (_) => a("show"))
        }, [
          p("span", null, x(V(km)(e.count, "comment")), 1),
          L(ge, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, T2 = /* @__PURE__ */ J(O2, [["__scopeId", "data-v-81f478d2"]]);
function I2(e, t) {
  const n = I([]), s = I(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: f, title: g } = e(), w = `On ${d} ${f}, ${g}: `;
    return u.text.startsWith(w) ? u.text.slice(w.length) : u.text;
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
    const w = await t([d, "comment", String(f), u]);
    if (!w.ok)
      throw n.value = n.value.filter(($) => $ !== g && $.id !== g.id), new Error(w.error);
    await i();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const R2 = { class: "top" }, B2 = {
  class: "crumb",
  "data-task-crumb": ""
}, L2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, N2 = {
  key: 1,
  class: "body"
}, D2 = { class: "summary" }, P2 = { class: "stamp" }, j2 = {
  class: "title",
  "data-resource-title": ""
}, q2 = {
  class: "tabs",
  "data-task-tabs": ""
}, F2 = { class: "panels" }, W2 = {
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
    const s = e, a = n, o = I(null), r = I(null), i = I(""), l = I(""), u = I(null), d = I(null), f = I("details"), g = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], w = I2(
      () => o.value ? { kind: "task", id: s.id, title: o.value.title } : {},
      (N) => s.read(N)
    );
    let $ = 0;
    const M = B(() => {
      var N;
      return (N = r.value) != null && N.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function _() {
      const N = ++$, [y, E] = await Promise.all([
        s.read(["task", "inspect", String(s.id)]),
        s.read(["plan", "place", String(s.id)])
      ]);
      N === $ && (i.value = y.ok ? "" : y.error, o.value = y.ok ? y.value : null, r.value = E.ok ? E.value : null);
    }
    ke(
      () => s.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", _();
      },
      { immediate: !0 }
    ), ke(() => s.changes, _), ke(w.open, (N) => {
      N && (f.value = "comments");
    });
    async function C(N) {
      const y = o.value.priority;
      o.value.priority = Number(N);
      const E = await s.read(["task", "edit", String(s.id), "--priority", N]);
      if (l.value = E.ok ? "" : E.error, E.ok) return _();
      o.value.priority = y;
    }
    function q(N) {
      u.value = null, d.value.press(N);
    }
    const G = (N) => {
      var y;
      return ((y = d.value) == null ? void 0 : y.moves.length) && (u.value = N);
    };
    return t({ openStatus: G }), (N, y) => (c(), h("aside", {
      class: X(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", R2, [
        e.backed ? (c(), K(ck, {
          key: 0,
          onBack: y[0] || (y[0] = (E) => a("back"))
        })) : A("", !0),
        p("span", B2, x(M.value), 1),
        y[9] || (y[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(Y, { key: 1 }, [
          L(pe, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: y[1] || (y[1] = (E) => a("step", -1))
          }, {
            default: W(() => [
              L(ge, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          L(pe, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: y[2] || (y[2] = (E) => a("step", 1))
          }, {
            default: W(() => [
              L(ge, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        L(pe, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: y[3] || (y[3] = (E) => a("close"))
        }, {
          default: W(() => [
            L(ge, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", L2, x(i.value), 1)) : o.value ? (c(), h(Y, { key: 2 }, [
        L(Sk, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: _
        }, null, 8, ["id", "row", "read"]),
        p("header", D2, [
          p("div", P2, [
            oe(" Task " + x(o.value.id) + " · updated ", 1),
            L(ss, {
              at: V(pa)(o.value)
            }, null, 8, ["at"])
          ]),
          p("h3", j2, x(o.value.title), 1)
        ]),
        p("div", q2, [
          L(qr, {
            options: g,
            value: f.value,
            onPick: y[4] || (y[4] = (E) => f.value = E)
          }, null, 8, ["value"])
        ]),
        p("div", F2, [
          L(ln, { value: f.value }, {
            details: W(() => [
              L(c2, {
                task: o.value,
                place: r.value,
                refusal: l.value,
                onStatus: G,
                onPriority: C,
                onSelect: y[5] || (y[5] = (E) => a("select", E))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: W(() => [
              L(b2, {
                below: "",
                comments: V(w).comments.value,
                words: V(w).words,
                onClose: y[6] || (y[6] = (E) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: W(() => [
              L(v2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        L(T2, {
          send: V(w).send,
          count: V(w).comments.value.length,
          onShow: y[7] || (y[7] = (E) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", N2, [
        L(Pt)
      ])),
      u.value ? (c(), K(ba, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: y[8] || (y[8] = (E) => u.value = null)
      }, {
        default: W(() => [
          L(oa, null, {
            default: W(() => [
              oe("Change the status of task " + x(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(Y, null, te(d.value.moves, (E) => (c(), K(Rt, {
            key: E.word,
            onClick: (k) => q(E)
          }, {
            default: W(() => [
              oe(x(E.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, gx = /* @__PURE__ */ J(W2, [["__scopeId", "data-v-43f3b122"]]);
function H2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Bs = { exports: {} }, Do;
function U2() {
  return Do || (Do = 1, (function(e, t) {
    var n = (function() {
      var s = function(y, E) {
        var k = 236, T = 17, v = y, S = o[E], b = null, m = 0, D = null, P = [], R = {}, Z = function(j, F) {
          m = v * 4 + 17, b = (function(O) {
            for (var H = new Array(O), U = 0; U < O; U += 1) {
              H[U] = new Array(O);
              for (var Q = 0; Q < O; Q += 1)
                H[U][Q] = null;
            }
            return H;
          })(m), z(0, 0), z(m - 7, 0), z(0, m - 7), ye(), le(), Ge(j, F), v >= 7 && Re(j), D == null && (D = ji(v, S, P)), Ke(D, F);
        }, z = function(j, F) {
          for (var O = -1; O <= 7; O += 1)
            if (!(j + O <= -1 || m <= j + O))
              for (var H = -1; H <= 7; H += 1)
                F + H <= -1 || m <= F + H || (0 <= O && O <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (O == 0 || O == 6) || 2 <= O && O <= 4 && 2 <= H && H <= 4 ? b[j + O][F + H] = !0 : b[j + O][F + H] = !1);
        }, ce = function() {
          for (var j = 0, F = 0, O = 0; O < 8; O += 1) {
            Z(!0, O);
            var H = i.getLostPoint(R);
            (O == 0 || j > H) && (j = H, F = O);
          }
          return F;
        }, le = function() {
          for (var j = 8; j < m - 8; j += 1)
            b[j][6] == null && (b[j][6] = j % 2 == 0);
          for (var F = 8; F < m - 8; F += 1)
            b[6][F] == null && (b[6][F] = F % 2 == 0);
        }, ye = function() {
          for (var j = i.getPatternPosition(v), F = 0; F < j.length; F += 1)
            for (var O = 0; O < j.length; O += 1) {
              var H = j[F], U = j[O];
              if (b[H][U] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var se = -2; se <= 2; se += 1)
                    Q == -2 || Q == 2 || se == -2 || se == 2 || Q == 0 && se == 0 ? b[H + Q][U + se] = !0 : b[H + Q][U + se] = !1;
            }
        }, Re = function(j) {
          for (var F = i.getBCHTypeNumber(v), O = 0; O < 18; O += 1) {
            var H = !j && (F >> O & 1) == 1;
            b[Math.floor(O / 3)][O % 3 + m - 8 - 3] = H;
          }
          for (var O = 0; O < 18; O += 1) {
            var H = !j && (F >> O & 1) == 1;
            b[O % 3 + m - 8 - 3][Math.floor(O / 3)] = H;
          }
        }, Ge = function(j, F) {
          for (var O = S << 3 | F, H = i.getBCHTypeInfo(O), U = 0; U < 15; U += 1) {
            var Q = !j && (H >> U & 1) == 1;
            U < 6 ? b[U][8] = Q : U < 8 ? b[U + 1][8] = Q : b[m - 15 + U][8] = Q;
          }
          for (var U = 0; U < 15; U += 1) {
            var Q = !j && (H >> U & 1) == 1;
            U < 8 ? b[8][m - U - 1] = Q : U < 9 ? b[8][15 - U - 1 + 1] = Q : b[8][15 - U - 1] = Q;
          }
          b[m - 8][8] = !j;
        }, Ke = function(j, F) {
          for (var O = -1, H = m - 1, U = 7, Q = 0, se = i.getMaskFunction(F), ne = m - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (b[H][ne - we] == null) {
                  var $e = !1;
                  Q < j.length && ($e = (j[Q] >>> U & 1) == 1);
                  var re = se(H, ne - we);
                  re && ($e = !$e), b[H][ne - we] = $e, U -= 1, U == -1 && (Q += 1, U = 7);
                }
              if (H += O, H < 0 || m <= H) {
                H -= O, O = -O;
                break;
              }
            }
        }, St = function(j, F) {
          for (var O = 0, H = 0, U = 0, Q = new Array(F.length), se = new Array(F.length), ne = 0; ne < F.length; ne += 1) {
            var we = F[ne].dataCount, $e = F[ne].totalCount - we;
            H = Math.max(H, we), U = Math.max(U, $e), Q[ne] = new Array(we);
            for (var re = 0; re < Q[ne].length; re += 1)
              Q[ne][re] = 255 & j.getBuffer()[re + O];
            O += we;
            var Le = i.getErrorCorrectPolynomial($e), Ne = u(Q[ne], Le.getLength() - 1), Ba = Ne.mod(Le);
            se[ne] = new Array(Le.getLength() - 1);
            for (var re = 0; re < se[ne].length; re += 1) {
              var La = re + Ba.getLength() - se[ne].length;
              se[ne][re] = La >= 0 ? Ba.getAt(La) : 0;
            }
          }
          for (var Na = 0, re = 0; re < F.length; re += 1)
            Na += F[re].totalCount;
          for (var as = new Array(Na), yn = 0, re = 0; re < H; re += 1)
            for (var ne = 0; ne < F.length; ne += 1)
              re < Q[ne].length && (as[yn] = Q[ne][re], yn += 1);
          for (var re = 0; re < U; re += 1)
            for (var ne = 0; ne < F.length; ne += 1)
              re < se[ne].length && (as[yn] = se[ne][re], yn += 1);
          return as;
        }, ji = function(j, F, O) {
          for (var H = d.getRSBlocks(j, F), U = f(), Q = 0; Q < O.length; Q += 1) {
            var se = O[Q];
            U.put(se.getMode(), 4), U.put(se.getLength(), i.getLengthInBits(se.getMode(), j)), se.write(U);
          }
          for (var ne = 0, Q = 0; Q < H.length; Q += 1)
            ne += H[Q].dataCount;
          if (U.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + U.getLengthInBits() + ">" + ne * 8 + ")";
          for (U.getLengthInBits() + 4 <= ne * 8 && U.put(0, 4); U.getLengthInBits() % 8 != 0; )
            U.putBit(!1);
          for (; !(U.getLengthInBits() >= ne * 8 || (U.put(k, 8), U.getLengthInBits() >= ne * 8)); )
            U.put(T, 8);
          return St(U, H);
        };
        R.addData = function(j, F) {
          F = F || "Byte";
          var O = null;
          switch (F) {
            case "Numeric":
              O = g(j);
              break;
            case "Alphanumeric":
              O = w(j);
              break;
            case "Byte":
              O = $(j);
              break;
            case "Kanji":
              O = M(j);
              break;
            default:
              throw "mode:" + F;
          }
          P.push(O), D = null;
        }, R.isDark = function(j, F) {
          if (j < 0 || m <= j || F < 0 || m <= F)
            throw j + "," + F;
          return b[j][F];
        }, R.getModuleCount = function() {
          return m;
        }, R.make = function() {
          if (v < 1) {
            for (var j = 1; j < 40; j++) {
              for (var F = d.getRSBlocks(j, S), O = f(), H = 0; H < P.length; H++) {
                var U = P[H];
                O.put(U.getMode(), 4), O.put(U.getLength(), i.getLengthInBits(U.getMode(), j)), U.write(O);
              }
              for (var Q = 0, H = 0; H < F.length; H++)
                Q += F[H].dataCount;
              if (O.getLengthInBits() <= Q * 8)
                break;
            }
            v = j;
          }
          Z(!1, ce());
        }, R.createTableTag = function(j, F) {
          j = j || 2, F = typeof F > "u" ? j * 4 : F;
          var O = "";
          O += '<table style="', O += " border-width: 0px; border-style: none;", O += " border-collapse: collapse;", O += " padding: 0px; margin: " + F + "px;", O += '">', O += "<tbody>";
          for (var H = 0; H < R.getModuleCount(); H += 1) {
            O += "<tr>";
            for (var U = 0; U < R.getModuleCount(); U += 1)
              O += '<td style="', O += " border-width: 0px; border-style: none;", O += " border-collapse: collapse;", O += " padding: 0px; margin: 0px;", O += " width: " + j + "px;", O += " height: " + j + "px;", O += " background-color: ", O += R.isDark(H, U) ? "#000000" : "#ffffff", O += ";", O += '"/>';
            O += "</tr>";
          }
          return O += "</tbody>", O += "</table>", O;
        }, R.createSvgTag = function(j, F, O, H) {
          var U = {};
          typeof arguments[0] == "object" && (U = arguments[0], j = U.cellSize, F = U.margin, O = U.alt, H = U.title), j = j || 2, F = typeof F > "u" ? j * 4 : F, O = typeof O == "string" ? { text: O } : O || {}, O.text = O.text || null, O.id = O.text ? O.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var Q = R.getModuleCount() * j + F * 2, se, ne, we, $e, re = "", Le;
          for (Le = "l" + j + ",0 0," + j + " -" + j + ",0 0,-" + j + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += U.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', re += ' viewBox="0 0 ' + Q + " " + Q + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += H.text || O.text ? ' role="img" aria-labelledby="' + _t([H.id, O.id].join(" ").trim()) + '"' : "", re += ">", re += H.text ? '<title id="' + _t(H.id) + '">' + _t(H.text) + "</title>" : "", re += O.text ? '<description id="' + _t(O.id) + '">' + _t(O.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', we = 0; we < R.getModuleCount(); we += 1)
            for ($e = we * j + F, se = 0; se < R.getModuleCount(); se += 1)
              R.isDark(we, se) && (ne = se * j + F, re += "M" + ne + "," + $e + Le);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, R.createDataURL = function(j, F) {
          j = j || 2, F = typeof F > "u" ? j * 4 : F;
          var O = R.getModuleCount() * j + F * 2, H = F, U = O - F;
          return N(O, O, function(Q, se) {
            if (H <= Q && Q < U && H <= se && se < U) {
              var ne = Math.floor((Q - H) / j), we = Math.floor((se - H) / j);
              return R.isDark(we, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(j, F, O) {
          j = j || 2, F = typeof F > "u" ? j * 4 : F;
          var H = R.getModuleCount() * j + F * 2, U = "";
          return U += "<img", U += ' src="', U += R.createDataURL(j, F), U += '"', U += ' width="', U += H, U += '"', U += ' height="', U += H, U += '"', O && (U += ' alt="', U += _t(O), U += '"'), U += "/>", U;
        };
        var _t = function(j) {
          for (var F = "", O = 0; O < j.length; O += 1) {
            var H = j.charAt(O);
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
        }, qi = function(j) {
          var F = 1;
          j = typeof j > "u" ? F * 2 : j;
          var O = R.getModuleCount() * F + j * 2, H = j, U = O - j, Q, se, ne, we, $e, re = {
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
          for (Q = 0; Q < O; Q += 2) {
            for (ne = Math.floor((Q - H) / F), we = Math.floor((Q + 1 - H) / F), se = 0; se < O; se += 1)
              $e = "█", H <= se && se < U && H <= Q && Q < U && R.isDark(ne, Math.floor((se - H) / F)) && ($e = " "), H <= se && se < U && H <= Q + 1 && Q + 1 < U && R.isDark(we, Math.floor((se - H) / F)) ? $e += " " : $e += "█", Ne += j < 1 && Q + 1 >= U ? Le[$e] : re[$e];
            Ne += `
`;
          }
          return O % 2 && j > 0 ? Ne.substring(0, Ne.length - O - 1) + Array(O + 1).join("▀") : Ne.substring(0, Ne.length - 1);
        };
        return R.createASCII = function(j, F) {
          if (j = j || 1, j < 2)
            return qi(F);
          j -= 1, F = typeof F > "u" ? j * 2 : F;
          var O = R.getModuleCount() * j + F * 2, H = F, U = O - F, Q, se, ne, we, $e = Array(j + 1).join("██"), re = Array(j + 1).join("  "), Le = "", Ne = "";
          for (Q = 0; Q < O; Q += 1) {
            for (ne = Math.floor((Q - H) / j), Ne = "", se = 0; se < O; se += 1)
              we = 1, H <= se && se < U && H <= Q && Q < U && R.isDark(ne, Math.floor((se - H) / j)) && (we = 0), Ne += we ? $e : re;
            for (ne = 0; ne < j; ne += 1)
              Le += Ne + `
`;
          }
          return Le.substring(0, Le.length - 1);
        }, R.renderTo2dContext = function(j, F) {
          F = F || 2;
          for (var O = R.getModuleCount(), H = 0; H < O; H++)
            for (var U = 0; U < O; U++)
              j.fillStyle = R.isDark(H, U) ? "black" : "white", j.fillRect(H * F, U * F, F, F);
        }, R;
      };
      s.stringToBytesFuncs = {
        default: function(y) {
          for (var E = [], k = 0; k < y.length; k += 1) {
            var T = y.charCodeAt(k);
            E.push(T & 255);
          }
          return E;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(y, E) {
        var k = (function() {
          for (var v = q(y), S = function() {
            var le = v.read();
            if (le == -1) throw "eof";
            return le;
          }, b = 0, m = {}; ; ) {
            var D = v.read();
            if (D == -1) break;
            var P = S(), R = S(), Z = S(), z = String.fromCharCode(D << 8 | P), ce = R << 8 | Z;
            m[z] = ce, b += 1;
          }
          if (b != E)
            throw b + " != " + E;
          return m;
        })(), T = 63;
        return function(v) {
          for (var S = [], b = 0; b < v.length; b += 1) {
            var m = v.charCodeAt(b);
            if (m < 128)
              S.push(m);
            else {
              var D = k[v.charAt(b)];
              typeof D == "number" ? (D & 255) == D ? S.push(D) : (S.push(D >>> 8), S.push(D & 255)) : S.push(T);
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
        ], E = 1335, k = 7973, T = 21522, v = {}, S = function(b) {
          for (var m = 0; b != 0; )
            m += 1, b >>>= 1;
          return m;
        };
        return v.getBCHTypeInfo = function(b) {
          for (var m = b << 10; S(m) - S(E) >= 0; )
            m ^= E << S(m) - S(E);
          return (b << 10 | m) ^ T;
        }, v.getBCHTypeNumber = function(b) {
          for (var m = b << 12; S(m) - S(k) >= 0; )
            m ^= k << S(m) - S(k);
          return b << 12 | m;
        }, v.getPatternPosition = function(b) {
          return y[b - 1];
        }, v.getMaskFunction = function(b) {
          switch (b) {
            case r.PATTERN000:
              return function(m, D) {
                return (m + D) % 2 == 0;
              };
            case r.PATTERN001:
              return function(m, D) {
                return m % 2 == 0;
              };
            case r.PATTERN010:
              return function(m, D) {
                return D % 3 == 0;
              };
            case r.PATTERN011:
              return function(m, D) {
                return (m + D) % 3 == 0;
              };
            case r.PATTERN100:
              return function(m, D) {
                return (Math.floor(m / 2) + Math.floor(D / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(m, D) {
                return m * D % 2 + m * D % 3 == 0;
              };
            case r.PATTERN110:
              return function(m, D) {
                return (m * D % 2 + m * D % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(m, D) {
                return (m * D % 3 + (m + D) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + b;
          }
        }, v.getErrorCorrectPolynomial = function(b) {
          for (var m = u([1], 0), D = 0; D < b; D += 1)
            m = m.multiply(u([1, l.gexp(D)], 0));
          return m;
        }, v.getLengthInBits = function(b, m) {
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
        }, v.getLostPoint = function(b) {
          for (var m = b.getModuleCount(), D = 0, P = 0; P < m; P += 1)
            for (var R = 0; R < m; R += 1) {
              for (var Z = 0, z = b.isDark(P, R), ce = -1; ce <= 1; ce += 1)
                if (!(P + ce < 0 || m <= P + ce))
                  for (var le = -1; le <= 1; le += 1)
                    R + le < 0 || m <= R + le || ce == 0 && le == 0 || z == b.isDark(P + ce, R + le) && (Z += 1);
              Z > 5 && (D += 3 + Z - 5);
            }
          for (var P = 0; P < m - 1; P += 1)
            for (var R = 0; R < m - 1; R += 1) {
              var ye = 0;
              b.isDark(P, R) && (ye += 1), b.isDark(P + 1, R) && (ye += 1), b.isDark(P, R + 1) && (ye += 1), b.isDark(P + 1, R + 1) && (ye += 1), (ye == 0 || ye == 4) && (D += 3);
            }
          for (var P = 0; P < m; P += 1)
            for (var R = 0; R < m - 6; R += 1)
              b.isDark(P, R) && !b.isDark(P, R + 1) && b.isDark(P, R + 2) && b.isDark(P, R + 3) && b.isDark(P, R + 4) && !b.isDark(P, R + 5) && b.isDark(P, R + 6) && (D += 40);
          for (var R = 0; R < m; R += 1)
            for (var P = 0; P < m - 6; P += 1)
              b.isDark(P, R) && !b.isDark(P + 1, R) && b.isDark(P + 2, R) && b.isDark(P + 3, R) && b.isDark(P + 4, R) && !b.isDark(P + 5, R) && b.isDark(P + 6, R) && (D += 40);
          for (var Re = 0, R = 0; R < m; R += 1)
            for (var P = 0; P < m; P += 1)
              b.isDark(P, R) && (Re += 1);
          var Ge = Math.abs(100 * Re / m / m - 50) / 5;
          return D += Ge * 10, D;
        }, v;
      })(), l = (function() {
        for (var y = new Array(256), E = new Array(256), k = 0; k < 8; k += 1)
          y[k] = 1 << k;
        for (var k = 8; k < 256; k += 1)
          y[k] = y[k - 4] ^ y[k - 5] ^ y[k - 6] ^ y[k - 8];
        for (var k = 0; k < 255; k += 1)
          E[y[k]] = k;
        var T = {};
        return T.glog = function(v) {
          if (v < 1)
            throw "glog(" + v + ")";
          return E[v];
        }, T.gexp = function(v) {
          for (; v < 0; )
            v += 255;
          for (; v >= 256; )
            v -= 255;
          return y[v];
        }, T;
      })();
      function u(y, E) {
        if (typeof y.length > "u")
          throw y.length + "/" + E;
        var k = (function() {
          for (var v = 0; v < y.length && y[v] == 0; )
            v += 1;
          for (var S = new Array(y.length - v + E), b = 0; b < y.length - v; b += 1)
            S[b] = y[b + v];
          return S;
        })(), T = {};
        return T.getAt = function(v) {
          return k[v];
        }, T.getLength = function() {
          return k.length;
        }, T.multiply = function(v) {
          for (var S = new Array(T.getLength() + v.getLength() - 1), b = 0; b < T.getLength(); b += 1)
            for (var m = 0; m < v.getLength(); m += 1)
              S[b + m] ^= l.gexp(l.glog(T.getAt(b)) + l.glog(v.getAt(m)));
          return u(S, 0);
        }, T.mod = function(v) {
          if (T.getLength() - v.getLength() < 0)
            return T;
          for (var S = l.glog(T.getAt(0)) - l.glog(v.getAt(0)), b = new Array(T.getLength()), m = 0; m < T.getLength(); m += 1)
            b[m] = T.getAt(m);
          for (var m = 0; m < v.getLength(); m += 1)
            b[m] ^= l.gexp(l.glog(v.getAt(m)) + S);
          return u(b, 0).mod(v);
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
        ], E = function(v, S) {
          var b = {};
          return b.totalCount = v, b.dataCount = S, b;
        }, k = {}, T = function(v, S) {
          switch (S) {
            case o.L:
              return y[(v - 1) * 4 + 0];
            case o.M:
              return y[(v - 1) * 4 + 1];
            case o.Q:
              return y[(v - 1) * 4 + 2];
            case o.H:
              return y[(v - 1) * 4 + 3];
            default:
              return;
          }
        };
        return k.getRSBlocks = function(v, S) {
          var b = T(v, S);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + v + "/errorCorrectionLevel:" + S;
          for (var m = b.length / 3, D = [], P = 0; P < m; P += 1)
            for (var R = b[P * 3 + 0], Z = b[P * 3 + 1], z = b[P * 3 + 2], ce = 0; ce < R; ce += 1)
              D.push(E(Z, z));
          return D;
        }, k;
      })(), f = function() {
        var y = [], E = 0, k = {};
        return k.getBuffer = function() {
          return y;
        }, k.getAt = function(T) {
          var v = Math.floor(T / 8);
          return (y[v] >>> 7 - T % 8 & 1) == 1;
        }, k.put = function(T, v) {
          for (var S = 0; S < v; S += 1)
            k.putBit((T >>> v - S - 1 & 1) == 1);
        }, k.getLengthInBits = function() {
          return E;
        }, k.putBit = function(T) {
          var v = Math.floor(E / 8);
          y.length <= v && y.push(0), T && (y[v] |= 128 >>> E % 8), E += 1;
        }, k;
      }, g = function(y) {
        var E = a.MODE_NUMBER, k = y, T = {};
        T.getMode = function() {
          return E;
        }, T.getLength = function(b) {
          return k.length;
        }, T.write = function(b) {
          for (var m = k, D = 0; D + 2 < m.length; )
            b.put(v(m.substring(D, D + 3)), 10), D += 3;
          D < m.length && (m.length - D == 1 ? b.put(v(m.substring(D, D + 1)), 4) : m.length - D == 2 && b.put(v(m.substring(D, D + 2)), 7));
        };
        var v = function(b) {
          for (var m = 0, D = 0; D < b.length; D += 1)
            m = m * 10 + S(b.charAt(D));
          return m;
        }, S = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return T;
      }, w = function(y) {
        var E = a.MODE_ALPHA_NUM, k = y, T = {};
        T.getMode = function() {
          return E;
        }, T.getLength = function(S) {
          return k.length;
        }, T.write = function(S) {
          for (var b = k, m = 0; m + 1 < b.length; )
            S.put(
              v(b.charAt(m)) * 45 + v(b.charAt(m + 1)),
              11
            ), m += 2;
          m < b.length && S.put(v(b.charAt(m)), 6);
        };
        var v = function(S) {
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
      }, $ = function(y) {
        var E = a.MODE_8BIT_BYTE, k = s.stringToBytes(y), T = {};
        return T.getMode = function() {
          return E;
        }, T.getLength = function(v) {
          return k.length;
        }, T.write = function(v) {
          for (var S = 0; S < k.length; S += 1)
            v.put(k[S], 8);
        }, T;
      }, M = function(y) {
        var E = a.MODE_KANJI, k = s.stringToBytesFuncs.SJIS;
        if (!k)
          throw "sjis not supported.";
        (function(S, b) {
          var m = k(S);
          if (m.length != 2 || (m[0] << 8 | m[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var T = k(y), v = {};
        return v.getMode = function() {
          return E;
        }, v.getLength = function(S) {
          return ~~(T.length / 2);
        }, v.write = function(S) {
          for (var b = T, m = 0; m + 1 < b.length; ) {
            var D = (255 & b[m]) << 8 | 255 & b[m + 1];
            if (33088 <= D && D <= 40956)
              D -= 33088;
            else if (57408 <= D && D <= 60351)
              D -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + D;
            D = (D >>> 8 & 255) * 192 + (D & 255), S.put(D, 13), m += 2;
          }
          if (m < b.length)
            throw "illegal char at " + (m + 1);
        }, v;
      }, _ = function() {
        var y = [], E = {};
        return E.writeByte = function(k) {
          y.push(k & 255);
        }, E.writeShort = function(k) {
          E.writeByte(k), E.writeByte(k >>> 8);
        }, E.writeBytes = function(k, T, v) {
          T = T || 0, v = v || k.length;
          for (var S = 0; S < v; S += 1)
            E.writeByte(k[S + T]);
        }, E.writeString = function(k) {
          for (var T = 0; T < k.length; T += 1)
            E.writeByte(k.charCodeAt(T));
        }, E.toByteArray = function() {
          return y;
        }, E.toString = function() {
          var k = "";
          k += "[";
          for (var T = 0; T < y.length; T += 1)
            T > 0 && (k += ","), k += y[T];
          return k += "]", k;
        }, E;
      }, C = function() {
        var y = 0, E = 0, k = 0, T = "", v = {}, S = function(m) {
          T += String.fromCharCode(b(m & 63));
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
        return v.writeByte = function(m) {
          for (y = y << 8 | m & 255, E += 8, k += 1; E >= 6; )
            S(y >>> E - 6), E -= 6;
        }, v.flush = function() {
          if (E > 0 && (S(y << 6 - E), y = 0, E = 0), k % 3 != 0)
            for (var m = 3 - k % 3, D = 0; D < m; D += 1)
              T += "=";
        }, v.toString = function() {
          return T;
        }, v;
      }, q = function(y) {
        var E = y, k = 0, T = 0, v = 0, S = {};
        S.read = function() {
          for (; v < 8; ) {
            if (k >= E.length) {
              if (v == 0)
                return -1;
              throw "unexpected end of file./" + v;
            }
            var m = E.charAt(k);
            if (k += 1, m == "=")
              return v = 0, -1;
            if (m.match(/^\s$/))
              continue;
            T = T << 6 | b(m.charCodeAt(0)), v += 6;
          }
          var D = T >>> v - 8 & 255;
          return v -= 8, D;
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
        return S;
      }, G = function(y, E) {
        var k = y, T = E, v = new Array(y * E), S = {};
        S.setPixel = function(P, R, Z) {
          v[R * k + P] = Z;
        }, S.write = function(P) {
          P.writeString("GIF87a"), P.writeShort(k), P.writeShort(T), P.writeByte(128), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(255), P.writeByte(255), P.writeByte(255), P.writeString(","), P.writeShort(0), P.writeShort(0), P.writeShort(k), P.writeShort(T), P.writeByte(0);
          var R = 2, Z = m(R);
          P.writeByte(R);
          for (var z = 0; Z.length - z > 255; )
            P.writeByte(255), P.writeBytes(Z, z, 255), z += 255;
          P.writeByte(Z.length - z), P.writeBytes(Z, z, Z.length - z), P.writeByte(0), P.writeString(";");
        };
        var b = function(P) {
          var R = P, Z = 0, z = 0, ce = {};
          return ce.write = function(le, ye) {
            if (le >>> ye)
              throw "length over";
            for (; Z + ye >= 8; )
              R.writeByte(255 & (le << Z | z)), ye -= 8 - Z, le >>>= 8 - Z, z = 0, Z = 0;
            z = le << Z | z, Z = Z + ye;
          }, ce.flush = function() {
            Z > 0 && R.writeByte(z);
          }, ce;
        }, m = function(P) {
          for (var R = 1 << P, Z = (1 << P) + 1, z = P + 1, ce = D(), le = 0; le < R; le += 1)
            ce.add(String.fromCharCode(le));
          ce.add(String.fromCharCode(R)), ce.add(String.fromCharCode(Z));
          var ye = _(), Re = b(ye);
          Re.write(R, z);
          var Ge = 0, Ke = String.fromCharCode(v[Ge]);
          for (Ge += 1; Ge < v.length; ) {
            var St = String.fromCharCode(v[Ge]);
            Ge += 1, ce.contains(Ke + St) ? Ke = Ke + St : (Re.write(ce.indexOf(Ke), z), ce.size() < 4095 && (ce.size() == 1 << z && (z += 1), ce.add(Ke + St)), Ke = St);
          }
          return Re.write(ce.indexOf(Ke), z), Re.write(Z, z), Re.flush(), ye.toByteArray();
        }, D = function() {
          var P = {}, R = 0, Z = {};
          return Z.add = function(z) {
            if (Z.contains(z))
              throw "dup key:" + z;
            P[z] = R, R += 1;
          }, Z.size = function() {
            return R;
          }, Z.indexOf = function(z) {
            return P[z];
          }, Z.contains = function(z) {
            return typeof P[z] < "u";
          }, Z;
        };
        return S;
      }, N = function(y, E, k) {
        for (var T = G(y, E), v = 0; v < E; v += 1)
          for (var S = 0; S < y; S += 1)
            T.setPixel(S, v, k(S, v));
        var b = _();
        T.write(b);
        for (var m = C(), D = b.toByteArray(), P = 0; P < D.length; P += 1)
          m.writeByte(D[P]);
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
  })(Bs)), Bs.exports;
}
var z2 = U2();
const V2 = /* @__PURE__ */ H2(z2), G2 = ["width", "height", "viewBox"], K2 = ["width", "height"], Y2 = ["d"], J2 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = B(() => {
      const s = V2(0, "M");
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
      }, null, 8, K2),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Y2)
    ], 8, G2));
  }
}, vx = /* @__PURE__ */ J(J2, [["__scopeId", "data-v-489f0852"]]), Z2 = {
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
}, yx = /* @__PURE__ */ J(Z2, [["__scopeId", "data-v-47e67f04"]]), wx = Qi(() => import("./VoiceFigure-4pttv39G.js").then((e) => e.V)), kx = "1.0.0", bx = "3.5";
export {
  Ll as $,
  Me as A,
  Ae as B,
  R4 as C,
  Qn as D,
  st as E,
  T4 as F,
  ky as G,
  b5 as H,
  E4 as I,
  Ey as J,
  Mt as K,
  ey as L,
  Aa as M,
  Ry as N,
  _y as O,
  Xn as P,
  G5 as Q,
  e5 as R,
  In as S,
  X5 as T,
  Vb as U,
  Se as V,
  Pn as W,
  zb as X,
  Ub as Y,
  Bl as Z,
  J as _,
  Nb as a,
  p4 as a$,
  Ty as a0,
  t5 as a1,
  n5 as a2,
  Ce as a3,
  f5 as a4,
  h5 as a5,
  bt as a6,
  s5 as a7,
  S5 as a8,
  Sb as a9,
  i4 as aA,
  U5 as aB,
  Hv as aC,
  C5 as aD,
  O5 as aE,
  I4 as aF,
  ki as aG,
  Z5 as aH,
  mn as aI,
  Tb as aJ,
  Ab as aK,
  b4 as aL,
  pn as aM,
  S4 as aN,
  k5 as aO,
  z5 as aP,
  V5 as aQ,
  H5 as aR,
  sn as aS,
  kt as aT,
  _b as aU,
  R0 as aV,
  F5 as aW,
  Xb as aX,
  yi as aY,
  Bt as aZ,
  jt as a_,
  g4 as aa,
  $4 as ab,
  Bb as ac,
  Gb as ad,
  Kb as ae,
  u5 as af,
  d5 as ag,
  m5 as ah,
  qb as ai,
  Oo as aj,
  a5 as ak,
  M5 as al,
  N4 as am,
  D5 as an,
  L5 as ao,
  B5 as ap,
  p5 as aq,
  l5 as ar,
  i5 as as,
  c5 as at,
  J5 as au,
  $5 as av,
  _5 as aw,
  j4 as ax,
  Vt as ay,
  E5 as az,
  Uy as b,
  P4 as b$,
  gy as b0,
  M4 as b1,
  t4 as b2,
  e4 as b3,
  sv as b4,
  oi as b5,
  h4 as b6,
  x5 as b7,
  ns as b8,
  it as b9,
  s4 as bA,
  c4 as bB,
  dt as bC,
  Q5 as bD,
  u4 as bE,
  A5 as bF,
  P5 as bG,
  T5 as bH,
  Oe as bI,
  w5 as bJ,
  d4 as bK,
  G4 as bL,
  K4 as bM,
  $b as bN,
  N0 as bO,
  v5 as bP,
  a4 as bQ,
  Db as bR,
  L4 as bS,
  n4 as bT,
  o4 as bU,
  r4 as bV,
  g5 as bW,
  Uv as bX,
  y5 as bY,
  R5 as bZ,
  B4 as b_,
  l4 as ba,
  xs as bb,
  ir as bc,
  F4 as bd,
  U4 as be,
  Y5 as bf,
  k4 as bg,
  Mb as bh,
  N5 as bi,
  W4 as bj,
  o5 as bk,
  r5 as bl,
  Wb as bm,
  Qb as bn,
  Ob as bo,
  y4 as bp,
  Pb as bq,
  jb as br,
  Hb as bs,
  q5 as bt,
  A0 as bu,
  _4 as bv,
  Sy as bw,
  Fb as bx,
  Ib as by,
  j5 as bz,
  Ve as c,
  gx as c$,
  Cb as c0,
  Eb as c1,
  I5 as c2,
  z4 as c3,
  Ra as c4,
  V4 as c5,
  Li as c6,
  w4 as c7,
  Jb as c8,
  Yb as c9,
  bx as cA,
  ub as cB,
  lx as cC,
  Js as cD,
  yb as cE,
  Ag as cF,
  Rt as cG,
  oa as cH,
  ba as cI,
  ob as cJ,
  db as cK,
  kl as cL,
  mx as cM,
  ib as cN,
  vx as cO,
  ax as cP,
  Gl as cQ,
  eb as cR,
  kb as cS,
  Nw as cT,
  qr as cU,
  hb as cV,
  Pt as cW,
  W1 as cX,
  pb as cY,
  tb as cZ,
  ln as c_,
  I0 as ca,
  Rb as cb,
  $y as cc,
  W5 as cd,
  Sa as ce,
  Pv as cf,
  K5 as cg,
  Gt as ch,
  Tt as ci,
  sb as cj,
  rx as ck,
  pe as cl,
  Yn as cm,
  ab as cn,
  Kh as co,
  px as cp,
  xb as cq,
  Om as cr,
  Bn as cs,
  Y4 as ct,
  Q2 as cu,
  It as cv,
  cb as cw,
  ge as cx,
  ix as cy,
  kx as cz,
  nv as d,
  Pi as d0,
  fb as d1,
  lt as d2,
  mb as d3,
  ss as d4,
  wx as d5,
  yx as d6,
  Pr as d7,
  ex as d8,
  s1 as d9,
  zw as dA,
  Zr as dB,
  nx as dC,
  Wm as dD,
  sx as dE,
  zn as dF,
  ux as dG,
  a1 as da,
  hx as db,
  dx as dc,
  fx as dd,
  bb as de,
  wb as df,
  vb as dg,
  Z4 as dh,
  J4 as di,
  bg as dj,
  cw as dk,
  nb as dl,
  lb as dm,
  Q4 as dn,
  tx as dp,
  Ue as dq,
  rb as dr,
  X4 as ds,
  gb as dt,
  ut as du,
  uw as dv,
  ox as dw,
  iw as dx,
  cx as dy,
  Nr as dz,
  Fe as e,
  E0 as f,
  Zb as g,
  q4 as h,
  an as i,
  A4 as j,
  H4 as k,
  v4 as l,
  C4 as m,
  Yy as n,
  x4 as o,
  Lb as p,
  Ca as q,
  Ri as r,
  Bi as s,
  Pe as t,
  O4 as u,
  ov as v,
  D4 as w,
  f4 as x,
  m4 as y,
  vn as z
};
