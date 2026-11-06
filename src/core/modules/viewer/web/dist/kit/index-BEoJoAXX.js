/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as ce, createElementVNode as g, normalizeClass as Z, Fragment as G, renderList as te, normalizeStyle as fe, defineComponent as _r, Comment as Er, h as Nn, cloneVNode as Ar, createBlock as F, withCtx as N, unref as q, createVNode as L, toDisplayString as w, createCommentVNode as C, inject as $e, useAttrs as Dn, computed as T, ref as O, resolveDynamicComponent as gt, mergeProps as Ke, onUnmounted as Te, onMounted as Ce, Teleport as Ga, useId as Ka, resolveDirective as Cr, withDirectives as Ye, createTextVNode as ne, reactive as Ya, shallowRef as Ue, watch as he, nextTick as st, Transition as Tt, withModifiers as be, TransitionGroup as So, shallowReactive as Or, isRef as ks, onBeforeUnmount as vt, resolveComponent as Tr, useModel as $a, getCurrentInstance as Br, mergeModels as Ma, getCurrentScope as _o, onScopeDispose as Eo, provide as Ir, onErrorCaptured as Rr, toHandlers as Lr, createSlots as Nr, vShow as Ao, useSlots as Dr, withKeys as Ut, vModelText as Sa, defineAsyncComponent as Pr } from "vue";
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, jr = { class: "skeleton-line" }, qr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", jr, [
      ce(t.$slots, "default", {}, void 0, !0),
      g("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(G, null, te(e.bars, (a) => (c(), h("span", {
          key: a.width,
          class: Z(["bar", { still: e.still }]),
          style: fe({ width: a.width, height: `${a.height}px`, borderRadius: `${a.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, lt = /* @__PURE__ */ K(qr, [["__scopeId", "data-v-0ebb6933"]]), Bt = _r({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Er);
      return a.length !== 1 ? Nn(G, { key: n }, a) : a[0].key == null ? Ar(a[0], { key: n }) : a[0];
    };
  }
}), Fr = ["aria-label"], Wr = ["aria-label"], Hr = ["aria-label"], Ur = ["aria-label"], zr = ["aria-label"], Vr = ["aria-label"], Gr = ["aria-label"], Kr = {
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
    return (i, u) => (c(), F(Bt, { value: e.shape }, {
      messages: N(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(G, null, te(t, (d) => g("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, Fr)
      ]),
      older: N(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, Wr)
      ]),
      cards: N(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(G, null, te(n, (f) => L(lt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Hr)
      ]),
      file: N(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            L(lt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(G, null, te(s, (f) => L(lt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ur)
      ]),
      page: N(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          L(lt, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(G, null, te(e.count, (d) => (c(), F(lt, {
            key: d,
            bars: q(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, zr)
      ]),
      text: N(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), F(lt, {
            key: d,
            bars: q(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Vr)
      ]),
      default: N(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), F(lt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Gr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, yt = /* @__PURE__ */ K(Kr, [["__scopeId", "data-v-384b7120"]]), Yr = {
  key: 1,
  class: "empty-state titled"
}, Zr = { class: "empty-state-title" }, Jr = { class: "empty-state-text" }, Xr = {
  key: 2,
  class: "empty-state"
}, Qr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), F(yt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Yr, [
      g("p", Zr, w(e.title), 1),
      g("p", Jr, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Xr, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, zt = /* @__PURE__ */ K(Qr, [["__scopeId", "data-v-b27e89b0"]]), ei = { class: "fold-group" }, ti = ["aria-expanded"], ni = { class: "fold-label" }, ai = {
  key: 0,
  class: "fold-count"
}, si = {
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
    return (a, s) => (c(), h("div", ei, [
      g("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", ni, w(e.label), 1),
        e.count !== "" ? (c(), h("span", ai, w(e.count), 1)) : C("", !0),
        g("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, ti),
      e.open ? ce(a.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, ok = /* @__PURE__ */ K(si, [["__scopeId", "data-v-9ef1865c"]]), oi = Symbol("open-view"), Se = Symbol.for("journal.window-context");
function ot() {
  const e = $e(Se, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const li = ["stroke-width", "innerHTML"], me = {
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
    }, null, 12, li));
  }
}, ri = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, ii = /* @__PURE__ */ K(ri, [["__scopeId", "data-v-eb453d6f"]]), ci = 120, ui = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Dn(), a = T(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = O(!1), o = T(() => t.busy || s.value), l = $e(Se, null), r = T(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, ci);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), F(gt(e.href ? "a" : "button"), Ke(a.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: N(() => [
        g("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), F(me, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : C("", !0),
          ce(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), F(ii, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ue = /* @__PURE__ */ K(ui, [["__scopeId", "data-v-13c30dc0"]]), di = (e, t, n) => Math.max(t, Math.min(n, e)), fi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Co = /* @__PURE__ */ new WeakMap(), hi = (e, t) => Co.set(e, t);
function mi(e, t) {
  for (let n = t; n; n = Co.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Oo(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !mi(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Te(() => window.removeEventListener("click", n));
}
const $t = 8, pi = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = O(null), o = (p) => p ? `${p}px` : void 0, l = T(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = O({ w: 0, h: 0 }), i = O(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const R = p.closest(".pane, .float-window");
      return R ? d(R.getBoundingClientRect()) : u();
    }, m = (p, R) => `${Math.max(0, p ? Math.min(p, R) : R)}px`;
    function v(p, R) {
      return {
        below: p.bottom - R.bottom - a.gap - $t,
        above: R.top - p.top - a.gap - $t,
        across: p.right - p.left - 2 * $t
      };
    }
    function k(p) {
      const R = f(a.anchor), B = v(R, p);
      return r.value.w <= B.across && r.value.h <= Math.max(B.below, B.above) ? R : u();
    }
    const A = T(() => {
      if (!i.value) return l.value;
      const p = i.value, R = k(p), B = v(R, p), { w: H, h: X } = r.value, J = a.align === "auto" ? p.left + p.right > R.left + R.right : a.align === "right", Y = di(J ? p.right - H : p.left, R.left + $t, Math.max(R.left + $t, R.right - H - $t)), ve = X > B.below && B.above > B.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, B.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, B.below) };
      return { ...l.value, ...ve, left: `${Y}px`, maxWidth: m(a.maxWidth, B.across) };
    }), x = n, I = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function z(p) {
      const R = I(), B = R.indexOf(document.activeElement);
      R[(B + p + R.length) % R.length].focus();
    }
    const ee = { ArrowDown: () => z(1), ArrowUp: () => z(-1), Escape: () => x("close") }, P = (p) => ee[p.key] && (p.preventDefault(), ee[p.key]()), _ = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let S = 0;
    const $ = new ResizeObserver(() => {
      cancelAnimationFrame(S), S = requestAnimationFrame(_);
    });
    Oo(s, (p) => a.anchor && !a.anchor.contains(p.target) && x("close"));
    const M = (p, R) => ["top", "left", "right", "bottom"].some((B) => Math.abs(p[B] - R[B]) > 1), y = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let E = 0;
    function b() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || y(p)) return x("close");
        M(p, i.value) && (i.value = p);
      }
      E = requestAnimationFrame(b);
    }
    return Ce(() => {
      a.anchor && s.value && hi(s.value, a.anchor), _(), s.value && $.observe(s.value), !a.plain && I()[0] && I()[0].focus(), b();
    }), Te(() => {
      $.disconnect(), cancelAnimationFrame(E), cancelAnimationFrame(S);
    }), t({ element: s }), (p, R) => (c(), F(Ga, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ke({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: A.value,
        onKeydown: P
      }), [
        ce(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Pn = /* @__PURE__ */ K(pi, [["__scopeId", "data-v-3d203970"]]), gi = { class: "split-button" }, vi = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = O(null), s = O(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", gi, [
      L(ue, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: N(() => [
          ce(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      g("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        L(ue, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: N(() => [
            L(me, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), F(Pn, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: N(() => [
          ce(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : C("", !0)
    ]));
  }
}, yi = /* @__PURE__ */ K(vi, [["__scopeId", "data-v-c258494d"]]), bi = ["aria-checked", "aria-haspopup", "onClick"], wi = {
  key: 0,
  class: "segmented-dot"
}, ki = {
  key: 1,
  class: "segmented-note"
}, xi = {
  key: 2,
  class: "segmented-count"
}, $i = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Ka();
    return (s, o) => {
      const l = Cr("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(G, null, te(e.options, (r) => Ye((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", wi)) : C("", !0),
          ne(" " + w(r.label) + " ", 1),
          r.note ? (c(), h("small", ki, w(r.note), 1)) : C("", !0),
          r.count !== void 0 ? (c(), h("em", xi, w(r.count), 1)) : C("", !0)
        ], 10, bi)), [
          [l, r.tip || r.title, `${q(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, jn = /* @__PURE__ */ K($i, [["__scopeId", "data-v-c89bc92d"]]), To = typeof document < "u" && document.documentElement.classList.contains("phone");
function Mi() {
  return () => {
  };
}
function _a(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Bo(e = window) {
  if (!_a(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    _a(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ea = "journal.stale-build-reload", Si = 'script[type="module"][src*="/assets/index-"]', xs = (e) => {
  var t;
  return ((t = e.querySelector(Si)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function _i(e = document, t = fetch, n = () => Bo(window)) {
  const a = xs(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = xs(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Yn = "";
function Ei(e, t = () => Bo(window)) {
  if (!e) return !1;
  const n = !!Yn && Yn !== e;
  return Yn = e, n && t(), n;
}
const Ai = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Ci(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ea) === e.message) return !1;
    t.setItem(Ea, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Oi(e = window.sessionStorage) {
  try {
    e.removeItem(Ea);
  } catch {
    return;
  }
}
const Ti = 2e3, Bi = 3e4, Ne = Ya({ starting: !1, external: !1, late: !1, offline: !1 }), Io = () => Ne.starting, Ii = 3;
let cn = 0, Aa = 0, Ro = 0, Lo = [];
async function Ri() {
  try {
    const e = await At.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ne.external };
  }
}
let $s = null;
const Li = () => $s ?? ($s = Ri().finally(() => $s = null));
function Ni() {
  clearTimeout(Aa), clearTimeout(Ro), Aa = 0, Object.assign(Ne, { starting: !1, external: !1, late: !1, offline: !1 }), Lo.splice(0).forEach((e) => e()), _i();
}
async function Di() {
  Ne.offline = !navigator.onLine;
  const e = await Li();
  if (Ne.external = e.updating, cn = !e.restarting && !e.updating && e.reachable ? cn + 1 : 0, cn < Ii) return;
  cn = 0, (!Ei(e.started_at) || _a()) && Ni();
}
function No() {
  Aa = setTimeout(async () => {
    await Di(), Ne.starting && No();
  }, Ti);
}
function Ms() {
  Ne.starting || (Ne.starting = !0, Ne.offline = !navigator.onLine, No(), Ro = setTimeout(() => Ne.late = !0, Bi));
}
const Pi = () => Ne.starting ? new Promise((e) => Lo.push(e)) : Promise.resolve(), Ss = 2e4, ji = 3e5, un = 6, qi = 500, Fi = "/journal/summary", Wi = "/api/server-state", Hi = 2e4, _s = To ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ui = (e) => e.split("?")[0].endsWith(Fi), Do = (e, t) => Object.assign(new Error(t), { status: e });
async function zi(e, t, n = Do) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Vi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Gi {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = un;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = un;
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
    const r = a instanceof FormData;
    try {
      return await fetch(n, {
        method: t,
        headers: { ..._s, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: Vi(a),
        signal: AbortSignal.timeout(s || (r ? ji : Ss))
      });
    } catch (i) {
      if (i instanceof TypeError && Ms(), t !== "GET" || !(i instanceof TypeError) || o <= 1) throw i;
      return await new Promise((u) => setTimeout(u, qi)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = un, l = {}) {
    this.watcher("sent", t, n, a);
    const r = t === "GET" ? () => {
    } : Mi(), i = await this.reach(t, n, a, s, o, l).finally(() => {
      r(), this.watcher("answered", t, n, a);
    });
    return zi(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: _s, signal: AbortSignal.timeout(Ss) });
    if (!n.ok) throw Do(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, a, s, un, o).then((i) => (this.written(n), i));
    if (Io() && !Ui(n))
      return Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 }));
    if (this.flying.has(l)) return this.flying.get(l);
    const r = this.send(t, n, a, 0, this.tries, o);
    return this.flying.set(l, r), r.finally(() => this.flying.delete(l)).catch(() => {
    }), r;
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query
  stream(t) {
    return new EventSource(t);
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return fetch(Wi, { cache: "no-store", signal: AbortSignal.timeout(Hi) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (a) {
      throw a instanceof TypeError && Ms(), a;
    }
  }
}
const At = new Gi(), Ki = 0, Yi = "/api/lines", Zi = "/api/line";
class Ji {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n, a = !1) {
    return new Promise((s, o) => {
      if (a) {
        this.alone({ body: t, signal: n, resolve: s, reject: o });
        return;
      }
      this.waiting.push({ body: t, signal: n, resolve: s, reject: o }), this.timer ?? (this.timer = setTimeout(() => this.send(), Ki));
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
        const n = await At.raw(Yi, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((s) => s.body) }) }), { answers: a } = await n.json();
        t.forEach((s, o) => s.resolve(a[o]));
      } catch (n) {
        t.forEach((a) => a.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await At.raw(Zi, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Xi = new Ji(), Qi = 150, ec = () => Qi;
function Za(e, t, n = ec(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class tc {
  constructor() {
    this.following = Ue([]), this.held = /* @__PURE__ */ new Set();
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
    for (const n of this.follows)
      n.patterns.some((a) => Po(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Po(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const jo = /* @__PURE__ */ new Map();
class nc {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ue({ buttons: [], missing: {} }), this.loading = Ue(!1), this.loaded = Ue(!1), this.failed = Ue(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await At.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function lk(e, t) {
  const n = new nc(e, t);
  return jo.set(e, n), n.load().catch(() => {
  }), n;
}
const Ja = (e) => jo.get(e);
function ac(e, t, n) {
  const a = Ja(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function sc(e, t) {
  if (!e) return !0;
  const n = Ja(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const oc = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let qo = {};
async function rk(e = fetch) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (qo = (await t.json()).states);
}
const Xa = (e, t) => {
  var n;
  return (n = qo[e]) == null ? void 0 : n[t];
}, Fo = (e, t) => {
  var n;
  return ((n = Xa(e, t)) == null ? void 0 : n.label) ?? oc(t);
}, Wo = (e, t) => {
  var n;
  return ((n = Xa(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, lc = (e, t) => {
  var n;
  return ((n = Xa(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, rc = Symbol("pane-page"), ic = Symbol("inspector-host"), cc = { 1: "refused", 2: "usage", 3: "fault" }, uc = 100, dc = 50, fc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, hc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function mc({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = O({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: k = [], links: A = {}, search: x = {}, readOnly: I = !1, shared: z = null }) {
  const ee = /* @__PURE__ */ new Map(), P = new AbortController(), _ = O(!1), S = performance.now();
  let $ = 0, M = 0;
  const y = () => {
    clearTimeout(M), M = setTimeout(() => {
      $ === 0 && Za(S, () => _.value = !0);
    }, dc);
  }, E = (b, { unbatched: p = !1 } = {}) => {
    const R = ee.get(b);
    if (R && performance.now() - R.at < uc) return R.answer;
    $ += 1;
    const B = Uo(e, b, t, P.signal, p).finally(() => {
      $ -= 1, y();
    });
    return ee.set(b, { answer: B, at: performance.now() }), B;
  };
  return {
    answered: _,
    settle: y,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: T(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: v,
    sources: k,
    links: A,
    search: x,
    readOnly: I,
    shared: z,
    read: E,
    run: (b) => ht(e, b, t, P.signal),
    upload: (b) => gc(b, P.signal),
    cancel: () => P.abort(),
    subscriptions: l,
    follow: (b, p) => l.follow(e, b.filter((R) => o.some((B) => Po(B, R))), (R) => {
      ee.clear(), p(R);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (b) => T(() => {
      var p;
      return i.value[b] ?? ((p = u.find((R) => R.key === b)) == null ? void 0 : p.default);
    }),
    setting: async (b, p) => {
      const R = await E(`window setting ${e} ${b}`);
      return R.ok ? R.value.value : p;
    },
    setOption: f,
    keep: (b, p) => ht(e, ["window", "save-setting", e, b, JSON.stringify(p)], t, P.signal)
  };
}
function pc(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Vt = { ok: !1, failure: "cancelled", error: "" }, Ho = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ht(e, t, n, a = void 0, s = !1) {
  try {
    const o = await Xi.add({ window: e, line: Array.isArray(t) ? t : zo(t), environment: n }, a, s);
    return a != null && a.aborted ? Vt : o.code === 0 ? { ok: !0, value: o.value } : { ok: !1, failure: cc[o.code] || "fault", error: pc(o.error) };
  } catch {
    return a != null && a.aborted ? Vt : { ok: !1, failure: "unreachable", error: Ho };
  }
}
async function Uo(e, t, n, a, s = !1) {
  const o = await ht(e, t, n, a, s);
  return o.failure !== "unreachable" || !Io() ? o : (await Pi(), a.aborted ? Vt : Uo(e, t, n, a, s));
}
async function gc(e, t = void 0) {
  try {
    const n = await At.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), a = await n.json();
    return t != null && t.aborted ? Vt : n.ok ? { ok: !0, value: a.file } : { ok: !1, failure: "refused", error: a.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Vt : { ok: !1, failure: "unreachable", error: Ho };
  }
}
function zo(e) {
  return [...e.matchAll(fc)].map(([t]) => t.replace(hc, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const vc = (e) => `show-${e}`, ik = (e, t, n) => e.filter((a) => {
  var s;
  return n(vc((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Vo = "messages.chat", yc = {
  key: 0,
  class: "template-brief"
}, bc = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, wc = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O([]), o = O(""), l = T(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = T(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await ht(Vo, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(G, null, [
      L(jn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", yc, w(r.value.brief), 1)) : C("", !0),
      o.value ? (c(), h("p", bc, w(o.value), 1)) : C("", !0)
    ], 64));
  }
}, kc = /* @__PURE__ */ K(wc, [["__scopeId", "data-v-14be8a5c"]]), xc = { class: "form-field" }, $c = { class: "form-field-head" }, Mc = ["for"], Sc = {
  key: 0,
  class: "form-field-aside"
}, _c = {
  key: 0,
  class: "form-field-help"
}, Ec = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", xc, [
      g("div", $c, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, w(e.label), 9, Mc),
        t.$slots.aside ? (c(), h("span", Sc, [
          ce(t.$slots, "aside", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      ce(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", _c, w(e.help), 1)) : C("", !0)
    ]));
  }
}, Ac = /* @__PURE__ */ K(Ec, [["__scopeId", "data-v-dd7cdcff"]]), Ca = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Cc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Dn(), n = T(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ye((c(), h("textarea", Ke({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [q(Ca), q(t).value]
    ]);
  }
}), Oc = /* @__PURE__ */ K(Cc, [["__scopeId", "data-v-e130a5b9"]]), Tc = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ka(), o = T(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), F(Ac, {
      label: e.field.label,
      for: q(s),
      "data-button-field": e.field.name
    }, {
      default: N(() => [
        L(Bt, { value: o.value }, {
          choice: N(() => [
            L(jn, {
              id: q(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: N(() => [
            L(kc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: N(() => [
            L(Oc, {
              id: q(s),
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
}, Qa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), F(ue, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: N(() => [
        L(me, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Bc(e, t, n, a = () => window) {
  Ce(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Te(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Ic = (e, t = () => !0) => Bc("keydown", (n) => n.key === "Escape" && t() && e());
function Go(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = O(!1), s = T(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Ic(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Rc = 80, Mt = Ya([]);
function Ko(e) {
  const t = Symbol("layer"), n = () => Mt.includes(t) && Mt.splice(Mt.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Mt.includes(t) && Mt.push(t), a || n();
    },
    { immediate: !0 }
  ), Te(n), T(() => Rc + Math.max(0, Mt.indexOf(t)));
}
let Yo = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Yo = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Lc = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Nc(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Lc)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Ce(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Yo, document.addEventListener("keydown", s), st(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Te(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Dc = ["aria-modal", "aria-label", "aria-labelledby"], Pc = {
  key: 0,
  class: "dialog-head"
}, jc = ["id", "tabindex"], qc = {
  key: 1,
  class: "dialog-foot"
}, Fc = 500, Wc = 400, Hc = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Go(a, n), r = Ko(s), i = O(null), u = O(null), d = O(null), f = Ka(), m = O(!1), v = Date.now();
    n.modal && Nc(u, () => a("escape"), d);
    function k() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, Wc);
    }
    function A(z) {
      !n.modal || Date.now() - v >= Fc || ![" ", "Enter"].includes(z.key) || (z.preventDefault(), z.stopPropagation());
    }
    const x = () => i.value && (i.value.scrollTop = i.value.scrollHeight), I = new MutationObserver(x);
    return he(i, (z) => {
      I.disconnect(), z && n.follow && (I.observe(z, { childList: !0, subtree: !0, characterData: !0 }), x());
    }), Te(() => I.disconnect()), (z, ee) => (c(), F(Ga, { to: "body" }, [
      L(Tt, {
        name: "dialog",
        appear: "",
        onAfterLeave: q(l)
      }, {
        default: N(() => [
          q(s) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: q(r) }),
            onClick: be(k, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? q(f) : void 0,
              onKeydownCapture: A
            }, [
              e.bare ? C("", !0) : (c(), h("header", Pc, [
                g("h3", {
                  id: q(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, jc),
                e.closable ? (c(), F(Qa, {
                  key: 0,
                  onClick: q(o)
                }, null, 8, ["onClick"])) : C("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ce(z.$slots, "default", {}, void 0, !0)
              ], 2),
              z.$slots.foot ? (c(), h("footer", qc, [
                ce(z.$slots, "foot", {}, void 0, !0)
              ])) : C("", !0)
            ], 42, Dc)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Zo = /* @__PURE__ */ K(Hc, [["__scopeId", "data-v-6d1ecd98"]]), Uc = (e, t, n = {}) => zo(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function en(e, t, n, a = {}) {
  try {
    return await sc(e.module, n) ? ht(Vo, Uc(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const zc = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Zn = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], pe = (e, t, n, a = {}) => ({
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
}), qn = {
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
    filters: Zn
  }),
  tasks: pe("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Zn
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
  pins: pe("Pin", "band", "One line pinned to the chat while it matters", { filters: Zn }),
  reactions: pe("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: pe("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: pe("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: pe("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: pe("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: pe("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: pe("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: pe("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: pe("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: pe("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
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
}, Vc = ["secrets", "plugins"], Jo = Object.keys(qn).filter((e) => !(To && Vc.includes(e)));
T(() => Jo.map((e) => ({ name: e, ...qn[e] })));
const It = (e) => qn[e], Xo = new Map(Jo.flatMap((e) => [e, e.replace(/s$/, ""), qn[e].title.toLowerCase()].map((t) => [t, e]))), Ve = (e) => Xo.get(String(e).toLowerCase()) || "", Qo = [...Xo.keys()].sort((e, t) => t.length - e.length).join("|"), Gc = {
  class: "button-form",
  "data-button-form": ""
}, Kc = {
  key: 0,
  class: "button-form-title"
}, Yc = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Zc = { class: "button-form-actions" }, Jc = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = O(!1), l = O(""), r = T(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = T(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = It(Ve(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await en(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), F(Zo, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: N(() => {
        var m;
        return [
          g("div", Gc, [
            (m = e.row) != null && m.title ? (c(), h("p", Kc, w(e.row.title), 1)) : C("", !0),
            (c(!0), h(G, null, te(e.button.fields, (v) => (c(), F(Tc, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (k) => s.value[v.name] = k
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", Yc, w(l.value), 1)) : C("", !0),
            g("div", Zc, [
              L(ue, {
                small: "",
                onClick: f[0] || (f[0] = (v) => a("close"))
              }, {
                default: N(() => [...f[2] || (f[2] = [
                  ne("Cancel", -1)
                ])]),
                _: 1
              }),
              L(ue, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: N(() => [...f[3] || (f[3] = [
                  ne("Send", -1)
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
}, Xc = /* @__PURE__ */ K(Jc, [["__scopeId", "data-v-f26c27a7"]]), Qc = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, eu = {
  key: 1,
  class: "menu-item-text"
}, tu = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Qc, w(e.checked ? "✓" : ""), 1)) : C("", !0),
      e.description ? (c(), h("span", eu, [
        g("span", null, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, w(e.description), 1)
      ])) : ce(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, mt = /* @__PURE__ */ K(tu, [["__scopeId", "data-v-fec99974"]]), nu = ["aria-busy"], au = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, su = {
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
    const n = e, a = t, s = T(() => Ja(n.environment)), o = T(
      () => {
        var k;
        return !n.readOnly && ((k = s.value) == null ? void 0 : k.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = T(() => {
      var k;
      return !n.readOnly && ((k = s.value) == null ? void 0 : k.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = T(() => n.readOnly ? [] : ac(n.environment, n.name, n.row)), u = O(null), d = O(""), f = O(!1), m = (k) => [k.from ? `From ${k.from}` : "", k.tip].filter(Boolean).join(" · ");
    async function v(k) {
      if (f.value || n.readOnly) return;
      if (k.fields.length) {
        u.value = k;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const A = await en(k, n.row, n.environment);
      f.value = !1, d.value = A.ok ? "" : A.error;
      const x = k.label.toLowerCase() + (n.objectName && !k.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", A.ok ? "" : `Could not ${x}: ${A.error}`), A.ok && a("done");
    }
    return (k, A) => (c(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(G, { key: 0 }, [
        A[3] || (A[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        L(ue, {
          small: "",
          onClick: r
        }, {
          default: N(() => [...A[2] || (A[2] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? C("", !0) : (c(), h(G, { key: 1 }, [
        (c(!0), h(G, null, te(i.value, (x) => (c(), h(G, {
          key: x.name
        }, [
          x.menu.length ? (c(), F(yi, {
            key: 0,
            small: "",
            variant: x.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": x.menu_label || "More ways",
            title: m(x),
            "data-button": x.name,
            onMain: (I) => v(x)
          }, {
            menu: N(({ close: I }) => [
              (c(!0), h(G, null, te(x.menu, (z) => (c(), F(mt, {
                key: z.label,
                description: z.description,
                onClick: (ee) => (I(), v({ ...x, ...z, menu: [] }))
              }, {
                default: N(() => [
                  ne(w(z.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: N(() => [
              ne(w(x.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), F(ue, {
            key: 1,
            small: "",
            variant: x.primary ? "primary" : "ghost",
            bordered: !x.primary,
            icon: x.icon,
            disabled: f.value,
            title: m(x),
            "data-button": x.name,
            onClick: (I) => v(x)
          }, {
            default: N(() => [
              ne(w(x.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", au, w(d.value), 1)) : C("", !0),
        u.value && !e.readOnly ? (c(), F(Xc, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: A[0] || (A[0] = (x) => u.value = null),
          onDone: A[1] || (A[1] = (x) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : C("", !0)
      ], 64))
    ], 10, nu));
  }
}, ou = /* @__PURE__ */ K(su, [["__scopeId", "data-v-a07b49a4"]]), lu = {
  class: "running",
  "data-running-command": ""
}, ru = ["title"], iu = {
  key: "idle",
  class: "running-idle"
}, cu = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", lu, [
      L(Tt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: N(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, ru)) : (c(), h("span", iu, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, ck = /* @__PURE__ */ K(cu, [["__scopeId", "data-v-d3240219"]]), uu = ["aria-checked", "aria-label", "title"], du = {
  key: 0,
  class: "switch-inner"
}, fu = {
  key: 0,
  class: "switch-word"
}, hu = {
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
      g("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", du, w(e.word), 1)) : C("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", fu, w(e.word), 1)) : C("", !0)
    ], 10, uu));
  }
}, uk = /* @__PURE__ */ K(hu, [["__scopeId", "data-v-1bfb90f3"]]);
function el(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Sn(e, t) {
  return el(() => localStorage, e, t);
}
function tl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function es(e, t) {
  return tl(() => localStorage, e, t);
}
function nl(e, t) {
  he(t, (n) => es(e, n), { deep: !0 });
}
function mu(e, t) {
  return el(() => sessionStorage, e, t);
}
function pu(e, t) {
  return tl(() => sessionStorage, e, t);
}
const _n = "journal.environment", al = O(mu(_n, Sn(_n, "")));
function gu(e) {
  al.value = e, pu(_n, e), es(_n, e);
}
const En = O(location.hash), Es = Ue(null), As = { integrations: "mcp", library: "team" };
function vu() {
  if (!Es.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (As[n]) {
    location.replace(`#/${[As[n], ...a].join("/")}${t ? `?${t}` : ""}`), En.value = location.hash;
    return;
  }
  !n || Es.value(n) || (gu(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), En.value = location.hash);
}
window.addEventListener("hashchange", () => {
  En.value = location.hash, vu();
});
const Oa = T(() => {
  const [e, t = ""] = En.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [u = "", d = "", f = ""] = r.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: al.value,
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
}), ts = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${ts.page(e)}?open=${t}`
};
function yu(e = "", t = 0, n = "") {
  location.hash = ts.page(e, t, n);
}
const bu = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function sl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(bu).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const _t = {};
function dk(e, t) {
  return _t[e] = t, () => _t[e] === t && delete _t[e];
}
function ol(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = _t[e]) != null && l.call(_t, t))) return;
  const s = Oa.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  sl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function wu(e, t, n, a = 0, s = "") {
  if (e === Oa.value.env) return ol(t, n, a, s);
  const o = Oa.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  sl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function De(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? wu(a, s, Number(o), 0, t) : ol(s, Number(o), 0, t);
}
function ku(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function St(e) {
  const t = ku(e);
  t && De(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function fk(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const xu = { class: "inspector-part" }, $u = { class: "inspector-part-title" }, Mu = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", xu, [
      g("h4", $u, w(e.title), 1),
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, hk = /* @__PURE__ */ K(Mu, [["__scopeId", "data-v-0da7fa52"]]), Su = {
  key: 1,
  class: "row-list-failure"
}, _u = ["data-row"], Eu = {
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
    const t = e, n = T(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = O(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure ? (c(), F(yt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Su, w(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), F(zt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: N(() => [
        ne(w(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(G, { key: 3 }, [
      (c(), F(gt(e.arrival ? So : "ul"), Ke(n.value, { class: "row-list" }), {
        default: N(() => [
          (c(!0), h(G, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ce(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, _u))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : C("", !0)
    ], 64));
  }
}, Au = /* @__PURE__ */ K(Eu, [["__scopeId", "data-v-aa6ad7ff"]]), Cu = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ou = {
  key: 1,
  class: "agent-rows-note"
}, Tu = {
  key: 2,
  class: "agent-rows-note"
}, Bu = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Iu = ["data-agent-row", "onClick"], Ru = { class: "agent-row-name" }, Lu = { class: "agent-row-state" }, Nu = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = T(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", Cu, [
      e.loaded ? e.failure ? (c(), h("p", Ou, w(e.failure), 1)) : e.rows.length ? (c(), h(G, { key: 3 }, [
        g("p", Bu, w(a.value) + " running", 1),
        (c(!0), h(G, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => q(De)(`agents:${l.id}`)
        }, [
          g("span", Ru, "#" + w(l.id) + " " + w(l.session), 1),
          g("span", Lu, w(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Iu))), 128))
      ], 64)) : (c(), h("p", Tu, w(e.none), 1)) : (c(), F(yt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, mk = /* @__PURE__ */ K(Nu, [["__scopeId", "data-v-a01e5a17"]]), Du = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, w(e.text), 3));
  }
}, ll = /* @__PURE__ */ K(Du, [["__scopeId", "data-v-9e7e1157"]]), Pu = ["aria-valuenow", "aria-valuemax"], ju = {
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
    const t = e, n = T(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (c(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: fe({ width: n.value })
      }, null, 4)
    ], 10, Pu));
  }
}, qu = /* @__PURE__ */ K(ju, [["__scopeId", "data-v-9eba6a85"]]), Fu = { class: "bars" }, Wu = { class: "bar-name" }, Hu = { class: "bar-value" }, Uu = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = T(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", Fu, [
      (c(!0), h(G, null, te(e.items, (i, u) => (c(), F(gt(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: N(() => [
          g("span", Wu, w(i.label), 1),
          L(qu, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", Hu, w(i.value) + w(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, zu = /* @__PURE__ */ K(Uu, [["__scopeId", "data-v-663427f4"]]), Vu = { class: "bars" }, Gu = {
  key: 0,
  class: "bars-title"
}, Ku = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Vu, [
      e.node.title ? (c(), h("span", Gu, w(e.node.title), 1)) : C("", !0),
      L(zu, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Yu = /* @__PURE__ */ K(Ku, [["__scopeId", "data-v-7135bb11"]]), Zu = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = T(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: fe(o.value)
    }, [
      (c(!0), h(G, null, te(e.node.children || [], (i, u) => (c(), F(kl, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, bn = /* @__PURE__ */ K(Zu, [["__scopeId", "data-v-d142a3f4"]]), Ju = {
  key: 0,
  class: "card-head"
}, Xu = { class: "card-title" }, Qu = {
  key: 0,
  class: "card-note"
}, ed = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", Ju, [
        g("span", Xu, w(e.node.title), 1),
        e.node.note ? (c(), h("span", Qu, w(e.node.note), 1)) : C("", !0)
      ])) : C("", !0),
      L(bn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, td = /* @__PURE__ */ K(ed, [["__scopeId", "data-v-67b72d40"]]), nd = { processes: "process", memories: "memory", replies: "reply" }, jt = (e) => (nd[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ta = [], ad = 2e3, Xe = /* @__PURE__ */ new Map(), sd = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, od = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function bt(e, { first: t = !1 } = {}) {
  t ? Ta.unshift(e) : Ta.push(e), Xe.clear();
}
function rl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const ld = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, rd = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Ge(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function id(e, t) {
  const n = [{ type: "text", text: Ge(e).replace(/\r\n/g, `
`) }];
  for (const a of Ta)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function Gt(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return cd(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function cd(e) {
  return e.split(od).map((t, n) => n % 2 ? t : t.replace(sd, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Cs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const ud = 24;
function dd(e) {
  const [t, , ...n] = e, a = Cs(t), s = n.map(Cs), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > ud) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${Gt(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${Gt(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const il = /^\s*(?:[-*+]|\d+[.)])\s+/, Ba = /^\s*(\d+)[.)]\s/, Os = (e) => e.match(/^\s*/)[0].length;
function cl(e) {
  const t = e[0].match(Ba), n = Os(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && Os(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${Gt(o.text)}${o.nested.length ? cl(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function fd(e, t) {
  const n = Ba.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (il.test(e[s]) && Ba.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Ts = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function ul(e) {
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
      n.push(`<h${r}>${Gt(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Ts(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(dd(t.slice(a, r))), a = r;
      continue;
    }
    if (il.test(s)) {
      const r = fd(t, a);
      n.push(cl(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${ul(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Ts(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${Gt(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const hd = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, md = (e) => e.type !== "text" && !hd.test(e.html);
function pd(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(ul(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : md(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function gd(e, t = { env: "" }) {
  const n = rd(e, t), a = Xe.get(n);
  if (Xe.delete(n), a && a.source === t.source && a.reads.every((l) => ld(l, t)))
    return Xe.set(n, a), a.html;
  const s = [], o = pd(id(e, { ...t, reads: s }));
  return Xe.set(n, { html: o, reads: s, source: t.source }), Xe.size > ad && Xe.delete(Xe.keys().next().value), o;
}
const Jn = /* @__PURE__ */ new WeakMap();
function vd(e) {
  if (Jn.has(e)) return Jn.get(e);
  const t = Or(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${jt(u)} show ${d}`);
    n.set(f, m), m.then((v) => {
      n.get(f) === m && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: u } : null));
    });
  }
  function l(u) {
    a.has(u) || (a.add(u), e.follow([`${jt(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const v = Number(m.slice(f.length));
        (!d.row_id || d.row_id === v) && o(u, v);
      }
    }));
  }
  function r(u, d) {
    l(u);
    const f = s(u, d);
    return !t.has(f) && !n.has(f) && o(u, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return Jn.set(e, i), i;
}
function dl() {
  const e = $e(Se, null), t = e ? vd(e) : null;
  return (n, a = {}) => gd(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const fl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, tn = (e) => String(e || "").replace(fl, (t, n, a, s) => s), yd = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), dn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, bd = /^Traceback \(most recent call last\):/m, wd = 8;
function hl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, wd).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function kd(e) {
  const t = [...e.matchAll(yd)].map((a) => a.index);
  if (dn.lastIndex = 0, !t.length || !dn.test(e)) return null;
  dn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(dn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: hl(n), tail: "" } : null;
}
function xd(e) {
  const t = bd.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: hl([o]), tail: n.slice(s).join(`
`) };
}
bt((e) => {
  const t = tn(e), n = xd(t) || kd(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const $d = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Md = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Sd = /[\w\]]\(/, _d = /^[\w$.[\]'"]+\s*=\s*[^=]/, Ed = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Ad = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Cd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Od = /[[({,]$/, Td = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Bd = /^(\t|\s{2,})\S/, Id = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Rd = /`[^`]+`/, Ld = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Nd = /[{}()[\];=<>$&|*\\@+^~%]/g, ml = /^\s*(?:[-*+]|\d+[.)])\s/, Dd = /^\s*>/, Pd = /^\s*\|/, jd = 0.6, qd = 0.4, Fd = 5, Wd = 0.03, pl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Fd && t.every((n) => Ld.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Nd) ?? []).length / e.length < Wd;
}, Xn = (e) => {
  const t = e.trim();
  return Rd.test(t) ? !1 : [$d, Md, Sd, _d, Ed, Ad, Cd, Od, Td].some((n) => n.test(t)) || /[;{}]$/.test(t) || Bd.test(e) && !ml.test(e) && !pl(e);
};
function Hd(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || ml.test(t[0]) || t.every((o) => Dd.test(o) || Pd.test(o))) return "text";
  const n = t.filter((o) => !Id.test(o.trim()));
  if (t.length === 1) return !n.length || Xn(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Xn).length, s = n.filter((o) => !Xn(o) && pl(o)).length;
  return a >= n.length * jd && s <= n.length * qd ? "code" : "text";
}
const Ia = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Ud = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", zd = `${Ia} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Vd = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Gd = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Bs = {
  js: { keywords: Ia, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Ud, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: zd, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ia, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Vd, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Gd, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Kd = {
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
function Is(e, t, n) {
  return n && e.startsWith(n, t);
}
function Yd(e, t) {
  const n = Bs[Kd[t] ?? t] || Bs.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Is(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      l("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Is(e, o, n.block[0])) {
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
function Zd(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Yd(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? Ge(l) : `<span class="tok-${a}">${Ge(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Jd(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Xd = 1500, Rs = /* @__PURE__ */ new WeakMap();
async function Qd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Jd(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Rs.get(t)), Rs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Xd)
  )));
}
typeof document < "u" && document.addEventListener("click", Qd, !0);
const ef = /\n\s*\n/, tf = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, nf = /^\s*(`{3,}|~{3,})\s*$/, af = /^\s{4,}\S/, sf = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ra = /^\s*(?:[-*+]|\d+[.)])\s/, gl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, of = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ns(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function lf(e) {
  const t = ns(e.join(`
`));
  return (of.find(([, n]) => n.test(t)) || ["text"])[0];
}
const rf = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && gl.test(t) && !Ra.test(t);
}, cf = (e, t) => Ra.test(t) || Ra.test([...e].reverse().find((n) => n.trim()) || "");
function as(e, t) {
  const n = t || lf(e), a = Zd(ns(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function uf(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && nf.test(s));
  return a < 0 ? e.length : a;
}
function df(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return as(a.map(tn), n ? n.toLowerCase() : "");
}
function ff(e) {
  const t = e.split(ef).map((l) => ({ paragraph: l, type: Hd(ns(l).split(`
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
      s(), n.push(as(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(tn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function hf(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : ff(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(tf);
    if (r) {
      const u = uf(n, l, r[2]);
      o(), a.push(df(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = rf(s) ? sf : af;
    if (!t && i.test(n[l]) && !cf(s, n[l])) {
      let u = l;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > l && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && gl.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - l + d.length >= 2) {
        o(), a.push(as([...d, ...n.slice(l, u)].map(tn), "")), l = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
bt((e, t) => hf(e, t.document));
const An = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, vl = (e) => `${e.table}:${e.id}`, Ls = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Qn = 80;
function Ns(e) {
  return e.length <= Qn ? e : `${e.slice(0, Qn + 1).replace(/\s+\S*$/, "") || e.slice(0, Qn)}…`;
}
const Ds = {
  messages: (e) => Ns(Ls(e.text)),
  comments: (e) => Ns(Ls(e.text)),
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
}, mf = (e) => (Ds[e.table] ? Ds[e.table](e) : e.title || "") || "", pt = (e) => An(e.created_at), yl = (e) => An(e.updated_at) || pt(e), pf = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, gf = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function vf(e) {
  const t = pf.exec(e);
  if (t && Ve(t[1])) return { at: t.index, length: t[0].length, table: Ve(t[1]), id: Number(t[2]), label: t[3] };
  const n = gf.exec(e), a = n && Ve(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function yf(e, t, n, a) {
  const s = rl(a, e, t), o = tn(s ? mf(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${Ge(It(e).title)} ${t}</span><span class="row-card-title">${Ge(o)}</span></a>`;
}
bt(
  (e, t) => {
    const n = vf(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: yf(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const bf = /\.(png|jpe?g|gif|webp|svg)$/i, wf = (e) => bf.test(e), kf = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, xf = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function $f(e, t) {
  const n = kf.exec(e), [, a, s, o, l, r] = n || [], i = n && Ve(a || o), u = i && rl(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${It(i).title} ${u.id} · ${Ge(r)}`, m = wf(r) ? `<img class="file-card-image" src="${d}" alt="${Ge(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Ge(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Mf(e) {
  const t = xf.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ge(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
bt(
  (e, t) => {
    if (t.inline) return null;
    const n = $f(e, t) || Mf(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Sf = /`([^`\n]+)`/g;
bt((e) => e.replace(Sf, (t, n) => `<code>${n}</code>`));
const Ps = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${ts.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
bt(
  (e, t) => e.replace(fl, (n, a, s, o) => Ps[a] ? Ps[a](s, o, t) : o)
);
const _f = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, bl = new RegExp(`\\b(${Qo}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), wl = new RegExp(`\\b(${Qo}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Ef = new RegExp(`<code>((?:${bl.source}|${wl.source}))</code>`, "gi"), Af = (e) => e.replace(Ef, "$1"), Cf = (e, t) => `<a class="row-pill" href="#" data-peek="${Ve(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Of = (e) => e.replace(wl, (t, n, a) => a.replace(/\d+/g, (s) => Cf(n.replace(/s$/i, ""), s))), Tf = (e) => Of(e).replace(
  bl,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${Ve(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
bt(
  (e, t) => t.rowNames === !1 ? e : Af(e).split(_f).map((n, a) => a % 2 ? n : Tf(n)).join("")
);
const Bf = ["innerHTML"], If = ["innerHTML"], Rf = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = dl(), a = T(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => q(St) && q(St)(...l)),
      innerHTML: a.value
    }, null, 8, Bf)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => q(St) && q(St)(...l)),
      innerHTML: a.value
    }, null, 8, If));
  }
}, et = /* @__PURE__ */ K(Rf, [["__scopeId", "data-v-d8e75741"]]), Lf = { class: "fact" }, Nf = { class: "fact-label" }, Df = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Lf, [
      g("span", Nf, w(e.label), 1),
      L(et, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Pf = /* @__PURE__ */ K(Df, [["__scopeId", "data-v-3a88ecf8"]]), jf = { class: "list" }, qf = { class: "list-label" }, Ff = {
  key: 1,
  class: "list-note"
}, Wf = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", jf, [
      (c(!0), h(G, null, te(e.items, (o, l) => (c(), F(gt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: N(() => [
          g("span", qf, w(o.label), 1),
          o.badge ? (c(), F(ll, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : C("", !0),
          o.note ? (c(), h("span", Ff, w(o.note), 1)) : C("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Hf = /* @__PURE__ */ K(Wf, [["__scopeId", "data-v-ebe2ae0a"]]), Uf = { class: "table" }, zf = {
  key: 0,
  class: "table-row empty"
}, Vf = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", Uf, [
      g("div", {
        class: "table-row head",
        style: fe(s.value)
      }, [
        (c(!0), h(G, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, w(r), 1))), 128))
      ], 4),
      (c(!0), h(G, null, te(e.rows, (r, i) => (c(), F(gt(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: fe(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: N(() => [
          (c(!0), h(G, null, te(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, w(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", zf, w(e.empty), 1)) : C("", !0)
    ]));
  }
}, Gf = /* @__PURE__ */ K(Vf, [["__scopeId", "data-v-9326a52e"]]), Kf = { class: "stat-value" }, Yf = { class: "stat-label" }, Zf = {
  key: 0,
  class: "stat-note"
}, Jf = {
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
    return (a, s) => (c(), F(gt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: N(() => [
        g("span", Kf, w(e.value), 1),
        g("span", Yf, w(e.label), 1),
        e.note ? (c(), h("span", Zf, w(e.note), 1)) : C("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Xf = /* @__PURE__ */ K(Jf, [["__scopeId", "data-v-ad0db6d6"]]), Qf = { class: "code" }, eh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), F(Bt, {
      value: e.node.type
    }, {
      stack: N(() => [
        L(bn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: N(() => [
        L(bn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: N(() => [
        L(bn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: N(() => [
        L(td, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: N(() => [
        g("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
      divider: N(() => [...l[2] || (l[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: N(() => [
        L(Xf, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: N(() => [
        L(Yu, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: N(() => [
        L(Gf, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: N(() => [
        L(Hf, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: N(() => [
        L(et, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: N(() => [
        L(Pf, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: N(() => [
        L(ll, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: N(() => [
        g("pre", Qf, [
          g("code", null, w(e.node.text), 1)
        ])
      ]),
      file: N(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), kl = /* @__PURE__ */ K(eh, [["__scopeId", "data-v-cbdcf540"]]), th = { class: "dashboard" }, nh = { class: "trail" }, ah = ["onClick"], sh = {
  key: 0,
  class: "gone",
  role: "status"
}, oh = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = O(!!n.page && !s(n.page)), l = O(n.page && !o.value ? [n.page] : []), r = T(() => l.value.at(-1) || n.document.start), i = T(() => (n.document.pages || {})[r.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (m, v) => (c(), h("div", th, [
      e.document.broken ? (c(), F(zt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: N(() => [
          ne(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), F(zt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: N(() => [
          ne(w(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(G, { key: 2 }, [
        g("nav", nh, [
          g("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: v[0] || (v[0] = (k) => f(0))
          }, w(u(e.document.start)), 3),
          (c(!0), h(G, null, te(l.value, (k, A) => (c(), h(G, {
            key: `${A}-${k}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: Z(["step", { current: A === l.value.length - 1 }]),
              onClick: (x) => f(A + 1)
            }, w(u(k)), 11, ah)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", sh, "What you opened is no longer in this dashboard. Here is its start page.")) : C("", !0),
        L(Tt, {
          name: "page",
          mode: "out-in"
        }, {
          default: N(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              L(kl, {
                node: i.value.view,
                onOpen: d,
                onFile: v[1] || (v[1] = (k) => a("file", k))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : C("", !0)
    ]));
  }
}, lh = /* @__PURE__ */ K(oh, [["__scopeId", "data-v-fbe83734"]]), Je = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Le = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Re = { across: 48, down: 110, margin: 32, labelSpace: 14 }, rh = 6;
function ss(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const ih = (e) => {
  const t = ss(e, Je.lineChars), n = Math.max(Je.minWidth, Math.max(...t.map((a) => a.length)) * Je.charWidth + Je.padX * 2);
  return { name: e, lines: t, line: Je.line, padY: Je.padY, width: n, height: t.length * Je.line + Je.padY * 2 };
};
function ch(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function uh(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function dh(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), u = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, v) => m + v, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => u(d) - u(f));
  };
  for (let l = 0; l < rh; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function fh(e, t) {
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
function hh(e) {
  const t = [...new Set(e.flatMap(([P, _]) => [P, _]))], n = new Set(e.map(([, P]) => P)), a = t.filter((P) => !n.has(P)), s = ch(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((P, _) => !s.has(_)), l = uh(t, o), r = dh(t, o, l), i = new Map(t.map((P) => [P, ih(P)])), u = r.map((P) => P.reduce((_, S) => _ + i.get(S).width, 0) + Re.across * (P.length - 1)), d = Math.max(...u) + Re.margin * 2, f = ph(e, l, r.length), m = /* @__PURE__ */ new Map();
  let v = Re.margin;
  r.forEach((P, _) => {
    let S = (d - u[_]) / 2;
    const $ = Math.max(...P.map((M) => i.get(M).height));
    P.forEach((M) => {
      const y = i.get(M);
      m.set(M, { ...y, x: S, y: v + ($ - y.height) / 2 }), S += y.width + Re.across;
    }), v += $ + (f[_] ?? Re.down);
  });
  const k = e.map(([P, _, S], $) => ({ from: P, to: _, label: S || "", back: s.has($) || l.get(_) <= l.get(P) }));
  fh(k, m);
  const A = k.map((P) => gh(P, m.get(P.from), m.get(P.to))), x = [...m.values()], I = wh(A, x), z = Math.max(v - Re.down, ...I.filter((P) => P.label).map((P) => P.label.y + P.label.height));
  return { width: Math.max(d - Re.margin, ...I.filter((P) => P.label).map((P) => P.label.x + P.label.width)) + Re.margin, height: z + Re.margin, nodes: x, arrows: I };
}
const mh = (e) => e ? ss(e, Le.lineChars).length * Le.line + Le.pad * 2 : 0;
function ph(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Re.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += mh(l) + Re.labelSpace);
  }), a.map((s) => Math.max(Re.down, s));
}
function gh(e, t, n) {
  const a = e.label ? ss(e.label, Le.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Le.charWidth + Le.pad * 2 : 0, o = a.length * Le.line + (a.length ? Le.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const vh = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, yh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], bh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Le.line);
function wh(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = vh(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = bh.flatMap((i) => yh.map((u) => s(u, i))).find((i) => !n.some((u) => js(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => js(r, i)); ) r.y += Le.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Le.line, pad: Le.pad } };
  });
}
const js = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, kh = { class: "flowchart-tools" }, xh = ["width", "height", "viewBox", "aria-label"], $h = ["d"], Mh = ["x", "y", "width", "height"], Sh = ["x", "y"], _h = ["x", "dy"], Eh = {
  key: 0,
  class: "flowchart-label"
}, Ah = ["x", "y", "width", "height"], Ch = ["x", "y"], Oh = ["x", "dy"], Th = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => hh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = O(null), r = O({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var I;
      const A = (I = l.value) == null ? void 0 : I.getBoundingClientRect();
      if (!(A != null && A.width)) return;
      const x = Math.min(A.width / s.value.width, A.height / s.value.height, 1.5);
      r.value = { zoom: x, x: (A.width - s.value.width * x) / 2, y: (A.height - s.value.height * x) / 2 };
    }
    function d(A, x, I) {
      const { zoom: z, x: ee, y: P } = r.value, _ = Math.min(o.most, Math.max(o.least, z * A));
      r.value = { zoom: _, x: x - (x - ee) * _ / z, y: I - (I - P) * _ / z };
    }
    function f(A) {
      const x = l.value.getBoundingClientRect();
      d(A, x.width / 2, x.height / 2);
    }
    function m(A) {
      const x = l.value.getBoundingClientRect();
      A.ctrlKey || A.metaKey ? d(A.deltaY < 0 ? o.step : 1 / o.step, A.clientX - x.left, A.clientY - x.top) : r.value = { ...r.value, x: r.value.x - A.deltaX, y: r.value.y - A.deltaY };
    }
    function v(A) {
      var x, I, z;
      A.preventDefault(), (x = window.getSelection()) == null || x.removeAllRanges(), i = { x: A.clientX - r.value.x, y: A.clientY - r.value.y }, (z = (I = l.value).setPointerCapture) == null || z.call(I, A.pointerId);
    }
    function k(A) {
      i && (r.value = { ...r.value, x: A.clientX - i.x, y: A.clientY - i.y });
    }
    return Ce(u), (A, x) => (c(), F(Zo, {
      title: e.title,
      large: "",
      onClose: x[4] || (x[4] = (I) => a("close"))
    }, {
      default: N(() => [
        g("div", kh, [
          L(ue, {
            small: "",
            onClick: x[0] || (x[0] = (I) => f(o.step))
          }, {
            default: N(() => [...x[5] || (x[5] = [
              ne("Zoom in", -1)
            ])]),
            _: 1
          }),
          L(ue, {
            small: "",
            onClick: x[1] || (x[1] = (I) => f(1 / o.step))
          }, {
            default: N(() => [...x[6] || (x[6] = [
              ne("Zoom out", -1)
            ])]),
            _: 1
          }),
          L(ue, {
            small: "",
            onClick: u
          }, {
            default: N(() => [...x[7] || (x[7] = [
              ne("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: be(m, ["prevent"]),
          onPointerdown: v,
          onPointermove: k,
          onPointerup: x[2] || (x[2] = (I) => ks(i) ? i.value = null : i = null),
          onPointercancel: x[3] || (x[3] = (I) => ks(i) ? i.value = null : i = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: fe({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            x[8] || (x[8] = g("defs", null, [
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
            (c(!0), h(G, null, te(s.value.arrows, (I, z) => (c(), h("path", {
              key: `arrow-${z}`,
              class: "flowchart-arrow",
              d: I.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, $h))), 128)),
            (c(!0), h(G, null, te(s.value.nodes, (I) => (c(), h("g", {
              key: I.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: I.x,
                y: I.y,
                width: I.width,
                height: I.height,
                rx: "8"
              }, null, 8, Mh),
              g("text", {
                x: I.x + I.width / 2,
                y: I.y + I.padY + I.line / 2
              }, [
                (c(!0), h(G, null, te(I.lines, (z, ee) => (c(), h("tspan", {
                  key: ee,
                  x: I.x + I.width / 2,
                  dy: ee ? I.line : 0
                }, w(z), 9, _h))), 128))
              ], 8, Sh)
            ]))), 128)),
            (c(!0), h(G, null, te(s.value.arrows, (I, z) => (c(), h(G, {
              key: `label-${z}`
            }, [
              I.label ? (c(), h("g", Eh, [
                g("rect", {
                  x: I.label.x,
                  y: I.label.y,
                  width: I.label.width,
                  height: I.label.height,
                  rx: "4"
                }, null, 8, Ah),
                g("text", {
                  x: I.label.x + I.label.width / 2,
                  y: I.label.y + I.label.pad + I.label.line / 2
                }, [
                  (c(!0), h(G, null, te(I.label.lines, (ee, P) => (c(), h("tspan", {
                    key: P,
                    x: I.label.x + I.label.width / 2,
                    dy: P ? I.label.line : 0
                  }, w(ee), 9, Oh))), 128))
                ], 8, Ch)
              ])) : C("", !0)
            ], 64))), 128))
          ], 12, xh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Bh = /* @__PURE__ */ K(Th, [["__scopeId", "data-v-51d24cfe"]]), qs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Fs = {
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
  agent: qs,
  worker: qs,
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
}, Ih = ["innerHTML"], Rh = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => Fs[t.name] || Fs.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Ih));
  }
}, at = /* @__PURE__ */ K(Rh, [["__scopeId", "data-v-beb5935c"]]), Lh = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      L(at, { name: "fold" })
    ], 2));
  }
}, Ct = /* @__PURE__ */ K(Lh, [["__scopeId", "data-v-d03899bb"]]), Nh = ["data-tip", "aria-label"], Dh = {
  key: 0,
  class: "mact-word"
}, Ph = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      L(at, { name: "open" }),
      e.open ? (c(), h("span", Dh, w(e.label), 1)) : C("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, Nh));
  }
}, xl = /* @__PURE__ */ K(Ph, [["__scopeId", "data-v-3b292e09"]]), $l = 120, wn = 280, Ml = 160, jh = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, qh = ["leaving", "resizing", "entering"];
function La(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Fh(e) {
  const t = qh.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = La(e);
  return e.classList.add(...t), n;
}
function Sl(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = O(t()), s = O("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const v = Fh(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${wn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${wn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, v);
  }
  function u(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const k = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, i(f, La(f)));
    });
    return k.observe(m), k;
  }
  async function d(f) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || jh()) {
      a.value = f;
      return;
    }
    const k = La(m);
    if (l(m, k), s.value = "leaving", await n($l), v !== o) return;
    a.value = f, s.value = "resizing", await st(), i(m, k);
    const A = u(m);
    await n(wn), A == null || A.disconnect(), v === o && (r(m), s.value = "entering", await n(Ml), v === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), vt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Wh = { class: "growing-card-top" }, Hh = ["aria-expanded"], Uh = { class: "growing-card-avatar" }, zh = { class: "growing-card-title" }, Vh = { class: "growing-card-more" }, Gh = { class: "growing-card-body" }, Kh = {
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
    const n = e, a = t, s = O(!1), o = O(null), { folded: l, phase: r } = Sl(o, () => !s.value), i = T(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = T(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", q(r), { open: !q(l), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", Wh, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", Uh, [
            e.bad ? (c(), F(at, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(G, { key: 1 }, [
              ne(w(i.value), 1)
            ], 64)) : (c(), F(me, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", zh, w(e.title), 1),
          L(Ct, { open: s.value }, null, 8, ["open"])
        ], 8, Hh),
        e.action ? (c(), F(xl, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : C("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          L(me, {
            name: "bubble",
            size: 13
          })
        ])) : C("", !0)
      ]),
      g("div", Vh, [
        g("div", Gh, [
          (c(!0), h(G, null, te(u.value, (m, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, w(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Yh = /* @__PURE__ */ K(Kh, [["__scopeId", "data-v-f2b4930d"]]), Zh = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, Jh = {
  key: 0,
  class: "message-links-many"
}, Xh = ["aria-expanded"], Qh = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, e1 = ["onClick"], t1 = { class: "row-pill message-links-chip" }, n1 = { class: "message-links-title" }, ea = 3, Ws = "task", a1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = $e(Se, null), a = T(() => t.links.length), s = T(() => t.links.every((m) => m.model === Ws) ? "tasks" : "items"), o = T(() => `Linked: ${t.links.map((m) => `${m.model} ${m.id}`).join(" ")}`), l = O(!1), r = O({}), i = O(null);
    Oo(i, () => l.value = !1);
    async function u() {
      const m = t.links.filter((k) => k.model === Ws && !(k.id in r.value)), v = await Promise.all(m.map((k) => n.read(`task show ${k.id}`)));
      r.value = { ...r.value, ...Object.fromEntries(v.filter((k) => k.ok).map((k) => [k.value.id, k.value.title])) };
    }
    function d() {
      l.value = !l.value, l.value && u();
    }
    function f(m) {
      l.value = !1, De(`${Ve(m.model)}:${m.id}`);
    }
    return (m, v) => (c(), h("div", {
      ref_key: "line",
      ref: i,
      class: Z(["message-links", { many: a.value > ea, three: a.value === ea, open: l.value }]),
      "data-message-links": ""
    }, [
      L(at, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", Zh, [
        L(et, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      a.value >= ea ? (c(), h("span", Jh, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: d
        }, [
          ne(w(a.value) + " linked " + w(s.value) + " ", 1),
          L(Ct, { open: l.value }, null, 8, ["open"])
        ], 8, Xh)
      ])) : C("", !0),
      l.value ? (c(), h("div", Qh, [
        (c(!0), h(G, null, te(e.links, (k) => (c(), h("button", {
          key: `${k.model}:${k.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (A) => f(k)
        }, [
          g("span", t1, w(k.model) + " " + w(k.id), 1),
          g("span", n1, w(r.value[k.id]), 1)
        ], 8, e1))), 128))
      ])) : C("", !0)
    ], 2));
  }
}, s1 = /* @__PURE__ */ K(a1, [["__scopeId", "data-v-24868afd"]]), o1 = ["title", "aria-label"], l1 = {
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
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = T(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", l1, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", r1)) : C("", !0)
      ]))
    ], 10, o1));
  }
}, c1 = /* @__PURE__ */ K(i1, [["__scopeId", "data-v-6dc92808"]]);
function u1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function _l(e, t = Date.now()) {
  const n = u1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const d1 = 36e5;
function pk(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / d1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function El(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Hs(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ta = (e) => String(e).padStart(2, "0");
function f1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ta(t % 60)}s` : `${Math.floor(t / 3600)}h ${ta(Math.floor(t % 3600 / 60))}m ${ta(t % 60)}s`;
}
const h1 = "img,pre,table";
function m1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function p1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function g1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(h1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = m1(p1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function v1(e, t) {
  let n = null;
  const a = () => e.value && g1(e.value);
  Ce(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Te(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const y1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function b1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const w1 = ["data-incoming", "data-ref"], k1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], x1 = { class: "message-body" }, $1 = ["title"], M1 = ["innerHTML"], S1 = ["title"], _1 = ["innerHTML"], E1 = {
  class: "message-faces",
  "data-message-faces": ""
}, A1 = ["title", "data-face", "onClick"], C1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, O1 = ["title", "data-reaction", "onClick"], T1 = {
  key: 0,
  class: "message-reaction-count"
}, B1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, I1 = ["href", "title"], R1 = ["src", "alt"], L1 = ["href"], N1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, D1 = ["data-sent-worker", "title", "onClick"], P1 = { class: "message-foot" }, j1 = { class: "message-time" }, q1 = {
  class: "message-id",
  "data-message-id": ""
}, F1 = 140, W1 = 2, H1 = 1500, U1 = "An earlier message", z1 = "about", V1 = "sent_to", G1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var H;
    const n = e, a = t, s = O(!1), o = O(null), l = T(() => ["user", "comment"].includes(n.message.type)), r = T(() => {
      const [X, J] = (n.message.commented_row || ":").split(":"), Y = Ve(X);
      return Y ? { ref: `${Y}:${J}`, label: `${It(Y).title.toLowerCase()} ${J}` } : null;
    }), i = T(() => n.message.worker_id ?? null), u = O(!1), d = T(() => i.value !== null && ((n.message.text ?? "").length > F1 || (n.message.text ?? "").split(`
`).filter((X) => X.trim()).length > W1)), f = T(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var X;
      await ((X = navigator.clipboard) == null ? void 0 : X.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, H1);
    }
    const v = dl(), k = T(() => v(n.message.text ?? "")), A = T(() => JSON.parse(n.message.flowchart_edges || "[]")), x = O(!1), I = T(() => v(n.quote || U1));
    function z() {
      const X = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      X ? X.scrollIntoView({ block: "center", behavior: "smooth" }) : De(`messages:${n.message.parent_id}`);
    }
    v1(o, () => `${n.message.text} ${n.quote}`);
    const ee = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, P = (X) => `/api/files/message/${n.message.id}/${encodeURIComponent(X)}`, _ = T(() => JSON.parse(n.message.captions || "{}")), S = T(() => (n.message.files ?? []).map((X) => ({ name: X, address: P(X), isImage: ee.test(X), title: _.value[X] || X }))), $ = T(() => El(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), M = $e(Se, null), y = O([]), E = O([]);
    async function b() {
      if (!l.value || !(M != null && M.read) || n.message.local) return;
      const X = await M.read(`link list --source message:${n.message.id}`);
      if (!X.ok) return;
      const J = X.value.rows ?? X.value ?? [];
      y.value = J.filter((Y) => Y.link_type === z1).map((Y) => ({ model: Y.target_model, id: Y.target_id })), E.value = J.filter((Y) => Y.link_type === V1).map((Y) => Y.target_id);
    }
    b(), (H = M == null ? void 0 : M.follow) == null || H.call(M, ["link.*"], b);
    const p = O(!1), R = T(() => b1(n.message.reactions));
    function B(X) {
      p.value = !1, a("react", n.message, X);
    }
    return (X, J) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      L(Yh, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: J[0] || (J[0] = (Y) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, w1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", x1, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: J[6] || (J[6] = (...Y) => q(St) && q(St)(...Y))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: J[1] || (J[1] = be((Y) => q(De)(r.value.ref), ["stop"]))
          }, [
            L(me, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + w(r.value.label), 1)
          ], 8, $1)) : C("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(z, ["stop"]),
            innerHTML: I.value
          }, null, 8, M1)) : C("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: J[2] || (J[2] = be((Y) => q(De)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, S1)) : C("", !0),
          g("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: k.value
          }, null, 10, _1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: J[3] || (J[3] = be((Y) => u.value = !u.value, ["stop"]))
          }, w(u.value ? "Show less" : "Show more"), 1)) : C("", !0),
          A.value.length ? (c(), h(G, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[4] || (J[4] = (Y) => x.value = !0)
            }, "Open the flowchart"),
            x.value ? (c(), F(Bh, {
              key: 0,
              title: e.message.text,
              edges: A.value,
              onClose: J[5] || (J[5] = (Y) => x.value = !1)
            }, null, 8, ["title", "edges"])) : C("", !0)
          ], 64)) : C("", !0)
        ], 2),
        g("div", {
          class: Z(["message-tools", { picking: p.value }]),
          "data-message-tools": ""
        }, [
          p.value ? (c(), h(G, { key: 0 }, [
            g("div", E1, [
              (c(!0), h(G, null, te(q(y1), (Y) => (c(), h("button", {
                key: Y,
                type: "button",
                class: "message-face",
                title: `React ${Y}`,
                "data-face": Y,
                onClick: (ie) => B(Y)
              }, w(Y), 9, A1))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[7] || (J[7] = (Y) => p.value = !1)
            }, [
              L(me, {
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
              onClick: J[8] || (J[8] = (Y) => p.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: J[9] || (J[9] = (Y) => a("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, w(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: J[10] || (J[10] = (Y) => a("delete", e.message))
            }, "Delete")) : C("", !0)
          ], 64))
        ], 2)
      ]),
      R.value.length ? (c(), h("div", C1, [
        (c(!0), h(G, null, te(R.value, (Y) => (c(), h("button", {
          key: Y.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: Y.mine }]),
          title: Y.title,
          "data-reaction": Y.emoji,
          onClick: (ie) => a("react", e.message, Y.emoji)
        }, [
          ne(w(Y.emoji) + " ", 1),
          Y.count > 1 ? (c(), h("span", T1, w(Y.count), 1)) : C("", !0)
        ], 10, O1))), 128))
      ])) : C("", !0),
      S.value.length ? (c(), h("div", B1, [
        (c(!0), h(G, null, te(S.value, (Y) => (c(), h(G, {
          key: Y.name
        }, [
          Y.isImage ? (c(), h("a", {
            key: 0,
            href: Y.address,
            target: "_blank",
            class: "message-image",
            title: Y.title
          }, [
            g("img", {
              src: Y.address,
              alt: Y.name,
              "data-figure-picture": ""
            }, null, 8, R1)
          ], 8, I1)) : (c(), h("a", {
            key: 1,
            href: Y.address,
            target: "_blank",
            class: "message-file"
          }, w(Y.name), 9, L1))
        ], 64))), 128))
      ])) : C("", !0),
      E.value.length ? (c(), h("div", N1, [
        L(me, {
          name: "send",
          size: 12
        }),
        (c(!0), h(G, null, te(E.value, (Y) => (c(), h("button", {
          key: Y,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Y,
          title: `Open worker ${Y}`,
          onClick: be((ie) => q(De)(`agents:${Y}`), ["stop"])
        }, "Also sent to worker " + w(Y), 9, D1))), 128))
      ])) : C("", !0),
      g("div", P1, [
        g("time", j1, w($.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(G, { key: 0 }, [
          J[11] || (J[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", q1, "message " + w(e.message.id), 1)
        ], 64)) : C("", !0),
        l.value ? (c(), F(c1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : C("", !0)
      ]),
      y.value.length ? (c(), F(s1, {
        key: 3,
        links: y.value
      }, null, 8, ["links"])) : C("", !0)
    ], 8, k1));
  }
}, gk = /* @__PURE__ */ K(G1, [["__scopeId", "data-v-2b3e68eb"]]), K1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = Tr("SkeletonParts", !0);
      return c(!0), h(G, null, te(e.parts, (i, u) => (c(), h(G, { key: u }, [
        (c(!0), h(G, null, te(i.count, (d) => (c(), F(Bt, {
          key: d,
          value: i.shape
        }, {
          line: N(() => [
            g("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: fe({ width: i.width, height: `${t[i.size]}px` })
            }, null, 4)
          ]),
          circle: N(() => [
            g("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: fe({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 4)
          ]),
          block: N(() => [
            g("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: fe({ width: i.width, height: `${i.height}px` })
            }, null, 4)
          ]),
          grow: N(() => [...l[0] || (l[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: N(() => [
            g("div", {
              class: "skeleton-row",
              style: fe(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: N(() => [
            g("div", {
              class: "skeleton-stack",
              style: fe(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: N(() => [
            g("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: fe(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: N(() => [
            g("div", {
              class: "skeleton-grid",
              style: fe(s(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Y1 = /* @__PURE__ */ K(K1, [["__scopeId", "data-v-576c95e1"]]), Z1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, J1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", Z1, [
      L(Y1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, os = /* @__PURE__ */ K(J1, [["__scopeId", "data-v-52f66b64"]]), Cn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], na = 200, Al = (e) => {
  var t;
  return ((t = Cn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Cn[0].key;
}, vk = (e) => {
  var t;
  return ((t = Cn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, X1 = ["aria-label"], Q1 = 300, Us = 400, em = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: na } },
  setup(e) {
    const t = e, n = T(() => Al(t.value)), a = T(() => n.value < na ? [1, 0.25, 0.25] : n.value === na ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= Us, high: n.value >= Q1 && n.value < Us }]),
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
    ], 10, X1));
  }
}, yk = /* @__PURE__ */ K(em, [["__scopeId", "data-v-b10e610f"]]), zs = (e) => [...new Set(e.agents.map((t) => t.name))], bk = (e) => zs(e).length === 1 ? `Worker: ${zs(e)[0]}` : "Delegated", tm = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Vs = (e) => tm[e.card.state] || "idle", nm = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Gs = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Ks = (e, t) => Gs[Vs(e)] - Gs[Vs(t)], Ys = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, wk = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Ks(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || nm(a, s)) : [...e].sort((a, s) => Ks(a, s) || (Ys[t] || Ys.state)(a, s)), am = { class: "list-row" }, sm = {
  key: 0,
  class: "list-row-type"
}, om = { class: "list-row-main" }, lm = {
  key: 0,
  class: "list-row-title"
}, rm = { class: "list-row-body" }, im = {
  key: 1,
  class: "list-row-end"
}, cm = {
  key: 1,
  class: "list-row-text"
}, um = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", am, [
      e.type ? (c(), h("span", sm, w(e.type), 1)) : C("", !0),
      g("div", om, [
        e.title ? (c(), h("span", lm, w(e.title), 1)) : C("", !0),
        g("div", rm, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", im, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (c(), h("span", cm, w(e.text), 1)) : C("", !0)
    ]));
  }
}, kk = /* @__PURE__ */ K(um, [["__scopeId", "data-v-dfc8c3a7"]]), dm = {
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
}, fm = { claude: "Claude Code", codex: "Codex" }, hm = ["aria-expanded"], mm = { class: "drop-label" }, pm = ["value"], gm = {
  key: 1,
  class: "drop-lead"
}, vm = { class: "drop-item-text" }, ym = {
  key: 2,
  class: "drop-note"
}, bm = {
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
    const n = e, a = t, s = O(!1), o = O(null), l = O(""), r = T(() => {
      const u = l.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function i(u) {
      s.value = !1, a("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), F(me, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : C("", !0),
        g("span", mm, w(e.label), 1),
        L(me, {
          name: "down",
          size: 11
        })
      ], 10, hm),
      s.value ? (c(), F(Pn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: N(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, pm)) : C("", !0),
          (c(!0), h(G, null, te(r.value, (f) => (c(), F(mt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: N(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : C("", !0),
              f.lead ? (c(), h("span", gm, w(f.lead), 1)) : C("", !0),
              g("span", vm, w(f.label), 1),
              f.note ? (c(), h("span", ym, w(f.note), 1)) : C("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? C("", !0) : (c(), h("p", bm, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, km = /* @__PURE__ */ K(wm, [["__scopeId", "data-v-29dfcce5"]]), xk = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => [
      ...dm[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = T(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), F(km, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${q(fm)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, xm = ["aria-label"], $m = { class: "head" }, Mm = { class: "names" }, Sm = { class: "body" }, _m = {
  key: 0,
  class: "foot"
}, Em = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Go(a, n), r = Ko(s);
    return (i, u) => (c(), F(Ga, { to: "body" }, [
      L(Tt, {
        name: "side",
        appear: "",
        onAfterLeave: q(l)
      }, {
        default: N(() => [
          q(s) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: q(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = be((...d) => q(o) && q(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(G, { key: 0 }, [
                g("header", $m, [
                  g("div", Mm, [
                    g("h2", null, w(e.title), 1),
                    e.abstract ? (c(), F(et, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : C("", !0)
                  ]),
                  ce(i.$slots, "actions", {}, void 0, !0),
                  L(Qa, {
                    title: e.closeLabel,
                    onClick: q(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", Sm, [
                  ce(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", _m, [
                  ce(i.$slots, "foot", {}, void 0, !0)
                ])) : C("", !0)
              ], 64)) : ce(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, xm)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, $k = /* @__PURE__ */ K(Em, [["__scopeId", "data-v-c9a3f43a"]]), Am = {
  key: 1,
  class: "text-field-label"
}, Cm = {
  key: 2,
  class: "text-field-end"
}, Om = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ma({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = $a(e, "modelValue"), a = Dn(), s = "onUpdate:modelValue" in (((d = Br()) == null ? void 0 : d.vnode.props) || {}), o = T(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = T(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = T(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = O(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, q(a).class]),
      style: fe(q(a).style)
    }, [
      e.icon ? (c(), F(me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : C("", !0),
      e.label ? (c(), h("span", Am, w(e.label), 1)) : C("", !0),
      Ye(g("input", Ke({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [q(Ca), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Cm, [
        ce(f.$slots, "end", {}, void 0, !0)
      ])) : C("", !0)
    ], 6)) : Ye((c(), h("input", Ke({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [q(Ca), o.value]
    ]);
  }
}), Mk = /* @__PURE__ */ K(Om, [["__scopeId", "data-v-d9c38ca8"]]);
async function Tm(e, t, n) {
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
const Zs = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function Sk(e) {
  const t = ot().sources.find((n) => n.key === e);
  return t ? Na(t.read, t.events) : Na("", []);
}
function Na(e, t, { incremental: n = !1 } = {}) {
  var _;
  const a = Number(((_ = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : _[1]) ?? 50), s = ot(), o = O([]), l = O(null), r = O(""), i = O(!1), u = performance.now(), d = O(!1), f = O(""), m = O(null);
  async function v(S) {
    const $ = x, M = await s.read(`${e} --before-id ${S + 1} --limit 1`);
    if ($ !== x) return;
    if (!M.ok) return z();
    const y = M.value.rows.find((E) => E.id === S);
    o.value = y ? o.value.map((E) => E.id === S ? y : E) : o.value.filter((E) => E.id !== S);
  }
  async function k(S) {
    if (n && String((S == null ? void 0 : S.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((p) => p.id !== S.row_id));
    if (n && (S != null && S.row_id) && !String(S.event ?? "").endsWith(".create") && o.value.some((p) => p.id === S.row_id)) return v(S.row_id);
    if (!(n && o.value.length && String((S == null ? void 0 : S.event) ?? "").endsWith(".create"))) return z();
    const M = Math.max(...o.value.map((p) => p.id)), y = x, E = await s.read(`${e} --after-id ${M}`);
    if (y !== x) return;
    if (!E.ok) return z();
    const b = new Set(o.value.map((p) => p.id));
    o.value = [...E.value.rows.filter((p) => !b.has(p.id)), ...o.value];
  }
  async function A() {
    if (!d.value || !o.value.length) return !1;
    const S = x, $ = Math.min(...o.value.map((E) => E.id)), M = await s.read(`${e} --before-id ${$}`);
    if (S !== x) return !1;
    if (!M.ok || !M.value.rows.length) return d.value = !1;
    d.value = Zs(M.value, a);
    const y = new Set(o.value.map((E) => E.id));
    return o.value = [...o.value, ...M.value.rows.filter((E) => !y.has(E.id))], !0;
  }
  let x = 0;
  async function I(S) {
    const $ = ++x, M = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if ($ !== x) return;
    const y = M.ok ? s.shared ? [M.value] : M.value.rows : [];
    o.value = S(y), l.value = M.ok ? M.value : null;
    const E = y.length ? Math.min(...y.map((b) => b.id)) : 0;
    M.ok && !o.value.some((b) => b.id < E) && (d.value = !s.shared && Zs(M.value, a)), r.value = M.ok ? "" : M.error, Za(u, () => i.value = !0);
  }
  function z() {
    return I((S) => {
      if (!n || !S.length) return S;
      const $ = Math.min(...S.map((y) => y.id)), M = Math.max(...S.map((y) => y.id));
      return [...o.value.filter((y) => y.id > M), ...S, ...o.value.filter((y) => y.id < $)];
    });
  }
  const ee = () => I((S) => S);
  async function P(S, $ = null) {
    const M = await Tm($ && { target: o, fields: { value: $(o.value) } }, S, s.run);
    return f.value = M.ok ? "" : M.error, m.value = M.ok ? M.value : null, await z(), M;
  }
  return e && (s.follow(t, k), z()), { rows: o, listing: l, failure: r, loaded: i, more: d, load: z, loadLatest: ee, older: A, act: P, actionFailure: f, answer: m, context: s };
}
const Bm = { class: "title" }, Im = { class: "state" }, Rm = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Na(t.line, t.events);
    return (o, l) => (c(), F(Au, {
      rows: q(n),
      failure: q(a),
      loaded: q(s),
      empty: e.empty
    }, {
      default: N(({ row: r }) => [
        g("span", Bm, w(r.title), 1),
        g("span", Im, w(q(Fo)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, _k = /* @__PURE__ */ K(Rm, [["__scopeId", "data-v-9191a6f0"]]);
function Lm(e = 1e3, t = null) {
  const n = O(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Te(() => clearInterval(a)), n;
}
const aa = O(Date.now() / 1e3);
let Js = 0, fn = 0;
function Cl() {
  return fn || (aa.value = Date.now() / 1e3, Js = setInterval(() => aa.value = Date.now() / 1e3, 1e3)), fn += 1, _o() && Eo(() => {
    fn -= 1, fn || clearInterval(Js);
  }), aa;
}
const Nm = 200, Dm = $l + wn + Ml + Nm;
function Lt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Pm(e, t, n) {
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
      var l, r, i, u;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: Lt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function jm(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Pm(o, l, n.value)), performance.now() - l < Dm) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
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
}, Zm = {
  key: 6,
  class: "settled"
}, Jm = {
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
    const t = e, n = Dn(), a = ["onClick", "onAct"], s = T(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = O(!1), l = T(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = T(() => t.open !== void 0), i = T(() => r.value || l.value), u = T(() => r.value ? t.open : o.value), d = T(() => r.value ? !t.open : l.value && !o.value), f = T(() => !!(t.mark.action && n.onAct)), m = T(() => i.value || f.value || !!n.onClick), v = O(null), k = O(null), { folded: A, phase: x } = Sl(v, () => d.value);
    jm(v, d, x, $e(Se, null));
    function I(ie) {
      var ve, Oe;
      if (!(ie.target !== v.value && !k.value.contains(ie.target))) {
        if (r.value) return (ve = n.onClick) == null ? void 0 : ve.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Oe = n.onAct || n.onClick) == null || Oe(ie);
      }
    }
    const z = (ie) => n.onAct(ie), ee = ["failed", "unfinished"], P = T(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? ee.includes(t.mark.state) ? "danger" : "good" : ""), _ = T(() => t.mark.color ? t.mark.color : P.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : P.value ? `var(--tone-${P.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), S = T(() => _.value || "var(--tone-work)"), $ = T(() => !t.mark.ending && !t.mark.ended && P.value !== "stopped"), M = Cl(), y = T(
      () => t.mark.began_at && $.value && !t.mark.figure && !t.mark.counting ? f1(M.value - t.mark.began_at) : ""
    ), E = T(() => {
      const { started: ie, ended: ve } = t.mark;
      return ie ? ve ? `ran ${Hs(ve - ie, !0)}` : Hs(M.value - ie, !0) : y.value;
    }), b = ["bad", "danger", "warn"], p = T(() => b.includes(P.value) || t.mark.asks ? "attention" : $.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), R = ["bad", "danger"], B = T(() => R.includes(P.value)), H = T(() => p.value === "process" ? "running" : B.value ? "cross" : P.value === "stopped" ? "stopped" : P.value === "good" ? "tick" : ""), X = T(
      () => !!(t.mark.figure || E.value || t.mark.docked || t.mark.stopping || H.value || t.mark.settled || t.mark.news)
    ), J = T(() => [t.mark.title, t.mark.time ? El(t.mark.time) : ""].filter(Boolean).join(" · ")), Y = T(() => ({
      ..._.value ? { "--mark": _.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, ve) => (c(), h("div", Ke(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        q(x),
        {
          open: u.value,
          folding: r.value && d.value,
          live: m.value,
          failed: B.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: _.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: Y.value,
      title: J.value,
      "data-figure-mark": e.mark.key,
      "data-folded": q(A) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: I
    }), [
      (c(), F(gt(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: k,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: N(() => [
          e.mark.markIcon ? (c(), F(at, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), F(me, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Fm, w(e.mark.worker), 1)) : C("", !0),
          g("span", Wm, [
            L(et, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Hm, w(e.mark.name), 1)) : C("", !0),
            i.value ? (c(), F(Ct, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          X.value ? (c(), h("span", Um, [
            e.mark.figure ? (c(), h("span", zm, w(e.mark.figure), 1)) : C("", !0),
            E.value ? (c(), h("span", Vm, w(E.value), 1)) : C("", !0),
            e.mark.stopping ? (c(), h("span", Gm, "Stopping")) : C("", !0),
            e.mark.news ? (c(), h("span", Km, w(e.mark.news), 1)) : C("", !0),
            H.value === "running" ? (c(), h("span", Ym)) : H.value ? (c(), F(at, {
              key: 5,
              class: Z(["sign", H.value]),
              name: H.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (c(), h("span", Zm, w(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), F(xl, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: be(z, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && $.value ? (c(), h("span", Jm, [
        g("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: S.value })
        }, null, 4)
      ])) : C("", !0),
      e.mark.detail && !q(A) ? (c(), F(et, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      e.mark.body && !q(A) ? (c(), h("div", Xm, [
        e.mark.bodyLabel ? (c(), h("p", Qm, w(e.mark.bodyLabel), 1)) : C("", !0),
        L(et, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : C("", !0),
      e.mark.command && !q(A) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, ep)) : C("", !0),
      e.mark.card ? (c(), F(et, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      ce(ie.$slots, "default", {
        shown: !q(A)
      }, void 0, !0)
    ], 16, qm));
  }
}), Ol = /* @__PURE__ */ K(tp, [["__scopeId", "data-v-2aa9c496"]]), np = 60;
function ap(e, t) {
  const n = O([]), a = O(0);
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
    if (l || a.value <= 0 || d.scrollTop > np) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await st(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const sp = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Tl(e) {
  var n;
  const t = sp[e] || ((n = It(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const op = (e) => Tl(String(e).split(":")[0]), Bl = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), lp = { passed: "good", failed: "danger", warned: "warn", running: "" }, rp = { good: "good", warn: "warn", danger: "danger" }, Xs = {
  "open row": (e) => De(`${e.target_model}:${e.target_id}`),
  "open page": (e) => yu(e.target_model, e.target_id || 0)
}, ip = { "open row": (e) => op(e.target_model), "open page": () => Tl("pages") };
function cp(e, t) {
  const n = t || {}, a = Xs[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? lp[e.outcome] || "" : rp[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? ip[a](e) : "",
    handlers: a ? { onAct: () => Xs[a](e) } : {}
  };
}
const up = 2e3;
function dp(e, t, n = up) {
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
  Ce(async () => {
    document.addEventListener("visibilitychange", u), await l(e), i();
  }), vt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
  });
}
const fp = 24, hp = 1e3, Qs = 2e3, mp = 0.25, pp = 5e3;
function gp(e, t = fp, n = () => !0) {
  const a = O(!1), s = O(0), o = O(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const P = u();
    return P ? P.scrollHeight - P.scrollTop - P.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(P) {
    if (clearTimeout(l), !P) {
      o.value = !1, i = Date.now();
      return;
    }
    const _ = Date.now() - i < Qs ? Qs : hp;
    l = setTimeout(() => o.value = a.value, _);
  }
  function v() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function k(P = !1) {
    const _ = u();
    _ && P && _.scrollTo ? _.scrollTo({ top: _.scrollHeight, behavior: "smooth" }) : _ && (_.scrollTop = _.scrollHeight), v();
  }
  function A() {
    I(), !a.value && (a.value = !0, m(!0));
  }
  const x = () => !!u() && d() <= u().clientHeight * mp;
  function I() {
    clearTimeout(r), x() && (r = setTimeout(() => a.value && x() && n() && k(!0), pp));
  }
  function z() {
    f() ? v() : A();
  }
  function ee(P = 1, _ = !1) {
    a.value ? s.value += Math.max(0, P) : k(_);
  }
  return _o() && Eo(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: k, left: A, scrolled: z, arrived: ee };
}
const vp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, yp = (e) => String(e ?? "").replace(vp, ""), bp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(null), { away: o, scrolled: l, arrived: r, toBottom: i } = gp(s);
    he(
      () => n.lines.length,
      () => st(() => r()),
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
      ne(w(q(yp)(e.lines.join(`
`)) || e.empty), 1),
      q(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => q(i)(!0))
      }, "Follow")) : C("", !0)
    ], 544));
  }
}, wp = /* @__PURE__ */ K(bp, [["__scopeId", "data-v-c2fb1783"]]), kp = 1e4;
class xp {
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
    return this.heardAt !== null && t - this.heardAt > kp;
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
const $p = {
  key: 0,
  class: "frame-note"
}, Mp = {
  key: 0,
  class: "frame-note"
}, Sp = ["src", "title"], _p = 1e3, Ep = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ot(), a = O(null), s = O(!1), o = O(!1);
    let l = null, r = 0;
    return Ce(() => {
      l = new xp(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, _p);
    }), Te(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", $p, "This window was closed because it stopped answering.")) : (c(), h(G, { key: 1 }, [
      s.value ? (c(), h("div", Mp, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        L(ue, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: N(() => [...u[1] || (u[1] = [
            ne("Close the window", -1)
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
        title: q(n).window
      }, null, 8, Sp)
    ], 64));
  }
}, Ap = /* @__PURE__ */ K(Ep, [["__scopeId", "data-v-32a49046"]]), hn = (e) => e ? e.split(", ") : [];
function Cp({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Op(e, t) {
  return {
    reads: hn(e.reads_allowed),
    runs: hn(e.runs_allowed),
    missing: [...hn(e.reads_missing), ...hn(e.runs_missing)],
    ask: t
  };
}
const Tp = {
  class: "allowance-prompt",
  role: "dialog"
}, Bp = { class: "allowance-prompt-text" }, Ip = { class: "allowance-prompt-buttons" }, Rp = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Tp, [
      g("p", Bp, w(q(Cp)(e.request)), 1),
      g("div", Ip, [
        L(ue, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: N(() => [...s[2] || (s[2] = [
            ne("Allow", -1)
          ])]),
          _: 1
        }),
        L(ue, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: N(() => [...s[3] || (s[3] = [
            ne("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Lp = /* @__PURE__ */ K(Rp, [["__scopeId", "data-v-cad69fe2"]]), sa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), F(zt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: N(() => [
        ne(w(e.reason) + " ", 1),
        e.retry ? (c(), F(ue, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: N(() => [...s[2] || (s[2] = [
            ne("Retry", -1)
          ])]),
          _: 1
        })) : C("", !0),
        e.removable ? (c(), F(ue, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: N(() => [...s[3] || (s[3] = [
            ne("Remove tab", -1)
          ])]),
          _: 1
        })) : C("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Np = ["data-window", "data-agent"], Dp = {
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
    const n = e, a = t, s = O(""), o = O(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = $e(oi, null), i = mc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: T(() => n.options),
      declared: n.declared,
      page: $e(rc, null),
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
    Ir(Se, i), he(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ce(i.settle), Te(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Rr((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Nn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), F(Lp, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : C("", !0),
      e.unavailableReason ? (c(), F(sa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), F(sa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(G, { key: 4 }, [
        (c(), F(u, { key: o.value })),
        e.skeleton.length && !q(i).answered.value ? (c(), F(os, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : C("", !0)
      ], 64)) : (c(), F(sa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (v) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Np));
  }
}, qt = /* @__PURE__ */ K(Dp, [["__scopeId", "data-v-c4443e2b"]]), Il = {
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
    const n = e, a = t, s = { render: () => Nn(Ap, { src: n.entry.entry_url }) };
    return (o, l) => (c(), F(qt, {
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
}, Pp = ["data-window"], Rl = {
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
    const n = e, a = t, s = Ue(null), o = O("");
    return he(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Oi();
          } catch (r) {
            if (Ai(r) && Ci(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      L(os, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Pp)) : (c(), F(qt, {
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
}, jp = "*.*", qp = {
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
    const t = e, n = $e(Se, null), a = new tc();
    he(
      () => a.patterns,
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (v) => a.dispatch(v));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = T(() => !!(t.declaration.shipped || t.declaration.trusted)), r = T(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [jp] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), F(Rl, {
      key: 0,
      entry: r.value,
      subscriptions: q(a),
      environment: q(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), F(Il, {
      key: 1,
      entry: r.value,
      subscriptions: q(a),
      environment: q(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Fp = { class: "mark-more-inner" }, Wp = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Hp = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Up = {
  key: 3,
  class: "mark-lines"
}, zp = "process", eo = "task", Vp = {
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
    const t = e, n = $e(Se), a = T(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = T(() => Bl.has(t.mark.variant) && t.mark.detail || ""), o = T(() => t.mark.target_model === eo ? t.mark.target_id : 0), l = ap(
      (v) => n.run(v),
      () => t.mark.target_id
    ), r = l.lines, i = O(!1), u = O(""), d = T(() => !t.declaration.body_url && t.mark.target_model === zp && !!t.mark.target_id);
    async function f(v = l.follow) {
      const k = await v();
      i.value = !0, u.value = k.ok ? "" : k.error;
    }
    const m = T(() => t.shown && d.value);
    return he(m, (v) => v && f()), dp(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (v) => v && m.value && f(l.newest)
    ), (v, k) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: k[1] || (k[1] = be(() => {
      }, ["stop"]))
    }, [
      g("div", Fp, [
        e.declaration.body_url ? (c(), F(qp, {
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
            k[2] || (k[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", Wp, w(s.value), 1)
          ], 64)) : C("", !0),
          d.value && u.value ? (c(), h("p", Hp, w(u.value), 1)) : d.value && i.value ? (c(), h(G, { key: 2 }, [
            k[3] || (k[3] = g("p", { class: "mark-label" }, "Output", -1)),
            L(wp, {
              class: "mark-terminal",
              lines: q(r),
              onOlder: q(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", Up, w(a.value.join(`
`)), 1)) : C("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: k[0] || (k[0] = be((A) => q(De)(`${eo}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Da = /* @__PURE__ */ K(Vp, [["__scopeId", "data-v-f4d037e5"]]), Gp = ["title", "aria-label", "onClick"], Kp = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Yp = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = T(() => zc(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = O(""), s = $e(Se);
    async function o(l) {
      const r = await en(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(G, null, [
      (c(!0), h(G, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: be((u) => o(i), ["stop"])
      }, [
        L(at, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Gp))), 128)),
      a.value ? (c(), h("span", Kp, w(a.value), 1)) : C("", !0)
    ], 64));
  }
}, Zp = /* @__PURE__ */ K(Yp, [["__scopeId", "data-v-7a62c88e"]]);
function Ll(e, t) {
  const n = Ue(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await At.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Nl = Ll("/api/marks", "marks"), Ek = Nl.fetchAll, Jp = Nl.find, Xp = ["data-ref"], Qp = ["data-ref"], eg = { class: "mark-row" }, tg = "dock add", ng = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = T(() => Jp(a.mark.type)), o = T(() => cp(a.mark, s.value)), l = T(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && Bl.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = O(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = T(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(tg));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, v;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": q(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        L(Da, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Xp)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": q(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", eg, [
          L(Ol, Ke({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, Lr(o.value.handlers), { onClick: i }), Nr({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: N(({ shown: k }) => [
                L(Da, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: k
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          L(Zp, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Qp));
    };
  }
}, ag = /* @__PURE__ */ K(ng, [["__scopeId", "data-v-8196402d"]]), sg = ["data-ref"], og = ["inert"], lg = { class: "group-fold" }, rg = { class: "thread-group" }, ig = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = O(!1), a = O(!1), s = O(!1), o = O(null);
    he(n, async (r) => {
      var i;
      a.value = !0, await st(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = T(() => ({
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
      L(Ol, {
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
        g("div", lg, [
          g("div", rg, [
            (c(!0), h(G, null, te(e.group.marks, (u) => (c(), F(ag, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, og)) : C("", !0)
    ], 8, sg));
  }
}, Ak = /* @__PURE__ */ K(ig, [["__scopeId", "data-v-45b58b9b"]]);
function cg(e) {
  const t = O(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ce(() => n.observe(e.value)), vt(() => n.disconnect()), t;
}
const ug = { class: "chat-dock-fold" }, dg = ["aria-label"], fg = { class: "chat-dock-head" }, hg = { class: "chat-dock-inner" }, mg = { class: "chat-dock-foot" }, Dl = 700, pg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = O(null), a = O(null), s = cg(a), o = O(!1);
    let l = 0;
    return Ce(() => l = setTimeout(() => o.value = !0, Dl)), vt(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", ug, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ce(r.$slots, "edge", {}, void 0, !0),
          g("header", fg, [
            ce(r.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", hg, [
              g("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: fe(q(s) === null ? null : { height: `${q(s)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ce(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ce(r.$slots, "still", {}, void 0, !0),
          g("footer", mg, [
            ce(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, dg)
      ])
    ], 2));
  }
}, Pl = /* @__PURE__ */ K(pg, [["__scopeId", "data-v-f506a372"]]), gg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, oa = 5, vg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(oa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${oa}s`, animationDelay: `${(n - oa).toFixed(2)}s` };
    return (s, o) => (c(), h("span", gg, [
      g("i", { style: a })
    ]));
  }
}, jl = /* @__PURE__ */ K(vg, [["__scopeId", "data-v-2a7bc150"]]), yg = { reviewing: "Under review" }, bg = (e, t) => e || yg[t == null ? void 0 : t.state] || "", He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, wg = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, kg = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, xg = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], $g = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Mg = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Sg = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], _g = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Eg = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Ag(e, t) {
  const n = { plan: wg, task: kg }[e], a = t != null && t.state ? lc(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[Wo(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const Cg = (e, t) => e === "doc" || e === "report" ? Eg(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Mg(t), ...$g(t)] : e === "check" ? _g(t) : e === "question" ? xg(t) : e === "memory" ? Sg(t) : Ag(e, t), ql = Ll("/api/docks", "docks"), Ck = ql.fetchAll, Dt = ql.find, Og = 6, Tg = 3, la = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Fn = (e) => Date.parse(e.leaves_at) / 1e3, dt = (e) => !!(e.leaves_at && !e.kept), Bg = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!dt(e) || t < Fn(e) || n.has(e.id)), Ig = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => Bg(a, t, n)).sort((a, s) => a.id - s.id);
function Rg(e, t, n = Og) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Fn(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Lg = (e, t, n = e) => n < 2 ? !1 : e >= Tg ? !0 : t, Ng = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Pa = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), Dg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Pg = (e) => ({ ...e.kept ? Pa("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Pa("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), jg = ["pins"], qg = (e) => ({ ...e, iconOnly: jg.includes(e.icon) });
function Fg(e, t) {
  var n;
  return [
    ...Dg(e, t) ? [Pg(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || It(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Pa("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(qg);
}
function Wg(e, t) {
  const n = Fg(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: Ng(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Hg = ["title"], Ug = {
  key: 2,
  class: "dock-controls"
}, zg = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Vg = { class: "dock-facts" }, Gg = { key: 1 }, Kg = {
  key: 2,
  class: "dock-kept"
}, Yg = { class: "dock-acts" }, Zg = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = T(() => Dt(a.item.type)), o = Cl(), l = T(() => _l(a.item.created_at, o.value * 1e3)), r = O(null), i = O(null), u = O(null), d = O(null), f = T(() => Wg(a.item, s.value)), m = $e(Se), v = O(null);
    let k = 0;
    async function A() {
      var E, b;
      const S = ++k, $ = jt(a.item.target_model ?? ""), M = `${$} show`;
      if (!((b = (E = s.value) == null ? void 0 : E.reads) != null && b.includes(M))) return;
      const y = await ht(a.item.type, [$, "show", String(a.item.target_id)], m.environment);
      S === k && (v.value = y.ok ? { ...y.value, id: a.item.target_id, noun: $ } : { id: a.item.target_id, noun: $ });
    }
    he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (S, $, M) => {
        var b;
        const y = jt(a.item.target_model ?? "");
        v.value = { id: a.item.target_id, noun: y }, A();
        const E = (b = m.subscriptions) == null ? void 0 : b.follow(`dock ${a.item.id}`, [`${y.replaceAll("-", "_")}.*`], (p) => {
          (!p.row_id || p.row_id === a.item.target_id) && A();
        });
        M(() => {
          k += 1, E == null || E();
        });
      },
      { immediate: !0 }
    );
    const x = O(/* @__PURE__ */ new Set()), I = O("");
    async function z(S) {
      if (S.action === "open") return De(`${a.item.target_model}:${a.item.target_id}`);
      S.action === "declared" && (x.value = /* @__PURE__ */ new Set([...x.value, S.label])), I.value = "";
      const M = await en(S, { id: a.item.target_id }, m.environment);
      (M == null ? void 0 : M.ok) === !1 && (x.value = new Set([...x.value].filter((y) => y !== S.label)), I.value = `Could not ${S.label.toLowerCase()}: ${M.error}`);
    }
    const ee = T(() => f.value.actions.filter((S) => S.action !== "undock" && !x.value.has(S.label))), P = T(() => {
      var S;
      return bg((S = s.value) == null ? void 0 : S.badge, v.value);
    }), _ = T(() => f.value.buttons.find((S) => S.action === "undock"));
    return (S, $) => {
      var M, y, E, b;
      return c(), F(Pl, {
        label: f.value.title + ((M = s.value) != null && M.needs_user ? ", waiting for you" : ""),
        type: (y = s.value) != null && y.needs_user ? "waiting" : "",
        folded: !!((E = s.value) != null && E.folds) && e.folded,
        body: !!((b = s.value) != null && b.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null
      }, {
        edge: N(() => [
          e.leaving && !e.item.kept ? (c(), F(jl, {
            key: 0,
            "ends-at": q(Fn)(e.item)
          }, null, 8, ["ends-at"])) : C("", !0)
        ]),
        head: N(() => {
          var p, R;
          return [
            (p = s.value) != null && p.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(G, { key: 1 }, [
              L(me, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", {
                class: "dock-title",
                title: f.value.title
              }, w(f.value.title), 9, Hg)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", Ug, [
              (c(!0), h(G, null, te(f.value.controls, (B) => {
                var H, X;
                return c(), h(G, {
                  key: B.action + B.runs
                }, [
                  !x.value.has(B.label) && (!((H = B.variants) != null && H.length) || !((X = v.value) != null && X.state) || B.variants.includes(v.value.state)) ? (c(), F(ue, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: B.pressed }),
                    "aria-pressed": B.pressed,
                    "aria-label": B.label,
                    title: B.label,
                    "data-dock-action": B.action,
                    onClick: (J) => z(B)
                  }, {
                    default: N(() => [
                      L(me, {
                        name: B.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : C("", !0)
                ], 64);
              }), 128))
            ])) : C("", !0),
            g("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              e.collapsed || !((R = s.value) != null && R.leaves_after_seconds) ? (c(), h(G, { key: 0 }, [
                ne(w(l.value), 1)
              ], 64)) : C("", !0)
            ], 512)
          ];
        }),
        still: N(() => [
          I.value || e.refusal ? (c(), h("p", zg, w(I.value || e.refusal), 1)) : C("", !0)
        ]),
        foot: N(() => {
          var p, R;
          return [
            g("span", Vg, [
              P.value ? (c(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, w(P.value), 3)) : C("", !0),
              (p = s.value) != null && p.word ? (c(), h("span", Gg, w(s.value.word), 1)) : C("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", Kg, "Kept")) : C("", !0)
            ]),
            (R = s.value) != null && R.folds ? (c(), F(ue, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: $[0] || ($[0] = (B) => n("fold"))
            }, {
              default: N(() => [
                ne(w(s.value.folds) + " ", 1),
                L(Ct, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : C("", !0),
            g("span", Yg, [
              g("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              L(ou, {
                name: `dock.${e.item.type}`,
                row: v.value,
                environment: q(m).environment,
                "read-only": q(m).readOnly,
                "object-name": q(jt)(e.item.target_model),
                "external-failure": "",
                onFailure: $[1] || ($[1] = (B) => I.value = B),
                onDone: A
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (c(!0), h(G, null, te(ee.value, (B) => (c(), F(ue, {
                key: B.action + B.runs,
                small: "",
                variant: B.primary ? "primary" : "ghost",
                bordered: !B.primary,
                "data-dock-action": B.action,
                onClick: (H) => z(B)
              }, {
                default: N(() => [
                  ne(w(B.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              L(ue, {
                small: "",
                bordered: "",
                title: _.value.label,
                "data-dock-action": "undock",
                onClick: $[2] || ($[2] = (B) => n("undock", _.value))
              }, {
                default: N(() => [...$[3] || ($[3] = [
                  ne("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: N(() => {
          var p;
          return [
            (p = s.value) != null && p.body_url ? (c(), F(Da, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: u.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : C("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, to = /* @__PURE__ */ K(Zg, [["__scopeId", "data-v-fd4e7fd8"]]), Jg = ["title", "aria-label"], Xg = { class: "run-chip-in" }, Qg = {
  key: 0,
  class: "run-chip-ring"
}, e0 = { class: "run-chip-name" }, t0 = { class: "run-chip-bar" }, n0 = "processes.output", a0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = $e(Se, null), o = (s == null ? void 0 : s.environment) ?? "", l = O(null), r = T(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = T(() => {
      var m, v;
      return ((m = l.value) == null ? void 0 : m.title) || ((v = l.value) == null ? void 0 : v.line) || a.item.title || "";
    }), u = T(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await ht(n0, ["process", "card", String(a.item.target_id)], o);
      m.ok && (l.value = m.value);
    }
    let f = null;
    return Ce(() => {
      var m;
      d(), f = (m = s == null ? void 0 : s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && d();
      });
    }), vt(() => f == null ? void 0 : f()), (m, v) => {
      var k;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: fe({ "--tone": u.value })
      }, [
        q(dt)(e.item) ? (c(), F(jl, {
          key: 0,
          "ends-at": q(Fn)(e.item)
        }, null, 8, ["ends-at"])) : C("", !0),
        g("span", Xg, [
          r.value ? (c(), h("span", Qg)) : (c(), F(at, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", e0, w(i.value), 1)
        ]),
        g("span", t0, [
          g("i", {
            style: fe({ width: r.value ? `${((k = l.value) == null ? void 0 : k.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, Jg);
    };
  }
}, s0 = /* @__PURE__ */ K(a0, [["__scopeId", "data-v-44c1df26"]]), o0 = 24, l0 = 8, Ok = 420;
function Tk({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= o0 ? !0 : e < t && s > l0 ? !1 : null;
}
const r0 = (e, t) => e === void 0 ? t : e, i0 = { me: 1, people: [] }, ls = Ya({
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
  people: i0,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Sn("journal.activity", !0),
  wide: !1,
  sideMini: Sn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
nl("journal.activity", () => ls.activity);
nl("journal.side.mini", () => ls.sideMini);
const Fl = "journal.viewer.";
function c0(e, t, n) {
  try {
    const a = n.getItem(Fl + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function u0(e, t, n) {
  try {
    n.setItem(Fl + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function d0(e, t, n = window.localStorage) {
  const a = O(c0(e, t, n));
  return he(a, (s) => u0(e, s, n), { deep: !0 }), a;
}
const f0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, h0 = { class: "dock-runs-title" }, m0 = { class: "dock-runs-chips" }, p0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var S;
    const t = e, n = Lm(500), a = O(/* @__PURE__ */ new Set()), s = O(!1), o = O(!1), l = $e(Se), r = O(/* @__PURE__ */ new Set()), i = O({});
    async function u($, M) {
      i.value = { ...i.value, [$.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, $.id]);
      const y = await en(M, { id: $.target_id }, l.environment);
      (y == null ? void 0 : y.ok) === !1 && (r.value = new Set([...r.value].filter((E) => E !== $.id)), i.value = { ...i.value, [$.id]: `Could not close this card: ${y.error}` });
    }
    const d = T(
      () => Ig(
        t.items.filter(($) => !r.value.has($.id)),
        n.value,
        a.value
      )
    ), f = T(
      () => Rg(
        d.value.filter(($) => la($, Dt)),
        n.value
      )
    ), m = T(() => d.value.filter(($) => !f.value.includes($) && !la($, Dt))), v = T(() => f.value.filter(($) => !dt($))), k = T(() => (s.value = Lg(f.value.length, s.value, v.value.length)) && !o.value && !t.collapsed), A = d0(`dock-folded:${((S = ls.identity) == null ? void 0 : S.root) || location.host}`, {}), x = ($) => {
      var M;
      return !!((M = Dt($.type)) != null && M.folds) && r0(A.value[$.id], la($, Dt) || t.folded);
    };
    function I($) {
      A.value = { ...A.value, [$.id]: !x($) };
    }
    function z($) {
      A.value = { ...A.value, ...Object.fromEntries(f.value.map((M) => [M.id, M.id !== $.id])) }, o.value = !0;
    }
    function ee() {
      A.value = Object.fromEntries(Object.entries(A.value).filter(([$]) => !f.value.some((M) => String(M.id) === $))), o.value = !1;
    }
    function P($) {
      a.value = /* @__PURE__ */ new Set([...a.value, $.id]);
    }
    function _($) {
      a.value = new Set([...a.value].filter((M) => M !== $.id));
    }
    return ($, M) => (c(), F(So, {
      tag: "div",
      name: "dock",
      duration: q(Dl),
      class: "dock-stack"
    }, {
      default: N(() => [
        (c(!0), h(G, null, te(m.value, (y) => (c(), F(to, {
          key: y.id,
          item: y,
          class: Z({ timed: q(dt)(y) }),
          leaving: q(dt)(y) && !a.value.has(y.id),
          folded: x(y),
          collapsed: e.collapsed,
          refusal: i.value[y.id],
          onFold: (E) => I(y),
          onUndock: (E) => u(y, E),
          onMouseenter: (E) => P(y),
          onMouseleave: (E) => _(y)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !e.collapsed ? (c(), h("div", f0, [
          g("span", null, w(f.value.length) + " runs", 1),
          L(ue, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: ee
          }, {
            default: N(() => [
              M[1] || (M[1] = ne(" Runs ", -1)),
              L(Ct, { open: "" })
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(G, null, te(k.value ? [] : f.value, (y) => (c(), F(to, {
          key: y.id,
          item: y,
          class: Z({ timed: q(dt)(y) }),
          leaving: q(dt)(y) && !a.value.has(y.id),
          folded: x(y),
          collapsed: e.collapsed,
          refusal: i.value[y.id],
          onFold: (E) => I(y),
          onUndock: (E) => u(y, E),
          onMouseenter: (E) => P(y),
          onMouseleave: (E) => _(y)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        k.value ? (c(), F(Pl, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: N(() => [
            L(me, {
              name: "runs",
              size: 14
            }),
            g("span", h0, w(f.value.length) + " runs", 1)
          ]),
          foot: N(() => [
            g("span", m0, [
              (c(!0), h(G, null, te(f.value, (y) => (c(), F(s0, {
                key: y.id,
                item: y,
                onClick: (E) => z(y)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            L(ue, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: M[0] || (M[0] = (y) => o.value = !0)
            }, {
              default: N(() => [
                M[2] || (M[2] = ne(" Runs ", -1)),
                L(Ct)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : C("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, Bk = /* @__PURE__ */ K(p0, [["__scopeId", "data-v-cef1a349"]]), ft = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, kn = (e) => Math.min(Math.max(e, 0), 1), g0 = (e) => {
  const t = kn(e);
  return t * t * (3 - 2 * t);
}, rt = (e, t, n) => g0((e - t) / (n - t));
function Ik(e) {
  const t = kn(e), n = kn((t - 0.12) / 0.76) * ft.shuffles, a = Math.min(Math.floor(n), ft.shuffles - 1), s = n - a, o = rt(s, 0.26, 0.38) * (1 - rt(s, 0.76, 0.96)), l = rt(s, 0.38, 0.76), r = rt(t, 0, 0.12) * (1 - rt(t, 0.88, 1)), i = rt(s, 0.2, 0.34) * (1 - rt(s, 0.84, 1)), u = Math.sin(Math.PI * kn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / ft.shuffles, lift: ft.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function Rk(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const no = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, Lk = (e) => no[e] ?? no.butler, rs = 2400, v0 = 0.05;
function y0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, v0), l = Math.min(t + rs * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function Nk(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function b0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function Dk(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const Pk = (e, t) => ({ ...e, stretch: t.stretch }), jk = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Wl = (e, t) => t >= (e.least ?? 0);
function qk(e, t, n) {
  if (!Wl(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const Fk = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), w0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ao = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), k0 = (e) => e.right > e.left && e.bottom > e.top;
function Wk(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(w0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = ao(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = ao(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), k0(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function Hl(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const k = (o[f] - e[d]) / v, A = (o[m] - e[d]) / v;
        l = Math.max(l, Math.min(k, A)), r = Math.min(r, Math.max(k, A));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, u = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: u, on: "surface", surface: s.id, dx: i - s.left, dy: u - s.top };
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
}, Kt = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), x0 = (e) => e * e * (3 - 2 * e), Me = (e, [t, n]) => x0(Kt(e, t, n)), $0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], tt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, mn = ([e, t], n) => e + n() * (t - e);
function M0(e) {
  return $0.map(() => {
    const t = mn(tt.speed, e), n = mn(tt.angle, e) * Math.PI / 180, a = mn(tt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [mn(tt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const S0 = M0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function _0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * tt.gravity * (t[2] - tt.floor))) / tt.gravity;
}
function Hk(e, t, n = S0) {
  const a = xe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = _0(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= tt.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const Uk = (e, t) => e && xe[e.name] ? { name: e.name, u: t / e.frames } : null;
function zk(e, t) {
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
const Vk = () => Array.from({ length: xe.pogo.count }, (e, t) => xe.pogo.bounce * (t + 1) / xe.pogo.count), Et = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Gk(e, t, n) {
  const { away: a, side: s } = xe.bug_smash, o = s * a * n, [l, r] = [t.left + Et.margin * n, t.right - Et.margin * n], i = Math.min(Math.max(e + o + s * Et.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function Kk(e, t, n) {
  const a = xe.bug_smash, s = Me(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Et.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Et.tall * n * (1 - Me(t, a.emerge)),
      turn: 90 * (1 - Me(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Me(t, a.gone)
    }
  };
}
function Yk(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Et.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = y0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ae = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function Zk(e) {
  const t = Ae.least + Math.floor(e() * (Ae.most - Ae.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ae.walls[Math.floor(e() * Ae.walls.length)],
    along: Ae.margin + e() * (1 - 2 * Ae.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ja(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ae.margin, l = ((e.along - Ae.margin + e.way * Ae.speed * n / a) / s % 2 + 2) % 2, r = Ae.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Ae.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ae.inset : t.right - Ae.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function E0(e, t) {
  const n = xe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = b0(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function Jk(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = xe.bug_shot, { frame: l, bug: r, shot: i } = E0(n, e.length), u = e.map((I, z) => ({ ...ja(I, t, Math.min(n / o.fps, xn(z).shot)), shot: z < i })), d = Me(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], v = e.map((I, z) => ({ bug: I, index: z, seconds: n / o.fps - xn(z).shot, spot: ja(I, t, xn(z).shot) })).filter((I) => I.seconds >= 0), k = v.flatMap((I) => {
    const z = (s == null ? void 0 : s.get(I.index)) ?? B0(I.bug, t, I.spot, s ? [] : a);
    return s == null || s.set(I.index, z), s && I0(z, I.seconds, a), R0(z, I.seconds, a);
  }), A = v.filter((I) => O0(I.bug)).map((I) => ({ seconds: I.seconds, from: I.spot })), x = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: x }, slush: k, camera: A };
}
function xn(e) {
  const t = xe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function Xk(e, t, n, a) {
  const { limit: s, margin: o } = xe.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = xn(d), m = ja(u, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), k = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), A = Math.abs(m.x - i) >= v ? i : m.x + k * v, x = k > 0 ? Math.max(i, Math.min(A, r)) : Math.min(i, Math.max(A, l)), I = { from: i, to: x, begin: f.walk, end: f.aim };
    return i = x, I;
  });
}
function Qk(e, t, n) {
  var o;
  const a = xe.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Me(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const we = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, A0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function C0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const O0 = (e) => e.along * 97 % 1 < we.camera, Yt = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * we.gravity * t * t });
function T0(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * we.gravity * (t.bottom - e.from.y))) / we.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * we.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / we.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += we.step) {
    const d = Math.min(u + we.step, l.t), f = Yt(e, d), m = Hl(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = Yt(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function B0(e, t, n, a = []) {
  const s = C0(e.along + 1), [o, l] = A0[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: we.count }, () => {
    const i = r + (s() - 0.5) * 2 * (we.spread * Math.PI / 180), u = we.speed[0] + s() * (we.speed[1] - we.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: we.radius[0] + s() * (we.radius[1] - we.radius[0]) };
    return { ...d, ...T0(d, t, a) };
  });
}
function I0(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += we.step) {
      const l = Math.min(o + we.step, s), r = Hl(Yt(a, o), Yt(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function R0(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...Yt(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - we.hold) / we.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, u = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function e5(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = xe.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Me(e, [0, u]), m = Me(e, [u, u + d]);
  return l.map((v) => {
    const k = { x: a.x + v.at[0] * t, y: a.y + v.at[1] * t };
    return {
      x: n.x + (k.x - n.x) * f,
      y: n.y + (k.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function t5(e, t, n, a, s) {
  const { sway: o, above: l } = xe.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (A) => {
    const [x, I] = [A.x - e.at.x, A.y - e.at.y];
    return { x: r.x + x * u - I * d, y: r.y + x * d + I * u };
  }, [m, v] = [...n].sort((A, x) => A.x - x.x), k = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: k.map((A, x) => ({ from: A, to: x < k.length / 2 ? m : v })) };
}
const n5 = (e, t) => Me(t, e.grows) * (1 - Me(t, e.sinks));
function On(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: Kt(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: Kt(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function a5(e, t) {
  const n = xe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = On(n, t), l = 1 - (1 - n.small) * Me(a, n.shrinks) * (1 - Me(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = On(n, t), o = n.flat * Me(a, n.squashes) * (1 - Me(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * Kt(s, ...n.springs)) * (1 - Kt(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const s5 = (e) => e === "pack_box";
function o5(e) {
  const { into: t, out: n } = On(xe.rope_swing, e);
  return 1 - Me(t, [0, 1]) * (1 - Me(n, [0, 1]));
}
function l5(e) {
  const t = xe.rope_swing, { into: n, out: a } = On(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Me(n, [0, 1]) * (1 - Me(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const L0 = { after: 3 }, is = 10, N0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, D0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, P0 = { weight: 19 }, Ul = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, j0 = { every: 120 }, zl = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Vl = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, q0 = {
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
}, nn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: is }), ae = (e, t, n = {}) => nn(e, "clip", t, n), ra = (e, t, n = {}) => nn(e, "look", t, n), so = (e, t, n = {}) => nn(e, "gaze", t, n), de = (e, t, n = {}, a = {}) => ({ ...nn(e, "pick", t, n), ...a }), ge = (e) => nn("nothing", "nothing", e, {}), F0 = 120, W0 = 300, ia = (e, t) => ({ ...ae(e, t), cooldown: W0 }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), H0 = () => [ae("joy", 2)], it = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), ct = (e) => ({ ...e, cooldown: N0[e.name] }), Nt = (e) => ({ ...e, shenanigan: !0, lasts: D0[e.name] }), Wn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...le("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ae("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...le("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...ct(ae("bug_shot", 3)), toward: "", onto: !1 },
    { ...ct(ae("bug_smash", 2)), toward: "", onto: !1 },
    ae("nod", 2)
  ]),
  ...le("tests_failed", { cooldown: 20, toward: "card" }, [ae("startled", 2), ae("dismay", 1), ae("tantrum", 3), ge(1)]),
  ...le("committed", { cooldown: 30, toward: "card", onto: !0 }, [ae("nod", 2), ge(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...le("sin_fixed", { cooldown: 300 }, [ae("halo", 1), ge(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...le("sin_committed", { cooldown: 300 }, [ae("repent", 1), ge(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...le("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ae("nod", 4), ae("hand_rub", 4), ge(7)]),
  ...le("question_asked", { cooldown: 60 }, [ae("ask_sign", 9), ae("look_up", 3), ge(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...le("reported", { cooldown: 90 }, [so("read", 3), ae("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...le("read_message", { cooldown: 30 }, [so("read", 3), ge(1)]),
  ...le("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), ge(6)]),
  ...le("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...le("bar_done", { holds: !0 }, H0()),
  ...le("bar_failed", { holds: !0 }, [ae("fume", 1), ae("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...le("standing", { cooldown: 12 }, [ae("look_left", 2), ae("look_right", 2), ae("look_up", 1), ge(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...le("launched", { cooldown: 300 }, [ae("tumble", 3), ge(47)]),
  // a break from the hammering now and then
  ...le("building", { cooldown: 30 }, [ae("wipe_brow", 4), ae("look_left", 1), ae("look_right", 1), ge(69)]),
  ...le("failed", { cooldown: 20, toward: "card" }, [ae("shake", 3), ae("tantrum", 2), ge(2)]),
  ...le("refused", { cooldown: 20 }, [ae("shake", 1), ge(1)]),
  ...le("work_done", { cooldown: 120 }, [ae("stretch", 2), ge(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...le("pondering", { cooldown: [30, 60] }, [de("ponder", 1)]),
  ...le("thought_cloud", { cooldown: 90 }, [de("cloud", 1)]),
  ...le("light_bulb", { cooldown: 150 }, [de("bulb", 1)]),
  ...le("answered", { cooldown: 15 }, [ra("amused", 3), ge(2)]),
  ...le("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...le("long_walk", { cooldown: 90 }, [ae("stumble", 3), ge(22)]),
  ...le("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), ge(13)]),
  ...le("typing", { cooldown: 60 }, [ra("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(q0).flatMap(([e, t]) => le(`reacted:${e}`, {}, [ra(t, 1)])),
  ...Object.entries(zl).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => le(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Vl).flatMap(([e, t]) => le(`agent_reacted:${e}`, {}, [ae(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...le("pastime", {}, [
    it("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    it("rest", 3, 180, 120),
    it("yawn", 2, 60, 60),
    it("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    it("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    it("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    it("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Nt(ct(ae("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Nt(ct(ae("disco", 2, { ball: "bubble" }))),
    ge(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...le("held:search", { cooldown: F0 }, [ia("search", 3), { ...ia("binoculars", 2), when: { home: !0 } }, { ...ia("glass_bubble", 2), when: { bubble: !0 } }]),
  ...le("held:type", {}, [ae("type", 3), ae("type_ponder", 1)]),
  ...le("held:compacting", {}, [ae("pack_box", 3), ae("vacuum", 2), ae("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...le("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...le("tickled", {}, [{ ...ct(ae("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...le("eager", {}, [ae("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...le("jump", {}, [Nt(ct(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...le("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...le("unit", { cooldown: Ul.build.cooldown }, [de("unit", P0.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: j0.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...le("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...le("roam", {}, [
    de("rest", 35, {}, { stay: [25, 60] }),
    de("seat", 15, {}, { stay: [15, 40] }),
    de("edge", 25, {}, { stay: [8, 20] }),
    Nt(de("bubble", 15, {}, { stay: [30, 80] })),
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
    Nt(ct(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...le("laptop", {}, [de("seat", 6, {}, { stay: [60, 150] }), de("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...le("ledge_at", {}, [de("middle", 2, {}, { along: 1 / 2 }), de("third", 1, {}, { along: 1 / 3 }), de("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...le("composed_as", {}, [
    de("facing", 4, {}, { turn: 0, leans: 0 }),
    de("turned_left", 1, {}, { turn: 335, leans: 0 }),
    de("turned_right", 1, {}, { turn: 25, leans: 0 }),
    de("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    de("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Gl = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Kl = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), U0 = (e) => Array.isArray(e) ? e[0] : e, z0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, V0 = (e) => Wn.some((t) => t.when.moment === e);
function G0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Kl(d).every(([f, m]) => n(f) >= U0(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Wn.filter((d) => Gl(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= L0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function Pe(e, t) {
  const n = G0(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Yl(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Yl(e, t, n) {
  var a;
  for (const [s, o] of Kl(t)) (a = e.memory) == null || a.set(s, e.now + z0(o, n));
}
function r5(e, t, n) {
  Yl(e, Wn.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const i5 = (e) => Object.values(Ul).find((t) => Gl(t.when, e)) ?? null, K0 = (e, t, n) => n - t <= (e.lifetime ?? is), c5 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Wl(e.clip, t));
class Zl {
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
const qa = {
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
}, u5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Jl = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), d5 = {
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
}, f5 = 120, Y0 = 20, h5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Y0), Z0 = (e) => qa[e] || qa.idle, m5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Xl = "airborne", J0 = "landing", X0 = "travelling", Ql = "grounded", p5 = ({ airborne: e, landing: t, trip: n }) => e ? Xl : t ? J0 : n != null && n.started ? X0 : Ql;
function g5(e, t) {
  var s;
  const n = Q0(e, t);
  return e.mode === Ql && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function Q0(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Xl && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...ev(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : Z0(u), facing: v ? m : r.posture === "sit" ? r.face : f };
}
function ev(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Fa = (e) => e.outcome, tv = "plugin:code-commandments:sins:", oo = (e) => e.type === "plugins.card" && e.markKey.startsWith(tv), nv = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => oo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => oo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], v5 = (e, t) => e.filter((n) => n.author === "user" && An(n.read_at) > t).map((n) => ({ beat: "read_message", time: An(n.read_at), card: vl(n) })).sort((n, a) => n.time - a.time), lo = { user: "reacted", agent: "agent_reacted" };
function y5(e, t) {
  return e.filter((n) => lo[n.author] && pt(n) > t).map((n) => ({ beat: `${lo[n.author]}:${n.emoji}`, time: pt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const av = [.../* @__PURE__ */ new Set([...Object.values(zl).flatMap((e) => Object.keys(e)), ...Object.keys(Vl)])];
function b5(e, t) {
  return e.filter((n) => n.author === "agent" && pt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = av.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: pt(n), card: vl(n) })).sort((n, a) => n.time - a.time);
}
const sv = (e) => new Zl(e).isTest(), Tn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Fa(e)] || "";
}, ov = 1800, lv = (e, t) => {
  if (Tn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Tn(n) !== "finished" && Number(e.time) - Number(n.time) <= ov ? "tests_fixed" : "tests_passed";
};
function w5(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(sv), s = a.filter((r) => Tn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Tn(r))), o.map((r) => ({ beat: lv(r, s), time: Number(r.time), card: r.key }));
}
function k5(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Fa(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Fa(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const x5 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: pt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function $5(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function M5(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function S5(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = nv.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function cs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const ro = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function rv(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    cs(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function _5(e, t, n, a = {}) {
  const s = Pe({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : V0(`held:${e}`) ? "idle" : e;
}
const Ee = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function E5(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ee.ahead * n ? 180 : Math.sign(a) * Ee.turn;
}
const io = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function A5(e, t) {
  const n = Math.min(Ee.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ee.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ee.lines, Math.floor((e.bottom - e.top - 2 * a) / Ee.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Ee.sweep) % s, r = o % Ee.sweep, i = Ee.sweep - Ee.returnSeconds, u = io((r - i) / Ee.returnSeconds), d = r <= i ? io(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Ee.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const co = 3, er = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, uo = 12, C5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function O5(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!er(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= co ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * uo) / uo, lasts: co } };
}
const T5 = (e) => e.posture === "hang" && !er(e.face), iv = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), cv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function B5(e, t, n) {
  return iv.has(e) ? 1 / 0 : !cv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(tr(n - t.began, t.share) - ze.lead, 0);
}
const uv = 5;
function I5(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= uv ? { beat: "long_walk", time: n } : null };
}
const dv = 30, pn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function R5(e, t, n, a, s = null) {
  if (t && n < t.until || !pn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Pe({ moment: "spell", state: e, tally: s }, a), [l, r] = pn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + pn.every } : { state: e, began: 0, until: 0, next: n + pn.every };
}
const L5 = (e, t, n) => t && n < t.until && Jl.has(e.state) ? { state: t.state, since: t.began } : e, ze = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, tr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function N5(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = tr(o, e.share);
  return s ? { eager: fv(t, l), moment: null } : l > ze.lead ? { eager: t, moment: null } : l < ze.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ze.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ze.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Pe({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function fv(e, t) {
  return e.on && t > ze.lead + ze.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ze.lead && t >= ze.least ? { ...e, on: !0, calm: !1 } : e;
}
const hv = 1, mv = { look: "look", gaze: "gaze" };
function pv(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Pe({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [mv[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const gv = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Pe({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), vv = (e, t, n, a, s, o = 0) => Pe({ moment: "jump", high: e > hv * t, memory: a, now: s, room: o }, n).name === "backflip", yv = { work: ["building"], idle: ["standing"] };
function D5(e, t, n, a) {
  const s = qa[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(yv[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Jl.has(e) ? { moments: o, began: n || a } : (n && a - n >= dv && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function bv(e, t, n) {
  return !Pe({ moment: "pondering", memory: e, now: t }, n) || !Pe({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Pe({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const fo = { pondering: bv };
function P5(e, t, n, a, s, o) {
  if (fo[e.beat]) {
    const r = fo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = pv(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== is && { lifetime: l.lifetime } } } : null;
}
function j5(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = gv(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const q5 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function F5(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function W5(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const H5 = (e, t) => !!(e != null && e.watches) && !t.once, U5 = 10, z5 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || K0(a, a.queuedAt, n)), V5 = (e, t) => t ? null : e[0] ?? null;
function G5(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const K5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), wv = 2 * Math.PI, kv = 500;
function Y5(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / kv, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = wv * l / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, A = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? $v(v, t, n, m, s) : Sv(v, t, n, m) : t) ?? v, x = A != null && A.behind && A.mood === "reading" ? xv(e.point, A, n, l, s) : A;
  return { point: x ?? null, toward: x ? { x: x.x - n.x, y: x.y - n.y } : null, amount: f, at: a };
}
function xv(e, t, n, a, s) {
  const o = (y) => y * 180 / Math.PI, l = (y) => o(Math.atan2(Math.sin(y * Math.PI / 180), Math.cos(y * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, v = f ? e.readingYaw + m : d, k = v + l(u - v), A = Math.min(Math.max(a / 1e3, 0), 0.1), x = Ee.turnSpeed * A, I = f ? v + Math.min(Math.max(k - v, -x), x) : k, z = f ? e.readingFollow + m : I, ee = z + (I - z) * (1 - Math.exp(-A / Ee.followSeconds)), P = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, _ = o(cs(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), S = Math.min(Math.max(_, -P.up), P.down), $ = Ee.tipSpeed * A, M = f ? e.readingPitch + Math.min(Math.max(S - e.readingPitch, -$), $) : S;
  return { ...t, readingYaw: I, readingFollow: ee, readingPitch: M, readingFacing: r };
}
function $v(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (z) => {
    const { yaw: ee, pitch: P } = cs(z.x - n.x, s, n.y - z.y, o);
    return { yaw: ee, pitch: Math.min(Math.max(P, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [ro(r(e)), ro(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [k, A, x] = i.map((z, ee) => m * z + v * u[ee]), I = s * k / A;
  return { ...t, x: n.x + I, y: n.y - rv(I, s, -Math.asin(Math.min(Math.max(x, -1), 1)), o) };
}
const Mv = 0.15;
function Z5(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Mv;
}
function Sv(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const _v = (e) => !(e != null && e.on);
function J5(e, t, n) {
  if (_v(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const Zt = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, We = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ca = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), ho = (e) => e * e * (3 - 2 * e);
function Ev(e) {
  if (e < 0 || e >= We.seconds) return null;
  const t = ca(e, ...We.flicker), n = Math.floor(t * We.flickers * 2) % 2 === 0, a = e < We.flicker[1] ? n ? 0.35 + 0.5 * t : We.dim : 1;
  return { strength: 1 - ho(ca(e, ...We.fade)), lit: a, white: e < We.flash[0] ? 0 : 1 - ho(ca(e, ...We.flash)) };
}
const X5 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Q5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Ev(t - e.at);
  return a && { colour: Zt.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: We.signs[e.tone], ...a } };
}
function e4(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function t4(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= Zt.looks || a === null && n - e.since >= Zt.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function n4(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const Qe = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, a4 = { behind: 39, figure: 40, ahead: 41 }, Av = "[data-figure-pile]", Cv = { amber: [1, 0.69, 0.125], good: Zt.colours.good, bad: Zt.colours.bad }, $n = { phases: 4, ms: 230, dim: 0.25 }, s4 = (e, t, n) => e !== "amber" || (t + n) % $n.phases < $n.phases / 2 ? 1 : $n.dim, o4 = (e) => e === "amber" ? $n.phases : 1;
function l4(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const r4 = Object.keys(Cv), je = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Pt = ([e, t], n) => e + n() * (t - e);
function i4(e) {
  const t = je.least + Math.floor(e() * (je.most - je.least + 1));
  return Array.from({ length: Math.min(t, je.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * je.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Pt(je.start, e), l = Pt(je.reach, e);
    return {
      text: Pe({ moment: "digit" }, e).name,
      x: a * o,
      y: je.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Pt(je.moveMs, e)),
      fadeMs: Math.round(Pt(je.fadeMs, e))
    };
  });
}
const ua = { high: 3, gap: 1 };
function c4(e) {
  const t = Math.floor(e / ua.high);
  return { left: -(Qe.inside + Qe.width / 2 + t * (Qe.width + ua.gap)), up: e % ua.high * (Qe.height - Qe.top) };
}
const Ov = (e, t, n) => Pe({ moment: "unit", memory: e, now: t }, n) !== null, Tv = { after: 5 }, Bv = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Zl(t).isBuild());
function u4(e, t, n) {
  const a = Bv(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Tv.after ? s : null;
}
function d4(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Ov(n, a, s) } : null;
}
const mo = { ahead: 140, up: 70 };
function f4(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * mo.ahead, y: a - mo.up } } : o ? { at: { x: n(o), y: a - o.up - Qe.height } } : t ? { at: null } : null;
}
const da = { least: 4e3, most: 1e4 }, Iv = (e) => da.least + e() * (da.most - da.least), ut = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function h4(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Iv(t);
    if (n.length >= ut.most || t() >= ut.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (ut.at[0] + t() * (ut.at[1] - ut.at[0]));
    n.push({ from: o, to: o + ut.ms }), a = o + ut.ms;
  }
}
const m4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), p4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), nr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), g4 = new Set(Wn.filter((e) => nr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Rv = (e) => e.some((t) => t.state === "built"), v4 = (e, t) => Rv(t) ? e.filter((n) => !nr.has(n.beat)) : e, nt = { reach: 40, room: 6 }, Lv = (e, t) => t <= e - nt.reach + 2, y4 = (e, t, n) => Lv(e, n) ? t - nt.reach : e - nt.reach - nt.room, b4 = (e, t, n, a) => a > 0 && t < e && t + nt.reach >= e - 2 ? Math.min(n, Math.max(e, t + nt.reach)) : e, fa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, w4 = (e) => Pt(e() < fa.longShare ? fa.long : fa.short, e), Nv = 2 * Qe.width;
function k4(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Nv ? o : e + (o - e + s / 2) % s;
}
const Dv = 60, x4 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Dv, po = "[data-figure-home]", an = () => {
  var t;
  const e = document.querySelector(po);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(po)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Pv = "[data-figure-docked-bars]", jv = "[data-figure-chat-foot]", qv = [0.85, 0.6, 0.35, 0.15], Fv = ["question", "waiting", "suggestion"], $4 = (e, t) => Fv.find((n) => e[n] > 0 && t[n] === "behind") || null;
function M4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Wv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Hv = "[data-figure-newest]";
function ar() {
  var a, s;
  const e = (a = an()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Hv), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !us(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function Jt(e, t, n = ar()) {
  if (!e || !n) return !0;
  const a = Ze(e, t), s = Un(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + _e.top * t.size, bottom: a.top + _e.bottom * t.size }, l = ft.gap;
  return !Hn(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function S4(e, t, n, a = ar()) {
  if (!a || Jt(t, e, a)) return null;
  const s = Un(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = wt(), i = t.posture === "stand" ? fs * e.size : dr * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - ft.gap - l, a.right + ft.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && Jt(m, e, a) && yy(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const ha = 0.26, sr = 0.54, Uv = 1.25 / 5.4, sn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ha, travels: "stand" },
  lounge: { drop: ha, travels: "stand" },
  composed: { drop: ha, travels: "stand" },
  hang: { drop: sr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, _4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Uv * Math.cos(t * Math.PI / 180),
  y: 1 - n - sr
}), Ft = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), zv = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), E4 = (e, t) => (e === "sit" ? zv.has(t) : Ft.has(e)) ? e : "stand";
function A4(e, t) {
  return e.facing === t.facing || !Ft.has(e.posture) && !Ft.has(t.posture) ? t : { posture: "stand", facing: Ft.has(e.posture) ? e.facing : t.facing };
}
const C4 = 0.25, O4 = (e, t) => Ft.has(e) && sn[t].drop === 0, or = 2, Vv = 90, Gv = 180, Kv = 140, Yv = 280, Zv = 420, Jv = 0.25, Xv = 290, Qv = 600, ey = "cubic-bezier(0.2, 0.7, 0.4, 1)", ty = "cubic-bezier(0.55, 0, 0.9, 0.6)", ma = 5;
function Bn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ma) return null;
  (l || r) && (o = Math.max(o, or));
  const v = o > 1, k = Math.abs(t.x - e.x), A = k < ma ? 0 : k / (Vv * o) * 1e3, x = Math.min(A, v ? Kv : Gv), I = Math.abs(t.y - e.y), z = t.y < e.y, ee = z && !m && vv(I, n, i, u, d, f), P = z ? Zv + Math.min(I, 400) * Jv : Math.sqrt(2 * I / rs) * 1e3, _ = {
    x: t.x,
    y: t.y,
    ms: I > ma ? ee ? Qv : P : 0,
    lead: ee ? Xv : z ? Yv : 0,
    easing: z ? ey : ty,
    hopping: !0,
    clip: ee ? "backflip" : z ? "jump" : "fall"
  }, S = { x: t.x, y: t.y, ms: A + x, lead: 0, easing: "linear", ramp: x, ...v ? { clip: "run" } : {} }, $ = m ? ny(t, n) : _, M = z && !a ? [{ ...S, y: e.y }, $] : [{ ..._, x: e.x }, S];
  return { way: Math.sign(t.x - e.x) || 1, legs: M, lands: !s, pace: o, running: v };
}
const ny = (e, t) => ({ x: e.x, y: e.y, ms: xe.pogo.frames / xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), ay = (e, t) => e.postures.includes(t) ? t : e.postures[0], T4 = (e, t, n) => e.posture === "walk" && n ? "walk" : ay(e.clip, t), Ze = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - sn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Hn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, us = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function wt() {
  var t;
  const e = (t = an()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const gn = 0.5, go = 20;
function B4(e, t, n = wt()) {
  const a = Ze(e, t);
  return a.left >= n.left + go && a.right <= n.right - go;
}
function ds(e, t, n = wt()) {
  const a = Ze(e, t), s = a.right - a.left, o = Un(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - gn && r <= n.right + gn && a.top >= n.top - gn && i <= n.bottom + gn;
}
const In = [0.35, 0.5, 0.65], Rn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], _e = { left: In[0], right: In.at(-1), top: Rn[0], bottom: Rn.at(-1) }, sy = 0.24;
function Un(e) {
  if (e.posture === "stand") return { left: _e.left, right: _e.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + sy * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(_e.left, t), right: Math.max(_e.right, t) };
}
function oy(e, { size: t }, n = wt()) {
  const a = Un(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const fs = (_e.right - _e.left) / 2 + 0.08;
function I4(e, t) {
  return e === "hang" ? _e : { ..._e, bottom: Math.min(_e.bottom, 1 - t - sn[e].drop) };
}
const ly = "[data-figure-agent]";
function lr(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !us(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const rr = (e) => Rn.flatMap(
  (t) => In.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function hs(e, t, n = "") {
  if (!Jt(e, t)) return In.length * Rn.length;
  const a = Ze(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Wv)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && Hn(s, i) && us(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return rr(s).filter(([r, i]) => l(r, i) || lr(r, i, n)).length;
}
function ry(e, t) {
  const n = Ze(e, t);
  return rr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => lr(a, s, "", ly)).length;
}
const vo = 4;
function R4(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = vo; o <= s; o += vo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!ry(r, e) && Jt(r, e)) return r;
    }
  return null;
}
function Xt(e, t, n) {
  const a = wt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => ds(l, t, a) && Jt(l, t)).map((l) => ({ spot: l, covered: hs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const ir = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), iy = [0.5, 0.25, 0.75], cy = (e) => ir(e.getBoundingClientRect(), iy), cr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, uy = fs, dy = (e, t, { size: n }, a = uy) => ur(e, cr[t], a * n, "stand");
function ur(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const fy = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, dr = 0.1, hy = (e, t, { size: n }) => ur(e, fy[t], dr * n, "sit"), my = (e) => ((e + 180) % 360 + 360) % 360 - 180, pa = 60;
function L4(e, t) {
  const n = my(t);
  return !e.aside || Math.abs(n) >= pa ? t : n < 0 ? 360 - pa : pa;
}
const Wt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, py = (e) => [.../* @__PURE__ */ new Set([e, ...Wt.turns.map((t) => (t + 360) % 360)])];
function N4(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = py(t), l = Wt.every[0] + a() * (Wt.every[1] - Wt.every[0]);
  return { face: t, from: s ? gy(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function gy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Wt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function D4(e, t) {
  const { element: n, edge: a } = zn(), s = ["left", "right"].map((r) => on(hy(a, r, e), e)).filter((r) => n && ds(r, e) && !hs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function P4(e, t, { size: n }) {
  const a = (_e.right - _e.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - fr } : e;
}
const fr = 7;
function hr() {
  const e = [...document.querySelectorAll(Av)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function vy(e, t) {
  const n = Ze(e, t), a = n.right - n.left;
  return { left: n.left + _e.left * a, right: n.left + _e.right * a, top: n.top + _e.top * a, bottom: n.bottom };
}
function yy(e, t) {
  const n = hr();
  return !n || !Hn(vy(e, t), n);
}
const by = 4;
function zn() {
  const e = ln(), t = hr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > by || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - fr - n, 0) } };
}
const j4 = ({ size: e, below: t }) => (1 - t) * e;
function on(e, t) {
  const n = wt(), { size: a, below: s } = t, o = sn[e.posture].drop * a;
  return { ...oy(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Wa = (e, t) => Object.keys(cr).map((n) => on(dy(e, n, t), t)), ms = (e, t) => ir(e, qv).map((n) => on(n, t)), mr = (e, t, n) => Xt(e, t, n) ?? e[0];
function q4(e, t) {
  const { element: n, edge: a } = zn();
  return { ...mr(Wa(a, e), e, t), view: null, on: n };
}
function F4(e, t, n, a) {
  const { element: s, edge: o } = zn(), l = (a ? Wa(o, t) : [...Wa(o, t), ...ms(o, t)]).filter(
    (u) => !Hn(Ze(u, t), e)
  ), r = Xt(
    l.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !hs(r, t) ? r : Xt(l, t, n);
  return i && { ...i, view: null, on: s };
}
function ln() {
  var a;
  const e = an(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Pv);
  if (!t) return { ...Vn(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const yo = { within: 2 };
function W4(e) {
  const { element: t, docked: n, edge: a } = ln();
  if (!n || e.on !== t) return !0;
  const s = Vn().edge;
  return a.left > s.left + yo.within || a.left + a.width < s.left + s.width - yo.within;
}
const wy = "[data-figure-closing]";
function H4() {
  var n;
  const { element: e, docked: t } = ln();
  return t && !!((n = e.firstElementChild) != null && n.matches(wy));
}
const pr = "[data-figure-progress]";
function U4(e) {
  const t = e.querySelector(pr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function z4(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const ky = { across: 300, above: 380, below: 60 };
function V4(e) {
  const { across: t, above: n, below: a } = ky;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: xy(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const xy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), gr = "[data-figure-bar]", Ha = { back: 144, along: 0.4 };
function G4(e) {
  const { element: t, docked: n, edge: a } = ln(), s = n ? t.querySelector(gr) : null;
  if (!(s != null && s.querySelector(pr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...on({ x: o - Ha.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function K4(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ha.along * a.size ? t.x + Ha.along * a.size : e.x, y: e.y, behind: !0 };
}
function Y4(e) {
  const t = e.querySelector(gr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Vn() {
  const e = an();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function Z4(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = Vn(), i = n === null ? $y(r, e, o === null ? t : { x: o, y: r.top }, a, s) : on({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function $y(e, t, n, a, s) {
  const o = ms(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + Qe.width < s && i.x + a - nt.reach - nt.room >= l);
  return Xt(r.length ? r : o, t, n);
}
const My = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function J4(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, or));
  const v = (ee) => {
    const P = Ze(ee, n, sn[ee.posture].travels);
    return { x: P.left, y: P.top };
  }, k = t.ladder ?? e.ladder;
  if (k && !(t.ladder && e.ladder)) return Sy(v(e), v(t), v({ ...k.foot, posture: "stand" }), k.way, !!t.ladder, n, s);
  const [A, ...x] = [e, ...i, t].map(v), I = Bn(A, x[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), z = x.slice(1).map((ee, P) => {
    var _;
    return (_ = Bn(x[P], ee, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : _.legs.find((S) => S.hopping);
  });
  return I && { ...I, legs: [...I.legs, ...z.filter(Boolean)] };
}
function Sy(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / My.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Bn(e, n, o.size, { pace: l }) : Bn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function X4(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function Q4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && Xt(cy(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = zn();
  return { ...mr(ms(s, t), t, n), view: null, on: a };
}
const _y = "[data-figure-bubble]", Ey = 250;
let Ht = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), vr = 0;
const Rt = () => Ht, ga = /* @__PURE__ */ new WeakMap();
let Ay = 0;
function ps(e) {
  return ga.has(e) || ga.set(e, `floor-${++Ay}`), ga.get(e);
}
const Cy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Oy = () => {
  var e, t;
  return ((t = (e = an()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Ty(e, t) {
  var a;
  const n = (a = e.querySelector(jv)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function By(e, t) {
  const n = e && Ty(e, t), a = e ? [...e.querySelectorAll(_y)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Cy(l, n))).map(({ element: o, type: l, box: r }) => ({ id: ps(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Iy = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Ey ? (t.top - a.top) / s * 1e3 : 0;
};
function yr(e = Ht, t = performance.now()) {
  const n = wt(), a = Oy(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = ln(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = Vn();
  return u.element && i.push({ id: ps(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...By(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: Iy(e, d, t) }))) });
}
const Ua = /* @__PURE__ */ new Set();
function Ry(e) {
  return Ua.add(e), () => Ua.delete(e);
}
function Ly() {
  br();
  const e = () => {
    vr = requestAnimationFrame(e), !document.hidden && (Ht = yr(Ht), Ua.forEach((t) => t(Ht)));
  };
  e();
}
function br() {
  cancelAnimationFrame(vr);
}
const gs = 5, Ny = 56, Dy = { share: 0.6 }, Py = (e) => -Math.sqrt(2 * rs * Dy.share * e), Ot = (e, t) => e.find((n) => n.id === t) ?? null;
function ex(e, t = yr().floors) {
  const n = Ot(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : ps(e.on) : null, o = s && Ot(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function wr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Rt().floors) {
  const u = Ot(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || jy(u, d, o)) && qy(d, r, i) ? { x: d.x, y: d.y } : null;
}
const vs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, jy = (e, t, n) => !vs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function tx(e, t = Rt().floors) {
  if (!vs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= gs && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function qy(e, t, n = Rt().floors) {
  const a = Ot(n, "home");
  return e.posture === "hang" && a && Ze(e, t).bottom >= a.top ? !1 : ds(e, t);
}
function nx(e, t, n, a = Rt().floors) {
  const s = wr(e, n, a);
  if (!e.home) return Fy(e, t, s, a);
  if (!s) return null;
  const o = Ot(a, "home"), l = s.y - t.y, r = l > gs ? "dropping" : -l > Ny ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function Fy(e, t, n, a) {
  const s = n ? Ot(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Py(e.risen) };
  if (!n) return null;
  if (vs(t) && n.y - t.y > gs) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function ax(e, t, n) {
  const a = fs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function sx(e, t, n, a = Rt().floors) {
  const s = t && wr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Wy = ["data-type"], Hy = { class: "figure-floor-name" }, Uy = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", Hy, w(e.floor.type), 1)
    ], 12, Wy));
  }
}, zy = /* @__PURE__ */ K(Uy, [["__scopeId", "data-v-4e0f1e2e"]]), Vy = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Gy = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ue(Rt().floors);
    let n = () => {
    };
    return Ce(() => {
      n = Ry((a) => t.value = a.floors), Ly();
    }), Te(() => {
      n(), br();
    }), (a, s) => (c(), h("div", Vy, [
      (c(!0), h(G, null, te(t.value, (o) => (c(), F(zy, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, ox = /* @__PURE__ */ K(Gy, [["__scopeId", "data-v-e519168b"]]), va = (e) => typeof e == "number" ? e : Date.parse(e);
function lx(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: va(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => va(s.row.created_at) - va(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Ky = 3, ya = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Yy(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ya[n.grouping]) == null ? void 0 : a.call(ya, e.row, n)) || "";
}
function Zy(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function rx(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Ky ? [Zy(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = Yy(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const Jy = 1e3;
function Xy() {
  const e = O(Date.now()), t = setInterval(() => e.value = Date.now(), Jy);
  return vt(() => clearInterval(t)), e;
}
const Qy = ["datetime", "title"], Gn = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Xy(), a = T(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(q(_l)(e.at, q(n))), 9, Qy));
  }
};
function ix(e) {
  const t = ot(), n = t.option("row"), a = O(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), he(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function eb(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const cx = (e) => (t) => t.filter((n) => n.id !== e), ux = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), dx = (e) => (t) => [...t, e], fx = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function hx(e, t = {}) {
  const n = ot(), a = O(null), s = O("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function mx(e) {
  const t = ot(), n = O("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const vn = /* @__PURE__ */ new Map();
function tb(e, t) {
  if (vn.has(e)) return vn.get(e);
  const n = t().finally(() => vn.delete(e));
  return vn.set(e, n), n;
}
function px() {
  const e = ot(), t = O(null), n = O("");
  async function a() {
    const s = await tb(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const nb = { class: "cards-page" }, ab = { class: "cards-bar" }, sb = { class: "cards-count" }, ob = { class: "cards" }, lb = {
  key: 1,
  class: "cards-note"
}, rb = {
  key: 2,
  class: "cards-note"
}, ib = ["data-row", "onClick"], cb = { class: "card-head" }, ub = { class: "card-title" }, db = { class: "card-foot" }, fb = {
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
    return (a, s) => (c(), h("div", nb, [
      g("div", ab, [
        g("span", sb, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        L(ue, Ke({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: N(() => [
            L(me, {
              name: "plus",
              size: 12
            }),
            ne(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", ob, [
        e.loaded ? e.failure ? (c(), h("p", lb, w(e.failure), 1)) : e.rows.length ? C("", !0) : (c(), h("p", rb, "No " + w(e.noun) + "s yet", 1)) : (c(), F(yt, {
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
          g("span", cb, [
            L(me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ne(" " + w(e.head(o)), 1),
            L(Gn, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", ub, w(e.title(o)), 1),
          g("span", db, w(e.foot(o)), 1)
        ], 8, ib))), 128))
      ]),
      ce(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, gx = /* @__PURE__ */ K(fb, [["__scopeId", "data-v-990e6b37"]]), bo = "newest";
function vx(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = $e(Se, null)) == null ? void 0 : u.search, s = O(""), o = O(bo), l = O("all"), r = T(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => eb(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === bo ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = T(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const hb = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, mb = 40, pb = "top", gb = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = $e(Se, null)) == null ? void 0 : f.autoScroll, s = T(() => a === pb), o = O(null), l = O(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= mb;
    }
    return he(() => n.rowCount, async () => {
      await st(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (c(), h("div", hb, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ce(m.$slots, "default", {}, void 0, !0)
      ], 34),
      L(Tt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: N(() => [
          Ye(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            L(me, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = ne(" Newest ", -1))
          ], 512), [
            [Ao, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, yx = /* @__PURE__ */ K(gb, [["__scopeId", "data-v-3accb764"]]), vb = ["aria-selected", "data-tab", "onClick"], yb = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, bb = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = $e(Se, null), o = T(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = O(null), r = O({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var k;
      const v = (k = l.value) == null ? void 0 : k.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const d = () => st(() => u(!0));
    let f = null;
    return Ce(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Te(() => f == null ? void 0 : f.disconnect()), he(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), he(() => n.answer, d, { deep: !0 }), (m, v) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(G, null, te(o.value, (k) => {
        var A, x;
        return c(), h("button", {
          key: k.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((A = e.active) == null ? void 0 : A.key) === k.key }]),
          "aria-selected": ((x = e.active) == null ? void 0 : x.key) === k.key,
          "data-tab": k.key,
          onClick: (I) => a("choose", k)
        }, [
          ne(w(k.label) + " ", 1),
          i(k) ? (c(), h("span", yb, w(e.answer[k.count_field]), 1)) : C("", !0)
        ], 10, vb);
      }), 128)),
      g("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: fe({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, bx = /* @__PURE__ */ K(bb, [["__scopeId", "data-v-63fcd326"]]), wb = {
  class: "tab-body",
  "data-tab-body": ""
}, kb = { "data-tab-content": "" }, xb = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = O(!1);
    let a = 0;
    return he(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Za(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", wb, [
      n.value ? (c(), F(yt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : C("", !0),
      Ye(g("div", kb, [
        ce(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Ao, !n.value]
      ])
    ]));
  }
}, wx = /* @__PURE__ */ K(xb, [["__scopeId", "data-v-63876533"]]), $b = {}, Mb = { class: "menu-label" };
function Sb(e, t) {
  return c(), h("span", Mb, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const za = /* @__PURE__ */ K($b, [["render", Sb], ["__scopeId", "data-v-aa955b3e"]]), _b = {
  class: "search-bar",
  "data-search-bar": ""
}, Eb = { class: "search-bar-control" }, Ab = ["value", "placeholder", "aria-label"], Cb = ["aria-expanded"], Ob = {
  key: 0,
  "data-menu-count": ""
}, Tb = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var I;
    const a = e, s = n, o = Dr(), l = ((I = $e(Se, null)) == null ? void 0 : I.search) ?? {}, r = T(() => l.placeholder || a.placeholder), i = l.context ?? [], u = O(null), d = O(null), f = O([]), m = T(() => f.value.length ? f.value[f.value.length - 1].next : i), v = T(() => !!o.menu || i.length > 0), k = (z) => {
      f.value = [], d.value = d.value ? null : z.currentTarget;
    };
    function A(z) {
      if (z.next.length) {
        f.value = [...f.value, z];
        return;
      }
      d.value = null, s("pick", z.click);
    }
    function x() {
      var z;
      s("update:modelValue", ""), (z = u.value) == null || z.focus();
    }
    return t({ focus: () => {
      var z;
      return (z = u.value) == null ? void 0 : z.focus();
    } }), (z, ee) => {
      var P;
      return c(), h("div", _b, [
        g("div", Eb, [
          L(me, {
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
            placeholder: r.value,
            "aria-label": r.value,
            onInput: ee[0] || (ee[0] = (_) => s("update:modelValue", _.target.value)),
            onKeydown: Ut(x, ["esc"])
          }, null, 40, Ab),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: x
          }, [
            L(me, {
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
            onClick: k
          }, [
            e.menuCount ? (c(), h("span", Ob, w(e.menuCount), 1)) : C("", !0),
            L(me, {
              name: "caret",
              size: 12
            })
          ], 8, Cb)) : C("", !0)
        ]),
        (P = q(l).button) != null && P.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: ee[1] || (ee[1] = (_) => s("pick", q(l).button.click))
        }, w(q(l).button.title), 1)) : C("", !0),
        ce(z.$slots, "default", {}, void 0, !0),
        d.value ? (c(), F(Pn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: ee[3] || (ee[3] = be(() => {
          }, ["stop"])),
          onClose: ee[4] || (ee[4] = (_) => d.value = null)
        }, {
          default: N(() => [
            f.value.length ? (c(), F(mt, {
              key: 0,
              "data-search-back": "",
              onClick: ee[2] || (ee[2] = (_) => f.value = f.value.slice(0, -1))
            }, {
              default: N(() => [
                ne("‹ " + w(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : C("", !0),
            (c(!0), h(G, null, te(m.value, (_) => (c(), F(mt, {
              key: _.title,
              description: _.subtext,
              "data-search-entry": _.title,
              onClick: (S) => A(_)
            }, {
              default: N(() => [
                ne(w(_.title) + w(_.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? C("", !0) : ce(z.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : C("", !0)
      ]);
    };
  }
}, Bb = /* @__PURE__ */ K(Tb, [["__scopeId", "data-v-36dee105"]]), Ib = {
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
    return (o, l) => (c(), F(Bb, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: N(() => [
        L(za, null, {
          default: N(() => [...l[2] || (l[2] = [
            ne("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(G, null, te(a, (r) => L(mt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: N(() => [
            ne(w(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(G, { key: 0 }, [
          L(za, null, {
            default: N(() => [...l[3] || (l[3] = [
              ne("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(G, null, te(s, (r) => L(mt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: N(() => [
              ne(w(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : C("", !0)
      ]),
      default: N(() => [
        ce(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, kx = /* @__PURE__ */ K(Ib, [["__scopeId", "data-v-dab0064d"]]);
function xx() {
  const e = O(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const $x = (e) => import(
  /* @vite-ignore */
  e
), Rb = 86400, Va = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Lb(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Va(t) - Va(e)) / Rb);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function Mx(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Va(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Lb(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ba = 280, wa = 240, ka = 120, Nb = 6, Db = 14, Qt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Pb(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function kr(e, t) {
  const n = Math.max(0, Pb(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function jb(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Db}px)` }), e.offsetHeight, e.style.transition = `height ${ba}ms ${Qt}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = kr(t, e));
    const m = s() - r;
    if (!i && m >= ba && (i = !0, e.style.transition = `opacity ${wa}ms ease-out, transform ${wa}ms ${Qt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < ba + wa) return a(f);
    d();
  };
  return a(f), d;
}
function Sx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Nb}px)` }), e.offsetHeight, e.style.transition = `opacity ${ka}ms ease-out, transform ${ka}ms ${Qt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = kr(t, e)), s() - l < ka) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const qb = 140, yn = 220, wo = 5;
function _x({ gap: e = qb, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, wo);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, v = jb) => {
    if (l || !f.pane || !f.follows()) return m();
    const k = { el: d, options: f, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, r(k, () => o = t(i, e));
    d.style.display = "none", n.push(k), n.length >= wo && u.flush();
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
function Ex(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${yn}ms ${Qt}, opacity ${yn}ms ease-in, margin ${yn}ms ${Qt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, yn);
}
const xr = "chat.pins.minimised", Mn = O(Sn(xr, !1));
function ko(e) {
  Mn.value = e, es(xr, e);
}
function Fb(e) {
  const t = T(() => e()), n = T(() => Mn.value ? [] : e()), a = () => ko(!Mn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => pt(o) > s).length,
    (o, l) => o > l && ko(!1)
  ), { pins: t, visible: n, minimised: Mn, toggle: a };
}
const Wb = ["title"], Hb = {
  key: 0,
  class: "pins-count"
}, Ub = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Fb(() => t.pinRows);
    return (o, l) => q(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: q(a), inline: e.inline }]),
      title: q(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = be((...r) => q(s) && q(s)(...r), ["stop"]))
    }, [
      L(me, {
        name: q(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      q(a) ? (c(), h("span", Hb, w(q(n).length), 1)) : C("", !0)
    ], 10, Wb)) : C("", !0);
  }
}, Ax = /* @__PURE__ */ K(Ub, [["__scopeId", "data-v-d073c504"]]), zb = ["title"], Vb = ["title"], Gb = { class: "diff-card-dir" }, Kb = { class: "diff-card-name" }, Yb = ["title"], Zb = ["title"], Jb = {
  key: 0,
  class: "diff-card-note"
}, Xb = ["href"], Qb = ["src", "alt"], ew = { class: "diff-card-rows" }, tw = { class: "diff-row-num" }, nw = { class: "diff-row-sign" }, aw = { class: "diff-row-code" }, sw = {
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
    function o(E) {
      (E.metaKey || E.ctrlKey) && (E.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = T(() => n.path.lastIndexOf("/") + 1), u = T(() => n.path.slice(0, i.value)), d = T(() => n.path.slice(i.value)), f = T(() => n.change === "deleted"), m = T(() => l[n.change]), v = T(() => new Set(n.rows.filter((E) => E.line_type === "add").map((E) => E.line))), k = O("after"), A = T(() => k.value === "before" ? n.whole.old : n.whole.text), x = T(() => n.whole && n.whole.text !== void 0 ? A.value.split(`
`).map((E, b) => ({ line_type: k.value === "after" && v.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: E })) : n.rows.filter(
      (E) => !(n.editsOnly && ["ctx", "fold"].includes(E.line_type)) && !(n.hideRemovals && E.line_type === "del")
    )), I = O(!1), z = T(() => n.lines && !I.value && !n.whole), ee = T(() => z.value ? x.value.slice(0, n.lines) : x.value), P = T(() => x.value.length - ee.value.length), _ = (E) => E.line === null || E.line_type === "del" ? "" : E.line, S = (E) => E.line_type === "fold" ? E.hidden ? `⋯ ${E.hidden} lines` : "⋯" : E.text, $ = O(null), M = O(null);
    let y = null;
    return Ce(() => {
      if (!M.value) return;
      let E = !0;
      y = new ResizeObserver(() => {
        !$.value || !M.value || ($.value.style.transition = E ? "none" : "", $.value.style.height = `${M.value.offsetHeight}px`, E = !1);
      }), y.observe(M.value);
    }), Te(() => y && y.disconnect()), (E, b) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (p) => !f.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${q(s)}-click to open it`,
          onClick: o
        }, [
          g("span", Gb, w(u.value), 1),
          g("span", Kb, w(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, w(m.value), 3)) : C("", !0)
        ], 8, Vb),
        g("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        g("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
        L(Gn, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: k.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = be((p) => k.value = k.value === "after" ? "before" : "after", ["stop"]))
        }, w(k.value === "after" ? "After" : "Before"), 9, Yb)) : C("", !0),
        f.value ? C("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = be((p) => a("whole"), ["stop"]))
        }, [
          L(me, {
            name: "file",
            size: 12
          })
        ], 10, Zb))
      ], 8, zb),
      e.whole && e.whole.error ? (c(), h("p", Jb, w(e.whole.error), 1)) : C("", !0),
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
          }, null, 8, Qb)
        ], 8, Xb)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: $,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: M,
            class: "diff-card-diff"
          }, [
            g("div", ew, [
              (c(!0), h(G, null, te(ee.value, (p, R) => (c(), h("div", {
                key: R,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", tw, w(_(p)), 1),
                g("span", nw, w(r[p.line_type]), 1),
                g("span", aw, w(S(p)), 1)
              ], 2))), 128)),
              P.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = be((p) => I.value = !0, ["stop"]))
              }, w(P.value) + " more " + w(P.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, Cx = /* @__PURE__ */ K(sw, [["__scopeId", "data-v-23581cbb"]]), ow = {
  key: 0,
  class: "window-failure"
}, lw = {
  __name: "DocumentWindow",
  props: { line: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ot(), a = O(null);
    async function s() {
      a.value = await n.read(t.line);
    }
    return n.follow(["*.*"], s), s(), (o, l) => a.value && !a.value.ok ? (c(), h("p", ow, w(a.value.error), 1)) : a.value ? (c(), F(lh, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : C("", !0);
  }
}, rw = {
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
    const n = t, a = e, s = T(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = T(() => s.value && { render: () => Nn(lw, { line: s.value.line }) }), l = O(null), r = T(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = l.value) != null && v.component_trusted);
    }), i = T(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = T(
      () => {
        var m, v;
        return l.value ? Op(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
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
    return he(
      () => {
        var m, v;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((v = s.value) == null ? void 0 : v.line);
      },
      async () => {
        await d(), u.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, v) => {
      var k, A;
      return !s.value && ((k = e.catalogue.loaded) == null ? void 0 : k.value) === !1 ? (c(), F(os, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((A = s.value) == null ? void 0 : A.shows) === "one-agent" && e.agent === null ? (c(), F(zt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), F(qt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), F(Rl, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (x, I) => n("option", x, I))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), F(Il, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (x, I) => n("option", x, I))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), F(qt, {
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
        onOption: v[2] || (v[2] = (x, I) => n("option", x, I))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), F(qt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (x) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, iw = ["data-section"], cw = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = $e(ic, null), a = T(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = T(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(G, null, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      L(rw, {
        name: r.name,
        catalogue: q(n).catalogue,
        subscriptions: q(n).subscriptions,
        environment: q(n).environment,
        prompts: q(n).prompts,
        "shell-read": q(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, iw))), 128));
  }
}, uw = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), F(ue, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: N(() => [
        L(me, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, dw = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, fw = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, hw = { class: "ask-text" }, mw = ["placeholder", "aria-label"], pw = ["placeholder", "aria-label"], gw = {
  key: 3,
  class: "moves"
}, vw = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = T(() => Cg(a.noun, a.row)), l = O(""), r = O(null), i = O(""), u = O("");
    he(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(v, k = "") {
      const A = await a.read([v.noun ?? a.noun, v.word, String(a.id), ...v.flag ? [v.flag, k] : v.positional ? [k] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = A.ok ? "" : A.error, A.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (v) => v.confirm ? r.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (r.value = v, i.value = "") : d(v), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (v, k) => {
      var A;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        l.value ? (c(), h("p", dw, w(l.value), 1)) : C("", !0),
        (A = r.value) != null && A.confirm ? (c(), h("div", fw, [
          g("span", hw, w(r.value.confirm), 1),
          L(ue, {
            small: "",
            variant: r.value.danger ? "ghost" : "primary",
            bordered: r.value.danger,
            class: Z({ danger: r.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: k[0] || (k[0] = (x) => d(r.value))
          }, {
            default: N(() => [
              ne(w(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["variant", "bordered", "class"]),
          L(ue, {
            small: "",
            variant: "ghost",
            onClick: k[1] || (k[1] = (x) => r.value = null)
          }, {
            default: N(() => [...k[7] || (k[7] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: be(m, ["prevent"])
        }, [
          Ye(g("input", {
            "onUpdate:modelValue": k[2] || (k[2] = (x) => i.value = x),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: k[3] || (k[3] = Ut(be((x) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, mw), [
            [Sa, i.value]
          ]),
          r.value.opener ? Ye((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": k[4] || (k[4] = (x) => u.value = x),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: k[5] || (k[5] = Ut(be((x) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, pw)), [
            [Sa, u.value]
          ]) : C("", !0),
          L(ue, {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: N(() => [
              ne(w(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          L(ue, {
            small: "",
            variant: "ghost",
            onClick: k[6] || (k[6] = (x) => r.value = null)
          }, {
            default: N(() => [...k[8] || (k[8] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", gw, [
          (c(!0), h(G, null, te(o.value, (x) => (c(), F(ue, {
            key: x.word,
            small: !x.bordered,
            bordered: x.bordered,
            icon: x.icon,
            variant: x.main ? "primary" : "ghost",
            class: Z({ danger: x.danger }),
            "data-move": x.word,
            onClick: (I) => f(x)
          }, {
            default: N(() => [
              ne(w(x.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : C("", !0);
    };
  }
}, yw = /* @__PURE__ */ K(vw, [["__scopeId", "data-v-0262f48f"]]), bw = /* @__PURE__ */ new Set(["completed", "cancelled"]), ww = (e) => bw.has(e), Ln = (e) => ww(e) ? "done" : e, kw = { class: "facts" }, xw = { class: "fact wide" }, $w = { class: "fact-value" }, Mw = {
  key: 0,
  class: "fact"
}, Sw = { class: "fact-value" }, _w = { class: "fact" }, Ew = { class: "fact-label" }, Aw = ["title"], Cw = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Ow = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Tw = {
  key: 2,
  class: "fact"
}, Bw = { class: "fact-value" }, Iw = { class: "fact wide" }, Rw = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Lw = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Cn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return c(), h("div", kw, [
        g("div", xw, [
          l[2] || (l[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", $w, w((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Mw, [
          l[3] || (l[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", Sw, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.helper_id ? (c(), h(G, { key: 1 }, [
          g("div", _w, [
            g("span", Ew, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[0] || (l[0] = (u) => q(De)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, Aw)
          ]),
          q(s).has(e.task.state) ? (c(), h("p", Cw, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", Ow, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : C("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", Tw, [
          l[4] || (l[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", Bw, "Agent " + w(e.task.holder_id), 1)
        ])) : C("", !0),
        g("div", Iw, [
          l[5] || (l[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          L(jn, {
            options: q(n),
            value: String(q(Al)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[1] || (l[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", Rw, w(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, Nw = /* @__PURE__ */ K(Lw, [["__scopeId", "data-v-2bcdca7a"]]), Dw = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, Pw = ["datetime"], jw = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", Dw, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(G, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, w(new Date(a.created_at).toLocaleString()), 9, Pw),
        g("p", null, w(a.reason), 1)
      ]))), 128))
    ])) : C("", !0);
  }
}, qw = /* @__PURE__ */ K(jw, [["__scopeId", "data-v-b41f213b"]]), Fw = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Ww = { ...Fw, done: "Completed" }, Hw = { class: "task-status-icon" }, Uw = ["width", "height", "aria-label"], zw = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = T(() => Wo("task", Ln(t.status))), a = T(() => n.value === "testing" ? "started" : n.value), s = T(() => Ww[t.status] ?? Fo("task", t.status));
    return (o, l) => (c(), h("span", Hw, [
      L(Tt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: N(() => [
          (c(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            L(Bt, { value: a.value }, {
              blocked: N(() => [...l[0] || (l[0] = [
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
              done: N(() => [...l[1] || (l[1] = [
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
              started: N(() => [...l[2] || (l[2] = [
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
              asked: N(() => [...l[3] || (l[3] = [
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
              paused: N(() => [...l[4] || (l[4] = [
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
              planned: N(() => [...l[5] || (l[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: N(() => [...l[6] || (l[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Uw))
        ]),
        _: 1
      })
    ]));
  }
}, $r = /* @__PURE__ */ K(zw, [["__scopeId", "data-v-ae24a63f"]]), Vw = {
  class: "part",
  "data-resource-waits": ""
}, Gw = ["onClick"], Kw = { class: "wait-id" }, Yw = { class: "wait-title" }, Zw = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", Vw, [
      g("h4", null, w(e.title), 1),
      (c(!0), h(G, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        L($r, {
          status: q(Ln)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", Kw, w(o.id), 1),
        g("span", Yw, w(o.title), 1)
      ], 8, Gw))), 128))
    ]));
  }
}, xo = /* @__PURE__ */ K(Zw, [["__scopeId", "data-v-8fb2e251"]]), Jw = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Xw = { class: "text" }, Qw = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, e2 = 180, t2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = O(!1), l = T(() => a.task.waits.filter((i) => !n.has(i.state))), r = T(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(G, null, [
      l.value.length ? (c(), F(xo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", Jw, [
        u[3] || (u[3] = g("h4", null, "How it was done", -1)),
        g("p", Xw, w(e.task.outcome), 1)
      ])) : C("", !0),
      e.task.brief ? (c(), h("section", Qw, [
        u[4] || (u[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: Z(["text", { clamped: !o.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > e2 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : C("", !0)
      ])) : C("", !0),
      r.value.length ? (c(), F(xo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0)
    ], 64));
  }
}, n2 = /* @__PURE__ */ K(t2, [["__scopeId", "data-v-4a3f1e79"]]), a2 = {
  class: "task-details",
  "data-task-details": ""
}, s2 = { class: "since" }, o2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, l2 = { class: "text" }, r2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, i2 = {
  key: 1,
  class: "note"
}, c2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, u2 = { class: "text" }, d2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", a2, [
        g("div", {
          class: Z(["state-line", q(Ln)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            L($r, {
              status: q(Ln)(e.task.state)
            }, null, 8, ["status"]),
            ne(" " + w(a(e.task.state)), 1)
          ]),
          g("span", s2, [
            o[3] || (o[3] = ne(" since ", -1)),
            L(Gn, {
              at: q(yl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", o2, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", l2, w(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", r2, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", i2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", c2, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", u2, w(e.task.reason), 1)
        ])) : C("", !0),
        L(Nw, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        L(n2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (r) => n("select", r))
        }, null, 8, ["task"]),
        L(qw, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, f2 = /* @__PURE__ */ K(d2, [["__scopeId", "data-v-408e9f91"]]), h2 = 50, m2 = { messages: 25 }, p2 = (e) => m2[e] || h2, g2 = {
  class: "task-log",
  "aria-label": "Task log"
}, v2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, y2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, b2 = { class: "entries" }, w2 = ["datetime"], k2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, x2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = O([]), a = O(1), s = O(!0), o = O(!0), l = O("");
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
        String(p2("task_logs")),
        "--page",
        String(u)
      ]);
      d === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return he(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), vt(() => {
      r += 1;
    }), (u, d) => (c(), h("section", g2, [
      o.value ? (c(), F(yt, { key: 0 })) : l.value ? (c(), h(G, { key: 1 }, [
        g("p", v2, w(l.value), 1),
        L(ue, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: N(() => [...d[3] || (d[3] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(G, { key: 2 }, [
        n.value.length ? C("", !0) : (c(), h("p", y2, "No log entries yet.")),
        g("ol", b2, [
          (c(!0), h(G, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, w(new Date(f.created_at).toLocaleString()), 9, w2),
            g("p", null, w(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", k2, [
          L(ue, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: N(() => [...d[4] || (d[4] = [
              ne("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + w(a.value), 1),
          L(ue, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: N(() => [...d[5] || (d[5] = [
              ne("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : C("", !0)
      ], 64))
    ]));
  }
}, $2 = /* @__PURE__ */ K(x2, [["__scopeId", "data-v-98b3a6b1"]]), M2 = { class: "comment-side-head" }, S2 = {
  key: 0,
  class: "comment-none"
}, _2 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", M2, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        L(Qa, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      e.comments.length ? C("", !0) : (c(), h("p", S2, "No comments yet")),
      (c(!0), h(G, null, te(e.comments, (a) => (c(), h("p", {
        key: a.id,
        class: "comment",
        "data-comment": ""
      }, w(e.words(a)), 1))), 128))
    ], 2));
  }
}, E2 = /* @__PURE__ */ K(_2, [["__scopeId", "data-v-19fdbdd4"]]);
var Mo;
/Mac|iPhone|iPad/.test(((Mo = navigator.userAgentData) == null ? void 0 : Mo.platform) || navigator.platform);
function A2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const C2 = ["placeholder"], O2 = { class: "actions" }, T2 = { class: "error" }, B2 = {
  key: 1,
  class: "card closed"
}, I2 = { class: "mark" }, R2 = { class: "prompt" }, L2 = {
  key: 0,
  class: "draft"
}, N2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ma({
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
  emits: /* @__PURE__ */ Ma(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = $a(e, "draft"), l = $a(e, "error"), r = O(!!l.value), i = O(!1), u = O(!1), d = O(null);
    async function f() {
      var k, A;
      r.value = !0, i.value = !1, await st(), (A = ((k = d.value) == null ? void 0 : k.querySelector("input")) || d.value) == null || A.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function v() {
      const k = o.value.trim();
      if (!(!k || !a.ready || u.value)) {
        l.value = "", u.value = !0, o.value = "";
        try {
          await a.send(k), r.value = !1, i.value = !0;
        } catch (A) {
          o.value = k, l.value = A.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (k, A) => (c(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: be(v, ["prevent"]),
        onKeydown: Ut(m, ["esc"])
      }, [
        ce(k.$slots, "who", {}, void 0, !0),
        Ye(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": A[0] || (A[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: A[1] || (A[1] = Ut((x) => q(A2)(x, v), ["enter"]))
        }, null, 40, C2), [
          [Sa, o.value]
        ]),
        g("div", O2, [
          g("span", T2, w(l.value), 1),
          L(ue, {
            small: "",
            onClick: m
          }, {
            default: N(() => [...A[3] || (A[3] = [
              ne("Cancel", -1)
            ])]),
            _: 1
          }),
          L(ue, {
            variant: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: N(() => [...A[4] || (A[4] = [
              ne("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", B2, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", I2, [
            L(me, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", R2, w(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", L2, "Draft kept")) : C("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: A[2] || (A[2] = (x) => s("show"))
        }, [
          g("span", null, w(q(fi)(e.count, "comment")), 1),
          L(me, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, D2 = /* @__PURE__ */ K(N2, [["__scopeId", "data-v-b68baddd"]]);
function P2(e, t) {
  const n = O([]), a = O(!1);
  let s = 0, o = 0;
  const l = (u) => {
    const { noun: d, id: f, title: m } = e(), v = `On ${d} ${f}, ${m}: `;
    return u.text.startsWith(v) ? u.text.slice(v.length) : u.text;
  };
  async function r() {
    const { noun: u, id: d } = e();
    if (!d) return;
    const f = ++o, m = await t([u, "comments", String(d)]);
    f === o && (n.value = m.ok ? m.value.rows ?? [] : []);
  }
  async function i(u) {
    const { noun: d, id: f } = e(), m = { id: `sending-${++s}`, text: u };
    n.value = [...n.value, m], a.value = !0;
    const v = await t([d, "comment", String(f), u]);
    if (!v.ok)
      throw n.value = n.value.filter((k) => k !== m && k.id !== m.id), new Error(v.error);
    await r();
  }
  return he(() => e().id, () => {
    a.value = !1, n.value = [], r();
  }, { immediate: !0 }), { comments: n, open: a, words: l, send: i, load: r };
}
const j2 = { class: "top" }, q2 = {
  class: "crumb",
  "data-task-crumb": ""
}, F2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, W2 = {
  key: 1,
  class: "body"
}, H2 = { class: "summary" }, U2 = { class: "stamp" }, z2 = {
  class: "title",
  "data-resource-title": ""
}, V2 = {
  class: "tabs",
  "data-task-tabs": ""
}, G2 = { class: "panels" }, K2 = {
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
    const a = e, s = n, o = O(null), l = O(null), r = O(""), i = O(""), u = O(null), d = O(null), f = O("details"), m = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = P2(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (P) => a.read(P)
    );
    let k = 0;
    const A = T(() => {
      var P;
      return (P = l.value) != null && P.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function x() {
      const P = ++k, [_, S] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      P === k && (r.value = _.ok ? "" : _.error, o.value = _.ok ? _.value : null, l.value = S.ok ? S.value : null);
    }
    he(
      () => a.id,
      () => {
        o.value = null, l.value = null, u.value = null, f.value = "details", x();
      },
      { immediate: !0 }
    ), he(() => a.changes, x), he(v.open, (P) => {
      P && (f.value = "comments");
    });
    async function I(P) {
      const _ = o.value.priority;
      o.value.priority = Number(P);
      const S = await a.read(["task", "edit", String(a.id), "--priority", P]);
      if (i.value = S.ok ? "" : S.error, S.ok) return x();
      o.value.priority = _;
    }
    function z(P) {
      u.value = null, d.value.press(P);
    }
    const ee = (P) => {
      var _;
      return ((_ = d.value) == null ? void 0 : _.moves.length) && (u.value = P);
    };
    return t({ openStatus: ee }), (P, _) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", j2, [
        e.backed ? (c(), F(uw, {
          key: 0,
          onBack: _[0] || (_[0] = (S) => s("back"))
        })) : C("", !0),
        g("span", q2, w(A.value), 1),
        _[9] || (_[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(G, { key: 1 }, [
          L(ue, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: _[1] || (_[1] = (S) => s("step", -1))
          }, {
            default: N(() => [
              L(me, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          L(ue, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: _[2] || (_[2] = (S) => s("step", 1))
          }, {
            default: N(() => [
              L(me, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : C("", !0),
        L(ue, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: _[3] || (_[3] = (S) => s("close"))
        }, {
          default: N(() => [
            L(me, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      r.value ? (c(), h("p", F2, w(r.value), 1)) : o.value ? (c(), h(G, { key: 2 }, [
        L(yw, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: x
        }, null, 8, ["id", "row", "read"]),
        g("header", H2, [
          g("div", U2, [
            ne(" Task " + w(o.value.id) + " · updated ", 1),
            L(Gn, {
              at: q(yl)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", z2, w(o.value.title), 1)
        ]),
        g("div", V2, [
          L(jn, {
            options: m,
            value: f.value,
            onPick: _[4] || (_[4] = (S) => f.value = S)
          }, null, 8, ["value"])
        ]),
        g("div", G2, [
          L(Bt, { value: f.value }, {
            details: N(() => [
              L(f2, {
                task: o.value,
                place: l.value,
                refusal: i.value,
                onStatus: ee,
                onPriority: I,
                onSelect: _[5] || (_[5] = (S) => s("select", S))
              }, null, 8, ["task", "place", "refusal"]),
              L(cw, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"])
            ]),
            comments: N(() => [
              L(E2, {
                below: "",
                comments: q(v).comments.value,
                words: q(v).words,
                onClose: _[6] || (_[6] = (S) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: N(() => [
              L($2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        L(D2, {
          send: q(v).send,
          count: q(v).comments.value.length,
          onShow: _[7] || (_[7] = (S) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", W2, [
        L(yt)
      ])),
      u.value ? (c(), F(Pn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: _[8] || (_[8] = (S) => u.value = null)
      }, {
        default: N(() => [
          L(za, null, {
            default: N(() => [
              ne("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(G, null, te(d.value.moves, (S) => (c(), F(mt, {
            key: S.word,
            onClick: ($) => z(S)
          }, {
            default: N(() => [
              ne(w(S.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : C("", !0)
    ], 2));
  }
}, Ox = /* @__PURE__ */ K(K2, [["__scopeId", "data-v-a1cff4e4"]]);
function Y2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var xa = { exports: {} }, $o;
function Z2() {
  return $o || ($o = 1, (function(e, t) {
    var n = (function() {
      var a = function(_, S) {
        var $ = 236, M = 17, y = _, E = o[S], b = null, p = 0, R = null, B = [], H = {}, X = function(j, W) {
          p = y * 4 + 17, b = (function(D) {
            for (var U = new Array(D), V = 0; V < D; V += 1) {
              U[V] = new Array(D);
              for (var Q = 0; Q < D; Q += 1)
                U[V][Q] = null;
            }
            return U;
          })(p), J(0, 0), J(p - 7, 0), J(0, p - 7), ve(), ie(), qe(j, W), y >= 7 && Oe(j), R == null && (R = Mr(y, E, B)), Fe(R, W);
        }, J = function(j, W) {
          for (var D = -1; D <= 7; D += 1)
            if (!(j + D <= -1 || p <= j + D))
              for (var U = -1; U <= 7; U += 1)
                W + U <= -1 || p <= W + U || (0 <= D && D <= 6 && (U == 0 || U == 6) || 0 <= U && U <= 6 && (D == 0 || D == 6) || 2 <= D && D <= 4 && 2 <= U && U <= 4 ? b[j + D][W + U] = !0 : b[j + D][W + U] = !1);
        }, Y = function() {
          for (var j = 0, W = 0, D = 0; D < 8; D += 1) {
            X(!0, D);
            var U = r.getLostPoint(H);
            (D == 0 || j > U) && (j = U, W = D);
          }
          return W;
        }, ie = function() {
          for (var j = 8; j < p - 8; j += 1)
            b[j][6] == null && (b[j][6] = j % 2 == 0);
          for (var W = 8; W < p - 8; W += 1)
            b[6][W] == null && (b[6][W] = W % 2 == 0);
        }, ve = function() {
          for (var j = r.getPatternPosition(y), W = 0; W < j.length; W += 1)
            for (var D = 0; D < j.length; D += 1) {
              var U = j[W], V = j[D];
              if (b[U][V] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? b[U + Q][V + oe] = !0 : b[U + Q][V + oe] = !1;
            }
        }, Oe = function(j) {
          for (var W = r.getBCHTypeNumber(y), D = 0; D < 18; D += 1) {
            var U = !j && (W >> D & 1) == 1;
            b[Math.floor(D / 3)][D % 3 + p - 8 - 3] = U;
          }
          for (var D = 0; D < 18; D += 1) {
            var U = !j && (W >> D & 1) == 1;
            b[D % 3 + p - 8 - 3][Math.floor(D / 3)] = U;
          }
        }, qe = function(j, W) {
          for (var D = E << 3 | W, U = r.getBCHTypeInfo(D), V = 0; V < 15; V += 1) {
            var Q = !j && (U >> V & 1) == 1;
            V < 6 ? b[V][8] = Q : V < 8 ? b[V + 1][8] = Q : b[p - 15 + V][8] = Q;
          }
          for (var V = 0; V < 15; V += 1) {
            var Q = !j && (U >> V & 1) == 1;
            V < 8 ? b[8][p - V - 1] = Q : V < 9 ? b[8][15 - V - 1 + 1] = Q : b[8][15 - V - 1] = Q;
          }
          b[p - 8][8] = !j;
        }, Fe = function(j, W) {
          for (var D = -1, U = p - 1, V = 7, Q = 0, oe = r.getMaskFunction(W), se = p - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (b[U][se - ye] == null) {
                  var ke = !1;
                  Q < j.length && (ke = (j[Q] >>> V & 1) == 1);
                  var re = oe(U, se - ye);
                  re && (ke = !ke), b[U][se - ye] = ke, V -= 1, V == -1 && (Q += 1, V = 7);
                }
              if (U += D, U < 0 || p <= U) {
                U -= D, D = -D;
                break;
              }
            }
        }, kt = function(j, W) {
          for (var D = 0, U = 0, V = 0, Q = new Array(W.length), oe = new Array(W.length), se = 0; se < W.length; se += 1) {
            var ye = W[se].dataCount, ke = W[se].totalCount - ye;
            U = Math.max(U, ye), V = Math.max(V, ke), Q[se] = new Array(ye);
            for (var re = 0; re < Q[se].length; re += 1)
              Q[se][re] = 255 & j.getBuffer()[re + D];
            D += ye;
            var Be = r.getErrorCorrectPolynomial(ke), Ie = u(Q[se], Be.getLength() - 1), ys = Ie.mod(Be);
            oe[se] = new Array(Be.getLength() - 1);
            for (var re = 0; re < oe[se].length; re += 1) {
              var bs = re + ys.getLength() - oe[se].length;
              oe[se][re] = bs >= 0 ? ys.getAt(bs) : 0;
            }
          }
          for (var ws = 0, re = 0; re < W.length; re += 1)
            ws += W[re].totalCount;
          for (var Kn = new Array(ws), rn = 0, re = 0; re < U; re += 1)
            for (var se = 0; se < W.length; se += 1)
              re < Q[se].length && (Kn[rn] = Q[se][re], rn += 1);
          for (var re = 0; re < V; re += 1)
            for (var se = 0; se < W.length; se += 1)
              re < oe[se].length && (Kn[rn] = oe[se][re], rn += 1);
          return Kn;
        }, Mr = function(j, W, D) {
          for (var U = d.getRSBlocks(j, W), V = f(), Q = 0; Q < D.length; Q += 1) {
            var oe = D[Q];
            V.put(oe.getMode(), 4), V.put(oe.getLength(), r.getLengthInBits(oe.getMode(), j)), oe.write(V);
          }
          for (var se = 0, Q = 0; Q < U.length; Q += 1)
            se += U[Q].dataCount;
          if (V.getLengthInBits() > se * 8)
            throw "code length overflow. (" + V.getLengthInBits() + ">" + se * 8 + ")";
          for (V.getLengthInBits() + 4 <= se * 8 && V.put(0, 4); V.getLengthInBits() % 8 != 0; )
            V.putBit(!1);
          for (; !(V.getLengthInBits() >= se * 8 || (V.put($, 8), V.getLengthInBits() >= se * 8)); )
            V.put(M, 8);
          return kt(V, U);
        };
        H.addData = function(j, W) {
          W = W || "Byte";
          var D = null;
          switch (W) {
            case "Numeric":
              D = m(j);
              break;
            case "Alphanumeric":
              D = v(j);
              break;
            case "Byte":
              D = k(j);
              break;
            case "Kanji":
              D = A(j);
              break;
            default:
              throw "mode:" + W;
          }
          B.push(D), R = null;
        }, H.isDark = function(j, W) {
          if (j < 0 || p <= j || W < 0 || p <= W)
            throw j + "," + W;
          return b[j][W];
        }, H.getModuleCount = function() {
          return p;
        }, H.make = function() {
          if (y < 1) {
            for (var j = 1; j < 40; j++) {
              for (var W = d.getRSBlocks(j, E), D = f(), U = 0; U < B.length; U++) {
                var V = B[U];
                D.put(V.getMode(), 4), D.put(V.getLength(), r.getLengthInBits(V.getMode(), j)), V.write(D);
              }
              for (var Q = 0, U = 0; U < W.length; U++)
                Q += W[U].dataCount;
              if (D.getLengthInBits() <= Q * 8)
                break;
            }
            y = j;
          }
          X(!1, Y());
        }, H.createTableTag = function(j, W) {
          j = j || 2, W = typeof W > "u" ? j * 4 : W;
          var D = "";
          D += '<table style="', D += " border-width: 0px; border-style: none;", D += " border-collapse: collapse;", D += " padding: 0px; margin: " + W + "px;", D += '">', D += "<tbody>";
          for (var U = 0; U < H.getModuleCount(); U += 1) {
            D += "<tr>";
            for (var V = 0; V < H.getModuleCount(); V += 1)
              D += '<td style="', D += " border-width: 0px; border-style: none;", D += " border-collapse: collapse;", D += " padding: 0px; margin: 0px;", D += " width: " + j + "px;", D += " height: " + j + "px;", D += " background-color: ", D += H.isDark(U, V) ? "#000000" : "#ffffff", D += ";", D += '"/>';
            D += "</tr>";
          }
          return D += "</tbody>", D += "</table>", D;
        }, H.createSvgTag = function(j, W, D, U) {
          var V = {};
          typeof arguments[0] == "object" && (V = arguments[0], j = V.cellSize, W = V.margin, D = V.alt, U = V.title), j = j || 2, W = typeof W > "u" ? j * 4 : W, D = typeof D == "string" ? { text: D } : D || {}, D.text = D.text || null, D.id = D.text ? D.id || "qrcode-description" : null, U = typeof U == "string" ? { text: U } : U || {}, U.text = U.text || null, U.id = U.text ? U.id || "qrcode-title" : null;
          var Q = H.getModuleCount() * j + W * 2, oe, se, ye, ke, re = "", Be;
          for (Be = "l" + j + ",0 0," + j + " -" + j + ",0 0,-" + j + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += V.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', re += ' viewBox="0 0 ' + Q + " " + Q + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += U.text || D.text ? ' role="img" aria-labelledby="' + xt([U.id, D.id].join(" ").trim()) + '"' : "", re += ">", re += U.text ? '<title id="' + xt(U.id) + '">' + xt(U.text) + "</title>" : "", re += D.text ? '<description id="' + xt(D.id) + '">' + xt(D.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', ye = 0; ye < H.getModuleCount(); ye += 1)
            for (ke = ye * j + W, oe = 0; oe < H.getModuleCount(); oe += 1)
              H.isDark(ye, oe) && (se = oe * j + W, re += "M" + se + "," + ke + Be);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, H.createDataURL = function(j, W) {
          j = j || 2, W = typeof W > "u" ? j * 4 : W;
          var D = H.getModuleCount() * j + W * 2, U = W, V = D - W;
          return P(D, D, function(Q, oe) {
            if (U <= Q && Q < V && U <= oe && oe < V) {
              var se = Math.floor((Q - U) / j), ye = Math.floor((oe - U) / j);
              return H.isDark(ye, se) ? 0 : 1;
            } else
              return 1;
          });
        }, H.createImgTag = function(j, W, D) {
          j = j || 2, W = typeof W > "u" ? j * 4 : W;
          var U = H.getModuleCount() * j + W * 2, V = "";
          return V += "<img", V += ' src="', V += H.createDataURL(j, W), V += '"', V += ' width="', V += U, V += '"', V += ' height="', V += U, V += '"', D && (V += ' alt="', V += xt(D), V += '"'), V += "/>", V;
        };
        var xt = function(j) {
          for (var W = "", D = 0; D < j.length; D += 1) {
            var U = j.charAt(D);
            switch (U) {
              case "<":
                W += "&lt;";
                break;
              case ">":
                W += "&gt;";
                break;
              case "&":
                W += "&amp;";
                break;
              case '"':
                W += "&quot;";
                break;
              default:
                W += U;
                break;
            }
          }
          return W;
        }, Sr = function(j) {
          var W = 1;
          j = typeof j > "u" ? W * 2 : j;
          var D = H.getModuleCount() * W + j * 2, U = j, V = D - j, Q, oe, se, ye, ke, re = {
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
          for (Q = 0; Q < D; Q += 2) {
            for (se = Math.floor((Q - U) / W), ye = Math.floor((Q + 1 - U) / W), oe = 0; oe < D; oe += 1)
              ke = "█", U <= oe && oe < V && U <= Q && Q < V && H.isDark(se, Math.floor((oe - U) / W)) && (ke = " "), U <= oe && oe < V && U <= Q + 1 && Q + 1 < V && H.isDark(ye, Math.floor((oe - U) / W)) ? ke += " " : ke += "█", Ie += j < 1 && Q + 1 >= V ? Be[ke] : re[ke];
            Ie += `
`;
          }
          return D % 2 && j > 0 ? Ie.substring(0, Ie.length - D - 1) + Array(D + 1).join("▀") : Ie.substring(0, Ie.length - 1);
        };
        return H.createASCII = function(j, W) {
          if (j = j || 1, j < 2)
            return Sr(W);
          j -= 1, W = typeof W > "u" ? j * 2 : W;
          var D = H.getModuleCount() * j + W * 2, U = W, V = D - W, Q, oe, se, ye, ke = Array(j + 1).join("██"), re = Array(j + 1).join("  "), Be = "", Ie = "";
          for (Q = 0; Q < D; Q += 1) {
            for (se = Math.floor((Q - U) / j), Ie = "", oe = 0; oe < D; oe += 1)
              ye = 1, U <= oe && oe < V && U <= Q && Q < V && H.isDark(se, Math.floor((oe - U) / j)) && (ye = 0), Ie += ye ? ke : re;
            for (se = 0; se < j; se += 1)
              Be += Ie + `
`;
          }
          return Be.substring(0, Be.length - 1);
        }, H.renderTo2dContext = function(j, W) {
          W = W || 2;
          for (var D = H.getModuleCount(), U = 0; U < D; U++)
            for (var V = 0; V < D; V++)
              j.fillStyle = H.isDark(U, V) ? "black" : "white", j.fillRect(U * W, V * W, W, W);
        }, H;
      };
      a.stringToBytesFuncs = {
        default: function(_) {
          for (var S = [], $ = 0; $ < _.length; $ += 1) {
            var M = _.charCodeAt($);
            S.push(M & 255);
          }
          return S;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(_, S) {
        var $ = (function() {
          for (var y = z(_), E = function() {
            var ie = y.read();
            if (ie == -1) throw "eof";
            return ie;
          }, b = 0, p = {}; ; ) {
            var R = y.read();
            if (R == -1) break;
            var B = E(), H = E(), X = E(), J = String.fromCharCode(R << 8 | B), Y = H << 8 | X;
            p[J] = Y, b += 1;
          }
          if (b != S)
            throw b + " != " + S;
          return p;
        })(), M = 63;
        return function(y) {
          for (var E = [], b = 0; b < y.length; b += 1) {
            var p = y.charCodeAt(b);
            if (p < 128)
              E.push(p);
            else {
              var R = $[y.charAt(b)];
              typeof R == "number" ? (R & 255) == R ? E.push(R) : (E.push(R >>> 8), E.push(R & 255)) : E.push(M);
            }
          }
          return E;
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
        var _ = [
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
        ], S = 1335, $ = 7973, M = 21522, y = {}, E = function(b) {
          for (var p = 0; b != 0; )
            p += 1, b >>>= 1;
          return p;
        };
        return y.getBCHTypeInfo = function(b) {
          for (var p = b << 10; E(p) - E(S) >= 0; )
            p ^= S << E(p) - E(S);
          return (b << 10 | p) ^ M;
        }, y.getBCHTypeNumber = function(b) {
          for (var p = b << 12; E(p) - E($) >= 0; )
            p ^= $ << E(p) - E($);
          return b << 12 | p;
        }, y.getPatternPosition = function(b) {
          return _[b - 1];
        }, y.getMaskFunction = function(b) {
          switch (b) {
            case l.PATTERN000:
              return function(p, R) {
                return (p + R) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, R) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, R) {
                return R % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, R) {
                return (p + R) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, R) {
                return (Math.floor(p / 2) + Math.floor(R / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, R) {
                return p * R % 2 + p * R % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, R) {
                return (p * R % 2 + p * R % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, R) {
                return (p * R % 3 + (p + R) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + b;
          }
        }, y.getErrorCorrectPolynomial = function(b) {
          for (var p = u([1], 0), R = 0; R < b; R += 1)
            p = p.multiply(u([1, i.gexp(R)], 0));
          return p;
        }, y.getLengthInBits = function(b, p) {
          if (1 <= p && p < 10)
            switch (b) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + b;
            }
          else if (p < 27)
            switch (b) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + b;
            }
          else if (p < 41)
            switch (b) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + b;
            }
          else
            throw "type:" + p;
        }, y.getLostPoint = function(b) {
          for (var p = b.getModuleCount(), R = 0, B = 0; B < p; B += 1)
            for (var H = 0; H < p; H += 1) {
              for (var X = 0, J = b.isDark(B, H), Y = -1; Y <= 1; Y += 1)
                if (!(B + Y < 0 || p <= B + Y))
                  for (var ie = -1; ie <= 1; ie += 1)
                    H + ie < 0 || p <= H + ie || Y == 0 && ie == 0 || J == b.isDark(B + Y, H + ie) && (X += 1);
              X > 5 && (R += 3 + X - 5);
            }
          for (var B = 0; B < p - 1; B += 1)
            for (var H = 0; H < p - 1; H += 1) {
              var ve = 0;
              b.isDark(B, H) && (ve += 1), b.isDark(B + 1, H) && (ve += 1), b.isDark(B, H + 1) && (ve += 1), b.isDark(B + 1, H + 1) && (ve += 1), (ve == 0 || ve == 4) && (R += 3);
            }
          for (var B = 0; B < p; B += 1)
            for (var H = 0; H < p - 6; H += 1)
              b.isDark(B, H) && !b.isDark(B, H + 1) && b.isDark(B, H + 2) && b.isDark(B, H + 3) && b.isDark(B, H + 4) && !b.isDark(B, H + 5) && b.isDark(B, H + 6) && (R += 40);
          for (var H = 0; H < p; H += 1)
            for (var B = 0; B < p - 6; B += 1)
              b.isDark(B, H) && !b.isDark(B + 1, H) && b.isDark(B + 2, H) && b.isDark(B + 3, H) && b.isDark(B + 4, H) && !b.isDark(B + 5, H) && b.isDark(B + 6, H) && (R += 40);
          for (var Oe = 0, H = 0; H < p; H += 1)
            for (var B = 0; B < p; B += 1)
              b.isDark(B, H) && (Oe += 1);
          var qe = Math.abs(100 * Oe / p / p - 50) / 5;
          return R += qe * 10, R;
        }, y;
      })(), i = (function() {
        for (var _ = new Array(256), S = new Array(256), $ = 0; $ < 8; $ += 1)
          _[$] = 1 << $;
        for (var $ = 8; $ < 256; $ += 1)
          _[$] = _[$ - 4] ^ _[$ - 5] ^ _[$ - 6] ^ _[$ - 8];
        for (var $ = 0; $ < 255; $ += 1)
          S[_[$]] = $;
        var M = {};
        return M.glog = function(y) {
          if (y < 1)
            throw "glog(" + y + ")";
          return S[y];
        }, M.gexp = function(y) {
          for (; y < 0; )
            y += 255;
          for (; y >= 256; )
            y -= 255;
          return _[y];
        }, M;
      })();
      function u(_, S) {
        if (typeof _.length > "u")
          throw _.length + "/" + S;
        var $ = (function() {
          for (var y = 0; y < _.length && _[y] == 0; )
            y += 1;
          for (var E = new Array(_.length - y + S), b = 0; b < _.length - y; b += 1)
            E[b] = _[b + y];
          return E;
        })(), M = {};
        return M.getAt = function(y) {
          return $[y];
        }, M.getLength = function() {
          return $.length;
        }, M.multiply = function(y) {
          for (var E = new Array(M.getLength() + y.getLength() - 1), b = 0; b < M.getLength(); b += 1)
            for (var p = 0; p < y.getLength(); p += 1)
              E[b + p] ^= i.gexp(i.glog(M.getAt(b)) + i.glog(y.getAt(p)));
          return u(E, 0);
        }, M.mod = function(y) {
          if (M.getLength() - y.getLength() < 0)
            return M;
          for (var E = i.glog(M.getAt(0)) - i.glog(y.getAt(0)), b = new Array(M.getLength()), p = 0; p < M.getLength(); p += 1)
            b[p] = M.getAt(p);
          for (var p = 0; p < y.getLength(); p += 1)
            b[p] ^= i.gexp(i.glog(y.getAt(p)) + E);
          return u(b, 0).mod(y);
        }, M;
      }
      var d = (function() {
        var _ = [
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
        ], S = function(y, E) {
          var b = {};
          return b.totalCount = y, b.dataCount = E, b;
        }, $ = {}, M = function(y, E) {
          switch (E) {
            case o.L:
              return _[(y - 1) * 4 + 0];
            case o.M:
              return _[(y - 1) * 4 + 1];
            case o.Q:
              return _[(y - 1) * 4 + 2];
            case o.H:
              return _[(y - 1) * 4 + 3];
            default:
              return;
          }
        };
        return $.getRSBlocks = function(y, E) {
          var b = M(y, E);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + y + "/errorCorrectionLevel:" + E;
          for (var p = b.length / 3, R = [], B = 0; B < p; B += 1)
            for (var H = b[B * 3 + 0], X = b[B * 3 + 1], J = b[B * 3 + 2], Y = 0; Y < H; Y += 1)
              R.push(S(X, J));
          return R;
        }, $;
      })(), f = function() {
        var _ = [], S = 0, $ = {};
        return $.getBuffer = function() {
          return _;
        }, $.getAt = function(M) {
          var y = Math.floor(M / 8);
          return (_[y] >>> 7 - M % 8 & 1) == 1;
        }, $.put = function(M, y) {
          for (var E = 0; E < y; E += 1)
            $.putBit((M >>> y - E - 1 & 1) == 1);
        }, $.getLengthInBits = function() {
          return S;
        }, $.putBit = function(M) {
          var y = Math.floor(S / 8);
          _.length <= y && _.push(0), M && (_[y] |= 128 >>> S % 8), S += 1;
        }, $;
      }, m = function(_) {
        var S = s.MODE_NUMBER, $ = _, M = {};
        M.getMode = function() {
          return S;
        }, M.getLength = function(b) {
          return $.length;
        }, M.write = function(b) {
          for (var p = $, R = 0; R + 2 < p.length; )
            b.put(y(p.substring(R, R + 3)), 10), R += 3;
          R < p.length && (p.length - R == 1 ? b.put(y(p.substring(R, R + 1)), 4) : p.length - R == 2 && b.put(y(p.substring(R, R + 2)), 7));
        };
        var y = function(b) {
          for (var p = 0, R = 0; R < b.length; R += 1)
            p = p * 10 + E(b.charAt(R));
          return p;
        }, E = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return M;
      }, v = function(_) {
        var S = s.MODE_ALPHA_NUM, $ = _, M = {};
        M.getMode = function() {
          return S;
        }, M.getLength = function(E) {
          return $.length;
        }, M.write = function(E) {
          for (var b = $, p = 0; p + 1 < b.length; )
            E.put(
              y(b.charAt(p)) * 45 + y(b.charAt(p + 1)),
              11
            ), p += 2;
          p < b.length && E.put(y(b.charAt(p)), 6);
        };
        var y = function(E) {
          if ("0" <= E && E <= "9")
            return E.charCodeAt(0) - 48;
          if ("A" <= E && E <= "Z")
            return E.charCodeAt(0) - 65 + 10;
          switch (E) {
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
              throw "illegal char :" + E;
          }
        };
        return M;
      }, k = function(_) {
        var S = s.MODE_8BIT_BYTE, $ = a.stringToBytes(_), M = {};
        return M.getMode = function() {
          return S;
        }, M.getLength = function(y) {
          return $.length;
        }, M.write = function(y) {
          for (var E = 0; E < $.length; E += 1)
            y.put($[E], 8);
        }, M;
      }, A = function(_) {
        var S = s.MODE_KANJI, $ = a.stringToBytesFuncs.SJIS;
        if (!$)
          throw "sjis not supported.";
        (function(E, b) {
          var p = $(E);
          if (p.length != 2 || (p[0] << 8 | p[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var M = $(_), y = {};
        return y.getMode = function() {
          return S;
        }, y.getLength = function(E) {
          return ~~(M.length / 2);
        }, y.write = function(E) {
          for (var b = M, p = 0; p + 1 < b.length; ) {
            var R = (255 & b[p]) << 8 | 255 & b[p + 1];
            if (33088 <= R && R <= 40956)
              R -= 33088;
            else if (57408 <= R && R <= 60351)
              R -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + R;
            R = (R >>> 8 & 255) * 192 + (R & 255), E.put(R, 13), p += 2;
          }
          if (p < b.length)
            throw "illegal char at " + (p + 1);
        }, y;
      }, x = function() {
        var _ = [], S = {};
        return S.writeByte = function($) {
          _.push($ & 255);
        }, S.writeShort = function($) {
          S.writeByte($), S.writeByte($ >>> 8);
        }, S.writeBytes = function($, M, y) {
          M = M || 0, y = y || $.length;
          for (var E = 0; E < y; E += 1)
            S.writeByte($[E + M]);
        }, S.writeString = function($) {
          for (var M = 0; M < $.length; M += 1)
            S.writeByte($.charCodeAt(M));
        }, S.toByteArray = function() {
          return _;
        }, S.toString = function() {
          var $ = "";
          $ += "[";
          for (var M = 0; M < _.length; M += 1)
            M > 0 && ($ += ","), $ += _[M];
          return $ += "]", $;
        }, S;
      }, I = function() {
        var _ = 0, S = 0, $ = 0, M = "", y = {}, E = function(p) {
          M += String.fromCharCode(b(p & 63));
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
        return y.writeByte = function(p) {
          for (_ = _ << 8 | p & 255, S += 8, $ += 1; S >= 6; )
            E(_ >>> S - 6), S -= 6;
        }, y.flush = function() {
          if (S > 0 && (E(_ << 6 - S), _ = 0, S = 0), $ % 3 != 0)
            for (var p = 3 - $ % 3, R = 0; R < p; R += 1)
              M += "=";
        }, y.toString = function() {
          return M;
        }, y;
      }, z = function(_) {
        var S = _, $ = 0, M = 0, y = 0, E = {};
        E.read = function() {
          for (; y < 8; ) {
            if ($ >= S.length) {
              if (y == 0)
                return -1;
              throw "unexpected end of file./" + y;
            }
            var p = S.charAt($);
            if ($ += 1, p == "=")
              return y = 0, -1;
            if (p.match(/^\s$/))
              continue;
            M = M << 6 | b(p.charCodeAt(0)), y += 6;
          }
          var R = M >>> y - 8 & 255;
          return y -= 8, R;
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
        return E;
      }, ee = function(_, S) {
        var $ = _, M = S, y = new Array(_ * S), E = {};
        E.setPixel = function(B, H, X) {
          y[H * $ + B] = X;
        }, E.write = function(B) {
          B.writeString("GIF87a"), B.writeShort($), B.writeShort(M), B.writeByte(128), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(255), B.writeByte(255), B.writeByte(255), B.writeString(","), B.writeShort(0), B.writeShort(0), B.writeShort($), B.writeShort(M), B.writeByte(0);
          var H = 2, X = p(H);
          B.writeByte(H);
          for (var J = 0; X.length - J > 255; )
            B.writeByte(255), B.writeBytes(X, J, 255), J += 255;
          B.writeByte(X.length - J), B.writeBytes(X, J, X.length - J), B.writeByte(0), B.writeString(";");
        };
        var b = function(B) {
          var H = B, X = 0, J = 0, Y = {};
          return Y.write = function(ie, ve) {
            if (ie >>> ve)
              throw "length over";
            for (; X + ve >= 8; )
              H.writeByte(255 & (ie << X | J)), ve -= 8 - X, ie >>>= 8 - X, J = 0, X = 0;
            J = ie << X | J, X = X + ve;
          }, Y.flush = function() {
            X > 0 && H.writeByte(J);
          }, Y;
        }, p = function(B) {
          for (var H = 1 << B, X = (1 << B) + 1, J = B + 1, Y = R(), ie = 0; ie < H; ie += 1)
            Y.add(String.fromCharCode(ie));
          Y.add(String.fromCharCode(H)), Y.add(String.fromCharCode(X));
          var ve = x(), Oe = b(ve);
          Oe.write(H, J);
          var qe = 0, Fe = String.fromCharCode(y[qe]);
          for (qe += 1; qe < y.length; ) {
            var kt = String.fromCharCode(y[qe]);
            qe += 1, Y.contains(Fe + kt) ? Fe = Fe + kt : (Oe.write(Y.indexOf(Fe), J), Y.size() < 4095 && (Y.size() == 1 << J && (J += 1), Y.add(Fe + kt)), Fe = kt);
          }
          return Oe.write(Y.indexOf(Fe), J), Oe.write(X, J), Oe.flush(), ve.toByteArray();
        }, R = function() {
          var B = {}, H = 0, X = {};
          return X.add = function(J) {
            if (X.contains(J))
              throw "dup key:" + J;
            B[J] = H, H += 1;
          }, X.size = function() {
            return H;
          }, X.indexOf = function(J) {
            return B[J];
          }, X.contains = function(J) {
            return typeof B[J] < "u";
          }, X;
        };
        return E;
      }, P = function(_, S, $) {
        for (var M = ee(_, S), y = 0; y < S; y += 1)
          for (var E = 0; E < _; E += 1)
            M.setPixel(E, y, $(E, y));
        var b = x();
        M.write(b);
        for (var p = I(), R = b.toByteArray(), B = 0; B < R.length; B += 1)
          p.writeByte(R[B]);
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
  })(xa)), xa.exports;
}
var J2 = Z2();
const X2 = /* @__PURE__ */ Y2(J2), Q2 = ["width", "height", "viewBox"], ek = ["width", "height"], tk = ["d"], nk = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = T(() => {
      const a = X2(0, "M");
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
      g("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, ek),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, tk)
    ], 8, Q2));
  }
}, Tx = /* @__PURE__ */ K(nk, [["__scopeId", "data-v-489f0852"]]), ak = {
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
}, Bx = /* @__PURE__ */ K(ak, [["__scopeId", "data-v-47e67f04"]]);
function Ix(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const Rx = Pr(() => import("./VoiceFigure-BdYy-tI8.js").then((e) => e.V)), Lx = "1.2.0", Nx = "3.5";
export {
  xy as $,
  xe as A,
  _e as B,
  Hn as C,
  Ze as D,
  F4 as E,
  dy as F,
  T5 as G,
  D4 as H,
  yy as I,
  wt as J,
  fs as K,
  zv as L,
  My as M,
  vy as N,
  a4 as O,
  Wn as P,
  $n as Q,
  u5 as R,
  i4 as S,
  n5 as T,
  Me as U,
  On as V,
  t5 as W,
  e5 as X,
  mu as Y,
  pu as Z,
  K as _,
  Vk as a,
  ry as a$,
  d5 as a0,
  f5 as a1,
  Se as a2,
  $5 as a3,
  x5 as a4,
  pt as a5,
  h5 as a6,
  L5 as a7,
  Lk as a8,
  _4 as a9,
  e4 as aA,
  Rv as aB,
  j5 as aC,
  q5 as aD,
  W4 as aE,
  or as aF,
  r4 as aG,
  an as aH,
  Fk as aI,
  Pk as aJ,
  T4 as aK,
  sn as aL,
  L4 as aM,
  O5 as aN,
  t4 as aO,
  n4 as aP,
  Q5 as aQ,
  Zt as aR,
  ft as aS,
  Nk as aT,
  M0 as aU,
  J5 as aV,
  i5 as aW,
  ar as aX,
  Ot as aY,
  Rt as aZ,
  S4 as a_,
  I4 as aa,
  Uk as ab,
  a5 as ac,
  s5 as ad,
  w5 as ae,
  k5 as af,
  M5 as ag,
  Zk as ah,
  po as ai,
  m5 as aj,
  R5 as ak,
  V4 as al,
  G5 as am,
  z5 as an,
  U5 as ao,
  S5 as ap,
  y5 as aq,
  v5 as ar,
  b5 as as,
  l4 as at,
  I5 as au,
  N5 as av,
  Y4 as aw,
  Ft as ax,
  D5 as ay,
  v4 as az,
  Ly as b,
  jk as b$,
  R4 as b0,
  d4 as b1,
  u4 as b2,
  K0 as b3,
  Ul as b4,
  x4 as b5,
  B5 as b6,
  Vn as b7,
  Qe as b8,
  y4 as b9,
  b4 as bA,
  nt as bB,
  c4 as bC,
  w4 as bD,
  P5 as bE,
  K5 as bF,
  F5 as bG,
  Ee as bH,
  C5 as bI,
  k4 as bJ,
  ax as bK,
  sx as bL,
  Ik as bM,
  E0 as bN,
  E5 as bO,
  m4 as bP,
  Gk as bQ,
  z4 as bR,
  f4 as bS,
  p4 as bT,
  g4 as bU,
  _5 as bV,
  Lv as bW,
  A5 as bX,
  H5 as bY,
  U4 as bZ,
  K4 as b_,
  ua as ba,
  vl as bb,
  J4 as bc,
  ex as bd,
  o4 as be,
  O4 as bf,
  Rk as bg,
  V5 as bh,
  X4 as bi,
  p5 as bj,
  g5 as bk,
  Xk as bl,
  c5 as bm,
  qk as bn,
  A4 as bo,
  Kk as bp,
  Yk as bq,
  Qk as br,
  Z5 as bs,
  b0 as bt,
  N4 as bu,
  gy as bv,
  Jk as bw,
  Wk as bx,
  Y5 as by,
  h4 as bz,
  G0 as c,
  Y1 as c$,
  Dk as c0,
  W5 as c1,
  tx as c2,
  vs as c3,
  nx as c4,
  wr as c5,
  C4 as c6,
  l5 as c7,
  o5 as c8,
  $0 as c9,
  hk as cA,
  Lx as cB,
  Nx as cC,
  kk as cD,
  kx as cE,
  Da as cF,
  Ak as cG,
  ag as cH,
  mt as cI,
  za as cJ,
  Pn as cK,
  gk as cL,
  xk as cM,
  oi as cN,
  wp as cO,
  Ax as cP,
  yk as cQ,
  Tx as cR,
  gx as cS,
  Au as cT,
  ck as cU,
  Ok as cV,
  Bb as cW,
  jn as cX,
  $k as cY,
  yt as cZ,
  lt as c_,
  Hk as ca,
  my as cb,
  X5 as cc,
  cs as cd,
  Cv as ce,
  s4 as cf,
  Wt as cg,
  Et as ch,
  mk as ci,
  yx as cj,
  ue as ck,
  Xc as cl,
  ou as cm,
  Qa as cn,
  lh as co,
  Zo as cp,
  Cx as cq,
  Bk as cr,
  km as cs,
  zt as ct,
  ox as cu,
  ok as cv,
  Ct as cw,
  Ac as cx,
  me as cy,
  bx as cz,
  Pe as d,
  dp as d$,
  yi as d0,
  _k as d1,
  uk as d2,
  Bt as d3,
  wx as d4,
  Ox as d5,
  $r as d6,
  Oc as d7,
  et as d8,
  Mk as d9,
  eb as dA,
  dk as dB,
  wk as dC,
  ux as dD,
  fx as dE,
  De as dF,
  pk as dG,
  vk as dH,
  cx as dI,
  Tm as dJ,
  ik as dK,
  lk as dL,
  Fo as dM,
  Wo as dN,
  lc as dO,
  fk as dP,
  Ve as dQ,
  Ix as dR,
  tb as dS,
  Sk as dT,
  ix as dU,
  vx as dV,
  Xy as dW,
  xx as dX,
  ap as dY,
  Oo as dZ,
  Fb as d_,
  Gn as da,
  Rx as db,
  Bx as dc,
  os as dd,
  dx as de,
  Za as df,
  u1 as dg,
  zs as dh,
  _l as di,
  sc as dj,
  _x as dk,
  Sx as dl,
  Ja as dm,
  ac as dn,
  bk as dp,
  Ex as dq,
  Tk as dr,
  Ck as ds,
  Ek as dt,
  rx as du,
  Zd as dv,
  lx as dw,
  rk as dx,
  $x as dy,
  Jp as dz,
  r5 as e,
  hx as e0,
  Na as e1,
  mx as e2,
  px as e3,
  ot as e4,
  Mx as e5,
  oc as e6,
  y0 as f,
  Z4 as g,
  Jt as h,
  P4 as i,
  Q4 as j,
  j4 as k,
  E4 as l,
  qy as m,
  hs as n,
  B4 as o,
  zk as p,
  q4 as q,
  yr as r,
  br as s,
  At as t,
  Z0 as u,
  $4 as v,
  G4 as w,
  M4 as x,
  ln as y,
  H4 as z
};
