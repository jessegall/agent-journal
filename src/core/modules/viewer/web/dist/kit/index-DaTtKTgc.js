/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as we, createElementVNode as p, normalizeClass as Q, Fragment as X, renderList as re, normalizeStyle as be, defineComponent as Uo, Comment as Vo, h as ps, cloneVNode as zo, createBlock as G, withCtx as V, unref as z, createVNode as H, toDisplayString as k, createCommentVNode as P, inject as Ne, computed as O, resolveDynamicComponent as lt, Transition as It, watch as ke, ref as q, shallowRef as pn, TransitionGroup as Go, mergeProps as ot, reactive as ms, createTextVNode as he, onMounted as Le, onUnmounted as Ae, nextTick as Rt, useId as ya, Teleport as wa, withModifiers as _e, isRef as Bs, onBeforeUnmount as yt, resolveDirective as Ko, withDirectives as rt, useModel as Vn, useAttrs as ka, getCurrentInstance as Yo, mergeModels as zn, getCurrentScope as ba, onScopeDispose as $a, provide as Jo, onErrorCaptured as Zo, toHandlers as Xo, createSlots as Qo, vShow as er, withKeys as en, vModelText as Gn, defineAsyncComponent as tr } from "vue";
const Z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, nr = { class: "skeleton-line" }, sr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", nr, [
      we(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: Q(["bars", { faded: e.filled }])
      }, [
        (l(!0), d(X, null, re(e.bars, (s) => (l(), d("span", {
          key: s.width,
          class: Q(["bar", { still: e.still }]),
          style: be({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Qe = /* @__PURE__ */ Z(sr, [["__scopeId", "data-v-0ebb6933"]]), gs = Uo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Vo);
      return s.length !== 1 ? ps(X, { key: n }, s) : s[0].key == null ? zo(s[0], { key: n }) : s[0];
    };
  }
}), ar = ["aria-label"], or = ["aria-label"], rr = ["aria-label"], ir = ["aria-label"], lr = ["aria-label"], cr = ["aria-label"], ur = ["aria-label"], dr = {
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
            style: be({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, ar)
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
            style: be({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, or)
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
        ], 8, rr)
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
        ], 8, ir)
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
        ], 8, lr)
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
        ], 8, cr)
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
        ], 8, ur)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, wt = /* @__PURE__ */ Z(dr, [["__scopeId", "data-v-c687fb85"]]), hr = {
  key: 1,
  class: "empty-state titled"
}, fr = { class: "empty-state-title" }, pr = { class: "empty-state-text" }, mr = {
  key: 2,
  class: "empty-state"
}, gr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), G(wt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", hr, [
      p("p", fr, k(e.title), 1),
      p("p", pr, [
        we(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", mr, [
      we(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, tn = /* @__PURE__ */ Z(gr, [["__scopeId", "data-v-b27e89b0"]]), vr = { class: "fold-group" }, yr = ["aria-expanded"], wr = { class: "fold-label" }, kr = {
  key: 0,
  class: "fold-count"
}, br = {
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
    return (s, a) => (l(), d("div", vr, [
      p("button", {
        type: "button",
        class: Q(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", wr, k(e.label), 1),
        e.count !== "" ? (l(), d("span", kr, k(e.count), 1)) : P("", !0),
        p("span", {
          class: Q(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, yr),
      e.open ? we(s.$slots, "default", {}, void 0, !0, 0) : P("", !0)
    ]));
  }
}, Av = /* @__PURE__ */ Z(br, [["__scopeId", "data-v-9ef1865c"]]), $r = Symbol("open-view"), je = Symbol.for("journal.window-context");
function vs() {
  const e = Ne(je, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const xr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: be({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Mr = /* @__PURE__ */ Z(xr, [["__scopeId", "data-v-eb453d6f"]]), _r = {
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
    const t = e, n = O(() => {
      var s;
      return t.busy || t.disabled || !!((s = Ne(je, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), G(lt(e.href ? "a" : "button"), {
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
        e.busy ? (l(), G(Mr, {
          key: 0,
          class: "btn-spinner"
        })) : P("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ Z(_r, [["__scopeId", "data-v-a2dc4bda"]]), Sr = {
  class: "running",
  "data-running-command": ""
}, Er = ["title"], Ar = {
  key: "idle",
  class: "running-idle"
}, Cr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", Sr, [
      H(It, {
        name: "roll",
        mode: "out-in"
      }, {
        default: V(() => [
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, Er)) : (l(), d("span", Ar, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Cv = /* @__PURE__ */ Z(Cr, [["__scopeId", "data-v-d3240219"]]), Or = ["aria-checked", "aria-label", "title"], Tr = {
  key: 0,
  class: "switch-inner"
}, Br = {
  key: 0,
  class: "switch-word"
}, Ir = {
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
        e.labelled ? (l(), d("span", Tr, k(e.word), 1)) : P("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Br, k(e.word), 1)) : P("", !0)
    ], 10, Or));
  }
}, Ov = /* @__PURE__ */ Z(Ir, [["__scopeId", "data-v-1bfb90f3"]]);
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
  ke(t, (n) => mn(e, n), { deep: !0 });
}
function Rr(e, t) {
  return xa(() => sessionStorage, e, t);
}
function Lr(e, t) {
  return Ma(() => sessionStorage, e, t);
}
const nn = "journal.environment", Sa = q(Rr(nn, Ct(nn, "")));
function Dr(e) {
  Sa.value = e, Lr(nn, e), mn(nn, e);
}
const sn = q(location.hash), Is = pn(null), Rs = { integrations: "mcp", library: "team" };
function Nr() {
  if (!Is.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Rs[n]) {
    location.replace(`#/${[Rs[n], ...s].join("/")}${t ? `?${t}` : ""}`), sn.value = location.hash;
    return;
  }
  !n || Is.value(n) || (Dr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), sn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  sn.value = location.hash, Nr();
});
const Pe = O(() => {
  const [e, t = ""] = sn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
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
function jr(e = "", t = 0, n = "") {
  location.hash = gn.page(e, t, n);
}
const Pr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ea(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Pr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function Tv(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Aa(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = gt[e]) != null && r.call(gt, t))) return;
  const a = Pe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Ea([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function qr(e, t, n, s = 0, a = "") {
  if (e === Pe.value.env) return Aa(t, n, s, a);
  const o = Pe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ea([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function it(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? qr(s, a, Number(o), 0, t) : Aa(a, Number(o), 0, t);
}
function Wr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function mt(e) {
  const t = Wr(e);
  t && it(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Fr = ["stroke-width", "innerHTML"], xe = {
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
      style: be({
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
    }, null, 12, Fr));
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
        H(xe, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Hr = {
  key: 1,
  class: "row-list-failure"
}, Ur = ["data-row"], Vr = {
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
    const t = e, n = O(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = q(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (l(), G(wt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", Hr, k(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), G(tn, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(X, { key: 3 }, [
      (l(), G(lt(e.arrival ? Go : "ul"), ot(n.value, { class: "row-list" }), {
        default: V(() => [
          (l(!0), d(X, null, re(e.rows, (i) => (l(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            we(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Ur))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : P("", !0)
    ], 64));
  }
}, zr = /* @__PURE__ */ Z(Vr, [["__scopeId", "data-v-7f34ada7"]]), Gr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Kr = {
  key: 1,
  class: "agent-rows-note"
}, Yr = {
  key: 2,
  class: "agent-rows-note"
}, Jr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Zr = ["data-agent-row", "onClick"], Xr = { class: "agent-row-name" }, Qr = { class: "agent-row-state" }, ei = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = O(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", Gr, [
      e.loaded ? e.failure ? (l(), d("p", Kr, k(e.failure), 1)) : e.rows.length ? (l(), d(X, { key: 3 }, [
        p("p", Jr, k(s.value) + " running", 1),
        (l(!0), d(X, null, re(n.value, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(it)(`agents:${r.id}`)
        }, [
          p("span", Xr, "#" + k(r.id) + " " + k(r.session), 1),
          p("span", Qr, k(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Zr))), 128))
      ], 64)) : (l(), d("p", Yr, k(e.none), 1)) : (l(), G(wt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Bv = /* @__PURE__ */ Z(ei, [["__scopeId", "data-v-a01e5a17"]]), ti = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: Q(["badge", e.tone])
    }, k(e.text), 3));
  }
}, Ca = /* @__PURE__ */ Z(ti, [["__scopeId", "data-v-9e7e1157"]]), ni = ["aria-valuenow", "aria-valuemax"], si = {
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
    const t = e, n = O(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (l(), d("span", {
      class: Q(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: be({ width: n.value })
      }, null, 4)
    ], 10, ni));
  }
}, ai = /* @__PURE__ */ Z(si, [["__scopeId", "data-v-9eba6a85"]]), oi = { class: "bars" }, ri = { class: "bar-name" }, ii = { class: "bar-value" }, li = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = O(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", oi, [
      (l(!0), d(X, null, re(e.items, (c, u) => (l(), G(lt(c.open ? "button" : "div"), {
        key: `${u}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: Q(["bar-row", c.tone, { opens: c.open }]),
        onClick: (f) => c.open && s("open", c.open)
      }, {
        default: V(() => [
          p("span", ri, k(c.label), 1),
          H(ai, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", ii, k(c.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ci = /* @__PURE__ */ Z(li, [["__scopeId", "data-v-663427f4"]]), ui = { class: "bars" }, di = {
  key: 0,
  class: "bars-title"
}, hi = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", ui, [
      e.node.title ? (l(), d("span", di, k(e.node.title), 1)) : P("", !0),
      H(ci, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, fi = /* @__PURE__ */ Z(hi, [["__scopeId", "data-v-7135bb11"]]), pi = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = O(() => n[s.node.type](s.node));
    return (r, i) => (l(), d("div", {
      class: Q([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: be(o.value)
    }, [
      (l(!0), d(X, null, re(e.node.children || [], (c, u) => (l(), G(ao, {
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (f) => a("open", f)),
        onFile: i[1] || (i[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Jt = /* @__PURE__ */ Z(pi, [["__scopeId", "data-v-d142a3f4"]]), mi = {
  key: 0,
  class: "card-head"
}, gi = { class: "card-title" }, vi = {
  key: 0,
  class: "card-note"
}, yi = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: Q(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), d("header", mi, [
        p("span", gi, k(e.node.title), 1),
        e.node.note ? (l(), d("span", vi, k(e.node.note), 1)) : P("", !0)
      ])) : P("", !0),
      H(Jt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, wi = /* @__PURE__ */ Z(yi, [["__scopeId", "data-v-67b72d40"]]), ki = (e, t, n) => Math.max(t, Math.min(n, e)), bi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Me = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ls = (e) => (e || "").split(`
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
}, $i = (e) => (Ns[e.table] ? Ns[e.table](e) : e.title || "") || "", xi = ["done", "cancelled"], Kn = {
  tasks: (e) => Me(e.completed_at) || (e.state === "cancelled" ? Me(e.updated_at) : 0),
  questions: (e) => e.answer ? Me(e.updated_at) : 0,
  plans: (e) => xi.includes(e.state) ? Me(e.updated_at) : 0,
  notices: (e) => Me(e.closed_at),
  secrets: (e) => Me(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Me(e.updated_at) : 0,
  shares: (e) => Me(e.stopped_at),
  dumps: (e) => Me(e.completed_at),
  agents: (e) => e.state === "ended" ? Me(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Me(e.created_at) : 0
}, Mi = (e) => Kn[e.table] ? Kn[e.table](e) : 0, Oa = (e) => Mi(e) > 0, _i = (e) => !!Kn[e], Ta = (e) => Me(e.created_at), an = (e) => Me(e.updated_at) || Ta(e), Si = (e) => "task_ids" in e, vn = typeof document < "u" && document.documentElement.classList.contains("phone"), Ei = "Files are attached on the computer; the phone sends text.", Ba = 1024, Ai = Ba * 1024 * 1024, Ci = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ba} MB limit for one file.`;
function Oi() {
  return () => {
  };
}
function js(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Ti(e = window) {
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
}), Bi = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Ra = () => !!ve.countdown || Bi() || ve.starting;
function Ii(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function Ri(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Li() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Di(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Li(), !0);
}
let Ft = { version: "", started: 0 };
function Ni(e) {
  return e.version ? (Ft.version || (Ft = { version: e.version, started: e.started || 0 }), e.version !== Ft.version || (e.started || 0) !== Ft.started) : !1;
}
function ji(e) {
  Ri(e.countdown), Ii(e.ready, e.step), (Di(!!e.updating, e.step) || !e.updating && !Pi(e) && Ni(e)) && Ti(window);
}
const Pi = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Ps = 2e4, qi = 3e5, Fe = 6e5, Ht = 6, Wi = 500, Fi = "/journal/summary", qs = vn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Hi = (e) => e.split("?")[0].endsWith(Fi), La = (e, t) => Object.assign(new Error(t), { status: e });
async function Ui(e, t, n = La) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Vi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class zi {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Ht;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Ht;
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
        body: Vi(s),
        signal: AbortSignal.timeout(a || (i ? qi : Ps))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, Wi)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Ht, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Oi(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Ui(c, `${c.status} ${c.statusText}`).catch((u) => {
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
    if (t !== "GET") return this.send(t, n, s, a, Ht, o).then((c) => (this.written(n), c));
    if (Ra() && !Hi(n))
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
const De = new zi(), Ee = (e) => encodeURIComponent(e);
function de(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const $t = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), xt = "the page does not know its environment yet", Gi = "X-Journal-Env", Ki = "X-Journal-Request-At", Mn = "/viewer/voices/figures/";
class ws {
  constructor({ env: t = () => Pe.value.env, base: n = "" } = {}) {
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
    return { [Ki]: String(Date.now()), ...this.env() ? { [Gi]: this.env() } : {} };
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
    if (vn) return Promise.reject(Object.assign(new Error(Ei), { status: 403 }));
    if (s.size > Ai) return Promise.reject(new Error(Ci(s)));
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
const ie = new ws({ base: vn ? "/p" : "" }), Yi = (e) => De.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Ji = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ji).map(([e, t]) => ({ key: e, label: t }));
const Ws = (e) => e.status === "stopped" ? 1 : 0, Zi = "main", Xi = (e) => e.filter((t) => t.role === Zi).sort((t, n) => Ws(t) - Ws(n) || Me(n.heard_at) - Me(t.heard_at))[0] || null, Qi = { me: 1, people: [] }, K = ms({
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
  people: Qi,
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
const vt = O(() => Xi(K.agents));
O(() => !!vt.value && K.live.some((e) => e.agent.session === vt.value.session && e.environment === Pe.value.env));
O(() => !!vt.value && ["busy", "working"].includes(vt.value.status));
function el(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Yn(e) {
  const t = el(e);
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
function tl(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${_n(t % 60)}s` : `${Math.floor(t / 3600)}h ${_n(Math.floor(t % 3600 / 60))}m ${_n(t % 60)}s`;
}
const nl = ["working", "busy", "waiting", "compacting"], sl = (e) => nl.includes(e), al = "builder";
O(() => !K.settings || K.settings.features.file_feed !== !1);
const ol = O(() => !K.settings || K.settings.features.status_bar !== !1);
O(() => K.settings && K.settings.workers && K.settings.workers.mode || al);
O(() => !K.settings || !K.settings.tasks || K.settings.tasks.auto !== !1);
O(() => !!(K.settings && K.settings.reviewing && K.settings.reviewing.reviewer));
O(() => !K.settings || K.settings.features.sharing !== !1);
const on = 50, ks = 100, rl = { messages: 25 }, Re = (e) => rl[e] || on;
function il(e, t) {
  if (e !== "messages") return Math.max(t.length - Re(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Re(e)) return s;
  return 0;
}
const ll = "review_step", cl = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === ll).sort((t, n) => t.id - n.id), ul = 5, dl = 500, hl = 3e3, fl = () => K.entries.length ? K.entries[K.entries.length - 1].id : 0, Zt = { env: "", id: 0 }, pl = () => !!(K.bar && K.bar.length) || sl(vt.value && vt.value.status);
function ml({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function gl() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: ks })))).then(cl);
}
function vl() {
  return Zt.env !== ie.env() && Object.assign(Zt, { env: ie.env(), id: fl() }), ie.entries(Zt.id);
}
function yl(e) {
  e.length && (Zt.id = e[e.length - 1].id, cc(e));
}
async function wl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", on);
}
const Jn = /* @__PURE__ */ new Map();
async function Zn(e, t) {
  const n = `${e}:${ie.env()}`, s = Jn.get(n);
  if (!s) return Hs(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(an)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ie.list("workers", { limit: t, since: a, after: o });
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
    every: () => pl() ? dl : hl,
    take: (e) => Array.isArray(e) && (K.bar = e),
    active: () => ol.value
  },
  "agents.index": { read: () => Us(ie, ul), every: 1e3, take: (e) => K.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => K.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      K.summary = e, ji(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => K.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => K.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (K.people = e) },
  "entries.recent": { read: vl, every: 1e3, take: yl },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: ml, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Zn("workers.index", Re("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Zn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: gl, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Re("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: wl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Us(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: on }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: on }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), kl = 6e4, bl = 3e3, $l = 4, xl = 300, Ml = 5e3, Na = /* @__PURE__ */ new Map();
function yn(e) {
  if (!(e in Vs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Vs[e];
}
function _l(e) {
  const t = yn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Ml;
  }
}
const Sl = (e) => e / 2 + Math.random() * e / 2, ja = (e) => [...e.users.values()].pop(), bs = (e) => Na.get(e.place) === e, El = () => Math.random() * xl, $s = () => document.hidden;
function Al(e) {
  const t = _l(e);
  return e.failures ? Sl(Math.min(e.key === Ia ? bl : kl, t * 2 ** e.failures)) : Math.max(t, $l * e.took);
}
function Pa(e, t) {
  clearTimeout(e.timer), !(!bs(e) || e.paused || $s()) && (e.timer = setTimeout(() => Cl(e), t));
}
function Cl(e) {
  return bs(e) ? e.running ? (e.again = !0, e.running) : (e.running = Il(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Ol = (e) => {
  var t, n;
  return !e.paused && !$s() && (((n = (t = yn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && ja(e).active() && (!Ra() || e.key === Ia);
};
async function Tl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await De.attemptOnce(() => yn(e.key).read(ja(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Bl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = yn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Il(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Ol(e) && Bl(e, await Tl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && bs(e) && !e.paused);
  Pa(e, Al(e));
}
const Rl = () => $s() || Na.forEach((e) => Pa(e, El()));
document.addEventListener("visibilitychange", Rl);
const Ll = 60, Dl = (e, t) => Me(e.created_at) >= Me(t.created_at) - Ll, Nl = (e, t) => e.id > 0 && e.table === t.table && Dl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), xs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Nl(s, n))), Sn = [
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
}), Lt = {
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
}, jl = ["secrets", "plugins"], qa = Object.keys(Lt).filter((e) => !(vn && jl.includes(e)));
O(() => qa.map((e) => ({ name: e, ...Lt[e] })));
const Dt = (e) => Lt[e], Wa = new Map(qa.flatMap((e) => [e, e.replace(/s$/, ""), Lt[e].title.toLowerCase()].map((t) => [t, e]))), at = (e) => Wa.get(String(e).toLowerCase()) || "", Fa = [...Wa.keys()].sort((e, t) => t.length - e.length).join("|"), Xe = /* @__PURE__ */ new Set(), Ms = q(0), Nt = /* @__PURE__ */ new Set(), jt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Xn = /* @__PURE__ */ new Set(), Pl = /* @__PURE__ */ new Map(), ql = /* @__PURE__ */ new Map();
let pt = !1, Mt = null;
const Wl = (e, t) => e.id - t.id, Fl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Hl = { messages: Fl }, Ha = (e) => Hl[e] || Wl;
function Ua(e) {
  return Ms.value, Xe.has(e) || (Xe.add(e), K.booted && (!Nt.has(e) || jt.has(e)) && queueMicrotask(() => kn([e], !1))), K.rows[e] || [];
}
function Ul(e) {
  const t = K.rows[e] || [], n = il(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  K.rows[e] = t.filter((a) => s.has(a) || _i(e) && !Oa(a)), K.paging.size[e] = Re(e), K.paging.more[e] = !0;
}
const Vl = /* @__PURE__ */ new Set();
function zl() {
  Xe.forEach(Ul), Xe.clear(), Pl.clear(), ql.clear(), Ms.value += 1;
}
ke(() => `${Pe.value.env}/${Pe.value.page}/${Pe.value.open ? Pe.value.open.table : ""}`, zl);
ke(
  () => K.booted,
  (e) => e && kn(
    [...Xe].filter((t) => !Nt.has(t)),
    !1
  )
);
const Qn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Si(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Va(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Qn(s) && !Qn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function za(e, t) {
  Nt.add(e), Ms.value += 1;
  const n = K.rows[e] || [];
  K.rows[e] = [...Va(n, t.rows), ...xs(n.filter((s) => s.id === 0), t.rows)], K.paging.size[e] = K.paging.size[e] || Re(e), K.paging.more[e] = !t.is_last_page;
}
async function Gl(e) {
  const t = new Set((K.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Re(e) });
  wn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = xs((K.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return za(e, { ...n, rows: [...n.rows, ...a].sort(Ha(e)) }), K.paging.size[e] = Re(e), Ga.has(e) && await Ka(e), K.rows[e];
}
const wn = (e, t) => K.counts = { ...K.counts, [e]: t };
async function Kl(e) {
  const t = K.rows[e] || [], n = Math.max(0, ...t.map(an)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ie.list(e, { limit: Re(e), since: n, after: s });
  if (wn(e, a.counts), !a.is_last_page) return Gl(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = xs(t.filter((i) => !o.has(i.id)), a.rows).concat(Va(t, a.rows));
  return K.rows[e] = r.sort(Ha(e)), K.paging.size[e] = K.rows[e].length, K.rows[e];
}
const En = /* @__PURE__ */ new Set();
async function Yl(e, t = !1) {
  e.forEach((n) => jt.delete(n)), e.forEach((n) => Xn.add(n));
  try {
    await nc(e, t);
  } finally {
    e.forEach((n) => Xn.delete(n));
  }
}
async function Jl(e) {
  const t = await ie.list(e, { limit: Re(e) });
  wn(e, t.counts), za(e, t);
}
async function Zl(e) {
  wn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Ga = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ka(e) {
  const t = (K.rows[e] || []).filter((a) => Qn(a) && (e !== "plans" || !Oa(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  K.rows[e] = (K.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Xl = (e, t) => !Nt.has(e) || t && (K.paging.size[e] || Re(e)) === Re(e) && !Vl.has(e);
async function Ql(e, t) {
  if (!Xe.has(e)) return Zl(e);
  const n = await (Xl(e, t) ? Jl(e) : Kl(e));
  return Ga.has(e) && await Ka(e), n;
}
async function ec() {
  const [e, t] = await Promise.all([ie.entries(0, ks), ie.settings()]);
  Za([...Ct(Ja(), []), ...e]), JSON.stringify(t) !== JSON.stringify(K.settings) && (K.settings = t);
}
const tc = (e, t) => Ql(e, t).then(
  () => null,
  () => e
);
async function nc(e, t) {
  const n = (await Promise.all(e.map((s) => tc(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), jt.add(s))), t && await ec(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ya = 1e3, sc = 15e3;
let Ut = Ya;
async function ac() {
  return Mt || (Mt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !En.has(e)) || pt; ) {
      const e = pt, t = [...e ? Object.keys(K.rows) : Ke].filter((s) => Lt[s] && (Xe.has(s) || s in K.rows)).filter((s) => e || !Xe.has(s) || jt.has(s) || !Nt.has(s)).filter((s) => !En.has(s)), n = [...Ke].filter((s) => En.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), pt = !1;
      try {
        await Yl(t, e), Ut = Ya;
      } catch {
        pt = pt || e, await new Promise((a) => setTimeout(a, Ut)), Ut = Math.min(Ut * 2, sc);
      }
    }
  })().finally(() => Mt = null), Mt);
}
function kn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Xn.has(n)).forEach((n) => {
    Ke.add(n), t && jt.add(n);
  }), Ke.has("settings") && (pt = !0), ac();
}
const Ja = () => {
  var e;
  return `typed-entries:${((e = K.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Za(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  K.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ks), mn(Ja(), K.entries.slice(-50));
}
const oc = ["created", "updated", "deleted"], rc = { phases: ["phases", "plans"] }, es = (e) => rc[e] || [e], ic = (e) => oc.includes(e.entry_type) ? [...es(e.data.table), ...(e.data.joins || []).flatMap(es)] : [];
function lc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of es(t.data.table).filter((s) => K.rows[s]))
      K.rows[n] = K.rows[n].filter((s) => s.id !== t.data.id);
}
function cc(e) {
  Za([...K.entries, ...e]), lc(e), kn([...new Set(e.flatMap(ic))].filter((t) => t && t !== "agents"));
}
Yi((e) => K.streamOpen || kn([e]));
const ts = [], uc = 2e3, Ge = /* @__PURE__ */ new Map(), dc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, hc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ct(e, { first: t = !1 } = {}) {
  t ? ts.unshift(e) : ts.push(e), Ge.clear();
}
function Xa(e, t, n) {
  var a;
  const s = Ua(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const fc = (e) => Ua(e.table).find((t) => t.id === e.id) === e.row, pc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function mc(e, t) {
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
  return gc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function gc(e) {
  return e.split(hc).map((t, n) => n % 2 ? t : t.replace(dc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function zs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function vc(e) {
  const [t, , ...n] = e, s = zs(t).map((o) => `<th>${Ot(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${zs(o).map((r) => `<td>${Ot(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function yc(e) {
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
      n.push(vc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(yc(t.slice(s, i))), s = i;
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
const wc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, kc = (e) => e.kind !== "text" && !wc.test(e.html);
function bc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Qa(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : kc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ns(e, t = { env: "" }) {
  const n = pc(e, t), s = Ge.get(n);
  if (Ge.delete(n), s && s.reads.every(fc))
    return Ge.set(n, s), s.html;
  const a = [], o = bc(mc(e, { ...t, reads: a }));
  return Ge.set(n, { html: o, reads: a }), Ge.size > uc && Ge.delete(Ge.keys().next().value), o;
}
const eo = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, rn = (e) => String(e || "").replace(eo, (t, n, s, a) => a), $c = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Vt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, xc = /^Traceback \(most recent call last\):/m, Mc = 8;
function to(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Mc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function _c(e) {
  const t = [...e.matchAll($c)].map((s) => s.index);
  if (Vt.lastIndex = 0, !t.length || !Vt.test(e)) return null;
  Vt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Vt)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: to(n), tail: "" } : null;
}
function Sc(e) {
  const t = xc.exec(e);
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
ct((e) => {
  const t = rn(e), n = Sc(t) || _c(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const ss = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Ec = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Ac = `${ss} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Cc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Oc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ks = {
  js: { keywords: ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Ec, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Ac, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Cc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Oc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Ys(e, t, n) {
  return n && e.startsWith(n, t);
}
function Tc(e, t) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? f.toLowerCase() : f, w = n.property && /^\s*:/.test(e.slice(o + f.length));
      r(s.has(m) ? "keyword" : w ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function Bc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Tc(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Ue(r) : `<span class="tok-${s}">${Ue(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Ic(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Rc = 1500, Js = /* @__PURE__ */ new WeakMap();
async function Lc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Ic(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Js.get(t)), Js.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Rc)
  )));
}
typeof document < "u" && document.addEventListener("click", Lc, !0);
const Dc = /^(```|~~~)\s*(\w+)?\s*$/, Nc = /^\s{4,}\S/, jc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Pc = /^\s*(?:[-*+]|\d+[.)])\s/, no = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, qc = [
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
function Wc(e) {
  const t = so(e.join(`
`));
  return (qc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Fc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && no.test(t) && !Pc.test(t);
};
function Zs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Bc(so(e.join(`
`)), t || Wc(e)).join(`
`)}</code></pre></div>` };
}
function Hc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Dc);
    if (r) {
      const c = t.findIndex((f, m) => m > o && f.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Zs(t.slice(o + 1, u).map(rn), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Fc(s) ? jc : Nc;
    if (i.test(t[o])) {
      let c = o;
      for (; c < t.length && (i.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && no.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (c - o + u.length >= 2) {
        a(), n.push(Zs([...u, ...t.slice(o, c)].map(rn), "")), o = c;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ct((e) => Hc(e));
const Uc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Vc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function zc(e) {
  const t = Uc.exec(e);
  if (t && at(t[1])) return { at: t.index, length: t[0].length, table: at(t[1]), id: Number(t[2]), label: t[3] };
  const n = Vc.exec(e), s = n && at(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Gc(e, t, n, s) {
  const a = Xa(s, e, t), o = rn(a ? $i(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(Dt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
ct(
  (e, t) => {
    const n = zc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Gc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Kc = /\.(png|jpe?g|gif|webp|svg)$/i, Yc = (e) => Kc.test(e), Jc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Zc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Xc(e, t) {
  const n = Jc.exec(e), [, s, a, o, r, i] = n || [], c = n && at(s || o), u = c && Xa(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const f = ie.in(t.env).fileUrl(c, u.id, i), m = `${Dt(c).title} ${u.id} · ${Ue(i)}`, w = Yc(i) ? `<img class="file-card-image" src="${f}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Ue(i)}">${w}<span class="file-card-name">${m}</span></a>` };
}
function Qc(e) {
  const t = Zc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ct(
  (e, t) => {
    if (t.inline) return null;
    const n = Xc(e, t) || Qc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const eu = /`([^`\n]+)`/g;
ct((e) => e.replace(eu, (t, n) => `<code>${n}</code>`));
const Xs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${gn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ct(
  (e, t) => e.replace(eo, (n, s, a, o) => Xs[s] ? Xs[s](a, o, t) : o)
);
const tu = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, nu = new RegExp(`\\b(${Fa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), su = new RegExp(`\\b(${Fa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), au = (e, t) => `<a class="row-pill" href="#" data-peek="${at(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, ou = (e) => e.replace(su, (t, n, s) => s.replace(/\d+/g, (a) => au(n.replace(/s$/i, ""), a))), ru = (e) => ou(e).replace(
  nu,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${at(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
ct(
  (e, t) => t.rowNames === !1 ? e : e.split(tu).map((n, s) => s % 2 ? n : ru(n)).join("")
);
const iu = ["innerHTML"], lu = ["innerHTML"], cu = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = O(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = ns(s, { env: Pe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(mt) && z(mt)(...o)),
      innerHTML: n.value
    }, null, 8, iu)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(mt) && z(mt)(...o)),
      innerHTML: n.value
    }, null, 8, lu));
  }
}, st = /* @__PURE__ */ Z(cu, [["__scopeId", "data-v-1a43d211"]]), uu = { class: "fact" }, du = { class: "fact-label" }, hu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", uu, [
      p("span", du, k(e.label), 1),
      H(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, fu = /* @__PURE__ */ Z(hu, [["__scopeId", "data-v-3a88ecf8"]]), pu = { class: "list" }, mu = { class: "list-label" }, gu = {
  key: 1,
  class: "list-note"
}, vu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", pu, [
      (l(!0), d(X, null, re(e.items, (o, r) => (l(), G(lt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Q(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          p("span", mu, k(o.label), 1),
          o.badge ? (l(), G(Ca, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : P("", !0),
          o.note ? (l(), d("span", gu, k(o.note), 1)) : P("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, yu = /* @__PURE__ */ Z(vu, [["__scopeId", "data-v-ebe2ae0a"]]), wu = { class: "table" }, ku = {
  key: 0,
  class: "table-row empty"
}, bu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", wu, [
      p("div", {
        class: "table-row head",
        style: be(a.value)
      }, [
        (l(!0), d(X, null, re(e.columns, (i) => (l(), d("span", {
          key: i,
          class: "cell"
        }, k(i), 1))), 128))
      ], 4),
      (l(!0), d(X, null, re(e.rows, (i, c) => (l(), G(lt(i.open ? "button" : "div"), {
        key: c,
        type: i.open ? "button" : void 0,
        class: Q(["table-row", i.tone, { opens: i.open }]),
        style: be(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: V(() => [
          (l(!0), d(X, null, re(i.cells, (u, f) => (l(), d("span", {
            key: f,
            class: "cell"
          }, k(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), d("div", ku, k(e.empty), 1)) : P("", !0)
    ]));
  }
}, $u = /* @__PURE__ */ Z(bu, [["__scopeId", "data-v-9326a52e"]]), xu = { class: "stat-value" }, Mu = { class: "stat-label" }, _u = {
  key: 0,
  class: "stat-note"
}, Su = {
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
    return (s, a) => (l(), G(lt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Q(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        p("span", xu, k(e.value), 1),
        p("span", Mu, k(e.label), 1),
        e.note ? (l(), d("span", _u, k(e.note), 1)) : P("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Eu = /* @__PURE__ */ Z(Su, [["__scopeId", "data-v-ad0db6d6"]]), Au = { class: "code" }, Cu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (l(), G(gs, {
      value: e.node.type
    }, {
      stack: V(() => [
        H(Jt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: V(() => [
        H(Jt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: V(() => [
        H(Jt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: V(() => [
        H(wi, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: V(() => [
        p("h3", {
          class: Q(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: V(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: V(() => [
        H(Eu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: V(() => [
        H(fi, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: V(() => [
        H($u, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: V(() => [
        H(yu, {
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
        H(fu, {
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
        p("pre", Au, [
          p("code", null, k(e.node.text), 1)
        ])
      ]),
      file: V(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, k(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ao = /* @__PURE__ */ Z(Cu, [["__scopeId", "data-v-cbdcf540"]]), Ou = { class: "dashboard" }, Tu = { class: "trail" }, Bu = ["onClick"], Iu = {
  key: 0,
  class: "gone",
  role: "status"
}, Ru = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (w) => w in (n.document.pages || {}), o = q(!!n.page && !a(n.page)), r = q(n.page && !o.value ? [n.page] : []), i = O(() => r.value.at(-1) || n.document.start), c = O(() => (n.document.pages || {})[i.value] || null), u = (w) => ((n.document.pages || {})[w] || {}).title || w, f = (w) => {
      o.value = !1, r.value = [...r.value, w];
    }, m = (w) => {
      o.value = !1, r.value = r.value.slice(0, w);
    };
    return ke(
      () => n.document.start,
      () => r.value = []
    ), (w, $) => (l(), d("div", Ou, [
      e.document.broken ? (l(), G(tn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          he(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), G(tn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: V(() => [
          he(k(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(X, { key: 2 }, [
        p("nav", Tu, [
          p("button", {
            type: "button",
            class: Q(["step", { current: !r.value.length }]),
            onClick: $[0] || ($[0] = (D) => m(0))
          }, k(u(e.document.start)), 3),
          (l(!0), d(X, null, re(r.value, (D, _) => (l(), d(X, {
            key: `${_}-${D}`
          }, [
            $[2] || ($[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: Q(["step", { current: _ === r.value.length - 1 }]),
              onClick: (y) => m(_ + 1)
            }, k(u(D)), 11, Bu)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Iu, "What you opened is no longer in this dashboard. Here is its start page.")) : P("", !0),
        H(It, {
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
                onFile: $[1] || ($[1] = (D) => s("file", D))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : P("", !0)
    ]));
  }
}, Iv = /* @__PURE__ */ Z(Ru, [["__scopeId", "data-v-fbe83734"]]);
function Lu(e, t, n, s = () => window) {
  Le(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Du = (e, t = () => !0) => Lu("keydown", (n) => n.key === "Escape" && t() && e());
function Nu(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = q(!1), a = O(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Du(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const ju = 80, ht = ms([]);
function Pu(e) {
  const t = Symbol("layer"), n = () => ht.includes(t) && ht.splice(ht.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !ht.includes(t) && ht.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), O(() => ju + Math.max(0, ht.indexOf(t)));
}
let oo = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return oo = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const qu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Wu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(qu)];
    if (!r.length) return o.preventDefault();
    const [i, c] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Le(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : oo, document.addEventListener("keydown", a), Rt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Fu = ["aria-modal", "aria-label", "aria-labelledby"], Hu = {
  key: 0,
  class: "dialog-head"
}, Uu = ["id", "tabindex"], Vu = {
  key: 1,
  class: "dialog-foot"
}, zu = 500, Gu = 400, Ku = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Nu(s, n), i = Pu(a), c = q(null), u = q(null), f = q(null), m = ya(), w = q(!1), $ = Date.now();
    n.modal && Wu(u, () => s("escape"), f);
    function D() {
      if (!n.modal) return n.closable && o();
      w.value = !0, setTimeout(() => w.value = !1, Gu);
    }
    function _(R) {
      !n.modal || Date.now() - $ >= zu || ![" ", "Enter"].includes(R.key) || (R.preventDefault(), R.stopPropagation());
    }
    const y = () => c.value && (c.value.scrollTop = c.value.scrollHeight), C = new MutationObserver(y);
    return ke(c, (R) => {
      C.disconnect(), R && n.follow && (C.observe(R, { childList: !0, subtree: !0, characterData: !0 }), y());
    }), Ae(() => C.disconnect()), (R, te) => (l(), G(wa, { to: "body" }, [
      H(It, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: V(() => [
          z(a) ? (l(), d("div", {
            key: 0,
            class: Q(["dialog", { large: e.large, sheet: e.sheet }]),
            style: be({ zIndex: z(i) }),
            onClick: _e(D, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: Q(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: w.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(m) : void 0,
              onKeydownCapture: _
            }, [
              e.bare ? P("", !0) : (l(), d("header", Hu, [
                p("h3", {
                  id: z(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, Uu),
                e.closable ? (l(), G(ys, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : P("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: Q(["dialog-body", { bare: e.bare }])
              }, [
                we(R.$slots, "default", {}, void 0, !0)
              ], 2),
              R.$slots.foot ? (l(), d("footer", Vu, [
                we(R.$slots, "foot", {}, void 0, !0)
              ])) : P("", !0)
            ], 42, Fu)
          ], 6)) : P("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Yu = /* @__PURE__ */ Z(Ku, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ie = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Ju = 6;
function _s(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Zu = (e) => {
  const t = _s(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
  return { name: e, lines: t, line: ze.line, padY: ze.padY, width: n, height: t.length * ze.line + ze.padY * 2 };
};
function Xu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, c) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(c) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function Qu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function ed(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, c) => [i, c]))), o = (r, i) => {
    const c = a(), u = (f) => {
      const m = i(f).map((w) => c.get(w));
      return m.length ? m.reduce((w, $) => w + $, 0) / m.length : c.get(f);
    };
    return [...r].sort((f, m) => u(f) - u(m));
  };
  for (let r = 0; r < Ju; r++) {
    const i = r % 2 === 0, c = s.map((u, f) => f);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const f = (m) => t.filter((w) => w[i ? 1 : 0] === m).map((w) => w[i ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
function td(e, t) {
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
function nd(e) {
  const t = [...new Set(e.flatMap(([b, v]) => [b, v]))], n = new Set(e.map(([, b]) => b)), s = t.filter((b) => !n.has(b)), a = Xu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((b, v) => !a.has(v)), r = Qu(t, o), i = ed(t, o, r), c = new Map(t.map((b) => [b, Zu(b)])), u = i.map((b) => b.reduce((v, N) => v + c.get(N).width, 0) + Be.across * (b.length - 1)), f = Math.max(...u) + Be.margin * 2, m = ad(e, r, i.length), w = /* @__PURE__ */ new Map();
  let $ = Be.margin;
  i.forEach((b, v) => {
    let N = (f - u[v]) / 2;
    const T = Math.max(...b.map((W) => c.get(W).height));
    b.forEach((W) => {
      const x = c.get(W);
      w.set(W, { ...x, x: N, y: $ + (T - x.height) / 2 }), N += x.width + Be.across;
    }), $ += T + (m[v] ?? Be.down);
  });
  const D = e.map(([b, v, N], T) => ({ from: b, to: v, label: N || "", back: a.has(T) || r.get(v) <= r.get(b) }));
  td(D, w);
  const _ = D.map((b) => od(b, w.get(b.from), w.get(b.to))), y = [...w.values()], C = cd(_, y), R = Math.max($ - Be.down, ...C.filter((b) => b.label).map((b) => b.label.y + b.label.height));
  return { width: Math.max(f - Be.margin, ...C.filter((b) => b.label).map((b) => b.label.x + b.label.width)) + Be.margin, height: R + Be.margin, nodes: y, arrows: C };
}
const sd = (e) => e ? _s(e, Ie.lineChars).length * Ie.line + Ie.pad * 2 : 0;
function ad(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += sd(r) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function od(e, t, n) {
  const s = e.label ? _s(e.label, Ie.lineChars) : [], a = s.length ? Math.max(...s.map((w) => w.length)) * Ie.charWidth + Ie.pad * 2 : 0, o = s.length * Ie.line + (s.length ? Ie.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - i) / 2, m = [{ x: r, y: i }, { x: r, y: i + f }, { x: c, y: u - f }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: m, path: `M${r} ${i} C${r} ${i + f} ${c} ${u - f} ${c} ${u}` };
}
const rd = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, id = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], ld = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ie.line);
function cd(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, u) => {
      const f = rd(s.curve, c);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = ld.flatMap((c) => id.map((u) => a(u, c))).find((c) => !n.some((u) => Qs(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => Qs(i, c)); ) i.y += Ie.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Ie.line, pad: Ie.pad } };
  });
}
const Qs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, ud = { class: "flowchart-tools" }, dd = ["width", "height", "viewBox", "aria-label"], hd = ["d"], fd = ["x", "y", "width", "height"], pd = ["x", "y"], md = ["x", "dy"], gd = {
  key: 0,
  class: "flowchart-label"
}, vd = ["x", "y", "width", "height"], yd = ["x", "y"], wd = ["x", "dy"], kd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => nd(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = q(null), i = q({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var C;
      const _ = (C = r.value) == null ? void 0 : C.getBoundingClientRect();
      if (!(_ != null && _.width)) return;
      const y = Math.min(_.width / a.value.width, _.height / a.value.height, 1.5);
      i.value = { zoom: y, x: (_.width - a.value.width * y) / 2, y: (_.height - a.value.height * y) / 2 };
    }
    function f(_, y, C) {
      const { zoom: R, x: te, y: b } = i.value, v = Math.min(o.most, Math.max(o.least, R * _));
      i.value = { zoom: v, x: y - (y - te) * v / R, y: C - (C - b) * v / R };
    }
    function m(_) {
      const y = r.value.getBoundingClientRect();
      f(_, y.width / 2, y.height / 2);
    }
    function w(_) {
      const y = r.value.getBoundingClientRect();
      _.ctrlKey || _.metaKey ? f(_.deltaY < 0 ? o.step : 1 / o.step, _.clientX - y.left, _.clientY - y.top) : i.value = { ...i.value, x: i.value.x - _.deltaX, y: i.value.y - _.deltaY };
    }
    function $(_) {
      var y, C, R;
      _.preventDefault(), (y = window.getSelection()) == null || y.removeAllRanges(), c = { x: _.clientX - i.value.x, y: _.clientY - i.value.y }, (R = (C = r.value).setPointerCapture) == null || R.call(C, _.pointerId);
    }
    function D(_) {
      c && (i.value = { ...i.value, x: _.clientX - c.x, y: _.clientY - c.y });
    }
    return Le(u), (_, y) => (l(), G(Yu, {
      title: e.title,
      large: "",
      onClose: y[4] || (y[4] = (C) => s("close"))
    }, {
      default: V(() => [
        p("div", ud, [
          H(ye, {
            small: "",
            onClick: y[0] || (y[0] = (C) => m(o.step))
          }, {
            default: V(() => [...y[5] || (y[5] = [
              he("Zoom in", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            small: "",
            onClick: y[1] || (y[1] = (C) => m(1 / o.step))
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
          onWheel: _e(w, ["prevent"]),
          onPointerdown: $,
          onPointermove: D,
          onPointerup: y[2] || (y[2] = (C) => Bs(c) ? c.value = null : c = null),
          onPointercancel: y[3] || (y[3] = (C) => Bs(c) ? c.value = null : c = null)
        }, [
          (l(), d("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: be({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (l(!0), d(X, null, re(a.value.arrows, (C, R) => (l(), d("path", {
              key: `arrow-${R}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, hd))), 128)),
            (l(!0), d(X, null, re(a.value.nodes, (C) => (l(), d("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, fd),
              p("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (l(!0), d(X, null, re(C.lines, (R, te) => (l(), d("tspan", {
                  key: te,
                  x: C.x + C.width / 2,
                  dy: te ? C.line : 0
                }, k(R), 9, md))), 128))
              ], 8, pd)
            ]))), 128)),
            (l(!0), d(X, null, re(a.value.arrows, (C, R) => (l(), d(X, {
              key: `label-${R}`
            }, [
              C.label ? (l(), d("g", gd, [
                p("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, vd),
                p("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (l(!0), d(X, null, re(C.label.lines, (te, b) => (l(), d("tspan", {
                    key: b,
                    x: C.label.x + C.label.width / 2,
                    dy: b ? C.label.line : 0
                  }, k(te), 9, wd))), 128))
                ], 8, yd)
              ])) : P("", !0)
            ], 64))), 128))
          ], 12, dd))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, bd = /* @__PURE__ */ Z(kd, [["__scopeId", "data-v-51d24cfe"]]), ea = {
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
}, $d = ["innerHTML"], xd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => ea[t.name] || ea.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, $d));
  }
}, Ve = /* @__PURE__ */ Z(xd, [["__scopeId", "data-v-beb5935c"]]), Md = {
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
}, Tt = /* @__PURE__ */ Z(Md, [["__scopeId", "data-v-d03899bb"]]), _d = ["data-tip", "aria-label"], Sd = {
  key: 0,
  class: "mact-word"
}, Ed = {
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
      e.open ? (l(), d("span", Sd, k(e.label), 1)) : P("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, _d));
  }
}, ro = /* @__PURE__ */ Z(Ed, [["__scopeId", "data-v-3b292e09"]]), Ad = 120, An = 280, Cd = 160, Od = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function io(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = q(t()), a = q("");
  let o = 0;
  const r = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const f = e.value, m = ++o;
    if (!f || !f.offsetWidth || Od()) {
      s.value = u;
      return;
    }
    const w = { width: f.offsetWidth, height: f.offsetHeight };
    if (r(f, w), a.value = "leaving", await n(Ad), m !== o) return;
    s.value = u, a.value = "resizing", await Rt(), i(f);
    const $ = { width: f.offsetWidth, height: f.offsetHeight };
    r(f, w), f.offsetWidth, f.style.transition = `width ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, $), await n(An), m === o && (i(f), a.value = "entering", await n(Cd), m === o && (a.value = ""));
  }
  return ke(t, (u) => c(u)), yt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Td = { class: "growing-card-top" }, Bd = ["aria-expanded"], Id = { class: "growing-card-avatar" }, Rd = { class: "growing-card-title" }, Ld = { class: "growing-card-more" }, Dd = { class: "growing-card-body" }, Nd = {
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
    const n = e, s = t, a = q(!1), o = q(null), { folded: r, phase: i } = io(o, () => !a.value), c = O(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = O(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (l(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Q(["growing-card-wrap", z(i), { open: !z(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Td, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: m[0] || (m[0] = (w) => a.value = !a.value)
        }, [
          p("span", Id, [
            e.bad ? (l(), G(Ve, {
              key: 0,
              name: "cross"
            })) : c.value ? (l(), d(X, { key: 1 }, [
              he(k(c.value), 1)
            ], 64)) : (l(), G(xe, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Rd, k(e.title), 1),
          H(Tt, { open: a.value }, null, 8, ["open"])
        ], 8, Bd),
        e.action ? (l(), G(ro, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: m[1] || (m[1] = (w) => s("act"))
        }, null, 8, ["label", "open"])) : P("", !0)
      ]),
      p("div", Ld, [
        p("div", Dd, [
          (l(!0), d(X, null, re(u.value, (w, $) => (l(), d("p", {
            key: $,
            class: "growing-card-text"
          }, k(w), 1))), 128))
        ])
      ])
    ], 2));
  }
}, jd = /* @__PURE__ */ Z(Nd, [["__scopeId", "data-v-c09abbcf"]]), Pd = ["title", "aria-label"], qd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Wd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Fd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = O(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), d("span", {
      class: Q(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), d("svg", qd, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", Wd)) : P("", !0)
      ]))
    ], 10, Pd));
  }
}, Hd = /* @__PURE__ */ Z(Fd, [["__scopeId", "data-v-6dc92808"]]), Ud = "img,pre,table";
function Vd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function zd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Gd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Ud)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Vd(zd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Kd(e, t) {
  let n = null;
  const s = () => e.value && Gd(e.value);
  Le(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const Yd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Jd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Zd = ["data-ref"], Xd = ["data-from", "data-ref"], Qd = { class: "message-body" }, eh = ["title"], th = ["innerHTML"], nh = ["innerHTML"], sh = {
  class: "message-faces",
  "data-message-faces": ""
}, ah = ["title", "data-face", "onClick"], oh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, rh = ["title", "data-reaction", "onClick"], ih = {
  key: 0,
  class: "message-reaction-count"
}, lh = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, ch = ["href", "title"], uh = ["src", "alt"], dh = ["href"], hh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, fh = {
  key: 1,
  "data-message-links-rows": ""
}, ph = { class: "message-foot" }, mh = { class: "message-time" }, gh = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, vh = 1500, yh = "An earlier message", wh = "about", kh = 3, bh = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    var B;
    const n = e, s = t, a = q(!1), o = q(null), r = O(() => ["user", "comment"].includes(n.message.type)), i = O(() => {
      const [S, Y] = (n.message.commented_row || ":").split(":"), U = at(S);
      return U ? { ref: `${U}:${Y}`, label: `${Dt(U).title.toLowerCase()} ${Y}` } : null;
    }), c = O(() => r.value && !n.message.read_at && !n.message.local);
    async function u() {
      var S;
      await ((S = navigator.clipboard) == null ? void 0 : S.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, vh);
    }
    const f = O(() => ns(n.message.text ?? "", { env: "" })), m = O(() => JSON.parse(n.message.flowchart_edges || "[]")), w = q(!1), $ = O(() => ns(n.quote || yh, { env: "" }));
    function D() {
      const S = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      S ? S.scrollIntoView({ block: "center", behavior: "smooth" }) : it(`messages:${n.message.parent_id}`);
    }
    Kd(o, () => `${n.message.text} ${n.quote}`);
    const _ = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, y = (S) => `/api/files/message/${n.message.id}/${encodeURIComponent(S)}`, C = O(() => JSON.parse(n.message.captions || "{}")), R = O(() => (n.message.files ?? []).map((S) => ({ name: S, address: y(S), isImage: _.test(S), title: C.value[S] || S }))), te = O(() => Da(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), b = Ne(je, null), v = q([]), N = q(!1), T = O(() => `Linked: ${v.value.join(", ")}`), W = O(() => v.value.length >= kh), x = O(() => `${v.value.length} linked ${v.value.every((S) => S.startsWith("task ")) ? "tasks" : "rows"}`);
    async function E() {
      if (!r.value || !(b != null && b.read) || n.message.local) return;
      const S = await b.read(`link list --source message:${n.message.id}`);
      S.ok && (v.value = (S.value.rows ?? S.value ?? []).filter((Y) => Y.link_type === wh).map((Y) => `${Y.target_model} ${Y.target_id}`));
    }
    E(), (B = b == null ? void 0 : b.follow) == null || B.call(b, ["link.*"], E);
    const g = q(!1), h = O(() => Jd(n.message.reactions));
    function A(S) {
      g.value = !1, s("react", n.message, S);
    }
    return (S, Y) => e.message.peer || e.message.recipient ? (l(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      H(jd, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Zd)) : (l(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", Qd, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: Q(["message-card", "md", { comment: i.value }]),
          onClick: Y[3] || (Y[3] = (...U) => z(mt) && z(mt)(...U))
        }, [
          i.value ? (l(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: Y[0] || (Y[0] = _e((U) => z(it)(i.value.ref), ["stop"]))
          }, [
            H(xe, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + k(i.value.label), 1)
          ], 8, eh)) : P("", !0),
          e.message.parent_id ? (l(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: _e(D, ["stop"]),
            innerHTML: $.value
          }, null, 8, th)) : P("", !0),
          p("div", { innerHTML: f.value }, null, 8, nh),
          m.value.length ? (l(), d(X, { key: 2 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: Y[1] || (Y[1] = (U) => w.value = !0)
            }, "Open the flowchart"),
            w.value ? (l(), G(bd, {
              key: 0,
              title: e.message.text,
              edges: m.value,
              onClose: Y[2] || (Y[2] = (U) => w.value = !1)
            }, null, 8, ["title", "edges"])) : P("", !0)
          ], 64)) : P("", !0)
        ], 2),
        p("div", {
          class: Q(["message-tools", { picking: g.value }]),
          "data-message-tools": ""
        }, [
          g.value ? (l(), d(X, { key: 0 }, [
            p("div", sh, [
              (l(!0), d(X, null, re(z(Yd), (U) => (l(), d("button", {
                key: U,
                type: "button",
                class: "message-face",
                title: `React ${U}`,
                "data-face": U,
                onClick: (ue) => A(U)
              }, k(U), 9, ah))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: Y[4] || (Y[4] = (U) => g.value = !1)
            }, [
              H(xe, {
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
            }, k(a.value ? "Copied" : "Copy"), 1),
            c.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: Y[7] || (Y[7] = (U) => s("delete", e.message))
            }, "Delete")) : P("", !0)
          ], 64))
        ], 2)
      ]),
      h.value.length ? (l(), d("div", oh, [
        (l(!0), d(X, null, re(h.value, (U) => (l(), d("button", {
          key: U.emoji,
          type: "button",
          class: Q(["message-reaction", { mine: U.mine }]),
          title: U.title,
          "data-reaction": U.emoji,
          onClick: (ue) => s("react", e.message, U.emoji)
        }, [
          he(k(U.emoji) + " ", 1),
          U.count > 1 ? (l(), d("span", ih, k(U.count), 1)) : P("", !0)
        ], 10, rh))), 128))
      ])) : P("", !0),
      R.value.length ? (l(), d("div", lh, [
        (l(!0), d(X, null, re(R.value, (U) => (l(), d(X, {
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
            }, null, 8, uh)
          ], 8, ch)) : (l(), d("a", {
            key: 1,
            href: U.address,
            target: "_blank",
            class: "message-file"
          }, k(U.name), 9, dh))
        ], 64))), 128))
      ])) : P("", !0),
      v.value.length ? (l(), d("div", hh, [
        H(Ve, {
          class: "message-links-icon",
          name: "linked"
        }),
        W.value && !N.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: Y[8] || (Y[8] = (U) => N.value = !0)
        }, k(x.value), 1)) : (l(), d("span", fh, [
          H(st, {
            text: T.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : P("", !0),
      p("div", ph, [
        p("time", mh, k(te.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", gh, "#" + k(e.message.id), 1)) : P("", !0),
        r.value ? (l(), G(Hd, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : P("", !0)
      ])
    ], 8, Xd));
  }
}, Rv = /* @__PURE__ */ Z(bh, [["__scopeId", "data-v-5a08c284"]]), ln = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Cn = 200, lo = (e) => {
  var t;
  return ((t = ln.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ln[0].key;
}, Lv = (e) => {
  var t;
  return ((t = ln.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, $h = ["aria-label"], xh = 300, ta = 400, Mh = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Cn } },
  setup(e) {
    const t = e, n = O(() => lo(t.value)), s = O(() => n.value < Cn ? [1, 0.25, 0.25] : n.value === Cn ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: Q(["ico", "prio", { hot: n.value >= ta, high: n.value >= xh && n.value < ta }]),
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
        style: be({ opacity: s.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: be({ opacity: s.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: be({ opacity: s.value[2] })
      }, null, 4)
    ], 10, $h));
  }
}, Dv = /* @__PURE__ */ Z(Mh, [["__scopeId", "data-v-b10e610f"]]), _h = ["aria-checked", "aria-haspopup", "onClick"], Sh = {
  key: 0,
  class: "segmented-dot"
}, Eh = {
  key: 1,
  class: "segmented-count"
}, Ah = {
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
        (l(!0), d(X, null, re(e.options, (i) => rt((l(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Q(["segmented-option", { on: i.key === e.value }]),
          onClick: (c) => n("pick", i.key)
        }, [
          i.dot ? (l(), d("span", Sh)) : P("", !0),
          he(" " + k(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", Eh, k(i.count), 1)) : P("", !0)
        ], 10, _h)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, as = /* @__PURE__ */ Z(Ah, [["__scopeId", "data-v-ca953072"]]), na = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Ch = {
  key: 1,
  class: "text-field-label"
}, Oh = {
  key: 2,
  class: "text-field-end"
}, Th = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ zn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Vn(e, "modelValue"), s = ka(), a = "onUpdate:modelValue" in (((f = Yo()) == null ? void 0 : f.vnode.props) || {}), o = O(() => a ? n.value : s.value), r = (m) => a && (n.value = m.target.value), i = O(
      () => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), c = O(() => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "value"))), u = q(null);
    return t({ focus: () => u.value && u.value.focus() }), (m, w) => e.label || e.icon || m.$slots.end ? (l(), d("label", {
      key: 0,
      class: Q(["text-field", { large: e.large, ended: m.$slots.end }, z(s).class]),
      style: be(z(s).style)
    }, [
      e.icon ? (l(), G(xe, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : P("", !0),
      e.label ? (l(), d("span", Ch, k(e.label), 1)) : P("", !0),
      rt(p("input", ot({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(na), o.value]
      ]),
      m.$slots.end ? (l(), d("span", Oh, [
        we(m.$slots, "end", {}, void 0, !0)
      ])) : P("", !0)
    ], 6)) : rt((l(), d("input", ot({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
      [z(na), o.value]
    ]);
  }
}), Bh = /* @__PURE__ */ Z(Th, [["__scopeId", "data-v-d9c38ca8"]]);
function Ih(e, t, { incremental: n = !1 } = {}) {
  const s = vs(), a = q([]), o = q(""), r = q(!1), i = q(""), c = q(null);
  async function u(_) {
    const y = await s.read(`${e} --before-id ${_ + 1} --limit 1`);
    if (!y.ok) return $();
    const C = y.value.rows.find((R) => R.id === _);
    a.value = C ? a.value.map((R) => R.id === _ ? C : R) : a.value.filter((R) => R.id !== _);
  }
  async function f(_) {
    if (n && String((_ == null ? void 0 : _.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((b) => b.id !== _.row_id));
    if (n && (_ != null && _.row_id) && !String(_.event ?? "").endsWith(".create") && a.value.some((b) => b.id === _.row_id)) return u(_.row_id);
    if (!(n && a.value.length && String((_ == null ? void 0 : _.event) ?? "").endsWith(".create"))) return $();
    const C = Math.max(...a.value.map((b) => b.id)), R = await s.read(`${e} --after-id ${C}`);
    if (!R.ok) return $();
    const te = new Set(a.value.map((b) => b.id));
    a.value = [...R.value.rows.filter((b) => !te.has(b.id)), ...a.value];
  }
  async function m() {
    if (!a.value.length) return !1;
    const _ = Math.min(...a.value.map((R) => R.id)), y = await s.read(`${e} --before-id ${_}`);
    if (!y.ok || !y.value.rows.length) return !1;
    const C = new Set(a.value.map((R) => R.id));
    return a.value = [...a.value, ...y.value.rows.filter((R) => !C.has(R.id))], !0;
  }
  let w = 0;
  async function $() {
    const _ = ++w, y = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (_ !== w) return;
    const C = y.ok ? s.shared ? [y.value] : y.value.rows : [], R = C.length ? Math.min(...C.map((te) => te.id)) : 0;
    a.value = n && y.ok && R ? [...a.value.filter((te) => te.id > Math.max(...C.map((b) => b.id))), ...C, ...a.value.filter((te) => te.id < R)] : C, o.value = y.ok ? "" : y.error, r.value = !0;
  }
  async function D(_) {
    const y = await s.run(_);
    return i.value = y.ok ? "" : y.error, c.value = y.ok ? y.value : null, await $(), y;
  }
  return s.follow(t, f), $(), { rows: a, failure: o, loaded: r, load: $, older: m, act: D, actionFailure: i, answer: c, context: s };
}
const Rh = { class: "title" }, Lh = { class: "state" }, Dh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Ih(t.line, t.events);
    return (o, r) => (l(), G(zr, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: V(({ row: i }) => [
        p("span", Rh, k(i.title), 1),
        p("span", Lh, k(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Nv = /* @__PURE__ */ Z(Dh, [["__scopeId", "data-v-a69084cd"]]), On = q(Date.now() / 1e3);
let sa = 0, zt = 0;
function Nh() {
  return zt || (On.value = Date.now() / 1e3, sa = setInterval(() => On.value = Date.now() / 1e3, 1e3)), zt += 1, ba() && $a(() => {
    zt -= 1, zt || clearInterval(sa);
  }), On;
}
const jh = ["title", "data-figure-mark", "data-folded", "data-open"], Ph = {
  key: 2,
  class: "worker"
}, qh = { class: "head" }, Wh = { key: 0 }, Fh = {
  key: 3,
  class: "status"
}, Hh = {
  key: 0,
  class: "figure"
}, Uh = {
  key: 1,
  class: "ran-for"
}, Vh = { key: 2 }, zh = {
  key: 3,
  class: "news"
}, Gh = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Kh = {
  key: 6,
  class: "settled"
}, Yh = {
  key: 1,
  class: "bar"
}, Jh = {
  key: 3,
  class: "detail body"
}, Zh = {
  key: 0,
  class: "body-label"
}, Xh = ["title"], Qh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ka(), s = ["onClick", "onAct"], a = O(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = q(!1), r = O(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = O(() => t.open !== void 0), c = O(() => i.value || r.value), u = O(() => i.value ? t.open : o.value), f = O(() => i.value ? !t.open : r.value && !o.value), m = O(() => !!(t.mark.action && n.onAct)), w = O(() => c.value || m.value || !!n.onClick), $ = q(null), D = q(null), { folded: _, phase: y } = io($, () => f.value);
    function C(le) {
      var me, Se;
      if (!(le.target !== $.value && !D.value.contains(le.target))) {
        if (i.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(le);
      }
    }
    const R = (le) => n.onAct(le), te = ["failed", "unfinished"], b = O(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? te.includes(t.mark.state) ? "danger" : "good" : ""), v = O(() => t.mark.color ? t.mark.color : b.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : b.value ? `var(--tone-${b.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), N = O(() => v.value || "var(--tone-work)"), T = O(() => !t.mark.ending && !t.mark.ended && b.value !== "stopped"), W = Nh(), x = O(
      () => t.mark.began_at && T.value && !t.mark.figure && !t.mark.counting ? tl(W.value - t.mark.began_at) : ""
    ), E = O(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${Fs(me - le, !0)}` : Fs(W.value - le, !0) : x.value;
    }), g = ["bad", "danger", "warn"], h = O(() => g.includes(b.value) || t.mark.asks ? "attention" : T.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), A = ["bad", "danger"], B = O(() => A.includes(b.value)), S = O(() => h.value === "process" ? "running" : B.value ? "cross" : b.value === "stopped" ? "stopped" : b.value === "good" ? "tick" : ""), Y = O(
      () => !!(t.mark.figure || E.value || t.mark.docked || t.mark.stopping || S.value || t.mark.settled || t.mark.news)
    ), U = O(() => [t.mark.title, t.mark.time ? Da(t.mark.time) : ""].filter(Boolean).join(" · ")), ue = O(() => ({
      ...v.value ? { "--mark": v.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (l(), d("div", ot(a.value, {
      ref_key: "root",
      ref: $,
      class: [
        "mark",
        `w-${h.value}`,
        z(y),
        {
          open: u.value,
          live: w.value,
          failed: B.value,
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
      "data-folded": z(_) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: C
    }), [
      (l(), G(lt(w.value ? "button" : "span"), {
        ref_key: "top",
        ref: D,
        class: "top",
        type: w.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!u.value) : void 0
      }, {
        default: V(() => [
          e.mark.markIcon ? (l(), G(Ve, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), G(xe, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), d("span", Ph, k(e.mark.worker), 1)) : P("", !0),
          p("span", qh, [
            H(st, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", Wh, k(e.mark.name), 1)) : P("", !0),
            c.value ? (l(), G(Tt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : P("", !0)
          ]),
          Y.value ? (l(), d("span", Fh, [
            e.mark.figure ? (l(), d("span", Hh, k(e.mark.figure), 1)) : P("", !0),
            E.value ? (l(), d("span", Uh, k(E.value), 1)) : P("", !0),
            e.mark.stopping ? (l(), d("span", Vh, "Stopping")) : P("", !0),
            e.mark.news ? (l(), d("span", zh, k(e.mark.news), 1)) : P("", !0),
            S.value === "running" ? (l(), d("span", Gh)) : S.value ? (l(), G(Ve, {
              key: 5,
              class: Q(["sign", S.value]),
              name: S.value
            }, null, 8, ["class", "name"])) : P("", !0),
            e.mark.settled ? (l(), d("span", Kh, k(e.mark.settled), 1)) : P("", !0)
          ])) : P("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (l(), G(ro, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: _e(R, ["stop"])
      }, null, 8, ["label", "open"])) : P("", !0),
      (e.mark.figure || e.mark.counting) && T.value ? (l(), d("span", Yh, [
        p("span", {
          class: "progress",
          style: be({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: N.value })
        }, null, 4)
      ])) : P("", !0),
      e.mark.detail && !z(_) ? (l(), G(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      e.mark.body && !z(_) ? (l(), d("div", Jh, [
        e.mark.bodyLabel ? (l(), d("p", Zh, k(e.mark.bodyLabel), 1)) : P("", !0),
        H(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : P("", !0),
      e.mark.command && !z(_) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, Xh)) : P("", !0),
      e.mark.card ? (l(), G(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      we(le.$slots, "default", {
        shown: !z(_)
      }, void 0, !0)
    ], 16, jh));
  }
}), co = /* @__PURE__ */ Z(Qh, [["__scopeId", "data-v-1bcf640e"]]), ef = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function uo(e) {
  var n;
  const t = ef[e] || ((n = Dt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const tf = (e) => uo(String(e).split(":")[0]), ho = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), nf = { passed: "good", failed: "danger", warned: "warn", running: "" }, sf = { good: "good", warn: "warn", danger: "danger" }, aa = {
  "open row": (e) => it(`${e.target_model}:${e.target_id}`),
  "open page": (e) => jr(e.target_model, e.target_id || 0)
}, af = { "open row": (e) => tf(e.target_model), "open page": () => uo("pages") };
function of(e, t) {
  const n = t || {}, s = aa[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? nf[e.outcome] || "" : sf[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? af[s](e) : "",
    handlers: s ? { onAct: () => aa[s](e) } : {}
  };
}
const rf = 24, lf = 1e3, oa = 2e3, cf = 0.25, uf = 5e3;
function df(e, t = rf, n = () => !0) {
  const s = q(!1), a = q(0), o = q(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const b = u();
    return b ? b.scrollHeight - b.scrollTop - b.clientHeight : 0;
  }, m = () => !u() || f() <= t;
  function w(b) {
    if (clearTimeout(r), !b) {
      o.value = !1, c = Date.now();
      return;
    }
    const v = Date.now() - c < oa ? oa : lf;
    r = setTimeout(() => o.value = s.value, v);
  }
  function $() {
    clearTimeout(i), s.value = !1, a.value = 0, w(!1);
  }
  function D(b = !1) {
    const v = u();
    v && b && v.scrollTo ? v.scrollTo({ top: v.scrollHeight, behavior: "smooth" }) : v && (v.scrollTop = v.scrollHeight), $();
  }
  function _() {
    C(), !s.value && (s.value = !0, w(!0));
  }
  const y = () => !!u() && f() <= u().clientHeight * cf;
  function C() {
    clearTimeout(i), y() && (i = setTimeout(() => s.value && y() && n() && D(!0), uf));
  }
  function R() {
    m() ? $() : _();
  }
  function te(b = 1, v = !1) {
    s.value ? a.value += Math.max(0, b) : D(v);
  }
  return ba() && $a(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: m, follow: $, toBottom: D, left: _, scrolled: R, arrived: te };
}
const hf = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = q(null), { away: o, scrolled: r, arrived: i, toBottom: c } = df(a);
    ke(
      () => n.lines.length,
      () => Rt(() => i()),
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
      he(k(e.lines.join(`
`) || e.empty), 1),
      z(o) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (w) => z(c)(!0))
      }, "Follow")) : P("", !0)
    ], 544));
  }
}, ff = /* @__PURE__ */ Z(hf, [["__scopeId", "data-v-09394a20"]]), pf = 1e4;
class mf {
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
    return this.heardAt !== null && t - this.heardAt > pf;
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
const gf = {
  key: 0,
  class: "frame-note"
}, vf = {
  key: 0,
  class: "frame-note"
}, yf = ["src", "title"], wf = 1e3, kf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = vs(), s = q(null), a = q(!1), o = q(!1);
    let r = null, i = 0;
    return Le(() => {
      r = new mf(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, wf);
    }), Ae(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", gf, "This window was closed because it stopped answering.")) : (l(), d(X, { key: 1 }, [
      a.value ? (l(), d("div", vf, [
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
        title: z(n).window
      }, null, 8, yf)
    ], 64));
  }
}, bf = /* @__PURE__ */ Z(kf, [["__scopeId", "data-v-32a49046"]]), $f = 0, xf = "/api/lines", Mf = "/api/line";
class _f {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), $f));
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
        const n = await De.raw(xf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await De.raw(Mf, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Sf = new _f();
class Ef {
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
const Af = { 1: "refused", 2: "usage", 3: "fault" }, Cf = 100, Of = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Tf({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = q({}), declared: u = [], autoScroll: f = "", readOnly: m = !1, shared: w = null }) {
  const $ = /* @__PURE__ */ new Map(), D = new AbortController(), _ = (y) => {
    const C = $.get(y);
    if (C && performance.now() - C.at < Cf) return C.answer;
    const R = Et(e, y, t, D.signal);
    return $.set(y, { answer: R, at: performance.now() }), R;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: O(() => s()),
    permissions: a,
    autoScroll: f,
    readOnly: m,
    shared: w,
    read: _,
    run: (y) => Et(e, y, t, D.signal),
    upload: (y) => If(y, D.signal),
    cancel: () => D.abort(),
    follow: (y, C) => r.follow(e, y.filter((R) => o.some((te) => fo(te, R))), C, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (y) => O(() => {
      var C;
      return c.value[y] ?? ((C = u.find((R) => R.key === y)) == null ? void 0 : C.default);
    }),
    setting: async (y, C) => {
      const R = await _(`window setting ${e} ${y}`);
      return R.ok ? R.value.value : C;
    },
    keep: (y, C) => Et(e, ["window", "save-setting", e, y, JSON.stringify(C)], t, D.signal)
  };
}
function Bf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const cn = { ok: !1, failure: "cancelled", error: "" };
async function Et(e, t, n, s = void 0) {
  try {
    const a = await Sf.add({ window: e, line: Array.isArray(t) ? t : Rf(t), environment: n }, s);
    return s != null && s.aborted ? cn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Af[a.code] || "fault", error: Bf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? cn : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function If(e, t = void 0) {
  try {
    const n = await De.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? cn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? cn : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function Rf(e) {
  return [...e.matchAll(Of)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Lf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Df = {
  class: "allowance-prompt",
  role: "dialog"
}, Nf = { class: "allowance-prompt-text" }, jf = { class: "allowance-prompt-buttons" }, Pf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", Df, [
      p("p", Nf, k(z(Lf)(e.request)), 1),
      p("div", jf, [
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
}, qf = /* @__PURE__ */ Z(Pf, [["__scopeId", "data-v-102dc765"]]), Tn = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), G(tn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: V(() => [
        he(k(e.reason) + " ", 1),
        e.retry ? (l(), G(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            he("Retry", -1)
          ])]),
          _: 1
        })) : P("", !0),
        e.removable ? (l(), G(ye, {
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
}, Wf = ["data-window", "data-agent"], Ff = {
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
    readOnly: Boolean,
    shared: { type: Object, default: null }
  },
  emits: ["open", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = q(""), o = q(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Ne($r, null), c = Tf({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: O(() => n.options),
      declared: n.declared,
      autoScroll: n.autoScroll,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (m, w) => {
        s("open", m, w), i == null || i(m, w);
      }
    });
    Jo(je, c), ke(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ae(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), Zo((m) => (a.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const u = () => ps(n.component), f = () => {
      var m, w;
      return ((w = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : w.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, w) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (l(), G(qf, {
        key: 0,
        request: f(),
        onAnswer: w[0] || (w[0] = ($) => e.prompts.answer($))
      }, null, 8, ["request"])) : P("", !0),
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
        onRemove: w[1] || (w[1] = ($) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Wf));
  }
}, po = /* @__PURE__ */ Z(Ff, [["__scopeId", "data-v-f6c4753a"]]), Hf = {
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
    const t = e, n = { render: () => ps(bf, { src: t.entry.entry_url }) };
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
      "auto-scroll": e.entry.auto_scroll,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || ""
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "events", "unavailable-reason"]));
  }
}, os = "journal.stale-build-reload", Uf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Vf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(os) === e.message) return !1;
    t.setItem(os, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function zf(e = window.sessionStorage) {
  try {
    e.removeItem(os);
  } catch {
    return;
  }
}
const Gf = ["data-window"], Kf = {
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
    const t = e, n = pn(null), s = q("");
    return ke(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, zf();
          } catch (o) {
            if (Uf(o) && Vf(o)) return;
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
    ], 8, Gf)) : (l(), G(po, {
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
      "auto-scroll": e.entry.auto_scroll,
      events: e.entry.events,
      "unavailable-reason": e.entry.unavailable_reason || s.value
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "events", "unavailable-reason"]));
  }
}, Yf = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new Ef(), s = ((i = Ne(je, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = O(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = O(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), G(Kf, {
      key: 0,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), G(Hf, {
      key: 1,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Jf = { class: "mark-more-inner" }, Zf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Xf = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Qf = {
  key: 3,
  class: "mark-lines"
}, e1 = "process", ra = "task", t1 = 2e3, n1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ne(je), s = O(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = O(() => ho.has(t.mark.variant) && t.mark.detail || ""), o = O(() => t.mark.target_model === ra ? t.mark.target_id : 0), r = q([]), i = q(!1), c = q(""), u = O(() => t.mark.target_model === e1 && !!t.mark.target_id);
    async function f() {
      const $ = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = $.ok ? "" : $.error, $.ok && (r.value = $.value.lines);
    }
    let m = null;
    const w = () => clearInterval(m);
    return ke(() => t.shown && u.value, ($) => {
      w(), $ && (f(), t.mark.ended_at || (m = setInterval(f, t1)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, ($) => $ && t.shown && u.value && (w(), f())), Ae(w), ($, D) => (l(), d("div", {
      class: Q(["mark-more", { open: e.shown }]),
      onClick: D[1] || (D[1] = _e(() => {
      }, ["stop"]))
    }, [
      p("div", Jf, [
        e.declaration.body_url ? (l(), G(Yf, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(X, { key: 1 }, [
          a.value ? (l(), d(X, { key: 0 }, [
            D[2] || (D[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Zf, k(a.value), 1)
          ], 64)) : P("", !0),
          u.value && c.value ? (l(), d("p", Xf, k(c.value), 1)) : u.value && i.value ? (l(), d(X, { key: 2 }, [
            D[3] || (D[3] = p("p", { class: "mark-label" }, "Output", -1)),
            H(ff, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", Qf, k(s.value.join(`
`)), 1)) : P("", !0),
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: D[0] || (D[0] = _e((_) => z(it)(`${ra}:${o.value}`), ["stop"]))
          }, "Open task " + k(o.value) + " and its proofs", 1)) : P("", !0)
        ], 64))
      ])
    ], 2));
  }
}, rs = /* @__PURE__ */ Z(n1, [["__scopeId", "data-v-51f69bf1"]]), s1 = (e) => `show-${e}`, jv = (e, t, n) => e.filter((s) => {
  var a;
  return n(s1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), a1 = "messages.chat", o1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), is = (e, t, n) => Et(a1, o1(e, t), n), r1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, i1 = ["title", "aria-label", "onClick"], l1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, c1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = O(() => r1(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = q(""), a = Ne(je);
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
      ], 8, i1))), 128)),
      s.value ? (l(), d("span", l1, k(s.value), 1)) : P("", !0)
    ], 64));
  }
}, u1 = /* @__PURE__ */ Z(c1, [["__scopeId", "data-v-0dfda102"]]);
function mo(e, t) {
  const n = pn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await De.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const go = mo("/api/marks", "marks"), Pv = go.fetchAll, d1 = go.find, h1 = 2e3;
function vo(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, h1);
  };
  Le(async () => {
    await e(), s();
  }), yt(() => clearTimeout(n));
}
const f1 = ["data-ref"], p1 = ["data-ref"], m1 = { class: "mark-row" }, g1 = "dock add", v1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = O(() => d1(s.mark.type)), o = Ne(je, null), r = O(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = q(null);
    vo(async () => {
      if (!r.value) return;
      const w = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      w.ok && w.value.rows.length && (i.value = w.value.rows[0].progress);
    }, () => r.value);
    const c = O(() => {
      const w = of(s.mark, a.value), $ = !w.figure || w.figure.endsWith("%");
      return i.value && r.value && $ ? { ...w, figure: `${i.value}%`, fraction: i.value / 100 } : w;
    }), u = O(() => {
      var w;
      return !!(s.mark.lines || s.mark.detail && ho.has(s.mark.variant) || t.has(s.mark.target_model) || (w = a.value) != null && w.body_url);
    }), f = q(!1), m = O(() => {
      var w, $, D;
      return s.docked ? ($ = (w = a.value) == null ? void 0 : w.buttons) == null ? void 0 : $.filter((_) => {
        var y;
        return !((y = _.runs) != null && y.startsWith(g1));
      }) : (D = a.value) == null ? void 0 : D.buttons;
    });
    return (w, $) => {
      var D, _;
      return (D = a.value) != null && D.card ? (l(), d("div", {
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
        class: Q(["thread-turn", "card", { "full-width": (_ = a.value) == null ? void 0 : _.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", m1, [
          H(co, ot({
            mark: c.value,
            open: u.value ? f.value : void 0
          }, Xo(c.value.handlers), {
            onClick: $[0] || ($[0] = (y) => f.value = !f.value)
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
          H(u1, {
            buttons: m.value,
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
    const t = e, n = q(!1), s = q(!1);
    ke(n, () => s.value = !0);
    const a = O(() => ({
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
          (l(!0), d(X, null, re(e.group.marks, (i) => (l(), G(y1, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, k1)) : P("", !0)
    ], 8, w1));
  }
}, qv = /* @__PURE__ */ Z($1, [["__scopeId", "data-v-8a285510"]]);
function x1(e) {
  const t = q(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Le(() => n.observe(e.value)), yt(() => n.disconnect()), t;
}
const M1 = { class: "chat-dock-fold" }, _1 = ["aria-label"], S1 = { class: "chat-dock-head" }, E1 = { class: "chat-dock-inner" }, A1 = 700, C1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = q(null), s = q(null), a = x1(s), o = q(!1);
    let r = 0;
    return Le(() => r = setTimeout(() => o.value = !0, A1)), yt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
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
                style: be(z(a) === null ? null : { height: `${z(a)}px` })
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
}, yo = /* @__PURE__ */ Z(C1, [["__scopeId", "data-v-63e4dcfc"]]), O1 = {
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
}, B1 = /* @__PURE__ */ Z(T1, [["__scopeId", "data-v-d0c4b012"]]), wo = mo("/api/docks", "docks"), Wv = wo.fetchAll, ls = wo.find, I1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), cs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), R1 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), L1 = (e) => e.kept ? cs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : cs("keep", "pin", "Pin", `dock keep ${e.id}`);
function D1(e, t) {
  var n;
  return [
    ...R1(e, t) ? [L1(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Dt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    cs("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const N1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: I1(e, t),
  buttons: D1(e, t)
}), j1 = { class: "dock-title" }, P1 = ["aria-expanded", "title"], q1 = { class: "chat-dock-acts dock-acts" }, W1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, F1 = {
  key: 1,
  class: "dock-text"
}, H1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = O(() => ls(s.item.type)), o = q(null), r = O(() => N1(s.item, a.value)), i = Ne(je), c = q(/* @__PURE__ */ new Set()), u = q("");
    async function f($) {
      if ($.action === "open") return it(`${s.item.target_model}:${s.item.target_id}`);
      if ($.action !== "declared") return is($, s.item, i.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, $.label]), u.value = "";
      const D = await is($, s.item, i.environment);
      (D == null ? void 0 : D.ok) === !1 && (c.value = new Set([...c.value].filter((_) => _ !== $.label)), u.value = D.error);
    }
    const m = O(() => r.value.buttons.filter(($) => $.action !== "undock" && !c.value.has($.label))), w = O(() => r.value.buttons.find(($) => $.action === "undock"));
    return ($, D) => (l(), G(yo, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: V(() => [
        e.leaving ? (l(), G(B1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : P("", !0)
      ]),
      head: V(() => {
        var _, y, C;
        return [
          (_ = a.value) != null && _.draws_head ? (l(), d("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(X, { key: 1 }, [
            H(xe, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", j1, k(r.value.title), 1)
          ], 64)),
          (y = a.value) != null && y.badge ? (l(), d("span", {
            key: 2,
            class: Q(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, k(a.value.badge), 3)) : P("", !0),
          (C = a.value) != null && C.draws_head ? P("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: D[0] || (D[0] = (R) => n("fold"))
          }, [
            H(Tt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, P1)),
          p("span", q1, [
            (l(!0), d(X, null, re(m.value, (R) => (l(), G(ye, {
              key: R.action + R.runs,
              small: "",
              kind: R.primary ? "primary" : "ghost",
              bordered: !R.primary,
              "data-dock-action": R.action,
              onClick: (te) => f(R)
            }, {
              default: V(() => [
                he(k(R.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          H(ys, {
            title: w.value.label,
            "data-dock-action": "undock",
            onClick: D[1] || (D[1] = (R) => f(w.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var _, y;
        return [
          u.value ? (l(), d("p", W1, k(u.value), 1)) : P("", !0),
          e.item.text && !((_ = a.value) != null && _.body_url) ? (l(), d("p", F1, k(e.item.text), 1)) : P("", !0),
          (y = a.value) != null && y.body_url ? (l(), G(rs, {
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
}, ia = /* @__PURE__ */ Z(H1, [["__scopeId", "data-v-608c189e"]]), U1 = ["title", "aria-label"], V1 = { class: "run-chip-in" }, z1 = {
  key: 0,
  class: "run-chip-ring"
}, G1 = { class: "run-chip-name" }, K1 = { class: "run-chip-bar" }, Y1 = "processes.output", J1 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var f;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((f = Ne(je, null)) == null ? void 0 : f.environment) ?? "", o = q(null), r = O(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = O(() => {
      var m, w;
      return ((m = o.value) == null ? void 0 : m.title) || ((w = o.value) == null ? void 0 : w.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = O(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const m = await Et(Y1, ["process", "card", String(s.item.target_id)], a);
      m.ok && (o.value = m.value);
    }
    return vo(u, () => r.value), (m, w) => {
      var $;
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: be({ "--tone": c.value })
      }, [
        p("span", V1, [
          r.value ? (l(), d("span", z1)) : (l(), G(Ve, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", G1, k(i.value), 1)
        ]),
        p("span", K1, [
          p("i", {
            style: be({ width: r.value ? `${(($ = o.value) == null ? void 0 : $.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, U1);
    };
  }
}, Z1 = /* @__PURE__ */ Z(J1, [["__scopeId", "data-v-2036e274"]]), X1 = 24, Q1 = 8, Fv = 420;
function Hv({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= X1 && e > t ? !0 : e < t && a > Q1 ? !1 : null;
}
const ep = (e, t) => e === void 0 ? t : e, tp = 6, np = 3, la = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, us = (e) => !!(e.leaves_at && !e.kept), sp = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!us(e) || t < e.leaves_at || n.has(e.id)), ap = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => sp(s, t, n)).sort((s, a) => s.id - a.id);
function op(e, t, n = tp) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const rp = (e, t) => e >= np ? !0 : e <= 1 ? !1 : t, ip = { class: "dock-stack" }, lp = ["onMouseenter", "onMouseleave"], cp = {
  key: 0,
  class: "dock-runs-head"
}, up = ["onMouseenter", "onMouseleave"], dp = { class: "dock-runs-chips" }, hp = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = q(Date.now() / 1e3), s = q(/* @__PURE__ */ new Set()), a = q(!1), o = q(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ae(() => clearInterval(r));
    const i = O(() => ap(t.items, n.value, s.value)), c = O(() => op(i.value.filter((R) => la(R, ls)), n.value)), u = O(() => i.value.filter((R) => !c.value.includes(R) && !la(R, ls))), f = O(() => (a.value = rp(c.value.length, a.value)) && !o.value), m = q({}), w = (R) => ep(m.value[R.id], t.folded);
    function $(R) {
      m.value = { ...m.value, [R.id]: !w(R) };
    }
    function D(R) {
      m.value = { ...m.value, ...Object.fromEntries(c.value.map((te) => [te.id, te.id !== R.id])) }, o.value = !0;
    }
    function _() {
      m.value = Object.fromEntries(Object.entries(m.value).filter(([R]) => !c.value.some((te) => String(te.id) === R))), o.value = !1;
    }
    function y(R) {
      s.value = /* @__PURE__ */ new Set([...s.value, R.id]);
    }
    function C(R) {
      s.value = new Set([...s.value].filter((te) => te !== R.id));
    }
    return (R, te) => (l(), d("div", ip, [
      (l(!0), d(X, null, re(u.value, (b) => (l(), d("div", {
        key: b.id,
        onMouseenter: (v) => y(b),
        onMouseleave: (v) => C(b)
      }, [
        H(ia, {
          item: b,
          leaving: z(us)(b) && !s.value.has(b.id),
          folded: w(b),
          onFold: (v) => $(b)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, lp))), 128)),
      a.value && o.value ? (l(), d("div", cp, [
        p("button", {
          type: "button",
          class: "dock-runs-toggle",
          "aria-expanded": "true",
          title: "Fold the runs into one line",
          "data-dock-runs-fold": "",
          onClick: _
        }, [
          he(k(c.value.length) + " runs ", 1),
          H(Tt, { open: "" })
        ])
      ])) : P("", !0),
      (l(!0), d(X, null, re(f.value ? [] : c.value, (b) => (l(), d("div", {
        key: b.id,
        onMouseenter: (v) => y(b),
        onMouseleave: (v) => C(b)
      }, [
        H(ia, {
          item: b,
          leaving: z(us)(b) && !s.value.has(b.id),
          folded: w(b),
          onFold: (v) => $(b)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, up))), 128)),
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
            he(" " + k(c.value.length) + " runs ", 1),
            H(Tt)
          ]),
          p("span", dp, [
            (l(!0), d(X, null, re(c.value, (b) => (l(), G(Z1, {
              key: b.id,
              item: b,
              onClick: (v) => D(b)
            }, null, 8, ["item", "onClick"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["label"])) : P("", !0)
    ]));
  }
}, Uv = /* @__PURE__ */ Z(hp, [["__scopeId", "data-v-11842ee6"]]), St = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Xt = (e) => Math.min(Math.max(e, 0), 1), fp = (e) => {
  const t = Xt(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => fp((e - t) / (n - t));
function Vv(e) {
  const t = Xt(e), n = Xt((t - 0.12) / 0.76) * St.shuffles, s = Math.min(Math.floor(n), St.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), r = et(a, 0.38, 0.76), i = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), c = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), u = Math.sin(Math.PI * Xt((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / St.shuffles, lift: St.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const ko = 2400, pp = 0.05;
function zv({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, pp), r = Math.min(t + ko * o, a), i = e + r * o;
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
}, ds = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), mp = (e) => e * e * (3 - 2 * e), un = (e, [t, n]) => mp(ds(e, t, n)), gp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Gt = ([e, t], n) => e + n() * (t - e);
function vp(e) {
  return gp.map(() => {
    const t = Gt(Ye.speed, e), n = Gt(Ye.angle, e) * Math.PI / 180, s = Gt(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Gt(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const yp = vp(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function wp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function Gv(e, t, n = yp) {
  const s = Ze.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = wp(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const c = Math.min(a, r), u = s.from.map((f, m) => f + o.velocity[m] * c);
  return u[2] -= Ye.gravity * c * c / 2, { at: u, turn: o.spin * c, landed: Math.max(0, a - r) / i };
}
function Kv(e, t) {
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
const Yv = () => Array.from({ length: Ze.pogo.count }, (e, t) => Ze.pogo.bounce * (t + 1) / Ze.pogo.count), Jv = { stride: 0.5 };
function bo(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: ds(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: ds(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Zv(e) {
  const { into: t, out: n } = bo(Ze.rope_swing, e);
  return 1 - un(t, [0, 1]) * (1 - un(n, [0, 1]));
}
function Xv(e) {
  const t = Ze.rope_swing, { into: n, out: s } = bo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return un(n, [0, 1]) * (1 - un(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const kp = { after: 3 }, bp = 10, $p = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, xp = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Mp = { weight: 19 }, _p = {
  build: { cooldown: 180 }
}, Sp = { every: 120 }, $o = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, xo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Ep = {
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
}, Pt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: bp }), ee = (e, t, n = {}) => Pt(e, "clip", t, n), In = (e, t, n = {}) => Pt(e, "look", t, n), ca = (e, t, n = {}) => Pt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Pt(e, "pick", t, n), ...s }), pe = (e) => Pt("nothing", "nothing", e, {}), Ap = 120, Cp = 300, Rn = (e, t) => ({ ...ee(e, t), cooldown: Cp }), Op = 120, ne = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Tp = () => [ee("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...ee(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: $p[e.name] }), _t = (e) => ({ ...e, shenanigan: !0, lasts: xp[e.name] }), Ss = [
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
  ...ne("messaged", { cooldown: Op }, [ee("phone_call", 1)]),
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
  ...ne("bar_done", { holds: !0 }, Tp()),
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
  ...Object.entries(Ep).flatMap(([e, t]) => ne(`reacted:${e}`, {}, [In(t, 1)])),
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
  ...ne("held:search", { cooldown: Ap }, [Rn("search", 3), { ...Rn("binoculars", 2), when: { home: !0 } }, { ...Rn("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...ne("unit", { cooldown: _p.build.cooldown }, [ce("unit", Mp.weight), pe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ne("progress_jump", { cooldown: 6 }, [ee("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ne("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...ne("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ne("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: Sp.every }, ce("stand", 5)]),
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
], Bp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Mo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Ip = (e) => Array.isArray(e) ? e[0] : e, Rp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Lp(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || Mo(f).every(([m, w]) => n(m) >= Ip(w)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Ss.filter((f) => Bp(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= kp.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = i.filter((f) => {
    var m;
    return f.kind === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return c.some((f) => f.kind !== "nothing") ? c : i;
}
function Dp(e, t) {
  const n = Lp(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (_o(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function _o(e, t, n) {
  var s;
  for (const [a, o] of Mo(t)) (s = e.memory) == null || s.set(a, e.now + Rp(o, n));
}
function Qv(e, t, n) {
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
}, ey = {
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
}, ty = 120, ny = (e) => ua[e] || ua.idle;
[.../* @__PURE__ */ new Set([...Object.values($o).flatMap((e) => Object.keys(e)), ...Object.keys(xo)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function sy(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Te.ahead * n ? 180 : Math.sign(s) * Te.turn;
}
const da = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function ay(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Te.sweep) % a, i = o % Te.sweep, c = Te.sweep - Te.returnSeconds, u = da((i - c) / Te.returnSeconds), f = i <= c ? da(i / c) : 1 - u, m = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + m * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Np = 1, jp = (e, t, n, s, a, o = 0) => Dp({ moment: "jump", high: e > Np * t, memory: s, now: a, room: o }, n).name === "backflip", ha = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, oy = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, ry = { width: 24, height: 27, top: 3, units: 2 }, Pp = "[data-figure-pile]", iy = { amber: [1, 0.69, 0.125], good: ha.colours.good, bad: ha.colours.bad }, Ln = { phases: 4, dim: 0.25 }, ly = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, qp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Ss.filter((e) => qp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const cy = {
  width: 84,
  belly: 13,
  blink: 4
}, fa = "[data-figure-home]", qt = () => {
  var t;
  const e = document.querySelector(fa);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(fa)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Wp = "[data-figure-docked-bars]", Fp = "[data-figure-chat-foot]", Hp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Up = "[data-figure-newest]";
function Vp() {
  var s, a;
  const e = (s = qt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Up), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
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
function So(e, t, n = Vp()) {
  if (!e || !n) return !0;
  const s = kt(e, t), a = As(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = St.gap;
  return !Co(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const Dn = 0.26, zp = 0.54, bn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Dn, travels: "stand" },
  lounge: { drop: Dn, travels: "stand" },
  composed: { drop: Dn, travels: "stand" },
  hang: { drop: zp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Eo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Gp = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), uy = (e, t) => (e === "sit" ? Gp.has(t) : Eo.has(e)) ? e : "stand", dy = 0.25, hy = (e, t) => Eo.has(e) && bn[t].drop === 0, Ao = 2, Kp = 90, Yp = 180, Jp = 140, Zp = 280, Xp = 420, Qp = 0.25, em = 290, tm = 600, nm = "cubic-bezier(0.2, 0.7, 0.4, 1)", sm = "cubic-bezier(0.55, 0, 0.9, 0.6)", Nn = 5;
function dn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: f = 0, room: m = 0, pogo: w = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Nn) return null;
  (r || i) && (o = Math.max(o, Ao));
  const $ = o > 1, D = Math.abs(t.x - e.x), _ = D < Nn ? 0 : D / (Kp * o) * 1e3, y = Math.min(_, $ ? Jp : Yp), C = Math.abs(t.y - e.y), R = t.y < e.y, te = R && !w && jp(C, n, c, u, f, m), b = R ? Xp + Math.min(C, 400) * Qp : Math.sqrt(2 * C / ko) * 1e3, v = {
    x: t.x,
    y: t.y,
    ms: C > Nn ? te ? tm : b : 0,
    lead: te ? em : R ? Zp : 0,
    easing: R ? nm : sm,
    hopping: !0,
    clip: te ? "backflip" : R ? "jump" : "fall"
  }, N = { x: t.x, y: t.y, ms: _ + y, lead: 0, easing: "linear", ramp: y, ...$ ? { clip: "run" } : {} }, T = w ? am(t, n) : v, W = R && !s ? [{ ...N, y: e.y }, T] : [{ ...v, x: e.x }, N];
  return { way: Math.sign(t.x - e.x) || 1, legs: W, lands: !a, pace: o, running: $ };
}
const am = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), kt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - bn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Co = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Es = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function bt() {
  var t;
  const e = (t = qt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Kt = 0.5, pa = 20;
function fy(e, t, n = bt()) {
  const s = kt(e, t);
  return s.left >= n.left + pa && s.right <= n.right - pa;
}
function Oo(e, t, n = bt()) {
  const s = kt(e, t), a = s.right - s.left, o = As(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Kt && i <= n.right + Kt && s.top >= n.top - Kt && c <= n.bottom + Kt;
}
const hn = [0.35, 0.5, 0.65], fn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: hn[0], right: hn.at(-1), top: fn[0], bottom: fn.at(-1) }, om = 0.24;
function As(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + om * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function rm(e, { size: t }, n = bt()) {
  const s = As(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const im = (Je.right - Je.left) / 2 + 0.08;
function lm(e, t, n = "", s = "") {
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
const cm = (e) => fn.flatMap(
  (t) => hn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function um(e, t, n = "") {
  if (!So(e, t)) return hn.length * fn.length;
  const s = kt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Hp)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && Co(a, c) && Es(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return cm(a).filter(([i, c]) => r(i, c) || lm(i, c, n)).length;
}
function dm(e, t, n) {
  const s = bt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Oo(r, t, s) && So(r, t)).map((r) => ({ spot: r, covered: um(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const To = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, hm = im, fm = (e, t, { size: n }, s = hm) => pm(e, To[t], s * n, "stand");
function pm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const py = (e) => ((e + 180) % 360 + 360) % 360 - 180, my = { turns: [-20, -10, 0, 10, 20] }, mm = 7;
function gm() {
  const e = [...document.querySelectorAll(Pp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const vm = 4;
function ym() {
  const e = Bo(), t = gm(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > vm || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - mm - n, 0) } };
}
const gy = ({ size: e, below: t }) => (1 - t) * e;
function wm(e, t) {
  const n = bt(), { size: s, below: a } = t, o = bn[e.posture].drop * s;
  return { ...rm(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const km = (e, t) => Object.keys(To).map((n) => wm(fm(e, n, t), t)), bm = (e, t, n) => dm(e, t, n) ?? e[0];
function vy(e, t) {
  const { element: n, edge: s } = ym();
  return { ...bm(km(s, e), e, t), view: null, on: n };
}
function Bo() {
  var s;
  const e = qt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Wp);
  if (!t) return { ...Io(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Io() {
  const e = qt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const $m = { climb: 90 };
function yy(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: f = 0, room: m = 0, pogo: w = !1 } = {}) {
  (o || r) && (a = Math.max(a, Ao));
  const $ = (te) => {
    const b = kt(te, n, bn[te.posture].travels);
    return { x: b.left, y: b.top };
  }, D = t.ladder ?? e.ladder;
  if (D && !(t.ladder && e.ladder)) return xm($(e), $(t), $({ ...D.foot, posture: "stand" }), D.way, !!t.ladder, n, a);
  const [_, ...y] = [e, ...c, t].map($), C = dn(_, y[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: f, room: m, pogo: w }), R = y.slice(1).map((te, b) => {
    var v;
    return (v = dn(y[b], te, n.size, { random: i, memory: u, now: f, room: m })) == null ? void 0 : v.legs.find((N) => N.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...R.filter(Boolean)] };
}
function xm(e, t, n, s, a, o, r) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / $m.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? dn(e, n, o.size, { pace: r }) : dn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const Mm = "[data-figure-bubble]", _m = 250;
let At = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ro = 0;
const Lo = () => At, jn = /* @__PURE__ */ new WeakMap();
let Sm = 0;
function Do(e) {
  return jn.has(e) || jn.set(e, `floor-${++Sm}`), jn.get(e);
}
const Em = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Am = () => {
  var e, t;
  return ((t = (e = qt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Cm(e, t) {
  var s;
  const n = (s = e.querySelector(Fp)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Om(e, t) {
  const n = e && Cm(e, t), s = e ? [...e.querySelectorAll(Mm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Em(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Do(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Tm = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= _m ? (t.top - s.top) / a * 1e3 : 0;
};
function Bm(e = At, t = performance.now()) {
  const n = bt(), s = Am(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = Bo(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = Io();
  return u.element && c.push({ id: Do(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...Om(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((f) => Object.freeze({ ...f, vy: Tm(e, f, t) }))) });
}
const hs = /* @__PURE__ */ new Set();
function Im(e) {
  return hs.add(e), () => hs.delete(e);
}
function Rm() {
  No();
  const e = () => {
    Ro = requestAnimationFrame(e), !document.hidden && (At = Bm(At), hs.forEach((t) => t(At)));
  };
  e();
}
function No() {
  cancelAnimationFrame(Ro);
}
const Lm = (e, t) => e.find((n) => n.id === t) ?? null;
function wy(e, t, n = Lo().floors) {
  const s = Lm(n, "home");
  return e.posture === "hang" && s && kt(e, t).bottom >= s.top ? !1 : Oo(e, t);
}
const Dm = ["data-kind"], Nm = { class: "figure-floor-name" }, jm = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: be({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", Nm, k(e.floor.kind), 1)
    ], 12, Dm));
  }
}, Pm = /* @__PURE__ */ Z(jm, [["__scopeId", "data-v-8f6132da"]]), qm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Wm = {
  __name: "FigureFloors",
  setup(e) {
    const t = pn(Lo().floors);
    let n = () => {
    };
    return Le(() => {
      n = Im((s) => t.value = s.floors), Rm();
    }), Ae(() => {
      n(), No();
    }), (s, a) => (l(), d("div", qm, [
      (l(!0), d(X, null, re(t.value, (o) => (l(), G(Pm, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, ky = /* @__PURE__ */ Z(Wm, [["__scopeId", "data-v-e519168b"]]), Pn = (e) => typeof e == "number" ? e : Date.parse(e);
function by(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Pn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Pn(a.row.created_at) - Pn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Fm = 3, qn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Hm(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = qn[n.grouping]) == null ? void 0 : s.call(qn, e.row, n)) || "";
}
function Um(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function $y(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Fm ? [Um(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = Hm(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Vm = 1e3;
function xy() {
  const e = q(Date.now()), t = setInterval(() => e.value = Date.now(), Vm);
  return yt(() => clearInterval(t)), e;
}
function My(e) {
  const t = vs(), n = q(null), s = q("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const zm = {
  class: "cards-page",
  "data-window-flush": ""
}, Gm = { class: "cards-bar" }, Km = { class: "cards-count" }, Ym = { class: "cards" }, Jm = {
  key: 1,
  class: "cards-note"
}, Zm = {
  key: 2,
  class: "cards-note"
}, Xm = ["data-row", "onClick"], Qm = { class: "card-head" }, eg = { class: "card-age" }, tg = { class: "card-title" }, ng = { class: "card-foot" }, sg = {
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
    return (s, a) => (l(), d("div", zm, [
      p("div", Gm, [
        p("span", Km, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        H(ye, ot({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: V(() => [
            H(xe, {
              name: "plus",
              size: 12
            }),
            he(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", Ym, [
        e.loaded ? e.failure ? (l(), d("p", Jm, k(e.failure), 1)) : e.rows.length ? P("", !0) : (l(), d("p", Zm, "No " + k(e.noun) + "s yet", 1)) : (l(), G(wt, {
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
          p("span", Qm, [
            H(xe, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            he(" " + k(e.head(o)), 1),
            p("span", eg, k(z(Yn)(o.created_at)), 1)
          ]),
          p("span", tg, k(e.title(o)), 1),
          p("span", ng, k(e.foot(o)), 1)
        ], 8, Xm))), 128))
      ]),
      we(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, _y = /* @__PURE__ */ Z(sg, [["__scopeId", "data-v-d72d528d"]]), ma = "newest";
function Sy(e, { title: t, isOpen: n = null }) {
  const s = q(""), a = q(ma), o = q("all"), r = O(() => {
    const i = s.value.trim().toLowerCase(), c = e.value.filter((u) => (!i || JSON.stringify(u).toLowerCase().includes(i)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === ma ? c : [...c].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: r, hasStates: !!n };
}
const ag = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, og = 40, rg = "top", ig = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var m;
    const n = e, s = (m = Ne(je, null)) == null ? void 0 : m.autoScroll, a = O(() => s === rg), o = q(null), r = q(!1), i = (w) => a.value ? w.scrollTop : w.scrollHeight - w.scrollTop - w.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function f() {
      r.value = i(o.value) >= og;
    }
    return ke(() => n.rowCount, async () => {
      await Rt(), !r.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (w, $) => (l(), d("div", ag, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: Q(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        we(w.$slots, "default", {}, void 0, !0)
      ], 34),
      H(It, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: V(() => [
          rt(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            H(xe, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            $[0] || ($[0] = he(" Newest ", -1))
          ], 512), [
            [er, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Ey = /* @__PURE__ */ Z(ig, [["__scopeId", "data-v-3accb764"]]), lg = {
  class: "list-tools",
  "data-list-tools": ""
}, cg = {
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
    return (s, a) => (l(), d("div", lg, [
      H(Bh, {
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
      }, null, 8, ["value"])) : P("", !0)
    ]));
  }
}, Ay = /* @__PURE__ */ Z(cg, [["__scopeId", "data-v-b2dd0a0d"]]);
function Cy() {
  const e = q(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const ug = 86400, fs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function dg(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((fs(t) - fs(e)) / ug);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function Oy(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = fs(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: dg(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Wn = 280, Fn = 240, Hn = 120, hg = 6, fg = 14, Bt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function pg(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${fg}px)` }), e.offsetHeight, e.style.transition = `height ${Wn}ms ${Bt}`, e.style.height = `${r}px`;
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
function Ty(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${hg}px)` }), e.offsetHeight, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${Bt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - r < Hn) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const mg = 140, Yt = 220, gg = 5;
function By({ gap: e = mg, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, gg);
    if (s = i.length > 0, !s) return;
    let c = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), c -= 1, c || t(o, e);
      });
  }
  const r = (i, c, u, f = pg) => {
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
function Iy(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Yt}ms ${Bt}, opacity ${Yt}ms ease-in, margin ${Yt}ms ${Bt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Yt);
}
const jo = "chat.pins.minimised", Qt = q(Ct(jo, !1));
function ga(e) {
  Qt.value = e, mn(jo, e);
}
function vg(e) {
  const t = O(() => e()), n = O(() => Qt.value ? [] : e()), s = () => ga(!Qt.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Ta(o) > a).length,
    (o, r) => o > r && ga(!1)
  ), { pins: t, visible: n, minimised: Qt, toggle: s };
}
const yg = ["title"], wg = {
  key: 0,
  class: "pins-count"
}, kg = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = vg(() => t.notices);
    return (o, r) => z(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: Q(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = _e((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      H(xe, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (l(), d("span", wg, k(z(n).length), 1)) : P("", !0)
    ], 10, yg)) : P("", !0);
  }
}, Ry = /* @__PURE__ */ Z(kg, [["__scopeId", "data-v-c0d11526"]]), bg = ["title"], $g = ["title"], xg = { class: "diff-card-dir" }, Mg = { class: "diff-card-name" }, _g = { class: "diff-card-ago" }, Sg = ["title"], Eg = ["title"], Ag = {
  key: 0,
  class: "diff-card-note"
}, Cg = ["href"], Og = ["src", "alt"], Tg = { class: "diff-card-rows" }, Bg = { class: "diff-row-num" }, Ig = { class: "diff-row-sign" }, Rg = { class: "diff-row-code" }, Lg = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = O(() => n.path.lastIndexOf("/") + 1), u = O(() => n.path.slice(0, c.value)), f = O(() => n.path.slice(c.value)), m = O(() => n.kind === "deleted"), w = O(() => r[n.kind]), $ = O(() => new Set(n.rows.filter((E) => E.line_type === "add").map((E) => E.line))), D = q("after"), _ = O(() => D.value === "before" ? n.whole.old : n.whole.text), y = O(() => n.whole && n.whole.text !== void 0 ? _.value.split(`
`).map((E, g) => ({ line_type: D.value === "after" && $.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: E })) : n.rows.filter(
      (E) => !(n.editsOnly && ["ctx", "fold"].includes(E.line_type)) && !(n.hideRemovals && E.line_type === "del")
    )), C = q(!1), R = O(() => n.lines && !C.value && !n.whole), te = O(() => R.value ? y.value.slice(0, n.lines) : y.value), b = O(() => y.value.length - te.value.length), v = (E) => E.line === null || E.line_type === "del" ? "" : E.line, N = (E) => E.line_type === "fold" ? E.hidden ? `⋯ ${E.hidden} lines` : "⋯" : E.text, T = q(null), W = q(null);
    let x = null;
    return Le(() => {
      if (!W.value) return;
      let E = !0;
      x = new ResizeObserver(() => {
        !T.value || !W.value || (T.value.style.transition = E ? "none" : "", T.value.style.height = `${W.value.offsetHeight}px`, E = !1);
      }), x.observe(W.value);
    }), Ae(() => x && x.disconnect()), (E, g) => (l(), d("section", {
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
          p("span", xg, k(u.value), 1),
          p("span", Mg, k(f.value), 1),
          w.value ? (l(), d("span", {
            key: 0,
            class: Q(["diff-card-badge", e.kind])
          }, k(w.value), 3)) : P("", !0)
        ], 8, $g),
        p("span", {
          class: Q(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        p("span", {
          class: Q(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        p("span", _g, k(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: D.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[0] || (g[0] = _e((h) => D.value = D.value === "after" ? "before" : "after", ["stop"]))
        }, k(D.value === "after" ? "After" : "Before"), 9, Sg)) : P("", !0),
        m.value ? P("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: Q(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[1] || (g[1] = _e((h) => s("whole"), ["stop"]))
        }, [
          H(xe, {
            name: "file",
            size: 12
          })
        ], 10, Eg))
      ], 8, bg),
      e.whole && e.whole.error ? (l(), d("p", Ag, k(e.whole.error), 1)) : P("", !0),
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
          }, null, 8, Og)
        ], 8, Cg)) : (l(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: T,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: W,
            class: "diff-card-diff"
          }, [
            p("div", Tg, [
              (l(!0), d(X, null, re(te.value, (h, A) => (l(), d("div", {
                key: A,
                class: Q(["diff-row", h.line_type, { fresh: e.fresh && h.edit === e.fresh }])
              }, [
                p("span", Bg, k(v(h)), 1),
                p("span", Ig, k(i[h.line_type]), 1),
                p("span", Rg, k(N(h)), 1)
              ], 2))), 128)),
              b.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[3] || (g[3] = _e((h) => C.value = !0, ["stop"]))
              }, k(b.value) + " more " + k(b.value === 1 ? "line" : "lines"), 1)) : P("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : P("", !0)
    ], 2));
  }
}, Ly = /* @__PURE__ */ Z(Lg, [["__scopeId", "data-v-b6424f6e"]]), Dg = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ng = {
  key: 1,
  class: "menu-item-text"
}, jg = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: Q(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), d("span", Dg, k(e.checked ? "✓" : ""), 1)) : P("", !0),
      e.description ? (l(), d("span", Ng, [
        p("span", null, [
          we(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, k(e.description), 1)
      ])) : we(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Pg = /* @__PURE__ */ Z(jg, [["__scopeId", "data-v-c91b190e"]]), qg = {}, Wg = { class: "menu-label" };
function Fg(e, t) {
  return l(), d("span", Wg, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Hg = /* @__PURE__ */ Z(qg, [["render", Fg], ["__scopeId", "data-v-aa955b3e"]]), Po = /* @__PURE__ */ new WeakMap(), Ug = (e, t) => Po.set(e, t);
function Vg(e, t) {
  for (let n = t; n; n = Po.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function zg(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Vg(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const ft = 8, Gg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = q(null), o = (h) => h ? `${h}px` : void 0, r = O(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = q({ w: 0, h: 0 }), c = q(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), m = (h) => {
      const A = h.closest(".pane, .float-window");
      return A ? f(A.getBoundingClientRect()) : u();
    }, w = (h, A) => `${Math.max(0, h ? Math.min(h, A) : A)}px`;
    function $(h, A) {
      return {
        below: h.bottom - A.bottom - s.gap - ft,
        above: A.top - h.top - s.gap - ft,
        across: h.right - h.left - 2 * ft
      };
    }
    function D(h) {
      const A = m(s.anchor), B = $(A, h);
      return i.value.w <= B.across && i.value.h <= Math.max(B.below, B.above) ? A : u();
    }
    const _ = O(() => {
      if (!c.value) return r.value;
      const h = c.value, A = D(h), B = $(A, h), { w: S, h: Y } = i.value, U = s.align === "auto" ? h.left + h.right > A.left + A.right : s.align === "right", ue = ki(U ? h.right - S : h.left, A.left + ft, Math.max(A.left + ft, A.right - S - ft)), me = Y > B.below && B.above > B.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: w(s.maxHeight, B.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: w(s.maxHeight, B.below) };
      return { ...r.value, ...me, left: `${ue}px`, maxWidth: w(s.maxWidth, B.across) };
    }), y = n, C = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function R(h) {
      const A = C(), B = A.indexOf(document.activeElement);
      A[(B + h + A.length) % A.length].focus();
    }
    const te = { ArrowDown: () => R(1), ArrowUp: () => R(-1), Escape: () => y("close") }, b = (h) => te[h.key] && (h.preventDefault(), te[h.key]()), v = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let N = 0;
    const T = new ResizeObserver(() => {
      cancelAnimationFrame(N), N = requestAnimationFrame(v);
    });
    zg(a, (h) => s.anchor && !s.anchor.contains(h.target) && y("close"));
    const W = (h, A) => ["top", "left", "right", "bottom"].some((B) => Math.abs(h[B] - A[B]) > 1), x = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let E = 0;
    function g() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || x(h)) return y("close");
        W(h, c.value) && (c.value = h);
      }
      E = requestAnimationFrame(g);
    }
    return Le(() => {
      s.anchor && a.value && Ug(a.value, s.anchor), v(), a.value && T.observe(a.value), !s.plain && C()[0] && C()[0].focus(), g();
    }), Ae(() => {
      T.disconnect(), cancelAnimationFrame(E), cancelAnimationFrame(N);
    }), t({ element: a }), (h, A) => (l(), G(wa, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", ot({
        ref_key: "panel",
        ref: a
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: _.value,
        onKeydown: b
      }), [
        we(h.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Kg = /* @__PURE__ */ Z(Gg, [["__scopeId", "data-v-3d203970"]]), Yg = {
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
        H(xe, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Jg = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [{ word: "approve", label: "Approve", main: !0 }, He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, Zg = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Xg = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Qg = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], e0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], t0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], n0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], s0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? n0(t) : e === "agent" ? [...e0(t), ...Qg(t)] : e === "check" ? t0(t) : e === "question" ? Xg(t) : ((n = { plan: Jg, task: Zg }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, a0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, o0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, r0 = { class: "ask-text" }, i0 = ["placeholder", "aria-label"], l0 = ["placeholder", "aria-label"], c0 = {
  key: 3,
  class: "moves"
}, u0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = O(() => s0(s.kind, s.row)), r = q(""), i = q(null), c = q(""), u = q("");
    ke(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function f($, D = "") {
      const _ = await s.read([$.noun ?? s.kind, $.word, String(s.id), ...$.flag ? [$.flag, D] : $.positional ? [D] : [], ...$.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = _.ok ? "" : _.error, _.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const m = ($) => $.confirm ? i.value = $ : $.said ? f($, $.said) : $.flag || $.positional ? (i.value = $, c.value = "") : f($), w = () => c.value.trim() && f(i.value, c.value.trim());
    return t({ moves: o, press: m }), ($, D) => {
      var _;
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: Q(["foot", { inline: e.inline }])
      }, [
        r.value ? (l(), d("p", a0, k(r.value), 1)) : P("", !0),
        (_ = i.value) != null && _.confirm ? (l(), d("div", o0, [
          p("span", r0, k(i.value.confirm), 1),
          H(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: D[0] || (D[0] = (y) => f(i.value))
          }, {
            default: V(() => [
              he(k(i.value.label), 1)
            ]),
            _: 1
          }),
          H(ye, {
            small: "",
            kind: "ghost",
            onClick: D[1] || (D[1] = (y) => i.value = null)
          }, {
            default: V(() => [...D[7] || (D[7] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (l(), d("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: _e(w, ["prevent"])
        }, [
          rt(p("input", {
            "onUpdate:modelValue": D[2] || (D[2] = (y) => c.value = y),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: D[3] || (D[3] = en(_e((y) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, i0), [
            [Gn, c.value]
          ]),
          i.value.opener ? rt((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": D[4] || (D[4] = (y) => u.value = y),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: D[5] || (D[5] = en(_e((y) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, l0)), [
            [Gn, u.value]
          ]) : P("", !0),
          H(ye, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: V(() => [
              he(k(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          H(ye, {
            small: "",
            kind: "ghost",
            onClick: D[6] || (D[6] = (y) => i.value = null)
          }, {
            default: V(() => [...D[8] || (D[8] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", c0, [
          (l(!0), d(X, null, re(o.value, (y) => (l(), G(ye, {
            key: y.word,
            small: "",
            kind: y.main ? "primary" : "ghost",
            "data-move": y.word,
            onClick: (C) => m(y)
          }, {
            default: V(() => [
              he(k(y.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : P("", !0);
    };
  }
}, d0 = /* @__PURE__ */ Z(u0, [["__scopeId", "data-v-fffa0bf6"]]), h0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, f0 = { ...h0, done: "Completed" }, p0 = { class: "task-status-icon" }, m0 = ["width", "height", "aria-label"], g0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", p0, [
      H(It, {
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
            "aria-label": z(f0)[e.status]
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
          ], 10, m0))
        ]),
        _: 1
      })
    ]));
  }
}, qo = /* @__PURE__ */ Z(g0, [["__scopeId", "data-v-2ab7e404"]]), v0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), y0 = (e) => v0.has(e), Wo = (e) => y0(e) ? "done" : e, w0 = { class: "facts" }, k0 = { class: "fact wide" }, b0 = { class: "fact-value" }, $0 = {
  key: 0,
  class: "fact"
}, x0 = { class: "fact-value" }, M0 = {
  key: 1,
  class: "fact"
}, _0 = { class: "fact-value" }, S0 = { class: "fact wide" }, E0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, A0 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = ln.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return l(), d("div", w0, [
        p("div", k0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", b0, k((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", $0, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", x0, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : P("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", M0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", _0, "Agent " + k(e.task.holder_id), 1)
        ])) : P("", !0),
        p("div", S0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          H(as, {
            options: z(n),
            value: String(z(lo)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", E0, k(e.refusal), 1)) : P("", !0)
        ])
      ]);
    };
  }
}, C0 = /* @__PURE__ */ Z(A0, [["__scopeId", "data-v-2018762d"]]), O0 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, T0 = ["onClick"], B0 = { class: "wait-id" }, I0 = { class: "wait-title" }, R0 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, L0 = { class: "text" }, D0 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, N0 = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, j0 = 180, P0 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = q(!1);
    return (a, o) => (l(), d(X, null, [
      e.task.waits.length ? (l(), d("section", O0, [
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
          p("span", B0, k(r.id), 1),
          p("span", I0, k(r.title), 1)
        ], 8, T0))), 128))
      ])) : P("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", R0, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", L0, k(e.task.outcome), 1)
      ])) : P("", !0),
      e.task.brief ? (l(), d("section", D0, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: Q(["text", { clamped: !s.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > j0 && !s.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : P("", !0)
      ])) : P("", !0),
      e.task.logs.length ? (l(), d("section", N0, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(X, null, re(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, k(r.line), 1))), 128))
      ])) : P("", !0)
    ], 64));
  }
}, q0 = /* @__PURE__ */ Z(P0, [["__scopeId", "data-v-f411ce35"]]), W0 = { class: "comment-side-head" }, F0 = {
  key: 0,
  class: "comment-none"
}, H0 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), d("aside", {
      class: Q(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", W0, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        H(ys, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? P("", !0) : (l(), d("p", F0, "No comments yet")),
      (l(!0), d(X, null, re(e.comments, (s) => (l(), d("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, k(e.words(s)), 1))), 128))
    ], 2));
  }
}, U0 = /* @__PURE__ */ Z(H0, [["__scopeId", "data-v-19fdbdd4"]]), V0 = ["data-comments-below"], z0 = 600, G0 = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = q(null), n = q(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < z0);
    return Le(() => s.observe(t.value)), yt(() => s.disconnect()), (a, o) => (l(), d("div", {
      ref_key: "root",
      ref: t,
      class: Q(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      we(a.$slots, "default"),
      e.open ? (l(), G(U0, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : P("", !0)
    ], 10, V0));
  }
}, K0 = /* @__PURE__ */ Z(G0, [["__scopeId", "data-v-6c850df0"]]), Y0 = ["placeholder"], J0 = { class: "actions" }, Z0 = { class: "error" }, X0 = {
  key: 1,
  class: "card closed"
}, Q0 = { class: "mark" }, ev = { class: "prompt" }, tv = {
  key: 0,
  class: "draft"
}, nv = {
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
    const s = e, a = n, o = Vn(e, "draft"), r = Vn(e, "error"), i = q(!!r.value), c = q(!1), u = q(!1), f = q(null);
    async function m() {
      var _, y;
      i.value = !0, c.value = !1, await Rt(), (y = ((_ = f.value) == null ? void 0 : _.querySelector("input")) || f.value) == null || y.focus();
    }
    function w() {
      i.value = !1, r.value = "";
    }
    function $(_) {
      _.shiftKey || _.isComposing || (_.preventDefault(), D());
    }
    async function D() {
      const _ = o.value.trim();
      if (!(!_ || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(_), i.value = !1, c.value = !0;
        } catch (y) {
          o.value = _, r.value = y.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: m }), (_, y) => (l(), d("div", {
      class: Q(["comment-bar", { open: i.value }])
    }, [
      i.value ? (l(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: _e(D, ["prevent"]),
        onKeydown: en(w, ["esc"])
      }, [
        we(_.$slots, "who", {}, void 0, !0),
        rt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (C) => o.value = C),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: en($, ["enter"])
        }, null, 40, Y0), [
          [Gn, o.value]
        ]),
        p("div", J0, [
          p("span", Z0, k(r.value), 1),
          H(ye, {
            small: "",
            onClick: w
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
            onClick: D
          }, {
            default: V(() => [...y[3] || (y[3] = [
              he("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (l(), d("div", X0, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          p("span", Q0, [
            H(xe, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", ev, k(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", tv, "Draft kept")) : P("", !0)
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[1] || (y[1] = (C) => a("show"))
        }, [
          p("span", null, k(z(bi)(e.count, "comment")), 1),
          H(xe, {
            name: "down",
            size: 12
          })
        ])) : P("", !0)
      ]))
    ], 2));
  }
}, sv = /* @__PURE__ */ Z(nv, [["__scopeId", "data-v-79db0c2d"]]);
function av(e, t) {
  const n = q([]), s = q(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: f, id: m, title: w } = e(), $ = `On ${f} ${m}, ${w}: `;
    return u.text.startsWith($) ? u.text.slice($.length) : u.text;
  };
  async function i() {
    const { kind: u, id: f } = e();
    if (!f) return;
    const m = ++o, w = await t([u, "comments", String(f)]);
    m === o && (n.value = w.ok ? w.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: f, id: m } = e(), w = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, w], s.value = !0;
    const $ = await t([f, "comment", String(m), u]);
    if (!$.ok)
      throw n.value = n.value.filter((D) => D !== w && D.id !== w.id), new Error($.error);
    await i();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: c, load: i };
}
const ov = { class: "top" }, rv = {
  class: "crumb",
  "data-task-crumb": ""
}, iv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, lv = {
  key: 1,
  class: "body"
}, cv = { class: "stamp" }, uv = {
  class: "title",
  "data-resource-title": ""
}, dv = { class: "since" }, hv = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, fv = { class: "text" }, pv = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, mv = {
  key: 1,
  class: "note"
}, gv = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, vv = { class: "text" }, yv = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = q(null), r = q(null), i = q(""), c = q(""), u = q(null), f = q(null), m = av(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (b) => s.read(b));
    ke(m.open, (b) => a("comments", b));
    let w = 0;
    const $ = Wo, D = (b) => b.slice(0, 1).toUpperCase() + b.slice(1), _ = O(() => {
      var b;
      return (b = r.value) != null && b.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function y() {
      const b = ++w, [v, N] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      b === w && (i.value = v.ok ? "" : v.error, o.value = v.ok ? v.value : null, r.value = N.ok ? N.value : null);
    }
    ke(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, y();
    }, { immediate: !0 }), ke(() => s.changes, y);
    async function C(b) {
      const v = o.value.priority;
      o.value.priority = Number(b);
      const N = await s.read(["task", "edit", String(s.id), "--priority", b]);
      if (c.value = N.ok ? "" : N.error, N.ok) return y();
      o.value.priority = v;
    }
    function R(b) {
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
      p("div", ov, [
        e.backed ? (l(), G(Yg, {
          key: 0,
          onBack: v[0] || (v[0] = (N) => a("back"))
        })) : P("", !0),
        p("span", rv, k(_.value), 1),
        v[9] || (v[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(X, { key: 1 }, [
          H(ye, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: v[1] || (v[1] = (N) => a("step", -1))
          }, {
            default: V(() => [
              H(xe, {
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
            onClick: v[2] || (v[2] = (N) => a("step", 1))
          }, {
            default: V(() => [
              H(xe, {
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
          onClick: v[3] || (v[3] = (N) => a("close"))
        }, {
          default: V(() => [
            H(xe, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (l(), d("p", iv, k(i.value), 1)) : o.value ? (l(), d(X, { key: 2 }, [
        H(K0, {
          open: z(m).open.value,
          comments: z(m).comments.value,
          words: z(m).words,
          onClose: v[6] || (v[6] = (N) => z(m).open.value = !1)
        }, {
          default: V(() => {
            var N;
            return [
              (l(), d("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", cv, "Task " + k(o.value.id) + " · updated " + k(z(Yn)(z(an)(o.value)) || "just now"), 1),
                p("h3", uv, k(o.value.title), 1),
                p("div", {
                  class: Q(["state-line", z($)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: v[4] || (v[4] = (T) => te(T.currentTarget))
                  }, [
                    H(qo, {
                      status: z($)(o.value.state)
                    }, null, 8, ["status"]),
                    he(" " + k(D(o.value.state)), 1)
                  ]),
                  p("span", dv, "since " + k(z(Yn)(z(an)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", hv, [
                  v[10] || (v[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", fv, k(o.value.reason || "Other tasks"), 1),
                  (N = o.value.openers) != null && N.length ? (l(), d("p", pv, "Opens by itself when " + k(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", mv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", gv, [
                  v[11] || (v[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", vv, k(o.value.reason), 1)
                ])) : P("", !0),
                H(C0, {
                  task: o.value,
                  place: r.value,
                  refusal: c.value,
                  onPriority: C
                }, null, 8, ["task", "place", "refusal"]),
                H(q0, {
                  task: o.value,
                  onSelect: v[5] || (v[5] = (T) => a("select", T))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        H(sv, {
          send: z(m).send,
          count: z(m).comments.value.length,
          onShow: v[7] || (v[7] = (N) => z(m).open.value = !z(m).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", lv, [
        H(wt)
      ])),
      H(d0, {
        ref_key: "footer",
        ref: f,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: y
      }, null, 8, ["id", "row", "read"]),
      u.value ? (l(), G(Kg, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: v[8] || (v[8] = (N) => u.value = null)
      }, {
        default: V(() => [
          H(Hg, null, {
            default: V(() => [
              he("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(X, null, re(f.value.moves, (N) => (l(), G(Pg, {
            key: N.word,
            onClick: (T) => R(N)
          }, {
            default: V(() => [
              he(k(N.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : P("", !0)
    ], 2));
  }
}, Dy = /* @__PURE__ */ Z(yv, [["__scopeId", "data-v-c76befc4"]]);
function wv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Un = { exports: {} }, va;
function kv() {
  return va || (va = 1, (function(e, t) {
    var n = (function() {
      var s = function(v, N) {
        var T = 236, W = 17, x = v, E = o[N], g = null, h = 0, A = null, B = [], S = {}, Y = function(I, L) {
          h = x * 4 + 17, g = (function(M) {
            for (var j = new Array(M), F = 0; F < M; F += 1) {
              j[F] = new Array(M);
              for (var J = 0; J < M; J += 1)
                j[F][J] = null;
            }
            return j;
          })(h), U(0, 0), U(h - 7, 0), U(0, h - 7), me(), le(), qe(I, L), x >= 7 && Se(I), A == null && (A = Fo(x, E, B)), We(A, L);
        }, U = function(I, L) {
          for (var M = -1; M <= 7; M += 1)
            if (!(I + M <= -1 || h <= I + M))
              for (var j = -1; j <= 7; j += 1)
                L + j <= -1 || h <= L + j || (0 <= M && M <= 6 && (j == 0 || j == 6) || 0 <= j && j <= 6 && (M == 0 || M == 6) || 2 <= M && M <= 4 && 2 <= j && j <= 4 ? g[I + M][L + j] = !0 : g[I + M][L + j] = !1);
        }, ue = function() {
          for (var I = 0, L = 0, M = 0; M < 8; M += 1) {
            Y(!0, M);
            var j = i.getLostPoint(S);
            (M == 0 || I > j) && (I = j, L = M);
          }
          return L;
        }, le = function() {
          for (var I = 8; I < h - 8; I += 1)
            g[I][6] == null && (g[I][6] = I % 2 == 0);
          for (var L = 8; L < h - 8; L += 1)
            g[6][L] == null && (g[6][L] = L % 2 == 0);
        }, me = function() {
          for (var I = i.getPatternPosition(x), L = 0; L < I.length; L += 1)
            for (var M = 0; M < I.length; M += 1) {
              var j = I[L], F = I[M];
              if (g[j][F] == null)
                for (var J = -2; J <= 2; J += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    J == -2 || J == 2 || ae == -2 || ae == 2 || J == 0 && ae == 0 ? g[j + J][F + ae] = !0 : g[j + J][F + ae] = !1;
            }
        }, Se = function(I) {
          for (var L = i.getBCHTypeNumber(x), M = 0; M < 18; M += 1) {
            var j = !I && (L >> M & 1) == 1;
            g[Math.floor(M / 3)][M % 3 + h - 8 - 3] = j;
          }
          for (var M = 0; M < 18; M += 1) {
            var j = !I && (L >> M & 1) == 1;
            g[M % 3 + h - 8 - 3][Math.floor(M / 3)] = j;
          }
        }, qe = function(I, L) {
          for (var M = E << 3 | L, j = i.getBCHTypeInfo(M), F = 0; F < 15; F += 1) {
            var J = !I && (j >> F & 1) == 1;
            F < 6 ? g[F][8] = J : F < 8 ? g[F + 1][8] = J : g[h - 15 + F][8] = J;
          }
          for (var F = 0; F < 15; F += 1) {
            var J = !I && (j >> F & 1) == 1;
            F < 8 ? g[8][h - F - 1] = J : F < 9 ? g[8][15 - F - 1 + 1] = J : g[8][15 - F - 1] = J;
          }
          g[h - 8][8] = !I;
        }, We = function(I, L) {
          for (var M = -1, j = h - 1, F = 7, J = 0, ae = i.getMaskFunction(L), se = h - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (g[j][se - ge] == null) {
                  var $e = !1;
                  J < I.length && ($e = (I[J] >>> F & 1) == 1);
                  var oe = ae(j, se - ge);
                  oe && ($e = !$e), g[j][se - ge] = $e, F -= 1, F == -1 && (J += 1, F = 7);
                }
              if (j += M, j < 0 || h <= j) {
                j -= M, M = -M;
                break;
              }
            }
        }, ut = function(I, L) {
          for (var M = 0, j = 0, F = 0, J = new Array(L.length), ae = new Array(L.length), se = 0; se < L.length; se += 1) {
            var ge = L[se].dataCount, $e = L[se].totalCount - ge;
            j = Math.max(j, ge), F = Math.max(F, $e), J[se] = new Array(ge);
            for (var oe = 0; oe < J[se].length; oe += 1)
              J[se][oe] = 255 & I.getBuffer()[oe + M];
            M += ge;
            var Ce = i.getErrorCorrectPolynomial($e), Oe = u(J[se], Ce.getLength() - 1), Cs = Oe.mod(Ce);
            ae[se] = new Array(Ce.getLength() - 1);
            for (var oe = 0; oe < ae[se].length; oe += 1) {
              var Os = oe + Cs.getLength() - ae[se].length;
              ae[se][oe] = Os >= 0 ? Cs.getAt(Os) : 0;
            }
          }
          for (var Ts = 0, oe = 0; oe < L.length; oe += 1)
            Ts += L[oe].totalCount;
          for (var $n = new Array(Ts), Wt = 0, oe = 0; oe < j; oe += 1)
            for (var se = 0; se < L.length; se += 1)
              oe < J[se].length && ($n[Wt] = J[se][oe], Wt += 1);
          for (var oe = 0; oe < F; oe += 1)
            for (var se = 0; se < L.length; se += 1)
              oe < ae[se].length && ($n[Wt] = ae[se][oe], Wt += 1);
          return $n;
        }, Fo = function(I, L, M) {
          for (var j = f.getRSBlocks(I, L), F = m(), J = 0; J < M.length; J += 1) {
            var ae = M[J];
            F.put(ae.getMode(), 4), F.put(ae.getLength(), i.getLengthInBits(ae.getMode(), I)), ae.write(F);
          }
          for (var se = 0, J = 0; J < j.length; J += 1)
            se += j[J].dataCount;
          if (F.getLengthInBits() > se * 8)
            throw "code length overflow. (" + F.getLengthInBits() + ">" + se * 8 + ")";
          for (F.getLengthInBits() + 4 <= se * 8 && F.put(0, 4); F.getLengthInBits() % 8 != 0; )
            F.putBit(!1);
          for (; !(F.getLengthInBits() >= se * 8 || (F.put(T, 8), F.getLengthInBits() >= se * 8)); )
            F.put(W, 8);
          return ut(F, j);
        };
        S.addData = function(I, L) {
          L = L || "Byte";
          var M = null;
          switch (L) {
            case "Numeric":
              M = w(I);
              break;
            case "Alphanumeric":
              M = $(I);
              break;
            case "Byte":
              M = D(I);
              break;
            case "Kanji":
              M = _(I);
              break;
            default:
              throw "mode:" + L;
          }
          B.push(M), A = null;
        }, S.isDark = function(I, L) {
          if (I < 0 || h <= I || L < 0 || h <= L)
            throw I + "," + L;
          return g[I][L];
        }, S.getModuleCount = function() {
          return h;
        }, S.make = function() {
          if (x < 1) {
            for (var I = 1; I < 40; I++) {
              for (var L = f.getRSBlocks(I, E), M = m(), j = 0; j < B.length; j++) {
                var F = B[j];
                M.put(F.getMode(), 4), M.put(F.getLength(), i.getLengthInBits(F.getMode(), I)), F.write(M);
              }
              for (var J = 0, j = 0; j < L.length; j++)
                J += L[j].dataCount;
              if (M.getLengthInBits() <= J * 8)
                break;
            }
            x = I;
          }
          Y(!1, ue());
        }, S.createTableTag = function(I, L) {
          I = I || 2, L = typeof L > "u" ? I * 4 : L;
          var M = "";
          M += '<table style="', M += " border-width: 0px; border-style: none;", M += " border-collapse: collapse;", M += " padding: 0px; margin: " + L + "px;", M += '">', M += "<tbody>";
          for (var j = 0; j < S.getModuleCount(); j += 1) {
            M += "<tr>";
            for (var F = 0; F < S.getModuleCount(); F += 1)
              M += '<td style="', M += " border-width: 0px; border-style: none;", M += " border-collapse: collapse;", M += " padding: 0px; margin: 0px;", M += " width: " + I + "px;", M += " height: " + I + "px;", M += " background-color: ", M += S.isDark(j, F) ? "#000000" : "#ffffff", M += ";", M += '"/>';
            M += "</tr>";
          }
          return M += "</tbody>", M += "</table>", M;
        }, S.createSvgTag = function(I, L, M, j) {
          var F = {};
          typeof arguments[0] == "object" && (F = arguments[0], I = F.cellSize, L = F.margin, M = F.alt, j = F.title), I = I || 2, L = typeof L > "u" ? I * 4 : L, M = typeof M == "string" ? { text: M } : M || {}, M.text = M.text || null, M.id = M.text ? M.id || "qrcode-description" : null, j = typeof j == "string" ? { text: j } : j || {}, j.text = j.text || null, j.id = j.text ? j.id || "qrcode-title" : null;
          var J = S.getModuleCount() * I + L * 2, ae, se, ge, $e, oe = "", Ce;
          for (Ce = "l" + I + ",0 0," + I + " -" + I + ",0 0,-" + I + "z ", oe += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', oe += F.scalable ? "" : ' width="' + J + 'px" height="' + J + 'px"', oe += ' viewBox="0 0 ' + J + " " + J + '" ', oe += ' preserveAspectRatio="xMinYMin meet"', oe += j.text || M.text ? ' role="img" aria-labelledby="' + dt([j.id, M.id].join(" ").trim()) + '"' : "", oe += ">", oe += j.text ? '<title id="' + dt(j.id) + '">' + dt(j.text) + "</title>" : "", oe += M.text ? '<description id="' + dt(M.id) + '">' + dt(M.text) + "</description>" : "", oe += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', oe += '<path d="', ge = 0; ge < S.getModuleCount(); ge += 1)
            for ($e = ge * I + L, ae = 0; ae < S.getModuleCount(); ae += 1)
              S.isDark(ge, ae) && (se = ae * I + L, oe += "M" + se + "," + $e + Ce);
          return oe += '" stroke="transparent" fill="black"/>', oe += "</svg>", oe;
        }, S.createDataURL = function(I, L) {
          I = I || 2, L = typeof L > "u" ? I * 4 : L;
          var M = S.getModuleCount() * I + L * 2, j = L, F = M - L;
          return b(M, M, function(J, ae) {
            if (j <= J && J < F && j <= ae && ae < F) {
              var se = Math.floor((J - j) / I), ge = Math.floor((ae - j) / I);
              return S.isDark(ge, se) ? 0 : 1;
            } else
              return 1;
          });
        }, S.createImgTag = function(I, L, M) {
          I = I || 2, L = typeof L > "u" ? I * 4 : L;
          var j = S.getModuleCount() * I + L * 2, F = "";
          return F += "<img", F += ' src="', F += S.createDataURL(I, L), F += '"', F += ' width="', F += j, F += '"', F += ' height="', F += j, F += '"', M && (F += ' alt="', F += dt(M), F += '"'), F += "/>", F;
        };
        var dt = function(I) {
          for (var L = "", M = 0; M < I.length; M += 1) {
            var j = I.charAt(M);
            switch (j) {
              case "<":
                L += "&lt;";
                break;
              case ">":
                L += "&gt;";
                break;
              case "&":
                L += "&amp;";
                break;
              case '"':
                L += "&quot;";
                break;
              default:
                L += j;
                break;
            }
          }
          return L;
        }, Ho = function(I) {
          var L = 1;
          I = typeof I > "u" ? L * 2 : I;
          var M = S.getModuleCount() * L + I * 2, j = I, F = M - I, J, ae, se, ge, $e, oe = {
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
          for (J = 0; J < M; J += 2) {
            for (se = Math.floor((J - j) / L), ge = Math.floor((J + 1 - j) / L), ae = 0; ae < M; ae += 1)
              $e = "█", j <= ae && ae < F && j <= J && J < F && S.isDark(se, Math.floor((ae - j) / L)) && ($e = " "), j <= ae && ae < F && j <= J + 1 && J + 1 < F && S.isDark(ge, Math.floor((ae - j) / L)) ? $e += " " : $e += "█", Oe += I < 1 && J + 1 >= F ? Ce[$e] : oe[$e];
            Oe += `
`;
          }
          return M % 2 && I > 0 ? Oe.substring(0, Oe.length - M - 1) + Array(M + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return S.createASCII = function(I, L) {
          if (I = I || 1, I < 2)
            return Ho(L);
          I -= 1, L = typeof L > "u" ? I * 2 : L;
          var M = S.getModuleCount() * I + L * 2, j = L, F = M - L, J, ae, se, ge, $e = Array(I + 1).join("██"), oe = Array(I + 1).join("  "), Ce = "", Oe = "";
          for (J = 0; J < M; J += 1) {
            for (se = Math.floor((J - j) / I), Oe = "", ae = 0; ae < M; ae += 1)
              ge = 1, j <= ae && ae < F && j <= J && J < F && S.isDark(se, Math.floor((ae - j) / I)) && (ge = 0), Oe += ge ? $e : oe;
            for (se = 0; se < I; se += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, S.renderTo2dContext = function(I, L) {
          L = L || 2;
          for (var M = S.getModuleCount(), j = 0; j < M; j++)
            for (var F = 0; F < M; F++)
              I.fillStyle = S.isDark(j, F) ? "black" : "white", I.fillRect(j * L, F * L, L, L);
        }, S;
      };
      s.stringToBytesFuncs = {
        default: function(v) {
          for (var N = [], T = 0; T < v.length; T += 1) {
            var W = v.charCodeAt(T);
            N.push(W & 255);
          }
          return N;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(v, N) {
        var T = (function() {
          for (var x = R(v), E = function() {
            var le = x.read();
            if (le == -1) throw "eof";
            return le;
          }, g = 0, h = {}; ; ) {
            var A = x.read();
            if (A == -1) break;
            var B = E(), S = E(), Y = E(), U = String.fromCharCode(A << 8 | B), ue = S << 8 | Y;
            h[U] = ue, g += 1;
          }
          if (g != N)
            throw g + " != " + N;
          return h;
        })(), W = 63;
        return function(x) {
          for (var E = [], g = 0; g < x.length; g += 1) {
            var h = x.charCodeAt(g);
            if (h < 128)
              E.push(h);
            else {
              var A = T[x.charAt(g)];
              typeof A == "number" ? (A & 255) == A ? E.push(A) : (E.push(A >>> 8), E.push(A & 255)) : E.push(W);
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
        ], N = 1335, T = 7973, W = 21522, x = {}, E = function(g) {
          for (var h = 0; g != 0; )
            h += 1, g >>>= 1;
          return h;
        };
        return x.getBCHTypeInfo = function(g) {
          for (var h = g << 10; E(h) - E(N) >= 0; )
            h ^= N << E(h) - E(N);
          return (g << 10 | h) ^ W;
        }, x.getBCHTypeNumber = function(g) {
          for (var h = g << 12; E(h) - E(T) >= 0; )
            h ^= T << E(h) - E(T);
          return g << 12 | h;
        }, x.getPatternPosition = function(g) {
          return v[g - 1];
        }, x.getMaskFunction = function(g) {
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
        }, x.getErrorCorrectPolynomial = function(g) {
          for (var h = u([1], 0), A = 0; A < g; A += 1)
            h = h.multiply(u([1, c.gexp(A)], 0));
          return h;
        }, x.getLengthInBits = function(g, h) {
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
        }, x.getLostPoint = function(g) {
          for (var h = g.getModuleCount(), A = 0, B = 0; B < h; B += 1)
            for (var S = 0; S < h; S += 1) {
              for (var Y = 0, U = g.isDark(B, S), ue = -1; ue <= 1; ue += 1)
                if (!(B + ue < 0 || h <= B + ue))
                  for (var le = -1; le <= 1; le += 1)
                    S + le < 0 || h <= S + le || ue == 0 && le == 0 || U == g.isDark(B + ue, S + le) && (Y += 1);
              Y > 5 && (A += 3 + Y - 5);
            }
          for (var B = 0; B < h - 1; B += 1)
            for (var S = 0; S < h - 1; S += 1) {
              var me = 0;
              g.isDark(B, S) && (me += 1), g.isDark(B + 1, S) && (me += 1), g.isDark(B, S + 1) && (me += 1), g.isDark(B + 1, S + 1) && (me += 1), (me == 0 || me == 4) && (A += 3);
            }
          for (var B = 0; B < h; B += 1)
            for (var S = 0; S < h - 6; S += 1)
              g.isDark(B, S) && !g.isDark(B, S + 1) && g.isDark(B, S + 2) && g.isDark(B, S + 3) && g.isDark(B, S + 4) && !g.isDark(B, S + 5) && g.isDark(B, S + 6) && (A += 40);
          for (var S = 0; S < h; S += 1)
            for (var B = 0; B < h - 6; B += 1)
              g.isDark(B, S) && !g.isDark(B + 1, S) && g.isDark(B + 2, S) && g.isDark(B + 3, S) && g.isDark(B + 4, S) && !g.isDark(B + 5, S) && g.isDark(B + 6, S) && (A += 40);
          for (var Se = 0, S = 0; S < h; S += 1)
            for (var B = 0; B < h; B += 1)
              g.isDark(B, S) && (Se += 1);
          var qe = Math.abs(100 * Se / h / h - 50) / 5;
          return A += qe * 10, A;
        }, x;
      })(), c = (function() {
        for (var v = new Array(256), N = new Array(256), T = 0; T < 8; T += 1)
          v[T] = 1 << T;
        for (var T = 8; T < 256; T += 1)
          v[T] = v[T - 4] ^ v[T - 5] ^ v[T - 6] ^ v[T - 8];
        for (var T = 0; T < 255; T += 1)
          N[v[T]] = T;
        var W = {};
        return W.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return N[x];
        }, W.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return v[x];
        }, W;
      })();
      function u(v, N) {
        if (typeof v.length > "u")
          throw v.length + "/" + N;
        var T = (function() {
          for (var x = 0; x < v.length && v[x] == 0; )
            x += 1;
          for (var E = new Array(v.length - x + N), g = 0; g < v.length - x; g += 1)
            E[g] = v[g + x];
          return E;
        })(), W = {};
        return W.getAt = function(x) {
          return T[x];
        }, W.getLength = function() {
          return T.length;
        }, W.multiply = function(x) {
          for (var E = new Array(W.getLength() + x.getLength() - 1), g = 0; g < W.getLength(); g += 1)
            for (var h = 0; h < x.getLength(); h += 1)
              E[g + h] ^= c.gexp(c.glog(W.getAt(g)) + c.glog(x.getAt(h)));
          return u(E, 0);
        }, W.mod = function(x) {
          if (W.getLength() - x.getLength() < 0)
            return W;
          for (var E = c.glog(W.getAt(0)) - c.glog(x.getAt(0)), g = new Array(W.getLength()), h = 0; h < W.getLength(); h += 1)
            g[h] = W.getAt(h);
          for (var h = 0; h < x.getLength(); h += 1)
            g[h] ^= c.gexp(c.glog(x.getAt(h)) + E);
          return u(g, 0).mod(x);
        }, W;
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
        ], N = function(x, E) {
          var g = {};
          return g.totalCount = x, g.dataCount = E, g;
        }, T = {}, W = function(x, E) {
          switch (E) {
            case o.L:
              return v[(x - 1) * 4 + 0];
            case o.M:
              return v[(x - 1) * 4 + 1];
            case o.Q:
              return v[(x - 1) * 4 + 2];
            case o.H:
              return v[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return T.getRSBlocks = function(x, E) {
          var g = W(x, E);
          if (typeof g > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + E;
          for (var h = g.length / 3, A = [], B = 0; B < h; B += 1)
            for (var S = g[B * 3 + 0], Y = g[B * 3 + 1], U = g[B * 3 + 2], ue = 0; ue < S; ue += 1)
              A.push(N(Y, U));
          return A;
        }, T;
      })(), m = function() {
        var v = [], N = 0, T = {};
        return T.getBuffer = function() {
          return v;
        }, T.getAt = function(W) {
          var x = Math.floor(W / 8);
          return (v[x] >>> 7 - W % 8 & 1) == 1;
        }, T.put = function(W, x) {
          for (var E = 0; E < x; E += 1)
            T.putBit((W >>> x - E - 1 & 1) == 1);
        }, T.getLengthInBits = function() {
          return N;
        }, T.putBit = function(W) {
          var x = Math.floor(N / 8);
          v.length <= x && v.push(0), W && (v[x] |= 128 >>> N % 8), N += 1;
        }, T;
      }, w = function(v) {
        var N = a.MODE_NUMBER, T = v, W = {};
        W.getMode = function() {
          return N;
        }, W.getLength = function(g) {
          return T.length;
        }, W.write = function(g) {
          for (var h = T, A = 0; A + 2 < h.length; )
            g.put(x(h.substring(A, A + 3)), 10), A += 3;
          A < h.length && (h.length - A == 1 ? g.put(x(h.substring(A, A + 1)), 4) : h.length - A == 2 && g.put(x(h.substring(A, A + 2)), 7));
        };
        var x = function(g) {
          for (var h = 0, A = 0; A < g.length; A += 1)
            h = h * 10 + E(g.charAt(A));
          return h;
        }, E = function(g) {
          if ("0" <= g && g <= "9")
            return g.charCodeAt(0) - 48;
          throw "illegal char :" + g;
        };
        return W;
      }, $ = function(v) {
        var N = a.MODE_ALPHA_NUM, T = v, W = {};
        W.getMode = function() {
          return N;
        }, W.getLength = function(E) {
          return T.length;
        }, W.write = function(E) {
          for (var g = T, h = 0; h + 1 < g.length; )
            E.put(
              x(g.charAt(h)) * 45 + x(g.charAt(h + 1)),
              11
            ), h += 2;
          h < g.length && E.put(x(g.charAt(h)), 6);
        };
        var x = function(E) {
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
        return W;
      }, D = function(v) {
        var N = a.MODE_8BIT_BYTE, T = s.stringToBytes(v), W = {};
        return W.getMode = function() {
          return N;
        }, W.getLength = function(x) {
          return T.length;
        }, W.write = function(x) {
          for (var E = 0; E < T.length; E += 1)
            x.put(T[E], 8);
        }, W;
      }, _ = function(v) {
        var N = a.MODE_KANJI, T = s.stringToBytesFuncs.SJIS;
        if (!T)
          throw "sjis not supported.";
        (function(E, g) {
          var h = T(E);
          if (h.length != 2 || (h[0] << 8 | h[1]) != g)
            throw "sjis not supported.";
        })("友", 38726);
        var W = T(v), x = {};
        return x.getMode = function() {
          return N;
        }, x.getLength = function(E) {
          return ~~(W.length / 2);
        }, x.write = function(E) {
          for (var g = W, h = 0; h + 1 < g.length; ) {
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
        }, x;
      }, y = function() {
        var v = [], N = {};
        return N.writeByte = function(T) {
          v.push(T & 255);
        }, N.writeShort = function(T) {
          N.writeByte(T), N.writeByte(T >>> 8);
        }, N.writeBytes = function(T, W, x) {
          W = W || 0, x = x || T.length;
          for (var E = 0; E < x; E += 1)
            N.writeByte(T[E + W]);
        }, N.writeString = function(T) {
          for (var W = 0; W < T.length; W += 1)
            N.writeByte(T.charCodeAt(W));
        }, N.toByteArray = function() {
          return v;
        }, N.toString = function() {
          var T = "";
          T += "[";
          for (var W = 0; W < v.length; W += 1)
            W > 0 && (T += ","), T += v[W];
          return T += "]", T;
        }, N;
      }, C = function() {
        var v = 0, N = 0, T = 0, W = "", x = {}, E = function(h) {
          W += String.fromCharCode(g(h & 63));
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
        return x.writeByte = function(h) {
          for (v = v << 8 | h & 255, N += 8, T += 1; N >= 6; )
            E(v >>> N - 6), N -= 6;
        }, x.flush = function() {
          if (N > 0 && (E(v << 6 - N), v = 0, N = 0), T % 3 != 0)
            for (var h = 3 - T % 3, A = 0; A < h; A += 1)
              W += "=";
        }, x.toString = function() {
          return W;
        }, x;
      }, R = function(v) {
        var N = v, T = 0, W = 0, x = 0, E = {};
        E.read = function() {
          for (; x < 8; ) {
            if (T >= N.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var h = N.charAt(T);
            if (T += 1, h == "=")
              return x = 0, -1;
            if (h.match(/^\s$/))
              continue;
            W = W << 6 | g(h.charCodeAt(0)), x += 6;
          }
          var A = W >>> x - 8 & 255;
          return x -= 8, A;
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
      }, te = function(v, N) {
        var T = v, W = N, x = new Array(v * N), E = {};
        E.setPixel = function(B, S, Y) {
          x[S * T + B] = Y;
        }, E.write = function(B) {
          B.writeString("GIF87a"), B.writeShort(T), B.writeShort(W), B.writeByte(128), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(255), B.writeByte(255), B.writeByte(255), B.writeString(","), B.writeShort(0), B.writeShort(0), B.writeShort(T), B.writeShort(W), B.writeByte(0);
          var S = 2, Y = h(S);
          B.writeByte(S);
          for (var U = 0; Y.length - U > 255; )
            B.writeByte(255), B.writeBytes(Y, U, 255), U += 255;
          B.writeByte(Y.length - U), B.writeBytes(Y, U, Y.length - U), B.writeByte(0), B.writeString(";");
        };
        var g = function(B) {
          var S = B, Y = 0, U = 0, ue = {};
          return ue.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; Y + me >= 8; )
              S.writeByte(255 & (le << Y | U)), me -= 8 - Y, le >>>= 8 - Y, U = 0, Y = 0;
            U = le << Y | U, Y = Y + me;
          }, ue.flush = function() {
            Y > 0 && S.writeByte(U);
          }, ue;
        }, h = function(B) {
          for (var S = 1 << B, Y = (1 << B) + 1, U = B + 1, ue = A(), le = 0; le < S; le += 1)
            ue.add(String.fromCharCode(le));
          ue.add(String.fromCharCode(S)), ue.add(String.fromCharCode(Y));
          var me = y(), Se = g(me);
          Se.write(S, U);
          var qe = 0, We = String.fromCharCode(x[qe]);
          for (qe += 1; qe < x.length; ) {
            var ut = String.fromCharCode(x[qe]);
            qe += 1, ue.contains(We + ut) ? We = We + ut : (Se.write(ue.indexOf(We), U), ue.size() < 4095 && (ue.size() == 1 << U && (U += 1), ue.add(We + ut)), We = ut);
          }
          return Se.write(ue.indexOf(We), U), Se.write(Y, U), Se.flush(), me.toByteArray();
        }, A = function() {
          var B = {}, S = 0, Y = {};
          return Y.add = function(U) {
            if (Y.contains(U))
              throw "dup key:" + U;
            B[U] = S, S += 1;
          }, Y.size = function() {
            return S;
          }, Y.indexOf = function(U) {
            return B[U];
          }, Y.contains = function(U) {
            return typeof B[U] < "u";
          }, Y;
        };
        return E;
      }, b = function(v, N, T) {
        for (var W = te(v, N), x = 0; x < N; x += 1)
          for (var E = 0; E < v; E += 1)
            W.setPixel(E, x, T(E, x));
        var g = y();
        W.write(g);
        for (var h = C(), A = g.toByteArray(), B = 0; B < A.length; B += 1)
          h.writeByte(A[B]);
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
var bv = kv();
const $v = /* @__PURE__ */ wv(bv), xv = ["width", "height", "viewBox"], Mv = ["width", "height"], _v = ["d"], Sv = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = O(() => {
      const s = $v(0, "M");
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
      }, null, 8, Mv),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, _v)
    ], 8, xv));
  }
}, Ny = /* @__PURE__ */ Z(Sv, [["__scopeId", "data-v-489f0852"]]), jy = tr(() => import("./VoiceFigure-D11cMzMj.js").then((e) => e.V)), Py = "1.0.0", qy = "3.5";
export {
  Bv as $,
  ty as A,
  Je as B,
  dy as C,
  Qv as D,
  uy as E,
  zv as F,
  No as G,
  Rm as H,
  Bm as I,
  vy as J,
  kt as K,
  iy as L,
  Te as M,
  St as N,
  sy as O,
  bn as P,
  ay as Q,
  gp as R,
  Eo as S,
  ey as T,
  cy as U,
  ha as V,
  ym as W,
  dm as X,
  yy as Y,
  hy as Z,
  Z as _,
  ie as a,
  Ih as a$,
  Ey as a0,
  ye as a1,
  ys as a2,
  Iv as a3,
  Yu as a4,
  Ly as a5,
  Uv as a6,
  tn as a7,
  ky as a8,
  Av as a9,
  qo as aA,
  st as aB,
  Bh as aC,
  jy as aD,
  je as aE,
  el as aF,
  Yn as aG,
  By as aH,
  Ty as aI,
  Iy as aJ,
  Hv as aK,
  Wv as aL,
  Pv as aM,
  $y as aN,
  by as aO,
  d1 as aP,
  Tv as aQ,
  it as aR,
  Lv as aS,
  jv as aT,
  Sy as aU,
  xy as aV,
  Cy as aW,
  zg as aX,
  vg as aY,
  vo as aZ,
  My as a_,
  Tt as aa,
  xe as ab,
  Py as ac,
  qy as ad,
  Ay as ae,
  rs as af,
  qv as ag,
  y1 as ah,
  Pg as ai,
  Hg as aj,
  Kg as ak,
  Rv as al,
  $r as am,
  Ry as an,
  Dv as ao,
  Ny as ap,
  _y as aq,
  zr as ar,
  Cv as as,
  Fv as at,
  as as au,
  wt as av,
  Nv as aw,
  Ov as ax,
  gs as ay,
  Dy as az,
  Ze as b,
  vs as b0,
  Oy as b1,
  ny as c,
  Kv as d,
  Yv as e,
  Gv as f,
  py as g,
  bo as h,
  oy as i,
  ry as j,
  ly as k,
  my as l,
  Jv as m,
  Vv as n,
  Zv as o,
  un as p,
  wy as q,
  fy as r,
  Xv as s,
  De as t,
  um as u,
  gy as v,
  fm as w,
  Ss as x,
  Lp as y,
  Dp as z
};
