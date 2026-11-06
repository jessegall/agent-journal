/* @code-commandments-generated */
import { openBlock as u, createElementBlock as h, normalizeStyle as ge, unref as j, renderSlot as ue, createElementVNode as b, normalizeClass as Z, Fragment as G, renderList as Q, defineComponent as si, Comment as oi, h as Kn, cloneVNode as li, createBlock as H, withCtx as P, createVNode as N, toDisplayString as w, createCommentVNode as A, inject as Ae, useAttrs as Yn, computed as I, ref as R, resolveDynamicComponent as ht, mergeProps as Fe, useId as ds, resolveDirective as ri, withDirectives as tt, createTextVNode as ee, watch as fe, onUnmounted as Le, onMounted as Ie, Teleport as fs, reactive as Jn, shallowRef as Ke, nextTick as mt, Transition as Dt, withModifiers as xe, TransitionGroup as el, shallowReactive as ii, onBeforeUnmount as pt, isRef as Hs, onScopeDispose as hs, resolveComponent as ci, useModel as qa, getCurrentInstance as ui, mergeModels as Fa, getCurrentScope as tl, provide as di, onErrorCaptured as fi, toHandlers as hi, createSlots as mi, vShow as nl, useSlots as pi, withKeys as Xt, vModelText as Wa, normalizeProps as gi, guardReactiveProps as vi, defineAsyncComponent as yi } from "vue";
function al(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, bi = 1600, wi = {
  __name: "Shimmer",
  setup(e) {
    const t = al(bi);
    return (n, a) => (u(), h("span", {
      class: "shimmer",
      style: ge(j(t))
    }, null, 4));
  }
}, Vt = /* @__PURE__ */ Y(wi, [["__scopeId", "data-v-6c018b03"]]), ki = { class: "skeleton-line" }, xi = 2e3, $i = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = al(xi);
    return (n, a) => (u(), h("span", ki, [
      ue(n.$slots, "default", {}, void 0, !0),
      b("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (u(!0), h(G, null, Q(e.bars, (s) => (u(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...j(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, gt = /* @__PURE__ */ Y($i, [["__scopeId", "data-v-484fe8a0"]]), jt = si({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== oi);
      return a.length !== 1 ? Kn(G, { key: n }, a) : a[0].key == null ? li(a[0], { key: n }) : a[0];
    };
  }
}), Mi = ["aria-label"], Si = ["aria-label"], _i = ["aria-label"], Ei = ["aria-label"], Ai = ["aria-label"], Ci = ["aria-label"], Oi = ["aria-label"], Ti = {
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
    return (i, c) => (u(), H(jt, { value: e.shape }, {
      messages: P(() => [
        b("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), h(G, null, Q(t, (d) => N(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Mi)
      ]),
      older: P(() => [
        b("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, Q(t.slice(0, 3), (d) => (u(), H(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Si)
      ]),
      cards: P(() => [
        b("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, Q(e.count, (d) => (u(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), h(G, null, Q(n, (f) => N(gt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, _i)
      ]),
      file: P(() => [
        b("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, Q(e.count, (d) => (u(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            N(gt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), h(G, null, Q(s, (f) => N(gt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ei)
      ]),
      page: P(() => [
        b("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          N(gt, {
            class: "skeleton-heading",
            bars: r
          }),
          (u(!0), h(G, null, Q(e.count, (d) => (u(), H(gt, {
            key: d,
            bars: j(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ai)
      ]),
      text: P(() => [
        b("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, Q(e.count, (d) => (u(), H(gt, {
            key: d,
            bars: j(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ci)
      ]),
      default: P(() => [
        b("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, Q(e.count, (d) => (u(), H(gt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Oi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Et = /* @__PURE__ */ Y(Ti, [["__scopeId", "data-v-ef519c5f"]]), Ri = {
  key: 1,
  class: "empty-state titled"
}, Ii = { class: "empty-state-title" }, Bi = { class: "empty-state-text" }, Li = {
  key: 2,
  class: "empty-state"
}, Ni = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), H(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), h("div", Ri, [
      b("p", Ii, w(e.title), 1),
      b("p", Bi, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), h("p", Li, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ Y(Ni, [["__scopeId", "data-v-b27e89b0"]]), Di = { class: "fold-group" }, ji = ["aria-expanded"], Pi = { class: "fold-label" }, qi = {
  key: 0,
  class: "fold-count"
}, Fi = {
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
    return (a, s) => (u(), h("div", Di, [
      b("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        b("span", Pi, w(e.label), 1),
        e.count !== "" ? (u(), h("span", qi, w(e.count), 1)) : A("", !0),
        b("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, ji),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, R5 = /* @__PURE__ */ Y(Fi, [["__scopeId", "data-v-9ef1865c"]]), Wi = Symbol("open-view"), Te = Symbol.for("journal.window-context");
function ze() {
  const e = Ae(Te, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const sl = 120;
var Xo;
const ia = globalThis[Xo = Symbol.for("journal.pressed")] ?? (globalThis[Xo] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Hi(e = 0) {
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
const Ui = ["stroke-width", "innerHTML"], ye = {
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
    return (o, l) => (u(), h("svg", {
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
    }, null, 12, Ui));
  }
}, zi = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Vi = /* @__PURE__ */ Y(zi, [["__scopeId", "data-v-eb453d6f"]]), Gi = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Yn(), a = I(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = R(!1), o = I(() => t.busy || s.value), l = Ae(Te, null), r = I(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(c) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(c)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, sl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (c, d) => (u(), H(ht(e.href ? "a" : "button"), Fe(a.value, {
      type: e.href ? void 0 : j(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: P(() => [
        b("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          ue(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), H(Vi, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ Y(Gi, [["__scopeId", "data-v-ededdadf"]]), Ki = ["aria-checked", "aria-haspopup", "onClick"], Yi = {
  key: 0,
  class: "segmented-dot"
}, Ji = {
  key: 1,
  class: "segmented-note"
}, Zi = {
  key: 2,
  class: "segmented-count"
}, Xi = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = ds();
    return (s, o) => {
      const l = ri("tip");
      return u(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), h(G, null, Q(e.options, (r) => tt((u(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (u(), h("span", Yi)) : A("", !0),
          ee(" " + w(r.label) + " ", 1),
          r.note ? (u(), h("small", Ji, w(r.note), 1)) : A("", !0),
          r.count !== void 0 ? (u(), h("em", Zi, w(r.count), 1)) : A("", !0)
        ], 10, Ki)), [
          [l, r.tip || r.title, `${j(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, cn = /* @__PURE__ */ Y(Xi, [["__scopeId", "data-v-c89bc92d"]]), Qi = {
  key: 0,
  class: "more-items"
}, ec = {
  key: 0,
  role: "alert"
}, tc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), h("div", Qi, [
      e.failure ? (u(), h("p", ec, w(e.failure), 1)) : A("", !0),
      e.more ? (u(), H(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: P(() => [
          ee(w(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : A("", !0)
    ])) : A("", !0);
  }
}, Zn = /* @__PURE__ */ Y(tc, [["__scopeId", "data-v-10464014"]]), nc = {
  key: 0,
  class: "resource-links",
  "data-resource-links": ""
}, ac = ["disabled", "onClick"], sc = { class: "title" }, oc = { class: "relations" }, lc = { key: 1 }, rc = {
  __name: "ResourceLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    changes: { type: Number, default: 0 },
    outsidePlan: Boolean,
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R([]), o = R({}), l = R(0), r = R(""), i = R(null), c = R(!1), d = R("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, v = (y) => m[y] || `${y.replaceAll("_", " ").replace(/^./, (B) => B.toUpperCase())}s`, p = I(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((y, B) => y + B, 0) },
      ...Object.entries(o.value).map(([y, B]) => ({ key: y, label: v(y), count: B }))
    ]), k = (y) => y.endpoint.unavailable || !y.endpoint.open_ref, S = (y) => ({ [n.linkAttribute]: !0, "data-link-model": y.endpoint.model, "data-link-id": y.endpoint.id }), C = (y) => `${y.endpoint.model === "doc" && y.endpoint.id === n.documentId ? "Design document" : y.endpoint.model.replaceAll("_", " ").replace(/^./, (B) => B.toUpperCase())} ${y.endpoint.id}, ${y.relations.map((B) => B.replaceAll("_", " ")).join(", ")}`;
    async function F(y = 1) {
      const B = ++f;
      c.value = !0, d.value = "";
      const M = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(y), "--page-size", String(n.pageSize)];
      n.outsidePlan && M.push("--outside-plan"), n.documentId && M.push("--first-counterpart", `doc:${n.documentId}`), r.value && M.push("--kind", r.value);
      try {
        const O = await n.read(M);
        if (B !== f) return;
        if (!O.ok) {
          d.value = O.error;
          return;
        }
        const x = O.value.counterparts ?? [], g = y === 1 ? x : [...s.value, ...x];
        s.value = [...new Map(g.map((E) => [`${E.endpoint.model}:${E.endpoint.id}`, E])).values()], o.value = O.value.kinds ?? {}, l.value = O.value.total, i.value = O.value.next_page ?? null;
      } catch (O) {
        B === f && (d.value = O.message);
      } finally {
        B === f && (c.value = !1);
      }
    }
    function W(y) {
      if (k(y)) return;
      const [B, M] = y.endpoint.open_ref.split(":");
      a("open", { table: B, id: Number(M) });
    }
    function L(y) {
      r.value = y, F();
    }
    const $ = () => !c.value && i.value && F(i.value), _ = I(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return fe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", F();
    }, { immediate: !0 }), (y, B) => s.value.length || c.value || d.value || e.empty ? (u(), h("section", nc, [
      p.value.length > 2 ? (u(), H(cn, {
        key: 0,
        options: p.value,
        value: r.value,
        wrap: "",
        onPick: L
      }, null, 8, ["options", "value"])) : A("", !0),
      (u(!0), h(G, null, Q(s.value, (M) => (u(), h("button", Fe({
        key: `${M.endpoint.model}:${M.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, S(M), {
        disabled: k(M),
        onClick: (O) => W(M)
      }), [
        b("span", sc, w(M.endpoint.title), 1),
        b("span", oc, [
          ee(w(C(M)), 1),
          k(M) ? (u(), h(G, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : A("", !0)
        ])
      ], 16, ac))), 128)),
      !s.value.length && !c.value && !d.value && e.empty ? (u(), h("p", lc, w(e.empty), 1)) : A("", !0),
      N(Zn, {
        more: !!i.value,
        loading: c.value,
        failure: d.value,
        label: _.value,
        onMore: $
      }, null, 8, ["more", "loading", "failure", "label"])
    ])) : A("", !0);
  }
}, ic = /* @__PURE__ */ Y(rc, [["__scopeId", "data-v-466876c9"]]), cc = (e, t, n) => Math.max(t, Math.min(n, e)), uc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, ol = /* @__PURE__ */ new WeakMap(), dc = (e, t) => ol.set(e, t);
function fc(e, t) {
  for (let n = t; n; n = ol.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function ll(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !fc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Le(() => window.removeEventListener("click", n));
}
const Ot = 8, hc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = R(null), o = (g) => g ? `${g}px` : void 0, l = I(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = R({ w: 0, h: 0 }), i = R(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), f = (g) => {
      const E = g.closest(".pane, .float-window");
      return E ? d(E.getBoundingClientRect()) : c();
    }, m = (g, E) => `${Math.max(0, g ? Math.min(g, E) : E)}px`;
    function v(g, E) {
      return {
        below: g.bottom - E.bottom - a.gap - Ot,
        above: E.top - g.top - a.gap - Ot,
        across: g.right - g.left - 2 * Ot
      };
    }
    function p(g) {
      const E = f(a.anchor), T = v(E, g);
      return r.value.w <= T.across && r.value.h <= Math.max(T.below, T.above) ? E : c();
    }
    const k = I(() => {
      if (!i.value) return l.value;
      const g = i.value, E = p(g), T = v(E, g), { w: D, h: J } = r.value, te = a.align === "auto" ? g.left + g.right > E.left + E.right : a.align === "right", re = cc(te ? g.right - D : g.left, E.left + Ot, Math.max(E.left + Ot, E.right - D - Ot)), he = J > T.below && T.above > T.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: m(a.maxHeight, T.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: m(a.maxHeight, T.below) };
      return { ...l.value, ...he, left: `${re}px`, maxWidth: m(a.maxWidth, T.across) };
    }), S = n, C = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function F(g) {
      const E = C(), T = E.indexOf(document.activeElement);
      E[(T + g + E.length) % E.length].focus();
    }
    const W = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => S("close") }, L = (g) => W[g.key] && (g.preventDefault(), W[g.key]()), $ = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let _ = 0;
    const y = new ResizeObserver(() => {
      cancelAnimationFrame(_), _ = requestAnimationFrame($);
    });
    ll(s, (g) => a.anchor && !a.anchor.contains(g.target) && S("close"));
    const B = (g, E) => ["top", "left", "right", "bottom"].some((T) => Math.abs(g[T] - E[T]) > 1), M = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let O = 0;
    function x() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || M(g)) return S("close");
        B(g, i.value) && (i.value = g);
      }
      O = requestAnimationFrame(x);
    }
    return Ie(() => {
      a.anchor && s.value && dc(s.value, a.anchor), $(), s.value && y.observe(s.value), !a.plain && C()[0] && C()[0].focus(), x();
    }), Le(() => {
      y.disconnect(), cancelAnimationFrame(O), cancelAnimationFrame(_);
    }), t({ element: s }), (g, E) => (u(), H(fs, {
      to: "body",
      disabled: !e.anchor
    }, [
      b("div", Fe({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: k.value,
        onKeydown: L
      }), [
        ue(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Xn = /* @__PURE__ */ Y(hc, [["__scopeId", "data-v-3d203970"]]), mc = { class: "split-button" }, pc = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = R(null), s = R(!1), o = () => s.value = !1;
    return (l, r) => (u(), h("span", mc, [
      N(de, {
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
      b("span", {
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
          default: P(() => [
            N(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), H(Xn, {
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
}, gc = /* @__PURE__ */ Y(pc, [["__scopeId", "data-v-c258494d"]]), rl = typeof document < "u" && document.documentElement.classList.contains("phone");
function Ha(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function il(e = window) {
  if (!Ha(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ha(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ua = "journal.stale-build-reload", vc = 'script[type="module"][src*="/assets/index-"]', Us = (e) => {
  var t;
  return ((t = e.querySelector(vc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function yc(e = document, t = (a, s) => Me.quietRead(a, s), n = () => il(window)) {
  const a = Us(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Us(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ca = "";
function bc(e, t = () => il(window)) {
  if (!e) return !1;
  const n = !!ca && ca !== e;
  return ca = e, n && t(), n;
}
const wc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function kc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ua) === e.message) return !1;
    t.setItem(Ua, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function xc(e = window.sessionStorage) {
  try {
    e.removeItem(Ua);
  } catch {
    return;
  }
}
const $c = 2e3, Mc = 3e4, He = Jn({ starting: !1, external: !1, late: !1, offline: !1 }), cl = () => He.starting, Sc = 3;
let yn = 0, za = 0, ul = 0, dl = [];
async function _c() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: He.external };
  }
}
let zs = null;
const Ec = () => zs ?? (zs = _c().finally(() => zs = null));
function Ac() {
  clearTimeout(za), clearTimeout(ul), za = 0, Object.assign(He, { starting: !1, external: !1, late: !1, offline: !1 }), dl.splice(0).forEach((e) => e()), yc();
}
async function Cc() {
  He.offline = !navigator.onLine;
  const e = await Ec();
  if (He.external = e.updating, yn = !e.restarting && !e.updating && e.reachable ? yn + 1 : 0, yn < Sc) return;
  yn = 0, (!bc(e.started_at) || Ha()) && Ac();
}
function fl() {
  za = setTimeout(async () => {
    await Cc(), He.starting && fl();
  }, $c);
}
function Oc() {
  He.starting || (He.starting = !0, He.offline = !navigator.onLine, fl(), ul = setTimeout(() => He.late = !0, Mc));
}
const Tc = () => He.starting ? new Promise((e) => dl.push(e)) : Promise.resolve();
function hl(e, t) {
  let n = 0, a = null, s = !1, o = !1;
  const l = () => {
    s = !1, n = Date.now(), o && (o = !1, i());
  }, r = () => {
    a = null;
    const c = e();
    n = Date.now(), c instanceof Promise && (s = !0, c.catch(() => {
    }).finally(l));
  }, i = () => {
    if (s) {
      o = !0;
      return;
    }
    if (a) return;
    const c = t - (Date.now() - n);
    c <= 0 ? r() : a = setTimeout(r, c);
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
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = hl(() => this.leave(), 0);
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
const st = "viewer.shell", bn = 2e4, Bc = 4, Vs = "/api/read-lines", Lc = 5e3, Nc = 403, Gs = "/api/repeated-lines", Dc = 10, jc = 2e3, Pc = 3e5, I5 = 6e5, wn = 6, qc = 500, Fc = "/journal/summary", Ks = "/api/server-state", Wc = 2e4, kn = rl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Hc = (e) => e.split("?")[0].endsWith(Fc), Va = (e, t) => Object.assign(new Error(t), { status: e });
async function Uc(e, t, n = Va) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const zc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Vc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Ys = (e) => e.split(" ").slice(0, 2).join(" "), Ze = "read", Rt = "write", Gc = "stream";
class Kc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = wn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Ys(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < jc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Dc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Gs, { method: "POST", headers: { ...kn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Gs, kind: Rt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Hi(n ? sl : 0);
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
  async sent(t, n, a, s = bn) {
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
    return this.out(Vs, { headers: kn }, [{ window: st, line: Vs, kind: Ze }], Lc).then(async (t) => {
      if (t.status === Nc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Va(t.status, "The read lines did not answer");
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Ys(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = wn;
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
    const r = a instanceof FormData, i = { method: t, headers: { ...kn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: zc(a) }, c = s || (r ? Pc : bn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Ze }], c)) : await this.sent(n, i, [{ window: st, line: n, kind: Rt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, qc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = wn, l = {}) {
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
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: st, line: t, kind: Ze }], bn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: kn });
    if (!n.ok) throw Va(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, wn, o).then((r) => (this.written(n), r)) : cl() && !Hc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
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
    return this.out(Ks, { cache: "no-store" }, [{ window: st, line: Ks, kind: Ze }], Wc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = bn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Ze : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ua = Symbol.for("journal.transport"), Me = globalThis[ua] ?? (globalThis[ua] = new Kc()), Yc = 0, Jc = "/api/lines", Zc = "/api/line", Js = 5e3, Zs = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Xs = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), da = (e) => JSON.stringify(e.line), Qs = () => new DOMException("cancelled", "AbortError");
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
    }).forEach((n) => n.reject(Qs())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Qs()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(Jc, Zs({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Xs(r.body, Ze)), Js);
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
    await this.alone(t, Ze), Date.now() - n < Js ? this.slow.delete(da(t.body)) : this.slow.add(da(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(Zc, Zs(t.body, t.signal), [Xs(t.body, n)], n === Ze ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const ml = new Xc(), Qc = "/api/window";
function eu(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Qc}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (c) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: c, headers: r }, [{ window: e, line: l, kind: Ze }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const tu = 150, nu = () => tu;
function ms(e, t, n = nu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class au {
  constructor() {
    this.following = Ke([]), this.held = /* @__PURE__ */ new Set();
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
      n.patterns.some((a) => ps(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ps(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const pl = /* @__PURE__ */ new Map();
class su {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ke({ buttons: [], missing: {} }), this.loading = Ke(!1), this.loaded = Ke(!1), this.failed = Ke(""), this.pending = null;
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
function B5(e, t) {
  const n = new su(e, t);
  return pl.set(e, n), n.load().catch(() => {
  }), n;
}
const gs = (e) => pl.get(e);
function ou(e, t, n) {
  const a = gs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function lu(e, t) {
  if (!e) return !0;
  const n = gs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const ru = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let gl = {};
async function L5(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (gl = (await t.json()).states);
}
const vs = (e, t) => {
  var n;
  return (n = gl[e]) == null ? void 0 : n[t];
}, vl = (e, t) => {
  var n;
  return ((n = vs(e, t)) == null ? void 0 : n.label) ?? ru(t);
}, yl = (e, t) => {
  var n;
  return ((n = vs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, iu = (e, t) => {
  var n;
  return ((n = vs(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, cu = Symbol("pane-page"), uu = Symbol("inspector-host"), bl = { 1: "refused", 2: "usage", 3: "fault" }, du = 100, fu = 50, hu = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, mu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function pu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = R({}), declared: c = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: p = [], links: k = {}, search: S = {}, readOnly: C = !1, shared: F = null }) {
  const W = /* @__PURE__ */ new Map(), L = new AbortController(), $ = R(!1), _ = performance.now();
  let y = 0, B = 0, M = () => {
  };
  const O = new Promise((J) => M = J);
  L.signal.addEventListener("abort", M, { once: !0 });
  const x = () => {
    clearTimeout(B), B = setTimeout(() => {
      y === 0 && ms(_, () => {
        $.value = !0, M();
      });
    }, fu);
  }, g = (J, te) => (y += 1, it(e, J, t, L.signal, te).finally(() => {
    y -= 1, x();
  })), E = (J, te) => (x(), O.then(() => L.signal.aborted ? nt : it(e, J, t, L.signal, te))), T = ({ only: J = [], state: te = {} } = {}) => (y += 1, vu(() => eu(e, t, J, te, L.signal), L.signal).finally(() => {
    y -= 1, x();
  })), D = (J, { unbatched: te = !1, deferred: re = !1 } = {}) => {
    const ie = W.get(J);
    if (ie && performance.now() - ie.at < du) return ie.answer;
    const he = re && !$.value ? E(J, te) : g(J, te);
    return W.set(J, { answer: he, at: performance.now() }), he;
  };
  return {
    answered: $,
    settle: x,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: I(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: v,
    sources: p,
    links: k,
    search: S,
    readOnly: C,
    shared: F,
    read: D,
    readKeys: T,
    run: (J) => it(e, J, t, L.signal),
    upload: (J) => bu(J, e, L.signal),
    cancel: () => L.abort(),
    signal: L.signal,
    subscriptions: l,
    follow: (J, te) => l.follow(e, J.filter((re) => o.some((ie) => ps(ie, re))), (re) => {
      W.clear(), te(re);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (J) => I(() => {
      var te;
      return i.value[J] ?? ((te = c.find((re) => re.key === J)) == null ? void 0 : te.default);
    }),
    setting: async (J, te) => {
      const re = await D(`window setting ${e} ${J}`);
      return re.ok ? re.value.value : te;
    },
    setOption: f,
    keep: (J, te) => it(e, ["window", "save-setting", e, J, JSON.stringify(te)], t, L.signal)
  };
}
function wl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nt = { ok: !1, failure: "cancelled", error: "" }, ys = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function kl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? nt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: bl[n.code] || "fault", error: wl(n.error) };
  } catch {
    return t != null && t.aborted ? nt : { ok: !1, failure: "unreachable", error: ys };
  }
}
const gu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: bl[e.code] || "fault", error: wl(e.error) };
async function vu(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, gu(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: ys };
  }
}
async function xl(e, t, n) {
  const a = await kl(() => ml.read(e, t, n), t);
  return a.failure !== "unreachable" || !cl() ? a : (await Tc(), t.aborted ? nt : xl(e, t, n));
}
function it(e, t, n, a = void 0, s = !1) {
  return Me.held(() => yu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : bs(t)));
}
async function yu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : bs(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => xl({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : kl(() => ml.write({ ...o, attribution: {
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
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: ys };
  }
}
function bs(e) {
  return [...e.matchAll(hu)].map(([t]) => t.replace(mu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const wu = (e) => `show-${e}`, N5 = (e, t, n) => e.filter((a) => {
  var s;
  return n(wu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), $l = "messages.chat", ku = {
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
    const n = e, a = t, s = R([]), o = R(""), l = I(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), r = I(() => s.value.find((c) => String(c.id) === n.value));
    async function i() {
      const c = await it($l, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (c, d) => (u(), h(G, null, [
      N(cn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (u(), h("p", ku, w(r.value.brief), 1)) : A("", !0),
      o.value ? (u(), h("p", xu, w(o.value), 1)) : A("", !0)
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
    return (t, n) => (u(), h("div", Su, [
      b("div", _u, [
        b("label", {
          class: "form-field-label",
          for: t.$props.for
        }, w(e.label), 9, Eu),
        t.$slots.aside ? (u(), h("span", Au, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (u(), h("p", Cu, w(e.help), 1)) : A("", !0)
    ]));
  }
}, Tu = /* @__PURE__ */ Y(Ou, [["__scopeId", "data-v-dd7cdcff"]]), Ga = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Ru = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Yn(), n = I(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => tt((u(), h("textarea", Fe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [j(Ga), j(t).value]
    ]);
  }
}), Iu = /* @__PURE__ */ Y(Ru, [["__scopeId", "data-v-e130a5b9"]]), Bu = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ds(), o = I(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (u(), H(Tu, {
      label: e.field.label,
      for: j(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        N(jt, { value: o.value }, {
          choice: P(() => [
            N(cn, {
              id: j(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            N(Mu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            N(Iu, {
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
}, ws = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), H(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        N(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Lu(e, t, n, a = () => window) {
  Ie(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Le(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Nu = (e, t = () => !0) => Lu("keydown", (n) => n.key === "Escape" && t() && e());
function Ml(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = R(!1), s = I(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Nu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Du = 80, Tt = Jn([]);
function Sl(e) {
  const t = Symbol("layer"), n = () => Tt.includes(t) && Tt.splice(Tt.indexOf(t), 1);
  return fe(
    e,
    (a) => {
      a && !Tt.includes(t) && Tt.push(t), a || n();
    },
    { immediate: !0 }
  ), Le(n), I(() => Du + Math.max(0, Tt.indexOf(t)));
}
let _l = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return _l = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
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
  Ie(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : _l, document.addEventListener("keydown", s), mt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Le(() => {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ml(a, n), r = Sl(s), i = R(null), c = R(null), d = R(null), f = ds(), m = R(!1), v = Date.now();
    n.modal && Pu(c, () => a("escape"), d);
    function p() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, zu);
    }
    function k(F) {
      !n.modal || Date.now() - v >= Uu || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const S = () => i.value && (i.value.scrollTop = i.value.scrollHeight), C = new MutationObserver(S);
    return fe(i, (F) => {
      C.disconnect(), F && n.follow && (C.observe(F, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Le(() => C.disconnect()), (F, W) => (u(), H(fs, { to: "body" }, [
      N(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: j(l)
      }, {
        default: P(() => [
          j(s) ? (u(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: j(r) }),
            onClick: xe(p, ["self"])
          }, [
            b("section", {
              ref_key: "panel",
              ref: c,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? j(f) : void 0,
              onKeydownCapture: k
            }, [
              e.bare ? A("", !0) : (u(), h("header", Fu, [
                b("h3", {
                  id: j(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, Wu),
                e.closable ? (u(), H(ws, {
                  key: 0,
                  onClick: j(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              b("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (u(), h("footer", Hu, [
                ue(F.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, qu)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, El = /* @__PURE__ */ Y(Vu, [["__scopeId", "data-v-6d1ecd98"]]), Gu = (e, t, n = {}) => bs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function un(e, t, n, a = {}) {
  try {
    return await lu(e.module, n) ? it($l, Gu(e, t, a), n) : { ok: !1, error: "" };
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
}, Yu = ["secrets", "plugins"], Al = Object.keys(Qn).filter((e) => !(rl && Yu.includes(e)));
I(() => Al.map((e) => ({ name: e, ...Qn[e] })));
const Pt = (e) => Qn[e], Cl = new Map(Al.flatMap((e) => [e, e.replace(/s$/, ""), Qn[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => Cl.get(String(e).toLowerCase()) || "", Ol = [...Cl.keys()].sort((e, t) => t.length - e.length).join("|"), Ju = {
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
    const n = e, a = t, s = R(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = R(!1), l = R(""), r = I(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = I(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = Pt(ut(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await un(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (u(), H(El, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: P(() => {
        var m;
        return [
          b("div", Ju, [
            (m = e.row) != null && m.title ? (u(), h("p", Zu, w(e.row.title), 1)) : A("", !0),
            (u(!0), h(G, null, Q(e.button.fields, (v) => (u(), H(Bu, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (p) => s.value[v.name] = p
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), h("p", Xu, w(l.value), 1)) : A("", !0),
            b("div", Qu, [
              N(de, {
                small: "",
                onClick: f[0] || (f[0] = (v) => a("close"))
              }, {
                default: P(() => [...f[2] || (f[2] = [
                  ee("Cancel", -1)
                ])]),
                _: 1
              }),
              N(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: P(() => [...f[3] || (f[3] = [
                  ee("Send", -1)
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
    return (t, n) => (u(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), h("span", nd, w(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (u(), h("span", ad, [
        b("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        b("small", null, w(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, St = /* @__PURE__ */ Y(sd, [["__scopeId", "data-v-fec99974"]]), od = ["aria-busy"], ld = {
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
    const n = e, a = t, s = I(() => gs(n.environment)), o = I(
      () => {
        var p;
        return !n.readOnly && ((p = s.value) == null ? void 0 : p.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = I(() => {
      var p;
      return !n.readOnly && ((p = s.value) == null ? void 0 : p.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = I(() => n.readOnly ? [] : ou(n.environment, n.name, n.row)), c = R(null), d = R(""), f = R(!1), m = (p) => [p.from ? `From ${p.from}` : "", p.tip].filter(Boolean).join(" · ");
    async function v(p) {
      if (f.value || n.readOnly) return;
      if (p.fields.length) {
        c.value = p;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const k = await un(p, n.row, n.environment);
      f.value = !1, d.value = k.ok ? "" : k.error;
      const S = p.label.toLowerCase() + (n.objectName && !p.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", k.ok ? "" : `Could not ${S}: ${k.error}`), k.ok && a("done");
    }
    return (p, k) => (u(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), h(G, { key: 0 }, [
        k[3] || (k[3] = b("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        N(de, {
          small: "",
          onClick: r
        }, {
          default: P(() => [...k[2] || (k[2] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? A("", !0) : (u(), h(G, { key: 1 }, [
        (u(!0), h(G, null, Q(i.value, (S) => (u(), h(G, {
          key: S.name
        }, [
          S.menu.length ? (u(), H(gc, {
            key: 0,
            small: "",
            variant: S.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": S.menu_label || "More ways",
            title: m(S),
            "data-button": S.name,
            onMain: (C) => v(S)
          }, {
            menu: P(({ close: C }) => [
              (u(!0), h(G, null, Q(S.menu, (F) => (u(), H(St, {
                key: F.label,
                description: F.description,
                onClick: (W) => (C(), v({ ...S, ...F, menu: [] }))
              }, {
                default: P(() => [
                  ee(w(F.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              ee(w(S.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), H(de, {
            key: 1,
            small: "",
            variant: S.primary ? "primary" : "ghost",
            bordered: !S.primary,
            icon: S.icon,
            disabled: f.value,
            title: m(S),
            "data-button": S.name,
            onClick: (C) => v(S)
          }, {
            default: P(() => [
              ee(w(S.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (u(), h("span", ld, w(d.value), 1)) : A("", !0),
        c.value && !e.readOnly ? (u(), H(td, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: k[0] || (k[0] = (S) => c.value = null),
          onDone: k[1] || (k[1] = (S) => a("done"))
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
    return (t, n) => (u(), h("span", cd, [
      N(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (u(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, ud)) : (u(), h("span", dd, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, D5 = /* @__PURE__ */ Y(fd, [["__scopeId", "data-v-d3240219"]]), hd = ["aria-checked", "aria-label", "title"], md = {
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
    return (a, s) => (u(), h("button", {
      type: "button",
      class: Z(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      b("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (u(), h("span", md, w(e.word), 1)) : A("", !0),
        s[1] || (s[1] = b("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), h("span", pd, w(e.word), 1)) : A("", !0)
    ], 10, hd));
  }
}, j5 = /* @__PURE__ */ Y(gd, [["__scopeId", "data-v-1bfb90f3"]]);
function Tl(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Dn(e, t) {
  return Tl(() => localStorage, e, t);
}
function Rl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function ks(e, t) {
  return Rl(() => localStorage, e, t);
}
function Il(e, t) {
  fe(t, (n) => ks(e, n), { deep: !0 });
}
function vd(e, t) {
  return Tl(() => sessionStorage, e, t);
}
function yd(e, t) {
  return Rl(() => sessionStorage, e, t);
}
const jn = "journal.environment", Bl = R(vd(jn, Dn(jn, "")));
function bd(e) {
  Bl.value = e, yd(jn, e), ks(jn, e);
}
const Pn = R(location.hash), eo = Ke(null), to = { integrations: "mcp", library: "team" };
function wd() {
  if (!eo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (to[n]) {
    location.replace(`#/${[to[n], ...a].join("/")}${t ? `?${t}` : ""}`), Pn.value = location.hash;
    return;
  }
  !n || eo.value(n) || (bd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Pn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Pn.value = location.hash, wd();
});
const Ka = I(() => {
  const [e, t = ""] = Pn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [c = "", d = "", f = ""] = r.split(":");
    return { table: c, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: Bl.value,
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
}), xs = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${xs.page(e)}?open=${t}`
};
function kd(e = "", t = 0, n = "") {
  location.hash = xs.page(e, t, n);
}
const xd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ll(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(xd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function P5(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Nl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ka.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  Ll([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function $d(e, t, n, a = 0, s = "") {
  if (e === Ka.value.env) return Nl(t, n, a, s);
  const o = Ka.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Ll([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? $d(a, s, Number(o), 0, t) : Nl(s, Number(o), 0, t);
}
function Md(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = Md(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function q5(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Sd = { class: "inspector-part" }, _d = { class: "inspector-part-title" }, Ed = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("section", Sd, [
      b("h4", _d, w(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, F5 = /* @__PURE__ */ Y(Ed, [["__scopeId", "data-v-0da7fa52"]]), Ad = {
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
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = R(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), H(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), h("p", Ad, w(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        ee(w(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), h(G, { key: 3 }, [
      (u(), H(ht(e.arrival ? el : "ul"), Fe(n.value, { class: "row-list" }), {
        default: P(() => [
          (u(!0), h(G, null, Q(e.rows, (r) => (u(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Cd))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), h("button", {
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
    const t = e, n = I(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = I(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), h("div", Rd, [
      e.loaded ? e.failure ? (u(), h("p", Id, w(e.failure), 1)) : e.rows.length ? (u(), h(G, { key: 3 }, [
        b("p", Ld, w(a.value) + " running", 1),
        (u(!0), h(G, null, Q(n.value, (l) => (u(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => j(qe)(`agents:${l.id}`)
        }, [
          b("span", Dd, "#" + w(l.id) + " " + w(l.session), 1),
          b("span", jd, w(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Nd))), 128))
      ], 64)) : (u(), h("p", Bd, w(e.none), 1)) : (u(), H(Et, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, W5 = /* @__PURE__ */ Y(Pd, [["__scopeId", "data-v-a01e5a17"]]), qd = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: Z(["badge", e.tone])
    }, w(e.text), 3));
  }
}, Dl = /* @__PURE__ */ Y(qd, [["__scopeId", "data-v-9e7e1157"]]), Fd = ["aria-valuenow", "aria-valuemax"], Wd = {
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
    return (a, s) => (u(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      b("span", {
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
    const n = e, a = t, s = I(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (u(), h("div", Ud, [
      (u(!0), h(G, null, Q(e.items, (i, c) => (u(), H(ht(i.open ? "button" : "div"), {
        key: `${c}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: P(() => [
          b("span", zd, w(i.label), 1),
          N(Hd, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          b("span", Vd, w(i.value) + w(o.value), 1)
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
    return (a, s) => (u(), h("div", Yd, [
      e.node.title ? (u(), h("span", Jd, w(e.node.title), 1)) : A("", !0),
      N(Kd, {
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
    }, a = e, s = t, o = I(() => n[a.node.type](a.node));
    return (l, r) => (u(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (u(!0), h(G, null, Q(e.node.children || [], (i, c) => (u(), H(Xl, {
        key: c,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Tn = /* @__PURE__ */ Y(Qd, [["__scopeId", "data-v-d142a3f4"]]), ef = {
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
    return (a, s) => (u(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), h("header", ef, [
        b("span", tf, w(e.node.title), 1),
        e.node.note ? (u(), h("span", nf, w(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      N(Tn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, sf = /* @__PURE__ */ Y(af, [["__scopeId", "data-v-67b72d40"]]), of = { processes: "process", memories: "memory", replies: "reply" }, Gt = (e) => (of[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ya = [], lf = 2e3, lt = /* @__PURE__ */ new Map(), rf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, cf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? Ya.unshift(e) : Ya.push(e), lt.clear();
}
function jl(e, t, n) {
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
  for (const a of Ya)
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
function no(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const mf = 24;
function pf(e) {
  const [t, , ...n] = e, a = no(t), s = n.map(no), o = (i) => [a, ...s].some((c) => (c[i] ?? "").length > mf) ? ' class="text-column"' : "", l = a.map((i, c) => `<th${o(c)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((c, d) => `<td${o(d)}>${en(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Pl = /^\s*(?:[-*+]|\d+[.)])\s+/, Ja = /^\s*(\d+)[.)]\s/, ao = (e) => e.match(/^\s*/)[0].length;
function ql(e) {
  const t = e[0].match(Ja), n = ao(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && ao(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${en(o.text)}${o.nested.length ? ql(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function gf(e, t) {
  const n = Ja.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Pl.test(e[s]) && Ja.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const so = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Fl(e) {
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
      const r = t.findIndex((c, d) => d > a && /^(```|~~~)/.test(c)), i = r < 0 ? t.length : r;
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
    if (so(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(pf(t.slice(a, r))), a = r;
      continue;
    }
    if (Pl.test(s)) {
      const r = gf(t, a);
      n.push(ql(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Fl(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !so(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
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
    a && n.push(Fl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
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
  const t = ii(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const f = s(c, d), m = e.read(`${Gt(c)} show ${d}`);
    n.set(f, m), m.then((v) => {
      n.get(f) === m && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${Gt(c).replace(/-/g, "_")}.*`], (d) => {
      const f = `${c}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const v = Number(m.slice(f.length));
        (!d.row_id || d.row_id === v) && o(c, v);
      }
    }));
  }
  function r(c, d) {
    l(c);
    const f = s(c, d);
    return !t.has(f) && !n.has(f) && o(c, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return ha.set(e, i), i;
}
function Wl() {
  const e = Ae(Te, null), t = e ? kf(e) : null;
  return (n, a = {}) => wf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Hl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, dn = (e) => String(e || "").replace(Hl, (t, n, a, s) => s), xf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), xn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, $f = /^Traceback \(most recent call last\):/m, Mf = 8;
function Ul(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Mf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Sf(e) {
  const t = [...e.matchAll(xf)].map((a) => a.index);
  if (xn.lastIndex = 0, !t.length || !xn.test(e)) return null;
  xn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(xn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Ul(n), tail: "" } : null;
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
  return { lead: e.slice(0, t.index), html: Ul([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = dn(e), n = _f(t) || Sf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Ef = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Af = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Cf = /[\w\]]\(/, Of = /^[\w$.[\]'"]+\s*=\s*[^=]/, Tf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Rf = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, If = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Bf = /[[({,]$/, Lf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Nf = /^(\t|\s{2,})\S/, Df = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, jf = /`[^`]+`/, Pf = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, qf = /[{}()[\];=<>$&|*\\@+^~%]/g, zl = /^\s*(?:[-*+]|\d+[.)])\s/, Ff = /^\s*>/, Wf = /^\s*\|/, Hf = 0.6, Uf = 0.4, zf = 5, Vf = 0.03, Vl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= zf && t.every((n) => Pf.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(qf) ?? []).length / e.length < Vf;
}, ma = (e) => {
  const t = e.trim();
  return jf.test(t) ? !1 : [Ef, Af, Cf, Of, Tf, Rf, If, Bf, Lf].some((n) => n.test(t)) || /[;{}]$/.test(t) || Nf.test(e) && !zl.test(e) && !Vl(e);
};
function Gf(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || zl.test(t[0]) || t.every((o) => Ff.test(o) || Wf.test(o))) return "text";
  const n = t.filter((o) => !Df.test(o.trim()));
  if (t.length === 1) return !n.length || ma(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ma).length, s = n.filter((o) => !ma(o) && Vl(o)).length;
  return a >= n.length * Hf && s <= n.length * Uf ? "code" : "text";
}
const Za = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Kf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Yf = `${Za} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Jf = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Zf = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", oo = {
  js: { keywords: Za, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Kf, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Yf, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Za, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
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
function lo(e, t, n) {
  return n && e.startsWith(n, t);
}
function Qf(e, t) {
  const n = oo[Xf[t] ?? t] || oo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const c = e.indexOf(`
`, o), d = e.slice(o, c < 0 ? e.length : c);
      l(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), l("plain", c < 0 ? "" : `
`), o = c < 0 ? e.length : c + 1;
      continue;
    }
    if (lo(e, o, n.line) || n.hash && r === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && lo(e, o, n.block[0])) {
      const c = e.indexOf(n.block[1], o + n.block[0].length), d = c < 0 ? e.length : c + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const i = (n.triple || []).find((c) => e.startsWith(c, o));
    if (i) {
      const c = e.indexOf(i, o + 3), d = c < 0 ? e.length : c + 3;
      l("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(r)) {
      let c = o + 1;
      for (; c < e.length && e[c] !== r && (r === "`" || e[c] !== `
`); ) c += e[c] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(c + 1)) ? "property" : "string", e.slice(o, c + 1)), o = c + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const c = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", c[0]), o += c[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
      continue;
    }
    if (/\d/.test(r)) {
      const c = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", c[0]), o += c[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const c = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + c)), o += c;
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
const nh = 1500, ro = /* @__PURE__ */ new WeakMap();
async function ah(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await th(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(ro.get(t)), ro.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, nh)
  )));
}
typeof document < "u" && document.addEventListener("click", ah, !0);
const sh = /\n\s*\n/, oh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, lh = /^\s*(`{3,}|~{3,})\s*$/, rh = /^\s{4,}\S/, ih = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Xa = /^\s*(?:[-*+]|\d+[.)])\s/, Gl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, ch = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function $s(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function uh(e) {
  const t = $s(e.join(`
`));
  return (ch.find(([, n]) => n.test(t)) || ["text"])[0];
}
const dh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Gl.test(t) && !Xa.test(t);
}, fh = (e, t) => Xa.test(t) || Xa.test([...e].reverse().find((n) => n.trim()) || "");
function Ms(e, t) {
  const n = t || uh(e), a = eh($s(e.join(`
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
  return Ms(a.map(dn), n ? n.toLowerCase() : "");
}
function ph(e) {
  const t = e.split(sh).map((l) => ({ paragraph: l, type: Gf($s(l).split(`
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
      s(), n.push(Ms(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(dn), "")), o = l;
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
      const c = hh(n, l, r[2]);
      o(), a.push(mh(n.slice(l + 1, c), r[1], r[3])), l = c + 1;
      continue;
    }
    const i = dh(s) ? ih : rh;
    if (!t && i.test(n[l]) && !fh(s, n[l])) {
      let c = l;
      for (; c < n.length && (i.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Gl.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(Ms([...d, ...n.slice(l, c)].map(dn), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => gh(e, t.document));
const qn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Kl = (e) => `${e.table}:${e.id}`, io = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", pa = 80;
function co(e) {
  return e.length <= pa ? e : `${e.slice(0, pa + 1).replace(/\s+\S*$/, "") || e.slice(0, pa)}…`;
}
const uo = {
  messages: (e) => co(io(e.text)),
  comments: (e) => co(io(e.text)),
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
}, vh = (e) => (uo[e.table] ? uo[e.table](e) : e.title || "") || "", _t = (e) => qn(e.created_at), Yl = (e) => qn(e.updated_at) || _t(e), yh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, bh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function wh(e) {
  const t = yh.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = bh.exec(e), a = n && ut(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function kh(e, t, n, a) {
  const s = jl(a, e, t), o = dn(s ? vh(s) : n);
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
  const n = Mh.exec(e), [, a, s, o, l, r] = n || [], i = n && ut(a || o), c = i && jl(t, i, Number(s || l));
  if (i !== "messages" || !c || !(c.files || []).includes(r)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(r)}`, f = `${Pt(i).title} ${c.id} · ${et(r)}`, m = $h(r) ? `<img class="file-card-image" src="${d}" alt="${et(r)}">` : "";
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
const fo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${xs.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(Hl, (n, a, s, o) => fo[a] ? fo[a](s, o, t) : o)
);
const Ch = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Jl = new RegExp(`\\b(${Ol}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Zl = new RegExp(`\\b(${Ol}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Oh = new RegExp(`<code>((?:${Jl.source}|${Zl.source}))</code>`, "gi"), Th = (e) => e.replace(Oh, "$1"), Rh = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Ih = (e) => e.replace(Zl, (t, n, a) => a.replace(/\d+/g, (s) => Rh(n.replace(/s$/i, ""), s))), Bh = (e) => Ih(e).replace(
  Jl,
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
    const t = e, n = Wl(), a = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => j(It) && j(It)(...l)),
      innerHTML: a.value
    }, null, 8, Lh)) : (u(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => j(It) && j(It)(...l)),
      innerHTML: a.value
    }, null, 8, Nh));
  }
}, xt = /* @__PURE__ */ Y(Dh, [["__scopeId", "data-v-d8e75741"]]), jh = { class: "fact" }, Ph = { class: "fact-label" }, qh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("div", jh, [
      b("span", Ph, w(e.label), 1),
      N(xt, {
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
    return (a, s) => (u(), h("div", Wh, [
      (u(!0), h(G, null, Q(e.items, (o, l) => (u(), H(ht(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          b("span", Hh, w(o.label), 1),
          o.badge ? (u(), H(Dl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (u(), h("span", Uh, w(o.note), 1)) : A("", !0)
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
    const n = e, a = t, s = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), h("div", Gh, [
      b("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (u(!0), h(G, null, Q(e.columns, (r) => (u(), h("span", {
          key: r,
          class: "cell"
        }, w(r), 1))), 128))
      ], 4),
      (u(!0), h(G, null, Q(e.rows, (r, i) => (u(), H(ht(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (c) => r.open && a("open", r.open)
      }, {
        default: P(() => [
          (u(!0), h(G, null, Q(r.cells, (c, d) => (u(), h("span", {
            key: d,
            class: "cell"
          }, w(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), h("div", Kh, w(e.empty), 1)) : A("", !0)
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
    return (a, s) => (u(), H(ht(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        b("span", Zh, w(e.value), 1),
        b("span", Xh, w(e.label), 1),
        e.note ? (u(), h("span", Qh, w(e.note), 1)) : A("", !0)
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
    return (o, l) => (u(), H(jt, {
      value: e.node.type
    }, {
      stack: P(() => [
        N(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: P(() => [
        N(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: P(() => [
        N(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        N(sf, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        b("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
      divider: P(() => [...l[2] || (l[2] = [
        b("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        N(tm, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        N(Xd, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        N(Jh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        N(Vh, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        N(xt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        N(Fh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        N(Dl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        b("pre", nm, [
          b("code", null, w(e.node.text), 1)
        ])
      ]),
      file: P(() => [
        b("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Xl = /* @__PURE__ */ Y(am, [["__scopeId", "data-v-cbdcf540"]]), sm = { class: "dashboard" }, om = { class: "trail" }, lm = ["onClick"], rm = {
  key: 0,
  class: "gone",
  role: "status"
}, im = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = R(!!n.page && !s(n.page)), l = R(n.page && !o.value ? [n.page] : []), r = I(() => l.value.at(-1) || n.document.start), i = I(() => (n.document.pages || {})[r.value] || null), c = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return fe(
      () => n.document.start,
      () => l.value = []
    ), (m, v) => (u(), h("div", sm, [
      e.document.broken ? (u(), H(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          ee(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), H(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          ee(w(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (u(), h(G, { key: 2 }, [
        b("nav", om, [
          b("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: v[0] || (v[0] = (p) => f(0))
          }, w(c(e.document.start)), 3),
          (u(!0), h(G, null, Q(l.value, (p, k) => (u(), h(G, {
            key: `${k}-${p}`
          }, [
            v[2] || (v[2] = b("span", { class: "sep" }, "/", -1)),
            b("button", {
              type: "button",
              class: Z(["step", { current: k === l.value.length - 1 }]),
              onClick: (S) => f(k + 1)
            }, w(c(p)), 11, lm)
          ], 64))), 128))
        ]),
        o.value ? (u(), h("p", rm, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        N(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (u(), h("div", {
              key: r.value,
              class: "page"
            }, [
              N(Xl, {
                node: i.value.view,
                onOpen: d,
                onFile: v[1] || (v[1] = (p) => a("file", p))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, cm = /* @__PURE__ */ Y(im, [["__scopeId", "data-v-fbe83734"]]), Ql = {
  runningTool: 1e3,
  agentCommand: 5e3,
  planCard: 3e3,
  openPanel: 5e3,
  documentWithNoEvents: 6e4,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4,
  systemLogs: 5e3
};
function um(e, t) {
  const n = ze(), a = hl(e, Ql.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Ie(e), pt(() => {
    s(), a.cancel();
  });
}
const dm = 2e3;
function Ss(e, t, n = dm) {
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
  }, c = async () => {
    s || document.hidden || o || (clearTimeout(a), await r(), i());
  };
  Ie(async () => {
    document.addEventListener("visibilitychange", c), await l(e), i();
  }), pt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const fm = {
  key: 0,
  class: "window-failure"
}, hm = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ze(), o = R(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? um(l, n.events) : Ss(l, () => !0, Ql.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (u(), h("p", fm, w(o.value.error), 1)) : o.value ? (u(), H(cm, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : A("", !0);
  }
}, ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Pe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, mm = 6;
function _s(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const pm = (e) => {
  const t = _s(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function gm(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const c = s.get(r[1]);
      c === "open" ? a.add(i) : c || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function vm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function ym(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), c = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, v) => m + v, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => c(d) - c(f));
  };
  for (let l = 0; l < mm; l++) {
    const r = l % 2 === 0, i = a.map((c, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((c) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function bm(e, t) {
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
function wm(e) {
  const t = [...new Set(e.flatMap(([L, $]) => [L, $]))], n = new Set(e.map(([, L]) => L)), a = t.filter((L) => !n.has(L)), s = gm(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((L, $) => !s.has($)), l = vm(t, o), r = ym(t, o, l), i = new Map(t.map((L) => [L, pm(L)])), c = r.map((L) => L.reduce(($, _) => $ + i.get(_).width, 0) + je.across * (L.length - 1)), d = Math.max(...c) + je.margin * 2, f = xm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let v = je.margin;
  r.forEach((L, $) => {
    let _ = (d - c[$]) / 2;
    const y = Math.max(...L.map((B) => i.get(B).height));
    L.forEach((B) => {
      const M = i.get(B);
      m.set(B, { ...M, x: _, y: v + (y - M.height) / 2 }), _ += M.width + je.across;
    }), v += y + (f[$] ?? je.down);
  });
  const p = e.map(([L, $, _], y) => ({ from: L, to: $, label: _ || "", back: s.has(y) || l.get($) <= l.get(L) }));
  bm(p, m);
  const k = p.map((L) => $m(L, m.get(L.from), m.get(L.to))), S = [...m.values()], C = Em(k, S), F = Math.max(v - je.down, ...C.filter((L) => L.label).map((L) => L.label.y + L.label.height));
  return { width: Math.max(d - je.margin, ...C.filter((L) => L.label).map((L) => L.label.x + L.label.width)) + je.margin, height: F + je.margin, nodes: S, arrows: C };
}
const km = (e) => e ? _s(e, Pe.lineChars).length * Pe.line + Pe.pad * 2 : 0;
function xm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += km(l) + je.labelSpace);
  }), a.map((s) => Math.max(je.down, s));
}
function $m(e, t, n) {
  const a = e.label ? _s(e.label, Pe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Pe.charWidth + Pe.pad * 2 : 0, o = a.length * Pe.line + (a.length ? Pe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: c - d }, { x: i, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${c - d} ${i} ${c}` };
}
const Mm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Sm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], _m = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Pe.line);
function Em(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, c) => {
      const d = Mm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, r = _m.flatMap((i) => Sm.map((c) => s(c, i))).find((i) => !n.some((c) => ho(i, c))) ?? s(0.5, 0);
    for (; n.some((i) => ho(r, i)); ) r.y += Pe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Pe.line, pad: Pe.pad } };
  });
}
const ho = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Am = { class: "flowchart-tools" }, Cm = ["width", "height", "viewBox", "aria-label"], Om = ["d"], Tm = ["x", "y", "width", "height"], Rm = ["x", "y"], Im = ["x", "dy"], Bm = {
  key: 0,
  class: "flowchart-label"
}, Lm = ["x", "y", "width", "height"], Nm = ["x", "y"], Dm = ["x", "dy"], jm = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => wm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = R(null), r = R({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function c() {
      var C;
      const k = (C = l.value) == null ? void 0 : C.getBoundingClientRect();
      if (!(k != null && k.width)) return;
      const S = Math.min(k.width / s.value.width, k.height / s.value.height, 1.5);
      r.value = { zoom: S, x: (k.width - s.value.width * S) / 2, y: (k.height - s.value.height * S) / 2 };
    }
    function d(k, S, C) {
      const { zoom: F, x: W, y: L } = r.value, $ = Math.min(o.most, Math.max(o.least, F * k));
      r.value = { zoom: $, x: S - (S - W) * $ / F, y: C - (C - L) * $ / F };
    }
    function f(k) {
      const S = l.value.getBoundingClientRect();
      d(k, S.width / 2, S.height / 2);
    }
    function m(k) {
      const S = l.value.getBoundingClientRect();
      k.ctrlKey || k.metaKey ? d(k.deltaY < 0 ? o.step : 1 / o.step, k.clientX - S.left, k.clientY - S.top) : r.value = { ...r.value, x: r.value.x - k.deltaX, y: r.value.y - k.deltaY };
    }
    function v(k) {
      var S, C, F;
      k.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), i = { x: k.clientX - r.value.x, y: k.clientY - r.value.y }, (F = (C = l.value).setPointerCapture) == null || F.call(C, k.pointerId);
    }
    function p(k) {
      i && (r.value = { ...r.value, x: k.clientX - i.x, y: k.clientY - i.y });
    }
    return Ie(c), (k, S) => (u(), H(El, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (C) => a("close"))
    }, {
      default: P(() => [
        b("div", Am, [
          N(de, {
            small: "",
            onClick: S[0] || (S[0] = (C) => f(o.step))
          }, {
            default: P(() => [...S[5] || (S[5] = [
              ee("Zoom in", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: S[1] || (S[1] = (C) => f(1 / o.step))
          }, {
            default: P(() => [...S[6] || (S[6] = [
              ee("Zoom out", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: c
          }, {
            default: P(() => [...S[7] || (S[7] = [
              ee("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        b("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(m, ["prevent"]),
          onPointerdown: v,
          onPointermove: p,
          onPointerup: S[2] || (S[2] = (C) => Hs(i) ? i.value = null : i = null),
          onPointercancel: S[3] || (S[3] = (C) => Hs(i) ? i.value = null : i = null)
        }, [
          (u(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            S[8] || (S[8] = b("defs", null, [
              b("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                b("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (u(!0), h(G, null, Q(s.value.arrows, (C, F) => (u(), h("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Om))), 128)),
            (u(!0), h(G, null, Q(s.value.nodes, (C) => (u(), h("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              b("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, Tm),
              b("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (u(!0), h(G, null, Q(C.lines, (F, W) => (u(), h("tspan", {
                  key: W,
                  x: C.x + C.width / 2,
                  dy: W ? C.line : 0
                }, w(F), 9, Im))), 128))
              ], 8, Rm)
            ]))), 128)),
            (u(!0), h(G, null, Q(s.value.arrows, (C, F) => (u(), h(G, {
              key: `label-${F}`
            }, [
              C.label ? (u(), h("g", Bm, [
                b("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, Lm),
                b("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (u(!0), h(G, null, Q(C.label.lines, (W, L) => (u(), h("tspan", {
                    key: L,
                    x: C.label.x + C.label.width / 2,
                    dy: L ? C.label.line : 0
                  }, w(W), 9, Dm))), 128))
                ], 8, Nm)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, Cm))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Pm = /* @__PURE__ */ Y(jm, [["__scopeId", "data-v-51d24cfe"]]), mo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', po = {
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
  agent: mo,
  worker: mo,
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
}, qm = ["innerHTML"], Fm = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => po[t.name] || po.dot);
    return (a, s) => (u(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, qm));
  }
}, ft = /* @__PURE__ */ Y(Fm, [["__scopeId", "data-v-beb5935c"]]), Wm = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      N(ft, { name: "fold" })
    ], 2));
  }
}, Mt = /* @__PURE__ */ Y(Wm, [["__scopeId", "data-v-d03899bb"]]), Hm = ["data-tip", "aria-label"], Um = {
  key: 0,
  class: "mact-word"
}, zm = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      N(ft, { name: "open" }),
      e.open ? (u(), h("span", Um, w(e.label), 1)) : A("", !0),
      n[0] || (n[0] = b("span", { class: "hit" }, null, -1))
    ], 10, Hm));
  }
}, er = /* @__PURE__ */ Y(zm, [["__scopeId", "data-v-3b292e09"]]), tr = 120, Rn = 280, nr = 160, Vm = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Gm = ["leaving", "resizing", "entering"];
function Qa(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Km(e) {
  const t = Gm.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Qa(e);
  return e.classList.add(...t), n;
}
function ar(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = R(t()), s = R("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const v = Km(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, v);
  }
  function c(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const p = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, i(f, Qa(f)));
    });
    return p.observe(m), p;
  }
  async function d(f) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || Vm()) {
      a.value = f;
      return;
    }
    const p = Qa(m);
    if (l(m, p), s.value = "leaving", await n(tr), v !== o) return;
    a.value = f, s.value = "resizing", await mt(), i(m, p);
    const k = c(m);
    await n(Rn), k == null || k.disconnect(), v === o && (r(m), s.value = "entering", await n(nr), v === o && (s.value = ""));
  }
  return fe(t, (f) => d(f)), pt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Ym = { class: "growing-card-top" }, Jm = ["aria-expanded"], Zm = { class: "growing-card-avatar" }, Xm = { class: "growing-card-title" }, Qm = { class: "growing-card-more" }, e1 = { class: "growing-card-body" }, t1 = {
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
    const n = e, a = t, s = R(!1), o = R(null), { folded: l, phase: r } = ar(o, () => !s.value), i = I(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = I(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (u(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", j(r), { open: !j(l), bad: e.bad, incoming: e.incoming }])
    }, [
      b("div", Ym, [
        b("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          b("span", Zm, [
            e.bad ? (u(), H(ft, {
              key: 0,
              name: "cross"
            })) : i.value ? (u(), h(G, { key: 1 }, [
              ee(w(i.value), 1)
            ], 64)) : (u(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          b("span", Xm, w(e.title), 1),
          N(Mt, { open: s.value }, null, 8, ["open"])
        ], 8, Jm),
        e.action ? (u(), H(er, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : A("", !0),
        e.commentable ? (u(), h("button", {
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
      b("div", Qm, [
        b("div", e1, [
          (u(!0), h(G, null, Q(c.value, (m, v) => (u(), h("p", {
            key: v,
            class: "growing-card-text"
          }, w(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, n1 = /* @__PURE__ */ Y(t1, [["__scopeId", "data-v-f2b4930d"]]), a1 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, s1 = { class: "md inline" }, o1 = ["disabled", "title", "onClick"], l1 = {
  key: 1,
  class: "message-links-many"
}, r1 = ["aria-expanded"], i1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, c1 = ["disabled", "onClick"], u1 = { class: "row-pill message-links-chip" }, d1 = { class: "message-links-title" }, f1 = { key: 0 }, ga = 3, h1 = "task", m1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => n.total || n.links.length), o = I(() => n.links.every((m) => m.endpoint.model === h1) ? "tasks" : "items"), l = R(!1), r = R(null);
    ll(r, () => l.value = !1);
    const i = () => l.value = !l.value, c = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      c(m) || (l.value = !1, qe(m.endpoint.open_ref));
    }
    return (m, v) => (u(), h("div", {
      ref_key: "line",
      ref: r,
      class: Z(["message-links", { many: s.value > ga, three: s.value === ga, open: l.value }]),
      "data-message-links": ""
    }, [
      N(ft, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), h("span", a1, [
        b("span", s1, [
          v[1] || (v[1] = ee("Linked: ", -1)),
          (u(!0), h(G, null, Q(e.links, (p) => (u(), h("button", {
            key: `${p.endpoint.model}:${p.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(p),
            title: p.endpoint.title,
            onClick: (k) => f(p)
          }, [
            ee(w(p.endpoint.model.replaceAll("_", " ")) + " " + w(p.endpoint.id), 1),
            d(p) ? (u(), h(G, { key: 0 }, [
              ee(" (" + w(d(p)) + ")", 1)
            ], 64)) : A("", !0),
            c(p) ? (u(), h(G, { key: 1 }, [
              ee(" (unavailable)")
            ], 64)) : A("", !0)
          ], 8, o1))), 128))
        ])
      ])) : A("", !0),
      s.value >= ga ? (u(), h("span", l1, [
        b("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          ee(w(s.value) + " linked " + w(o.value) + " ", 1),
          N(Mt, { open: l.value }, null, 8, ["open"])
        ], 8, r1)
      ])) : A("", !0),
      l.value ? (u(), h("div", i1, [
        (u(!0), h(G, null, Q(e.links, (p) => (u(), h("button", {
          key: `${p.endpoint.model}:${p.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(p),
          onClick: (k) => f(p)
        }, [
          b("span", u1, w(p.endpoint.model.replaceAll("_", " ")) + " " + w(p.endpoint.id), 1),
          b("span", d1, w(p.endpoint.title), 1),
          b("span", null, w(d(p)), 1),
          c(p) ? (u(), h("span", f1, "Unavailable")) : A("", !0)
        ], 8, c1))), 128))
      ])) : A("", !0),
      N(Zn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: v[0] || (v[0] = (p) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, p1 = /* @__PURE__ */ Y(m1, [["__scopeId", "data-v-e9bc783c"]]), g1 = ["title", "aria-label"], v1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, y1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, b1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), h("svg", v1, [
        o[0] || (o[0] = b("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), h("path", y1)) : A("", !0)
      ]))
    ], 10, g1));
  }
}, w1 = /* @__PURE__ */ Y(b1, [["__scopeId", "data-v-6dc92808"]]);
function k1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function sr(e, t = Date.now()) {
  const n = k1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const x1 = 36e5;
function H5(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / x1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function or(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function go(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const va = (e) => String(e).padStart(2, "0");
function $1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${va(t % 60)}s` : `${Math.floor(t / 3600)}h ${va(Math.floor(t % 3600 / 60))}m ${va(t % 60)}s`;
}
const M1 = "img,pre,table";
function S1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function _1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function E1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(M1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = S1(_1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function A1(e, t) {
  let n = null;
  const a = () => e.value && E1(e.value);
  Ie(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Le(() => n == null ? void 0 : n.disconnect()), fe(t, a, { flush: "post" });
}
const C1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function O1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const $n = /* @__PURE__ */ new WeakMap(), Ge = "work", Ht = "sent", T1 = 50, vo = () => ({ rows: R([]), total: R(0), next: R(null), loading: R(!1), failure: R(""), version: 0 });
function R1(e) {
  var f;
  if ($n.has(e)) return $n.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var v;
    return ((v = e.visible) == null ? void 0 : v.value) !== !1 && [...m.views].some((p) => p.visible);
  };
  async function o(m, v, p = 1) {
    const k = m[v], S = ++k.version;
    k.loading.value = !0, k.failure.value = "";
    const C = v === Ge ? "--type about --type edited --group-counterparts" : "--type sent_to", F = `link list --source message:${m.id} ${C} --page ${p} --page-size ${v === Ge ? 10 : 25}`;
    try {
      const W = await e.read(F);
      if (t.get(m.id) !== m || k.version !== S) return;
      if (!W.ok) {
        k.failure.value = W.error;
        return;
      }
      const L = v === Ge ? W.value.counterparts ?? [] : W.value.rows ?? [], $ = p === 1 ? L : [...k.rows.value, ...L], _ = v === Ge ? (y) => `${y.endpoint.model}:${y.endpoint.id}` : (y) => y.id ?? y.target_id;
      k.rows.value = [...new Map($.map((y) => [_(y), y])).values()], k.total.value = W.value.total ?? k.rows.value.length, k.next.value = W.value.next_page ?? null;
    } catch (W) {
      k.version === S && (k.failure.value = W.message);
    } finally {
      k.version === S && (k.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((v) => t.get(v)).filter((v) => v && s(v));
    n.clear();
    for (const v of m) {
      const p = [...v.dirty];
      v.dirty.clear();
      for (const k of p) o(v, k);
    }
  }
  function r(m, v = [Ge, Ht]) {
    for (const p of v) m.dirty.add(p);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const v = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), p = m.link_types ?? (m.link_type ? [m.link_type] : []), k = p.length ? [Ge, Ht].filter((C) => C === Ge ? p.some((F) => ["about", "edited"].includes(F)) : p.includes("sent_to")) : [Ge, Ht];
    if (!k.length) return;
    const S = v.length ? [...new Set(v.filter((C) => C.model === "message").map((C) => C.id))].map((C) => t.get(C)).filter(Boolean) : [...t.values()].filter(s).slice(0, T1);
    for (const C of S) r(C, k);
  }
  const c = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, v) {
      let p = t.get(m);
      return p || (p = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ge, Ht]), work: vo(), sent: vo() }, t.set(m, p)), p.views.add(v), p.dirty.size && r(p, [...p.dirty]), p;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, v) {
      m.views.delete(v), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), c == null || c(), $n.delete(e));
    },
    more(m, v) {
      const p = m == null ? void 0 : m[v];
      if (p != null && p.next.value && !p.loading.value) return o(m, v, p.next.value);
    }
  };
  return $n.set(e, d), d;
}
function I1(e, t, n) {
  const a = Ke(null);
  let s = null;
  const o = fe(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = R1(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((v) => {
      c.visible = v.some((p) => p.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = fe(n, (v) => {
      f == null || f.disconnect(), v && (f == null || f.observe(v));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, c), a.value = null;
    });
  }, { immediate: !0 });
  return hs(o), {
    links: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: I(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: I(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: I(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ge),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ht)
  };
}
const B1 = ["data-incoming", "data-ref"], L1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], N1 = { class: "message-body" }, D1 = ["title"], j1 = ["innerHTML"], P1 = ["title"], q1 = ["innerHTML"], F1 = {
  class: "message-faces",
  "data-message-faces": ""
}, W1 = ["title", "data-face", "onClick"], H1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, U1 = ["title", "data-reaction", "onClick"], z1 = {
  key: 0,
  class: "message-reaction-count"
}, V1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, G1 = ["href", "title"], K1 = ["src", "alt"], Y1 = ["href"], J1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Z1 = ["disabled", "data-sent-worker", "title", "onClick"], X1 = { class: "message-foot" }, Q1 = { class: "message-time" }, ep = {
  class: "message-id",
  "data-message-id": ""
}, tp = 140, np = 2, ap = 1500, sp = "An earlier message", op = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(!1), o = R(null), l = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => {
      const [ve, me] = (n.message.commented_row || ":").split(":"), ae = ut(ve);
      return ae ? { ref: `${ae}:${me}`, label: `${Pt(ae).title.toLowerCase()} ${me}` } : null;
    }), i = I(() => n.message.worker_id ?? null), c = R(!1), d = I(() => i.value !== null && ((n.message.text ?? "").length > tp || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > np)), f = I(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, ap);
    }
    const v = Wl(), p = I(() => v(n.message.text ?? "")), k = I(() => JSON.parse(n.message.flowchart_edges || "[]")), S = R(!1), C = I(() => v(n.quote || sp));
    function F() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    A1(o, () => `${n.message.text} ${n.quote}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, L = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, $ = I(() => JSON.parse(n.message.captions || "{}")), _ = I(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: L(ve), isImage: W.test(ve), title: $.value[ve] || ve }))), y = I(() => or(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), B = Ae(Te, null), { links: M, total: O, more: x, loading: g, failure: E, sentTo: T, sentMore: D, sentLoading: J, sentFailure: te, loadMore: re, loadSent: ie } = I1(B, () => l.value && !n.message.local ? n.message.id : null, o), he = R(!1), Ce = I(() => O1(n.message.reactions));
    function We(ve) {
      he.value = !1, a("react", n.message, ve);
    }
    return (ve, me) => e.message.peer || e.message.recipient ? (u(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      N(n1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: me[0] || (me[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, B1)) : (u(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      b("div", N1, [
        b("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: me[6] || (me[6] = (...ae) => j(It) && j(It)(...ae))
        }, [
          r.value ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: me[1] || (me[1] = xe((ae) => j(qe)(r.value.ref), ["stop"]))
          }, [
            N(ye, {
              name: "bubble",
              size: 12
            }),
            b("span", null, "Comment on " + w(r.value.label), 1)
          ], 8, D1)) : A("", !0),
          e.message.parent_id ? (u(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(F, ["stop"]),
            innerHTML: C.value
          }, null, 8, j1)) : A("", !0),
          i.value !== null ? (u(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: me[2] || (me[2] = xe((ae) => j(qe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, P1)) : A("", !0),
          b("div", {
            class: Z({ "message-folded": d.value && !c.value }),
            "data-message-text": "",
            innerHTML: p.value
          }, null, 10, q1),
          d.value ? (u(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: me[3] || (me[3] = xe((ae) => c.value = !c.value, ["stop"]))
          }, w(c.value ? "Show less" : "Show more"), 1)) : A("", !0),
          k.value.length ? (u(), h(G, { key: 4 }, [
            b("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: me[4] || (me[4] = (ae) => S.value = !0)
            }, "Open the flowchart"),
            S.value ? (u(), H(Pm, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: me[5] || (me[5] = (ae) => S.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        b("div", {
          class: Z(["message-tools", { picking: he.value }]),
          "data-message-tools": ""
        }, [
          he.value ? (u(), h(G, { key: 0 }, [
            b("div", F1, [
              (u(!0), h(G, null, Q(j(C1), (ae) => (u(), h("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Ye) => We(ae)
              }, w(ae), 9, W1))), 128))
            ]),
            b("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: me[7] || (me[7] = (ae) => he.value = !1)
            }, [
              N(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), h(G, { key: 1 }, [
            b("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: me[8] || (me[8] = (ae) => he.value = !0)
            }, "React"),
            b("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: me[9] || (me[9] = (ae) => a("reply", e.message))
            }, "Reply"),
            b("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, w(s.value ? "Copied" : "Copy"), 1),
            f.value ? (u(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: me[10] || (me[10] = (ae) => a("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      Ce.value.length ? (u(), h("div", H1, [
        (u(!0), h(G, null, Q(Ce.value, (ae) => (u(), h("button", {
          key: ae.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Ye) => a("react", e.message, ae.emoji)
        }, [
          ee(w(ae.emoji) + " ", 1),
          ae.count > 1 ? (u(), h("span", z1, w(ae.count), 1)) : A("", !0)
        ], 10, U1))), 128))
      ])) : A("", !0),
      _.value.length ? (u(), h("div", V1, [
        (u(!0), h(G, null, Q(_.value, (ae) => (u(), h(G, {
          key: ae.name
        }, [
          ae.isImage ? (u(), h("a", {
            key: 0,
            href: ae.address,
            target: "_blank",
            class: "message-image",
            title: ae.title
          }, [
            b("img", {
              src: ae.address,
              alt: ae.name,
              "data-figure-picture": ""
            }, null, 8, K1)
          ], 8, G1)) : (u(), h("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, w(ae.name), 9, Y1))
        ], 64))), 128))
      ])) : A("", !0),
      j(T).length ? (u(), h("div", J1, [
        N(ye, {
          name: "send",
          size: 12
        }),
        (u(!0), h(G, null, Q(j(T), (ae) => (u(), h("button", {
          key: ae.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          title: `Open worker ${ae.id}`,
          onClick: xe((Ye) => ae.open_ref && j(qe)(ae.open_ref), ["stop"])
        }, [
          ee("Also sent to worker " + w(ae.id), 1),
          ae.unavailable ? (u(), h(G, { key: 0 }, [
            ee(" (unavailable)")
          ], 64)) : A("", !0)
        ], 8, Z1))), 128))
      ])) : A("", !0),
      N(Zn, {
        more: j(D),
        loading: j(J),
        failure: j(te),
        label: "More recipients",
        onMore: j(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      b("div", X1, [
        b("time", Q1, w(y.value), 1),
        Number.isInteger(e.message.id) ? (u(), h(G, { key: 0 }, [
          me[11] || (me[11] = b("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          b("span", ep, "message " + w(e.message.id), 1)
        ], 64)) : A("", !0),
        l.value ? (u(), H(w1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      j(M).length || j(E) ? (u(), H(p1, {
        key: 3,
        links: j(M),
        total: j(O),
        more: j(x),
        loading: j(g),
        failure: j(E),
        onMore: j(re)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : A("", !0)
    ], 8, L1));
  }
}, U5 = /* @__PURE__ */ Y(op, [["__scopeId", "data-v-0be1107c"]]), lp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = ci("SkeletonParts", !0);
      return u(!0), h(G, null, Q(e.parts, (i, c) => (u(), h(G, { key: c }, [
        (u(!0), h(G, null, Q(i.count, (d) => (u(), H(jt, {
          key: d,
          value: i.shape
        }, {
          line: P(() => [
            N(Vt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            N(Vt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            N(Vt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: P(() => [...l[0] || (l[0] = [
            b("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: P(() => [
            b("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            b("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: P(() => [
            b("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            b("div", {
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
}), rp = /* @__PURE__ */ Y(lp, [["__scopeId", "data-v-fa8baeaf"]]), ip = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, cp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), h("div", ip, [
      N(rp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Es = /* @__PURE__ */ Y(cp, [["__scopeId", "data-v-52f66b64"]]), Fn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ya = 200, lr = (e) => {
  var t;
  return ((t = Fn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Fn[0].key;
}, z5 = (e) => {
  var t;
  return ((t = Fn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, up = ["aria-label"], dp = 300, yo = 400, fp = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ya } },
  setup(e) {
    const t = e, n = I(() => lr(t.value)), a = I(() => n.value < ya ? [1, 0.25, 0.25] : n.value === ya ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= yo, high: n.value >= dp && n.value < yo }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      b("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      b("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      b("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, up));
  }
}, V5 = /* @__PURE__ */ Y(fp, [["__scopeId", "data-v-b10e610f"]]), bo = (e) => [...new Set(e.agents.map((t) => t.name))], G5 = (e) => bo(e).length === 1 ? `Worker: ${bo(e)[0]}` : "Delegated", hp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, wo = (e) => hp[e.card.state] || "idle", mp = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), ko = { working: 0, waiting: 1, idle: 2, stopped: 3 }, xo = (e, t) => ko[wo(e)] - ko[wo(t)], $o = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, K5 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => xo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || mp(a, s)) : [...e].sort((a, s) => xo(a, s) || ($o[t] || $o.state)(a, s)), pp = { class: "list-row" }, gp = {
  key: 0,
  class: "list-row-type"
}, vp = { class: "list-row-main" }, yp = {
  key: 0,
  class: "list-row-title"
}, bp = { class: "list-row-body" }, wp = {
  key: 1,
  class: "list-row-end"
}, kp = {
  key: 1,
  class: "list-row-text"
}, xp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), h("div", pp, [
      e.type ? (u(), h("span", gp, w(e.type), 1)) : A("", !0),
      b("div", vp, [
        e.title ? (u(), h("span", yp, w(e.title), 1)) : A("", !0),
        b("div", bp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), h("div", wp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (u(), h("span", kp, w(e.text), 1)) : A("", !0)
    ]));
  }
}, Y5 = /* @__PURE__ */ Y(xp, [["__scopeId", "data-v-dfc8c3a7"]]), $p = {
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
}, Mp = { claude: "Claude Code", codex: "Codex" }, Sp = ["aria-expanded"], _p = { class: "drop-label" }, Ep = ["value"], Ap = {
  key: 1,
  class: "drop-lead"
}, Cp = { class: "drop-item-text" }, Op = {
  key: 2,
  class: "drop-note"
}, Tp = {
  key: 1,
  class: "drop-none"
}, Rp = {
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
    const n = e, a = t, s = R(!1), o = R(null), l = R(""), r = I(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function i(c) {
      s.value = !1, a("pick", c);
    }
    return (c, d) => (u(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      b("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (u(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        b("span", _p, w(e.label), 1),
        N(ye, {
          name: "down",
          size: 11
        })
      ], 10, Sp),
      s.value ? (u(), H(Xn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: P(() => [
          e.searchable ? (u(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, Ep)) : A("", !0),
          (u(!0), h(G, null, Q(r.value, (f) => (u(), H(St, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: P(() => [
              f.running !== void 0 ? (u(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (u(), h("span", Ap, w(f.lead), 1)) : A("", !0),
              b("span", Cp, w(f.label), 1),
              f.note ? (u(), h("span", Op, w(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? A("", !0) : (u(), h("p", Tp, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, Ip = /* @__PURE__ */ Y(Rp, [["__scopeId", "data-v-29dfcce5"]]), J5 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => [
      ...$p[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = I(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (u(), H(Ip, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${j(Mp)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Bp = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: Z(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, rr = /* @__PURE__ */ Y(Bp, [["__scopeId", "data-v-978e0921"]]), Lp = ["aria-label"], Np = { class: "head" }, Dp = { class: "names" }, jp = { class: "body" }, Pp = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ml(a, n), r = Sl(s);
    return (i, c) => (u(), H(fs, { to: "body" }, [
      N(Dt, {
        name: "side",
        appear: "",
        onAfterLeave: j(l)
      }, {
        default: P(() => [
          j(s) ? (u(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: j(r) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...d) => j(o) && j(o)(...d), ["self"]))
          }, [
            b("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), h(G, { key: 0 }, [
                b("header", Np, [
                  b("div", Dp, [
                    b("h2", null, w(e.title), 1),
                    e.abstract ? (u(), H(xt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  N(ws, {
                    title: e.closeLabel,
                    onClick: j(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (u(), H(rr, { key: 0 }, {
                  default: P(() => [
                    ue(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : A("", !0),
                b("div", jp, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Lp)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Z5 = /* @__PURE__ */ Y(Pp, [["__scopeId", "data-v-f276f055"]]), qp = {
  key: 1,
  class: "text-field-label"
}, Fp = {
  key: 2,
  class: "text-field-end"
}, Wp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Fa({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = qa(e, "modelValue"), a = Yn(), s = "onUpdate:modelValue" in (((d = ui()) == null ? void 0 : d.vnode.props) || {}), o = I(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = I(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = I(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), c = R(null);
    return t({ focus: () => c.value && c.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (u(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, j(a).class]),
      style: ge(j(a).style)
    }, [
      e.icon ? (u(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (u(), h("span", qp, w(e.label), 1)) : A("", !0),
      tt(b("input", Fe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [j(Ga), o.value]
      ]),
      f.$slots.end ? (u(), h("span", Fp, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : tt((u(), h("input", Fe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [j(Ga), o.value]
    ]);
  }
}), X5 = /* @__PURE__ */ Y(Wp, [["__scopeId", "data-v-d9c38ca8"]]);
async function Hp(e, t, n) {
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
const Mo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function Q5(e) {
  const t = ze().sources.find((n) => n.key === e);
  return t ? es(t.read, t.events) : es("", []);
}
function ir(e, t, n, a) {
  const s = R([]), o = R(null), l = R(""), r = R(!1), i = performance.now(), c = R(!1), d = R(""), f = R(null);
  async function m(y) {
    const B = k, M = await t({ "before-id": y + 1, limit: 1 });
    if (B !== k) return;
    if (!M.ok) return W();
    const O = M.value.rows.find((x) => x.id === y);
    s.value = O ? s.value.map((x) => x.id === y ? O : x) : s.value.filter((x) => x.id !== y);
  }
  async function v(y) {
    if (a && String((y == null ? void 0 : y.event) ?? "").endsWith(".delete")) return void (s.value = s.value.filter((E) => E.id !== y.row_id));
    if (a && (y != null && y.row_id) && !String(y.event ?? "").endsWith(".create") && s.value.some((E) => E.id === y.row_id)) return m(y.row_id);
    if (!(a && s.value.length && String((y == null ? void 0 : y.event) ?? "").endsWith(".create"))) return W();
    const M = Math.max(...s.value.map((E) => E.id)), O = k, x = await t({ "after-id": M });
    if (O !== k) return;
    if (!x.ok) return W();
    const g = new Set(s.value.map((E) => E.id));
    s.value = [...x.value.rows.filter((E) => !g.has(E.id)), ...s.value];
  }
  async function p() {
    if (!c.value || !s.value.length) return !1;
    const y = k, B = Math.min(...s.value.map((x) => x.id)), M = await t({ "before-id": B });
    if (y !== k) return !1;
    if (!M.ok || !M.value.rows.length) return c.value = !1;
    c.value = Mo(M.value, n);
    const O = new Set(s.value.map((x) => x.id));
    return s.value = [...s.value, ...M.value.rows.filter((x) => !O.has(x.id))], !0;
  }
  let k = 0;
  function S(y, B) {
    const M = y.ok ? e.shared ? [y.value] : y.value.rows : [];
    y.ok && (s.value = B(M)), o.value = y.ok ? y.value : null;
    const O = M.length ? Math.min(...M.map((x) => x.id)) : 0;
    y.ok && !s.value.some((x) => x.id < O) && (c.value = !e.shared && Mo(y.value, n)), l.value = y.ok ? "" : y.error, ms(i, () => r.value = !0);
  }
  async function C(y) {
    const B = ++k, M = await t({});
    B === k && S(M, y);
  }
  const F = (y) => {
    if (!a || !y.length) return y;
    const B = Math.min(...y.map((O) => O.id)), M = Math.max(...y.map((O) => O.id));
    return [...s.value.filter((O) => O.id > M), ...y, ...s.value.filter((O) => O.id < B)];
  }, W = () => C(F), L = (y) => S(y, F), $ = () => C((y) => y);
  async function _(y, B = null) {
    const M = await Hp(B && { target: s, fields: { value: B(s.value) } }, y, e.run);
    return d.value = M.ok ? "" : M.error, f.value = M.ok ? M.value : null, await W(), M;
  }
  return { rows: s, listing: o, failure: l, loaded: r, more: c, load: W, loadLatest: $, older: p, act: _, actionFailure: d, answer: f, context: e, heard: v, showFirst: L };
}
const Up = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function es(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = ze(), l = ir(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Up(i)}`), a, n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
function zp(e, t, { pageSize: n = 50, incremental: a = !1 } = {}) {
  const s = ir(ze(), (o) => e.readKey(t, o), n, a);
  return e.handle(t, s.heard, s.showFirst), s;
}
const Vp = { class: "title" }, Gp = { class: "state" }, Kp = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = es(t.line, t.events);
    return (o, l) => (u(), H(Td, {
      rows: j(n),
      failure: j(a),
      loaded: j(s),
      empty: e.empty
    }, {
      default: P(({ row: r }) => [
        b("span", Vp, w(r.title), 1),
        b("span", Gp, w(j(vl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, e4 = /* @__PURE__ */ Y(Kp, [["__scopeId", "data-v-9191a6f0"]]);
function Yp(e = 1e3, t = null) {
  const n = R(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? fe(t, s, { immediate: !0 }) : s(!0), Le(() => clearInterval(a)), n;
}
const ba = R(Date.now() / 1e3);
let So = 0, Mn = 0;
function cr() {
  return Mn || (ba.value = Date.now() / 1e3, So = setInterval(() => ba.value = Date.now() / 1e3, 1e3)), Mn += 1, tl() && hs(() => {
    Mn -= 1, Mn || clearInterval(So);
  }), ba;
}
const Jp = 200, Zp = tr + Rn + nr + Jp;
function Ft(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Xp(e, t, n) {
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
      var l, r, i, c;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((c = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: d }))(getComputedStyle(e)),
    parent: Ft(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Qp(e, t, n, a) {
  fe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Xp(o, l, n.value)), performance.now() - l < Zp) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const eg = ["title", "data-figure-mark", "data-folded", "data-open"], tg = {
  key: 2,
  class: "worker"
}, ng = { class: "head" }, ag = { key: 0 }, sg = {
  key: 3,
  class: "status"
}, og = {
  key: 0,
  class: "figure"
}, lg = {
  key: 1,
  class: "ran-for"
}, rg = { key: 2 }, ig = {
  key: 3,
  class: "news"
}, cg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, ug = {
  key: 6,
  class: "settled"
}, dg = {
  key: 1,
  class: "bar"
}, fg = {
  key: 3,
  class: "detail body"
}, hg = {
  key: 0,
  class: "body-label"
}, mg = ["title"], pg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Yn(), a = ["onClick", "onAct"], s = I(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = R(!1), l = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), i = I(() => r.value || l.value), c = I(() => r.value ? t.open : o.value), d = I(() => r.value ? !t.open : l.value && !o.value), f = I(() => !!(t.mark.action && n.onAct)), m = I(() => i.value || f.value || !!n.onClick), v = R(null), p = R(null), { folded: k, phase: S } = ar(v, () => d.value);
    Qp(v, d, S, Ae(Te, null));
    function C(ie) {
      var he, Ce;
      if (!(ie.target !== v.value && !p.value.contains(ie.target))) {
        if (r.value) return (he = n.onClick) == null ? void 0 : he.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ce = n.onAct || n.onClick) == null || Ce(ie);
      }
    }
    const F = (ie) => n.onAct(ie), W = ["failed", "unfinished"], L = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? W.includes(t.mark.state) ? "danger" : "good" : ""), $ = I(() => t.mark.color ? t.mark.color : L.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : L.value ? `var(--tone-${L.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), _ = I(() => $.value || "var(--tone-work)"), y = I(() => !t.mark.ending && !t.mark.ended && L.value !== "stopped"), B = cr(), M = I(
      () => t.mark.began_at && y.value && !t.mark.figure && !t.mark.counting ? $1(B.value - t.mark.began_at) : ""
    ), O = I(() => {
      const { started: ie, ended: he } = t.mark;
      return ie ? he ? `ran ${go(he - ie, !0)}` : go(B.value - ie, !0) : M.value;
    }), x = ["bad", "danger", "warn"], g = I(() => x.includes(L.value) || t.mark.asks ? "attention" : y.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), E = ["bad", "danger"], T = I(() => E.includes(L.value)), D = I(() => g.value === "process" ? "running" : T.value ? "cross" : L.value === "stopped" ? "stopped" : L.value === "good" ? "tick" : ""), J = I(
      () => !!(t.mark.figure || O.value || t.mark.docked || t.mark.stopping || D.value || t.mark.settled || t.mark.news)
    ), te = I(() => [t.mark.title, t.mark.time ? or(t.mark.time) : ""].filter(Boolean).join(" · ")), re = I(() => ({
      ...$.value ? { "--mark": $.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, he) => (u(), h("div", Fe(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${g.value}`,
        j(S),
        {
          open: c.value,
          folding: r.value && d.value,
          live: m.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: $.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: re.value,
      title: te.value,
      "data-figure-mark": e.mark.key,
      "data-folded": j(k) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: C
    }), [
      (u(), H(ht(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: p,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!c.value) : void 0
      }, {
        default: P(() => [
          e.mark.markIcon ? (u(), H(ft, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), h("span", tg, w(e.mark.worker), 1)) : A("", !0),
          b("span", ng, [
            N(xt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), h("strong", ag, w(e.mark.name), 1)) : A("", !0),
            i.value ? (u(), H(Mt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          J.value ? (u(), h("span", sg, [
            e.mark.figure ? (u(), h("span", og, w(e.mark.figure), 1)) : A("", !0),
            O.value ? (u(), h("span", lg, w(O.value), 1)) : A("", !0),
            e.mark.stopping ? (u(), h("span", rg, "Stopping")) : A("", !0),
            e.mark.news ? (u(), h("span", ig, w(e.mark.news), 1)) : A("", !0),
            D.value === "running" ? (u(), h("span", cg)) : D.value ? (u(), H(ft, {
              key: 5,
              class: Z(["sign", D.value]),
              name: D.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (u(), h("span", ug, w(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (u(), H(er, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(F, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && y.value ? (u(), h("span", dg, [
        b("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: _.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !j(k) ? (u(), H(xt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !j(k) ? (u(), h("div", fg, [
        e.mark.bodyLabel ? (u(), h("p", hg, w(e.mark.bodyLabel), 1)) : A("", !0),
        N(xt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !j(k) ? (u(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, mg)) : A("", !0),
      e.mark.card ? (u(), H(xt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      ue(ie.$slots, "default", {
        shown: !j(k)
      }, void 0, !0)
    ], 16, eg));
  }
}), ur = /* @__PURE__ */ Y(pg, [["__scopeId", "data-v-2aa9c496"]]), gg = 60;
function vg(e, t) {
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
  async function c(d) {
    if (l || a.value <= 0 || d.scrollTop > gg) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await mt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: c };
}
const yg = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function dr(e) {
  var n;
  const t = yg[e] || ((n = Pt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const bg = (e) => dr(String(e).split(":")[0]), fr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), wg = { passed: "good", failed: "danger", warned: "warn", running: "" }, kg = { good: "good", warn: "warn", danger: "danger" }, _o = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => kd(e.target_model, e.target_id || 0)
}, xg = { "open row": (e) => bg(e.target_model), "open page": () => dr("pages") };
function $g(e, t) {
  const n = t || {}, a = _o[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? wg[e.outcome] || "" : kg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? xg[a](e) : "",
    handlers: a ? { onAct: () => _o[a](e) } : {}
  };
}
const Mg = 24, Sg = 1e3, Eo = 2e3, _g = 0.25, Eg = 5e3;
function Ag(e, t = Mg, n = () => !0) {
  const a = R(!1), s = R(0), o = R(!1);
  let l = 0, r = 0, i = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const L = c();
    return L ? L.scrollHeight - L.scrollTop - L.clientHeight : 0;
  }, f = () => !c() || d() <= t;
  function m(L) {
    if (clearTimeout(l), !L) {
      o.value = !1, i = Date.now();
      return;
    }
    const $ = Date.now() - i < Eo ? Eo : Sg;
    l = setTimeout(() => o.value = a.value, $);
  }
  function v() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function p(L = !1) {
    const $ = c();
    $ && L && $.scrollTo ? $.scrollTo({ top: $.scrollHeight, behavior: "smooth" }) : $ && ($.scrollTop = $.scrollHeight), v();
  }
  function k() {
    C(), !a.value && (a.value = !0, m(!0));
  }
  const S = () => !!c() && d() <= c().clientHeight * _g;
  function C() {
    clearTimeout(r), S() && (r = setTimeout(() => a.value && S() && n() && p(!0), Eg));
  }
  function F() {
    f() ? v() : k();
  }
  function W(L = 1, $ = !1) {
    a.value ? s.value += Math.max(0, L) : p($);
  }
  return tl() && hs(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: p, left: k, scrolled: F, arrived: W };
}
const Cg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Og = (e) => String(e ?? "").replace(Cg, ""), Tg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(null), { away: o, scrolled: l, arrived: r, toBottom: i } = Ag(s);
    fe(
      () => n.lines.length,
      () => mt(() => r()),
      { immediate: !0 }
    );
    function c(d) {
      l(), a("older", d.target);
    }
    return (d, f) => (u(), h("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      ee(w(j(Og)(e.lines.join(`
`)) || e.empty), 1),
      j(o) ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => j(i)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, Rg = /* @__PURE__ */ Y(Tg, [["__scopeId", "data-v-c2fb1783"]]), Ig = 1e4;
class Bg {
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
    return this.heardAt !== null && t - this.heardAt > Ig;
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
const Lg = {
  key: 0,
  class: "frame-note"
}, Ng = {
  key: 0,
  class: "frame-note"
}, Dg = ["src", "title"], jg = 1e3, Pg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ze(), a = R(null), s = R(!1), o = R(!1);
    let l = null, r = 0;
    return Ie(() => {
      l = new Bg(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, jg);
    }), Le(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, c) => o.value ? (u(), h("p", Lg, "This window was closed because it stopped answering.")) : (u(), h(G, { key: 1 }, [
      s.value ? (u(), h("div", Ng, [
        c[2] || (c[2] = b("p", null, "This window has not answered for ten seconds.", -1)),
        N(de, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: P(() => [...c[1] || (c[1] = [
            ee("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : A("", !0),
      b("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: j(n).window
      }, null, 8, Dg)
    ], 64));
  }
}, qg = /* @__PURE__ */ Y(Pg, [["__scopeId", "data-v-32a49046"]]), Sn = (e) => e ? e.split(", ") : [];
function Fg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Wg(e, t) {
  return {
    reads: Sn(e.reads_allowed),
    runs: Sn(e.runs_allowed),
    missing: [...Sn(e.reads_missing), ...Sn(e.runs_missing)],
    ask: t
  };
}
const Hg = {
  class: "allowance-prompt",
  role: "dialog"
}, Ug = { class: "allowance-prompt-text" }, zg = { class: "allowance-prompt-buttons" }, Vg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", Hg, [
      b("p", Ug, w(j(Fg)(e.request)), 1),
      b("div", zg, [
        N(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            ee("Allow", -1)
          ])]),
          _: 1
        }),
        N(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            ee("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Gg = /* @__PURE__ */ Y(Vg, [["__scopeId", "data-v-cad69fe2"]]), wa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        ee(w(e.reason) + " ", 1),
        e.retry ? (u(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            ee("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (u(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            ee("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Kg = ["data-window", "data-agent"], Yg = {
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
    const r = Ae(Wi, null), i = pu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: I(() => n.options),
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
    di(Te, i), fe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ie(i.settle), Le(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), fi((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const c = () => Kn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (u(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), H(Gg, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (u(), H(wa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), H(wa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), h(G, { key: 4 }, [
        (u(), H(c, { key: o.value })),
        e.skeleton.length && !j(i).answered.value ? (u(), H(Es, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (u(), H(wa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (v) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Kg));
  }
}, Kt = /* @__PURE__ */ Y(Yg, [["__scopeId", "data-v-c4443e2b"]]), hr = {
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
    const n = e, a = t, s = { render: () => Kn(qg, { src: n.entry.entry_url }) };
    return (o, l) => (u(), H(Kt, {
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
}, Jg = ["data-window"], mr = {
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
    const n = e, a = t, s = Ke(null), o = R("");
    return fe(
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
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      N(Es, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Jg)) : (u(), H(Kt, {
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
      onOption: r[0] || (r[0] = (i, c) => a("option", i, c))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, Zg = "*.*", Xg = {
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
    fe(
      () => a.patterns,
      (i, c, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (v) => a.dispatch(v));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = I(() => !!(t.declaration.shipped || t.declaration.trusted)), r = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Zg] : t.declaration.events ?? [],
      options: []
    }));
    return (i, c) => l.value ? (u(), H(mr, {
      key: 0,
      entry: r.value,
      subscriptions: j(a),
      environment: j(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), H(hr, {
      key: 1,
      entry: r.value,
      subscriptions: j(a),
      environment: j(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Qg = { class: "mark-more-inner" }, e0 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, t0 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, n0 = {
  key: 3,
  class: "mark-lines"
}, a0 = "process", Ao = "task", s0 = {
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
    const t = e, n = Ae(Te), a = I(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = I(() => fr.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === Ao ? t.mark.target_id : 0), l = vg(
      (v) => n.run(v),
      () => t.mark.target_id
    ), r = l.lines, i = R(!1), c = R(""), d = I(() => !t.declaration.body_url && t.mark.target_model === a0 && !!t.mark.target_id);
    async function f(v = l.follow) {
      const p = await v();
      i.value = !0, c.value = p.ok ? "" : p.error;
    }
    const m = I(() => t.shown && d.value);
    return fe(m, (v) => v && f()), Ss(() => m.value && f(), () => m.value && !t.mark.ended_at), fe(
      () => t.mark.ended_at,
      (v) => v && m.value && f(l.newest)
    ), (v, p) => (u(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: p[1] || (p[1] = xe(() => {
      }, ["stop"]))
    }, [
      b("div", Qg, [
        e.declaration.body_url ? (u(), H(Xg, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (u(), h(G, { key: 1 }, [
          s.value ? (u(), h(G, { key: 0 }, [
            p[2] || (p[2] = b("p", { class: "mark-label" }, "Why it stopped", -1)),
            b("p", e0, w(s.value), 1)
          ], 64)) : A("", !0),
          d.value && c.value ? (u(), h("p", t0, w(c.value), 1)) : d.value && i.value ? (u(), h(G, { key: 2 }, [
            p[3] || (p[3] = b("p", { class: "mark-label" }, "Output", -1)),
            N(Rg, {
              class: "mark-terminal",
              lines: j(r),
              onOlder: j(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (u(), h("p", n0, w(a.value.join(`
`)), 1)) : A("", !0),
          o.value ? (u(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: p[0] || (p[0] = xe((k) => j(qe)(`${Ao}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ts = /* @__PURE__ */ Y(s0, [["__scopeId", "data-v-f4d037e5"]]), o0 = ["title", "aria-label", "onClick"], l0 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, r0 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => Ku(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = R(""), s = Ae(Te);
    async function o(l) {
      const r = await un(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (u(), h(G, null, [
      (u(!0), h(G, null, Q(n.value, (i) => (u(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: xe((c) => o(i), ["stop"])
      }, [
        N(ft, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, o0))), 128)),
      a.value ? (u(), h("span", l0, w(a.value), 1)) : A("", !0)
    ], 64));
  }
}, i0 = /* @__PURE__ */ Y(r0, [["__scopeId", "data-v-7a62c88e"]]);
function pr(e, t) {
  const n = Ke(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const gr = pr("/api/marks", "marks"), t4 = gr.fetchAll, c0 = gr.find, u0 = ["data-ref"], d0 = ["data-ref"], f0 = { class: "mark-row" }, h0 = "dock add", m0 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = I(() => c0(a.mark.type)), o = I(() => $g(a.mark, s.value)), l = I(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && fr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = R(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const c = I(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(h0));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, v;
      return (m = s.value) != null && m.card ? (u(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": j(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        N(ts, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, u0)) : (u(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": j(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        b("span", f0, [
          N(ur, Fe({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, hi(o.value.handlers), { onClick: i }), mi({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: p }) => [
                N(ts, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: p
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          N(i0, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, d0));
    };
  }
}, p0 = /* @__PURE__ */ Y(m0, [["__scopeId", "data-v-8196402d"]]), g0 = ["data-ref"], v0 = ["inert"], y0 = { class: "group-fold" }, b0 = { class: "thread-group" }, w0 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = R(!1), a = R(!1), s = R(!1), o = R(null);
    fe(n, async (r) => {
      var i;
      a.value = !0, await mt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = I(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (u(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      N(ur, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (u(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Z(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        b("div", y0, [
          b("div", b0, [
            (u(!0), h(G, null, Q(e.group.marks, (c) => (u(), H(p0, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, v0)) : A("", !0)
    ], 8, g0));
  }
}, n4 = /* @__PURE__ */ Y(w0, [["__scopeId", "data-v-45b58b9b"]]);
function k0(e) {
  const t = R(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ie(() => n.observe(e.value)), pt(() => n.disconnect()), t;
}
const x0 = { class: "chat-dock-fold" }, $0 = ["aria-label"], M0 = { class: "chat-dock-head" }, S0 = { class: "chat-dock-inner" }, _0 = { class: "chat-dock-foot" }, vr = 700, E0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = R(null), a = R(null), s = k0(a), o = R(!1);
    let l = 0;
    return Ie(() => l = setTimeout(() => o.value = !0, vr)), pt(() => clearTimeout(l)), t({ card: n }), (r, i) => (u(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      b("div", x0, [
        b("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          b("header", M0, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          b("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            b("div", S0, [
              b("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: ge(j(s) === null ? null : { height: `${j(s)}px` })
              }, [
                b("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(r.$slots, "still", {}, void 0, !0),
          b("footer", _0, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, $0)
      ])
    ], 2));
  }
}, yr = /* @__PURE__ */ Y(E0, [["__scopeId", "data-v-74d44b19"]]), A0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ka = 5, C0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ka, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ka}s`, animationDelay: `${(n - ka).toFixed(2)}s` };
    return (s, o) => (u(), h("span", A0, [
      b("i", { style: a })
    ]));
  }
}, br = /* @__PURE__ */ Y(C0, [["__scopeId", "data-v-2a7bc150"]]), O0 = { reviewing: "Under review" }, T0 = (e, t) => e || O0[t == null ? void 0 : t.state] || "", Xe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, R0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Xe],
  ready: [Xe],
  approved: [{ word: "start", label: "Start", main: !0 }, Xe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Xe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Xe],
  completed: [],
  cancelled: []
}, I0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Xe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Xe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Xe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Xe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, B0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], L0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], N0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], D0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], j0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], P0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function q0(e, t) {
  const n = { plan: R0, task: I0 }[e], a = t != null && t.state ? iu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[yl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const F0 = (e, t) => e === "doc" || e === "report" ? P0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...N0(t), ...L0(t)] : e === "check" ? j0(t) : e === "question" ? B0(t) : e === "memory" ? D0(t) : q0(e, t), wr = pr("/api/docks", "docks"), a4 = wr.fetchAll, Ut = wr.find, W0 = 6, H0 = 3, xa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ea = (e) => Date.parse(e.leaves_at) / 1e3, kt = (e) => !!(e.leaves_at && !e.kept), U0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!kt(e) || t < ea(e) || n.has(e.id)), z0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => U0(a, t, n)).sort((a, s) => a.id - s.id);
function V0(e, t, n = W0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ea(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const G0 = (e, t, n = e) => n < 2 ? !1 : e >= H0 ? !0 : t, K0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ns = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), Y0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), J0 = (e) => ({ ...e.kept ? ns("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ns("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), Z0 = ["pins"], X0 = (e) => ({ ...e, iconOnly: Z0.includes(e.icon) });
function Q0(e, t) {
  var n;
  return [
    ...Y0(e, t) ? [J0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Pt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ns("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(X0);
}
function ev(e, t) {
  const n = Q0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: K0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const tv = ["title"], nv = {
  key: 2,
  class: "dock-controls"
}, av = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, sv = { class: "dock-facts" }, ov = { key: 1 }, lv = {
  key: 2,
  class: "dock-kept"
}, rv = { class: "dock-acts" }, iv = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = I(() => Ut(a.item.type)), o = cr(), l = I(() => sr(a.item.created_at, o.value * 1e3)), r = R(null), i = R(null), c = R(null), d = R(null), f = I(() => ev(a.item, s.value)), m = Ae(Te), v = R(null);
    let p = 0;
    async function k() {
      var O, x;
      const _ = ++p, y = Gt(a.item.target_model ?? ""), B = `${y} show`;
      if (!((x = (O = s.value) == null ? void 0 : O.reads) != null && x.includes(B))) return;
      const M = await it(a.item.type, [y, "show", String(a.item.target_id)], m.environment, m.signal);
      _ === p && (v.value = M.ok ? { ...M.value, id: a.item.target_id, noun: y } : { id: a.item.target_id, noun: y });
    }
    fe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (_, y, B) => {
        var x;
        const M = Gt(a.item.target_model ?? "");
        v.value = { id: a.item.target_id, noun: M }, k();
        const O = (x = m.subscriptions) == null ? void 0 : x.follow(`dock ${a.item.id}`, [`${M.replaceAll("-", "_")}.*`], (g) => {
          (!g.row_id || g.row_id === a.item.target_id) && k();
        });
        B(() => {
          p += 1, O == null || O();
        });
      },
      { immediate: !0 }
    );
    const S = R(/* @__PURE__ */ new Set()), C = R("");
    async function F(_) {
      if (_.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      _.action === "declared" && (S.value = /* @__PURE__ */ new Set([...S.value, _.label])), C.value = "";
      const B = await un(_, { id: a.item.target_id }, m.environment);
      (B == null ? void 0 : B.ok) === !1 && (S.value = new Set([...S.value].filter((M) => M !== _.label)), C.value = `Could not ${_.label.toLowerCase()}: ${B.error}`);
    }
    const W = I(() => f.value.actions.filter((_) => _.action !== "undock" && !S.value.has(_.label))), L = I(() => {
      var _;
      return T0((_ = s.value) == null ? void 0 : _.badge, v.value);
    }), $ = I(() => f.value.buttons.find((_) => _.action === "undock"));
    return (_, y) => {
      var B, M, O, x;
      return u(), H(yr, {
        label: f.value.title + ((B = s.value) != null && B.needs_user ? ", waiting for you" : ""),
        type: (M = s.value) != null && M.needs_user ? "waiting" : "",
        folded: !!((O = s.value) != null && O.folds) && e.folded,
        body: !!((x = s.value) != null && x.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: y[3] || (y[3] = (g) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (u(), H(br, {
            key: 0,
            "ends-at": j(ea)(e.item)
          }, null, 8, ["ends-at"])) : A("", !0)
        ]),
        head: P(() => {
          var g, E;
          return [
            (g = s.value) != null && g.draws_head && !e.collapsed ? (u(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), h(G, { key: 1 }, [
              N(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              b("span", {
                class: "dock-title",
                title: f.value.title
              }, w(f.value.title), 9, tv)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (u(), h("span", nv, [
              (u(!0), h(G, null, Q(f.value.controls, (T) => {
                var D, J;
                return u(), h(G, {
                  key: T.action + T.runs
                }, [
                  !S.value.has(T.label) && (!((D = T.variants) != null && D.length) || !((J = v.value) != null && J.state) || T.variants.includes(v.value.state)) ? (u(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: T.pressed }),
                    "aria-pressed": T.pressed,
                    "aria-label": T.label,
                    title: T.label,
                    "data-dock-action": T.action,
                    onClick: (te) => F(T)
                  }, {
                    default: P(() => [
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
            b("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (E = s.value) != null && E.leaves_after_seconds ? A("", !0) : (u(), h(G, { key: 0 }, [
                ee(w(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: P(() => [
          C.value || e.refusal ? (u(), h("p", av, w(C.value || e.refusal), 1)) : A("", !0)
        ]),
        foot: P(() => {
          var g, E;
          return [
            b("span", sv, [
              L.value ? (u(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, w(L.value), 3)) : A("", !0),
              (g = s.value) != null && g.word ? (u(), h("span", ov, w(s.value.word), 1)) : A("", !0),
              b("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (u(), h("span", lv, "Kept")) : A("", !0)
            ]),
            (E = s.value) != null && E.folds ? (u(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: y[0] || (y[0] = (T) => n("fold"))
            }, {
              default: P(() => [
                ee(w(s.value.folds) + " ", 1),
                N(Mt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : A("", !0),
            b("span", rv, [
              b("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              N(id, {
                name: `dock.${e.item.type}`,
                row: v.value,
                environment: j(m).environment,
                "read-only": j(m).readOnly,
                "object-name": j(Gt)(e.item.target_model),
                "external-failure": "",
                onFailure: y[1] || (y[1] = (T) => C.value = T),
                onDone: k
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (u(!0), h(G, null, Q(W.value, (T) => (u(), H(de, {
                key: T.action + T.runs,
                small: "",
                variant: T.primary ? "primary" : "ghost",
                bordered: !T.primary,
                "data-dock-action": T.action,
                onClick: (D) => F(T)
              }, {
                default: P(() => [
                  ee(w(T.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              N(de, {
                small: "",
                bordered: "",
                title: $.value.label,
                "data-dock-action": "undock",
                onClick: y[2] || (y[2] = (T) => n("undock", $.value))
              }, {
                default: P(() => [...y[4] || (y[4] = [
                  ee("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: P(() => {
          var g;
          return [
            (g = s.value) != null && g.body_url ? (u(), H(ts, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: c.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : A("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Co = /* @__PURE__ */ Y(iv, [["__scopeId", "data-v-460364d0"]]), cv = ["title", "aria-label"], uv = { class: "run-chip-in" }, dv = {
  key: 0,
  class: "run-chip-ring"
}, fv = { class: "run-chip-name" }, hv = { class: "run-chip-bar" }, mv = "processes.output", pv = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ae(Te, null), o = (s == null ? void 0 : s.environment) ?? "", l = R(null), r = I(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = I(() => {
      var m, v;
      return ((m = l.value) == null ? void 0 : m.title) || ((v = l.value) == null ? void 0 : v.line) || a.item.title || "";
    }), c = I(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await it(mv, ["process", "card", String(a.item.target_id)], o, s == null ? void 0 : s.signal);
      m.ok && (l.value = m.value);
    }
    let f = null;
    return Ie(() => {
      var m;
      d(), f = (m = s == null ? void 0 : s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && d();
      });
    }), pt(() => f == null ? void 0 : f()), (m, v) => {
      var p;
      return u(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": c.value })
      }, [
        j(kt)(e.item) ? (u(), H(br, {
          key: 0,
          "ends-at": j(ea)(e.item)
        }, null, 8, ["ends-at"])) : A("", !0),
        b("span", uv, [
          r.value ? (u(), h("span", dv)) : (u(), H(ft, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          b("span", fv, w(i.value), 1)
        ]),
        b("span", hv, [
          b("i", {
            style: ge({ width: r.value ? `${((p = l.value) == null ? void 0 : p.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, cv);
    };
  }
}, gv = /* @__PURE__ */ Y(pv, [["__scopeId", "data-v-f864bc58"]]), vv = 24, yv = 8, s4 = 420;
function o4({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= vv ? !0 : e < t && s > yv ? !1 : null;
}
const bv = (e, t) => e === void 0 ? t : e, wv = { me: 1, people: [] }, Wn = Jn({
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
  people: wv,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Dn("journal.activity", !0),
  wide: !1,
  sideMini: Dn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Il("journal.activity", () => Wn.activity);
Il("journal.side.mini", () => Wn.sideMini);
const kr = "journal.viewer.";
function kv(e, t, n) {
  try {
    const a = n.getItem(kr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function xv(e, t, n) {
  try {
    n.setItem(kr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Oo(e, t, n = window.localStorage) {
  const a = R(kv(e, t, n));
  return fe(a, (s) => xv(e, s, n), { deep: !0 }), a;
}
const $v = {
  key: "dock-all",
  class: "dock-all"
}, Mv = {
  key: "runs-head",
  class: "dock-runs-head"
}, Sv = { class: "dock-runs-title" }, _v = { class: "dock-runs-chips" }, Ev = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var x, g;
    const t = e, n = Yp(500), a = R(/* @__PURE__ */ new Set()), s = R(!1), o = R(!1), l = Ae(Te), r = R(/* @__PURE__ */ new Set()), i = R({});
    async function c(E, T) {
      i.value = { ...i.value, [E.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, E.id]);
      const D = await un(T, { id: E.target_id }, l.environment);
      (D == null ? void 0 : D.ok) === !1 && (r.value = new Set([...r.value].filter((J) => J !== E.id)), i.value = { ...i.value, [E.id]: `Could not close this card: ${D.error}` });
    }
    const d = I(
      () => z0(
        t.items.filter((E) => !r.value.has(E.id)),
        n.value,
        a.value
      )
    ), f = I(
      () => V0(
        d.value.filter((E) => xa(E, Ut)),
        n.value
      )
    ), m = I(() => d.value.filter((E) => !f.value.includes(E) && !xa(E, Ut))), v = I(() => f.value.filter((E) => !kt(E))), p = Oo(`dock-size:${((x = Wn.identity) == null ? void 0 : x.root) || location.host}`, null), k = (E) => p.value ? p.value.collapsed && !p.value.opened.includes(E.id) : t.collapsed, S = I(() => d.value.some(k)), C = I(() => (s.value = G0(f.value.length, s.value, v.value.length)) && !o.value && !d.value.some(k));
    function F() {
      p.value = { collapsed: !S.value, opened: [] };
    }
    function W(E) {
      var D;
      if (!k(E)) return;
      const T = (D = p.value) != null && D.collapsed ? p.value.opened : [];
      p.value = { collapsed: !0, opened: [...T, E.id] };
    }
    const L = Oo(`dock-folded:${((g = Wn.identity) == null ? void 0 : g.root) || location.host}`, {}), $ = (E) => {
      var T;
      return !!((T = Ut(E.type)) != null && T.folds) && bv(L.value[E.id], xa(E, Ut) || t.folded);
    };
    function _(E) {
      L.value = { ...L.value, [E.id]: !$(E) };
    }
    function y(E) {
      L.value = { ...L.value, ...Object.fromEntries(f.value.map((T) => [T.id, T.id !== E.id])) }, o.value = !0;
    }
    function B() {
      L.value = Object.fromEntries(Object.entries(L.value).filter(([E]) => !f.value.some((T) => String(T.id) === E))), o.value = !1;
    }
    function M(E) {
      a.value = /* @__PURE__ */ new Set([...a.value, E.id]);
    }
    function O(E) {
      a.value = new Set([...a.value].filter((T) => T !== E.id));
    }
    return (E, T) => (u(), H(el, {
      tag: "div",
      name: "dock",
      duration: j(vr),
      class: "dock-stack"
    }, {
      default: P(() => [
        d.value.length > 1 ? (u(), h("div", $v, [
          N(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": S.value ? "Open all" : "Collapse all",
            onClick: F
          }, {
            default: P(() => [
              N(Mt, {
                open: !S.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : A("", !0),
        (u(!0), h(G, null, Q(m.value, (D) => (u(), H(Co, {
          key: D.id,
          item: D,
          class: Z({ timed: j(kt)(D) }),
          leaving: j(kt)(D) && !a.value.has(D.id),
          folded: $(D),
          collapsed: k(D),
          refusal: i.value[D.id],
          onOpen: (J) => W(D),
          onFold: (J) => _(D),
          onUndock: (J) => c(D, J),
          onMouseenter: (J) => M(D),
          onMouseleave: (J) => O(D)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !S.value ? (u(), h("div", Mv, [
          b("span", null, w(f.value.length) + " runs", 1),
          N(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: B
          }, {
            default: P(() => [
              T[1] || (T[1] = ee(" Runs ", -1)),
              N(Mt, { open: "" })
            ]),
            _: 1
          })
        ])) : A("", !0),
        (u(!0), h(G, null, Q(C.value ? [] : f.value, (D) => (u(), H(Co, {
          key: D.id,
          item: D,
          class: Z({ timed: j(kt)(D) }),
          leaving: j(kt)(D) && !a.value.has(D.id),
          folded: $(D),
          collapsed: k(D),
          refusal: i.value[D.id],
          onOpen: (J) => W(D),
          onFold: (J) => _(D),
          onUndock: (J) => c(D, J),
          onMouseenter: (J) => M(D),
          onMouseleave: (J) => O(D)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        C.value ? (u(), H(yr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: P(() => [
            N(ye, {
              name: "runs",
              size: 14
            }),
            b("span", Sv, w(f.value.length) + " runs", 1)
          ]),
          foot: P(() => [
            b("span", _v, [
              (u(!0), h(G, null, Q(f.value, (D) => (u(), H(gv, {
                key: D.id,
                item: D,
                onClick: (J) => y(D)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            N(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: T[0] || (T[0] = (D) => o.value = !0)
            }, {
              default: P(() => [
                T[2] || (T[2] = ee(" Runs ", -1)),
                N(Mt)
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
}, l4 = /* @__PURE__ */ Y(Ev, [["__scopeId", "data-v-d078676b"]]), $t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, In = (e) => Math.min(Math.max(e, 0), 1), Av = (e) => {
  const t = In(e);
  return t * t * (3 - 2 * t);
}, vt = (e, t, n) => Av((e - t) / (n - t));
function r4(e) {
  const t = In(e), n = In((t - 0.12) / 0.76) * $t.shuffles, a = Math.min(Math.floor(n), $t.shuffles - 1), s = n - a, o = vt(s, 0.26, 0.38) * (1 - vt(s, 0.76, 0.96)), l = vt(s, 0.38, 0.76), r = vt(t, 0, 0.12) * (1 - vt(t, 0.88, 1)), i = vt(s, 0.2, 0.34) * (1 - vt(s, 0.84, 1)), c = Math.sin(Math.PI * In((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / $t.shuffles, lift: $t.lift * o, ready: r, weight: i, follow: c, shuffle: a, phase: s };
}
function i4(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const To = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, c4 = (e) => To[e] ?? To.butler, As = 2400, Cv = 0.05;
function Ov({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, Cv), l = Math.min(t + As * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function u4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function Tv(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function d4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const f4 = (e, t) => ({ ...e, stretch: t.stretch }), h4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, xr = (e, t) => t >= (e.least ?? 0);
function m4(e, t, n) {
  if (!xr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const p4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Rv = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Ro = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Iv = (e) => e.right > e.left && e.bottom > e.top;
function g4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(Rv)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Ro(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Ro(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), Iv(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function $r(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const p = (o[f] - e[d]) / v, k = (o[m] - e[d]) / v;
        l = Math.max(l, Math.min(p, k)), r = Math.min(r, Math.max(p, k));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: c, on: "surface", surface: s.id, dx: i - s.left, dy: c - s.top };
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Bv = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => Bv(tn(e, t, n)), Lv = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ct = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, _n = ([e, t], n) => e + n() * (t - e);
function Nv(e) {
  return Lv.map(() => {
    const t = _n(ct.speed, e), n = _n(ct.angle, e) * Math.PI / 180, a = _n(ct.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [_n(ct.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Dv = Nv(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function jv(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ct.gravity * (t[2] - ct.floor))) / ct.gravity;
}
function v4(e, t, n = Dv) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = jv(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), c = a.from.map((d, f) => d + o.velocity[f] * i);
  return c[2] -= ct.gravity * i * i / 2, { at: c, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const y4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function b4(e, t) {
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
const w4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function k4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), c = i - o - e, d = i - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function x4(e, t, n) {
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
function $4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = Ov({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Be = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function M4(e) {
  const t = Be.least + Math.floor(e() * (Be.most - Be.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Be.walls[Math.floor(e() * Be.walls.length)],
    along: Be.margin + e() * (1 - 2 * Be.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function as(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Be.margin, l = ((e.along - Be.margin + e.way * Be.speed * n / a) / s % 2 + 2) % 2, r = Be.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Be.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Be.inset : t.right - Be.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function Pv(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = Tv(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: c };
}
function S4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = Pv(n, e.length), c = e.map((C, F) => ({ ...as(C, t, Math.min(n / o.fps, Bn(F).shot)), shot: F < i })), d = Ee(l / o.frames, o.aim), [f, m] = [c[Math.max(r - 1, 0)], c[r]], v = e.map((C, F) => ({ bug: C, index: F, seconds: n / o.fps - Bn(F).shot, spot: as(C, t, Bn(F).shot) })).filter((C) => C.seconds >= 0), p = v.flatMap((C) => {
    const F = (s == null ? void 0 : s.get(C.index)) ?? Uv(C.bug, t, C.spot, s ? [] : a);
    return s == null || s.set(C.index, F), s && zv(F, C.seconds, a), Vv(F, C.seconds, a);
  }), k = v.filter((C) => Wv(C.bug)).map((C) => ({ seconds: C.seconds, from: C.spot })), S = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: S }, slush: p, camera: k };
}
function Bn(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function _4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((c, d) => {
    const f = Bn(d), m = as(c, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), p = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), k = Math.abs(m.x - i) >= v ? i : m.x + p * v, S = p > 0 ? Math.max(i, Math.min(k, r)) : Math.min(i, Math.max(k, l)), C = { from: i, to: S, begin: f.walk, end: f.aim };
    return i = S, C;
  });
}
function E4(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, qv = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Fv(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Wv = (e) => e.along * 97 % 1 < $e.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function Hv(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let r = e.from;
  for (let c = 0; c < l.t; c += $e.step) {
    const d = Math.min(c + $e.step, l.t), f = nn(e, d), m = $r(r, f, n);
    if (m) return { ...m, t: c + (d - c) * m.share };
    r = f;
  }
  const i = nn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function Uv(e, t, n, a = []) {
  const s = Fv(e.along + 1), [o, l] = qv[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), c = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * c, vy: Math.sin(i) * c, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...Hv(d, t, a) };
  });
}
function zv(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += $e.step) {
      const l = Math.min(o + $e.step, s), r = $r(nn(a, o), nn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function Vv(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...nn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function A4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ee(e, [0, c]), m = Ee(e, [c, c + d]);
  return l.map((v) => {
    const p = { x: a.x + v.at[0] * t, y: a.y + v.at[1] * t };
    return {
      x: n.x + (p.x - n.x) * f,
      y: n.y + (p.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function C4(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (k) => {
    const [S, C] = [k.x - e.at.x, k.y - e.at.y];
    return { x: r.x + S * c - C * d, y: r.y + S * d + C * c };
  }, [m, v] = [...n].sort((k, S) => k.x - S.x), p = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: p.map((k, S) => ({ from: k, to: S < p.length / 2 ? m : v })) };
}
const O4 = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function Hn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function T4(e, t) {
  const n = _e[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Hn(n, t), l = 1 - (1 - n.small) * Ee(a, n.shrinks) * (1 - Ee(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Hn(n, t), o = n.flat * Ee(a, n.squashes) * (1 - Ee(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * tn(s, ...n.springs)) * (1 - tn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const R4 = (e) => e === "pack_box";
function I4(e) {
  const { into: t, out: n } = Hn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function B4(e) {
  const t = _e.rope_swing, { into: n, out: a } = Hn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Gv = { after: 3 }, Cs = 10, Kv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Yv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Jv = { weight: 19 }, Mr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Zv = { every: 120 }, Sr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, _r = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Xv = {
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
}, fn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Cs }), ne = (e, t, n = {}) => fn(e, "clip", t, n), $a = (e, t, n = {}) => fn(e, "look", t, n), Io = (e, t, n = {}) => fn(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...fn(e, "pick", t, n), ...a }), we = (e) => fn("nothing", "nothing", e, {}), Qv = 120, ey = 300, Ma = (e, t) => ({ ...ne(e, t), cooldown: ey }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), ty = () => [ne("joy", 2)], yt = (e, t, n, a, s = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), bt = (e) => ({ ...e, cooldown: Kv[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: Yv[e.name] }), ta = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...le("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ne("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...le("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...bt(ne("bug_shot", 3)), toward: "", onto: !1 },
    { ...bt(ne("bug_smash", 2)), toward: "", onto: !1 },
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
  ...le("reported", { cooldown: 90 }, [Io("read", 3), ne("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...le("read_message", { cooldown: 30 }, [Io("read", 3), we(1)]),
  ...le("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), we(6)]),
  ...le("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...le("bar_done", { holds: !0 }, ty()),
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
  ...Object.entries(Xv).flatMap(([e, t]) => le(`reacted:${e}`, {}, [$a(t, 1)])),
  ...Object.entries(Sr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => le(`agent_reacted:${n}`, {}, [ne(a, 1, { voices: [e] })])[0])),
  ...Object.entries(_r).flatMap(([e, t]) => le(`agent_reacted:${e}`, {}, [ne(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...le("pastime", {}, [
    yt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    yt("rest", 3, 180, 120),
    yt("yawn", 2, 60, 60),
    yt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    yt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    yt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    yt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Wt(bt(ne("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(bt(ne("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...le("held:search", { cooldown: Qv }, [Ma("search", 3), { ...Ma("binoculars", 2), when: { home: !0 } }, { ...Ma("glass_bubble", 2), when: { bubble: !0 } }]),
  ...le("held:type", {}, [ne("type", 3), ne("type_ponder", 1)]),
  ...le("held:compacting", {}, [ne("pack_box", 3), ne("vacuum", 2), ne("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...le("spell", {}, [pe("writing", 12, { state: "writing" }), pe("reading", 12, { state: "reading" }), pe("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...le("tickled", {}, [{ ...bt(ne("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...le("eager", {}, [ne("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...le("jump", {}, [Wt(bt(ne("backflip", 7, { high: !0 }))), ne("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...le("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...le("unit", { cooldown: Mr.build.cooldown }, [pe("unit", Jv.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: Zv.every }, pe("stand", 5)]),
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
    Wt(bt(pe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], Er = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Ar = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), ny = (e) => Array.isArray(e) ? e[0] : e, ay = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, sy = (e) => ta.some((t) => t.when.moment === e);
function oy(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Ar(d).every(([f, m]) => n(f) >= ny(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ta.filter((d) => Er(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= Gv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function Ue(e, t) {
  const n = oy(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Cr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Cr(e, t, n) {
  var a;
  for (const [s, o] of Ar(t)) (a = e.memory) == null || a.set(s, e.now + ay(o, n));
}
function L4(e, t, n) {
  Cr(e, ta.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const N4 = (e) => Object.values(Mr).find((t) => Er(t.when, e)) ?? null, ly = (e, t, n) => n - t <= (e.lifetime ?? Cs), D4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || xr(e.clip, t));
class Or {
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
const ss = {
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
}, j4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Tr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), P4 = {
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
}, q4 = 120, ry = 20, F4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < ry), iy = (e) => ss[e] || ss.idle, W4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Rr = "airborne", cy = "landing", uy = "travelling", Ir = "grounded", H4 = ({ airborne: e, landing: t, trip: n }) => e ? Rr : t ? cy : n != null && n.started ? uy : Ir;
function U4(e, t) {
  var s;
  const n = dy(e, t);
  return e.mode === Ir && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function dy(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: c, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Rr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...fy(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && c === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : iy(c), facing: v ? m : r.posture === "sit" ? r.face : f };
}
function fy(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const os = (e) => e.outcome, hy = "plugin:code-commandments:sins:", Bo = (e) => e.type === "plugins.card" && e.markKey.startsWith(hy), my = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Bo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Bo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], z4 = (e, t) => e.filter((n) => n.author === "user" && qn(n.read_at) > t).map((n) => ({ beat: "read_message", time: qn(n.read_at), card: Kl(n) })).sort((n, a) => n.time - a.time), Lo = { user: "reacted", agent: "agent_reacted" };
function V4(e, t) {
  return e.filter((n) => Lo[n.author] && _t(n) > t).map((n) => ({ beat: `${Lo[n.author]}:${n.emoji}`, time: _t(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const py = [.../* @__PURE__ */ new Set([...Object.values(Sr).flatMap((e) => Object.keys(e)), ...Object.keys(_r)])];
function G4(e, t) {
  return e.filter((n) => n.author === "agent" && _t(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = py.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: _t(n), card: Kl(n) })).sort((n, a) => n.time - a.time);
}
const gy = (e) => new Or(e).isTest(), Un = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[os(e)] || "";
}, vy = 1800, yy = (e, t) => {
  if (Un(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Un(n) !== "finished" && Number(e.time) - Number(n.time) <= vy ? "tests_fixed" : "tests_passed";
};
function K4(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(gy), s = a.filter((r) => Un(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Un(r))), o.map((r) => ({ beat: yy(r, s), time: Number(r.time), card: r.key }));
}
function Y4(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(os(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: os(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const J4 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: _t(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function Z4(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function X4(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Q4(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = my.find((c) => c.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Os(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const No = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function by(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Os(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function ex(e, t, n, a = {}) {
  const s = Ue({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : sy(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function tx(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const Do = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function nx(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, r = o % Re.sweep, i = Re.sweep - Re.returnSeconds, c = Do((r - i) / Re.returnSeconds), d = r <= i ? Do(r / i) : 1 - c, f = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const jo = 3, Br = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Po = 12, ax = (e, t) => ({ mood: e, began: t, seen: 0 });
function sx(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Br(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= jo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Po) / Po, lasts: jo } };
}
const ox = (e) => e.posture === "hang" && !Br(e.face), wy = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), ky = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function lx(e, t, n) {
  return wy.has(e) ? 1 / 0 : !ky.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Lr(n - t.began, t.share) - Qe.lead, 0);
}
const xy = 5;
function rx(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= xy ? { beat: "long_walk", time: n } : null };
}
const $y = 30, En = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function ix(e, t, n, a, s = null) {
  if (t && n < t.until || !En.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ue({ moment: "spell", state: e, tally: s }, a), [l, r] = En.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + En.every } : { state: e, began: 0, until: 0, next: n + En.every };
}
const cx = (e, t, n) => t && n < t.until && Tr.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Lr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function ux(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Lr(o, e.share);
  return s ? { eager: My(t, l), moment: null } : l > Qe.lead ? { eager: t, moment: null } : l < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Ue({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function My(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const Sy = 1, _y = { look: "look", gaze: "gaze" };
function Ey(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Ue({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [_y[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const Ay = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Ue({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Cy = (e, t, n, a, s, o = 0) => Ue({ moment: "jump", high: e > Sy * t, memory: a, now: s, room: o }, n).name === "backflip", Oy = { work: ["building"], idle: ["standing"] };
function dx(e, t, n, a) {
  const s = ss[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Oy[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Tr.has(e) ? { moments: o, began: n || a } : (n && a - n >= $y && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Ty(e, t, n) {
  return !Ue({ moment: "pondering", memory: e, now: t }, n) || !Ue({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ue({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const qo = { pondering: Ty };
function fx(e, t, n, a, s, o) {
  if (qo[e.beat]) {
    const r = qo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = Ey(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Cs && { lifetime: l.lifetime } } } : null;
}
function hx(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = Ay(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const mx = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function px(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function gx(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const vx = (e, t) => !!(e != null && e.watches) && !t.once, yx = 10, bx = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || ly(a, a.queuedAt, n)), wx = (e, t) => t ? null : e[0] ?? null;
function kx(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const xx = (e, t) => !t.during || !e.some((n) => n.during === t.during), Ry = 2 * Math.PI, Iy = 500;
function $x(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Iy, i = t && e.point && !!t.behind != !!e.point.behind, c = i && e.amount > 0, d = t && !c ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Ry * l / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, k = (c ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? Ly(v, t, n, m, s) : Dy(v, t, n, m) : t) ?? v, S = k != null && k.behind && k.mood === "reading" ? By(e.point, k, n, l, s) : k;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: f, at: a };
}
function By(e, t, n, a, s) {
  const o = (M) => M * 180 / Math.PI, l = (M) => o(Math.atan2(Math.sin(M * Math.PI / 180), Math.cos(M * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, v = f ? e.readingYaw + m : d, p = v + l(c - v), k = Math.min(Math.max(a / 1e3, 0), 0.1), S = Re.turnSpeed * k, C = f ? v + Math.min(Math.max(p - v, -S), S) : p, F = f ? e.readingFollow + m : C, W = F + (C - F) * (1 - Math.exp(-k / Re.followSeconds)), L = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, $ = o(Os(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), _ = Math.min(Math.max($, -L.up), L.down), y = Re.tipSpeed * k, B = f ? e.readingPitch + Math.min(Math.max(_ - e.readingPitch, -y), y) : _;
  return { ...t, readingYaw: C, readingFollow: W, readingPitch: B, readingFacing: r };
}
function Ly(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (F) => {
    const { yaw: W, pitch: L } = Os(F.x - n.x, s, n.y - F.y, o);
    return { yaw: W, pitch: Math.min(Math.max(L, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, c] = [No(r(e)), No(r(t))], d = Math.acos(Math.min(Math.max(i[0] * c[0] + i[1] * c[1] + i[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [p, k, S] = i.map((F, W) => m * F + v * c[W]), C = s * p / k;
  return { ...t, x: n.x + C, y: n.y - by(C, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const Ny = 0.15;
function Mx(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Ny;
}
function Dy(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const jy = (e) => !(e != null && e.on);
function Sx(e, t, n) {
  if (jy(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Sa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Fo = (e) => e * e * (3 - 2 * e);
function Py(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = Sa(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, a = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - Fo(Sa(e, ...Je.fade)), lit: a, white: e < Je.flash[0] ? 0 : 1 - Fo(Sa(e, ...Je.flash)) };
}
const _x = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Ex(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Py(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...a } };
}
function Ax(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function Cx(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function Ox(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, Tx = { behind: 39, figure: 40, ahead: 41 }, qy = "[data-figure-pile]", Fy = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, Ln = { phases: 4, ms: 230, dim: 0.25 }, Rx = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, Ix = (e) => e === "amber" ? Ln.phases : 1;
function Bx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const Lx = Object.keys(Fy), Ve = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, zt = ([e, t], n) => e + n() * (t - e);
function Nx(e) {
  const t = Ve.least + Math.floor(e() * (Ve.most - Ve.least + 1));
  return Array.from({ length: Math.min(t, Ve.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ve.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = zt(Ve.start, e), l = zt(Ve.reach, e);
    return {
      text: Ue({ moment: "digit" }, e).name,
      x: a * o,
      y: Ve.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(zt(Ve.moveMs, e)),
      fadeMs: Math.round(zt(Ve.fadeMs, e))
    };
  });
}
const _a = { high: 3, gap: 1 };
function Dx(e) {
  const t = Math.floor(e / _a.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + _a.gap)), up: e % _a.high * (rt.height - rt.top) };
}
const Wy = (e, t, n) => Ue({ moment: "unit", memory: e, now: t }, n) !== null, Hy = { after: 5 }, Uy = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Or(t).isBuild());
function jx(e, t, n) {
  const a = Uy(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Hy.after ? s : null;
}
function Px(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Wy(n, a, s) } : null;
}
const Wo = { ahead: 140, up: 70 };
function qx(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Wo.ahead, y: a - Wo.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ea = { least: 4e3, most: 1e4 }, zy = (e) => Ea.least + e() * (Ea.most - Ea.least), wt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function Fx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = zy(t);
    if (n.length >= wt.most || t() >= wt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (wt.at[0] + t() * (wt.at[1] - wt.at[0]));
    n.push({ from: o, to: o + wt.ms }), a = o + wt.ms;
  }
}
const Wx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), Hx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Nr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), Ux = new Set(ta.filter((e) => Nr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Vy = (e) => e.some((t) => t.state === "built"), zx = (e, t) => Vy(t) ? e.filter((n) => !Nr.has(n.beat)) : e, dt = { reach: 40, room: 6 }, Gy = (e, t) => t <= e - dt.reach + 2, Vx = (e, t, n) => Gy(e, n) ? t - dt.reach : e - dt.reach - dt.room, Gx = (e, t, n, a) => a > 0 && t < e && t + dt.reach >= e - 2 ? Math.min(n, Math.max(e, t + dt.reach)) : e, Aa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, Kx = (e) => zt(e() < Aa.longShare ? Aa.long : Aa.short, e), Ky = 2 * rt.width;
function Yx(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Ky ? o : e + (o - e + s / 2) % s;
}
const Yy = 60, Jx = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Yy, Ho = "[data-figure-home]", hn = () => {
  var t;
  const e = document.querySelector(Ho);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ho)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Jy = "[data-figure-docked-bars]", Zy = "[data-figure-chat-foot]", Xy = [0.85, 0.6, 0.35, 0.15], Qy = ["question", "waiting", "suggestion"], Zx = (e, t) => Qy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Xx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const eb = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", tb = "[data-figure-newest]";
function Dr() {
  var a, s;
  const e = (a = hn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(tb), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Ts(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function sn(e, t, n = Dr()) {
  if (!e || !n) return !0;
  const a = at(e, t), s = aa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Oe.top * t.size, bottom: a.top + Oe.bottom * t.size }, l = $t.gap;
  return !na(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function Qx(e, t, n, a = Dr()) {
  if (!a || sn(t, e, a)) return null;
  const s = aa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Ct(), i = t.posture === "stand" ? Is * e.size : zr * e.size, c = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - $t.gap - l, a.right + $t.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= c && m.x <= d && sn(m, e, a) && Ob(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const Ca = 0.26, jr = 0.54, nb = 1.25 / 5.4, mn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ca, travels: "stand" },
  lounge: { drop: Ca, travels: "stand" },
  composed: { drop: Ca, travels: "stand" },
  hang: { drop: jr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, e$ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * nb * Math.cos(t * Math.PI / 180),
  y: 1 - n - jr
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), ab = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), t$ = (e, t) => (e === "sit" ? ab.has(t) : Yt.has(e)) ? e : "stand";
function n$(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const a$ = 0.25, s$ = (e, t) => Yt.has(e) && mn[t].drop === 0, Pr = 2, sb = 90, ob = 180, lb = 140, rb = 280, ib = 420, cb = 0.25, ub = 290, db = 600, fb = "cubic-bezier(0.2, 0.7, 0.4, 1)", hb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Oa = 5;
function zn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: c = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Oa) return null;
  (l || r) && (o = Math.max(o, Pr));
  const v = o > 1, p = Math.abs(t.x - e.x), k = p < Oa ? 0 : p / (sb * o) * 1e3, S = Math.min(k, v ? lb : ob), C = Math.abs(t.y - e.y), F = t.y < e.y, W = F && !m && Cy(C, n, i, c, d, f), L = F ? ib + Math.min(C, 400) * cb : Math.sqrt(2 * C / As) * 1e3, $ = {
    x: t.x,
    y: t.y,
    ms: C > Oa ? W ? db : L : 0,
    lead: W ? ub : F ? rb : 0,
    easing: F ? fb : hb,
    hopping: !0,
    clip: W ? "backflip" : F ? "jump" : "fall"
  }, _ = { x: t.x, y: t.y, ms: k + S, lead: 0, easing: "linear", ramp: S, ...v ? { clip: "run" } : {} }, y = m ? mb(t, n) : $, B = F && !a ? [{ ..._, y: e.y }, y] : [{ ...$, x: e.x }, _];
  return { way: Math.sign(t.x - e.x) || 1, legs: B, lands: !s, pace: o, running: v };
}
const mb = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), pb = (e, t) => e.postures.includes(t) ? t : e.postures[0], o$ = (e, t, n) => e.posture === "walk" && n ? "walk" : pb(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - mn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, na = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Ts = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ct() {
  var t;
  const e = (t = hn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const An = 0.5, Uo = 20;
function l$(e, t, n = Ct()) {
  const a = at(e, t);
  return a.left >= n.left + Uo && a.right <= n.right - Uo;
}
function Rs(e, t, n = Ct()) {
  const a = at(e, t), s = a.right - a.left, o = aa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - An && r <= n.right + An && a.top >= n.top - An && i <= n.bottom + An;
}
const Vn = [0.35, 0.5, 0.65], Gn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Oe = { left: Vn[0], right: Vn.at(-1), top: Gn[0], bottom: Gn.at(-1) }, gb = 0.24;
function aa(e) {
  if (e.posture === "stand") return { left: Oe.left, right: Oe.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + gb * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Oe.left, t), right: Math.max(Oe.right, t) };
}
function vb(e, { size: t }, n = Ct()) {
  const a = aa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Is = (Oe.right - Oe.left) / 2 + 0.08;
function r$(e, t) {
  return e === "hang" ? Oe : { ...Oe, bottom: Math.min(Oe.bottom, 1 - t - mn[e].drop) };
}
const yb = "[data-figure-agent]";
function qr(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Ts(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[i].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, i), c.setEnd(o, i + 1), [...c.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Fr = (e) => Gn.flatMap(
  (t) => Vn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Bs(e, t, n = "") {
  if (!sn(e, t)) return Vn.length * Gn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(eb)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && na(s, i) && Ts(r)).map(({ rect: r }) => r), l = (r, i) => o.some((c) => r >= c.left && r <= c.right && i >= c.top && i <= c.bottom);
  return Fr(s).filter(([r, i]) => l(r, i) || qr(r, i, n)).length;
}
function bb(e, t) {
  const n = at(e, t);
  return Fr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => qr(a, s, "", yb)).length;
}
const zo = 4;
function i$(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = zo; o <= s; o += zo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!bb(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = Ct(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Rs(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Bs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Wr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), wb = [0.5, 0.25, 0.75], kb = (e) => Wr(e.getBoundingClientRect(), wb), Hr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, xb = Is, $b = (e, t, { size: n }, a = xb) => Ur(e, Hr[t], a * n, "stand");
function Ur(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Mb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, zr = 0.1, Sb = (e, t, { size: n }) => Ur(e, Mb[t], zr * n, "sit"), _b = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ta = 60;
function c$(e, t) {
  const n = _b(t);
  return !e.aside || Math.abs(n) >= Ta ? t : n < 0 ? 360 - Ta : Ta;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Eb = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function u$(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Eb(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? Ab(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function Ab(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function d$(e, t) {
  const { element: n, edge: a } = sa(), s = ["left", "right"].map((r) => pn(Sb(a, r, e), e)).filter((r) => n && Rs(r, e) && !Bs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function f$(e, t, { size: n }) {
  const a = (Oe.right - Oe.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Vr } : e;
}
const Vr = 7;
function Gr() {
  const e = [...document.querySelectorAll(qy)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Cb(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Oe.left * a, right: n.left + Oe.right * a, top: n.top + Oe.top * a, bottom: n.bottom };
}
function Ob(e, t) {
  const n = Gr();
  return !n || !na(Cb(e, t), n);
}
const Tb = 4;
function sa() {
  const e = gn(), t = Gr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Tb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Vr - n, 0) } };
}
const h$ = ({ size: e, below: t }) => (1 - t) * e;
function pn(e, t) {
  const n = Ct(), { size: a, below: s } = t, o = mn[e.posture].drop * a;
  return { ...vb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ls = (e, t) => Object.keys(Hr).map((n) => pn($b(e, n, t), t)), Ls = (e, t) => Wr(e, Xy).map((n) => pn(n, t)), Kr = (e, t, n) => on(e, t, n) ?? e[0];
function m$(e, t) {
  const { element: n, edge: a } = sa();
  return { ...Kr(ls(a, e), e, t), view: null, on: n };
}
function p$(e, t, n, a) {
  const { element: s, edge: o } = sa(), l = (a ? ls(o, t) : [...ls(o, t), ...Ls(o, t)]).filter(
    (c) => !na(at(c, t), e)
  ), r = on(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Bs(r, t) ? r : on(l, t, n);
  return i && { ...i, view: null, on: s };
}
function gn() {
  var a;
  const e = hn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Jy);
  if (!t) return { ...oa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Vo = { within: 2 };
function g$(e) {
  const { element: t, docked: n, edge: a } = gn();
  if (!n || e.on !== t) return !0;
  const s = oa().edge;
  return a.left > s.left + Vo.within || a.left + a.width < s.left + s.width - Vo.within;
}
const Rb = "[data-figure-closing]";
function v$() {
  var n;
  const { element: e, docked: t } = gn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Rb));
}
const Yr = "[data-figure-progress]";
function y$(e) {
  const t = e.querySelector(Yr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function b$(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Ib = { across: 300, above: 380, below: 60 };
function w$(e) {
  const { across: t, above: n, below: a } = Ib;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Bb(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Bb = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Jr = "[data-figure-bar]", rs = { back: 144, along: 0.4 };
function k$(e) {
  const { element: t, docked: n, edge: a } = gn(), s = n ? t.querySelector(Jr) : null;
  if (!(s != null && s.querySelector(Yr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...pn({ x: o - rs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function x$(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < rs.along * a.size ? t.x + rs.along * a.size : e.x, y: e.y, behind: !0 };
}
function $$(e) {
  const t = e.querySelector(Jr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function oa() {
  const e = hn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function M$(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = oa(), i = n === null ? Lb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : pn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Lb(e, t, n, a, s) {
  const o = Ls(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - dt.reach - dt.room >= l);
  return on(r.length ? r : o, t, n);
}
const Nb = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function S$(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: c = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Pr));
  const v = (W) => {
    const L = at(W, n, mn[W.posture].travels);
    return { x: L.left, y: L.top };
  }, p = t.ladder ?? e.ladder;
  if (p && !(t.ladder && e.ladder)) return Db(v(e), v(t), v({ ...p.foot, posture: "stand" }), p.way, !!t.ladder, n, s);
  const [k, ...S] = [e, ...i, t].map(v), C = zn(k, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: c, now: d, room: f, pogo: m }), F = S.slice(1).map((W, L) => {
    var $;
    return ($ = zn(S[L], W, n.size, { random: r, memory: c, now: d, room: f })) == null ? void 0 : $.legs.find((_) => _.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...F.filter(Boolean)] };
}
function Db(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Nb.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? zn(e, n, o.size, { pace: l }) : zn(n, t, o.size, { pace: l }), c = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function _$(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function E$(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(kb(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = sa();
  return { ...Kr(Ls(s, t), t, n), view: null, on: a };
}
const jb = "[data-figure-bubble]", Pb = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Zr = 0;
const qt = () => Zt, Ra = /* @__PURE__ */ new WeakMap();
let qb = 0;
function Ns(e) {
  return Ra.has(e) || Ra.set(e, `floor-${++qb}`), Ra.get(e);
}
const Fb = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Wb = () => {
  var e, t;
  return ((t = (e = hn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Hb(e, t) {
  var a;
  const n = (a = e.querySelector(Zy)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Ub(e, t) {
  const n = e && Hb(e, t), a = e ? [...e.querySelectorAll(jb)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Fb(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Ns(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const zb = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Pb ? (t.top - a.top) / s * 1e3 : 0;
};
function Xr(e = Zt, t = performance.now()) {
  const n = Ct(), a = Wb(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = gn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const c = oa();
  return c.element && i.push({ id: Ns(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), i.push(...Ub(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: zb(e, d, t) }))) });
}
const is = /* @__PURE__ */ new Set();
function Vb(e) {
  return is.add(e), () => is.delete(e);
}
function Gb() {
  Qr();
  const e = () => {
    Zr = requestAnimationFrame(e), !document.hidden && (Zt = Xr(Zt), is.forEach((t) => t(Zt)));
  };
  e();
}
function Qr() {
  cancelAnimationFrame(Zr);
}
const Ds = 5, Kb = 56, Yb = { share: 0.6 }, Jb = (e) => -Math.sqrt(2 * As * Yb.share * e), Nt = (e, t) => e.find((n) => n.id === t) ?? null;
function A$(e, t = Xr().floors) {
  const n = Nt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ns(e.on) : null, o = s && Nt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function ei({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = qt().floors) {
  const c = Nt(i, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || Zb(c, d, o)) && Xb(d, r, i) ? { x: d.x, y: d.y } : null;
}
const js = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Zb = (e, t, n) => !js({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function C$(e, t = qt().floors) {
  if (!js(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ds && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Xb(e, t, n = qt().floors) {
  const a = Nt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Rs(e, t);
}
function O$(e, t, n, a = qt().floors) {
  const s = ei(e, n, a);
  if (!e.home) return Qb(e, t, s, a);
  if (!s) return null;
  const o = Nt(a, "home"), l = s.y - t.y, r = l > Ds ? "dropping" : -l > Kb ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function Qb(e, t, n, a) {
  const s = n ? Nt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Jb(e.risen) };
  if (!n) return null;
  if (js(t) && n.y - t.y > Ds) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function T$(e, t, n) {
  const a = Is * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function R$(e, t, n, a = qt().floors) {
  const s = t && ei(t, n, a);
  return s ? { ...e, ...s } : e;
}
const ew = ["data-type"], tw = { class: "figure-floor-name" }, nw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      b("span", tw, w(e.floor.type), 1)
    ], 12, ew));
  }
}, aw = /* @__PURE__ */ Y(nw, [["__scopeId", "data-v-4e0f1e2e"]]), sw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, ow = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ke(qt().floors);
    let n = () => {
    };
    return Ie(() => {
      n = Vb((a) => t.value = a.floors), Gb();
    }), Le(() => {
      n(), Qr();
    }), (a, s) => (u(), h("div", sw, [
      (u(!0), h(G, null, Q(t.value, (o) => (u(), H(aw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, I$ = /* @__PURE__ */ Y(ow, [["__scopeId", "data-v-e519168b"]]), Ia = (e) => typeof e == "number" ? e : Date.parse(e);
function B$(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ia(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ia(s.row.created_at) - Ia(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const lw = 3, Ba = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function rw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ba[n.grouping]) == null ? void 0 : a.call(Ba, e.row, n)) || "";
}
function iw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function L$(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= lw ? [iw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = rw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const cw = 50, uw = "refresh", dw = 1e3;
function fw({ state: e = () => ({}), tab: t = () => "" } = {}) {
  const n = ze(), a = Jn({}), s = {}, o = /* @__PURE__ */ new Set();
  let l = {}, r = 0;
  const i = (W) => a[W] ?? (a[W] = { value: void 0, failure: "", loaded: !1, readAt: 0 }), c = (W) => !l[W].tab || l[W].tab === t(), d = () => t() ? { ...e(), tab: t() } : e();
  function f(W, L, $) {
    s[W] = { heardEvent: L, showFirst: $, isFirst: !0 };
  }
  async function m(W, L) {
    const $ = Object.fromEntries(Object.entries(L).map(([y, B]) => [`${W}.${y}`, B])), _ = await n.readKeys({ only: [W], state: { ...d(), ...$ } });
    return _.ok ? _.value.keys[W] : _;
  }
  function v(W, L) {
    const $ = s[W];
    $ && (($.isFirst || !L.ok) && $.showFirst(L), $.isFirst = !1);
  }
  async function p({ only: W = [] } = {}) {
    const L = await n.readKeys({ only: W, state: d() });
    return L.ok ? (Object.entries(L.value.keys).forEach(([$, _]) => {
      i($).failure = _.ok ? "" : _.error, i($).loaded = !0, i($).readAt = Date.now(), _.ok && (i($).value = _.value), v($, _);
    }), C(L.value.declared), !0) : (L.failure !== "cancelled" && Object.keys(s).forEach(($) => v($, L)), L.failure !== "cancelled" && W.forEach(($) => i($).failure = L.error), !1);
  }
  function k(W) {
    W.forEach((L) => o.add(L)), clearTimeout(r), r = setTimeout(() => {
      const L = [...o];
      o.clear(), L.length && p({ only: L });
    }, cw);
  }
  function S(W) {
    const L = Object.keys(l).filter((_) => W.event === uw || l[_].events.some((y) => ps(y, W.event)));
    L.filter((_) => s[_]).forEach((_) => s[_].heardEvent(W));
    const $ = L.filter((_) => !s[_]);
    $.filter((_) => !c(_)).forEach((_) => i(_).loaded = !1), k($.filter(c));
  }
  function C(W) {
    if (Object.keys(l).length) return;
    l = W;
    const L = [...new Set(Object.values(W).flatMap(($) => $.events))];
    L.length && n.follow(L, S);
  }
  fe(t, () => {
    const W = Object.keys(l).filter((L) => c(L) && !i(L).loaded);
    W.length && p({ only: W });
  }), Le(() => clearTimeout(r));
  function F() {
    const W = Date.now(), L = Object.keys(l).filter(($) => l[$].reload_seconds > 0 && c($) && W - i($).readAt >= l[$].reload_seconds * 1e3);
    L.length && k(L);
  }
  return Ss(F, () => n.visible.value, dw), queueMicrotask(p), { data: a, reload: p, readKey: m, handle: f };
}
class N$ {
  constructor(t = {}) {
    this.data = fw(t);
  }
  key(t) {
    return this.data.data[t];
  }
  rows(t, n = {}) {
    return zp(this.data, t, n);
  }
  reload(t = []) {
    return this.data.reload({ only: t });
  }
}
const hw = 1e3;
function mw() {
  const e = R(Date.now()), t = setInterval(() => e.value = Date.now(), hw);
  return pt(() => clearInterval(t)), e;
}
const pw = ["datetime", "title"], la = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = mw(), a = I(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(j(sr)(e.at, j(n))), 9, pw));
  }
};
function D$(e) {
  const t = ze(), n = t.option("row"), a = R(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), fe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function gw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const j$ = (e) => (t) => t.filter((n) => n.id !== e), P$ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), q$ = (e) => (t) => [...t, e], F$ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function W$(e, t = {}) {
  const n = ze(), a = R(null), s = R("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function H$(e) {
  const t = ze(), n = R("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Cn = /* @__PURE__ */ new Map();
function vw(e, t) {
  if (Cn.has(e)) return Cn.get(e);
  const n = t().finally(() => Cn.delete(e));
  return Cn.set(e, n), n;
}
function U$() {
  const e = ze(), t = R(null), n = R("");
  async function a() {
    const s = await vw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const yw = { class: "cards-page" }, bw = { class: "cards-bar" }, ww = { class: "cards-count" }, kw = { class: "cards" }, xw = {
  key: 1,
  class: "cards-note"
}, $w = {
  key: 2,
  class: "cards-note"
}, Mw = ["data-row", "onClick"], Sw = { class: "card-head" }, _w = { class: "card-title" }, Ew = { class: "card-foot" }, Aw = {
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
    return (a, s) => (u(), h("div", yw, [
      b("div", bw, [
        b("span", ww, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        N(de, Fe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: P(() => [
            N(ye, {
              name: "plus",
              size: 12
            }),
            ee(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      b("div", kw, [
        e.loaded ? e.failure ? (u(), h("p", xw, w(e.failure), 1)) : e.rows.length ? A("", !0) : (u(), h("p", $w, "No " + w(e.noun) + "s yet", 1)) : (u(), H(Et, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), h(G, null, Q(e.rows, (o) => (u(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          b("span", Sw, [
            N(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ee(" " + w(e.head(o)), 1),
            N(la, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          b("span", _w, w(e.title(o)), 1),
          b("span", Ew, w(e.foot(o)), 1)
        ], 8, Mw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, z$ = /* @__PURE__ */ Y(Aw, [["__scopeId", "data-v-990e6b37"]]), Go = "newest";
function V$(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Ae(Te, null)) == null ? void 0 : c.search, s = R(""), o = R(Go), l = R("all"), r = I(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => gw(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Go ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = I(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Cw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Ow = 40, Tw = "top", Rw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Ae(Te, null)) == null ? void 0 : f.autoScroll, s = I(() => a === Tw), o = R(null), l = R(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= Ow;
    }
    return fe(() => n.rowCount, async () => {
      await mt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (u(), h("div", Cw, [
      b("div", {
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
        default: P(() => [
          tt(b("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: c
          }, [
            N(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = ee(" Newest ", -1))
          ], 512), [
            [nl, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, G$ = /* @__PURE__ */ Y(Rw, [["__scopeId", "data-v-3accb764"]]), Iw = ["aria-selected", "data-tab", "onClick"], Bw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Lw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ae(Te, null), o = I(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = R(null), r = R({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function c(m) {
      var p;
      const v = (p = l.value) == null ? void 0 : p.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const d = () => mt(() => c(!0));
    let f = null;
    return Ie(() => {
      var m;
      c(!1), f = new ResizeObserver(() => c(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => c(!1));
    }), Le(() => f == null ? void 0 : f.disconnect()), fe(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), fe(() => n.answer, d, { deep: !0 }), (m, v) => (u(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), h(G, null, Q(o.value, (p) => {
        var k, S;
        return u(), h("button", {
          key: p.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((k = e.active) == null ? void 0 : k.key) === p.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === p.key,
          "data-tab": p.key,
          onClick: (C) => a("choose", p)
        }, [
          ee(w(p.label) + " ", 1),
          i(p) ? (u(), h("span", Bw, w(e.answer[p.count_field]), 1)) : A("", !0)
        ], 10, Iw);
      }), 128)),
      b("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, K$ = /* @__PURE__ */ Y(Lw, [["__scopeId", "data-v-63fcd326"]]), Nw = {
  class: "tab-body",
  "data-tab-body": ""
}, Dw = { "data-tab-content": "" }, jw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = R(!1);
    let a = 0;
    return fe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ms(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), h("div", Nw, [
      n.value ? (u(), H(Et, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : A("", !0),
      tt(b("div", Dw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [nl, !n.value]
      ])
    ]));
  }
}, Y$ = /* @__PURE__ */ Y(jw, [["__scopeId", "data-v-63876533"]]), Pw = {}, qw = { class: "menu-label" };
function Fw(e, t) {
  return u(), h("span", qw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const cs = /* @__PURE__ */ Y(Pw, [["render", Fw], ["__scopeId", "data-v-aa955b3e"]]), Ww = {
  class: "search-bar",
  "data-search-bar": ""
}, Hw = { class: "search-bar-control" }, Uw = ["value", "placeholder", "aria-label"], zw = ["aria-expanded"], Vw = {
  key: 0,
  "data-menu-count": ""
}, Gw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var C;
    const a = e, s = n, o = pi(), l = ((C = Ae(Te, null)) == null ? void 0 : C.search) ?? {}, r = I(() => l.placeholder || a.placeholder), i = l.context ?? [], c = R(null), d = R(null), f = R([]), m = I(() => f.value.length ? f.value[f.value.length - 1].next : i), v = I(() => !!o.menu || i.length > 0), p = (F) => {
      f.value = [], d.value = d.value ? null : F.currentTarget;
    };
    function k(F) {
      if (F.next.length) {
        f.value = [...f.value, F];
        return;
      }
      d.value = null, s("pick", F.click);
    }
    function S() {
      var F;
      s("update:modelValue", ""), (F = c.value) == null || F.focus();
    }
    return t({ focus: () => {
      var F;
      return (F = c.value) == null ? void 0 : F.focus();
    } }), (F, W) => {
      var L;
      return u(), h("div", Ww, [
        b("div", Hw, [
          N(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          b("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: W[0] || (W[0] = ($) => s("update:modelValue", $.target.value)),
            onKeydown: Xt(S, ["esc"])
          }, null, 40, Uw),
          e.modelValue ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            N(ye, {
              name: "close",
              size: 12
            })
          ])) : A("", !0),
          v.value ? (u(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: p
          }, [
            e.menuCount ? (u(), h("span", Vw, w(e.menuCount), 1)) : A("", !0),
            N(ye, {
              name: "caret",
              size: 12
            })
          ], 8, zw)) : A("", !0)
        ]),
        (L = j(l).button) != null && L.title ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: W[1] || (W[1] = ($) => s("pick", j(l).button.click))
        }, w(j(l).button.title), 1)) : A("", !0),
        ue(F.$slots, "default", {}, void 0, !0),
        d.value ? (u(), H(Xn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: W[3] || (W[3] = xe(() => {
          }, ["stop"])),
          onClose: W[4] || (W[4] = ($) => d.value = null)
        }, {
          default: P(() => [
            f.value.length ? (u(), H(St, {
              key: 0,
              "data-search-back": "",
              onClick: W[2] || (W[2] = ($) => f.value = f.value.slice(0, -1))
            }, {
              default: P(() => [
                ee("‹ " + w(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (u(!0), h(G, null, Q(m.value, ($) => (u(), H(St, {
              key: $.title,
              description: $.subtext,
              "data-search-entry": $.title,
              onClick: (_) => k($)
            }, {
              default: P(() => [
                ee(w($.title) + w($.next.length ? " ›" : ""), 1)
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
}, Kw = /* @__PURE__ */ Y(Gw, [["__scopeId", "data-v-45374bed"]]), Yw = {
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
    return (o, l) => (u(), H(Kw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: P(() => [
        N(cs, null, {
          default: P(() => [...l[2] || (l[2] = [
            ee("Order", -1)
          ])]),
          _: 1
        }),
        (u(), h(G, null, Q(a, (r) => N(St, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: P(() => [
            ee(w(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), h(G, { key: 0 }, [
          N(cs, null, {
            default: P(() => [...l[3] || (l[3] = [
              ee("Show", -1)
            ])]),
            _: 1
          }),
          (u(), h(G, null, Q(s, (r) => N(St, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: P(() => [
              ee(w(r.label), 1)
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
}, J$ = /* @__PURE__ */ Y(Yw, [["__scopeId", "data-v-dab0064d"]]);
function Z$() {
  const e = R(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const X$ = (e) => import(
  /* @vite-ignore */
  e
), Jw = 86400, us = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Zw(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((us(t) - us(e)) / Jw);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function Q$(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = us(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Zw(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const La = 280, Na = 240, Da = 120, Xw = 6, Qw = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function ek(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function ti(e, t) {
  const n = Math.max(0, ek(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function tk(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Qw}px)` }), e.offsetHeight, e.style.transition = `height ${La}ms ${ln}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (c) return;
    n() && (t.scrollTop = ti(t, e));
    const m = s() - r;
    if (!i && m >= La && (i = !0, e.style.transition = `opacity ${Na}ms ease-out, transform ${Na}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < La + Na) return a(f);
    d();
  };
  return a(f), d;
}
function e8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Xw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Da}ms ease-out, transform ${Da}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = ti(t, e)), s() - l < Da) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const nk = 140, On = 220, Ko = 5;
function t8({ gap: e = nk, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Ko);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const c = (d, f, m, v = tk) => {
    if (l || !f.pane || !f.follows()) return m();
    const p = { el: d, options: f, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, r(p, () => o = t(i, e));
    d.style.display = "none", n.push(p), n.length >= Ko && c.flush();
  };
  return c.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const f of [...a]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, c;
}
function n8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${On}ms ${ln}, opacity ${On}ms ease-in, margin ${On}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, On);
}
const ni = "chat.pins.minimised", Nn = R(Dn(ni, !1));
function Yo(e) {
  Nn.value = e, ks(ni, e);
}
function ak(e) {
  const t = I(() => e()), n = I(() => Nn.value ? [] : e()), a = () => Yo(!Nn.value), s = Date.now() / 1e3;
  return fe(
    () => t.value.filter((o) => _t(o) > s).length,
    (o, l) => o > l && Yo(!1)
  ), { pins: t, visible: n, minimised: Nn, toggle: a };
}
const sk = ["title"], ok = {
  key: 0,
  class: "pins-count"
}, lk = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = ak(() => t.pinRows);
    return (o, l) => j(n).length ? (u(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: j(a), inline: e.inline }]),
      title: j(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => j(s) && j(s)(...r), ["stop"]))
    }, [
      N(ye, {
        name: j(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      j(a) ? (u(), h("span", ok, w(j(n).length), 1)) : A("", !0)
    ], 10, sk)) : A("", !0);
  }
}, a8 = /* @__PURE__ */ Y(lk, [["__scopeId", "data-v-d073c504"]]), rk = ["title"], ik = ["title"], ck = { class: "diff-card-dir" }, uk = { class: "diff-card-name" }, dk = ["title"], fk = ["title"], hk = {
  key: 0,
  class: "diff-card-note"
}, mk = ["href"], pk = ["src", "alt"], gk = { class: "diff-card-rows" }, vk = { class: "diff-row-num" }, yk = { class: "diff-row-sign" }, bk = { class: "diff-row-code" }, wk = {
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
    function o(O) {
      (O.metaKey || O.ctrlKey) && (O.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = I(() => n.path.lastIndexOf("/") + 1), c = I(() => n.path.slice(0, i.value)), d = I(() => n.path.slice(i.value)), f = I(() => n.change === "deleted"), m = I(() => l[n.change]), v = I(() => new Set(n.rows.filter((O) => O.line_type === "add").map((O) => O.line))), p = R("after"), k = I(() => p.value === "before" ? n.whole.old : n.whole.text), S = I(() => n.whole && n.whole.text !== void 0 ? k.value.split(`
`).map((O, x) => ({ line_type: p.value === "after" && v.value.has(x + 1) ? "add" : "ctx", line: x + 1, text: O })) : n.rows.filter(
      (O) => !(n.editsOnly && ["ctx", "fold"].includes(O.line_type)) && !(n.hideRemovals && O.line_type === "del")
    )), C = R(!1), F = I(() => n.lines && !C.value && !n.whole), W = I(() => F.value ? S.value.slice(0, n.lines) : S.value), L = I(() => S.value.length - W.value.length), $ = (O) => O.line === null || O.line_type === "del" ? "" : O.line, _ = (O) => O.line_type === "fold" ? O.hidden ? `⋯ ${O.hidden} lines` : "⋯" : O.text, y = R(null), B = R(null);
    let M = null;
    return Ie(() => {
      if (!B.value) return;
      let O = !0;
      M = new ResizeObserver(() => {
        !y.value || !B.value || (y.value.style.transition = O ? "none" : "", y.value.style.height = `${B.value.offsetHeight}px`, O = !1);
      }), M.observe(B.value);
    }), Le(() => M && M.disconnect()), (O, x) => (u(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      b("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: x[2] || (x[2] = (g) => !f.value && a("fold"))
      }, [
        b("span", {
          class: "diff-card-path",
          title: `${e.path} · ${j(s)}-click to open it`,
          onClick: o
        }, [
          b("span", ck, w(c.value), 1),
          b("span", uk, w(d.value), 1),
          m.value ? (u(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, w(m.value), 3)) : A("", !0)
        ], 8, ik),
        b("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        b("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
        N(la, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: p.value === "after" ? "Show the file before" : "Show the file after",
          onClick: x[0] || (x[0] = xe((g) => p.value = p.value === "after" ? "before" : "after", ["stop"]))
        }, w(p.value === "after" ? "After" : "Before"), 9, dk)) : A("", !0),
        f.value ? A("", !0) : (u(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: x[1] || (x[1] = xe((g) => a("whole"), ["stop"]))
        }, [
          N(ye, {
            name: "file",
            size: 12
          })
        ], 10, fk))
      ], 8, rk),
      e.whole && e.whole.error ? (u(), h("p", hk, w(e.whole.error), 1)) : A("", !0),
      !f.value && !e.folded ? (u(), h(G, { key: 1 }, [
        e.picture ? (u(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          b("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, pk)
        ], 8, mk)) : (u(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: y,
          class: "diff-card-grow"
        }, [
          b("div", {
            ref_key: "body",
            ref: B,
            class: "diff-card-diff"
          }, [
            b("div", gk, [
              (u(!0), h(G, null, Q(W.value, (g, E) => (u(), h("div", {
                key: E,
                class: Z(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                b("span", vk, w($(g)), 1),
                b("span", yk, w(r[g.line_type]), 1),
                b("span", bk, w(_(g)), 1)
              ], 2))), 128)),
              L.value > 0 ? (u(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: x[3] || (x[3] = xe((g) => C.value = !0, ["stop"]))
              }, w(L.value) + " more " + w(L.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, s8 = /* @__PURE__ */ Y(wk, [["__scopeId", "data-v-23581cbb"]]), kk = {
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
    const n = t, a = e, s = I(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = I(() => s.value && { render: () => Kn(hm, { line: s.value.line, events: s.value.events }) }), l = R(null), r = I(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = l.value) != null && v.component_trusted);
    }), i = I(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = I(
      () => {
        var m, v;
        return l.value ? Wg(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
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
    return fe(
      () => {
        var m, v;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((v = s.value) == null ? void 0 : v.line);
      },
      async () => {
        await d(), c.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, v) => {
      var p, k;
      return !s.value && ((p = e.catalogue.loaded) == null ? void 0 : p.value) === !1 ? (u(), H(Es, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((k = s.value) == null ? void 0 : k.shows) === "one-agent" && e.agent === null ? (u(), H(Qt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (u(), H(Kt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), H(mr, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (S, C) => n("option", S, C))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), H(hr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (S, C) => n("option", S, C))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), H(Kt, {
        key: s.value.line || s.value.entry_url,
        name: e.name,
        component: o.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
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
        onOption: v[2] || (v[2] = (S, C) => n("option", S, C))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), H(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (S) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, xk = ["data-section"], $k = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ae(uu, null), a = I(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = I(() => ({ row: t.row }));
    return (o, l) => (u(!0), h(G, null, Q(a.value, (r) => (u(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      N(kk, {
        name: r.name,
        catalogue: j(n).catalogue,
        subscriptions: j(n).subscriptions,
        environment: j(n).environment,
        prompts: j(n).prompts,
        "shell-read": j(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, xk))), 128));
  }
}, Mk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: P(() => [
        N(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Sk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, _k = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Ek = { class: "ask-text" }, Ak = ["placeholder", "aria-label"], Ck = ["placeholder", "aria-label"], Ok = {
  key: 3,
  class: "moves"
}, Tk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(() => F0(a.noun, a.row)), l = R(""), r = R(null), i = R(""), c = R("");
    fe(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(v, p = "") {
      const k = await a.read([v.noun ?? a.noun, v.word, String(a.id), ...v.flag ? [v.flag, p] : v.positional ? [p] : [], ...v.opener && c.value.trim() ? ["--on", c.value.trim()] : []]);
      l.value = k.ok ? "" : k.error, k.ok && (r.value = null, i.value = "", c.value = "", s("done"));
    }
    const f = (v) => v.confirm ? r.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (r.value = v, i.value = "") : d(v), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (v, p) => o.value.length ? (u(), H(rr, {
      key: 0,
      inline: e.inline
    }, {
      default: P(() => {
        var k;
        return [
          l.value ? (u(), h("p", Sk, w(l.value), 1)) : A("", !0),
          (k = r.value) != null && k.confirm ? (u(), h("div", _k, [
            b("span", Ek, w(r.value.confirm), 1),
            N(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: Z({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: p[0] || (p[0] = (S) => d(r.value))
            }, {
              default: P(() => [
                ee(w(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            N(de, {
              small: "",
              variant: "ghost",
              onClick: p[1] || (p[1] = (S) => r.value = null)
            }, {
              default: P(() => [...p[7] || (p[7] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ])) : r.value ? (u(), h("form", {
            key: 2,
            class: "ask",
            "data-resource-ask": "",
            onSubmit: xe(m, ["prevent"])
          }, [
            tt(b("input", {
              "onUpdate:modelValue": p[2] || (p[2] = (S) => i.value = S),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: p[3] || (p[3] = Xt(xe((S) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Ak), [
              [Wa, i.value]
            ]),
            r.value.opener ? tt((u(), h("input", {
              key: 0,
              "onUpdate:modelValue": p[4] || (p[4] = (S) => c.value = S),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: p[5] || (p[5] = Xt(xe((S) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Ck)), [
              [Wa, c.value]
            ]) : A("", !0),
            N(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: P(() => [
                ee(w(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            N(de, {
              small: "",
              variant: "ghost",
              onClick: p[6] || (p[6] = (S) => r.value = null)
            }, {
              default: P(() => [...p[8] || (p[8] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (u(), h("div", Ok, [
            (u(!0), h(G, null, Q(o.value, (S) => (u(), H(de, {
              key: S.word,
              small: !S.bordered,
              bordered: S.bordered,
              icon: S.icon,
              variant: S.main ? "primary" : "ghost",
              class: Z({ danger: S.danger }),
              "data-move": S.word,
              onClick: (C) => f(S)
            }, {
              default: P(() => [
                ee(w(S.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : A("", !0);
  }
}, Rk = /* @__PURE__ */ Y(Tk, [["__scopeId", "data-v-bdac0207"]]), Ik = /* @__PURE__ */ new Set(["completed", "cancelled"]), Bk = (e) => Ik.has(e), rn = (e) => Bk(e) ? "done" : e, Lk = { class: "facts" }, Nk = { class: "fact wide" }, Dk = ["title"], jk = {
  key: 1,
  class: "fact-value"
}, Pk = {
  key: 0,
  class: "fact"
}, qk = { class: "fact-value" }, Fk = { class: "fact" }, Wk = { class: "fact-label" }, Hk = ["title"], Uk = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, zk = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Vk = {
  key: 2,
  class: "fact"
}, Gk = { class: "fact-value" }, Kk = { class: "fact wide" }, Yk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Jk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Fn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return u(), h("div", Lk, [
        b("div", Nk, [
          l[3] || (l[3] = b("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: l[0] || (l[0] = (c) => j(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + w(e.place.plan_id) + ": " + w(e.place.plan_title), 9, Dk)) : (u(), h("span", jk, "Not in a plan"))
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (u(), h("div", Pk, [
          l[4] || (l[4] = b("span", { class: "fact-label" }, "Phase", -1)),
          b("span", qk, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.helper_id ? (u(), h(G, { key: 1 }, [
          b("div", Fk, [
            b("span", Wk, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            b("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[1] || (l[1] = (c) => j(qe)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, Hk)
          ]),
          j(s).has(e.task.state) ? (u(), h("p", Uk, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), h("p", zk, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : A("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), h("div", Vk, [
          l[5] || (l[5] = b("span", { class: "fact-label" }, "Assigned to", -1)),
          b("span", Gk, "Agent " + w(e.task.holder_id), 1)
        ])) : A("", !0),
        b("div", Kk, [
          l[6] || (l[6] = b("span", { class: "fact-label" }, "Priority", -1)),
          N(cn, {
            options: j(n),
            value: String(j(lr)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[2] || (l[2] = (c) => a("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), h("p", Yk, w(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, Zk = /* @__PURE__ */ Y(Jk, [["__scopeId", "data-v-fa2fd03f"]]);
function Xk(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, c]) => c === i).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((c) => !s.has(c)))
    i.forEach((c) => s.add(c)), o.push(i.map((c) => n.get(c)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([c]) => c === e); i && !r.has(i[1]); i = t.edges.find(([c]) => c === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const Qk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, e2 = { ...Qk, done: "Completed" }, t2 = { class: "task-status-icon" }, n2 = ["width", "height", "aria-label"], a2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = I(() => yl("task", rn(t.status))), a = I(() => n.value === "testing" ? "started" : n.value), s = I(() => e2[t.status] ?? vl("task", t.status));
    return (o, l) => (u(), h("span", t2, [
      N(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (u(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            N(jt, { value: a.value }, {
              blocked: P(() => [...l[0] || (l[0] = [
                b("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                b("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                b("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: P(() => [...l[1] || (l[1] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                b("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: P(() => [...l[2] || (l[2] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                b("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: P(() => [...l[3] || (l[3] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                b("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                b("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: P(() => [...l[4] || (l[4] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                b("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                b("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: P(() => [...l[5] || (l[5] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: P(() => [...l[6] || (l[6] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, n2))
        ]),
        _: 1
      })
    ]));
  }
}, Ps = /* @__PURE__ */ Y(a2, [["__scopeId", "data-v-ae24a63f"]]), s2 = { class: "number" }, o2 = { class: "title" }, l2 = { class: "word" }, r2 = {
  __name: "TaskChainLink",
  props: {
    status: { type: String, required: !0 },
    number: { type: Number, required: !0 },
    title: { type: String, required: !0 },
    word: { type: String, required: !0 },
    current: Boolean
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(ht(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Z(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: P(() => [
        N(Ps, { status: e.status }, null, 8, ["status"]),
        b("span", s2, w(e.number), 1),
        b("span", o2, w(e.title), 1),
        b("span", l2, w(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ja = /* @__PURE__ */ Y(r2, [["__scopeId", "data-v-f6417ae8"]]), i2 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, c2 = { class: "level" }, u2 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(!1);
    fe(() => n.task.id, () => s.value = !1);
    const o = I(() => Xk(n.task.id, n.graph)), l = I(() => s.value ? o.value.above : o.value.above.slice(-1)), r = I(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = I(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), d = (f, m = !1) => ({ status: rn(f.state), number: f.id, title: f.title, word: m ? "This task" : c(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (u(), h("section", i2, [
      m[5] || (m[5] = b("h4", null, "What waits on what", -1)),
      (u(!0), h(G, null, Q(l.value, (v) => (u(), h(G, {
        key: v.map((p) => p.id).join()
      }, [
        b("div", c2, [
          (u(!0), h(G, null, Q(v, (p) => (u(), H(ja, Fe({
            key: p.id,
            ref_for: !0
          }, d(p), {
            onSelect: m[0] || (m[0] = (k) => a("select", k))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = b("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      N(ja, gi(vi(d(e.task, !0))), null, 16),
      (u(!0), h(G, null, Q(r.value, (v) => (u(), h(G, {
        key: v.id
      }, [
        m[4] || (m[4] = b("div", { class: "waits" }, "↓ waits on", -1)),
        N(ja, Fe({ ref_for: !0 }, d(v), {
          onSelect: m[1] || (m[1] = (p) => a("select", p))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (v) => s.value = !s.value)
      }, w(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : A("", !0)
    ])) : A("", !0);
  }
}, d2 = /* @__PURE__ */ Y(u2, [["__scopeId", "data-v-db05c4b2"]]), f2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, h2 = ["datetime"], m2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), h("section", f2, [
      n[0] || (n[0] = b("h3", null, "Block history", -1)),
      (u(!0), h(G, null, Q(e.renewals, (a) => (u(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        b("time", {
          datetime: a.created_at
        }, w(new Date(a.created_at).toLocaleString()), 9, h2),
        b("p", null, w(a.reason), 1)
      ]))), 128))
    ])) : A("", !0);
  }
}, p2 = /* @__PURE__ */ Y(m2, [["__scopeId", "data-v-b41f213b"]]), g2 = {
  class: "part",
  "data-resource-waits": ""
}, v2 = ["onClick"], y2 = { class: "wait-id" }, b2 = { class: "wait-title" }, w2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("section", g2, [
      b("h4", null, w(e.title), 1),
      (u(!0), h(G, null, Q(e.waits, (o) => (u(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        N(Ps, {
          status: j(rn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        b("span", y2, w(o.id), 1),
        b("span", b2, w(o.title), 1)
      ], 8, v2))), 128))
    ]));
  }
}, Jo = /* @__PURE__ */ Y(w2, [["__scopeId", "data-v-8fb2e251"]]), k2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, x2 = { class: "text" }, $2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, M2 = 180, S2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = R(!1), l = I(() => a.task.waits.filter((i) => !n.has(i.state))), r = I(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, c) => (u(), h(G, null, [
      l.value.length ? (u(), H(Jo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), h("section", k2, [
        c[3] || (c[3] = b("h4", null, "How it was done", -1)),
        b("p", x2, w(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (u(), h("section", $2, [
        c[4] || (c[4] = b("h4", null, "The brief", -1)),
        b("p", {
          class: Z(["text", { clamped: !o.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > M2 && !o.value ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0),
      r.value.length ? (u(), H(Jo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0)
    ], 64));
  }
}, _2 = /* @__PURE__ */ Y(S2, [["__scopeId", "data-v-4a3f1e79"]]), E2 = {
  class: "task-details",
  "data-task-details": ""
}, A2 = { class: "since" }, C2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, O2 = { class: "text" }, T2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, R2 = {
  key: 1,
  class: "note"
}, I2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, B2 = { class: "text" }, L2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), h("div", E2, [
        b("div", {
          class: Z(["state-line", j(rn)(e.task.state)])
        }, [
          b("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            N(Ps, {
              status: j(rn)(e.task.state)
            }, null, 8, ["status"]),
            ee(" " + w(a(e.task.state)), 1)
          ]),
          b("span", A2, [
            o[4] || (o[4] = ee(" since ", -1)),
            N(la, {
              at: j(Yl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), h("section", C2, [
          o[5] || (o[5] = b("span", { class: "label" }, "Blocked, waiting on", -1)),
          b("p", O2, w(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), h("p", T2, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (u(), h("p", R2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), h("section", I2, [
          o[6] || (o[6] = b("span", { class: "label" }, "Why it was cancelled", -1)),
          b("p", B2, w(e.task.reason), 1)
        ])) : A("", !0),
        e.graph ? (u(), H(d2, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : A("", !0),
        N(Zk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        N(_2, {
          task: e.task,
          onSelect: o[3] || (o[3] = (r) => n("select", r))
        }, null, 8, ["task"]),
        N(p2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, N2 = /* @__PURE__ */ Y(L2, [["__scopeId", "data-v-7ce5b829"]]), D2 = 50, j2 = { messages: 25 }, P2 = (e) => j2[e] || D2, q2 = {
  class: "task-log",
  "aria-label": "Task log"
}, F2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, W2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, H2 = { class: "entries" }, U2 = ["datetime"], z2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, V2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = R([]), a = R(1), s = R(!0), o = R(!0), l = R("");
    let r = 0;
    async function i(c = 1) {
      const d = ++r;
      a.value = c, o.value = !0, l.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(P2("task_logs")),
        "--page",
        String(c)
      ]);
      d === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return fe(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), pt(() => {
      r += 1;
    }), (c, d) => (u(), h("section", q2, [
      o.value ? (u(), H(Et, { key: 0 })) : l.value ? (u(), h(G, { key: 1 }, [
        b("p", F2, w(l.value), 1),
        N(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: P(() => [...d[3] || (d[3] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), h(G, { key: 2 }, [
        n.value.length ? A("", !0) : (u(), h("p", W2, "No log entries yet.")),
        b("ol", H2, [
          (u(!0), h(G, null, Q(n.value, (f) => (u(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            b("time", {
              datetime: f.created_at
            }, w(new Date(f.created_at).toLocaleString()), 9, U2),
            b("p", null, w(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), h("nav", z2, [
          N(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: P(() => [...d[4] || (d[4] = [
              ee("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          b("span", null, "Page " + w(a.value), 1),
          N(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: P(() => [...d[5] || (d[5] = [
              ee("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, G2 = /* @__PURE__ */ Y(V2, [["__scopeId", "data-v-98b3a6b1"]]), K2 = { class: "comment-side-head" }, Y2 = {
  key: 0,
  class: "comment-none"
}, J2 = { key: 0 }, Z2 = {
  key: 1,
  class: "comment-none"
}, X2 = {
  class: "comment",
  "data-comment": ""
}, Q2 = {
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
    return (t, n) => (u(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      b("header", K2, [
        n[2] || (n[2] = b("h3", null, "Comments", -1)),
        N(ws, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), h("p", Y2, "No comments yet")) : A("", !0),
      (u(!0), h(G, null, Q(e.comments, (a) => (u(), h("section", {
        key: a.id
      }, [
        a.quote ? (u(), h("blockquote", J2, w(a.quote), 1)) : A("", !0),
        a.revision ? (u(), h("span", Z2, "Revision " + w(a.revision), 1)) : A("", !0),
        b("p", X2, w(e.words(a)), 1)
      ]))), 128)),
      N(Zn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, e5 = /* @__PURE__ */ Y(Q2, [["__scopeId", "data-v-276284a3"]]);
var Qo;
/Mac|iPhone|iPad/.test(((Qo = navigator.userAgentData) == null ? void 0 : Qo.platform) || navigator.platform);
function t5(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const n5 = ["placeholder"], a5 = { class: "actions" }, s5 = { class: "error" }, o5 = {
  key: 1,
  class: "card closed"
}, l5 = { class: "mark" }, r5 = { class: "prompt" }, i5 = {
  key: 0,
  class: "draft"
}, c5 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Fa({
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
  emits: /* @__PURE__ */ Fa(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = qa(e, "draft"), l = qa(e, "error"), r = R(!!l.value), i = R(!1), c = R(!1), d = R(null);
    async function f() {
      var p, k;
      r.value = !0, i.value = !1, await mt(), (k = ((p = d.value) == null ? void 0 : p.querySelector("input")) || d.value) == null || k.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function v() {
      const p = o.value.trim();
      if (!(!p || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(p), r.value = !1, i.value = !0;
        } catch (k) {
          o.value = p, l.value = k.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: f }), (p, k) => (u(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (u(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(v, ["prevent"]),
        onKeydown: Xt(m, ["esc"])
      }, [
        ue(p.$slots, "who", {}, void 0, !0),
        tt(b("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": k[0] || (k[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: k[1] || (k[1] = Xt((S) => j(t5)(S, v), ["enter"]))
        }, null, 40, n5), [
          [Wa, o.value]
        ]),
        b("div", a5, [
          b("span", s5, w(l.value), 1),
          N(de, {
            small: "",
            onClick: m
          }, {
            default: P(() => [...k[3] || (k[3] = [
              ee("Cancel", -1)
            ])]),
            _: 1
          }),
          N(de, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: P(() => [...k[4] || (k[4] = [
              ee("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), h("div", o5, [
        b("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          b("span", l5, [
            N(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          b("span", r5, w(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), h("span", i5, "Draft kept")) : A("", !0)
        ]),
        e.count ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[2] || (k[2] = (S) => s("show"))
        }, [
          b("span", null, w(j(uc)(e.count, "comment")), 1),
          N(ye, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, u5 = /* @__PURE__ */ Y(c5, [["__scopeId", "data-v-b68baddd"]]);
function d5(e, t) {
  const n = R([]), a = R(!1), s = R(null), o = R(0), l = R(!1), r = R("");
  let i = 0, c = 0;
  const d = (p) => {
    if (typeof p.body == "string") return p.body;
    const { noun: k, id: S, title: C } = e(), F = `On ${k} ${S}, ${C}: `;
    return p.text.startsWith(F) ? p.text.slice(F.length) : p.text;
  };
  async function f(p = 1) {
    const { noun: k, id: S } = e();
    if (!S) return;
    const C = ++c;
    l.value = !0, r.value = "";
    try {
      const F = await t([k, "comments", String(S), "--page", String(p), "--page-size", "25"]);
      if (C !== c) return;
      if (!F.ok) {
        r.value = F.error;
        return;
      }
      const W = F.value.rows ?? [], L = p === 1 ? W : [...n.value, ...W];
      n.value = [...new Map(L.map(($) => [$.id, $])).values()], o.value = F.value.total ?? n.value.length, s.value = F.value.next_page ?? null;
    } catch (F) {
      C === c && (r.value = F.message);
    } finally {
      C === c && (l.value = !1);
    }
  }
  async function m(p) {
    var $;
    const { noun: k, id: S } = e(), C = `${k}:${S}`, F = { id: `sending-${++i}`, text: p };
    n.value = [...n.value, F], o.value++, a.value = !0;
    const W = await t([k, "comment", String(S), p]);
    if (C !== `${e().noun}:${e().id}`) return;
    if (!W.ok)
      throw n.value = n.value.filter((_) => _.id !== F.id), o.value = Math.max(0, o.value - 1), new Error(W.error);
    await f();
    const L = ($ = W.value) == null ? void 0 : $.id;
    L && !n.value.some((_) => _.id === L) && (n.value = [...n.value, { ...F, id: L }]);
  }
  const v = () => !l.value && s.value && f(s.value);
  return fe(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", c++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: v, nextPage: s, total: o, loading: l, failure: r };
}
const f5 = { class: "top" }, h5 = {
  class: "crumb",
  "data-task-crumb": ""
}, m5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, p5 = {
  key: 1,
  class: "body"
}, g5 = { class: "summary" }, v5 = { class: "stamp" }, y5 = {
  class: "title",
  "data-resource-title": ""
}, b5 = {
  class: "tabs",
  "data-task-tabs": ""
}, w5 = { class: "panels" }, k5 = {
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
    const a = e, s = n, o = R(null), l = R(null), r = R(null), i = R(""), c = R(""), d = R(null), f = R(null), m = R("details"), v = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], p = d5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      ($) => a.read($)
    );
    let k = 0;
    const S = I(() => {
      var $;
      return ($ = l.value) != null && $.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function C() {
      const $ = ++k, [_, y, B] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      $ === k && (i.value = _.ok ? "" : _.error, o.value = _.ok ? _.value : null, l.value = y.ok ? y.value : null, r.value = B.ok ? B.value : null);
    }
    fe(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, d.value = null, m.value = "details", C();
      },
      { immediate: !0 }
    ), fe(() => a.changes, C), fe(p.open, ($) => {
      $ && (m.value = "comments");
    });
    async function F($) {
      const _ = o.value.priority;
      o.value.priority = Number($);
      const y = await a.read(["task", "edit", String(a.id), "--priority", $]);
      if (c.value = y.ok ? "" : y.error, y.ok) return C();
      o.value.priority = _;
    }
    function W($) {
      d.value = null, f.value.press($);
    }
    const L = ($) => {
      var _;
      return ((_ = f.value) == null ? void 0 : _.moves.length) && (d.value = $);
    };
    return t({ openStatus: L }), ($, _) => (u(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      b("div", f5, [
        e.backed ? (u(), H(Mk, {
          key: 0,
          onBack: _[0] || (_[0] = (y) => s("back"))
        })) : A("", !0),
        b("span", h5, w(S.value), 1),
        _[10] || (_[10] = b("span", { class: "grow" }, null, -1)),
        e.stepped ? (u(), h(G, { key: 1 }, [
          N(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: _[1] || (_[1] = (y) => s("step", -1))
          }, {
            default: P(() => [
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
            onClick: _[2] || (_[2] = (y) => s("step", 1))
          }, {
            default: P(() => [
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
          onClick: _[3] || (_[3] = (y) => s("close"))
        }, {
          default: P(() => [
            N(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (u(), h("p", m5, w(i.value), 1)) : o.value ? (u(), h(G, { key: 2 }, [
        N(Rk, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: C
        }, null, 8, ["id", "row", "read"]),
        b("header", g5, [
          b("div", v5, [
            ee(" Task " + w(o.value.id) + " · updated ", 1),
            N(la, {
              at: j(Yl)(o.value)
            }, null, 8, ["at"])
          ]),
          b("h3", y5, w(o.value.title), 1)
        ]),
        b("div", b5, [
          N(cn, {
            options: v,
            value: m.value,
            onPick: _[4] || (_[4] = (y) => m.value = y)
          }, null, 8, ["value"])
        ]),
        b("div", w5, [
          N(jt, { value: m.value }, {
            details: P(() => [
              N(N2, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: c.value,
                onStatus: L,
                onPriority: F,
                onSelect: _[5] || (_[5] = (y) => s("select", y))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              N($k, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              N(ic, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: _[6] || (_[6] = (y) => s("select", y))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: P(() => [
              N(e5, {
                below: "",
                comments: j(p).comments.value,
                words: j(p).words,
                more: !!j(p).nextPage.value,
                loading: j(p).loading.value,
                failure: j(p).failure.value,
                onMore: j(p).loadMore,
                onClose: _[7] || (_[7] = (y) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: P(() => [
              N(G2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        N(u5, {
          send: j(p).send,
          count: j(p).total.value,
          onShow: _[8] || (_[8] = (y) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (u(), h("div", p5, [
        N(Et)
      ])),
      d.value ? (u(), H(Xn, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: _[9] || (_[9] = (y) => d.value = null)
      }, {
        default: P(() => [
          N(cs, null, {
            default: P(() => [
              ee("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (u(!0), h(G, null, Q(f.value.moves, (y) => (u(), H(St, {
            key: y.word,
            onClick: (B) => W(y)
          }, {
            default: P(() => [
              ee(w(y.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, o8 = /* @__PURE__ */ Y(k5, [["__scopeId", "data-v-93316116"]]);
function x5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Pa = { exports: {} }, Zo;
function $5() {
  return Zo || (Zo = 1, (function(e, t) {
    var n = (function() {
      var a = function($, _) {
        var y = 236, B = 17, M = $, O = o[_], x = null, g = 0, E = null, T = [], D = {}, J = function(U, z) {
          g = M * 4 + 17, x = (function(q) {
            for (var V = new Array(q), K = 0; K < q; K += 1) {
              V[K] = new Array(q);
              for (var X = 0; X < q; X += 1)
                V[K][X] = null;
            }
            return V;
          })(g), te(0, 0), te(g - 7, 0), te(0, g - 7), he(), ie(), We(U, z), M >= 7 && Ce(U), E == null && (E = ae(M, O, T)), ve(E, z);
        }, te = function(U, z) {
          for (var q = -1; q <= 7; q += 1)
            if (!(U + q <= -1 || g <= U + q))
              for (var V = -1; V <= 7; V += 1)
                z + V <= -1 || g <= z + V || (0 <= q && q <= 6 && (V == 0 || V == 6) || 0 <= V && V <= 6 && (q == 0 || q == 6) || 2 <= q && q <= 4 && 2 <= V && V <= 4 ? x[U + q][z + V] = !0 : x[U + q][z + V] = !1);
        }, re = function() {
          for (var U = 0, z = 0, q = 0; q < 8; q += 1) {
            J(!0, q);
            var V = r.getLostPoint(D);
            (q == 0 || U > V) && (U = V, z = q);
          }
          return z;
        }, ie = function() {
          for (var U = 8; U < g - 8; U += 1)
            x[U][6] == null && (x[U][6] = U % 2 == 0);
          for (var z = 8; z < g - 8; z += 1)
            x[6][z] == null && (x[6][z] = z % 2 == 0);
        }, he = function() {
          for (var U = r.getPatternPosition(M), z = 0; z < U.length; z += 1)
            for (var q = 0; q < U.length; q += 1) {
              var V = U[z], K = U[q];
              if (x[V][K] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    X == -2 || X == 2 || oe == -2 || oe == 2 || X == 0 && oe == 0 ? x[V + X][K + oe] = !0 : x[V + X][K + oe] = !1;
            }
        }, Ce = function(U) {
          for (var z = r.getBCHTypeNumber(M), q = 0; q < 18; q += 1) {
            var V = !U && (z >> q & 1) == 1;
            x[Math.floor(q / 3)][q % 3 + g - 8 - 3] = V;
          }
          for (var q = 0; q < 18; q += 1) {
            var V = !U && (z >> q & 1) == 1;
            x[q % 3 + g - 8 - 3][Math.floor(q / 3)] = V;
          }
        }, We = function(U, z) {
          for (var q = O << 3 | z, V = r.getBCHTypeInfo(q), K = 0; K < 15; K += 1) {
            var X = !U && (V >> K & 1) == 1;
            K < 6 ? x[K][8] = X : K < 8 ? x[K + 1][8] = X : x[g - 15 + K][8] = X;
          }
          for (var K = 0; K < 15; K += 1) {
            var X = !U && (V >> K & 1) == 1;
            K < 8 ? x[8][g - K - 1] = X : K < 9 ? x[8][15 - K - 1 + 1] = X : x[8][15 - K - 1] = X;
          }
          x[g - 8][8] = !U;
        }, ve = function(U, z) {
          for (var q = -1, V = g - 1, K = 7, X = 0, oe = r.getMaskFunction(z), se = g - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (x[V][se - ke] == null) {
                  var Se = !1;
                  X < U.length && (Se = (U[X] >>> K & 1) == 1);
                  var ce = oe(V, se - ke);
                  ce && (Se = !Se), x[V][se - ke] = Se, K -= 1, K == -1 && (X += 1, K = 7);
                }
              if (V += q, V < 0 || g <= V) {
                V -= q, q = -q;
                break;
              }
            }
        }, me = function(U, z) {
          for (var q = 0, V = 0, K = 0, X = new Array(z.length), oe = new Array(z.length), se = 0; se < z.length; se += 1) {
            var ke = z[se].dataCount, Se = z[se].totalCount - ke;
            V = Math.max(V, ke), K = Math.max(K, Se), X[se] = new Array(ke);
            for (var ce = 0; ce < X[se].length; ce += 1)
              X[se][ce] = 255 & U.getBuffer()[ce + q];
            q += ke;
            var Ne = r.getErrorCorrectPolynomial(Se), De = c(X[se], Ne.getLength() - 1), qs = De.mod(Ne);
            oe[se] = new Array(Ne.getLength() - 1);
            for (var ce = 0; ce < oe[se].length; ce += 1) {
              var Fs = ce + qs.getLength() - oe[se].length;
              oe[se][ce] = Fs >= 0 ? qs.getAt(Fs) : 0;
            }
          }
          for (var Ws = 0, ce = 0; ce < z.length; ce += 1)
            Ws += z[ce].totalCount;
          for (var ra = new Array(Ws), vn = 0, ce = 0; ce < V; ce += 1)
            for (var se = 0; se < z.length; se += 1)
              ce < X[se].length && (ra[vn] = X[se][ce], vn += 1);
          for (var ce = 0; ce < K; ce += 1)
            for (var se = 0; se < z.length; se += 1)
              ce < oe[se].length && (ra[vn] = oe[se][ce], vn += 1);
          return ra;
        }, ae = function(U, z, q) {
          for (var V = d.getRSBlocks(U, z), K = f(), X = 0; X < q.length; X += 1) {
            var oe = q[X];
            K.put(oe.getMode(), 4), K.put(oe.getLength(), r.getLengthInBits(oe.getMode(), U)), oe.write(K);
          }
          for (var se = 0, X = 0; X < V.length; X += 1)
            se += V[X].dataCount;
          if (K.getLengthInBits() > se * 8)
            throw "code length overflow. (" + K.getLengthInBits() + ">" + se * 8 + ")";
          for (K.getLengthInBits() + 4 <= se * 8 && K.put(0, 4); K.getLengthInBits() % 8 != 0; )
            K.putBit(!1);
          for (; !(K.getLengthInBits() >= se * 8 || (K.put(y, 8), K.getLengthInBits() >= se * 8)); )
            K.put(B, 8);
          return me(K, V);
        };
        D.addData = function(U, z) {
          z = z || "Byte";
          var q = null;
          switch (z) {
            case "Numeric":
              q = m(U);
              break;
            case "Alphanumeric":
              q = v(U);
              break;
            case "Byte":
              q = p(U);
              break;
            case "Kanji":
              q = k(U);
              break;
            default:
              throw "mode:" + z;
          }
          T.push(q), E = null;
        }, D.isDark = function(U, z) {
          if (U < 0 || g <= U || z < 0 || g <= z)
            throw U + "," + z;
          return x[U][z];
        }, D.getModuleCount = function() {
          return g;
        }, D.make = function() {
          if (M < 1) {
            for (var U = 1; U < 40; U++) {
              for (var z = d.getRSBlocks(U, O), q = f(), V = 0; V < T.length; V++) {
                var K = T[V];
                q.put(K.getMode(), 4), q.put(K.getLength(), r.getLengthInBits(K.getMode(), U)), K.write(q);
              }
              for (var X = 0, V = 0; V < z.length; V++)
                X += z[V].dataCount;
              if (q.getLengthInBits() <= X * 8)
                break;
            }
            M = U;
          }
          J(!1, re());
        }, D.createTableTag = function(U, z) {
          U = U || 2, z = typeof z > "u" ? U * 4 : z;
          var q = "";
          q += '<table style="', q += " border-width: 0px; border-style: none;", q += " border-collapse: collapse;", q += " padding: 0px; margin: " + z + "px;", q += '">', q += "<tbody>";
          for (var V = 0; V < D.getModuleCount(); V += 1) {
            q += "<tr>";
            for (var K = 0; K < D.getModuleCount(); K += 1)
              q += '<td style="', q += " border-width: 0px; border-style: none;", q += " border-collapse: collapse;", q += " padding: 0px; margin: 0px;", q += " width: " + U + "px;", q += " height: " + U + "px;", q += " background-color: ", q += D.isDark(V, K) ? "#000000" : "#ffffff", q += ";", q += '"/>';
            q += "</tr>";
          }
          return q += "</tbody>", q += "</table>", q;
        }, D.createSvgTag = function(U, z, q, V) {
          var K = {};
          typeof arguments[0] == "object" && (K = arguments[0], U = K.cellSize, z = K.margin, q = K.alt, V = K.title), U = U || 2, z = typeof z > "u" ? U * 4 : z, q = typeof q == "string" ? { text: q } : q || {}, q.text = q.text || null, q.id = q.text ? q.id || "qrcode-description" : null, V = typeof V == "string" ? { text: V } : V || {}, V.text = V.text || null, V.id = V.text ? V.id || "qrcode-title" : null;
          var X = D.getModuleCount() * U + z * 2, oe, se, ke, Se, ce = "", Ne;
          for (Ne = "l" + U + ",0 0," + U + " -" + U + ",0 0,-" + U + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += K.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ce += ' viewBox="0 0 ' + X + " " + X + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += V.text || q.text ? ' role="img" aria-labelledby="' + Ye([V.id, q.id].join(" ").trim()) + '"' : "", ce += ">", ce += V.text ? '<title id="' + Ye(V.id) + '">' + Ye(V.text) + "</title>" : "", ce += q.text ? '<description id="' + Ye(q.id) + '">' + Ye(q.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < D.getModuleCount(); ke += 1)
            for (Se = ke * U + z, oe = 0; oe < D.getModuleCount(); oe += 1)
              D.isDark(ke, oe) && (se = oe * U + z, ce += "M" + se + "," + Se + Ne);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, D.createDataURL = function(U, z) {
          U = U || 2, z = typeof z > "u" ? U * 4 : z;
          var q = D.getModuleCount() * U + z * 2, V = z, K = q - z;
          return L(q, q, function(X, oe) {
            if (V <= X && X < K && V <= oe && oe < K) {
              var se = Math.floor((X - V) / U), ke = Math.floor((oe - V) / U);
              return D.isDark(ke, se) ? 0 : 1;
            } else
              return 1;
          });
        }, D.createImgTag = function(U, z, q) {
          U = U || 2, z = typeof z > "u" ? U * 4 : z;
          var V = D.getModuleCount() * U + z * 2, K = "";
          return K += "<img", K += ' src="', K += D.createDataURL(U, z), K += '"', K += ' width="', K += V, K += '"', K += ' height="', K += V, K += '"', q && (K += ' alt="', K += Ye(q), K += '"'), K += "/>", K;
        };
        var Ye = function(U) {
          for (var z = "", q = 0; q < U.length; q += 1) {
            var V = U.charAt(q);
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
        }, ai = function(U) {
          var z = 1;
          U = typeof U > "u" ? z * 2 : U;
          var q = D.getModuleCount() * z + U * 2, V = U, K = q - U, X, oe, se, ke, Se, ce = {
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
              Se = "█", V <= oe && oe < K && V <= X && X < K && D.isDark(se, Math.floor((oe - V) / z)) && (Se = " "), V <= oe && oe < K && V <= X + 1 && X + 1 < K && D.isDark(ke, Math.floor((oe - V) / z)) ? Se += " " : Se += "█", De += U < 1 && X + 1 >= K ? Ne[Se] : ce[Se];
            De += `
`;
          }
          return q % 2 && U > 0 ? De.substring(0, De.length - q - 1) + Array(q + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return D.createASCII = function(U, z) {
          if (U = U || 1, U < 2)
            return ai(z);
          U -= 1, z = typeof z > "u" ? U * 2 : z;
          var q = D.getModuleCount() * U + z * 2, V = z, K = q - z, X, oe, se, ke, Se = Array(U + 1).join("██"), ce = Array(U + 1).join("  "), Ne = "", De = "";
          for (X = 0; X < q; X += 1) {
            for (se = Math.floor((X - V) / U), De = "", oe = 0; oe < q; oe += 1)
              ke = 1, V <= oe && oe < K && V <= X && X < K && D.isDark(se, Math.floor((oe - V) / U)) && (ke = 0), De += ke ? Se : ce;
            for (se = 0; se < U; se += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, D.renderTo2dContext = function(U, z) {
          z = z || 2;
          for (var q = D.getModuleCount(), V = 0; V < q; V++)
            for (var K = 0; K < q; K++)
              U.fillStyle = D.isDark(V, K) ? "black" : "white", U.fillRect(V * z, K * z, z, z);
        }, D;
      };
      a.stringToBytesFuncs = {
        default: function($) {
          for (var _ = [], y = 0; y < $.length; y += 1) {
            var B = $.charCodeAt(y);
            _.push(B & 255);
          }
          return _;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function($, _) {
        var y = (function() {
          for (var M = F($), O = function() {
            var ie = M.read();
            if (ie == -1) throw "eof";
            return ie;
          }, x = 0, g = {}; ; ) {
            var E = M.read();
            if (E == -1) break;
            var T = O(), D = O(), J = O(), te = String.fromCharCode(E << 8 | T), re = D << 8 | J;
            g[te] = re, x += 1;
          }
          if (x != _)
            throw x + " != " + _;
          return g;
        })(), B = 63;
        return function(M) {
          for (var O = [], x = 0; x < M.length; x += 1) {
            var g = M.charCodeAt(x);
            if (g < 128)
              O.push(g);
            else {
              var E = y[M.charAt(x)];
              typeof E == "number" ? (E & 255) == E ? O.push(E) : (O.push(E >>> 8), O.push(E & 255)) : O.push(B);
            }
          }
          return O;
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
        var $ = [
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
        ], _ = 1335, y = 7973, B = 21522, M = {}, O = function(x) {
          for (var g = 0; x != 0; )
            g += 1, x >>>= 1;
          return g;
        };
        return M.getBCHTypeInfo = function(x) {
          for (var g = x << 10; O(g) - O(_) >= 0; )
            g ^= _ << O(g) - O(_);
          return (x << 10 | g) ^ B;
        }, M.getBCHTypeNumber = function(x) {
          for (var g = x << 12; O(g) - O(y) >= 0; )
            g ^= y << O(g) - O(y);
          return x << 12 | g;
        }, M.getPatternPosition = function(x) {
          return $[x - 1];
        }, M.getMaskFunction = function(x) {
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
        }, M.getErrorCorrectPolynomial = function(x) {
          for (var g = c([1], 0), E = 0; E < x; E += 1)
            g = g.multiply(c([1, i.gexp(E)], 0));
          return g;
        }, M.getLengthInBits = function(x, g) {
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
        }, M.getLostPoint = function(x) {
          for (var g = x.getModuleCount(), E = 0, T = 0; T < g; T += 1)
            for (var D = 0; D < g; D += 1) {
              for (var J = 0, te = x.isDark(T, D), re = -1; re <= 1; re += 1)
                if (!(T + re < 0 || g <= T + re))
                  for (var ie = -1; ie <= 1; ie += 1)
                    D + ie < 0 || g <= D + ie || re == 0 && ie == 0 || te == x.isDark(T + re, D + ie) && (J += 1);
              J > 5 && (E += 3 + J - 5);
            }
          for (var T = 0; T < g - 1; T += 1)
            for (var D = 0; D < g - 1; D += 1) {
              var he = 0;
              x.isDark(T, D) && (he += 1), x.isDark(T + 1, D) && (he += 1), x.isDark(T, D + 1) && (he += 1), x.isDark(T + 1, D + 1) && (he += 1), (he == 0 || he == 4) && (E += 3);
            }
          for (var T = 0; T < g; T += 1)
            for (var D = 0; D < g - 6; D += 1)
              x.isDark(T, D) && !x.isDark(T, D + 1) && x.isDark(T, D + 2) && x.isDark(T, D + 3) && x.isDark(T, D + 4) && !x.isDark(T, D + 5) && x.isDark(T, D + 6) && (E += 40);
          for (var D = 0; D < g; D += 1)
            for (var T = 0; T < g - 6; T += 1)
              x.isDark(T, D) && !x.isDark(T + 1, D) && x.isDark(T + 2, D) && x.isDark(T + 3, D) && x.isDark(T + 4, D) && !x.isDark(T + 5, D) && x.isDark(T + 6, D) && (E += 40);
          for (var Ce = 0, D = 0; D < g; D += 1)
            for (var T = 0; T < g; T += 1)
              x.isDark(T, D) && (Ce += 1);
          var We = Math.abs(100 * Ce / g / g - 50) / 5;
          return E += We * 10, E;
        }, M;
      })(), i = (function() {
        for (var $ = new Array(256), _ = new Array(256), y = 0; y < 8; y += 1)
          $[y] = 1 << y;
        for (var y = 8; y < 256; y += 1)
          $[y] = $[y - 4] ^ $[y - 5] ^ $[y - 6] ^ $[y - 8];
        for (var y = 0; y < 255; y += 1)
          _[$[y]] = y;
        var B = {};
        return B.glog = function(M) {
          if (M < 1)
            throw "glog(" + M + ")";
          return _[M];
        }, B.gexp = function(M) {
          for (; M < 0; )
            M += 255;
          for (; M >= 256; )
            M -= 255;
          return $[M];
        }, B;
      })();
      function c($, _) {
        if (typeof $.length > "u")
          throw $.length + "/" + _;
        var y = (function() {
          for (var M = 0; M < $.length && $[M] == 0; )
            M += 1;
          for (var O = new Array($.length - M + _), x = 0; x < $.length - M; x += 1)
            O[x] = $[x + M];
          return O;
        })(), B = {};
        return B.getAt = function(M) {
          return y[M];
        }, B.getLength = function() {
          return y.length;
        }, B.multiply = function(M) {
          for (var O = new Array(B.getLength() + M.getLength() - 1), x = 0; x < B.getLength(); x += 1)
            for (var g = 0; g < M.getLength(); g += 1)
              O[x + g] ^= i.gexp(i.glog(B.getAt(x)) + i.glog(M.getAt(g)));
          return c(O, 0);
        }, B.mod = function(M) {
          if (B.getLength() - M.getLength() < 0)
            return B;
          for (var O = i.glog(B.getAt(0)) - i.glog(M.getAt(0)), x = new Array(B.getLength()), g = 0; g < B.getLength(); g += 1)
            x[g] = B.getAt(g);
          for (var g = 0; g < M.getLength(); g += 1)
            x[g] ^= i.gexp(i.glog(M.getAt(g)) + O);
          return c(x, 0).mod(M);
        }, B;
      }
      var d = (function() {
        var $ = [
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
        ], _ = function(M, O) {
          var x = {};
          return x.totalCount = M, x.dataCount = O, x;
        }, y = {}, B = function(M, O) {
          switch (O) {
            case o.L:
              return $[(M - 1) * 4 + 0];
            case o.M:
              return $[(M - 1) * 4 + 1];
            case o.Q:
              return $[(M - 1) * 4 + 2];
            case o.H:
              return $[(M - 1) * 4 + 3];
            default:
              return;
          }
        };
        return y.getRSBlocks = function(M, O) {
          var x = B(M, O);
          if (typeof x > "u")
            throw "bad rs block @ typeNumber:" + M + "/errorCorrectionLevel:" + O;
          for (var g = x.length / 3, E = [], T = 0; T < g; T += 1)
            for (var D = x[T * 3 + 0], J = x[T * 3 + 1], te = x[T * 3 + 2], re = 0; re < D; re += 1)
              E.push(_(J, te));
          return E;
        }, y;
      })(), f = function() {
        var $ = [], _ = 0, y = {};
        return y.getBuffer = function() {
          return $;
        }, y.getAt = function(B) {
          var M = Math.floor(B / 8);
          return ($[M] >>> 7 - B % 8 & 1) == 1;
        }, y.put = function(B, M) {
          for (var O = 0; O < M; O += 1)
            y.putBit((B >>> M - O - 1 & 1) == 1);
        }, y.getLengthInBits = function() {
          return _;
        }, y.putBit = function(B) {
          var M = Math.floor(_ / 8);
          $.length <= M && $.push(0), B && ($[M] |= 128 >>> _ % 8), _ += 1;
        }, y;
      }, m = function($) {
        var _ = s.MODE_NUMBER, y = $, B = {};
        B.getMode = function() {
          return _;
        }, B.getLength = function(x) {
          return y.length;
        }, B.write = function(x) {
          for (var g = y, E = 0; E + 2 < g.length; )
            x.put(M(g.substring(E, E + 3)), 10), E += 3;
          E < g.length && (g.length - E == 1 ? x.put(M(g.substring(E, E + 1)), 4) : g.length - E == 2 && x.put(M(g.substring(E, E + 2)), 7));
        };
        var M = function(x) {
          for (var g = 0, E = 0; E < x.length; E += 1)
            g = g * 10 + O(x.charAt(E));
          return g;
        }, O = function(x) {
          if ("0" <= x && x <= "9")
            return x.charCodeAt(0) - 48;
          throw "illegal char :" + x;
        };
        return B;
      }, v = function($) {
        var _ = s.MODE_ALPHA_NUM, y = $, B = {};
        B.getMode = function() {
          return _;
        }, B.getLength = function(O) {
          return y.length;
        }, B.write = function(O) {
          for (var x = y, g = 0; g + 1 < x.length; )
            O.put(
              M(x.charAt(g)) * 45 + M(x.charAt(g + 1)),
              11
            ), g += 2;
          g < x.length && O.put(M(x.charAt(g)), 6);
        };
        var M = function(O) {
          if ("0" <= O && O <= "9")
            return O.charCodeAt(0) - 48;
          if ("A" <= O && O <= "Z")
            return O.charCodeAt(0) - 65 + 10;
          switch (O) {
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
              throw "illegal char :" + O;
          }
        };
        return B;
      }, p = function($) {
        var _ = s.MODE_8BIT_BYTE, y = a.stringToBytes($), B = {};
        return B.getMode = function() {
          return _;
        }, B.getLength = function(M) {
          return y.length;
        }, B.write = function(M) {
          for (var O = 0; O < y.length; O += 1)
            M.put(y[O], 8);
        }, B;
      }, k = function($) {
        var _ = s.MODE_KANJI, y = a.stringToBytesFuncs.SJIS;
        if (!y)
          throw "sjis not supported.";
        (function(O, x) {
          var g = y(O);
          if (g.length != 2 || (g[0] << 8 | g[1]) != x)
            throw "sjis not supported.";
        })("友", 38726);
        var B = y($), M = {};
        return M.getMode = function() {
          return _;
        }, M.getLength = function(O) {
          return ~~(B.length / 2);
        }, M.write = function(O) {
          for (var x = B, g = 0; g + 1 < x.length; ) {
            var E = (255 & x[g]) << 8 | 255 & x[g + 1];
            if (33088 <= E && E <= 40956)
              E -= 33088;
            else if (57408 <= E && E <= 60351)
              E -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + E;
            E = (E >>> 8 & 255) * 192 + (E & 255), O.put(E, 13), g += 2;
          }
          if (g < x.length)
            throw "illegal char at " + (g + 1);
        }, M;
      }, S = function() {
        var $ = [], _ = {};
        return _.writeByte = function(y) {
          $.push(y & 255);
        }, _.writeShort = function(y) {
          _.writeByte(y), _.writeByte(y >>> 8);
        }, _.writeBytes = function(y, B, M) {
          B = B || 0, M = M || y.length;
          for (var O = 0; O < M; O += 1)
            _.writeByte(y[O + B]);
        }, _.writeString = function(y) {
          for (var B = 0; B < y.length; B += 1)
            _.writeByte(y.charCodeAt(B));
        }, _.toByteArray = function() {
          return $;
        }, _.toString = function() {
          var y = "";
          y += "[";
          for (var B = 0; B < $.length; B += 1)
            B > 0 && (y += ","), y += $[B];
          return y += "]", y;
        }, _;
      }, C = function() {
        var $ = 0, _ = 0, y = 0, B = "", M = {}, O = function(g) {
          B += String.fromCharCode(x(g & 63));
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
        return M.writeByte = function(g) {
          for ($ = $ << 8 | g & 255, _ += 8, y += 1; _ >= 6; )
            O($ >>> _ - 6), _ -= 6;
        }, M.flush = function() {
          if (_ > 0 && (O($ << 6 - _), $ = 0, _ = 0), y % 3 != 0)
            for (var g = 3 - y % 3, E = 0; E < g; E += 1)
              B += "=";
        }, M.toString = function() {
          return B;
        }, M;
      }, F = function($) {
        var _ = $, y = 0, B = 0, M = 0, O = {};
        O.read = function() {
          for (; M < 8; ) {
            if (y >= _.length) {
              if (M == 0)
                return -1;
              throw "unexpected end of file./" + M;
            }
            var g = _.charAt(y);
            if (y += 1, g == "=")
              return M = 0, -1;
            if (g.match(/^\s$/))
              continue;
            B = B << 6 | x(g.charCodeAt(0)), M += 6;
          }
          var E = B >>> M - 8 & 255;
          return M -= 8, E;
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
        return O;
      }, W = function($, _) {
        var y = $, B = _, M = new Array($ * _), O = {};
        O.setPixel = function(T, D, J) {
          M[D * y + T] = J;
        }, O.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(y), T.writeShort(B), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(y), T.writeShort(B), T.writeByte(0);
          var D = 2, J = g(D);
          T.writeByte(D);
          for (var te = 0; J.length - te > 255; )
            T.writeByte(255), T.writeBytes(J, te, 255), te += 255;
          T.writeByte(J.length - te), T.writeBytes(J, te, J.length - te), T.writeByte(0), T.writeString(";");
        };
        var x = function(T) {
          var D = T, J = 0, te = 0, re = {};
          return re.write = function(ie, he) {
            if (ie >>> he)
              throw "length over";
            for (; J + he >= 8; )
              D.writeByte(255 & (ie << J | te)), he -= 8 - J, ie >>>= 8 - J, te = 0, J = 0;
            te = ie << J | te, J = J + he;
          }, re.flush = function() {
            J > 0 && D.writeByte(te);
          }, re;
        }, g = function(T) {
          for (var D = 1 << T, J = (1 << T) + 1, te = T + 1, re = E(), ie = 0; ie < D; ie += 1)
            re.add(String.fromCharCode(ie));
          re.add(String.fromCharCode(D)), re.add(String.fromCharCode(J));
          var he = S(), Ce = x(he);
          Ce.write(D, te);
          var We = 0, ve = String.fromCharCode(M[We]);
          for (We += 1; We < M.length; ) {
            var me = String.fromCharCode(M[We]);
            We += 1, re.contains(ve + me) ? ve = ve + me : (Ce.write(re.indexOf(ve), te), re.size() < 4095 && (re.size() == 1 << te && (te += 1), re.add(ve + me)), ve = me);
          }
          return Ce.write(re.indexOf(ve), te), Ce.write(J, te), Ce.flush(), he.toByteArray();
        }, E = function() {
          var T = {}, D = 0, J = {};
          return J.add = function(te) {
            if (J.contains(te))
              throw "dup key:" + te;
            T[te] = D, D += 1;
          }, J.size = function() {
            return D;
          }, J.indexOf = function(te) {
            return T[te];
          }, J.contains = function(te) {
            return typeof T[te] < "u";
          }, J;
        };
        return O;
      }, L = function($, _, y) {
        for (var B = W($, _), M = 0; M < _; M += 1)
          for (var O = 0; O < $; O += 1)
            B.setPixel(O, M, y(O, M));
        var x = S();
        B.write(x);
        for (var g = C(), E = x.toByteArray(), T = 0; T < E.length; T += 1)
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
  })(Pa)), Pa.exports;
}
var M5 = $5();
const S5 = /* @__PURE__ */ x5(M5), _5 = ["width", "height", "viewBox"], E5 = ["width", "height"], A5 = ["d"], C5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const a = S5(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (u(), h("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      b("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, E5),
      b("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, A5)
    ], 8, _5));
  }
}, l8 = /* @__PURE__ */ Y(C5, [["__scopeId", "data-v-489f0852"]]), O5 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, r8 = /* @__PURE__ */ Y(O5, [["__scopeId", "data-v-47e67f04"]]);
function i8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const c8 = yi(() => import("./VoiceFigure-D0jIPJFC.js").then((e) => e.V)), u8 = "1.2.0", d8 = "3.5";
export {
  yd as $,
  _e as A,
  Oe as B,
  na as C,
  at as D,
  p$ as E,
  $b as F,
  ox as G,
  d$ as H,
  ab as I,
  Ob as J,
  Ct as K,
  I5 as L,
  Is as M,
  Nb as N,
  Cb as O,
  ta as P,
  Tx as Q,
  j4 as R,
  Ln as S,
  Nx as T,
  O4 as U,
  Ee as V,
  Hn as W,
  C4 as X,
  A4 as Y,
  vd as Z,
  Y as _,
  w4 as a,
  Qx as a$,
  Bb as a0,
  P4 as a1,
  q4 as a2,
  Te as a3,
  Z4 as a4,
  J4 as a5,
  _t as a6,
  F4 as a7,
  cx as a8,
  c4 as a9,
  zx as aA,
  Ax as aB,
  Vy as aC,
  hx as aD,
  mx as aE,
  g$ as aF,
  Pr as aG,
  Lx as aH,
  hn as aI,
  p4 as aJ,
  f4 as aK,
  o$ as aL,
  mn as aM,
  c$ as aN,
  sx as aO,
  Cx as aP,
  Ox as aQ,
  Ex as aR,
  an as aS,
  $t as aT,
  u4 as aU,
  Nv as aV,
  Sx as aW,
  N4 as aX,
  Dr as aY,
  Nt as aZ,
  qt as a_,
  e$ as aa,
  r$ as ab,
  y4 as ac,
  T4 as ad,
  R4 as ae,
  K4 as af,
  Y4 as ag,
  X4 as ah,
  M4 as ai,
  Ho as aj,
  W4 as ak,
  ix as al,
  w$ as am,
  kx as an,
  bx as ao,
  yx as ap,
  Q4 as aq,
  V4 as ar,
  z4 as as,
  G4 as at,
  Bx as au,
  rx as av,
  ux as aw,
  $$ as ax,
  Yt as ay,
  dx as az,
  Gb as b,
  x$ as b$,
  bb as b0,
  i$ as b1,
  Px as b2,
  jx as b3,
  ly as b4,
  Mr as b5,
  Jx as b6,
  lx as b7,
  oa as b8,
  rt as b9,
  Fx as bA,
  Gx as bB,
  dt as bC,
  Dx as bD,
  Kx as bE,
  fx as bF,
  xx as bG,
  px as bH,
  Re as bI,
  ax as bJ,
  Yx as bK,
  T$ as bL,
  R$ as bM,
  r4 as bN,
  Pv as bO,
  tx as bP,
  Wx as bQ,
  k4 as bR,
  b$ as bS,
  qx as bT,
  Hx as bU,
  Ux as bV,
  ex as bW,
  Gy as bX,
  nx as bY,
  vx as bZ,
  y$ as b_,
  Vx as ba,
  _a as bb,
  Kl as bc,
  S$ as bd,
  A$ as be,
  Ix as bf,
  s$ as bg,
  i4 as bh,
  wx as bi,
  _$ as bj,
  H4 as bk,
  U4 as bl,
  _4 as bm,
  D4 as bn,
  m4 as bo,
  n$ as bp,
  x4 as bq,
  $4 as br,
  E4 as bs,
  Mx as bt,
  Tv as bu,
  u$ as bv,
  Ab as bw,
  S4 as bx,
  g4 as by,
  $x as bz,
  oy as c,
  cn as c$,
  h4 as c0,
  d4 as c1,
  gx as c2,
  C$ as c3,
  js as c4,
  O$ as c5,
  ei as c6,
  a$ as c7,
  B4 as c8,
  I4 as c9,
  ye as cA,
  K$ as cB,
  F5 as cC,
  u8 as cD,
  d8 as cE,
  Y5 as cF,
  J$ as cG,
  ts as cH,
  n4 as cI,
  p0 as cJ,
  St as cK,
  cs as cL,
  Xn as cM,
  U5 as cN,
  J5 as cO,
  Wi as cP,
  Rg as cQ,
  a8 as cR,
  V5 as cS,
  l8 as cT,
  Ql as cU,
  ic as cV,
  z$ as cW,
  Td as cX,
  D5 as cY,
  s4 as cZ,
  Kw as c_,
  Lv as ca,
  v4 as cb,
  _b as cc,
  _x as cd,
  Os as ce,
  Fy as cf,
  Rx as cg,
  Jt as ch,
  Lt as ci,
  W5 as cj,
  G$ as ck,
  de as cl,
  td as cm,
  id as cn,
  ws as co,
  cm as cp,
  El as cq,
  s8 as cr,
  l4 as cs,
  hm as ct,
  Ip as cu,
  Qt as cv,
  I$ as cw,
  R5 as cx,
  Mt as cy,
  Tu as cz,
  Ue as d,
  V$ as d$,
  Z5 as d0,
  Et as d1,
  gt as d2,
  rp as d3,
  gc as d4,
  e4 as d5,
  j5 as d6,
  jt as d7,
  Y$ as d8,
  o8 as d9,
  L$ as dA,
  eh as dB,
  B$ as dC,
  L5 as dD,
  X$ as dE,
  c0 as dF,
  gw as dG,
  P5 as dH,
  K5 as dI,
  P$ as dJ,
  F$ as dK,
  qe as dL,
  H5 as dM,
  z5 as dN,
  j$ as dO,
  Hp as dP,
  N5 as dQ,
  B5 as dR,
  vl as dS,
  yl as dT,
  iu as dU,
  q5 as dV,
  ut as dW,
  i8 as dX,
  vw as dY,
  Q5 as dZ,
  D$ as d_,
  Ps as da,
  Iu as db,
  xt as dc,
  X5 as dd,
  la as de,
  c8 as df,
  N$ as dg,
  r8 as dh,
  Es as di,
  q$ as dj,
  ms as dk,
  k1 as dl,
  bo as dm,
  sr as dn,
  lu as dp,
  t8 as dq,
  e8 as dr,
  gs as ds,
  ou as dt,
  hl as du,
  G5 as dv,
  n8 as dw,
  o4 as dx,
  a4 as dy,
  t4 as dz,
  L4 as e,
  mw as e0,
  Z$ as e1,
  vg as e2,
  ll as e3,
  ak as e4,
  Ss as e5,
  W$ as e6,
  es as e7,
  H$ as e8,
  U$ as e9,
  ze as ea,
  Q$ as eb,
  ru as ec,
  Ov as f,
  M$ as g,
  sn as h,
  f$ as i,
  E$ as j,
  h$ as k,
  t$ as l,
  Xb as m,
  Bs as n,
  l$ as o,
  b4 as p,
  m$ as q,
  Xr as r,
  Qr as s,
  Me as t,
  iy as u,
  Zx as v,
  k$ as w,
  Xx as x,
  gn as y,
  v$ as z
};
