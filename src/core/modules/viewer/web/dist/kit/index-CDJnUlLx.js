/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ge, unref as j, renderSlot as ue, createElementVNode as v, normalizeClass as Z, Fragment as G, renderList as te, defineComponent as ti, Comment as ni, h as Gn, cloneVNode as ai, createBlock as U, withCtx as P, createVNode as D, toDisplayString as k, createCommentVNode as A, inject as Ae, useAttrs as Kn, computed as B, ref as R, resolveDynamicComponent as St, mergeProps as Ge, createTextVNode as Q, watch as me, onUnmounted as Be, onMounted as Le, Teleport as us, useId as ds, resolveDirective as si, withDirectives as tt, reactive as Yn, shallowRef as Ve, nextTick as ht, Transition as Dt, withModifiers as xe, TransitionGroup as Zo, shallowReactive as oi, isRef as qs, onBeforeUnmount as _t, onScopeDispose as fs, resolveComponent as li, useModel as Pa, getCurrentInstance as ri, mergeModels as qa, getCurrentScope as Xo, provide as ii, onErrorCaptured as ci, toHandlers as ui, createSlots as di, vShow as Qo, useSlots as fi, withKeys as Xt, vModelText as Fa, defineAsyncComponent as hi } from "vue";
function el(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, mi = 1600, pi = {
  __name: "Shimmer",
  setup(e) {
    const t = el(mi);
    return (n, a) => (c(), h("span", {
      class: "shimmer",
      style: ge(j(t))
    }, null, 4));
  }
}, Vt = /* @__PURE__ */ Y(pi, [["__scopeId", "data-v-6c018b03"]]), gi = { class: "skeleton-line" }, vi = 2e3, yi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = el(vi);
    return (n, a) => (c(), h("span", gi, [
      ue(n.$slots, "default", {}, void 0, !0),
      v("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(G, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...j(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, mt = /* @__PURE__ */ Y(yi, [["__scopeId", "data-v-484fe8a0"]]), jt = ti({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ni);
      return a.length !== 1 ? Gn(G, { key: n }, a) : a[0].key == null ? ai(a[0], { key: n }) : a[0];
    };
  }
}), bi = ["aria-label"], wi = ["aria-label"], ki = ["aria-label"], xi = ["aria-label"], $i = ["aria-label"], Mi = ["aria-label"], Si = ["aria-label"], _i = {
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
    ], l = ["94%", "88%", "91%", "62%"].map((i) => ({ width: i, height: 10 })), r = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (i, u) => (c(), U(jt, { value: e.shape }, {
      messages: P(() => [
        v("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(G, null, te(t, (d) => D(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, bi)
      ]),
      older: P(() => [
        v("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(t.slice(0, 3), (d) => (c(), U(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, wi)
      ]),
      cards: P(() => [
        v("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(G, null, te(n, (f) => D(mt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ki)
      ]),
      file: P(() => [
        v("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            D(mt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(G, null, te(s, (f) => D(mt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, xi)
      ]),
      page: P(() => [
        v("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          D(mt, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(G, null, te(e.count, (d) => (c(), U(mt, {
            key: d,
            bars: j(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, $i)
      ]),
      text: P(() => [
        v("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), U(mt, {
            key: d,
            bars: j(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Mi)
      ]),
      default: P(() => [
        v("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), U(mt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Si)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Et = /* @__PURE__ */ Y(_i, [["__scopeId", "data-v-ef519c5f"]]), Ei = {
  key: 1,
  class: "empty-state titled"
}, Ai = { class: "empty-state-title" }, Ci = { class: "empty-state-text" }, Oi = {
  key: 2,
  class: "empty-state"
}, Ti = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), U(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Ei, [
      v("p", Ai, k(e.title), 1),
      v("p", Ci, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Oi, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ Y(Ti, [["__scopeId", "data-v-b27e89b0"]]), Ri = { class: "fold-group" }, Ii = ["aria-expanded"], Bi = { class: "fold-label" }, Li = {
  key: 0,
  class: "fold-count"
}, Ni = {
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
    return (a, s) => (c(), h("div", Ri, [
      v("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        v("span", Bi, k(e.label), 1),
        e.count !== "" ? (c(), h("span", Li, k(e.count), 1)) : A("", !0),
        v("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Ii),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, k5 = /* @__PURE__ */ Y(Ni, [["__scopeId", "data-v-9ef1865c"]]), Di = Symbol("open-view"), Te = Symbol.for("journal.window-context");
function Ke() {
  const e = Ae(Te, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const tl = 120;
var Yo;
const ia = globalThis[Yo = Symbol.for("journal.pressed")] ?? (globalThis[Yo] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function ji(e = 0) {
  const t = ia.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, ia.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, ia.disabledHere.delete(t) && (t.disabled = !1);
  };
}
const Pi = ["stroke-width", "innerHTML"], ye = {
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
    return (o, l) => (c(), h("svg", {
      class: "ico",
      style: ge({
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
    }, null, 12, Pi));
  }
}, qi = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Fi = /* @__PURE__ */ Y(qi, [["__scopeId", "data-v-eb453d6f"]]), Wi = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Kn(), a = B(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = R(!1), o = B(() => t.busy || s.value), l = Ae(Te, null), r = B(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, tl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), U(St(e.href ? "a" : "button"), Ge(a.value, {
      type: e.href ? void 0 : j(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: P(() => [
        v("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), U(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          ue(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), U(Fi, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ Y(Wi, [["__scopeId", "data-v-ededdadf"]]), Hi = {
  key: 0,
  class: "more-items"
}, Ui = {
  key: 0,
  role: "alert"
}, zi = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (c(), h("div", Hi, [
      e.failure ? (c(), h("p", Ui, k(e.failure), 1)) : A("", !0),
      e.more ? (c(), U(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: P(() => [
          Q(k(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : A("", !0)
    ])) : A("", !0);
  }
}, Jn = /* @__PURE__ */ Y(zi, [["__scopeId", "data-v-10464014"]]), Vi = {
  key: 0,
  class: "resource-links",
  "data-resource-links": ""
}, Gi = ["data-kind"], Ki = { class: "count" }, Yi = ["disabled", "onClick"], Ji = { class: "type" }, Zi = { class: "title" }, Xi = { class: "relations" }, Qi = {
  key: 0,
  class: "unavailable"
}, ec = ["data-kind", "onClick"], tc = { key: 0 }, nc = {
  __name: "ResourceLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    shownPerKind: { type: Number, default: 3 },
    changes: { type: Number, default: 0 },
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R([]), o = R(null), l = R(!1), r = R("");
    let i = 0;
    const u = (b) => b.endpoint.model === "doc" && b.endpoint.id === n.documentId, d = B(() => [...s.value].sort((b, S) => Number(u(S)) - Number(u(b)))), f = R(/* @__PURE__ */ new Set()), m = (b) => u(b) ? "design" : b.endpoint.model, p = (b) => b === "design" ? "Design document" : b.replaceAll("_", " "), y = B(() => {
      const b = /* @__PURE__ */ new Map();
      for (const S of d.value) b.set(m(S), [...b.get(m(S)) ?? [], S]);
      return [...b].map(([S, w]) => ({ kind: S, items: w, shown: f.value.has(S) ? w : w.slice(0, n.shownPerKind) }));
    }), $ = (b) => f.value = /* @__PURE__ */ new Set([...f.value, b]), M = (b) => b.endpoint.unavailable || !b.endpoint.open_ref, O = (b) => ({ [n.linkAttribute]: !0, "data-link-model": b.endpoint.model, "data-link-id": b.endpoint.id });
    async function F(b = 1) {
      const S = ++i;
      l.value = !0, r.value = "";
      const w = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(b), "--page-size", String(n.pageSize)];
      n.documentId && w.push("--first-counterpart", `doc:${n.documentId}`);
      try {
        const I = await n.read(w);
        if (S !== i) return;
        if (!I.ok) {
          r.value = I.error;
          return;
        }
        const _ = I.value.counterparts ?? [], L = b === 1 ? _ : [...s.value, ..._];
        s.value = [...new Map(L.map((x) => [`${x.endpoint.model}:${x.endpoint.id}`, x])).values()], o.value = I.value.next_page ?? null;
      } catch (I) {
        S === i && (r.value = I.message);
      } finally {
        S === i && (l.value = !1);
      }
    }
    function W(b) {
      if (M(b)) return;
      const [S, w] = b.endpoint.open_ref.split(":");
      a("open", { table: S, id: Number(w) });
    }
    const C = () => !l.value && o.value && F(o.value);
    return me(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}`, () => {
      s.value = [], o.value = null, f.value = /* @__PURE__ */ new Set(), F();
    }, { immediate: !0 }), (b, S) => d.value.length || l.value || r.value || e.empty ? (c(), h("section", Vi, [
      (c(!0), h(G, null, te(y.value, (w) => (c(), h(G, {
        key: w.kind
      }, [
        v("h4", {
          class: "kind",
          "data-link-kind": "",
          "data-kind": w.kind
        }, [
          Q(k(p(w.kind)) + " ", 1),
          v("span", Ki, k(w.items.length) + k(o.value ? "+" : ""), 1)
        ], 8, Gi),
        (c(!0), h(G, null, te(w.shown, (I) => (c(), h("button", Ge({
          key: `${I.endpoint.model}:${I.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, O(I), {
          disabled: M(I),
          onClick: (_) => W(I)
        }), [
          v("span", Ji, k(u(I) ? "Design document" : I.endpoint.model.replaceAll("_", " ")) + " " + k(I.endpoint.id), 1),
          v("span", Zi, k(I.endpoint.title), 1),
          v("span", Xi, k(I.relations.join(", ")), 1),
          M(I) ? (c(), h("span", Qi, "Unavailable")) : A("", !0)
        ], 16, Yi))), 128)),
        w.shown.length < w.items.length ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "show-more",
          "data-link-show-more": "",
          "data-kind": w.kind,
          onClick: (I) => $(w.kind)
        }, "Show " + k(w.items.length - w.shown.length) + " more", 9, ec)) : A("", !0)
      ], 64))), 128)),
      !d.value.length && !l.value && !r.value && e.empty ? (c(), h("p", tc, k(e.empty), 1)) : A("", !0),
      D(Jn, {
        more: !!o.value,
        loading: l.value,
        failure: r.value,
        label: "More linked items",
        onMore: C
      }, null, 8, ["more", "loading", "failure"])
    ])) : A("", !0);
  }
}, ac = /* @__PURE__ */ Y(nc, [["__scopeId", "data-v-a573b2e9"]]), sc = (e, t, n) => Math.max(t, Math.min(n, e)), oc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, nl = /* @__PURE__ */ new WeakMap(), lc = (e, t) => nl.set(e, t);
function rc(e, t) {
  for (let n = t; n; n = nl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function al(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !rc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ot = 8, ic = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = R(null), o = (g) => g ? `${g}px` : void 0, l = B(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = R({ w: 0, h: 0 }), i = R(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), f = (g) => {
      const E = g.closest(".pane, .float-window");
      return E ? d(E.getBoundingClientRect()) : u();
    }, m = (g, E) => `${Math.max(0, g ? Math.min(g, E) : E)}px`;
    function p(g, E) {
      return {
        below: g.bottom - E.bottom - a.gap - Ot,
        above: E.top - g.top - a.gap - Ot,
        across: g.right - g.left - 2 * Ot
      };
    }
    function y(g) {
      const E = f(a.anchor), T = p(E, g);
      return r.value.w <= T.across && r.value.h <= Math.max(T.below, T.above) ? E : u();
    }
    const $ = B(() => {
      if (!i.value) return l.value;
      const g = i.value, E = y(g), T = p(E, g), { w: N, h: J } = r.value, ee = a.align === "auto" ? g.left + g.right > E.left + E.right : a.align === "right", re = sc(ee ? g.right - N : g.left, E.left + Ot, Math.max(E.left + Ot, E.right - N - Ot)), fe = J > T.below && T.above > T.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: m(a.maxHeight, T.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: m(a.maxHeight, T.below) };
      return { ...l.value, ...fe, left: `${re}px`, maxWidth: m(a.maxWidth, T.across) };
    }), M = n, O = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function F(g) {
      const E = O(), T = E.indexOf(document.activeElement);
      E[(T + g + E.length) % E.length].focus();
    }
    const W = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => M("close") }, C = (g) => W[g.key] && (g.preventDefault(), W[g.key]()), b = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let S = 0;
    const w = new ResizeObserver(() => {
      cancelAnimationFrame(S), S = requestAnimationFrame(b);
    });
    al(s, (g) => a.anchor && !a.anchor.contains(g.target) && M("close"));
    const I = (g, E) => ["top", "left", "right", "bottom"].some((T) => Math.abs(g[T] - E[T]) > 1), _ = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let L = 0;
    function x() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || _(g)) return M("close");
        I(g, i.value) && (i.value = g);
      }
      L = requestAnimationFrame(x);
    }
    return Le(() => {
      a.anchor && s.value && lc(s.value, a.anchor), b(), s.value && w.observe(s.value), !a.plain && O()[0] && O()[0].focus(), x();
    }), Be(() => {
      w.disconnect(), cancelAnimationFrame(L), cancelAnimationFrame(S);
    }), t({ element: s }), (g, E) => (c(), U(us, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ge({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: $.value,
        onKeydown: C
      }), [
        ue(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Zn = /* @__PURE__ */ Y(ic, [["__scopeId", "data-v-3d203970"]]), cc = { class: "split-button" }, uc = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = R(null), s = R(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", cc, [
      D(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: P(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      v("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        D(de, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: P(() => [
            D(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), U(Zn, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: P(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : A("", !0)
    ]));
  }
}, dc = /* @__PURE__ */ Y(uc, [["__scopeId", "data-v-c258494d"]]), fc = ["aria-checked", "aria-haspopup", "onClick"], hc = {
  key: 0,
  class: "segmented-dot"
}, mc = {
  key: 1,
  class: "segmented-note"
}, pc = {
  key: 2,
  class: "segmented-count"
}, gc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = ds();
    return (s, o) => {
      const l = si("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(G, null, te(e.options, (r) => tt((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", hc)) : A("", !0),
          Q(" " + k(r.label) + " ", 1),
          r.note ? (c(), h("small", mc, k(r.note), 1)) : A("", !0),
          r.count !== void 0 ? (c(), h("em", pc, k(r.count), 1)) : A("", !0)
        ], 10, fc)), [
          [l, r.tip || r.title, `${j(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Xn = /* @__PURE__ */ Y(gc, [["__scopeId", "data-v-c89bc92d"]]), sl = typeof document < "u" && document.documentElement.classList.contains("phone");
function Wa(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ol(e = window) {
  if (!Wa(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Wa(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ha = "journal.stale-build-reload", vc = 'script[type="module"][src*="/assets/index-"]', Fs = (e) => {
  var t;
  return ((t = e.querySelector(vc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function yc(e = document, t = (a, s) => Me.quietRead(a, s), n = () => ol(window)) {
  const a = Fs(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Fs(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ca = "";
function bc(e, t = () => ol(window)) {
  if (!e) return !1;
  const n = !!ca && ca !== e;
  return ca = e, n && t(), n;
}
const wc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function kc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ha) === e.message) return !1;
    t.setItem(Ha, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function xc(e = window.sessionStorage) {
  try {
    e.removeItem(Ha);
  } catch {
    return;
  }
}
const $c = 2e3, Mc = 3e4, We = Yn({ starting: !1, external: !1, late: !1, offline: !1 }), ll = () => We.starting, Sc = 3;
let gn = 0, Ua = 0, rl = 0, il = [];
async function _c() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: We.external };
  }
}
let Ws = null;
const Ec = () => Ws ?? (Ws = _c().finally(() => Ws = null));
function Ac() {
  clearTimeout(Ua), clearTimeout(rl), Ua = 0, Object.assign(We, { starting: !1, external: !1, late: !1, offline: !1 }), il.splice(0).forEach((e) => e()), yc();
}
async function Cc() {
  We.offline = !navigator.onLine;
  const e = await Ec();
  if (We.external = e.updating, gn = !e.restarting && !e.updating && e.reachable ? gn + 1 : 0, gn < Sc) return;
  gn = 0, (!bc(e.started_at) || Wa()) && Ac();
}
function cl() {
  Ua = setTimeout(async () => {
    await Cc(), We.starting && cl();
  }, $c);
}
function Oc() {
  We.starting || (We.starting = !0, We.offline = !navigator.onLine, cl(), rl = setTimeout(() => We.late = !0, Mc));
}
const Tc = () => We.starting ? new Promise((e) => il.push(e)) : Promise.resolve();
function ul(e, t) {
  let n = 0, a = null, s = !1, o = !1;
  const l = () => {
    s = !1, n = Date.now(), o && (o = !1, i());
  }, r = () => {
    a = null;
    const u = e();
    n = Date.now(), u instanceof Promise && (s = !0, u.catch(() => {
    }).finally(l));
  }, i = () => {
    if (s) {
      o = !0;
      return;
    }
    if (a) return;
    const u = t - (Date.now() - n);
    u <= 0 ? r() : a = setTimeout(r, u);
  };
  return i.cancel = () => {
    clearTimeout(a), a = null, o = !1;
  }, i;
}
function Rc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Ic {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = ul(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Rc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const st = "viewer.shell", vn = 2e4, Bc = 4, Hs = "/api/read-lines", Lc = 5e3, Nc = 403, Us = "/api/repeated-lines", Dc = 10, jc = 2e3, Pc = 3e5, x5 = 6e5, yn = 6, qc = 500, Fc = "/journal/summary", zs = "/api/server-state", Wc = 2e4, bn = sl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Hc = (e) => e.split("?")[0].endsWith(Fc), za = (e, t) => Object.assign(new Error(t), { status: e });
async function Uc(e, t, n = za) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const zc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Vc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Vs = (e) => e.split(" ").slice(0, 2).join(" "), Ze = "read", Rt = "write", Gc = "stream";
class Kc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = yn;
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
      logical_commands: Object.entries(n).filter(([o]) => !o.startsWith("/")).reduce((o, [, l]) => o + l, 0),
      joined_callers: a.reduce((o, l) => o + l.joined_callers, 0),
      trailing_reads: a.reduce((o, l) => o + l.trailing_reads, 0),
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Vs(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < jc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Dc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Us, { method: "POST", headers: { ...bn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Us, kind: Rt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = ji(n ? tl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Vc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Rt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = vn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Oc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Bc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
    try {
      return await t();
    } finally {
      const n = this.readsWaiting.shift();
      n ? n() : this.readsFlying -= 1;
    }
  }
  // whether a line only reads, as the server knows its command: a line the server has not called a read is a write, which is never joined
  async isRead(t) {
    return this.readLines ?? (this.readLines = this.answeredReadLines()), this.knownReads = await this.readLines, this.knownReads.has(t.slice(0, 2).join(" "));
  }
  // the same, at once and without asking: a line is taken for a write until the server's list of reads has come
  knownRead(t) {
    var n;
    return !!((n = this.knownReads) != null && n.has(t.slice(0, 2).join(" ")));
  }
  answeredReadLines() {
    return this.out(Hs, { headers: bn }, [{ window: st, line: Hs, kind: Ze }], Lc).then(async (t) => {
      if (t.status === Nc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw za(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Ic(
      (l, r) => n(l, s ? this.readAttribution(r) : void 0),
      () => this.joinedReads.delete(t),
      (l, r) => {
        s && this.trackRead(s, l, r);
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Vs(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
    a === "asked" && s.callers > 1 && (r.joined_callers += 1), a === "sent" && s.trailingOf && (r.trailing_reads += 1), o.set(l, r), this.joinCounts.set(t, o), !(a !== "answered" || !this.recording) && (this.readReceipts.push(this.readAttribution(s)), this.receiptTimer ?? (this.receiptTimer = setTimeout(() => this.flushReadReceipts(), 50)));
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
      this.tries = yn;
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
  async reach(t, n, a, s, o, l = {}) {
    const r = a instanceof FormData, i = { method: t, headers: { ...bn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: zc(a) }, u = s || (r ? Pc : vn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Ze }], u)) : await this.sent(n, i, [{ window: st, line: n, kind: Rt }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, qc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = yn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Uc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: st, line: t, kind: Ze }], vn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: bn });
    if (!n.ok) throw za(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, yn, o).then((r) => (this.written(n), r)) : ll() && !Hc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: st, line: t, kind: Gc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(zs, { cache: "no-store" }, [{ window: st, line: zs, kind: Ze }], Wc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = vn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Ze : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ua = Symbol.for("journal.transport"), Me = globalThis[ua] ?? (globalThis[ua] = new Kc()), Yc = 0, Jc = "/api/lines", Zc = "/api/line", Gs = 5e3, Ks = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Ys = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), da = (e) => JSON.stringify(e.line), Js = () => new DOMException("cancelled", "AbortError");
class Xc {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(da(t))) {
        Me.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Rt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), Yc));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Js())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Js()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(Jc, Ks({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Ys(r.body, Ze)), Gs);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((r, i) => r.resolve(l[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Me.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var r;
        return (r = o.signal) == null ? void 0 : r.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, Ze), Date.now() - n < Gs ? this.slow.delete(da(t.body)) : this.slow.add(da(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(Zc, Ks(t.body, t.signal), [Ys(t.body, n)], n === Ze ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const dl = new Xc(), Qc = "/api/window";
function eu(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Qc}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (u) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: u, headers: r }, [{ window: e, line: l, kind: Ze }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const tu = 150, nu = () => tu;
function hs(e, t, n = nu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class au {
  constructor() {
    this.following = Ve([]), this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, a, s = () => !0) {
    const o = { window: t, patterns: n, heard: a, visible: s };
    return this.following.value = [...this.follows, o], () => this.following.value = this.follows.filter((l) => l !== o);
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
    Me.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => ms(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ms(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const fl = /* @__PURE__ */ new Map();
class su {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ve({ buttons: [], missing: {} }), this.loading = Ve(!1), this.loaded = Ve(!1), this.failed = Ve(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Me.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
      runs_missing: n.map(({ label: o, line: l }) => `${o}: ${l}`).join(", ")
    }) ? (await this.load(), !((s = this.offers.value.missing[t]) != null && s.length)) : !1 : !0;
  }
}
function $5(e, t) {
  const n = new su(e, t);
  return fl.set(e, n), n.load().catch(() => {
  }), n;
}
const ps = (e) => fl.get(e);
function ou(e, t, n) {
  const a = ps(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function lu(e, t) {
  if (!e) return !0;
  const n = ps(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const ru = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let hl = {};
async function M5(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (hl = (await t.json()).states);
}
const gs = (e, t) => {
  var n;
  return (n = hl[e]) == null ? void 0 : n[t];
}, ml = (e, t) => {
  var n;
  return ((n = gs(e, t)) == null ? void 0 : n.label) ?? ru(t);
}, pl = (e, t) => {
  var n;
  return ((n = gs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, iu = (e, t) => {
  var n;
  return ((n = gs(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, cu = Symbol("pane-page"), uu = Symbol("inspector-host"), gl = { 1: "refused", 2: "usage", 3: "fault" }, du = 100, fu = 50, hu = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, mu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function pu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = R({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: p = [], sources: y = [], links: $ = {}, search: M = {}, readOnly: O = !1, shared: F = null }) {
  const W = /* @__PURE__ */ new Map(), C = new AbortController(), b = R(!1), S = performance.now();
  let w = 0, I = 0, _ = () => {
  };
  const L = new Promise((J) => _ = J);
  C.signal.addEventListener("abort", _, { once: !0 });
  const x = () => {
    clearTimeout(I), I = setTimeout(() => {
      w === 0 && hs(S, () => {
        b.value = !0, _();
      });
    }, fu);
  }, g = (J, ee) => (w += 1, it(e, J, t, C.signal, ee).finally(() => {
    w -= 1, x();
  })), E = (J, ee) => (x(), L.then(() => C.signal.aborted ? nt : it(e, J, t, C.signal, ee))), T = ({ only: J = [], state: ee = {} } = {}) => (w += 1, vu(() => eu(e, t, J, ee, C.signal), C.signal).finally(() => {
    w -= 1, x();
  })), N = (J, { unbatched: ee = !1, deferred: re = !1 } = {}) => {
    const ie = W.get(J);
    if (ie && performance.now() - ie.at < du) return ie.answer;
    const fe = re && !b.value ? E(J, ee) : g(J, ee);
    return W.set(J, { answer: fe, at: performance.now() }), fe;
  };
  return {
    answered: b,
    settle: x,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: B(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: p,
    sources: y,
    links: $,
    search: M,
    readOnly: O,
    shared: F,
    read: N,
    readKeys: T,
    run: (J) => it(e, J, t, C.signal),
    upload: (J) => bu(J, e, C.signal),
    cancel: () => C.abort(),
    signal: C.signal,
    subscriptions: l,
    follow: (J, ee) => l.follow(e, J.filter((re) => o.some((ie) => ms(ie, re))), (re) => {
      W.clear(), ee(re);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (J) => B(() => {
      var ee;
      return i.value[J] ?? ((ee = u.find((re) => re.key === J)) == null ? void 0 : ee.default);
    }),
    setting: async (J, ee) => {
      const re = await N(`window setting ${e} ${J}`);
      return re.ok ? re.value.value : ee;
    },
    setOption: f,
    keep: (J, ee) => it(e, ["window", "save-setting", e, J, JSON.stringify(ee)], t, C.signal)
  };
}
function vl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nt = { ok: !1, failure: "cancelled", error: "" }, vs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function yl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? nt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: gl[n.code] || "fault", error: vl(n.error) };
  } catch {
    return t != null && t.aborted ? nt : { ok: !1, failure: "unreachable", error: vs };
  }
}
const gu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: gl[e.code] || "fault", error: vl(e.error) };
async function vu(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, gu(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: vs };
  }
}
async function bl(e, t, n) {
  const a = await yl(() => dl.read(e, t, n), t);
  return a.failure !== "unreachable" || !ll() ? a : (await Tc(), t.aborted ? nt : bl(e, t, n));
}
function it(e, t, n, a = void 0, s = !1) {
  return Me.held(() => yu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : ys(t)));
}
async function yu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : ys(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => bl({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : yl(() => dl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function bu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? nt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: vs };
  }
}
function ys(e) {
  return [...e.matchAll(hu)].map(([t]) => t.replace(mu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const wu = (e) => `show-${e}`, S5 = (e, t, n) => e.filter((a) => {
  var s;
  return n(wu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), wl = "messages.chat", ku = {
  key: 0,
  class: "template-brief"
}, xu = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, $u = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R([]), o = R(""), l = B(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = B(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await it(wl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(G, null, [
      D(Xn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", ku, k(r.value.brief), 1)) : A("", !0),
      o.value ? (c(), h("p", xu, k(o.value), 1)) : A("", !0)
    ], 64));
  }
}, Mu = /* @__PURE__ */ Y($u, [["__scopeId", "data-v-14be8a5c"]]), Su = { class: "form-field" }, _u = { class: "form-field-head" }, Eu = ["for"], Au = {
  key: 0,
  class: "form-field-aside"
}, Cu = {
  key: 0,
  class: "form-field-help"
}, Ou = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Su, [
      v("div", _u, [
        v("label", {
          class: "form-field-label",
          for: t.$props.for
        }, k(e.label), 9, Eu),
        t.$slots.aside ? (c(), h("span", Au, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", Cu, k(e.help), 1)) : A("", !0)
    ]));
  }
}, Tu = /* @__PURE__ */ Y(Ou, [["__scopeId", "data-v-dd7cdcff"]]), Va = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Ru = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Kn(), n = B(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => tt((c(), h("textarea", Ge({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [j(Va), j(t).value]
    ]);
  }
}), Iu = /* @__PURE__ */ Y(Ru, [["__scopeId", "data-v-e130a5b9"]]), Bu = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ds(), o = B(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), U(Tu, {
      label: e.field.label,
      for: j(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        D(jt, { value: o.value }, {
          choice: P(() => [
            D(Xn, {
              id: j(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            D(Mu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            D(Iu, {
              id: j(s),
              value: e.value,
              onInput: r[2] || (r[2] = (i) => a("pick", i.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, bs = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), U(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        D(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Lu(e, t, n, a = () => window) {
  Le(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Nu = (e, t = () => !0) => Lu("keydown", (n) => n.key === "Escape" && t() && e());
function kl(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = R(!1), s = B(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Nu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Du = 80, Tt = Yn([]);
function xl(e) {
  const t = Symbol("layer"), n = () => Tt.includes(t) && Tt.splice(Tt.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !Tt.includes(t) && Tt.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), B(() => Du + Math.max(0, Tt.indexOf(t)));
}
let $l = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return $l = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const ju = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Pu(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(ju)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Le(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : $l, document.addEventListener("keydown", s), ht(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const qu = ["aria-modal", "aria-label", "aria-labelledby"], Fu = {
  key: 0,
  class: "dialog-head"
}, Wu = ["id", "tabindex"], Hu = {
  key: 1,
  class: "dialog-foot"
}, Uu = 500, zu = 400, Vu = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = kl(a, n), r = xl(s), i = R(null), u = R(null), d = R(null), f = ds(), m = R(!1), p = Date.now();
    n.modal && Pu(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, zu);
    }
    function $(F) {
      !n.modal || Date.now() - p >= Uu || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const M = () => i.value && (i.value.scrollTop = i.value.scrollHeight), O = new MutationObserver(M);
    return me(i, (F) => {
      O.disconnect(), F && n.follow && (O.observe(F, { childList: !0, subtree: !0, characterData: !0 }), M());
    }), Be(() => O.disconnect()), (F, W) => (c(), U(us, { to: "body" }, [
      D(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: j(l)
      }, {
        default: P(() => [
          j(s) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: j(r) }),
            onClick: xe(y, ["self"])
          }, [
            v("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? j(f) : void 0,
              onKeydownCapture: $
            }, [
              e.bare ? A("", !0) : (c(), h("header", Fu, [
                v("h3", {
                  id: j(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, Wu),
                e.closable ? (c(), U(bs, {
                  key: 0,
                  onClick: j(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              v("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (c(), h("footer", Hu, [
                ue(F.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, qu)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ml = /* @__PURE__ */ Y(Vu, [["__scopeId", "data-v-6d1ecd98"]]), Gu = (e, t, n = {}) => ys(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function rn(e, t, n, a = {}) {
  try {
    return await lu(e.module, n) ? it(wl, Gu(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const Ku = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, fa = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], be = (e, t, n, a = {}) => ({
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
}), Qn = {
  messages: be("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: be("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: be("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: fa
  }),
  tasks: be("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: fa
  }),
  reports: be("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: be("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: be("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: be("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: be("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: be("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: be("Pin", "band", "One line pinned to the chat while it matters", { filters: fa }),
  reactions: be("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: be("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: be("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: be("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: be("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: be("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: be("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: be("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: be("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: be("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: be("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: be("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: be("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: be("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: be("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: be("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: be("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Yu = ["secrets", "plugins"], Sl = Object.keys(Qn).filter((e) => !(sl && Yu.includes(e)));
B(() => Sl.map((e) => ({ name: e, ...Qn[e] })));
const Pt = (e) => Qn[e], _l = new Map(Sl.flatMap((e) => [e, e.replace(/s$/, ""), Qn[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => _l.get(String(e).toLowerCase()) || "", El = [..._l.keys()].sort((e, t) => t.length - e.length).join("|"), Ju = {
  class: "button-form",
  "data-button-form": ""
}, Zu = {
  key: 0,
  class: "button-form-title"
}, Xu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Qu = { class: "button-form-actions" }, ed = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = R(!1), l = R(""), r = B(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = B(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = Pt(ut(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await rn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), U(Ml, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: P(() => {
        var m;
        return [
          v("div", Ju, [
            (m = e.row) != null && m.title ? (c(), h("p", Zu, k(e.row.title), 1)) : A("", !0),
            (c(!0), h(G, null, te(e.button.fields, (p) => (c(), U(Bu, {
              key: p.name,
              field: p,
              value: s.value[p.name],
              environment: e.environment,
              onPick: (y) => s.value[p.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", Xu, k(l.value), 1)) : A("", !0),
            v("div", Qu, [
              D(de, {
                small: "",
                onClick: f[0] || (f[0] = (p) => a("close"))
              }, {
                default: P(() => [...f[2] || (f[2] = [
                  Q("Cancel", -1)
                ])]),
                _: 1
              }),
              D(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: P(() => [...f[3] || (f[3] = [
                  Q("Send", -1)
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
}, td = /* @__PURE__ */ Y(ed, [["__scopeId", "data-v-f26c27a7"]]), nd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ad = {
  key: 1,
  class: "menu-item-text"
}, sd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", nd, k(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (c(), h("span", ad, [
        v("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, k(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, $t = /* @__PURE__ */ Y(sd, [["__scopeId", "data-v-fec99974"]]), od = ["aria-busy"], ld = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, rd = {
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
    const n = e, a = t, s = B(() => ps(n.environment)), o = B(
      () => {
        var y;
        return !n.readOnly && ((y = s.value) == null ? void 0 : y.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = B(() => {
      var y;
      return !n.readOnly && ((y = s.value) == null ? void 0 : y.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = B(() => n.readOnly ? [] : ou(n.environment, n.name, n.row)), u = R(null), d = R(""), f = R(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
    async function p(y) {
      if (f.value || n.readOnly) return;
      if (y.fields.length) {
        u.value = y;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const $ = await rn(y, n.row, n.environment);
      f.value = !1, d.value = $.ok ? "" : $.error;
      const M = y.label.toLowerCase() + (n.objectName && !y.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", $.ok ? "" : `Could not ${M}: ${$.error}`), $.ok && a("done");
    }
    return (y, $) => (c(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(G, { key: 0 }, [
        $[3] || ($[3] = v("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        D(de, {
          small: "",
          onClick: r
        }, {
          default: P(() => [...$[2] || ($[2] = [
            Q("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? A("", !0) : (c(), h(G, { key: 1 }, [
        (c(!0), h(G, null, te(i.value, (M) => (c(), h(G, {
          key: M.name
        }, [
          M.menu.length ? (c(), U(dc, {
            key: 0,
            small: "",
            variant: M.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": M.menu_label || "More ways",
            title: m(M),
            "data-button": M.name,
            onMain: (O) => p(M)
          }, {
            menu: P(({ close: O }) => [
              (c(!0), h(G, null, te(M.menu, (F) => (c(), U($t, {
                key: F.label,
                description: F.description,
                onClick: (W) => (O(), p({ ...M, ...F, menu: [] }))
              }, {
                default: P(() => [
                  Q(k(F.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              Q(k(M.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), U(de, {
            key: 1,
            small: "",
            variant: M.primary ? "primary" : "ghost",
            bordered: !M.primary,
            icon: M.icon,
            disabled: f.value,
            title: m(M),
            "data-button": M.name,
            onClick: (O) => p(M)
          }, {
            default: P(() => [
              Q(k(M.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", ld, k(d.value), 1)) : A("", !0),
        u.value && !e.readOnly ? (c(), U(td, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: $[0] || ($[0] = (M) => u.value = null),
          onDone: $[1] || ($[1] = (M) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : A("", !0)
      ], 64))
    ], 10, od));
  }
}, id = /* @__PURE__ */ Y(rd, [["__scopeId", "data-v-a07b49a4"]]), cd = {
  class: "running",
  "data-running-command": ""
}, ud = ["title"], dd = {
  key: "idle",
  class: "running-idle"
}, fd = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", cd, [
      D(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, ud)) : (c(), h("span", dd, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, _5 = /* @__PURE__ */ Y(fd, [["__scopeId", "data-v-d3240219"]]), hd = ["aria-checked", "aria-label", "title"], md = {
  key: 0,
  class: "switch-inner"
}, pd = {
  key: 0,
  class: "switch-word"
}, gd = {
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
      v("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", md, k(e.word), 1)) : A("", !0),
        s[1] || (s[1] = v("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", pd, k(e.word), 1)) : A("", !0)
    ], 10, hd));
  }
}, E5 = /* @__PURE__ */ Y(gd, [["__scopeId", "data-v-1bfb90f3"]]);
function Al(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Ln(e, t) {
  return Al(() => localStorage, e, t);
}
function Cl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function ws(e, t) {
  return Cl(() => localStorage, e, t);
}
function Ol(e, t) {
  me(t, (n) => ws(e, n), { deep: !0 });
}
function vd(e, t) {
  return Al(() => sessionStorage, e, t);
}
function yd(e, t) {
  return Cl(() => sessionStorage, e, t);
}
const Nn = "journal.environment", Tl = R(vd(Nn, Ln(Nn, "")));
function bd(e) {
  Tl.value = e, yd(Nn, e), ws(Nn, e);
}
const Dn = R(location.hash), Zs = Ve(null), Xs = { integrations: "mcp", library: "team" };
function wd() {
  if (!Zs.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Xs[n]) {
    location.replace(`#/${[Xs[n], ...a].join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash;
    return;
  }
  !n || Zs.value(n) || (bd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Dn.value = location.hash, wd();
});
const Ga = B(() => {
  const [e, t = ""] = Dn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [u = "", d = "", f = ""] = r.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: Tl.value,
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
}), ks = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${ks.page(e)}?open=${t}`
};
function kd(e = "", t = 0, n = "") {
  location.hash = ks.page(e, t, n);
}
const xd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Rl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(xd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function A5(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Il(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ga.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  Rl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function $d(e, t, n, a = 0, s = "") {
  if (e === Ga.value.env) return Il(t, n, a, s);
  const o = Ga.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Rl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? $d(a, s, Number(o), 0, t) : Il(s, Number(o), 0, t);
}
function Md(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = Md(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function C5(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Sd = { class: "inspector-part" }, _d = { class: "inspector-part-title" }, Ed = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", Sd, [
      v("h4", _d, k(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, O5 = /* @__PURE__ */ Y(Ed, [["__scopeId", "data-v-0da7fa52"]]), Ad = {
  key: 1,
  class: "row-list-failure"
}, Cd = ["data-row"], Od = {
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
    const t = e, n = B(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = R(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), U(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Ad, k(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), U(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        Q(k(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(G, { key: 3 }, [
      (c(), U(St(e.arrival ? Zo : "ul"), Ge(n.value, { class: "row-list" }), {
        default: P(() => [
          (c(!0), h(G, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Cd))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : A("", !0)
    ], 64));
  }
}, Td = /* @__PURE__ */ Y(Od, [["__scopeId", "data-v-6c7ba696"]]), Rd = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Id = {
  key: 1,
  class: "agent-rows-note"
}, Bd = {
  key: 2,
  class: "agent-rows-note"
}, Ld = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Nd = ["data-agent-row", "onClick"], Dd = { class: "agent-row-name" }, jd = { class: "agent-row-state" }, Pd = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = B(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", Rd, [
      e.loaded ? e.failure ? (c(), h("p", Id, k(e.failure), 1)) : e.rows.length ? (c(), h(G, { key: 3 }, [
        v("p", Ld, k(a.value) + " running", 1),
        (c(!0), h(G, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => j(qe)(`agents:${l.id}`)
        }, [
          v("span", Dd, "#" + k(l.id) + " " + k(l.session), 1),
          v("span", jd, k(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Nd))), 128))
      ], 64)) : (c(), h("p", Bd, k(e.none), 1)) : (c(), U(Et, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, T5 = /* @__PURE__ */ Y(Pd, [["__scopeId", "data-v-a01e5a17"]]), qd = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, k(e.text), 3));
  }
}, Bl = /* @__PURE__ */ Y(qd, [["__scopeId", "data-v-9e7e1157"]]), Fd = ["aria-valuenow", "aria-valuemax"], Wd = {
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
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      v("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, Fd));
  }
}, Hd = /* @__PURE__ */ Y(Wd, [["__scopeId", "data-v-9eba6a85"]]), Ud = { class: "bars" }, zd = { class: "bar-name" }, Vd = { class: "bar-value" }, Gd = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = B(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", Ud, [
      (c(!0), h(G, null, te(e.items, (i, u) => (c(), U(St(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: P(() => [
          v("span", zd, k(i.label), 1),
          D(Hd, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          v("span", Vd, k(i.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Kd = /* @__PURE__ */ Y(Gd, [["__scopeId", "data-v-663427f4"]]), Yd = { class: "bars" }, Jd = {
  key: 0,
  class: "bars-title"
}, Zd = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Yd, [
      e.node.title ? (c(), h("span", Jd, k(e.node.title), 1)) : A("", !0),
      D(Kd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Xd = /* @__PURE__ */ Y(Zd, [["__scopeId", "data-v-7135bb11"]]), Qd = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = B(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (c(!0), h(G, null, te(e.node.children || [], (i, u) => (c(), U(Yl, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Cn = /* @__PURE__ */ Y(Qd, [["__scopeId", "data-v-d142a3f4"]]), ef = {
  key: 0,
  class: "card-head"
}, tf = { class: "card-title" }, nf = {
  key: 0,
  class: "card-note"
}, af = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", ef, [
        v("span", tf, k(e.node.title), 1),
        e.node.note ? (c(), h("span", nf, k(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      D(Cn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, sf = /* @__PURE__ */ Y(af, [["__scopeId", "data-v-67b72d40"]]), of = { processes: "process", memories: "memory", replies: "reply" }, Gt = (e) => (of[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ka = [], lf = 2e3, lt = /* @__PURE__ */ new Map(), rf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, cf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? Ka.unshift(e) : Ka.push(e), lt.clear();
}
function Ll(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const uf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, df = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function ff(e, t) {
  const n = [{ type: "text", text: et(e).replace(/\r\n/g, `
`) }];
  for (const a of Ka)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function en(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return hf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function hf(e) {
  return e.split(cf).map((t, n) => n % 2 ? t : t.replace(rf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Qs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const mf = 24;
function pf(e) {
  const [t, , ...n] = e, a = Qs(t), s = n.map(Qs), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > mf) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${en(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Nl = /^\s*(?:[-*+]|\d+[.)])\s+/, Ya = /^\s*(\d+)[.)]\s/, eo = (e) => e.match(/^\s*/)[0].length;
function Dl(e) {
  const t = e[0].match(Ya), n = eo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && eo(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${en(o.text)}${o.nested.length ? Dl(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function gf(e, t) {
  const n = Ya.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Nl.test(e[s]) && Ya.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const to = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function jl(e) {
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
      const r = t.findIndex((u, d) => d > a && /^(```|~~~)/.test(u)), i = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(a + 1, i).join(`
`)}</code></pre>`), a = i + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${en(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (to(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(pf(t.slice(a, r))), a = r;
      continue;
    }
    if (Nl.test(s)) {
      const r = gf(t, a);
      n.push(Dl(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${jl(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !to(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${en(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const vf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, yf = (e) => e.type !== "text" && !vf.test(e.html);
function bf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(jl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : yf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function wf(e, t = { env: "" }) {
  const n = df(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => uf(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = bf(ff(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > lf && lt.delete(lt.keys().next().value), o;
}
const ha = /* @__PURE__ */ new WeakMap();
function kf(e) {
  if (ha.has(e)) return ha.get(e);
  const t = oi(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Gt(u)} show ${d}`);
    n.set(f, m), m.then((p) => {
      n.get(f) === m && (n.delete(f), t.set(f, p.ok ? { ...p.value, table: u } : null));
    });
  }
  function l(u) {
    a.has(u) || (a.add(u), e.follow([`${Gt(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const p = Number(m.slice(f.length));
        (!d.row_id || d.row_id === p) && o(u, p);
      }
    }));
  }
  function r(u, d) {
    l(u);
    const f = s(u, d);
    return !t.has(f) && !n.has(f) && o(u, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return ha.set(e, i), i;
}
function Pl() {
  const e = Ae(Te, null), t = e ? kf(e) : null;
  return (n, a = {}) => wf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const ql = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, cn = (e) => String(e || "").replace(ql, (t, n, a, s) => s), xf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), wn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, $f = /^Traceback \(most recent call last\):/m, Mf = 8;
function Fl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Mf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Sf(e) {
  const t = [...e.matchAll(xf)].map((a) => a.index);
  if (wn.lastIndex = 0, !t.length || !wn.test(e)) return null;
  wn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(wn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Fl(n), tail: "" } : null;
}
function _f(e) {
  const t = $f.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Fl([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = cn(e), n = _f(t) || Sf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Ef = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Af = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Cf = /[\w\]]\(/, Of = /^[\w$.[\]'"]+\s*=\s*[^=]/, Tf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Rf = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, If = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Bf = /[[({,]$/, Lf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Nf = /^(\t|\s{2,})\S/, Df = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, jf = /`[^`]+`/, Pf = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, qf = /[{}()[\];=<>$&|*\\@+^~%]/g, Wl = /^\s*(?:[-*+]|\d+[.)])\s/, Ff = /^\s*>/, Wf = /^\s*\|/, Hf = 0.6, Uf = 0.4, zf = 5, Vf = 0.03, Hl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= zf && t.every((n) => Pf.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(qf) ?? []).length / e.length < Vf;
}, ma = (e) => {
  const t = e.trim();
  return jf.test(t) ? !1 : [Ef, Af, Cf, Of, Tf, Rf, If, Bf, Lf].some((n) => n.test(t)) || /[;{}]$/.test(t) || Nf.test(e) && !Wl.test(e) && !Hl(e);
};
function Gf(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Wl.test(t[0]) || t.every((o) => Ff.test(o) || Wf.test(o))) return "text";
  const n = t.filter((o) => !Df.test(o.trim()));
  if (t.length === 1) return !n.length || ma(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ma).length, s = n.filter((o) => !ma(o) && Hl(o)).length;
  return a >= n.length * Hf && s <= n.length * Uf ? "code" : "text";
}
const Ja = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Kf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Yf = `${Ja} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Jf = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Zf = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", no = {
  js: { keywords: Ja, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Kf, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Yf, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ja, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Jf, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Zf, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Xf = {
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
function Qf(e, t) {
  const n = no[Xf[t] ?? t] || no.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), d = e.slice(o, u < 0 ? e.length : u);
      l(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), l("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (ao(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      l("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && ao(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), d = u < 0 ? e.length : u + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const i = (n.triple || []).find((u) => e.startsWith(u, o));
    if (i) {
      const u = e.indexOf(i, o + 3), d = u < 0 ? e.length : u + 3;
      l("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(r)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== r && (r === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(u + 1)) ? "property" : "string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
      continue;
    }
    if (/\d/.test(r)) {
      const u = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", u[0]), o += u[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const u = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + u)), o += u;
      continue;
    }
    l("plain", r), o += 1;
  }
  return s;
}
function eh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Qf(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? et(l) : `<span class="tok-${a}">${et(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function th(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const nh = 1500, so = /* @__PURE__ */ new WeakMap();
async function ah(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await th(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(so.get(t)), so.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, nh)
  )));
}
typeof document < "u" && document.addEventListener("click", ah, !0);
const sh = /\n\s*\n/, oh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, lh = /^\s*(`{3,}|~{3,})\s*$/, rh = /^\s{4,}\S/, ih = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Za = /^\s*(?:[-*+]|\d+[.)])\s/, Ul = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, ch = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function xs(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function uh(e) {
  const t = xs(e.join(`
`));
  return (ch.find(([, n]) => n.test(t)) || ["text"])[0];
}
const dh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Ul.test(t) && !Za.test(t);
}, fh = (e, t) => Za.test(t) || Za.test([...e].reverse().find((n) => n.trim()) || "");
function $s(e, t) {
  const n = t || uh(e), a = eh(xs(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function hh(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && lh.test(s));
  return a < 0 ? e.length : a;
}
function mh(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return $s(a.map(cn), n ? n.toLowerCase() : "");
}
function ph(e) {
  const t = e.split(sh).map((l) => ({ paragraph: l, type: Gf(xs(l).split(`
`)) })), n = [];
  let a = [];
  const s = () => {
    a.length && n.push({ type: "text", text: a.join(`

`) }), a = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let l = o;
    for (; l < t.length && t[l].type !== "text"; ) l += 1;
    const r = t.slice(o, l);
    if (r.some(({ type: i }) => i === "code") || r.length > 1) {
      s(), n.push($s(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(cn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function gh(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : ph(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(oh);
    if (r) {
      const u = hh(n, l, r[2]);
      o(), a.push(mh(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = dh(s) ? ih : rh;
    if (!t && i.test(n[l]) && !fh(s, n[l])) {
      let u = l;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > l && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Ul.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - l + d.length >= 2) {
        o(), a.push($s([...d, ...n.slice(l, u)].map(cn), "")), l = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => gh(e, t.document));
const jn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, zl = (e) => `${e.table}:${e.id}`, oo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", pa = 80;
function lo(e) {
  return e.length <= pa ? e : `${e.slice(0, pa + 1).replace(/\s+\S*$/, "") || e.slice(0, pa)}…`;
}
const ro = {
  messages: (e) => lo(oo(e.text)),
  comments: (e) => lo(oo(e.text)),
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
}, vh = (e) => (ro[e.table] ? ro[e.table](e) : e.title || "") || "", Mt = (e) => jn(e.created_at), Vl = (e) => jn(e.updated_at) || Mt(e), yh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, bh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function wh(e) {
  const t = yh.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = bh.exec(e), a = n && ut(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function kh(e, t, n, a) {
  const s = Ll(a, e, t), o = cn(s ? vh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${et(Pt(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = wh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: kh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const xh = /\.(png|jpe?g|gif|webp|svg)$/i, $h = (e) => xh.test(e), Mh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Sh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function _h(e, t) {
  const n = Mh.exec(e), [, a, s, o, l, r] = n || [], i = n && ut(a || o), u = i && Ll(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${Pt(i).title} ${u.id} · ${et(r)}`, m = $h(r) ? `<img class="file-card-image" src="${d}" alt="${et(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Eh(e) {
  const t = Sh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = _h(e, t) || Eh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ah = /`([^`\n]+)`/g;
At((e) => e.replace(Ah, (t, n) => `<code>${n}</code>`));
const io = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${ks.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(ql, (n, a, s, o) => io[a] ? io[a](s, o, t) : o)
);
const Ch = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Gl = new RegExp(`\\b(${El}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Kl = new RegExp(`\\b(${El}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Oh = new RegExp(`<code>((?:${Gl.source}|${Kl.source}))</code>`, "gi"), Th = (e) => e.replace(Oh, "$1"), Rh = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Ih = (e) => e.replace(Kl, (t, n, a) => a.replace(/\d+/g, (s) => Rh(n.replace(/s$/i, ""), s))), Bh = (e) => Ih(e).replace(
  Gl,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ut(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : Th(e).split(Ch).map((n, a) => a % 2 ? n : Bh(n)).join("")
);
const Lh = ["innerHTML"], Nh = ["innerHTML"], Dh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Pl(), a = B(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => j(It) && j(It)(...l)),
      innerHTML: a.value
    }, null, 8, Lh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => j(It) && j(It)(...l)),
      innerHTML: a.value
    }, null, 8, Nh));
  }
}, wt = /* @__PURE__ */ Y(Dh, [["__scopeId", "data-v-d8e75741"]]), jh = { class: "fact" }, Ph = { class: "fact-label" }, qh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", jh, [
      v("span", Ph, k(e.label), 1),
      D(wt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Fh = /* @__PURE__ */ Y(qh, [["__scopeId", "data-v-3a88ecf8"]]), Wh = { class: "list" }, Hh = { class: "list-label" }, Uh = {
  key: 1,
  class: "list-note"
}, zh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Wh, [
      (c(!0), h(G, null, te(e.items, (o, l) => (c(), U(St(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          v("span", Hh, k(o.label), 1),
          o.badge ? (c(), U(Bl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (c(), h("span", Uh, k(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Vh = /* @__PURE__ */ Y(zh, [["__scopeId", "data-v-ebe2ae0a"]]), Gh = { class: "table" }, Kh = {
  key: 0,
  class: "table-row empty"
}, Yh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", Gh, [
      v("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (c(!0), h(G, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, k(r), 1))), 128))
      ], 4),
      (c(!0), h(G, null, te(e.rows, (r, i) => (c(), U(St(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: P(() => [
          (c(!0), h(G, null, te(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, k(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", Kh, k(e.empty), 1)) : A("", !0)
    ]));
  }
}, Jh = /* @__PURE__ */ Y(Yh, [["__scopeId", "data-v-9326a52e"]]), Zh = { class: "stat-value" }, Xh = { class: "stat-label" }, Qh = {
  key: 0,
  class: "stat-note"
}, em = {
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
    return (a, s) => (c(), U(St(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        v("span", Zh, k(e.value), 1),
        v("span", Xh, k(e.label), 1),
        e.note ? (c(), h("span", Qh, k(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, tm = /* @__PURE__ */ Y(em, [["__scopeId", "data-v-ad0db6d6"]]), nm = { class: "code" }, am = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), U(jt, {
      value: e.node.type
    }, {
      stack: P(() => [
        D(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: P(() => [
        D(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: P(() => [
        D(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        D(sf, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        v("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: P(() => [...l[2] || (l[2] = [
        v("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        D(tm, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        D(Xd, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        D(Jh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        D(Vh, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        D(wt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        D(Fh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        D(Bl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        v("pre", nm, [
          v("code", null, k(e.node.text), 1)
        ])
      ]),
      file: P(() => [
        v("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, k(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Yl = /* @__PURE__ */ Y(am, [["__scopeId", "data-v-cbdcf540"]]), sm = { class: "dashboard" }, om = { class: "trail" }, lm = ["onClick"], rm = {
  key: 0,
  class: "gone",
  role: "status"
}, im = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = R(!!n.page && !s(n.page)), l = R(n.page && !o.value ? [n.page] : []), r = B(() => l.value.at(-1) || n.document.start), i = B(() => (n.document.pages || {})[r.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return me(
      () => n.document.start,
      () => l.value = []
    ), (m, p) => (c(), h("div", sm, [
      e.document.broken ? (c(), U(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          Q(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), U(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          Q(k(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(G, { key: 2 }, [
        v("nav", om, [
          v("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: p[0] || (p[0] = (y) => f(0))
          }, k(u(e.document.start)), 3),
          (c(!0), h(G, null, te(l.value, (y, $) => (c(), h(G, {
            key: `${$}-${y}`
          }, [
            p[2] || (p[2] = v("span", { class: "sep" }, "/", -1)),
            v("button", {
              type: "button",
              class: Z(["step", { current: $ === l.value.length - 1 }]),
              onClick: (M) => f($ + 1)
            }, k(u(y)), 11, lm)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", rm, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        D(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              D(Yl, {
                node: i.value.view,
                onOpen: d,
                onFile: p[1] || (p[1] = (y) => a("file", y))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, cm = /* @__PURE__ */ Y(im, [["__scopeId", "data-v-fbe83734"]]), ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Pe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, um = 6;
function Ms(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const dm = (e) => {
  const t = Ms(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function fm(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function hm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function mm(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), u = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, p) => m + p, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => u(d) - u(f));
  };
  for (let l = 0; l < um; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function pm(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, l, r) => {
    const i = `${s[o]}:${l}`;
    (n.get(i) || n.set(i, []).get(i)).push({ arrow: s, end: o, other: r });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, l) => t.get(o.other).x - t.get(l.other).x), s.forEach(({ arrow: o, end: l }, r) => o[`${l}Share`] = (r + 1) / (s.length + 1));
}
function gm(e) {
  const t = [...new Set(e.flatMap(([C, b]) => [C, b]))], n = new Set(e.map(([, C]) => C)), a = t.filter((C) => !n.has(C)), s = fm(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((C, b) => !s.has(b)), l = hm(t, o), r = mm(t, o, l), i = new Map(t.map((C) => [C, dm(C)])), u = r.map((C) => C.reduce((b, S) => b + i.get(S).width, 0) + je.across * (C.length - 1)), d = Math.max(...u) + je.margin * 2, f = ym(e, l, r.length), m = /* @__PURE__ */ new Map();
  let p = je.margin;
  r.forEach((C, b) => {
    let S = (d - u[b]) / 2;
    const w = Math.max(...C.map((I) => i.get(I).height));
    C.forEach((I) => {
      const _ = i.get(I);
      m.set(I, { ..._, x: S, y: p + (w - _.height) / 2 }), S += _.width + je.across;
    }), p += w + (f[b] ?? je.down);
  });
  const y = e.map(([C, b, S], w) => ({ from: C, to: b, label: S || "", back: s.has(w) || l.get(b) <= l.get(C) }));
  pm(y, m);
  const $ = y.map((C) => bm(C, m.get(C.from), m.get(C.to))), M = [...m.values()], O = $m($, M), F = Math.max(p - je.down, ...O.filter((C) => C.label).map((C) => C.label.y + C.label.height));
  return { width: Math.max(d - je.margin, ...O.filter((C) => C.label).map((C) => C.label.x + C.label.width)) + je.margin, height: F + je.margin, nodes: M, arrows: O };
}
const vm = (e) => e ? Ms(e, Pe.lineChars).length * Pe.line + Pe.pad * 2 : 0;
function ym(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += vm(l) + je.labelSpace);
  }), a.map((s) => Math.max(je.down, s));
}
function bm(e, t, n) {
  const a = e.label ? Ms(e.label, Pe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Pe.charWidth + Pe.pad * 2 : 0, o = a.length * Pe.line + (a.length ? Pe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const wm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, km = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], xm = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Pe.line);
function $m(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = wm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = xm.flatMap((i) => km.map((u) => s(u, i))).find((i) => !n.some((u) => co(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => co(r, i)); ) r.y += Pe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Pe.line, pad: Pe.pad } };
  });
}
const co = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Mm = { class: "flowchart-tools" }, Sm = ["width", "height", "viewBox", "aria-label"], _m = ["d"], Em = ["x", "y", "width", "height"], Am = ["x", "y"], Cm = ["x", "dy"], Om = {
  key: 0,
  class: "flowchart-label"
}, Tm = ["x", "y", "width", "height"], Rm = ["x", "y"], Im = ["x", "dy"], Bm = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => gm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = R(null), r = R({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var O;
      const $ = (O = l.value) == null ? void 0 : O.getBoundingClientRect();
      if (!($ != null && $.width)) return;
      const M = Math.min($.width / s.value.width, $.height / s.value.height, 1.5);
      r.value = { zoom: M, x: ($.width - s.value.width * M) / 2, y: ($.height - s.value.height * M) / 2 };
    }
    function d($, M, O) {
      const { zoom: F, x: W, y: C } = r.value, b = Math.min(o.most, Math.max(o.least, F * $));
      r.value = { zoom: b, x: M - (M - W) * b / F, y: O - (O - C) * b / F };
    }
    function f($) {
      const M = l.value.getBoundingClientRect();
      d($, M.width / 2, M.height / 2);
    }
    function m($) {
      const M = l.value.getBoundingClientRect();
      $.ctrlKey || $.metaKey ? d($.deltaY < 0 ? o.step : 1 / o.step, $.clientX - M.left, $.clientY - M.top) : r.value = { ...r.value, x: r.value.x - $.deltaX, y: r.value.y - $.deltaY };
    }
    function p($) {
      var M, O, F;
      $.preventDefault(), (M = window.getSelection()) == null || M.removeAllRanges(), i = { x: $.clientX - r.value.x, y: $.clientY - r.value.y }, (F = (O = l.value).setPointerCapture) == null || F.call(O, $.pointerId);
    }
    function y($) {
      i && (r.value = { ...r.value, x: $.clientX - i.x, y: $.clientY - i.y });
    }
    return Le(u), ($, M) => (c(), U(Ml, {
      title: e.title,
      large: "",
      onClose: M[4] || (M[4] = (O) => a("close"))
    }, {
      default: P(() => [
        v("div", Mm, [
          D(de, {
            small: "",
            onClick: M[0] || (M[0] = (O) => f(o.step))
          }, {
            default: P(() => [...M[5] || (M[5] = [
              Q("Zoom in", -1)
            ])]),
            _: 1
          }),
          D(de, {
            small: "",
            onClick: M[1] || (M[1] = (O) => f(1 / o.step))
          }, {
            default: P(() => [...M[6] || (M[6] = [
              Q("Zoom out", -1)
            ])]),
            _: 1
          }),
          D(de, {
            small: "",
            onClick: u
          }, {
            default: P(() => [...M[7] || (M[7] = [
              Q("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        v("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(m, ["prevent"]),
          onPointerdown: p,
          onPointermove: y,
          onPointerup: M[2] || (M[2] = (O) => qs(i) ? i.value = null : i = null),
          onPointercancel: M[3] || (M[3] = (O) => qs(i) ? i.value = null : i = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            M[8] || (M[8] = v("defs", null, [
              v("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                v("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (c(!0), h(G, null, te(s.value.arrows, (O, F) => (c(), h("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: O.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, _m))), 128)),
            (c(!0), h(G, null, te(s.value.nodes, (O) => (c(), h("g", {
              key: O.name,
              class: "flowchart-node"
            }, [
              v("rect", {
                x: O.x,
                y: O.y,
                width: O.width,
                height: O.height,
                rx: "8"
              }, null, 8, Em),
              v("text", {
                x: O.x + O.width / 2,
                y: O.y + O.padY + O.line / 2
              }, [
                (c(!0), h(G, null, te(O.lines, (F, W) => (c(), h("tspan", {
                  key: W,
                  x: O.x + O.width / 2,
                  dy: W ? O.line : 0
                }, k(F), 9, Cm))), 128))
              ], 8, Am)
            ]))), 128)),
            (c(!0), h(G, null, te(s.value.arrows, (O, F) => (c(), h(G, {
              key: `label-${F}`
            }, [
              O.label ? (c(), h("g", Om, [
                v("rect", {
                  x: O.label.x,
                  y: O.label.y,
                  width: O.label.width,
                  height: O.label.height,
                  rx: "4"
                }, null, 8, Tm),
                v("text", {
                  x: O.label.x + O.label.width / 2,
                  y: O.label.y + O.label.pad + O.label.line / 2
                }, [
                  (c(!0), h(G, null, te(O.label.lines, (W, C) => (c(), h("tspan", {
                    key: C,
                    x: O.label.x + O.label.width / 2,
                    dy: C ? O.label.line : 0
                  }, k(W), 9, Im))), 128))
                ], 8, Rm)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, Sm))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Lm = /* @__PURE__ */ Y(Bm, [["__scopeId", "data-v-51d24cfe"]]), uo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', fo = {
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
  agent: uo,
  worker: uo,
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
}, Nm = ["innerHTML"], Dm = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => fo[t.name] || fo.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Nm));
  }
}, ft = /* @__PURE__ */ Y(Dm, [["__scopeId", "data-v-beb5935c"]]), jm = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      D(ft, { name: "fold" })
    ], 2));
  }
}, xt = /* @__PURE__ */ Y(jm, [["__scopeId", "data-v-d03899bb"]]), Pm = ["data-tip", "aria-label"], qm = {
  key: 0,
  class: "mact-word"
}, Fm = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      D(ft, { name: "open" }),
      e.open ? (c(), h("span", qm, k(e.label), 1)) : A("", !0),
      n[0] || (n[0] = v("span", { class: "hit" }, null, -1))
    ], 10, Pm));
  }
}, Jl = /* @__PURE__ */ Y(Fm, [["__scopeId", "data-v-3b292e09"]]), Zl = 120, On = 280, Xl = 160, Wm = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Hm = ["leaving", "resizing", "entering"];
function Xa(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Um(e) {
  const t = Hm.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Xa(e);
  return e.classList.add(...t), n;
}
function Ql(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = R(t()), s = R("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const p = Um(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${On}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${On}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, p);
  }
  function u(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let p = m.offsetHeight;
    const y = new ResizeObserver(() => {
      m.offsetHeight !== p && (p = m.offsetHeight, i(f, Xa(f)));
    });
    return y.observe(m), y;
  }
  async function d(f) {
    const m = e.value, p = ++o;
    if (!m || !m.offsetWidth || Wm()) {
      a.value = f;
      return;
    }
    const y = Xa(m);
    if (l(m, y), s.value = "leaving", await n(Zl), p !== o) return;
    a.value = f, s.value = "resizing", await ht(), i(m, y);
    const $ = u(m);
    await n(On), $ == null || $.disconnect(), p === o && (r(m), s.value = "entering", await n(Xl), p === o && (s.value = ""));
  }
  return me(t, (f) => d(f)), _t(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const zm = { class: "growing-card-top" }, Vm = ["aria-expanded"], Gm = { class: "growing-card-avatar" }, Km = { class: "growing-card-title" }, Ym = { class: "growing-card-more" }, Jm = { class: "growing-card-body" }, Zm = {
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
    const n = e, a = t, s = R(!1), o = R(null), { folded: l, phase: r } = Ql(o, () => !s.value), i = B(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = B(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", j(r), { open: !j(l), bad: e.bad, incoming: e.incoming }])
    }, [
      v("div", zm, [
        v("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          v("span", Gm, [
            e.bad ? (c(), U(ft, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(G, { key: 1 }, [
              Q(k(i.value), 1)
            ], 64)) : (c(), U(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          v("span", Km, k(e.title), 1),
          D(xt, { open: s.value }, null, 8, ["open"])
        ], 8, Vm),
        e.action ? (c(), U(Jl, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : A("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          D(ye, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      v("div", Ym, [
        v("div", Jm, [
          (c(!0), h(G, null, te(u.value, (m, p) => (c(), h("p", {
            key: p,
            class: "growing-card-text"
          }, k(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Xm = /* @__PURE__ */ Y(Zm, [["__scopeId", "data-v-f2b4930d"]]), Qm = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, e1 = { class: "md inline" }, t1 = ["disabled", "title", "onClick"], n1 = {
  key: 1,
  class: "message-links-many"
}, a1 = ["aria-expanded"], s1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, o1 = ["disabled", "onClick"], l1 = { class: "row-pill message-links-chip" }, r1 = { class: "message-links-title" }, i1 = { key: 0 }, ga = 3, c1 = "task", u1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => n.total || n.links.length), o = B(() => n.links.every((m) => m.endpoint.model === c1) ? "tasks" : "items"), l = R(!1), r = R(null);
    al(r, () => l.value = !1);
    const i = () => l.value = !l.value, u = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      u(m) || (l.value = !1, qe(m.endpoint.open_ref));
    }
    return (m, p) => (c(), h("div", {
      ref_key: "line",
      ref: r,
      class: Z(["message-links", { many: s.value > ga, three: s.value === ga, open: l.value }]),
      "data-message-links": ""
    }, [
      D(ft, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (c(), h("span", Qm, [
        v("span", e1, [
          p[1] || (p[1] = Q("Linked: ", -1)),
          (c(!0), h(G, null, te(e.links, (y) => (c(), h("button", {
            key: `${y.endpoint.model}:${y.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: u(y),
            title: y.endpoint.title,
            onClick: ($) => f(y)
          }, [
            Q(k(y.endpoint.model.replaceAll("_", " ")) + " " + k(y.endpoint.id), 1),
            d(y) ? (c(), h(G, { key: 0 }, [
              Q(" (" + k(d(y)) + ")", 1)
            ], 64)) : A("", !0),
            u(y) ? (c(), h(G, { key: 1 }, [
              Q(" (unavailable)")
            ], 64)) : A("", !0)
          ], 8, t1))), 128))
        ])
      ])) : A("", !0),
      s.value >= ga ? (c(), h("span", n1, [
        v("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          Q(k(s.value) + " linked " + k(o.value) + " ", 1),
          D(xt, { open: l.value }, null, 8, ["open"])
        ], 8, a1)
      ])) : A("", !0),
      l.value ? (c(), h("div", s1, [
        (c(!0), h(G, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.endpoint.model}:${y.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: u(y),
          onClick: ($) => f(y)
        }, [
          v("span", l1, k(y.endpoint.model.replaceAll("_", " ")) + " " + k(y.endpoint.id), 1),
          v("span", r1, k(y.endpoint.title), 1),
          v("span", null, k(d(y)), 1),
          u(y) ? (c(), h("span", i1, "Unavailable")) : A("", !0)
        ], 8, o1))), 128))
      ])) : A("", !0),
      D(Jn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: p[0] || (p[0] = (y) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, d1 = /* @__PURE__ */ Y(u1, [["__scopeId", "data-v-e9bc783c"]]), f1 = ["title", "aria-label"], h1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, m1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, p1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = B(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", h1, [
        o[0] || (o[0] = v("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", m1)) : A("", !0)
      ]))
    ], 10, f1));
  }
}, g1 = /* @__PURE__ */ Y(p1, [["__scopeId", "data-v-6dc92808"]]);
function v1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function er(e, t = Date.now()) {
  const n = v1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const y1 = 36e5;
function R5(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / y1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function tr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function ho(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const va = (e) => String(e).padStart(2, "0");
function b1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${va(t % 60)}s` : `${Math.floor(t / 3600)}h ${va(Math.floor(t % 3600 / 60))}m ${va(t % 60)}s`;
}
const w1 = "img,pre,table";
function k1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function x1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function $1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(w1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = k1(x1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function M1(e, t) {
  let n = null;
  const a = () => e.value && $1(e.value);
  Le(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
}
const S1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function _1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const kn = /* @__PURE__ */ new WeakMap(), ze = "work", Ht = "sent", E1 = 50, mo = () => ({ rows: R([]), total: R(0), next: R(null), loading: R(!1), failure: R(""), version: 0 });
function A1(e) {
  var f;
  if (kn.has(e)) return kn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var p;
    return ((p = e.visible) == null ? void 0 : p.value) !== !1 && [...m.views].some((y) => y.visible);
  };
  async function o(m, p, y = 1) {
    const $ = m[p], M = ++$.version;
    $.loading.value = !0, $.failure.value = "";
    const O = p === ze ? "--type about --type edited --group-counterparts" : "--type sent_to", F = `link list --source message:${m.id} ${O} --page ${y} --page-size ${p === ze ? 10 : 25}`;
    try {
      const W = await e.read(F);
      if (t.get(m.id) !== m || $.version !== M) return;
      if (!W.ok) {
        $.failure.value = W.error;
        return;
      }
      const C = p === ze ? W.value.counterparts ?? [] : W.value.rows ?? [], b = y === 1 ? C : [...$.rows.value, ...C], S = p === ze ? (w) => `${w.endpoint.model}:${w.endpoint.id}` : (w) => w.id ?? w.target_id;
      $.rows.value = [...new Map(b.map((w) => [S(w), w])).values()], $.total.value = W.value.total ?? $.rows.value.length, $.next.value = W.value.next_page ?? null;
    } catch (W) {
      $.version === M && ($.failure.value = W.message);
    } finally {
      $.version === M && ($.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((p) => t.get(p)).filter((p) => p && s(p));
    n.clear();
    for (const p of m) {
      const y = [...p.dirty];
      p.dirty.clear();
      for (const $ of y) o(p, $);
    }
  }
  function r(m, p = [ze, Ht]) {
    for (const y of p) m.dirty.add(y);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const p = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), y = m.link_types ?? (m.link_type ? [m.link_type] : []), $ = y.length ? [ze, Ht].filter((O) => O === ze ? y.some((F) => ["about", "edited"].includes(F)) : y.includes("sent_to")) : [ze, Ht];
    if (!$.length) return;
    const M = p.length ? [...new Set(p.filter((O) => O.model === "message").map((O) => O.id))].map((O) => t.get(O)).filter(Boolean) : [...t.values()].filter(s).slice(0, E1);
    for (const O of M) r(O, $);
  }
  const u = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, p) {
      let y = t.get(m);
      return y || (y = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([ze, Ht]), work: mo(), sent: mo() }, t.set(m, y)), y.views.add(p), y.dirty.size && r(y, [...y.dirty]), y;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, p) {
      m.views.delete(p), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), u == null || u(), kn.delete(e));
    },
    more(m, p) {
      const y = m == null ? void 0 : m[p];
      if (y != null && y.next.value && !y.loading.value) return o(m, p, y.next.value);
    }
  };
  return kn.set(e, d), d;
}
function C1(e, t, n) {
  const a = Ve(null);
  let s = null;
  const o = me(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = A1(e);
    const u = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, u);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((p) => {
      u.visible = p.some((y) => y.isIntersecting), u.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = me(n, (p) => {
      f == null || f.disconnect(), p && (f == null || f.observe(p));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, u), a.value = null;
    });
  }, { immediate: !0 });
  return fs(o), {
    links: B(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: B(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: B(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: B(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: B(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: B(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: B(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: B(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: B(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, ze),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ht)
  };
}
const O1 = ["data-incoming", "data-ref"], T1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], R1 = { class: "message-body" }, I1 = ["title"], B1 = ["innerHTML"], L1 = ["title"], N1 = ["innerHTML"], D1 = {
  class: "message-faces",
  "data-message-faces": ""
}, j1 = ["title", "data-face", "onClick"], P1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, q1 = ["title", "data-reaction", "onClick"], F1 = {
  key: 0,
  class: "message-reaction-count"
}, W1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, H1 = ["href", "title"], U1 = ["src", "alt"], z1 = ["href"], V1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, G1 = ["disabled", "data-sent-worker", "title", "onClick"], K1 = { class: "message-foot" }, Y1 = { class: "message-time" }, J1 = {
  class: "message-id",
  "data-message-id": ""
}, Z1 = 140, X1 = 2, Q1 = 1500, ep = "An earlier message", tp = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(!1), o = R(null), l = B(() => ["user", "comment"].includes(n.message.type)), r = B(() => {
      const [ve, he] = (n.message.commented_row || ":").split(":"), ae = ut(ve);
      return ae ? { ref: `${ae}:${he}`, label: `${Pt(ae).title.toLowerCase()} ${he}` } : null;
    }), i = B(() => n.message.worker_id ?? null), u = R(!1), d = B(() => i.value !== null && ((n.message.text ?? "").length > Z1 || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > X1)), f = B(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Q1);
    }
    const p = Pl(), y = B(() => p(n.message.text ?? "")), $ = B(() => JSON.parse(n.message.flowchart_edges || "[]")), M = R(!1), O = B(() => p(n.quote || ep));
    function F() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    M1(o, () => `${n.message.text} ${n.quote}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, C = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, b = B(() => JSON.parse(n.message.captions || "{}")), S = B(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: C(ve), isImage: W.test(ve), title: b.value[ve] || ve }))), w = B(() => tr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), I = Ae(Te, null), { links: _, total: L, more: x, loading: g, failure: E, sentTo: T, sentMore: N, sentLoading: J, sentFailure: ee, loadMore: re, loadSent: ie } = C1(I, () => l.value && !n.message.local ? n.message.id : null, o), fe = R(!1), Ce = B(() => _1(n.message.reactions));
    function Fe(ve) {
      fe.value = !1, a("react", n.message, ve);
    }
    return (ve, he) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      D(Xm, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: he[0] || (he[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, O1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      v("div", R1, [
        v("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: he[6] || (he[6] = (...ae) => j(It) && j(It)(...ae))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: he[1] || (he[1] = xe((ae) => j(qe)(r.value.ref), ["stop"]))
          }, [
            D(ye, {
              name: "bubble",
              size: 12
            }),
            v("span", null, "Comment on " + k(r.value.label), 1)
          ], 8, I1)) : A("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(F, ["stop"]),
            innerHTML: O.value
          }, null, 8, B1)) : A("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: he[2] || (he[2] = xe((ae) => j(qe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + k(i.value), 9, L1)) : A("", !0),
          v("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, N1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: he[3] || (he[3] = xe((ae) => u.value = !u.value, ["stop"]))
          }, k(u.value ? "Show less" : "Show more"), 1)) : A("", !0),
          $.value.length ? (c(), h(G, { key: 4 }, [
            v("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: he[4] || (he[4] = (ae) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (c(), U(Lm, {
              key: 0,
              title: e.message.text,
              edges: $.value,
              onClose: he[5] || (he[5] = (ae) => M.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        v("div", {
          class: Z(["message-tools", { picking: fe.value }]),
          "data-message-tools": ""
        }, [
          fe.value ? (c(), h(G, { key: 0 }, [
            v("div", D1, [
              (c(!0), h(G, null, te(j(S1), (ae) => (c(), h("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Ye) => Fe(ae)
              }, k(ae), 9, j1))), 128))
            ]),
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: he[7] || (he[7] = (ae) => fe.value = !1)
            }, [
              D(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(G, { key: 1 }, [
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: he[8] || (he[8] = (ae) => fe.value = !0)
            }, "React"),
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: he[9] || (he[9] = (ae) => a("reply", e.message))
            }, "Reply"),
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, k(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: he[10] || (he[10] = (ae) => a("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      Ce.value.length ? (c(), h("div", P1, [
        (c(!0), h(G, null, te(Ce.value, (ae) => (c(), h("button", {
          key: ae.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Ye) => a("react", e.message, ae.emoji)
        }, [
          Q(k(ae.emoji) + " ", 1),
          ae.count > 1 ? (c(), h("span", F1, k(ae.count), 1)) : A("", !0)
        ], 10, q1))), 128))
      ])) : A("", !0),
      S.value.length ? (c(), h("div", W1, [
        (c(!0), h(G, null, te(S.value, (ae) => (c(), h(G, {
          key: ae.name
        }, [
          ae.isImage ? (c(), h("a", {
            key: 0,
            href: ae.address,
            target: "_blank",
            class: "message-image",
            title: ae.title
          }, [
            v("img", {
              src: ae.address,
              alt: ae.name,
              "data-figure-picture": ""
            }, null, 8, U1)
          ], 8, H1)) : (c(), h("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, k(ae.name), 9, z1))
        ], 64))), 128))
      ])) : A("", !0),
      j(T).length ? (c(), h("div", V1, [
        D(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(G, null, te(j(T), (ae) => (c(), h("button", {
          key: ae.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          title: `Open worker ${ae.id}`,
          onClick: xe((Ye) => ae.open_ref && j(qe)(ae.open_ref), ["stop"])
        }, [
          Q("Also sent to worker " + k(ae.id), 1),
          ae.unavailable ? (c(), h(G, { key: 0 }, [
            Q(" (unavailable)")
          ], 64)) : A("", !0)
        ], 8, G1))), 128))
      ])) : A("", !0),
      D(Jn, {
        more: j(N),
        loading: j(J),
        failure: j(ee),
        label: "More recipients",
        onMore: j(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      v("div", K1, [
        v("time", Y1, k(w.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(G, { key: 0 }, [
          he[11] || (he[11] = v("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          v("span", J1, "message " + k(e.message.id), 1)
        ], 64)) : A("", !0),
        l.value ? (c(), U(g1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      j(_).length || j(E) ? (c(), U(d1, {
        key: 3,
        links: j(_),
        total: j(L),
        more: j(x),
        loading: j(g),
        failure: j(E),
        onMore: j(re)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : A("", !0)
    ], 8, T1));
  }
}, I5 = /* @__PURE__ */ Y(tp, [["__scopeId", "data-v-0be1107c"]]), np = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = li("SkeletonParts", !0);
      return c(!0), h(G, null, te(e.parts, (i, u) => (c(), h(G, { key: u }, [
        (c(!0), h(G, null, te(i.count, (d) => (c(), U(jt, {
          key: d,
          value: i.shape
        }, {
          line: P(() => [
            D(Vt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            D(Vt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            D(Vt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: P(() => [...l[0] || (l[0] = [
            v("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: P(() => [
            v("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            v("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: P(() => [
            v("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            v("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), ap = /* @__PURE__ */ Y(np, [["__scopeId", "data-v-fa8baeaf"]]), sp = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, op = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", sp, [
      D(ap, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Ss = /* @__PURE__ */ Y(op, [["__scopeId", "data-v-52f66b64"]]), Pn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ya = 200, nr = (e) => {
  var t;
  return ((t = Pn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Pn[0].key;
}, B5 = (e) => {
  var t;
  return ((t = Pn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, lp = ["aria-label"], rp = 300, po = 400, ip = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ya } },
  setup(e) {
    const t = e, n = B(() => nr(t.value)), a = B(() => n.value < ya ? [1, 0.25, 0.25] : n.value === ya ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= po, high: n.value >= rp && n.value < po }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      v("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      v("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      v("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, lp));
  }
}, L5 = /* @__PURE__ */ Y(ip, [["__scopeId", "data-v-b10e610f"]]), go = (e) => [...new Set(e.agents.map((t) => t.name))], N5 = (e) => go(e).length === 1 ? `Worker: ${go(e)[0]}` : "Delegated", cp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, vo = (e) => cp[e.card.state] || "idle", up = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), yo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, bo = (e, t) => yo[vo(e)] - yo[vo(t)], wo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, D5 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => bo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || up(a, s)) : [...e].sort((a, s) => bo(a, s) || (wo[t] || wo.state)(a, s)), dp = { class: "list-row" }, fp = {
  key: 0,
  class: "list-row-type"
}, hp = { class: "list-row-main" }, mp = {
  key: 0,
  class: "list-row-title"
}, pp = { class: "list-row-body" }, gp = {
  key: 1,
  class: "list-row-end"
}, vp = {
  key: 1,
  class: "list-row-text"
}, yp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", dp, [
      e.type ? (c(), h("span", fp, k(e.type), 1)) : A("", !0),
      v("div", hp, [
        e.title ? (c(), h("span", mp, k(e.title), 1)) : A("", !0),
        v("div", pp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", gp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (c(), h("span", vp, k(e.text), 1)) : A("", !0)
    ]));
  }
}, j5 = /* @__PURE__ */ Y(yp, [["__scopeId", "data-v-dfc8c3a7"]]), bp = {
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
}, wp = { claude: "Claude Code", codex: "Codex" }, kp = ["aria-expanded"], xp = { class: "drop-label" }, $p = ["value"], Mp = {
  key: 1,
  class: "drop-lead"
}, Sp = { class: "drop-item-text" }, _p = {
  key: 2,
  class: "drop-note"
}, Ep = {
  key: 1,
  class: "drop-none"
}, Ap = {
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
    const n = e, a = t, s = R(!1), o = R(null), l = R(""), r = B(() => {
      const u = l.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function i(u) {
      s.value = !1, a("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      v("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), U(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        v("span", xp, k(e.label), 1),
        D(ye, {
          name: "down",
          size: 11
        })
      ], 10, kp),
      s.value ? (c(), U(Zn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: P(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, $p)) : A("", !0),
          (c(!0), h(G, null, te(r.value, (f) => (c(), U($t, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: P(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (c(), h("span", Mp, k(f.lead), 1)) : A("", !0),
              v("span", Sp, k(f.label), 1),
              f.note ? (c(), h("span", _p, k(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? A("", !0) : (c(), h("p", Ep, k(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, Cp = /* @__PURE__ */ Y(Ap, [["__scopeId", "data-v-29dfcce5"]]), P5 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => [
      ...bp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = B(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), U(Cp, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${j(wp)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Op = ["aria-label"], Tp = { class: "head" }, Rp = { class: "names" }, Ip = { class: "body" }, Bp = {
  key: 0,
  class: "foot"
}, Lp = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = kl(a, n), r = xl(s);
    return (i, u) => (c(), U(us, { to: "body" }, [
      D(Dt, {
        name: "side",
        appear: "",
        onAfterLeave: j(l)
      }, {
        default: P(() => [
          j(s) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: j(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = xe((...d) => j(o) && j(o)(...d), ["self"]))
          }, [
            v("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(G, { key: 0 }, [
                v("header", Tp, [
                  v("div", Rp, [
                    v("h2", null, k(e.title), 1),
                    e.abstract ? (c(), U(wt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  D(bs, {
                    title: e.closeLabel,
                    onClick: j(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                v("div", Ip, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", Bp, [
                  ue(i.$slots, "foot", {}, void 0, !0)
                ])) : A("", !0)
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Op)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, q5 = /* @__PURE__ */ Y(Lp, [["__scopeId", "data-v-c9a3f43a"]]), Np = {
  key: 1,
  class: "text-field-label"
}, Dp = {
  key: 2,
  class: "text-field-end"
}, jp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ qa({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Pa(e, "modelValue"), a = Kn(), s = "onUpdate:modelValue" in (((d = ri()) == null ? void 0 : d.vnode.props) || {}), o = B(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = B(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = B(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = R(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, j(a).class]),
      style: ge(j(a).style)
    }, [
      e.icon ? (c(), U(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (c(), h("span", Np, k(e.label), 1)) : A("", !0),
      tt(v("input", Ge({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [j(Va), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Dp, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : tt((c(), h("input", Ge({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [j(Va), o.value]
    ]);
  }
}), F5 = /* @__PURE__ */ Y(jp, [["__scopeId", "data-v-d9c38ca8"]]);
async function Pp(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((i) => [i, a[i]])), l = () => Object.assign(a, o);
  Object.assign(a, s);
  let r = !1;
  try {
    const i = await n(t);
    return r = i.ok, i;
  } finally {
    r || l();
  }
}
const ko = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function W5(e) {
  const t = Ke().sources.find((n) => n.key === e);
  return t ? Qa(t.read, t.events) : Qa("", []);
}
function ar(e, t, n, a) {
  const s = R([]), o = R(null), l = R(""), r = R(!1), i = performance.now(), u = R(!1), d = R(""), f = R(null);
  async function m(w) {
    const I = $, _ = await t({ "before-id": w + 1, limit: 1 });
    if (I !== $) return;
    if (!_.ok) return W();
    const L = _.value.rows.find((x) => x.id === w);
    s.value = L ? s.value.map((x) => x.id === w ? L : x) : s.value.filter((x) => x.id !== w);
  }
  async function p(w) {
    if (a && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (s.value = s.value.filter((E) => E.id !== w.row_id));
    if (a && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && s.value.some((E) => E.id === w.row_id)) return m(w.row_id);
    if (!(a && s.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return W();
    const _ = Math.max(...s.value.map((E) => E.id)), L = $, x = await t({ "after-id": _ });
    if (L !== $) return;
    if (!x.ok) return W();
    const g = new Set(s.value.map((E) => E.id));
    s.value = [...x.value.rows.filter((E) => !g.has(E.id)), ...s.value];
  }
  async function y() {
    if (!u.value || !s.value.length) return !1;
    const w = $, I = Math.min(...s.value.map((x) => x.id)), _ = await t({ "before-id": I });
    if (w !== $) return !1;
    if (!_.ok || !_.value.rows.length) return u.value = !1;
    u.value = ko(_.value, n);
    const L = new Set(s.value.map((x) => x.id));
    return s.value = [...s.value, ..._.value.rows.filter((x) => !L.has(x.id))], !0;
  }
  let $ = 0;
  function M(w, I) {
    const _ = w.ok ? e.shared ? [w.value] : w.value.rows : [];
    w.ok && (s.value = I(_)), o.value = w.ok ? w.value : null;
    const L = _.length ? Math.min(..._.map((x) => x.id)) : 0;
    w.ok && !s.value.some((x) => x.id < L) && (u.value = !e.shared && ko(w.value, n)), l.value = w.ok ? "" : w.error, hs(i, () => r.value = !0);
  }
  async function O(w) {
    const I = ++$, _ = await t({});
    I === $ && M(_, w);
  }
  const F = (w) => {
    if (!a || !w.length) return w;
    const I = Math.min(...w.map((L) => L.id)), _ = Math.max(...w.map((L) => L.id));
    return [...s.value.filter((L) => L.id > _), ...w, ...s.value.filter((L) => L.id < I)];
  }, W = () => O(F), C = (w) => M(w, F), b = () => O((w) => w);
  async function S(w, I = null) {
    const _ = await Pp(I && { target: s, fields: { value: I(s.value) } }, w, e.run);
    return d.value = _.ok ? "" : _.error, f.value = _.ok ? _.value : null, await W(), _;
  }
  return { rows: s, listing: o, failure: l, loaded: r, more: u, load: W, loadLatest: b, older: y, act: S, actionFailure: d, answer: f, context: e, heard: p, showFirst: C };
}
const qp = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Qa(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = Ke(), l = ar(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${qp(i)}`), a, n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
function H5(e, t, { pageSize: n = 50, incremental: a = !1 } = {}) {
  const s = ar(Ke(), (o) => e.readKey(t, o), n, a);
  return e.handle(t, s.heard, s.showFirst), s;
}
const Fp = { class: "title" }, Wp = { class: "state" }, Hp = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Qa(t.line, t.events);
    return (o, l) => (c(), U(Td, {
      rows: j(n),
      failure: j(a),
      loaded: j(s),
      empty: e.empty
    }, {
      default: P(({ row: r }) => [
        v("span", Fp, k(r.title), 1),
        v("span", Wp, k(j(ml)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, U5 = /* @__PURE__ */ Y(Hp, [["__scopeId", "data-v-9191a6f0"]]);
function Up(e = 1e3, t = null) {
  const n = R(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const ba = R(Date.now() / 1e3);
let xo = 0, xn = 0;
function sr() {
  return xn || (ba.value = Date.now() / 1e3, xo = setInterval(() => ba.value = Date.now() / 1e3, 1e3)), xn += 1, Xo() && fs(() => {
    xn -= 1, xn || clearInterval(xo);
  }), ba;
}
const zp = 200, Vp = Zl + On + Xl + zp;
function Ft(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Gp(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Ft(e),
    top: Ft(e.querySelector(".top")),
    title: Ft(e.querySelector(".title")),
    contents: Ft(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, u;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: Ft(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Kp(e, t, n, a) {
  me(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Gp(o, l, n.value)), performance.now() - l < Vp) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const Yp = ["title", "data-figure-mark", "data-folded", "data-open"], Jp = {
  key: 2,
  class: "worker"
}, Zp = { class: "head" }, Xp = { key: 0 }, Qp = {
  key: 3,
  class: "status"
}, eg = {
  key: 0,
  class: "figure"
}, tg = {
  key: 1,
  class: "ran-for"
}, ng = { key: 2 }, ag = {
  key: 3,
  class: "news"
}, sg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, og = {
  key: 6,
  class: "settled"
}, lg = {
  key: 1,
  class: "bar"
}, rg = {
  key: 3,
  class: "detail body"
}, ig = {
  key: 0,
  class: "body-label"
}, cg = ["title"], ug = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Kn(), a = ["onClick", "onAct"], s = B(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = R(!1), l = B(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = B(() => t.open !== void 0), i = B(() => r.value || l.value), u = B(() => r.value ? t.open : o.value), d = B(() => r.value ? !t.open : l.value && !o.value), f = B(() => !!(t.mark.action && n.onAct)), m = B(() => i.value || f.value || !!n.onClick), p = R(null), y = R(null), { folded: $, phase: M } = Ql(p, () => d.value);
    Kp(p, d, M, Ae(Te, null));
    function O(ie) {
      var fe, Ce;
      if (!(ie.target !== p.value && !y.value.contains(ie.target))) {
        if (r.value) return (fe = n.onClick) == null ? void 0 : fe.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ce = n.onAct || n.onClick) == null || Ce(ie);
      }
    }
    const F = (ie) => n.onAct(ie), W = ["failed", "unfinished"], C = B(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? W.includes(t.mark.state) ? "danger" : "good" : ""), b = B(() => t.mark.color ? t.mark.color : C.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : C.value ? `var(--tone-${C.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), S = B(() => b.value || "var(--tone-work)"), w = B(() => !t.mark.ending && !t.mark.ended && C.value !== "stopped"), I = sr(), _ = B(
      () => t.mark.began_at && w.value && !t.mark.figure && !t.mark.counting ? b1(I.value - t.mark.began_at) : ""
    ), L = B(() => {
      const { started: ie, ended: fe } = t.mark;
      return ie ? fe ? `ran ${ho(fe - ie, !0)}` : ho(I.value - ie, !0) : _.value;
    }), x = ["bad", "danger", "warn"], g = B(() => x.includes(C.value) || t.mark.asks ? "attention" : w.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), E = ["bad", "danger"], T = B(() => E.includes(C.value)), N = B(() => g.value === "process" ? "running" : T.value ? "cross" : C.value === "stopped" ? "stopped" : C.value === "good" ? "tick" : ""), J = B(
      () => !!(t.mark.figure || L.value || t.mark.docked || t.mark.stopping || N.value || t.mark.settled || t.mark.news)
    ), ee = B(() => [t.mark.title, t.mark.time ? tr(t.mark.time) : ""].filter(Boolean).join(" · ")), re = B(() => ({
      ...b.value ? { "--mark": b.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, fe) => (c(), h("div", Ge(s.value, {
      ref_key: "root",
      ref: p,
      class: [
        "mark",
        `w-${g.value}`,
        j(M),
        {
          open: u.value,
          folding: r.value && d.value,
          live: m.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: b.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: re.value,
      title: ee.value,
      "data-figure-mark": e.mark.key,
      "data-folded": j($) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: O
    }), [
      (c(), U(St(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: P(() => [
          e.mark.markIcon ? (c(), U(ft, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), U(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Jp, k(e.mark.worker), 1)) : A("", !0),
          v("span", Zp, [
            D(wt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Xp, k(e.mark.name), 1)) : A("", !0),
            i.value ? (c(), U(xt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          J.value ? (c(), h("span", Qp, [
            e.mark.figure ? (c(), h("span", eg, k(e.mark.figure), 1)) : A("", !0),
            L.value ? (c(), h("span", tg, k(L.value), 1)) : A("", !0),
            e.mark.stopping ? (c(), h("span", ng, "Stopping")) : A("", !0),
            e.mark.news ? (c(), h("span", ag, k(e.mark.news), 1)) : A("", !0),
            N.value === "running" ? (c(), h("span", sg)) : N.value ? (c(), U(ft, {
              key: 5,
              class: Z(["sign", N.value]),
              name: N.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (c(), h("span", og, k(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), U(Jl, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: xe(F, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && w.value ? (c(), h("span", lg, [
        v("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: S.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !j($) ? (c(), U(wt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !j($) ? (c(), h("div", rg, [
        e.mark.bodyLabel ? (c(), h("p", ig, k(e.mark.bodyLabel), 1)) : A("", !0),
        D(wt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !j($) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, cg)) : A("", !0),
      e.mark.card ? (c(), U(wt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      ue(ie.$slots, "default", {
        shown: !j($)
      }, void 0, !0)
    ], 16, Yp));
  }
}), or = /* @__PURE__ */ Y(ug, [["__scopeId", "data-v-2aa9c496"]]), dg = 60;
function fg(e, t) {
  const n = R([]), a = R(0);
  let s = -1, o = 0, l = !1;
  async function r() {
    const d = await e(["output", "page", String(t())]);
    return d.ok && (n.value = d.value.lines, a.value = d.value.first_byte, s = d.value.last_byte, o = d.value.cut_bytes), d;
  }
  async function i() {
    if (s < 0) return r();
    const d = await e(["output", "page", String(t()), "--after", String(s)]);
    return d.ok ? d.value.cut_bytes !== o || d.value.total < s ? r() : (d.value.lines.length && (n.value = [...n.value, ...d.value.lines]), s = d.value.last_byte, d) : d;
  }
  async function u(d) {
    if (l || a.value <= 0 || d.scrollTop > dg) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await ht(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const hg = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function lr(e) {
  var n;
  const t = hg[e] || ((n = Pt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const mg = (e) => lr(String(e).split(":")[0]), rr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), pg = { passed: "good", failed: "danger", warned: "warn", running: "" }, gg = { good: "good", warn: "warn", danger: "danger" }, $o = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => kd(e.target_model, e.target_id || 0)
}, vg = { "open row": (e) => mg(e.target_model), "open page": () => lr("pages") };
function yg(e, t) {
  const n = t || {}, a = $o[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? pg[e.outcome] || "" : gg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? vg[a](e) : "",
    handlers: a ? { onAct: () => $o[a](e) } : {}
  };
}
const bg = 2e3;
function ir(e, t, n = bg) {
  let a = null, s = !1, o = !1;
  const l = async (d) => {
    o = !0;
    try {
      await d();
    } catch {
    } finally {
      o = !1;
    }
  }, r = () => l(async () => t() && await e()), i = () => {
    s || document.hidden || (a = setTimeout(
      async () => {
        document.hidden || await r(), i();
      },
      typeof n == "function" ? n() : n
    ));
  }, u = async () => {
    s || document.hidden || o || (clearTimeout(a), await r(), i());
  };
  Le(async () => {
    document.addEventListener("visibilitychange", u), await l(e), i();
  }), _t(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
  });
}
const wg = 24, kg = 1e3, Mo = 2e3, xg = 0.25, $g = 5e3;
function Mg(e, t = wg, n = () => !0) {
  const a = R(!1), s = R(0), o = R(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const C = u();
    return C ? C.scrollHeight - C.scrollTop - C.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(C) {
    if (clearTimeout(l), !C) {
      o.value = !1, i = Date.now();
      return;
    }
    const b = Date.now() - i < Mo ? Mo : kg;
    l = setTimeout(() => o.value = a.value, b);
  }
  function p() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function y(C = !1) {
    const b = u();
    b && C && b.scrollTo ? b.scrollTo({ top: b.scrollHeight, behavior: "smooth" }) : b && (b.scrollTop = b.scrollHeight), p();
  }
  function $() {
    O(), !a.value && (a.value = !0, m(!0));
  }
  const M = () => !!u() && d() <= u().clientHeight * xg;
  function O() {
    clearTimeout(r), M() && (r = setTimeout(() => a.value && M() && n() && y(!0), $g));
  }
  function F() {
    f() ? p() : $();
  }
  function W(C = 1, b = !1) {
    a.value ? s.value += Math.max(0, C) : y(b);
  }
  return Xo() && fs(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: p, toBottom: y, left: $, scrolled: F, arrived: W };
}
const Sg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, _g = (e) => String(e ?? "").replace(Sg, ""), Eg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(null), { away: o, scrolled: l, arrived: r, toBottom: i } = Mg(s);
    me(
      () => n.lines.length,
      () => ht(() => r()),
      { immediate: !0 }
    );
    function u(d) {
      l(), a("older", d.target);
    }
    return (d, f) => (c(), h("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: u
    }, [
      Q(k(j(_g)(e.lines.join(`
`)) || e.empty), 1),
      j(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => j(i)(!0))
      }, "Follow")) : A("", !0)
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
    !n || typeof n.id != "number" || (n.type === "read" && this.send(n.id, await this.context.read(n.line)), n.type === "run" && this.send(n.id, await this.context.run(n.line)), n.type === "option" && this.send(n.id, { ok: !0, value: this.context.option(n.key).value ?? null }), n.type === "follow" && (this.context.follow(n.patterns, (a) => this.send(n.id, { ok: !0, value: a })), this.send(n.id, { ok: !0, value: null })));
  }
  send(t, n) {
    var a;
    (a = this.frame.contentWindow) == null || a.postMessage({ id: t, answer: n }, "*");
  }
}
const Tg = {
  key: 0,
  class: "frame-note"
}, Rg = {
  key: 0,
  class: "frame-note"
}, Ig = ["src", "title"], Bg = 1e3, Lg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ke(), a = R(null), s = R(!1), o = R(!1);
    let l = null, r = 0;
    return Le(() => {
      l = new Og(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Bg);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", Tg, "This window was closed because it stopped answering.")) : (c(), h(G, { key: 1 }, [
      s.value ? (c(), h("div", Rg, [
        u[2] || (u[2] = v("p", null, "This window has not answered for ten seconds.", -1)),
        D(de, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: P(() => [...u[1] || (u[1] = [
            Q("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : A("", !0),
      v("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: j(n).window
      }, null, 8, Ig)
    ], 64));
  }
}, Ng = /* @__PURE__ */ Y(Lg, [["__scopeId", "data-v-32a49046"]]), $n = (e) => e ? e.split(", ") : [];
function Dg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function jg(e, t) {
  return {
    reads: $n(e.reads_allowed),
    runs: $n(e.runs_allowed),
    missing: [...$n(e.reads_missing), ...$n(e.runs_missing)],
    ask: t
  };
}
const Pg = {
  class: "allowance-prompt",
  role: "dialog"
}, qg = { class: "allowance-prompt-text" }, Fg = { class: "allowance-prompt-buttons" }, Wg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Pg, [
      v("p", qg, k(j(Dg)(e.request)), 1),
      v("div", Fg, [
        D(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            Q("Allow", -1)
          ])]),
          _: 1
        }),
        D(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            Q("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Hg = /* @__PURE__ */ Y(Wg, [["__scopeId", "data-v-cad69fe2"]]), wa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), U(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        Q(k(e.reason) + " ", 1),
        e.retry ? (c(), U(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            Q("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (c(), U(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            Q("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Ug = ["data-window", "data-agent"], zg = {
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
    const n = e, a = t, s = R(""), o = R(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Ae(Di, null), i = pu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: B(() => n.options),
      declared: n.declared,
      page: Ae(cu, null),
      setOption: (f, m) => a("option", f, m),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, m) => {
        a("open", f, m), r == null || r(f, m);
      }
    });
    ii(Te, i), me(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Le(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), ci((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Gn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), U(Hg, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (p) => e.prompts.answer(p))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (c(), U(wa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), U(wa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(G, { key: 4 }, [
        (c(), U(u, { key: o.value })),
        e.skeleton.length && !j(i).answered.value ? (c(), U(Ss, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (c(), U(wa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (p) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Ug));
  }
}, Kt = /* @__PURE__ */ Y(zg, [["__scopeId", "data-v-c4443e2b"]]), cr = {
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
    const n = e, a = t, s = { render: () => Gn(Ng, { src: n.entry.entry_url }) };
    return (o, l) => (c(), U(Kt, {
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
      onOption: l[0] || (l[0] = (r, i) => a("option", r, i))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, Vg = ["data-window"], ur = {
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
    const n = e, a = t, s = Ve(null), o = R("");
    return me(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, xc();
          } catch (r) {
            if (wc(r) && kc(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      D(Ss, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Vg)) : (c(), U(Kt, {
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
      onOption: r[0] || (r[0] = (i, u) => a("option", i, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, Gg = "*.*", Kg = {
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
    const t = e, n = Ae(Te, null), a = new au();
    me(
      () => a.patterns,
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (p) => a.dispatch(p));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = B(() => !!(t.declaration.shipped || t.declaration.trusted)), r = B(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Gg] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), U(ur, {
      key: 0,
      entry: r.value,
      subscriptions: j(a),
      environment: j(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), U(cr, {
      key: 1,
      entry: r.value,
      subscriptions: j(a),
      environment: j(s),
      permissions: o,
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
}, Qg = "process", So = "task", e0 = {
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
    const t = e, n = Ae(Te), a = B(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = B(() => rr.has(t.mark.variant) && t.mark.detail || ""), o = B(() => t.mark.target_model === So ? t.mark.target_id : 0), l = fg(
      (p) => n.run(p),
      () => t.mark.target_id
    ), r = l.lines, i = R(!1), u = R(""), d = B(() => !t.declaration.body_url && t.mark.target_model === Qg && !!t.mark.target_id);
    async function f(p = l.follow) {
      const y = await p();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = B(() => t.shown && d.value);
    return me(m, (p) => p && f()), ir(() => m.value && f(), () => m.value && !t.mark.ended_at), me(
      () => t.mark.ended_at,
      (p) => p && m.value && f(l.newest)
    ), (p, y) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = xe(() => {
      }, ["stop"]))
    }, [
      v("div", Yg, [
        e.declaration.body_url ? (c(), U(Kg, {
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
            y[2] || (y[2] = v("p", { class: "mark-label" }, "Why it stopped", -1)),
            v("p", Jg, k(s.value), 1)
          ], 64)) : A("", !0),
          d.value && u.value ? (c(), h("p", Zg, k(u.value), 1)) : d.value && i.value ? (c(), h(G, { key: 2 }, [
            y[3] || (y[3] = v("p", { class: "mark-label" }, "Output", -1)),
            D(Ag, {
              class: "mark-terminal",
              lines: j(r),
              onOlder: j(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", Xg, k(a.value.join(`
`)), 1)) : A("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = xe(($) => j(qe)(`${So}:${o.value}`), ["stop"]))
          }, " Open task " + k(o.value) + " and its proofs ", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, es = /* @__PURE__ */ Y(e0, [["__scopeId", "data-v-f4d037e5"]]), t0 = ["title", "aria-label", "onClick"], n0 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, a0 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = B(() => Ku(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = R(""), s = Ae(Te);
    async function o(l) {
      const r = await rn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(G, null, [
      (c(!0), h(G, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: xe((u) => o(i), ["stop"])
      }, [
        D(ft, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, t0))), 128)),
      a.value ? (c(), h("span", n0, k(a.value), 1)) : A("", !0)
    ], 64));
  }
}, s0 = /* @__PURE__ */ Y(a0, [["__scopeId", "data-v-7a62c88e"]]);
function dr(e, t) {
  const n = Ve(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const fr = dr("/api/marks", "marks"), z5 = fr.fetchAll, o0 = fr.find, l0 = ["data-ref"], r0 = ["data-ref"], i0 = { class: "mark-row" }, c0 = "dock add", u0 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = B(() => o0(a.mark.type)), o = B(() => yg(a.mark, s.value)), l = B(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && rr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = R(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = B(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(c0));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, p;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": j(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        D(es, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, l0)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (p = s.value) == null ? void 0 : p.full_width, docked: e.docked, "user-side": j(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        v("span", i0, [
          D(or, Ge({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, ui(o.value.handlers), { onClick: i }), di({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: y }) => [
                D(es, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          D(s0, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, r0));
    };
  }
}, d0 = /* @__PURE__ */ Y(u0, [["__scopeId", "data-v-8196402d"]]), f0 = ["data-ref"], h0 = ["inert"], m0 = { class: "group-fold" }, p0 = { class: "thread-group" }, g0 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = R(!1), a = R(!1), s = R(!1), o = R(null);
    me(n, async (r) => {
      var i;
      a.value = !0, await ht(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = B(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      D(or, {
        mark: l.value,
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
        v("div", m0, [
          v("div", p0, [
            (c(!0), h(G, null, te(e.group.marks, (u) => (c(), U(d0, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, h0)) : A("", !0)
    ], 8, f0));
  }
}, V5 = /* @__PURE__ */ Y(g0, [["__scopeId", "data-v-45b58b9b"]]);
function v0(e) {
  const t = R(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Le(() => n.observe(e.value)), _t(() => n.disconnect()), t;
}
const y0 = { class: "chat-dock-fold" }, b0 = ["aria-label"], w0 = { class: "chat-dock-head" }, k0 = { class: "chat-dock-inner" }, x0 = { class: "chat-dock-foot" }, hr = 700, $0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = R(null), a = R(null), s = v0(a), o = R(!1);
    let l = 0;
    return Le(() => l = setTimeout(() => o.value = !0, hr)), _t(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      v("div", y0, [
        v("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          v("header", w0, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          v("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            v("div", k0, [
              v("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: ge(j(s) === null ? null : { height: `${j(s)}px` })
              }, [
                v("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(r.$slots, "still", {}, void 0, !0),
          v("footer", x0, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, b0)
      ])
    ], 2));
  }
}, mr = /* @__PURE__ */ Y($0, [["__scopeId", "data-v-74d44b19"]]), M0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ka = 5, S0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ka, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ka}s`, animationDelay: `${(n - ka).toFixed(2)}s` };
    return (s, o) => (c(), h("span", M0, [
      v("i", { style: a })
    ]));
  }
}, pr = /* @__PURE__ */ Y(S0, [["__scopeId", "data-v-2a7bc150"]]), _0 = { reviewing: "Under review" }, E0 = (e, t) => e || _0[t == null ? void 0 : t.state] || "", Xe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, A0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Xe],
  ready: [Xe],
  approved: [{ word: "start", label: "Start", main: !0 }, Xe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Xe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Xe],
  completed: [],
  cancelled: []
}, C0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Xe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Xe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Xe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Xe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, O0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], T0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], R0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], I0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], B0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], L0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function N0(e, t) {
  const n = { plan: A0, task: C0 }[e], a = t != null && t.state ? iu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[pl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const D0 = (e, t) => e === "doc" || e === "report" ? L0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...R0(t), ...T0(t)] : e === "check" ? B0(t) : e === "question" ? O0(t) : e === "memory" ? I0(t) : N0(e, t), gr = dr("/api/docks", "docks"), G5 = gr.fetchAll, Ut = gr.find, j0 = 6, P0 = 3, xa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ea = (e) => Date.parse(e.leaves_at) / 1e3, bt = (e) => !!(e.leaves_at && !e.kept), q0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!bt(e) || t < ea(e) || n.has(e.id)), F0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => q0(a, t, n)).sort((a, s) => a.id - s.id);
function W0(e, t, n = j0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ea(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const H0 = (e, t, n = e) => n < 2 ? !1 : e >= P0 ? !0 : t, U0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ts = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), z0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), V0 = (e) => ({ ...e.kept ? ts("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ts("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), G0 = ["pins"], K0 = (e) => ({ ...e, iconOnly: G0.includes(e.icon) });
function Y0(e, t) {
  var n;
  return [
    ...z0(e, t) ? [V0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Pt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ts("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(K0);
}
function J0(e, t) {
  const n = Y0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: U0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Z0 = ["title"], X0 = {
  key: 2,
  class: "dock-controls"
}, Q0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, ev = { class: "dock-facts" }, tv = { key: 1 }, nv = {
  key: 2,
  class: "dock-kept"
}, av = { class: "dock-acts" }, sv = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = B(() => Ut(a.item.type)), o = sr(), l = B(() => er(a.item.created_at, o.value * 1e3)), r = R(null), i = R(null), u = R(null), d = R(null), f = B(() => J0(a.item, s.value)), m = Ae(Te), p = R(null);
    let y = 0;
    async function $() {
      var L, x;
      const S = ++y, w = Gt(a.item.target_model ?? ""), I = `${w} show`;
      if (!((x = (L = s.value) == null ? void 0 : L.reads) != null && x.includes(I))) return;
      const _ = await it(a.item.type, [w, "show", String(a.item.target_id)], m.environment, m.signal);
      S === y && (p.value = _.ok ? { ..._.value, id: a.item.target_id, noun: w } : { id: a.item.target_id, noun: w });
    }
    me(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (S, w, I) => {
        var x;
        const _ = Gt(a.item.target_model ?? "");
        p.value = { id: a.item.target_id, noun: _ }, $();
        const L = (x = m.subscriptions) == null ? void 0 : x.follow(`dock ${a.item.id}`, [`${_.replaceAll("-", "_")}.*`], (g) => {
          (!g.row_id || g.row_id === a.item.target_id) && $();
        });
        I(() => {
          y += 1, L == null || L();
        });
      },
      { immediate: !0 }
    );
    const M = R(/* @__PURE__ */ new Set()), O = R("");
    async function F(S) {
      if (S.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      S.action === "declared" && (M.value = /* @__PURE__ */ new Set([...M.value, S.label])), O.value = "";
      const I = await rn(S, { id: a.item.target_id }, m.environment);
      (I == null ? void 0 : I.ok) === !1 && (M.value = new Set([...M.value].filter((_) => _ !== S.label)), O.value = `Could not ${S.label.toLowerCase()}: ${I.error}`);
    }
    const W = B(() => f.value.actions.filter((S) => S.action !== "undock" && !M.value.has(S.label))), C = B(() => {
      var S;
      return E0((S = s.value) == null ? void 0 : S.badge, p.value);
    }), b = B(() => f.value.buttons.find((S) => S.action === "undock"));
    return (S, w) => {
      var I, _, L, x;
      return c(), U(mr, {
        label: f.value.title + ((I = s.value) != null && I.needs_user ? ", waiting for you" : ""),
        type: (_ = s.value) != null && _.needs_user ? "waiting" : "",
        folded: !!((L = s.value) != null && L.folds) && e.folded,
        body: !!((x = s.value) != null && x.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: w[3] || (w[3] = (g) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (c(), U(pr, {
            key: 0,
            "ends-at": j(ea)(e.item)
          }, null, 8, ["ends-at"])) : A("", !0)
        ]),
        head: P(() => {
          var g, E;
          return [
            (g = s.value) != null && g.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(G, { key: 1 }, [
              D(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              v("span", {
                class: "dock-title",
                title: f.value.title
              }, k(f.value.title), 9, Z0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", X0, [
              (c(!0), h(G, null, te(f.value.controls, (T) => {
                var N, J;
                return c(), h(G, {
                  key: T.action + T.runs
                }, [
                  !M.value.has(T.label) && (!((N = T.variants) != null && N.length) || !((J = p.value) != null && J.state) || T.variants.includes(p.value.state)) ? (c(), U(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: T.pressed }),
                    "aria-pressed": T.pressed,
                    "aria-label": T.label,
                    title: T.label,
                    "data-dock-action": T.action,
                    onClick: (ee) => F(T)
                  }, {
                    default: P(() => [
                      D(ye, {
                        name: T.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : A("", !0)
                ], 64);
              }), 128))
            ])) : A("", !0),
            v("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (E = s.value) != null && E.leaves_after_seconds ? A("", !0) : (c(), h(G, { key: 0 }, [
                Q(k(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: P(() => [
          O.value || e.refusal ? (c(), h("p", Q0, k(O.value || e.refusal), 1)) : A("", !0)
        ]),
        foot: P(() => {
          var g, E;
          return [
            v("span", ev, [
              C.value ? (c(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, k(C.value), 3)) : A("", !0),
              (g = s.value) != null && g.word ? (c(), h("span", tv, k(s.value.word), 1)) : A("", !0),
              v("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", nv, "Kept")) : A("", !0)
            ]),
            (E = s.value) != null && E.folds ? (c(), U(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: w[0] || (w[0] = (T) => n("fold"))
            }, {
              default: P(() => [
                Q(k(s.value.folds) + " ", 1),
                D(xt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : A("", !0),
            v("span", av, [
              v("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              D(id, {
                name: `dock.${e.item.type}`,
                row: p.value,
                environment: j(m).environment,
                "read-only": j(m).readOnly,
                "object-name": j(Gt)(e.item.target_model),
                "external-failure": "",
                onFailure: w[1] || (w[1] = (T) => O.value = T),
                onDone: $
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (c(!0), h(G, null, te(W.value, (T) => (c(), U(de, {
                key: T.action + T.runs,
                small: "",
                variant: T.primary ? "primary" : "ghost",
                bordered: !T.primary,
                "data-dock-action": T.action,
                onClick: (N) => F(T)
              }, {
                default: P(() => [
                  Q(k(T.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              D(de, {
                small: "",
                bordered: "",
                title: b.value.label,
                "data-dock-action": "undock",
                onClick: w[2] || (w[2] = (T) => n("undock", b.value))
              }, {
                default: P(() => [...w[4] || (w[4] = [
                  Q("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: P(() => {
          var g;
          return [
            (g = s.value) != null && g.body_url ? (c(), U(es, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: u.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : A("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, _o = /* @__PURE__ */ Y(sv, [["__scopeId", "data-v-460364d0"]]), ov = ["title", "aria-label"], lv = { class: "run-chip-in" }, rv = {
  key: 0,
  class: "run-chip-ring"
}, iv = { class: "run-chip-name" }, cv = { class: "run-chip-bar" }, uv = "processes.output", dv = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ae(Te, null), o = (s == null ? void 0 : s.environment) ?? "", l = R(null), r = B(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = B(() => {
      var m, p;
      return ((m = l.value) == null ? void 0 : m.title) || ((p = l.value) == null ? void 0 : p.line) || a.item.title || "";
    }), u = B(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await it(uv, ["process", "card", String(a.item.target_id)], o, s == null ? void 0 : s.signal);
      m.ok && (l.value = m.value);
    }
    let f = null;
    return Le(() => {
      var m;
      d(), f = (m = s == null ? void 0 : s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (p) => {
        (!p.row_id || p.row_id === a.item.target_id) && d();
      });
    }), _t(() => f == null ? void 0 : f()), (m, p) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": u.value })
      }, [
        j(bt)(e.item) ? (c(), U(pr, {
          key: 0,
          "ends-at": j(ea)(e.item)
        }, null, 8, ["ends-at"])) : A("", !0),
        v("span", lv, [
          r.value ? (c(), h("span", rv)) : (c(), U(ft, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          v("span", iv, k(i.value), 1)
        ]),
        v("span", cv, [
          v("i", {
            style: ge({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, ov);
    };
  }
}, fv = /* @__PURE__ */ Y(dv, [["__scopeId", "data-v-f864bc58"]]), hv = 24, mv = 8, K5 = 420;
function Y5({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= hv ? !0 : e < t && s > mv ? !1 : null;
}
const pv = (e, t) => e === void 0 ? t : e, gv = { me: 1, people: [] }, qn = Yn({
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
  people: gv,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Ln("journal.activity", !0),
  wide: !1,
  sideMini: Ln("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ol("journal.activity", () => qn.activity);
Ol("journal.side.mini", () => qn.sideMini);
const vr = "journal.viewer.";
function vv(e, t, n) {
  try {
    const a = n.getItem(vr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function yv(e, t, n) {
  try {
    n.setItem(vr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Eo(e, t, n = window.localStorage) {
  const a = R(vv(e, t, n));
  return me(a, (s) => yv(e, s, n), { deep: !0 }), a;
}
const bv = {
  key: "dock-all",
  class: "dock-all"
}, wv = {
  key: "runs-head",
  class: "dock-runs-head"
}, kv = { class: "dock-runs-title" }, xv = { class: "dock-runs-chips" }, $v = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var x, g;
    const t = e, n = Up(500), a = R(/* @__PURE__ */ new Set()), s = R(!1), o = R(!1), l = Ae(Te), r = R(/* @__PURE__ */ new Set()), i = R({});
    async function u(E, T) {
      i.value = { ...i.value, [E.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, E.id]);
      const N = await rn(T, { id: E.target_id }, l.environment);
      (N == null ? void 0 : N.ok) === !1 && (r.value = new Set([...r.value].filter((J) => J !== E.id)), i.value = { ...i.value, [E.id]: `Could not close this card: ${N.error}` });
    }
    const d = B(
      () => F0(
        t.items.filter((E) => !r.value.has(E.id)),
        n.value,
        a.value
      )
    ), f = B(
      () => W0(
        d.value.filter((E) => xa(E, Ut)),
        n.value
      )
    ), m = B(() => d.value.filter((E) => !f.value.includes(E) && !xa(E, Ut))), p = B(() => f.value.filter((E) => !bt(E))), y = Eo(`dock-size:${((x = qn.identity) == null ? void 0 : x.root) || location.host}`, null), $ = (E) => y.value ? y.value.collapsed && !y.value.opened.includes(E.id) : t.collapsed, M = B(() => d.value.some($)), O = B(() => (s.value = H0(f.value.length, s.value, p.value.length)) && !o.value && !d.value.some($));
    function F() {
      y.value = { collapsed: !M.value, opened: [] };
    }
    function W(E) {
      var N;
      if (!$(E)) return;
      const T = (N = y.value) != null && N.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...T, E.id] };
    }
    const C = Eo(`dock-folded:${((g = qn.identity) == null ? void 0 : g.root) || location.host}`, {}), b = (E) => {
      var T;
      return !!((T = Ut(E.type)) != null && T.folds) && pv(C.value[E.id], xa(E, Ut) || t.folded);
    };
    function S(E) {
      C.value = { ...C.value, [E.id]: !b(E) };
    }
    function w(E) {
      C.value = { ...C.value, ...Object.fromEntries(f.value.map((T) => [T.id, T.id !== E.id])) }, o.value = !0;
    }
    function I() {
      C.value = Object.fromEntries(Object.entries(C.value).filter(([E]) => !f.value.some((T) => String(T.id) === E))), o.value = !1;
    }
    function _(E) {
      a.value = /* @__PURE__ */ new Set([...a.value, E.id]);
    }
    function L(E) {
      a.value = new Set([...a.value].filter((T) => T !== E.id));
    }
    return (E, T) => (c(), U(Zo, {
      tag: "div",
      name: "dock",
      duration: j(hr),
      class: "dock-stack"
    }, {
      default: P(() => [
        d.value.length > 1 ? (c(), h("div", bv, [
          D(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            onClick: F
          }, {
            default: P(() => [
              Q(k(M.value ? "Open all" : "Collapse all"), 1),
              D(xt, {
                open: !M.value
              }, null, 8, ["open"])
            ]),
            _: 1
          })
        ])) : A("", !0),
        (c(!0), h(G, null, te(m.value, (N) => (c(), U(_o, {
          key: N.id,
          item: N,
          class: Z({ timed: j(bt)(N) }),
          leaving: j(bt)(N) && !a.value.has(N.id),
          folded: b(N),
          collapsed: $(N),
          refusal: i.value[N.id],
          onOpen: (J) => W(N),
          onFold: (J) => S(N),
          onUndock: (J) => u(N, J),
          onMouseenter: (J) => _(N),
          onMouseleave: (J) => L(N)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !M.value ? (c(), h("div", wv, [
          v("span", null, k(f.value.length) + " runs", 1),
          D(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: I
          }, {
            default: P(() => [
              T[1] || (T[1] = Q(" Runs ", -1)),
              D(xt, { open: "" })
            ]),
            _: 1
          })
        ])) : A("", !0),
        (c(!0), h(G, null, te(O.value ? [] : f.value, (N) => (c(), U(_o, {
          key: N.id,
          item: N,
          class: Z({ timed: j(bt)(N) }),
          leaving: j(bt)(N) && !a.value.has(N.id),
          folded: b(N),
          collapsed: $(N),
          refusal: i.value[N.id],
          onOpen: (J) => W(N),
          onFold: (J) => S(N),
          onUndock: (J) => u(N, J),
          onMouseenter: (J) => _(N),
          onMouseleave: (J) => L(N)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        O.value ? (c(), U(mr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: P(() => [
            D(ye, {
              name: "runs",
              size: 14
            }),
            v("span", kv, k(f.value.length) + " runs", 1)
          ]),
          foot: P(() => [
            v("span", xv, [
              (c(!0), h(G, null, te(f.value, (N) => (c(), U(fv, {
                key: N.id,
                item: N,
                onClick: (J) => w(N)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            D(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: T[0] || (T[0] = (N) => o.value = !0)
            }, {
              default: P(() => [
                T[2] || (T[2] = Q(" Runs ", -1)),
                D(xt)
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
}, J5 = /* @__PURE__ */ Y($v, [["__scopeId", "data-v-ea618218"]]), kt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Tn = (e) => Math.min(Math.max(e, 0), 1), Mv = (e) => {
  const t = Tn(e);
  return t * t * (3 - 2 * t);
}, pt = (e, t, n) => Mv((e - t) / (n - t));
function Z5(e) {
  const t = Tn(e), n = Tn((t - 0.12) / 0.76) * kt.shuffles, a = Math.min(Math.floor(n), kt.shuffles - 1), s = n - a, o = pt(s, 0.26, 0.38) * (1 - pt(s, 0.76, 0.96)), l = pt(s, 0.38, 0.76), r = pt(t, 0, 0.12) * (1 - pt(t, 0.88, 1)), i = pt(s, 0.2, 0.34) * (1 - pt(s, 0.84, 1)), u = Math.sin(Math.PI * Tn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / kt.shuffles, lift: kt.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function X5(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Ao = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, Q5 = (e) => Ao[e] ?? Ao.butler, _s = 2400, Sv = 0.05;
function _v({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, Sv), l = Math.min(t + _s * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function e4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function Ev(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function t4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const n4 = (e, t) => ({ ...e, stretch: t.stretch }), a4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, yr = (e, t) => t >= (e.least ?? 0);
function s4(e, t, n) {
  if (!yr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const o4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Av = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Co = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Cv = (e) => e.right > e.left && e.bottom > e.top;
function l4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(Av)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Co(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Co(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), Cv(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function br(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const p = t[d] - e[d];
      if (Math.abs(p) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const y = (o[f] - e[d]) / p, $ = (o[m] - e[d]) / p;
        l = Math.max(l, Math.min(y, $)), r = Math.min(r, Math.max(y, $));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, u = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: u, on: "surface", surface: s.id, dx: i - s.left, dy: u - s.top };
  }
  return a;
}
const _e = {
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Ov = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => Ov(tn(e, t, n)), Tv = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ct = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Mn = ([e, t], n) => e + n() * (t - e);
function Rv(e) {
  return Tv.map(() => {
    const t = Mn(ct.speed, e), n = Mn(ct.angle, e) * Math.PI / 180, a = Mn(ct.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Mn(ct.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Iv = Rv(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Bv(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ct.gravity * (t[2] - ct.floor))) / ct.gravity;
}
function r4(e, t, n = Iv) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Bv(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= ct.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const i4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function c4(e, t) {
  const n = e.map((o) => Math.sqrt(o)), a = n.reduce((o, l) => o + l, 0);
  let s = Math.min(Math.max(t, 0), 1) * a;
  for (const [o, l] of n.entries()) {
    if (s <= l || o === n.length - 1) {
      const r = l > 0 ? Math.min(s / l, 1) : 1;
      return { index: o, s: r, height: e[o] * 4 * r * (1 - r) };
    }
    s -= l;
  }
  return { index: 0, s: 1, height: 0 };
}
const u4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function d4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function f4(e, t, n) {
  const a = _e.bug_smash, s = Ee(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Lt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Lt.tall * n * (1 - Ee(t, a.emerge)),
      turn: 90 * (1 - Ee(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ee(t, a.gone)
    }
  };
}
function h4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = _v({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function m4(e) {
  const t = Ie.least + Math.floor(e() * (Ie.most - Ie.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ie.walls[Math.floor(e() * Ie.walls.length)],
    along: Ie.margin + e() * (1 - 2 * Ie.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ns(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ie.margin, l = ((e.along - Ie.margin + e.way * Ie.speed * n / a) / s % 2 + 2) % 2, r = Ie.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function Lv(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = Ev(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function p4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = Lv(n, e.length), u = e.map((O, F) => ({ ...ns(O, t, Math.min(n / o.fps, Rn(F).shot)), shot: F < i })), d = Ee(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], p = e.map((O, F) => ({ bug: O, index: F, seconds: n / o.fps - Rn(F).shot, spot: ns(O, t, Rn(F).shot) })).filter((O) => O.seconds >= 0), y = p.flatMap((O) => {
    const F = (s == null ? void 0 : s.get(O.index)) ?? qv(O.bug, t, O.spot, s ? [] : a);
    return s == null || s.set(O.index, F), s && Fv(F, O.seconds, a), Wv(F, O.seconds, a);
  }), $ = p.filter((O) => jv(O.bug)).map((O) => ({ seconds: O.seconds, from: O.spot })), M = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: M }, slush: y, camera: $ };
}
function Rn(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function g4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = Rn(d), m = ns(u, t, f.shot), p = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), $ = Math.abs(m.x - i) >= p ? i : m.x + y * p, M = y > 0 ? Math.max(i, Math.min($, r)) : Math.min(i, Math.max($, l)), O = { from: i, to: M, begin: f.walk, end: f.aim };
    return i = M, O;
  });
}
function v4(e, t, n) {
  var o;
  const a = _e.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Ee(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Nv = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Dv(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const jv = (e) => e.along * 97 % 1 < $e.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function Pv(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += $e.step) {
    const d = Math.min(u + $e.step, l.t), f = nn(e, d), m = br(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = nn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function qv(e, t, n, a = []) {
  const s = Dv(e.along + 1), [o, l] = Nv[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...Pv(d, t, a) };
  });
}
function Fv(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += $e.step) {
      const l = Math.min(o + $e.step, s), r = br(nn(a, o), nn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function Wv(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...nn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, u = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function y4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ee(e, [0, u]), m = Ee(e, [u, u + d]);
  return l.map((p) => {
    const y = { x: a.x + p.at[0] * t, y: a.y + p.at[1] * t };
    return {
      x: n.x + (y.x - n.x) * f,
      y: n.y + (y.y - n.y) * f,
      r: p.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function b4(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = ($) => {
    const [M, O] = [$.x - e.at.x, $.y - e.at.y];
    return { x: r.x + M * u - O * d, y: r.y + M * d + O * u };
  }, [m, p] = [...n].sort(($, M) => $.x - M.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map(($, M) => ({ from: $, to: M < y.length / 2 ? m : p })) };
}
const w4 = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function Fn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function k4(e, t) {
  const n = _e[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Fn(n, t), l = 1 - (1 - n.small) * Ee(a, n.shrinks) * (1 - Ee(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Fn(n, t), o = n.flat * Ee(a, n.squashes) * (1 - Ee(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * tn(s, ...n.springs)) * (1 - tn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const x4 = (e) => e === "pack_box";
function $4(e) {
  const { into: t, out: n } = Fn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function M4(e) {
  const t = _e.rope_swing, { into: n, out: a } = Fn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Hv = { after: 3 }, Es = 10, Uv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, zv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Vv = { weight: 19 }, wr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Gv = { every: 120 }, kr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, xr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Kv = {
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
}, un = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Es }), ne = (e, t, n = {}) => un(e, "clip", t, n), $a = (e, t, n = {}) => un(e, "look", t, n), Oo = (e, t, n = {}) => un(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...un(e, "pick", t, n), ...a }), we = (e) => un("nothing", "nothing", e, {}), Yv = 120, Jv = 300, Ma = (e, t) => ({ ...ne(e, t), cooldown: Jv }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), Zv = () => [ne("joy", 2)], gt = (e, t, n, a, s = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), vt = (e) => ({ ...e, cooldown: Uv[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: zv[e.name] }), ta = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...le("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ne("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...le("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...vt(ne("bug_shot", 3)), toward: "", onto: !1 },
    { ...vt(ne("bug_smash", 2)), toward: "", onto: !1 },
    ne("nod", 2)
  ]),
  ...le("tests_failed", { cooldown: 20, toward: "card" }, [ne("startled", 2), ne("dismay", 1), ne("tantrum", 3), we(1)]),
  ...le("committed", { cooldown: 30, toward: "card", onto: !0 }, [ne("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...le("sin_fixed", { cooldown: 300 }, [ne("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...le("sin_committed", { cooldown: 300 }, [ne("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...le("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ne("nod", 4), ne("hand_rub", 4), we(7)]),
  ...le("question_asked", { cooldown: 60 }, [ne("ask_sign", 9), ne("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...le("reported", { cooldown: 90 }, [Oo("read", 3), ne("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...le("read_message", { cooldown: 30 }, [Oo("read", 3), we(1)]),
  ...le("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), we(6)]),
  ...le("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...le("bar_done", { holds: !0 }, Zv()),
  ...le("bar_failed", { holds: !0 }, [ne("fume", 1), ne("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...le("standing", { cooldown: 12 }, [ne("look_left", 2), ne("look_right", 2), ne("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...le("launched", { cooldown: 300 }, [ne("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...le("building", { cooldown: 30 }, [ne("wipe_brow", 4), ne("look_left", 1), ne("look_right", 1), we(69)]),
  ...le("failed", { cooldown: 20, toward: "card" }, [ne("shake", 3), ne("tantrum", 2), we(2)]),
  ...le("refused", { cooldown: 20 }, [ne("shake", 1), we(1)]),
  ...le("work_done", { cooldown: 120 }, [ne("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...le("pondering", { cooldown: [30, 60] }, [pe("ponder", 1)]),
  ...le("thought_cloud", { cooldown: 90 }, [pe("cloud", 1)]),
  ...le("light_bulb", { cooldown: 150 }, [pe("bulb", 1)]),
  ...le("answered", { cooldown: 15 }, [$a("amused", 3), we(2)]),
  ...le("heard", { cooldown: 30 }, [
    ne("bow", 1, { voices: ["butler"] }),
    ne("salute", 1, { voices: ["squire"] }),
    ne("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...le("long_walk", { cooldown: 90 }, [ne("stumble", 3), we(22)]),
  ...le("card_arrived", { cooldown: 20, toward: "card" }, [ne("glance", 7), we(13)]),
  ...le("typing", { cooldown: 60 }, [$a("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Kv).flatMap(([e, t]) => le(`reacted:${e}`, {}, [$a(t, 1)])),
  ...Object.entries(kr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => le(`agent_reacted:${n}`, {}, [ne(a, 1, { voices: [e] })])[0])),
  ...Object.entries(xr).flatMap(([e, t]) => le(`agent_reacted:${e}`, {}, [ne(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...le("pastime", {}, [
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
    { ...Wt(vt(ne("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(vt(ne("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...le("held:search", { cooldown: Yv }, [Ma("search", 3), { ...Ma("binoculars", 2), when: { home: !0 } }, { ...Ma("glass_bubble", 2), when: { bubble: !0 } }]),
  ...le("held:type", {}, [ne("type", 3), ne("type_ponder", 1)]),
  ...le("held:compacting", {}, [ne("pack_box", 3), ne("vacuum", 2), ne("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...le("spell", {}, [pe("writing", 12, { state: "writing" }), pe("reading", 12, { state: "reading" }), pe("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...le("tickled", {}, [{ ...vt(ne("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...le("eager", {}, [ne("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...le("jump", {}, [Wt(vt(ne("backflip", 7, { high: !0 }))), ne("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...le("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...le("unit", { cooldown: wr.build.cooldown }, [pe("unit", Vv.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: Gv.every }, pe("stand", 5)]),
  // a digit a blow's dust lets out
  ...le("digit", {}, [pe("0", 1), pe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...le("roam", {}, [
    pe("rest", 35, {}, { stay: [25, 60] }),
    pe("seat", 15, {}, { stay: [15, 40] }),
    pe("edge", 25, {}, { stay: [8, 20] }),
    Wt(pe("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    pe("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    pe("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    pe("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    pe("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    pe("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Wt(vt(pe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...le("laptop", {}, [pe("seat", 6, {}, { stay: [60, 150] }), pe("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...le("ledge_at", {}, [pe("middle", 2, {}, { along: 1 / 2 }), pe("third", 1, {}, { along: 1 / 3 }), pe("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...le("composed_as", {}, [
    pe("facing", 4, {}, { turn: 0, leans: 0 }),
    pe("turned_left", 1, {}, { turn: 335, leans: 0 }),
    pe("turned_right", 1, {}, { turn: 25, leans: 0 }),
    pe("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    pe("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], $r = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Mr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Xv = (e) => Array.isArray(e) ? e[0] : e, Qv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, ey = (e) => ta.some((t) => t.when.moment === e);
function ty(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Mr(d).every(([f, m]) => n(f) >= Xv(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ta.filter((d) => $r(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Hv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function He(e, t) {
  const n = ty(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Sr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Sr(e, t, n) {
  var a;
  for (const [s, o] of Mr(t)) (a = e.memory) == null || a.set(s, e.now + Qv(o, n));
}
function S4(e, t, n) {
  Sr(e, ta.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const _4 = (e) => Object.values(wr).find((t) => $r(t.when, e)) ?? null, ny = (e, t, n) => n - t <= (e.lifetime ?? Es), E4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || yr(e.clip, t));
class _r {
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
const as = {
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
}, A4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Er = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), C4 = {
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
}, O4 = 120, ay = 20, T4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < ay), sy = (e) => as[e] || as.idle, R4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Ar = "airborne", oy = "landing", ly = "travelling", Cr = "grounded", I4 = ({ airborne: e, landing: t, trip: n }) => e ? Ar : t ? oy : n != null && n.started ? ly : Cr;
function B4(e, t) {
  var s;
  const n = ry(e, t);
  return e.mode === Cr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function ry(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Ar && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...iy(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const p = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: p ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : sy(u), facing: p ? m : r.posture === "sit" ? r.face : f };
}
function iy(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ss = (e) => e.outcome, cy = "plugin:code-commandments:sins:", To = (e) => e.type === "plugins.card" && e.markKey.startsWith(cy), uy = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => To(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => To(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], L4 = (e, t) => e.filter((n) => n.author === "user" && jn(n.read_at) > t).map((n) => ({ beat: "read_message", time: jn(n.read_at), card: zl(n) })).sort((n, a) => n.time - a.time), Ro = { user: "reacted", agent: "agent_reacted" };
function N4(e, t) {
  return e.filter((n) => Ro[n.author] && Mt(n) > t).map((n) => ({ beat: `${Ro[n.author]}:${n.emoji}`, time: Mt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const dy = [.../* @__PURE__ */ new Set([...Object.values(kr).flatMap((e) => Object.keys(e)), ...Object.keys(xr)])];
function D4(e, t) {
  return e.filter((n) => n.author === "agent" && Mt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = dy.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Mt(n), card: zl(n) })).sort((n, a) => n.time - a.time);
}
const fy = (e) => new _r(e).isTest(), Wn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ss(e)] || "";
}, hy = 1800, my = (e, t) => {
  if (Wn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Wn(n) !== "finished" && Number(e.time) - Number(n.time) <= hy ? "tests_fixed" : "tests_passed";
};
function j4(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(fy), s = a.filter((r) => Wn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Wn(r))), o.map((r) => ({ beat: my(r, s), time: Number(r.time), card: r.key }));
}
function P4(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ss(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ss(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const q4 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Mt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function F4(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function W4(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function H4(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = uy.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function As(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Io = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function py(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    As(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function U4(e, t, n, a = {}) {
  const s = He({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : ey(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function z4(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const Bo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function V4(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, r = o % Re.sweep, i = Re.sweep - Re.returnSeconds, u = Bo((r - i) / Re.returnSeconds), d = r <= i ? Bo(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Lo = 3, Or = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, No = 12, G4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function K4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Or(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Lo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * No) / No, lasts: Lo } };
}
const Y4 = (e) => e.posture === "hang" && !Or(e.face), gy = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), vy = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function J4(e, t, n) {
  return gy.has(e) ? 1 / 0 : !vy.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Tr(n - t.began, t.share) - Qe.lead, 0);
}
const yy = 5;
function Z4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= yy ? { beat: "long_walk", time: n } : null };
}
const by = 30, Sn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function X4(e, t, n, a, s = null) {
  if (t && n < t.until || !Sn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = He({ moment: "spell", state: e, tally: s }, a), [l, r] = Sn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + Sn.every } : { state: e, began: 0, until: 0, next: n + Sn.every };
}
const Q4 = (e, t, n) => t && n < t.until && Er.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Tr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function ex(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Tr(o, e.share);
  return s ? { eager: wy(t, l), moment: null } : l > Qe.lead ? { eager: t, moment: null } : l < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = He({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function wy(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const ky = 1, xy = { look: "look", gaze: "gaze" };
function $y(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = He({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [xy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const My = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => He({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Sy = (e, t, n, a, s, o = 0) => He({ moment: "jump", high: e > ky * t, memory: a, now: s, room: o }, n).name === "backflip", _y = { work: ["building"], idle: ["standing"] };
function tx(e, t, n, a) {
  const s = as[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(_y[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Er.has(e) ? { moments: o, began: n || a } : (n && a - n >= by && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Ey(e, t, n) {
  return !He({ moment: "pondering", memory: e, now: t }, n) || !He({ moment: "thought_cloud", memory: e, now: t }, n) ? null : He({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Do = { pondering: Ey };
function nx(e, t, n, a, s, o) {
  if (Do[e.beat]) {
    const r = Do[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = $y(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Es && { lifetime: l.lifetime } } } : null;
}
function ax(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = My(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const sx = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function ox(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function lx(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const rx = (e, t) => !!(e != null && e.watches) && !t.once, ix = 10, cx = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || ny(a, a.queuedAt, n)), ux = (e, t) => t ? null : e[0] ?? null;
function dx(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const fx = (e, t) => !t.during || !e.some((n) => n.during === t.during), Ay = 2 * Math.PI, Cy = 500;
function hx(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Cy, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Ay * l / 1e3, p = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, $ = (u ? p : t != null && t.behind && t.mood === "reading" ? { ...t } : t && p && !i ? s && !t.behind && !p.behind ? Ty(p, t, n, m, s) : Iy(p, t, n, m) : t) ?? p, M = $ != null && $.behind && $.mood === "reading" ? Oy(e.point, $, n, l, s) : $;
  return { point: M ?? null, toward: M ? { x: M.x - n.x, y: M.y - n.y } : null, amount: f, at: a };
}
function Oy(e, t, n, a, s) {
  const o = (_) => _ * 180 / Math.PI, l = (_) => o(Math.atan2(Math.sin(_ * Math.PI / 180), Math.cos(_ * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, p = f ? e.readingYaw + m : d, y = p + l(u - p), $ = Math.min(Math.max(a / 1e3, 0), 0.1), M = Re.turnSpeed * $, O = f ? p + Math.min(Math.max(y - p, -M), M) : y, F = f ? e.readingFollow + m : O, W = F + (O - F) * (1 - Math.exp(-$ / Re.followSeconds)), C = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, b = o(As(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), S = Math.min(Math.max(b, -C.up), C.down), w = Re.tipSpeed * $, I = f ? e.readingPitch + Math.min(Math.max(S - e.readingPitch, -w), w) : S;
  return { ...t, readingYaw: O, readingFollow: W, readingPitch: I, readingFacing: r };
}
function Ty(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (F) => {
    const { yaw: W, pitch: C } = As(F.x - n.x, s, n.y - F.y, o);
    return { yaw: W, pitch: Math.min(Math.max(C, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [Io(r(e)), Io(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, p] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, $, M] = i.map((F, W) => m * F + p * u[W]), O = s * y / $;
  return { ...t, x: n.x + O, y: n.y - py(O, s, -Math.asin(Math.min(Math.max(M, -1), 1)), o) };
}
const Ry = 0.15;
function mx(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Ry;
}
function Iy(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const By = (e) => !(e != null && e.on);
function px(e, t, n) {
  if (By(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Sa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), jo = (e) => e * e * (3 - 2 * e);
function Ly(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = Sa(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, a = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - jo(Sa(e, ...Je.fade)), lit: a, white: e < Je.flash[0] ? 0 : 1 - jo(Sa(e, ...Je.flash)) };
}
const gx = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function vx(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Ly(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...a } };
}
function yx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function bx(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function wx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, kx = { behind: 39, figure: 40, ahead: 41 }, Ny = "[data-figure-pile]", Dy = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, In = { phases: 4, ms: 230, dim: 0.25 }, xx = (e, t, n) => e !== "amber" || (t + n) % In.phases < In.phases / 2 ? 1 : In.dim, $x = (e) => e === "amber" ? In.phases : 1;
function Mx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const Sx = Object.keys(Dy), Ue = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, zt = ([e, t], n) => e + n() * (t - e);
function _x(e) {
  const t = Ue.least + Math.floor(e() * (Ue.most - Ue.least + 1));
  return Array.from({ length: Math.min(t, Ue.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ue.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = zt(Ue.start, e), l = zt(Ue.reach, e);
    return {
      text: He({ moment: "digit" }, e).name,
      x: a * o,
      y: Ue.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(zt(Ue.moveMs, e)),
      fadeMs: Math.round(zt(Ue.fadeMs, e))
    };
  });
}
const _a = { high: 3, gap: 1 };
function Ex(e) {
  const t = Math.floor(e / _a.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + _a.gap)), up: e % _a.high * (rt.height - rt.top) };
}
const jy = (e, t, n) => He({ moment: "unit", memory: e, now: t }, n) !== null, Py = { after: 5 }, qy = (e) => e.filter((t) => t.active && (t.process || t.watch) && new _r(t).isBuild());
function Ax(e, t, n) {
  const a = qy(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Py.after ? s : null;
}
function Cx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: jy(n, a, s) } : null;
}
const Po = { ahead: 140, up: 70 };
function Ox(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Po.ahead, y: a - Po.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ea = { least: 4e3, most: 1e4 }, Fy = (e) => Ea.least + e() * (Ea.most - Ea.least), yt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function Tx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Fy(t);
    if (n.length >= yt.most || t() >= yt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (yt.at[0] + t() * (yt.at[1] - yt.at[0]));
    n.push({ from: o, to: o + yt.ms }), a = o + yt.ms;
  }
}
const Rx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), Ix = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Rr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), Bx = new Set(ta.filter((e) => Rr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Wy = (e) => e.some((t) => t.state === "built"), Lx = (e, t) => Wy(t) ? e.filter((n) => !Rr.has(n.beat)) : e, dt = { reach: 40, room: 6 }, Hy = (e, t) => t <= e - dt.reach + 2, Nx = (e, t, n) => Hy(e, n) ? t - dt.reach : e - dt.reach - dt.room, Dx = (e, t, n, a) => a > 0 && t < e && t + dt.reach >= e - 2 ? Math.min(n, Math.max(e, t + dt.reach)) : e, Aa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, jx = (e) => zt(e() < Aa.longShare ? Aa.long : Aa.short, e), Uy = 2 * rt.width;
function Px(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Uy ? o : e + (o - e + s / 2) % s;
}
const zy = 60, qx = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= zy, qo = "[data-figure-home]", dn = () => {
  var t;
  const e = document.querySelector(qo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(qo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Vy = "[data-figure-docked-bars]", Gy = "[data-figure-chat-foot]", Ky = [0.85, 0.6, 0.35, 0.15], Yy = ["question", "waiting", "suggestion"], Fx = (e, t) => Yy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Wx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Jy = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Zy = "[data-figure-newest]";
function Ir() {
  var a, s;
  const e = (a = dn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Zy), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Cs(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function sn(e, t, n = Ir()) {
  if (!e || !n) return !0;
  const a = at(e, t), s = aa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Oe.top * t.size, bottom: a.top + Oe.bottom * t.size }, l = kt.gap;
  return !na(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function Hx(e, t, n, a = Ir()) {
  if (!a || sn(t, e, a)) return null;
  const s = aa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Ct(), i = t.posture === "stand" ? Ts * e.size : Fr * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - kt.gap - l, a.right + kt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && sn(m, e, a) && _b(m, e)).sort((m, p) => Math.abs(m.x - t.x) - Math.abs(p.x - t.x))[0] ?? null;
}
const Ca = 0.26, Br = 0.54, Xy = 1.25 / 5.4, fn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ca, travels: "stand" },
  lounge: { drop: Ca, travels: "stand" },
  composed: { drop: Ca, travels: "stand" },
  hang: { drop: Br, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Ux = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Xy * Math.cos(t * Math.PI / 180),
  y: 1 - n - Br
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Qy = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), zx = (e, t) => (e === "sit" ? Qy.has(t) : Yt.has(e)) ? e : "stand";
function Vx(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const Gx = 0.25, Kx = (e, t) => Yt.has(e) && fn[t].drop === 0, Lr = 2, eb = 90, tb = 180, nb = 140, ab = 280, sb = 420, ob = 0.25, lb = 290, rb = 600, ib = "cubic-bezier(0.2, 0.7, 0.4, 1)", cb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Oa = 5;
function Hn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Oa) return null;
  (l || r) && (o = Math.max(o, Lr));
  const p = o > 1, y = Math.abs(t.x - e.x), $ = y < Oa ? 0 : y / (eb * o) * 1e3, M = Math.min($, p ? nb : tb), O = Math.abs(t.y - e.y), F = t.y < e.y, W = F && !m && Sy(O, n, i, u, d, f), C = F ? sb + Math.min(O, 400) * ob : Math.sqrt(2 * O / _s) * 1e3, b = {
    x: t.x,
    y: t.y,
    ms: O > Oa ? W ? rb : C : 0,
    lead: W ? lb : F ? ab : 0,
    easing: F ? ib : cb,
    hopping: !0,
    clip: W ? "backflip" : F ? "jump" : "fall"
  }, S = { x: t.x, y: t.y, ms: $ + M, lead: 0, easing: "linear", ramp: M, ...p ? { clip: "run" } : {} }, w = m ? ub(t, n) : b, I = F && !a ? [{ ...S, y: e.y }, w] : [{ ...b, x: e.x }, S];
  return { way: Math.sign(t.x - e.x) || 1, legs: I, lands: !s, pace: o, running: p };
}
const ub = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), db = (e, t) => e.postures.includes(t) ? t : e.postures[0], Yx = (e, t, n) => e.posture === "walk" && n ? "walk" : db(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - fn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, na = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Cs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ct() {
  var t;
  const e = (t = dn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const _n = 0.5, Fo = 20;
function Jx(e, t, n = Ct()) {
  const a = at(e, t);
  return a.left >= n.left + Fo && a.right <= n.right - Fo;
}
function Os(e, t, n = Ct()) {
  const a = at(e, t), s = a.right - a.left, o = aa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - _n && r <= n.right + _n && a.top >= n.top - _n && i <= n.bottom + _n;
}
const Un = [0.35, 0.5, 0.65], zn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Oe = { left: Un[0], right: Un.at(-1), top: zn[0], bottom: zn.at(-1) }, fb = 0.24;
function aa(e) {
  if (e.posture === "stand") return { left: Oe.left, right: Oe.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + fb * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Oe.left, t), right: Math.max(Oe.right, t) };
}
function hb(e, { size: t }, n = Ct()) {
  const a = aa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Ts = (Oe.right - Oe.left) / 2 + 0.08;
function Zx(e, t) {
  return e === "hang" ? Oe : { ...Oe, bottom: Math.min(Oe.bottom, 1 - t - fn[e].drop) };
}
const mb = "[data-figure-agent]";
function Nr(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Cs(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Dr = (e) => zn.flatMap(
  (t) => Un.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Rs(e, t, n = "") {
  if (!sn(e, t)) return Un.length * zn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Jy)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && na(s, i) && Cs(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return Dr(s).filter(([r, i]) => l(r, i) || Nr(r, i, n)).length;
}
function pb(e, t) {
  const n = at(e, t);
  return Dr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Nr(a, s, "", mb)).length;
}
const Wo = 4;
function Xx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Wo; o <= s; o += Wo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!pb(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = Ct(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Os(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Rs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const jr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), gb = [0.5, 0.25, 0.75], vb = (e) => jr(e.getBoundingClientRect(), gb), Pr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, yb = Ts, bb = (e, t, { size: n }, a = yb) => qr(e, Pr[t], a * n, "stand");
function qr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const wb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Fr = 0.1, kb = (e, t, { size: n }) => qr(e, wb[t], Fr * n, "sit"), xb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ta = 60;
function Qx(e, t) {
  const n = xb(t);
  return !e.aside || Math.abs(n) >= Ta ? t : n < 0 ? 360 - Ta : Ta;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, $b = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function e$(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = $b(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? Mb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function Mb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function t$(e, t) {
  const { element: n, edge: a } = sa(), s = ["left", "right"].map((r) => hn(kb(a, r, e), e)).filter((r) => n && Os(r, e) && !Rs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function n$(e, t, { size: n }) {
  const a = (Oe.right - Oe.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Wr } : e;
}
const Wr = 7;
function Hr() {
  const e = [...document.querySelectorAll(Ny)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Sb(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Oe.left * a, right: n.left + Oe.right * a, top: n.top + Oe.top * a, bottom: n.bottom };
}
function _b(e, t) {
  const n = Hr();
  return !n || !na(Sb(e, t), n);
}
const Eb = 4;
function sa() {
  const e = mn(), t = Hr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Eb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Wr - n, 0) } };
}
const a$ = ({ size: e, below: t }) => (1 - t) * e;
function hn(e, t) {
  const n = Ct(), { size: a, below: s } = t, o = fn[e.posture].drop * a;
  return { ...hb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const os = (e, t) => Object.keys(Pr).map((n) => hn(bb(e, n, t), t)), Is = (e, t) => jr(e, Ky).map((n) => hn(n, t)), Ur = (e, t, n) => on(e, t, n) ?? e[0];
function s$(e, t) {
  const { element: n, edge: a } = sa();
  return { ...Ur(os(a, e), e, t), view: null, on: n };
}
function o$(e, t, n, a) {
  const { element: s, edge: o } = sa(), l = (a ? os(o, t) : [...os(o, t), ...Is(o, t)]).filter(
    (u) => !na(at(u, t), e)
  ), r = on(
    l.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Rs(r, t) ? r : on(l, t, n);
  return i && { ...i, view: null, on: s };
}
function mn() {
  var a;
  const e = dn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Vy);
  if (!t) return { ...oa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Ho = { within: 2 };
function l$(e) {
  const { element: t, docked: n, edge: a } = mn();
  if (!n || e.on !== t) return !0;
  const s = oa().edge;
  return a.left > s.left + Ho.within || a.left + a.width < s.left + s.width - Ho.within;
}
const Ab = "[data-figure-closing]";
function r$() {
  var n;
  const { element: e, docked: t } = mn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Ab));
}
const zr = "[data-figure-progress]";
function i$(e) {
  const t = e.querySelector(zr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function c$(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Cb = { across: 300, above: 380, below: 60 };
function u$(e) {
  const { across: t, above: n, below: a } = Cb;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Ob(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Ob = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Vr = "[data-figure-bar]", ls = { back: 144, along: 0.4 };
function d$(e) {
  const { element: t, docked: n, edge: a } = mn(), s = n ? t.querySelector(Vr) : null;
  if (!(s != null && s.querySelector(zr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...hn({ x: o - ls.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function f$(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < ls.along * a.size ? t.x + ls.along * a.size : e.x, y: e.y, behind: !0 };
}
function h$(e) {
  const t = e.querySelector(Vr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function oa() {
  const e = dn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function m$(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = oa(), i = n === null ? Tb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : hn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Tb(e, t, n, a, s) {
  const o = Is(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - dt.reach - dt.room >= l);
  return on(r.length ? r : o, t, n);
}
const Rb = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function p$(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Lr));
  const p = (W) => {
    const C = at(W, n, fn[W.posture].travels);
    return { x: C.left, y: C.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return Ib(p(e), p(t), p({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [$, ...M] = [e, ...i, t].map(p), O = Hn($, M[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), F = M.slice(1).map((W, C) => {
    var b;
    return (b = Hn(M[C], W, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : b.legs.find((S) => S.hopping);
  });
  return O && { ...O, legs: [...O.legs, ...F.filter(Boolean)] };
}
function Ib(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Rb.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Hn(e, n, o.size, { pace: l }) : Hn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function g$(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function v$(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(vb(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = sa();
  return { ...Ur(Is(s, t), t, n), view: null, on: a };
}
const Bb = "[data-figure-bubble]", Lb = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Gr = 0;
const qt = () => Zt, Ra = /* @__PURE__ */ new WeakMap();
let Nb = 0;
function Bs(e) {
  return Ra.has(e) || Ra.set(e, `floor-${++Nb}`), Ra.get(e);
}
const Db = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, jb = () => {
  var e, t;
  return ((t = (e = dn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Pb(e, t) {
  var a;
  const n = (a = e.querySelector(Gy)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function qb(e, t) {
  const n = e && Pb(e, t), a = e ? [...e.querySelectorAll(Bb)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Db(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Bs(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Fb = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Lb ? (t.top - a.top) / s * 1e3 : 0;
};
function Kr(e = Zt, t = performance.now()) {
  const n = Ct(), a = jb(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = mn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = oa();
  return u.element && i.push({ id: Bs(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...qb(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: Fb(e, d, t) }))) });
}
const rs = /* @__PURE__ */ new Set();
function Wb(e) {
  return rs.add(e), () => rs.delete(e);
}
function Hb() {
  Yr();
  const e = () => {
    Gr = requestAnimationFrame(e), !document.hidden && (Zt = Kr(Zt), rs.forEach((t) => t(Zt)));
  };
  e();
}
function Yr() {
  cancelAnimationFrame(Gr);
}
const Ls = 5, Ub = 56, zb = { share: 0.6 }, Vb = (e) => -Math.sqrt(2 * _s * zb.share * e), Nt = (e, t) => e.find((n) => n.id === t) ?? null;
function y$(e, t = Kr().floors) {
  const n = Nt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Bs(e.on) : null, o = s && Nt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Jr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = qt().floors) {
  const u = Nt(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || Gb(u, d, o)) && Kb(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Ns = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Gb = (e, t, n) => !Ns({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function b$(e, t = qt().floors) {
  if (!Ns(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ls && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Kb(e, t, n = qt().floors) {
  const a = Nt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Os(e, t);
}
function w$(e, t, n, a = qt().floors) {
  const s = Jr(e, n, a);
  if (!e.home) return Yb(e, t, s, a);
  if (!s) return null;
  const o = Nt(a, "home"), l = s.y - t.y, r = l > Ls ? "dropping" : -l > Ub ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function Yb(e, t, n, a) {
  const s = n ? Nt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Vb(e.risen) };
  if (!n) return null;
  if (Ns(t) && n.y - t.y > Ls) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function k$(e, t, n) {
  const a = Ts * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function x$(e, t, n, a = qt().floors) {
  const s = t && Jr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Jb = ["data-type"], Zb = { class: "figure-floor-name" }, Xb = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      v("span", Zb, k(e.floor.type), 1)
    ], 12, Jb));
  }
}, Qb = /* @__PURE__ */ Y(Xb, [["__scopeId", "data-v-4e0f1e2e"]]), ew = {
  class: "figure-floors",
  "aria-hidden": "true"
}, tw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ve(qt().floors);
    let n = () => {
    };
    return Le(() => {
      n = Wb((a) => t.value = a.floors), Hb();
    }), Be(() => {
      n(), Yr();
    }), (a, s) => (c(), h("div", ew, [
      (c(!0), h(G, null, te(t.value, (o) => (c(), U(Qb, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, $$ = /* @__PURE__ */ Y(tw, [["__scopeId", "data-v-e519168b"]]), Ia = (e) => typeof e == "number" ? e : Date.parse(e);
function M$(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ia(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ia(s.row.created_at) - Ia(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const nw = 3, Ba = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function aw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ba[n.grouping]) == null ? void 0 : a.call(Ba, e.row, n)) || "";
}
function sw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function S$(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= nw ? [sw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = aw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const ow = 50, lw = "refresh", rw = 1e3;
function _$({ state: e = () => ({}), tab: t = () => "" } = {}) {
  const n = Ke(), a = Yn({}), s = {}, o = /* @__PURE__ */ new Set();
  let l = {}, r = 0;
  const i = (W) => a[W] ?? (a[W] = { value: void 0, failure: "", loaded: !1, readAt: 0 }), u = (W) => !l[W].tab || l[W].tab === t(), d = () => t() ? { ...e(), tab: t() } : e();
  function f(W, C, b) {
    s[W] = { heardEvent: C, showFirst: b, isFirst: !0 };
  }
  async function m(W, C) {
    const b = Object.fromEntries(Object.entries(C).map(([w, I]) => [`${W}.${w}`, I])), S = await n.readKeys({ only: [W], state: { ...d(), ...b } });
    return S.ok ? S.value.keys[W] : S;
  }
  function p(W, C) {
    const b = s[W];
    b && ((b.isFirst || !C.ok) && b.showFirst(C), b.isFirst = !1);
  }
  async function y({ only: W = [] } = {}) {
    const C = await n.readKeys({ only: W, state: d() });
    return C.ok ? (Object.entries(C.value.keys).forEach(([b, S]) => {
      i(b).failure = S.ok ? "" : S.error, i(b).loaded = !0, i(b).readAt = Date.now(), S.ok && (i(b).value = S.value), p(b, S);
    }), O(C.value.declared), !0) : (C.failure !== "cancelled" && Object.keys(s).forEach((b) => p(b, C)), C.failure !== "cancelled" && W.forEach((b) => i(b).failure = C.error), !1);
  }
  function $(W) {
    W.forEach((C) => o.add(C)), clearTimeout(r), r = setTimeout(() => {
      const C = [...o];
      o.clear(), C.length && y({ only: C });
    }, ow);
  }
  function M(W) {
    const C = Object.keys(l).filter((S) => W.event === lw || l[S].events.some((w) => ms(w, W.event)));
    C.filter((S) => s[S]).forEach((S) => s[S].heardEvent(W));
    const b = C.filter((S) => !s[S]);
    b.filter((S) => !u(S)).forEach((S) => i(S).loaded = !1), $(b.filter(u));
  }
  function O(W) {
    if (Object.keys(l).length) return;
    l = W;
    const C = [...new Set(Object.values(W).flatMap((b) => b.events))];
    C.length && n.follow(C, M);
  }
  me(t, () => {
    const W = Object.keys(l).filter((C) => u(C) && !i(C).loaded);
    W.length && y({ only: W });
  }), Be(() => clearTimeout(r));
  function F() {
    const W = Date.now(), C = Object.keys(l).filter((b) => l[b].reload_seconds > 0 && u(b) && W - i(b).readAt >= l[b].reload_seconds * 1e3);
    C.length && $(C);
  }
  return ir(F, () => n.visible.value, rw), queueMicrotask(y), { data: a, reload: y, readKey: m, handle: f };
}
const iw = {
  runningTool: 1e3,
  agentCommand: 5e3,
  planCard: 3e3,
  openPanel: 5e3,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4,
  systemLogs: 5e3
}, cw = 1e3;
function uw() {
  const e = R(Date.now()), t = setInterval(() => e.value = Date.now(), cw);
  return _t(() => clearInterval(t)), e;
}
const dw = ["datetime", "title"], la = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = uw(), a = B(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, k(j(er)(e.at, j(n))), 9, dw));
  }
};
function E$(e) {
  const t = Ke(), n = t.option("row"), a = R(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), me(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function fw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const A$ = (e) => (t) => t.filter((n) => n.id !== e), C$ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), O$ = (e) => (t) => [...t, e], T$ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function R$(e, t = {}) {
  const n = Ke(), a = R(null), s = R("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function I$(e) {
  const t = Ke(), n = R("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const En = /* @__PURE__ */ new Map();
function hw(e, t) {
  if (En.has(e)) return En.get(e);
  const n = t().finally(() => En.delete(e));
  return En.set(e, n), n;
}
function B$() {
  const e = Ke(), t = R(null), n = R("");
  async function a() {
    const s = await hw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const mw = { class: "cards-page" }, pw = { class: "cards-bar" }, gw = { class: "cards-count" }, vw = { class: "cards" }, yw = {
  key: 1,
  class: "cards-note"
}, bw = {
  key: 2,
  class: "cards-note"
}, ww = ["data-row", "onClick"], kw = { class: "card-head" }, xw = { class: "card-title" }, $w = { class: "card-foot" }, Mw = {
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
    return (a, s) => (c(), h("div", mw, [
      v("div", pw, [
        v("span", gw, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        D(de, Ge({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: P(() => [
            D(ye, {
              name: "plus",
              size: 12
            }),
            Q(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      v("div", vw, [
        e.loaded ? e.failure ? (c(), h("p", yw, k(e.failure), 1)) : e.rows.length ? A("", !0) : (c(), h("p", bw, "No " + k(e.noun) + "s yet", 1)) : (c(), U(Et, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(G, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          v("span", kw, [
            D(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            Q(" " + k(e.head(o)), 1),
            D(la, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          v("span", xw, k(e.title(o)), 1),
          v("span", $w, k(e.foot(o)), 1)
        ], 8, ww))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, L$ = /* @__PURE__ */ Y(Mw, [["__scopeId", "data-v-990e6b37"]]), Uo = "newest";
function N$(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = Ae(Te, null)) == null ? void 0 : u.search, s = R(""), o = R(Uo), l = R("all"), r = B(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => fw(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Uo ? f : [...f].sort((m, p) => t(m).localeCompare(t(p)));
  }), i = B(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Sw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, _w = 40, Ew = "top", Aw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Ae(Te, null)) == null ? void 0 : f.autoScroll, s = B(() => a === Ew), o = R(null), l = R(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= _w;
    }
    return me(() => n.rowCount, async () => {
      await ht(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, p) => (c(), h("div", Sw, [
      v("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      D(Dt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: P(() => [
          tt(v("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            D(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            p[0] || (p[0] = Q(" Newest ", -1))
          ], 512), [
            [Qo, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, D$ = /* @__PURE__ */ Y(Aw, [["__scopeId", "data-v-3accb764"]]), Cw = ["aria-selected", "data-tab", "onClick"], Ow = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Tw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ae(Te, null), o = B(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = R(null), r = R({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var y;
      const p = (y = l.value) == null ? void 0 : y.querySelector(".inner-tab.on");
      if (!p) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: p.offsetLeft, width: p.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, p.offsetLeft - 12));
    }
    const d = () => ht(() => u(!0));
    let f = null;
    return Le(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), me(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), me(() => n.answer, d, { deep: !0 }), (m, p) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(G, null, te(o.value, (y) => {
        var $, M;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: (($ = e.active) == null ? void 0 : $.key) === y.key }]),
          "aria-selected": ((M = e.active) == null ? void 0 : M.key) === y.key,
          "data-tab": y.key,
          onClick: (O) => a("choose", y)
        }, [
          Q(k(y.label) + " ", 1),
          i(y) ? (c(), h("span", Ow, k(e.answer[y.count_field]), 1)) : A("", !0)
        ], 10, Cw);
      }), 128)),
      v("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, j$ = /* @__PURE__ */ Y(Tw, [["__scopeId", "data-v-63fcd326"]]), Rw = {
  class: "tab-body",
  "data-tab-body": ""
}, Iw = { "data-tab-content": "" }, Bw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = R(!1);
    let a = 0;
    return me(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, hs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", Rw, [
      n.value ? (c(), U(Et, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : A("", !0),
      tt(v("div", Iw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Qo, !n.value]
      ])
    ]));
  }
}, P$ = /* @__PURE__ */ Y(Bw, [["__scopeId", "data-v-63876533"]]), Lw = {}, Nw = { class: "menu-label" };
function Dw(e, t) {
  return c(), h("span", Nw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const is = /* @__PURE__ */ Y(Lw, [["render", Dw], ["__scopeId", "data-v-aa955b3e"]]), jw = {
  class: "search-bar",
  "data-search-bar": ""
}, Pw = { class: "search-bar-control" }, qw = ["value", "placeholder", "aria-label"], Fw = ["aria-expanded"], Ww = {
  key: 0,
  "data-menu-count": ""
}, Hw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var O;
    const a = e, s = n, o = fi(), l = ((O = Ae(Te, null)) == null ? void 0 : O.search) ?? {}, r = B(() => l.placeholder || a.placeholder), i = l.context ?? [], u = R(null), d = R(null), f = R([]), m = B(() => f.value.length ? f.value[f.value.length - 1].next : i), p = B(() => !!o.menu || i.length > 0), y = (F) => {
      f.value = [], d.value = d.value ? null : F.currentTarget;
    };
    function $(F) {
      if (F.next.length) {
        f.value = [...f.value, F];
        return;
      }
      d.value = null, s("pick", F.click);
    }
    function M() {
      var F;
      s("update:modelValue", ""), (F = u.value) == null || F.focus();
    }
    return t({ focus: () => {
      var F;
      return (F = u.value) == null ? void 0 : F.focus();
    } }), (F, W) => {
      var C;
      return c(), h("div", jw, [
        v("div", Pw, [
          D(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          v("input", {
            ref_key: "field",
            ref: u,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: W[0] || (W[0] = (b) => s("update:modelValue", b.target.value)),
            onKeydown: Xt(M, ["esc"])
          }, null, 40, qw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: M
          }, [
            D(ye, {
              name: "close",
              size: 12
            })
          ])) : A("", !0),
          p.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: y
          }, [
            e.menuCount ? (c(), h("span", Ww, k(e.menuCount), 1)) : A("", !0),
            D(ye, {
              name: "caret",
              size: 12
            })
          ], 8, Fw)) : A("", !0)
        ]),
        (C = j(l).button) != null && C.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: W[1] || (W[1] = (b) => s("pick", j(l).button.click))
        }, k(j(l).button.title), 1)) : A("", !0),
        ue(F.$slots, "default", {}, void 0, !0),
        d.value ? (c(), U(Zn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: W[3] || (W[3] = xe(() => {
          }, ["stop"])),
          onClose: W[4] || (W[4] = (b) => d.value = null)
        }, {
          default: P(() => [
            f.value.length ? (c(), U($t, {
              key: 0,
              "data-search-back": "",
              onClick: W[2] || (W[2] = (b) => f.value = f.value.slice(0, -1))
            }, {
              default: P(() => [
                Q("‹ " + k(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (c(!0), h(G, null, te(m.value, (b) => (c(), U($t, {
              key: b.title,
              description: b.subtext,
              "data-search-entry": b.title,
              onClick: (S) => $(b)
            }, {
              default: P(() => [
                Q(k(b.title) + k(b.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? A("", !0) : ue(F.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, Uw = /* @__PURE__ */ Y(Hw, [["__scopeId", "data-v-45374bed"]]), zw = {
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
    return (o, l) => (c(), U(Uw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: P(() => [
        D(is, null, {
          default: P(() => [...l[2] || (l[2] = [
            Q("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(G, null, te(a, (r) => D($t, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: P(() => [
            Q(k(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(G, { key: 0 }, [
          D(is, null, {
            default: P(() => [...l[3] || (l[3] = [
              Q("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(G, null, te(s, (r) => D($t, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: P(() => [
              Q(k(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : A("", !0)
      ]),
      default: P(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, q$ = /* @__PURE__ */ Y(zw, [["__scopeId", "data-v-dab0064d"]]);
function F$() {
  const e = R(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const W$ = (e) => import(
  /* @vite-ignore */
  e
), Vw = 86400, cs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Gw(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((cs(t) - cs(e)) / Vw);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function H$(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = cs(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Gw(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const La = 280, Na = 240, Da = 120, Kw = 6, Yw = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Jw(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Zr(e, t) {
  const n = Math.max(0, Jw(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Zw(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Yw}px)` }), e.offsetHeight, e.style.transition = `height ${La}ms ${ln}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Zr(t, e));
    const m = s() - r;
    if (!i && m >= La && (i = !0, e.style.transition = `opacity ${Na}ms ease-out, transform ${Na}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < La + Na) return a(f);
    d();
  };
  return a(f), d;
}
function U$(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Kw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Da}ms ease-out, transform ${Da}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Zr(t, e)), s() - l < Da) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const Xw = 140, An = 220, zo = 5;
function z$({ gap: e = Xw, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, zo);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, p = Zw) => {
    if (l || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: p, display: d.style.display || "" };
    if (!s)
      return s = !0, r(y, () => o = t(i, e));
    d.style.display = "none", n.push(y), n.length >= zo && u.flush();
  };
  return u.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const f of [...a]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, u;
}
function V$(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${An}ms ${ln}, opacity ${An}ms ease-in, margin ${An}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, An);
}
const Xr = "chat.pins.minimised", Bn = R(Ln(Xr, !1));
function Vo(e) {
  Bn.value = e, ws(Xr, e);
}
function Qw(e) {
  const t = B(() => e()), n = B(() => Bn.value ? [] : e()), a = () => Vo(!Bn.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => Mt(o) > s).length,
    (o, l) => o > l && Vo(!1)
  ), { pins: t, visible: n, minimised: Bn, toggle: a };
}
const ek = ["title"], tk = {
  key: 0,
  class: "pins-count"
}, nk = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Qw(() => t.pinRows);
    return (o, l) => j(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: j(a), inline: e.inline }]),
      title: j(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => j(s) && j(s)(...r), ["stop"]))
    }, [
      D(ye, {
        name: j(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      j(a) ? (c(), h("span", tk, k(j(n).length), 1)) : A("", !0)
    ], 10, ek)) : A("", !0);
  }
}, G$ = /* @__PURE__ */ Y(nk, [["__scopeId", "data-v-d073c504"]]), ak = ["title"], sk = ["title"], ok = { class: "diff-card-dir" }, lk = { class: "diff-card-name" }, rk = ["title"], ik = ["title"], ck = {
  key: 0,
  class: "diff-card-note"
}, uk = ["href"], dk = ["src", "alt"], fk = { class: "diff-card-rows" }, hk = { class: "diff-row-num" }, mk = { class: "diff-row-sign" }, pk = { class: "diff-row-code" }, gk = {
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
    function o(L) {
      (L.metaKey || L.ctrlKey) && (L.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = B(() => n.path.lastIndexOf("/") + 1), u = B(() => n.path.slice(0, i.value)), d = B(() => n.path.slice(i.value)), f = B(() => n.change === "deleted"), m = B(() => l[n.change]), p = B(() => new Set(n.rows.filter((L) => L.line_type === "add").map((L) => L.line))), y = R("after"), $ = B(() => y.value === "before" ? n.whole.old : n.whole.text), M = B(() => n.whole && n.whole.text !== void 0 ? $.value.split(`
`).map((L, x) => ({ line_type: y.value === "after" && p.value.has(x + 1) ? "add" : "ctx", line: x + 1, text: L })) : n.rows.filter(
      (L) => !(n.editsOnly && ["ctx", "fold"].includes(L.line_type)) && !(n.hideRemovals && L.line_type === "del")
    )), O = R(!1), F = B(() => n.lines && !O.value && !n.whole), W = B(() => F.value ? M.value.slice(0, n.lines) : M.value), C = B(() => M.value.length - W.value.length), b = (L) => L.line === null || L.line_type === "del" ? "" : L.line, S = (L) => L.line_type === "fold" ? L.hidden ? `⋯ ${L.hidden} lines` : "⋯" : L.text, w = R(null), I = R(null);
    let _ = null;
    return Le(() => {
      if (!I.value) return;
      let L = !0;
      _ = new ResizeObserver(() => {
        !w.value || !I.value || (w.value.style.transition = L ? "none" : "", w.value.style.height = `${I.value.offsetHeight}px`, L = !1);
      }), _.observe(I.value);
    }), Be(() => _ && _.disconnect()), (L, x) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      v("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: x[2] || (x[2] = (g) => !f.value && a("fold"))
      }, [
        v("span", {
          class: "diff-card-path",
          title: `${e.path} · ${j(s)}-click to open it`,
          onClick: o
        }, [
          v("span", ok, k(u.value), 1),
          v("span", lk, k(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, k(m.value), 3)) : A("", !0)
        ], 8, sk),
        v("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        v("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        D(la, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: x[0] || (x[0] = xe((g) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, k(y.value === "after" ? "After" : "Before"), 9, rk)) : A("", !0),
        f.value ? A("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: x[1] || (x[1] = xe((g) => a("whole"), ["stop"]))
        }, [
          D(ye, {
            name: "file",
            size: 12
          })
        ], 10, ik))
      ], 8, ak),
      e.whole && e.whole.error ? (c(), h("p", ck, k(e.whole.error), 1)) : A("", !0),
      !f.value && !e.folded ? (c(), h(G, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          v("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, dk)
        ], 8, uk)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: w,
          class: "diff-card-grow"
        }, [
          v("div", {
            ref_key: "body",
            ref: I,
            class: "diff-card-diff"
          }, [
            v("div", fk, [
              (c(!0), h(G, null, te(W.value, (g, E) => (c(), h("div", {
                key: E,
                class: Z(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                v("span", hk, k(b(g)), 1),
                v("span", mk, k(r[g.line_type]), 1),
                v("span", pk, k(S(g)), 1)
              ], 2))), 128)),
              C.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: x[3] || (x[3] = xe((g) => O.value = !0, ["stop"]))
              }, k(C.value) + " more " + k(C.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, K$ = /* @__PURE__ */ Y(gk, [["__scopeId", "data-v-23581cbb"]]), vk = {
  key: 0,
  class: "window-failure"
}, yk = {
  __name: "DocumentWindow",
  props: { line: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ke(), a = R(null);
    async function s() {
      a.value = await n.read(t.line);
    }
    return n.follow(["*.*"], ul(s, iw.openPanel)), s(), (o, l) => a.value && !a.value.ok ? (c(), h("p", vk, k(a.value.error), 1)) : a.value ? (c(), U(cm, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : A("", !0);
  }
}, bk = {
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
    const n = t, a = e, s = B(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = B(() => s.value && { render: () => Gn(yk, { line: s.value.line }) }), l = R(null), r = B(() => {
      var m, p;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((p = l.value) != null && p.component_trusted);
    }), i = B(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = B(
      () => {
        var m, p;
        return l.value ? jg(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((p = s.value) == null ? void 0 : p.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = m.ok ? m.value : null;
    }
    async function f() {
      const m = await a.prompts.ask(s.value.title, l.value);
      return await d(), m;
    }
    return me(
      () => {
        var m, p;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((p = s.value) == null ? void 0 : p.line);
      },
      async () => {
        await d(), u.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, p) => {
      var y, $;
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), U(Ss, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : (($ = s.value) == null ? void 0 : $.shows) === "one-agent" && e.agent === null ? (c(), U(Qt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), U(Kt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), U(ur, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: p[0] || (p[0] = (M, O) => n("option", M, O))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), U(cr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: p[1] || (p[1] = (M, O) => n("option", M, O))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), U(Kt, {
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
        onOption: p[2] || (p[2] = (M, O) => n("option", M, O))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), U(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: p[3] || (p[3] = (M) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, wk = ["data-section"], kk = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ae(uu, null), a = B(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = B(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(G, null, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      D(bk, {
        name: r.name,
        catalogue: j(n).catalogue,
        subscriptions: j(n).subscriptions,
        environment: j(n).environment,
        prompts: j(n).prompts,
        "shell-read": j(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, wk))), 128));
  }
}, xk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), U(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: P(() => [
        D(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, $k = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Mk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Sk = { class: "ask-text" }, _k = ["placeholder", "aria-label"], Ek = ["placeholder", "aria-label"], Ak = {
  key: 3,
  class: "moves"
}, Ck = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = B(() => D0(a.noun, a.row)), l = R(""), r = R(null), i = R(""), u = R("");
    me(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(p, y = "") {
      const $ = await a.read([p.noun ?? a.noun, p.word, String(a.id), ...p.flag ? [p.flag, y] : p.positional ? [y] : [], ...p.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = $.ok ? "" : $.error, $.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (p) => p.confirm ? r.value = p : p.said ? d(p, p.said) : p.flag || p.positional ? (r.value = p, i.value = "") : d(p), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (p, y) => {
      var $;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        l.value ? (c(), h("p", $k, k(l.value), 1)) : A("", !0),
        ($ = r.value) != null && $.confirm ? (c(), h("div", Mk, [
          v("span", Sk, k(r.value.confirm), 1),
          D(de, {
            small: "",
            variant: r.value.danger ? "ghost" : "primary",
            bordered: r.value.danger,
            class: Z({ danger: r.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: y[0] || (y[0] = (M) => d(r.value))
          }, {
            default: P(() => [
              Q(k(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["variant", "bordered", "class"]),
          D(de, {
            small: "",
            variant: "ghost",
            onClick: y[1] || (y[1] = (M) => r.value = null)
          }, {
            default: P(() => [...y[7] || (y[7] = [
              Q("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: xe(m, ["prevent"])
        }, [
          tt(v("input", {
            "onUpdate:modelValue": y[2] || (y[2] = (M) => i.value = M),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: y[3] || (y[3] = Xt(xe((M) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, _k), [
            [Fa, i.value]
          ]),
          r.value.opener ? tt((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": y[4] || (y[4] = (M) => u.value = M),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: y[5] || (y[5] = Xt(xe((M) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, Ek)), [
            [Fa, u.value]
          ]) : A("", !0),
          D(de, {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: P(() => [
              Q(k(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          D(de, {
            small: "",
            variant: "ghost",
            onClick: y[6] || (y[6] = (M) => r.value = null)
          }, {
            default: P(() => [...y[8] || (y[8] = [
              Q("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Ak, [
          (c(!0), h(G, null, te(o.value, (M) => (c(), U(de, {
            key: M.word,
            small: !M.bordered,
            bordered: M.bordered,
            icon: M.icon,
            variant: M.main ? "primary" : "ghost",
            class: Z({ danger: M.danger }),
            "data-move": M.word,
            onClick: (O) => f(M)
          }, {
            default: P(() => [
              Q(k(M.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : A("", !0);
    };
  }
}, Ok = /* @__PURE__ */ Y(Ck, [["__scopeId", "data-v-0262f48f"]]), Tk = /* @__PURE__ */ new Set(["completed", "cancelled"]), Rk = (e) => Tk.has(e), Vn = (e) => Rk(e) ? "done" : e, Ik = { class: "facts" }, Bk = { class: "fact wide" }, Lk = ["title"], Nk = {
  key: 1,
  class: "fact-value"
}, Dk = {
  key: 0,
  class: "fact"
}, jk = { class: "fact-value" }, Pk = { class: "fact" }, qk = { class: "fact-label" }, Fk = ["title"], Wk = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Hk = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Uk = {
  key: 2,
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
    const n = Pn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return c(), h("div", Ik, [
        v("div", Bk, [
          l[3] || (l[3] = v("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: l[0] || (l[0] = (u) => j(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + k(e.place.plan_id) + ": " + k(e.place.plan_title), 9, Lk)) : (c(), h("span", Nk, "Not in a plan"))
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Dk, [
          l[4] || (l[4] = v("span", { class: "fact-label" }, "Phase", -1)),
          v("span", jk, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.helper_id ? (c(), h(G, { key: 1 }, [
          v("div", Pk, [
            v("span", qk, k(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            v("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[1] || (l[1] = (u) => j(qe)(`agents:${e.task.helper_id}`))
            }, k(e.task.helper_name), 9, Fk)
          ]),
          j(s).has(e.task.state) ? (c(), h("p", Wk, k(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", Hk, k(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : A("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", Uk, [
          l[5] || (l[5] = v("span", { class: "fact-label" }, "Assigned to", -1)),
          v("span", zk, "Agent " + k(e.task.holder_id), 1)
        ])) : A("", !0),
        v("div", Vk, [
          l[6] || (l[6] = v("span", { class: "fact-label" }, "Priority", -1)),
          D(Xn, {
            options: j(n),
            value: String(j(nr)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[2] || (l[2] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", Gk, k(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, Yk = /* @__PURE__ */ Y(Kk, [["__scopeId", "data-v-fa2fd03f"]]), Jk = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, Zk = ["datetime"], Xk = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", Jk, [
      n[0] || (n[0] = v("h3", null, "Block history", -1)),
      (c(!0), h(G, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        v("time", {
          datetime: a.created_at
        }, k(new Date(a.created_at).toLocaleString()), 9, Zk),
        v("p", null, k(a.reason), 1)
      ]))), 128))
    ])) : A("", !0);
  }
}, Qk = /* @__PURE__ */ Y(Xk, [["__scopeId", "data-v-b41f213b"]]), e2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, t2 = { ...e2, done: "Completed" }, n2 = { class: "task-status-icon" }, a2 = ["width", "height", "aria-label"], s2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = B(() => pl("task", Vn(t.status))), a = B(() => n.value === "testing" ? "started" : n.value), s = B(() => t2[t.status] ?? ml("task", t.status));
    return (o, l) => (c(), h("span", n2, [
      D(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (c(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            D(jt, { value: a.value }, {
              blocked: P(() => [...l[0] || (l[0] = [
                v("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                v("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                v("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: P(() => [...l[1] || (l[1] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                v("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: P(() => [...l[2] || (l[2] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                v("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: P(() => [...l[3] || (l[3] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                v("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                v("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: P(() => [...l[4] || (l[4] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                v("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                v("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: P(() => [...l[5] || (l[5] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: P(() => [...l[6] || (l[6] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, a2))
        ]),
        _: 1
      })
    ]));
  }
}, Qr = /* @__PURE__ */ Y(s2, [["__scopeId", "data-v-ae24a63f"]]), o2 = {
  class: "part",
  "data-resource-waits": ""
}, l2 = ["onClick"], r2 = { class: "wait-id" }, i2 = { class: "wait-title" }, c2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", o2, [
      v("h4", null, k(e.title), 1),
      (c(!0), h(G, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        D(Qr, {
          status: j(Vn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        v("span", r2, k(o.id), 1),
        v("span", i2, k(o.title), 1)
      ], 8, l2))), 128))
    ]));
  }
}, Go = /* @__PURE__ */ Y(c2, [["__scopeId", "data-v-8fb2e251"]]), u2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, d2 = { class: "text" }, f2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, h2 = 180, m2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = R(!1), l = B(() => a.task.waits.filter((i) => !n.has(i.state))), r = B(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(G, null, [
      l.value.length ? (c(), U(Go, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", u2, [
        u[3] || (u[3] = v("h4", null, "How it was done", -1)),
        v("p", d2, k(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (c(), h("section", f2, [
        u[4] || (u[4] = v("h4", null, "The brief", -1)),
        v("p", {
          class: Z(["text", { clamped: !o.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > h2 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0),
      r.value.length ? (c(), U(Go, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0)
    ], 64));
  }
}, p2 = /* @__PURE__ */ Y(m2, [["__scopeId", "data-v-4a3f1e79"]]), g2 = {
  class: "task-details",
  "data-task-details": ""
}, v2 = { class: "since" }, y2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, b2 = { class: "text" }, w2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, k2 = {
  key: 1,
  class: "note"
}, x2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, $2 = { class: "text" }, M2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", g2, [
        v("div", {
          class: Z(["state-line", j(Vn)(e.task.state)])
        }, [
          v("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            D(Qr, {
              status: j(Vn)(e.task.state)
            }, null, 8, ["status"]),
            Q(" " + k(a(e.task.state)), 1)
          ]),
          v("span", v2, [
            o[3] || (o[3] = Q(" since ", -1)),
            D(la, {
              at: j(Vl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", y2, [
          o[4] || (o[4] = v("span", { class: "label" }, "Blocked, waiting on", -1)),
          v("p", b2, k(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", w2, "Opens by itself when " + k(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", k2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", x2, [
          o[5] || (o[5] = v("span", { class: "label" }, "Why it was cancelled", -1)),
          v("p", $2, k(e.task.reason), 1)
        ])) : A("", !0),
        D(Yk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        D(p2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (r) => n("select", r))
        }, null, 8, ["task"]),
        D(Qk, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, S2 = /* @__PURE__ */ Y(M2, [["__scopeId", "data-v-408e9f91"]]), _2 = 50, E2 = { messages: 25 }, A2 = (e) => E2[e] || _2, C2 = {
  class: "task-log",
  "aria-label": "Task log"
}, O2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, T2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, R2 = { class: "entries" }, I2 = ["datetime"], B2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, L2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = R([]), a = R(1), s = R(!0), o = R(!0), l = R("");
    let r = 0;
    async function i(u = 1) {
      const d = ++r;
      a.value = u, o.value = !0, l.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(A2("task_logs")),
        "--page",
        String(u)
      ]);
      d === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return me(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), _t(() => {
      r += 1;
    }), (u, d) => (c(), h("section", C2, [
      o.value ? (c(), U(Et, { key: 0 })) : l.value ? (c(), h(G, { key: 1 }, [
        v("p", O2, k(l.value), 1),
        D(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: P(() => [...d[3] || (d[3] = [
            Q("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(G, { key: 2 }, [
        n.value.length ? A("", !0) : (c(), h("p", T2, "No log entries yet.")),
        v("ol", R2, [
          (c(!0), h(G, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            v("time", {
              datetime: f.created_at
            }, k(new Date(f.created_at).toLocaleString()), 9, I2),
            v("p", null, k(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", B2, [
          D(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: P(() => [...d[4] || (d[4] = [
              Q("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          v("span", null, "Page " + k(a.value), 1),
          D(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: P(() => [...d[5] || (d[5] = [
              Q("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, N2 = /* @__PURE__ */ Y(L2, [["__scopeId", "data-v-98b3a6b1"]]), D2 = { class: "comment-side-head" }, j2 = {
  key: 0,
  class: "comment-none"
}, P2 = { key: 0 }, q2 = {
  key: 1,
  class: "comment-none"
}, F2 = {
  class: "comment",
  "data-comment": ""
}, W2 = {
  __name: "CommentSide",
  props: {
    comments: { type: Array, required: !0 },
    words: { type: Function, required: !0 },
    below: Boolean,
    more: Boolean,
    loading: Boolean,
    failure: { type: String, default: "" }
  },
  emits: ["close", "more"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      v("header", D2, [
        n[2] || (n[2] = v("h3", null, "Comments", -1)),
        D(bs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", j2, "No comments yet")) : A("", !0),
      (c(!0), h(G, null, te(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", P2, k(a.quote), 1)) : A("", !0),
        a.revision ? (c(), h("span", q2, "Revision " + k(a.revision), 1)) : A("", !0),
        v("p", F2, k(e.words(a)), 1)
      ]))), 128)),
      D(Jn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, H2 = /* @__PURE__ */ Y(W2, [["__scopeId", "data-v-276284a3"]]);
var Jo;
/Mac|iPhone|iPad/.test(((Jo = navigator.userAgentData) == null ? void 0 : Jo.platform) || navigator.platform);
function U2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const z2 = ["placeholder"], V2 = { class: "actions" }, G2 = { class: "error" }, K2 = {
  key: 1,
  class: "card closed"
}, Y2 = { class: "mark" }, J2 = { class: "prompt" }, Z2 = {
  key: 0,
  class: "draft"
}, X2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ qa({
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
  emits: /* @__PURE__ */ qa(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Pa(e, "draft"), l = Pa(e, "error"), r = R(!!l.value), i = R(!1), u = R(!1), d = R(null);
    async function f() {
      var y, $;
      r.value = !0, i.value = !1, await ht(), ($ = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || $.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function p() {
      const y = o.value.trim();
      if (!(!y || !a.ready || u.value)) {
        l.value = "", u.value = !0, o.value = "";
        try {
          await a.send(y), r.value = !1, i.value = !0;
        } catch ($) {
          o.value = y, l.value = $.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, $) => (c(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(p, ["prevent"]),
        onKeydown: Xt(m, ["esc"])
      }, [
        ue(y.$slots, "who", {}, void 0, !0),
        tt(v("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": $[0] || ($[0] = (M) => o.value = M),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: $[1] || ($[1] = Xt((M) => j(U2)(M, p), ["enter"]))
        }, null, 40, z2), [
          [Fa, o.value]
        ]),
        v("div", V2, [
          v("span", G2, k(l.value), 1),
          D(de, {
            small: "",
            onClick: m
          }, {
            default: P(() => [...$[3] || ($[3] = [
              Q("Cancel", -1)
            ])]),
            _: 1
          }),
          D(de, {
            variant: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: p
          }, {
            default: P(() => [...$[4] || ($[4] = [
              Q("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", K2, [
        v("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          v("span", Y2, [
            D(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          v("span", J2, k(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", Z2, "Draft kept")) : A("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: $[2] || ($[2] = (M) => s("show"))
        }, [
          v("span", null, k(j(oc)(e.count, "comment")), 1),
          D(ye, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, Q2 = /* @__PURE__ */ Y(X2, [["__scopeId", "data-v-b68baddd"]]);
function e5(e, t) {
  const n = R([]), a = R(!1), s = R(null), o = R(0), l = R(!1), r = R("");
  let i = 0, u = 0;
  const d = (y) => {
    if (typeof y.body == "string") return y.body;
    const { noun: $, id: M, title: O } = e(), F = `On ${$} ${M}, ${O}: `;
    return y.text.startsWith(F) ? y.text.slice(F.length) : y.text;
  };
  async function f(y = 1) {
    const { noun: $, id: M } = e();
    if (!M) return;
    const O = ++u;
    l.value = !0, r.value = "";
    try {
      const F = await t([$, "comments", String(M), "--page", String(y), "--page-size", "25"]);
      if (O !== u) return;
      if (!F.ok) {
        r.value = F.error;
        return;
      }
      const W = F.value.rows ?? [], C = y === 1 ? W : [...n.value, ...W];
      n.value = [...new Map(C.map((b) => [b.id, b])).values()], o.value = F.value.total ?? n.value.length, s.value = F.value.next_page ?? null;
    } catch (F) {
      O === u && (r.value = F.message);
    } finally {
      O === u && (l.value = !1);
    }
  }
  async function m(y) {
    var b;
    const { noun: $, id: M } = e(), O = `${$}:${M}`, F = { id: `sending-${++i}`, text: y };
    n.value = [...n.value, F], o.value++, a.value = !0;
    const W = await t([$, "comment", String(M), y]);
    if (O !== `${e().noun}:${e().id}`) return;
    if (!W.ok)
      throw n.value = n.value.filter((S) => S.id !== F.id), o.value = Math.max(0, o.value - 1), new Error(W.error);
    await f();
    const C = (b = W.value) == null ? void 0 : b.id;
    C && !n.value.some((S) => S.id === C) && (n.value = [...n.value, { ...F, id: C }]);
  }
  const p = () => !l.value && s.value && f(s.value);
  return me(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", u++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: p, nextPage: s, total: o, loading: l, failure: r };
}
const t5 = { class: "top" }, n5 = {
  class: "crumb",
  "data-task-crumb": ""
}, a5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, s5 = {
  key: 1,
  class: "body"
}, o5 = { class: "summary" }, l5 = { class: "stamp" }, r5 = {
  class: "title",
  "data-resource-title": ""
}, i5 = {
  class: "tabs",
  "data-task-tabs": ""
}, c5 = { class: "panels" }, u5 = {
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
    const a = e, s = n, o = R(null), l = R(null), r = R(""), i = R(""), u = R(null), d = R(null), f = R("details"), m = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], p = e5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (C) => a.read(C)
    );
    let y = 0;
    const $ = B(() => {
      var C;
      return (C = l.value) != null && C.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function M() {
      const C = ++y, [b, S] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      C === y && (r.value = b.ok ? "" : b.error, o.value = b.ok ? b.value : null, l.value = S.ok ? S.value : null);
    }
    me(
      () => a.id,
      () => {
        o.value = null, l.value = null, u.value = null, f.value = "details", M();
      },
      { immediate: !0 }
    ), me(() => a.changes, M), me(p.open, (C) => {
      C && (f.value = "comments");
    });
    async function O(C) {
      const b = o.value.priority;
      o.value.priority = Number(C);
      const S = await a.read(["task", "edit", String(a.id), "--priority", C]);
      if (i.value = S.ok ? "" : S.error, S.ok) return M();
      o.value.priority = b;
    }
    function F(C) {
      u.value = null, d.value.press(C);
    }
    const W = (C) => {
      var b;
      return ((b = d.value) == null ? void 0 : b.moves.length) && (u.value = C);
    };
    return t({ openStatus: W }), (C, b) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      v("div", t5, [
        e.backed ? (c(), U(xk, {
          key: 0,
          onBack: b[0] || (b[0] = (S) => s("back"))
        })) : A("", !0),
        v("span", n5, k($.value), 1),
        b[10] || (b[10] = v("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(G, { key: 1 }, [
          D(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: b[1] || (b[1] = (S) => s("step", -1))
          }, {
            default: P(() => [
              D(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          D(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: b[2] || (b[2] = (S) => s("step", 1))
          }, {
            default: P(() => [
              D(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        D(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: b[3] || (b[3] = (S) => s("close"))
        }, {
          default: P(() => [
            D(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      r.value ? (c(), h("p", a5, k(r.value), 1)) : o.value ? (c(), h(G, { key: 2 }, [
        D(Ok, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: M
        }, null, 8, ["id", "row", "read"]),
        v("header", o5, [
          v("div", l5, [
            Q(" Task " + k(o.value.id) + " · updated ", 1),
            D(la, {
              at: j(Vl)(o.value)
            }, null, 8, ["at"])
          ]),
          v("h3", r5, k(o.value.title), 1)
        ]),
        v("div", i5, [
          D(Xn, {
            options: m,
            value: f.value,
            onPick: b[4] || (b[4] = (S) => f.value = S)
          }, null, 8, ["value"])
        ]),
        v("div", c5, [
          D(jt, { value: f.value }, {
            details: P(() => [
              D(S2, {
                task: o.value,
                place: l.value,
                refusal: i.value,
                onStatus: W,
                onPriority: O,
                onSelect: b[5] || (b[5] = (S) => s("select", S))
              }, null, 8, ["task", "place", "refusal"]),
              D(kk, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              D(ac, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: b[6] || (b[6] = (S) => s("select", S))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: P(() => [
              D(H2, {
                below: "",
                comments: j(p).comments.value,
                words: j(p).words,
                more: !!j(p).nextPage.value,
                loading: j(p).loading.value,
                failure: j(p).failure.value,
                onMore: j(p).loadMore,
                onClose: b[7] || (b[7] = (S) => f.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: P(() => [
              D(N2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        D(Q2, {
          send: j(p).send,
          count: j(p).total.value,
          onShow: b[8] || (b[8] = (S) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", s5, [
        D(Et)
      ])),
      u.value ? (c(), U(Zn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: b[9] || (b[9] = (S) => u.value = null)
      }, {
        default: P(() => [
          D(is, null, {
            default: P(() => [
              Q("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(G, null, te(d.value.moves, (S) => (c(), U($t, {
            key: S.word,
            onClick: (w) => F(S)
          }, {
            default: P(() => [
              Q(k(S.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, Y$ = /* @__PURE__ */ Y(u5, [["__scopeId", "data-v-7a9aa909"]]);
function d5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ja = { exports: {} }, Ko;
function f5() {
  return Ko || (Ko = 1, (function(e, t) {
    var n = (function() {
      var a = function(b, S) {
        var w = 236, I = 17, _ = b, L = o[S], x = null, g = 0, E = null, T = [], N = {}, J = function(H, z) {
          g = _ * 4 + 17, x = (function(q) {
            for (var V = new Array(q), K = 0; K < q; K += 1) {
              V[K] = new Array(q);
              for (var X = 0; X < q; X += 1)
                V[K][X] = null;
            }
            return V;
          })(g), ee(0, 0), ee(g - 7, 0), ee(0, g - 7), fe(), ie(), Fe(H, z), _ >= 7 && Ce(H), E == null && (E = ae(_, L, T)), ve(E, z);
        }, ee = function(H, z) {
          for (var q = -1; q <= 7; q += 1)
            if (!(H + q <= -1 || g <= H + q))
              for (var V = -1; V <= 7; V += 1)
                z + V <= -1 || g <= z + V || (0 <= q && q <= 6 && (V == 0 || V == 6) || 0 <= V && V <= 6 && (q == 0 || q == 6) || 2 <= q && q <= 4 && 2 <= V && V <= 4 ? x[H + q][z + V] = !0 : x[H + q][z + V] = !1);
        }, re = function() {
          for (var H = 0, z = 0, q = 0; q < 8; q += 1) {
            J(!0, q);
            var V = r.getLostPoint(N);
            (q == 0 || H > V) && (H = V, z = q);
          }
          return z;
        }, ie = function() {
          for (var H = 8; H < g - 8; H += 1)
            x[H][6] == null && (x[H][6] = H % 2 == 0);
          for (var z = 8; z < g - 8; z += 1)
            x[6][z] == null && (x[6][z] = z % 2 == 0);
        }, fe = function() {
          for (var H = r.getPatternPosition(_), z = 0; z < H.length; z += 1)
            for (var q = 0; q < H.length; q += 1) {
              var V = H[z], K = H[q];
              if (x[V][K] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    X == -2 || X == 2 || oe == -2 || oe == 2 || X == 0 && oe == 0 ? x[V + X][K + oe] = !0 : x[V + X][K + oe] = !1;
            }
        }, Ce = function(H) {
          for (var z = r.getBCHTypeNumber(_), q = 0; q < 18; q += 1) {
            var V = !H && (z >> q & 1) == 1;
            x[Math.floor(q / 3)][q % 3 + g - 8 - 3] = V;
          }
          for (var q = 0; q < 18; q += 1) {
            var V = !H && (z >> q & 1) == 1;
            x[q % 3 + g - 8 - 3][Math.floor(q / 3)] = V;
          }
        }, Fe = function(H, z) {
          for (var q = L << 3 | z, V = r.getBCHTypeInfo(q), K = 0; K < 15; K += 1) {
            var X = !H && (V >> K & 1) == 1;
            K < 6 ? x[K][8] = X : K < 8 ? x[K + 1][8] = X : x[g - 15 + K][8] = X;
          }
          for (var K = 0; K < 15; K += 1) {
            var X = !H && (V >> K & 1) == 1;
            K < 8 ? x[8][g - K - 1] = X : K < 9 ? x[8][15 - K - 1 + 1] = X : x[8][15 - K - 1] = X;
          }
          x[g - 8][8] = !H;
        }, ve = function(H, z) {
          for (var q = -1, V = g - 1, K = 7, X = 0, oe = r.getMaskFunction(z), se = g - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (x[V][se - ke] == null) {
                  var Se = !1;
                  X < H.length && (Se = (H[X] >>> K & 1) == 1);
                  var ce = oe(V, se - ke);
                  ce && (Se = !Se), x[V][se - ke] = Se, K -= 1, K == -1 && (X += 1, K = 7);
                }
              if (V += q, V < 0 || g <= V) {
                V -= q, q = -q;
                break;
              }
            }
        }, he = function(H, z) {
          for (var q = 0, V = 0, K = 0, X = new Array(z.length), oe = new Array(z.length), se = 0; se < z.length; se += 1) {
            var ke = z[se].dataCount, Se = z[se].totalCount - ke;
            V = Math.max(V, ke), K = Math.max(K, Se), X[se] = new Array(ke);
            for (var ce = 0; ce < X[se].length; ce += 1)
              X[se][ce] = 255 & H.getBuffer()[ce + q];
            q += ke;
            var Ne = r.getErrorCorrectPolynomial(Se), De = u(X[se], Ne.getLength() - 1), Ds = De.mod(Ne);
            oe[se] = new Array(Ne.getLength() - 1);
            for (var ce = 0; ce < oe[se].length; ce += 1) {
              var js = ce + Ds.getLength() - oe[se].length;
              oe[se][ce] = js >= 0 ? Ds.getAt(js) : 0;
            }
          }
          for (var Ps = 0, ce = 0; ce < z.length; ce += 1)
            Ps += z[ce].totalCount;
          for (var ra = new Array(Ps), pn = 0, ce = 0; ce < V; ce += 1)
            for (var se = 0; se < z.length; se += 1)
              ce < X[se].length && (ra[pn] = X[se][ce], pn += 1);
          for (var ce = 0; ce < K; ce += 1)
            for (var se = 0; se < z.length; se += 1)
              ce < oe[se].length && (ra[pn] = oe[se][ce], pn += 1);
          return ra;
        }, ae = function(H, z, q) {
          for (var V = d.getRSBlocks(H, z), K = f(), X = 0; X < q.length; X += 1) {
            var oe = q[X];
            K.put(oe.getMode(), 4), K.put(oe.getLength(), r.getLengthInBits(oe.getMode(), H)), oe.write(K);
          }
          for (var se = 0, X = 0; X < V.length; X += 1)
            se += V[X].dataCount;
          if (K.getLengthInBits() > se * 8)
            throw "code length overflow. (" + K.getLengthInBits() + ">" + se * 8 + ")";
          for (K.getLengthInBits() + 4 <= se * 8 && K.put(0, 4); K.getLengthInBits() % 8 != 0; )
            K.putBit(!1);
          for (; !(K.getLengthInBits() >= se * 8 || (K.put(w, 8), K.getLengthInBits() >= se * 8)); )
            K.put(I, 8);
          return he(K, V);
        };
        N.addData = function(H, z) {
          z = z || "Byte";
          var q = null;
          switch (z) {
            case "Numeric":
              q = m(H);
              break;
            case "Alphanumeric":
              q = p(H);
              break;
            case "Byte":
              q = y(H);
              break;
            case "Kanji":
              q = $(H);
              break;
            default:
              throw "mode:" + z;
          }
          T.push(q), E = null;
        }, N.isDark = function(H, z) {
          if (H < 0 || g <= H || z < 0 || g <= z)
            throw H + "," + z;
          return x[H][z];
        }, N.getModuleCount = function() {
          return g;
        }, N.make = function() {
          if (_ < 1) {
            for (var H = 1; H < 40; H++) {
              for (var z = d.getRSBlocks(H, L), q = f(), V = 0; V < T.length; V++) {
                var K = T[V];
                q.put(K.getMode(), 4), q.put(K.getLength(), r.getLengthInBits(K.getMode(), H)), K.write(q);
              }
              for (var X = 0, V = 0; V < z.length; V++)
                X += z[V].dataCount;
              if (q.getLengthInBits() <= X * 8)
                break;
            }
            _ = H;
          }
          J(!1, re());
        }, N.createTableTag = function(H, z) {
          H = H || 2, z = typeof z > "u" ? H * 4 : z;
          var q = "";
          q += '<table style="', q += " border-width: 0px; border-style: none;", q += " border-collapse: collapse;", q += " padding: 0px; margin: " + z + "px;", q += '">', q += "<tbody>";
          for (var V = 0; V < N.getModuleCount(); V += 1) {
            q += "<tr>";
            for (var K = 0; K < N.getModuleCount(); K += 1)
              q += '<td style="', q += " border-width: 0px; border-style: none;", q += " border-collapse: collapse;", q += " padding: 0px; margin: 0px;", q += " width: " + H + "px;", q += " height: " + H + "px;", q += " background-color: ", q += N.isDark(V, K) ? "#000000" : "#ffffff", q += ";", q += '"/>';
            q += "</tr>";
          }
          return q += "</tbody>", q += "</table>", q;
        }, N.createSvgTag = function(H, z, q, V) {
          var K = {};
          typeof arguments[0] == "object" && (K = arguments[0], H = K.cellSize, z = K.margin, q = K.alt, V = K.title), H = H || 2, z = typeof z > "u" ? H * 4 : z, q = typeof q == "string" ? { text: q } : q || {}, q.text = q.text || null, q.id = q.text ? q.id || "qrcode-description" : null, V = typeof V == "string" ? { text: V } : V || {}, V.text = V.text || null, V.id = V.text ? V.id || "qrcode-title" : null;
          var X = N.getModuleCount() * H + z * 2, oe, se, ke, Se, ce = "", Ne;
          for (Ne = "l" + H + ",0 0," + H + " -" + H + ",0 0,-" + H + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += K.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ce += ' viewBox="0 0 ' + X + " " + X + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += V.text || q.text ? ' role="img" aria-labelledby="' + Ye([V.id, q.id].join(" ").trim()) + '"' : "", ce += ">", ce += V.text ? '<title id="' + Ye(V.id) + '">' + Ye(V.text) + "</title>" : "", ce += q.text ? '<description id="' + Ye(q.id) + '">' + Ye(q.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < N.getModuleCount(); ke += 1)
            for (Se = ke * H + z, oe = 0; oe < N.getModuleCount(); oe += 1)
              N.isDark(ke, oe) && (se = oe * H + z, ce += "M" + se + "," + Se + Ne);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, N.createDataURL = function(H, z) {
          H = H || 2, z = typeof z > "u" ? H * 4 : z;
          var q = N.getModuleCount() * H + z * 2, V = z, K = q - z;
          return C(q, q, function(X, oe) {
            if (V <= X && X < K && V <= oe && oe < K) {
              var se = Math.floor((X - V) / H), ke = Math.floor((oe - V) / H);
              return N.isDark(ke, se) ? 0 : 1;
            } else
              return 1;
          });
        }, N.createImgTag = function(H, z, q) {
          H = H || 2, z = typeof z > "u" ? H * 4 : z;
          var V = N.getModuleCount() * H + z * 2, K = "";
          return K += "<img", K += ' src="', K += N.createDataURL(H, z), K += '"', K += ' width="', K += V, K += '"', K += ' height="', K += V, K += '"', q && (K += ' alt="', K += Ye(q), K += '"'), K += "/>", K;
        };
        var Ye = function(H) {
          for (var z = "", q = 0; q < H.length; q += 1) {
            var V = H.charAt(q);
            switch (V) {
              case "<":
                z += "&lt;";
                break;
              case ">":
                z += "&gt;";
                break;
              case "&":
                z += "&amp;";
                break;
              case '"':
                z += "&quot;";
                break;
              default:
                z += V;
                break;
            }
          }
          return z;
        }, ei = function(H) {
          var z = 1;
          H = typeof H > "u" ? z * 2 : H;
          var q = N.getModuleCount() * z + H * 2, V = H, K = q - H, X, oe, se, ke, Se, ce = {
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
          for (X = 0; X < q; X += 2) {
            for (se = Math.floor((X - V) / z), ke = Math.floor((X + 1 - V) / z), oe = 0; oe < q; oe += 1)
              Se = "█", V <= oe && oe < K && V <= X && X < K && N.isDark(se, Math.floor((oe - V) / z)) && (Se = " "), V <= oe && oe < K && V <= X + 1 && X + 1 < K && N.isDark(ke, Math.floor((oe - V) / z)) ? Se += " " : Se += "█", De += H < 1 && X + 1 >= K ? Ne[Se] : ce[Se];
            De += `
`;
          }
          return q % 2 && H > 0 ? De.substring(0, De.length - q - 1) + Array(q + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return N.createASCII = function(H, z) {
          if (H = H || 1, H < 2)
            return ei(z);
          H -= 1, z = typeof z > "u" ? H * 2 : z;
          var q = N.getModuleCount() * H + z * 2, V = z, K = q - z, X, oe, se, ke, Se = Array(H + 1).join("██"), ce = Array(H + 1).join("  "), Ne = "", De = "";
          for (X = 0; X < q; X += 1) {
            for (se = Math.floor((X - V) / H), De = "", oe = 0; oe < q; oe += 1)
              ke = 1, V <= oe && oe < K && V <= X && X < K && N.isDark(se, Math.floor((oe - V) / H)) && (ke = 0), De += ke ? Se : ce;
            for (se = 0; se < H; se += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, N.renderTo2dContext = function(H, z) {
          z = z || 2;
          for (var q = N.getModuleCount(), V = 0; V < q; V++)
            for (var K = 0; K < q; K++)
              H.fillStyle = N.isDark(V, K) ? "black" : "white", H.fillRect(V * z, K * z, z, z);
        }, N;
      };
      a.stringToBytesFuncs = {
        default: function(b) {
          for (var S = [], w = 0; w < b.length; w += 1) {
            var I = b.charCodeAt(w);
            S.push(I & 255);
          }
          return S;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(b, S) {
        var w = (function() {
          for (var _ = F(b), L = function() {
            var ie = _.read();
            if (ie == -1) throw "eof";
            return ie;
          }, x = 0, g = {}; ; ) {
            var E = _.read();
            if (E == -1) break;
            var T = L(), N = L(), J = L(), ee = String.fromCharCode(E << 8 | T), re = N << 8 | J;
            g[ee] = re, x += 1;
          }
          if (x != S)
            throw x + " != " + S;
          return g;
        })(), I = 63;
        return function(_) {
          for (var L = [], x = 0; x < _.length; x += 1) {
            var g = _.charCodeAt(x);
            if (g < 128)
              L.push(g);
            else {
              var E = w[_.charAt(x)];
              typeof E == "number" ? (E & 255) == E ? L.push(E) : (L.push(E >>> 8), L.push(E & 255)) : L.push(I);
            }
          }
          return L;
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
      }, l = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, r = (function() {
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
        ], S = 1335, w = 7973, I = 21522, _ = {}, L = function(x) {
          for (var g = 0; x != 0; )
            g += 1, x >>>= 1;
          return g;
        };
        return _.getBCHTypeInfo = function(x) {
          for (var g = x << 10; L(g) - L(S) >= 0; )
            g ^= S << L(g) - L(S);
          return (x << 10 | g) ^ I;
        }, _.getBCHTypeNumber = function(x) {
          for (var g = x << 12; L(g) - L(w) >= 0; )
            g ^= w << L(g) - L(w);
          return x << 12 | g;
        }, _.getPatternPosition = function(x) {
          return b[x - 1];
        }, _.getMaskFunction = function(x) {
          switch (x) {
            case l.PATTERN000:
              return function(g, E) {
                return (g + E) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, E) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, E) {
                return E % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, E) {
                return (g + E) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, E) {
                return (Math.floor(g / 2) + Math.floor(E / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, E) {
                return g * E % 2 + g * E % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, E) {
                return (g * E % 2 + g * E % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, E) {
                return (g * E % 3 + (g + E) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + x;
          }
        }, _.getErrorCorrectPolynomial = function(x) {
          for (var g = u([1], 0), E = 0; E < x; E += 1)
            g = g.multiply(u([1, i.gexp(E)], 0));
          return g;
        }, _.getLengthInBits = function(x, g) {
          if (1 <= g && g < 10)
            switch (x) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + x;
            }
          else if (g < 27)
            switch (x) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + x;
            }
          else if (g < 41)
            switch (x) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + x;
            }
          else
            throw "type:" + g;
        }, _.getLostPoint = function(x) {
          for (var g = x.getModuleCount(), E = 0, T = 0; T < g; T += 1)
            for (var N = 0; N < g; N += 1) {
              for (var J = 0, ee = x.isDark(T, N), re = -1; re <= 1; re += 1)
                if (!(T + re < 0 || g <= T + re))
                  for (var ie = -1; ie <= 1; ie += 1)
                    N + ie < 0 || g <= N + ie || re == 0 && ie == 0 || ee == x.isDark(T + re, N + ie) && (J += 1);
              J > 5 && (E += 3 + J - 5);
            }
          for (var T = 0; T < g - 1; T += 1)
            for (var N = 0; N < g - 1; N += 1) {
              var fe = 0;
              x.isDark(T, N) && (fe += 1), x.isDark(T + 1, N) && (fe += 1), x.isDark(T, N + 1) && (fe += 1), x.isDark(T + 1, N + 1) && (fe += 1), (fe == 0 || fe == 4) && (E += 3);
            }
          for (var T = 0; T < g; T += 1)
            for (var N = 0; N < g - 6; N += 1)
              x.isDark(T, N) && !x.isDark(T, N + 1) && x.isDark(T, N + 2) && x.isDark(T, N + 3) && x.isDark(T, N + 4) && !x.isDark(T, N + 5) && x.isDark(T, N + 6) && (E += 40);
          for (var N = 0; N < g; N += 1)
            for (var T = 0; T < g - 6; T += 1)
              x.isDark(T, N) && !x.isDark(T + 1, N) && x.isDark(T + 2, N) && x.isDark(T + 3, N) && x.isDark(T + 4, N) && !x.isDark(T + 5, N) && x.isDark(T + 6, N) && (E += 40);
          for (var Ce = 0, N = 0; N < g; N += 1)
            for (var T = 0; T < g; T += 1)
              x.isDark(T, N) && (Ce += 1);
          var Fe = Math.abs(100 * Ce / g / g - 50) / 5;
          return E += Fe * 10, E;
        }, _;
      })(), i = (function() {
        for (var b = new Array(256), S = new Array(256), w = 0; w < 8; w += 1)
          b[w] = 1 << w;
        for (var w = 8; w < 256; w += 1)
          b[w] = b[w - 4] ^ b[w - 5] ^ b[w - 6] ^ b[w - 8];
        for (var w = 0; w < 255; w += 1)
          S[b[w]] = w;
        var I = {};
        return I.glog = function(_) {
          if (_ < 1)
            throw "glog(" + _ + ")";
          return S[_];
        }, I.gexp = function(_) {
          for (; _ < 0; )
            _ += 255;
          for (; _ >= 256; )
            _ -= 255;
          return b[_];
        }, I;
      })();
      function u(b, S) {
        if (typeof b.length > "u")
          throw b.length + "/" + S;
        var w = (function() {
          for (var _ = 0; _ < b.length && b[_] == 0; )
            _ += 1;
          for (var L = new Array(b.length - _ + S), x = 0; x < b.length - _; x += 1)
            L[x] = b[x + _];
          return L;
        })(), I = {};
        return I.getAt = function(_) {
          return w[_];
        }, I.getLength = function() {
          return w.length;
        }, I.multiply = function(_) {
          for (var L = new Array(I.getLength() + _.getLength() - 1), x = 0; x < I.getLength(); x += 1)
            for (var g = 0; g < _.getLength(); g += 1)
              L[x + g] ^= i.gexp(i.glog(I.getAt(x)) + i.glog(_.getAt(g)));
          return u(L, 0);
        }, I.mod = function(_) {
          if (I.getLength() - _.getLength() < 0)
            return I;
          for (var L = i.glog(I.getAt(0)) - i.glog(_.getAt(0)), x = new Array(I.getLength()), g = 0; g < I.getLength(); g += 1)
            x[g] = I.getAt(g);
          for (var g = 0; g < _.getLength(); g += 1)
            x[g] ^= i.gexp(i.glog(_.getAt(g)) + L);
          return u(x, 0).mod(_);
        }, I;
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
        ], S = function(_, L) {
          var x = {};
          return x.totalCount = _, x.dataCount = L, x;
        }, w = {}, I = function(_, L) {
          switch (L) {
            case o.L:
              return b[(_ - 1) * 4 + 0];
            case o.M:
              return b[(_ - 1) * 4 + 1];
            case o.Q:
              return b[(_ - 1) * 4 + 2];
            case o.H:
              return b[(_ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return w.getRSBlocks = function(_, L) {
          var x = I(_, L);
          if (typeof x > "u")
            throw "bad rs block @ typeNumber:" + _ + "/errorCorrectionLevel:" + L;
          for (var g = x.length / 3, E = [], T = 0; T < g; T += 1)
            for (var N = x[T * 3 + 0], J = x[T * 3 + 1], ee = x[T * 3 + 2], re = 0; re < N; re += 1)
              E.push(S(J, ee));
          return E;
        }, w;
      })(), f = function() {
        var b = [], S = 0, w = {};
        return w.getBuffer = function() {
          return b;
        }, w.getAt = function(I) {
          var _ = Math.floor(I / 8);
          return (b[_] >>> 7 - I % 8 & 1) == 1;
        }, w.put = function(I, _) {
          for (var L = 0; L < _; L += 1)
            w.putBit((I >>> _ - L - 1 & 1) == 1);
        }, w.getLengthInBits = function() {
          return S;
        }, w.putBit = function(I) {
          var _ = Math.floor(S / 8);
          b.length <= _ && b.push(0), I && (b[_] |= 128 >>> S % 8), S += 1;
        }, w;
      }, m = function(b) {
        var S = s.MODE_NUMBER, w = b, I = {};
        I.getMode = function() {
          return S;
        }, I.getLength = function(x) {
          return w.length;
        }, I.write = function(x) {
          for (var g = w, E = 0; E + 2 < g.length; )
            x.put(_(g.substring(E, E + 3)), 10), E += 3;
          E < g.length && (g.length - E == 1 ? x.put(_(g.substring(E, E + 1)), 4) : g.length - E == 2 && x.put(_(g.substring(E, E + 2)), 7));
        };
        var _ = function(x) {
          for (var g = 0, E = 0; E < x.length; E += 1)
            g = g * 10 + L(x.charAt(E));
          return g;
        }, L = function(x) {
          if ("0" <= x && x <= "9")
            return x.charCodeAt(0) - 48;
          throw "illegal char :" + x;
        };
        return I;
      }, p = function(b) {
        var S = s.MODE_ALPHA_NUM, w = b, I = {};
        I.getMode = function() {
          return S;
        }, I.getLength = function(L) {
          return w.length;
        }, I.write = function(L) {
          for (var x = w, g = 0; g + 1 < x.length; )
            L.put(
              _(x.charAt(g)) * 45 + _(x.charAt(g + 1)),
              11
            ), g += 2;
          g < x.length && L.put(_(x.charAt(g)), 6);
        };
        var _ = function(L) {
          if ("0" <= L && L <= "9")
            return L.charCodeAt(0) - 48;
          if ("A" <= L && L <= "Z")
            return L.charCodeAt(0) - 65 + 10;
          switch (L) {
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
              throw "illegal char :" + L;
          }
        };
        return I;
      }, y = function(b) {
        var S = s.MODE_8BIT_BYTE, w = a.stringToBytes(b), I = {};
        return I.getMode = function() {
          return S;
        }, I.getLength = function(_) {
          return w.length;
        }, I.write = function(_) {
          for (var L = 0; L < w.length; L += 1)
            _.put(w[L], 8);
        }, I;
      }, $ = function(b) {
        var S = s.MODE_KANJI, w = a.stringToBytesFuncs.SJIS;
        if (!w)
          throw "sjis not supported.";
        (function(L, x) {
          var g = w(L);
          if (g.length != 2 || (g[0] << 8 | g[1]) != x)
            throw "sjis not supported.";
        })("友", 38726);
        var I = w(b), _ = {};
        return _.getMode = function() {
          return S;
        }, _.getLength = function(L) {
          return ~~(I.length / 2);
        }, _.write = function(L) {
          for (var x = I, g = 0; g + 1 < x.length; ) {
            var E = (255 & x[g]) << 8 | 255 & x[g + 1];
            if (33088 <= E && E <= 40956)
              E -= 33088;
            else if (57408 <= E && E <= 60351)
              E -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + E;
            E = (E >>> 8 & 255) * 192 + (E & 255), L.put(E, 13), g += 2;
          }
          if (g < x.length)
            throw "illegal char at " + (g + 1);
        }, _;
      }, M = function() {
        var b = [], S = {};
        return S.writeByte = function(w) {
          b.push(w & 255);
        }, S.writeShort = function(w) {
          S.writeByte(w), S.writeByte(w >>> 8);
        }, S.writeBytes = function(w, I, _) {
          I = I || 0, _ = _ || w.length;
          for (var L = 0; L < _; L += 1)
            S.writeByte(w[L + I]);
        }, S.writeString = function(w) {
          for (var I = 0; I < w.length; I += 1)
            S.writeByte(w.charCodeAt(I));
        }, S.toByteArray = function() {
          return b;
        }, S.toString = function() {
          var w = "";
          w += "[";
          for (var I = 0; I < b.length; I += 1)
            I > 0 && (w += ","), w += b[I];
          return w += "]", w;
        }, S;
      }, O = function() {
        var b = 0, S = 0, w = 0, I = "", _ = {}, L = function(g) {
          I += String.fromCharCode(x(g & 63));
        }, x = function(g) {
          if (!(g < 0)) {
            if (g < 26)
              return 65 + g;
            if (g < 52)
              return 97 + (g - 26);
            if (g < 62)
              return 48 + (g - 52);
            if (g == 62)
              return 43;
            if (g == 63)
              return 47;
          }
          throw "n:" + g;
        };
        return _.writeByte = function(g) {
          for (b = b << 8 | g & 255, S += 8, w += 1; S >= 6; )
            L(b >>> S - 6), S -= 6;
        }, _.flush = function() {
          if (S > 0 && (L(b << 6 - S), b = 0, S = 0), w % 3 != 0)
            for (var g = 3 - w % 3, E = 0; E < g; E += 1)
              I += "=";
        }, _.toString = function() {
          return I;
        }, _;
      }, F = function(b) {
        var S = b, w = 0, I = 0, _ = 0, L = {};
        L.read = function() {
          for (; _ < 8; ) {
            if (w >= S.length) {
              if (_ == 0)
                return -1;
              throw "unexpected end of file./" + _;
            }
            var g = S.charAt(w);
            if (w += 1, g == "=")
              return _ = 0, -1;
            if (g.match(/^\s$/))
              continue;
            I = I << 6 | x(g.charCodeAt(0)), _ += 6;
          }
          var E = I >>> _ - 8 & 255;
          return _ -= 8, E;
        };
        var x = function(g) {
          if (65 <= g && g <= 90)
            return g - 65;
          if (97 <= g && g <= 122)
            return g - 97 + 26;
          if (48 <= g && g <= 57)
            return g - 48 + 52;
          if (g == 43)
            return 62;
          if (g == 47)
            return 63;
          throw "c:" + g;
        };
        return L;
      }, W = function(b, S) {
        var w = b, I = S, _ = new Array(b * S), L = {};
        L.setPixel = function(T, N, J) {
          _[N * w + T] = J;
        }, L.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(w), T.writeShort(I), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(w), T.writeShort(I), T.writeByte(0);
          var N = 2, J = g(N);
          T.writeByte(N);
          for (var ee = 0; J.length - ee > 255; )
            T.writeByte(255), T.writeBytes(J, ee, 255), ee += 255;
          T.writeByte(J.length - ee), T.writeBytes(J, ee, J.length - ee), T.writeByte(0), T.writeString(";");
        };
        var x = function(T) {
          var N = T, J = 0, ee = 0, re = {};
          return re.write = function(ie, fe) {
            if (ie >>> fe)
              throw "length over";
            for (; J + fe >= 8; )
              N.writeByte(255 & (ie << J | ee)), fe -= 8 - J, ie >>>= 8 - J, ee = 0, J = 0;
            ee = ie << J | ee, J = J + fe;
          }, re.flush = function() {
            J > 0 && N.writeByte(ee);
          }, re;
        }, g = function(T) {
          for (var N = 1 << T, J = (1 << T) + 1, ee = T + 1, re = E(), ie = 0; ie < N; ie += 1)
            re.add(String.fromCharCode(ie));
          re.add(String.fromCharCode(N)), re.add(String.fromCharCode(J));
          var fe = M(), Ce = x(fe);
          Ce.write(N, ee);
          var Fe = 0, ve = String.fromCharCode(_[Fe]);
          for (Fe += 1; Fe < _.length; ) {
            var he = String.fromCharCode(_[Fe]);
            Fe += 1, re.contains(ve + he) ? ve = ve + he : (Ce.write(re.indexOf(ve), ee), re.size() < 4095 && (re.size() == 1 << ee && (ee += 1), re.add(ve + he)), ve = he);
          }
          return Ce.write(re.indexOf(ve), ee), Ce.write(J, ee), Ce.flush(), fe.toByteArray();
        }, E = function() {
          var T = {}, N = 0, J = {};
          return J.add = function(ee) {
            if (J.contains(ee))
              throw "dup key:" + ee;
            T[ee] = N, N += 1;
          }, J.size = function() {
            return N;
          }, J.indexOf = function(ee) {
            return T[ee];
          }, J.contains = function(ee) {
            return typeof T[ee] < "u";
          }, J;
        };
        return L;
      }, C = function(b, S, w) {
        for (var I = W(b, S), _ = 0; _ < S; _ += 1)
          for (var L = 0; L < b; L += 1)
            I.setPixel(L, _, w(L, _));
        var x = M();
        I.write(x);
        for (var g = O(), E = x.toByteArray(), T = 0; T < E.length; T += 1)
          g.writeByte(E[T]);
        return g.flush(), "data:image/gif;base64," + g;
      };
      return a;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(a) {
        function s(o) {
          for (var l = [], r = 0; r < o.length; r++) {
            var i = o.charCodeAt(r);
            i < 128 ? l.push(i) : i < 2048 ? l.push(
              192 | i >> 6,
              128 | i & 63
            ) : i < 55296 || i >= 57344 ? l.push(
              224 | i >> 12,
              128 | i >> 6 & 63,
              128 | i & 63
            ) : (r++, i = 65536 + ((i & 1023) << 10 | o.charCodeAt(r) & 1023), l.push(
              240 | i >> 18,
              128 | i >> 12 & 63,
              128 | i >> 6 & 63,
              128 | i & 63
            ));
          }
          return l;
        }
        return s(a);
      };
    })(), (function(a) {
      e.exports = a();
    })(function() {
      return n;
    });
  })(ja)), ja.exports;
}
var h5 = f5();
const m5 = /* @__PURE__ */ d5(h5), p5 = ["width", "height", "viewBox"], g5 = ["width", "height"], v5 = ["d"], y5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = B(() => {
      const a = m5(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
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
      v("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, g5),
      v("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, v5)
    ], 8, p5));
  }
}, J$ = /* @__PURE__ */ Y(y5, [["__scopeId", "data-v-489f0852"]]), b5 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, Z$ = /* @__PURE__ */ Y(b5, [["__scopeId", "data-v-47e67f04"]]);
function X$(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const Q$ = hi(() => import("./VoiceFigure-Cbn3BSGk.js").then((e) => e.V)), e8 = "1.2.0", t8 = "3.5";
export {
  yd as $,
  _e as A,
  Oe as B,
  na as C,
  at as D,
  o$ as E,
  bb as F,
  Y4 as G,
  t$ as H,
  Qy as I,
  _b as J,
  Ct as K,
  x5 as L,
  Ts as M,
  Rb as N,
  Sb as O,
  ta as P,
  kx as Q,
  A4 as R,
  In as S,
  _x as T,
  w4 as U,
  Ee as V,
  Fn as W,
  b4 as X,
  y4 as Y,
  vd as Z,
  Y as _,
  u4 as a,
  Hx as a$,
  Ob as a0,
  C4 as a1,
  O4 as a2,
  Te as a3,
  F4 as a4,
  q4 as a5,
  Mt as a6,
  T4 as a7,
  Q4 as a8,
  Q5 as a9,
  Lx as aA,
  yx as aB,
  Wy as aC,
  ax as aD,
  sx as aE,
  l$ as aF,
  Lr as aG,
  Sx as aH,
  dn as aI,
  o4 as aJ,
  n4 as aK,
  Yx as aL,
  fn as aM,
  Qx as aN,
  K4 as aO,
  bx as aP,
  wx as aQ,
  vx as aR,
  an as aS,
  kt as aT,
  e4 as aU,
  Rv as aV,
  px as aW,
  _4 as aX,
  Ir as aY,
  Nt as aZ,
  qt as a_,
  Ux as aa,
  Zx as ab,
  i4 as ac,
  k4 as ad,
  x4 as ae,
  j4 as af,
  P4 as ag,
  W4 as ah,
  m4 as ai,
  qo as aj,
  R4 as ak,
  X4 as al,
  u$ as am,
  dx as an,
  cx as ao,
  ix as ap,
  H4 as aq,
  N4 as ar,
  L4 as as,
  D4 as at,
  Mx as au,
  Z4 as av,
  ex as aw,
  h$ as ax,
  Yt as ay,
  tx as az,
  Hb as b,
  f$ as b$,
  pb as b0,
  Xx as b1,
  Cx as b2,
  Ax as b3,
  ny as b4,
  wr as b5,
  qx as b6,
  J4 as b7,
  oa as b8,
  rt as b9,
  Tx as bA,
  Dx as bB,
  dt as bC,
  Ex as bD,
  jx as bE,
  nx as bF,
  fx as bG,
  ox as bH,
  Re as bI,
  G4 as bJ,
  Px as bK,
  k$ as bL,
  x$ as bM,
  Z5 as bN,
  Lv as bO,
  z4 as bP,
  Rx as bQ,
  d4 as bR,
  c$ as bS,
  Ox as bT,
  Ix as bU,
  Bx as bV,
  U4 as bW,
  Hy as bX,
  V4 as bY,
  rx as bZ,
  i$ as b_,
  Nx as ba,
  _a as bb,
  zl as bc,
  p$ as bd,
  y$ as be,
  $x as bf,
  Kx as bg,
  X5 as bh,
  ux as bi,
  g$ as bj,
  I4 as bk,
  B4 as bl,
  g4 as bm,
  E4 as bn,
  s4 as bo,
  Vx as bp,
  f4 as bq,
  h4 as br,
  v4 as bs,
  mx as bt,
  Ev as bu,
  e$ as bv,
  Mb as bw,
  p4 as bx,
  l4 as by,
  hx as bz,
  ty as c,
  q5 as c$,
  a4 as c0,
  t4 as c1,
  lx as c2,
  b$ as c3,
  Ns as c4,
  w$ as c5,
  Jr as c6,
  Gx as c7,
  M4 as c8,
  $4 as c9,
  j$ as cA,
  O5 as cB,
  e8 as cC,
  t8 as cD,
  j5 as cE,
  q$ as cF,
  es as cG,
  V5 as cH,
  d0 as cI,
  $t as cJ,
  is as cK,
  Zn as cL,
  I5 as cM,
  P5 as cN,
  Di as cO,
  Ag as cP,
  G$ as cQ,
  L5 as cR,
  J$ as cS,
  iw as cT,
  ac as cU,
  L$ as cV,
  Td as cW,
  _5 as cX,
  K5 as cY,
  Uw as cZ,
  Xn as c_,
  Tv as ca,
  r4 as cb,
  xb as cc,
  gx as cd,
  As as ce,
  Dy as cf,
  xx as cg,
  Jt as ch,
  Lt as ci,
  T5 as cj,
  D$ as ck,
  de as cl,
  td as cm,
  id as cn,
  bs as co,
  cm as cp,
  Ml as cq,
  K$ as cr,
  J5 as cs,
  Cp as ct,
  Qt as cu,
  $$ as cv,
  k5 as cw,
  xt as cx,
  Tu as cy,
  ye as cz,
  He as d,
  uw as d$,
  Et as d0,
  mt as d1,
  ap as d2,
  dc as d3,
  U5 as d4,
  E5 as d5,
  jt as d6,
  P$ as d7,
  Y$ as d8,
  Qr as d9,
  M$ as dA,
  M5 as dB,
  W$ as dC,
  o0 as dD,
  fw as dE,
  A5 as dF,
  D5 as dG,
  C$ as dH,
  T$ as dI,
  qe as dJ,
  R5 as dK,
  B5 as dL,
  A$ as dM,
  Pp as dN,
  S5 as dO,
  $5 as dP,
  ml as dQ,
  pl as dR,
  iu as dS,
  C5 as dT,
  ut as dU,
  X$ as dV,
  hw as dW,
  W5 as dX,
  E$ as dY,
  H5 as dZ,
  N$ as d_,
  Iu as da,
  wt as db,
  F5 as dc,
  la as dd,
  Q$ as de,
  Z$ as df,
  Ss as dg,
  O$ as dh,
  hs as di,
  v1 as dj,
  go as dk,
  er as dl,
  lu as dm,
  z$ as dn,
  U$ as dp,
  ps as dq,
  ou as dr,
  ul as ds,
  N5 as dt,
  V$ as du,
  Y5 as dv,
  G5 as dw,
  z5 as dx,
  S$ as dy,
  eh as dz,
  S4 as e,
  F$ as e0,
  fg as e1,
  al as e2,
  Qw as e3,
  ir as e4,
  R$ as e5,
  Qa as e6,
  I$ as e7,
  B$ as e8,
  Ke as e9,
  _$ as ea,
  H$ as eb,
  ru as ec,
  _v as f,
  m$ as g,
  sn as h,
  n$ as i,
  v$ as j,
  a$ as k,
  zx as l,
  Kb as m,
  Rs as n,
  Jx as o,
  c4 as p,
  s$ as q,
  Kr as r,
  Yr as s,
  Me as t,
  sy as u,
  Fx as v,
  d$ as w,
  Wx as x,
  mn as y,
  r$ as z
};
