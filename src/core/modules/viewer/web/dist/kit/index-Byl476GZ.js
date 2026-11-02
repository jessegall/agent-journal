/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as $e, createElementVNode as m, normalizeClass as X, Fragment as J, renderList as re, normalizeStyle as we, defineComponent as jo, Comment as No, h as ls, cloneVNode as Po, createBlock as K, withCtx as U, unref as V, createVNode as F, toDisplayString as M, createCommentVNode as j, inject as Fe, computed as I, resolveDynamicComponent as at, Transition as cn, watch as be, ref as W, shallowRef as un, TransitionGroup as qo, mergeProps as ft, reactive as cs, createTextVNode as fe, onMounted as je, onUnmounted as Me, nextTick as dn, useId as ga, Teleport as va, withModifiers as _e, isRef as Ss, resolveDirective as Wo, withDirectives as pt, useModel as Fn, useAttrs as ya, getCurrentInstance as Ho, mergeModels as Un, getCurrentScope as wa, onScopeDispose as ka, onBeforeUnmount as us, provide as Fo, onErrorCaptured as Uo, toHandlers as zo, createSlots as Vo, withKeys as Yt, vModelText as zn, defineAsyncComponent as Go } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Ko = { class: "skeleton-line" }, Yo = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Ko, [
      $e(t.$slots, "default", {}, void 0, !0),
      m("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(J, null, re(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: we({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Xe = /* @__PURE__ */ Y(Yo, [["__scopeId", "data-v-0ebb6933"]]), ds = jo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== No);
      return s.length !== 1 ? ls(J, { key: n }, s) : s[0].key == null ? Po(s[0], { key: n }) : s[0];
    };
  }
}), Jo = ["aria-label"], Zo = ["aria-label"], Qo = ["aria-label"], Xo = ["aria-label"], er = ["aria-label"], tr = ["aria-label"], nr = ["aria-label"], sr = {
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
    return (l, d) => (c(), K(ds, { value: e.shape }, {
      messages: U(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(J, null, re(t, (f) => m("div", {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: we({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, Jo)
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
            style: we({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, Zo)
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
            (c(), h(J, null, re(n, (v) => F(Xe, {
              key: v.id,
              bars: v.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Qo)
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
            F(Xe, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(J, null, re(a, (v) => F(Xe, {
              key: v.id,
              bars: v.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Xo)
      ]),
      page: U(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          F(Xe, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(J, null, re(e.count, (f) => (c(), K(Xe, {
            key: f,
            bars: V(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, er)
      ]),
      text: U(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(J, null, re(e.count, (f) => (c(), K(Xe, {
            key: f,
            bars: V(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, tr)
      ]),
      default: U(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(J, null, re(e.count, (f) => (c(), K(Xe, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, nr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ct = /* @__PURE__ */ Y(sr, [["__scopeId", "data-v-c687fb85"]]), ar = {
  key: 1,
  class: "empty-state titled"
}, or = { class: "empty-state-title" }, rr = { class: "empty-state-text" }, ir = {
  key: 2,
  class: "empty-state"
}, lr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), K(Ct, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", ar, [
      m("p", or, M(e.title), 1),
      m("p", rr, [
        $e(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", ir, [
      $e(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Jt = /* @__PURE__ */ Y(lr, [["__scopeId", "data-v-b27e89b0"]]), cr = { class: "fold-group" }, ur = ["aria-expanded"], dr = { class: "fold-label" }, hr = {
  key: 0,
  class: "fold-count"
}, fr = {
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
    return (s, a) => (c(), h("div", cr, [
      m("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        m("span", dr, M(e.label), 1),
        e.count !== "" ? (c(), h("span", hr, M(e.count), 1)) : j("", !0),
        m("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, ur),
      e.open ? $e(s.$slots, "default", {}, void 0, !0, 0) : j("", !0)
    ]));
  }
}, xg = /* @__PURE__ */ Y(fr, [["__scopeId", "data-v-9ef1865c"]]), pr = Symbol("open-view"), Ue = Symbol.for("journal.window-context");
function ba() {
  const e = Fe(Ue, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const mr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: we({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, gr = /* @__PURE__ */ Y(mr, [["__scopeId", "data-v-eb453d6f"]]), vr = {
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
      return t.busy || t.disabled || !!((s = Fe(Ue, null)) != null && s.readOnly);
    });
    return (s, a) => (c(), K(at(e.href ? "a" : "button"), {
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
          $e(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (c(), K(gr, {
          key: 0,
          class: "btn-spinner"
        })) : j("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ Y(vr, [["__scopeId", "data-v-a2dc4bda"]]), yr = {
  class: "running",
  "data-running-command": ""
}, wr = ["title"], kr = {
  key: "idle",
  class: "running-idle"
}, br = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", yr, [
      F(cn, {
        name: "roll",
        mode: "out-in"
      }, {
        default: U(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, M(e.text), 9, wr)) : (c(), h("span", kr, M(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, _g = /* @__PURE__ */ Y(br, [["__scopeId", "data-v-e3ee3449"]]), $r = ["aria-checked", "aria-label", "title"], xr = {
  key: 0,
  class: "switch-inner"
}, _r = {
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
        e.labelled ? (c(), h("span", xr, M(e.word), 1)) : j("", !0),
        a[1] || (a[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", _r, M(e.word), 1)) : j("", !0)
    ], 10, $r));
  }
}, Mg = /* @__PURE__ */ Y(Mr, [["__scopeId", "data-v-1bfb90f3"]]);
function $a(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function St(e, t) {
  return $a(() => localStorage, e, t);
}
function xa(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function hn(e, t) {
  return xa(() => localStorage, e, t);
}
function _a(e, t) {
  be(t, (n) => hn(e, n), { deep: !0 });
}
function Sr(e, t) {
  return $a(() => sessionStorage, e, t);
}
function Er(e, t) {
  return xa(() => sessionStorage, e, t);
}
const Zt = "journal.environment", Ma = W(Sr(Zt, St(Zt, "")));
function Ar(e) {
  Ma.value = e, Er(Zt, e), hn(Zt, e);
}
const Qt = W(location.hash), Es = un(null), As = { integrations: "mcp", library: "team" };
function Cr() {
  if (!Es.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (As[n]) {
    location.replace(`#/${[As[n], ...s].join("/")}${t ? `?${t}` : ""}`), Qt.value = location.hash;
    return;
  }
  !n || Es.value(n) || (Ar(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Qt.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Qt.value = location.hash, Cr();
});
const De = I(() => {
  const [e, t = ""] = Qt.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((i) => {
    const [r, l = ""] = i.split("@"), [d = "", f = "", v = ""] = r.split(":");
    return { table: d, id: Number(f), comment: Number(v) || 0, env: l };
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
}), fn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${fn.page(e)}?open=${t}`
};
function Or(e = "", t = 0, n = "") {
  location.hash = fn.page(e, t, n);
}
const Tr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Sa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([i]) => i !== "open" && i !== "sub").map(([i, r]) => `${i}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Tr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const bn = {};
function Ea(e, t, n = 0, s = "") {
  var i;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((i = bn[e]) != null && i.call(bn, t))) return;
  const a = De.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  Sa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Br(e, t, n, s = 0, a = "") {
  if (e === De.value.env) return Ea(t, n, s, a);
  const o = De.value.stack, i = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Sa([...i < 0 ? o : o.slice(0, i), { table: t, id: n, comment: s, env: e }], a);
}
function gt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Br(s, a, Number(o), 0, t) : Ea(a, Number(o), 0, t);
}
function Lr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ke(e) {
  const t = Lr(e);
  t && gt(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Rr = ["stroke-width", "innerHTML"], Ae = {
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
      style: we({
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
    }, null, 12, Rr));
  }
}, hs = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), K(ye, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: U(() => [
        F(Ae, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Ir = {
  key: 1,
  class: "row-list-failure"
}, Dr = ["data-row"], jr = {
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
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = W(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, i) => !e.loaded && !e.failure ? (c(), K(Ct, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Ir, M(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), K(Jt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (c(), h(J, { key: 3 }, [
      (c(), K(at(e.arrival ? qo : "ul"), ft(n.value, { class: "row-list" }), {
        default: U(() => [
          (c(!0), h(J, null, re(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            $e(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Dr))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && !s.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: i[0] || (i[0] = (r) => a(e.older))
      }, "Show more")) : j("", !0)
    ], 64));
  }
}, Nr = /* @__PURE__ */ Y(jr, [["__scopeId", "data-v-7f34ada7"]]), Pr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, qr = {
  key: 1,
  class: "agent-rows-note"
}, Wr = {
  key: 2,
  class: "agent-rows-note"
}, Hr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Fr = ["data-agent-row", "onClick"], Ur = { class: "agent-row-name" }, zr = { class: "agent-row-state" }, Vr = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = I(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Pr, [
      e.loaded ? e.failure ? (c(), h("p", qr, M(e.failure), 1)) : e.rows.length ? (c(), h(J, { key: 3 }, [
        m("p", Hr, M(s.value) + " running", 1),
        (c(!0), h(J, null, re(n.value, (i) => (c(), h("button", {
          key: i.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": i.id,
          onClick: (r) => V(gt)(`agents:${i.id}`)
        }, [
          m("span", Ur, "#" + M(i.id) + " " + M(i.session), 1),
          m("span", zr, M(i.ended_at ? "Closed" : "Running"), 1)
        ], 8, Fr))), 128))
      ], 64)) : (c(), h("p", Wr, M(e.none), 1)) : (c(), K(Ct, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Sg = /* @__PURE__ */ Y(Vr, [["__scopeId", "data-v-a01e5a17"]]), Gr = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, M(e.text), 3));
  }
}, Aa = /* @__PURE__ */ Y(Gr, [["__scopeId", "data-v-9e7e1157"]]), Kr = ["aria-valuenow", "aria-valuemax"], Yr = {
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
      m("span", {
        class: "fill",
        style: we({ width: n.value })
      }, null, 4)
    ], 10, Kr));
  }
}, Jr = /* @__PURE__ */ Y(Yr, [["__scopeId", "data-v-9eba6a85"]]), Zr = { class: "bars" }, Qr = { class: "bar-name" }, Xr = { class: "bar-value" }, ei = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => Math.max(1, ...n.items.map((i) => Number(i.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (i, r) => (c(), h("div", Zr, [
      (c(!0), h(J, null, re(e.items, (l, d) => (c(), K(at(l.open ? "button" : "div"), {
        key: `${d}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: X(["bar-row", l.tone, { opens: l.open }]),
        onClick: (f) => l.open && s("open", l.open)
      }, {
        default: U(() => [
          m("span", Qr, M(l.label), 1),
          F(Jr, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Xr, M(l.value) + M(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ti = /* @__PURE__ */ Y(ei, [["__scopeId", "data-v-663427f4"]]), ni = { class: "bars" }, si = {
  key: 0,
  class: "bars-title"
}, ai = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", ni, [
      e.node.title ? (c(), h("span", si, M(e.node.title), 1)) : j("", !0),
      F(ti, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, oi = /* @__PURE__ */ Y(ai, [["__scopeId", "data-v-7135bb11"]]), ri = {
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
      style: we(o.value)
    }, [
      (c(!0), h(J, null, re(e.node.children || [], (l, d) => (c(), K(no, {
        key: d,
        node: l,
        onOpen: r[0] || (r[0] = (f) => a("open", f)),
        onFile: r[1] || (r[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Ut = /* @__PURE__ */ Y(ri, [["__scopeId", "data-v-d142a3f4"]]), ii = {
  key: 0,
  class: "card-head"
}, li = { class: "card-title" }, ci = {
  key: 0,
  class: "card-note"
}, ui = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", ii, [
        m("span", li, M(e.node.title), 1),
        e.node.note ? (c(), h("span", ci, M(e.node.note), 1)) : j("", !0)
      ])) : j("", !0),
      F(Ut, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, di = /* @__PURE__ */ Y(ui, [["__scopeId", "data-v-67b72d40"]]), hi = (e, t, n) => Math.max(t, Math.min(n, e)), fi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, xe = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Cs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", $n = 80;
function Os(e) {
  return e.length <= $n ? e : `${e.slice(0, $n + 1).replace(/\s+\S*$/, "") || e.slice(0, $n)}…`;
}
const Ts = {
  messages: (e) => Os(Cs(e.text)),
  comments: (e) => Os(Cs(e.text)),
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
}, pi = (e) => (Ts[e.table] ? Ts[e.table](e) : e.title || "") || "", mi = ["done", "cancelled"], Vn = {
  tasks: (e) => xe(e.completed_at) || (e.state === "cancelled" ? xe(e.updated_at) : 0),
  questions: (e) => e.answer ? xe(e.updated_at) : 0,
  plans: (e) => mi.includes(e.state) ? xe(e.updated_at) : 0,
  notices: (e) => xe(e.closed_at),
  secrets: (e) => xe(e.deleted_at),
  workers: (e) => e.state === "stopped" ? xe(e.updated_at) : 0,
  shares: (e) => xe(e.stopped_at),
  dumps: (e) => xe(e.completed_at),
  agents: (e) => e.state === "ended" ? xe(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? xe(e.created_at) : 0
}, gi = (e) => Vn[e.table] ? Vn[e.table](e) : 0, Ca = (e) => gi(e) > 0, vi = (e) => !!Vn[e], Oa = (e) => xe(e.created_at), Xt = (e) => xe(e.updated_at) || Oa(e), yi = (e) => "task_ids" in e, pn = typeof document < "u" && document.documentElement.classList.contains("phone"), wi = "Files are attached on the computer; the phone sends text.", Ta = 1024, ki = Ta * 1024 * 1024, bi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ta} MB limit for one file.`;
function $i() {
  return () => {
  };
}
function Bs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function xi(e = window) {
  if (!Bs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Bs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ba = "status.summary", ve = cs({
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
}), _i = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, La = () => !!ve.countdown || _i() || ve.starting;
function Mi(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function Si(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Ei() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Ai(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Ei(), !0);
}
let Dt = { version: "", started: 0 };
function Ci(e) {
  return e.version ? (Dt.version || (Dt = { version: e.version, started: e.started || 0 }), e.version !== Dt.version || (e.started || 0) !== Dt.started) : !1;
}
function Oi(e) {
  Si(e.countdown), Mi(e.ready, e.step), (Ai(!!e.updating, e.step) || !e.updating && !Ti(e) && Ci(e)) && xi(window);
}
const Ti = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Ls = 2e4, Bi = 3e5, qe = 6e5, jt = 6, Li = 500, Ri = "/journal/summary", Rs = pn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ii = (e) => e.split("?")[0].endsWith(Ri), Ra = (e, t) => Object.assign(new Error(t), { status: e });
async function Di(e, t, n = Ra) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const ji = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Ni {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = jt;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = jt;
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
        headers: { ...Rs, ...i, ...s === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: ji(s),
        signal: AbortSignal.timeout(a || (r ? Bi : Ls))
      });
    } catch (l) {
      if (t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((d) => setTimeout(d, Li)), this.reach(t, n, s, a, o - 1, i);
    }
  }
  async send(t, n, s, a = 0, o = jt, i = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : $i(), l = await this.reach(t, n, s, a, o, i).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return Di(l, `${l.status} ${l.statusText}`).catch((d) => {
      throw d.blocked && t !== "GET" && this.refused(d.message), d;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Rs, signal: AbortSignal.timeout(Ls) });
    if (!n.ok) throw Ra(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, i = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, jt, o).then((l) => (this.written(n), l));
    if (La() && !Ii(n))
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
const Ie = new Ni(), Ee = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const wt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: i = !1 }) => [i ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), kt = "the page does not know its environment yet", Pi = "X-Journal-Env", qi = "X-Journal-Request-At", xn = "/viewer/voices/figures/";
class fs {
  constructor({ env: t = () => De.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new fs({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [qi]: String(Date.now()), ...this.env() ? { [Pi]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === kt ? Promise.reject(new Error(kt)) : Ie.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === kt ? Promise.reject(new Error(kt)) : Ie.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : kt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${Ee(this.env())}`);
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
    return this.get(f, `${t}.${wt({ before: s, after: a, since: o, ids: i, tasks: r, closed: l, docked: d })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const i = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(i, `chats/${t}.${wt({ before: s, since: a, docked: o })}`);
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
    if (pn) return Promise.reject(Object.assign(new Error(wi), { status: 403 }));
    if (s.size > ki) return Promise.reject(new Error(bi(s)));
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${Ee(s)}`);
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
    return this.get(`/agents/controls/${Ee(t)}${ue({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${Ee(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${Ee(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${wt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${wt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${wt(n)}`);
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
    return this.get(this.here(`/skills/${Ee(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${Ee(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${Ee(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return Ie.request("GET", xn + "figures.json");
  }
  voiceFigureUrl(t) {
    return xn + t;
  }
  figureDecoderUrl() {
    return xn + "draco/";
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
    return this.post(`/profiles/${Ee(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${Ee(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${Ee(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, qe);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Ee(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, qe);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Ee(t)}` : ""}${fn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ie = new fs({ base: pn ? "/p" : "" }), Wi = (e) => Ie.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Hi = { claude: "Claude Code", codex: "Codex" };
Object.entries(Hi).map(([e, t]) => ({ key: e, label: t }));
const Is = (e) => e.status === "stopped" ? 1 : 0, Fi = "main", Ui = (e) => e.filter((t) => t.role === Fi).sort((t, n) => Is(t) - Is(n) || xe(n.heard_at) - xe(t.heard_at))[0] || null, zi = { me: 1, people: [] }, z = cs({
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
  people: zi,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: St("journal.activity", !0),
  wide: !1,
  sideMini: St("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
_a("journal.activity", () => z.activity);
_a("journal.side.mini", () => z.sideMini);
const mt = I(() => Ui(z.agents));
I(() => !!mt.value && z.live.some((e) => e.agent.session === mt.value.session && e.environment === De.value.env));
I(() => !!mt.value && ["busy", "working"].includes(mt.value.status));
function Vi(e) {
  if (!e) return "";
  const t = typeof e == "string" ? Date.parse(e) / 1e3 : e, n = Math.max(0, Date.now() / 1e3 - t);
  return n < 60 ? "now" : n < 3600 ? `${Math.floor(n / 60)}m` : n < 86400 ? `${Math.floor(n / 3600)}h` : `${Math.floor(n / 86400)}d`;
}
function Ds(e) {
  const t = Vi(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Ia(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function js(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const _n = (e) => String(e).padStart(2, "0");
function Gi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${_n(t % 60)}s` : `${Math.floor(t / 3600)}h ${_n(Math.floor(t % 3600 / 60))}m ${_n(t % 60)}s`;
}
const Ki = ["working", "busy", "waiting", "compacting"], Yi = (e) => Ki.includes(e), Ji = "builder";
I(() => !z.settings || z.settings.features.file_feed !== !1);
const Zi = I(() => !z.settings || z.settings.features.status_bar !== !1);
I(() => z.settings && z.settings.workers && z.settings.workers.mode || Ji);
I(() => !z.settings || !z.settings.tasks || z.settings.tasks.auto !== !1);
I(() => !!(z.settings && z.settings.reviewing && z.settings.reviewing.reviewer));
I(() => !z.settings || z.settings.features.sharing !== !1);
const en = 50, ps = 100, Qi = { messages: 25 }, Re = (e) => Qi[e] || en;
function Xi(e, t) {
  if (e !== "messages") return Math.max(t.length - Re(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Re(e)) return s;
  return 0;
}
const el = "review_step", tl = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === el).sort((t, n) => t.id - n.id), nl = 5, sl = 500, al = 3e3, ol = () => z.entries.length ? z.entries[z.entries.length - 1].id : 0, zt = { env: "", id: 0 }, rl = () => !!(z.bar && z.bar.length) || Yi(mt.value && mt.value.status);
function il({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function ll() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: ps })))).then(tl);
}
function cl() {
  return zt.env !== ie.env() && Object.assign(zt, { env: ie.env(), id: ol() }), ie.entries(zt.id);
}
function ul(e) {
  e.length && (zt.id = e[e.length - 1].id, tc(e));
}
async function dl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", en);
}
const Gn = /* @__PURE__ */ new Map();
async function Kn(e, t) {
  const n = `${e}:${ie.env()}`, s = Gn.get(n);
  if (!s) return Ns(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(Xt)), o = s.length ? Math.min(...s.map((l) => l.id)) - 1 : 0, i = await ie.list("workers", { limit: t, since: a, after: o });
  if (!i.is_last_page)
    return Gn.delete(n), Kn(e, t);
  const r = new Set(i.rows.map((l) => l.id));
  return Ns(
    n,
    [...s.filter((l) => !r.has(l.id)), ...i.rows].sort((l, d) => l.id - d.id)
  );
}
const Ns = (e, t) => (Gn.set(e, t), t);
async function Ps(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const qs = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => rl() ? sl : al,
    take: (e) => Array.isArray(e) && (z.bar = e),
    active: () => Zi.value
  },
  "agents.index": { read: () => Ps(ie, nl), every: 1e3, take: (e) => z.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => z.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      z.summary = e, Oi(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => z.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => z.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (z.people = e) },
  "entries.recent": { read: cl, every: 1e3, take: ul },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: il, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Kn("workers.index", Re("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Kn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: ll, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Re("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: dl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Ps(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: en }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: en }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), hl = 6e4, fl = 3e3, pl = 4, ml = 300, gl = 5e3, Da = /* @__PURE__ */ new Map();
function mn(e) {
  if (!(e in qs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return qs[e];
}
function vl(e) {
  const t = mn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return gl;
  }
}
const yl = (e) => e / 2 + Math.random() * e / 2, ja = (e) => [...e.users.values()].pop(), ms = (e) => Da.get(e.place) === e, wl = () => Math.random() * ml, gs = () => document.hidden;
function kl(e) {
  const t = vl(e);
  return e.failures ? yl(Math.min(e.key === Ba ? fl : hl, t * 2 ** e.failures)) : Math.max(t, pl * e.took);
}
function Na(e, t) {
  clearTimeout(e.timer), !(!ms(e) || e.paused || gs()) && (e.timer = setTimeout(() => bl(e), t));
}
function bl(e) {
  return ms(e) ? e.running ? (e.again = !0, e.running) : (e.running = Ml(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const $l = (e) => {
  var t, n;
  return !e.paused && !gs() && (((n = (t = mn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && ja(e).active() && (!La() || e.key === Ba);
};
async function xl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Ie.attemptOnce(() => mn(e.key).read(ja(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function _l(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = mn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Ml(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      $l(e) && _l(e, await xl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ms(e) && !e.paused);
  Na(e, kl(e));
}
const Sl = () => gs() || Da.forEach((e) => Na(e, wl()));
document.addEventListener("visibilitychange", Sl);
const El = 60, Al = (e, t) => xe(e.created_at) >= xe(t.created_at) - El, Cl = (e, t) => e.id > 0 && e.table === t.table && Al(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), vs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Cl(s, n))), Mn = [
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
}), Ot = {
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
    filters: Mn
  }),
  tasks: he("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Mn
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
  notices: he("Notice", "band", "One line pinned to the chat while it matters", { filters: Mn }),
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
}, Ol = ["secrets", "plugins"], Pa = Object.keys(Ot).filter((e) => !(pn && Ol.includes(e)));
I(() => Pa.map((e) => ({ name: e, ...Ot[e] })));
const gn = (e) => Ot[e], qa = new Map(Pa.flatMap((e) => [e, e.replace(/s$/, ""), Ot[e].title.toLowerCase()].map((t) => [t, e]))), ht = (e) => qa.get(String(e).toLowerCase()) || "", Wa = [...qa.keys()].sort((e, t) => t.length - e.length).join("|"), Qe = /* @__PURE__ */ new Set(), ys = W(0), Tt = /* @__PURE__ */ new Set(), Bt = /* @__PURE__ */ new Set(), Ge = /* @__PURE__ */ new Set(), Yn = /* @__PURE__ */ new Set(), Tl = /* @__PURE__ */ new Map(), Bl = /* @__PURE__ */ new Map();
let ut = !1, bt = null;
const Ll = (e, t) => e.id - t.id, Rl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Il = { messages: Rl }, Ha = (e) => Il[e] || Ll;
function Fa(e) {
  return ys.value, Qe.has(e) || (Qe.add(e), z.booted && (!Tt.has(e) || Bt.has(e)) && queueMicrotask(() => yn([e], !1))), z.rows[e] || [];
}
function Dl(e) {
  const t = z.rows[e] || [], n = Xi(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  z.rows[e] = t.filter((a) => s.has(a) || vi(e) && !Ca(a)), z.paging.size[e] = Re(e), z.paging.more[e] = !0;
}
const jl = /* @__PURE__ */ new Set();
function Nl() {
  Qe.forEach(Dl), Qe.clear(), Tl.clear(), Bl.clear(), ys.value += 1;
}
be(() => `${De.value.env}/${De.value.page}/${De.value.open ? De.value.open.table : ""}`, Nl);
be(
  () => z.booted,
  (e) => e && yn(
    [...Qe].filter((t) => !Tt.has(t)),
    !1
  )
);
const Jn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !yi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Ua(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Jn(s) && !Jn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function za(e, t) {
  Tt.add(e), ys.value += 1;
  const n = z.rows[e] || [];
  z.rows[e] = [...Ua(n, t.rows), ...vs(n.filter((s) => s.id === 0), t.rows)], z.paging.size[e] = z.paging.size[e] || Re(e), z.paging.more[e] = !t.is_last_page;
}
async function Pl(e) {
  const t = new Set((z.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Re(e) });
  vn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = vs((z.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return za(e, { ...n, rows: [...n.rows, ...a].sort(Ha(e)) }), z.paging.size[e] = Re(e), Va.has(e) && await Ga(e), z.rows[e];
}
const vn = (e, t) => z.counts = { ...z.counts, [e]: t };
async function ql(e) {
  const t = z.rows[e] || [], n = Math.max(0, ...t.map(Xt)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await ie.list(e, { limit: Re(e), since: n, after: s });
  if (vn(e, a.counts), !a.is_last_page) return Pl(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), i = vs(t.filter((r) => !o.has(r.id)), a.rows).concat(Ua(t, a.rows));
  return z.rows[e] = i.sort(Ha(e)), z.paging.size[e] = z.rows[e].length, z.rows[e];
}
const Sn = /* @__PURE__ */ new Set();
async function Wl(e, t = !1) {
  e.forEach((n) => Bt.delete(n)), e.forEach((n) => Yn.add(n));
  try {
    await Kl(e, t);
  } finally {
    e.forEach((n) => Yn.delete(n));
  }
}
async function Hl(e) {
  const t = await ie.list(e, { limit: Re(e) });
  vn(e, t.counts), za(e, t);
}
async function Fl(e) {
  vn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Va = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ga(e) {
  const t = (z.rows[e] || []).filter((a) => Jn(a) && (e !== "plans" || !Ca(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  z.rows[e] = (z.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Ul = (e, t) => !Tt.has(e) || t && (z.paging.size[e] || Re(e)) === Re(e) && !jl.has(e);
async function zl(e, t) {
  if (!Qe.has(e)) return Fl(e);
  const n = await (Ul(e, t) ? Hl(e) : ql(e));
  return Va.has(e) && await Ga(e), n;
}
async function Vl() {
  const [e, t] = await Promise.all([ie.entries(0, ps), ie.settings()]);
  Ja([...St(Ya(), []), ...e]), JSON.stringify(t) !== JSON.stringify(z.settings) && (z.settings = t);
}
const Gl = (e, t) => zl(e, t).then(
  () => null,
  () => e
);
async function Kl(e, t) {
  const n = (await Promise.all(e.map((s) => Gl(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ge.add(s), Bt.add(s))), t && await Vl(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ka = 1e3, Yl = 15e3;
let Nt = Ka;
async function Jl() {
  return bt || (bt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ge].some((e) => !Sn.has(e)) || ut; ) {
      const e = ut, t = [...e ? Object.keys(z.rows) : Ge].filter((s) => Ot[s] && (Qe.has(s) || s in z.rows)).filter((s) => e || !Qe.has(s) || Bt.has(s) || !Tt.has(s)).filter((s) => !Sn.has(s)), n = [...Ge].filter((s) => Sn.has(s));
      Ge.clear(), n.forEach((s) => Ge.add(s)), ut = !1;
      try {
        await Wl(t, e), Nt = Ka;
      } catch {
        ut = ut || e, await new Promise((a) => setTimeout(a, Nt)), Nt = Math.min(Nt * 2, Yl);
      }
    }
  })().finally(() => bt = null), bt);
}
function yn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Yn.has(n)).forEach((n) => {
    Ge.add(n), t && Bt.add(n);
  }), Ge.has("settings") && (ut = !0), Jl();
}
const Ya = () => {
  var e;
  return `typed-entries:${((e = z.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Ja(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  z.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ps), hn(Ya(), z.entries.slice(-50));
}
const Zl = ["created", "updated", "deleted"], Ql = { phases: ["phases", "plans"] }, Zn = (e) => Ql[e] || [e], Xl = (e) => Zl.includes(e.entry_type) ? [...Zn(e.data.table), ...(e.data.joins || []).flatMap(Zn)] : [];
function ec(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of Zn(t.data.table).filter((s) => z.rows[s]))
      z.rows[n] = z.rows[n].filter((s) => s.id !== t.data.id);
}
function tc(e) {
  Ja([...z.entries, ...e]), ec(e), yn([...new Set(e.flatMap(Xl))].filter((t) => t && t !== "agents"));
}
Wi((e) => z.streamOpen || yn([e]));
const Qn = [], nc = 2e3, Ve = /* @__PURE__ */ new Map(), sc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, ac = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ot(e, { first: t = !1 } = {}) {
  t ? Qn.unshift(e) : Qn.push(e), Ve.clear();
}
function Za(e, t, n) {
  var a;
  const s = Fa(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const oc = (e) => Fa(e.table).find((t) => t.id === e.id) === e.row, rc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function He(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function ic(e, t) {
  const n = [{ kind: "text", text: He(e).replace(/\r\n/g, `
`) }];
  for (const s of Qn)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const i = s(o.text, t);
      typeof i == "string" ? o.text = i : i && n.splice(a, 1, ...i);
    }
  return n;
}
function Et(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return lc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function lc(e) {
  return e.split(ac).map((t, n) => n % 2 ? t : t.replace(sc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ws(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function cc(e) {
  const [t, , ...n] = e, s = Ws(t).map((o) => `<th>${Et(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Ws(o).map((i) => `<td>${Et(i)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function uc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Et(a)}</li>`).join("")}</${s}>`;
}
const Hs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Qa(e) {
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
      n.push(`<h${r}>${Et(o[2])}</h${r}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Hs(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(cc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(uc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Qa(
          t.slice(s, r).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let i = s;
    for (; i < t.length && t[i].trim() && !Hs(t, i) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[i]); )
      i += 1;
    n.push(`<p>${Et(t.slice(s, i).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = i;
  }
  return n.join("");
}
const dc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, hc = (e) => e.kind !== "text" && !dc.test(e.html);
function fc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Qa(s).replace(/\u0001(\d+)\u0001/g, (o, i) => t[Number(i)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : hc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Vt(e, t = { env: "" }) {
  const n = rc(e, t), s = Ve.get(n);
  if (Ve.delete(n), s && s.reads.every(oc))
    return Ve.set(n, s), s.html;
  const a = [], o = fc(ic(e, { ...t, reads: a }));
  return Ve.set(n, { html: o, reads: a }), Ve.size > nc && Ve.delete(Ve.keys().next().value), o;
}
const Xa = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, tn = (e) => String(e || "").replace(Xa, (t, n, s, a) => a), pc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Pt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, mc = /^Traceback \(most recent call last\):/m, gc = 8;
function eo(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, gc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function vc(e) {
  const t = [...e.matchAll(pc)].map((s) => s.index);
  if (Pt.lastIndex = 0, !t.length || !Pt.test(e)) return null;
  Pt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), i = [...o.matchAll(Pt)];
    return { head: i.length ? o.slice(0, i[0].index).trim() : o, frames: i.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: eo(n), tail: "" } : null;
}
function yc(e) {
  const t = mc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: eo([o]), tail: n.slice(a).join(`
`) };
}
ot((e) => {
  const t = tn(e), n = yc(t) || vc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Xn = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", wc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", kc = `${Xn} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, bc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", $c = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Fs = {
  js: { keywords: Xn, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: wc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: kc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Xn, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: bc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: $c, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Us(e, t, n) {
  return n && e.startsWith(n, t);
}
function xc(e, t) {
  const n = Fs[t] || Fs.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Us(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      i("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && Us(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], v = n.lower ? f.toLowerCase() : f, _ = n.property && /^\s*:/.test(e.slice(o + f.length));
      i(s.has(v) ? "keyword" : _ ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function _c(e, t) {
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
const Sc = 1500, zs = /* @__PURE__ */ new WeakMap();
async function Ec(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Mc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(zs.get(t)), zs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Sc)
  )));
}
typeof document < "u" && document.addEventListener("click", Ec, !0);
const Ac = /^(```|~~~)\s*(\w+)?\s*$/, Vs = /^\s{4,}\S/, Cc = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Oc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function to(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Tc(e) {
  const t = to(e.join(`
`));
  return (Oc.find(([, n]) => n.test(t)) || ["text"])[0];
}
function Gs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${_c(to(e.join(`
`)), t || Tc(e)).join(`
`)}</code></pre></div>` };
}
function Bc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const i = t[o].match(Ac);
    if (i) {
      const r = t.findIndex((d, f) => f > o && d.trim().startsWith(i[1])), l = r < 0 ? t.length : r;
      a(), n.push(Gs(t.slice(o + 1, l).map(tn), i[2] ? i[2].toLowerCase() : "")), o = l + 1;
      continue;
    }
    if (Vs.test(t[o])) {
      let r = o;
      for (; r < t.length && (Vs.test(t[r]) || !t[r].trim()); ) r += 1;
      for (; r > o && !t[r - 1].trim(); ) r -= 1;
      const l = [];
      for (; s.length && s[s.length - 1].trim() && Cc.test(s[s.length - 1].trim()); ) l.unshift(s.pop());
      if (r - o + l.length >= 2) {
        a(), n.push(Gs([...l, ...t.slice(o, r)].map(tn), "")), o = r;
        continue;
      }
      s.push(...l);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ot((e) => Bc(e));
const Lc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Rc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Ic(e) {
  const t = Lc.exec(e);
  if (t && ht(t[1])) return { at: t.index, length: t[0].length, table: ht(t[1]), id: Number(t[2]), label: t[3] };
  const n = Rc.exec(e), s = n && ht(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Dc(e, t, n, s) {
  const a = Za(s, e, t), o = tn(a ? pi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${He(gn(e).title)} ${t}</span><span class="row-card-title">${He(o)}</span></a>`;
}
ot(
  (e, t) => {
    const n = Ic(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Dc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const jc = /\.(png|jpe?g|gif|webp|svg)$/i, Nc = (e) => jc.test(e), Pc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, qc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Wc(e, t) {
  const n = Pc.exec(e), [, s, a, o, i, r] = n || [], l = n && ht(s || o), d = l && Za(t, l, Number(a || i));
  if (!d || !(d.files || []).includes(r)) return null;
  const f = ie.in(t.env).fileUrl(l, d.id, r), v = `${gn(l).title} ${d.id} · ${He(r)}`, _ = Nc(r) ? `<img class="file-card-image" src="${f}" alt="${He(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${He(r)}">${_}<span class="file-card-name">${v}</span></a>` };
}
function Hc(e) {
  const t = qc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${He(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ot(
  (e, t) => {
    if (t.inline) return null;
    const n = Wc(e, t) || Hc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Fc = /`([^`\n]+)`/g;
ot((e) => e.replace(Fc, (t, n) => `<code>${n}</code>`));
const Ks = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${fn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ot(
  (e, t) => e.replace(Xa, (n, s, a, o) => Ks[s] ? Ks[s](a, o, t) : o)
);
const Uc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, zc = new RegExp(`\\b(${Wa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Vc = new RegExp(`\\b(${Wa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Gc = (e, t) => `<a class="row-pill" href="#" data-peek="${ht(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Kc = (e) => e.replace(Vc, (t, n, s) => s.replace(/\d+/g, (a) => Gc(n.replace(/s$/i, ""), a))), Yc = (e) => Kc(e).replace(
  zc,
  (t, n, s, a = "", o) => {
    const i = s || o;
    return `<a class="row-pill" href="#" data-peek="${ht(n)}:${i}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${i}${a ? `:${a}` : ""}</span></a>`;
  }
);
ot(
  (e, t) => t.rowNames === !1 ? e : e.split(Uc).map((n, s) => s % 2 ? n : Yc(n)).join("")
);
const Jc = ["innerHTML"], Zc = ["innerHTML"], Qc = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Vt(s, { env: De.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => V(Ke) && V(Ke)(...o)),
      innerHTML: n.value
    }, null, 8, Jc)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => V(Ke) && V(Ke)(...o)),
      innerHTML: n.value
    }, null, 8, Zc));
  }
}, dt = /* @__PURE__ */ Y(Qc, [["__scopeId", "data-v-30fd9c25"]]), Xc = { class: "fact" }, eu = { class: "fact-label" }, tu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Xc, [
      m("span", eu, M(e.label), 1),
      F(dt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, nu = /* @__PURE__ */ Y(tu, [["__scopeId", "data-v-3a88ecf8"]]), su = { class: "list" }, au = { class: "list-label" }, ou = {
  key: 1,
  class: "list-note"
}, ru = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", su, [
      (c(!0), h(J, null, re(e.items, (o, i) => (c(), K(at(o.open ? "button" : "div"), {
        key: i,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: U(() => [
          m("span", au, M(o.label), 1),
          o.badge ? (c(), K(Aa, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : j("", !0),
          o.note ? (c(), h("span", ou, M(o.note), 1)) : j("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, iu = /* @__PURE__ */ Y(ru, [["__scopeId", "data-v-ebe2ae0a"]]), lu = { class: "table" }, cu = {
  key: 0,
  class: "table-row empty"
}, uu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, i) => (c(), h("div", lu, [
      m("div", {
        class: "table-row head",
        style: we(a.value)
      }, [
        (c(!0), h(J, null, re(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, M(r), 1))), 128))
      ], 4),
      (c(!0), h(J, null, re(e.rows, (r, l) => (c(), K(at(r.open ? "button" : "div"), {
        key: l,
        type: r.open ? "button" : void 0,
        class: X(["table-row", r.tone, { opens: r.open }]),
        style: we(a.value),
        onClick: (d) => r.open && s("open", r.open)
      }, {
        default: U(() => [
          (c(!0), h(J, null, re(r.cells, (d, f) => (c(), h("span", {
            key: f,
            class: "cell"
          }, M(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", cu, M(e.empty), 1)) : j("", !0)
    ]));
  }
}, du = /* @__PURE__ */ Y(uu, [["__scopeId", "data-v-9326a52e"]]), hu = { class: "stat-value" }, fu = { class: "stat-label" }, pu = {
  key: 0,
  class: "stat-note"
}, mu = {
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
    return (s, a) => (c(), K(at(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: U(() => [
        m("span", hu, M(e.value), 1),
        m("span", fu, M(e.label), 1),
        e.note ? (c(), h("span", pu, M(e.note), 1)) : j("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, gu = /* @__PURE__ */ Y(mu, [["__scopeId", "data-v-ad0db6d6"]]), vu = { class: "code" }, yu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, i) => (c(), K(ds, {
      value: e.node.type
    }, {
      stack: U(() => [
        F(Ut, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: U(() => [
        F(Ut, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: U(() => [
        F(Ut, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: U(() => [
        F(di, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: U(() => [
        m("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, M(e.node.text), 3)
      ]),
      divider: U(() => [...i[2] || (i[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: U(() => [
        F(gu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: i[0] || (i[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: U(() => [
        F(oi, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: U(() => [
        F(du, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: U(() => [
        F(iu, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: U(() => [
        F(dt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: U(() => [
        F(nu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: U(() => [
        F(Aa, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: U(() => [
        m("pre", vu, [
          m("code", null, M(e.node.text), 1)
        ])
      ]),
      file: U(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: i[1] || (i[1] = (r) => a(e.node))
        }, M(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), no = /* @__PURE__ */ Y(yu, [["__scopeId", "data-v-cbdcf540"]]), wu = { class: "dashboard" }, ku = { class: "trail" }, bu = ["onClick"], $u = {
  key: 0,
  class: "gone",
  role: "status"
}, xu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (_) => _ in (n.document.pages || {}), o = W(!!n.page && !a(n.page)), i = W(n.page && !o.value ? [n.page] : []), r = I(() => i.value.at(-1) || n.document.start), l = I(() => (n.document.pages || {})[r.value] || null), d = (_) => ((n.document.pages || {})[_] || {}).title || _, f = (_) => {
      o.value = !1, i.value = [...i.value, _];
    }, v = (_) => {
      o.value = !1, i.value = i.value.slice(0, _);
    };
    return be(
      () => n.document.start,
      () => i.value = []
    ), (_, S) => (c(), h("div", wu, [
      e.document.broken ? (c(), K(Jt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: U(() => [
          fe(M(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), K(Jt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: U(() => [
          fe(M(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(J, { key: 2 }, [
        m("nav", ku, [
          m("button", {
            type: "button",
            class: X(["step", { current: !i.value.length }]),
            onClick: S[0] || (S[0] = (L) => v(0))
          }, M(d(e.document.start)), 3),
          (c(!0), h(J, null, re(i.value, (L, $) => (c(), h(J, {
            key: `${$}-${L}`
          }, [
            S[2] || (S[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: X(["step", { current: $ === i.value.length - 1 }]),
              onClick: (y) => v($ + 1)
            }, M(d(L)), 11, bu)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", $u, "What you opened is no longer in this dashboard. Here is its start page.")) : j("", !0),
        F(cn, {
          name: "page",
          mode: "out-in"
        }, {
          default: U(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              F(no, {
                node: l.value.view,
                onOpen: f,
                onFile: S[1] || (S[1] = (L) => s("file", L))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : j("", !0)
    ]));
  }
}, Eg = /* @__PURE__ */ Y(xu, [["__scopeId", "data-v-fbe83734"]]);
function _u(e, t, n, s = () => window) {
  je(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Me(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Mu = (e, t = () => !0) => _u("keydown", (n) => n.key === "Escape" && t() && e());
function Su(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = W(!1), a = I(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Mu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Eu = 80, lt = cs([]);
function Au(e) {
  const t = Symbol("layer"), n = () => lt.includes(t) && lt.splice(lt.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !lt.includes(t) && lt.push(t), s || n();
    },
    { immediate: !0 }
  ), Me(n), I(() => Eu + Math.max(0, lt.indexOf(t)));
}
let so = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return so = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Cu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Ou(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const i = [...e.value.querySelectorAll(Cu)];
    if (!i.length) return o.preventDefault();
    const [r, l] = [i[0], i.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  je(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : so, document.addEventListener("keydown", a), dn(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Me(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Tu = ["aria-modal", "aria-label", "aria-labelledby"], Bu = {
  key: 0,
  class: "dialog-head"
}, Lu = ["id", "tabindex"], Ru = {
  key: 1,
  class: "dialog-foot"
}, Iu = 500, Du = 400, ju = {
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
    const n = e, s = t, { visible: a, close: o, closed: i } = Su(s, n), r = Au(a), l = W(null), d = W(null), f = W(null), v = ga(), _ = W(!1), S = Date.now();
    n.modal && Ou(d, () => s("escape"), f);
    function L() {
      if (!n.modal) return n.closable && o();
      _.value = !0, setTimeout(() => _.value = !1, Du);
    }
    function $(N) {
      !n.modal || Date.now() - S >= Iu || ![" ", "Enter"].includes(N.key) || (N.preventDefault(), N.stopPropagation());
    }
    const y = () => l.value && (l.value.scrollTop = l.value.scrollHeight), C = new MutationObserver(y);
    return be(l, (N) => {
      C.disconnect(), N && n.follow && (C.observe(N, { childList: !0, subtree: !0, characterData: !0 }), y());
    }), Me(() => C.disconnect()), (N, Z) => (c(), K(va, { to: "body" }, [
      F(cn, {
        name: "dialog",
        appear: "",
        onAfterLeave: V(i)
      }, {
        default: U(() => [
          V(a) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: we({ zIndex: V(r) }),
            onClick: _e(L, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: d,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: _.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? V(v) : void 0,
              onKeydownCapture: $
            }, [
              e.bare ? j("", !0) : (c(), h("header", Bu, [
                m("h3", {
                  id: V(v),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, M(e.title), 9, Lu),
                e.closable ? (c(), K(hs, {
                  key: 0,
                  onClick: V(o)
                }, null, 8, ["onClick"])) : j("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: l,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                $e(N.$slots, "default", {}, void 0, !0)
              ], 2),
              N.$slots.foot ? (c(), h("footer", Ru, [
                $e(N.$slots, "foot", {}, void 0, !0)
              ])) : j("", !0)
            ], 42, Tu)
          ], 6)) : j("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Nu = /* @__PURE__ */ Y(ju, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Le = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Pu = 6;
function ws(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const qu = (e) => {
  const t = ws(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
  return { name: e, lines: t, line: ze.line, padY: ze.padY, width: n, height: t.length * ze.line + ze.padY * 2 };
};
function Wu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (i) => {
    a.set(i, "open"), t.forEach((r, l) => {
      if (r[0] !== i) return;
      const d = a.get(r[1]);
      d === "open" ? s.add(l) : d || o(r[1]);
    }), a.set(i, "done");
  };
  return [...n, ...e].forEach((i) => a.has(i) || o(i)), s;
}
function Hu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, i]) => {
      n.get(i) < n.get(o) + 1 && (n.set(i, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Fu(e, t, n) {
  const s = [];
  e.forEach((i) => {
    var r;
    return (s[r = n.get(i)] || (s[r] = [])).push(i);
  });
  const a = () => new Map(s.flatMap((i) => i.map((r, l) => [r, l]))), o = (i, r) => {
    const l = a(), d = (f) => {
      const v = r(f).map((_) => l.get(_));
      return v.length ? v.reduce((_, S) => _ + S, 0) / v.length : l.get(f);
    };
    return [...i].sort((f, v) => d(f) - d(v));
  };
  for (let i = 0; i < Pu; i++) {
    const r = i % 2 === 0, l = s.map((d, f) => f);
    (r ? l.slice(1) : l.slice(0, -1).reverse()).forEach((d) => {
      const f = (v) => t.filter((_) => _[r ? 1 : 0] === v).map((_) => _[r ? 0 : 1]);
      s[d] = o(s[d], f);
    });
  }
  return s;
}
function Uu(e, t) {
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
function zu(e) {
  const t = [...new Set(e.flatMap(([O, E]) => [O, E]))], n = new Set(e.map(([, O]) => O)), s = t.filter((O) => !n.has(O)), a = Wu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((O, E) => !a.has(E)), i = Hu(t, o), r = Fu(t, o, i), l = new Map(t.map((O) => [O, qu(O)])), d = r.map((O) => O.reduce((E, H) => E + l.get(H).width, 0) + Be.across * (O.length - 1)), f = Math.max(...d) + Be.margin * 2, v = Gu(e, i, r.length), _ = /* @__PURE__ */ new Map();
  let S = Be.margin;
  r.forEach((O, E) => {
    let H = (f - d[E]) / 2;
    const k = Math.max(...O.map((g) => l.get(g).height));
    O.forEach((g) => {
      const b = l.get(g);
      _.set(g, { ...b, x: H, y: S + (k - b.height) / 2 }), H += b.width + Be.across;
    }), S += k + (v[E] ?? Be.down);
  });
  const L = e.map(([O, E, H], k) => ({ from: O, to: E, label: H || "", back: a.has(k) || i.get(E) <= i.get(O) }));
  Uu(L, _);
  const $ = L.map((O) => Ku(O, _.get(O.from), _.get(O.to))), y = [..._.values()], C = Qu($, y), N = Math.max(S - Be.down, ...C.filter((O) => O.label).map((O) => O.label.y + O.label.height));
  return { width: Math.max(f - Be.margin, ...C.filter((O) => O.label).map((O) => O.label.x + O.label.width)) + Be.margin, height: N + Be.margin, nodes: y, arrows: C };
}
const Vu = (e) => e ? ws(e, Le.lineChars).length * Le.line + Le.pad * 2 : 0;
function Gu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, i]) => {
    const [r, l] = [t.get(a), t.get(o)].sort((d, f) => d - f);
    l > r && (s[r + Math.floor((l - r - 1) / 2)] += Vu(i) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function Ku(e, t, n) {
  const s = e.label ? ws(e.label, Le.lineChars) : [], a = s.length ? Math.max(...s.map((_) => _.length)) * Le.charWidth + Le.pad * 2 : 0, o = s.length * Le.line + (s.length ? Le.pad * 2 : 0), i = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, f = (d - r) / 2, v = [{ x: i, y: r }, { x: i, y: r + f }, { x: l, y: d - f }, { x: l, y: d }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: v, path: `M${i} ${r} C${i} ${r + f} ${l} ${d - f} ${l} ${d}` };
}
const Yu = ([e, t, n, s], a) => {
  const o = 1 - a, i = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: i("x"), y: i("y") };
}, Ju = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Zu = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Le.line);
function Qu(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: i }) => ({ x: s, y: a, width: o, height: i }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, d) => {
      const f = Yu(s.curve, l);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + d, width: s.labelWidth, height: s.labelHeight };
    }, r = Zu.flatMap((l) => Ju.map((d) => a(d, l))).find((l) => !n.some((d) => Ys(l, d))) ?? a(0.5, 0);
    for (; n.some((l) => Ys(r, l)); ) r.y += Le.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: Le.line, pad: Le.pad } };
  });
}
const Ys = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Xu = { class: "flowchart-tools" }, ed = ["width", "height", "viewBox", "aria-label"], td = ["d"], nd = ["x", "y", "width", "height"], sd = ["x", "y"], ad = ["x", "dy"], od = {
  key: 0,
  class: "flowchart-label"
}, rd = ["x", "y", "width", "height"], id = ["x", "y"], ld = ["x", "dy"], cd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => zu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, i = W(null), r = W({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function d() {
      var C;
      const $ = (C = i.value) == null ? void 0 : C.getBoundingClientRect();
      if (!($ != null && $.width)) return;
      const y = Math.min($.width / a.value.width, $.height / a.value.height, 1.5);
      r.value = { zoom: y, x: ($.width - a.value.width * y) / 2, y: ($.height - a.value.height * y) / 2 };
    }
    function f($, y, C) {
      const { zoom: N, x: Z, y: O } = r.value, E = Math.min(o.most, Math.max(o.least, N * $));
      r.value = { zoom: E, x: y - (y - Z) * E / N, y: C - (C - O) * E / N };
    }
    function v($) {
      const y = i.value.getBoundingClientRect();
      f($, y.width / 2, y.height / 2);
    }
    function _($) {
      const y = i.value.getBoundingClientRect();
      $.ctrlKey || $.metaKey ? f($.deltaY < 0 ? o.step : 1 / o.step, $.clientX - y.left, $.clientY - y.top) : r.value = { ...r.value, x: r.value.x - $.deltaX, y: r.value.y - $.deltaY };
    }
    function S($) {
      var y, C, N;
      $.preventDefault(), (y = window.getSelection()) == null || y.removeAllRanges(), l = { x: $.clientX - r.value.x, y: $.clientY - r.value.y }, (N = (C = i.value).setPointerCapture) == null || N.call(C, $.pointerId);
    }
    function L($) {
      l && (r.value = { ...r.value, x: $.clientX - l.x, y: $.clientY - l.y });
    }
    return je(d), ($, y) => (c(), K(Nu, {
      title: e.title,
      large: "",
      onClose: y[4] || (y[4] = (C) => s("close"))
    }, {
      default: U(() => [
        m("div", Xu, [
          F(ye, {
            small: "",
            onClick: y[0] || (y[0] = (C) => v(o.step))
          }, {
            default: U(() => [...y[5] || (y[5] = [
              fe("Zoom in", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            small: "",
            onClick: y[1] || (y[1] = (C) => v(1 / o.step))
          }, {
            default: U(() => [...y[6] || (y[6] = [
              fe("Zoom out", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            small: "",
            onClick: d
          }, {
            default: U(() => [...y[7] || (y[7] = [
              fe("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: i,
          class: "flowchart-frame",
          onWheel: _e(_, ["prevent"]),
          onPointerdown: S,
          onPointermove: L,
          onPointerup: y[2] || (y[2] = (C) => Ss(l) ? l.value = null : l = null),
          onPointercancel: y[3] || (y[3] = (C) => Ss(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: we({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            y[8] || (y[8] = m("defs", null, [
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
            (c(!0), h(J, null, re(a.value.arrows, (C, N) => (c(), h("path", {
              key: `arrow-${N}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, td))), 128)),
            (c(!0), h(J, null, re(a.value.nodes, (C) => (c(), h("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, nd),
              m("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (c(!0), h(J, null, re(C.lines, (N, Z) => (c(), h("tspan", {
                  key: Z,
                  x: C.x + C.width / 2,
                  dy: Z ? C.line : 0
                }, M(N), 9, ad))), 128))
              ], 8, sd)
            ]))), 128)),
            (c(!0), h(J, null, re(a.value.arrows, (C, N) => (c(), h(J, {
              key: `label-${N}`
            }, [
              C.label ? (c(), h("g", od, [
                m("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, rd),
                m("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (c(!0), h(J, null, re(C.label.lines, (Z, O) => (c(), h("tspan", {
                    key: O,
                    x: C.label.x + C.label.width / 2,
                    dy: O ? C.label.line : 0
                  }, M(Z), 9, ld))), 128))
                ], 8, id)
              ])) : j("", !0)
            ], 64))), 128))
          ], 12, ed))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ud = /* @__PURE__ */ Y(cd, [["__scopeId", "data-v-51d24cfe"]]), dd = ["title", "aria-label"], hd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, fd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, pd = {
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
      (c(), h("svg", hd, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", fd)) : j("", !0)
      ]))
    ], 10, dd));
  }
}, md = /* @__PURE__ */ Y(pd, [["__scopeId", "data-v-6dc92808"]]), gd = "img,pre,table";
function vd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function yd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function wd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(gd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = vd(yd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function kd(e, t) {
  let n = null;
  const s = () => e.value && wd(e.value);
  je(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Me(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const bd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function $d(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const xd = ["data-from", "data-ref"], _d = { class: "message-body" }, Md = ["innerHTML"], Sd = ["innerHTML"], Ed = {
  class: "message-faces",
  "data-message-faces": ""
}, Ad = ["title", "data-face", "onClick"], Cd = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Od = ["title", "data-reaction", "onClick"], Td = {
  key: 0,
  class: "message-reaction-count"
}, Bd = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Ld = ["href", "title"], Rd = ["src", "alt"], Id = ["href"], Dd = ["innerHTML"], jd = { class: "message-foot" }, Nd = { class: "message-time" }, Pd = 1500, qd = "An earlier message", Wd = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(!1), o = W(null), i = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => i.value && !n.message.read_at && !n.message.local);
    async function l() {
      var w;
      await ((w = navigator.clipboard) == null ? void 0 : w.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Pd);
    }
    const d = I(() => Vt(n.message.text ?? "", { env: "" })), f = I(() => JSON.parse(n.message.flowchart_edges || "[]")), v = W(!1), _ = I(() => Vt(n.quote || qd, { env: "" }));
    function S() {
      const w = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      w ? w.scrollIntoView({ block: "center", behavior: "smooth" }) : gt(`messages:${n.message.parent_id}`);
    }
    kd(o, () => `${n.message.text} ${n.quote}`);
    const L = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, $ = (w) => `/api/files/message/${n.message.id}/${encodeURIComponent(w)}`, y = I(() => JSON.parse(n.message.captions || "{}")), C = I(() => (n.message.files ?? []).map((w) => ({ name: w, address: $(w), isImage: L.test(w), title: y.value[w] || w }))), N = I(() => Ia(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), Z = Fe(Ue, null), O = W([]), E = I(() => O.value.length ? Vt(`Linked ${O.value.join(", ")}`, { env: "" }) : "");
    async function H() {
      if (!i.value || !(Z != null && Z.read) || n.message.local) return;
      const w = await Z.read(`link list --source message:${n.message.id}`);
      w.ok && (O.value = (w.value.rows ?? w.value ?? []).map((p) => `${p.target_model} ${p.target_id}`));
    }
    H();
    const k = W(!1), g = I(() => $d(n.message.reactions));
    function b(w) {
      k.value = !1, s("react", n.message, w);
    }
    return (w, p) => (c(), h("article", {
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": i.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", _d, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: "message-card md",
          onClick: p[2] || (p[2] = (...u) => V(Ke) && V(Ke)(...u))
        }, [
          e.message.parent_id ? (c(), h("div", {
            key: 0,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: _e(S, ["stop"]),
            innerHTML: _.value
          }, null, 8, Md)) : j("", !0),
          m("div", { innerHTML: d.value }, null, 8, Sd),
          f.value.length ? (c(), h(J, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: p[0] || (p[0] = (u) => v.value = !0)
            }, "Open the flowchart"),
            v.value ? (c(), K(ud, {
              key: 0,
              title: e.message.text,
              edges: f.value,
              onClose: p[1] || (p[1] = (u) => v.value = !1)
            }, null, 8, ["title", "edges"])) : j("", !0)
          ], 64)) : j("", !0)
        ], 512),
        m("div", {
          class: X(["message-tools", { picking: k.value }]),
          "data-message-tools": ""
        }, [
          k.value ? (c(), h(J, { key: 0 }, [
            m("div", Ed, [
              (c(!0), h(J, null, re(V(bd), (u) => (c(), h("button", {
                key: u,
                type: "button",
                class: "message-face",
                title: `React ${u}`,
                "data-face": u,
                onClick: (A) => b(u)
              }, M(u), 9, Ad))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: p[3] || (p[3] = (u) => k.value = !1)
            }, [
              F(Ae, {
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
              onClick: p[4] || (p[4] = (u) => k.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: p[5] || (p[5] = (u) => s("reply", e.message))
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
              onClick: p[6] || (p[6] = (u) => s("delete", e.message))
            }, "Delete")) : j("", !0)
          ], 64))
        ], 2)
      ]),
      g.value.length ? (c(), h("div", Cd, [
        (c(!0), h(J, null, re(g.value, (u) => (c(), h("button", {
          key: u.emoji,
          type: "button",
          class: X(["message-reaction", { mine: u.mine }]),
          title: u.title,
          "data-reaction": u.emoji,
          onClick: (A) => s("react", e.message, u.emoji)
        }, [
          fe(M(u.emoji) + " ", 1),
          u.count > 1 ? (c(), h("span", Td, M(u.count), 1)) : j("", !0)
        ], 10, Od))), 128))
      ])) : j("", !0),
      C.value.length ? (c(), h("div", Bd, [
        (c(!0), h(J, null, re(C.value, (u) => (c(), h(J, {
          key: u.name
        }, [
          u.isImage ? (c(), h("a", {
            key: 0,
            href: u.address,
            target: "_blank",
            class: "message-image",
            title: u.title
          }, [
            m("img", {
              src: u.address,
              alt: u.name
            }, null, 8, Rd)
          ], 8, Ld)) : (c(), h("a", {
            key: 1,
            href: u.address,
            target: "_blank",
            class: "message-file"
          }, M(u.name), 9, Id))
        ], 64))), 128))
      ])) : j("", !0),
      E.value ? (c(), h("div", {
        key: 2,
        class: "message-links md",
        "data-message-links": "",
        onClick: p[7] || (p[7] = (...u) => V(Ke) && V(Ke)(...u)),
        innerHTML: E.value
      }, null, 8, Dd)) : j("", !0),
      m("div", jd, [
        m("time", Nd, M(N.value), 1),
        i.value ? (c(), K(md, {
          key: 0,
          message: e.message
        }, null, 8, ["message"])) : j("", !0)
      ])
    ], 8, xd));
  }
}, Ag = /* @__PURE__ */ Y(Wd, [["__scopeId", "data-v-34d4fb65"]]), Hd = ["aria-label"], En = 200, Fd = 300, Js = 400, Ud = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: En } },
  setup(e) {
    const t = e, n = I(() => t.value < En ? [1, 0.25, 0.25] : t.value === En ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, a) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: e.value >= Js, high: e.value >= Fd && e.value < Js }]),
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
        style: we({ opacity: n.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: we({ opacity: n.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: we({ opacity: n.value[2] })
      }, null, 4)
    ], 10, Hd));
  }
}, Cg = /* @__PURE__ */ Y(Ud, [["__scopeId", "data-v-89404405"]]), ao = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Og = (e) => {
  var t;
  return ((t = ao.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Zs = {
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
}, zd = ["innerHTML"], Vd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => Zs[t.name] || Zs.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, zd));
  }
}, st = /* @__PURE__ */ Y(Vd, [["__scopeId", "data-v-beb5935c"]]), Gd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      F(st, { name: "fold" })
    ], 2));
  }
}, nn = /* @__PURE__ */ Y(Gd, [["__scopeId", "data-v-d03899bb"]]), Kd = ["aria-checked", "aria-haspopup", "onClick"], Yd = {
  key: 0,
  class: "segmented-dot"
}, Jd = {
  key: 1,
  class: "segmented-count"
}, Zd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ga();
    return (a, o) => {
      const i = Wo("tip");
      return c(), h("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(J, null, re(e.options, (r) => pt((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: X(["segmented-option", { on: r.key === e.value }]),
          onClick: (l) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", Yd)) : j("", !0),
          fe(" " + M(r.label) + " ", 1),
          r.count !== void 0 ? (c(), h("em", Jd, M(r.count), 1)) : j("", !0)
        ], 10, Kd)), [
          [i, r.tip || r.title, `${V(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, es = /* @__PURE__ */ Y(Zd, [["__scopeId", "data-v-ca953072"]]), Qs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Qd = {
  key: 1,
  class: "text-field-label"
}, Xd = {
  key: 2,
  class: "text-field-end"
}, eh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Un({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Fn(e, "modelValue"), s = ya(), a = "onUpdate:modelValue" in (((f = Ho()) == null ? void 0 : f.vnode.props) || {}), o = I(() => a ? n.value : s.value), i = (v) => a && (n.value = v.target.value), r = I(
      () => Object.fromEntries(Object.entries(s).filter(([v]) => v !== "class" && v !== "style" && v !== "value"))
    ), l = I(() => Object.fromEntries(Object.entries(s).filter(([v]) => v !== "value"))), d = W(null);
    return t({ focus: () => d.value && d.value.focus() }), (v, _) => e.label || e.icon || v.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: v.$slots.end }, V(s).class]),
      style: we(V(s).style)
    }, [
      e.icon ? (c(), K(Ae, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : j("", !0),
      e.label ? (c(), h("span", Qd, M(e.label), 1)) : j("", !0),
      pt(m("input", ft({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: i }), null, 16), [
        [V(Qs), o.value]
      ]),
      v.$slots.end ? (c(), h("span", Xd, [
        $e(v.$slots, "end", {}, void 0, !0)
      ])) : j("", !0)
    ], 6)) : pt((c(), h("input", ft({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: i }), null, 16)), [
      [V(Qs), o.value]
    ]);
  }
}), th = /* @__PURE__ */ Y(eh, [["__scopeId", "data-v-d9c38ca8"]]);
function nh(e, t, { incremental: n = !1 } = {}) {
  const s = ba(), a = W([]), o = W(""), i = W(!1), r = W(""), l = W(null);
  async function d($) {
    const y = await s.read(`${e} --before-id ${$ + 1} --limit 1`);
    if (!y.ok) return S();
    const C = y.value.rows.find((N) => N.id === $);
    a.value = C ? a.value.map((N) => N.id === $ ? C : N) : a.value.filter((N) => N.id !== $);
  }
  async function f($) {
    if (n && String(($ == null ? void 0 : $.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((O) => O.id !== $.row_id));
    if (n && ($ != null && $.row_id) && !String($.event ?? "").endsWith(".create") && a.value.some((O) => O.id === $.row_id)) return d($.row_id);
    if (!(n && a.value.length && String(($ == null ? void 0 : $.event) ?? "").endsWith(".create"))) return S();
    const C = Math.max(...a.value.map((O) => O.id)), N = await s.read(`${e} --after-id ${C}`);
    if (!N.ok) return S();
    const Z = new Set(a.value.map((O) => O.id));
    a.value = [...N.value.rows.filter((O) => !Z.has(O.id)), ...a.value];
  }
  async function v() {
    if (!a.value.length) return !1;
    const $ = Math.min(...a.value.map((N) => N.id)), y = await s.read(`${e} --before-id ${$}`);
    if (!y.ok || !y.value.rows.length) return !1;
    const C = new Set(a.value.map((N) => N.id));
    return a.value = [...a.value, ...y.value.rows.filter((N) => !C.has(N.id))], !0;
  }
  let _ = 0;
  async function S() {
    const $ = ++_, y = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if ($ !== _) return;
    const C = y.ok ? s.shared ? [y.value] : y.value.rows : [], N = C.length ? Math.min(...C.map((Z) => Z.id)) : 0;
    a.value = n && y.ok && N ? [...a.value.filter((Z) => Z.id > Math.max(...C.map((O) => O.id))), ...C, ...a.value.filter((Z) => Z.id < N)] : C, o.value = y.ok ? "" : y.error, i.value = !0;
  }
  async function L($) {
    const y = await s.run($);
    return r.value = y.ok ? "" : y.error, l.value = y.ok ? y.value : null, await S(), y;
  }
  return s.follow(t, f), S(), { rows: a, failure: o, loaded: i, load: S, older: v, act: L, actionFailure: r, answer: l, context: s };
}
const sh = { class: "title" }, ah = { class: "state" }, oh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = nh(t.line, t.events);
    return (o, i) => (c(), K(Nr, {
      rows: V(n),
      failure: V(s),
      loaded: V(a),
      empty: e.empty
    }, {
      default: U(({ row: r }) => [
        m("span", sh, M(r.title), 1),
        m("span", ah, M(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Tg = /* @__PURE__ */ Y(oh, [["__scopeId", "data-v-a69084cd"]]), rh = ["data-tip", "aria-label"], ih = {
  key: 0,
  class: "mact-word"
}, lh = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      F(st, { name: "open" }),
      e.open ? (c(), h("span", ih, M(e.label), 1)) : j("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, rh));
  }
}, ch = /* @__PURE__ */ Y(lh, [["__scopeId", "data-v-3b292e09"]]), An = W(Date.now() / 1e3);
let Xs = 0, qt = 0;
function uh() {
  return qt || (An.value = Date.now() / 1e3, Xs = setInterval(() => An.value = Date.now() / 1e3, 1e3)), qt += 1, wa() && ka(() => {
    qt -= 1, qt || clearInterval(Xs);
  }), An;
}
const dh = 120, Cn = 280, hh = 160, fh = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function ph(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = W(t()), a = W("");
  let o = 0;
  const i = (d, f) => Object.assign(d.style, { width: `${f.width}px`, height: `${f.height}px` }), r = (d) => Object.assign(d.style, { width: "", height: "", transition: "" });
  async function l(d) {
    const f = e.value, v = ++o;
    if (!f || !f.offsetWidth || fh()) {
      s.value = d;
      return;
    }
    const _ = { width: f.offsetWidth, height: f.offsetHeight };
    if (i(f, _), a.value = "leaving", await n(dh), v !== o) return;
    s.value = d, a.value = "resizing", await dn(), r(f);
    const S = { width: f.offsetWidth, height: f.offsetHeight };
    i(f, _), f.offsetWidth, f.style.transition = `width ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, i(f, S), await n(Cn), v === o && (r(f), a.value = "entering", await n(hh), v === o && (a.value = ""));
  }
  return be(t, (d) => l(d)), us(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const mh = ["title", "data-figure-mark", "data-folded", "data-open"], gh = {
  key: 2,
  class: "worker"
}, vh = { class: "head" }, yh = { key: 0 }, wh = {
  key: 3,
  class: "status"
}, kh = {
  key: 0,
  class: "figure"
}, bh = {
  key: 1,
  class: "ran-for"
}, $h = { key: 2 }, xh = { key: 3 }, _h = {
  key: 4,
  class: "news"
}, Mh = {
  key: 5,
  class: "spin",
  "aria-label": "Still running"
}, Sh = {
  key: 7,
  class: "settled"
}, Eh = {
  key: 1,
  class: "bar"
}, Ah = {
  key: 3,
  class: "detail body"
}, Ch = {
  key: 0,
  class: "body-label"
}, Oh = ["title"], Th = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ya(), s = ["onClick", "onAct"], a = I(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = W(!1), i = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), l = I(() => r.value || i.value), d = I(() => r.value ? t.open : o.value), f = I(() => r.value ? !t.open : i.value && !o.value), v = I(() => !!(t.mark.action && n.onAct)), _ = I(() => l.value || v.value || !!n.onClick), S = W(null), L = W(null), { folded: $, phase: y } = ph(S, () => f.value);
    function C(le) {
      var me, Se;
      if (!(le.target !== S.value && !L.value.contains(le.target))) {
        if (r.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (i.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(le);
      }
    }
    const N = (le) => n.onAct(le), Z = ["failed", "unfinished"], O = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Z.includes(t.mark.state) ? "danger" : "good" : ""), E = I(() => t.mark.color ? t.mark.color : O.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : O.value ? `var(--tone-${O.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), H = I(() => E.value || "var(--tone-work)"), k = I(() => !t.mark.ending && !t.mark.ended && O.value !== "stopped"), g = uh(), b = I(
      () => t.mark.began_at && k.value && !t.mark.figure && !t.mark.counting ? Gi(g.value - t.mark.began_at) : ""
    ), w = I(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${js(me - le, !0)}` : js(g.value - le, !0) : b.value;
    }), p = ["bad", "danger", "warn"], u = I(() => p.includes(O.value) || t.mark.asks ? "attention" : k.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), A = ["bad", "danger"], T = I(() => A.includes(O.value)), q = I(() => u.value === "process" ? "running" : T.value ? "cross" : O.value === "stopped" ? "stopped" : O.value === "good" ? "tick" : ""), ae = I(
      () => !!(t.mark.figure || w.value || t.mark.docked || t.mark.stopping || q.value || t.mark.settled || t.mark.news)
    ), oe = I(() => [t.mark.title, t.mark.time ? Ia(t.mark.time) : ""].filter(Boolean).join(" · ")), de = I(() => ({
      ...E.value ? { "--mark": E.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (c(), h("div", ft(a.value, {
      ref_key: "root",
      ref: S,
      class: [
        "mark",
        `w-${u.value}`,
        V(y),
        {
          open: d.value,
          live: _.value,
          failed: T.value,
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
      "data-folded": V($) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: C
    }), [
      (c(), K(at(_.value ? "button" : "span"), {
        ref_key: "top",
        ref: L,
        class: "top",
        type: _.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!d.value) : void 0
      }, {
        default: U(() => [
          e.mark.markIcon ? (c(), K(st, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), K(Ae, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", gh, M(e.mark.worker), 1)) : j("", !0),
          m("span", vh, [
            F(dt, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", yh, M(e.mark.name), 1)) : j("", !0),
            l.value ? (c(), K(nn, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : j("", !0)
          ]),
          ae.value ? (c(), h("span", wh, [
            e.mark.figure ? (c(), h("span", kh, M(e.mark.figure), 1)) : j("", !0),
            w.value ? (c(), h("span", bh, M(w.value), 1)) : j("", !0),
            e.mark.docked ? (c(), h("span", $h, "In the dock")) : j("", !0),
            e.mark.stopping ? (c(), h("span", xh, "Stopping")) : j("", !0),
            e.mark.news ? (c(), h("span", _h, M(e.mark.news), 1)) : j("", !0),
            q.value === "running" ? (c(), h("span", Mh)) : q.value ? (c(), K(st, {
              key: 6,
              class: X(["sign", q.value]),
              name: q.value
            }, null, 8, ["class", "name"])) : j("", !0),
            e.mark.settled ? (c(), h("span", Sh, M(e.mark.settled), 1)) : j("", !0)
          ])) : j("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      v.value ? (c(), K(ch, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: _e(N, ["stop"])
      }, null, 8, ["label", "open"])) : j("", !0),
      (e.mark.figure || e.mark.counting) && k.value ? (c(), h("span", Eh, [
        m("span", {
          class: "progress",
          style: we({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: H.value })
        }, null, 4)
      ])) : j("", !0),
      e.mark.detail && !V($) ? (c(), K(dt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : j("", !0),
      e.mark.body && !V($) ? (c(), h("div", Ah, [
        e.mark.bodyLabel ? (c(), h("p", Ch, M(e.mark.bodyLabel), 1)) : j("", !0),
        F(dt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : j("", !0),
      e.mark.command && !V($) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, M(e.mark.command), 9, Oh)) : j("", !0),
      e.mark.card ? (c(), K(dt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : j("", !0),
      $e(le.$slots, "default", {
        shown: !V($)
      }, void 0, !0)
    ], 16, mh));
  }
}), Bh = /* @__PURE__ */ Y(Th, [["__scopeId", "data-v-de840831"]]), Lh = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function oo(e) {
  var n;
  const t = Lh[e] || ((n = gn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Rh = (e) => oo(String(e).split(":")[0]), ro = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ih = { passed: "good", failed: "danger", warned: "warn", running: "" }, ea = {
  "open row": (e) => gt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Or(e.target_model, e.target_id || 0)
}, Dh = { "open row": (e) => Rh(e.target_model), "open page": () => oo("pages") };
function jh(e, t) {
  const n = t || {}, s = ea[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" && Ih[e.outcome] || "",
    label: e.text,
    // a mark with a body of its module's own keeps its lines for that body, and its cut-off first part is not a second line
    detail: n.body_url ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Dh[s](e) : "",
    handlers: s ? { onAct: () => ea[s](e) } : {}
  };
}
const Nh = 24, Ph = 1e3, ta = 2e3, qh = 0.25, Wh = 5e3;
function Hh(e, t = Nh, n = () => !0) {
  const s = W(!1), a = W(0), o = W(!1);
  let i = 0, r = 0, l = 0;
  const d = () => e && "value" in e ? e.value : e, f = () => {
    const O = d();
    return O ? O.scrollHeight - O.scrollTop - O.clientHeight : 0;
  }, v = () => !d() || f() <= t;
  function _(O) {
    if (clearTimeout(i), !O) {
      o.value = !1, l = Date.now();
      return;
    }
    const E = Date.now() - l < ta ? ta : Ph;
    i = setTimeout(() => o.value = s.value, E);
  }
  function S() {
    clearTimeout(r), s.value = !1, a.value = 0, _(!1);
  }
  function L(O = !1) {
    const E = d();
    E && O && E.scrollTo ? E.scrollTo({ top: E.scrollHeight, behavior: "smooth" }) : E && (E.scrollTop = E.scrollHeight), S();
  }
  function $() {
    C(), !s.value && (s.value = !0, _(!0));
  }
  const y = () => !!d() && f() <= d().clientHeight * qh;
  function C() {
    clearTimeout(r), y() && (r = setTimeout(() => s.value && y() && n() && L(!0), Wh));
  }
  function N() {
    v() ? S() : $();
  }
  function Z(O = 1, E = !1) {
    s.value ? a.value += Math.max(0, O) : L(E);
  }
  return wa() && ka(() => [i, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: v, follow: S, toBottom: L, left: $, scrolled: N, arrived: Z };
}
const Fh = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(null), { away: o, scrolled: i, arrived: r, toBottom: l } = Hh(a);
    be(
      () => n.lines.length,
      () => dn(() => r()),
      { immediate: !0 }
    );
    function d(f) {
      i(), s("older", f.target);
    }
    return (f, v) => (c(), h("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: d
    }, [
      fe(M(e.lines.join(`
`) || e.empty), 1),
      V(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: v[0] || (v[0] = (_) => V(l)(!0))
      }, "Follow")) : j("", !0)
    ], 544));
  }
}, Uh = /* @__PURE__ */ Y(Fh, [["__scopeId", "data-v-09394a20"]]), zh = 1e4;
class Vh {
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
    return this.heardAt !== null && t - this.heardAt > zh;
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
const Gh = {
  key: 0,
  class: "frame-note"
}, Kh = {
  key: 0,
  class: "frame-note"
}, Yh = ["src", "title"], Jh = 1e3, Zh = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ba(), s = W(null), a = W(!1), o = W(!1);
    let i = null, r = 0;
    return je(() => {
      i = new Vh(s.value, n), i.start(), r = setInterval(() => {
        a.value = i.silent();
      }, Jh);
    }), Me(() => {
      i == null || i.stop(), clearInterval(r);
    }), (l, d) => o.value ? (c(), h("p", Gh, "This window was closed because it stopped answering.")) : (c(), h(J, { key: 1 }, [
      a.value ? (c(), h("div", Kh, [
        d[2] || (d[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        F(ye, {
          onClick: d[0] || (d[0] = (f) => o.value = !0)
        }, {
          default: U(() => [...d[1] || (d[1] = [
            fe("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : j("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: V(n).window
      }, null, 8, Yh)
    ], 64));
  }
}, Qh = /* @__PURE__ */ Y(Zh, [["__scopeId", "data-v-32a49046"]]), Xh = 0, ef = "/api/lines", tf = "/api/line";
class nf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Xh));
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
        const n = await Ie.raw(ef, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Ie.raw(tf, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const sf = new nf();
class af {
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
const of = { 1: "refused", 2: "usage", 3: "fault" }, rf = 100, lf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function cf({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: i, open: r, options: l = W({}), declared: d = [], readOnly: f = !1, shared: v = null }) {
  const _ = /* @__PURE__ */ new Map(), S = new AbortController(), L = ($) => {
    const y = _.get($);
    if (y && performance.now() - y.at < rf) return y.answer;
    const C = _t(e, $, t, S.signal);
    return _.set($, { answer: C, at: performance.now() }), C;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: I(() => s()),
    permissions: a,
    readOnly: f,
    shared: v,
    read: L,
    run: ($) => _t(e, $, t, S.signal),
    upload: ($) => df($, S.signal),
    cancel: () => S.abort(),
    follow: ($, y) => i.follow(e, $.filter((C) => o.some((N) => io(N, C))), y, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: ($) => I(() => {
      var y;
      return l.value[$] ?? ((y = d.find((C) => C.key === $)) == null ? void 0 : y.default);
    }),
    setting: async ($, y) => {
      const C = await L(`window setting ${e} ${$}`);
      return C.ok ? C.value.value : y;
    },
    keep: ($, y) => _t(e, ["window", "save-setting", e, $, JSON.stringify(y)], t, S.signal)
  };
}
function uf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const sn = { ok: !1, failure: "cancelled", error: "" };
async function _t(e, t, n, s = void 0) {
  try {
    const a = await sf.add({ window: e, line: Array.isArray(t) ? t : hf(t), environment: n }, s);
    return s != null && s.aborted ? sn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: of[a.code] || "fault", error: uf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? sn : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function df(e, t = void 0) {
  try {
    const n = await Ie.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? sn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? sn : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function hf(e) {
  return [...e.matchAll(lf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function ff({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const pf = {
  class: "allowance-prompt",
  role: "dialog"
}, mf = { class: "allowance-prompt-text" }, gf = { class: "allowance-prompt-buttons" }, vf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", pf, [
      m("p", mf, M(V(ff)(e.request)), 1),
      m("div", gf, [
        F(ye, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            fe("Allow", -1)
          ])]),
          _: 1
        }),
        F(ye, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            fe("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, yf = /* @__PURE__ */ Y(vf, [["__scopeId", "data-v-102dc765"]]), On = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), K(Jt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: U(() => [
        fe(M(e.reason) + " ", 1),
        e.retry ? (c(), K(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            fe("Retry", -1)
          ])]),
          _: 1
        })) : j("", !0),
        e.removable ? (c(), K(ye, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            fe("Remove tab", -1)
          ])]),
          _: 1
        })) : j("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, wf = ["data-window", "data-agent"], kf = {
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
    const r = Fe(pr, null), l = cf({
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
      open: (v, _) => {
        s("open", v, _), r == null || r(v, _);
      }
    });
    Fo(Ue, l), be(() => n.visible, (v) => v && n.subscriptions.shown(n.name)), Me(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), Uo((v) => (a.value = v instanceof Error ? v.message : String(v), n.subscriptions.stopAll(n.name), !1));
    const d = () => ls(n.component), f = () => {
      var v, _;
      return ((_ = (v = n.prompts) == null ? void 0 : v.current.value) == null ? void 0 : _.window) === n.name ? n.prompts.current.value : null;
    };
    return (v, _) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (c(), K(yf, {
        key: 0,
        request: f(),
        onAnswer: _[0] || (_[0] = (S) => e.prompts.answer(S))
      }, null, 8, ["request"])) : j("", !0),
      e.unavailableReason ? (c(), K(On, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), K(On, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: i
      }, null, 8, ["name", "reason"])) : e.component ? (c(), K(d, { key: o.value })) : (c(), K(On, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: _[1] || (_[1] = (S) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, wf));
  }
}, lo = /* @__PURE__ */ Y(kf, [["__scopeId", "data-v-7d5e8ae6"]]), bf = {
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
    const t = e, n = { render: () => ls(Qh, { src: t.entry.entry_url }) };
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
}, ts = "journal.stale-build-reload", $f = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function xf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ts) === e.message) return !1;
    t.setItem(ts, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function _f(e = window.sessionStorage) {
  try {
    e.removeItem(ts);
  } catch {
    return;
  }
}
const Mf = ["data-window"], Sf = {
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
    const t = e, n = un(null), s = W("");
    return be(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, _f();
          } catch (o) {
            if ($f(o) && xf(o)) return;
            s.value = `This window's file could not be loaded: ${o.message}`;
          }
      },
      { immediate: !0 }
    ), (a, o) => !n.value && !s.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      F(Ct, { shape: "cards" })
    ], 8, Mf)) : (c(), K(lo, {
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
}, Ef = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new af(), s = ((r = Fe(Ue, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), i = I(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (l, d) => i.value ? (c(), K(Sf, {
      key: 0,
      entry: o.value,
      subscriptions: V(n),
      environment: V(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), K(bf, {
      key: 1,
      entry: o.value,
      subscriptions: V(n),
      environment: V(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Af = { class: "mark-more-inner" }, Cf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Of = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Tf = {
  key: 3,
  class: "mark-lines"
}, Bf = "process", na = "task", Lf = 2e3, Rf = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Fe(Ue), s = I(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = I(() => ro.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === na ? t.mark.target_id : 0), i = W([]), r = W(!1), l = W(""), d = I(() => t.mark.target_model === Bf && !!t.mark.target_id);
    async function f() {
      const S = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, l.value = S.ok ? "" : S.error, S.ok && (i.value = S.value.lines);
    }
    let v = null;
    const _ = () => clearInterval(v);
    return be(() => t.shown && d.value, (S) => {
      _(), S && (f(), t.mark.ended_at || (v = setInterval(f, Lf)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (S) => S && t.shown && d.value && (_(), f())), Me(_), (S, L) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: L[1] || (L[1] = _e(() => {
      }, ["stop"]))
    }, [
      m("div", Af, [
        e.declaration.body_url ? (c(), K(Ef, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(J, { key: 1 }, [
          a.value ? (c(), h(J, { key: 0 }, [
            L[2] || (L[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Cf, M(a.value), 1)
          ], 64)) : j("", !0),
          d.value && l.value ? (c(), h("p", Of, M(l.value), 1)) : d.value && r.value ? (c(), h(J, { key: 2 }, [
            L[3] || (L[3] = m("p", { class: "mark-label" }, "Output", -1)),
            F(Uh, {
              class: "mark-terminal",
              lines: i.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", Tf, M(s.value.join(`
`)), 1)) : j("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: L[0] || (L[0] = _e(($) => V(gt)(`${na}:${o.value}`), ["stop"]))
          }, "Open task " + M(o.value) + " and its proofs", 1)) : j("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ns = /* @__PURE__ */ Y(Rf, [["__scopeId", "data-v-51f69bf1"]]), If = (e) => `show-${e}`, Bg = (e, t, n) => e.filter((s) => {
  var a;
  return n(If((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Df = "messages.chat", jf = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), ss = (e, t, n) => _t(Df, jf(e, t), n), Nf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Pf = ["title", "aria-label", "onClick"], qf = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Wf = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => Nf(t.buttons, t.allowedRuns).filter((i) => {
      var r;
      return !((r = i.variants) != null && r.length) || i.variants.includes(t.mark.variant);
    })), s = W(""), a = Fe(Ue);
    async function o(i) {
      const r = await ss(i, t.mark, a.environment);
      s.value = r.ok ? "" : r.error;
    }
    return (i, r) => (c(), h(J, null, [
      (c(!0), h(J, null, re(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: _e((d) => o(l), ["stop"])
      }, [
        F(st, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Pf))), 128)),
      s.value ? (c(), h("span", qf, M(s.value), 1)) : j("", !0)
    ], 64));
  }
}, Hf = /* @__PURE__ */ Y(Wf, [["__scopeId", "data-v-0dfda102"]]);
function co(e, t) {
  const n = un(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((i) => [i.type, i])), a = async () => {
    try {
      return (await (await Ie.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const uo = co("/api/marks", "marks"), Lg = uo.fetchAll, Ff = uo.find, Uf = ["data-ref"], zf = ["data-ref"], Vf = { class: "mark-row" }, Gf = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = e, s = I(() => Ff(n.mark.type)), a = I(() => jh(n.mark, s.value)), o = I(() => {
      var r;
      return !!(n.mark.lines || n.mark.detail && ro.has(n.mark.variant) || t.has(n.mark.target_model) || (r = s.value) != null && r.body_url);
    }), i = W(!1);
    return (r, l) => {
      var d, f, v;
      return (d = s.value) != null && d.card ? (c(), h("div", {
        key: 0,
        class: "thread-turn card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        F(ns, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 8, Uf)) : (c(), h("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (f = s.value) == null ? void 0 : f.full_width }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Vf, [
          F(Bh, ft({
            mark: a.value,
            open: o.value ? i.value : void 0
          }, zo(a.value.handlers), {
            onClick: l[0] || (l[0] = (_) => i.value = !i.value)
          }), Vo({ _: 2 }, [
            o.value ? {
              name: "default",
              fn: U(({ shown: _ }) => [
                F(ns, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: _
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(Hf, {
            buttons: (v = s.value) == null ? void 0 : v.buttons,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, zf));
    };
  }
}, Rg = /* @__PURE__ */ Y(Gf, [["__scopeId", "data-v-6fc6be2f"]]);
function Kf(e) {
  const t = W(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return je(() => n.observe(e.value)), us(() => n.disconnect()), t;
}
const Yf = { class: "chat-dock-fold" }, Jf = ["aria-label"], Zf = { class: "chat-dock-head" }, Qf = { class: "chat-dock-inner" }, Xf = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = W(null), s = W(null), a = Kf(s);
    return t({ card: n }), (o, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted }])
    }, [
      m("div", Yf, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          $e(o.$slots, "edge"),
          m("header", Zf, [
            $e(o.$slots, "head")
          ]),
          m("div", {
            class: X(["chat-dock-body", { folded: e.folded }])
          }, [
            m("div", Qf, [
              m("div", {
                class: "chat-dock-grow",
                style: we(V(a) === null ? null : { height: `${V(a)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  $e(o.$slots, "default")
                ], 512)
              ], 4)
            ])
          ], 2)
        ], 10, Jf)
      ])
    ], 2));
  }
}, ho = /* @__PURE__ */ Y(Xf, [["__scopeId", "data-v-e27493a6"]]), e1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Tn = 5, t1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Tn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Tn}s`, animationDelay: `${(n - Tn).toFixed(2)}s` };
    return (a, o) => (c(), h("span", e1, [
      m("i", { style: s })
    ]));
  }
}, n1 = /* @__PURE__ */ Y(t1, [["__scopeId", "data-v-d0c4b012"]]), fo = co("/api/docks", "docks"), Ig = fo.fetchAll, as = fo.find, s1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), sa = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function a1(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [sa("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || gn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    sa("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const o1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: s1(e, t),
  buttons: a1(e, t)
}), r1 = { class: "dock-title" }, i1 = ["aria-expanded", "title"], l1 = { class: "chat-dock-acts dock-acts" }, c1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, u1 = {
  key: 1,
  class: "dock-text"
}, d1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = I(() => as(s.item.type)), o = W(null), i = I(() => o1(s.item, a.value)), r = Fe(Ue), l = W(/* @__PURE__ */ new Set()), d = W("");
    async function f(S) {
      if (S.action === "open") return gt(`${s.item.target_model}:${s.item.target_id}`);
      if (S.action !== "declared") return ss(S, s.item, r.environment);
      l.value = /* @__PURE__ */ new Set([...l.value, S.label]), d.value = "";
      const L = await ss(S, s.item, r.environment);
      (L == null ? void 0 : L.ok) === !1 && (l.value = new Set([...l.value].filter(($) => $ !== S.label)), d.value = L.error);
    }
    const v = I(() => i.value.buttons.filter((S) => S.action !== "undock" && !l.value.has(S.label))), _ = I(() => i.value.buttons.find((S) => S.action === "undock"));
    return (S, L) => (c(), K(ho, {
      label: i.value.title,
      folded: e.folded
    }, {
      edge: U(() => [
        e.leaving ? (c(), K(n1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : j("", !0)
      ]),
      head: U(() => {
        var $, y, C;
        return [
          ($ = a.value) != null && $.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(J, { key: 1 }, [
            F(Ae, {
              name: i.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            m("span", r1, M(i.value.title), 1)
          ], 64)),
          (y = a.value) != null && y.badge ? (c(), h("span", {
            key: 2,
            class: X(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, M(a.value.badge), 3)) : j("", !0),
          (C = a.value) != null && C.draws_head ? j("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: L[0] || (L[0] = (N) => n("fold"))
          }, [
            F(nn, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, i1)),
          m("span", l1, [
            (c(!0), h(J, null, re(v.value, (N) => (c(), K(ye, {
              key: N.action + N.runs,
              small: "",
              kind: N.primary ? "primary" : "ghost",
              bordered: !N.primary,
              "data-dock-action": N.action,
              onClick: (Z) => f(N)
            }, {
              default: U(() => [
                fe(M(N.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          F(hs, {
            title: _.value.label,
            "data-dock-action": "undock",
            onClick: L[1] || (L[1] = (N) => f(_.value))
          }, null, 8, ["title"])
        ];
      }),
      default: U(() => {
        var $, y;
        return [
          d.value ? (c(), h("p", c1, M(d.value), 1)) : j("", !0),
          e.item.text && !(($ = a.value) != null && $.body_url) ? (c(), h("p", u1, M(e.item.text), 1)) : j("", !0),
          (y = a.value) != null && y.body_url ? (c(), K(ns, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : j("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded"]));
  }
}, aa = /* @__PURE__ */ Y(d1, [["__scopeId", "data-v-608c189e"]]), h1 = ["title", "aria-label"], f1 = { class: "run-chip-in" }, p1 = {
  key: 0,
  class: "run-chip-ring"
}, m1 = { class: "run-chip-name" }, g1 = { class: "run-chip-bar" }, v1 = "processes.output", y1 = 3e3, w1 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var v;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((v = Fe(Ue, null)) == null ? void 0 : v.environment) ?? "", o = W(null), i = I(() => !o.value || o.value.state === "running" || o.value.state === "background"), r = I(() => {
      var _, S;
      return ((_ = o.value) == null ? void 0 : _.title) || ((S = o.value) == null ? void 0 : S.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = I(() => i.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function d() {
      const _ = await _t(v1, ["process", "card", String(s.item.target_id)], a);
      _.ok && (o.value = _.value);
    }
    const f = setInterval(() => i.value && d(), y1);
    return Me(() => clearInterval(f)), d(), (_, S) => {
      var L;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: r.value,
        "aria-label": `${r.value}; show its card`,
        style: we({ "--tone": l.value })
      }, [
        m("span", f1, [
          i.value ? (c(), h("span", p1)) : (c(), K(st, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          m("span", m1, M(r.value), 1)
        ]),
        m("span", g1, [
          m("i", {
            style: we({ width: i.value ? `${((L = o.value) == null ? void 0 : L.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, h1);
    };
  }
}, k1 = /* @__PURE__ */ Y(w1, [["__scopeId", "data-v-10c2365f"]]), b1 = 24, $1 = 8, Dg = 420;
function jg({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= b1 && e > t ? !0 : e < t && a > $1 ? !1 : null;
}
const x1 = (e, t) => e === void 0 ? t : e, _1 = 6, M1 = 3, oa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, po = (e) => !!(e.leaves_at && !e.kept), S1 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!po(e) || t < e.leaves_at || n.has(e.id)), E1 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => S1(s, t, n)).sort((s, a) => s.id - a.id);
function A1(e, t, n = _1) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const C1 = (e, t) => e >= M1 ? !0 : e <= 1 ? !1 : t, O1 = { class: "dock-stack" }, T1 = ["onMouseenter", "onMouseleave"], B1 = {
  key: 0,
  class: "dock-runs-head"
}, L1 = ["onMouseenter", "onMouseleave"], R1 = { class: "dock-runs-chips" }, I1 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = W(Date.now() / 1e3), s = W(/* @__PURE__ */ new Set()), a = W(!1), o = W(!1), i = setInterval(() => n.value = Date.now() / 1e3, 500);
    Me(() => clearInterval(i));
    const r = I(() => E1(t.items, n.value, s.value)), l = I(() => A1(r.value.filter((N) => oa(N, as)), n.value)), d = I(() => r.value.filter((N) => !l.value.includes(N) && !oa(N, as))), f = I(() => (a.value = C1(l.value.length, a.value)) && !o.value), v = W({}), _ = (N) => x1(v.value[N.id], t.folded);
    function S(N) {
      v.value = { ...v.value, [N.id]: !_(N) };
    }
    function L(N) {
      v.value = { ...v.value, ...Object.fromEntries(l.value.map((Z) => [Z.id, Z.id !== N.id])) }, o.value = !0;
    }
    function $() {
      v.value = Object.fromEntries(Object.entries(v.value).filter(([N]) => !l.value.some((Z) => String(Z.id) === N))), o.value = !1;
    }
    function y(N) {
      s.value = /* @__PURE__ */ new Set([...s.value, N.id]);
    }
    function C(N) {
      s.value = new Set([...s.value].filter((Z) => Z !== N.id));
    }
    return (N, Z) => (c(), h("div", O1, [
      (c(!0), h(J, null, re(d.value, (O) => (c(), h("div", {
        key: O.id,
        onMouseenter: (E) => y(O),
        onMouseleave: (E) => C(O)
      }, [
        F(aa, {
          item: O,
          leaving: V(po)(O) && !s.value.has(O.id),
          folded: _(O),
          onFold: (E) => S(O)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, T1))), 128)),
      a.value && o.value ? (c(), h("div", B1, [
        m("button", {
          type: "button",
          class: "dock-runs-toggle",
          "aria-expanded": "true",
          title: "Fold the runs into one line",
          "data-dock-runs-fold": "",
          onClick: $
        }, [
          fe(M(l.value.length) + " runs ", 1),
          F(nn, { open: "" })
        ])
      ])) : j("", !0),
      (c(!0), h(J, null, re(f.value ? [] : l.value, (O) => (c(), h("div", {
        key: O.id,
        onMouseenter: (E) => y(O),
        onMouseleave: (E) => C(O)
      }, [
        F(aa, {
          item: O,
          folded: _(O),
          onFold: (E) => S(O)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, L1))), 128)),
      f.value ? (c(), K(ho, {
        key: 1,
        label: `${l.value.length} runs`,
        kind: "dock-runs-row"
      }, {
        head: U(() => [
          m("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "false",
            title: "Show each run as its own card",
            "data-dock-runs-open": "",
            onClick: Z[0] || (Z[0] = (O) => o.value = !0)
          }, [
            F(st, { name: "runs" }),
            fe(" " + M(l.value.length) + " runs ", 1),
            F(nn)
          ]),
          m("span", R1, [
            (c(!0), h(J, null, re(l.value, (O) => (c(), K(k1, {
              key: O.id,
              item: O,
              onClick: (E) => L(O)
            }, null, 8, ["item", "onClick"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["label"])) : j("", !0)
    ]));
  }
}, Ng = /* @__PURE__ */ Y(I1, [["__scopeId", "data-v-05bde3f3"]]), xt = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Gt = (e) => Math.min(Math.max(e, 0), 1), D1 = (e) => {
  const t = Gt(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => D1((e - t) / (n - t));
function Pg(e) {
  const t = Gt(e), n = Gt((t - 0.12) / 0.76) * xt.shuffles, s = Math.min(Math.floor(n), xt.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), i = et(a, 0.38, 0.76), r = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), l = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), d = Math.sin(Math.PI * Gt((a - 0.45) / 0.55)) ** 2;
  return { moved: i, across: (s + i) / xt.shuffles, lift: xt.lift * o, ready: r, weight: l, follow: d, shuffle: s, phase: a };
}
const mo = 2400, j1 = 0.05;
function qg({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, j1), i = Math.min(t + mo * o, a), r = e + i * o;
  return r < n ? { y: r, speed: i, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
const Ze = {
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
}, os = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), N1 = (e) => e * e * (3 - 2 * e), an = (e, [t, n]) => N1(os(e, t, n)), P1 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Wt = ([e, t], n) => e + n() * (t - e);
function q1(e) {
  return P1.map(() => {
    const t = Wt(Ye.speed, e), n = Wt(Ye.angle, e) * Math.PI / 180, s = Wt(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Wt(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const W1 = q1(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function H1(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function Wg(e, t, n = W1) {
  const s = Ze.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], i = H1(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= i + r) return null;
  const l = Math.min(a, i), d = s.from.map((f, v) => f + o.velocity[v] * l);
  return d[2] -= Ye.gravity * l * l / 2, { at: d, turn: o.spin * l, landed: Math.max(0, a - i) / r };
}
function Hg(e, t) {
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
const Fg = () => Array.from({ length: Ze.pogo.count }, (e, t) => Ze.pogo.bounce * (t + 1) / Ze.pogo.count), Ug = { stride: 0.5 };
function go(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: os(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: os(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function zg(e) {
  const { into: t, out: n } = go(Ze.rope_swing, e);
  return 1 - an(t, [0, 1]) * (1 - an(n, [0, 1]));
}
function Vg(e) {
  const t = Ze.rope_swing, { into: n, out: s } = go(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return an(n, [0, 1]) * (1 - an(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const F1 = { after: 3 }, U1 = 10, z1 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, V1 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, G1 = { weight: 19 }, K1 = {
  build: { cooldown: 180 }
}, Y1 = { every: 120 }, vo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, yo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, J1 = {
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
}, Lt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: U1 }), Q = (e, t, n = {}) => Lt(e, "clip", t, n), Bn = (e, t, n = {}) => Lt(e, "look", t, n), ra = (e, t, n = {}) => Lt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Lt(e, "pick", t, n), ...s }), pe = (e) => Lt("nothing", "nothing", e, {}), Z1 = 120, Q1 = 300, Ln = (e, t) => ({ ...Q(e, t), cooldown: Q1 }), X1 = 120, ee = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), ep = () => [Q("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...Q(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: z1[e.name] }), $t = (e) => ({ ...e, shenanigan: !0, lasts: V1[e.name] }), ks = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ee("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [Q("nod", 2), pe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ee("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...nt(Q("bug_shot", 3)), toward: "", onto: !1 },
    { ...nt(Q("bug_smash", 2)), toward: "", onto: !1 },
    Q("nod", 2)
  ]),
  ...ee("tests_failed", { cooldown: 20, toward: "card" }, [Q("startled", 2), Q("dismay", 1), Q("tantrum", 3), pe(1)]),
  ...ee("committed", { cooldown: 30, toward: "card", onto: !0 }, [Q("nod", 2), pe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ee("sin_fixed", { cooldown: 300 }, [Q("halo", 1), pe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ee("sin_committed", { cooldown: 300 }, [Q("repent", 1), pe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...ee("messaged", { cooldown: X1 }, [Q("phone_call", 1)]),
  ...ee("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [Q("nod", 4), Q("hand_rub", 4), pe(7)]),
  ...ee("question_asked", { cooldown: 60 }, [Q("ask_sign", 9), Q("look_up", 3), pe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ee("reported", { cooldown: 90 }, [ra("read", 3), Q("nod", 1), pe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ee("read_message", { cooldown: 30 }, [ra("read", 3), pe(1)]),
  ...ee("fact_filed", { cooldown: 120 }, [Q("file_card", 3), Q("nod", 1), pe(6)]),
  ...ee("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [Q("nod", 2), pe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ee("bar_done", { holds: !0 }, ep()),
  ...ee("bar_failed", { holds: !0 }, [Q("fume", 1), Q("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ee("standing", { cooldown: 12 }, [Q("look_left", 2), Q("look_right", 2), Q("look_up", 1), pe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ee("launched", { cooldown: 300 }, [Q("tumble", 3), pe(47)]),
  // a break from the hammering now and then
  ...ee("building", { cooldown: 30 }, [Q("wipe_brow", 4), Q("look_left", 1), Q("look_right", 1), pe(69)]),
  ...ee("failed", { cooldown: 20, toward: "card" }, [Q("shake", 3), Q("tantrum", 2), pe(2)]),
  ...ee("refused", { cooldown: 20 }, [Q("shake", 1), pe(1)]),
  ...ee("work_done", { cooldown: 120 }, [Q("stretch", 2), pe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ee("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...ee("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...ee("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...ee("answered", { cooldown: 15 }, [Bn("amused", 3), pe(2)]),
  ...ee("heard", { cooldown: 30 }, [
    Q("bow", 1, { voices: ["butler"] }),
    Q("salute", 1, { voices: ["squire"] }),
    Q("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    pe(1)
  ]),
  ...ee("long_walk", { cooldown: 90 }, [Q("stumble", 3), pe(22)]),
  ...ee("card_arrived", { cooldown: 20, toward: "card" }, [Q("glance", 7), pe(13)]),
  ...ee("typing", { cooldown: 60 }, [Bn("reading", 1), pe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(J1).flatMap(([e, t]) => ee(`reacted:${e}`, {}, [Bn(t, 1)])),
  ...Object.entries(vo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ee(`agent_reacted:${n}`, {}, [Q(s, 1, { voices: [e] })])[0])),
  ...Object.entries(yo).flatMap(([e, t]) => ee(`agent_reacted:${e}`, {}, [Q(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ee("pastime", {}, [
    tt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    tt("rest", 3, 180, 120),
    tt("yawn", 2, 60, 60),
    tt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    tt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    tt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    tt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...$t(nt(Q("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    $t(nt(Q("disco", 2, { ball: "bubble" }))),
    pe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ee("held:search", { cooldown: Z1 }, [Ln("search", 3), { ...Ln("binoculars", 2), when: { home: !0 } }, { ...Ln("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ee("held:type", {}, [Q("type", 3), Q("type_ponder", 1)]),
  ...ee("held:watch", {}, [Q("watch", 2), Q("wave_up", 1)]),
  ...ee("held:compacting", {}, [Q("pack_box", 3), Q("vacuum", 2), Q("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ee("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), pe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ee("tickled", {}, [{ ...nt(Q("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ee("eager", {}, [Q("eager", 2, { slow: !0 }), pe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ee("jump", {}, [$t(nt(Q("backflip", 7, { high: !0 }))), Q("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ee("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ee("unit", { cooldown: K1.build.cooldown }, [ce("unit", G1.weight), pe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ee("progress_jump", { cooldown: 6 }, [Q("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ee("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...ee("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ee("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: Y1.every }, ce("stand", 5)]),
  // a digit a blow's dust lets out
  ...ee("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ee("roam", {}, [
    ce("rest", 35, {}, { stay: [25, 60] }),
    ce("seat", 15, {}, { stay: [15, 40] }),
    ce("edge", 25, {}, { stay: [8, 20] }),
    $t(ce("bubble", 15, {}, { stay: [30, 80] })),
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
    $t(nt(ce("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], tp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), wo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), np = (e) => Array.isArray(e) ? e[0] : e, sp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function ap(e) {
  var d;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || wo(f).every(([v, _]) => n(v) >= np(_)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = ks.filter((f) => tp(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= F1.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, l = r.filter((f) => {
    var v;
    return f.kind === "nothing" || f.name !== ((v = e.tally) == null ? void 0 : v.last);
  });
  return l.some((f) => f.kind !== "nothing") ? l : r;
}
function op(e, t) {
  const n = ap(e);
  let s = t() * n.reduce((o, i) => o + i.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (ko(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function ko(e, t, n) {
  var s;
  for (const [a, o] of wo(t)) (s = e.memory) == null || s.set(a, e.now + sp(o, n));
}
function Gg(e, t, n) {
  ko(e, ks.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const ia = {
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
}, Kg = {
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
}, Yg = 120, Jg = (e) => ia[e] || ia.idle;
[.../* @__PURE__ */ new Set([...Object.values(vo).flatMap((e) => Object.keys(e)), ...Object.keys(yo)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function Zg(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Te.ahead * n ? 180 : Math.sign(s) * Te.turn;
}
const la = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Qg(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), i = Math.floor(o / Te.sweep) % a, r = o % Te.sweep, l = Te.sweep - Te.returnSeconds, d = la((r - l) / Te.returnSeconds), f = r <= l ? la(r / l) : 1 - d, v = i + ((i + 1) % a - i) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + v * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const rp = 1, ip = (e, t, n, s, a, o = 0) => op({ moment: "jump", high: e > rp * t, memory: s, now: a, room: o }, n).name === "backflip", ca = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, Xg = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, ev = { width: 24, height: 27, top: 3, units: 2 }, lp = "[data-figure-pile]", tv = { amber: [1, 0.69, 0.125], good: ca.colours.good, bad: ca.colours.bad }, Rn = { phases: 4, dim: 0.25 }, nv = (e, t, n) => e !== "amber" || (t + n) % Rn.phases < Rn.phases / 2 ? 1 : Rn.dim, cp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(ks.filter((e) => cp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const sv = {
  width: 84,
  belly: 13,
  blink: 4
}, ua = "[data-figure-home]", Rt = () => {
  var t;
  const e = document.querySelector(ua);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ua)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, up = "[data-figure-docked-bars]", dp = "[data-figure-chat-foot]", hp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", fp = "[data-figure-newest]";
function pp() {
  var s, a;
  const e = (s = Rt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(fp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var i, r;
      return !((i = o.closest) != null && i.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !bs(o)) continue;
    const i = o.getBoundingClientRect();
    if (i.right > i.left && i.bottom > i.top) return i;
  }
  return null;
}
function bo(e, t, n = pp()) {
  if (!e || !n) return !0;
  const s = vt(e, t), a = $s(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, i = xt.gap;
  return !_o(o, { left: n.left - i, right: n.right + i, top: n.top - i, bottom: n.bottom + i });
}
const In = 0.26, mp = 0.54, wn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: In, travels: "stand" },
  lounge: { drop: In, travels: "stand" },
  composed: { drop: In, travels: "stand" },
  hang: { drop: mp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, $o = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), gp = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), av = (e, t) => (e === "sit" ? gp.has(t) : $o.has(e)) ? e : "stand", ov = 0.25, rv = (e, t) => $o.has(e) && wn[t].drop === 0, xo = 2, vp = 90, yp = 180, wp = 140, kp = 280, bp = 420, $p = 0.25, xp = 290, _p = 600, Mp = "cubic-bezier(0.2, 0.7, 0.4, 1)", Sp = "cubic-bezier(0.55, 0, 0.9, 0.6)", Dn = 5;
function on(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: i = !1, sprinting: r = !1, random: l = Math.random, memory: d = null, now: f = 0, room: v = 0, pogo: _ = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Dn) return null;
  (i || r) && (o = Math.max(o, xo));
  const S = o > 1, L = Math.abs(t.x - e.x), $ = L < Dn ? 0 : L / (vp * o) * 1e3, y = Math.min($, S ? wp : yp), C = Math.abs(t.y - e.y), N = t.y < e.y, Z = N && !_ && ip(C, n, l, d, f, v), O = N ? bp + Math.min(C, 400) * $p : Math.sqrt(2 * C / mo) * 1e3, E = {
    x: t.x,
    y: t.y,
    ms: C > Dn ? Z ? _p : O : 0,
    lead: Z ? xp : N ? kp : 0,
    easing: N ? Mp : Sp,
    hopping: !0,
    clip: Z ? "backflip" : N ? "jump" : "fall"
  }, H = { x: t.x, y: t.y, ms: $ + y, lead: 0, easing: "linear", ramp: y, ...S ? { clip: "run" } : {} }, k = _ ? Ep(t, n) : E, g = N && !s ? [{ ...H, y: e.y }, k] : [{ ...E, x: e.x }, H];
  return { way: Math.sign(t.x - e.x) || 1, legs: g, lands: !a, pace: o, running: S };
}
const Ep = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), vt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - wn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, _o = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, bs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function yt() {
  var t;
  const e = (t = Rt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Ht = 0.5, da = 20;
function iv(e, t, n = yt()) {
  const s = vt(e, t);
  return s.left >= n.left + da && s.right <= n.right - da;
}
function Mo(e, t, n = yt()) {
  const s = vt(e, t), a = s.right - s.left, o = $s(e), [i, r] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return i >= n.left - Ht && r <= n.right + Ht && s.top >= n.top - Ht && l <= n.bottom + Ht;
}
const rn = [0.35, 0.5, 0.65], ln = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: rn[0], right: rn.at(-1), top: ln[0], bottom: ln.at(-1) }, Ap = 0.24;
function $s(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Ap * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function Cp(e, { size: t }, n = yt()) {
  const s = $s(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Op = (Je.right - Je.left) / 2 + 0.08;
function Tp(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !bs(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, i = Math.min(a.startOffset, o.length - 1);
  for (const l of [i - 1, i].filter((d) => d >= 0)) {
    if (!o.data[l].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, l), d.setEnd(o, l + 1), [...d.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const Bp = (e) => ln.flatMap(
  (t) => rn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Lp(e, t, n = "") {
  if (!bo(e, t)) return rn.length * ln.length;
  const s = vt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(hp)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: l }) => l.width && l.height && _o(a, l) && bs(r)).map(({ rect: r }) => r), i = (r, l) => o.some((d) => r >= d.left && r <= d.right && l >= d.top && l <= d.bottom);
  return Bp(a).filter(([r, l]) => i(r, l) || Tp(r, l, n)).length;
}
function Rp(e, t, n) {
  const s = yt(), a = (i) => n ? Math.hypot(i.x - n.x, i.y - n.y) : 0, o = e.filter((i) => Mo(i, t, s) && bo(i, t)).map((i) => ({ spot: i, covered: Lp(i, t), away: a(i) }));
  return o.length ? o.reduce(
    (i, r) => r.covered < i.covered || r.covered === i.covered && r.away < i.away ? r : i
  ).spot : null;
}
const So = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Ip = Op, Dp = (e, t, { size: n }, s = Ip) => jp(e, So[t], s * n, "stand");
function jp(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const lv = (e) => ((e + 180) % 360 + 360) % 360 - 180, cv = { turns: [-20, -10, 0, 10, 20] }, Np = 7;
function Pp() {
  const e = [...document.querySelectorAll(lp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const qp = 4;
function Wp() {
  const e = Eo(), t = Pp(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > qp || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Np - n, 0) } };
}
const uv = ({ size: e, below: t }) => (1 - t) * e;
function Hp(e, t) {
  const n = yt(), { size: s, below: a } = t, o = wn[e.posture].drop * s;
  return { ...Cp(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Fp = (e, t) => Object.keys(So).map((n) => Hp(Dp(e, n, t), t)), Up = (e, t, n) => Rp(e, t, n) ?? e[0];
function dv(e, t) {
  const { element: n, edge: s } = Wp();
  return { ...Up(Fp(s, e), e, t), view: null, on: n };
}
function Eo() {
  var s;
  const e = Rt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(up);
  if (!t) return { ...Ao(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Ao() {
  const e = Rt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const zp = { climb: 90 };
function hv(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: i = !1, random: r = Math.random, via: l = [], memory: d = null, now: f = 0, room: v = 0, pogo: _ = !1 } = {}) {
  (o || i) && (a = Math.max(a, xo));
  const S = (Z) => {
    const O = vt(Z, n, wn[Z.posture].travels);
    return { x: O.left, y: O.top };
  }, L = t.ladder ?? e.ladder;
  if (L && !(t.ladder && e.ladder)) return Vp(S(e), S(t), S({ ...L.foot, posture: "stand" }), L.way, !!t.ladder, n, a);
  const [$, ...y] = [e, ...l, t].map(S), C = on($, y[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: i, random: r, memory: d, now: f, room: v, pogo: _ }), N = y.slice(1).map((Z, O) => {
    var E;
    return (E = on(y[O], Z, n.size, { random: r, memory: d, now: f, room: v })) == null ? void 0 : E.legs.find((H) => H.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...N.filter(Boolean)] };
}
function Vp(e, t, n, s, a, o, i) {
  const r = (f, v) => ({ x: v.x, y: v.y, ms: Math.hypot(v.x - f.x, v.y - f.y) / zp.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? on(e, n, o.size, { pace: i }) : on(n, t, o.size, { pace: i }), d = a ? [...(l == null ? void 0 : l.legs) ?? [], r(n, t)] : [r(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: i, running: i > 1 };
}
const Gp = "[data-figure-bubble]", Kp = 250;
let Mt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Co = 0;
const Oo = () => Mt, jn = /* @__PURE__ */ new WeakMap();
let Yp = 0;
function To(e) {
  return jn.has(e) || jn.set(e, `floor-${++Yp}`), jn.get(e);
}
const Jp = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Zp = () => {
  var e, t;
  return ((t = (e = Rt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Qp(e, t) {
  var s;
  const n = (s = e.querySelector(dp)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Xp(e, t) {
  const n = e && Qp(e, t), s = e ? [...e.querySelectorAll(Gp)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: i }) => ({ element: o, kind: i, box: o.getBoundingClientRect() })).filter(({ kind: o, box: i }) => i.width > 0 && i.height > 0 && (o !== "bubble" || Jp(i, n))).map(({ element: o, kind: i, box: r }) => ({ id: To(o), kind: i, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const em = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Kp ? (t.top - s.top) / a * 1e3 : 0;
};
function tm(e = Mt, t = performance.now()) {
  const n = yt(), s = Zp(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: i, edge: r } = Eo(), l = [];
  o && l.push({ id: "home", kind: i ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = Ao();
  return d.element && l.push({ id: To(d.element), kind: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), l.push(...Xp(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((f) => Object.freeze({ ...f, vy: em(e, f, t) }))) });
}
const rs = /* @__PURE__ */ new Set();
function nm(e) {
  return rs.add(e), () => rs.delete(e);
}
function sm() {
  Bo();
  const e = () => {
    Co = requestAnimationFrame(e), !document.hidden && (Mt = tm(Mt), rs.forEach((t) => t(Mt)));
  };
  e();
}
function Bo() {
  cancelAnimationFrame(Co);
}
const am = (e, t) => e.find((n) => n.id === t) ?? null;
function fv(e, t, n = Oo().floors) {
  const s = am(n, "home");
  return e.posture === "hang" && s && vt(e, t).bottom >= s.top ? !1 : Mo(e, t);
}
const om = ["data-kind"], rm = { class: "figure-floor-name" }, im = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: we({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", rm, M(e.floor.kind), 1)
    ], 12, om));
  }
}, lm = /* @__PURE__ */ Y(im, [["__scopeId", "data-v-8f6132da"]]), cm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, um = {
  __name: "FigureFloors",
  setup(e) {
    const t = un(Oo().floors);
    let n = () => {
    };
    return je(() => {
      n = nm((s) => t.value = s.floors), sm();
    }), Me(() => {
      n(), Bo();
    }), (s, a) => (c(), h("div", cm, [
      (c(!0), h(J, null, re(t.value, (o) => (c(), K(lm, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, pv = /* @__PURE__ */ Y(um, [["__scopeId", "data-v-e519168b"]]), Nn = (e) => typeof e == "number" ? e : Date.parse(e);
function mv(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Nn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Nn(a.row.created_at) - Nn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const dm = 2e3;
function gv(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, dm);
  };
  je(async () => {
    await e(), s();
  }), us(() => clearTimeout(n));
}
const ha = "newest";
function vv(e, { title: t, isOpen: n = null }) {
  const s = W(""), a = W(ha), o = W("all"), i = I(() => {
    const r = s.value.trim().toLowerCase(), l = e.value.filter((d) => (!r || JSON.stringify(d).toLowerCase().includes(r)) && (o.value === "all" || !n || n(d) === (o.value === "open")));
    return a.value === ha ? l : [...l].sort((d, f) => t(d).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: i, hasStates: !!n };
}
const hm = {
  class: "list-tools",
  "data-list-tools": ""
}, fm = {
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
    return (s, a) => (c(), h("div", hm, [
      F(th, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      F(es, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (c(), K(es, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : j("", !0)
    ]));
  }
}, yv = /* @__PURE__ */ Y(fm, [["__scopeId", "data-v-b2dd0a0d"]]);
function wv() {
  const e = W(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const pm = 86400, is = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function mm(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((is(t) - is(e)) / pm);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function kv(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = is(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: mm(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Pn = 280, qn = 240, Wn = 120, gm = 6, vm = 14, At = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function ym(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const i = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${vm}px)` }), e.offsetHeight, e.style.transition = `height ${Pn}ms ${At}`, e.style.height = `${i}px`;
  const r = a();
  let l = !1;
  const d = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - r;
    if (!l && f >= Pn && (l = !0, e.style.transition = `opacity ${qn}ms ease-out, transform ${qn}ms ${At}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Pn + qn) return s(d);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(d);
}
function bv(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${gm}px)` }), e.offsetHeight, e.style.transition = `opacity ${Wn}ms ease-out, transform ${Wn}ms ${At}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const i = a(), r = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - i < Wn) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const wm = 140, Ft = 220, km = 5;
function $v({ gap: e = wm, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, km);
    if (s = r.length > 0, !s) return;
    let l = r.length;
    for (const d of r)
      d.el.style.display = d.display, d.arrival(d.el, d.options, () => {
        d.done(), l -= 1, l || t(o, e);
      });
  }
  const i = (r, l, d, f = ym) => {
    if (!l.pane || !l.follows()) return d();
    const v = { el: r, options: l, done: d, arrival: f, display: r.style.display || "" };
    if (!s)
      return s = !0, f(r, l, () => a(v));
    r.style.display = "none", n.push(v);
  };
  return i.flush = () => {
    for (const r of n.splice(0))
      r.el.style.display = r.display, r.done();
  }, i;
}
function xv(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Ft}ms ${At}, opacity ${Ft}ms ease-in, margin ${Ft}ms ${At}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Ft);
}
const Lo = "chat.pins.minimised", Kt = W(St(Lo, !1));
function fa(e) {
  Kt.value = e, hn(Lo, e);
}
function bm(e) {
  const t = I(() => e()), n = I(() => Kt.value ? [] : e()), s = () => fa(!Kt.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => Oa(o) > a).length,
    (o, i) => o > i && fa(!1)
  ), { pins: t, visible: n, minimised: Kt, toggle: s };
}
const $m = ["title"], xm = {
  key: 0,
  class: "pins-count"
}, _m = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = bm(() => t.notices);
    return (o, i) => V(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: V(s), inline: e.inline }]),
      title: V(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: i[0] || (i[0] = _e((...r) => V(a) && V(a)(...r), ["stop"]))
    }, [
      F(Ae, {
        name: V(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      V(s) ? (c(), h("span", xm, M(V(n).length), 1)) : j("", !0)
    ], 10, $m)) : j("", !0);
  }
}, _v = /* @__PURE__ */ Y(_m, [["__scopeId", "data-v-c0d11526"]]), Mm = ["title"], Sm = ["title"], Em = { class: "diff-card-dir" }, Am = { class: "diff-card-name" }, Cm = { class: "diff-card-ago" }, Om = ["title"], Tm = ["title"], Bm = {
  key: 0,
  class: "diff-card-note"
}, Lm = ["href"], Rm = ["src", "alt"], Im = { class: "diff-card-rows" }, Dm = { class: "diff-row-num" }, jm = { class: "diff-row-sign" }, Nm = { class: "diff-row-code" }, Pm = {
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
    function o(w) {
      (w.metaKey || w.ctrlKey) && (w.stopPropagation(), s("open", n.path));
    }
    const i = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, l = I(() => n.path.lastIndexOf("/") + 1), d = I(() => n.path.slice(0, l.value)), f = I(() => n.path.slice(l.value)), v = I(() => n.kind === "deleted"), _ = I(() => i[n.kind]), S = I(() => new Set(n.rows.filter((w) => w.line_type === "add").map((w) => w.line))), L = W("after"), $ = I(() => L.value === "before" ? n.whole.old : n.whole.text), y = I(() => n.whole && n.whole.text !== void 0 ? $.value.split(`
`).map((w, p) => ({ line_type: L.value === "after" && S.value.has(p + 1) ? "add" : "ctx", line: p + 1, text: w })) : n.rows.filter(
      (w) => !(n.editsOnly && ["ctx", "fold"].includes(w.line_type)) && !(n.hideRemovals && w.line_type === "del")
    )), C = W(!1), N = I(() => n.lines && !C.value && !n.whole), Z = I(() => N.value ? y.value.slice(0, n.lines) : y.value), O = I(() => y.value.length - Z.value.length), E = (w) => w.line === null || w.line_type === "del" ? "" : w.line, H = (w) => w.line_type === "fold" ? w.hidden ? `⋯ ${w.hidden} lines` : "⋯" : w.text, k = W(null), g = W(null);
    let b = null;
    return je(() => {
      if (!g.value) return;
      let w = !0;
      b = new ResizeObserver(() => {
        !k.value || !g.value || (k.value.style.transition = w ? "none" : "", k.value.style.height = `${g.value.offsetHeight}px`, w = !1);
      }), b.observe(g.value);
    }), Me(() => b && b.disconnect()), (w, p) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: v.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: v.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: p[2] || (p[2] = (u) => !v.value && s("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${V(a)}-click to open it`,
          onClick: o
        }, [
          m("span", Em, M(d.value), 1),
          m("span", Am, M(f.value), 1),
          _.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.kind])
          }, M(_.value), 3)) : j("", !0)
        ], 8, Sm),
        m("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + M(e.added), 3),
        m("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + M(e.removed), 3),
        m("span", Cm, M(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: L.value === "after" ? "Show the file before" : "Show the file after",
          onClick: p[0] || (p[0] = _e((u) => L.value = L.value === "after" ? "before" : "after", ["stop"]))
        }, M(L.value === "after" ? "After" : "Before"), 9, Om)) : j("", !0),
        v.value ? j("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: p[1] || (p[1] = _e((u) => s("whole"), ["stop"]))
        }, [
          F(Ae, {
            name: "file",
            size: 12
          })
        ], 10, Tm))
      ], 8, Mm),
      e.whole && e.whole.error ? (c(), h("p", Bm, M(e.whole.error), 1)) : j("", !0),
      !v.value && !e.folded ? (c(), h(J, { key: 1 }, [
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
          }, null, 8, Rm)
        ], 8, Lm)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: k,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: g,
            class: "diff-card-diff"
          }, [
            m("div", Im, [
              (c(!0), h(J, null, re(Z.value, (u, A) => (c(), h("div", {
                key: A,
                class: X(["diff-row", u.line_type, { fresh: e.fresh && u.edit === e.fresh }])
              }, [
                m("span", Dm, M(E(u)), 1),
                m("span", jm, M(r[u.line_type]), 1),
                m("span", Nm, M(H(u)), 1)
              ], 2))), 128)),
              O.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: p[3] || (p[3] = _e((u) => C.value = !0, ["stop"]))
              }, M(O.value) + " more " + M(O.value === 1 ? "line" : "lines"), 1)) : j("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : j("", !0)
    ], 2));
  }
}, Mv = /* @__PURE__ */ Y(Pm, [["__scopeId", "data-v-b6424f6e"]]), qm = {
  key: 0,
  class: "menu-item-text"
}, Wm = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.description ? (c(), h("span", qm, [
        m("span", null, [
          $e(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, M(e.description), 1)
      ])) : $e(t.$slots, "default", {}, void 0, !0, 1)
    ], 2));
  }
}, Hm = /* @__PURE__ */ Y(Wm, [["__scopeId", "data-v-5b5c4fd9"]]), Fm = {}, Um = { class: "menu-label" };
function zm(e, t) {
  return c(), h("span", Um, [
    $e(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Vm = /* @__PURE__ */ Y(Fm, [["render", zm], ["__scopeId", "data-v-aa955b3e"]]), Ro = /* @__PURE__ */ new WeakMap(), Gm = (e, t) => Ro.set(e, t);
function Km(e, t) {
  for (let n = t; n; n = Ro.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ym(e, t) {
  const n = (s) => {
    var o, i;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((i = e.value) == null ? void 0 : i.$el) || e.value;
    a && !Km(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Me(() => window.removeEventListener("click", n));
}
const ct = 8, Jm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = W(null), o = (u) => u ? `${u}px` : void 0, i = I(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), r = W({ w: 0, h: 0 }), l = W(s.anchor ? s.anchor.getBoundingClientRect() : null), d = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), v = (u) => {
      const A = u.closest(".pane, .float-window");
      return A ? f(A.getBoundingClientRect()) : d();
    }, _ = (u, A) => `${Math.max(0, u ? Math.min(u, A) : A)}px`;
    function S(u, A) {
      return {
        below: u.bottom - A.bottom - s.gap - ct,
        above: A.top - u.top - s.gap - ct,
        across: u.right - u.left - 2 * ct
      };
    }
    function L(u) {
      const A = v(s.anchor), T = S(A, u);
      return r.value.w <= T.across && r.value.h <= Math.max(T.below, T.above) ? A : d();
    }
    const $ = I(() => {
      if (!l.value) return i.value;
      const u = l.value, A = L(u), T = S(A, u), { w: q, h: ae } = r.value, oe = s.align === "auto" ? u.left + u.right > A.left + A.right : s.align === "right", de = hi(oe ? u.right - q : u.left, A.left + ct, Math.max(A.left + ct, A.right - q - ct)), me = ae > T.below && T.above > T.below ? { bottom: `${window.innerHeight - u.top + s.gap}px`, maxHeight: _(s.maxHeight, T.above) } : { top: `${u.bottom + s.gap}px`, maxHeight: _(s.maxHeight, T.below) };
      return { ...i.value, ...me, left: `${de}px`, maxWidth: _(s.maxWidth, T.across) };
    }), y = n, C = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function N(u) {
      const A = C(), T = A.indexOf(document.activeElement);
      A[(T + u + A.length) % A.length].focus();
    }
    const Z = { ArrowDown: () => N(1), ArrowUp: () => N(-1), Escape: () => y("close") }, O = (u) => Z[u.key] && (u.preventDefault(), Z[u.key]()), E = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let H = 0;
    const k = new ResizeObserver(() => {
      cancelAnimationFrame(H), H = requestAnimationFrame(E);
    });
    Ym(a, (u) => s.anchor && !s.anchor.contains(u.target) && y("close"));
    const g = (u, A) => ["top", "left", "right", "bottom"].some((T) => Math.abs(u[T] - A[T]) > 1), b = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let w = 0;
    function p() {
      if (s.anchor) {
        const u = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || b(u)) return y("close");
        g(u, l.value) && (l.value = u);
      }
      w = requestAnimationFrame(p);
    }
    return je(() => {
      s.anchor && a.value && Gm(a.value, s.anchor), E(), a.value && k.observe(a.value), !s.plain && C()[0] && C()[0].focus(), p();
    }), Me(() => {
      k.disconnect(), cancelAnimationFrame(w), cancelAnimationFrame(H);
    }), t({ element: a }), (u, A) => (c(), K(va, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", ft({
        ref_key: "panel",
        ref: a
      }, u.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: $.value,
        onKeydown: O
      }), [
        $e(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Zm = /* @__PURE__ */ Y(Jm, [["__scopeId", "data-v-3d203970"]]), Qm = {
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
        F(Ae, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Xm = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, e0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  started: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  testing: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, t0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], n0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], s0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], a0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], o0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], r0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? o0(t) : e === "agent" ? [...s0(t), ...n0(t)] : e === "check" ? a0(t) : e === "question" ? t0(t) : ((n = { plan: Xm, task: e0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, i0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, l0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, c0 = { class: "ask-text" }, u0 = ["placeholder", "aria-label"], d0 = ["placeholder", "aria-label"], h0 = {
  key: 3,
  class: "moves"
}, f0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = I(() => r0(s.kind, s.row)), i = W(""), r = W(null), l = W(""), d = W("");
    be(() => s.id, () => {
      i.value = "", r.value = null;
    });
    async function f(S, L = "") {
      const $ = await s.read([S.noun ?? s.kind, S.word, String(s.id), ...S.flag ? [S.flag, L] : S.positional ? [L] : [], ...S.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      i.value = $.ok ? "" : $.error, $.ok && (r.value = null, l.value = "", d.value = "", a("done"));
    }
    const v = (S) => S.confirm ? r.value = S : S.said ? f(S, S.said) : S.flag || S.positional ? (r.value = S, l.value = "") : f(S), _ = () => l.value.trim() && f(r.value, l.value.trim());
    return t({ moves: o, press: v }), (S, L) => {
      var $;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: X(["foot", { inline: e.inline }])
      }, [
        i.value ? (c(), h("p", i0, M(i.value), 1)) : j("", !0),
        ($ = r.value) != null && $.confirm ? (c(), h("div", l0, [
          m("span", c0, M(r.value.confirm), 1),
          F(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: L[0] || (L[0] = (y) => f(r.value))
          }, {
            default: U(() => [
              fe(M(r.value.label), 1)
            ]),
            _: 1
          }),
          F(ye, {
            small: "",
            kind: "ghost",
            onClick: L[1] || (L[1] = (y) => r.value = null)
          }, {
            default: U(() => [...L[7] || (L[7] = [
              fe("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: _e(_, ["prevent"])
        }, [
          pt(m("input", {
            "onUpdate:modelValue": L[2] || (L[2] = (y) => l.value = y),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: L[3] || (L[3] = Yt(_e((y) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, u0), [
            [zn, l.value]
          ]),
          r.value.opener ? pt((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": L[4] || (L[4] = (y) => d.value = y),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: L[5] || (L[5] = Yt(_e((y) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, d0)), [
            [zn, d.value]
          ]) : j("", !0),
          F(ye, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: U(() => [
              fe(M(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(ye, {
            small: "",
            kind: "ghost",
            onClick: L[6] || (L[6] = (y) => r.value = null)
          }, {
            default: U(() => [...L[8] || (L[8] = [
              fe("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", h0, [
          (c(!0), h(J, null, re(o.value, (y) => (c(), K(ye, {
            key: y.word,
            small: "",
            kind: y.main ? "primary" : "ghost",
            "data-move": y.word,
            onClick: (C) => v(y)
          }, {
            default: U(() => [
              fe(M(y.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : j("", !0);
    };
  }
}, p0 = /* @__PURE__ */ Y(f0, [["__scopeId", "data-v-fffa0bf6"]]), m0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, g0 = { ...m0, done: "Completed" }, v0 = { class: "task-status-icon" }, y0 = ["width", "height", "aria-label"], w0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", v0, [
      F(cn, {
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
            "aria-label": V(g0)[e.status]
          }, [
            F(ds, { value: e.status }, {
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
          ], 10, y0))
        ]),
        _: 1
      })
    ]));
  }
}, pa = /* @__PURE__ */ Y(w0, [["__scopeId", "data-v-2ab7e404"]]), k0 = {
  class: "comment-side",
  "data-comment-side": "",
  "aria-label": "Comments"
}, b0 = { class: "comment-side-head" }, $0 = {
  key: 0,
  class: "comment-none"
}, x0 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", k0, [
      m("header", b0, [
        n[1] || (n[1] = m("h3", null, "Comments", -1)),
        F(hs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? j("", !0) : (c(), h("p", $0, "No comments yet")),
      (c(!0), h(J, null, re(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, M(e.words(s)), 1))), 128))
    ]));
  }
}, _0 = /* @__PURE__ */ Y(x0, [["__scopeId", "data-v-234cce45"]]), M0 = ["placeholder"], S0 = { class: "actions" }, E0 = { class: "error" }, A0 = {
  key: 1,
  class: "card closed"
}, C0 = { class: "mark" }, O0 = { class: "prompt" }, T0 = {
  key: 0,
  class: "draft"
}, B0 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Un({
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
  emits: /* @__PURE__ */ Un(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Fn(e, "draft"), i = Fn(e, "error"), r = W(!!i.value), l = W(!1), d = W(!1), f = W(null);
    async function v() {
      var $, y;
      r.value = !0, l.value = !1, await dn(), (y = (($ = f.value) == null ? void 0 : $.querySelector("input")) || f.value) == null || y.focus();
    }
    function _() {
      r.value = !1, i.value = "";
    }
    function S($) {
      $.shiftKey || $.isComposing || ($.preventDefault(), L());
    }
    async function L() {
      const $ = o.value.trim();
      if (!(!$ || !s.ready || d.value)) {
        i.value = "", d.value = !0, o.value = "";
        try {
          await s.send($), r.value = !1, l.value = !0;
        } catch (y) {
          o.value = $, i.value = y.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: v }), ($, y) => (c(), h("div", {
      class: X(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: _e(L, ["prevent"]),
        onKeydown: Yt(_, ["esc"])
      }, [
        $e($.$slots, "who", {}, void 0, !0),
        pt(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (C) => o.value = C),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Yt(S, ["enter"])
        }, null, 40, M0), [
          [zn, o.value]
        ]),
        m("div", S0, [
          m("span", E0, M(i.value), 1),
          F(ye, {
            small: "",
            onClick: _
          }, {
            default: U(() => [...y[2] || (y[2] = [
              fe("Cancel", -1)
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
            default: U(() => [...y[3] || (y[3] = [
              fe("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", A0, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: v
        }, [
          m("span", C0, [
            F(Ae, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", O0, M(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", T0, "Draft kept")) : j("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[1] || (y[1] = (C) => a("show"))
        }, [
          m("span", null, M(V(fi)(e.count, "comment")), 1),
          F(Ae, {
            name: "down",
            size: 12
          })
        ])) : j("", !0)
      ]))
    ], 2));
  }
}, L0 = /* @__PURE__ */ Y(B0, [["__scopeId", "data-v-4d1d3a74"]]);
function R0(e, t) {
  const n = W([]), s = W(!1);
  let a = 0, o = 0;
  const i = (d) => {
    const { kind: f, id: v, title: _ } = e(), S = `On ${f} ${v}, ${_}: `;
    return d.text.startsWith(S) ? d.text.slice(S.length) : d.text;
  };
  async function r() {
    const { kind: d, id: f } = e();
    if (!f) return;
    const v = ++o, _ = await t([d, "comments", String(f)]);
    v === o && (n.value = _.ok ? _.value.rows ?? [] : []);
  }
  async function l(d) {
    const { kind: f, id: v } = e(), _ = { id: `sending-${++a}`, text: d };
    n.value = [...n.value, _], s.value = !0;
    const S = await t([f, "comment", String(v), d]);
    if (!S.ok)
      throw n.value = n.value.filter((L) => L !== _ && L.id !== _.id), new Error(S.error);
    await r();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], r();
  }, { immediate: !0 }), { comments: n, open: s, words: i, send: l, load: r };
}
const I0 = { class: "top" }, D0 = {
  class: "crumb",
  "data-task-crumb": ""
}, j0 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, N0 = {
  key: 1,
  class: "body"
}, P0 = { class: "body-row" }, q0 = { class: "stamp" }, W0 = {
  class: "title",
  "data-resource-title": ""
}, H0 = { class: "since" }, F0 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, U0 = { class: "text" }, z0 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, V0 = {
  key: 1,
  class: "note"
}, G0 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, K0 = { class: "text" }, Y0 = { class: "facts" }, J0 = { class: "fact wide" }, Z0 = { class: "fact-value" }, Q0 = {
  key: 0,
  class: "fact"
}, X0 = { class: "fact-value" }, eg = {
  key: 1,
  class: "fact"
}, tg = { class: "fact-value" }, ng = {
  key: 2,
  class: "fact wide"
}, sg = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, ag = {
  key: 2,
  class: "part",
  "data-resource-waits": ""
}, og = ["onClick"], rg = { class: "wait-id" }, ig = { class: "wait-title" }, lg = {
  key: 3,
  class: "part",
  "data-task-outcome": ""
}, cg = { class: "text" }, ug = {
  key: 4,
  class: "part",
  "data-task-brief": ""
}, dg = {
  key: 5,
  class: "part",
  "data-resource-logs": ""
}, hg = 180, fg = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = ao.map(({ key: k, label: g }) => ({ key: String(k), label: g })), a = /* @__PURE__ */ new Set(["completed", "cancelled"]), o = e, i = n, r = W(null), l = W(null), d = W(""), f = W(""), v = W(!1), _ = W(null), S = W(null), L = R0(() => r.value ? { kind: "task", id: o.id, title: r.value.title } : {}, (k) => o.read(k));
    be(L.open, (k) => i("comments", k));
    let $ = 0;
    const y = (k) => a.has(k) ? "done" : k, C = (k) => k.slice(0, 1).toUpperCase() + k.slice(1), N = I(() => {
      var k;
      return (k = l.value) != null && k.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function Z() {
      const k = ++$, [g, b] = await Promise.all([o.read(["task", "inspect", String(o.id)]), o.read(["plan", "place", String(o.id)])]);
      k === $ && (d.value = g.ok ? "" : g.error, r.value = g.ok ? g.value : null, l.value = b.ok ? b.value : null);
    }
    be(() => o.id, () => {
      r.value = null, l.value = null, v.value = !1, _.value = null, Z();
    }, { immediate: !0 }), be(() => o.changes, Z);
    async function O(k) {
      const g = r.value.priority;
      r.value.priority = Number(k);
      const b = await o.read(["task", "edit", String(o.id), "--priority", k]);
      if (f.value = b.ok ? "" : b.error, b.ok) return Z();
      r.value.priority = g;
    }
    function E(k) {
      _.value = null, S.value.press(k);
    }
    const H = (k) => {
      var g;
      return ((g = S.value) == null ? void 0 : g.moves.length) && (_.value = k);
    };
    return t({ openStatus: H }), (k, g) => {
      var b, w, p;
      return c(), h("aside", {
        class: X(["task-inspector", { lone: e.lone }]),
        "data-task-inspector": ""
      }, [
        m("div", I0, [
          e.backed ? (c(), K(Qm, {
            key: 0,
            onBack: g[0] || (g[0] = (u) => i("back"))
          })) : j("", !0),
          m("span", D0, M(N.value), 1),
          g[9] || (g[9] = m("span", { class: "grow" }, null, -1)),
          e.stepped ? (c(), h(J, { key: 1 }, [
            F(ye, {
              small: "",
              title: "Previous task (K)",
              "aria-label": "Previous task",
              onClick: g[1] || (g[1] = (u) => i("step", -1))
            }, {
              default: U(() => [
                F(Ae, {
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
              onClick: g[2] || (g[2] = (u) => i("step", 1))
            }, {
              default: U(() => [
                F(Ae, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : j("", !0),
          F(ye, {
            small: "",
            "aria-label": "Close the task (Esc)",
            "data-resource-close": "",
            onClick: g[3] || (g[3] = (u) => i("close"))
          }, {
            default: U(() => [
              F(Ae, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          })
        ]),
        d.value ? (c(), h("p", j0, M(d.value), 1)) : r.value ? (c(), h(J, { key: 2 }, [
          m("div", P0, [
            (c(), h("div", {
              key: r.value.id,
              class: "body"
            }, [
              m("div", q0, "Task " + M(r.value.id) + " · updated " + M(V(Ds)(V(Xt)(r.value)) || "just now"), 1),
              m("h3", W0, M(r.value.title), 1),
              m("div", {
                class: X(["state-line", y(r.value.state)])
              }, [
                m("button", {
                  type: "button",
                  class: "state",
                  "data-task-state": "",
                  title: "Change the status (S)",
                  onClick: g[4] || (g[4] = (u) => H(u.currentTarget))
                }, [
                  F(pa, {
                    status: y(r.value.state)
                  }, null, 8, ["status"]),
                  fe(" " + M(C(r.value.state)), 1)
                ]),
                m("span", H0, "since " + M(V(Ds)(V(Xt)(r.value)) || "just now"), 1)
              ], 2),
              r.value.state === "blocked" ? (c(), h("section", F0, [
                g[10] || (g[10] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
                m("p", U0, M(r.value.reason || "Other tasks"), 1),
                (b = r.value.openers) != null && b.length ? (c(), h("p", z0, "Opens by itself when " + M(r.value.openers.join(" or ")) + ".", 1)) : (c(), h("p", V0, "Nothing opens it by itself. Unblock it when that is done."))
              ])) : r.value.state === "cancelled" && r.value.reason ? (c(), h("section", G0, [
                g[11] || (g[11] = m("span", { class: "label" }, "Why it was cancelled", -1)),
                m("p", K0, M(r.value.reason), 1)
              ])) : j("", !0),
              m("div", Y0, [
                m("div", J0, [
                  g[12] || (g[12] = m("span", { class: "fact-label" }, "Plan", -1)),
                  m("span", Z0, M((w = l.value) != null && w.plan_id ? `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan"), 1)
                ]),
                ((p = l.value) == null ? void 0 : p.phase_total) > 1 ? (c(), h("div", Q0, [
                  g[13] || (g[13] = m("span", { class: "fact-label" }, "Phase", -1)),
                  m("span", X0, M(l.value.phase_number) + " of " + M(l.value.phase_total) + ": " + M(l.value.phase_title), 1)
                ])) : j("", !0),
                r.value.state === "started" && r.value.holder_id ? (c(), h("div", eg, [
                  g[14] || (g[14] = m("span", { class: "fact-label" }, "Holder", -1)),
                  m("span", tg, "Agent " + M(r.value.holder_id), 1)
                ])) : j("", !0),
                V(a).has(r.value.state) ? j("", !0) : (c(), h("div", ng, [
                  g[15] || (g[15] = m("span", { class: "fact-label" }, "Priority", -1)),
                  F(es, {
                    options: V(s),
                    value: String(r.value.priority),
                    "data-task-priority": "",
                    onPick: O
                  }, null, 8, ["options", "value"]),
                  f.value ? (c(), h("p", sg, M(f.value), 1)) : j("", !0)
                ]))
              ]),
              r.value.waits.length ? (c(), h("section", ag, [
                g[16] || (g[16] = m("h4", null, "Waits on", -1)),
                (c(!0), h(J, null, re(r.value.waits, (u) => (c(), h("button", {
                  key: u.id,
                  type: "button",
                  class: "wait",
                  onClick: (A) => i("select", u.id)
                }, [
                  F(pa, {
                    status: y(u.state),
                    size: 12
                  }, null, 8, ["status"]),
                  m("span", rg, M(u.id), 1),
                  m("span", ig, M(u.title), 1)
                ], 8, og))), 128))
              ])) : j("", !0),
              r.value.state === "completed" && r.value.outcome ? (c(), h("section", lg, [
                g[17] || (g[17] = m("h4", null, "How it was done", -1)),
                m("p", cg, M(r.value.outcome), 1)
              ])) : j("", !0),
              r.value.brief ? (c(), h("section", ug, [
                g[18] || (g[18] = m("h4", null, "The brief", -1)),
                m("p", {
                  class: X(["text", { clamped: !v.value }])
                }, M(r.value.brief), 3),
                r.value.brief.length > hg && !v.value ? (c(), h("button", {
                  key: 0,
                  type: "button",
                  class: "more",
                  onClick: g[5] || (g[5] = (u) => v.value = !0)
                }, "Show the whole brief")) : j("", !0)
              ])) : j("", !0),
              r.value.logs.length ? (c(), h("section", dg, [
                g[19] || (g[19] = m("h4", null, "Log", -1)),
                (c(!0), h(J, null, re(r.value.logs, (u) => (c(), h("p", {
                  key: u.id,
                  class: "log"
                }, M(u.line), 1))), 128))
              ])) : j("", !0)
            ])),
            V(L).open.value ? (c(), K(_0, {
              key: 0,
              comments: V(L).comments.value,
              words: V(L).words,
              onClose: g[6] || (g[6] = (u) => V(L).open.value = !1)
            }, null, 8, ["comments", "words"])) : j("", !0)
          ]),
          F(L0, {
            send: V(L).send,
            count: V(L).comments.value.length,
            onShow: g[7] || (g[7] = (u) => V(L).open.value = !V(L).open.value)
          }, null, 8, ["send", "count"])
        ], 64)) : (c(), h("div", N0, [
          F(Ct)
        ])),
        F(p0, {
          ref_key: "footer",
          ref: S,
          kind: "task",
          id: e.id,
          row: r.value,
          read: e.read,
          onDone: Z
        }, null, 8, ["id", "row", "read"]),
        _.value ? (c(), K(Zm, {
          key: 3,
          anchor: _.value,
          "min-width": 220,
          "max-width": 300,
          onClose: g[8] || (g[8] = (u) => _.value = null)
        }, {
          default: U(() => [
            F(Vm, null, {
              default: U(() => [
                fe("Change the status of task " + M(e.id), 1)
              ]),
              _: 1
            }),
            (c(!0), h(J, null, re(S.value.moves, (u) => (c(), K(Hm, {
              key: u.word,
              onClick: (A) => E(u)
            }, {
              default: U(() => [
                fe(M(u.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : j("", !0)
      ], 2);
    };
  }
}, Sv = /* @__PURE__ */ Y(fg, [["__scopeId", "data-v-5b960ff7"]]);
function pg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Hn = { exports: {} }, ma;
function mg() {
  return ma || (ma = 1, (function(e, t) {
    var n = (function() {
      var s = function(E, H) {
        var k = 236, g = 17, b = E, w = o[H], p = null, u = 0, A = null, T = [], q = {}, ae = function(B, R) {
          u = b * 4 + 17, p = (function(x) {
            for (var D = new Array(x), P = 0; P < x; P += 1) {
              D[P] = new Array(x);
              for (var G = 0; G < x; G += 1)
                D[P][G] = null;
            }
            return D;
          })(u), oe(0, 0), oe(u - 7, 0), oe(0, u - 7), me(), le(), Ne(B, R), b >= 7 && Se(B), A == null && (A = Io(b, w, T)), Pe(A, R);
        }, oe = function(B, R) {
          for (var x = -1; x <= 7; x += 1)
            if (!(B + x <= -1 || u <= B + x))
              for (var D = -1; D <= 7; D += 1)
                R + D <= -1 || u <= R + D || (0 <= x && x <= 6 && (D == 0 || D == 6) || 0 <= D && D <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= D && D <= 4 ? p[B + x][R + D] = !0 : p[B + x][R + D] = !1);
        }, de = function() {
          for (var B = 0, R = 0, x = 0; x < 8; x += 1) {
            ae(!0, x);
            var D = r.getLostPoint(q);
            (x == 0 || B > D) && (B = D, R = x);
          }
          return R;
        }, le = function() {
          for (var B = 8; B < u - 8; B += 1)
            p[B][6] == null && (p[B][6] = B % 2 == 0);
          for (var R = 8; R < u - 8; R += 1)
            p[6][R] == null && (p[6][R] = R % 2 == 0);
        }, me = function() {
          for (var B = r.getPatternPosition(b), R = 0; R < B.length; R += 1)
            for (var x = 0; x < B.length; x += 1) {
              var D = B[R], P = B[x];
              if (p[D][P] == null)
                for (var G = -2; G <= 2; G += 1)
                  for (var ne = -2; ne <= 2; ne += 1)
                    G == -2 || G == 2 || ne == -2 || ne == 2 || G == 0 && ne == 0 ? p[D + G][P + ne] = !0 : p[D + G][P + ne] = !1;
            }
        }, Se = function(B) {
          for (var R = r.getBCHTypeNumber(b), x = 0; x < 18; x += 1) {
            var D = !B && (R >> x & 1) == 1;
            p[Math.floor(x / 3)][x % 3 + u - 8 - 3] = D;
          }
          for (var x = 0; x < 18; x += 1) {
            var D = !B && (R >> x & 1) == 1;
            p[x % 3 + u - 8 - 3][Math.floor(x / 3)] = D;
          }
        }, Ne = function(B, R) {
          for (var x = w << 3 | R, D = r.getBCHTypeInfo(x), P = 0; P < 15; P += 1) {
            var G = !B && (D >> P & 1) == 1;
            P < 6 ? p[P][8] = G : P < 8 ? p[P + 1][8] = G : p[u - 15 + P][8] = G;
          }
          for (var P = 0; P < 15; P += 1) {
            var G = !B && (D >> P & 1) == 1;
            P < 8 ? p[8][u - P - 1] = G : P < 9 ? p[8][15 - P - 1 + 1] = G : p[8][15 - P - 1] = G;
          }
          p[u - 8][8] = !B;
        }, Pe = function(B, R) {
          for (var x = -1, D = u - 1, P = 7, G = 0, ne = r.getMaskFunction(R), te = u - 1; te > 0; te -= 2)
            for (te == 6 && (te -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (p[D][te - ge] == null) {
                  var ke = !1;
                  G < B.length && (ke = (B[G] >>> P & 1) == 1);
                  var se = ne(D, te - ge);
                  se && (ke = !ke), p[D][te - ge] = ke, P -= 1, P == -1 && (G += 1, P = 7);
                }
              if (D += x, D < 0 || u <= D) {
                D -= x, x = -x;
                break;
              }
            }
        }, rt = function(B, R) {
          for (var x = 0, D = 0, P = 0, G = new Array(R.length), ne = new Array(R.length), te = 0; te < R.length; te += 1) {
            var ge = R[te].dataCount, ke = R[te].totalCount - ge;
            D = Math.max(D, ge), P = Math.max(P, ke), G[te] = new Array(ge);
            for (var se = 0; se < G[te].length; se += 1)
              G[te][se] = 255 & B.getBuffer()[se + x];
            x += ge;
            var Ce = r.getErrorCorrectPolynomial(ke), Oe = d(G[te], Ce.getLength() - 1), xs = Oe.mod(Ce);
            ne[te] = new Array(Ce.getLength() - 1);
            for (var se = 0; se < ne[te].length; se += 1) {
              var _s = se + xs.getLength() - ne[te].length;
              ne[te][se] = _s >= 0 ? xs.getAt(_s) : 0;
            }
          }
          for (var Ms = 0, se = 0; se < R.length; se += 1)
            Ms += R[se].totalCount;
          for (var kn = new Array(Ms), It = 0, se = 0; se < D; se += 1)
            for (var te = 0; te < R.length; te += 1)
              se < G[te].length && (kn[It] = G[te][se], It += 1);
          for (var se = 0; se < P; se += 1)
            for (var te = 0; te < R.length; te += 1)
              se < ne[te].length && (kn[It] = ne[te][se], It += 1);
          return kn;
        }, Io = function(B, R, x) {
          for (var D = f.getRSBlocks(B, R), P = v(), G = 0; G < x.length; G += 1) {
            var ne = x[G];
            P.put(ne.getMode(), 4), P.put(ne.getLength(), r.getLengthInBits(ne.getMode(), B)), ne.write(P);
          }
          for (var te = 0, G = 0; G < D.length; G += 1)
            te += D[G].dataCount;
          if (P.getLengthInBits() > te * 8)
            throw "code length overflow. (" + P.getLengthInBits() + ">" + te * 8 + ")";
          for (P.getLengthInBits() + 4 <= te * 8 && P.put(0, 4); P.getLengthInBits() % 8 != 0; )
            P.putBit(!1);
          for (; !(P.getLengthInBits() >= te * 8 || (P.put(k, 8), P.getLengthInBits() >= te * 8)); )
            P.put(g, 8);
          return rt(P, D);
        };
        q.addData = function(B, R) {
          R = R || "Byte";
          var x = null;
          switch (R) {
            case "Numeric":
              x = _(B);
              break;
            case "Alphanumeric":
              x = S(B);
              break;
            case "Byte":
              x = L(B);
              break;
            case "Kanji":
              x = $(B);
              break;
            default:
              throw "mode:" + R;
          }
          T.push(x), A = null;
        }, q.isDark = function(B, R) {
          if (B < 0 || u <= B || R < 0 || u <= R)
            throw B + "," + R;
          return p[B][R];
        }, q.getModuleCount = function() {
          return u;
        }, q.make = function() {
          if (b < 1) {
            for (var B = 1; B < 40; B++) {
              for (var R = f.getRSBlocks(B, w), x = v(), D = 0; D < T.length; D++) {
                var P = T[D];
                x.put(P.getMode(), 4), x.put(P.getLength(), r.getLengthInBits(P.getMode(), B)), P.write(x);
              }
              for (var G = 0, D = 0; D < R.length; D++)
                G += R[D].dataCount;
              if (x.getLengthInBits() <= G * 8)
                break;
            }
            b = B;
          }
          ae(!1, de());
        }, q.createTableTag = function(B, R) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + R + "px;", x += '">', x += "<tbody>";
          for (var D = 0; D < q.getModuleCount(); D += 1) {
            x += "<tr>";
            for (var P = 0; P < q.getModuleCount(); P += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + B + "px;", x += " height: " + B + "px;", x += " background-color: ", x += q.isDark(D, P) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, q.createSvgTag = function(B, R, x, D) {
          var P = {};
          typeof arguments[0] == "object" && (P = arguments[0], B = P.cellSize, R = P.margin, x = P.alt, D = P.title), B = B || 2, R = typeof R > "u" ? B * 4 : R, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, D = typeof D == "string" ? { text: D } : D || {}, D.text = D.text || null, D.id = D.text ? D.id || "qrcode-title" : null;
          var G = q.getModuleCount() * B + R * 2, ne, te, ge, ke, se = "", Ce;
          for (Ce = "l" + B + ",0 0," + B + " -" + B + ",0 0,-" + B + "z ", se += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', se += P.scalable ? "" : ' width="' + G + 'px" height="' + G + 'px"', se += ' viewBox="0 0 ' + G + " " + G + '" ', se += ' preserveAspectRatio="xMinYMin meet"', se += D.text || x.text ? ' role="img" aria-labelledby="' + it([D.id, x.id].join(" ").trim()) + '"' : "", se += ">", se += D.text ? '<title id="' + it(D.id) + '">' + it(D.text) + "</title>" : "", se += x.text ? '<description id="' + it(x.id) + '">' + it(x.text) + "</description>" : "", se += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', se += '<path d="', ge = 0; ge < q.getModuleCount(); ge += 1)
            for (ke = ge * B + R, ne = 0; ne < q.getModuleCount(); ne += 1)
              q.isDark(ge, ne) && (te = ne * B + R, se += "M" + te + "," + ke + Ce);
          return se += '" stroke="transparent" fill="black"/>', se += "</svg>", se;
        }, q.createDataURL = function(B, R) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var x = q.getModuleCount() * B + R * 2, D = R, P = x - R;
          return O(x, x, function(G, ne) {
            if (D <= G && G < P && D <= ne && ne < P) {
              var te = Math.floor((G - D) / B), ge = Math.floor((ne - D) / B);
              return q.isDark(ge, te) ? 0 : 1;
            } else
              return 1;
          });
        }, q.createImgTag = function(B, R, x) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var D = q.getModuleCount() * B + R * 2, P = "";
          return P += "<img", P += ' src="', P += q.createDataURL(B, R), P += '"', P += ' width="', P += D, P += '"', P += ' height="', P += D, P += '"', x && (P += ' alt="', P += it(x), P += '"'), P += "/>", P;
        };
        var it = function(B) {
          for (var R = "", x = 0; x < B.length; x += 1) {
            var D = B.charAt(x);
            switch (D) {
              case "<":
                R += "&lt;";
                break;
              case ">":
                R += "&gt;";
                break;
              case "&":
                R += "&amp;";
                break;
              case '"':
                R += "&quot;";
                break;
              default:
                R += D;
                break;
            }
          }
          return R;
        }, Do = function(B) {
          var R = 1;
          B = typeof B > "u" ? R * 2 : B;
          var x = q.getModuleCount() * R + B * 2, D = B, P = x - B, G, ne, te, ge, ke, se = {
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
          for (G = 0; G < x; G += 2) {
            for (te = Math.floor((G - D) / R), ge = Math.floor((G + 1 - D) / R), ne = 0; ne < x; ne += 1)
              ke = "█", D <= ne && ne < P && D <= G && G < P && q.isDark(te, Math.floor((ne - D) / R)) && (ke = " "), D <= ne && ne < P && D <= G + 1 && G + 1 < P && q.isDark(ge, Math.floor((ne - D) / R)) ? ke += " " : ke += "█", Oe += B < 1 && G + 1 >= P ? Ce[ke] : se[ke];
            Oe += `
`;
          }
          return x % 2 && B > 0 ? Oe.substring(0, Oe.length - x - 1) + Array(x + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return q.createASCII = function(B, R) {
          if (B = B || 1, B < 2)
            return Do(R);
          B -= 1, R = typeof R > "u" ? B * 2 : R;
          var x = q.getModuleCount() * B + R * 2, D = R, P = x - R, G, ne, te, ge, ke = Array(B + 1).join("██"), se = Array(B + 1).join("  "), Ce = "", Oe = "";
          for (G = 0; G < x; G += 1) {
            for (te = Math.floor((G - D) / B), Oe = "", ne = 0; ne < x; ne += 1)
              ge = 1, D <= ne && ne < P && D <= G && G < P && q.isDark(te, Math.floor((ne - D) / B)) && (ge = 0), Oe += ge ? ke : se;
            for (te = 0; te < B; te += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, q.renderTo2dContext = function(B, R) {
          R = R || 2;
          for (var x = q.getModuleCount(), D = 0; D < x; D++)
            for (var P = 0; P < x; P++)
              B.fillStyle = q.isDark(D, P) ? "black" : "white", B.fillRect(D * R, P * R, R, R);
        }, q;
      };
      s.stringToBytesFuncs = {
        default: function(E) {
          for (var H = [], k = 0; k < E.length; k += 1) {
            var g = E.charCodeAt(k);
            H.push(g & 255);
          }
          return H;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(E, H) {
        var k = (function() {
          for (var b = N(E), w = function() {
            var le = b.read();
            if (le == -1) throw "eof";
            return le;
          }, p = 0, u = {}; ; ) {
            var A = b.read();
            if (A == -1) break;
            var T = w(), q = w(), ae = w(), oe = String.fromCharCode(A << 8 | T), de = q << 8 | ae;
            u[oe] = de, p += 1;
          }
          if (p != H)
            throw p + " != " + H;
          return u;
        })(), g = 63;
        return function(b) {
          for (var w = [], p = 0; p < b.length; p += 1) {
            var u = b.charCodeAt(p);
            if (u < 128)
              w.push(u);
            else {
              var A = k[b.charAt(p)];
              typeof A == "number" ? (A & 255) == A ? w.push(A) : (w.push(A >>> 8), w.push(A & 255)) : w.push(g);
            }
          }
          return w;
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
        ], H = 1335, k = 7973, g = 21522, b = {}, w = function(p) {
          for (var u = 0; p != 0; )
            u += 1, p >>>= 1;
          return u;
        };
        return b.getBCHTypeInfo = function(p) {
          for (var u = p << 10; w(u) - w(H) >= 0; )
            u ^= H << w(u) - w(H);
          return (p << 10 | u) ^ g;
        }, b.getBCHTypeNumber = function(p) {
          for (var u = p << 12; w(u) - w(k) >= 0; )
            u ^= k << w(u) - w(k);
          return p << 12 | u;
        }, b.getPatternPosition = function(p) {
          return E[p - 1];
        }, b.getMaskFunction = function(p) {
          switch (p) {
            case i.PATTERN000:
              return function(u, A) {
                return (u + A) % 2 == 0;
              };
            case i.PATTERN001:
              return function(u, A) {
                return u % 2 == 0;
              };
            case i.PATTERN010:
              return function(u, A) {
                return A % 3 == 0;
              };
            case i.PATTERN011:
              return function(u, A) {
                return (u + A) % 3 == 0;
              };
            case i.PATTERN100:
              return function(u, A) {
                return (Math.floor(u / 2) + Math.floor(A / 3)) % 2 == 0;
              };
            case i.PATTERN101:
              return function(u, A) {
                return u * A % 2 + u * A % 3 == 0;
              };
            case i.PATTERN110:
              return function(u, A) {
                return (u * A % 2 + u * A % 3) % 2 == 0;
              };
            case i.PATTERN111:
              return function(u, A) {
                return (u * A % 3 + (u + A) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + p;
          }
        }, b.getErrorCorrectPolynomial = function(p) {
          for (var u = d([1], 0), A = 0; A < p; A += 1)
            u = u.multiply(d([1, l.gexp(A)], 0));
          return u;
        }, b.getLengthInBits = function(p, u) {
          if (1 <= u && u < 10)
            switch (p) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + p;
            }
          else if (u < 27)
            switch (p) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + p;
            }
          else if (u < 41)
            switch (p) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + p;
            }
          else
            throw "type:" + u;
        }, b.getLostPoint = function(p) {
          for (var u = p.getModuleCount(), A = 0, T = 0; T < u; T += 1)
            for (var q = 0; q < u; q += 1) {
              for (var ae = 0, oe = p.isDark(T, q), de = -1; de <= 1; de += 1)
                if (!(T + de < 0 || u <= T + de))
                  for (var le = -1; le <= 1; le += 1)
                    q + le < 0 || u <= q + le || de == 0 && le == 0 || oe == p.isDark(T + de, q + le) && (ae += 1);
              ae > 5 && (A += 3 + ae - 5);
            }
          for (var T = 0; T < u - 1; T += 1)
            for (var q = 0; q < u - 1; q += 1) {
              var me = 0;
              p.isDark(T, q) && (me += 1), p.isDark(T + 1, q) && (me += 1), p.isDark(T, q + 1) && (me += 1), p.isDark(T + 1, q + 1) && (me += 1), (me == 0 || me == 4) && (A += 3);
            }
          for (var T = 0; T < u; T += 1)
            for (var q = 0; q < u - 6; q += 1)
              p.isDark(T, q) && !p.isDark(T, q + 1) && p.isDark(T, q + 2) && p.isDark(T, q + 3) && p.isDark(T, q + 4) && !p.isDark(T, q + 5) && p.isDark(T, q + 6) && (A += 40);
          for (var q = 0; q < u; q += 1)
            for (var T = 0; T < u - 6; T += 1)
              p.isDark(T, q) && !p.isDark(T + 1, q) && p.isDark(T + 2, q) && p.isDark(T + 3, q) && p.isDark(T + 4, q) && !p.isDark(T + 5, q) && p.isDark(T + 6, q) && (A += 40);
          for (var Se = 0, q = 0; q < u; q += 1)
            for (var T = 0; T < u; T += 1)
              p.isDark(T, q) && (Se += 1);
          var Ne = Math.abs(100 * Se / u / u - 50) / 5;
          return A += Ne * 10, A;
        }, b;
      })(), l = (function() {
        for (var E = new Array(256), H = new Array(256), k = 0; k < 8; k += 1)
          E[k] = 1 << k;
        for (var k = 8; k < 256; k += 1)
          E[k] = E[k - 4] ^ E[k - 5] ^ E[k - 6] ^ E[k - 8];
        for (var k = 0; k < 255; k += 1)
          H[E[k]] = k;
        var g = {};
        return g.glog = function(b) {
          if (b < 1)
            throw "glog(" + b + ")";
          return H[b];
        }, g.gexp = function(b) {
          for (; b < 0; )
            b += 255;
          for (; b >= 256; )
            b -= 255;
          return E[b];
        }, g;
      })();
      function d(E, H) {
        if (typeof E.length > "u")
          throw E.length + "/" + H;
        var k = (function() {
          for (var b = 0; b < E.length && E[b] == 0; )
            b += 1;
          for (var w = new Array(E.length - b + H), p = 0; p < E.length - b; p += 1)
            w[p] = E[p + b];
          return w;
        })(), g = {};
        return g.getAt = function(b) {
          return k[b];
        }, g.getLength = function() {
          return k.length;
        }, g.multiply = function(b) {
          for (var w = new Array(g.getLength() + b.getLength() - 1), p = 0; p < g.getLength(); p += 1)
            for (var u = 0; u < b.getLength(); u += 1)
              w[p + u] ^= l.gexp(l.glog(g.getAt(p)) + l.glog(b.getAt(u)));
          return d(w, 0);
        }, g.mod = function(b) {
          if (g.getLength() - b.getLength() < 0)
            return g;
          for (var w = l.glog(g.getAt(0)) - l.glog(b.getAt(0)), p = new Array(g.getLength()), u = 0; u < g.getLength(); u += 1)
            p[u] = g.getAt(u);
          for (var u = 0; u < b.getLength(); u += 1)
            p[u] ^= l.gexp(l.glog(b.getAt(u)) + w);
          return d(p, 0).mod(b);
        }, g;
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
        ], H = function(b, w) {
          var p = {};
          return p.totalCount = b, p.dataCount = w, p;
        }, k = {}, g = function(b, w) {
          switch (w) {
            case o.L:
              return E[(b - 1) * 4 + 0];
            case o.M:
              return E[(b - 1) * 4 + 1];
            case o.Q:
              return E[(b - 1) * 4 + 2];
            case o.H:
              return E[(b - 1) * 4 + 3];
            default:
              return;
          }
        };
        return k.getRSBlocks = function(b, w) {
          var p = g(b, w);
          if (typeof p > "u")
            throw "bad rs block @ typeNumber:" + b + "/errorCorrectionLevel:" + w;
          for (var u = p.length / 3, A = [], T = 0; T < u; T += 1)
            for (var q = p[T * 3 + 0], ae = p[T * 3 + 1], oe = p[T * 3 + 2], de = 0; de < q; de += 1)
              A.push(H(ae, oe));
          return A;
        }, k;
      })(), v = function() {
        var E = [], H = 0, k = {};
        return k.getBuffer = function() {
          return E;
        }, k.getAt = function(g) {
          var b = Math.floor(g / 8);
          return (E[b] >>> 7 - g % 8 & 1) == 1;
        }, k.put = function(g, b) {
          for (var w = 0; w < b; w += 1)
            k.putBit((g >>> b - w - 1 & 1) == 1);
        }, k.getLengthInBits = function() {
          return H;
        }, k.putBit = function(g) {
          var b = Math.floor(H / 8);
          E.length <= b && E.push(0), g && (E[b] |= 128 >>> H % 8), H += 1;
        }, k;
      }, _ = function(E) {
        var H = a.MODE_NUMBER, k = E, g = {};
        g.getMode = function() {
          return H;
        }, g.getLength = function(p) {
          return k.length;
        }, g.write = function(p) {
          for (var u = k, A = 0; A + 2 < u.length; )
            p.put(b(u.substring(A, A + 3)), 10), A += 3;
          A < u.length && (u.length - A == 1 ? p.put(b(u.substring(A, A + 1)), 4) : u.length - A == 2 && p.put(b(u.substring(A, A + 2)), 7));
        };
        var b = function(p) {
          for (var u = 0, A = 0; A < p.length; A += 1)
            u = u * 10 + w(p.charAt(A));
          return u;
        }, w = function(p) {
          if ("0" <= p && p <= "9")
            return p.charCodeAt(0) - 48;
          throw "illegal char :" + p;
        };
        return g;
      }, S = function(E) {
        var H = a.MODE_ALPHA_NUM, k = E, g = {};
        g.getMode = function() {
          return H;
        }, g.getLength = function(w) {
          return k.length;
        }, g.write = function(w) {
          for (var p = k, u = 0; u + 1 < p.length; )
            w.put(
              b(p.charAt(u)) * 45 + b(p.charAt(u + 1)),
              11
            ), u += 2;
          u < p.length && w.put(b(p.charAt(u)), 6);
        };
        var b = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          if ("A" <= w && w <= "Z")
            return w.charCodeAt(0) - 65 + 10;
          switch (w) {
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
              throw "illegal char :" + w;
          }
        };
        return g;
      }, L = function(E) {
        var H = a.MODE_8BIT_BYTE, k = s.stringToBytes(E), g = {};
        return g.getMode = function() {
          return H;
        }, g.getLength = function(b) {
          return k.length;
        }, g.write = function(b) {
          for (var w = 0; w < k.length; w += 1)
            b.put(k[w], 8);
        }, g;
      }, $ = function(E) {
        var H = a.MODE_KANJI, k = s.stringToBytesFuncs.SJIS;
        if (!k)
          throw "sjis not supported.";
        (function(w, p) {
          var u = k(w);
          if (u.length != 2 || (u[0] << 8 | u[1]) != p)
            throw "sjis not supported.";
        })("友", 38726);
        var g = k(E), b = {};
        return b.getMode = function() {
          return H;
        }, b.getLength = function(w) {
          return ~~(g.length / 2);
        }, b.write = function(w) {
          for (var p = g, u = 0; u + 1 < p.length; ) {
            var A = (255 & p[u]) << 8 | 255 & p[u + 1];
            if (33088 <= A && A <= 40956)
              A -= 33088;
            else if (57408 <= A && A <= 60351)
              A -= 49472;
            else
              throw "illegal char at " + (u + 1) + "/" + A;
            A = (A >>> 8 & 255) * 192 + (A & 255), w.put(A, 13), u += 2;
          }
          if (u < p.length)
            throw "illegal char at " + (u + 1);
        }, b;
      }, y = function() {
        var E = [], H = {};
        return H.writeByte = function(k) {
          E.push(k & 255);
        }, H.writeShort = function(k) {
          H.writeByte(k), H.writeByte(k >>> 8);
        }, H.writeBytes = function(k, g, b) {
          g = g || 0, b = b || k.length;
          for (var w = 0; w < b; w += 1)
            H.writeByte(k[w + g]);
        }, H.writeString = function(k) {
          for (var g = 0; g < k.length; g += 1)
            H.writeByte(k.charCodeAt(g));
        }, H.toByteArray = function() {
          return E;
        }, H.toString = function() {
          var k = "";
          k += "[";
          for (var g = 0; g < E.length; g += 1)
            g > 0 && (k += ","), k += E[g];
          return k += "]", k;
        }, H;
      }, C = function() {
        var E = 0, H = 0, k = 0, g = "", b = {}, w = function(u) {
          g += String.fromCharCode(p(u & 63));
        }, p = function(u) {
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
        return b.writeByte = function(u) {
          for (E = E << 8 | u & 255, H += 8, k += 1; H >= 6; )
            w(E >>> H - 6), H -= 6;
        }, b.flush = function() {
          if (H > 0 && (w(E << 6 - H), E = 0, H = 0), k % 3 != 0)
            for (var u = 3 - k % 3, A = 0; A < u; A += 1)
              g += "=";
        }, b.toString = function() {
          return g;
        }, b;
      }, N = function(E) {
        var H = E, k = 0, g = 0, b = 0, w = {};
        w.read = function() {
          for (; b < 8; ) {
            if (k >= H.length) {
              if (b == 0)
                return -1;
              throw "unexpected end of file./" + b;
            }
            var u = H.charAt(k);
            if (k += 1, u == "=")
              return b = 0, -1;
            if (u.match(/^\s$/))
              continue;
            g = g << 6 | p(u.charCodeAt(0)), b += 6;
          }
          var A = g >>> b - 8 & 255;
          return b -= 8, A;
        };
        var p = function(u) {
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
        return w;
      }, Z = function(E, H) {
        var k = E, g = H, b = new Array(E * H), w = {};
        w.setPixel = function(T, q, ae) {
          b[q * k + T] = ae;
        }, w.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(k), T.writeShort(g), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(k), T.writeShort(g), T.writeByte(0);
          var q = 2, ae = u(q);
          T.writeByte(q);
          for (var oe = 0; ae.length - oe > 255; )
            T.writeByte(255), T.writeBytes(ae, oe, 255), oe += 255;
          T.writeByte(ae.length - oe), T.writeBytes(ae, oe, ae.length - oe), T.writeByte(0), T.writeString(";");
        };
        var p = function(T) {
          var q = T, ae = 0, oe = 0, de = {};
          return de.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; ae + me >= 8; )
              q.writeByte(255 & (le << ae | oe)), me -= 8 - ae, le >>>= 8 - ae, oe = 0, ae = 0;
            oe = le << ae | oe, ae = ae + me;
          }, de.flush = function() {
            ae > 0 && q.writeByte(oe);
          }, de;
        }, u = function(T) {
          for (var q = 1 << T, ae = (1 << T) + 1, oe = T + 1, de = A(), le = 0; le < q; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(q)), de.add(String.fromCharCode(ae));
          var me = y(), Se = p(me);
          Se.write(q, oe);
          var Ne = 0, Pe = String.fromCharCode(b[Ne]);
          for (Ne += 1; Ne < b.length; ) {
            var rt = String.fromCharCode(b[Ne]);
            Ne += 1, de.contains(Pe + rt) ? Pe = Pe + rt : (Se.write(de.indexOf(Pe), oe), de.size() < 4095 && (de.size() == 1 << oe && (oe += 1), de.add(Pe + rt)), Pe = rt);
          }
          return Se.write(de.indexOf(Pe), oe), Se.write(ae, oe), Se.flush(), me.toByteArray();
        }, A = function() {
          var T = {}, q = 0, ae = {};
          return ae.add = function(oe) {
            if (ae.contains(oe))
              throw "dup key:" + oe;
            T[oe] = q, q += 1;
          }, ae.size = function() {
            return q;
          }, ae.indexOf = function(oe) {
            return T[oe];
          }, ae.contains = function(oe) {
            return typeof T[oe] < "u";
          }, ae;
        };
        return w;
      }, O = function(E, H, k) {
        for (var g = Z(E, H), b = 0; b < H; b += 1)
          for (var w = 0; w < E; w += 1)
            g.setPixel(w, b, k(w, b));
        var p = y();
        g.write(p);
        for (var u = C(), A = p.toByteArray(), T = 0; T < A.length; T += 1)
          u.writeByte(A[T]);
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
  })(Hn)), Hn.exports;
}
var gg = mg();
const vg = /* @__PURE__ */ pg(gg), yg = ["width", "height", "viewBox"], wg = ["width", "height"], kg = ["d"], bg = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const s = vg(0, "M");
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
      }, null, 8, wg),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, kg)
    ], 8, yg));
  }
}, Ev = /* @__PURE__ */ Y(bg, [["__scopeId", "data-v-489f0852"]]), Av = Go(() => import("./VoiceFigure-qSFOg3rq.js").then((e) => e.V)), Cv = "1.0.0", Ov = "3.5";
export {
  Sg as $,
  Yg as A,
  Je as B,
  ov as C,
  Gg as D,
  av as E,
  qg as F,
  Bo as G,
  sm as H,
  tm as I,
  dv as J,
  vt as K,
  tv as L,
  Te as M,
  xt as N,
  Zg as O,
  wn as P,
  Qg as Q,
  P1 as R,
  $o as S,
  Kg as T,
  sv as U,
  ca as V,
  Wp as W,
  Rp as X,
  hv as Y,
  rv as Z,
  Y as _,
  ie as a,
  ye as a0,
  hs as a1,
  Eg as a2,
  Nu as a3,
  Mv as a4,
  Ng as a5,
  Jt as a6,
  pv as a7,
  xg as a8,
  nn as a9,
  Ds as aA,
  $v as aB,
  bv as aC,
  xv as aD,
  jg as aE,
  Ig as aF,
  Lg as aG,
  mv as aH,
  Ff as aI,
  gt as aJ,
  Og as aK,
  Bg as aL,
  vv as aM,
  wv as aN,
  Ym as aO,
  bm as aP,
  gv as aQ,
  nh as aR,
  ba as aS,
  kv as aT,
  Ae as aa,
  Cv as ab,
  Ov as ac,
  yv as ad,
  Rg as ae,
  Hm as af,
  Vm as ag,
  Zm as ah,
  Ag as ai,
  pr as aj,
  _v as ak,
  Cg as al,
  Ev as am,
  Nr as an,
  _g as ao,
  Dg as ap,
  es as aq,
  Ct as ar,
  Tg as as,
  Mg as at,
  Sv as au,
  pa as av,
  dt as aw,
  th as ax,
  Av as ay,
  Ue as az,
  Ze as b,
  Jg as c,
  Hg as d,
  Fg as e,
  Wg as f,
  lv as g,
  go as h,
  Xg as i,
  ev as j,
  nv as k,
  cv as l,
  Ug as m,
  Pg as n,
  zg as o,
  an as p,
  fv as q,
  iv as r,
  Vg as s,
  Ie as t,
  Lp as u,
  uv as v,
  Dp as w,
  ks as x,
  ap as y,
  op as z
};
