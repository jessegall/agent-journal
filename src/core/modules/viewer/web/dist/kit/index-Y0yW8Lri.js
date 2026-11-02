/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as be, createElementVNode as g, normalizeClass as X, Fragment as J, renderList as re, normalizeStyle as xe, defineComponent as Do, Comment as No, h as os, cloneVNode as jo, createBlock as K, withCtx as U, unref as G, createVNode as F, toDisplayString as M, createCommentVNode as P, inject as ft, computed as I, resolveDynamicComponent as et, Transition as on, watch as ke, ref as H, shallowRef as rn, TransitionGroup as Po, mergeProps as dt, reactive as rs, createTextVNode as ge, onMounted as Ne, onUnmounted as Ae, nextTick as ln, useId as fa, Teleport as pa, withModifiers as Me, isRef as $s, resolveDirective as qo, withDirectives as $t, useModel as qn, useAttrs as ma, getCurrentInstance as Wo, mergeModels as Wn, getCurrentScope as ga, onScopeDispose as va, onBeforeUnmount as is, provide as Ho, onErrorCaptured as Fo, toHandlers as Uo, createSlots as zo, withKeys as Hn, vModelText as ya, defineAsyncComponent as Vo } from "vue";
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
      g("span", {
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
}, Je = /* @__PURE__ */ Y(Ko, [["__scopeId", "data-v-0ebb6933"]]), ls = Do({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== No);
      return s.length !== 1 ? os(J, { key: n }, s) : s[0].key == null ? jo(s[0], { key: n }) : s[0];
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
    return (l, u) => (c(), K(ls, { value: e.shape }, {
      messages: U(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(J, null, re(t, (f) => g("div", {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: xe({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, Yo)
      ]),
      older: U(() => [
        g("div", {
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
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(J, null, re(e.count, (f) => (c(), h("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (c(), h(J, null, re(n, (b) => F(Je, {
              key: b.id,
              bars: b.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Zo)
      ]),
      file: U(() => [
        g("div", {
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
            (c(), h(J, null, re(a, (b) => F(Je, {
              key: b.id,
              bars: b.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Qo)
      ]),
      page: U(() => [
        g("div", {
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
        g("div", {
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
        g("div", {
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
      g("p", ar, M(e.title), 1),
      g("p", or, [
        be(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", rr, [
      be(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Kt = /* @__PURE__ */ Y(ir, [["__scopeId", "data-v-b27e89b0"]]), lr = { class: "fold-group" }, cr = ["aria-expanded"], ur = { class: "fold-label" }, dr = {
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
      g("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        g("span", ur, M(e.label), 1),
        e.count !== "" ? (c(), h("span", dr, M(e.count), 1)) : P("", !0),
        g("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, cr),
      e.open ? be(s.$slots, "default", {}, void 0, !0, 0) : P("", !0)
    ]));
  }
}, rg = /* @__PURE__ */ Y(hr, [["__scopeId", "data-v-9ef1865c"]]), tt = Symbol.for("journal.window-context");
function wa() {
  const e = ft(tt, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const fr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: xe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, pr = /* @__PURE__ */ Y(fr, [["__scopeId", "data-v-eb453d6f"]]), mr = {
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
    const t = e, n = I(() => {
      var s;
      return t.busy || t.disabled || !!((s = ft(tt, null)) != null && s.readOnly);
    });
    return (s, a) => (c(), K(et(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: X(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: U(() => [
        g("span", {
          class: X(["btn-label", { hidden: e.busy }])
        }, [
          be(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (c(), K(pr, {
          key: 0,
          class: "btn-spinner"
        })) : P("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ Y(mr, [["__scopeId", "data-v-a2dc4bda"]]), gr = {
  class: "running",
  "data-running-command": ""
}, vr = ["title"], yr = {
  key: "idle",
  class: "running-idle"
}, wr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", gr, [
      F(on, {
        name: "roll",
        mode: "out-in"
      }, {
        default: U(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, M(e.text), 9, vr)) : (c(), h("span", yr, M(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, ig = /* @__PURE__ */ Y(wr, [["__scopeId", "data-v-e3ee3449"]]), kr = ["aria-checked", "aria-label", "title"], br = {
  key: 0,
  class: "switch-inner"
}, xr = {
  key: 0,
  class: "switch-word"
}, $r = {
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
      g("span", {
        class: X(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", br, M(e.word), 1)) : P("", !0),
        a[1] || (a[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", xr, M(e.word), 1)) : P("", !0)
    ], 10, kr));
  }
}, lg = /* @__PURE__ */ Y($r, [["__scopeId", "data-v-1bfb90f3"]]);
function ka(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Mt(e, t) {
  return ka(() => localStorage, e, t);
}
function ba(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function cn(e, t) {
  return ba(() => localStorage, e, t);
}
function xa(e, t) {
  ke(t, (n) => cn(e, n), { deep: !0 });
}
function Mr(e, t) {
  return ka(() => sessionStorage, e, t);
}
function _r(e, t) {
  return ba(() => sessionStorage, e, t);
}
const Yt = "journal.environment", $a = H(Mr(Yt, Mt(Yt, "")));
function Sr(e) {
  $a.value = e, _r(Yt, e), cn(Yt, e);
}
const Jt = H(location.hash), Ms = rn(null), _s = { integrations: "mcp", library: "team" };
function Er() {
  if (!Ms.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (_s[n]) {
    location.replace(`#/${[_s[n], ...s].join("/")}${t ? `?${t}` : ""}`), Jt.value = location.hash;
    return;
  }
  !n || Ms.value(n) || (Sr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Jt.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Jt.value = location.hash, Er();
});
const De = I(() => {
  const [e, t = ""] = Jt.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((i) => {
    const [r, l = ""] = i.split("@"), [u = "", f = "", b = ""] = r.split(":");
    return { table: u, id: Number(f), comment: Number(b) || 0, env: l };
  });
  return {
    env: $a.value,
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
}), un = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${un.page(e)}?open=${t}`
};
function Ar(e = "", t = 0, n = "") {
  location.hash = un.page(e, t, n);
}
const Cr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ma(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([i]) => i !== "open" && i !== "sub").map(([i, r]) => `${i}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Cr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const yn = {};
function _a(e, t, n = 0, s = "") {
  var i;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((i = yn[e]) != null && i.call(yn, t))) return;
  const a = De.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  Ma([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Or(e, t, n, s = 0, a = "") {
  if (e === De.value.env) return _a(t, n, s, a);
  const o = De.value.stack, i = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Ma([...i < 0 ? o : o.slice(0, i), { table: t, id: n, comment: s, env: e }], a);
}
function pt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Or(s, a, Number(o), 0, t) : _a(a, Number(o), 0, t);
}
function Tr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function lt(e) {
  const t = Tr(e);
  t && pt(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Br = ["stroke-width", "innerHTML"], Ee = {
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
    }, null, 12, Br));
  }
}, cs = {
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
}, Lr = {
  key: 1,
  class: "row-list-failure"
}, Rr = ["data-row"], Ir = {
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
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = H(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, i) => !e.loaded && !e.failure ? (c(), K(At, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Lr, M(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), K(Kt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (c(), h(J, { key: 3 }, [
      (c(), K(et(e.arrival ? Po : "ul"), dt(n.value, { class: "row-list" }), {
        default: U(() => [
          (c(!0), h(J, null, re(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            be(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Rr))), 128))
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
}, Dr = /* @__PURE__ */ Y(Ir, [["__scopeId", "data-v-7f34ada7"]]), Nr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, jr = {
  key: 1,
  class: "agent-rows-note"
}, Pr = {
  key: 2,
  class: "agent-rows-note"
}, qr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Wr = ["data-agent-row", "onClick"], Hr = { class: "agent-row-name" }, Fr = { class: "agent-row-state" }, Ur = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = I(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Nr, [
      e.loaded ? e.failure ? (c(), h("p", jr, M(e.failure), 1)) : e.rows.length ? (c(), h(J, { key: 3 }, [
        g("p", qr, M(s.value) + " running", 1),
        (c(!0), h(J, null, re(n.value, (i) => (c(), h("button", {
          key: i.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": i.id,
          onClick: (r) => G(pt)(`agents:${i.id}`)
        }, [
          g("span", Hr, "#" + M(i.id) + " " + M(i.session), 1),
          g("span", Fr, M(i.ended_at ? "Closed" : "Running"), 1)
        ], 8, Wr))), 128))
      ], 64)) : (c(), h("p", Pr, M(e.none), 1)) : (c(), K(At, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, cg = /* @__PURE__ */ Y(Ur, [["__scopeId", "data-v-a01e5a17"]]), zr = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, M(e.text), 3));
  }
}, Sa = /* @__PURE__ */ Y(zr, [["__scopeId", "data-v-9e7e1157"]]), Vr = ["aria-valuenow", "aria-valuemax"], Gr = {
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
    return (s, a) => (c(), h("span", {
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: xe({ width: n.value })
      }, null, 4)
    ], 10, Vr));
  }
}, Kr = /* @__PURE__ */ Y(Gr, [["__scopeId", "data-v-9eba6a85"]]), Yr = { class: "bars" }, Jr = { class: "bar-name" }, Zr = { class: "bar-value" }, Qr = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => Math.max(1, ...n.items.map((i) => Number(i.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (i, r) => (c(), h("div", Yr, [
      (c(!0), h(J, null, re(e.items, (l, u) => (c(), K(et(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: X(["bar-row", l.tone, { opens: l.open }]),
        onClick: (f) => l.open && s("open", l.open)
      }, {
        default: U(() => [
          g("span", Jr, M(l.label), 1),
          F(Kr, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", Zr, M(l.value) + M(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Xr = /* @__PURE__ */ Y(Qr, [["__scopeId", "data-v-663427f4"]]), ei = { class: "bars" }, ti = {
  key: 0,
  class: "bars-title"
}, ni = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", ei, [
      e.node.title ? (c(), h("span", ti, M(e.node.title), 1)) : P("", !0),
      F(Xr, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, si = /* @__PURE__ */ Y(ni, [["__scopeId", "data-v-7135bb11"]]), ai = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (i) => ({ gap: `${i.gap || 14}px` }),
      row: (i) => ({ gap: `${i.gap || 12}px` }),
      grid: (i) => ({ gap: `${i.gap || 12}px`, gridTemplateColumns: `repeat(${i.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = I(() => n[s.node.type](s.node));
    return (i, r) => (c(), h("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: xe(o.value)
    }, [
      (c(!0), h(J, null, re(e.node.children || [], (l, u) => (c(), K(eo, {
        key: u,
        node: l,
        onOpen: r[0] || (r[0] = (f) => a("open", f)),
        onFile: r[1] || (r[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Ft = /* @__PURE__ */ Y(ai, [["__scopeId", "data-v-d142a3f4"]]), oi = {
  key: 0,
  class: "card-head"
}, ri = { class: "card-title" }, ii = {
  key: 0,
  class: "card-note"
}, li = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", oi, [
        g("span", ri, M(e.node.title), 1),
        e.node.note ? (c(), h("span", ii, M(e.node.note), 1)) : P("", !0)
      ])) : P("", !0),
      F(Ft, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, ci = /* @__PURE__ */ Y(li, [["__scopeId", "data-v-67b72d40"]]), ui = (e, t, n) => Math.max(t, Math.min(n, e)), di = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, $e = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ss = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", wn = 80;
function Es(e) {
  return e.length <= wn ? e : `${e.slice(0, wn + 1).replace(/\s+\S*$/, "") || e.slice(0, wn)}…`;
}
const As = {
  messages: (e) => Es(Ss(e.text)),
  comments: (e) => Es(Ss(e.text)),
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
}, hi = (e) => (As[e.table] ? As[e.table](e) : e.title || "") || "", fi = ["done", "cancelled"], Fn = {
  tasks: (e) => $e(e.completed_at) || (e.state === "cancelled" ? $e(e.updated_at) : 0),
  questions: (e) => e.answer ? $e(e.updated_at) : 0,
  plans: (e) => fi.includes(e.state) ? $e(e.updated_at) : 0,
  notices: (e) => $e(e.closed_at),
  secrets: (e) => $e(e.deleted_at),
  workers: (e) => e.state === "stopped" ? $e(e.updated_at) : 0,
  shares: (e) => $e(e.stopped_at),
  dumps: (e) => $e(e.completed_at),
  agents: (e) => e.state === "ended" ? $e(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? $e(e.created_at) : 0
}, pi = (e) => Fn[e.table] ? Fn[e.table](e) : 0, Ea = (e) => pi(e) > 0, mi = (e) => !!Fn[e], Aa = (e) => $e(e.created_at), Zt = (e) => $e(e.updated_at) || Aa(e), gi = (e) => "task_ids" in e, dn = typeof document < "u" && document.documentElement.classList.contains("phone"), vi = "Files are attached on the computer; the phone sends text.", Ca = 1024, yi = Ca * 1024 * 1024, wi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ca} MB limit for one file.`;
function ki() {
  return () => {
  };
}
function Cs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function bi(e = window) {
  if (!Cs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Cs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Oa = "status.summary", ve = rs({
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
}), xi = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Ta = () => !!ve.countdown || xi() || ve.starting;
function $i(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function Mi(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function _i() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Si(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (_i(), !0);
}
let It = { version: "", started: 0 };
function Ei(e) {
  return e.version ? (It.version || (It = { version: e.version, started: e.started || 0 }), e.version !== It.version || (e.started || 0) !== It.started) : !1;
}
function Ai(e) {
  Mi(e.countdown), $i(e.ready, e.step), (Si(!!e.updating, e.step) || !e.updating && !Ci(e) && Ei(e)) && bi(window);
}
const Ci = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Os = 2e4, Oi = 3e5, qe = 6e5, Dt = 6, Ti = 500, Bi = "/journal/summary", Ts = dn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Li = (e) => e.split("?")[0].endsWith(Bi), Ba = (e, t) => Object.assign(new Error(t), { status: e });
async function Ri(e, t, n = Ba) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Ii = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Di {
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
        headers: { ...Ts, ...i, ...s === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: Ii(s),
        signal: AbortSignal.timeout(a || (r ? Oi : Os))
      });
    } catch (l) {
      if (t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Ti)), this.reach(t, n, s, a, o - 1, i);
    }
  }
  async send(t, n, s, a = 0, o = Dt, i = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : ki(), l = await this.reach(t, n, s, a, o, i).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return Ri(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ts, signal: AbortSignal.timeout(Os) });
    if (!n.ok) throw Ba(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, i = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Dt, o).then((l) => (this.written(n), l));
    if (Ta() && !Li(n))
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
const Ie = new Di(), Se = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const vt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: i = !1 }) => [i ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), yt = "the page does not know its environment yet", Ni = "X-Journal-Env", ji = "X-Journal-Request-At", kn = "/viewer/voices/figures/";
class us {
  constructor({ env: t = () => De.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new us({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [ji]: String(Date.now()), ...this.env() ? { [Ni]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === yt ? Promise.reject(new Error(yt)) : Ie.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === yt ? Promise.reject(new Error(yt)) : Ie.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : yt;
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
    if (dn) return Promise.reject(Object.assign(new Error(vi), { status: 403 }));
    if (s.size > yi) return Promise.reject(new Error(wi(s)));
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
    return Ie.request("GET", kn + "figures.json");
  }
  voiceFigureUrl(t) {
    return kn + t;
  }
  figureDecoderUrl() {
    return kn + "draco/";
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
    return `${this.base}/${t ? `?env=${Se(t)}` : ""}${un.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ie = new us({ base: dn ? "/p" : "" }), Pi = (e) => Ie.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), qi = { claude: "Claude Code", codex: "Codex" };
Object.entries(qi).map(([e, t]) => ({ key: e, label: t }));
const Bs = (e) => e.status === "stopped" ? 1 : 0, Wi = "main", Hi = (e) => e.filter((t) => t.role === Wi).sort((t, n) => Bs(t) - Bs(n) || $e(n.heard_at) - $e(t.heard_at))[0] || null, Fi = { me: 1, people: [] }, z = rs({
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
  people: Fi,
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
xa("journal.activity", () => z.activity);
xa("journal.side.mini", () => z.sideMini);
const ht = I(() => Hi(z.agents));
I(() => !!ht.value && z.live.some((e) => e.agent.session === ht.value.session && e.environment === De.value.env));
I(() => !!ht.value && ["busy", "working"].includes(ht.value.status));
function Ui(e) {
  if (!e) return "";
  const t = typeof e == "string" ? Date.parse(e) / 1e3 : e, n = Math.max(0, Date.now() / 1e3 - t);
  return n < 60 ? "now" : n < 3600 ? `${Math.floor(n / 60)}m` : n < 86400 ? `${Math.floor(n / 3600)}h` : `${Math.floor(n / 86400)}d`;
}
function Ls(e) {
  const t = Ui(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function La(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Rs(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const bn = (e) => String(e).padStart(2, "0");
function zi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${bn(t % 60)}s` : `${Math.floor(t / 3600)}h ${bn(Math.floor(t % 3600 / 60))}m ${bn(t % 60)}s`;
}
const Vi = ["working", "busy", "waiting", "compacting"], Gi = (e) => Vi.includes(e), Ki = "builder";
I(() => !z.settings || z.settings.features.file_feed !== !1);
const Yi = I(() => !z.settings || z.settings.features.status_bar !== !1);
I(() => z.settings && z.settings.workers && z.settings.workers.mode || Ki);
I(() => !z.settings || !z.settings.tasks || z.settings.tasks.auto !== !1);
I(() => !!(z.settings && z.settings.reviewing && z.settings.reviewing.reviewer));
I(() => !z.settings || z.settings.features.sharing !== !1);
const Qt = 50, ds = 100, Ji = { messages: 25 }, Re = (e) => Ji[e] || Qt;
function Zi(e, t) {
  if (e !== "messages") return Math.max(t.length - Re(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Re(e)) return s;
  return 0;
}
const Qi = "review_step", Xi = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === Qi).sort((t, n) => t.id - n.id), el = 5, tl = 500, nl = 3e3, sl = () => z.entries.length ? z.entries[z.entries.length - 1].id : 0, Ut = { env: "", id: 0 }, al = () => !!(z.bar && z.bar.length) || Gi(ht.value && ht.value.status);
function ol({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function rl() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: ds })))).then(Xi);
}
function il() {
  return Ut.env !== ie.env() && Object.assign(Ut, { env: ie.env(), id: sl() }), ie.entries(Ut.id);
}
function ll(e) {
  e.length && (Ut.id = e[e.length - 1].id, Xl(e));
}
async function cl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", Qt);
}
const Un = /* @__PURE__ */ new Map();
async function zn(e, t) {
  const n = `${e}:${ie.env()}`, s = Un.get(n);
  if (!s) return Is(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(Zt)), o = s.length ? Math.min(...s.map((l) => l.id)) - 1 : 0, i = await ie.list("workers", { limit: t, since: a, after: o });
  if (!i.is_last_page)
    return Un.delete(n), zn(e, t);
  const r = new Set(i.rows.map((l) => l.id));
  return Is(
    n,
    [...s.filter((l) => !r.has(l.id)), ...i.rows].sort((l, u) => l.id - u.id)
  );
}
const Is = (e, t) => (Un.set(e, t), t);
async function Ds(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Ns = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => al() ? tl : nl,
    take: (e) => Array.isArray(e) && (z.bar = e),
    active: () => Yi.value
  },
  "agents.index": { read: () => Ds(ie, el), every: 1e3, take: (e) => z.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => z.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      z.summary = e, Ai(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => z.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => z.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (z.people = e) },
  "entries.recent": { read: il, every: 1e3, take: ll },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: ol, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => zn("workers.index", Re("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => zn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: rl, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Re("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: cl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Ds(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: Qt }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: Qt }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), ul = 6e4, dl = 3e3, hl = 4, fl = 300, pl = 5e3, Ra = /* @__PURE__ */ new Map();
function hn(e) {
  if (!(e in Ns)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ns[e];
}
function ml(e) {
  const t = hn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return pl;
  }
}
const gl = (e) => e / 2 + Math.random() * e / 2, Ia = (e) => [...e.users.values()].pop(), hs = (e) => Ra.get(e.place) === e, vl = () => Math.random() * fl, fs = () => document.hidden;
function yl(e) {
  const t = ml(e);
  return e.failures ? gl(Math.min(e.key === Oa ? dl : ul, t * 2 ** e.failures)) : Math.max(t, hl * e.took);
}
function Da(e, t) {
  clearTimeout(e.timer), !(!hs(e) || e.paused || fs()) && (e.timer = setTimeout(() => wl(e), t));
}
function wl(e) {
  return hs(e) ? e.running ? (e.again = !0, e.running) : (e.running = $l(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const kl = (e) => {
  var t, n;
  return !e.paused && !fs() && (((n = (t = hn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Ia(e).active() && (!Ta() || e.key === Oa);
};
async function bl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Ie.attemptOnce(() => hn(e.key).read(Ia(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function xl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = hn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function $l(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      kl(e) && xl(e, await bl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && hs(e) && !e.paused);
  Da(e, yl(e));
}
const Ml = () => fs() || Ra.forEach((e) => Da(e, vl()));
document.addEventListener("visibilitychange", Ml);
const _l = 60, Sl = (e, t) => $e(e.created_at) >= $e(t.created_at) - _l, El = (e, t) => e.id > 0 && e.table === t.table && Sl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ps = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => El(s, n))), xn = [
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
    filters: xn
  }),
  tasks: he("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: xn
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
  notices: he("Notice", "band", "One line pinned to the chat while it matters", { filters: xn }),
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
}, Al = ["secrets", "plugins"], Na = Object.keys(Ct).filter((e) => !(dn && Al.includes(e)));
I(() => Na.map((e) => ({ name: e, ...Ct[e] })));
const fn = (e) => Ct[e], ja = new Map(Na.flatMap((e) => [e, e.replace(/s$/, ""), Ct[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => ja.get(String(e).toLowerCase()) || "", Pa = [...ja.keys()].sort((e, t) => t.length - e.length).join("|"), Ye = /* @__PURE__ */ new Set(), ms = H(0), Ot = /* @__PURE__ */ new Set(), Tt = /* @__PURE__ */ new Set(), ze = /* @__PURE__ */ new Set(), Vn = /* @__PURE__ */ new Set(), Cl = /* @__PURE__ */ new Map(), Ol = /* @__PURE__ */ new Map();
let it = !1, wt = null;
const Tl = (e, t) => e.id - t.id, Bl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Ll = { messages: Bl }, qa = (e) => Ll[e] || Tl;
function Wa(e) {
  return ms.value, Ye.has(e) || (Ye.add(e), z.booted && (!Ot.has(e) || Tt.has(e)) && queueMicrotask(() => mn([e], !1))), z.rows[e] || [];
}
function Rl(e) {
  const t = z.rows[e] || [], n = Zi(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  z.rows[e] = t.filter((a) => s.has(a) || mi(e) && !Ea(a)), z.paging.size[e] = Re(e), z.paging.more[e] = !0;
}
const Il = /* @__PURE__ */ new Set();
function Dl() {
  Ye.forEach(Rl), Ye.clear(), Cl.clear(), Ol.clear(), ms.value += 1;
}
ke(() => `${De.value.env}/${De.value.page}/${De.value.open ? De.value.open.table : ""}`, Dl);
ke(
  () => z.booted,
  (e) => e && mn(
    [...Ye].filter((t) => !Ot.has(t)),
    !1
  )
);
const Gn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !gi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Ha(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Gn(s) && !Gn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Fa(e, t) {
  Ot.add(e), ms.value += 1;
  const n = z.rows[e] || [];
  z.rows[e] = [...Ha(n, t.rows), ...ps(n.filter((s) => s.id === 0), t.rows)], z.paging.size[e] = z.paging.size[e] || Re(e), z.paging.more[e] = !t.is_last_page;
}
async function Nl(e) {
  const t = new Set((z.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Re(e) });
  pn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ps((z.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Fa(e, { ...n, rows: [...n.rows, ...a].sort(qa(e)) }), z.paging.size[e] = Re(e), Ua.has(e) && await za(e), z.rows[e];
}
const pn = (e, t) => z.counts = { ...z.counts, [e]: t };
async function jl(e) {
  const t = z.rows[e] || [], n = Math.max(0, ...t.map(Zt)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await ie.list(e, { limit: Re(e), since: n, after: s });
  if (pn(e, a.counts), !a.is_last_page) return Nl(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), i = ps(t.filter((r) => !o.has(r.id)), a.rows).concat(Ha(t, a.rows));
  return z.rows[e] = i.sort(qa(e)), z.paging.size[e] = z.rows[e].length, z.rows[e];
}
const $n = /* @__PURE__ */ new Set();
async function Pl(e, t = !1) {
  e.forEach((n) => Tt.delete(n)), e.forEach((n) => Vn.add(n));
  try {
    await Vl(e, t);
  } finally {
    e.forEach((n) => Vn.delete(n));
  }
}
async function ql(e) {
  const t = await ie.list(e, { limit: Re(e) });
  pn(e, t.counts), Fa(e, t);
}
async function Wl(e) {
  pn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Ua = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function za(e) {
  const t = (z.rows[e] || []).filter((a) => Gn(a) && (e !== "plans" || !Ea(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  z.rows[e] = (z.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Hl = (e, t) => !Ot.has(e) || t && (z.paging.size[e] || Re(e)) === Re(e) && !Il.has(e);
async function Fl(e, t) {
  if (!Ye.has(e)) return Wl(e);
  const n = await (Hl(e, t) ? ql(e) : jl(e));
  return Ua.has(e) && await za(e), n;
}
async function Ul() {
  const [e, t] = await Promise.all([ie.entries(0, ds), ie.settings()]);
  Ka([...Mt(Ga(), []), ...e]), JSON.stringify(t) !== JSON.stringify(z.settings) && (z.settings = t);
}
const zl = (e, t) => Fl(e, t).then(
  () => null,
  () => e
);
async function Vl(e, t) {
  const n = (await Promise.all(e.map((s) => zl(s, t)))).filter(Boolean);
  if (n.forEach((s) => (ze.add(s), Tt.add(s))), t && await Ul(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Va = 1e3, Gl = 15e3;
let Nt = Va;
async function Kl() {
  return wt || (wt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...ze].some((e) => !$n.has(e)) || it; ) {
      const e = it, t = [...e ? Object.keys(z.rows) : ze].filter((s) => Ct[s] && (Ye.has(s) || s in z.rows)).filter((s) => e || !Ye.has(s) || Tt.has(s) || !Ot.has(s)).filter((s) => !$n.has(s)), n = [...ze].filter((s) => $n.has(s));
      ze.clear(), n.forEach((s) => ze.add(s)), it = !1;
      try {
        await Pl(t, e), Nt = Va;
      } catch {
        it = it || e, await new Promise((a) => setTimeout(a, Nt)), Nt = Math.min(Nt * 2, Gl);
      }
    }
  })().finally(() => wt = null), wt);
}
function mn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Vn.has(n)).forEach((n) => {
    ze.add(n), t && Tt.add(n);
  }), ze.has("settings") && (it = !0), Kl();
}
const Ga = () => {
  var e;
  return `typed-entries:${((e = z.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Ka(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  z.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ds), cn(Ga(), z.entries.slice(-50));
}
const Yl = ["created", "updated", "deleted"], Jl = { phases: ["phases", "plans"] }, Kn = (e) => Jl[e] || [e], Zl = (e) => Yl.includes(e.entry_type) ? [...Kn(e.data.table), ...(e.data.joins || []).flatMap(Kn)] : [];
function Ql(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of Kn(t.data.table).filter((s) => z.rows[s]))
      z.rows[n] = z.rows[n].filter((s) => s.id !== t.data.id);
}
function Xl(e) {
  Ka([...z.entries, ...e]), Ql(e), mn([...new Set(e.flatMap(Zl))].filter((t) => t && t !== "agents"));
}
Pi((e) => z.streamOpen || mn([e]));
const Yn = [], ec = 2e3, Ue = /* @__PURE__ */ new Map(), tc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, nc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function nt(e, { first: t = !1 } = {}) {
  t ? Yn.unshift(e) : Yn.push(e), Ue.clear();
}
function Ya(e, t, n) {
  var a;
  const s = Wa(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const sc = (e) => Wa(e.table).find((t) => t.id === e.id) === e.row, ac = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function He(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function oc(e, t) {
  const n = [{ kind: "text", text: He(e).replace(/\r\n/g, `
`) }];
  for (const s of Yn)
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
  return rc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function rc(e) {
  return e.split(nc).map((t, n) => n % 2 ? t : t.replace(tc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function js(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function ic(e) {
  const [t, , ...n] = e, s = js(t).map((o) => `<th>${_t(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${js(o).map((i) => `<td>${_t(i)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function lc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${_t(a)}</li>`).join("")}</${s}>`;
}
const Ps = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ja(e) {
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
      n.push(`<h${r}>${_t(o[2])}</h${r}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ps(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(ic(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(lc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Ja(
          t.slice(s, r).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let i = s;
    for (; i < t.length && t[i].trim() && !Ps(t, i) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[i]); )
      i += 1;
    n.push(`<p>${_t(t.slice(s, i).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = i;
  }
  return n.join("");
}
const cc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, uc = (e) => e.kind !== "text" && !cc.test(e.html);
function dc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Ja(s).replace(/\u0001(\d+)\u0001/g, (o, i) => t[Number(i)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : uc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Jn(e, t = { env: "" }) {
  const n = ac(e, t), s = Ue.get(n);
  if (Ue.delete(n), s && s.reads.every(sc))
    return Ue.set(n, s), s.html;
  const a = [], o = dc(oc(e, { ...t, reads: a }));
  return Ue.set(n, { html: o, reads: a }), Ue.size > ec && Ue.delete(Ue.keys().next().value), o;
}
const Za = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Xt = (e) => String(e || "").replace(Za, (t, n, s, a) => a), hc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), jt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, fc = /^Traceback \(most recent call last\):/m, pc = 8;
function Qa(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, pc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function mc(e) {
  const t = [...e.matchAll(hc)].map((s) => s.index);
  if (jt.lastIndex = 0, !t.length || !jt.test(e)) return null;
  jt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), i = [...o.matchAll(jt)];
    return { head: i.length ? o.slice(0, i[0].index).trim() : o, frames: i.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Qa(n), tail: "" } : null;
}
function gc(e) {
  const t = fc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Qa([o]), tail: n.slice(a).join(`
`) };
}
nt((e) => {
  const t = Xt(e), n = gc(t) || mc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Zn = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", vc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", yc = `${Zn} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, wc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", kc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", qs = {
  js: { keywords: Zn, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: vc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: yc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Zn, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: wc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: kc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Ws(e, t, n) {
  return n && e.startsWith(n, t);
}
function bc(e, t) {
  const n = qs[t] || qs.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Ws(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      i("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Ws(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], b = n.lower ? f.toLowerCase() : f, _ = n.property && /^\s*:/.test(e.slice(o + f.length));
      i(s.has(b) ? "keyword" : _ ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function xc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of bc(e, t))
    a.split(`
`).forEach((i, r) => {
      r && n.push(""), i && (n[n.length - 1] += s === "plain" ? He(i) : `<span class="tok-${s}">${He(i)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function $c(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Mc = 1500, Hs = /* @__PURE__ */ new WeakMap();
async function _c(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await $c(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Hs.get(t)), Hs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Mc)
  )));
}
typeof document < "u" && document.addEventListener("click", _c, !0);
const Sc = /^(```|~~~)\s*(\w+)?\s*$/, Fs = /^\s{4,}\S/, Ec = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Ac = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Xa(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Cc(e) {
  const t = Xa(e.join(`
`));
  return (Ac.find(([, n]) => n.test(t)) || ["text"])[0];
}
function Us(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${xc(Xa(e.join(`
`)), t || Cc(e)).join(`
`)}</code></pre></div>` };
}
function Oc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const i = t[o].match(Sc);
    if (i) {
      const r = t.findIndex((u, f) => f > o && u.trim().startsWith(i[1])), l = r < 0 ? t.length : r;
      a(), n.push(Us(t.slice(o + 1, l).map(Xt), i[2] ? i[2].toLowerCase() : "")), o = l + 1;
      continue;
    }
    if (Fs.test(t[o])) {
      let r = o;
      for (; r < t.length && (Fs.test(t[r]) || !t[r].trim()); ) r += 1;
      for (; r > o && !t[r - 1].trim(); ) r -= 1;
      const l = [];
      for (; s.length && s[s.length - 1].trim() && Ec.test(s[s.length - 1].trim()); ) l.unshift(s.pop());
      if (r - o + l.length >= 2) {
        a(), n.push(Us([...l, ...t.slice(o, r)].map(Xt), "")), o = r;
        continue;
      }
      s.push(...l);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
nt((e) => Oc(e));
const Tc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Bc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Lc(e) {
  const t = Tc.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = Bc.exec(e), s = n && ut(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Rc(e, t, n, s) {
  const a = Ya(s, e, t), o = Xt(a ? hi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${He(fn(e).title)} ${t}</span><span class="row-card-title">${He(o)}</span></a>`;
}
nt(
  (e, t) => {
    const n = Lc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Rc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ic = /\.(png|jpe?g|gif|webp|svg)$/i, Dc = (e) => Ic.test(e), Nc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, jc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Pc(e, t) {
  const n = Nc.exec(e), [, s, a, o, i, r] = n || [], l = n && ut(s || o), u = l && Ya(t, l, Number(a || i));
  if (!u || !(u.files || []).includes(r)) return null;
  const f = ie.in(t.env).fileUrl(l, u.id, r), b = `${fn(l).title} ${u.id} · ${He(r)}`, _ = Dc(r) ? `<img class="file-card-image" src="${f}" alt="${He(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${He(r)}">${_}<span class="file-card-name">${b}</span></a>` };
}
function qc(e) {
  const t = jc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${He(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
nt(
  (e, t) => {
    if (t.inline) return null;
    const n = Pc(e, t) || qc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Wc = /`([^`\n]+)`/g;
nt((e) => e.replace(Wc, (t, n) => `<code>${n}</code>`));
const zs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${un.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
nt(
  (e, t) => e.replace(Za, (n, s, a, o) => zs[s] ? zs[s](a, o, t) : o)
);
const Hc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Fc = new RegExp(`\\b(${Pa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Uc = new RegExp(`\\b(${Pa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), zc = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Vc = (e) => e.replace(Uc, (t, n, s) => s.replace(/\d+/g, (a) => zc(n.replace(/s$/i, ""), a))), Gc = (e) => Vc(e).replace(
  Fc,
  (t, n, s, a = "", o) => {
    const i = s || o;
    return `<a class="row-pill" href="#" data-peek="${ut(n)}:${i}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${i}${a ? `:${a}` : ""}</span></a>`;
  }
);
nt(
  (e, t) => t.rowNames === !1 ? e : e.split(Hc).map((n, s) => s % 2 ? n : Gc(n)).join("")
);
const Kc = ["innerHTML"], Yc = ["innerHTML"], Jc = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Jn(s, { env: De.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => G(lt) && G(lt)(...o)),
      innerHTML: n.value
    }, null, 8, Kc)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => G(lt) && G(lt)(...o)),
      innerHTML: n.value
    }, null, 8, Yc));
  }
}, ct = /* @__PURE__ */ Y(Jc, [["__scopeId", "data-v-30fd9c25"]]), Zc = { class: "fact" }, Qc = { class: "fact-label" }, Xc = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Zc, [
      g("span", Qc, M(e.label), 1),
      F(ct, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, eu = /* @__PURE__ */ Y(Xc, [["__scopeId", "data-v-3a88ecf8"]]), tu = { class: "list" }, nu = { class: "list-label" }, su = {
  key: 1,
  class: "list-note"
}, au = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", tu, [
      (c(!0), h(J, null, re(e.items, (o, i) => (c(), K(et(o.open ? "button" : "div"), {
        key: i,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: U(() => [
          g("span", nu, M(o.label), 1),
          o.badge ? (c(), K(Sa, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : P("", !0),
          o.note ? (c(), h("span", su, M(o.note), 1)) : P("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ou = /* @__PURE__ */ Y(au, [["__scopeId", "data-v-ebe2ae0a"]]), ru = { class: "table" }, iu = {
  key: 0,
  class: "table-row empty"
}, lu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, i) => (c(), h("div", ru, [
      g("div", {
        class: "table-row head",
        style: xe(a.value)
      }, [
        (c(!0), h(J, null, re(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, M(r), 1))), 128))
      ], 4),
      (c(!0), h(J, null, re(e.rows, (r, l) => (c(), K(et(r.open ? "button" : "div"), {
        key: l,
        type: r.open ? "button" : void 0,
        class: X(["table-row", r.tone, { opens: r.open }]),
        style: xe(a.value),
        onClick: (u) => r.open && s("open", r.open)
      }, {
        default: U(() => [
          (c(!0), h(J, null, re(r.cells, (u, f) => (c(), h("span", {
            key: f,
            class: "cell"
          }, M(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", iu, M(e.empty), 1)) : P("", !0)
    ]));
  }
}, cu = /* @__PURE__ */ Y(lu, [["__scopeId", "data-v-9326a52e"]]), uu = { class: "stat-value" }, du = { class: "stat-label" }, hu = {
  key: 0,
  class: "stat-note"
}, fu = {
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
    return (s, a) => (c(), K(et(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: U(() => [
        g("span", uu, M(e.value), 1),
        g("span", du, M(e.label), 1),
        e.note ? (c(), h("span", hu, M(e.note), 1)) : P("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, pu = /* @__PURE__ */ Y(fu, [["__scopeId", "data-v-ad0db6d6"]]), mu = { class: "code" }, gu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, i) => (c(), K(ls, {
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
        F(ci, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: U(() => [
        g("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, M(e.node.text), 3)
      ]),
      divider: U(() => [...i[2] || (i[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: U(() => [
        F(pu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: i[0] || (i[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: U(() => [
        F(si, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: U(() => [
        F(cu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: U(() => [
        F(ou, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: U(() => [
        F(ct, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: U(() => [
        F(eu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: U(() => [
        F(Sa, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: U(() => [
        g("pre", mu, [
          g("code", null, M(e.node.text), 1)
        ])
      ]),
      file: U(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: i[1] || (i[1] = (r) => a(e.node))
        }, M(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), eo = /* @__PURE__ */ Y(gu, [["__scopeId", "data-v-cbdcf540"]]), vu = { class: "dashboard" }, yu = { class: "trail" }, wu = ["onClick"], ku = {
  key: 0,
  class: "gone",
  role: "status"
}, bu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (_) => _ in (n.document.pages || {}), o = H(!!n.page && !a(n.page)), i = H(n.page && !o.value ? [n.page] : []), r = I(() => i.value.at(-1) || n.document.start), l = I(() => (n.document.pages || {})[r.value] || null), u = (_) => ((n.document.pages || {})[_] || {}).title || _, f = (_) => {
      o.value = !1, i.value = [...i.value, _];
    }, b = (_) => {
      o.value = !1, i.value = i.value.slice(0, _);
    };
    return ke(
      () => n.document.start,
      () => i.value = []
    ), (_, A) => (c(), h("div", vu, [
      e.document.broken ? (c(), K(Kt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: U(() => [
          ge(M(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), K(Kt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: U(() => [
          ge(M(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(J, { key: 2 }, [
        g("nav", yu, [
          g("button", {
            type: "button",
            class: X(["step", { current: !i.value.length }]),
            onClick: A[0] || (A[0] = (W) => b(0))
          }, M(u(e.document.start)), 3),
          (c(!0), h(J, null, re(i.value, (W, y) => (c(), h(J, {
            key: `${y}-${W}`
          }, [
            A[2] || (A[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: X(["step", { current: y === i.value.length - 1 }]),
              onClick: (w) => b(y + 1)
            }, M(u(W)), 11, wu)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", ku, "What you opened is no longer in this dashboard. Here is its start page.")) : P("", !0),
        F(on, {
          name: "page",
          mode: "out-in"
        }, {
          default: U(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              F(eo, {
                node: l.value.view,
                onOpen: f,
                onFile: A[1] || (A[1] = (W) => s("file", W))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : P("", !0)
    ]));
  }
}, ug = /* @__PURE__ */ Y(bu, [["__scopeId", "data-v-fbe83734"]]);
function xu(e, t, n, s = () => window) {
  Ne(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const $u = (e, t = () => !0) => xu("keydown", (n) => n.key === "Escape" && t() && e());
function Mu(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = H(!1), a = I(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return $u(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const _u = 80, ot = rs([]);
function Su(e) {
  const t = Symbol("layer"), n = () => ot.includes(t) && ot.splice(ot.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !ot.includes(t) && ot.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), I(() => _u + Math.max(0, ot.indexOf(t)));
}
let to = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return to = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Eu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Au(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const i = [...e.value.querySelectorAll(Eu)];
    if (!i.length) return o.preventDefault();
    const [r, l] = [i[0], i.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Ne(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : to, document.addEventListener("keydown", a), ln(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Cu = ["aria-modal", "aria-label", "aria-labelledby"], Ou = {
  key: 0,
  class: "dialog-head"
}, Tu = ["id", "tabindex"], Bu = {
  key: 1,
  class: "dialog-foot"
}, Lu = 500, Ru = 400, Iu = {
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
    const n = e, s = t, { visible: a, close: o, closed: i } = Mu(s, n), r = Su(a), l = H(null), u = H(null), f = H(null), b = fa(), _ = H(!1), A = Date.now();
    n.modal && Au(u, () => s("escape"), f);
    function W() {
      if (!n.modal) return n.closable && o();
      _.value = !0, setTimeout(() => _.value = !1, Ru);
    }
    function y(j) {
      !n.modal || Date.now() - A >= Lu || ![" ", "Enter"].includes(j.key) || (j.preventDefault(), j.stopPropagation());
    }
    const w = () => l.value && (l.value.scrollTop = l.value.scrollHeight), E = new MutationObserver(w);
    return ke(l, (j) => {
      E.disconnect(), j && n.follow && (E.observe(j, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Ae(() => E.disconnect()), (j, Q) => (c(), K(pa, { to: "body" }, [
      F(on, {
        name: "dialog",
        appear: "",
        onAfterLeave: G(i)
      }, {
        default: U(() => [
          G(a) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: xe({ zIndex: G(r) }),
            onClick: Me(W, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: _.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? G(b) : void 0,
              onKeydownCapture: y
            }, [
              e.bare ? P("", !0) : (c(), h("header", Ou, [
                g("h3", {
                  id: G(b),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, M(e.title), 9, Tu),
                e.closable ? (c(), K(cs, {
                  key: 0,
                  onClick: G(o)
                }, null, 8, ["onClick"])) : P("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: l,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                be(j.$slots, "default", {}, void 0, !0)
              ], 2),
              j.$slots.foot ? (c(), h("footer", Bu, [
                be(j.$slots, "foot", {}, void 0, !0)
              ])) : P("", !0)
            ], 42, Cu)
          ], 6)) : P("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Du = /* @__PURE__ */ Y(Iu, [["__scopeId", "data-v-6d1ecd98"]]), Fe = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Le = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Nu = 6;
function gs(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const ju = (e) => {
  const t = gs(e, Fe.lineChars), n = Math.max(Fe.minWidth, Math.max(...t.map((s) => s.length)) * Fe.charWidth + Fe.padX * 2);
  return { name: e, lines: t, line: Fe.line, padY: Fe.padY, width: n, height: t.length * Fe.line + Fe.padY * 2 };
};
function Pu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (i) => {
    a.set(i, "open"), t.forEach((r, l) => {
      if (r[0] !== i) return;
      const u = a.get(r[1]);
      u === "open" ? s.add(l) : u || o(r[1]);
    }), a.set(i, "done");
  };
  return [...n, ...e].forEach((i) => a.has(i) || o(i)), s;
}
function qu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, i]) => {
      n.get(i) < n.get(o) + 1 && (n.set(i, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Wu(e, t, n) {
  const s = [];
  e.forEach((i) => {
    var r;
    return (s[r = n.get(i)] || (s[r] = [])).push(i);
  });
  const a = () => new Map(s.flatMap((i) => i.map((r, l) => [r, l]))), o = (i, r) => {
    const l = a(), u = (f) => {
      const b = r(f).map((_) => l.get(_));
      return b.length ? b.reduce((_, A) => _ + A, 0) / b.length : l.get(f);
    };
    return [...i].sort((f, b) => u(f) - u(b));
  };
  for (let i = 0; i < Nu; i++) {
    const r = i % 2 === 0, l = s.map((u, f) => f);
    (r ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const f = (b) => t.filter((_) => _[r ? 1 : 0] === b).map((_) => _[r ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
function Hu(e, t) {
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
function Fu(e) {
  const t = [...new Set(e.flatMap(([q, C]) => [q, C]))], n = new Set(e.map(([, q]) => q)), s = t.filter((q) => !n.has(q)), a = Pu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((q, C) => !a.has(C)), i = qu(t, o), r = Wu(t, o, i), l = new Map(t.map((q) => [q, ju(q)])), u = r.map((q) => q.reduce((C, R) => C + l.get(R).width, 0) + Be.across * (q.length - 1)), f = Math.max(...u) + Be.margin * 2, b = zu(e, i, r.length), _ = /* @__PURE__ */ new Map();
  let A = Be.margin;
  r.forEach((q, C) => {
    let R = (f - u[C]) / 2;
    const v = Math.max(...q.map((p) => l.get(p).height));
    q.forEach((p) => {
      const k = l.get(p);
      _.set(p, { ...k, x: R, y: A + (v - k.height) / 2 }), R += k.width + Be.across;
    }), A += v + (b[C] ?? Be.down);
  });
  const W = e.map(([q, C, R], v) => ({ from: q, to: C, label: R || "", back: a.has(v) || i.get(C) <= i.get(q) }));
  Hu(W, _);
  const y = W.map((q) => Vu(q, _.get(q.from), _.get(q.to))), w = [..._.values()], E = Ju(y, w), j = Math.max(A - Be.down, ...E.filter((q) => q.label).map((q) => q.label.y + q.label.height));
  return { width: Math.max(f - Be.margin, ...E.filter((q) => q.label).map((q) => q.label.x + q.label.width)) + Be.margin, height: j + Be.margin, nodes: w, arrows: E };
}
const Uu = (e) => e ? gs(e, Le.lineChars).length * Le.line + Le.pad * 2 : 0;
function zu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, i]) => {
    const [r, l] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    l > r && (s[r + Math.floor((l - r - 1) / 2)] += Uu(i) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function Vu(e, t, n) {
  const s = e.label ? gs(e.label, Le.lineChars) : [], a = s.length ? Math.max(...s.map((_) => _.length)) * Le.charWidth + Le.pad * 2 : 0, o = s.length * Le.line + (s.length ? Le.pad * 2 : 0), i = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - r) / 2, b = [{ x: i, y: r }, { x: i, y: r + f }, { x: l, y: u - f }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: b, path: `M${i} ${r} C${i} ${r + f} ${l} ${u - f} ${l} ${u}` };
}
const Gu = ([e, t, n, s], a) => {
  const o = 1 - a, i = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: i("x"), y: i("y") };
}, Ku = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Yu = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Le.line);
function Ju(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: i }) => ({ x: s, y: a, width: o, height: i }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const f = Gu(s.curve, l);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, r = Yu.flatMap((l) => Ku.map((u) => a(u, l))).find((l) => !n.some((u) => Vs(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => Vs(r, l)); ) r.y += Le.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: Le.line, pad: Le.pad } };
  });
}
const Vs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Zu = { class: "flowchart-tools" }, Qu = ["width", "height", "viewBox", "aria-label"], Xu = ["d"], ed = ["x", "y", "width", "height"], td = ["x", "y"], nd = ["x", "dy"], sd = {
  key: 0,
  class: "flowchart-label"
}, ad = ["x", "y", "width", "height"], od = ["x", "y"], rd = ["x", "dy"], id = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => Fu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, i = H(null), r = H({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var E;
      const y = (E = i.value) == null ? void 0 : E.getBoundingClientRect();
      if (!(y != null && y.width)) return;
      const w = Math.min(y.width / a.value.width, y.height / a.value.height, 1.5);
      r.value = { zoom: w, x: (y.width - a.value.width * w) / 2, y: (y.height - a.value.height * w) / 2 };
    }
    function f(y, w, E) {
      const { zoom: j, x: Q, y: q } = r.value, C = Math.min(o.most, Math.max(o.least, j * y));
      r.value = { zoom: C, x: w - (w - Q) * C / j, y: E - (E - q) * C / j };
    }
    function b(y) {
      const w = i.value.getBoundingClientRect();
      f(y, w.width / 2, w.height / 2);
    }
    function _(y) {
      const w = i.value.getBoundingClientRect();
      y.ctrlKey || y.metaKey ? f(y.deltaY < 0 ? o.step : 1 / o.step, y.clientX - w.left, y.clientY - w.top) : r.value = { ...r.value, x: r.value.x - y.deltaX, y: r.value.y - y.deltaY };
    }
    function A(y) {
      var w, E, j;
      y.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), l = { x: y.clientX - r.value.x, y: y.clientY - r.value.y }, (j = (E = i.value).setPointerCapture) == null || j.call(E, y.pointerId);
    }
    function W(y) {
      l && (r.value = { ...r.value, x: y.clientX - l.x, y: y.clientY - l.y });
    }
    return Ne(u), (y, w) => (c(), K(Du, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (E) => s("close"))
    }, {
      default: U(() => [
        g("div", Zu, [
          F(ye, {
            small: "",
            onClick: w[0] || (w[0] = (E) => b(o.step))
          }, {
            default: U(() => [...w[5] || (w[5] = [
              ge("Zoom in", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            small: "",
            onClick: w[1] || (w[1] = (E) => b(1 / o.step))
          }, {
            default: U(() => [...w[6] || (w[6] = [
              ge("Zoom out", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            small: "",
            onClick: u
          }, {
            default: U(() => [...w[7] || (w[7] = [
              ge("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: i,
          class: "flowchart-frame",
          onWheel: Me(_, ["prevent"]),
          onPointerdown: A,
          onPointermove: W,
          onPointerup: w[2] || (w[2] = (E) => $s(l) ? l.value = null : l = null),
          onPointercancel: w[3] || (w[3] = (E) => $s(l) ? l.value = null : l = null)
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
            w[8] || (w[8] = g("defs", null, [
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
            (c(!0), h(J, null, re(a.value.arrows, (E, j) => (c(), h("path", {
              key: `arrow-${j}`,
              class: "flowchart-arrow",
              d: E.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Xu))), 128)),
            (c(!0), h(J, null, re(a.value.nodes, (E) => (c(), h("g", {
              key: E.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: E.x,
                y: E.y,
                width: E.width,
                height: E.height,
                rx: "8"
              }, null, 8, ed),
              g("text", {
                x: E.x + E.width / 2,
                y: E.y + E.padY + E.line / 2
              }, [
                (c(!0), h(J, null, re(E.lines, (j, Q) => (c(), h("tspan", {
                  key: Q,
                  x: E.x + E.width / 2,
                  dy: Q ? E.line : 0
                }, M(j), 9, nd))), 128))
              ], 8, td)
            ]))), 128)),
            (c(!0), h(J, null, re(a.value.arrows, (E, j) => (c(), h(J, {
              key: `label-${j}`
            }, [
              E.label ? (c(), h("g", sd, [
                g("rect", {
                  x: E.label.x,
                  y: E.label.y,
                  width: E.label.width,
                  height: E.label.height,
                  rx: "4"
                }, null, 8, ad),
                g("text", {
                  x: E.label.x + E.label.width / 2,
                  y: E.label.y + E.label.pad + E.label.line / 2
                }, [
                  (c(!0), h(J, null, re(E.label.lines, (Q, q) => (c(), h("tspan", {
                    key: q,
                    x: E.label.x + E.label.width / 2,
                    dy: q ? E.label.line : 0
                  }, M(Q), 9, rd))), 128))
                ], 8, od)
              ])) : P("", !0)
            ], 64))), 128))
          ], 12, Qu))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ld = /* @__PURE__ */ Y(id, [["__scopeId", "data-v-51d24cfe"]]), cd = ["title", "aria-label"], ud = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, dd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, hd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: X(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", ud, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", dd)) : P("", !0)
      ]))
    ], 10, cd));
  }
}, fd = /* @__PURE__ */ Y(hd, [["__scopeId", "data-v-6dc92808"]]), pd = "img,pre,table";
function md(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function gd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function vd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(pd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = md(gd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function yd(e, t) {
  let n = null;
  const s = () => e.value && vd(e.value);
  Ne(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const wd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function kd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const bd = ["data-from", "data-ref"], xd = { class: "message-body" }, $d = ["innerHTML"], Md = ["innerHTML"], _d = {
  class: "message-faces",
  "data-message-faces": ""
}, Sd = ["title", "data-face", "onClick"], Ed = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Ad = ["title", "data-reaction", "onClick"], Cd = {
  key: 0,
  class: "message-reaction-count"
}, Od = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Td = ["href", "title"], Bd = ["src", "alt"], Ld = ["href"], Rd = { class: "message-foot" }, Id = { class: "message-time" }, Dd = 1500, Nd = "An earlier message", jd = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = H(!1), o = H(null), i = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => i.value && !n.message.read_at && !n.message.local);
    async function l() {
      var R;
      await ((R = navigator.clipboard) == null ? void 0 : R.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Dd);
    }
    const u = I(() => Jn(n.message.text ?? "", { env: "" })), f = I(() => JSON.parse(n.message.flowchart_edges || "[]")), b = H(!1), _ = I(() => Jn(n.quote || Nd, { env: "" }));
    function A() {
      const R = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      R ? R.scrollIntoView({ block: "center", behavior: "smooth" }) : pt(`messages:${n.message.parent_id}`);
    }
    yd(o, () => `${n.message.text} ${n.quote}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, y = (R) => `/api/files/message/${n.message.id}/${encodeURIComponent(R)}`, w = I(() => JSON.parse(n.message.captions || "{}")), E = I(() => (n.message.files ?? []).map((R) => ({ name: R, address: y(R), isImage: W.test(R), title: w.value[R] || R }))), j = I(() => La(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), Q = H(!1), q = I(() => kd(n.message.reactions));
    function C(R) {
      Q.value = !1, s("react", n.message, R);
    }
    return (R, v) => (c(), h("article", {
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": i.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", xd, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: "message-card md",
          onClick: v[2] || (v[2] = (...p) => G(lt) && G(lt)(...p))
        }, [
          e.message.parent_id ? (c(), h("div", {
            key: 0,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Me(A, ["stop"]),
            innerHTML: _.value
          }, null, 8, $d)) : P("", !0),
          g("div", { innerHTML: u.value }, null, 8, Md),
          f.value.length ? (c(), h(J, { key: 1 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: v[0] || (v[0] = (p) => b.value = !0)
            }, "Open the flowchart"),
            b.value ? (c(), K(ld, {
              key: 0,
              title: e.message.text,
              edges: f.value,
              onClose: v[1] || (v[1] = (p) => b.value = !1)
            }, null, 8, ["title", "edges"])) : P("", !0)
          ], 64)) : P("", !0)
        ], 512),
        g("div", {
          class: X(["message-tools", { picking: Q.value }]),
          "data-message-tools": ""
        }, [
          Q.value ? (c(), h(J, { key: 0 }, [
            g("div", _d, [
              (c(!0), h(J, null, re(G(wd), (p) => (c(), h("button", {
                key: p,
                type: "button",
                class: "message-face",
                title: `React ${p}`,
                "data-face": p,
                onClick: (k) => C(p)
              }, M(p), 9, Sd))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: v[3] || (v[3] = (p) => Q.value = !1)
            }, [
              F(Ee, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(J, { key: 1 }, [
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: v[4] || (v[4] = (p) => Q.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: v[5] || (v[5] = (p) => s("reply", e.message))
            }, "Reply"),
            g("button", {
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
              onClick: v[6] || (v[6] = (p) => s("delete", e.message))
            }, "Delete")) : P("", !0)
          ], 64))
        ], 2)
      ]),
      q.value.length ? (c(), h("div", Ed, [
        (c(!0), h(J, null, re(q.value, (p) => (c(), h("button", {
          key: p.emoji,
          type: "button",
          class: X(["message-reaction", { mine: p.mine }]),
          title: p.title,
          "data-reaction": p.emoji,
          onClick: (k) => s("react", e.message, p.emoji)
        }, [
          ge(M(p.emoji) + " ", 1),
          p.count > 1 ? (c(), h("span", Cd, M(p.count), 1)) : P("", !0)
        ], 10, Ad))), 128))
      ])) : P("", !0),
      E.value.length ? (c(), h("div", Od, [
        (c(!0), h(J, null, re(E.value, (p) => (c(), h(J, {
          key: p.name
        }, [
          p.isImage ? (c(), h("a", {
            key: 0,
            href: p.address,
            target: "_blank",
            class: "message-image",
            title: p.title
          }, [
            g("img", {
              src: p.address,
              alt: p.name
            }, null, 8, Bd)
          ], 8, Td)) : (c(), h("a", {
            key: 1,
            href: p.address,
            target: "_blank",
            class: "message-file"
          }, M(p.name), 9, Ld))
        ], 64))), 128))
      ])) : P("", !0),
      g("div", Rd, [
        g("time", Id, M(j.value), 1),
        i.value ? (c(), K(fd, {
          key: 0,
          message: e.message
        }, null, 8, ["message"])) : P("", !0)
      ])
    ], 8, bd));
  }
}, dg = /* @__PURE__ */ Y(jd, [["__scopeId", "data-v-204d3dec"]]), Pd = ["aria-label"], Mn = 200, qd = 300, Gs = 400, Wd = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Mn } },
  setup(e) {
    const t = e, n = I(() => t.value < Mn ? [1, 0.25, 0.25] : t.value === Mn ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, a) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: e.value >= Gs, high: e.value >= qd && e.value < Gs }]),
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
        style: xe({ opacity: n.value[0] })
      }, null, 4),
      g("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: xe({ opacity: n.value[1] })
      }, null, 4),
      g("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: xe({ opacity: n.value[2] })
      }, null, 4)
    ], 10, Pd));
  }
}, hg = /* @__PURE__ */ Y(Wd, [["__scopeId", "data-v-89404405"]]), no = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], fg = (e) => {
  var t;
  return ((t = no.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Ks = {
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
}, Hd = ["innerHTML"], Fd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => Ks[t.name] || Ks.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Hd));
  }
}, St = /* @__PURE__ */ Y(Fd, [["__scopeId", "data-v-beb5935c"]]), Ud = {
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
}, so = /* @__PURE__ */ Y(Ud, [["__scopeId", "data-v-d03899bb"]]), zd = ["aria-checked", "aria-haspopup", "onClick"], Vd = {
  key: 0,
  class: "segmented-dot"
}, Gd = {
  key: 1,
  class: "segmented-count"
}, Kd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = fa();
    return (a, o) => {
      const i = qo("tip");
      return c(), h("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(J, null, re(e.options, (r) => $t((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: X(["segmented-option", { on: r.key === e.value }]),
          onClick: (l) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", Vd)) : P("", !0),
          ge(" " + M(r.label) + " ", 1),
          r.count !== void 0 ? (c(), h("em", Gd, M(r.count), 1)) : P("", !0)
        ], 10, zd)), [
          [i, r.tip || r.title, `${G(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Qn = /* @__PURE__ */ Y(Kd, [["__scopeId", "data-v-ca953072"]]), Ys = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Yd = {
  key: 1,
  class: "text-field-label"
}, Jd = {
  key: 2,
  class: "text-field-end"
}, Zd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Wn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = qn(e, "modelValue"), s = ma(), a = "onUpdate:modelValue" in (((f = Wo()) == null ? void 0 : f.vnode.props) || {}), o = I(() => a ? n.value : s.value), i = (b) => a && (n.value = b.target.value), r = I(
      () => Object.fromEntries(Object.entries(s).filter(([b]) => b !== "class" && b !== "style" && b !== "value"))
    ), l = I(() => Object.fromEntries(Object.entries(s).filter(([b]) => b !== "value"))), u = H(null);
    return t({ focus: () => u.value && u.value.focus() }), (b, _) => e.label || e.icon || b.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: b.$slots.end }, G(s).class]),
      style: xe(G(s).style)
    }, [
      e.icon ? (c(), K(Ee, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : P("", !0),
      e.label ? (c(), h("span", Yd, M(e.label), 1)) : P("", !0),
      $t(g("input", dt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: i }), null, 16), [
        [G(Ys), o.value]
      ]),
      b.$slots.end ? (c(), h("span", Jd, [
        be(b.$slots, "end", {}, void 0, !0)
      ])) : P("", !0)
    ], 6)) : $t((c(), h("input", dt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: i }), null, 16)), [
      [G(Ys), o.value]
    ]);
  }
}), Qd = /* @__PURE__ */ Y(Zd, [["__scopeId", "data-v-d9c38ca8"]]);
function Xd(e, t, { incremental: n = !1 } = {}) {
  const s = wa(), a = H([]), o = H(""), i = H(!1), r = H(""), l = H(null);
  async function u(y) {
    const w = await s.read(`${e} --before-id ${y + 1} --limit 1`);
    if (!w.ok) return A();
    const E = w.value.rows.find((j) => j.id === y);
    a.value = E ? a.value.map((j) => j.id === y ? E : j) : a.value.filter((j) => j.id !== y);
  }
  async function f(y) {
    if (n && String((y == null ? void 0 : y.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((q) => q.id !== y.row_id));
    if (n && (y != null && y.row_id) && !String(y.event ?? "").endsWith(".create") && a.value.some((q) => q.id === y.row_id)) return u(y.row_id);
    if (!(n && a.value.length && String((y == null ? void 0 : y.event) ?? "").endsWith(".create"))) return A();
    const E = Math.max(...a.value.map((q) => q.id)), j = await s.read(`${e} --after-id ${E}`);
    if (!j.ok) return A();
    const Q = new Set(a.value.map((q) => q.id));
    a.value = [...j.value.rows.filter((q) => !Q.has(q.id)), ...a.value];
  }
  async function b() {
    if (!a.value.length) return !1;
    const y = Math.min(...a.value.map((j) => j.id)), w = await s.read(`${e} --before-id ${y}`);
    if (!w.ok || !w.value.rows.length) return !1;
    const E = new Set(a.value.map((j) => j.id));
    return a.value = [...a.value, ...w.value.rows.filter((j) => !E.has(j.id))], !0;
  }
  let _ = 0;
  async function A() {
    const y = ++_, w = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (y !== _) return;
    const E = w.ok ? s.shared ? [w.value] : w.value.rows : [], j = E.length ? Math.min(...E.map((Q) => Q.id)) : 0;
    a.value = n && w.ok && j ? [...a.value.filter((Q) => Q.id > Math.max(...E.map((q) => q.id))), ...E, ...a.value.filter((Q) => Q.id < j)] : E, o.value = w.ok ? "" : w.error, i.value = !0;
  }
  async function W(y) {
    const w = await s.run(y);
    return r.value = w.ok ? "" : w.error, l.value = w.ok ? w.value : null, await A(), w;
  }
  return s.follow(t, f), A(), { rows: a, failure: o, loaded: i, load: A, older: b, act: W, actionFailure: r, answer: l, context: s };
}
const eh = { class: "title" }, th = { class: "state" }, nh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Xd(t.line, t.events);
    return (o, i) => (c(), K(Dr, {
      rows: G(n),
      failure: G(s),
      loaded: G(a),
      empty: e.empty
    }, {
      default: U(({ row: r }) => [
        g("span", eh, M(r.title), 1),
        g("span", th, M(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, pg = /* @__PURE__ */ Y(nh, [["__scopeId", "data-v-a69084cd"]]), sh = ["data-tip", "aria-label"], ah = {
  key: 0,
  class: "mact-word"
}, oh = {
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
      e.open ? (c(), h("span", ah, M(e.label), 1)) : P("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, sh));
  }
}, rh = /* @__PURE__ */ Y(oh, [["__scopeId", "data-v-3b292e09"]]), _n = H(Date.now() / 1e3);
let Js = 0, Pt = 0;
function ih() {
  return Pt || (_n.value = Date.now() / 1e3, Js = setInterval(() => _n.value = Date.now() / 1e3, 1e3)), Pt += 1, ga() && va(() => {
    Pt -= 1, Pt || clearInterval(Js);
  }), _n;
}
const lh = 120, Sn = 280, ch = 160, uh = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function dh(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = H(t()), a = H("");
  let o = 0;
  const i = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), r = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const f = e.value, b = ++o;
    if (!f || !f.offsetWidth || uh()) {
      s.value = u;
      return;
    }
    const _ = { width: f.offsetWidth, height: f.offsetHeight };
    if (i(f, _), a.value = "leaving", await n(lh), b !== o) return;
    s.value = u, a.value = "resizing", await ln(), r(f);
    const A = { width: f.offsetWidth, height: f.offsetHeight };
    i(f, _), f.offsetWidth, f.style.transition = `width ${Sn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Sn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, i(f, A), await n(Sn), b === o && (r(f), a.value = "entering", await n(ch), b === o && (a.value = ""));
  }
  return ke(t, (u) => l(u)), is(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const hh = ["title", "data-figure-mark", "data-folded", "data-open"], fh = {
  key: 2,
  class: "worker"
}, ph = { class: "head" }, mh = { key: 0 }, gh = {
  key: 3,
  class: "status"
}, vh = {
  key: 0,
  class: "figure"
}, yh = {
  key: 1,
  class: "ran-for"
}, wh = { key: 2 }, kh = { key: 3 }, bh = {
  key: 4,
  class: "news"
}, xh = {
  key: 5,
  class: "spin",
  "aria-label": "Still running"
}, $h = {
  key: 7,
  class: "settled"
}, Mh = {
  key: 1,
  class: "bar"
}, _h = {
  key: 3,
  class: "detail body"
}, Sh = {
  key: 0,
  class: "body-label"
}, Eh = ["title"], Ah = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ma(), s = ["onClick", "onAct"], a = I(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = H(!1), i = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), l = I(() => r.value || i.value), u = I(() => r.value ? t.open : o.value), f = I(() => r.value ? !t.open : i.value && !o.value), b = I(() => !!(t.mark.action && n.onAct)), _ = I(() => l.value || b.value || !!n.onClick), A = H(null), W = H(null), { folded: y, phase: w } = dh(A, () => f.value);
    function E(le) {
      var pe, _e;
      if (!(le.target !== A.value && !W.value.contains(le.target))) {
        if (r.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, le);
        if (i.value) return void (o.value = !o.value);
        (_e = n.onAct || n.onClick) == null || _e(le);
      }
    }
    const j = (le) => n.onAct(le), Q = ["failed", "unfinished"], q = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Q.includes(t.mark.state) ? "danger" : "good" : ""), C = I(() => t.mark.color ? t.mark.color : q.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : q.value ? `var(--tone-${q.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), R = I(() => C.value || "var(--tone-work)"), v = I(() => !t.mark.ending && !t.mark.ended && q.value !== "stopped"), p = ih(), k = I(
      () => t.mark.began_at && v.value && !t.mark.figure && !t.mark.counting ? zi(p.value - t.mark.began_at) : ""
    ), $ = I(() => {
      const { started: le, ended: pe } = t.mark;
      return le ? pe ? `ran ${Rs(pe - le, !0)}` : Rs(p.value - le, !0) : k.value;
    }), m = ["bad", "danger", "warn"], d = I(() => m.includes(q.value) || t.mark.asks ? "attention" : v.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], O = I(() => S.includes(q.value)), N = I(() => d.value === "process" ? "running" : O.value ? "cross" : q.value === "stopped" ? "stopped" : q.value === "good" ? "tick" : ""), ae = I(
      () => !!(t.mark.figure || $.value || t.mark.docked || t.mark.stopping || N.value || t.mark.settled || t.mark.news)
    ), oe = I(() => [t.mark.title, t.mark.time ? La(t.mark.time) : ""].filter(Boolean).join(" · ")), de = I(() => ({
      ...C.value ? { "--mark": C.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, pe) => (c(), h("div", dt(a.value, {
      ref_key: "root",
      ref: A,
      class: [
        "mark",
        `w-${d.value}`,
        G(w),
        {
          open: u.value,
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
      "data-folded": G(y) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: E
    }), [
      (c(), K(et(_.value ? "button" : "span"), {
        ref_key: "top",
        ref: W,
        class: "top",
        type: _.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
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
          e.mark.worker ? (c(), h("span", fh, M(e.mark.worker), 1)) : P("", !0),
          g("span", ph, [
            F(ct, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", mh, M(e.mark.name), 1)) : P("", !0),
            l.value ? (c(), K(so, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : P("", !0)
          ]),
          ae.value ? (c(), h("span", gh, [
            e.mark.figure ? (c(), h("span", vh, M(e.mark.figure), 1)) : P("", !0),
            $.value ? (c(), h("span", yh, M($.value), 1)) : P("", !0),
            e.mark.docked ? (c(), h("span", wh, "In the dock")) : P("", !0),
            e.mark.stopping ? (c(), h("span", kh, "Stopping")) : P("", !0),
            e.mark.news ? (c(), h("span", bh, M(e.mark.news), 1)) : P("", !0),
            N.value === "running" ? (c(), h("span", xh)) : N.value ? (c(), K(St, {
              key: 6,
              class: X(["sign", N.value]),
              name: N.value
            }, null, 8, ["class", "name"])) : P("", !0),
            e.mark.settled ? (c(), h("span", $h, M(e.mark.settled), 1)) : P("", !0)
          ])) : P("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      b.value ? (c(), K(rh, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: Me(j, ["stop"])
      }, null, 8, ["label", "open"])) : P("", !0),
      (e.mark.figure || e.mark.counting) && v.value ? (c(), h("span", Mh, [
        g("span", {
          class: "progress",
          style: xe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: R.value })
        }, null, 4)
      ])) : P("", !0),
      e.mark.detail && !G(y) ? (c(), K(ct, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      e.mark.body && !G(y) ? (c(), h("div", _h, [
        e.mark.bodyLabel ? (c(), h("p", Sh, M(e.mark.bodyLabel), 1)) : P("", !0),
        F(ct, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : P("", !0),
      e.mark.command && !G(y) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, M(e.mark.command), 9, Eh)) : P("", !0),
      e.mark.card ? (c(), K(ct, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      be(le.$slots, "default", {
        shown: !G(y)
      }, void 0, !0)
    ], 16, hh));
  }
}), Ch = /* @__PURE__ */ Y(Ah, [["__scopeId", "data-v-de840831"]]), Oh = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function ao(e) {
  var n;
  const t = Oh[e] || ((n = fn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Th = (e) => ao(String(e).split(":")[0]), oo = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Bh = { passed: "good", failed: "danger", warned: "warn", running: "" }, Zs = {
  "open row": (e) => pt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Ar(e.target_model, e.target_id || 0)
}, Lh = { "open row": (e) => Th(e.target_model), "open page": () => ao("pages") };
function Rh(e, t) {
  const n = t || {}, s = Zs[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" && Bh[e.outcome] || "",
    label: e.text,
    // a mark with a body of its module's own keeps its lines for that body, and its cut-off first part is not a second line
    detail: n.body_url ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Lh[s](e) : "",
    handlers: s ? { onAct: () => Zs[s](e) } : {}
  };
}
const Ih = 24, Dh = 1e3, Qs = 2e3, Nh = 0.25, jh = 5e3;
function Ph(e, t = Ih, n = () => !0) {
  const s = H(!1), a = H(0), o = H(!1);
  let i = 0, r = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const q = u();
    return q ? q.scrollHeight - q.scrollTop - q.clientHeight : 0;
  }, b = () => !u() || f() <= t;
  function _(q) {
    if (clearTimeout(i), !q) {
      o.value = !1, l = Date.now();
      return;
    }
    const C = Date.now() - l < Qs ? Qs : Dh;
    i = setTimeout(() => o.value = s.value, C);
  }
  function A() {
    clearTimeout(r), s.value = !1, a.value = 0, _(!1);
  }
  function W(q = !1) {
    const C = u();
    C && q && C.scrollTo ? C.scrollTo({ top: C.scrollHeight, behavior: "smooth" }) : C && (C.scrollTop = C.scrollHeight), A();
  }
  function y() {
    E(), !s.value && (s.value = !0, _(!0));
  }
  const w = () => !!u() && f() <= u().clientHeight * Nh;
  function E() {
    clearTimeout(r), w() && (r = setTimeout(() => s.value && w() && n() && W(!0), jh));
  }
  function j() {
    b() ? A() : y();
  }
  function Q(q = 1, C = !1) {
    s.value ? a.value += Math.max(0, q) : W(C);
  }
  return ga() && va(() => [i, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: b, follow: A, toBottom: W, left: y, scrolled: j, arrived: Q };
}
const qh = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = H(null), { away: o, scrolled: i, arrived: r, toBottom: l } = Ph(a);
    ke(
      () => n.lines.length,
      () => ln(() => r()),
      { immediate: !0 }
    );
    function u(f) {
      i(), s("older", f.target);
    }
    return (f, b) => (c(), h("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      ge(M(e.lines.join(`
`) || e.empty), 1),
      G(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: b[0] || (b[0] = (_) => G(l)(!0))
      }, "Follow")) : P("", !0)
    ], 544));
  }
}, Wh = /* @__PURE__ */ Y(qh, [["__scopeId", "data-v-09394a20"]]), Hh = 1e4;
class Fh {
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
    return this.heardAt !== null && t - this.heardAt > Hh;
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
const Uh = {
  key: 0,
  class: "frame-note"
}, zh = {
  key: 0,
  class: "frame-note"
}, Vh = ["src", "title"], Gh = 1e3, Kh = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = wa(), s = H(null), a = H(!1), o = H(!1);
    let i = null, r = 0;
    return Ne(() => {
      i = new Fh(s.value, n), i.start(), r = setInterval(() => {
        a.value = i.silent();
      }, Gh);
    }), Ae(() => {
      i == null || i.stop(), clearInterval(r);
    }), (l, u) => o.value ? (c(), h("p", Uh, "This window was closed because it stopped answering.")) : (c(), h(J, { key: 1 }, [
      a.value ? (c(), h("div", zh, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        F(ye, {
          onClick: u[0] || (u[0] = (f) => o.value = !0)
        }, {
          default: U(() => [...u[1] || (u[1] = [
            ge("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : P("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: G(n).window
      }, null, 8, Vh)
    ], 64));
  }
}, Yh = /* @__PURE__ */ Y(Kh, [["__scopeId", "data-v-32a49046"]]), Jh = 0, Zh = "/api/lines", Qh = "/api/line";
class Xh {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Jh));
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
        const n = await Ie.raw(Zh, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Ie.raw(Qh, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const ef = new Xh();
class tf {
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
      n.patterns.some((s) => ro(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ro(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const nf = { 1: "refused", 2: "usage", 3: "fault" }, sf = 100, af = /"([^"]*)"|'([^']*)'|(\S+)/g;
function of({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: i, open: r, options: l = H({}), declared: u = [], readOnly: f = !1, shared: b = null }) {
  const _ = /* @__PURE__ */ new Map(), A = new AbortController(), W = (y) => {
    const w = _.get(y);
    if (w && performance.now() - w.at < sf) return w.answer;
    const E = zt(e, y, t, A.signal);
    return _.set(y, { answer: E, at: performance.now() }), E;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: I(() => s()),
    permissions: a,
    readOnly: f,
    shared: b,
    read: W,
    run: (y) => zt(e, y, t, A.signal),
    upload: (y) => lf(y, A.signal),
    cancel: () => A.abort(),
    follow: (y, w) => i.follow(e, y.filter((E) => o.some((j) => ro(j, E))), w, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (y) => I(() => {
      var w;
      return l.value[y] ?? ((w = u.find((E) => E.key === y)) == null ? void 0 : w.default);
    }),
    setting: async (y, w) => {
      const E = await W(`window setting ${e} ${y}`);
      return E.ok ? E.value.value : w;
    },
    keep: (y, w) => zt(e, ["window", "save-setting", e, y, JSON.stringify(w)], t, A.signal)
  };
}
function rf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const en = { ok: !1, failure: "cancelled", error: "" };
async function zt(e, t, n, s = void 0) {
  try {
    const a = await ef.add({ window: e, line: Array.isArray(t) ? t : cf(t), environment: n }, s);
    return s != null && s.aborted ? en : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: nf[a.code] || "fault", error: rf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? en : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function lf(e, t = void 0) {
  try {
    const n = await Ie.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? en : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? en : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function cf(e) {
  return [...e.matchAll(af)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function uf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const df = {
  class: "allowance-prompt",
  role: "dialog"
}, hf = { class: "allowance-prompt-text" }, ff = { class: "allowance-prompt-buttons" }, pf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", df, [
      g("p", hf, M(G(uf)(e.request)), 1),
      g("div", ff, [
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
}, mf = /* @__PURE__ */ Y(pf, [["__scopeId", "data-v-102dc765"]]), En = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), K(Kt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: U(() => [
        ge(M(e.reason) + " ", 1),
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
}, gf = ["data-window", "data-agent"], vf = {
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
    const r = of({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: I(() => n.options),
      declared: n.declared,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, b) => s("open", f, b)
    });
    Ho(tt, r), ke(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ae(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Fo((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const l = () => os(n.component), u = () => {
      var f, b;
      return ((b = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : b.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, b) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      u() ? (c(), K(mf, {
        key: 0,
        request: u(),
        onAnswer: b[0] || (b[0] = (_) => e.prompts.answer(_))
      }, null, 8, ["request"])) : P("", !0),
      e.unavailableReason ? (c(), K(En, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), K(En, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: i
      }, null, 8, ["name", "reason"])) : e.component ? (c(), K(l, { key: o.value })) : (c(), K(En, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: b[1] || (b[1] = (_) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, gf));
  }
}, io = /* @__PURE__ */ Y(vf, [["__scopeId", "data-v-590b4583"]]), yf = {
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
    const t = e, n = { render: () => os(Yh, { src: t.entry.entry_url }) };
    return (s, a) => (c(), K(io, {
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
}, Xn = "journal.stale-build-reload", wf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function kf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Xn) === e.message) return !1;
    t.setItem(Xn, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function bf(e = window.sessionStorage) {
  try {
    e.removeItem(Xn);
  } catch {
    return;
  }
}
const xf = ["data-window"], $f = {
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
    const t = e, n = rn(null), s = H("");
    return ke(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, bf();
          } catch (o) {
            if (wf(o) && kf(o)) return;
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
    ], 8, xf)) : (c(), K(io, {
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
}, Mf = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new tf(), s = ((r = ft(tt, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), i = I(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (l, u) => i.value ? (c(), K($f, {
      key: 0,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), K(yf, {
      key: 1,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, _f = { class: "mark-more-inner" }, Sf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Ef = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Af = {
  key: 3,
  class: "mark-lines"
}, Cf = "process", Xs = "task", Of = 2e3, Tf = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = ft(tt), s = I(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = I(() => oo.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === Xs ? t.mark.target_id : 0), i = H([]), r = H(!1), l = H(""), u = I(() => t.mark.target_model === Cf && !!t.mark.target_id);
    async function f() {
      const A = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, l.value = A.ok ? "" : A.error, A.ok && (i.value = A.value.lines);
    }
    let b = null;
    const _ = () => clearInterval(b);
    return ke(() => t.shown && u.value, (A) => {
      _(), A && (f(), t.mark.ended_at || (b = setInterval(f, Of)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (A) => A && t.shown && u.value && (_(), f())), Ae(_), (A, W) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: W[1] || (W[1] = Me(() => {
      }, ["stop"]))
    }, [
      g("div", _f, [
        e.declaration.body_url ? (c(), K(Mf, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(J, { key: 1 }, [
          a.value ? (c(), h(J, { key: 0 }, [
            W[2] || (W[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", Sf, M(a.value), 1)
          ], 64)) : P("", !0),
          u.value && l.value ? (c(), h("p", Ef, M(l.value), 1)) : u.value && r.value ? (c(), h(J, { key: 2 }, [
            W[3] || (W[3] = g("p", { class: "mark-label" }, "Output", -1)),
            F(Wh, {
              class: "mark-terminal",
              lines: i.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", Af, M(s.value.join(`
`)), 1)) : P("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: W[0] || (W[0] = Me((y) => G(pt)(`${Xs}:${o.value}`), ["stop"]))
          }, "Open task " + M(o.value) + " and its proofs", 1)) : P("", !0)
        ], 64))
      ])
    ], 2));
  }
}, lo = /* @__PURE__ */ Y(Tf, [["__scopeId", "data-v-51f69bf1"]]), Bf = (e) => `show-${e}`, mg = (e, t, n) => e.filter((s) => {
  var a;
  return n(Bf((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Lf = "messages.chat", Rf = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), es = (e, t, n) => zt(Lf, Rf(e, t), n), If = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Df = ["title", "aria-label", "onClick"], Nf = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, jf = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => If(t.buttons, t.allowedRuns).filter((i) => {
      var r;
      return !((r = i.variants) != null && r.length) || i.variants.includes(t.mark.variant);
    })), s = H(""), a = ft(tt);
    async function o(i) {
      const r = await es(i, t.mark, a.environment);
      s.value = r.ok ? "" : r.error;
    }
    return (i, r) => (c(), h(J, null, [
      (c(!0), h(J, null, re(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: Me((u) => o(l), ["stop"])
      }, [
        F(St, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Df))), 128)),
      s.value ? (c(), h("span", Nf, M(s.value), 1)) : P("", !0)
    ], 64));
  }
}, Pf = /* @__PURE__ */ Y(jf, [["__scopeId", "data-v-0dfda102"]]);
function co(e, t) {
  const n = rn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((i) => [i.type, i])), a = async () => {
    try {
      return (await (await Ie.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const uo = co("/api/marks", "marks"), gg = uo.fetchAll, qf = uo.find, Wf = ["data-ref"], Hf = { class: "mark-row" }, Ff = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = e, s = I(() => qf(n.mark.type)), a = I(() => Rh(n.mark, s.value)), o = I(() => {
      var r;
      return !!(n.mark.lines || n.mark.detail && oo.has(n.mark.variant) || t.has(n.mark.target_model) || (r = s.value) != null && r.body_url);
    }), i = H(!1);
    return (r, l) => {
      var u, f;
      return c(), h("div", {
        class: X(["thread-turn", "card", { "full-width": (u = s.value) == null ? void 0 : u.full_width }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Hf, [
          F(Ch, dt({
            mark: a.value,
            open: o.value ? i.value : void 0
          }, Uo(a.value.handlers), {
            onClick: l[0] || (l[0] = (b) => i.value = !i.value)
          }), zo({ _: 2 }, [
            o.value ? {
              name: "default",
              fn: U(({ shown: b }) => [
                F(lo, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: b
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(Pf, {
            buttons: (f = s.value) == null ? void 0 : f.buttons,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Wf);
    };
  }
}, vg = /* @__PURE__ */ Y(Ff, [["__scopeId", "data-v-a8e93858"]]);
function Uf(e) {
  const t = H(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ne(() => n.observe(e.value)), is(() => n.disconnect()), t;
}
const zf = { class: "chat-dock-fold" }, Vf = ["aria-label"], Gf = { class: "chat-dock-head" }, Kf = { class: "chat-dock-inner" }, Yf = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = H(null), s = H(null), a = Uf(s);
    return t({ card: n }), (o, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted }])
    }, [
      g("div", zf, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          be(o.$slots, "edge"),
          g("header", Gf, [
            be(o.$slots, "head")
          ]),
          g("div", {
            class: X(["chat-dock-body", { folded: e.folded }])
          }, [
            g("div", Kf, [
              g("div", {
                class: "chat-dock-grow",
                style: xe(G(a) === null ? null : { height: `${G(a)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  be(o.$slots, "default")
                ], 512)
              ], 4)
            ])
          ], 2)
        ], 10, Vf)
      ])
    ], 2));
  }
}, Jf = /* @__PURE__ */ Y(Yf, [["__scopeId", "data-v-e27493a6"]]), Zf = {
  class: "dock-leave",
  "aria-hidden": "true"
}, An = 5, Qf = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(An, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${An}s`, animationDelay: `${(n - An).toFixed(2)}s` };
    return (a, o) => (c(), h("span", Zf, [
      g("i", { style: s })
    ]));
  }
}, Xf = /* @__PURE__ */ Y(Qf, [["__scopeId", "data-v-d0c4b012"]]), ho = co("/api/docks", "docks"), yg = ho.fetchAll, ts = ho.find, e1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ea = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function t1(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [ea("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || fn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ea("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const n1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: e1(e, t),
  buttons: t1(e, t)
}), s1 = { class: "dock-title" }, a1 = ["aria-expanded", "title"], o1 = { class: "chat-dock-acts dock-acts" }, r1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, i1 = {
  key: 1,
  class: "dock-text"
}, l1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = I(() => ts(s.item.type)), o = H(null), i = I(() => n1(s.item, a.value)), r = ft(tt), l = H(/* @__PURE__ */ new Set()), u = H("");
    async function f(A) {
      if (A.action === "open") return pt(`${s.item.target_model}:${s.item.target_id}`);
      if (A.action !== "declared") return es(A, s.item, r.environment);
      l.value = /* @__PURE__ */ new Set([...l.value, A.label]), u.value = "";
      const W = await es(A, s.item, r.environment);
      (W == null ? void 0 : W.ok) === !1 && (l.value = new Set([...l.value].filter((y) => y !== A.label)), u.value = W.error);
    }
    const b = I(() => i.value.buttons.filter((A) => A.action !== "undock" && !l.value.has(A.label))), _ = I(() => i.value.buttons.find((A) => A.action === "undock"));
    return (A, W) => (c(), K(Jf, {
      label: i.value.title,
      folded: e.folded
    }, {
      edge: U(() => [
        e.leaving ? (c(), K(Xf, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : P("", !0)
      ]),
      head: U(() => {
        var y, w, E;
        return [
          (y = a.value) != null && y.draws_head ? (c(), h("span", {
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
            g("span", s1, M(i.value.title), 1)
          ], 64)),
          (w = a.value) != null && w.badge ? (c(), h("span", {
            key: 2,
            class: X(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, M(a.value.badge), 3)) : P("", !0),
          (E = a.value) != null && E.draws_head ? P("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: W[0] || (W[0] = (j) => n("fold"))
          }, [
            F(so, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, a1)),
          g("span", o1, [
            (c(!0), h(J, null, re(b.value, (j) => (c(), K(ye, {
              key: j.action + j.runs,
              small: "",
              kind: j.primary ? "primary" : "ghost",
              bordered: !j.primary,
              "data-dock-action": j.action,
              onClick: (Q) => f(j)
            }, {
              default: U(() => [
                ge(M(j.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          F(cs, {
            title: _.value.label,
            "data-dock-action": "undock",
            onClick: W[1] || (W[1] = (j) => f(_.value))
          }, null, 8, ["title"])
        ];
      }),
      default: U(() => {
        var y, w;
        return [
          u.value ? (c(), h("p", r1, M(u.value), 1)) : P("", !0),
          e.item.text && !((y = a.value) != null && y.body_url) ? (c(), h("p", i1, M(e.item.text), 1)) : P("", !0),
          (w = a.value) != null && w.body_url ? (c(), K(lo, {
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
}, ta = /* @__PURE__ */ Y(l1, [["__scopeId", "data-v-608c189e"]]), c1 = 24, u1 = 8, wg = 420;
function kg({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= c1 && e > t ? !0 : e < t && a > u1 ? !1 : null;
}
const d1 = (e, t) => e === void 0 ? t : e, h1 = 6, f1 = 3, na = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, fo = (e) => !!(e.leaves_at && !e.kept), p1 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!fo(e) || t < e.leaves_at || n.has(e.id)), m1 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => p1(s, t, n)).sort((s, a) => s.id - a.id);
function g1(e, t, n = h1) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const v1 = (e, t) => e >= f1 ? !0 : e <= 1 ? !1 : t, y1 = { class: "dock-stack" }, w1 = ["onMouseenter", "onMouseleave"], k1 = ["onMouseenter", "onMouseleave"], b1 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = H(Date.now() / 1e3), s = H(/* @__PURE__ */ new Set()), a = H(!1), o = H(!1), i = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ae(() => clearInterval(i));
    const r = I(() => m1(t.items, n.value, s.value)), l = I(() => g1(r.value.filter((w) => na(w, ts)), n.value)), u = I(() => r.value.filter((w) => !l.value.includes(w) && !na(w, ts))), f = I(() => (a.value = v1(l.value.length, a.value)) && !o.value), b = H({}), _ = (w) => d1(b.value[w.id], t.folded);
    function A(w) {
      b.value = { ...b.value, [w.id]: !_(w) };
    }
    function W(w) {
      s.value = /* @__PURE__ */ new Set([...s.value, w.id]);
    }
    function y(w) {
      s.value = new Set([...s.value].filter((E) => E !== w.id));
    }
    return (w, E) => (c(), h("div", y1, [
      (c(!0), h(J, null, re(u.value, (j) => (c(), h("div", {
        key: j.id,
        onMouseenter: (Q) => W(j),
        onMouseleave: (Q) => y(j)
      }, [
        F(ta, {
          item: j,
          leaving: G(fo)(j) && !s.value.has(j.id),
          folded: _(j),
          onFold: (Q) => A(j)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, w1))), 128)),
      (c(!0), h(J, null, re(f.value ? [] : l.value, (j) => (c(), h("div", {
        key: j.id,
        onMouseenter: (Q) => W(j),
        onMouseleave: (Q) => y(j)
      }, [
        F(ta, {
          item: j,
          folded: _(j),
          onFold: (Q) => A(j)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, k1))), 128)),
      f.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "dock-runs-row",
        title: "Show each run as its own card",
        onClick: E[0] || (E[0] = (j) => o.value = !0)
      }, M(l.value.length) + " runs", 1)) : P("", !0)
    ]));
  }
}, bg = /* @__PURE__ */ Y(b1, [["__scopeId", "data-v-8ad7aad9"]]), bt = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Vt = (e) => Math.min(Math.max(e, 0), 1), x1 = (e) => {
  const t = Vt(e);
  return t * t * (3 - 2 * t);
}, Ze = (e, t, n) => x1((e - t) / (n - t));
function xg(e) {
  const t = Vt(e), n = Vt((t - 0.12) / 0.76) * bt.shuffles, s = Math.min(Math.floor(n), bt.shuffles - 1), a = n - s, o = Ze(a, 0.26, 0.38) * (1 - Ze(a, 0.76, 0.96)), i = Ze(a, 0.38, 0.76), r = Ze(t, 0, 0.12) * (1 - Ze(t, 0.88, 1)), l = Ze(a, 0.2, 0.34) * (1 - Ze(a, 0.84, 1)), u = Math.sin(Math.PI * Vt((a - 0.45) / 0.55)) ** 2;
  return { moved: i, across: (s + i) / bt.shuffles, lift: bt.lift * o, ready: r, weight: l, follow: u, shuffle: s, phase: a };
}
const po = 2400, $1 = 0.05;
function $g({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, $1), i = Math.min(t + po * o, a), r = e + i * o;
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
}, ns = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), M1 = (e) => e * e * (3 - 2 * e), tn = (e, [t, n]) => M1(ns(e, t, n)), _1 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ve = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, qt = ([e, t], n) => e + n() * (t - e);
function S1(e) {
  return _1.map(() => {
    const t = qt(Ve.speed, e), n = qt(Ve.angle, e) * Math.PI / 180, s = qt(Ve.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [qt(Ve.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const E1 = S1(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function A1(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ve.gravity * (t[2] - Ve.floor))) / Ve.gravity;
}
function Mg(e, t, n = E1) {
  const s = Ke.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], i = A1(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= i + r) return null;
  const l = Math.min(a, i), u = s.from.map((f, b) => f + o.velocity[b] * l);
  return u[2] -= Ve.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - i) / r };
}
function _g(e, t) {
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
const Sg = () => Array.from({ length: Ke.pogo.count }, (e, t) => Ke.pogo.bounce * (t + 1) / Ke.pogo.count), Eg = { stride: 0.5 };
function mo(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: ns(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: ns(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Ag(e) {
  const { into: t, out: n } = mo(Ke.rope_swing, e);
  return 1 - tn(t, [0, 1]) * (1 - tn(n, [0, 1]));
}
function Cg(e) {
  const t = Ke.rope_swing, { into: n, out: s } = mo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return tn(n, [0, 1]) * (1 - tn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const C1 = { after: 3 }, O1 = 10, T1 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, B1 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, L1 = { weight: 19 }, R1 = {
  build: { cooldown: 180 }
}, I1 = { every: 120 }, go = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, vo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, D1 = {
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
}, Bt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: O1 }), Z = (e, t, n = {}) => Bt(e, "clip", t, n), Cn = (e, t, n = {}) => Bt(e, "look", t, n), sa = (e, t, n = {}) => Bt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Bt(e, "pick", t, n), ...s }), fe = (e) => Bt("nothing", "nothing", e, {}), N1 = 120, j1 = 300, On = (e, t) => ({ ...Z(e, t), cooldown: j1 }), P1 = 120, ee = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), q1 = () => [Z("joy", 2)], Qe = (e, t, n, s, a = {}) => ({ ...Z(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), Xe = (e) => ({ ...e, cooldown: T1[e.name] }), kt = (e) => ({ ...e, shenanigan: !0, lasts: B1[e.name] }), vs = [
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
  ...ee("messaged", { cooldown: P1 }, [Z("phone_call", 1)]),
  ...ee("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [Z("nod", 4), Z("hand_rub", 4), fe(7)]),
  ...ee("question_asked", { cooldown: 60 }, [Z("ask_sign", 9), Z("look_up", 3), fe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ee("reported", { cooldown: 90 }, [sa("read", 3), Z("nod", 1), fe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ee("read_message", { cooldown: 30 }, [sa("read", 3), fe(1)]),
  ...ee("fact_filed", { cooldown: 120 }, [Z("file_card", 3), Z("nod", 1), fe(6)]),
  ...ee("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [Z("nod", 2), fe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ee("bar_done", { holds: !0 }, q1()),
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
  ...ee("answered", { cooldown: 15 }, [Cn("amused", 3), fe(2)]),
  ...ee("heard", { cooldown: 30 }, [
    Z("bow", 1, { voices: ["butler"] }),
    Z("salute", 1, { voices: ["squire"] }),
    Z("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    fe(1)
  ]),
  ...ee("long_walk", { cooldown: 90 }, [Z("stumble", 3), fe(22)]),
  ...ee("card_arrived", { cooldown: 20, toward: "card" }, [Z("glance", 7), fe(13)]),
  ...ee("typing", { cooldown: 60 }, [Cn("reading", 1), fe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(D1).flatMap(([e, t]) => ee(`reacted:${e}`, {}, [Cn(t, 1)])),
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
    { ...kt(Xe(Z("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    kt(Xe(Z("disco", 2, { ball: "bubble" }))),
    fe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ee("held:search", { cooldown: N1 }, [On("search", 3), { ...On("binoculars", 2), when: { home: !0 } }, { ...On("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...ee("jump", {}, [kt(Xe(Z("backflip", 7, { high: !0 }))), Z("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ee("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ee("unit", { cooldown: R1.build.cooldown }, [ce("unit", L1.weight), fe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ee("progress_jump", { cooldown: 6 }, [Z("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ee("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...ee("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ee("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: I1.every }, ce("stand", 5)]),
  // a digit a blow's dust lets out
  ...ee("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ee("roam", {}, [
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
    kt(Xe(ce("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], W1 = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), yo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), H1 = (e) => Array.isArray(e) ? e[0] : e, F1 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function U1(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || yo(f).every(([b, _]) => n(b) >= H1(_)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = vs.filter((f) => W1(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= C1.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, l = r.filter((f) => {
    var b;
    return f.kind === "nothing" || f.name !== ((b = e.tally) == null ? void 0 : b.last);
  });
  return l.some((f) => f.kind !== "nothing") ? l : r;
}
function z1(e, t) {
  const n = U1(e);
  let s = t() * n.reduce((o, i) => o + i.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (wo(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function wo(e, t, n) {
  var s;
  for (const [a, o] of yo(t)) (s = e.memory) == null || s.set(a, e.now + F1(o, n));
}
function Og(e, t, n) {
  wo(e, vs.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const aa = {
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
}, Tg = {
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
}, Bg = 120, Lg = (e) => aa[e] || aa.idle;
[.../* @__PURE__ */ new Set([...Object.values(go).flatMap((e) => Object.keys(e)), ...Object.keys(vo)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function Rg(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Te.ahead * n ? 180 : Math.sign(s) * Te.turn;
}
const oa = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Ig(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), i = Math.floor(o / Te.sweep) % a, r = o % Te.sweep, l = Te.sweep - Te.returnSeconds, u = oa((r - l) / Te.returnSeconds), f = r <= l ? oa(r / l) : 1 - u, b = i + ((i + 1) % a - i) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + b * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const V1 = 1, G1 = (e, t, n, s, a, o = 0) => z1({ moment: "jump", high: e > V1 * t, memory: s, now: a, room: o }, n).name === "backflip", ra = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, Dg = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, Ng = { width: 24, height: 27, top: 3, units: 2 }, K1 = "[data-figure-pile]", jg = { amber: [1, 0.69, 0.125], good: ra.colours.good, bad: ra.colours.bad }, Tn = { phases: 4, dim: 0.25 }, Pg = (e, t, n) => e !== "amber" || (t + n) % Tn.phases < Tn.phases / 2 ? 1 : Tn.dim, Y1 = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(vs.filter((e) => Y1.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const qg = {
  width: 84,
  belly: 13,
  blink: 4
}, ia = "[data-figure-home]", Lt = () => {
  var t;
  const e = document.querySelector(ia);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ia)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, J1 = "[data-figure-docked-bars]", Z1 = "[data-figure-chat-foot]", Q1 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", X1 = "[data-figure-newest]";
function ep() {
  var s, a;
  const e = (s = Lt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(X1), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var i, r;
      return !((i = o.closest) != null && i.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ys(o)) continue;
    const i = o.getBoundingClientRect();
    if (i.right > i.left && i.bottom > i.top) return i;
  }
  return null;
}
function ko(e, t, n = ep()) {
  if (!e || !n) return !0;
  const s = mt(e, t), a = ws(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ge.top * t.size, bottom: s.top + Ge.bottom * t.size }, i = bt.gap;
  return !$o(o, { left: n.left - i, right: n.right + i, top: n.top - i, bottom: n.bottom + i });
}
const Bn = 0.26, tp = 0.54, gn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Bn, travels: "stand" },
  lounge: { drop: Bn, travels: "stand" },
  composed: { drop: Bn, travels: "stand" },
  hang: { drop: tp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, bo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), np = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Wg = (e, t) => (e === "sit" ? np.has(t) : bo.has(e)) ? e : "stand", Hg = 0.25, Fg = (e, t) => bo.has(e) && gn[t].drop === 0, xo = 2, sp = 90, ap = 180, op = 140, rp = 280, ip = 420, lp = 0.25, cp = 290, up = 600, dp = "cubic-bezier(0.2, 0.7, 0.4, 1)", hp = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ln = 5;
function nn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: i = !1, sprinting: r = !1, random: l = Math.random, memory: u = null, now: f = 0, room: b = 0, pogo: _ = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ln) return null;
  (i || r) && (o = Math.max(o, xo));
  const A = o > 1, W = Math.abs(t.x - e.x), y = W < Ln ? 0 : W / (sp * o) * 1e3, w = Math.min(y, A ? op : ap), E = Math.abs(t.y - e.y), j = t.y < e.y, Q = j && !_ && G1(E, n, l, u, f, b), q = j ? ip + Math.min(E, 400) * lp : Math.sqrt(2 * E / po) * 1e3, C = {
    x: t.x,
    y: t.y,
    ms: E > Ln ? Q ? up : q : 0,
    lead: Q ? cp : j ? rp : 0,
    easing: j ? dp : hp,
    hopping: !0,
    clip: Q ? "backflip" : j ? "jump" : "fall"
  }, R = { x: t.x, y: t.y, ms: y + w, lead: 0, easing: "linear", ramp: w, ...A ? { clip: "run" } : {} }, v = _ ? fp(t, n) : C, p = j && !s ? [{ ...R, y: e.y }, v] : [{ ...C, x: e.x }, R];
  return { way: Math.sign(t.x - e.x) || 1, legs: p, lands: !a, pace: o, running: A };
}
const fp = (e, t) => ({ x: e.x, y: e.y, ms: Ke.pogo.frames / Ke.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), mt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - gn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, $o = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ys = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function gt() {
  var t;
  const e = (t = Lt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Wt = 0.5, la = 20;
function Ug(e, t, n = gt()) {
  const s = mt(e, t);
  return s.left >= n.left + la && s.right <= n.right - la;
}
function Mo(e, t, n = gt()) {
  const s = mt(e, t), a = s.right - s.left, o = ws(e), [i, r] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return i >= n.left - Wt && r <= n.right + Wt && s.top >= n.top - Wt && l <= n.bottom + Wt;
}
const sn = [0.35, 0.5, 0.65], an = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ge = { left: sn[0], right: sn.at(-1), top: an[0], bottom: an.at(-1) }, pp = 0.24;
function ws(e) {
  if (e.posture === "stand") return { left: Ge.left, right: Ge.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + pp * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ge.left, t), right: Math.max(Ge.right, t) };
}
function mp(e, { size: t }, n = gt()) {
  const s = ws(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const gp = (Ge.right - Ge.left) / 2 + 0.08;
function vp(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !ys(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, i = Math.min(a.startOffset, o.length - 1);
  for (const l of [i - 1, i].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const yp = (e) => an.flatMap(
  (t) => sn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function wp(e, t, n = "") {
  if (!ko(e, t)) return sn.length * an.length;
  const s = mt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Q1)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: l }) => l.width && l.height && $o(a, l) && ys(r)).map(({ rect: r }) => r), i = (r, l) => o.some((u) => r >= u.left && r <= u.right && l >= u.top && l <= u.bottom);
  return yp(a).filter(([r, l]) => i(r, l) || vp(r, l, n)).length;
}
function kp(e, t, n) {
  const s = gt(), a = (i) => n ? Math.hypot(i.x - n.x, i.y - n.y) : 0, o = e.filter((i) => Mo(i, t, s) && ko(i, t)).map((i) => ({ spot: i, covered: wp(i, t), away: a(i) }));
  return o.length ? o.reduce(
    (i, r) => r.covered < i.covered || r.covered === i.covered && r.away < i.away ? r : i
  ).spot : null;
}
const _o = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, bp = gp, xp = (e, t, { size: n }, s = bp) => $p(e, _o[t], s * n, "stand");
function $p(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const zg = (e) => ((e + 180) % 360 + 360) % 360 - 180, Vg = { turns: [-20, -10, 0, 10, 20] }, Mp = 7;
function _p() {
  const e = [...document.querySelectorAll(K1)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const Sp = 4;
function Ep() {
  const e = So(), t = _p(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Sp || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Mp - n, 0) } };
}
const Gg = ({ size: e, below: t }) => (1 - t) * e;
function Ap(e, t) {
  const n = gt(), { size: s, below: a } = t, o = gn[e.posture].drop * s;
  return { ...mp(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Cp = (e, t) => Object.keys(_o).map((n) => Ap(xp(e, n, t), t)), Op = (e, t, n) => kp(e, t, n) ?? e[0];
function Kg(e, t) {
  const { element: n, edge: s } = Ep();
  return { ...Op(Cp(s, e), e, t), view: null, on: n };
}
function So() {
  var s;
  const e = Lt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(J1);
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
const Tp = { climb: 90 };
function Yg(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: i = !1, random: r = Math.random, via: l = [], memory: u = null, now: f = 0, room: b = 0, pogo: _ = !1 } = {}) {
  (o || i) && (a = Math.max(a, xo));
  const A = (Q) => {
    const q = mt(Q, n, gn[Q.posture].travels);
    return { x: q.left, y: q.top };
  }, W = t.ladder ?? e.ladder;
  if (W && !(t.ladder && e.ladder)) return Bp(A(e), A(t), A({ ...W.foot, posture: "stand" }), W.way, !!t.ladder, n, a);
  const [y, ...w] = [e, ...l, t].map(A), E = nn(y, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: i, random: r, memory: u, now: f, room: b, pogo: _ }), j = w.slice(1).map((Q, q) => {
    var C;
    return (C = nn(w[q], Q, n.size, { random: r, memory: u, now: f, room: b })) == null ? void 0 : C.legs.find((R) => R.hopping);
  });
  return E && { ...E, legs: [...E.legs, ...j.filter(Boolean)] };
}
function Bp(e, t, n, s, a, o, i) {
  const r = (f, b) => ({ x: b.x, y: b.y, ms: Math.hypot(b.x - f.x, b.y - f.y) / Tp.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? nn(e, n, o.size, { pace: i }) : nn(n, t, o.size, { pace: i }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], r(n, t)] : [r(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: i, running: i > 1 };
}
const Lp = "[data-figure-bubble]", Rp = 250;
let xt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ao = 0;
const Co = () => xt, Rn = /* @__PURE__ */ new WeakMap();
let Ip = 0;
function Oo(e) {
  return Rn.has(e) || Rn.set(e, `floor-${++Ip}`), Rn.get(e);
}
const Dp = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Np = () => {
  var e, t;
  return ((t = (e = Lt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function jp(e, t) {
  var s;
  const n = (s = e.querySelector(Z1)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Pp(e, t) {
  const n = e && jp(e, t), s = e ? [...e.querySelectorAll(Lp)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: i }) => ({ element: o, kind: i, box: o.getBoundingClientRect() })).filter(({ kind: o, box: i }) => i.width > 0 && i.height > 0 && (o !== "bubble" || Dp(i, n))).map(({ element: o, kind: i, box: r }) => ({ id: Oo(o), kind: i, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const qp = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Rp ? (t.top - s.top) / a * 1e3 : 0;
};
function Wp(e = xt, t = performance.now()) {
  const n = gt(), s = Np(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: i, edge: r } = So(), l = [];
  o && l.push({ id: "home", kind: i ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = Eo();
  return u.element && l.push({ id: Oo(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Pp(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((f) => Object.freeze({ ...f, vy: qp(e, f, t) }))) });
}
const ss = /* @__PURE__ */ new Set();
function Hp(e) {
  return ss.add(e), () => ss.delete(e);
}
function Fp() {
  To();
  const e = () => {
    Ao = requestAnimationFrame(e), !document.hidden && (xt = Wp(xt), ss.forEach((t) => t(xt)));
  };
  e();
}
function To() {
  cancelAnimationFrame(Ao);
}
const Up = (e, t) => e.find((n) => n.id === t) ?? null;
function Jg(e, t, n = Co().floors) {
  const s = Up(n, "home");
  return e.posture === "hang" && s && mt(e, t).bottom >= s.top ? !1 : Mo(e, t);
}
const zp = ["data-kind"], Vp = { class: "figure-floor-name" }, Gp = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: xe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", Vp, M(e.floor.kind), 1)
    ], 12, zp));
  }
}, Kp = /* @__PURE__ */ Y(Gp, [["__scopeId", "data-v-8f6132da"]]), Yp = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Jp = {
  __name: "FigureFloors",
  setup(e) {
    const t = rn(Co().floors);
    let n = () => {
    };
    return Ne(() => {
      n = Hp((s) => t.value = s.floors), Fp();
    }), Ae(() => {
      n(), To();
    }), (s, a) => (c(), h("div", Yp, [
      (c(!0), h(J, null, re(t.value, (o) => (c(), K(Kp, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Zg = /* @__PURE__ */ Y(Jp, [["__scopeId", "data-v-e519168b"]]), In = (e) => typeof e == "number" ? e : Date.parse(e);
function Qg(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: In(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => In(a.row.created_at) - In(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Zp = 2e3;
function Xg(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, Zp);
  };
  Ne(async () => {
    await e(), s();
  }), is(() => clearTimeout(n));
}
const ca = "newest";
function ev(e, { title: t, isOpen: n = null }) {
  const s = H(""), a = H(ca), o = H("all"), i = I(() => {
    const r = s.value.trim().toLowerCase(), l = e.value.filter((u) => (!r || JSON.stringify(u).toLowerCase().includes(r)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === ca ? l : [...l].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: i, hasStates: !!n };
}
const Qp = {
  class: "list-tools",
  "data-list-tools": ""
}, Xp = {
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
    return (s, a) => (c(), h("div", Qp, [
      F(Qd, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      F(Qn, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (c(), K(Qn, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : P("", !0)
    ]));
  }
}, tv = /* @__PURE__ */ Y(Xp, [["__scopeId", "data-v-b2dd0a0d"]]);
function nv() {
  const e = H(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const e0 = 86400, as = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function t0(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((as(t) - as(e)) / e0);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function sv(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = as(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: t0(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Dn = 280, Nn = 240, jn = 120, n0 = 6, s0 = 14, Et = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function a0(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const i = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${s0}px)` }), e.offsetHeight, e.style.transition = `height ${Dn}ms ${Et}`, e.style.height = `${i}px`;
  const r = a();
  let l = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - r;
    if (!l && f >= Dn && (l = !0, e.style.transition = `opacity ${Nn}ms ease-out, transform ${Nn}ms ${Et}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Dn + Nn) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function av(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${n0}px)` }), e.offsetHeight, e.style.transition = `opacity ${jn}ms ease-out, transform ${jn}ms ${Et}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const i = a(), r = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - i < jn) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const o0 = 140, Ht = 220, r0 = 5;
function ov({ gap: e = o0, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, r0);
    if (s = r.length > 0, !s) return;
    let l = r.length;
    for (const u of r)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), l -= 1, l || t(o, e);
      });
  }
  const i = (r, l, u, f = a0) => {
    if (!l.pane || !l.follows()) return u();
    const b = { el: r, options: l, done: u, arrival: f, display: r.style.display || "" };
    if (!s)
      return s = !0, f(r, l, () => a(b));
    r.style.display = "none", n.push(b);
  };
  return i.flush = () => {
    for (const r of n.splice(0))
      r.el.style.display = r.display, r.done();
  }, i;
}
function rv(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Ht}ms ${Et}, opacity ${Ht}ms ease-in, margin ${Ht}ms ${Et}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Ht);
}
const Bo = "chat.pins.minimised", Gt = H(Mt(Bo, !1));
function ua(e) {
  Gt.value = e, cn(Bo, e);
}
function i0(e) {
  const t = I(() => e()), n = I(() => Gt.value ? [] : e()), s = () => ua(!Gt.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Aa(o) > a).length,
    (o, i) => o > i && ua(!1)
  ), { pins: t, visible: n, minimised: Gt, toggle: s };
}
const l0 = ["title"], c0 = {
  key: 0,
  class: "pins-count"
}, u0 = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = i0(() => t.notices);
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
      G(s) ? (c(), h("span", c0, M(G(n).length), 1)) : P("", !0)
    ], 10, l0)) : P("", !0);
  }
}, iv = /* @__PURE__ */ Y(u0, [["__scopeId", "data-v-c0d11526"]]), d0 = ["title"], h0 = ["title"], f0 = { class: "diff-card-dir" }, p0 = { class: "diff-card-name" }, m0 = { class: "diff-card-ago" }, g0 = ["title"], v0 = ["title"], y0 = {
  key: 0,
  class: "diff-card-note"
}, w0 = ["href"], k0 = ["src", "alt"], b0 = { class: "diff-card-rows" }, x0 = { class: "diff-row-num" }, $0 = { class: "diff-row-sign" }, M0 = { class: "diff-row-code" }, _0 = {
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
    function o($) {
      ($.metaKey || $.ctrlKey) && ($.stopPropagation(), s("open", n.path));
    }
    const i = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, l = I(() => n.path.lastIndexOf("/") + 1), u = I(() => n.path.slice(0, l.value)), f = I(() => n.path.slice(l.value)), b = I(() => n.kind === "deleted"), _ = I(() => i[n.kind]), A = I(() => new Set(n.rows.filter(($) => $.line_type === "add").map(($) => $.line))), W = H("after"), y = I(() => W.value === "before" ? n.whole.old : n.whole.text), w = I(() => n.whole && n.whole.text !== void 0 ? y.value.split(`
`).map(($, m) => ({ line_type: W.value === "after" && A.value.has(m + 1) ? "add" : "ctx", line: m + 1, text: $ })) : n.rows.filter(
      ($) => !(n.editsOnly && ["ctx", "fold"].includes($.line_type)) && !(n.hideRemovals && $.line_type === "del")
    )), E = H(!1), j = I(() => n.lines && !E.value && !n.whole), Q = I(() => j.value ? w.value.slice(0, n.lines) : w.value), q = I(() => w.value.length - Q.value.length), C = ($) => $.line === null || $.line_type === "del" ? "" : $.line, R = ($) => $.line_type === "fold" ? $.hidden ? `⋯ ${$.hidden} lines` : "⋯" : $.text, v = H(null), p = H(null);
    let k = null;
    return Ne(() => {
      if (!p.value) return;
      let $ = !0;
      k = new ResizeObserver(() => {
        !v.value || !p.value || (v.value.style.transition = $ ? "none" : "", v.value.style.height = `${p.value.offsetHeight}px`, $ = !1);
      }), k.observe(p.value);
    }), Ae(() => k && k.disconnect()), ($, m) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: b.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: b.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: m[2] || (m[2] = (d) => !b.value && s("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${G(a)}-click to open it`,
          onClick: o
        }, [
          g("span", f0, M(u.value), 1),
          g("span", p0, M(f.value), 1),
          _.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.kind])
          }, M(_.value), 3)) : P("", !0)
        ], 8, h0),
        g("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + M(e.added), 3),
        g("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + M(e.removed), 3),
        g("span", m0, M(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: W.value === "after" ? "Show the file before" : "Show the file after",
          onClick: m[0] || (m[0] = Me((d) => W.value = W.value === "after" ? "before" : "after", ["stop"]))
        }, M(W.value === "after" ? "After" : "Before"), 9, g0)) : P("", !0),
        b.value ? P("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: m[1] || (m[1] = Me((d) => s("whole"), ["stop"]))
        }, [
          F(Ee, {
            name: "file",
            size: 12
          })
        ], 10, v0))
      ], 8, d0),
      e.whole && e.whole.error ? (c(), h("p", y0, M(e.whole.error), 1)) : P("", !0),
      !b.value && !e.folded ? (c(), h(J, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          g("img", {
            src: e.picture,
            alt: f.value,
            loading: "lazy"
          }, null, 8, k0)
        ], 8, w0)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: v,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: p,
            class: "diff-card-diff"
          }, [
            g("div", b0, [
              (c(!0), h(J, null, re(Q.value, (d, S) => (c(), h("div", {
                key: S,
                class: X(["diff-row", d.line_type, { fresh: e.fresh && d.edit === e.fresh }])
              }, [
                g("span", x0, M(C(d)), 1),
                g("span", $0, M(r[d.line_type]), 1),
                g("span", M0, M(R(d)), 1)
              ], 2))), 128)),
              q.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: m[3] || (m[3] = Me((d) => E.value = !0, ["stop"]))
              }, M(q.value) + " more " + M(q.value === 1 ? "line" : "lines"), 1)) : P("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : P("", !0)
    ], 2));
  }
}, lv = /* @__PURE__ */ Y(_0, [["__scopeId", "data-v-b6424f6e"]]), S0 = {
  key: 0,
  class: "menu-item-text"
}, E0 = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.description ? (c(), h("span", S0, [
        g("span", null, [
          be(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, M(e.description), 1)
      ])) : be(t.$slots, "default", {}, void 0, !0, 1)
    ], 2));
  }
}, A0 = /* @__PURE__ */ Y(E0, [["__scopeId", "data-v-5b5c4fd9"]]), C0 = {}, O0 = { class: "menu-label" };
function T0(e, t) {
  return c(), h("span", O0, [
    be(e.$slots, "default", {}, void 0, !0)
  ]);
}
const B0 = /* @__PURE__ */ Y(C0, [["render", T0], ["__scopeId", "data-v-aa955b3e"]]), Lo = /* @__PURE__ */ new WeakMap(), L0 = (e, t) => Lo.set(e, t);
function R0(e, t) {
  for (let n = t; n; n = Lo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function I0(e, t) {
  const n = (s) => {
    var o, i;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((i = e.value) == null ? void 0 : i.$el) || e.value;
    a && !R0(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const rt = 8, D0 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = H(null), o = (d) => d ? `${d}px` : void 0, i = I(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), r = H({ w: 0, h: 0 }), l = H(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), b = (d) => {
      const S = d.closest(".pane, .float-window");
      return S ? f(S.getBoundingClientRect()) : u();
    }, _ = (d, S) => `${Math.max(0, d ? Math.min(d, S) : S)}px`;
    function A(d, S) {
      return {
        below: d.bottom - S.bottom - s.gap - rt,
        above: S.top - d.top - s.gap - rt,
        across: d.right - d.left - 2 * rt
      };
    }
    function W(d) {
      const S = b(s.anchor), O = A(S, d);
      return r.value.w <= O.across && r.value.h <= Math.max(O.below, O.above) ? S : u();
    }
    const y = I(() => {
      if (!l.value) return i.value;
      const d = l.value, S = W(d), O = A(S, d), { w: N, h: ae } = r.value, oe = s.align === "auto" ? d.left + d.right > S.left + S.right : s.align === "right", de = ui(oe ? d.right - N : d.left, S.left + rt, Math.max(S.left + rt, S.right - N - rt)), pe = ae > O.below && O.above > O.below ? { bottom: `${window.innerHeight - d.top + s.gap}px`, maxHeight: _(s.maxHeight, O.above) } : { top: `${d.bottom + s.gap}px`, maxHeight: _(s.maxHeight, O.below) };
      return { ...i.value, ...pe, left: `${de}px`, maxWidth: _(s.maxWidth, O.across) };
    }), w = n, E = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function j(d) {
      const S = E(), O = S.indexOf(document.activeElement);
      S[(O + d + S.length) % S.length].focus();
    }
    const Q = { ArrowDown: () => j(1), ArrowUp: () => j(-1), Escape: () => w("close") }, q = (d) => Q[d.key] && (d.preventDefault(), Q[d.key]()), C = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let R = 0;
    const v = new ResizeObserver(() => {
      cancelAnimationFrame(R), R = requestAnimationFrame(C);
    });
    I0(a, (d) => s.anchor && !s.anchor.contains(d.target) && w("close"));
    const p = (d, S) => ["top", "left", "right", "bottom"].some((O) => Math.abs(d[O] - S[O]) > 1), k = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let $ = 0;
    function m() {
      if (s.anchor) {
        const d = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || k(d)) return w("close");
        p(d, l.value) && (l.value = d);
      }
      $ = requestAnimationFrame(m);
    }
    return Ne(() => {
      s.anchor && a.value && L0(a.value, s.anchor), C(), a.value && v.observe(a.value), !s.plain && E()[0] && E()[0].focus(), m();
    }), Ae(() => {
      v.disconnect(), cancelAnimationFrame($), cancelAnimationFrame(R);
    }), t({ element: a }), (d, S) => (c(), K(pa, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", dt({
        ref_key: "panel",
        ref: a
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: y.value,
        onKeydown: q
      }), [
        be(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), N0 = /* @__PURE__ */ Y(D0, [["__scopeId", "data-v-3d203970"]]), j0 = {
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
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, P0 = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, q0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?" }, We],
  started: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?" }, We],
  testing: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, W0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], H0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], F0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], U0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], z0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], V0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? z0(t) : e === "agent" ? [...F0(t), ...H0(t)] : e === "check" ? U0(t) : e === "question" ? W0(t) : ((n = { plan: P0, task: q0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, G0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, K0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Y0 = { class: "ask-text" }, J0 = ["placeholder", "aria-label"], Z0 = {
  key: 3,
  class: "moves"
}, Q0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = I(() => V0(s.kind, s.row)), i = H(""), r = H(null), l = H("");
    ke(() => s.id, () => {
      i.value = "", r.value = null;
    });
    async function u(_, A = "") {
      const W = await s.read([_.noun ?? s.kind, _.word, String(s.id), ..._.flag ? [_.flag, A] : _.positional ? [A] : []]);
      i.value = W.ok ? "" : W.error, W.ok && (r.value = null, l.value = "", a("done"));
    }
    const f = (_) => _.confirm ? r.value = _ : _.said ? u(_, _.said) : _.flag || _.positional ? (r.value = _, l.value = "") : u(_), b = () => l.value.trim() && u(r.value, l.value.trim());
    return t({ moves: o, press: f }), (_, A) => {
      var W;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: X(["foot", { inline: e.inline }])
      }, [
        i.value ? (c(), h("p", G0, M(i.value), 1)) : P("", !0),
        (W = r.value) != null && W.confirm ? (c(), h("div", K0, [
          g("span", Y0, M(r.value.confirm), 1),
          F(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: A[0] || (A[0] = (y) => u(r.value))
          }, {
            default: U(() => [
              ge(M(r.value.label), 1)
            ]),
            _: 1
          }),
          F(ye, {
            small: "",
            kind: "ghost",
            onClick: A[1] || (A[1] = (y) => r.value = null)
          }, {
            default: U(() => [...A[5] || (A[5] = [
              ge("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: Me(b, ["prevent"])
        }, [
          $t(g("input", {
            "onUpdate:modelValue": A[2] || (A[2] = (y) => l.value = y),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: A[3] || (A[3] = Hn(Me((y) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, J0), [
            [ya, l.value]
          ]),
          F(ye, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: U(() => [
              ge(M(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(ye, {
            small: "",
            kind: "ghost",
            onClick: A[4] || (A[4] = (y) => r.value = null)
          }, {
            default: U(() => [...A[6] || (A[6] = [
              ge("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Z0, [
          (c(!0), h(J, null, re(o.value, (y) => (c(), K(ye, {
            key: y.word,
            small: "",
            kind: y.main ? "primary" : "ghost",
            "data-move": y.word,
            onClick: (w) => f(y)
          }, {
            default: U(() => [
              ge(M(y.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : P("", !0);
    };
  }
}, X0 = /* @__PURE__ */ Y(Q0, [["__scopeId", "data-v-14c7da8d"]]), em = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, tm = { ...em, done: "Completed" }, nm = { class: "task-status-icon" }, sm = ["width", "height", "aria-label"], am = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", nm, [
      F(on, {
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
            "aria-label": G(tm)[e.status]
          }, [
            F(ls, { value: e.status }, {
              blocked: U(() => [...n[0] || (n[0] = [
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
              done: U(() => [...n[1] || (n[1] = [
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
              started: U(() => [...n[2] || (n[2] = [
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
              asked: U(() => [...n[3] || (n[3] = [
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
              paused: U(() => [...n[4] || (n[4] = [
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
              planned: U(() => [...n[5] || (n[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: U(() => [...n[6] || (n[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, sm))
        ]),
        _: 1
      })
    ]));
  }
}, da = /* @__PURE__ */ Y(am, [["__scopeId", "data-v-2ab7e404"]]), om = {
  class: "comment-side",
  "data-comment-side": "",
  "aria-label": "Comments"
}, rm = { class: "comment-side-head" }, im = {
  key: 0,
  class: "comment-none"
}, lm = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", om, [
      g("header", rm, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        F(cs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? P("", !0) : (c(), h("p", im, "No comments yet")),
      (c(!0), h(J, null, re(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, M(e.words(s)), 1))), 128))
    ]));
  }
}, cm = /* @__PURE__ */ Y(lm, [["__scopeId", "data-v-234cce45"]]), um = ["placeholder"], dm = { class: "actions" }, hm = { class: "error" }, fm = {
  key: 1,
  class: "card closed"
}, pm = { class: "mark" }, mm = { class: "prompt" }, gm = {
  key: 0,
  class: "draft"
}, vm = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Wn({
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
  emits: /* @__PURE__ */ Wn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = qn(e, "draft"), i = qn(e, "error"), r = H(!!i.value), l = H(!1), u = H(!1), f = H(null);
    async function b() {
      var y, w;
      r.value = !0, l.value = !1, await ln(), (w = ((y = f.value) == null ? void 0 : y.querySelector("input")) || f.value) == null || w.focus();
    }
    function _() {
      r.value = !1, i.value = "";
    }
    function A(y) {
      y.shiftKey || y.isComposing || (y.preventDefault(), W());
    }
    async function W() {
      const y = o.value.trim();
      if (!(!y || !s.ready || u.value)) {
        i.value = "", u.value = !0, o.value = "";
        try {
          await s.send(y), r.value = !1, l.value = !0;
        } catch (w) {
          o.value = y, i.value = w.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: b }), (y, w) => (c(), h("div", {
      class: X(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: Me(W, ["prevent"]),
        onKeydown: Hn(_, ["esc"])
      }, [
        be(y.$slots, "who", {}, void 0, !0),
        $t(g("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": w[0] || (w[0] = (E) => o.value = E),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Hn(A, ["enter"])
        }, null, 40, um), [
          [ya, o.value]
        ]),
        g("div", dm, [
          g("span", hm, M(i.value), 1),
          F(ye, {
            small: "",
            onClick: _
          }, {
            default: U(() => [...w[2] || (w[2] = [
              ge("Cancel", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: W
          }, {
            default: U(() => [...w[3] || (w[3] = [
              ge("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", fm, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: b
        }, [
          g("span", pm, [
            F(Ee, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", mm, M(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", gm, "Draft kept")) : P("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = (E) => a("show"))
        }, [
          g("span", null, M(G(di)(e.count, "comment")), 1),
          F(Ee, {
            name: "down",
            size: 12
          })
        ])) : P("", !0)
      ]))
    ], 2));
  }
}, ym = /* @__PURE__ */ Y(vm, [["__scopeId", "data-v-4d1d3a74"]]);
function wm(e, t) {
  const n = H([]), s = H(!1);
  let a = 0;
  const o = (l) => {
    const { kind: u, id: f, title: b } = e(), _ = `On ${u} ${f}, ${b}: `;
    return l.text.startsWith(_) ? l.text.slice(_.length) : l.text;
  };
  async function i() {
    const { kind: l, id: u } = e();
    if (!u) return;
    const f = await t([l, "comments", String(u)]);
    n.value = f.ok ? f.value.rows ?? [] : [];
  }
  async function r(l) {
    const { kind: u, id: f } = e(), b = { id: `sending-${++a}`, text: l };
    n.value = [...n.value, b], s.value = !0;
    const _ = await t([u, "comment", String(f), l]);
    if (!_.ok)
      throw n.value = n.value.filter((A) => A !== b && A.id !== b.id), new Error(_.error);
    await i();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: o, send: r, load: i };
}
const km = { class: "top" }, bm = {
  class: "crumb",
  "data-task-crumb": ""
}, xm = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, $m = {
  key: 1,
  class: "body"
}, Mm = { class: "body-row" }, _m = { class: "stamp" }, Sm = {
  class: "title",
  "data-resource-title": ""
}, Em = { class: "since" }, Am = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Cm = { class: "text" }, Om = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Tm = { class: "text" }, Bm = { class: "facts" }, Lm = { class: "fact wide" }, Rm = { class: "fact-value" }, Im = {
  key: 0,
  class: "fact"
}, Dm = { class: "fact-value" }, Nm = {
  key: 1,
  class: "fact"
}, jm = { class: "fact-value" }, Pm = {
  key: 2,
  class: "fact wide"
}, qm = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Wm = {
  key: 2,
  class: "part",
  "data-resource-waits": ""
}, Hm = ["onClick"], Fm = { class: "wait-id" }, Um = { class: "wait-title" }, zm = {
  key: 3,
  class: "part",
  "data-task-outcome": ""
}, Vm = { class: "text" }, Gm = {
  key: 4,
  class: "part",
  "data-task-brief": ""
}, Km = {
  key: 5,
  class: "part",
  "data-resource-logs": ""
}, Ym = 180, Jm = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = no.map(({ key: v, label: p }) => ({ key: String(v), label: p })), a = /* @__PURE__ */ new Set(["completed", "cancelled"]), o = e, i = n, r = H(null), l = H(null), u = H(""), f = H(""), b = H(!1), _ = H(null), A = H(null), W = wm(() => r.value ? { kind: "task", id: o.id, title: r.value.title } : {}, (v) => o.read(v));
    ke(W.open, (v) => i("comments", v));
    let y = 0;
    const w = (v) => a.has(v) ? "done" : v, E = (v) => v.slice(0, 1).toUpperCase() + v.slice(1), j = I(() => {
      var v;
      return (v = l.value) != null && v.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function Q() {
      const v = ++y, [p, k] = await Promise.all([o.read(["task", "inspect", String(o.id)]), o.read(["plan", "place", String(o.id)])]);
      v === y && (u.value = p.ok ? "" : p.error, r.value = p.ok ? p.value : null, l.value = k.ok ? k.value : null);
    }
    ke(() => o.id, () => {
      r.value = null, l.value = null, b.value = !1, _.value = null, Q();
    }, { immediate: !0 }), ke(() => o.changes, Q);
    async function q(v) {
      const p = r.value.priority;
      r.value.priority = Number(v);
      const k = await o.read(["task", "edit", String(o.id), "--priority", v]);
      if (f.value = k.ok ? "" : k.error, k.ok) return Q();
      r.value.priority = p;
    }
    function C(v) {
      _.value = null, A.value.press(v);
    }
    const R = (v) => {
      var p;
      return ((p = A.value) == null ? void 0 : p.moves.length) && (_.value = v);
    };
    return t({ openStatus: R }), (v, p) => {
      var k, $;
      return c(), h("aside", {
        class: X(["task-inspector", { lone: e.lone }]),
        "data-task-inspector": ""
      }, [
        g("div", km, [
          e.backed ? (c(), K(j0, {
            key: 0,
            onBack: p[0] || (p[0] = (m) => i("back"))
          })) : P("", !0),
          g("span", bm, M(j.value), 1),
          p[9] || (p[9] = g("span", { class: "grow" }, null, -1)),
          e.stepped ? (c(), h(J, { key: 1 }, [
            F(ye, {
              small: "",
              title: "Previous task (K)",
              "aria-label": "Previous task",
              onClick: p[1] || (p[1] = (m) => i("step", -1))
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
              onClick: p[2] || (p[2] = (m) => i("step", 1))
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
            onClick: p[3] || (p[3] = (m) => i("close"))
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
        u.value ? (c(), h("p", xm, M(u.value), 1)) : r.value ? (c(), h(J, { key: 2 }, [
          g("div", Mm, [
            (c(), h("div", {
              key: r.value.id,
              class: "body"
            }, [
              g("div", _m, "Task " + M(r.value.id) + " · updated " + M(G(Ls)(G(Zt)(r.value)) || "just now"), 1),
              g("h3", Sm, M(r.value.title), 1),
              g("div", {
                class: X(["state-line", w(r.value.state)])
              }, [
                g("button", {
                  type: "button",
                  class: "state",
                  "data-task-state": "",
                  title: "Change the status (S)",
                  onClick: p[4] || (p[4] = (m) => R(m.currentTarget))
                }, [
                  F(da, {
                    status: w(r.value.state)
                  }, null, 8, ["status"]),
                  ge(" " + M(E(r.value.state)), 1)
                ]),
                g("span", Em, "since " + M(G(Ls)(G(Zt)(r.value)) || "just now"), 1)
              ], 2),
              r.value.state === "blocked" ? (c(), h("section", Am, [
                p[10] || (p[10] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
                g("p", Cm, M(r.value.reason || "Other tasks"), 1),
                p[11] || (p[11] = g("p", { class: "note" }, "Nothing opens it by itself. Unblock it when that is done.", -1))
              ])) : r.value.state === "cancelled" && r.value.reason ? (c(), h("section", Om, [
                p[12] || (p[12] = g("span", { class: "label" }, "Why it was cancelled", -1)),
                g("p", Tm, M(r.value.reason), 1)
              ])) : P("", !0),
              g("div", Bm, [
                g("div", Lm, [
                  p[13] || (p[13] = g("span", { class: "fact-label" }, "Plan", -1)),
                  g("span", Rm, M((k = l.value) != null && k.plan_id ? `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan"), 1)
                ]),
                (($ = l.value) == null ? void 0 : $.phase_total) > 1 ? (c(), h("div", Im, [
                  p[14] || (p[14] = g("span", { class: "fact-label" }, "Phase", -1)),
                  g("span", Dm, M(l.value.phase_number) + " of " + M(l.value.phase_total) + ": " + M(l.value.phase_title), 1)
                ])) : P("", !0),
                r.value.state === "started" && r.value.holder_id ? (c(), h("div", Nm, [
                  p[15] || (p[15] = g("span", { class: "fact-label" }, "Holder", -1)),
                  g("span", jm, "Agent " + M(r.value.holder_id), 1)
                ])) : P("", !0),
                G(a).has(r.value.state) ? P("", !0) : (c(), h("div", Pm, [
                  p[16] || (p[16] = g("span", { class: "fact-label" }, "Priority", -1)),
                  F(Qn, {
                    options: G(s),
                    value: String(r.value.priority),
                    "data-task-priority": "",
                    onPick: q
                  }, null, 8, ["options", "value"]),
                  f.value ? (c(), h("p", qm, M(f.value), 1)) : P("", !0)
                ]))
              ]),
              r.value.waits.length ? (c(), h("section", Wm, [
                p[17] || (p[17] = g("h4", null, "Waits on", -1)),
                (c(!0), h(J, null, re(r.value.waits, (m) => (c(), h("button", {
                  key: m.id,
                  type: "button",
                  class: "wait",
                  onClick: (d) => i("select", m.id)
                }, [
                  F(da, {
                    status: w(m.state),
                    size: 12
                  }, null, 8, ["status"]),
                  g("span", Fm, M(m.id), 1),
                  g("span", Um, M(m.title), 1)
                ], 8, Hm))), 128))
              ])) : P("", !0),
              r.value.state === "completed" && r.value.outcome ? (c(), h("section", zm, [
                p[18] || (p[18] = g("h4", null, "How it was done", -1)),
                g("p", Vm, M(r.value.outcome), 1)
              ])) : P("", !0),
              r.value.brief ? (c(), h("section", Gm, [
                p[19] || (p[19] = g("h4", null, "The brief", -1)),
                g("p", {
                  class: X(["text", { clamped: !b.value }])
                }, M(r.value.brief), 3),
                r.value.brief.length > Ym && !b.value ? (c(), h("button", {
                  key: 0,
                  type: "button",
                  class: "more",
                  onClick: p[5] || (p[5] = (m) => b.value = !0)
                }, "Show the whole brief")) : P("", !0)
              ])) : P("", !0),
              r.value.logs.length ? (c(), h("section", Km, [
                p[20] || (p[20] = g("h4", null, "Log", -1)),
                (c(!0), h(J, null, re(r.value.logs, (m) => (c(), h("p", {
                  key: m.id,
                  class: "log"
                }, M(m.line), 1))), 128))
              ])) : P("", !0)
            ])),
            G(W).open.value ? (c(), K(cm, {
              key: 0,
              comments: G(W).comments.value,
              words: G(W).words,
              onClose: p[6] || (p[6] = (m) => G(W).open.value = !1)
            }, null, 8, ["comments", "words"])) : P("", !0)
          ]),
          F(ym, {
            send: G(W).send,
            count: G(W).comments.value.length,
            onShow: p[7] || (p[7] = (m) => G(W).open.value = !G(W).open.value)
          }, null, 8, ["send", "count"])
        ], 64)) : (c(), h("div", $m, [
          F(At)
        ])),
        F(X0, {
          ref_key: "footer",
          ref: A,
          kind: "task",
          id: e.id,
          row: r.value,
          read: e.read,
          onDone: Q
        }, null, 8, ["id", "row", "read"]),
        _.value ? (c(), K(N0, {
          key: 3,
          anchor: _.value,
          "min-width": 220,
          "max-width": 300,
          onClose: p[8] || (p[8] = (m) => _.value = null)
        }, {
          default: U(() => [
            F(B0, null, {
              default: U(() => [
                ge("Change the status of task " + M(e.id), 1)
              ]),
              _: 1
            }),
            (c(!0), h(J, null, re(A.value.moves, (m) => (c(), K(A0, {
              key: m.word,
              onClick: (d) => C(m)
            }, {
              default: U(() => [
                ge(M(m.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : P("", !0)
      ], 2);
    };
  }
}, cv = /* @__PURE__ */ Y(Jm, [["__scopeId", "data-v-e7c1fc13"]]);
function Zm(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Pn = { exports: {} }, ha;
function Qm() {
  return ha || (ha = 1, (function(e, t) {
    var n = (function() {
      var s = function(C, R) {
        var v = 236, p = 17, k = C, $ = o[R], m = null, d = 0, S = null, O = [], N = {}, ae = function(T, B) {
          d = k * 4 + 17, m = (function(x) {
            for (var L = new Array(x), D = 0; D < x; D += 1) {
              L[D] = new Array(x);
              for (var V = 0; V < x; V += 1)
                L[D][V] = null;
            }
            return L;
          })(d), oe(0, 0), oe(d - 7, 0), oe(0, d - 7), pe(), le(), je(T, B), k >= 7 && _e(T), S == null && (S = Ro(k, $, O)), Pe(S, B);
        }, oe = function(T, B) {
          for (var x = -1; x <= 7; x += 1)
            if (!(T + x <= -1 || d <= T + x))
              for (var L = -1; L <= 7; L += 1)
                B + L <= -1 || d <= B + L || (0 <= x && x <= 6 && (L == 0 || L == 6) || 0 <= L && L <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= L && L <= 4 ? m[T + x][B + L] = !0 : m[T + x][B + L] = !1);
        }, de = function() {
          for (var T = 0, B = 0, x = 0; x < 8; x += 1) {
            ae(!0, x);
            var L = r.getLostPoint(N);
            (x == 0 || T > L) && (T = L, B = x);
          }
          return B;
        }, le = function() {
          for (var T = 8; T < d - 8; T += 1)
            m[T][6] == null && (m[T][6] = T % 2 == 0);
          for (var B = 8; B < d - 8; B += 1)
            m[6][B] == null && (m[6][B] = B % 2 == 0);
        }, pe = function() {
          for (var T = r.getPatternPosition(k), B = 0; B < T.length; B += 1)
            for (var x = 0; x < T.length; x += 1) {
              var L = T[B], D = T[x];
              if (m[L][D] == null)
                for (var V = -2; V <= 2; V += 1)
                  for (var ne = -2; ne <= 2; ne += 1)
                    V == -2 || V == 2 || ne == -2 || ne == 2 || V == 0 && ne == 0 ? m[L + V][D + ne] = !0 : m[L + V][D + ne] = !1;
            }
        }, _e = function(T) {
          for (var B = r.getBCHTypeNumber(k), x = 0; x < 18; x += 1) {
            var L = !T && (B >> x & 1) == 1;
            m[Math.floor(x / 3)][x % 3 + d - 8 - 3] = L;
          }
          for (var x = 0; x < 18; x += 1) {
            var L = !T && (B >> x & 1) == 1;
            m[x % 3 + d - 8 - 3][Math.floor(x / 3)] = L;
          }
        }, je = function(T, B) {
          for (var x = $ << 3 | B, L = r.getBCHTypeInfo(x), D = 0; D < 15; D += 1) {
            var V = !T && (L >> D & 1) == 1;
            D < 6 ? m[D][8] = V : D < 8 ? m[D + 1][8] = V : m[d - 15 + D][8] = V;
          }
          for (var D = 0; D < 15; D += 1) {
            var V = !T && (L >> D & 1) == 1;
            D < 8 ? m[8][d - D - 1] = V : D < 9 ? m[8][15 - D - 1 + 1] = V : m[8][15 - D - 1] = V;
          }
          m[d - 8][8] = !T;
        }, Pe = function(T, B) {
          for (var x = -1, L = d - 1, D = 7, V = 0, ne = r.getMaskFunction(B), te = d - 1; te > 0; te -= 2)
            for (te == 6 && (te -= 1); ; ) {
              for (var me = 0; me < 2; me += 1)
                if (m[L][te - me] == null) {
                  var we = !1;
                  V < T.length && (we = (T[V] >>> D & 1) == 1);
                  var se = ne(L, te - me);
                  se && (we = !we), m[L][te - me] = we, D -= 1, D == -1 && (V += 1, D = 7);
                }
              if (L += x, L < 0 || d <= L) {
                L -= x, x = -x;
                break;
              }
            }
        }, st = function(T, B) {
          for (var x = 0, L = 0, D = 0, V = new Array(B.length), ne = new Array(B.length), te = 0; te < B.length; te += 1) {
            var me = B[te].dataCount, we = B[te].totalCount - me;
            L = Math.max(L, me), D = Math.max(D, we), V[te] = new Array(me);
            for (var se = 0; se < V[te].length; se += 1)
              V[te][se] = 255 & T.getBuffer()[se + x];
            x += me;
            var Ce = r.getErrorCorrectPolynomial(we), Oe = u(V[te], Ce.getLength() - 1), ks = Oe.mod(Ce);
            ne[te] = new Array(Ce.getLength() - 1);
            for (var se = 0; se < ne[te].length; se += 1) {
              var bs = se + ks.getLength() - ne[te].length;
              ne[te][se] = bs >= 0 ? ks.getAt(bs) : 0;
            }
          }
          for (var xs = 0, se = 0; se < B.length; se += 1)
            xs += B[se].totalCount;
          for (var vn = new Array(xs), Rt = 0, se = 0; se < L; se += 1)
            for (var te = 0; te < B.length; te += 1)
              se < V[te].length && (vn[Rt] = V[te][se], Rt += 1);
          for (var se = 0; se < D; se += 1)
            for (var te = 0; te < B.length; te += 1)
              se < ne[te].length && (vn[Rt] = ne[te][se], Rt += 1);
          return vn;
        }, Ro = function(T, B, x) {
          for (var L = f.getRSBlocks(T, B), D = b(), V = 0; V < x.length; V += 1) {
            var ne = x[V];
            D.put(ne.getMode(), 4), D.put(ne.getLength(), r.getLengthInBits(ne.getMode(), T)), ne.write(D);
          }
          for (var te = 0, V = 0; V < L.length; V += 1)
            te += L[V].dataCount;
          if (D.getLengthInBits() > te * 8)
            throw "code length overflow. (" + D.getLengthInBits() + ">" + te * 8 + ")";
          for (D.getLengthInBits() + 4 <= te * 8 && D.put(0, 4); D.getLengthInBits() % 8 != 0; )
            D.putBit(!1);
          for (; !(D.getLengthInBits() >= te * 8 || (D.put(v, 8), D.getLengthInBits() >= te * 8)); )
            D.put(p, 8);
          return st(D, L);
        };
        N.addData = function(T, B) {
          B = B || "Byte";
          var x = null;
          switch (B) {
            case "Numeric":
              x = _(T);
              break;
            case "Alphanumeric":
              x = A(T);
              break;
            case "Byte":
              x = W(T);
              break;
            case "Kanji":
              x = y(T);
              break;
            default:
              throw "mode:" + B;
          }
          O.push(x), S = null;
        }, N.isDark = function(T, B) {
          if (T < 0 || d <= T || B < 0 || d <= B)
            throw T + "," + B;
          return m[T][B];
        }, N.getModuleCount = function() {
          return d;
        }, N.make = function() {
          if (k < 1) {
            for (var T = 1; T < 40; T++) {
              for (var B = f.getRSBlocks(T, $), x = b(), L = 0; L < O.length; L++) {
                var D = O[L];
                x.put(D.getMode(), 4), x.put(D.getLength(), r.getLengthInBits(D.getMode(), T)), D.write(x);
              }
              for (var V = 0, L = 0; L < B.length; L++)
                V += B[L].dataCount;
              if (x.getLengthInBits() <= V * 8)
                break;
            }
            k = T;
          }
          ae(!1, de());
        }, N.createTableTag = function(T, B) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + B + "px;", x += '">', x += "<tbody>";
          for (var L = 0; L < N.getModuleCount(); L += 1) {
            x += "<tr>";
            for (var D = 0; D < N.getModuleCount(); D += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + T + "px;", x += " height: " + T + "px;", x += " background-color: ", x += N.isDark(L, D) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, N.createSvgTag = function(T, B, x, L) {
          var D = {};
          typeof arguments[0] == "object" && (D = arguments[0], T = D.cellSize, B = D.margin, x = D.alt, L = D.title), T = T || 2, B = typeof B > "u" ? T * 4 : B, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, L = typeof L == "string" ? { text: L } : L || {}, L.text = L.text || null, L.id = L.text ? L.id || "qrcode-title" : null;
          var V = N.getModuleCount() * T + B * 2, ne, te, me, we, se = "", Ce;
          for (Ce = "l" + T + ",0 0," + T + " -" + T + ",0 0,-" + T + "z ", se += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', se += D.scalable ? "" : ' width="' + V + 'px" height="' + V + 'px"', se += ' viewBox="0 0 ' + V + " " + V + '" ', se += ' preserveAspectRatio="xMinYMin meet"', se += L.text || x.text ? ' role="img" aria-labelledby="' + at([L.id, x.id].join(" ").trim()) + '"' : "", se += ">", se += L.text ? '<title id="' + at(L.id) + '">' + at(L.text) + "</title>" : "", se += x.text ? '<description id="' + at(x.id) + '">' + at(x.text) + "</description>" : "", se += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', se += '<path d="', me = 0; me < N.getModuleCount(); me += 1)
            for (we = me * T + B, ne = 0; ne < N.getModuleCount(); ne += 1)
              N.isDark(me, ne) && (te = ne * T + B, se += "M" + te + "," + we + Ce);
          return se += '" stroke="transparent" fill="black"/>', se += "</svg>", se;
        }, N.createDataURL = function(T, B) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var x = N.getModuleCount() * T + B * 2, L = B, D = x - B;
          return q(x, x, function(V, ne) {
            if (L <= V && V < D && L <= ne && ne < D) {
              var te = Math.floor((V - L) / T), me = Math.floor((ne - L) / T);
              return N.isDark(me, te) ? 0 : 1;
            } else
              return 1;
          });
        }, N.createImgTag = function(T, B, x) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var L = N.getModuleCount() * T + B * 2, D = "";
          return D += "<img", D += ' src="', D += N.createDataURL(T, B), D += '"', D += ' width="', D += L, D += '"', D += ' height="', D += L, D += '"', x && (D += ' alt="', D += at(x), D += '"'), D += "/>", D;
        };
        var at = function(T) {
          for (var B = "", x = 0; x < T.length; x += 1) {
            var L = T.charAt(x);
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
        }, Io = function(T) {
          var B = 1;
          T = typeof T > "u" ? B * 2 : T;
          var x = N.getModuleCount() * B + T * 2, L = T, D = x - T, V, ne, te, me, we, se = {
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
            for (te = Math.floor((V - L) / B), me = Math.floor((V + 1 - L) / B), ne = 0; ne < x; ne += 1)
              we = "█", L <= ne && ne < D && L <= V && V < D && N.isDark(te, Math.floor((ne - L) / B)) && (we = " "), L <= ne && ne < D && L <= V + 1 && V + 1 < D && N.isDark(me, Math.floor((ne - L) / B)) ? we += " " : we += "█", Oe += T < 1 && V + 1 >= D ? Ce[we] : se[we];
            Oe += `
`;
          }
          return x % 2 && T > 0 ? Oe.substring(0, Oe.length - x - 1) + Array(x + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return N.createASCII = function(T, B) {
          if (T = T || 1, T < 2)
            return Io(B);
          T -= 1, B = typeof B > "u" ? T * 2 : B;
          var x = N.getModuleCount() * T + B * 2, L = B, D = x - B, V, ne, te, me, we = Array(T + 1).join("██"), se = Array(T + 1).join("  "), Ce = "", Oe = "";
          for (V = 0; V < x; V += 1) {
            for (te = Math.floor((V - L) / T), Oe = "", ne = 0; ne < x; ne += 1)
              me = 1, L <= ne && ne < D && L <= V && V < D && N.isDark(te, Math.floor((ne - L) / T)) && (me = 0), Oe += me ? we : se;
            for (te = 0; te < T; te += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, N.renderTo2dContext = function(T, B) {
          B = B || 2;
          for (var x = N.getModuleCount(), L = 0; L < x; L++)
            for (var D = 0; D < x; D++)
              T.fillStyle = N.isDark(L, D) ? "black" : "white", T.fillRect(L * B, D * B, B, B);
        }, N;
      };
      s.stringToBytesFuncs = {
        default: function(C) {
          for (var R = [], v = 0; v < C.length; v += 1) {
            var p = C.charCodeAt(v);
            R.push(p & 255);
          }
          return R;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(C, R) {
        var v = (function() {
          for (var k = j(C), $ = function() {
            var le = k.read();
            if (le == -1) throw "eof";
            return le;
          }, m = 0, d = {}; ; ) {
            var S = k.read();
            if (S == -1) break;
            var O = $(), N = $(), ae = $(), oe = String.fromCharCode(S << 8 | O), de = N << 8 | ae;
            d[oe] = de, m += 1;
          }
          if (m != R)
            throw m + " != " + R;
          return d;
        })(), p = 63;
        return function(k) {
          for (var $ = [], m = 0; m < k.length; m += 1) {
            var d = k.charCodeAt(m);
            if (d < 128)
              $.push(d);
            else {
              var S = v[k.charAt(m)];
              typeof S == "number" ? (S & 255) == S ? $.push(S) : ($.push(S >>> 8), $.push(S & 255)) : $.push(p);
            }
          }
          return $;
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
        ], R = 1335, v = 7973, p = 21522, k = {}, $ = function(m) {
          for (var d = 0; m != 0; )
            d += 1, m >>>= 1;
          return d;
        };
        return k.getBCHTypeInfo = function(m) {
          for (var d = m << 10; $(d) - $(R) >= 0; )
            d ^= R << $(d) - $(R);
          return (m << 10 | d) ^ p;
        }, k.getBCHTypeNumber = function(m) {
          for (var d = m << 12; $(d) - $(v) >= 0; )
            d ^= v << $(d) - $(v);
          return m << 12 | d;
        }, k.getPatternPosition = function(m) {
          return C[m - 1];
        }, k.getMaskFunction = function(m) {
          switch (m) {
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
              throw "bad maskPattern:" + m;
          }
        }, k.getErrorCorrectPolynomial = function(m) {
          for (var d = u([1], 0), S = 0; S < m; S += 1)
            d = d.multiply(u([1, l.gexp(S)], 0));
          return d;
        }, k.getLengthInBits = function(m, d) {
          if (1 <= d && d < 10)
            switch (m) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + m;
            }
          else if (d < 27)
            switch (m) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + m;
            }
          else if (d < 41)
            switch (m) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + m;
            }
          else
            throw "type:" + d;
        }, k.getLostPoint = function(m) {
          for (var d = m.getModuleCount(), S = 0, O = 0; O < d; O += 1)
            for (var N = 0; N < d; N += 1) {
              for (var ae = 0, oe = m.isDark(O, N), de = -1; de <= 1; de += 1)
                if (!(O + de < 0 || d <= O + de))
                  for (var le = -1; le <= 1; le += 1)
                    N + le < 0 || d <= N + le || de == 0 && le == 0 || oe == m.isDark(O + de, N + le) && (ae += 1);
              ae > 5 && (S += 3 + ae - 5);
            }
          for (var O = 0; O < d - 1; O += 1)
            for (var N = 0; N < d - 1; N += 1) {
              var pe = 0;
              m.isDark(O, N) && (pe += 1), m.isDark(O + 1, N) && (pe += 1), m.isDark(O, N + 1) && (pe += 1), m.isDark(O + 1, N + 1) && (pe += 1), (pe == 0 || pe == 4) && (S += 3);
            }
          for (var O = 0; O < d; O += 1)
            for (var N = 0; N < d - 6; N += 1)
              m.isDark(O, N) && !m.isDark(O, N + 1) && m.isDark(O, N + 2) && m.isDark(O, N + 3) && m.isDark(O, N + 4) && !m.isDark(O, N + 5) && m.isDark(O, N + 6) && (S += 40);
          for (var N = 0; N < d; N += 1)
            for (var O = 0; O < d - 6; O += 1)
              m.isDark(O, N) && !m.isDark(O + 1, N) && m.isDark(O + 2, N) && m.isDark(O + 3, N) && m.isDark(O + 4, N) && !m.isDark(O + 5, N) && m.isDark(O + 6, N) && (S += 40);
          for (var _e = 0, N = 0; N < d; N += 1)
            for (var O = 0; O < d; O += 1)
              m.isDark(O, N) && (_e += 1);
          var je = Math.abs(100 * _e / d / d - 50) / 5;
          return S += je * 10, S;
        }, k;
      })(), l = (function() {
        for (var C = new Array(256), R = new Array(256), v = 0; v < 8; v += 1)
          C[v] = 1 << v;
        for (var v = 8; v < 256; v += 1)
          C[v] = C[v - 4] ^ C[v - 5] ^ C[v - 6] ^ C[v - 8];
        for (var v = 0; v < 255; v += 1)
          R[C[v]] = v;
        var p = {};
        return p.glog = function(k) {
          if (k < 1)
            throw "glog(" + k + ")";
          return R[k];
        }, p.gexp = function(k) {
          for (; k < 0; )
            k += 255;
          for (; k >= 256; )
            k -= 255;
          return C[k];
        }, p;
      })();
      function u(C, R) {
        if (typeof C.length > "u")
          throw C.length + "/" + R;
        var v = (function() {
          for (var k = 0; k < C.length && C[k] == 0; )
            k += 1;
          for (var $ = new Array(C.length - k + R), m = 0; m < C.length - k; m += 1)
            $[m] = C[m + k];
          return $;
        })(), p = {};
        return p.getAt = function(k) {
          return v[k];
        }, p.getLength = function() {
          return v.length;
        }, p.multiply = function(k) {
          for (var $ = new Array(p.getLength() + k.getLength() - 1), m = 0; m < p.getLength(); m += 1)
            for (var d = 0; d < k.getLength(); d += 1)
              $[m + d] ^= l.gexp(l.glog(p.getAt(m)) + l.glog(k.getAt(d)));
          return u($, 0);
        }, p.mod = function(k) {
          if (p.getLength() - k.getLength() < 0)
            return p;
          for (var $ = l.glog(p.getAt(0)) - l.glog(k.getAt(0)), m = new Array(p.getLength()), d = 0; d < p.getLength(); d += 1)
            m[d] = p.getAt(d);
          for (var d = 0; d < k.getLength(); d += 1)
            m[d] ^= l.gexp(l.glog(k.getAt(d)) + $);
          return u(m, 0).mod(k);
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
        ], R = function(k, $) {
          var m = {};
          return m.totalCount = k, m.dataCount = $, m;
        }, v = {}, p = function(k, $) {
          switch ($) {
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
        return v.getRSBlocks = function(k, $) {
          var m = p(k, $);
          if (typeof m > "u")
            throw "bad rs block @ typeNumber:" + k + "/errorCorrectionLevel:" + $;
          for (var d = m.length / 3, S = [], O = 0; O < d; O += 1)
            for (var N = m[O * 3 + 0], ae = m[O * 3 + 1], oe = m[O * 3 + 2], de = 0; de < N; de += 1)
              S.push(R(ae, oe));
          return S;
        }, v;
      })(), b = function() {
        var C = [], R = 0, v = {};
        return v.getBuffer = function() {
          return C;
        }, v.getAt = function(p) {
          var k = Math.floor(p / 8);
          return (C[k] >>> 7 - p % 8 & 1) == 1;
        }, v.put = function(p, k) {
          for (var $ = 0; $ < k; $ += 1)
            v.putBit((p >>> k - $ - 1 & 1) == 1);
        }, v.getLengthInBits = function() {
          return R;
        }, v.putBit = function(p) {
          var k = Math.floor(R / 8);
          C.length <= k && C.push(0), p && (C[k] |= 128 >>> R % 8), R += 1;
        }, v;
      }, _ = function(C) {
        var R = a.MODE_NUMBER, v = C, p = {};
        p.getMode = function() {
          return R;
        }, p.getLength = function(m) {
          return v.length;
        }, p.write = function(m) {
          for (var d = v, S = 0; S + 2 < d.length; )
            m.put(k(d.substring(S, S + 3)), 10), S += 3;
          S < d.length && (d.length - S == 1 ? m.put(k(d.substring(S, S + 1)), 4) : d.length - S == 2 && m.put(k(d.substring(S, S + 2)), 7));
        };
        var k = function(m) {
          for (var d = 0, S = 0; S < m.length; S += 1)
            d = d * 10 + $(m.charAt(S));
          return d;
        }, $ = function(m) {
          if ("0" <= m && m <= "9")
            return m.charCodeAt(0) - 48;
          throw "illegal char :" + m;
        };
        return p;
      }, A = function(C) {
        var R = a.MODE_ALPHA_NUM, v = C, p = {};
        p.getMode = function() {
          return R;
        }, p.getLength = function($) {
          return v.length;
        }, p.write = function($) {
          for (var m = v, d = 0; d + 1 < m.length; )
            $.put(
              k(m.charAt(d)) * 45 + k(m.charAt(d + 1)),
              11
            ), d += 2;
          d < m.length && $.put(k(m.charAt(d)), 6);
        };
        var k = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          if ("A" <= $ && $ <= "Z")
            return $.charCodeAt(0) - 65 + 10;
          switch ($) {
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
              throw "illegal char :" + $;
          }
        };
        return p;
      }, W = function(C) {
        var R = a.MODE_8BIT_BYTE, v = s.stringToBytes(C), p = {};
        return p.getMode = function() {
          return R;
        }, p.getLength = function(k) {
          return v.length;
        }, p.write = function(k) {
          for (var $ = 0; $ < v.length; $ += 1)
            k.put(v[$], 8);
        }, p;
      }, y = function(C) {
        var R = a.MODE_KANJI, v = s.stringToBytesFuncs.SJIS;
        if (!v)
          throw "sjis not supported.";
        (function($, m) {
          var d = v($);
          if (d.length != 2 || (d[0] << 8 | d[1]) != m)
            throw "sjis not supported.";
        })("友", 38726);
        var p = v(C), k = {};
        return k.getMode = function() {
          return R;
        }, k.getLength = function($) {
          return ~~(p.length / 2);
        }, k.write = function($) {
          for (var m = p, d = 0; d + 1 < m.length; ) {
            var S = (255 & m[d]) << 8 | 255 & m[d + 1];
            if (33088 <= S && S <= 40956)
              S -= 33088;
            else if (57408 <= S && S <= 60351)
              S -= 49472;
            else
              throw "illegal char at " + (d + 1) + "/" + S;
            S = (S >>> 8 & 255) * 192 + (S & 255), $.put(S, 13), d += 2;
          }
          if (d < m.length)
            throw "illegal char at " + (d + 1);
        }, k;
      }, w = function() {
        var C = [], R = {};
        return R.writeByte = function(v) {
          C.push(v & 255);
        }, R.writeShort = function(v) {
          R.writeByte(v), R.writeByte(v >>> 8);
        }, R.writeBytes = function(v, p, k) {
          p = p || 0, k = k || v.length;
          for (var $ = 0; $ < k; $ += 1)
            R.writeByte(v[$ + p]);
        }, R.writeString = function(v) {
          for (var p = 0; p < v.length; p += 1)
            R.writeByte(v.charCodeAt(p));
        }, R.toByteArray = function() {
          return C;
        }, R.toString = function() {
          var v = "";
          v += "[";
          for (var p = 0; p < C.length; p += 1)
            p > 0 && (v += ","), v += C[p];
          return v += "]", v;
        }, R;
      }, E = function() {
        var C = 0, R = 0, v = 0, p = "", k = {}, $ = function(d) {
          p += String.fromCharCode(m(d & 63));
        }, m = function(d) {
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
        return k.writeByte = function(d) {
          for (C = C << 8 | d & 255, R += 8, v += 1; R >= 6; )
            $(C >>> R - 6), R -= 6;
        }, k.flush = function() {
          if (R > 0 && ($(C << 6 - R), C = 0, R = 0), v % 3 != 0)
            for (var d = 3 - v % 3, S = 0; S < d; S += 1)
              p += "=";
        }, k.toString = function() {
          return p;
        }, k;
      }, j = function(C) {
        var R = C, v = 0, p = 0, k = 0, $ = {};
        $.read = function() {
          for (; k < 8; ) {
            if (v >= R.length) {
              if (k == 0)
                return -1;
              throw "unexpected end of file./" + k;
            }
            var d = R.charAt(v);
            if (v += 1, d == "=")
              return k = 0, -1;
            if (d.match(/^\s$/))
              continue;
            p = p << 6 | m(d.charCodeAt(0)), k += 6;
          }
          var S = p >>> k - 8 & 255;
          return k -= 8, S;
        };
        var m = function(d) {
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
        return $;
      }, Q = function(C, R) {
        var v = C, p = R, k = new Array(C * R), $ = {};
        $.setPixel = function(O, N, ae) {
          k[N * v + O] = ae;
        }, $.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(v), O.writeShort(p), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(v), O.writeShort(p), O.writeByte(0);
          var N = 2, ae = d(N);
          O.writeByte(N);
          for (var oe = 0; ae.length - oe > 255; )
            O.writeByte(255), O.writeBytes(ae, oe, 255), oe += 255;
          O.writeByte(ae.length - oe), O.writeBytes(ae, oe, ae.length - oe), O.writeByte(0), O.writeString(";");
        };
        var m = function(O) {
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
          var pe = w(), _e = m(pe);
          _e.write(N, oe);
          var je = 0, Pe = String.fromCharCode(k[je]);
          for (je += 1; je < k.length; ) {
            var st = String.fromCharCode(k[je]);
            je += 1, de.contains(Pe + st) ? Pe = Pe + st : (_e.write(de.indexOf(Pe), oe), de.size() < 4095 && (de.size() == 1 << oe && (oe += 1), de.add(Pe + st)), Pe = st);
          }
          return _e.write(de.indexOf(Pe), oe), _e.write(ae, oe), _e.flush(), pe.toByteArray();
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
        return $;
      }, q = function(C, R, v) {
        for (var p = Q(C, R), k = 0; k < R; k += 1)
          for (var $ = 0; $ < C; $ += 1)
            p.setPixel($, k, v($, k));
        var m = w();
        p.write(m);
        for (var d = E(), S = m.toByteArray(), O = 0; O < S.length; O += 1)
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
  })(Pn)), Pn.exports;
}
var Xm = Qm();
const eg = /* @__PURE__ */ Zm(Xm), tg = ["width", "height", "viewBox"], ng = ["width", "height"], sg = ["d"], ag = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const s = eg(0, "M");
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
      g("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, ng),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, sg)
    ], 8, tg));
  }
}, uv = /* @__PURE__ */ Y(ag, [["__scopeId", "data-v-489f0852"]]), dv = Vo(() => import("./VoiceFigure-DgWLWcZo.js").then((e) => e.V)), hv = "1.0.0", fv = "3.5";
export {
  cg as $,
  Bg as A,
  Ge as B,
  Hg as C,
  Og as D,
  Wg as E,
  $g as F,
  To as G,
  Fp as H,
  Wp as I,
  Kg as J,
  mt as K,
  jg as L,
  Te as M,
  bt as N,
  Rg as O,
  gn as P,
  Ig as Q,
  _1 as R,
  bo as S,
  Tg as T,
  qg as U,
  ra as V,
  Ep as W,
  kp as X,
  Yg as Y,
  Fg as Z,
  Y as _,
  ie as a,
  ye as a0,
  cs as a1,
  ug as a2,
  Du as a3,
  lv as a4,
  bg as a5,
  Kt as a6,
  Zg as a7,
  rg as a8,
  so as a9,
  ov as aA,
  av as aB,
  rv as aC,
  kg as aD,
  yg as aE,
  gg as aF,
  Qg as aG,
  qf as aH,
  pt as aI,
  fg as aJ,
  mg as aK,
  ev as aL,
  nv as aM,
  I0 as aN,
  i0 as aO,
  Xg as aP,
  Xd as aQ,
  wa as aR,
  sv as aS,
  Ee as aa,
  hv as ab,
  fv as ac,
  tv as ad,
  vg as ae,
  A0 as af,
  B0 as ag,
  N0 as ah,
  dg as ai,
  iv as aj,
  hg as ak,
  uv as al,
  Dr as am,
  ig as an,
  wg as ao,
  Qn as ap,
  At as aq,
  pg as ar,
  lg as as,
  cv as at,
  da as au,
  ct as av,
  Qd as aw,
  dv as ax,
  tt as ay,
  Ls as az,
  Ke as b,
  Lg as c,
  _g as d,
  Sg as e,
  Mg as f,
  zg as g,
  mo as h,
  Dg as i,
  Ng as j,
  Pg as k,
  Vg as l,
  Eg as m,
  xg as n,
  Ag as o,
  tn as p,
  Jg as q,
  Ug as r,
  Cg as s,
  Ie as t,
  wp as u,
  Gg as v,
  xp as w,
  vs as x,
  U1 as y,
  z1 as z
};
