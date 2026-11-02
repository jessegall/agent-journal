/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as $e, createElementVNode as p, normalizeClass as ee, Fragment as Z, renderList as re, normalizeStyle as we, defineComponent as qo, Comment as Wo, h as ds, cloneVNode as Fo, createBlock as Y, withCtx as V, unref as z, createVNode as H, toDisplayString as b, createCommentVNode as j, inject as je, computed as I, resolveDynamicComponent as ot, Transition as un, watch as ke, ref as W, shallowRef as dn, TransitionGroup as Ho, mergeProps as at, reactive as hs, createTextVNode as he, onMounted as De, onUnmounted as Se, nextTick as hn, useId as va, Teleport as ya, withModifiers as _e, isRef as Cs, resolveDirective as Uo, withDirectives as mt, useModel as Un, useAttrs as wa, getCurrentInstance as Vo, mergeModels as Vn, getCurrentScope as ka, onScopeDispose as ba, onBeforeUnmount as Tt, provide as zo, onErrorCaptured as Ko, toHandlers as Go, createSlots as Yo, withKeys as Jt, vModelText as zn, defineAsyncComponent as Jo } from "vue";
const J = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Zo = { class: "skeleton-line" }, Xo = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", Zo, [
      $e(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: ee(["bars", { faded: e.filled }])
      }, [
        (l(!0), d(Z, null, re(e.bars, (s) => (l(), d("span", {
          key: s.width,
          class: ee(["bar", { still: e.still }]),
          style: we({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Qe = /* @__PURE__ */ J(Xo, [["__scopeId", "data-v-0ebb6933"]]), fs = qo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Wo);
      return s.length !== 1 ? ds(Z, { key: n }, s) : s[0].key == null ? Fo(s[0], { key: n }) : s[0];
    };
  }
}), Qo = ["aria-label"], er = ["aria-label"], tr = ["aria-label"], nr = ["aria-label"], sr = ["aria-label"], ar = ["aria-label"], or = ["aria-label"], rr = {
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
    return (c, u) => (l(), Y(fs, { value: e.shape }, {
      messages: V(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), d(Z, null, re(t, (f) => p("div", {
            key: f.id,
            class: ee(["skeleton-message", { mine: f.mine }]),
            style: we({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, Qo)
      ]),
      older: V(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(t.slice(0, 3), (f) => (l(), d("div", {
            key: f.id,
            class: ee(["skeleton-message", { mine: f.mine }]),
            style: we({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, er)
      ]),
      cards: V(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (l(), d(Z, null, re(n, (m) => H(Qe, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, tr)
      ]),
      file: V(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            H(Qe, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), d(Z, null, re(a, (m) => H(Qe, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, nr)
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
          (l(!0), d(Z, null, re(e.count, (f) => (l(), Y(Qe, {
            key: f,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, sr)
      ]),
      text: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (f) => (l(), Y(Qe, {
            key: f,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ar)
      ]),
      default: V(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (f) => (l(), Y(Qe, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, or)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, vt = /* @__PURE__ */ J(rr, [["__scopeId", "data-v-c687fb85"]]), ir = {
  key: 1,
  class: "empty-state titled"
}, lr = { class: "empty-state-title" }, cr = { class: "empty-state-text" }, ur = {
  key: 2,
  class: "empty-state"
}, dr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), Y(vt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", ir, [
      p("p", lr, b(e.title), 1),
      p("p", cr, [
        $e(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", ur, [
      $e(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Zt = /* @__PURE__ */ J(dr, [["__scopeId", "data-v-b27e89b0"]]), hr = { class: "fold-group" }, fr = ["aria-expanded"], pr = { class: "fold-label" }, mr = {
  key: 0,
  class: "fold-count"
}, gr = {
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
    return (s, a) => (l(), d("div", hr, [
      p("button", {
        type: "button",
        class: ee(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", pr, b(e.label), 1),
        e.count !== "" ? (l(), d("span", mr, b(e.count), 1)) : j("", !0),
        p("span", {
          class: ee(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, fr),
      e.open ? $e(s.$slots, "default", {}, void 0, !0, 0) : j("", !0)
    ]));
  }
}, ov = /* @__PURE__ */ J(gr, [["__scopeId", "data-v-9ef1865c"]]), vr = Symbol("open-view"), Pe = Symbol.for("journal.window-context");
function ps() {
  const e = je(Pe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const yr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: we({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, wr = /* @__PURE__ */ J(yr, [["__scopeId", "data-v-eb453d6f"]]), kr = {
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
      return t.busy || t.disabled || !!((s = je(Pe, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), Y(ot(e.href ? "a" : "button"), {
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
        e.busy ? (l(), Y(wr, {
          key: 0,
          class: "btn-spinner"
        })) : j("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ J(kr, [["__scopeId", "data-v-a2dc4bda"]]), br = {
  class: "running",
  "data-running-command": ""
}, $r = ["title"], xr = {
  key: "idle",
  class: "running-idle"
}, _r = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", br, [
      H(un, {
        name: "roll",
        mode: "out-in"
      }, {
        default: V(() => [
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, $r)) : (l(), d("span", xr, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, rv = /* @__PURE__ */ J(_r, [["__scopeId", "data-v-d3240219"]]), Mr = ["aria-checked", "aria-label", "title"], Sr = {
  key: 0,
  class: "switch-inner"
}, Er = {
  key: 0,
  class: "switch-word"
}, Ar = {
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
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: ee(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (l(), d("span", Sr, b(e.word), 1)) : j("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Er, b(e.word), 1)) : j("", !0)
    ], 10, Mr));
  }
}, iv = /* @__PURE__ */ J(Ar, [["__scopeId", "data-v-1bfb90f3"]]);
function $a(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function At(e, t) {
  return $a(() => localStorage, e, t);
}
function xa(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function fn(e, t) {
  return xa(() => localStorage, e, t);
}
function _a(e, t) {
  ke(t, (n) => fn(e, n), { deep: !0 });
}
function Cr(e, t) {
  return $a(() => sessionStorage, e, t);
}
function Or(e, t) {
  return xa(() => sessionStorage, e, t);
}
const Xt = "journal.environment", Ma = W(Cr(Xt, At(Xt, "")));
function Tr(e) {
  Ma.value = e, Or(Xt, e), fn(Xt, e);
}
const Qt = W(location.hash), Os = dn(null), Ts = { integrations: "mcp", library: "team" };
function Br() {
  if (!Os.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ts[n]) {
    location.replace(`#/${[Ts[n], ...s].join("/")}${t ? `?${t}` : ""}`), Qt.value = location.hash;
    return;
  }
  !n || Os.value(n) || (Tr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Qt.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Qt.value = location.hash, Br();
});
const Ne = I(() => {
  const [e, t = ""] = Qt.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", f = "", m = ""] = i.split(":");
    return { table: u, id: Number(f), comment: Number(m) || 0, env: c };
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
}), pn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${pn.page(e)}?open=${t}`
};
function Ir(e = "", t = 0, n = "") {
  location.hash = pn.page(e, t, n);
}
const Lr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Sa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Lr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const ft = {};
function lv(e, t) {
  return ft[e] = t, () => ft[e] === t && delete ft[e];
}
function Ea(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = ft[e]) != null && r.call(ft, t))) return;
  const a = Ne.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Sa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Rr(e, t, n, s = 0, a = "") {
  if (e === Ne.value.env) return Ea(t, n, s, a);
  const o = Ne.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Sa([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function yt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Rr(s, a, Number(o), 0, t) : Ea(a, Number(o), 0, t);
}
function Dr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function ht(e) {
  const t = Dr(e);
  t && yt(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Nr = ["stroke-width", "innerHTML"], Me = {
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
    }, null, 12, Nr));
  }
}, ms = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), Y(ye, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: V(() => [
        H(Me, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, jr = {
  key: 1,
  class: "row-list-failure"
}, Pr = ["data-row"], qr = {
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
    return (o, r) => !e.loaded && !e.failure ? (l(), Y(vt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", jr, b(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), Y(Zt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(Z, { key: 3 }, [
      (l(), Y(ot(e.arrival ? Ho : "ul"), at(n.value, { class: "row-list" }), {
        default: V(() => [
          (l(!0), d(Z, null, re(e.rows, (i) => (l(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            $e(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Pr))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : j("", !0)
    ], 64));
  }
}, Wr = /* @__PURE__ */ J(qr, [["__scopeId", "data-v-7f34ada7"]]), Fr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Hr = {
  key: 1,
  class: "agent-rows-note"
}, Ur = {
  key: 2,
  class: "agent-rows-note"
}, Vr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, zr = ["data-agent-row", "onClick"], Kr = { class: "agent-row-name" }, Gr = { class: "agent-row-state" }, Yr = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = I(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", Fr, [
      e.loaded ? e.failure ? (l(), d("p", Hr, b(e.failure), 1)) : e.rows.length ? (l(), d(Z, { key: 3 }, [
        p("p", Vr, b(s.value) + " running", 1),
        (l(!0), d(Z, null, re(n.value, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(yt)(`agents:${r.id}`)
        }, [
          p("span", Kr, "#" + b(r.id) + " " + b(r.session), 1),
          p("span", Gr, b(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, zr))), 128))
      ], 64)) : (l(), d("p", Ur, b(e.none), 1)) : (l(), Y(vt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, cv = /* @__PURE__ */ J(Yr, [["__scopeId", "data-v-a01e5a17"]]), Jr = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["badge", e.tone])
    }, b(e.text), 3));
  }
}, Aa = /* @__PURE__ */ J(Jr, [["__scopeId", "data-v-9e7e1157"]]), Zr = ["aria-valuenow", "aria-valuemax"], Xr = {
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
    return (s, a) => (l(), d("span", {
      class: ee(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: we({ width: n.value })
      }, null, 4)
    ], 10, Zr));
  }
}, Qr = /* @__PURE__ */ J(Xr, [["__scopeId", "data-v-9eba6a85"]]), ei = { class: "bars" }, ti = { class: "bar-name" }, ni = { class: "bar-value" }, si = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", ei, [
      (l(!0), d(Z, null, re(e.items, (c, u) => (l(), Y(ot(c.open ? "button" : "div"), {
        key: `${u}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: ee(["bar-row", c.tone, { opens: c.open }]),
        onClick: (f) => c.open && s("open", c.open)
      }, {
        default: V(() => [
          p("span", ti, b(c.label), 1),
          H(Qr, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", ni, b(c.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ai = /* @__PURE__ */ J(si, [["__scopeId", "data-v-663427f4"]]), oi = { class: "bars" }, ri = {
  key: 0,
  class: "bars-title"
}, ii = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", oi, [
      e.node.title ? (l(), d("span", ri, b(e.node.title), 1)) : j("", !0),
      H(ai, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, li = /* @__PURE__ */ J(ii, [["__scopeId", "data-v-7135bb11"]]), ci = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = I(() => n[s.node.type](s.node));
    return (r, i) => (l(), d("div", {
      class: ee([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: we(o.value)
    }, [
      (l(!0), d(Z, null, re(e.node.children || [], (c, u) => (l(), Y(no, {
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (f) => a("open", f)),
        onFile: i[1] || (i[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, zt = /* @__PURE__ */ J(ci, [["__scopeId", "data-v-d142a3f4"]]), ui = {
  key: 0,
  class: "card-head"
}, di = { class: "card-title" }, hi = {
  key: 0,
  class: "card-note"
}, fi = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: ee(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), d("header", ui, [
        p("span", di, b(e.node.title), 1),
        e.node.note ? (l(), d("span", hi, b(e.node.note), 1)) : j("", !0)
      ])) : j("", !0),
      H(zt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, pi = /* @__PURE__ */ J(fi, [["__scopeId", "data-v-67b72d40"]]), mi = (e, t, n) => Math.max(t, Math.min(n, e)), gi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, xe = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Bs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", $n = 80;
function Is(e) {
  return e.length <= $n ? e : `${e.slice(0, $n + 1).replace(/\s+\S*$/, "") || e.slice(0, $n)}…`;
}
const Ls = {
  messages: (e) => Is(Bs(e.text)),
  comments: (e) => Is(Bs(e.text)),
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
}, vi = (e) => (Ls[e.table] ? Ls[e.table](e) : e.title || "") || "", yi = ["done", "cancelled"], Kn = {
  tasks: (e) => xe(e.completed_at) || (e.state === "cancelled" ? xe(e.updated_at) : 0),
  questions: (e) => e.answer ? xe(e.updated_at) : 0,
  plans: (e) => yi.includes(e.state) ? xe(e.updated_at) : 0,
  notices: (e) => xe(e.closed_at),
  secrets: (e) => xe(e.deleted_at),
  workers: (e) => e.state === "stopped" ? xe(e.updated_at) : 0,
  shares: (e) => xe(e.stopped_at),
  dumps: (e) => xe(e.completed_at),
  agents: (e) => e.state === "ended" ? xe(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? xe(e.created_at) : 0
}, wi = (e) => Kn[e.table] ? Kn[e.table](e) : 0, Ca = (e) => wi(e) > 0, ki = (e) => !!Kn[e], Oa = (e) => xe(e.created_at), en = (e) => xe(e.updated_at) || Oa(e), bi = (e) => "task_ids" in e, mn = typeof document < "u" && document.documentElement.classList.contains("phone"), $i = "Files are attached on the computer; the phone sends text.", Ta = 1024, xi = Ta * 1024 * 1024, _i = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ta} MB limit for one file.`;
function Mi() {
  return () => {
  };
}
function Rs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Si(e = window) {
  if (!Rs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Rs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ba = "status.summary", ve = hs({
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
}), Ei = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Ia = () => !!ve.countdown || Ei() || ve.starting;
function Ai(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function Ci(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Oi() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Ti(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Oi(), !0);
}
let jt = { version: "", started: 0 };
function Bi(e) {
  return e.version ? (jt.version || (jt = { version: e.version, started: e.started || 0 }), e.version !== jt.version || (e.started || 0) !== jt.started) : !1;
}
function Ii(e) {
  Ci(e.countdown), Ai(e.ready, e.step), (Ti(!!e.updating, e.step) || !e.updating && !Li(e) && Bi(e)) && Si(window);
}
const Li = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Ds = 2e4, Ri = 3e5, Fe = 6e5, Pt = 6, Di = 500, Ni = "/journal/summary", Ns = mn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, ji = (e) => e.split("?")[0].endsWith(Ni), La = (e, t) => Object.assign(new Error(t), { status: e });
async function Pi(e, t, n = La) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const qi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Wi {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Pt;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Pt;
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
        headers: { ...Ns, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: qi(s),
        signal: AbortSignal.timeout(a || (i ? Ri : Ds))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, Di)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Pt, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Mi(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Pi(c, `${c.status} ${c.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ns, signal: AbortSignal.timeout(Ds) });
    if (!n.ok) throw La(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Pt, o).then((c) => (this.written(n), c));
    if (Ia() && !ji(n))
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
const Re = new Wi(), Ae = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const bt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), $t = "the page does not know its environment yet", Fi = "X-Journal-Env", Hi = "X-Journal-Request-At", xn = "/viewer/voices/figures/";
class gs {
  constructor({ env: t = () => Ne.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new gs({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Hi]: String(Date.now()), ...this.env() ? { [Fi]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === $t ? Promise.reject(new Error($t)) : Re.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === $t ? Promise.reject(new Error($t)) : Re.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : $t;
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
    return Re.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: c = !1, docked: u = !1 } = {}) {
    const f = this.here(`/${t}${ue({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: c ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(f, `${t}.${bt({ before: s, after: a, since: o, ids: r, tasks: i, closed: c, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${bt({ before: s, since: a, docked: o })}`);
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
    if (mn) return Promise.reject(Object.assign(new Error($i), { status: 403 }));
    if (s.size > xi) return Promise.reject(new Error(_i(s)));
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
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${bt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${bt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${bt(n)}`);
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
    return this.post("/team/connect", t, Fe);
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
    return `${this.base}/${t ? `?env=${Ae(t)}` : ""}${pn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ie = new gs({ base: mn ? "/p" : "" }), Ui = (e) => Re.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Vi = { claude: "Claude Code", codex: "Codex" };
Object.entries(Vi).map(([e, t]) => ({ key: e, label: t }));
const js = (e) => e.status === "stopped" ? 1 : 0, zi = "main", Ki = (e) => e.filter((t) => t.role === zi).sort((t, n) => js(t) - js(n) || xe(n.heard_at) - xe(t.heard_at))[0] || null, Gi = { me: 1, people: [] }, K = hs({
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
  activity: At("journal.activity", !0),
  wide: !1,
  sideMini: At("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
_a("journal.activity", () => K.activity);
_a("journal.side.mini", () => K.sideMini);
const gt = I(() => Ki(K.agents));
I(() => !!gt.value && K.live.some((e) => e.agent.session === gt.value.session && e.environment === Ne.value.env));
I(() => !!gt.value && ["busy", "working"].includes(gt.value.status));
function Yi(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Gn(e) {
  const t = Yi(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Ra(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Ps(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const _n = (e) => String(e).padStart(2, "0");
function Ji(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${_n(t % 60)}s` : `${Math.floor(t / 3600)}h ${_n(Math.floor(t % 3600 / 60))}m ${_n(t % 60)}s`;
}
const Zi = ["working", "busy", "waiting", "compacting"], Xi = (e) => Zi.includes(e), Qi = "builder";
I(() => !K.settings || K.settings.features.file_feed !== !1);
const el = I(() => !K.settings || K.settings.features.status_bar !== !1);
I(() => K.settings && K.settings.workers && K.settings.workers.mode || Qi);
I(() => !K.settings || !K.settings.tasks || K.settings.tasks.auto !== !1);
I(() => !!(K.settings && K.settings.reviewing && K.settings.reviewing.reviewer));
I(() => !K.settings || K.settings.features.sharing !== !1);
const tn = 50, vs = 100, tl = { messages: 25 }, Le = (e) => tl[e] || tn;
function nl(e, t) {
  if (e !== "messages") return Math.max(t.length - Le(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Le(e)) return s;
  return 0;
}
const sl = "review_step", al = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === sl).sort((t, n) => t.id - n.id), ol = 5, rl = 500, il = 3e3, ll = () => K.entries.length ? K.entries[K.entries.length - 1].id : 0, Kt = { env: "", id: 0 }, cl = () => !!(K.bar && K.bar.length) || Xi(gt.value && gt.value.status);
function ul({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function dl() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: vs })))).then(al);
}
function hl() {
  return Kt.env !== ie.env() && Object.assign(Kt, { env: ie.env(), id: ll() }), ie.entries(Kt.id);
}
function fl(e) {
  e.length && (Kt.id = e[e.length - 1].id, ac(e));
}
async function pl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", tn);
}
const Yn = /* @__PURE__ */ new Map();
async function Jn(e, t) {
  const n = `${e}:${ie.env()}`, s = Yn.get(n);
  if (!s) return qs(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(en)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ie.list("workers", { limit: t, since: a, after: o });
  if (!r.is_last_page)
    return Yn.delete(n), Jn(e, t);
  const i = new Set(r.rows.map((c) => c.id));
  return qs(
    n,
    [...s.filter((c) => !i.has(c.id)), ...r.rows].sort((c, u) => c.id - u.id)
  );
}
const qs = (e, t) => (Yn.set(e, t), t);
async function Ws(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Fs = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => cl() ? rl : il,
    take: (e) => Array.isArray(e) && (K.bar = e),
    active: () => el.value
  },
  "agents.index": { read: () => Ws(ie, ol), every: 1e3, take: (e) => K.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => K.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      K.summary = e, Ii(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => K.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => K.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (K.people = e) },
  "entries.recent": { read: hl, every: 1e3, take: fl },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: ul, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Jn("workers.index", Le("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Jn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: dl, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Le("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: pl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Ws(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
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
}), ml = 6e4, gl = 3e3, vl = 4, yl = 300, wl = 5e3, Da = /* @__PURE__ */ new Map();
function gn(e) {
  if (!(e in Fs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Fs[e];
}
function kl(e) {
  const t = gn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return wl;
  }
}
const bl = (e) => e / 2 + Math.random() * e / 2, Na = (e) => [...e.users.values()].pop(), ys = (e) => Da.get(e.place) === e, $l = () => Math.random() * yl, ws = () => document.hidden;
function xl(e) {
  const t = kl(e);
  return e.failures ? bl(Math.min(e.key === Ba ? gl : ml, t * 2 ** e.failures)) : Math.max(t, vl * e.took);
}
function ja(e, t) {
  clearTimeout(e.timer), !(!ys(e) || e.paused || ws()) && (e.timer = setTimeout(() => _l(e), t));
}
function _l(e) {
  return ys(e) ? e.running ? (e.again = !0, e.running) : (e.running = Al(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Ml = (e) => {
  var t, n;
  return !e.paused && !ws() && (((n = (t = gn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Na(e).active() && (!Ia() || e.key === Ba);
};
async function Sl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Re.attemptOnce(() => gn(e.key).read(Na(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function El(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = gn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Al(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Ml(e) && El(e, await Sl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ys(e) && !e.paused);
  ja(e, xl(e));
}
const Cl = () => ws() || Da.forEach((e) => ja(e, $l()));
document.addEventListener("visibilitychange", Cl);
const Ol = 60, Tl = (e, t) => xe(e.created_at) >= xe(t.created_at) - Ol, Bl = (e, t) => e.id > 0 && e.table === t.table && Tl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ks = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Bl(s, n))), Mn = [
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
}), Bt = {
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
    filters: Mn
  }),
  tasks: fe("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Mn
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
  notices: fe("Notice", "band", "One line pinned to the chat while it matters", { filters: Mn }),
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
}, Il = ["secrets", "plugins"], Pa = Object.keys(Bt).filter((e) => !(mn && Il.includes(e)));
I(() => Pa.map((e) => ({ name: e, ...Bt[e] })));
const vn = (e) => Bt[e], qa = new Map(Pa.flatMap((e) => [e, e.replace(/s$/, ""), Bt[e].title.toLowerCase()].map((t) => [t, e]))), pt = (e) => qa.get(String(e).toLowerCase()) || "", Wa = [...qa.keys()].sort((e, t) => t.length - e.length).join("|"), Ze = /* @__PURE__ */ new Set(), bs = W(0), It = /* @__PURE__ */ new Set(), Lt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Zn = /* @__PURE__ */ new Set(), Ll = /* @__PURE__ */ new Map(), Rl = /* @__PURE__ */ new Map();
let dt = !1, xt = null;
const Dl = (e, t) => e.id - t.id, Nl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, jl = { messages: Nl }, Fa = (e) => jl[e] || Dl;
function Ha(e) {
  return bs.value, Ze.has(e) || (Ze.add(e), K.booted && (!It.has(e) || Lt.has(e)) && queueMicrotask(() => wn([e], !1))), K.rows[e] || [];
}
function Pl(e) {
  const t = K.rows[e] || [], n = nl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  K.rows[e] = t.filter((a) => s.has(a) || ki(e) && !Ca(a)), K.paging.size[e] = Le(e), K.paging.more[e] = !0;
}
const ql = /* @__PURE__ */ new Set();
function Wl() {
  Ze.forEach(Pl), Ze.clear(), Ll.clear(), Rl.clear(), bs.value += 1;
}
ke(() => `${Ne.value.env}/${Ne.value.page}/${Ne.value.open ? Ne.value.open.table : ""}`, Wl);
ke(
  () => K.booted,
  (e) => e && wn(
    [...Ze].filter((t) => !It.has(t)),
    !1
  )
);
const Xn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !bi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Ua(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Xn(s) && !Xn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Va(e, t) {
  It.add(e), bs.value += 1;
  const n = K.rows[e] || [];
  K.rows[e] = [...Ua(n, t.rows), ...ks(n.filter((s) => s.id === 0), t.rows)], K.paging.size[e] = K.paging.size[e] || Le(e), K.paging.more[e] = !t.is_last_page;
}
async function Fl(e) {
  const t = new Set((K.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Le(e) });
  yn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ks((K.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Va(e, { ...n, rows: [...n.rows, ...a].sort(Fa(e)) }), K.paging.size[e] = Le(e), za.has(e) && await Ka(e), K.rows[e];
}
const yn = (e, t) => K.counts = { ...K.counts, [e]: t };
async function Hl(e) {
  const t = K.rows[e] || [], n = Math.max(0, ...t.map(en)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ie.list(e, { limit: Le(e), since: n, after: s });
  if (yn(e, a.counts), !a.is_last_page) return Fl(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = ks(t.filter((i) => !o.has(i.id)), a.rows).concat(Ua(t, a.rows));
  return K.rows[e] = r.sort(Fa(e)), K.paging.size[e] = K.rows[e].length, K.rows[e];
}
const Sn = /* @__PURE__ */ new Set();
async function Ul(e, t = !1) {
  e.forEach((n) => Lt.delete(n)), e.forEach((n) => Zn.add(n));
  try {
    await Zl(e, t);
  } finally {
    e.forEach((n) => Zn.delete(n));
  }
}
async function Vl(e) {
  const t = await ie.list(e, { limit: Le(e) });
  yn(e, t.counts), Va(e, t);
}
async function zl(e) {
  yn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const za = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ka(e) {
  const t = (K.rows[e] || []).filter((a) => Xn(a) && (e !== "plans" || !Ca(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  K.rows[e] = (K.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Kl = (e, t) => !It.has(e) || t && (K.paging.size[e] || Le(e)) === Le(e) && !ql.has(e);
async function Gl(e, t) {
  if (!Ze.has(e)) return zl(e);
  const n = await (Kl(e, t) ? Vl(e) : Hl(e));
  return za.has(e) && await Ka(e), n;
}
async function Yl() {
  const [e, t] = await Promise.all([ie.entries(0, vs), ie.settings()]);
  Ja([...At(Ya(), []), ...e]), JSON.stringify(t) !== JSON.stringify(K.settings) && (K.settings = t);
}
const Jl = (e, t) => Gl(e, t).then(
  () => null,
  () => e
);
async function Zl(e, t) {
  const n = (await Promise.all(e.map((s) => Jl(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), Lt.add(s))), t && await Yl(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ga = 1e3, Xl = 15e3;
let qt = Ga;
async function Ql() {
  return xt || (xt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !Sn.has(e)) || dt; ) {
      const e = dt, t = [...e ? Object.keys(K.rows) : Ke].filter((s) => Bt[s] && (Ze.has(s) || s in K.rows)).filter((s) => e || !Ze.has(s) || Lt.has(s) || !It.has(s)).filter((s) => !Sn.has(s)), n = [...Ke].filter((s) => Sn.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), dt = !1;
      try {
        await Ul(t, e), qt = Ga;
      } catch {
        dt = dt || e, await new Promise((a) => setTimeout(a, qt)), qt = Math.min(qt * 2, Xl);
      }
    }
  })().finally(() => xt = null), xt);
}
function wn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Zn.has(n)).forEach((n) => {
    Ke.add(n), t && Lt.add(n);
  }), Ke.has("settings") && (dt = !0), Ql();
}
const Ya = () => {
  var e;
  return `typed-entries:${((e = K.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Ja(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  K.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-vs), fn(Ya(), K.entries.slice(-50));
}
const ec = ["created", "updated", "deleted"], tc = { phases: ["phases", "plans"] }, Qn = (e) => tc[e] || [e], nc = (e) => ec.includes(e.entry_type) ? [...Qn(e.data.table), ...(e.data.joins || []).flatMap(Qn)] : [];
function sc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of Qn(t.data.table).filter((s) => K.rows[s]))
      K.rows[n] = K.rows[n].filter((s) => s.id !== t.data.id);
}
function ac(e) {
  Ja([...K.entries, ...e]), sc(e), wn([...new Set(e.flatMap(nc))].filter((t) => t && t !== "agents"));
}
Ui((e) => K.streamOpen || wn([e]));
const es = [], oc = 2e3, ze = /* @__PURE__ */ new Map(), rc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, ic = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function rt(e, { first: t = !1 } = {}) {
  t ? es.unshift(e) : es.push(e), ze.clear();
}
function Za(e, t, n) {
  var a;
  const s = Ha(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const lc = (e) => Ha(e.table).find((t) => t.id === e.id) === e.row, cc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function uc(e, t) {
  const n = [{ kind: "text", text: Ue(e).replace(/\r\n/g, `
`) }];
  for (const s of es)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Ct(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return dc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function dc(e) {
  return e.split(ic).map((t, n) => n % 2 ? t : t.replace(rc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Hs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function hc(e) {
  const [t, , ...n] = e, s = Hs(t).map((o) => `<th>${Ct(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Hs(o).map((r) => `<td>${Ct(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function fc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Ct(a)}</li>`).join("")}</${s}>`;
}
const Us = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Xa(e) {
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
      n.push(`<h${i}>${Ct(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Us(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(hc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(fc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Xa(
          t.slice(s, i).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Us(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Ct(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const pc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, mc = (e) => e.kind !== "text" && !pc.test(e.html);
function gc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Xa(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : mc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ts(e, t = { env: "" }) {
  const n = cc(e, t), s = ze.get(n);
  if (ze.delete(n), s && s.reads.every(lc))
    return ze.set(n, s), s.html;
  const a = [], o = gc(uc(e, { ...t, reads: a }));
  return ze.set(n, { html: o, reads: a }), ze.size > oc && ze.delete(ze.keys().next().value), o;
}
const Qa = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, nn = (e) => String(e || "").replace(Qa, (t, n, s, a) => a), vc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Wt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, yc = /^Traceback \(most recent call last\):/m, wc = 8;
function eo(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, wc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function kc(e) {
  const t = [...e.matchAll(vc)].map((s) => s.index);
  if (Wt.lastIndex = 0, !t.length || !Wt.test(e)) return null;
  Wt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Wt)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: eo(n), tail: "" } : null;
}
function bc(e) {
  const t = yc.exec(e);
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
rt((e) => {
  const t = nn(e), n = bc(t) || kc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const ns = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", $c = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", xc = `${ns} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, _c = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Mc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Vs = {
  js: { keywords: ns, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: $c, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: xc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ns, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: _c, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Mc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function zs(e, t, n) {
  return n && e.startsWith(n, t);
}
function Sc(e, t) {
  const n = Vs[t] || Vs.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (zs(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && zs(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? f.toLowerCase() : f, E = n.property && /^\s*:/.test(e.slice(o + f.length));
      r(s.has(m) ? "keyword" : E ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function Ec(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Sc(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Ue(r) : `<span class="tok-${s}">${Ue(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Ac(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Cc = 1500, Ks = /* @__PURE__ */ new WeakMap();
async function Oc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Ac(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ks.get(t)), Ks.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Cc)
  )));
}
typeof document < "u" && document.addEventListener("click", Oc, !0);
const Tc = /^(```|~~~)\s*(\w+)?\s*$/, Gs = /^\s{4,}\S/, Bc = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Ic = [
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
function Lc(e) {
  const t = to(e.join(`
`));
  return (Ic.find(([, n]) => n.test(t)) || ["text"])[0];
}
function Ys(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Ec(to(e.join(`
`)), t || Lc(e)).join(`
`)}</code></pre></div>` };
}
function Rc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Tc);
    if (r) {
      const i = t.findIndex((u, f) => f > o && u.trim().startsWith(r[1])), c = i < 0 ? t.length : i;
      a(), n.push(Ys(t.slice(o + 1, c).map(nn), r[2] ? r[2].toLowerCase() : "")), o = c + 1;
      continue;
    }
    if (Gs.test(t[o])) {
      let i = o;
      for (; i < t.length && (Gs.test(t[i]) || !t[i].trim()); ) i += 1;
      for (; i > o && !t[i - 1].trim(); ) i -= 1;
      const c = [];
      for (; s.length && s[s.length - 1].trim() && Bc.test(s[s.length - 1].trim()); ) c.unshift(s.pop());
      if (i - o + c.length >= 2) {
        a(), n.push(Ys([...c, ...t.slice(o, i)].map(nn), "")), o = i;
        continue;
      }
      s.push(...c);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
rt((e) => Rc(e));
const Dc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Nc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function jc(e) {
  const t = Dc.exec(e);
  if (t && pt(t[1])) return { at: t.index, length: t[0].length, table: pt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Nc.exec(e), s = n && pt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Pc(e, t, n, s) {
  const a = Za(s, e, t), o = nn(a ? vi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(vn(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
rt(
  (e, t) => {
    const n = jc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Pc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const qc = /\.(png|jpe?g|gif|webp|svg)$/i, Wc = (e) => qc.test(e), Fc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Hc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Uc(e, t) {
  const n = Fc.exec(e), [, s, a, o, r, i] = n || [], c = n && pt(s || o), u = c && Za(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const f = ie.in(t.env).fileUrl(c, u.id, i), m = `${vn(c).title} ${u.id} · ${Ue(i)}`, E = Wc(i) ? `<img class="file-card-image" src="${f}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Ue(i)}">${E}<span class="file-card-name">${m}</span></a>` };
}
function Vc(e) {
  const t = Hc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
rt(
  (e, t) => {
    if (t.inline) return null;
    const n = Uc(e, t) || Vc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const zc = /`([^`\n]+)`/g;
rt((e) => e.replace(zc, (t, n) => `<code>${n}</code>`));
const Js = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${pn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
rt(
  (e, t) => e.replace(Qa, (n, s, a, o) => Js[s] ? Js[s](a, o, t) : o)
);
const Kc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Gc = new RegExp(`\\b(${Wa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Yc = new RegExp(`\\b(${Wa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Jc = (e, t) => `<a class="row-pill" href="#" data-peek="${pt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Zc = (e) => e.replace(Yc, (t, n, s) => s.replace(/\d+/g, (a) => Jc(n.replace(/s$/i, ""), a))), Xc = (e) => Zc(e).replace(
  Gc,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${pt(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
rt(
  (e, t) => t.rowNames === !1 ? e : e.split(Kc).map((n, s) => s % 2 ? n : Xc(n)).join("")
);
const Qc = ["innerHTML"], eu = ["innerHTML"], tu = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = ts(s, { env: Ne.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(ht) && z(ht)(...o)),
      innerHTML: n.value
    }, null, 8, Qc)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(ht) && z(ht)(...o)),
      innerHTML: n.value
    }, null, 8, eu));
  }
}, st = /* @__PURE__ */ J(tu, [["__scopeId", "data-v-1a43d211"]]), nu = { class: "fact" }, su = { class: "fact-label" }, au = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", nu, [
      p("span", su, b(e.label), 1),
      H(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, ou = /* @__PURE__ */ J(au, [["__scopeId", "data-v-3a88ecf8"]]), ru = { class: "list" }, iu = { class: "list-label" }, lu = {
  key: 1,
  class: "list-note"
}, cu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", ru, [
      (l(!0), d(Z, null, re(e.items, (o, r) => (l(), Y(ot(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: ee(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          p("span", iu, b(o.label), 1),
          o.badge ? (l(), Y(Aa, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : j("", !0),
          o.note ? (l(), d("span", lu, b(o.note), 1)) : j("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, uu = /* @__PURE__ */ J(cu, [["__scopeId", "data-v-ebe2ae0a"]]), du = { class: "table" }, hu = {
  key: 0,
  class: "table-row empty"
}, fu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", du, [
      p("div", {
        class: "table-row head",
        style: we(a.value)
      }, [
        (l(!0), d(Z, null, re(e.columns, (i) => (l(), d("span", {
          key: i,
          class: "cell"
        }, b(i), 1))), 128))
      ], 4),
      (l(!0), d(Z, null, re(e.rows, (i, c) => (l(), Y(ot(i.open ? "button" : "div"), {
        key: c,
        type: i.open ? "button" : void 0,
        class: ee(["table-row", i.tone, { opens: i.open }]),
        style: we(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: V(() => [
          (l(!0), d(Z, null, re(i.cells, (u, f) => (l(), d("span", {
            key: f,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), d("div", hu, b(e.empty), 1)) : j("", !0)
    ]));
  }
}, pu = /* @__PURE__ */ J(fu, [["__scopeId", "data-v-9326a52e"]]), mu = { class: "stat-value" }, gu = { class: "stat-label" }, vu = {
  key: 0,
  class: "stat-note"
}, yu = {
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
    return (s, a) => (l(), Y(ot(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: ee(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        p("span", mu, b(e.value), 1),
        p("span", gu, b(e.label), 1),
        e.note ? (l(), d("span", vu, b(e.note), 1)) : j("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, wu = /* @__PURE__ */ J(yu, [["__scopeId", "data-v-ad0db6d6"]]), ku = { class: "code" }, bu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (l(), Y(fs, {
      value: e.node.type
    }, {
      stack: V(() => [
        H(zt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: V(() => [
        H(zt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: V(() => [
        H(zt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: V(() => [
        H(pi, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: V(() => [
        p("h3", {
          class: ee(["heading", `level-${e.node.level || 2}`])
        }, b(e.node.text), 3)
      ]),
      divider: V(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: V(() => [
        H(wu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: V(() => [
        H(li, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: V(() => [
        H(pu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: V(() => [
        H(uu, {
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
        H(ou, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: V(() => [
        H(Aa, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: V(() => [
        p("pre", ku, [
          p("code", null, b(e.node.text), 1)
        ])
      ]),
      file: V(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, b(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), no = /* @__PURE__ */ J(bu, [["__scopeId", "data-v-cbdcf540"]]), $u = { class: "dashboard" }, xu = { class: "trail" }, _u = ["onClick"], Mu = {
  key: 0,
  class: "gone",
  role: "status"
}, Su = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (E) => E in (n.document.pages || {}), o = W(!!n.page && !a(n.page)), r = W(n.page && !o.value ? [n.page] : []), i = I(() => r.value.at(-1) || n.document.start), c = I(() => (n.document.pages || {})[i.value] || null), u = (E) => ((n.document.pages || {})[E] || {}).title || E, f = (E) => {
      o.value = !1, r.value = [...r.value, E];
    }, m = (E) => {
      o.value = !1, r.value = r.value.slice(0, E);
    };
    return ke(
      () => n.document.start,
      () => r.value = []
    ), (E, A) => (l(), d("div", $u, [
      e.document.broken ? (l(), Y(Zt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          he(b(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), Y(Zt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: V(() => [
          he(b(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(Z, { key: 2 }, [
        p("nav", xu, [
          p("button", {
            type: "button",
            class: ee(["step", { current: !r.value.length }]),
            onClick: A[0] || (A[0] = (D) => m(0))
          }, b(u(e.document.start)), 3),
          (l(!0), d(Z, null, re(r.value, (D, w) => (l(), d(Z, {
            key: `${w}-${D}`
          }, [
            A[2] || (A[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: ee(["step", { current: w === r.value.length - 1 }]),
              onClick: (y) => m(w + 1)
            }, b(u(D)), 11, _u)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Mu, "What you opened is no longer in this dashboard. Here is its start page.")) : j("", !0),
        H(un, {
          name: "page",
          mode: "out-in"
        }, {
          default: V(() => [
            (l(), d("div", {
              key: i.value,
              class: "page"
            }, [
              H(no, {
                node: c.value.view,
                onOpen: f,
                onFile: A[1] || (A[1] = (D) => s("file", D))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : j("", !0)
    ]));
  }
}, uv = /* @__PURE__ */ J(Su, [["__scopeId", "data-v-fbe83734"]]);
function Eu(e, t, n, s = () => window) {
  De(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Se(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Au = (e, t = () => !0) => Eu("keydown", (n) => n.key === "Escape" && t() && e());
function Cu(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = W(!1), a = I(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Au(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Ou = 80, ct = hs([]);
function Tu(e) {
  const t = Symbol("layer"), n = () => ct.includes(t) && ct.splice(ct.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !ct.includes(t) && ct.push(t), s || n();
    },
    { immediate: !0 }
  ), Se(n), I(() => Ou + Math.max(0, ct.indexOf(t)));
}
let so = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return so = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Bu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Iu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Bu)];
    if (!r.length) return o.preventDefault();
    const [i, c] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  De(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : so, document.addEventListener("keydown", a), hn(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Se(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Lu = ["aria-modal", "aria-label", "aria-labelledby"], Ru = {
  key: 0,
  class: "dialog-head"
}, Du = ["id", "tabindex"], Nu = {
  key: 1,
  class: "dialog-foot"
}, ju = 500, Pu = 400, qu = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Cu(s, n), i = Tu(a), c = W(null), u = W(null), f = W(null), m = va(), E = W(!1), A = Date.now();
    n.modal && Iu(u, () => s("escape"), f);
    function D() {
      if (!n.modal) return n.closable && o();
      E.value = !0, setTimeout(() => E.value = !1, Pu);
    }
    function w(P) {
      !n.modal || Date.now() - A >= ju || ![" ", "Enter"].includes(P.key) || (P.preventDefault(), P.stopPropagation());
    }
    const y = () => c.value && (c.value.scrollTop = c.value.scrollHeight), T = new MutationObserver(y);
    return ke(c, (P) => {
      T.disconnect(), P && n.follow && (T.observe(P, { childList: !0, subtree: !0, characterData: !0 }), y());
    }), Se(() => T.disconnect()), (P, X) => (l(), Y(ya, { to: "body" }, [
      H(un, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: V(() => [
          z(a) ? (l(), d("div", {
            key: 0,
            class: ee(["dialog", { large: e.large, sheet: e.sheet }]),
            style: we({ zIndex: z(i) }),
            onClick: _e(D, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: ee(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: E.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(m) : void 0,
              onKeydownCapture: w
            }, [
              e.bare ? j("", !0) : (l(), d("header", Ru, [
                p("h3", {
                  id: z(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, Du),
                e.closable ? (l(), Y(ms, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : j("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: ee(["dialog-body", { bare: e.bare }])
              }, [
                $e(P.$slots, "default", {}, void 0, !0)
              ], 2),
              P.$slots.foot ? (l(), d("footer", Nu, [
                $e(P.$slots, "foot", {}, void 0, !0)
              ])) : j("", !0)
            ], 42, Lu)
          ], 6)) : j("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Wu = /* @__PURE__ */ J(qu, [["__scopeId", "data-v-6d1ecd98"]]), Ve = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ie = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Fu = 6;
function $s(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Hu = (e) => {
  const t = $s(e, Ve.lineChars), n = Math.max(Ve.minWidth, Math.max(...t.map((s) => s.length)) * Ve.charWidth + Ve.padX * 2);
  return { name: e, lines: t, line: Ve.line, padY: Ve.padY, width: n, height: t.length * Ve.line + Ve.padY * 2 };
};
function Uu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, c) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(c) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function Vu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function zu(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, c) => [i, c]))), o = (r, i) => {
    const c = a(), u = (f) => {
      const m = i(f).map((E) => c.get(E));
      return m.length ? m.reduce((E, A) => E + A, 0) / m.length : c.get(f);
    };
    return [...r].sort((f, m) => u(f) - u(m));
  };
  for (let r = 0; r < Fu; r++) {
    const i = r % 2 === 0, c = s.map((u, f) => f);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const f = (m) => t.filter((E) => E[i ? 1 : 0] === m).map((E) => E[i ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
function Ku(e, t) {
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
function Gu(e) {
  const t = [...new Set(e.flatMap(([$, v]) => [$, v]))], n = new Set(e.map(([, $]) => $)), s = t.filter(($) => !n.has($)), a = Uu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter(($, v) => !a.has(v)), r = Vu(t, o), i = zu(t, o, r), c = new Map(t.map(($) => [$, Hu($)])), u = i.map(($) => $.reduce((v, F) => v + c.get(F).width, 0) + Be.across * ($.length - 1)), f = Math.max(...u) + Be.margin * 2, m = Ju(e, r, i.length), E = /* @__PURE__ */ new Map();
  let A = Be.margin;
  i.forEach(($, v) => {
    let F = (f - u[v]) / 2;
    const M = Math.max(...$.map((N) => c.get(N).height));
    $.forEach((N) => {
      const x = c.get(N);
      E.set(N, { ...x, x: F, y: A + (M - x.height) / 2 }), F += x.width + Be.across;
    }), A += M + (m[v] ?? Be.down);
  });
  const D = e.map(([$, v, F], M) => ({ from: $, to: v, label: F || "", back: a.has(M) || r.get(v) <= r.get($) }));
  Ku(D, E);
  const w = D.map(($) => Zu($, E.get($.from), E.get($.to))), y = [...E.values()], T = td(w, y), P = Math.max(A - Be.down, ...T.filter(($) => $.label).map(($) => $.label.y + $.label.height));
  return { width: Math.max(f - Be.margin, ...T.filter(($) => $.label).map(($) => $.label.x + $.label.width)) + Be.margin, height: P + Be.margin, nodes: y, arrows: T };
}
const Yu = (e) => e ? $s(e, Ie.lineChars).length * Ie.line + Ie.pad * 2 : 0;
function Ju(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += Yu(r) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function Zu(e, t, n) {
  const s = e.label ? $s(e.label, Ie.lineChars) : [], a = s.length ? Math.max(...s.map((E) => E.length)) * Ie.charWidth + Ie.pad * 2 : 0, o = s.length * Ie.line + (s.length ? Ie.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - i) / 2, m = [{ x: r, y: i }, { x: r, y: i + f }, { x: c, y: u - f }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: m, path: `M${r} ${i} C${r} ${i + f} ${c} ${u - f} ${c} ${u}` };
}
const Xu = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, Qu = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], ed = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ie.line);
function td(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, u) => {
      const f = Xu(s.curve, c);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = ed.flatMap((c) => Qu.map((u) => a(u, c))).find((c) => !n.some((u) => Zs(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => Zs(i, c)); ) i.y += Ie.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Ie.line, pad: Ie.pad } };
  });
}
const Zs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, nd = { class: "flowchart-tools" }, sd = ["width", "height", "viewBox", "aria-label"], ad = ["d"], od = ["x", "y", "width", "height"], rd = ["x", "y"], id = ["x", "dy"], ld = {
  key: 0,
  class: "flowchart-label"
}, cd = ["x", "y", "width", "height"], ud = ["x", "y"], dd = ["x", "dy"], hd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(() => Gu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = W(null), i = W({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var T;
      const w = (T = r.value) == null ? void 0 : T.getBoundingClientRect();
      if (!(w != null && w.width)) return;
      const y = Math.min(w.width / a.value.width, w.height / a.value.height, 1.5);
      i.value = { zoom: y, x: (w.width - a.value.width * y) / 2, y: (w.height - a.value.height * y) / 2 };
    }
    function f(w, y, T) {
      const { zoom: P, x: X, y: $ } = i.value, v = Math.min(o.most, Math.max(o.least, P * w));
      i.value = { zoom: v, x: y - (y - X) * v / P, y: T - (T - $) * v / P };
    }
    function m(w) {
      const y = r.value.getBoundingClientRect();
      f(w, y.width / 2, y.height / 2);
    }
    function E(w) {
      const y = r.value.getBoundingClientRect();
      w.ctrlKey || w.metaKey ? f(w.deltaY < 0 ? o.step : 1 / o.step, w.clientX - y.left, w.clientY - y.top) : i.value = { ...i.value, x: i.value.x - w.deltaX, y: i.value.y - w.deltaY };
    }
    function A(w) {
      var y, T, P;
      w.preventDefault(), (y = window.getSelection()) == null || y.removeAllRanges(), c = { x: w.clientX - i.value.x, y: w.clientY - i.value.y }, (P = (T = r.value).setPointerCapture) == null || P.call(T, w.pointerId);
    }
    function D(w) {
      c && (i.value = { ...i.value, x: w.clientX - c.x, y: w.clientY - c.y });
    }
    return De(u), (w, y) => (l(), Y(Wu, {
      title: e.title,
      large: "",
      onClose: y[4] || (y[4] = (T) => s("close"))
    }, {
      default: V(() => [
        p("div", nd, [
          H(ye, {
            small: "",
            onClick: y[0] || (y[0] = (T) => m(o.step))
          }, {
            default: V(() => [...y[5] || (y[5] = [
              he("Zoom in", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            small: "",
            onClick: y[1] || (y[1] = (T) => m(1 / o.step))
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
          onWheel: _e(E, ["prevent"]),
          onPointerdown: A,
          onPointermove: D,
          onPointerup: y[2] || (y[2] = (T) => Cs(c) ? c.value = null : c = null),
          onPointercancel: y[3] || (y[3] = (T) => Cs(c) ? c.value = null : c = null)
        }, [
          (l(), d("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: we({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (l(!0), d(Z, null, re(a.value.arrows, (T, P) => (l(), d("path", {
              key: `arrow-${P}`,
              class: "flowchart-arrow",
              d: T.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, ad))), 128)),
            (l(!0), d(Z, null, re(a.value.nodes, (T) => (l(), d("g", {
              key: T.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: T.x,
                y: T.y,
                width: T.width,
                height: T.height,
                rx: "8"
              }, null, 8, od),
              p("text", {
                x: T.x + T.width / 2,
                y: T.y + T.padY + T.line / 2
              }, [
                (l(!0), d(Z, null, re(T.lines, (P, X) => (l(), d("tspan", {
                  key: X,
                  x: T.x + T.width / 2,
                  dy: X ? T.line : 0
                }, b(P), 9, id))), 128))
              ], 8, rd)
            ]))), 128)),
            (l(!0), d(Z, null, re(a.value.arrows, (T, P) => (l(), d(Z, {
              key: `label-${P}`
            }, [
              T.label ? (l(), d("g", ld, [
                p("rect", {
                  x: T.label.x,
                  y: T.label.y,
                  width: T.label.width,
                  height: T.label.height,
                  rx: "4"
                }, null, 8, cd),
                p("text", {
                  x: T.label.x + T.label.width / 2,
                  y: T.label.y + T.label.pad + T.label.line / 2
                }, [
                  (l(!0), d(Z, null, re(T.label.lines, (X, $) => (l(), d("tspan", {
                    key: $,
                    x: T.label.x + T.label.width / 2,
                    dy: $ ? T.label.line : 0
                  }, b(X), 9, dd))), 128))
                ], 8, ud)
              ])) : j("", !0)
            ], 64))), 128))
          ], 12, sd))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, fd = /* @__PURE__ */ J(hd, [["__scopeId", "data-v-51d24cfe"]]), Xs = {
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
}, pd = ["innerHTML"], md = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => Xs[t.name] || Xs.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, pd));
  }
}, Xe = /* @__PURE__ */ J(md, [["__scopeId", "data-v-beb5935c"]]), gd = ["title", "aria-label"], vd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, yd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, wd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), d("span", {
      class: ee(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), d("svg", vd, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", yd)) : j("", !0)
      ]))
    ], 10, gd));
  }
}, kd = /* @__PURE__ */ J(wd, [["__scopeId", "data-v-6dc92808"]]), bd = "img,pre,table";
function $d(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function xd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function _d(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(bd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = $d(xd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Md(e, t) {
  let n = null;
  const s = () => e.value && _d(e.value);
  De(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Se(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const Sd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Ed(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Ad = ["data-from", "data-ref"], Cd = { class: "message-body" }, Od = ["innerHTML"], Td = ["innerHTML"], Bd = {
  class: "message-faces",
  "data-message-faces": ""
}, Id = ["title", "data-face", "onClick"], Ld = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Rd = ["title", "data-reaction", "onClick"], Dd = {
  key: 0,
  class: "message-reaction-count"
}, Nd = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, jd = ["href", "title"], Pd = ["src", "alt"], qd = ["href"], Wd = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, Fd = {
  key: 1,
  "data-message-links-rows": ""
}, Hd = { class: "message-foot" }, Ud = { class: "message-time" }, Vd = 1500, zd = "An earlier message", Kd = "about", Gd = 3, Yd = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    var O;
    const n = e, s = t, a = W(!1), o = W(null), r = I(() => ["user", "comment"].includes(n.message.type)), i = I(() => r.value && !n.message.read_at && !n.message.local);
    async function c() {
      var k;
      await ((k = navigator.clipboard) == null ? void 0 : k.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Vd);
    }
    const u = I(() => ts(n.message.text ?? "", { env: "" })), f = I(() => JSON.parse(n.message.flowchart_edges || "[]")), m = W(!1), E = I(() => ts(n.quote || zd, { env: "" }));
    function A() {
      const k = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      k ? k.scrollIntoView({ block: "center", behavior: "smooth" }) : yt(`messages:${n.message.parent_id}`);
    }
    Md(o, () => `${n.message.text} ${n.quote}`);
    const D = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, w = (k) => `/api/files/message/${n.message.id}/${encodeURIComponent(k)}`, y = I(() => JSON.parse(n.message.captions || "{}")), T = I(() => (n.message.files ?? []).map((k) => ({ name: k, address: w(k), isImage: D.test(k), title: y.value[k] || k }))), P = I(() => Ra(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), X = je(Pe, null), $ = W([]), v = W(!1), F = I(() => `Linked: ${$.value.join(", ")}`), M = I(() => $.value.length >= Gd), N = I(() => `${$.value.length} linked ${$.value.every((k) => k.startsWith("task ")) ? "tasks" : "rows"}`);
    async function x() {
      if (!r.value || !(X != null && X.read) || n.message.local) return;
      const k = await X.read(`link list --source message:${n.message.id}`);
      k.ok && ($.value = (k.value.rows ?? k.value ?? []).filter((C) => C.link_type === Kd).map((C) => `${C.target_model} ${C.target_id}`));
    }
    x(), (O = X == null ? void 0 : X.follow) == null || O.call(X, ["link.*"], x);
    const S = W(!1), g = I(() => Ed(n.message.reactions));
    function h(k) {
      S.value = !1, s("react", n.message, k);
    }
    return (k, C) => (l(), d("article", {
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", Cd, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: "message-card md",
          onClick: C[2] || (C[2] = (...U) => z(ht) && z(ht)(...U))
        }, [
          e.message.parent_id ? (l(), d("div", {
            key: 0,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: _e(A, ["stop"]),
            innerHTML: E.value
          }, null, 8, Od)) : j("", !0),
          p("div", { innerHTML: u.value }, null, 8, Td),
          f.value.length ? (l(), d(Z, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: C[0] || (C[0] = (U) => m.value = !0)
            }, "Open the flowchart"),
            m.value ? (l(), Y(fd, {
              key: 0,
              title: e.message.text,
              edges: f.value,
              onClose: C[1] || (C[1] = (U) => m.value = !1)
            }, null, 8, ["title", "edges"])) : j("", !0)
          ], 64)) : j("", !0)
        ], 512),
        p("div", {
          class: ee(["message-tools", { picking: S.value }]),
          "data-message-tools": ""
        }, [
          S.value ? (l(), d(Z, { key: 0 }, [
            p("div", Bd, [
              (l(!0), d(Z, null, re(z(Sd), (U) => (l(), d("button", {
                key: U,
                type: "button",
                class: "message-face",
                title: `React ${U}`,
                "data-face": U,
                onClick: (oe) => h(U)
              }, b(U), 9, Id))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: C[3] || (C[3] = (U) => S.value = !1)
            }, [
              H(Me, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (l(), d(Z, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: C[4] || (C[4] = (U) => S.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: C[5] || (C[5] = (U) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: c
            }, b(a.value ? "Copied" : "Copy"), 1),
            i.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: C[6] || (C[6] = (U) => s("delete", e.message))
            }, "Delete")) : j("", !0)
          ], 64))
        ], 2)
      ]),
      g.value.length ? (l(), d("div", Ld, [
        (l(!0), d(Z, null, re(g.value, (U) => (l(), d("button", {
          key: U.emoji,
          type: "button",
          class: ee(["message-reaction", { mine: U.mine }]),
          title: U.title,
          "data-reaction": U.emoji,
          onClick: (oe) => s("react", e.message, U.emoji)
        }, [
          he(b(U.emoji) + " ", 1),
          U.count > 1 ? (l(), d("span", Dd, b(U.count), 1)) : j("", !0)
        ], 10, Rd))), 128))
      ])) : j("", !0),
      T.value.length ? (l(), d("div", Nd, [
        (l(!0), d(Z, null, re(T.value, (U) => (l(), d(Z, {
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
            }, null, 8, Pd)
          ], 8, jd)) : (l(), d("a", {
            key: 1,
            href: U.address,
            target: "_blank",
            class: "message-file"
          }, b(U.name), 9, qd))
        ], 64))), 128))
      ])) : j("", !0),
      $.value.length ? (l(), d("div", Wd, [
        H(Xe, {
          class: "message-links-icon",
          name: "linked"
        }),
        M.value && !v.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: C[7] || (C[7] = (U) => v.value = !0)
        }, b(N.value), 1)) : (l(), d("span", Fd, [
          H(st, {
            text: F.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : j("", !0),
      p("div", Hd, [
        p("time", Ud, b(P.value), 1),
        r.value ? (l(), Y(kd, {
          key: 0,
          message: e.message
        }, null, 8, ["message"])) : j("", !0)
      ])
    ], 8, Ad));
  }
}, dv = /* @__PURE__ */ J(Yd, [["__scopeId", "data-v-e8716407"]]), Jd = ["aria-label"], En = 200, Zd = 300, Qs = 400, Xd = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: En } },
  setup(e) {
    const t = e, n = I(() => t.value < En ? [1, 0.25, 0.25] : t.value === En ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, a) => (l(), d("svg", {
      class: ee(["ico", "prio", { hot: e.value >= Qs, high: e.value >= Zd && e.value < Qs }]),
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
    ], 10, Jd));
  }
}, hv = /* @__PURE__ */ J(Xd, [["__scopeId", "data-v-89404405"]]), ao = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], fv = (e) => {
  var t;
  return ((t = ao.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Qd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      H(Xe, { name: "fold" })
    ], 2));
  }
}, sn = /* @__PURE__ */ J(Qd, [["__scopeId", "data-v-d03899bb"]]), eh = ["aria-checked", "aria-haspopup", "onClick"], th = {
  key: 0,
  class: "segmented-dot"
}, nh = {
  key: 1,
  class: "segmented-count"
}, sh = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = va();
    return (a, o) => {
      const r = Uo("tip");
      return l(), d("span", {
        class: ee(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), d(Z, null, re(e.options, (i) => mt((l(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: ee(["segmented-option", { on: i.key === e.value }]),
          onClick: (c) => n("pick", i.key)
        }, [
          i.dot ? (l(), d("span", th)) : j("", !0),
          he(" " + b(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", nh, b(i.count), 1)) : j("", !0)
        ], 10, eh)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, ss = /* @__PURE__ */ J(sh, [["__scopeId", "data-v-ca953072"]]), ea = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, ah = {
  key: 1,
  class: "text-field-label"
}, oh = {
  key: 2,
  class: "text-field-end"
}, rh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Vn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Un(e, "modelValue"), s = wa(), a = "onUpdate:modelValue" in (((f = Vo()) == null ? void 0 : f.vnode.props) || {}), o = I(() => a ? n.value : s.value), r = (m) => a && (n.value = m.target.value), i = I(
      () => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), c = I(() => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "value"))), u = W(null);
    return t({ focus: () => u.value && u.value.focus() }), (m, E) => e.label || e.icon || m.$slots.end ? (l(), d("label", {
      key: 0,
      class: ee(["text-field", { large: e.large, ended: m.$slots.end }, z(s).class]),
      style: we(z(s).style)
    }, [
      e.icon ? (l(), Y(Me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : j("", !0),
      e.label ? (l(), d("span", ah, b(e.label), 1)) : j("", !0),
      mt(p("input", at({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(ea), o.value]
      ]),
      m.$slots.end ? (l(), d("span", oh, [
        $e(m.$slots, "end", {}, void 0, !0)
      ])) : j("", !0)
    ], 6)) : mt((l(), d("input", at({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
      [z(ea), o.value]
    ]);
  }
}), ih = /* @__PURE__ */ J(rh, [["__scopeId", "data-v-d9c38ca8"]]);
function lh(e, t, { incremental: n = !1 } = {}) {
  const s = ps(), a = W([]), o = W(""), r = W(!1), i = W(""), c = W(null);
  async function u(w) {
    const y = await s.read(`${e} --before-id ${w + 1} --limit 1`);
    if (!y.ok) return A();
    const T = y.value.rows.find((P) => P.id === w);
    a.value = T ? a.value.map((P) => P.id === w ? T : P) : a.value.filter((P) => P.id !== w);
  }
  async function f(w) {
    if (n && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter(($) => $.id !== w.row_id));
    if (n && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && a.value.some(($) => $.id === w.row_id)) return u(w.row_id);
    if (!(n && a.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return A();
    const T = Math.max(...a.value.map(($) => $.id)), P = await s.read(`${e} --after-id ${T}`);
    if (!P.ok) return A();
    const X = new Set(a.value.map(($) => $.id));
    a.value = [...P.value.rows.filter(($) => !X.has($.id)), ...a.value];
  }
  async function m() {
    if (!a.value.length) return !1;
    const w = Math.min(...a.value.map((P) => P.id)), y = await s.read(`${e} --before-id ${w}`);
    if (!y.ok || !y.value.rows.length) return !1;
    const T = new Set(a.value.map((P) => P.id));
    return a.value = [...a.value, ...y.value.rows.filter((P) => !T.has(P.id))], !0;
  }
  let E = 0;
  async function A() {
    const w = ++E, y = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (w !== E) return;
    const T = y.ok ? s.shared ? [y.value] : y.value.rows : [], P = T.length ? Math.min(...T.map((X) => X.id)) : 0;
    a.value = n && y.ok && P ? [...a.value.filter((X) => X.id > Math.max(...T.map(($) => $.id))), ...T, ...a.value.filter((X) => X.id < P)] : T, o.value = y.ok ? "" : y.error, r.value = !0;
  }
  async function D(w) {
    const y = await s.run(w);
    return i.value = y.ok ? "" : y.error, c.value = y.ok ? y.value : null, await A(), y;
  }
  return s.follow(t, f), A(), { rows: a, failure: o, loaded: r, load: A, older: m, act: D, actionFailure: i, answer: c, context: s };
}
const ch = { class: "title" }, uh = { class: "state" }, dh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = lh(t.line, t.events);
    return (o, r) => (l(), Y(Wr, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: V(({ row: i }) => [
        p("span", ch, b(i.title), 1),
        p("span", uh, b(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, pv = /* @__PURE__ */ J(dh, [["__scopeId", "data-v-a69084cd"]]), hh = ["data-tip", "aria-label"], fh = {
  key: 0,
  class: "mact-word"
}, ph = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      H(Xe, { name: "open" }),
      e.open ? (l(), d("span", fh, b(e.label), 1)) : j("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, hh));
  }
}, mh = /* @__PURE__ */ J(ph, [["__scopeId", "data-v-3b292e09"]]), An = W(Date.now() / 1e3);
let ta = 0, Ft = 0;
function gh() {
  return Ft || (An.value = Date.now() / 1e3, ta = setInterval(() => An.value = Date.now() / 1e3, 1e3)), Ft += 1, ka() && ba(() => {
    Ft -= 1, Ft || clearInterval(ta);
  }), An;
}
const vh = 120, Cn = 280, yh = 160, wh = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function kh(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = W(t()), a = W("");
  let o = 0;
  const r = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const f = e.value, m = ++o;
    if (!f || !f.offsetWidth || wh()) {
      s.value = u;
      return;
    }
    const E = { width: f.offsetWidth, height: f.offsetHeight };
    if (r(f, E), a.value = "leaving", await n(vh), m !== o) return;
    s.value = u, a.value = "resizing", await hn(), i(f);
    const A = { width: f.offsetWidth, height: f.offsetHeight };
    r(f, E), f.offsetWidth, f.style.transition = `width ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, A), await n(Cn), m === o && (i(f), a.value = "entering", await n(yh), m === o && (a.value = ""));
  }
  return ke(t, (u) => c(u)), Tt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const bh = ["title", "data-figure-mark", "data-folded", "data-open"], $h = {
  key: 2,
  class: "worker"
}, xh = { class: "head" }, _h = { key: 0 }, Mh = {
  key: 3,
  class: "status"
}, Sh = {
  key: 0,
  class: "figure"
}, Eh = {
  key: 1,
  class: "ran-for"
}, Ah = { key: 2 }, Ch = { key: 3 }, Oh = {
  key: 4,
  class: "news"
}, Th = {
  key: 5,
  class: "spin",
  "aria-label": "Still running"
}, Bh = {
  key: 7,
  class: "settled"
}, Ih = {
  key: 1,
  class: "bar"
}, Lh = {
  key: 3,
  class: "detail body"
}, Rh = {
  key: 0,
  class: "body-label"
}, Dh = ["title"], Nh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = wa(), s = ["onClick", "onAct"], a = I(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = W(!1), r = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = I(() => t.open !== void 0), c = I(() => i.value || r.value), u = I(() => i.value ? t.open : o.value), f = I(() => i.value ? !t.open : r.value && !o.value), m = I(() => !!(t.mark.action && n.onAct)), E = I(() => c.value || m.value || !!n.onClick), A = W(null), D = W(null), { folded: w, phase: y } = kh(A, () => f.value);
    function T(le) {
      var me, Ee;
      if (!(le.target !== A.value && !D.value.contains(le.target))) {
        if (i.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Ee = n.onAct || n.onClick) == null || Ee(le);
      }
    }
    const P = (le) => n.onAct(le), X = ["failed", "unfinished"], $ = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? X.includes(t.mark.state) ? "danger" : "good" : ""), v = I(() => t.mark.color ? t.mark.color : $.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : $.value ? `var(--tone-${$.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), F = I(() => v.value || "var(--tone-work)"), M = I(() => !t.mark.ending && !t.mark.ended && $.value !== "stopped"), N = gh(), x = I(
      () => t.mark.began_at && M.value && !t.mark.figure && !t.mark.counting ? Ji(N.value - t.mark.began_at) : ""
    ), S = I(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${Ps(me - le, !0)}` : Ps(N.value - le, !0) : x.value;
    }), g = ["bad", "danger", "warn"], h = I(() => g.includes($.value) || t.mark.asks ? "attention" : M.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), O = ["bad", "danger"], k = I(() => O.includes($.value)), C = I(() => h.value === "process" ? "running" : k.value ? "cross" : $.value === "stopped" ? "stopped" : $.value === "good" ? "tick" : ""), U = I(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || C.value || t.mark.settled || t.mark.news)
    ), oe = I(() => [t.mark.title, t.mark.time ? Ra(t.mark.time) : ""].filter(Boolean).join(" · ")), de = I(() => ({
      ...v.value ? { "--mark": v.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (l(), d("div", at(a.value, {
      ref_key: "root",
      ref: A,
      class: [
        "mark",
        `w-${h.value}`,
        z(y),
        {
          open: u.value,
          live: E.value,
          failed: k.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: v.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: de.value,
      title: oe.value,
      "data-figure-mark": e.mark.key,
      "data-folded": z(w) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: T
    }), [
      (l(), Y(ot(E.value ? "button" : "span"), {
        ref_key: "top",
        ref: D,
        class: "top",
        type: E.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!u.value) : void 0
      }, {
        default: V(() => [
          e.mark.markIcon ? (l(), Y(Xe, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), Y(Me, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), d("span", $h, b(e.mark.worker), 1)) : j("", !0),
          p("span", xh, [
            H(st, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", _h, b(e.mark.name), 1)) : j("", !0),
            c.value ? (l(), Y(sn, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : j("", !0)
          ]),
          U.value ? (l(), d("span", Mh, [
            e.mark.figure ? (l(), d("span", Sh, b(e.mark.figure), 1)) : j("", !0),
            S.value ? (l(), d("span", Eh, b(S.value), 1)) : j("", !0),
            e.mark.docked ? (l(), d("span", Ah, "In the dock")) : j("", !0),
            e.mark.stopping ? (l(), d("span", Ch, "Stopping")) : j("", !0),
            e.mark.news ? (l(), d("span", Oh, b(e.mark.news), 1)) : j("", !0),
            C.value === "running" ? (l(), d("span", Th)) : C.value ? (l(), Y(Xe, {
              key: 6,
              class: ee(["sign", C.value]),
              name: C.value
            }, null, 8, ["class", "name"])) : j("", !0),
            e.mark.settled ? (l(), d("span", Bh, b(e.mark.settled), 1)) : j("", !0)
          ])) : j("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (l(), Y(mh, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: _e(P, ["stop"])
      }, null, 8, ["label", "open"])) : j("", !0),
      (e.mark.figure || e.mark.counting) && M.value ? (l(), d("span", Ih, [
        p("span", {
          class: "progress",
          style: we({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: F.value })
        }, null, 4)
      ])) : j("", !0),
      e.mark.detail && !z(w) ? (l(), Y(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : j("", !0),
      e.mark.body && !z(w) ? (l(), d("div", Lh, [
        e.mark.bodyLabel ? (l(), d("p", Rh, b(e.mark.bodyLabel), 1)) : j("", !0),
        H(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : j("", !0),
      e.mark.command && !z(w) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, Dh)) : j("", !0),
      e.mark.card ? (l(), Y(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : j("", !0),
      $e(le.$slots, "default", {
        shown: !z(w)
      }, void 0, !0)
    ], 16, bh));
  }
}), oo = /* @__PURE__ */ J(Nh, [["__scopeId", "data-v-de840831"]]), jh = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function ro(e) {
  var n;
  const t = jh[e] || ((n = vn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ph = (e) => ro(String(e).split(":")[0]), io = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), qh = { passed: "good", failed: "danger", warned: "warn", running: "" }, Wh = { good: "good", warn: "warn", danger: "danger" }, na = {
  "open row": (e) => yt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Ir(e.target_model, e.target_id || 0)
}, Fh = { "open row": (e) => Ph(e.target_model), "open page": () => ro("pages") };
function Hh(e, t) {
  const n = t || {}, s = na[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? qh[e.outcome] || "" : Wh[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Fh[s](e) : "",
    handlers: s ? { onAct: () => na[s](e) } : {}
  };
}
const Uh = 24, Vh = 1e3, sa = 2e3, zh = 0.25, Kh = 5e3;
function Gh(e, t = Uh, n = () => !0) {
  const s = W(!1), a = W(0), o = W(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const $ = u();
    return $ ? $.scrollHeight - $.scrollTop - $.clientHeight : 0;
  }, m = () => !u() || f() <= t;
  function E($) {
    if (clearTimeout(r), !$) {
      o.value = !1, c = Date.now();
      return;
    }
    const v = Date.now() - c < sa ? sa : Vh;
    r = setTimeout(() => o.value = s.value, v);
  }
  function A() {
    clearTimeout(i), s.value = !1, a.value = 0, E(!1);
  }
  function D($ = !1) {
    const v = u();
    v && $ && v.scrollTo ? v.scrollTo({ top: v.scrollHeight, behavior: "smooth" }) : v && (v.scrollTop = v.scrollHeight), A();
  }
  function w() {
    T(), !s.value && (s.value = !0, E(!0));
  }
  const y = () => !!u() && f() <= u().clientHeight * zh;
  function T() {
    clearTimeout(i), y() && (i = setTimeout(() => s.value && y() && n() && D(!0), Kh));
  }
  function P() {
    m() ? A() : w();
  }
  function X($ = 1, v = !1) {
    s.value ? a.value += Math.max(0, $) : D(v);
  }
  return ka() && ba(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: m, follow: A, toBottom: D, left: w, scrolled: P, arrived: X };
}
const Yh = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = W(null), { away: o, scrolled: r, arrived: i, toBottom: c } = Gh(a);
    ke(
      () => n.lines.length,
      () => hn(() => i()),
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
      he(b(e.lines.join(`
`) || e.empty), 1),
      z(o) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (E) => z(c)(!0))
      }, "Follow")) : j("", !0)
    ], 544));
  }
}, Jh = /* @__PURE__ */ J(Yh, [["__scopeId", "data-v-09394a20"]]), Zh = 1e4;
class Xh {
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
    return this.heardAt !== null && t - this.heardAt > Zh;
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
const Qh = {
  key: 0,
  class: "frame-note"
}, ef = {
  key: 0,
  class: "frame-note"
}, tf = ["src", "title"], nf = 1e3, sf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ps(), s = W(null), a = W(!1), o = W(!1);
    let r = null, i = 0;
    return De(() => {
      r = new Xh(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, nf);
    }), Se(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", Qh, "This window was closed because it stopped answering.")) : (l(), d(Z, { key: 1 }, [
      a.value ? (l(), d("div", ef, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        H(ye, {
          onClick: u[0] || (u[0] = (f) => o.value = !0)
        }, {
          default: V(() => [...u[1] || (u[1] = [
            he("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : j("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: z(n).window
      }, null, 8, tf)
    ], 64));
  }
}, af = /* @__PURE__ */ J(sf, [["__scopeId", "data-v-32a49046"]]), of = 0, rf = "/api/lines", lf = "/api/line";
class cf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), of));
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
        const n = await Re.raw(rf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Re.raw(lf, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const uf = new cf();
class df {
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
      n.patterns.some((s) => lo(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function lo(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const hf = { 1: "refused", 2: "usage", 3: "fault" }, ff = 100, pf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function mf({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = W({}), declared: u = [], readOnly: f = !1, shared: m = null }) {
  const E = /* @__PURE__ */ new Map(), A = new AbortController(), D = (w) => {
    const y = E.get(w);
    if (y && performance.now() - y.at < ff) return y.answer;
    const T = St(e, w, t, A.signal);
    return E.set(w, { answer: T, at: performance.now() }), T;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: I(() => s()),
    permissions: a,
    readOnly: f,
    shared: m,
    read: D,
    run: (w) => St(e, w, t, A.signal),
    upload: (w) => vf(w, A.signal),
    cancel: () => A.abort(),
    follow: (w, y) => r.follow(e, w.filter((T) => o.some((P) => lo(P, T))), y, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (w) => I(() => {
      var y;
      return c.value[w] ?? ((y = u.find((T) => T.key === w)) == null ? void 0 : y.default);
    }),
    setting: async (w, y) => {
      const T = await D(`window setting ${e} ${w}`);
      return T.ok ? T.value.value : y;
    },
    keep: (w, y) => St(e, ["window", "save-setting", e, w, JSON.stringify(y)], t, A.signal)
  };
}
function gf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const an = { ok: !1, failure: "cancelled", error: "" };
async function St(e, t, n, s = void 0) {
  try {
    const a = await uf.add({ window: e, line: Array.isArray(t) ? t : yf(t), environment: n }, s);
    return s != null && s.aborted ? an : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: hf[a.code] || "fault", error: gf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? an : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function vf(e, t = void 0) {
  try {
    const n = await Re.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? an : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? an : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function yf(e) {
  return [...e.matchAll(pf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function wf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const kf = {
  class: "allowance-prompt",
  role: "dialog"
}, bf = { class: "allowance-prompt-text" }, $f = { class: "allowance-prompt-buttons" }, xf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", kf, [
      p("p", bf, b(z(wf)(e.request)), 1),
      p("div", $f, [
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
}, _f = /* @__PURE__ */ J(xf, [["__scopeId", "data-v-102dc765"]]), On = {
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
        he(b(e.reason) + " ", 1),
        e.retry ? (l(), Y(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            he("Retry", -1)
          ])]),
          _: 1
        })) : j("", !0),
        e.removable ? (l(), Y(ye, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            he("Remove tab", -1)
          ])]),
          _: 1
        })) : j("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Mf = ["data-window", "data-agent"], Sf = {
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
    function r() {
      a.value = "", o.value++;
    }
    const i = je(vr, null), c = mf({
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
      open: (m, E) => {
        s("open", m, E), i == null || i(m, E);
      }
    });
    zo(Pe, c), ke(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Se(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), Ko((m) => (a.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const u = () => ds(n.component), f = () => {
      var m, E;
      return ((E = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : E.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, E) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (l(), Y(_f, {
        key: 0,
        request: f(),
        onAnswer: E[0] || (E[0] = (A) => e.prompts.answer(A))
      }, null, 8, ["request"])) : j("", !0),
      e.unavailableReason ? (l(), Y(On, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), Y(On, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (l(), Y(u, { key: o.value })) : (l(), Y(On, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: E[1] || (E[1] = (A) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Mf));
  }
}, co = /* @__PURE__ */ J(Sf, [["__scopeId", "data-v-7d5e8ae6"]]), Ef = {
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
    const t = e, n = { render: () => ds(af, { src: t.entry.entry_url }) };
    return (s, a) => (l(), Y(co, {
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
}, as = "journal.stale-build-reload", Af = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Cf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(as) === e.message) return !1;
    t.setItem(as, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Of(e = window.sessionStorage) {
  try {
    e.removeItem(as);
  } catch {
    return;
  }
}
const Tf = ["data-window"], Bf = {
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
    return ke(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, Of();
          } catch (o) {
            if (Af(o) && Cf(o)) return;
            s.value = `This window's file could not be loaded: ${o.message}`;
          }
      },
      { immediate: !0 }
    ), (a, o) => !n.value && !s.value && !e.entry.unavailable_reason ? (l(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      H(vt, { shape: "cards" })
    ], 8, Tf)) : (l(), Y(co, {
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
}, If = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new df(), s = ((i = je(Pe, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = I(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), Y(Bf, {
      key: 0,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), Y(Ef, {
      key: 1,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Lf = { class: "mark-more-inner" }, Rf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Df = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Nf = {
  key: 3,
  class: "mark-lines"
}, jf = "process", aa = "task", Pf = 2e3, qf = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = je(Pe), s = I(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = I(() => io.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === aa ? t.mark.target_id : 0), r = W([]), i = W(!1), c = W(""), u = I(() => t.mark.target_model === jf && !!t.mark.target_id);
    async function f() {
      const A = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = A.ok ? "" : A.error, A.ok && (r.value = A.value.lines);
    }
    let m = null;
    const E = () => clearInterval(m);
    return ke(() => t.shown && u.value, (A) => {
      E(), A && (f(), t.mark.ended_at || (m = setInterval(f, Pf)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (A) => A && t.shown && u.value && (E(), f())), Se(E), (A, D) => (l(), d("div", {
      class: ee(["mark-more", { open: e.shown }]),
      onClick: D[1] || (D[1] = _e(() => {
      }, ["stop"]))
    }, [
      p("div", Lf, [
        e.declaration.body_url ? (l(), Y(If, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(Z, { key: 1 }, [
          a.value ? (l(), d(Z, { key: 0 }, [
            D[2] || (D[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Rf, b(a.value), 1)
          ], 64)) : j("", !0),
          u.value && c.value ? (l(), d("p", Df, b(c.value), 1)) : u.value && i.value ? (l(), d(Z, { key: 2 }, [
            D[3] || (D[3] = p("p", { class: "mark-label" }, "Output", -1)),
            H(Jh, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", Nf, b(s.value.join(`
`)), 1)) : j("", !0),
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: D[0] || (D[0] = _e((w) => z(yt)(`${aa}:${o.value}`), ["stop"]))
          }, "Open task " + b(o.value) + " and its proofs", 1)) : j("", !0)
        ], 64))
      ])
    ], 2));
  }
}, os = /* @__PURE__ */ J(qf, [["__scopeId", "data-v-51f69bf1"]]), Wf = (e) => `show-${e}`, mv = (e, t, n) => e.filter((s) => {
  var a;
  return n(Wf((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Ff = "messages.chat", Hf = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), rs = (e, t, n) => St(Ff, Hf(e, t), n), Uf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Vf = ["title", "aria-label", "onClick"], zf = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Kf = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => Uf(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = W(""), a = je(Pe);
    async function o(r) {
      const i = await rs(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (l(), d(Z, null, [
      (l(!0), d(Z, null, re(n.value, (c) => (l(), d("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: _e((u) => o(c), ["stop"])
      }, [
        H(Xe, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, Vf))), 128)),
      s.value ? (l(), d("span", zf, b(s.value), 1)) : j("", !0)
    ], 64));
  }
}, Gf = /* @__PURE__ */ J(Kf, [["__scopeId", "data-v-0dfda102"]]);
function uo(e, t) {
  const n = dn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await Re.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const ho = uo("/api/marks", "marks"), gv = ho.fetchAll, Yf = ho.find, Jf = 2e3;
function Zf(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, Jf);
  };
  De(async () => {
    await e(), s();
  }), Tt(() => clearTimeout(n));
}
const Xf = ["data-ref"], Qf = ["data-ref"], e1 = { class: "mark-row" }, t1 = "ended", n1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["answered", "closed"]), s = e, a = I(() => Yf(s.mark.type)), o = je(Pe, null), r = I(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = W(null);
    Zf(async () => {
      if (!r.value) return;
      const m = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      m.ok && m.value.rows.length && (i.value = m.value.rows[0].progress);
    }, () => r.value);
    const c = I(() => {
      const m = Hh(s.mark, a.value), E = !m.figure || m.figure.endsWith("%");
      return i.value && r.value && E ? { ...m, figure: `${i.value}%`, fraction: i.value / 100 } : m;
    }), u = I(() => {
      var m;
      return !!(s.mark.lines || s.mark.detail && io.has(s.mark.variant) || t.has(s.mark.target_model) || (m = a.value) != null && m.body_url);
    }), f = W(!1);
    return (m, E) => {
      var A, D, w;
      return (A = a.value) != null && A.card && e.mark.state !== t1 && !z(n).has(e.mark.variant) ? (l(), d("div", {
        key: 0,
        class: "thread-turn card whole-card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        H(os, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 8, Xf)) : (l(), d("div", {
        key: 1,
        class: ee(["thread-turn", "card", { "full-width": (D = a.value) == null ? void 0 : D.full_width }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", e1, [
          H(oo, at({
            mark: c.value,
            open: u.value ? f.value : void 0
          }, Go(c.value.handlers), {
            onClick: E[0] || (E[0] = (y) => f.value = !f.value)
          }), Yo({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: V(({ shown: y }) => [
                H(os, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          H(Gf, {
            buttons: (w = a.value) == null ? void 0 : w.buttons,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Qf));
    };
  }
}, s1 = /* @__PURE__ */ J(n1, [["__scopeId", "data-v-51e964ed"]]), a1 = ["data-ref"], o1 = ["inert"], r1 = { class: "thread-group" }, i1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = W(!1), s = W(!1);
    ke(n, () => s.value = !0);
    const a = I(() => ({
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
      H(oo, {
        mark: a.value,
        open: n.value,
        onClick: r[0] || (r[0] = (i) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (l(), d("div", {
        key: 0,
        class: ee(["group-rows", { open: n.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", r1, [
          (l(!0), d(Z, null, re(e.group.marks, (i) => (l(), Y(s1, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, o1)) : j("", !0)
    ], 8, a1));
  }
}, vv = /* @__PURE__ */ J(i1, [["__scopeId", "data-v-8a285510"]]);
function l1(e) {
  const t = W(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return De(() => n.observe(e.value)), Tt(() => n.disconnect()), t;
}
const c1 = { class: "chat-dock-fold" }, u1 = ["aria-label"], d1 = { class: "chat-dock-head" }, h1 = { class: "chat-dock-inner" }, f1 = 700, p1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = W(null), s = W(null), a = l1(s), o = W(!1);
    let r = 0;
    return De(() => r = setTimeout(() => o.value = !0, f1)), Tt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: ee(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", c1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: ee(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          $e(i.$slots, "edge"),
          p("header", d1, [
            $e(i.$slots, "head")
          ]),
          p("div", {
            class: ee(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", h1, [
              p("div", {
                class: ee(["chat-dock-grow", { settled: o.value }]),
                style: we(z(a) === null ? null : { height: `${z(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  $e(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, u1)
      ])
    ], 2));
  }
}, fo = /* @__PURE__ */ J(p1, [["__scopeId", "data-v-63e4dcfc"]]), m1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Tn = 5, g1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Tn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Tn}s`, animationDelay: `${(n - Tn).toFixed(2)}s` };
    return (a, o) => (l(), d("span", m1, [
      p("i", { style: s })
    ]));
  }
}, v1 = /* @__PURE__ */ J(g1, [["__scopeId", "data-v-d0c4b012"]]), po = uo("/api/docks", "docks"), yv = po.fetchAll, is = po.find, y1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), oa = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function w1(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [oa("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || vn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    oa("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const k1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: y1(e, t),
  buttons: w1(e, t)
}), b1 = { class: "dock-title" }, $1 = ["aria-expanded", "title"], x1 = { class: "chat-dock-acts dock-acts" }, _1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, M1 = {
  key: 1,
  class: "dock-text"
}, S1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = I(() => is(s.item.type)), o = W(null), r = I(() => k1(s.item, a.value)), i = je(Pe), c = W(/* @__PURE__ */ new Set()), u = W("");
    async function f(A) {
      if (A.action === "open") return yt(`${s.item.target_model}:${s.item.target_id}`);
      if (A.action !== "declared") return rs(A, s.item, i.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, A.label]), u.value = "";
      const D = await rs(A, s.item, i.environment);
      (D == null ? void 0 : D.ok) === !1 && (c.value = new Set([...c.value].filter((w) => w !== A.label)), u.value = D.error);
    }
    const m = I(() => r.value.buttons.filter((A) => A.action !== "undock" && !c.value.has(A.label))), E = I(() => r.value.buttons.find((A) => A.action === "undock"));
    return (A, D) => (l(), Y(fo, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: V(() => [
        e.leaving ? (l(), Y(v1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : j("", !0)
      ]),
      head: V(() => {
        var w, y, T;
        return [
          (w = a.value) != null && w.draws_head ? (l(), d("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(Z, { key: 1 }, [
            H(Me, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", b1, b(r.value.title), 1)
          ], 64)),
          (y = a.value) != null && y.badge ? (l(), d("span", {
            key: 2,
            class: ee(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, b(a.value.badge), 3)) : j("", !0),
          (T = a.value) != null && T.draws_head ? j("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: D[0] || (D[0] = (P) => n("fold"))
          }, [
            H(sn, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, $1)),
          p("span", x1, [
            (l(!0), d(Z, null, re(m.value, (P) => (l(), Y(ye, {
              key: P.action + P.runs,
              small: "",
              kind: P.primary ? "primary" : "ghost",
              bordered: !P.primary,
              "data-dock-action": P.action,
              onClick: (X) => f(P)
            }, {
              default: V(() => [
                he(b(P.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          H(ms, {
            title: E.value.label,
            "data-dock-action": "undock",
            onClick: D[1] || (D[1] = (P) => f(E.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var w, y;
        return [
          u.value ? (l(), d("p", _1, b(u.value), 1)) : j("", !0),
          e.item.text && !((w = a.value) != null && w.body_url) ? (l(), d("p", M1, b(e.item.text), 1)) : j("", !0),
          (y = a.value) != null && y.body_url ? (l(), Y(os, {
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
}, ra = /* @__PURE__ */ J(S1, [["__scopeId", "data-v-608c189e"]]), E1 = ["title", "aria-label"], A1 = { class: "run-chip-in" }, C1 = {
  key: 0,
  class: "run-chip-ring"
}, O1 = { class: "run-chip-name" }, T1 = { class: "run-chip-bar" }, B1 = "processes.output", I1 = 3e3, L1 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var m;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((m = je(Pe, null)) == null ? void 0 : m.environment) ?? "", o = W(null), r = I(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = I(() => {
      var E, A;
      return ((E = o.value) == null ? void 0 : E.title) || ((A = o.value) == null ? void 0 : A.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = I(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const E = await St(B1, ["process", "card", String(s.item.target_id)], a);
      E.ok && (o.value = E.value);
    }
    const f = setInterval(() => r.value && u(), I1);
    return Se(() => clearInterval(f)), u(), (E, A) => {
      var D;
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: we({ "--tone": c.value })
      }, [
        p("span", A1, [
          r.value ? (l(), d("span", C1)) : (l(), Y(Xe, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", O1, b(i.value), 1)
        ]),
        p("span", T1, [
          p("i", {
            style: we({ width: r.value ? `${((D = o.value) == null ? void 0 : D.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, E1);
    };
  }
}, R1 = /* @__PURE__ */ J(L1, [["__scopeId", "data-v-10c2365f"]]), D1 = 24, N1 = 8, wv = 420;
function kv({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= D1 && e > t ? !0 : e < t && a > N1 ? !1 : null;
}
const j1 = (e, t) => e === void 0 ? t : e, P1 = 6, q1 = 3, ia = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, mo = (e) => !!(e.leaves_at && !e.kept), W1 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!mo(e) || t < e.leaves_at || n.has(e.id)), F1 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => W1(s, t, n)).sort((s, a) => s.id - a.id);
function H1(e, t, n = P1) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const U1 = (e, t) => e >= q1 ? !0 : e <= 1 ? !1 : t, V1 = { class: "dock-stack" }, z1 = ["onMouseenter", "onMouseleave"], K1 = {
  key: 0,
  class: "dock-runs-head"
}, G1 = ["onMouseenter", "onMouseleave"], Y1 = { class: "dock-runs-chips" }, J1 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = W(Date.now() / 1e3), s = W(/* @__PURE__ */ new Set()), a = W(!1), o = W(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Se(() => clearInterval(r));
    const i = I(() => F1(t.items, n.value, s.value)), c = I(() => H1(i.value.filter((P) => ia(P, is)), n.value)), u = I(() => i.value.filter((P) => !c.value.includes(P) && !ia(P, is))), f = I(() => (a.value = U1(c.value.length, a.value)) && !o.value), m = W({}), E = (P) => j1(m.value[P.id], t.folded);
    function A(P) {
      m.value = { ...m.value, [P.id]: !E(P) };
    }
    function D(P) {
      m.value = { ...m.value, ...Object.fromEntries(c.value.map((X) => [X.id, X.id !== P.id])) }, o.value = !0;
    }
    function w() {
      m.value = Object.fromEntries(Object.entries(m.value).filter(([P]) => !c.value.some((X) => String(X.id) === P))), o.value = !1;
    }
    function y(P) {
      s.value = /* @__PURE__ */ new Set([...s.value, P.id]);
    }
    function T(P) {
      s.value = new Set([...s.value].filter((X) => X !== P.id));
    }
    return (P, X) => (l(), d("div", V1, [
      (l(!0), d(Z, null, re(u.value, ($) => (l(), d("div", {
        key: $.id,
        onMouseenter: (v) => y($),
        onMouseleave: (v) => T($)
      }, [
        H(ra, {
          item: $,
          leaving: z(mo)($) && !s.value.has($.id),
          folded: E($),
          onFold: (v) => A($)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, z1))), 128)),
      a.value && o.value ? (l(), d("div", K1, [
        p("button", {
          type: "button",
          class: "dock-runs-toggle",
          "aria-expanded": "true",
          title: "Fold the runs into one line",
          "data-dock-runs-fold": "",
          onClick: w
        }, [
          he(b(c.value.length) + " runs ", 1),
          H(sn, { open: "" })
        ])
      ])) : j("", !0),
      (l(!0), d(Z, null, re(f.value ? [] : c.value, ($) => (l(), d("div", {
        key: $.id,
        onMouseenter: (v) => y($),
        onMouseleave: (v) => T($)
      }, [
        H(ra, {
          item: $,
          folded: E($),
          onFold: (v) => A($)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, G1))), 128)),
      f.value ? (l(), Y(fo, {
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
            onClick: X[0] || (X[0] = ($) => o.value = !0)
          }, [
            H(Xe, { name: "runs" }),
            he(" " + b(c.value.length) + " runs ", 1),
            H(sn)
          ]),
          p("span", Y1, [
            (l(!0), d(Z, null, re(c.value, ($) => (l(), Y(R1, {
              key: $.id,
              item: $,
              onClick: (v) => D($)
            }, null, 8, ["item", "onClick"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["label"])) : j("", !0)
    ]));
  }
}, bv = /* @__PURE__ */ J(J1, [["__scopeId", "data-v-05bde3f3"]]), Mt = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Gt = (e) => Math.min(Math.max(e, 0), 1), Z1 = (e) => {
  const t = Gt(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => Z1((e - t) / (n - t));
function $v(e) {
  const t = Gt(e), n = Gt((t - 0.12) / 0.76) * Mt.shuffles, s = Math.min(Math.floor(n), Mt.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), r = et(a, 0.38, 0.76), i = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), c = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), u = Math.sin(Math.PI * Gt((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / Mt.shuffles, lift: Mt.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const go = 2400, X1 = 0.05;
function xv({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, X1), r = Math.min(t + go * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
const Je = {
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
}, ls = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Q1 = (e) => e * e * (3 - 2 * e), on = (e, [t, n]) => Q1(ls(e, t, n)), ep = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ge = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Ht = ([e, t], n) => e + n() * (t - e);
function tp(e) {
  return ep.map(() => {
    const t = Ht(Ge.speed, e), n = Ht(Ge.angle, e) * Math.PI / 180, s = Ht(Ge.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Ht(Ge.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const np = tp(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function sp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ge.gravity * (t[2] - Ge.floor))) / Ge.gravity;
}
function _v(e, t, n = np) {
  const s = Je.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = sp(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const c = Math.min(a, r), u = s.from.map((f, m) => f + o.velocity[m] * c);
  return u[2] -= Ge.gravity * c * c / 2, { at: u, turn: o.spin * c, landed: Math.max(0, a - r) / i };
}
function Mv(e, t) {
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
const Sv = () => Array.from({ length: Je.pogo.count }, (e, t) => Je.pogo.bounce * (t + 1) / Je.pogo.count), Ev = { stride: 0.5 };
function vo(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: ls(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: ls(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Av(e) {
  const { into: t, out: n } = vo(Je.rope_swing, e);
  return 1 - on(t, [0, 1]) * (1 - on(n, [0, 1]));
}
function Cv(e) {
  const t = Je.rope_swing, { into: n, out: s } = vo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return on(n, [0, 1]) * (1 - on(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const ap = { after: 3 }, op = 10, rp = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, ip = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, lp = { weight: 19 }, cp = {
  build: { cooldown: 180 }
}, up = { every: 120 }, yo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, wo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, dp = {
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
}, Rt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: op }), Q = (e, t, n = {}) => Rt(e, "clip", t, n), Bn = (e, t, n = {}) => Rt(e, "look", t, n), la = (e, t, n = {}) => Rt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Rt(e, "pick", t, n), ...s }), pe = (e) => Rt("nothing", "nothing", e, {}), hp = 120, fp = 300, In = (e, t) => ({ ...Q(e, t), cooldown: fp }), pp = 120, te = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), mp = () => [Q("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...Q(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: rp[e.name] }), _t = (e) => ({ ...e, shenanigan: !0, lasts: ip[e.name] }), xs = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...te("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [Q("nod", 2), pe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...te("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...nt(Q("bug_shot", 3)), toward: "", onto: !1 },
    { ...nt(Q("bug_smash", 2)), toward: "", onto: !1 },
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
  ...te("messaged", { cooldown: pp }, [Q("phone_call", 1)]),
  ...te("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [Q("nod", 4), Q("hand_rub", 4), pe(7)]),
  ...te("question_asked", { cooldown: 60 }, [Q("ask_sign", 9), Q("look_up", 3), pe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...te("reported", { cooldown: 90 }, [la("read", 3), Q("nod", 1), pe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...te("read_message", { cooldown: 30 }, [la("read", 3), pe(1)]),
  ...te("fact_filed", { cooldown: 120 }, [Q("file_card", 3), Q("nod", 1), pe(6)]),
  ...te("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [Q("nod", 2), pe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...te("bar_done", { holds: !0 }, mp()),
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
  ...Object.entries(dp).flatMap(([e, t]) => te(`reacted:${e}`, {}, [Bn(t, 1)])),
  ...Object.entries(yo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => te(`agent_reacted:${n}`, {}, [Q(s, 1, { voices: [e] })])[0])),
  ...Object.entries(wo).flatMap(([e, t]) => te(`agent_reacted:${e}`, {}, [Q(t, 1)])),
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
    { ..._t(nt(Q("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    _t(nt(Q("disco", 2, { ball: "bubble" }))),
    pe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...te("held:search", { cooldown: hp }, [In("search", 3), { ...In("binoculars", 2), when: { home: !0 } }, { ...In("glass_bubble", 2), when: { bubble: !0 } }]),
  ...te("held:type", {}, [Q("type", 3), Q("type_ponder", 1)]),
  ...te("held:watch", {}, [Q("watch", 2), Q("wave_up", 1)]),
  ...te("held:compacting", {}, [Q("pack_box", 3), Q("vacuum", 2), Q("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...te("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), pe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...te("tickled", {}, [{ ...nt(Q("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...te("eager", {}, [Q("eager", 2, { slow: !0 }), pe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...te("jump", {}, [_t(nt(Q("backflip", 7, { high: !0 }))), Q("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...te("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...te("unit", { cooldown: cp.build.cooldown }, [ce("unit", lp.weight), pe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...te("progress_jump", { cooldown: 6 }, [Q("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...te("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...te("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...te("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: up.every }, ce("stand", 5)]),
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
], gp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), ko = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), vp = (e) => Array.isArray(e) ? e[0] : e, yp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function wp(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || ko(f).every(([m, E]) => n(m) >= vp(E)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = xs.filter((f) => gp(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= ap.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = i.filter((f) => {
    var m;
    return f.kind === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return c.some((f) => f.kind !== "nothing") ? c : i;
}
function kp(e, t) {
  const n = wp(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (bo(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function bo(e, t, n) {
  var s;
  for (const [a, o] of ko(t)) (s = e.memory) == null || s.set(a, e.now + yp(o, n));
}
function Ov(e, t, n) {
  bo(e, xs.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const ca = {
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
}, Tv = {
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
}, Bv = 120, Iv = (e) => ca[e] || ca.idle;
[.../* @__PURE__ */ new Set([...Object.values(yo).flatMap((e) => Object.keys(e)), ...Object.keys(wo)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function Lv(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Te.ahead * n ? 180 : Math.sign(s) * Te.turn;
}
const ua = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Rv(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Te.sweep) % a, i = o % Te.sweep, c = Te.sweep - Te.returnSeconds, u = ua((i - c) / Te.returnSeconds), f = i <= c ? ua(i / c) : 1 - u, m = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + m * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const bp = 1, $p = (e, t, n, s, a, o = 0) => kp({ moment: "jump", high: e > bp * t, memory: s, now: a, room: o }, n).name === "backflip", da = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, Dv = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, Nv = { width: 24, height: 27, top: 3, units: 2 }, xp = "[data-figure-pile]", jv = { amber: [1, 0.69, 0.125], good: da.colours.good, bad: da.colours.bad }, Ln = { phases: 4, dim: 0.25 }, Pv = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, _p = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(xs.filter((e) => _p.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const qv = {
  width: 84,
  belly: 13,
  blink: 4
}, ha = "[data-figure-home]", Dt = () => {
  var t;
  const e = document.querySelector(ha);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ha)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Mp = "[data-figure-docked-bars]", Sp = "[data-figure-chat-foot]", Ep = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Ap = "[data-figure-newest]";
function Cp() {
  var s, a;
  const e = (s = Dt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Ap), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
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
function $o(e, t, n = Cp()) {
  if (!e || !n) return !0;
  const s = wt(e, t), a = Ms(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ye.top * t.size, bottom: s.top + Ye.bottom * t.size }, r = Mt.gap;
  return !Mo(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const Rn = 0.26, Op = 0.54, kn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Rn, travels: "stand" },
  lounge: { drop: Rn, travels: "stand" },
  composed: { drop: Rn, travels: "stand" },
  hang: { drop: Op, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, xo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Tp = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Wv = (e, t) => (e === "sit" ? Tp.has(t) : xo.has(e)) ? e : "stand", Fv = 0.25, Hv = (e, t) => xo.has(e) && kn[t].drop === 0, _o = 2, Bp = 90, Ip = 180, Lp = 140, Rp = 280, Dp = 420, Np = 0.25, jp = 290, Pp = 600, qp = "cubic-bezier(0.2, 0.7, 0.4, 1)", Wp = "cubic-bezier(0.55, 0, 0.9, 0.6)", Dn = 5;
function rn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: f = 0, room: m = 0, pogo: E = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Dn) return null;
  (r || i) && (o = Math.max(o, _o));
  const A = o > 1, D = Math.abs(t.x - e.x), w = D < Dn ? 0 : D / (Bp * o) * 1e3, y = Math.min(w, A ? Lp : Ip), T = Math.abs(t.y - e.y), P = t.y < e.y, X = P && !E && $p(T, n, c, u, f, m), $ = P ? Dp + Math.min(T, 400) * Np : Math.sqrt(2 * T / go) * 1e3, v = {
    x: t.x,
    y: t.y,
    ms: T > Dn ? X ? Pp : $ : 0,
    lead: X ? jp : P ? Rp : 0,
    easing: P ? qp : Wp,
    hopping: !0,
    clip: X ? "backflip" : P ? "jump" : "fall"
  }, F = { x: t.x, y: t.y, ms: w + y, lead: 0, easing: "linear", ramp: y, ...A ? { clip: "run" } : {} }, M = E ? Fp(t, n) : v, N = P && !s ? [{ ...F, y: e.y }, M] : [{ ...v, x: e.x }, F];
  return { way: Math.sign(t.x - e.x) || 1, legs: N, lands: !a, pace: o, running: A };
}
const Fp = (e, t) => ({ x: e.x, y: e.y, ms: Je.pogo.frames / Je.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), wt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - kn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Mo = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, _s = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function kt() {
  var t;
  const e = (t = Dt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Ut = 0.5, fa = 20;
function Uv(e, t, n = kt()) {
  const s = wt(e, t);
  return s.left >= n.left + fa && s.right <= n.right - fa;
}
function So(e, t, n = kt()) {
  const s = wt(e, t), a = s.right - s.left, o = Ms(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Ut && i <= n.right + Ut && s.top >= n.top - Ut && c <= n.bottom + Ut;
}
const ln = [0.35, 0.5, 0.65], cn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ye = { left: ln[0], right: ln.at(-1), top: cn[0], bottom: cn.at(-1) }, Hp = 0.24;
function Ms(e) {
  if (e.posture === "stand") return { left: Ye.left, right: Ye.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Hp * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ye.left, t), right: Math.max(Ye.right, t) };
}
function Up(e, { size: t }, n = kt()) {
  const s = Ms(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Vp = (Ye.right - Ye.left) / 2 + 0.08;
function zp(e, t, n = "", s = "") {
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
const Kp = (e) => cn.flatMap(
  (t) => ln.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Gp(e, t, n = "") {
  if (!$o(e, t)) return ln.length * cn.length;
  const s = wt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Ep)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && Mo(a, c) && _s(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return Kp(a).filter(([i, c]) => r(i, c) || zp(i, c, n)).length;
}
function Yp(e, t, n) {
  const s = kt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => So(r, t, s) && $o(r, t)).map((r) => ({ spot: r, covered: Gp(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Eo = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Jp = Vp, Zp = (e, t, { size: n }, s = Jp) => Xp(e, Eo[t], s * n, "stand");
function Xp(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Vv = (e) => ((e + 180) % 360 + 360) % 360 - 180, zv = { turns: [-20, -10, 0, 10, 20] }, Qp = 7;
function em() {
  const e = [...document.querySelectorAll(xp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const tm = 4;
function nm() {
  const e = Ao(), t = em(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > tm || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Qp - n, 0) } };
}
const Kv = ({ size: e, below: t }) => (1 - t) * e;
function sm(e, t) {
  const n = kt(), { size: s, below: a } = t, o = kn[e.posture].drop * s;
  return { ...Up(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const am = (e, t) => Object.keys(Eo).map((n) => sm(Zp(e, n, t), t)), om = (e, t, n) => Yp(e, t, n) ?? e[0];
function Gv(e, t) {
  const { element: n, edge: s } = nm();
  return { ...om(am(s, e), e, t), view: null, on: n };
}
function Ao() {
  var s;
  const e = Dt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Mp);
  if (!t) return { ...Co(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Co() {
  const e = Dt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const rm = { climb: 90 };
function Yv(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: f = 0, room: m = 0, pogo: E = !1 } = {}) {
  (o || r) && (a = Math.max(a, _o));
  const A = (X) => {
    const $ = wt(X, n, kn[X.posture].travels);
    return { x: $.left, y: $.top };
  }, D = t.ladder ?? e.ladder;
  if (D && !(t.ladder && e.ladder)) return im(A(e), A(t), A({ ...D.foot, posture: "stand" }), D.way, !!t.ladder, n, a);
  const [w, ...y] = [e, ...c, t].map(A), T = rn(w, y[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: f, room: m, pogo: E }), P = y.slice(1).map((X, $) => {
    var v;
    return (v = rn(y[$], X, n.size, { random: i, memory: u, now: f, room: m })) == null ? void 0 : v.legs.find((F) => F.hopping);
  });
  return T && { ...T, legs: [...T.legs, ...P.filter(Boolean)] };
}
function im(e, t, n, s, a, o, r) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / rm.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? rn(e, n, o.size, { pace: r }) : rn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const lm = "[data-figure-bubble]", cm = 250;
let Et = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Oo = 0;
const To = () => Et, Nn = /* @__PURE__ */ new WeakMap();
let um = 0;
function Bo(e) {
  return Nn.has(e) || Nn.set(e, `floor-${++um}`), Nn.get(e);
}
const dm = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, hm = () => {
  var e, t;
  return ((t = (e = Dt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function fm(e, t) {
  var s;
  const n = (s = e.querySelector(Sp)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function pm(e, t) {
  const n = e && fm(e, t), s = e ? [...e.querySelectorAll(lm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || dm(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Bo(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const mm = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= cm ? (t.top - s.top) / a * 1e3 : 0;
};
function gm(e = Et, t = performance.now()) {
  const n = kt(), s = hm(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = Ao(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = Co();
  return u.element && c.push({ id: Bo(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...pm(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((f) => Object.freeze({ ...f, vy: mm(e, f, t) }))) });
}
const cs = /* @__PURE__ */ new Set();
function vm(e) {
  return cs.add(e), () => cs.delete(e);
}
function ym() {
  Io();
  const e = () => {
    Oo = requestAnimationFrame(e), !document.hidden && (Et = gm(Et), cs.forEach((t) => t(Et)));
  };
  e();
}
function Io() {
  cancelAnimationFrame(Oo);
}
const wm = (e, t) => e.find((n) => n.id === t) ?? null;
function Jv(e, t, n = To().floors) {
  const s = wm(n, "home");
  return e.posture === "hang" && s && wt(e, t).bottom >= s.top ? !1 : So(e, t);
}
const km = ["data-kind"], bm = { class: "figure-floor-name" }, $m = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: we({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", bm, b(e.floor.kind), 1)
    ], 12, km));
  }
}, xm = /* @__PURE__ */ J($m, [["__scopeId", "data-v-8f6132da"]]), _m = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Mm = {
  __name: "FigureFloors",
  setup(e) {
    const t = dn(To().floors);
    let n = () => {
    };
    return De(() => {
      n = vm((s) => t.value = s.floors), ym();
    }), Se(() => {
      n(), Io();
    }), (s, a) => (l(), d("div", _m, [
      (l(!0), d(Z, null, re(t.value, (o) => (l(), Y(xm, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Zv = /* @__PURE__ */ J(Mm, [["__scopeId", "data-v-e519168b"]]), jn = (e) => typeof e == "number" ? e : Date.parse(e);
function Xv(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: jn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => jn(a.row.created_at) - jn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Sm = 3, Pn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Em(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Pn[n.grouping]) == null ? void 0 : s.call(Pn, e.row, n)) || "";
}
function Am(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Qv(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Sm ? [Am(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = Em(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Cm = 1e3;
function ey() {
  const e = W(Date.now()), t = setInterval(() => e.value = Date.now(), Cm);
  return Tt(() => clearInterval(t)), e;
}
function ty(e) {
  const t = ps(), n = W(null), s = W("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const Om = {
  class: "cards-page",
  "data-window-flush": ""
}, Tm = { class: "cards-bar" }, Bm = { class: "cards-count" }, Im = { class: "cards" }, Lm = {
  key: 1,
  class: "cards-note"
}, Rm = {
  key: 2,
  class: "cards-note"
}, Dm = ["data-row", "onClick"], Nm = { class: "card-head" }, jm = { class: "card-age" }, Pm = { class: "card-title" }, qm = { class: "card-foot" }, Wm = {
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
    return (s, a) => (l(), d("div", Om, [
      p("div", Tm, [
        p("span", Bm, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
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
            he(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", Im, [
        e.loaded ? e.failure ? (l(), d("p", Lm, b(e.failure), 1)) : e.rows.length ? j("", !0) : (l(), d("p", Rm, "No " + b(e.noun) + "s yet", 1)) : (l(), Y(vt, {
          key: 0,
          shape: "cards"
        })),
        (l(!0), d(Z, null, re(e.rows, (o) => (l(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          p("span", Nm, [
            H(Me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            he(" " + b(e.head(o)), 1),
            p("span", jm, b(z(Gn)(o.created_at)), 1)
          ]),
          p("span", Pm, b(e.title(o)), 1),
          p("span", qm, b(e.foot(o)), 1)
        ], 8, Dm))), 128))
      ]),
      $e(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ny = /* @__PURE__ */ J(Wm, [["__scopeId", "data-v-d72d528d"]]), pa = "newest";
function sy(e, { title: t, isOpen: n = null }) {
  const s = W(""), a = W(pa), o = W("all"), r = I(() => {
    const i = s.value.trim().toLowerCase(), c = e.value.filter((u) => (!i || JSON.stringify(u).toLowerCase().includes(i)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === pa ? c : [...c].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: r, hasStates: !!n };
}
const Fm = {
  class: "list-tools",
  "data-list-tools": ""
}, Hm = {
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
    return (s, a) => (l(), d("div", Fm, [
      H(ih, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      H(ss, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (l(), Y(ss, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : j("", !0)
    ]));
  }
}, ay = /* @__PURE__ */ J(Hm, [["__scopeId", "data-v-b2dd0a0d"]]);
function oy() {
  const e = W(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Um = 86400, us = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Vm(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((us(t) - us(e)) / Um);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function ry(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = us(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Vm(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const qn = 280, Wn = 240, Fn = 120, zm = 6, Km = 14, Ot = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Gm(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Km}px)` }), e.offsetHeight, e.style.transition = `height ${qn}ms ${Ot}`, e.style.height = `${r}px`;
  const i = a();
  let c = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - i;
    if (!c && f >= qn && (c = !0, e.style.transition = `opacity ${Wn}ms ease-out, transform ${Wn}ms ${Ot}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < qn + Wn) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function iy(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${zm}px)` }), e.offsetHeight, e.style.transition = `opacity ${Fn}ms ease-out, transform ${Fn}ms ${Ot}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - r < Fn) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const Ym = 140, Vt = 220, Jm = 5;
function ly({ gap: e = Ym, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, Jm);
    if (s = i.length > 0, !s) return;
    let c = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), c -= 1, c || t(o, e);
      });
  }
  const r = (i, c, u, f = Gm) => {
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
function cy(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Vt}ms ${Ot}, opacity ${Vt}ms ease-in, margin ${Vt}ms ${Ot}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Vt);
}
const Lo = "chat.pins.minimised", Yt = W(At(Lo, !1));
function ma(e) {
  Yt.value = e, fn(Lo, e);
}
function Zm(e) {
  const t = I(() => e()), n = I(() => Yt.value ? [] : e()), s = () => ma(!Yt.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Oa(o) > a).length,
    (o, r) => o > r && ma(!1)
  ), { pins: t, visible: n, minimised: Yt, toggle: s };
}
const Xm = ["title"], Qm = {
  key: 0,
  class: "pins-count"
}, e0 = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Zm(() => t.notices);
    return (o, r) => z(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: ee(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = _e((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      H(Me, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (l(), d("span", Qm, b(z(n).length), 1)) : j("", !0)
    ], 10, Xm)) : j("", !0);
  }
}, uy = /* @__PURE__ */ J(e0, [["__scopeId", "data-v-c0d11526"]]), t0 = ["title"], n0 = ["title"], s0 = { class: "diff-card-dir" }, a0 = { class: "diff-card-name" }, o0 = { class: "diff-card-ago" }, r0 = ["title"], i0 = ["title"], l0 = {
  key: 0,
  class: "diff-card-note"
}, c0 = ["href"], u0 = ["src", "alt"], d0 = { class: "diff-card-rows" }, h0 = { class: "diff-row-num" }, f0 = { class: "diff-row-sign" }, p0 = { class: "diff-row-code" }, m0 = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = I(() => n.path.lastIndexOf("/") + 1), u = I(() => n.path.slice(0, c.value)), f = I(() => n.path.slice(c.value)), m = I(() => n.kind === "deleted"), E = I(() => r[n.kind]), A = I(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), D = W("after"), w = I(() => D.value === "before" ? n.whole.old : n.whole.text), y = I(() => n.whole && n.whole.text !== void 0 ? w.value.split(`
`).map((S, g) => ({ line_type: D.value === "after" && A.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), T = W(!1), P = I(() => n.lines && !T.value && !n.whole), X = I(() => P.value ? y.value.slice(0, n.lines) : y.value), $ = I(() => y.value.length - X.value.length), v = (S) => S.line === null || S.line_type === "del" ? "" : S.line, F = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, M = W(null), N = W(null);
    let x = null;
    return De(() => {
      if (!N.value) return;
      let S = !0;
      x = new ResizeObserver(() => {
        !M.value || !N.value || (M.value.style.transition = S ? "none" : "", M.value.style.height = `${N.value.offsetHeight}px`, S = !1);
      }), x.observe(N.value);
    }), Se(() => x && x.disconnect()), (S, g) => (l(), d("section", {
      class: ee(["diff-card", { half: e.half, gone: m.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
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
          p("span", s0, b(u.value), 1),
          p("span", a0, b(f.value), 1),
          E.value ? (l(), d("span", {
            key: 0,
            class: ee(["diff-card-badge", e.kind])
          }, b(E.value), 3)) : j("", !0)
        ], 8, n0),
        p("span", {
          class: ee(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        p("span", {
          class: ee(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        p("span", o0, b(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: D.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[0] || (g[0] = _e((h) => D.value = D.value === "after" ? "before" : "after", ["stop"]))
        }, b(D.value === "after" ? "After" : "Before"), 9, r0)) : j("", !0),
        m.value ? j("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: ee(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[1] || (g[1] = _e((h) => s("whole"), ["stop"]))
        }, [
          H(Me, {
            name: "file",
            size: 12
          })
        ], 10, i0))
      ], 8, t0),
      e.whole && e.whole.error ? (l(), d("p", l0, b(e.whole.error), 1)) : j("", !0),
      !m.value && !e.folded ? (l(), d(Z, { key: 1 }, [
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
          }, null, 8, u0)
        ], 8, c0)) : (l(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: M,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: N,
            class: "diff-card-diff"
          }, [
            p("div", d0, [
              (l(!0), d(Z, null, re(X.value, (h, O) => (l(), d("div", {
                key: O,
                class: ee(["diff-row", h.line_type, { fresh: e.fresh && h.edit === e.fresh }])
              }, [
                p("span", h0, b(v(h)), 1),
                p("span", f0, b(i[h.line_type]), 1),
                p("span", p0, b(F(h)), 1)
              ], 2))), 128)),
              $.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[3] || (g[3] = _e((h) => T.value = !0, ["stop"]))
              }, b($.value) + " more " + b($.value === 1 ? "line" : "lines"), 1)) : j("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : j("", !0)
    ], 2));
  }
}, dy = /* @__PURE__ */ J(m0, [["__scopeId", "data-v-b6424f6e"]]), g0 = {
  key: 0,
  class: "menu-item-text"
}, v0 = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.description ? (l(), d("span", g0, [
        p("span", null, [
          $e(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, b(e.description), 1)
      ])) : $e(t.$slots, "default", {}, void 0, !0, 1)
    ], 2));
  }
}, y0 = /* @__PURE__ */ J(v0, [["__scopeId", "data-v-5b5c4fd9"]]), w0 = {}, k0 = { class: "menu-label" };
function b0(e, t) {
  return l(), d("span", k0, [
    $e(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $0 = /* @__PURE__ */ J(w0, [["render", b0], ["__scopeId", "data-v-aa955b3e"]]), Ro = /* @__PURE__ */ new WeakMap(), x0 = (e, t) => Ro.set(e, t);
function _0(e, t) {
  for (let n = t; n; n = Ro.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function M0(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !_0(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Se(() => window.removeEventListener("click", n));
}
const ut = 8, S0 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = W(null), o = (h) => h ? `${h}px` : void 0, r = I(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = W({ w: 0, h: 0 }), c = W(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), m = (h) => {
      const O = h.closest(".pane, .float-window");
      return O ? f(O.getBoundingClientRect()) : u();
    }, E = (h, O) => `${Math.max(0, h ? Math.min(h, O) : O)}px`;
    function A(h, O) {
      return {
        below: h.bottom - O.bottom - s.gap - ut,
        above: O.top - h.top - s.gap - ut,
        across: h.right - h.left - 2 * ut
      };
    }
    function D(h) {
      const O = m(s.anchor), k = A(O, h);
      return i.value.w <= k.across && i.value.h <= Math.max(k.below, k.above) ? O : u();
    }
    const w = I(() => {
      if (!c.value) return r.value;
      const h = c.value, O = D(h), k = A(O, h), { w: C, h: U } = i.value, oe = s.align === "auto" ? h.left + h.right > O.left + O.right : s.align === "right", de = mi(oe ? h.right - C : h.left, O.left + ut, Math.max(O.left + ut, O.right - C - ut)), me = U > k.below && k.above > k.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: E(s.maxHeight, k.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: E(s.maxHeight, k.below) };
      return { ...r.value, ...me, left: `${de}px`, maxWidth: E(s.maxWidth, k.across) };
    }), y = n, T = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function P(h) {
      const O = T(), k = O.indexOf(document.activeElement);
      O[(k + h + O.length) % O.length].focus();
    }
    const X = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => y("close") }, $ = (h) => X[h.key] && (h.preventDefault(), X[h.key]()), v = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let F = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(F), F = requestAnimationFrame(v);
    });
    M0(a, (h) => s.anchor && !s.anchor.contains(h.target) && y("close"));
    const N = (h, O) => ["top", "left", "right", "bottom"].some((k) => Math.abs(h[k] - O[k]) > 1), x = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let S = 0;
    function g() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || x(h)) return y("close");
        N(h, c.value) && (c.value = h);
      }
      S = requestAnimationFrame(g);
    }
    return De(() => {
      s.anchor && a.value && x0(a.value, s.anchor), v(), a.value && M.observe(a.value), !s.plain && T()[0] && T()[0].focus(), g();
    }), Se(() => {
      M.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(F);
    }), t({ element: a }), (h, O) => (l(), Y(ya, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", at({
        ref_key: "panel",
        ref: a
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: w.value,
        onKeydown: $
      }), [
        $e(h.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), E0 = /* @__PURE__ */ J(S0, [["__scopeId", "data-v-3d203970"]]), A0 = {
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
        H(Me, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, C0 = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [{ word: "approve", label: "Approve", main: !0 }, He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, O0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, T0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], B0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], I0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], L0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], R0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], D0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? R0(t) : e === "agent" ? [...I0(t), ...B0(t)] : e === "check" ? L0(t) : e === "question" ? T0(t) : ((n = { plan: C0, task: O0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, N0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, j0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, P0 = { class: "ask-text" }, q0 = ["placeholder", "aria-label"], W0 = ["placeholder", "aria-label"], F0 = {
  key: 3,
  class: "moves"
}, H0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = I(() => D0(s.kind, s.row)), r = W(""), i = W(null), c = W(""), u = W("");
    ke(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function f(A, D = "") {
      const w = await s.read([A.noun ?? s.kind, A.word, String(s.id), ...A.flag ? [A.flag, D] : A.positional ? [D] : [], ...A.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = w.ok ? "" : w.error, w.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const m = (A) => A.confirm ? i.value = A : A.said ? f(A, A.said) : A.flag || A.positional ? (i.value = A, c.value = "") : f(A), E = () => c.value.trim() && f(i.value, c.value.trim());
    return t({ moves: o, press: m }), (A, D) => {
      var w;
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: ee(["foot", { inline: e.inline }])
      }, [
        r.value ? (l(), d("p", N0, b(r.value), 1)) : j("", !0),
        (w = i.value) != null && w.confirm ? (l(), d("div", j0, [
          p("span", P0, b(i.value.confirm), 1),
          H(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: D[0] || (D[0] = (y) => f(i.value))
          }, {
            default: V(() => [
              he(b(i.value.label), 1)
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
          onSubmit: _e(E, ["prevent"])
        }, [
          mt(p("input", {
            "onUpdate:modelValue": D[2] || (D[2] = (y) => c.value = y),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: D[3] || (D[3] = Jt(_e((y) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, q0), [
            [zn, c.value]
          ]),
          i.value.opener ? mt((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": D[4] || (D[4] = (y) => u.value = y),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: D[5] || (D[5] = Jt(_e((y) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, W0)), [
            [zn, u.value]
          ]) : j("", !0),
          H(ye, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: V(() => [
              he(b(i.value.label), 1)
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
        ], 32)) : (l(), d("div", F0, [
          (l(!0), d(Z, null, re(o.value, (y) => (l(), Y(ye, {
            key: y.word,
            small: "",
            kind: y.main ? "primary" : "ghost",
            "data-move": y.word,
            onClick: (T) => m(y)
          }, {
            default: V(() => [
              he(b(y.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : j("", !0);
    };
  }
}, U0 = /* @__PURE__ */ J(H0, [["__scopeId", "data-v-fffa0bf6"]]), V0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, z0 = { ...V0, done: "Completed" }, K0 = { class: "task-status-icon" }, G0 = ["width", "height", "aria-label"], Y0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", K0, [
      H(un, {
        name: "turn",
        mode: "out-in"
      }, {
        default: V(() => [
          (l(), d("svg", {
            key: e.status,
            class: ee(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": z(z0)[e.status]
          }, [
            H(fs, { value: e.status }, {
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
          ], 10, G0))
        ]),
        _: 1
      })
    ]));
  }
}, Do = /* @__PURE__ */ J(Y0, [["__scopeId", "data-v-2ab7e404"]]), J0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), Z0 = (e) => J0.has(e), No = (e) => Z0(e) ? "done" : e, X0 = { class: "facts" }, Q0 = { class: "fact wide" }, eg = { class: "fact-value" }, tg = {
  key: 0,
  class: "fact"
}, ng = { class: "fact-value" }, sg = {
  key: 1,
  class: "fact"
}, ag = { class: "fact-value" }, og = { class: "fact wide" }, rg = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, ig = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = ao.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return l(), d("div", X0, [
        p("div", Q0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", eg, b((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", tg, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", ng, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : j("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", sg, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", ag, "Agent " + b(e.task.holder_id), 1)
        ])) : j("", !0),
        p("div", og, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          H(ss, {
            options: z(n),
            value: String(e.task.priority),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", rg, b(e.refusal), 1)) : j("", !0)
        ])
      ]);
    };
  }
}, lg = /* @__PURE__ */ J(ig, [["__scopeId", "data-v-e8a68605"]]), cg = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, ug = ["onClick"], dg = { class: "wait-id" }, hg = { class: "wait-title" }, fg = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, pg = { class: "text" }, mg = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, gg = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, vg = 180, yg = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = W(!1);
    return (a, o) => (l(), d(Z, null, [
      e.task.waits.length ? (l(), d("section", cg, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (l(!0), d(Z, null, re(e.task.waits, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          H(Do, {
            status: z(No)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", dg, b(r.id), 1),
          p("span", hg, b(r.title), 1)
        ], 8, ug))), 128))
      ])) : j("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", fg, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", pg, b(e.task.outcome), 1)
      ])) : j("", !0),
      e.task.brief ? (l(), d("section", mg, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: ee(["text", { clamped: !s.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > vg && !s.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : j("", !0)
      ])) : j("", !0),
      e.task.logs.length ? (l(), d("section", gg, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(Z, null, re(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, b(r.line), 1))), 128))
      ])) : j("", !0)
    ], 64));
  }
}, wg = /* @__PURE__ */ J(yg, [["__scopeId", "data-v-f411ce35"]]), kg = {
  class: "comment-side",
  "data-comment-side": "",
  "aria-label": "Comments"
}, bg = { class: "comment-side-head" }, $g = {
  key: 0,
  class: "comment-none"
}, xg = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), d("aside", kg, [
      p("header", bg, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        H(ms, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? j("", !0) : (l(), d("p", $g, "No comments yet")),
      (l(!0), d(Z, null, re(e.comments, (s) => (l(), d("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, b(e.words(s)), 1))), 128))
    ]));
  }
}, _g = /* @__PURE__ */ J(xg, [["__scopeId", "data-v-234cce45"]]), Mg = ["placeholder"], Sg = { class: "actions" }, Eg = { class: "error" }, Ag = {
  key: 1,
  class: "card closed"
}, Cg = { class: "mark" }, Og = { class: "prompt" }, Tg = {
  key: 0,
  class: "draft"
}, Bg = {
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
    const s = e, a = n, o = Un(e, "draft"), r = Un(e, "error"), i = W(!!r.value), c = W(!1), u = W(!1), f = W(null);
    async function m() {
      var w, y;
      i.value = !0, c.value = !1, await hn(), (y = ((w = f.value) == null ? void 0 : w.querySelector("input")) || f.value) == null || y.focus();
    }
    function E() {
      i.value = !1, r.value = "";
    }
    function A(w) {
      w.shiftKey || w.isComposing || (w.preventDefault(), D());
    }
    async function D() {
      const w = o.value.trim();
      if (!(!w || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(w), i.value = !1, c.value = !0;
        } catch (y) {
          o.value = w, r.value = y.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: m }), (w, y) => (l(), d("div", {
      class: ee(["comment-bar", { open: i.value }])
    }, [
      i.value ? (l(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: _e(D, ["prevent"]),
        onKeydown: Jt(E, ["esc"])
      }, [
        $e(w.$slots, "who", {}, void 0, !0),
        mt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (T) => o.value = T),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Jt(A, ["enter"])
        }, null, 40, Mg), [
          [zn, o.value]
        ]),
        p("div", Sg, [
          p("span", Eg, b(r.value), 1),
          H(ye, {
            small: "",
            onClick: E
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
      ], 32)) : (l(), d("div", Ag, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          p("span", Cg, [
            H(Me, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", Og, b(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", Tg, "Draft kept")) : j("", !0)
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[1] || (y[1] = (T) => a("show"))
        }, [
          p("span", null, b(z(gi)(e.count, "comment")), 1),
          H(Me, {
            name: "down",
            size: 12
          })
        ])) : j("", !0)
      ]))
    ], 2));
  }
}, Ig = /* @__PURE__ */ J(Bg, [["__scopeId", "data-v-4d1d3a74"]]);
function Lg(e, t) {
  const n = W([]), s = W(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: f, id: m, title: E } = e(), A = `On ${f} ${m}, ${E}: `;
    return u.text.startsWith(A) ? u.text.slice(A.length) : u.text;
  };
  async function i() {
    const { kind: u, id: f } = e();
    if (!f) return;
    const m = ++o, E = await t([u, "comments", String(f)]);
    m === o && (n.value = E.ok ? E.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: f, id: m } = e(), E = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, E], s.value = !0;
    const A = await t([f, "comment", String(m), u]);
    if (!A.ok)
      throw n.value = n.value.filter((D) => D !== E && D.id !== E.id), new Error(A.error);
    await i();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: c, load: i };
}
const Rg = { class: "top" }, Dg = {
  class: "crumb",
  "data-task-crumb": ""
}, Ng = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, jg = {
  key: 1,
  class: "body"
}, Pg = { class: "body-row" }, qg = { class: "stamp" }, Wg = {
  class: "title",
  "data-resource-title": ""
}, Fg = { class: "since" }, Hg = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Ug = { class: "text" }, Vg = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, zg = {
  key: 1,
  class: "note"
}, Kg = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Gg = { class: "text" }, Yg = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = W(null), r = W(null), i = W(""), c = W(""), u = W(null), f = W(null), m = Lg(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, ($) => s.read($));
    ke(m.open, ($) => a("comments", $));
    let E = 0;
    const A = No, D = ($) => $.slice(0, 1).toUpperCase() + $.slice(1), w = I(() => {
      var $;
      return ($ = r.value) != null && $.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function y() {
      const $ = ++E, [v, F] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      $ === E && (i.value = v.ok ? "" : v.error, o.value = v.ok ? v.value : null, r.value = F.ok ? F.value : null);
    }
    ke(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, y();
    }, { immediate: !0 }), ke(() => s.changes, y);
    async function T($) {
      const v = o.value.priority;
      o.value.priority = Number($);
      const F = await s.read(["task", "edit", String(s.id), "--priority", $]);
      if (c.value = F.ok ? "" : F.error, F.ok) return y();
      o.value.priority = v;
    }
    function P($) {
      u.value = null, f.value.press($);
    }
    const X = ($) => {
      var v;
      return ((v = f.value) == null ? void 0 : v.moves.length) && (u.value = $);
    };
    return t({ openStatus: X }), ($, v) => {
      var F;
      return l(), d("aside", {
        class: ee(["task-inspector", { lone: e.lone }]),
        "data-task-inspector": ""
      }, [
        p("div", Rg, [
          e.backed ? (l(), Y(A0, {
            key: 0,
            onBack: v[0] || (v[0] = (M) => a("back"))
          })) : j("", !0),
          p("span", Dg, b(w.value), 1),
          v[9] || (v[9] = p("span", { class: "grow" }, null, -1)),
          e.stepped ? (l(), d(Z, { key: 1 }, [
            H(ye, {
              small: "",
              title: "Previous task (K)",
              "aria-label": "Previous task",
              onClick: v[1] || (v[1] = (M) => a("step", -1))
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
              onClick: v[2] || (v[2] = (M) => a("step", 1))
            }, {
              default: V(() => [
                H(Me, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : j("", !0),
          H(ye, {
            small: "",
            "aria-label": "Close the task (Esc)",
            "data-resource-close": "",
            onClick: v[3] || (v[3] = (M) => a("close"))
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
        i.value ? (l(), d("p", Ng, b(i.value), 1)) : o.value ? (l(), d(Z, { key: 2 }, [
          p("div", Pg, [
            (l(), d("div", {
              key: o.value.id,
              class: "body"
            }, [
              p("div", qg, "Task " + b(o.value.id) + " · updated " + b(z(Gn)(z(en)(o.value)) || "just now"), 1),
              p("h3", Wg, b(o.value.title), 1),
              p("div", {
                class: ee(["state-line", z(A)(o.value.state)])
              }, [
                p("button", {
                  type: "button",
                  class: "state",
                  "data-task-state": "",
                  title: "Change the status (S)",
                  onClick: v[4] || (v[4] = (M) => X(M.currentTarget))
                }, [
                  H(Do, {
                    status: z(A)(o.value.state)
                  }, null, 8, ["status"]),
                  he(" " + b(D(o.value.state)), 1)
                ]),
                p("span", Fg, "since " + b(z(Gn)(z(en)(o.value)) || "just now"), 1)
              ], 2),
              o.value.state === "blocked" ? (l(), d("section", Hg, [
                v[10] || (v[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                p("p", Ug, b(o.value.reason || "Other tasks"), 1),
                (F = o.value.openers) != null && F.length ? (l(), d("p", Vg, "Opens by itself when " + b(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", zg, "Nothing opens it by itself. Unblock it when that is done."))
              ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", Kg, [
                v[11] || (v[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                p("p", Gg, b(o.value.reason), 1)
              ])) : j("", !0),
              H(lg, {
                task: o.value,
                place: r.value,
                refusal: c.value,
                onPriority: T
              }, null, 8, ["task", "place", "refusal"]),
              H(wg, {
                task: o.value,
                onSelect: v[5] || (v[5] = (M) => a("select", M))
              }, null, 8, ["task"])
            ])),
            z(m).open.value ? (l(), Y(_g, {
              key: 0,
              comments: z(m).comments.value,
              words: z(m).words,
              onClose: v[6] || (v[6] = (M) => z(m).open.value = !1)
            }, null, 8, ["comments", "words"])) : j("", !0)
          ]),
          H(Ig, {
            send: z(m).send,
            count: z(m).comments.value.length,
            onShow: v[7] || (v[7] = (M) => z(m).open.value = !z(m).open.value)
          }, null, 8, ["send", "count"])
        ], 64)) : (l(), d("div", jg, [
          H(vt)
        ])),
        H(U0, {
          ref_key: "footer",
          ref: f,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: y
        }, null, 8, ["id", "row", "read"]),
        u.value ? (l(), Y(E0, {
          key: 3,
          anchor: u.value,
          "min-width": 220,
          "max-width": 300,
          onClose: v[8] || (v[8] = (M) => u.value = null)
        }, {
          default: V(() => [
            H($0, null, {
              default: V(() => [
                he("Change the status of task " + b(e.id), 1)
              ]),
              _: 1
            }),
            (l(!0), d(Z, null, re(f.value.moves, (M) => (l(), Y(y0, {
              key: M.word,
              onClick: (N) => P(M)
            }, {
              default: V(() => [
                he(b(M.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : j("", !0)
      ], 2);
    };
  }
}, hy = /* @__PURE__ */ J(Yg, [["__scopeId", "data-v-9283f1a7"]]);
function Jg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Hn = { exports: {} }, ga;
function Zg() {
  return ga || (ga = 1, (function(e, t) {
    var n = (function() {
      var s = function(v, F) {
        var M = 236, N = 17, x = v, S = o[F], g = null, h = 0, O = null, k = [], C = {}, U = function(B, L) {
          h = x * 4 + 17, g = (function(_) {
            for (var R = new Array(_), q = 0; q < _; q += 1) {
              R[q] = new Array(_);
              for (var G = 0; G < _; G += 1)
                R[q][G] = null;
            }
            return R;
          })(h), oe(0, 0), oe(h - 7, 0), oe(0, h - 7), me(), le(), qe(B, L), x >= 7 && Ee(B), O == null && (O = jo(x, S, k)), We(O, L);
        }, oe = function(B, L) {
          for (var _ = -1; _ <= 7; _ += 1)
            if (!(B + _ <= -1 || h <= B + _))
              for (var R = -1; R <= 7; R += 1)
                L + R <= -1 || h <= L + R || (0 <= _ && _ <= 6 && (R == 0 || R == 6) || 0 <= R && R <= 6 && (_ == 0 || _ == 6) || 2 <= _ && _ <= 4 && 2 <= R && R <= 4 ? g[B + _][L + R] = !0 : g[B + _][L + R] = !1);
        }, de = function() {
          for (var B = 0, L = 0, _ = 0; _ < 8; _ += 1) {
            U(!0, _);
            var R = i.getLostPoint(C);
            (_ == 0 || B > R) && (B = R, L = _);
          }
          return L;
        }, le = function() {
          for (var B = 8; B < h - 8; B += 1)
            g[B][6] == null && (g[B][6] = B % 2 == 0);
          for (var L = 8; L < h - 8; L += 1)
            g[6][L] == null && (g[6][L] = L % 2 == 0);
        }, me = function() {
          for (var B = i.getPatternPosition(x), L = 0; L < B.length; L += 1)
            for (var _ = 0; _ < B.length; _ += 1) {
              var R = B[L], q = B[_];
              if (g[R][q] == null)
                for (var G = -2; G <= 2; G += 1)
                  for (var se = -2; se <= 2; se += 1)
                    G == -2 || G == 2 || se == -2 || se == 2 || G == 0 && se == 0 ? g[R + G][q + se] = !0 : g[R + G][q + se] = !1;
            }
        }, Ee = function(B) {
          for (var L = i.getBCHTypeNumber(x), _ = 0; _ < 18; _ += 1) {
            var R = !B && (L >> _ & 1) == 1;
            g[Math.floor(_ / 3)][_ % 3 + h - 8 - 3] = R;
          }
          for (var _ = 0; _ < 18; _ += 1) {
            var R = !B && (L >> _ & 1) == 1;
            g[_ % 3 + h - 8 - 3][Math.floor(_ / 3)] = R;
          }
        }, qe = function(B, L) {
          for (var _ = S << 3 | L, R = i.getBCHTypeInfo(_), q = 0; q < 15; q += 1) {
            var G = !B && (R >> q & 1) == 1;
            q < 6 ? g[q][8] = G : q < 8 ? g[q + 1][8] = G : g[h - 15 + q][8] = G;
          }
          for (var q = 0; q < 15; q += 1) {
            var G = !B && (R >> q & 1) == 1;
            q < 8 ? g[8][h - q - 1] = G : q < 9 ? g[8][15 - q - 1 + 1] = G : g[8][15 - q - 1] = G;
          }
          g[h - 8][8] = !B;
        }, We = function(B, L) {
          for (var _ = -1, R = h - 1, q = 7, G = 0, se = i.getMaskFunction(L), ne = h - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (g[R][ne - ge] == null) {
                  var be = !1;
                  G < B.length && (be = (B[G] >>> q & 1) == 1);
                  var ae = se(R, ne - ge);
                  ae && (be = !be), g[R][ne - ge] = be, q -= 1, q == -1 && (G += 1, q = 7);
                }
              if (R += _, R < 0 || h <= R) {
                R -= _, _ = -_;
                break;
              }
            }
        }, it = function(B, L) {
          for (var _ = 0, R = 0, q = 0, G = new Array(L.length), se = new Array(L.length), ne = 0; ne < L.length; ne += 1) {
            var ge = L[ne].dataCount, be = L[ne].totalCount - ge;
            R = Math.max(R, ge), q = Math.max(q, be), G[ne] = new Array(ge);
            for (var ae = 0; ae < G[ne].length; ae += 1)
              G[ne][ae] = 255 & B.getBuffer()[ae + _];
            _ += ge;
            var Ce = i.getErrorCorrectPolynomial(be), Oe = u(G[ne], Ce.getLength() - 1), Ss = Oe.mod(Ce);
            se[ne] = new Array(Ce.getLength() - 1);
            for (var ae = 0; ae < se[ne].length; ae += 1) {
              var Es = ae + Ss.getLength() - se[ne].length;
              se[ne][ae] = Es >= 0 ? Ss.getAt(Es) : 0;
            }
          }
          for (var As = 0, ae = 0; ae < L.length; ae += 1)
            As += L[ae].totalCount;
          for (var bn = new Array(As), Nt = 0, ae = 0; ae < R; ae += 1)
            for (var ne = 0; ne < L.length; ne += 1)
              ae < G[ne].length && (bn[Nt] = G[ne][ae], Nt += 1);
          for (var ae = 0; ae < q; ae += 1)
            for (var ne = 0; ne < L.length; ne += 1)
              ae < se[ne].length && (bn[Nt] = se[ne][ae], Nt += 1);
          return bn;
        }, jo = function(B, L, _) {
          for (var R = f.getRSBlocks(B, L), q = m(), G = 0; G < _.length; G += 1) {
            var se = _[G];
            q.put(se.getMode(), 4), q.put(se.getLength(), i.getLengthInBits(se.getMode(), B)), se.write(q);
          }
          for (var ne = 0, G = 0; G < R.length; G += 1)
            ne += R[G].dataCount;
          if (q.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + q.getLengthInBits() + ">" + ne * 8 + ")";
          for (q.getLengthInBits() + 4 <= ne * 8 && q.put(0, 4); q.getLengthInBits() % 8 != 0; )
            q.putBit(!1);
          for (; !(q.getLengthInBits() >= ne * 8 || (q.put(M, 8), q.getLengthInBits() >= ne * 8)); )
            q.put(N, 8);
          return it(q, R);
        };
        C.addData = function(B, L) {
          L = L || "Byte";
          var _ = null;
          switch (L) {
            case "Numeric":
              _ = E(B);
              break;
            case "Alphanumeric":
              _ = A(B);
              break;
            case "Byte":
              _ = D(B);
              break;
            case "Kanji":
              _ = w(B);
              break;
            default:
              throw "mode:" + L;
          }
          k.push(_), O = null;
        }, C.isDark = function(B, L) {
          if (B < 0 || h <= B || L < 0 || h <= L)
            throw B + "," + L;
          return g[B][L];
        }, C.getModuleCount = function() {
          return h;
        }, C.make = function() {
          if (x < 1) {
            for (var B = 1; B < 40; B++) {
              for (var L = f.getRSBlocks(B, S), _ = m(), R = 0; R < k.length; R++) {
                var q = k[R];
                _.put(q.getMode(), 4), _.put(q.getLength(), i.getLengthInBits(q.getMode(), B)), q.write(_);
              }
              for (var G = 0, R = 0; R < L.length; R++)
                G += L[R].dataCount;
              if (_.getLengthInBits() <= G * 8)
                break;
            }
            x = B;
          }
          U(!1, de());
        }, C.createTableTag = function(B, L) {
          B = B || 2, L = typeof L > "u" ? B * 4 : L;
          var _ = "";
          _ += '<table style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: " + L + "px;", _ += '">', _ += "<tbody>";
          for (var R = 0; R < C.getModuleCount(); R += 1) {
            _ += "<tr>";
            for (var q = 0; q < C.getModuleCount(); q += 1)
              _ += '<td style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: 0px;", _ += " width: " + B + "px;", _ += " height: " + B + "px;", _ += " background-color: ", _ += C.isDark(R, q) ? "#000000" : "#ffffff", _ += ";", _ += '"/>';
            _ += "</tr>";
          }
          return _ += "</tbody>", _ += "</table>", _;
        }, C.createSvgTag = function(B, L, _, R) {
          var q = {};
          typeof arguments[0] == "object" && (q = arguments[0], B = q.cellSize, L = q.margin, _ = q.alt, R = q.title), B = B || 2, L = typeof L > "u" ? B * 4 : L, _ = typeof _ == "string" ? { text: _ } : _ || {}, _.text = _.text || null, _.id = _.text ? _.id || "qrcode-description" : null, R = typeof R == "string" ? { text: R } : R || {}, R.text = R.text || null, R.id = R.text ? R.id || "qrcode-title" : null;
          var G = C.getModuleCount() * B + L * 2, se, ne, ge, be, ae = "", Ce;
          for (Ce = "l" + B + ",0 0," + B + " -" + B + ",0 0,-" + B + "z ", ae += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ae += q.scalable ? "" : ' width="' + G + 'px" height="' + G + 'px"', ae += ' viewBox="0 0 ' + G + " " + G + '" ', ae += ' preserveAspectRatio="xMinYMin meet"', ae += R.text || _.text ? ' role="img" aria-labelledby="' + lt([R.id, _.id].join(" ").trim()) + '"' : "", ae += ">", ae += R.text ? '<title id="' + lt(R.id) + '">' + lt(R.text) + "</title>" : "", ae += _.text ? '<description id="' + lt(_.id) + '">' + lt(_.text) + "</description>" : "", ae += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ae += '<path d="', ge = 0; ge < C.getModuleCount(); ge += 1)
            for (be = ge * B + L, se = 0; se < C.getModuleCount(); se += 1)
              C.isDark(ge, se) && (ne = se * B + L, ae += "M" + ne + "," + be + Ce);
          return ae += '" stroke="transparent" fill="black"/>', ae += "</svg>", ae;
        }, C.createDataURL = function(B, L) {
          B = B || 2, L = typeof L > "u" ? B * 4 : L;
          var _ = C.getModuleCount() * B + L * 2, R = L, q = _ - L;
          return $(_, _, function(G, se) {
            if (R <= G && G < q && R <= se && se < q) {
              var ne = Math.floor((G - R) / B), ge = Math.floor((se - R) / B);
              return C.isDark(ge, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, C.createImgTag = function(B, L, _) {
          B = B || 2, L = typeof L > "u" ? B * 4 : L;
          var R = C.getModuleCount() * B + L * 2, q = "";
          return q += "<img", q += ' src="', q += C.createDataURL(B, L), q += '"', q += ' width="', q += R, q += '"', q += ' height="', q += R, q += '"', _ && (q += ' alt="', q += lt(_), q += '"'), q += "/>", q;
        };
        var lt = function(B) {
          for (var L = "", _ = 0; _ < B.length; _ += 1) {
            var R = B.charAt(_);
            switch (R) {
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
                L += R;
                break;
            }
          }
          return L;
        }, Po = function(B) {
          var L = 1;
          B = typeof B > "u" ? L * 2 : B;
          var _ = C.getModuleCount() * L + B * 2, R = B, q = _ - B, G, se, ne, ge, be, ae = {
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
          for (G = 0; G < _; G += 2) {
            for (ne = Math.floor((G - R) / L), ge = Math.floor((G + 1 - R) / L), se = 0; se < _; se += 1)
              be = "█", R <= se && se < q && R <= G && G < q && C.isDark(ne, Math.floor((se - R) / L)) && (be = " "), R <= se && se < q && R <= G + 1 && G + 1 < q && C.isDark(ge, Math.floor((se - R) / L)) ? be += " " : be += "█", Oe += B < 1 && G + 1 >= q ? Ce[be] : ae[be];
            Oe += `
`;
          }
          return _ % 2 && B > 0 ? Oe.substring(0, Oe.length - _ - 1) + Array(_ + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return C.createASCII = function(B, L) {
          if (B = B || 1, B < 2)
            return Po(L);
          B -= 1, L = typeof L > "u" ? B * 2 : L;
          var _ = C.getModuleCount() * B + L * 2, R = L, q = _ - L, G, se, ne, ge, be = Array(B + 1).join("██"), ae = Array(B + 1).join("  "), Ce = "", Oe = "";
          for (G = 0; G < _; G += 1) {
            for (ne = Math.floor((G - R) / B), Oe = "", se = 0; se < _; se += 1)
              ge = 1, R <= se && se < q && R <= G && G < q && C.isDark(ne, Math.floor((se - R) / B)) && (ge = 0), Oe += ge ? be : ae;
            for (ne = 0; ne < B; ne += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, C.renderTo2dContext = function(B, L) {
          L = L || 2;
          for (var _ = C.getModuleCount(), R = 0; R < _; R++)
            for (var q = 0; q < _; q++)
              B.fillStyle = C.isDark(R, q) ? "black" : "white", B.fillRect(R * L, q * L, L, L);
        }, C;
      };
      s.stringToBytesFuncs = {
        default: function(v) {
          for (var F = [], M = 0; M < v.length; M += 1) {
            var N = v.charCodeAt(M);
            F.push(N & 255);
          }
          return F;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(v, F) {
        var M = (function() {
          for (var x = P(v), S = function() {
            var le = x.read();
            if (le == -1) throw "eof";
            return le;
          }, g = 0, h = {}; ; ) {
            var O = x.read();
            if (O == -1) break;
            var k = S(), C = S(), U = S(), oe = String.fromCharCode(O << 8 | k), de = C << 8 | U;
            h[oe] = de, g += 1;
          }
          if (g != F)
            throw g + " != " + F;
          return h;
        })(), N = 63;
        return function(x) {
          for (var S = [], g = 0; g < x.length; g += 1) {
            var h = x.charCodeAt(g);
            if (h < 128)
              S.push(h);
            else {
              var O = M[x.charAt(g)];
              typeof O == "number" ? (O & 255) == O ? S.push(O) : (S.push(O >>> 8), S.push(O & 255)) : S.push(N);
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
        ], F = 1335, M = 7973, N = 21522, x = {}, S = function(g) {
          for (var h = 0; g != 0; )
            h += 1, g >>>= 1;
          return h;
        };
        return x.getBCHTypeInfo = function(g) {
          for (var h = g << 10; S(h) - S(F) >= 0; )
            h ^= F << S(h) - S(F);
          return (g << 10 | h) ^ N;
        }, x.getBCHTypeNumber = function(g) {
          for (var h = g << 12; S(h) - S(M) >= 0; )
            h ^= M << S(h) - S(M);
          return g << 12 | h;
        }, x.getPatternPosition = function(g) {
          return v[g - 1];
        }, x.getMaskFunction = function(g) {
          switch (g) {
            case r.PATTERN000:
              return function(h, O) {
                return (h + O) % 2 == 0;
              };
            case r.PATTERN001:
              return function(h, O) {
                return h % 2 == 0;
              };
            case r.PATTERN010:
              return function(h, O) {
                return O % 3 == 0;
              };
            case r.PATTERN011:
              return function(h, O) {
                return (h + O) % 3 == 0;
              };
            case r.PATTERN100:
              return function(h, O) {
                return (Math.floor(h / 2) + Math.floor(O / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(h, O) {
                return h * O % 2 + h * O % 3 == 0;
              };
            case r.PATTERN110:
              return function(h, O) {
                return (h * O % 2 + h * O % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(h, O) {
                return (h * O % 3 + (h + O) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + g;
          }
        }, x.getErrorCorrectPolynomial = function(g) {
          for (var h = u([1], 0), O = 0; O < g; O += 1)
            h = h.multiply(u([1, c.gexp(O)], 0));
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
          for (var h = g.getModuleCount(), O = 0, k = 0; k < h; k += 1)
            for (var C = 0; C < h; C += 1) {
              for (var U = 0, oe = g.isDark(k, C), de = -1; de <= 1; de += 1)
                if (!(k + de < 0 || h <= k + de))
                  for (var le = -1; le <= 1; le += 1)
                    C + le < 0 || h <= C + le || de == 0 && le == 0 || oe == g.isDark(k + de, C + le) && (U += 1);
              U > 5 && (O += 3 + U - 5);
            }
          for (var k = 0; k < h - 1; k += 1)
            for (var C = 0; C < h - 1; C += 1) {
              var me = 0;
              g.isDark(k, C) && (me += 1), g.isDark(k + 1, C) && (me += 1), g.isDark(k, C + 1) && (me += 1), g.isDark(k + 1, C + 1) && (me += 1), (me == 0 || me == 4) && (O += 3);
            }
          for (var k = 0; k < h; k += 1)
            for (var C = 0; C < h - 6; C += 1)
              g.isDark(k, C) && !g.isDark(k, C + 1) && g.isDark(k, C + 2) && g.isDark(k, C + 3) && g.isDark(k, C + 4) && !g.isDark(k, C + 5) && g.isDark(k, C + 6) && (O += 40);
          for (var C = 0; C < h; C += 1)
            for (var k = 0; k < h - 6; k += 1)
              g.isDark(k, C) && !g.isDark(k + 1, C) && g.isDark(k + 2, C) && g.isDark(k + 3, C) && g.isDark(k + 4, C) && !g.isDark(k + 5, C) && g.isDark(k + 6, C) && (O += 40);
          for (var Ee = 0, C = 0; C < h; C += 1)
            for (var k = 0; k < h; k += 1)
              g.isDark(k, C) && (Ee += 1);
          var qe = Math.abs(100 * Ee / h / h - 50) / 5;
          return O += qe * 10, O;
        }, x;
      })(), c = (function() {
        for (var v = new Array(256), F = new Array(256), M = 0; M < 8; M += 1)
          v[M] = 1 << M;
        for (var M = 8; M < 256; M += 1)
          v[M] = v[M - 4] ^ v[M - 5] ^ v[M - 6] ^ v[M - 8];
        for (var M = 0; M < 255; M += 1)
          F[v[M]] = M;
        var N = {};
        return N.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return F[x];
        }, N.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return v[x];
        }, N;
      })();
      function u(v, F) {
        if (typeof v.length > "u")
          throw v.length + "/" + F;
        var M = (function() {
          for (var x = 0; x < v.length && v[x] == 0; )
            x += 1;
          for (var S = new Array(v.length - x + F), g = 0; g < v.length - x; g += 1)
            S[g] = v[g + x];
          return S;
        })(), N = {};
        return N.getAt = function(x) {
          return M[x];
        }, N.getLength = function() {
          return M.length;
        }, N.multiply = function(x) {
          for (var S = new Array(N.getLength() + x.getLength() - 1), g = 0; g < N.getLength(); g += 1)
            for (var h = 0; h < x.getLength(); h += 1)
              S[g + h] ^= c.gexp(c.glog(N.getAt(g)) + c.glog(x.getAt(h)));
          return u(S, 0);
        }, N.mod = function(x) {
          if (N.getLength() - x.getLength() < 0)
            return N;
          for (var S = c.glog(N.getAt(0)) - c.glog(x.getAt(0)), g = new Array(N.getLength()), h = 0; h < N.getLength(); h += 1)
            g[h] = N.getAt(h);
          for (var h = 0; h < x.getLength(); h += 1)
            g[h] ^= c.gexp(c.glog(x.getAt(h)) + S);
          return u(g, 0).mod(x);
        }, N;
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
        ], F = function(x, S) {
          var g = {};
          return g.totalCount = x, g.dataCount = S, g;
        }, M = {}, N = function(x, S) {
          switch (S) {
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
        return M.getRSBlocks = function(x, S) {
          var g = N(x, S);
          if (typeof g > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + S;
          for (var h = g.length / 3, O = [], k = 0; k < h; k += 1)
            for (var C = g[k * 3 + 0], U = g[k * 3 + 1], oe = g[k * 3 + 2], de = 0; de < C; de += 1)
              O.push(F(U, oe));
          return O;
        }, M;
      })(), m = function() {
        var v = [], F = 0, M = {};
        return M.getBuffer = function() {
          return v;
        }, M.getAt = function(N) {
          var x = Math.floor(N / 8);
          return (v[x] >>> 7 - N % 8 & 1) == 1;
        }, M.put = function(N, x) {
          for (var S = 0; S < x; S += 1)
            M.putBit((N >>> x - S - 1 & 1) == 1);
        }, M.getLengthInBits = function() {
          return F;
        }, M.putBit = function(N) {
          var x = Math.floor(F / 8);
          v.length <= x && v.push(0), N && (v[x] |= 128 >>> F % 8), F += 1;
        }, M;
      }, E = function(v) {
        var F = a.MODE_NUMBER, M = v, N = {};
        N.getMode = function() {
          return F;
        }, N.getLength = function(g) {
          return M.length;
        }, N.write = function(g) {
          for (var h = M, O = 0; O + 2 < h.length; )
            g.put(x(h.substring(O, O + 3)), 10), O += 3;
          O < h.length && (h.length - O == 1 ? g.put(x(h.substring(O, O + 1)), 4) : h.length - O == 2 && g.put(x(h.substring(O, O + 2)), 7));
        };
        var x = function(g) {
          for (var h = 0, O = 0; O < g.length; O += 1)
            h = h * 10 + S(g.charAt(O));
          return h;
        }, S = function(g) {
          if ("0" <= g && g <= "9")
            return g.charCodeAt(0) - 48;
          throw "illegal char :" + g;
        };
        return N;
      }, A = function(v) {
        var F = a.MODE_ALPHA_NUM, M = v, N = {};
        N.getMode = function() {
          return F;
        }, N.getLength = function(S) {
          return M.length;
        }, N.write = function(S) {
          for (var g = M, h = 0; h + 1 < g.length; )
            S.put(
              x(g.charAt(h)) * 45 + x(g.charAt(h + 1)),
              11
            ), h += 2;
          h < g.length && S.put(x(g.charAt(h)), 6);
        };
        var x = function(S) {
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
        return N;
      }, D = function(v) {
        var F = a.MODE_8BIT_BYTE, M = s.stringToBytes(v), N = {};
        return N.getMode = function() {
          return F;
        }, N.getLength = function(x) {
          return M.length;
        }, N.write = function(x) {
          for (var S = 0; S < M.length; S += 1)
            x.put(M[S], 8);
        }, N;
      }, w = function(v) {
        var F = a.MODE_KANJI, M = s.stringToBytesFuncs.SJIS;
        if (!M)
          throw "sjis not supported.";
        (function(S, g) {
          var h = M(S);
          if (h.length != 2 || (h[0] << 8 | h[1]) != g)
            throw "sjis not supported.";
        })("友", 38726);
        var N = M(v), x = {};
        return x.getMode = function() {
          return F;
        }, x.getLength = function(S) {
          return ~~(N.length / 2);
        }, x.write = function(S) {
          for (var g = N, h = 0; h + 1 < g.length; ) {
            var O = (255 & g[h]) << 8 | 255 & g[h + 1];
            if (33088 <= O && O <= 40956)
              O -= 33088;
            else if (57408 <= O && O <= 60351)
              O -= 49472;
            else
              throw "illegal char at " + (h + 1) + "/" + O;
            O = (O >>> 8 & 255) * 192 + (O & 255), S.put(O, 13), h += 2;
          }
          if (h < g.length)
            throw "illegal char at " + (h + 1);
        }, x;
      }, y = function() {
        var v = [], F = {};
        return F.writeByte = function(M) {
          v.push(M & 255);
        }, F.writeShort = function(M) {
          F.writeByte(M), F.writeByte(M >>> 8);
        }, F.writeBytes = function(M, N, x) {
          N = N || 0, x = x || M.length;
          for (var S = 0; S < x; S += 1)
            F.writeByte(M[S + N]);
        }, F.writeString = function(M) {
          for (var N = 0; N < M.length; N += 1)
            F.writeByte(M.charCodeAt(N));
        }, F.toByteArray = function() {
          return v;
        }, F.toString = function() {
          var M = "";
          M += "[";
          for (var N = 0; N < v.length; N += 1)
            N > 0 && (M += ","), M += v[N];
          return M += "]", M;
        }, F;
      }, T = function() {
        var v = 0, F = 0, M = 0, N = "", x = {}, S = function(h) {
          N += String.fromCharCode(g(h & 63));
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
          for (v = v << 8 | h & 255, F += 8, M += 1; F >= 6; )
            S(v >>> F - 6), F -= 6;
        }, x.flush = function() {
          if (F > 0 && (S(v << 6 - F), v = 0, F = 0), M % 3 != 0)
            for (var h = 3 - M % 3, O = 0; O < h; O += 1)
              N += "=";
        }, x.toString = function() {
          return N;
        }, x;
      }, P = function(v) {
        var F = v, M = 0, N = 0, x = 0, S = {};
        S.read = function() {
          for (; x < 8; ) {
            if (M >= F.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var h = F.charAt(M);
            if (M += 1, h == "=")
              return x = 0, -1;
            if (h.match(/^\s$/))
              continue;
            N = N << 6 | g(h.charCodeAt(0)), x += 6;
          }
          var O = N >>> x - 8 & 255;
          return x -= 8, O;
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
        return S;
      }, X = function(v, F) {
        var M = v, N = F, x = new Array(v * F), S = {};
        S.setPixel = function(k, C, U) {
          x[C * M + k] = U;
        }, S.write = function(k) {
          k.writeString("GIF87a"), k.writeShort(M), k.writeShort(N), k.writeByte(128), k.writeByte(0), k.writeByte(0), k.writeByte(0), k.writeByte(0), k.writeByte(0), k.writeByte(255), k.writeByte(255), k.writeByte(255), k.writeString(","), k.writeShort(0), k.writeShort(0), k.writeShort(M), k.writeShort(N), k.writeByte(0);
          var C = 2, U = h(C);
          k.writeByte(C);
          for (var oe = 0; U.length - oe > 255; )
            k.writeByte(255), k.writeBytes(U, oe, 255), oe += 255;
          k.writeByte(U.length - oe), k.writeBytes(U, oe, U.length - oe), k.writeByte(0), k.writeString(";");
        };
        var g = function(k) {
          var C = k, U = 0, oe = 0, de = {};
          return de.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; U + me >= 8; )
              C.writeByte(255 & (le << U | oe)), me -= 8 - U, le >>>= 8 - U, oe = 0, U = 0;
            oe = le << U | oe, U = U + me;
          }, de.flush = function() {
            U > 0 && C.writeByte(oe);
          }, de;
        }, h = function(k) {
          for (var C = 1 << k, U = (1 << k) + 1, oe = k + 1, de = O(), le = 0; le < C; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(C)), de.add(String.fromCharCode(U));
          var me = y(), Ee = g(me);
          Ee.write(C, oe);
          var qe = 0, We = String.fromCharCode(x[qe]);
          for (qe += 1; qe < x.length; ) {
            var it = String.fromCharCode(x[qe]);
            qe += 1, de.contains(We + it) ? We = We + it : (Ee.write(de.indexOf(We), oe), de.size() < 4095 && (de.size() == 1 << oe && (oe += 1), de.add(We + it)), We = it);
          }
          return Ee.write(de.indexOf(We), oe), Ee.write(U, oe), Ee.flush(), me.toByteArray();
        }, O = function() {
          var k = {}, C = 0, U = {};
          return U.add = function(oe) {
            if (U.contains(oe))
              throw "dup key:" + oe;
            k[oe] = C, C += 1;
          }, U.size = function() {
            return C;
          }, U.indexOf = function(oe) {
            return k[oe];
          }, U.contains = function(oe) {
            return typeof k[oe] < "u";
          }, U;
        };
        return S;
      }, $ = function(v, F, M) {
        for (var N = X(v, F), x = 0; x < F; x += 1)
          for (var S = 0; S < v; S += 1)
            N.setPixel(S, x, M(S, x));
        var g = y();
        N.write(g);
        for (var h = T(), O = g.toByteArray(), k = 0; k < O.length; k += 1)
          h.writeByte(O[k]);
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
  })(Hn)), Hn.exports;
}
var Xg = Zg();
const Qg = /* @__PURE__ */ Jg(Xg), ev = ["width", "height", "viewBox"], tv = ["width", "height"], nv = ["d"], sv = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const s = Qg(0, "M");
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
      }, null, 8, tv),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, nv)
    ], 8, ev));
  }
}, fy = /* @__PURE__ */ J(sv, [["__scopeId", "data-v-489f0852"]]), py = Jo(() => import("./VoiceFigure-CFePKyuk.js").then((e) => e.V)), my = "1.0.0", gy = "3.5";
export {
  cv as $,
  Bv as A,
  Ye as B,
  Fv as C,
  Ov as D,
  Wv as E,
  xv as F,
  Io as G,
  ym as H,
  gm as I,
  Gv as J,
  wt as K,
  jv as L,
  Te as M,
  Mt as N,
  Lv as O,
  kn as P,
  Rv as Q,
  ep as R,
  xo as S,
  Tv as T,
  qv as U,
  da as V,
  nm as W,
  Yp as X,
  Yv as Y,
  Hv as Z,
  J as _,
  ie as a,
  ps as a$,
  ye as a0,
  ms as a1,
  uv as a2,
  Wu as a3,
  dy as a4,
  bv as a5,
  Zt as a6,
  Zv as a7,
  ov as a8,
  sn as a9,
  st as aA,
  ih as aB,
  py as aC,
  Pe as aD,
  Yi as aE,
  Gn as aF,
  ly as aG,
  iy as aH,
  cy as aI,
  kv as aJ,
  yv as aK,
  gv as aL,
  Qv as aM,
  Xv as aN,
  Yf as aO,
  lv as aP,
  yt as aQ,
  fv as aR,
  mv as aS,
  sy as aT,
  ey as aU,
  oy as aV,
  M0 as aW,
  Zm as aX,
  Zf as aY,
  ty as aZ,
  lh as a_,
  Me as aa,
  my as ab,
  gy as ac,
  ay as ad,
  os as ae,
  vv as af,
  s1 as ag,
  y0 as ah,
  $0 as ai,
  E0 as aj,
  dv as ak,
  vr as al,
  uy as am,
  hv as an,
  fy as ao,
  ny as ap,
  Wr as aq,
  rv as ar,
  wv as as,
  ss as at,
  vt as au,
  pv as av,
  iv as aw,
  fs as ax,
  hy as ay,
  Do as az,
  Je as b,
  ry as b0,
  Iv as c,
  Mv as d,
  Sv as e,
  _v as f,
  Vv as g,
  vo as h,
  Dv as i,
  Nv as j,
  Pv as k,
  zv as l,
  Ev as m,
  $v as n,
  Av as o,
  on as p,
  Jv as q,
  Uv as r,
  Cv as s,
  Re as t,
  Gp as u,
  Kv as v,
  Zp as w,
  xs as x,
  wp as y,
  kp as z
};
