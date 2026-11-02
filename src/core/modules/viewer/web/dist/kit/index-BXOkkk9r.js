/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as we, createElementVNode as p, normalizeClass as Q, Fragment as X, renderList as re, normalizeStyle as ke, defineComponent as Uo, Comment as Vo, h as hs, cloneVNode as zo, createBlock as K, withCtx as V, unref as G, createVNode as H, toDisplayString as w, createCommentVNode as P, inject as Ne, computed as T, resolveDynamicComponent as ot, Transition as dn, watch as be, ref as W, shallowRef as hn, TransitionGroup as Go, mergeProps as at, reactive as fs, createTextVNode as he, onMounted as Le, onUnmounted as Se, nextTick as fn, useId as ya, Teleport as wa, withModifiers as _e, isRef as Os, onBeforeUnmount as vt, resolveDirective as Ko, withDirectives as mt, useModel as Vn, useAttrs as ka, getCurrentInstance as Yo, mergeModels as zn, getCurrentScope as ba, onScopeDispose as $a, provide as Jo, onErrorCaptured as Zo, toHandlers as Xo, createSlots as Qo, withKeys as Zt, vModelText as Gn, defineAsyncComponent as er } from "vue";
const Z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, tr = { class: "skeleton-line" }, nr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", tr, [
      we(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: Q(["bars", { faded: e.filled }])
      }, [
        (l(!0), d(X, null, re(e.bars, (s) => (l(), d("span", {
          key: s.width,
          class: Q(["bar", { still: e.still }]),
          style: ke({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Qe = /* @__PURE__ */ Z(nr, [["__scopeId", "data-v-0ebb6933"]]), ps = Uo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Vo);
      return s.length !== 1 ? hs(X, { key: n }, s) : s[0].key == null ? zo(s[0], { key: n }) : s[0];
    };
  }
}), sr = ["aria-label"], ar = ["aria-label"], or = ["aria-label"], rr = ["aria-label"], ir = ["aria-label"], lr = ["aria-label"], cr = ["aria-label"], ur = {
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
    ], r = ["94%", "88%", "91%", "62%"].map((c) => ({ width: c, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (c, u) => (l(), K(ps, { value: e.shape }, {
      messages: V(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), d(X, null, re(t, (f) => p("div", {
            key: f.id,
            class: Q(["skeleton-message", { mine: f.mine }]),
            style: ke({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, sr)
      ]),
      older: V(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(X, null, re(t.slice(0, 3), (f) => (l(), d("div", {
            key: f.id,
            class: Q(["skeleton-message", { mine: f.mine }]),
            style: ke({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, ar)
      ]),
      cards: V(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(X, null, re(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (l(), d(X, null, re(n, (g) => H(Qe, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, or)
      ]),
      file: V(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(X, null, re(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            H(Qe, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), d(X, null, re(a, (g) => H(Qe, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, rr)
      ]),
      page: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          H(Qe, {
            class: "skeleton-heading",
            bars: i
          }),
          (l(!0), d(X, null, re(e.count, (f) => (l(), K(Qe, {
            key: f,
            bars: G(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ir)
      ]),
      text: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(X, null, re(e.count, (f) => (l(), K(Qe, {
            key: f,
            bars: G(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, lr)
      ]),
      default: V(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(X, null, re(e.count, (f) => (l(), K(Qe, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, cr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, yt = /* @__PURE__ */ Z(ur, [["__scopeId", "data-v-c687fb85"]]), dr = {
  key: 1,
  class: "empty-state titled"
}, hr = { class: "empty-state-title" }, fr = { class: "empty-state-text" }, pr = {
  key: 2,
  class: "empty-state"
}, mr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), K(yt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", dr, [
      p("p", hr, w(e.title), 1),
      p("p", fr, [
        we(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", pr, [
      we(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Xt = /* @__PURE__ */ Z(mr, [["__scopeId", "data-v-b27e89b0"]]), gr = { class: "fold-group" }, vr = ["aria-expanded"], yr = { class: "fold-label" }, wr = {
  key: 0,
  class: "fold-count"
}, kr = {
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
    return (s, a) => (l(), d("div", gr, [
      p("button", {
        type: "button",
        class: Q(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", yr, w(e.label), 1),
        e.count !== "" ? (l(), d("span", wr, w(e.count), 1)) : P("", !0),
        p("span", {
          class: Q(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, vr),
      e.open ? we(s.$slots, "default", {}, void 0, !0, 0) : P("", !0)
    ]));
  }
}, xv = /* @__PURE__ */ Z(kr, [["__scopeId", "data-v-9ef1865c"]]), br = Symbol("open-view"), Pe = Symbol.for("journal.window-context");
function ms() {
  const e = Ne(Pe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const $r = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: ke({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, xr = /* @__PURE__ */ Z($r, [["__scopeId", "data-v-eb453d6f"]]), Mr = {
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
    const t = e, n = T(() => {
      var s;
      return t.busy || t.disabled || !!((s = Ne(Pe, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), K(ot(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: Q(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: V(() => [
        p("span", {
          class: Q(["btn-label", { hidden: e.busy }])
        }, [
          we(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (l(), K(xr, {
          key: 0,
          class: "btn-spinner"
        })) : P("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ Z(Mr, [["__scopeId", "data-v-a2dc4bda"]]), _r = {
  class: "running",
  "data-running-command": ""
}, Sr = ["title"], Er = {
  key: "idle",
  class: "running-idle"
}, Ar = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", _r, [
      H(dn, {
        name: "roll",
        mode: "out-in"
      }, {
        default: V(() => [
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, Sr)) : (l(), d("span", Er, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Mv = /* @__PURE__ */ Z(Ar, [["__scopeId", "data-v-d3240219"]]), Cr = ["aria-checked", "aria-label", "title"], Or = {
  key: 0,
  class: "switch-inner"
}, Tr = {
  key: 0,
  class: "switch-word"
}, Br = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("button", {
      type: "button",
      class: Q(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: Q(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (l(), d("span", Or, w(e.word), 1)) : P("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Tr, w(e.word), 1)) : P("", !0)
    ], 10, Cr));
  }
}, _v = /* @__PURE__ */ Z(Br, [["__scopeId", "data-v-1bfb90f3"]]);
function xa(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Ct(e, t) {
  return xa(() => localStorage, e, t);
}
function Ma(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function pn(e, t) {
  return Ma(() => localStorage, e, t);
}
function _a(e, t) {
  be(t, (n) => pn(e, n), { deep: !0 });
}
function Ir(e, t) {
  return xa(() => sessionStorage, e, t);
}
function Rr(e, t) {
  return Ma(() => sessionStorage, e, t);
}
const Qt = "journal.environment", Sa = W(Ir(Qt, Ct(Qt, "")));
function Lr(e) {
  Sa.value = e, Rr(Qt, e), pn(Qt, e);
}
const en = W(location.hash), Ts = hn(null), Bs = { integrations: "mcp", library: "team" };
function Dr() {
  if (!Ts.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Bs[n]) {
    location.replace(`#/${[Bs[n], ...s].join("/")}${t ? `?${t}` : ""}`), en.value = location.hash;
    return;
  }
  !n || Ts.value(n) || (Lr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), en.value = location.hash);
}
window.addEventListener("hashchange", () => {
  en.value = location.hash, Dr();
});
const je = T(() => {
  const [e, t = ""] = en.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", f = "", g = ""] = i.split(":");
    return { table: u, id: Number(f), comment: Number(g) || 0, env: c };
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
}), mn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${mn.page(e)}?open=${t}`
};
function Nr(e = "", t = 0, n = "") {
  location.hash = mn.page(e, t, n);
}
const jr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ea(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(jr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const ft = {};
function Sv(e, t) {
  return ft[e] = t, () => ft[e] === t && delete ft[e];
}
function Aa(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = ft[e]) != null && r.call(ft, t))) return;
  const a = je.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Ea([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Pr(e, t, n, s = 0, a = "") {
  if (e === je.value.env) return Aa(t, n, s, a);
  const o = je.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ea([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function wt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Pr(s, a, Number(o), 0, t) : Aa(a, Number(o), 0, t);
}
function qr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function ht(e) {
  const t = qr(e);
  t && wt(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Wr = ["stroke-width", "innerHTML"], Me = {
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
    return (o, r) => (l(), d("svg", {
      class: "ico",
      style: ke({
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
    }, null, 12, Wr));
  }
}, gs = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), K(ye, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: V(() => [
        H(Me, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Fr = {
  key: 1,
  class: "row-list-failure"
}, Hr = ["data-row"], Ur = {
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
    // whether the server holds a page behind the rows, which is what shows the button to read it
    more: { type: Boolean, default: !0 },
    // how a row comes in and goes out, {enter, leave} each given the row's element and the call that ends it; with none given rows just appear
    arrival: { type: Object, default: null }
  },
  setup(e) {
    const t = e, n = T(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = W(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (l(), K(yt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", Fr, w(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), K(Xt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(X, { key: 3 }, [
      (l(), K(ot(e.arrival ? Go : "ul"), at(n.value, { class: "row-list" }), {
        default: V(() => [
          (l(!0), d(X, null, re(e.rows, (i) => (l(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            we(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Hr))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : P("", !0)
    ], 64));
  }
}, Vr = /* @__PURE__ */ Z(Ur, [["__scopeId", "data-v-a096d68d"]]), zr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Gr = {
  key: 1,
  class: "agent-rows-note"
}, Kr = {
  key: 2,
  class: "agent-rows-note"
}, Yr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Jr = ["data-agent-row", "onClick"], Zr = { class: "agent-row-name" }, Xr = { class: "agent-row-state" }, Qr = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = T(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", zr, [
      e.loaded ? e.failure ? (l(), d("p", Gr, w(e.failure), 1)) : e.rows.length ? (l(), d(X, { key: 3 }, [
        p("p", Yr, w(s.value) + " running", 1),
        (l(!0), d(X, null, re(n.value, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => G(wt)(`agents:${r.id}`)
        }, [
          p("span", Zr, "#" + w(r.id) + " " + w(r.session), 1),
          p("span", Xr, w(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Jr))), 128))
      ], 64)) : (l(), d("p", Kr, w(e.none), 1)) : (l(), K(yt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Ev = /* @__PURE__ */ Z(Qr, [["__scopeId", "data-v-a01e5a17"]]), ei = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: Q(["badge", e.tone])
    }, w(e.text), 3));
  }
}, Ca = /* @__PURE__ */ Z(ei, [["__scopeId", "data-v-9e7e1157"]]), ti = ["aria-valuenow", "aria-valuemax"], ni = {
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
    return (s, a) => (l(), d("span", {
      class: Q(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: ke({ width: n.value })
      }, null, 4)
    ], 10, ti));
  }
}, si = /* @__PURE__ */ Z(ni, [["__scopeId", "data-v-9eba6a85"]]), ai = { class: "bars" }, oi = { class: "bar-name" }, ri = { class: "bar-value" }, ii = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = T(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", ai, [
      (l(!0), d(X, null, re(e.items, (c, u) => (l(), K(ot(c.open ? "button" : "div"), {
        key: `${u}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: Q(["bar-row", c.tone, { opens: c.open }]),
        onClick: (f) => c.open && s("open", c.open)
      }, {
        default: V(() => [
          p("span", oi, w(c.label), 1),
          H(si, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", ri, w(c.value) + w(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, li = /* @__PURE__ */ Z(ii, [["__scopeId", "data-v-663427f4"]]), ci = { class: "bars" }, ui = {
  key: 0,
  class: "bars-title"
}, di = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", ci, [
      e.node.title ? (l(), d("span", ui, w(e.node.title), 1)) : P("", !0),
      H(li, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, hi = /* @__PURE__ */ Z(di, [["__scopeId", "data-v-7135bb11"]]), fi = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = T(() => n[s.node.type](s.node));
    return (r, i) => (l(), d("div", {
      class: Q([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ke(o.value)
    }, [
      (l(!0), d(X, null, re(e.node.children || [], (c, u) => (l(), K(ao, {
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (f) => a("open", f)),
        onFile: i[1] || (i[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Gt = /* @__PURE__ */ Z(fi, [["__scopeId", "data-v-d142a3f4"]]), pi = {
  key: 0,
  class: "card-head"
}, mi = { class: "card-title" }, gi = {
  key: 0,
  class: "card-note"
}, vi = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: Q(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), d("header", pi, [
        p("span", mi, w(e.node.title), 1),
        e.node.note ? (l(), d("span", gi, w(e.node.note), 1)) : P("", !0)
      ])) : P("", !0),
      H(Gt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, yi = /* @__PURE__ */ Z(vi, [["__scopeId", "data-v-67b72d40"]]), wi = (e, t, n) => Math.max(t, Math.min(n, e)), ki = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, xe = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Is = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", xn = 80;
function Rs(e) {
  return e.length <= xn ? e : `${e.slice(0, xn + 1).replace(/\s+\S*$/, "") || e.slice(0, xn)}…`;
}
const Ls = {
  messages: (e) => Rs(Is(e.text)),
  comments: (e) => Rs(Is(e.text)),
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
}, bi = (e) => (Ls[e.table] ? Ls[e.table](e) : e.title || "") || "", $i = ["done", "cancelled"], Kn = {
  tasks: (e) => xe(e.completed_at) || (e.state === "cancelled" ? xe(e.updated_at) : 0),
  questions: (e) => e.answer ? xe(e.updated_at) : 0,
  plans: (e) => $i.includes(e.state) ? xe(e.updated_at) : 0,
  notices: (e) => xe(e.closed_at),
  secrets: (e) => xe(e.deleted_at),
  workers: (e) => e.state === "stopped" ? xe(e.updated_at) : 0,
  shares: (e) => xe(e.stopped_at),
  dumps: (e) => xe(e.completed_at),
  agents: (e) => e.state === "ended" ? xe(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? xe(e.created_at) : 0
}, xi = (e) => Kn[e.table] ? Kn[e.table](e) : 0, Oa = (e) => xi(e) > 0, Mi = (e) => !!Kn[e], Ta = (e) => xe(e.created_at), tn = (e) => xe(e.updated_at) || Ta(e), _i = (e) => "task_ids" in e, gn = typeof document < "u" && document.documentElement.classList.contains("phone"), Si = "Files are attached on the computer; the phone sends text.", Ba = 1024, Ei = Ba * 1024 * 1024, Ai = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ba} MB limit for one file.`;
function Ci() {
  return () => {
  };
}
function Ds(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Oi(e = window) {
  if (!Ds(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ds(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ia = "status.summary", ve = fs({
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
}), Ti = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Ra = () => !!ve.countdown || Ti() || ve.starting;
function Bi(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function Ii(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Ri() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Li(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Ri(), !0);
}
let Pt = { version: "", started: 0 };
function Di(e) {
  return e.version ? (Pt.version || (Pt = { version: e.version, started: e.started || 0 }), e.version !== Pt.version || (e.started || 0) !== Pt.started) : !1;
}
function Ni(e) {
  Ii(e.countdown), Bi(e.ready, e.step), (Li(!!e.updating, e.step) || !e.updating && !ji(e) && Di(e)) && Oi(window);
}
const ji = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Ns = 2e4, Pi = 3e5, Fe = 6e5, qt = 6, qi = 500, Wi = "/journal/summary", js = gn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Fi = (e) => e.split("?")[0].endsWith(Wi), La = (e, t) => Object.assign(new Error(t), { status: e });
async function Hi(e, t, n = La) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Ui = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Vi {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = qt;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = qt;
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
  async reach(t, n, s, a, o, r = {}) {
    const i = s instanceof FormData;
    try {
      return await fetch(n, {
        method: t,
        headers: { ...js, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Ui(s),
        signal: AbortSignal.timeout(a || (i ? Pi : Ns))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, qi)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = qt, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Ci(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Hi(c, `${c.status} ${c.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: js, signal: AbortSignal.timeout(Ns) });
    if (!n.ok) throw La(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, qt, o).then((c) => (this.written(n), c));
    if (Ra() && !Fi(n))
      return Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 }));
    if (this.flying.has(r)) return this.flying.get(r);
    const i = this.send(t, n, s, 0, this.tries, o);
    return this.flying.set(r, i), i.finally(() => this.flying.delete(r)).catch(() => {
    }), i;
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
const De = new Vi(), Ae = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const $t = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), xt = "the page does not know its environment yet", zi = "X-Journal-Env", Gi = "X-Journal-Request-At", Mn = "/viewer/voices/figures/";
class vs {
  constructor({ env: t = () => je.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new vs({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Gi]: String(Date.now()), ...this.env() ? { [zi]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === xt ? Promise.reject(new Error(xt)) : De.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === xt ? Promise.reject(new Error(xt)) : De.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : xt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${Ae(this.env())}`);
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
    return De.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: c = !1, docked: u = !1 } = {}) {
    const f = this.here(`/${t}${ue({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: c ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(f, `${t}.${$t({ before: s, after: a, since: o, ids: r, tasks: i, closed: c, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${$t({ before: s, since: a, docked: o })}`);
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
    return this.post(this.here(t.path), {}, Fe);
  }
  upload(t, n, s) {
    if (gn) return Promise.reject(Object.assign(new Error(Si), { status: 403 }));
    if (s.size > Ei) return Promise.reject(new Error(Ai(s)));
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${Ae(s)}`);
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
    return De.bytes(t);
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
    return this.get(`/agents/controls/${Ae(t)}${ue({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${Ae(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${Ae(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${$t(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${$t(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${$t(n)}`);
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
  // connects to a team by its server's URL: a new server's makes this person its admin, an pair_code URL a member, a bare URL logs in
  connectTeam(t) {
    return this.post("/team/connect", t, Fe);
  }
  // disconnects from one team, the one or the one named; what was imported from its library stays
  disconnectTeam(t = "") {
    return this.post("/team/disconnect", { team: t });
  }
  // an pair_code URL for a person's email; admins only
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
    return this.post(`/library/items/${encodeURIComponent(t)}/publish`, { reference: n, note: s, description: a, team: o }, Fe);
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
    return this.get(this.here(`/skills/${Ae(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${Ae(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${Ae(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return De.request("GET", Mn + "figures.json");
  }
  voiceFigureUrl(t) {
    return Mn + t;
  }
  figureDecoderUrl() {
    return Mn + "draco/";
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
    return this.post(this.here("/plugins/preview"), { source: t }, Fe);
  }
  installPlugin(t) {
    return this.post(this.here("/plugins"), { source: t }, Fe);
  }
  previewUpgrade(t) {
    return this.act("plugins", t, "upgrade-preview", {}, Fe);
  }
  upgradePlugin(t, n) {
    return this.act("plugins", t, "upgrade", { ref: n }, Fe);
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
    return this.post(`/profiles/${Ae(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${Ae(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${Ae(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, Fe);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Ae(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Fe);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Ae(t)}` : ""}${mn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ie = new vs({ base: gn ? "/p" : "" }), Ki = (e) => De.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Yi = { claude: "Claude Code", codex: "Codex" };
Object.entries(Yi).map(([e, t]) => ({ key: e, label: t }));
const Ps = (e) => e.status === "stopped" ? 1 : 0, Ji = "main", Zi = (e) => e.filter((t) => t.role === Ji).sort((t, n) => Ps(t) - Ps(n) || xe(n.heard_at) - xe(t.heard_at))[0] || null, Xi = { me: 1, people: [] }, Y = fs({
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
  people: Xi,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Ct("journal.activity", !0),
  wide: !1,
  sideMini: Ct("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
_a("journal.activity", () => Y.activity);
_a("journal.side.mini", () => Y.sideMini);
const gt = T(() => Zi(Y.agents));
T(() => !!gt.value && Y.live.some((e) => e.agent.session === gt.value.session && e.environment === je.value.env));
T(() => !!gt.value && ["busy", "working"].includes(gt.value.status));
function Qi(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Yn(e) {
  const t = Qi(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Da(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function qs(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const _n = (e) => String(e).padStart(2, "0");
function el(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${_n(t % 60)}s` : `${Math.floor(t / 3600)}h ${_n(Math.floor(t % 3600 / 60))}m ${_n(t % 60)}s`;
}
const tl = ["working", "busy", "waiting", "compacting"], nl = (e) => tl.includes(e), sl = "builder";
T(() => !Y.settings || Y.settings.features.file_feed !== !1);
const al = T(() => !Y.settings || Y.settings.features.status_bar !== !1);
T(() => Y.settings && Y.settings.workers && Y.settings.workers.mode || sl);
T(() => !Y.settings || !Y.settings.tasks || Y.settings.tasks.auto !== !1);
T(() => !!(Y.settings && Y.settings.reviewing && Y.settings.reviewing.reviewer));
T(() => !Y.settings || Y.settings.features.sharing !== !1);
const nn = 50, ys = 100, ol = { messages: 25 }, Re = (e) => ol[e] || nn;
function rl(e, t) {
  if (e !== "messages") return Math.max(t.length - Re(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Re(e)) return s;
  return 0;
}
const il = "review_step", ll = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === il).sort((t, n) => t.id - n.id), cl = 5, ul = 500, dl = 3e3, hl = () => Y.entries.length ? Y.entries[Y.entries.length - 1].id : 0, Kt = { env: "", id: 0 }, fl = () => !!(Y.bar && Y.bar.length) || nl(gt.value && gt.value.status);
function pl({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function ml() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: ys })))).then(ll);
}
function gl() {
  return Kt.env !== ie.env() && Object.assign(Kt, { env: ie.env(), id: hl() }), ie.entries(Kt.id);
}
function vl(e) {
  e.length && (Kt.id = e[e.length - 1].id, lc(e));
}
async function yl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", nn);
}
const Jn = /* @__PURE__ */ new Map();
async function Zn(e, t) {
  const n = `${e}:${ie.env()}`, s = Jn.get(n);
  if (!s) return Ws(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(tn)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ie.list("workers", { limit: t, since: a, after: o });
  if (!r.is_last_page)
    return Jn.delete(n), Zn(e, t);
  const i = new Set(r.rows.map((c) => c.id));
  return Ws(
    n,
    [...s.filter((c) => !i.has(c.id)), ...r.rows].sort((c, u) => c.id - u.id)
  );
}
const Ws = (e, t) => (Jn.set(e, t), t);
async function Fs(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Hs = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => fl() ? ul : dl,
    take: (e) => Array.isArray(e) && (Y.bar = e),
    active: () => al.value
  },
  "agents.index": { read: () => Fs(ie, cl), every: 1e3, take: (e) => Y.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => Y.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      Y.summary = e, Ni(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => Y.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => Y.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (Y.people = e) },
  "entries.recent": { read: gl, every: 1e3, take: vl },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: pl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Zn("workers.index", Re("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Zn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: ml, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Re("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: yl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Fs(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: nn }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: nn }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), wl = 6e4, kl = 3e3, bl = 4, $l = 300, xl = 5e3, Na = /* @__PURE__ */ new Map();
function vn(e) {
  if (!(e in Hs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Hs[e];
}
function Ml(e) {
  const t = vn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return xl;
  }
}
const _l = (e) => e / 2 + Math.random() * e / 2, ja = (e) => [...e.users.values()].pop(), ws = (e) => Na.get(e.place) === e, Sl = () => Math.random() * $l, ks = () => document.hidden;
function El(e) {
  const t = Ml(e);
  return e.failures ? _l(Math.min(e.key === Ia ? kl : wl, t * 2 ** e.failures)) : Math.max(t, bl * e.took);
}
function Pa(e, t) {
  clearTimeout(e.timer), !(!ws(e) || e.paused || ks()) && (e.timer = setTimeout(() => Al(e), t));
}
function Al(e) {
  return ws(e) ? e.running ? (e.again = !0, e.running) : (e.running = Bl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Cl = (e) => {
  var t, n;
  return !e.paused && !ks() && (((n = (t = vn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && ja(e).active() && (!Ra() || e.key === Ia);
};
async function Ol(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await De.attemptOnce(() => vn(e.key).read(ja(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Tl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = vn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Bl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Cl(e) && Tl(e, await Ol(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ws(e) && !e.paused);
  Pa(e, El(e));
}
const Il = () => ks() || Na.forEach((e) => Pa(e, Sl()));
document.addEventListener("visibilitychange", Il);
const Rl = 60, Ll = (e, t) => xe(e.created_at) >= xe(t.created_at) - Rl, Dl = (e, t) => e.id > 0 && e.table === t.table && Ll(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), bs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Dl(s, n))), Sn = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], fe = (e, t, n, s = {}) => ({
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
}), It = {
  messages: fe("Message", "mail", "What the user left for the agent, or the agent for the user", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: fe("Question", "help", "Something the agent asks the user, with choices to pick", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: fe("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: Sn
  }),
  tasks: fe("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Sn
  }),
  reports: fe("Report", "report", "What was checked and what was found, written for the user", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: fe("Collection", "folder", "Rows that belong together, gathered under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: fe("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: fe("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: fe("Rule", "list", "A ruling that binds every environment of the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: fe("Reminder", "clock", "An instruction said again until it is retired", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  notices: fe("Notice", "band", "One line pinned to the chat while it matters", { filters: Sn }),
  reactions: fe("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: fe("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", { scope: "project" }),
  environments: fe("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", { scope: "project" }),
  agents: fe("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: fe("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: fe("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
  verifiers: fe("Verifier", "verifier", "An agent the journal sends by itself to judge whether a dismissed reader report was dismissed rightly"),
  test_turns: fe("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: fe("Reviewer", "reviewer", "An agent the journal sends by itself, in orchestrator mode with the reviewer on, to test and check each worker's work and report each point to the agent"),
  subagents: fe("Subagent", "bot", "A helper the agent started inside its own session for one job", { nested: !0 }),
  sequences: fe("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: fe("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: fe("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: fe("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: fe("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: fe("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: fe("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Nl = ["secrets", "plugins"], qa = Object.keys(It).filter((e) => !(gn && Nl.includes(e)));
T(() => qa.map((e) => ({ name: e, ...It[e] })));
const yn = (e) => It[e], Wa = new Map(qa.flatMap((e) => [e, e.replace(/s$/, ""), It[e].title.toLowerCase()].map((t) => [t, e]))), pt = (e) => Wa.get(String(e).toLowerCase()) || "", Fa = [...Wa.keys()].sort((e, t) => t.length - e.length).join("|"), Xe = /* @__PURE__ */ new Set(), $s = W(0), Rt = /* @__PURE__ */ new Set(), Lt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Xn = /* @__PURE__ */ new Set(), jl = /* @__PURE__ */ new Map(), Pl = /* @__PURE__ */ new Map();
let dt = !1, Mt = null;
const ql = (e, t) => e.id - t.id, Wl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Fl = { messages: Wl }, Ha = (e) => Fl[e] || ql;
function Ua(e) {
  return $s.value, Xe.has(e) || (Xe.add(e), Y.booted && (!Rt.has(e) || Lt.has(e)) && queueMicrotask(() => kn([e], !1))), Y.rows[e] || [];
}
function Hl(e) {
  const t = Y.rows[e] || [], n = rl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  Y.rows[e] = t.filter((a) => s.has(a) || Mi(e) && !Oa(a)), Y.paging.size[e] = Re(e), Y.paging.more[e] = !0;
}
const Ul = /* @__PURE__ */ new Set();
function Vl() {
  Xe.forEach(Hl), Xe.clear(), jl.clear(), Pl.clear(), $s.value += 1;
}
be(() => `${je.value.env}/${je.value.page}/${je.value.open ? je.value.open.table : ""}`, Vl);
be(
  () => Y.booted,
  (e) => e && kn(
    [...Xe].filter((t) => !Rt.has(t)),
    !1
  )
);
const Qn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !_i(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Va(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Qn(s) && !Qn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function za(e, t) {
  Rt.add(e), $s.value += 1;
  const n = Y.rows[e] || [];
  Y.rows[e] = [...Va(n, t.rows), ...bs(n.filter((s) => s.id === 0), t.rows)], Y.paging.size[e] = Y.paging.size[e] || Re(e), Y.paging.more[e] = !t.is_last_page;
}
async function zl(e) {
  const t = new Set((Y.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Re(e) });
  wn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = bs((Y.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return za(e, { ...n, rows: [...n.rows, ...a].sort(Ha(e)) }), Y.paging.size[e] = Re(e), Ga.has(e) && await Ka(e), Y.rows[e];
}
const wn = (e, t) => Y.counts = { ...Y.counts, [e]: t };
async function Gl(e) {
  const t = Y.rows[e] || [], n = Math.max(0, ...t.map(tn)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ie.list(e, { limit: Re(e), since: n, after: s });
  if (wn(e, a.counts), !a.is_last_page) return zl(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = bs(t.filter((i) => !o.has(i.id)), a.rows).concat(Va(t, a.rows));
  return Y.rows[e] = r.sort(Ha(e)), Y.paging.size[e] = Y.rows[e].length, Y.rows[e];
}
const En = /* @__PURE__ */ new Set();
async function Kl(e, t = !1) {
  e.forEach((n) => Lt.delete(n)), e.forEach((n) => Xn.add(n));
  try {
    await tc(e, t);
  } finally {
    e.forEach((n) => Xn.delete(n));
  }
}
async function Yl(e) {
  const t = await ie.list(e, { limit: Re(e) });
  wn(e, t.counts), za(e, t);
}
async function Jl(e) {
  wn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Ga = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ka(e) {
  const t = (Y.rows[e] || []).filter((a) => Qn(a) && (e !== "plans" || !Oa(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  Y.rows[e] = (Y.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Zl = (e, t) => !Rt.has(e) || t && (Y.paging.size[e] || Re(e)) === Re(e) && !Ul.has(e);
async function Xl(e, t) {
  if (!Xe.has(e)) return Jl(e);
  const n = await (Zl(e, t) ? Yl(e) : Gl(e));
  return Ga.has(e) && await Ka(e), n;
}
async function Ql() {
  const [e, t] = await Promise.all([ie.entries(0, ys), ie.settings()]);
  Za([...Ct(Ja(), []), ...e]), JSON.stringify(t) !== JSON.stringify(Y.settings) && (Y.settings = t);
}
const ec = (e, t) => Xl(e, t).then(
  () => null,
  () => e
);
async function tc(e, t) {
  const n = (await Promise.all(e.map((s) => ec(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), Lt.add(s))), t && await Ql(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ya = 1e3, nc = 15e3;
let Wt = Ya;
async function sc() {
  return Mt || (Mt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !En.has(e)) || dt; ) {
      const e = dt, t = [...e ? Object.keys(Y.rows) : Ke].filter((s) => It[s] && (Xe.has(s) || s in Y.rows)).filter((s) => e || !Xe.has(s) || Lt.has(s) || !Rt.has(s)).filter((s) => !En.has(s)), n = [...Ke].filter((s) => En.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), dt = !1;
      try {
        await Kl(t, e), Wt = Ya;
      } catch {
        dt = dt || e, await new Promise((a) => setTimeout(a, Wt)), Wt = Math.min(Wt * 2, nc);
      }
    }
  })().finally(() => Mt = null), Mt);
}
function kn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Xn.has(n)).forEach((n) => {
    Ke.add(n), t && Lt.add(n);
  }), Ke.has("settings") && (dt = !0), sc();
}
const Ja = () => {
  var e;
  return `typed-entries:${((e = Y.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Za(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  Y.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ys), pn(Ja(), Y.entries.slice(-50));
}
const ac = ["created", "updated", "deleted"], oc = { phases: ["phases", "plans"] }, es = (e) => oc[e] || [e], rc = (e) => ac.includes(e.entry_type) ? [...es(e.data.table), ...(e.data.joins || []).flatMap(es)] : [];
function ic(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of es(t.data.table).filter((s) => Y.rows[s]))
      Y.rows[n] = Y.rows[n].filter((s) => s.id !== t.data.id);
}
function lc(e) {
  Za([...Y.entries, ...e]), ic(e), kn([...new Set(e.flatMap(rc))].filter((t) => t && t !== "agents"));
}
Ki((e) => Y.streamOpen || kn([e]));
const ts = [], cc = 2e3, Ge = /* @__PURE__ */ new Map(), uc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, dc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function rt(e, { first: t = !1 } = {}) {
  t ? ts.unshift(e) : ts.push(e), Ge.clear();
}
function Xa(e, t, n) {
  var a;
  const s = Ua(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const hc = (e) => Ua(e.table).find((t) => t.id === e.id) === e.row, fc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function pc(e, t) {
  const n = [{ kind: "text", text: Ue(e).replace(/\r\n/g, `
`) }];
  for (const s of ts)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Ot(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return mc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function mc(e) {
  return e.split(dc).map((t, n) => n % 2 ? t : t.replace(uc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Us(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function gc(e) {
  const [t, , ...n] = e, s = Us(t).map((o) => `<th>${Ot(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Us(o).map((r) => `<td>${Ot(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function vc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Ot(a)}</li>`).join("")}</${s}>`;
}
const Vs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
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
      const i = t.findIndex((u, f) => f > s && /^(```|~~~)/.test(u)), c = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(s + 1, c).join(`
`)}</code></pre>`), s = c + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${Ot(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Vs(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(gc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(vc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Qa(
          t.slice(s, i).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Vs(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Ot(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const yc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, wc = (e) => e.kind !== "text" && !yc.test(e.html);
function kc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Qa(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : wc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ns(e, t = { env: "" }) {
  const n = fc(e, t), s = Ge.get(n);
  if (Ge.delete(n), s && s.reads.every(hc))
    return Ge.set(n, s), s.html;
  const a = [], o = kc(pc(e, { ...t, reads: a }));
  return Ge.set(n, { html: o, reads: a }), Ge.size > cc && Ge.delete(Ge.keys().next().value), o;
}
const eo = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, sn = (e) => String(e || "").replace(eo, (t, n, s, a) => a), bc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Ft = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, $c = /^Traceback \(most recent call last\):/m, xc = 8;
function to(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, xc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Mc(e) {
  const t = [...e.matchAll(bc)].map((s) => s.index);
  if (Ft.lastIndex = 0, !t.length || !Ft.test(e)) return null;
  Ft.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Ft)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: to(n), tail: "" } : null;
}
function _c(e) {
  const t = $c.exec(e);
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
rt((e) => {
  const t = sn(e), n = _c(t) || Mc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const ss = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Sc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Ec = `${ss} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ac = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Cc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", zs = {
  js: { keywords: ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Sc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Ec, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Ac, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Cc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Gs(e, t, n) {
  return n && e.startsWith(n, t);
}
function Oc(e, t) {
  const n = zs[t] || zs.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const r = (i, c) => c && a.push({ kind: i, value: c });
  for (; o < e.length; ) {
    const i = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), f = e.slice(o, u < 0 ? e.length : u);
      r(
        /^#{1,6}\s/.test(f) ? "keyword" : /^(```|~~~)/.test(f) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(f) ? "number" : "plain",
        f
      ), r("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (Gs(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Gs(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), f = u < 0 ? e.length : u + n.block[1].length;
      r("comment", e.slice(o, f)), o = f;
      continue;
    }
    const c = (n.triple || []).find((u) => e.startsWith(u, o));
    if (c) {
      const u = e.indexOf(c, o + 3), f = u < 0 ? e.length : u + 3;
      r("string", e.slice(o, f)), o = f;
      continue;
    }
    if (n.quotes.includes(i)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== i && (i === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      r("string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && i === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      r("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(i)) {
      const f = e.slice(o).match(/^[\w$]+/)[0], g = n.lower ? f.toLowerCase() : f, k = n.property && /^\s*:/.test(e.slice(o + f.length));
      r(s.has(g) ? "keyword" : k ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
      continue;
    }
    if (/\d/.test(i)) {
      const u = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      r("number", u[0]), o += u[0].length;
      continue;
    }
    if (n.tags && (i === ">" || e.startsWith("/>", o))) {
      const u = i === ">" ? 1 : 2;
      r("keyword", e.slice(o, o + u)), o += u;
      continue;
    }
    r("plain", i), o += 1;
  }
  return a;
}
function Tc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Oc(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Ue(r) : `<span class="tok-${s}">${Ue(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Bc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Ic = 1500, Ks = /* @__PURE__ */ new WeakMap();
async function Rc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Bc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ks.get(t)), Ks.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Ic)
  )));
}
typeof document < "u" && document.addEventListener("click", Rc, !0);
const Lc = /^(```|~~~)\s*(\w+)?\s*$/, Dc = /^\s{4,}\S/, Nc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, jc = /^\s*(?:[-*+]|\d+[.)])\s/, no = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Pc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function so(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function qc(e) {
  const t = so(e.join(`
`));
  return (Pc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Wc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && no.test(t) && !jc.test(t);
};
function Ys(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Tc(so(e.join(`
`)), t || qc(e)).join(`
`)}</code></pre></div>` };
}
function Fc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Lc);
    if (r) {
      const c = t.findIndex((f, g) => g > o && f.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Ys(t.slice(o + 1, u).map(sn), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Wc(s) ? Nc : Dc;
    if (i.test(t[o])) {
      let c = o;
      for (; c < t.length && (i.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && no.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (c - o + u.length >= 2) {
        a(), n.push(Ys([...u, ...t.slice(o, c)].map(sn), "")), o = c;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
rt((e) => Fc(e));
const Hc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Uc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Vc(e) {
  const t = Hc.exec(e);
  if (t && pt(t[1])) return { at: t.index, length: t[0].length, table: pt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Uc.exec(e), s = n && pt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function zc(e, t, n, s) {
  const a = Xa(s, e, t), o = sn(a ? bi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(yn(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
rt(
  (e, t) => {
    const n = Vc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: zc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Gc = /\.(png|jpe?g|gif|webp|svg)$/i, Kc = (e) => Gc.test(e), Yc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Jc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Zc(e, t) {
  const n = Yc.exec(e), [, s, a, o, r, i] = n || [], c = n && pt(s || o), u = c && Xa(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const f = ie.in(t.env).fileUrl(c, u.id, i), g = `${yn(c).title} ${u.id} · ${Ue(i)}`, k = Kc(i) ? `<img class="file-card-image" src="${f}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Ue(i)}">${k}<span class="file-card-name">${g}</span></a>` };
}
function Xc(e) {
  const t = Jc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
rt(
  (e, t) => {
    if (t.inline) return null;
    const n = Zc(e, t) || Xc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Qc = /`([^`\n]+)`/g;
rt((e) => e.replace(Qc, (t, n) => `<code>${n}</code>`));
const Js = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${mn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
rt(
  (e, t) => e.replace(eo, (n, s, a, o) => Js[s] ? Js[s](a, o, t) : o)
);
const eu = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, tu = new RegExp(`\\b(${Fa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), nu = new RegExp(`\\b(${Fa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), su = (e, t) => `<a class="row-pill" href="#" data-peek="${pt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, au = (e) => e.replace(nu, (t, n, s) => s.replace(/\d+/g, (a) => su(n.replace(/s$/i, ""), a))), ou = (e) => au(e).replace(
  tu,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${pt(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
rt(
  (e, t) => t.rowNames === !1 ? e : e.split(eu).map((n, s) => s % 2 ? n : ou(n)).join("")
);
const ru = ["innerHTML"], iu = ["innerHTML"], lu = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = T(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = ns(s, { env: je.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => G(ht) && G(ht)(...o)),
      innerHTML: n.value
    }, null, 8, ru)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => G(ht) && G(ht)(...o)),
      innerHTML: n.value
    }, null, 8, iu));
  }
}, st = /* @__PURE__ */ Z(lu, [["__scopeId", "data-v-1a43d211"]]), cu = { class: "fact" }, uu = { class: "fact-label" }, du = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", cu, [
      p("span", uu, w(e.label), 1),
      H(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, hu = /* @__PURE__ */ Z(du, [["__scopeId", "data-v-3a88ecf8"]]), fu = { class: "list" }, pu = { class: "list-label" }, mu = {
  key: 1,
  class: "list-note"
}, gu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", fu, [
      (l(!0), d(X, null, re(e.items, (o, r) => (l(), K(ot(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Q(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          p("span", pu, w(o.label), 1),
          o.badge ? (l(), K(Ca, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : P("", !0),
          o.note ? (l(), d("span", mu, w(o.note), 1)) : P("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, vu = /* @__PURE__ */ Z(gu, [["__scopeId", "data-v-ebe2ae0a"]]), yu = { class: "table" }, wu = {
  key: 0,
  class: "table-row empty"
}, ku = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", yu, [
      p("div", {
        class: "table-row head",
        style: ke(a.value)
      }, [
        (l(!0), d(X, null, re(e.columns, (i) => (l(), d("span", {
          key: i,
          class: "cell"
        }, w(i), 1))), 128))
      ], 4),
      (l(!0), d(X, null, re(e.rows, (i, c) => (l(), K(ot(i.open ? "button" : "div"), {
        key: c,
        type: i.open ? "button" : void 0,
        class: Q(["table-row", i.tone, { opens: i.open }]),
        style: ke(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: V(() => [
          (l(!0), d(X, null, re(i.cells, (u, f) => (l(), d("span", {
            key: f,
            class: "cell"
          }, w(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), d("div", wu, w(e.empty), 1)) : P("", !0)
    ]));
  }
}, bu = /* @__PURE__ */ Z(ku, [["__scopeId", "data-v-9326a52e"]]), $u = { class: "stat-value" }, xu = { class: "stat-label" }, Mu = {
  key: 0,
  class: "stat-note"
}, _u = {
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
    return (s, a) => (l(), K(ot(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Q(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        p("span", $u, w(e.value), 1),
        p("span", xu, w(e.label), 1),
        e.note ? (l(), d("span", Mu, w(e.note), 1)) : P("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Su = /* @__PURE__ */ Z(_u, [["__scopeId", "data-v-ad0db6d6"]]), Eu = { class: "code" }, Au = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (l(), K(ps, {
      value: e.node.type
    }, {
      stack: V(() => [
        H(Gt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: V(() => [
        H(Gt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: V(() => [
        H(Gt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: V(() => [
        H(yi, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: V(() => [
        p("h3", {
          class: Q(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
      divider: V(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: V(() => [
        H(Su, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: V(() => [
        H(hi, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: V(() => [
        H(bu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: V(() => [
        H(vu, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: V(() => [
        H(st, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: V(() => [
        H(hu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: V(() => [
        H(Ca, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: V(() => [
        p("pre", Eu, [
          p("code", null, w(e.node.text), 1)
        ])
      ]),
      file: V(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ao = /* @__PURE__ */ Z(Au, [["__scopeId", "data-v-cbdcf540"]]), Cu = { class: "dashboard" }, Ou = { class: "trail" }, Tu = ["onClick"], Bu = {
  key: 0,
  class: "gone",
  role: "status"
}, Iu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (k) => k in (n.document.pages || {}), o = W(!!n.page && !a(n.page)), r = W(n.page && !o.value ? [n.page] : []), i = T(() => r.value.at(-1) || n.document.start), c = T(() => (n.document.pages || {})[i.value] || null), u = (k) => ((n.document.pages || {})[k] || {}).title || k, f = (k) => {
      o.value = !1, r.value = [...r.value, k];
    }, g = (k) => {
      o.value = !1, r.value = r.value.slice(0, k);
    };
    return be(
      () => n.document.start,
      () => r.value = []
    ), (k, E) => (l(), d("div", Cu, [
      e.document.broken ? (l(), K(Xt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          he(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), K(Xt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: V(() => [
          he(w(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(X, { key: 2 }, [
        p("nav", Ou, [
          p("button", {
            type: "button",
            class: Q(["step", { current: !r.value.length }]),
            onClick: E[0] || (E[0] = (B) => g(0))
          }, w(u(e.document.start)), 3),
          (l(!0), d(X, null, re(r.value, (B, L) => (l(), d(X, {
            key: `${L}-${B}`
          }, [
            E[2] || (E[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: Q(["step", { current: L === r.value.length - 1 }]),
              onClick: (y) => g(L + 1)
            }, w(u(B)), 11, Tu)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Bu, "What you opened is no longer in this dashboard. Here is its start page.")) : P("", !0),
        H(dn, {
          name: "page",
          mode: "out-in"
        }, {
          default: V(() => [
            (l(), d("div", {
              key: i.value,
              class: "page"
            }, [
              H(ao, {
                node: c.value.view,
                onOpen: f,
                onFile: E[1] || (E[1] = (B) => s("file", B))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : P("", !0)
    ]));
  }
}, Av = /* @__PURE__ */ Z(Iu, [["__scopeId", "data-v-fbe83734"]]);
function Ru(e, t, n, s = () => window) {
  Le(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Se(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Lu = (e, t = () => !0) => Ru("keydown", (n) => n.key === "Escape" && t() && e());
function Du(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = W(!1), a = T(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Lu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Nu = 80, ct = fs([]);
function ju(e) {
  const t = Symbol("layer"), n = () => ct.includes(t) && ct.splice(ct.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !ct.includes(t) && ct.push(t), s || n();
    },
    { immediate: !0 }
  ), Se(n), T(() => Nu + Math.max(0, ct.indexOf(t)));
}
let oo = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return oo = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Pu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function qu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Pu)];
    if (!r.length) return o.preventDefault();
    const [i, c] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Le(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : oo, document.addEventListener("keydown", a), fn(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Se(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Wu = ["aria-modal", "aria-label", "aria-labelledby"], Fu = {
  key: 0,
  class: "dialog-head"
}, Hu = ["id", "tabindex"], Uu = {
  key: 1,
  class: "dialog-foot"
}, Vu = 500, zu = 400, Gu = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Du(s, n), i = ju(a), c = W(null), u = W(null), f = W(null), g = ya(), k = W(!1), E = Date.now();
    n.modal && qu(u, () => s("escape"), f);
    function B() {
      if (!n.modal) return n.closable && o();
      k.value = !0, setTimeout(() => k.value = !1, zu);
    }
    function L(D) {
      !n.modal || Date.now() - E >= Vu || ![" ", "Enter"].includes(D.key) || (D.preventDefault(), D.stopPropagation());
    }
    const y = () => c.value && (c.value.scrollTop = c.value.scrollHeight), x = new MutationObserver(y);
    return be(c, (D) => {
      x.disconnect(), D && n.follow && (x.observe(D, { childList: !0, subtree: !0, characterData: !0 }), y());
    }), Se(() => x.disconnect()), (D, U) => (l(), K(wa, { to: "body" }, [
      H(dn, {
        name: "dialog",
        appear: "",
        onAfterLeave: G(r)
      }, {
        default: V(() => [
          G(a) ? (l(), d("div", {
            key: 0,
            class: Q(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ke({ zIndex: G(i) }),
            onClick: _e(B, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: Q(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: k.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? G(g) : void 0,
              onKeydownCapture: L
            }, [
              e.bare ? P("", !0) : (l(), d("header", Fu, [
                p("h3", {
                  id: G(g),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, Hu),
                e.closable ? (l(), K(gs, {
                  key: 0,
                  onClick: G(o)
                }, null, 8, ["onClick"])) : P("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: Q(["dialog-body", { bare: e.bare }])
              }, [
                we(D.$slots, "default", {}, void 0, !0)
              ], 2),
              D.$slots.foot ? (l(), d("footer", Uu, [
                we(D.$slots, "foot", {}, void 0, !0)
              ])) : P("", !0)
            ], 42, Wu)
          ], 6)) : P("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ku = /* @__PURE__ */ Z(Gu, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ie = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Yu = 6;
function xs(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Ju = (e) => {
  const t = xs(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
  return { name: e, lines: t, line: ze.line, padY: ze.padY, width: n, height: t.length * ze.line + ze.padY * 2 };
};
function Zu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, c) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(c) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function Xu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Qu(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, c) => [i, c]))), o = (r, i) => {
    const c = a(), u = (f) => {
      const g = i(f).map((k) => c.get(k));
      return g.length ? g.reduce((k, E) => k + E, 0) / g.length : c.get(f);
    };
    return [...r].sort((f, g) => u(f) - u(g));
  };
  for (let r = 0; r < Yu; r++) {
    const i = r % 2 === 0, c = s.map((u, f) => f);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const f = (g) => t.filter((k) => k[i ? 1 : 0] === g).map((k) => k[i ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
function ed(e, t) {
  const n = /* @__PURE__ */ new Map(), s = (a, o, r, i) => {
    const c = `${a[o]}:${r}`;
    (n.get(c) || n.set(c, []).get(c)).push({ arrow: a, end: o, other: i });
  };
  e.forEach((a) => {
    s(a, "from", a.back ? "top" : "bottom", a.to), s(a, "to", a.back ? "bottom" : "top", a.from);
  });
  for (const a of n.values())
    a.sort((o, r) => t.get(o.other).x - t.get(r.other).x), a.forEach(({ arrow: o, end: r }, i) => o[`${r}Share`] = (i + 1) / (a.length + 1));
}
function td(e) {
  const t = [...new Set(e.flatMap(([$, m]) => [$, m]))], n = new Set(e.map(([, $]) => $)), s = t.filter(($) => !n.has($)), a = Zu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter(($, m) => !a.has(m)), r = Xu(t, o), i = Qu(t, o, r), c = new Map(t.map(($) => [$, Ju($)])), u = i.map(($) => $.reduce((m, N) => m + c.get(N).width, 0) + Be.across * ($.length - 1)), f = Math.max(...u) + Be.margin * 2, g = sd(e, r, i.length), k = /* @__PURE__ */ new Map();
  let E = Be.margin;
  i.forEach(($, m) => {
    let N = (f - u[m]) / 2;
    const O = Math.max(...$.map((q) => c.get(q).height));
    $.forEach((q) => {
      const M = c.get(q);
      k.set(q, { ...M, x: N, y: E + (O - M.height) / 2 }), N += M.width + Be.across;
    }), E += O + (g[m] ?? Be.down);
  });
  const B = e.map(([$, m, N], O) => ({ from: $, to: m, label: N || "", back: a.has(O) || r.get(m) <= r.get($) }));
  ed(B, k);
  const L = B.map(($) => ad($, k.get($.from), k.get($.to))), y = [...k.values()], x = ld(L, y), D = Math.max(E - Be.down, ...x.filter(($) => $.label).map(($) => $.label.y + $.label.height));
  return { width: Math.max(f - Be.margin, ...x.filter(($) => $.label).map(($) => $.label.x + $.label.width)) + Be.margin, height: D + Be.margin, nodes: y, arrows: x };
}
const nd = (e) => e ? xs(e, Ie.lineChars).length * Ie.line + Ie.pad * 2 : 0;
function sd(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += nd(r) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function ad(e, t, n) {
  const s = e.label ? xs(e.label, Ie.lineChars) : [], a = s.length ? Math.max(...s.map((k) => k.length)) * Ie.charWidth + Ie.pad * 2 : 0, o = s.length * Ie.line + (s.length ? Ie.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - i) / 2, g = [{ x: r, y: i }, { x: r, y: i + f }, { x: c, y: u - f }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: g, path: `M${r} ${i} C${r} ${i + f} ${c} ${u - f} ${c} ${u}` };
}
const od = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, rd = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], id = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ie.line);
function ld(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, u) => {
      const f = od(s.curve, c);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = id.flatMap((c) => rd.map((u) => a(u, c))).find((c) => !n.some((u) => Zs(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => Zs(i, c)); ) i.y += Ie.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Ie.line, pad: Ie.pad } };
  });
}
const Zs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, cd = { class: "flowchart-tools" }, ud = ["width", "height", "viewBox", "aria-label"], dd = ["d"], hd = ["x", "y", "width", "height"], fd = ["x", "y"], pd = ["x", "dy"], md = {
  key: 0,
  class: "flowchart-label"
}, gd = ["x", "y", "width", "height"], vd = ["x", "y"], yd = ["x", "dy"], wd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => td(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = W(null), i = W({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var x;
      const L = (x = r.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(L != null && L.width)) return;
      const y = Math.min(L.width / a.value.width, L.height / a.value.height, 1.5);
      i.value = { zoom: y, x: (L.width - a.value.width * y) / 2, y: (L.height - a.value.height * y) / 2 };
    }
    function f(L, y, x) {
      const { zoom: D, x: U, y: $ } = i.value, m = Math.min(o.most, Math.max(o.least, D * L));
      i.value = { zoom: m, x: y - (y - U) * m / D, y: x - (x - $) * m / D };
    }
    function g(L) {
      const y = r.value.getBoundingClientRect();
      f(L, y.width / 2, y.height / 2);
    }
    function k(L) {
      const y = r.value.getBoundingClientRect();
      L.ctrlKey || L.metaKey ? f(L.deltaY < 0 ? o.step : 1 / o.step, L.clientX - y.left, L.clientY - y.top) : i.value = { ...i.value, x: i.value.x - L.deltaX, y: i.value.y - L.deltaY };
    }
    function E(L) {
      var y, x, D;
      L.preventDefault(), (y = window.getSelection()) == null || y.removeAllRanges(), c = { x: L.clientX - i.value.x, y: L.clientY - i.value.y }, (D = (x = r.value).setPointerCapture) == null || D.call(x, L.pointerId);
    }
    function B(L) {
      c && (i.value = { ...i.value, x: L.clientX - c.x, y: L.clientY - c.y });
    }
    return Le(u), (L, y) => (l(), K(Ku, {
      title: e.title,
      large: "",
      onClose: y[4] || (y[4] = (x) => s("close"))
    }, {
      default: V(() => [
        p("div", cd, [
          H(ye, {
            small: "",
            onClick: y[0] || (y[0] = (x) => g(o.step))
          }, {
            default: V(() => [...y[5] || (y[5] = [
              he("Zoom in", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            small: "",
            onClick: y[1] || (y[1] = (x) => g(1 / o.step))
          }, {
            default: V(() => [...y[6] || (y[6] = [
              he("Zoom out", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            small: "",
            onClick: u
          }, {
            default: V(() => [...y[7] || (y[7] = [
              he("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: _e(k, ["prevent"]),
          onPointerdown: E,
          onPointermove: B,
          onPointerup: y[2] || (y[2] = (x) => Os(c) ? c.value = null : c = null),
          onPointercancel: y[3] || (y[3] = (x) => Os(c) ? c.value = null : c = null)
        }, [
          (l(), d("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ke({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (l(!0), d(X, null, re(a.value.arrows, (x, D) => (l(), d("path", {
              key: `arrow-${D}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, dd))), 128)),
            (l(!0), d(X, null, re(a.value.nodes, (x) => (l(), d("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, hd),
              p("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (l(!0), d(X, null, re(x.lines, (D, U) => (l(), d("tspan", {
                  key: U,
                  x: x.x + x.width / 2,
                  dy: U ? x.line : 0
                }, w(D), 9, pd))), 128))
              ], 8, fd)
            ]))), 128)),
            (l(!0), d(X, null, re(a.value.arrows, (x, D) => (l(), d(X, {
              key: `label-${D}`
            }, [
              x.label ? (l(), d("g", md, [
                p("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, gd),
                p("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (l(!0), d(X, null, re(x.label.lines, (U, $) => (l(), d("tspan", {
                    key: $,
                    x: x.label.x + x.label.width / 2,
                    dy: $ ? x.label.line : 0
                  }, w(U), 9, yd))), 128))
                ], 8, vd)
              ])) : P("", !0)
            ], 64))), 128))
          ], 12, ud))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, kd = /* @__PURE__ */ Z(wd, [["__scopeId", "data-v-51d24cfe"]]), Xs = {
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
}, bd = ["innerHTML"], $d = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => Xs[t.name] || Xs.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, bd));
  }
}, Ve = /* @__PURE__ */ Z($d, [["__scopeId", "data-v-beb5935c"]]), xd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: Q(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      H(Ve, { name: "fold" })
    ], 2));
  }
}, Tt = /* @__PURE__ */ Z(xd, [["__scopeId", "data-v-d03899bb"]]), Md = ["data-tip", "aria-label"], _d = {
  key: 0,
  class: "mact-word"
}, Sd = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: Q(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      H(Ve, { name: "open" }),
      e.open ? (l(), d("span", _d, w(e.label), 1)) : P("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Md));
  }
}, ro = /* @__PURE__ */ Z(Sd, [["__scopeId", "data-v-3b292e09"]]), Ed = 120, An = 280, Ad = 160, Cd = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function io(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = W(t()), a = W("");
  let o = 0;
  const r = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const f = e.value, g = ++o;
    if (!f || !f.offsetWidth || Cd()) {
      s.value = u;
      return;
    }
    const k = { width: f.offsetWidth, height: f.offsetHeight };
    if (r(f, k), a.value = "leaving", await n(Ed), g !== o) return;
    s.value = u, a.value = "resizing", await fn(), i(f);
    const E = { width: f.offsetWidth, height: f.offsetHeight };
    r(f, k), f.offsetWidth, f.style.transition = `width ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, E), await n(An), g === o && (i(f), a.value = "entering", await n(Ad), g === o && (a.value = ""));
  }
  return be(t, (u) => c(u)), vt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Od = { class: "growing-card-top" }, Td = ["aria-expanded"], Bd = { class: "growing-card-avatar" }, Id = { class: "growing-card-title" }, Rd = { class: "growing-card-more" }, Ld = { class: "growing-card-body" }, Dd = {
  __name: "GrowingCard",
  props: {
    title: { type: String, required: !0 },
    text: { type: String, default: "" },
    icon: { type: String, default: "agents" },
    person: { type: String, default: "" },
    bad: Boolean,
    action: { type: String, default: "" },
    incoming: Boolean
  },
  emits: ["act"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(!1), o = W(null), { folded: r, phase: i } = io(o, () => !a.value), c = T(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = T(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, g) => (l(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Q(["growing-card-wrap", G(i), { open: !G(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Od, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: g[0] || (g[0] = (k) => a.value = !a.value)
        }, [
          p("span", Bd, [
            e.bad ? (l(), K(Ve, {
              key: 0,
              name: "cross"
            })) : c.value ? (l(), d(X, { key: 1 }, [
              he(w(c.value), 1)
            ], 64)) : (l(), K(Me, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Id, w(e.title), 1),
          H(Tt, { open: a.value }, null, 8, ["open"])
        ], 8, Td),
        e.action ? (l(), K(ro, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: g[1] || (g[1] = (k) => s("act"))
        }, null, 8, ["label", "open"])) : P("", !0)
      ]),
      p("div", Rd, [
        p("div", Ld, [
          (l(!0), d(X, null, re(u.value, (k, E) => (l(), d("p", {
            key: E,
            class: "growing-card-text"
          }, w(k), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Nd = /* @__PURE__ */ Z(Dd, [["__scopeId", "data-v-c09abbcf"]]), jd = ["title", "aria-label"], Pd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, qd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Wd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = T(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), d("span", {
      class: Q(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), d("svg", Pd, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", qd)) : P("", !0)
      ]))
    ], 10, jd));
  }
}, Fd = /* @__PURE__ */ Z(Wd, [["__scopeId", "data-v-6dc92808"]]), Hd = "img,pre,table";
function Ud(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Vd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function zd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Hd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Ud(Vd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Gd(e, t) {
  let n = null;
  const s = () => e.value && zd(e.value);
  Le(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Se(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const Kd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Yd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Jd = ["data-ref"], Zd = ["data-from", "data-ref"], Xd = { class: "message-body" }, Qd = ["innerHTML"], eh = ["innerHTML"], th = {
  class: "message-faces",
  "data-message-faces": ""
}, nh = ["title", "data-face", "onClick"], sh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, ah = ["title", "data-reaction", "onClick"], oh = {
  key: 0,
  class: "message-reaction-count"
}, rh = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, ih = ["href", "title"], lh = ["src", "alt"], ch = ["href"], uh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, dh = {
  key: 1,
  "data-message-links-rows": ""
}, hh = { class: "message-foot" }, fh = { class: "message-time" }, ph = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, mh = 1500, gh = "An earlier message", vh = "about", yh = 3, wh = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    var C;
    const n = e, s = t, a = W(!1), o = W(null), r = T(() => ["user", "comment"].includes(n.message.type)), i = T(() => r.value && !n.message.read_at && !n.message.local);
    async function c() {
      var b;
      await ((b = navigator.clipboard) == null ? void 0 : b.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, mh);
    }
    const u = T(() => ns(n.message.text ?? "", { env: "" })), f = T(() => JSON.parse(n.message.flowchart_edges || "[]")), g = W(!1), k = T(() => ns(n.quote || gh, { env: "" }));
    function E() {
      const b = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      b ? b.scrollIntoView({ block: "center", behavior: "smooth" }) : wt(`messages:${n.message.parent_id}`);
    }
    Gd(o, () => `${n.message.text} ${n.quote}`);
    const B = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, L = (b) => `/api/files/message/${n.message.id}/${encodeURIComponent(b)}`, y = T(() => JSON.parse(n.message.captions || "{}")), x = T(() => (n.message.files ?? []).map((b) => ({ name: b, address: L(b), isImage: B.test(b), title: y.value[b] || b }))), D = T(() => Da(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), U = Ne(Pe, null), $ = W([]), m = W(!1), N = T(() => `Linked: ${$.value.join(", ")}`), O = T(() => $.value.length >= yh), q = T(() => `${$.value.length} linked ${$.value.every((b) => b.startsWith("task ")) ? "tasks" : "rows"}`);
    async function M() {
      if (!r.value || !(U != null && U.read) || n.message.local) return;
      const b = await U.read(`link list --source message:${n.message.id}`);
      b.ok && ($.value = (b.value.rows ?? b.value ?? []).filter((A) => A.link_type === vh).map((A) => `${A.target_model} ${A.target_id}`));
    }
    M(), (C = U == null ? void 0 : U.follow) == null || C.call(U, ["link.*"], M);
    const S = W(!1), v = T(() => Yd(n.message.reactions));
    function h(b) {
      S.value = !1, s("react", n.message, b);
    }
    return (b, A) => e.message.peer || e.message.recipient ? (l(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      H(Nd, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Jd)) : (l(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", Xd, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: "message-card md",
          onClick: A[2] || (A[2] = (...z) => G(ht) && G(ht)(...z))
        }, [
          e.message.parent_id ? (l(), d("div", {
            key: 0,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: _e(E, ["stop"]),
            innerHTML: k.value
          }, null, 8, Qd)) : P("", !0),
          p("div", { innerHTML: u.value }, null, 8, eh),
          f.value.length ? (l(), d(X, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: A[0] || (A[0] = (z) => g.value = !0)
            }, "Open the flowchart"),
            g.value ? (l(), K(kd, {
              key: 0,
              title: e.message.text,
              edges: f.value,
              onClose: A[1] || (A[1] = (z) => g.value = !1)
            }, null, 8, ["title", "edges"])) : P("", !0)
          ], 64)) : P("", !0)
        ], 512),
        p("div", {
          class: Q(["message-tools", { picking: S.value }]),
          "data-message-tools": ""
        }, [
          S.value ? (l(), d(X, { key: 0 }, [
            p("div", th, [
              (l(!0), d(X, null, re(G(Kd), (z) => (l(), d("button", {
                key: z,
                type: "button",
                class: "message-face",
                title: `React ${z}`,
                "data-face": z,
                onClick: (oe) => h(z)
              }, w(z), 9, nh))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: A[3] || (A[3] = (z) => S.value = !1)
            }, [
              H(Me, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (l(), d(X, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: A[4] || (A[4] = (z) => S.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: A[5] || (A[5] = (z) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: c
            }, w(a.value ? "Copied" : "Copy"), 1),
            i.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: A[6] || (A[6] = (z) => s("delete", e.message))
            }, "Delete")) : P("", !0)
          ], 64))
        ], 2)
      ]),
      v.value.length ? (l(), d("div", sh, [
        (l(!0), d(X, null, re(v.value, (z) => (l(), d("button", {
          key: z.emoji,
          type: "button",
          class: Q(["message-reaction", { mine: z.mine }]),
          title: z.title,
          "data-reaction": z.emoji,
          onClick: (oe) => s("react", e.message, z.emoji)
        }, [
          he(w(z.emoji) + " ", 1),
          z.count > 1 ? (l(), d("span", oh, w(z.count), 1)) : P("", !0)
        ], 10, ah))), 128))
      ])) : P("", !0),
      x.value.length ? (l(), d("div", rh, [
        (l(!0), d(X, null, re(x.value, (z) => (l(), d(X, {
          key: z.name
        }, [
          z.isImage ? (l(), d("a", {
            key: 0,
            href: z.address,
            target: "_blank",
            class: "message-image",
            title: z.title
          }, [
            p("img", {
              src: z.address,
              alt: z.name
            }, null, 8, lh)
          ], 8, ih)) : (l(), d("a", {
            key: 1,
            href: z.address,
            target: "_blank",
            class: "message-file"
          }, w(z.name), 9, ch))
        ], 64))), 128))
      ])) : P("", !0),
      $.value.length ? (l(), d("div", uh, [
        H(Ve, {
          class: "message-links-icon",
          name: "linked"
        }),
        O.value && !m.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: A[7] || (A[7] = (z) => m.value = !0)
        }, w(q.value), 1)) : (l(), d("span", dh, [
          H(st, {
            text: N.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : P("", !0),
      p("div", hh, [
        p("time", fh, w(D.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", ph, "#" + w(e.message.id), 1)) : P("", !0),
        r.value ? (l(), K(Fd, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : P("", !0)
      ])
    ], 8, Zd));
  }
}, Cv = /* @__PURE__ */ Z(wh, [["__scopeId", "data-v-f3a0196d"]]), an = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Cn = 200, lo = (e) => {
  var t;
  return ((t = an.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? an[0].key;
}, Ov = (e) => {
  var t;
  return ((t = an.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, kh = ["aria-label"], bh = 300, Qs = 400, $h = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Cn } },
  setup(e) {
    const t = e, n = T(() => lo(t.value)), s = T(() => n.value < Cn ? [1, 0.25, 0.25] : n.value === Cn ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: Q(["ico", "prio", { hot: n.value >= Qs, high: n.value >= bh && n.value < Qs }]),
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
        style: ke({ opacity: s.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ke({ opacity: s.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ke({ opacity: s.value[2] })
      }, null, 4)
    ], 10, kh));
  }
}, Tv = /* @__PURE__ */ Z($h, [["__scopeId", "data-v-b10e610f"]]), xh = ["aria-checked", "aria-haspopup", "onClick"], Mh = {
  key: 0,
  class: "segmented-dot"
}, _h = {
  key: 1,
  class: "segmented-count"
}, Sh = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ya();
    return (a, o) => {
      const r = Ko("tip");
      return l(), d("span", {
        class: Q(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), d(X, null, re(e.options, (i) => mt((l(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Q(["segmented-option", { on: i.key === e.value }]),
          onClick: (c) => n("pick", i.key)
        }, [
          i.dot ? (l(), d("span", Mh)) : P("", !0),
          he(" " + w(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", _h, w(i.count), 1)) : P("", !0)
        ], 10, xh)), [
          [r, i.tip || i.title, `${G(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, as = /* @__PURE__ */ Z(Sh, [["__scopeId", "data-v-ca953072"]]), ea = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Eh = {
  key: 1,
  class: "text-field-label"
}, Ah = {
  key: 2,
  class: "text-field-end"
}, Ch = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ zn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Vn(e, "modelValue"), s = ka(), a = "onUpdate:modelValue" in (((f = Yo()) == null ? void 0 : f.vnode.props) || {}), o = T(() => a ? n.value : s.value), r = (g) => a && (n.value = g.target.value), i = T(
      () => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "class" && g !== "style" && g !== "value"))
    ), c = T(() => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "value"))), u = W(null);
    return t({ focus: () => u.value && u.value.focus() }), (g, k) => e.label || e.icon || g.$slots.end ? (l(), d("label", {
      key: 0,
      class: Q(["text-field", { large: e.large, ended: g.$slots.end }, G(s).class]),
      style: ke(G(s).style)
    }, [
      e.icon ? (l(), K(Me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : P("", !0),
      e.label ? (l(), d("span", Eh, w(e.label), 1)) : P("", !0),
      mt(p("input", at({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [G(ea), o.value]
      ]),
      g.$slots.end ? (l(), d("span", Ah, [
        we(g.$slots, "end", {}, void 0, !0)
      ])) : P("", !0)
    ], 6)) : mt((l(), d("input", at({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
      [G(ea), o.value]
    ]);
  }
}), Oh = /* @__PURE__ */ Z(Ch, [["__scopeId", "data-v-d9c38ca8"]]), ta = (e) => e.page * e.size < e.total;
function Th(e, t, { incremental: n = !1 } = {}) {
  const s = ms(), a = W([]), o = W(""), r = W(!1), i = W(!1), c = W(""), u = W(null);
  async function f(y) {
    const x = await s.read(`${e} --before-id ${y + 1} --limit 1`);
    if (!x.ok) return B();
    const D = x.value.rows.find((U) => U.id === y);
    a.value = D ? a.value.map((U) => U.id === y ? D : U) : a.value.filter((U) => U.id !== y);
  }
  async function g(y) {
    if (n && String((y == null ? void 0 : y.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((m) => m.id !== y.row_id));
    if (n && (y != null && y.row_id) && !String(y.event ?? "").endsWith(".create") && a.value.some((m) => m.id === y.row_id)) return f(y.row_id);
    if (!(n && a.value.length && String((y == null ? void 0 : y.event) ?? "").endsWith(".create"))) return B();
    const D = Math.max(...a.value.map((m) => m.id)), U = await s.read(`${e} --after-id ${D}`);
    if (!U.ok) return B();
    const $ = new Set(a.value.map((m) => m.id));
    a.value = [...U.value.rows.filter((m) => !$.has(m.id)), ...a.value];
  }
  async function k() {
    if (!a.value.length) return !1;
    const y = Math.min(...a.value.map((U) => U.id)), x = await s.read(`${e} --before-id ${y}`);
    if (!x.ok || !x.value.rows.length) return i.value = !1;
    i.value = ta(x.value);
    const D = new Set(a.value.map((U) => U.id));
    return a.value = [...a.value, ...x.value.rows.filter((U) => !D.has(U.id))], !0;
  }
  let E = 0;
  async function B() {
    const y = ++E, x = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (y !== E) return;
    const D = x.ok ? s.shared ? [x.value] : x.value.rows : [], U = D.length ? Math.min(...D.map(($) => $.id)) : 0;
    a.value = n && x.ok && U ? [...a.value.filter(($) => $.id > Math.max(...D.map((m) => m.id))), ...D, ...a.value.filter(($) => $.id < U)] : D, x.ok && !a.value.some(($) => $.id < U) && (i.value = !s.shared && ta(x.value)), o.value = x.ok ? "" : x.error, r.value = !0;
  }
  async function L(y) {
    const x = await s.run(y);
    return c.value = x.ok ? "" : x.error, u.value = x.ok ? x.value : null, await B(), x;
  }
  return s.follow(t, g), B(), { rows: a, failure: o, loaded: r, more: i, load: B, older: k, act: L, actionFailure: c, answer: u, context: s };
}
const Bh = { class: "title" }, Ih = { class: "state" }, Rh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Th(t.line, t.events);
    return (o, r) => (l(), K(Vr, {
      rows: G(n),
      failure: G(s),
      loaded: G(a),
      empty: e.empty
    }, {
      default: V(({ row: i }) => [
        p("span", Bh, w(i.title), 1),
        p("span", Ih, w(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Bv = /* @__PURE__ */ Z(Rh, [["__scopeId", "data-v-a69084cd"]]), On = W(Date.now() / 1e3);
let na = 0, Ht = 0;
function Lh() {
  return Ht || (On.value = Date.now() / 1e3, na = setInterval(() => On.value = Date.now() / 1e3, 1e3)), Ht += 1, ba() && $a(() => {
    Ht -= 1, Ht || clearInterval(na);
  }), On;
}
const Dh = ["title", "data-figure-mark", "data-folded", "data-open"], Nh = {
  key: 2,
  class: "worker"
}, jh = { class: "head" }, Ph = { key: 0 }, qh = {
  key: 3,
  class: "status"
}, Wh = {
  key: 0,
  class: "figure"
}, Fh = {
  key: 1,
  class: "ran-for"
}, Hh = { key: 2 }, Uh = {
  key: 3,
  class: "news"
}, Vh = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, zh = {
  key: 6,
  class: "settled"
}, Gh = {
  key: 1,
  class: "bar"
}, Kh = {
  key: 3,
  class: "detail body"
}, Yh = {
  key: 0,
  class: "body-label"
}, Jh = ["title"], Zh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ka(), s = ["onClick", "onAct"], a = T(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = W(!1), r = T(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = T(() => t.open !== void 0), c = T(() => i.value || r.value), u = T(() => i.value ? t.open : o.value), f = T(() => i.value ? !t.open : r.value && !o.value), g = T(() => !!(t.mark.action && n.onAct)), k = T(() => c.value || g.value || !!n.onClick), E = W(null), B = W(null), { folded: L, phase: y } = io(E, () => f.value);
    function x(le) {
      var me, Ee;
      if (!(le.target !== E.value && !B.value.contains(le.target))) {
        if (i.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Ee = n.onAct || n.onClick) == null || Ee(le);
      }
    }
    const D = (le) => n.onAct(le), U = ["failed", "unfinished"], $ = T(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? U.includes(t.mark.state) ? "danger" : "good" : ""), m = T(() => t.mark.color ? t.mark.color : $.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : $.value ? `var(--tone-${$.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), N = T(() => m.value || "var(--tone-work)"), O = T(() => !t.mark.ending && !t.mark.ended && $.value !== "stopped"), q = Lh(), M = T(
      () => t.mark.began_at && O.value && !t.mark.figure && !t.mark.counting ? el(q.value - t.mark.began_at) : ""
    ), S = T(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${qs(me - le, !0)}` : qs(q.value - le, !0) : M.value;
    }), v = ["bad", "danger", "warn"], h = T(() => v.includes($.value) || t.mark.asks ? "attention" : O.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), C = ["bad", "danger"], b = T(() => C.includes($.value)), A = T(() => h.value === "process" ? "running" : b.value ? "cross" : $.value === "stopped" ? "stopped" : $.value === "good" ? "tick" : ""), z = T(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || A.value || t.mark.settled || t.mark.news)
    ), oe = T(() => [t.mark.title, t.mark.time ? Da(t.mark.time) : ""].filter(Boolean).join(" · ")), de = T(() => ({
      ...m.value ? { "--mark": m.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (l(), d("div", at(a.value, {
      ref_key: "root",
      ref: E,
      class: [
        "mark",
        `w-${h.value}`,
        G(y),
        {
          open: u.value,
          live: k.value,
          failed: b.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: m.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: de.value,
      title: oe.value,
      "data-figure-mark": e.mark.key,
      "data-folded": G(L) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (l(), K(ot(k.value ? "button" : "span"), {
        ref_key: "top",
        ref: B,
        class: "top",
        type: k.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!u.value) : void 0
      }, {
        default: V(() => [
          e.mark.markIcon ? (l(), K(Ve, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), K(Me, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), d("span", Nh, w(e.mark.worker), 1)) : P("", !0),
          p("span", jh, [
            H(st, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", Ph, w(e.mark.name), 1)) : P("", !0),
            c.value ? (l(), K(Tt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : P("", !0)
          ]),
          z.value ? (l(), d("span", qh, [
            e.mark.figure ? (l(), d("span", Wh, w(e.mark.figure), 1)) : P("", !0),
            S.value ? (l(), d("span", Fh, w(S.value), 1)) : P("", !0),
            e.mark.stopping ? (l(), d("span", Hh, "Stopping")) : P("", !0),
            e.mark.news ? (l(), d("span", Uh, w(e.mark.news), 1)) : P("", !0),
            A.value === "running" ? (l(), d("span", Vh)) : A.value ? (l(), K(Ve, {
              key: 5,
              class: Q(["sign", A.value]),
              name: A.value
            }, null, 8, ["class", "name"])) : P("", !0),
            e.mark.settled ? (l(), d("span", zh, w(e.mark.settled), 1)) : P("", !0)
          ])) : P("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      g.value ? (l(), K(ro, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: _e(D, ["stop"])
      }, null, 8, ["label", "open"])) : P("", !0),
      (e.mark.figure || e.mark.counting) && O.value ? (l(), d("span", Gh, [
        p("span", {
          class: "progress",
          style: ke({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: N.value })
        }, null, 4)
      ])) : P("", !0),
      e.mark.detail && !G(L) ? (l(), K(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      e.mark.body && !G(L) ? (l(), d("div", Kh, [
        e.mark.bodyLabel ? (l(), d("p", Yh, w(e.mark.bodyLabel), 1)) : P("", !0),
        H(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : P("", !0),
      e.mark.command && !G(L) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, Jh)) : P("", !0),
      e.mark.card ? (l(), K(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      we(le.$slots, "default", {
        shown: !G(L)
      }, void 0, !0)
    ], 16, Dh));
  }
}), co = /* @__PURE__ */ Z(Zh, [["__scopeId", "data-v-1bcf640e"]]), Xh = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function uo(e) {
  var n;
  const t = Xh[e] || ((n = yn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Qh = (e) => uo(String(e).split(":")[0]), ho = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), ef = { passed: "good", failed: "danger", warned: "warn", running: "" }, tf = { good: "good", warn: "warn", danger: "danger" }, sa = {
  "open row": (e) => wt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Nr(e.target_model, e.target_id || 0)
}, nf = { "open row": (e) => Qh(e.target_model), "open page": () => uo("pages") };
function sf(e, t) {
  const n = t || {}, s = sa[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? ef[e.outcome] || "" : tf[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? nf[s](e) : "",
    handlers: s ? { onAct: () => sa[s](e) } : {}
  };
}
const af = 24, of = 1e3, aa = 2e3, rf = 0.25, lf = 5e3;
function cf(e, t = af, n = () => !0) {
  const s = W(!1), a = W(0), o = W(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const $ = u();
    return $ ? $.scrollHeight - $.scrollTop - $.clientHeight : 0;
  }, g = () => !u() || f() <= t;
  function k($) {
    if (clearTimeout(r), !$) {
      o.value = !1, c = Date.now();
      return;
    }
    const m = Date.now() - c < aa ? aa : of;
    r = setTimeout(() => o.value = s.value, m);
  }
  function E() {
    clearTimeout(i), s.value = !1, a.value = 0, k(!1);
  }
  function B($ = !1) {
    const m = u();
    m && $ && m.scrollTo ? m.scrollTo({ top: m.scrollHeight, behavior: "smooth" }) : m && (m.scrollTop = m.scrollHeight), E();
  }
  function L() {
    x(), !s.value && (s.value = !0, k(!0));
  }
  const y = () => !!u() && f() <= u().clientHeight * rf;
  function x() {
    clearTimeout(i), y() && (i = setTimeout(() => s.value && y() && n() && B(!0), lf));
  }
  function D() {
    g() ? E() : L();
  }
  function U($ = 1, m = !1) {
    s.value ? a.value += Math.max(0, $) : B(m);
  }
  return ba() && $a(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: g, follow: E, toBottom: B, left: L, scrolled: D, arrived: U };
}
const uf = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(null), { away: o, scrolled: r, arrived: i, toBottom: c } = cf(a);
    be(
      () => n.lines.length,
      () => fn(() => i()),
      { immediate: !0 }
    );
    function u(f) {
      r(), s("older", f.target);
    }
    return (f, g) => (l(), d("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      he(w(e.lines.join(`
`) || e.empty), 1),
      G(o) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: g[0] || (g[0] = (k) => G(c)(!0))
      }, "Follow")) : P("", !0)
    ], 544));
  }
}, df = /* @__PURE__ */ Z(uf, [["__scopeId", "data-v-09394a20"]]), hf = 1e4;
class ff {
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
    return this.heardAt !== null && t - this.heardAt > hf;
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
const pf = {
  key: 0,
  class: "frame-note"
}, mf = {
  key: 0,
  class: "frame-note"
}, gf = ["src", "title"], vf = 1e3, yf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ms(), s = W(null), a = W(!1), o = W(!1);
    let r = null, i = 0;
    return Le(() => {
      r = new ff(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, vf);
    }), Se(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", pf, "This window was closed because it stopped answering.")) : (l(), d(X, { key: 1 }, [
      a.value ? (l(), d("div", mf, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        H(ye, {
          onClick: u[0] || (u[0] = (f) => o.value = !0)
        }, {
          default: V(() => [...u[1] || (u[1] = [
            he("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : P("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: G(n).window
      }, null, 8, gf)
    ], 64));
  }
}, wf = /* @__PURE__ */ Z(yf, [["__scopeId", "data-v-32a49046"]]), kf = 0, bf = "/api/lines", $f = "/api/line";
class xf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), kf));
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
        const n = await De.raw(bf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await De.raw($f, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Mf = new xf();
class _f {
  constructor() {
    this.follows = [], this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, s, a = () => !0) {
    const o = { window: t, patterns: n, heard: s, visible: a };
    return this.follows.push(o), () => this.follows = this.follows.filter((r) => r !== o);
  }
  count(t) {
    return this.follows.filter((n) => n.window === t).length;
  }
  stopAll(t) {
    this.follows = this.follows.filter((n) => n.window !== t), this.held = new Set([...this.held].filter((n) => n.window !== t));
  }
  dispatch(t) {
    for (const n of this.follows)
      n.patterns.some((s) => fo(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function fo(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Sf = Symbol("pane-page"), Ef = { 1: "refused", 2: "usage", 3: "fault" }, Af = 100, Cf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Of({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = W({}), declared: u = [], page: f = null, setOption: g = () => {
}, readOnly: k = !1, shared: E = null }) {
  const B = /* @__PURE__ */ new Map(), L = new AbortController(), y = (x) => {
    const D = B.get(x);
    if (D && performance.now() - D.at < Af) return D.answer;
    const U = Et(e, x, t, L.signal);
    return B.set(x, { answer: U, at: performance.now() }), U;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: T(() => s()),
    permissions: a,
    readOnly: k,
    shared: E,
    read: y,
    run: (x) => Et(e, x, t, L.signal),
    upload: (x) => Bf(x, L.signal),
    cancel: () => L.abort(),
    follow: (x, D) => r.follow(e, x.filter((U) => o.some(($) => fo($, U))), D, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (x) => T(() => {
      var D;
      return c.value[x] ?? ((D = u.find((U) => U.key === x)) == null ? void 0 : D.default);
    }),
    setting: async (x, D) => {
      const U = await y(`window setting ${e} ${x}`);
      return U.ok ? U.value.value : D;
    },
    setOption: g,
    keep: (x, D) => Et(e, ["window", "save-setting", e, x, JSON.stringify(D)], t, L.signal)
  };
}
function Tf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const on = { ok: !1, failure: "cancelled", error: "" };
async function Et(e, t, n, s = void 0) {
  try {
    const a = await Mf.add({ window: e, line: Array.isArray(t) ? t : If(t), environment: n }, s);
    return s != null && s.aborted ? on : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Ef[a.code] || "fault", error: Tf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? on : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function Bf(e, t = void 0) {
  try {
    const n = await De.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? on : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? on : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function If(e) {
  return [...e.matchAll(Cf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Rf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Lf = {
  class: "allowance-prompt",
  role: "dialog"
}, Df = { class: "allowance-prompt-text" }, Nf = { class: "allowance-prompt-buttons" }, jf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", Lf, [
      p("p", Df, w(G(Rf)(e.request)), 1),
      p("div", Nf, [
        H(ye, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            he("Allow", -1)
          ])]),
          _: 1
        }),
        H(ye, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            he("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Pf = /* @__PURE__ */ Z(jf, [["__scopeId", "data-v-102dc765"]]), Tn = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), K(Xt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: V(() => [
        he(w(e.reason) + " ", 1),
        e.retry ? (l(), K(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            he("Retry", -1)
          ])]),
          _: 1
        })) : P("", !0),
        e.removable ? (l(), K(ye, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            he("Remove tab", -1)
          ])]),
          _: 1
        })) : P("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, qf = ["data-window", "data-agent"], Wf = {
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
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(""), o = W(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Ne(br, null), c = Of({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: T(() => n.options),
      declared: n.declared,
      page: Ne(Sf, null),
      setOption: (g, k) => s("option", g, k),
      readOnly: n.readOnly,
      shared: n.shared,
      open: (g, k) => {
        s("open", g, k), i == null || i(g, k);
      }
    });
    Jo(Pe, c), be(() => n.visible, (g) => g && n.subscriptions.shown(n.name)), Se(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), Zo((g) => (a.value = g instanceof Error ? g.message : String(g), n.subscriptions.stopAll(n.name), !1));
    const u = () => hs(n.component), f = () => {
      var g, k;
      return ((k = (g = n.prompts) == null ? void 0 : g.current.value) == null ? void 0 : k.window) === n.name ? n.prompts.current.value : null;
    };
    return (g, k) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (l(), K(Pf, {
        key: 0,
        request: f(),
        onAnswer: k[0] || (k[0] = (E) => e.prompts.answer(E))
      }, null, 8, ["request"])) : P("", !0),
      e.unavailableReason ? (l(), K(Tn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), K(Tn, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (l(), K(u, { key: o.value })) : (l(), K(Tn, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: k[1] || (k[1] = (E) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, qf));
  }
}, po = /* @__PURE__ */ Z(Wf, [["__scopeId", "data-v-09e99d1c"]]), Ff = {
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
    const n = e, s = t, a = { render: () => hs(wf, { src: n.entry.entry_url }) };
    return (o, r) => (l(), K(po, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: a,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: r[0] || (r[0] = (i, c) => s("option", i, c))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "events", "unavailable-reason"]));
  }
}, os = "journal.stale-build-reload", Hf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Uf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(os) === e.message) return !1;
    t.setItem(os, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Vf(e = window.sessionStorage) {
  try {
    e.removeItem(os);
  } catch {
    return;
  }
}
const zf = ["data-window"], Gf = {
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
    const n = e, s = t, a = hn(null), o = W("");
    return be(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, Vf();
          } catch (i) {
            if (Hf(i) && Uf(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (l(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      H(yt, { shape: "cards" })
    ], 8, zf)) : (l(), K(po, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: a.value,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      events: e.entry.events,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: i[0] || (i[0] = (c, u) => s("option", c, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "events", "unavailable-reason"]));
  }
}, Kf = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new _f(), s = ((i = Ne(Pe, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = T(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = T(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), K(Gf, {
      key: 0,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), K(Ff, {
      key: 1,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Yf = { class: "mark-more-inner" }, Jf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Zf = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Xf = {
  key: 3,
  class: "mark-lines"
}, Qf = "process", oa = "task", e1 = 2e3, t1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ne(Pe), s = T(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = T(() => ho.has(t.mark.variant) && t.mark.detail || ""), o = T(() => t.mark.target_model === oa ? t.mark.target_id : 0), r = W([]), i = W(!1), c = W(""), u = T(() => t.mark.target_model === Qf && !!t.mark.target_id);
    async function f() {
      const E = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = E.ok ? "" : E.error, E.ok && (r.value = E.value.lines);
    }
    let g = null;
    const k = () => clearInterval(g);
    return be(() => t.shown && u.value, (E) => {
      k(), E && (f(), t.mark.ended_at || (g = setInterval(f, e1)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (E) => E && t.shown && u.value && (k(), f())), Se(k), (E, B) => (l(), d("div", {
      class: Q(["mark-more", { open: e.shown }]),
      onClick: B[1] || (B[1] = _e(() => {
      }, ["stop"]))
    }, [
      p("div", Yf, [
        e.declaration.body_url ? (l(), K(Kf, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(X, { key: 1 }, [
          a.value ? (l(), d(X, { key: 0 }, [
            B[2] || (B[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Jf, w(a.value), 1)
          ], 64)) : P("", !0),
          u.value && c.value ? (l(), d("p", Zf, w(c.value), 1)) : u.value && i.value ? (l(), d(X, { key: 2 }, [
            B[3] || (B[3] = p("p", { class: "mark-label" }, "Output", -1)),
            H(df, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", Xf, w(s.value.join(`
`)), 1)) : P("", !0),
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: B[0] || (B[0] = _e((L) => G(wt)(`${oa}:${o.value}`), ["stop"]))
          }, "Open task " + w(o.value) + " and its proofs", 1)) : P("", !0)
        ], 64))
      ])
    ], 2));
  }
}, rs = /* @__PURE__ */ Z(t1, [["__scopeId", "data-v-51f69bf1"]]), n1 = (e) => `show-${e}`, Iv = (e, t, n) => e.filter((s) => {
  var a;
  return n(n1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), s1 = "messages.chat", a1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), is = (e, t, n) => Et(s1, a1(e, t), n), o1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, r1 = ["title", "aria-label", "onClick"], i1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, l1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = T(() => o1(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = W(""), a = Ne(Pe);
    async function o(r) {
      const i = await is(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (l(), d(X, null, [
      (l(!0), d(X, null, re(n.value, (c) => (l(), d("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: _e((u) => o(c), ["stop"])
      }, [
        H(Ve, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, r1))), 128)),
      s.value ? (l(), d("span", i1, w(s.value), 1)) : P("", !0)
    ], 64));
  }
}, c1 = /* @__PURE__ */ Z(l1, [["__scopeId", "data-v-0dfda102"]]);
function mo(e, t) {
  const n = hn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await De.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const go = mo("/api/marks", "marks"), Rv = go.fetchAll, u1 = go.find, d1 = 2e3;
function h1(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, d1);
  };
  Le(async () => {
    await e(), s();
  }), vt(() => clearTimeout(n));
}
const f1 = ["data-ref"], p1 = ["data-ref"], m1 = { class: "mark-row" }, g1 = "dock add", v1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = T(() => u1(s.mark.type)), o = Ne(Pe, null), r = T(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = W(null);
    h1(async () => {
      if (!r.value) return;
      const k = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      k.ok && k.value.rows.length && (i.value = k.value.rows[0].progress);
    }, () => r.value);
    const c = T(() => {
      const k = sf(s.mark, a.value), E = !k.figure || k.figure.endsWith("%");
      return i.value && r.value && E ? { ...k, figure: `${i.value}%`, fraction: i.value / 100 } : k;
    }), u = T(() => {
      var k;
      return !!(s.mark.lines || s.mark.detail && ho.has(s.mark.variant) || t.has(s.mark.target_model) || (k = a.value) != null && k.body_url);
    }), f = W(!1), g = T(() => {
      var k, E, B;
      return s.docked ? (E = (k = a.value) == null ? void 0 : k.buttons) == null ? void 0 : E.filter((L) => {
        var y;
        return !((y = L.runs) != null && y.startsWith(g1));
      }) : (B = a.value) == null ? void 0 : B.buttons;
    });
    return (k, E) => {
      var B, L;
      return (B = a.value) != null && B.card ? (l(), d("div", {
        key: 0,
        class: "thread-turn card whole-card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        H(rs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 8, f1)) : (l(), d("div", {
        key: 1,
        class: Q(["thread-turn", "card", { "full-width": (L = a.value) == null ? void 0 : L.full_width, docked: e.docked, "user-side": G(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", m1, [
          H(co, at({
            mark: c.value,
            open: u.value ? f.value : void 0
          }, Xo(c.value.handlers), {
            onClick: E[0] || (E[0] = (y) => f.value = !f.value)
          }), Qo({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: V(({ shown: y }) => [
                H(rs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          H(c1, {
            buttons: g.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, p1));
    };
  }
}, y1 = /* @__PURE__ */ Z(v1, [["__scopeId", "data-v-b5431d49"]]), w1 = ["data-ref"], k1 = ["inert"], b1 = { class: "thread-group" }, $1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = W(!1), s = W(!1);
    be(n, () => s.value = !0);
    const a = T(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (o, r) => (l(), d("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      H(co, {
        mark: a.value,
        open: n.value,
        onClick: r[0] || (r[0] = (i) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (l(), d("div", {
        key: 0,
        class: Q(["group-rows", { open: n.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", b1, [
          (l(!0), d(X, null, re(e.group.marks, (i) => (l(), K(y1, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, k1)) : P("", !0)
    ], 8, w1));
  }
}, Lv = /* @__PURE__ */ Z($1, [["__scopeId", "data-v-8a285510"]]);
function x1(e) {
  const t = W(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Le(() => n.observe(e.value)), vt(() => n.disconnect()), t;
}
const M1 = { class: "chat-dock-fold" }, _1 = ["aria-label"], S1 = { class: "chat-dock-head" }, E1 = { class: "chat-dock-inner" }, A1 = 700, C1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = W(null), s = W(null), a = x1(s), o = W(!1);
    let r = 0;
    return Le(() => r = setTimeout(() => o.value = !0, A1)), vt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: Q(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", M1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: Q(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          we(i.$slots, "edge"),
          p("header", S1, [
            we(i.$slots, "head")
          ]),
          p("div", {
            class: Q(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", E1, [
              p("div", {
                class: Q(["chat-dock-grow", { settled: o.value }]),
                style: ke(G(a) === null ? null : { height: `${G(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  we(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, _1)
      ])
    ], 2));
  }
}, vo = /* @__PURE__ */ Z(C1, [["__scopeId", "data-v-63e4dcfc"]]), O1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Bn = 5, T1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Bn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Bn}s`, animationDelay: `${(n - Bn).toFixed(2)}s` };
    return (a, o) => (l(), d("span", O1, [
      p("i", { style: s })
    ]));
  }
}, B1 = /* @__PURE__ */ Z(T1, [["__scopeId", "data-v-d0c4b012"]]), yo = mo("/api/docks", "docks"), Dv = yo.fetchAll, ls = yo.find, I1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ra = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function R1(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [ra("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || yn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ra("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const L1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: I1(e, t),
  buttons: R1(e, t)
}), D1 = { class: "dock-title" }, N1 = ["aria-expanded", "title"], j1 = { class: "chat-dock-acts dock-acts" }, P1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, q1 = {
  key: 1,
  class: "dock-text"
}, W1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = T(() => ls(s.item.type)), o = W(null), r = T(() => L1(s.item, a.value)), i = Ne(Pe), c = W(/* @__PURE__ */ new Set()), u = W("");
    async function f(E) {
      if (E.action === "open") return wt(`${s.item.target_model}:${s.item.target_id}`);
      if (E.action !== "declared") return is(E, s.item, i.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, E.label]), u.value = "";
      const B = await is(E, s.item, i.environment);
      (B == null ? void 0 : B.ok) === !1 && (c.value = new Set([...c.value].filter((L) => L !== E.label)), u.value = B.error);
    }
    const g = T(() => r.value.buttons.filter((E) => E.action !== "undock" && !c.value.has(E.label))), k = T(() => r.value.buttons.find((E) => E.action === "undock"));
    return (E, B) => (l(), K(vo, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: V(() => [
        e.leaving ? (l(), K(B1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : P("", !0)
      ]),
      head: V(() => {
        var L, y, x;
        return [
          (L = a.value) != null && L.draws_head ? (l(), d("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(X, { key: 1 }, [
            H(Me, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", D1, w(r.value.title), 1)
          ], 64)),
          (y = a.value) != null && y.badge ? (l(), d("span", {
            key: 2,
            class: Q(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, w(a.value.badge), 3)) : P("", !0),
          (x = a.value) != null && x.draws_head ? P("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: B[0] || (B[0] = (D) => n("fold"))
          }, [
            H(Tt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, N1)),
          p("span", j1, [
            (l(!0), d(X, null, re(g.value, (D) => (l(), K(ye, {
              key: D.action + D.runs,
              small: "",
              kind: D.primary ? "primary" : "ghost",
              bordered: !D.primary,
              "data-dock-action": D.action,
              onClick: (U) => f(D)
            }, {
              default: V(() => [
                he(w(D.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          H(gs, {
            title: k.value.label,
            "data-dock-action": "undock",
            onClick: B[1] || (B[1] = (D) => f(k.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var L, y;
        return [
          u.value ? (l(), d("p", P1, w(u.value), 1)) : P("", !0),
          e.item.text && !((L = a.value) != null && L.body_url) ? (l(), d("p", q1, w(e.item.text), 1)) : P("", !0),
          (y = a.value) != null && y.body_url ? (l(), K(rs, {
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
}, ia = /* @__PURE__ */ Z(W1, [["__scopeId", "data-v-608c189e"]]), F1 = ["title", "aria-label"], H1 = { class: "run-chip-in" }, U1 = {
  key: 0,
  class: "run-chip-ring"
}, V1 = { class: "run-chip-name" }, z1 = { class: "run-chip-bar" }, G1 = "processes.output", K1 = 3e3, Y1 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var g;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((g = Ne(Pe, null)) == null ? void 0 : g.environment) ?? "", o = W(null), r = T(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = T(() => {
      var k, E;
      return ((k = o.value) == null ? void 0 : k.title) || ((E = o.value) == null ? void 0 : E.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = T(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const k = await Et(G1, ["process", "card", String(s.item.target_id)], a);
      k.ok && (o.value = k.value);
    }
    const f = setInterval(() => r.value && u(), K1);
    return Se(() => clearInterval(f)), u(), (k, E) => {
      var B;
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ke({ "--tone": c.value })
      }, [
        p("span", H1, [
          r.value ? (l(), d("span", U1)) : (l(), K(Ve, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", V1, w(i.value), 1)
        ]),
        p("span", z1, [
          p("i", {
            style: ke({ width: r.value ? `${((B = o.value) == null ? void 0 : B.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, F1);
    };
  }
}, J1 = /* @__PURE__ */ Z(Y1, [["__scopeId", "data-v-10c2365f"]]), Z1 = 24, X1 = 8, Nv = 420;
function jv({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= Z1 && e > t ? !0 : e < t && a > X1 ? !1 : null;
}
const Q1 = (e, t) => e === void 0 ? t : e, ep = 6, tp = 3, la = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, wo = (e) => !!(e.leaves_at && !e.kept), np = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wo(e) || t < e.leaves_at || n.has(e.id)), sp = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => np(s, t, n)).sort((s, a) => s.id - a.id);
function ap(e, t, n = ep) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const op = (e, t) => e >= tp ? !0 : e <= 1 ? !1 : t, rp = { class: "dock-stack" }, ip = ["onMouseenter", "onMouseleave"], lp = {
  key: 0,
  class: "dock-runs-head"
}, cp = ["onMouseenter", "onMouseleave"], up = { class: "dock-runs-chips" }, dp = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = W(Date.now() / 1e3), s = W(/* @__PURE__ */ new Set()), a = W(!1), o = W(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Se(() => clearInterval(r));
    const i = T(() => sp(t.items, n.value, s.value)), c = T(() => ap(i.value.filter((D) => la(D, ls)), n.value)), u = T(() => i.value.filter((D) => !c.value.includes(D) && !la(D, ls))), f = T(() => (a.value = op(c.value.length, a.value)) && !o.value), g = W({}), k = (D) => Q1(g.value[D.id], t.folded);
    function E(D) {
      g.value = { ...g.value, [D.id]: !k(D) };
    }
    function B(D) {
      g.value = { ...g.value, ...Object.fromEntries(c.value.map((U) => [U.id, U.id !== D.id])) }, o.value = !0;
    }
    function L() {
      g.value = Object.fromEntries(Object.entries(g.value).filter(([D]) => !c.value.some((U) => String(U.id) === D))), o.value = !1;
    }
    function y(D) {
      s.value = /* @__PURE__ */ new Set([...s.value, D.id]);
    }
    function x(D) {
      s.value = new Set([...s.value].filter((U) => U !== D.id));
    }
    return (D, U) => (l(), d("div", rp, [
      (l(!0), d(X, null, re(u.value, ($) => (l(), d("div", {
        key: $.id,
        onMouseenter: (m) => y($),
        onMouseleave: (m) => x($)
      }, [
        H(ia, {
          item: $,
          leaving: G(wo)($) && !s.value.has($.id),
          folded: k($),
          onFold: (m) => E($)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, ip))), 128)),
      a.value && o.value ? (l(), d("div", lp, [
        p("button", {
          type: "button",
          class: "dock-runs-toggle",
          "aria-expanded": "true",
          title: "Fold the runs into one line",
          "data-dock-runs-fold": "",
          onClick: L
        }, [
          he(w(c.value.length) + " runs ", 1),
          H(Tt, { open: "" })
        ])
      ])) : P("", !0),
      (l(!0), d(X, null, re(f.value ? [] : c.value, ($) => (l(), d("div", {
        key: $.id,
        onMouseenter: (m) => y($),
        onMouseleave: (m) => x($)
      }, [
        H(ia, {
          item: $,
          folded: k($),
          onFold: (m) => E($)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, cp))), 128)),
      f.value ? (l(), K(vo, {
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
            onClick: U[0] || (U[0] = ($) => o.value = !0)
          }, [
            H(Ve, { name: "runs" }),
            he(" " + w(c.value.length) + " runs ", 1),
            H(Tt)
          ]),
          p("span", up, [
            (l(!0), d(X, null, re(c.value, ($) => (l(), K(J1, {
              key: $.id,
              item: $,
              onClick: (m) => B($)
            }, null, 8, ["item", "onClick"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["label"])) : P("", !0)
    ]));
  }
}, Pv = /* @__PURE__ */ Z(dp, [["__scopeId", "data-v-05bde3f3"]]), St = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Yt = (e) => Math.min(Math.max(e, 0), 1), hp = (e) => {
  const t = Yt(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => hp((e - t) / (n - t));
function qv(e) {
  const t = Yt(e), n = Yt((t - 0.12) / 0.76) * St.shuffles, s = Math.min(Math.floor(n), St.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), r = et(a, 0.38, 0.76), i = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), c = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), u = Math.sin(Math.PI * Yt((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / St.shuffles, lift: St.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const ko = 2400, fp = 0.05;
function Wv({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, fp), r = Math.min(t + ko * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
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
}, cs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), pp = (e) => e * e * (3 - 2 * e), rn = (e, [t, n]) => pp(cs(e, t, n)), mp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Ut = ([e, t], n) => e + n() * (t - e);
function gp(e) {
  return mp.map(() => {
    const t = Ut(Ye.speed, e), n = Ut(Ye.angle, e) * Math.PI / 180, s = Ut(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Ut(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const vp = gp(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function yp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function Fv(e, t, n = vp) {
  const s = Ze.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = yp(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const c = Math.min(a, r), u = s.from.map((f, g) => f + o.velocity[g] * c);
  return u[2] -= Ye.gravity * c * c / 2, { at: u, turn: o.spin * c, landed: Math.max(0, a - r) / i };
}
function Hv(e, t) {
  const n = e.map((o) => Math.sqrt(o)), s = n.reduce((o, r) => o + r, 0);
  let a = Math.min(Math.max(t, 0), 1) * s;
  for (const [o, r] of n.entries()) {
    if (a <= r || o === n.length - 1) {
      const i = r > 0 ? Math.min(a / r, 1) : 1;
      return { index: o, s: i, height: e[o] * 4 * i * (1 - i) };
    }
    a -= r;
  }
  return { index: 0, s: 1, height: 0 };
}
const Uv = () => Array.from({ length: Ze.pogo.count }, (e, t) => Ze.pogo.bounce * (t + 1) / Ze.pogo.count), Vv = { stride: 0.5 };
function bo(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: cs(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: cs(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function zv(e) {
  const { into: t, out: n } = bo(Ze.rope_swing, e);
  return 1 - rn(t, [0, 1]) * (1 - rn(n, [0, 1]));
}
function Gv(e) {
  const t = Ze.rope_swing, { into: n, out: s } = bo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return rn(n, [0, 1]) * (1 - rn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const wp = { after: 3 }, kp = 10, bp = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, $p = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, xp = { weight: 19 }, Mp = {
  build: { cooldown: 180 }
}, _p = { every: 120 }, $o = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, xo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Sp = {
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
}, Dt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: kp }), ee = (e, t, n = {}) => Dt(e, "clip", t, n), In = (e, t, n = {}) => Dt(e, "look", t, n), ca = (e, t, n = {}) => Dt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Dt(e, "pick", t, n), ...s }), pe = (e) => Dt("nothing", "nothing", e, {}), Ep = 120, Ap = 300, Rn = (e, t) => ({ ...ee(e, t), cooldown: Ap }), Cp = 120, te = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Op = () => [ee("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...ee(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: bp[e.name] }), _t = (e) => ({ ...e, shenanigan: !0, lasts: $p[e.name] }), Ms = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...te("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ee("nod", 2), pe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...te("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...nt(ee("bug_shot", 3)), toward: "", onto: !1 },
    { ...nt(ee("bug_smash", 2)), toward: "", onto: !1 },
    ee("nod", 2)
  ]),
  ...te("tests_failed", { cooldown: 20, toward: "card" }, [ee("startled", 2), ee("dismay", 1), ee("tantrum", 3), pe(1)]),
  ...te("committed", { cooldown: 30, toward: "card", onto: !0 }, [ee("nod", 2), pe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...te("sin_fixed", { cooldown: 300 }, [ee("halo", 1), pe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...te("sin_committed", { cooldown: 300 }, [ee("repent", 1), pe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...te("messaged", { cooldown: Cp }, [ee("phone_call", 1)]),
  ...te("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ee("nod", 4), ee("hand_rub", 4), pe(7)]),
  ...te("question_asked", { cooldown: 60 }, [ee("ask_sign", 9), ee("look_up", 3), pe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...te("reported", { cooldown: 90 }, [ca("read", 3), ee("nod", 1), pe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...te("read_message", { cooldown: 30 }, [ca("read", 3), pe(1)]),
  ...te("fact_filed", { cooldown: 120 }, [ee("file_card", 3), ee("nod", 1), pe(6)]),
  ...te("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ee("nod", 2), pe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...te("bar_done", { holds: !0 }, Op()),
  ...te("bar_failed", { holds: !0 }, [ee("fume", 1), ee("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...te("standing", { cooldown: 12 }, [ee("look_left", 2), ee("look_right", 2), ee("look_up", 1), pe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...te("launched", { cooldown: 300 }, [ee("tumble", 3), pe(47)]),
  // a break from the hammering now and then
  ...te("building", { cooldown: 30 }, [ee("wipe_brow", 4), ee("look_left", 1), ee("look_right", 1), pe(69)]),
  ...te("failed", { cooldown: 20, toward: "card" }, [ee("shake", 3), ee("tantrum", 2), pe(2)]),
  ...te("refused", { cooldown: 20 }, [ee("shake", 1), pe(1)]),
  ...te("work_done", { cooldown: 120 }, [ee("stretch", 2), pe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...te("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...te("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...te("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...te("answered", { cooldown: 15 }, [In("amused", 3), pe(2)]),
  ...te("heard", { cooldown: 30 }, [
    ee("bow", 1, { voices: ["butler"] }),
    ee("salute", 1, { voices: ["squire"] }),
    ee("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    pe(1)
  ]),
  ...te("long_walk", { cooldown: 90 }, [ee("stumble", 3), pe(22)]),
  ...te("card_arrived", { cooldown: 20, toward: "card" }, [ee("glance", 7), pe(13)]),
  ...te("typing", { cooldown: 60 }, [In("reading", 1), pe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Sp).flatMap(([e, t]) => te(`reacted:${e}`, {}, [In(t, 1)])),
  ...Object.entries($o).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => te(`agent_reacted:${n}`, {}, [ee(s, 1, { voices: [e] })])[0])),
  ...Object.entries(xo).flatMap(([e, t]) => te(`agent_reacted:${e}`, {}, [ee(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...te("pastime", {}, [
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
    { ..._t(nt(ee("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    _t(nt(ee("disco", 2, { ball: "bubble" }))),
    pe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...te("held:search", { cooldown: Ep }, [Rn("search", 3), { ...Rn("binoculars", 2), when: { home: !0 } }, { ...Rn("glass_bubble", 2), when: { bubble: !0 } }]),
  ...te("held:type", {}, [ee("type", 3), ee("type_ponder", 1)]),
  ...te("held:watch", {}, [ee("watch", 2), ee("wave_up", 1)]),
  ...te("held:compacting", {}, [ee("pack_box", 3), ee("vacuum", 2), ee("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...te("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), pe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...te("tickled", {}, [{ ...nt(ee("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...te("eager", {}, [ee("eager", 2, { slow: !0 }), pe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...te("jump", {}, [_t(nt(ee("backflip", 7, { high: !0 }))), ee("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...te("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...te("unit", { cooldown: Mp.build.cooldown }, [ce("unit", xp.weight), pe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...te("progress_jump", { cooldown: 6 }, [ee("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...te("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...te("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...te("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: _p.every }, ce("stand", 5)]),
  // a digit a blow's dust lets out
  ...te("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...te("roam", {}, [
    ce("rest", 35, {}, { stay: [25, 60] }),
    ce("seat", 15, {}, { stay: [15, 40] }),
    ce("edge", 25, {}, { stay: [8, 20] }),
    _t(ce("bubble", 15, {}, { stay: [30, 80] })),
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
    _t(nt(ce("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], Tp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Mo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Bp = (e) => Array.isArray(e) ? e[0] : e, Ip = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Rp(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || Mo(f).every(([g, k]) => n(g) >= Bp(k)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Ms.filter((f) => Tp(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= wp.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = i.filter((f) => {
    var g;
    return f.kind === "nothing" || f.name !== ((g = e.tally) == null ? void 0 : g.last);
  });
  return c.some((f) => f.kind !== "nothing") ? c : i;
}
function Lp(e, t) {
  const n = Rp(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (_o(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function _o(e, t, n) {
  var s;
  for (const [a, o] of Mo(t)) (s = e.memory) == null || s.set(a, e.now + Ip(o, n));
}
function Kv(e, t, n) {
  _o(e, Ms.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const ua = {
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
}, Yv = {
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
}, Jv = 120, Zv = (e) => ua[e] || ua.idle;
[.../* @__PURE__ */ new Set([...Object.values($o).flatMap((e) => Object.keys(e)), ...Object.keys(xo)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function Xv(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Te.ahead * n ? 180 : Math.sign(s) * Te.turn;
}
const da = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Qv(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Te.sweep) % a, i = o % Te.sweep, c = Te.sweep - Te.returnSeconds, u = da((i - c) / Te.returnSeconds), f = i <= c ? da(i / c) : 1 - u, g = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + g * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Dp = 1, Np = (e, t, n, s, a, o = 0) => Lp({ moment: "jump", high: e > Dp * t, memory: s, now: a, room: o }, n).name === "backflip", ha = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, ey = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, ty = { width: 24, height: 27, top: 3, units: 2 }, jp = "[data-figure-pile]", ny = { amber: [1, 0.69, 0.125], good: ha.colours.good, bad: ha.colours.bad }, Ln = { phases: 4, dim: 0.25 }, sy = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, Pp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Ms.filter((e) => Pp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const ay = {
  width: 84,
  belly: 13,
  blink: 4
}, fa = "[data-figure-home]", Nt = () => {
  var t;
  const e = document.querySelector(fa);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(fa)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, qp = "[data-figure-docked-bars]", Wp = "[data-figure-chat-foot]", Fp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Hp = "[data-figure-newest]";
function Up() {
  var s, a;
  const e = (s = Nt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Hp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !_s(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function So(e, t, n = Up()) {
  if (!e || !n) return !0;
  const s = kt(e, t), a = Ss(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = St.gap;
  return !Co(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const Dn = 0.26, Vp = 0.54, bn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Dn, travels: "stand" },
  lounge: { drop: Dn, travels: "stand" },
  composed: { drop: Dn, travels: "stand" },
  hang: { drop: Vp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Eo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), zp = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), oy = (e, t) => (e === "sit" ? zp.has(t) : Eo.has(e)) ? e : "stand", ry = 0.25, iy = (e, t) => Eo.has(e) && bn[t].drop === 0, Ao = 2, Gp = 90, Kp = 180, Yp = 140, Jp = 280, Zp = 420, Xp = 0.25, Qp = 290, em = 600, tm = "cubic-bezier(0.2, 0.7, 0.4, 1)", nm = "cubic-bezier(0.55, 0, 0.9, 0.6)", Nn = 5;
function ln(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: f = 0, room: g = 0, pogo: k = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Nn) return null;
  (r || i) && (o = Math.max(o, Ao));
  const E = o > 1, B = Math.abs(t.x - e.x), L = B < Nn ? 0 : B / (Gp * o) * 1e3, y = Math.min(L, E ? Yp : Kp), x = Math.abs(t.y - e.y), D = t.y < e.y, U = D && !k && Np(x, n, c, u, f, g), $ = D ? Zp + Math.min(x, 400) * Xp : Math.sqrt(2 * x / ko) * 1e3, m = {
    x: t.x,
    y: t.y,
    ms: x > Nn ? U ? em : $ : 0,
    lead: U ? Qp : D ? Jp : 0,
    easing: D ? tm : nm,
    hopping: !0,
    clip: U ? "backflip" : D ? "jump" : "fall"
  }, N = { x: t.x, y: t.y, ms: L + y, lead: 0, easing: "linear", ramp: y, ...E ? { clip: "run" } : {} }, O = k ? sm(t, n) : m, q = D && !s ? [{ ...N, y: e.y }, O] : [{ ...m, x: e.x }, N];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !a, pace: o, running: E };
}
const sm = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), kt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - bn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Co = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, _s = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function bt() {
  var t;
  const e = (t = Nt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Vt = 0.5, pa = 20;
function ly(e, t, n = bt()) {
  const s = kt(e, t);
  return s.left >= n.left + pa && s.right <= n.right - pa;
}
function Oo(e, t, n = bt()) {
  const s = kt(e, t), a = s.right - s.left, o = Ss(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Vt && i <= n.right + Vt && s.top >= n.top - Vt && c <= n.bottom + Vt;
}
const cn = [0.35, 0.5, 0.65], un = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: cn[0], right: cn.at(-1), top: un[0], bottom: un.at(-1) }, am = 0.24;
function Ss(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + am * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function om(e, { size: t }, n = bt()) {
  const s = Ss(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const rm = (Je.right - Je.left) / 2 + 0.08;
function im(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !_s(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const c of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[c].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, c), u.setEnd(o, c + 1), [...u.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const lm = (e) => un.flatMap(
  (t) => cn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function cm(e, t, n = "") {
  if (!So(e, t)) return cn.length * un.length;
  const s = kt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Fp)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && Co(a, c) && _s(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return lm(a).filter(([i, c]) => r(i, c) || im(i, c, n)).length;
}
function um(e, t, n) {
  const s = bt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Oo(r, t, s) && So(r, t)).map((r) => ({ spot: r, covered: cm(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const To = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, dm = rm, hm = (e, t, { size: n }, s = dm) => fm(e, To[t], s * n, "stand");
function fm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const cy = (e) => ((e + 180) % 360 + 360) % 360 - 180, uy = { turns: [-20, -10, 0, 10, 20] }, pm = 7;
function mm() {
  const e = [...document.querySelectorAll(jp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const gm = 4;
function vm() {
  const e = Bo(), t = mm(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > gm || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - pm - n, 0) } };
}
const dy = ({ size: e, below: t }) => (1 - t) * e;
function ym(e, t) {
  const n = bt(), { size: s, below: a } = t, o = bn[e.posture].drop * s;
  return { ...om(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const wm = (e, t) => Object.keys(To).map((n) => ym(hm(e, n, t), t)), km = (e, t, n) => um(e, t, n) ?? e[0];
function hy(e, t) {
  const { element: n, edge: s } = vm();
  return { ...km(wm(s, e), e, t), view: null, on: n };
}
function Bo() {
  var s;
  const e = Nt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(qp);
  if (!t) return { ...Io(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Io() {
  const e = Nt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const bm = { climb: 90 };
function fy(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: f = 0, room: g = 0, pogo: k = !1 } = {}) {
  (o || r) && (a = Math.max(a, Ao));
  const E = (U) => {
    const $ = kt(U, n, bn[U.posture].travels);
    return { x: $.left, y: $.top };
  }, B = t.ladder ?? e.ladder;
  if (B && !(t.ladder && e.ladder)) return $m(E(e), E(t), E({ ...B.foot, posture: "stand" }), B.way, !!t.ladder, n, a);
  const [L, ...y] = [e, ...c, t].map(E), x = ln(L, y[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: f, room: g, pogo: k }), D = y.slice(1).map((U, $) => {
    var m;
    return (m = ln(y[$], U, n.size, { random: i, memory: u, now: f, room: g })) == null ? void 0 : m.legs.find((N) => N.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...D.filter(Boolean)] };
}
function $m(e, t, n, s, a, o, r) {
  const i = (f, g) => ({ x: g.x, y: g.y, ms: Math.hypot(g.x - f.x, g.y - f.y) / bm.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? ln(e, n, o.size, { pace: r }) : ln(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const xm = "[data-figure-bubble]", Mm = 250;
let At = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ro = 0;
const Lo = () => At, jn = /* @__PURE__ */ new WeakMap();
let _m = 0;
function Do(e) {
  return jn.has(e) || jn.set(e, `floor-${++_m}`), jn.get(e);
}
const Sm = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Em = () => {
  var e, t;
  return ((t = (e = Nt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Am(e, t) {
  var s;
  const n = (s = e.querySelector(Wp)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Cm(e, t) {
  const n = e && Am(e, t), s = e ? [...e.querySelectorAll(xm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Sm(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Do(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Om = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Mm ? (t.top - s.top) / a * 1e3 : 0;
};
function Tm(e = At, t = performance.now()) {
  const n = bt(), s = Em(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = Bo(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = Io();
  return u.element && c.push({ id: Do(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...Cm(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((f) => Object.freeze({ ...f, vy: Om(e, f, t) }))) });
}
const us = /* @__PURE__ */ new Set();
function Bm(e) {
  return us.add(e), () => us.delete(e);
}
function Im() {
  No();
  const e = () => {
    Ro = requestAnimationFrame(e), !document.hidden && (At = Tm(At), us.forEach((t) => t(At)));
  };
  e();
}
function No() {
  cancelAnimationFrame(Ro);
}
const Rm = (e, t) => e.find((n) => n.id === t) ?? null;
function py(e, t, n = Lo().floors) {
  const s = Rm(n, "home");
  return e.posture === "hang" && s && kt(e, t).bottom >= s.top ? !1 : Oo(e, t);
}
const Lm = ["data-kind"], Dm = { class: "figure-floor-name" }, Nm = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: ke({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", Dm, w(e.floor.kind), 1)
    ], 12, Lm));
  }
}, jm = /* @__PURE__ */ Z(Nm, [["__scopeId", "data-v-8f6132da"]]), Pm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, qm = {
  __name: "FigureFloors",
  setup(e) {
    const t = hn(Lo().floors);
    let n = () => {
    };
    return Le(() => {
      n = Bm((s) => t.value = s.floors), Im();
    }), Se(() => {
      n(), No();
    }), (s, a) => (l(), d("div", Pm, [
      (l(!0), d(X, null, re(t.value, (o) => (l(), K(jm, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, my = /* @__PURE__ */ Z(qm, [["__scopeId", "data-v-e519168b"]]), Pn = (e) => typeof e == "number" ? e : Date.parse(e);
function gy(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Pn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Pn(a.row.created_at) - Pn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Wm = 3, qn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Fm(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = qn[n.grouping]) == null ? void 0 : s.call(qn, e.row, n)) || "";
}
function Hm(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function vy(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Wm ? [Hm(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = Fm(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Um = 1e3;
function yy() {
  const e = W(Date.now()), t = setInterval(() => e.value = Date.now(), Um);
  return vt(() => clearInterval(t)), e;
}
function wy(e) {
  const t = ms(), n = W(null), s = W("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const Vm = {
  class: "cards-page",
  "data-window-flush": ""
}, zm = { class: "cards-bar" }, Gm = { class: "cards-count" }, Km = { class: "cards" }, Ym = {
  key: 1,
  class: "cards-note"
}, Jm = {
  key: 2,
  class: "cards-note"
}, Zm = ["data-row", "onClick"], Xm = { class: "card-head" }, Qm = { class: "card-age" }, eg = { class: "card-title" }, tg = { class: "card-foot" }, ng = {
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
    return (s, a) => (l(), d("div", Vm, [
      p("div", zm, [
        p("span", Gm, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        H(ye, at({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: V(() => [
            H(Me, {
              name: "plus",
              size: 12
            }),
            he(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", Km, [
        e.loaded ? e.failure ? (l(), d("p", Ym, w(e.failure), 1)) : e.rows.length ? P("", !0) : (l(), d("p", Jm, "No " + w(e.noun) + "s yet", 1)) : (l(), K(yt, {
          key: 0,
          shape: "cards"
        })),
        (l(!0), d(X, null, re(e.rows, (o) => (l(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          p("span", Xm, [
            H(Me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            he(" " + w(e.head(o)), 1),
            p("span", Qm, w(G(Yn)(o.created_at)), 1)
          ]),
          p("span", eg, w(e.title(o)), 1),
          p("span", tg, w(e.foot(o)), 1)
        ], 8, Zm))), 128))
      ]),
      we(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ky = /* @__PURE__ */ Z(ng, [["__scopeId", "data-v-d72d528d"]]), ma = "newest";
function by(e, { title: t, isOpen: n = null }) {
  const s = W(""), a = W(ma), o = W("all"), r = T(() => {
    const i = s.value.trim().toLowerCase(), c = e.value.filter((u) => (!i || JSON.stringify(u).toLowerCase().includes(i)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === ma ? c : [...c].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: r, hasStates: !!n };
}
const sg = {
  class: "list-tools",
  "data-list-tools": ""
}, ag = {
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
    return (s, a) => (l(), d("div", sg, [
      H(Oh, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      H(as, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (l(), K(as, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : P("", !0)
    ]));
  }
}, $y = /* @__PURE__ */ Z(ag, [["__scopeId", "data-v-b2dd0a0d"]]);
function xy() {
  const e = W(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const og = 86400, ds = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function rg(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ds(t) - ds(e)) / og);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function My(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ds(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: rg(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Wn = 280, Fn = 240, Hn = 120, ig = 6, lg = 14, Bt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function cg(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${lg}px)` }), e.offsetHeight, e.style.transition = `height ${Wn}ms ${Bt}`, e.style.height = `${r}px`;
  const i = a();
  let c = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - i;
    if (!c && f >= Wn && (c = !0, e.style.transition = `opacity ${Fn}ms ease-out, transform ${Fn}ms ${Bt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Wn + Fn) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function _y(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${ig}px)` }), e.offsetHeight, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${Bt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - r < Hn) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const ug = 140, zt = 220, dg = 5;
function Sy({ gap: e = ug, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, dg);
    if (s = i.length > 0, !s) return;
    let c = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), c -= 1, c || t(o, e);
      });
  }
  const r = (i, c, u, f = cg) => {
    if (!c.pane || !c.follows()) return u();
    const g = { el: i, options: c, done: u, arrival: f, display: i.style.display || "" };
    if (!s)
      return s = !0, f(i, c, () => a(g));
    i.style.display = "none", n.push(g);
  };
  return r.flush = () => {
    for (const i of n.splice(0))
      i.el.style.display = i.display, i.done();
  }, r;
}
function Ey(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${zt}ms ${Bt}, opacity ${zt}ms ease-in, margin ${zt}ms ${Bt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, zt);
}
const jo = "chat.pins.minimised", Jt = W(Ct(jo, !1));
function ga(e) {
  Jt.value = e, pn(jo, e);
}
function hg(e) {
  const t = T(() => e()), n = T(() => Jt.value ? [] : e()), s = () => ga(!Jt.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => Ta(o) > a).length,
    (o, r) => o > r && ga(!1)
  ), { pins: t, visible: n, minimised: Jt, toggle: s };
}
const fg = ["title"], pg = {
  key: 0,
  class: "pins-count"
}, mg = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = hg(() => t.notices);
    return (o, r) => G(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: Q(["pins-toggle", { minimised: G(s), inline: e.inline }]),
      title: G(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = _e((...i) => G(a) && G(a)(...i), ["stop"]))
    }, [
      H(Me, {
        name: G(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      G(s) ? (l(), d("span", pg, w(G(n).length), 1)) : P("", !0)
    ], 10, fg)) : P("", !0);
  }
}, Ay = /* @__PURE__ */ Z(mg, [["__scopeId", "data-v-c0d11526"]]), gg = ["title"], vg = ["title"], yg = { class: "diff-card-dir" }, wg = { class: "diff-card-name" }, kg = { class: "diff-card-ago" }, bg = ["title"], $g = ["title"], xg = {
  key: 0,
  class: "diff-card-note"
}, Mg = ["href"], _g = ["src", "alt"], Sg = { class: "diff-card-rows" }, Eg = { class: "diff-row-num" }, Ag = { class: "diff-row-sign" }, Cg = { class: "diff-row-code" }, Og = {
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
    function o(S) {
      (S.metaKey || S.ctrlKey) && (S.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = T(() => n.path.lastIndexOf("/") + 1), u = T(() => n.path.slice(0, c.value)), f = T(() => n.path.slice(c.value)), g = T(() => n.kind === "deleted"), k = T(() => r[n.kind]), E = T(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), B = W("after"), L = T(() => B.value === "before" ? n.whole.old : n.whole.text), y = T(() => n.whole && n.whole.text !== void 0 ? L.value.split(`
`).map((S, v) => ({ line_type: B.value === "after" && E.value.has(v + 1) ? "add" : "ctx", line: v + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), x = W(!1), D = T(() => n.lines && !x.value && !n.whole), U = T(() => D.value ? y.value.slice(0, n.lines) : y.value), $ = T(() => y.value.length - U.value.length), m = (S) => S.line === null || S.line_type === "del" ? "" : S.line, N = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, O = W(null), q = W(null);
    let M = null;
    return Le(() => {
      if (!q.value) return;
      let S = !0;
      M = new ResizeObserver(() => {
        !O.value || !q.value || (O.value.style.transition = S ? "none" : "", O.value.style.height = `${q.value.offsetHeight}px`, S = !1);
      }), M.observe(q.value);
    }), Se(() => M && M.disconnect()), (S, v) => (l(), d("section", {
      class: Q(["diff-card", { half: e.half, gone: g.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: g.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: v[2] || (v[2] = (h) => !g.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${G(a)}-click to open it`,
          onClick: o
        }, [
          p("span", yg, w(u.value), 1),
          p("span", wg, w(f.value), 1),
          k.value ? (l(), d("span", {
            key: 0,
            class: Q(["diff-card-badge", e.kind])
          }, w(k.value), 3)) : P("", !0)
        ], 8, vg),
        p("span", {
          class: Q(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        p("span", {
          class: Q(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
        p("span", kg, w(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: B.value === "after" ? "Show the file before" : "Show the file after",
          onClick: v[0] || (v[0] = _e((h) => B.value = B.value === "after" ? "before" : "after", ["stop"]))
        }, w(B.value === "after" ? "After" : "Before"), 9, bg)) : P("", !0),
        g.value ? P("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: Q(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: v[1] || (v[1] = _e((h) => s("whole"), ["stop"]))
        }, [
          H(Me, {
            name: "file",
            size: 12
          })
        ], 10, $g))
      ], 8, gg),
      e.whole && e.whole.error ? (l(), d("p", xg, w(e.whole.error), 1)) : P("", !0),
      !g.value && !e.folded ? (l(), d(X, { key: 1 }, [
        e.picture ? (l(), d("a", {
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
          }, null, 8, _g)
        ], 8, Mg)) : (l(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: O,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            p("div", Sg, [
              (l(!0), d(X, null, re(U.value, (h, C) => (l(), d("div", {
                key: C,
                class: Q(["diff-row", h.line_type, { fresh: e.fresh && h.edit === e.fresh }])
              }, [
                p("span", Eg, w(m(h)), 1),
                p("span", Ag, w(i[h.line_type]), 1),
                p("span", Cg, w(N(h)), 1)
              ], 2))), 128)),
              $.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: v[3] || (v[3] = _e((h) => x.value = !0, ["stop"]))
              }, w($.value) + " more " + w($.value === 1 ? "line" : "lines"), 1)) : P("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : P("", !0)
    ], 2));
  }
}, Cy = /* @__PURE__ */ Z(Og, [["__scopeId", "data-v-b6424f6e"]]), Tg = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Bg = {
  key: 1,
  class: "menu-item-text"
}, Ig = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: Q(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), d("span", Tg, w(e.checked ? "✓" : ""), 1)) : P("", !0),
      e.description ? (l(), d("span", Bg, [
        p("span", null, [
          we(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, w(e.description), 1)
      ])) : we(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Rg = /* @__PURE__ */ Z(Ig, [["__scopeId", "data-v-c91b190e"]]), Lg = {}, Dg = { class: "menu-label" };
function Ng(e, t) {
  return l(), d("span", Dg, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const jg = /* @__PURE__ */ Z(Lg, [["render", Ng], ["__scopeId", "data-v-aa955b3e"]]), Po = /* @__PURE__ */ new WeakMap(), Pg = (e, t) => Po.set(e, t);
function qg(e, t) {
  for (let n = t; n; n = Po.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Wg(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !qg(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Se(() => window.removeEventListener("click", n));
}
const ut = 8, Fg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = W(null), o = (h) => h ? `${h}px` : void 0, r = T(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = W({ w: 0, h: 0 }), c = W(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), g = (h) => {
      const C = h.closest(".pane, .float-window");
      return C ? f(C.getBoundingClientRect()) : u();
    }, k = (h, C) => `${Math.max(0, h ? Math.min(h, C) : C)}px`;
    function E(h, C) {
      return {
        below: h.bottom - C.bottom - s.gap - ut,
        above: C.top - h.top - s.gap - ut,
        across: h.right - h.left - 2 * ut
      };
    }
    function B(h) {
      const C = g(s.anchor), b = E(C, h);
      return i.value.w <= b.across && i.value.h <= Math.max(b.below, b.above) ? C : u();
    }
    const L = T(() => {
      if (!c.value) return r.value;
      const h = c.value, C = B(h), b = E(C, h), { w: A, h: z } = i.value, oe = s.align === "auto" ? h.left + h.right > C.left + C.right : s.align === "right", de = wi(oe ? h.right - A : h.left, C.left + ut, Math.max(C.left + ut, C.right - A - ut)), me = z > b.below && b.above > b.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: k(s.maxHeight, b.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: k(s.maxHeight, b.below) };
      return { ...r.value, ...me, left: `${de}px`, maxWidth: k(s.maxWidth, b.across) };
    }), y = n, x = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function D(h) {
      const C = x(), b = C.indexOf(document.activeElement);
      C[(b + h + C.length) % C.length].focus();
    }
    const U = { ArrowDown: () => D(1), ArrowUp: () => D(-1), Escape: () => y("close") }, $ = (h) => U[h.key] && (h.preventDefault(), U[h.key]()), m = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let N = 0;
    const O = new ResizeObserver(() => {
      cancelAnimationFrame(N), N = requestAnimationFrame(m);
    });
    Wg(a, (h) => s.anchor && !s.anchor.contains(h.target) && y("close"));
    const q = (h, C) => ["top", "left", "right", "bottom"].some((b) => Math.abs(h[b] - C[b]) > 1), M = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let S = 0;
    function v() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || M(h)) return y("close");
        q(h, c.value) && (c.value = h);
      }
      S = requestAnimationFrame(v);
    }
    return Le(() => {
      s.anchor && a.value && Pg(a.value, s.anchor), m(), a.value && O.observe(a.value), !s.plain && x()[0] && x()[0].focus(), v();
    }), Se(() => {
      O.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(N);
    }), t({ element: a }), (h, C) => (l(), K(wa, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", at({
        ref_key: "panel",
        ref: a
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: L.value,
        onKeydown: $
      }), [
        we(h.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Hg = /* @__PURE__ */ Z(Fg, [["__scopeId", "data-v-3d203970"]]), Ug = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), K(ye, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: V(() => [
        H(Me, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Vg = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [{ word: "approve", label: "Approve", main: !0 }, He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, zg = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Gg = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Kg = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], Yg = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Jg = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Zg = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], Xg = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? Zg(t) : e === "agent" ? [...Yg(t), ...Kg(t)] : e === "check" ? Jg(t) : e === "question" ? Gg(t) : ((n = { plan: Vg, task: zg }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, Qg = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, e0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, t0 = { class: "ask-text" }, n0 = ["placeholder", "aria-label"], s0 = ["placeholder", "aria-label"], a0 = {
  key: 3,
  class: "moves"
}, o0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = T(() => Xg(s.kind, s.row)), r = W(""), i = W(null), c = W(""), u = W("");
    be(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function f(E, B = "") {
      const L = await s.read([E.noun ?? s.kind, E.word, String(s.id), ...E.flag ? [E.flag, B] : E.positional ? [B] : [], ...E.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = L.ok ? "" : L.error, L.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const g = (E) => E.confirm ? i.value = E : E.said ? f(E, E.said) : E.flag || E.positional ? (i.value = E, c.value = "") : f(E), k = () => c.value.trim() && f(i.value, c.value.trim());
    return t({ moves: o, press: g }), (E, B) => {
      var L;
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: Q(["foot", { inline: e.inline }])
      }, [
        r.value ? (l(), d("p", Qg, w(r.value), 1)) : P("", !0),
        (L = i.value) != null && L.confirm ? (l(), d("div", e0, [
          p("span", t0, w(i.value.confirm), 1),
          H(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: B[0] || (B[0] = (y) => f(i.value))
          }, {
            default: V(() => [
              he(w(i.value.label), 1)
            ]),
            _: 1
          }),
          H(ye, {
            small: "",
            kind: "ghost",
            onClick: B[1] || (B[1] = (y) => i.value = null)
          }, {
            default: V(() => [...B[7] || (B[7] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (l(), d("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: _e(k, ["prevent"])
        }, [
          mt(p("input", {
            "onUpdate:modelValue": B[2] || (B[2] = (y) => c.value = y),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: B[3] || (B[3] = Zt(_e((y) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, n0), [
            [Gn, c.value]
          ]),
          i.value.opener ? mt((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": B[4] || (B[4] = (y) => u.value = y),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: B[5] || (B[5] = Zt(_e((y) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, s0)), [
            [Gn, u.value]
          ]) : P("", !0),
          H(ye, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: V(() => [
              he(w(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          H(ye, {
            small: "",
            kind: "ghost",
            onClick: B[6] || (B[6] = (y) => i.value = null)
          }, {
            default: V(() => [...B[8] || (B[8] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", a0, [
          (l(!0), d(X, null, re(o.value, (y) => (l(), K(ye, {
            key: y.word,
            small: "",
            kind: y.main ? "primary" : "ghost",
            "data-move": y.word,
            onClick: (x) => g(y)
          }, {
            default: V(() => [
              he(w(y.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : P("", !0);
    };
  }
}, r0 = /* @__PURE__ */ Z(o0, [["__scopeId", "data-v-fffa0bf6"]]), i0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, l0 = { ...i0, done: "Completed" }, c0 = { class: "task-status-icon" }, u0 = ["width", "height", "aria-label"], d0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", c0, [
      H(dn, {
        name: "turn",
        mode: "out-in"
      }, {
        default: V(() => [
          (l(), d("svg", {
            key: e.status,
            class: Q(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": G(l0)[e.status]
          }, [
            H(ps, { value: e.status }, {
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
          ], 10, u0))
        ]),
        _: 1
      })
    ]));
  }
}, qo = /* @__PURE__ */ Z(d0, [["__scopeId", "data-v-2ab7e404"]]), h0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), f0 = (e) => h0.has(e), Wo = (e) => f0(e) ? "done" : e, p0 = { class: "facts" }, m0 = { class: "fact wide" }, g0 = { class: "fact-value" }, v0 = {
  key: 0,
  class: "fact"
}, y0 = { class: "fact-value" }, w0 = {
  key: 1,
  class: "fact"
}, k0 = { class: "fact-value" }, b0 = { class: "fact wide" }, $0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, x0 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = an.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return l(), d("div", p0, [
        p("div", m0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", g0, w((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", v0, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", y0, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : P("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", w0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", k0, "Agent " + w(e.task.holder_id), 1)
        ])) : P("", !0),
        p("div", b0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          H(as, {
            options: G(n),
            value: String(G(lo)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", $0, w(e.refusal), 1)) : P("", !0)
        ])
      ]);
    };
  }
}, M0 = /* @__PURE__ */ Z(x0, [["__scopeId", "data-v-2018762d"]]), _0 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, S0 = ["onClick"], E0 = { class: "wait-id" }, A0 = { class: "wait-title" }, C0 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, O0 = { class: "text" }, T0 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, B0 = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, I0 = 180, R0 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = W(!1);
    return (a, o) => (l(), d(X, null, [
      e.task.waits.length ? (l(), d("section", _0, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (l(!0), d(X, null, re(e.task.waits, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          H(qo, {
            status: G(Wo)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", E0, w(r.id), 1),
          p("span", A0, w(r.title), 1)
        ], 8, S0))), 128))
      ])) : P("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", C0, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", O0, w(e.task.outcome), 1)
      ])) : P("", !0),
      e.task.brief ? (l(), d("section", T0, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: Q(["text", { clamped: !s.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > I0 && !s.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : P("", !0)
      ])) : P("", !0),
      e.task.logs.length ? (l(), d("section", B0, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(X, null, re(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, w(r.line), 1))), 128))
      ])) : P("", !0)
    ], 64));
  }
}, L0 = /* @__PURE__ */ Z(R0, [["__scopeId", "data-v-f411ce35"]]), D0 = { class: "comment-side-head" }, N0 = {
  key: 0,
  class: "comment-none"
}, j0 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), d("aside", {
      class: Q(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", D0, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        H(gs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? P("", !0) : (l(), d("p", N0, "No comments yet")),
      (l(!0), d(X, null, re(e.comments, (s) => (l(), d("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, w(e.words(s)), 1))), 128))
    ], 2));
  }
}, P0 = /* @__PURE__ */ Z(j0, [["__scopeId", "data-v-19fdbdd4"]]), q0 = ["data-comments-below"], W0 = 600, F0 = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = W(null), n = W(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < W0);
    return Le(() => s.observe(t.value)), vt(() => s.disconnect()), (a, o) => (l(), d("div", {
      ref_key: "root",
      ref: t,
      class: Q(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      we(a.$slots, "default"),
      e.open ? (l(), K(P0, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : P("", !0)
    ], 10, q0));
  }
}, H0 = /* @__PURE__ */ Z(F0, [["__scopeId", "data-v-6c850df0"]]), U0 = ["placeholder"], V0 = { class: "actions" }, z0 = { class: "error" }, G0 = {
  key: 1,
  class: "card closed"
}, K0 = { class: "mark" }, Y0 = { class: "prompt" }, J0 = {
  key: 0,
  class: "draft"
}, Z0 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ zn({
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
  emits: /* @__PURE__ */ zn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Vn(e, "draft"), r = Vn(e, "error"), i = W(!!r.value), c = W(!1), u = W(!1), f = W(null);
    async function g() {
      var L, y;
      i.value = !0, c.value = !1, await fn(), (y = ((L = f.value) == null ? void 0 : L.querySelector("input")) || f.value) == null || y.focus();
    }
    function k() {
      i.value = !1, r.value = "";
    }
    function E(L) {
      L.shiftKey || L.isComposing || (L.preventDefault(), B());
    }
    async function B() {
      const L = o.value.trim();
      if (!(!L || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(L), i.value = !1, c.value = !0;
        } catch (y) {
          o.value = L, r.value = y.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: g }), (L, y) => (l(), d("div", {
      class: Q(["comment-bar", { open: i.value }])
    }, [
      i.value ? (l(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: _e(B, ["prevent"]),
        onKeydown: Zt(k, ["esc"])
      }, [
        we(L.$slots, "who", {}, void 0, !0),
        mt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Zt(E, ["enter"])
        }, null, 40, U0), [
          [Gn, o.value]
        ]),
        p("div", V0, [
          p("span", z0, w(r.value), 1),
          H(ye, {
            small: "",
            onClick: k
          }, {
            default: V(() => [...y[2] || (y[2] = [
              he("Cancel", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: B
          }, {
            default: V(() => [...y[3] || (y[3] = [
              he("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (l(), d("div", G0, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: g
        }, [
          p("span", K0, [
            H(Me, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", Y0, w(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", J0, "Draft kept")) : P("", !0)
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[1] || (y[1] = (x) => a("show"))
        }, [
          p("span", null, w(G(ki)(e.count, "comment")), 1),
          H(Me, {
            name: "down",
            size: 12
          })
        ])) : P("", !0)
      ]))
    ], 2));
  }
}, X0 = /* @__PURE__ */ Z(Z0, [["__scopeId", "data-v-79db0c2d"]]);
function Q0(e, t) {
  const n = W([]), s = W(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: f, id: g, title: k } = e(), E = `On ${f} ${g}, ${k}: `;
    return u.text.startsWith(E) ? u.text.slice(E.length) : u.text;
  };
  async function i() {
    const { kind: u, id: f } = e();
    if (!f) return;
    const g = ++o, k = await t([u, "comments", String(f)]);
    g === o && (n.value = k.ok ? k.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: f, id: g } = e(), k = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, k], s.value = !0;
    const E = await t([f, "comment", String(g), u]);
    if (!E.ok)
      throw n.value = n.value.filter((B) => B !== k && B.id !== k.id), new Error(E.error);
    await i();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: c, load: i };
}
const ev = { class: "top" }, tv = {
  class: "crumb",
  "data-task-crumb": ""
}, nv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, sv = {
  key: 1,
  class: "body"
}, av = { class: "stamp" }, ov = {
  class: "title",
  "data-resource-title": ""
}, rv = { class: "since" }, iv = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, lv = { class: "text" }, cv = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, uv = {
  key: 1,
  class: "note"
}, dv = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, hv = { class: "text" }, fv = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = W(null), r = W(null), i = W(""), c = W(""), u = W(null), f = W(null), g = Q0(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, ($) => s.read($));
    be(g.open, ($) => a("comments", $));
    let k = 0;
    const E = Wo, B = ($) => $.slice(0, 1).toUpperCase() + $.slice(1), L = T(() => {
      var $;
      return ($ = r.value) != null && $.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function y() {
      const $ = ++k, [m, N] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      $ === k && (i.value = m.ok ? "" : m.error, o.value = m.ok ? m.value : null, r.value = N.ok ? N.value : null);
    }
    be(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, y();
    }, { immediate: !0 }), be(() => s.changes, y);
    async function x($) {
      const m = o.value.priority;
      o.value.priority = Number($);
      const N = await s.read(["task", "edit", String(s.id), "--priority", $]);
      if (c.value = N.ok ? "" : N.error, N.ok) return y();
      o.value.priority = m;
    }
    function D($) {
      u.value = null, f.value.press($);
    }
    const U = ($) => {
      var m;
      return ((m = f.value) == null ? void 0 : m.moves.length) && (u.value = $);
    };
    return t({ openStatus: U }), ($, m) => (l(), d("aside", {
      class: Q(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", ev, [
        e.backed ? (l(), K(Ug, {
          key: 0,
          onBack: m[0] || (m[0] = (N) => a("back"))
        })) : P("", !0),
        p("span", tv, w(L.value), 1),
        m[9] || (m[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(X, { key: 1 }, [
          H(ye, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: m[1] || (m[1] = (N) => a("step", -1))
          }, {
            default: V(() => [
              H(Me, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          H(ye, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: m[2] || (m[2] = (N) => a("step", 1))
          }, {
            default: V(() => [
              H(Me, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : P("", !0),
        H(ye, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: m[3] || (m[3] = (N) => a("close"))
        }, {
          default: V(() => [
            H(Me, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (l(), d("p", nv, w(i.value), 1)) : o.value ? (l(), d(X, { key: 2 }, [
        H(H0, {
          open: G(g).open.value,
          comments: G(g).comments.value,
          words: G(g).words,
          onClose: m[6] || (m[6] = (N) => G(g).open.value = !1)
        }, {
          default: V(() => {
            var N;
            return [
              (l(), d("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", av, "Task " + w(o.value.id) + " · updated " + w(G(Yn)(G(tn)(o.value)) || "just now"), 1),
                p("h3", ov, w(o.value.title), 1),
                p("div", {
                  class: Q(["state-line", G(E)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: m[4] || (m[4] = (O) => U(O.currentTarget))
                  }, [
                    H(qo, {
                      status: G(E)(o.value.state)
                    }, null, 8, ["status"]),
                    he(" " + w(B(o.value.state)), 1)
                  ]),
                  p("span", rv, "since " + w(G(Yn)(G(tn)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", iv, [
                  m[10] || (m[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", lv, w(o.value.reason || "Other tasks"), 1),
                  (N = o.value.openers) != null && N.length ? (l(), d("p", cv, "Opens by itself when " + w(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", uv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", dv, [
                  m[11] || (m[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", hv, w(o.value.reason), 1)
                ])) : P("", !0),
                H(M0, {
                  task: o.value,
                  place: r.value,
                  refusal: c.value,
                  onPriority: x
                }, null, 8, ["task", "place", "refusal"]),
                H(L0, {
                  task: o.value,
                  onSelect: m[5] || (m[5] = (O) => a("select", O))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        H(X0, {
          send: G(g).send,
          count: G(g).comments.value.length,
          onShow: m[7] || (m[7] = (N) => G(g).open.value = !G(g).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", sv, [
        H(yt)
      ])),
      H(r0, {
        ref_key: "footer",
        ref: f,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: y
      }, null, 8, ["id", "row", "read"]),
      u.value ? (l(), K(Hg, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: m[8] || (m[8] = (N) => u.value = null)
      }, {
        default: V(() => [
          H(jg, null, {
            default: V(() => [
              he("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(X, null, re(f.value.moves, (N) => (l(), K(Rg, {
            key: N.word,
            onClick: (O) => D(N)
          }, {
            default: V(() => [
              he(w(N.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : P("", !0)
    ], 2));
  }
}, Oy = /* @__PURE__ */ Z(fv, [["__scopeId", "data-v-c76befc4"]]);
function pv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Un = { exports: {} }, va;
function mv() {
  return va || (va = 1, (function(e, t) {
    var n = (function() {
      var s = function(m, N) {
        var O = 236, q = 17, M = m, S = o[N], v = null, h = 0, C = null, b = [], A = {}, z = function(I, R) {
          h = M * 4 + 17, v = (function(_) {
            for (var j = new Array(_), F = 0; F < _; F += 1) {
              j[F] = new Array(_);
              for (var J = 0; J < _; J += 1)
                j[F][J] = null;
            }
            return j;
          })(h), oe(0, 0), oe(h - 7, 0), oe(0, h - 7), me(), le(), qe(I, R), M >= 7 && Ee(I), C == null && (C = Fo(M, S, b)), We(C, R);
        }, oe = function(I, R) {
          for (var _ = -1; _ <= 7; _ += 1)
            if (!(I + _ <= -1 || h <= I + _))
              for (var j = -1; j <= 7; j += 1)
                R + j <= -1 || h <= R + j || (0 <= _ && _ <= 6 && (j == 0 || j == 6) || 0 <= j && j <= 6 && (_ == 0 || _ == 6) || 2 <= _ && _ <= 4 && 2 <= j && j <= 4 ? v[I + _][R + j] = !0 : v[I + _][R + j] = !1);
        }, de = function() {
          for (var I = 0, R = 0, _ = 0; _ < 8; _ += 1) {
            z(!0, _);
            var j = i.getLostPoint(A);
            (_ == 0 || I > j) && (I = j, R = _);
          }
          return R;
        }, le = function() {
          for (var I = 8; I < h - 8; I += 1)
            v[I][6] == null && (v[I][6] = I % 2 == 0);
          for (var R = 8; R < h - 8; R += 1)
            v[6][R] == null && (v[6][R] = R % 2 == 0);
        }, me = function() {
          for (var I = i.getPatternPosition(M), R = 0; R < I.length; R += 1)
            for (var _ = 0; _ < I.length; _ += 1) {
              var j = I[R], F = I[_];
              if (v[j][F] == null)
                for (var J = -2; J <= 2; J += 1)
                  for (var se = -2; se <= 2; se += 1)
                    J == -2 || J == 2 || se == -2 || se == 2 || J == 0 && se == 0 ? v[j + J][F + se] = !0 : v[j + J][F + se] = !1;
            }
        }, Ee = function(I) {
          for (var R = i.getBCHTypeNumber(M), _ = 0; _ < 18; _ += 1) {
            var j = !I && (R >> _ & 1) == 1;
            v[Math.floor(_ / 3)][_ % 3 + h - 8 - 3] = j;
          }
          for (var _ = 0; _ < 18; _ += 1) {
            var j = !I && (R >> _ & 1) == 1;
            v[_ % 3 + h - 8 - 3][Math.floor(_ / 3)] = j;
          }
        }, qe = function(I, R) {
          for (var _ = S << 3 | R, j = i.getBCHTypeInfo(_), F = 0; F < 15; F += 1) {
            var J = !I && (j >> F & 1) == 1;
            F < 6 ? v[F][8] = J : F < 8 ? v[F + 1][8] = J : v[h - 15 + F][8] = J;
          }
          for (var F = 0; F < 15; F += 1) {
            var J = !I && (j >> F & 1) == 1;
            F < 8 ? v[8][h - F - 1] = J : F < 9 ? v[8][15 - F - 1 + 1] = J : v[8][15 - F - 1] = J;
          }
          v[h - 8][8] = !I;
        }, We = function(I, R) {
          for (var _ = -1, j = h - 1, F = 7, J = 0, se = i.getMaskFunction(R), ne = h - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (v[j][ne - ge] == null) {
                  var $e = !1;
                  J < I.length && ($e = (I[J] >>> F & 1) == 1);
                  var ae = se(j, ne - ge);
                  ae && ($e = !$e), v[j][ne - ge] = $e, F -= 1, F == -1 && (J += 1, F = 7);
                }
              if (j += _, j < 0 || h <= j) {
                j -= _, _ = -_;
                break;
              }
            }
        }, it = function(I, R) {
          for (var _ = 0, j = 0, F = 0, J = new Array(R.length), se = new Array(R.length), ne = 0; ne < R.length; ne += 1) {
            var ge = R[ne].dataCount, $e = R[ne].totalCount - ge;
            j = Math.max(j, ge), F = Math.max(F, $e), J[ne] = new Array(ge);
            for (var ae = 0; ae < J[ne].length; ae += 1)
              J[ne][ae] = 255 & I.getBuffer()[ae + _];
            _ += ge;
            var Ce = i.getErrorCorrectPolynomial($e), Oe = u(J[ne], Ce.getLength() - 1), Es = Oe.mod(Ce);
            se[ne] = new Array(Ce.getLength() - 1);
            for (var ae = 0; ae < se[ne].length; ae += 1) {
              var As = ae + Es.getLength() - se[ne].length;
              se[ne][ae] = As >= 0 ? Es.getAt(As) : 0;
            }
          }
          for (var Cs = 0, ae = 0; ae < R.length; ae += 1)
            Cs += R[ae].totalCount;
          for (var $n = new Array(Cs), jt = 0, ae = 0; ae < j; ae += 1)
            for (var ne = 0; ne < R.length; ne += 1)
              ae < J[ne].length && ($n[jt] = J[ne][ae], jt += 1);
          for (var ae = 0; ae < F; ae += 1)
            for (var ne = 0; ne < R.length; ne += 1)
              ae < se[ne].length && ($n[jt] = se[ne][ae], jt += 1);
          return $n;
        }, Fo = function(I, R, _) {
          for (var j = f.getRSBlocks(I, R), F = g(), J = 0; J < _.length; J += 1) {
            var se = _[J];
            F.put(se.getMode(), 4), F.put(se.getLength(), i.getLengthInBits(se.getMode(), I)), se.write(F);
          }
          for (var ne = 0, J = 0; J < j.length; J += 1)
            ne += j[J].dataCount;
          if (F.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + F.getLengthInBits() + ">" + ne * 8 + ")";
          for (F.getLengthInBits() + 4 <= ne * 8 && F.put(0, 4); F.getLengthInBits() % 8 != 0; )
            F.putBit(!1);
          for (; !(F.getLengthInBits() >= ne * 8 || (F.put(O, 8), F.getLengthInBits() >= ne * 8)); )
            F.put(q, 8);
          return it(F, j);
        };
        A.addData = function(I, R) {
          R = R || "Byte";
          var _ = null;
          switch (R) {
            case "Numeric":
              _ = k(I);
              break;
            case "Alphanumeric":
              _ = E(I);
              break;
            case "Byte":
              _ = B(I);
              break;
            case "Kanji":
              _ = L(I);
              break;
            default:
              throw "mode:" + R;
          }
          b.push(_), C = null;
        }, A.isDark = function(I, R) {
          if (I < 0 || h <= I || R < 0 || h <= R)
            throw I + "," + R;
          return v[I][R];
        }, A.getModuleCount = function() {
          return h;
        }, A.make = function() {
          if (M < 1) {
            for (var I = 1; I < 40; I++) {
              for (var R = f.getRSBlocks(I, S), _ = g(), j = 0; j < b.length; j++) {
                var F = b[j];
                _.put(F.getMode(), 4), _.put(F.getLength(), i.getLengthInBits(F.getMode(), I)), F.write(_);
              }
              for (var J = 0, j = 0; j < R.length; j++)
                J += R[j].dataCount;
              if (_.getLengthInBits() <= J * 8)
                break;
            }
            M = I;
          }
          z(!1, de());
        }, A.createTableTag = function(I, R) {
          I = I || 2, R = typeof R > "u" ? I * 4 : R;
          var _ = "";
          _ += '<table style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: " + R + "px;", _ += '">', _ += "<tbody>";
          for (var j = 0; j < A.getModuleCount(); j += 1) {
            _ += "<tr>";
            for (var F = 0; F < A.getModuleCount(); F += 1)
              _ += '<td style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: 0px;", _ += " width: " + I + "px;", _ += " height: " + I + "px;", _ += " background-color: ", _ += A.isDark(j, F) ? "#000000" : "#ffffff", _ += ";", _ += '"/>';
            _ += "</tr>";
          }
          return _ += "</tbody>", _ += "</table>", _;
        }, A.createSvgTag = function(I, R, _, j) {
          var F = {};
          typeof arguments[0] == "object" && (F = arguments[0], I = F.cellSize, R = F.margin, _ = F.alt, j = F.title), I = I || 2, R = typeof R > "u" ? I * 4 : R, _ = typeof _ == "string" ? { text: _ } : _ || {}, _.text = _.text || null, _.id = _.text ? _.id || "qrcode-description" : null, j = typeof j == "string" ? { text: j } : j || {}, j.text = j.text || null, j.id = j.text ? j.id || "qrcode-title" : null;
          var J = A.getModuleCount() * I + R * 2, se, ne, ge, $e, ae = "", Ce;
          for (Ce = "l" + I + ",0 0," + I + " -" + I + ",0 0,-" + I + "z ", ae += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ae += F.scalable ? "" : ' width="' + J + 'px" height="' + J + 'px"', ae += ' viewBox="0 0 ' + J + " " + J + '" ', ae += ' preserveAspectRatio="xMinYMin meet"', ae += j.text || _.text ? ' role="img" aria-labelledby="' + lt([j.id, _.id].join(" ").trim()) + '"' : "", ae += ">", ae += j.text ? '<title id="' + lt(j.id) + '">' + lt(j.text) + "</title>" : "", ae += _.text ? '<description id="' + lt(_.id) + '">' + lt(_.text) + "</description>" : "", ae += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ae += '<path d="', ge = 0; ge < A.getModuleCount(); ge += 1)
            for ($e = ge * I + R, se = 0; se < A.getModuleCount(); se += 1)
              A.isDark(ge, se) && (ne = se * I + R, ae += "M" + ne + "," + $e + Ce);
          return ae += '" stroke="transparent" fill="black"/>', ae += "</svg>", ae;
        }, A.createDataURL = function(I, R) {
          I = I || 2, R = typeof R > "u" ? I * 4 : R;
          var _ = A.getModuleCount() * I + R * 2, j = R, F = _ - R;
          return $(_, _, function(J, se) {
            if (j <= J && J < F && j <= se && se < F) {
              var ne = Math.floor((J - j) / I), ge = Math.floor((se - j) / I);
              return A.isDark(ge, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, A.createImgTag = function(I, R, _) {
          I = I || 2, R = typeof R > "u" ? I * 4 : R;
          var j = A.getModuleCount() * I + R * 2, F = "";
          return F += "<img", F += ' src="', F += A.createDataURL(I, R), F += '"', F += ' width="', F += j, F += '"', F += ' height="', F += j, F += '"', _ && (F += ' alt="', F += lt(_), F += '"'), F += "/>", F;
        };
        var lt = function(I) {
          for (var R = "", _ = 0; _ < I.length; _ += 1) {
            var j = I.charAt(_);
            switch (j) {
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
                R += j;
                break;
            }
          }
          return R;
        }, Ho = function(I) {
          var R = 1;
          I = typeof I > "u" ? R * 2 : I;
          var _ = A.getModuleCount() * R + I * 2, j = I, F = _ - I, J, se, ne, ge, $e, ae = {
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
          for (J = 0; J < _; J += 2) {
            for (ne = Math.floor((J - j) / R), ge = Math.floor((J + 1 - j) / R), se = 0; se < _; se += 1)
              $e = "█", j <= se && se < F && j <= J && J < F && A.isDark(ne, Math.floor((se - j) / R)) && ($e = " "), j <= se && se < F && j <= J + 1 && J + 1 < F && A.isDark(ge, Math.floor((se - j) / R)) ? $e += " " : $e += "█", Oe += I < 1 && J + 1 >= F ? Ce[$e] : ae[$e];
            Oe += `
`;
          }
          return _ % 2 && I > 0 ? Oe.substring(0, Oe.length - _ - 1) + Array(_ + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return A.createASCII = function(I, R) {
          if (I = I || 1, I < 2)
            return Ho(R);
          I -= 1, R = typeof R > "u" ? I * 2 : R;
          var _ = A.getModuleCount() * I + R * 2, j = R, F = _ - R, J, se, ne, ge, $e = Array(I + 1).join("██"), ae = Array(I + 1).join("  "), Ce = "", Oe = "";
          for (J = 0; J < _; J += 1) {
            for (ne = Math.floor((J - j) / I), Oe = "", se = 0; se < _; se += 1)
              ge = 1, j <= se && se < F && j <= J && J < F && A.isDark(ne, Math.floor((se - j) / I)) && (ge = 0), Oe += ge ? $e : ae;
            for (ne = 0; ne < I; ne += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, A.renderTo2dContext = function(I, R) {
          R = R || 2;
          for (var _ = A.getModuleCount(), j = 0; j < _; j++)
            for (var F = 0; F < _; F++)
              I.fillStyle = A.isDark(j, F) ? "black" : "white", I.fillRect(j * R, F * R, R, R);
        }, A;
      };
      s.stringToBytesFuncs = {
        default: function(m) {
          for (var N = [], O = 0; O < m.length; O += 1) {
            var q = m.charCodeAt(O);
            N.push(q & 255);
          }
          return N;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(m, N) {
        var O = (function() {
          for (var M = D(m), S = function() {
            var le = M.read();
            if (le == -1) throw "eof";
            return le;
          }, v = 0, h = {}; ; ) {
            var C = M.read();
            if (C == -1) break;
            var b = S(), A = S(), z = S(), oe = String.fromCharCode(C << 8 | b), de = A << 8 | z;
            h[oe] = de, v += 1;
          }
          if (v != N)
            throw v + " != " + N;
          return h;
        })(), q = 63;
        return function(M) {
          for (var S = [], v = 0; v < M.length; v += 1) {
            var h = M.charCodeAt(v);
            if (h < 128)
              S.push(h);
            else {
              var C = O[M.charAt(v)];
              typeof C == "number" ? (C & 255) == C ? S.push(C) : (S.push(C >>> 8), S.push(C & 255)) : S.push(q);
            }
          }
          return S;
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
      }, r = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, i = (function() {
        var m = [
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
        ], N = 1335, O = 7973, q = 21522, M = {}, S = function(v) {
          for (var h = 0; v != 0; )
            h += 1, v >>>= 1;
          return h;
        };
        return M.getBCHTypeInfo = function(v) {
          for (var h = v << 10; S(h) - S(N) >= 0; )
            h ^= N << S(h) - S(N);
          return (v << 10 | h) ^ q;
        }, M.getBCHTypeNumber = function(v) {
          for (var h = v << 12; S(h) - S(O) >= 0; )
            h ^= O << S(h) - S(O);
          return v << 12 | h;
        }, M.getPatternPosition = function(v) {
          return m[v - 1];
        }, M.getMaskFunction = function(v) {
          switch (v) {
            case r.PATTERN000:
              return function(h, C) {
                return (h + C) % 2 == 0;
              };
            case r.PATTERN001:
              return function(h, C) {
                return h % 2 == 0;
              };
            case r.PATTERN010:
              return function(h, C) {
                return C % 3 == 0;
              };
            case r.PATTERN011:
              return function(h, C) {
                return (h + C) % 3 == 0;
              };
            case r.PATTERN100:
              return function(h, C) {
                return (Math.floor(h / 2) + Math.floor(C / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(h, C) {
                return h * C % 2 + h * C % 3 == 0;
              };
            case r.PATTERN110:
              return function(h, C) {
                return (h * C % 2 + h * C % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(h, C) {
                return (h * C % 3 + (h + C) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + v;
          }
        }, M.getErrorCorrectPolynomial = function(v) {
          for (var h = u([1], 0), C = 0; C < v; C += 1)
            h = h.multiply(u([1, c.gexp(C)], 0));
          return h;
        }, M.getLengthInBits = function(v, h) {
          if (1 <= h && h < 10)
            switch (v) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + v;
            }
          else if (h < 27)
            switch (v) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + v;
            }
          else if (h < 41)
            switch (v) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + v;
            }
          else
            throw "type:" + h;
        }, M.getLostPoint = function(v) {
          for (var h = v.getModuleCount(), C = 0, b = 0; b < h; b += 1)
            for (var A = 0; A < h; A += 1) {
              for (var z = 0, oe = v.isDark(b, A), de = -1; de <= 1; de += 1)
                if (!(b + de < 0 || h <= b + de))
                  for (var le = -1; le <= 1; le += 1)
                    A + le < 0 || h <= A + le || de == 0 && le == 0 || oe == v.isDark(b + de, A + le) && (z += 1);
              z > 5 && (C += 3 + z - 5);
            }
          for (var b = 0; b < h - 1; b += 1)
            for (var A = 0; A < h - 1; A += 1) {
              var me = 0;
              v.isDark(b, A) && (me += 1), v.isDark(b + 1, A) && (me += 1), v.isDark(b, A + 1) && (me += 1), v.isDark(b + 1, A + 1) && (me += 1), (me == 0 || me == 4) && (C += 3);
            }
          for (var b = 0; b < h; b += 1)
            for (var A = 0; A < h - 6; A += 1)
              v.isDark(b, A) && !v.isDark(b, A + 1) && v.isDark(b, A + 2) && v.isDark(b, A + 3) && v.isDark(b, A + 4) && !v.isDark(b, A + 5) && v.isDark(b, A + 6) && (C += 40);
          for (var A = 0; A < h; A += 1)
            for (var b = 0; b < h - 6; b += 1)
              v.isDark(b, A) && !v.isDark(b + 1, A) && v.isDark(b + 2, A) && v.isDark(b + 3, A) && v.isDark(b + 4, A) && !v.isDark(b + 5, A) && v.isDark(b + 6, A) && (C += 40);
          for (var Ee = 0, A = 0; A < h; A += 1)
            for (var b = 0; b < h; b += 1)
              v.isDark(b, A) && (Ee += 1);
          var qe = Math.abs(100 * Ee / h / h - 50) / 5;
          return C += qe * 10, C;
        }, M;
      })(), c = (function() {
        for (var m = new Array(256), N = new Array(256), O = 0; O < 8; O += 1)
          m[O] = 1 << O;
        for (var O = 8; O < 256; O += 1)
          m[O] = m[O - 4] ^ m[O - 5] ^ m[O - 6] ^ m[O - 8];
        for (var O = 0; O < 255; O += 1)
          N[m[O]] = O;
        var q = {};
        return q.glog = function(M) {
          if (M < 1)
            throw "glog(" + M + ")";
          return N[M];
        }, q.gexp = function(M) {
          for (; M < 0; )
            M += 255;
          for (; M >= 256; )
            M -= 255;
          return m[M];
        }, q;
      })();
      function u(m, N) {
        if (typeof m.length > "u")
          throw m.length + "/" + N;
        var O = (function() {
          for (var M = 0; M < m.length && m[M] == 0; )
            M += 1;
          for (var S = new Array(m.length - M + N), v = 0; v < m.length - M; v += 1)
            S[v] = m[v + M];
          return S;
        })(), q = {};
        return q.getAt = function(M) {
          return O[M];
        }, q.getLength = function() {
          return O.length;
        }, q.multiply = function(M) {
          for (var S = new Array(q.getLength() + M.getLength() - 1), v = 0; v < q.getLength(); v += 1)
            for (var h = 0; h < M.getLength(); h += 1)
              S[v + h] ^= c.gexp(c.glog(q.getAt(v)) + c.glog(M.getAt(h)));
          return u(S, 0);
        }, q.mod = function(M) {
          if (q.getLength() - M.getLength() < 0)
            return q;
          for (var S = c.glog(q.getAt(0)) - c.glog(M.getAt(0)), v = new Array(q.getLength()), h = 0; h < q.getLength(); h += 1)
            v[h] = q.getAt(h);
          for (var h = 0; h < M.getLength(); h += 1)
            v[h] ^= c.gexp(c.glog(M.getAt(h)) + S);
          return u(v, 0).mod(M);
        }, q;
      }
      var f = (function() {
        var m = [
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
        ], N = function(M, S) {
          var v = {};
          return v.totalCount = M, v.dataCount = S, v;
        }, O = {}, q = function(M, S) {
          switch (S) {
            case o.L:
              return m[(M - 1) * 4 + 0];
            case o.M:
              return m[(M - 1) * 4 + 1];
            case o.Q:
              return m[(M - 1) * 4 + 2];
            case o.H:
              return m[(M - 1) * 4 + 3];
            default:
              return;
          }
        };
        return O.getRSBlocks = function(M, S) {
          var v = q(M, S);
          if (typeof v > "u")
            throw "bad rs block @ typeNumber:" + M + "/errorCorrectionLevel:" + S;
          for (var h = v.length / 3, C = [], b = 0; b < h; b += 1)
            for (var A = v[b * 3 + 0], z = v[b * 3 + 1], oe = v[b * 3 + 2], de = 0; de < A; de += 1)
              C.push(N(z, oe));
          return C;
        }, O;
      })(), g = function() {
        var m = [], N = 0, O = {};
        return O.getBuffer = function() {
          return m;
        }, O.getAt = function(q) {
          var M = Math.floor(q / 8);
          return (m[M] >>> 7 - q % 8 & 1) == 1;
        }, O.put = function(q, M) {
          for (var S = 0; S < M; S += 1)
            O.putBit((q >>> M - S - 1 & 1) == 1);
        }, O.getLengthInBits = function() {
          return N;
        }, O.putBit = function(q) {
          var M = Math.floor(N / 8);
          m.length <= M && m.push(0), q && (m[M] |= 128 >>> N % 8), N += 1;
        }, O;
      }, k = function(m) {
        var N = a.MODE_NUMBER, O = m, q = {};
        q.getMode = function() {
          return N;
        }, q.getLength = function(v) {
          return O.length;
        }, q.write = function(v) {
          for (var h = O, C = 0; C + 2 < h.length; )
            v.put(M(h.substring(C, C + 3)), 10), C += 3;
          C < h.length && (h.length - C == 1 ? v.put(M(h.substring(C, C + 1)), 4) : h.length - C == 2 && v.put(M(h.substring(C, C + 2)), 7));
        };
        var M = function(v) {
          for (var h = 0, C = 0; C < v.length; C += 1)
            h = h * 10 + S(v.charAt(C));
          return h;
        }, S = function(v) {
          if ("0" <= v && v <= "9")
            return v.charCodeAt(0) - 48;
          throw "illegal char :" + v;
        };
        return q;
      }, E = function(m) {
        var N = a.MODE_ALPHA_NUM, O = m, q = {};
        q.getMode = function() {
          return N;
        }, q.getLength = function(S) {
          return O.length;
        }, q.write = function(S) {
          for (var v = O, h = 0; h + 1 < v.length; )
            S.put(
              M(v.charAt(h)) * 45 + M(v.charAt(h + 1)),
              11
            ), h += 2;
          h < v.length && S.put(M(v.charAt(h)), 6);
        };
        var M = function(S) {
          if ("0" <= S && S <= "9")
            return S.charCodeAt(0) - 48;
          if ("A" <= S && S <= "Z")
            return S.charCodeAt(0) - 65 + 10;
          switch (S) {
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
              throw "illegal char :" + S;
          }
        };
        return q;
      }, B = function(m) {
        var N = a.MODE_8BIT_BYTE, O = s.stringToBytes(m), q = {};
        return q.getMode = function() {
          return N;
        }, q.getLength = function(M) {
          return O.length;
        }, q.write = function(M) {
          for (var S = 0; S < O.length; S += 1)
            M.put(O[S], 8);
        }, q;
      }, L = function(m) {
        var N = a.MODE_KANJI, O = s.stringToBytesFuncs.SJIS;
        if (!O)
          throw "sjis not supported.";
        (function(S, v) {
          var h = O(S);
          if (h.length != 2 || (h[0] << 8 | h[1]) != v)
            throw "sjis not supported.";
        })("友", 38726);
        var q = O(m), M = {};
        return M.getMode = function() {
          return N;
        }, M.getLength = function(S) {
          return ~~(q.length / 2);
        }, M.write = function(S) {
          for (var v = q, h = 0; h + 1 < v.length; ) {
            var C = (255 & v[h]) << 8 | 255 & v[h + 1];
            if (33088 <= C && C <= 40956)
              C -= 33088;
            else if (57408 <= C && C <= 60351)
              C -= 49472;
            else
              throw "illegal char at " + (h + 1) + "/" + C;
            C = (C >>> 8 & 255) * 192 + (C & 255), S.put(C, 13), h += 2;
          }
          if (h < v.length)
            throw "illegal char at " + (h + 1);
        }, M;
      }, y = function() {
        var m = [], N = {};
        return N.writeByte = function(O) {
          m.push(O & 255);
        }, N.writeShort = function(O) {
          N.writeByte(O), N.writeByte(O >>> 8);
        }, N.writeBytes = function(O, q, M) {
          q = q || 0, M = M || O.length;
          for (var S = 0; S < M; S += 1)
            N.writeByte(O[S + q]);
        }, N.writeString = function(O) {
          for (var q = 0; q < O.length; q += 1)
            N.writeByte(O.charCodeAt(q));
        }, N.toByteArray = function() {
          return m;
        }, N.toString = function() {
          var O = "";
          O += "[";
          for (var q = 0; q < m.length; q += 1)
            q > 0 && (O += ","), O += m[q];
          return O += "]", O;
        }, N;
      }, x = function() {
        var m = 0, N = 0, O = 0, q = "", M = {}, S = function(h) {
          q += String.fromCharCode(v(h & 63));
        }, v = function(h) {
          if (!(h < 0)) {
            if (h < 26)
              return 65 + h;
            if (h < 52)
              return 97 + (h - 26);
            if (h < 62)
              return 48 + (h - 52);
            if (h == 62)
              return 43;
            if (h == 63)
              return 47;
          }
          throw "n:" + h;
        };
        return M.writeByte = function(h) {
          for (m = m << 8 | h & 255, N += 8, O += 1; N >= 6; )
            S(m >>> N - 6), N -= 6;
        }, M.flush = function() {
          if (N > 0 && (S(m << 6 - N), m = 0, N = 0), O % 3 != 0)
            for (var h = 3 - O % 3, C = 0; C < h; C += 1)
              q += "=";
        }, M.toString = function() {
          return q;
        }, M;
      }, D = function(m) {
        var N = m, O = 0, q = 0, M = 0, S = {};
        S.read = function() {
          for (; M < 8; ) {
            if (O >= N.length) {
              if (M == 0)
                return -1;
              throw "unexpected end of file./" + M;
            }
            var h = N.charAt(O);
            if (O += 1, h == "=")
              return M = 0, -1;
            if (h.match(/^\s$/))
              continue;
            q = q << 6 | v(h.charCodeAt(0)), M += 6;
          }
          var C = q >>> M - 8 & 255;
          return M -= 8, C;
        };
        var v = function(h) {
          if (65 <= h && h <= 90)
            return h - 65;
          if (97 <= h && h <= 122)
            return h - 97 + 26;
          if (48 <= h && h <= 57)
            return h - 48 + 52;
          if (h == 43)
            return 62;
          if (h == 47)
            return 63;
          throw "c:" + h;
        };
        return S;
      }, U = function(m, N) {
        var O = m, q = N, M = new Array(m * N), S = {};
        S.setPixel = function(b, A, z) {
          M[A * O + b] = z;
        }, S.write = function(b) {
          b.writeString("GIF87a"), b.writeShort(O), b.writeShort(q), b.writeByte(128), b.writeByte(0), b.writeByte(0), b.writeByte(0), b.writeByte(0), b.writeByte(0), b.writeByte(255), b.writeByte(255), b.writeByte(255), b.writeString(","), b.writeShort(0), b.writeShort(0), b.writeShort(O), b.writeShort(q), b.writeByte(0);
          var A = 2, z = h(A);
          b.writeByte(A);
          for (var oe = 0; z.length - oe > 255; )
            b.writeByte(255), b.writeBytes(z, oe, 255), oe += 255;
          b.writeByte(z.length - oe), b.writeBytes(z, oe, z.length - oe), b.writeByte(0), b.writeString(";");
        };
        var v = function(b) {
          var A = b, z = 0, oe = 0, de = {};
          return de.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; z + me >= 8; )
              A.writeByte(255 & (le << z | oe)), me -= 8 - z, le >>>= 8 - z, oe = 0, z = 0;
            oe = le << z | oe, z = z + me;
          }, de.flush = function() {
            z > 0 && A.writeByte(oe);
          }, de;
        }, h = function(b) {
          for (var A = 1 << b, z = (1 << b) + 1, oe = b + 1, de = C(), le = 0; le < A; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(A)), de.add(String.fromCharCode(z));
          var me = y(), Ee = v(me);
          Ee.write(A, oe);
          var qe = 0, We = String.fromCharCode(M[qe]);
          for (qe += 1; qe < M.length; ) {
            var it = String.fromCharCode(M[qe]);
            qe += 1, de.contains(We + it) ? We = We + it : (Ee.write(de.indexOf(We), oe), de.size() < 4095 && (de.size() == 1 << oe && (oe += 1), de.add(We + it)), We = it);
          }
          return Ee.write(de.indexOf(We), oe), Ee.write(z, oe), Ee.flush(), me.toByteArray();
        }, C = function() {
          var b = {}, A = 0, z = {};
          return z.add = function(oe) {
            if (z.contains(oe))
              throw "dup key:" + oe;
            b[oe] = A, A += 1;
          }, z.size = function() {
            return A;
          }, z.indexOf = function(oe) {
            return b[oe];
          }, z.contains = function(oe) {
            return typeof b[oe] < "u";
          }, z;
        };
        return S;
      }, $ = function(m, N, O) {
        for (var q = U(m, N), M = 0; M < N; M += 1)
          for (var S = 0; S < m; S += 1)
            q.setPixel(S, M, O(S, M));
        var v = y();
        q.write(v);
        for (var h = x(), C = v.toByteArray(), b = 0; b < C.length; b += 1)
          h.writeByte(C[b]);
        return h.flush(), "data:image/gif;base64," + h;
      };
      return s;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(s) {
        function a(o) {
          for (var r = [], i = 0; i < o.length; i++) {
            var c = o.charCodeAt(i);
            c < 128 ? r.push(c) : c < 2048 ? r.push(
              192 | c >> 6,
              128 | c & 63
            ) : c < 55296 || c >= 57344 ? r.push(
              224 | c >> 12,
              128 | c >> 6 & 63,
              128 | c & 63
            ) : (i++, c = 65536 + ((c & 1023) << 10 | o.charCodeAt(i) & 1023), r.push(
              240 | c >> 18,
              128 | c >> 12 & 63,
              128 | c >> 6 & 63,
              128 | c & 63
            ));
          }
          return r;
        }
        return a(s);
      };
    })(), (function(s) {
      e.exports = s();
    })(function() {
      return n;
    });
  })(Un)), Un.exports;
}
var gv = mv();
const vv = /* @__PURE__ */ pv(gv), yv = ["width", "height", "viewBox"], wv = ["width", "height"], kv = ["d"], bv = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = T(() => {
      const s = vv(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let r = 0; r < a; r += 1)
        for (let i = 0; i < a; i += 1)
          s.isDark(r, i) && o.push(`M${i + 4} ${r + 4}h1v1h-1z`);
      return { count: a + 8, path: o.join("") };
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
      p("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, wv),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, kv)
    ], 8, yv));
  }
}, Ty = /* @__PURE__ */ Z(bv, [["__scopeId", "data-v-489f0852"]]), By = er(() => import("./VoiceFigure-DZultYj0.js").then((e) => e.V)), Iy = "1.0.0", Ry = "3.5";
export {
  Ev as $,
  Jv as A,
  Je as B,
  ry as C,
  Kv as D,
  oy as E,
  Wv as F,
  No as G,
  Im as H,
  Tm as I,
  hy as J,
  kt as K,
  ny as L,
  Te as M,
  St as N,
  Xv as O,
  bn as P,
  Qv as Q,
  mp as R,
  Eo as S,
  Yv as T,
  ay as U,
  ha as V,
  vm as W,
  um as X,
  fy as Y,
  iy as Z,
  Z as _,
  ie as a,
  ms as a$,
  ye as a0,
  gs as a1,
  Av as a2,
  Ku as a3,
  Cy as a4,
  Pv as a5,
  Xt as a6,
  my as a7,
  xv as a8,
  Tt as a9,
  st as aA,
  Oh as aB,
  By as aC,
  Pe as aD,
  Qi as aE,
  Yn as aF,
  Sy as aG,
  _y as aH,
  Ey as aI,
  jv as aJ,
  Dv as aK,
  Rv as aL,
  vy as aM,
  gy as aN,
  u1 as aO,
  Sv as aP,
  wt as aQ,
  Ov as aR,
  Iv as aS,
  by as aT,
  yy as aU,
  xy as aV,
  Wg as aW,
  hg as aX,
  h1 as aY,
  wy as aZ,
  Th as a_,
  Me as aa,
  Iy as ab,
  Ry as ac,
  $y as ad,
  rs as ae,
  Lv as af,
  y1 as ag,
  Rg as ah,
  jg as ai,
  Hg as aj,
  Cv as ak,
  br as al,
  Ay as am,
  Tv as an,
  Ty as ao,
  ky as ap,
  Vr as aq,
  Mv as ar,
  Nv as as,
  as as at,
  yt as au,
  Bv as av,
  _v as aw,
  ps as ax,
  Oy as ay,
  qo as az,
  Ze as b,
  My as b0,
  Zv as c,
  Hv as d,
  Uv as e,
  Fv as f,
  cy as g,
  bo as h,
  ey as i,
  ty as j,
  sy as k,
  uy as l,
  Vv as m,
  qv as n,
  zv as o,
  rn as p,
  py as q,
  ly as r,
  Gv as s,
  De as t,
  cm as u,
  dy as v,
  hm as w,
  Ms as x,
  Rp as y,
  Lp as z
};
