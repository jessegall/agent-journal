/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as xe, createElementVNode as m, normalizeClass as ee, Fragment as Z, renderList as ie, normalizeStyle as $e, defineComponent as ar, Comment as rr, h as Wn, cloneVNode as or, createBlock as K, withCtx as F, unref as G, createVNode as z, toDisplayString as _, createCommentVNode as N, inject as dt, computed as R, resolveDynamicComponent as Ze, Transition as Gt, watch as ke, ref as H, shallowRef as Yt, TransitionGroup as ir, mergeProps as ct, reactive as Hn, createTextVNode as ve, onMounted as Re, onUnmounted as _e, nextTick as Fn, useId as zs, Teleport as Ks, withModifiers as Ee, isRef as ns, resolveDirective as lr, withDirectives as Pt, useModel as cr, useAttrs as Gs, getCurrentInstance as ur, mergeModels as dr, getCurrentScope as Ys, onScopeDispose as Js, onBeforeUnmount as Un, provide as hr, onErrorCaptured as fr, toHandlers as pr, createSlots as gr, withKeys as mr, vModelText as vr } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, yr = { class: "skeleton-line" }, wr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", yr, [
      xe(t.$slots, "default", {}, void 0, !0),
      m("span", {
        class: ee(["bars", { faded: e.filled }])
      }, [
        (l(!0), d(Z, null, ie(e.bars, (s) => (l(), d("span", {
          key: s.width,
          class: ee(["bar", { still: e.still }]),
          style: $e({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Ge = /* @__PURE__ */ Y(wr, [["__scopeId", "data-v-0ebb6933"]]), Vn = ar({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== rr);
      return s.length !== 1 ? Wn(Z, { key: n }, s) : s[0].key == null ? or(s[0], { key: n }) : s[0];
    };
  }
}), kr = ["aria-label"], br = ["aria-label"], xr = ["aria-label"], $r = ["aria-label"], _r = ["aria-label"], Mr = ["aria-label"], Sr = ["aria-label"], Er = {
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
    ], r = [
      { width: "58%", height: 11 },
      { width: "32%", height: 9 }
    ], i = ["94%", "88%", "91%", "62%"].map((c) => ({ width: c, height: 10 })), o = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (c, h) => (l(), K(Vn, { value: e.shape }, {
      messages: F(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), d(Z, null, ie(t, (p) => m("div", {
            key: p.id,
            class: ee(["skeleton-message", { mine: p.mine }]),
            style: $e({ width: `${p.width}%`, height: `${p.height}px` })
          }, null, 6)), 64))
        ], 8, kr)
      ]),
      older: F(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, ie(t.slice(0, 3), (p) => (l(), d("div", {
            key: p.id,
            class: ee(["skeleton-message", { mine: p.mine }]),
            style: $e({ width: `${p.width}%`, height: `${p.height}px` })
          }, null, 6))), 128))
        ], 8, br)
      ]),
      cards: F(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, ie(e.count, (p) => (l(), d("div", {
            key: p,
            class: "skeleton-card"
          }, [
            (l(), d(Z, null, ie(n, ($) => z(Ge, {
              key: $.id,
              bars: $.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, xr)
      ]),
      file: F(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, ie(e.count, (p) => (l(), d("div", {
            key: p,
            class: "skeleton-file"
          }, [
            z(Ge, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), d(Z, null, ie(a, ($) => z(Ge, {
              key: $.id,
              bars: $.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, $r)
      ]),
      page: F(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          z(Ge, {
            class: "skeleton-heading",
            bars: o
          }),
          (l(!0), d(Z, null, ie(e.count, (p) => (l(), K(Ge, {
            key: p,
            bars: G(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, _r)
      ]),
      text: F(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, ie(e.count, (p) => (l(), K(Ge, {
            key: p,
            bars: G(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, Mr)
      ]),
      default: F(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, ie(e.count, (p) => (l(), K(Ge, {
            key: p,
            class: "skeleton-row",
            bars: r
          }))), 128))
        ], 8, Sr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, xt = /* @__PURE__ */ Y(Er, [["__scopeId", "data-v-c687fb85"]]), Ar = {
  key: 1,
  class: "empty-state titled"
}, Or = { class: "empty-state-title" }, Cr = { class: "empty-state-text" }, Tr = {
  key: 2,
  class: "empty-state"
}, Br = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), K(xt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", Ar, [
      m("p", Or, _(e.title), 1),
      m("p", Cr, [
        xe(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", Tr, [
      xe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, qt = /* @__PURE__ */ Y(Br, [["__scopeId", "data-v-b27e89b0"]]), Lr = { class: "fold-group" }, Dr = ["aria-expanded"], Rr = { class: "fold-label" }, Ir = {
  key: 0,
  class: "fold-count"
}, jr = {
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
    return (s, a) => (l(), d("div", Lr, [
      m("button", {
        type: "button",
        class: ee(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (r) => n("toggle"))
      }, [
        m("span", Rr, _(e.label), 1),
        e.count !== "" ? (l(), d("span", Ir, _(e.count), 1)) : N("", !0),
        m("span", {
          class: ee(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Dr),
      e.open ? xe(s.$slots, "default", {}, void 0, !0, 0) : N("", !0)
    ]));
  }
}, I0 = /* @__PURE__ */ Y(jr, [["__scopeId", "data-v-9ef1865c"]]), Qe = Symbol.for("journal.window-context");
function Zs() {
  const e = dt(Qe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Nr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Pr = /* @__PURE__ */ Y(Nr, [["__scopeId", "data-v-eb453d6f"]]), qr = {
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
    const t = e, n = R(() => {
      var s;
      return t.busy || t.disabled || !!((s = dt(Qe, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), K(Ze(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ee(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: F(() => [
        m("span", {
          class: ee(["btn-label", { hidden: e.busy }])
        }, [
          xe(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (l(), K(Pr, {
          key: 0,
          class: "btn-spinner"
        })) : N("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, we = /* @__PURE__ */ Y(qr, [["__scopeId", "data-v-a2dc4bda"]]), Wr = {
  class: "running",
  "data-running-command": ""
}, Hr = ["title"], Fr = {
  key: "idle",
  class: "running-idle"
}, Ur = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", Wr, [
      z(Gt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: F(() => [
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, _(e.text), 9, Hr)) : (l(), d("span", Fr, _(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, j0 = /* @__PURE__ */ Y(Ur, [["__scopeId", "data-v-e3ee3449"]]), Vr = ["aria-checked", "aria-label", "title"], zr = {
  key: 0,
  class: "switch-inner"
}, Kr = {
  key: 0,
  class: "switch-word"
}, Gr = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("button", {
      type: "button",
      class: ee(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (r) => n("change", !e.on))
    }, [
      m("span", {
        class: ee(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (l(), d("span", zr, _(e.word), 1)) : N("", !0),
        a[1] || (a[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Kr, _(e.word), 1)) : N("", !0)
    ], 10, Vr));
  }
}, N0 = /* @__PURE__ */ Y(Gr, [["__scopeId", "data-v-1bfb90f3"]]);
function Qs(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function yt(e, t) {
  return Qs(() => localStorage, e, t);
}
function Xs(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Jt(e, t) {
  return Xs(() => localStorage, e, t);
}
function ea(e, t) {
  ke(t, (n) => Jt(e, n), { deep: !0 });
}
function Yr(e, t) {
  return Qs(() => sessionStorage, e, t);
}
function Jr(e, t) {
  return Xs(() => sessionStorage, e, t);
}
const Wt = "journal.environment", ta = H(Yr(Wt, yt(Wt, "")));
function Zr(e) {
  ta.value = e, Jr(Wt, e), Jt(Wt, e);
}
const Ht = H(location.hash), ss = Yt(null), as = { integrations: "mcp", library: "team" };
function Qr() {
  if (!ss.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (as[n]) {
    location.replace(`#/${[as[n], ...s].join("/")}${t ? `?${t}` : ""}`), Ht.value = location.hash;
    return;
  }
  !n || ss.value(n) || (Zr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Ht.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Ht.value = location.hash, Qr();
});
const Ie = R(() => {
  const [e, t = ""] = Ht.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), r = (a.get("open") || "").split(",").filter(Boolean).map((i) => {
    const [o, c = ""] = i.split("@"), [h = "", p = "", $ = ""] = o.split(":");
    return { table: h, id: Number(p), comment: Number($) || 0, env: c };
  });
  return {
    env: ta.value,
    page: n,
    n: s ? /^\d+$/.test(s) ? Number(s) : s : 0,
    q: a.get("q") || "",
    sub: a.get("sub") || "",
    tab: a.get("tab") || "",
    plugin: a.get("plugin") || "",
    install: a.get("install") || "",
    line: Number(a.get("line") || 0),
    at: a.get("at") || "",
    stack: r,
    open: r[r.length - 1] || null
  };
}), Zt = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Zt.page(e)}?open=${t}`
};
function Xr(e = "", t = 0, n = "") {
  location.hash = Zt.page(e, t, n);
}
const eo = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function na(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), r = [...[...new URLSearchParams(s)].filter(([i]) => i !== "open" && i !== "sub").map(([i, o]) => `${i}=${encodeURIComponent(o)}`), ...e.length ? [`open=${e.map(eo).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${r ? `?${r}` : ""}`;
}
const rn = {};
function sa(e, t, n = 0, s = "") {
  var i;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((i = rn[e]) != null && i.call(rn, t))) return;
  const a = Ie.value.stack, r = a.findIndex((o) => o.table === e && o.id === t);
  na([...r < 0 ? a : a.slice(0, r), { table: e, id: t, comment: n }], s);
}
function to(e, t, n, s = 0, a = "") {
  if (e === Ie.value.env) return sa(t, n, s, a);
  const r = Ie.value.stack, i = r.findIndex((o) => o.table === t && o.id === n && o.env === e);
  na([...i < 0 ? r : r.slice(0, i), { table: t, id: n, comment: s, env: e }], a);
}
function ht(e, t = "") {
  const [n, s] = e.split("@"), [a, r] = n.split(":");
  return s ? to(s, a, Number(r), 0, t) : sa(a, Number(r), 0, t);
}
function no(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function rt(e) {
  const t = no(e);
  t && ht(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const so = ["stroke-width", "innerHTML"], je = {
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
    return (r, i) => (l(), d("svg", {
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
    }, null, 12, so));
  }
}, aa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), K(we, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: F(() => [
        z(je, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, ao = {
  key: 1,
  class: "row-list-failure"
}, ro = ["data-row"], oo = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = H(!1);
    async function a(r) {
      s.value = !await r();
    }
    return (r, i) => !e.loaded && !e.failure ? (l(), K(xt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", ao, _(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), K(qt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(Z, { key: 3 }, [
      (l(), K(Ze(e.arrival ? ir : "ul"), ct(n.value, { class: "row-list" }), {
        default: F(() => [
          (l(!0), d(Z, null, ie(e.rows, (o) => (l(), d("li", {
            key: o.id,
            class: "row-list-row",
            "data-row": o.id
          }, [
            xe(r.$slots, "default", { row: o }, void 0, !0)
          ], 8, ro))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: i[0] || (i[0] = (o) => a(e.older))
      }, "Show more")) : N("", !0)
    ], 64));
  }
}, io = /* @__PURE__ */ Y(oo, [["__scopeId", "data-v-7f34ada7"]]), lo = {
  class: "agent-rows",
  "data-agent-rows": ""
}, co = {
  key: 1,
  class: "agent-rows-note"
}, uo = {
  key: 2,
  class: "agent-rows-note"
}, ho = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, fo = ["data-agent-row", "onClick"], po = { class: "agent-row-name" }, go = { class: "agent-row-state" }, mo = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((a, r) => !!a.ended_at - !!r.ended_at || r.id - a.id)), s = R(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, r) => (l(), d("div", lo, [
      e.loaded ? e.failure ? (l(), d("p", co, _(e.failure), 1)) : e.rows.length ? (l(), d(Z, { key: 3 }, [
        m("p", ho, _(s.value) + " running", 1),
        (l(!0), d(Z, null, ie(n.value, (i) => (l(), d("button", {
          key: i.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": i.id,
          onClick: (o) => G(ht)(`agents:${i.id}`)
        }, [
          m("span", po, "#" + _(i.id) + " " + _(i.session), 1),
          m("span", go, _(i.ended_at ? "Closed" : "Running"), 1)
        ], 8, fo))), 128))
      ], 64)) : (l(), d("p", uo, _(e.none), 1)) : (l(), K(xt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, P0 = /* @__PURE__ */ Y(mo, [["__scopeId", "data-v-a01e5a17"]]), vo = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["badge", e.tone])
    }, _(e.text), 3));
  }
}, ra = /* @__PURE__ */ Y(vo, [["__scopeId", "data-v-9e7e1157"]]), yo = ["aria-valuenow", "aria-valuemax"], wo = {
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
    const t = e, n = R(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (l(), d("span", {
      class: ee(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: $e({ width: n.value })
      }, null, 4)
    ], 10, yo));
  }
}, ko = /* @__PURE__ */ Y(wo, [["__scopeId", "data-v-9eba6a85"]]), bo = { class: "bars" }, xo = { class: "bar-name" }, $o = { class: "bar-value" }, _o = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Math.max(1, ...n.items.map((i) => Number(i.value) || 0))), r = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (i, o) => (l(), d("div", bo, [
      (l(!0), d(Z, null, ie(e.items, (c, h) => (l(), K(Ze(c.open ? "button" : "div"), {
        key: `${h}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: ee(["bar-row", c.tone, { opens: c.open }]),
        onClick: (p) => c.open && s("open", c.open)
      }, {
        default: F(() => [
          m("span", xo, _(c.label), 1),
          z(ko, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", $o, _(c.value) + _(r.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Mo = /* @__PURE__ */ Y(_o, [["__scopeId", "data-v-663427f4"]]), So = { class: "bars" }, Eo = {
  key: 0,
  class: "bars-title"
}, Ao = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", So, [
      e.node.title ? (l(), d("span", Eo, _(e.node.title), 1)) : N("", !0),
      z(Mo, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (r) => n("open", r))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Oo = /* @__PURE__ */ Y(Ao, [["__scopeId", "data-v-7135bb11"]]), Co = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (i) => ({ gap: `${i.gap || 14}px` }),
      row: (i) => ({ gap: `${i.gap || 12}px` }),
      grid: (i) => ({ gap: `${i.gap || 12}px`, gridTemplateColumns: `repeat(${i.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, r = R(() => n[s.node.type](s.node));
    return (i, o) => (l(), d("div", {
      class: ee([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: $e(r.value)
    }, [
      (l(!0), d(Z, null, ie(e.node.children || [], (c, h) => (l(), K(La, {
        key: h,
        node: c,
        onOpen: o[0] || (o[0] = (p) => a("open", p)),
        onFile: o[1] || (o[1] = (p) => a("file", p))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Rt = /* @__PURE__ */ Y(Co, [["__scopeId", "data-v-d142a3f4"]]), To = {
  key: 0,
  class: "card-head"
}, Bo = { class: "card-title" }, Lo = {
  key: 0,
  class: "card-note"
}, Do = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: ee(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (r) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), d("header", To, [
        m("span", Bo, _(e.node.title), 1),
        e.node.note ? (l(), d("span", Lo, _(e.node.note), 1)) : N("", !0)
      ])) : N("", !0),
      z(Rt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (r) => n("open", r)),
        onFile: a[1] || (a[1] = (r) => n("file", r))
      }, null, 8, ["node"])
    ], 2));
  }
}, Ro = /* @__PURE__ */ Y(Do, [["__scopeId", "data-v-67b72d40"]]), Io = (e, t, n) => Math.max(t, Math.min(n, e)), be = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, rs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", on = 80;
function os(e) {
  return e.length <= on ? e : `${e.slice(0, on + 1).replace(/\s+\S*$/, "") || e.slice(0, on)}…`;
}
const is = {
  messages: (e) => os(rs(e.text)),
  comments: (e) => os(rs(e.text)),
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
}, jo = (e) => (is[e.table] ? is[e.table](e) : e.title || "") || "", No = ["done", "cancelled"], Sn = {
  tasks: (e) => be(e.completed_at) || (e.state === "cancelled" ? be(e.updated_at) : 0),
  questions: (e) => e.answer ? be(e.updated_at) : 0,
  plans: (e) => No.includes(e.state) ? be(e.updated_at) : 0,
  notices: (e) => be(e.closed_at),
  secrets: (e) => be(e.deleted_at),
  workers: (e) => e.state === "stopped" ? be(e.updated_at) : 0,
  shares: (e) => be(e.stopped_at),
  dumps: (e) => be(e.completed_at),
  agents: (e) => e.state === "ended" ? be(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? be(e.created_at) : 0
}, Po = (e) => Sn[e.table] ? Sn[e.table](e) : 0, oa = (e) => Po(e) > 0, qo = (e) => !!Sn[e], ia = (e) => be(e.created_at), Ft = (e) => be(e.updated_at) || ia(e), Wo = (e) => "task_ids" in e, Qt = typeof document < "u" && document.documentElement.classList.contains("phone"), Ho = "Files are attached on the computer; the phone sends text.", la = 1024, Fo = la * 1024 * 1024, Uo = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${la} MB limit for one file.`;
function Vo() {
  return () => {
  };
}
function ls(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function zo(e = window) {
  if (!ls(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    ls(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ca = "status.summary", me = Hn({
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
}), Ko = () => !!(me.version || me.external) && !me.failure && !me.late, ua = () => !!me.countdown || Ko() || me.starting;
function Go(e, t = "") {
  me.starting = e === !1, me.bootStep = me.starting ? t : "";
}
function Yo(e) {
  e && e.version && (me.target = e.version), me.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Jo() {
  Object.assign(me, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Zo(e, t = "") {
  return e && t && (me.step = t), me.version || (e && !me.external && Object.assign(me, { external: !0, since: Date.now() / 1e3 }), e || !me.external) ? !1 : (Jo(), !0);
}
let At = { version: "", started: 0 };
function Qo(e) {
  return e.version ? (At.version || (At = { version: e.version, started: e.started || 0 }), e.version !== At.version || (e.started || 0) !== At.started) : !1;
}
function Xo(e) {
  Yo(e.countdown), Go(e.ready, e.step), (Zo(!!e.updating, e.step) || !e.updating && !ei(e) && Qo(e)) && zo(window);
}
const ei = (e) => !!me.version && !me.failure && !me.late && e.version !== me.version, cs = 2e4, ti = 3e5, qe = 6e5, Ot = 6, ni = 500, si = "/journal/summary", us = Qt ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, ai = (e) => e.split("?")[0].endsWith(si), da = (e, t) => Object.assign(new Error(t), { status: e });
async function ri(e, t, n = da) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const oi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class ii {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Ot;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Ot;
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
  async reach(t, n, s, a, r, i = {}) {
    const o = s instanceof FormData;
    try {
      return await fetch(n, {
        method: t,
        headers: { ...us, ...i, ...s === void 0 || o ? {} : { "Content-Type": "application/json" } },
        body: oi(s),
        signal: AbortSignal.timeout(a || (o ? ti : cs))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || r <= 1) throw c;
      return await new Promise((h) => setTimeout(h, ni)), this.reach(t, n, s, a, r - 1, i);
    }
  }
  async send(t, n, s, a = 0, r = Ot, i = {}) {
    this.watcher("sent", t, n, s);
    const o = t === "GET" ? () => {
    } : Vo(), c = await this.reach(t, n, s, a, r, i).finally(() => {
      o(), this.watcher("answered", t, n, s);
    });
    return ri(c, `${c.status} ${c.statusText}`).catch((h) => {
      throw h.blocked && t !== "GET" && this.refused(h.message), h;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: us, signal: AbortSignal.timeout(cs) });
    if (!n.ok) throw da(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, r = {}, i = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Ot, r).then((c) => (this.written(n), c));
    if (ua() && !ai(n))
      return Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 }));
    if (this.flying.has(i)) return this.flying.get(i);
    const o = this.send(t, n, s, 0, this.tries, r);
    return this.flying.set(i, o), o.finally(() => this.flying.delete(i)).catch(() => {
    }), o;
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
const Be = new ii(), Se = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const ft = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: r = !1, docked: i = !1 }) => [i ? "docked" : "", r ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), pt = "the page does not know its environment yet", li = "X-Journal-Env", ci = "X-Journal-Request-At", ln = "/viewer/voices/figures/";
class zn {
  constructor({ env: t = () => Ie.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new zn({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [ci]: String(Date.now()), ...this.env() ? { [li]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === pt ? Promise.reject(new Error(pt)) : Be.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === pt ? Promise.reject(new Error(pt)) : Be.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : pt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${Se(this.env())}`);
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
    return Be.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: r, ids: i = [], tasks: o = [], closed: c = !1, docked: h = !1 } = {}) {
    const p = this.here(`/${t}${ue({ limit: n, before: s, after: a, since: r, ids: i.join(","), tasks: o.join(","), closed: c ? "1" : "", docked: h ? "1" : "" })}`);
    return this.get(p, `${t}.${ft({ before: s, after: a, since: r, ids: i, tasks: o, closed: c, docked: h })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: r = !1 } = {}) {
    const i = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: r ? "1" : "" })}`);
    return this.get(i, `chats/${t}.${ft({ before: s, since: a, docked: r })}`);
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
  act(t, n, s, a = {}, r = 0) {
    return this.post(this.here(`/${t}/${n}/${s}`), a, r);
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
    if (Qt) return Promise.reject(Object.assign(new Error(Ho), { status: 403 }));
    if (s.size > Fo) return Promise.reject(new Error(Uo(s)));
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${Se(s)}`);
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
    return Be.bytes(t);
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
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: r }) {
    return this.get(this.here(`/attachments${ue({ file_type: t, shelf: n, search: s, last: a, skip: r })}`));
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
    return this.get(`/agents/controls/${Se(t)}${ue({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${Se(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${Se(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${ft(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${ft(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${ft(n)}`);
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
  publishLibraryItem(t, n, s, a, r = "") {
    return this.post(`/library/items/${encodeURIComponent(t)}/publish`, { reference: n, note: s, description: a, team: r }, qe);
  }
  // imports a library item's version as this journal's own copy; accept writes a reader or a sequence whose script or powers were read
  importLibraryItem(t, n, s, a = !1, r = "") {
    return this.post(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}/import`, { version: s, accept: a, team: r });
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
    return this.get(this.here(`/skills/${Se(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${Se(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${Se(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return Be.request("GET", ln + "figures.json");
  }
  voiceFigureUrl(t) {
    return ln + t;
  }
  figureDecoderUrl() {
    return ln + "draco/";
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
    return this.post(`/profiles/${Se(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${Se(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${Se(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, qe);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Se(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, qe);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Se(t)}` : ""}${Zt.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const re = new zn({ base: Qt ? "/p" : "" }), ui = (e) => Be.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(re.base.length).split("/")[2]);
}), di = { claude: "Claude Code", codex: "Codex" };
Object.entries(di).map(([e, t]) => ({ key: e, label: t }));
const ds = (e) => e.status === "stopped" ? 1 : 0, hi = "main", fi = (e) => e.filter((t) => t.role === hi).sort((t, n) => ds(t) - ds(n) || be(n.heard_at) - be(t.heard_at))[0] || null, pi = { me: 1, people: [] }, U = Hn({
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
  people: pi,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: yt("journal.activity", !0),
  wide: !1,
  sideMini: yt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
ea("journal.activity", () => U.activity);
ea("journal.side.mini", () => U.sideMini);
const ut = R(() => fi(U.agents));
R(() => !!ut.value && U.live.some((e) => e.agent.session === ut.value.session && e.environment === Ie.value.env));
R(() => !!ut.value && ["busy", "working"].includes(ut.value.status));
function gi(e) {
  if (!e) return "";
  const t = typeof e == "string" ? Date.parse(e) / 1e3 : e, n = Math.max(0, Date.now() / 1e3 - t);
  return n < 60 ? "now" : n < 3600 ? `${Math.floor(n / 60)}m` : n < 86400 ? `${Math.floor(n / 3600)}h` : `${Math.floor(n / 86400)}d`;
}
function hs(e) {
  const t = gi(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function ha(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function fs(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const cn = (e) => String(e).padStart(2, "0");
function mi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${cn(t % 60)}s` : `${Math.floor(t / 3600)}h ${cn(Math.floor(t % 3600 / 60))}m ${cn(t % 60)}s`;
}
const vi = ["working", "busy", "waiting", "compacting"], yi = (e) => vi.includes(e), wi = "builder";
R(() => !U.settings || U.settings.features.file_feed !== !1);
const ki = R(() => !U.settings || U.settings.features.status_bar !== !1);
R(() => U.settings && U.settings.workers && U.settings.workers.mode || wi);
R(() => !U.settings || !U.settings.tasks || U.settings.tasks.auto !== !1);
R(() => !!(U.settings && U.settings.reviewing && U.settings.reviewing.reviewer));
R(() => !U.settings || U.settings.features.sharing !== !1);
const Ut = 50, Kn = 100, bi = { messages: 25 }, De = (e) => bi[e] || Ut;
function xi(e, t) {
  if (e !== "messages") return Math.max(t.length - De(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === De(e)) return s;
  return 0;
}
const $i = "review_step", _i = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === $i).sort((t, n) => t.id - n.id), Mi = 5, Si = 500, Ei = 3e3, Ai = () => U.entries.length ? U.entries[U.entries.length - 1].id : 0, It = { env: "", id: 0 }, Oi = () => !!(U.bar && U.bar.length) || yi(ut.value && ut.value.status);
function Ci({ session: e }) {
  return (e ? re.chat(e, { docked: !0 }) : re.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function Ti() {
  return re.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => re.chat(t.session, { limit: Kn })))).then(_i);
}
function Bi() {
  return It.env !== re.env() && Object.assign(It, { env: re.env(), id: Ai() }), re.entries(It.id);
}
function Li(e) {
  e.length && (It.id = e[e.length - 1].id, _l(e));
}
async function Di({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", Ut);
}
const En = /* @__PURE__ */ new Map();
async function An(e, t) {
  const n = `${e}:${re.env()}`, s = En.get(n);
  if (!s) return ps(n, (await re.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(Ft)), r = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, i = await re.list("workers", { limit: t, since: a, after: r });
  if (!i.is_last_page)
    return En.delete(n), An(e, t);
  const o = new Set(i.rows.map((c) => c.id));
  return ps(
    n,
    [...s.filter((c) => !o.has(c.id)), ...i.rows].sort((c, h) => c.id - h.id)
  );
}
const ps = (e, t) => (En.set(e, t), t);
async function gs(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const ms = Object.freeze({
  "status.bar": {
    read: () => re.bar(),
    every: () => Oi() ? Si : Ei,
    take: (e) => Array.isArray(e) && (U.bar = e),
    active: () => ki.value
  },
  "agents.index": { read: () => gs(re, Mi), every: 1e3, take: (e) => U.agents = e.rows },
  "agents.live": { read: () => re.liveAgents(), every: 5e3, take: (e) => U.live = e },
  "status.summary": {
    read: () => re.summary(),
    every: () => me.countdown || me.external || me.version ? 1e3 : 4e3,
    take: (e) => {
      U.summary = e, Xo(e);
    }
  },
  "journal.manifest": { read: () => re.manifest(), every: 3e4, take: (e) => U.spec = e },
  "journals.index": { read: () => re.journals(), every: 1e4, take: (e) => U.journals = e },
  "people.index": { read: () => re.people(), every: 3e4, take: (e) => e && e.people && (U.people = e) },
  "entries.recent": { read: Bi, every: 1e3, take: Li },
  "outputs.running": { read: () => re.runningOutputs(), every: 3e3 },
  "messages.docked": { read: Ci, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => re.mcp(), every: 3e4 },
  "developer.readers": { read: () => re.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => An("workers.index", De("workers")), every: 5e3 },
  "workers.activity": { read: () => re.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => An("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => re.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => re.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: Ti, every: 3e3 },
  "tests.turns": { read: () => re.list("test_turns", { limit: De("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => re.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? re.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? re.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => re.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: Di, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => gs(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: Ut }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: Ut }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), Ri = 6e4, Ii = 3e3, ji = 4, Ni = 300, Pi = 5e3, fa = /* @__PURE__ */ new Map();
function Xt(e) {
  if (!(e in ms)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return ms[e];
}
function qi(e) {
  const t = Xt(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Pi;
  }
}
const Wi = (e) => e / 2 + Math.random() * e / 2, pa = (e) => [...e.users.values()].pop(), Gn = (e) => fa.get(e.place) === e, Hi = () => Math.random() * Ni, Yn = () => document.hidden;
function Fi(e) {
  const t = qi(e);
  return e.failures ? Wi(Math.min(e.key === ca ? Ii : Ri, t * 2 ** e.failures)) : Math.max(t, ji * e.took);
}
function ga(e, t) {
  clearTimeout(e.timer), !(!Gn(e) || e.paused || Yn()) && (e.timer = setTimeout(() => Ui(e), t));
}
function Ui(e) {
  return Gn(e) ? e.running ? (e.again = !0, e.running) : (e.running = Gi(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Vi = (e) => {
  var t, n;
  return !e.paused && !Yn() && (((n = (t = Xt(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && pa(e).active() && (!ua() || e.key === ca);
};
async function zi(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Be.attemptOnce(() => Xt(e.key).read(pa(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Ki(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Xt(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Gi(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Vi(e) && Ki(e, await zi(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && Gn(e) && !e.paused);
  ga(e, Fi(e));
}
const Yi = () => Yn() || fa.forEach((e) => ga(e, Hi()));
document.addEventListener("visibilitychange", Yi);
const Ji = 60, Zi = (e, t) => be(e.created_at) >= be(t.created_at) - Ji, Qi = (e, t) => e.id > 0 && e.table === t.table && Zi(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), Jn = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Qi(s, n))), un = [
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
}), $t = {
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
    filters: un
  }),
  tasks: he("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: un
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
  notices: he("Notice", "band", "One line pinned to the chat while it matters", { filters: un }),
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
}, Xi = ["secrets", "plugins"], ma = Object.keys($t).filter((e) => !(Qt && Xi.includes(e)));
R(() => ma.map((e) => ({ name: e, ...$t[e] })));
const en = (e) => $t[e], va = new Map(ma.flatMap((e) => [e, e.replace(/s$/, ""), $t[e].title.toLowerCase()].map((t) => [t, e]))), it = (e) => va.get(String(e).toLowerCase()) || "", ya = [...va.keys()].sort((e, t) => t.length - e.length).join("|"), Ke = /* @__PURE__ */ new Set(), Zn = H(0), _t = /* @__PURE__ */ new Set(), Mt = /* @__PURE__ */ new Set(), Ve = /* @__PURE__ */ new Set(), On = /* @__PURE__ */ new Set(), el = /* @__PURE__ */ new Map(), tl = /* @__PURE__ */ new Map();
let at = !1, gt = null;
const nl = (e, t) => e.id - t.id, sl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, al = { messages: sl }, wa = (e) => al[e] || nl;
function ka(e) {
  return Zn.value, Ke.has(e) || (Ke.add(e), U.booted && (!_t.has(e) || Mt.has(e)) && queueMicrotask(() => nn([e], !1))), U.rows[e] || [];
}
function rl(e) {
  const t = U.rows[e] || [], n = xi(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  U.rows[e] = t.filter((a) => s.has(a) || qo(e) && !oa(a)), U.paging.size[e] = De(e), U.paging.more[e] = !0;
}
const ol = /* @__PURE__ */ new Set();
function il() {
  Ke.forEach(rl), Ke.clear(), el.clear(), tl.clear(), Zn.value += 1;
}
ke(() => `${Ie.value.env}/${Ie.value.page}/${Ie.value.open ? Ie.value.open.table : ""}`, il);
ke(
  () => U.booted,
  (e) => e && nn(
    [...Ke].filter((t) => !_t.has(t)),
    !1
  )
);
const Cn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Wo(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function ba(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Cn(s) && !Cn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function xa(e, t) {
  _t.add(e), Zn.value += 1;
  const n = U.rows[e] || [];
  U.rows[e] = [...ba(n, t.rows), ...Jn(n.filter((s) => s.id === 0), t.rows)], U.paging.size[e] = U.paging.size[e] || De(e), U.paging.more[e] = !t.is_last_page;
}
async function ll(e) {
  const t = new Set((U.rows[e] || []).map((r) => r.id)), n = await re.list(e, { limit: De(e) });
  tn(e, n.counts);
  const s = new Set(n.rows.map((r) => r.id)), a = Jn((U.rows[e] || []).filter((r) => !t.has(r.id) && !s.has(r.id)), n.rows);
  return xa(e, { ...n, rows: [...n.rows, ...a].sort(wa(e)) }), U.paging.size[e] = De(e), $a.has(e) && await _a(e), U.rows[e];
}
const tn = (e, t) => U.counts = { ...U.counts, [e]: t };
async function cl(e) {
  const t = U.rows[e] || [], n = Math.max(0, ...t.map(Ft)), s = t.length ? Math.min(...t.map((o) => o.id)) - 1 : 0, a = await re.list(e, { limit: De(e), since: n, after: s });
  if (tn(e, a.counts), !a.is_last_page) return ll(e);
  const r = new Map(a.rows.map((o) => [o.id, o])), i = Jn(t.filter((o) => !r.has(o.id)), a.rows).concat(ba(t, a.rows));
  return U.rows[e] = i.sort(wa(e)), U.paging.size[e] = U.rows[e].length, U.rows[e];
}
const dn = /* @__PURE__ */ new Set();
async function ul(e, t = !1) {
  e.forEach((n) => Mt.delete(n)), e.forEach((n) => On.add(n));
  try {
    await vl(e, t);
  } finally {
    e.forEach((n) => On.delete(n));
  }
}
async function dl(e) {
  const t = await re.list(e, { limit: De(e) });
  tn(e, t.counts), xa(e, t);
}
async function hl(e) {
  tn(e, (await re.list(e, { limit: 1, closed: !0 })).counts);
}
const $a = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function _a(e) {
  const t = (U.rows[e] || []).filter((a) => Cn(a) && (e !== "plans" || !oa(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await re.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  U.rows[e] = (U.rows[e] || []).map((a) => s.get(a.id) || a);
}
const fl = (e, t) => !_t.has(e) || t && (U.paging.size[e] || De(e)) === De(e) && !ol.has(e);
async function pl(e, t) {
  if (!Ke.has(e)) return hl(e);
  const n = await (fl(e, t) ? dl(e) : cl(e));
  return $a.has(e) && await _a(e), n;
}
async function gl() {
  const [e, t] = await Promise.all([re.entries(0, Kn), re.settings()]);
  Ea([...yt(Sa(), []), ...e]), JSON.stringify(t) !== JSON.stringify(U.settings) && (U.settings = t);
}
const ml = (e, t) => pl(e, t).then(
  () => null,
  () => e
);
async function vl(e, t) {
  const n = (await Promise.all(e.map((s) => ml(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ve.add(s), Mt.add(s))), t && await gl(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ma = 1e3, yl = 15e3;
let Ct = Ma;
async function wl() {
  return gt || (gt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ve].some((e) => !dn.has(e)) || at; ) {
      const e = at, t = [...e ? Object.keys(U.rows) : Ve].filter((s) => $t[s] && (Ke.has(s) || s in U.rows)).filter((s) => e || !Ke.has(s) || Mt.has(s) || !_t.has(s)).filter((s) => !dn.has(s)), n = [...Ve].filter((s) => dn.has(s));
      Ve.clear(), n.forEach((s) => Ve.add(s)), at = !1;
      try {
        await ul(t, e), Ct = Ma;
      } catch {
        at = at || e, await new Promise((a) => setTimeout(a, Ct)), Ct = Math.min(Ct * 2, yl);
      }
    }
  })().finally(() => gt = null), gt);
}
function nn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !On.has(n)).forEach((n) => {
    Ve.add(n), t && Mt.add(n);
  }), Ve.has("settings") && (at = !0), wl();
}
const Sa = () => {
  var e;
  return `typed-entries:${((e = U.identity) == null ? void 0 : e.root) || location.host}:${re.env()}`;
};
function Ea(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  U.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Kn), Jt(Sa(), U.entries.slice(-50));
}
const kl = ["created", "updated", "deleted"], bl = { phases: ["phases", "plans"] }, Tn = (e) => bl[e] || [e], xl = (e) => kl.includes(e.entry_type) ? [...Tn(e.data.table), ...(e.data.joins || []).flatMap(Tn)] : [];
function $l(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of Tn(t.data.table).filter((s) => U.rows[s]))
      U.rows[n] = U.rows[n].filter((s) => s.id !== t.data.id);
}
function _l(e) {
  Ea([...U.entries, ...e]), $l(e), nn([...new Set(e.flatMap(xl))].filter((t) => t && t !== "agents"));
}
ui((e) => U.streamOpen || nn([e]));
const Bn = [], Ml = 2e3, Ue = /* @__PURE__ */ new Map(), Sl = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, El = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Xe(e, { first: t = !1 } = {}) {
  t ? Bn.unshift(e) : Bn.push(e), Ue.clear();
}
function Aa(e, t, n) {
  var a;
  const s = ka(t).find((r) => r.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Al = (e) => ka(e.table).find((t) => t.id === e.id) === e.row, Ol = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function He(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Cl(e, t) {
  const n = [{ kind: "text", text: He(e).replace(/\r\n/g, `
`) }];
  for (const s of Bn)
    for (let a = n.length - 1; a >= 0; a--) {
      const r = n[a];
      if (r.kind !== "text") continue;
      const i = s(r.text, t);
      typeof i == "string" ? r.text = i : i && n.splice(a, 1, ...i);
    }
  return n;
}
function wt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, r) => `\0${t.push(`<code>${r}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Tl(s).replace(/\u0000(\d+)\u0000/g, (a, r) => t[Number(r)]);
}
function Tl(e) {
  return e.split(El).map((t, n) => n % 2 ? t : t.replace(Sl, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function vs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Bl(e) {
  const [t, , ...n] = e, s = vs(t).map((r) => `<th>${wt(r)}</th>`).join(""), a = n.map(
    (r) => `<tr>${vs(r).map((i) => `<td>${wt(i)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Ll(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const r = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    r ? n.push(r[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${wt(a)}</li>`).join("")}</${s}>`;
}
const ys = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Oa(e) {
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
      const o = t.findIndex((h, p) => p > s && /^(```|~~~)/.test(h)), c = o < 0 ? t.length : o;
      n.push(`<pre><code>${t.slice(s + 1, c).join(`
`)}</code></pre>`), s = c + 1;
      continue;
    }
    const r = a.match(/^(#{1,6})\s+(.*)$/);
    if (r) {
      const o = Math.min(6, r[1].length + 2);
      n.push(`<h${o}>${wt(r[2])}</h${o}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (ys(t, s)) {
      let o = s + 2;
      for (; o < t.length && t[o].includes("|"); ) o += 1;
      n.push(Bl(t.slice(s, o))), s = o;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let o = s + 1;
      for (; o < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[o]) || /^\s{2,}\S/.test(t[o])); ) o += 1;
      n.push(Ll(t.slice(s, o))), s = o;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let o = s;
      for (; o < t.length && /^(?:>|&gt;)\s?/.test(t[o]); ) o += 1;
      n.push(
        `<blockquote>${Oa(
          t.slice(s, o).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = o;
      continue;
    }
    let i = s;
    for (; i < t.length && t[i].trim() && !ys(t, i) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[i]); )
      i += 1;
    n.push(`<p>${wt(t.slice(s, i).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = i;
  }
  return n.join("");
}
const Dl = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Rl = (e) => e.kind !== "text" && !Dl.test(e.html);
function Il(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Oa(s).replace(/\u0001(\d+)\u0001/g, (r, i) => t[Number(i)])), s = "";
  };
  for (const r of e)
    r.kind === "text" ? s += r.text : Rl(r) ? s += `${t.push(r.html) - 1}` : (a(), n.push(r.html));
  return a(), n.filter(Boolean).join("");
}
function Ln(e, t = { env: "" }) {
  const n = Ol(e, t), s = Ue.get(n);
  if (Ue.delete(n), s && s.reads.every(Al))
    return Ue.set(n, s), s.html;
  const a = [], r = Il(Cl(e, { ...t, reads: a }));
  return Ue.set(n, { html: r, reads: a }), Ue.size > Ml && Ue.delete(Ue.keys().next().value), r;
}
const Ca = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Vt = (e) => String(e || "").replace(Ca, (t, n, s, a) => a), jl = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Tt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Nl = /^Traceback \(most recent call last\):/m, Pl = 8;
function Ta(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((r) => `<div class="console-frame">${r}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Pl).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function ql(e) {
  const t = [...e.matchAll(jl)].map((s) => s.index);
  if (Tt.lastIndex = 0, !t.length || !Tt.test(e)) return null;
  Tt.lastIndex = 0;
  const n = t.map((s, a) => {
    const r = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), i = [...r.matchAll(Tt)];
    return { head: i.length ? r.slice(0, i[0].index).trim() : r, frames: i.map((o) => o[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Ta(n), tail: "" } : null;
}
function Wl(e) {
  const t = Nl.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const r = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Ta([r]), tail: n.slice(a).join(`
`) };
}
Xe((e) => {
  const t = Vt(e), n = Wl(t) || ql(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Dn = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Hl = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Fl = `${Dn} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ul = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Vl = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", ws = {
  js: { keywords: Dn, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Hl, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Fl, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Dn, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Ul, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Vl, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function ks(e, t, n) {
  return n && e.startsWith(n, t);
}
function zl(e, t) {
  const n = ws[t] || ws.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let r = 0;
  const i = (o, c) => c && a.push({ kind: o, value: c });
  for (; r < e.length; ) {
    const o = e[r];
    if (n.markdown) {
      const h = e.indexOf(`
`, r), p = e.slice(r, h < 0 ? e.length : h);
      i(
        /^#{1,6}\s/.test(p) ? "keyword" : /^(```|~~~)/.test(p) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(p) ? "number" : "plain",
        p
      ), i("plain", h < 0 ? "" : `
`), r = h < 0 ? e.length : h + 1;
      continue;
    }
    if (ks(e, r, n.line) || n.hash && o === "#") {
      const h = e.indexOf(`
`, r);
      i("comment", e.slice(r, h < 0 ? e.length : h)), r = h < 0 ? e.length : h;
      continue;
    }
    if (n.block && ks(e, r, n.block[0])) {
      const h = e.indexOf(n.block[1], r + n.block[0].length), p = h < 0 ? e.length : h + n.block[1].length;
      i("comment", e.slice(r, p)), r = p;
      continue;
    }
    const c = (n.triple || []).find((h) => e.startsWith(h, r));
    if (c) {
      const h = e.indexOf(c, r + 3), p = h < 0 ? e.length : h + 3;
      i("string", e.slice(r, p)), r = p;
      continue;
    }
    if (n.quotes.includes(o)) {
      let h = r + 1;
      for (; h < e.length && e[h] !== o && (o === "`" || e[h] !== `
`); ) h += e[h] === "\\" ? 2 : 1;
      i("string", e.slice(r, h + 1)), r = h + 1;
      continue;
    }
    if (n.tags && o === "<" && /[A-Za-z/!?]/.test(e[r + 1] || "")) {
      const h = e.slice(r).match(/^<\/?[\w:-]+/);
      i("keyword", h[0]), r += h[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(o)) {
      const p = e.slice(r).match(/^[\w$]+/)[0], $ = n.lower ? p.toLowerCase() : p, A = n.property && /^\s*:/.test(e.slice(r + p.length));
      i(s.has($) ? "keyword" : A ? "property" : /^[A-Z]/.test(p) && t !== "text" ? "type" : "plain", p), r += p.length;
      continue;
    }
    if (/\d/.test(o)) {
      const h = e.slice(r).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      i("number", h[0]), r += h[0].length;
      continue;
    }
    if (n.tags && (o === ">" || e.startsWith("/>", r))) {
      const h = o === ">" ? 1 : 2;
      i("keyword", e.slice(r, r + h)), r += h;
      continue;
    }
    i("plain", o), r += 1;
  }
  return a;
}
function Kl(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of zl(e, t))
    a.split(`
`).forEach((i, o) => {
      o && n.push(""), i && (n[n.length - 1] += s === "plain" ? He(i) : `<span class="tok-${s}">${He(i)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Gl(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Yl = 1500, bs = /* @__PURE__ */ new WeakMap();
async function Jl(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Gl(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(bs.get(t)), bs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Yl)
  )));
}
typeof document < "u" && document.addEventListener("click", Jl, !0);
const Zl = /^(```|~~~)\s*(\w+)?\s*$/, xs = /^\s{4,}\S/, Ql = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Xl = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ba(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function ec(e) {
  const t = Ba(e.join(`
`));
  return (Xl.find(([, n]) => n.test(t)) || ["text"])[0];
}
function $s(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Kl(Ba(e.join(`
`)), t || ec(e)).join(`
`)}</code></pre></div>` };
}
function tc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let r = 0;
  for (; r < t.length; ) {
    const i = t[r].match(Zl);
    if (i) {
      const o = t.findIndex((h, p) => p > r && h.trim().startsWith(i[1])), c = o < 0 ? t.length : o;
      a(), n.push($s(t.slice(r + 1, c).map(Vt), i[2] ? i[2].toLowerCase() : "")), r = c + 1;
      continue;
    }
    if (xs.test(t[r])) {
      let o = r;
      for (; o < t.length && (xs.test(t[o]) || !t[o].trim()); ) o += 1;
      for (; o > r && !t[o - 1].trim(); ) o -= 1;
      const c = [];
      for (; s.length && s[s.length - 1].trim() && Ql.test(s[s.length - 1].trim()); ) c.unshift(s.pop());
      if (o - r + c.length >= 2) {
        a(), n.push($s([...c, ...t.slice(r, o)].map(Vt), "")), r = o;
        continue;
      }
      s.push(...c);
    }
    s.push(t[r]), r += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
Xe((e) => tc(e));
const nc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, sc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function ac(e) {
  const t = nc.exec(e);
  if (t && it(t[1])) return { at: t.index, length: t[0].length, table: it(t[1]), id: Number(t[2]), label: t[3] };
  const n = sc.exec(e), s = n && it(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function rc(e, t, n, s) {
  const a = Aa(s, e, t), r = Vt(a ? jo(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${He(en(e).title)} ${t}</span><span class="row-card-title">${He(r)}</span></a>`;
}
Xe(
  (e, t) => {
    const n = ac(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: rc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const oc = /\.(png|jpe?g|gif|webp|svg)$/i, ic = (e) => oc.test(e), lc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, cc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function uc(e, t) {
  const n = lc.exec(e), [, s, a, r, i, o] = n || [], c = n && it(s || r), h = c && Aa(t, c, Number(a || i));
  if (!h || !(h.files || []).includes(o)) return null;
  const p = re.in(t.env).fileUrl(c, h.id, o), $ = `${en(c).title} ${h.id} · ${He(o)}`, A = ic(o) ? `<img class="file-card-image" src="${p}" alt="${He(o)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${p}" data-attached="${He(o)}">${A}<span class="file-card-name">${$}</span></a>` };
}
function dc(e) {
  const t = cc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${He(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Xe(
  (e, t) => {
    if (t.inline) return null;
    const n = uc(e, t) || dc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const hc = /`([^`\n]+)`/g;
Xe((e) => e.replace(hc, (t, n) => `<code>${n}</code>`));
const _s = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Zt.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Xe(
  (e, t) => e.replace(Ca, (n, s, a, r) => _s[s] ? _s[s](a, r, t) : r)
);
const fc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, pc = new RegExp(`\\b(${ya}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), gc = new RegExp(`\\b(${ya}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), mc = (e, t) => `<a class="row-pill" href="#" data-peek="${it(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, vc = (e) => e.replace(gc, (t, n, s) => s.replace(/\d+/g, (a) => mc(n.replace(/s$/i, ""), a))), yc = (e) => vc(e).replace(
  pc,
  (t, n, s, a = "", r) => {
    const i = s || r;
    return `<a class="row-pill" href="#" data-peek="${it(n)}:${i}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${i}${a ? `:${a}` : ""}</span></a>`;
  }
);
Xe(
  (e, t) => t.rowNames === !1 ? e : e.split(fc).map((n, s) => s % 2 ? n : yc(n)).join("")
);
const wc = ["innerHTML"], kc = ["innerHTML"], bc = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((r) => r.trim()) || "" : t.text, a = Ln(s, { env: Ie.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...r) => G(rt) && G(rt)(...r)),
      innerHTML: n.value
    }, null, 8, wc)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...r) => G(rt) && G(rt)(...r)),
      innerHTML: n.value
    }, null, 8, kc));
  }
}, ot = /* @__PURE__ */ Y(bc, [["__scopeId", "data-v-30fd9c25"]]), xc = { class: "fact" }, $c = { class: "fact-label" }, _c = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", xc, [
      m("span", $c, _(e.label), 1),
      z(ot, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Mc = /* @__PURE__ */ Y(_c, [["__scopeId", "data-v-3a88ecf8"]]), Sc = { class: "list" }, Ec = { class: "list-label" }, Ac = {
  key: 1,
  class: "list-note"
}, Oc = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", Sc, [
      (l(!0), d(Z, null, ie(e.items, (r, i) => (l(), K(Ze(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: ee(["list-item", { opens: r.open }]),
        onClick: (o) => r.open && n("open", r.open)
      }, {
        default: F(() => [
          m("span", Ec, _(r.label), 1),
          r.badge ? (l(), K(ra, {
            key: 0,
            text: r.badge,
            tone: r.tone || ""
          }, null, 8, ["text", "tone"])) : N("", !0),
          r.note ? (l(), d("span", Ac, _(r.note), 1)) : N("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Cc = /* @__PURE__ */ Y(Oc, [["__scopeId", "data-v-ebe2ae0a"]]), Tc = { class: "table" }, Bc = {
  key: 0,
  class: "table-row empty"
}, Lc = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (r, i) => (l(), d("div", Tc, [
      m("div", {
        class: "table-row head",
        style: $e(a.value)
      }, [
        (l(!0), d(Z, null, ie(e.columns, (o) => (l(), d("span", {
          key: o,
          class: "cell"
        }, _(o), 1))), 128))
      ], 4),
      (l(!0), d(Z, null, ie(e.rows, (o, c) => (l(), K(Ze(o.open ? "button" : "div"), {
        key: c,
        type: o.open ? "button" : void 0,
        class: ee(["table-row", o.tone, { opens: o.open }]),
        style: $e(a.value),
        onClick: (h) => o.open && s("open", o.open)
      }, {
        default: F(() => [
          (l(!0), d(Z, null, ie(o.cells, (h, p) => (l(), d("span", {
            key: p,
            class: "cell"
          }, _(h), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), d("div", Bc, _(e.empty), 1)) : N("", !0)
    ]));
  }
}, Dc = /* @__PURE__ */ Y(Lc, [["__scopeId", "data-v-9326a52e"]]), Rc = { class: "stat-value" }, Ic = { class: "stat-label" }, jc = {
  key: 0,
  class: "stat-note"
}, Nc = {
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
    return (s, a) => (l(), K(Ze(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: ee(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (r) => e.opens && n("open"))
    }, {
      default: F(() => [
        m("span", Rc, _(e.value), 1),
        m("span", Ic, _(e.label), 1),
        e.note ? (l(), d("span", jc, _(e.note), 1)) : N("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Pc = /* @__PURE__ */ Y(Nc, [["__scopeId", "data-v-ad0db6d6"]]), qc = { class: "code" }, Wc = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (r) => n("open", r), a = (r) => n("file", r);
    return (r, i) => (l(), K(Vn, {
      value: e.node.type
    }, {
      stack: F(() => [
        z(Rt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: F(() => [
        z(Rt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: F(() => [
        z(Rt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: F(() => [
        z(Ro, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: F(() => [
        m("h3", {
          class: ee(["heading", `level-${e.node.level || 2}`])
        }, _(e.node.text), 3)
      ]),
      divider: F(() => [...i[2] || (i[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: F(() => [
        z(Pc, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: i[0] || (i[0] = (o) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: F(() => [
        z(Oo, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: F(() => [
        z(Dc, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: F(() => [
        z(Cc, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: F(() => [
        z(ot, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: F(() => [
        z(Mc, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: F(() => [
        z(ra, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: F(() => [
        m("pre", qc, [
          m("code", null, _(e.node.text), 1)
        ])
      ]),
      file: F(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: i[1] || (i[1] = (o) => a(e.node))
        }, _(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), La = /* @__PURE__ */ Y(Wc, [["__scopeId", "data-v-cbdcf540"]]), Hc = { class: "dashboard" }, Fc = { class: "trail" }, Uc = ["onClick"], Vc = {
  key: 0,
  class: "gone",
  role: "status"
}, zc = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (A) => A in (n.document.pages || {}), r = H(!!n.page && !a(n.page)), i = H(n.page && !r.value ? [n.page] : []), o = R(() => i.value.at(-1) || n.document.start), c = R(() => (n.document.pages || {})[o.value] || null), h = (A) => ((n.document.pages || {})[A] || {}).title || A, p = (A) => {
      r.value = !1, i.value = [...i.value, A];
    }, $ = (A) => {
      r.value = !1, i.value = i.value.slice(0, A);
    };
    return ke(
      () => n.document.start,
      () => i.value = []
    ), (A, j) => (l(), d("div", Hc, [
      e.document.broken ? (l(), K(qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: F(() => [
          ve(_(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), K(qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: F(() => [
          ve(_(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(Z, { key: 2 }, [
        m("nav", Fc, [
          m("button", {
            type: "button",
            class: ee(["step", { current: !i.value.length }]),
            onClick: j[0] || (j[0] = (W) => $(0))
          }, _(h(e.document.start)), 3),
          (l(!0), d(Z, null, ie(i.value, (W, y) => (l(), d(Z, {
            key: `${y}-${W}`
          }, [
            j[2] || (j[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: ee(["step", { current: y === i.value.length - 1 }]),
              onClick: (b) => $(y + 1)
            }, _(h(W)), 11, Uc)
          ], 64))), 128))
        ]),
        r.value ? (l(), d("p", Vc, "What you opened is no longer in this dashboard. Here is its start page.")) : N("", !0),
        z(Gt, {
          name: "page",
          mode: "out-in"
        }, {
          default: F(() => [
            (l(), d("div", {
              key: o.value,
              class: "page"
            }, [
              z(La, {
                node: c.value.view,
                onOpen: p,
                onFile: j[1] || (j[1] = (W) => s("file", W))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : N("", !0)
    ]));
  }
}, q0 = /* @__PURE__ */ Y(zc, [["__scopeId", "data-v-fbe83734"]]);
function Kc(e, t, n, s = () => window) {
  Re(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), _e(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Gc = (e, t = () => !0) => Kc("keydown", (n) => n.key === "Escape" && t() && e());
function Yc(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = H(!1), a = R(() => n() ? t.open : !s.value), r = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Gc(r, () => !n() && t.closable !== !1), { visible: a, close: r, closed: () => e("close") };
}
const Jc = 80, nt = Hn([]);
function Zc(e) {
  const t = Symbol("layer"), n = () => nt.includes(t) && nt.splice(nt.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !nt.includes(t) && nt.push(t), s || n();
    },
    { immediate: !0 }
  ), _e(n), R(() => Jc + Math.max(0, nt.indexOf(t)));
}
let Da = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Da = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Qc = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Xc(e, t, n = e) {
  let s = null;
  function a(r) {
    if (r.key === "Escape") return t();
    if (r.key !== "Tab" || !e.value) return;
    const i = [...e.value.querySelectorAll(Qc)];
    if (!i.length) return r.preventDefault();
    const [o, c] = [i[0], i.at(-1)];
    r.shiftKey && document.activeElement === o ? (r.preventDefault(), c.focus({ preventScroll: !0 })) : !r.shiftKey && document.activeElement === c && (r.preventDefault(), o.focus({ preventScroll: !0 }));
  }
  Re(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : Da, document.addEventListener("keydown", a), Fn(() => {
      var r;
      return (r = n.value) == null ? void 0 : r.focus({ preventScroll: !0 });
    });
  }), _e(() => {
    var r;
    document.removeEventListener("keydown", a), (r = s == null ? void 0 : s.focus) == null || r.call(s, { preventScroll: !0 });
  });
}
const eu = ["aria-modal", "aria-label", "aria-labelledby"], tu = {
  key: 0,
  class: "dialog-head"
}, nu = ["id", "tabindex"], su = {
  key: 1,
  class: "dialog-foot"
}, au = 500, ru = 400, ou = {
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
    const n = e, s = t, { visible: a, close: r, closed: i } = Yc(s, n), o = Zc(a), c = H(null), h = H(null), p = H(null), $ = zs(), A = H(!1), j = Date.now();
    n.modal && Xc(h, () => s("escape"), p);
    function W() {
      if (!n.modal) return n.closable && r();
      A.value = !0, setTimeout(() => A.value = !1, ru);
    }
    function y(P) {
      !n.modal || Date.now() - j >= au || ![" ", "Enter"].includes(P.key) || (P.preventDefault(), P.stopPropagation());
    }
    const b = () => c.value && (c.value.scrollTop = c.value.scrollHeight), L = new MutationObserver(b);
    return ke(c, (P) => {
      L.disconnect(), P && n.follow && (L.observe(P, { childList: !0, subtree: !0, characterData: !0 }), b());
    }), _e(() => L.disconnect()), (P, oe) => (l(), K(Ks, { to: "body" }, [
      z(Gt, {
        name: "dialog",
        appear: "",
        onAfterLeave: G(i)
      }, {
        default: F(() => [
          G(a) ? (l(), d("div", {
            key: 0,
            class: ee(["dialog", { large: e.large, sheet: e.sheet }]),
            style: $e({ zIndex: G(o) }),
            onClick: Ee(W, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: h,
              class: ee(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: A.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? G($) : void 0,
              onKeydownCapture: y
            }, [
              e.bare ? N("", !0) : (l(), d("header", tu, [
                m("h3", {
                  id: G($),
                  ref_key: "heading",
                  ref: p,
                  tabindex: e.modal ? -1 : void 0
                }, _(e.title), 9, nu),
                e.closable ? (l(), K(aa, {
                  key: 0,
                  onClick: G(r)
                }, null, 8, ["onClick"])) : N("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: c,
                class: ee(["dialog-body", { bare: e.bare }])
              }, [
                xe(P.$slots, "default", {}, void 0, !0)
              ], 2),
              P.$slots.foot ? (l(), d("footer", su, [
                xe(P.$slots, "foot", {}, void 0, !0)
              ])) : N("", !0)
            ], 42, eu)
          ], 6)) : N("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, iu = /* @__PURE__ */ Y(ou, [["__scopeId", "data-v-6d1ecd98"]]), Fe = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Le = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ce = { across: 48, down: 110, margin: 32, labelSpace: 14 }, lu = 6;
function Qn(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const cu = (e) => {
  const t = Qn(e, Fe.lineChars), n = Math.max(Fe.minWidth, Math.max(...t.map((s) => s.length)) * Fe.charWidth + Fe.padX * 2);
  return { name: e, lines: t, line: Fe.line, padY: Fe.padY, width: n, height: t.length * Fe.line + Fe.padY * 2 };
};
function uu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), r = (i) => {
    a.set(i, "open"), t.forEach((o, c) => {
      if (o[0] !== i) return;
      const h = a.get(o[1]);
      h === "open" ? s.add(c) : h || r(o[1]);
    }), a.set(i, "done");
  };
  return [...n, ...e].forEach((i) => a.has(i) || r(i)), s;
}
function du(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([r, i]) => {
      n.get(i) < n.get(r) + 1 && (n.set(i, n.get(r) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function hu(e, t, n) {
  const s = [];
  e.forEach((i) => {
    var o;
    return (s[o = n.get(i)] || (s[o] = [])).push(i);
  });
  const a = () => new Map(s.flatMap((i) => i.map((o, c) => [o, c]))), r = (i, o) => {
    const c = a(), h = (p) => {
      const $ = o(p).map((A) => c.get(A));
      return $.length ? $.reduce((A, j) => A + j, 0) / $.length : c.get(p);
    };
    return [...i].sort((p, $) => h(p) - h($));
  };
  for (let i = 0; i < lu; i++) {
    const o = i % 2 === 0, c = s.map((h, p) => p);
    (o ? c.slice(1) : c.slice(0, -1).reverse()).forEach((h) => {
      const p = ($) => t.filter((A) => A[o ? 1 : 0] === $).map((A) => A[o ? 0 : 1]);
      s[h] = r(s[h], p);
    });
  }
  return s;
}
function fu(e, t) {
  const n = /* @__PURE__ */ new Map(), s = (a, r, i, o) => {
    const c = `${a[r]}:${i}`;
    (n.get(c) || n.set(c, []).get(c)).push({ arrow: a, end: r, other: o });
  };
  e.forEach((a) => {
    s(a, "from", a.back ? "top" : "bottom", a.to), s(a, "to", a.back ? "bottom" : "top", a.from);
  });
  for (const a of n.values())
    a.sort((r, i) => t.get(r.other).x - t.get(i.other).x), a.forEach(({ arrow: r, end: i }, o) => r[`${i}Share`] = (o + 1) / (a.length + 1));
}
function pu(e) {
  const t = [...new Set(e.flatMap(([q, x]) => [q, x]))], n = new Set(e.map(([, q]) => q)), s = t.filter((q) => !n.has(q)), a = uu(t, e, s.length ? s : t.slice(0, 1)), r = e.filter((q, x) => !a.has(x)), i = du(t, r), o = hu(t, r, i), c = new Map(t.map((q) => [q, cu(q)])), h = o.map((q) => q.reduce((x, O) => x + c.get(O).width, 0) + Ce.across * (q.length - 1)), p = Math.max(...h) + Ce.margin * 2, $ = mu(e, i, o.length), A = /* @__PURE__ */ new Map();
  let j = Ce.margin;
  o.forEach((q, x) => {
    let O = (p - h[x]) / 2;
    const f = Math.max(...q.map((T) => c.get(T).height));
    q.forEach((T) => {
      const w = c.get(T);
      A.set(T, { ...w, x: O, y: j + (f - w.height) / 2 }), O += w.width + Ce.across;
    }), j += f + ($[x] ?? Ce.down);
  });
  const W = e.map(([q, x, O], f) => ({ from: q, to: x, label: O || "", back: a.has(f) || i.get(x) <= i.get(q) }));
  fu(W, A);
  const y = W.map((q) => vu(q, A.get(q.from), A.get(q.to))), b = [...A.values()], L = bu(y, b), P = Math.max(j - Ce.down, ...L.filter((q) => q.label).map((q) => q.label.y + q.label.height));
  return { width: Math.max(p - Ce.margin, ...L.filter((q) => q.label).map((q) => q.label.x + q.label.width)) + Ce.margin, height: P + Ce.margin, nodes: b, arrows: L };
}
const gu = (e) => e ? Qn(e, Le.lineChars).length * Le.line + Le.pad * 2 : 0;
function mu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Ce.labelSpace);
  return e.forEach(([a, r, i]) => {
    const [o, c] = [t.get(a), t.get(r)].sort((h, p) => h - p);
    c > o && (s[o + Math.floor((c - o - 1) / 2)] += gu(i) + Ce.labelSpace);
  }), s.map((a) => Math.max(Ce.down, a));
}
function vu(e, t, n) {
  const s = e.label ? Qn(e.label, Le.lineChars) : [], a = s.length ? Math.max(...s.map((A) => A.length)) * Le.charWidth + Le.pad * 2 : 0, r = s.length * Le.line + (s.length ? Le.pad * 2 : 0), i = t.x + t.width * e.fromShare, o = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, h = e.back ? n.y + n.height : n.y, p = (h - o) / 2, $ = [{ x: i, y: o }, { x: i, y: o + p }, { x: c, y: h - p }, { x: c, y: h }];
  return { ...e, lines: s, labelWidth: a, labelHeight: r, curve: $, path: `M${i} ${o} C${i} ${o + p} ${c} ${h - p} ${c} ${h}` };
}
const yu = ([e, t, n, s], a) => {
  const r = 1 - a, i = (o) => r * r * r * e[o] + 3 * r * r * a * t[o] + 3 * r * a * a * n[o] + a * a * a * s[o];
  return { x: i("x"), y: i("y") };
}, wu = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], ku = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Le.line);
function bu(e, t) {
  const n = t.map(({ x: s, y: a, width: r, height: i }) => ({ x: s, y: a, width: r, height: i }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, h) => {
      const p = yu(s.curve, c);
      return { x: p.x - s.labelWidth / 2, y: p.y - s.labelHeight / 2 + h, width: s.labelWidth, height: s.labelHeight };
    }, o = ku.flatMap((c) => wu.map((h) => a(h, c))).find((c) => !n.some((h) => Ms(c, h))) ?? a(0.5, 0);
    for (; n.some((c) => Ms(o, c)); ) o.y += Le.line;
    return n.push(o), { ...s, label: { ...o, lines: s.lines, line: Le.line, pad: Le.pad } };
  });
}
const Ms = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, xu = { class: "flowchart-tools" }, $u = ["width", "height", "viewBox", "aria-label"], _u = ["d"], Mu = ["x", "y", "width", "height"], Su = ["x", "y"], Eu = ["x", "dy"], Au = {
  key: 0,
  class: "flowchart-label"
}, Ou = ["x", "y", "width", "height"], Cu = ["x", "y"], Tu = ["x", "dy"], Bu = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => pu(n.edges)), r = { least: 0.2, most: 4, step: 1.2 }, i = H(null), o = H({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function h() {
      var L;
      const y = (L = i.value) == null ? void 0 : L.getBoundingClientRect();
      if (!(y != null && y.width)) return;
      const b = Math.min(y.width / a.value.width, y.height / a.value.height, 1.5);
      o.value = { zoom: b, x: (y.width - a.value.width * b) / 2, y: (y.height - a.value.height * b) / 2 };
    }
    function p(y, b, L) {
      const { zoom: P, x: oe, y: q } = o.value, x = Math.min(r.most, Math.max(r.least, P * y));
      o.value = { zoom: x, x: b - (b - oe) * x / P, y: L - (L - q) * x / P };
    }
    function $(y) {
      const b = i.value.getBoundingClientRect();
      p(y, b.width / 2, b.height / 2);
    }
    function A(y) {
      const b = i.value.getBoundingClientRect();
      y.ctrlKey || y.metaKey ? p(y.deltaY < 0 ? r.step : 1 / r.step, y.clientX - b.left, y.clientY - b.top) : o.value = { ...o.value, x: o.value.x - y.deltaX, y: o.value.y - y.deltaY };
    }
    function j(y) {
      var b, L, P;
      y.preventDefault(), (b = window.getSelection()) == null || b.removeAllRanges(), c = { x: y.clientX - o.value.x, y: y.clientY - o.value.y }, (P = (L = i.value).setPointerCapture) == null || P.call(L, y.pointerId);
    }
    function W(y) {
      c && (o.value = { ...o.value, x: y.clientX - c.x, y: y.clientY - c.y });
    }
    return Re(h), (y, b) => (l(), K(iu, {
      title: e.title,
      large: "",
      onClose: b[4] || (b[4] = (L) => s("close"))
    }, {
      default: F(() => [
        m("div", xu, [
          z(we, {
            small: "",
            onClick: b[0] || (b[0] = (L) => $(r.step))
          }, {
            default: F(() => [...b[5] || (b[5] = [
              ve("Zoom in", -1)
            ])]),
            _: 1
          }),
          z(we, {
            small: "",
            onClick: b[1] || (b[1] = (L) => $(1 / r.step))
          }, {
            default: F(() => [...b[6] || (b[6] = [
              ve("Zoom out", -1)
            ])]),
            _: 1
          }),
          z(we, {
            small: "",
            onClick: h
          }, {
            default: F(() => [...b[7] || (b[7] = [
              ve("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: i,
          class: "flowchart-frame",
          onWheel: Ee(A, ["prevent"]),
          onPointerdown: j,
          onPointermove: W,
          onPointerup: b[2] || (b[2] = (L) => ns(c) ? c.value = null : c = null),
          onPointercancel: b[3] || (b[3] = (L) => ns(c) ? c.value = null : c = null)
        }, [
          (l(), d("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: $e({ transform: `translate(${o.value.x}px, ${o.value.y}px) scale(${o.value.zoom})` })
          }, [
            b[8] || (b[8] = m("defs", null, [
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
            (l(!0), d(Z, null, ie(a.value.arrows, (L, P) => (l(), d("path", {
              key: `arrow-${P}`,
              class: "flowchart-arrow",
              d: L.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, _u))), 128)),
            (l(!0), d(Z, null, ie(a.value.nodes, (L) => (l(), d("g", {
              key: L.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: L.x,
                y: L.y,
                width: L.width,
                height: L.height,
                rx: "8"
              }, null, 8, Mu),
              m("text", {
                x: L.x + L.width / 2,
                y: L.y + L.padY + L.line / 2
              }, [
                (l(!0), d(Z, null, ie(L.lines, (P, oe) => (l(), d("tspan", {
                  key: oe,
                  x: L.x + L.width / 2,
                  dy: oe ? L.line : 0
                }, _(P), 9, Eu))), 128))
              ], 8, Su)
            ]))), 128)),
            (l(!0), d(Z, null, ie(a.value.arrows, (L, P) => (l(), d(Z, {
              key: `label-${P}`
            }, [
              L.label ? (l(), d("g", Au, [
                m("rect", {
                  x: L.label.x,
                  y: L.label.y,
                  width: L.label.width,
                  height: L.label.height,
                  rx: "4"
                }, null, 8, Ou),
                m("text", {
                  x: L.label.x + L.label.width / 2,
                  y: L.label.y + L.label.pad + L.label.line / 2
                }, [
                  (l(!0), d(Z, null, ie(L.label.lines, (oe, q) => (l(), d("tspan", {
                    key: q,
                    x: L.label.x + L.label.width / 2,
                    dy: q ? L.label.line : 0
                  }, _(oe), 9, Tu))), 128))
                ], 8, Cu)
              ])) : N("", !0)
            ], 64))), 128))
          ], 12, $u))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Lu = /* @__PURE__ */ Y(Bu, [["__scopeId", "data-v-51d24cfe"]]), Du = ["title", "aria-label"], Ru = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Iu = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, ju = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, r) => (l(), d("span", {
      class: ee(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), d("svg", Ru, [
        r[0] || (r[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", Iu)) : N("", !0)
      ]))
    ], 10, Du));
  }
}, Nu = /* @__PURE__ */ Y(ju, [["__scopeId", "data-v-6dc92808"]]), Pu = "img,pre,table";
function qu(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Wu(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Hu(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Pu)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = qu(Wu(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Fu(e, t) {
  let n = null;
  const s = () => e.value && Hu(e.value);
  Re(() => {
    var r;
    if (s(), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), _e(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const Uu = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Vu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const zu = ["data-from", "data-ref"], Ku = { class: "message-body" }, Gu = ["innerHTML"], Yu = ["innerHTML"], Ju = {
  class: "message-tools",
  "data-message-tools": ""
}, Zu = {
  key: 0,
  class: "message-faces",
  "data-message-faces": ""
}, Qu = ["title", "data-face", "onClick"], Xu = {
  key: 1,
  class: "message-reactions",
  "data-message-reactions": ""
}, ed = ["title", "data-reaction", "onClick"], td = {
  key: 0,
  class: "message-reaction-count"
}, nd = {
  key: 2,
  class: "message-files",
  "data-message-files": ""
}, sd = ["href", "title"], ad = ["src", "alt"], rd = ["href"], od = { class: "message-foot" }, id = { class: "message-time" }, ld = 1500, cd = "An earlier message", ud = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = H(!1), r = H(null), i = R(() => n.message.type === "user" && !n.message.read_at && !n.message.local);
    async function o() {
      var x;
      await ((x = navigator.clipboard) == null ? void 0 : x.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, ld);
    }
    const c = R(() => Ln(n.message.text ?? "", { env: "" })), h = R(() => JSON.parse(n.message.flowchart_edges || "[]")), p = H(!1), $ = R(() => Ln(n.quote || cd, { env: "" }));
    function A() {
      const x = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      x ? x.scrollIntoView({ block: "center", behavior: "smooth" }) : ht(`messages:${n.message.parent_id}`);
    }
    Fu(r, () => `${n.message.text} ${n.quote}`);
    const j = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (x) => `/api/files/message/${n.message.id}/${encodeURIComponent(x)}`, y = R(() => JSON.parse(n.message.captions || "{}")), b = R(() => (n.message.files ?? []).map((x) => ({ name: x, address: W(x), isImage: j.test(x), title: y.value[x] || x }))), L = R(() => ha(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), P = H(!1), oe = R(() => Vu(n.message.reactions));
    function q(x) {
      P.value = !1, s("react", n.message, x);
    }
    return (x, O) => (l(), d("article", {
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Ku, [
        m("div", {
          ref_key: "bubble",
          ref: r,
          class: "message-card md",
          onClick: O[2] || (O[2] = (...f) => G(rt) && G(rt)(...f))
        }, [
          e.message.parent_id ? (l(), d("div", {
            key: 0,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Ee(A, ["stop"]),
            innerHTML: $.value
          }, null, 8, Gu)) : N("", !0),
          m("div", { innerHTML: c.value }, null, 8, Yu),
          h.value.length ? (l(), d(Z, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: O[0] || (O[0] = (f) => p.value = !0)
            }, "Open the flowchart"),
            p.value ? (l(), K(Lu, {
              key: 0,
              title: e.message.text,
              edges: h.value,
              onClose: O[1] || (O[1] = (f) => p.value = !1)
            }, null, 8, ["title", "edges"])) : N("", !0)
          ], 64)) : N("", !0)
        ], 512),
        m("div", Ju, [
          m("button", {
            type: "button",
            class: "message-tool",
            "data-message-action": "react",
            title: "React to this",
            onClick: O[3] || (O[3] = (f) => P.value = !P.value)
          }, "React"),
          m("button", {
            type: "button",
            class: "message-tool",
            "data-message-action": "reply",
            onClick: O[4] || (O[4] = (f) => s("reply", e.message))
          }, "Reply"),
          m("button", {
            type: "button",
            class: "message-tool",
            "data-message-action": "copy",
            onClick: o
          }, _(a.value ? "Copied" : "Copy"), 1),
          i.value ? (l(), d("button", {
            key: 0,
            type: "button",
            class: "message-tool",
            "data-message-action": "delete",
            title: "Only while it is unread",
            onClick: O[5] || (O[5] = (f) => s("delete", e.message))
          }, "Delete")) : N("", !0)
        ])
      ]),
      P.value ? (l(), d("div", Zu, [
        (l(!0), d(Z, null, ie(G(Uu), (f) => (l(), d("button", {
          key: f,
          type: "button",
          class: "message-face",
          title: `React ${f}`,
          "data-face": f,
          onClick: (T) => q(f)
        }, _(f), 9, Qu))), 128))
      ])) : N("", !0),
      oe.value.length ? (l(), d("div", Xu, [
        (l(!0), d(Z, null, ie(oe.value, (f) => (l(), d("button", {
          key: f.emoji,
          type: "button",
          class: ee(["message-reaction", { mine: f.mine }]),
          title: f.title,
          "data-reaction": f.emoji,
          onClick: (T) => s("react", e.message, f.emoji)
        }, [
          ve(_(f.emoji) + " ", 1),
          f.count > 1 ? (l(), d("span", td, _(f.count), 1)) : N("", !0)
        ], 10, ed))), 128))
      ])) : N("", !0),
      b.value.length ? (l(), d("div", nd, [
        (l(!0), d(Z, null, ie(b.value, (f) => (l(), d(Z, {
          key: f.name
        }, [
          f.isImage ? (l(), d("a", {
            key: 0,
            href: f.address,
            target: "_blank",
            class: "message-image",
            title: f.title
          }, [
            m("img", {
              src: f.address,
              alt: f.name
            }, null, 8, ad)
          ], 8, sd)) : (l(), d("a", {
            key: 1,
            href: f.address,
            target: "_blank",
            class: "message-file"
          }, _(f.name), 9, rd))
        ], 64))), 128))
      ])) : N("", !0),
      m("div", od, [
        m("time", id, _(L.value), 1),
        e.message.type === "user" ? (l(), K(Nu, {
          key: 0,
          message: e.message
        }, null, 8, ["message"])) : N("", !0)
      ])
    ], 8, zu));
  }
}, W0 = /* @__PURE__ */ Y(ud, [["__scopeId", "data-v-16bac692"]]), Ss = {
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
}, dd = ["innerHTML"], hd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => Ss[t.name] || Ss.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, dd));
  }
}, kt = /* @__PURE__ */ Y(hd, [["__scopeId", "data-v-beb5935c"]]), fd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      z(kt, { name: "fold" })
    ], 2));
  }
}, Ra = /* @__PURE__ */ Y(fd, [["__scopeId", "data-v-d03899bb"]]), pd = ["aria-checked", "aria-haspopup", "onClick"], gd = {
  key: 0,
  class: "segmented-dot"
}, md = {
  key: 1,
  class: "segmented-count"
}, vd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = zs();
    return (a, r) => {
      const i = lr("tip");
      return l(), d("span", {
        class: ee(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), d(Z, null, ie(e.options, (o) => Pt((l(), d("button", {
          key: o.key,
          type: "button",
          role: "radio",
          "aria-checked": o.key === e.value,
          "aria-haspopup": o.opens,
          class: ee(["segmented-option", { on: o.key === e.value }]),
          onClick: (c) => n("pick", o.key)
        }, [
          o.dot ? (l(), d("span", gd)) : N("", !0),
          ve(" " + _(o.label) + " ", 1),
          o.count !== void 0 ? (l(), d("em", md, _(o.count), 1)) : N("", !0)
        ], 10, pd)), [
          [i, o.tip || o.title, `${G(s)}-${o.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Rn = /* @__PURE__ */ Y(vd, [["__scopeId", "data-v-ca953072"]]), Es = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, yd = {
  key: 1,
  class: "text-field-label"
}, wd = {
  key: 2,
  class: "text-field-end"
}, kd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ dr({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var p;
    const n = cr(e, "modelValue"), s = Gs(), a = "onUpdate:modelValue" in (((p = ur()) == null ? void 0 : p.vnode.props) || {}), r = R(() => a ? n.value : s.value), i = ($) => a && (n.value = $.target.value), o = R(
      () => Object.fromEntries(Object.entries(s).filter(([$]) => $ !== "class" && $ !== "style" && $ !== "value"))
    ), c = R(() => Object.fromEntries(Object.entries(s).filter(([$]) => $ !== "value"))), h = H(null);
    return t({ focus: () => h.value && h.value.focus() }), ($, A) => e.label || e.icon || $.$slots.end ? (l(), d("label", {
      key: 0,
      class: ee(["text-field", { large: e.large, ended: $.$slots.end }, G(s).class]),
      style: $e(G(s).style)
    }, [
      e.icon ? (l(), K(je, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : N("", !0),
      e.label ? (l(), d("span", yd, _(e.label), 1)) : N("", !0),
      Pt(m("input", ct({
        ref_key: "input",
        ref: h,
        class: "text-field-input",
        spellcheck: "false"
      }, o.value, { onInput: i }), null, 16), [
        [G(Es), r.value]
      ]),
      $.$slots.end ? (l(), d("span", wd, [
        xe($.$slots, "end", {}, void 0, !0)
      ])) : N("", !0)
    ], 6)) : Pt((l(), d("input", ct({
      key: 1,
      ref_key: "input",
      ref: h,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: i }), null, 16)), [
      [G(Es), r.value]
    ]);
  }
}), bd = /* @__PURE__ */ Y(kd, [["__scopeId", "data-v-d9c38ca8"]]);
function xd(e, t, { incremental: n = !1 } = {}) {
  const s = Zs(), a = H([]), r = H(""), i = H(!1), o = H(""), c = H(null);
  async function h(y) {
    const b = await s.read(`${e} --before-id ${y + 1} --limit 1`);
    if (!b.ok) return j();
    const L = b.value.rows.find((P) => P.id === y);
    a.value = L ? a.value.map((P) => P.id === y ? L : P) : a.value.filter((P) => P.id !== y);
  }
  async function p(y) {
    if (n && String((y == null ? void 0 : y.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((q) => q.id !== y.row_id));
    if (n && (y != null && y.row_id) && !String(y.event ?? "").endsWith(".create") && a.value.some((q) => q.id === y.row_id)) return h(y.row_id);
    if (!(n && a.value.length && String((y == null ? void 0 : y.event) ?? "").endsWith(".create"))) return j();
    const L = Math.max(...a.value.map((q) => q.id)), P = await s.read(`${e} --after-id ${L}`);
    if (!P.ok) return j();
    const oe = new Set(a.value.map((q) => q.id));
    a.value = [...P.value.rows.filter((q) => !oe.has(q.id)), ...a.value];
  }
  async function $() {
    if (!a.value.length) return !1;
    const y = Math.min(...a.value.map((P) => P.id)), b = await s.read(`${e} --before-id ${y}`);
    if (!b.ok || !b.value.rows.length) return !1;
    const L = new Set(a.value.map((P) => P.id));
    return a.value = [...a.value, ...b.value.rows.filter((P) => !L.has(P.id))], !0;
  }
  let A = 0;
  async function j() {
    const y = ++A, b = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (y !== A) return;
    const L = b.ok ? s.shared ? [b.value] : b.value.rows : [], P = L.length ? Math.min(...L.map((oe) => oe.id)) : 0;
    a.value = n && b.ok && P ? [...a.value.filter((oe) => oe.id > Math.max(...L.map((q) => q.id))), ...L, ...a.value.filter((oe) => oe.id < P)] : L, r.value = b.ok ? "" : b.error, i.value = !0;
  }
  async function W(y) {
    const b = await s.run(y);
    return o.value = b.ok ? "" : b.error, c.value = b.ok ? b.value : null, await j(), b;
  }
  return s.follow(t, p), j(), { rows: a, failure: r, loaded: i, load: j, older: $, act: W, actionFailure: o, answer: c, context: s };
}
const $d = { class: "title" }, _d = { class: "state" }, Md = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = xd(t.line, t.events);
    return (r, i) => (l(), K(io, {
      rows: G(n),
      failure: G(s),
      loaded: G(a),
      empty: e.empty
    }, {
      default: F(({ row: o }) => [
        m("span", $d, _(o.title), 1),
        m("span", _d, _(o.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, H0 = /* @__PURE__ */ Y(Md, [["__scopeId", "data-v-a69084cd"]]), Sd = ["data-tip", "aria-label"], Ed = {
  key: 0,
  class: "mact-word"
}, Ad = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      z(kt, { name: "open" }),
      e.open ? (l(), d("span", Ed, _(e.label), 1)) : N("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, Sd));
  }
}, Od = /* @__PURE__ */ Y(Ad, [["__scopeId", "data-v-3b292e09"]]), hn = H(Date.now() / 1e3);
let As = 0, Bt = 0;
function Cd() {
  return Bt || (hn.value = Date.now() / 1e3, As = setInterval(() => hn.value = Date.now() / 1e3, 1e3)), Bt += 1, Ys() && Js(() => {
    Bt -= 1, Bt || clearInterval(As);
  }), hn;
}
const Td = 120, fn = 280, Bd = 160, Ld = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function Dd(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = H(t()), a = H("");
  let r = 0;
  const i = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), o = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  async function c(h) {
    const p = e.value, $ = ++r;
    if (!p || !p.offsetWidth || Ld()) {
      s.value = h;
      return;
    }
    const A = { width: p.offsetWidth, height: p.offsetHeight };
    if (i(p, A), a.value = "leaving", await n(Td), $ !== r) return;
    s.value = h, a.value = "resizing", await Fn(), o(p);
    const j = { width: p.offsetWidth, height: p.offsetHeight };
    i(p, A), p.offsetWidth, p.style.transition = `width ${fn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${fn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, i(p, j), await n(fn), $ === r && (o(p), a.value = "entering", await n(Bd), $ === r && (a.value = ""));
  }
  return ke(t, (h) => c(h)), Un(() => {
    r += 1;
  }), { folded: s, phase: a };
}
const Rd = ["title", "data-figure-mark", "data-folded", "data-open"], Id = {
  key: 2,
  class: "worker"
}, jd = { class: "head" }, Nd = { key: 0 }, Pd = {
  key: 3,
  class: "status"
}, qd = {
  key: 0,
  class: "figure"
}, Wd = {
  key: 1,
  class: "ran-for"
}, Hd = { key: 2 }, Fd = { key: 3 }, Ud = {
  key: 4,
  class: "news"
}, Vd = {
  key: 5,
  class: "spin",
  "aria-label": "Still running"
}, zd = {
  key: 7,
  class: "settled"
}, Kd = {
  key: 1,
  class: "bar"
}, Gd = {
  key: 3,
  class: "detail body"
}, Yd = {
  key: 0,
  class: "body-label"
}, Jd = ["title"], Zd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Gs(), s = ["onClick", "onAct"], a = R(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), r = H(!1), i = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), o = R(() => t.open !== void 0), c = R(() => o.value || i.value), h = R(() => o.value ? t.open : r.value), p = R(() => o.value ? !t.open : i.value && !r.value), $ = R(() => !!(t.mark.action && n.onAct)), A = R(() => c.value || $.value || !!n.onClick), j = H(null), W = H(null), { folded: y, phase: b } = Dd(j, () => p.value);
    function L(le) {
      var pe, Me;
      if (!(le.target !== j.value && !W.value.contains(le.target))) {
        if (o.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, le);
        if (i.value) return void (r.value = !r.value);
        (Me = n.onAct || n.onClick) == null || Me(le);
      }
    }
    const P = (le) => n.onAct(le), oe = ["failed", "unfinished"], q = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? oe.includes(t.mark.state) ? "danger" : "good" : ""), x = R(() => t.mark.color ? t.mark.color : q.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : q.value ? `var(--tone-${q.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), O = R(() => x.value || "var(--tone-work)"), f = R(() => !t.mark.ending && !t.mark.ended && q.value !== "stopped"), T = Cd(), w = R(
      () => t.mark.began_at && f.value && !t.mark.figure && !t.mark.counting ? mi(T.value - t.mark.began_at) : ""
    ), v = R(() => {
      const { started: le, ended: pe } = t.mark;
      return le ? pe ? `ran ${fs(pe - le, !0)}` : fs(T.value - le, !0) : w.value;
    }), g = ["bad", "danger", "warn"], u = R(() => g.includes(q.value) || t.mark.asks ? "attention" : f.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], S = R(() => M.includes(q.value)), I = R(() => u.value === "process" ? "running" : S.value ? "cross" : q.value === "stopped" ? "stopped" : q.value === "good" ? "tick" : ""), se = R(
      () => !!(t.mark.figure || v.value || t.mark.docked || t.mark.stopping || I.value || t.mark.settled || t.mark.news)
    ), ae = R(() => [t.mark.title, t.mark.time ? ha(t.mark.time) : ""].filter(Boolean).join(" · ")), de = R(() => ({
      ...x.value ? { "--mark": x.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, pe) => (l(), d("div", ct(a.value, {
      ref_key: "root",
      ref: j,
      class: [
        "mark",
        `w-${u.value}`,
        G(b),
        {
          open: h.value,
          live: A.value,
          failed: S.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: x.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: de.value,
      title: ae.value,
      "data-figure-mark": e.mark.key,
      "data-folded": G(y) ? "" : null,
      "data-open": o.value && e.open ? "" : null,
      onClick: L
    }), [
      (l(), K(Ze(A.value ? "button" : "span"), {
        ref_key: "top",
        ref: W,
        class: "top",
        type: A.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!h.value) : void 0
      }, {
        default: F(() => [
          e.mark.markIcon ? (l(), K(kt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), K(je, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), d("span", Id, _(e.mark.worker), 1)) : N("", !0),
          m("span", jd, [
            z(ot, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", Nd, _(e.mark.name), 1)) : N("", !0),
            c.value ? (l(), K(Ra, {
              key: 1,
              open: !!h.value
            }, null, 8, ["open"])) : N("", !0)
          ]),
          se.value ? (l(), d("span", Pd, [
            e.mark.figure ? (l(), d("span", qd, _(e.mark.figure), 1)) : N("", !0),
            v.value ? (l(), d("span", Wd, _(v.value), 1)) : N("", !0),
            e.mark.docked ? (l(), d("span", Hd, "In the dock")) : N("", !0),
            e.mark.stopping ? (l(), d("span", Fd, "Stopping")) : N("", !0),
            e.mark.news ? (l(), d("span", Ud, _(e.mark.news), 1)) : N("", !0),
            I.value === "running" ? (l(), d("span", Vd)) : I.value ? (l(), K(kt, {
              key: 6,
              class: ee(["sign", I.value]),
              name: I.value
            }, null, 8, ["class", "name"])) : N("", !0),
            e.mark.settled ? (l(), d("span", zd, _(e.mark.settled), 1)) : N("", !0)
          ])) : N("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      $.value ? (l(), K(Od, {
        key: 0,
        label: e.mark.action,
        open: !!h.value,
        onClick: Ee(P, ["stop"])
      }, null, 8, ["label", "open"])) : N("", !0),
      (e.mark.figure || e.mark.counting) && f.value ? (l(), d("span", Kd, [
        m("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: O.value })
        }, null, 4)
      ])) : N("", !0),
      e.mark.detail && !G(y) ? (l(), K(ot, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : N("", !0),
      e.mark.body && !G(y) ? (l(), d("div", Gd, [
        e.mark.bodyLabel ? (l(), d("p", Yd, _(e.mark.bodyLabel), 1)) : N("", !0),
        z(ot, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : N("", !0),
      e.mark.command && !G(y) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, _(e.mark.command), 9, Jd)) : N("", !0),
      e.mark.card ? (l(), K(ot, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : N("", !0),
      xe(le.$slots, "default", {
        shown: !G(y)
      }, void 0, !0)
    ], 16, Rd));
  }
}), Qd = /* @__PURE__ */ Y(Zd, [["__scopeId", "data-v-de840831"]]), Xd = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Ia(e) {
  var n;
  const t = Xd[e] || ((n = en(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const eh = (e) => Ia(String(e).split(":")[0]), ja = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), th = { passed: "good", failed: "danger", warned: "warn", running: "" }, Os = {
  "open row": (e) => ht(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Xr(e.target_model, e.target_id || 0)
}, nh = { "open row": (e) => eh(e.target_model), "open page": () => Ia("pages") };
function sh(e, t) {
  const n = t || {}, s = Os[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" && th[e.outcome] || "",
    label: e.text,
    // a mark with a body of its module's own keeps its lines for that body, and its cut-off first part is not a second line
    detail: n.body_url ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? nh[s](e) : "",
    handlers: s ? { onAct: () => Os[s](e) } : {}
  };
}
const ah = 24, rh = 1e3, Cs = 2e3, oh = 0.25, ih = 5e3;
function lh(e, t = ah, n = () => !0) {
  const s = H(!1), a = H(0), r = H(!1);
  let i = 0, o = 0, c = 0;
  const h = () => e && "value" in e ? e.value : e, p = () => {
    const q = h();
    return q ? q.scrollHeight - q.scrollTop - q.clientHeight : 0;
  }, $ = () => !h() || p() <= t;
  function A(q) {
    if (clearTimeout(i), !q) {
      r.value = !1, c = Date.now();
      return;
    }
    const x = Date.now() - c < Cs ? Cs : rh;
    i = setTimeout(() => r.value = s.value, x);
  }
  function j() {
    clearTimeout(o), s.value = !1, a.value = 0, A(!1);
  }
  function W(q = !1) {
    const x = h();
    x && q && x.scrollTo ? x.scrollTo({ top: x.scrollHeight, behavior: "smooth" }) : x && (x.scrollTop = x.scrollHeight), j();
  }
  function y() {
    L(), !s.value && (s.value = !0, A(!0));
  }
  const b = () => !!h() && p() <= h().clientHeight * oh;
  function L() {
    clearTimeout(o), b() && (o = setTimeout(() => s.value && b() && n() && W(!0), ih));
  }
  function P() {
    $() ? j() : y();
  }
  function oe(q = 1, x = !1) {
    s.value ? a.value += Math.max(0, q) : W(x);
  }
  return Ys() && Js(() => [i, o].forEach(clearTimeout)), { away: s, missed: a, showNewest: r, gap: p, atBottom: $, follow: j, toBottom: W, left: y, scrolled: P, arrived: oe };
}
const ch = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = H(null), { away: r, scrolled: i, arrived: o, toBottom: c } = lh(a);
    ke(
      () => n.lines.length,
      () => Fn(() => o()),
      { immediate: !0 }
    );
    function h(p) {
      i(), s("older", p.target);
    }
    return (p, $) => (l(), d("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: h
    }, [
      ve(_(e.lines.join(`
`) || e.empty), 1),
      G(r) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: $[0] || ($[0] = (A) => G(c)(!0))
      }, "Follow")) : N("", !0)
    ], 544));
  }
}, uh = /* @__PURE__ */ Y(ch, [["__scopeId", "data-v-09394a20"]]), dh = 1e4;
class hh {
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
    return this.heardAt !== null && t - this.heardAt > dh;
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
const fh = {
  key: 0,
  class: "frame-note"
}, ph = {
  key: 0,
  class: "frame-note"
}, gh = ["src", "title"], mh = 1e3, vh = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Zs(), s = H(null), a = H(!1), r = H(!1);
    let i = null, o = 0;
    return Re(() => {
      i = new hh(s.value, n), i.start(), o = setInterval(() => {
        a.value = i.silent();
      }, mh);
    }), _e(() => {
      i == null || i.stop(), clearInterval(o);
    }), (c, h) => r.value ? (l(), d("p", fh, "This window was closed because it stopped answering.")) : (l(), d(Z, { key: 1 }, [
      a.value ? (l(), d("div", ph, [
        h[2] || (h[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        z(we, {
          onClick: h[0] || (h[0] = (p) => r.value = !0)
        }, {
          default: F(() => [...h[1] || (h[1] = [
            ve("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : N("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: G(n).window
      }, null, 8, gh)
    ], 64));
  }
}, yh = /* @__PURE__ */ Y(vh, [["__scopeId", "data-v-32a49046"]]), wh = 0, kh = "/api/lines", bh = "/api/line";
class xh {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), wh));
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
        const n = await Be.raw(kh, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, r) => a.resolve(s[r]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Be.raw(bh, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const $h = new xh();
class _h {
  constructor() {
    this.follows = [], this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, s, a = () => !0) {
    const r = { window: t, patterns: n, heard: s, visible: a };
    return this.follows.push(r), () => this.follows = this.follows.filter((i) => i !== r);
  }
  count(t) {
    return this.follows.filter((n) => n.window === t).length;
  }
  stopAll(t) {
    this.follows = this.follows.filter((n) => n.window !== t), this.held = new Set([...this.held].filter((n) => n.window !== t));
  }
  dispatch(t) {
    for (const n of this.follows)
      n.patterns.some((s) => Na(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Na(e, t) {
  const [n, s] = e.split("."), [a, r] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === r);
}
const Mh = { 1: "refused", 2: "usage", 3: "fault" }, Sh = 100, Eh = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Ah({ window: e, environment: t, agent: n, visible: s, permissions: a, events: r = [], subscriptions: i, open: o, options: c = H({}), declared: h = [], readOnly: p = !1, shared: $ = null }) {
  const A = /* @__PURE__ */ new Map(), j = new AbortController(), W = (y) => {
    const b = A.get(y);
    if (b && performance.now() - b.at < Sh) return b.answer;
    const L = jt(e, y, t, j.signal);
    return A.set(y, { answer: L, at: performance.now() }), L;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: R(() => s()),
    permissions: a,
    readOnly: p,
    shared: $,
    read: W,
    run: (y) => jt(e, y, t, j.signal),
    upload: (y) => Ch(y, j.signal),
    cancel: () => j.abort(),
    follow: (y, b) => i.follow(e, y.filter((L) => r.some((P) => Na(P, L))), b, s),
    open: o,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (y) => R(() => {
      var b;
      return c.value[y] ?? ((b = h.find((L) => L.key === y)) == null ? void 0 : b.default);
    }),
    setting: async (y, b) => {
      const L = await W(`window setting ${e} ${y}`);
      return L.ok ? L.value.value : b;
    },
    keep: (y, b) => jt(e, ["window", "save-setting", e, y, JSON.stringify(b)], t, j.signal)
  };
}
function Oh(e) {
  try {
    const t = JSON.parse(e);
    return [t.refusal, t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const zt = { ok: !1, failure: "cancelled", error: "" };
async function jt(e, t, n, s = void 0) {
  try {
    const a = await $h.add({ window: e, line: Array.isArray(t) ? t : Th(t), environment: n }, s);
    return s != null && s.aborted ? zt : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Mh[a.code] || "fault", error: Oh(a.error) };
  } catch (a) {
    return s != null && s.aborted ? zt : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function Ch(e, t = void 0) {
  try {
    const n = await Be.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? zt : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? zt : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function Th(e) {
  return [...e.matchAll(Eh)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Bh({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Lh = {
  class: "allowance-prompt",
  role: "dialog"
}, Dh = { class: "allowance-prompt-text" }, Rh = { class: "allowance-prompt-buttons" }, Ih = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", Lh, [
      m("p", Dh, _(G(Bh)(e.request)), 1),
      m("div", Rh, [
        z(we, {
          kind: "primary",
          onClick: a[0] || (a[0] = (r) => n("answer", !0))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            ve("Allow", -1)
          ])]),
          _: 1
        }),
        z(we, {
          onClick: a[1] || (a[1] = (r) => n("answer", !1))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            ve("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, jh = /* @__PURE__ */ Y(Ih, [["__scopeId", "data-v-102dc765"]]), pn = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), K(qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: F(() => [
        ve(_(e.reason) + " ", 1),
        e.retry ? (l(), K(we, {
          key: 0,
          onClick: a[0] || (a[0] = (r) => n("retry"))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            ve("Retry", -1)
          ])]),
          _: 1
        })) : N("", !0),
        e.removable ? (l(), K(we, {
          key: 1,
          onClick: a[1] || (a[1] = (r) => n("remove"))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            ve("Remove tab", -1)
          ])]),
          _: 1
        })) : N("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Nh = ["data-window", "data-agent"], Ph = {
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
    const n = e, s = t, a = H(""), r = H(0);
    function i() {
      a.value = "", r.value++;
    }
    const o = Ah({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (p, $) => s("open", p, $)
    });
    hr(Qe, o), ke(() => n.visible, (p) => p && n.subscriptions.shown(n.name)), _e(() => {
      o.cancel(), n.subscriptions.stopAll(n.name);
    }), fr((p) => (a.value = p instanceof Error ? p.message : String(p), n.subscriptions.stopAll(n.name), !1));
    const c = () => Wn(n.component), h = () => {
      var p, $;
      return (($ = (p = n.prompts) == null ? void 0 : p.current.value) == null ? void 0 : $.window) === n.name ? n.prompts.current.value : null;
    };
    return (p, $) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      h() ? (l(), K(jh, {
        key: 0,
        request: h(),
        onAnswer: $[0] || ($[0] = (A) => e.prompts.answer(A))
      }, null, 8, ["request"])) : N("", !0),
      e.unavailableReason ? (l(), K(pn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), K(pn, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: i
      }, null, 8, ["name", "reason"])) : e.component ? (l(), K(c, { key: r.value })) : (l(), K(pn, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: $[1] || ($[1] = (A) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Nh));
  }
}, Pa = /* @__PURE__ */ Y(Ph, [["__scopeId", "data-v-590b4583"]]), qh = {
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
    const t = e, n = { render: () => Wn(yh, { src: t.entry.entry_url }) };
    return (s, a) => (l(), K(Pa, {
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
}, In = "journal.stale-build-reload", Wh = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Hh(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(In) === e.message) return !1;
    t.setItem(In, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Fh(e = window.sessionStorage) {
  try {
    e.removeItem(In);
  } catch {
    return;
  }
}
const Uh = ["data-window"], Vh = {
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
    const t = e, n = Yt(null), s = H("");
    return ke(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, Fh();
          } catch (r) {
            if (Wh(r) && Hh(r)) return;
            s.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (a, r) => !n.value && !s.value && !e.entry.unavailable_reason ? (l(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      z(xt, { shape: "cards" })
    ], 8, Uh)) : (l(), K(Pa, {
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
}, zh = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var o;
    const t = e, n = new _h(), s = ((o = dt(Qe, null)) == null ? void 0 : o.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, r = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), i = R(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, h) => i.value ? (l(), K(Vh, {
      key: 0,
      entry: r.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), K(qh, {
      key: 1,
      entry: r.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Kh = { class: "mark-more-inner" }, Gh = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Yh = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Jh = {
  key: 3,
  class: "mark-lines"
}, Zh = "process", Ts = "task", Qh = 2e3, Xh = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = dt(Qe), s = R(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = R(() => ja.has(t.mark.variant) && t.mark.detail || ""), r = R(() => t.mark.target_model === Ts ? t.mark.target_id : 0), i = H([]), o = H(!1), c = H(""), h = R(() => t.mark.target_model === Zh && !!t.mark.target_id);
    async function p() {
      const j = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      o.value = !0, c.value = j.ok ? "" : j.error, j.ok && (i.value = j.value.lines);
    }
    let $ = null;
    const A = () => clearInterval($);
    return ke(() => t.shown && h.value, (j) => {
      A(), j && (p(), t.mark.ended_at || ($ = setInterval(p, Qh)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (j) => j && t.shown && h.value && (A(), p())), _e(A), (j, W) => (l(), d("div", {
      class: ee(["mark-more", { open: e.shown }]),
      onClick: W[1] || (W[1] = Ee(() => {
      }, ["stop"]))
    }, [
      m("div", Kh, [
        e.declaration.body_url ? (l(), K(zh, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(Z, { key: 1 }, [
          a.value ? (l(), d(Z, { key: 0 }, [
            W[2] || (W[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Gh, _(a.value), 1)
          ], 64)) : N("", !0),
          h.value && c.value ? (l(), d("p", Yh, _(c.value), 1)) : h.value && o.value ? (l(), d(Z, { key: 2 }, [
            W[3] || (W[3] = m("p", { class: "mark-label" }, "Output", -1)),
            z(uh, {
              class: "mark-terminal",
              lines: i.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", Jh, _(s.value.join(`
`)), 1)) : N("", !0),
          r.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: W[0] || (W[0] = Ee((y) => G(ht)(`${Ts}:${r.value}`), ["stop"]))
          }, "Open task " + _(r.value) + " and its proofs", 1)) : N("", !0)
        ], 64))
      ])
    ], 2));
  }
}, qa = /* @__PURE__ */ Y(Xh, [["__scopeId", "data-v-51f69bf1"]]), e1 = (e) => `show-${e}`, F0 = (e, t, n) => e.filter((s) => {
  var a;
  return n(e1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), t1 = "messages.chat", n1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), Wa = (e, t, n) => jt(t1, n1(e, t), n), s1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, a1 = ["title", "aria-label", "onClick"], r1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, o1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => s1(t.buttons, t.allowedRuns)), s = H(""), a = dt(Qe);
    async function r(i) {
      const o = await Wa(i, t.mark, a.environment);
      s.value = o.ok ? "" : o.error;
    }
    return (i, o) => (l(), d(Z, null, [
      (l(!0), d(Z, null, ie(n.value, (c) => (l(), d("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: Ee((h) => r(c), ["stop"])
      }, [
        z(kt, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, a1))), 128)),
      s.value ? (l(), d("span", r1, _(s.value), 1)) : N("", !0)
    ], 64));
  }
}, i1 = /* @__PURE__ */ Y(o1, [["__scopeId", "data-v-00ea6707"]]);
function Ha(e, t) {
  const n = Yt(/* @__PURE__ */ new Map()), s = (r) => n.value = new Map(r.map((i) => [i.type, i])), a = async () => {
    try {
      return (await (await Be.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (r) => n.value.get(r) || null };
}
const Fa = Ha("/api/marks", "marks"), U0 = Fa.fetchAll, l1 = Fa.find, c1 = ["data-ref"], u1 = { class: "mark-row" }, d1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = e, s = R(() => l1(n.mark.type)), a = R(() => sh(n.mark, s.value)), r = R(() => {
      var o;
      return !!(n.mark.lines || n.mark.detail && ja.has(n.mark.variant) || t.has(n.mark.target_model) || (o = s.value) != null && o.body_url);
    }), i = H(!1);
    return (o, c) => {
      var h, p;
      return l(), d("div", {
        class: ee(["thread-turn", "card", { "full-width": (h = s.value) == null ? void 0 : h.full_width }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", u1, [
          z(Qd, ct({
            mark: a.value,
            open: r.value ? i.value : void 0
          }, pr(a.value.handlers), {
            onClick: c[0] || (c[0] = ($) => i.value = !i.value)
          }), gr({ _: 2 }, [
            r.value ? {
              name: "default",
              fn: F(({ shown: $ }) => [
                z(qa, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: $
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          z(i1, {
            buttons: (p = s.value) == null ? void 0 : p.buttons,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, c1);
    };
  }
}, V0 = /* @__PURE__ */ Y(d1, [["__scopeId", "data-v-a8e93858"]]);
function h1(e) {
  const t = H(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Re(() => n.observe(e.value)), Un(() => n.disconnect()), t;
}
const f1 = { class: "chat-dock-fold" }, p1 = ["aria-label"], g1 = { class: "chat-dock-head" }, m1 = { class: "chat-dock-inner" }, v1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = H(null), s = H(null), a = h1(s);
    return t({ card: n }), (r, i) => (l(), d("div", {
      class: ee(["chat-dock", { lifted: e.lifted }])
    }, [
      m("div", f1, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: ee(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          xe(r.$slots, "edge"),
          m("header", g1, [
            xe(r.$slots, "head")
          ]),
          m("div", {
            class: ee(["chat-dock-body", { folded: e.folded }])
          }, [
            m("div", m1, [
              m("div", {
                class: "chat-dock-grow",
                style: $e(G(a) === null ? null : { height: `${G(a)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  xe(r.$slots, "default")
                ], 512)
              ], 4)
            ])
          ], 2)
        ], 10, p1)
      ])
    ], 2));
  }
}, y1 = /* @__PURE__ */ Y(v1, [["__scopeId", "data-v-e27493a6"]]), w1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, gn = 5, k1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(gn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${gn}s`, animationDelay: `${(n - gn).toFixed(2)}s` };
    return (a, r) => (l(), d("span", w1, [
      m("i", { style: s })
    ]));
  }
}, b1 = /* @__PURE__ */ Y(k1, [["__scopeId", "data-v-d0c4b012"]]), Ua = Ha("/api/docks", "docks"), z0 = Ua.fetchAll, jn = Ua.find, x1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Bs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function $1(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [Bs("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...(n = t == null ? void 0 : t.reads) != null && n.length || en(e.target_model) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    Bs("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const _1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: x1(e, t),
  buttons: $1(e, t)
}), M1 = { class: "dock-title" }, S1 = ["aria-expanded", "title"], E1 = { class: "chat-dock-acts dock-acts" }, A1 = {
  key: 0,
  class: "dock-text"
}, O1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = R(() => jn(s.item.type)), r = H(null), i = R(() => _1(s.item, a.value)), o = dt(Qe), c = ($) => $.action === "open" ? ht(`${s.item.target_model}:${s.item.target_id}`) : Wa($, s.item, o.environment), h = R(() => i.value.buttons.filter(($) => $.action !== "undock")), p = R(() => i.value.buttons.find(($) => $.action === "undock"));
    return ($, A) => (l(), K(y1, {
      label: i.value.title,
      folded: e.folded
    }, {
      edge: F(() => [
        e.leaving ? (l(), K(b1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : N("", !0)
      ]),
      head: F(() => {
        var j, W, y;
        return [
          (j = a.value) != null && j.draws_head ? (l(), d("span", {
            key: 0,
            ref_key: "head",
            ref: r,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(Z, { key: 1 }, [
            z(je, {
              name: i.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            m("span", M1, _(i.value.title), 1)
          ], 64)),
          (W = a.value) != null && W.badge ? (l(), d("span", {
            key: 2,
            class: ee(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, _(a.value.badge), 3)) : N("", !0),
          (y = a.value) != null && y.draws_head ? N("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: A[0] || (A[0] = (b) => n("fold"))
          }, [
            z(Ra, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, S1)),
          m("span", E1, [
            (l(!0), d(Z, null, ie(h.value, (b) => (l(), K(we, {
              key: b.action + b.runs,
              small: "",
              bordered: "",
              "data-dock-action": b.action,
              onClick: (L) => c(b)
            }, {
              default: F(() => [
                ve(_(b.label), 1)
              ]),
              _: 2
            }, 1032, ["data-dock-action", "onClick"]))), 128))
          ]),
          z(aa, {
            title: p.value.label,
            "data-dock-action": "undock",
            onClick: A[1] || (A[1] = (b) => c(p.value))
          }, null, 8, ["title"])
        ];
      }),
      default: F(() => {
        var j, W;
        return [
          e.item.text && !((j = a.value) != null && j.body_url) ? (l(), d("p", A1, _(e.item.text), 1)) : N("", !0),
          (W = a.value) != null && W.body_url ? (l(), K(qa, {
            key: 1,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: r.value
          }, null, 8, ["declaration", "mark", "head"])) : N("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded"]));
  }
}, Ls = /* @__PURE__ */ Y(O1, [["__scopeId", "data-v-0554906e"]]), C1 = 24, T1 = 8, K0 = 420;
function G0({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= C1 && e > t ? !0 : e < t && a > T1 ? !1 : null;
}
const B1 = (e, t) => e === void 0 ? t : e, L1 = 6, D1 = 3, Ds = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Va = (e) => !!(e.leaves_at && !e.kept), R1 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Va(e) || t < e.leaves_at || n.has(e.id)), I1 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => R1(s, t, n)).sort((s, a) => s.id - a.id);
function j1(e, t, n = L1) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((r) => r.leaves_at && !r.kept && !(r.leaves_at > t)).slice(0, s).map((r) => r.id));
  return e.filter((r) => !a.has(r.id));
}
const N1 = (e, t) => e >= D1 ? !0 : e <= 1 ? !1 : t, P1 = ["onMouseenter", "onMouseleave"], q1 = ["onMouseenter", "onMouseleave"], Y0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = H(Date.now() / 1e3), s = H(/* @__PURE__ */ new Set()), a = H(!1), r = H(!1), i = setInterval(() => n.value = Date.now() / 1e3, 500);
    _e(() => clearInterval(i));
    const o = R(() => I1(t.items, n.value, s.value)), c = R(() => j1(o.value.filter((b) => Ds(b, jn)), n.value)), h = R(() => o.value.filter((b) => !c.value.includes(b) && !Ds(b, jn))), p = R(() => (a.value = N1(c.value.length, a.value)) && !r.value), $ = H({}), A = (b) => B1($.value[b.id], t.folded);
    function j(b) {
      $.value = { ...$.value, [b.id]: !A(b) };
    }
    function W(b) {
      s.value = /* @__PURE__ */ new Set([...s.value, b.id]);
    }
    function y(b) {
      s.value = new Set([...s.value].filter((L) => L !== b.id));
    }
    return (b, L) => (l(), d(Z, null, [
      (l(!0), d(Z, null, ie(h.value, (P) => (l(), d("div", {
        key: P.id,
        onMouseenter: (oe) => W(P),
        onMouseleave: (oe) => y(P)
      }, [
        z(Ls, {
          item: P,
          leaving: G(Va)(P) && !s.value.has(P.id),
          folded: A(P),
          onFold: (oe) => j(P)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, P1))), 128)),
      (l(!0), d(Z, null, ie(p.value ? [] : c.value, (P) => (l(), d("div", {
        key: P.id,
        onMouseenter: (oe) => W(P),
        onMouseleave: (oe) => y(P)
      }, [
        z(Ls, {
          item: P,
          folded: A(P),
          onFold: (oe) => j(P)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, q1))), 128)),
      p.value ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "dock-runs-row",
        title: "Show each run as its own card",
        onClick: L[0] || (L[0] = (P) => r.value = !0)
      }, _(c.value.length) + " runs", 1)) : N("", !0)
    ], 64));
  }
}, lt = {
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
  pogo: { frames: 54, fps: 12, draw: [0, 0.18], bounces: [0.18, 0.62], count: 3, bounce: 0.45, spring: [0.62, 0.82], release: [0.82, 0.86], handles: 0.2455 },
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
}, Nn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), W1 = (e) => e * e * (3 - 2 * e), Kt = (e, [t, n]) => W1(Nn(e, t, n)), H1 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ze = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Lt = ([e, t], n) => e + n() * (t - e);
function F1(e) {
  return H1.map(() => {
    const t = Lt(ze.speed, e), n = Lt(ze.angle, e) * Math.PI / 180, s = Lt(ze.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Lt(ze.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const U1 = F1(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function V1(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ze.gravity * (t[2] - ze.floor))) / ze.gravity;
}
function J0(e, t, n = U1) {
  const s = lt.rummage, a = (t - s.throws[e]) * s.frames / s.fps, r = n[e], i = V1(r, s.from), o = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= i + o) return null;
  const c = Math.min(a, i), h = s.from.map((p, $) => p + r.velocity[$] * c);
  return h[2] -= ze.gravity * c * c / 2, { at: h, turn: r.spin * c, landed: Math.max(0, a - i) / o };
}
function Z0(e, t) {
  const n = e.map((r) => Math.sqrt(r)), s = n.reduce((r, i) => r + i, 0);
  let a = Math.min(Math.max(t, 0), 1) * s;
  for (const [r, i] of n.entries()) {
    if (a <= i || r === n.length - 1) {
      const o = i > 0 ? Math.min(a / i, 1) : 1;
      return { index: r, s: o, height: e[r] * 4 * o * (1 - o) };
    }
    a -= i;
  }
  return { index: 0, s: 1, height: 0 };
}
const Q0 = () => Array.from({ length: lt.pogo.count }, (e, t) => lt.pogo.bounce * (t + 1) / lt.pogo.count), X0 = { stride: 0.5 };
function za(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: Nn(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: Nn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function eg(e) {
  const { into: t, out: n } = za(lt.rope_swing, e);
  return 1 - Kt(t, [0, 1]) * (1 - Kt(n, [0, 1]));
}
function tg(e) {
  const t = lt.rope_swing, { into: n, out: s } = za(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Kt(n, [0, 1]) * (1 - Kt(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const z1 = 10, K1 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, G1 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Y1 = { weight: 19 }, J1 = {
  build: { cooldown: 180 }
}, Z1 = { every: 120 }, Ka = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Ga = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Q1 = {
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
}, St = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: z1 }), J = (e, t, n = {}) => St(e, "clip", t, n), mn = (e, t, n = {}) => St(e, "look", t, n), Rs = (e, t, n = {}) => St(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...St(e, "pick", t, n), ...s }), fe = (e) => St("nothing", "nothing", e, {}), X1 = 120, ef = 300, vn = (e, t) => ({ ...J(e, t), cooldown: ef }), tf = 120, Q = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), nf = () => [J("joy", 2)], Ye = (e, t, n, s, a = {}) => ({ ...J(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), Je = (e) => ({ ...e, cooldown: K1[e.name] }), mt = (e) => ({ ...e, shenanigan: !0, lasts: G1[e.name] }), sf = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...Q("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [J("nod", 2), fe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...Q("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...Je(J("bug_shot", 3)), toward: "", onto: !1 },
    { ...Je(J("bug_smash", 2)), toward: "", onto: !1 },
    J("nod", 2)
  ]),
  ...Q("tests_failed", { cooldown: 20, toward: "card" }, [J("startled", 2), J("dismay", 1), J("tantrum", 3), fe(1)]),
  ...Q("committed", { cooldown: 30, toward: "card", onto: !0 }, [J("nod", 2), fe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...Q("sin_fixed", { cooldown: 300 }, [J("halo", 1), fe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...Q("sin_committed", { cooldown: 300 }, [J("repent", 1), fe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...Q("messaged", { cooldown: tf }, [J("phone_call", 1)]),
  ...Q("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [J("nod", 4), J("hand_rub", 4), fe(7)]),
  ...Q("question_asked", { cooldown: 60 }, [J("ask_sign", 9), J("look_up", 3), fe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...Q("reported", { cooldown: 90 }, [Rs("read", 3), J("nod", 1), fe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...Q("read_message", { cooldown: 30 }, [Rs("read", 3), fe(1)]),
  ...Q("fact_filed", { cooldown: 120 }, [J("file_card", 3), J("nod", 1), fe(6)]),
  ...Q("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [J("nod", 2), fe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...Q("bar_done", { holds: !0 }, nf()),
  ...Q("bar_failed", { holds: !0 }, [J("fume", 1), J("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...Q("standing", { cooldown: 12 }, [J("look_left", 2), J("look_right", 2), J("look_up", 1), fe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...Q("launched", { cooldown: 300 }, [J("tumble", 3), fe(47)]),
  // a break from the hammering now and then
  ...Q("building", { cooldown: 30 }, [J("wipe_brow", 4), J("look_left", 1), J("look_right", 1), fe(69)]),
  ...Q("failed", { cooldown: 20, toward: "card" }, [J("shake", 3), J("tantrum", 2), fe(2)]),
  ...Q("refused", { cooldown: 20 }, [J("shake", 1), fe(1)]),
  ...Q("work_done", { cooldown: 120 }, [J("stretch", 2), fe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...Q("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...Q("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...Q("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...Q("answered", { cooldown: 15 }, [mn("amused", 3), fe(2)]),
  ...Q("heard", { cooldown: 30 }, [
    J("bow", 1, { voices: ["butler"] }),
    J("salute", 1, { voices: ["squire"] }),
    J("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    fe(1)
  ]),
  ...Q("long_walk", { cooldown: 90 }, [J("stumble", 3), fe(22)]),
  ...Q("card_arrived", { cooldown: 20, toward: "card" }, [J("glance", 7), fe(13)]),
  ...Q("typing", { cooldown: 60 }, [mn("reading", 1), fe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Q1).flatMap(([e, t]) => Q(`reacted:${e}`, {}, [mn(t, 1)])),
  ...Object.entries(Ka).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => Q(`agent_reacted:${n}`, {}, [J(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Ga).flatMap(([e, t]) => Q(`agent_reacted:${e}`, {}, [J(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...Q("pastime", {}, [
    Ye("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    Ye("rest", 3, 180, 120),
    Ye("yawn", 2, 60, 60),
    Ye("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    Ye("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    Ye("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    Ye("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...mt(Je(J("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    mt(Je(J("disco", 2, { ball: "bubble" }))),
    fe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...Q("held:search", { cooldown: X1 }, [vn("search", 3), { ...vn("binoculars", 2), when: { home: !0 } }, { ...vn("glass_bubble", 2), when: { bubble: !0 } }]),
  ...Q("held:type", {}, [J("type", 3), J("type_ponder", 1)]),
  ...Q("held:watch", {}, [J("watch", 2), J("wave_up", 1)]),
  ...Q("held:compacting", {}, [J("pack_box", 3), J("vacuum", 2), J("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...Q("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), fe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...Q("tickled", {}, [{ ...Je(J("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...Q("eager", {}, [J("eager", 2, { slow: !0 }), fe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...Q("jump", {}, [mt(Je(J("backflip", 7, { high: !0 }))), J("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...Q("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...Q("unit", { cooldown: J1.build.cooldown }, [ce("unit", Y1.weight), fe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...Q("progress_jump", { cooldown: 6 }, [J("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...Q("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...Q("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...Q("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: Z1.every }, ce("stand", 5)]),
  // a digit a blow's dust lets out
  ...Q("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...Q("roam", {}, [
    ce("rest", 35, {}, { stay: [25, 60] }),
    ce("seat", 15, {}, { stay: [15, 40] }),
    ce("edge", 25, {}, { stay: [8, 20] }),
    mt(ce("bubble", 15, {}, { stay: [30, 80] })),
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
    mt(Je(ce("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...Q("laptop", {}, [ce("seat", 6, {}, { stay: [60, 150] }), ce("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...Q("ledge_at", {}, [ce("middle", 2, {}, { along: 1 / 2 }), ce("third", 1, {}, { along: 1 / 3 }), ce("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...Q("composed_as", {}, [
    ce("facing", 4, {}, { turn: 0, leans: 0 }),
    ce("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ce("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ce("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ce("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Is = {
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
}, af = {
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
}, rf = 120, of = (e) => Is[e] || Is.idle;
[.../* @__PURE__ */ new Set([...Object.values(Ka).flatMap((e) => Object.keys(e)), ...Object.keys(Ga)])];
const js = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, ng = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, sg = { width: 24, height: 27, top: 3, units: 2 }, ag = { amber: [1, 0.69, 0.125], good: js.colours.good, bad: js.colours.bad }, yn = { phases: 4, dim: 0.25 }, rg = (e, t, n) => e !== "amber" || (t + n) % yn.phases < yn.phases / 2 ? 1 : yn.dim, lf = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(sf.filter((e) => lf.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const og = {
  width: 84,
  belly: 13,
  blink: 4
}, Ns = "[data-figure-home]", sn = () => {
  var t;
  const e = document.querySelector(Ns);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ns)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, cf = "[data-figure-docked-bars]", uf = "[data-figure-chat-foot]", wn = 0.26, df = 0.54, hf = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: wn, travels: "stand" },
  lounge: { drop: wn, travels: "stand" },
  composed: { drop: wn, travels: "stand" },
  hang: { drop: df, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, ff = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), ig = 0.25, lg = (e, t) => ff.has(e) && hf[t].drop === 0;
function pf() {
  var t;
  const e = (t = sn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const cg = (e) => ((e + 180) % 360 + 360) % 360 - 180, ug = { turns: [-20, -10, 0, 10, 20] };
function gf() {
  var s;
  const e = sn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(cf);
  if (!t) return { ...Ya(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Ya() {
  const e = sn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const mf = "[data-figure-bubble]", vf = 250;
let vt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ja = 0;
const yf = () => vt, kn = /* @__PURE__ */ new WeakMap();
let wf = 0;
function Za(e) {
  return kn.has(e) || kn.set(e, `floor-${++wf}`), kn.get(e);
}
const kf = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, bf = () => {
  var e, t;
  return ((t = (e = sn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function xf(e, t) {
  var s;
  const n = (s = e.querySelector(uf)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function $f(e, t) {
  const n = e && xf(e, t), s = e ? [...e.querySelectorAll(mf)].map((r) => ({ element: r, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((r) => ({ element: r, kind: "tab" }));
  return [...s, ...a].map(({ element: r, kind: i }) => ({ element: r, kind: i, box: r.getBoundingClientRect() })).filter(({ kind: r, box: i }) => i.width > 0 && i.height > 0 && (r !== "bubble" || kf(i, n))).map(({ element: r, kind: i, box: o }) => ({ id: Za(r), kind: i, element: r, left: o.left, right: o.right, top: o.top, bottom: o.bottom }));
}
const _f = (e, t, n) => {
  const s = e.floors.find((r) => r.id === t.id), a = n - e.at;
  return s && a > 0 && a <= vf ? (t.top - s.top) / a * 1e3 : 0;
};
function Mf(e = vt, t = performance.now()) {
  const n = pf(), s = bf(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: r, docked: i, edge: o } = gf(), c = [];
  r && c.push({ id: "home", kind: i ? "dock" : "compose", element: r, left: o.left, right: o.left + o.width, top: o.top });
  const h = Ya();
  return h.element && c.push({ id: Za(h.element), kind: "build", element: h.element, left: h.edge.left, right: h.edge.left + h.edge.width, top: h.edge.top }), c.push(...$f(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((p) => Object.freeze({ ...p, vy: _f(e, p, t) }))) });
}
const Pn = /* @__PURE__ */ new Set();
function Sf(e) {
  return Pn.add(e), () => Pn.delete(e);
}
function Ef() {
  Qa();
  const e = () => {
    Ja = requestAnimationFrame(e), !document.hidden && (vt = Mf(vt), Pn.forEach((t) => t(vt)));
  };
  e();
}
function Qa() {
  cancelAnimationFrame(Ja);
}
const Af = ["data-kind"], Of = { class: "figure-floor-name" }, Cf = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", Of, _(e.floor.kind), 1)
    ], 12, Af));
  }
}, Tf = /* @__PURE__ */ Y(Cf, [["__scopeId", "data-v-8f6132da"]]), Bf = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Lf = {
  __name: "FigureFloors",
  setup(e) {
    const t = Yt(yf().floors);
    let n = () => {
    };
    return Re(() => {
      n = Sf((s) => t.value = s.floors), Ef();
    }), _e(() => {
      n(), Qa();
    }), (s, a) => (l(), d("div", Bf, [
      (l(!0), d(Z, null, ie(t.value, (r) => (l(), K(Tf, {
        key: r.id,
        floor: r
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, dg = /* @__PURE__ */ Y(Lf, [["__scopeId", "data-v-e519168b"]]), Te = { close: 60, open: 90, shut: 0.06, every: [2500, 6e3] };
function Df(e) {
  if (e < 0 || e >= Te.close + Te.open) return 1;
  const t = e < Te.close ? e / Te.close : 1 - (e - Te.close) / Te.open;
  return 1 + (Te.shut - 1) * t;
}
const Ps = (e) => Te.every[0] + e() * (Te.every[1] - Te.every[0]), Rf = "voice-figures", Xa = (e) => new URL(e).pathname.split("/").pop(), If = (e, t) => Xa(e).startsWith(`${t}.`);
async function jf(e) {
  const t = await re.voiceFigures(), n = re.voiceFigureUrl(t[e]);
  if (typeof caches > "u") return (await qs(n, e)).arrayBuffer();
  const s = await caches.open(Rf), a = await s.match(n);
  if (a) return a.arrayBuffer();
  const r = await qs(n, e);
  await s.put(n, r.clone());
  const i = (await s.keys()).filter((o) => If(o.url, e) && Xa(o.url) !== t[e]);
  return await Promise.all(i.map((o) => s.delete(o))), r.arrayBuffer();
}
async function qs(e, t) {
  const n = await Be.raw(e);
  if (!n.ok) throw new Error(`The ${t} figure did not load: ${n.status}`);
  return n;
}
async function Nf(e) {
  const [{ figureOf: t }, n] = await Promise.all([import("./figure-D-GLwyja.js").then((s) => s.f), jf(e)]);
  return t(n, e, re.figureDecoderUrl());
}
function Pf(e, t, n) {
  const s = e.trim().split(/\s+/)[0] ?? "";
  return s ? af[s] ?? "running" : t && n - t >= rf ? "asleep" : "idle";
}
const qf = (e, t, n) => of(Pf(e, t, n)), Wf = ["data-voice", "data-failure"], Ws = 112, Hf = {
  __name: "VoiceFigure",
  props: { voice: { type: String, required: !0 }, running: { type: String, default: "" }, heardAt: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = H(null), s = H("");
    let a = null, r = [], i = null, o = performance.now() + Ps(Math.random), c = performance.now(), h = "";
    const p = (W) => r.find((y) => y.name === W) ?? r.find((y) => y.name === "idle");
    function $() {
      if (!a) return;
      const W = p(qf(t.running, t.heardAt, Date.now() / 1e3));
      W.name !== h && (h = W.name, c = performance.now());
      const y = performance.now(), b = Math.floor((y - c) / 1e3 * W.fps) % W.frames, L = Df(y - o);
      y - o > Te.close + Te.open && (o = y + Ps(Math.random)), a.show(W, b, 0, { posture: "stand", open: L });
    }
    async function A() {
      try {
        const [W, { FigurePlayer: y }, { CLIPS: b }] = await Promise.all([Nf(t.voice), import("./player-S5D5wlIB.js"), import("./figure-D-GLwyja.js").then((L) => L.f)]);
        r = b, a = new y(W, n.value), i = setInterval($, 1e3 / 12), $();
      } catch (W) {
        s.value = String(W.message ?? W);
      }
    }
    function j() {
      clearInterval(i), i = null, a = null;
    }
    return Re(A), _e(j), ke(() => t.voice, () => {
      j(), A();
    }), (W, y) => (l(), d("canvas", {
      ref_key: "canvas",
      ref: n,
      class: "voice-figure",
      "data-figure-canvas": "",
      "data-voice": e.voice,
      "data-failure": s.value || void 0,
      width: Ws,
      height: Ws,
      "aria-hidden": "true"
    }, null, 8, Wf));
  }
}, hg = /* @__PURE__ */ Y(Hf, [["__scopeId", "data-v-5d12c6dc"]]), bn = (e) => typeof e == "number" ? e : Date.parse(e);
function fg(e, t) {
  const n = (a, r) => ({ kind: a, id: `${a}:${r.id}`, row: r, time: bn(r.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, r) => bn(a.row.created_at) - bn(r.row.created_at) || (a.kind === r.kind ? a.row.id - r.row.id : a.kind === "message" ? -1 : 1));
}
const Ff = 2e3;
function pg(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, Ff);
  };
  Re(async () => {
    await e(), s();
  }), Un(() => clearTimeout(n));
}
const Hs = "newest";
function gg(e, { title: t, isOpen: n = null }) {
  const s = H(""), a = H(Hs), r = H("all"), i = R(() => {
    const o = s.value.trim().toLowerCase(), c = e.value.filter((h) => (!o || JSON.stringify(h).toLowerCase().includes(o)) && (r.value === "all" || !n || n(h) === (r.value === "open")));
    return a.value === Hs ? c : [...c].sort((h, p) => t(h).localeCompare(t(p)));
  });
  return { words: s, order: a, state: r, shown: i, hasStates: !!n };
}
const Uf = {
  class: "list-tools",
  "data-list-tools": ""
}, Vf = {
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
    return (s, a) => (l(), d("div", Uf, [
      z(bd, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (r) => e.tools.words.value = r),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      z(Rn, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (r) => e.tools.order.value = r)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (l(), K(Rn, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (r) => e.tools.state.value = r)
      }, null, 8, ["value"])) : N("", !0)
    ]));
  }
}, mg = /* @__PURE__ */ Y(Vf, [["__scopeId", "data-v-b2dd0a0d"]]);
function vg() {
  const e = H(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const zf = 86400, qn = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Kf(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), r = Math.round((qn(t) - qn(e)) / zf);
  return r === 0 ? `Today, ${a}` : r === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function yg(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const r = qn(a.time);
    r !== s && (s = r, n.push({ id: `day:${r}`, key: `day:${r}`, kind: "day", who: "", time: a.time, title: Kf(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const xn = 280, $n = 240, _n = 120, Gf = 6, Yf = 14, bt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Jf(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, r) {
  if (!t || !n()) return r();
  const i = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Yf}px)` }), e.offsetHeight, e.style.transition = `height ${xn}ms ${bt}`, e.style.height = `${i}px`;
  const o = a();
  let c = !1;
  const h = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const p = a() - o;
    if (!c && p >= xn && (c = !0, e.style.transition = `opacity ${$n}ms ease-out, transform ${$n}ms ${bt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < xn + $n) return s(h);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), r();
  };
  s(h);
}
function wg(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, r) {
  if (!t || !n()) return r();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Gf}px)` }), e.offsetHeight, e.style.transition = `opacity ${_n}ms ease-out, transform ${_n}ms ${bt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const i = a(), o = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - i < _n) return s(o);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), r();
  };
  s(o);
}
const Zf = 140, Dt = 220, Qf = 5;
function kg({ gap: e = Zf, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (o) => {
    o.done(), t(r, e);
  };
  function r() {
    const o = n.splice(0, Qf);
    if (s = o.length > 0, !s) return;
    let c = o.length;
    for (const h of o)
      h.el.style.display = h.display, h.arrival(h.el, h.options, () => {
        h.done(), c -= 1, c || t(r, e);
      });
  }
  const i = (o, c, h, p = Jf) => {
    if (!c.pane || !c.follows()) return h();
    const $ = { el: o, options: c, done: h, arrival: p, display: o.style.display || "" };
    if (!s)
      return s = !0, p(o, c, () => a($));
    o.style.display = "none", n.push($);
  };
  return i.flush = () => {
    for (const o of n.splice(0))
      o.el.style.display = o.display, o.done();
  }, i;
}
function bg(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Dt}ms ${bt}, opacity ${Dt}ms ease-in, margin ${Dt}ms ${bt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Dt);
}
const er = "chat.pins.minimised", Nt = H(yt(er, !1));
function Fs(e) {
  Nt.value = e, Jt(er, e);
}
function Xf(e) {
  const t = R(() => e()), n = R(() => Nt.value ? [] : e()), s = () => Fs(!Nt.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((r) => ia(r) > a).length,
    (r, i) => r > i && Fs(!1)
  ), { pins: t, visible: n, minimised: Nt, toggle: s };
}
const ep = ["title"], tp = {
  key: 0,
  class: "pins-count"
}, np = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Xf(() => t.notices);
    return (r, i) => G(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: ee(["pins-toggle", { minimised: G(s), inline: e.inline }]),
      title: G(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: i[0] || (i[0] = Ee((...o) => G(a) && G(a)(...o), ["stop"]))
    }, [
      z(je, {
        name: G(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      G(s) ? (l(), d("span", tp, _(G(n).length), 1)) : N("", !0)
    ], 10, ep)) : N("", !0);
  }
}, xg = /* @__PURE__ */ Y(np, [["__scopeId", "data-v-c0d11526"]]), sp = ["title"], ap = ["title"], rp = { class: "diff-card-dir" }, op = { class: "diff-card-name" }, ip = { class: "diff-card-ago" }, lp = ["title"], cp = ["title"], up = {
  key: 0,
  class: "diff-card-note"
}, dp = ["href"], hp = ["src", "alt"], fp = { class: "diff-card-rows" }, pp = { class: "diff-row-num" }, gp = { class: "diff-row-sign" }, mp = { class: "diff-row-code" }, vp = {
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
    function r(v) {
      (v.metaKey || v.ctrlKey) && (v.stopPropagation(), s("open", n.path));
    }
    const i = { new: "created", deleted: "deleted" }, o = { add: "+", del: "−" }, c = R(() => n.path.lastIndexOf("/") + 1), h = R(() => n.path.slice(0, c.value)), p = R(() => n.path.slice(c.value)), $ = R(() => n.kind === "deleted"), A = R(() => i[n.kind]), j = R(() => new Set(n.rows.filter((v) => v.line_type === "add").map((v) => v.line))), W = H("after"), y = R(() => W.value === "before" ? n.whole.old : n.whole.text), b = R(() => n.whole && n.whole.text !== void 0 ? y.value.split(`
`).map((v, g) => ({ line_type: W.value === "after" && j.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: v })) : n.rows.filter(
      (v) => !(n.editsOnly && ["ctx", "fold"].includes(v.line_type)) && !(n.hideRemovals && v.line_type === "del")
    )), L = H(!1), P = R(() => n.lines && !L.value && !n.whole), oe = R(() => P.value ? b.value.slice(0, n.lines) : b.value), q = R(() => b.value.length - oe.value.length), x = (v) => v.line === null || v.line_type === "del" ? "" : v.line, O = (v) => v.line_type === "fold" ? v.hidden ? `⋯ ${v.hidden} lines` : "⋯" : v.text, f = H(null), T = H(null);
    let w = null;
    return Re(() => {
      if (!T.value) return;
      let v = !0;
      w = new ResizeObserver(() => {
        !f.value || !T.value || (f.value.style.transition = v ? "none" : "", f.value.style.height = `${T.value.offsetHeight}px`, v = !1);
      }), w.observe(T.value);
    }), _e(() => w && w.disconnect()), (v, g) => (l(), d("section", {
      class: ee(["diff-card", { half: e.half, gone: $.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: $.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: g[2] || (g[2] = (u) => !$.value && s("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${G(a)}-click to open it`,
          onClick: r
        }, [
          m("span", rp, _(h.value), 1),
          m("span", op, _(p.value), 1),
          A.value ? (l(), d("span", {
            key: 0,
            class: ee(["diff-card-badge", e.kind])
          }, _(A.value), 3)) : N("", !0)
        ], 8, ap),
        m("span", {
          class: ee(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + _(e.added), 3),
        m("span", {
          class: ee(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + _(e.removed), 3),
        m("span", ip, _(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: W.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[0] || (g[0] = Ee((u) => W.value = W.value === "after" ? "before" : "after", ["stop"]))
        }, _(W.value === "after" ? "After" : "Before"), 9, lp)) : N("", !0),
        $.value ? N("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: ee(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[1] || (g[1] = Ee((u) => s("whole"), ["stop"]))
        }, [
          z(je, {
            name: "file",
            size: 12
          })
        ], 10, cp))
      ], 8, sp),
      e.whole && e.whole.error ? (l(), d("p", up, _(e.whole.error), 1)) : N("", !0),
      !$.value && !e.folded ? (l(), d(Z, { key: 1 }, [
        e.picture ? (l(), d("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          m("img", {
            src: e.picture,
            alt: p.value,
            loading: "lazy"
          }, null, 8, hp)
        ], 8, dp)) : (l(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: f,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: T,
            class: "diff-card-diff"
          }, [
            m("div", fp, [
              (l(!0), d(Z, null, ie(oe.value, (u, M) => (l(), d("div", {
                key: M,
                class: ee(["diff-row", u.line_type, { fresh: e.fresh && u.edit === e.fresh }])
              }, [
                m("span", pp, _(x(u)), 1),
                m("span", gp, _(o[u.line_type]), 1),
                m("span", mp, _(O(u)), 1)
              ], 2))), 128)),
              q.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[3] || (g[3] = Ee((u) => L.value = !0, ["stop"]))
              }, _(q.value) + " more " + _(q.value === 1 ? "line" : "lines"), 1)) : N("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : N("", !0)
    ], 2));
  }
}, $g = /* @__PURE__ */ Y(vp, [["__scopeId", "data-v-b6424f6e"]]), yp = {
  key: 0,
  class: "menu-item-text"
}, wp = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.description ? (l(), d("span", yp, [
        m("span", null, [
          xe(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, _(e.description), 1)
      ])) : xe(t.$slots, "default", {}, void 0, !0, 1)
    ], 2));
  }
}, kp = /* @__PURE__ */ Y(wp, [["__scopeId", "data-v-5b5c4fd9"]]), bp = {}, xp = { class: "menu-label" };
function $p(e, t) {
  return l(), d("span", xp, [
    xe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const _p = /* @__PURE__ */ Y(bp, [["render", $p], ["__scopeId", "data-v-aa955b3e"]]), tr = /* @__PURE__ */ new WeakMap(), Mp = (e, t) => tr.set(e, t);
function Sp(e, t) {
  for (let n = t; n; n = tr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ep(e, t) {
  const n = (s) => {
    var r, i;
    const a = ((r = e.value) == null ? void 0 : r.element) || ((i = e.value) == null ? void 0 : i.$el) || e.value;
    a && !Sp(a, s.target) && t(s);
  };
  window.addEventListener("click", n), _e(() => window.removeEventListener("click", n));
}
const st = 8, Ap = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = H(null), r = (u) => u ? `${u}px` : void 0, i = R(() => ({
      minWidth: r(s.minWidth),
      maxWidth: r(s.maxWidth),
      maxHeight: r(s.maxHeight),
      height: r(s.height)
    })), o = H({ w: 0, h: 0 }), c = H(s.anchor ? s.anchor.getBoundingClientRect() : null), h = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), p = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), $ = (u) => {
      const M = u.closest(".pane, .float-window");
      return M ? p(M.getBoundingClientRect()) : h();
    }, A = (u, M) => `${Math.max(0, u ? Math.min(u, M) : M)}px`;
    function j(u, M) {
      return {
        below: u.bottom - M.bottom - s.gap - st,
        above: M.top - u.top - s.gap - st,
        across: u.right - u.left - 2 * st
      };
    }
    function W(u) {
      const M = $(s.anchor), S = j(M, u);
      return o.value.w <= S.across && o.value.h <= Math.max(S.below, S.above) ? M : h();
    }
    const y = R(() => {
      if (!c.value) return i.value;
      const u = c.value, M = W(u), S = j(M, u), { w: I, h: se } = o.value, ae = s.align === "auto" ? u.left + u.right > M.left + M.right : s.align === "right", de = Io(ae ? u.right - I : u.left, M.left + st, Math.max(M.left + st, M.right - I - st)), pe = se > S.below && S.above > S.below ? { bottom: `${window.innerHeight - u.top + s.gap}px`, maxHeight: A(s.maxHeight, S.above) } : { top: `${u.bottom + s.gap}px`, maxHeight: A(s.maxHeight, S.below) };
      return { ...i.value, ...pe, left: `${de}px`, maxWidth: A(s.maxWidth, S.across) };
    }), b = n, L = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function P(u) {
      const M = L(), S = M.indexOf(document.activeElement);
      M[(S + u + M.length) % M.length].focus();
    }
    const oe = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => b("close") }, q = (u) => oe[u.key] && (u.preventDefault(), oe[u.key]()), x = () => a.value && (o.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let O = 0;
    const f = new ResizeObserver(() => {
      cancelAnimationFrame(O), O = requestAnimationFrame(x);
    });
    Ep(a, (u) => s.anchor && !s.anchor.contains(u.target) && b("close"));
    const T = (u, M) => ["top", "left", "right", "bottom"].some((S) => Math.abs(u[S] - M[S]) > 1), w = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let v = 0;
    function g() {
      if (s.anchor) {
        const u = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || w(u)) return b("close");
        T(u, c.value) && (c.value = u);
      }
      v = requestAnimationFrame(g);
    }
    return Re(() => {
      s.anchor && a.value && Mp(a.value, s.anchor), x(), a.value && f.observe(a.value), !s.plain && L()[0] && L()[0].focus(), g();
    }), _e(() => {
      f.disconnect(), cancelAnimationFrame(v), cancelAnimationFrame(O);
    }), t({ element: a }), (u, M) => (l(), K(Ks, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", ct({
        ref_key: "panel",
        ref: a
      }, u.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: y.value,
        onKeydown: q
      }), [
        xe(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Op = /* @__PURE__ */ Y(Ap, [["__scopeId", "data-v-3d203970"]]), Cp = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), K(we, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (r) => n("back"))
    }, {
      default: F(() => [
        z(je, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Tp = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, Bp = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?" }, We],
  started: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?" }, We],
  testing: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Lp = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Dp = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], Rp = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Ip = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], jp = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], Np = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? jp(t) : e === "agent" ? [...Rp(t), ...Dp(t)] : e === "check" ? Ip(t) : e === "question" ? Lp(t) : ((n = { plan: Tp, task: Bp }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, Pp = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, qp = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Wp = { class: "ask-text" }, Hp = ["placeholder", "aria-label"], Fp = {
  key: 3,
  class: "moves"
}, Up = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, r = R(() => Np(s.kind, s.row)), i = H(""), o = H(null), c = H("");
    ke(() => s.id, () => {
      i.value = "", o.value = null;
    });
    async function h(A, j = "") {
      const W = await s.read([A.noun ?? s.kind, A.word, String(s.id), ...A.flag ? [A.flag, j] : A.positional ? [j] : []]);
      i.value = W.ok ? "" : W.error, W.ok && (o.value = null, c.value = "", a("done"));
    }
    const p = (A) => A.confirm ? o.value = A : A.said ? h(A, A.said) : A.flag || A.positional ? (o.value = A, c.value = "") : h(A), $ = () => c.value.trim() && h(o.value, c.value.trim());
    return t({ moves: r, press: p }), (A, j) => {
      var W;
      return r.value.length ? (l(), d("footer", {
        key: 0,
        class: ee(["foot", { inline: e.inline }])
      }, [
        i.value ? (l(), d("p", Pp, _(i.value), 1)) : N("", !0),
        (W = o.value) != null && W.confirm ? (l(), d("div", qp, [
          m("span", Wp, _(o.value.confirm), 1),
          z(we, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: j[0] || (j[0] = (y) => h(o.value))
          }, {
            default: F(() => [
              ve(_(o.value.label), 1)
            ]),
            _: 1
          }),
          z(we, {
            small: "",
            kind: "ghost",
            onClick: j[1] || (j[1] = (y) => o.value = null)
          }, {
            default: F(() => [...j[5] || (j[5] = [
              ve("Back", -1)
            ])]),
            _: 1
          })
        ])) : o.value ? (l(), d("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: Ee($, ["prevent"])
        }, [
          Pt(m("input", {
            "onUpdate:modelValue": j[2] || (j[2] = (y) => c.value = y),
            class: "ask-input",
            placeholder: o.value.ask,
            "aria-label": o.value.ask,
            onKeydown: j[3] || (j[3] = mr(Ee((y) => o.value = null, ["stop"]), ["esc"]))
          }, null, 40, Hp), [
            [vr, c.value]
          ]),
          z(we, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: F(() => [
              ve(_(o.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          z(we, {
            small: "",
            kind: "ghost",
            onClick: j[4] || (j[4] = (y) => o.value = null)
          }, {
            default: F(() => [...j[6] || (j[6] = [
              ve("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", Fp, [
          (l(!0), d(Z, null, ie(r.value, (y) => (l(), K(we, {
            key: y.word,
            small: "",
            kind: y.main ? "primary" : "ghost",
            "data-move": y.word,
            onClick: (b) => p(y)
          }, {
            default: F(() => [
              ve(_(y.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : N("", !0);
    };
  }
}, Vp = /* @__PURE__ */ Y(Up, [["__scopeId", "data-v-14c7da8d"]]), zp = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, Kp = { ...zp, done: "Completed" }, Gp = { class: "task-status-icon" }, Yp = ["width", "height", "aria-label"], Jp = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", Gp, [
      z(Gt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: F(() => [
          (l(), d("svg", {
            key: e.status,
            class: ee(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": G(Kp)[e.status]
          }, [
            z(Vn, { value: e.status }, {
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
          ], 10, Yp))
        ]),
        _: 1
      })
    ]));
  }
}, Us = /* @__PURE__ */ Y(Jp, [["__scopeId", "data-v-2ab7e404"]]), Zp = { class: "top" }, Qp = {
  class: "crumb",
  "data-task-crumb": ""
}, Xp = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, e0 = {
  key: 1,
  class: "body"
}, t0 = { class: "stamp" }, n0 = {
  class: "title",
  "data-resource-title": ""
}, s0 = { class: "since" }, a0 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, r0 = { class: "text" }, o0 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, i0 = { class: "text" }, l0 = { class: "facts" }, c0 = { class: "fact wide" }, u0 = { class: "fact-value" }, d0 = {
  key: 0,
  class: "fact"
}, h0 = { class: "fact-value" }, f0 = {
  key: 1,
  class: "fact"
}, p0 = { class: "fact-value" }, g0 = {
  key: 2,
  class: "fact wide"
}, m0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, v0 = {
  key: 2,
  class: "part",
  "data-resource-waits": ""
}, y0 = ["onClick"], w0 = { class: "wait-id" }, k0 = { class: "wait-title" }, b0 = {
  key: 3,
  class: "part",
  "data-task-outcome": ""
}, x0 = { class: "text" }, $0 = {
  key: 4,
  class: "part",
  "data-task-brief": ""
}, _0 = {
  key: 5,
  class: "part",
  "data-resource-logs": ""
}, M0 = 180, S0 = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back"],
  setup(e, { expose: t, emit: n }) {
    const s = [
      { key: "low", label: "Low" },
      { key: "normal", label: "Normal" },
      { key: "high", label: "High" }
    ], a = /* @__PURE__ */ new Set(["completed", "cancelled"]), r = e, i = n, o = H(null), c = H(null), h = H(""), p = H(""), $ = H(!1), A = H(null), j = H(null);
    let W = 0;
    const y = (O) => a.has(O) ? "done" : O, b = (O) => O.slice(0, 1).toUpperCase() + O.slice(1), L = R(() => {
      var O;
      return (O = c.value) != null && O.plan_id ? c.value.phase_total > 1 ? `Plan ${c.value.plan_id} › Phase ${c.value.phase_number}: ${c.value.phase_title}` : `Plan ${c.value.plan_id}: ${c.value.plan_title}` : "Not in a plan";
    });
    async function P() {
      const O = ++W, [f, T] = await Promise.all([r.read(["task", "inspect", String(r.id)]), r.read(["plan", "place", String(r.id)])]);
      O === W && (h.value = f.ok ? "" : f.error, o.value = f.ok ? f.value : null, c.value = T.ok ? T.value : null);
    }
    ke(() => r.id, () => {
      o.value = null, c.value = null, $.value = !1, A.value = null, P();
    }, { immediate: !0 }), ke(() => r.changes, P);
    async function oe(O) {
      const f = await r.read(["task", "edit", String(r.id), "--priority", O]);
      if (p.value = f.ok ? "" : f.error, f.ok) return P();
    }
    function q(O) {
      A.value = null, j.value.press(O);
    }
    const x = (O) => {
      var f;
      return ((f = j.value) == null ? void 0 : f.moves.length) && (A.value = O);
    };
    return t({ openStatus: x }), (O, f) => {
      var T, w;
      return l(), d("aside", {
        class: ee(["task-inspector", { lone: e.lone }]),
        "data-task-inspector": ""
      }, [
        m("div", Zp, [
          e.backed ? (l(), K(Cp, {
            key: 0,
            onBack: f[0] || (f[0] = (v) => i("back"))
          })) : N("", !0),
          m("span", Qp, _(L.value), 1),
          f[7] || (f[7] = m("span", { class: "grow" }, null, -1)),
          e.stepped ? (l(), d(Z, { key: 1 }, [
            z(we, {
              small: "",
              title: "Previous task (K)",
              "aria-label": "Previous task",
              onClick: f[1] || (f[1] = (v) => i("step", -1))
            }, {
              default: F(() => [
                z(je, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            z(we, {
              small: "",
              title: "Next task (J)",
              "aria-label": "Next task",
              onClick: f[2] || (f[2] = (v) => i("step", 1))
            }, {
              default: F(() => [
                z(je, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : N("", !0),
          z(we, {
            small: "",
            "aria-label": "Close the task (Esc)",
            "data-resource-close": "",
            onClick: f[3] || (f[3] = (v) => i("close"))
          }, {
            default: F(() => [
              z(je, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          })
        ]),
        h.value ? (l(), d("p", Xp, _(h.value), 1)) : o.value ? (l(), d("div", {
          key: o.value.id,
          class: "body"
        }, [
          m("div", t0, "Task " + _(o.value.id) + " · updated " + _(G(hs)(G(Ft)(o.value)) || "just now"), 1),
          m("h3", n0, _(o.value.title), 1),
          m("div", {
            class: ee(["state-line", y(o.value.state)])
          }, [
            m("button", {
              type: "button",
              class: "state",
              "data-task-state": "",
              title: "Change the status (S)",
              onClick: f[4] || (f[4] = (v) => x(v.currentTarget))
            }, [
              z(Us, {
                status: y(o.value.state)
              }, null, 8, ["status"]),
              ve(" " + _(b(o.value.state)), 1)
            ]),
            m("span", s0, "since " + _(G(hs)(G(Ft)(o.value)) || "just now"), 1)
          ], 2),
          o.value.state === "blocked" ? (l(), d("section", a0, [
            f[8] || (f[8] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
            m("p", r0, _(o.value.reason || "Other tasks"), 1),
            f[9] || (f[9] = m("p", { class: "note" }, "Nothing opens it by itself. Unblock it when that is done.", -1))
          ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", o0, [
            f[10] || (f[10] = m("span", { class: "label" }, "Why it was cancelled", -1)),
            m("p", i0, _(o.value.reason), 1)
          ])) : N("", !0),
          m("div", l0, [
            m("div", c0, [
              f[11] || (f[11] = m("span", { class: "fact-label" }, "Plan", -1)),
              m("span", u0, _((T = c.value) != null && T.plan_id ? `Plan ${c.value.plan_id}: ${c.value.plan_title}` : "Not in a plan"), 1)
            ]),
            ((w = c.value) == null ? void 0 : w.phase_total) > 1 ? (l(), d("div", d0, [
              f[12] || (f[12] = m("span", { class: "fact-label" }, "Phase", -1)),
              m("span", h0, _(c.value.phase_number) + " of " + _(c.value.phase_total) + ": " + _(c.value.phase_title), 1)
            ])) : N("", !0),
            o.value.state === "started" && o.value.holder_id ? (l(), d("div", f0, [
              f[13] || (f[13] = m("span", { class: "fact-label" }, "Holder", -1)),
              m("span", p0, "Agent " + _(o.value.holder_id), 1)
            ])) : N("", !0),
            G(a).has(o.value.state) ? N("", !0) : (l(), d("div", g0, [
              f[14] || (f[14] = m("span", { class: "fact-label" }, "Priority", -1)),
              z(Rn, {
                options: s,
                value: o.value.priority,
                "data-task-priority": "",
                onPick: oe
              }, null, 8, ["value"]),
              p.value ? (l(), d("p", m0, _(p.value), 1)) : N("", !0)
            ]))
          ]),
          o.value.waits.length ? (l(), d("section", v0, [
            f[15] || (f[15] = m("h4", null, "Waits on", -1)),
            (l(!0), d(Z, null, ie(o.value.waits, (v) => (l(), d("button", {
              key: v.id,
              type: "button",
              class: "wait",
              onClick: (g) => i("select", v.id)
            }, [
              z(Us, {
                status: y(v.state),
                size: 12
              }, null, 8, ["status"]),
              m("span", w0, _(v.id), 1),
              m("span", k0, _(v.title), 1)
            ], 8, y0))), 128))
          ])) : N("", !0),
          o.value.state === "completed" && o.value.outcome ? (l(), d("section", b0, [
            f[16] || (f[16] = m("h4", null, "How it was done", -1)),
            m("p", x0, _(o.value.outcome), 1)
          ])) : N("", !0),
          o.value.brief ? (l(), d("section", $0, [
            f[17] || (f[17] = m("h4", null, "The brief", -1)),
            m("p", {
              class: ee(["text", { clamped: !$.value }])
            }, _(o.value.brief), 3),
            o.value.brief.length > M0 && !$.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "more",
              onClick: f[5] || (f[5] = (v) => $.value = !0)
            }, "Show the whole brief")) : N("", !0)
          ])) : N("", !0),
          o.value.logs.length ? (l(), d("section", _0, [
            f[18] || (f[18] = m("h4", null, "Log", -1)),
            (l(!0), d(Z, null, ie(o.value.logs, (v) => (l(), d("p", {
              key: v.id,
              class: "log"
            }, _(v.line), 1))), 128))
          ])) : N("", !0)
        ])) : (l(), d("div", e0, [
          z(xt)
        ])),
        z(Vp, {
          ref_key: "footer",
          ref: j,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: P
        }, null, 8, ["id", "row", "read"]),
        A.value ? (l(), K(Op, {
          key: 3,
          anchor: A.value,
          "min-width": 220,
          "max-width": 300,
          onClose: f[6] || (f[6] = (v) => A.value = null)
        }, {
          default: F(() => [
            z(_p, null, {
              default: F(() => [
                ve("Change the status of task " + _(e.id), 1)
              ]),
              _: 1
            }),
            (l(!0), d(Z, null, ie(j.value.moves, (v) => (l(), K(kp, {
              key: v.word,
              onClick: (g) => q(v)
            }, {
              default: F(() => [
                ve(_(v.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : N("", !0)
      ], 2);
    };
  }
}, _g = /* @__PURE__ */ Y(S0, [["__scopeId", "data-v-bbdb8e4c"]]);
function E0(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Mn = { exports: {} }, Vs;
function A0() {
  return Vs || (Vs = 1, (function(e, t) {
    var n = (function() {
      var s = function(x, O) {
        var f = 236, T = 17, w = x, v = r[O], g = null, u = 0, M = null, S = [], I = {}, se = function(E, C) {
          u = w * 4 + 17, g = (function(k) {
            for (var B = new Array(k), D = 0; D < k; D += 1) {
              B[D] = new Array(k);
              for (var V = 0; V < k; V += 1)
                B[D][V] = null;
            }
            return B;
          })(u), ae(0, 0), ae(u - 7, 0), ae(0, u - 7), pe(), le(), Ne(E, C), w >= 7 && Me(E), M == null && (M = nr(w, v, S)), Pe(M, C);
        }, ae = function(E, C) {
          for (var k = -1; k <= 7; k += 1)
            if (!(E + k <= -1 || u <= E + k))
              for (var B = -1; B <= 7; B += 1)
                C + B <= -1 || u <= C + B || (0 <= k && k <= 6 && (B == 0 || B == 6) || 0 <= B && B <= 6 && (k == 0 || k == 6) || 2 <= k && k <= 4 && 2 <= B && B <= 4 ? g[E + k][C + B] = !0 : g[E + k][C + B] = !1);
        }, de = function() {
          for (var E = 0, C = 0, k = 0; k < 8; k += 1) {
            se(!0, k);
            var B = o.getLostPoint(I);
            (k == 0 || E > B) && (E = B, C = k);
          }
          return C;
        }, le = function() {
          for (var E = 8; E < u - 8; E += 1)
            g[E][6] == null && (g[E][6] = E % 2 == 0);
          for (var C = 8; C < u - 8; C += 1)
            g[6][C] == null && (g[6][C] = C % 2 == 0);
        }, pe = function() {
          for (var E = o.getPatternPosition(w), C = 0; C < E.length; C += 1)
            for (var k = 0; k < E.length; k += 1) {
              var B = E[C], D = E[k];
              if (g[B][D] == null)
                for (var V = -2; V <= 2; V += 1)
                  for (var te = -2; te <= 2; te += 1)
                    V == -2 || V == 2 || te == -2 || te == 2 || V == 0 && te == 0 ? g[B + V][D + te] = !0 : g[B + V][D + te] = !1;
            }
        }, Me = function(E) {
          for (var C = o.getBCHTypeNumber(w), k = 0; k < 18; k += 1) {
            var B = !E && (C >> k & 1) == 1;
            g[Math.floor(k / 3)][k % 3 + u - 8 - 3] = B;
          }
          for (var k = 0; k < 18; k += 1) {
            var B = !E && (C >> k & 1) == 1;
            g[k % 3 + u - 8 - 3][Math.floor(k / 3)] = B;
          }
        }, Ne = function(E, C) {
          for (var k = v << 3 | C, B = o.getBCHTypeInfo(k), D = 0; D < 15; D += 1) {
            var V = !E && (B >> D & 1) == 1;
            D < 6 ? g[D][8] = V : D < 8 ? g[D + 1][8] = V : g[u - 15 + D][8] = V;
          }
          for (var D = 0; D < 15; D += 1) {
            var V = !E && (B >> D & 1) == 1;
            D < 8 ? g[8][u - D - 1] = V : D < 9 ? g[8][15 - D - 1 + 1] = V : g[8][15 - D - 1] = V;
          }
          g[u - 8][8] = !E;
        }, Pe = function(E, C) {
          for (var k = -1, B = u - 1, D = 7, V = 0, te = o.getMaskFunction(C), X = u - 1; X > 0; X -= 2)
            for (X == 6 && (X -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (g[B][X - ge] == null) {
                  var ye = !1;
                  V < E.length && (ye = (E[V] >>> D & 1) == 1);
                  var ne = te(B, X - ge);
                  ne && (ye = !ye), g[B][X - ge] = ye, D -= 1, D == -1 && (V += 1, D = 7);
                }
              if (B += k, B < 0 || u <= B) {
                B -= k, k = -k;
                break;
              }
            }
        }, et = function(E, C) {
          for (var k = 0, B = 0, D = 0, V = new Array(C.length), te = new Array(C.length), X = 0; X < C.length; X += 1) {
            var ge = C[X].dataCount, ye = C[X].totalCount - ge;
            B = Math.max(B, ge), D = Math.max(D, ye), V[X] = new Array(ge);
            for (var ne = 0; ne < V[X].length; ne += 1)
              V[X][ne] = 255 & E.getBuffer()[ne + k];
            k += ge;
            var Ae = o.getErrorCorrectPolynomial(ye), Oe = h(V[X], Ae.getLength() - 1), Xn = Oe.mod(Ae);
            te[X] = new Array(Ae.getLength() - 1);
            for (var ne = 0; ne < te[X].length; ne += 1) {
              var es = ne + Xn.getLength() - te[X].length;
              te[X][ne] = es >= 0 ? Xn.getAt(es) : 0;
            }
          }
          for (var ts = 0, ne = 0; ne < C.length; ne += 1)
            ts += C[ne].totalCount;
          for (var an = new Array(ts), Et = 0, ne = 0; ne < B; ne += 1)
            for (var X = 0; X < C.length; X += 1)
              ne < V[X].length && (an[Et] = V[X][ne], Et += 1);
          for (var ne = 0; ne < D; ne += 1)
            for (var X = 0; X < C.length; X += 1)
              ne < te[X].length && (an[Et] = te[X][ne], Et += 1);
          return an;
        }, nr = function(E, C, k) {
          for (var B = p.getRSBlocks(E, C), D = $(), V = 0; V < k.length; V += 1) {
            var te = k[V];
            D.put(te.getMode(), 4), D.put(te.getLength(), o.getLengthInBits(te.getMode(), E)), te.write(D);
          }
          for (var X = 0, V = 0; V < B.length; V += 1)
            X += B[V].dataCount;
          if (D.getLengthInBits() > X * 8)
            throw "code length overflow. (" + D.getLengthInBits() + ">" + X * 8 + ")";
          for (D.getLengthInBits() + 4 <= X * 8 && D.put(0, 4); D.getLengthInBits() % 8 != 0; )
            D.putBit(!1);
          for (; !(D.getLengthInBits() >= X * 8 || (D.put(f, 8), D.getLengthInBits() >= X * 8)); )
            D.put(T, 8);
          return et(D, B);
        };
        I.addData = function(E, C) {
          C = C || "Byte";
          var k = null;
          switch (C) {
            case "Numeric":
              k = A(E);
              break;
            case "Alphanumeric":
              k = j(E);
              break;
            case "Byte":
              k = W(E);
              break;
            case "Kanji":
              k = y(E);
              break;
            default:
              throw "mode:" + C;
          }
          S.push(k), M = null;
        }, I.isDark = function(E, C) {
          if (E < 0 || u <= E || C < 0 || u <= C)
            throw E + "," + C;
          return g[E][C];
        }, I.getModuleCount = function() {
          return u;
        }, I.make = function() {
          if (w < 1) {
            for (var E = 1; E < 40; E++) {
              for (var C = p.getRSBlocks(E, v), k = $(), B = 0; B < S.length; B++) {
                var D = S[B];
                k.put(D.getMode(), 4), k.put(D.getLength(), o.getLengthInBits(D.getMode(), E)), D.write(k);
              }
              for (var V = 0, B = 0; B < C.length; B++)
                V += C[B].dataCount;
              if (k.getLengthInBits() <= V * 8)
                break;
            }
            w = E;
          }
          se(!1, de());
        }, I.createTableTag = function(E, C) {
          E = E || 2, C = typeof C > "u" ? E * 4 : C;
          var k = "";
          k += '<table style="', k += " border-width: 0px; border-style: none;", k += " border-collapse: collapse;", k += " padding: 0px; margin: " + C + "px;", k += '">', k += "<tbody>";
          for (var B = 0; B < I.getModuleCount(); B += 1) {
            k += "<tr>";
            for (var D = 0; D < I.getModuleCount(); D += 1)
              k += '<td style="', k += " border-width: 0px; border-style: none;", k += " border-collapse: collapse;", k += " padding: 0px; margin: 0px;", k += " width: " + E + "px;", k += " height: " + E + "px;", k += " background-color: ", k += I.isDark(B, D) ? "#000000" : "#ffffff", k += ";", k += '"/>';
            k += "</tr>";
          }
          return k += "</tbody>", k += "</table>", k;
        }, I.createSvgTag = function(E, C, k, B) {
          var D = {};
          typeof arguments[0] == "object" && (D = arguments[0], E = D.cellSize, C = D.margin, k = D.alt, B = D.title), E = E || 2, C = typeof C > "u" ? E * 4 : C, k = typeof k == "string" ? { text: k } : k || {}, k.text = k.text || null, k.id = k.text ? k.id || "qrcode-description" : null, B = typeof B == "string" ? { text: B } : B || {}, B.text = B.text || null, B.id = B.text ? B.id || "qrcode-title" : null;
          var V = I.getModuleCount() * E + C * 2, te, X, ge, ye, ne = "", Ae;
          for (Ae = "l" + E + ",0 0," + E + " -" + E + ",0 0,-" + E + "z ", ne += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ne += D.scalable ? "" : ' width="' + V + 'px" height="' + V + 'px"', ne += ' viewBox="0 0 ' + V + " " + V + '" ', ne += ' preserveAspectRatio="xMinYMin meet"', ne += B.text || k.text ? ' role="img" aria-labelledby="' + tt([B.id, k.id].join(" ").trim()) + '"' : "", ne += ">", ne += B.text ? '<title id="' + tt(B.id) + '">' + tt(B.text) + "</title>" : "", ne += k.text ? '<description id="' + tt(k.id) + '">' + tt(k.text) + "</description>" : "", ne += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ne += '<path d="', ge = 0; ge < I.getModuleCount(); ge += 1)
            for (ye = ge * E + C, te = 0; te < I.getModuleCount(); te += 1)
              I.isDark(ge, te) && (X = te * E + C, ne += "M" + X + "," + ye + Ae);
          return ne += '" stroke="transparent" fill="black"/>', ne += "</svg>", ne;
        }, I.createDataURL = function(E, C) {
          E = E || 2, C = typeof C > "u" ? E * 4 : C;
          var k = I.getModuleCount() * E + C * 2, B = C, D = k - C;
          return q(k, k, function(V, te) {
            if (B <= V && V < D && B <= te && te < D) {
              var X = Math.floor((V - B) / E), ge = Math.floor((te - B) / E);
              return I.isDark(ge, X) ? 0 : 1;
            } else
              return 1;
          });
        }, I.createImgTag = function(E, C, k) {
          E = E || 2, C = typeof C > "u" ? E * 4 : C;
          var B = I.getModuleCount() * E + C * 2, D = "";
          return D += "<img", D += ' src="', D += I.createDataURL(E, C), D += '"', D += ' width="', D += B, D += '"', D += ' height="', D += B, D += '"', k && (D += ' alt="', D += tt(k), D += '"'), D += "/>", D;
        };
        var tt = function(E) {
          for (var C = "", k = 0; k < E.length; k += 1) {
            var B = E.charAt(k);
            switch (B) {
              case "<":
                C += "&lt;";
                break;
              case ">":
                C += "&gt;";
                break;
              case "&":
                C += "&amp;";
                break;
              case '"':
                C += "&quot;";
                break;
              default:
                C += B;
                break;
            }
          }
          return C;
        }, sr = function(E) {
          var C = 1;
          E = typeof E > "u" ? C * 2 : E;
          var k = I.getModuleCount() * C + E * 2, B = E, D = k - E, V, te, X, ge, ye, ne = {
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
          for (V = 0; V < k; V += 2) {
            for (X = Math.floor((V - B) / C), ge = Math.floor((V + 1 - B) / C), te = 0; te < k; te += 1)
              ye = "█", B <= te && te < D && B <= V && V < D && I.isDark(X, Math.floor((te - B) / C)) && (ye = " "), B <= te && te < D && B <= V + 1 && V + 1 < D && I.isDark(ge, Math.floor((te - B) / C)) ? ye += " " : ye += "█", Oe += E < 1 && V + 1 >= D ? Ae[ye] : ne[ye];
            Oe += `
`;
          }
          return k % 2 && E > 0 ? Oe.substring(0, Oe.length - k - 1) + Array(k + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return I.createASCII = function(E, C) {
          if (E = E || 1, E < 2)
            return sr(C);
          E -= 1, C = typeof C > "u" ? E * 2 : C;
          var k = I.getModuleCount() * E + C * 2, B = C, D = k - C, V, te, X, ge, ye = Array(E + 1).join("██"), ne = Array(E + 1).join("  "), Ae = "", Oe = "";
          for (V = 0; V < k; V += 1) {
            for (X = Math.floor((V - B) / E), Oe = "", te = 0; te < k; te += 1)
              ge = 1, B <= te && te < D && B <= V && V < D && I.isDark(X, Math.floor((te - B) / E)) && (ge = 0), Oe += ge ? ye : ne;
            for (X = 0; X < E; X += 1)
              Ae += Oe + `
`;
          }
          return Ae.substring(0, Ae.length - 1);
        }, I.renderTo2dContext = function(E, C) {
          C = C || 2;
          for (var k = I.getModuleCount(), B = 0; B < k; B++)
            for (var D = 0; D < k; D++)
              E.fillStyle = I.isDark(B, D) ? "black" : "white", E.fillRect(B * C, D * C, C, C);
        }, I;
      };
      s.stringToBytesFuncs = {
        default: function(x) {
          for (var O = [], f = 0; f < x.length; f += 1) {
            var T = x.charCodeAt(f);
            O.push(T & 255);
          }
          return O;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(x, O) {
        var f = (function() {
          for (var w = P(x), v = function() {
            var le = w.read();
            if (le == -1) throw "eof";
            return le;
          }, g = 0, u = {}; ; ) {
            var M = w.read();
            if (M == -1) break;
            var S = v(), I = v(), se = v(), ae = String.fromCharCode(M << 8 | S), de = I << 8 | se;
            u[ae] = de, g += 1;
          }
          if (g != O)
            throw g + " != " + O;
          return u;
        })(), T = 63;
        return function(w) {
          for (var v = [], g = 0; g < w.length; g += 1) {
            var u = w.charCodeAt(g);
            if (u < 128)
              v.push(u);
            else {
              var M = f[w.charAt(g)];
              typeof M == "number" ? (M & 255) == M ? v.push(M) : (v.push(M >>> 8), v.push(M & 255)) : v.push(T);
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
      }, r = {
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
      }, o = (function() {
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
        ], O = 1335, f = 7973, T = 21522, w = {}, v = function(g) {
          for (var u = 0; g != 0; )
            u += 1, g >>>= 1;
          return u;
        };
        return w.getBCHTypeInfo = function(g) {
          for (var u = g << 10; v(u) - v(O) >= 0; )
            u ^= O << v(u) - v(O);
          return (g << 10 | u) ^ T;
        }, w.getBCHTypeNumber = function(g) {
          for (var u = g << 12; v(u) - v(f) >= 0; )
            u ^= f << v(u) - v(f);
          return g << 12 | u;
        }, w.getPatternPosition = function(g) {
          return x[g - 1];
        }, w.getMaskFunction = function(g) {
          switch (g) {
            case i.PATTERN000:
              return function(u, M) {
                return (u + M) % 2 == 0;
              };
            case i.PATTERN001:
              return function(u, M) {
                return u % 2 == 0;
              };
            case i.PATTERN010:
              return function(u, M) {
                return M % 3 == 0;
              };
            case i.PATTERN011:
              return function(u, M) {
                return (u + M) % 3 == 0;
              };
            case i.PATTERN100:
              return function(u, M) {
                return (Math.floor(u / 2) + Math.floor(M / 3)) % 2 == 0;
              };
            case i.PATTERN101:
              return function(u, M) {
                return u * M % 2 + u * M % 3 == 0;
              };
            case i.PATTERN110:
              return function(u, M) {
                return (u * M % 2 + u * M % 3) % 2 == 0;
              };
            case i.PATTERN111:
              return function(u, M) {
                return (u * M % 3 + (u + M) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + g;
          }
        }, w.getErrorCorrectPolynomial = function(g) {
          for (var u = h([1], 0), M = 0; M < g; M += 1)
            u = u.multiply(h([1, c.gexp(M)], 0));
          return u;
        }, w.getLengthInBits = function(g, u) {
          if (1 <= u && u < 10)
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
          else if (u < 27)
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
          else if (u < 41)
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
            throw "type:" + u;
        }, w.getLostPoint = function(g) {
          for (var u = g.getModuleCount(), M = 0, S = 0; S < u; S += 1)
            for (var I = 0; I < u; I += 1) {
              for (var se = 0, ae = g.isDark(S, I), de = -1; de <= 1; de += 1)
                if (!(S + de < 0 || u <= S + de))
                  for (var le = -1; le <= 1; le += 1)
                    I + le < 0 || u <= I + le || de == 0 && le == 0 || ae == g.isDark(S + de, I + le) && (se += 1);
              se > 5 && (M += 3 + se - 5);
            }
          for (var S = 0; S < u - 1; S += 1)
            for (var I = 0; I < u - 1; I += 1) {
              var pe = 0;
              g.isDark(S, I) && (pe += 1), g.isDark(S + 1, I) && (pe += 1), g.isDark(S, I + 1) && (pe += 1), g.isDark(S + 1, I + 1) && (pe += 1), (pe == 0 || pe == 4) && (M += 3);
            }
          for (var S = 0; S < u; S += 1)
            for (var I = 0; I < u - 6; I += 1)
              g.isDark(S, I) && !g.isDark(S, I + 1) && g.isDark(S, I + 2) && g.isDark(S, I + 3) && g.isDark(S, I + 4) && !g.isDark(S, I + 5) && g.isDark(S, I + 6) && (M += 40);
          for (var I = 0; I < u; I += 1)
            for (var S = 0; S < u - 6; S += 1)
              g.isDark(S, I) && !g.isDark(S + 1, I) && g.isDark(S + 2, I) && g.isDark(S + 3, I) && g.isDark(S + 4, I) && !g.isDark(S + 5, I) && g.isDark(S + 6, I) && (M += 40);
          for (var Me = 0, I = 0; I < u; I += 1)
            for (var S = 0; S < u; S += 1)
              g.isDark(S, I) && (Me += 1);
          var Ne = Math.abs(100 * Me / u / u - 50) / 5;
          return M += Ne * 10, M;
        }, w;
      })(), c = (function() {
        for (var x = new Array(256), O = new Array(256), f = 0; f < 8; f += 1)
          x[f] = 1 << f;
        for (var f = 8; f < 256; f += 1)
          x[f] = x[f - 4] ^ x[f - 5] ^ x[f - 6] ^ x[f - 8];
        for (var f = 0; f < 255; f += 1)
          O[x[f]] = f;
        var T = {};
        return T.glog = function(w) {
          if (w < 1)
            throw "glog(" + w + ")";
          return O[w];
        }, T.gexp = function(w) {
          for (; w < 0; )
            w += 255;
          for (; w >= 256; )
            w -= 255;
          return x[w];
        }, T;
      })();
      function h(x, O) {
        if (typeof x.length > "u")
          throw x.length + "/" + O;
        var f = (function() {
          for (var w = 0; w < x.length && x[w] == 0; )
            w += 1;
          for (var v = new Array(x.length - w + O), g = 0; g < x.length - w; g += 1)
            v[g] = x[g + w];
          return v;
        })(), T = {};
        return T.getAt = function(w) {
          return f[w];
        }, T.getLength = function() {
          return f.length;
        }, T.multiply = function(w) {
          for (var v = new Array(T.getLength() + w.getLength() - 1), g = 0; g < T.getLength(); g += 1)
            for (var u = 0; u < w.getLength(); u += 1)
              v[g + u] ^= c.gexp(c.glog(T.getAt(g)) + c.glog(w.getAt(u)));
          return h(v, 0);
        }, T.mod = function(w) {
          if (T.getLength() - w.getLength() < 0)
            return T;
          for (var v = c.glog(T.getAt(0)) - c.glog(w.getAt(0)), g = new Array(T.getLength()), u = 0; u < T.getLength(); u += 1)
            g[u] = T.getAt(u);
          for (var u = 0; u < w.getLength(); u += 1)
            g[u] ^= c.gexp(c.glog(w.getAt(u)) + v);
          return h(g, 0).mod(w);
        }, T;
      }
      var p = (function() {
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
        ], O = function(w, v) {
          var g = {};
          return g.totalCount = w, g.dataCount = v, g;
        }, f = {}, T = function(w, v) {
          switch (v) {
            case r.L:
              return x[(w - 1) * 4 + 0];
            case r.M:
              return x[(w - 1) * 4 + 1];
            case r.Q:
              return x[(w - 1) * 4 + 2];
            case r.H:
              return x[(w - 1) * 4 + 3];
            default:
              return;
          }
        };
        return f.getRSBlocks = function(w, v) {
          var g = T(w, v);
          if (typeof g > "u")
            throw "bad rs block @ typeNumber:" + w + "/errorCorrectionLevel:" + v;
          for (var u = g.length / 3, M = [], S = 0; S < u; S += 1)
            for (var I = g[S * 3 + 0], se = g[S * 3 + 1], ae = g[S * 3 + 2], de = 0; de < I; de += 1)
              M.push(O(se, ae));
          return M;
        }, f;
      })(), $ = function() {
        var x = [], O = 0, f = {};
        return f.getBuffer = function() {
          return x;
        }, f.getAt = function(T) {
          var w = Math.floor(T / 8);
          return (x[w] >>> 7 - T % 8 & 1) == 1;
        }, f.put = function(T, w) {
          for (var v = 0; v < w; v += 1)
            f.putBit((T >>> w - v - 1 & 1) == 1);
        }, f.getLengthInBits = function() {
          return O;
        }, f.putBit = function(T) {
          var w = Math.floor(O / 8);
          x.length <= w && x.push(0), T && (x[w] |= 128 >>> O % 8), O += 1;
        }, f;
      }, A = function(x) {
        var O = a.MODE_NUMBER, f = x, T = {};
        T.getMode = function() {
          return O;
        }, T.getLength = function(g) {
          return f.length;
        }, T.write = function(g) {
          for (var u = f, M = 0; M + 2 < u.length; )
            g.put(w(u.substring(M, M + 3)), 10), M += 3;
          M < u.length && (u.length - M == 1 ? g.put(w(u.substring(M, M + 1)), 4) : u.length - M == 2 && g.put(w(u.substring(M, M + 2)), 7));
        };
        var w = function(g) {
          for (var u = 0, M = 0; M < g.length; M += 1)
            u = u * 10 + v(g.charAt(M));
          return u;
        }, v = function(g) {
          if ("0" <= g && g <= "9")
            return g.charCodeAt(0) - 48;
          throw "illegal char :" + g;
        };
        return T;
      }, j = function(x) {
        var O = a.MODE_ALPHA_NUM, f = x, T = {};
        T.getMode = function() {
          return O;
        }, T.getLength = function(v) {
          return f.length;
        }, T.write = function(v) {
          for (var g = f, u = 0; u + 1 < g.length; )
            v.put(
              w(g.charAt(u)) * 45 + w(g.charAt(u + 1)),
              11
            ), u += 2;
          u < g.length && v.put(w(g.charAt(u)), 6);
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
        return T;
      }, W = function(x) {
        var O = a.MODE_8BIT_BYTE, f = s.stringToBytes(x), T = {};
        return T.getMode = function() {
          return O;
        }, T.getLength = function(w) {
          return f.length;
        }, T.write = function(w) {
          for (var v = 0; v < f.length; v += 1)
            w.put(f[v], 8);
        }, T;
      }, y = function(x) {
        var O = a.MODE_KANJI, f = s.stringToBytesFuncs.SJIS;
        if (!f)
          throw "sjis not supported.";
        (function(v, g) {
          var u = f(v);
          if (u.length != 2 || (u[0] << 8 | u[1]) != g)
            throw "sjis not supported.";
        })("友", 38726);
        var T = f(x), w = {};
        return w.getMode = function() {
          return O;
        }, w.getLength = function(v) {
          return ~~(T.length / 2);
        }, w.write = function(v) {
          for (var g = T, u = 0; u + 1 < g.length; ) {
            var M = (255 & g[u]) << 8 | 255 & g[u + 1];
            if (33088 <= M && M <= 40956)
              M -= 33088;
            else if (57408 <= M && M <= 60351)
              M -= 49472;
            else
              throw "illegal char at " + (u + 1) + "/" + M;
            M = (M >>> 8 & 255) * 192 + (M & 255), v.put(M, 13), u += 2;
          }
          if (u < g.length)
            throw "illegal char at " + (u + 1);
        }, w;
      }, b = function() {
        var x = [], O = {};
        return O.writeByte = function(f) {
          x.push(f & 255);
        }, O.writeShort = function(f) {
          O.writeByte(f), O.writeByte(f >>> 8);
        }, O.writeBytes = function(f, T, w) {
          T = T || 0, w = w || f.length;
          for (var v = 0; v < w; v += 1)
            O.writeByte(f[v + T]);
        }, O.writeString = function(f) {
          for (var T = 0; T < f.length; T += 1)
            O.writeByte(f.charCodeAt(T));
        }, O.toByteArray = function() {
          return x;
        }, O.toString = function() {
          var f = "";
          f += "[";
          for (var T = 0; T < x.length; T += 1)
            T > 0 && (f += ","), f += x[T];
          return f += "]", f;
        }, O;
      }, L = function() {
        var x = 0, O = 0, f = 0, T = "", w = {}, v = function(u) {
          T += String.fromCharCode(g(u & 63));
        }, g = function(u) {
          if (!(u < 0)) {
            if (u < 26)
              return 65 + u;
            if (u < 52)
              return 97 + (u - 26);
            if (u < 62)
              return 48 + (u - 52);
            if (u == 62)
              return 43;
            if (u == 63)
              return 47;
          }
          throw "n:" + u;
        };
        return w.writeByte = function(u) {
          for (x = x << 8 | u & 255, O += 8, f += 1; O >= 6; )
            v(x >>> O - 6), O -= 6;
        }, w.flush = function() {
          if (O > 0 && (v(x << 6 - O), x = 0, O = 0), f % 3 != 0)
            for (var u = 3 - f % 3, M = 0; M < u; M += 1)
              T += "=";
        }, w.toString = function() {
          return T;
        }, w;
      }, P = function(x) {
        var O = x, f = 0, T = 0, w = 0, v = {};
        v.read = function() {
          for (; w < 8; ) {
            if (f >= O.length) {
              if (w == 0)
                return -1;
              throw "unexpected end of file./" + w;
            }
            var u = O.charAt(f);
            if (f += 1, u == "=")
              return w = 0, -1;
            if (u.match(/^\s$/))
              continue;
            T = T << 6 | g(u.charCodeAt(0)), w += 6;
          }
          var M = T >>> w - 8 & 255;
          return w -= 8, M;
        };
        var g = function(u) {
          if (65 <= u && u <= 90)
            return u - 65;
          if (97 <= u && u <= 122)
            return u - 97 + 26;
          if (48 <= u && u <= 57)
            return u - 48 + 52;
          if (u == 43)
            return 62;
          if (u == 47)
            return 63;
          throw "c:" + u;
        };
        return v;
      }, oe = function(x, O) {
        var f = x, T = O, w = new Array(x * O), v = {};
        v.setPixel = function(S, I, se) {
          w[I * f + S] = se;
        }, v.write = function(S) {
          S.writeString("GIF87a"), S.writeShort(f), S.writeShort(T), S.writeByte(128), S.writeByte(0), S.writeByte(0), S.writeByte(0), S.writeByte(0), S.writeByte(0), S.writeByte(255), S.writeByte(255), S.writeByte(255), S.writeString(","), S.writeShort(0), S.writeShort(0), S.writeShort(f), S.writeShort(T), S.writeByte(0);
          var I = 2, se = u(I);
          S.writeByte(I);
          for (var ae = 0; se.length - ae > 255; )
            S.writeByte(255), S.writeBytes(se, ae, 255), ae += 255;
          S.writeByte(se.length - ae), S.writeBytes(se, ae, se.length - ae), S.writeByte(0), S.writeString(";");
        };
        var g = function(S) {
          var I = S, se = 0, ae = 0, de = {};
          return de.write = function(le, pe) {
            if (le >>> pe)
              throw "length over";
            for (; se + pe >= 8; )
              I.writeByte(255 & (le << se | ae)), pe -= 8 - se, le >>>= 8 - se, ae = 0, se = 0;
            ae = le << se | ae, se = se + pe;
          }, de.flush = function() {
            se > 0 && I.writeByte(ae);
          }, de;
        }, u = function(S) {
          for (var I = 1 << S, se = (1 << S) + 1, ae = S + 1, de = M(), le = 0; le < I; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(I)), de.add(String.fromCharCode(se));
          var pe = b(), Me = g(pe);
          Me.write(I, ae);
          var Ne = 0, Pe = String.fromCharCode(w[Ne]);
          for (Ne += 1; Ne < w.length; ) {
            var et = String.fromCharCode(w[Ne]);
            Ne += 1, de.contains(Pe + et) ? Pe = Pe + et : (Me.write(de.indexOf(Pe), ae), de.size() < 4095 && (de.size() == 1 << ae && (ae += 1), de.add(Pe + et)), Pe = et);
          }
          return Me.write(de.indexOf(Pe), ae), Me.write(se, ae), Me.flush(), pe.toByteArray();
        }, M = function() {
          var S = {}, I = 0, se = {};
          return se.add = function(ae) {
            if (se.contains(ae))
              throw "dup key:" + ae;
            S[ae] = I, I += 1;
          }, se.size = function() {
            return I;
          }, se.indexOf = function(ae) {
            return S[ae];
          }, se.contains = function(ae) {
            return typeof S[ae] < "u";
          }, se;
        };
        return v;
      }, q = function(x, O, f) {
        for (var T = oe(x, O), w = 0; w < O; w += 1)
          for (var v = 0; v < x; v += 1)
            T.setPixel(v, w, f(v, w));
        var g = b();
        T.write(g);
        for (var u = L(), M = g.toByteArray(), S = 0; S < M.length; S += 1)
          u.writeByte(M[S]);
        return u.flush(), "data:image/gif;base64," + u;
      };
      return s;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(s) {
        function a(r) {
          for (var i = [], o = 0; o < r.length; o++) {
            var c = r.charCodeAt(o);
            c < 128 ? i.push(c) : c < 2048 ? i.push(
              192 | c >> 6,
              128 | c & 63
            ) : c < 55296 || c >= 57344 ? i.push(
              224 | c >> 12,
              128 | c >> 6 & 63,
              128 | c & 63
            ) : (o++, c = 65536 + ((c & 1023) << 10 | r.charCodeAt(o) & 1023), i.push(
              240 | c >> 18,
              128 | c >> 12 & 63,
              128 | c >> 6 & 63,
              128 | c & 63
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
  })(Mn)), Mn.exports;
}
var O0 = A0();
const C0 = /* @__PURE__ */ E0(O0), T0 = ["width", "height", "viewBox"], B0 = ["width", "height"], L0 = ["d"], D0 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const s = C0(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), r = [];
      for (let i = 0; i < a; i += 1)
        for (let o = 0; o < a; o += 1)
          s.isDark(i, o) && r.push(`M${o + 4} ${i + 4}h1v1h-1z`);
      return { count: a + 8, path: r.join("") };
    });
    return (s, a) => (l(), d("svg", {
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
      }, null, 8, B0),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, L0)
    ], 8, T0));
  }
}, Mg = /* @__PURE__ */ Y(D0, [["__scopeId", "data-v-489f0852"]]), Sg = "1.0.0", Eg = "3.5";
export {
  Us as $,
  lt as A,
  we as B,
  ig as C,
  q0 as D,
  qt as E,
  dg as F,
  Op as G,
  W0 as H,
  xg as I,
  io as J,
  Sg as K,
  ag as L,
  V0 as M,
  j0 as N,
  K0 as O,
  hf as P,
  Mg as Q,
  H1 as R,
  ff as S,
  Rn as T,
  og as U,
  js as V,
  xt as W,
  H0 as X,
  N0 as Y,
  _g as Z,
  aa as _,
  Z0 as a,
  ot as a0,
  bd as a1,
  hg as a2,
  Qe as a3,
  hs as a4,
  kg as a5,
  wg as a6,
  bg as a7,
  G0 as a8,
  z0 as a9,
  U0 as aa,
  fg as ab,
  l1 as ac,
  ht as ad,
  F0 as ae,
  gg as af,
  vg as ag,
  Ep as ah,
  Xf as ai,
  pg as aj,
  xd as ak,
  Zs as al,
  yg as am,
  Q0 as b,
  cg as c,
  sg as d,
  rg as e,
  J0 as f,
  ng as g,
  za as h,
  ug as i,
  X0 as j,
  P0 as k,
  lg as l,
  iu as m,
  $g as n,
  eg as o,
  Kt as p,
  Y0 as q,
  I0 as r,
  tg as s,
  Be as t,
  Ra as u,
  je as v,
  Eg as w,
  mg as x,
  kp as y,
  _p as z
};
