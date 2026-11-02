/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as we, createElementVNode as p, normalizeClass as Q, Fragment as X, renderList as re, normalizeStyle as ke, defineComponent as Uo, Comment as Vo, h as ps, cloneVNode as zo, createBlock as G, withCtx as V, unref as z, createVNode as H, toDisplayString as w, createCommentVNode as N, inject as je, computed as T, resolveDynamicComponent as it, Transition as hn, watch as be, ref as F, shallowRef as fn, TransitionGroup as Go, mergeProps as ot, reactive as ms, createTextVNode as he, onMounted as Le, onUnmounted as Ae, nextTick as pn, useId as ya, Teleport as wa, withModifiers as _e, isRef as Bs, onBeforeUnmount as yt, resolveDirective as Ko, withDirectives as gt, useModel as Vn, useAttrs as ka, getCurrentInstance as Yo, mergeModels as zn, getCurrentScope as ba, onScopeDispose as $a, provide as Jo, onErrorCaptured as Zo, toHandlers as Xo, createSlots as Qo, withKeys as Xt, vModelText as Gn, defineAsyncComponent as er } from "vue";
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
}, Qe = /* @__PURE__ */ Z(nr, [["__scopeId", "data-v-0ebb6933"]]), gs = Uo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Vo);
      return s.length !== 1 ? ps(X, { key: n }, s) : s[0].key == null ? zo(s[0], { key: n }) : s[0];
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
    return (c, u) => (l(), G(gs, { value: e.shape }, {
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
            (l(), d(X, null, re(n, (m) => H(Qe, {
              key: m.id,
              bars: m.bars
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
            (l(), d(X, null, re(a, (m) => H(Qe, {
              key: m.id,
              bars: m.bars
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
          (l(!0), d(X, null, re(e.count, (f) => (l(), G(Qe, {
            key: f,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ir)
      ]),
      text: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(X, null, re(e.count, (f) => (l(), G(Qe, {
            key: f,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, lr)
      ]),
      default: V(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(X, null, re(e.count, (f) => (l(), G(Qe, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, cr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, wt = /* @__PURE__ */ Z(ur, [["__scopeId", "data-v-c687fb85"]]), dr = {
  key: 1,
  class: "empty-state titled"
}, hr = { class: "empty-state-title" }, fr = { class: "empty-state-text" }, pr = {
  key: 2,
  class: "empty-state"
}, mr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), G(wt, {
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
}, Qt = /* @__PURE__ */ Z(mr, [["__scopeId", "data-v-b27e89b0"]]), gr = { class: "fold-group" }, vr = ["aria-expanded"], yr = { class: "fold-label" }, wr = {
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
        e.count !== "" ? (l(), d("span", wr, w(e.count), 1)) : N("", !0),
        p("span", {
          class: Q(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, vr),
      e.open ? we(s.$slots, "default", {}, void 0, !0, 0) : N("", !0)
    ]));
  }
}, xv = /* @__PURE__ */ Z(kr, [["__scopeId", "data-v-9ef1865c"]]), br = Symbol("open-view"), Pe = Symbol.for("journal.window-context");
function vs() {
  const e = je(Pe, null);
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
      return t.busy || t.disabled || !!((s = je(Pe, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), G(it(e.href ? "a" : "button"), {
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
        e.busy ? (l(), G(xr, {
          key: 0,
          class: "btn-spinner"
        })) : N("", !0)
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
      H(hn, {
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
        e.labelled ? (l(), d("span", Or, w(e.word), 1)) : N("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Tr, w(e.word), 1)) : N("", !0)
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
function mn(e, t) {
  return Ma(() => localStorage, e, t);
}
function _a(e, t) {
  be(t, (n) => mn(e, n), { deep: !0 });
}
function Ir(e, t) {
  return xa(() => sessionStorage, e, t);
}
function Rr(e, t) {
  return Ma(() => sessionStorage, e, t);
}
const en = "journal.environment", Sa = F(Ir(en, Ct(en, "")));
function Lr(e) {
  Sa.value = e, Rr(en, e), mn(en, e);
}
const tn = F(location.hash), Is = fn(null), Rs = { integrations: "mcp", library: "team" };
function Dr() {
  if (!Is.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Rs[n]) {
    location.replace(`#/${[Rs[n], ...s].join("/")}${t ? `?${t}` : ""}`), tn.value = location.hash;
    return;
  }
  !n || Is.value(n) || (Lr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), tn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  tn.value = location.hash, Dr();
});
const Ne = T(() => {
  const [e, t = ""] = tn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", f = "", m = ""] = i.split(":");
    return { table: u, id: Number(f), comment: Number(m) || 0, env: c };
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
}), gn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${gn.page(e)}?open=${t}`
};
function Nr(e = "", t = 0, n = "") {
  location.hash = gn.page(e, t, n);
}
const jr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ea(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(jr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const mt = {};
function Sv(e, t) {
  return mt[e] = t, () => mt[e] === t && delete mt[e];
}
function Aa(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = mt[e]) != null && r.call(mt, t))) return;
  const a = Ne.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Ea([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Pr(e, t, n, s = 0, a = "") {
  if (e === Ne.value.env) return Aa(t, n, s, a);
  const o = Ne.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ea([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function rt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Pr(s, a, Number(o), 0, t) : Aa(a, Number(o), 0, t);
}
function qr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function pt(e) {
  const t = qr(e);
  t && rt(t, e.target.closest("[data-peek]").dataset.sub || "");
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
      "dots-vertical": '<circle cx="8" cy="3.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
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
}, ys = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), G(ye, {
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
    // how a row comes in and goes out, {enter, leave} each given the row's element and the call that ends it; with none given rows just appear
    arrival: { type: Object, default: null }
  },
  setup(e) {
    const t = e, n = T(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = F(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (l(), G(wt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", Fr, w(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), G(Qt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(X, { key: 3 }, [
      (l(), G(it(e.arrival ? Go : "ul"), ot(n.value, { class: "row-list" }), {
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
      e.older && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : N("", !0)
    ], 64));
  }
}, Vr = /* @__PURE__ */ Z(Ur, [["__scopeId", "data-v-7f34ada7"]]), zr = {
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
          onClick: (i) => z(rt)(`agents:${r.id}`)
        }, [
          p("span", Zr, "#" + w(r.id) + " " + w(r.session), 1),
          p("span", Xr, w(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Jr))), 128))
      ], 64)) : (l(), d("p", Kr, w(e.none), 1)) : (l(), G(wt, {
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
      (l(!0), d(X, null, re(e.items, (c, u) => (l(), G(it(c.open ? "button" : "div"), {
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
      e.node.title ? (l(), d("span", ui, w(e.node.title), 1)) : N("", !0),
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
      (l(!0), d(X, null, re(e.node.children || [], (c, u) => (l(), G(ao, {
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (f) => a("open", f)),
        onFile: i[1] || (i[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Kt = /* @__PURE__ */ Z(fi, [["__scopeId", "data-v-d142a3f4"]]), pi = {
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
        e.node.note ? (l(), d("span", gi, w(e.node.note), 1)) : N("", !0)
      ])) : N("", !0),
      H(Kt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, yi = /* @__PURE__ */ Z(vi, [["__scopeId", "data-v-67b72d40"]]), wi = (e, t, n) => Math.max(t, Math.min(n, e)), ki = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, xe = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ls = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", xn = 80;
function Ds(e) {
  return e.length <= xn ? e : `${e.slice(0, xn + 1).replace(/\s+\S*$/, "") || e.slice(0, xn)}…`;
}
const Ns = {
  messages: (e) => Ds(Ls(e.text)),
  comments: (e) => Ds(Ls(e.text)),
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
}, bi = (e) => (Ns[e.table] ? Ns[e.table](e) : e.title || "") || "", $i = ["done", "cancelled"], Kn = {
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
}, xi = (e) => Kn[e.table] ? Kn[e.table](e) : 0, Oa = (e) => xi(e) > 0, Mi = (e) => !!Kn[e], Ta = (e) => xe(e.created_at), nn = (e) => xe(e.updated_at) || Ta(e), _i = (e) => "task_ids" in e, vn = typeof document < "u" && document.documentElement.classList.contains("phone"), Si = "Files are attached on the computer; the phone sends text.", Ba = 1024, Ei = Ba * 1024 * 1024, Ai = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ba} MB limit for one file.`;
function Ci() {
  return () => {
  };
}
function js(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Oi(e = window) {
  if (!js(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    js(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ia = "status.summary", ve = ms({
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
let qt = { version: "", started: 0 };
function Di(e) {
  return e.version ? (qt.version || (qt = { version: e.version, started: e.started || 0 }), e.version !== qt.version || (e.started || 0) !== qt.started) : !1;
}
function Ni(e) {
  Ii(e.countdown), Bi(e.ready, e.step), (Li(!!e.updating, e.step) || !e.updating && !ji(e) && Di(e)) && Oi(window);
}
const ji = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Ps = 2e4, Pi = 3e5, Fe = 6e5, Wt = 6, qi = 500, Wi = "/journal/summary", qs = vn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Fi = (e) => e.split("?")[0].endsWith(Wi), La = (e, t) => Object.assign(new Error(t), { status: e });
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
    }, this.tries = Wt;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Wt;
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
        headers: { ...qs, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Ui(s),
        signal: AbortSignal.timeout(a || (i ? Pi : Ps))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, qi)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Wt, r = {}) {
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
    const n = await fetch(t, { headers: qs, signal: AbortSignal.timeout(Ps) });
    if (!n.ok) throw La(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Wt, o).then((c) => (this.written(n), c));
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
const De = new Vi(), Ee = (e) => encodeURIComponent(e);
function de(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const $t = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), xt = "the page does not know its environment yet", zi = "X-Journal-Env", Gi = "X-Journal-Request-At", Mn = "/viewer/voices/figures/";
class ws {
  constructor({ env: t = () => Ne.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ws({ base: t, env: typeof n == "function" ? n : () => n });
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
    return this.get(`/updates/changelog${de({ skip: t })}`);
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
    return this.get(this.here(`/entries${de({ since: t, last: n })}`));
  }
  stream(t = 0) {
    const n = t ? `?since=${t}` : "";
    return De.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: c = !1, docked: u = !1 } = {}) {
    const f = this.here(`/${t}${de({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: c ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(f, `${t}.${$t({ before: s, after: a, since: o, ids: r, tasks: i, closed: c, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${de({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
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
    if (vn) return Promise.reject(Object.assign(new Error(Si), { status: 403 }));
    if (s.size > Ei) return Promise.reject(new Error(Ai(s)));
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
    return this.get(this.here(`/messages${de({ on: t })}`), "messages.on");
  }
  // every row and conversation line here that holds all the words
  search(t, { models: n = [], conversations: s = !1 } = {}) {
    const a = { words: t, models: n.join(","), conversations: s ? 1 : "" };
    return this.get(this.here(`/search${de(a)}`));
  }
  // the documents a search finds, best first, and the files attached to messages, a page at a time
  locateDocs(t) {
    return this.get(this.here(`/docs/search${de({ words: t })}`));
  }
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: o }) {
    return this.get(this.here(`/attachments${de({ file_type: t, shelf: n, search: s, last: a, skip: o })}`));
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
    return this.get(`/agents/controls/${Ee(t)}${de({ model: n, effort: s })}`);
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
    return this.get(this.here(`${a}${de(s)}`), `${a}.${$t(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${de(n)}`), `/verifiers/${t}/transcript.${$t(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${de(n)}`), `/workers/${t}/transcript.${$t(n)}`);
  }
  edits(t, n, s = {}) {
    return this.get(this.here(`/agents/${t}/edits${de({ since: n, ...s })}`));
  }
  editedText(t, n) {
    return this.get(this.here(`/agents/${t}/edits/text${de({ edit: n })}`));
  }
  editedImageUrl(t, n) {
    return this.address(`/agents/${t}/edits/image${de({ edit: n })}`);
  }
  terminal(t, n = 0) {
    return this.get(this.here(`/agents/${t}/terminal${de({ after: n })}`));
  }
  // who the viewer is and who else is on the journal, so it says you only for its own person
  people() {
    return this.get("/people");
  }
  // whether this journal is connected to a team, and as whom; the one team, or the team named
  team(t = "") {
    return this.get(`/team${de({ team: t })}`);
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
    return this.get(`/team/devices${de({ team: t })}`);
  }
  revokeTeamDevice(t, n = "") {
    return this.post("/team/revoke", { device: t, team: n });
  }
  teamPeople(t = "") {
    return this.get(`/team/people${de({ team: t })}`);
  }
  // changes this person's own password on the team
  changeTeamPassword(t, n, s = "") {
    return this.post("/team/password", { old: t, new: n, team: s });
  }
  // the library's items, each with its newest version and the version this journal imported, by kind and words
  libraryItems(t, n, s = "") {
    return this.get(`/library/items${de({ type: t, search: n, team: s })}`);
  }
  // one library item with every version and its note, and the version this journal imported
  libraryItem(t, n, s = "") {
    return this.get(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}${de({ team: s })}`);
  }
  // every copy here that came from the library, with the version it came from and the row or file it is
  libraryCopies(t = "") {
    return this.get(`/library/copies${de({ team: t })}`);
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
    const a = this.here(`/outputs/${t}${de({ after: n, before: s })}`);
    return this.get(a, a);
  }
  activeCards(t) {
    return this.get(this.here(`/cards/active?ids=${t.join(",")}`));
  }
  // skills and voices
  skills(t = 0) {
    return this.get(this.here(`/skills${de({ agent: t })}`));
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
    return this.get(this.here(`/project-files${de({ folder: t })}`));
  }
  findFiles(t) {
    return this.get(this.here(`/project-files/find${de({ q: t })}`));
  }
  projectFile(t) {
    return this.get(this.here(`/project-files/file${de({ path: t })}`));
  }
  projectFileUrl(t) {
    return this.address(`/project-files/raw${de({ path: t })}`);
  }
  fileDiff(t) {
    return this.get(this.here(`/project-files/diff${de({ path: t })}`));
  }
  // the project's repository
  gitBranches(t = 0, n = 30) {
    return this.get(this.here(`/git/branches${de({ skip: t, last: n })}`));
  }
  gitCommits(t = 0, n = 30) {
    return this.get(this.here(`/git/commits${de({ skip: t, last: n })}`));
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
    return this.get(this.here(`/plugins/${t}/log${de({ lines: n })}`));
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
    return this.post("/mcp/add", t, Fe);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Ee(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Fe);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Ee(t)}` : ""}${gn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ie = new ws({ base: vn ? "/p" : "" }), Ki = (e) => De.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Yi = { claude: "Claude Code", codex: "Codex" };
Object.entries(Yi).map(([e, t]) => ({ key: e, label: t }));
const Ws = (e) => e.status === "stopped" ? 1 : 0, Ji = "main", Zi = (e) => e.filter((t) => t.role === Ji).sort((t, n) => Ws(t) - Ws(n) || xe(n.heard_at) - xe(t.heard_at))[0] || null, Xi = { me: 1, people: [] }, K = ms({
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
_a("journal.activity", () => K.activity);
_a("journal.side.mini", () => K.sideMini);
const vt = T(() => Zi(K.agents));
T(() => !!vt.value && K.live.some((e) => e.agent.session === vt.value.session && e.environment === Ne.value.env));
T(() => !!vt.value && ["busy", "working"].includes(vt.value.status));
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
function Fs(e, t = !1) {
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
T(() => !K.settings || K.settings.features.file_feed !== !1);
const al = T(() => !K.settings || K.settings.features.status_bar !== !1);
T(() => K.settings && K.settings.workers && K.settings.workers.mode || sl);
T(() => !K.settings || !K.settings.tasks || K.settings.tasks.auto !== !1);
T(() => !!(K.settings && K.settings.reviewing && K.settings.reviewing.reviewer));
T(() => !K.settings || K.settings.features.sharing !== !1);
const sn = 50, ks = 100, ol = { messages: 25 }, Re = (e) => ol[e] || sn;
function rl(e, t) {
  if (e !== "messages") return Math.max(t.length - Re(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Re(e)) return s;
  return 0;
}
const il = "review_step", ll = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === il).sort((t, n) => t.id - n.id), cl = 5, ul = 500, dl = 3e3, hl = () => K.entries.length ? K.entries[K.entries.length - 1].id : 0, Yt = { env: "", id: 0 }, fl = () => !!(K.bar && K.bar.length) || nl(vt.value && vt.value.status);
function pl({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function ml() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: ks })))).then(ll);
}
function gl() {
  return Yt.env !== ie.env() && Object.assign(Yt, { env: ie.env(), id: hl() }), ie.entries(Yt.id);
}
function vl(e) {
  e.length && (Yt.id = e[e.length - 1].id, lc(e));
}
async function yl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", sn);
}
const Jn = /* @__PURE__ */ new Map();
async function Zn(e, t) {
  const n = `${e}:${ie.env()}`, s = Jn.get(n);
  if (!s) return Hs(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(nn)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ie.list("workers", { limit: t, since: a, after: o });
  if (!r.is_last_page)
    return Jn.delete(n), Zn(e, t);
  const i = new Set(r.rows.map((c) => c.id));
  return Hs(
    n,
    [...s.filter((c) => !i.has(c.id)), ...r.rows].sort((c, u) => c.id - u.id)
  );
}
const Hs = (e, t) => (Jn.set(e, t), t);
async function Us(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Vs = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => fl() ? ul : dl,
    take: (e) => Array.isArray(e) && (K.bar = e),
    active: () => al.value
  },
  "agents.index": { read: () => Us(ie, cl), every: 1e3, take: (e) => K.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => K.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      K.summary = e, Ni(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => K.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => K.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (K.people = e) },
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
  "inspector.agents": { read: ({ client: e }) => Us(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: sn }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: sn }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), wl = 6e4, kl = 3e3, bl = 4, $l = 300, xl = 5e3, Na = /* @__PURE__ */ new Map();
function yn(e) {
  if (!(e in Vs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Vs[e];
}
function Ml(e) {
  const t = yn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return xl;
  }
}
const _l = (e) => e / 2 + Math.random() * e / 2, ja = (e) => [...e.users.values()].pop(), bs = (e) => Na.get(e.place) === e, Sl = () => Math.random() * $l, $s = () => document.hidden;
function El(e) {
  const t = Ml(e);
  return e.failures ? _l(Math.min(e.key === Ia ? kl : wl, t * 2 ** e.failures)) : Math.max(t, bl * e.took);
}
function Pa(e, t) {
  clearTimeout(e.timer), !(!bs(e) || e.paused || $s()) && (e.timer = setTimeout(() => Al(e), t));
}
function Al(e) {
  return bs(e) ? e.running ? (e.again = !0, e.running) : (e.running = Bl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Cl = (e) => {
  var t, n;
  return !e.paused && !$s() && (((n = (t = yn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && ja(e).active() && (!Ra() || e.key === Ia);
};
async function Ol(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await De.attemptOnce(() => yn(e.key).read(ja(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Tl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = yn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Bl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Cl(e) && Tl(e, await Ol(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && bs(e) && !e.paused);
  Pa(e, El(e));
}
const Il = () => $s() || Na.forEach((e) => Pa(e, Sl()));
document.addEventListener("visibilitychange", Il);
const Rl = 60, Ll = (e, t) => xe(e.created_at) >= xe(t.created_at) - Rl, Dl = (e, t) => e.id > 0 && e.table === t.table && Ll(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), xs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Dl(s, n))), Sn = [
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
}, Nl = ["secrets", "plugins"], qa = Object.keys(It).filter((e) => !(vn && Nl.includes(e)));
T(() => qa.map((e) => ({ name: e, ...It[e] })));
const Rt = (e) => It[e], Wa = new Map(qa.flatMap((e) => [e, e.replace(/s$/, ""), It[e].title.toLowerCase()].map((t) => [t, e]))), at = (e) => Wa.get(String(e).toLowerCase()) || "", Fa = [...Wa.keys()].sort((e, t) => t.length - e.length).join("|"), Xe = /* @__PURE__ */ new Set(), Ms = F(0), Lt = /* @__PURE__ */ new Set(), Dt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Xn = /* @__PURE__ */ new Set(), jl = /* @__PURE__ */ new Map(), Pl = /* @__PURE__ */ new Map();
let ft = !1, Mt = null;
const ql = (e, t) => e.id - t.id, Wl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Fl = { messages: Wl }, Ha = (e) => Fl[e] || ql;
function Ua(e) {
  return Ms.value, Xe.has(e) || (Xe.add(e), K.booted && (!Lt.has(e) || Dt.has(e)) && queueMicrotask(() => kn([e], !1))), K.rows[e] || [];
}
function Hl(e) {
  const t = K.rows[e] || [], n = rl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  K.rows[e] = t.filter((a) => s.has(a) || Mi(e) && !Oa(a)), K.paging.size[e] = Re(e), K.paging.more[e] = !0;
}
const Ul = /* @__PURE__ */ new Set();
function Vl() {
  Xe.forEach(Hl), Xe.clear(), jl.clear(), Pl.clear(), Ms.value += 1;
}
be(() => `${Ne.value.env}/${Ne.value.page}/${Ne.value.open ? Ne.value.open.table : ""}`, Vl);
be(
  () => K.booted,
  (e) => e && kn(
    [...Xe].filter((t) => !Lt.has(t)),
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
  Lt.add(e), Ms.value += 1;
  const n = K.rows[e] || [];
  K.rows[e] = [...Va(n, t.rows), ...xs(n.filter((s) => s.id === 0), t.rows)], K.paging.size[e] = K.paging.size[e] || Re(e), K.paging.more[e] = !t.is_last_page;
}
async function zl(e) {
  const t = new Set((K.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Re(e) });
  wn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = xs((K.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return za(e, { ...n, rows: [...n.rows, ...a].sort(Ha(e)) }), K.paging.size[e] = Re(e), Ga.has(e) && await Ka(e), K.rows[e];
}
const wn = (e, t) => K.counts = { ...K.counts, [e]: t };
async function Gl(e) {
  const t = K.rows[e] || [], n = Math.max(0, ...t.map(nn)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ie.list(e, { limit: Re(e), since: n, after: s });
  if (wn(e, a.counts), !a.is_last_page) return zl(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = xs(t.filter((i) => !o.has(i.id)), a.rows).concat(Va(t, a.rows));
  return K.rows[e] = r.sort(Ha(e)), K.paging.size[e] = K.rows[e].length, K.rows[e];
}
const En = /* @__PURE__ */ new Set();
async function Kl(e, t = !1) {
  e.forEach((n) => Dt.delete(n)), e.forEach((n) => Xn.add(n));
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
  const t = (K.rows[e] || []).filter((a) => Qn(a) && (e !== "plans" || !Oa(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  K.rows[e] = (K.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Zl = (e, t) => !Lt.has(e) || t && (K.paging.size[e] || Re(e)) === Re(e) && !Ul.has(e);
async function Xl(e, t) {
  if (!Xe.has(e)) return Jl(e);
  const n = await (Zl(e, t) ? Yl(e) : Gl(e));
  return Ga.has(e) && await Ka(e), n;
}
async function Ql() {
  const [e, t] = await Promise.all([ie.entries(0, ks), ie.settings()]);
  Za([...Ct(Ja(), []), ...e]), JSON.stringify(t) !== JSON.stringify(K.settings) && (K.settings = t);
}
const ec = (e, t) => Xl(e, t).then(
  () => null,
  () => e
);
async function tc(e, t) {
  const n = (await Promise.all(e.map((s) => ec(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), Dt.add(s))), t && await Ql(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ya = 1e3, nc = 15e3;
let Ft = Ya;
async function sc() {
  return Mt || (Mt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !En.has(e)) || ft; ) {
      const e = ft, t = [...e ? Object.keys(K.rows) : Ke].filter((s) => It[s] && (Xe.has(s) || s in K.rows)).filter((s) => e || !Xe.has(s) || Dt.has(s) || !Lt.has(s)).filter((s) => !En.has(s)), n = [...Ke].filter((s) => En.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), ft = !1;
      try {
        await Kl(t, e), Ft = Ya;
      } catch {
        ft = ft || e, await new Promise((a) => setTimeout(a, Ft)), Ft = Math.min(Ft * 2, nc);
      }
    }
  })().finally(() => Mt = null), Mt);
}
function kn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Xn.has(n)).forEach((n) => {
    Ke.add(n), t && Dt.add(n);
  }), Ke.has("settings") && (ft = !0), sc();
}
const Ja = () => {
  var e;
  return `typed-entries:${((e = K.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Za(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  K.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ks), mn(Ja(), K.entries.slice(-50));
}
const ac = ["created", "updated", "deleted"], oc = { phases: ["phases", "plans"] }, es = (e) => oc[e] || [e], rc = (e) => ac.includes(e.entry_type) ? [...es(e.data.table), ...(e.data.joins || []).flatMap(es)] : [];
function ic(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of es(t.data.table).filter((s) => K.rows[s]))
      K.rows[n] = K.rows[n].filter((s) => s.id !== t.data.id);
}
function lc(e) {
  Za([...K.entries, ...e]), ic(e), kn([...new Set(e.flatMap(rc))].filter((t) => t && t !== "agents"));
}
Ki((e) => K.streamOpen || kn([e]));
const ts = [], cc = 2e3, Ge = /* @__PURE__ */ new Map(), uc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, dc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function lt(e, { first: t = !1 } = {}) {
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
function zs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function gc(e) {
  const [t, , ...n] = e, s = zs(t).map((o) => `<th>${Ot(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${zs(o).map((r) => `<td>${Ot(r)}</td>`).join("")}</tr>`
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
const Gs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
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
    if (Gs(t, s)) {
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
    for (; r < t.length && t[r].trim() && !Gs(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
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
const eo = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, an = (e) => String(e || "").replace(eo, (t, n, s, a) => a), bc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Ht = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, $c = /^Traceback \(most recent call last\):/m, xc = 8;
function to(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, xc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Mc(e) {
  const t = [...e.matchAll(bc)].map((s) => s.index);
  if (Ht.lastIndex = 0, !t.length || !Ht.test(e)) return null;
  Ht.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Ht)];
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
lt((e) => {
  const t = an(e), n = _c(t) || Mc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const ss = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Sc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Ec = `${ss} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ac = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Cc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ks = {
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
function Ys(e, t, n) {
  return n && e.startsWith(n, t);
}
function Oc(e, t) {
  const n = Ks[t] || Ks.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Ys(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Ys(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? f.toLowerCase() : f, $ = n.property && /^\s*:/.test(e.slice(o + f.length));
      r(s.has(m) ? "keyword" : $ ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
const Ic = 1500, Js = /* @__PURE__ */ new WeakMap();
async function Rc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Bc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Js.get(t)), Js.set(
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
function Zs(e, t) {
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
      const c = t.findIndex((f, m) => m > o && f.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Zs(t.slice(o + 1, u).map(an), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
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
        a(), n.push(Zs([...u, ...t.slice(o, c)].map(an), "")), o = c;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
lt((e) => Fc(e));
const Hc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Uc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Vc(e) {
  const t = Hc.exec(e);
  if (t && at(t[1])) return { at: t.index, length: t[0].length, table: at(t[1]), id: Number(t[2]), label: t[3] };
  const n = Uc.exec(e), s = n && at(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function zc(e, t, n, s) {
  const a = Xa(s, e, t), o = an(a ? bi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(Rt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
lt(
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
  const n = Yc.exec(e), [, s, a, o, r, i] = n || [], c = n && at(s || o), u = c && Xa(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const f = ie.in(t.env).fileUrl(c, u.id, i), m = `${Rt(c).title} ${u.id} · ${Ue(i)}`, $ = Kc(i) ? `<img class="file-card-image" src="${f}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Ue(i)}">${$}<span class="file-card-name">${m}</span></a>` };
}
function Xc(e) {
  const t = Jc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
lt(
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
lt((e) => e.replace(Qc, (t, n) => `<code>${n}</code>`));
const Xs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${gn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
lt(
  (e, t) => e.replace(eo, (n, s, a, o) => Xs[s] ? Xs[s](a, o, t) : o)
);
const eu = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, tu = new RegExp(`\\b(${Fa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), nu = new RegExp(`\\b(${Fa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), su = (e, t) => `<a class="row-pill" href="#" data-peek="${at(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, au = (e) => e.replace(nu, (t, n, s) => s.replace(/\d+/g, (a) => su(n.replace(/s$/i, ""), a))), ou = (e) => au(e).replace(
  tu,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${at(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
lt(
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
`).find((o) => o.trim()) || "" : t.text, a = ns(s, { env: Ne.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(pt) && z(pt)(...o)),
      innerHTML: n.value
    }, null, 8, ru)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(pt) && z(pt)(...o)),
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
      (l(!0), d(X, null, re(e.items, (o, r) => (l(), G(it(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Q(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          p("span", pu, w(o.label), 1),
          o.badge ? (l(), G(Ca, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : N("", !0),
          o.note ? (l(), d("span", mu, w(o.note), 1)) : N("", !0)
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
      (l(!0), d(X, null, re(e.rows, (i, c) => (l(), G(it(i.open ? "button" : "div"), {
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
      !e.rows.length && e.empty ? (l(), d("div", wu, w(e.empty), 1)) : N("", !0)
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
    return (s, a) => (l(), G(it(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Q(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        p("span", $u, w(e.value), 1),
        p("span", xu, w(e.label), 1),
        e.note ? (l(), d("span", Mu, w(e.note), 1)) : N("", !0)
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
    return (o, r) => (l(), G(gs, {
      value: e.node.type
    }, {
      stack: V(() => [
        H(Kt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: V(() => [
        H(Kt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: V(() => [
        H(Kt, {
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
    const n = e, s = t, a = ($) => $ in (n.document.pages || {}), o = F(!!n.page && !a(n.page)), r = F(n.page && !o.value ? [n.page] : []), i = T(() => r.value.at(-1) || n.document.start), c = T(() => (n.document.pages || {})[i.value] || null), u = ($) => ((n.document.pages || {})[$] || {}).title || $, f = ($) => {
      o.value = !1, r.value = [...r.value, $];
    }, m = ($) => {
      o.value = !1, r.value = r.value.slice(0, $);
    };
    return be(
      () => n.document.start,
      () => r.value = []
    ), ($, x) => (l(), d("div", Cu, [
      e.document.broken ? (l(), G(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          he(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), G(Qt, {
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
            onClick: x[0] || (x[0] = (j) => m(0))
          }, w(u(e.document.start)), 3),
          (l(!0), d(X, null, re(r.value, (j, k) => (l(), d(X, {
            key: `${k}-${j}`
          }, [
            x[2] || (x[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: Q(["step", { current: k === r.value.length - 1 }]),
              onClick: (y) => m(k + 1)
            }, w(u(j)), 11, Tu)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Bu, "What you opened is no longer in this dashboard. Here is its start page.")) : N("", !0),
        H(hn, {
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
                onFile: x[1] || (x[1] = (j) => s("file", j))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : N("", !0)
    ]));
  }
}, Av = /* @__PURE__ */ Z(Iu, [["__scopeId", "data-v-fbe83734"]]);
function Ru(e, t, n, s = () => window) {
  Le(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Lu = (e, t = () => !0) => Ru("keydown", (n) => n.key === "Escape" && t() && e());
function Du(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = F(!1), a = T(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Lu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Nu = 80, dt = ms([]);
function ju(e) {
  const t = Symbol("layer"), n = () => dt.includes(t) && dt.splice(dt.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !dt.includes(t) && dt.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), T(() => Nu + Math.max(0, dt.indexOf(t)));
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
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : oo, document.addEventListener("keydown", a), pn(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Du(s, n), i = ju(a), c = F(null), u = F(null), f = F(null), m = ya(), $ = F(!1), x = Date.now();
    n.modal && qu(u, () => s("escape"), f);
    function j() {
      if (!n.modal) return n.closable && o();
      $.value = !0, setTimeout(() => $.value = !1, zu);
    }
    function k(P) {
      !n.modal || Date.now() - x >= Vu || ![" ", "Enter"].includes(P.key) || (P.preventDefault(), P.stopPropagation());
    }
    const y = () => c.value && (c.value.scrollTop = c.value.scrollHeight), B = new MutationObserver(y);
    return be(c, (P) => {
      B.disconnect(), P && n.follow && (B.observe(P, { childList: !0, subtree: !0, characterData: !0 }), y());
    }), Ae(() => B.disconnect()), (P, te) => (l(), G(wa, { to: "body" }, [
      H(hn, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: V(() => [
          z(a) ? (l(), d("div", {
            key: 0,
            class: Q(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ke({ zIndex: z(i) }),
            onClick: _e(j, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: Q(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: $.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(m) : void 0,
              onKeydownCapture: k
            }, [
              e.bare ? N("", !0) : (l(), d("header", Fu, [
                p("h3", {
                  id: z(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, Hu),
                e.closable ? (l(), G(ys, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : N("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: Q(["dialog-body", { bare: e.bare }])
              }, [
                we(P.$slots, "default", {}, void 0, !0)
              ], 2),
              P.$slots.foot ? (l(), d("footer", Uu, [
                we(P.$slots, "foot", {}, void 0, !0)
              ])) : N("", !0)
            ], 42, Wu)
          ], 6)) : N("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ku = /* @__PURE__ */ Z(Gu, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ie = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Yu = 6;
function _s(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Ju = (e) => {
  const t = _s(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
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
      const m = i(f).map(($) => c.get($));
      return m.length ? m.reduce(($, x) => $ + x, 0) / m.length : c.get(f);
    };
    return [...r].sort((f, m) => u(f) - u(m));
  };
  for (let r = 0; r < Yu; r++) {
    const i = r % 2 === 0, c = s.map((u, f) => f);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const f = (m) => t.filter(($) => $[i ? 1 : 0] === m).map(($) => $[i ? 0 : 1]);
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
  const t = [...new Set(e.flatMap(([b, v]) => [b, v]))], n = new Set(e.map(([, b]) => b)), s = t.filter((b) => !n.has(b)), a = Zu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((b, v) => !a.has(v)), r = Xu(t, o), i = Qu(t, o, r), c = new Map(t.map((b) => [b, Ju(b)])), u = i.map((b) => b.reduce((v, L) => v + c.get(L).width, 0) + Be.across * (b.length - 1)), f = Math.max(...u) + Be.margin * 2, m = sd(e, r, i.length), $ = /* @__PURE__ */ new Map();
  let x = Be.margin;
  i.forEach((b, v) => {
    let L = (f - u[v]) / 2;
    const C = Math.max(...b.map((q) => c.get(q).height));
    b.forEach((q) => {
      const M = c.get(q);
      $.set(q, { ...M, x: L, y: x + (C - M.height) / 2 }), L += M.width + Be.across;
    }), x += C + (m[v] ?? Be.down);
  });
  const j = e.map(([b, v, L], C) => ({ from: b, to: v, label: L || "", back: a.has(C) || r.get(v) <= r.get(b) }));
  ed(j, $);
  const k = j.map((b) => ad(b, $.get(b.from), $.get(b.to))), y = [...$.values()], B = ld(k, y), P = Math.max(x - Be.down, ...B.filter((b) => b.label).map((b) => b.label.y + b.label.height));
  return { width: Math.max(f - Be.margin, ...B.filter((b) => b.label).map((b) => b.label.x + b.label.width)) + Be.margin, height: P + Be.margin, nodes: y, arrows: B };
}
const nd = (e) => e ? _s(e, Ie.lineChars).length * Ie.line + Ie.pad * 2 : 0;
function sd(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += nd(r) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function ad(e, t, n) {
  const s = e.label ? _s(e.label, Ie.lineChars) : [], a = s.length ? Math.max(...s.map(($) => $.length)) * Ie.charWidth + Ie.pad * 2 : 0, o = s.length * Ie.line + (s.length ? Ie.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - i) / 2, m = [{ x: r, y: i }, { x: r, y: i + f }, { x: c, y: u - f }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: m, path: `M${r} ${i} C${r} ${i + f} ${c} ${u - f} ${c} ${u}` };
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
    }, i = id.flatMap((c) => rd.map((u) => a(u, c))).find((c) => !n.some((u) => Qs(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => Qs(i, c)); ) i.y += Ie.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Ie.line, pad: Ie.pad } };
  });
}
const Qs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, cd = { class: "flowchart-tools" }, ud = ["width", "height", "viewBox", "aria-label"], dd = ["d"], hd = ["x", "y", "width", "height"], fd = ["x", "y"], pd = ["x", "dy"], md = {
  key: 0,
  class: "flowchart-label"
}, gd = ["x", "y", "width", "height"], vd = ["x", "y"], yd = ["x", "dy"], wd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => td(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = F(null), i = F({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var B;
      const k = (B = r.value) == null ? void 0 : B.getBoundingClientRect();
      if (!(k != null && k.width)) return;
      const y = Math.min(k.width / a.value.width, k.height / a.value.height, 1.5);
      i.value = { zoom: y, x: (k.width - a.value.width * y) / 2, y: (k.height - a.value.height * y) / 2 };
    }
    function f(k, y, B) {
      const { zoom: P, x: te, y: b } = i.value, v = Math.min(o.most, Math.max(o.least, P * k));
      i.value = { zoom: v, x: y - (y - te) * v / P, y: B - (B - b) * v / P };
    }
    function m(k) {
      const y = r.value.getBoundingClientRect();
      f(k, y.width / 2, y.height / 2);
    }
    function $(k) {
      const y = r.value.getBoundingClientRect();
      k.ctrlKey || k.metaKey ? f(k.deltaY < 0 ? o.step : 1 / o.step, k.clientX - y.left, k.clientY - y.top) : i.value = { ...i.value, x: i.value.x - k.deltaX, y: i.value.y - k.deltaY };
    }
    function x(k) {
      var y, B, P;
      k.preventDefault(), (y = window.getSelection()) == null || y.removeAllRanges(), c = { x: k.clientX - i.value.x, y: k.clientY - i.value.y }, (P = (B = r.value).setPointerCapture) == null || P.call(B, k.pointerId);
    }
    function j(k) {
      c && (i.value = { ...i.value, x: k.clientX - c.x, y: k.clientY - c.y });
    }
    return Le(u), (k, y) => (l(), G(Ku, {
      title: e.title,
      large: "",
      onClose: y[4] || (y[4] = (B) => s("close"))
    }, {
      default: V(() => [
        p("div", cd, [
          H(ye, {
            small: "",
            onClick: y[0] || (y[0] = (B) => m(o.step))
          }, {
            default: V(() => [...y[5] || (y[5] = [
              he("Zoom in", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            small: "",
            onClick: y[1] || (y[1] = (B) => m(1 / o.step))
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
          onWheel: _e($, ["prevent"]),
          onPointerdown: x,
          onPointermove: j,
          onPointerup: y[2] || (y[2] = (B) => Bs(c) ? c.value = null : c = null),
          onPointercancel: y[3] || (y[3] = (B) => Bs(c) ? c.value = null : c = null)
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
            (l(!0), d(X, null, re(a.value.arrows, (B, P) => (l(), d("path", {
              key: `arrow-${P}`,
              class: "flowchart-arrow",
              d: B.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, dd))), 128)),
            (l(!0), d(X, null, re(a.value.nodes, (B) => (l(), d("g", {
              key: B.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: B.x,
                y: B.y,
                width: B.width,
                height: B.height,
                rx: "8"
              }, null, 8, hd),
              p("text", {
                x: B.x + B.width / 2,
                y: B.y + B.padY + B.line / 2
              }, [
                (l(!0), d(X, null, re(B.lines, (P, te) => (l(), d("tspan", {
                  key: te,
                  x: B.x + B.width / 2,
                  dy: te ? B.line : 0
                }, w(P), 9, pd))), 128))
              ], 8, fd)
            ]))), 128)),
            (l(!0), d(X, null, re(a.value.arrows, (B, P) => (l(), d(X, {
              key: `label-${P}`
            }, [
              B.label ? (l(), d("g", md, [
                p("rect", {
                  x: B.label.x,
                  y: B.label.y,
                  width: B.label.width,
                  height: B.label.height,
                  rx: "4"
                }, null, 8, gd),
                p("text", {
                  x: B.label.x + B.label.width / 2,
                  y: B.label.y + B.label.pad + B.label.line / 2
                }, [
                  (l(!0), d(X, null, re(B.label.lines, (te, b) => (l(), d("tspan", {
                    key: b,
                    x: B.label.x + B.label.width / 2,
                    dy: b ? B.label.line : 0
                  }, w(te), 9, yd))), 128))
                ], 8, vd)
              ])) : N("", !0)
            ], 64))), 128))
          ], 12, ud))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, kd = /* @__PURE__ */ Z(wd, [["__scopeId", "data-v-51d24cfe"]]), ea = {
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
    const t = e, n = T(() => ea[t.name] || ea.dot);
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
      e.open ? (l(), d("span", _d, w(e.label), 1)) : N("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Md));
  }
}, ro = /* @__PURE__ */ Z(Sd, [["__scopeId", "data-v-3b292e09"]]), Ed = 120, An = 280, Ad = 160, Cd = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function io(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = F(t()), a = F("");
  let o = 0;
  const r = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const f = e.value, m = ++o;
    if (!f || !f.offsetWidth || Cd()) {
      s.value = u;
      return;
    }
    const $ = { width: f.offsetWidth, height: f.offsetHeight };
    if (r(f, $), a.value = "leaving", await n(Ed), m !== o) return;
    s.value = u, a.value = "resizing", await pn(), i(f);
    const x = { width: f.offsetWidth, height: f.offsetHeight };
    r(f, $), f.offsetWidth, f.style.transition = `width ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, x), await n(An), m === o && (i(f), a.value = "entering", await n(Ad), m === o && (a.value = ""));
  }
  return be(t, (u) => c(u)), yt(() => {
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
    const n = e, s = t, a = F(!1), o = F(null), { folded: r, phase: i } = io(o, () => !a.value), c = T(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = T(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (l(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Q(["growing-card-wrap", z(i), { open: !z(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Od, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: m[0] || (m[0] = ($) => a.value = !a.value)
        }, [
          p("span", Bd, [
            e.bad ? (l(), G(Ve, {
              key: 0,
              name: "cross"
            })) : c.value ? (l(), d(X, { key: 1 }, [
              he(w(c.value), 1)
            ], 64)) : (l(), G(Me, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Id, w(e.title), 1),
          H(Tt, { open: a.value }, null, 8, ["open"])
        ], 8, Td),
        e.action ? (l(), G(ro, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: m[1] || (m[1] = ($) => s("act"))
        }, null, 8, ["label", "open"])) : N("", !0)
      ]),
      p("div", Rd, [
        p("div", Ld, [
          (l(!0), d(X, null, re(u.value, ($, x) => (l(), d("p", {
            key: x,
            class: "growing-card-text"
          }, w($), 1))), 128))
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
        s.value !== "sent" ? (l(), d("path", qd)) : N("", !0)
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
  }), Ae(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
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
const Jd = ["data-ref"], Zd = ["data-from", "data-ref"], Xd = { class: "message-body" }, Qd = ["title"], eh = ["innerHTML"], th = ["innerHTML"], nh = {
  class: "message-faces",
  "data-message-faces": ""
}, sh = ["title", "data-face", "onClick"], ah = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, oh = ["title", "data-reaction", "onClick"], rh = {
  key: 0,
  class: "message-reaction-count"
}, ih = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, lh = ["href", "title"], ch = ["src", "alt"], uh = ["href"], dh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, hh = {
  key: 1,
  "data-message-links-rows": ""
}, fh = { class: "message-foot" }, ph = { class: "message-time" }, mh = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, gh = 1500, vh = "An earlier message", yh = "about", wh = 3, kh = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    var O;
    const n = e, s = t, a = F(!1), o = F(null), r = T(() => ["user", "comment"].includes(n.message.type)), i = T(() => {
      const [S, Y] = (n.message.commented_row || ":").split(":"), U = at(S);
      return U ? { ref: `${U}:${Y}`, label: `${Rt(U).title.toLowerCase()} ${Y}` } : null;
    }), c = T(() => r.value && !n.message.read_at && !n.message.local);
    async function u() {
      var S;
      await ((S = navigator.clipboard) == null ? void 0 : S.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, gh);
    }
    const f = T(() => ns(n.message.text ?? "", { env: "" })), m = T(() => JSON.parse(n.message.flowchart_edges || "[]")), $ = F(!1), x = T(() => ns(n.quote || vh, { env: "" }));
    function j() {
      const S = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      S ? S.scrollIntoView({ block: "center", behavior: "smooth" }) : rt(`messages:${n.message.parent_id}`);
    }
    Gd(o, () => `${n.message.text} ${n.quote}`);
    const k = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, y = (S) => `/api/files/message/${n.message.id}/${encodeURIComponent(S)}`, B = T(() => JSON.parse(n.message.captions || "{}")), P = T(() => (n.message.files ?? []).map((S) => ({ name: S, address: y(S), isImage: k.test(S), title: B.value[S] || S }))), te = T(() => Da(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), b = je(Pe, null), v = F([]), L = F(!1), C = T(() => `Linked: ${v.value.join(", ")}`), q = T(() => v.value.length >= wh), M = T(() => `${v.value.length} linked ${v.value.every((S) => S.startsWith("task ")) ? "tasks" : "rows"}`);
    async function E() {
      if (!r.value || !(b != null && b.read) || n.message.local) return;
      const S = await b.read(`link list --source message:${n.message.id}`);
      S.ok && (v.value = (S.value.rows ?? S.value ?? []).filter((Y) => Y.link_type === yh).map((Y) => `${Y.target_model} ${Y.target_id}`));
    }
    E(), (O = b == null ? void 0 : b.follow) == null || O.call(b, ["link.*"], E);
    const g = F(!1), h = T(() => Yd(n.message.reactions));
    function A(S) {
      g.value = !1, s("react", n.message, S);
    }
    return (S, Y) => e.message.peer || e.message.recipient ? (l(), d("div", {
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
          class: Q(["message-card", "md", { comment: i.value }]),
          onClick: Y[3] || (Y[3] = (...U) => z(pt) && z(pt)(...U))
        }, [
          i.value ? (l(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: Y[0] || (Y[0] = _e((U) => z(rt)(i.value.ref), ["stop"]))
          }, [
            H(Me, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + w(i.value.label), 1)
          ], 8, Qd)) : N("", !0),
          e.message.parent_id ? (l(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: _e(j, ["stop"]),
            innerHTML: x.value
          }, null, 8, eh)) : N("", !0),
          p("div", { innerHTML: f.value }, null, 8, th),
          m.value.length ? (l(), d(X, { key: 2 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: Y[1] || (Y[1] = (U) => $.value = !0)
            }, "Open the flowchart"),
            $.value ? (l(), G(kd, {
              key: 0,
              title: e.message.text,
              edges: m.value,
              onClose: Y[2] || (Y[2] = (U) => $.value = !1)
            }, null, 8, ["title", "edges"])) : N("", !0)
          ], 64)) : N("", !0)
        ], 2),
        p("div", {
          class: Q(["message-tools", { picking: g.value }]),
          "data-message-tools": ""
        }, [
          g.value ? (l(), d(X, { key: 0 }, [
            p("div", nh, [
              (l(!0), d(X, null, re(z(Kd), (U) => (l(), d("button", {
                key: U,
                type: "button",
                class: "message-face",
                title: `React ${U}`,
                "data-face": U,
                onClick: (ue) => A(U)
              }, w(U), 9, sh))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: Y[4] || (Y[4] = (U) => g.value = !1)
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
              onClick: Y[5] || (Y[5] = (U) => g.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: Y[6] || (Y[6] = (U) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: u
            }, w(a.value ? "Copied" : "Copy"), 1),
            c.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: Y[7] || (Y[7] = (U) => s("delete", e.message))
            }, "Delete")) : N("", !0)
          ], 64))
        ], 2)
      ]),
      h.value.length ? (l(), d("div", ah, [
        (l(!0), d(X, null, re(h.value, (U) => (l(), d("button", {
          key: U.emoji,
          type: "button",
          class: Q(["message-reaction", { mine: U.mine }]),
          title: U.title,
          "data-reaction": U.emoji,
          onClick: (ue) => s("react", e.message, U.emoji)
        }, [
          he(w(U.emoji) + " ", 1),
          U.count > 1 ? (l(), d("span", rh, w(U.count), 1)) : N("", !0)
        ], 10, oh))), 128))
      ])) : N("", !0),
      P.value.length ? (l(), d("div", ih, [
        (l(!0), d(X, null, re(P.value, (U) => (l(), d(X, {
          key: U.name
        }, [
          U.isImage ? (l(), d("a", {
            key: 0,
            href: U.address,
            target: "_blank",
            class: "message-image",
            title: U.title
          }, [
            p("img", {
              src: U.address,
              alt: U.name
            }, null, 8, ch)
          ], 8, lh)) : (l(), d("a", {
            key: 1,
            href: U.address,
            target: "_blank",
            class: "message-file"
          }, w(U.name), 9, uh))
        ], 64))), 128))
      ])) : N("", !0),
      v.value.length ? (l(), d("div", dh, [
        H(Ve, {
          class: "message-links-icon",
          name: "linked"
        }),
        q.value && !L.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: Y[8] || (Y[8] = (U) => L.value = !0)
        }, w(M.value), 1)) : (l(), d("span", hh, [
          H(st, {
            text: C.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : N("", !0),
      p("div", fh, [
        p("time", ph, w(te.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", mh, "#" + w(e.message.id), 1)) : N("", !0),
        r.value ? (l(), G(Fd, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : N("", !0)
      ])
    ], 8, Zd));
  }
}, Cv = /* @__PURE__ */ Z(kh, [["__scopeId", "data-v-5a08c284"]]), on = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Cn = 200, lo = (e) => {
  var t;
  return ((t = on.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? on[0].key;
}, Ov = (e) => {
  var t;
  return ((t = on.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, bh = ["aria-label"], $h = 300, ta = 400, xh = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Cn } },
  setup(e) {
    const t = e, n = T(() => lo(t.value)), s = T(() => n.value < Cn ? [1, 0.25, 0.25] : n.value === Cn ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: Q(["ico", "prio", { hot: n.value >= ta, high: n.value >= $h && n.value < ta }]),
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
    ], 10, bh));
  }
}, Tv = /* @__PURE__ */ Z(xh, [["__scopeId", "data-v-b10e610f"]]), Mh = ["aria-checked", "aria-haspopup", "onClick"], _h = {
  key: 0,
  class: "segmented-dot"
}, Sh = {
  key: 1,
  class: "segmented-count"
}, Eh = {
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
        (l(!0), d(X, null, re(e.options, (i) => gt((l(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Q(["segmented-option", { on: i.key === e.value }]),
          onClick: (c) => n("pick", i.key)
        }, [
          i.dot ? (l(), d("span", _h)) : N("", !0),
          he(" " + w(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", Sh, w(i.count), 1)) : N("", !0)
        ], 10, Mh)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, as = /* @__PURE__ */ Z(Eh, [["__scopeId", "data-v-ca953072"]]), na = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Ah = {
  key: 1,
  class: "text-field-label"
}, Ch = {
  key: 2,
  class: "text-field-end"
}, Oh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ zn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Vn(e, "modelValue"), s = ka(), a = "onUpdate:modelValue" in (((f = Yo()) == null ? void 0 : f.vnode.props) || {}), o = T(() => a ? n.value : s.value), r = (m) => a && (n.value = m.target.value), i = T(
      () => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), c = T(() => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "value"))), u = F(null);
    return t({ focus: () => u.value && u.value.focus() }), (m, $) => e.label || e.icon || m.$slots.end ? (l(), d("label", {
      key: 0,
      class: Q(["text-field", { large: e.large, ended: m.$slots.end }, z(s).class]),
      style: ke(z(s).style)
    }, [
      e.icon ? (l(), G(Me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : N("", !0),
      e.label ? (l(), d("span", Ah, w(e.label), 1)) : N("", !0),
      gt(p("input", ot({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(na), o.value]
      ]),
      m.$slots.end ? (l(), d("span", Ch, [
        we(m.$slots, "end", {}, void 0, !0)
      ])) : N("", !0)
    ], 6)) : gt((l(), d("input", ot({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
      [z(na), o.value]
    ]);
  }
}), Th = /* @__PURE__ */ Z(Oh, [["__scopeId", "data-v-d9c38ca8"]]);
function Bh(e, t, { incremental: n = !1 } = {}) {
  const s = vs(), a = F([]), o = F(""), r = F(!1), i = F(""), c = F(null);
  async function u(k) {
    const y = await s.read(`${e} --before-id ${k + 1} --limit 1`);
    if (!y.ok) return x();
    const B = y.value.rows.find((P) => P.id === k);
    a.value = B ? a.value.map((P) => P.id === k ? B : P) : a.value.filter((P) => P.id !== k);
  }
  async function f(k) {
    if (n && String((k == null ? void 0 : k.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((b) => b.id !== k.row_id));
    if (n && (k != null && k.row_id) && !String(k.event ?? "").endsWith(".create") && a.value.some((b) => b.id === k.row_id)) return u(k.row_id);
    if (!(n && a.value.length && String((k == null ? void 0 : k.event) ?? "").endsWith(".create"))) return x();
    const B = Math.max(...a.value.map((b) => b.id)), P = await s.read(`${e} --after-id ${B}`);
    if (!P.ok) return x();
    const te = new Set(a.value.map((b) => b.id));
    a.value = [...P.value.rows.filter((b) => !te.has(b.id)), ...a.value];
  }
  async function m() {
    if (!a.value.length) return !1;
    const k = Math.min(...a.value.map((P) => P.id)), y = await s.read(`${e} --before-id ${k}`);
    if (!y.ok || !y.value.rows.length) return !1;
    const B = new Set(a.value.map((P) => P.id));
    return a.value = [...a.value, ...y.value.rows.filter((P) => !B.has(P.id))], !0;
  }
  let $ = 0;
  async function x() {
    const k = ++$, y = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (k !== $) return;
    const B = y.ok ? s.shared ? [y.value] : y.value.rows : [], P = B.length ? Math.min(...B.map((te) => te.id)) : 0;
    a.value = n && y.ok && P ? [...a.value.filter((te) => te.id > Math.max(...B.map((b) => b.id))), ...B, ...a.value.filter((te) => te.id < P)] : B, o.value = y.ok ? "" : y.error, r.value = !0;
  }
  async function j(k) {
    const y = await s.run(k);
    return i.value = y.ok ? "" : y.error, c.value = y.ok ? y.value : null, await x(), y;
  }
  return s.follow(t, f), x(), { rows: a, failure: o, loaded: r, load: x, older: m, act: j, actionFailure: i, answer: c, context: s };
}
const Ih = { class: "title" }, Rh = { class: "state" }, Lh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Bh(t.line, t.events);
    return (o, r) => (l(), G(Vr, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: V(({ row: i }) => [
        p("span", Ih, w(i.title), 1),
        p("span", Rh, w(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Bv = /* @__PURE__ */ Z(Lh, [["__scopeId", "data-v-a69084cd"]]), On = F(Date.now() / 1e3);
let sa = 0, Ut = 0;
function Dh() {
  return Ut || (On.value = Date.now() / 1e3, sa = setInterval(() => On.value = Date.now() / 1e3, 1e3)), Ut += 1, ba() && $a(() => {
    Ut -= 1, Ut || clearInterval(sa);
  }), On;
}
const Nh = ["title", "data-figure-mark", "data-folded", "data-open"], jh = {
  key: 2,
  class: "worker"
}, Ph = { class: "head" }, qh = { key: 0 }, Wh = {
  key: 3,
  class: "status"
}, Fh = {
  key: 0,
  class: "figure"
}, Hh = {
  key: 1,
  class: "ran-for"
}, Uh = { key: 2 }, Vh = {
  key: 3,
  class: "news"
}, zh = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Gh = {
  key: 6,
  class: "settled"
}, Kh = {
  key: 1,
  class: "bar"
}, Yh = {
  key: 3,
  class: "detail body"
}, Jh = {
  key: 0,
  class: "body-label"
}, Zh = ["title"], Xh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ka(), s = ["onClick", "onAct"], a = T(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = F(!1), r = T(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = T(() => t.open !== void 0), c = T(() => i.value || r.value), u = T(() => i.value ? t.open : o.value), f = T(() => i.value ? !t.open : r.value && !o.value), m = T(() => !!(t.mark.action && n.onAct)), $ = T(() => c.value || m.value || !!n.onClick), x = F(null), j = F(null), { folded: k, phase: y } = io(x, () => f.value);
    function B(le) {
      var me, Se;
      if (!(le.target !== x.value && !j.value.contains(le.target))) {
        if (i.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(le);
      }
    }
    const P = (le) => n.onAct(le), te = ["failed", "unfinished"], b = T(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? te.includes(t.mark.state) ? "danger" : "good" : ""), v = T(() => t.mark.color ? t.mark.color : b.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : b.value ? `var(--tone-${b.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), L = T(() => v.value || "var(--tone-work)"), C = T(() => !t.mark.ending && !t.mark.ended && b.value !== "stopped"), q = Dh(), M = T(
      () => t.mark.began_at && C.value && !t.mark.figure && !t.mark.counting ? el(q.value - t.mark.began_at) : ""
    ), E = T(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${Fs(me - le, !0)}` : Fs(q.value - le, !0) : M.value;
    }), g = ["bad", "danger", "warn"], h = T(() => g.includes(b.value) || t.mark.asks ? "attention" : C.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), A = ["bad", "danger"], O = T(() => A.includes(b.value)), S = T(() => h.value === "process" ? "running" : O.value ? "cross" : b.value === "stopped" ? "stopped" : b.value === "good" ? "tick" : ""), Y = T(
      () => !!(t.mark.figure || E.value || t.mark.docked || t.mark.stopping || S.value || t.mark.settled || t.mark.news)
    ), U = T(() => [t.mark.title, t.mark.time ? Da(t.mark.time) : ""].filter(Boolean).join(" · ")), ue = T(() => ({
      ...v.value ? { "--mark": v.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (l(), d("div", ot(a.value, {
      ref_key: "root",
      ref: x,
      class: [
        "mark",
        `w-${h.value}`,
        z(y),
        {
          open: u.value,
          live: $.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: v.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ue.value,
      title: U.value,
      "data-figure-mark": e.mark.key,
      "data-folded": z(k) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: B
    }), [
      (l(), G(it($.value ? "button" : "span"), {
        ref_key: "top",
        ref: j,
        class: "top",
        type: $.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!u.value) : void 0
      }, {
        default: V(() => [
          e.mark.markIcon ? (l(), G(Ve, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), G(Me, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), d("span", jh, w(e.mark.worker), 1)) : N("", !0),
          p("span", Ph, [
            H(st, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", qh, w(e.mark.name), 1)) : N("", !0),
            c.value ? (l(), G(Tt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : N("", !0)
          ]),
          Y.value ? (l(), d("span", Wh, [
            e.mark.figure ? (l(), d("span", Fh, w(e.mark.figure), 1)) : N("", !0),
            E.value ? (l(), d("span", Hh, w(E.value), 1)) : N("", !0),
            e.mark.stopping ? (l(), d("span", Uh, "Stopping")) : N("", !0),
            e.mark.news ? (l(), d("span", Vh, w(e.mark.news), 1)) : N("", !0),
            S.value === "running" ? (l(), d("span", zh)) : S.value ? (l(), G(Ve, {
              key: 5,
              class: Q(["sign", S.value]),
              name: S.value
            }, null, 8, ["class", "name"])) : N("", !0),
            e.mark.settled ? (l(), d("span", Gh, w(e.mark.settled), 1)) : N("", !0)
          ])) : N("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (l(), G(ro, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: _e(P, ["stop"])
      }, null, 8, ["label", "open"])) : N("", !0),
      (e.mark.figure || e.mark.counting) && C.value ? (l(), d("span", Kh, [
        p("span", {
          class: "progress",
          style: ke({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: L.value })
        }, null, 4)
      ])) : N("", !0),
      e.mark.detail && !z(k) ? (l(), G(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : N("", !0),
      e.mark.body && !z(k) ? (l(), d("div", Yh, [
        e.mark.bodyLabel ? (l(), d("p", Jh, w(e.mark.bodyLabel), 1)) : N("", !0),
        H(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : N("", !0),
      e.mark.command && !z(k) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, Zh)) : N("", !0),
      e.mark.card ? (l(), G(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : N("", !0),
      we(le.$slots, "default", {
        shown: !z(k)
      }, void 0, !0)
    ], 16, Nh));
  }
}), co = /* @__PURE__ */ Z(Xh, [["__scopeId", "data-v-1bcf640e"]]), Qh = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function uo(e) {
  var n;
  const t = Qh[e] || ((n = Rt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const ef = (e) => uo(String(e).split(":")[0]), ho = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), tf = { passed: "good", failed: "danger", warned: "warn", running: "" }, nf = { good: "good", warn: "warn", danger: "danger" }, aa = {
  "open row": (e) => rt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Nr(e.target_model, e.target_id || 0)
}, sf = { "open row": (e) => ef(e.target_model), "open page": () => uo("pages") };
function af(e, t) {
  const n = t || {}, s = aa[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? tf[e.outcome] || "" : nf[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? sf[s](e) : "",
    handlers: s ? { onAct: () => aa[s](e) } : {}
  };
}
const of = 24, rf = 1e3, oa = 2e3, lf = 0.25, cf = 5e3;
function uf(e, t = of, n = () => !0) {
  const s = F(!1), a = F(0), o = F(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const b = u();
    return b ? b.scrollHeight - b.scrollTop - b.clientHeight : 0;
  }, m = () => !u() || f() <= t;
  function $(b) {
    if (clearTimeout(r), !b) {
      o.value = !1, c = Date.now();
      return;
    }
    const v = Date.now() - c < oa ? oa : rf;
    r = setTimeout(() => o.value = s.value, v);
  }
  function x() {
    clearTimeout(i), s.value = !1, a.value = 0, $(!1);
  }
  function j(b = !1) {
    const v = u();
    v && b && v.scrollTo ? v.scrollTo({ top: v.scrollHeight, behavior: "smooth" }) : v && (v.scrollTop = v.scrollHeight), x();
  }
  function k() {
    B(), !s.value && (s.value = !0, $(!0));
  }
  const y = () => !!u() && f() <= u().clientHeight * lf;
  function B() {
    clearTimeout(i), y() && (i = setTimeout(() => s.value && y() && n() && j(!0), cf));
  }
  function P() {
    m() ? x() : k();
  }
  function te(b = 1, v = !1) {
    s.value ? a.value += Math.max(0, b) : j(v);
  }
  return ba() && $a(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: m, follow: x, toBottom: j, left: k, scrolled: P, arrived: te };
}
const df = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = F(null), { away: o, scrolled: r, arrived: i, toBottom: c } = uf(a);
    be(
      () => n.lines.length,
      () => pn(() => i()),
      { immediate: !0 }
    );
    function u(f) {
      r(), s("older", f.target);
    }
    return (f, m) => (l(), d("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      he(w(e.lines.join(`
`) || e.empty), 1),
      z(o) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = ($) => z(c)(!0))
      }, "Follow")) : N("", !0)
    ], 544));
  }
}, hf = /* @__PURE__ */ Z(df, [["__scopeId", "data-v-09394a20"]]), ff = 1e4;
class pf {
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
    return this.heardAt !== null && t - this.heardAt > ff;
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
const mf = {
  key: 0,
  class: "frame-note"
}, gf = {
  key: 0,
  class: "frame-note"
}, vf = ["src", "title"], yf = 1e3, wf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = vs(), s = F(null), a = F(!1), o = F(!1);
    let r = null, i = 0;
    return Le(() => {
      r = new pf(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, yf);
    }), Ae(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", mf, "This window was closed because it stopped answering.")) : (l(), d(X, { key: 1 }, [
      a.value ? (l(), d("div", gf, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        H(ye, {
          onClick: u[0] || (u[0] = (f) => o.value = !0)
        }, {
          default: V(() => [...u[1] || (u[1] = [
            he("Close the window", -1)
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
        title: z(n).window
      }, null, 8, vf)
    ], 64));
  }
}, kf = /* @__PURE__ */ Z(wf, [["__scopeId", "data-v-32a49046"]]), bf = 0, $f = "/api/lines", xf = "/api/line";
class Mf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), bf));
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
        const n = await De.raw($f, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await De.raw(xf, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const _f = new Mf();
class Sf {
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
const Ef = { 1: "refused", 2: "usage", 3: "fault" }, Af = 100, Cf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Of({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = F({}), declared: u = [], readOnly: f = !1, shared: m = null }) {
  const $ = /* @__PURE__ */ new Map(), x = new AbortController(), j = (k) => {
    const y = $.get(k);
    if (y && performance.now() - y.at < Af) return y.answer;
    const B = Et(e, k, t, x.signal);
    return $.set(k, { answer: B, at: performance.now() }), B;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: T(() => s()),
    permissions: a,
    readOnly: f,
    shared: m,
    read: j,
    run: (k) => Et(e, k, t, x.signal),
    upload: (k) => Bf(k, x.signal),
    cancel: () => x.abort(),
    follow: (k, y) => r.follow(e, k.filter((B) => o.some((P) => fo(P, B))), y, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (k) => T(() => {
      var y;
      return c.value[k] ?? ((y = u.find((B) => B.key === k)) == null ? void 0 : y.default);
    }),
    setting: async (k, y) => {
      const B = await j(`window setting ${e} ${k}`);
      return B.ok ? B.value.value : y;
    },
    keep: (k, y) => Et(e, ["window", "save-setting", e, k, JSON.stringify(y)], t, x.signal)
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
const rn = { ok: !1, failure: "cancelled", error: "" };
async function Et(e, t, n, s = void 0) {
  try {
    const a = await _f.add({ window: e, line: Array.isArray(t) ? t : If(t), environment: n }, s);
    return s != null && s.aborted ? rn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Ef[a.code] || "fault", error: Tf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? rn : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function Bf(e, t = void 0) {
  try {
    const n = await De.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? rn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? rn : { ok: !1, failure: "unreachable", error: String(n) };
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
      p("p", Df, w(z(Rf)(e.request)), 1),
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
    return (s, a) => (l(), G(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: V(() => [
        he(w(e.reason) + " ", 1),
        e.retry ? (l(), G(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            he("Retry", -1)
          ])]),
          _: 1
        })) : N("", !0),
        e.removable ? (l(), G(ye, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            he("Remove tab", -1)
          ])]),
          _: 1
        })) : N("", !0)
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
  emits: ["open", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = F(""), o = F(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = je(br, null), c = Of({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: T(() => n.options),
      declared: n.declared,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (m, $) => {
        s("open", m, $), i == null || i(m, $);
      }
    });
    Jo(Pe, c), be(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ae(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), Zo((m) => (a.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const u = () => ps(n.component), f = () => {
      var m, $;
      return (($ = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : $.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, $) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (l(), G(Pf, {
        key: 0,
        request: f(),
        onAnswer: $[0] || ($[0] = (x) => e.prompts.answer(x))
      }, null, 8, ["request"])) : N("", !0),
      e.unavailableReason ? (l(), G(Tn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), G(Tn, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (l(), G(u, { key: o.value })) : (l(), G(Tn, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: $[1] || ($[1] = (x) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, qf));
  }
}, po = /* @__PURE__ */ Z(Wf, [["__scopeId", "data-v-7d5e8ae6"]]), Ff = {
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
    const t = e, n = { render: () => ps(kf, { src: t.entry.entry_url }) };
    return (s, a) => (l(), G(po, {
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
  setup(e) {
    const t = e, n = fn(null), s = F("");
    return be(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, Vf();
          } catch (o) {
            if (Hf(o) && Uf(o)) return;
            s.value = `This window's file could not be loaded: ${o.message}`;
          }
      },
      { immediate: !0 }
    ), (a, o) => !n.value && !s.value && !e.entry.unavailable_reason ? (l(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      H(wt, { shape: "cards" })
    ], 8, zf)) : (l(), G(po, {
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
}, Kf = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new Sf(), s = ((i = je(Pe, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = T(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = T(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), G(Gf, {
      key: 0,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), G(Ff, {
      key: 1,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
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
}, Qf = "process", ra = "task", e1 = 2e3, t1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = je(Pe), s = T(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = T(() => ho.has(t.mark.variant) && t.mark.detail || ""), o = T(() => t.mark.target_model === ra ? t.mark.target_id : 0), r = F([]), i = F(!1), c = F(""), u = T(() => t.mark.target_model === Qf && !!t.mark.target_id);
    async function f() {
      const x = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = x.ok ? "" : x.error, x.ok && (r.value = x.value.lines);
    }
    let m = null;
    const $ = () => clearInterval(m);
    return be(() => t.shown && u.value, (x) => {
      $(), x && (f(), t.mark.ended_at || (m = setInterval(f, e1)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (x) => x && t.shown && u.value && ($(), f())), Ae($), (x, j) => (l(), d("div", {
      class: Q(["mark-more", { open: e.shown }]),
      onClick: j[1] || (j[1] = _e(() => {
      }, ["stop"]))
    }, [
      p("div", Yf, [
        e.declaration.body_url ? (l(), G(Kf, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(X, { key: 1 }, [
          a.value ? (l(), d(X, { key: 0 }, [
            j[2] || (j[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Jf, w(a.value), 1)
          ], 64)) : N("", !0),
          u.value && c.value ? (l(), d("p", Zf, w(c.value), 1)) : u.value && i.value ? (l(), d(X, { key: 2 }, [
            j[3] || (j[3] = p("p", { class: "mark-label" }, "Output", -1)),
            H(hf, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", Xf, w(s.value.join(`
`)), 1)) : N("", !0),
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: j[0] || (j[0] = _e((k) => z(rt)(`${ra}:${o.value}`), ["stop"]))
          }, "Open task " + w(o.value) + " and its proofs", 1)) : N("", !0)
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
    })), s = F(""), a = je(Pe);
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
      s.value ? (l(), d("span", i1, w(s.value), 1)) : N("", !0)
    ], 64));
  }
}, c1 = /* @__PURE__ */ Z(l1, [["__scopeId", "data-v-0dfda102"]]);
function mo(e, t) {
  const n = fn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await De.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const go = mo("/api/marks", "marks"), Rv = go.fetchAll, u1 = go.find, d1 = 2e3;
function vo(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, d1);
  };
  Le(async () => {
    await e(), s();
  }), yt(() => clearTimeout(n));
}
const h1 = ["data-ref"], f1 = ["data-ref"], p1 = { class: "mark-row" }, m1 = "dock add", g1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = T(() => u1(s.mark.type)), o = je(Pe, null), r = T(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = F(null);
    vo(async () => {
      if (!r.value) return;
      const $ = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      $.ok && $.value.rows.length && (i.value = $.value.rows[0].progress);
    }, () => r.value);
    const c = T(() => {
      const $ = af(s.mark, a.value), x = !$.figure || $.figure.endsWith("%");
      return i.value && r.value && x ? { ...$, figure: `${i.value}%`, fraction: i.value / 100 } : $;
    }), u = T(() => {
      var $;
      return !!(s.mark.lines || s.mark.detail && ho.has(s.mark.variant) || t.has(s.mark.target_model) || ($ = a.value) != null && $.body_url);
    }), f = F(!1), m = T(() => {
      var $, x, j;
      return s.docked ? (x = ($ = a.value) == null ? void 0 : $.buttons) == null ? void 0 : x.filter((k) => {
        var y;
        return !((y = k.runs) != null && y.startsWith(m1));
      }) : (j = a.value) == null ? void 0 : j.buttons;
    });
    return ($, x) => {
      var j, k;
      return (j = a.value) != null && j.card ? (l(), d("div", {
        key: 0,
        class: "thread-turn card whole-card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        H(rs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 8, h1)) : (l(), d("div", {
        key: 1,
        class: Q(["thread-turn", "card", { "full-width": (k = a.value) == null ? void 0 : k.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", p1, [
          H(co, ot({
            mark: c.value,
            open: u.value ? f.value : void 0
          }, Xo(c.value.handlers), {
            onClick: x[0] || (x[0] = (y) => f.value = !f.value)
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
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, f1));
    };
  }
}, v1 = /* @__PURE__ */ Z(g1, [["__scopeId", "data-v-b5431d49"]]), y1 = ["data-ref"], w1 = ["inert"], k1 = { class: "thread-group" }, b1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = F(!1), s = F(!1);
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
        p("div", k1, [
          (l(!0), d(X, null, re(e.group.marks, (i) => (l(), G(v1, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, w1)) : N("", !0)
    ], 8, y1));
  }
}, Lv = /* @__PURE__ */ Z(b1, [["__scopeId", "data-v-8a285510"]]);
function $1(e) {
  const t = F(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Le(() => n.observe(e.value)), yt(() => n.disconnect()), t;
}
const x1 = { class: "chat-dock-fold" }, M1 = ["aria-label"], _1 = { class: "chat-dock-head" }, S1 = { class: "chat-dock-inner" }, E1 = 700, A1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = F(null), s = F(null), a = $1(s), o = F(!1);
    let r = 0;
    return Le(() => r = setTimeout(() => o.value = !0, E1)), yt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: Q(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", x1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: Q(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          we(i.$slots, "edge"),
          p("header", _1, [
            we(i.$slots, "head")
          ]),
          p("div", {
            class: Q(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", S1, [
              p("div", {
                class: Q(["chat-dock-grow", { settled: o.value }]),
                style: ke(z(a) === null ? null : { height: `${z(a)}px` })
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
        ], 10, M1)
      ])
    ], 2));
  }
}, yo = /* @__PURE__ */ Z(A1, [["__scopeId", "data-v-63e4dcfc"]]), C1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Bn = 5, O1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Bn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Bn}s`, animationDelay: `${(n - Bn).toFixed(2)}s` };
    return (a, o) => (l(), d("span", C1, [
      p("i", { style: s })
    ]));
  }
}, T1 = /* @__PURE__ */ Z(O1, [["__scopeId", "data-v-d0c4b012"]]), wo = mo("/api/docks", "docks"), Dv = wo.fetchAll, ls = wo.find, B1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), cs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), I1 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), R1 = (e) => e.kept ? cs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : cs("keep", "pin", "Pin", `dock keep ${e.id}`);
function L1(e, t) {
  var n;
  return [
    ...I1(e, t) ? [R1(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Rt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    cs("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const D1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: B1(e, t),
  buttons: L1(e, t)
}), N1 = { class: "dock-title" }, j1 = ["aria-expanded", "title"], P1 = { class: "chat-dock-acts dock-acts" }, q1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, W1 = {
  key: 1,
  class: "dock-text"
}, F1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = T(() => ls(s.item.type)), o = F(null), r = T(() => D1(s.item, a.value)), i = je(Pe), c = F(/* @__PURE__ */ new Set()), u = F("");
    async function f(x) {
      if (x.action === "open") return rt(`${s.item.target_model}:${s.item.target_id}`);
      if (x.action !== "declared") return is(x, s.item, i.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, x.label]), u.value = "";
      const j = await is(x, s.item, i.environment);
      (j == null ? void 0 : j.ok) === !1 && (c.value = new Set([...c.value].filter((k) => k !== x.label)), u.value = j.error);
    }
    const m = T(() => r.value.buttons.filter((x) => x.action !== "undock" && !c.value.has(x.label))), $ = T(() => r.value.buttons.find((x) => x.action === "undock"));
    return (x, j) => (l(), G(yo, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: V(() => [
        e.leaving ? (l(), G(T1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : N("", !0)
      ]),
      head: V(() => {
        var k, y, B;
        return [
          (k = a.value) != null && k.draws_head ? (l(), d("span", {
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
            p("span", N1, w(r.value.title), 1)
          ], 64)),
          (y = a.value) != null && y.badge ? (l(), d("span", {
            key: 2,
            class: Q(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, w(a.value.badge), 3)) : N("", !0),
          (B = a.value) != null && B.draws_head ? N("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: j[0] || (j[0] = (P) => n("fold"))
          }, [
            H(Tt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, j1)),
          p("span", P1, [
            (l(!0), d(X, null, re(m.value, (P) => (l(), G(ye, {
              key: P.action + P.runs,
              small: "",
              kind: P.primary ? "primary" : "ghost",
              bordered: !P.primary,
              "data-dock-action": P.action,
              onClick: (te) => f(P)
            }, {
              default: V(() => [
                he(w(P.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          H(ys, {
            title: $.value.label,
            "data-dock-action": "undock",
            onClick: j[1] || (j[1] = (P) => f($.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var k, y;
        return [
          u.value ? (l(), d("p", q1, w(u.value), 1)) : N("", !0),
          e.item.text && !((k = a.value) != null && k.body_url) ? (l(), d("p", W1, w(e.item.text), 1)) : N("", !0),
          (y = a.value) != null && y.body_url ? (l(), G(rs, {
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
}, ia = /* @__PURE__ */ Z(F1, [["__scopeId", "data-v-608c189e"]]), H1 = ["title", "aria-label"], U1 = { class: "run-chip-in" }, V1 = {
  key: 0,
  class: "run-chip-ring"
}, z1 = { class: "run-chip-name" }, G1 = { class: "run-chip-bar" }, K1 = "processes.output", Y1 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var f;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((f = je(Pe, null)) == null ? void 0 : f.environment) ?? "", o = F(null), r = T(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = T(() => {
      var m, $;
      return ((m = o.value) == null ? void 0 : m.title) || (($ = o.value) == null ? void 0 : $.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = T(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const m = await Et(K1, ["process", "card", String(s.item.target_id)], a);
      m.ok && (o.value = m.value);
    }
    return vo(u, () => r.value), (m, $) => {
      var x;
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ke({ "--tone": c.value })
      }, [
        p("span", U1, [
          r.value ? (l(), d("span", V1)) : (l(), G(Ve, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", z1, w(i.value), 1)
        ]),
        p("span", G1, [
          p("i", {
            style: ke({ width: r.value ? `${((x = o.value) == null ? void 0 : x.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, H1);
    };
  }
}, J1 = /* @__PURE__ */ Z(Y1, [["__scopeId", "data-v-2036e274"]]), Z1 = 24, X1 = 8, Nv = 420;
function jv({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= Z1 && e > t ? !0 : e < t && a > X1 ? !1 : null;
}
const Q1 = (e, t) => e === void 0 ? t : e, ep = 6, tp = 3, la = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, us = (e) => !!(e.leaves_at && !e.kept), np = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!us(e) || t < e.leaves_at || n.has(e.id)), sp = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => np(s, t, n)).sort((s, a) => s.id - a.id);
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
    const t = e, n = F(Date.now() / 1e3), s = F(/* @__PURE__ */ new Set()), a = F(!1), o = F(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ae(() => clearInterval(r));
    const i = T(() => sp(t.items, n.value, s.value)), c = T(() => ap(i.value.filter((P) => la(P, ls)), n.value)), u = T(() => i.value.filter((P) => !c.value.includes(P) && !la(P, ls))), f = T(() => (a.value = op(c.value.length, a.value)) && !o.value), m = F({}), $ = (P) => Q1(m.value[P.id], t.folded);
    function x(P) {
      m.value = { ...m.value, [P.id]: !$(P) };
    }
    function j(P) {
      m.value = { ...m.value, ...Object.fromEntries(c.value.map((te) => [te.id, te.id !== P.id])) }, o.value = !0;
    }
    function k() {
      m.value = Object.fromEntries(Object.entries(m.value).filter(([P]) => !c.value.some((te) => String(te.id) === P))), o.value = !1;
    }
    function y(P) {
      s.value = /* @__PURE__ */ new Set([...s.value, P.id]);
    }
    function B(P) {
      s.value = new Set([...s.value].filter((te) => te !== P.id));
    }
    return (P, te) => (l(), d("div", rp, [
      (l(!0), d(X, null, re(u.value, (b) => (l(), d("div", {
        key: b.id,
        onMouseenter: (v) => y(b),
        onMouseleave: (v) => B(b)
      }, [
        H(ia, {
          item: b,
          leaving: z(us)(b) && !s.value.has(b.id),
          folded: $(b),
          onFold: (v) => x(b)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, ip))), 128)),
      a.value && o.value ? (l(), d("div", lp, [
        p("button", {
          type: "button",
          class: "dock-runs-toggle",
          "aria-expanded": "true",
          title: "Fold the runs into one line",
          "data-dock-runs-fold": "",
          onClick: k
        }, [
          he(w(c.value.length) + " runs ", 1),
          H(Tt, { open: "" })
        ])
      ])) : N("", !0),
      (l(!0), d(X, null, re(f.value ? [] : c.value, (b) => (l(), d("div", {
        key: b.id,
        onMouseenter: (v) => y(b),
        onMouseleave: (v) => B(b)
      }, [
        H(ia, {
          item: b,
          leaving: z(us)(b) && !s.value.has(b.id),
          folded: $(b),
          onFold: (v) => x(b)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, cp))), 128)),
      f.value ? (l(), G(yo, {
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
            onClick: te[0] || (te[0] = (b) => o.value = !0)
          }, [
            H(Ve, { name: "runs" }),
            he(" " + w(c.value.length) + " runs ", 1),
            H(Tt)
          ]),
          p("span", up, [
            (l(!0), d(X, null, re(c.value, (b) => (l(), G(J1, {
              key: b.id,
              item: b,
              onClick: (v) => j(b)
            }, null, 8, ["item", "onClick"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["label"])) : N("", !0)
    ]));
  }
}, Pv = /* @__PURE__ */ Z(dp, [["__scopeId", "data-v-11842ee6"]]), St = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Jt = (e) => Math.min(Math.max(e, 0), 1), hp = (e) => {
  const t = Jt(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => hp((e - t) / (n - t));
function qv(e) {
  const t = Jt(e), n = Jt((t - 0.12) / 0.76) * St.shuffles, s = Math.min(Math.floor(n), St.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), r = et(a, 0.38, 0.76), i = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), c = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), u = Math.sin(Math.PI * Jt((a - 0.45) / 0.55)) ** 2;
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
}, ds = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), pp = (e) => e * e * (3 - 2 * e), ln = (e, [t, n]) => pp(ds(e, t, n)), mp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Vt = ([e, t], n) => e + n() * (t - e);
function gp(e) {
  return mp.map(() => {
    const t = Vt(Ye.speed, e), n = Vt(Ye.angle, e) * Math.PI / 180, s = Vt(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Vt(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
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
  const c = Math.min(a, r), u = s.from.map((f, m) => f + o.velocity[m] * c);
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
  return { into: ds(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: ds(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function zv(e) {
  const { into: t, out: n } = bo(Ze.rope_swing, e);
  return 1 - ln(t, [0, 1]) * (1 - ln(n, [0, 1]));
}
function Gv(e) {
  const t = Ze.rope_swing, { into: n, out: s } = bo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return ln(n, [0, 1]) * (1 - ln(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
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
}, Nt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: kp }), ee = (e, t, n = {}) => Nt(e, "clip", t, n), In = (e, t, n = {}) => Nt(e, "look", t, n), ca = (e, t, n = {}) => Nt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Nt(e, "pick", t, n), ...s }), pe = (e) => Nt("nothing", "nothing", e, {}), Ep = 120, Ap = 300, Rn = (e, t) => ({ ...ee(e, t), cooldown: Ap }), Cp = 120, ne = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Op = () => [ee("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...ee(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: bp[e.name] }), _t = (e) => ({ ...e, shenanigan: !0, lasts: $p[e.name] }), Ss = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ne("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ee("nod", 2), pe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ne("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...nt(ee("bug_shot", 3)), toward: "", onto: !1 },
    { ...nt(ee("bug_smash", 2)), toward: "", onto: !1 },
    ee("nod", 2)
  ]),
  ...ne("tests_failed", { cooldown: 20, toward: "card" }, [ee("startled", 2), ee("dismay", 1), ee("tantrum", 3), pe(1)]),
  ...ne("committed", { cooldown: 30, toward: "card", onto: !0 }, [ee("nod", 2), pe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ne("sin_fixed", { cooldown: 300 }, [ee("halo", 1), pe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ne("sin_committed", { cooldown: 300 }, [ee("repent", 1), pe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...ne("messaged", { cooldown: Cp }, [ee("phone_call", 1)]),
  ...ne("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ee("nod", 4), ee("hand_rub", 4), pe(7)]),
  ...ne("question_asked", { cooldown: 60 }, [ee("ask_sign", 9), ee("look_up", 3), pe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ne("reported", { cooldown: 90 }, [ca("read", 3), ee("nod", 1), pe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ne("read_message", { cooldown: 30 }, [ca("read", 3), pe(1)]),
  ...ne("fact_filed", { cooldown: 120 }, [ee("file_card", 3), ee("nod", 1), pe(6)]),
  ...ne("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ee("nod", 2), pe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ne("bar_done", { holds: !0 }, Op()),
  ...ne("bar_failed", { holds: !0 }, [ee("fume", 1), ee("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ne("standing", { cooldown: 12 }, [ee("look_left", 2), ee("look_right", 2), ee("look_up", 1), pe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ne("launched", { cooldown: 300 }, [ee("tumble", 3), pe(47)]),
  // a break from the hammering now and then
  ...ne("building", { cooldown: 30 }, [ee("wipe_brow", 4), ee("look_left", 1), ee("look_right", 1), pe(69)]),
  ...ne("failed", { cooldown: 20, toward: "card" }, [ee("shake", 3), ee("tantrum", 2), pe(2)]),
  ...ne("refused", { cooldown: 20 }, [ee("shake", 1), pe(1)]),
  ...ne("work_done", { cooldown: 120 }, [ee("stretch", 2), pe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ne("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...ne("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...ne("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...ne("answered", { cooldown: 15 }, [In("amused", 3), pe(2)]),
  ...ne("heard", { cooldown: 30 }, [
    ee("bow", 1, { voices: ["butler"] }),
    ee("salute", 1, { voices: ["squire"] }),
    ee("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    pe(1)
  ]),
  ...ne("long_walk", { cooldown: 90 }, [ee("stumble", 3), pe(22)]),
  ...ne("card_arrived", { cooldown: 20, toward: "card" }, [ee("glance", 7), pe(13)]),
  ...ne("typing", { cooldown: 60 }, [In("reading", 1), pe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Sp).flatMap(([e, t]) => ne(`reacted:${e}`, {}, [In(t, 1)])),
  ...Object.entries($o).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ne(`agent_reacted:${n}`, {}, [ee(s, 1, { voices: [e] })])[0])),
  ...Object.entries(xo).flatMap(([e, t]) => ne(`agent_reacted:${e}`, {}, [ee(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ne("pastime", {}, [
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
  ...ne("held:search", { cooldown: Ep }, [Rn("search", 3), { ...Rn("binoculars", 2), when: { home: !0 } }, { ...Rn("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ne("held:type", {}, [ee("type", 3), ee("type_ponder", 1)]),
  ...ne("held:watch", {}, [ee("watch", 2), ee("wave_up", 1)]),
  ...ne("held:compacting", {}, [ee("pack_box", 3), ee("vacuum", 2), ee("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ne("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), pe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ne("tickled", {}, [{ ...nt(ee("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ne("eager", {}, [ee("eager", 2, { slow: !0 }), pe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ne("jump", {}, [_t(nt(ee("backflip", 7, { high: !0 }))), ee("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ne("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ne("unit", { cooldown: Mp.build.cooldown }, [ce("unit", xp.weight), pe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ne("progress_jump", { cooldown: 6 }, [ee("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ne("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...ne("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ne("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: _p.every }, ce("stand", 5)]),
  // a digit a blow's dust lets out
  ...ne("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ne("roam", {}, [
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
  ...ne("laptop", {}, [ce("seat", 6, {}, { stay: [60, 150] }), ce("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ne("ledge_at", {}, [ce("middle", 2, {}, { along: 1 / 2 }), ce("third", 1, {}, { along: 1 / 3 }), ce("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ne("composed_as", {}, [
    ce("facing", 4, {}, { turn: 0, leans: 0 }),
    ce("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ce("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ce("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ce("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Tp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Mo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Bp = (e) => Array.isArray(e) ? e[0] : e, Ip = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Rp(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || Mo(f).every(([m, $]) => n(m) >= Bp($)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Ss.filter((f) => Tp(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= wp.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = i.filter((f) => {
    var m;
    return f.kind === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
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
  _o(e, Ss.find((s) => s.when.moment === e.moment && s.name === t), n);
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
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Te.sweep) % a, i = o % Te.sweep, c = Te.sweep - Te.returnSeconds, u = da((i - c) / Te.returnSeconds), f = i <= c ? da(i / c) : 1 - u, m = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + m * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Dp = 1, Np = (e, t, n, s, a, o = 0) => Lp({ moment: "jump", high: e > Dp * t, memory: s, now: a, room: o }, n).name === "backflip", ha = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, ey = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, ty = { width: 24, height: 27, top: 3, units: 2 }, jp = "[data-figure-pile]", ny = { amber: [1, 0.69, 0.125], good: ha.colours.good, bad: ha.colours.bad }, Ln = { phases: 4, dim: 0.25 }, sy = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, Pp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Ss.filter((e) => Pp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const ay = {
  width: 84,
  belly: 13,
  blink: 4
}, fa = "[data-figure-home]", jt = () => {
  var t;
  const e = document.querySelector(fa);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(fa)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, qp = "[data-figure-docked-bars]", Wp = "[data-figure-chat-foot]", Fp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Hp = "[data-figure-newest]";
function Up() {
  var s, a;
  const e = (s = jt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Hp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Es(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function So(e, t, n = Up()) {
  if (!e || !n) return !0;
  const s = kt(e, t), a = As(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = St.gap;
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
function cn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: f = 0, room: m = 0, pogo: $ = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Nn) return null;
  (r || i) && (o = Math.max(o, Ao));
  const x = o > 1, j = Math.abs(t.x - e.x), k = j < Nn ? 0 : j / (Gp * o) * 1e3, y = Math.min(k, x ? Yp : Kp), B = Math.abs(t.y - e.y), P = t.y < e.y, te = P && !$ && Np(B, n, c, u, f, m), b = P ? Zp + Math.min(B, 400) * Xp : Math.sqrt(2 * B / ko) * 1e3, v = {
    x: t.x,
    y: t.y,
    ms: B > Nn ? te ? em : b : 0,
    lead: te ? Qp : P ? Jp : 0,
    easing: P ? tm : nm,
    hopping: !0,
    clip: te ? "backflip" : P ? "jump" : "fall"
  }, L = { x: t.x, y: t.y, ms: k + y, lead: 0, easing: "linear", ramp: y, ...x ? { clip: "run" } : {} }, C = $ ? sm(t, n) : v, q = P && !s ? [{ ...L, y: e.y }, C] : [{ ...v, x: e.x }, L];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !a, pace: o, running: x };
}
const sm = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), kt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - bn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Co = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Es = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function bt() {
  var t;
  const e = (t = jt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const zt = 0.5, pa = 20;
function ly(e, t, n = bt()) {
  const s = kt(e, t);
  return s.left >= n.left + pa && s.right <= n.right - pa;
}
function Oo(e, t, n = bt()) {
  const s = kt(e, t), a = s.right - s.left, o = As(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - zt && i <= n.right + zt && s.top >= n.top - zt && c <= n.bottom + zt;
}
const un = [0.35, 0.5, 0.65], dn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: un[0], right: un.at(-1), top: dn[0], bottom: dn.at(-1) }, am = 0.24;
function As(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + am * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function om(e, { size: t }, n = bt()) {
  const s = As(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const rm = (Je.right - Je.left) / 2 + 0.08;
function im(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !Es(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const c of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[c].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, c), u.setEnd(o, c + 1), [...u.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const lm = (e) => dn.flatMap(
  (t) => un.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function cm(e, t, n = "") {
  if (!So(e, t)) return un.length * dn.length;
  const s = kt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Fp)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && Co(a, c) && Es(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
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
  const e = jt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(qp);
  if (!t) return { ...Io(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Io() {
  const e = jt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const bm = { climb: 90 };
function fy(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: f = 0, room: m = 0, pogo: $ = !1 } = {}) {
  (o || r) && (a = Math.max(a, Ao));
  const x = (te) => {
    const b = kt(te, n, bn[te.posture].travels);
    return { x: b.left, y: b.top };
  }, j = t.ladder ?? e.ladder;
  if (j && !(t.ladder && e.ladder)) return $m(x(e), x(t), x({ ...j.foot, posture: "stand" }), j.way, !!t.ladder, n, a);
  const [k, ...y] = [e, ...c, t].map(x), B = cn(k, y[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: f, room: m, pogo: $ }), P = y.slice(1).map((te, b) => {
    var v;
    return (v = cn(y[b], te, n.size, { random: i, memory: u, now: f, room: m })) == null ? void 0 : v.legs.find((L) => L.hopping);
  });
  return B && { ...B, legs: [...B.legs, ...P.filter(Boolean)] };
}
function $m(e, t, n, s, a, o, r) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / bm.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? cn(e, n, o.size, { pace: r }) : cn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
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
  return ((t = (e = jt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
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
const hs = /* @__PURE__ */ new Set();
function Bm(e) {
  return hs.add(e), () => hs.delete(e);
}
function Im() {
  No();
  const e = () => {
    Ro = requestAnimationFrame(e), !document.hidden && (At = Tm(At), hs.forEach((t) => t(At)));
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
    const t = fn(Lo().floors);
    let n = () => {
    };
    return Le(() => {
      n = Bm((s) => t.value = s.floors), Im();
    }), Ae(() => {
      n(), No();
    }), (s, a) => (l(), d("div", Pm, [
      (l(!0), d(X, null, re(t.value, (o) => (l(), G(jm, {
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
  const e = F(Date.now()), t = setInterval(() => e.value = Date.now(), Um);
  return yt(() => clearInterval(t)), e;
}
function wy(e) {
  const t = vs(), n = F(null), s = F("");
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
        H(ye, ot({
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
        e.loaded ? e.failure ? (l(), d("p", Ym, w(e.failure), 1)) : e.rows.length ? N("", !0) : (l(), d("p", Jm, "No " + w(e.noun) + "s yet", 1)) : (l(), G(wt, {
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
            p("span", Qm, w(z(Yn)(o.created_at)), 1)
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
  const s = F(""), a = F(ma), o = F("all"), r = T(() => {
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
      H(Th, {
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
      e.tools.hasStates ? (l(), G(as, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : N("", !0)
    ]));
  }
}, $y = /* @__PURE__ */ Z(ag, [["__scopeId", "data-v-b2dd0a0d"]]);
function xy() {
  const e = F(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const og = 86400, fs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function rg(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((fs(t) - fs(e)) / og);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function My(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = fs(a.time);
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
const ug = 140, Gt = 220, dg = 5;
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
    const m = { el: i, options: c, done: u, arrival: f, display: i.style.display || "" };
    if (!s)
      return s = !0, f(i, c, () => a(m));
    i.style.display = "none", n.push(m);
  };
  return r.flush = () => {
    for (const i of n.splice(0))
      i.el.style.display = i.display, i.done();
  }, r;
}
function Ey(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Gt}ms ${Bt}, opacity ${Gt}ms ease-in, margin ${Gt}ms ${Bt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Gt);
}
const jo = "chat.pins.minimised", Zt = F(Ct(jo, !1));
function ga(e) {
  Zt.value = e, mn(jo, e);
}
function hg(e) {
  const t = T(() => e()), n = T(() => Zt.value ? [] : e()), s = () => ga(!Zt.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => Ta(o) > a).length,
    (o, r) => o > r && ga(!1)
  ), { pins: t, visible: n, minimised: Zt, toggle: s };
}
const fg = ["title"], pg = {
  key: 0,
  class: "pins-count"
}, mg = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = hg(() => t.notices);
    return (o, r) => z(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: Q(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = _e((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      H(Me, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (l(), d("span", pg, w(z(n).length), 1)) : N("", !0)
    ], 10, fg)) : N("", !0);
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
    function o(E) {
      (E.metaKey || E.ctrlKey) && (E.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = T(() => n.path.lastIndexOf("/") + 1), u = T(() => n.path.slice(0, c.value)), f = T(() => n.path.slice(c.value)), m = T(() => n.kind === "deleted"), $ = T(() => r[n.kind]), x = T(() => new Set(n.rows.filter((E) => E.line_type === "add").map((E) => E.line))), j = F("after"), k = T(() => j.value === "before" ? n.whole.old : n.whole.text), y = T(() => n.whole && n.whole.text !== void 0 ? k.value.split(`
`).map((E, g) => ({ line_type: j.value === "after" && x.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: E })) : n.rows.filter(
      (E) => !(n.editsOnly && ["ctx", "fold"].includes(E.line_type)) && !(n.hideRemovals && E.line_type === "del")
    )), B = F(!1), P = T(() => n.lines && !B.value && !n.whole), te = T(() => P.value ? y.value.slice(0, n.lines) : y.value), b = T(() => y.value.length - te.value.length), v = (E) => E.line === null || E.line_type === "del" ? "" : E.line, L = (E) => E.line_type === "fold" ? E.hidden ? `⋯ ${E.hidden} lines` : "⋯" : E.text, C = F(null), q = F(null);
    let M = null;
    return Le(() => {
      if (!q.value) return;
      let E = !0;
      M = new ResizeObserver(() => {
        !C.value || !q.value || (C.value.style.transition = E ? "none" : "", C.value.style.height = `${q.value.offsetHeight}px`, E = !1);
      }), M.observe(q.value);
    }), Ae(() => M && M.disconnect()), (E, g) => (l(), d("section", {
      class: Q(["diff-card", { half: e.half, gone: m.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: m.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: g[2] || (g[2] = (h) => !m.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${z(a)}-click to open it`,
          onClick: o
        }, [
          p("span", yg, w(u.value), 1),
          p("span", wg, w(f.value), 1),
          $.value ? (l(), d("span", {
            key: 0,
            class: Q(["diff-card-badge", e.kind])
          }, w($.value), 3)) : N("", !0)
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
          title: j.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[0] || (g[0] = _e((h) => j.value = j.value === "after" ? "before" : "after", ["stop"]))
        }, w(j.value === "after" ? "After" : "Before"), 9, bg)) : N("", !0),
        m.value ? N("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: Q(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[1] || (g[1] = _e((h) => s("whole"), ["stop"]))
        }, [
          H(Me, {
            name: "file",
            size: 12
          })
        ], 10, $g))
      ], 8, gg),
      e.whole && e.whole.error ? (l(), d("p", xg, w(e.whole.error), 1)) : N("", !0),
      !m.value && !e.folded ? (l(), d(X, { key: 1 }, [
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
          ref: C,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            p("div", Sg, [
              (l(!0), d(X, null, re(te.value, (h, A) => (l(), d("div", {
                key: A,
                class: Q(["diff-row", h.line_type, { fresh: e.fresh && h.edit === e.fresh }])
              }, [
                p("span", Eg, w(v(h)), 1),
                p("span", Ag, w(i[h.line_type]), 1),
                p("span", Cg, w(L(h)), 1)
              ], 2))), 128)),
              b.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[3] || (g[3] = _e((h) => B.value = !0, ["stop"]))
              }, w(b.value) + " more " + w(b.value === 1 ? "line" : "lines"), 1)) : N("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : N("", !0)
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
      e.checked !== null ? (l(), d("span", Tg, w(e.checked ? "✓" : ""), 1)) : N("", !0),
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
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const ht = 8, Fg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = F(null), o = (h) => h ? `${h}px` : void 0, r = T(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = F({ w: 0, h: 0 }), c = F(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), m = (h) => {
      const A = h.closest(".pane, .float-window");
      return A ? f(A.getBoundingClientRect()) : u();
    }, $ = (h, A) => `${Math.max(0, h ? Math.min(h, A) : A)}px`;
    function x(h, A) {
      return {
        below: h.bottom - A.bottom - s.gap - ht,
        above: A.top - h.top - s.gap - ht,
        across: h.right - h.left - 2 * ht
      };
    }
    function j(h) {
      const A = m(s.anchor), O = x(A, h);
      return i.value.w <= O.across && i.value.h <= Math.max(O.below, O.above) ? A : u();
    }
    const k = T(() => {
      if (!c.value) return r.value;
      const h = c.value, A = j(h), O = x(A, h), { w: S, h: Y } = i.value, U = s.align === "auto" ? h.left + h.right > A.left + A.right : s.align === "right", ue = wi(U ? h.right - S : h.left, A.left + ht, Math.max(A.left + ht, A.right - S - ht)), me = Y > O.below && O.above > O.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: $(s.maxHeight, O.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: $(s.maxHeight, O.below) };
      return { ...r.value, ...me, left: `${ue}px`, maxWidth: $(s.maxWidth, O.across) };
    }), y = n, B = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function P(h) {
      const A = B(), O = A.indexOf(document.activeElement);
      A[(O + h + A.length) % A.length].focus();
    }
    const te = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => y("close") }, b = (h) => te[h.key] && (h.preventDefault(), te[h.key]()), v = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let L = 0;
    const C = new ResizeObserver(() => {
      cancelAnimationFrame(L), L = requestAnimationFrame(v);
    });
    Wg(a, (h) => s.anchor && !s.anchor.contains(h.target) && y("close"));
    const q = (h, A) => ["top", "left", "right", "bottom"].some((O) => Math.abs(h[O] - A[O]) > 1), M = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let E = 0;
    function g() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || M(h)) return y("close");
        q(h, c.value) && (c.value = h);
      }
      E = requestAnimationFrame(g);
    }
    return Le(() => {
      s.anchor && a.value && Pg(a.value, s.anchor), v(), a.value && C.observe(a.value), !s.plain && B()[0] && B()[0].focus(), g();
    }), Ae(() => {
      C.disconnect(), cancelAnimationFrame(E), cancelAnimationFrame(L);
    }), t({ element: a }), (h, A) => (l(), G(wa, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", ot({
        ref_key: "panel",
        ref: a
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: k.value,
        onKeydown: b
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
    return (s, a) => (l(), G(ye, {
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
    const s = e, a = n, o = T(() => Xg(s.kind, s.row)), r = F(""), i = F(null), c = F(""), u = F("");
    be(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function f(x, j = "") {
      const k = await s.read([x.noun ?? s.kind, x.word, String(s.id), ...x.flag ? [x.flag, j] : x.positional ? [j] : [], ...x.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = k.ok ? "" : k.error, k.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const m = (x) => x.confirm ? i.value = x : x.said ? f(x, x.said) : x.flag || x.positional ? (i.value = x, c.value = "") : f(x), $ = () => c.value.trim() && f(i.value, c.value.trim());
    return t({ moves: o, press: m }), (x, j) => {
      var k;
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: Q(["foot", { inline: e.inline }])
      }, [
        r.value ? (l(), d("p", Qg, w(r.value), 1)) : N("", !0),
        (k = i.value) != null && k.confirm ? (l(), d("div", e0, [
          p("span", t0, w(i.value.confirm), 1),
          H(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: j[0] || (j[0] = (y) => f(i.value))
          }, {
            default: V(() => [
              he(w(i.value.label), 1)
            ]),
            _: 1
          }),
          H(ye, {
            small: "",
            kind: "ghost",
            onClick: j[1] || (j[1] = (y) => i.value = null)
          }, {
            default: V(() => [...j[7] || (j[7] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (l(), d("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: _e($, ["prevent"])
        }, [
          gt(p("input", {
            "onUpdate:modelValue": j[2] || (j[2] = (y) => c.value = y),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: j[3] || (j[3] = Xt(_e((y) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, n0), [
            [Gn, c.value]
          ]),
          i.value.opener ? gt((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": j[4] || (j[4] = (y) => u.value = y),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: j[5] || (j[5] = Xt(_e((y) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, s0)), [
            [Gn, u.value]
          ]) : N("", !0),
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
            onClick: j[6] || (j[6] = (y) => i.value = null)
          }, {
            default: V(() => [...j[8] || (j[8] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", a0, [
          (l(!0), d(X, null, re(o.value, (y) => (l(), G(ye, {
            key: y.word,
            small: "",
            kind: y.main ? "primary" : "ghost",
            "data-move": y.word,
            onClick: (B) => m(y)
          }, {
            default: V(() => [
              he(w(y.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : N("", !0);
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
      H(hn, {
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
            "aria-label": z(l0)[e.status]
          }, [
            H(gs, { value: e.status }, {
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
    const n = on.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
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
        ])) : N("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", w0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", k0, "Agent " + w(e.task.holder_id), 1)
        ])) : N("", !0),
        p("div", b0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          H(as, {
            options: z(n),
            value: String(z(lo)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", $0, w(e.refusal), 1)) : N("", !0)
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
    const n = t, s = F(!1);
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
            status: z(Wo)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", E0, w(r.id), 1),
          p("span", A0, w(r.title), 1)
        ], 8, S0))), 128))
      ])) : N("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", C0, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", O0, w(e.task.outcome), 1)
      ])) : N("", !0),
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
        }, "Show the whole brief")) : N("", !0)
      ])) : N("", !0),
      e.task.logs.length ? (l(), d("section", B0, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(X, null, re(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, w(r.line), 1))), 128))
      ])) : N("", !0)
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
        H(ys, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? N("", !0) : (l(), d("p", N0, "No comments yet")),
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
    const t = F(null), n = F(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < W0);
    return Le(() => s.observe(t.value)), yt(() => s.disconnect()), (a, o) => (l(), d("div", {
      ref_key: "root",
      ref: t,
      class: Q(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      we(a.$slots, "default"),
      e.open ? (l(), G(P0, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : N("", !0)
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
    const s = e, a = n, o = Vn(e, "draft"), r = Vn(e, "error"), i = F(!!r.value), c = F(!1), u = F(!1), f = F(null);
    async function m() {
      var k, y;
      i.value = !0, c.value = !1, await pn(), (y = ((k = f.value) == null ? void 0 : k.querySelector("input")) || f.value) == null || y.focus();
    }
    function $() {
      i.value = !1, r.value = "";
    }
    function x(k) {
      k.shiftKey || k.isComposing || (k.preventDefault(), j());
    }
    async function j() {
      const k = o.value.trim();
      if (!(!k || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(k), i.value = !1, c.value = !0;
        } catch (y) {
          o.value = k, r.value = y.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: m }), (k, y) => (l(), d("div", {
      class: Q(["comment-bar", { open: i.value }])
    }, [
      i.value ? (l(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: _e(j, ["prevent"]),
        onKeydown: Xt($, ["esc"])
      }, [
        we(k.$slots, "who", {}, void 0, !0),
        gt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (B) => o.value = B),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Xt(x, ["enter"])
        }, null, 40, U0), [
          [Gn, o.value]
        ]),
        p("div", V0, [
          p("span", z0, w(r.value), 1),
          H(ye, {
            small: "",
            onClick: $
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
            onClick: j
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
          onClick: m
        }, [
          p("span", K0, [
            H(Me, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", Y0, w(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", J0, "Draft kept")) : N("", !0)
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[1] || (y[1] = (B) => a("show"))
        }, [
          p("span", null, w(z(ki)(e.count, "comment")), 1),
          H(Me, {
            name: "down",
            size: 12
          })
        ])) : N("", !0)
      ]))
    ], 2));
  }
}, X0 = /* @__PURE__ */ Z(Z0, [["__scopeId", "data-v-79db0c2d"]]);
function Q0(e, t) {
  const n = F([]), s = F(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: f, id: m, title: $ } = e(), x = `On ${f} ${m}, ${$}: `;
    return u.text.startsWith(x) ? u.text.slice(x.length) : u.text;
  };
  async function i() {
    const { kind: u, id: f } = e();
    if (!f) return;
    const m = ++o, $ = await t([u, "comments", String(f)]);
    m === o && (n.value = $.ok ? $.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: f, id: m } = e(), $ = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, $], s.value = !0;
    const x = await t([f, "comment", String(m), u]);
    if (!x.ok)
      throw n.value = n.value.filter((j) => j !== $ && j.id !== $.id), new Error(x.error);
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
    const s = e, a = n, o = F(null), r = F(null), i = F(""), c = F(""), u = F(null), f = F(null), m = Q0(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (b) => s.read(b));
    be(m.open, (b) => a("comments", b));
    let $ = 0;
    const x = Wo, j = (b) => b.slice(0, 1).toUpperCase() + b.slice(1), k = T(() => {
      var b;
      return (b = r.value) != null && b.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function y() {
      const b = ++$, [v, L] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      b === $ && (i.value = v.ok ? "" : v.error, o.value = v.ok ? v.value : null, r.value = L.ok ? L.value : null);
    }
    be(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, y();
    }, { immediate: !0 }), be(() => s.changes, y);
    async function B(b) {
      const v = o.value.priority;
      o.value.priority = Number(b);
      const L = await s.read(["task", "edit", String(s.id), "--priority", b]);
      if (c.value = L.ok ? "" : L.error, L.ok) return y();
      o.value.priority = v;
    }
    function P(b) {
      u.value = null, f.value.press(b);
    }
    const te = (b) => {
      var v;
      return ((v = f.value) == null ? void 0 : v.moves.length) && (u.value = b);
    };
    return t({ openStatus: te }), (b, v) => (l(), d("aside", {
      class: Q(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", ev, [
        e.backed ? (l(), G(Ug, {
          key: 0,
          onBack: v[0] || (v[0] = (L) => a("back"))
        })) : N("", !0),
        p("span", tv, w(k.value), 1),
        v[9] || (v[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(X, { key: 1 }, [
          H(ye, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: v[1] || (v[1] = (L) => a("step", -1))
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
            onClick: v[2] || (v[2] = (L) => a("step", 1))
          }, {
            default: V(() => [
              H(Me, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : N("", !0),
        H(ye, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: v[3] || (v[3] = (L) => a("close"))
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
          open: z(m).open.value,
          comments: z(m).comments.value,
          words: z(m).words,
          onClose: v[6] || (v[6] = (L) => z(m).open.value = !1)
        }, {
          default: V(() => {
            var L;
            return [
              (l(), d("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", av, "Task " + w(o.value.id) + " · updated " + w(z(Yn)(z(nn)(o.value)) || "just now"), 1),
                p("h3", ov, w(o.value.title), 1),
                p("div", {
                  class: Q(["state-line", z(x)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: v[4] || (v[4] = (C) => te(C.currentTarget))
                  }, [
                    H(qo, {
                      status: z(x)(o.value.state)
                    }, null, 8, ["status"]),
                    he(" " + w(j(o.value.state)), 1)
                  ]),
                  p("span", rv, "since " + w(z(Yn)(z(nn)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", iv, [
                  v[10] || (v[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", lv, w(o.value.reason || "Other tasks"), 1),
                  (L = o.value.openers) != null && L.length ? (l(), d("p", cv, "Opens by itself when " + w(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", uv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", dv, [
                  v[11] || (v[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", hv, w(o.value.reason), 1)
                ])) : N("", !0),
                H(M0, {
                  task: o.value,
                  place: r.value,
                  refusal: c.value,
                  onPriority: B
                }, null, 8, ["task", "place", "refusal"]),
                H(L0, {
                  task: o.value,
                  onSelect: v[5] || (v[5] = (C) => a("select", C))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        H(X0, {
          send: z(m).send,
          count: z(m).comments.value.length,
          onShow: v[7] || (v[7] = (L) => z(m).open.value = !z(m).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", sv, [
        H(wt)
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
      u.value ? (l(), G(Hg, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: v[8] || (v[8] = (L) => u.value = null)
      }, {
        default: V(() => [
          H(jg, null, {
            default: V(() => [
              he("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(X, null, re(f.value.moves, (L) => (l(), G(Rg, {
            key: L.word,
            onClick: (C) => P(L)
          }, {
            default: V(() => [
              he(w(L.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : N("", !0)
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
      var s = function(v, L) {
        var C = 236, q = 17, M = v, E = o[L], g = null, h = 0, A = null, O = [], S = {}, Y = function(I, R) {
          h = M * 4 + 17, g = (function(_) {
            for (var D = new Array(_), W = 0; W < _; W += 1) {
              D[W] = new Array(_);
              for (var J = 0; J < _; J += 1)
                D[W][J] = null;
            }
            return D;
          })(h), U(0, 0), U(h - 7, 0), U(0, h - 7), me(), le(), qe(I, R), M >= 7 && Se(I), A == null && (A = Fo(M, E, O)), We(A, R);
        }, U = function(I, R) {
          for (var _ = -1; _ <= 7; _ += 1)
            if (!(I + _ <= -1 || h <= I + _))
              for (var D = -1; D <= 7; D += 1)
                R + D <= -1 || h <= R + D || (0 <= _ && _ <= 6 && (D == 0 || D == 6) || 0 <= D && D <= 6 && (_ == 0 || _ == 6) || 2 <= _ && _ <= 4 && 2 <= D && D <= 4 ? g[I + _][R + D] = !0 : g[I + _][R + D] = !1);
        }, ue = function() {
          for (var I = 0, R = 0, _ = 0; _ < 8; _ += 1) {
            Y(!0, _);
            var D = i.getLostPoint(S);
            (_ == 0 || I > D) && (I = D, R = _);
          }
          return R;
        }, le = function() {
          for (var I = 8; I < h - 8; I += 1)
            g[I][6] == null && (g[I][6] = I % 2 == 0);
          for (var R = 8; R < h - 8; R += 1)
            g[6][R] == null && (g[6][R] = R % 2 == 0);
        }, me = function() {
          for (var I = i.getPatternPosition(M), R = 0; R < I.length; R += 1)
            for (var _ = 0; _ < I.length; _ += 1) {
              var D = I[R], W = I[_];
              if (g[D][W] == null)
                for (var J = -2; J <= 2; J += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    J == -2 || J == 2 || ae == -2 || ae == 2 || J == 0 && ae == 0 ? g[D + J][W + ae] = !0 : g[D + J][W + ae] = !1;
            }
        }, Se = function(I) {
          for (var R = i.getBCHTypeNumber(M), _ = 0; _ < 18; _ += 1) {
            var D = !I && (R >> _ & 1) == 1;
            g[Math.floor(_ / 3)][_ % 3 + h - 8 - 3] = D;
          }
          for (var _ = 0; _ < 18; _ += 1) {
            var D = !I && (R >> _ & 1) == 1;
            g[_ % 3 + h - 8 - 3][Math.floor(_ / 3)] = D;
          }
        }, qe = function(I, R) {
          for (var _ = E << 3 | R, D = i.getBCHTypeInfo(_), W = 0; W < 15; W += 1) {
            var J = !I && (D >> W & 1) == 1;
            W < 6 ? g[W][8] = J : W < 8 ? g[W + 1][8] = J : g[h - 15 + W][8] = J;
          }
          for (var W = 0; W < 15; W += 1) {
            var J = !I && (D >> W & 1) == 1;
            W < 8 ? g[8][h - W - 1] = J : W < 9 ? g[8][15 - W - 1 + 1] = J : g[8][15 - W - 1] = J;
          }
          g[h - 8][8] = !I;
        }, We = function(I, R) {
          for (var _ = -1, D = h - 1, W = 7, J = 0, ae = i.getMaskFunction(R), se = h - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (g[D][se - ge] == null) {
                  var $e = !1;
                  J < I.length && ($e = (I[J] >>> W & 1) == 1);
                  var oe = ae(D, se - ge);
                  oe && ($e = !$e), g[D][se - ge] = $e, W -= 1, W == -1 && (J += 1, W = 7);
                }
              if (D += _, D < 0 || h <= D) {
                D -= _, _ = -_;
                break;
              }
            }
        }, ct = function(I, R) {
          for (var _ = 0, D = 0, W = 0, J = new Array(R.length), ae = new Array(R.length), se = 0; se < R.length; se += 1) {
            var ge = R[se].dataCount, $e = R[se].totalCount - ge;
            D = Math.max(D, ge), W = Math.max(W, $e), J[se] = new Array(ge);
            for (var oe = 0; oe < J[se].length; oe += 1)
              J[se][oe] = 255 & I.getBuffer()[oe + _];
            _ += ge;
            var Ce = i.getErrorCorrectPolynomial($e), Oe = u(J[se], Ce.getLength() - 1), Cs = Oe.mod(Ce);
            ae[se] = new Array(Ce.getLength() - 1);
            for (var oe = 0; oe < ae[se].length; oe += 1) {
              var Os = oe + Cs.getLength() - ae[se].length;
              ae[se][oe] = Os >= 0 ? Cs.getAt(Os) : 0;
            }
          }
          for (var Ts = 0, oe = 0; oe < R.length; oe += 1)
            Ts += R[oe].totalCount;
          for (var $n = new Array(Ts), Pt = 0, oe = 0; oe < D; oe += 1)
            for (var se = 0; se < R.length; se += 1)
              oe < J[se].length && ($n[Pt] = J[se][oe], Pt += 1);
          for (var oe = 0; oe < W; oe += 1)
            for (var se = 0; se < R.length; se += 1)
              oe < ae[se].length && ($n[Pt] = ae[se][oe], Pt += 1);
          return $n;
        }, Fo = function(I, R, _) {
          for (var D = f.getRSBlocks(I, R), W = m(), J = 0; J < _.length; J += 1) {
            var ae = _[J];
            W.put(ae.getMode(), 4), W.put(ae.getLength(), i.getLengthInBits(ae.getMode(), I)), ae.write(W);
          }
          for (var se = 0, J = 0; J < D.length; J += 1)
            se += D[J].dataCount;
          if (W.getLengthInBits() > se * 8)
            throw "code length overflow. (" + W.getLengthInBits() + ">" + se * 8 + ")";
          for (W.getLengthInBits() + 4 <= se * 8 && W.put(0, 4); W.getLengthInBits() % 8 != 0; )
            W.putBit(!1);
          for (; !(W.getLengthInBits() >= se * 8 || (W.put(C, 8), W.getLengthInBits() >= se * 8)); )
            W.put(q, 8);
          return ct(W, D);
        };
        S.addData = function(I, R) {
          R = R || "Byte";
          var _ = null;
          switch (R) {
            case "Numeric":
              _ = $(I);
              break;
            case "Alphanumeric":
              _ = x(I);
              break;
            case "Byte":
              _ = j(I);
              break;
            case "Kanji":
              _ = k(I);
              break;
            default:
              throw "mode:" + R;
          }
          O.push(_), A = null;
        }, S.isDark = function(I, R) {
          if (I < 0 || h <= I || R < 0 || h <= R)
            throw I + "," + R;
          return g[I][R];
        }, S.getModuleCount = function() {
          return h;
        }, S.make = function() {
          if (M < 1) {
            for (var I = 1; I < 40; I++) {
              for (var R = f.getRSBlocks(I, E), _ = m(), D = 0; D < O.length; D++) {
                var W = O[D];
                _.put(W.getMode(), 4), _.put(W.getLength(), i.getLengthInBits(W.getMode(), I)), W.write(_);
              }
              for (var J = 0, D = 0; D < R.length; D++)
                J += R[D].dataCount;
              if (_.getLengthInBits() <= J * 8)
                break;
            }
            M = I;
          }
          Y(!1, ue());
        }, S.createTableTag = function(I, R) {
          I = I || 2, R = typeof R > "u" ? I * 4 : R;
          var _ = "";
          _ += '<table style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: " + R + "px;", _ += '">', _ += "<tbody>";
          for (var D = 0; D < S.getModuleCount(); D += 1) {
            _ += "<tr>";
            for (var W = 0; W < S.getModuleCount(); W += 1)
              _ += '<td style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: 0px;", _ += " width: " + I + "px;", _ += " height: " + I + "px;", _ += " background-color: ", _ += S.isDark(D, W) ? "#000000" : "#ffffff", _ += ";", _ += '"/>';
            _ += "</tr>";
          }
          return _ += "</tbody>", _ += "</table>", _;
        }, S.createSvgTag = function(I, R, _, D) {
          var W = {};
          typeof arguments[0] == "object" && (W = arguments[0], I = W.cellSize, R = W.margin, _ = W.alt, D = W.title), I = I || 2, R = typeof R > "u" ? I * 4 : R, _ = typeof _ == "string" ? { text: _ } : _ || {}, _.text = _.text || null, _.id = _.text ? _.id || "qrcode-description" : null, D = typeof D == "string" ? { text: D } : D || {}, D.text = D.text || null, D.id = D.text ? D.id || "qrcode-title" : null;
          var J = S.getModuleCount() * I + R * 2, ae, se, ge, $e, oe = "", Ce;
          for (Ce = "l" + I + ",0 0," + I + " -" + I + ",0 0,-" + I + "z ", oe += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', oe += W.scalable ? "" : ' width="' + J + 'px" height="' + J + 'px"', oe += ' viewBox="0 0 ' + J + " " + J + '" ', oe += ' preserveAspectRatio="xMinYMin meet"', oe += D.text || _.text ? ' role="img" aria-labelledby="' + ut([D.id, _.id].join(" ").trim()) + '"' : "", oe += ">", oe += D.text ? '<title id="' + ut(D.id) + '">' + ut(D.text) + "</title>" : "", oe += _.text ? '<description id="' + ut(_.id) + '">' + ut(_.text) + "</description>" : "", oe += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', oe += '<path d="', ge = 0; ge < S.getModuleCount(); ge += 1)
            for ($e = ge * I + R, ae = 0; ae < S.getModuleCount(); ae += 1)
              S.isDark(ge, ae) && (se = ae * I + R, oe += "M" + se + "," + $e + Ce);
          return oe += '" stroke="transparent" fill="black"/>', oe += "</svg>", oe;
        }, S.createDataURL = function(I, R) {
          I = I || 2, R = typeof R > "u" ? I * 4 : R;
          var _ = S.getModuleCount() * I + R * 2, D = R, W = _ - R;
          return b(_, _, function(J, ae) {
            if (D <= J && J < W && D <= ae && ae < W) {
              var se = Math.floor((J - D) / I), ge = Math.floor((ae - D) / I);
              return S.isDark(ge, se) ? 0 : 1;
            } else
              return 1;
          });
        }, S.createImgTag = function(I, R, _) {
          I = I || 2, R = typeof R > "u" ? I * 4 : R;
          var D = S.getModuleCount() * I + R * 2, W = "";
          return W += "<img", W += ' src="', W += S.createDataURL(I, R), W += '"', W += ' width="', W += D, W += '"', W += ' height="', W += D, W += '"', _ && (W += ' alt="', W += ut(_), W += '"'), W += "/>", W;
        };
        var ut = function(I) {
          for (var R = "", _ = 0; _ < I.length; _ += 1) {
            var D = I.charAt(_);
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
        }, Ho = function(I) {
          var R = 1;
          I = typeof I > "u" ? R * 2 : I;
          var _ = S.getModuleCount() * R + I * 2, D = I, W = _ - I, J, ae, se, ge, $e, oe = {
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
            for (se = Math.floor((J - D) / R), ge = Math.floor((J + 1 - D) / R), ae = 0; ae < _; ae += 1)
              $e = "█", D <= ae && ae < W && D <= J && J < W && S.isDark(se, Math.floor((ae - D) / R)) && ($e = " "), D <= ae && ae < W && D <= J + 1 && J + 1 < W && S.isDark(ge, Math.floor((ae - D) / R)) ? $e += " " : $e += "█", Oe += I < 1 && J + 1 >= W ? Ce[$e] : oe[$e];
            Oe += `
`;
          }
          return _ % 2 && I > 0 ? Oe.substring(0, Oe.length - _ - 1) + Array(_ + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return S.createASCII = function(I, R) {
          if (I = I || 1, I < 2)
            return Ho(R);
          I -= 1, R = typeof R > "u" ? I * 2 : R;
          var _ = S.getModuleCount() * I + R * 2, D = R, W = _ - R, J, ae, se, ge, $e = Array(I + 1).join("██"), oe = Array(I + 1).join("  "), Ce = "", Oe = "";
          for (J = 0; J < _; J += 1) {
            for (se = Math.floor((J - D) / I), Oe = "", ae = 0; ae < _; ae += 1)
              ge = 1, D <= ae && ae < W && D <= J && J < W && S.isDark(se, Math.floor((ae - D) / I)) && (ge = 0), Oe += ge ? $e : oe;
            for (se = 0; se < I; se += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, S.renderTo2dContext = function(I, R) {
          R = R || 2;
          for (var _ = S.getModuleCount(), D = 0; D < _; D++)
            for (var W = 0; W < _; W++)
              I.fillStyle = S.isDark(D, W) ? "black" : "white", I.fillRect(D * R, W * R, R, R);
        }, S;
      };
      s.stringToBytesFuncs = {
        default: function(v) {
          for (var L = [], C = 0; C < v.length; C += 1) {
            var q = v.charCodeAt(C);
            L.push(q & 255);
          }
          return L;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(v, L) {
        var C = (function() {
          for (var M = P(v), E = function() {
            var le = M.read();
            if (le == -1) throw "eof";
            return le;
          }, g = 0, h = {}; ; ) {
            var A = M.read();
            if (A == -1) break;
            var O = E(), S = E(), Y = E(), U = String.fromCharCode(A << 8 | O), ue = S << 8 | Y;
            h[U] = ue, g += 1;
          }
          if (g != L)
            throw g + " != " + L;
          return h;
        })(), q = 63;
        return function(M) {
          for (var E = [], g = 0; g < M.length; g += 1) {
            var h = M.charCodeAt(g);
            if (h < 128)
              E.push(h);
            else {
              var A = C[M.charAt(g)];
              typeof A == "number" ? (A & 255) == A ? E.push(A) : (E.push(A >>> 8), E.push(A & 255)) : E.push(q);
            }
          }
          return E;
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
        var v = [
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
        ], L = 1335, C = 7973, q = 21522, M = {}, E = function(g) {
          for (var h = 0; g != 0; )
            h += 1, g >>>= 1;
          return h;
        };
        return M.getBCHTypeInfo = function(g) {
          for (var h = g << 10; E(h) - E(L) >= 0; )
            h ^= L << E(h) - E(L);
          return (g << 10 | h) ^ q;
        }, M.getBCHTypeNumber = function(g) {
          for (var h = g << 12; E(h) - E(C) >= 0; )
            h ^= C << E(h) - E(C);
          return g << 12 | h;
        }, M.getPatternPosition = function(g) {
          return v[g - 1];
        }, M.getMaskFunction = function(g) {
          switch (g) {
            case r.PATTERN000:
              return function(h, A) {
                return (h + A) % 2 == 0;
              };
            case r.PATTERN001:
              return function(h, A) {
                return h % 2 == 0;
              };
            case r.PATTERN010:
              return function(h, A) {
                return A % 3 == 0;
              };
            case r.PATTERN011:
              return function(h, A) {
                return (h + A) % 3 == 0;
              };
            case r.PATTERN100:
              return function(h, A) {
                return (Math.floor(h / 2) + Math.floor(A / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(h, A) {
                return h * A % 2 + h * A % 3 == 0;
              };
            case r.PATTERN110:
              return function(h, A) {
                return (h * A % 2 + h * A % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(h, A) {
                return (h * A % 3 + (h + A) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + g;
          }
        }, M.getErrorCorrectPolynomial = function(g) {
          for (var h = u([1], 0), A = 0; A < g; A += 1)
            h = h.multiply(u([1, c.gexp(A)], 0));
          return h;
        }, M.getLengthInBits = function(g, h) {
          if (1 <= h && h < 10)
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
          else if (h < 27)
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
          else if (h < 41)
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
            throw "type:" + h;
        }, M.getLostPoint = function(g) {
          for (var h = g.getModuleCount(), A = 0, O = 0; O < h; O += 1)
            for (var S = 0; S < h; S += 1) {
              for (var Y = 0, U = g.isDark(O, S), ue = -1; ue <= 1; ue += 1)
                if (!(O + ue < 0 || h <= O + ue))
                  for (var le = -1; le <= 1; le += 1)
                    S + le < 0 || h <= S + le || ue == 0 && le == 0 || U == g.isDark(O + ue, S + le) && (Y += 1);
              Y > 5 && (A += 3 + Y - 5);
            }
          for (var O = 0; O < h - 1; O += 1)
            for (var S = 0; S < h - 1; S += 1) {
              var me = 0;
              g.isDark(O, S) && (me += 1), g.isDark(O + 1, S) && (me += 1), g.isDark(O, S + 1) && (me += 1), g.isDark(O + 1, S + 1) && (me += 1), (me == 0 || me == 4) && (A += 3);
            }
          for (var O = 0; O < h; O += 1)
            for (var S = 0; S < h - 6; S += 1)
              g.isDark(O, S) && !g.isDark(O, S + 1) && g.isDark(O, S + 2) && g.isDark(O, S + 3) && g.isDark(O, S + 4) && !g.isDark(O, S + 5) && g.isDark(O, S + 6) && (A += 40);
          for (var S = 0; S < h; S += 1)
            for (var O = 0; O < h - 6; O += 1)
              g.isDark(O, S) && !g.isDark(O + 1, S) && g.isDark(O + 2, S) && g.isDark(O + 3, S) && g.isDark(O + 4, S) && !g.isDark(O + 5, S) && g.isDark(O + 6, S) && (A += 40);
          for (var Se = 0, S = 0; S < h; S += 1)
            for (var O = 0; O < h; O += 1)
              g.isDark(O, S) && (Se += 1);
          var qe = Math.abs(100 * Se / h / h - 50) / 5;
          return A += qe * 10, A;
        }, M;
      })(), c = (function() {
        for (var v = new Array(256), L = new Array(256), C = 0; C < 8; C += 1)
          v[C] = 1 << C;
        for (var C = 8; C < 256; C += 1)
          v[C] = v[C - 4] ^ v[C - 5] ^ v[C - 6] ^ v[C - 8];
        for (var C = 0; C < 255; C += 1)
          L[v[C]] = C;
        var q = {};
        return q.glog = function(M) {
          if (M < 1)
            throw "glog(" + M + ")";
          return L[M];
        }, q.gexp = function(M) {
          for (; M < 0; )
            M += 255;
          for (; M >= 256; )
            M -= 255;
          return v[M];
        }, q;
      })();
      function u(v, L) {
        if (typeof v.length > "u")
          throw v.length + "/" + L;
        var C = (function() {
          for (var M = 0; M < v.length && v[M] == 0; )
            M += 1;
          for (var E = new Array(v.length - M + L), g = 0; g < v.length - M; g += 1)
            E[g] = v[g + M];
          return E;
        })(), q = {};
        return q.getAt = function(M) {
          return C[M];
        }, q.getLength = function() {
          return C.length;
        }, q.multiply = function(M) {
          for (var E = new Array(q.getLength() + M.getLength() - 1), g = 0; g < q.getLength(); g += 1)
            for (var h = 0; h < M.getLength(); h += 1)
              E[g + h] ^= c.gexp(c.glog(q.getAt(g)) + c.glog(M.getAt(h)));
          return u(E, 0);
        }, q.mod = function(M) {
          if (q.getLength() - M.getLength() < 0)
            return q;
          for (var E = c.glog(q.getAt(0)) - c.glog(M.getAt(0)), g = new Array(q.getLength()), h = 0; h < q.getLength(); h += 1)
            g[h] = q.getAt(h);
          for (var h = 0; h < M.getLength(); h += 1)
            g[h] ^= c.gexp(c.glog(M.getAt(h)) + E);
          return u(g, 0).mod(M);
        }, q;
      }
      var f = (function() {
        var v = [
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
        ], L = function(M, E) {
          var g = {};
          return g.totalCount = M, g.dataCount = E, g;
        }, C = {}, q = function(M, E) {
          switch (E) {
            case o.L:
              return v[(M - 1) * 4 + 0];
            case o.M:
              return v[(M - 1) * 4 + 1];
            case o.Q:
              return v[(M - 1) * 4 + 2];
            case o.H:
              return v[(M - 1) * 4 + 3];
            default:
              return;
          }
        };
        return C.getRSBlocks = function(M, E) {
          var g = q(M, E);
          if (typeof g > "u")
            throw "bad rs block @ typeNumber:" + M + "/errorCorrectionLevel:" + E;
          for (var h = g.length / 3, A = [], O = 0; O < h; O += 1)
            for (var S = g[O * 3 + 0], Y = g[O * 3 + 1], U = g[O * 3 + 2], ue = 0; ue < S; ue += 1)
              A.push(L(Y, U));
          return A;
        }, C;
      })(), m = function() {
        var v = [], L = 0, C = {};
        return C.getBuffer = function() {
          return v;
        }, C.getAt = function(q) {
          var M = Math.floor(q / 8);
          return (v[M] >>> 7 - q % 8 & 1) == 1;
        }, C.put = function(q, M) {
          for (var E = 0; E < M; E += 1)
            C.putBit((q >>> M - E - 1 & 1) == 1);
        }, C.getLengthInBits = function() {
          return L;
        }, C.putBit = function(q) {
          var M = Math.floor(L / 8);
          v.length <= M && v.push(0), q && (v[M] |= 128 >>> L % 8), L += 1;
        }, C;
      }, $ = function(v) {
        var L = a.MODE_NUMBER, C = v, q = {};
        q.getMode = function() {
          return L;
        }, q.getLength = function(g) {
          return C.length;
        }, q.write = function(g) {
          for (var h = C, A = 0; A + 2 < h.length; )
            g.put(M(h.substring(A, A + 3)), 10), A += 3;
          A < h.length && (h.length - A == 1 ? g.put(M(h.substring(A, A + 1)), 4) : h.length - A == 2 && g.put(M(h.substring(A, A + 2)), 7));
        };
        var M = function(g) {
          for (var h = 0, A = 0; A < g.length; A += 1)
            h = h * 10 + E(g.charAt(A));
          return h;
        }, E = function(g) {
          if ("0" <= g && g <= "9")
            return g.charCodeAt(0) - 48;
          throw "illegal char :" + g;
        };
        return q;
      }, x = function(v) {
        var L = a.MODE_ALPHA_NUM, C = v, q = {};
        q.getMode = function() {
          return L;
        }, q.getLength = function(E) {
          return C.length;
        }, q.write = function(E) {
          for (var g = C, h = 0; h + 1 < g.length; )
            E.put(
              M(g.charAt(h)) * 45 + M(g.charAt(h + 1)),
              11
            ), h += 2;
          h < g.length && E.put(M(g.charAt(h)), 6);
        };
        var M = function(E) {
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
        return q;
      }, j = function(v) {
        var L = a.MODE_8BIT_BYTE, C = s.stringToBytes(v), q = {};
        return q.getMode = function() {
          return L;
        }, q.getLength = function(M) {
          return C.length;
        }, q.write = function(M) {
          for (var E = 0; E < C.length; E += 1)
            M.put(C[E], 8);
        }, q;
      }, k = function(v) {
        var L = a.MODE_KANJI, C = s.stringToBytesFuncs.SJIS;
        if (!C)
          throw "sjis not supported.";
        (function(E, g) {
          var h = C(E);
          if (h.length != 2 || (h[0] << 8 | h[1]) != g)
            throw "sjis not supported.";
        })("友", 38726);
        var q = C(v), M = {};
        return M.getMode = function() {
          return L;
        }, M.getLength = function(E) {
          return ~~(q.length / 2);
        }, M.write = function(E) {
          for (var g = q, h = 0; h + 1 < g.length; ) {
            var A = (255 & g[h]) << 8 | 255 & g[h + 1];
            if (33088 <= A && A <= 40956)
              A -= 33088;
            else if (57408 <= A && A <= 60351)
              A -= 49472;
            else
              throw "illegal char at " + (h + 1) + "/" + A;
            A = (A >>> 8 & 255) * 192 + (A & 255), E.put(A, 13), h += 2;
          }
          if (h < g.length)
            throw "illegal char at " + (h + 1);
        }, M;
      }, y = function() {
        var v = [], L = {};
        return L.writeByte = function(C) {
          v.push(C & 255);
        }, L.writeShort = function(C) {
          L.writeByte(C), L.writeByte(C >>> 8);
        }, L.writeBytes = function(C, q, M) {
          q = q || 0, M = M || C.length;
          for (var E = 0; E < M; E += 1)
            L.writeByte(C[E + q]);
        }, L.writeString = function(C) {
          for (var q = 0; q < C.length; q += 1)
            L.writeByte(C.charCodeAt(q));
        }, L.toByteArray = function() {
          return v;
        }, L.toString = function() {
          var C = "";
          C += "[";
          for (var q = 0; q < v.length; q += 1)
            q > 0 && (C += ","), C += v[q];
          return C += "]", C;
        }, L;
      }, B = function() {
        var v = 0, L = 0, C = 0, q = "", M = {}, E = function(h) {
          q += String.fromCharCode(g(h & 63));
        }, g = function(h) {
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
          for (v = v << 8 | h & 255, L += 8, C += 1; L >= 6; )
            E(v >>> L - 6), L -= 6;
        }, M.flush = function() {
          if (L > 0 && (E(v << 6 - L), v = 0, L = 0), C % 3 != 0)
            for (var h = 3 - C % 3, A = 0; A < h; A += 1)
              q += "=";
        }, M.toString = function() {
          return q;
        }, M;
      }, P = function(v) {
        var L = v, C = 0, q = 0, M = 0, E = {};
        E.read = function() {
          for (; M < 8; ) {
            if (C >= L.length) {
              if (M == 0)
                return -1;
              throw "unexpected end of file./" + M;
            }
            var h = L.charAt(C);
            if (C += 1, h == "=")
              return M = 0, -1;
            if (h.match(/^\s$/))
              continue;
            q = q << 6 | g(h.charCodeAt(0)), M += 6;
          }
          var A = q >>> M - 8 & 255;
          return M -= 8, A;
        };
        var g = function(h) {
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
        return E;
      }, te = function(v, L) {
        var C = v, q = L, M = new Array(v * L), E = {};
        E.setPixel = function(O, S, Y) {
          M[S * C + O] = Y;
        }, E.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(C), O.writeShort(q), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(C), O.writeShort(q), O.writeByte(0);
          var S = 2, Y = h(S);
          O.writeByte(S);
          for (var U = 0; Y.length - U > 255; )
            O.writeByte(255), O.writeBytes(Y, U, 255), U += 255;
          O.writeByte(Y.length - U), O.writeBytes(Y, U, Y.length - U), O.writeByte(0), O.writeString(";");
        };
        var g = function(O) {
          var S = O, Y = 0, U = 0, ue = {};
          return ue.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; Y + me >= 8; )
              S.writeByte(255 & (le << Y | U)), me -= 8 - Y, le >>>= 8 - Y, U = 0, Y = 0;
            U = le << Y | U, Y = Y + me;
          }, ue.flush = function() {
            Y > 0 && S.writeByte(U);
          }, ue;
        }, h = function(O) {
          for (var S = 1 << O, Y = (1 << O) + 1, U = O + 1, ue = A(), le = 0; le < S; le += 1)
            ue.add(String.fromCharCode(le));
          ue.add(String.fromCharCode(S)), ue.add(String.fromCharCode(Y));
          var me = y(), Se = g(me);
          Se.write(S, U);
          var qe = 0, We = String.fromCharCode(M[qe]);
          for (qe += 1; qe < M.length; ) {
            var ct = String.fromCharCode(M[qe]);
            qe += 1, ue.contains(We + ct) ? We = We + ct : (Se.write(ue.indexOf(We), U), ue.size() < 4095 && (ue.size() == 1 << U && (U += 1), ue.add(We + ct)), We = ct);
          }
          return Se.write(ue.indexOf(We), U), Se.write(Y, U), Se.flush(), me.toByteArray();
        }, A = function() {
          var O = {}, S = 0, Y = {};
          return Y.add = function(U) {
            if (Y.contains(U))
              throw "dup key:" + U;
            O[U] = S, S += 1;
          }, Y.size = function() {
            return S;
          }, Y.indexOf = function(U) {
            return O[U];
          }, Y.contains = function(U) {
            return typeof O[U] < "u";
          }, Y;
        };
        return E;
      }, b = function(v, L, C) {
        for (var q = te(v, L), M = 0; M < L; M += 1)
          for (var E = 0; E < v; E += 1)
            q.setPixel(E, M, C(E, M));
        var g = y();
        q.write(g);
        for (var h = B(), A = g.toByteArray(), O = 0; O < A.length; O += 1)
          h.writeByte(A[O]);
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
}, Ty = /* @__PURE__ */ Z(bv, [["__scopeId", "data-v-489f0852"]]), By = er(() => import("./VoiceFigure-DXJR4RiJ.js").then((e) => e.V)), Iy = "1.0.0", Ry = "3.5";
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
  vs as a$,
  ye as a0,
  ys as a1,
  Av as a2,
  Ku as a3,
  Cy as a4,
  Pv as a5,
  Qt as a6,
  my as a7,
  xv as a8,
  Tt as a9,
  st as aA,
  Th as aB,
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
  rt as aQ,
  Ov as aR,
  Iv as aS,
  by as aT,
  yy as aU,
  xy as aV,
  Wg as aW,
  hg as aX,
  vo as aY,
  wy as aZ,
  Bh as a_,
  Me as aa,
  Iy as ab,
  Ry as ac,
  $y as ad,
  rs as ae,
  Lv as af,
  v1 as ag,
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
  wt as au,
  Bv as av,
  _v as aw,
  gs as ax,
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
  ln as p,
  py as q,
  ly as r,
  Gv as s,
  De as t,
  cm as u,
  dy as v,
  hm as w,
  Ss as x,
  Rp as y,
  Lp as z
};
