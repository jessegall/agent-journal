/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as be, createElementVNode as m, normalizeClass as X, Fragment as J, renderList as re, normalizeStyle as xe, defineComponent as Do, Comment as No, h as is, cloneVNode as jo, createBlock as K, withCtx as U, unref as G, createVNode as F, toDisplayString as $, createCommentVNode as P, inject as et, computed as D, resolveDynamicComponent as tt, Transition as rn, watch as ke, ref as H, shallowRef as ln, TransitionGroup as Po, mergeProps as ht, reactive as ls, createTextVNode as ge, onMounted as Ne, onUnmounted as Ae, nextTick as cn, useId as ma, Teleport as ga, withModifiers as Me, isRef as _s, resolveDirective as qo, withDirectives as ft, useModel as Wn, useAttrs as va, getCurrentInstance as Wo, mergeModels as Hn, getCurrentScope as ya, onScopeDispose as wa, onBeforeUnmount as cs, provide as Ho, onErrorCaptured as Fo, toHandlers as Uo, createSlots as zo, withKeys as Kt, vModelText as Fn, defineAsyncComponent as Vo } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Go = { class: "skeleton-line" }, Ko = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Go, [
      be(t.$slots, "default", {}, void 0, !0),
      m("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(J, null, re(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: xe({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Je = /* @__PURE__ */ Y(Ko, [["__scopeId", "data-v-0ebb6933"]]), us = Do({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== No);
      return s.length !== 1 ? is(J, { key: n }, s) : s[0].key == null ? jo(s[0], { key: n }) : s[0];
    };
  }
}), Yo = ["aria-label"], Jo = ["aria-label"], Zo = ["aria-label"], Qo = ["aria-label"], Xo = ["aria-label"], er = ["aria-label"], tr = ["aria-label"], nr = {
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
    return (l, d) => (c(), K(us, { value: e.shape }, {
      messages: U(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(J, null, re(t, (f) => m("div", {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: xe({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, Yo)
      ]),
      older: U(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(J, null, re(t.slice(0, 3), (f) => (c(), h("div", {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: xe({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, Jo)
      ]),
      cards: U(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(J, null, re(e.count, (f) => (c(), h("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (c(), h(J, null, re(n, (w) => F(Je, {
              key: w.id,
              bars: w.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Zo)
      ]),
      file: U(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(J, null, re(e.count, (f) => (c(), h("div", {
            key: f,
            class: "skeleton-file"
          }, [
            F(Je, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(J, null, re(a, (w) => F(Je, {
              key: w.id,
              bars: w.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Qo)
      ]),
      page: U(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          F(Je, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(J, null, re(e.count, (f) => (c(), K(Je, {
            key: f,
            bars: G(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, Xo)
      ]),
      text: U(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(J, null, re(e.count, (f) => (c(), K(Je, {
            key: f,
            bars: G(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, er)
      ]),
      default: U(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(J, null, re(e.count, (f) => (c(), K(Je, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, tr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, At = /* @__PURE__ */ Y(nr, [["__scopeId", "data-v-c687fb85"]]), sr = {
  key: 1,
  class: "empty-state titled"
}, ar = { class: "empty-state-title" }, or = { class: "empty-state-text" }, rr = {
  key: 2,
  class: "empty-state"
}, ir = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), K(At, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", sr, [
      m("p", ar, $(e.title), 1),
      m("p", or, [
        be(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", rr, [
      be(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Yt = /* @__PURE__ */ Y(ir, [["__scopeId", "data-v-b27e89b0"]]), lr = { class: "fold-group" }, cr = ["aria-expanded"], ur = { class: "fold-label" }, dr = {
  key: 0,
  class: "fold-count"
}, hr = {
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
    return (s, a) => (c(), h("div", lr, [
      m("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        m("span", ur, $(e.label), 1),
        e.count !== "" ? (c(), h("span", dr, $(e.count), 1)) : P("", !0),
        m("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, cr),
      e.open ? be(s.$slots, "default", {}, void 0, !0, 0) : P("", !0)
    ]));
  }
}, dg = /* @__PURE__ */ Y(hr, [["__scopeId", "data-v-9ef1865c"]]), fr = Symbol("open-view"), nt = Symbol.for("journal.window-context");
function ka() {
  const e = et(nt, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const pr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: xe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, mr = /* @__PURE__ */ Y(pr, [["__scopeId", "data-v-eb453d6f"]]), gr = {
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
      return t.busy || t.disabled || !!((s = et(nt, null)) != null && s.readOnly);
    });
    return (s, a) => (c(), K(tt(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: X(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: U(() => [
        m("span", {
          class: X(["btn-label", { hidden: e.busy }])
        }, [
          be(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (c(), K(mr, {
          key: 0,
          class: "btn-spinner"
        })) : P("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ Y(gr, [["__scopeId", "data-v-a2dc4bda"]]), vr = {
  class: "running",
  "data-running-command": ""
}, yr = ["title"], wr = {
  key: "idle",
  class: "running-idle"
}, kr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", vr, [
      F(rn, {
        name: "roll",
        mode: "out-in"
      }, {
        default: U(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, $(e.text), 9, yr)) : (c(), h("span", wr, $(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, hg = /* @__PURE__ */ Y(kr, [["__scopeId", "data-v-e3ee3449"]]), br = ["aria-checked", "aria-label", "title"], xr = {
  key: 0,
  class: "switch-inner"
}, $r = {
  key: 0,
  class: "switch-word"
}, Mr = {
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
      m("span", {
        class: X(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", xr, $(e.word), 1)) : P("", !0),
        a[1] || (a[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", $r, $(e.word), 1)) : P("", !0)
    ], 10, br));
  }
}, fg = /* @__PURE__ */ Y(Mr, [["__scopeId", "data-v-1bfb90f3"]]);
function ba(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Mt(e, t) {
  return ba(() => localStorage, e, t);
}
function xa(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function un(e, t) {
  return xa(() => localStorage, e, t);
}
function $a(e, t) {
  ke(t, (n) => un(e, n), { deep: !0 });
}
function _r(e, t) {
  return ba(() => sessionStorage, e, t);
}
function Sr(e, t) {
  return xa(() => sessionStorage, e, t);
}
const Jt = "journal.environment", Ma = H(_r(Jt, Mt(Jt, "")));
function Er(e) {
  Ma.value = e, Sr(Jt, e), un(Jt, e);
}
const Zt = H(location.hash), Ss = ln(null), Es = { integrations: "mcp", library: "team" };
function Ar() {
  if (!Ss.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Es[n]) {
    location.replace(`#/${[Es[n], ...s].join("/")}${t ? `?${t}` : ""}`), Zt.value = location.hash;
    return;
  }
  !n || Ss.value(n) || (Er(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Zt.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Zt.value = location.hash, Ar();
});
const De = D(() => {
  const [e, t = ""] = Zt.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((i) => {
    const [r, l = ""] = i.split("@"), [d = "", f = "", w = ""] = r.split(":");
    return { table: d, id: Number(f), comment: Number(w) || 0, env: l };
  });
  return {
    env: Ma.value,
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
}), dn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${dn.page(e)}?open=${t}`
};
function Cr(e = "", t = 0, n = "") {
  location.hash = dn.page(e, t, n);
}
const Or = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function _a(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([i]) => i !== "open" && i !== "sub").map(([i, r]) => `${i}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Or).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const wn = {};
function Sa(e, t, n = 0, s = "") {
  var i;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((i = wn[e]) != null && i.call(wn, t))) return;
  const a = De.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  _a([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Tr(e, t, n, s = 0, a = "") {
  if (e === De.value.env) return Sa(t, n, s, a);
  const o = De.value.stack, i = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  _a([...i < 0 ? o : o.slice(0, i), { table: t, id: n, comment: s, env: e }], a);
}
function mt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Tr(s, a, Number(o), 0, t) : Sa(a, Number(o), 0, t);
}
function Br(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function ct(e) {
  const t = Br(e);
  t && mt(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Lr = ["stroke-width", "innerHTML"], Ee = {
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
      style: xe({
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
    }, null, 12, Lr));
  }
}, ds = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), K(ye, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: U(() => [
        F(Ee, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Rr = {
  key: 1,
  class: "row-list-failure"
}, Ir = ["data-row"], Dr = {
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
    const t = e, n = D(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = H(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, i) => !e.loaded && !e.failure ? (c(), K(At, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Rr, $(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), K(Yt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (c(), h(J, { key: 3 }, [
      (c(), K(tt(e.arrival ? Po : "ul"), ht(n.value, { class: "row-list" }), {
        default: U(() => [
          (c(!0), h(J, null, re(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            be(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Ir))), 128))
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
}, Nr = /* @__PURE__ */ Y(Dr, [["__scopeId", "data-v-7f34ada7"]]), jr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Pr = {
  key: 1,
  class: "agent-rows-note"
}, qr = {
  key: 2,
  class: "agent-rows-note"
}, Wr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Hr = ["data-agent-row", "onClick"], Fr = { class: "agent-row-name" }, Ur = { class: "agent-row-state" }, zr = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = D(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = D(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", jr, [
      e.loaded ? e.failure ? (c(), h("p", Pr, $(e.failure), 1)) : e.rows.length ? (c(), h(J, { key: 3 }, [
        m("p", Wr, $(s.value) + " running", 1),
        (c(!0), h(J, null, re(n.value, (i) => (c(), h("button", {
          key: i.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": i.id,
          onClick: (r) => G(mt)(`agents:${i.id}`)
        }, [
          m("span", Fr, "#" + $(i.id) + " " + $(i.session), 1),
          m("span", Ur, $(i.ended_at ? "Closed" : "Running"), 1)
        ], 8, Hr))), 128))
      ], 64)) : (c(), h("p", qr, $(e.none), 1)) : (c(), K(At, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, pg = /* @__PURE__ */ Y(zr, [["__scopeId", "data-v-a01e5a17"]]), Vr = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, $(e.text), 3));
  }
}, Ea = /* @__PURE__ */ Y(Vr, [["__scopeId", "data-v-9e7e1157"]]), Gr = ["aria-valuenow", "aria-valuemax"], Kr = {
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
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: xe({ width: n.value })
      }, null, 4)
    ], 10, Gr));
  }
}, Yr = /* @__PURE__ */ Y(Kr, [["__scopeId", "data-v-9eba6a85"]]), Jr = { class: "bars" }, Zr = { class: "bar-name" }, Qr = { class: "bar-value" }, Xr = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => Math.max(1, ...n.items.map((i) => Number(i.value) || 0))), o = D(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (i, r) => (c(), h("div", Jr, [
      (c(!0), h(J, null, re(e.items, (l, d) => (c(), K(tt(l.open ? "button" : "div"), {
        key: `${d}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: X(["bar-row", l.tone, { opens: l.open }]),
        onClick: (f) => l.open && s("open", l.open)
      }, {
        default: U(() => [
          m("span", Zr, $(l.label), 1),
          F(Yr, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Qr, $(l.value) + $(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ei = /* @__PURE__ */ Y(Xr, [["__scopeId", "data-v-663427f4"]]), ti = { class: "bars" }, ni = {
  key: 0,
  class: "bars-title"
}, si = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", ti, [
      e.node.title ? (c(), h("span", ni, $(e.node.title), 1)) : P("", !0),
      F(ei, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, ai = /* @__PURE__ */ Y(si, [["__scopeId", "data-v-7135bb11"]]), oi = {
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
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: xe(o.value)
    }, [
      (c(!0), h(J, null, re(e.node.children || [], (l, d) => (c(), K(to, {
        key: d,
        node: l,
        onOpen: r[0] || (r[0] = (f) => a("open", f)),
        onFile: r[1] || (r[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Ft = /* @__PURE__ */ Y(oi, [["__scopeId", "data-v-d142a3f4"]]), ri = {
  key: 0,
  class: "card-head"
}, ii = { class: "card-title" }, li = {
  key: 0,
  class: "card-note"
}, ci = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", ri, [
        m("span", ii, $(e.node.title), 1),
        e.node.note ? (c(), h("span", li, $(e.node.note), 1)) : P("", !0)
      ])) : P("", !0),
      F(Ft, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, ui = /* @__PURE__ */ Y(ci, [["__scopeId", "data-v-67b72d40"]]), di = (e, t, n) => Math.max(t, Math.min(n, e)), hi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, $e = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, As = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", kn = 80;
function Cs(e) {
  return e.length <= kn ? e : `${e.slice(0, kn + 1).replace(/\s+\S*$/, "") || e.slice(0, kn)}…`;
}
const Os = {
  messages: (e) => Cs(As(e.text)),
  comments: (e) => Cs(As(e.text)),
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
}, fi = (e) => (Os[e.table] ? Os[e.table](e) : e.title || "") || "", pi = ["done", "cancelled"], Un = {
  tasks: (e) => $e(e.completed_at) || (e.state === "cancelled" ? $e(e.updated_at) : 0),
  questions: (e) => e.answer ? $e(e.updated_at) : 0,
  plans: (e) => pi.includes(e.state) ? $e(e.updated_at) : 0,
  notices: (e) => $e(e.closed_at),
  secrets: (e) => $e(e.deleted_at),
  workers: (e) => e.state === "stopped" ? $e(e.updated_at) : 0,
  shares: (e) => $e(e.stopped_at),
  dumps: (e) => $e(e.completed_at),
  agents: (e) => e.state === "ended" ? $e(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? $e(e.created_at) : 0
}, mi = (e) => Un[e.table] ? Un[e.table](e) : 0, Aa = (e) => mi(e) > 0, gi = (e) => !!Un[e], Ca = (e) => $e(e.created_at), Qt = (e) => $e(e.updated_at) || Ca(e), vi = (e) => "task_ids" in e, hn = typeof document < "u" && document.documentElement.classList.contains("phone"), yi = "Files are attached on the computer; the phone sends text.", Oa = 1024, wi = Oa * 1024 * 1024, ki = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Oa} MB limit for one file.`;
function bi() {
  return () => {
  };
}
function Ts(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function xi(e = window) {
  if (!Ts(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ts(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ta = "status.summary", ve = ls({
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
}), $i = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Ba = () => !!ve.countdown || $i() || ve.starting;
function Mi(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function _i(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Si() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Ei(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Si(), !0);
}
let It = { version: "", started: 0 };
function Ai(e) {
  return e.version ? (It.version || (It = { version: e.version, started: e.started || 0 }), e.version !== It.version || (e.started || 0) !== It.started) : !1;
}
function Ci(e) {
  _i(e.countdown), Mi(e.ready, e.step), (Ei(!!e.updating, e.step) || !e.updating && !Oi(e) && Ai(e)) && xi(window);
}
const Oi = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Bs = 2e4, Ti = 3e5, qe = 6e5, Dt = 6, Bi = 500, Li = "/journal/summary", Ls = hn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ri = (e) => e.split("?")[0].endsWith(Li), La = (e, t) => Object.assign(new Error(t), { status: e });
async function Ii(e, t, n = La) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Di = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Ni {
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
        headers: { ...Ls, ...i, ...s === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: Di(s),
        signal: AbortSignal.timeout(a || (r ? Ti : Bs))
      });
    } catch (l) {
      if (t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((d) => setTimeout(d, Bi)), this.reach(t, n, s, a, o - 1, i);
    }
  }
  async send(t, n, s, a = 0, o = Dt, i = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : bi(), l = await this.reach(t, n, s, a, o, i).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return Ii(l, `${l.status} ${l.statusText}`).catch((d) => {
      throw d.blocked && t !== "GET" && this.refused(d.message), d;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ls, signal: AbortSignal.timeout(Bs) });
    if (!n.ok) throw La(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, i = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Dt, o).then((l) => (this.written(n), l));
    if (Ba() && !Ri(n))
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
const Ie = new Ni(), Se = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const yt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: i = !1 }) => [i ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), wt = "the page does not know its environment yet", ji = "X-Journal-Env", Pi = "X-Journal-Request-At", bn = "/viewer/voices/figures/";
class hs {
  constructor({ env: t = () => De.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new hs({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Pi]: String(Date.now()), ...this.env() ? { [ji]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === wt ? Promise.reject(new Error(wt)) : Ie.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === wt ? Promise.reject(new Error(wt)) : Ie.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : wt;
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
    return Ie.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: i = [], tasks: r = [], closed: l = !1, docked: d = !1 } = {}) {
    const f = this.here(`/${t}${ue({ limit: n, before: s, after: a, since: o, ids: i.join(","), tasks: r.join(","), closed: l ? "1" : "", docked: d ? "1" : "" })}`);
    return this.get(f, `${t}.${yt({ before: s, after: a, since: o, ids: i, tasks: r, closed: l, docked: d })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const i = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(i, `chats/${t}.${yt({ before: s, since: a, docked: o })}`);
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
    if (hn) return Promise.reject(Object.assign(new Error(yi), { status: 403 }));
    if (s.size > wi) return Promise.reject(new Error(ki(s)));
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
    return Ie.bytes(t);
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
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${yt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${yt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${yt(n)}`);
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
    return Ie.request("GET", bn + "figures.json");
  }
  voiceFigureUrl(t) {
    return bn + t;
  }
  figureDecoderUrl() {
    return bn + "draco/";
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
    return `${this.base}/${t ? `?env=${Se(t)}` : ""}${dn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ie = new hs({ base: hn ? "/p" : "" }), qi = (e) => Ie.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Wi = { claude: "Claude Code", codex: "Codex" };
Object.entries(Wi).map(([e, t]) => ({ key: e, label: t }));
const Rs = (e) => e.status === "stopped" ? 1 : 0, Hi = "main", Fi = (e) => e.filter((t) => t.role === Hi).sort((t, n) => Rs(t) - Rs(n) || $e(n.heard_at) - $e(t.heard_at))[0] || null, Ui = { me: 1, people: [] }, z = ls({
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
  people: Ui,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Mt("journal.activity", !0),
  wide: !1,
  sideMini: Mt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
$a("journal.activity", () => z.activity);
$a("journal.side.mini", () => z.sideMini);
const pt = D(() => Fi(z.agents));
D(() => !!pt.value && z.live.some((e) => e.agent.session === pt.value.session && e.environment === De.value.env));
D(() => !!pt.value && ["busy", "working"].includes(pt.value.status));
function zi(e) {
  if (!e) return "";
  const t = typeof e == "string" ? Date.parse(e) / 1e3 : e, n = Math.max(0, Date.now() / 1e3 - t);
  return n < 60 ? "now" : n < 3600 ? `${Math.floor(n / 60)}m` : n < 86400 ? `${Math.floor(n / 3600)}h` : `${Math.floor(n / 86400)}d`;
}
function Is(e) {
  const t = zi(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Ra(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Ds(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const xn = (e) => String(e).padStart(2, "0");
function Vi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${xn(t % 60)}s` : `${Math.floor(t / 3600)}h ${xn(Math.floor(t % 3600 / 60))}m ${xn(t % 60)}s`;
}
const Gi = ["working", "busy", "waiting", "compacting"], Ki = (e) => Gi.includes(e), Yi = "builder";
D(() => !z.settings || z.settings.features.file_feed !== !1);
const Ji = D(() => !z.settings || z.settings.features.status_bar !== !1);
D(() => z.settings && z.settings.workers && z.settings.workers.mode || Yi);
D(() => !z.settings || !z.settings.tasks || z.settings.tasks.auto !== !1);
D(() => !!(z.settings && z.settings.reviewing && z.settings.reviewing.reviewer));
D(() => !z.settings || z.settings.features.sharing !== !1);
const Xt = 50, fs = 100, Zi = { messages: 25 }, Re = (e) => Zi[e] || Xt;
function Qi(e, t) {
  if (e !== "messages") return Math.max(t.length - Re(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Re(e)) return s;
  return 0;
}
const Xi = "review_step", el = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === Xi).sort((t, n) => t.id - n.id), tl = 5, nl = 500, sl = 3e3, al = () => z.entries.length ? z.entries[z.entries.length - 1].id : 0, Ut = { env: "", id: 0 }, ol = () => !!(z.bar && z.bar.length) || Ki(pt.value && pt.value.status);
function rl({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function il() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: fs })))).then(el);
}
function ll() {
  return Ut.env !== ie.env() && Object.assign(Ut, { env: ie.env(), id: al() }), ie.entries(Ut.id);
}
function cl(e) {
  e.length && (Ut.id = e[e.length - 1].id, ec(e));
}
async function ul({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", Xt);
}
const zn = /* @__PURE__ */ new Map();
async function Vn(e, t) {
  const n = `${e}:${ie.env()}`, s = zn.get(n);
  if (!s) return Ns(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(Qt)), o = s.length ? Math.min(...s.map((l) => l.id)) - 1 : 0, i = await ie.list("workers", { limit: t, since: a, after: o });
  if (!i.is_last_page)
    return zn.delete(n), Vn(e, t);
  const r = new Set(i.rows.map((l) => l.id));
  return Ns(
    n,
    [...s.filter((l) => !r.has(l.id)), ...i.rows].sort((l, d) => l.id - d.id)
  );
}
const Ns = (e, t) => (zn.set(e, t), t);
async function js(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Ps = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => ol() ? nl : sl,
    take: (e) => Array.isArray(e) && (z.bar = e),
    active: () => Ji.value
  },
  "agents.index": { read: () => js(ie, tl), every: 1e3, take: (e) => z.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => z.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      z.summary = e, Ci(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => z.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => z.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (z.people = e) },
  "entries.recent": { read: ll, every: 1e3, take: cl },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: rl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Vn("workers.index", Re("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Vn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: il, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Re("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: ul, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => js(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
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
}), dl = 6e4, hl = 3e3, fl = 4, pl = 300, ml = 5e3, Ia = /* @__PURE__ */ new Map();
function fn(e) {
  if (!(e in Ps)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ps[e];
}
function gl(e) {
  const t = fn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return ml;
  }
}
const vl = (e) => e / 2 + Math.random() * e / 2, Da = (e) => [...e.users.values()].pop(), ps = (e) => Ia.get(e.place) === e, yl = () => Math.random() * pl, ms = () => document.hidden;
function wl(e) {
  const t = gl(e);
  return e.failures ? vl(Math.min(e.key === Ta ? hl : dl, t * 2 ** e.failures)) : Math.max(t, fl * e.took);
}
function Na(e, t) {
  clearTimeout(e.timer), !(!ps(e) || e.paused || ms()) && (e.timer = setTimeout(() => kl(e), t));
}
function kl(e) {
  return ps(e) ? e.running ? (e.again = !0, e.running) : (e.running = Ml(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const bl = (e) => {
  var t, n;
  return !e.paused && !ms() && (((n = (t = fn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Da(e).active() && (!Ba() || e.key === Ta);
};
async function xl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Ie.attemptOnce(() => fn(e.key).read(Da(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function $l(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = fn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Ml(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      bl(e) && $l(e, await xl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ps(e) && !e.paused);
  Na(e, wl(e));
}
const _l = () => ms() || Ia.forEach((e) => Na(e, yl()));
document.addEventListener("visibilitychange", _l);
const Sl = 60, El = (e, t) => $e(e.created_at) >= $e(t.created_at) - Sl, Al = (e, t) => e.id > 0 && e.table === t.table && El(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), gs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Al(s, n))), $n = [
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
}), Ct = {
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
    filters: $n
  }),
  tasks: he("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: $n
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
  notices: he("Notice", "band", "One line pinned to the chat while it matters", { filters: $n }),
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
}, Cl = ["secrets", "plugins"], ja = Object.keys(Ct).filter((e) => !(hn && Cl.includes(e)));
D(() => ja.map((e) => ({ name: e, ...Ct[e] })));
const pn = (e) => Ct[e], Pa = new Map(ja.flatMap((e) => [e, e.replace(/s$/, ""), Ct[e].title.toLowerCase()].map((t) => [t, e]))), dt = (e) => Pa.get(String(e).toLowerCase()) || "", qa = [...Pa.keys()].sort((e, t) => t.length - e.length).join("|"), Ye = /* @__PURE__ */ new Set(), vs = H(0), Ot = /* @__PURE__ */ new Set(), Tt = /* @__PURE__ */ new Set(), ze = /* @__PURE__ */ new Set(), Gn = /* @__PURE__ */ new Set(), Ol = /* @__PURE__ */ new Map(), Tl = /* @__PURE__ */ new Map();
let lt = !1, kt = null;
const Bl = (e, t) => e.id - t.id, Ll = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Rl = { messages: Ll }, Wa = (e) => Rl[e] || Bl;
function Ha(e) {
  return vs.value, Ye.has(e) || (Ye.add(e), z.booted && (!Ot.has(e) || Tt.has(e)) && queueMicrotask(() => gn([e], !1))), z.rows[e] || [];
}
function Il(e) {
  const t = z.rows[e] || [], n = Qi(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  z.rows[e] = t.filter((a) => s.has(a) || gi(e) && !Aa(a)), z.paging.size[e] = Re(e), z.paging.more[e] = !0;
}
const Dl = /* @__PURE__ */ new Set();
function Nl() {
  Ye.forEach(Il), Ye.clear(), Ol.clear(), Tl.clear(), vs.value += 1;
}
ke(() => `${De.value.env}/${De.value.page}/${De.value.open ? De.value.open.table : ""}`, Nl);
ke(
  () => z.booted,
  (e) => e && gn(
    [...Ye].filter((t) => !Ot.has(t)),
    !1
  )
);
const Kn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !vi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Fa(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Kn(s) && !Kn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Ua(e, t) {
  Ot.add(e), vs.value += 1;
  const n = z.rows[e] || [];
  z.rows[e] = [...Fa(n, t.rows), ...gs(n.filter((s) => s.id === 0), t.rows)], z.paging.size[e] = z.paging.size[e] || Re(e), z.paging.more[e] = !t.is_last_page;
}
async function jl(e) {
  const t = new Set((z.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Re(e) });
  mn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = gs((z.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Ua(e, { ...n, rows: [...n.rows, ...a].sort(Wa(e)) }), z.paging.size[e] = Re(e), za.has(e) && await Va(e), z.rows[e];
}
const mn = (e, t) => z.counts = { ...z.counts, [e]: t };
async function Pl(e) {
  const t = z.rows[e] || [], n = Math.max(0, ...t.map(Qt)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await ie.list(e, { limit: Re(e), since: n, after: s });
  if (mn(e, a.counts), !a.is_last_page) return jl(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), i = gs(t.filter((r) => !o.has(r.id)), a.rows).concat(Fa(t, a.rows));
  return z.rows[e] = i.sort(Wa(e)), z.paging.size[e] = z.rows[e].length, z.rows[e];
}
const Mn = /* @__PURE__ */ new Set();
async function ql(e, t = !1) {
  e.forEach((n) => Tt.delete(n)), e.forEach((n) => Gn.add(n));
  try {
    await Gl(e, t);
  } finally {
    e.forEach((n) => Gn.delete(n));
  }
}
async function Wl(e) {
  const t = await ie.list(e, { limit: Re(e) });
  mn(e, t.counts), Ua(e, t);
}
async function Hl(e) {
  mn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const za = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Va(e) {
  const t = (z.rows[e] || []).filter((a) => Kn(a) && (e !== "plans" || !Aa(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  z.rows[e] = (z.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Fl = (e, t) => !Ot.has(e) || t && (z.paging.size[e] || Re(e)) === Re(e) && !Dl.has(e);
async function Ul(e, t) {
  if (!Ye.has(e)) return Hl(e);
  const n = await (Fl(e, t) ? Wl(e) : Pl(e));
  return za.has(e) && await Va(e), n;
}
async function zl() {
  const [e, t] = await Promise.all([ie.entries(0, fs), ie.settings()]);
  Ya([...Mt(Ka(), []), ...e]), JSON.stringify(t) !== JSON.stringify(z.settings) && (z.settings = t);
}
const Vl = (e, t) => Ul(e, t).then(
  () => null,
  () => e
);
async function Gl(e, t) {
  const n = (await Promise.all(e.map((s) => Vl(s, t)))).filter(Boolean);
  if (n.forEach((s) => (ze.add(s), Tt.add(s))), t && await zl(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ga = 1e3, Kl = 15e3;
let Nt = Ga;
async function Yl() {
  return kt || (kt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...ze].some((e) => !Mn.has(e)) || lt; ) {
      const e = lt, t = [...e ? Object.keys(z.rows) : ze].filter((s) => Ct[s] && (Ye.has(s) || s in z.rows)).filter((s) => e || !Ye.has(s) || Tt.has(s) || !Ot.has(s)).filter((s) => !Mn.has(s)), n = [...ze].filter((s) => Mn.has(s));
      ze.clear(), n.forEach((s) => ze.add(s)), lt = !1;
      try {
        await ql(t, e), Nt = Ga;
      } catch {
        lt = lt || e, await new Promise((a) => setTimeout(a, Nt)), Nt = Math.min(Nt * 2, Kl);
      }
    }
  })().finally(() => kt = null), kt);
}
function gn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Gn.has(n)).forEach((n) => {
    ze.add(n), t && Tt.add(n);
  }), ze.has("settings") && (lt = !0), Yl();
}
const Ka = () => {
  var e;
  return `typed-entries:${((e = z.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Ya(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  z.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-fs), un(Ka(), z.entries.slice(-50));
}
const Jl = ["created", "updated", "deleted"], Zl = { phases: ["phases", "plans"] }, Yn = (e) => Zl[e] || [e], Ql = (e) => Jl.includes(e.entry_type) ? [...Yn(e.data.table), ...(e.data.joins || []).flatMap(Yn)] : [];
function Xl(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of Yn(t.data.table).filter((s) => z.rows[s]))
      z.rows[n] = z.rows[n].filter((s) => s.id !== t.data.id);
}
function ec(e) {
  Ya([...z.entries, ...e]), Xl(e), gn([...new Set(e.flatMap(Ql))].filter((t) => t && t !== "agents"));
}
qi((e) => z.streamOpen || gn([e]));
const Jn = [], tc = 2e3, Ue = /* @__PURE__ */ new Map(), nc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, sc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function st(e, { first: t = !1 } = {}) {
  t ? Jn.unshift(e) : Jn.push(e), Ue.clear();
}
function Ja(e, t, n) {
  var a;
  const s = Ha(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const ac = (e) => Ha(e.table).find((t) => t.id === e.id) === e.row, oc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function He(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function rc(e, t) {
  const n = [{ kind: "text", text: He(e).replace(/\r\n/g, `
`) }];
  for (const s of Jn)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const i = s(o.text, t);
      typeof i == "string" ? o.text = i : i && n.splice(a, 1, ...i);
    }
  return n;
}
function _t(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return ic(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function ic(e) {
  return e.split(sc).map((t, n) => n % 2 ? t : t.replace(nc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function qs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function lc(e) {
  const [t, , ...n] = e, s = qs(t).map((o) => `<th>${_t(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${qs(o).map((i) => `<td>${_t(i)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function cc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${_t(a)}</li>`).join("")}</${s}>`;
}
const Ws = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Za(e) {
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
      const r = t.findIndex((d, f) => f > s && /^(```|~~~)/.test(d)), l = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(s + 1, l).join(`
`)}</code></pre>`), s = l + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${_t(o[2])}</h${r}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ws(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(lc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(cc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Za(
          t.slice(s, r).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let i = s;
    for (; i < t.length && t[i].trim() && !Ws(t, i) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[i]); )
      i += 1;
    n.push(`<p>${_t(t.slice(s, i).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = i;
  }
  return n.join("");
}
const uc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, dc = (e) => e.kind !== "text" && !uc.test(e.html);
function hc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Za(s).replace(/\u0001(\d+)\u0001/g, (o, i) => t[Number(i)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : dc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Zn(e, t = { env: "" }) {
  const n = oc(e, t), s = Ue.get(n);
  if (Ue.delete(n), s && s.reads.every(ac))
    return Ue.set(n, s), s.html;
  const a = [], o = hc(rc(e, { ...t, reads: a }));
  return Ue.set(n, { html: o, reads: a }), Ue.size > tc && Ue.delete(Ue.keys().next().value), o;
}
const Qa = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, en = (e) => String(e || "").replace(Qa, (t, n, s, a) => a), fc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), jt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, pc = /^Traceback \(most recent call last\):/m, mc = 8;
function Xa(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, mc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function gc(e) {
  const t = [...e.matchAll(fc)].map((s) => s.index);
  if (jt.lastIndex = 0, !t.length || !jt.test(e)) return null;
  jt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), i = [...o.matchAll(jt)];
    return { head: i.length ? o.slice(0, i[0].index).trim() : o, frames: i.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Xa(n), tail: "" } : null;
}
function vc(e) {
  const t = pc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Xa([o]), tail: n.slice(a).join(`
`) };
}
st((e) => {
  const t = en(e), n = vc(t) || gc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Qn = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", yc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", wc = `${Qn} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, kc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", bc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Hs = {
  js: { keywords: Qn, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: yc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: wc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qn, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: kc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: bc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Fs(e, t, n) {
  return n && e.startsWith(n, t);
}
function xc(e, t) {
  const n = Hs[t] || Hs.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const i = (r, l) => l && a.push({ kind: r, value: l });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const d = e.indexOf(`
`, o), f = e.slice(o, d < 0 ? e.length : d);
      i(
        /^#{1,6}\s/.test(f) ? "keyword" : /^(```|~~~)/.test(f) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(f) ? "number" : "plain",
        f
      ), i("plain", d < 0 ? "" : `
`), o = d < 0 ? e.length : d + 1;
      continue;
    }
    if (Fs(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      i("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && Fs(e, o, n.block[0])) {
      const d = e.indexOf(n.block[1], o + n.block[0].length), f = d < 0 ? e.length : d + n.block[1].length;
      i("comment", e.slice(o, f)), o = f;
      continue;
    }
    const l = (n.triple || []).find((d) => e.startsWith(d, o));
    if (l) {
      const d = e.indexOf(l, o + 3), f = d < 0 ? e.length : d + 3;
      i("string", e.slice(o, f)), o = f;
      continue;
    }
    if (n.quotes.includes(r)) {
      let d = o + 1;
      for (; d < e.length && e[d] !== r && (r === "`" || e[d] !== `
`); ) d += e[d] === "\\" ? 2 : 1;
      i("string", e.slice(o, d + 1)), o = d + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const d = e.slice(o).match(/^<\/?[\w:-]+/);
      i("keyword", d[0]), o += d[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const f = e.slice(o).match(/^[\w$]+/)[0], w = n.lower ? f.toLowerCase() : f, _ = n.property && /^\s*:/.test(e.slice(o + f.length));
      i(s.has(w) ? "keyword" : _ ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
      continue;
    }
    if (/\d/.test(r)) {
      const d = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      i("number", d[0]), o += d[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const d = r === ">" ? 1 : 2;
      i("keyword", e.slice(o, o + d)), o += d;
      continue;
    }
    i("plain", r), o += 1;
  }
  return a;
}
function $c(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of xc(e, t))
    a.split(`
`).forEach((i, r) => {
      r && n.push(""), i && (n[n.length - 1] += s === "plain" ? He(i) : `<span class="tok-${s}">${He(i)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Mc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const _c = 1500, Us = /* @__PURE__ */ new WeakMap();
async function Sc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Mc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Us.get(t)), Us.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, _c)
  )));
}
typeof document < "u" && document.addEventListener("click", Sc, !0);
const Ec = /^(```|~~~)\s*(\w+)?\s*$/, zs = /^\s{4,}\S/, Ac = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Cc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function eo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Oc(e) {
  const t = eo(e.join(`
`));
  return (Cc.find(([, n]) => n.test(t)) || ["text"])[0];
}
function Vs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${$c(eo(e.join(`
`)), t || Oc(e)).join(`
`)}</code></pre></div>` };
}
function Tc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const i = t[o].match(Ec);
    if (i) {
      const r = t.findIndex((d, f) => f > o && d.trim().startsWith(i[1])), l = r < 0 ? t.length : r;
      a(), n.push(Vs(t.slice(o + 1, l).map(en), i[2] ? i[2].toLowerCase() : "")), o = l + 1;
      continue;
    }
    if (zs.test(t[o])) {
      let r = o;
      for (; r < t.length && (zs.test(t[r]) || !t[r].trim()); ) r += 1;
      for (; r > o && !t[r - 1].trim(); ) r -= 1;
      const l = [];
      for (; s.length && s[s.length - 1].trim() && Ac.test(s[s.length - 1].trim()); ) l.unshift(s.pop());
      if (r - o + l.length >= 2) {
        a(), n.push(Vs([...l, ...t.slice(o, r)].map(en), "")), o = r;
        continue;
      }
      s.push(...l);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
st((e) => Tc(e));
const Bc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Lc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Rc(e) {
  const t = Bc.exec(e);
  if (t && dt(t[1])) return { at: t.index, length: t[0].length, table: dt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Lc.exec(e), s = n && dt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Ic(e, t, n, s) {
  const a = Ja(s, e, t), o = en(a ? fi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${He(pn(e).title)} ${t}</span><span class="row-card-title">${He(o)}</span></a>`;
}
st(
  (e, t) => {
    const n = Rc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Ic(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Dc = /\.(png|jpe?g|gif|webp|svg)$/i, Nc = (e) => Dc.test(e), jc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Pc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function qc(e, t) {
  const n = jc.exec(e), [, s, a, o, i, r] = n || [], l = n && dt(s || o), d = l && Ja(t, l, Number(a || i));
  if (!d || !(d.files || []).includes(r)) return null;
  const f = ie.in(t.env).fileUrl(l, d.id, r), w = `${pn(l).title} ${d.id} · ${He(r)}`, _ = Nc(r) ? `<img class="file-card-image" src="${f}" alt="${He(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${He(r)}">${_}<span class="file-card-name">${w}</span></a>` };
}
function Wc(e) {
  const t = Pc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${He(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
st(
  (e, t) => {
    if (t.inline) return null;
    const n = qc(e, t) || Wc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Hc = /`([^`\n]+)`/g;
st((e) => e.replace(Hc, (t, n) => `<code>${n}</code>`));
const Gs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${dn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
st(
  (e, t) => e.replace(Qa, (n, s, a, o) => Gs[s] ? Gs[s](a, o, t) : o)
);
const Fc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Uc = new RegExp(`\\b(${qa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), zc = new RegExp(`\\b(${qa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Vc = (e, t) => `<a class="row-pill" href="#" data-peek="${dt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Gc = (e) => e.replace(zc, (t, n, s) => s.replace(/\d+/g, (a) => Vc(n.replace(/s$/i, ""), a))), Kc = (e) => Gc(e).replace(
  Uc,
  (t, n, s, a = "", o) => {
    const i = s || o;
    return `<a class="row-pill" href="#" data-peek="${dt(n)}:${i}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${i}${a ? `:${a}` : ""}</span></a>`;
  }
);
st(
  (e, t) => t.rowNames === !1 ? e : e.split(Fc).map((n, s) => s % 2 ? n : Kc(n)).join("")
);
const Yc = ["innerHTML"], Jc = ["innerHTML"], Zc = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = D(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Zn(s, { env: De.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => G(ct) && G(ct)(...o)),
      innerHTML: n.value
    }, null, 8, Yc)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => G(ct) && G(ct)(...o)),
      innerHTML: n.value
    }, null, 8, Jc));
  }
}, ut = /* @__PURE__ */ Y(Zc, [["__scopeId", "data-v-30fd9c25"]]), Qc = { class: "fact" }, Xc = { class: "fact-label" }, eu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Qc, [
      m("span", Xc, $(e.label), 1),
      F(ut, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, tu = /* @__PURE__ */ Y(eu, [["__scopeId", "data-v-3a88ecf8"]]), nu = { class: "list" }, su = { class: "list-label" }, au = {
  key: 1,
  class: "list-note"
}, ou = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", nu, [
      (c(!0), h(J, null, re(e.items, (o, i) => (c(), K(tt(o.open ? "button" : "div"), {
        key: i,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: U(() => [
          m("span", su, $(o.label), 1),
          o.badge ? (c(), K(Ea, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : P("", !0),
          o.note ? (c(), h("span", au, $(o.note), 1)) : P("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ru = /* @__PURE__ */ Y(ou, [["__scopeId", "data-v-ebe2ae0a"]]), iu = { class: "table" }, lu = {
  key: 0,
  class: "table-row empty"
}, cu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, i) => (c(), h("div", iu, [
      m("div", {
        class: "table-row head",
        style: xe(a.value)
      }, [
        (c(!0), h(J, null, re(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, $(r), 1))), 128))
      ], 4),
      (c(!0), h(J, null, re(e.rows, (r, l) => (c(), K(tt(r.open ? "button" : "div"), {
        key: l,
        type: r.open ? "button" : void 0,
        class: X(["table-row", r.tone, { opens: r.open }]),
        style: xe(a.value),
        onClick: (d) => r.open && s("open", r.open)
      }, {
        default: U(() => [
          (c(!0), h(J, null, re(r.cells, (d, f) => (c(), h("span", {
            key: f,
            class: "cell"
          }, $(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", lu, $(e.empty), 1)) : P("", !0)
    ]));
  }
}, uu = /* @__PURE__ */ Y(cu, [["__scopeId", "data-v-9326a52e"]]), du = { class: "stat-value" }, hu = { class: "stat-label" }, fu = {
  key: 0,
  class: "stat-note"
}, pu = {
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
    return (s, a) => (c(), K(tt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: U(() => [
        m("span", du, $(e.value), 1),
        m("span", hu, $(e.label), 1),
        e.note ? (c(), h("span", fu, $(e.note), 1)) : P("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, mu = /* @__PURE__ */ Y(pu, [["__scopeId", "data-v-ad0db6d6"]]), gu = { class: "code" }, vu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, i) => (c(), K(us, {
      value: e.node.type
    }, {
      stack: U(() => [
        F(Ft, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: U(() => [
        F(Ft, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: U(() => [
        F(Ft, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: U(() => [
        F(ui, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: U(() => [
        m("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, $(e.node.text), 3)
      ]),
      divider: U(() => [...i[2] || (i[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: U(() => [
        F(mu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: i[0] || (i[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: U(() => [
        F(ai, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: U(() => [
        F(uu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: U(() => [
        F(ru, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: U(() => [
        F(ut, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: U(() => [
        F(tu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: U(() => [
        F(Ea, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: U(() => [
        m("pre", gu, [
          m("code", null, $(e.node.text), 1)
        ])
      ]),
      file: U(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: i[1] || (i[1] = (r) => a(e.node))
        }, $(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), to = /* @__PURE__ */ Y(vu, [["__scopeId", "data-v-cbdcf540"]]), yu = { class: "dashboard" }, wu = { class: "trail" }, ku = ["onClick"], bu = {
  key: 0,
  class: "gone",
  role: "status"
}, xu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (_) => _ in (n.document.pages || {}), o = H(!!n.page && !a(n.page)), i = H(n.page && !o.value ? [n.page] : []), r = D(() => i.value.at(-1) || n.document.start), l = D(() => (n.document.pages || {})[r.value] || null), d = (_) => ((n.document.pages || {})[_] || {}).title || _, f = (_) => {
      o.value = !1, i.value = [...i.value, _];
    }, w = (_) => {
      o.value = !1, i.value = i.value.slice(0, _);
    };
    return ke(
      () => n.document.start,
      () => i.value = []
    ), (_, S) => (c(), h("div", yu, [
      e.document.broken ? (c(), K(Yt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: U(() => [
          ge($(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), K(Yt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: U(() => [
          ge($(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(J, { key: 2 }, [
        m("nav", wu, [
          m("button", {
            type: "button",
            class: X(["step", { current: !i.value.length }]),
            onClick: S[0] || (S[0] = (L) => w(0))
          }, $(d(e.document.start)), 3),
          (c(!0), h(J, null, re(i.value, (L, b) => (c(), h(J, {
            key: `${b}-${L}`
          }, [
            S[2] || (S[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: X(["step", { current: b === i.value.length - 1 }]),
              onClick: (v) => w(b + 1)
            }, $(d(L)), 11, ku)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", bu, "What you opened is no longer in this dashboard. Here is its start page.")) : P("", !0),
        F(rn, {
          name: "page",
          mode: "out-in"
        }, {
          default: U(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              F(to, {
                node: l.value.view,
                onOpen: f,
                onFile: S[1] || (S[1] = (L) => s("file", L))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : P("", !0)
    ]));
  }
}, mg = /* @__PURE__ */ Y(xu, [["__scopeId", "data-v-fbe83734"]]);
function $u(e, t, n, s = () => window) {
  Ne(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Mu = (e, t = () => !0) => $u("keydown", (n) => n.key === "Escape" && t() && e());
function _u(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = H(!1), a = D(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Mu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Su = 80, rt = ls([]);
function Eu(e) {
  const t = Symbol("layer"), n = () => rt.includes(t) && rt.splice(rt.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !rt.includes(t) && rt.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), D(() => Su + Math.max(0, rt.indexOf(t)));
}
let no = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return no = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Au = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Cu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const i = [...e.value.querySelectorAll(Au)];
    if (!i.length) return o.preventDefault();
    const [r, l] = [i[0], i.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Ne(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : no, document.addEventListener("keydown", a), cn(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Ou = ["aria-modal", "aria-label", "aria-labelledby"], Tu = {
  key: 0,
  class: "dialog-head"
}, Bu = ["id", "tabindex"], Lu = {
  key: 1,
  class: "dialog-foot"
}, Ru = 500, Iu = 400, Du = {
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
    const n = e, s = t, { visible: a, close: o, closed: i } = _u(s, n), r = Eu(a), l = H(null), d = H(null), f = H(null), w = ma(), _ = H(!1), S = Date.now();
    n.modal && Cu(d, () => s("escape"), f);
    function L() {
      if (!n.modal) return n.closable && o();
      _.value = !0, setTimeout(() => _.value = !1, Iu);
    }
    function b(q) {
      !n.modal || Date.now() - S >= Ru || ![" ", "Enter"].includes(q.key) || (q.preventDefault(), q.stopPropagation());
    }
    const v = () => l.value && (l.value.scrollTop = l.value.scrollHeight), A = new MutationObserver(v);
    return ke(l, (q) => {
      A.disconnect(), q && n.follow && (A.observe(q, { childList: !0, subtree: !0, characterData: !0 }), v());
    }), Ae(() => A.disconnect()), (q, Q) => (c(), K(ga, { to: "body" }, [
      F(rn, {
        name: "dialog",
        appear: "",
        onAfterLeave: G(i)
      }, {
        default: U(() => [
          G(a) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: xe({ zIndex: G(r) }),
            onClick: Me(L, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: d,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: _.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? G(w) : void 0,
              onKeydownCapture: b
            }, [
              e.bare ? P("", !0) : (c(), h("header", Tu, [
                m("h3", {
                  id: G(w),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, $(e.title), 9, Bu),
                e.closable ? (c(), K(ds, {
                  key: 0,
                  onClick: G(o)
                }, null, 8, ["onClick"])) : P("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: l,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                be(q.$slots, "default", {}, void 0, !0)
              ], 2),
              q.$slots.foot ? (c(), h("footer", Lu, [
                be(q.$slots, "foot", {}, void 0, !0)
              ])) : P("", !0)
            ], 42, Ou)
          ], 6)) : P("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Nu = /* @__PURE__ */ Y(Du, [["__scopeId", "data-v-6d1ecd98"]]), Fe = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Le = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, ju = 6;
function ys(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Pu = (e) => {
  const t = ys(e, Fe.lineChars), n = Math.max(Fe.minWidth, Math.max(...t.map((s) => s.length)) * Fe.charWidth + Fe.padX * 2);
  return { name: e, lines: t, line: Fe.line, padY: Fe.padY, width: n, height: t.length * Fe.line + Fe.padY * 2 };
};
function qu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (i) => {
    a.set(i, "open"), t.forEach((r, l) => {
      if (r[0] !== i) return;
      const d = a.get(r[1]);
      d === "open" ? s.add(l) : d || o(r[1]);
    }), a.set(i, "done");
  };
  return [...n, ...e].forEach((i) => a.has(i) || o(i)), s;
}
function Wu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, i]) => {
      n.get(i) < n.get(o) + 1 && (n.set(i, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Hu(e, t, n) {
  const s = [];
  e.forEach((i) => {
    var r;
    return (s[r = n.get(i)] || (s[r] = [])).push(i);
  });
  const a = () => new Map(s.flatMap((i) => i.map((r, l) => [r, l]))), o = (i, r) => {
    const l = a(), d = (f) => {
      const w = r(f).map((_) => l.get(_));
      return w.length ? w.reduce((_, S) => _ + S, 0) / w.length : l.get(f);
    };
    return [...i].sort((f, w) => d(f) - d(w));
  };
  for (let i = 0; i < ju; i++) {
    const r = i % 2 === 0, l = s.map((d, f) => f);
    (r ? l.slice(1) : l.slice(0, -1).reverse()).forEach((d) => {
      const f = (w) => t.filter((_) => _[r ? 1 : 0] === w).map((_) => _[r ? 0 : 1]);
      s[d] = o(s[d], f);
    });
  }
  return s;
}
function Fu(e, t) {
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
function Uu(e) {
  const t = [...new Set(e.flatMap(([W, C]) => [W, C]))], n = new Set(e.map(([, W]) => W)), s = t.filter((W) => !n.has(W)), a = qu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((W, C) => !a.has(C)), i = Wu(t, o), r = Hu(t, o, i), l = new Map(t.map((W) => [W, Pu(W)])), d = r.map((W) => W.reduce((C, I) => C + l.get(I).width, 0) + Be.across * (W.length - 1)), f = Math.max(...d) + Be.margin * 2, w = Vu(e, i, r.length), _ = /* @__PURE__ */ new Map();
  let S = Be.margin;
  r.forEach((W, C) => {
    let I = (f - d[C]) / 2;
    const y = Math.max(...W.map((p) => l.get(p).height));
    W.forEach((p) => {
      const k = l.get(p);
      _.set(p, { ...k, x: I, y: S + (y - k.height) / 2 }), I += k.width + Be.across;
    }), S += y + (w[C] ?? Be.down);
  });
  const L = e.map(([W, C, I], y) => ({ from: W, to: C, label: I || "", back: a.has(y) || i.get(C) <= i.get(W) }));
  Fu(L, _);
  const b = L.map((W) => Gu(W, _.get(W.from), _.get(W.to))), v = [..._.values()], A = Zu(b, v), q = Math.max(S - Be.down, ...A.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(f - Be.margin, ...A.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + Be.margin, height: q + Be.margin, nodes: v, arrows: A };
}
const zu = (e) => e ? ys(e, Le.lineChars).length * Le.line + Le.pad * 2 : 0;
function Vu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, i]) => {
    const [r, l] = [t.get(a), t.get(o)].sort((d, f) => d - f);
    l > r && (s[r + Math.floor((l - r - 1) / 2)] += zu(i) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function Gu(e, t, n) {
  const s = e.label ? ys(e.label, Le.lineChars) : [], a = s.length ? Math.max(...s.map((_) => _.length)) * Le.charWidth + Le.pad * 2 : 0, o = s.length * Le.line + (s.length ? Le.pad * 2 : 0), i = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, f = (d - r) / 2, w = [{ x: i, y: r }, { x: i, y: r + f }, { x: l, y: d - f }, { x: l, y: d }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: w, path: `M${i} ${r} C${i} ${r + f} ${l} ${d - f} ${l} ${d}` };
}
const Ku = ([e, t, n, s], a) => {
  const o = 1 - a, i = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: i("x"), y: i("y") };
}, Yu = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Ju = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Le.line);
function Zu(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: i }) => ({ x: s, y: a, width: o, height: i }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, d) => {
      const f = Ku(s.curve, l);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + d, width: s.labelWidth, height: s.labelHeight };
    }, r = Ju.flatMap((l) => Yu.map((d) => a(d, l))).find((l) => !n.some((d) => Ks(l, d))) ?? a(0.5, 0);
    for (; n.some((l) => Ks(r, l)); ) r.y += Le.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: Le.line, pad: Le.pad } };
  });
}
const Ks = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Qu = { class: "flowchart-tools" }, Xu = ["width", "height", "viewBox", "aria-label"], ed = ["d"], td = ["x", "y", "width", "height"], nd = ["x", "y"], sd = ["x", "dy"], ad = {
  key: 0,
  class: "flowchart-label"
}, od = ["x", "y", "width", "height"], rd = ["x", "y"], id = ["x", "dy"], ld = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => Uu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, i = H(null), r = H({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function d() {
      var A;
      const b = (A = i.value) == null ? void 0 : A.getBoundingClientRect();
      if (!(b != null && b.width)) return;
      const v = Math.min(b.width / a.value.width, b.height / a.value.height, 1.5);
      r.value = { zoom: v, x: (b.width - a.value.width * v) / 2, y: (b.height - a.value.height * v) / 2 };
    }
    function f(b, v, A) {
      const { zoom: q, x: Q, y: W } = r.value, C = Math.min(o.most, Math.max(o.least, q * b));
      r.value = { zoom: C, x: v - (v - Q) * C / q, y: A - (A - W) * C / q };
    }
    function w(b) {
      const v = i.value.getBoundingClientRect();
      f(b, v.width / 2, v.height / 2);
    }
    function _(b) {
      const v = i.value.getBoundingClientRect();
      b.ctrlKey || b.metaKey ? f(b.deltaY < 0 ? o.step : 1 / o.step, b.clientX - v.left, b.clientY - v.top) : r.value = { ...r.value, x: r.value.x - b.deltaX, y: r.value.y - b.deltaY };
    }
    function S(b) {
      var v, A, q;
      b.preventDefault(), (v = window.getSelection()) == null || v.removeAllRanges(), l = { x: b.clientX - r.value.x, y: b.clientY - r.value.y }, (q = (A = i.value).setPointerCapture) == null || q.call(A, b.pointerId);
    }
    function L(b) {
      l && (r.value = { ...r.value, x: b.clientX - l.x, y: b.clientY - l.y });
    }
    return Ne(d), (b, v) => (c(), K(Nu, {
      title: e.title,
      large: "",
      onClose: v[4] || (v[4] = (A) => s("close"))
    }, {
      default: U(() => [
        m("div", Qu, [
          F(ye, {
            small: "",
            onClick: v[0] || (v[0] = (A) => w(o.step))
          }, {
            default: U(() => [...v[5] || (v[5] = [
              ge("Zoom in", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            small: "",
            onClick: v[1] || (v[1] = (A) => w(1 / o.step))
          }, {
            default: U(() => [...v[6] || (v[6] = [
              ge("Zoom out", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            small: "",
            onClick: d
          }, {
            default: U(() => [...v[7] || (v[7] = [
              ge("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: i,
          class: "flowchart-frame",
          onWheel: Me(_, ["prevent"]),
          onPointerdown: S,
          onPointermove: L,
          onPointerup: v[2] || (v[2] = (A) => _s(l) ? l.value = null : l = null),
          onPointercancel: v[3] || (v[3] = (A) => _s(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: xe({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            v[8] || (v[8] = m("defs", null, [
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
            (c(!0), h(J, null, re(a.value.arrows, (A, q) => (c(), h("path", {
              key: `arrow-${q}`,
              class: "flowchart-arrow",
              d: A.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, ed))), 128)),
            (c(!0), h(J, null, re(a.value.nodes, (A) => (c(), h("g", {
              key: A.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: A.x,
                y: A.y,
                width: A.width,
                height: A.height,
                rx: "8"
              }, null, 8, td),
              m("text", {
                x: A.x + A.width / 2,
                y: A.y + A.padY + A.line / 2
              }, [
                (c(!0), h(J, null, re(A.lines, (q, Q) => (c(), h("tspan", {
                  key: Q,
                  x: A.x + A.width / 2,
                  dy: Q ? A.line : 0
                }, $(q), 9, sd))), 128))
              ], 8, nd)
            ]))), 128)),
            (c(!0), h(J, null, re(a.value.arrows, (A, q) => (c(), h(J, {
              key: `label-${q}`
            }, [
              A.label ? (c(), h("g", ad, [
                m("rect", {
                  x: A.label.x,
                  y: A.label.y,
                  width: A.label.width,
                  height: A.label.height,
                  rx: "4"
                }, null, 8, od),
                m("text", {
                  x: A.label.x + A.label.width / 2,
                  y: A.label.y + A.label.pad + A.label.line / 2
                }, [
                  (c(!0), h(J, null, re(A.label.lines, (Q, W) => (c(), h("tspan", {
                    key: W,
                    x: A.label.x + A.label.width / 2,
                    dy: W ? A.label.line : 0
                  }, $(Q), 9, id))), 128))
                ], 8, rd)
              ])) : P("", !0)
            ], 64))), 128))
          ], 12, Xu))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, cd = /* @__PURE__ */ Y(ld, [["__scopeId", "data-v-51d24cfe"]]), ud = ["title", "aria-label"], dd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, hd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, fd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = D(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: X(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", dd, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", hd)) : P("", !0)
      ]))
    ], 10, ud));
  }
}, pd = /* @__PURE__ */ Y(fd, [["__scopeId", "data-v-6dc92808"]]), md = "img,pre,table";
function gd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function vd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function yd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(md)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = gd(vd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function wd(e, t) {
  let n = null;
  const s = () => e.value && yd(e.value);
  Ne(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const kd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function bd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const xd = ["data-from", "data-ref"], $d = { class: "message-body" }, Md = ["innerHTML"], _d = ["innerHTML"], Sd = {
  class: "message-faces",
  "data-message-faces": ""
}, Ed = ["title", "data-face", "onClick"], Ad = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Cd = ["title", "data-reaction", "onClick"], Od = {
  key: 0,
  class: "message-reaction-count"
}, Td = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Bd = ["href", "title"], Ld = ["src", "alt"], Rd = ["href"], Id = { class: "message-foot" }, Dd = { class: "message-time" }, Nd = 1500, jd = "An earlier message", Pd = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = H(!1), o = H(null), i = D(() => ["user", "comment"].includes(n.message.type)), r = D(() => i.value && !n.message.read_at && !n.message.local);
    async function l() {
      var I;
      await ((I = navigator.clipboard) == null ? void 0 : I.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Nd);
    }
    const d = D(() => Zn(n.message.text ?? "", { env: "" })), f = D(() => JSON.parse(n.message.flowchart_edges || "[]")), w = H(!1), _ = D(() => Zn(n.quote || jd, { env: "" }));
    function S() {
      const I = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      I ? I.scrollIntoView({ block: "center", behavior: "smooth" }) : mt(`messages:${n.message.parent_id}`);
    }
    wd(o, () => `${n.message.text} ${n.quote}`);
    const L = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, b = (I) => `/api/files/message/${n.message.id}/${encodeURIComponent(I)}`, v = D(() => JSON.parse(n.message.captions || "{}")), A = D(() => (n.message.files ?? []).map((I) => ({ name: I, address: b(I), isImage: L.test(I), title: v.value[I] || I }))), q = D(() => Ra(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), Q = H(!1), W = D(() => bd(n.message.reactions));
    function C(I) {
      Q.value = !1, s("react", n.message, I);
    }
    return (I, y) => (c(), h("article", {
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": i.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", $d, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: "message-card md",
          onClick: y[2] || (y[2] = (...p) => G(ct) && G(ct)(...p))
        }, [
          e.message.parent_id ? (c(), h("div", {
            key: 0,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Me(S, ["stop"]),
            innerHTML: _.value
          }, null, 8, Md)) : P("", !0),
          m("div", { innerHTML: d.value }, null, 8, _d),
          f.value.length ? (c(), h(J, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: y[0] || (y[0] = (p) => w.value = !0)
            }, "Open the flowchart"),
            w.value ? (c(), K(cd, {
              key: 0,
              title: e.message.text,
              edges: f.value,
              onClose: y[1] || (y[1] = (p) => w.value = !1)
            }, null, 8, ["title", "edges"])) : P("", !0)
          ], 64)) : P("", !0)
        ], 512),
        m("div", {
          class: X(["message-tools", { picking: Q.value }]),
          "data-message-tools": ""
        }, [
          Q.value ? (c(), h(J, { key: 0 }, [
            m("div", Sd, [
              (c(!0), h(J, null, re(G(kd), (p) => (c(), h("button", {
                key: p,
                type: "button",
                class: "message-face",
                title: `React ${p}`,
                "data-face": p,
                onClick: (k) => C(p)
              }, $(p), 9, Ed))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: y[3] || (y[3] = (p) => Q.value = !1)
            }, [
              F(Ee, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(J, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: y[4] || (y[4] = (p) => Q.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: y[5] || (y[5] = (p) => s("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: l
            }, $(a.value ? "Copied" : "Copy"), 1),
            r.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: y[6] || (y[6] = (p) => s("delete", e.message))
            }, "Delete")) : P("", !0)
          ], 64))
        ], 2)
      ]),
      W.value.length ? (c(), h("div", Ad, [
        (c(!0), h(J, null, re(W.value, (p) => (c(), h("button", {
          key: p.emoji,
          type: "button",
          class: X(["message-reaction", { mine: p.mine }]),
          title: p.title,
          "data-reaction": p.emoji,
          onClick: (k) => s("react", e.message, p.emoji)
        }, [
          ge($(p.emoji) + " ", 1),
          p.count > 1 ? (c(), h("span", Od, $(p.count), 1)) : P("", !0)
        ], 10, Cd))), 128))
      ])) : P("", !0),
      A.value.length ? (c(), h("div", Td, [
        (c(!0), h(J, null, re(A.value, (p) => (c(), h(J, {
          key: p.name
        }, [
          p.isImage ? (c(), h("a", {
            key: 0,
            href: p.address,
            target: "_blank",
            class: "message-image",
            title: p.title
          }, [
            m("img", {
              src: p.address,
              alt: p.name
            }, null, 8, Ld)
          ], 8, Bd)) : (c(), h("a", {
            key: 1,
            href: p.address,
            target: "_blank",
            class: "message-file"
          }, $(p.name), 9, Rd))
        ], 64))), 128))
      ])) : P("", !0),
      m("div", Id, [
        m("time", Dd, $(q.value), 1),
        i.value ? (c(), K(pd, {
          key: 0,
          message: e.message
        }, null, 8, ["message"])) : P("", !0)
      ])
    ], 8, xd));
  }
}, gg = /* @__PURE__ */ Y(Pd, [["__scopeId", "data-v-204d3dec"]]), qd = ["aria-label"], _n = 200, Wd = 300, Ys = 400, Hd = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: _n } },
  setup(e) {
    const t = e, n = D(() => t.value < _n ? [1, 0.25, 0.25] : t.value === _n ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, a) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: e.value >= Ys, high: e.value >= Wd && e.value < Ys }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      m("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: xe({ opacity: n.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: xe({ opacity: n.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: xe({ opacity: n.value[2] })
      }, null, 4)
    ], 10, qd));
  }
}, vg = /* @__PURE__ */ Y(Hd, [["__scopeId", "data-v-89404405"]]), so = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], yg = (e) => {
  var t;
  return ((t = so.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Js = {
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
}, Fd = ["innerHTML"], Ud = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = D(() => Js[t.name] || Js.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Fd));
  }
}, St = /* @__PURE__ */ Y(Ud, [["__scopeId", "data-v-beb5935c"]]), zd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      F(St, { name: "fold" })
    ], 2));
  }
}, ao = /* @__PURE__ */ Y(zd, [["__scopeId", "data-v-d03899bb"]]), Vd = ["aria-checked", "aria-haspopup", "onClick"], Gd = {
  key: 0,
  class: "segmented-dot"
}, Kd = {
  key: 1,
  class: "segmented-count"
}, Yd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ma();
    return (a, o) => {
      const i = qo("tip");
      return c(), h("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(J, null, re(e.options, (r) => ft((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: X(["segmented-option", { on: r.key === e.value }]),
          onClick: (l) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", Gd)) : P("", !0),
          ge(" " + $(r.label) + " ", 1),
          r.count !== void 0 ? (c(), h("em", Kd, $(r.count), 1)) : P("", !0)
        ], 10, Vd)), [
          [i, r.tip || r.title, `${G(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Xn = /* @__PURE__ */ Y(Yd, [["__scopeId", "data-v-ca953072"]]), Zs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Jd = {
  key: 1,
  class: "text-field-label"
}, Zd = {
  key: 2,
  class: "text-field-end"
}, Qd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Hn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Wn(e, "modelValue"), s = va(), a = "onUpdate:modelValue" in (((f = Wo()) == null ? void 0 : f.vnode.props) || {}), o = D(() => a ? n.value : s.value), i = (w) => a && (n.value = w.target.value), r = D(
      () => Object.fromEntries(Object.entries(s).filter(([w]) => w !== "class" && w !== "style" && w !== "value"))
    ), l = D(() => Object.fromEntries(Object.entries(s).filter(([w]) => w !== "value"))), d = H(null);
    return t({ focus: () => d.value && d.value.focus() }), (w, _) => e.label || e.icon || w.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: w.$slots.end }, G(s).class]),
      style: xe(G(s).style)
    }, [
      e.icon ? (c(), K(Ee, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : P("", !0),
      e.label ? (c(), h("span", Jd, $(e.label), 1)) : P("", !0),
      ft(m("input", ht({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: i }), null, 16), [
        [G(Zs), o.value]
      ]),
      w.$slots.end ? (c(), h("span", Zd, [
        be(w.$slots, "end", {}, void 0, !0)
      ])) : P("", !0)
    ], 6)) : ft((c(), h("input", ht({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: i }), null, 16)), [
      [G(Zs), o.value]
    ]);
  }
}), Xd = /* @__PURE__ */ Y(Qd, [["__scopeId", "data-v-d9c38ca8"]]);
function eh(e, t, { incremental: n = !1 } = {}) {
  const s = ka(), a = H([]), o = H(""), i = H(!1), r = H(""), l = H(null);
  async function d(b) {
    const v = await s.read(`${e} --before-id ${b + 1} --limit 1`);
    if (!v.ok) return S();
    const A = v.value.rows.find((q) => q.id === b);
    a.value = A ? a.value.map((q) => q.id === b ? A : q) : a.value.filter((q) => q.id !== b);
  }
  async function f(b) {
    if (n && String((b == null ? void 0 : b.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((W) => W.id !== b.row_id));
    if (n && (b != null && b.row_id) && !String(b.event ?? "").endsWith(".create") && a.value.some((W) => W.id === b.row_id)) return d(b.row_id);
    if (!(n && a.value.length && String((b == null ? void 0 : b.event) ?? "").endsWith(".create"))) return S();
    const A = Math.max(...a.value.map((W) => W.id)), q = await s.read(`${e} --after-id ${A}`);
    if (!q.ok) return S();
    const Q = new Set(a.value.map((W) => W.id));
    a.value = [...q.value.rows.filter((W) => !Q.has(W.id)), ...a.value];
  }
  async function w() {
    if (!a.value.length) return !1;
    const b = Math.min(...a.value.map((q) => q.id)), v = await s.read(`${e} --before-id ${b}`);
    if (!v.ok || !v.value.rows.length) return !1;
    const A = new Set(a.value.map((q) => q.id));
    return a.value = [...a.value, ...v.value.rows.filter((q) => !A.has(q.id))], !0;
  }
  let _ = 0;
  async function S() {
    const b = ++_, v = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (b !== _) return;
    const A = v.ok ? s.shared ? [v.value] : v.value.rows : [], q = A.length ? Math.min(...A.map((Q) => Q.id)) : 0;
    a.value = n && v.ok && q ? [...a.value.filter((Q) => Q.id > Math.max(...A.map((W) => W.id))), ...A, ...a.value.filter((Q) => Q.id < q)] : A, o.value = v.ok ? "" : v.error, i.value = !0;
  }
  async function L(b) {
    const v = await s.run(b);
    return r.value = v.ok ? "" : v.error, l.value = v.ok ? v.value : null, await S(), v;
  }
  return s.follow(t, f), S(), { rows: a, failure: o, loaded: i, load: S, older: w, act: L, actionFailure: r, answer: l, context: s };
}
const th = { class: "title" }, nh = { class: "state" }, sh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = eh(t.line, t.events);
    return (o, i) => (c(), K(Nr, {
      rows: G(n),
      failure: G(s),
      loaded: G(a),
      empty: e.empty
    }, {
      default: U(({ row: r }) => [
        m("span", th, $(r.title), 1),
        m("span", nh, $(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, wg = /* @__PURE__ */ Y(sh, [["__scopeId", "data-v-a69084cd"]]), ah = ["data-tip", "aria-label"], oh = {
  key: 0,
  class: "mact-word"
}, rh = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      F(St, { name: "open" }),
      e.open ? (c(), h("span", oh, $(e.label), 1)) : P("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, ah));
  }
}, ih = /* @__PURE__ */ Y(rh, [["__scopeId", "data-v-3b292e09"]]), Sn = H(Date.now() / 1e3);
let Qs = 0, Pt = 0;
function lh() {
  return Pt || (Sn.value = Date.now() / 1e3, Qs = setInterval(() => Sn.value = Date.now() / 1e3, 1e3)), Pt += 1, ya() && wa(() => {
    Pt -= 1, Pt || clearInterval(Qs);
  }), Sn;
}
const ch = 120, En = 280, uh = 160, dh = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function hh(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = H(t()), a = H("");
  let o = 0;
  const i = (d, f) => Object.assign(d.style, { width: `${f.width}px`, height: `${f.height}px` }), r = (d) => Object.assign(d.style, { width: "", height: "", transition: "" });
  async function l(d) {
    const f = e.value, w = ++o;
    if (!f || !f.offsetWidth || dh()) {
      s.value = d;
      return;
    }
    const _ = { width: f.offsetWidth, height: f.offsetHeight };
    if (i(f, _), a.value = "leaving", await n(ch), w !== o) return;
    s.value = d, a.value = "resizing", await cn(), r(f);
    const S = { width: f.offsetWidth, height: f.offsetHeight };
    i(f, _), f.offsetWidth, f.style.transition = `width ${En}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${En}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, i(f, S), await n(En), w === o && (r(f), a.value = "entering", await n(uh), w === o && (a.value = ""));
  }
  return ke(t, (d) => l(d)), cs(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const fh = ["title", "data-figure-mark", "data-folded", "data-open"], ph = {
  key: 2,
  class: "worker"
}, mh = { class: "head" }, gh = { key: 0 }, vh = {
  key: 3,
  class: "status"
}, yh = {
  key: 0,
  class: "figure"
}, wh = {
  key: 1,
  class: "ran-for"
}, kh = { key: 2 }, bh = { key: 3 }, xh = {
  key: 4,
  class: "news"
}, $h = {
  key: 5,
  class: "spin",
  "aria-label": "Still running"
}, Mh = {
  key: 7,
  class: "settled"
}, _h = {
  key: 1,
  class: "bar"
}, Sh = {
  key: 3,
  class: "detail body"
}, Eh = {
  key: 0,
  class: "body-label"
}, Ah = ["title"], Ch = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = va(), s = ["onClick", "onAct"], a = D(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = H(!1), i = D(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = D(() => t.open !== void 0), l = D(() => r.value || i.value), d = D(() => r.value ? t.open : o.value), f = D(() => r.value ? !t.open : i.value && !o.value), w = D(() => !!(t.mark.action && n.onAct)), _ = D(() => l.value || w.value || !!n.onClick), S = H(null), L = H(null), { folded: b, phase: v } = hh(S, () => f.value);
    function A(le) {
      var pe, _e;
      if (!(le.target !== S.value && !L.value.contains(le.target))) {
        if (r.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, le);
        if (i.value) return void (o.value = !o.value);
        (_e = n.onAct || n.onClick) == null || _e(le);
      }
    }
    const q = (le) => n.onAct(le), Q = ["failed", "unfinished"], W = D(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Q.includes(t.mark.state) ? "danger" : "good" : ""), C = D(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), I = D(() => C.value || "var(--tone-work)"), y = D(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), p = lh(), k = D(
      () => t.mark.began_at && y.value && !t.mark.figure && !t.mark.counting ? Vi(p.value - t.mark.began_at) : ""
    ), M = D(() => {
      const { started: le, ended: pe } = t.mark;
      return le ? pe ? `ran ${Ds(pe - le, !0)}` : Ds(p.value - le, !0) : k.value;
    }), g = ["bad", "danger", "warn"], u = D(() => g.includes(W.value) || t.mark.asks ? "attention" : y.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), E = ["bad", "danger"], O = D(() => E.includes(W.value)), j = D(() => u.value === "process" ? "running" : O.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), ae = D(
      () => !!(t.mark.figure || M.value || t.mark.docked || t.mark.stopping || j.value || t.mark.settled || t.mark.news)
    ), oe = D(() => [t.mark.title, t.mark.time ? Ra(t.mark.time) : ""].filter(Boolean).join(" · ")), de = D(() => ({
      ...C.value ? { "--mark": C.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, pe) => (c(), h("div", ht(a.value, {
      ref_key: "root",
      ref: S,
      class: [
        "mark",
        `w-${u.value}`,
        G(v),
        {
          open: d.value,
          live: _.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: C.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: de.value,
      title: oe.value,
      "data-figure-mark": e.mark.key,
      "data-folded": G(b) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: A
    }), [
      (c(), K(tt(_.value ? "button" : "span"), {
        ref_key: "top",
        ref: L,
        class: "top",
        type: _.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!d.value) : void 0
      }, {
        default: U(() => [
          e.mark.markIcon ? (c(), K(St, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), K(Ee, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", ph, $(e.mark.worker), 1)) : P("", !0),
          m("span", mh, [
            F(ut, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", gh, $(e.mark.name), 1)) : P("", !0),
            l.value ? (c(), K(ao, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : P("", !0)
          ]),
          ae.value ? (c(), h("span", vh, [
            e.mark.figure ? (c(), h("span", yh, $(e.mark.figure), 1)) : P("", !0),
            M.value ? (c(), h("span", wh, $(M.value), 1)) : P("", !0),
            e.mark.docked ? (c(), h("span", kh, "In the dock")) : P("", !0),
            e.mark.stopping ? (c(), h("span", bh, "Stopping")) : P("", !0),
            e.mark.news ? (c(), h("span", xh, $(e.mark.news), 1)) : P("", !0),
            j.value === "running" ? (c(), h("span", $h)) : j.value ? (c(), K(St, {
              key: 6,
              class: X(["sign", j.value]),
              name: j.value
            }, null, 8, ["class", "name"])) : P("", !0),
            e.mark.settled ? (c(), h("span", Mh, $(e.mark.settled), 1)) : P("", !0)
          ])) : P("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      w.value ? (c(), K(ih, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: Me(q, ["stop"])
      }, null, 8, ["label", "open"])) : P("", !0),
      (e.mark.figure || e.mark.counting) && y.value ? (c(), h("span", _h, [
        m("span", {
          class: "progress",
          style: xe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: I.value })
        }, null, 4)
      ])) : P("", !0),
      e.mark.detail && !G(b) ? (c(), K(ut, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      e.mark.body && !G(b) ? (c(), h("div", Sh, [
        e.mark.bodyLabel ? (c(), h("p", Eh, $(e.mark.bodyLabel), 1)) : P("", !0),
        F(ut, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : P("", !0),
      e.mark.command && !G(b) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, $(e.mark.command), 9, Ah)) : P("", !0),
      e.mark.card ? (c(), K(ut, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      be(le.$slots, "default", {
        shown: !G(b)
      }, void 0, !0)
    ], 16, fh));
  }
}), Oh = /* @__PURE__ */ Y(Ch, [["__scopeId", "data-v-de840831"]]), Th = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function oo(e) {
  var n;
  const t = Th[e] || ((n = pn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Bh = (e) => oo(String(e).split(":")[0]), ro = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Lh = { passed: "good", failed: "danger", warned: "warn", running: "" }, Xs = {
  "open row": (e) => mt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Cr(e.target_model, e.target_id || 0)
}, Rh = { "open row": (e) => Bh(e.target_model), "open page": () => oo("pages") };
function Ih(e, t) {
  const n = t || {}, s = Xs[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" && Lh[e.outcome] || "",
    label: e.text,
    // a mark with a body of its module's own keeps its lines for that body, and its cut-off first part is not a second line
    detail: n.body_url ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Rh[s](e) : "",
    handlers: s ? { onAct: () => Xs[s](e) } : {}
  };
}
const Dh = 24, Nh = 1e3, ea = 2e3, jh = 0.25, Ph = 5e3;
function qh(e, t = Dh, n = () => !0) {
  const s = H(!1), a = H(0), o = H(!1);
  let i = 0, r = 0, l = 0;
  const d = () => e && "value" in e ? e.value : e, f = () => {
    const W = d();
    return W ? W.scrollHeight - W.scrollTop - W.clientHeight : 0;
  }, w = () => !d() || f() <= t;
  function _(W) {
    if (clearTimeout(i), !W) {
      o.value = !1, l = Date.now();
      return;
    }
    const C = Date.now() - l < ea ? ea : Nh;
    i = setTimeout(() => o.value = s.value, C);
  }
  function S() {
    clearTimeout(r), s.value = !1, a.value = 0, _(!1);
  }
  function L(W = !1) {
    const C = d();
    C && W && C.scrollTo ? C.scrollTo({ top: C.scrollHeight, behavior: "smooth" }) : C && (C.scrollTop = C.scrollHeight), S();
  }
  function b() {
    A(), !s.value && (s.value = !0, _(!0));
  }
  const v = () => !!d() && f() <= d().clientHeight * jh;
  function A() {
    clearTimeout(r), v() && (r = setTimeout(() => s.value && v() && n() && L(!0), Ph));
  }
  function q() {
    w() ? S() : b();
  }
  function Q(W = 1, C = !1) {
    s.value ? a.value += Math.max(0, W) : L(C);
  }
  return ya() && wa(() => [i, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: w, follow: S, toBottom: L, left: b, scrolled: q, arrived: Q };
}
const Wh = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = H(null), { away: o, scrolled: i, arrived: r, toBottom: l } = qh(a);
    ke(
      () => n.lines.length,
      () => cn(() => r()),
      { immediate: !0 }
    );
    function d(f) {
      i(), s("older", f.target);
    }
    return (f, w) => (c(), h("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: d
    }, [
      ge($(e.lines.join(`
`) || e.empty), 1),
      G(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: w[0] || (w[0] = (_) => G(l)(!0))
      }, "Follow")) : P("", !0)
    ], 544));
  }
}, Hh = /* @__PURE__ */ Y(Wh, [["__scopeId", "data-v-09394a20"]]), Fh = 1e4;
class Uh {
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
    return this.heardAt !== null && t - this.heardAt > Fh;
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
const zh = {
  key: 0,
  class: "frame-note"
}, Vh = {
  key: 0,
  class: "frame-note"
}, Gh = ["src", "title"], Kh = 1e3, Yh = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ka(), s = H(null), a = H(!1), o = H(!1);
    let i = null, r = 0;
    return Ne(() => {
      i = new Uh(s.value, n), i.start(), r = setInterval(() => {
        a.value = i.silent();
      }, Kh);
    }), Ae(() => {
      i == null || i.stop(), clearInterval(r);
    }), (l, d) => o.value ? (c(), h("p", zh, "This window was closed because it stopped answering.")) : (c(), h(J, { key: 1 }, [
      a.value ? (c(), h("div", Vh, [
        d[2] || (d[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        F(ye, {
          onClick: d[0] || (d[0] = (f) => o.value = !0)
        }, {
          default: U(() => [...d[1] || (d[1] = [
            ge("Close the window", -1)
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
        title: G(n).window
      }, null, 8, Gh)
    ], 64));
  }
}, Jh = /* @__PURE__ */ Y(Yh, [["__scopeId", "data-v-32a49046"]]), Zh = 0, Qh = "/api/lines", Xh = "/api/line";
class ef {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Zh));
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
        const n = await Ie.raw(Qh, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Ie.raw(Xh, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const tf = new ef();
class nf {
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
      n.patterns.some((s) => io(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function io(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const sf = { 1: "refused", 2: "usage", 3: "fault" }, af = 100, of = /"([^"]*)"|'([^']*)'|(\S+)/g;
function rf({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: i, open: r, options: l = H({}), declared: d = [], readOnly: f = !1, shared: w = null }) {
  const _ = /* @__PURE__ */ new Map(), S = new AbortController(), L = (b) => {
    const v = _.get(b);
    if (v && performance.now() - v.at < af) return v.answer;
    const A = zt(e, b, t, S.signal);
    return _.set(b, { answer: A, at: performance.now() }), A;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: D(() => s()),
    permissions: a,
    readOnly: f,
    shared: w,
    read: L,
    run: (b) => zt(e, b, t, S.signal),
    upload: (b) => cf(b, S.signal),
    cancel: () => S.abort(),
    follow: (b, v) => i.follow(e, b.filter((A) => o.some((q) => io(q, A))), v, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (b) => D(() => {
      var v;
      return l.value[b] ?? ((v = d.find((A) => A.key === b)) == null ? void 0 : v.default);
    }),
    setting: async (b, v) => {
      const A = await L(`window setting ${e} ${b}`);
      return A.ok ? A.value.value : v;
    },
    keep: (b, v) => zt(e, ["window", "save-setting", e, b, JSON.stringify(v)], t, S.signal)
  };
}
function lf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const tn = { ok: !1, failure: "cancelled", error: "" };
async function zt(e, t, n, s = void 0) {
  try {
    const a = await tf.add({ window: e, line: Array.isArray(t) ? t : uf(t), environment: n }, s);
    return s != null && s.aborted ? tn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: sf[a.code] || "fault", error: lf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? tn : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function cf(e, t = void 0) {
  try {
    const n = await Ie.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? tn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? tn : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function uf(e) {
  return [...e.matchAll(of)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function df({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const hf = {
  class: "allowance-prompt",
  role: "dialog"
}, ff = { class: "allowance-prompt-text" }, pf = { class: "allowance-prompt-buttons" }, mf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", hf, [
      m("p", ff, $(G(df)(e.request)), 1),
      m("div", pf, [
        F(ye, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            ge("Allow", -1)
          ])]),
          _: 1
        }),
        F(ye, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            ge("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, gf = /* @__PURE__ */ Y(mf, [["__scopeId", "data-v-102dc765"]]), An = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), K(Yt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: U(() => [
        ge($(e.reason) + " ", 1),
        e.retry ? (c(), K(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            ge("Retry", -1)
          ])]),
          _: 1
        })) : P("", !0),
        e.removable ? (c(), K(ye, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            ge("Remove tab", -1)
          ])]),
          _: 1
        })) : P("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, vf = ["data-window", "data-agent"], yf = {
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
    const n = e, s = t, a = H(""), o = H(0);
    function i() {
      a.value = "", o.value++;
    }
    const r = et(fr, null), l = rf({
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
      open: (w, _) => {
        s("open", w, _), r == null || r(w, _);
      }
    });
    Ho(nt, l), ke(() => n.visible, (w) => w && n.subscriptions.shown(n.name)), Ae(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), Fo((w) => (a.value = w instanceof Error ? w.message : String(w), n.subscriptions.stopAll(n.name), !1));
    const d = () => is(n.component), f = () => {
      var w, _;
      return ((_ = (w = n.prompts) == null ? void 0 : w.current.value) == null ? void 0 : _.window) === n.name ? n.prompts.current.value : null;
    };
    return (w, _) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (c(), K(gf, {
        key: 0,
        request: f(),
        onAnswer: _[0] || (_[0] = (S) => e.prompts.answer(S))
      }, null, 8, ["request"])) : P("", !0),
      e.unavailableReason ? (c(), K(An, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), K(An, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: i
      }, null, 8, ["name", "reason"])) : e.component ? (c(), K(d, { key: o.value })) : (c(), K(An, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: _[1] || (_[1] = (S) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, vf));
  }
}, lo = /* @__PURE__ */ Y(yf, [["__scopeId", "data-v-7d5e8ae6"]]), wf = {
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
    const t = e, n = { render: () => is(Jh, { src: t.entry.entry_url }) };
    return (s, a) => (c(), K(lo, {
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
}, es = "journal.stale-build-reload", kf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function bf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(es) === e.message) return !1;
    t.setItem(es, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function xf(e = window.sessionStorage) {
  try {
    e.removeItem(es);
  } catch {
    return;
  }
}
const $f = ["data-window"], Mf = {
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
    const t = e, n = ln(null), s = H("");
    return ke(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, xf();
          } catch (o) {
            if (kf(o) && bf(o)) return;
            s.value = `This window's file could not be loaded: ${o.message}`;
          }
      },
      { immediate: !0 }
    ), (a, o) => !n.value && !s.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      F(At, { shape: "cards" })
    ], 8, $f)) : (c(), K(lo, {
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
}, _f = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new nf(), s = ((r = et(nt, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = D(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), i = D(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (l, d) => i.value ? (c(), K(Mf, {
      key: 0,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), K(wf, {
      key: 1,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Sf = { class: "mark-more-inner" }, Ef = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Af = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Cf = {
  key: 3,
  class: "mark-lines"
}, Of = "process", ta = "task", Tf = 2e3, Bf = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = et(nt), s = D(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = D(() => ro.has(t.mark.variant) && t.mark.detail || ""), o = D(() => t.mark.target_model === ta ? t.mark.target_id : 0), i = H([]), r = H(!1), l = H(""), d = D(() => t.mark.target_model === Of && !!t.mark.target_id);
    async function f() {
      const S = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, l.value = S.ok ? "" : S.error, S.ok && (i.value = S.value.lines);
    }
    let w = null;
    const _ = () => clearInterval(w);
    return ke(() => t.shown && d.value, (S) => {
      _(), S && (f(), t.mark.ended_at || (w = setInterval(f, Tf)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (S) => S && t.shown && d.value && (_(), f())), Ae(_), (S, L) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: L[1] || (L[1] = Me(() => {
      }, ["stop"]))
    }, [
      m("div", Sf, [
        e.declaration.body_url ? (c(), K(_f, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(J, { key: 1 }, [
          a.value ? (c(), h(J, { key: 0 }, [
            L[2] || (L[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Ef, $(a.value), 1)
          ], 64)) : P("", !0),
          d.value && l.value ? (c(), h("p", Af, $(l.value), 1)) : d.value && r.value ? (c(), h(J, { key: 2 }, [
            L[3] || (L[3] = m("p", { class: "mark-label" }, "Output", -1)),
            F(Hh, {
              class: "mark-terminal",
              lines: i.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", Cf, $(s.value.join(`
`)), 1)) : P("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: L[0] || (L[0] = Me((b) => G(mt)(`${ta}:${o.value}`), ["stop"]))
          }, "Open task " + $(o.value) + " and its proofs", 1)) : P("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ts = /* @__PURE__ */ Y(Bf, [["__scopeId", "data-v-51f69bf1"]]), Lf = (e) => `show-${e}`, kg = (e, t, n) => e.filter((s) => {
  var a;
  return n(Lf((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Rf = "messages.chat", If = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), ns = (e, t, n) => zt(Rf, If(e, t), n), Df = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Nf = ["title", "aria-label", "onClick"], jf = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Pf = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = D(() => Df(t.buttons, t.allowedRuns).filter((i) => {
      var r;
      return !((r = i.variants) != null && r.length) || i.variants.includes(t.mark.variant);
    })), s = H(""), a = et(nt);
    async function o(i) {
      const r = await ns(i, t.mark, a.environment);
      s.value = r.ok ? "" : r.error;
    }
    return (i, r) => (c(), h(J, null, [
      (c(!0), h(J, null, re(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: Me((d) => o(l), ["stop"])
      }, [
        F(St, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Nf))), 128)),
      s.value ? (c(), h("span", jf, $(s.value), 1)) : P("", !0)
    ], 64));
  }
}, qf = /* @__PURE__ */ Y(Pf, [["__scopeId", "data-v-0dfda102"]]);
function co(e, t) {
  const n = ln(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((i) => [i.type, i])), a = async () => {
    try {
      return (await (await Ie.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const uo = co("/api/marks", "marks"), bg = uo.fetchAll, Wf = uo.find, Hf = ["data-ref"], Ff = ["data-ref"], Uf = { class: "mark-row" }, zf = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = e, s = D(() => Wf(n.mark.type)), a = D(() => Ih(n.mark, s.value)), o = D(() => {
      var r;
      return !!(n.mark.lines || n.mark.detail && ro.has(n.mark.variant) || t.has(n.mark.target_model) || (r = s.value) != null && r.body_url);
    }), i = H(!1);
    return (r, l) => {
      var d, f, w;
      return (d = s.value) != null && d.card ? (c(), h("div", {
        key: 0,
        class: "thread-turn card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        F(ts, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 8, Hf)) : (c(), h("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (f = s.value) == null ? void 0 : f.full_width }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Uf, [
          F(Oh, ht({
            mark: a.value,
            open: o.value ? i.value : void 0
          }, Uo(a.value.handlers), {
            onClick: l[0] || (l[0] = (_) => i.value = !i.value)
          }), zo({ _: 2 }, [
            o.value ? {
              name: "default",
              fn: U(({ shown: _ }) => [
                F(ts, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: _
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(qf, {
            buttons: (w = s.value) == null ? void 0 : w.buttons,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Ff));
    };
  }
}, xg = /* @__PURE__ */ Y(zf, [["__scopeId", "data-v-6fc6be2f"]]);
function Vf(e) {
  const t = H(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ne(() => n.observe(e.value)), cs(() => n.disconnect()), t;
}
const Gf = { class: "chat-dock-fold" }, Kf = ["aria-label"], Yf = { class: "chat-dock-head" }, Jf = { class: "chat-dock-inner" }, Zf = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = H(null), s = H(null), a = Vf(s);
    return t({ card: n }), (o, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted }])
    }, [
      m("div", Gf, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          be(o.$slots, "edge"),
          m("header", Yf, [
            be(o.$slots, "head")
          ]),
          m("div", {
            class: X(["chat-dock-body", { folded: e.folded }])
          }, [
            m("div", Jf, [
              m("div", {
                class: "chat-dock-grow",
                style: xe(G(a) === null ? null : { height: `${G(a)}px` })
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
        ], 10, Kf)
      ])
    ], 2));
  }
}, Qf = /* @__PURE__ */ Y(Zf, [["__scopeId", "data-v-e27493a6"]]), Xf = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Cn = 5, e1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Cn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Cn}s`, animationDelay: `${(n - Cn).toFixed(2)}s` };
    return (a, o) => (c(), h("span", Xf, [
      m("i", { style: s })
    ]));
  }
}, t1 = /* @__PURE__ */ Y(e1, [["__scopeId", "data-v-d0c4b012"]]), ho = co("/api/docks", "docks"), $g = ho.fetchAll, ss = ho.find, n1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), na = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function s1(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [na("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || pn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    na("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const a1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: n1(e, t),
  buttons: s1(e, t)
}), o1 = { class: "dock-title" }, r1 = ["aria-expanded", "title"], i1 = { class: "chat-dock-acts dock-acts" }, l1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, c1 = {
  key: 1,
  class: "dock-text"
}, u1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = D(() => ss(s.item.type)), o = H(null), i = D(() => a1(s.item, a.value)), r = et(nt), l = H(/* @__PURE__ */ new Set()), d = H("");
    async function f(S) {
      if (S.action === "open") return mt(`${s.item.target_model}:${s.item.target_id}`);
      if (S.action !== "declared") return ns(S, s.item, r.environment);
      l.value = /* @__PURE__ */ new Set([...l.value, S.label]), d.value = "";
      const L = await ns(S, s.item, r.environment);
      (L == null ? void 0 : L.ok) === !1 && (l.value = new Set([...l.value].filter((b) => b !== S.label)), d.value = L.error);
    }
    const w = D(() => i.value.buttons.filter((S) => S.action !== "undock" && !l.value.has(S.label))), _ = D(() => i.value.buttons.find((S) => S.action === "undock"));
    return (S, L) => (c(), K(Qf, {
      label: i.value.title,
      folded: e.folded
    }, {
      edge: U(() => [
        e.leaving ? (c(), K(t1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : P("", !0)
      ]),
      head: U(() => {
        var b, v, A;
        return [
          (b = a.value) != null && b.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(J, { key: 1 }, [
            F(Ee, {
              name: i.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            m("span", o1, $(i.value.title), 1)
          ], 64)),
          (v = a.value) != null && v.badge ? (c(), h("span", {
            key: 2,
            class: X(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, $(a.value.badge), 3)) : P("", !0),
          (A = a.value) != null && A.draws_head ? P("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: L[0] || (L[0] = (q) => n("fold"))
          }, [
            F(ao, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, r1)),
          m("span", i1, [
            (c(!0), h(J, null, re(w.value, (q) => (c(), K(ye, {
              key: q.action + q.runs,
              small: "",
              kind: q.primary ? "primary" : "ghost",
              bordered: !q.primary,
              "data-dock-action": q.action,
              onClick: (Q) => f(q)
            }, {
              default: U(() => [
                ge($(q.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          F(ds, {
            title: _.value.label,
            "data-dock-action": "undock",
            onClick: L[1] || (L[1] = (q) => f(_.value))
          }, null, 8, ["title"])
        ];
      }),
      default: U(() => {
        var b, v;
        return [
          d.value ? (c(), h("p", l1, $(d.value), 1)) : P("", !0),
          e.item.text && !((b = a.value) != null && b.body_url) ? (c(), h("p", c1, $(e.item.text), 1)) : P("", !0),
          (v = a.value) != null && v.body_url ? (c(), K(ts, {
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
}, sa = /* @__PURE__ */ Y(u1, [["__scopeId", "data-v-608c189e"]]), d1 = 24, h1 = 8, Mg = 420;
function _g({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= d1 && e > t ? !0 : e < t && a > h1 ? !1 : null;
}
const f1 = (e, t) => e === void 0 ? t : e, p1 = 6, m1 = 3, aa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, fo = (e) => !!(e.leaves_at && !e.kept), g1 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!fo(e) || t < e.leaves_at || n.has(e.id)), v1 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => g1(s, t, n)).sort((s, a) => s.id - a.id);
function y1(e, t, n = p1) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const w1 = (e, t) => e >= m1 ? !0 : e <= 1 ? !1 : t, k1 = { class: "dock-stack" }, b1 = ["onMouseenter", "onMouseleave"], x1 = ["onMouseenter", "onMouseleave"], $1 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = H(Date.now() / 1e3), s = H(/* @__PURE__ */ new Set()), a = H(!1), o = H(!1), i = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ae(() => clearInterval(i));
    const r = D(() => v1(t.items, n.value, s.value)), l = D(() => y1(r.value.filter((v) => aa(v, ss)), n.value)), d = D(() => r.value.filter((v) => !l.value.includes(v) && !aa(v, ss))), f = D(() => (a.value = w1(l.value.length, a.value)) && !o.value), w = H({}), _ = (v) => f1(w.value[v.id], t.folded);
    function S(v) {
      w.value = { ...w.value, [v.id]: !_(v) };
    }
    function L(v) {
      s.value = /* @__PURE__ */ new Set([...s.value, v.id]);
    }
    function b(v) {
      s.value = new Set([...s.value].filter((A) => A !== v.id));
    }
    return (v, A) => (c(), h("div", k1, [
      (c(!0), h(J, null, re(d.value, (q) => (c(), h("div", {
        key: q.id,
        onMouseenter: (Q) => L(q),
        onMouseleave: (Q) => b(q)
      }, [
        F(sa, {
          item: q,
          leaving: G(fo)(q) && !s.value.has(q.id),
          folded: _(q),
          onFold: (Q) => S(q)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, b1))), 128)),
      (c(!0), h(J, null, re(f.value ? [] : l.value, (q) => (c(), h("div", {
        key: q.id,
        onMouseenter: (Q) => L(q),
        onMouseleave: (Q) => b(q)
      }, [
        F(sa, {
          item: q,
          folded: _(q),
          onFold: (Q) => S(q)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, x1))), 128)),
      f.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "dock-runs-row",
        title: "Show each run as its own card",
        onClick: A[0] || (A[0] = (q) => o.value = !0)
      }, $(l.value.length) + " runs", 1)) : P("", !0)
    ]));
  }
}, Sg = /* @__PURE__ */ Y($1, [["__scopeId", "data-v-8ad7aad9"]]), xt = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Vt = (e) => Math.min(Math.max(e, 0), 1), M1 = (e) => {
  const t = Vt(e);
  return t * t * (3 - 2 * t);
}, Ze = (e, t, n) => M1((e - t) / (n - t));
function Eg(e) {
  const t = Vt(e), n = Vt((t - 0.12) / 0.76) * xt.shuffles, s = Math.min(Math.floor(n), xt.shuffles - 1), a = n - s, o = Ze(a, 0.26, 0.38) * (1 - Ze(a, 0.76, 0.96)), i = Ze(a, 0.38, 0.76), r = Ze(t, 0, 0.12) * (1 - Ze(t, 0.88, 1)), l = Ze(a, 0.2, 0.34) * (1 - Ze(a, 0.84, 1)), d = Math.sin(Math.PI * Vt((a - 0.45) / 0.55)) ** 2;
  return { moved: i, across: (s + i) / xt.shuffles, lift: xt.lift * o, ready: r, weight: l, follow: d, shuffle: s, phase: a };
}
const po = 2400, _1 = 0.05;
function Ag({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, _1), i = Math.min(t + po * o, a), r = e + i * o;
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
}, as = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), S1 = (e) => e * e * (3 - 2 * e), nn = (e, [t, n]) => S1(as(e, t, n)), E1 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ve = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, qt = ([e, t], n) => e + n() * (t - e);
function A1(e) {
  return E1.map(() => {
    const t = qt(Ve.speed, e), n = qt(Ve.angle, e) * Math.PI / 180, s = qt(Ve.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [qt(Ve.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const C1 = A1(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function O1(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ve.gravity * (t[2] - Ve.floor))) / Ve.gravity;
}
function Cg(e, t, n = C1) {
  const s = Ke.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], i = O1(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= i + r) return null;
  const l = Math.min(a, i), d = s.from.map((f, w) => f + o.velocity[w] * l);
  return d[2] -= Ve.gravity * l * l / 2, { at: d, turn: o.spin * l, landed: Math.max(0, a - i) / r };
}
function Og(e, t) {
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
const Tg = () => Array.from({ length: Ke.pogo.count }, (e, t) => Ke.pogo.bounce * (t + 1) / Ke.pogo.count), Bg = { stride: 0.5 };
function mo(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: as(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: as(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Lg(e) {
  const { into: t, out: n } = mo(Ke.rope_swing, e);
  return 1 - nn(t, [0, 1]) * (1 - nn(n, [0, 1]));
}
function Rg(e) {
  const t = Ke.rope_swing, { into: n, out: s } = mo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return nn(n, [0, 1]) * (1 - nn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const T1 = { after: 3 }, B1 = 10, L1 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, R1 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, I1 = { weight: 19 }, D1 = {
  build: { cooldown: 180 }
}, N1 = { every: 120 }, go = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, vo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, j1 = {
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
}, Bt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: B1 }), Z = (e, t, n = {}) => Bt(e, "clip", t, n), On = (e, t, n = {}) => Bt(e, "look", t, n), oa = (e, t, n = {}) => Bt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Bt(e, "pick", t, n), ...s }), fe = (e) => Bt("nothing", "nothing", e, {}), P1 = 120, q1 = 300, Tn = (e, t) => ({ ...Z(e, t), cooldown: q1 }), W1 = 120, ee = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), H1 = () => [Z("joy", 2)], Qe = (e, t, n, s, a = {}) => ({ ...Z(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), Xe = (e) => ({ ...e, cooldown: L1[e.name] }), bt = (e) => ({ ...e, shenanigan: !0, lasts: R1[e.name] }), ws = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ee("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [Z("nod", 2), fe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ee("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...Xe(Z("bug_shot", 3)), toward: "", onto: !1 },
    { ...Xe(Z("bug_smash", 2)), toward: "", onto: !1 },
    Z("nod", 2)
  ]),
  ...ee("tests_failed", { cooldown: 20, toward: "card" }, [Z("startled", 2), Z("dismay", 1), Z("tantrum", 3), fe(1)]),
  ...ee("committed", { cooldown: 30, toward: "card", onto: !0 }, [Z("nod", 2), fe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ee("sin_fixed", { cooldown: 300 }, [Z("halo", 1), fe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ee("sin_committed", { cooldown: 300 }, [Z("repent", 1), fe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...ee("messaged", { cooldown: W1 }, [Z("phone_call", 1)]),
  ...ee("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [Z("nod", 4), Z("hand_rub", 4), fe(7)]),
  ...ee("question_asked", { cooldown: 60 }, [Z("ask_sign", 9), Z("look_up", 3), fe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ee("reported", { cooldown: 90 }, [oa("read", 3), Z("nod", 1), fe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ee("read_message", { cooldown: 30 }, [oa("read", 3), fe(1)]),
  ...ee("fact_filed", { cooldown: 120 }, [Z("file_card", 3), Z("nod", 1), fe(6)]),
  ...ee("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [Z("nod", 2), fe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ee("bar_done", { holds: !0 }, H1()),
  ...ee("bar_failed", { holds: !0 }, [Z("fume", 1), Z("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ee("standing", { cooldown: 12 }, [Z("look_left", 2), Z("look_right", 2), Z("look_up", 1), fe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ee("launched", { cooldown: 300 }, [Z("tumble", 3), fe(47)]),
  // a break from the hammering now and then
  ...ee("building", { cooldown: 30 }, [Z("wipe_brow", 4), Z("look_left", 1), Z("look_right", 1), fe(69)]),
  ...ee("failed", { cooldown: 20, toward: "card" }, [Z("shake", 3), Z("tantrum", 2), fe(2)]),
  ...ee("refused", { cooldown: 20 }, [Z("shake", 1), fe(1)]),
  ...ee("work_done", { cooldown: 120 }, [Z("stretch", 2), fe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ee("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...ee("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...ee("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...ee("answered", { cooldown: 15 }, [On("amused", 3), fe(2)]),
  ...ee("heard", { cooldown: 30 }, [
    Z("bow", 1, { voices: ["butler"] }),
    Z("salute", 1, { voices: ["squire"] }),
    Z("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    fe(1)
  ]),
  ...ee("long_walk", { cooldown: 90 }, [Z("stumble", 3), fe(22)]),
  ...ee("card_arrived", { cooldown: 20, toward: "card" }, [Z("glance", 7), fe(13)]),
  ...ee("typing", { cooldown: 60 }, [On("reading", 1), fe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(j1).flatMap(([e, t]) => ee(`reacted:${e}`, {}, [On(t, 1)])),
  ...Object.entries(go).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ee(`agent_reacted:${n}`, {}, [Z(s, 1, { voices: [e] })])[0])),
  ...Object.entries(vo).flatMap(([e, t]) => ee(`agent_reacted:${e}`, {}, [Z(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ee("pastime", {}, [
    Qe("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    Qe("rest", 3, 180, 120),
    Qe("yawn", 2, 60, 60),
    Qe("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    Qe("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    Qe("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    Qe("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...bt(Xe(Z("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    bt(Xe(Z("disco", 2, { ball: "bubble" }))),
    fe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ee("held:search", { cooldown: P1 }, [Tn("search", 3), { ...Tn("binoculars", 2), when: { home: !0 } }, { ...Tn("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ee("held:type", {}, [Z("type", 3), Z("type_ponder", 1)]),
  ...ee("held:watch", {}, [Z("watch", 2), Z("wave_up", 1)]),
  ...ee("held:compacting", {}, [Z("pack_box", 3), Z("vacuum", 2), Z("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ee("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), fe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ee("tickled", {}, [{ ...Xe(Z("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ee("eager", {}, [Z("eager", 2, { slow: !0 }), fe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ee("jump", {}, [bt(Xe(Z("backflip", 7, { high: !0 }))), Z("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ee("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ee("unit", { cooldown: D1.build.cooldown }, [ce("unit", I1.weight), fe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ee("progress_jump", { cooldown: 6 }, [Z("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ee("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...ee("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ee("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: N1.every }, ce("stand", 5)]),
  // a digit a blow's dust lets out
  ...ee("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ee("roam", {}, [
    ce("rest", 35, {}, { stay: [25, 60] }),
    ce("seat", 15, {}, { stay: [15, 40] }),
    ce("edge", 25, {}, { stay: [8, 20] }),
    bt(ce("bubble", 15, {}, { stay: [30, 80] })),
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
    bt(Xe(ce("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...ee("laptop", {}, [ce("seat", 6, {}, { stay: [60, 150] }), ce("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ee("ledge_at", {}, [ce("middle", 2, {}, { along: 1 / 2 }), ce("third", 1, {}, { along: 1 / 3 }), ce("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ee("composed_as", {}, [
    ce("facing", 4, {}, { turn: 0, leans: 0 }),
    ce("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ce("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ce("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ce("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], F1 = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), yo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), U1 = (e) => Array.isArray(e) ? e[0] : e, z1 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function V1(e) {
  var d;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || yo(f).every(([w, _]) => n(w) >= U1(_)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = ws.filter((f) => F1(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= T1.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, l = r.filter((f) => {
    var w;
    return f.kind === "nothing" || f.name !== ((w = e.tally) == null ? void 0 : w.last);
  });
  return l.some((f) => f.kind !== "nothing") ? l : r;
}
function G1(e, t) {
  const n = V1(e);
  let s = t() * n.reduce((o, i) => o + i.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (wo(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function wo(e, t, n) {
  var s;
  for (const [a, o] of yo(t)) (s = e.memory) == null || s.set(a, e.now + z1(o, n));
}
function Ig(e, t, n) {
  wo(e, ws.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const ra = {
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
}, Dg = {
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
}, Ng = 120, jg = (e) => ra[e] || ra.idle;
[.../* @__PURE__ */ new Set([...Object.values(go).flatMap((e) => Object.keys(e)), ...Object.keys(vo)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function Pg(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Te.ahead * n ? 180 : Math.sign(s) * Te.turn;
}
const ia = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function qg(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), i = Math.floor(o / Te.sweep) % a, r = o % Te.sweep, l = Te.sweep - Te.returnSeconds, d = ia((r - l) / Te.returnSeconds), f = r <= l ? ia(r / l) : 1 - d, w = i + ((i + 1) % a - i) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + w * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const K1 = 1, Y1 = (e, t, n, s, a, o = 0) => G1({ moment: "jump", high: e > K1 * t, memory: s, now: a, room: o }, n).name === "backflip", la = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, Wg = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, Hg = { width: 24, height: 27, top: 3, units: 2 }, J1 = "[data-figure-pile]", Fg = { amber: [1, 0.69, 0.125], good: la.colours.good, bad: la.colours.bad }, Bn = { phases: 4, dim: 0.25 }, Ug = (e, t, n) => e !== "amber" || (t + n) % Bn.phases < Bn.phases / 2 ? 1 : Bn.dim, Z1 = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(ws.filter((e) => Z1.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const zg = {
  width: 84,
  belly: 13,
  blink: 4
}, ca = "[data-figure-home]", Lt = () => {
  var t;
  const e = document.querySelector(ca);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ca)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Q1 = "[data-figure-docked-bars]", X1 = "[data-figure-chat-foot]", ep = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", tp = "[data-figure-newest]";
function np() {
  var s, a;
  const e = (s = Lt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(tp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var i, r;
      return !((i = o.closest) != null && i.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ks(o)) continue;
    const i = o.getBoundingClientRect();
    if (i.right > i.left && i.bottom > i.top) return i;
  }
  return null;
}
function ko(e, t, n = np()) {
  if (!e || !n) return !0;
  const s = gt(e, t), a = bs(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ge.top * t.size, bottom: s.top + Ge.bottom * t.size }, i = xt.gap;
  return !$o(o, { left: n.left - i, right: n.right + i, top: n.top - i, bottom: n.bottom + i });
}
const Ln = 0.26, sp = 0.54, vn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ln, travels: "stand" },
  lounge: { drop: Ln, travels: "stand" },
  composed: { drop: Ln, travels: "stand" },
  hang: { drop: sp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, bo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), ap = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Vg = (e, t) => (e === "sit" ? ap.has(t) : bo.has(e)) ? e : "stand", Gg = 0.25, Kg = (e, t) => bo.has(e) && vn[t].drop === 0, xo = 2, op = 90, rp = 180, ip = 140, lp = 280, cp = 420, up = 0.25, dp = 290, hp = 600, fp = "cubic-bezier(0.2, 0.7, 0.4, 1)", pp = "cubic-bezier(0.55, 0, 0.9, 0.6)", Rn = 5;
function sn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: i = !1, sprinting: r = !1, random: l = Math.random, memory: d = null, now: f = 0, room: w = 0, pogo: _ = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Rn) return null;
  (i || r) && (o = Math.max(o, xo));
  const S = o > 1, L = Math.abs(t.x - e.x), b = L < Rn ? 0 : L / (op * o) * 1e3, v = Math.min(b, S ? ip : rp), A = Math.abs(t.y - e.y), q = t.y < e.y, Q = q && !_ && Y1(A, n, l, d, f, w), W = q ? cp + Math.min(A, 400) * up : Math.sqrt(2 * A / po) * 1e3, C = {
    x: t.x,
    y: t.y,
    ms: A > Rn ? Q ? hp : W : 0,
    lead: Q ? dp : q ? lp : 0,
    easing: q ? fp : pp,
    hopping: !0,
    clip: Q ? "backflip" : q ? "jump" : "fall"
  }, I = { x: t.x, y: t.y, ms: b + v, lead: 0, easing: "linear", ramp: v, ...S ? { clip: "run" } : {} }, y = _ ? mp(t, n) : C, p = q && !s ? [{ ...I, y: e.y }, y] : [{ ...C, x: e.x }, I];
  return { way: Math.sign(t.x - e.x) || 1, legs: p, lands: !a, pace: o, running: S };
}
const mp = (e, t) => ({ x: e.x, y: e.y, ms: Ke.pogo.frames / Ke.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), gt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - vn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, $o = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ks = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function vt() {
  var t;
  const e = (t = Lt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Wt = 0.5, ua = 20;
function Yg(e, t, n = vt()) {
  const s = gt(e, t);
  return s.left >= n.left + ua && s.right <= n.right - ua;
}
function Mo(e, t, n = vt()) {
  const s = gt(e, t), a = s.right - s.left, o = bs(e), [i, r] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return i >= n.left - Wt && r <= n.right + Wt && s.top >= n.top - Wt && l <= n.bottom + Wt;
}
const an = [0.35, 0.5, 0.65], on = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ge = { left: an[0], right: an.at(-1), top: on[0], bottom: on.at(-1) }, gp = 0.24;
function bs(e) {
  if (e.posture === "stand") return { left: Ge.left, right: Ge.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + gp * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ge.left, t), right: Math.max(Ge.right, t) };
}
function vp(e, { size: t }, n = vt()) {
  const s = bs(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const yp = (Ge.right - Ge.left) / 2 + 0.08;
function wp(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !ks(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, i = Math.min(a.startOffset, o.length - 1);
  for (const l of [i - 1, i].filter((d) => d >= 0)) {
    if (!o.data[l].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, l), d.setEnd(o, l + 1), [...d.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const kp = (e) => on.flatMap(
  (t) => an.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function bp(e, t, n = "") {
  if (!ko(e, t)) return an.length * on.length;
  const s = gt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(ep)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: l }) => l.width && l.height && $o(a, l) && ks(r)).map(({ rect: r }) => r), i = (r, l) => o.some((d) => r >= d.left && r <= d.right && l >= d.top && l <= d.bottom);
  return kp(a).filter(([r, l]) => i(r, l) || wp(r, l, n)).length;
}
function xp(e, t, n) {
  const s = vt(), a = (i) => n ? Math.hypot(i.x - n.x, i.y - n.y) : 0, o = e.filter((i) => Mo(i, t, s) && ko(i, t)).map((i) => ({ spot: i, covered: bp(i, t), away: a(i) }));
  return o.length ? o.reduce(
    (i, r) => r.covered < i.covered || r.covered === i.covered && r.away < i.away ? r : i
  ).spot : null;
}
const _o = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, $p = yp, Mp = (e, t, { size: n }, s = $p) => _p(e, _o[t], s * n, "stand");
function _p(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Jg = (e) => ((e + 180) % 360 + 360) % 360 - 180, Zg = { turns: [-20, -10, 0, 10, 20] }, Sp = 7;
function Ep() {
  const e = [...document.querySelectorAll(J1)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const Ap = 4;
function Cp() {
  const e = So(), t = Ep(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Ap || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Sp - n, 0) } };
}
const Qg = ({ size: e, below: t }) => (1 - t) * e;
function Op(e, t) {
  const n = vt(), { size: s, below: a } = t, o = vn[e.posture].drop * s;
  return { ...vp(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Tp = (e, t) => Object.keys(_o).map((n) => Op(Mp(e, n, t), t)), Bp = (e, t, n) => xp(e, t, n) ?? e[0];
function Xg(e, t) {
  const { element: n, edge: s } = Cp();
  return { ...Bp(Tp(s, e), e, t), view: null, on: n };
}
function So() {
  var s;
  const e = Lt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Q1);
  if (!t) return { ...Eo(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Eo() {
  const e = Lt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const Lp = { climb: 90 };
function ev(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: i = !1, random: r = Math.random, via: l = [], memory: d = null, now: f = 0, room: w = 0, pogo: _ = !1 } = {}) {
  (o || i) && (a = Math.max(a, xo));
  const S = (Q) => {
    const W = gt(Q, n, vn[Q.posture].travels);
    return { x: W.left, y: W.top };
  }, L = t.ladder ?? e.ladder;
  if (L && !(t.ladder && e.ladder)) return Rp(S(e), S(t), S({ ...L.foot, posture: "stand" }), L.way, !!t.ladder, n, a);
  const [b, ...v] = [e, ...l, t].map(S), A = sn(b, v[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: i, random: r, memory: d, now: f, room: w, pogo: _ }), q = v.slice(1).map((Q, W) => {
    var C;
    return (C = sn(v[W], Q, n.size, { random: r, memory: d, now: f, room: w })) == null ? void 0 : C.legs.find((I) => I.hopping);
  });
  return A && { ...A, legs: [...A.legs, ...q.filter(Boolean)] };
}
function Rp(e, t, n, s, a, o, i) {
  const r = (f, w) => ({ x: w.x, y: w.y, ms: Math.hypot(w.x - f.x, w.y - f.y) / Lp.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? sn(e, n, o.size, { pace: i }) : sn(n, t, o.size, { pace: i }), d = a ? [...(l == null ? void 0 : l.legs) ?? [], r(n, t)] : [r(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: i, running: i > 1 };
}
const Ip = "[data-figure-bubble]", Dp = 250;
let $t = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ao = 0;
const Co = () => $t, In = /* @__PURE__ */ new WeakMap();
let Np = 0;
function Oo(e) {
  return In.has(e) || In.set(e, `floor-${++Np}`), In.get(e);
}
const jp = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Pp = () => {
  var e, t;
  return ((t = (e = Lt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function qp(e, t) {
  var s;
  const n = (s = e.querySelector(X1)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Wp(e, t) {
  const n = e && qp(e, t), s = e ? [...e.querySelectorAll(Ip)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: i }) => ({ element: o, kind: i, box: o.getBoundingClientRect() })).filter(({ kind: o, box: i }) => i.width > 0 && i.height > 0 && (o !== "bubble" || jp(i, n))).map(({ element: o, kind: i, box: r }) => ({ id: Oo(o), kind: i, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Hp = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Dp ? (t.top - s.top) / a * 1e3 : 0;
};
function Fp(e = $t, t = performance.now()) {
  const n = vt(), s = Pp(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: i, edge: r } = So(), l = [];
  o && l.push({ id: "home", kind: i ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = Eo();
  return d.element && l.push({ id: Oo(d.element), kind: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), l.push(...Wp(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((f) => Object.freeze({ ...f, vy: Hp(e, f, t) }))) });
}
const os = /* @__PURE__ */ new Set();
function Up(e) {
  return os.add(e), () => os.delete(e);
}
function zp() {
  To();
  const e = () => {
    Ao = requestAnimationFrame(e), !document.hidden && ($t = Fp($t), os.forEach((t) => t($t)));
  };
  e();
}
function To() {
  cancelAnimationFrame(Ao);
}
const Vp = (e, t) => e.find((n) => n.id === t) ?? null;
function tv(e, t, n = Co().floors) {
  const s = Vp(n, "home");
  return e.posture === "hang" && s && gt(e, t).bottom >= s.top ? !1 : Mo(e, t);
}
const Gp = ["data-kind"], Kp = { class: "figure-floor-name" }, Yp = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: xe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", Kp, $(e.floor.kind), 1)
    ], 12, Gp));
  }
}, Jp = /* @__PURE__ */ Y(Yp, [["__scopeId", "data-v-8f6132da"]]), Zp = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Qp = {
  __name: "FigureFloors",
  setup(e) {
    const t = ln(Co().floors);
    let n = () => {
    };
    return Ne(() => {
      n = Up((s) => t.value = s.floors), zp();
    }), Ae(() => {
      n(), To();
    }), (s, a) => (c(), h("div", Zp, [
      (c(!0), h(J, null, re(t.value, (o) => (c(), K(Jp, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, nv = /* @__PURE__ */ Y(Qp, [["__scopeId", "data-v-e519168b"]]), Dn = (e) => typeof e == "number" ? e : Date.parse(e);
function sv(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Dn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Dn(a.row.created_at) - Dn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Xp = 2e3;
function av(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, Xp);
  };
  Ne(async () => {
    await e(), s();
  }), cs(() => clearTimeout(n));
}
const da = "newest";
function ov(e, { title: t, isOpen: n = null }) {
  const s = H(""), a = H(da), o = H("all"), i = D(() => {
    const r = s.value.trim().toLowerCase(), l = e.value.filter((d) => (!r || JSON.stringify(d).toLowerCase().includes(r)) && (o.value === "all" || !n || n(d) === (o.value === "open")));
    return a.value === da ? l : [...l].sort((d, f) => t(d).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: i, hasStates: !!n };
}
const e0 = {
  class: "list-tools",
  "data-list-tools": ""
}, t0 = {
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
    return (s, a) => (c(), h("div", e0, [
      F(Xd, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      F(Xn, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (c(), K(Xn, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : P("", !0)
    ]));
  }
}, rv = /* @__PURE__ */ Y(t0, [["__scopeId", "data-v-b2dd0a0d"]]);
function iv() {
  const e = H(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const n0 = 86400, rs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function s0(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((rs(t) - rs(e)) / n0);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function lv(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = rs(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: s0(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Nn = 280, jn = 240, Pn = 120, a0 = 6, o0 = 14, Et = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function r0(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const i = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${o0}px)` }), e.offsetHeight, e.style.transition = `height ${Nn}ms ${Et}`, e.style.height = `${i}px`;
  const r = a();
  let l = !1;
  const d = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - r;
    if (!l && f >= Nn && (l = !0, e.style.transition = `opacity ${jn}ms ease-out, transform ${jn}ms ${Et}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Nn + jn) return s(d);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(d);
}
function cv(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${a0}px)` }), e.offsetHeight, e.style.transition = `opacity ${Pn}ms ease-out, transform ${Pn}ms ${Et}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const i = a(), r = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - i < Pn) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const i0 = 140, Ht = 220, l0 = 5;
function uv({ gap: e = i0, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, l0);
    if (s = r.length > 0, !s) return;
    let l = r.length;
    for (const d of r)
      d.el.style.display = d.display, d.arrival(d.el, d.options, () => {
        d.done(), l -= 1, l || t(o, e);
      });
  }
  const i = (r, l, d, f = r0) => {
    if (!l.pane || !l.follows()) return d();
    const w = { el: r, options: l, done: d, arrival: f, display: r.style.display || "" };
    if (!s)
      return s = !0, f(r, l, () => a(w));
    r.style.display = "none", n.push(w);
  };
  return i.flush = () => {
    for (const r of n.splice(0))
      r.el.style.display = r.display, r.done();
  }, i;
}
function dv(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Ht}ms ${Et}, opacity ${Ht}ms ease-in, margin ${Ht}ms ${Et}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Ht);
}
const Bo = "chat.pins.minimised", Gt = H(Mt(Bo, !1));
function ha(e) {
  Gt.value = e, un(Bo, e);
}
function c0(e) {
  const t = D(() => e()), n = D(() => Gt.value ? [] : e()), s = () => ha(!Gt.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Ca(o) > a).length,
    (o, i) => o > i && ha(!1)
  ), { pins: t, visible: n, minimised: Gt, toggle: s };
}
const u0 = ["title"], d0 = {
  key: 0,
  class: "pins-count"
}, h0 = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = c0(() => t.notices);
    return (o, i) => G(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: G(s), inline: e.inline }]),
      title: G(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: i[0] || (i[0] = Me((...r) => G(a) && G(a)(...r), ["stop"]))
    }, [
      F(Ee, {
        name: G(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      G(s) ? (c(), h("span", d0, $(G(n).length), 1)) : P("", !0)
    ], 10, u0)) : P("", !0);
  }
}, hv = /* @__PURE__ */ Y(h0, [["__scopeId", "data-v-c0d11526"]]), f0 = ["title"], p0 = ["title"], m0 = { class: "diff-card-dir" }, g0 = { class: "diff-card-name" }, v0 = { class: "diff-card-ago" }, y0 = ["title"], w0 = ["title"], k0 = {
  key: 0,
  class: "diff-card-note"
}, b0 = ["href"], x0 = ["src", "alt"], $0 = { class: "diff-card-rows" }, M0 = { class: "diff-row-num" }, _0 = { class: "diff-row-sign" }, S0 = { class: "diff-row-code" }, E0 = {
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
    function o(M) {
      (M.metaKey || M.ctrlKey) && (M.stopPropagation(), s("open", n.path));
    }
    const i = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, l = D(() => n.path.lastIndexOf("/") + 1), d = D(() => n.path.slice(0, l.value)), f = D(() => n.path.slice(l.value)), w = D(() => n.kind === "deleted"), _ = D(() => i[n.kind]), S = D(() => new Set(n.rows.filter((M) => M.line_type === "add").map((M) => M.line))), L = H("after"), b = D(() => L.value === "before" ? n.whole.old : n.whole.text), v = D(() => n.whole && n.whole.text !== void 0 ? b.value.split(`
`).map((M, g) => ({ line_type: L.value === "after" && S.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: M })) : n.rows.filter(
      (M) => !(n.editsOnly && ["ctx", "fold"].includes(M.line_type)) && !(n.hideRemovals && M.line_type === "del")
    )), A = H(!1), q = D(() => n.lines && !A.value && !n.whole), Q = D(() => q.value ? v.value.slice(0, n.lines) : v.value), W = D(() => v.value.length - Q.value.length), C = (M) => M.line === null || M.line_type === "del" ? "" : M.line, I = (M) => M.line_type === "fold" ? M.hidden ? `⋯ ${M.hidden} lines` : "⋯" : M.text, y = H(null), p = H(null);
    let k = null;
    return Ne(() => {
      if (!p.value) return;
      let M = !0;
      k = new ResizeObserver(() => {
        !y.value || !p.value || (y.value.style.transition = M ? "none" : "", y.value.style.height = `${p.value.offsetHeight}px`, M = !1);
      }), k.observe(p.value);
    }), Ae(() => k && k.disconnect()), (M, g) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: w.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: w.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: g[2] || (g[2] = (u) => !w.value && s("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${G(a)}-click to open it`,
          onClick: o
        }, [
          m("span", m0, $(d.value), 1),
          m("span", g0, $(f.value), 1),
          _.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.kind])
          }, $(_.value), 3)) : P("", !0)
        ], 8, p0),
        m("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + $(e.added), 3),
        m("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + $(e.removed), 3),
        m("span", v0, $(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: L.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[0] || (g[0] = Me((u) => L.value = L.value === "after" ? "before" : "after", ["stop"]))
        }, $(L.value === "after" ? "After" : "Before"), 9, y0)) : P("", !0),
        w.value ? P("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[1] || (g[1] = Me((u) => s("whole"), ["stop"]))
        }, [
          F(Ee, {
            name: "file",
            size: 12
          })
        ], 10, w0))
      ], 8, f0),
      e.whole && e.whole.error ? (c(), h("p", k0, $(e.whole.error), 1)) : P("", !0),
      !w.value && !e.folded ? (c(), h(J, { key: 1 }, [
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
          }, null, 8, x0)
        ], 8, b0)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: y,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: p,
            class: "diff-card-diff"
          }, [
            m("div", $0, [
              (c(!0), h(J, null, re(Q.value, (u, E) => (c(), h("div", {
                key: E,
                class: X(["diff-row", u.line_type, { fresh: e.fresh && u.edit === e.fresh }])
              }, [
                m("span", M0, $(C(u)), 1),
                m("span", _0, $(r[u.line_type]), 1),
                m("span", S0, $(I(u)), 1)
              ], 2))), 128)),
              W.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[3] || (g[3] = Me((u) => A.value = !0, ["stop"]))
              }, $(W.value) + " more " + $(W.value === 1 ? "line" : "lines"), 1)) : P("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : P("", !0)
    ], 2));
  }
}, fv = /* @__PURE__ */ Y(E0, [["__scopeId", "data-v-b6424f6e"]]), A0 = {
  key: 0,
  class: "menu-item-text"
}, C0 = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.description ? (c(), h("span", A0, [
        m("span", null, [
          be(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, $(e.description), 1)
      ])) : be(t.$slots, "default", {}, void 0, !0, 1)
    ], 2));
  }
}, O0 = /* @__PURE__ */ Y(C0, [["__scopeId", "data-v-5b5c4fd9"]]), T0 = {}, B0 = { class: "menu-label" };
function L0(e, t) {
  return c(), h("span", B0, [
    be(e.$slots, "default", {}, void 0, !0)
  ]);
}
const R0 = /* @__PURE__ */ Y(T0, [["render", L0], ["__scopeId", "data-v-aa955b3e"]]), Lo = /* @__PURE__ */ new WeakMap(), I0 = (e, t) => Lo.set(e, t);
function D0(e, t) {
  for (let n = t; n; n = Lo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function N0(e, t) {
  const n = (s) => {
    var o, i;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((i = e.value) == null ? void 0 : i.$el) || e.value;
    a && !D0(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const it = 8, j0 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = H(null), o = (u) => u ? `${u}px` : void 0, i = D(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), r = H({ w: 0, h: 0 }), l = H(s.anchor ? s.anchor.getBoundingClientRect() : null), d = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), w = (u) => {
      const E = u.closest(".pane, .float-window");
      return E ? f(E.getBoundingClientRect()) : d();
    }, _ = (u, E) => `${Math.max(0, u ? Math.min(u, E) : E)}px`;
    function S(u, E) {
      return {
        below: u.bottom - E.bottom - s.gap - it,
        above: E.top - u.top - s.gap - it,
        across: u.right - u.left - 2 * it
      };
    }
    function L(u) {
      const E = w(s.anchor), O = S(E, u);
      return r.value.w <= O.across && r.value.h <= Math.max(O.below, O.above) ? E : d();
    }
    const b = D(() => {
      if (!l.value) return i.value;
      const u = l.value, E = L(u), O = S(E, u), { w: j, h: ae } = r.value, oe = s.align === "auto" ? u.left + u.right > E.left + E.right : s.align === "right", de = di(oe ? u.right - j : u.left, E.left + it, Math.max(E.left + it, E.right - j - it)), pe = ae > O.below && O.above > O.below ? { bottom: `${window.innerHeight - u.top + s.gap}px`, maxHeight: _(s.maxHeight, O.above) } : { top: `${u.bottom + s.gap}px`, maxHeight: _(s.maxHeight, O.below) };
      return { ...i.value, ...pe, left: `${de}px`, maxWidth: _(s.maxWidth, O.across) };
    }), v = n, A = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function q(u) {
      const E = A(), O = E.indexOf(document.activeElement);
      E[(O + u + E.length) % E.length].focus();
    }
    const Q = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => v("close") }, W = (u) => Q[u.key] && (u.preventDefault(), Q[u.key]()), C = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let I = 0;
    const y = new ResizeObserver(() => {
      cancelAnimationFrame(I), I = requestAnimationFrame(C);
    });
    N0(a, (u) => s.anchor && !s.anchor.contains(u.target) && v("close"));
    const p = (u, E) => ["top", "left", "right", "bottom"].some((O) => Math.abs(u[O] - E[O]) > 1), k = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let M = 0;
    function g() {
      if (s.anchor) {
        const u = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || k(u)) return v("close");
        p(u, l.value) && (l.value = u);
      }
      M = requestAnimationFrame(g);
    }
    return Ne(() => {
      s.anchor && a.value && I0(a.value, s.anchor), C(), a.value && y.observe(a.value), !s.plain && A()[0] && A()[0].focus(), g();
    }), Ae(() => {
      y.disconnect(), cancelAnimationFrame(M), cancelAnimationFrame(I);
    }), t({ element: a }), (u, E) => (c(), K(ga, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", ht({
        ref_key: "panel",
        ref: a
      }, u.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: b.value,
        onKeydown: W
      }), [
        be(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), P0 = /* @__PURE__ */ Y(j0, [["__scopeId", "data-v-3d203970"]]), q0 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), K(ye, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: U(() => [
        F(Ee, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, W0 = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, H0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  started: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  testing: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, F0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], U0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], z0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], V0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], G0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], K0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? G0(t) : e === "agent" ? [...z0(t), ...U0(t)] : e === "check" ? V0(t) : e === "question" ? F0(t) : ((n = { plan: W0, task: H0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, Y0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, J0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Z0 = { class: "ask-text" }, Q0 = ["placeholder", "aria-label"], X0 = ["placeholder", "aria-label"], em = {
  key: 3,
  class: "moves"
}, tm = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = D(() => K0(s.kind, s.row)), i = H(""), r = H(null), l = H(""), d = H("");
    ke(() => s.id, () => {
      i.value = "", r.value = null;
    });
    async function f(S, L = "") {
      const b = await s.read([S.noun ?? s.kind, S.word, String(s.id), ...S.flag ? [S.flag, L] : S.positional ? [L] : [], ...S.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      i.value = b.ok ? "" : b.error, b.ok && (r.value = null, l.value = "", d.value = "", a("done"));
    }
    const w = (S) => S.confirm ? r.value = S : S.said ? f(S, S.said) : S.flag || S.positional ? (r.value = S, l.value = "") : f(S), _ = () => l.value.trim() && f(r.value, l.value.trim());
    return t({ moves: o, press: w }), (S, L) => {
      var b;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: X(["foot", { inline: e.inline }])
      }, [
        i.value ? (c(), h("p", Y0, $(i.value), 1)) : P("", !0),
        (b = r.value) != null && b.confirm ? (c(), h("div", J0, [
          m("span", Z0, $(r.value.confirm), 1),
          F(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: L[0] || (L[0] = (v) => f(r.value))
          }, {
            default: U(() => [
              ge($(r.value.label), 1)
            ]),
            _: 1
          }),
          F(ye, {
            small: "",
            kind: "ghost",
            onClick: L[1] || (L[1] = (v) => r.value = null)
          }, {
            default: U(() => [...L[7] || (L[7] = [
              ge("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: Me(_, ["prevent"])
        }, [
          ft(m("input", {
            "onUpdate:modelValue": L[2] || (L[2] = (v) => l.value = v),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: L[3] || (L[3] = Kt(Me((v) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, Q0), [
            [Fn, l.value]
          ]),
          r.value.opener ? ft((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": L[4] || (L[4] = (v) => d.value = v),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: L[5] || (L[5] = Kt(Me((v) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, X0)), [
            [Fn, d.value]
          ]) : P("", !0),
          F(ye, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: U(() => [
              ge($(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(ye, {
            small: "",
            kind: "ghost",
            onClick: L[6] || (L[6] = (v) => r.value = null)
          }, {
            default: U(() => [...L[8] || (L[8] = [
              ge("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", em, [
          (c(!0), h(J, null, re(o.value, (v) => (c(), K(ye, {
            key: v.word,
            small: "",
            kind: v.main ? "primary" : "ghost",
            "data-move": v.word,
            onClick: (A) => w(v)
          }, {
            default: U(() => [
              ge($(v.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : P("", !0);
    };
  }
}, nm = /* @__PURE__ */ Y(tm, [["__scopeId", "data-v-fffa0bf6"]]), sm = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, am = { ...sm, done: "Completed" }, om = { class: "task-status-icon" }, rm = ["width", "height", "aria-label"], im = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", om, [
      F(rn, {
        name: "turn",
        mode: "out-in"
      }, {
        default: U(() => [
          (c(), h("svg", {
            key: e.status,
            class: X(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": G(am)[e.status]
          }, [
            F(us, { value: e.status }, {
              blocked: U(() => [...n[0] || (n[0] = [
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
              done: U(() => [...n[1] || (n[1] = [
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
              started: U(() => [...n[2] || (n[2] = [
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
              asked: U(() => [...n[3] || (n[3] = [
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
              paused: U(() => [...n[4] || (n[4] = [
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
              planned: U(() => [...n[5] || (n[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: U(() => [...n[6] || (n[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, rm))
        ]),
        _: 1
      })
    ]));
  }
}, fa = /* @__PURE__ */ Y(im, [["__scopeId", "data-v-2ab7e404"]]), lm = {
  class: "comment-side",
  "data-comment-side": "",
  "aria-label": "Comments"
}, cm = { class: "comment-side-head" }, um = {
  key: 0,
  class: "comment-none"
}, dm = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", lm, [
      m("header", cm, [
        n[1] || (n[1] = m("h3", null, "Comments", -1)),
        F(ds, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? P("", !0) : (c(), h("p", um, "No comments yet")),
      (c(!0), h(J, null, re(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, $(e.words(s)), 1))), 128))
    ]));
  }
}, hm = /* @__PURE__ */ Y(dm, [["__scopeId", "data-v-234cce45"]]), fm = ["placeholder"], pm = { class: "actions" }, mm = { class: "error" }, gm = {
  key: 1,
  class: "card closed"
}, vm = { class: "mark" }, ym = { class: "prompt" }, wm = {
  key: 0,
  class: "draft"
}, km = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Hn({
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
  emits: /* @__PURE__ */ Hn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Wn(e, "draft"), i = Wn(e, "error"), r = H(!!i.value), l = H(!1), d = H(!1), f = H(null);
    async function w() {
      var b, v;
      r.value = !0, l.value = !1, await cn(), (v = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || v.focus();
    }
    function _() {
      r.value = !1, i.value = "";
    }
    function S(b) {
      b.shiftKey || b.isComposing || (b.preventDefault(), L());
    }
    async function L() {
      const b = o.value.trim();
      if (!(!b || !s.ready || d.value)) {
        i.value = "", d.value = !0, o.value = "";
        try {
          await s.send(b), r.value = !1, l.value = !0;
        } catch (v) {
          o.value = b, i.value = v.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: w }), (b, v) => (c(), h("div", {
      class: X(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: Me(L, ["prevent"]),
        onKeydown: Kt(_, ["esc"])
      }, [
        be(b.$slots, "who", {}, void 0, !0),
        ft(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": v[0] || (v[0] = (A) => o.value = A),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Kt(S, ["enter"])
        }, null, 40, fm), [
          [Fn, o.value]
        ]),
        m("div", pm, [
          m("span", mm, $(i.value), 1),
          F(ye, {
            small: "",
            onClick: _
          }, {
            default: U(() => [...v[2] || (v[2] = [
              ge("Cancel", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            kind: "primary",
            small: "",
            busy: d.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: L
          }, {
            default: U(() => [...v[3] || (v[3] = [
              ge("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", gm, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: w
        }, [
          m("span", vm, [
            F(Ee, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", ym, $(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", wm, "Draft kept")) : P("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: v[1] || (v[1] = (A) => a("show"))
        }, [
          m("span", null, $(G(hi)(e.count, "comment")), 1),
          F(Ee, {
            name: "down",
            size: 12
          })
        ])) : P("", !0)
      ]))
    ], 2));
  }
}, bm = /* @__PURE__ */ Y(km, [["__scopeId", "data-v-4d1d3a74"]]);
function xm(e, t) {
  const n = H([]), s = H(!1);
  let a = 0, o = 0;
  const i = (d) => {
    const { kind: f, id: w, title: _ } = e(), S = `On ${f} ${w}, ${_}: `;
    return d.text.startsWith(S) ? d.text.slice(S.length) : d.text;
  };
  async function r() {
    const { kind: d, id: f } = e();
    if (!f) return;
    const w = ++o, _ = await t([d, "comments", String(f)]);
    w === o && (n.value = _.ok ? _.value.rows ?? [] : []);
  }
  async function l(d) {
    const { kind: f, id: w } = e(), _ = { id: `sending-${++a}`, text: d };
    n.value = [...n.value, _], s.value = !0;
    const S = await t([f, "comment", String(w), d]);
    if (!S.ok)
      throw n.value = n.value.filter((L) => L !== _ && L.id !== _.id), new Error(S.error);
    await r();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], r();
  }, { immediate: !0 }), { comments: n, open: s, words: i, send: l, load: r };
}
const $m = { class: "top" }, Mm = {
  class: "crumb",
  "data-task-crumb": ""
}, _m = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Sm = {
  key: 1,
  class: "body"
}, Em = { class: "body-row" }, Am = { class: "stamp" }, Cm = {
  class: "title",
  "data-resource-title": ""
}, Om = { class: "since" }, Tm = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Bm = { class: "text" }, Lm = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Rm = {
  key: 1,
  class: "note"
}, Im = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Dm = { class: "text" }, Nm = { class: "facts" }, jm = { class: "fact wide" }, Pm = { class: "fact-value" }, qm = {
  key: 0,
  class: "fact"
}, Wm = { class: "fact-value" }, Hm = {
  key: 1,
  class: "fact"
}, Fm = { class: "fact-value" }, Um = {
  key: 2,
  class: "fact wide"
}, zm = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Vm = {
  key: 2,
  class: "part",
  "data-resource-waits": ""
}, Gm = ["onClick"], Km = { class: "wait-id" }, Ym = { class: "wait-title" }, Jm = {
  key: 3,
  class: "part",
  "data-task-outcome": ""
}, Zm = { class: "text" }, Qm = {
  key: 4,
  class: "part",
  "data-task-brief": ""
}, Xm = {
  key: 5,
  class: "part",
  "data-resource-logs": ""
}, eg = 180, tg = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = so.map(({ key: y, label: p }) => ({ key: String(y), label: p })), a = /* @__PURE__ */ new Set(["completed", "cancelled"]), o = e, i = n, r = H(null), l = H(null), d = H(""), f = H(""), w = H(!1), _ = H(null), S = H(null), L = xm(() => r.value ? { kind: "task", id: o.id, title: r.value.title } : {}, (y) => o.read(y));
    ke(L.open, (y) => i("comments", y));
    let b = 0;
    const v = (y) => a.has(y) ? "done" : y, A = (y) => y.slice(0, 1).toUpperCase() + y.slice(1), q = D(() => {
      var y;
      return (y = l.value) != null && y.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function Q() {
      const y = ++b, [p, k] = await Promise.all([o.read(["task", "inspect", String(o.id)]), o.read(["plan", "place", String(o.id)])]);
      y === b && (d.value = p.ok ? "" : p.error, r.value = p.ok ? p.value : null, l.value = k.ok ? k.value : null);
    }
    ke(() => o.id, () => {
      r.value = null, l.value = null, w.value = !1, _.value = null, Q();
    }, { immediate: !0 }), ke(() => o.changes, Q);
    async function W(y) {
      const p = r.value.priority;
      r.value.priority = Number(y);
      const k = await o.read(["task", "edit", String(o.id), "--priority", y]);
      if (f.value = k.ok ? "" : k.error, k.ok) return Q();
      r.value.priority = p;
    }
    function C(y) {
      _.value = null, S.value.press(y);
    }
    const I = (y) => {
      var p;
      return ((p = S.value) == null ? void 0 : p.moves.length) && (_.value = y);
    };
    return t({ openStatus: I }), (y, p) => {
      var k, M, g;
      return c(), h("aside", {
        class: X(["task-inspector", { lone: e.lone }]),
        "data-task-inspector": ""
      }, [
        m("div", $m, [
          e.backed ? (c(), K(q0, {
            key: 0,
            onBack: p[0] || (p[0] = (u) => i("back"))
          })) : P("", !0),
          m("span", Mm, $(q.value), 1),
          p[9] || (p[9] = m("span", { class: "grow" }, null, -1)),
          e.stepped ? (c(), h(J, { key: 1 }, [
            F(ye, {
              small: "",
              title: "Previous task (K)",
              "aria-label": "Previous task",
              onClick: p[1] || (p[1] = (u) => i("step", -1))
            }, {
              default: U(() => [
                F(Ee, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            F(ye, {
              small: "",
              title: "Next task (J)",
              "aria-label": "Next task",
              onClick: p[2] || (p[2] = (u) => i("step", 1))
            }, {
              default: U(() => [
                F(Ee, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : P("", !0),
          F(ye, {
            small: "",
            "aria-label": "Close the task (Esc)",
            "data-resource-close": "",
            onClick: p[3] || (p[3] = (u) => i("close"))
          }, {
            default: U(() => [
              F(Ee, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          })
        ]),
        d.value ? (c(), h("p", _m, $(d.value), 1)) : r.value ? (c(), h(J, { key: 2 }, [
          m("div", Em, [
            (c(), h("div", {
              key: r.value.id,
              class: "body"
            }, [
              m("div", Am, "Task " + $(r.value.id) + " · updated " + $(G(Is)(G(Qt)(r.value)) || "just now"), 1),
              m("h3", Cm, $(r.value.title), 1),
              m("div", {
                class: X(["state-line", v(r.value.state)])
              }, [
                m("button", {
                  type: "button",
                  class: "state",
                  "data-task-state": "",
                  title: "Change the status (S)",
                  onClick: p[4] || (p[4] = (u) => I(u.currentTarget))
                }, [
                  F(fa, {
                    status: v(r.value.state)
                  }, null, 8, ["status"]),
                  ge(" " + $(A(r.value.state)), 1)
                ]),
                m("span", Om, "since " + $(G(Is)(G(Qt)(r.value)) || "just now"), 1)
              ], 2),
              r.value.state === "blocked" ? (c(), h("section", Tm, [
                p[10] || (p[10] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
                m("p", Bm, $(r.value.reason || "Other tasks"), 1),
                (k = r.value.openers) != null && k.length ? (c(), h("p", Lm, "Opens by itself when " + $(r.value.openers.join(" or ")) + ".", 1)) : (c(), h("p", Rm, "Nothing opens it by itself. Unblock it when that is done."))
              ])) : r.value.state === "cancelled" && r.value.reason ? (c(), h("section", Im, [
                p[11] || (p[11] = m("span", { class: "label" }, "Why it was cancelled", -1)),
                m("p", Dm, $(r.value.reason), 1)
              ])) : P("", !0),
              m("div", Nm, [
                m("div", jm, [
                  p[12] || (p[12] = m("span", { class: "fact-label" }, "Plan", -1)),
                  m("span", Pm, $((M = l.value) != null && M.plan_id ? `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan"), 1)
                ]),
                ((g = l.value) == null ? void 0 : g.phase_total) > 1 ? (c(), h("div", qm, [
                  p[13] || (p[13] = m("span", { class: "fact-label" }, "Phase", -1)),
                  m("span", Wm, $(l.value.phase_number) + " of " + $(l.value.phase_total) + ": " + $(l.value.phase_title), 1)
                ])) : P("", !0),
                r.value.state === "started" && r.value.holder_id ? (c(), h("div", Hm, [
                  p[14] || (p[14] = m("span", { class: "fact-label" }, "Holder", -1)),
                  m("span", Fm, "Agent " + $(r.value.holder_id), 1)
                ])) : P("", !0),
                G(a).has(r.value.state) ? P("", !0) : (c(), h("div", Um, [
                  p[15] || (p[15] = m("span", { class: "fact-label" }, "Priority", -1)),
                  F(Xn, {
                    options: G(s),
                    value: String(r.value.priority),
                    "data-task-priority": "",
                    onPick: W
                  }, null, 8, ["options", "value"]),
                  f.value ? (c(), h("p", zm, $(f.value), 1)) : P("", !0)
                ]))
              ]),
              r.value.waits.length ? (c(), h("section", Vm, [
                p[16] || (p[16] = m("h4", null, "Waits on", -1)),
                (c(!0), h(J, null, re(r.value.waits, (u) => (c(), h("button", {
                  key: u.id,
                  type: "button",
                  class: "wait",
                  onClick: (E) => i("select", u.id)
                }, [
                  F(fa, {
                    status: v(u.state),
                    size: 12
                  }, null, 8, ["status"]),
                  m("span", Km, $(u.id), 1),
                  m("span", Ym, $(u.title), 1)
                ], 8, Gm))), 128))
              ])) : P("", !0),
              r.value.state === "completed" && r.value.outcome ? (c(), h("section", Jm, [
                p[17] || (p[17] = m("h4", null, "How it was done", -1)),
                m("p", Zm, $(r.value.outcome), 1)
              ])) : P("", !0),
              r.value.brief ? (c(), h("section", Qm, [
                p[18] || (p[18] = m("h4", null, "The brief", -1)),
                m("p", {
                  class: X(["text", { clamped: !w.value }])
                }, $(r.value.brief), 3),
                r.value.brief.length > eg && !w.value ? (c(), h("button", {
                  key: 0,
                  type: "button",
                  class: "more",
                  onClick: p[5] || (p[5] = (u) => w.value = !0)
                }, "Show the whole brief")) : P("", !0)
              ])) : P("", !0),
              r.value.logs.length ? (c(), h("section", Xm, [
                p[19] || (p[19] = m("h4", null, "Log", -1)),
                (c(!0), h(J, null, re(r.value.logs, (u) => (c(), h("p", {
                  key: u.id,
                  class: "log"
                }, $(u.line), 1))), 128))
              ])) : P("", !0)
            ])),
            G(L).open.value ? (c(), K(hm, {
              key: 0,
              comments: G(L).comments.value,
              words: G(L).words,
              onClose: p[6] || (p[6] = (u) => G(L).open.value = !1)
            }, null, 8, ["comments", "words"])) : P("", !0)
          ]),
          F(bm, {
            send: G(L).send,
            count: G(L).comments.value.length,
            onShow: p[7] || (p[7] = (u) => G(L).open.value = !G(L).open.value)
          }, null, 8, ["send", "count"])
        ], 64)) : (c(), h("div", Sm, [
          F(At)
        ])),
        F(nm, {
          ref_key: "footer",
          ref: S,
          kind: "task",
          id: e.id,
          row: r.value,
          read: e.read,
          onDone: Q
        }, null, 8, ["id", "row", "read"]),
        _.value ? (c(), K(P0, {
          key: 3,
          anchor: _.value,
          "min-width": 220,
          "max-width": 300,
          onClose: p[8] || (p[8] = (u) => _.value = null)
        }, {
          default: U(() => [
            F(R0, null, {
              default: U(() => [
                ge("Change the status of task " + $(e.id), 1)
              ]),
              _: 1
            }),
            (c(!0), h(J, null, re(S.value.moves, (u) => (c(), K(O0, {
              key: u.word,
              onClick: (E) => C(u)
            }, {
              default: U(() => [
                ge($(u.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : P("", !0)
      ], 2);
    };
  }
}, pv = /* @__PURE__ */ Y(tg, [["__scopeId", "data-v-5b960ff7"]]);
function ng(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var qn = { exports: {} }, pa;
function sg() {
  return pa || (pa = 1, (function(e, t) {
    var n = (function() {
      var s = function(C, I) {
        var y = 236, p = 17, k = C, M = o[I], g = null, u = 0, E = null, O = [], j = {}, ae = function(T, B) {
          u = k * 4 + 17, g = (function(x) {
            for (var R = new Array(x), N = 0; N < x; N += 1) {
              R[N] = new Array(x);
              for (var V = 0; V < x; V += 1)
                R[N][V] = null;
            }
            return R;
          })(u), oe(0, 0), oe(u - 7, 0), oe(0, u - 7), pe(), le(), je(T, B), k >= 7 && _e(T), E == null && (E = Ro(k, M, O)), Pe(E, B);
        }, oe = function(T, B) {
          for (var x = -1; x <= 7; x += 1)
            if (!(T + x <= -1 || u <= T + x))
              for (var R = -1; R <= 7; R += 1)
                B + R <= -1 || u <= B + R || (0 <= x && x <= 6 && (R == 0 || R == 6) || 0 <= R && R <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= R && R <= 4 ? g[T + x][B + R] = !0 : g[T + x][B + R] = !1);
        }, de = function() {
          for (var T = 0, B = 0, x = 0; x < 8; x += 1) {
            ae(!0, x);
            var R = r.getLostPoint(j);
            (x == 0 || T > R) && (T = R, B = x);
          }
          return B;
        }, le = function() {
          for (var T = 8; T < u - 8; T += 1)
            g[T][6] == null && (g[T][6] = T % 2 == 0);
          for (var B = 8; B < u - 8; B += 1)
            g[6][B] == null && (g[6][B] = B % 2 == 0);
        }, pe = function() {
          for (var T = r.getPatternPosition(k), B = 0; B < T.length; B += 1)
            for (var x = 0; x < T.length; x += 1) {
              var R = T[B], N = T[x];
              if (g[R][N] == null)
                for (var V = -2; V <= 2; V += 1)
                  for (var ne = -2; ne <= 2; ne += 1)
                    V == -2 || V == 2 || ne == -2 || ne == 2 || V == 0 && ne == 0 ? g[R + V][N + ne] = !0 : g[R + V][N + ne] = !1;
            }
        }, _e = function(T) {
          for (var B = r.getBCHTypeNumber(k), x = 0; x < 18; x += 1) {
            var R = !T && (B >> x & 1) == 1;
            g[Math.floor(x / 3)][x % 3 + u - 8 - 3] = R;
          }
          for (var x = 0; x < 18; x += 1) {
            var R = !T && (B >> x & 1) == 1;
            g[x % 3 + u - 8 - 3][Math.floor(x / 3)] = R;
          }
        }, je = function(T, B) {
          for (var x = M << 3 | B, R = r.getBCHTypeInfo(x), N = 0; N < 15; N += 1) {
            var V = !T && (R >> N & 1) == 1;
            N < 6 ? g[N][8] = V : N < 8 ? g[N + 1][8] = V : g[u - 15 + N][8] = V;
          }
          for (var N = 0; N < 15; N += 1) {
            var V = !T && (R >> N & 1) == 1;
            N < 8 ? g[8][u - N - 1] = V : N < 9 ? g[8][15 - N - 1 + 1] = V : g[8][15 - N - 1] = V;
          }
          g[u - 8][8] = !T;
        }, Pe = function(T, B) {
          for (var x = -1, R = u - 1, N = 7, V = 0, ne = r.getMaskFunction(B), te = u - 1; te > 0; te -= 2)
            for (te == 6 && (te -= 1); ; ) {
              for (var me = 0; me < 2; me += 1)
                if (g[R][te - me] == null) {
                  var we = !1;
                  V < T.length && (we = (T[V] >>> N & 1) == 1);
                  var se = ne(R, te - me);
                  se && (we = !we), g[R][te - me] = we, N -= 1, N == -1 && (V += 1, N = 7);
                }
              if (R += x, R < 0 || u <= R) {
                R -= x, x = -x;
                break;
              }
            }
        }, at = function(T, B) {
          for (var x = 0, R = 0, N = 0, V = new Array(B.length), ne = new Array(B.length), te = 0; te < B.length; te += 1) {
            var me = B[te].dataCount, we = B[te].totalCount - me;
            R = Math.max(R, me), N = Math.max(N, we), V[te] = new Array(me);
            for (var se = 0; se < V[te].length; se += 1)
              V[te][se] = 255 & T.getBuffer()[se + x];
            x += me;
            var Ce = r.getErrorCorrectPolynomial(we), Oe = d(V[te], Ce.getLength() - 1), xs = Oe.mod(Ce);
            ne[te] = new Array(Ce.getLength() - 1);
            for (var se = 0; se < ne[te].length; se += 1) {
              var $s = se + xs.getLength() - ne[te].length;
              ne[te][se] = $s >= 0 ? xs.getAt($s) : 0;
            }
          }
          for (var Ms = 0, se = 0; se < B.length; se += 1)
            Ms += B[se].totalCount;
          for (var yn = new Array(Ms), Rt = 0, se = 0; se < R; se += 1)
            for (var te = 0; te < B.length; te += 1)
              se < V[te].length && (yn[Rt] = V[te][se], Rt += 1);
          for (var se = 0; se < N; se += 1)
            for (var te = 0; te < B.length; te += 1)
              se < ne[te].length && (yn[Rt] = ne[te][se], Rt += 1);
          return yn;
        }, Ro = function(T, B, x) {
          for (var R = f.getRSBlocks(T, B), N = w(), V = 0; V < x.length; V += 1) {
            var ne = x[V];
            N.put(ne.getMode(), 4), N.put(ne.getLength(), r.getLengthInBits(ne.getMode(), T)), ne.write(N);
          }
          for (var te = 0, V = 0; V < R.length; V += 1)
            te += R[V].dataCount;
          if (N.getLengthInBits() > te * 8)
            throw "code length overflow. (" + N.getLengthInBits() + ">" + te * 8 + ")";
          for (N.getLengthInBits() + 4 <= te * 8 && N.put(0, 4); N.getLengthInBits() % 8 != 0; )
            N.putBit(!1);
          for (; !(N.getLengthInBits() >= te * 8 || (N.put(y, 8), N.getLengthInBits() >= te * 8)); )
            N.put(p, 8);
          return at(N, R);
        };
        j.addData = function(T, B) {
          B = B || "Byte";
          var x = null;
          switch (B) {
            case "Numeric":
              x = _(T);
              break;
            case "Alphanumeric":
              x = S(T);
              break;
            case "Byte":
              x = L(T);
              break;
            case "Kanji":
              x = b(T);
              break;
            default:
              throw "mode:" + B;
          }
          O.push(x), E = null;
        }, j.isDark = function(T, B) {
          if (T < 0 || u <= T || B < 0 || u <= B)
            throw T + "," + B;
          return g[T][B];
        }, j.getModuleCount = function() {
          return u;
        }, j.make = function() {
          if (k < 1) {
            for (var T = 1; T < 40; T++) {
              for (var B = f.getRSBlocks(T, M), x = w(), R = 0; R < O.length; R++) {
                var N = O[R];
                x.put(N.getMode(), 4), x.put(N.getLength(), r.getLengthInBits(N.getMode(), T)), N.write(x);
              }
              for (var V = 0, R = 0; R < B.length; R++)
                V += B[R].dataCount;
              if (x.getLengthInBits() <= V * 8)
                break;
            }
            k = T;
          }
          ae(!1, de());
        }, j.createTableTag = function(T, B) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + B + "px;", x += '">', x += "<tbody>";
          for (var R = 0; R < j.getModuleCount(); R += 1) {
            x += "<tr>";
            for (var N = 0; N < j.getModuleCount(); N += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + T + "px;", x += " height: " + T + "px;", x += " background-color: ", x += j.isDark(R, N) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, j.createSvgTag = function(T, B, x, R) {
          var N = {};
          typeof arguments[0] == "object" && (N = arguments[0], T = N.cellSize, B = N.margin, x = N.alt, R = N.title), T = T || 2, B = typeof B > "u" ? T * 4 : B, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, R = typeof R == "string" ? { text: R } : R || {}, R.text = R.text || null, R.id = R.text ? R.id || "qrcode-title" : null;
          var V = j.getModuleCount() * T + B * 2, ne, te, me, we, se = "", Ce;
          for (Ce = "l" + T + ",0 0," + T + " -" + T + ",0 0,-" + T + "z ", se += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', se += N.scalable ? "" : ' width="' + V + 'px" height="' + V + 'px"', se += ' viewBox="0 0 ' + V + " " + V + '" ', se += ' preserveAspectRatio="xMinYMin meet"', se += R.text || x.text ? ' role="img" aria-labelledby="' + ot([R.id, x.id].join(" ").trim()) + '"' : "", se += ">", se += R.text ? '<title id="' + ot(R.id) + '">' + ot(R.text) + "</title>" : "", se += x.text ? '<description id="' + ot(x.id) + '">' + ot(x.text) + "</description>" : "", se += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', se += '<path d="', me = 0; me < j.getModuleCount(); me += 1)
            for (we = me * T + B, ne = 0; ne < j.getModuleCount(); ne += 1)
              j.isDark(me, ne) && (te = ne * T + B, se += "M" + te + "," + we + Ce);
          return se += '" stroke="transparent" fill="black"/>', se += "</svg>", se;
        }, j.createDataURL = function(T, B) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var x = j.getModuleCount() * T + B * 2, R = B, N = x - B;
          return W(x, x, function(V, ne) {
            if (R <= V && V < N && R <= ne && ne < N) {
              var te = Math.floor((V - R) / T), me = Math.floor((ne - R) / T);
              return j.isDark(me, te) ? 0 : 1;
            } else
              return 1;
          });
        }, j.createImgTag = function(T, B, x) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var R = j.getModuleCount() * T + B * 2, N = "";
          return N += "<img", N += ' src="', N += j.createDataURL(T, B), N += '"', N += ' width="', N += R, N += '"', N += ' height="', N += R, N += '"', x && (N += ' alt="', N += ot(x), N += '"'), N += "/>", N;
        };
        var ot = function(T) {
          for (var B = "", x = 0; x < T.length; x += 1) {
            var R = T.charAt(x);
            switch (R) {
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
                B += R;
                break;
            }
          }
          return B;
        }, Io = function(T) {
          var B = 1;
          T = typeof T > "u" ? B * 2 : T;
          var x = j.getModuleCount() * B + T * 2, R = T, N = x - T, V, ne, te, me, we, se = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ce = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Oe = "";
          for (V = 0; V < x; V += 2) {
            for (te = Math.floor((V - R) / B), me = Math.floor((V + 1 - R) / B), ne = 0; ne < x; ne += 1)
              we = "█", R <= ne && ne < N && R <= V && V < N && j.isDark(te, Math.floor((ne - R) / B)) && (we = " "), R <= ne && ne < N && R <= V + 1 && V + 1 < N && j.isDark(me, Math.floor((ne - R) / B)) ? we += " " : we += "█", Oe += T < 1 && V + 1 >= N ? Ce[we] : se[we];
            Oe += `
`;
          }
          return x % 2 && T > 0 ? Oe.substring(0, Oe.length - x - 1) + Array(x + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return j.createASCII = function(T, B) {
          if (T = T || 1, T < 2)
            return Io(B);
          T -= 1, B = typeof B > "u" ? T * 2 : B;
          var x = j.getModuleCount() * T + B * 2, R = B, N = x - B, V, ne, te, me, we = Array(T + 1).join("██"), se = Array(T + 1).join("  "), Ce = "", Oe = "";
          for (V = 0; V < x; V += 1) {
            for (te = Math.floor((V - R) / T), Oe = "", ne = 0; ne < x; ne += 1)
              me = 1, R <= ne && ne < N && R <= V && V < N && j.isDark(te, Math.floor((ne - R) / T)) && (me = 0), Oe += me ? we : se;
            for (te = 0; te < T; te += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, j.renderTo2dContext = function(T, B) {
          B = B || 2;
          for (var x = j.getModuleCount(), R = 0; R < x; R++)
            for (var N = 0; N < x; N++)
              T.fillStyle = j.isDark(R, N) ? "black" : "white", T.fillRect(R * B, N * B, B, B);
        }, j;
      };
      s.stringToBytesFuncs = {
        default: function(C) {
          for (var I = [], y = 0; y < C.length; y += 1) {
            var p = C.charCodeAt(y);
            I.push(p & 255);
          }
          return I;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(C, I) {
        var y = (function() {
          for (var k = q(C), M = function() {
            var le = k.read();
            if (le == -1) throw "eof";
            return le;
          }, g = 0, u = {}; ; ) {
            var E = k.read();
            if (E == -1) break;
            var O = M(), j = M(), ae = M(), oe = String.fromCharCode(E << 8 | O), de = j << 8 | ae;
            u[oe] = de, g += 1;
          }
          if (g != I)
            throw g + " != " + I;
          return u;
        })(), p = 63;
        return function(k) {
          for (var M = [], g = 0; g < k.length; g += 1) {
            var u = k.charCodeAt(g);
            if (u < 128)
              M.push(u);
            else {
              var E = y[k.charAt(g)];
              typeof E == "number" ? (E & 255) == E ? M.push(E) : (M.push(E >>> 8), M.push(E & 255)) : M.push(p);
            }
          }
          return M;
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
        var C = [
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
        ], I = 1335, y = 7973, p = 21522, k = {}, M = function(g) {
          for (var u = 0; g != 0; )
            u += 1, g >>>= 1;
          return u;
        };
        return k.getBCHTypeInfo = function(g) {
          for (var u = g << 10; M(u) - M(I) >= 0; )
            u ^= I << M(u) - M(I);
          return (g << 10 | u) ^ p;
        }, k.getBCHTypeNumber = function(g) {
          for (var u = g << 12; M(u) - M(y) >= 0; )
            u ^= y << M(u) - M(y);
          return g << 12 | u;
        }, k.getPatternPosition = function(g) {
          return C[g - 1];
        }, k.getMaskFunction = function(g) {
          switch (g) {
            case i.PATTERN000:
              return function(u, E) {
                return (u + E) % 2 == 0;
              };
            case i.PATTERN001:
              return function(u, E) {
                return u % 2 == 0;
              };
            case i.PATTERN010:
              return function(u, E) {
                return E % 3 == 0;
              };
            case i.PATTERN011:
              return function(u, E) {
                return (u + E) % 3 == 0;
              };
            case i.PATTERN100:
              return function(u, E) {
                return (Math.floor(u / 2) + Math.floor(E / 3)) % 2 == 0;
              };
            case i.PATTERN101:
              return function(u, E) {
                return u * E % 2 + u * E % 3 == 0;
              };
            case i.PATTERN110:
              return function(u, E) {
                return (u * E % 2 + u * E % 3) % 2 == 0;
              };
            case i.PATTERN111:
              return function(u, E) {
                return (u * E % 3 + (u + E) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + g;
          }
        }, k.getErrorCorrectPolynomial = function(g) {
          for (var u = d([1], 0), E = 0; E < g; E += 1)
            u = u.multiply(d([1, l.gexp(E)], 0));
          return u;
        }, k.getLengthInBits = function(g, u) {
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
        }, k.getLostPoint = function(g) {
          for (var u = g.getModuleCount(), E = 0, O = 0; O < u; O += 1)
            for (var j = 0; j < u; j += 1) {
              for (var ae = 0, oe = g.isDark(O, j), de = -1; de <= 1; de += 1)
                if (!(O + de < 0 || u <= O + de))
                  for (var le = -1; le <= 1; le += 1)
                    j + le < 0 || u <= j + le || de == 0 && le == 0 || oe == g.isDark(O + de, j + le) && (ae += 1);
              ae > 5 && (E += 3 + ae - 5);
            }
          for (var O = 0; O < u - 1; O += 1)
            for (var j = 0; j < u - 1; j += 1) {
              var pe = 0;
              g.isDark(O, j) && (pe += 1), g.isDark(O + 1, j) && (pe += 1), g.isDark(O, j + 1) && (pe += 1), g.isDark(O + 1, j + 1) && (pe += 1), (pe == 0 || pe == 4) && (E += 3);
            }
          for (var O = 0; O < u; O += 1)
            for (var j = 0; j < u - 6; j += 1)
              g.isDark(O, j) && !g.isDark(O, j + 1) && g.isDark(O, j + 2) && g.isDark(O, j + 3) && g.isDark(O, j + 4) && !g.isDark(O, j + 5) && g.isDark(O, j + 6) && (E += 40);
          for (var j = 0; j < u; j += 1)
            for (var O = 0; O < u - 6; O += 1)
              g.isDark(O, j) && !g.isDark(O + 1, j) && g.isDark(O + 2, j) && g.isDark(O + 3, j) && g.isDark(O + 4, j) && !g.isDark(O + 5, j) && g.isDark(O + 6, j) && (E += 40);
          for (var _e = 0, j = 0; j < u; j += 1)
            for (var O = 0; O < u; O += 1)
              g.isDark(O, j) && (_e += 1);
          var je = Math.abs(100 * _e / u / u - 50) / 5;
          return E += je * 10, E;
        }, k;
      })(), l = (function() {
        for (var C = new Array(256), I = new Array(256), y = 0; y < 8; y += 1)
          C[y] = 1 << y;
        for (var y = 8; y < 256; y += 1)
          C[y] = C[y - 4] ^ C[y - 5] ^ C[y - 6] ^ C[y - 8];
        for (var y = 0; y < 255; y += 1)
          I[C[y]] = y;
        var p = {};
        return p.glog = function(k) {
          if (k < 1)
            throw "glog(" + k + ")";
          return I[k];
        }, p.gexp = function(k) {
          for (; k < 0; )
            k += 255;
          for (; k >= 256; )
            k -= 255;
          return C[k];
        }, p;
      })();
      function d(C, I) {
        if (typeof C.length > "u")
          throw C.length + "/" + I;
        var y = (function() {
          for (var k = 0; k < C.length && C[k] == 0; )
            k += 1;
          for (var M = new Array(C.length - k + I), g = 0; g < C.length - k; g += 1)
            M[g] = C[g + k];
          return M;
        })(), p = {};
        return p.getAt = function(k) {
          return y[k];
        }, p.getLength = function() {
          return y.length;
        }, p.multiply = function(k) {
          for (var M = new Array(p.getLength() + k.getLength() - 1), g = 0; g < p.getLength(); g += 1)
            for (var u = 0; u < k.getLength(); u += 1)
              M[g + u] ^= l.gexp(l.glog(p.getAt(g)) + l.glog(k.getAt(u)));
          return d(M, 0);
        }, p.mod = function(k) {
          if (p.getLength() - k.getLength() < 0)
            return p;
          for (var M = l.glog(p.getAt(0)) - l.glog(k.getAt(0)), g = new Array(p.getLength()), u = 0; u < p.getLength(); u += 1)
            g[u] = p.getAt(u);
          for (var u = 0; u < k.getLength(); u += 1)
            g[u] ^= l.gexp(l.glog(k.getAt(u)) + M);
          return d(g, 0).mod(k);
        }, p;
      }
      var f = (function() {
        var C = [
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
        ], I = function(k, M) {
          var g = {};
          return g.totalCount = k, g.dataCount = M, g;
        }, y = {}, p = function(k, M) {
          switch (M) {
            case o.L:
              return C[(k - 1) * 4 + 0];
            case o.M:
              return C[(k - 1) * 4 + 1];
            case o.Q:
              return C[(k - 1) * 4 + 2];
            case o.H:
              return C[(k - 1) * 4 + 3];
            default:
              return;
          }
        };
        return y.getRSBlocks = function(k, M) {
          var g = p(k, M);
          if (typeof g > "u")
            throw "bad rs block @ typeNumber:" + k + "/errorCorrectionLevel:" + M;
          for (var u = g.length / 3, E = [], O = 0; O < u; O += 1)
            for (var j = g[O * 3 + 0], ae = g[O * 3 + 1], oe = g[O * 3 + 2], de = 0; de < j; de += 1)
              E.push(I(ae, oe));
          return E;
        }, y;
      })(), w = function() {
        var C = [], I = 0, y = {};
        return y.getBuffer = function() {
          return C;
        }, y.getAt = function(p) {
          var k = Math.floor(p / 8);
          return (C[k] >>> 7 - p % 8 & 1) == 1;
        }, y.put = function(p, k) {
          for (var M = 0; M < k; M += 1)
            y.putBit((p >>> k - M - 1 & 1) == 1);
        }, y.getLengthInBits = function() {
          return I;
        }, y.putBit = function(p) {
          var k = Math.floor(I / 8);
          C.length <= k && C.push(0), p && (C[k] |= 128 >>> I % 8), I += 1;
        }, y;
      }, _ = function(C) {
        var I = a.MODE_NUMBER, y = C, p = {};
        p.getMode = function() {
          return I;
        }, p.getLength = function(g) {
          return y.length;
        }, p.write = function(g) {
          for (var u = y, E = 0; E + 2 < u.length; )
            g.put(k(u.substring(E, E + 3)), 10), E += 3;
          E < u.length && (u.length - E == 1 ? g.put(k(u.substring(E, E + 1)), 4) : u.length - E == 2 && g.put(k(u.substring(E, E + 2)), 7));
        };
        var k = function(g) {
          for (var u = 0, E = 0; E < g.length; E += 1)
            u = u * 10 + M(g.charAt(E));
          return u;
        }, M = function(g) {
          if ("0" <= g && g <= "9")
            return g.charCodeAt(0) - 48;
          throw "illegal char :" + g;
        };
        return p;
      }, S = function(C) {
        var I = a.MODE_ALPHA_NUM, y = C, p = {};
        p.getMode = function() {
          return I;
        }, p.getLength = function(M) {
          return y.length;
        }, p.write = function(M) {
          for (var g = y, u = 0; u + 1 < g.length; )
            M.put(
              k(g.charAt(u)) * 45 + k(g.charAt(u + 1)),
              11
            ), u += 2;
          u < g.length && M.put(k(g.charAt(u)), 6);
        };
        var k = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          if ("A" <= M && M <= "Z")
            return M.charCodeAt(0) - 65 + 10;
          switch (M) {
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
              throw "illegal char :" + M;
          }
        };
        return p;
      }, L = function(C) {
        var I = a.MODE_8BIT_BYTE, y = s.stringToBytes(C), p = {};
        return p.getMode = function() {
          return I;
        }, p.getLength = function(k) {
          return y.length;
        }, p.write = function(k) {
          for (var M = 0; M < y.length; M += 1)
            k.put(y[M], 8);
        }, p;
      }, b = function(C) {
        var I = a.MODE_KANJI, y = s.stringToBytesFuncs.SJIS;
        if (!y)
          throw "sjis not supported.";
        (function(M, g) {
          var u = y(M);
          if (u.length != 2 || (u[0] << 8 | u[1]) != g)
            throw "sjis not supported.";
        })("友", 38726);
        var p = y(C), k = {};
        return k.getMode = function() {
          return I;
        }, k.getLength = function(M) {
          return ~~(p.length / 2);
        }, k.write = function(M) {
          for (var g = p, u = 0; u + 1 < g.length; ) {
            var E = (255 & g[u]) << 8 | 255 & g[u + 1];
            if (33088 <= E && E <= 40956)
              E -= 33088;
            else if (57408 <= E && E <= 60351)
              E -= 49472;
            else
              throw "illegal char at " + (u + 1) + "/" + E;
            E = (E >>> 8 & 255) * 192 + (E & 255), M.put(E, 13), u += 2;
          }
          if (u < g.length)
            throw "illegal char at " + (u + 1);
        }, k;
      }, v = function() {
        var C = [], I = {};
        return I.writeByte = function(y) {
          C.push(y & 255);
        }, I.writeShort = function(y) {
          I.writeByte(y), I.writeByte(y >>> 8);
        }, I.writeBytes = function(y, p, k) {
          p = p || 0, k = k || y.length;
          for (var M = 0; M < k; M += 1)
            I.writeByte(y[M + p]);
        }, I.writeString = function(y) {
          for (var p = 0; p < y.length; p += 1)
            I.writeByte(y.charCodeAt(p));
        }, I.toByteArray = function() {
          return C;
        }, I.toString = function() {
          var y = "";
          y += "[";
          for (var p = 0; p < C.length; p += 1)
            p > 0 && (y += ","), y += C[p];
          return y += "]", y;
        }, I;
      }, A = function() {
        var C = 0, I = 0, y = 0, p = "", k = {}, M = function(u) {
          p += String.fromCharCode(g(u & 63));
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
        return k.writeByte = function(u) {
          for (C = C << 8 | u & 255, I += 8, y += 1; I >= 6; )
            M(C >>> I - 6), I -= 6;
        }, k.flush = function() {
          if (I > 0 && (M(C << 6 - I), C = 0, I = 0), y % 3 != 0)
            for (var u = 3 - y % 3, E = 0; E < u; E += 1)
              p += "=";
        }, k.toString = function() {
          return p;
        }, k;
      }, q = function(C) {
        var I = C, y = 0, p = 0, k = 0, M = {};
        M.read = function() {
          for (; k < 8; ) {
            if (y >= I.length) {
              if (k == 0)
                return -1;
              throw "unexpected end of file./" + k;
            }
            var u = I.charAt(y);
            if (y += 1, u == "=")
              return k = 0, -1;
            if (u.match(/^\s$/))
              continue;
            p = p << 6 | g(u.charCodeAt(0)), k += 6;
          }
          var E = p >>> k - 8 & 255;
          return k -= 8, E;
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
        return M;
      }, Q = function(C, I) {
        var y = C, p = I, k = new Array(C * I), M = {};
        M.setPixel = function(O, j, ae) {
          k[j * y + O] = ae;
        }, M.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(y), O.writeShort(p), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(y), O.writeShort(p), O.writeByte(0);
          var j = 2, ae = u(j);
          O.writeByte(j);
          for (var oe = 0; ae.length - oe > 255; )
            O.writeByte(255), O.writeBytes(ae, oe, 255), oe += 255;
          O.writeByte(ae.length - oe), O.writeBytes(ae, oe, ae.length - oe), O.writeByte(0), O.writeString(";");
        };
        var g = function(O) {
          var j = O, ae = 0, oe = 0, de = {};
          return de.write = function(le, pe) {
            if (le >>> pe)
              throw "length over";
            for (; ae + pe >= 8; )
              j.writeByte(255 & (le << ae | oe)), pe -= 8 - ae, le >>>= 8 - ae, oe = 0, ae = 0;
            oe = le << ae | oe, ae = ae + pe;
          }, de.flush = function() {
            ae > 0 && j.writeByte(oe);
          }, de;
        }, u = function(O) {
          for (var j = 1 << O, ae = (1 << O) + 1, oe = O + 1, de = E(), le = 0; le < j; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(j)), de.add(String.fromCharCode(ae));
          var pe = v(), _e = g(pe);
          _e.write(j, oe);
          var je = 0, Pe = String.fromCharCode(k[je]);
          for (je += 1; je < k.length; ) {
            var at = String.fromCharCode(k[je]);
            je += 1, de.contains(Pe + at) ? Pe = Pe + at : (_e.write(de.indexOf(Pe), oe), de.size() < 4095 && (de.size() == 1 << oe && (oe += 1), de.add(Pe + at)), Pe = at);
          }
          return _e.write(de.indexOf(Pe), oe), _e.write(ae, oe), _e.flush(), pe.toByteArray();
        }, E = function() {
          var O = {}, j = 0, ae = {};
          return ae.add = function(oe) {
            if (ae.contains(oe))
              throw "dup key:" + oe;
            O[oe] = j, j += 1;
          }, ae.size = function() {
            return j;
          }, ae.indexOf = function(oe) {
            return O[oe];
          }, ae.contains = function(oe) {
            return typeof O[oe] < "u";
          }, ae;
        };
        return M;
      }, W = function(C, I, y) {
        for (var p = Q(C, I), k = 0; k < I; k += 1)
          for (var M = 0; M < C; M += 1)
            p.setPixel(M, k, y(M, k));
        var g = v();
        p.write(g);
        for (var u = A(), E = g.toByteArray(), O = 0; O < E.length; O += 1)
          u.writeByte(E[O]);
        return u.flush(), "data:image/gif;base64," + u;
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
  })(qn)), qn.exports;
}
var ag = sg();
const og = /* @__PURE__ */ ng(ag), rg = ["width", "height", "viewBox"], ig = ["width", "height"], lg = ["d"], cg = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = D(() => {
      const s = og(0, "M");
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
      }, null, 8, ig),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, lg)
    ], 8, rg));
  }
}, mv = /* @__PURE__ */ Y(cg, [["__scopeId", "data-v-489f0852"]]), gv = Vo(() => import("./VoiceFigure-CJ5mUtAR.js").then((e) => e.V)), vv = "1.0.0", yv = "3.5";
export {
  pg as $,
  Ng as A,
  Ge as B,
  Gg as C,
  Ig as D,
  Vg as E,
  Ag as F,
  To as G,
  zp as H,
  Fp as I,
  Xg as J,
  gt as K,
  Fg as L,
  Te as M,
  xt as N,
  Pg as O,
  vn as P,
  qg as Q,
  E1 as R,
  bo as S,
  Dg as T,
  zg as U,
  la as V,
  Cp as W,
  xp as X,
  ev as Y,
  Kg as Z,
  Y as _,
  ie as a,
  ye as a0,
  ds as a1,
  mg as a2,
  Nu as a3,
  fv as a4,
  Sg as a5,
  Yt as a6,
  nv as a7,
  dg as a8,
  ao as a9,
  Is as aA,
  uv as aB,
  cv as aC,
  dv as aD,
  _g as aE,
  $g as aF,
  bg as aG,
  sv as aH,
  Wf as aI,
  mt as aJ,
  yg as aK,
  kg as aL,
  ov as aM,
  iv as aN,
  N0 as aO,
  c0 as aP,
  av as aQ,
  eh as aR,
  ka as aS,
  lv as aT,
  Ee as aa,
  vv as ab,
  yv as ac,
  rv as ad,
  xg as ae,
  O0 as af,
  R0 as ag,
  P0 as ah,
  gg as ai,
  fr as aj,
  hv as ak,
  vg as al,
  mv as am,
  Nr as an,
  hg as ao,
  Mg as ap,
  Xn as aq,
  At as ar,
  wg as as,
  fg as at,
  pv as au,
  fa as av,
  ut as aw,
  Xd as ax,
  gv as ay,
  nt as az,
  Ke as b,
  jg as c,
  Og as d,
  Tg as e,
  Cg as f,
  Jg as g,
  mo as h,
  Wg as i,
  Hg as j,
  Ug as k,
  Zg as l,
  Bg as m,
  Eg as n,
  Lg as o,
  nn as p,
  tv as q,
  Yg as r,
  Rg as s,
  Ie as t,
  bp as u,
  Qg as v,
  Mp as w,
  ws as x,
  V1 as y,
  G1 as z
};
