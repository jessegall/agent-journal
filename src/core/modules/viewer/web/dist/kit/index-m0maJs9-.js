/* @code-commandments-generated */
import { openBlock as l, createElementBlock as h, renderSlot as $e, createElementVNode as p, normalizeClass as ee, Fragment as X, renderList as re, normalizeStyle as we, defineComponent as Po, Comment as qo, h as cs, cloneVNode as Wo, createBlock as Y, withCtx as V, unref as G, createVNode as F, toDisplayString as M, createCommentVNode as N, inject as Fe, computed as I, resolveDynamicComponent as at, Transition as un, watch as be, ref as W, shallowRef as dn, TransitionGroup as Ho, mergeProps as pt, reactive as us, createTextVNode as fe, onMounted as je, onUnmounted as Me, nextTick as hn, useId as va, Teleport as ya, withModifiers as _e, isRef as Es, resolveDirective as Fo, withDirectives as mt, useModel as Un, useAttrs as wa, getCurrentInstance as Uo, mergeModels as Vn, getCurrentScope as ka, onScopeDispose as ba, onBeforeUnmount as ds, provide as Vo, onErrorCaptured as zo, toHandlers as Go, createSlots as Ko, withKeys as Jt, vModelText as zn, defineAsyncComponent as Yo } from "vue";
const Z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Jo = { class: "skeleton-line" }, Zo = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), h("span", Jo, [
      $e(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: ee(["bars", { faded: e.filled }])
      }, [
        (l(!0), h(X, null, re(e.bars, (s) => (l(), h("span", {
          key: s.width,
          class: ee(["bar", { still: e.still }]),
          style: we({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, et = /* @__PURE__ */ Z(Zo, [["__scopeId", "data-v-0ebb6933"]]), hs = Po({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== qo);
      return s.length !== 1 ? cs(X, { key: n }, s) : s[0].key == null ? Wo(s[0], { key: n }) : s[0];
    };
  }
}), Xo = ["aria-label"], Qo = ["aria-label"], er = ["aria-label"], tr = ["aria-label"], nr = ["aria-label"], sr = ["aria-label"], ar = ["aria-label"], or = {
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
    ], i = ["94%", "88%", "91%", "62%"].map((c) => ({ width: c, height: 10 })), r = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (c, d) => (l(), Y(hs, { value: e.shape }, {
      messages: V(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), h(X, null, re(t, (f) => p("div", {
            key: f.id,
            class: ee(["skeleton-message", { mine: f.mine }]),
            style: we({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, Xo)
      ]),
      older: V(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), h(X, null, re(t.slice(0, 3), (f) => (l(), h("div", {
            key: f.id,
            class: ee(["skeleton-message", { mine: f.mine }]),
            style: we({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, Qo)
      ]),
      cards: V(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), h(X, null, re(e.count, (f) => (l(), h("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (l(), h(X, null, re(n, (v) => F(et, {
              key: v.id,
              bars: v.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, er)
      ]),
      file: V(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), h(X, null, re(e.count, (f) => (l(), h("div", {
            key: f,
            class: "skeleton-file"
          }, [
            F(et, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), h(X, null, re(a, (v) => F(et, {
              key: v.id,
              bars: v.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, tr)
      ]),
      page: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          F(et, {
            class: "skeleton-heading",
            bars: r
          }),
          (l(!0), h(X, null, re(e.count, (f) => (l(), Y(et, {
            key: f,
            bars: G(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, nr)
      ]),
      text: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), h(X, null, re(e.count, (f) => (l(), Y(et, {
            key: f,
            bars: G(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, sr)
      ]),
      default: V(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), h(X, null, re(e.count, (f) => (l(), Y(et, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, ar)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ot = /* @__PURE__ */ Z(or, [["__scopeId", "data-v-c687fb85"]]), rr = {
  key: 1,
  class: "empty-state titled"
}, ir = { class: "empty-state-title" }, lr = { class: "empty-state-text" }, cr = {
  key: 2,
  class: "empty-state"
}, ur = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), Y(Ot, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), h("div", rr, [
      p("p", ir, M(e.title), 1),
      p("p", lr, [
        $e(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), h("p", cr, [
      $e(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Zt = /* @__PURE__ */ Z(ur, [["__scopeId", "data-v-b27e89b0"]]), dr = { class: "fold-group" }, hr = ["aria-expanded"], fr = { class: "fold-label" }, pr = {
  key: 0,
  class: "fold-count"
}, mr = {
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
    return (s, a) => (l(), h("div", dr, [
      p("button", {
        type: "button",
        class: ee(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", fr, M(e.label), 1),
        e.count !== "" ? (l(), h("span", pr, M(e.count), 1)) : N("", !0),
        p("span", {
          class: ee(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, hr),
      e.open ? $e(s.$slots, "default", {}, void 0, !0, 0) : N("", !0)
    ]));
  }
}, Ig = /* @__PURE__ */ Z(mr, [["__scopeId", "data-v-9ef1865c"]]), gr = Symbol("open-view"), Ue = Symbol.for("journal.window-context");
function $a() {
  const e = Fe(Ue, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const vr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), h("span", {
      class: "spinner",
      style: we({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, yr = /* @__PURE__ */ Z(vr, [["__scopeId", "data-v-eb453d6f"]]), wr = {
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
    return (s, a) => (l(), Y(at(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ee(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: V(() => [
        p("span", {
          class: ee(["btn-label", { hidden: e.busy }])
        }, [
          $e(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (l(), Y(yr, {
          key: 0,
          class: "btn-spinner"
        })) : N("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ Z(wr, [["__scopeId", "data-v-a2dc4bda"]]), kr = {
  class: "running",
  "data-running-command": ""
}, br = ["title"], $r = {
  key: "idle",
  class: "running-idle"
}, xr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), h("span", kr, [
      F(un, {
        name: "roll",
        mode: "out-in"
      }, {
        default: V(() => [
          e.text ? (l(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, M(e.text), 9, br)) : (l(), h("span", $r, M(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Rg = /* @__PURE__ */ Z(xr, [["__scopeId", "data-v-e3ee3449"]]), _r = ["aria-checked", "aria-label", "title"], Mr = {
  key: 0,
  class: "switch-inner"
}, Sr = {
  key: 0,
  class: "switch-word"
}, Er = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), h("button", {
      type: "button",
      class: ee(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: ee(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (l(), h("span", Mr, M(e.word), 1)) : N("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), h("span", Sr, M(e.word), 1)) : N("", !0)
    ], 10, _r));
  }
}, Dg = /* @__PURE__ */ Z(Er, [["__scopeId", "data-v-1bfb90f3"]]);
function xa(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Et(e, t) {
  return xa(() => localStorage, e, t);
}
function _a(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function fn(e, t) {
  return _a(() => localStorage, e, t);
}
function Ma(e, t) {
  be(t, (n) => fn(e, n), { deep: !0 });
}
function Ar(e, t) {
  return xa(() => sessionStorage, e, t);
}
function Cr(e, t) {
  return _a(() => sessionStorage, e, t);
}
const Xt = "journal.environment", Sa = W(Ar(Xt, Et(Xt, "")));
function Or(e) {
  Sa.value = e, Cr(Xt, e), fn(Xt, e);
}
const Qt = W(location.hash), As = dn(null), Cs = { integrations: "mcp", library: "team" };
function Tr() {
  if (!As.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Cs[n]) {
    location.replace(`#/${[Cs[n], ...s].join("/")}${t ? `?${t}` : ""}`), Qt.value = location.hash;
    return;
  }
  !n || As.value(n) || (Or(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Qt.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Qt.value = location.hash, Tr();
});
const De = I(() => {
  const [e, t = ""] = Qt.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((i) => {
    const [r, c = ""] = i.split("@"), [d = "", f = "", v = ""] = r.split(":");
    return { table: d, id: Number(f), comment: Number(v) || 0, env: c };
  });
  return {
    env: Sa.value,
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
}), pn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${pn.page(e)}?open=${t}`
};
function Br(e = "", t = 0, n = "") {
  location.hash = pn.page(e, t, n);
}
const Lr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ea(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([i]) => i !== "open" && i !== "sub").map(([i, r]) => `${i}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Lr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const ht = {};
function jg(e, t) {
  return ht[e] = t, () => ht[e] === t && delete ht[e];
}
function Aa(e, t, n = 0, s = "") {
  var i;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((i = ht[e]) != null && i.call(ht, t))) return;
  const a = De.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  Ea([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Ir(e, t, n, s = 0, a = "") {
  if (e === De.value.env) return Aa(t, n, s, a);
  const o = De.value.stack, i = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Ea([...i < 0 ? o : o.slice(0, i), { table: t, id: n, comment: s, env: e }], a);
}
function vt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Ir(s, a, Number(o), 0, t) : Aa(a, Number(o), 0, t);
}
function Rr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ke(e) {
  const t = Rr(e);
  t && vt(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Dr = ["stroke-width", "innerHTML"], Ae = {
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
    return (o, i) => (l(), h("svg", {
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
    }, null, 12, Dr));
  }
}, fs = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), Y(ye, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: V(() => [
        F(Ae, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, jr = {
  key: 1,
  class: "row-list-failure"
}, Nr = ["data-row"], Pr = {
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
    return (o, i) => !e.loaded && !e.failure ? (l(), Y(Ot, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), h("p", jr, M(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), Y(Zt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), h(X, { key: 3 }, [
      (l(), Y(at(e.arrival ? Ho : "ul"), pt(n.value, { class: "row-list" }), {
        default: V(() => [
          (l(!0), h(X, null, re(e.rows, (r) => (l(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            $e(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Nr))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && !s.value && e.rows.length ? (l(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: i[0] || (i[0] = (r) => a(e.older))
      }, "Show more")) : N("", !0)
    ], 64));
  }
}, qr = /* @__PURE__ */ Z(Pr, [["__scopeId", "data-v-7f34ada7"]]), Wr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Hr = {
  key: 1,
  class: "agent-rows-note"
}, Fr = {
  key: 2,
  class: "agent-rows-note"
}, Ur = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Vr = ["data-agent-row", "onClick"], zr = { class: "agent-row-name" }, Gr = { class: "agent-row-state" }, Kr = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = I(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), h("div", Wr, [
      e.loaded ? e.failure ? (l(), h("p", Hr, M(e.failure), 1)) : e.rows.length ? (l(), h(X, { key: 3 }, [
        p("p", Ur, M(s.value) + " running", 1),
        (l(!0), h(X, null, re(n.value, (i) => (l(), h("button", {
          key: i.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": i.id,
          onClick: (r) => G(vt)(`agents:${i.id}`)
        }, [
          p("span", zr, "#" + M(i.id) + " " + M(i.session), 1),
          p("span", Gr, M(i.ended_at ? "Closed" : "Running"), 1)
        ], 8, Vr))), 128))
      ], 64)) : (l(), h("p", Fr, M(e.none), 1)) : (l(), Y(Ot, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Ng = /* @__PURE__ */ Z(Kr, [["__scopeId", "data-v-a01e5a17"]]), Yr = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), h("span", {
      class: ee(["badge", e.tone])
    }, M(e.text), 3));
  }
}, Ca = /* @__PURE__ */ Z(Yr, [["__scopeId", "data-v-9e7e1157"]]), Jr = ["aria-valuenow", "aria-valuemax"], Zr = {
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
    return (s, a) => (l(), h("span", {
      class: ee(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: we({ width: n.value })
      }, null, 4)
    ], 10, Jr));
  }
}, Xr = /* @__PURE__ */ Z(Zr, [["__scopeId", "data-v-9eba6a85"]]), Qr = { class: "bars" }, ei = { class: "bar-name" }, ti = { class: "bar-value" }, ni = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => Math.max(1, ...n.items.map((i) => Number(i.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (i, r) => (l(), h("div", Qr, [
      (l(!0), h(X, null, re(e.items, (c, d) => (l(), Y(at(c.open ? "button" : "div"), {
        key: `${d}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: ee(["bar-row", c.tone, { opens: c.open }]),
        onClick: (f) => c.open && s("open", c.open)
      }, {
        default: V(() => [
          p("span", ei, M(c.label), 1),
          F(Xr, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", ti, M(c.value) + M(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, si = /* @__PURE__ */ Z(ni, [["__scopeId", "data-v-663427f4"]]), ai = { class: "bars" }, oi = {
  key: 0,
  class: "bars-title"
}, ri = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), h("div", ai, [
      e.node.title ? (l(), h("span", oi, M(e.node.title), 1)) : N("", !0),
      F(si, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, ii = /* @__PURE__ */ Z(ri, [["__scopeId", "data-v-7135bb11"]]), li = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (i) => ({ gap: `${i.gap || 14}px` }),
      row: (i) => ({ gap: `${i.gap || 12}px` }),
      grid: (i) => ({ gap: `${i.gap || 12}px`, gridTemplateColumns: `repeat(${i.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = I(() => n[s.node.type](s.node));
    return (i, r) => (l(), h("div", {
      class: ee([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: we(o.value)
    }, [
      (l(!0), h(X, null, re(e.node.children || [], (c, d) => (l(), Y(so, {
        key: d,
        node: c,
        onOpen: r[0] || (r[0] = (f) => a("open", f)),
        onFile: r[1] || (r[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Vt = /* @__PURE__ */ Z(li, [["__scopeId", "data-v-d142a3f4"]]), ci = {
  key: 0,
  class: "card-head"
}, ui = { class: "card-title" }, di = {
  key: 0,
  class: "card-note"
}, hi = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), h("section", {
      class: ee(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), h("header", ci, [
        p("span", ui, M(e.node.title), 1),
        e.node.note ? (l(), h("span", di, M(e.node.note), 1)) : N("", !0)
      ])) : N("", !0),
      F(Vt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, fi = /* @__PURE__ */ Z(hi, [["__scopeId", "data-v-67b72d40"]]), pi = (e, t, n) => Math.max(t, Math.min(n, e)), mi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, xe = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Os = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", $n = 80;
function Ts(e) {
  return e.length <= $n ? e : `${e.slice(0, $n + 1).replace(/\s+\S*$/, "") || e.slice(0, $n)}…`;
}
const Bs = {
  messages: (e) => Ts(Os(e.text)),
  comments: (e) => Ts(Os(e.text)),
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
}, gi = (e) => (Bs[e.table] ? Bs[e.table](e) : e.title || "") || "", vi = ["done", "cancelled"], Gn = {
  tasks: (e) => xe(e.completed_at) || (e.state === "cancelled" ? xe(e.updated_at) : 0),
  questions: (e) => e.answer ? xe(e.updated_at) : 0,
  plans: (e) => vi.includes(e.state) ? xe(e.updated_at) : 0,
  notices: (e) => xe(e.closed_at),
  secrets: (e) => xe(e.deleted_at),
  workers: (e) => e.state === "stopped" ? xe(e.updated_at) : 0,
  shares: (e) => xe(e.stopped_at),
  dumps: (e) => xe(e.completed_at),
  agents: (e) => e.state === "ended" ? xe(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? xe(e.created_at) : 0
}, yi = (e) => Gn[e.table] ? Gn[e.table](e) : 0, Oa = (e) => yi(e) > 0, wi = (e) => !!Gn[e], Ta = (e) => xe(e.created_at), en = (e) => xe(e.updated_at) || Ta(e), ki = (e) => "task_ids" in e, mn = typeof document < "u" && document.documentElement.classList.contains("phone"), bi = "Files are attached on the computer; the phone sends text.", Ba = 1024, $i = Ba * 1024 * 1024, xi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ba} MB limit for one file.`;
function _i() {
  return () => {
  };
}
function Ls(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Mi(e = window) {
  if (!Ls(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ls(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const La = "status.summary", ve = us({
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
}), Si = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Ia = () => !!ve.countdown || Si() || ve.starting;
function Ei(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function Ai(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Ci() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Oi(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Ci(), !0);
}
let jt = { version: "", started: 0 };
function Ti(e) {
  return e.version ? (jt.version || (jt = { version: e.version, started: e.started || 0 }), e.version !== jt.version || (e.started || 0) !== jt.started) : !1;
}
function Bi(e) {
  Ai(e.countdown), Ei(e.ready, e.step), (Oi(!!e.updating, e.step) || !e.updating && !Li(e) && Ti(e)) && Mi(window);
}
const Li = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Is = 2e4, Ii = 3e5, qe = 6e5, Nt = 6, Ri = 500, Di = "/journal/summary", Rs = mn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, ji = (e) => e.split("?")[0].endsWith(Di), Ra = (e, t) => Object.assign(new Error(t), { status: e });
async function Ni(e, t, n = Ra) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Pi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class qi {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Nt;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Nt;
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
        body: Pi(s),
        signal: AbortSignal.timeout(a || (r ? Ii : Is))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((d) => setTimeout(d, Ri)), this.reach(t, n, s, a, o - 1, i);
    }
  }
  async send(t, n, s, a = 0, o = Nt, i = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : _i(), c = await this.reach(t, n, s, a, o, i).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return Ni(c, `${c.status} ${c.statusText}`).catch((d) => {
      throw d.blocked && t !== "GET" && this.refused(d.message), d;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Rs, signal: AbortSignal.timeout(Is) });
    if (!n.ok) throw Ra(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, i = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Nt, o).then((c) => (this.written(n), c));
    if (Ia() && !ji(n))
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
const Re = new qi(), Ee = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const kt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: i = !1 }) => [i ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), bt = "the page does not know its environment yet", Wi = "X-Journal-Env", Hi = "X-Journal-Request-At", xn = "/viewer/voices/figures/";
class ps {
  constructor({ env: t = () => De.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ps({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Hi]: String(Date.now()), ...this.env() ? { [Wi]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === bt ? Promise.reject(new Error(bt)) : Re.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === bt ? Promise.reject(new Error(bt)) : Re.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : bt;
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
    return Re.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: i = [], tasks: r = [], closed: c = !1, docked: d = !1 } = {}) {
    const f = this.here(`/${t}${ue({ limit: n, before: s, after: a, since: o, ids: i.join(","), tasks: r.join(","), closed: c ? "1" : "", docked: d ? "1" : "" })}`);
    return this.get(f, `${t}.${kt({ before: s, after: a, since: o, ids: i, tasks: r, closed: c, docked: d })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const i = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(i, `chats/${t}.${kt({ before: s, since: a, docked: o })}`);
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
    if (mn) return Promise.reject(Object.assign(new Error(bi), { status: 403 }));
    if (s.size > $i) return Promise.reject(new Error(xi(s)));
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
    return Re.bytes(t);
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
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${kt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${kt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${kt(n)}`);
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
    return Re.request("GET", xn + "figures.json");
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
    return `${this.base}/${t ? `?env=${Ee(t)}` : ""}${pn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ie = new ps({ base: mn ? "/p" : "" }), Fi = (e) => Re.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Ui = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ui).map(([e, t]) => ({ key: e, label: t }));
const Ds = (e) => e.status === "stopped" ? 1 : 0, Vi = "main", zi = (e) => e.filter((t) => t.role === Vi).sort((t, n) => Ds(t) - Ds(n) || xe(n.heard_at) - xe(t.heard_at))[0] || null, Gi = { me: 1, people: [] }, z = us({
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
  people: Gi,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Et("journal.activity", !0),
  wide: !1,
  sideMini: Et("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ma("journal.activity", () => z.activity);
Ma("journal.side.mini", () => z.sideMini);
const gt = I(() => zi(z.agents));
I(() => !!gt.value && z.live.some((e) => e.agent.session === gt.value.session && e.environment === De.value.env));
I(() => !!gt.value && ["busy", "working"].includes(gt.value.status));
function Ki(e) {
  if (!e) return "";
  const t = typeof e == "string" ? Date.parse(e) / 1e3 : e, n = Math.max(0, Date.now() / 1e3 - t);
  return n < 60 ? "now" : n < 3600 ? `${Math.floor(n / 60)}m` : n < 86400 ? `${Math.floor(n / 3600)}h` : `${Math.floor(n / 86400)}d`;
}
function js(e) {
  const t = Ki(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Da(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Ns(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const _n = (e) => String(e).padStart(2, "0");
function Yi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${_n(t % 60)}s` : `${Math.floor(t / 3600)}h ${_n(Math.floor(t % 3600 / 60))}m ${_n(t % 60)}s`;
}
const Ji = ["working", "busy", "waiting", "compacting"], Zi = (e) => Ji.includes(e), Xi = "builder";
I(() => !z.settings || z.settings.features.file_feed !== !1);
const Qi = I(() => !z.settings || z.settings.features.status_bar !== !1);
I(() => z.settings && z.settings.workers && z.settings.workers.mode || Xi);
I(() => !z.settings || !z.settings.tasks || z.settings.tasks.auto !== !1);
I(() => !!(z.settings && z.settings.reviewing && z.settings.reviewing.reviewer));
I(() => !z.settings || z.settings.features.sharing !== !1);
const tn = 50, ms = 100, el = { messages: 25 }, Ie = (e) => el[e] || tn;
function tl(e, t) {
  if (e !== "messages") return Math.max(t.length - Ie(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Ie(e)) return s;
  return 0;
}
const nl = "review_step", sl = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === nl).sort((t, n) => t.id - n.id), al = 5, ol = 500, rl = 3e3, il = () => z.entries.length ? z.entries[z.entries.length - 1].id : 0, zt = { env: "", id: 0 }, ll = () => !!(z.bar && z.bar.length) || Zi(gt.value && gt.value.status);
function cl({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function ul() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: ms })))).then(sl);
}
function dl() {
  return zt.env !== ie.env() && Object.assign(zt, { env: ie.env(), id: il() }), ie.entries(zt.id);
}
function hl(e) {
  e.length && (zt.id = e[e.length - 1].id, sc(e));
}
async function fl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", tn);
}
const Kn = /* @__PURE__ */ new Map();
async function Yn(e, t) {
  const n = `${e}:${ie.env()}`, s = Kn.get(n);
  if (!s) return Ps(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(en)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, i = await ie.list("workers", { limit: t, since: a, after: o });
  if (!i.is_last_page)
    return Kn.delete(n), Yn(e, t);
  const r = new Set(i.rows.map((c) => c.id));
  return Ps(
    n,
    [...s.filter((c) => !r.has(c.id)), ...i.rows].sort((c, d) => c.id - d.id)
  );
}
const Ps = (e, t) => (Kn.set(e, t), t);
async function qs(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Ws = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => ll() ? ol : rl,
    take: (e) => Array.isArray(e) && (z.bar = e),
    active: () => Qi.value
  },
  "agents.index": { read: () => qs(ie, al), every: 1e3, take: (e) => z.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => z.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      z.summary = e, Bi(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => z.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => z.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (z.people = e) },
  "entries.recent": { read: dl, every: 1e3, take: hl },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: cl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Yn("workers.index", Ie("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Yn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: ul, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Ie("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: fl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => qs(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: tn }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: tn }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), pl = 6e4, ml = 3e3, gl = 4, vl = 300, yl = 5e3, ja = /* @__PURE__ */ new Map();
function gn(e) {
  if (!(e in Ws)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ws[e];
}
function wl(e) {
  const t = gn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return yl;
  }
}
const kl = (e) => e / 2 + Math.random() * e / 2, Na = (e) => [...e.users.values()].pop(), gs = (e) => ja.get(e.place) === e, bl = () => Math.random() * vl, vs = () => document.hidden;
function $l(e) {
  const t = wl(e);
  return e.failures ? kl(Math.min(e.key === La ? ml : pl, t * 2 ** e.failures)) : Math.max(t, gl * e.took);
}
function Pa(e, t) {
  clearTimeout(e.timer), !(!gs(e) || e.paused || vs()) && (e.timer = setTimeout(() => xl(e), t));
}
function xl(e) {
  return gs(e) ? e.running ? (e.again = !0, e.running) : (e.running = El(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const _l = (e) => {
  var t, n;
  return !e.paused && !vs() && (((n = (t = gn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Na(e).active() && (!Ia() || e.key === La);
};
async function Ml(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Re.attemptOnce(() => gn(e.key).read(Na(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Sl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = gn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function El(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      _l(e) && Sl(e, await Ml(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && gs(e) && !e.paused);
  Pa(e, $l(e));
}
const Al = () => vs() || ja.forEach((e) => Pa(e, bl()));
document.addEventListener("visibilitychange", Al);
const Cl = 60, Ol = (e, t) => xe(e.created_at) >= xe(t.created_at) - Cl, Tl = (e, t) => e.id > 0 && e.table === t.table && Ol(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ys = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Tl(s, n))), Mn = [
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
}), Tt = {
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
}, Bl = ["secrets", "plugins"], qa = Object.keys(Tt).filter((e) => !(mn && Bl.includes(e)));
I(() => qa.map((e) => ({ name: e, ...Tt[e] })));
const vn = (e) => Tt[e], Wa = new Map(qa.flatMap((e) => [e, e.replace(/s$/, ""), Tt[e].title.toLowerCase()].map((t) => [t, e]))), ft = (e) => Wa.get(String(e).toLowerCase()) || "", Ha = [...Wa.keys()].sort((e, t) => t.length - e.length).join("|"), Xe = /* @__PURE__ */ new Set(), ws = W(0), Bt = /* @__PURE__ */ new Set(), Lt = /* @__PURE__ */ new Set(), Ge = /* @__PURE__ */ new Set(), Jn = /* @__PURE__ */ new Set(), Ll = /* @__PURE__ */ new Map(), Il = /* @__PURE__ */ new Map();
let ut = !1, $t = null;
const Rl = (e, t) => e.id - t.id, Dl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, jl = { messages: Dl }, Fa = (e) => jl[e] || Rl;
function Ua(e) {
  return ws.value, Xe.has(e) || (Xe.add(e), z.booted && (!Bt.has(e) || Lt.has(e)) && queueMicrotask(() => wn([e], !1))), z.rows[e] || [];
}
function Nl(e) {
  const t = z.rows[e] || [], n = tl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  z.rows[e] = t.filter((a) => s.has(a) || wi(e) && !Oa(a)), z.paging.size[e] = Ie(e), z.paging.more[e] = !0;
}
const Pl = /* @__PURE__ */ new Set();
function ql() {
  Xe.forEach(Nl), Xe.clear(), Ll.clear(), Il.clear(), ws.value += 1;
}
be(() => `${De.value.env}/${De.value.page}/${De.value.open ? De.value.open.table : ""}`, ql);
be(
  () => z.booted,
  (e) => e && wn(
    [...Xe].filter((t) => !Bt.has(t)),
    !1
  )
);
const Zn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !ki(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Va(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Zn(s) && !Zn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function za(e, t) {
  Bt.add(e), ws.value += 1;
  const n = z.rows[e] || [];
  z.rows[e] = [...Va(n, t.rows), ...ys(n.filter((s) => s.id === 0), t.rows)], z.paging.size[e] = z.paging.size[e] || Ie(e), z.paging.more[e] = !t.is_last_page;
}
async function Wl(e) {
  const t = new Set((z.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Ie(e) });
  yn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ys((z.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return za(e, { ...n, rows: [...n.rows, ...a].sort(Fa(e)) }), z.paging.size[e] = Ie(e), Ga.has(e) && await Ka(e), z.rows[e];
}
const yn = (e, t) => z.counts = { ...z.counts, [e]: t };
async function Hl(e) {
  const t = z.rows[e] || [], n = Math.max(0, ...t.map(en)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await ie.list(e, { limit: Ie(e), since: n, after: s });
  if (yn(e, a.counts), !a.is_last_page) return Wl(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), i = ys(t.filter((r) => !o.has(r.id)), a.rows).concat(Va(t, a.rows));
  return z.rows[e] = i.sort(Fa(e)), z.paging.size[e] = z.rows[e].length, z.rows[e];
}
const Sn = /* @__PURE__ */ new Set();
async function Fl(e, t = !1) {
  e.forEach((n) => Lt.delete(n)), e.forEach((n) => Jn.add(n));
  try {
    await Jl(e, t);
  } finally {
    e.forEach((n) => Jn.delete(n));
  }
}
async function Ul(e) {
  const t = await ie.list(e, { limit: Ie(e) });
  yn(e, t.counts), za(e, t);
}
async function Vl(e) {
  yn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Ga = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ka(e) {
  const t = (z.rows[e] || []).filter((a) => Zn(a) && (e !== "plans" || !Oa(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  z.rows[e] = (z.rows[e] || []).map((a) => s.get(a.id) || a);
}
const zl = (e, t) => !Bt.has(e) || t && (z.paging.size[e] || Ie(e)) === Ie(e) && !Pl.has(e);
async function Gl(e, t) {
  if (!Xe.has(e)) return Vl(e);
  const n = await (zl(e, t) ? Ul(e) : Hl(e));
  return Ga.has(e) && await Ka(e), n;
}
async function Kl() {
  const [e, t] = await Promise.all([ie.entries(0, ms), ie.settings()]);
  Za([...Et(Ja(), []), ...e]), JSON.stringify(t) !== JSON.stringify(z.settings) && (z.settings = t);
}
const Yl = (e, t) => Gl(e, t).then(
  () => null,
  () => e
);
async function Jl(e, t) {
  const n = (await Promise.all(e.map((s) => Yl(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ge.add(s), Lt.add(s))), t && await Kl(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ya = 1e3, Zl = 15e3;
let Pt = Ya;
async function Xl() {
  return $t || ($t = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ge].some((e) => !Sn.has(e)) || ut; ) {
      const e = ut, t = [...e ? Object.keys(z.rows) : Ge].filter((s) => Tt[s] && (Xe.has(s) || s in z.rows)).filter((s) => e || !Xe.has(s) || Lt.has(s) || !Bt.has(s)).filter((s) => !Sn.has(s)), n = [...Ge].filter((s) => Sn.has(s));
      Ge.clear(), n.forEach((s) => Ge.add(s)), ut = !1;
      try {
        await Fl(t, e), Pt = Ya;
      } catch {
        ut = ut || e, await new Promise((a) => setTimeout(a, Pt)), Pt = Math.min(Pt * 2, Zl);
      }
    }
  })().finally(() => $t = null), $t);
}
function wn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Jn.has(n)).forEach((n) => {
    Ge.add(n), t && Lt.add(n);
  }), Ge.has("settings") && (ut = !0), Xl();
}
const Ja = () => {
  var e;
  return `typed-entries:${((e = z.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Za(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  z.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ms), fn(Ja(), z.entries.slice(-50));
}
const Ql = ["created", "updated", "deleted"], ec = { phases: ["phases", "plans"] }, Xn = (e) => ec[e] || [e], tc = (e) => Ql.includes(e.entry_type) ? [...Xn(e.data.table), ...(e.data.joins || []).flatMap(Xn)] : [];
function nc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of Xn(t.data.table).filter((s) => z.rows[s]))
      z.rows[n] = z.rows[n].filter((s) => s.id !== t.data.id);
}
function sc(e) {
  Za([...z.entries, ...e]), nc(e), wn([...new Set(e.flatMap(tc))].filter((t) => t && t !== "agents"));
}
Fi((e) => z.streamOpen || wn([e]));
const Qn = [], ac = 2e3, ze = /* @__PURE__ */ new Map(), oc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, rc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ot(e, { first: t = !1 } = {}) {
  t ? Qn.unshift(e) : Qn.push(e), ze.clear();
}
function Xa(e, t, n) {
  var a;
  const s = Ua(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const ic = (e) => Ua(e.table).find((t) => t.id === e.id) === e.row, lc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function He(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function cc(e, t) {
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
function At(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return uc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function uc(e) {
  return e.split(rc).map((t, n) => n % 2 ? t : t.replace(oc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Hs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function dc(e) {
  const [t, , ...n] = e, s = Hs(t).map((o) => `<th>${At(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Hs(o).map((i) => `<td>${At(i)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function hc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${At(a)}</li>`).join("")}</${s}>`;
}
const Fs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
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
      const r = t.findIndex((d, f) => f > s && /^(```|~~~)/.test(d)), c = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(s + 1, c).join(`
`)}</code></pre>`), s = c + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${At(o[2])}</h${r}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Fs(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(dc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(hc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Qa(
          t.slice(s, r).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let i = s;
    for (; i < t.length && t[i].trim() && !Fs(t, i) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[i]); )
      i += 1;
    n.push(`<p>${At(t.slice(s, i).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = i;
  }
  return n.join("");
}
const fc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, pc = (e) => e.kind !== "text" && !fc.test(e.html);
function mc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Qa(s).replace(/\u0001(\d+)\u0001/g, (o, i) => t[Number(i)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : pc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Gt(e, t = { env: "" }) {
  const n = lc(e, t), s = ze.get(n);
  if (ze.delete(n), s && s.reads.every(ic))
    return ze.set(n, s), s.html;
  const a = [], o = mc(cc(e, { ...t, reads: a }));
  return ze.set(n, { html: o, reads: a }), ze.size > ac && ze.delete(ze.keys().next().value), o;
}
const eo = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, nn = (e) => String(e || "").replace(eo, (t, n, s, a) => a), gc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), qt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, vc = /^Traceback \(most recent call last\):/m, yc = 8;
function to(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, yc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function wc(e) {
  const t = [...e.matchAll(gc)].map((s) => s.index);
  if (qt.lastIndex = 0, !t.length || !qt.test(e)) return null;
  qt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), i = [...o.matchAll(qt)];
    return { head: i.length ? o.slice(0, i[0].index).trim() : o, frames: i.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: to(n), tail: "" } : null;
}
function kc(e) {
  const t = vc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: to([o]), tail: n.slice(a).join(`
`) };
}
ot((e) => {
  const t = nn(e), n = kc(t) || wc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const es = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", bc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", $c = `${es} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, xc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", _c = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Us = {
  js: { keywords: es, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: bc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: $c, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: es, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: xc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: _c, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Vs(e, t, n) {
  return n && e.startsWith(n, t);
}
function Mc(e, t) {
  const n = Us[t] || Us.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const i = (r, c) => c && a.push({ kind: r, value: c });
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
    if (Vs(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      i("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && Vs(e, o, n.block[0])) {
      const d = e.indexOf(n.block[1], o + n.block[0].length), f = d < 0 ? e.length : d + n.block[1].length;
      i("comment", e.slice(o, f)), o = f;
      continue;
    }
    const c = (n.triple || []).find((d) => e.startsWith(d, o));
    if (c) {
      const d = e.indexOf(c, o + 3), f = d < 0 ? e.length : d + 3;
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
      const f = e.slice(o).match(/^[\w$]+/)[0], v = n.lower ? f.toLowerCase() : f, S = n.property && /^\s*:/.test(e.slice(o + f.length));
      i(s.has(v) ? "keyword" : S ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function Sc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Mc(e, t))
    a.split(`
`).forEach((i, r) => {
      r && n.push(""), i && (n[n.length - 1] += s === "plain" ? He(i) : `<span class="tok-${s}">${He(i)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Ec(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Ac = 1500, zs = /* @__PURE__ */ new WeakMap();
async function Cc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Ec(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(zs.get(t)), zs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Ac)
  )));
}
typeof document < "u" && document.addEventListener("click", Cc, !0);
const Oc = /^(```|~~~)\s*(\w+)?\s*$/, Gs = /^\s{4,}\S/, Tc = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Bc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function no(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Lc(e) {
  const t = no(e.join(`
`));
  return (Bc.find(([, n]) => n.test(t)) || ["text"])[0];
}
function Ks(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Sc(no(e.join(`
`)), t || Lc(e)).join(`
`)}</code></pre></div>` };
}
function Ic(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const i = t[o].match(Oc);
    if (i) {
      const r = t.findIndex((d, f) => f > o && d.trim().startsWith(i[1])), c = r < 0 ? t.length : r;
      a(), n.push(Ks(t.slice(o + 1, c).map(nn), i[2] ? i[2].toLowerCase() : "")), o = c + 1;
      continue;
    }
    if (Gs.test(t[o])) {
      let r = o;
      for (; r < t.length && (Gs.test(t[r]) || !t[r].trim()); ) r += 1;
      for (; r > o && !t[r - 1].trim(); ) r -= 1;
      const c = [];
      for (; s.length && s[s.length - 1].trim() && Tc.test(s[s.length - 1].trim()); ) c.unshift(s.pop());
      if (r - o + c.length >= 2) {
        a(), n.push(Ks([...c, ...t.slice(o, r)].map(nn), "")), o = r;
        continue;
      }
      s.push(...c);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ot((e) => Ic(e));
const Rc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Dc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function jc(e) {
  const t = Rc.exec(e);
  if (t && ft(t[1])) return { at: t.index, length: t[0].length, table: ft(t[1]), id: Number(t[2]), label: t[3] };
  const n = Dc.exec(e), s = n && ft(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Nc(e, t, n, s) {
  const a = Xa(s, e, t), o = nn(a ? gi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${He(vn(e).title)} ${t}</span><span class="row-card-title">${He(o)}</span></a>`;
}
ot(
  (e, t) => {
    const n = jc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Nc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Pc = /\.(png|jpe?g|gif|webp|svg)$/i, qc = (e) => Pc.test(e), Wc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Hc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Fc(e, t) {
  const n = Wc.exec(e), [, s, a, o, i, r] = n || [], c = n && ft(s || o), d = c && Xa(t, c, Number(a || i));
  if (!d || !(d.files || []).includes(r)) return null;
  const f = ie.in(t.env).fileUrl(c, d.id, r), v = `${vn(c).title} ${d.id} · ${He(r)}`, S = qc(r) ? `<img class="file-card-image" src="${f}" alt="${He(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${He(r)}">${S}<span class="file-card-name">${v}</span></a>` };
}
function Uc(e) {
  const t = Hc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${He(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ot(
  (e, t) => {
    if (t.inline) return null;
    const n = Fc(e, t) || Uc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Vc = /`([^`\n]+)`/g;
ot((e) => e.replace(Vc, (t, n) => `<code>${n}</code>`));
const Ys = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${pn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ot(
  (e, t) => e.replace(eo, (n, s, a, o) => Ys[s] ? Ys[s](a, o, t) : o)
);
const zc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Gc = new RegExp(`\\b(${Ha}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Kc = new RegExp(`\\b(${Ha}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Yc = (e, t) => `<a class="row-pill" href="#" data-peek="${ft(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Jc = (e) => e.replace(Kc, (t, n, s) => s.replace(/\d+/g, (a) => Yc(n.replace(/s$/i, ""), a))), Zc = (e) => Jc(e).replace(
  Gc,
  (t, n, s, a = "", o) => {
    const i = s || o;
    return `<a class="row-pill" href="#" data-peek="${ft(n)}:${i}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${i}${a ? `:${a}` : ""}</span></a>`;
  }
);
ot(
  (e, t) => t.rowNames === !1 ? e : e.split(zc).map((n, s) => s % 2 ? n : Zc(n)).join("")
);
const Xc = ["innerHTML"], Qc = ["innerHTML"], eu = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Gt(s, { env: De.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => G(Ke) && G(Ke)(...o)),
      innerHTML: n.value
    }, null, 8, Xc)) : (l(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => G(Ke) && G(Ke)(...o)),
      innerHTML: n.value
    }, null, 8, Qc));
  }
}, dt = /* @__PURE__ */ Z(eu, [["__scopeId", "data-v-30fd9c25"]]), tu = { class: "fact" }, nu = { class: "fact-label" }, su = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), h("div", tu, [
      p("span", nu, M(e.label), 1),
      F(dt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, au = /* @__PURE__ */ Z(su, [["__scopeId", "data-v-3a88ecf8"]]), ou = { class: "list" }, ru = { class: "list-label" }, iu = {
  key: 1,
  class: "list-note"
}, lu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), h("div", ou, [
      (l(!0), h(X, null, re(e.items, (o, i) => (l(), Y(at(o.open ? "button" : "div"), {
        key: i,
        type: o.open ? "button" : void 0,
        class: ee(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          p("span", ru, M(o.label), 1),
          o.badge ? (l(), Y(Ca, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : N("", !0),
          o.note ? (l(), h("span", iu, M(o.note), 1)) : N("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, cu = /* @__PURE__ */ Z(lu, [["__scopeId", "data-v-ebe2ae0a"]]), uu = { class: "table" }, du = {
  key: 0,
  class: "table-row empty"
}, hu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, i) => (l(), h("div", uu, [
      p("div", {
        class: "table-row head",
        style: we(a.value)
      }, [
        (l(!0), h(X, null, re(e.columns, (r) => (l(), h("span", {
          key: r,
          class: "cell"
        }, M(r), 1))), 128))
      ], 4),
      (l(!0), h(X, null, re(e.rows, (r, c) => (l(), Y(at(r.open ? "button" : "div"), {
        key: c,
        type: r.open ? "button" : void 0,
        class: ee(["table-row", r.tone, { opens: r.open }]),
        style: we(a.value),
        onClick: (d) => r.open && s("open", r.open)
      }, {
        default: V(() => [
          (l(!0), h(X, null, re(r.cells, (d, f) => (l(), h("span", {
            key: f,
            class: "cell"
          }, M(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), h("div", du, M(e.empty), 1)) : N("", !0)
    ]));
  }
}, fu = /* @__PURE__ */ Z(hu, [["__scopeId", "data-v-9326a52e"]]), pu = { class: "stat-value" }, mu = { class: "stat-label" }, gu = {
  key: 0,
  class: "stat-note"
}, vu = {
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
    return (s, a) => (l(), Y(at(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: ee(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        p("span", pu, M(e.value), 1),
        p("span", mu, M(e.label), 1),
        e.note ? (l(), h("span", gu, M(e.note), 1)) : N("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, yu = /* @__PURE__ */ Z(vu, [["__scopeId", "data-v-ad0db6d6"]]), wu = { class: "code" }, ku = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, i) => (l(), Y(hs, {
      value: e.node.type
    }, {
      stack: V(() => [
        F(Vt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: V(() => [
        F(Vt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: V(() => [
        F(Vt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: V(() => [
        F(fi, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: V(() => [
        p("h3", {
          class: ee(["heading", `level-${e.node.level || 2}`])
        }, M(e.node.text), 3)
      ]),
      divider: V(() => [...i[2] || (i[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: V(() => [
        F(yu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: i[0] || (i[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: V(() => [
        F(ii, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: V(() => [
        F(fu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: V(() => [
        F(cu, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: V(() => [
        F(dt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: V(() => [
        F(au, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: V(() => [
        F(Ca, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: V(() => [
        p("pre", wu, [
          p("code", null, M(e.node.text), 1)
        ])
      ]),
      file: V(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: i[1] || (i[1] = (r) => a(e.node))
        }, M(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), so = /* @__PURE__ */ Z(ku, [["__scopeId", "data-v-cbdcf540"]]), bu = { class: "dashboard" }, $u = { class: "trail" }, xu = ["onClick"], _u = {
  key: 0,
  class: "gone",
  role: "status"
}, Mu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (S) => S in (n.document.pages || {}), o = W(!!n.page && !a(n.page)), i = W(n.page && !o.value ? [n.page] : []), r = I(() => i.value.at(-1) || n.document.start), c = I(() => (n.document.pages || {})[r.value] || null), d = (S) => ((n.document.pages || {})[S] || {}).title || S, f = (S) => {
      o.value = !1, i.value = [...i.value, S];
    }, v = (S) => {
      o.value = !1, i.value = i.value.slice(0, S);
    };
    return be(
      () => n.document.start,
      () => i.value = []
    ), (S, A) => (l(), h("div", bu, [
      e.document.broken ? (l(), Y(Zt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          fe(M(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), Y(Zt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: V(() => [
          fe(M(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), h(X, { key: 2 }, [
        p("nav", $u, [
          p("button", {
            type: "button",
            class: ee(["step", { current: !i.value.length }]),
            onClick: A[0] || (A[0] = (R) => v(0))
          }, M(d(e.document.start)), 3),
          (l(!0), h(X, null, re(i.value, (R, k) => (l(), h(X, {
            key: `${k}-${R}`
          }, [
            A[2] || (A[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: ee(["step", { current: k === i.value.length - 1 }]),
              onClick: (y) => v(k + 1)
            }, M(d(R)), 11, xu)
          ], 64))), 128))
        ]),
        o.value ? (l(), h("p", _u, "What you opened is no longer in this dashboard. Here is its start page.")) : N("", !0),
        F(un, {
          name: "page",
          mode: "out-in"
        }, {
          default: V(() => [
            (l(), h("div", {
              key: r.value,
              class: "page"
            }, [
              F(so, {
                node: c.value.view,
                onOpen: f,
                onFile: A[1] || (A[1] = (R) => s("file", R))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : N("", !0)
    ]));
  }
}, Pg = /* @__PURE__ */ Z(Mu, [["__scopeId", "data-v-fbe83734"]]);
function Su(e, t, n, s = () => window) {
  je(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Me(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Eu = (e, t = () => !0) => Su("keydown", (n) => n.key === "Escape" && t() && e());
function Au(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = W(!1), a = I(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Eu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Cu = 80, lt = us([]);
function Ou(e) {
  const t = Symbol("layer"), n = () => lt.includes(t) && lt.splice(lt.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !lt.includes(t) && lt.push(t), s || n();
    },
    { immediate: !0 }
  ), Me(n), I(() => Cu + Math.max(0, lt.indexOf(t)));
}
let ao = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ao = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Tu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Bu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const i = [...e.value.querySelectorAll(Tu)];
    if (!i.length) return o.preventDefault();
    const [r, c] = [i[0], i.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  je(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : ao, document.addEventListener("keydown", a), hn(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Me(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Lu = ["aria-modal", "aria-label", "aria-labelledby"], Iu = {
  key: 0,
  class: "dialog-head"
}, Ru = ["id", "tabindex"], Du = {
  key: 1,
  class: "dialog-foot"
}, ju = 500, Nu = 400, Pu = {
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
    const n = e, s = t, { visible: a, close: o, closed: i } = Au(s, n), r = Ou(a), c = W(null), d = W(null), f = W(null), v = va(), S = W(!1), A = Date.now();
    n.modal && Bu(d, () => s("escape"), f);
    function R() {
      if (!n.modal) return n.closable && o();
      S.value = !0, setTimeout(() => S.value = !1, Nu);
    }
    function k(P) {
      !n.modal || Date.now() - A >= ju || ![" ", "Enter"].includes(P.key) || (P.preventDefault(), P.stopPropagation());
    }
    const y = () => c.value && (c.value.scrollTop = c.value.scrollHeight), B = new MutationObserver(y);
    return be(c, (P) => {
      B.disconnect(), P && n.follow && (B.observe(P, { childList: !0, subtree: !0, characterData: !0 }), y());
    }), Me(() => B.disconnect()), (P, J) => (l(), Y(ya, { to: "body" }, [
      F(un, {
        name: "dialog",
        appear: "",
        onAfterLeave: G(i)
      }, {
        default: V(() => [
          G(a) ? (l(), h("div", {
            key: 0,
            class: ee(["dialog", { large: e.large, sheet: e.sheet }]),
            style: we({ zIndex: G(r) }),
            onClick: _e(R, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: d,
              class: ee(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: S.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? G(v) : void 0,
              onKeydownCapture: k
            }, [
              e.bare ? N("", !0) : (l(), h("header", Iu, [
                p("h3", {
                  id: G(v),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, M(e.title), 9, Ru),
                e.closable ? (l(), Y(fs, {
                  key: 0,
                  onClick: G(o)
                }, null, 8, ["onClick"])) : N("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: ee(["dialog-body", { bare: e.bare }])
              }, [
                $e(P.$slots, "default", {}, void 0, !0)
              ], 2),
              P.$slots.foot ? (l(), h("footer", Du, [
                $e(P.$slots, "foot", {}, void 0, !0)
              ])) : N("", !0)
            ], 42, Lu)
          ], 6)) : N("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, qu = /* @__PURE__ */ Z(Pu, [["__scopeId", "data-v-6d1ecd98"]]), Ve = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Le = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Wu = 6;
function ks(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Hu = (e) => {
  const t = ks(e, Ve.lineChars), n = Math.max(Ve.minWidth, Math.max(...t.map((s) => s.length)) * Ve.charWidth + Ve.padX * 2);
  return { name: e, lines: t, line: Ve.line, padY: Ve.padY, width: n, height: t.length * Ve.line + Ve.padY * 2 };
};
function Fu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (i) => {
    a.set(i, "open"), t.forEach((r, c) => {
      if (r[0] !== i) return;
      const d = a.get(r[1]);
      d === "open" ? s.add(c) : d || o(r[1]);
    }), a.set(i, "done");
  };
  return [...n, ...e].forEach((i) => a.has(i) || o(i)), s;
}
function Uu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, i]) => {
      n.get(i) < n.get(o) + 1 && (n.set(i, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Vu(e, t, n) {
  const s = [];
  e.forEach((i) => {
    var r;
    return (s[r = n.get(i)] || (s[r] = [])).push(i);
  });
  const a = () => new Map(s.flatMap((i) => i.map((r, c) => [r, c]))), o = (i, r) => {
    const c = a(), d = (f) => {
      const v = r(f).map((S) => c.get(S));
      return v.length ? v.reduce((S, A) => S + A, 0) / v.length : c.get(f);
    };
    return [...i].sort((f, v) => d(f) - d(v));
  };
  for (let i = 0; i < Wu; i++) {
    const r = i % 2 === 0, c = s.map((d, f) => f);
    (r ? c.slice(1) : c.slice(0, -1).reverse()).forEach((d) => {
      const f = (v) => t.filter((S) => S[r ? 1 : 0] === v).map((S) => S[r ? 0 : 1]);
      s[d] = o(s[d], f);
    });
  }
  return s;
}
function zu(e, t) {
  const n = /* @__PURE__ */ new Map(), s = (a, o, i, r) => {
    const c = `${a[o]}:${i}`;
    (n.get(c) || n.set(c, []).get(c)).push({ arrow: a, end: o, other: r });
  };
  e.forEach((a) => {
    s(a, "from", a.back ? "top" : "bottom", a.to), s(a, "to", a.back ? "bottom" : "top", a.from);
  });
  for (const a of n.values())
    a.sort((o, i) => t.get(o.other).x - t.get(i.other).x), a.forEach(({ arrow: o, end: i }, r) => o[`${i}Share`] = (r + 1) / (a.length + 1));
}
function Gu(e) {
  const t = [...new Set(e.flatMap(([T, O]) => [T, O]))], n = new Set(e.map(([, T]) => T)), s = t.filter((T) => !n.has(T)), a = Fu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((T, O) => !a.has(O)), i = Uu(t, o), r = Vu(t, o, i), c = new Map(t.map((T) => [T, Hu(T)])), d = r.map((T) => T.reduce((O, H) => O + c.get(H).width, 0) + Be.across * (T.length - 1)), f = Math.max(...d) + Be.margin * 2, v = Yu(e, i, r.length), S = /* @__PURE__ */ new Map();
  let A = Be.margin;
  r.forEach((T, O) => {
    let H = (f - d[O]) / 2;
    const b = Math.max(...T.map((g) => c.get(g).height));
    T.forEach((g) => {
      const w = c.get(g);
      S.set(g, { ...w, x: H, y: A + (b - w.height) / 2 }), H += w.width + Be.across;
    }), A += b + (v[O] ?? Be.down);
  });
  const R = e.map(([T, O, H], b) => ({ from: T, to: O, label: H || "", back: a.has(b) || i.get(O) <= i.get(T) }));
  zu(R, S);
  const k = R.map((T) => Ju(T, S.get(T.from), S.get(T.to))), y = [...S.values()], B = ed(k, y), P = Math.max(A - Be.down, ...B.filter((T) => T.label).map((T) => T.label.y + T.label.height));
  return { width: Math.max(f - Be.margin, ...B.filter((T) => T.label).map((T) => T.label.x + T.label.width)) + Be.margin, height: P + Be.margin, nodes: y, arrows: B };
}
const Ku = (e) => e ? ks(e, Le.lineChars).length * Le.line + Le.pad * 2 : 0;
function Yu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, i]) => {
    const [r, c] = [t.get(a), t.get(o)].sort((d, f) => d - f);
    c > r && (s[r + Math.floor((c - r - 1) / 2)] += Ku(i) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function Ju(e, t, n) {
  const s = e.label ? ks(e.label, Le.lineChars) : [], a = s.length ? Math.max(...s.map((S) => S.length)) * Le.charWidth + Le.pad * 2 : 0, o = s.length * Le.line + (s.length ? Le.pad * 2 : 0), i = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, f = (d - r) / 2, v = [{ x: i, y: r }, { x: i, y: r + f }, { x: c, y: d - f }, { x: c, y: d }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: v, path: `M${i} ${r} C${i} ${r + f} ${c} ${d - f} ${c} ${d}` };
}
const Zu = ([e, t, n, s], a) => {
  const o = 1 - a, i = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: i("x"), y: i("y") };
}, Xu = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Qu = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Le.line);
function ed(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: i }) => ({ x: s, y: a, width: o, height: i }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, d) => {
      const f = Zu(s.curve, c);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + d, width: s.labelWidth, height: s.labelHeight };
    }, r = Qu.flatMap((c) => Xu.map((d) => a(d, c))).find((c) => !n.some((d) => Js(c, d))) ?? a(0.5, 0);
    for (; n.some((c) => Js(r, c)); ) r.y += Le.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: Le.line, pad: Le.pad } };
  });
}
const Js = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, td = { class: "flowchart-tools" }, nd = ["width", "height", "viewBox", "aria-label"], sd = ["d"], ad = ["x", "y", "width", "height"], od = ["x", "y"], rd = ["x", "dy"], id = {
  key: 0,
  class: "flowchart-label"
}, ld = ["x", "y", "width", "height"], cd = ["x", "y"], ud = ["x", "dy"], dd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => Gu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, i = W(null), r = W({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function d() {
      var B;
      const k = (B = i.value) == null ? void 0 : B.getBoundingClientRect();
      if (!(k != null && k.width)) return;
      const y = Math.min(k.width / a.value.width, k.height / a.value.height, 1.5);
      r.value = { zoom: y, x: (k.width - a.value.width * y) / 2, y: (k.height - a.value.height * y) / 2 };
    }
    function f(k, y, B) {
      const { zoom: P, x: J, y: T } = r.value, O = Math.min(o.most, Math.max(o.least, P * k));
      r.value = { zoom: O, x: y - (y - J) * O / P, y: B - (B - T) * O / P };
    }
    function v(k) {
      const y = i.value.getBoundingClientRect();
      f(k, y.width / 2, y.height / 2);
    }
    function S(k) {
      const y = i.value.getBoundingClientRect();
      k.ctrlKey || k.metaKey ? f(k.deltaY < 0 ? o.step : 1 / o.step, k.clientX - y.left, k.clientY - y.top) : r.value = { ...r.value, x: r.value.x - k.deltaX, y: r.value.y - k.deltaY };
    }
    function A(k) {
      var y, B, P;
      k.preventDefault(), (y = window.getSelection()) == null || y.removeAllRanges(), c = { x: k.clientX - r.value.x, y: k.clientY - r.value.y }, (P = (B = i.value).setPointerCapture) == null || P.call(B, k.pointerId);
    }
    function R(k) {
      c && (r.value = { ...r.value, x: k.clientX - c.x, y: k.clientY - c.y });
    }
    return je(d), (k, y) => (l(), Y(qu, {
      title: e.title,
      large: "",
      onClose: y[4] || (y[4] = (B) => s("close"))
    }, {
      default: V(() => [
        p("div", td, [
          F(ye, {
            small: "",
            onClick: y[0] || (y[0] = (B) => v(o.step))
          }, {
            default: V(() => [...y[5] || (y[5] = [
              fe("Zoom in", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            small: "",
            onClick: y[1] || (y[1] = (B) => v(1 / o.step))
          }, {
            default: V(() => [...y[6] || (y[6] = [
              fe("Zoom out", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            small: "",
            onClick: d
          }, {
            default: V(() => [...y[7] || (y[7] = [
              fe("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: i,
          class: "flowchart-frame",
          onWheel: _e(S, ["prevent"]),
          onPointerdown: A,
          onPointermove: R,
          onPointerup: y[2] || (y[2] = (B) => Es(c) ? c.value = null : c = null),
          onPointercancel: y[3] || (y[3] = (B) => Es(c) ? c.value = null : c = null)
        }, [
          (l(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: we({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            y[8] || (y[8] = p("defs", null, [
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
            (l(!0), h(X, null, re(a.value.arrows, (B, P) => (l(), h("path", {
              key: `arrow-${P}`,
              class: "flowchart-arrow",
              d: B.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, sd))), 128)),
            (l(!0), h(X, null, re(a.value.nodes, (B) => (l(), h("g", {
              key: B.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: B.x,
                y: B.y,
                width: B.width,
                height: B.height,
                rx: "8"
              }, null, 8, ad),
              p("text", {
                x: B.x + B.width / 2,
                y: B.y + B.padY + B.line / 2
              }, [
                (l(!0), h(X, null, re(B.lines, (P, J) => (l(), h("tspan", {
                  key: J,
                  x: B.x + B.width / 2,
                  dy: J ? B.line : 0
                }, M(P), 9, rd))), 128))
              ], 8, od)
            ]))), 128)),
            (l(!0), h(X, null, re(a.value.arrows, (B, P) => (l(), h(X, {
              key: `label-${P}`
            }, [
              B.label ? (l(), h("g", id, [
                p("rect", {
                  x: B.label.x,
                  y: B.label.y,
                  width: B.label.width,
                  height: B.label.height,
                  rx: "4"
                }, null, 8, ld),
                p("text", {
                  x: B.label.x + B.label.width / 2,
                  y: B.label.y + B.label.pad + B.label.line / 2
                }, [
                  (l(!0), h(X, null, re(B.label.lines, (J, T) => (l(), h("tspan", {
                    key: T,
                    x: B.label.x + B.label.width / 2,
                    dy: T ? B.label.line : 0
                  }, M(J), 9, ud))), 128))
                ], 8, cd)
              ])) : N("", !0)
            ], 64))), 128))
          ], 12, nd))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, hd = /* @__PURE__ */ Z(dd, [["__scopeId", "data-v-51d24cfe"]]), Zs = {
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
}, fd = ["innerHTML"], pd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => Zs[t.name] || Zs.dot);
    return (s, a) => (l(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, fd));
  }
}, Qe = /* @__PURE__ */ Z(pd, [["__scopeId", "data-v-beb5935c"]]), md = ["title", "aria-label"], gd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, vd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, yd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), h("span", {
      class: ee(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), h("svg", gd, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), h("path", vd)) : N("", !0)
      ]))
    ], 10, md));
  }
}, wd = /* @__PURE__ */ Z(yd, [["__scopeId", "data-v-6dc92808"]]), kd = "img,pre,table";
function bd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function $d(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function xd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(kd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = bd($d(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function _d(e, t) {
  let n = null;
  const s = () => e.value && xd(e.value);
  je(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Me(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const Md = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Sd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Ed = ["data-from", "data-ref"], Ad = { class: "message-body" }, Cd = ["innerHTML"], Od = ["innerHTML"], Td = {
  class: "message-faces",
  "data-message-faces": ""
}, Bd = ["title", "data-face", "onClick"], Ld = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Id = ["title", "data-reaction", "onClick"], Rd = {
  key: 0,
  class: "message-reaction-count"
}, Dd = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, jd = ["href", "title"], Nd = ["src", "alt"], Pd = ["href"], qd = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, Wd = ["innerHTML"], Hd = { class: "message-foot" }, Fd = { class: "message-time" }, Ud = 1500, Vd = "An earlier message", zd = "about", Gd = 3, Kd = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    var C;
    const n = e, s = t, a = W(!1), o = W(null), i = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => i.value && !n.message.read_at && !n.message.local);
    async function c() {
      var $;
      await (($ = navigator.clipboard) == null ? void 0 : $.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Ud);
    }
    const d = I(() => Gt(n.message.text ?? "", { env: "" })), f = I(() => JSON.parse(n.message.flowchart_edges || "[]")), v = W(!1), S = I(() => Gt(n.quote || Vd, { env: "" }));
    function A() {
      const $ = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      $ ? $.scrollIntoView({ block: "center", behavior: "smooth" }) : vt(`messages:${n.message.parent_id}`);
    }
    _d(o, () => `${n.message.text} ${n.quote}`);
    const R = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, k = ($) => `/api/files/message/${n.message.id}/${encodeURIComponent($)}`, y = I(() => JSON.parse(n.message.captions || "{}")), B = I(() => (n.message.files ?? []).map(($) => ({ name: $, address: k($), isImage: R.test($), title: y.value[$] || $ }))), P = I(() => Da(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), J = Fe(Ue, null), T = W([]), O = W(!1), H = I(() => Gt(T.value.join(", "), { env: "" })), b = I(() => T.value.length >= Gd), g = I(() => `${T.value.length} linked ${T.value.every(($) => $.startsWith("task ")) ? "tasks" : "rows"}`);
    async function w() {
      if (!i.value || !(J != null && J.read) || n.message.local) return;
      const $ = await J.read(`link list --source message:${n.message.id}`);
      $.ok && (T.value = ($.value.rows ?? $.value ?? []).filter((E) => E.link_type === zd).map((E) => `${E.target_model} ${E.target_id}`));
    }
    w(), (C = J == null ? void 0 : J.follow) == null || C.call(J, ["link.*"], w);
    const x = W(!1), m = I(() => Sd(n.message.reactions));
    function u($) {
      x.value = !1, s("react", n.message, $);
    }
    return ($, E) => (l(), h("article", {
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": i.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", Ad, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: "message-card md",
          onClick: E[2] || (E[2] = (...U) => G(Ke) && G(Ke)(...U))
        }, [
          e.message.parent_id ? (l(), h("div", {
            key: 0,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: _e(A, ["stop"]),
            innerHTML: S.value
          }, null, 8, Cd)) : N("", !0),
          p("div", { innerHTML: d.value }, null, 8, Od),
          f.value.length ? (l(), h(X, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: E[0] || (E[0] = (U) => v.value = !0)
            }, "Open the flowchart"),
            v.value ? (l(), Y(hd, {
              key: 0,
              title: e.message.text,
              edges: f.value,
              onClose: E[1] || (E[1] = (U) => v.value = !1)
            }, null, 8, ["title", "edges"])) : N("", !0)
          ], 64)) : N("", !0)
        ], 512),
        p("div", {
          class: ee(["message-tools", { picking: x.value }]),
          "data-message-tools": ""
        }, [
          x.value ? (l(), h(X, { key: 0 }, [
            p("div", Td, [
              (l(!0), h(X, null, re(G(Md), (U) => (l(), h("button", {
                key: U,
                type: "button",
                class: "message-face",
                title: `React ${U}`,
                "data-face": U,
                onClick: (oe) => u(U)
              }, M(U), 9, Bd))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: E[3] || (E[3] = (U) => x.value = !1)
            }, [
              F(Ae, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (l(), h(X, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: E[4] || (E[4] = (U) => x.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: E[5] || (E[5] = (U) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: c
            }, M(a.value ? "Copied" : "Copy"), 1),
            r.value ? (l(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: E[6] || (E[6] = (U) => s("delete", e.message))
            }, "Delete")) : N("", !0)
          ], 64))
        ], 2)
      ]),
      m.value.length ? (l(), h("div", Ld, [
        (l(!0), h(X, null, re(m.value, (U) => (l(), h("button", {
          key: U.emoji,
          type: "button",
          class: ee(["message-reaction", { mine: U.mine }]),
          title: U.title,
          "data-reaction": U.emoji,
          onClick: (oe) => s("react", e.message, U.emoji)
        }, [
          fe(M(U.emoji) + " ", 1),
          U.count > 1 ? (l(), h("span", Rd, M(U.count), 1)) : N("", !0)
        ], 10, Id))), 128))
      ])) : N("", !0),
      B.value.length ? (l(), h("div", Dd, [
        (l(!0), h(X, null, re(B.value, (U) => (l(), h(X, {
          key: U.name
        }, [
          U.isImage ? (l(), h("a", {
            key: 0,
            href: U.address,
            target: "_blank",
            class: "message-image",
            title: U.title
          }, [
            p("img", {
              src: U.address,
              alt: U.name
            }, null, 8, Nd)
          ], 8, jd)) : (l(), h("a", {
            key: 1,
            href: U.address,
            target: "_blank",
            class: "message-file"
          }, M(U.name), 9, Pd))
        ], 64))), 128))
      ])) : N("", !0),
      T.value.length ? (l(), h("div", qd, [
        F(Qe, {
          class: "message-links-icon",
          name: "linked"
        }),
        b.value && !O.value ? (l(), h("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: E[7] || (E[7] = (U) => O.value = !0)
        }, M(g.value), 1)) : (l(), h("span", {
          key: 1,
          class: "md",
          "data-message-links-rows": "",
          onClick: E[8] || (E[8] = (...U) => G(Ke) && G(Ke)(...U))
        }, [
          E[9] || (E[9] = fe("Linked: ", -1)),
          p("span", {
            class: "message-links-rows",
            innerHTML: H.value
          }, null, 8, Wd)
        ]))
      ])) : N("", !0),
      p("div", Hd, [
        p("time", Fd, M(P.value), 1),
        i.value ? (l(), Y(wd, {
          key: 0,
          message: e.message
        }, null, 8, ["message"])) : N("", !0)
      ])
    ], 8, Ed));
  }
}, qg = /* @__PURE__ */ Z(Kd, [["__scopeId", "data-v-47bd817e"]]), Yd = ["aria-label"], En = 200, Jd = 300, Xs = 400, Zd = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: En } },
  setup(e) {
    const t = e, n = I(() => t.value < En ? [1, 0.25, 0.25] : t.value === En ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, a) => (l(), h("svg", {
      class: ee(["ico", "prio", { hot: e.value >= Xs, high: e.value >= Jd && e.value < Xs }]),
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
        style: we({ opacity: n.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: we({ opacity: n.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: we({ opacity: n.value[2] })
      }, null, 4)
    ], 10, Yd));
  }
}, Wg = /* @__PURE__ */ Z(Zd, [["__scopeId", "data-v-89404405"]]), oo = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Hg = (e) => {
  var t;
  return ((t = oo.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Xd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), h("span", {
      class: ee(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      F(Qe, { name: "fold" })
    ], 2));
  }
}, sn = /* @__PURE__ */ Z(Xd, [["__scopeId", "data-v-d03899bb"]]), Qd = ["aria-checked", "aria-haspopup", "onClick"], eh = {
  key: 0,
  class: "segmented-dot"
}, th = {
  key: 1,
  class: "segmented-count"
}, nh = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = va();
    return (a, o) => {
      const i = Fo("tip");
      return l(), h("span", {
        class: ee(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), h(X, null, re(e.options, (r) => mt((l(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: ee(["segmented-option", { on: r.key === e.value }]),
          onClick: (c) => n("pick", r.key)
        }, [
          r.dot ? (l(), h("span", eh)) : N("", !0),
          fe(" " + M(r.label) + " ", 1),
          r.count !== void 0 ? (l(), h("em", th, M(r.count), 1)) : N("", !0)
        ], 10, Qd)), [
          [i, r.tip || r.title, `${G(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, ts = /* @__PURE__ */ Z(nh, [["__scopeId", "data-v-ca953072"]]), Qs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, sh = {
  key: 1,
  class: "text-field-label"
}, ah = {
  key: 2,
  class: "text-field-end"
}, oh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Vn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Un(e, "modelValue"), s = wa(), a = "onUpdate:modelValue" in (((f = Uo()) == null ? void 0 : f.vnode.props) || {}), o = I(() => a ? n.value : s.value), i = (v) => a && (n.value = v.target.value), r = I(
      () => Object.fromEntries(Object.entries(s).filter(([v]) => v !== "class" && v !== "style" && v !== "value"))
    ), c = I(() => Object.fromEntries(Object.entries(s).filter(([v]) => v !== "value"))), d = W(null);
    return t({ focus: () => d.value && d.value.focus() }), (v, S) => e.label || e.icon || v.$slots.end ? (l(), h("label", {
      key: 0,
      class: ee(["text-field", { large: e.large, ended: v.$slots.end }, G(s).class]),
      style: we(G(s).style)
    }, [
      e.icon ? (l(), Y(Ae, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : N("", !0),
      e.label ? (l(), h("span", sh, M(e.label), 1)) : N("", !0),
      mt(p("input", pt({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: i }), null, 16), [
        [G(Qs), o.value]
      ]),
      v.$slots.end ? (l(), h("span", ah, [
        $e(v.$slots, "end", {}, void 0, !0)
      ])) : N("", !0)
    ], 6)) : mt((l(), h("input", pt({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: i }), null, 16)), [
      [G(Qs), o.value]
    ]);
  }
}), rh = /* @__PURE__ */ Z(oh, [["__scopeId", "data-v-d9c38ca8"]]);
function ih(e, t, { incremental: n = !1 } = {}) {
  const s = $a(), a = W([]), o = W(""), i = W(!1), r = W(""), c = W(null);
  async function d(k) {
    const y = await s.read(`${e} --before-id ${k + 1} --limit 1`);
    if (!y.ok) return A();
    const B = y.value.rows.find((P) => P.id === k);
    a.value = B ? a.value.map((P) => P.id === k ? B : P) : a.value.filter((P) => P.id !== k);
  }
  async function f(k) {
    if (n && String((k == null ? void 0 : k.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((T) => T.id !== k.row_id));
    if (n && (k != null && k.row_id) && !String(k.event ?? "").endsWith(".create") && a.value.some((T) => T.id === k.row_id)) return d(k.row_id);
    if (!(n && a.value.length && String((k == null ? void 0 : k.event) ?? "").endsWith(".create"))) return A();
    const B = Math.max(...a.value.map((T) => T.id)), P = await s.read(`${e} --after-id ${B}`);
    if (!P.ok) return A();
    const J = new Set(a.value.map((T) => T.id));
    a.value = [...P.value.rows.filter((T) => !J.has(T.id)), ...a.value];
  }
  async function v() {
    if (!a.value.length) return !1;
    const k = Math.min(...a.value.map((P) => P.id)), y = await s.read(`${e} --before-id ${k}`);
    if (!y.ok || !y.value.rows.length) return !1;
    const B = new Set(a.value.map((P) => P.id));
    return a.value = [...a.value, ...y.value.rows.filter((P) => !B.has(P.id))], !0;
  }
  let S = 0;
  async function A() {
    const k = ++S, y = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (k !== S) return;
    const B = y.ok ? s.shared ? [y.value] : y.value.rows : [], P = B.length ? Math.min(...B.map((J) => J.id)) : 0;
    a.value = n && y.ok && P ? [...a.value.filter((J) => J.id > Math.max(...B.map((T) => T.id))), ...B, ...a.value.filter((J) => J.id < P)] : B, o.value = y.ok ? "" : y.error, i.value = !0;
  }
  async function R(k) {
    const y = await s.run(k);
    return r.value = y.ok ? "" : y.error, c.value = y.ok ? y.value : null, await A(), y;
  }
  return s.follow(t, f), A(), { rows: a, failure: o, loaded: i, load: A, older: v, act: R, actionFailure: r, answer: c, context: s };
}
const lh = { class: "title" }, ch = { class: "state" }, uh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = ih(t.line, t.events);
    return (o, i) => (l(), Y(qr, {
      rows: G(n),
      failure: G(s),
      loaded: G(a),
      empty: e.empty
    }, {
      default: V(({ row: r }) => [
        p("span", lh, M(r.title), 1),
        p("span", ch, M(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Fg = /* @__PURE__ */ Z(uh, [["__scopeId", "data-v-a69084cd"]]), dh = ["data-tip", "aria-label"], hh = {
  key: 0,
  class: "mact-word"
}, fh = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), h("button", {
      type: "button",
      class: ee(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      F(Qe, { name: "open" }),
      e.open ? (l(), h("span", hh, M(e.label), 1)) : N("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, dh));
  }
}, ph = /* @__PURE__ */ Z(fh, [["__scopeId", "data-v-3b292e09"]]), An = W(Date.now() / 1e3);
let ea = 0, Wt = 0;
function mh() {
  return Wt || (An.value = Date.now() / 1e3, ea = setInterval(() => An.value = Date.now() / 1e3, 1e3)), Wt += 1, ka() && ba(() => {
    Wt -= 1, Wt || clearInterval(ea);
  }), An;
}
const gh = 120, Cn = 280, vh = 160, yh = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function wh(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = W(t()), a = W("");
  let o = 0;
  const i = (d, f) => Object.assign(d.style, { width: `${f.width}px`, height: `${f.height}px` }), r = (d) => Object.assign(d.style, { width: "", height: "", transition: "" });
  async function c(d) {
    const f = e.value, v = ++o;
    if (!f || !f.offsetWidth || yh()) {
      s.value = d;
      return;
    }
    const S = { width: f.offsetWidth, height: f.offsetHeight };
    if (i(f, S), a.value = "leaving", await n(gh), v !== o) return;
    s.value = d, a.value = "resizing", await hn(), r(f);
    const A = { width: f.offsetWidth, height: f.offsetHeight };
    i(f, S), f.offsetWidth, f.style.transition = `width ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, i(f, A), await n(Cn), v === o && (r(f), a.value = "entering", await n(vh), v === o && (a.value = ""));
  }
  return be(t, (d) => c(d)), ds(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const kh = ["title", "data-figure-mark", "data-folded", "data-open"], bh = {
  key: 2,
  class: "worker"
}, $h = { class: "head" }, xh = { key: 0 }, _h = {
  key: 3,
  class: "status"
}, Mh = {
  key: 0,
  class: "figure"
}, Sh = {
  key: 1,
  class: "ran-for"
}, Eh = { key: 2 }, Ah = { key: 3 }, Ch = {
  key: 4,
  class: "news"
}, Oh = {
  key: 5,
  class: "spin",
  "aria-label": "Still running"
}, Th = {
  key: 7,
  class: "settled"
}, Bh = {
  key: 1,
  class: "bar"
}, Lh = {
  key: 3,
  class: "detail body"
}, Ih = {
  key: 0,
  class: "body-label"
}, Rh = ["title"], Dh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = wa(), s = ["onClick", "onAct"], a = I(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = W(!1), i = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), c = I(() => r.value || i.value), d = I(() => r.value ? t.open : o.value), f = I(() => r.value ? !t.open : i.value && !o.value), v = I(() => !!(t.mark.action && n.onAct)), S = I(() => c.value || v.value || !!n.onClick), A = W(null), R = W(null), { folded: k, phase: y } = wh(A, () => f.value);
    function B(le) {
      var me, Se;
      if (!(le.target !== A.value && !R.value.contains(le.target))) {
        if (r.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (i.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(le);
      }
    }
    const P = (le) => n.onAct(le), J = ["failed", "unfinished"], T = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? J.includes(t.mark.state) ? "danger" : "good" : ""), O = I(() => t.mark.color ? t.mark.color : T.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : T.value ? `var(--tone-${T.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), H = I(() => O.value || "var(--tone-work)"), b = I(() => !t.mark.ending && !t.mark.ended && T.value !== "stopped"), g = mh(), w = I(
      () => t.mark.began_at && b.value && !t.mark.figure && !t.mark.counting ? Yi(g.value - t.mark.began_at) : ""
    ), x = I(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${Ns(me - le, !0)}` : Ns(g.value - le, !0) : w.value;
    }), m = ["bad", "danger", "warn"], u = I(() => m.includes(T.value) || t.mark.asks ? "attention" : b.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), C = ["bad", "danger"], $ = I(() => C.includes(T.value)), E = I(() => u.value === "process" ? "running" : $.value ? "cross" : T.value === "stopped" ? "stopped" : T.value === "good" ? "tick" : ""), U = I(
      () => !!(t.mark.figure || x.value || t.mark.docked || t.mark.stopping || E.value || t.mark.settled || t.mark.news)
    ), oe = I(() => [t.mark.title, t.mark.time ? Da(t.mark.time) : ""].filter(Boolean).join(" · ")), de = I(() => ({
      ...O.value ? { "--mark": O.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (l(), h("div", pt(a.value, {
      ref_key: "root",
      ref: A,
      class: [
        "mark",
        `w-${u.value}`,
        G(y),
        {
          open: d.value,
          live: S.value,
          failed: $.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: O.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: de.value,
      title: oe.value,
      "data-figure-mark": e.mark.key,
      "data-folded": G(k) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: B
    }), [
      (l(), Y(at(S.value ? "button" : "span"), {
        ref_key: "top",
        ref: R,
        class: "top",
        type: S.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!d.value) : void 0
      }, {
        default: V(() => [
          e.mark.markIcon ? (l(), Y(Qe, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), Y(Ae, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), h("span", bh, M(e.mark.worker), 1)) : N("", !0),
          p("span", $h, [
            F(dt, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), h("strong", xh, M(e.mark.name), 1)) : N("", !0),
            c.value ? (l(), Y(sn, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : N("", !0)
          ]),
          U.value ? (l(), h("span", _h, [
            e.mark.figure ? (l(), h("span", Mh, M(e.mark.figure), 1)) : N("", !0),
            x.value ? (l(), h("span", Sh, M(x.value), 1)) : N("", !0),
            e.mark.docked ? (l(), h("span", Eh, "In the dock")) : N("", !0),
            e.mark.stopping ? (l(), h("span", Ah, "Stopping")) : N("", !0),
            e.mark.news ? (l(), h("span", Ch, M(e.mark.news), 1)) : N("", !0),
            E.value === "running" ? (l(), h("span", Oh)) : E.value ? (l(), Y(Qe, {
              key: 6,
              class: ee(["sign", E.value]),
              name: E.value
            }, null, 8, ["class", "name"])) : N("", !0),
            e.mark.settled ? (l(), h("span", Th, M(e.mark.settled), 1)) : N("", !0)
          ])) : N("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      v.value ? (l(), Y(ph, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: _e(P, ["stop"])
      }, null, 8, ["label", "open"])) : N("", !0),
      (e.mark.figure || e.mark.counting) && b.value ? (l(), h("span", Bh, [
        p("span", {
          class: "progress",
          style: we({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: H.value })
        }, null, 4)
      ])) : N("", !0),
      e.mark.detail && !G(k) ? (l(), Y(dt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : N("", !0),
      e.mark.body && !G(k) ? (l(), h("div", Lh, [
        e.mark.bodyLabel ? (l(), h("p", Ih, M(e.mark.bodyLabel), 1)) : N("", !0),
        F(dt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : N("", !0),
      e.mark.command && !G(k) ? (l(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, M(e.mark.command), 9, Rh)) : N("", !0),
      e.mark.card ? (l(), Y(dt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : N("", !0),
      $e(le.$slots, "default", {
        shown: !G(k)
      }, void 0, !0)
    ], 16, kh));
  }
}), ro = /* @__PURE__ */ Z(Dh, [["__scopeId", "data-v-de840831"]]), jh = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function io(e) {
  var n;
  const t = jh[e] || ((n = vn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Nh = (e) => io(String(e).split(":")[0]), lo = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ph = { passed: "good", failed: "danger", warned: "warn", running: "" }, ta = {
  "open row": (e) => vt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Br(e.target_model, e.target_id || 0)
}, qh = { "open row": (e) => Nh(e.target_model), "open page": () => io("pages") };
function Wh(e, t) {
  const n = t || {}, s = ta[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" && Ph[e.outcome] || "",
    label: e.text,
    // a mark with a body of its module's own keeps its lines for that body, and its cut-off first part is not a second line
    detail: n.body_url ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? qh[s](e) : "",
    handlers: s ? { onAct: () => ta[s](e) } : {}
  };
}
const Hh = 24, Fh = 1e3, na = 2e3, Uh = 0.25, Vh = 5e3;
function zh(e, t = Hh, n = () => !0) {
  const s = W(!1), a = W(0), o = W(!1);
  let i = 0, r = 0, c = 0;
  const d = () => e && "value" in e ? e.value : e, f = () => {
    const T = d();
    return T ? T.scrollHeight - T.scrollTop - T.clientHeight : 0;
  }, v = () => !d() || f() <= t;
  function S(T) {
    if (clearTimeout(i), !T) {
      o.value = !1, c = Date.now();
      return;
    }
    const O = Date.now() - c < na ? na : Fh;
    i = setTimeout(() => o.value = s.value, O);
  }
  function A() {
    clearTimeout(r), s.value = !1, a.value = 0, S(!1);
  }
  function R(T = !1) {
    const O = d();
    O && T && O.scrollTo ? O.scrollTo({ top: O.scrollHeight, behavior: "smooth" }) : O && (O.scrollTop = O.scrollHeight), A();
  }
  function k() {
    B(), !s.value && (s.value = !0, S(!0));
  }
  const y = () => !!d() && f() <= d().clientHeight * Uh;
  function B() {
    clearTimeout(r), y() && (r = setTimeout(() => s.value && y() && n() && R(!0), Vh));
  }
  function P() {
    v() ? A() : k();
  }
  function J(T = 1, O = !1) {
    s.value ? a.value += Math.max(0, T) : R(O);
  }
  return ka() && ba(() => [i, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: v, follow: A, toBottom: R, left: k, scrolled: P, arrived: J };
}
const Gh = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(null), { away: o, scrolled: i, arrived: r, toBottom: c } = zh(a);
    be(
      () => n.lines.length,
      () => hn(() => r()),
      { immediate: !0 }
    );
    function d(f) {
      i(), s("older", f.target);
    }
    return (f, v) => (l(), h("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: d
    }, [
      fe(M(e.lines.join(`
`) || e.empty), 1),
      G(o) ? (l(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: v[0] || (v[0] = (S) => G(c)(!0))
      }, "Follow")) : N("", !0)
    ], 544));
  }
}, Kh = /* @__PURE__ */ Z(Gh, [["__scopeId", "data-v-09394a20"]]), Yh = 1e4;
class Jh {
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
    return this.heardAt !== null && t - this.heardAt > Yh;
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
const Zh = {
  key: 0,
  class: "frame-note"
}, Xh = {
  key: 0,
  class: "frame-note"
}, Qh = ["src", "title"], ef = 1e3, tf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = $a(), s = W(null), a = W(!1), o = W(!1);
    let i = null, r = 0;
    return je(() => {
      i = new Jh(s.value, n), i.start(), r = setInterval(() => {
        a.value = i.silent();
      }, ef);
    }), Me(() => {
      i == null || i.stop(), clearInterval(r);
    }), (c, d) => o.value ? (l(), h("p", Zh, "This window was closed because it stopped answering.")) : (l(), h(X, { key: 1 }, [
      a.value ? (l(), h("div", Xh, [
        d[2] || (d[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        F(ye, {
          onClick: d[0] || (d[0] = (f) => o.value = !0)
        }, {
          default: V(() => [...d[1] || (d[1] = [
            fe("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : N("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: G(n).window
      }, null, 8, Qh)
    ], 64));
  }
}, nf = /* @__PURE__ */ Z(tf, [["__scopeId", "data-v-32a49046"]]), sf = 0, af = "/api/lines", of = "/api/line";
class rf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), sf));
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
        const n = await Re.raw(af, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Re.raw(of, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const lf = new rf();
class cf {
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
      n.patterns.some((s) => co(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function co(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const uf = { 1: "refused", 2: "usage", 3: "fault" }, df = 100, hf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function ff({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: i, open: r, options: c = W({}), declared: d = [], readOnly: f = !1, shared: v = null }) {
  const S = /* @__PURE__ */ new Map(), A = new AbortController(), R = (k) => {
    const y = S.get(k);
    if (y && performance.now() - y.at < df) return y.answer;
    const B = Mt(e, k, t, A.signal);
    return S.set(k, { answer: B, at: performance.now() }), B;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: I(() => s()),
    permissions: a,
    readOnly: f,
    shared: v,
    read: R,
    run: (k) => Mt(e, k, t, A.signal),
    upload: (k) => mf(k, A.signal),
    cancel: () => A.abort(),
    follow: (k, y) => i.follow(e, k.filter((B) => o.some((P) => co(P, B))), y, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (k) => I(() => {
      var y;
      return c.value[k] ?? ((y = d.find((B) => B.key === k)) == null ? void 0 : y.default);
    }),
    setting: async (k, y) => {
      const B = await R(`window setting ${e} ${k}`);
      return B.ok ? B.value.value : y;
    },
    keep: (k, y) => Mt(e, ["window", "save-setting", e, k, JSON.stringify(y)], t, A.signal)
  };
}
function pf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const an = { ok: !1, failure: "cancelled", error: "" };
async function Mt(e, t, n, s = void 0) {
  try {
    const a = await lf.add({ window: e, line: Array.isArray(t) ? t : gf(t), environment: n }, s);
    return s != null && s.aborted ? an : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: uf[a.code] || "fault", error: pf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? an : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function mf(e, t = void 0) {
  try {
    const n = await Re.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? an : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? an : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function gf(e) {
  return [...e.matchAll(hf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function vf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const yf = {
  class: "allowance-prompt",
  role: "dialog"
}, wf = { class: "allowance-prompt-text" }, kf = { class: "allowance-prompt-buttons" }, bf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), h("div", yf, [
      p("p", wf, M(G(vf)(e.request)), 1),
      p("div", kf, [
        F(ye, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            fe("Allow", -1)
          ])]),
          _: 1
        }),
        F(ye, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            fe("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, $f = /* @__PURE__ */ Z(bf, [["__scopeId", "data-v-102dc765"]]), On = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), Y(Zt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: V(() => [
        fe(M(e.reason) + " ", 1),
        e.retry ? (l(), Y(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            fe("Retry", -1)
          ])]),
          _: 1
        })) : N("", !0),
        e.removable ? (l(), Y(ye, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            fe("Remove tab", -1)
          ])]),
          _: 1
        })) : N("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, xf = ["data-window", "data-agent"], _f = {
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
    const r = Fe(gr, null), c = ff({
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
      open: (v, S) => {
        s("open", v, S), r == null || r(v, S);
      }
    });
    Vo(Ue, c), be(() => n.visible, (v) => v && n.subscriptions.shown(n.name)), Me(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), zo((v) => (a.value = v instanceof Error ? v.message : String(v), n.subscriptions.stopAll(n.name), !1));
    const d = () => cs(n.component), f = () => {
      var v, S;
      return ((S = (v = n.prompts) == null ? void 0 : v.current.value) == null ? void 0 : S.window) === n.name ? n.prompts.current.value : null;
    };
    return (v, S) => (l(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (l(), Y($f, {
        key: 0,
        request: f(),
        onAnswer: S[0] || (S[0] = (A) => e.prompts.answer(A))
      }, null, 8, ["request"])) : N("", !0),
      e.unavailableReason ? (l(), Y(On, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), Y(On, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: i
      }, null, 8, ["name", "reason"])) : e.component ? (l(), Y(d, { key: o.value })) : (l(), Y(On, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: S[1] || (S[1] = (A) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, xf));
  }
}, uo = /* @__PURE__ */ Z(_f, [["__scopeId", "data-v-7d5e8ae6"]]), Mf = {
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
    const t = e, n = { render: () => cs(nf, { src: t.entry.entry_url }) };
    return (s, a) => (l(), Y(uo, {
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
}, ns = "journal.stale-build-reload", Sf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Ef(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ns) === e.message) return !1;
    t.setItem(ns, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Af(e = window.sessionStorage) {
  try {
    e.removeItem(ns);
  } catch {
    return;
  }
}
const Cf = ["data-window"], Of = {
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
    const t = e, n = dn(null), s = W("");
    return be(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, Af();
          } catch (o) {
            if (Sf(o) && Ef(o)) return;
            s.value = `This window's file could not be loaded: ${o.message}`;
          }
      },
      { immediate: !0 }
    ), (a, o) => !n.value && !s.value && !e.entry.unavailable_reason ? (l(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      F(Ot, { shape: "cards" })
    ], 8, Cf)) : (l(), Y(uo, {
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
}, Tf = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new cf(), s = ((r = Fe(Ue, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), i = I(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, d) => i.value ? (l(), Y(Of, {
      key: 0,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), Y(Mf, {
      key: 1,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Bf = { class: "mark-more-inner" }, Lf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, If = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Rf = {
  key: 3,
  class: "mark-lines"
}, Df = "process", sa = "task", jf = 2e3, Nf = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Fe(Ue), s = I(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = I(() => lo.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === sa ? t.mark.target_id : 0), i = W([]), r = W(!1), c = W(""), d = I(() => t.mark.target_model === Df && !!t.mark.target_id);
    async function f() {
      const A = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, c.value = A.ok ? "" : A.error, A.ok && (i.value = A.value.lines);
    }
    let v = null;
    const S = () => clearInterval(v);
    return be(() => t.shown && d.value, (A) => {
      S(), A && (f(), t.mark.ended_at || (v = setInterval(f, jf)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (A) => A && t.shown && d.value && (S(), f())), Me(S), (A, R) => (l(), h("div", {
      class: ee(["mark-more", { open: e.shown }]),
      onClick: R[1] || (R[1] = _e(() => {
      }, ["stop"]))
    }, [
      p("div", Bf, [
        e.declaration.body_url ? (l(), Y(Tf, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), h(X, { key: 1 }, [
          a.value ? (l(), h(X, { key: 0 }, [
            R[2] || (R[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Lf, M(a.value), 1)
          ], 64)) : N("", !0),
          d.value && c.value ? (l(), h("p", If, M(c.value), 1)) : d.value && r.value ? (l(), h(X, { key: 2 }, [
            R[3] || (R[3] = p("p", { class: "mark-label" }, "Output", -1)),
            F(Kh, {
              class: "mark-terminal",
              lines: i.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), h("p", Rf, M(s.value.join(`
`)), 1)) : N("", !0),
          o.value ? (l(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: R[0] || (R[0] = _e((k) => G(vt)(`${sa}:${o.value}`), ["stop"]))
          }, "Open task " + M(o.value) + " and its proofs", 1)) : N("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ss = /* @__PURE__ */ Z(Nf, [["__scopeId", "data-v-51f69bf1"]]), Pf = (e) => `show-${e}`, Ug = (e, t, n) => e.filter((s) => {
  var a;
  return n(Pf((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), qf = "messages.chat", Wf = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), as = (e, t, n) => Mt(qf, Wf(e, t), n), Hf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ff = ["title", "aria-label", "onClick"], Uf = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Vf = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => Hf(t.buttons, t.allowedRuns).filter((i) => {
      var r;
      return !((r = i.variants) != null && r.length) || i.variants.includes(t.mark.variant);
    })), s = W(""), a = Fe(Ue);
    async function o(i) {
      const r = await as(i, t.mark, a.environment);
      s.value = r.ok ? "" : r.error;
    }
    return (i, r) => (l(), h(X, null, [
      (l(!0), h(X, null, re(n.value, (c) => (l(), h("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: _e((d) => o(c), ["stop"])
      }, [
        F(Qe, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, Ff))), 128)),
      s.value ? (l(), h("span", Uf, M(s.value), 1)) : N("", !0)
    ], 64));
  }
}, zf = /* @__PURE__ */ Z(Vf, [["__scopeId", "data-v-0dfda102"]]);
function ho(e, t) {
  const n = dn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((i) => [i.type, i])), a = async () => {
    try {
      return (await (await Re.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const fo = ho("/api/marks", "marks"), Vg = fo.fetchAll, Gf = fo.find, Kf = ["data-ref"], Yf = ["data-ref"], Jf = { class: "mark-row" }, Zf = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = e, s = I(() => Gf(n.mark.type)), a = I(() => Wh(n.mark, s.value)), o = I(() => {
      var r;
      return !!(n.mark.lines || n.mark.detail && lo.has(n.mark.variant) || t.has(n.mark.target_model) || (r = s.value) != null && r.body_url);
    }), i = W(!1);
    return (r, c) => {
      var d, f, v;
      return (d = s.value) != null && d.card ? (l(), h("div", {
        key: 0,
        class: "thread-turn card whole-card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        F(ss, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 8, Kf)) : (l(), h("div", {
        key: 1,
        class: ee(["thread-turn", "card", { "full-width": (f = s.value) == null ? void 0 : f.full_width }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", Jf, [
          F(ro, pt({
            mark: a.value,
            open: o.value ? i.value : void 0
          }, Go(a.value.handlers), {
            onClick: c[0] || (c[0] = (S) => i.value = !i.value)
          }), Ko({ _: 2 }, [
            o.value ? {
              name: "default",
              fn: V(({ shown: S }) => [
                F(ss, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: S
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(zf, {
            buttons: (v = s.value) == null ? void 0 : v.buttons,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Yf));
    };
  }
}, Xf = /* @__PURE__ */ Z(Zf, [["__scopeId", "data-v-450763c6"]]), Qf = ["data-ref"], e1 = {
  key: 0,
  class: "thread-group",
  "data-mark-group-rows": ""
}, t1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = W(!1), s = I(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (a, o) => (l(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      F(ro, {
        mark: s.value,
        open: n.value,
        onClick: o[0] || (o[0] = (i) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      n.value ? (l(), h("div", e1, [
        (l(!0), h(X, null, re(e.group.marks, (i) => (l(), Y(Xf, {
          key: i.id,
          mark: i
        }, null, 8, ["mark"]))), 128))
      ])) : N("", !0)
    ], 8, Qf));
  }
}, zg = /* @__PURE__ */ Z(t1, [["__scopeId", "data-v-4eab0b3e"]]);
function n1(e) {
  const t = W(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return je(() => n.observe(e.value)), ds(() => n.disconnect()), t;
}
const s1 = { class: "chat-dock-fold" }, a1 = ["aria-label"], o1 = { class: "chat-dock-head" }, r1 = { class: "chat-dock-inner" }, i1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = W(null), s = W(null), a = n1(s);
    return t({ card: n }), (o, i) => (l(), h("div", {
      class: ee(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", s1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: ee(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          $e(o.$slots, "edge"),
          p("header", o1, [
            $e(o.$slots, "head")
          ]),
          p("div", {
            class: ee(["chat-dock-body", { folded: e.folded }])
          }, [
            p("div", r1, [
              p("div", {
                class: "chat-dock-grow",
                style: we(G(a) === null ? null : { height: `${G(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  $e(o.$slots, "default")
                ], 512)
              ], 4)
            ])
          ], 2)
        ], 10, a1)
      ])
    ], 2));
  }
}, po = /* @__PURE__ */ Z(i1, [["__scopeId", "data-v-e27493a6"]]), l1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Tn = 5, c1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Tn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Tn}s`, animationDelay: `${(n - Tn).toFixed(2)}s` };
    return (a, o) => (l(), h("span", l1, [
      p("i", { style: s })
    ]));
  }
}, u1 = /* @__PURE__ */ Z(c1, [["__scopeId", "data-v-d0c4b012"]]), mo = ho("/api/docks", "docks"), Gg = mo.fetchAll, os = mo.find, d1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), aa = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function h1(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [aa("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || vn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    aa("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const f1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: d1(e, t),
  buttons: h1(e, t)
}), p1 = { class: "dock-title" }, m1 = ["aria-expanded", "title"], g1 = { class: "chat-dock-acts dock-acts" }, v1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, y1 = {
  key: 1,
  class: "dock-text"
}, w1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = I(() => os(s.item.type)), o = W(null), i = I(() => f1(s.item, a.value)), r = Fe(Ue), c = W(/* @__PURE__ */ new Set()), d = W("");
    async function f(A) {
      if (A.action === "open") return vt(`${s.item.target_model}:${s.item.target_id}`);
      if (A.action !== "declared") return as(A, s.item, r.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, A.label]), d.value = "";
      const R = await as(A, s.item, r.environment);
      (R == null ? void 0 : R.ok) === !1 && (c.value = new Set([...c.value].filter((k) => k !== A.label)), d.value = R.error);
    }
    const v = I(() => i.value.buttons.filter((A) => A.action !== "undock" && !c.value.has(A.label))), S = I(() => i.value.buttons.find((A) => A.action === "undock"));
    return (A, R) => (l(), Y(po, {
      label: i.value.title,
      folded: e.folded
    }, {
      edge: V(() => [
        e.leaving ? (l(), Y(u1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : N("", !0)
      ]),
      head: V(() => {
        var k, y, B;
        return [
          (k = a.value) != null && k.draws_head ? (l(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), h(X, { key: 1 }, [
            F(Ae, {
              name: i.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", p1, M(i.value.title), 1)
          ], 64)),
          (y = a.value) != null && y.badge ? (l(), h("span", {
            key: 2,
            class: ee(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, M(a.value.badge), 3)) : N("", !0),
          (B = a.value) != null && B.draws_head ? N("", !0) : (l(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: R[0] || (R[0] = (P) => n("fold"))
          }, [
            F(sn, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, m1)),
          p("span", g1, [
            (l(!0), h(X, null, re(v.value, (P) => (l(), Y(ye, {
              key: P.action + P.runs,
              small: "",
              kind: P.primary ? "primary" : "ghost",
              bordered: !P.primary,
              "data-dock-action": P.action,
              onClick: (J) => f(P)
            }, {
              default: V(() => [
                fe(M(P.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          F(fs, {
            title: S.value.label,
            "data-dock-action": "undock",
            onClick: R[1] || (R[1] = (P) => f(S.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var k, y;
        return [
          d.value ? (l(), h("p", v1, M(d.value), 1)) : N("", !0),
          e.item.text && !((k = a.value) != null && k.body_url) ? (l(), h("p", y1, M(e.item.text), 1)) : N("", !0),
          (y = a.value) != null && y.body_url ? (l(), Y(ss, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : N("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded"]));
  }
}, oa = /* @__PURE__ */ Z(w1, [["__scopeId", "data-v-608c189e"]]), k1 = ["title", "aria-label"], b1 = { class: "run-chip-in" }, $1 = {
  key: 0,
  class: "run-chip-ring"
}, x1 = { class: "run-chip-name" }, _1 = { class: "run-chip-bar" }, M1 = "processes.output", S1 = 3e3, E1 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var v;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((v = Fe(Ue, null)) == null ? void 0 : v.environment) ?? "", o = W(null), i = I(() => !o.value || o.value.state === "running" || o.value.state === "background"), r = I(() => {
      var S, A;
      return ((S = o.value) == null ? void 0 : S.title) || ((A = o.value) == null ? void 0 : A.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = I(() => i.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function d() {
      const S = await Mt(M1, ["process", "card", String(s.item.target_id)], a);
      S.ok && (o.value = S.value);
    }
    const f = setInterval(() => i.value && d(), S1);
    return Me(() => clearInterval(f)), d(), (S, A) => {
      var R;
      return l(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: r.value,
        "aria-label": `${r.value}; show its card`,
        style: we({ "--tone": c.value })
      }, [
        p("span", b1, [
          i.value ? (l(), h("span", $1)) : (l(), Y(Qe, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", x1, M(r.value), 1)
        ]),
        p("span", _1, [
          p("i", {
            style: we({ width: i.value ? `${((R = o.value) == null ? void 0 : R.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, k1);
    };
  }
}, A1 = /* @__PURE__ */ Z(E1, [["__scopeId", "data-v-10c2365f"]]), C1 = 24, O1 = 8, Kg = 420;
function Yg({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= C1 && e > t ? !0 : e < t && a > O1 ? !1 : null;
}
const T1 = (e, t) => e === void 0 ? t : e, B1 = 6, L1 = 3, ra = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, go = (e) => !!(e.leaves_at && !e.kept), I1 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!go(e) || t < e.leaves_at || n.has(e.id)), R1 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => I1(s, t, n)).sort((s, a) => s.id - a.id);
function D1(e, t, n = B1) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const j1 = (e, t) => e >= L1 ? !0 : e <= 1 ? !1 : t, N1 = { class: "dock-stack" }, P1 = ["onMouseenter", "onMouseleave"], q1 = {
  key: 0,
  class: "dock-runs-head"
}, W1 = ["onMouseenter", "onMouseleave"], H1 = { class: "dock-runs-chips" }, F1 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = W(Date.now() / 1e3), s = W(/* @__PURE__ */ new Set()), a = W(!1), o = W(!1), i = setInterval(() => n.value = Date.now() / 1e3, 500);
    Me(() => clearInterval(i));
    const r = I(() => R1(t.items, n.value, s.value)), c = I(() => D1(r.value.filter((P) => ra(P, os)), n.value)), d = I(() => r.value.filter((P) => !c.value.includes(P) && !ra(P, os))), f = I(() => (a.value = j1(c.value.length, a.value)) && !o.value), v = W({}), S = (P) => T1(v.value[P.id], t.folded);
    function A(P) {
      v.value = { ...v.value, [P.id]: !S(P) };
    }
    function R(P) {
      v.value = { ...v.value, ...Object.fromEntries(c.value.map((J) => [J.id, J.id !== P.id])) }, o.value = !0;
    }
    function k() {
      v.value = Object.fromEntries(Object.entries(v.value).filter(([P]) => !c.value.some((J) => String(J.id) === P))), o.value = !1;
    }
    function y(P) {
      s.value = /* @__PURE__ */ new Set([...s.value, P.id]);
    }
    function B(P) {
      s.value = new Set([...s.value].filter((J) => J !== P.id));
    }
    return (P, J) => (l(), h("div", N1, [
      (l(!0), h(X, null, re(d.value, (T) => (l(), h("div", {
        key: T.id,
        onMouseenter: (O) => y(T),
        onMouseleave: (O) => B(T)
      }, [
        F(oa, {
          item: T,
          leaving: G(go)(T) && !s.value.has(T.id),
          folded: S(T),
          onFold: (O) => A(T)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, P1))), 128)),
      a.value && o.value ? (l(), h("div", q1, [
        p("button", {
          type: "button",
          class: "dock-runs-toggle",
          "aria-expanded": "true",
          title: "Fold the runs into one line",
          "data-dock-runs-fold": "",
          onClick: k
        }, [
          fe(M(c.value.length) + " runs ", 1),
          F(sn, { open: "" })
        ])
      ])) : N("", !0),
      (l(!0), h(X, null, re(f.value ? [] : c.value, (T) => (l(), h("div", {
        key: T.id,
        onMouseenter: (O) => y(T),
        onMouseleave: (O) => B(T)
      }, [
        F(oa, {
          item: T,
          folded: S(T),
          onFold: (O) => A(T)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, W1))), 128)),
      f.value ? (l(), Y(po, {
        key: 1,
        label: `${c.value.length} runs`,
        kind: "dock-runs-row"
      }, {
        head: V(() => [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "false",
            title: "Show each run as its own card",
            "data-dock-runs-open": "",
            onClick: J[0] || (J[0] = (T) => o.value = !0)
          }, [
            F(Qe, { name: "runs" }),
            fe(" " + M(c.value.length) + " runs ", 1),
            F(sn)
          ]),
          p("span", H1, [
            (l(!0), h(X, null, re(c.value, (T) => (l(), Y(A1, {
              key: T.id,
              item: T,
              onClick: (O) => R(T)
            }, null, 8, ["item", "onClick"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["label"])) : N("", !0)
    ]));
  }
}, Jg = /* @__PURE__ */ Z(F1, [["__scopeId", "data-v-05bde3f3"]]), _t = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Kt = (e) => Math.min(Math.max(e, 0), 1), U1 = (e) => {
  const t = Kt(e);
  return t * t * (3 - 2 * t);
}, tt = (e, t, n) => U1((e - t) / (n - t));
function Zg(e) {
  const t = Kt(e), n = Kt((t - 0.12) / 0.76) * _t.shuffles, s = Math.min(Math.floor(n), _t.shuffles - 1), a = n - s, o = tt(a, 0.26, 0.38) * (1 - tt(a, 0.76, 0.96)), i = tt(a, 0.38, 0.76), r = tt(t, 0, 0.12) * (1 - tt(t, 0.88, 1)), c = tt(a, 0.2, 0.34) * (1 - tt(a, 0.84, 1)), d = Math.sin(Math.PI * Kt((a - 0.45) / 0.55)) ** 2;
  return { moved: i, across: (s + i) / _t.shuffles, lift: _t.lift * o, ready: r, weight: c, follow: d, shuffle: s, phase: a };
}
const vo = 2400, V1 = 0.05;
function Xg({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, V1), i = Math.min(t + vo * o, a), r = e + i * o;
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
}, rs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), z1 = (e) => e * e * (3 - 2 * e), on = (e, [t, n]) => z1(rs(e, t, n)), G1 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Ht = ([e, t], n) => e + n() * (t - e);
function K1(e) {
  return G1.map(() => {
    const t = Ht(Ye.speed, e), n = Ht(Ye.angle, e) * Math.PI / 180, s = Ht(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Ht(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const Y1 = K1(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function J1(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function Qg(e, t, n = Y1) {
  const s = Ze.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], i = J1(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= i + r) return null;
  const c = Math.min(a, i), d = s.from.map((f, v) => f + o.velocity[v] * c);
  return d[2] -= Ye.gravity * c * c / 2, { at: d, turn: o.spin * c, landed: Math.max(0, a - i) / r };
}
function ev(e, t) {
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
const tv = () => Array.from({ length: Ze.pogo.count }, (e, t) => Ze.pogo.bounce * (t + 1) / Ze.pogo.count), nv = { stride: 0.5 };
function yo(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: rs(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: rs(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function sv(e) {
  const { into: t, out: n } = yo(Ze.rope_swing, e);
  return 1 - on(t, [0, 1]) * (1 - on(n, [0, 1]));
}
function av(e) {
  const t = Ze.rope_swing, { into: n, out: s } = yo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return on(n, [0, 1]) * (1 - on(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Z1 = { after: 3 }, X1 = 10, Q1 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, ep = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, tp = { weight: 19 }, np = {
  build: { cooldown: 180 }
}, sp = { every: 120 }, wo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, ko = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, ap = {
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
}, It = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: X1 }), Q = (e, t, n = {}) => It(e, "clip", t, n), Bn = (e, t, n = {}) => It(e, "look", t, n), ia = (e, t, n = {}) => It(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...It(e, "pick", t, n), ...s }), pe = (e) => It("nothing", "nothing", e, {}), op = 120, rp = 300, Ln = (e, t) => ({ ...Q(e, t), cooldown: rp }), ip = 120, te = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), lp = () => [Q("joy", 2)], nt = (e, t, n, s, a = {}) => ({ ...Q(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), st = (e) => ({ ...e, cooldown: Q1[e.name] }), xt = (e) => ({ ...e, shenanigan: !0, lasts: ep[e.name] }), bs = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...te("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [Q("nod", 2), pe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...te("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...st(Q("bug_shot", 3)), toward: "", onto: !1 },
    { ...st(Q("bug_smash", 2)), toward: "", onto: !1 },
    Q("nod", 2)
  ]),
  ...te("tests_failed", { cooldown: 20, toward: "card" }, [Q("startled", 2), Q("dismay", 1), Q("tantrum", 3), pe(1)]),
  ...te("committed", { cooldown: 30, toward: "card", onto: !0 }, [Q("nod", 2), pe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...te("sin_fixed", { cooldown: 300 }, [Q("halo", 1), pe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...te("sin_committed", { cooldown: 300 }, [Q("repent", 1), pe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...te("messaged", { cooldown: ip }, [Q("phone_call", 1)]),
  ...te("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [Q("nod", 4), Q("hand_rub", 4), pe(7)]),
  ...te("question_asked", { cooldown: 60 }, [Q("ask_sign", 9), Q("look_up", 3), pe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...te("reported", { cooldown: 90 }, [ia("read", 3), Q("nod", 1), pe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...te("read_message", { cooldown: 30 }, [ia("read", 3), pe(1)]),
  ...te("fact_filed", { cooldown: 120 }, [Q("file_card", 3), Q("nod", 1), pe(6)]),
  ...te("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [Q("nod", 2), pe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...te("bar_done", { holds: !0 }, lp()),
  ...te("bar_failed", { holds: !0 }, [Q("fume", 1), Q("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...te("standing", { cooldown: 12 }, [Q("look_left", 2), Q("look_right", 2), Q("look_up", 1), pe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...te("launched", { cooldown: 300 }, [Q("tumble", 3), pe(47)]),
  // a break from the hammering now and then
  ...te("building", { cooldown: 30 }, [Q("wipe_brow", 4), Q("look_left", 1), Q("look_right", 1), pe(69)]),
  ...te("failed", { cooldown: 20, toward: "card" }, [Q("shake", 3), Q("tantrum", 2), pe(2)]),
  ...te("refused", { cooldown: 20 }, [Q("shake", 1), pe(1)]),
  ...te("work_done", { cooldown: 120 }, [Q("stretch", 2), pe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...te("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...te("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...te("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...te("answered", { cooldown: 15 }, [Bn("amused", 3), pe(2)]),
  ...te("heard", { cooldown: 30 }, [
    Q("bow", 1, { voices: ["butler"] }),
    Q("salute", 1, { voices: ["squire"] }),
    Q("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    pe(1)
  ]),
  ...te("long_walk", { cooldown: 90 }, [Q("stumble", 3), pe(22)]),
  ...te("card_arrived", { cooldown: 20, toward: "card" }, [Q("glance", 7), pe(13)]),
  ...te("typing", { cooldown: 60 }, [Bn("reading", 1), pe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(ap).flatMap(([e, t]) => te(`reacted:${e}`, {}, [Bn(t, 1)])),
  ...Object.entries(wo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => te(`agent_reacted:${n}`, {}, [Q(s, 1, { voices: [e] })])[0])),
  ...Object.entries(ko).flatMap(([e, t]) => te(`agent_reacted:${e}`, {}, [Q(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...te("pastime", {}, [
    nt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    nt("rest", 3, 180, 120),
    nt("yawn", 2, 60, 60),
    nt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    nt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    nt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    nt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...xt(st(Q("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    xt(st(Q("disco", 2, { ball: "bubble" }))),
    pe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...te("held:search", { cooldown: op }, [Ln("search", 3), { ...Ln("binoculars", 2), when: { home: !0 } }, { ...Ln("glass_bubble", 2), when: { bubble: !0 } }]),
  ...te("held:type", {}, [Q("type", 3), Q("type_ponder", 1)]),
  ...te("held:watch", {}, [Q("watch", 2), Q("wave_up", 1)]),
  ...te("held:compacting", {}, [Q("pack_box", 3), Q("vacuum", 2), Q("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...te("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), pe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...te("tickled", {}, [{ ...st(Q("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...te("eager", {}, [Q("eager", 2, { slow: !0 }), pe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...te("jump", {}, [xt(st(Q("backflip", 7, { high: !0 }))), Q("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...te("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...te("unit", { cooldown: np.build.cooldown }, [ce("unit", tp.weight), pe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...te("progress_jump", { cooldown: 6 }, [Q("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...te("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...te("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...te("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: sp.every }, ce("stand", 5)]),
  // a digit a blow's dust lets out
  ...te("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...te("roam", {}, [
    ce("rest", 35, {}, { stay: [25, 60] }),
    ce("seat", 15, {}, { stay: [15, 40] }),
    ce("edge", 25, {}, { stay: [8, 20] }),
    xt(ce("bubble", 15, {}, { stay: [30, 80] })),
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
    xt(st(ce("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...te("laptop", {}, [ce("seat", 6, {}, { stay: [60, 150] }), ce("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...te("ledge_at", {}, [ce("middle", 2, {}, { along: 1 / 2 }), ce("third", 1, {}, { along: 1 / 3 }), ce("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...te("composed_as", {}, [
    ce("facing", 4, {}, { turn: 0, leans: 0 }),
    ce("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ce("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ce("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ce("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], cp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), bo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), up = (e) => Array.isArray(e) ? e[0] : e, dp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function hp(e) {
  var d;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || bo(f).every(([v, S]) => n(v) >= up(S)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = bs.filter((f) => cp(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= Z1.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = r.filter((f) => {
    var v;
    return f.kind === "nothing" || f.name !== ((v = e.tally) == null ? void 0 : v.last);
  });
  return c.some((f) => f.kind !== "nothing") ? c : r;
}
function fp(e, t) {
  const n = hp(e);
  let s = t() * n.reduce((o, i) => o + i.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : ($o(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function $o(e, t, n) {
  var s;
  for (const [a, o] of bo(t)) (s = e.memory) == null || s.set(a, e.now + dp(o, n));
}
function ov(e, t, n) {
  $o(e, bs.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const la = {
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
}, rv = {
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
}, iv = 120, lv = (e) => la[e] || la.idle;
[.../* @__PURE__ */ new Set([...Object.values(wo).flatMap((e) => Object.keys(e)), ...Object.keys(ko)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function cv(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Te.ahead * n ? 180 : Math.sign(s) * Te.turn;
}
const ca = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function uv(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), i = Math.floor(o / Te.sweep) % a, r = o % Te.sweep, c = Te.sweep - Te.returnSeconds, d = ca((r - c) / Te.returnSeconds), f = r <= c ? ca(r / c) : 1 - d, v = i + ((i + 1) % a - i) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + v * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const pp = 1, mp = (e, t, n, s, a, o = 0) => fp({ moment: "jump", high: e > pp * t, memory: s, now: a, room: o }, n).name === "backflip", ua = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, dv = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, hv = { width: 24, height: 27, top: 3, units: 2 }, gp = "[data-figure-pile]", fv = { amber: [1, 0.69, 0.125], good: ua.colours.good, bad: ua.colours.bad }, In = { phases: 4, dim: 0.25 }, pv = (e, t, n) => e !== "amber" || (t + n) % In.phases < In.phases / 2 ? 1 : In.dim, vp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(bs.filter((e) => vp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const mv = {
  width: 84,
  belly: 13,
  blink: 4
}, da = "[data-figure-home]", Rt = () => {
  var t;
  const e = document.querySelector(da);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(da)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, yp = "[data-figure-docked-bars]", wp = "[data-figure-chat-foot]", kp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", bp = "[data-figure-newest]";
function $p() {
  var s, a;
  const e = (s = Rt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(bp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var i, r;
      return !((i = o.closest) != null && i.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !$s(o)) continue;
    const i = o.getBoundingClientRect();
    if (i.right > i.left && i.bottom > i.top) return i;
  }
  return null;
}
function xo(e, t, n = $p()) {
  if (!e || !n) return !0;
  const s = yt(e, t), a = xs(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, i = _t.gap;
  return !So(o, { left: n.left - i, right: n.right + i, top: n.top - i, bottom: n.bottom + i });
}
const Rn = 0.26, xp = 0.54, kn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Rn, travels: "stand" },
  lounge: { drop: Rn, travels: "stand" },
  composed: { drop: Rn, travels: "stand" },
  hang: { drop: xp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, _o = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), _p = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), gv = (e, t) => (e === "sit" ? _p.has(t) : _o.has(e)) ? e : "stand", vv = 0.25, yv = (e, t) => _o.has(e) && kn[t].drop === 0, Mo = 2, Mp = 90, Sp = 180, Ep = 140, Ap = 280, Cp = 420, Op = 0.25, Tp = 290, Bp = 600, Lp = "cubic-bezier(0.2, 0.7, 0.4, 1)", Ip = "cubic-bezier(0.55, 0, 0.9, 0.6)", Dn = 5;
function rn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: i = !1, sprinting: r = !1, random: c = Math.random, memory: d = null, now: f = 0, room: v = 0, pogo: S = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Dn) return null;
  (i || r) && (o = Math.max(o, Mo));
  const A = o > 1, R = Math.abs(t.x - e.x), k = R < Dn ? 0 : R / (Mp * o) * 1e3, y = Math.min(k, A ? Ep : Sp), B = Math.abs(t.y - e.y), P = t.y < e.y, J = P && !S && mp(B, n, c, d, f, v), T = P ? Cp + Math.min(B, 400) * Op : Math.sqrt(2 * B / vo) * 1e3, O = {
    x: t.x,
    y: t.y,
    ms: B > Dn ? J ? Bp : T : 0,
    lead: J ? Tp : P ? Ap : 0,
    easing: P ? Lp : Ip,
    hopping: !0,
    clip: J ? "backflip" : P ? "jump" : "fall"
  }, H = { x: t.x, y: t.y, ms: k + y, lead: 0, easing: "linear", ramp: y, ...A ? { clip: "run" } : {} }, b = S ? Rp(t, n) : O, g = P && !s ? [{ ...H, y: e.y }, b] : [{ ...O, x: e.x }, H];
  return { way: Math.sign(t.x - e.x) || 1, legs: g, lands: !a, pace: o, running: A };
}
const Rp = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), yt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - kn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, So = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, $s = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function wt() {
  var t;
  const e = (t = Rt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Ft = 0.5, ha = 20;
function wv(e, t, n = wt()) {
  const s = yt(e, t);
  return s.left >= n.left + ha && s.right <= n.right - ha;
}
function Eo(e, t, n = wt()) {
  const s = yt(e, t), a = s.right - s.left, o = xs(e), [i, r] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return i >= n.left - Ft && r <= n.right + Ft && s.top >= n.top - Ft && c <= n.bottom + Ft;
}
const ln = [0.35, 0.5, 0.65], cn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: ln[0], right: ln.at(-1), top: cn[0], bottom: cn.at(-1) }, Dp = 0.24;
function xs(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Dp * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function jp(e, { size: t }, n = wt()) {
  const s = xs(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Np = (Je.right - Je.left) / 2 + 0.08;
function Pp(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !$s(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, i = Math.min(a.startOffset, o.length - 1);
  for (const c of [i - 1, i].filter((d) => d >= 0)) {
    if (!o.data[c].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, c), d.setEnd(o, c + 1), [...d.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const qp = (e) => cn.flatMap(
  (t) => ln.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Wp(e, t, n = "") {
  if (!xo(e, t)) return ln.length * cn.length;
  const s = yt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(kp)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: c }) => c.width && c.height && So(a, c) && $s(r)).map(({ rect: r }) => r), i = (r, c) => o.some((d) => r >= d.left && r <= d.right && c >= d.top && c <= d.bottom);
  return qp(a).filter(([r, c]) => i(r, c) || Pp(r, c, n)).length;
}
function Hp(e, t, n) {
  const s = wt(), a = (i) => n ? Math.hypot(i.x - n.x, i.y - n.y) : 0, o = e.filter((i) => Eo(i, t, s) && xo(i, t)).map((i) => ({ spot: i, covered: Wp(i, t), away: a(i) }));
  return o.length ? o.reduce(
    (i, r) => r.covered < i.covered || r.covered === i.covered && r.away < i.away ? r : i
  ).spot : null;
}
const Ao = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Fp = Np, Up = (e, t, { size: n }, s = Fp) => Vp(e, Ao[t], s * n, "stand");
function Vp(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const kv = (e) => ((e + 180) % 360 + 360) % 360 - 180, bv = { turns: [-20, -10, 0, 10, 20] }, zp = 7;
function Gp() {
  const e = [...document.querySelectorAll(gp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const Kp = 4;
function Yp() {
  const e = Co(), t = Gp(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Kp || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - zp - n, 0) } };
}
const $v = ({ size: e, below: t }) => (1 - t) * e;
function Jp(e, t) {
  const n = wt(), { size: s, below: a } = t, o = kn[e.posture].drop * s;
  return { ...jp(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Zp = (e, t) => Object.keys(Ao).map((n) => Jp(Up(e, n, t), t)), Xp = (e, t, n) => Hp(e, t, n) ?? e[0];
function xv(e, t) {
  const { element: n, edge: s } = Yp();
  return { ...Xp(Zp(s, e), e, t), view: null, on: n };
}
function Co() {
  var s;
  const e = Rt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(yp);
  if (!t) return { ...Oo(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Oo() {
  const e = Rt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const Qp = { climb: 90 };
function _v(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: i = !1, random: r = Math.random, via: c = [], memory: d = null, now: f = 0, room: v = 0, pogo: S = !1 } = {}) {
  (o || i) && (a = Math.max(a, Mo));
  const A = (J) => {
    const T = yt(J, n, kn[J.posture].travels);
    return { x: T.left, y: T.top };
  }, R = t.ladder ?? e.ladder;
  if (R && !(t.ladder && e.ladder)) return em(A(e), A(t), A({ ...R.foot, posture: "stand" }), R.way, !!t.ladder, n, a);
  const [k, ...y] = [e, ...c, t].map(A), B = rn(k, y[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: i, random: r, memory: d, now: f, room: v, pogo: S }), P = y.slice(1).map((J, T) => {
    var O;
    return (O = rn(y[T], J, n.size, { random: r, memory: d, now: f, room: v })) == null ? void 0 : O.legs.find((H) => H.hopping);
  });
  return B && { ...B, legs: [...B.legs, ...P.filter(Boolean)] };
}
function em(e, t, n, s, a, o, i) {
  const r = (f, v) => ({ x: v.x, y: v.y, ms: Math.hypot(v.x - f.x, v.y - f.y) / Qp.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? rn(e, n, o.size, { pace: i }) : rn(n, t, o.size, { pace: i }), d = a ? [...(c == null ? void 0 : c.legs) ?? [], r(n, t)] : [r(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: i, running: i > 1 };
}
const tm = "[data-figure-bubble]", nm = 250;
let St = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), To = 0;
const Bo = () => St, jn = /* @__PURE__ */ new WeakMap();
let sm = 0;
function Lo(e) {
  return jn.has(e) || jn.set(e, `floor-${++sm}`), jn.get(e);
}
const am = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, om = () => {
  var e, t;
  return ((t = (e = Rt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function rm(e, t) {
  var s;
  const n = (s = e.querySelector(wp)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function im(e, t) {
  const n = e && rm(e, t), s = e ? [...e.querySelectorAll(tm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: i }) => ({ element: o, kind: i, box: o.getBoundingClientRect() })).filter(({ kind: o, box: i }) => i.width > 0 && i.height > 0 && (o !== "bubble" || am(i, n))).map(({ element: o, kind: i, box: r }) => ({ id: Lo(o), kind: i, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const lm = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= nm ? (t.top - s.top) / a * 1e3 : 0;
};
function cm(e = St, t = performance.now()) {
  const n = wt(), s = om(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: i, edge: r } = Co(), c = [];
  o && c.push({ id: "home", kind: i ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = Oo();
  return d.element && c.push({ id: Lo(d.element), kind: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), c.push(...im(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((f) => Object.freeze({ ...f, vy: lm(e, f, t) }))) });
}
const is = /* @__PURE__ */ new Set();
function um(e) {
  return is.add(e), () => is.delete(e);
}
function dm() {
  Io();
  const e = () => {
    To = requestAnimationFrame(e), !document.hidden && (St = cm(St), is.forEach((t) => t(St)));
  };
  e();
}
function Io() {
  cancelAnimationFrame(To);
}
const hm = (e, t) => e.find((n) => n.id === t) ?? null;
function Mv(e, t, n = Bo().floors) {
  const s = hm(n, "home");
  return e.posture === "hang" && s && yt(e, t).bottom >= s.top ? !1 : Eo(e, t);
}
const fm = ["data-kind"], pm = { class: "figure-floor-name" }, mm = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: we({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", pm, M(e.floor.kind), 1)
    ], 12, fm));
  }
}, gm = /* @__PURE__ */ Z(mm, [["__scopeId", "data-v-8f6132da"]]), vm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, ym = {
  __name: "FigureFloors",
  setup(e) {
    const t = dn(Bo().floors);
    let n = () => {
    };
    return je(() => {
      n = um((s) => t.value = s.floors), dm();
    }), Me(() => {
      n(), Io();
    }), (s, a) => (l(), h("div", vm, [
      (l(!0), h(X, null, re(t.value, (o) => (l(), Y(gm, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Sv = /* @__PURE__ */ Z(ym, [["__scopeId", "data-v-e519168b"]]), Nn = (e) => typeof e == "number" ? e : Date.parse(e);
function Ev(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Nn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Nn(a.row.created_at) - Nn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const wm = 3, Pn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function km(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Pn[n.grouping]) == null ? void 0 : s.call(Pn, e.row, n)) || "";
}
function bm(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Av(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= wm ? [bm(s, t)] : s), s = [];
  };
  for (const i of e) {
    const r = km(i, t);
    r !== a && o(), a = r, r ? s.push(i) : n.push(i);
  }
  return o(), n;
}
const $m = 2e3;
function Cv(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, $m);
  };
  je(async () => {
    await e(), s();
  }), ds(() => clearTimeout(n));
}
const fa = "newest";
function Ov(e, { title: t, isOpen: n = null }) {
  const s = W(""), a = W(fa), o = W("all"), i = I(() => {
    const r = s.value.trim().toLowerCase(), c = e.value.filter((d) => (!r || JSON.stringify(d).toLowerCase().includes(r)) && (o.value === "all" || !n || n(d) === (o.value === "open")));
    return a.value === fa ? c : [...c].sort((d, f) => t(d).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: i, hasStates: !!n };
}
const xm = {
  class: "list-tools",
  "data-list-tools": ""
}, _m = {
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
    return (s, a) => (l(), h("div", xm, [
      F(rh, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      F(ts, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (l(), Y(ts, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : N("", !0)
    ]));
  }
}, Tv = /* @__PURE__ */ Z(_m, [["__scopeId", "data-v-b2dd0a0d"]]);
function Bv() {
  const e = W(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Mm = 86400, ls = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Sm(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ls(t) - ls(e)) / Mm);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function Lv(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ls(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Sm(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const qn = 280, Wn = 240, Hn = 120, Em = 6, Am = 14, Ct = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Cm(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const i = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Am}px)` }), e.offsetHeight, e.style.transition = `height ${qn}ms ${Ct}`, e.style.height = `${i}px`;
  const r = a();
  let c = !1;
  const d = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - r;
    if (!c && f >= qn && (c = !0, e.style.transition = `opacity ${Wn}ms ease-out, transform ${Wn}ms ${Ct}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < qn + Wn) return s(d);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(d);
}
function Iv(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Em}px)` }), e.offsetHeight, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${Ct}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const i = a(), r = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - i < Hn) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const Om = 140, Ut = 220, Tm = 5;
function Rv({ gap: e = Om, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, Tm);
    if (s = r.length > 0, !s) return;
    let c = r.length;
    for (const d of r)
      d.el.style.display = d.display, d.arrival(d.el, d.options, () => {
        d.done(), c -= 1, c || t(o, e);
      });
  }
  const i = (r, c, d, f = Cm) => {
    if (!c.pane || !c.follows()) return d();
    const v = { el: r, options: c, done: d, arrival: f, display: r.style.display || "" };
    if (!s)
      return s = !0, f(r, c, () => a(v));
    r.style.display = "none", n.push(v);
  };
  return i.flush = () => {
    for (const r of n.splice(0))
      r.el.style.display = r.display, r.done();
  }, i;
}
function Dv(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Ut}ms ${Ct}, opacity ${Ut}ms ease-in, margin ${Ut}ms ${Ct}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Ut);
}
const Ro = "chat.pins.minimised", Yt = W(Et(Ro, !1));
function pa(e) {
  Yt.value = e, fn(Ro, e);
}
function Bm(e) {
  const t = I(() => e()), n = I(() => Yt.value ? [] : e()), s = () => pa(!Yt.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => Ta(o) > a).length,
    (o, i) => o > i && pa(!1)
  ), { pins: t, visible: n, minimised: Yt, toggle: s };
}
const Lm = ["title"], Im = {
  key: 0,
  class: "pins-count"
}, Rm = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Bm(() => t.notices);
    return (o, i) => G(n).length ? (l(), h("button", {
      key: 0,
      type: "button",
      class: ee(["pins-toggle", { minimised: G(s), inline: e.inline }]),
      title: G(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: i[0] || (i[0] = _e((...r) => G(a) && G(a)(...r), ["stop"]))
    }, [
      F(Ae, {
        name: G(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      G(s) ? (l(), h("span", Im, M(G(n).length), 1)) : N("", !0)
    ], 10, Lm)) : N("", !0);
  }
}, jv = /* @__PURE__ */ Z(Rm, [["__scopeId", "data-v-c0d11526"]]), Dm = ["title"], jm = ["title"], Nm = { class: "diff-card-dir" }, Pm = { class: "diff-card-name" }, qm = { class: "diff-card-ago" }, Wm = ["title"], Hm = ["title"], Fm = {
  key: 0,
  class: "diff-card-note"
}, Um = ["href"], Vm = ["src", "alt"], zm = { class: "diff-card-rows" }, Gm = { class: "diff-row-num" }, Km = { class: "diff-row-sign" }, Ym = { class: "diff-row-code" }, Jm = {
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
    function o(x) {
      (x.metaKey || x.ctrlKey) && (x.stopPropagation(), s("open", n.path));
    }
    const i = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, c = I(() => n.path.lastIndexOf("/") + 1), d = I(() => n.path.slice(0, c.value)), f = I(() => n.path.slice(c.value)), v = I(() => n.kind === "deleted"), S = I(() => i[n.kind]), A = I(() => new Set(n.rows.filter((x) => x.line_type === "add").map((x) => x.line))), R = W("after"), k = I(() => R.value === "before" ? n.whole.old : n.whole.text), y = I(() => n.whole && n.whole.text !== void 0 ? k.value.split(`
`).map((x, m) => ({ line_type: R.value === "after" && A.value.has(m + 1) ? "add" : "ctx", line: m + 1, text: x })) : n.rows.filter(
      (x) => !(n.editsOnly && ["ctx", "fold"].includes(x.line_type)) && !(n.hideRemovals && x.line_type === "del")
    )), B = W(!1), P = I(() => n.lines && !B.value && !n.whole), J = I(() => P.value ? y.value.slice(0, n.lines) : y.value), T = I(() => y.value.length - J.value.length), O = (x) => x.line === null || x.line_type === "del" ? "" : x.line, H = (x) => x.line_type === "fold" ? x.hidden ? `⋯ ${x.hidden} lines` : "⋯" : x.text, b = W(null), g = W(null);
    let w = null;
    return je(() => {
      if (!g.value) return;
      let x = !0;
      w = new ResizeObserver(() => {
        !b.value || !g.value || (b.value.style.transition = x ? "none" : "", b.value.style.height = `${g.value.offsetHeight}px`, x = !1);
      }), w.observe(g.value);
    }), Me(() => w && w.disconnect()), (x, m) => (l(), h("section", {
      class: ee(["diff-card", { half: e.half, gone: v.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: v.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: m[2] || (m[2] = (u) => !v.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${G(a)}-click to open it`,
          onClick: o
        }, [
          p("span", Nm, M(d.value), 1),
          p("span", Pm, M(f.value), 1),
          S.value ? (l(), h("span", {
            key: 0,
            class: ee(["diff-card-badge", e.kind])
          }, M(S.value), 3)) : N("", !0)
        ], 8, jm),
        p("span", {
          class: ee(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + M(e.added), 3),
        p("span", {
          class: ee(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + M(e.removed), 3),
        p("span", qm, M(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: R.value === "after" ? "Show the file before" : "Show the file after",
          onClick: m[0] || (m[0] = _e((u) => R.value = R.value === "after" ? "before" : "after", ["stop"]))
        }, M(R.value === "after" ? "After" : "Before"), 9, Wm)) : N("", !0),
        v.value ? N("", !0) : (l(), h("button", {
          key: 1,
          type: "button",
          class: ee(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: m[1] || (m[1] = _e((u) => s("whole"), ["stop"]))
        }, [
          F(Ae, {
            name: "file",
            size: 12
          })
        ], 10, Hm))
      ], 8, Dm),
      e.whole && e.whole.error ? (l(), h("p", Fm, M(e.whole.error), 1)) : N("", !0),
      !v.value && !e.folded ? (l(), h(X, { key: 1 }, [
        e.picture ? (l(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          p("img", {
            src: e.picture,
            alt: f.value,
            loading: "lazy"
          }, null, 8, Vm)
        ], 8, Um)) : (l(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: b,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: g,
            class: "diff-card-diff"
          }, [
            p("div", zm, [
              (l(!0), h(X, null, re(J.value, (u, C) => (l(), h("div", {
                key: C,
                class: ee(["diff-row", u.line_type, { fresh: e.fresh && u.edit === e.fresh }])
              }, [
                p("span", Gm, M(O(u)), 1),
                p("span", Km, M(r[u.line_type]), 1),
                p("span", Ym, M(H(u)), 1)
              ], 2))), 128)),
              T.value > 0 ? (l(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: m[3] || (m[3] = _e((u) => B.value = !0, ["stop"]))
              }, M(T.value) + " more " + M(T.value === 1 ? "line" : "lines"), 1)) : N("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : N("", !0)
    ], 2));
  }
}, Nv = /* @__PURE__ */ Z(Jm, [["__scopeId", "data-v-b6424f6e"]]), Zm = {
  key: 0,
  class: "menu-item-text"
}, Xm = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), h("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.description ? (l(), h("span", Zm, [
        p("span", null, [
          $e(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, M(e.description), 1)
      ])) : $e(t.$slots, "default", {}, void 0, !0, 1)
    ], 2));
  }
}, Qm = /* @__PURE__ */ Z(Xm, [["__scopeId", "data-v-5b5c4fd9"]]), e0 = {}, t0 = { class: "menu-label" };
function n0(e, t) {
  return l(), h("span", t0, [
    $e(e.$slots, "default", {}, void 0, !0)
  ]);
}
const s0 = /* @__PURE__ */ Z(e0, [["render", n0], ["__scopeId", "data-v-aa955b3e"]]), Do = /* @__PURE__ */ new WeakMap(), a0 = (e, t) => Do.set(e, t);
function o0(e, t) {
  for (let n = t; n; n = Do.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function r0(e, t) {
  const n = (s) => {
    var o, i;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((i = e.value) == null ? void 0 : i.$el) || e.value;
    a && !o0(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Me(() => window.removeEventListener("click", n));
}
const ct = 8, i0 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    })), r = W({ w: 0, h: 0 }), c = W(s.anchor ? s.anchor.getBoundingClientRect() : null), d = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), v = (u) => {
      const C = u.closest(".pane, .float-window");
      return C ? f(C.getBoundingClientRect()) : d();
    }, S = (u, C) => `${Math.max(0, u ? Math.min(u, C) : C)}px`;
    function A(u, C) {
      return {
        below: u.bottom - C.bottom - s.gap - ct,
        above: C.top - u.top - s.gap - ct,
        across: u.right - u.left - 2 * ct
      };
    }
    function R(u) {
      const C = v(s.anchor), $ = A(C, u);
      return r.value.w <= $.across && r.value.h <= Math.max($.below, $.above) ? C : d();
    }
    const k = I(() => {
      if (!c.value) return i.value;
      const u = c.value, C = R(u), $ = A(C, u), { w: E, h: U } = r.value, oe = s.align === "auto" ? u.left + u.right > C.left + C.right : s.align === "right", de = pi(oe ? u.right - E : u.left, C.left + ct, Math.max(C.left + ct, C.right - E - ct)), me = U > $.below && $.above > $.below ? { bottom: `${window.innerHeight - u.top + s.gap}px`, maxHeight: S(s.maxHeight, $.above) } : { top: `${u.bottom + s.gap}px`, maxHeight: S(s.maxHeight, $.below) };
      return { ...i.value, ...me, left: `${de}px`, maxWidth: S(s.maxWidth, $.across) };
    }), y = n, B = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function P(u) {
      const C = B(), $ = C.indexOf(document.activeElement);
      C[($ + u + C.length) % C.length].focus();
    }
    const J = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => y("close") }, T = (u) => J[u.key] && (u.preventDefault(), J[u.key]()), O = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let H = 0;
    const b = new ResizeObserver(() => {
      cancelAnimationFrame(H), H = requestAnimationFrame(O);
    });
    r0(a, (u) => s.anchor && !s.anchor.contains(u.target) && y("close"));
    const g = (u, C) => ["top", "left", "right", "bottom"].some(($) => Math.abs(u[$] - C[$]) > 1), w = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let x = 0;
    function m() {
      if (s.anchor) {
        const u = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || w(u)) return y("close");
        g(u, c.value) && (c.value = u);
      }
      x = requestAnimationFrame(m);
    }
    return je(() => {
      s.anchor && a.value && a0(a.value, s.anchor), O(), a.value && b.observe(a.value), !s.plain && B()[0] && B()[0].focus(), m();
    }), Me(() => {
      b.disconnect(), cancelAnimationFrame(x), cancelAnimationFrame(H);
    }), t({ element: a }), (u, C) => (l(), Y(ya, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", pt({
        ref_key: "panel",
        ref: a
      }, u.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: k.value,
        onKeydown: T
      }), [
        $e(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), l0 = /* @__PURE__ */ Z(i0, [["__scopeId", "data-v-3d203970"]]), c0 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), Y(ye, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: V(() => [
        F(Ae, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, u0 = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, d0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  started: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  testing: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, h0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], f0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], p0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], m0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], g0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], v0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? g0(t) : e === "agent" ? [...p0(t), ...f0(t)] : e === "check" ? m0(t) : e === "question" ? h0(t) : ((n = { plan: u0, task: d0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, y0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, w0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, k0 = { class: "ask-text" }, b0 = ["placeholder", "aria-label"], $0 = ["placeholder", "aria-label"], x0 = {
  key: 3,
  class: "moves"
}, _0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = I(() => v0(s.kind, s.row)), i = W(""), r = W(null), c = W(""), d = W("");
    be(() => s.id, () => {
      i.value = "", r.value = null;
    });
    async function f(A, R = "") {
      const k = await s.read([A.noun ?? s.kind, A.word, String(s.id), ...A.flag ? [A.flag, R] : A.positional ? [R] : [], ...A.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      i.value = k.ok ? "" : k.error, k.ok && (r.value = null, c.value = "", d.value = "", a("done"));
    }
    const v = (A) => A.confirm ? r.value = A : A.said ? f(A, A.said) : A.flag || A.positional ? (r.value = A, c.value = "") : f(A), S = () => c.value.trim() && f(r.value, c.value.trim());
    return t({ moves: o, press: v }), (A, R) => {
      var k;
      return o.value.length ? (l(), h("footer", {
        key: 0,
        class: ee(["foot", { inline: e.inline }])
      }, [
        i.value ? (l(), h("p", y0, M(i.value), 1)) : N("", !0),
        (k = r.value) != null && k.confirm ? (l(), h("div", w0, [
          p("span", k0, M(r.value.confirm), 1),
          F(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: R[0] || (R[0] = (y) => f(r.value))
          }, {
            default: V(() => [
              fe(M(r.value.label), 1)
            ]),
            _: 1
          }),
          F(ye, {
            small: "",
            kind: "ghost",
            onClick: R[1] || (R[1] = (y) => r.value = null)
          }, {
            default: V(() => [...R[7] || (R[7] = [
              fe("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (l(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: _e(S, ["prevent"])
        }, [
          mt(p("input", {
            "onUpdate:modelValue": R[2] || (R[2] = (y) => c.value = y),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: R[3] || (R[3] = Jt(_e((y) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, b0), [
            [zn, c.value]
          ]),
          r.value.opener ? mt((l(), h("input", {
            key: 0,
            "onUpdate:modelValue": R[4] || (R[4] = (y) => d.value = y),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: R[5] || (R[5] = Jt(_e((y) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, $0)), [
            [zn, d.value]
          ]) : N("", !0),
          F(ye, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: V(() => [
              fe(M(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(ye, {
            small: "",
            kind: "ghost",
            onClick: R[6] || (R[6] = (y) => r.value = null)
          }, {
            default: V(() => [...R[8] || (R[8] = [
              fe("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), h("div", x0, [
          (l(!0), h(X, null, re(o.value, (y) => (l(), Y(ye, {
            key: y.word,
            small: "",
            kind: y.main ? "primary" : "ghost",
            "data-move": y.word,
            onClick: (B) => v(y)
          }, {
            default: V(() => [
              fe(M(y.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : N("", !0);
    };
  }
}, M0 = /* @__PURE__ */ Z(_0, [["__scopeId", "data-v-fffa0bf6"]]), S0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, E0 = { ...S0, done: "Completed" }, A0 = { class: "task-status-icon" }, C0 = ["width", "height", "aria-label"], O0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), h("span", A0, [
      F(un, {
        name: "turn",
        mode: "out-in"
      }, {
        default: V(() => [
          (l(), h("svg", {
            key: e.status,
            class: ee(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": G(E0)[e.status]
          }, [
            F(hs, { value: e.status }, {
              blocked: V(() => [...n[0] || (n[0] = [
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
              done: V(() => [...n[1] || (n[1] = [
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
              started: V(() => [...n[2] || (n[2] = [
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
              asked: V(() => [...n[3] || (n[3] = [
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
              paused: V(() => [...n[4] || (n[4] = [
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
              planned: V(() => [...n[5] || (n[5] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: V(() => [...n[6] || (n[6] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, C0))
        ]),
        _: 1
      })
    ]));
  }
}, ma = /* @__PURE__ */ Z(O0, [["__scopeId", "data-v-2ab7e404"]]), T0 = {
  class: "comment-side",
  "data-comment-side": "",
  "aria-label": "Comments"
}, B0 = { class: "comment-side-head" }, L0 = {
  key: 0,
  class: "comment-none"
}, I0 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), h("aside", T0, [
      p("header", B0, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        F(fs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? N("", !0) : (l(), h("p", L0, "No comments yet")),
      (l(!0), h(X, null, re(e.comments, (s) => (l(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, M(e.words(s)), 1))), 128))
    ]));
  }
}, R0 = /* @__PURE__ */ Z(I0, [["__scopeId", "data-v-234cce45"]]), D0 = ["placeholder"], j0 = { class: "actions" }, N0 = { class: "error" }, P0 = {
  key: 1,
  class: "card closed"
}, q0 = { class: "mark" }, W0 = { class: "prompt" }, H0 = {
  key: 0,
  class: "draft"
}, F0 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Vn({
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
  emits: /* @__PURE__ */ Vn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Un(e, "draft"), i = Un(e, "error"), r = W(!!i.value), c = W(!1), d = W(!1), f = W(null);
    async function v() {
      var k, y;
      r.value = !0, c.value = !1, await hn(), (y = ((k = f.value) == null ? void 0 : k.querySelector("input")) || f.value) == null || y.focus();
    }
    function S() {
      r.value = !1, i.value = "";
    }
    function A(k) {
      k.shiftKey || k.isComposing || (k.preventDefault(), R());
    }
    async function R() {
      const k = o.value.trim();
      if (!(!k || !s.ready || d.value)) {
        i.value = "", d.value = !0, o.value = "";
        try {
          await s.send(k), r.value = !1, c.value = !0;
        } catch (y) {
          o.value = k, i.value = y.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: v }), (k, y) => (l(), h("div", {
      class: ee(["comment-bar", { open: r.value }])
    }, [
      r.value ? (l(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: _e(R, ["prevent"]),
        onKeydown: Jt(S, ["esc"])
      }, [
        $e(k.$slots, "who", {}, void 0, !0),
        mt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (B) => o.value = B),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Jt(A, ["enter"])
        }, null, 40, D0), [
          [zn, o.value]
        ]),
        p("div", j0, [
          p("span", N0, M(i.value), 1),
          F(ye, {
            small: "",
            onClick: S
          }, {
            default: V(() => [...y[2] || (y[2] = [
              fe("Cancel", -1)
            ])]),
            _: 1
          }),
          F(ye, {
            kind: "primary",
            small: "",
            busy: d.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: R
          }, {
            default: V(() => [...y[3] || (y[3] = [
              fe("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (l(), h("div", P0, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: v
        }, [
          p("span", q0, [
            F(Ae, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", W0, M(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), h("span", H0, "Draft kept")) : N("", !0)
        ]),
        e.count ? (l(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[1] || (y[1] = (B) => a("show"))
        }, [
          p("span", null, M(G(mi)(e.count, "comment")), 1),
          F(Ae, {
            name: "down",
            size: 12
          })
        ])) : N("", !0)
      ]))
    ], 2));
  }
}, U0 = /* @__PURE__ */ Z(F0, [["__scopeId", "data-v-4d1d3a74"]]);
function V0(e, t) {
  const n = W([]), s = W(!1);
  let a = 0, o = 0;
  const i = (d) => {
    const { kind: f, id: v, title: S } = e(), A = `On ${f} ${v}, ${S}: `;
    return d.text.startsWith(A) ? d.text.slice(A.length) : d.text;
  };
  async function r() {
    const { kind: d, id: f } = e();
    if (!f) return;
    const v = ++o, S = await t([d, "comments", String(f)]);
    v === o && (n.value = S.ok ? S.value.rows ?? [] : []);
  }
  async function c(d) {
    const { kind: f, id: v } = e(), S = { id: `sending-${++a}`, text: d };
    n.value = [...n.value, S], s.value = !0;
    const A = await t([f, "comment", String(v), d]);
    if (!A.ok)
      throw n.value = n.value.filter((R) => R !== S && R.id !== S.id), new Error(A.error);
    await r();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], r();
  }, { immediate: !0 }), { comments: n, open: s, words: i, send: c, load: r };
}
const z0 = { class: "top" }, G0 = {
  class: "crumb",
  "data-task-crumb": ""
}, K0 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Y0 = {
  key: 1,
  class: "body"
}, J0 = { class: "body-row" }, Z0 = { class: "stamp" }, X0 = {
  class: "title",
  "data-resource-title": ""
}, Q0 = { class: "since" }, eg = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, tg = { class: "text" }, ng = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, sg = {
  key: 1,
  class: "note"
}, ag = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, og = { class: "text" }, rg = { class: "facts" }, ig = { class: "fact wide" }, lg = { class: "fact-value" }, cg = {
  key: 0,
  class: "fact"
}, ug = { class: "fact-value" }, dg = {
  key: 1,
  class: "fact"
}, hg = { class: "fact-value" }, fg = {
  key: 2,
  class: "fact wide"
}, pg = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, mg = {
  key: 2,
  class: "part",
  "data-resource-waits": ""
}, gg = ["onClick"], vg = { class: "wait-id" }, yg = { class: "wait-title" }, wg = {
  key: 3,
  class: "part",
  "data-task-outcome": ""
}, kg = { class: "text" }, bg = {
  key: 4,
  class: "part",
  "data-task-brief": ""
}, $g = {
  key: 5,
  class: "part",
  "data-resource-logs": ""
}, xg = 180, _g = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = oo.map(({ key: b, label: g }) => ({ key: String(b), label: g })), a = /* @__PURE__ */ new Set(["completed", "cancelled"]), o = e, i = n, r = W(null), c = W(null), d = W(""), f = W(""), v = W(!1), S = W(null), A = W(null), R = V0(() => r.value ? { kind: "task", id: o.id, title: r.value.title } : {}, (b) => o.read(b));
    be(R.open, (b) => i("comments", b));
    let k = 0;
    const y = (b) => a.has(b) ? "done" : b, B = (b) => b.slice(0, 1).toUpperCase() + b.slice(1), P = I(() => {
      var b;
      return (b = c.value) != null && b.plan_id ? c.value.phase_total > 1 ? `Plan ${c.value.plan_id} › Phase ${c.value.phase_number}: ${c.value.phase_title}` : `Plan ${c.value.plan_id}: ${c.value.plan_title}` : "Not in a plan";
    });
    async function J() {
      const b = ++k, [g, w] = await Promise.all([o.read(["task", "inspect", String(o.id)]), o.read(["plan", "place", String(o.id)])]);
      b === k && (d.value = g.ok ? "" : g.error, r.value = g.ok ? g.value : null, c.value = w.ok ? w.value : null);
    }
    be(() => o.id, () => {
      r.value = null, c.value = null, v.value = !1, S.value = null, J();
    }, { immediate: !0 }), be(() => o.changes, J);
    async function T(b) {
      const g = r.value.priority;
      r.value.priority = Number(b);
      const w = await o.read(["task", "edit", String(o.id), "--priority", b]);
      if (f.value = w.ok ? "" : w.error, w.ok) return J();
      r.value.priority = g;
    }
    function O(b) {
      S.value = null, A.value.press(b);
    }
    const H = (b) => {
      var g;
      return ((g = A.value) == null ? void 0 : g.moves.length) && (S.value = b);
    };
    return t({ openStatus: H }), (b, g) => {
      var w, x, m;
      return l(), h("aside", {
        class: ee(["task-inspector", { lone: e.lone }]),
        "data-task-inspector": ""
      }, [
        p("div", z0, [
          e.backed ? (l(), Y(c0, {
            key: 0,
            onBack: g[0] || (g[0] = (u) => i("back"))
          })) : N("", !0),
          p("span", G0, M(P.value), 1),
          g[9] || (g[9] = p("span", { class: "grow" }, null, -1)),
          e.stepped ? (l(), h(X, { key: 1 }, [
            F(ye, {
              small: "",
              title: "Previous task (K)",
              "aria-label": "Previous task",
              onClick: g[1] || (g[1] = (u) => i("step", -1))
            }, {
              default: V(() => [
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
              default: V(() => [
                F(Ae, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : N("", !0),
          F(ye, {
            small: "",
            "aria-label": "Close the task (Esc)",
            "data-resource-close": "",
            onClick: g[3] || (g[3] = (u) => i("close"))
          }, {
            default: V(() => [
              F(Ae, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          })
        ]),
        d.value ? (l(), h("p", K0, M(d.value), 1)) : r.value ? (l(), h(X, { key: 2 }, [
          p("div", J0, [
            (l(), h("div", {
              key: r.value.id,
              class: "body"
            }, [
              p("div", Z0, "Task " + M(r.value.id) + " · updated " + M(G(js)(G(en)(r.value)) || "just now"), 1),
              p("h3", X0, M(r.value.title), 1),
              p("div", {
                class: ee(["state-line", y(r.value.state)])
              }, [
                p("button", {
                  type: "button",
                  class: "state",
                  "data-task-state": "",
                  title: "Change the status (S)",
                  onClick: g[4] || (g[4] = (u) => H(u.currentTarget))
                }, [
                  F(ma, {
                    status: y(r.value.state)
                  }, null, 8, ["status"]),
                  fe(" " + M(B(r.value.state)), 1)
                ]),
                p("span", Q0, "since " + M(G(js)(G(en)(r.value)) || "just now"), 1)
              ], 2),
              r.value.state === "blocked" ? (l(), h("section", eg, [
                g[10] || (g[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                p("p", tg, M(r.value.reason || "Other tasks"), 1),
                (w = r.value.openers) != null && w.length ? (l(), h("p", ng, "Opens by itself when " + M(r.value.openers.join(" or ")) + ".", 1)) : (l(), h("p", sg, "Nothing opens it by itself. Unblock it when that is done."))
              ])) : r.value.state === "cancelled" && r.value.reason ? (l(), h("section", ag, [
                g[11] || (g[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                p("p", og, M(r.value.reason), 1)
              ])) : N("", !0),
              p("div", rg, [
                p("div", ig, [
                  g[12] || (g[12] = p("span", { class: "fact-label" }, "Plan", -1)),
                  p("span", lg, M((x = c.value) != null && x.plan_id ? `Plan ${c.value.plan_id}: ${c.value.plan_title}` : "Not in a plan"), 1)
                ]),
                ((m = c.value) == null ? void 0 : m.phase_total) > 1 ? (l(), h("div", cg, [
                  g[13] || (g[13] = p("span", { class: "fact-label" }, "Phase", -1)),
                  p("span", ug, M(c.value.phase_number) + " of " + M(c.value.phase_total) + ": " + M(c.value.phase_title), 1)
                ])) : N("", !0),
                r.value.state === "started" && r.value.holder_id ? (l(), h("div", dg, [
                  g[14] || (g[14] = p("span", { class: "fact-label" }, "Holder", -1)),
                  p("span", hg, "Agent " + M(r.value.holder_id), 1)
                ])) : N("", !0),
                G(a).has(r.value.state) ? N("", !0) : (l(), h("div", fg, [
                  g[15] || (g[15] = p("span", { class: "fact-label" }, "Priority", -1)),
                  F(ts, {
                    options: G(s),
                    value: String(r.value.priority),
                    "data-task-priority": "",
                    onPick: T
                  }, null, 8, ["options", "value"]),
                  f.value ? (l(), h("p", pg, M(f.value), 1)) : N("", !0)
                ]))
              ]),
              r.value.waits.length ? (l(), h("section", mg, [
                g[16] || (g[16] = p("h4", null, "Waits on", -1)),
                (l(!0), h(X, null, re(r.value.waits, (u) => (l(), h("button", {
                  key: u.id,
                  type: "button",
                  class: "wait",
                  onClick: (C) => i("select", u.id)
                }, [
                  F(ma, {
                    status: y(u.state),
                    size: 12
                  }, null, 8, ["status"]),
                  p("span", vg, M(u.id), 1),
                  p("span", yg, M(u.title), 1)
                ], 8, gg))), 128))
              ])) : N("", !0),
              r.value.state === "completed" && r.value.outcome ? (l(), h("section", wg, [
                g[17] || (g[17] = p("h4", null, "How it was done", -1)),
                p("p", kg, M(r.value.outcome), 1)
              ])) : N("", !0),
              r.value.brief ? (l(), h("section", bg, [
                g[18] || (g[18] = p("h4", null, "The brief", -1)),
                p("p", {
                  class: ee(["text", { clamped: !v.value }])
                }, M(r.value.brief), 3),
                r.value.brief.length > xg && !v.value ? (l(), h("button", {
                  key: 0,
                  type: "button",
                  class: "more",
                  onClick: g[5] || (g[5] = (u) => v.value = !0)
                }, "Show the whole brief")) : N("", !0)
              ])) : N("", !0),
              r.value.logs.length ? (l(), h("section", $g, [
                g[19] || (g[19] = p("h4", null, "Log", -1)),
                (l(!0), h(X, null, re(r.value.logs, (u) => (l(), h("p", {
                  key: u.id,
                  class: "log"
                }, M(u.line), 1))), 128))
              ])) : N("", !0)
            ])),
            G(R).open.value ? (l(), Y(R0, {
              key: 0,
              comments: G(R).comments.value,
              words: G(R).words,
              onClose: g[6] || (g[6] = (u) => G(R).open.value = !1)
            }, null, 8, ["comments", "words"])) : N("", !0)
          ]),
          F(U0, {
            send: G(R).send,
            count: G(R).comments.value.length,
            onShow: g[7] || (g[7] = (u) => G(R).open.value = !G(R).open.value)
          }, null, 8, ["send", "count"])
        ], 64)) : (l(), h("div", Y0, [
          F(Ot)
        ])),
        F(M0, {
          ref_key: "footer",
          ref: A,
          kind: "task",
          id: e.id,
          row: r.value,
          read: e.read,
          onDone: J
        }, null, 8, ["id", "row", "read"]),
        S.value ? (l(), Y(l0, {
          key: 3,
          anchor: S.value,
          "min-width": 220,
          "max-width": 300,
          onClose: g[8] || (g[8] = (u) => S.value = null)
        }, {
          default: V(() => [
            F(s0, null, {
              default: V(() => [
                fe("Change the status of task " + M(e.id), 1)
              ]),
              _: 1
            }),
            (l(!0), h(X, null, re(A.value.moves, (u) => (l(), Y(Qm, {
              key: u.word,
              onClick: (C) => O(u)
            }, {
              default: V(() => [
                fe(M(u.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : N("", !0)
      ], 2);
    };
  }
}, Pv = /* @__PURE__ */ Z(_g, [["__scopeId", "data-v-5b960ff7"]]);
function Mg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Fn = { exports: {} }, ga;
function Sg() {
  return ga || (ga = 1, (function(e, t) {
    var n = (function() {
      var s = function(O, H) {
        var b = 236, g = 17, w = O, x = o[H], m = null, u = 0, C = null, $ = [], E = {}, U = function(L, D) {
          u = w * 4 + 17, m = (function(_) {
            for (var j = new Array(_), q = 0; q < _; q += 1) {
              j[q] = new Array(_);
              for (var K = 0; K < _; K += 1)
                j[q][K] = null;
            }
            return j;
          })(u), oe(0, 0), oe(u - 7, 0), oe(0, u - 7), me(), le(), Ne(L, D), w >= 7 && Se(L), C == null && (C = jo(w, x, $)), Pe(C, D);
        }, oe = function(L, D) {
          for (var _ = -1; _ <= 7; _ += 1)
            if (!(L + _ <= -1 || u <= L + _))
              for (var j = -1; j <= 7; j += 1)
                D + j <= -1 || u <= D + j || (0 <= _ && _ <= 6 && (j == 0 || j == 6) || 0 <= j && j <= 6 && (_ == 0 || _ == 6) || 2 <= _ && _ <= 4 && 2 <= j && j <= 4 ? m[L + _][D + j] = !0 : m[L + _][D + j] = !1);
        }, de = function() {
          for (var L = 0, D = 0, _ = 0; _ < 8; _ += 1) {
            U(!0, _);
            var j = r.getLostPoint(E);
            (_ == 0 || L > j) && (L = j, D = _);
          }
          return D;
        }, le = function() {
          for (var L = 8; L < u - 8; L += 1)
            m[L][6] == null && (m[L][6] = L % 2 == 0);
          for (var D = 8; D < u - 8; D += 1)
            m[6][D] == null && (m[6][D] = D % 2 == 0);
        }, me = function() {
          for (var L = r.getPatternPosition(w), D = 0; D < L.length; D += 1)
            for (var _ = 0; _ < L.length; _ += 1) {
              var j = L[D], q = L[_];
              if (m[j][q] == null)
                for (var K = -2; K <= 2; K += 1)
                  for (var se = -2; se <= 2; se += 1)
                    K == -2 || K == 2 || se == -2 || se == 2 || K == 0 && se == 0 ? m[j + K][q + se] = !0 : m[j + K][q + se] = !1;
            }
        }, Se = function(L) {
          for (var D = r.getBCHTypeNumber(w), _ = 0; _ < 18; _ += 1) {
            var j = !L && (D >> _ & 1) == 1;
            m[Math.floor(_ / 3)][_ % 3 + u - 8 - 3] = j;
          }
          for (var _ = 0; _ < 18; _ += 1) {
            var j = !L && (D >> _ & 1) == 1;
            m[_ % 3 + u - 8 - 3][Math.floor(_ / 3)] = j;
          }
        }, Ne = function(L, D) {
          for (var _ = x << 3 | D, j = r.getBCHTypeInfo(_), q = 0; q < 15; q += 1) {
            var K = !L && (j >> q & 1) == 1;
            q < 6 ? m[q][8] = K : q < 8 ? m[q + 1][8] = K : m[u - 15 + q][8] = K;
          }
          for (var q = 0; q < 15; q += 1) {
            var K = !L && (j >> q & 1) == 1;
            q < 8 ? m[8][u - q - 1] = K : q < 9 ? m[8][15 - q - 1 + 1] = K : m[8][15 - q - 1] = K;
          }
          m[u - 8][8] = !L;
        }, Pe = function(L, D) {
          for (var _ = -1, j = u - 1, q = 7, K = 0, se = r.getMaskFunction(D), ne = u - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (m[j][ne - ge] == null) {
                  var ke = !1;
                  K < L.length && (ke = (L[K] >>> q & 1) == 1);
                  var ae = se(j, ne - ge);
                  ae && (ke = !ke), m[j][ne - ge] = ke, q -= 1, q == -1 && (K += 1, q = 7);
                }
              if (j += _, j < 0 || u <= j) {
                j -= _, _ = -_;
                break;
              }
            }
        }, rt = function(L, D) {
          for (var _ = 0, j = 0, q = 0, K = new Array(D.length), se = new Array(D.length), ne = 0; ne < D.length; ne += 1) {
            var ge = D[ne].dataCount, ke = D[ne].totalCount - ge;
            j = Math.max(j, ge), q = Math.max(q, ke), K[ne] = new Array(ge);
            for (var ae = 0; ae < K[ne].length; ae += 1)
              K[ne][ae] = 255 & L.getBuffer()[ae + _];
            _ += ge;
            var Ce = r.getErrorCorrectPolynomial(ke), Oe = d(K[ne], Ce.getLength() - 1), _s = Oe.mod(Ce);
            se[ne] = new Array(Ce.getLength() - 1);
            for (var ae = 0; ae < se[ne].length; ae += 1) {
              var Ms = ae + _s.getLength() - se[ne].length;
              se[ne][ae] = Ms >= 0 ? _s.getAt(Ms) : 0;
            }
          }
          for (var Ss = 0, ae = 0; ae < D.length; ae += 1)
            Ss += D[ae].totalCount;
          for (var bn = new Array(Ss), Dt = 0, ae = 0; ae < j; ae += 1)
            for (var ne = 0; ne < D.length; ne += 1)
              ae < K[ne].length && (bn[Dt] = K[ne][ae], Dt += 1);
          for (var ae = 0; ae < q; ae += 1)
            for (var ne = 0; ne < D.length; ne += 1)
              ae < se[ne].length && (bn[Dt] = se[ne][ae], Dt += 1);
          return bn;
        }, jo = function(L, D, _) {
          for (var j = f.getRSBlocks(L, D), q = v(), K = 0; K < _.length; K += 1) {
            var se = _[K];
            q.put(se.getMode(), 4), q.put(se.getLength(), r.getLengthInBits(se.getMode(), L)), se.write(q);
          }
          for (var ne = 0, K = 0; K < j.length; K += 1)
            ne += j[K].dataCount;
          if (q.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + q.getLengthInBits() + ">" + ne * 8 + ")";
          for (q.getLengthInBits() + 4 <= ne * 8 && q.put(0, 4); q.getLengthInBits() % 8 != 0; )
            q.putBit(!1);
          for (; !(q.getLengthInBits() >= ne * 8 || (q.put(b, 8), q.getLengthInBits() >= ne * 8)); )
            q.put(g, 8);
          return rt(q, j);
        };
        E.addData = function(L, D) {
          D = D || "Byte";
          var _ = null;
          switch (D) {
            case "Numeric":
              _ = S(L);
              break;
            case "Alphanumeric":
              _ = A(L);
              break;
            case "Byte":
              _ = R(L);
              break;
            case "Kanji":
              _ = k(L);
              break;
            default:
              throw "mode:" + D;
          }
          $.push(_), C = null;
        }, E.isDark = function(L, D) {
          if (L < 0 || u <= L || D < 0 || u <= D)
            throw L + "," + D;
          return m[L][D];
        }, E.getModuleCount = function() {
          return u;
        }, E.make = function() {
          if (w < 1) {
            for (var L = 1; L < 40; L++) {
              for (var D = f.getRSBlocks(L, x), _ = v(), j = 0; j < $.length; j++) {
                var q = $[j];
                _.put(q.getMode(), 4), _.put(q.getLength(), r.getLengthInBits(q.getMode(), L)), q.write(_);
              }
              for (var K = 0, j = 0; j < D.length; j++)
                K += D[j].dataCount;
              if (_.getLengthInBits() <= K * 8)
                break;
            }
            w = L;
          }
          U(!1, de());
        }, E.createTableTag = function(L, D) {
          L = L || 2, D = typeof D > "u" ? L * 4 : D;
          var _ = "";
          _ += '<table style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: " + D + "px;", _ += '">', _ += "<tbody>";
          for (var j = 0; j < E.getModuleCount(); j += 1) {
            _ += "<tr>";
            for (var q = 0; q < E.getModuleCount(); q += 1)
              _ += '<td style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: 0px;", _ += " width: " + L + "px;", _ += " height: " + L + "px;", _ += " background-color: ", _ += E.isDark(j, q) ? "#000000" : "#ffffff", _ += ";", _ += '"/>';
            _ += "</tr>";
          }
          return _ += "</tbody>", _ += "</table>", _;
        }, E.createSvgTag = function(L, D, _, j) {
          var q = {};
          typeof arguments[0] == "object" && (q = arguments[0], L = q.cellSize, D = q.margin, _ = q.alt, j = q.title), L = L || 2, D = typeof D > "u" ? L * 4 : D, _ = typeof _ == "string" ? { text: _ } : _ || {}, _.text = _.text || null, _.id = _.text ? _.id || "qrcode-description" : null, j = typeof j == "string" ? { text: j } : j || {}, j.text = j.text || null, j.id = j.text ? j.id || "qrcode-title" : null;
          var K = E.getModuleCount() * L + D * 2, se, ne, ge, ke, ae = "", Ce;
          for (Ce = "l" + L + ",0 0," + L + " -" + L + ",0 0,-" + L + "z ", ae += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ae += q.scalable ? "" : ' width="' + K + 'px" height="' + K + 'px"', ae += ' viewBox="0 0 ' + K + " " + K + '" ', ae += ' preserveAspectRatio="xMinYMin meet"', ae += j.text || _.text ? ' role="img" aria-labelledby="' + it([j.id, _.id].join(" ").trim()) + '"' : "", ae += ">", ae += j.text ? '<title id="' + it(j.id) + '">' + it(j.text) + "</title>" : "", ae += _.text ? '<description id="' + it(_.id) + '">' + it(_.text) + "</description>" : "", ae += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ae += '<path d="', ge = 0; ge < E.getModuleCount(); ge += 1)
            for (ke = ge * L + D, se = 0; se < E.getModuleCount(); se += 1)
              E.isDark(ge, se) && (ne = se * L + D, ae += "M" + ne + "," + ke + Ce);
          return ae += '" stroke="transparent" fill="black"/>', ae += "</svg>", ae;
        }, E.createDataURL = function(L, D) {
          L = L || 2, D = typeof D > "u" ? L * 4 : D;
          var _ = E.getModuleCount() * L + D * 2, j = D, q = _ - D;
          return T(_, _, function(K, se) {
            if (j <= K && K < q && j <= se && se < q) {
              var ne = Math.floor((K - j) / L), ge = Math.floor((se - j) / L);
              return E.isDark(ge, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, E.createImgTag = function(L, D, _) {
          L = L || 2, D = typeof D > "u" ? L * 4 : D;
          var j = E.getModuleCount() * L + D * 2, q = "";
          return q += "<img", q += ' src="', q += E.createDataURL(L, D), q += '"', q += ' width="', q += j, q += '"', q += ' height="', q += j, q += '"', _ && (q += ' alt="', q += it(_), q += '"'), q += "/>", q;
        };
        var it = function(L) {
          for (var D = "", _ = 0; _ < L.length; _ += 1) {
            var j = L.charAt(_);
            switch (j) {
              case "<":
                D += "&lt;";
                break;
              case ">":
                D += "&gt;";
                break;
              case "&":
                D += "&amp;";
                break;
              case '"':
                D += "&quot;";
                break;
              default:
                D += j;
                break;
            }
          }
          return D;
        }, No = function(L) {
          var D = 1;
          L = typeof L > "u" ? D * 2 : L;
          var _ = E.getModuleCount() * D + L * 2, j = L, q = _ - L, K, se, ne, ge, ke, ae = {
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
          for (K = 0; K < _; K += 2) {
            for (ne = Math.floor((K - j) / D), ge = Math.floor((K + 1 - j) / D), se = 0; se < _; se += 1)
              ke = "█", j <= se && se < q && j <= K && K < q && E.isDark(ne, Math.floor((se - j) / D)) && (ke = " "), j <= se && se < q && j <= K + 1 && K + 1 < q && E.isDark(ge, Math.floor((se - j) / D)) ? ke += " " : ke += "█", Oe += L < 1 && K + 1 >= q ? Ce[ke] : ae[ke];
            Oe += `
`;
          }
          return _ % 2 && L > 0 ? Oe.substring(0, Oe.length - _ - 1) + Array(_ + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return E.createASCII = function(L, D) {
          if (L = L || 1, L < 2)
            return No(D);
          L -= 1, D = typeof D > "u" ? L * 2 : D;
          var _ = E.getModuleCount() * L + D * 2, j = D, q = _ - D, K, se, ne, ge, ke = Array(L + 1).join("██"), ae = Array(L + 1).join("  "), Ce = "", Oe = "";
          for (K = 0; K < _; K += 1) {
            for (ne = Math.floor((K - j) / L), Oe = "", se = 0; se < _; se += 1)
              ge = 1, j <= se && se < q && j <= K && K < q && E.isDark(ne, Math.floor((se - j) / L)) && (ge = 0), Oe += ge ? ke : ae;
            for (ne = 0; ne < L; ne += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, E.renderTo2dContext = function(L, D) {
          D = D || 2;
          for (var _ = E.getModuleCount(), j = 0; j < _; j++)
            for (var q = 0; q < _; q++)
              L.fillStyle = E.isDark(j, q) ? "black" : "white", L.fillRect(j * D, q * D, D, D);
        }, E;
      };
      s.stringToBytesFuncs = {
        default: function(O) {
          for (var H = [], b = 0; b < O.length; b += 1) {
            var g = O.charCodeAt(b);
            H.push(g & 255);
          }
          return H;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(O, H) {
        var b = (function() {
          for (var w = P(O), x = function() {
            var le = w.read();
            if (le == -1) throw "eof";
            return le;
          }, m = 0, u = {}; ; ) {
            var C = w.read();
            if (C == -1) break;
            var $ = x(), E = x(), U = x(), oe = String.fromCharCode(C << 8 | $), de = E << 8 | U;
            u[oe] = de, m += 1;
          }
          if (m != H)
            throw m + " != " + H;
          return u;
        })(), g = 63;
        return function(w) {
          for (var x = [], m = 0; m < w.length; m += 1) {
            var u = w.charCodeAt(m);
            if (u < 128)
              x.push(u);
            else {
              var C = b[w.charAt(m)];
              typeof C == "number" ? (C & 255) == C ? x.push(C) : (x.push(C >>> 8), x.push(C & 255)) : x.push(g);
            }
          }
          return x;
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
        var O = [
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
        ], H = 1335, b = 7973, g = 21522, w = {}, x = function(m) {
          for (var u = 0; m != 0; )
            u += 1, m >>>= 1;
          return u;
        };
        return w.getBCHTypeInfo = function(m) {
          for (var u = m << 10; x(u) - x(H) >= 0; )
            u ^= H << x(u) - x(H);
          return (m << 10 | u) ^ g;
        }, w.getBCHTypeNumber = function(m) {
          for (var u = m << 12; x(u) - x(b) >= 0; )
            u ^= b << x(u) - x(b);
          return m << 12 | u;
        }, w.getPatternPosition = function(m) {
          return O[m - 1];
        }, w.getMaskFunction = function(m) {
          switch (m) {
            case i.PATTERN000:
              return function(u, C) {
                return (u + C) % 2 == 0;
              };
            case i.PATTERN001:
              return function(u, C) {
                return u % 2 == 0;
              };
            case i.PATTERN010:
              return function(u, C) {
                return C % 3 == 0;
              };
            case i.PATTERN011:
              return function(u, C) {
                return (u + C) % 3 == 0;
              };
            case i.PATTERN100:
              return function(u, C) {
                return (Math.floor(u / 2) + Math.floor(C / 3)) % 2 == 0;
              };
            case i.PATTERN101:
              return function(u, C) {
                return u * C % 2 + u * C % 3 == 0;
              };
            case i.PATTERN110:
              return function(u, C) {
                return (u * C % 2 + u * C % 3) % 2 == 0;
              };
            case i.PATTERN111:
              return function(u, C) {
                return (u * C % 3 + (u + C) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + m;
          }
        }, w.getErrorCorrectPolynomial = function(m) {
          for (var u = d([1], 0), C = 0; C < m; C += 1)
            u = u.multiply(d([1, c.gexp(C)], 0));
          return u;
        }, w.getLengthInBits = function(m, u) {
          if (1 <= u && u < 10)
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
          else if (u < 27)
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
          else if (u < 41)
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
            throw "type:" + u;
        }, w.getLostPoint = function(m) {
          for (var u = m.getModuleCount(), C = 0, $ = 0; $ < u; $ += 1)
            for (var E = 0; E < u; E += 1) {
              for (var U = 0, oe = m.isDark($, E), de = -1; de <= 1; de += 1)
                if (!($ + de < 0 || u <= $ + de))
                  for (var le = -1; le <= 1; le += 1)
                    E + le < 0 || u <= E + le || de == 0 && le == 0 || oe == m.isDark($ + de, E + le) && (U += 1);
              U > 5 && (C += 3 + U - 5);
            }
          for (var $ = 0; $ < u - 1; $ += 1)
            for (var E = 0; E < u - 1; E += 1) {
              var me = 0;
              m.isDark($, E) && (me += 1), m.isDark($ + 1, E) && (me += 1), m.isDark($, E + 1) && (me += 1), m.isDark($ + 1, E + 1) && (me += 1), (me == 0 || me == 4) && (C += 3);
            }
          for (var $ = 0; $ < u; $ += 1)
            for (var E = 0; E < u - 6; E += 1)
              m.isDark($, E) && !m.isDark($, E + 1) && m.isDark($, E + 2) && m.isDark($, E + 3) && m.isDark($, E + 4) && !m.isDark($, E + 5) && m.isDark($, E + 6) && (C += 40);
          for (var E = 0; E < u; E += 1)
            for (var $ = 0; $ < u - 6; $ += 1)
              m.isDark($, E) && !m.isDark($ + 1, E) && m.isDark($ + 2, E) && m.isDark($ + 3, E) && m.isDark($ + 4, E) && !m.isDark($ + 5, E) && m.isDark($ + 6, E) && (C += 40);
          for (var Se = 0, E = 0; E < u; E += 1)
            for (var $ = 0; $ < u; $ += 1)
              m.isDark($, E) && (Se += 1);
          var Ne = Math.abs(100 * Se / u / u - 50) / 5;
          return C += Ne * 10, C;
        }, w;
      })(), c = (function() {
        for (var O = new Array(256), H = new Array(256), b = 0; b < 8; b += 1)
          O[b] = 1 << b;
        for (var b = 8; b < 256; b += 1)
          O[b] = O[b - 4] ^ O[b - 5] ^ O[b - 6] ^ O[b - 8];
        for (var b = 0; b < 255; b += 1)
          H[O[b]] = b;
        var g = {};
        return g.glog = function(w) {
          if (w < 1)
            throw "glog(" + w + ")";
          return H[w];
        }, g.gexp = function(w) {
          for (; w < 0; )
            w += 255;
          for (; w >= 256; )
            w -= 255;
          return O[w];
        }, g;
      })();
      function d(O, H) {
        if (typeof O.length > "u")
          throw O.length + "/" + H;
        var b = (function() {
          for (var w = 0; w < O.length && O[w] == 0; )
            w += 1;
          for (var x = new Array(O.length - w + H), m = 0; m < O.length - w; m += 1)
            x[m] = O[m + w];
          return x;
        })(), g = {};
        return g.getAt = function(w) {
          return b[w];
        }, g.getLength = function() {
          return b.length;
        }, g.multiply = function(w) {
          for (var x = new Array(g.getLength() + w.getLength() - 1), m = 0; m < g.getLength(); m += 1)
            for (var u = 0; u < w.getLength(); u += 1)
              x[m + u] ^= c.gexp(c.glog(g.getAt(m)) + c.glog(w.getAt(u)));
          return d(x, 0);
        }, g.mod = function(w) {
          if (g.getLength() - w.getLength() < 0)
            return g;
          for (var x = c.glog(g.getAt(0)) - c.glog(w.getAt(0)), m = new Array(g.getLength()), u = 0; u < g.getLength(); u += 1)
            m[u] = g.getAt(u);
          for (var u = 0; u < w.getLength(); u += 1)
            m[u] ^= c.gexp(c.glog(w.getAt(u)) + x);
          return d(m, 0).mod(w);
        }, g;
      }
      var f = (function() {
        var O = [
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
        ], H = function(w, x) {
          var m = {};
          return m.totalCount = w, m.dataCount = x, m;
        }, b = {}, g = function(w, x) {
          switch (x) {
            case o.L:
              return O[(w - 1) * 4 + 0];
            case o.M:
              return O[(w - 1) * 4 + 1];
            case o.Q:
              return O[(w - 1) * 4 + 2];
            case o.H:
              return O[(w - 1) * 4 + 3];
            default:
              return;
          }
        };
        return b.getRSBlocks = function(w, x) {
          var m = g(w, x);
          if (typeof m > "u")
            throw "bad rs block @ typeNumber:" + w + "/errorCorrectionLevel:" + x;
          for (var u = m.length / 3, C = [], $ = 0; $ < u; $ += 1)
            for (var E = m[$ * 3 + 0], U = m[$ * 3 + 1], oe = m[$ * 3 + 2], de = 0; de < E; de += 1)
              C.push(H(U, oe));
          return C;
        }, b;
      })(), v = function() {
        var O = [], H = 0, b = {};
        return b.getBuffer = function() {
          return O;
        }, b.getAt = function(g) {
          var w = Math.floor(g / 8);
          return (O[w] >>> 7 - g % 8 & 1) == 1;
        }, b.put = function(g, w) {
          for (var x = 0; x < w; x += 1)
            b.putBit((g >>> w - x - 1 & 1) == 1);
        }, b.getLengthInBits = function() {
          return H;
        }, b.putBit = function(g) {
          var w = Math.floor(H / 8);
          O.length <= w && O.push(0), g && (O[w] |= 128 >>> H % 8), H += 1;
        }, b;
      }, S = function(O) {
        var H = a.MODE_NUMBER, b = O, g = {};
        g.getMode = function() {
          return H;
        }, g.getLength = function(m) {
          return b.length;
        }, g.write = function(m) {
          for (var u = b, C = 0; C + 2 < u.length; )
            m.put(w(u.substring(C, C + 3)), 10), C += 3;
          C < u.length && (u.length - C == 1 ? m.put(w(u.substring(C, C + 1)), 4) : u.length - C == 2 && m.put(w(u.substring(C, C + 2)), 7));
        };
        var w = function(m) {
          for (var u = 0, C = 0; C < m.length; C += 1)
            u = u * 10 + x(m.charAt(C));
          return u;
        }, x = function(m) {
          if ("0" <= m && m <= "9")
            return m.charCodeAt(0) - 48;
          throw "illegal char :" + m;
        };
        return g;
      }, A = function(O) {
        var H = a.MODE_ALPHA_NUM, b = O, g = {};
        g.getMode = function() {
          return H;
        }, g.getLength = function(x) {
          return b.length;
        }, g.write = function(x) {
          for (var m = b, u = 0; u + 1 < m.length; )
            x.put(
              w(m.charAt(u)) * 45 + w(m.charAt(u + 1)),
              11
            ), u += 2;
          u < m.length && x.put(w(m.charAt(u)), 6);
        };
        var w = function(x) {
          if ("0" <= x && x <= "9")
            return x.charCodeAt(0) - 48;
          if ("A" <= x && x <= "Z")
            return x.charCodeAt(0) - 65 + 10;
          switch (x) {
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
              throw "illegal char :" + x;
          }
        };
        return g;
      }, R = function(O) {
        var H = a.MODE_8BIT_BYTE, b = s.stringToBytes(O), g = {};
        return g.getMode = function() {
          return H;
        }, g.getLength = function(w) {
          return b.length;
        }, g.write = function(w) {
          for (var x = 0; x < b.length; x += 1)
            w.put(b[x], 8);
        }, g;
      }, k = function(O) {
        var H = a.MODE_KANJI, b = s.stringToBytesFuncs.SJIS;
        if (!b)
          throw "sjis not supported.";
        (function(x, m) {
          var u = b(x);
          if (u.length != 2 || (u[0] << 8 | u[1]) != m)
            throw "sjis not supported.";
        })("友", 38726);
        var g = b(O), w = {};
        return w.getMode = function() {
          return H;
        }, w.getLength = function(x) {
          return ~~(g.length / 2);
        }, w.write = function(x) {
          for (var m = g, u = 0; u + 1 < m.length; ) {
            var C = (255 & m[u]) << 8 | 255 & m[u + 1];
            if (33088 <= C && C <= 40956)
              C -= 33088;
            else if (57408 <= C && C <= 60351)
              C -= 49472;
            else
              throw "illegal char at " + (u + 1) + "/" + C;
            C = (C >>> 8 & 255) * 192 + (C & 255), x.put(C, 13), u += 2;
          }
          if (u < m.length)
            throw "illegal char at " + (u + 1);
        }, w;
      }, y = function() {
        var O = [], H = {};
        return H.writeByte = function(b) {
          O.push(b & 255);
        }, H.writeShort = function(b) {
          H.writeByte(b), H.writeByte(b >>> 8);
        }, H.writeBytes = function(b, g, w) {
          g = g || 0, w = w || b.length;
          for (var x = 0; x < w; x += 1)
            H.writeByte(b[x + g]);
        }, H.writeString = function(b) {
          for (var g = 0; g < b.length; g += 1)
            H.writeByte(b.charCodeAt(g));
        }, H.toByteArray = function() {
          return O;
        }, H.toString = function() {
          var b = "";
          b += "[";
          for (var g = 0; g < O.length; g += 1)
            g > 0 && (b += ","), b += O[g];
          return b += "]", b;
        }, H;
      }, B = function() {
        var O = 0, H = 0, b = 0, g = "", w = {}, x = function(u) {
          g += String.fromCharCode(m(u & 63));
        }, m = function(u) {
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
          for (O = O << 8 | u & 255, H += 8, b += 1; H >= 6; )
            x(O >>> H - 6), H -= 6;
        }, w.flush = function() {
          if (H > 0 && (x(O << 6 - H), O = 0, H = 0), b % 3 != 0)
            for (var u = 3 - b % 3, C = 0; C < u; C += 1)
              g += "=";
        }, w.toString = function() {
          return g;
        }, w;
      }, P = function(O) {
        var H = O, b = 0, g = 0, w = 0, x = {};
        x.read = function() {
          for (; w < 8; ) {
            if (b >= H.length) {
              if (w == 0)
                return -1;
              throw "unexpected end of file./" + w;
            }
            var u = H.charAt(b);
            if (b += 1, u == "=")
              return w = 0, -1;
            if (u.match(/^\s$/))
              continue;
            g = g << 6 | m(u.charCodeAt(0)), w += 6;
          }
          var C = g >>> w - 8 & 255;
          return w -= 8, C;
        };
        var m = function(u) {
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
        return x;
      }, J = function(O, H) {
        var b = O, g = H, w = new Array(O * H), x = {};
        x.setPixel = function($, E, U) {
          w[E * b + $] = U;
        }, x.write = function($) {
          $.writeString("GIF87a"), $.writeShort(b), $.writeShort(g), $.writeByte(128), $.writeByte(0), $.writeByte(0), $.writeByte(0), $.writeByte(0), $.writeByte(0), $.writeByte(255), $.writeByte(255), $.writeByte(255), $.writeString(","), $.writeShort(0), $.writeShort(0), $.writeShort(b), $.writeShort(g), $.writeByte(0);
          var E = 2, U = u(E);
          $.writeByte(E);
          for (var oe = 0; U.length - oe > 255; )
            $.writeByte(255), $.writeBytes(U, oe, 255), oe += 255;
          $.writeByte(U.length - oe), $.writeBytes(U, oe, U.length - oe), $.writeByte(0), $.writeString(";");
        };
        var m = function($) {
          var E = $, U = 0, oe = 0, de = {};
          return de.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; U + me >= 8; )
              E.writeByte(255 & (le << U | oe)), me -= 8 - U, le >>>= 8 - U, oe = 0, U = 0;
            oe = le << U | oe, U = U + me;
          }, de.flush = function() {
            U > 0 && E.writeByte(oe);
          }, de;
        }, u = function($) {
          for (var E = 1 << $, U = (1 << $) + 1, oe = $ + 1, de = C(), le = 0; le < E; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(E)), de.add(String.fromCharCode(U));
          var me = y(), Se = m(me);
          Se.write(E, oe);
          var Ne = 0, Pe = String.fromCharCode(w[Ne]);
          for (Ne += 1; Ne < w.length; ) {
            var rt = String.fromCharCode(w[Ne]);
            Ne += 1, de.contains(Pe + rt) ? Pe = Pe + rt : (Se.write(de.indexOf(Pe), oe), de.size() < 4095 && (de.size() == 1 << oe && (oe += 1), de.add(Pe + rt)), Pe = rt);
          }
          return Se.write(de.indexOf(Pe), oe), Se.write(U, oe), Se.flush(), me.toByteArray();
        }, C = function() {
          var $ = {}, E = 0, U = {};
          return U.add = function(oe) {
            if (U.contains(oe))
              throw "dup key:" + oe;
            $[oe] = E, E += 1;
          }, U.size = function() {
            return E;
          }, U.indexOf = function(oe) {
            return $[oe];
          }, U.contains = function(oe) {
            return typeof $[oe] < "u";
          }, U;
        };
        return x;
      }, T = function(O, H, b) {
        for (var g = J(O, H), w = 0; w < H; w += 1)
          for (var x = 0; x < O; x += 1)
            g.setPixel(x, w, b(x, w));
        var m = y();
        g.write(m);
        for (var u = B(), C = m.toByteArray(), $ = 0; $ < C.length; $ += 1)
          u.writeByte(C[$]);
        return u.flush(), "data:image/gif;base64," + u;
      };
      return s;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(s) {
        function a(o) {
          for (var i = [], r = 0; r < o.length; r++) {
            var c = o.charCodeAt(r);
            c < 128 ? i.push(c) : c < 2048 ? i.push(
              192 | c >> 6,
              128 | c & 63
            ) : c < 55296 || c >= 57344 ? i.push(
              224 | c >> 12,
              128 | c >> 6 & 63,
              128 | c & 63
            ) : (r++, c = 65536 + ((c & 1023) << 10 | o.charCodeAt(r) & 1023), i.push(
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
  })(Fn)), Fn.exports;
}
var Eg = Sg();
const Ag = /* @__PURE__ */ Mg(Eg), Cg = ["width", "height", "viewBox"], Og = ["width", "height"], Tg = ["d"], Bg = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const s = Ag(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let i = 0; i < a; i += 1)
        for (let r = 0; r < a; r += 1)
          s.isDark(i, r) && o.push(`M${r + 4} ${i + 4}h1v1h-1z`);
      return { count: a + 8, path: o.join("") };
    });
    return (s, a) => (l(), h("svg", {
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
      }, null, 8, Og),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Tg)
    ], 8, Cg));
  }
}, qv = /* @__PURE__ */ Z(Bg, [["__scopeId", "data-v-489f0852"]]), Wv = Yo(() => import("./VoiceFigure-Z75It_jR.js").then((e) => e.V)), Hv = "1.0.0", Fv = "3.5";
export {
  Ng as $,
  iv as A,
  Je as B,
  vv as C,
  ov as D,
  gv as E,
  Xg as F,
  Io as G,
  dm as H,
  cm as I,
  xv as J,
  yt as K,
  fv as L,
  Te as M,
  _t as N,
  cv as O,
  kn as P,
  uv as Q,
  G1 as R,
  _o as S,
  rv as T,
  mv as U,
  ua as V,
  Yp as W,
  Hp as X,
  _v as Y,
  yv as Z,
  Z as _,
  ie as a,
  ye as a0,
  fs as a1,
  Pg as a2,
  qu as a3,
  Nv as a4,
  Jg as a5,
  Zt as a6,
  Sv as a7,
  Ig as a8,
  sn as a9,
  Wv as aA,
  Ue as aB,
  js as aC,
  Rv as aD,
  Iv as aE,
  Dv as aF,
  Yg as aG,
  Gg as aH,
  Vg as aI,
  Av as aJ,
  Ev as aK,
  Gf as aL,
  jg as aM,
  vt as aN,
  Hg as aO,
  Ug as aP,
  Ov as aQ,
  Bv as aR,
  r0 as aS,
  Bm as aT,
  Cv as aU,
  ih as aV,
  $a as aW,
  Lv as aX,
  Ae as aa,
  Hv as ab,
  Fv as ac,
  Tv as ad,
  ss as ae,
  zg as af,
  Xf as ag,
  Qm as ah,
  s0 as ai,
  l0 as aj,
  qg as ak,
  gr as al,
  jv as am,
  Wg as an,
  qv as ao,
  qr as ap,
  Rg as aq,
  Kg as ar,
  ts as as,
  Ot as at,
  Fg as au,
  Dg as av,
  Pv as aw,
  ma as ax,
  dt as ay,
  rh as az,
  Ze as b,
  lv as c,
  ev as d,
  tv as e,
  Qg as f,
  kv as g,
  yo as h,
  dv as i,
  hv as j,
  pv as k,
  bv as l,
  nv as m,
  Zg as n,
  sv as o,
  on as p,
  Mv as q,
  wv as r,
  av as s,
  Re as t,
  Wp as u,
  $v as v,
  Up as w,
  bs as x,
  hp as y,
  fp as z
};
