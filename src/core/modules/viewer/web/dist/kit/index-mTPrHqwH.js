/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ge, unref as P, renderSlot as ue, createElementVNode as v, normalizeClass as Z, Fragment as V, renderList as te, defineComponent as Qr, Comment as ei, h as Gn, cloneVNode as ti, createBlock as H, withCtx as q, createVNode as N, toDisplayString as x, createCommentVNode as A, inject as Ae, useAttrs as Kn, computed as B, ref as R, resolveDynamicComponent as St, mergeProps as Ge, createTextVNode as Q, watch as me, onUnmounted as Be, onMounted as Le, Teleport as us, useId as ds, resolveDirective as ni, withDirectives as et, reactive as Yn, shallowRef as Ve, nextTick as ht, Transition as Dt, withModifiers as xe, TransitionGroup as Zo, shallowReactive as ai, isRef as qs, onBeforeUnmount as _t, onScopeDispose as fs, resolveComponent as si, useModel as Pa, getCurrentInstance as oi, mergeModels as qa, getCurrentScope as Xo, provide as li, onErrorCaptured as ri, toHandlers as ii, createSlots as ci, vShow as Qo, useSlots as ui, withKeys as Xt, vModelText as Fa, defineAsyncComponent as di } from "vue";
function el(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, fi = 1600, hi = {
  __name: "Shimmer",
  setup(e) {
    const t = el(fi);
    return (n, a) => (c(), h("span", {
      class: "shimmer",
      style: ge(P(t))
    }, null, 4));
  }
}, Vt = /* @__PURE__ */ K(hi, [["__scopeId", "data-v-6c018b03"]]), mi = { class: "skeleton-line" }, pi = 2e3, gi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = el(pi);
    return (n, a) => (c(), h("span", mi, [
      ue(n.$slots, "default", {}, void 0, !0),
      v("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(V, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...P(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, mt = /* @__PURE__ */ K(gi, [["__scopeId", "data-v-484fe8a0"]]), jt = Qr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ei);
      return a.length !== 1 ? Gn(V, { key: n }, a) : a[0].key == null ? ti(a[0], { key: n }) : a[0];
    };
  }
}), vi = ["aria-label"], yi = ["aria-label"], bi = ["aria-label"], wi = ["aria-label"], ki = ["aria-label"], xi = ["aria-label"], $i = ["aria-label"], Mi = {
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
    return (i, u) => (c(), H(jt, { value: e.shape }, {
      messages: q(() => [
        v("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(V, null, te(t, (d) => N(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, vi)
      ]),
      older: q(() => [
        v("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(t.slice(0, 3), (d) => (c(), H(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, yi)
      ]),
      cards: q(() => [
        v("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(V, null, te(n, (f) => N(mt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, bi)
      ]),
      file: q(() => [
        v("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            N(mt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(V, null, te(s, (f) => N(mt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, wi)
      ]),
      page: q(() => [
        v("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          N(mt, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(V, null, te(e.count, (d) => (c(), H(mt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, ki)
      ]),
      text: q(() => [
        v("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(e.count, (d) => (c(), H(mt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, xi)
      ]),
      default: q(() => [
        v("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(e.count, (d) => (c(), H(mt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, $i)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Et = /* @__PURE__ */ K(Mi, [["__scopeId", "data-v-ef519c5f"]]), Si = {
  key: 1,
  class: "empty-state titled"
}, _i = { class: "empty-state-title" }, Ei = { class: "empty-state-text" }, Ai = {
  key: 2,
  class: "empty-state"
}, Ci = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), H(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Si, [
      v("p", _i, x(e.title), 1),
      v("p", Ei, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Ai, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ K(Ci, [["__scopeId", "data-v-b27e89b0"]]), Oi = { class: "fold-group" }, Ti = ["aria-expanded"], Ri = { class: "fold-label" }, Ii = {
  key: 0,
  class: "fold-count"
}, Bi = {
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
    return (a, s) => (c(), h("div", Oi, [
      v("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        v("span", Ri, x(e.label), 1),
        e.count !== "" ? (c(), h("span", Ii, x(e.count), 1)) : A("", !0),
        v("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Ti),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, y5 = /* @__PURE__ */ K(Bi, [["__scopeId", "data-v-9ef1865c"]]), Li = Symbol("open-view"), Te = Symbol.for("journal.window-context");
function nt() {
  const e = Ae(Te, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const tl = 120;
var Yo;
const ia = globalThis[Yo = Symbol.for("journal.pressed")] ?? (globalThis[Yo] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Ni(e = 0) {
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
const Di = ["stroke-width", "innerHTML"], ye = {
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
    }, null, 12, Di));
  }
}, ji = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Pi = /* @__PURE__ */ K(ji, [["__scopeId", "data-v-eb453d6f"]]), qi = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    return (u, d) => (c(), H(St(e.href ? "a" : "button"), Ge(a.value, {
      type: e.href ? void 0 : P(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: q(() => [
        v("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          ue(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), H(Pi, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ K(qi, [["__scopeId", "data-v-ededdadf"]]), Fi = {
  key: 0,
  class: "more-items"
}, Wi = {
  key: 0,
  role: "alert"
}, Hi = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (c(), h("div", Fi, [
      e.failure ? (c(), h("p", Wi, x(e.failure), 1)) : A("", !0),
      e.more ? (c(), H(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: q(() => [
          Q(x(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : A("", !0)
    ])) : A("", !0);
  }
}, Jn = /* @__PURE__ */ K(Hi, [["__scopeId", "data-v-10464014"]]), Ui = {
  key: 0,
  class: "resource-links",
  "data-resource-links": ""
}, zi = ["data-kind"], Vi = { class: "count" }, Gi = ["disabled", "onClick"], Ki = { class: "type" }, Yi = { class: "title" }, Ji = { class: "relations" }, Zi = {
  key: 0,
  class: "unavailable"
}, Xi = ["data-kind", "onClick"], Qi = { key: 0 }, ec = {
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
    const u = (w) => w.endpoint.model === "doc" && w.endpoint.id === n.documentId, d = B(() => [...s.value].sort((w, $) => Number(u($)) - Number(u(w)))), f = R(/* @__PURE__ */ new Set()), m = (w) => u(w) ? "design" : w.endpoint.model, g = (w) => w === "design" ? "Design document" : w.replaceAll("_", " "), y = B(() => {
      const w = /* @__PURE__ */ new Map();
      for (const $ of d.value) w.set(m($), [...w.get(m($)) ?? [], $]);
      return [...w].map(([$, S]) => ({ kind: $, items: S, shown: f.value.has($) ? S : S.slice(0, n.shownPerKind) }));
    }), k = (w) => f.value = /* @__PURE__ */ new Set([...f.value, w]), b = (w) => w.endpoint.unavailable || !w.endpoint.open_ref, _ = (w) => ({ [n.linkAttribute]: !0, "data-link-model": w.endpoint.model, "data-link-id": w.endpoint.id });
    async function j(w = 1) {
      const $ = ++i;
      l.value = !0, r.value = "";
      const S = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(w), "--page-size", String(n.pageSize)];
      n.documentId && S.push("--first-counterpart", `doc:${n.documentId}`);
      try {
        const C = await n.read(S);
        if ($ !== i) return;
        if (!C.ok) {
          r.value = C.error;
          return;
        }
        const E = C.value.counterparts ?? [], I = w === 1 ? E : [...s.value, ...E];
        s.value = [...new Map(I.map((M) => [`${M.endpoint.model}:${M.endpoint.id}`, M])).values()], o.value = C.value.next_page ?? null;
      } catch (C) {
        $ === i && (r.value = C.message);
      } finally {
        $ === i && (l.value = !1);
      }
    }
    function J(w) {
      if (b(w)) return;
      const [$, S] = w.endpoint.open_ref.split(":");
      a("open", { table: $, id: Number(S) });
    }
    const D = () => !l.value && o.value && j(o.value);
    return me(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}`, () => {
      s.value = [], o.value = null, f.value = /* @__PURE__ */ new Set(), j();
    }, { immediate: !0 }), (w, $) => d.value.length || l.value || r.value || e.empty ? (c(), h("section", Ui, [
      (c(!0), h(V, null, te(y.value, (S) => (c(), h(V, {
        key: S.kind
      }, [
        v("h4", {
          class: "kind",
          "data-link-kind": "",
          "data-kind": S.kind
        }, [
          Q(x(g(S.kind)) + " ", 1),
          v("span", Vi, x(S.items.length) + x(o.value ? "+" : ""), 1)
        ], 8, zi),
        (c(!0), h(V, null, te(S.shown, (C) => (c(), h("button", Ge({
          key: `${C.endpoint.model}:${C.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, _(C), {
          disabled: b(C),
          onClick: (E) => J(C)
        }), [
          v("span", Ki, x(u(C) ? "Design document" : C.endpoint.model.replaceAll("_", " ")) + " " + x(C.endpoint.id), 1),
          v("span", Yi, x(C.endpoint.title), 1),
          v("span", Ji, x(C.relations.join(", ")), 1),
          b(C) ? (c(), h("span", Zi, "Unavailable")) : A("", !0)
        ], 16, Gi))), 128)),
        S.shown.length < S.items.length ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "show-more",
          "data-link-show-more": "",
          "data-kind": S.kind,
          onClick: (C) => k(S.kind)
        }, "Show " + x(S.items.length - S.shown.length) + " more", 9, Xi)) : A("", !0)
      ], 64))), 128)),
      !d.value.length && !l.value && !r.value && e.empty ? (c(), h("p", Qi, x(e.empty), 1)) : A("", !0),
      N(Jn, {
        more: !!o.value,
        loading: l.value,
        failure: r.value,
        label: "More linked items",
        onMore: D
      }, null, 8, ["more", "loading", "failure"])
    ])) : A("", !0);
  }
}, tc = /* @__PURE__ */ K(ec, [["__scopeId", "data-v-a573b2e9"]]), nc = (e, t, n) => Math.max(t, Math.min(n, e)), ac = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, nl = /* @__PURE__ */ new WeakMap(), sc = (e, t) => nl.set(e, t);
function oc(e, t) {
  for (let n = t; n; n = nl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function al(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !oc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ot = 8, lc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = R(null), o = (p) => p ? `${p}px` : void 0, l = B(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = R({ w: 0, h: 0 }), i = R(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const O = p.closest(".pane, .float-window");
      return O ? d(O.getBoundingClientRect()) : u();
    }, m = (p, O) => `${Math.max(0, p ? Math.min(p, O) : O)}px`;
    function g(p, O) {
      return {
        below: p.bottom - O.bottom - a.gap - Ot,
        above: O.top - p.top - a.gap - Ot,
        across: p.right - p.left - 2 * Ot
      };
    }
    function y(p) {
      const O = f(a.anchor), T = g(O, p);
      return r.value.w <= T.across && r.value.h <= Math.max(T.below, T.above) ? O : u();
    }
    const k = B(() => {
      if (!i.value) return l.value;
      const p = i.value, O = y(p), T = g(O, p), { w: L, h: Y } = r.value, ee = a.align === "auto" ? p.left + p.right > O.left + O.right : a.align === "right", re = nc(ee ? p.right - L : p.left, O.left + Ot, Math.max(O.left + Ot, O.right - L - Ot)), fe = Y > T.below && T.above > T.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, T.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, T.below) };
      return { ...l.value, ...fe, left: `${re}px`, maxWidth: m(a.maxWidth, T.across) };
    }), b = n, _ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function j(p) {
      const O = _(), T = O.indexOf(document.activeElement);
      O[(T + p + O.length) % O.length].focus();
    }
    const J = { ArrowDown: () => j(1), ArrowUp: () => j(-1), Escape: () => b("close") }, D = (p) => J[p.key] && (p.preventDefault(), J[p.key]()), w = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let $ = 0;
    const S = new ResizeObserver(() => {
      cancelAnimationFrame($), $ = requestAnimationFrame(w);
    });
    al(s, (p) => a.anchor && !a.anchor.contains(p.target) && b("close"));
    const C = (p, O) => ["top", "left", "right", "bottom"].some((T) => Math.abs(p[T] - O[T]) > 1), E = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let I = 0;
    function M() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || E(p)) return b("close");
        C(p, i.value) && (i.value = p);
      }
      I = requestAnimationFrame(M);
    }
    return Le(() => {
      a.anchor && s.value && sc(s.value, a.anchor), w(), s.value && S.observe(s.value), !a.plain && _()[0] && _()[0].focus(), M();
    }), Be(() => {
      S.disconnect(), cancelAnimationFrame(I), cancelAnimationFrame($);
    }), t({ element: s }), (p, O) => (c(), H(us, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ge({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: k.value,
        onKeydown: D
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Zn = /* @__PURE__ */ K(lc, [["__scopeId", "data-v-3d203970"]]), rc = { class: "split-button" }, ic = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = R(null), s = R(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", rc, [
      N(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: q(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      v("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        N(de, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: q(() => [
            N(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), H(Zn, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: q(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : A("", !0)
    ]));
  }
}, cc = /* @__PURE__ */ K(ic, [["__scopeId", "data-v-c258494d"]]), uc = ["aria-checked", "aria-haspopup", "onClick"], dc = {
  key: 0,
  class: "segmented-dot"
}, fc = {
  key: 1,
  class: "segmented-note"
}, hc = {
  key: 2,
  class: "segmented-count"
}, mc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = ds();
    return (s, o) => {
      const l = ni("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(V, null, te(e.options, (r) => et((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", dc)) : A("", !0),
          Q(" " + x(r.label) + " ", 1),
          r.note ? (c(), h("small", fc, x(r.note), 1)) : A("", !0),
          r.count !== void 0 ? (c(), h("em", hc, x(r.count), 1)) : A("", !0)
        ], 10, uc)), [
          [l, r.tip || r.title, `${P(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Xn = /* @__PURE__ */ K(mc, [["__scopeId", "data-v-c89bc92d"]]), sl = typeof document < "u" && document.documentElement.classList.contains("phone");
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
const Ha = "journal.stale-build-reload", pc = 'script[type="module"][src*="/assets/index-"]', Fs = (e) => {
  var t;
  return ((t = e.querySelector(pc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function gc(e = document, t = (a, s) => Me.quietRead(a, s), n = () => ol(window)) {
  const a = Fs(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Fs(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ca = "";
function vc(e, t = () => ol(window)) {
  if (!e) return !1;
  const n = !!ca && ca !== e;
  return ca = e, n && t(), n;
}
const yc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function bc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ha) === e.message) return !1;
    t.setItem(Ha, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function wc(e = window.sessionStorage) {
  try {
    e.removeItem(Ha);
  } catch {
    return;
  }
}
const kc = 2e3, xc = 3e4, We = Yn({ starting: !1, external: !1, late: !1, offline: !1 }), ll = () => We.starting, $c = 3;
let gn = 0, Ua = 0, rl = 0, il = [];
async function Mc() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: We.external };
  }
}
let Ws = null;
const Sc = () => Ws ?? (Ws = Mc().finally(() => Ws = null));
function _c() {
  clearTimeout(Ua), clearTimeout(rl), Ua = 0, Object.assign(We, { starting: !1, external: !1, late: !1, offline: !1 }), il.splice(0).forEach((e) => e()), gc();
}
async function Ec() {
  We.offline = !navigator.onLine;
  const e = await Sc();
  if (We.external = e.updating, gn = !e.restarting && !e.updating && e.reachable ? gn + 1 : 0, gn < $c) return;
  gn = 0, (!vc(e.started_at) || Wa()) && _c();
}
function cl() {
  Ua = setTimeout(async () => {
    await Ec(), We.starting && cl();
  }, kc);
}
function Ac() {
  We.starting || (We.starting = !0, We.offline = !navigator.onLine, cl(), rl = setTimeout(() => We.late = !0, xc));
}
const Cc = () => We.starting ? new Promise((e) => il.push(e)) : Promise.resolve();
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
function Oc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Tc {
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Oc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const st = "viewer.shell", vn = 2e4, Rc = 4, Hs = "/api/read-lines", Ic = 5e3, Bc = 403, Us = "/api/repeated-lines", Lc = 10, Nc = 2e3, Dc = 3e5, b5 = 6e5, yn = 6, jc = 500, Pc = "/journal/summary", zs = "/api/server-state", qc = 2e4, bn = sl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Fc = (e) => e.split("?")[0].endsWith(Pc), za = (e, t) => Object.assign(new Error(t), { status: e });
async function Wc(e, t, n = za) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Hc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Uc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Vs = (e) => e.split(" ").slice(0, 2).join(" "), Je = "read", Rt = "write", zc = "stream";
class Vc {
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
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < Nc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Lc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Us, { method: "POST", headers: { ...bn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Us, kind: Rt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Ni(n ? tl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Uc(n.signal, s) } : n;
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
      throw o instanceof TypeError && Ac(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Rc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Hs, { headers: bn }, [{ window: st, line: Hs, kind: Je }], Ic).then(async (t) => {
      if (t.status === Bc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw za(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Tc(
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
    const r = a instanceof FormData, i = { method: t, headers: { ...bn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Hc(a) }, u = s || (r ? Dc : vn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Je }], u)) : await this.sent(n, i, [{ window: st, line: n, kind: Rt }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, jc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = yn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Wc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: st, line: t, kind: Je }], vn)), !0);
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
    return t !== "GET" ? this.send(t, n, a, s, yn, o).then((r) => (this.written(n), r)) : ll() && !Fc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: st, line: t, kind: zc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(zs, { cache: "no-store" }, [{ window: st, line: zs, kind: Je }], qc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = vn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Je : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ua = Symbol.for("journal.transport"), Me = globalThis[ua] ?? (globalThis[ua] = new Vc()), Gc = 0, Kc = "/api/lines", Yc = "/api/line", Gs = 5e3, Ks = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Ys = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), da = (e) => JSON.stringify(e.line), Js = () => new DOMException("cancelled", "AbortError");
class Jc {
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), Gc));
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
      const o = await Me.sent(Kc, Ks({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Ys(r.body, Je)), Gs);
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
    await this.alone(t, Je), Date.now() - n < Gs ? this.slow.delete(da(t.body)) : this.slow.add(da(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(Yc, Ks(t.body, t.signal), [Ys(t.body, n)], n === Je ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const dl = new Jc(), Zc = "/api/window";
function Xc(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Zc}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (u) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: u, headers: r }, [{ window: e, line: l, kind: Je }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const Qc = 150, eu = () => Qc;
function hs(e, t, n = eu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class tu {
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
class nu {
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
function w5(e, t) {
  const n = new nu(e, t);
  return fl.set(e, n), n.load().catch(() => {
  }), n;
}
const ps = (e) => fl.get(e);
function au(e, t, n) {
  const a = ps(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function su(e, t) {
  if (!e) return !0;
  const n = ps(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const ou = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let hl = {};
async function k5(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (hl = (await t.json()).states);
}
const gs = (e, t) => {
  var n;
  return (n = hl[e]) == null ? void 0 : n[t];
}, ml = (e, t) => {
  var n;
  return ((n = gs(e, t)) == null ? void 0 : n.label) ?? ou(t);
}, pl = (e, t) => {
  var n;
  return ((n = gs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, lu = (e, t) => {
  var n;
  return ((n = gs(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, ru = Symbol("pane-page"), iu = Symbol("inspector-host"), gl = { 1: "refused", 2: "usage", 3: "fault" }, cu = 100, uu = 50, du = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, fu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function hu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = R({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: g = [], sources: y = [], links: k = {}, search: b = {}, readOnly: _ = !1, shared: j = null }) {
  const J = /* @__PURE__ */ new Map(), D = new AbortController(), w = R(!1), $ = performance.now();
  let S = 0, C = 0, E = () => {
  };
  const I = new Promise((Y) => E = Y);
  D.signal.addEventListener("abort", E, { once: !0 });
  const M = () => {
    clearTimeout(C), C = setTimeout(() => {
      S === 0 && hs($, () => {
        w.value = !0, E();
      });
    }, uu);
  }, p = (Y, ee) => (S += 1, it(e, Y, t, D.signal, ee).finally(() => {
    S -= 1, M();
  })), O = (Y, ee) => (M(), I.then(() => D.signal.aborted ? tt : it(e, Y, t, D.signal, ee))), T = ({ only: Y = [], state: ee = {} } = {}) => (S += 1, pu(() => Xc(e, t, Y, ee, D.signal), D.signal).finally(() => {
    S -= 1, M();
  })), L = (Y, { unbatched: ee = !1, deferred: re = !1 } = {}) => {
    const ie = J.get(Y);
    if (ie && performance.now() - ie.at < cu) return ie.answer;
    const fe = re && !w.value ? O(Y, ee) : p(Y, ee);
    return J.set(Y, { answer: fe, at: performance.now() }), fe;
  };
  return {
    answered: w,
    settle: M,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: B(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: g,
    sources: y,
    links: k,
    search: b,
    readOnly: _,
    shared: j,
    read: L,
    readKeys: T,
    run: (Y) => it(e, Y, t, D.signal),
    upload: (Y) => vu(Y, e, D.signal),
    cancel: () => D.abort(),
    signal: D.signal,
    subscriptions: l,
    follow: (Y, ee) => l.follow(e, Y.filter((re) => o.some((ie) => ms(ie, re))), (re) => {
      J.clear(), ee(re);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (Y) => B(() => {
      var ee;
      return i.value[Y] ?? ((ee = u.find((re) => re.key === Y)) == null ? void 0 : ee.default);
    }),
    setting: async (Y, ee) => {
      const re = await L(`window setting ${e} ${Y}`);
      return re.ok ? re.value.value : ee;
    },
    setOption: f,
    keep: (Y, ee) => it(e, ["window", "save-setting", e, Y, JSON.stringify(ee)], t, D.signal)
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
const tt = { ok: !1, failure: "cancelled", error: "" }, vs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function yl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? tt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: gl[n.code] || "fault", error: vl(n.error) };
  } catch {
    return t != null && t.aborted ? tt : { ok: !1, failure: "unreachable", error: vs };
  }
}
const mu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: gl[e.code] || "fault", error: vl(e.error) };
async function pu(e, t) {
  try {
    const n = await e();
    return t.aborted ? tt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, mu(s)])) } };
  } catch {
    return t.aborted ? tt : { ok: !1, failure: "unreachable", error: vs };
  }
}
async function bl(e, t, n) {
  const a = await yl(() => dl.read(e, t, n), t);
  return a.failure !== "unreachable" || !ll() ? a : (await Cc(), t.aborted ? tt : bl(e, t, n));
}
function it(e, t, n, a = void 0, s = !1) {
  return Me.held(() => gu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : ys(t)));
}
async function gu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : ys(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => bl({ ...o, attribution: r }, l, s), a, o).catch(() => tt) : yl(() => dl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function vu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? tt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? tt : { ok: !1, failure: "unreachable", error: vs };
  }
}
function ys(e) {
  return [...e.matchAll(du)].map(([t]) => t.replace(fu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const yu = (e) => `show-${e}`, x5 = (e, t, n) => e.filter((a) => {
  var s;
  return n(yu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), wl = "messages.chat", bu = {
  key: 0,
  class: "template-brief"
}, wu = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, ku = {
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
    return i(), (u, d) => (c(), h(V, null, [
      N(Xn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", bu, x(r.value.brief), 1)) : A("", !0),
      o.value ? (c(), h("p", wu, x(o.value), 1)) : A("", !0)
    ], 64));
  }
}, xu = /* @__PURE__ */ K(ku, [["__scopeId", "data-v-14be8a5c"]]), $u = { class: "form-field" }, Mu = { class: "form-field-head" }, Su = ["for"], _u = {
  key: 0,
  class: "form-field-aside"
}, Eu = {
  key: 0,
  class: "form-field-help"
}, Au = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", $u, [
      v("div", Mu, [
        v("label", {
          class: "form-field-label",
          for: t.$props.for
        }, x(e.label), 9, Su),
        t.$slots.aside ? (c(), h("span", _u, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", Eu, x(e.help), 1)) : A("", !0)
    ]));
  }
}, Cu = /* @__PURE__ */ K(Au, [["__scopeId", "data-v-dd7cdcff"]]), Va = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Ou = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Kn(), n = B(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => et((c(), h("textarea", Ge({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [P(Va), P(t).value]
    ]);
  }
}), Tu = /* @__PURE__ */ K(Ou, [["__scopeId", "data-v-e130a5b9"]]), Ru = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ds(), o = B(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), H(Cu, {
      label: e.field.label,
      for: P(s),
      "data-button-field": e.field.name
    }, {
      default: q(() => [
        N(jt, { value: o.value }, {
          choice: q(() => [
            N(Xn, {
              id: P(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: q(() => [
            N(xu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: q(() => [
            N(Tu, {
              id: P(s),
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
    return (t, n) => (c(), H(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: q(() => [
        N(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Iu(e, t, n, a = () => window) {
  Le(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Bu = (e, t = () => !0) => Iu("keydown", (n) => n.key === "Escape" && t() && e());
function kl(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = R(!1), s = B(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Bu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Lu = 80, Tt = Yn([]);
function xl(e) {
  const t = Symbol("layer"), n = () => Tt.includes(t) && Tt.splice(Tt.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !Tt.includes(t) && Tt.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), B(() => Lu + Math.max(0, Tt.indexOf(t)));
}
let $l = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return $l = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Nu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Du(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Nu)];
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
const ju = ["aria-modal", "aria-label", "aria-labelledby"], Pu = {
  key: 0,
  class: "dialog-head"
}, qu = ["id", "tabindex"], Fu = {
  key: 1,
  class: "dialog-foot"
}, Wu = 500, Hu = 400, Uu = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = kl(a, n), r = xl(s), i = R(null), u = R(null), d = R(null), f = ds(), m = R(!1), g = Date.now();
    n.modal && Du(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, Hu);
    }
    function k(j) {
      !n.modal || Date.now() - g >= Wu || ![" ", "Enter"].includes(j.key) || (j.preventDefault(), j.stopPropagation());
    }
    const b = () => i.value && (i.value.scrollTop = i.value.scrollHeight), _ = new MutationObserver(b);
    return me(i, (j) => {
      _.disconnect(), j && n.follow && (_.observe(j, { childList: !0, subtree: !0, characterData: !0 }), b());
    }), Be(() => _.disconnect()), (j, J) => (c(), H(us, { to: "body" }, [
      N(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: q(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: P(r) }),
            onClick: xe(y, ["self"])
          }, [
            v("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? P(f) : void 0,
              onKeydownCapture: k
            }, [
              e.bare ? A("", !0) : (c(), h("header", Pu, [
                v("h3", {
                  id: P(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, x(e.title), 9, qu),
                e.closable ? (c(), H(bs, {
                  key: 0,
                  onClick: P(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              v("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(j.$slots, "default", {}, void 0, !0)
              ], 2),
              j.$slots.foot ? (c(), h("footer", Fu, [
                ue(j.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, ju)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ml = /* @__PURE__ */ K(Uu, [["__scopeId", "data-v-6d1ecd98"]]), zu = (e, t, n = {}) => ys(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function rn(e, t, n, a = {}) {
  try {
    return await su(e.module, n) ? it(wl, zu(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const Vu = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, fa = [
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
}, Gu = ["secrets", "plugins"], Sl = Object.keys(Qn).filter((e) => !(sl && Gu.includes(e)));
B(() => Sl.map((e) => ({ name: e, ...Qn[e] })));
const Pt = (e) => Qn[e], _l = new Map(Sl.flatMap((e) => [e, e.replace(/s$/, ""), Qn[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => _l.get(String(e).toLowerCase()) || "", El = [..._l.keys()].sort((e, t) => t.length - e.length).join("|"), Ku = {
  class: "button-form",
  "data-button-form": ""
}, Yu = {
  key: 0,
  class: "button-form-title"
}, Ju = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Zu = { class: "button-form-actions" }, Xu = {
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
    return (d, f) => (c(), H(Ml, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: q(() => {
        var m;
        return [
          v("div", Ku, [
            (m = e.row) != null && m.title ? (c(), h("p", Yu, x(e.row.title), 1)) : A("", !0),
            (c(!0), h(V, null, te(e.button.fields, (g) => (c(), H(Ru, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (y) => s.value[g.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", Ju, x(l.value), 1)) : A("", !0),
            v("div", Zu, [
              N(de, {
                small: "",
                onClick: f[0] || (f[0] = (g) => a("close"))
              }, {
                default: q(() => [...f[2] || (f[2] = [
                  Q("Cancel", -1)
                ])]),
                _: 1
              }),
              N(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: q(() => [...f[3] || (f[3] = [
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
}, Qu = /* @__PURE__ */ K(Xu, [["__scopeId", "data-v-f26c27a7"]]), ed = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, td = {
  key: 1,
  class: "menu-item-text"
}, nd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", ed, x(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (c(), h("span", td, [
        v("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, x(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, $t = /* @__PURE__ */ K(nd, [["__scopeId", "data-v-fec99974"]]), ad = ["aria-busy"], sd = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, od = {
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
    }), i = B(() => n.readOnly ? [] : au(n.environment, n.name, n.row)), u = R(null), d = R(""), f = R(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
    async function g(y) {
      if (f.value || n.readOnly) return;
      if (y.fields.length) {
        u.value = y;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const k = await rn(y, n.row, n.environment);
      f.value = !1, d.value = k.ok ? "" : k.error;
      const b = y.label.toLowerCase() + (n.objectName && !y.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", k.ok ? "" : `Could not ${b}: ${k.error}`), k.ok && a("done");
    }
    return (y, k) => (c(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(V, { key: 0 }, [
        k[3] || (k[3] = v("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        N(de, {
          small: "",
          onClick: r
        }, {
          default: q(() => [...k[2] || (k[2] = [
            Q("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? A("", !0) : (c(), h(V, { key: 1 }, [
        (c(!0), h(V, null, te(i.value, (b) => (c(), h(V, {
          key: b.name
        }, [
          b.menu.length ? (c(), H(cc, {
            key: 0,
            small: "",
            variant: b.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": b.menu_label || "More ways",
            title: m(b),
            "data-button": b.name,
            onMain: (_) => g(b)
          }, {
            menu: q(({ close: _ }) => [
              (c(!0), h(V, null, te(b.menu, (j) => (c(), H($t, {
                key: j.label,
                description: j.description,
                onClick: (J) => (_(), g({ ...b, ...j, menu: [] }))
              }, {
                default: q(() => [
                  Q(x(j.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: q(() => [
              Q(x(b.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), H(de, {
            key: 1,
            small: "",
            variant: b.primary ? "primary" : "ghost",
            bordered: !b.primary,
            icon: b.icon,
            disabled: f.value,
            title: m(b),
            "data-button": b.name,
            onClick: (_) => g(b)
          }, {
            default: q(() => [
              Q(x(b.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", sd, x(d.value), 1)) : A("", !0),
        u.value && !e.readOnly ? (c(), H(Qu, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: k[0] || (k[0] = (b) => u.value = null),
          onDone: k[1] || (k[1] = (b) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : A("", !0)
      ], 64))
    ], 10, ad));
  }
}, ld = /* @__PURE__ */ K(od, [["__scopeId", "data-v-a07b49a4"]]), rd = {
  class: "running",
  "data-running-command": ""
}, id = ["title"], cd = {
  key: "idle",
  class: "running-idle"
}, ud = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", rd, [
      N(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: q(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, x(e.text), 9, id)) : (c(), h("span", cd, x(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, $5 = /* @__PURE__ */ K(ud, [["__scopeId", "data-v-d3240219"]]), dd = ["aria-checked", "aria-label", "title"], fd = {
  key: 0,
  class: "switch-inner"
}, hd = {
  key: 0,
  class: "switch-word"
}, md = {
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
        e.labelled ? (c(), h("span", fd, x(e.word), 1)) : A("", !0),
        s[1] || (s[1] = v("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", hd, x(e.word), 1)) : A("", !0)
    ], 10, dd));
  }
}, M5 = /* @__PURE__ */ K(md, [["__scopeId", "data-v-1bfb90f3"]]);
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
function pd(e, t) {
  return Al(() => sessionStorage, e, t);
}
function gd(e, t) {
  return Cl(() => sessionStorage, e, t);
}
const Nn = "journal.environment", Tl = R(pd(Nn, Ln(Nn, "")));
function vd(e) {
  Tl.value = e, gd(Nn, e), ws(Nn, e);
}
const Dn = R(location.hash), Zs = Ve(null), Xs = { integrations: "mcp", library: "team" };
function yd() {
  if (!Zs.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Xs[n]) {
    location.replace(`#/${[Xs[n], ...a].join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash;
    return;
  }
  !n || Zs.value(n) || (vd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Dn.value = location.hash, yd();
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
function bd(e = "", t = 0, n = "") {
  location.hash = ks.page(e, t, n);
}
const wd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Rl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(wd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function S5(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Il(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ga.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  Rl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function kd(e, t, n, a = 0, s = "") {
  if (e === Ga.value.env) return Il(t, n, a, s);
  const o = Ga.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Rl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? kd(a, s, Number(o), 0, t) : Il(s, Number(o), 0, t);
}
function xd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = xd(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function _5(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const $d = { class: "inspector-part" }, Md = { class: "inspector-part-title" }, Sd = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", $d, [
      v("h4", Md, x(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, E5 = /* @__PURE__ */ K(Sd, [["__scopeId", "data-v-0da7fa52"]]), _d = {
  key: 1,
  class: "row-list-failure"
}, Ed = ["data-row"], Ad = {
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
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), H(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", _d, x(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: q(() => [
        Q(x(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(V, { key: 3 }, [
      (c(), H(St(e.arrival ? Zo : "ul"), Ge(n.value, { class: "row-list" }), {
        default: q(() => [
          (c(!0), h(V, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Ed))), 128))
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
}, Cd = /* @__PURE__ */ K(Ad, [["__scopeId", "data-v-6c7ba696"]]), Od = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Td = {
  key: 1,
  class: "agent-rows-note"
}, Rd = {
  key: 2,
  class: "agent-rows-note"
}, Id = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Bd = ["data-agent-row", "onClick"], Ld = { class: "agent-row-name" }, Nd = { class: "agent-row-state" }, Dd = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = B(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", Od, [
      e.loaded ? e.failure ? (c(), h("p", Td, x(e.failure), 1)) : e.rows.length ? (c(), h(V, { key: 3 }, [
        v("p", Id, x(a.value) + " running", 1),
        (c(!0), h(V, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => P(qe)(`agents:${l.id}`)
        }, [
          v("span", Ld, "#" + x(l.id) + " " + x(l.session), 1),
          v("span", Nd, x(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Bd))), 128))
      ], 64)) : (c(), h("p", Rd, x(e.none), 1)) : (c(), H(Et, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, A5 = /* @__PURE__ */ K(Dd, [["__scopeId", "data-v-a01e5a17"]]), jd = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, x(e.text), 3));
  }
}, Bl = /* @__PURE__ */ K(jd, [["__scopeId", "data-v-9e7e1157"]]), Pd = ["aria-valuenow", "aria-valuemax"], qd = {
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
    ], 10, Pd));
  }
}, Fd = /* @__PURE__ */ K(qd, [["__scopeId", "data-v-9eba6a85"]]), Wd = { class: "bars" }, Hd = { class: "bar-name" }, Ud = { class: "bar-value" }, zd = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = B(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", Wd, [
      (c(!0), h(V, null, te(e.items, (i, u) => (c(), H(St(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: q(() => [
          v("span", Hd, x(i.label), 1),
          N(Fd, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          v("span", Ud, x(i.value) + x(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Vd = /* @__PURE__ */ K(zd, [["__scopeId", "data-v-663427f4"]]), Gd = { class: "bars" }, Kd = {
  key: 0,
  class: "bars-title"
}, Yd = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Gd, [
      e.node.title ? (c(), h("span", Kd, x(e.node.title), 1)) : A("", !0),
      N(Vd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Jd = /* @__PURE__ */ K(Yd, [["__scopeId", "data-v-7135bb11"]]), Zd = {
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
      (c(!0), h(V, null, te(e.node.children || [], (i, u) => (c(), H(Yl, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Cn = /* @__PURE__ */ K(Zd, [["__scopeId", "data-v-d142a3f4"]]), Xd = {
  key: 0,
  class: "card-head"
}, Qd = { class: "card-title" }, ef = {
  key: 0,
  class: "card-note"
}, tf = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", Xd, [
        v("span", Qd, x(e.node.title), 1),
        e.node.note ? (c(), h("span", ef, x(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      N(Cn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, nf = /* @__PURE__ */ K(tf, [["__scopeId", "data-v-67b72d40"]]), af = { processes: "process", memories: "memory", replies: "reply" }, Gt = (e) => (af[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ka = [], sf = 2e3, lt = /* @__PURE__ */ new Map(), of = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, lf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? Ka.unshift(e) : Ka.push(e), lt.clear();
}
function Ll(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const rf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, cf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Qe(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function uf(e, t) {
  const n = [{ type: "text", text: Qe(e).replace(/\r\n/g, `
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
  return df(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function df(e) {
  return e.split(lf).map((t, n) => n % 2 ? t : t.replace(of, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Qs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const ff = 24;
function hf(e) {
  const [t, , ...n] = e, a = Qs(t), s = n.map(Qs), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > ff) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${en(u)}</td>`).join("")}</tr>`).join("");
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
function mf(e, t) {
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
      n.push(hf(t.slice(a, r))), a = r;
      continue;
    }
    if (Nl.test(s)) {
      const r = mf(t, a);
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
const pf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, gf = (e) => e.type !== "text" && !pf.test(e.html);
function vf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(jl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : gf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function yf(e, t = { env: "" }) {
  const n = cf(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => rf(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = vf(uf(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > sf && lt.delete(lt.keys().next().value), o;
}
const ha = /* @__PURE__ */ new WeakMap();
function bf(e) {
  if (ha.has(e)) return ha.get(e);
  const t = ai(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Gt(u)} show ${d}`);
    n.set(f, m), m.then((g) => {
      n.get(f) === m && (n.delete(f), t.set(f, g.ok ? { ...g.value, table: u } : null));
    });
  }
  function l(u) {
    a.has(u) || (a.add(u), e.follow([`${Gt(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const g = Number(m.slice(f.length));
        (!d.row_id || d.row_id === g) && o(u, g);
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
  const e = Ae(Te, null), t = e ? bf(e) : null;
  return (n, a = {}) => yf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const ql = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, cn = (e) => String(e || "").replace(ql, (t, n, a, s) => s), wf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), wn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, kf = /^Traceback \(most recent call last\):/m, xf = 8;
function Fl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, xf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function $f(e) {
  const t = [...e.matchAll(wf)].map((a) => a.index);
  if (wn.lastIndex = 0, !t.length || !wn.test(e)) return null;
  wn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(wn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Fl(n), tail: "" } : null;
}
function Mf(e) {
  const t = kf.exec(e);
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
  const t = cn(e), n = Mf(t) || $f(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Sf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, _f = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Ef = /[\w\]]\(/, Af = /^[\w$.[\]'"]+\s*=\s*[^=]/, Cf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Of = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Tf = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Rf = /[[({,]$/, If = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Bf = /^(\t|\s{2,})\S/, Lf = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Nf = /`[^`]+`/, Df = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, jf = /[{}()[\];=<>$&|*\\@+^~%]/g, Wl = /^\s*(?:[-*+]|\d+[.)])\s/, Pf = /^\s*>/, qf = /^\s*\|/, Ff = 0.6, Wf = 0.4, Hf = 5, Uf = 0.03, Hl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Hf && t.every((n) => Df.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(jf) ?? []).length / e.length < Uf;
}, ma = (e) => {
  const t = e.trim();
  return Nf.test(t) ? !1 : [Sf, _f, Ef, Af, Cf, Of, Tf, Rf, If].some((n) => n.test(t)) || /[;{}]$/.test(t) || Bf.test(e) && !Wl.test(e) && !Hl(e);
};
function zf(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Wl.test(t[0]) || t.every((o) => Pf.test(o) || qf.test(o))) return "text";
  const n = t.filter((o) => !Lf.test(o.trim()));
  if (t.length === 1) return !n.length || ma(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ma).length, s = n.filter((o) => !ma(o) && Hl(o)).length;
  return a >= n.length * Ff && s <= n.length * Wf ? "code" : "text";
}
const Ja = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Vf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Gf = `${Ja} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Kf = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Yf = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", no = {
  js: { keywords: Ja, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Vf, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Gf, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ja, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Kf, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Yf, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Jf = {
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
function Zf(e, t) {
  const n = no[Jf[t] ?? t] || no.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
function Xf(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Zf(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? Qe(l) : `<span class="tok-${a}">${Qe(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Qf(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const eh = 1500, so = /* @__PURE__ */ new WeakMap();
async function th(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Qf(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(so.get(t)), so.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, eh)
  )));
}
typeof document < "u" && document.addEventListener("click", th, !0);
const nh = /\n\s*\n/, ah = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, sh = /^\s*(`{3,}|~{3,})\s*$/, oh = /^\s{4,}\S/, lh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Za = /^\s*(?:[-*+]|\d+[.)])\s/, Ul = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, rh = [
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
function ih(e) {
  const t = xs(e.join(`
`));
  return (rh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const ch = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Ul.test(t) && !Za.test(t);
}, uh = (e, t) => Za.test(t) || Za.test([...e].reverse().find((n) => n.trim()) || "");
function $s(e, t) {
  const n = t || ih(e), a = Xf(xs(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function dh(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && sh.test(s));
  return a < 0 ? e.length : a;
}
function fh(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return $s(a.map(cn), n ? n.toLowerCase() : "");
}
function hh(e) {
  const t = e.split(nh).map((l) => ({ paragraph: l, type: zf(xs(l).split(`
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
function mh(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : hh(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(ah);
    if (r) {
      const u = dh(n, l, r[2]);
      o(), a.push(fh(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = ch(s) ? lh : oh;
    if (!t && i.test(n[l]) && !uh(s, n[l])) {
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
At((e, t) => mh(e, t.document));
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
}, ph = (e) => (ro[e.table] ? ro[e.table](e) : e.title || "") || "", Mt = (e) => jn(e.created_at), Vl = (e) => jn(e.updated_at) || Mt(e), gh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, vh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function yh(e) {
  const t = gh.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = vh.exec(e), a = n && ut(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function bh(e, t, n, a) {
  const s = Ll(a, e, t), o = cn(s ? ph(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${Qe(Pt(e).title)} ${t}</span><span class="row-card-title">${Qe(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = yh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: bh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const wh = /\.(png|jpe?g|gif|webp|svg)$/i, kh = (e) => wh.test(e), xh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, $h = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Mh(e, t) {
  const n = xh.exec(e), [, a, s, o, l, r] = n || [], i = n && ut(a || o), u = i && Ll(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${Pt(i).title} ${u.id} · ${Qe(r)}`, m = kh(r) ? `<img class="file-card-image" src="${d}" alt="${Qe(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Qe(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Sh(e) {
  const t = $h.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Qe(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = Mh(e, t) || Sh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const _h = /`([^`\n]+)`/g;
At((e) => e.replace(_h, (t, n) => `<code>${n}</code>`));
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
const Eh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Gl = new RegExp(`\\b(${El}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Kl = new RegExp(`\\b(${El}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Ah = new RegExp(`<code>((?:${Gl.source}|${Kl.source}))</code>`, "gi"), Ch = (e) => e.replace(Ah, "$1"), Oh = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Th = (e) => e.replace(Kl, (t, n, a) => a.replace(/\d+/g, (s) => Oh(n.replace(/s$/i, ""), s))), Rh = (e) => Th(e).replace(
  Gl,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ut(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : Ch(e).split(Eh).map((n, a) => a % 2 ? n : Rh(n)).join("")
);
const Ih = ["innerHTML"], Bh = ["innerHTML"], Lh = {
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
      onClick: o[0] || (o[0] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, Ih)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, Bh));
  }
}, wt = /* @__PURE__ */ K(Lh, [["__scopeId", "data-v-d8e75741"]]), Nh = { class: "fact" }, Dh = { class: "fact-label" }, jh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Nh, [
      v("span", Dh, x(e.label), 1),
      N(wt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Ph = /* @__PURE__ */ K(jh, [["__scopeId", "data-v-3a88ecf8"]]), qh = { class: "list" }, Fh = { class: "list-label" }, Wh = {
  key: 1,
  class: "list-note"
}, Hh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", qh, [
      (c(!0), h(V, null, te(e.items, (o, l) => (c(), H(St(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: q(() => [
          v("span", Fh, x(o.label), 1),
          o.badge ? (c(), H(Bl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (c(), h("span", Wh, x(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Uh = /* @__PURE__ */ K(Hh, [["__scopeId", "data-v-ebe2ae0a"]]), zh = { class: "table" }, Vh = {
  key: 0,
  class: "table-row empty"
}, Gh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", zh, [
      v("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (c(!0), h(V, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, x(r), 1))), 128))
      ], 4),
      (c(!0), h(V, null, te(e.rows, (r, i) => (c(), H(St(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: q(() => [
          (c(!0), h(V, null, te(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, x(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", Vh, x(e.empty), 1)) : A("", !0)
    ]));
  }
}, Kh = /* @__PURE__ */ K(Gh, [["__scopeId", "data-v-9326a52e"]]), Yh = { class: "stat-value" }, Jh = { class: "stat-label" }, Zh = {
  key: 0,
  class: "stat-note"
}, Xh = {
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
    return (a, s) => (c(), H(St(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: q(() => [
        v("span", Yh, x(e.value), 1),
        v("span", Jh, x(e.label), 1),
        e.note ? (c(), h("span", Zh, x(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Qh = /* @__PURE__ */ K(Xh, [["__scopeId", "data-v-ad0db6d6"]]), em = { class: "code" }, tm = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), H(jt, {
      value: e.node.type
    }, {
      stack: q(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: q(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: q(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: q(() => [
        N(nf, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: q(() => [
        v("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, x(e.node.text), 3)
      ]),
      divider: q(() => [...l[2] || (l[2] = [
        v("hr", { class: "divider" }, null, -1)
      ])]),
      stat: q(() => [
        N(Qh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: q(() => [
        N(Jd, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: q(() => [
        N(Kh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: q(() => [
        N(Uh, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: q(() => [
        N(wt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: q(() => [
        N(Ph, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: q(() => [
        N(Bl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: q(() => [
        v("pre", em, [
          v("code", null, x(e.node.text), 1)
        ])
      ]),
      file: q(() => [
        v("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, x(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Yl = /* @__PURE__ */ K(tm, [["__scopeId", "data-v-cbdcf540"]]), nm = { class: "dashboard" }, am = { class: "trail" }, sm = ["onClick"], om = {
  key: 0,
  class: "gone",
  role: "status"
}, lm = {
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
    ), (m, g) => (c(), h("div", nm, [
      e.document.broken ? (c(), H(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: q(() => [
          Q(x(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), H(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: q(() => [
          Q(x(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(V, { key: 2 }, [
        v("nav", am, [
          v("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (y) => f(0))
          }, x(u(e.document.start)), 3),
          (c(!0), h(V, null, te(l.value, (y, k) => (c(), h(V, {
            key: `${k}-${y}`
          }, [
            g[2] || (g[2] = v("span", { class: "sep" }, "/", -1)),
            v("button", {
              type: "button",
              class: Z(["step", { current: k === l.value.length - 1 }]),
              onClick: (b) => f(k + 1)
            }, x(u(y)), 11, sm)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", om, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        N(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: q(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              N(Yl, {
                node: i.value.view,
                onOpen: d,
                onFile: g[1] || (g[1] = (y) => a("file", y))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, rm = /* @__PURE__ */ K(lm, [["__scopeId", "data-v-fbe83734"]]), ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Pe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, im = 6;
function Ms(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const cm = (e) => {
  const t = Ms(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function um(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function dm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function fm(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), u = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, g) => m + g, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => u(d) - u(f));
  };
  for (let l = 0; l < im; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function hm(e, t) {
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
function mm(e) {
  const t = [...new Set(e.flatMap(([D, w]) => [D, w]))], n = new Set(e.map(([, D]) => D)), a = t.filter((D) => !n.has(D)), s = um(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((D, w) => !s.has(w)), l = dm(t, o), r = fm(t, o, l), i = new Map(t.map((D) => [D, cm(D)])), u = r.map((D) => D.reduce((w, $) => w + i.get($).width, 0) + je.across * (D.length - 1)), d = Math.max(...u) + je.margin * 2, f = gm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let g = je.margin;
  r.forEach((D, w) => {
    let $ = (d - u[w]) / 2;
    const S = Math.max(...D.map((C) => i.get(C).height));
    D.forEach((C) => {
      const E = i.get(C);
      m.set(C, { ...E, x: $, y: g + (S - E.height) / 2 }), $ += E.width + je.across;
    }), g += S + (f[w] ?? je.down);
  });
  const y = e.map(([D, w, $], S) => ({ from: D, to: w, label: $ || "", back: s.has(S) || l.get(w) <= l.get(D) }));
  hm(y, m);
  const k = y.map((D) => vm(D, m.get(D.from), m.get(D.to))), b = [...m.values()], _ = km(k, b), j = Math.max(g - je.down, ..._.filter((D) => D.label).map((D) => D.label.y + D.label.height));
  return { width: Math.max(d - je.margin, ..._.filter((D) => D.label).map((D) => D.label.x + D.label.width)) + je.margin, height: j + je.margin, nodes: b, arrows: _ };
}
const pm = (e) => e ? Ms(e, Pe.lineChars).length * Pe.line + Pe.pad * 2 : 0;
function gm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += pm(l) + je.labelSpace);
  }), a.map((s) => Math.max(je.down, s));
}
function vm(e, t, n) {
  const a = e.label ? Ms(e.label, Pe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Pe.charWidth + Pe.pad * 2 : 0, o = a.length * Pe.line + (a.length ? Pe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const ym = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, bm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], wm = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Pe.line);
function km(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = ym(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = wm.flatMap((i) => bm.map((u) => s(u, i))).find((i) => !n.some((u) => co(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => co(r, i)); ) r.y += Pe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Pe.line, pad: Pe.pad } };
  });
}
const co = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, xm = { class: "flowchart-tools" }, $m = ["width", "height", "viewBox", "aria-label"], Mm = ["d"], Sm = ["x", "y", "width", "height"], _m = ["x", "y"], Em = ["x", "dy"], Am = {
  key: 0,
  class: "flowchart-label"
}, Cm = ["x", "y", "width", "height"], Om = ["x", "y"], Tm = ["x", "dy"], Rm = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => mm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = R(null), r = R({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var _;
      const k = (_ = l.value) == null ? void 0 : _.getBoundingClientRect();
      if (!(k != null && k.width)) return;
      const b = Math.min(k.width / s.value.width, k.height / s.value.height, 1.5);
      r.value = { zoom: b, x: (k.width - s.value.width * b) / 2, y: (k.height - s.value.height * b) / 2 };
    }
    function d(k, b, _) {
      const { zoom: j, x: J, y: D } = r.value, w = Math.min(o.most, Math.max(o.least, j * k));
      r.value = { zoom: w, x: b - (b - J) * w / j, y: _ - (_ - D) * w / j };
    }
    function f(k) {
      const b = l.value.getBoundingClientRect();
      d(k, b.width / 2, b.height / 2);
    }
    function m(k) {
      const b = l.value.getBoundingClientRect();
      k.ctrlKey || k.metaKey ? d(k.deltaY < 0 ? o.step : 1 / o.step, k.clientX - b.left, k.clientY - b.top) : r.value = { ...r.value, x: r.value.x - k.deltaX, y: r.value.y - k.deltaY };
    }
    function g(k) {
      var b, _, j;
      k.preventDefault(), (b = window.getSelection()) == null || b.removeAllRanges(), i = { x: k.clientX - r.value.x, y: k.clientY - r.value.y }, (j = (_ = l.value).setPointerCapture) == null || j.call(_, k.pointerId);
    }
    function y(k) {
      i && (r.value = { ...r.value, x: k.clientX - i.x, y: k.clientY - i.y });
    }
    return Le(u), (k, b) => (c(), H(Ml, {
      title: e.title,
      large: "",
      onClose: b[4] || (b[4] = (_) => a("close"))
    }, {
      default: q(() => [
        v("div", xm, [
          N(de, {
            small: "",
            onClick: b[0] || (b[0] = (_) => f(o.step))
          }, {
            default: q(() => [...b[5] || (b[5] = [
              Q("Zoom in", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: b[1] || (b[1] = (_) => f(1 / o.step))
          }, {
            default: q(() => [...b[6] || (b[6] = [
              Q("Zoom out", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: u
          }, {
            default: q(() => [...b[7] || (b[7] = [
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
          onPointerdown: g,
          onPointermove: y,
          onPointerup: b[2] || (b[2] = (_) => qs(i) ? i.value = null : i = null),
          onPointercancel: b[3] || (b[3] = (_) => qs(i) ? i.value = null : i = null)
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
            b[8] || (b[8] = v("defs", null, [
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
            (c(!0), h(V, null, te(s.value.arrows, (_, j) => (c(), h("path", {
              key: `arrow-${j}`,
              class: "flowchart-arrow",
              d: _.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Mm))), 128)),
            (c(!0), h(V, null, te(s.value.nodes, (_) => (c(), h("g", {
              key: _.name,
              class: "flowchart-node"
            }, [
              v("rect", {
                x: _.x,
                y: _.y,
                width: _.width,
                height: _.height,
                rx: "8"
              }, null, 8, Sm),
              v("text", {
                x: _.x + _.width / 2,
                y: _.y + _.padY + _.line / 2
              }, [
                (c(!0), h(V, null, te(_.lines, (j, J) => (c(), h("tspan", {
                  key: J,
                  x: _.x + _.width / 2,
                  dy: J ? _.line : 0
                }, x(j), 9, Em))), 128))
              ], 8, _m)
            ]))), 128)),
            (c(!0), h(V, null, te(s.value.arrows, (_, j) => (c(), h(V, {
              key: `label-${j}`
            }, [
              _.label ? (c(), h("g", Am, [
                v("rect", {
                  x: _.label.x,
                  y: _.label.y,
                  width: _.label.width,
                  height: _.label.height,
                  rx: "4"
                }, null, 8, Cm),
                v("text", {
                  x: _.label.x + _.label.width / 2,
                  y: _.label.y + _.label.pad + _.label.line / 2
                }, [
                  (c(!0), h(V, null, te(_.label.lines, (J, D) => (c(), h("tspan", {
                    key: D,
                    x: _.label.x + _.label.width / 2,
                    dy: D ? _.label.line : 0
                  }, x(J), 9, Tm))), 128))
                ], 8, Om)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, $m))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Im = /* @__PURE__ */ K(Rm, [["__scopeId", "data-v-51d24cfe"]]), uo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', fo = {
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
}, Bm = ["innerHTML"], Lm = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => fo[t.name] || fo.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Bm));
  }
}, ft = /* @__PURE__ */ K(Lm, [["__scopeId", "data-v-beb5935c"]]), Nm = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      N(ft, { name: "fold" })
    ], 2));
  }
}, xt = /* @__PURE__ */ K(Nm, [["__scopeId", "data-v-d03899bb"]]), Dm = ["data-tip", "aria-label"], jm = {
  key: 0,
  class: "mact-word"
}, Pm = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      N(ft, { name: "open" }),
      e.open ? (c(), h("span", jm, x(e.label), 1)) : A("", !0),
      n[0] || (n[0] = v("span", { class: "hit" }, null, -1))
    ], 10, Dm));
  }
}, Jl = /* @__PURE__ */ K(Pm, [["__scopeId", "data-v-3b292e09"]]), Zl = 120, On = 280, Xl = 160, qm = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Fm = ["leaving", "resizing", "entering"];
function Xa(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Wm(e) {
  const t = Fm.filter((a) => e.classList.contains(a));
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
    const g = Wm(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${On}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${On}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, g);
  }
  function u(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let g = m.offsetHeight;
    const y = new ResizeObserver(() => {
      m.offsetHeight !== g && (g = m.offsetHeight, i(f, Xa(f)));
    });
    return y.observe(m), y;
  }
  async function d(f) {
    const m = e.value, g = ++o;
    if (!m || !m.offsetWidth || qm()) {
      a.value = f;
      return;
    }
    const y = Xa(m);
    if (l(m, y), s.value = "leaving", await n(Zl), g !== o) return;
    a.value = f, s.value = "resizing", await ht(), i(m, y);
    const k = u(m);
    await n(On), k == null || k.disconnect(), g === o && (r(m), s.value = "entering", await n(Xl), g === o && (s.value = ""));
  }
  return me(t, (f) => d(f)), _t(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Hm = { class: "growing-card-top" }, Um = ["aria-expanded"], zm = { class: "growing-card-avatar" }, Vm = { class: "growing-card-title" }, Gm = { class: "growing-card-more" }, Km = { class: "growing-card-body" }, Ym = {
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
      class: Z(["growing-card-wrap", P(r), { open: !P(l), bad: e.bad, incoming: e.incoming }])
    }, [
      v("div", Hm, [
        v("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          v("span", zm, [
            e.bad ? (c(), H(ft, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(V, { key: 1 }, [
              Q(x(i.value), 1)
            ], 64)) : (c(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          v("span", Vm, x(e.title), 1),
          N(xt, { open: s.value }, null, 8, ["open"])
        ], 8, Um),
        e.action ? (c(), H(Jl, {
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
          N(ye, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      v("div", Gm, [
        v("div", Km, [
          (c(!0), h(V, null, te(u.value, (m, g) => (c(), h("p", {
            key: g,
            class: "growing-card-text"
          }, x(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Jm = /* @__PURE__ */ K(Ym, [["__scopeId", "data-v-f2b4930d"]]), Zm = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Xm = { class: "md inline" }, Qm = ["disabled", "title", "onClick"], e1 = {
  key: 1,
  class: "message-links-many"
}, t1 = ["aria-expanded"], n1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, a1 = ["disabled", "onClick"], s1 = { class: "row-pill message-links-chip" }, o1 = { class: "message-links-title" }, l1 = { key: 0 }, ga = 3, r1 = "task", i1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => n.total || n.links.length), o = B(() => n.links.every((m) => m.endpoint.model === r1) ? "tasks" : "items"), l = R(!1), r = R(null);
    al(r, () => l.value = !1);
    const i = () => l.value = !l.value, u = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      u(m) || (l.value = !1, qe(m.endpoint.open_ref));
    }
    return (m, g) => (c(), h("div", {
      ref_key: "line",
      ref: r,
      class: Z(["message-links", { many: s.value > ga, three: s.value === ga, open: l.value }]),
      "data-message-links": ""
    }, [
      N(ft, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (c(), h("span", Zm, [
        v("span", Xm, [
          g[1] || (g[1] = Q("Linked: ", -1)),
          (c(!0), h(V, null, te(e.links, (y) => (c(), h("button", {
            key: `${y.endpoint.model}:${y.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: u(y),
            title: y.endpoint.title,
            onClick: (k) => f(y)
          }, [
            Q(x(y.endpoint.model.replaceAll("_", " ")) + " " + x(y.endpoint.id), 1),
            d(y) ? (c(), h(V, { key: 0 }, [
              Q(" (" + x(d(y)) + ")", 1)
            ], 64)) : A("", !0),
            u(y) ? (c(), h(V, { key: 1 }, [
              Q(" (unavailable)")
            ], 64)) : A("", !0)
          ], 8, Qm))), 128))
        ])
      ])) : A("", !0),
      s.value >= ga ? (c(), h("span", e1, [
        v("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          Q(x(s.value) + " linked " + x(o.value) + " ", 1),
          N(xt, { open: l.value }, null, 8, ["open"])
        ], 8, t1)
      ])) : A("", !0),
      l.value ? (c(), h("div", n1, [
        (c(!0), h(V, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.endpoint.model}:${y.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: u(y),
          onClick: (k) => f(y)
        }, [
          v("span", s1, x(y.endpoint.model.replaceAll("_", " ")) + " " + x(y.endpoint.id), 1),
          v("span", o1, x(y.endpoint.title), 1),
          v("span", null, x(d(y)), 1),
          u(y) ? (c(), h("span", l1, "Unavailable")) : A("", !0)
        ], 8, a1))), 128))
      ])) : A("", !0),
      N(Jn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (y) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, c1 = /* @__PURE__ */ K(i1, [["__scopeId", "data-v-e9bc783c"]]), u1 = ["title", "aria-label"], d1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, f1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, h1 = {
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
      (c(), h("svg", d1, [
        o[0] || (o[0] = v("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", f1)) : A("", !0)
      ]))
    ], 10, u1));
  }
}, m1 = /* @__PURE__ */ K(h1, [["__scopeId", "data-v-6dc92808"]]);
function p1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function er(e, t = Date.now()) {
  const n = p1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const g1 = 36e5;
function C5(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / g1;
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
function v1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${va(t % 60)}s` : `${Math.floor(t / 3600)}h ${va(Math.floor(t % 3600 / 60))}m ${va(t % 60)}s`;
}
const y1 = "img,pre,table";
function b1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function w1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function k1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(y1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = b1(w1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function x1(e, t) {
  let n = null;
  const a = () => e.value && k1(e.value);
  Le(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
}
const $1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function M1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const kn = /* @__PURE__ */ new WeakMap(), ze = "work", Ht = "sent", S1 = 50, mo = () => ({ rows: R([]), total: R(0), next: R(null), loading: R(!1), failure: R(""), version: 0 });
function _1(e) {
  var f;
  if (kn.has(e)) return kn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...m.views].some((y) => y.visible);
  };
  async function o(m, g, y = 1) {
    const k = m[g], b = ++k.version;
    k.loading.value = !0, k.failure.value = "";
    const _ = g === ze ? "--type about --type edited --group-counterparts" : "--type sent_to", j = `link list --source message:${m.id} ${_} --page ${y} --page-size ${g === ze ? 10 : 25}`;
    try {
      const J = await e.read(j);
      if (t.get(m.id) !== m || k.version !== b) return;
      if (!J.ok) {
        k.failure.value = J.error;
        return;
      }
      const D = g === ze ? J.value.counterparts ?? [] : J.value.rows ?? [], w = y === 1 ? D : [...k.rows.value, ...D], $ = g === ze ? (S) => `${S.endpoint.model}:${S.endpoint.id}` : (S) => S.id ?? S.target_id;
      k.rows.value = [...new Map(w.map((S) => [$(S), S])).values()], k.total.value = J.value.total ?? k.rows.value.length, k.next.value = J.value.next_page ?? null;
    } catch (J) {
      k.version === b && (k.failure.value = J.message);
    } finally {
      k.version === b && (k.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of m) {
      const y = [...g.dirty];
      g.dirty.clear();
      for (const k of y) o(g, k);
    }
  }
  function r(m, g = [ze, Ht]) {
    for (const y of g) m.dirty.add(y);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const g = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), y = m.link_types ?? (m.link_type ? [m.link_type] : []), k = y.length ? [ze, Ht].filter((_) => _ === ze ? y.some((j) => ["about", "edited"].includes(j)) : y.includes("sent_to")) : [ze, Ht];
    if (!k.length) return;
    const b = g.length ? [...new Set(g.filter((_) => _.model === "message").map((_) => _.id))].map((_) => t.get(_)).filter(Boolean) : [...t.values()].filter(s).slice(0, S1);
    for (const _ of b) r(_, k);
  }
  const u = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, g) {
      let y = t.get(m);
      return y || (y = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([ze, Ht]), work: mo(), sent: mo() }, t.set(m, y)), y.views.add(g), y.dirty.size && r(y, [...y.dirty]), y;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, g) {
      m.views.delete(g), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), u == null || u(), kn.delete(e));
    },
    more(m, g) {
      const y = m == null ? void 0 : m[g];
      if (y != null && y.next.value && !y.loading.value) return o(m, g, y.next.value);
    }
  };
  return kn.set(e, d), d;
}
function E1(e, t, n) {
  const a = Ve(null);
  let s = null;
  const o = me(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = _1(e);
    const u = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, u);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      u.visible = g.some((y) => y.isIntersecting), u.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = me(n, (g) => {
      f == null || f.disconnect(), g && (f == null || f.observe(g));
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
const A1 = ["data-incoming", "data-ref"], C1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], O1 = { class: "message-body" }, T1 = ["title"], R1 = ["innerHTML"], I1 = ["title"], B1 = ["innerHTML"], L1 = {
  class: "message-faces",
  "data-message-faces": ""
}, N1 = ["title", "data-face", "onClick"], D1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, j1 = ["title", "data-reaction", "onClick"], P1 = {
  key: 0,
  class: "message-reaction-count"
}, q1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, F1 = ["href", "title"], W1 = ["src", "alt"], H1 = ["href"], U1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, z1 = ["disabled", "data-sent-worker", "title", "onClick"], V1 = { class: "message-foot" }, G1 = { class: "message-time" }, K1 = {
  class: "message-id",
  "data-message-id": ""
}, Y1 = 140, J1 = 2, Z1 = 1500, X1 = "An earlier message", Q1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(!1), o = R(null), l = B(() => ["user", "comment"].includes(n.message.type)), r = B(() => {
      const [ve, he] = (n.message.commented_row || ":").split(":"), ae = ut(ve);
      return ae ? { ref: `${ae}:${he}`, label: `${Pt(ae).title.toLowerCase()} ${he}` } : null;
    }), i = B(() => n.message.worker_id ?? null), u = R(!1), d = B(() => i.value !== null && ((n.message.text ?? "").length > Y1 || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > J1)), f = B(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Z1);
    }
    const g = Pl(), y = B(() => g(n.message.text ?? "")), k = B(() => JSON.parse(n.message.flowchart_edges || "[]")), b = R(!1), _ = B(() => g(n.quote || X1));
    function j() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    x1(o, () => `${n.message.text} ${n.quote}`);
    const J = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, D = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, w = B(() => JSON.parse(n.message.captions || "{}")), $ = B(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: D(ve), isImage: J.test(ve), title: w.value[ve] || ve }))), S = B(() => tr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), C = Ae(Te, null), { links: E, total: I, more: M, loading: p, failure: O, sentTo: T, sentMore: L, sentLoading: Y, sentFailure: ee, loadMore: re, loadSent: ie } = E1(C, () => l.value && !n.message.local ? n.message.id : null, o), fe = R(!1), Ce = B(() => M1(n.message.reactions));
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
      N(Jm, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: he[0] || (he[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, A1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      v("div", O1, [
        v("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: he[6] || (he[6] = (...ae) => P(It) && P(It)(...ae))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: he[1] || (he[1] = xe((ae) => P(qe)(r.value.ref), ["stop"]))
          }, [
            N(ye, {
              name: "bubble",
              size: 12
            }),
            v("span", null, "Comment on " + x(r.value.label), 1)
          ], 8, T1)) : A("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(j, ["stop"]),
            innerHTML: _.value
          }, null, 8, R1)) : A("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: he[2] || (he[2] = xe((ae) => P(qe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + x(i.value), 9, I1)) : A("", !0),
          v("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, B1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: he[3] || (he[3] = xe((ae) => u.value = !u.value, ["stop"]))
          }, x(u.value ? "Show less" : "Show more"), 1)) : A("", !0),
          k.value.length ? (c(), h(V, { key: 4 }, [
            v("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: he[4] || (he[4] = (ae) => b.value = !0)
            }, "Open the flowchart"),
            b.value ? (c(), H(Im, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: he[5] || (he[5] = (ae) => b.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        v("div", {
          class: Z(["message-tools", { picking: fe.value }]),
          "data-message-tools": ""
        }, [
          fe.value ? (c(), h(V, { key: 0 }, [
            v("div", L1, [
              (c(!0), h(V, null, te(P($1), (ae) => (c(), h("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Ke) => Fe(ae)
              }, x(ae), 9, N1))), 128))
            ]),
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: he[7] || (he[7] = (ae) => fe.value = !1)
            }, [
              N(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(V, { key: 1 }, [
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
            }, x(s.value ? "Copied" : "Copy"), 1),
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
      Ce.value.length ? (c(), h("div", D1, [
        (c(!0), h(V, null, te(Ce.value, (ae) => (c(), h("button", {
          key: ae.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Ke) => a("react", e.message, ae.emoji)
        }, [
          Q(x(ae.emoji) + " ", 1),
          ae.count > 1 ? (c(), h("span", P1, x(ae.count), 1)) : A("", !0)
        ], 10, j1))), 128))
      ])) : A("", !0),
      $.value.length ? (c(), h("div", q1, [
        (c(!0), h(V, null, te($.value, (ae) => (c(), h(V, {
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
            }, null, 8, W1)
          ], 8, F1)) : (c(), h("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, x(ae.name), 9, H1))
        ], 64))), 128))
      ])) : A("", !0),
      P(T).length ? (c(), h("div", U1, [
        N(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(V, null, te(P(T), (ae) => (c(), h("button", {
          key: ae.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          title: `Open worker ${ae.id}`,
          onClick: xe((Ke) => ae.open_ref && P(qe)(ae.open_ref), ["stop"])
        }, [
          Q("Also sent to worker " + x(ae.id), 1),
          ae.unavailable ? (c(), h(V, { key: 0 }, [
            Q(" (unavailable)")
          ], 64)) : A("", !0)
        ], 8, z1))), 128))
      ])) : A("", !0),
      N(Jn, {
        more: P(L),
        loading: P(Y),
        failure: P(ee),
        label: "More recipients",
        onMore: P(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      v("div", V1, [
        v("time", G1, x(S.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(V, { key: 0 }, [
          he[11] || (he[11] = v("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          v("span", K1, "message " + x(e.message.id), 1)
        ], 64)) : A("", !0),
        l.value ? (c(), H(m1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      P(E).length || P(O) ? (c(), H(c1, {
        key: 3,
        links: P(E),
        total: P(I),
        more: P(M),
        loading: P(p),
        failure: P(O),
        onMore: P(re)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : A("", !0)
    ], 8, C1));
  }
}, O5 = /* @__PURE__ */ K(Q1, [["__scopeId", "data-v-0be1107c"]]), ep = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = si("SkeletonParts", !0);
      return c(!0), h(V, null, te(e.parts, (i, u) => (c(), h(V, { key: u }, [
        (c(!0), h(V, null, te(i.count, (d) => (c(), H(jt, {
          key: d,
          value: i.shape
        }, {
          line: q(() => [
            N(Vt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: q(() => [
            N(Vt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: q(() => [
            N(Vt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: q(() => [...l[0] || (l[0] = [
            v("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: q(() => [
            v("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: q(() => [
            v("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: q(() => [
            v("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: q(() => [
            v("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), tp = /* @__PURE__ */ K(ep, [["__scopeId", "data-v-fa8baeaf"]]), np = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, ap = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", np, [
      N(tp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Ss = /* @__PURE__ */ K(ap, [["__scopeId", "data-v-52f66b64"]]), Pn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ya = 200, nr = (e) => {
  var t;
  return ((t = Pn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Pn[0].key;
}, T5 = (e) => {
  var t;
  return ((t = Pn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, sp = ["aria-label"], op = 300, po = 400, lp = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ya } },
  setup(e) {
    const t = e, n = B(() => nr(t.value)), a = B(() => n.value < ya ? [1, 0.25, 0.25] : n.value === ya ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= po, high: n.value >= op && n.value < po }]),
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
    ], 10, sp));
  }
}, R5 = /* @__PURE__ */ K(lp, [["__scopeId", "data-v-b10e610f"]]), go = (e) => [...new Set(e.agents.map((t) => t.name))], I5 = (e) => go(e).length === 1 ? `Worker: ${go(e)[0]}` : "Delegated", rp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, vo = (e) => rp[e.card.state] || "idle", ip = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), yo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, bo = (e, t) => yo[vo(e)] - yo[vo(t)], wo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, B5 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => bo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || ip(a, s)) : [...e].sort((a, s) => bo(a, s) || (wo[t] || wo.state)(a, s)), cp = { class: "list-row" }, up = {
  key: 0,
  class: "list-row-type"
}, dp = { class: "list-row-main" }, fp = {
  key: 0,
  class: "list-row-title"
}, hp = { class: "list-row-body" }, mp = {
  key: 1,
  class: "list-row-end"
}, pp = {
  key: 1,
  class: "list-row-text"
}, gp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", cp, [
      e.type ? (c(), h("span", up, x(e.type), 1)) : A("", !0),
      v("div", dp, [
        e.title ? (c(), h("span", fp, x(e.title), 1)) : A("", !0),
        v("div", hp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", mp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (c(), h("span", pp, x(e.text), 1)) : A("", !0)
    ]));
  }
}, L5 = /* @__PURE__ */ K(gp, [["__scopeId", "data-v-dfc8c3a7"]]), vp = {
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
}, yp = { claude: "Claude Code", codex: "Codex" }, bp = ["aria-expanded"], wp = { class: "drop-label" }, kp = ["value"], xp = {
  key: 1,
  class: "drop-lead"
}, $p = { class: "drop-item-text" }, Mp = {
  key: 2,
  class: "drop-note"
}, Sp = {
  key: 1,
  class: "drop-none"
}, _p = {
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
        e.icon ? (c(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        v("span", wp, x(e.label), 1),
        N(ye, {
          name: "down",
          size: 11
        })
      ], 10, bp),
      s.value ? (c(), H(Zn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: q(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, kp)) : A("", !0),
          (c(!0), h(V, null, te(r.value, (f) => (c(), H($t, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: q(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (c(), h("span", xp, x(f.lead), 1)) : A("", !0),
              v("span", $p, x(f.label), 1),
              f.note ? (c(), h("span", Mp, x(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? A("", !0) : (c(), h("p", Sp, x(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, Ep = /* @__PURE__ */ K(_p, [["__scopeId", "data-v-29dfcce5"]]), N5 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => [
      ...vp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = B(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), H(Ep, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${P(yp)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Ap = ["aria-label"], Cp = { class: "head" }, Op = { class: "names" }, Tp = { class: "body" }, Rp = {
  key: 0,
  class: "foot"
}, Ip = {
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
    return (i, u) => (c(), H(us, { to: "body" }, [
      N(Dt, {
        name: "side",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: q(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: P(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = xe((...d) => P(o) && P(o)(...d), ["self"]))
          }, [
            v("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(V, { key: 0 }, [
                v("header", Cp, [
                  v("div", Op, [
                    v("h2", null, x(e.title), 1),
                    e.abstract ? (c(), H(wt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  N(bs, {
                    title: e.closeLabel,
                    onClick: P(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                v("div", Tp, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", Rp, [
                  ue(i.$slots, "foot", {}, void 0, !0)
                ])) : A("", !0)
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Ap)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, D5 = /* @__PURE__ */ K(Ip, [["__scopeId", "data-v-c9a3f43a"]]), Bp = {
  key: 1,
  class: "text-field-label"
}, Lp = {
  key: 2,
  class: "text-field-end"
}, Np = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ qa({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Pa(e, "modelValue"), a = Kn(), s = "onUpdate:modelValue" in (((d = oi()) == null ? void 0 : d.vnode.props) || {}), o = B(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = B(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = B(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = R(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, P(a).class]),
      style: ge(P(a).style)
    }, [
      e.icon ? (c(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (c(), h("span", Bp, x(e.label), 1)) : A("", !0),
      et(v("input", Ge({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [P(Va), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Lp, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : et((c(), h("input", Ge({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [P(Va), o.value]
    ]);
  }
}), j5 = /* @__PURE__ */ K(Np, [["__scopeId", "data-v-d9c38ca8"]]);
async function Dp(e, t, n) {
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
function P5(e) {
  const t = nt().sources.find((n) => n.key === e);
  return t ? Qa(t.read, t.events) : Qa("", []);
}
function Qa(e, t, { incremental: n = !1 } = {}) {
  var w;
  const a = Number(((w = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : w[1]) ?? 50), s = nt(), o = R([]), l = R(null), r = R(""), i = R(!1), u = performance.now(), d = R(!1), f = R(""), m = R(null);
  async function g($) {
    const S = b, C = await s.read(`${e} --before-id ${$ + 1} --limit 1`);
    if (S !== b) return;
    if (!C.ok) return j();
    const E = C.value.rows.find((I) => I.id === $);
    o.value = E ? o.value.map((I) => I.id === $ ? E : I) : o.value.filter((I) => I.id !== $);
  }
  async function y($) {
    if (n && String(($ == null ? void 0 : $.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((p) => p.id !== $.row_id));
    if (n && ($ != null && $.row_id) && !String($.event ?? "").endsWith(".create") && o.value.some((p) => p.id === $.row_id)) return g($.row_id);
    if (!(n && o.value.length && String(($ == null ? void 0 : $.event) ?? "").endsWith(".create"))) return j();
    const C = Math.max(...o.value.map((p) => p.id)), E = b, I = await s.read(`${e} --after-id ${C}`);
    if (E !== b) return;
    if (!I.ok) return j();
    const M = new Set(o.value.map((p) => p.id));
    o.value = [...I.value.rows.filter((p) => !M.has(p.id)), ...o.value];
  }
  async function k() {
    if (!d.value || !o.value.length) return !1;
    const $ = b, S = Math.min(...o.value.map((I) => I.id)), C = await s.read(`${e} --before-id ${S}`);
    if ($ !== b) return !1;
    if (!C.ok || !C.value.rows.length) return d.value = !1;
    d.value = ko(C.value, a);
    const E = new Set(o.value.map((I) => I.id));
    return o.value = [...o.value, ...C.value.rows.filter((I) => !E.has(I.id))], !0;
  }
  let b = 0;
  async function _($) {
    const S = ++b, C = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (S !== b) return;
    const E = C.ok ? s.shared ? [C.value] : C.value.rows : [];
    C.ok && (o.value = $(E)), l.value = C.ok ? C.value : null;
    const I = E.length ? Math.min(...E.map((M) => M.id)) : 0;
    C.ok && !o.value.some((M) => M.id < I) && (d.value = !s.shared && ko(C.value, a)), r.value = C.ok ? "" : C.error, hs(u, () => i.value = !0);
  }
  function j() {
    return _(($) => {
      if (!n || !$.length) return $;
      const S = Math.min(...$.map((E) => E.id)), C = Math.max(...$.map((E) => E.id));
      return [...o.value.filter((E) => E.id > C), ...$, ...o.value.filter((E) => E.id < S)];
    });
  }
  const J = () => _(($) => $);
  async function D($, S = null) {
    const C = await Dp(S && { target: o, fields: { value: S(o.value) } }, $, s.run);
    return f.value = C.ok ? "" : C.error, m.value = C.ok ? C.value : null, await j(), C;
  }
  return e && (s.follow(t, y), j()), { rows: o, listing: l, failure: r, loaded: i, more: d, load: j, loadLatest: J, older: k, act: D, actionFailure: f, answer: m, context: s };
}
const jp = { class: "title" }, Pp = { class: "state" }, qp = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Qa(t.line, t.events);
    return (o, l) => (c(), H(Cd, {
      rows: P(n),
      failure: P(a),
      loaded: P(s),
      empty: e.empty
    }, {
      default: q(({ row: r }) => [
        v("span", jp, x(r.title), 1),
        v("span", Pp, x(P(ml)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, q5 = /* @__PURE__ */ K(qp, [["__scopeId", "data-v-9191a6f0"]]);
function Fp(e = 1e3, t = null) {
  const n = R(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const ba = R(Date.now() / 1e3);
let xo = 0, xn = 0;
function ar() {
  return xn || (ba.value = Date.now() / 1e3, xo = setInterval(() => ba.value = Date.now() / 1e3, 1e3)), xn += 1, Xo() && fs(() => {
    xn -= 1, xn || clearInterval(xo);
  }), ba;
}
const Wp = 200, Hp = Zl + On + Xl + Wp;
function Ft(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Up(e, t, n) {
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
function zp(e, t, n, a) {
  me(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Up(o, l, n.value)), performance.now() - l < Hp) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const Vp = ["title", "data-figure-mark", "data-folded", "data-open"], Gp = {
  key: 2,
  class: "worker"
}, Kp = { class: "head" }, Yp = { key: 0 }, Jp = {
  key: 3,
  class: "status"
}, Zp = {
  key: 0,
  class: "figure"
}, Xp = {
  key: 1,
  class: "ran-for"
}, Qp = { key: 2 }, eg = {
  key: 3,
  class: "news"
}, tg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, ng = {
  key: 6,
  class: "settled"
}, ag = {
  key: 1,
  class: "bar"
}, sg = {
  key: 3,
  class: "detail body"
}, og = {
  key: 0,
  class: "body-label"
}, lg = ["title"], rg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Kn(), a = ["onClick", "onAct"], s = B(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = R(!1), l = B(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = B(() => t.open !== void 0), i = B(() => r.value || l.value), u = B(() => r.value ? t.open : o.value), d = B(() => r.value ? !t.open : l.value && !o.value), f = B(() => !!(t.mark.action && n.onAct)), m = B(() => i.value || f.value || !!n.onClick), g = R(null), y = R(null), { folded: k, phase: b } = Ql(g, () => d.value);
    zp(g, d, b, Ae(Te, null));
    function _(ie) {
      var fe, Ce;
      if (!(ie.target !== g.value && !y.value.contains(ie.target))) {
        if (r.value) return (fe = n.onClick) == null ? void 0 : fe.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ce = n.onAct || n.onClick) == null || Ce(ie);
      }
    }
    const j = (ie) => n.onAct(ie), J = ["failed", "unfinished"], D = B(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? J.includes(t.mark.state) ? "danger" : "good" : ""), w = B(() => t.mark.color ? t.mark.color : D.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : D.value ? `var(--tone-${D.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), $ = B(() => w.value || "var(--tone-work)"), S = B(() => !t.mark.ending && !t.mark.ended && D.value !== "stopped"), C = ar(), E = B(
      () => t.mark.began_at && S.value && !t.mark.figure && !t.mark.counting ? v1(C.value - t.mark.began_at) : ""
    ), I = B(() => {
      const { started: ie, ended: fe } = t.mark;
      return ie ? fe ? `ran ${ho(fe - ie, !0)}` : ho(C.value - ie, !0) : E.value;
    }), M = ["bad", "danger", "warn"], p = B(() => M.includes(D.value) || t.mark.asks ? "attention" : S.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), O = ["bad", "danger"], T = B(() => O.includes(D.value)), L = B(() => p.value === "process" ? "running" : T.value ? "cross" : D.value === "stopped" ? "stopped" : D.value === "good" ? "tick" : ""), Y = B(
      () => !!(t.mark.figure || I.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), ee = B(() => [t.mark.title, t.mark.time ? tr(t.mark.time) : ""].filter(Boolean).join(" · ")), re = B(() => ({
      ...w.value ? { "--mark": w.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, fe) => (c(), h("div", Ge(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${p.value}`,
        P(b),
        {
          open: u.value,
          folding: r.value && d.value,
          live: m.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: w.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: re.value,
      title: ee.value,
      "data-figure-mark": e.mark.key,
      "data-folded": P(k) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: _
    }), [
      (c(), H(St(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: q(() => [
          e.mark.markIcon ? (c(), H(ft, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Gp, x(e.mark.worker), 1)) : A("", !0),
          v("span", Kp, [
            N(wt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Yp, x(e.mark.name), 1)) : A("", !0),
            i.value ? (c(), H(xt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          Y.value ? (c(), h("span", Jp, [
            e.mark.figure ? (c(), h("span", Zp, x(e.mark.figure), 1)) : A("", !0),
            I.value ? (c(), h("span", Xp, x(I.value), 1)) : A("", !0),
            e.mark.stopping ? (c(), h("span", Qp, "Stopping")) : A("", !0),
            e.mark.news ? (c(), h("span", eg, x(e.mark.news), 1)) : A("", !0),
            L.value === "running" ? (c(), h("span", tg)) : L.value ? (c(), H(ft, {
              key: 5,
              class: Z(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (c(), h("span", ng, x(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), H(Jl, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: xe(j, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && S.value ? (c(), h("span", ag, [
        v("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: $.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !P(k) ? (c(), H(wt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !P(k) ? (c(), h("div", sg, [
        e.mark.bodyLabel ? (c(), h("p", og, x(e.mark.bodyLabel), 1)) : A("", !0),
        N(wt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !P(k) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, x(e.mark.command), 9, lg)) : A("", !0),
      e.mark.card ? (c(), H(wt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      ue(ie.$slots, "default", {
        shown: !P(k)
      }, void 0, !0)
    ], 16, Vp));
  }
}), sr = /* @__PURE__ */ K(rg, [["__scopeId", "data-v-2aa9c496"]]), ig = 60;
function cg(e, t) {
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
    if (l || a.value <= 0 || d.scrollTop > ig) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await ht(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const ug = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function or(e) {
  var n;
  const t = ug[e] || ((n = Pt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const dg = (e) => or(String(e).split(":")[0]), lr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), fg = { passed: "good", failed: "danger", warned: "warn", running: "" }, hg = { good: "good", warn: "warn", danger: "danger" }, $o = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => bd(e.target_model, e.target_id || 0)
}, mg = { "open row": (e) => dg(e.target_model), "open page": () => or("pages") };
function pg(e, t) {
  const n = t || {}, a = $o[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? fg[e.outcome] || "" : hg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? mg[a](e) : "",
    handlers: a ? { onAct: () => $o[a](e) } : {}
  };
}
const gg = 2e3;
function vg(e, t, n = gg) {
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
const yg = 24, bg = 1e3, Mo = 2e3, wg = 0.25, kg = 5e3;
function xg(e, t = yg, n = () => !0) {
  const a = R(!1), s = R(0), o = R(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const D = u();
    return D ? D.scrollHeight - D.scrollTop - D.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(D) {
    if (clearTimeout(l), !D) {
      o.value = !1, i = Date.now();
      return;
    }
    const w = Date.now() - i < Mo ? Mo : bg;
    l = setTimeout(() => o.value = a.value, w);
  }
  function g() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function y(D = !1) {
    const w = u();
    w && D && w.scrollTo ? w.scrollTo({ top: w.scrollHeight, behavior: "smooth" }) : w && (w.scrollTop = w.scrollHeight), g();
  }
  function k() {
    _(), !a.value && (a.value = !0, m(!0));
  }
  const b = () => !!u() && d() <= u().clientHeight * wg;
  function _() {
    clearTimeout(r), b() && (r = setTimeout(() => a.value && b() && n() && y(!0), kg));
  }
  function j() {
    f() ? g() : k();
  }
  function J(D = 1, w = !1) {
    a.value ? s.value += Math.max(0, D) : y(w);
  }
  return Xo() && fs(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: g, toBottom: y, left: k, scrolled: j, arrived: J };
}
const $g = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Mg = (e) => String(e ?? "").replace($g, ""), Sg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(null), { away: o, scrolled: l, arrived: r, toBottom: i } = xg(s);
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
      Q(x(P(Mg)(e.lines.join(`
`)) || e.empty), 1),
      P(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => P(i)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, _g = /* @__PURE__ */ K(Sg, [["__scopeId", "data-v-c2fb1783"]]), Eg = 1e4;
class Ag {
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
    return this.heardAt !== null && t - this.heardAt > Eg;
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
const Cg = {
  key: 0,
  class: "frame-note"
}, Og = {
  key: 0,
  class: "frame-note"
}, Tg = ["src", "title"], Rg = 1e3, Ig = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = nt(), a = R(null), s = R(!1), o = R(!1);
    let l = null, r = 0;
    return Le(() => {
      l = new Ag(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Rg);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", Cg, "This window was closed because it stopped answering.")) : (c(), h(V, { key: 1 }, [
      s.value ? (c(), h("div", Og, [
        u[2] || (u[2] = v("p", null, "This window has not answered for ten seconds.", -1)),
        N(de, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: q(() => [...u[1] || (u[1] = [
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
        title: P(n).window
      }, null, 8, Tg)
    ], 64));
  }
}, Bg = /* @__PURE__ */ K(Ig, [["__scopeId", "data-v-32a49046"]]), $n = (e) => e ? e.split(", ") : [];
function Lg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Ng(e, t) {
  return {
    reads: $n(e.reads_allowed),
    runs: $n(e.runs_allowed),
    missing: [...$n(e.reads_missing), ...$n(e.runs_missing)],
    ask: t
  };
}
const Dg = {
  class: "allowance-prompt",
  role: "dialog"
}, jg = { class: "allowance-prompt-text" }, Pg = { class: "allowance-prompt-buttons" }, qg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Dg, [
      v("p", jg, x(P(Lg)(e.request)), 1),
      v("div", Pg, [
        N(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            Q("Allow", -1)
          ])]),
          _: 1
        }),
        N(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            Q("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Fg = /* @__PURE__ */ K(qg, [["__scopeId", "data-v-cad69fe2"]]), wa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: q(() => [
        Q(x(e.reason) + " ", 1),
        e.retry ? (c(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            Q("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (c(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            Q("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Wg = ["data-window", "data-agent"], Hg = {
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
    const r = Ae(Li, null), i = hu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: B(() => n.options),
      declared: n.declared,
      page: Ae(ru, null),
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
    li(Te, i), me(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Le(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), ri((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Gn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), H(Fg, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (c(), H(wa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), H(wa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(V, { key: 4 }, [
        (c(), H(u, { key: o.value })),
        e.skeleton.length && !P(i).answered.value ? (c(), H(Ss, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (c(), H(wa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Wg));
  }
}, Kt = /* @__PURE__ */ K(Hg, [["__scopeId", "data-v-c4443e2b"]]), rr = {
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
    const n = e, a = t, s = { render: () => Gn(Bg, { src: n.entry.entry_url }) };
    return (o, l) => (c(), H(Kt, {
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
}, Ug = ["data-window"], ir = {
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
            )).default, wc();
          } catch (r) {
            if (yc(r) && bc(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      N(Ss, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Ug)) : (c(), H(Kt, {
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
}, zg = "*.*", Vg = {
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
    const t = e, n = Ae(Te, null), a = new tu();
    me(
      () => a.patterns,
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (g) => a.dispatch(g));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = B(() => !!(t.declaration.shipped || t.declaration.trusted)), r = B(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [zg] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), H(ir, {
      key: 0,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), H(rr, {
      key: 1,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Gg = { class: "mark-more-inner" }, Kg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Yg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Jg = {
  key: 3,
  class: "mark-lines"
}, Zg = "process", So = "task", Xg = {
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
    ), s = B(() => lr.has(t.mark.variant) && t.mark.detail || ""), o = B(() => t.mark.target_model === So ? t.mark.target_id : 0), l = cg(
      (g) => n.run(g),
      () => t.mark.target_id
    ), r = l.lines, i = R(!1), u = R(""), d = B(() => !t.declaration.body_url && t.mark.target_model === Zg && !!t.mark.target_id);
    async function f(g = l.follow) {
      const y = await g();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = B(() => t.shown && d.value);
    return me(m, (g) => g && f()), vg(() => m.value && f(), () => m.value && !t.mark.ended_at), me(
      () => t.mark.ended_at,
      (g) => g && m.value && f(l.newest)
    ), (g, y) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = xe(() => {
      }, ["stop"]))
    }, [
      v("div", Gg, [
        e.declaration.body_url ? (c(), H(Vg, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (c(), h(V, { key: 1 }, [
          s.value ? (c(), h(V, { key: 0 }, [
            y[2] || (y[2] = v("p", { class: "mark-label" }, "Why it stopped", -1)),
            v("p", Kg, x(s.value), 1)
          ], 64)) : A("", !0),
          d.value && u.value ? (c(), h("p", Yg, x(u.value), 1)) : d.value && i.value ? (c(), h(V, { key: 2 }, [
            y[3] || (y[3] = v("p", { class: "mark-label" }, "Output", -1)),
            N(_g, {
              class: "mark-terminal",
              lines: P(r),
              onOlder: P(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", Jg, x(a.value.join(`
`)), 1)) : A("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = xe((k) => P(qe)(`${So}:${o.value}`), ["stop"]))
          }, " Open task " + x(o.value) + " and its proofs ", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, es = /* @__PURE__ */ K(Xg, [["__scopeId", "data-v-f4d037e5"]]), Qg = ["title", "aria-label", "onClick"], e0 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, t0 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = B(() => Vu(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = R(""), s = Ae(Te);
    async function o(l) {
      const r = await rn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(V, null, [
      (c(!0), h(V, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: xe((u) => o(i), ["stop"])
      }, [
        N(ft, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Qg))), 128)),
      a.value ? (c(), h("span", e0, x(a.value), 1)) : A("", !0)
    ], 64));
  }
}, n0 = /* @__PURE__ */ K(t0, [["__scopeId", "data-v-7a62c88e"]]);
function cr(e, t) {
  const n = Ve(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const ur = cr("/api/marks", "marks"), F5 = ur.fetchAll, a0 = ur.find, s0 = ["data-ref"], o0 = ["data-ref"], l0 = { class: "mark-row" }, r0 = "dock add", i0 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = B(() => a0(a.mark.type)), o = B(() => pg(a.mark, s.value)), l = B(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && lr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = R(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = B(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(r0));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, g;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        N(es, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, s0)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        v("span", l0, [
          N(sr, Ge({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, ii(o.value.handlers), { onClick: i }), ci({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: q(({ shown: y }) => [
                N(es, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          N(n0, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, o0));
    };
  }
}, c0 = /* @__PURE__ */ K(i0, [["__scopeId", "data-v-8196402d"]]), u0 = ["data-ref"], d0 = ["inert"], f0 = { class: "group-fold" }, h0 = { class: "thread-group" }, m0 = {
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
      N(sr, {
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
        v("div", f0, [
          v("div", h0, [
            (c(!0), h(V, null, te(e.group.marks, (u) => (c(), H(c0, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, d0)) : A("", !0)
    ], 8, u0));
  }
}, W5 = /* @__PURE__ */ K(m0, [["__scopeId", "data-v-45b58b9b"]]);
function p0(e) {
  const t = R(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Le(() => n.observe(e.value)), _t(() => n.disconnect()), t;
}
const g0 = { class: "chat-dock-fold" }, v0 = ["aria-label"], y0 = { class: "chat-dock-head" }, b0 = { class: "chat-dock-inner" }, w0 = { class: "chat-dock-foot" }, dr = 700, k0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = R(null), a = R(null), s = p0(a), o = R(!1);
    let l = 0;
    return Le(() => l = setTimeout(() => o.value = !0, dr)), _t(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      v("div", g0, [
        v("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          v("header", y0, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          v("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            v("div", b0, [
              v("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: ge(P(s) === null ? null : { height: `${P(s)}px` })
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
          v("footer", w0, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, v0)
      ])
    ], 2));
  }
}, fr = /* @__PURE__ */ K(k0, [["__scopeId", "data-v-74d44b19"]]), x0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ka = 5, $0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ka, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ka}s`, animationDelay: `${(n - ka).toFixed(2)}s` };
    return (s, o) => (c(), h("span", x0, [
      v("i", { style: a })
    ]));
  }
}, hr = /* @__PURE__ */ K($0, [["__scopeId", "data-v-2a7bc150"]]), M0 = { reviewing: "Under review" }, S0 = (e, t) => e || M0[t == null ? void 0 : t.state] || "", Ze = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, _0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Ze],
  ready: [Ze],
  approved: [{ word: "start", label: "Start", main: !0 }, Ze],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ze],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ze],
  completed: [],
  cancelled: []
}, E0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ze],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ze],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, A0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], C0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], O0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], T0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], R0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], I0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function B0(e, t) {
  const n = { plan: _0, task: E0 }[e], a = t != null && t.state ? lu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[pl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const L0 = (e, t) => e === "doc" || e === "report" ? I0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...O0(t), ...C0(t)] : e === "check" ? R0(t) : e === "question" ? A0(t) : e === "memory" ? T0(t) : B0(e, t), mr = cr("/api/docks", "docks"), H5 = mr.fetchAll, Ut = mr.find, N0 = 6, D0 = 3, xa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ea = (e) => Date.parse(e.leaves_at) / 1e3, bt = (e) => !!(e.leaves_at && !e.kept), j0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!bt(e) || t < ea(e) || n.has(e.id)), P0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => j0(a, t, n)).sort((a, s) => a.id - s.id);
function q0(e, t, n = N0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ea(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const F0 = (e, t, n = e) => n < 2 ? !1 : e >= D0 ? !0 : t, W0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ts = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), H0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), U0 = (e) => ({ ...e.kept ? ts("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ts("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), z0 = ["pins"], V0 = (e) => ({ ...e, iconOnly: z0.includes(e.icon) });
function G0(e, t) {
  var n;
  return [
    ...H0(e, t) ? [U0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Pt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ts("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(V0);
}
function K0(e, t) {
  const n = G0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: W0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Y0 = ["title"], J0 = {
  key: 2,
  class: "dock-controls"
}, Z0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, X0 = { class: "dock-facts" }, Q0 = { key: 1 }, ev = {
  key: 2,
  class: "dock-kept"
}, tv = { class: "dock-acts" }, nv = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = B(() => Ut(a.item.type)), o = ar(), l = B(() => er(a.item.created_at, o.value * 1e3)), r = R(null), i = R(null), u = R(null), d = R(null), f = B(() => K0(a.item, s.value)), m = Ae(Te), g = R(null);
    let y = 0;
    async function k() {
      var I, M;
      const $ = ++y, S = Gt(a.item.target_model ?? ""), C = `${S} show`;
      if (!((M = (I = s.value) == null ? void 0 : I.reads) != null && M.includes(C))) return;
      const E = await it(a.item.type, [S, "show", String(a.item.target_id)], m.environment, m.signal);
      $ === y && (g.value = E.ok ? { ...E.value, id: a.item.target_id, noun: S } : { id: a.item.target_id, noun: S });
    }
    me(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      ($, S, C) => {
        var M;
        const E = Gt(a.item.target_model ?? "");
        g.value = { id: a.item.target_id, noun: E }, k();
        const I = (M = m.subscriptions) == null ? void 0 : M.follow(`dock ${a.item.id}`, [`${E.replaceAll("-", "_")}.*`], (p) => {
          (!p.row_id || p.row_id === a.item.target_id) && k();
        });
        C(() => {
          y += 1, I == null || I();
        });
      },
      { immediate: !0 }
    );
    const b = R(/* @__PURE__ */ new Set()), _ = R("");
    async function j($) {
      if ($.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (b.value = /* @__PURE__ */ new Set([...b.value, $.label])), _.value = "";
      const C = await rn($, { id: a.item.target_id }, m.environment);
      (C == null ? void 0 : C.ok) === !1 && (b.value = new Set([...b.value].filter((E) => E !== $.label)), _.value = `Could not ${$.label.toLowerCase()}: ${C.error}`);
    }
    const J = B(() => f.value.actions.filter(($) => $.action !== "undock" && !b.value.has($.label))), D = B(() => {
      var $;
      return S0(($ = s.value) == null ? void 0 : $.badge, g.value);
    }), w = B(() => f.value.buttons.find(($) => $.action === "undock"));
    return ($, S) => {
      var C, E, I, M;
      return c(), H(fr, {
        label: f.value.title + ((C = s.value) != null && C.needs_user ? ", waiting for you" : ""),
        type: (E = s.value) != null && E.needs_user ? "waiting" : "",
        folded: !!((I = s.value) != null && I.folds) && e.folded,
        body: !!((M = s.value) != null && M.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: S[3] || (S[3] = (p) => e.collapsed && n("open"))
      }, {
        edge: q(() => [
          e.leaving && !e.item.kept ? (c(), H(hr, {
            key: 0,
            "ends-at": P(ea)(e.item)
          }, null, 8, ["ends-at"])) : A("", !0)
        ]),
        head: q(() => {
          var p, O;
          return [
            (p = s.value) != null && p.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(V, { key: 1 }, [
              N(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              v("span", {
                class: "dock-title",
                title: f.value.title
              }, x(f.value.title), 9, Y0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", J0, [
              (c(!0), h(V, null, te(f.value.controls, (T) => {
                var L, Y;
                return c(), h(V, {
                  key: T.action + T.runs
                }, [
                  !b.value.has(T.label) && (!((L = T.variants) != null && L.length) || !((Y = g.value) != null && Y.state) || T.variants.includes(g.value.state)) ? (c(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: T.pressed }),
                    "aria-pressed": T.pressed,
                    "aria-label": T.label,
                    title: T.label,
                    "data-dock-action": T.action,
                    onClick: (ee) => j(T)
                  }, {
                    default: q(() => [
                      N(ye, {
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
              (O = s.value) != null && O.leaves_after_seconds ? A("", !0) : (c(), h(V, { key: 0 }, [
                Q(x(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: q(() => [
          _.value || e.refusal ? (c(), h("p", Z0, x(_.value || e.refusal), 1)) : A("", !0)
        ]),
        foot: q(() => {
          var p, O;
          return [
            v("span", X0, [
              D.value ? (c(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, x(D.value), 3)) : A("", !0),
              (p = s.value) != null && p.word ? (c(), h("span", Q0, x(s.value.word), 1)) : A("", !0),
              v("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", ev, "Kept")) : A("", !0)
            ]),
            (O = s.value) != null && O.folds ? (c(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: S[0] || (S[0] = (T) => n("fold"))
            }, {
              default: q(() => [
                Q(x(s.value.folds) + " ", 1),
                N(xt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : A("", !0),
            v("span", tv, [
              v("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              N(ld, {
                name: `dock.${e.item.type}`,
                row: g.value,
                environment: P(m).environment,
                "read-only": P(m).readOnly,
                "object-name": P(Gt)(e.item.target_model),
                "external-failure": "",
                onFailure: S[1] || (S[1] = (T) => _.value = T),
                onDone: k
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (c(!0), h(V, null, te(J.value, (T) => (c(), H(de, {
                key: T.action + T.runs,
                small: "",
                variant: T.primary ? "primary" : "ghost",
                bordered: !T.primary,
                "data-dock-action": T.action,
                onClick: (L) => j(T)
              }, {
                default: q(() => [
                  Q(x(T.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              N(de, {
                small: "",
                bordered: "",
                title: w.value.label,
                "data-dock-action": "undock",
                onClick: S[2] || (S[2] = (T) => n("undock", w.value))
              }, {
                default: q(() => [...S[4] || (S[4] = [
                  Q("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: q(() => {
          var p;
          return [
            (p = s.value) != null && p.body_url ? (c(), H(es, {
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
}, _o = /* @__PURE__ */ K(nv, [["__scopeId", "data-v-460364d0"]]), av = ["title", "aria-label"], sv = { class: "run-chip-in" }, ov = {
  key: 0,
  class: "run-chip-ring"
}, lv = { class: "run-chip-name" }, rv = { class: "run-chip-bar" }, iv = "processes.output", cv = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ae(Te, null), o = (s == null ? void 0 : s.environment) ?? "", l = R(null), r = B(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = B(() => {
      var m, g;
      return ((m = l.value) == null ? void 0 : m.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), u = B(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await it(iv, ["process", "card", String(a.item.target_id)], o, s == null ? void 0 : s.signal);
      m.ok && (l.value = m.value);
    }
    let f = null;
    return Le(() => {
      var m;
      d(), f = (m = s == null ? void 0 : s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (g) => {
        (!g.row_id || g.row_id === a.item.target_id) && d();
      });
    }), _t(() => f == null ? void 0 : f()), (m, g) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": u.value })
      }, [
        P(bt)(e.item) ? (c(), H(hr, {
          key: 0,
          "ends-at": P(ea)(e.item)
        }, null, 8, ["ends-at"])) : A("", !0),
        v("span", sv, [
          r.value ? (c(), h("span", ov)) : (c(), H(ft, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          v("span", lv, x(i.value), 1)
        ]),
        v("span", rv, [
          v("i", {
            style: ge({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, av);
    };
  }
}, uv = /* @__PURE__ */ K(cv, [["__scopeId", "data-v-f864bc58"]]), dv = 24, fv = 8, U5 = 420;
function z5({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= dv ? !0 : e < t && s > fv ? !1 : null;
}
const hv = (e, t) => e === void 0 ? t : e, mv = { me: 1, people: [] }, qn = Yn({
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
  people: mv,
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
const pr = "journal.viewer.";
function pv(e, t, n) {
  try {
    const a = n.getItem(pr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function gv(e, t, n) {
  try {
    n.setItem(pr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Eo(e, t, n = window.localStorage) {
  const a = R(pv(e, t, n));
  return me(a, (s) => gv(e, s, n), { deep: !0 }), a;
}
const vv = {
  key: "dock-all",
  class: "dock-all"
}, yv = {
  key: "runs-head",
  class: "dock-runs-head"
}, bv = { class: "dock-runs-title" }, wv = { class: "dock-runs-chips" }, kv = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var M, p;
    const t = e, n = Fp(500), a = R(/* @__PURE__ */ new Set()), s = R(!1), o = R(!1), l = Ae(Te), r = R(/* @__PURE__ */ new Set()), i = R({});
    async function u(O, T) {
      i.value = { ...i.value, [O.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, O.id]);
      const L = await rn(T, { id: O.target_id }, l.environment);
      (L == null ? void 0 : L.ok) === !1 && (r.value = new Set([...r.value].filter((Y) => Y !== O.id)), i.value = { ...i.value, [O.id]: `Could not close this card: ${L.error}` });
    }
    const d = B(
      () => P0(
        t.items.filter((O) => !r.value.has(O.id)),
        n.value,
        a.value
      )
    ), f = B(
      () => q0(
        d.value.filter((O) => xa(O, Ut)),
        n.value
      )
    ), m = B(() => d.value.filter((O) => !f.value.includes(O) && !xa(O, Ut))), g = B(() => f.value.filter((O) => !bt(O))), y = Eo(`dock-size:${((M = qn.identity) == null ? void 0 : M.root) || location.host}`, null), k = (O) => y.value ? y.value.collapsed && !y.value.opened.includes(O.id) : t.collapsed, b = B(() => d.value.some(k)), _ = B(() => (s.value = F0(f.value.length, s.value, g.value.length)) && !o.value && !d.value.some(k));
    function j() {
      y.value = { collapsed: !b.value, opened: [] };
    }
    function J(O) {
      var L;
      if (!k(O)) return;
      const T = (L = y.value) != null && L.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...T, O.id] };
    }
    const D = Eo(`dock-folded:${((p = qn.identity) == null ? void 0 : p.root) || location.host}`, {}), w = (O) => {
      var T;
      return !!((T = Ut(O.type)) != null && T.folds) && hv(D.value[O.id], xa(O, Ut) || t.folded);
    };
    function $(O) {
      D.value = { ...D.value, [O.id]: !w(O) };
    }
    function S(O) {
      D.value = { ...D.value, ...Object.fromEntries(f.value.map((T) => [T.id, T.id !== O.id])) }, o.value = !0;
    }
    function C() {
      D.value = Object.fromEntries(Object.entries(D.value).filter(([O]) => !f.value.some((T) => String(T.id) === O))), o.value = !1;
    }
    function E(O) {
      a.value = /* @__PURE__ */ new Set([...a.value, O.id]);
    }
    function I(O) {
      a.value = new Set([...a.value].filter((T) => T !== O.id));
    }
    return (O, T) => (c(), H(Zo, {
      tag: "div",
      name: "dock",
      duration: P(dr),
      class: "dock-stack"
    }, {
      default: q(() => [
        d.value.length > 1 ? (c(), h("div", vv, [
          N(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            onClick: j
          }, {
            default: q(() => [
              Q(x(b.value ? "Open all" : "Collapse all"), 1),
              N(xt, {
                open: !b.value
              }, null, 8, ["open"])
            ]),
            _: 1
          })
        ])) : A("", !0),
        (c(!0), h(V, null, te(m.value, (L) => (c(), H(_o, {
          key: L.id,
          item: L,
          class: Z({ timed: P(bt)(L) }),
          leaving: P(bt)(L) && !a.value.has(L.id),
          folded: w(L),
          collapsed: k(L),
          refusal: i.value[L.id],
          onOpen: (Y) => J(L),
          onFold: (Y) => $(L),
          onUndock: (Y) => u(L, Y),
          onMouseenter: (Y) => E(L),
          onMouseleave: (Y) => I(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !b.value ? (c(), h("div", yv, [
          v("span", null, x(f.value.length) + " runs", 1),
          N(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: C
          }, {
            default: q(() => [
              T[1] || (T[1] = Q(" Runs ", -1)),
              N(xt, { open: "" })
            ]),
            _: 1
          })
        ])) : A("", !0),
        (c(!0), h(V, null, te(_.value ? [] : f.value, (L) => (c(), H(_o, {
          key: L.id,
          item: L,
          class: Z({ timed: P(bt)(L) }),
          leaving: P(bt)(L) && !a.value.has(L.id),
          folded: w(L),
          collapsed: k(L),
          refusal: i.value[L.id],
          onOpen: (Y) => J(L),
          onFold: (Y) => $(L),
          onUndock: (Y) => u(L, Y),
          onMouseenter: (Y) => E(L),
          onMouseleave: (Y) => I(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        _.value ? (c(), H(fr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: q(() => [
            N(ye, {
              name: "runs",
              size: 14
            }),
            v("span", bv, x(f.value.length) + " runs", 1)
          ]),
          foot: q(() => [
            v("span", wv, [
              (c(!0), h(V, null, te(f.value, (L) => (c(), H(uv, {
                key: L.id,
                item: L,
                onClick: (Y) => S(L)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            N(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: T[0] || (T[0] = (L) => o.value = !0)
            }, {
              default: q(() => [
                T[2] || (T[2] = Q(" Runs ", -1)),
                N(xt)
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
}, V5 = /* @__PURE__ */ K(kv, [["__scopeId", "data-v-ea618218"]]), kt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Tn = (e) => Math.min(Math.max(e, 0), 1), xv = (e) => {
  const t = Tn(e);
  return t * t * (3 - 2 * t);
}, pt = (e, t, n) => xv((e - t) / (n - t));
function G5(e) {
  const t = Tn(e), n = Tn((t - 0.12) / 0.76) * kt.shuffles, a = Math.min(Math.floor(n), kt.shuffles - 1), s = n - a, o = pt(s, 0.26, 0.38) * (1 - pt(s, 0.76, 0.96)), l = pt(s, 0.38, 0.76), r = pt(t, 0, 0.12) * (1 - pt(t, 0.88, 1)), i = pt(s, 0.2, 0.34) * (1 - pt(s, 0.84, 1)), u = Math.sin(Math.PI * Tn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / kt.shuffles, lift: kt.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function K5(e, t, n, a, s) {
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
}, Y5 = (e) => Ao[e] ?? Ao.butler, _s = 2400, $v = 0.05;
function Mv({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, $v), l = Math.min(t + _s * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function J5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function Sv(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function Z5(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const X5 = (e, t) => ({ ...e, stretch: t.stretch }), Q5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, gr = (e, t) => t >= (e.least ?? 0);
function e4(e, t, n) {
  if (!gr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const t4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), _v = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Co = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Ev = (e) => e.right > e.left && e.bottom > e.top;
function n4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(_v)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Co(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Co(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), Ev(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function vr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const g = t[d] - e[d];
      if (Math.abs(g) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const y = (o[f] - e[d]) / g, k = (o[m] - e[d]) / g;
        l = Math.max(l, Math.min(y, k)), r = Math.min(r, Math.max(y, k));
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Av = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => Av(tn(e, t, n)), Cv = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ct = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Mn = ([e, t], n) => e + n() * (t - e);
function Ov(e) {
  return Cv.map(() => {
    const t = Mn(ct.speed, e), n = Mn(ct.angle, e) * Math.PI / 180, a = Mn(ct.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Mn(ct.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Tv = Ov(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Rv(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ct.gravity * (t[2] - ct.floor))) / ct.gravity;
}
function a4(e, t, n = Tv) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Rv(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= ct.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const s4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function o4(e, t) {
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
const l4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function r4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function i4(e, t, n) {
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
function c4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = Mv({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function u4(e) {
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
function Iv(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = Sv(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function d4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = Iv(n, e.length), u = e.map((_, j) => ({ ...ns(_, t, Math.min(n / o.fps, Rn(j).shot)), shot: j < i })), d = Ee(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], g = e.map((_, j) => ({ bug: _, index: j, seconds: n / o.fps - Rn(j).shot, spot: ns(_, t, Rn(j).shot) })).filter((_) => _.seconds >= 0), y = g.flatMap((_) => {
    const j = (s == null ? void 0 : s.get(_.index)) ?? jv(_.bug, t, _.spot, s ? [] : a);
    return s == null || s.set(_.index, j), s && Pv(j, _.seconds, a), qv(j, _.seconds, a);
  }), k = g.filter((_) => Nv(_.bug)).map((_) => ({ seconds: _.seconds, from: _.spot })), b = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: b }, slush: y, camera: k };
}
function Rn(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function f4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = Rn(d), m = ns(u, t, f.shot), g = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), k = Math.abs(m.x - i) >= g ? i : m.x + y * g, b = y > 0 ? Math.max(i, Math.min(k, r)) : Math.min(i, Math.max(k, l)), _ = { from: i, to: b, begin: f.walk, end: f.aim };
    return i = b, _;
  });
}
function h4(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Bv = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Lv(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Nv = (e) => e.along * 97 % 1 < $e.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function Dv(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += $e.step) {
    const d = Math.min(u + $e.step, l.t), f = nn(e, d), m = vr(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = nn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function jv(e, t, n, a = []) {
  const s = Lv(e.along + 1), [o, l] = Bv[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...Dv(d, t, a) };
  });
}
function Pv(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += $e.step) {
      const l = Math.min(o + $e.step, s), r = vr(nn(a, o), nn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function qv(e, t, n = []) {
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
function m4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ee(e, [0, u]), m = Ee(e, [u, u + d]);
  return l.map((g) => {
    const y = { x: a.x + g.at[0] * t, y: a.y + g.at[1] * t };
    return {
      x: n.x + (y.x - n.x) * f,
      y: n.y + (y.y - n.y) * f,
      r: g.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function p4(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (k) => {
    const [b, _] = [k.x - e.at.x, k.y - e.at.y];
    return { x: r.x + b * u - _ * d, y: r.y + b * d + _ * u };
  }, [m, g] = [...n].sort((k, b) => k.x - b.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map((k, b) => ({ from: k, to: b < y.length / 2 ? m : g })) };
}
const g4 = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function Fn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function v4(e, t) {
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
const y4 = (e) => e === "pack_box";
function b4(e) {
  const { into: t, out: n } = Fn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function w4(e) {
  const t = _e.rope_swing, { into: n, out: a } = Fn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Fv = { after: 3 }, Es = 10, Wv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Hv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Uv = { weight: 19 }, yr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, zv = { every: 120 }, br = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, wr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Vv = {
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
}, un = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Es }), ne = (e, t, n = {}) => un(e, "clip", t, n), $a = (e, t, n = {}) => un(e, "look", t, n), Oo = (e, t, n = {}) => un(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...un(e, "pick", t, n), ...a }), we = (e) => un("nothing", "nothing", e, {}), Gv = 120, Kv = 300, Ma = (e, t) => ({ ...ne(e, t), cooldown: Kv }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), Yv = () => [ne("joy", 2)], gt = (e, t, n, a, s = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), vt = (e) => ({ ...e, cooldown: Wv[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: Hv[e.name] }), ta = [
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
  ...le("bar_done", { holds: !0 }, Yv()),
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
  ...Object.entries(Vv).flatMap(([e, t]) => le(`reacted:${e}`, {}, [$a(t, 1)])),
  ...Object.entries(br).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => le(`agent_reacted:${n}`, {}, [ne(a, 1, { voices: [e] })])[0])),
  ...Object.entries(wr).flatMap(([e, t]) => le(`agent_reacted:${e}`, {}, [ne(t, 1)])),
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
  ...le("held:search", { cooldown: Gv }, [Ma("search", 3), { ...Ma("binoculars", 2), when: { home: !0 } }, { ...Ma("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...le("unit", { cooldown: yr.build.cooldown }, [pe("unit", Uv.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: zv.every }, pe("stand", 5)]),
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
], kr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), xr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Jv = (e) => Array.isArray(e) ? e[0] : e, Zv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, Xv = (e) => ta.some((t) => t.when.moment === e);
function Qv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || xr(d).every(([f, m]) => n(f) >= Jv(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ta.filter((d) => kr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Fv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function He(e, t) {
  const n = Qv(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : ($r(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function $r(e, t, n) {
  var a;
  for (const [s, o] of xr(t)) (a = e.memory) == null || a.set(s, e.now + Zv(o, n));
}
function k4(e, t, n) {
  $r(e, ta.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const x4 = (e) => Object.values(yr).find((t) => kr(t.when, e)) ?? null, ey = (e, t, n) => n - t <= (e.lifetime ?? Es), $4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || gr(e.clip, t));
class Mr {
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
}, M4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Sr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), S4 = {
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
}, _4 = 120, ty = 20, E4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < ty), ny = (e) => as[e] || as.idle, A4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, _r = "airborne", ay = "landing", sy = "travelling", Er = "grounded", C4 = ({ airborne: e, landing: t, trip: n }) => e ? _r : t ? ay : n != null && n.started ? sy : Er;
function O4(e, t) {
  var s;
  const n = oy(e, t);
  return e.mode === Er && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function oy(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === _r && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...ly(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const g = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : ny(u), facing: g ? m : r.posture === "sit" ? r.face : f };
}
function ly(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ss = (e) => e.outcome, ry = "plugin:code-commandments:sins:", To = (e) => e.type === "plugins.card" && e.markKey.startsWith(ry), iy = [
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
], T4 = (e, t) => e.filter((n) => n.author === "user" && jn(n.read_at) > t).map((n) => ({ beat: "read_message", time: jn(n.read_at), card: zl(n) })).sort((n, a) => n.time - a.time), Ro = { user: "reacted", agent: "agent_reacted" };
function R4(e, t) {
  return e.filter((n) => Ro[n.author] && Mt(n) > t).map((n) => ({ beat: `${Ro[n.author]}:${n.emoji}`, time: Mt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const cy = [.../* @__PURE__ */ new Set([...Object.values(br).flatMap((e) => Object.keys(e)), ...Object.keys(wr)])];
function I4(e, t) {
  return e.filter((n) => n.author === "agent" && Mt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = cy.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Mt(n), card: zl(n) })).sort((n, a) => n.time - a.time);
}
const uy = (e) => new Mr(e).isTest(), Wn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ss(e)] || "";
}, dy = 1800, fy = (e, t) => {
  if (Wn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Wn(n) !== "finished" && Number(e.time) - Number(n.time) <= dy ? "tests_fixed" : "tests_passed";
};
function B4(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(uy), s = a.filter((r) => Wn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Wn(r))), o.map((r) => ({ beat: fy(r, s), time: Number(r.time), card: r.key }));
}
function L4(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ss(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ss(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const N4 = (e) => e.map((t) => {
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
function D4(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function j4(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function P4(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = iy.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function As(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Io = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function hy(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    As(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function q4(e, t, n, a = {}) {
  const s = He({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : Xv(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function F4(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const Bo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function W4(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, r = o % Re.sweep, i = Re.sweep - Re.returnSeconds, u = Bo((r - i) / Re.returnSeconds), d = r <= i ? Bo(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Lo = 3, Ar = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, No = 12, H4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function U4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Ar(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Lo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * No) / No, lasts: Lo } };
}
const z4 = (e) => e.posture === "hang" && !Ar(e.face), my = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), py = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function V4(e, t, n) {
  return my.has(e) ? 1 / 0 : !py.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Cr(n - t.began, t.share) - Xe.lead, 0);
}
const gy = 5;
function G4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= gy ? { beat: "long_walk", time: n } : null };
}
const vy = 30, Sn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function K4(e, t, n, a, s = null) {
  if (t && n < t.until || !Sn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = He({ moment: "spell", state: e, tally: s }, a), [l, r] = Sn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + Sn.every } : { state: e, began: 0, until: 0, next: n + Sn.every };
}
const Y4 = (e, t, n) => t && n < t.until && Sr.has(e.state) ? { state: t.state, since: t.began } : e, Xe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Cr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function J4(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Cr(o, e.share);
  return s ? { eager: yy(t, l), moment: null } : l > Xe.lead ? { eager: t, moment: null } : l < Xe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Xe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Xe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = He({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function yy(e, t) {
  return e.on && t > Xe.lead + Xe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Xe.lead && t >= Xe.least ? { ...e, on: !0, calm: !1 } : e;
}
const by = 1, wy = { look: "look", gaze: "gaze" };
function ky(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = He({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [wy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const xy = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => He({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), $y = (e, t, n, a, s, o = 0) => He({ moment: "jump", high: e > by * t, memory: a, now: s, room: o }, n).name === "backflip", My = { work: ["building"], idle: ["standing"] };
function Z4(e, t, n, a) {
  const s = as[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(My[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Sr.has(e) ? { moments: o, began: n || a } : (n && a - n >= vy && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Sy(e, t, n) {
  return !He({ moment: "pondering", memory: e, now: t }, n) || !He({ moment: "thought_cloud", memory: e, now: t }, n) ? null : He({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Do = { pondering: Sy };
function X4(e, t, n, a, s, o) {
  if (Do[e.beat]) {
    const r = Do[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = ky(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Es && { lifetime: l.lifetime } } } : null;
}
function Q4(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = xy(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const ex = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function tx(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function nx(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const ax = (e, t) => !!(e != null && e.watches) && !t.once, sx = 10, ox = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || ey(a, a.queuedAt, n)), lx = (e, t) => t ? null : e[0] ?? null;
function rx(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const ix = (e, t) => !t.during || !e.some((n) => n.during === t.during), _y = 2 * Math.PI, Ey = 500;
function cx(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Ey, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = _y * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, k = (u ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !i ? s && !t.behind && !g.behind ? Cy(g, t, n, m, s) : Ty(g, t, n, m) : t) ?? g, b = k != null && k.behind && k.mood === "reading" ? Ay(e.point, k, n, l, s) : k;
  return { point: b ?? null, toward: b ? { x: b.x - n.x, y: b.y - n.y } : null, amount: f, at: a };
}
function Ay(e, t, n, a, s) {
  const o = (E) => E * 180 / Math.PI, l = (E) => o(Math.atan2(Math.sin(E * Math.PI / 180), Math.cos(E * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, g = f ? e.readingYaw + m : d, y = g + l(u - g), k = Math.min(Math.max(a / 1e3, 0), 0.1), b = Re.turnSpeed * k, _ = f ? g + Math.min(Math.max(y - g, -b), b) : y, j = f ? e.readingFollow + m : _, J = j + (_ - j) * (1 - Math.exp(-k / Re.followSeconds)), D = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, w = o(As(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), $ = Math.min(Math.max(w, -D.up), D.down), S = Re.tipSpeed * k, C = f ? e.readingPitch + Math.min(Math.max($ - e.readingPitch, -S), S) : $;
  return { ...t, readingYaw: _, readingFollow: J, readingPitch: C, readingFacing: r };
}
function Cy(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (j) => {
    const { yaw: J, pitch: D } = As(j.x - n.x, s, n.y - j.y, o);
    return { yaw: J, pitch: Math.min(Math.max(D, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [Io(r(e)), Io(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, g] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, k, b] = i.map((j, J) => m * j + g * u[J]), _ = s * y / k;
  return { ...t, x: n.x + _, y: n.y - hy(_, s, -Math.asin(Math.min(Math.max(b, -1), 1)), o) };
}
const Oy = 0.15;
function ux(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Oy;
}
function Ty(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Ry = (e) => !(e != null && e.on);
function dx(e, t, n) {
  if (Ry(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ye = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Sa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), jo = (e) => e * e * (3 - 2 * e);
function Iy(e) {
  if (e < 0 || e >= Ye.seconds) return null;
  const t = Sa(e, ...Ye.flicker), n = Math.floor(t * Ye.flickers * 2) % 2 === 0, a = e < Ye.flicker[1] ? n ? 0.35 + 0.5 * t : Ye.dim : 1;
  return { strength: 1 - jo(Sa(e, ...Ye.fade)), lit: a, white: e < Ye.flash[0] ? 0 : 1 - jo(Sa(e, ...Ye.flash)) };
}
const fx = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function hx(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Iy(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ye.signs[e.tone], ...a } };
}
function mx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function px(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function gx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, vx = { behind: 39, figure: 40, ahead: 41 }, By = "[data-figure-pile]", Ly = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, In = { phases: 4, ms: 230, dim: 0.25 }, yx = (e, t, n) => e !== "amber" || (t + n) % In.phases < In.phases / 2 ? 1 : In.dim, bx = (e) => e === "amber" ? In.phases : 1;
function wx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const kx = Object.keys(Ly), Ue = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, zt = ([e, t], n) => e + n() * (t - e);
function xx(e) {
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
function $x(e) {
  const t = Math.floor(e / _a.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + _a.gap)), up: e % _a.high * (rt.height - rt.top) };
}
const Ny = (e, t, n) => He({ moment: "unit", memory: e, now: t }, n) !== null, Dy = { after: 5 }, jy = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Mr(t).isBuild());
function Mx(e, t, n) {
  const a = jy(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Dy.after ? s : null;
}
function Sx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Ny(n, a, s) } : null;
}
const Po = { ahead: 140, up: 70 };
function _x(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Po.ahead, y: a - Po.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ea = { least: 4e3, most: 1e4 }, Py = (e) => Ea.least + e() * (Ea.most - Ea.least), yt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function Ex(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Py(t);
    if (n.length >= yt.most || t() >= yt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (yt.at[0] + t() * (yt.at[1] - yt.at[0]));
    n.push({ from: o, to: o + yt.ms }), a = o + yt.ms;
  }
}
const Ax = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), Cx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Or = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), Ox = new Set(ta.filter((e) => Or.has(e.when.moment) && e.type === "clip").map((e) => e.name)), qy = (e) => e.some((t) => t.state === "built"), Tx = (e, t) => qy(t) ? e.filter((n) => !Or.has(n.beat)) : e, dt = { reach: 40, room: 6 }, Fy = (e, t) => t <= e - dt.reach + 2, Rx = (e, t, n) => Fy(e, n) ? t - dt.reach : e - dt.reach - dt.room, Ix = (e, t, n, a) => a > 0 && t < e && t + dt.reach >= e - 2 ? Math.min(n, Math.max(e, t + dt.reach)) : e, Aa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, Bx = (e) => zt(e() < Aa.longShare ? Aa.long : Aa.short, e), Wy = 2 * rt.width;
function Lx(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Wy ? o : e + (o - e + s / 2) % s;
}
const Hy = 60, Nx = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Hy, qo = "[data-figure-home]", dn = () => {
  var t;
  const e = document.querySelector(qo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(qo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Uy = "[data-figure-docked-bars]", zy = "[data-figure-chat-foot]", Vy = [0.85, 0.6, 0.35, 0.15], Gy = ["question", "waiting", "suggestion"], Dx = (e, t) => Gy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function jx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Ky = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Yy = "[data-figure-newest]";
function Tr() {
  var a, s;
  const e = (a = dn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Yy), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function sn(e, t, n = Tr()) {
  if (!e || !n) return !0;
  const a = at(e, t), s = aa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Oe.top * t.size, bottom: a.top + Oe.bottom * t.size }, l = kt.gap;
  return !na(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function Px(e, t, n, a = Tr()) {
  if (!a || sn(t, e, a)) return null;
  const s = aa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Ct(), i = t.posture === "stand" ? Ts * e.size : Pr * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - kt.gap - l, a.right + kt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && sn(m, e, a) && Mb(m, e)).sort((m, g) => Math.abs(m.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const Ca = 0.26, Rr = 0.54, Jy = 1.25 / 5.4, fn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ca, travels: "stand" },
  lounge: { drop: Ca, travels: "stand" },
  composed: { drop: Ca, travels: "stand" },
  hang: { drop: Rr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, qx = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Jy * Math.cos(t * Math.PI / 180),
  y: 1 - n - Rr
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Zy = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Fx = (e, t) => (e === "sit" ? Zy.has(t) : Yt.has(e)) ? e : "stand";
function Wx(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const Hx = 0.25, Ux = (e, t) => Yt.has(e) && fn[t].drop === 0, Ir = 2, Xy = 90, Qy = 180, eb = 140, tb = 280, nb = 420, ab = 0.25, sb = 290, ob = 600, lb = "cubic-bezier(0.2, 0.7, 0.4, 1)", rb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Oa = 5;
function Hn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Oa) return null;
  (l || r) && (o = Math.max(o, Ir));
  const g = o > 1, y = Math.abs(t.x - e.x), k = y < Oa ? 0 : y / (Xy * o) * 1e3, b = Math.min(k, g ? eb : Qy), _ = Math.abs(t.y - e.y), j = t.y < e.y, J = j && !m && $y(_, n, i, u, d, f), D = j ? nb + Math.min(_, 400) * ab : Math.sqrt(2 * _ / _s) * 1e3, w = {
    x: t.x,
    y: t.y,
    ms: _ > Oa ? J ? ob : D : 0,
    lead: J ? sb : j ? tb : 0,
    easing: j ? lb : rb,
    hopping: !0,
    clip: J ? "backflip" : j ? "jump" : "fall"
  }, $ = { x: t.x, y: t.y, ms: k + b, lead: 0, easing: "linear", ramp: b, ...g ? { clip: "run" } : {} }, S = m ? ib(t, n) : w, C = j && !a ? [{ ...$, y: e.y }, S] : [{ ...w, x: e.x }, $];
  return { way: Math.sign(t.x - e.x) || 1, legs: C, lands: !s, pace: o, running: g };
}
const ib = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), cb = (e, t) => e.postures.includes(t) ? t : e.postures[0], zx = (e, t, n) => e.posture === "walk" && n ? "walk" : cb(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
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
function Vx(e, t, n = Ct()) {
  const a = at(e, t);
  return a.left >= n.left + Fo && a.right <= n.right - Fo;
}
function Os(e, t, n = Ct()) {
  const a = at(e, t), s = a.right - a.left, o = aa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - _n && r <= n.right + _n && a.top >= n.top - _n && i <= n.bottom + _n;
}
const Un = [0.35, 0.5, 0.65], zn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Oe = { left: Un[0], right: Un.at(-1), top: zn[0], bottom: zn.at(-1) }, ub = 0.24;
function aa(e) {
  if (e.posture === "stand") return { left: Oe.left, right: Oe.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + ub * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Oe.left, t), right: Math.max(Oe.right, t) };
}
function db(e, { size: t }, n = Ct()) {
  const a = aa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Ts = (Oe.right - Oe.left) / 2 + 0.08;
function Gx(e, t) {
  return e === "hang" ? Oe : { ...Oe, bottom: Math.min(Oe.bottom, 1 - t - fn[e].drop) };
}
const fb = "[data-figure-agent]";
function Br(e, t, n = "", a = "") {
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
const Lr = (e) => zn.flatMap(
  (t) => Un.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Rs(e, t, n = "") {
  if (!sn(e, t)) return Un.length * zn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Ky)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && na(s, i) && Cs(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return Lr(s).filter(([r, i]) => l(r, i) || Br(r, i, n)).length;
}
function hb(e, t) {
  const n = at(e, t);
  return Lr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Br(a, s, "", fb)).length;
}
const Wo = 4;
function Kx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Wo; o <= s; o += Wo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!hb(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = Ct(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Os(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Rs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Nr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), mb = [0.5, 0.25, 0.75], pb = (e) => Nr(e.getBoundingClientRect(), mb), Dr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, gb = Ts, vb = (e, t, { size: n }, a = gb) => jr(e, Dr[t], a * n, "stand");
function jr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const yb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Pr = 0.1, bb = (e, t, { size: n }) => jr(e, yb[t], Pr * n, "sit"), wb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ta = 60;
function Yx(e, t) {
  const n = wb(t);
  return !e.aside || Math.abs(n) >= Ta ? t : n < 0 ? 360 - Ta : Ta;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, kb = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function Jx(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = kb(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? xb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function xb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function Zx(e, t) {
  const { element: n, edge: a } = sa(), s = ["left", "right"].map((r) => hn(bb(a, r, e), e)).filter((r) => n && Os(r, e) && !Rs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function Xx(e, t, { size: n }) {
  const a = (Oe.right - Oe.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - qr } : e;
}
const qr = 7;
function Fr() {
  const e = [...document.querySelectorAll(By)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function $b(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Oe.left * a, right: n.left + Oe.right * a, top: n.top + Oe.top * a, bottom: n.bottom };
}
function Mb(e, t) {
  const n = Fr();
  return !n || !na($b(e, t), n);
}
const Sb = 4;
function sa() {
  const e = mn(), t = Fr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Sb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - qr - n, 0) } };
}
const Qx = ({ size: e, below: t }) => (1 - t) * e;
function hn(e, t) {
  const n = Ct(), { size: a, below: s } = t, o = fn[e.posture].drop * a;
  return { ...db(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const os = (e, t) => Object.keys(Dr).map((n) => hn(vb(e, n, t), t)), Is = (e, t) => Nr(e, Vy).map((n) => hn(n, t)), Wr = (e, t, n) => on(e, t, n) ?? e[0];
function e$(e, t) {
  const { element: n, edge: a } = sa();
  return { ...Wr(os(a, e), e, t), view: null, on: n };
}
function t$(e, t, n, a) {
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
  const e = dn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Uy);
  if (!t) return { ...oa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Ho = { within: 2 };
function n$(e) {
  const { element: t, docked: n, edge: a } = mn();
  if (!n || e.on !== t) return !0;
  const s = oa().edge;
  return a.left > s.left + Ho.within || a.left + a.width < s.left + s.width - Ho.within;
}
const _b = "[data-figure-closing]";
function a$() {
  var n;
  const { element: e, docked: t } = mn();
  return t && !!((n = e.firstElementChild) != null && n.matches(_b));
}
const Hr = "[data-figure-progress]";
function s$(e) {
  const t = e.querySelector(Hr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function o$(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Eb = { across: 300, above: 380, below: 60 };
function l$(e) {
  const { across: t, above: n, below: a } = Eb;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Ab(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Ab = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Ur = "[data-figure-bar]", ls = { back: 144, along: 0.4 };
function r$(e) {
  const { element: t, docked: n, edge: a } = mn(), s = n ? t.querySelector(Ur) : null;
  if (!(s != null && s.querySelector(Hr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...hn({ x: o - ls.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function i$(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < ls.along * a.size ? t.x + ls.along * a.size : e.x, y: e.y, behind: !0 };
}
function c$(e) {
  const t = e.querySelector(Ur), n = t == null ? void 0 : t.firstElementChild;
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
function u$(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = oa(), i = n === null ? Cb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : hn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Cb(e, t, n, a, s) {
  const o = Is(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - dt.reach - dt.room >= l);
  return on(r.length ? r : o, t, n);
}
const Ob = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function d$(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Ir));
  const g = (J) => {
    const D = at(J, n, fn[J.posture].travels);
    return { x: D.left, y: D.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return Tb(g(e), g(t), g({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [k, ...b] = [e, ...i, t].map(g), _ = Hn(k, b[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), j = b.slice(1).map((J, D) => {
    var w;
    return (w = Hn(b[D], J, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : w.legs.find(($) => $.hopping);
  });
  return _ && { ..._, legs: [..._.legs, ...j.filter(Boolean)] };
}
function Tb(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Ob.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Hn(e, n, o.size, { pace: l }) : Hn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function f$(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function h$(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(pb(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = sa();
  return { ...Wr(Is(s, t), t, n), view: null, on: a };
}
const Rb = "[data-figure-bubble]", Ib = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), zr = 0;
const qt = () => Zt, Ra = /* @__PURE__ */ new WeakMap();
let Bb = 0;
function Bs(e) {
  return Ra.has(e) || Ra.set(e, `floor-${++Bb}`), Ra.get(e);
}
const Lb = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Nb = () => {
  var e, t;
  return ((t = (e = dn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Db(e, t) {
  var a;
  const n = (a = e.querySelector(zy)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function jb(e, t) {
  const n = e && Db(e, t), a = e ? [...e.querySelectorAll(Rb)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Lb(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Bs(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Pb = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Ib ? (t.top - a.top) / s * 1e3 : 0;
};
function Vr(e = Zt, t = performance.now()) {
  const n = Ct(), a = Nb(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = mn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = oa();
  return u.element && i.push({ id: Bs(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...jb(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: Pb(e, d, t) }))) });
}
const rs = /* @__PURE__ */ new Set();
function qb(e) {
  return rs.add(e), () => rs.delete(e);
}
function Fb() {
  Gr();
  const e = () => {
    zr = requestAnimationFrame(e), !document.hidden && (Zt = Vr(Zt), rs.forEach((t) => t(Zt)));
  };
  e();
}
function Gr() {
  cancelAnimationFrame(zr);
}
const Ls = 5, Wb = 56, Hb = { share: 0.6 }, Ub = (e) => -Math.sqrt(2 * _s * Hb.share * e), Nt = (e, t) => e.find((n) => n.id === t) ?? null;
function m$(e, t = Vr().floors) {
  const n = Nt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Bs(e.on) : null, o = s && Nt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Kr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = qt().floors) {
  const u = Nt(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || zb(u, d, o)) && Vb(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Ns = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, zb = (e, t, n) => !Ns({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function p$(e, t = qt().floors) {
  if (!Ns(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ls && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Vb(e, t, n = qt().floors) {
  const a = Nt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Os(e, t);
}
function g$(e, t, n, a = qt().floors) {
  const s = Kr(e, n, a);
  if (!e.home) return Gb(e, t, s, a);
  if (!s) return null;
  const o = Nt(a, "home"), l = s.y - t.y, r = l > Ls ? "dropping" : -l > Wb ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function Gb(e, t, n, a) {
  const s = n ? Nt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Ub(e.risen) };
  if (!n) return null;
  if (Ns(t) && n.y - t.y > Ls) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function v$(e, t, n) {
  const a = Ts * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function y$(e, t, n, a = qt().floors) {
  const s = t && Kr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Kb = ["data-type"], Yb = { class: "figure-floor-name" }, Jb = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      v("span", Yb, x(e.floor.type), 1)
    ], 12, Kb));
  }
}, Zb = /* @__PURE__ */ K(Jb, [["__scopeId", "data-v-4e0f1e2e"]]), Xb = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Qb = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ve(qt().floors);
    let n = () => {
    };
    return Le(() => {
      n = qb((a) => t.value = a.floors), Fb();
    }), Be(() => {
      n(), Gr();
    }), (a, s) => (c(), h("div", Xb, [
      (c(!0), h(V, null, te(t.value, (o) => (c(), H(Zb, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, b$ = /* @__PURE__ */ K(Qb, [["__scopeId", "data-v-e519168b"]]), Ia = (e) => typeof e == "number" ? e : Date.parse(e);
function w$(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ia(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ia(s.row.created_at) - Ia(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const ew = 3, Ba = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function tw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ba[n.grouping]) == null ? void 0 : a.call(Ba, e.row, n)) || "";
}
function nw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function k$(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= ew ? [nw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = tw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const aw = 50, sw = "refresh";
function x$({ state: e = () => ({}), tab: t = () => "" } = {}) {
  const n = nt(), a = Yn({}), s = /* @__PURE__ */ new Set(), o = [];
  let l = {}, r = 0;
  const i = (k) => a[k] ?? (a[k] = { value: void 0, failure: "", loaded: !1 }), u = (k) => !l[k].tab || l[k].tab === t(), d = () => t() ? { ...e(), tab: t() } : e();
  async function f({ only: k = [] } = {}) {
    const b = await n.readKeys({ only: k, state: d() });
    return b.ok ? (Object.entries(b.value.keys).forEach(([_, j]) => {
      i(_).failure = j.ok ? "" : j.error, i(_).loaded = !0, j.ok && (i(_).value = j.value);
    }), y(b.value.declared), !0) : (b.failure !== "cancelled" && k.forEach((_) => i(_).failure = b.error), !1);
  }
  function m(k) {
    k.forEach((b) => s.add(b)), clearTimeout(r), r = setTimeout(() => {
      const b = [...s];
      s.clear(), b.length && f({ only: b });
    }, aw);
  }
  function g(k) {
    const b = Object.keys(l).filter((_) => k.event === sw || l[_].events.some((j) => ms(j, k.event)));
    b.filter((_) => !u(_)).forEach((_) => i(_).loaded = !1), m(b.filter(u));
  }
  function y(k) {
    if (Object.keys(l).length) return;
    l = k;
    const b = [...new Set(Object.values(k).flatMap((_) => _.events))];
    b.length && n.follow(b, g), Object.entries(k).filter(([, _]) => _.every_seconds > 0).forEach(([_, j]) => {
      o.push(setInterval(() => {
        n.visible.value && u(_) && m([_]);
      }, j.every_seconds * 1e3));
    });
  }
  return me(t, () => {
    const k = Object.keys(l).filter((b) => u(b) && !i(b).loaded);
    k.length && f({ only: k });
  }), Be(() => {
    clearTimeout(r), o.forEach(clearInterval);
  }), f(), { data: a, reload: f };
}
const ow = {
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
}, lw = 1e3;
function rw() {
  const e = R(Date.now()), t = setInterval(() => e.value = Date.now(), lw);
  return _t(() => clearInterval(t)), e;
}
const iw = ["datetime", "title"], la = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = rw(), a = B(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, x(P(er)(e.at, P(n))), 9, iw));
  }
};
function $$(e) {
  const t = nt(), n = t.option("row"), a = R(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), me(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function cw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const M$ = (e) => (t) => t.filter((n) => n.id !== e), S$ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), _$ = (e) => (t) => [...t, e], E$ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function A$(e, t = {}) {
  const n = nt(), a = R(null), s = R("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function C$(e) {
  const t = nt(), n = R("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const En = /* @__PURE__ */ new Map();
function uw(e, t) {
  if (En.has(e)) return En.get(e);
  const n = t().finally(() => En.delete(e));
  return En.set(e, n), n;
}
function O$() {
  const e = nt(), t = R(null), n = R("");
  async function a() {
    const s = await uw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const dw = { class: "cards-page" }, fw = { class: "cards-bar" }, hw = { class: "cards-count" }, mw = { class: "cards" }, pw = {
  key: 1,
  class: "cards-note"
}, gw = {
  key: 2,
  class: "cards-note"
}, vw = ["data-row", "onClick"], yw = { class: "card-head" }, bw = { class: "card-title" }, ww = { class: "card-foot" }, kw = {
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
    return (a, s) => (c(), h("div", dw, [
      v("div", fw, [
        v("span", hw, x(e.rows.length) + " " + x(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        N(de, Ge({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: q(() => [
            N(ye, {
              name: "plus",
              size: 12
            }),
            Q(" New " + x(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      v("div", mw, [
        e.loaded ? e.failure ? (c(), h("p", pw, x(e.failure), 1)) : e.rows.length ? A("", !0) : (c(), h("p", gw, "No " + x(e.noun) + "s yet", 1)) : (c(), H(Et, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(V, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          v("span", yw, [
            N(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            Q(" " + x(e.head(o)), 1),
            N(la, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          v("span", bw, x(e.title(o)), 1),
          v("span", ww, x(e.foot(o)), 1)
        ], 8, vw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, T$ = /* @__PURE__ */ K(kw, [["__scopeId", "data-v-990e6b37"]]), Uo = "newest";
function R$(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = Ae(Te, null)) == null ? void 0 : u.search, s = R(""), o = R(Uo), l = R("all"), r = B(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => cw(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Uo ? f : [...f].sort((m, g) => t(m).localeCompare(t(g)));
  }), i = B(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const xw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, $w = 40, Mw = "top", Sw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Ae(Te, null)) == null ? void 0 : f.autoScroll, s = B(() => a === Mw), o = R(null), l = R(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= $w;
    }
    return me(() => n.rowCount, async () => {
      await ht(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, g) => (c(), h("div", xw, [
      v("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      N(Dt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: q(() => [
          et(v("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            N(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            g[0] || (g[0] = Q(" Newest ", -1))
          ], 512), [
            [Qo, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, I$ = /* @__PURE__ */ K(Sw, [["__scopeId", "data-v-3accb764"]]), _w = ["aria-selected", "data-tab", "onClick"], Ew = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Aw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ae(Te, null), o = B(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = R(null), r = R({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var y;
      const g = (y = l.value) == null ? void 0 : y.querySelector(".inner-tab.on");
      if (!g) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: g.offsetLeft, width: g.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const d = () => ht(() => u(!0));
    let f = null;
    return Le(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), me(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), me(() => n.answer, d, { deep: !0 }), (m, g) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(V, null, te(o.value, (y) => {
        var k, b;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((k = e.active) == null ? void 0 : k.key) === y.key }]),
          "aria-selected": ((b = e.active) == null ? void 0 : b.key) === y.key,
          "data-tab": y.key,
          onClick: (_) => a("choose", y)
        }, [
          Q(x(y.label) + " ", 1),
          i(y) ? (c(), h("span", Ew, x(e.answer[y.count_field]), 1)) : A("", !0)
        ], 10, _w);
      }), 128)),
      v("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, B$ = /* @__PURE__ */ K(Aw, [["__scopeId", "data-v-63fcd326"]]), Cw = {
  class: "tab-body",
  "data-tab-body": ""
}, Ow = { "data-tab-content": "" }, Tw = {
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
    }), (s, o) => (c(), h("div", Cw, [
      n.value ? (c(), H(Et, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : A("", !0),
      et(v("div", Ow, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Qo, !n.value]
      ])
    ]));
  }
}, L$ = /* @__PURE__ */ K(Tw, [["__scopeId", "data-v-63876533"]]), Rw = {}, Iw = { class: "menu-label" };
function Bw(e, t) {
  return c(), h("span", Iw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const is = /* @__PURE__ */ K(Rw, [["render", Bw], ["__scopeId", "data-v-aa955b3e"]]), Lw = {
  class: "search-bar",
  "data-search-bar": ""
}, Nw = { class: "search-bar-control" }, Dw = ["value", "placeholder", "aria-label"], jw = ["aria-expanded"], Pw = {
  key: 0,
  "data-menu-count": ""
}, qw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var _;
    const a = e, s = n, o = ui(), l = ((_ = Ae(Te, null)) == null ? void 0 : _.search) ?? {}, r = B(() => l.placeholder || a.placeholder), i = l.context ?? [], u = R(null), d = R(null), f = R([]), m = B(() => f.value.length ? f.value[f.value.length - 1].next : i), g = B(() => !!o.menu || i.length > 0), y = (j) => {
      f.value = [], d.value = d.value ? null : j.currentTarget;
    };
    function k(j) {
      if (j.next.length) {
        f.value = [...f.value, j];
        return;
      }
      d.value = null, s("pick", j.click);
    }
    function b() {
      var j;
      s("update:modelValue", ""), (j = u.value) == null || j.focus();
    }
    return t({ focus: () => {
      var j;
      return (j = u.value) == null ? void 0 : j.focus();
    } }), (j, J) => {
      var D;
      return c(), h("div", Lw, [
        v("div", Nw, [
          N(ye, {
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
            onInput: J[0] || (J[0] = (w) => s("update:modelValue", w.target.value)),
            onKeydown: Xt(b, ["esc"])
          }, null, 40, Dw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: b
          }, [
            N(ye, {
              name: "close",
              size: 12
            })
          ])) : A("", !0),
          g.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: y
          }, [
            e.menuCount ? (c(), h("span", Pw, x(e.menuCount), 1)) : A("", !0),
            N(ye, {
              name: "caret",
              size: 12
            })
          ], 8, jw)) : A("", !0)
        ]),
        (D = P(l).button) != null && D.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: J[1] || (J[1] = (w) => s("pick", P(l).button.click))
        }, x(P(l).button.title), 1)) : A("", !0),
        ue(j.$slots, "default", {}, void 0, !0),
        d.value ? (c(), H(Zn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: J[3] || (J[3] = xe(() => {
          }, ["stop"])),
          onClose: J[4] || (J[4] = (w) => d.value = null)
        }, {
          default: q(() => [
            f.value.length ? (c(), H($t, {
              key: 0,
              "data-search-back": "",
              onClick: J[2] || (J[2] = (w) => f.value = f.value.slice(0, -1))
            }, {
              default: q(() => [
                Q("‹ " + x(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (c(!0), h(V, null, te(m.value, (w) => (c(), H($t, {
              key: w.title,
              description: w.subtext,
              "data-search-entry": w.title,
              onClick: ($) => k(w)
            }, {
              default: q(() => [
                Q(x(w.title) + x(w.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? A("", !0) : ue(j.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, Fw = /* @__PURE__ */ K(qw, [["__scopeId", "data-v-45374bed"]]), Ww = {
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
    return (o, l) => (c(), H(Fw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: q(() => [
        N(is, null, {
          default: q(() => [...l[2] || (l[2] = [
            Q("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(V, null, te(a, (r) => N($t, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: q(() => [
            Q(x(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(V, { key: 0 }, [
          N(is, null, {
            default: q(() => [...l[3] || (l[3] = [
              Q("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(V, null, te(s, (r) => N($t, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: q(() => [
              Q(x(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : A("", !0)
      ]),
      default: q(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, N$ = /* @__PURE__ */ K(Ww, [["__scopeId", "data-v-dab0064d"]]);
function D$() {
  const e = R(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const j$ = (e) => import(
  /* @vite-ignore */
  e
), Hw = 86400, cs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Uw(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((cs(t) - cs(e)) / Hw);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function P$(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = cs(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Uw(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const La = 280, Na = 240, Da = 120, zw = 6, Vw = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Gw(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Yr(e, t) {
  const n = Math.max(0, Gw(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Kw(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Vw}px)` }), e.offsetHeight, e.style.transition = `height ${La}ms ${ln}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Yr(t, e));
    const m = s() - r;
    if (!i && m >= La && (i = !0, e.style.transition = `opacity ${Na}ms ease-out, transform ${Na}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < La + Na) return a(f);
    d();
  };
  return a(f), d;
}
function q$(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${zw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Da}ms ease-out, transform ${Da}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Yr(t, e)), s() - l < Da) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const Yw = 140, An = 220, zo = 5;
function F$({ gap: e = Yw, later: t = setTimeout } = {}) {
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
  const u = (d, f, m, g = Kw) => {
    if (l || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: g, display: d.style.display || "" };
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
function W$(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${An}ms ${ln}, opacity ${An}ms ease-in, margin ${An}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, An);
}
const Jr = "chat.pins.minimised", Bn = R(Ln(Jr, !1));
function Vo(e) {
  Bn.value = e, ws(Jr, e);
}
function Jw(e) {
  const t = B(() => e()), n = B(() => Bn.value ? [] : e()), a = () => Vo(!Bn.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => Mt(o) > s).length,
    (o, l) => o > l && Vo(!1)
  ), { pins: t, visible: n, minimised: Bn, toggle: a };
}
const Zw = ["title"], Xw = {
  key: 0,
  class: "pins-count"
}, Qw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Jw(() => t.pinRows);
    return (o, l) => P(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: P(a), inline: e.inline }]),
      title: P(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => P(s) && P(s)(...r), ["stop"]))
    }, [
      N(ye, {
        name: P(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      P(a) ? (c(), h("span", Xw, x(P(n).length), 1)) : A("", !0)
    ], 10, Zw)) : A("", !0);
  }
}, H$ = /* @__PURE__ */ K(Qw, [["__scopeId", "data-v-d073c504"]]), ek = ["title"], tk = ["title"], nk = { class: "diff-card-dir" }, ak = { class: "diff-card-name" }, sk = ["title"], ok = ["title"], lk = {
  key: 0,
  class: "diff-card-note"
}, rk = ["href"], ik = ["src", "alt"], ck = { class: "diff-card-rows" }, uk = { class: "diff-row-num" }, dk = { class: "diff-row-sign" }, fk = { class: "diff-row-code" }, hk = {
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
    function o(I) {
      (I.metaKey || I.ctrlKey) && (I.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = B(() => n.path.lastIndexOf("/") + 1), u = B(() => n.path.slice(0, i.value)), d = B(() => n.path.slice(i.value)), f = B(() => n.change === "deleted"), m = B(() => l[n.change]), g = B(() => new Set(n.rows.filter((I) => I.line_type === "add").map((I) => I.line))), y = R("after"), k = B(() => y.value === "before" ? n.whole.old : n.whole.text), b = B(() => n.whole && n.whole.text !== void 0 ? k.value.split(`
`).map((I, M) => ({ line_type: y.value === "after" && g.value.has(M + 1) ? "add" : "ctx", line: M + 1, text: I })) : n.rows.filter(
      (I) => !(n.editsOnly && ["ctx", "fold"].includes(I.line_type)) && !(n.hideRemovals && I.line_type === "del")
    )), _ = R(!1), j = B(() => n.lines && !_.value && !n.whole), J = B(() => j.value ? b.value.slice(0, n.lines) : b.value), D = B(() => b.value.length - J.value.length), w = (I) => I.line === null || I.line_type === "del" ? "" : I.line, $ = (I) => I.line_type === "fold" ? I.hidden ? `⋯ ${I.hidden} lines` : "⋯" : I.text, S = R(null), C = R(null);
    let E = null;
    return Le(() => {
      if (!C.value) return;
      let I = !0;
      E = new ResizeObserver(() => {
        !S.value || !C.value || (S.value.style.transition = I ? "none" : "", S.value.style.height = `${C.value.offsetHeight}px`, I = !1);
      }), E.observe(C.value);
    }), Be(() => E && E.disconnect()), (I, M) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      v("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: M[2] || (M[2] = (p) => !f.value && a("fold"))
      }, [
        v("span", {
          class: "diff-card-path",
          title: `${e.path} · ${P(s)}-click to open it`,
          onClick: o
        }, [
          v("span", nk, x(u.value), 1),
          v("span", ak, x(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, x(m.value), 3)) : A("", !0)
        ], 8, tk),
        v("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + x(e.added), 3),
        v("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + x(e.removed), 3),
        N(la, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: M[0] || (M[0] = xe((p) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, x(y.value === "after" ? "After" : "Before"), 9, sk)) : A("", !0),
        f.value ? A("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: M[1] || (M[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          N(ye, {
            name: "file",
            size: 12
          })
        ], 10, ok))
      ], 8, ek),
      e.whole && e.whole.error ? (c(), h("p", lk, x(e.whole.error), 1)) : A("", !0),
      !f.value && !e.folded ? (c(), h(V, { key: 1 }, [
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
          }, null, 8, ik)
        ], 8, rk)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: S,
          class: "diff-card-grow"
        }, [
          v("div", {
            ref_key: "body",
            ref: C,
            class: "diff-card-diff"
          }, [
            v("div", ck, [
              (c(!0), h(V, null, te(J.value, (p, O) => (c(), h("div", {
                key: O,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                v("span", uk, x(w(p)), 1),
                v("span", dk, x(r[p.line_type]), 1),
                v("span", fk, x($(p)), 1)
              ], 2))), 128)),
              D.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: M[3] || (M[3] = xe((p) => _.value = !0, ["stop"]))
              }, x(D.value) + " more " + x(D.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, U$ = /* @__PURE__ */ K(hk, [["__scopeId", "data-v-23581cbb"]]), mk = {
  key: 0,
  class: "window-failure"
}, pk = {
  __name: "DocumentWindow",
  props: { line: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = nt(), a = R(null);
    async function s() {
      a.value = await n.read(t.line);
    }
    return n.follow(["*.*"], ul(s, ow.openPanel)), s(), (o, l) => a.value && !a.value.ok ? (c(), h("p", mk, x(a.value.error), 1)) : a.value ? (c(), H(rm, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : A("", !0);
  }
}, gk = {
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
    const n = t, a = e, s = B(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = B(() => s.value && { render: () => Gn(pk, { line: s.value.line }) }), l = R(null), r = B(() => {
      var m, g;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), i = B(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = B(
      () => {
        var m, g;
        return l.value ? Ng(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
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
        var m, g;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((g = s.value) == null ? void 0 : g.line);
      },
      async () => {
        await d(), u.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, g) => {
      var y, k;
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), H(Ss, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((k = s.value) == null ? void 0 : k.shows) === "one-agent" && e.agent === null ? (c(), H(Qt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), H(Kt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), H(ir, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = (b, _) => n("option", b, _))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), H(rr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = (b, _) => n("option", b, _))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), H(Kt, {
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
        onOption: g[2] || (g[2] = (b, _) => n("option", b, _))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), H(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (b) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, vk = ["data-section"], yk = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ae(iu, null), a = B(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = B(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(V, null, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      N(gk, {
        name: r.name,
        catalogue: P(n).catalogue,
        subscriptions: P(n).subscriptions,
        environment: P(n).environment,
        prompts: P(n).prompts,
        "shell-read": P(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, vk))), 128));
  }
}, bk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: q(() => [
        N(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, wk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, kk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, xk = { class: "ask-text" }, $k = ["placeholder", "aria-label"], Mk = ["placeholder", "aria-label"], Sk = {
  key: 3,
  class: "moves"
}, _k = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = B(() => L0(a.noun, a.row)), l = R(""), r = R(null), i = R(""), u = R("");
    me(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(g, y = "") {
      const k = await a.read([g.noun ?? a.noun, g.word, String(a.id), ...g.flag ? [g.flag, y] : g.positional ? [y] : [], ...g.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = k.ok ? "" : k.error, k.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (g) => g.confirm ? r.value = g : g.said ? d(g, g.said) : g.flag || g.positional ? (r.value = g, i.value = "") : d(g), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (g, y) => {
      var k;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        l.value ? (c(), h("p", wk, x(l.value), 1)) : A("", !0),
        (k = r.value) != null && k.confirm ? (c(), h("div", kk, [
          v("span", xk, x(r.value.confirm), 1),
          N(de, {
            small: "",
            variant: r.value.danger ? "ghost" : "primary",
            bordered: r.value.danger,
            class: Z({ danger: r.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: y[0] || (y[0] = (b) => d(r.value))
          }, {
            default: q(() => [
              Q(x(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["variant", "bordered", "class"]),
          N(de, {
            small: "",
            variant: "ghost",
            onClick: y[1] || (y[1] = (b) => r.value = null)
          }, {
            default: q(() => [...y[7] || (y[7] = [
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
          et(v("input", {
            "onUpdate:modelValue": y[2] || (y[2] = (b) => i.value = b),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: y[3] || (y[3] = Xt(xe((b) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, $k), [
            [Fa, i.value]
          ]),
          r.value.opener ? et((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": y[4] || (y[4] = (b) => u.value = b),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: y[5] || (y[5] = Xt(xe((b) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, Mk)), [
            [Fa, u.value]
          ]) : A("", !0),
          N(de, {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: q(() => [
              Q(x(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          N(de, {
            small: "",
            variant: "ghost",
            onClick: y[6] || (y[6] = (b) => r.value = null)
          }, {
            default: q(() => [...y[8] || (y[8] = [
              Q("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Sk, [
          (c(!0), h(V, null, te(o.value, (b) => (c(), H(de, {
            key: b.word,
            small: !b.bordered,
            bordered: b.bordered,
            icon: b.icon,
            variant: b.main ? "primary" : "ghost",
            class: Z({ danger: b.danger }),
            "data-move": b.word,
            onClick: (_) => f(b)
          }, {
            default: q(() => [
              Q(x(b.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : A("", !0);
    };
  }
}, Ek = /* @__PURE__ */ K(_k, [["__scopeId", "data-v-0262f48f"]]), Ak = /* @__PURE__ */ new Set(["completed", "cancelled"]), Ck = (e) => Ak.has(e), Vn = (e) => Ck(e) ? "done" : e, Ok = { class: "facts" }, Tk = { class: "fact wide" }, Rk = ["title"], Ik = {
  key: 1,
  class: "fact-value"
}, Bk = {
  key: 0,
  class: "fact"
}, Lk = { class: "fact-value" }, Nk = { class: "fact" }, Dk = { class: "fact-label" }, jk = ["title"], Pk = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, qk = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Fk = {
  key: 2,
  class: "fact"
}, Wk = { class: "fact-value" }, Hk = { class: "fact wide" }, Uk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, zk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Pn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return c(), h("div", Ok, [
        v("div", Tk, [
          l[3] || (l[3] = v("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: l[0] || (l[0] = (u) => P(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + x(e.place.plan_id) + ": " + x(e.place.plan_title), 9, Rk)) : (c(), h("span", Ik, "Not in a plan"))
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Bk, [
          l[4] || (l[4] = v("span", { class: "fact-label" }, "Phase", -1)),
          v("span", Lk, x(e.place.phase_number) + " of " + x(e.place.phase_total) + ": " + x(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.helper_id ? (c(), h(V, { key: 1 }, [
          v("div", Nk, [
            v("span", Dk, x(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            v("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[1] || (l[1] = (u) => P(qe)(`agents:${e.task.helper_id}`))
            }, x(e.task.helper_name), 9, jk)
          ]),
          P(s).has(e.task.state) ? (c(), h("p", Pk, x(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", qk, x(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : A("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", Fk, [
          l[5] || (l[5] = v("span", { class: "fact-label" }, "Assigned to", -1)),
          v("span", Wk, "Agent " + x(e.task.holder_id), 1)
        ])) : A("", !0),
        v("div", Hk, [
          l[6] || (l[6] = v("span", { class: "fact-label" }, "Priority", -1)),
          N(Xn, {
            options: P(n),
            value: String(P(nr)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[2] || (l[2] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", Uk, x(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, Vk = /* @__PURE__ */ K(zk, [["__scopeId", "data-v-fa2fd03f"]]), Gk = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, Kk = ["datetime"], Yk = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", Gk, [
      n[0] || (n[0] = v("h3", null, "Block history", -1)),
      (c(!0), h(V, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        v("time", {
          datetime: a.created_at
        }, x(new Date(a.created_at).toLocaleString()), 9, Kk),
        v("p", null, x(a.reason), 1)
      ]))), 128))
    ])) : A("", !0);
  }
}, Jk = /* @__PURE__ */ K(Yk, [["__scopeId", "data-v-b41f213b"]]), Zk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Xk = { ...Zk, done: "Completed" }, Qk = { class: "task-status-icon" }, e2 = ["width", "height", "aria-label"], t2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = B(() => pl("task", Vn(t.status))), a = B(() => n.value === "testing" ? "started" : n.value), s = B(() => Xk[t.status] ?? ml("task", t.status));
    return (o, l) => (c(), h("span", Qk, [
      N(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: q(() => [
          (c(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            N(jt, { value: a.value }, {
              blocked: q(() => [...l[0] || (l[0] = [
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
              done: q(() => [...l[1] || (l[1] = [
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
              started: q(() => [...l[2] || (l[2] = [
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
              asked: q(() => [...l[3] || (l[3] = [
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
              paused: q(() => [...l[4] || (l[4] = [
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
              planned: q(() => [...l[5] || (l[5] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: q(() => [...l[6] || (l[6] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, e2))
        ]),
        _: 1
      })
    ]));
  }
}, Zr = /* @__PURE__ */ K(t2, [["__scopeId", "data-v-ae24a63f"]]), n2 = {
  class: "part",
  "data-resource-waits": ""
}, a2 = ["onClick"], s2 = { class: "wait-id" }, o2 = { class: "wait-title" }, l2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", n2, [
      v("h4", null, x(e.title), 1),
      (c(!0), h(V, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        N(Zr, {
          status: P(Vn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        v("span", s2, x(o.id), 1),
        v("span", o2, x(o.title), 1)
      ], 8, a2))), 128))
    ]));
  }
}, Go = /* @__PURE__ */ K(l2, [["__scopeId", "data-v-8fb2e251"]]), r2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, i2 = { class: "text" }, c2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, u2 = 180, d2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = R(!1), l = B(() => a.task.waits.filter((i) => !n.has(i.state))), r = B(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(V, null, [
      l.value.length ? (c(), H(Go, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", r2, [
        u[3] || (u[3] = v("h4", null, "How it was done", -1)),
        v("p", i2, x(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (c(), h("section", c2, [
        u[4] || (u[4] = v("h4", null, "The brief", -1)),
        v("p", {
          class: Z(["text", { clamped: !o.value }])
        }, x(e.task.brief), 3),
        e.task.brief.length > u2 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0),
      r.value.length ? (c(), H(Go, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0)
    ], 64));
  }
}, f2 = /* @__PURE__ */ K(d2, [["__scopeId", "data-v-4a3f1e79"]]), h2 = {
  class: "task-details",
  "data-task-details": ""
}, m2 = { class: "since" }, p2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, g2 = { class: "text" }, v2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, y2 = {
  key: 1,
  class: "note"
}, b2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, w2 = { class: "text" }, k2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", h2, [
        v("div", {
          class: Z(["state-line", P(Vn)(e.task.state)])
        }, [
          v("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            N(Zr, {
              status: P(Vn)(e.task.state)
            }, null, 8, ["status"]),
            Q(" " + x(a(e.task.state)), 1)
          ]),
          v("span", m2, [
            o[3] || (o[3] = Q(" since ", -1)),
            N(la, {
              at: P(Vl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", p2, [
          o[4] || (o[4] = v("span", { class: "label" }, "Blocked, waiting on", -1)),
          v("p", g2, x(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", v2, "Opens by itself when " + x(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", y2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", b2, [
          o[5] || (o[5] = v("span", { class: "label" }, "Why it was cancelled", -1)),
          v("p", w2, x(e.task.reason), 1)
        ])) : A("", !0),
        N(Vk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        N(f2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (r) => n("select", r))
        }, null, 8, ["task"]),
        N(Jk, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, x2 = /* @__PURE__ */ K(k2, [["__scopeId", "data-v-408e9f91"]]), $2 = 50, M2 = { messages: 25 }, S2 = (e) => M2[e] || $2, _2 = {
  class: "task-log",
  "aria-label": "Task log"
}, E2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, A2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, C2 = { class: "entries" }, O2 = ["datetime"], T2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, R2 = {
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
        String(S2("task_logs")),
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
    }), (u, d) => (c(), h("section", _2, [
      o.value ? (c(), H(Et, { key: 0 })) : l.value ? (c(), h(V, { key: 1 }, [
        v("p", E2, x(l.value), 1),
        N(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: q(() => [...d[3] || (d[3] = [
            Q("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(V, { key: 2 }, [
        n.value.length ? A("", !0) : (c(), h("p", A2, "No log entries yet.")),
        v("ol", C2, [
          (c(!0), h(V, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            v("time", {
              datetime: f.created_at
            }, x(new Date(f.created_at).toLocaleString()), 9, O2),
            v("p", null, x(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", T2, [
          N(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: q(() => [...d[4] || (d[4] = [
              Q("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          v("span", null, "Page " + x(a.value), 1),
          N(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: q(() => [...d[5] || (d[5] = [
              Q("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, I2 = /* @__PURE__ */ K(R2, [["__scopeId", "data-v-98b3a6b1"]]), B2 = { class: "comment-side-head" }, L2 = {
  key: 0,
  class: "comment-none"
}, N2 = { key: 0 }, D2 = {
  key: 1,
  class: "comment-none"
}, j2 = {
  class: "comment",
  "data-comment": ""
}, P2 = {
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
      v("header", B2, [
        n[2] || (n[2] = v("h3", null, "Comments", -1)),
        N(bs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", L2, "No comments yet")) : A("", !0),
      (c(!0), h(V, null, te(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", N2, x(a.quote), 1)) : A("", !0),
        a.revision ? (c(), h("span", D2, "Revision " + x(a.revision), 1)) : A("", !0),
        v("p", j2, x(e.words(a)), 1)
      ]))), 128)),
      N(Jn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, q2 = /* @__PURE__ */ K(P2, [["__scopeId", "data-v-276284a3"]]);
var Jo;
/Mac|iPhone|iPad/.test(((Jo = navigator.userAgentData) == null ? void 0 : Jo.platform) || navigator.platform);
function F2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const W2 = ["placeholder"], H2 = { class: "actions" }, U2 = { class: "error" }, z2 = {
  key: 1,
  class: "card closed"
}, V2 = { class: "mark" }, G2 = { class: "prompt" }, K2 = {
  key: 0,
  class: "draft"
}, Y2 = {
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
      var y, k;
      r.value = !0, i.value = !1, await ht(), (k = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || k.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function g() {
      const y = o.value.trim();
      if (!(!y || !a.ready || u.value)) {
        l.value = "", u.value = !0, o.value = "";
        try {
          await a.send(y), r.value = !1, i.value = !0;
        } catch (k) {
          o.value = y, l.value = k.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, k) => (c(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(g, ["prevent"]),
        onKeydown: Xt(m, ["esc"])
      }, [
        ue(y.$slots, "who", {}, void 0, !0),
        et(v("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": k[0] || (k[0] = (b) => o.value = b),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: k[1] || (k[1] = Xt((b) => P(F2)(b, g), ["enter"]))
        }, null, 40, W2), [
          [Fa, o.value]
        ]),
        v("div", H2, [
          v("span", U2, x(l.value), 1),
          N(de, {
            small: "",
            onClick: m
          }, {
            default: q(() => [...k[3] || (k[3] = [
              Q("Cancel", -1)
            ])]),
            _: 1
          }),
          N(de, {
            variant: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: q(() => [...k[4] || (k[4] = [
              Q("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", z2, [
        v("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          v("span", V2, [
            N(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          v("span", G2, x(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", K2, "Draft kept")) : A("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[2] || (k[2] = (b) => s("show"))
        }, [
          v("span", null, x(P(ac)(e.count, "comment")), 1),
          N(ye, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, J2 = /* @__PURE__ */ K(Y2, [["__scopeId", "data-v-b68baddd"]]);
function Z2(e, t) {
  const n = R([]), a = R(!1), s = R(null), o = R(0), l = R(!1), r = R("");
  let i = 0, u = 0;
  const d = (y) => {
    if (typeof y.body == "string") return y.body;
    const { noun: k, id: b, title: _ } = e(), j = `On ${k} ${b}, ${_}: `;
    return y.text.startsWith(j) ? y.text.slice(j.length) : y.text;
  };
  async function f(y = 1) {
    const { noun: k, id: b } = e();
    if (!b) return;
    const _ = ++u;
    l.value = !0, r.value = "";
    try {
      const j = await t([k, "comments", String(b), "--page", String(y), "--page-size", "25"]);
      if (_ !== u) return;
      if (!j.ok) {
        r.value = j.error;
        return;
      }
      const J = j.value.rows ?? [], D = y === 1 ? J : [...n.value, ...J];
      n.value = [...new Map(D.map((w) => [w.id, w])).values()], o.value = j.value.total ?? n.value.length, s.value = j.value.next_page ?? null;
    } catch (j) {
      _ === u && (r.value = j.message);
    } finally {
      _ === u && (l.value = !1);
    }
  }
  async function m(y) {
    var w;
    const { noun: k, id: b } = e(), _ = `${k}:${b}`, j = { id: `sending-${++i}`, text: y };
    n.value = [...n.value, j], o.value++, a.value = !0;
    const J = await t([k, "comment", String(b), y]);
    if (_ !== `${e().noun}:${e().id}`) return;
    if (!J.ok)
      throw n.value = n.value.filter(($) => $.id !== j.id), o.value = Math.max(0, o.value - 1), new Error(J.error);
    await f();
    const D = (w = J.value) == null ? void 0 : w.id;
    D && !n.value.some(($) => $.id === D) && (n.value = [...n.value, { ...j, id: D }]);
  }
  const g = () => !l.value && s.value && f(s.value);
  return me(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", u++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: g, nextPage: s, total: o, loading: l, failure: r };
}
const X2 = { class: "top" }, Q2 = {
  class: "crumb",
  "data-task-crumb": ""
}, e5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, t5 = {
  key: 1,
  class: "body"
}, n5 = { class: "summary" }, a5 = { class: "stamp" }, s5 = {
  class: "title",
  "data-resource-title": ""
}, o5 = {
  class: "tabs",
  "data-task-tabs": ""
}, l5 = { class: "panels" }, r5 = {
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
    ], g = Z2(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (D) => a.read(D)
    );
    let y = 0;
    const k = B(() => {
      var D;
      return (D = l.value) != null && D.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function b() {
      const D = ++y, [w, $] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      D === y && (r.value = w.ok ? "" : w.error, o.value = w.ok ? w.value : null, l.value = $.ok ? $.value : null);
    }
    me(
      () => a.id,
      () => {
        o.value = null, l.value = null, u.value = null, f.value = "details", b();
      },
      { immediate: !0 }
    ), me(() => a.changes, b), me(g.open, (D) => {
      D && (f.value = "comments");
    });
    async function _(D) {
      const w = o.value.priority;
      o.value.priority = Number(D);
      const $ = await a.read(["task", "edit", String(a.id), "--priority", D]);
      if (i.value = $.ok ? "" : $.error, $.ok) return b();
      o.value.priority = w;
    }
    function j(D) {
      u.value = null, d.value.press(D);
    }
    const J = (D) => {
      var w;
      return ((w = d.value) == null ? void 0 : w.moves.length) && (u.value = D);
    };
    return t({ openStatus: J }), (D, w) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      v("div", X2, [
        e.backed ? (c(), H(bk, {
          key: 0,
          onBack: w[0] || (w[0] = ($) => s("back"))
        })) : A("", !0),
        v("span", Q2, x(k.value), 1),
        w[10] || (w[10] = v("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(V, { key: 1 }, [
          N(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: w[1] || (w[1] = ($) => s("step", -1))
          }, {
            default: q(() => [
              N(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          N(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: w[2] || (w[2] = ($) => s("step", 1))
          }, {
            default: q(() => [
              N(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        N(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: w[3] || (w[3] = ($) => s("close"))
        }, {
          default: q(() => [
            N(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      r.value ? (c(), h("p", e5, x(r.value), 1)) : o.value ? (c(), h(V, { key: 2 }, [
        N(Ek, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: b
        }, null, 8, ["id", "row", "read"]),
        v("header", n5, [
          v("div", a5, [
            Q(" Task " + x(o.value.id) + " · updated ", 1),
            N(la, {
              at: P(Vl)(o.value)
            }, null, 8, ["at"])
          ]),
          v("h3", s5, x(o.value.title), 1)
        ]),
        v("div", o5, [
          N(Xn, {
            options: m,
            value: f.value,
            onPick: w[4] || (w[4] = ($) => f.value = $)
          }, null, 8, ["value"])
        ]),
        v("div", l5, [
          N(jt, { value: f.value }, {
            details: q(() => [
              N(x2, {
                task: o.value,
                place: l.value,
                refusal: i.value,
                onStatus: J,
                onPriority: _,
                onSelect: w[5] || (w[5] = ($) => s("select", $))
              }, null, 8, ["task", "place", "refusal"]),
              N(yk, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              N(tc, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: w[6] || (w[6] = ($) => s("select", $))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: q(() => [
              N(q2, {
                below: "",
                comments: P(g).comments.value,
                words: P(g).words,
                more: !!P(g).nextPage.value,
                loading: P(g).loading.value,
                failure: P(g).failure.value,
                onMore: P(g).loadMore,
                onClose: w[7] || (w[7] = ($) => f.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: q(() => [
              N(I2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        N(J2, {
          send: P(g).send,
          count: P(g).total.value,
          onShow: w[8] || (w[8] = ($) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", t5, [
        N(Et)
      ])),
      u.value ? (c(), H(Zn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: w[9] || (w[9] = ($) => u.value = null)
      }, {
        default: q(() => [
          N(is, null, {
            default: q(() => [
              Q("Change the status of task " + x(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(V, null, te(d.value.moves, ($) => (c(), H($t, {
            key: $.word,
            onClick: (S) => j($)
          }, {
            default: q(() => [
              Q(x($.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, z$ = /* @__PURE__ */ K(r5, [["__scopeId", "data-v-7a9aa909"]]);
function i5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ja = { exports: {} }, Ko;
function c5() {
  return Ko || (Ko = 1, (function(e, t) {
    var n = (function() {
      var a = function(w, $) {
        var S = 236, C = 17, E = w, I = o[$], M = null, p = 0, O = null, T = [], L = {}, Y = function(W, U) {
          p = E * 4 + 17, M = (function(F) {
            for (var z = new Array(F), G = 0; G < F; G += 1) {
              z[G] = new Array(F);
              for (var X = 0; X < F; X += 1)
                z[G][X] = null;
            }
            return z;
          })(p), ee(0, 0), ee(p - 7, 0), ee(0, p - 7), fe(), ie(), Fe(W, U), E >= 7 && Ce(W), O == null && (O = ae(E, I, T)), ve(O, U);
        }, ee = function(W, U) {
          for (var F = -1; F <= 7; F += 1)
            if (!(W + F <= -1 || p <= W + F))
              for (var z = -1; z <= 7; z += 1)
                U + z <= -1 || p <= U + z || (0 <= F && F <= 6 && (z == 0 || z == 6) || 0 <= z && z <= 6 && (F == 0 || F == 6) || 2 <= F && F <= 4 && 2 <= z && z <= 4 ? M[W + F][U + z] = !0 : M[W + F][U + z] = !1);
        }, re = function() {
          for (var W = 0, U = 0, F = 0; F < 8; F += 1) {
            Y(!0, F);
            var z = r.getLostPoint(L);
            (F == 0 || W > z) && (W = z, U = F);
          }
          return U;
        }, ie = function() {
          for (var W = 8; W < p - 8; W += 1)
            M[W][6] == null && (M[W][6] = W % 2 == 0);
          for (var U = 8; U < p - 8; U += 1)
            M[6][U] == null && (M[6][U] = U % 2 == 0);
        }, fe = function() {
          for (var W = r.getPatternPosition(E), U = 0; U < W.length; U += 1)
            for (var F = 0; F < W.length; F += 1) {
              var z = W[U], G = W[F];
              if (M[z][G] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    X == -2 || X == 2 || oe == -2 || oe == 2 || X == 0 && oe == 0 ? M[z + X][G + oe] = !0 : M[z + X][G + oe] = !1;
            }
        }, Ce = function(W) {
          for (var U = r.getBCHTypeNumber(E), F = 0; F < 18; F += 1) {
            var z = !W && (U >> F & 1) == 1;
            M[Math.floor(F / 3)][F % 3 + p - 8 - 3] = z;
          }
          for (var F = 0; F < 18; F += 1) {
            var z = !W && (U >> F & 1) == 1;
            M[F % 3 + p - 8 - 3][Math.floor(F / 3)] = z;
          }
        }, Fe = function(W, U) {
          for (var F = I << 3 | U, z = r.getBCHTypeInfo(F), G = 0; G < 15; G += 1) {
            var X = !W && (z >> G & 1) == 1;
            G < 6 ? M[G][8] = X : G < 8 ? M[G + 1][8] = X : M[p - 15 + G][8] = X;
          }
          for (var G = 0; G < 15; G += 1) {
            var X = !W && (z >> G & 1) == 1;
            G < 8 ? M[8][p - G - 1] = X : G < 9 ? M[8][15 - G - 1 + 1] = X : M[8][15 - G - 1] = X;
          }
          M[p - 8][8] = !W;
        }, ve = function(W, U) {
          for (var F = -1, z = p - 1, G = 7, X = 0, oe = r.getMaskFunction(U), se = p - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (M[z][se - ke] == null) {
                  var Se = !1;
                  X < W.length && (Se = (W[X] >>> G & 1) == 1);
                  var ce = oe(z, se - ke);
                  ce && (Se = !Se), M[z][se - ke] = Se, G -= 1, G == -1 && (X += 1, G = 7);
                }
              if (z += F, z < 0 || p <= z) {
                z -= F, F = -F;
                break;
              }
            }
        }, he = function(W, U) {
          for (var F = 0, z = 0, G = 0, X = new Array(U.length), oe = new Array(U.length), se = 0; se < U.length; se += 1) {
            var ke = U[se].dataCount, Se = U[se].totalCount - ke;
            z = Math.max(z, ke), G = Math.max(G, Se), X[se] = new Array(ke);
            for (var ce = 0; ce < X[se].length; ce += 1)
              X[se][ce] = 255 & W.getBuffer()[ce + F];
            F += ke;
            var Ne = r.getErrorCorrectPolynomial(Se), De = u(X[se], Ne.getLength() - 1), Ds = De.mod(Ne);
            oe[se] = new Array(Ne.getLength() - 1);
            for (var ce = 0; ce < oe[se].length; ce += 1) {
              var js = ce + Ds.getLength() - oe[se].length;
              oe[se][ce] = js >= 0 ? Ds.getAt(js) : 0;
            }
          }
          for (var Ps = 0, ce = 0; ce < U.length; ce += 1)
            Ps += U[ce].totalCount;
          for (var ra = new Array(Ps), pn = 0, ce = 0; ce < z; ce += 1)
            for (var se = 0; se < U.length; se += 1)
              ce < X[se].length && (ra[pn] = X[se][ce], pn += 1);
          for (var ce = 0; ce < G; ce += 1)
            for (var se = 0; se < U.length; se += 1)
              ce < oe[se].length && (ra[pn] = oe[se][ce], pn += 1);
          return ra;
        }, ae = function(W, U, F) {
          for (var z = d.getRSBlocks(W, U), G = f(), X = 0; X < F.length; X += 1) {
            var oe = F[X];
            G.put(oe.getMode(), 4), G.put(oe.getLength(), r.getLengthInBits(oe.getMode(), W)), oe.write(G);
          }
          for (var se = 0, X = 0; X < z.length; X += 1)
            se += z[X].dataCount;
          if (G.getLengthInBits() > se * 8)
            throw "code length overflow. (" + G.getLengthInBits() + ">" + se * 8 + ")";
          for (G.getLengthInBits() + 4 <= se * 8 && G.put(0, 4); G.getLengthInBits() % 8 != 0; )
            G.putBit(!1);
          for (; !(G.getLengthInBits() >= se * 8 || (G.put(S, 8), G.getLengthInBits() >= se * 8)); )
            G.put(C, 8);
          return he(G, z);
        };
        L.addData = function(W, U) {
          U = U || "Byte";
          var F = null;
          switch (U) {
            case "Numeric":
              F = m(W);
              break;
            case "Alphanumeric":
              F = g(W);
              break;
            case "Byte":
              F = y(W);
              break;
            case "Kanji":
              F = k(W);
              break;
            default:
              throw "mode:" + U;
          }
          T.push(F), O = null;
        }, L.isDark = function(W, U) {
          if (W < 0 || p <= W || U < 0 || p <= U)
            throw W + "," + U;
          return M[W][U];
        }, L.getModuleCount = function() {
          return p;
        }, L.make = function() {
          if (E < 1) {
            for (var W = 1; W < 40; W++) {
              for (var U = d.getRSBlocks(W, I), F = f(), z = 0; z < T.length; z++) {
                var G = T[z];
                F.put(G.getMode(), 4), F.put(G.getLength(), r.getLengthInBits(G.getMode(), W)), G.write(F);
              }
              for (var X = 0, z = 0; z < U.length; z++)
                X += U[z].dataCount;
              if (F.getLengthInBits() <= X * 8)
                break;
            }
            E = W;
          }
          Y(!1, re());
        }, L.createTableTag = function(W, U) {
          W = W || 2, U = typeof U > "u" ? W * 4 : U;
          var F = "";
          F += '<table style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: " + U + "px;", F += '">', F += "<tbody>";
          for (var z = 0; z < L.getModuleCount(); z += 1) {
            F += "<tr>";
            for (var G = 0; G < L.getModuleCount(); G += 1)
              F += '<td style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: 0px;", F += " width: " + W + "px;", F += " height: " + W + "px;", F += " background-color: ", F += L.isDark(z, G) ? "#000000" : "#ffffff", F += ";", F += '"/>';
            F += "</tr>";
          }
          return F += "</tbody>", F += "</table>", F;
        }, L.createSvgTag = function(W, U, F, z) {
          var G = {};
          typeof arguments[0] == "object" && (G = arguments[0], W = G.cellSize, U = G.margin, F = G.alt, z = G.title), W = W || 2, U = typeof U > "u" ? W * 4 : U, F = typeof F == "string" ? { text: F } : F || {}, F.text = F.text || null, F.id = F.text ? F.id || "qrcode-description" : null, z = typeof z == "string" ? { text: z } : z || {}, z.text = z.text || null, z.id = z.text ? z.id || "qrcode-title" : null;
          var X = L.getModuleCount() * W + U * 2, oe, se, ke, Se, ce = "", Ne;
          for (Ne = "l" + W + ",0 0," + W + " -" + W + ",0 0,-" + W + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += G.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ce += ' viewBox="0 0 ' + X + " " + X + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += z.text || F.text ? ' role="img" aria-labelledby="' + Ke([z.id, F.id].join(" ").trim()) + '"' : "", ce += ">", ce += z.text ? '<title id="' + Ke(z.id) + '">' + Ke(z.text) + "</title>" : "", ce += F.text ? '<description id="' + Ke(F.id) + '">' + Ke(F.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < L.getModuleCount(); ke += 1)
            for (Se = ke * W + U, oe = 0; oe < L.getModuleCount(); oe += 1)
              L.isDark(ke, oe) && (se = oe * W + U, ce += "M" + se + "," + Se + Ne);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, L.createDataURL = function(W, U) {
          W = W || 2, U = typeof U > "u" ? W * 4 : U;
          var F = L.getModuleCount() * W + U * 2, z = U, G = F - U;
          return D(F, F, function(X, oe) {
            if (z <= X && X < G && z <= oe && oe < G) {
              var se = Math.floor((X - z) / W), ke = Math.floor((oe - z) / W);
              return L.isDark(ke, se) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(W, U, F) {
          W = W || 2, U = typeof U > "u" ? W * 4 : U;
          var z = L.getModuleCount() * W + U * 2, G = "";
          return G += "<img", G += ' src="', G += L.createDataURL(W, U), G += '"', G += ' width="', G += z, G += '"', G += ' height="', G += z, G += '"', F && (G += ' alt="', G += Ke(F), G += '"'), G += "/>", G;
        };
        var Ke = function(W) {
          for (var U = "", F = 0; F < W.length; F += 1) {
            var z = W.charAt(F);
            switch (z) {
              case "<":
                U += "&lt;";
                break;
              case ">":
                U += "&gt;";
                break;
              case "&":
                U += "&amp;";
                break;
              case '"':
                U += "&quot;";
                break;
              default:
                U += z;
                break;
            }
          }
          return U;
        }, Xr = function(W) {
          var U = 1;
          W = typeof W > "u" ? U * 2 : W;
          var F = L.getModuleCount() * U + W * 2, z = W, G = F - W, X, oe, se, ke, Se, ce = {
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
          for (X = 0; X < F; X += 2) {
            for (se = Math.floor((X - z) / U), ke = Math.floor((X + 1 - z) / U), oe = 0; oe < F; oe += 1)
              Se = "█", z <= oe && oe < G && z <= X && X < G && L.isDark(se, Math.floor((oe - z) / U)) && (Se = " "), z <= oe && oe < G && z <= X + 1 && X + 1 < G && L.isDark(ke, Math.floor((oe - z) / U)) ? Se += " " : Se += "█", De += W < 1 && X + 1 >= G ? Ne[Se] : ce[Se];
            De += `
`;
          }
          return F % 2 && W > 0 ? De.substring(0, De.length - F - 1) + Array(F + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return L.createASCII = function(W, U) {
          if (W = W || 1, W < 2)
            return Xr(U);
          W -= 1, U = typeof U > "u" ? W * 2 : U;
          var F = L.getModuleCount() * W + U * 2, z = U, G = F - U, X, oe, se, ke, Se = Array(W + 1).join("██"), ce = Array(W + 1).join("  "), Ne = "", De = "";
          for (X = 0; X < F; X += 1) {
            for (se = Math.floor((X - z) / W), De = "", oe = 0; oe < F; oe += 1)
              ke = 1, z <= oe && oe < G && z <= X && X < G && L.isDark(se, Math.floor((oe - z) / W)) && (ke = 0), De += ke ? Se : ce;
            for (se = 0; se < W; se += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, L.renderTo2dContext = function(W, U) {
          U = U || 2;
          for (var F = L.getModuleCount(), z = 0; z < F; z++)
            for (var G = 0; G < F; G++)
              W.fillStyle = L.isDark(z, G) ? "black" : "white", W.fillRect(z * U, G * U, U, U);
        }, L;
      };
      a.stringToBytesFuncs = {
        default: function(w) {
          for (var $ = [], S = 0; S < w.length; S += 1) {
            var C = w.charCodeAt(S);
            $.push(C & 255);
          }
          return $;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(w, $) {
        var S = (function() {
          for (var E = j(w), I = function() {
            var ie = E.read();
            if (ie == -1) throw "eof";
            return ie;
          }, M = 0, p = {}; ; ) {
            var O = E.read();
            if (O == -1) break;
            var T = I(), L = I(), Y = I(), ee = String.fromCharCode(O << 8 | T), re = L << 8 | Y;
            p[ee] = re, M += 1;
          }
          if (M != $)
            throw M + " != " + $;
          return p;
        })(), C = 63;
        return function(E) {
          for (var I = [], M = 0; M < E.length; M += 1) {
            var p = E.charCodeAt(M);
            if (p < 128)
              I.push(p);
            else {
              var O = S[E.charAt(M)];
              typeof O == "number" ? (O & 255) == O ? I.push(O) : (I.push(O >>> 8), I.push(O & 255)) : I.push(C);
            }
          }
          return I;
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
        var w = [
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
        ], $ = 1335, S = 7973, C = 21522, E = {}, I = function(M) {
          for (var p = 0; M != 0; )
            p += 1, M >>>= 1;
          return p;
        };
        return E.getBCHTypeInfo = function(M) {
          for (var p = M << 10; I(p) - I($) >= 0; )
            p ^= $ << I(p) - I($);
          return (M << 10 | p) ^ C;
        }, E.getBCHTypeNumber = function(M) {
          for (var p = M << 12; I(p) - I(S) >= 0; )
            p ^= S << I(p) - I(S);
          return M << 12 | p;
        }, E.getPatternPosition = function(M) {
          return w[M - 1];
        }, E.getMaskFunction = function(M) {
          switch (M) {
            case l.PATTERN000:
              return function(p, O) {
                return (p + O) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, O) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, O) {
                return O % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, O) {
                return (p + O) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, O) {
                return (Math.floor(p / 2) + Math.floor(O / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, O) {
                return p * O % 2 + p * O % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, O) {
                return (p * O % 2 + p * O % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, O) {
                return (p * O % 3 + (p + O) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + M;
          }
        }, E.getErrorCorrectPolynomial = function(M) {
          for (var p = u([1], 0), O = 0; O < M; O += 1)
            p = p.multiply(u([1, i.gexp(O)], 0));
          return p;
        }, E.getLengthInBits = function(M, p) {
          if (1 <= p && p < 10)
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
          else if (p < 27)
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
          else if (p < 41)
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
            throw "type:" + p;
        }, E.getLostPoint = function(M) {
          for (var p = M.getModuleCount(), O = 0, T = 0; T < p; T += 1)
            for (var L = 0; L < p; L += 1) {
              for (var Y = 0, ee = M.isDark(T, L), re = -1; re <= 1; re += 1)
                if (!(T + re < 0 || p <= T + re))
                  for (var ie = -1; ie <= 1; ie += 1)
                    L + ie < 0 || p <= L + ie || re == 0 && ie == 0 || ee == M.isDark(T + re, L + ie) && (Y += 1);
              Y > 5 && (O += 3 + Y - 5);
            }
          for (var T = 0; T < p - 1; T += 1)
            for (var L = 0; L < p - 1; L += 1) {
              var fe = 0;
              M.isDark(T, L) && (fe += 1), M.isDark(T + 1, L) && (fe += 1), M.isDark(T, L + 1) && (fe += 1), M.isDark(T + 1, L + 1) && (fe += 1), (fe == 0 || fe == 4) && (O += 3);
            }
          for (var T = 0; T < p; T += 1)
            for (var L = 0; L < p - 6; L += 1)
              M.isDark(T, L) && !M.isDark(T, L + 1) && M.isDark(T, L + 2) && M.isDark(T, L + 3) && M.isDark(T, L + 4) && !M.isDark(T, L + 5) && M.isDark(T, L + 6) && (O += 40);
          for (var L = 0; L < p; L += 1)
            for (var T = 0; T < p - 6; T += 1)
              M.isDark(T, L) && !M.isDark(T + 1, L) && M.isDark(T + 2, L) && M.isDark(T + 3, L) && M.isDark(T + 4, L) && !M.isDark(T + 5, L) && M.isDark(T + 6, L) && (O += 40);
          for (var Ce = 0, L = 0; L < p; L += 1)
            for (var T = 0; T < p; T += 1)
              M.isDark(T, L) && (Ce += 1);
          var Fe = Math.abs(100 * Ce / p / p - 50) / 5;
          return O += Fe * 10, O;
        }, E;
      })(), i = (function() {
        for (var w = new Array(256), $ = new Array(256), S = 0; S < 8; S += 1)
          w[S] = 1 << S;
        for (var S = 8; S < 256; S += 1)
          w[S] = w[S - 4] ^ w[S - 5] ^ w[S - 6] ^ w[S - 8];
        for (var S = 0; S < 255; S += 1)
          $[w[S]] = S;
        var C = {};
        return C.glog = function(E) {
          if (E < 1)
            throw "glog(" + E + ")";
          return $[E];
        }, C.gexp = function(E) {
          for (; E < 0; )
            E += 255;
          for (; E >= 256; )
            E -= 255;
          return w[E];
        }, C;
      })();
      function u(w, $) {
        if (typeof w.length > "u")
          throw w.length + "/" + $;
        var S = (function() {
          for (var E = 0; E < w.length && w[E] == 0; )
            E += 1;
          for (var I = new Array(w.length - E + $), M = 0; M < w.length - E; M += 1)
            I[M] = w[M + E];
          return I;
        })(), C = {};
        return C.getAt = function(E) {
          return S[E];
        }, C.getLength = function() {
          return S.length;
        }, C.multiply = function(E) {
          for (var I = new Array(C.getLength() + E.getLength() - 1), M = 0; M < C.getLength(); M += 1)
            for (var p = 0; p < E.getLength(); p += 1)
              I[M + p] ^= i.gexp(i.glog(C.getAt(M)) + i.glog(E.getAt(p)));
          return u(I, 0);
        }, C.mod = function(E) {
          if (C.getLength() - E.getLength() < 0)
            return C;
          for (var I = i.glog(C.getAt(0)) - i.glog(E.getAt(0)), M = new Array(C.getLength()), p = 0; p < C.getLength(); p += 1)
            M[p] = C.getAt(p);
          for (var p = 0; p < E.getLength(); p += 1)
            M[p] ^= i.gexp(i.glog(E.getAt(p)) + I);
          return u(M, 0).mod(E);
        }, C;
      }
      var d = (function() {
        var w = [
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
        ], $ = function(E, I) {
          var M = {};
          return M.totalCount = E, M.dataCount = I, M;
        }, S = {}, C = function(E, I) {
          switch (I) {
            case o.L:
              return w[(E - 1) * 4 + 0];
            case o.M:
              return w[(E - 1) * 4 + 1];
            case o.Q:
              return w[(E - 1) * 4 + 2];
            case o.H:
              return w[(E - 1) * 4 + 3];
            default:
              return;
          }
        };
        return S.getRSBlocks = function(E, I) {
          var M = C(E, I);
          if (typeof M > "u")
            throw "bad rs block @ typeNumber:" + E + "/errorCorrectionLevel:" + I;
          for (var p = M.length / 3, O = [], T = 0; T < p; T += 1)
            for (var L = M[T * 3 + 0], Y = M[T * 3 + 1], ee = M[T * 3 + 2], re = 0; re < L; re += 1)
              O.push($(Y, ee));
          return O;
        }, S;
      })(), f = function() {
        var w = [], $ = 0, S = {};
        return S.getBuffer = function() {
          return w;
        }, S.getAt = function(C) {
          var E = Math.floor(C / 8);
          return (w[E] >>> 7 - C % 8 & 1) == 1;
        }, S.put = function(C, E) {
          for (var I = 0; I < E; I += 1)
            S.putBit((C >>> E - I - 1 & 1) == 1);
        }, S.getLengthInBits = function() {
          return $;
        }, S.putBit = function(C) {
          var E = Math.floor($ / 8);
          w.length <= E && w.push(0), C && (w[E] |= 128 >>> $ % 8), $ += 1;
        }, S;
      }, m = function(w) {
        var $ = s.MODE_NUMBER, S = w, C = {};
        C.getMode = function() {
          return $;
        }, C.getLength = function(M) {
          return S.length;
        }, C.write = function(M) {
          for (var p = S, O = 0; O + 2 < p.length; )
            M.put(E(p.substring(O, O + 3)), 10), O += 3;
          O < p.length && (p.length - O == 1 ? M.put(E(p.substring(O, O + 1)), 4) : p.length - O == 2 && M.put(E(p.substring(O, O + 2)), 7));
        };
        var E = function(M) {
          for (var p = 0, O = 0; O < M.length; O += 1)
            p = p * 10 + I(M.charAt(O));
          return p;
        }, I = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          throw "illegal char :" + M;
        };
        return C;
      }, g = function(w) {
        var $ = s.MODE_ALPHA_NUM, S = w, C = {};
        C.getMode = function() {
          return $;
        }, C.getLength = function(I) {
          return S.length;
        }, C.write = function(I) {
          for (var M = S, p = 0; p + 1 < M.length; )
            I.put(
              E(M.charAt(p)) * 45 + E(M.charAt(p + 1)),
              11
            ), p += 2;
          p < M.length && I.put(E(M.charAt(p)), 6);
        };
        var E = function(I) {
          if ("0" <= I && I <= "9")
            return I.charCodeAt(0) - 48;
          if ("A" <= I && I <= "Z")
            return I.charCodeAt(0) - 65 + 10;
          switch (I) {
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
              throw "illegal char :" + I;
          }
        };
        return C;
      }, y = function(w) {
        var $ = s.MODE_8BIT_BYTE, S = a.stringToBytes(w), C = {};
        return C.getMode = function() {
          return $;
        }, C.getLength = function(E) {
          return S.length;
        }, C.write = function(E) {
          for (var I = 0; I < S.length; I += 1)
            E.put(S[I], 8);
        }, C;
      }, k = function(w) {
        var $ = s.MODE_KANJI, S = a.stringToBytesFuncs.SJIS;
        if (!S)
          throw "sjis not supported.";
        (function(I, M) {
          var p = S(I);
          if (p.length != 2 || (p[0] << 8 | p[1]) != M)
            throw "sjis not supported.";
        })("友", 38726);
        var C = S(w), E = {};
        return E.getMode = function() {
          return $;
        }, E.getLength = function(I) {
          return ~~(C.length / 2);
        }, E.write = function(I) {
          for (var M = C, p = 0; p + 1 < M.length; ) {
            var O = (255 & M[p]) << 8 | 255 & M[p + 1];
            if (33088 <= O && O <= 40956)
              O -= 33088;
            else if (57408 <= O && O <= 60351)
              O -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + O;
            O = (O >>> 8 & 255) * 192 + (O & 255), I.put(O, 13), p += 2;
          }
          if (p < M.length)
            throw "illegal char at " + (p + 1);
        }, E;
      }, b = function() {
        var w = [], $ = {};
        return $.writeByte = function(S) {
          w.push(S & 255);
        }, $.writeShort = function(S) {
          $.writeByte(S), $.writeByte(S >>> 8);
        }, $.writeBytes = function(S, C, E) {
          C = C || 0, E = E || S.length;
          for (var I = 0; I < E; I += 1)
            $.writeByte(S[I + C]);
        }, $.writeString = function(S) {
          for (var C = 0; C < S.length; C += 1)
            $.writeByte(S.charCodeAt(C));
        }, $.toByteArray = function() {
          return w;
        }, $.toString = function() {
          var S = "";
          S += "[";
          for (var C = 0; C < w.length; C += 1)
            C > 0 && (S += ","), S += w[C];
          return S += "]", S;
        }, $;
      }, _ = function() {
        var w = 0, $ = 0, S = 0, C = "", E = {}, I = function(p) {
          C += String.fromCharCode(M(p & 63));
        }, M = function(p) {
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
        return E.writeByte = function(p) {
          for (w = w << 8 | p & 255, $ += 8, S += 1; $ >= 6; )
            I(w >>> $ - 6), $ -= 6;
        }, E.flush = function() {
          if ($ > 0 && (I(w << 6 - $), w = 0, $ = 0), S % 3 != 0)
            for (var p = 3 - S % 3, O = 0; O < p; O += 1)
              C += "=";
        }, E.toString = function() {
          return C;
        }, E;
      }, j = function(w) {
        var $ = w, S = 0, C = 0, E = 0, I = {};
        I.read = function() {
          for (; E < 8; ) {
            if (S >= $.length) {
              if (E == 0)
                return -1;
              throw "unexpected end of file./" + E;
            }
            var p = $.charAt(S);
            if (S += 1, p == "=")
              return E = 0, -1;
            if (p.match(/^\s$/))
              continue;
            C = C << 6 | M(p.charCodeAt(0)), E += 6;
          }
          var O = C >>> E - 8 & 255;
          return E -= 8, O;
        };
        var M = function(p) {
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
        return I;
      }, J = function(w, $) {
        var S = w, C = $, E = new Array(w * $), I = {};
        I.setPixel = function(T, L, Y) {
          E[L * S + T] = Y;
        }, I.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(S), T.writeShort(C), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(S), T.writeShort(C), T.writeByte(0);
          var L = 2, Y = p(L);
          T.writeByte(L);
          for (var ee = 0; Y.length - ee > 255; )
            T.writeByte(255), T.writeBytes(Y, ee, 255), ee += 255;
          T.writeByte(Y.length - ee), T.writeBytes(Y, ee, Y.length - ee), T.writeByte(0), T.writeString(";");
        };
        var M = function(T) {
          var L = T, Y = 0, ee = 0, re = {};
          return re.write = function(ie, fe) {
            if (ie >>> fe)
              throw "length over";
            for (; Y + fe >= 8; )
              L.writeByte(255 & (ie << Y | ee)), fe -= 8 - Y, ie >>>= 8 - Y, ee = 0, Y = 0;
            ee = ie << Y | ee, Y = Y + fe;
          }, re.flush = function() {
            Y > 0 && L.writeByte(ee);
          }, re;
        }, p = function(T) {
          for (var L = 1 << T, Y = (1 << T) + 1, ee = T + 1, re = O(), ie = 0; ie < L; ie += 1)
            re.add(String.fromCharCode(ie));
          re.add(String.fromCharCode(L)), re.add(String.fromCharCode(Y));
          var fe = b(), Ce = M(fe);
          Ce.write(L, ee);
          var Fe = 0, ve = String.fromCharCode(E[Fe]);
          for (Fe += 1; Fe < E.length; ) {
            var he = String.fromCharCode(E[Fe]);
            Fe += 1, re.contains(ve + he) ? ve = ve + he : (Ce.write(re.indexOf(ve), ee), re.size() < 4095 && (re.size() == 1 << ee && (ee += 1), re.add(ve + he)), ve = he);
          }
          return Ce.write(re.indexOf(ve), ee), Ce.write(Y, ee), Ce.flush(), fe.toByteArray();
        }, O = function() {
          var T = {}, L = 0, Y = {};
          return Y.add = function(ee) {
            if (Y.contains(ee))
              throw "dup key:" + ee;
            T[ee] = L, L += 1;
          }, Y.size = function() {
            return L;
          }, Y.indexOf = function(ee) {
            return T[ee];
          }, Y.contains = function(ee) {
            return typeof T[ee] < "u";
          }, Y;
        };
        return I;
      }, D = function(w, $, S) {
        for (var C = J(w, $), E = 0; E < $; E += 1)
          for (var I = 0; I < w; I += 1)
            C.setPixel(I, E, S(I, E));
        var M = b();
        C.write(M);
        for (var p = _(), O = M.toByteArray(), T = 0; T < O.length; T += 1)
          p.writeByte(O[T]);
        return p.flush(), "data:image/gif;base64," + p;
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
var u5 = c5();
const d5 = /* @__PURE__ */ i5(u5), f5 = ["width", "height", "viewBox"], h5 = ["width", "height"], m5 = ["d"], p5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = B(() => {
      const a = d5(0, "M");
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
      }, null, 8, h5),
      v("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, m5)
    ], 8, f5));
  }
}, V$ = /* @__PURE__ */ K(p5, [["__scopeId", "data-v-489f0852"]]), g5 = {
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
}, G$ = /* @__PURE__ */ K(g5, [["__scopeId", "data-v-47e67f04"]]);
function K$(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const Y$ = di(() => import("./VoiceFigure-BNne1v21.js").then((e) => e.V)), J$ = "1.2.0", Z$ = "3.5";
export {
  gd as $,
  _e as A,
  Oe as B,
  na as C,
  at as D,
  t$ as E,
  vb as F,
  z4 as G,
  Zx as H,
  Zy as I,
  Mb as J,
  Ct as K,
  b5 as L,
  Ts as M,
  Ob as N,
  $b as O,
  ta as P,
  vx as Q,
  M4 as R,
  In as S,
  xx as T,
  g4 as U,
  Ee as V,
  Fn as W,
  p4 as X,
  m4 as Y,
  pd as Z,
  K as _,
  l4 as a,
  Px as a$,
  Ab as a0,
  S4 as a1,
  _4 as a2,
  Te as a3,
  D4 as a4,
  N4 as a5,
  Mt as a6,
  E4 as a7,
  Y4 as a8,
  Y5 as a9,
  Tx as aA,
  mx as aB,
  qy as aC,
  Q4 as aD,
  ex as aE,
  n$ as aF,
  Ir as aG,
  kx as aH,
  dn as aI,
  t4 as aJ,
  X5 as aK,
  zx as aL,
  fn as aM,
  Yx as aN,
  U4 as aO,
  px as aP,
  gx as aQ,
  hx as aR,
  an as aS,
  kt as aT,
  J5 as aU,
  Ov as aV,
  dx as aW,
  x4 as aX,
  Tr as aY,
  Nt as aZ,
  qt as a_,
  qx as aa,
  Gx as ab,
  s4 as ac,
  v4 as ad,
  y4 as ae,
  B4 as af,
  L4 as ag,
  j4 as ah,
  u4 as ai,
  qo as aj,
  A4 as ak,
  K4 as al,
  l$ as am,
  rx as an,
  ox as ao,
  sx as ap,
  P4 as aq,
  R4 as ar,
  T4 as as,
  I4 as at,
  wx as au,
  G4 as av,
  J4 as aw,
  c$ as ax,
  Yt as ay,
  Z4 as az,
  Fb as b,
  i$ as b$,
  hb as b0,
  Kx as b1,
  Sx as b2,
  Mx as b3,
  ey as b4,
  yr as b5,
  Nx as b6,
  V4 as b7,
  oa as b8,
  rt as b9,
  Ex as bA,
  Ix as bB,
  dt as bC,
  $x as bD,
  Bx as bE,
  X4 as bF,
  ix as bG,
  tx as bH,
  Re as bI,
  H4 as bJ,
  Lx as bK,
  v$ as bL,
  y$ as bM,
  G5 as bN,
  Iv as bO,
  F4 as bP,
  Ax as bQ,
  r4 as bR,
  o$ as bS,
  _x as bT,
  Cx as bU,
  Ox as bV,
  q4 as bW,
  Fy as bX,
  W4 as bY,
  ax as bZ,
  s$ as b_,
  Rx as ba,
  _a as bb,
  zl as bc,
  d$ as bd,
  m$ as be,
  bx as bf,
  Ux as bg,
  K5 as bh,
  lx as bi,
  f$ as bj,
  C4 as bk,
  O4 as bl,
  f4 as bm,
  $4 as bn,
  e4 as bo,
  Wx as bp,
  i4 as bq,
  c4 as br,
  h4 as bs,
  ux as bt,
  Sv as bu,
  Jx as bv,
  xb as bw,
  d4 as bx,
  n4 as by,
  cx as bz,
  Qv as c,
  D5 as c$,
  Q5 as c0,
  Z5 as c1,
  nx as c2,
  p$ as c3,
  Ns as c4,
  g$ as c5,
  Kr as c6,
  Hx as c7,
  w4 as c8,
  b4 as c9,
  B$ as cA,
  E5 as cB,
  J$ as cC,
  Z$ as cD,
  L5 as cE,
  N$ as cF,
  es as cG,
  W5 as cH,
  c0 as cI,
  $t as cJ,
  is as cK,
  Zn as cL,
  O5 as cM,
  N5 as cN,
  Li as cO,
  _g as cP,
  H$ as cQ,
  R5 as cR,
  V$ as cS,
  ow as cT,
  tc as cU,
  T$ as cV,
  Cd as cW,
  $5 as cX,
  U5 as cY,
  Fw as cZ,
  Xn as c_,
  Cv as ca,
  a4 as cb,
  wb as cc,
  fx as cd,
  As as ce,
  Ly as cf,
  yx as cg,
  Jt as ch,
  Lt as ci,
  A5 as cj,
  I$ as ck,
  de as cl,
  Qu as cm,
  ld as cn,
  bs as co,
  rm as cp,
  Ml as cq,
  U$ as cr,
  V5 as cs,
  Ep as ct,
  Qt as cu,
  b$ as cv,
  y5 as cw,
  xt as cx,
  Cu as cy,
  ye as cz,
  He as d,
  D$ as d$,
  Et as d0,
  mt as d1,
  tp as d2,
  cc as d3,
  q5 as d4,
  M5 as d5,
  jt as d6,
  L$ as d7,
  z$ as d8,
  Zr as d9,
  w$ as dA,
  k5 as dB,
  j$ as dC,
  a0 as dD,
  cw as dE,
  S5 as dF,
  B5 as dG,
  S$ as dH,
  E$ as dI,
  qe as dJ,
  C5 as dK,
  T5 as dL,
  M$ as dM,
  Dp as dN,
  x5 as dO,
  w5 as dP,
  ml as dQ,
  pl as dR,
  lu as dS,
  _5 as dT,
  ut as dU,
  K$ as dV,
  uw as dW,
  P5 as dX,
  $$ as dY,
  R$ as dZ,
  rw as d_,
  Tu as da,
  wt as db,
  j5 as dc,
  la as dd,
  Y$ as de,
  G$ as df,
  Ss as dg,
  _$ as dh,
  hs as di,
  p1 as dj,
  go as dk,
  er as dl,
  su as dm,
  F$ as dn,
  q$ as dp,
  ps as dq,
  au as dr,
  ul as ds,
  I5 as dt,
  W$ as du,
  z5 as dv,
  H5 as dw,
  F5 as dx,
  k$ as dy,
  Xf as dz,
  k4 as e,
  cg as e0,
  al as e1,
  Jw as e2,
  vg as e3,
  A$ as e4,
  Qa as e5,
  C$ as e6,
  O$ as e7,
  nt as e8,
  x$ as e9,
  P$ as ea,
  ou as eb,
  Mv as f,
  u$ as g,
  sn as h,
  Xx as i,
  h$ as j,
  Qx as k,
  Fx as l,
  Vb as m,
  Rs as n,
  Vx as o,
  o4 as p,
  e$ as q,
  Vr as r,
  Gr as s,
  Me as t,
  ny as u,
  Dx as v,
  r$ as w,
  jx as x,
  mn as y,
  a$ as z
};
