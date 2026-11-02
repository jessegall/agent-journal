/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as be, createElementVNode as m, normalizeClass as te, Fragment as Z, renderList as ie, normalizeStyle as $e, defineComponent as Oo, Comment as Co, h as es, cloneVNode as To, createBlock as G, withCtx as F, unref as K, createVNode as V, toDisplayString as M, createCommentVNode as P, inject as ft, computed as D, resolveDynamicComponent as et, Transition as on, watch as xe, ref as W, shallowRef as rn, TransitionGroup as Bo, mergeProps as dt, reactive as ts, createTextVNode as ve, onMounted as je, onUnmounted as Ee, nextTick as ns, useId as ia, Teleport as la, withModifiers as Se, isRef as ys, resolveDirective as Ro, withDirectives as Gt, useModel as Lo, useAttrs as ca, getCurrentInstance as Do, mergeModels as Io, getCurrentScope as ua, onScopeDispose as da, onBeforeUnmount as ss, provide as jo, onErrorCaptured as No, toHandlers as Po, createSlots as qo, withKeys as Wo, vModelText as Ho, defineAsyncComponent as Fo } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Uo = { class: "skeleton-line" }, zo = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Uo, [
      be(t.$slots, "default", {}, void 0, !0),
      m("span", {
        class: te(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(Z, null, ie(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: te(["bar", { still: e.still }]),
          style: $e({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Je = /* @__PURE__ */ Y(zo, [["__scopeId", "data-v-0ebb6933"]]), as = Oo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Co);
      return s.length !== 1 ? es(Z, { key: n }, s) : s[0].key == null ? To(s[0], { key: n }) : s[0];
    };
  }
}), Vo = ["aria-label"], Go = ["aria-label"], Ko = ["aria-label"], Yo = ["aria-label"], Jo = ["aria-label"], Zo = ["aria-label"], Xo = ["aria-label"], Qo = {
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
    ], i = ["94%", "88%", "91%", "62%"].map((l) => ({ width: l, height: 10 })), r = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (l, u) => (c(), G(as, { value: e.shape }, {
      messages: F(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(Z, null, ie(t, (f) => m("div", {
            key: f.id,
            class: te(["skeleton-message", { mine: f.mine }]),
            style: $e({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, Vo)
      ]),
      older: F(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Z, null, ie(t.slice(0, 3), (f) => (c(), h("div", {
            key: f.id,
            class: te(["skeleton-message", { mine: f.mine }]),
            style: $e({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, Go)
      ]),
      cards: F(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Z, null, ie(e.count, (f) => (c(), h("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (c(), h(Z, null, ie(n, (k) => V(Je, {
              key: k.id,
              bars: k.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ko)
      ]),
      file: F(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Z, null, ie(e.count, (f) => (c(), h("div", {
            key: f,
            class: "skeleton-file"
          }, [
            V(Je, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(Z, null, ie(a, (k) => V(Je, {
              key: k.id,
              bars: k.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Yo)
      ]),
      page: F(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          V(Je, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(Z, null, ie(e.count, (f) => (c(), G(Je, {
            key: f,
            bars: K(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, Jo)
      ]),
      text: F(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Z, null, ie(e.count, (f) => (c(), G(Je, {
            key: f,
            bars: K(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, Zo)
      ]),
      default: F(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Z, null, ie(e.count, (f) => (c(), G(Je, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Xo)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Et = /* @__PURE__ */ Y(Qo, [["__scopeId", "data-v-c687fb85"]]), er = {
  key: 1,
  class: "empty-state titled"
}, tr = { class: "empty-state-title" }, nr = { class: "empty-state-text" }, sr = {
  key: 2,
  class: "empty-state"
}, ar = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", er, [
      m("p", tr, M(e.title), 1),
      m("p", nr, [
        be(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", sr, [
      be(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Kt = /* @__PURE__ */ Y(ar, [["__scopeId", "data-v-b27e89b0"]]), or = { class: "fold-group" }, rr = ["aria-expanded"], ir = { class: "fold-label" }, lr = {
  key: 0,
  class: "fold-count"
}, cr = {
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
    return (s, a) => (c(), h("div", or, [
      m("button", {
        type: "button",
        class: te(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        m("span", ir, M(e.label), 1),
        e.count !== "" ? (c(), h("span", lr, M(e.count), 1)) : P("", !0),
        m("span", {
          class: te(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, rr),
      e.open ? be(s.$slots, "default", {}, void 0, !0, 0) : P("", !0)
    ]));
  }
}, Ng = /* @__PURE__ */ Y(cr, [["__scopeId", "data-v-9ef1865c"]]), tt = Symbol.for("journal.window-context");
function ha() {
  const e = ft(tt, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const ur = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, dr = /* @__PURE__ */ Y(ur, [["__scopeId", "data-v-eb453d6f"]]), hr = {
  __name: "Btn",
  props: {
    kind: { type: String, default: "ghost" },
    small: Boolean,
    large: Boolean,
    busy: Boolean,
    disabled: Boolean,
    fill: Boolean,
    bordered: Boolean,
    href: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = D(() => {
      var s;
      return t.busy || t.disabled || !!((s = ft(tt, null)) != null && s.readOnly);
    });
    return (s, a) => (c(), G(et(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: te(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: F(() => [
        m("span", {
          class: te(["btn-label", { hidden: e.busy }])
        }, [
          be(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (c(), G(dr, {
          key: 0,
          class: "btn-spinner"
        })) : P("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, we = /* @__PURE__ */ Y(hr, [["__scopeId", "data-v-a2dc4bda"]]), fr = {
  class: "running",
  "data-running-command": ""
}, pr = ["title"], gr = {
  key: "idle",
  class: "running-idle"
}, mr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", fr, [
      V(on, {
        name: "roll",
        mode: "out-in"
      }, {
        default: F(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, M(e.text), 9, pr)) : (c(), h("span", gr, M(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Pg = /* @__PURE__ */ Y(mr, [["__scopeId", "data-v-e3ee3449"]]), vr = ["aria-checked", "aria-label", "title"], yr = {
  key: 0,
  class: "switch-inner"
}, wr = {
  key: 0,
  class: "switch-word"
}, kr = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("button", {
      type: "button",
      class: te(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: te(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", yr, M(e.word), 1)) : P("", !0),
        a[1] || (a[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", wr, M(e.word), 1)) : P("", !0)
    ], 10, vr));
  }
}, qg = /* @__PURE__ */ Y(kr, [["__scopeId", "data-v-1bfb90f3"]]);
function fa(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function $t(e, t) {
  return fa(() => localStorage, e, t);
}
function pa(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function ln(e, t) {
  return pa(() => localStorage, e, t);
}
function ga(e, t) {
  xe(t, (n) => ln(e, n), { deep: !0 });
}
function br(e, t) {
  return fa(() => sessionStorage, e, t);
}
function xr(e, t) {
  return pa(() => sessionStorage, e, t);
}
const Yt = "journal.environment", ma = W(br(Yt, $t(Yt, "")));
function $r(e) {
  ma.value = e, xr(Yt, e), ln(Yt, e);
}
const Jt = W(location.hash), ws = rn(null), ks = { integrations: "mcp", library: "team" };
function Mr() {
  if (!ws.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (ks[n]) {
    location.replace(`#/${[ks[n], ...s].join("/")}${t ? `?${t}` : ""}`), Jt.value = location.hash;
    return;
  }
  !n || ws.value(n) || ($r(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Jt.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Jt.value = location.hash, Mr();
});
const De = D(() => {
  const [e, t = ""] = Jt.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((i) => {
    const [r, l = ""] = i.split("@"), [u = "", f = "", k = ""] = r.split(":");
    return { table: u, id: Number(f), comment: Number(k) || 0, env: l };
  });
  return {
    env: ma.value,
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
}), cn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${cn.page(e)}?open=${t}`
};
function _r(e = "", t = 0, n = "") {
  location.hash = cn.page(e, t, n);
}
const Sr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function va(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([i]) => i !== "open" && i !== "sub").map(([i, r]) => `${i}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Sr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const vn = {};
function ya(e, t, n = 0, s = "") {
  var i;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((i = vn[e]) != null && i.call(vn, t))) return;
  const a = De.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  va([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Er(e, t, n, s = 0, a = "") {
  if (e === De.value.env) return ya(t, n, s, a);
  const o = De.value.stack, i = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  va([...i < 0 ? o : o.slice(0, i), { table: t, id: n, comment: s, env: e }], a);
}
function pt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Er(s, a, Number(o), 0, t) : ya(a, Number(o), 0, t);
}
function Ar(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function lt(e) {
  const t = Ar(e);
  t && pt(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Or = ["stroke-width", "innerHTML"], Ie = {
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
      "dots-vertical": '<path d="M8 4h.01M8 8h.01M8 12h.01"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (o, i) => (c(), h("svg", {
      class: "ico",
      style: $e({
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
    }, null, 12, Or));
  }
}, wa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), G(we, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: F(() => [
        V(Ie, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Cr = {
  key: 1,
  class: "row-list-failure"
}, Tr = ["data-row"], Br = {
  __name: "RowList",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    empty: { type: String, required: !0 },
    loaded: { type: Boolean, required: !0 },
    // what the skeleton looks like while the first read is out: the shape of what is coming
    shape: { type: String, default: "rows" },
    // reads the next page behind the rows and says whether it found any; with none given the list has no pages
    older: { type: Function, default: null },
    // how a row comes in and goes out, {enter, leave} each given the row's element and the call that ends it; with none given rows just appear
    arrival: { type: Object, default: null }
  },
  setup(e) {
    const t = e, n = D(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = W(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, i) => !e.loaded && !e.failure ? (c(), G(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Cr, M(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(Kt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (c(), h(Z, { key: 3 }, [
      (c(), G(et(e.arrival ? Bo : "ul"), dt(n.value, { class: "row-list" }), {
        default: F(() => [
          (c(!0), h(Z, null, ie(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            be(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Tr))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && !s.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: i[0] || (i[0] = (r) => a(e.older))
      }, "Show more")) : P("", !0)
    ], 64));
  }
}, Rr = /* @__PURE__ */ Y(Br, [["__scopeId", "data-v-7f34ada7"]]), Lr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Dr = {
  key: 1,
  class: "agent-rows-note"
}, Ir = {
  key: 2,
  class: "agent-rows-note"
}, jr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Nr = ["data-agent-row", "onClick"], Pr = { class: "agent-row-name" }, qr = { class: "agent-row-state" }, Wr = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = D(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = D(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Lr, [
      e.loaded ? e.failure ? (c(), h("p", Dr, M(e.failure), 1)) : e.rows.length ? (c(), h(Z, { key: 3 }, [
        m("p", jr, M(s.value) + " running", 1),
        (c(!0), h(Z, null, ie(n.value, (i) => (c(), h("button", {
          key: i.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": i.id,
          onClick: (r) => K(pt)(`agents:${i.id}`)
        }, [
          m("span", Pr, "#" + M(i.id) + " " + M(i.session), 1),
          m("span", qr, M(i.ended_at ? "Closed" : "Running"), 1)
        ], 8, Nr))), 128))
      ], 64)) : (c(), h("p", Ir, M(e.none), 1)) : (c(), G(Et, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Wg = /* @__PURE__ */ Y(Wr, [["__scopeId", "data-v-a01e5a17"]]), Hr = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: te(["badge", e.tone])
    }, M(e.text), 3));
  }
}, ka = /* @__PURE__ */ Y(Hr, [["__scopeId", "data-v-9e7e1157"]]), Fr = ["aria-valuenow", "aria-valuemax"], Ur = {
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
    const t = e, n = D(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (c(), h("span", {
      class: te(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: $e({ width: n.value })
      }, null, 4)
    ], 10, Fr));
  }
}, zr = /* @__PURE__ */ Y(Ur, [["__scopeId", "data-v-9eba6a85"]]), Vr = { class: "bars" }, Gr = { class: "bar-name" }, Kr = { class: "bar-value" }, Yr = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => Math.max(1, ...n.items.map((i) => Number(i.value) || 0))), o = D(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (i, r) => (c(), h("div", Vr, [
      (c(!0), h(Z, null, ie(e.items, (l, u) => (c(), G(et(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: te(["bar-row", l.tone, { opens: l.open }]),
        onClick: (f) => l.open && s("open", l.open)
      }, {
        default: F(() => [
          m("span", Gr, M(l.label), 1),
          V(zr, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Kr, M(l.value) + M(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Jr = /* @__PURE__ */ Y(Yr, [["__scopeId", "data-v-663427f4"]]), Zr = { class: "bars" }, Xr = {
  key: 0,
  class: "bars-title"
}, Qr = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Zr, [
      e.node.title ? (c(), h("span", Xr, M(e.node.title), 1)) : P("", !0),
      V(Jr, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, ei = /* @__PURE__ */ Y(Qr, [["__scopeId", "data-v-7135bb11"]]), ti = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (i) => ({ gap: `${i.gap || 14}px` }),
      row: (i) => ({ gap: `${i.gap || 12}px` }),
      grid: (i) => ({ gap: `${i.gap || 12}px`, gridTemplateColumns: `repeat(${i.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = D(() => n[s.node.type](s.node));
    return (i, r) => (c(), h("div", {
      class: te([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: $e(o.value)
    }, [
      (c(!0), h(Z, null, ie(e.node.children || [], (l, u) => (c(), G(Ka, {
        key: u,
        node: l,
        onOpen: r[0] || (r[0] = (f) => a("open", f)),
        onFile: r[1] || (r[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Ht = /* @__PURE__ */ Y(ti, [["__scopeId", "data-v-d142a3f4"]]), ni = {
  key: 0,
  class: "card-head"
}, si = { class: "card-title" }, ai = {
  key: 0,
  class: "card-note"
}, oi = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: te(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", ni, [
        m("span", si, M(e.node.title), 1),
        e.node.note ? (c(), h("span", ai, M(e.node.note), 1)) : P("", !0)
      ])) : P("", !0),
      V(Ht, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, ri = /* @__PURE__ */ Y(oi, [["__scopeId", "data-v-67b72d40"]]), ii = (e, t, n) => Math.max(t, Math.min(n, e)), ke = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, bs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", yn = 80;
function xs(e) {
  return e.length <= yn ? e : `${e.slice(0, yn + 1).replace(/\s+\S*$/, "") || e.slice(0, yn)}…`;
}
const $s = {
  messages: (e) => xs(bs(e.text)),
  comments: (e) => xs(bs(e.text)),
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
}, li = (e) => ($s[e.table] ? $s[e.table](e) : e.title || "") || "", ci = ["done", "cancelled"], Nn = {
  tasks: (e) => ke(e.completed_at) || (e.state === "cancelled" ? ke(e.updated_at) : 0),
  questions: (e) => e.answer ? ke(e.updated_at) : 0,
  plans: (e) => ci.includes(e.state) ? ke(e.updated_at) : 0,
  notices: (e) => ke(e.closed_at),
  secrets: (e) => ke(e.deleted_at),
  workers: (e) => e.state === "stopped" ? ke(e.updated_at) : 0,
  shares: (e) => ke(e.stopped_at),
  dumps: (e) => ke(e.completed_at),
  agents: (e) => e.state === "ended" ? ke(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? ke(e.created_at) : 0
}, ui = (e) => Nn[e.table] ? Nn[e.table](e) : 0, ba = (e) => ui(e) > 0, di = (e) => !!Nn[e], xa = (e) => ke(e.created_at), Zt = (e) => ke(e.updated_at) || xa(e), hi = (e) => "task_ids" in e, un = typeof document < "u" && document.documentElement.classList.contains("phone"), fi = "Files are attached on the computer; the phone sends text.", $a = 1024, pi = $a * 1024 * 1024, gi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${$a} MB limit for one file.`;
function mi() {
  return () => {
  };
}
function Ms(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function vi(e = window) {
  if (!Ms(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ms(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ma = "status.summary", me = ts({
  version: "",
  failure: "",
  late: !1,
  since: 0,
  external: !1,
  step: "",
  countdown: null,
  target: "",
  starting: !1,
  bootStep: ""
}), yi = () => !!(me.version || me.external) && !me.failure && !me.late, _a = () => !!me.countdown || yi() || me.starting;
function wi(e, t = "") {
  me.starting = e === !1, me.bootStep = me.starting ? t : "";
}
function ki(e) {
  e && e.version && (me.target = e.version), me.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function bi() {
  Object.assign(me, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function xi(e, t = "") {
  return e && t && (me.step = t), me.version || (e && !me.external && Object.assign(me, { external: !0, since: Date.now() / 1e3 }), e || !me.external) ? !1 : (bi(), !0);
}
let Lt = { version: "", started: 0 };
function $i(e) {
  return e.version ? (Lt.version || (Lt = { version: e.version, started: e.started || 0 }), e.version !== Lt.version || (e.started || 0) !== Lt.started) : !1;
}
function Mi(e) {
  ki(e.countdown), wi(e.ready, e.step), (xi(!!e.updating, e.step) || !e.updating && !_i(e) && $i(e)) && vi(window);
}
const _i = (e) => !!me.version && !me.failure && !me.late && e.version !== me.version, _s = 2e4, Si = 3e5, qe = 6e5, Dt = 6, Ei = 500, Ai = "/journal/summary", Ss = un ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Oi = (e) => e.split("?")[0].endsWith(Ai), Sa = (e, t) => Object.assign(new Error(t), { status: e });
async function Ci(e, t, n = Sa) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Ti = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Bi {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Dt;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Dt;
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
  async reach(t, n, s, a, o, i = {}) {
    const r = s instanceof FormData;
    try {
      return await fetch(n, {
        method: t,
        headers: { ...Ss, ...i, ...s === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: Ti(s),
        signal: AbortSignal.timeout(a || (r ? Si : _s))
      });
    } catch (l) {
      if (t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Ei)), this.reach(t, n, s, a, o - 1, i);
    }
  }
  async send(t, n, s, a = 0, o = Dt, i = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : mi(), l = await this.reach(t, n, s, a, o, i).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return Ci(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ss, signal: AbortSignal.timeout(_s) });
    if (!n.ok) throw Sa(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, i = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Dt, o).then((l) => (this.written(n), l));
    if (_a() && !Oi(n))
      return Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 }));
    if (this.flying.has(i)) return this.flying.get(i);
    const r = this.send(t, n, s, 0, this.tries, o);
    return this.flying.set(i, r), r.finally(() => this.flying.delete(i)).catch(() => {
    }), r;
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query
  stream(t) {
    return new EventSource(t);
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response
  raw(t, n = {}) {
    return fetch(t, n);
  }
}
const Le = new Bi(), _e = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const vt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: i = !1 }) => [i ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), yt = "the page does not know its environment yet", Ri = "X-Journal-Env", Li = "X-Journal-Request-At", wn = "/viewer/voices/figures/";
class os {
  constructor({ env: t = () => De.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new os({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Li]: String(Date.now()), ...this.env() ? { [Ri]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === yt ? Promise.reject(new Error(yt)) : Le.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === yt ? Promise.reject(new Error(yt)) : Le.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : yt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${_e(this.env())}`);
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
    return Le.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: i = [], tasks: r = [], closed: l = !1, docked: u = !1 } = {}) {
    const f = this.here(`/${t}${ue({ limit: n, before: s, after: a, since: o, ids: i.join(","), tasks: r.join(","), closed: l ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(f, `${t}.${vt({ before: s, after: a, since: o, ids: i, tasks: r, closed: l, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const i = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(i, `chats/${t}.${vt({ before: s, since: a, docked: o })}`);
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
    return this.post(this.here(t.path), {}, qe);
  }
  upload(t, n, s) {
    if (un) return Promise.reject(Object.assign(new Error(fi), { status: 403 }));
    if (s.size > pi) return Promise.reject(new Error(gi(s)));
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${_e(s)}`);
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
    return this.get(`/agents/controls/${_e(t)}${ue({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${_e(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${_e(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${vt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${vt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${vt(n)}`);
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
  // connects to a team by its server's URL: a new server's makes this person its admin, an invitation URL a member, a bare URL logs in
  connectTeam(t) {
    return this.post("/team/connect", t, qe);
  }
  // disconnects from one team, the one or the one named; what was imported from its library stays
  disconnectTeam(t = "") {
    return this.post("/team/disconnect", { team: t });
  }
  // an invitation URL for a person's email; admins only
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
    return this.post(`/library/items/${encodeURIComponent(t)}/publish`, { reference: n, note: s, description: a, team: o }, qe);
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
    return this.get(this.here(`/skills/${_e(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${_e(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${_e(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return Le.request("GET", wn + "figures.json");
  }
  voiceFigureUrl(t) {
    return wn + t;
  }
  figureDecoderUrl() {
    return wn + "draco/";
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
    return this.post(this.here("/plugins/preview"), { source: t }, qe);
  }
  installPlugin(t) {
    return this.post(this.here("/plugins"), { source: t }, qe);
  }
  previewUpgrade(t) {
    return this.act("plugins", t, "upgrade-preview", {}, qe);
  }
  upgradePlugin(t, n) {
    return this.act("plugins", t, "upgrade", { ref: n }, qe);
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
    return this.post(`/profiles/${_e(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${_e(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${_e(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, qe);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${_e(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, qe);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${_e(t)}` : ""}${cn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const re = new os({ base: un ? "/p" : "" }), Di = (e) => Le.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(re.base.length).split("/")[2]);
}), Ii = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ii).map(([e, t]) => ({ key: e, label: t }));
const Es = (e) => e.status === "stopped" ? 1 : 0, ji = "main", Ni = (e) => e.filter((t) => t.role === ji).sort((t, n) => Es(t) - Es(n) || ke(n.heard_at) - ke(t.heard_at))[0] || null, Pi = { me: 1, people: [] }, U = ts({
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
  people: Pi,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: $t("journal.activity", !0),
  wide: !1,
  sideMini: $t("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
ga("journal.activity", () => U.activity);
ga("journal.side.mini", () => U.sideMini);
const ht = D(() => Ni(U.agents));
D(() => !!ht.value && U.live.some((e) => e.agent.session === ht.value.session && e.environment === De.value.env));
D(() => !!ht.value && ["busy", "working"].includes(ht.value.status));
function qi(e) {
  if (!e) return "";
  const t = typeof e == "string" ? Date.parse(e) / 1e3 : e, n = Math.max(0, Date.now() / 1e3 - t);
  return n < 60 ? "now" : n < 3600 ? `${Math.floor(n / 60)}m` : n < 86400 ? `${Math.floor(n / 3600)}h` : `${Math.floor(n / 86400)}d`;
}
function As(e) {
  const t = qi(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Ea(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Os(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const kn = (e) => String(e).padStart(2, "0");
function Wi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${kn(t % 60)}s` : `${Math.floor(t / 3600)}h ${kn(Math.floor(t % 3600 / 60))}m ${kn(t % 60)}s`;
}
const Hi = ["working", "busy", "waiting", "compacting"], Fi = (e) => Hi.includes(e), Ui = "builder";
D(() => !U.settings || U.settings.features.file_feed !== !1);
const zi = D(() => !U.settings || U.settings.features.status_bar !== !1);
D(() => U.settings && U.settings.workers && U.settings.workers.mode || Ui);
D(() => !U.settings || !U.settings.tasks || U.settings.tasks.auto !== !1);
D(() => !!(U.settings && U.settings.reviewing && U.settings.reviewing.reviewer));
D(() => !U.settings || U.settings.features.sharing !== !1);
const Xt = 50, rs = 100, Vi = { messages: 25 }, Re = (e) => Vi[e] || Xt;
function Gi(e, t) {
  if (e !== "messages") return Math.max(t.length - Re(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Re(e)) return s;
  return 0;
}
const Ki = "review_step", Yi = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === Ki).sort((t, n) => t.id - n.id), Ji = 5, Zi = 500, Xi = 3e3, Qi = () => U.entries.length ? U.entries[U.entries.length - 1].id : 0, Ft = { env: "", id: 0 }, el = () => !!(U.bar && U.bar.length) || Fi(ht.value && ht.value.status);
function tl({ session: e }) {
  return (e ? re.chat(e, { docked: !0 }) : re.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function nl() {
  return re.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => re.chat(t.session, { limit: rs })))).then(Yi);
}
function sl() {
  return Ft.env !== re.env() && Object.assign(Ft, { env: re.env(), id: Qi() }), re.entries(Ft.id);
}
function al(e) {
  e.length && (Ft.id = e[e.length - 1].id, Yl(e));
}
async function ol({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", Xt);
}
const Pn = /* @__PURE__ */ new Map();
async function qn(e, t) {
  const n = `${e}:${re.env()}`, s = Pn.get(n);
  if (!s) return Cs(n, (await re.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(Zt)), o = s.length ? Math.min(...s.map((l) => l.id)) - 1 : 0, i = await re.list("workers", { limit: t, since: a, after: o });
  if (!i.is_last_page)
    return Pn.delete(n), qn(e, t);
  const r = new Set(i.rows.map((l) => l.id));
  return Cs(
    n,
    [...s.filter((l) => !r.has(l.id)), ...i.rows].sort((l, u) => l.id - u.id)
  );
}
const Cs = (e, t) => (Pn.set(e, t), t);
async function Ts(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Bs = Object.freeze({
  "status.bar": {
    read: () => re.bar(),
    every: () => el() ? Zi : Xi,
    take: (e) => Array.isArray(e) && (U.bar = e),
    active: () => zi.value
  },
  "agents.index": { read: () => Ts(re, Ji), every: 1e3, take: (e) => U.agents = e.rows },
  "agents.live": { read: () => re.liveAgents(), every: 5e3, take: (e) => U.live = e },
  "status.summary": {
    read: () => re.summary(),
    every: () => me.countdown || me.external || me.version ? 1e3 : 4e3,
    take: (e) => {
      U.summary = e, Mi(e);
    }
  },
  "journal.manifest": { read: () => re.manifest(), every: 3e4, take: (e) => U.spec = e },
  "journals.index": { read: () => re.journals(), every: 1e4, take: (e) => U.journals = e },
  "people.index": { read: () => re.people(), every: 3e4, take: (e) => e && e.people && (U.people = e) },
  "entries.recent": { read: sl, every: 1e3, take: al },
  "outputs.running": { read: () => re.runningOutputs(), every: 3e3 },
  "messages.docked": { read: tl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => re.mcp(), every: 3e4 },
  "developer.readers": { read: () => re.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => qn("workers.index", Re("workers")), every: 5e3 },
  "workers.activity": { read: () => re.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => qn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => re.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => re.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: nl, every: 3e3 },
  "tests.turns": { read: () => re.list("test_turns", { limit: Re("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => re.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? re.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? re.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => re.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: ol, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Ts(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: Xt }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: Xt }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), rl = 6e4, il = 3e3, ll = 4, cl = 300, ul = 5e3, Aa = /* @__PURE__ */ new Map();
function dn(e) {
  if (!(e in Bs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Bs[e];
}
function dl(e) {
  const t = dn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return ul;
  }
}
const hl = (e) => e / 2 + Math.random() * e / 2, Oa = (e) => [...e.users.values()].pop(), is = (e) => Aa.get(e.place) === e, fl = () => Math.random() * cl, ls = () => document.hidden;
function pl(e) {
  const t = dl(e);
  return e.failures ? hl(Math.min(e.key === Ma ? il : rl, t * 2 ** e.failures)) : Math.max(t, ll * e.took);
}
function Ca(e, t) {
  clearTimeout(e.timer), !(!is(e) || e.paused || ls()) && (e.timer = setTimeout(() => gl(e), t));
}
function gl(e) {
  return is(e) ? e.running ? (e.again = !0, e.running) : (e.running = wl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const ml = (e) => {
  var t, n;
  return !e.paused && !ls() && (((n = (t = dn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Oa(e).active() && (!_a() || e.key === Ma);
};
async function vl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Le.attemptOnce(() => dn(e.key).read(Oa(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function yl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = dn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function wl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      ml(e) && yl(e, await vl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && is(e) && !e.paused);
  Ca(e, pl(e));
}
const kl = () => ls() || Aa.forEach((e) => Ca(e, fl()));
document.addEventListener("visibilitychange", kl);
const bl = 60, xl = (e, t) => ke(e.created_at) >= ke(t.created_at) - bl, $l = (e, t) => e.id > 0 && e.table === t.table && xl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), cs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => $l(s, n))), bn = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], he = (e, t, n, s = {}) => ({
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
}), At = {
  messages: he("Message", "mail", "What the user left for the agent, or the agent for the user", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: he("Question", "help", "Something the agent asks the user, with choices to pick", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: he("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: bn
  }),
  tasks: he("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: bn
  }),
  reports: he("Report", "report", "What was checked and what was found, written for the user", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: he("Collection", "folder", "Rows that belong together, gathered under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: he("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: he("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: he("Rule", "list", "A ruling that binds every environment of the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: he("Reminder", "clock", "An instruction said again until it is retired", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  notices: he("Notice", "band", "One line pinned to the chat while it matters", { filters: bn }),
  reactions: he("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: he("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", { scope: "project" }),
  environments: he("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", { scope: "project" }),
  agents: he("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: he("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: he("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
  verifiers: he("Verifier", "verifier", "An agent the journal sends by itself to judge whether a dismissed reader report was dismissed rightly"),
  test_turns: he("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: he("Reviewer", "reviewer", "An agent the journal sends by itself, in orchestrator mode with the reviewer on, to test and check each worker's work and report each point to the agent"),
  subagents: he("Subagent", "bot", "A helper the agent started inside its own session for one job", { nested: !0 }),
  sequences: he("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: he("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: he("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: he("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: he("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: he("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: he("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Ml = ["secrets", "plugins"], Ta = Object.keys(At).filter((e) => !(un && Ml.includes(e)));
D(() => Ta.map((e) => ({ name: e, ...At[e] })));
const hn = (e) => At[e], Ba = new Map(Ta.flatMap((e) => [e, e.replace(/s$/, ""), At[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => Ba.get(String(e).toLowerCase()) || "", Ra = [...Ba.keys()].sort((e, t) => t.length - e.length).join("|"), Ye = /* @__PURE__ */ new Set(), us = W(0), Ot = /* @__PURE__ */ new Set(), Ct = /* @__PURE__ */ new Set(), ze = /* @__PURE__ */ new Set(), Wn = /* @__PURE__ */ new Set(), _l = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map();
let it = !1, wt = null;
const El = (e, t) => e.id - t.id, Al = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Ol = { messages: Al }, La = (e) => Ol[e] || El;
function Da(e) {
  return us.value, Ye.has(e) || (Ye.add(e), U.booted && (!Ot.has(e) || Ct.has(e)) && queueMicrotask(() => pn([e], !1))), U.rows[e] || [];
}
function Cl(e) {
  const t = U.rows[e] || [], n = Gi(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  U.rows[e] = t.filter((a) => s.has(a) || di(e) && !ba(a)), U.paging.size[e] = Re(e), U.paging.more[e] = !0;
}
const Tl = /* @__PURE__ */ new Set();
function Bl() {
  Ye.forEach(Cl), Ye.clear(), _l.clear(), Sl.clear(), us.value += 1;
}
xe(() => `${De.value.env}/${De.value.page}/${De.value.open ? De.value.open.table : ""}`, Bl);
xe(
  () => U.booted,
  (e) => e && pn(
    [...Ye].filter((t) => !Ot.has(t)),
    !1
  )
);
const Hn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !hi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Ia(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Hn(s) && !Hn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function ja(e, t) {
  Ot.add(e), us.value += 1;
  const n = U.rows[e] || [];
  U.rows[e] = [...Ia(n, t.rows), ...cs(n.filter((s) => s.id === 0), t.rows)], U.paging.size[e] = U.paging.size[e] || Re(e), U.paging.more[e] = !t.is_last_page;
}
async function Rl(e) {
  const t = new Set((U.rows[e] || []).map((o) => o.id)), n = await re.list(e, { limit: Re(e) });
  fn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = cs((U.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return ja(e, { ...n, rows: [...n.rows, ...a].sort(La(e)) }), U.paging.size[e] = Re(e), Na.has(e) && await Pa(e), U.rows[e];
}
const fn = (e, t) => U.counts = { ...U.counts, [e]: t };
async function Ll(e) {
  const t = U.rows[e] || [], n = Math.max(0, ...t.map(Zt)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await re.list(e, { limit: Re(e), since: n, after: s });
  if (fn(e, a.counts), !a.is_last_page) return Rl(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), i = cs(t.filter((r) => !o.has(r.id)), a.rows).concat(Ia(t, a.rows));
  return U.rows[e] = i.sort(La(e)), U.paging.size[e] = U.rows[e].length, U.rows[e];
}
const xn = /* @__PURE__ */ new Set();
async function Dl(e, t = !1) {
  e.forEach((n) => Ct.delete(n)), e.forEach((n) => Wn.add(n));
  try {
    await Hl(e, t);
  } finally {
    e.forEach((n) => Wn.delete(n));
  }
}
async function Il(e) {
  const t = await re.list(e, { limit: Re(e) });
  fn(e, t.counts), ja(e, t);
}
async function jl(e) {
  fn(e, (await re.list(e, { limit: 1, closed: !0 })).counts);
}
const Na = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Pa(e) {
  const t = (U.rows[e] || []).filter((a) => Hn(a) && (e !== "plans" || !ba(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await re.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  U.rows[e] = (U.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Nl = (e, t) => !Ot.has(e) || t && (U.paging.size[e] || Re(e)) === Re(e) && !Tl.has(e);
async function Pl(e, t) {
  if (!Ye.has(e)) return jl(e);
  const n = await (Nl(e, t) ? Il(e) : Ll(e));
  return Na.has(e) && await Pa(e), n;
}
async function ql() {
  const [e, t] = await Promise.all([re.entries(0, rs), re.settings()]);
  Ha([...$t(Wa(), []), ...e]), JSON.stringify(t) !== JSON.stringify(U.settings) && (U.settings = t);
}
const Wl = (e, t) => Pl(e, t).then(
  () => null,
  () => e
);
async function Hl(e, t) {
  const n = (await Promise.all(e.map((s) => Wl(s, t)))).filter(Boolean);
  if (n.forEach((s) => (ze.add(s), Ct.add(s))), t && await ql(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const qa = 1e3, Fl = 15e3;
let It = qa;
async function Ul() {
  return wt || (wt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...ze].some((e) => !xn.has(e)) || it; ) {
      const e = it, t = [...e ? Object.keys(U.rows) : ze].filter((s) => At[s] && (Ye.has(s) || s in U.rows)).filter((s) => e || !Ye.has(s) || Ct.has(s) || !Ot.has(s)).filter((s) => !xn.has(s)), n = [...ze].filter((s) => xn.has(s));
      ze.clear(), n.forEach((s) => ze.add(s)), it = !1;
      try {
        await Dl(t, e), It = qa;
      } catch {
        it = it || e, await new Promise((a) => setTimeout(a, It)), It = Math.min(It * 2, Fl);
      }
    }
  })().finally(() => wt = null), wt);
}
function pn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Wn.has(n)).forEach((n) => {
    ze.add(n), t && Ct.add(n);
  }), ze.has("settings") && (it = !0), Ul();
}
const Wa = () => {
  var e;
  return `typed-entries:${((e = U.identity) == null ? void 0 : e.root) || location.host}:${re.env()}`;
};
function Ha(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  U.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-rs), ln(Wa(), U.entries.slice(-50));
}
const zl = ["created", "updated", "deleted"], Vl = { phases: ["phases", "plans"] }, Fn = (e) => Vl[e] || [e], Gl = (e) => zl.includes(e.entry_type) ? [...Fn(e.data.table), ...(e.data.joins || []).flatMap(Fn)] : [];
function Kl(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of Fn(t.data.table).filter((s) => U.rows[s]))
      U.rows[n] = U.rows[n].filter((s) => s.id !== t.data.id);
}
function Yl(e) {
  Ha([...U.entries, ...e]), Kl(e), pn([...new Set(e.flatMap(Gl))].filter((t) => t && t !== "agents"));
}
Di((e) => U.streamOpen || pn([e]));
const Un = [], Jl = 2e3, Ue = /* @__PURE__ */ new Map(), Zl = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Xl = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function nt(e, { first: t = !1 } = {}) {
  t ? Un.unshift(e) : Un.push(e), Ue.clear();
}
function Fa(e, t, n) {
  var a;
  const s = Da(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Ql = (e) => Da(e.table).find((t) => t.id === e.id) === e.row, ec = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function He(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function tc(e, t) {
  const n = [{ kind: "text", text: He(e).replace(/\r\n/g, `
`) }];
  for (const s of Un)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const i = s(o.text, t);
      typeof i == "string" ? o.text = i : i && n.splice(a, 1, ...i);
    }
  return n;
}
function Mt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return nc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function nc(e) {
  return e.split(Xl).map((t, n) => n % 2 ? t : t.replace(Zl, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Rs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function sc(e) {
  const [t, , ...n] = e, s = Rs(t).map((o) => `<th>${Mt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Rs(o).map((i) => `<td>${Mt(i)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function ac(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Mt(a)}</li>`).join("")}</${s}>`;
}
const Ls = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ua(e) {
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
      const r = t.findIndex((u, f) => f > s && /^(```|~~~)/.test(u)), l = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(s + 1, l).join(`
`)}</code></pre>`), s = l + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${Mt(o[2])}</h${r}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ls(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(sc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(ac(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Ua(
          t.slice(s, r).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let i = s;
    for (; i < t.length && t[i].trim() && !Ls(t, i) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[i]); )
      i += 1;
    n.push(`<p>${Mt(t.slice(s, i).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = i;
  }
  return n.join("");
}
const oc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, rc = (e) => e.kind !== "text" && !oc.test(e.html);
function ic(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Ua(s).replace(/\u0001(\d+)\u0001/g, (o, i) => t[Number(i)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : rc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function zn(e, t = { env: "" }) {
  const n = ec(e, t), s = Ue.get(n);
  if (Ue.delete(n), s && s.reads.every(Ql))
    return Ue.set(n, s), s.html;
  const a = [], o = ic(tc(e, { ...t, reads: a }));
  return Ue.set(n, { html: o, reads: a }), Ue.size > Jl && Ue.delete(Ue.keys().next().value), o;
}
const za = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Qt = (e) => String(e || "").replace(za, (t, n, s, a) => a), lc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), jt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, cc = /^Traceback \(most recent call last\):/m, uc = 8;
function Va(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, uc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function dc(e) {
  const t = [...e.matchAll(lc)].map((s) => s.index);
  if (jt.lastIndex = 0, !t.length || !jt.test(e)) return null;
  jt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), i = [...o.matchAll(jt)];
    return { head: i.length ? o.slice(0, i[0].index).trim() : o, frames: i.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Va(n), tail: "" } : null;
}
function hc(e) {
  const t = cc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Va([o]), tail: n.slice(a).join(`
`) };
}
nt((e) => {
  const t = Qt(e), n = hc(t) || dc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Vn = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", fc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", pc = `${Vn} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, gc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", mc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ds = {
  js: { keywords: Vn, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: fc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: pc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Vn, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: gc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: mc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Is(e, t, n) {
  return n && e.startsWith(n, t);
}
function vc(e, t) {
  const n = Ds[t] || Ds.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const i = (r, l) => l && a.push({ kind: r, value: l });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), f = e.slice(o, u < 0 ? e.length : u);
      i(
        /^#{1,6}\s/.test(f) ? "keyword" : /^(```|~~~)/.test(f) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(f) ? "number" : "plain",
        f
      ), i("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (Is(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      i("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Is(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), f = u < 0 ? e.length : u + n.block[1].length;
      i("comment", e.slice(o, f)), o = f;
      continue;
    }
    const l = (n.triple || []).find((u) => e.startsWith(u, o));
    if (l) {
      const u = e.indexOf(l, o + 3), f = u < 0 ? e.length : u + 3;
      i("string", e.slice(o, f)), o = f;
      continue;
    }
    if (n.quotes.includes(r)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== r && (r === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      i("string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      i("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const f = e.slice(o).match(/^[\w$]+/)[0], k = n.lower ? f.toLowerCase() : f, T = n.property && /^\s*:/.test(e.slice(o + f.length));
      i(s.has(k) ? "keyword" : T ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
      continue;
    }
    if (/\d/.test(r)) {
      const u = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      i("number", u[0]), o += u[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const u = r === ">" ? 1 : 2;
      i("keyword", e.slice(o, o + u)), o += u;
      continue;
    }
    i("plain", r), o += 1;
  }
  return a;
}
function yc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of vc(e, t))
    a.split(`
`).forEach((i, r) => {
      r && n.push(""), i && (n[n.length - 1] += s === "plain" ? He(i) : `<span class="tok-${s}">${He(i)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function wc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const kc = 1500, js = /* @__PURE__ */ new WeakMap();
async function bc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await wc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(js.get(t)), js.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, kc)
  )));
}
typeof document < "u" && document.addEventListener("click", bc, !0);
const xc = /^(```|~~~)\s*(\w+)?\s*$/, Ns = /^\s{4,}\S/, $c = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Mc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ga(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function _c(e) {
  const t = Ga(e.join(`
`));
  return (Mc.find(([, n]) => n.test(t)) || ["text"])[0];
}
function Ps(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${yc(Ga(e.join(`
`)), t || _c(e)).join(`
`)}</code></pre></div>` };
}
function Sc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const i = t[o].match(xc);
    if (i) {
      const r = t.findIndex((u, f) => f > o && u.trim().startsWith(i[1])), l = r < 0 ? t.length : r;
      a(), n.push(Ps(t.slice(o + 1, l).map(Qt), i[2] ? i[2].toLowerCase() : "")), o = l + 1;
      continue;
    }
    if (Ns.test(t[o])) {
      let r = o;
      for (; r < t.length && (Ns.test(t[r]) || !t[r].trim()); ) r += 1;
      for (; r > o && !t[r - 1].trim(); ) r -= 1;
      const l = [];
      for (; s.length && s[s.length - 1].trim() && $c.test(s[s.length - 1].trim()); ) l.unshift(s.pop());
      if (r - o + l.length >= 2) {
        a(), n.push(Ps([...l, ...t.slice(o, r)].map(Qt), "")), o = r;
        continue;
      }
      s.push(...l);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
nt((e) => Sc(e));
const Ec = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Ac = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Oc(e) {
  const t = Ec.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = Ac.exec(e), s = n && ut(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Cc(e, t, n, s) {
  const a = Fa(s, e, t), o = Qt(a ? li(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${He(hn(e).title)} ${t}</span><span class="row-card-title">${He(o)}</span></a>`;
}
nt(
  (e, t) => {
    const n = Oc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Cc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Tc = /\.(png|jpe?g|gif|webp|svg)$/i, Bc = (e) => Tc.test(e), Rc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Lc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Dc(e, t) {
  const n = Rc.exec(e), [, s, a, o, i, r] = n || [], l = n && ut(s || o), u = l && Fa(t, l, Number(a || i));
  if (!u || !(u.files || []).includes(r)) return null;
  const f = re.in(t.env).fileUrl(l, u.id, r), k = `${hn(l).title} ${u.id} · ${He(r)}`, T = Bc(r) ? `<img class="file-card-image" src="${f}" alt="${He(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${He(r)}">${T}<span class="file-card-name">${k}</span></a>` };
}
function Ic(e) {
  const t = Lc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${He(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
nt(
  (e, t) => {
    if (t.inline) return null;
    const n = Dc(e, t) || Ic(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const jc = /`([^`\n]+)`/g;
nt((e) => e.replace(jc, (t, n) => `<code>${n}</code>`));
const qs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${cn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
nt(
  (e, t) => e.replace(za, (n, s, a, o) => qs[s] ? qs[s](a, o, t) : o)
);
const Nc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Pc = new RegExp(`\\b(${Ra}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), qc = new RegExp(`\\b(${Ra}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Wc = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Hc = (e) => e.replace(qc, (t, n, s) => s.replace(/\d+/g, (a) => Wc(n.replace(/s$/i, ""), a))), Fc = (e) => Hc(e).replace(
  Pc,
  (t, n, s, a = "", o) => {
    const i = s || o;
    return `<a class="row-pill" href="#" data-peek="${ut(n)}:${i}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${i}${a ? `:${a}` : ""}</span></a>`;
  }
);
nt(
  (e, t) => t.rowNames === !1 ? e : e.split(Nc).map((n, s) => s % 2 ? n : Fc(n)).join("")
);
const Uc = ["innerHTML"], zc = ["innerHTML"], Vc = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = D(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = zn(s, { env: De.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => K(lt) && K(lt)(...o)),
      innerHTML: n.value
    }, null, 8, Uc)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => K(lt) && K(lt)(...o)),
      innerHTML: n.value
    }, null, 8, zc));
  }
}, ct = /* @__PURE__ */ Y(Vc, [["__scopeId", "data-v-30fd9c25"]]), Gc = { class: "fact" }, Kc = { class: "fact-label" }, Yc = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Gc, [
      m("span", Kc, M(e.label), 1),
      V(ct, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Jc = /* @__PURE__ */ Y(Yc, [["__scopeId", "data-v-3a88ecf8"]]), Zc = { class: "list" }, Xc = { class: "list-label" }, Qc = {
  key: 1,
  class: "list-note"
}, eu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Zc, [
      (c(!0), h(Z, null, ie(e.items, (o, i) => (c(), G(et(o.open ? "button" : "div"), {
        key: i,
        type: o.open ? "button" : void 0,
        class: te(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: F(() => [
          m("span", Xc, M(o.label), 1),
          o.badge ? (c(), G(ka, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : P("", !0),
          o.note ? (c(), h("span", Qc, M(o.note), 1)) : P("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, tu = /* @__PURE__ */ Y(eu, [["__scopeId", "data-v-ebe2ae0a"]]), nu = { class: "table" }, su = {
  key: 0,
  class: "table-row empty"
}, au = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, i) => (c(), h("div", nu, [
      m("div", {
        class: "table-row head",
        style: $e(a.value)
      }, [
        (c(!0), h(Z, null, ie(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, M(r), 1))), 128))
      ], 4),
      (c(!0), h(Z, null, ie(e.rows, (r, l) => (c(), G(et(r.open ? "button" : "div"), {
        key: l,
        type: r.open ? "button" : void 0,
        class: te(["table-row", r.tone, { opens: r.open }]),
        style: $e(a.value),
        onClick: (u) => r.open && s("open", r.open)
      }, {
        default: F(() => [
          (c(!0), h(Z, null, ie(r.cells, (u, f) => (c(), h("span", {
            key: f,
            class: "cell"
          }, M(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", su, M(e.empty), 1)) : P("", !0)
    ]));
  }
}, ou = /* @__PURE__ */ Y(au, [["__scopeId", "data-v-9326a52e"]]), ru = { class: "stat-value" }, iu = { class: "stat-label" }, lu = {
  key: 0,
  class: "stat-note"
}, cu = {
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
    return (s, a) => (c(), G(et(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: te(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: F(() => [
        m("span", ru, M(e.value), 1),
        m("span", iu, M(e.label), 1),
        e.note ? (c(), h("span", lu, M(e.note), 1)) : P("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, uu = /* @__PURE__ */ Y(cu, [["__scopeId", "data-v-ad0db6d6"]]), du = { class: "code" }, hu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, i) => (c(), G(as, {
      value: e.node.type
    }, {
      stack: F(() => [
        V(Ht, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: F(() => [
        V(Ht, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: F(() => [
        V(Ht, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: F(() => [
        V(ri, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: F(() => [
        m("h3", {
          class: te(["heading", `level-${e.node.level || 2}`])
        }, M(e.node.text), 3)
      ]),
      divider: F(() => [...i[2] || (i[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: F(() => [
        V(uu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: i[0] || (i[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: F(() => [
        V(ei, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: F(() => [
        V(ou, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: F(() => [
        V(tu, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: F(() => [
        V(ct, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: F(() => [
        V(Jc, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: F(() => [
        V(ka, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: F(() => [
        m("pre", du, [
          m("code", null, M(e.node.text), 1)
        ])
      ]),
      file: F(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: i[1] || (i[1] = (r) => a(e.node))
        }, M(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Ka = /* @__PURE__ */ Y(hu, [["__scopeId", "data-v-cbdcf540"]]), fu = { class: "dashboard" }, pu = { class: "trail" }, gu = ["onClick"], mu = {
  key: 0,
  class: "gone",
  role: "status"
}, vu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (T) => T in (n.document.pages || {}), o = W(!!n.page && !a(n.page)), i = W(n.page && !o.value ? [n.page] : []), r = D(() => i.value.at(-1) || n.document.start), l = D(() => (n.document.pages || {})[r.value] || null), u = (T) => ((n.document.pages || {})[T] || {}).title || T, f = (T) => {
      o.value = !1, i.value = [...i.value, T];
    }, k = (T) => {
      o.value = !1, i.value = i.value.slice(0, T);
    };
    return xe(
      () => n.document.start,
      () => i.value = []
    ), (T, R) => (c(), h("div", fu, [
      e.document.broken ? (c(), G(Kt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: F(() => [
          ve(M(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(Kt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: F(() => [
          ve(M(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(Z, { key: 2 }, [
        m("nav", pu, [
          m("button", {
            type: "button",
            class: te(["step", { current: !i.value.length }]),
            onClick: R[0] || (R[0] = (H) => k(0))
          }, M(u(e.document.start)), 3),
          (c(!0), h(Z, null, ie(i.value, (H, b) => (c(), h(Z, {
            key: `${b}-${H}`
          }, [
            R[2] || (R[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: te(["step", { current: b === i.value.length - 1 }]),
              onClick: ($) => k(b + 1)
            }, M(u(H)), 11, gu)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", mu, "What you opened is no longer in this dashboard. Here is its start page.")) : P("", !0),
        V(on, {
          name: "page",
          mode: "out-in"
        }, {
          default: F(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              V(Ka, {
                node: l.value.view,
                onOpen: f,
                onFile: R[1] || (R[1] = (H) => s("file", H))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : P("", !0)
    ]));
  }
}, Hg = /* @__PURE__ */ Y(vu, [["__scopeId", "data-v-fbe83734"]]);
function yu(e, t, n, s = () => window) {
  je(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ee(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const wu = (e, t = () => !0) => yu("keydown", (n) => n.key === "Escape" && t() && e());
function ku(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = W(!1), a = D(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return wu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const bu = 80, ot = ts([]);
function xu(e) {
  const t = Symbol("layer"), n = () => ot.includes(t) && ot.splice(ot.indexOf(t), 1);
  return xe(
    e,
    (s) => {
      s && !ot.includes(t) && ot.push(t), s || n();
    },
    { immediate: !0 }
  ), Ee(n), D(() => bu + Math.max(0, ot.indexOf(t)));
}
let Ya = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Ya = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const $u = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Mu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const i = [...e.value.querySelectorAll($u)];
    if (!i.length) return o.preventDefault();
    const [r, l] = [i[0], i.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  je(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : Ya, document.addEventListener("keydown", a), ns(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ee(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const _u = ["aria-modal", "aria-label", "aria-labelledby"], Su = {
  key: 0,
  class: "dialog-head"
}, Eu = ["id", "tabindex"], Au = {
  key: 1,
  class: "dialog-foot"
}, Ou = 500, Cu = 400, Tu = {
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
    const n = e, s = t, { visible: a, close: o, closed: i } = ku(s, n), r = xu(a), l = W(null), u = W(null), f = W(null), k = ia(), T = W(!1), R = Date.now();
    n.modal && Mu(u, () => s("escape"), f);
    function H() {
      if (!n.modal) return n.closable && o();
      T.value = !0, setTimeout(() => T.value = !1, Cu);
    }
    function b(j) {
      !n.modal || Date.now() - R >= Ou || ![" ", "Enter"].includes(j.key) || (j.preventDefault(), j.stopPropagation());
    }
    const $ = () => l.value && (l.value.scrollTop = l.value.scrollHeight), A = new MutationObserver($);
    return xe(l, (j) => {
      A.disconnect(), j && n.follow && (A.observe(j, { childList: !0, subtree: !0, characterData: !0 }), $());
    }), Ee(() => A.disconnect()), (j, Q) => (c(), G(la, { to: "body" }, [
      V(on, {
        name: "dialog",
        appear: "",
        onAfterLeave: K(i)
      }, {
        default: F(() => [
          K(a) ? (c(), h("div", {
            key: 0,
            class: te(["dialog", { large: e.large, sheet: e.sheet }]),
            style: $e({ zIndex: K(r) }),
            onClick: Se(H, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: u,
              class: te(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: T.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? K(k) : void 0,
              onKeydownCapture: b
            }, [
              e.bare ? P("", !0) : (c(), h("header", Su, [
                m("h3", {
                  id: K(k),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, M(e.title), 9, Eu),
                e.closable ? (c(), G(wa, {
                  key: 0,
                  onClick: K(o)
                }, null, 8, ["onClick"])) : P("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: l,
                class: te(["dialog-body", { bare: e.bare }])
              }, [
                be(j.$slots, "default", {}, void 0, !0)
              ], 2),
              j.$slots.foot ? (c(), h("footer", Au, [
                be(j.$slots, "foot", {}, void 0, !0)
              ])) : P("", !0)
            ], 42, _u)
          ], 6)) : P("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Bu = /* @__PURE__ */ Y(Tu, [["__scopeId", "data-v-6d1ecd98"]]), Fe = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Be = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Te = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Ru = 6;
function ds(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Lu = (e) => {
  const t = ds(e, Fe.lineChars), n = Math.max(Fe.minWidth, Math.max(...t.map((s) => s.length)) * Fe.charWidth + Fe.padX * 2);
  return { name: e, lines: t, line: Fe.line, padY: Fe.padY, width: n, height: t.length * Fe.line + Fe.padY * 2 };
};
function Du(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (i) => {
    a.set(i, "open"), t.forEach((r, l) => {
      if (r[0] !== i) return;
      const u = a.get(r[1]);
      u === "open" ? s.add(l) : u || o(r[1]);
    }), a.set(i, "done");
  };
  return [...n, ...e].forEach((i) => a.has(i) || o(i)), s;
}
function Iu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, i]) => {
      n.get(i) < n.get(o) + 1 && (n.set(i, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function ju(e, t, n) {
  const s = [];
  e.forEach((i) => {
    var r;
    return (s[r = n.get(i)] || (s[r] = [])).push(i);
  });
  const a = () => new Map(s.flatMap((i) => i.map((r, l) => [r, l]))), o = (i, r) => {
    const l = a(), u = (f) => {
      const k = r(f).map((T) => l.get(T));
      return k.length ? k.reduce((T, R) => T + R, 0) / k.length : l.get(f);
    };
    return [...i].sort((f, k) => u(f) - u(k));
  };
  for (let i = 0; i < Ru; i++) {
    const r = i % 2 === 0, l = s.map((u, f) => f);
    (r ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const f = (k) => t.filter((T) => T[r ? 1 : 0] === k).map((T) => T[r ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
function Nu(e, t) {
  const n = /* @__PURE__ */ new Map(), s = (a, o, i, r) => {
    const l = `${a[o]}:${i}`;
    (n.get(l) || n.set(l, []).get(l)).push({ arrow: a, end: o, other: r });
  };
  e.forEach((a) => {
    s(a, "from", a.back ? "top" : "bottom", a.to), s(a, "to", a.back ? "bottom" : "top", a.from);
  });
  for (const a of n.values())
    a.sort((o, i) => t.get(o.other).x - t.get(i.other).x), a.forEach(({ arrow: o, end: i }, r) => o[`${i}Share`] = (r + 1) / (a.length + 1));
}
function Pu(e) {
  const t = [...new Set(e.flatMap(([q, E]) => [q, E]))], n = new Set(e.map(([, q]) => q)), s = t.filter((q) => !n.has(q)), a = Du(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((q, E) => !a.has(E)), i = Iu(t, o), r = ju(t, o, i), l = new Map(t.map((q) => [q, Lu(q)])), u = r.map((q) => q.reduce((E, _) => E + l.get(_).width, 0) + Te.across * (q.length - 1)), f = Math.max(...u) + Te.margin * 2, k = Wu(e, i, r.length), T = /* @__PURE__ */ new Map();
  let R = Te.margin;
  r.forEach((q, E) => {
    let _ = (f - u[E]) / 2;
    const p = Math.max(...q.map((y) => l.get(y).height));
    q.forEach((y) => {
      const w = l.get(y);
      T.set(y, { ...w, x: _, y: R + (p - w.height) / 2 }), _ += w.width + Te.across;
    }), R += p + (k[E] ?? Te.down);
  });
  const H = e.map(([q, E, _], p) => ({ from: q, to: E, label: _ || "", back: a.has(p) || i.get(E) <= i.get(q) }));
  Nu(H, T);
  const b = H.map((q) => Hu(q, T.get(q.from), T.get(q.to))), $ = [...T.values()], A = Vu(b, $), j = Math.max(R - Te.down, ...A.filter((q) => q.label).map((q) => q.label.y + q.label.height));
  return { width: Math.max(f - Te.margin, ...A.filter((q) => q.label).map((q) => q.label.x + q.label.width)) + Te.margin, height: j + Te.margin, nodes: $, arrows: A };
}
const qu = (e) => e ? ds(e, Be.lineChars).length * Be.line + Be.pad * 2 : 0;
function Wu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Te.labelSpace);
  return e.forEach(([a, o, i]) => {
    const [r, l] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    l > r && (s[r + Math.floor((l - r - 1) / 2)] += qu(i) + Te.labelSpace);
  }), s.map((a) => Math.max(Te.down, a));
}
function Hu(e, t, n) {
  const s = e.label ? ds(e.label, Be.lineChars) : [], a = s.length ? Math.max(...s.map((T) => T.length)) * Be.charWidth + Be.pad * 2 : 0, o = s.length * Be.line + (s.length ? Be.pad * 2 : 0), i = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - r) / 2, k = [{ x: i, y: r }, { x: i, y: r + f }, { x: l, y: u - f }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: k, path: `M${i} ${r} C${i} ${r + f} ${l} ${u - f} ${l} ${u}` };
}
const Fu = ([e, t, n, s], a) => {
  const o = 1 - a, i = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: i("x"), y: i("y") };
}, Uu = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], zu = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Be.line);
function Vu(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: i }) => ({ x: s, y: a, width: o, height: i }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const f = Fu(s.curve, l);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, r = zu.flatMap((l) => Uu.map((u) => a(u, l))).find((l) => !n.some((u) => Ws(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => Ws(r, l)); ) r.y += Be.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: Be.line, pad: Be.pad } };
  });
}
const Ws = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Gu = { class: "flowchart-tools" }, Ku = ["width", "height", "viewBox", "aria-label"], Yu = ["d"], Ju = ["x", "y", "width", "height"], Zu = ["x", "y"], Xu = ["x", "dy"], Qu = {
  key: 0,
  class: "flowchart-label"
}, ed = ["x", "y", "width", "height"], td = ["x", "y"], nd = ["x", "dy"], sd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => Pu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, i = W(null), r = W({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var A;
      const b = (A = i.value) == null ? void 0 : A.getBoundingClientRect();
      if (!(b != null && b.width)) return;
      const $ = Math.min(b.width / a.value.width, b.height / a.value.height, 1.5);
      r.value = { zoom: $, x: (b.width - a.value.width * $) / 2, y: (b.height - a.value.height * $) / 2 };
    }
    function f(b, $, A) {
      const { zoom: j, x: Q, y: q } = r.value, E = Math.min(o.most, Math.max(o.least, j * b));
      r.value = { zoom: E, x: $ - ($ - Q) * E / j, y: A - (A - q) * E / j };
    }
    function k(b) {
      const $ = i.value.getBoundingClientRect();
      f(b, $.width / 2, $.height / 2);
    }
    function T(b) {
      const $ = i.value.getBoundingClientRect();
      b.ctrlKey || b.metaKey ? f(b.deltaY < 0 ? o.step : 1 / o.step, b.clientX - $.left, b.clientY - $.top) : r.value = { ...r.value, x: r.value.x - b.deltaX, y: r.value.y - b.deltaY };
    }
    function R(b) {
      var $, A, j;
      b.preventDefault(), ($ = window.getSelection()) == null || $.removeAllRanges(), l = { x: b.clientX - r.value.x, y: b.clientY - r.value.y }, (j = (A = i.value).setPointerCapture) == null || j.call(A, b.pointerId);
    }
    function H(b) {
      l && (r.value = { ...r.value, x: b.clientX - l.x, y: b.clientY - l.y });
    }
    return je(u), (b, $) => (c(), G(Bu, {
      title: e.title,
      large: "",
      onClose: $[4] || ($[4] = (A) => s("close"))
    }, {
      default: F(() => [
        m("div", Gu, [
          V(we, {
            small: "",
            onClick: $[0] || ($[0] = (A) => k(o.step))
          }, {
            default: F(() => [...$[5] || ($[5] = [
              ve("Zoom in", -1)
            ])]),
            _: 1
          }),
          V(we, {
            small: "",
            onClick: $[1] || ($[1] = (A) => k(1 / o.step))
          }, {
            default: F(() => [...$[6] || ($[6] = [
              ve("Zoom out", -1)
            ])]),
            _: 1
          }),
          V(we, {
            small: "",
            onClick: u
          }, {
            default: F(() => [...$[7] || ($[7] = [
              ve("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: i,
          class: "flowchart-frame",
          onWheel: Se(T, ["prevent"]),
          onPointerdown: R,
          onPointermove: H,
          onPointerup: $[2] || ($[2] = (A) => ys(l) ? l.value = null : l = null),
          onPointercancel: $[3] || ($[3] = (A) => ys(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: $e({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            $[8] || ($[8] = m("defs", null, [
              m("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                m("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (c(!0), h(Z, null, ie(a.value.arrows, (A, j) => (c(), h("path", {
              key: `arrow-${j}`,
              class: "flowchart-arrow",
              d: A.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Yu))), 128)),
            (c(!0), h(Z, null, ie(a.value.nodes, (A) => (c(), h("g", {
              key: A.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: A.x,
                y: A.y,
                width: A.width,
                height: A.height,
                rx: "8"
              }, null, 8, Ju),
              m("text", {
                x: A.x + A.width / 2,
                y: A.y + A.padY + A.line / 2
              }, [
                (c(!0), h(Z, null, ie(A.lines, (j, Q) => (c(), h("tspan", {
                  key: Q,
                  x: A.x + A.width / 2,
                  dy: Q ? A.line : 0
                }, M(j), 9, Xu))), 128))
              ], 8, Zu)
            ]))), 128)),
            (c(!0), h(Z, null, ie(a.value.arrows, (A, j) => (c(), h(Z, {
              key: `label-${j}`
            }, [
              A.label ? (c(), h("g", Qu, [
                m("rect", {
                  x: A.label.x,
                  y: A.label.y,
                  width: A.label.width,
                  height: A.label.height,
                  rx: "4"
                }, null, 8, ed),
                m("text", {
                  x: A.label.x + A.label.width / 2,
                  y: A.label.y + A.label.pad + A.label.line / 2
                }, [
                  (c(!0), h(Z, null, ie(A.label.lines, (Q, q) => (c(), h("tspan", {
                    key: q,
                    x: A.label.x + A.label.width / 2,
                    dy: q ? A.label.line : 0
                  }, M(Q), 9, nd))), 128))
                ], 8, td)
              ])) : P("", !0)
            ], 64))), 128))
          ], 12, Ku))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ad = /* @__PURE__ */ Y(sd, [["__scopeId", "data-v-51d24cfe"]]), od = ["title", "aria-label"], rd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, id = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, ld = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = D(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: te(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", rd, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", id)) : P("", !0)
      ]))
    ], 10, od));
  }
}, cd = /* @__PURE__ */ Y(ld, [["__scopeId", "data-v-6dc92808"]]), ud = "img,pre,table";
function dd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function hd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function fd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(ud)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = dd(hd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function pd(e, t) {
  let n = null;
  const s = () => e.value && fd(e.value);
  je(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ee(() => n == null ? void 0 : n.disconnect()), xe(t, s, { flush: "post" });
}
const gd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function md(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const vd = ["data-from", "data-ref"], yd = { class: "message-body" }, wd = ["innerHTML"], kd = ["innerHTML"], bd = {
  class: "message-tools",
  "data-message-tools": ""
}, xd = {
  key: 0,
  class: "message-faces",
  "data-message-faces": ""
}, $d = ["title", "data-face", "onClick"], Md = {
  key: 1,
  class: "message-reactions",
  "data-message-reactions": ""
}, _d = ["title", "data-reaction", "onClick"], Sd = {
  key: 0,
  class: "message-reaction-count"
}, Ed = {
  key: 2,
  class: "message-files",
  "data-message-files": ""
}, Ad = ["href", "title"], Od = ["src", "alt"], Cd = ["href"], Td = { class: "message-foot" }, Bd = { class: "message-time" }, Rd = 1500, Ld = "An earlier message", Dd = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(!1), o = W(null), i = D(() => ["user", "comment"].includes(n.message.type)), r = D(() => i.value && !n.message.read_at && !n.message.local);
    async function l() {
      var _;
      await ((_ = navigator.clipboard) == null ? void 0 : _.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Rd);
    }
    const u = D(() => zn(n.message.text ?? "", { env: "" })), f = D(() => JSON.parse(n.message.flowchart_edges || "[]")), k = W(!1), T = D(() => zn(n.quote || Ld, { env: "" }));
    function R() {
      const _ = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      _ ? _.scrollIntoView({ block: "center", behavior: "smooth" }) : pt(`messages:${n.message.parent_id}`);
    }
    pd(o, () => `${n.message.text} ${n.quote}`);
    const H = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, b = (_) => `/api/files/message/${n.message.id}/${encodeURIComponent(_)}`, $ = D(() => JSON.parse(n.message.captions || "{}")), A = D(() => (n.message.files ?? []).map((_) => ({ name: _, address: b(_), isImage: H.test(_), title: $.value[_] || _ }))), j = D(() => Ea(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), Q = W(!1), q = D(() => md(n.message.reactions));
    function E(_) {
      Q.value = !1, s("react", n.message, _);
    }
    return (_, p) => (c(), h("article", {
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": i.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", yd, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: "message-card md",
          onClick: p[2] || (p[2] = (...y) => K(lt) && K(lt)(...y))
        }, [
          e.message.parent_id ? (c(), h("div", {
            key: 0,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Se(R, ["stop"]),
            innerHTML: T.value
          }, null, 8, wd)) : P("", !0),
          m("div", { innerHTML: u.value }, null, 8, kd),
          f.value.length ? (c(), h(Z, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: p[0] || (p[0] = (y) => k.value = !0)
            }, "Open the flowchart"),
            k.value ? (c(), G(ad, {
              key: 0,
              title: e.message.text,
              edges: f.value,
              onClose: p[1] || (p[1] = (y) => k.value = !1)
            }, null, 8, ["title", "edges"])) : P("", !0)
          ], 64)) : P("", !0)
        ], 512),
        m("div", bd, [
          m("button", {
            type: "button",
            class: "message-tool",
            "data-message-action": "react",
            title: "React to this",
            onClick: p[3] || (p[3] = (y) => Q.value = !Q.value)
          }, "React"),
          m("button", {
            type: "button",
            class: "message-tool",
            "data-message-action": "reply",
            onClick: p[4] || (p[4] = (y) => s("reply", e.message))
          }, "Reply"),
          m("button", {
            type: "button",
            class: "message-tool",
            "data-message-action": "copy",
            onClick: l
          }, M(a.value ? "Copied" : "Copy"), 1),
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-tool",
            "data-message-action": "delete",
            title: "Only while it is unread",
            onClick: p[5] || (p[5] = (y) => s("delete", e.message))
          }, "Delete")) : P("", !0)
        ])
      ]),
      Q.value ? (c(), h("div", xd, [
        (c(!0), h(Z, null, ie(K(gd), (y) => (c(), h("button", {
          key: y,
          type: "button",
          class: "message-face",
          title: `React ${y}`,
          "data-face": y,
          onClick: (w) => E(y)
        }, M(y), 9, $d))), 128))
      ])) : P("", !0),
      q.value.length ? (c(), h("div", Md, [
        (c(!0), h(Z, null, ie(q.value, (y) => (c(), h("button", {
          key: y.emoji,
          type: "button",
          class: te(["message-reaction", { mine: y.mine }]),
          title: y.title,
          "data-reaction": y.emoji,
          onClick: (w) => s("react", e.message, y.emoji)
        }, [
          ve(M(y.emoji) + " ", 1),
          y.count > 1 ? (c(), h("span", Sd, M(y.count), 1)) : P("", !0)
        ], 10, _d))), 128))
      ])) : P("", !0),
      A.value.length ? (c(), h("div", Ed, [
        (c(!0), h(Z, null, ie(A.value, (y) => (c(), h(Z, {
          key: y.name
        }, [
          y.isImage ? (c(), h("a", {
            key: 0,
            href: y.address,
            target: "_blank",
            class: "message-image",
            title: y.title
          }, [
            m("img", {
              src: y.address,
              alt: y.name
            }, null, 8, Od)
          ], 8, Ad)) : (c(), h("a", {
            key: 1,
            href: y.address,
            target: "_blank",
            class: "message-file"
          }, M(y.name), 9, Cd))
        ], 64))), 128))
      ])) : P("", !0),
      m("div", Td, [
        m("time", Bd, M(j.value), 1),
        i.value ? (c(), G(cd, {
          key: 0,
          message: e.message
        }, null, 8, ["message"])) : P("", !0)
      ])
    ], 8, vd));
  }
}, Fg = /* @__PURE__ */ Y(Dd, [["__scopeId", "data-v-d04402e9"]]), Hs = {
  words: '<rect x="2.5" y="3" width="11" height="8" rx="2"/><polyline points="5,11 5,13.5 8,11"/>',
  summary: '<line x1="3" y1="4.5" x2="13" y2="4.5"/><line x1="3" y1="8" x2="11" y2="8"/><line x1="3" y1="11.5" x2="8" y2="11.5"/>',
  fault: '<polygon points="8,2.5 14,13 2,13"/><line x1="8" y1="6.5" x2="8" y2="9.3"/><circle class="f" cx="8" cy="11.2" r=".75"/>',
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
}, Id = ["innerHTML"], jd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = D(() => Hs[t.name] || Hs.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Id));
  }
}, _t = /* @__PURE__ */ Y(jd, [["__scopeId", "data-v-beb5935c"]]), Nd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: te(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      V(_t, { name: "fold" })
    ], 2));
  }
}, Ja = /* @__PURE__ */ Y(Nd, [["__scopeId", "data-v-d03899bb"]]), Pd = ["aria-checked", "aria-haspopup", "onClick"], qd = {
  key: 0,
  class: "segmented-dot"
}, Wd = {
  key: 1,
  class: "segmented-count"
}, Hd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ia();
    return (a, o) => {
      const i = Ro("tip");
      return c(), h("span", {
        class: te(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(Z, null, ie(e.options, (r) => Gt((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: te(["segmented-option", { on: r.key === e.value }]),
          onClick: (l) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", qd)) : P("", !0),
          ve(" " + M(r.label) + " ", 1),
          r.count !== void 0 ? (c(), h("em", Wd, M(r.count), 1)) : P("", !0)
        ], 10, Pd)), [
          [i, r.tip || r.title, `${K(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Gn = /* @__PURE__ */ Y(Hd, [["__scopeId", "data-v-ca953072"]]), Fs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Fd = {
  key: 1,
  class: "text-field-label"
}, Ud = {
  key: 2,
  class: "text-field-end"
}, zd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Io({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Lo(e, "modelValue"), s = ca(), a = "onUpdate:modelValue" in (((f = Do()) == null ? void 0 : f.vnode.props) || {}), o = D(() => a ? n.value : s.value), i = (k) => a && (n.value = k.target.value), r = D(
      () => Object.fromEntries(Object.entries(s).filter(([k]) => k !== "class" && k !== "style" && k !== "value"))
    ), l = D(() => Object.fromEntries(Object.entries(s).filter(([k]) => k !== "value"))), u = W(null);
    return t({ focus: () => u.value && u.value.focus() }), (k, T) => e.label || e.icon || k.$slots.end ? (c(), h("label", {
      key: 0,
      class: te(["text-field", { large: e.large, ended: k.$slots.end }, K(s).class]),
      style: $e(K(s).style)
    }, [
      e.icon ? (c(), G(Ie, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : P("", !0),
      e.label ? (c(), h("span", Fd, M(e.label), 1)) : P("", !0),
      Gt(m("input", dt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: i }), null, 16), [
        [K(Fs), o.value]
      ]),
      k.$slots.end ? (c(), h("span", Ud, [
        be(k.$slots, "end", {}, void 0, !0)
      ])) : P("", !0)
    ], 6)) : Gt((c(), h("input", dt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: i }), null, 16)), [
      [K(Fs), o.value]
    ]);
  }
}), Vd = /* @__PURE__ */ Y(zd, [["__scopeId", "data-v-d9c38ca8"]]);
function Gd(e, t, { incremental: n = !1 } = {}) {
  const s = ha(), a = W([]), o = W(""), i = W(!1), r = W(""), l = W(null);
  async function u(b) {
    const $ = await s.read(`${e} --before-id ${b + 1} --limit 1`);
    if (!$.ok) return R();
    const A = $.value.rows.find((j) => j.id === b);
    a.value = A ? a.value.map((j) => j.id === b ? A : j) : a.value.filter((j) => j.id !== b);
  }
  async function f(b) {
    if (n && String((b == null ? void 0 : b.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((q) => q.id !== b.row_id));
    if (n && (b != null && b.row_id) && !String(b.event ?? "").endsWith(".create") && a.value.some((q) => q.id === b.row_id)) return u(b.row_id);
    if (!(n && a.value.length && String((b == null ? void 0 : b.event) ?? "").endsWith(".create"))) return R();
    const A = Math.max(...a.value.map((q) => q.id)), j = await s.read(`${e} --after-id ${A}`);
    if (!j.ok) return R();
    const Q = new Set(a.value.map((q) => q.id));
    a.value = [...j.value.rows.filter((q) => !Q.has(q.id)), ...a.value];
  }
  async function k() {
    if (!a.value.length) return !1;
    const b = Math.min(...a.value.map((j) => j.id)), $ = await s.read(`${e} --before-id ${b}`);
    if (!$.ok || !$.value.rows.length) return !1;
    const A = new Set(a.value.map((j) => j.id));
    return a.value = [...a.value, ...$.value.rows.filter((j) => !A.has(j.id))], !0;
  }
  let T = 0;
  async function R() {
    const b = ++T, $ = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (b !== T) return;
    const A = $.ok ? s.shared ? [$.value] : $.value.rows : [], j = A.length ? Math.min(...A.map((Q) => Q.id)) : 0;
    a.value = n && $.ok && j ? [...a.value.filter((Q) => Q.id > Math.max(...A.map((q) => q.id))), ...A, ...a.value.filter((Q) => Q.id < j)] : A, o.value = $.ok ? "" : $.error, i.value = !0;
  }
  async function H(b) {
    const $ = await s.run(b);
    return r.value = $.ok ? "" : $.error, l.value = $.ok ? $.value : null, await R(), $;
  }
  return s.follow(t, f), R(), { rows: a, failure: o, loaded: i, load: R, older: k, act: H, actionFailure: r, answer: l, context: s };
}
const Kd = { class: "title" }, Yd = { class: "state" }, Jd = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Gd(t.line, t.events);
    return (o, i) => (c(), G(Rr, {
      rows: K(n),
      failure: K(s),
      loaded: K(a),
      empty: e.empty
    }, {
      default: F(({ row: r }) => [
        m("span", Kd, M(r.title), 1),
        m("span", Yd, M(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Ug = /* @__PURE__ */ Y(Jd, [["__scopeId", "data-v-a69084cd"]]), Zd = ["data-tip", "aria-label"], Xd = {
  key: 0,
  class: "mact-word"
}, Qd = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: te(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      V(_t, { name: "open" }),
      e.open ? (c(), h("span", Xd, M(e.label), 1)) : P("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, Zd));
  }
}, eh = /* @__PURE__ */ Y(Qd, [["__scopeId", "data-v-3b292e09"]]), $n = W(Date.now() / 1e3);
let Us = 0, Nt = 0;
function th() {
  return Nt || ($n.value = Date.now() / 1e3, Us = setInterval(() => $n.value = Date.now() / 1e3, 1e3)), Nt += 1, ua() && da(() => {
    Nt -= 1, Nt || clearInterval(Us);
  }), $n;
}
const nh = 120, Mn = 280, sh = 160, ah = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function oh(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = W(t()), a = W("");
  let o = 0;
  const i = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), r = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const f = e.value, k = ++o;
    if (!f || !f.offsetWidth || ah()) {
      s.value = u;
      return;
    }
    const T = { width: f.offsetWidth, height: f.offsetHeight };
    if (i(f, T), a.value = "leaving", await n(nh), k !== o) return;
    s.value = u, a.value = "resizing", await ns(), r(f);
    const R = { width: f.offsetWidth, height: f.offsetHeight };
    i(f, T), f.offsetWidth, f.style.transition = `width ${Mn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Mn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, i(f, R), await n(Mn), k === o && (r(f), a.value = "entering", await n(sh), k === o && (a.value = ""));
  }
  return xe(t, (u) => l(u)), ss(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const rh = ["title", "data-figure-mark", "data-folded", "data-open"], ih = {
  key: 2,
  class: "worker"
}, lh = { class: "head" }, ch = { key: 0 }, uh = {
  key: 3,
  class: "status"
}, dh = {
  key: 0,
  class: "figure"
}, hh = {
  key: 1,
  class: "ran-for"
}, fh = { key: 2 }, ph = { key: 3 }, gh = {
  key: 4,
  class: "news"
}, mh = {
  key: 5,
  class: "spin",
  "aria-label": "Still running"
}, vh = {
  key: 7,
  class: "settled"
}, yh = {
  key: 1,
  class: "bar"
}, wh = {
  key: 3,
  class: "detail body"
}, kh = {
  key: 0,
  class: "body-label"
}, bh = ["title"], xh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ca(), s = ["onClick", "onAct"], a = D(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = W(!1), i = D(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = D(() => t.open !== void 0), l = D(() => r.value || i.value), u = D(() => r.value ? t.open : o.value), f = D(() => r.value ? !t.open : i.value && !o.value), k = D(() => !!(t.mark.action && n.onAct)), T = D(() => l.value || k.value || !!n.onClick), R = W(null), H = W(null), { folded: b, phase: $ } = oh(R, () => f.value);
    function A(le) {
      var pe, Me;
      if (!(le.target !== R.value && !H.value.contains(le.target))) {
        if (r.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, le);
        if (i.value) return void (o.value = !o.value);
        (Me = n.onAct || n.onClick) == null || Me(le);
      }
    }
    const j = (le) => n.onAct(le), Q = ["failed", "unfinished"], q = D(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Q.includes(t.mark.state) ? "danger" : "good" : ""), E = D(() => t.mark.color ? t.mark.color : q.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : q.value ? `var(--tone-${q.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), _ = D(() => E.value || "var(--tone-work)"), p = D(() => !t.mark.ending && !t.mark.ended && q.value !== "stopped"), y = th(), w = D(
      () => t.mark.began_at && p.value && !t.mark.figure && !t.mark.counting ? Wi(y.value - t.mark.began_at) : ""
    ), v = D(() => {
      const { started: le, ended: pe } = t.mark;
      return le ? pe ? `ran ${Os(pe - le, !0)}` : Os(y.value - le, !0) : w.value;
    }), g = ["bad", "danger", "warn"], d = D(() => g.includes(q.value) || t.mark.asks ? "attention" : p.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], O = D(() => S.includes(q.value)), N = D(() => d.value === "process" ? "running" : O.value ? "cross" : q.value === "stopped" ? "stopped" : q.value === "good" ? "tick" : ""), ae = D(
      () => !!(t.mark.figure || v.value || t.mark.docked || t.mark.stopping || N.value || t.mark.settled || t.mark.news)
    ), oe = D(() => [t.mark.title, t.mark.time ? Ea(t.mark.time) : ""].filter(Boolean).join(" · ")), de = D(() => ({
      ...E.value ? { "--mark": E.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, pe) => (c(), h("div", dt(a.value, {
      ref_key: "root",
      ref: R,
      class: [
        "mark",
        `w-${d.value}`,
        K($),
        {
          open: u.value,
          live: T.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: E.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: de.value,
      title: oe.value,
      "data-figure-mark": e.mark.key,
      "data-folded": K(b) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: A
    }), [
      (c(), G(et(T.value ? "button" : "span"), {
        ref_key: "top",
        ref: H,
        class: "top",
        type: T.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: F(() => [
          e.mark.markIcon ? (c(), G(_t, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), G(Ie, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", ih, M(e.mark.worker), 1)) : P("", !0),
          m("span", lh, [
            V(ct, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", ch, M(e.mark.name), 1)) : P("", !0),
            l.value ? (c(), G(Ja, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : P("", !0)
          ]),
          ae.value ? (c(), h("span", uh, [
            e.mark.figure ? (c(), h("span", dh, M(e.mark.figure), 1)) : P("", !0),
            v.value ? (c(), h("span", hh, M(v.value), 1)) : P("", !0),
            e.mark.docked ? (c(), h("span", fh, "In the dock")) : P("", !0),
            e.mark.stopping ? (c(), h("span", ph, "Stopping")) : P("", !0),
            e.mark.news ? (c(), h("span", gh, M(e.mark.news), 1)) : P("", !0),
            N.value === "running" ? (c(), h("span", mh)) : N.value ? (c(), G(_t, {
              key: 6,
              class: te(["sign", N.value]),
              name: N.value
            }, null, 8, ["class", "name"])) : P("", !0),
            e.mark.settled ? (c(), h("span", vh, M(e.mark.settled), 1)) : P("", !0)
          ])) : P("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      k.value ? (c(), G(eh, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: Se(j, ["stop"])
      }, null, 8, ["label", "open"])) : P("", !0),
      (e.mark.figure || e.mark.counting) && p.value ? (c(), h("span", yh, [
        m("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: _.value })
        }, null, 4)
      ])) : P("", !0),
      e.mark.detail && !K(b) ? (c(), G(ct, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      e.mark.body && !K(b) ? (c(), h("div", wh, [
        e.mark.bodyLabel ? (c(), h("p", kh, M(e.mark.bodyLabel), 1)) : P("", !0),
        V(ct, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : P("", !0),
      e.mark.command && !K(b) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, M(e.mark.command), 9, bh)) : P("", !0),
      e.mark.card ? (c(), G(ct, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      be(le.$slots, "default", {
        shown: !K(b)
      }, void 0, !0)
    ], 16, rh));
  }
}), $h = /* @__PURE__ */ Y(xh, [["__scopeId", "data-v-de840831"]]), Mh = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Za(e) {
  var n;
  const t = Mh[e] || ((n = hn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const _h = (e) => Za(String(e).split(":")[0]), Xa = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Sh = { passed: "good", failed: "danger", warned: "warn", running: "" }, zs = {
  "open row": (e) => pt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => _r(e.target_model, e.target_id || 0)
}, Eh = { "open row": (e) => _h(e.target_model), "open page": () => Za("pages") };
function Ah(e, t) {
  const n = t || {}, s = zs[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" && Sh[e.outcome] || "",
    label: e.text,
    // a mark with a body of its module's own keeps its lines for that body, and its cut-off first part is not a second line
    detail: n.body_url ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Eh[s](e) : "",
    handlers: s ? { onAct: () => zs[s](e) } : {}
  };
}
const Oh = 24, Ch = 1e3, Vs = 2e3, Th = 0.25, Bh = 5e3;
function Rh(e, t = Oh, n = () => !0) {
  const s = W(!1), a = W(0), o = W(!1);
  let i = 0, r = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const q = u();
    return q ? q.scrollHeight - q.scrollTop - q.clientHeight : 0;
  }, k = () => !u() || f() <= t;
  function T(q) {
    if (clearTimeout(i), !q) {
      o.value = !1, l = Date.now();
      return;
    }
    const E = Date.now() - l < Vs ? Vs : Ch;
    i = setTimeout(() => o.value = s.value, E);
  }
  function R() {
    clearTimeout(r), s.value = !1, a.value = 0, T(!1);
  }
  function H(q = !1) {
    const E = u();
    E && q && E.scrollTo ? E.scrollTo({ top: E.scrollHeight, behavior: "smooth" }) : E && (E.scrollTop = E.scrollHeight), R();
  }
  function b() {
    A(), !s.value && (s.value = !0, T(!0));
  }
  const $ = () => !!u() && f() <= u().clientHeight * Th;
  function A() {
    clearTimeout(r), $() && (r = setTimeout(() => s.value && $() && n() && H(!0), Bh));
  }
  function j() {
    k() ? R() : b();
  }
  function Q(q = 1, E = !1) {
    s.value ? a.value += Math.max(0, q) : H(E);
  }
  return ua() && da(() => [i, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: k, follow: R, toBottom: H, left: b, scrolled: j, arrived: Q };
}
const Lh = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(null), { away: o, scrolled: i, arrived: r, toBottom: l } = Rh(a);
    xe(
      () => n.lines.length,
      () => ns(() => r()),
      { immediate: !0 }
    );
    function u(f) {
      i(), s("older", f.target);
    }
    return (f, k) => (c(), h("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      ve(M(e.lines.join(`
`) || e.empty), 1),
      K(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: k[0] || (k[0] = (T) => K(l)(!0))
      }, "Follow")) : P("", !0)
    ], 544));
  }
}, Dh = /* @__PURE__ */ Y(Lh, [["__scopeId", "data-v-09394a20"]]), Ih = 1e4;
class jh {
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
    return this.heardAt !== null && t - this.heardAt > Ih;
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
const Nh = {
  key: 0,
  class: "frame-note"
}, Ph = {
  key: 0,
  class: "frame-note"
}, qh = ["src", "title"], Wh = 1e3, Hh = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ha(), s = W(null), a = W(!1), o = W(!1);
    let i = null, r = 0;
    return je(() => {
      i = new jh(s.value, n), i.start(), r = setInterval(() => {
        a.value = i.silent();
      }, Wh);
    }), Ee(() => {
      i == null || i.stop(), clearInterval(r);
    }), (l, u) => o.value ? (c(), h("p", Nh, "This window was closed because it stopped answering.")) : (c(), h(Z, { key: 1 }, [
      a.value ? (c(), h("div", Ph, [
        u[2] || (u[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        V(we, {
          onClick: u[0] || (u[0] = (f) => o.value = !0)
        }, {
          default: F(() => [...u[1] || (u[1] = [
            ve("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : P("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: K(n).window
      }, null, 8, qh)
    ], 64));
  }
}, Fh = /* @__PURE__ */ Y(Hh, [["__scopeId", "data-v-32a49046"]]), Uh = 0, zh = "/api/lines", Vh = "/api/line";
class Gh {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Uh));
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
        const n = await Le.raw(zh, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Le.raw(Vh, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Kh = new Gh();
class Yh {
  constructor() {
    this.follows = [], this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, s, a = () => !0) {
    const o = { window: t, patterns: n, heard: s, visible: a };
    return this.follows.push(o), () => this.follows = this.follows.filter((i) => i !== o);
  }
  count(t) {
    return this.follows.filter((n) => n.window === t).length;
  }
  stopAll(t) {
    this.follows = this.follows.filter((n) => n.window !== t), this.held = new Set([...this.held].filter((n) => n.window !== t));
  }
  dispatch(t) {
    for (const n of this.follows)
      n.patterns.some((s) => Qa(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Qa(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Jh = { 1: "refused", 2: "usage", 3: "fault" }, Zh = 100, Xh = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Qh({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: i, open: r, options: l = W({}), declared: u = [], readOnly: f = !1, shared: k = null }) {
  const T = /* @__PURE__ */ new Map(), R = new AbortController(), H = (b) => {
    const $ = T.get(b);
    if ($ && performance.now() - $.at < Zh) return $.answer;
    const A = Ut(e, b, t, R.signal);
    return T.set(b, { answer: A, at: performance.now() }), A;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: D(() => s()),
    permissions: a,
    readOnly: f,
    shared: k,
    read: H,
    run: (b) => Ut(e, b, t, R.signal),
    upload: (b) => tf(b, R.signal),
    cancel: () => R.abort(),
    follow: (b, $) => i.follow(e, b.filter((A) => o.some((j) => Qa(j, A))), $, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (b) => D(() => {
      var $;
      return l.value[b] ?? (($ = u.find((A) => A.key === b)) == null ? void 0 : $.default);
    }),
    setting: async (b, $) => {
      const A = await H(`window setting ${e} ${b}`);
      return A.ok ? A.value.value : $;
    },
    keep: (b, $) => Ut(e, ["window", "save-setting", e, b, JSON.stringify($)], t, R.signal)
  };
}
function ef(e) {
  try {
    const t = JSON.parse(e);
    return [t.refusal, t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const en = { ok: !1, failure: "cancelled", error: "" };
async function Ut(e, t, n, s = void 0) {
  try {
    const a = await Kh.add({ window: e, line: Array.isArray(t) ? t : nf(t), environment: n }, s);
    return s != null && s.aborted ? en : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Jh[a.code] || "fault", error: ef(a.error) };
  } catch (a) {
    return s != null && s.aborted ? en : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function tf(e, t = void 0) {
  try {
    const n = await Le.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? en : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? en : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function nf(e) {
  return [...e.matchAll(Xh)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function sf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const af = {
  class: "allowance-prompt",
  role: "dialog"
}, of = { class: "allowance-prompt-text" }, rf = { class: "allowance-prompt-buttons" }, lf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", af, [
      m("p", of, M(K(sf)(e.request)), 1),
      m("div", rf, [
        V(we, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            ve("Allow", -1)
          ])]),
          _: 1
        }),
        V(we, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            ve("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, cf = /* @__PURE__ */ Y(lf, [["__scopeId", "data-v-102dc765"]]), _n = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(Kt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: F(() => [
        ve(M(e.reason) + " ", 1),
        e.retry ? (c(), G(we, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            ve("Retry", -1)
          ])]),
          _: 1
        })) : P("", !0),
        e.removable ? (c(), G(we, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            ve("Remove tab", -1)
          ])]),
          _: 1
        })) : P("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, uf = ["data-window", "data-agent"], df = {
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
    readOnly: Boolean,
    shared: { type: Object, default: null }
  },
  emits: ["open", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(""), o = W(0);
    function i() {
      a.value = "", o.value++;
    }
    const r = Qh({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: D(() => n.options),
      declared: n.declared,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, k) => s("open", f, k)
    });
    jo(tt, r), xe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ee(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), No((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const l = () => es(n.component), u = () => {
      var f, k;
      return ((k = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : k.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, k) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      u() ? (c(), G(cf, {
        key: 0,
        request: u(),
        onAnswer: k[0] || (k[0] = (T) => e.prompts.answer(T))
      }, null, 8, ["request"])) : P("", !0),
      e.unavailableReason ? (c(), G(_n, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), G(_n, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: i
      }, null, 8, ["name", "reason"])) : e.component ? (c(), G(l, { key: o.value })) : (c(), G(_n, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: k[1] || (k[1] = (T) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, uf));
  }
}, eo = /* @__PURE__ */ Y(df, [["__scopeId", "data-v-590b4583"]]), hf = {
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
  setup(e) {
    const t = e, n = { render: () => es(Fh, { src: t.entry.entry_url }) };
    return (s, a) => (c(), G(eo, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: n,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || ""
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "events", "unavailable-reason"]));
  }
}, Kn = "journal.stale-build-reload", ff = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function pf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Kn) === e.message) return !1;
    t.setItem(Kn, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function gf(e = window.sessionStorage) {
  try {
    e.removeItem(Kn);
  } catch {
    return;
  }
}
const mf = ["data-window"], vf = {
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
  setup(e) {
    const t = e, n = rn(null), s = W("");
    return xe(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, gf();
          } catch (o) {
            if (ff(o) && pf(o)) return;
            s.value = `This window's file could not be loaded: ${o.message}`;
          }
      },
      { immediate: !0 }
    ), (a, o) => !n.value && !s.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      V(Et, { shape: "cards" })
    ], 8, mf)) : (c(), G(eo, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: n.value,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      events: e.entry.events,
      "unavailable-reason": e.entry.unavailable_reason || s.value
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "events", "unavailable-reason"]));
  }
}, yf = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new Yh(), s = ((r = ft(tt, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = D(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), i = D(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (l, u) => i.value ? (c(), G(vf, {
      key: 0,
      entry: o.value,
      subscriptions: K(n),
      environment: K(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(hf, {
      key: 1,
      entry: o.value,
      subscriptions: K(n),
      environment: K(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, wf = { class: "mark-more-inner" }, kf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, bf = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, xf = {
  key: 3,
  class: "mark-lines"
}, $f = "process", Gs = "task", Mf = 2e3, _f = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = ft(tt), s = D(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = D(() => Xa.has(t.mark.variant) && t.mark.detail || ""), o = D(() => t.mark.target_model === Gs ? t.mark.target_id : 0), i = W([]), r = W(!1), l = W(""), u = D(() => t.mark.target_model === $f && !!t.mark.target_id);
    async function f() {
      const R = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, l.value = R.ok ? "" : R.error, R.ok && (i.value = R.value.lines);
    }
    let k = null;
    const T = () => clearInterval(k);
    return xe(() => t.shown && u.value, (R) => {
      T(), R && (f(), t.mark.ended_at || (k = setInterval(f, Mf)));
    }, { immediate: !0 }), xe(() => t.mark.ended_at, (R) => R && t.shown && u.value && (T(), f())), Ee(T), (R, H) => (c(), h("div", {
      class: te(["mark-more", { open: e.shown }]),
      onClick: H[1] || (H[1] = Se(() => {
      }, ["stop"]))
    }, [
      m("div", wf, [
        e.declaration.body_url ? (c(), G(yf, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(Z, { key: 1 }, [
          a.value ? (c(), h(Z, { key: 0 }, [
            H[2] || (H[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", kf, M(a.value), 1)
          ], 64)) : P("", !0),
          u.value && l.value ? (c(), h("p", bf, M(l.value), 1)) : u.value && r.value ? (c(), h(Z, { key: 2 }, [
            H[3] || (H[3] = m("p", { class: "mark-label" }, "Output", -1)),
            V(Dh, {
              class: "mark-terminal",
              lines: i.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", xf, M(s.value.join(`
`)), 1)) : P("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: H[0] || (H[0] = Se((b) => K(pt)(`${Gs}:${o.value}`), ["stop"]))
          }, "Open task " + M(o.value) + " and its proofs", 1)) : P("", !0)
        ], 64))
      ])
    ], 2));
  }
}, to = /* @__PURE__ */ Y(_f, [["__scopeId", "data-v-51f69bf1"]]), Sf = (e) => `show-${e}`, zg = (e, t, n) => e.filter((s) => {
  var a;
  return n(Sf((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Ef = "messages.chat", Af = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), Yn = (e, t, n) => Ut(Ef, Af(e, t), n), Of = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Cf = ["title", "aria-label", "onClick"], Tf = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Bf = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = D(() => Of(t.buttons, t.allowedRuns)), s = W(""), a = ft(tt);
    async function o(i) {
      const r = await Yn(i, t.mark, a.environment);
      s.value = r.ok ? "" : r.error;
    }
    return (i, r) => (c(), h(Z, null, [
      (c(!0), h(Z, null, ie(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: Se((u) => o(l), ["stop"])
      }, [
        V(_t, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Cf))), 128)),
      s.value ? (c(), h("span", Tf, M(s.value), 1)) : P("", !0)
    ], 64));
  }
}, Rf = /* @__PURE__ */ Y(Bf, [["__scopeId", "data-v-00ea6707"]]);
function no(e, t) {
  const n = rn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((i) => [i.type, i])), a = async () => {
    try {
      return (await (await Le.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const so = no("/api/marks", "marks"), Vg = so.fetchAll, Lf = so.find, Df = ["data-ref"], If = { class: "mark-row" }, jf = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = e, s = D(() => Lf(n.mark.type)), a = D(() => Ah(n.mark, s.value)), o = D(() => {
      var r;
      return !!(n.mark.lines || n.mark.detail && Xa.has(n.mark.variant) || t.has(n.mark.target_model) || (r = s.value) != null && r.body_url);
    }), i = W(!1);
    return (r, l) => {
      var u, f;
      return c(), h("div", {
        class: te(["thread-turn", "card", { "full-width": (u = s.value) == null ? void 0 : u.full_width }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", If, [
          V($h, dt({
            mark: a.value,
            open: o.value ? i.value : void 0
          }, Po(a.value.handlers), {
            onClick: l[0] || (l[0] = (k) => i.value = !i.value)
          }), qo({ _: 2 }, [
            o.value ? {
              name: "default",
              fn: F(({ shown: k }) => [
                V(to, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: k
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          V(Rf, {
            buttons: (f = s.value) == null ? void 0 : f.buttons,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Df);
    };
  }
}, Gg = /* @__PURE__ */ Y(jf, [["__scopeId", "data-v-a8e93858"]]);
function Nf(e) {
  const t = W(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return je(() => n.observe(e.value)), ss(() => n.disconnect()), t;
}
const Pf = { class: "chat-dock-fold" }, qf = ["aria-label"], Wf = { class: "chat-dock-head" }, Hf = { class: "chat-dock-inner" }, Ff = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = W(null), s = W(null), a = Nf(s);
    return t({ card: n }), (o, i) => (c(), h("div", {
      class: te(["chat-dock", { lifted: e.lifted }])
    }, [
      m("div", Pf, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: te(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          be(o.$slots, "edge"),
          m("header", Wf, [
            be(o.$slots, "head")
          ]),
          m("div", {
            class: te(["chat-dock-body", { folded: e.folded }])
          }, [
            m("div", Hf, [
              m("div", {
                class: "chat-dock-grow",
                style: $e(K(a) === null ? null : { height: `${K(a)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  be(o.$slots, "default")
                ], 512)
              ], 4)
            ])
          ], 2)
        ], 10, qf)
      ])
    ], 2));
  }
}, Uf = /* @__PURE__ */ Y(Ff, [["__scopeId", "data-v-e27493a6"]]), zf = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Sn = 5, Vf = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Sn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Sn}s`, animationDelay: `${(n - Sn).toFixed(2)}s` };
    return (a, o) => (c(), h("span", zf, [
      m("i", { style: s })
    ]));
  }
}, Gf = /* @__PURE__ */ Y(Vf, [["__scopeId", "data-v-d0c4b012"]]), ao = no("/api/docks", "docks"), Kg = ao.fetchAll, Jn = ao.find, Kf = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ks = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function Yf(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [Ks("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...(n = t == null ? void 0 : t.reads) != null && n.length || hn(e.target_model) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    Ks("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const Jf = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Kf(e, t),
  buttons: Yf(e, t)
}), Zf = { class: "dock-title" }, Xf = ["aria-expanded", "title"], Qf = { class: "chat-dock-acts dock-acts" }, e1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, t1 = {
  key: 1,
  class: "dock-text"
}, n1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = D(() => Jn(s.item.type)), o = W(null), i = D(() => Jf(s.item, a.value)), r = ft(tt), l = W(/* @__PURE__ */ new Set()), u = W("");
    async function f(R) {
      if (R.action === "open") return pt(`${s.item.target_model}:${s.item.target_id}`);
      if (R.action !== "declared") return Yn(R, s.item, r.environment);
      l.value = /* @__PURE__ */ new Set([...l.value, R.label]), u.value = "";
      const H = await Yn(R, s.item, r.environment);
      (H == null ? void 0 : H.ok) === !1 && (l.value = new Set([...l.value].filter((b) => b !== R.label)), u.value = H.error);
    }
    const k = D(() => i.value.buttons.filter((R) => R.action !== "undock" && !l.value.has(R.label))), T = D(() => i.value.buttons.find((R) => R.action === "undock"));
    return (R, H) => (c(), G(Uf, {
      label: i.value.title,
      folded: e.folded
    }, {
      edge: F(() => [
        e.leaving ? (c(), G(Gf, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : P("", !0)
      ]),
      head: F(() => {
        var b, $, A;
        return [
          (b = a.value) != null && b.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(Z, { key: 1 }, [
            V(Ie, {
              name: i.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            m("span", Zf, M(i.value.title), 1)
          ], 64)),
          ($ = a.value) != null && $.badge ? (c(), h("span", {
            key: 2,
            class: te(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, M(a.value.badge), 3)) : P("", !0),
          (A = a.value) != null && A.draws_head ? P("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: H[0] || (H[0] = (j) => n("fold"))
          }, [
            V(Ja, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, Xf)),
          m("span", Qf, [
            (c(!0), h(Z, null, ie(k.value, (j) => (c(), G(we, {
              key: j.action + j.runs,
              small: "",
              bordered: "",
              "data-dock-action": j.action,
              onClick: (Q) => f(j)
            }, {
              default: F(() => [
                ve(M(j.label), 1)
              ]),
              _: 2
            }, 1032, ["data-dock-action", "onClick"]))), 128))
          ]),
          V(wa, {
            title: T.value.label,
            "data-dock-action": "undock",
            onClick: H[1] || (H[1] = (j) => f(T.value))
          }, null, 8, ["title"])
        ];
      }),
      default: F(() => {
        var b, $;
        return [
          u.value ? (c(), h("p", e1, M(u.value), 1)) : P("", !0),
          e.item.text && !((b = a.value) != null && b.body_url) ? (c(), h("p", t1, M(e.item.text), 1)) : P("", !0),
          ($ = a.value) != null && $.body_url ? (c(), G(to, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : P("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded"]));
  }
}, Ys = /* @__PURE__ */ Y(n1, [["__scopeId", "data-v-c8275435"]]), s1 = 24, a1 = 8, Yg = 420;
function Jg({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= s1 && e > t ? !0 : e < t && a > a1 ? !1 : null;
}
const o1 = (e, t) => e === void 0 ? t : e, r1 = 6, i1 = 3, Js = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, oo = (e) => !!(e.leaves_at && !e.kept), l1 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!oo(e) || t < e.leaves_at || n.has(e.id)), c1 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => l1(s, t, n)).sort((s, a) => s.id - a.id);
function u1(e, t, n = r1) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const d1 = (e, t) => e >= i1 ? !0 : e <= 1 ? !1 : t, h1 = { class: "dock-stack" }, f1 = ["onMouseenter", "onMouseleave"], p1 = ["onMouseenter", "onMouseleave"], g1 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = W(Date.now() / 1e3), s = W(/* @__PURE__ */ new Set()), a = W(!1), o = W(!1), i = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ee(() => clearInterval(i));
    const r = D(() => c1(t.items, n.value, s.value)), l = D(() => u1(r.value.filter(($) => Js($, Jn)), n.value)), u = D(() => r.value.filter(($) => !l.value.includes($) && !Js($, Jn))), f = D(() => (a.value = d1(l.value.length, a.value)) && !o.value), k = W({}), T = ($) => o1(k.value[$.id], t.folded);
    function R($) {
      k.value = { ...k.value, [$.id]: !T($) };
    }
    function H($) {
      s.value = /* @__PURE__ */ new Set([...s.value, $.id]);
    }
    function b($) {
      s.value = new Set([...s.value].filter((A) => A !== $.id));
    }
    return ($, A) => (c(), h("div", h1, [
      (c(!0), h(Z, null, ie(u.value, (j) => (c(), h("div", {
        key: j.id,
        onMouseenter: (Q) => H(j),
        onMouseleave: (Q) => b(j)
      }, [
        V(Ys, {
          item: j,
          leaving: K(oo)(j) && !s.value.has(j.id),
          folded: T(j),
          onFold: (Q) => R(j)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, f1))), 128)),
      (c(!0), h(Z, null, ie(f.value ? [] : l.value, (j) => (c(), h("div", {
        key: j.id,
        onMouseenter: (Q) => H(j),
        onMouseleave: (Q) => b(j)
      }, [
        V(Ys, {
          item: j,
          folded: T(j),
          onFold: (Q) => R(j)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, p1))), 128)),
      f.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "dock-runs-row",
        title: "Show each run as its own card",
        onClick: A[0] || (A[0] = (j) => o.value = !0)
      }, M(l.value.length) + " runs", 1)) : P("", !0)
    ]));
  }
}, Zg = /* @__PURE__ */ Y(g1, [["__scopeId", "data-v-8ad7aad9"]]), bt = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, zt = (e) => Math.min(Math.max(e, 0), 1), m1 = (e) => {
  const t = zt(e);
  return t * t * (3 - 2 * t);
}, Ze = (e, t, n) => m1((e - t) / (n - t));
function Xg(e) {
  const t = zt(e), n = zt((t - 0.12) / 0.76) * bt.shuffles, s = Math.min(Math.floor(n), bt.shuffles - 1), a = n - s, o = Ze(a, 0.26, 0.38) * (1 - Ze(a, 0.76, 0.96)), i = Ze(a, 0.38, 0.76), r = Ze(t, 0, 0.12) * (1 - Ze(t, 0.88, 1)), l = Ze(a, 0.2, 0.34) * (1 - Ze(a, 0.84, 1)), u = Math.sin(Math.PI * zt((a - 0.45) / 0.55)) ** 2;
  return { moved: i, across: (s + i) / bt.shuffles, lift: bt.lift * o, ready: r, weight: l, follow: u, shuffle: s, phase: a };
}
const ro = 2400, v1 = 0.05;
function Qg({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, v1), i = Math.min(t + ro * o, a), r = e + i * o;
  return r < n ? { y: r, speed: i, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
const Ke = {
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
  phone_call: { frames: 108, fps: 12, poof: [0, 0.06], above: 0.7, drop: [0.015, 0.055], settle: [0.055, 0.12], squash: 0.24, wobbles: 3, reach: [0.13, 0.2], lift: [0.2, 0.28], finger: [0.28, 0.33], dial: [0.33, 0.42], turn: 250, back: [0.42, 0.5], release: 0.25, talk: [0.5, 0.72], nods: 3, hang: [0.72, 0.84], goes: [0.92, 1], seated: { beside: 1.2, behind: 0.95, turn: 45, lean: 20 } },
  // a question asked: it raises a sign with a question mark on a stick over its head and waggles it
  ask_sign: { frames: 42, fps: 12, raise: [0, 0.22], waggle: [0.22, 0.78], waggles: 3, lower: [0.78, 1] },
  // a report: it brings the rolled scroll up before its chest over `raise`, a roller in each hand, the free hand's on top; pulls the
  // rollers apart over `unrolls`, the written side toward itself and the parchment's plain back to the viewer (figure.js SCROLL); reads
  // it `lines` lines down, its head going slowly along each; rolls it closed between its hands over `rolls` and lowers it over `lower`
  scroll: { frames: 96, fps: 12, raise: [0, 0.09], unrolls: [0.09, 0.22], rolls: [0.85, 0.93], lower: [0.93, 1], lines: 3 },
  // a task finished, a job well done: standing, it brings its hands together before its chest over `together`, rubs them round each
  // other `rubs` times, slowly, a stroke and a half a second at most, nodding a little with each, and lowers them over `apart`; `puffs`
  // small puffs rise from the hands once each over `puff`, with `sparkles` sparkles among them (chat/act/HandRub.vue)
  hand_rub: { frames: 48, fps: 12, together: [0, 0.12], rubs: 2, apart: [0.88, 1] },
  // stopping to think at the laptop (figure.js type_ponder), under the thought cloud, its dots pulsing three times a loop
  type_ponder: { frames: 24, fps: 6 },
  // The thinking act, now and then while the agent thinks (figure.js thinkingClip, reactions.js thinkingAct), in its three plays. With
  // the cloud: it raises its finger to its cheek over `into`, tilting its head up, swaying `sways` times; three puffs rise from its head
  // over `puffs` into a small thought cloud over it, held over `cloud`, its three dots pulsing one after another, `pulse` seconds round
  // (chat/FigureAct.vue), and over `rise` its hand comes away. With the bulb: over `rise` the finger comes up, "got it", the light bulb
  // over the head (figure.js LIGHT_BULB) appears over `appears`, switches on over `lights`, glows, goes out over `fades` and is gone over
  // `goes`. "ponder" has both, the bulb at its end; "think_cloud" the cloud alone, its hand going down; "got_it" the bulb alone.
  ponder: { frames: 84, fps: 12, into: [0, 0.1], cloud: [0.06, 0.72], sways: 2, rise: [0.72, 0.8], appears: [0.75, 0.78], lights: [0.79, 0.82], fades: [0.9, 0.96], goes: [0.95, 1] },
  think_cloud: { frames: 66, fps: 12, into: [0, 0.12], cloud: [0.07, 0.86], sways: 2, rise: [0.86, 1] },
  got_it: { frames: 30, fps: 12, rise: [0, 0.25], appears: [0.05, 0.15], lights: [0.18, 0.26], fades: [0.72, 0.88], goes: [0.86, 1] },
  // a fact or a reminder: a small cabinet grows beside it, its drawer slides out, it files a card in it and the drawer shuts
  file_card: { frames: 42, fps: 12, reach: [0.2, 0.44], filed: [0.44, 0.56], back: [0.56, 0.72] },
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
  fume: { frames: 54, fps: 12, crushed: [0, 0.36], mad: [0.36, 0.96], stamps: 6 },
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
  pogo: { frames: 54, fps: 12, draw: [0, 0.18], bounces: [0.18, 0.62], count: 3, bounce: 0.45, spring: [0.62, 0.82], over: 0.3, release: [0.82, 0.86], handles: 0.2455 },
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
    aim: [0.25, 0.32],
    shots: [0.33, 0.48],
    count: 2,
    splat: 0.48,
    fly: [0.56, 0.64],
    drops: [0.64, 1],
    back: { stride: 0.5 }
  },
  // a fixed run's bug smashed with a big wooden mallet on the floor the figure stands on (smashPlan): the bug climbs up the back of the
  // floor's box, out of sight behind it, over `emerge`, comes over its top edge onto it over `climb`, and it and the figure walk to meet
  // each other over `walk`, until it is `away` of the picture out on the figure's left (`side`); the figure raises the mallet high before
  // its head over `raise` and holds it there for the wind-up until `swing`, swings it down over `swing` and flattens the bug at `blow`,
  // which lies flat and fades over `gone`, and lowers the mallet over `lower`
  bug_smash: {
    frames: 96,
    fps: 12,
    walk: [0.16, 0.38],
    raise: [0.46, 0.58],
    swing: [0.66, 0.72],
    blow: 0.72,
    gone: [0.84, 0.95],
    lower: [0.88, 0.95]
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
  disco: { frames: 96, fps: 12, beats: 8 },
  // leaning against a wall to rest (perches.js leanSpot): the wall `wall` of the picture out from its middle, the hand flat against it
  // `contact` of the figure's units above its feet; the whole body tilted `tilt` degrees toward it from the feet, its weight on that hand;
  // the other hand on its hip at `hip` (across, forward, up); the ankles crossed, the inner leg turned in `inner` degrees and the outer
  // `outer`, swung `over` degrees before the inner so its foot crosses over in front
  lean: { wall: 0.33, contact: 1.95, tilt: 16, hip: [0.62, 0.05, 1.5], inner: 20, outer: 42 },
  // coming down on a parachute, swaying `sway` degrees under it, its canopy (figure.js canopyOf) `width` of the picture across with its
  // rim `above` of the picture over the eyes, the lines running from the rim down to the hands
  chute: { frames: 24, fps: 8, width: 0.66 },
  // compacting: a box appears, it hops into it and the box shrinks with it inside; once the compaction is over the box grows back and
  // pops in a puff, and it jumps out. Its frames are an intro, a held stretch looped while the compaction lasts, and an outro
  pack_box: { intro: 36, hold: 24, outro: 26, fps: 12, hop: [0.3, 0.62], into: [0.55, 0.88], pops: 0.38, leap: [0.38, 0.88] },
  // compacting: a press comes down onto its head, it holds it up with both hands and is squashed under it, and springs back once it lifts
  press: { intro: 24, hold: 24, outro: 24, fps: 12, squashes: [0.5, 1], frees: [0, 0.3] },
  // compacting: it vacuums up the words flying in from beside it, the canister on the floor and the nozzle in its hand
  vacuum: { intro: 10, hold: 40, outro: 10, fps: 10 }
}, Zn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), y1 = (e) => e * e * (3 - 2 * e), tn = (e, [t, n]) => y1(Zn(e, t, n)), w1 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ve = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Pt = ([e, t], n) => e + n() * (t - e);
function k1(e) {
  return w1.map(() => {
    const t = Pt(Ve.speed, e), n = Pt(Ve.angle, e) * Math.PI / 180, s = Pt(Ve.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Pt(Ve.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const b1 = k1(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function x1(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ve.gravity * (t[2] - Ve.floor))) / Ve.gravity;
}
function em(e, t, n = b1) {
  const s = Ke.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], i = x1(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= i + r) return null;
  const l = Math.min(a, i), u = s.from.map((f, k) => f + o.velocity[k] * l);
  return u[2] -= Ve.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - i) / r };
}
function tm(e, t) {
  const n = e.map((o) => Math.sqrt(o)), s = n.reduce((o, i) => o + i, 0);
  let a = Math.min(Math.max(t, 0), 1) * s;
  for (const [o, i] of n.entries()) {
    if (a <= i || o === n.length - 1) {
      const r = i > 0 ? Math.min(a / i, 1) : 1;
      return { index: o, s: r, height: e[o] * 4 * r * (1 - r) };
    }
    a -= i;
  }
  return { index: 0, s: 1, height: 0 };
}
const nm = () => Array.from({ length: Ke.pogo.count }, (e, t) => Ke.pogo.bounce * (t + 1) / Ke.pogo.count), sm = { stride: 0.5 };
function io(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: Zn(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: Zn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function am(e) {
  const { into: t, out: n } = io(Ke.rope_swing, e);
  return 1 - tn(t, [0, 1]) * (1 - tn(n, [0, 1]));
}
function om(e) {
  const t = Ke.rope_swing, { into: n, out: s } = io(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return tn(n, [0, 1]) * (1 - tn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const $1 = { after: 3 }, M1 = 10, _1 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, S1 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, E1 = { weight: 19 }, A1 = {
  build: { cooldown: 180 }
}, O1 = { every: 120 }, lo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, co = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, C1 = {
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
}, Tt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: M1 }), J = (e, t, n = {}) => Tt(e, "clip", t, n), En = (e, t, n = {}) => Tt(e, "look", t, n), Zs = (e, t, n = {}) => Tt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Tt(e, "pick", t, n), ...s }), fe = (e) => Tt("nothing", "nothing", e, {}), T1 = 120, B1 = 300, An = (e, t) => ({ ...J(e, t), cooldown: B1 }), R1 = 120, X = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), L1 = () => [J("joy", 2)], Xe = (e, t, n, s, a = {}) => ({ ...J(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), Qe = (e) => ({ ...e, cooldown: _1[e.name] }), kt = (e) => ({ ...e, shenanigan: !0, lasts: S1[e.name] }), hs = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...X("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [J("nod", 2), fe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...X("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...Qe(J("bug_shot", 3)), toward: "", onto: !1 },
    { ...Qe(J("bug_smash", 2)), toward: "", onto: !1 },
    J("nod", 2)
  ]),
  ...X("tests_failed", { cooldown: 20, toward: "card" }, [J("startled", 2), J("dismay", 1), J("tantrum", 3), fe(1)]),
  ...X("committed", { cooldown: 30, toward: "card", onto: !0 }, [J("nod", 2), fe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...X("sin_fixed", { cooldown: 300 }, [J("halo", 1), fe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...X("sin_committed", { cooldown: 300 }, [J("repent", 1), fe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...X("messaged", { cooldown: R1 }, [J("phone_call", 1)]),
  ...X("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [J("nod", 4), J("hand_rub", 4), fe(7)]),
  ...X("question_asked", { cooldown: 60 }, [J("ask_sign", 9), J("look_up", 3), fe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...X("reported", { cooldown: 90 }, [Zs("read", 3), J("nod", 1), fe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...X("read_message", { cooldown: 30 }, [Zs("read", 3), fe(1)]),
  ...X("fact_filed", { cooldown: 120 }, [J("file_card", 3), J("nod", 1), fe(6)]),
  ...X("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [J("nod", 2), fe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...X("bar_done", { holds: !0 }, L1()),
  ...X("bar_failed", { holds: !0 }, [J("fume", 1), J("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...X("standing", { cooldown: 12 }, [J("look_left", 2), J("look_right", 2), J("look_up", 1), fe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...X("launched", { cooldown: 300 }, [J("tumble", 3), fe(47)]),
  // a break from the hammering now and then
  ...X("building", { cooldown: 30 }, [J("wipe_brow", 4), J("look_left", 1), J("look_right", 1), fe(69)]),
  ...X("failed", { cooldown: 20, toward: "card" }, [J("shake", 3), J("tantrum", 2), fe(2)]),
  ...X("refused", { cooldown: 20 }, [J("shake", 1), fe(1)]),
  ...X("work_done", { cooldown: 120 }, [J("stretch", 2), fe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...X("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...X("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...X("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...X("answered", { cooldown: 15 }, [En("amused", 3), fe(2)]),
  ...X("heard", { cooldown: 30 }, [
    J("bow", 1, { voices: ["butler"] }),
    J("salute", 1, { voices: ["squire"] }),
    J("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    fe(1)
  ]),
  ...X("long_walk", { cooldown: 90 }, [J("stumble", 3), fe(22)]),
  ...X("card_arrived", { cooldown: 20, toward: "card" }, [J("glance", 7), fe(13)]),
  ...X("typing", { cooldown: 60 }, [En("reading", 1), fe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(C1).flatMap(([e, t]) => X(`reacted:${e}`, {}, [En(t, 1)])),
  ...Object.entries(lo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => X(`agent_reacted:${n}`, {}, [J(s, 1, { voices: [e] })])[0])),
  ...Object.entries(co).flatMap(([e, t]) => X(`agent_reacted:${e}`, {}, [J(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...X("pastime", {}, [
    Xe("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    Xe("rest", 3, 180, 120),
    Xe("yawn", 2, 60, 60),
    Xe("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    Xe("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    Xe("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    Xe("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...kt(Qe(J("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    kt(Qe(J("disco", 2, { ball: "bubble" }))),
    fe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...X("held:search", { cooldown: T1 }, [An("search", 3), { ...An("binoculars", 2), when: { home: !0 } }, { ...An("glass_bubble", 2), when: { bubble: !0 } }]),
  ...X("held:type", {}, [J("type", 3), J("type_ponder", 1)]),
  ...X("held:watch", {}, [J("watch", 2), J("wave_up", 1)]),
  ...X("held:compacting", {}, [J("pack_box", 3), J("vacuum", 2), J("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...X("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), fe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...X("tickled", {}, [{ ...Qe(J("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...X("eager", {}, [J("eager", 2, { slow: !0 }), fe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...X("jump", {}, [kt(Qe(J("backflip", 7, { high: !0 }))), J("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...X("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...X("unit", { cooldown: A1.build.cooldown }, [ce("unit", E1.weight), fe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...X("progress_jump", { cooldown: 6 }, [J("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...X("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...X("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...X("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: O1.every }, ce("stand", 5)]),
  // a digit a blow's dust lets out
  ...X("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...X("roam", {}, [
    ce("rest", 35, {}, { stay: [25, 60] }),
    ce("seat", 15, {}, { stay: [15, 40] }),
    ce("edge", 25, {}, { stay: [8, 20] }),
    kt(ce("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ce("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ce("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ce("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ce("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ce("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    kt(Qe(ce("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...X("laptop", {}, [ce("seat", 6, {}, { stay: [60, 150] }), ce("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...X("ledge_at", {}, [ce("middle", 2, {}, { along: 1 / 2 }), ce("third", 1, {}, { along: 1 / 3 }), ce("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...X("composed_as", {}, [
    ce("facing", 4, {}, { turn: 0, leans: 0 }),
    ce("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ce("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ce("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ce("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], D1 = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), uo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), I1 = (e) => Array.isArray(e) ? e[0] : e, j1 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function N1(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || uo(f).every(([k, T]) => n(k) >= I1(T)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = hs.filter((f) => D1(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= $1.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, l = r.filter((f) => {
    var k;
    return f.kind === "nothing" || f.name !== ((k = e.tally) == null ? void 0 : k.last);
  });
  return l.some((f) => f.kind !== "nothing") ? l : r;
}
function P1(e, t) {
  const n = N1(e);
  let s = t() * n.reduce((o, i) => o + i.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (ho(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function ho(e, t, n) {
  var s;
  for (const [a, o] of uo(t)) (s = e.memory) == null || s.set(a, e.now + j1(o, n));
}
function rm(e, t, n) {
  ho(e, hs.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const Xs = {
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
}, im = {
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
}, lm = 120, cm = (e) => Xs[e] || Xs.idle;
[.../* @__PURE__ */ new Set([...Object.values(lo).flatMap((e) => Object.keys(e)), ...Object.keys(co)])];
const Ce = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function um(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Ce.ahead * n ? 180 : Math.sign(s) * Ce.turn;
}
const Qs = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function dm(e, t) {
  const n = Math.min(Ce.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Ce.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Ce.lines, Math.floor((e.bottom - e.top - 2 * s) / Ce.line) + 1)), o = Math.max(t, 0), i = Math.floor(o / Ce.sweep) % a, r = o % Ce.sweep, l = Ce.sweep - Ce.returnSeconds, u = Qs((r - l) / Ce.returnSeconds), f = r <= l ? Qs(r / l) : 1 - u, k = i + ((i + 1) % a - i) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + k * Ce.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const q1 = 1, W1 = (e, t, n, s, a, o = 0) => P1({ moment: "jump", high: e > q1 * t, memory: s, now: a, room: o }, n).name === "backflip", ea = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, hm = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, fm = { width: 24, height: 27, top: 3, units: 2 }, H1 = "[data-figure-pile]", pm = { amber: [1, 0.69, 0.125], good: ea.colours.good, bad: ea.colours.bad }, On = { phases: 4, dim: 0.25 }, gm = (e, t, n) => e !== "amber" || (t + n) % On.phases < On.phases / 2 ? 1 : On.dim, F1 = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(hs.filter((e) => F1.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const mm = {
  width: 84,
  belly: 13,
  blink: 4
}, ta = "[data-figure-home]", Bt = () => {
  var t;
  const e = document.querySelector(ta);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ta)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, U1 = "[data-figure-docked-bars]", z1 = "[data-figure-chat-foot]", V1 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", G1 = "[data-figure-newest]";
function K1() {
  var s, a;
  const e = (s = Bt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(G1), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var i, r;
      return !((i = o.closest) != null && i.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !fs(o)) continue;
    const i = o.getBoundingClientRect();
    if (i.right > i.left && i.bottom > i.top) return i;
  }
  return null;
}
function fo(e, t, n = K1()) {
  if (!e || !n) return !0;
  const s = gt(e, t), a = ps(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ge.top * t.size, bottom: s.top + Ge.bottom * t.size }, i = bt.gap;
  return !mo(o, { left: n.left - i, right: n.right + i, top: n.top - i, bottom: n.bottom + i });
}
const Cn = 0.26, Y1 = 0.54, gn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Cn, travels: "stand" },
  lounge: { drop: Cn, travels: "stand" },
  composed: { drop: Cn, travels: "stand" },
  hang: { drop: Y1, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, po = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), J1 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), vm = (e, t) => (e === "sit" ? J1.has(t) : po.has(e)) ? e : "stand", ym = 0.25, wm = (e, t) => po.has(e) && gn[t].drop === 0, go = 2, Z1 = 90, X1 = 180, Q1 = 140, ep = 280, tp = 420, np = 0.25, sp = 290, ap = 600, op = "cubic-bezier(0.2, 0.7, 0.4, 1)", rp = "cubic-bezier(0.55, 0, 0.9, 0.6)", Tn = 5;
function nn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: i = !1, sprinting: r = !1, random: l = Math.random, memory: u = null, now: f = 0, room: k = 0, pogo: T = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Tn) return null;
  (i || r) && (o = Math.max(o, go));
  const R = o > 1, H = Math.abs(t.x - e.x), b = H < Tn ? 0 : H / (Z1 * o) * 1e3, $ = Math.min(b, R ? Q1 : X1), A = Math.abs(t.y - e.y), j = t.y < e.y, Q = j && !T && W1(A, n, l, u, f, k), q = j ? tp + Math.min(A, 400) * np : Math.sqrt(2 * A / ro) * 1e3, E = {
    x: t.x,
    y: t.y,
    ms: A > Tn ? Q ? ap : q : 0,
    lead: Q ? sp : j ? ep : 0,
    easing: j ? op : rp,
    hopping: !0,
    clip: Q ? "backflip" : j ? "jump" : "fall"
  }, _ = { x: t.x, y: t.y, ms: b + $, lead: 0, easing: "linear", ramp: $, ...R ? { clip: "run" } : {} }, p = T ? ip(t, n) : E, y = j && !s ? [{ ..._, y: e.y }, p] : [{ ...E, x: e.x }, _];
  return { way: Math.sign(t.x - e.x) || 1, legs: y, lands: !a, pace: o, running: R };
}
const ip = (e, t) => ({ x: e.x, y: e.y, ms: Ke.pogo.frames / Ke.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), gt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - gn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, mo = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, fs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function mt() {
  var t;
  const e = (t = Bt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const qt = 0.5, na = 20;
function km(e, t, n = mt()) {
  const s = gt(e, t);
  return s.left >= n.left + na && s.right <= n.right - na;
}
function vo(e, t, n = mt()) {
  const s = gt(e, t), a = s.right - s.left, o = ps(e), [i, r] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return i >= n.left - qt && r <= n.right + qt && s.top >= n.top - qt && l <= n.bottom + qt;
}
const sn = [0.35, 0.5, 0.65], an = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ge = { left: sn[0], right: sn.at(-1), top: an[0], bottom: an.at(-1) }, lp = 0.24;
function ps(e) {
  if (e.posture === "stand") return { left: Ge.left, right: Ge.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + lp * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ge.left, t), right: Math.max(Ge.right, t) };
}
function cp(e, { size: t }, n = mt()) {
  const s = ps(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const up = (Ge.right - Ge.left) / 2 + 0.08;
function dp(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !fs(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, i = Math.min(a.startOffset, o.length - 1);
  for (const l of [i - 1, i].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const hp = (e) => an.flatMap(
  (t) => sn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function fp(e, t, n = "") {
  if (!fo(e, t)) return sn.length * an.length;
  const s = gt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(V1)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: l }) => l.width && l.height && mo(a, l) && fs(r)).map(({ rect: r }) => r), i = (r, l) => o.some((u) => r >= u.left && r <= u.right && l >= u.top && l <= u.bottom);
  return hp(a).filter(([r, l]) => i(r, l) || dp(r, l, n)).length;
}
function pp(e, t, n) {
  const s = mt(), a = (i) => n ? Math.hypot(i.x - n.x, i.y - n.y) : 0, o = e.filter((i) => vo(i, t, s) && fo(i, t)).map((i) => ({ spot: i, covered: fp(i, t), away: a(i) }));
  return o.length ? o.reduce(
    (i, r) => r.covered < i.covered || r.covered === i.covered && r.away < i.away ? r : i
  ).spot : null;
}
const yo = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, gp = up, mp = (e, t, { size: n }, s = gp) => vp(e, yo[t], s * n, "stand");
function vp(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const bm = (e) => ((e + 180) % 360 + 360) % 360 - 180, xm = { turns: [-20, -10, 0, 10, 20] }, yp = 7;
function wp() {
  const e = [...document.querySelectorAll(H1)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const kp = 4;
function bp() {
  const e = wo(), t = wp(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > kp || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - yp - n, 0) } };
}
const $m = ({ size: e, below: t }) => (1 - t) * e;
function xp(e, t) {
  const n = mt(), { size: s, below: a } = t, o = gn[e.posture].drop * s;
  return { ...cp(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const $p = (e, t) => Object.keys(yo).map((n) => xp(mp(e, n, t), t)), Mp = (e, t, n) => pp(e, t, n) ?? e[0];
function Mm(e, t) {
  const { element: n, edge: s } = bp();
  return { ...Mp($p(s, e), e, t), view: null, on: n };
}
function wo() {
  var s;
  const e = Bt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(U1);
  if (!t) return { ...ko(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function ko() {
  const e = Bt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const _p = { climb: 90 };
function _m(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: i = !1, random: r = Math.random, via: l = [], memory: u = null, now: f = 0, room: k = 0, pogo: T = !1 } = {}) {
  (o || i) && (a = Math.max(a, go));
  const R = (Q) => {
    const q = gt(Q, n, gn[Q.posture].travels);
    return { x: q.left, y: q.top };
  }, H = t.ladder ?? e.ladder;
  if (H && !(t.ladder && e.ladder)) return Sp(R(e), R(t), R({ ...H.foot, posture: "stand" }), H.way, !!t.ladder, n, a);
  const [b, ...$] = [e, ...l, t].map(R), A = nn(b, $[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: i, random: r, memory: u, now: f, room: k, pogo: T }), j = $.slice(1).map((Q, q) => {
    var E;
    return (E = nn($[q], Q, n.size, { random: r, memory: u, now: f, room: k })) == null ? void 0 : E.legs.find((_) => _.hopping);
  });
  return A && { ...A, legs: [...A.legs, ...j.filter(Boolean)] };
}
function Sp(e, t, n, s, a, o, i) {
  const r = (f, k) => ({ x: k.x, y: k.y, ms: Math.hypot(k.x - f.x, k.y - f.y) / _p.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? nn(e, n, o.size, { pace: i }) : nn(n, t, o.size, { pace: i }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], r(n, t)] : [r(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: i, running: i > 1 };
}
const Ep = "[data-figure-bubble]", Ap = 250;
let xt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), bo = 0;
const xo = () => xt, Bn = /* @__PURE__ */ new WeakMap();
let Op = 0;
function $o(e) {
  return Bn.has(e) || Bn.set(e, `floor-${++Op}`), Bn.get(e);
}
const Cp = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Tp = () => {
  var e, t;
  return ((t = (e = Bt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Bp(e, t) {
  var s;
  const n = (s = e.querySelector(z1)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Rp(e, t) {
  const n = e && Bp(e, t), s = e ? [...e.querySelectorAll(Ep)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: i }) => ({ element: o, kind: i, box: o.getBoundingClientRect() })).filter(({ kind: o, box: i }) => i.width > 0 && i.height > 0 && (o !== "bubble" || Cp(i, n))).map(({ element: o, kind: i, box: r }) => ({ id: $o(o), kind: i, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Lp = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Ap ? (t.top - s.top) / a * 1e3 : 0;
};
function Dp(e = xt, t = performance.now()) {
  const n = mt(), s = Tp(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: i, edge: r } = wo(), l = [];
  o && l.push({ id: "home", kind: i ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = ko();
  return u.element && l.push({ id: $o(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Rp(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((f) => Object.freeze({ ...f, vy: Lp(e, f, t) }))) });
}
const Xn = /* @__PURE__ */ new Set();
function Ip(e) {
  return Xn.add(e), () => Xn.delete(e);
}
function jp() {
  Mo();
  const e = () => {
    bo = requestAnimationFrame(e), !document.hidden && (xt = Dp(xt), Xn.forEach((t) => t(xt)));
  };
  e();
}
function Mo() {
  cancelAnimationFrame(bo);
}
const Np = (e, t) => e.find((n) => n.id === t) ?? null;
function Sm(e, t, n = xo().floors) {
  const s = Np(n, "home");
  return e.posture === "hang" && s && gt(e, t).bottom >= s.top ? !1 : vo(e, t);
}
const Pp = ["data-kind"], qp = { class: "figure-floor-name" }, Wp = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", qp, M(e.floor.kind), 1)
    ], 12, Pp));
  }
}, Hp = /* @__PURE__ */ Y(Wp, [["__scopeId", "data-v-8f6132da"]]), Fp = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Up = {
  __name: "FigureFloors",
  setup(e) {
    const t = rn(xo().floors);
    let n = () => {
    };
    return je(() => {
      n = Ip((s) => t.value = s.floors), jp();
    }), Ee(() => {
      n(), Mo();
    }), (s, a) => (c(), h("div", Fp, [
      (c(!0), h(Z, null, ie(t.value, (o) => (c(), G(Hp, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Em = /* @__PURE__ */ Y(Up, [["__scopeId", "data-v-e519168b"]]), Rn = (e) => typeof e == "number" ? e : Date.parse(e);
function Am(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Rn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Rn(a.row.created_at) - Rn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const zp = 2e3;
function Om(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, zp);
  };
  je(async () => {
    await e(), s();
  }), ss(() => clearTimeout(n));
}
const sa = "newest";
function Cm(e, { title: t, isOpen: n = null }) {
  const s = W(""), a = W(sa), o = W("all"), i = D(() => {
    const r = s.value.trim().toLowerCase(), l = e.value.filter((u) => (!r || JSON.stringify(u).toLowerCase().includes(r)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === sa ? l : [...l].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: i, hasStates: !!n };
}
const Vp = {
  class: "list-tools",
  "data-list-tools": ""
}, Gp = {
  __name: "ListTools",
  props: { tools: { type: Object, required: !0 }, placeholder: { type: String, default: "Search" } },
  setup(e) {
    const t = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], n = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ];
    return (s, a) => (c(), h("div", Vp, [
      V(Vd, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      V(Gn, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (c(), G(Gn, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : P("", !0)
    ]));
  }
}, Tm = /* @__PURE__ */ Y(Gp, [["__scopeId", "data-v-b2dd0a0d"]]);
function Bm() {
  const e = W(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Kp = 86400, Qn = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Yp(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((Qn(t) - Qn(e)) / Kp);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function Rm(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = Qn(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Yp(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Ln = 280, Dn = 240, In = 120, Jp = 6, Zp = 14, St = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Xp(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const i = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Zp}px)` }), e.offsetHeight, e.style.transition = `height ${Ln}ms ${St}`, e.style.height = `${i}px`;
  const r = a();
  let l = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - r;
    if (!l && f >= Ln && (l = !0, e.style.transition = `opacity ${Dn}ms ease-out, transform ${Dn}ms ${St}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Ln + Dn) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function Lm(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Jp}px)` }), e.offsetHeight, e.style.transition = `opacity ${In}ms ease-out, transform ${In}ms ${St}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const i = a(), r = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - i < In) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const Qp = 140, Wt = 220, e0 = 5;
function Dm({ gap: e = Qp, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, e0);
    if (s = r.length > 0, !s) return;
    let l = r.length;
    for (const u of r)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), l -= 1, l || t(o, e);
      });
  }
  const i = (r, l, u, f = Xp) => {
    if (!l.pane || !l.follows()) return u();
    const k = { el: r, options: l, done: u, arrival: f, display: r.style.display || "" };
    if (!s)
      return s = !0, f(r, l, () => a(k));
    r.style.display = "none", n.push(k);
  };
  return i.flush = () => {
    for (const r of n.splice(0))
      r.el.style.display = r.display, r.done();
  }, i;
}
function Im(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Wt}ms ${St}, opacity ${Wt}ms ease-in, margin ${Wt}ms ${St}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Wt);
}
const _o = "chat.pins.minimised", Vt = W($t(_o, !1));
function aa(e) {
  Vt.value = e, ln(_o, e);
}
function t0(e) {
  const t = D(() => e()), n = D(() => Vt.value ? [] : e()), s = () => aa(!Vt.value), a = Date.now() / 1e3;
  return xe(
    () => t.value.filter((o) => xa(o) > a).length,
    (o, i) => o > i && aa(!1)
  ), { pins: t, visible: n, minimised: Vt, toggle: s };
}
const n0 = ["title"], s0 = {
  key: 0,
  class: "pins-count"
}, a0 = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = t0(() => t.notices);
    return (o, i) => K(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: te(["pins-toggle", { minimised: K(s), inline: e.inline }]),
      title: K(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: i[0] || (i[0] = Se((...r) => K(a) && K(a)(...r), ["stop"]))
    }, [
      V(Ie, {
        name: K(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      K(s) ? (c(), h("span", s0, M(K(n).length), 1)) : P("", !0)
    ], 10, n0)) : P("", !0);
  }
}, jm = /* @__PURE__ */ Y(a0, [["__scopeId", "data-v-c0d11526"]]), o0 = ["title"], r0 = ["title"], i0 = { class: "diff-card-dir" }, l0 = { class: "diff-card-name" }, c0 = { class: "diff-card-ago" }, u0 = ["title"], d0 = ["title"], h0 = {
  key: 0,
  class: "diff-card-note"
}, f0 = ["href"], p0 = ["src", "alt"], g0 = { class: "diff-card-rows" }, m0 = { class: "diff-row-num" }, v0 = { class: "diff-row-sign" }, y0 = { class: "diff-row-code" }, w0 = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    kind: { type: String, required: !0 },
    added: { type: Number, required: !0 },
    removed: { type: Number, required: !0 },
    ago: { type: String, required: !0 },
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
    function o(v) {
      (v.metaKey || v.ctrlKey) && (v.stopPropagation(), s("open", n.path));
    }
    const i = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, l = D(() => n.path.lastIndexOf("/") + 1), u = D(() => n.path.slice(0, l.value)), f = D(() => n.path.slice(l.value)), k = D(() => n.kind === "deleted"), T = D(() => i[n.kind]), R = D(() => new Set(n.rows.filter((v) => v.line_type === "add").map((v) => v.line))), H = W("after"), b = D(() => H.value === "before" ? n.whole.old : n.whole.text), $ = D(() => n.whole && n.whole.text !== void 0 ? b.value.split(`
`).map((v, g) => ({ line_type: H.value === "after" && R.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: v })) : n.rows.filter(
      (v) => !(n.editsOnly && ["ctx", "fold"].includes(v.line_type)) && !(n.hideRemovals && v.line_type === "del")
    )), A = W(!1), j = D(() => n.lines && !A.value && !n.whole), Q = D(() => j.value ? $.value.slice(0, n.lines) : $.value), q = D(() => $.value.length - Q.value.length), E = (v) => v.line === null || v.line_type === "del" ? "" : v.line, _ = (v) => v.line_type === "fold" ? v.hidden ? `⋯ ${v.hidden} lines` : "⋯" : v.text, p = W(null), y = W(null);
    let w = null;
    return je(() => {
      if (!y.value) return;
      let v = !0;
      w = new ResizeObserver(() => {
        !p.value || !y.value || (p.value.style.transition = v ? "none" : "", p.value.style.height = `${y.value.offsetHeight}px`, v = !1);
      }), w.observe(y.value);
    }), Ee(() => w && w.disconnect()), (v, g) => (c(), h("section", {
      class: te(["diff-card", { half: e.half, gone: k.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: k.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: g[2] || (g[2] = (d) => !k.value && s("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${K(a)}-click to open it`,
          onClick: o
        }, [
          m("span", i0, M(u.value), 1),
          m("span", l0, M(f.value), 1),
          T.value ? (c(), h("span", {
            key: 0,
            class: te(["diff-card-badge", e.kind])
          }, M(T.value), 3)) : P("", !0)
        ], 8, r0),
        m("span", {
          class: te(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + M(e.added), 3),
        m("span", {
          class: te(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + M(e.removed), 3),
        m("span", c0, M(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: H.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[0] || (g[0] = Se((d) => H.value = H.value === "after" ? "before" : "after", ["stop"]))
        }, M(H.value === "after" ? "After" : "Before"), 9, u0)) : P("", !0),
        k.value ? P("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: te(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[1] || (g[1] = Se((d) => s("whole"), ["stop"]))
        }, [
          V(Ie, {
            name: "file",
            size: 12
          })
        ], 10, d0))
      ], 8, o0),
      e.whole && e.whole.error ? (c(), h("p", h0, M(e.whole.error), 1)) : P("", !0),
      !k.value && !e.folded ? (c(), h(Z, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          m("img", {
            src: e.picture,
            alt: f.value,
            loading: "lazy"
          }, null, 8, p0)
        ], 8, f0)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: p,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: y,
            class: "diff-card-diff"
          }, [
            m("div", g0, [
              (c(!0), h(Z, null, ie(Q.value, (d, S) => (c(), h("div", {
                key: S,
                class: te(["diff-row", d.line_type, { fresh: e.fresh && d.edit === e.fresh }])
              }, [
                m("span", m0, M(E(d)), 1),
                m("span", v0, M(r[d.line_type]), 1),
                m("span", y0, M(_(d)), 1)
              ], 2))), 128)),
              q.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[3] || (g[3] = Se((d) => A.value = !0, ["stop"]))
              }, M(q.value) + " more " + M(q.value === 1 ? "line" : "lines"), 1)) : P("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : P("", !0)
    ], 2));
  }
}, Nm = /* @__PURE__ */ Y(w0, [["__scopeId", "data-v-b6424f6e"]]), k0 = {
  key: 0,
  class: "menu-item-text"
}, b0 = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: te(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.description ? (c(), h("span", k0, [
        m("span", null, [
          be(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, M(e.description), 1)
      ])) : be(t.$slots, "default", {}, void 0, !0, 1)
    ], 2));
  }
}, x0 = /* @__PURE__ */ Y(b0, [["__scopeId", "data-v-5b5c4fd9"]]), $0 = {}, M0 = { class: "menu-label" };
function _0(e, t) {
  return c(), h("span", M0, [
    be(e.$slots, "default", {}, void 0, !0)
  ]);
}
const S0 = /* @__PURE__ */ Y($0, [["render", _0], ["__scopeId", "data-v-aa955b3e"]]), So = /* @__PURE__ */ new WeakMap(), E0 = (e, t) => So.set(e, t);
function A0(e, t) {
  for (let n = t; n; n = So.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function O0(e, t) {
  const n = (s) => {
    var o, i;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((i = e.value) == null ? void 0 : i.$el) || e.value;
    a && !A0(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ee(() => window.removeEventListener("click", n));
}
const rt = 8, C0 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = W(null), o = (d) => d ? `${d}px` : void 0, i = D(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), r = W({ w: 0, h: 0 }), l = W(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), k = (d) => {
      const S = d.closest(".pane, .float-window");
      return S ? f(S.getBoundingClientRect()) : u();
    }, T = (d, S) => `${Math.max(0, d ? Math.min(d, S) : S)}px`;
    function R(d, S) {
      return {
        below: d.bottom - S.bottom - s.gap - rt,
        above: S.top - d.top - s.gap - rt,
        across: d.right - d.left - 2 * rt
      };
    }
    function H(d) {
      const S = k(s.anchor), O = R(S, d);
      return r.value.w <= O.across && r.value.h <= Math.max(O.below, O.above) ? S : u();
    }
    const b = D(() => {
      if (!l.value) return i.value;
      const d = l.value, S = H(d), O = R(S, d), { w: N, h: ae } = r.value, oe = s.align === "auto" ? d.left + d.right > S.left + S.right : s.align === "right", de = ii(oe ? d.right - N : d.left, S.left + rt, Math.max(S.left + rt, S.right - N - rt)), pe = ae > O.below && O.above > O.below ? { bottom: `${window.innerHeight - d.top + s.gap}px`, maxHeight: T(s.maxHeight, O.above) } : { top: `${d.bottom + s.gap}px`, maxHeight: T(s.maxHeight, O.below) };
      return { ...i.value, ...pe, left: `${de}px`, maxWidth: T(s.maxWidth, O.across) };
    }), $ = n, A = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function j(d) {
      const S = A(), O = S.indexOf(document.activeElement);
      S[(O + d + S.length) % S.length].focus();
    }
    const Q = { ArrowDown: () => j(1), ArrowUp: () => j(-1), Escape: () => $("close") }, q = (d) => Q[d.key] && (d.preventDefault(), Q[d.key]()), E = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let _ = 0;
    const p = new ResizeObserver(() => {
      cancelAnimationFrame(_), _ = requestAnimationFrame(E);
    });
    O0(a, (d) => s.anchor && !s.anchor.contains(d.target) && $("close"));
    const y = (d, S) => ["top", "left", "right", "bottom"].some((O) => Math.abs(d[O] - S[O]) > 1), w = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let v = 0;
    function g() {
      if (s.anchor) {
        const d = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || w(d)) return $("close");
        y(d, l.value) && (l.value = d);
      }
      v = requestAnimationFrame(g);
    }
    return je(() => {
      s.anchor && a.value && E0(a.value, s.anchor), E(), a.value && p.observe(a.value), !s.plain && A()[0] && A()[0].focus(), g();
    }), Ee(() => {
      p.disconnect(), cancelAnimationFrame(v), cancelAnimationFrame(_);
    }), t({ element: a }), (d, S) => (c(), G(la, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", dt({
        ref_key: "panel",
        ref: a
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: b.value,
        onKeydown: q
      }), [
        be(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), T0 = /* @__PURE__ */ Y(C0, [["__scopeId", "data-v-3d203970"]]), B0 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(we, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: F(() => [
        V(Ie, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, R0 = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, L0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?" }, We],
  started: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?" }, We],
  testing: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, D0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], I0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], j0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], N0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], P0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], q0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? P0(t) : e === "agent" ? [...j0(t), ...I0(t)] : e === "check" ? N0(t) : e === "question" ? D0(t) : ((n = { plan: R0, task: L0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, W0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, H0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, F0 = { class: "ask-text" }, U0 = ["placeholder", "aria-label"], z0 = {
  key: 3,
  class: "moves"
}, V0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = D(() => q0(s.kind, s.row)), i = W(""), r = W(null), l = W("");
    xe(() => s.id, () => {
      i.value = "", r.value = null;
    });
    async function u(T, R = "") {
      const H = await s.read([T.noun ?? s.kind, T.word, String(s.id), ...T.flag ? [T.flag, R] : T.positional ? [R] : []]);
      i.value = H.ok ? "" : H.error, H.ok && (r.value = null, l.value = "", a("done"));
    }
    const f = (T) => T.confirm ? r.value = T : T.said ? u(T, T.said) : T.flag || T.positional ? (r.value = T, l.value = "") : u(T), k = () => l.value.trim() && u(r.value, l.value.trim());
    return t({ moves: o, press: f }), (T, R) => {
      var H;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: te(["foot", { inline: e.inline }])
      }, [
        i.value ? (c(), h("p", W0, M(i.value), 1)) : P("", !0),
        (H = r.value) != null && H.confirm ? (c(), h("div", H0, [
          m("span", F0, M(r.value.confirm), 1),
          V(we, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: R[0] || (R[0] = (b) => u(r.value))
          }, {
            default: F(() => [
              ve(M(r.value.label), 1)
            ]),
            _: 1
          }),
          V(we, {
            small: "",
            kind: "ghost",
            onClick: R[1] || (R[1] = (b) => r.value = null)
          }, {
            default: F(() => [...R[5] || (R[5] = [
              ve("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: Se(k, ["prevent"])
        }, [
          Gt(m("input", {
            "onUpdate:modelValue": R[2] || (R[2] = (b) => l.value = b),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: R[3] || (R[3] = Wo(Se((b) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, U0), [
            [Ho, l.value]
          ]),
          V(we, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: F(() => [
              ve(M(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          V(we, {
            small: "",
            kind: "ghost",
            onClick: R[4] || (R[4] = (b) => r.value = null)
          }, {
            default: F(() => [...R[6] || (R[6] = [
              ve("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", z0, [
          (c(!0), h(Z, null, ie(o.value, (b) => (c(), G(we, {
            key: b.word,
            small: "",
            kind: b.main ? "primary" : "ghost",
            "data-move": b.word,
            onClick: ($) => f(b)
          }, {
            default: F(() => [
              ve(M(b.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : P("", !0);
    };
  }
}, G0 = /* @__PURE__ */ Y(V0, [["__scopeId", "data-v-14c7da8d"]]), K0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, Y0 = { ...K0, done: "Completed" }, J0 = { class: "task-status-icon" }, Z0 = ["width", "height", "aria-label"], X0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", J0, [
      V(on, {
        name: "turn",
        mode: "out-in"
      }, {
        default: F(() => [
          (c(), h("svg", {
            key: e.status,
            class: te(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": K(Y0)[e.status]
          }, [
            V(as, { value: e.status }, {
              blocked: F(() => [...n[0] || (n[0] = [
                m("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                m("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: F(() => [...n[1] || (n[1] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                m("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: F(() => [...n[2] || (n[2] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: F(() => [...n[3] || (n[3] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                m("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: F(() => [...n[4] || (n[4] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                m("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: F(() => [...n[5] || (n[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: F(() => [...n[6] || (n[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Z0))
        ]),
        _: 1
      })
    ]));
  }
}, oa = /* @__PURE__ */ Y(X0, [["__scopeId", "data-v-2ab7e404"]]), Q0 = { class: "top" }, eg = {
  class: "crumb",
  "data-task-crumb": ""
}, tg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, ng = {
  key: 1,
  class: "body"
}, sg = { class: "stamp" }, ag = {
  class: "title",
  "data-resource-title": ""
}, og = { class: "since" }, rg = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, ig = { class: "text" }, lg = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, cg = { class: "text" }, ug = { class: "facts" }, dg = { class: "fact wide" }, hg = { class: "fact-value" }, fg = {
  key: 0,
  class: "fact"
}, pg = { class: "fact-value" }, gg = {
  key: 1,
  class: "fact"
}, mg = { class: "fact-value" }, vg = {
  key: 2,
  class: "fact wide"
}, yg = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, wg = {
  key: 2,
  class: "part",
  "data-resource-waits": ""
}, kg = ["onClick"], bg = { class: "wait-id" }, xg = { class: "wait-title" }, $g = {
  key: 3,
  class: "part",
  "data-task-outcome": ""
}, Mg = { class: "text" }, _g = {
  key: 4,
  class: "part",
  "data-task-brief": ""
}, Sg = {
  key: 5,
  class: "part",
  "data-resource-logs": ""
}, Eg = 180, Ag = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back"],
  setup(e, { expose: t, emit: n }) {
    const s = [
      { key: "low", label: "Low" },
      { key: "normal", label: "Normal" },
      { key: "high", label: "High" }
    ], a = /* @__PURE__ */ new Set(["completed", "cancelled"]), o = e, i = n, r = W(null), l = W(null), u = W(""), f = W(""), k = W(!1), T = W(null), R = W(null);
    let H = 0;
    const b = (_) => a.has(_) ? "done" : _, $ = (_) => _.slice(0, 1).toUpperCase() + _.slice(1), A = D(() => {
      var _;
      return (_ = l.value) != null && _.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function j() {
      const _ = ++H, [p, y] = await Promise.all([o.read(["task", "inspect", String(o.id)]), o.read(["plan", "place", String(o.id)])]);
      _ === H && (u.value = p.ok ? "" : p.error, r.value = p.ok ? p.value : null, l.value = y.ok ? y.value : null);
    }
    xe(() => o.id, () => {
      r.value = null, l.value = null, k.value = !1, T.value = null, j();
    }, { immediate: !0 }), xe(() => o.changes, j);
    async function Q(_) {
      const p = await o.read(["task", "edit", String(o.id), "--priority", _]);
      if (f.value = p.ok ? "" : p.error, p.ok) return j();
    }
    function q(_) {
      T.value = null, R.value.press(_);
    }
    const E = (_) => {
      var p;
      return ((p = R.value) == null ? void 0 : p.moves.length) && (T.value = _);
    };
    return t({ openStatus: E }), (_, p) => {
      var y, w;
      return c(), h("aside", {
        class: te(["task-inspector", { lone: e.lone }]),
        "data-task-inspector": ""
      }, [
        m("div", Q0, [
          e.backed ? (c(), G(B0, {
            key: 0,
            onBack: p[0] || (p[0] = (v) => i("back"))
          })) : P("", !0),
          m("span", eg, M(A.value), 1),
          p[7] || (p[7] = m("span", { class: "grow" }, null, -1)),
          e.stepped ? (c(), h(Z, { key: 1 }, [
            V(we, {
              small: "",
              title: "Previous task (K)",
              "aria-label": "Previous task",
              onClick: p[1] || (p[1] = (v) => i("step", -1))
            }, {
              default: F(() => [
                V(Ie, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            V(we, {
              small: "",
              title: "Next task (J)",
              "aria-label": "Next task",
              onClick: p[2] || (p[2] = (v) => i("step", 1))
            }, {
              default: F(() => [
                V(Ie, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : P("", !0),
          V(we, {
            small: "",
            "aria-label": "Close the task (Esc)",
            "data-resource-close": "",
            onClick: p[3] || (p[3] = (v) => i("close"))
          }, {
            default: F(() => [
              V(Ie, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          })
        ]),
        u.value ? (c(), h("p", tg, M(u.value), 1)) : r.value ? (c(), h("div", {
          key: r.value.id,
          class: "body"
        }, [
          m("div", sg, "Task " + M(r.value.id) + " · updated " + M(K(As)(K(Zt)(r.value)) || "just now"), 1),
          m("h3", ag, M(r.value.title), 1),
          m("div", {
            class: te(["state-line", b(r.value.state)])
          }, [
            m("button", {
              type: "button",
              class: "state",
              "data-task-state": "",
              title: "Change the status (S)",
              onClick: p[4] || (p[4] = (v) => E(v.currentTarget))
            }, [
              V(oa, {
                status: b(r.value.state)
              }, null, 8, ["status"]),
              ve(" " + M($(r.value.state)), 1)
            ]),
            m("span", og, "since " + M(K(As)(K(Zt)(r.value)) || "just now"), 1)
          ], 2),
          r.value.state === "blocked" ? (c(), h("section", rg, [
            p[8] || (p[8] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
            m("p", ig, M(r.value.reason || "Other tasks"), 1),
            p[9] || (p[9] = m("p", { class: "note" }, "Nothing opens it by itself. Unblock it when that is done.", -1))
          ])) : r.value.state === "cancelled" && r.value.reason ? (c(), h("section", lg, [
            p[10] || (p[10] = m("span", { class: "label" }, "Why it was cancelled", -1)),
            m("p", cg, M(r.value.reason), 1)
          ])) : P("", !0),
          m("div", ug, [
            m("div", dg, [
              p[11] || (p[11] = m("span", { class: "fact-label" }, "Plan", -1)),
              m("span", hg, M((y = l.value) != null && y.plan_id ? `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan"), 1)
            ]),
            ((w = l.value) == null ? void 0 : w.phase_total) > 1 ? (c(), h("div", fg, [
              p[12] || (p[12] = m("span", { class: "fact-label" }, "Phase", -1)),
              m("span", pg, M(l.value.phase_number) + " of " + M(l.value.phase_total) + ": " + M(l.value.phase_title), 1)
            ])) : P("", !0),
            r.value.state === "started" && r.value.holder_id ? (c(), h("div", gg, [
              p[13] || (p[13] = m("span", { class: "fact-label" }, "Holder", -1)),
              m("span", mg, "Agent " + M(r.value.holder_id), 1)
            ])) : P("", !0),
            K(a).has(r.value.state) ? P("", !0) : (c(), h("div", vg, [
              p[14] || (p[14] = m("span", { class: "fact-label" }, "Priority", -1)),
              V(Gn, {
                options: s,
                value: r.value.priority,
                "data-task-priority": "",
                onPick: Q
              }, null, 8, ["value"]),
              f.value ? (c(), h("p", yg, M(f.value), 1)) : P("", !0)
            ]))
          ]),
          r.value.waits.length ? (c(), h("section", wg, [
            p[15] || (p[15] = m("h4", null, "Waits on", -1)),
            (c(!0), h(Z, null, ie(r.value.waits, (v) => (c(), h("button", {
              key: v.id,
              type: "button",
              class: "wait",
              onClick: (g) => i("select", v.id)
            }, [
              V(oa, {
                status: b(v.state),
                size: 12
              }, null, 8, ["status"]),
              m("span", bg, M(v.id), 1),
              m("span", xg, M(v.title), 1)
            ], 8, kg))), 128))
          ])) : P("", !0),
          r.value.state === "completed" && r.value.outcome ? (c(), h("section", $g, [
            p[16] || (p[16] = m("h4", null, "How it was done", -1)),
            m("p", Mg, M(r.value.outcome), 1)
          ])) : P("", !0),
          r.value.brief ? (c(), h("section", _g, [
            p[17] || (p[17] = m("h4", null, "The brief", -1)),
            m("p", {
              class: te(["text", { clamped: !k.value }])
            }, M(r.value.brief), 3),
            r.value.brief.length > Eg && !k.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "more",
              onClick: p[5] || (p[5] = (v) => k.value = !0)
            }, "Show the whole brief")) : P("", !0)
          ])) : P("", !0),
          r.value.logs.length ? (c(), h("section", Sg, [
            p[18] || (p[18] = m("h4", null, "Log", -1)),
            (c(!0), h(Z, null, ie(r.value.logs, (v) => (c(), h("p", {
              key: v.id,
              class: "log"
            }, M(v.line), 1))), 128))
          ])) : P("", !0)
        ])) : (c(), h("div", ng, [
          V(Et)
        ])),
        V(G0, {
          ref_key: "footer",
          ref: R,
          kind: "task",
          id: e.id,
          row: r.value,
          read: e.read,
          onDone: j
        }, null, 8, ["id", "row", "read"]),
        T.value ? (c(), G(T0, {
          key: 3,
          anchor: T.value,
          "min-width": 220,
          "max-width": 300,
          onClose: p[6] || (p[6] = (v) => T.value = null)
        }, {
          default: F(() => [
            V(S0, null, {
              default: F(() => [
                ve("Change the status of task " + M(e.id), 1)
              ]),
              _: 1
            }),
            (c(!0), h(Z, null, ie(R.value.moves, (v) => (c(), G(x0, {
              key: v.word,
              onClick: (g) => q(v)
            }, {
              default: F(() => [
                ve(M(v.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : P("", !0)
      ], 2);
    };
  }
}, Pm = /* @__PURE__ */ Y(Ag, [["__scopeId", "data-v-bbdb8e4c"]]);
function Og(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var jn = { exports: {} }, ra;
function Cg() {
  return ra || (ra = 1, (function(e, t) {
    var n = (function() {
      var s = function(E, _) {
        var p = 236, y = 17, w = E, v = o[_], g = null, d = 0, S = null, O = [], N = {}, ae = function(C, B) {
          d = w * 4 + 17, g = (function(x) {
            for (var L = new Array(x), I = 0; I < x; I += 1) {
              L[I] = new Array(x);
              for (var z = 0; z < x; z += 1)
                L[I][z] = null;
            }
            return L;
          })(d), oe(0, 0), oe(d - 7, 0), oe(0, d - 7), pe(), le(), Ne(C, B), w >= 7 && Me(C), S == null && (S = Eo(w, v, O)), Pe(S, B);
        }, oe = function(C, B) {
          for (var x = -1; x <= 7; x += 1)
            if (!(C + x <= -1 || d <= C + x))
              for (var L = -1; L <= 7; L += 1)
                B + L <= -1 || d <= B + L || (0 <= x && x <= 6 && (L == 0 || L == 6) || 0 <= L && L <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= L && L <= 4 ? g[C + x][B + L] = !0 : g[C + x][B + L] = !1);
        }, de = function() {
          for (var C = 0, B = 0, x = 0; x < 8; x += 1) {
            ae(!0, x);
            var L = r.getLostPoint(N);
            (x == 0 || C > L) && (C = L, B = x);
          }
          return B;
        }, le = function() {
          for (var C = 8; C < d - 8; C += 1)
            g[C][6] == null && (g[C][6] = C % 2 == 0);
          for (var B = 8; B < d - 8; B += 1)
            g[6][B] == null && (g[6][B] = B % 2 == 0);
        }, pe = function() {
          for (var C = r.getPatternPosition(w), B = 0; B < C.length; B += 1)
            for (var x = 0; x < C.length; x += 1) {
              var L = C[B], I = C[x];
              if (g[L][I] == null)
                for (var z = -2; z <= 2; z += 1)
                  for (var ne = -2; ne <= 2; ne += 1)
                    z == -2 || z == 2 || ne == -2 || ne == 2 || z == 0 && ne == 0 ? g[L + z][I + ne] = !0 : g[L + z][I + ne] = !1;
            }
        }, Me = function(C) {
          for (var B = r.getBCHTypeNumber(w), x = 0; x < 18; x += 1) {
            var L = !C && (B >> x & 1) == 1;
            g[Math.floor(x / 3)][x % 3 + d - 8 - 3] = L;
          }
          for (var x = 0; x < 18; x += 1) {
            var L = !C && (B >> x & 1) == 1;
            g[x % 3 + d - 8 - 3][Math.floor(x / 3)] = L;
          }
        }, Ne = function(C, B) {
          for (var x = v << 3 | B, L = r.getBCHTypeInfo(x), I = 0; I < 15; I += 1) {
            var z = !C && (L >> I & 1) == 1;
            I < 6 ? g[I][8] = z : I < 8 ? g[I + 1][8] = z : g[d - 15 + I][8] = z;
          }
          for (var I = 0; I < 15; I += 1) {
            var z = !C && (L >> I & 1) == 1;
            I < 8 ? g[8][d - I - 1] = z : I < 9 ? g[8][15 - I - 1 + 1] = z : g[8][15 - I - 1] = z;
          }
          g[d - 8][8] = !C;
        }, Pe = function(C, B) {
          for (var x = -1, L = d - 1, I = 7, z = 0, ne = r.getMaskFunction(B), ee = d - 1; ee > 0; ee -= 2)
            for (ee == 6 && (ee -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (g[L][ee - ge] == null) {
                  var ye = !1;
                  z < C.length && (ye = (C[z] >>> I & 1) == 1);
                  var se = ne(L, ee - ge);
                  se && (ye = !ye), g[L][ee - ge] = ye, I -= 1, I == -1 && (z += 1, I = 7);
                }
              if (L += x, L < 0 || d <= L) {
                L -= x, x = -x;
                break;
              }
            }
        }, st = function(C, B) {
          for (var x = 0, L = 0, I = 0, z = new Array(B.length), ne = new Array(B.length), ee = 0; ee < B.length; ee += 1) {
            var ge = B[ee].dataCount, ye = B[ee].totalCount - ge;
            L = Math.max(L, ge), I = Math.max(I, ye), z[ee] = new Array(ge);
            for (var se = 0; se < z[ee].length; se += 1)
              z[ee][se] = 255 & C.getBuffer()[se + x];
            x += ge;
            var Ae = r.getErrorCorrectPolynomial(ye), Oe = u(z[ee], Ae.getLength() - 1), gs = Oe.mod(Ae);
            ne[ee] = new Array(Ae.getLength() - 1);
            for (var se = 0; se < ne[ee].length; se += 1) {
              var ms = se + gs.getLength() - ne[ee].length;
              ne[ee][se] = ms >= 0 ? gs.getAt(ms) : 0;
            }
          }
          for (var vs = 0, se = 0; se < B.length; se += 1)
            vs += B[se].totalCount;
          for (var mn = new Array(vs), Rt = 0, se = 0; se < L; se += 1)
            for (var ee = 0; ee < B.length; ee += 1)
              se < z[ee].length && (mn[Rt] = z[ee][se], Rt += 1);
          for (var se = 0; se < I; se += 1)
            for (var ee = 0; ee < B.length; ee += 1)
              se < ne[ee].length && (mn[Rt] = ne[ee][se], Rt += 1);
          return mn;
        }, Eo = function(C, B, x) {
          for (var L = f.getRSBlocks(C, B), I = k(), z = 0; z < x.length; z += 1) {
            var ne = x[z];
            I.put(ne.getMode(), 4), I.put(ne.getLength(), r.getLengthInBits(ne.getMode(), C)), ne.write(I);
          }
          for (var ee = 0, z = 0; z < L.length; z += 1)
            ee += L[z].dataCount;
          if (I.getLengthInBits() > ee * 8)
            throw "code length overflow. (" + I.getLengthInBits() + ">" + ee * 8 + ")";
          for (I.getLengthInBits() + 4 <= ee * 8 && I.put(0, 4); I.getLengthInBits() % 8 != 0; )
            I.putBit(!1);
          for (; !(I.getLengthInBits() >= ee * 8 || (I.put(p, 8), I.getLengthInBits() >= ee * 8)); )
            I.put(y, 8);
          return st(I, L);
        };
        N.addData = function(C, B) {
          B = B || "Byte";
          var x = null;
          switch (B) {
            case "Numeric":
              x = T(C);
              break;
            case "Alphanumeric":
              x = R(C);
              break;
            case "Byte":
              x = H(C);
              break;
            case "Kanji":
              x = b(C);
              break;
            default:
              throw "mode:" + B;
          }
          O.push(x), S = null;
        }, N.isDark = function(C, B) {
          if (C < 0 || d <= C || B < 0 || d <= B)
            throw C + "," + B;
          return g[C][B];
        }, N.getModuleCount = function() {
          return d;
        }, N.make = function() {
          if (w < 1) {
            for (var C = 1; C < 40; C++) {
              for (var B = f.getRSBlocks(C, v), x = k(), L = 0; L < O.length; L++) {
                var I = O[L];
                x.put(I.getMode(), 4), x.put(I.getLength(), r.getLengthInBits(I.getMode(), C)), I.write(x);
              }
              for (var z = 0, L = 0; L < B.length; L++)
                z += B[L].dataCount;
              if (x.getLengthInBits() <= z * 8)
                break;
            }
            w = C;
          }
          ae(!1, de());
        }, N.createTableTag = function(C, B) {
          C = C || 2, B = typeof B > "u" ? C * 4 : B;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + B + "px;", x += '">', x += "<tbody>";
          for (var L = 0; L < N.getModuleCount(); L += 1) {
            x += "<tr>";
            for (var I = 0; I < N.getModuleCount(); I += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + C + "px;", x += " height: " + C + "px;", x += " background-color: ", x += N.isDark(L, I) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, N.createSvgTag = function(C, B, x, L) {
          var I = {};
          typeof arguments[0] == "object" && (I = arguments[0], C = I.cellSize, B = I.margin, x = I.alt, L = I.title), C = C || 2, B = typeof B > "u" ? C * 4 : B, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, L = typeof L == "string" ? { text: L } : L || {}, L.text = L.text || null, L.id = L.text ? L.id || "qrcode-title" : null;
          var z = N.getModuleCount() * C + B * 2, ne, ee, ge, ye, se = "", Ae;
          for (Ae = "l" + C + ",0 0," + C + " -" + C + ",0 0,-" + C + "z ", se += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', se += I.scalable ? "" : ' width="' + z + 'px" height="' + z + 'px"', se += ' viewBox="0 0 ' + z + " " + z + '" ', se += ' preserveAspectRatio="xMinYMin meet"', se += L.text || x.text ? ' role="img" aria-labelledby="' + at([L.id, x.id].join(" ").trim()) + '"' : "", se += ">", se += L.text ? '<title id="' + at(L.id) + '">' + at(L.text) + "</title>" : "", se += x.text ? '<description id="' + at(x.id) + '">' + at(x.text) + "</description>" : "", se += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', se += '<path d="', ge = 0; ge < N.getModuleCount(); ge += 1)
            for (ye = ge * C + B, ne = 0; ne < N.getModuleCount(); ne += 1)
              N.isDark(ge, ne) && (ee = ne * C + B, se += "M" + ee + "," + ye + Ae);
          return se += '" stroke="transparent" fill="black"/>', se += "</svg>", se;
        }, N.createDataURL = function(C, B) {
          C = C || 2, B = typeof B > "u" ? C * 4 : B;
          var x = N.getModuleCount() * C + B * 2, L = B, I = x - B;
          return q(x, x, function(z, ne) {
            if (L <= z && z < I && L <= ne && ne < I) {
              var ee = Math.floor((z - L) / C), ge = Math.floor((ne - L) / C);
              return N.isDark(ge, ee) ? 0 : 1;
            } else
              return 1;
          });
        }, N.createImgTag = function(C, B, x) {
          C = C || 2, B = typeof B > "u" ? C * 4 : B;
          var L = N.getModuleCount() * C + B * 2, I = "";
          return I += "<img", I += ' src="', I += N.createDataURL(C, B), I += '"', I += ' width="', I += L, I += '"', I += ' height="', I += L, I += '"', x && (I += ' alt="', I += at(x), I += '"'), I += "/>", I;
        };
        var at = function(C) {
          for (var B = "", x = 0; x < C.length; x += 1) {
            var L = C.charAt(x);
            switch (L) {
              case "<":
                B += "&lt;";
                break;
              case ">":
                B += "&gt;";
                break;
              case "&":
                B += "&amp;";
                break;
              case '"':
                B += "&quot;";
                break;
              default:
                B += L;
                break;
            }
          }
          return B;
        }, Ao = function(C) {
          var B = 1;
          C = typeof C > "u" ? B * 2 : C;
          var x = N.getModuleCount() * B + C * 2, L = C, I = x - C, z, ne, ee, ge, ye, se = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ae = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Oe = "";
          for (z = 0; z < x; z += 2) {
            for (ee = Math.floor((z - L) / B), ge = Math.floor((z + 1 - L) / B), ne = 0; ne < x; ne += 1)
              ye = "█", L <= ne && ne < I && L <= z && z < I && N.isDark(ee, Math.floor((ne - L) / B)) && (ye = " "), L <= ne && ne < I && L <= z + 1 && z + 1 < I && N.isDark(ge, Math.floor((ne - L) / B)) ? ye += " " : ye += "█", Oe += C < 1 && z + 1 >= I ? Ae[ye] : se[ye];
            Oe += `
`;
          }
          return x % 2 && C > 0 ? Oe.substring(0, Oe.length - x - 1) + Array(x + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return N.createASCII = function(C, B) {
          if (C = C || 1, C < 2)
            return Ao(B);
          C -= 1, B = typeof B > "u" ? C * 2 : B;
          var x = N.getModuleCount() * C + B * 2, L = B, I = x - B, z, ne, ee, ge, ye = Array(C + 1).join("██"), se = Array(C + 1).join("  "), Ae = "", Oe = "";
          for (z = 0; z < x; z += 1) {
            for (ee = Math.floor((z - L) / C), Oe = "", ne = 0; ne < x; ne += 1)
              ge = 1, L <= ne && ne < I && L <= z && z < I && N.isDark(ee, Math.floor((ne - L) / C)) && (ge = 0), Oe += ge ? ye : se;
            for (ee = 0; ee < C; ee += 1)
              Ae += Oe + `
`;
          }
          return Ae.substring(0, Ae.length - 1);
        }, N.renderTo2dContext = function(C, B) {
          B = B || 2;
          for (var x = N.getModuleCount(), L = 0; L < x; L++)
            for (var I = 0; I < x; I++)
              C.fillStyle = N.isDark(L, I) ? "black" : "white", C.fillRect(L * B, I * B, B, B);
        }, N;
      };
      s.stringToBytesFuncs = {
        default: function(E) {
          for (var _ = [], p = 0; p < E.length; p += 1) {
            var y = E.charCodeAt(p);
            _.push(y & 255);
          }
          return _;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(E, _) {
        var p = (function() {
          for (var w = j(E), v = function() {
            var le = w.read();
            if (le == -1) throw "eof";
            return le;
          }, g = 0, d = {}; ; ) {
            var S = w.read();
            if (S == -1) break;
            var O = v(), N = v(), ae = v(), oe = String.fromCharCode(S << 8 | O), de = N << 8 | ae;
            d[oe] = de, g += 1;
          }
          if (g != _)
            throw g + " != " + _;
          return d;
        })(), y = 63;
        return function(w) {
          for (var v = [], g = 0; g < w.length; g += 1) {
            var d = w.charCodeAt(g);
            if (d < 128)
              v.push(d);
            else {
              var S = p[w.charAt(g)];
              typeof S == "number" ? (S & 255) == S ? v.push(S) : (v.push(S >>> 8), v.push(S & 255)) : v.push(y);
            }
          }
          return v;
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
      }, i = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, r = (function() {
        var E = [
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
        ], _ = 1335, p = 7973, y = 21522, w = {}, v = function(g) {
          for (var d = 0; g != 0; )
            d += 1, g >>>= 1;
          return d;
        };
        return w.getBCHTypeInfo = function(g) {
          for (var d = g << 10; v(d) - v(_) >= 0; )
            d ^= _ << v(d) - v(_);
          return (g << 10 | d) ^ y;
        }, w.getBCHTypeNumber = function(g) {
          for (var d = g << 12; v(d) - v(p) >= 0; )
            d ^= p << v(d) - v(p);
          return g << 12 | d;
        }, w.getPatternPosition = function(g) {
          return E[g - 1];
        }, w.getMaskFunction = function(g) {
          switch (g) {
            case i.PATTERN000:
              return function(d, S) {
                return (d + S) % 2 == 0;
              };
            case i.PATTERN001:
              return function(d, S) {
                return d % 2 == 0;
              };
            case i.PATTERN010:
              return function(d, S) {
                return S % 3 == 0;
              };
            case i.PATTERN011:
              return function(d, S) {
                return (d + S) % 3 == 0;
              };
            case i.PATTERN100:
              return function(d, S) {
                return (Math.floor(d / 2) + Math.floor(S / 3)) % 2 == 0;
              };
            case i.PATTERN101:
              return function(d, S) {
                return d * S % 2 + d * S % 3 == 0;
              };
            case i.PATTERN110:
              return function(d, S) {
                return (d * S % 2 + d * S % 3) % 2 == 0;
              };
            case i.PATTERN111:
              return function(d, S) {
                return (d * S % 3 + (d + S) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + g;
          }
        }, w.getErrorCorrectPolynomial = function(g) {
          for (var d = u([1], 0), S = 0; S < g; S += 1)
            d = d.multiply(u([1, l.gexp(S)], 0));
          return d;
        }, w.getLengthInBits = function(g, d) {
          if (1 <= d && d < 10)
            switch (g) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + g;
            }
          else if (d < 27)
            switch (g) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + g;
            }
          else if (d < 41)
            switch (g) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + g;
            }
          else
            throw "type:" + d;
        }, w.getLostPoint = function(g) {
          for (var d = g.getModuleCount(), S = 0, O = 0; O < d; O += 1)
            for (var N = 0; N < d; N += 1) {
              for (var ae = 0, oe = g.isDark(O, N), de = -1; de <= 1; de += 1)
                if (!(O + de < 0 || d <= O + de))
                  for (var le = -1; le <= 1; le += 1)
                    N + le < 0 || d <= N + le || de == 0 && le == 0 || oe == g.isDark(O + de, N + le) && (ae += 1);
              ae > 5 && (S += 3 + ae - 5);
            }
          for (var O = 0; O < d - 1; O += 1)
            for (var N = 0; N < d - 1; N += 1) {
              var pe = 0;
              g.isDark(O, N) && (pe += 1), g.isDark(O + 1, N) && (pe += 1), g.isDark(O, N + 1) && (pe += 1), g.isDark(O + 1, N + 1) && (pe += 1), (pe == 0 || pe == 4) && (S += 3);
            }
          for (var O = 0; O < d; O += 1)
            for (var N = 0; N < d - 6; N += 1)
              g.isDark(O, N) && !g.isDark(O, N + 1) && g.isDark(O, N + 2) && g.isDark(O, N + 3) && g.isDark(O, N + 4) && !g.isDark(O, N + 5) && g.isDark(O, N + 6) && (S += 40);
          for (var N = 0; N < d; N += 1)
            for (var O = 0; O < d - 6; O += 1)
              g.isDark(O, N) && !g.isDark(O + 1, N) && g.isDark(O + 2, N) && g.isDark(O + 3, N) && g.isDark(O + 4, N) && !g.isDark(O + 5, N) && g.isDark(O + 6, N) && (S += 40);
          for (var Me = 0, N = 0; N < d; N += 1)
            for (var O = 0; O < d; O += 1)
              g.isDark(O, N) && (Me += 1);
          var Ne = Math.abs(100 * Me / d / d - 50) / 5;
          return S += Ne * 10, S;
        }, w;
      })(), l = (function() {
        for (var E = new Array(256), _ = new Array(256), p = 0; p < 8; p += 1)
          E[p] = 1 << p;
        for (var p = 8; p < 256; p += 1)
          E[p] = E[p - 4] ^ E[p - 5] ^ E[p - 6] ^ E[p - 8];
        for (var p = 0; p < 255; p += 1)
          _[E[p]] = p;
        var y = {};
        return y.glog = function(w) {
          if (w < 1)
            throw "glog(" + w + ")";
          return _[w];
        }, y.gexp = function(w) {
          for (; w < 0; )
            w += 255;
          for (; w >= 256; )
            w -= 255;
          return E[w];
        }, y;
      })();
      function u(E, _) {
        if (typeof E.length > "u")
          throw E.length + "/" + _;
        var p = (function() {
          for (var w = 0; w < E.length && E[w] == 0; )
            w += 1;
          for (var v = new Array(E.length - w + _), g = 0; g < E.length - w; g += 1)
            v[g] = E[g + w];
          return v;
        })(), y = {};
        return y.getAt = function(w) {
          return p[w];
        }, y.getLength = function() {
          return p.length;
        }, y.multiply = function(w) {
          for (var v = new Array(y.getLength() + w.getLength() - 1), g = 0; g < y.getLength(); g += 1)
            for (var d = 0; d < w.getLength(); d += 1)
              v[g + d] ^= l.gexp(l.glog(y.getAt(g)) + l.glog(w.getAt(d)));
          return u(v, 0);
        }, y.mod = function(w) {
          if (y.getLength() - w.getLength() < 0)
            return y;
          for (var v = l.glog(y.getAt(0)) - l.glog(w.getAt(0)), g = new Array(y.getLength()), d = 0; d < y.getLength(); d += 1)
            g[d] = y.getAt(d);
          for (var d = 0; d < w.getLength(); d += 1)
            g[d] ^= l.gexp(l.glog(w.getAt(d)) + v);
          return u(g, 0).mod(w);
        }, y;
      }
      var f = (function() {
        var E = [
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
        ], _ = function(w, v) {
          var g = {};
          return g.totalCount = w, g.dataCount = v, g;
        }, p = {}, y = function(w, v) {
          switch (v) {
            case o.L:
              return E[(w - 1) * 4 + 0];
            case o.M:
              return E[(w - 1) * 4 + 1];
            case o.Q:
              return E[(w - 1) * 4 + 2];
            case o.H:
              return E[(w - 1) * 4 + 3];
            default:
              return;
          }
        };
        return p.getRSBlocks = function(w, v) {
          var g = y(w, v);
          if (typeof g > "u")
            throw "bad rs block @ typeNumber:" + w + "/errorCorrectionLevel:" + v;
          for (var d = g.length / 3, S = [], O = 0; O < d; O += 1)
            for (var N = g[O * 3 + 0], ae = g[O * 3 + 1], oe = g[O * 3 + 2], de = 0; de < N; de += 1)
              S.push(_(ae, oe));
          return S;
        }, p;
      })(), k = function() {
        var E = [], _ = 0, p = {};
        return p.getBuffer = function() {
          return E;
        }, p.getAt = function(y) {
          var w = Math.floor(y / 8);
          return (E[w] >>> 7 - y % 8 & 1) == 1;
        }, p.put = function(y, w) {
          for (var v = 0; v < w; v += 1)
            p.putBit((y >>> w - v - 1 & 1) == 1);
        }, p.getLengthInBits = function() {
          return _;
        }, p.putBit = function(y) {
          var w = Math.floor(_ / 8);
          E.length <= w && E.push(0), y && (E[w] |= 128 >>> _ % 8), _ += 1;
        }, p;
      }, T = function(E) {
        var _ = a.MODE_NUMBER, p = E, y = {};
        y.getMode = function() {
          return _;
        }, y.getLength = function(g) {
          return p.length;
        }, y.write = function(g) {
          for (var d = p, S = 0; S + 2 < d.length; )
            g.put(w(d.substring(S, S + 3)), 10), S += 3;
          S < d.length && (d.length - S == 1 ? g.put(w(d.substring(S, S + 1)), 4) : d.length - S == 2 && g.put(w(d.substring(S, S + 2)), 7));
        };
        var w = function(g) {
          for (var d = 0, S = 0; S < g.length; S += 1)
            d = d * 10 + v(g.charAt(S));
          return d;
        }, v = function(g) {
          if ("0" <= g && g <= "9")
            return g.charCodeAt(0) - 48;
          throw "illegal char :" + g;
        };
        return y;
      }, R = function(E) {
        var _ = a.MODE_ALPHA_NUM, p = E, y = {};
        y.getMode = function() {
          return _;
        }, y.getLength = function(v) {
          return p.length;
        }, y.write = function(v) {
          for (var g = p, d = 0; d + 1 < g.length; )
            v.put(
              w(g.charAt(d)) * 45 + w(g.charAt(d + 1)),
              11
            ), d += 2;
          d < g.length && v.put(w(g.charAt(d)), 6);
        };
        var w = function(v) {
          if ("0" <= v && v <= "9")
            return v.charCodeAt(0) - 48;
          if ("A" <= v && v <= "Z")
            return v.charCodeAt(0) - 65 + 10;
          switch (v) {
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
              throw "illegal char :" + v;
          }
        };
        return y;
      }, H = function(E) {
        var _ = a.MODE_8BIT_BYTE, p = s.stringToBytes(E), y = {};
        return y.getMode = function() {
          return _;
        }, y.getLength = function(w) {
          return p.length;
        }, y.write = function(w) {
          for (var v = 0; v < p.length; v += 1)
            w.put(p[v], 8);
        }, y;
      }, b = function(E) {
        var _ = a.MODE_KANJI, p = s.stringToBytesFuncs.SJIS;
        if (!p)
          throw "sjis not supported.";
        (function(v, g) {
          var d = p(v);
          if (d.length != 2 || (d[0] << 8 | d[1]) != g)
            throw "sjis not supported.";
        })("友", 38726);
        var y = p(E), w = {};
        return w.getMode = function() {
          return _;
        }, w.getLength = function(v) {
          return ~~(y.length / 2);
        }, w.write = function(v) {
          for (var g = y, d = 0; d + 1 < g.length; ) {
            var S = (255 & g[d]) << 8 | 255 & g[d + 1];
            if (33088 <= S && S <= 40956)
              S -= 33088;
            else if (57408 <= S && S <= 60351)
              S -= 49472;
            else
              throw "illegal char at " + (d + 1) + "/" + S;
            S = (S >>> 8 & 255) * 192 + (S & 255), v.put(S, 13), d += 2;
          }
          if (d < g.length)
            throw "illegal char at " + (d + 1);
        }, w;
      }, $ = function() {
        var E = [], _ = {};
        return _.writeByte = function(p) {
          E.push(p & 255);
        }, _.writeShort = function(p) {
          _.writeByte(p), _.writeByte(p >>> 8);
        }, _.writeBytes = function(p, y, w) {
          y = y || 0, w = w || p.length;
          for (var v = 0; v < w; v += 1)
            _.writeByte(p[v + y]);
        }, _.writeString = function(p) {
          for (var y = 0; y < p.length; y += 1)
            _.writeByte(p.charCodeAt(y));
        }, _.toByteArray = function() {
          return E;
        }, _.toString = function() {
          var p = "";
          p += "[";
          for (var y = 0; y < E.length; y += 1)
            y > 0 && (p += ","), p += E[y];
          return p += "]", p;
        }, _;
      }, A = function() {
        var E = 0, _ = 0, p = 0, y = "", w = {}, v = function(d) {
          y += String.fromCharCode(g(d & 63));
        }, g = function(d) {
          if (!(d < 0)) {
            if (d < 26)
              return 65 + d;
            if (d < 52)
              return 97 + (d - 26);
            if (d < 62)
              return 48 + (d - 52);
            if (d == 62)
              return 43;
            if (d == 63)
              return 47;
          }
          throw "n:" + d;
        };
        return w.writeByte = function(d) {
          for (E = E << 8 | d & 255, _ += 8, p += 1; _ >= 6; )
            v(E >>> _ - 6), _ -= 6;
        }, w.flush = function() {
          if (_ > 0 && (v(E << 6 - _), E = 0, _ = 0), p % 3 != 0)
            for (var d = 3 - p % 3, S = 0; S < d; S += 1)
              y += "=";
        }, w.toString = function() {
          return y;
        }, w;
      }, j = function(E) {
        var _ = E, p = 0, y = 0, w = 0, v = {};
        v.read = function() {
          for (; w < 8; ) {
            if (p >= _.length) {
              if (w == 0)
                return -1;
              throw "unexpected end of file./" + w;
            }
            var d = _.charAt(p);
            if (p += 1, d == "=")
              return w = 0, -1;
            if (d.match(/^\s$/))
              continue;
            y = y << 6 | g(d.charCodeAt(0)), w += 6;
          }
          var S = y >>> w - 8 & 255;
          return w -= 8, S;
        };
        var g = function(d) {
          if (65 <= d && d <= 90)
            return d - 65;
          if (97 <= d && d <= 122)
            return d - 97 + 26;
          if (48 <= d && d <= 57)
            return d - 48 + 52;
          if (d == 43)
            return 62;
          if (d == 47)
            return 63;
          throw "c:" + d;
        };
        return v;
      }, Q = function(E, _) {
        var p = E, y = _, w = new Array(E * _), v = {};
        v.setPixel = function(O, N, ae) {
          w[N * p + O] = ae;
        }, v.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(p), O.writeShort(y), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(p), O.writeShort(y), O.writeByte(0);
          var N = 2, ae = d(N);
          O.writeByte(N);
          for (var oe = 0; ae.length - oe > 255; )
            O.writeByte(255), O.writeBytes(ae, oe, 255), oe += 255;
          O.writeByte(ae.length - oe), O.writeBytes(ae, oe, ae.length - oe), O.writeByte(0), O.writeString(";");
        };
        var g = function(O) {
          var N = O, ae = 0, oe = 0, de = {};
          return de.write = function(le, pe) {
            if (le >>> pe)
              throw "length over";
            for (; ae + pe >= 8; )
              N.writeByte(255 & (le << ae | oe)), pe -= 8 - ae, le >>>= 8 - ae, oe = 0, ae = 0;
            oe = le << ae | oe, ae = ae + pe;
          }, de.flush = function() {
            ae > 0 && N.writeByte(oe);
          }, de;
        }, d = function(O) {
          for (var N = 1 << O, ae = (1 << O) + 1, oe = O + 1, de = S(), le = 0; le < N; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(N)), de.add(String.fromCharCode(ae));
          var pe = $(), Me = g(pe);
          Me.write(N, oe);
          var Ne = 0, Pe = String.fromCharCode(w[Ne]);
          for (Ne += 1; Ne < w.length; ) {
            var st = String.fromCharCode(w[Ne]);
            Ne += 1, de.contains(Pe + st) ? Pe = Pe + st : (Me.write(de.indexOf(Pe), oe), de.size() < 4095 && (de.size() == 1 << oe && (oe += 1), de.add(Pe + st)), Pe = st);
          }
          return Me.write(de.indexOf(Pe), oe), Me.write(ae, oe), Me.flush(), pe.toByteArray();
        }, S = function() {
          var O = {}, N = 0, ae = {};
          return ae.add = function(oe) {
            if (ae.contains(oe))
              throw "dup key:" + oe;
            O[oe] = N, N += 1;
          }, ae.size = function() {
            return N;
          }, ae.indexOf = function(oe) {
            return O[oe];
          }, ae.contains = function(oe) {
            return typeof O[oe] < "u";
          }, ae;
        };
        return v;
      }, q = function(E, _, p) {
        for (var y = Q(E, _), w = 0; w < _; w += 1)
          for (var v = 0; v < E; v += 1)
            y.setPixel(v, w, p(v, w));
        var g = $();
        y.write(g);
        for (var d = A(), S = g.toByteArray(), O = 0; O < S.length; O += 1)
          d.writeByte(S[O]);
        return d.flush(), "data:image/gif;base64," + d;
      };
      return s;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(s) {
        function a(o) {
          for (var i = [], r = 0; r < o.length; r++) {
            var l = o.charCodeAt(r);
            l < 128 ? i.push(l) : l < 2048 ? i.push(
              192 | l >> 6,
              128 | l & 63
            ) : l < 55296 || l >= 57344 ? i.push(
              224 | l >> 12,
              128 | l >> 6 & 63,
              128 | l & 63
            ) : (r++, l = 65536 + ((l & 1023) << 10 | o.charCodeAt(r) & 1023), i.push(
              240 | l >> 18,
              128 | l >> 12 & 63,
              128 | l >> 6 & 63,
              128 | l & 63
            ));
          }
          return i;
        }
        return a(s);
      };
    })(), (function(s) {
      e.exports = s();
    })(function() {
      return n;
    });
  })(jn)), jn.exports;
}
var Tg = Cg();
const Bg = /* @__PURE__ */ Og(Tg), Rg = ["width", "height", "viewBox"], Lg = ["width", "height"], Dg = ["d"], Ig = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = D(() => {
      const s = Bg(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let i = 0; i < a; i += 1)
        for (let r = 0; r < a; r += 1)
          s.isDark(i, r) && o.push(`M${r + 4} ${i + 4}h1v1h-1z`);
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
      m("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, Lg),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Dg)
    ], 8, Rg));
  }
}, qm = /* @__PURE__ */ Y(Ig, [["__scopeId", "data-v-489f0852"]]), Wm = Fo(() => import("./VoiceFigure-BeyuSkSl.js").then((e) => e.V)), Hm = "1.0.0", Fm = "3.5";
export {
  Wg as $,
  lm as A,
  Ge as B,
  ym as C,
  rm as D,
  vm as E,
  Qg as F,
  Mo as G,
  jp as H,
  Dp as I,
  Mm as J,
  gt as K,
  pm as L,
  Ce as M,
  bt as N,
  um as O,
  gn as P,
  dm as Q,
  w1 as R,
  po as S,
  im as T,
  mm as U,
  ea as V,
  bp as W,
  pp as X,
  _m as Y,
  wm as Z,
  Y as _,
  re as a,
  we as a0,
  wa as a1,
  Hg as a2,
  Bu as a3,
  Nm as a4,
  Zg as a5,
  Kt as a6,
  Em as a7,
  Ng as a8,
  Ja as a9,
  Lm as aA,
  Im as aB,
  Jg as aC,
  Kg as aD,
  Vg as aE,
  Am as aF,
  Lf as aG,
  pt as aH,
  zg as aI,
  Cm as aJ,
  Bm as aK,
  O0 as aL,
  t0 as aM,
  Om as aN,
  Gd as aO,
  ha as aP,
  Rm as aQ,
  Ie as aa,
  Hm as ab,
  Fm as ac,
  Tm as ad,
  Gg as ae,
  x0 as af,
  S0 as ag,
  T0 as ah,
  Fg as ai,
  jm as aj,
  qm as ak,
  Rr as al,
  Pg as am,
  Yg as an,
  Gn as ao,
  Et as ap,
  Ug as aq,
  qg as ar,
  Pm as as,
  oa as at,
  ct as au,
  Vd as av,
  Wm as aw,
  tt as ax,
  As as ay,
  Dm as az,
  Ke as b,
  cm as c,
  tm as d,
  nm as e,
  em as f,
  bm as g,
  io as h,
  hm as i,
  fm as j,
  gm as k,
  xm as l,
  sm as m,
  Xg as n,
  am as o,
  tn as p,
  Sm as q,
  km as r,
  om as s,
  Le as t,
  fp as u,
  $m as v,
  mp as w,
  hs as x,
  N1 as y,
  P1 as z
};
