/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as we, createElementVNode as p, normalizeClass as ee, Fragment as Z, renderList as re, normalizeStyle as $e, defineComponent as tr, Comment as nr, h as vs, cloneVNode as sr, createBlock as G, withCtx as V, unref as z, createVNode as F, toDisplayString as y, createCommentVNode as I, inject as Ce, computed as O, resolveDynamicComponent as lt, Transition as Lt, watch as be, ref as R, shallowRef as vn, TransitionGroup as Ma, mergeProps as rt, reactive as ys, createTextVNode as he, onMounted as De, onUnmounted as Ae, nextTick as Dt, useId as _a, Teleport as Sa, withModifiers as Me, isRef as Rs, onBeforeUnmount as vt, resolveDirective as ar, withDirectives as it, useModel as Yn, useAttrs as Ea, getCurrentInstance as or, mergeModels as Jn, getCurrentScope as Ca, onScopeDispose as Aa, provide as rr, onErrorCaptured as ir, toHandlers as lr, createSlots as cr, vShow as ur, useSlots as dr, withKeys as Ot, vModelText as Zn, defineAsyncComponent as hr } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, fr = { class: "skeleton-line" }, pr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", fr, [
      we(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: ee(["bars", { faded: e.filled }])
      }, [
        (l(!0), d(Z, null, re(e.bars, (s) => (l(), d("span", {
          key: s.width,
          class: ee(["bar", { still: e.still }]),
          style: $e({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, et = /* @__PURE__ */ Y(pr, [["__scopeId", "data-v-0ebb6933"]]), ws = tr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== nr);
      return s.length !== 1 ? vs(Z, { key: n }, s) : s[0].key == null ? sr(s[0], { key: n }) : s[0];
    };
  }
}), mr = ["aria-label"], gr = ["aria-label"], vr = ["aria-label"], yr = ["aria-label"], wr = ["aria-label"], kr = ["aria-label"], br = ["aria-label"], $r = {
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
    return (c, u) => (l(), G(ws, { value: e.shape }, {
      messages: V(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), d(Z, null, re(t, (h) => p("div", {
            key: h.id,
            class: ee(["skeleton-message", { mine: h.mine }]),
            style: $e({ width: `${h.width}%`, height: `${h.height}px` })
          }, null, 6)), 64))
        ], 8, mr)
      ]),
      older: V(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(t.slice(0, 3), (h) => (l(), d("div", {
            key: h.id,
            class: ee(["skeleton-message", { mine: h.mine }]),
            style: $e({ width: `${h.width}%`, height: `${h.height}px` })
          }, null, 6))), 128))
        ], 8, gr)
      ]),
      cards: V(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (h) => (l(), d("div", {
            key: h,
            class: "skeleton-card"
          }, [
            (l(), d(Z, null, re(n, (m) => F(et, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, vr)
      ]),
      file: V(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (h) => (l(), d("div", {
            key: h,
            class: "skeleton-file"
          }, [
            F(et, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), d(Z, null, re(a, (m) => F(et, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, yr)
      ]),
      page: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          F(et, {
            class: "skeleton-heading",
            bars: i
          }),
          (l(!0), d(Z, null, re(e.count, (h) => (l(), G(et, {
            key: h,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, wr)
      ]),
      text: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (h) => (l(), G(et, {
            key: h,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, kr)
      ]),
      default: V(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (h) => (l(), G(et, {
            key: h,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, br)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, yt = /* @__PURE__ */ Y($r, [["__scopeId", "data-v-c687fb85"]]), xr = {
  key: 1,
  class: "empty-state titled"
}, Mr = { class: "empty-state-title" }, _r = { class: "empty-state-text" }, Sr = {
  key: 2,
  class: "empty-state"
}, Er = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), G(yt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", xr, [
      p("p", Mr, y(e.title), 1),
      p("p", _r, [
        we(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", Sr, [
      we(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, sn = /* @__PURE__ */ Y(Er, [["__scopeId", "data-v-b27e89b0"]]), Cr = { class: "fold-group" }, Ar = ["aria-expanded"], Or = { class: "fold-label" }, Tr = {
  key: 0,
  class: "fold-count"
}, Ir = {
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
    return (s, a) => (l(), d("div", Cr, [
      p("button", {
        type: "button",
        class: ee(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", Or, y(e.label), 1),
        e.count !== "" ? (l(), d("span", Tr, y(e.count), 1)) : I("", !0),
        p("span", {
          class: ee(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Ar),
      e.open ? we(s.$slots, "default", {}, void 0, !0, 0) : I("", !0)
    ]));
  }
}, ry = /* @__PURE__ */ Y(Ir, [["__scopeId", "data-v-9ef1865c"]]), Br = Symbol("open-view"), Ne = Symbol.for("journal.window-context");
function yn() {
  const e = Ce(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Rr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Lr = /* @__PURE__ */ Y(Rr, [["__scopeId", "data-v-eb453d6f"]]), Dr = {
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
      return t.busy || t.disabled || !!((s = Ce(Ne, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), G(lt(e.href ? "a" : "button"), {
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
          we(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (l(), G(Lr, {
          key: 0,
          class: "btn-spinner"
        })) : I("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ve = /* @__PURE__ */ Y(Dr, [["__scopeId", "data-v-a2dc4bda"]]), Nr = {
  class: "running",
  "data-running-command": ""
}, jr = ["title"], Pr = {
  key: "idle",
  class: "running-idle"
}, qr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", Nr, [
      F(Lt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: V(() => [
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, y(e.text), 9, jr)) : (l(), d("span", Pr, y(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, iy = /* @__PURE__ */ Y(qr, [["__scopeId", "data-v-d3240219"]]), Wr = ["aria-checked", "aria-label", "title"], Fr = {
  key: 0,
  class: "switch-inner"
}, Hr = {
  key: 0,
  class: "switch-word"
}, Ur = {
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
        e.labelled ? (l(), d("span", Fr, y(e.word), 1)) : I("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Hr, y(e.word), 1)) : I("", !0)
    ], 10, Wr));
  }
}, ly = /* @__PURE__ */ Y(Ur, [["__scopeId", "data-v-1bfb90f3"]]);
function Oa(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Tt(e, t) {
  return Oa(() => localStorage, e, t);
}
function Ta(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function wn(e, t) {
  return Ta(() => localStorage, e, t);
}
function Ia(e, t) {
  be(t, (n) => wn(e, n), { deep: !0 });
}
function Vr(e, t) {
  return Oa(() => sessionStorage, e, t);
}
function zr(e, t) {
  return Ta(() => sessionStorage, e, t);
}
const an = "journal.environment", Ba = R(Vr(an, Tt(an, "")));
function Gr(e) {
  Ba.value = e, zr(an, e), wn(an, e);
}
const on = R(location.hash), Ls = vn(null), Ds = { integrations: "mcp", library: "team" };
function Kr() {
  if (!Ls.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ds[n]) {
    location.replace(`#/${[Ds[n], ...s].join("/")}${t ? `?${t}` : ""}`), on.value = location.hash;
    return;
  }
  !n || Ls.value(n) || (Gr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), on.value = location.hash);
}
window.addEventListener("hashchange", () => {
  on.value = location.hash, Kr();
});
const Pe = O(() => {
  const [e, t = ""] = on.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", h = "", m = ""] = i.split(":");
    return { table: u, id: Number(h), comment: Number(m) || 0, env: c };
  });
  return {
    env: Ba.value,
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
}), kn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${kn.page(e)}?open=${t}`
};
function Yr(e = "", t = 0, n = "") {
  location.hash = kn.page(e, t, n);
}
const Jr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ra(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Jr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const mt = {};
function cy(e, t) {
  return mt[e] = t, () => mt[e] === t && delete mt[e];
}
function La(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = mt[e]) != null && r.call(mt, t))) return;
  const a = Pe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Ra([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Zr(e, t, n, s = 0, a = "") {
  if (e === Pe.value.env) return La(t, n, s, a);
  const o = Pe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ra([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Ze(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Zr(s, a, Number(o), 0, t) : La(a, Number(o), 0, t);
}
function Xr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function pt(e) {
  const t = Xr(e);
  t && Ze(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Qr = ["stroke-width", "innerHTML"], ke = {
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
    }, null, 12, Qr));
  }
}, ks = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), G(ve, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: V(() => [
        F(ke, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, ei = {
  key: 1,
  class: "row-list-failure"
}, ti = ["data-row"], ni = {
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
    const t = e, n = O(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = R(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (l(), G(yt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", ei, y(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), G(sn, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(Z, { key: 3 }, [
      (l(), G(lt(e.arrival ? Ma : "ul"), rt(n.value, { class: "row-list" }), {
        default: V(() => [
          (l(!0), d(Z, null, re(e.rows, (i) => (l(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            we(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, ti))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : I("", !0)
    ], 64));
  }
}, si = /* @__PURE__ */ Y(ni, [["__scopeId", "data-v-a096d68d"]]), ai = {
  class: "agent-rows",
  "data-agent-rows": ""
}, oi = {
  key: 1,
  class: "agent-rows-note"
}, ri = {
  key: 2,
  class: "agent-rows-note"
}, ii = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, li = ["data-agent-row", "onClick"], ci = { class: "agent-row-name" }, ui = { class: "agent-row-state" }, di = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = O(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", ai, [
      e.loaded ? e.failure ? (l(), d("p", oi, y(e.failure), 1)) : e.rows.length ? (l(), d(Z, { key: 3 }, [
        p("p", ii, y(s.value) + " running", 1),
        (l(!0), d(Z, null, re(n.value, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(Ze)(`agents:${r.id}`)
        }, [
          p("span", ci, "#" + y(r.id) + " " + y(r.session), 1),
          p("span", ui, y(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, li))), 128))
      ], 64)) : (l(), d("p", ri, y(e.none), 1)) : (l(), G(yt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, uy = /* @__PURE__ */ Y(di, [["__scopeId", "data-v-a01e5a17"]]), hi = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["badge", e.tone])
    }, y(e.text), 3));
  }
}, Da = /* @__PURE__ */ Y(hi, [["__scopeId", "data-v-9e7e1157"]]), fi = ["aria-valuenow", "aria-valuemax"], pi = {
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
      class: ee(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: $e({ width: n.value })
      }, null, 4)
    ], 10, fi));
  }
}, mi = /* @__PURE__ */ Y(pi, [["__scopeId", "data-v-9eba6a85"]]), gi = { class: "bars" }, vi = { class: "bar-name" }, yi = { class: "bar-value" }, wi = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = O(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", gi, [
      (l(!0), d(Z, null, re(e.items, (c, u) => (l(), G(lt(c.open ? "button" : "div"), {
        key: `${u}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: ee(["bar-row", c.tone, { opens: c.open }]),
        onClick: (h) => c.open && s("open", c.open)
      }, {
        default: V(() => [
          p("span", vi, y(c.label), 1),
          F(mi, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", yi, y(c.value) + y(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ki = /* @__PURE__ */ Y(wi, [["__scopeId", "data-v-663427f4"]]), bi = { class: "bars" }, $i = {
  key: 0,
  class: "bars-title"
}, xi = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", bi, [
      e.node.title ? (l(), d("span", $i, y(e.node.title), 1)) : I("", !0),
      F(ki, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Mi = /* @__PURE__ */ Y(xi, [["__scopeId", "data-v-7135bb11"]]), _i = {
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
      class: ee([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: $e(o.value)
    }, [
      (l(!0), d(Z, null, re(e.node.children || [], (c, u) => (l(), G(fo, {
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (h) => a("open", h)),
        onFile: i[1] || (i[1] = (h) => a("file", h))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Qt = /* @__PURE__ */ Y(_i, [["__scopeId", "data-v-d142a3f4"]]), Si = {
  key: 0,
  class: "card-head"
}, Ei = { class: "card-title" }, Ci = {
  key: 0,
  class: "card-note"
}, Ai = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: ee(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), d("header", Si, [
        p("span", Ei, y(e.node.title), 1),
        e.node.note ? (l(), d("span", Ci, y(e.node.note), 1)) : I("", !0)
      ])) : I("", !0),
      F(Qt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Oi = /* @__PURE__ */ Y(Ai, [["__scopeId", "data-v-67b72d40"]]), Ti = (e, t, n) => Math.max(t, Math.min(n, e)), Ii = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, _e = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ns = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", En = 80;
function js(e) {
  return e.length <= En ? e : `${e.slice(0, En + 1).replace(/\s+\S*$/, "") || e.slice(0, En)}…`;
}
const Ps = {
  messages: (e) => js(Ns(e.text)),
  comments: (e) => js(Ns(e.text)),
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
}, Bi = (e) => (Ps[e.table] ? Ps[e.table](e) : e.title || "") || "", Ri = ["done", "cancelled"], Xn = {
  tasks: (e) => _e(e.completed_at) || (e.state === "cancelled" ? _e(e.updated_at) : 0),
  questions: (e) => e.answer ? _e(e.updated_at) : 0,
  plans: (e) => Ri.includes(e.state) ? _e(e.updated_at) : 0,
  pins: (e) => _e(e.closed_at),
  secrets: (e) => _e(e.deleted_at),
  workers: (e) => e.state === "stopped" ? _e(e.updated_at) : 0,
  shares: (e) => _e(e.stopped_at),
  dumps: (e) => _e(e.completed_at),
  agents: (e) => e.state === "ended" ? _e(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? _e(e.created_at) : 0
}, Li = (e) => Xn[e.table] ? Xn[e.table](e) : 0, Na = (e) => Li(e) > 0, Di = (e) => !!Xn[e], ja = (e) => _e(e.created_at), rn = (e) => _e(e.updated_at) || ja(e), Ni = (e) => "task_ids" in e, bn = typeof document < "u" && document.documentElement.classList.contains("phone"), ji = "Files are attached on the computer; the phone sends text.", Pa = 1024, Pi = Pa * 1024 * 1024, qi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Pa} MB limit for one file.`;
function Wi() {
  return () => {
  };
}
function qs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Fi(e = window) {
  if (!qs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    qs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const qa = "status.summary", ye = ys({
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
}), Hi = () => !!(ye.version || ye.external) && !ye.failure && !ye.late, Wa = () => !!ye.countdown || Hi() || ye.starting;
function Ui(e, t = "") {
  ye.starting = e === !1, ye.bootStep = ye.starting ? t : "";
}
function Vi(e) {
  e && e.version && (ye.target = e.version), ye.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function zi() {
  Object.assign(ye, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Gi(e, t = "") {
  return e && t && (ye.step = t), ye.version || (e && !ye.external && Object.assign(ye, { external: !0, since: Date.now() / 1e3 }), e || !ye.external) ? !1 : (zi(), !0);
}
let Ut = { version: "", started: 0 };
function Ki(e) {
  return e.version ? (Ut.version || (Ut = { version: e.version, started: e.started || 0 }), e.version !== Ut.version || (e.started || 0) !== Ut.started) : !1;
}
function Yi(e) {
  Vi(e.countdown), Ui(e.ready, e.step), (Gi(!!e.updating, e.step) || !e.updating && !Ji(e) && Ki(e)) && Fi(window);
}
const Ji = (e) => !!ye.version && !ye.failure && !ye.late && e.version !== ye.version, Ws = 2e4, Zi = 3e5, Fe = 6e5, Vt = 6, Xi = 500, Qi = "/journal/summary", Fs = bn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, el = (e) => e.split("?")[0].endsWith(Qi), Fa = (e, t) => Object.assign(new Error(t), { status: e });
async function tl(e, t, n = Fa) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const nl = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class sl {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Vt;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Vt;
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
        headers: { ...Fs, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: nl(s),
        signal: AbortSignal.timeout(a || (i ? Zi : Ws))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, Xi)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Vt, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Wi(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return tl(c, `${c.status} ${c.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Fs, signal: AbortSignal.timeout(Ws) });
    if (!n.ok) throw Fa(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Vt, o).then((c) => (this.written(n), c));
    if (Wa() && !el(n))
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
const je = new sl(), Ee = (e) => encodeURIComponent(e);
function fe(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const bt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), $t = "the page does not know its environment yet", al = "X-Journal-Env", ol = "X-Journal-Request-At", Cn = "/viewer/voices/figures/";
class bs {
  constructor({ env: t = () => Pe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new bs({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [ol]: String(Date.now()), ...this.env() ? { [al]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === $t ? Promise.reject(new Error($t)) : je.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === $t ? Promise.reject(new Error($t)) : je.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : $t;
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
    return this.get(`/updates/changelog${fe({ skip: t })}`);
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
    return this.get(this.here(`/entries${fe({ since: t, last: n })}`));
  }
  stream(t = 0) {
    const n = t ? `?since=${t}` : "";
    return je.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: c = !1, docked: u = !1 } = {}) {
    const h = this.here(`/${t}${fe({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: c ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(h, `${t}.${bt({ before: s, after: a, since: o, ids: r, tasks: i, closed: c, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${fe({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
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
    if (bn) return Promise.reject(Object.assign(new Error(ji), { status: 403 }));
    if (s.size > Pi) return Promise.reject(new Error(qi(s)));
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
    return je.bytes(t);
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
    return this.get(this.here(`/messages${fe({ on: t })}`), "messages.on");
  }
  // every row and conversation line here that holds all the words
  search(t, { models: n = [], conversations: s = !1 } = {}) {
    const a = { words: t, models: n.join(","), conversations: s ? 1 : "" };
    return this.get(this.here(`/search${fe(a)}`));
  }
  // the documents a search finds, best first, and the files attached to messages, a page at a time
  locateDocs(t) {
    return this.get(this.here(`/docs/search${fe({ words: t })}`));
  }
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: o }) {
    return this.get(this.here(`/attachments${fe({ file_type: t, shelf: n, search: s, last: a, skip: o })}`));
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
    return this.get(`/agents/controls/${Ee(t)}${fe({ model: n, effort: s })}`);
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
    return this.get(this.here(`${a}${fe(s)}`), `${a}.${bt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${fe(n)}`), `/verifiers/${t}/transcript.${bt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${fe(n)}`), `/workers/${t}/transcript.${bt(n)}`);
  }
  edits(t, n, s = {}) {
    return this.get(this.here(`/agents/${t}/edits${fe({ since: n, ...s })}`));
  }
  editedText(t, n) {
    return this.get(this.here(`/agents/${t}/edits/text${fe({ edit: n })}`));
  }
  editedImageUrl(t, n) {
    return this.address(`/agents/${t}/edits/image${fe({ edit: n })}`);
  }
  terminal(t, n = 0) {
    return this.get(this.here(`/agents/${t}/terminal${fe({ after: n })}`));
  }
  // who the viewer is and who else is on the journal, so it says you only for its own person
  people() {
    return this.get("/people");
  }
  // whether this journal is connected to a team, and as whom; the one team, or the team named
  team(t = "") {
    return this.get(`/team${fe({ team: t })}`);
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
    return this.get(`/team/devices${fe({ team: t })}`);
  }
  revokeTeamDevice(t, n = "") {
    return this.post("/team/revoke", { device: t, team: n });
  }
  teamPeople(t = "") {
    return this.get(`/team/people${fe({ team: t })}`);
  }
  // changes this person's own password on the team
  changeTeamPassword(t, n, s = "") {
    return this.post("/team/password", { old: t, new: n, team: s });
  }
  // the library's items, each with its newest version and the version this journal imported, by kind and words
  libraryItems(t, n, s = "") {
    return this.get(`/library/items${fe({ type: t, search: n, team: s })}`);
  }
  // one library item with every version and its note, and the version this journal imported
  libraryItem(t, n, s = "") {
    return this.get(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}${fe({ team: s })}`);
  }
  // every copy here that came from the library, with the version it came from and the row or file it is
  libraryCopies(t = "") {
    return this.get(`/library/copies${fe({ team: t })}`);
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
    const a = this.here(`/outputs/${t}${fe({ after: n, before: s })}`);
    return this.get(a, a);
  }
  activeCards(t) {
    return this.get(this.here(`/cards/active?ids=${t.join(",")}`));
  }
  // skills and voices
  skills(t = 0) {
    return this.get(this.here(`/skills${fe({ agent: t })}`));
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
    return je.request("GET", Cn + "figures.json");
  }
  voiceFigureUrl(t) {
    return Cn + t;
  }
  figureDecoderUrl() {
    return Cn + "draco/";
  }
  // the project's files
  projectFiles(t = "") {
    return this.get(this.here(`/project-files${fe({ folder: t })}`));
  }
  findFiles(t) {
    return this.get(this.here(`/project-files/find${fe({ q: t })}`));
  }
  projectFile(t) {
    return this.get(this.here(`/project-files/file${fe({ path: t })}`));
  }
  projectFileUrl(t) {
    return this.address(`/project-files/raw${fe({ path: t })}`);
  }
  fileDiff(t) {
    return this.get(this.here(`/project-files/diff${fe({ path: t })}`));
  }
  // the project's repository
  gitBranches(t = 0, n = 30) {
    return this.get(this.here(`/git/branches${fe({ skip: t, last: n })}`));
  }
  gitCommits(t = 0, n = 30) {
    return this.get(this.here(`/git/commits${fe({ skip: t, last: n })}`));
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
    return this.get(this.here(`/plugins/${t}/log${fe({ lines: n })}`));
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
    return `${this.base}/${t ? `?env=${Ee(t)}` : ""}${kn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ue = new bs({ base: bn ? "/p" : "" }), rl = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ue.base.length).split("/")[2]);
}), il = { claude: "Claude Code", codex: "Codex" };
Object.entries(il).map(([e, t]) => ({ key: e, label: t }));
const Hs = (e) => e.status === "stopped" ? 1 : 0, ll = "main", cl = (e) => e.filter((t) => t.role === ll).sort((t, n) => Hs(t) - Hs(n) || _e(n.heard_at) - _e(t.heard_at))[0] || null, ul = { me: 1, people: [] }, K = ys({
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
  people: ul,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Tt("journal.activity", !0),
  wide: !1,
  sideMini: Tt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ia("journal.activity", () => K.activity);
Ia("journal.side.mini", () => K.sideMini);
const gt = O(() => cl(K.agents));
O(() => !!gt.value && K.live.some((e) => e.agent.session === gt.value.session && e.environment === Pe.value.env));
O(() => !!gt.value && ["busy", "working"].includes(gt.value.status));
function dl(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Qn(e) {
  const t = dl(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Ha(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Us(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const An = (e) => String(e).padStart(2, "0");
function hl(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${An(t % 60)}s` : `${Math.floor(t / 3600)}h ${An(Math.floor(t % 3600 / 60))}m ${An(t % 60)}s`;
}
const fl = ["working", "busy", "waiting", "compacting"], pl = (e) => fl.includes(e), ml = "builder";
O(() => !K.settings || K.settings.features.file_feed !== !1);
const gl = O(() => !K.settings || K.settings.features.status_bar !== !1);
O(() => K.settings && K.settings.workers && K.settings.workers.mode || ml);
O(() => !K.settings || !K.settings.tasks || K.settings.tasks.auto !== !1);
O(() => !!(K.settings && K.settings.reviewing && K.settings.reviewing.reviewer));
O(() => !K.settings || K.settings.features.sharing !== !1);
const ln = 50, $s = 100, vl = { messages: 25 }, Le = (e) => vl[e] || ln;
function yl(e, t) {
  if (e !== "messages") return Math.max(t.length - Le(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Le(e)) return s;
  return 0;
}
const wl = "review_step", kl = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === wl).sort((t, n) => t.id - n.id), bl = 5, $l = 500, xl = 3e3, Ml = () => K.entries.length ? K.entries[K.entries.length - 1].id : 0, en = { env: "", id: 0 }, _l = () => !!(K.bar && K.bar.length) || pl(gt.value && gt.value.status);
function Sl({ session: e }) {
  return (e ? ue.chat(e, { docked: !0 }) : ue.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function El() {
  return ue.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ue.chat(t.session, { limit: $s })))).then(kl);
}
function Cl() {
  return en.env !== ue.env() && Object.assign(en, { env: ue.env(), id: Ml() }), ue.entries(en.id);
}
function Al(e) {
  e.length && (en.id = e[e.length - 1].id, kc(e));
}
async function Ol({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", ln);
}
const es = /* @__PURE__ */ new Map();
async function ts(e, t) {
  const n = `${e}:${ue.env()}`, s = es.get(n);
  if (!s) return Vs(n, (await ue.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(rn)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ue.list("workers", { limit: t, since: a, after: o });
  if (!r.is_last_page)
    return es.delete(n), ts(e, t);
  const i = new Set(r.rows.map((c) => c.id));
  return Vs(
    n,
    [...s.filter((c) => !i.has(c.id)), ...r.rows].sort((c, u) => c.id - u.id)
  );
}
const Vs = (e, t) => (es.set(e, t), t);
async function zs(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Gs = Object.freeze({
  "status.bar": {
    read: () => ue.bar(),
    every: () => _l() ? $l : xl,
    take: (e) => Array.isArray(e) && (K.bar = e),
    active: () => gl.value
  },
  "agents.index": { read: () => zs(ue, bl), every: 1e3, take: (e) => K.agents = e.rows },
  "agents.live": { read: () => ue.liveAgents(), every: 5e3, take: (e) => K.live = e },
  "status.summary": {
    read: () => ue.summary(),
    every: () => ye.countdown || ye.external || ye.version ? 1e3 : 4e3,
    take: (e) => {
      K.summary = e, Yi(e);
    }
  },
  "journal.manifest": { read: () => ue.manifest(), every: 3e4, take: (e) => K.spec = e },
  "journals.index": { read: () => ue.journals(), every: 1e4, take: (e) => K.journals = e },
  "people.index": { read: () => ue.people(), every: 3e4, take: (e) => e && e.people && (K.people = e) },
  "entries.recent": { read: Cl, every: 1e3, take: Al },
  "outputs.running": { read: () => ue.runningOutputs(), every: 3e3 },
  "messages.docked": { read: Sl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ue.mcp(), every: 3e4 },
  "developer.readers": { read: () => ue.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => ts("workers.index", Le("workers")), every: 5e3 },
  "workers.activity": { read: () => ue.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => ts("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ue.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ue.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: El, every: 3e3 },
  "tests.turns": { read: () => ue.list("test_turns", { limit: Le("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ue.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ue.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ue.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ue.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: Ol, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => zs(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: ln }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: ln }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), Tl = 6e4, Il = 3e3, Bl = 4, Rl = 300, Ll = 5e3, Ua = /* @__PURE__ */ new Map();
function $n(e) {
  if (!(e in Gs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Gs[e];
}
function Dl(e) {
  const t = $n(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Ll;
  }
}
const Nl = (e) => e / 2 + Math.random() * e / 2, Va = (e) => [...e.users.values()].pop(), xs = (e) => Ua.get(e.place) === e, jl = () => Math.random() * Rl, Ms = () => document.hidden;
function Pl(e) {
  const t = Dl(e);
  return e.failures ? Nl(Math.min(e.key === qa ? Il : Tl, t * 2 ** e.failures)) : Math.max(t, Bl * e.took);
}
function za(e, t) {
  clearTimeout(e.timer), !(!xs(e) || e.paused || Ms()) && (e.timer = setTimeout(() => ql(e), t));
}
function ql(e) {
  return xs(e) ? e.running ? (e.again = !0, e.running) : (e.running = Ul(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Wl = (e) => {
  var t, n;
  return !e.paused && !Ms() && (((n = (t = $n(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Va(e).active() && (!Wa() || e.key === qa);
};
async function Fl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => $n(e.key).read(Va(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Hl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = $n(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Ul(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Wl(e) && Hl(e, await Fl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && xs(e) && !e.paused);
  za(e, Pl(e));
}
const Vl = () => Ms() || Ua.forEach((e) => za(e, jl()));
document.addEventListener("visibilitychange", Vl);
const zl = 60, Gl = (e, t) => _e(e.created_at) >= _e(t.created_at) - zl, Kl = (e, t) => e.id > 0 && e.table === t.table && Gl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), _s = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Kl(s, n))), On = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], pe = (e, t, n, s = {}) => ({
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
}), Nt = {
  messages: pe("Message", "mail", "What the user left for the agent, or the agent for the user", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: pe("Question", "help", "Something the agent asks the user, with choices to pick", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: pe("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: On
  }),
  tasks: pe("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: On
  }),
  reports: pe("Report", "report", "What was checked and what was found, written for the user", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: pe("Collection", "folder", "Rows that belong together, gathered under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: pe("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: pe("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: pe("Rule", "list", "A ruling that binds every environment of the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: pe("Reminder", "clock", "An instruction said again until it is retired", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: pe("Pin", "band", "One line pinned to the chat while it matters", { filters: On }),
  reactions: pe("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: pe("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", { scope: "project" }),
  environments: pe("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", { scope: "project" }),
  agents: pe("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: pe("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: pe("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
  verifiers: pe("Verifier", "verifier", "An agent the journal sends by itself to judge whether a dismissed reader report was dismissed rightly"),
  test_turns: pe("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: pe("Reviewer", "reviewer", "An agent the journal sends by itself, in orchestrator mode with the reviewer on, to test and check each worker's work and report each point to the agent"),
  subagents: pe("Subagent", "bot", "A helper the agent started inside its own session for one job", { nested: !0 }),
  sequences: pe("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: pe("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: pe("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: pe("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: pe("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: pe("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: pe("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Yl = ["secrets", "plugins"], Ga = Object.keys(Nt).filter((e) => !(bn && Yl.includes(e)));
O(() => Ga.map((e) => ({ name: e, ...Nt[e] })));
const jt = (e) => Nt[e], Ka = new Map(Ga.flatMap((e) => [e, e.replace(/s$/, ""), Nt[e].title.toLowerCase()].map((t) => [t, e]))), ot = (e) => Ka.get(String(e).toLowerCase()) || "", Ya = [...Ka.keys()].sort((e, t) => t.length - e.length).join("|"), Qe = /* @__PURE__ */ new Set(), Ss = R(0), Pt = /* @__PURE__ */ new Set(), qt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), ns = /* @__PURE__ */ new Set(), Jl = /* @__PURE__ */ new Map(), Zl = /* @__PURE__ */ new Map();
let xt = !1, Mt = null;
const Xl = (e, t) => e.id - t.id, Ql = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, ec = { messages: Ql }, Ja = (e) => ec[e] || Xl;
function Za(e) {
  return Ss.value, Qe.has(e) || (Qe.add(e), K.booted && (!Pt.has(e) || qt.has(e)) && queueMicrotask(() => Mn([e], !1))), K.rows[e] || [];
}
function tc(e) {
  const t = K.rows[e] || [], n = yl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  K.rows[e] = t.filter((a) => s.has(a) || Di(e) && !Na(a)), K.paging.size[e] = Le(e), K.paging.more[e] = !0;
}
const nc = /* @__PURE__ */ new Set();
function sc() {
  Qe.forEach(tc), Qe.clear(), Jl.clear(), Zl.clear(), Ss.value += 1;
}
be(() => `${Pe.value.env}/${Pe.value.page}/${Pe.value.open ? Pe.value.open.table : ""}`, sc);
be(
  () => K.booted,
  (e) => e && Mn(
    [...Qe].filter((t) => !Pt.has(t)),
    !1
  )
);
const ss = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Ni(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Xa(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (ss(s) && !ss(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Qa(e, t) {
  Pt.add(e), Ss.value += 1;
  const n = K.rows[e] || [];
  K.rows[e] = [...Xa(n, t.rows), ..._s(n.filter((s) => s.id === 0), t.rows)], K.paging.size[e] = K.paging.size[e] || Le(e), K.paging.more[e] = !t.is_last_page;
}
async function ac(e) {
  const t = new Set((K.rows[e] || []).map((o) => o.id)), n = await ue.list(e, { limit: Le(e) });
  xn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = _s((K.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Qa(e, { ...n, rows: [...n.rows, ...a].sort(Ja(e)) }), K.paging.size[e] = Le(e), eo.has(e) && await to(e), K.rows[e];
}
const xn = (e, t) => K.counts = { ...K.counts, [e]: t };
async function oc(e) {
  const t = K.rows[e] || [], n = Math.max(0, ...t.map(rn)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ue.list(e, { limit: Le(e), since: n, after: s });
  if (xn(e, a.counts), !a.is_last_page) return ac(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = _s(t.filter((i) => !o.has(i.id)), a.rows).concat(Xa(t, a.rows));
  return K.rows[e] = r.sort(Ja(e)), K.paging.size[e] = K.rows[e].length, K.rows[e];
}
const Tn = /* @__PURE__ */ new Set();
async function rc(e, t = !1) {
  e.forEach((n) => qt.delete(n)), e.forEach((n) => ns.add(n));
  try {
    await fc(e, t);
  } finally {
    e.forEach((n) => ns.delete(n));
  }
}
async function ic(e) {
  const t = await ue.list(e, { limit: Le(e) });
  xn(e, t.counts), Qa(e, t);
}
async function lc(e) {
  xn(e, (await ue.list(e, { limit: 1, closed: !0 })).counts);
}
const eo = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function to(e) {
  const t = (K.rows[e] || []).filter((a) => ss(a) && (e !== "plans" || !Na(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ue.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  K.rows[e] = (K.rows[e] || []).map((a) => s.get(a.id) || a);
}
const cc = (e, t) => !Pt.has(e) || t && (K.paging.size[e] || Le(e)) === Le(e) && !nc.has(e);
async function uc(e, t) {
  if (!Qe.has(e)) return lc(e);
  const n = await (cc(e, t) ? ic(e) : oc(e));
  return eo.has(e) && await to(e), n;
}
async function no() {
  const e = await ue.settings();
  JSON.stringify(e) !== JSON.stringify(K.settings) && (K.settings = e);
}
async function dc() {
  const [e] = await Promise.all([ue.entries(0, $s), no()]);
  oo([...Tt(ao(), []), ...e]);
}
const hc = (e, t) => uc(e, t).then(
  () => null,
  () => e
);
async function fc(e, t) {
  const n = (await Promise.all(e.map((s) => hc(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), qt.add(s))), t && await dc(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const so = 1e3, pc = 15e3;
let zt = so;
async function mc() {
  return Mt || (Mt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !Tn.has(e)) || xt; ) {
      const e = xt, t = [...e ? Object.keys(K.rows) : Ke].filter((s) => Nt[s] && (Qe.has(s) || s in K.rows)).filter((s) => e || !Qe.has(s) || qt.has(s) || !Pt.has(s)).filter((s) => !Tn.has(s)), n = [...Ke].filter((s) => Tn.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), xt = !1;
      try {
        await rc(t, e), zt = so;
      } catch {
        xt = xt || e, await new Promise((a) => setTimeout(a, zt)), zt = Math.min(zt * 2, pc);
      }
    }
  })().finally(() => Mt = null), Mt);
}
function Mn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !ns.has(n)).forEach((n) => {
    Ke.add(n), t && qt.add(n);
  }), Ke.delete("settings") && no(), mc();
}
const ao = () => {
  var e;
  return `typed-entries:${((e = K.identity) == null ? void 0 : e.root) || location.host}:${ue.env()}`;
};
function oo(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  K.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-$s), wn(ao(), K.entries.slice(-50));
}
const gc = ["created", "updated", "deleted"], vc = { phases: ["phases", "plans"] }, as = (e) => vc[e] || [e], yc = (e) => gc.includes(e.entry_type) ? [...as(e.data.table), ...(e.data.joins || []).flatMap(as)] : [];
function wc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of as(t.data.table).filter((s) => K.rows[s]))
      K.rows[n] = K.rows[n].filter((s) => s.id !== t.data.id);
}
function kc(e) {
  oo([...K.entries, ...e]), wc(e), Mn([...new Set(e.flatMap(yc))].filter((t) => t && t !== "agents"));
}
rl((e) => K.streamOpen || Mn([e]));
const os = [], bc = 2e3, Ge = /* @__PURE__ */ new Map(), $c = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, xc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ct(e, { first: t = !1 } = {}) {
  t ? os.unshift(e) : os.push(e), Ge.clear();
}
function ro(e, t, n) {
  var a;
  const s = Za(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Mc = (e) => Za(e.table).find((t) => t.id === e.id) === e.row, _c = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Sc(e, t) {
  const n = [{ kind: "text", text: Ue(e).replace(/\r\n/g, `
`) }];
  for (const s of os)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function It(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Ec(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Ec(e) {
  return e.split(xc).map((t, n) => n % 2 ? t : t.replace($c, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ks(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Cc(e) {
  const [t, , ...n] = e, s = Ks(t).map((o) => `<th>${It(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Ks(o).map((r) => `<td>${It(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Ac(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${It(a)}</li>`).join("")}</${s}>`;
}
const Ys = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function io(e) {
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
      const i = t.findIndex((u, h) => h > s && /^(```|~~~)/.test(u)), c = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(s + 1, c).join(`
`)}</code></pre>`), s = c + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${It(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ys(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Cc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(Ac(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${io(
          t.slice(s, i).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Ys(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${It(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Oc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Tc = (e) => e.kind !== "text" && !Oc.test(e.html);
function Ic(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(io(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Tc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function rs(e, t = { env: "" }) {
  const n = _c(e, t), s = Ge.get(n);
  if (Ge.delete(n), s && s.reads.every(Mc))
    return Ge.set(n, s), s.html;
  const a = [], o = Ic(Sc(e, { ...t, reads: a }));
  return Ge.set(n, { html: o, reads: a }), Ge.size > bc && Ge.delete(Ge.keys().next().value), o;
}
const lo = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, cn = (e) => String(e || "").replace(lo, (t, n, s, a) => a), Bc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Gt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Rc = /^Traceback \(most recent call last\):/m, Lc = 8;
function co(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Lc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Dc(e) {
  const t = [...e.matchAll(Bc)].map((s) => s.index);
  if (Gt.lastIndex = 0, !t.length || !Gt.test(e)) return null;
  Gt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Gt)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: co(n), tail: "" } : null;
}
function Nc(e) {
  const t = Rc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: co([o]), tail: n.slice(a).join(`
`) };
}
ct((e) => {
  const t = cn(e), n = Nc(t) || Dc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const is = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", jc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Pc = `${is} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, qc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Wc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Js = {
  js: { keywords: is, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: jc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Pc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: is, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: qc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Wc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Zs(e, t, n) {
  return n && e.startsWith(n, t);
}
function Fc(e, t) {
  const n = Js[t] || Js.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const r = (i, c) => c && a.push({ kind: i, value: c });
  for (; o < e.length; ) {
    const i = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), h = e.slice(o, u < 0 ? e.length : u);
      r(
        /^#{1,6}\s/.test(h) ? "keyword" : /^(```|~~~)/.test(h) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(h) ? "number" : "plain",
        h
      ), r("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (Zs(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Zs(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), h = u < 0 ? e.length : u + n.block[1].length;
      r("comment", e.slice(o, h)), o = h;
      continue;
    }
    const c = (n.triple || []).find((u) => e.startsWith(u, o));
    if (c) {
      const u = e.indexOf(c, o + 3), h = u < 0 ? e.length : u + 3;
      r("string", e.slice(o, h)), o = h;
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
      const h = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? h.toLowerCase() : h, k = n.property && /^\s*:/.test(e.slice(o + h.length));
      r(s.has(m) ? "keyword" : k ? "property" : /^[A-Z]/.test(h) && t !== "text" ? "type" : "plain", h), o += h.length;
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
function Hc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Fc(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Ue(r) : `<span class="tok-${s}">${Ue(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Uc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Vc = 1500, Xs = /* @__PURE__ */ new WeakMap();
async function zc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Uc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Xs.get(t)), Xs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Vc)
  )));
}
typeof document < "u" && document.addEventListener("click", zc, !0);
const Gc = /^(```|~~~)\s*(\w+)?\s*$/, Kc = /^\s{4,}\S/, Yc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Jc = /^\s*(?:[-*+]|\d+[.)])\s/, uo = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Zc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ho(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Xc(e) {
  const t = ho(e.join(`
`));
  return (Zc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Qc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && uo.test(t) && !Jc.test(t);
};
function Qs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Hc(ho(e.join(`
`)), t || Xc(e)).join(`
`)}</code></pre></div>` };
}
function eu(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Gc);
    if (r) {
      const c = t.findIndex((h, m) => m > o && h.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Qs(t.slice(o + 1, u).map(cn), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Qc(s) ? Yc : Kc;
    if (i.test(t[o])) {
      let c = o;
      for (; c < t.length && (i.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && uo.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (c - o + u.length >= 2) {
        a(), n.push(Qs([...u, ...t.slice(o, c)].map(cn), "")), o = c;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ct((e) => eu(e));
const tu = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, nu = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function su(e) {
  const t = tu.exec(e);
  if (t && ot(t[1])) return { at: t.index, length: t[0].length, table: ot(t[1]), id: Number(t[2]), label: t[3] };
  const n = nu.exec(e), s = n && ot(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function au(e, t, n, s) {
  const a = ro(s, e, t), o = cn(a ? Bi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(jt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
ct(
  (e, t) => {
    const n = su(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: au(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const ou = /\.(png|jpe?g|gif|webp|svg)$/i, ru = (e) => ou.test(e), iu = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, lu = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function cu(e, t) {
  const n = iu.exec(e), [, s, a, o, r, i] = n || [], c = n && ot(s || o), u = c && ro(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const h = ue.in(t.env).fileUrl(c, u.id, i), m = `${jt(c).title} ${u.id} · ${Ue(i)}`, k = ru(i) ? `<img class="file-card-image" src="${h}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${h}" data-attached="${Ue(i)}">${k}<span class="file-card-name">${m}</span></a>` };
}
function uu(e) {
  const t = lu.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ct(
  (e, t) => {
    if (t.inline) return null;
    const n = cu(e, t) || uu(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const du = /`([^`\n]+)`/g;
ct((e) => e.replace(du, (t, n) => `<code>${n}</code>`));
const ea = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${kn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ct(
  (e, t) => e.replace(lo, (n, s, a, o) => ea[s] ? ea[s](a, o, t) : o)
);
const hu = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, fu = new RegExp(`\\b(${Ya}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), pu = new RegExp(`\\b(${Ya}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), mu = (e, t) => `<a class="row-pill" href="#" data-peek="${ot(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, gu = (e) => e.replace(pu, (t, n, s) => s.replace(/\d+/g, (a) => mu(n.replace(/s$/i, ""), a))), vu = (e) => gu(e).replace(
  fu,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${ot(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
ct(
  (e, t) => t.rowNames === !1 ? e : e.split(hu).map((n, s) => s % 2 ? n : vu(n)).join("")
);
const yu = ["innerHTML"], wu = ["innerHTML"], ku = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = O(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = rs(s, { env: Pe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(pt) && z(pt)(...o)),
      innerHTML: n.value
    }, null, 8, yu)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(pt) && z(pt)(...o)),
      innerHTML: n.value
    }, null, 8, wu));
  }
}, at = /* @__PURE__ */ Y(ku, [["__scopeId", "data-v-1a43d211"]]), bu = { class: "fact" }, $u = { class: "fact-label" }, xu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", bu, [
      p("span", $u, y(e.label), 1),
      F(at, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Mu = /* @__PURE__ */ Y(xu, [["__scopeId", "data-v-3a88ecf8"]]), _u = { class: "list" }, Su = { class: "list-label" }, Eu = {
  key: 1,
  class: "list-note"
}, Cu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", _u, [
      (l(!0), d(Z, null, re(e.items, (o, r) => (l(), G(lt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: ee(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          p("span", Su, y(o.label), 1),
          o.badge ? (l(), G(Da, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : I("", !0),
          o.note ? (l(), d("span", Eu, y(o.note), 1)) : I("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Au = /* @__PURE__ */ Y(Cu, [["__scopeId", "data-v-ebe2ae0a"]]), Ou = { class: "table" }, Tu = {
  key: 0,
  class: "table-row empty"
}, Iu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", Ou, [
      p("div", {
        class: "table-row head",
        style: $e(a.value)
      }, [
        (l(!0), d(Z, null, re(e.columns, (i) => (l(), d("span", {
          key: i,
          class: "cell"
        }, y(i), 1))), 128))
      ], 4),
      (l(!0), d(Z, null, re(e.rows, (i, c) => (l(), G(lt(i.open ? "button" : "div"), {
        key: c,
        type: i.open ? "button" : void 0,
        class: ee(["table-row", i.tone, { opens: i.open }]),
        style: $e(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: V(() => [
          (l(!0), d(Z, null, re(i.cells, (u, h) => (l(), d("span", {
            key: h,
            class: "cell"
          }, y(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), d("div", Tu, y(e.empty), 1)) : I("", !0)
    ]));
  }
}, Bu = /* @__PURE__ */ Y(Iu, [["__scopeId", "data-v-9326a52e"]]), Ru = { class: "stat-value" }, Lu = { class: "stat-label" }, Du = {
  key: 0,
  class: "stat-note"
}, Nu = {
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
      class: ee(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        p("span", Ru, y(e.value), 1),
        p("span", Lu, y(e.label), 1),
        e.note ? (l(), d("span", Du, y(e.note), 1)) : I("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ju = /* @__PURE__ */ Y(Nu, [["__scopeId", "data-v-ad0db6d6"]]), Pu = { class: "code" }, qu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (l(), G(ws, {
      value: e.node.type
    }, {
      stack: V(() => [
        F(Qt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: V(() => [
        F(Qt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: V(() => [
        F(Qt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: V(() => [
        F(Oi, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: V(() => [
        p("h3", {
          class: ee(["heading", `level-${e.node.level || 2}`])
        }, y(e.node.text), 3)
      ]),
      divider: V(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: V(() => [
        F(ju, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: V(() => [
        F(Mi, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: V(() => [
        F(Bu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: V(() => [
        F(Au, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: V(() => [
        F(at, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: V(() => [
        F(Mu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: V(() => [
        F(Da, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: V(() => [
        p("pre", Pu, [
          p("code", null, y(e.node.text), 1)
        ])
      ]),
      file: V(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, y(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), fo = /* @__PURE__ */ Y(qu, [["__scopeId", "data-v-cbdcf540"]]), Wu = { class: "dashboard" }, Fu = { class: "trail" }, Hu = ["onClick"], Uu = {
  key: 0,
  class: "gone",
  role: "status"
}, Vu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (k) => k in (n.document.pages || {}), o = R(!!n.page && !a(n.page)), r = R(n.page && !o.value ? [n.page] : []), i = O(() => r.value.at(-1) || n.document.start), c = O(() => (n.document.pages || {})[i.value] || null), u = (k) => ((n.document.pages || {})[k] || {}).title || k, h = (k) => {
      o.value = !1, r.value = [...r.value, k];
    }, m = (k) => {
      o.value = !1, r.value = r.value.slice(0, k);
    };
    return be(
      () => n.document.start,
      () => r.value = []
    ), (k, S) => (l(), d("div", Wu, [
      e.document.broken ? (l(), G(sn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          he(y(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), G(sn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: V(() => [
          he(y(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(Z, { key: 2 }, [
        p("nav", Fu, [
          p("button", {
            type: "button",
            class: ee(["step", { current: !r.value.length }]),
            onClick: S[0] || (S[0] = (P) => m(0))
          }, y(u(e.document.start)), 3),
          (l(!0), d(Z, null, re(r.value, (P, L) => (l(), d(Z, {
            key: `${L}-${P}`
          }, [
            S[2] || (S[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: ee(["step", { current: L === r.value.length - 1 }]),
              onClick: (w) => m(L + 1)
            }, y(u(P)), 11, Hu)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Uu, "What you opened is no longer in this dashboard. Here is its start page.")) : I("", !0),
        F(Lt, {
          name: "page",
          mode: "out-in"
        }, {
          default: V(() => [
            (l(), d("div", {
              key: i.value,
              class: "page"
            }, [
              F(fo, {
                node: c.value.view,
                onOpen: h,
                onFile: S[1] || (S[1] = (P) => s("file", P))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : I("", !0)
    ]));
  }
}, dy = /* @__PURE__ */ Y(Vu, [["__scopeId", "data-v-fbe83734"]]);
function zu(e, t, n, s = () => window) {
  De(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Gu = (e, t = () => !0) => zu("keydown", (n) => n.key === "Escape" && t() && e());
function Ku(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = R(!1), a = O(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Gu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Yu = 80, ht = ys([]);
function Ju(e) {
  const t = Symbol("layer"), n = () => ht.includes(t) && ht.splice(ht.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !ht.includes(t) && ht.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), O(() => Yu + Math.max(0, ht.indexOf(t)));
}
let po = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return po = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Zu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Xu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Zu)];
    if (!r.length) return o.preventDefault();
    const [i, c] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  De(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : po, document.addEventListener("keydown", a), Dt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Qu = ["aria-modal", "aria-label", "aria-labelledby"], ed = {
  key: 0,
  class: "dialog-head"
}, td = ["id", "tabindex"], nd = {
  key: 1,
  class: "dialog-foot"
}, sd = 500, ad = 400, od = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Ku(s, n), i = Ju(a), c = R(null), u = R(null), h = R(null), m = _a(), k = R(!1), S = Date.now();
    n.modal && Xu(u, () => s("escape"), h);
    function P() {
      if (!n.modal) return n.closable && o();
      k.value = !0, setTimeout(() => k.value = !1, ad);
    }
    function L(U) {
      !n.modal || Date.now() - S >= sd || ![" ", "Enter"].includes(U.key) || (U.preventDefault(), U.stopPropagation());
    }
    const w = () => c.value && (c.value.scrollTop = c.value.scrollHeight), b = new MutationObserver(w);
    return be(c, (U) => {
      b.disconnect(), U && n.follow && (b.observe(U, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Ae(() => b.disconnect()), (U, H) => (l(), G(Sa, { to: "body" }, [
      F(Lt, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: V(() => [
          z(a) ? (l(), d("div", {
            key: 0,
            class: ee(["dialog", { large: e.large, sheet: e.sheet }]),
            style: $e({ zIndex: z(i) }),
            onClick: Me(P, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: ee(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: k.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(m) : void 0,
              onKeydownCapture: L
            }, [
              e.bare ? I("", !0) : (l(), d("header", ed, [
                p("h3", {
                  id: z(m),
                  ref_key: "heading",
                  ref: h,
                  tabindex: e.modal ? -1 : void 0
                }, y(e.title), 9, td),
                e.closable ? (l(), G(ks, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : I("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: ee(["dialog-body", { bare: e.bare }])
              }, [
                we(U.$slots, "default", {}, void 0, !0)
              ], 2),
              U.$slots.foot ? (l(), d("footer", nd, [
                we(U.$slots, "foot", {}, void 0, !0)
              ])) : I("", !0)
            ], 42, Qu)
          ], 6)) : I("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, rd = /* @__PURE__ */ Y(od, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Re = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, id = 6;
function Es(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const ld = (e) => {
  const t = Es(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
  return { name: e, lines: t, line: ze.line, padY: ze.padY, width: n, height: t.length * ze.line + ze.padY * 2 };
};
function cd(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, c) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(c) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function ud(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function dd(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, c) => [i, c]))), o = (r, i) => {
    const c = a(), u = (h) => {
      const m = i(h).map((k) => c.get(k));
      return m.length ? m.reduce((k, S) => k + S, 0) / m.length : c.get(h);
    };
    return [...r].sort((h, m) => u(h) - u(m));
  };
  for (let r = 0; r < id; r++) {
    const i = r % 2 === 0, c = s.map((u, h) => h);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const h = (m) => t.filter((k) => k[i ? 1 : 0] === m).map((k) => k[i ? 0 : 1]);
      s[u] = o(s[u], h);
    });
  }
  return s;
}
function hd(e, t) {
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
function fd(e) {
  const t = [...new Set(e.flatMap(([M, g]) => [M, g]))], n = new Set(e.map(([, M]) => M)), s = t.filter((M) => !n.has(M)), a = cd(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((M, g) => !a.has(g)), r = ud(t, o), i = dd(t, o, r), c = new Map(t.map((M) => [M, ld(M)])), u = i.map((M) => M.reduce((g, D) => g + c.get(D).width, 0) + Be.across * (M.length - 1)), h = Math.max(...u) + Be.margin * 2, m = md(e, r, i.length), k = /* @__PURE__ */ new Map();
  let S = Be.margin;
  i.forEach((M, g) => {
    let D = (h - u[g]) / 2;
    const _ = Math.max(...M.map((N) => c.get(N).height));
    M.forEach((N) => {
      const $ = c.get(N);
      k.set(N, { ...$, x: D, y: S + (_ - $.height) / 2 }), D += $.width + Be.across;
    }), S += _ + (m[g] ?? Be.down);
  });
  const P = e.map(([M, g, D], _) => ({ from: M, to: g, label: D || "", back: a.has(_) || r.get(g) <= r.get(M) }));
  hd(P, k);
  const L = P.map((M) => gd(M, k.get(M.from), k.get(M.to))), w = [...k.values()], b = kd(L, w), U = Math.max(S - Be.down, ...b.filter((M) => M.label).map((M) => M.label.y + M.label.height));
  return { width: Math.max(h - Be.margin, ...b.filter((M) => M.label).map((M) => M.label.x + M.label.width)) + Be.margin, height: U + Be.margin, nodes: w, arrows: b };
}
const pd = (e) => e ? Es(e, Re.lineChars).length * Re.line + Re.pad * 2 : 0;
function md(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, h) => u - h);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += pd(r) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function gd(e, t, n) {
  const s = e.label ? Es(e.label, Re.lineChars) : [], a = s.length ? Math.max(...s.map((k) => k.length)) * Re.charWidth + Re.pad * 2 : 0, o = s.length * Re.line + (s.length ? Re.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, h = (u - i) / 2, m = [{ x: r, y: i }, { x: r, y: i + h }, { x: c, y: u - h }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: m, path: `M${r} ${i} C${r} ${i + h} ${c} ${u - h} ${c} ${u}` };
}
const vd = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, yd = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], wd = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Re.line);
function kd(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, u) => {
      const h = vd(s.curve, c);
      return { x: h.x - s.labelWidth / 2, y: h.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = wd.flatMap((c) => yd.map((u) => a(u, c))).find((c) => !n.some((u) => ta(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => ta(i, c)); ) i.y += Re.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Re.line, pad: Re.pad } };
  });
}
const ta = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, bd = { class: "flowchart-tools" }, $d = ["width", "height", "viewBox", "aria-label"], xd = ["d"], Md = ["x", "y", "width", "height"], _d = ["x", "y"], Sd = ["x", "dy"], Ed = {
  key: 0,
  class: "flowchart-label"
}, Cd = ["x", "y", "width", "height"], Ad = ["x", "y"], Od = ["x", "dy"], Td = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => fd(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = R(null), i = R({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var b;
      const L = (b = r.value) == null ? void 0 : b.getBoundingClientRect();
      if (!(L != null && L.width)) return;
      const w = Math.min(L.width / a.value.width, L.height / a.value.height, 1.5);
      i.value = { zoom: w, x: (L.width - a.value.width * w) / 2, y: (L.height - a.value.height * w) / 2 };
    }
    function h(L, w, b) {
      const { zoom: U, x: H, y: M } = i.value, g = Math.min(o.most, Math.max(o.least, U * L));
      i.value = { zoom: g, x: w - (w - H) * g / U, y: b - (b - M) * g / U };
    }
    function m(L) {
      const w = r.value.getBoundingClientRect();
      h(L, w.width / 2, w.height / 2);
    }
    function k(L) {
      const w = r.value.getBoundingClientRect();
      L.ctrlKey || L.metaKey ? h(L.deltaY < 0 ? o.step : 1 / o.step, L.clientX - w.left, L.clientY - w.top) : i.value = { ...i.value, x: i.value.x - L.deltaX, y: i.value.y - L.deltaY };
    }
    function S(L) {
      var w, b, U;
      L.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), c = { x: L.clientX - i.value.x, y: L.clientY - i.value.y }, (U = (b = r.value).setPointerCapture) == null || U.call(b, L.pointerId);
    }
    function P(L) {
      c && (i.value = { ...i.value, x: L.clientX - c.x, y: L.clientY - c.y });
    }
    return De(u), (L, w) => (l(), G(rd, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (b) => s("close"))
    }, {
      default: V(() => [
        p("div", bd, [
          F(ve, {
            small: "",
            onClick: w[0] || (w[0] = (b) => m(o.step))
          }, {
            default: V(() => [...w[5] || (w[5] = [
              he("Zoom in", -1)
            ])]),
            _: 1
          }),
          F(ve, {
            small: "",
            onClick: w[1] || (w[1] = (b) => m(1 / o.step))
          }, {
            default: V(() => [...w[6] || (w[6] = [
              he("Zoom out", -1)
            ])]),
            _: 1
          }),
          F(ve, {
            small: "",
            onClick: u
          }, {
            default: V(() => [...w[7] || (w[7] = [
              he("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: Me(k, ["prevent"]),
          onPointerdown: S,
          onPointermove: P,
          onPointerup: w[2] || (w[2] = (b) => Rs(c) ? c.value = null : c = null),
          onPointercancel: w[3] || (w[3] = (b) => Rs(c) ? c.value = null : c = null)
        }, [
          (l(), d("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: $e({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            w[8] || (w[8] = p("defs", null, [
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
            (l(!0), d(Z, null, re(a.value.arrows, (b, U) => (l(), d("path", {
              key: `arrow-${U}`,
              class: "flowchart-arrow",
              d: b.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, xd))), 128)),
            (l(!0), d(Z, null, re(a.value.nodes, (b) => (l(), d("g", {
              key: b.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: b.x,
                y: b.y,
                width: b.width,
                height: b.height,
                rx: "8"
              }, null, 8, Md),
              p("text", {
                x: b.x + b.width / 2,
                y: b.y + b.padY + b.line / 2
              }, [
                (l(!0), d(Z, null, re(b.lines, (U, H) => (l(), d("tspan", {
                  key: H,
                  x: b.x + b.width / 2,
                  dy: H ? b.line : 0
                }, y(U), 9, Sd))), 128))
              ], 8, _d)
            ]))), 128)),
            (l(!0), d(Z, null, re(a.value.arrows, (b, U) => (l(), d(Z, {
              key: `label-${U}`
            }, [
              b.label ? (l(), d("g", Ed, [
                p("rect", {
                  x: b.label.x,
                  y: b.label.y,
                  width: b.label.width,
                  height: b.label.height,
                  rx: "4"
                }, null, 8, Cd),
                p("text", {
                  x: b.label.x + b.label.width / 2,
                  y: b.label.y + b.label.pad + b.label.line / 2
                }, [
                  (l(!0), d(Z, null, re(b.label.lines, (H, M) => (l(), d("tspan", {
                    key: M,
                    x: b.label.x + b.label.width / 2,
                    dy: M ? b.label.line : 0
                  }, y(H), 9, Od))), 128))
                ], 8, Ad)
              ])) : I("", !0)
            ], 64))), 128))
          ], 12, $d))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Id = /* @__PURE__ */ Y(Td, [["__scopeId", "data-v-51d24cfe"]]), na = {
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
}, Bd = ["innerHTML"], Rd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => na[t.name] || na.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Bd));
  }
}, Ve = /* @__PURE__ */ Y(Rd, [["__scopeId", "data-v-beb5935c"]]), Ld = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      F(Ve, { name: "fold" })
    ], 2));
  }
}, Bt = /* @__PURE__ */ Y(Ld, [["__scopeId", "data-v-d03899bb"]]), Dd = ["data-tip", "aria-label"], Nd = {
  key: 0,
  class: "mact-word"
}, jd = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      F(Ve, { name: "open" }),
      e.open ? (l(), d("span", Nd, y(e.label), 1)) : I("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Dd));
  }
}, mo = /* @__PURE__ */ Y(jd, [["__scopeId", "data-v-3b292e09"]]), Pd = 120, In = 280, qd = 160, Wd = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function go(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = R(t()), a = R("");
  let o = 0;
  const r = (u, h) => Object.assign(u.style, { width: `${h.width}px`, height: `${h.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const h = e.value, m = ++o;
    if (!h || !h.offsetWidth || Wd()) {
      s.value = u;
      return;
    }
    const k = { width: h.offsetWidth, height: h.offsetHeight };
    if (r(h, k), a.value = "leaving", await n(Pd), m !== o) return;
    s.value = u, a.value = "resizing", await Dt(), i(h);
    const S = { width: h.offsetWidth, height: h.offsetHeight };
    r(h, k), h.offsetWidth, h.style.transition = `width ${In}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${In}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(h, S), await n(In), m === o && (i(h), a.value = "entering", await n(qd), m === o && (a.value = ""));
  }
  return be(t, (u) => c(u)), vt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Fd = { class: "growing-card-top" }, Hd = ["aria-expanded"], Ud = { class: "growing-card-avatar" }, Vd = { class: "growing-card-title" }, zd = { class: "growing-card-more" }, Gd = { class: "growing-card-body" }, Kd = {
  __name: "GrowingCard",
  props: {
    title: { type: String, required: !0 },
    text: { type: String, default: "" },
    icon: { type: String, default: "agents" },
    person: { type: String, default: "" },
    bad: Boolean,
    action: { type: String, default: "" },
    incoming: Boolean,
    commentable: Boolean
  },
  emits: ["act", "comment"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(!1), o = R(null), { folded: r, phase: i } = go(o, () => !a.value), c = O(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = O(() => n.text.split(/\n\s*\n/).filter((h) => h.trim()));
    return (h, m) => (l(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: ee(["growing-card-wrap", z(i), { open: !z(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Fd, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: m[0] || (m[0] = (k) => a.value = !a.value)
        }, [
          p("span", Ud, [
            e.bad ? (l(), G(Ve, {
              key: 0,
              name: "cross"
            })) : c.value ? (l(), d(Z, { key: 1 }, [
              he(y(c.value), 1)
            ], 64)) : (l(), G(ke, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Vd, y(e.title), 1),
          F(Bt, { open: a.value }, null, 8, ["open"])
        ], 8, Hd),
        e.action ? (l(), G(mo, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: m[1] || (m[1] = (k) => s("act"))
        }, null, 8, ["label", "open"])) : I("", !0),
        e.commentable ? (l(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: m[2] || (m[2] = (k) => s("comment"))
        }, [
          F(ke, {
            name: "bubble",
            size: 13
          })
        ])) : I("", !0)
      ]),
      p("div", zd, [
        p("div", Gd, [
          (l(!0), d(Z, null, re(u.value, (k, S) => (l(), d("p", {
            key: S,
            class: "growing-card-text"
          }, y(k), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Yd = /* @__PURE__ */ Y(Kd, [["__scopeId", "data-v-e31436cb"]]), Jd = ["title", "aria-label"], Zd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Xd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Qd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = O(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), d("span", {
      class: ee(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), d("svg", Zd, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", Xd)) : I("", !0)
      ]))
    ], 10, Jd));
  }
}, eh = /* @__PURE__ */ Y(Qd, [["__scopeId", "data-v-6dc92808"]]), th = "img,pre,table";
function nh(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function sh(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function ah(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(th)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = nh(sh(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function oh(e, t) {
  let n = null;
  const s = () => e.value && ah(e.value);
  De(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const rh = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function ih(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const lh = ["data-ref"], ch = ["data-from", "data-ref"], uh = { class: "message-body" }, dh = ["title"], hh = ["innerHTML"], fh = ["title"], ph = ["innerHTML"], mh = {
  class: "message-faces",
  "data-message-faces": ""
}, gh = ["title", "data-face", "onClick"], vh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, yh = ["title", "data-reaction", "onClick"], wh = {
  key: 0,
  class: "message-reaction-count"
}, kh = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, bh = ["href", "title"], $h = ["src", "alt"], xh = ["href"], Mh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, _h = {
  key: 1,
  "data-message-links-rows": ""
}, Sh = { class: "message-foot" }, Eh = { class: "message-time" }, Ch = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, Ah = 140, Oh = 2, Th = 1500, Ih = "An earlier message", Bh = "about", Rh = 3, Lh = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var le;
    const n = e, s = t, a = R(!1), o = R(null), r = O(() => ["user", "comment"].includes(n.message.type)), i = O(() => {
      const [te, J] = (n.message.commented_row || ":").split(":"), Q = ot(te);
      return Q ? { ref: `${Q}:${J}`, label: `${jt(Q).title.toLowerCase()} ${J}` } : null;
    }), c = O(() => n.message.worker_id ?? null), u = R(!1), h = O(() => c.value !== null && ((n.message.text ?? "").length > Ah || (n.message.text ?? "").split(`
`).filter((te) => te.trim()).length > Oh)), m = O(() => r.value && !n.message.read_at && !n.message.local);
    async function k() {
      var te;
      await ((te = navigator.clipboard) == null ? void 0 : te.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Th);
    }
    const S = O(() => rs(n.message.text ?? "", { env: "" })), P = O(() => JSON.parse(n.message.flowchart_edges || "[]")), L = R(!1), w = O(() => rs(n.quote || Ih, { env: "" }));
    function b() {
      const te = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      te ? te.scrollIntoView({ block: "center", behavior: "smooth" }) : Ze(`messages:${n.message.parent_id}`);
    }
    oh(o, () => `${n.message.text} ${n.quote}`);
    const U = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, H = (te) => `/api/files/message/${n.message.id}/${encodeURIComponent(te)}`, M = O(() => JSON.parse(n.message.captions || "{}")), g = O(() => (n.message.files ?? []).map((te) => ({ name: te, address: H(te), isImage: U.test(te), title: M.value[te] || te }))), D = O(() => Ha(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), _ = Ce(Ne, null), N = R([]), $ = R(!1), E = O(() => `Linked: ${N.value.join(", ")}`), v = O(() => N.value.length >= Rh), f = O(() => `${N.value.length} linked ${N.value.every((te) => te.startsWith("task ")) ? "tasks" : "rows"}`);
    async function C() {
      if (!r.value || !(_ != null && _.read) || n.message.local) return;
      const te = await _.read(`link list --source message:${n.message.id}`);
      te.ok && (N.value = (te.value.rows ?? te.value ?? []).filter((J) => J.link_type === Bh).map((J) => `${J.target_model} ${J.target_id}`));
    }
    C(), (le = _ == null ? void 0 : _.follow) == null || le.call(_, ["link.*"], C);
    const A = R(!1), q = O(() => ih(n.message.reactions));
    function ie(te) {
      A.value = !1, s("react", n.message, te);
    }
    return (te, J) => e.message.peer || e.message.recipient ? (l(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      F(Yd, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: J[0] || (J[0] = (Q) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, lh)) : (l(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", uh, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: ee(["message-card", "md", { comment: i.value }]),
          onClick: J[6] || (J[6] = (...Q) => z(pt) && z(pt)(...Q))
        }, [
          i.value ? (l(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: J[1] || (J[1] = Me((Q) => z(Ze)(i.value.ref), ["stop"]))
          }, [
            F(ke, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + y(i.value.label), 1)
          ], 8, dh)) : I("", !0),
          e.message.parent_id ? (l(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Me(b, ["stop"]),
            innerHTML: w.value
          }, null, 8, hh)) : I("", !0),
          c.value !== null ? (l(), d("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${c.value}`,
            onClick: J[2] || (J[2] = Me((Q) => z(Ze)(`agents:${c.value}`), ["stop"]))
          }, "Worker " + y(c.value), 9, fh)) : I("", !0),
          p("div", {
            class: ee({ "message-folded": h.value && !u.value }),
            "data-message-text": "",
            innerHTML: S.value
          }, null, 10, ph),
          h.value ? (l(), d("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: J[3] || (J[3] = Me((Q) => u.value = !u.value, ["stop"]))
          }, y(u.value ? "Show less" : "Show more"), 1)) : I("", !0),
          P.value.length ? (l(), d(Z, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[4] || (J[4] = (Q) => L.value = !0)
            }, "Open the flowchart"),
            L.value ? (l(), G(Id, {
              key: 0,
              title: e.message.text,
              edges: P.value,
              onClose: J[5] || (J[5] = (Q) => L.value = !1)
            }, null, 8, ["title", "edges"])) : I("", !0)
          ], 64)) : I("", !0)
        ], 2),
        p("div", {
          class: ee(["message-tools", { picking: A.value }]),
          "data-message-tools": ""
        }, [
          A.value ? (l(), d(Z, { key: 0 }, [
            p("div", mh, [
              (l(!0), d(Z, null, re(z(rh), (Q) => (l(), d("button", {
                key: Q,
                type: "button",
                class: "message-face",
                title: `React ${Q}`,
                "data-face": Q,
                onClick: (Se) => ie(Q)
              }, y(Q), 9, gh))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[7] || (J[7] = (Q) => A.value = !1)
            }, [
              F(ke, {
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
              onClick: J[8] || (J[8] = (Q) => A.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: J[9] || (J[9] = (Q) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: k
            }, y(a.value ? "Copied" : "Copy"), 1),
            m.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: J[10] || (J[10] = (Q) => s("delete", e.message))
            }, "Delete")) : I("", !0)
          ], 64))
        ], 2)
      ]),
      q.value.length ? (l(), d("div", vh, [
        (l(!0), d(Z, null, re(q.value, (Q) => (l(), d("button", {
          key: Q.emoji,
          type: "button",
          class: ee(["message-reaction", { mine: Q.mine }]),
          title: Q.title,
          "data-reaction": Q.emoji,
          onClick: (Se) => s("react", e.message, Q.emoji)
        }, [
          he(y(Q.emoji) + " ", 1),
          Q.count > 1 ? (l(), d("span", wh, y(Q.count), 1)) : I("", !0)
        ], 10, yh))), 128))
      ])) : I("", !0),
      g.value.length ? (l(), d("div", kh, [
        (l(!0), d(Z, null, re(g.value, (Q) => (l(), d(Z, {
          key: Q.name
        }, [
          Q.isImage ? (l(), d("a", {
            key: 0,
            href: Q.address,
            target: "_blank",
            class: "message-image",
            title: Q.title
          }, [
            p("img", {
              src: Q.address,
              alt: Q.name
            }, null, 8, $h)
          ], 8, bh)) : (l(), d("a", {
            key: 1,
            href: Q.address,
            target: "_blank",
            class: "message-file"
          }, y(Q.name), 9, xh))
        ], 64))), 128))
      ])) : I("", !0),
      N.value.length ? (l(), d("div", Mh, [
        F(Ve, {
          class: "message-links-icon",
          name: "linked"
        }),
        v.value && !$.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: J[11] || (J[11] = (Q) => $.value = !0)
        }, y(f.value), 1)) : (l(), d("span", _h, [
          F(at, {
            text: E.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : I("", !0),
      p("div", Sh, [
        p("time", Eh, y(D.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", Ch, "message " + y(e.message.id), 1)) : I("", !0),
        r.value ? (l(), G(eh, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : I("", !0)
      ])
    ], 8, ch));
  }
}, hy = /* @__PURE__ */ Y(Lh, [["__scopeId", "data-v-7e7b0f0d"]]), un = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Bn = 200, vo = (e) => {
  var t;
  return ((t = un.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? un[0].key;
}, fy = (e) => {
  var t;
  return ((t = un.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Dh = ["aria-label"], Nh = 300, sa = 400, jh = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Bn } },
  setup(e) {
    const t = e, n = O(() => vo(t.value)), s = O(() => n.value < Bn ? [1, 0.25, 0.25] : n.value === Bn ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: ee(["ico", "prio", { hot: n.value >= sa, high: n.value >= Nh && n.value < sa }]),
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
        style: $e({ opacity: s.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: $e({ opacity: s.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: $e({ opacity: s.value[2] })
      }, null, 4)
    ], 10, Dh));
  }
}, py = /* @__PURE__ */ Y(jh, [["__scopeId", "data-v-b10e610f"]]), Ph = {
  working: { word: "Working", dot: "running" },
  waiting: { word: "Waiting", dot: "you" },
  stuck: { word: "Stuck", dot: "failed" },
  stopped: { word: "Stopped", dot: "" },
  idle: { word: "Idle", dot: "queued" }
}, qh = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "stuck", silent: "stuck", stopped: "stopped" }, Wh = (e) => {
  const t = qh[e.state] || "idle";
  return { key: t, ...Ph[t] };
}, Fh = [
  { key: "working", label: "Working", icon: "agents", hidden: (e) => `${e} working` },
  { key: "waiting", label: "Blocked", icon: "warn", hidden: (e) => `${e} blocked` },
  { key: "idle", label: "Idle", icon: "pause", hidden: (e) => `${e} idle` },
  { key: "stopped", label: "Not running", icon: "x", hidden: (e) => `${e} not running` }
], Hh = [
  { key: "environment", label: "Environment agents", icon: "branch", hidden: (e) => `${e} ${e === 1 ? "environment agent" : "environment agents"}` },
  { key: "worker", label: "Workers", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "worker" : "workers"}` },
  { key: "subagent", label: "Subagents", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "helper" : "helpers"}` }
], Uh = { working: "working", waiting: "waiting", stuck: "waiting", idle: "idle", stopped: "stopped" }, dn = (e) => Uh[Wh(e.card).key] || "idle";
function Vh(e, t) {
  return t.states[dn(e)] === !1 ? dn(e) : t.kinds[e.kind] === !1 ? e.kind : "";
}
const zh = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), aa = { working: 0, waiting: 1, idle: 2, stopped: 3 }, oa = (e, t) => aa[dn(e)] - aa[dn(t)], ra = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, my = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => oa(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || zh(s, a)) : [...e].sort((s, a) => oa(s, a) || (ra[t] || ra.state)(s, a)), Gh = Object.fromEntries([...Fh, ...Hh].map((e) => [e.key, e.hidden]));
function gy(e, t) {
  const n = {};
  return e.forEach((s) => {
    const a = Vh(s, t);
    a && (n[a] = (n[a] || 0) + 1);
  }), Object.entries(n).map(([s, a]) => Gh[s](a));
}
const Kh = ["aria-checked", "aria-haspopup", "onClick"], Yh = {
  key: 0,
  class: "segmented-dot"
}, Jh = {
  key: 1,
  class: "segmented-count"
}, Zh = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = _a();
    return (a, o) => {
      const r = ar("tip");
      return l(), d("span", {
        class: ee(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), d(Z, null, re(e.options, (i) => it((l(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: ee(["segmented-option", { on: i.key === e.value }]),
          onClick: (c) => n("pick", i.key)
        }, [
          i.dot ? (l(), d("span", Yh)) : I("", !0),
          he(" " + y(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", Jh, y(i.count), 1)) : I("", !0)
        ], 10, Kh)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Xh = /* @__PURE__ */ Y(Zh, [["__scopeId", "data-v-ca953072"]]), ia = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Qh = {
  key: 1,
  class: "text-field-label"
}, ef = {
  key: 2,
  class: "text-field-end"
}, tf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Jn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var h;
    const n = Yn(e, "modelValue"), s = Ea(), a = "onUpdate:modelValue" in (((h = or()) == null ? void 0 : h.vnode.props) || {}), o = O(() => a ? n.value : s.value), r = (m) => a && (n.value = m.target.value), i = O(
      () => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), c = O(() => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "value"))), u = R(null);
    return t({ focus: () => u.value && u.value.focus() }), (m, k) => e.label || e.icon || m.$slots.end ? (l(), d("label", {
      key: 0,
      class: ee(["text-field", { large: e.large, ended: m.$slots.end }, z(s).class]),
      style: $e(z(s).style)
    }, [
      e.icon ? (l(), G(ke, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : I("", !0),
      e.label ? (l(), d("span", Qh, y(e.label), 1)) : I("", !0),
      it(p("input", rt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(ia), o.value]
      ]),
      m.$slots.end ? (l(), d("span", ef, [
        we(m.$slots, "end", {}, void 0, !0)
      ])) : I("", !0)
    ], 6)) : it((l(), d("input", rt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
      [z(ia), o.value]
    ]);
  }
}), vy = /* @__PURE__ */ Y(tf, [["__scopeId", "data-v-d9c38ca8"]]), la = (e) => e.page * e.size < e.total;
function nf(e, t, { incremental: n = !1 } = {}) {
  const s = yn(), a = R([]), o = R(""), r = R(!1), i = R(!1), c = R(""), u = R(null);
  async function h(w) {
    const b = await s.read(`${e} --before-id ${w + 1} --limit 1`);
    if (!b.ok) return P();
    const U = b.value.rows.find((H) => H.id === w);
    a.value = U ? a.value.map((H) => H.id === w ? U : H) : a.value.filter((H) => H.id !== w);
  }
  async function m(w) {
    if (n && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== w.row_id));
    if (n && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && a.value.some((g) => g.id === w.row_id)) return h(w.row_id);
    if (!(n && a.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return P();
    const U = Math.max(...a.value.map((g) => g.id)), H = await s.read(`${e} --after-id ${U}`);
    if (!H.ok) return P();
    const M = new Set(a.value.map((g) => g.id));
    a.value = [...H.value.rows.filter((g) => !M.has(g.id)), ...a.value];
  }
  async function k() {
    if (!a.value.length) return !1;
    const w = Math.min(...a.value.map((H) => H.id)), b = await s.read(`${e} --before-id ${w}`);
    if (!b.ok || !b.value.rows.length) return i.value = !1;
    i.value = la(b.value);
    const U = new Set(a.value.map((H) => H.id));
    return a.value = [...a.value, ...b.value.rows.filter((H) => !U.has(H.id))], !0;
  }
  let S = 0;
  async function P() {
    const w = ++S, b = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (w !== S) return;
    const U = b.ok ? s.shared ? [b.value] : b.value.rows : [], H = U.length ? Math.min(...U.map((M) => M.id)) : 0;
    a.value = n && b.ok && H ? [...a.value.filter((M) => M.id > Math.max(...U.map((g) => g.id))), ...U, ...a.value.filter((M) => M.id < H)] : U, b.ok && !a.value.some((M) => M.id < H) && (i.value = !s.shared && la(b.value)), o.value = b.ok ? "" : b.error, r.value = !0;
  }
  async function L(w) {
    const b = await s.run(w);
    return c.value = b.ok ? "" : b.error, u.value = b.ok ? b.value : null, await P(), b;
  }
  return s.follow(t, m), P(), { rows: a, failure: o, loaded: r, more: i, load: P, older: k, act: L, actionFailure: c, answer: u, context: s };
}
const sf = { class: "title" }, af = { class: "state" }, of = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = nf(t.line, t.events);
    return (o, r) => (l(), G(si, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: V(({ row: i }) => [
        p("span", sf, y(i.title), 1),
        p("span", af, y(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, yy = /* @__PURE__ */ Y(of, [["__scopeId", "data-v-a69084cd"]]);
function rf(e = 1e3, t = null) {
  const n = R(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? be(t, a, { immediate: !0 }) : a(!0), Ae(() => clearInterval(s)), n;
}
const Rn = R(Date.now() / 1e3);
let ca = 0, Kt = 0;
function lf() {
  return Kt || (Rn.value = Date.now() / 1e3, ca = setInterval(() => Rn.value = Date.now() / 1e3, 1e3)), Kt += 1, Ca() && Aa(() => {
    Kt -= 1, Kt || clearInterval(ca);
  }), Rn;
}
const cf = ["title", "data-figure-mark", "data-folded", "data-open"], uf = {
  key: 2,
  class: "worker"
}, df = { class: "head" }, hf = { key: 0 }, ff = {
  key: 3,
  class: "status"
}, pf = {
  key: 0,
  class: "figure"
}, mf = {
  key: 1,
  class: "ran-for"
}, gf = { key: 2 }, vf = {
  key: 3,
  class: "news"
}, yf = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, wf = {
  key: 6,
  class: "settled"
}, kf = {
  key: 1,
  class: "bar"
}, bf = {
  key: 3,
  class: "detail body"
}, $f = {
  key: 0,
  class: "body-label"
}, xf = ["title"], Mf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Ea(), s = ["onClick", "onAct"], a = O(() => Object.fromEntries(Object.entries(n).filter(([J]) => !s.includes(J)))), o = R(!1), r = O(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = O(() => t.open !== void 0), c = O(() => i.value || r.value), u = O(() => i.value ? t.open : o.value), h = O(() => i.value ? !t.open : r.value && !o.value), m = O(() => !!(t.mark.action && n.onAct)), k = O(() => c.value || m.value || !!n.onClick), S = R(null), P = R(null), { folded: L, phase: w } = go(S, () => h.value);
    function b(J) {
      var Q, Se;
      if (!(J.target !== S.value && !P.value.contains(J.target))) {
        if (i.value) return (Q = n.onClick) == null ? void 0 : Q.call(n, J);
        if (r.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(J);
      }
    }
    const U = (J) => n.onAct(J), H = ["failed", "unfinished"], M = O(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), g = O(() => t.mark.color ? t.mark.color : M.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : M.value ? `var(--tone-${M.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), D = O(() => g.value || "var(--tone-work)"), _ = O(() => !t.mark.ending && !t.mark.ended && M.value !== "stopped"), N = lf(), $ = O(
      () => t.mark.began_at && _.value && !t.mark.figure && !t.mark.counting ? hl(N.value - t.mark.began_at) : ""
    ), E = O(() => {
      const { started: J, ended: Q } = t.mark;
      return J ? Q ? `ran ${Us(Q - J, !0)}` : Us(N.value - J, !0) : $.value;
    }), v = ["bad", "danger", "warn"], f = O(() => v.includes(M.value) || t.mark.asks ? "attention" : _.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), C = ["bad", "danger"], A = O(() => C.includes(M.value)), q = O(() => f.value === "process" ? "running" : A.value ? "cross" : M.value === "stopped" ? "stopped" : M.value === "good" ? "tick" : ""), ie = O(
      () => !!(t.mark.figure || E.value || t.mark.docked || t.mark.stopping || q.value || t.mark.settled || t.mark.news)
    ), le = O(() => [t.mark.title, t.mark.time ? Ha(t.mark.time) : ""].filter(Boolean).join(" · ")), te = O(() => ({
      ...g.value ? { "--mark": g.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (J, Q) => (l(), d("div", rt(a.value, {
      ref_key: "root",
      ref: S,
      class: [
        "mark",
        `w-${f.value}`,
        z(w),
        {
          open: u.value,
          live: k.value,
          failed: A.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: g.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: te.value,
      title: le.value,
      "data-figure-mark": e.mark.key,
      "data-folded": z(L) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: b
    }), [
      (l(), G(lt(k.value ? "button" : "span"), {
        ref_key: "top",
        ref: P,
        class: "top",
        type: k.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!u.value) : void 0
      }, {
        default: V(() => [
          e.mark.markIcon ? (l(), G(Ve, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), G(ke, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), d("span", uf, y(e.mark.worker), 1)) : I("", !0),
          p("span", df, [
            F(at, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", hf, y(e.mark.name), 1)) : I("", !0),
            c.value ? (l(), G(Bt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : I("", !0)
          ]),
          ie.value ? (l(), d("span", ff, [
            e.mark.figure ? (l(), d("span", pf, y(e.mark.figure), 1)) : I("", !0),
            E.value ? (l(), d("span", mf, y(E.value), 1)) : I("", !0),
            e.mark.stopping ? (l(), d("span", gf, "Stopping")) : I("", !0),
            e.mark.news ? (l(), d("span", vf, y(e.mark.news), 1)) : I("", !0),
            q.value === "running" ? (l(), d("span", yf)) : q.value ? (l(), G(Ve, {
              key: 5,
              class: ee(["sign", q.value]),
              name: q.value
            }, null, 8, ["class", "name"])) : I("", !0),
            e.mark.settled ? (l(), d("span", wf, y(e.mark.settled), 1)) : I("", !0)
          ])) : I("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (l(), G(mo, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: Me(U, ["stop"])
      }, null, 8, ["label", "open"])) : I("", !0),
      (e.mark.figure || e.mark.counting) && _.value ? (l(), d("span", kf, [
        p("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: D.value })
        }, null, 4)
      ])) : I("", !0),
      e.mark.detail && !z(L) ? (l(), G(at, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : I("", !0),
      e.mark.body && !z(L) ? (l(), d("div", bf, [
        e.mark.bodyLabel ? (l(), d("p", $f, y(e.mark.bodyLabel), 1)) : I("", !0),
        F(at, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : I("", !0),
      e.mark.command && !z(L) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, y(e.mark.command), 9, xf)) : I("", !0),
      e.mark.card ? (l(), G(at, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : I("", !0),
      we(J.$slots, "default", {
        shown: !z(L)
      }, void 0, !0)
    ], 16, cf));
  }
}), yo = /* @__PURE__ */ Y(Mf, [["__scopeId", "data-v-f1006e54"]]), _f = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function wo(e) {
  var n;
  const t = _f[e] || ((n = jt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Sf = (e) => wo(String(e).split(":")[0]), ko = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ef = { passed: "good", failed: "danger", warned: "warn", running: "" }, Cf = { good: "good", warn: "warn", danger: "danger" }, ua = {
  "open row": (e) => Ze(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Yr(e.target_model, e.target_id || 0)
}, Af = { "open row": (e) => Sf(e.target_model), "open page": () => wo("pages") };
function Of(e, t) {
  const n = t || {}, s = ua[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Ef[e.outcome] || "" : Cf[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Af[s](e) : "",
    handlers: s ? { onAct: () => ua[s](e) } : {}
  };
}
const Tf = 24, If = 1e3, da = 2e3, Bf = 0.25, Rf = 5e3;
function Lf(e, t = Tf, n = () => !0) {
  const s = R(!1), a = R(0), o = R(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, h = () => {
    const M = u();
    return M ? M.scrollHeight - M.scrollTop - M.clientHeight : 0;
  }, m = () => !u() || h() <= t;
  function k(M) {
    if (clearTimeout(r), !M) {
      o.value = !1, c = Date.now();
      return;
    }
    const g = Date.now() - c < da ? da : If;
    r = setTimeout(() => o.value = s.value, g);
  }
  function S() {
    clearTimeout(i), s.value = !1, a.value = 0, k(!1);
  }
  function P(M = !1) {
    const g = u();
    g && M && g.scrollTo ? g.scrollTo({ top: g.scrollHeight, behavior: "smooth" }) : g && (g.scrollTop = g.scrollHeight), S();
  }
  function L() {
    b(), !s.value && (s.value = !0, k(!0));
  }
  const w = () => !!u() && h() <= u().clientHeight * Bf;
  function b() {
    clearTimeout(i), w() && (i = setTimeout(() => s.value && w() && n() && P(!0), Rf));
  }
  function U() {
    m() ? S() : L();
  }
  function H(M = 1, g = !1) {
    s.value ? a.value += Math.max(0, M) : P(g);
  }
  return Ca() && Aa(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: h, atBottom: m, follow: S, toBottom: P, left: L, scrolled: U, arrived: H };
}
const Df = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Nf = (e) => String(e ?? "").replace(Df, ""), jf = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(null), { away: o, scrolled: r, arrived: i, toBottom: c } = Lf(a);
    be(
      () => n.lines.length,
      () => Dt(() => i()),
      { immediate: !0 }
    );
    function u(h) {
      r(), s("older", h.target);
    }
    return (h, m) => (l(), d("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      he(y(z(Nf)(e.lines.join(`
`)) || e.empty), 1),
      z(o) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (k) => z(c)(!0))
      }, "Follow")) : I("", !0)
    ], 544));
  }
}, Pf = /* @__PURE__ */ Y(jf, [["__scopeId", "data-v-d9fa8127"]]), qf = 1e4;
class Wf {
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
    return this.heardAt !== null && t - this.heardAt > qf;
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
const Ff = {
  key: 0,
  class: "frame-note"
}, Hf = {
  key: 0,
  class: "frame-note"
}, Uf = ["src", "title"], Vf = 1e3, zf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = yn(), s = R(null), a = R(!1), o = R(!1);
    let r = null, i = 0;
    return De(() => {
      r = new Wf(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Vf);
    }), Ae(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", Ff, "This window was closed because it stopped answering.")) : (l(), d(Z, { key: 1 }, [
      a.value ? (l(), d("div", Hf, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        F(ve, {
          onClick: u[0] || (u[0] = (h) => o.value = !0)
        }, {
          default: V(() => [...u[1] || (u[1] = [
            he("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : I("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: z(n).window
      }, null, 8, Uf)
    ], 64));
  }
}, Gf = /* @__PURE__ */ Y(zf, [["__scopeId", "data-v-32a49046"]]), Kf = 0, Yf = "/api/lines", Jf = "/api/line";
class Zf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Kf));
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
        const n = await je.raw(Yf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(Jf, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Xf = new Zf();
class Qf {
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
      n.patterns.some((s) => bo(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function bo(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const e1 = Symbol("pane-page"), t1 = { 1: "refused", 2: "usage", 3: "fault" }, n1 = 100, s1 = /"([^"]*)"|'([^']*)'|(\S+)/g;
function a1({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = R({}), declared: u = [], page: h = null, setOption: m = () => {
}, autoScroll: k = "", tabs: S = [], readOnly: P = !1, shared: L = null }) {
  const w = /* @__PURE__ */ new Map(), b = new AbortController(), U = (H) => {
    const M = w.get(H);
    if (M && performance.now() - M.at < n1) return M.answer;
    const g = Ct(e, H, t, b.signal);
    return w.set(H, { answer: g, at: performance.now() }), g;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: h,
    visible: O(() => s()),
    permissions: a,
    autoScroll: k,
    tabs: S,
    readOnly: P,
    shared: L,
    read: U,
    run: (H) => Ct(e, H, t, b.signal),
    upload: (H) => r1(H, b.signal),
    cancel: () => b.abort(),
    follow: (H, M) => r.follow(e, H.filter((g) => o.some((D) => bo(D, g))), M, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (H) => O(() => {
      var M;
      return c.value[H] ?? ((M = u.find((g) => g.key === H)) == null ? void 0 : M.default);
    }),
    setting: async (H, M) => {
      const g = await U(`window setting ${e} ${H}`);
      return g.ok ? g.value.value : M;
    },
    setOption: m,
    keep: (H, M) => Ct(e, ["window", "save-setting", e, H, JSON.stringify(M)], t, b.signal)
  };
}
function o1(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const hn = { ok: !1, failure: "cancelled", error: "" };
async function Ct(e, t, n, s = void 0) {
  try {
    const a = await Xf.add({ window: e, line: Array.isArray(t) ? t : i1(t), environment: n }, s);
    return s != null && s.aborted ? hn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: t1[a.code] || "fault", error: o1(a.error) };
  } catch (a) {
    return s != null && s.aborted ? hn : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function r1(e, t = void 0) {
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? hn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? hn : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function i1(e) {
  return [...e.matchAll(s1)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function l1({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const c1 = {
  class: "allowance-prompt",
  role: "dialog"
}, u1 = { class: "allowance-prompt-text" }, d1 = { class: "allowance-prompt-buttons" }, h1 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", c1, [
      p("p", u1, y(z(l1)(e.request)), 1),
      p("div", d1, [
        F(ve, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            he("Allow", -1)
          ])]),
          _: 1
        }),
        F(ve, {
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
}, f1 = /* @__PURE__ */ Y(h1, [["__scopeId", "data-v-102dc765"]]), Ln = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), G(sn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: V(() => [
        he(y(e.reason) + " ", 1),
        e.retry ? (l(), G(ve, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            he("Retry", -1)
          ])]),
          _: 1
        })) : I("", !0),
        e.removable ? (l(), G(ve, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            he("Remove tab", -1)
          ])]),
          _: 1
        })) : I("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, p1 = ["data-window", "data-agent"], m1 = {
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
    tabs: { type: Array, default: () => [] },
    readOnly: Boolean,
    shared: { type: Object, default: null }
  },
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(""), o = R(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Ce(Br, null), c = a1({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: O(() => n.options),
      declared: n.declared,
      page: Ce(e1, null),
      setOption: (m, k) => s("option", m, k),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (m, k) => {
        s("open", m, k), i == null || i(m, k);
      }
    });
    rr(Ne, c), be(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ae(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), ir((m) => (a.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const u = () => vs(n.component), h = () => {
      var m, k;
      return ((k = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : k.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, k) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      h() ? (l(), G(f1, {
        key: 0,
        request: h(),
        onAnswer: k[0] || (k[0] = (S) => e.prompts.answer(S))
      }, null, 8, ["request"])) : I("", !0),
      e.unavailableReason ? (l(), G(Ln, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), G(Ln, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (l(), G(u, { key: o.value })) : (l(), G(Ln, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: k[1] || (k[1] = (S) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, p1));
  }
}, $o = /* @__PURE__ */ Y(m1, [["__scopeId", "data-v-04dd3be3"]]), g1 = {
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
    const n = e, s = t, a = { render: () => vs(Gf, { src: n.entry.entry_url }) };
    return (o, r) => (l(), G($o, {
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
      "auto-scroll": e.entry.auto_scroll,
      tabs: e.entry.tabs,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: r[0] || (r[0] = (i, c) => s("option", i, c))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "events", "unavailable-reason"]));
  }
}, ls = "journal.stale-build-reload", v1 = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function y1(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ls) === e.message) return !1;
    t.setItem(ls, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function w1(e = window.sessionStorage) {
  try {
    e.removeItem(ls);
  } catch {
    return;
  }
}
const k1 = ["data-window"], b1 = {
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
    const n = e, s = t, a = vn(null), o = R("");
    return be(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, w1();
          } catch (i) {
            if (v1(i) && y1(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (l(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      F(yt, { shape: "cards" })
    ], 8, k1)) : (l(), G($o, {
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
      "auto-scroll": e.entry.auto_scroll,
      tabs: e.entry.tabs,
      events: e.entry.events,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: i[0] || (i[0] = (c, u) => s("option", c, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "events", "unavailable-reason"]));
  }
}, $1 = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new Qf(), s = ((i = Ce(Ne, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = O(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = O(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), G(b1, {
      key: 0,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), G(g1, {
      key: 1,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, x1 = { class: "mark-more-inner" }, M1 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, _1 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, S1 = {
  key: 3,
  class: "mark-lines"
}, E1 = "process", ha = "task", C1 = 2e3, A1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ce(Ne), s = O(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = O(() => ko.has(t.mark.variant) && t.mark.detail || ""), o = O(() => t.mark.target_model === ha ? t.mark.target_id : 0), r = R([]), i = R(!1), c = R(""), u = O(() => t.mark.target_model === E1 && !!t.mark.target_id);
    async function h() {
      const S = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = S.ok ? "" : S.error, S.ok && (r.value = S.value.lines);
    }
    let m = null;
    const k = () => clearInterval(m);
    return be(() => t.shown && u.value, (S) => {
      k(), S && (h(), t.mark.ended_at || (m = setInterval(h, C1)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (S) => S && t.shown && u.value && (k(), h())), Ae(k), (S, P) => (l(), d("div", {
      class: ee(["mark-more", { open: e.shown }]),
      onClick: P[1] || (P[1] = Me(() => {
      }, ["stop"]))
    }, [
      p("div", x1, [
        e.declaration.body_url ? (l(), G($1, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(Z, { key: 1 }, [
          a.value ? (l(), d(Z, { key: 0 }, [
            P[2] || (P[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", M1, y(a.value), 1)
          ], 64)) : I("", !0),
          u.value && c.value ? (l(), d("p", _1, y(c.value), 1)) : u.value && i.value ? (l(), d(Z, { key: 2 }, [
            P[3] || (P[3] = p("p", { class: "mark-label" }, "Output", -1)),
            F(Pf, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", S1, y(s.value.join(`
`)), 1)) : I("", !0),
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: P[0] || (P[0] = Me((L) => z(Ze)(`${ha}:${o.value}`), ["stop"]))
          }, "Open task " + y(o.value) + " and its proofs", 1)) : I("", !0)
        ], 64))
      ])
    ], 2));
  }
}, cs = /* @__PURE__ */ Y(A1, [["__scopeId", "data-v-51f69bf1"]]), O1 = (e) => `show-${e}`, wy = (e, t, n) => e.filter((s) => {
  var a;
  return n(O1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), T1 = "messages.chat", I1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), xo = (e, t, n) => Ct(T1, I1(e, t), n), B1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, R1 = ["title", "aria-label", "onClick"], L1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, D1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = O(() => B1(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = R(""), a = Ce(Ne);
    async function o(r) {
      const i = await xo(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (l(), d(Z, null, [
      (l(!0), d(Z, null, re(n.value, (c) => (l(), d("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: Me((u) => o(c), ["stop"])
      }, [
        F(Ve, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, R1))), 128)),
      s.value ? (l(), d("span", L1, y(s.value), 1)) : I("", !0)
    ], 64));
  }
}, N1 = /* @__PURE__ */ Y(D1, [["__scopeId", "data-v-0dfda102"]]);
function Mo(e, t) {
  const n = vn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const _o = Mo("/api/marks", "marks"), ky = _o.fetchAll, j1 = _o.find, P1 = 2e3;
function So(e, t, n = P1) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  De(async () => {
    await e(), a();
  }), vt(() => clearTimeout(s));
}
const q1 = ["data-ref"], W1 = ["data-ref"], F1 = { class: "mark-row" }, H1 = "dock add", U1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = O(() => j1(s.mark.type)), o = Ce(Ne, null), r = O(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = R(null);
    So(async () => {
      if (!r.value) return;
      const k = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      k.ok && k.value.rows.length && (i.value = k.value.rows[0].progress);
    }, () => r.value);
    const c = O(() => {
      const k = Of(s.mark, a.value), S = !k.figure || k.figure.endsWith("%");
      return i.value && r.value && S ? { ...k, figure: `${i.value}%`, fraction: i.value / 100 } : k;
    }), u = O(() => {
      var k;
      return !!(s.mark.lines || s.mark.detail && ko.has(s.mark.variant) || t.has(s.mark.target_model) || (k = a.value) != null && k.body_url);
    }), h = R(!1), m = O(() => {
      var k, S, P;
      return s.docked ? (S = (k = a.value) == null ? void 0 : k.buttons) == null ? void 0 : S.filter((L) => {
        var w;
        return !((w = L.runs) != null && w.startsWith(H1));
      }) : (P = a.value) == null ? void 0 : P.buttons;
    });
    return (k, S) => {
      var P, L;
      return (P = a.value) != null && P.card ? (l(), d("div", {
        key: 0,
        class: ee(["thread-turn", "card", "whole-card", { "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        F(cs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, q1)) : (l(), d("div", {
        key: 1,
        class: ee(["thread-turn", "card", { "full-width": (L = a.value) == null ? void 0 : L.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", F1, [
          F(yo, rt({
            mark: c.value,
            open: u.value ? h.value : void 0
          }, lr(c.value.handlers), {
            onClick: S[0] || (S[0] = (w) => h.value = !h.value)
          }), cr({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: V(({ shown: w }) => [
                F(cs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: w
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(N1, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, W1));
    };
  }
}, V1 = /* @__PURE__ */ Y(U1, [["__scopeId", "data-v-b3334caa"]]), z1 = ["data-ref"], G1 = ["inert"], K1 = { class: "thread-group" }, Y1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = R(!1), s = R(!1);
    be(n, () => s.value = !0);
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
      F(yo, {
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
        p("div", K1, [
          (l(!0), d(Z, null, re(e.group.marks, (i) => (l(), G(V1, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, G1)) : I("", !0)
    ], 8, z1));
  }
}, by = /* @__PURE__ */ Y(Y1, [["__scopeId", "data-v-8a285510"]]);
function J1(e) {
  const t = R(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return De(() => n.observe(e.value)), vt(() => n.disconnect()), t;
}
const Z1 = { class: "chat-dock-fold" }, X1 = ["aria-label"], Q1 = { class: "chat-dock-head" }, ep = { class: "chat-dock-inner" }, Eo = 700, tp = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = R(null), s = R(null), a = J1(s), o = R(!1);
    let r = 0;
    return De(() => r = setTimeout(() => o.value = !0, Eo)), vt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: ee(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", Z1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: ee(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          we(i.$slots, "edge"),
          p("header", Q1, [
            we(i.$slots, "head")
          ]),
          p("div", {
            class: ee(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", ep, [
              p("div", {
                class: ee(["chat-dock-grow", { settled: o.value }]),
                style: $e(z(a) === null ? null : { height: `${z(a)}px` })
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
        ], 10, X1)
      ])
    ], 2));
  }
}, Co = /* @__PURE__ */ Y(tp, [["__scopeId", "data-v-63e4dcfc"]]), np = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Dn = 5, sp = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Dn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Dn}s`, animationDelay: `${(n - Dn).toFixed(2)}s` };
    return (a, o) => (l(), d("span", np, [
      p("i", { style: s })
    ]));
  }
}, ap = /* @__PURE__ */ Y(sp, [["__scopeId", "data-v-d0c4b012"]]), Ao = Mo("/api/docks", "docks"), $y = Ao.fetchAll, us = Ao.find, op = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ds = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), rp = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), ip = (e) => e.kept ? ds("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : ds("keep", "pin", "Pin", `dock keep ${e.id}`), lp = ["pin", "stop"], cp = (e) => ({ ...e, iconOnly: lp.includes(e.icon) });
function up(e, t) {
  var n;
  return [
    ...rp(e, t) ? [ip(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || jt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ds("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(cp);
}
const dp = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: op(e, t),
  buttons: up(e, t)
}), hp = { class: "dock-title" }, fp = ["aria-expanded", "title"], pp = { class: "chat-dock-acts dock-acts" }, mp = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, gp = {
  key: 1,
  class: "dock-text"
}, vp = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = O(() => us(s.item.type)), o = R(null), r = O(() => dp(s.item, a.value)), i = Ce(Ne), c = R(/* @__PURE__ */ new Set()), u = R("");
    async function h(S) {
      if (S.action === "open") return Ze(`${s.item.target_model}:${s.item.target_id}`);
      S.action === "declared" && (c.value = /* @__PURE__ */ new Set([...c.value, S.label])), u.value = "";
      const L = await xo(S, s.item, i.environment);
      (L == null ? void 0 : L.ok) === !1 && (c.value = new Set([...c.value].filter((w) => w !== S.label)), u.value = L.error);
    }
    const m = O(() => r.value.buttons.filter((S) => S.action !== "undock" && !c.value.has(S.label))), k = O(() => r.value.buttons.find((S) => S.action === "undock"));
    return (S, P) => (l(), G(Co, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: V(() => [
        e.leaving ? (l(), G(ap, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : I("", !0)
      ]),
      head: V(() => {
        var L, w, b;
        return [
          (L = a.value) != null && L.draws_head ? (l(), d("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(Z, { key: 1 }, [
            F(ke, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", hp, y(r.value.title), 1)
          ], 64)),
          (w = a.value) != null && w.badge ? (l(), d("span", {
            key: 2,
            class: ee(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, y(a.value.badge), 3)) : I("", !0),
          (b = a.value) != null && b.draws_head ? I("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: P[0] || (P[0] = (U) => n("fold"))
          }, [
            F(Bt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, fp)),
          p("span", pp, [
            (l(!0), d(Z, null, re(m.value, (U) => (l(), d(Z, {
              key: U.action + U.runs
            }, [
              U.iconOnly ? (l(), G(ve, {
                key: 0,
                kind: "icon",
                "aria-label": U.label,
                title: U.label,
                "data-dock-action": U.action,
                onClick: (H) => h(U)
              }, {
                default: V(() => [
                  F(ke, {
                    name: U.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (l(), G(ve, {
                key: 1,
                small: "",
                kind: U.primary ? "primary" : "ghost",
                bordered: !U.primary,
                "data-dock-action": U.action,
                onClick: (H) => h(U)
              }, {
                default: V(() => [
                  he(y(U.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          F(ks, {
            title: k.value.label,
            "data-dock-action": "undock",
            onClick: P[1] || (P[1] = (U) => h(k.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var L, w;
        return [
          u.value ? (l(), d("p", mp, y(u.value), 1)) : I("", !0),
          e.item.text && !((L = a.value) != null && L.body_url) ? (l(), d("p", gp, y(e.item.text), 1)) : I("", !0),
          (w = a.value) != null && w.body_url ? (l(), G(cs, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : I("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded"]));
  }
}, fa = /* @__PURE__ */ Y(vp, [["__scopeId", "data-v-53b368f0"]]), yp = ["title", "aria-label"], wp = { class: "run-chip-in" }, kp = {
  key: 0,
  class: "run-chip-ring"
}, bp = { class: "run-chip-name" }, $p = { class: "run-chip-bar" }, xp = "processes.output", Mp = 5e3, _p = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var h;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((h = Ce(Ne, null)) == null ? void 0 : h.environment) ?? "", o = R(null), r = O(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = O(() => {
      var m, k;
      return ((m = o.value) == null ? void 0 : m.title) || ((k = o.value) == null ? void 0 : k.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = O(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const m = await Ct(xp, ["process", "card", String(s.item.target_id)], a);
      m.ok && (o.value = m.value);
    }
    return So(u, () => r.value, Mp), (m, k) => {
      var S;
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: $e({ "--tone": c.value })
      }, [
        p("span", wp, [
          r.value ? (l(), d("span", kp)) : (l(), G(Ve, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", bp, y(i.value), 1)
        ]),
        p("span", $p, [
          p("i", {
            style: $e({ width: r.value ? `${((S = o.value) == null ? void 0 : S.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, yp);
    };
  }
}, Sp = /* @__PURE__ */ Y(_p, [["__scopeId", "data-v-1f36db53"]]), Ep = 24, Cp = 8, xy = 420;
function My({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= Ep && e > t ? !0 : e < t && a > Cp ? !1 : null;
}
const Ap = (e, t) => e === void 0 ? t : e, Op = 6, Tp = 3, pa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, St = (e) => !!(e.leaves_at && !e.kept), Ip = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!St(e) || t < e.leaves_at || n.has(e.id)), Bp = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => Ip(s, t, n)).sort((s, a) => s.id - a.id);
function Rp(e, t, n = Op) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const Lp = (e, t) => e >= Tp ? !0 : e <= 1 ? !1 : t, Dp = {
  key: "runs-head",
  class: "dock-runs-head"
}, Np = { class: "dock-runs-chips" }, jp = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = rf(500), s = R(/* @__PURE__ */ new Set()), a = R(!1), o = R(!1), r = O(() => Bp(t.items, n.value, s.value)), i = O(() => Rp(r.value.filter((b) => pa(b, us)), n.value)), c = O(() => r.value.filter((b) => !i.value.includes(b) && !pa(b, us))), u = O(() => (a.value = Lp(i.value.length, a.value)) && !o.value), h = R({}), m = (b) => Ap(h.value[b.id], t.folded);
    function k(b) {
      h.value = { ...h.value, [b.id]: !m(b) };
    }
    function S(b) {
      h.value = { ...h.value, ...Object.fromEntries(i.value.map((U) => [U.id, U.id !== b.id])) }, o.value = !0;
    }
    function P() {
      h.value = Object.fromEntries(Object.entries(h.value).filter(([b]) => !i.value.some((U) => String(U.id) === b))), o.value = !1;
    }
    function L(b) {
      s.value = /* @__PURE__ */ new Set([...s.value, b.id]);
    }
    function w(b) {
      s.value = new Set([...s.value].filter((U) => U !== b.id));
    }
    return (b, U) => (l(), G(Ma, {
      tag: "div",
      name: "dock",
      duration: z(Eo),
      class: "dock-stack"
    }, {
      default: V(() => [
        (l(!0), d(Z, null, re(c.value, (H) => (l(), G(fa, {
          key: H.id,
          item: H,
          class: ee({ timed: z(St)(H) }),
          leaving: z(St)(H) && !s.value.has(H.id),
          folded: m(H),
          onFold: (M) => k(H),
          onMouseenter: (M) => L(H),
          onMouseleave: (M) => w(H)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (l(), d("div", Dp, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: P
          }, [
            he(y(i.value.length) + " runs ", 1),
            F(Bt, { open: "" })
          ])
        ])) : I("", !0),
        (l(!0), d(Z, null, re(u.value ? [] : i.value, (H) => (l(), G(fa, {
          key: H.id,
          item: H,
          class: ee({ timed: z(St)(H) }),
          leaving: z(St)(H) && !s.value.has(H.id),
          folded: m(H),
          onFold: (M) => k(H),
          onMouseenter: (M) => L(H),
          onMouseleave: (M) => w(H)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        u.value ? (l(), G(Co, {
          key: "runs-row",
          label: `${i.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: V(() => [
            p("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: U[0] || (U[0] = (H) => o.value = !0)
            }, [
              F(Ve, { name: "runs" }),
              he(" " + y(i.value.length) + " runs ", 1),
              F(Bt)
            ]),
            p("span", Np, [
              (l(!0), d(Z, null, re(i.value, (H) => (l(), G(Sp, {
                key: H.id,
                item: H,
                onClick: (M) => S(H)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : I("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, _y = /* @__PURE__ */ Y(jp, [["__scopeId", "data-v-df7550f8"]]), Et = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, tn = (e) => Math.min(Math.max(e, 0), 1), Pp = (e) => {
  const t = tn(e);
  return t * t * (3 - 2 * t);
}, tt = (e, t, n) => Pp((e - t) / (n - t));
function Sy(e) {
  const t = tn(e), n = tn((t - 0.12) / 0.76) * Et.shuffles, s = Math.min(Math.floor(n), Et.shuffles - 1), a = n - s, o = tt(a, 0.26, 0.38) * (1 - tt(a, 0.76, 0.96)), r = tt(a, 0.38, 0.76), i = tt(t, 0, 0.12) * (1 - tt(t, 0.88, 1)), c = tt(a, 0.2, 0.34) * (1 - tt(a, 0.84, 1)), u = Math.sin(Math.PI * tn((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / Et.shuffles, lift: Et.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const Oo = 2400, qp = 0.05;
function Ey({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, qp), r = Math.min(t + Oo * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
const Xe = {
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
}, hs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Wp = (e) => e * e * (3 - 2 * e), fn = (e, [t, n]) => Wp(hs(e, t, n)), Fp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Yt = ([e, t], n) => e + n() * (t - e);
function Hp(e) {
  return Fp.map(() => {
    const t = Yt(Ye.speed, e), n = Yt(Ye.angle, e) * Math.PI / 180, s = Yt(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Yt(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const Up = Hp(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Vp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function Cy(e, t, n = Up) {
  const s = Xe.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = Vp(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const c = Math.min(a, r), u = s.from.map((h, m) => h + o.velocity[m] * c);
  return u[2] -= Ye.gravity * c * c / 2, { at: u, turn: o.spin * c, landed: Math.max(0, a - r) / i };
}
function Ay(e, t) {
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
const Oy = () => Array.from({ length: Xe.pogo.count }, (e, t) => Xe.pogo.bounce * (t + 1) / Xe.pogo.count), Ty = { stride: 0.5 };
function To(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: hs(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: hs(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Iy(e) {
  const { into: t, out: n } = To(Xe.rope_swing, e);
  return 1 - fn(t, [0, 1]) * (1 - fn(n, [0, 1]));
}
function By(e) {
  const t = Xe.rope_swing, { into: n, out: s } = To(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return fn(n, [0, 1]) * (1 - fn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const zp = { after: 3 }, Gp = 10, Kp = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Yp = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Jp = { weight: 19 }, Zp = {
  build: { cooldown: 180 }
}, Xp = { every: 120 }, Io = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Bo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Qp = {
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
}, Wt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Gp }), ne = (e, t, n = {}) => Wt(e, "clip", t, n), Nn = (e, t, n = {}) => Wt(e, "look", t, n), ma = (e, t, n = {}) => Wt(e, "gaze", t, n), de = (e, t, n = {}, s = {}) => ({ ...Wt(e, "pick", t, n), ...s }), me = (e) => Wt("nothing", "nothing", e, {}), em = 120, tm = 300, jn = (e, t) => ({ ...ne(e, t), cooldown: tm }), nm = 120, se = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), sm = () => [ne("joy", 2)], nt = (e, t, n, s, a = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), st = (e) => ({ ...e, cooldown: Kp[e.name] }), _t = (e) => ({ ...e, shenanigan: !0, lasts: Yp[e.name] }), Cs = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...se("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ne("nod", 2), me(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...se("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...st(ne("bug_shot", 3)), toward: "", onto: !1 },
    { ...st(ne("bug_smash", 2)), toward: "", onto: !1 },
    ne("nod", 2)
  ]),
  ...se("tests_failed", { cooldown: 20, toward: "card" }, [ne("startled", 2), ne("dismay", 1), ne("tantrum", 3), me(1)]),
  ...se("committed", { cooldown: 30, toward: "card", onto: !0 }, [ne("nod", 2), me(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...se("sin_fixed", { cooldown: 300 }, [ne("halo", 1), me(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...se("sin_committed", { cooldown: 300 }, [ne("repent", 1), me(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...se("messaged", { cooldown: nm }, [ne("phone_call", 1)]),
  ...se("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ne("nod", 4), ne("hand_rub", 4), me(7)]),
  ...se("question_asked", { cooldown: 60 }, [ne("ask_sign", 9), ne("look_up", 3), me(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...se("reported", { cooldown: 90 }, [ma("read", 3), ne("nod", 1), me(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...se("read_message", { cooldown: 30 }, [ma("read", 3), me(1)]),
  ...se("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), me(6)]),
  ...se("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), me(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...se("bar_done", { holds: !0 }, sm()),
  ...se("bar_failed", { holds: !0 }, [ne("fume", 1), ne("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...se("standing", { cooldown: 12 }, [ne("look_left", 2), ne("look_right", 2), ne("look_up", 1), me(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...se("launched", { cooldown: 300 }, [ne("tumble", 3), me(47)]),
  // a break from the hammering now and then
  ...se("building", { cooldown: 30 }, [ne("wipe_brow", 4), ne("look_left", 1), ne("look_right", 1), me(69)]),
  ...se("failed", { cooldown: 20, toward: "card" }, [ne("shake", 3), ne("tantrum", 2), me(2)]),
  ...se("refused", { cooldown: 20 }, [ne("shake", 1), me(1)]),
  ...se("work_done", { cooldown: 120 }, [ne("stretch", 2), me(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...se("pondering", { cooldown: [30, 60] }, [de("ponder", 1)]),
  ...se("thought_cloud", { cooldown: 90 }, [de("cloud", 1)]),
  ...se("light_bulb", { cooldown: 150 }, [de("bulb", 1)]),
  ...se("answered", { cooldown: 15 }, [Nn("amused", 3), me(2)]),
  ...se("heard", { cooldown: 30 }, [
    ne("bow", 1, { voices: ["butler"] }),
    ne("salute", 1, { voices: ["squire"] }),
    ne("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    me(1)
  ]),
  ...se("long_walk", { cooldown: 90 }, [ne("stumble", 3), me(22)]),
  ...se("card_arrived", { cooldown: 20, toward: "card" }, [ne("glance", 7), me(13)]),
  ...se("typing", { cooldown: 60 }, [Nn("reading", 1), me(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Qp).flatMap(([e, t]) => se(`reacted:${e}`, {}, [Nn(t, 1)])),
  ...Object.entries(Io).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => se(`agent_reacted:${n}`, {}, [ne(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Bo).flatMap(([e, t]) => se(`agent_reacted:${e}`, {}, [ne(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...se("pastime", {}, [
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
    { ..._t(st(ne("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    _t(st(ne("disco", 2, { ball: "bubble" }))),
    me(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...se("held:search", { cooldown: em }, [jn("search", 3), { ...jn("binoculars", 2), when: { home: !0 } }, { ...jn("glass_bubble", 2), when: { bubble: !0 } }]),
  ...se("held:type", {}, [ne("type", 3), ne("type_ponder", 1)]),
  ...se("held:watch", {}, [ne("watch", 2), ne("wave_up", 1)]),
  ...se("held:compacting", {}, [ne("pack_box", 3), ne("vacuum", 2), ne("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...se("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), me(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...se("tickled", {}, [{ ...st(ne("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...se("eager", {}, [ne("eager", 2, { slow: !0 }), me(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...se("jump", {}, [_t(st(ne("backflip", 7, { high: !0 }))), ne("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...se("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...se("unit", { cooldown: Zp.build.cooldown }, [de("unit", Jp.weight), me(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...se("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...se("carrier", {}, [de("ufo", 3), de("crane", 1)]),
  ...se("crane_from", {}, [de("left", 1), de("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...se("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: Xp.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...se("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...se("roam", {}, [
    de("rest", 35, {}, { stay: [25, 60] }),
    de("seat", 15, {}, { stay: [15, 40] }),
    de("edge", 25, {}, { stay: [8, 20] }),
    _t(de("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    de("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    de("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    de("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    de("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    de("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    _t(st(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...se("laptop", {}, [de("seat", 6, {}, { stay: [60, 150] }), de("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...se("ledge_at", {}, [de("middle", 2, {}, { along: 1 / 2 }), de("third", 1, {}, { along: 1 / 3 }), de("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...se("composed_as", {}, [
    de("facing", 4, {}, { turn: 0, leans: 0 }),
    de("turned_left", 1, {}, { turn: 335, leans: 0 }),
    de("turned_right", 1, {}, { turn: 25, leans: 0 }),
    de("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    de("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], am = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Ro = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), om = (e) => Array.isArray(e) ? e[0] : e, rm = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function im(e) {
  var u;
  const t = e.has ?? (() => !0), n = (h) => e.now - (e.memory.get(h) ?? -1 / 0), s = (h) => !e.memory || Ro(h).every(([m, k]) => n(m) >= om(k)), a = (h) => !h.shenanigan || h.lasts <= (e.room ?? 0), o = Cs.filter((h) => am(h.when, e) && (h.kind !== "clip" || t(h.name)) && s(h) && a(h)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= zp.after && o.some((h) => h.shenanigan) ? o.filter((h) => h.shenanigan) : o, c = i.filter((h) => {
    var m;
    return h.kind === "nothing" || h.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return c.some((h) => h.kind !== "nothing") ? c : i;
}
function lm(e, t) {
  const n = im(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Lo(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Lo(e, t, n) {
  var s;
  for (const [a, o] of Ro(t)) (s = e.memory) == null || s.set(a, e.now + rm(o, n));
}
function Ry(e, t, n) {
  Lo(e, Cs.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const ga = {
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
}, Ly = {
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
}, Dy = 120, Ny = (e) => ga[e] || ga.idle;
[.../* @__PURE__ */ new Set([...Object.values(Io).flatMap((e) => Object.keys(e)), ...Object.keys(Bo)])];
const Ie = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function jy(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Ie.ahead * n ? 180 : Math.sign(s) * Ie.turn;
}
const va = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Py(e, t) {
  const n = Math.min(Ie.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Ie.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Ie.lines, Math.floor((e.bottom - e.top - 2 * s) / Ie.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ie.sweep) % a, i = o % Ie.sweep, c = Ie.sweep - Ie.returnSeconds, u = va((i - c) / Ie.returnSeconds), h = i <= c ? va(i / c) : 1 - u, m = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * h, y: e.top + s + m * Ie.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const cm = 1, um = (e, t, n, s, a, o = 0) => lm({ moment: "jump", high: e > cm * t, memory: s, now: a, room: o }, n).name === "backflip", ya = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, qy = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, Wy = { width: 24, height: 27, top: 3, units: 2 }, dm = "[data-figure-pile]", Fy = { amber: [1, 0.69, 0.125], good: ya.colours.good, bad: ya.colours.bad }, Pn = { phases: 4, dim: 0.25 }, Hy = (e, t, n) => e !== "amber" || (t + n) % Pn.phases < Pn.phases / 2 ? 1 : Pn.dim, hm = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Cs.filter((e) => hm.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const Uy = {
  width: 84,
  belly: 13,
  blink: 4
}, wa = "[data-figure-home]", Ft = () => {
  var t;
  const e = document.querySelector(wa);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(wa)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, fm = "[data-figure-docked-bars]", pm = "[data-figure-chat-foot]", mm = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", gm = "[data-figure-newest]";
function vm() {
  var s, a;
  const e = (s = Ft()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(gm), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !As(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function Do(e, t, n = vm()) {
  if (!e || !n) return !0;
  const s = wt(e, t), a = Os(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = Et.gap;
  return !Po(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const qn = 0.26, ym = 0.54, _n = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: qn, travels: "stand" },
  lounge: { drop: qn, travels: "stand" },
  composed: { drop: qn, travels: "stand" },
  hang: { drop: ym, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, No = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), wm = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Vy = (e, t) => (e === "sit" ? wm.has(t) : No.has(e)) ? e : "stand", zy = 0.25, Gy = (e, t) => No.has(e) && _n[t].drop === 0, jo = 2, km = 90, bm = 180, $m = 140, xm = 280, Mm = 420, _m = 0.25, Sm = 290, Em = 600, Cm = "cubic-bezier(0.2, 0.7, 0.4, 1)", Am = "cubic-bezier(0.55, 0, 0.9, 0.6)", Wn = 5;
function pn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: h = 0, room: m = 0, pogo: k = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Wn) return null;
  (r || i) && (o = Math.max(o, jo));
  const S = o > 1, P = Math.abs(t.x - e.x), L = P < Wn ? 0 : P / (km * o) * 1e3, w = Math.min(L, S ? $m : bm), b = Math.abs(t.y - e.y), U = t.y < e.y, H = U && !k && um(b, n, c, u, h, m), M = U ? Mm + Math.min(b, 400) * _m : Math.sqrt(2 * b / Oo) * 1e3, g = {
    x: t.x,
    y: t.y,
    ms: b > Wn ? H ? Em : M : 0,
    lead: H ? Sm : U ? xm : 0,
    easing: U ? Cm : Am,
    hopping: !0,
    clip: H ? "backflip" : U ? "jump" : "fall"
  }, D = { x: t.x, y: t.y, ms: L + w, lead: 0, easing: "linear", ramp: w, ...S ? { clip: "run" } : {} }, _ = k ? Om(t, n) : g, N = U && !s ? [{ ...D, y: e.y }, _] : [{ ...g, x: e.x }, D];
  return { way: Math.sign(t.x - e.x) || 1, legs: N, lands: !a, pace: o, running: S };
}
const Om = (e, t) => ({ x: e.x, y: e.y, ms: Xe.pogo.frames / Xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), wt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - _n[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Po = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, As = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function kt() {
  var t;
  const e = (t = Ft()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Jt = 0.5, ka = 20;
function Ky(e, t, n = kt()) {
  const s = wt(e, t);
  return s.left >= n.left + ka && s.right <= n.right - ka;
}
function qo(e, t, n = kt()) {
  const s = wt(e, t), a = s.right - s.left, o = Os(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Jt && i <= n.right + Jt && s.top >= n.top - Jt && c <= n.bottom + Jt;
}
const mn = [0.35, 0.5, 0.65], gn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: mn[0], right: mn.at(-1), top: gn[0], bottom: gn.at(-1) }, Tm = 0.24;
function Os(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Tm * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function Im(e, { size: t }, n = kt()) {
  const s = Os(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Bm = (Je.right - Je.left) / 2 + 0.08;
function Rm(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !As(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const c of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[c].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, c), u.setEnd(o, c + 1), [...u.getClientRects()].some((h) => e >= h.left && e <= h.right && t >= h.top && t <= h.bottom)) return !0;
  }
  return !1;
}
const Lm = (e) => gn.flatMap(
  (t) => mn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Dm(e, t, n = "") {
  if (!Do(e, t)) return mn.length * gn.length;
  const s = wt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(mm)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && Po(a, c) && As(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return Lm(a).filter(([i, c]) => r(i, c) || Rm(i, c, n)).length;
}
function Nm(e, t, n) {
  const s = kt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => qo(r, t, s) && Do(r, t)).map((r) => ({ spot: r, covered: Dm(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Wo = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, jm = Bm, Pm = (e, t, { size: n }, s = jm) => qm(e, Wo[t], s * n, "stand");
function qm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Yy = (e) => ((e + 180) % 360 + 360) % 360 - 180, Jy = { turns: [-20, -10, 0, 10, 20] }, Wm = 7;
function Fm() {
  const e = [...document.querySelectorAll(dm)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const Hm = 4;
function Um() {
  const e = Fo(), t = Fm(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Hm || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Wm - n, 0) } };
}
const Zy = ({ size: e, below: t }) => (1 - t) * e;
function Vm(e, t) {
  const n = kt(), { size: s, below: a } = t, o = _n[e.posture].drop * s;
  return { ...Im(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const zm = (e, t) => Object.keys(Wo).map((n) => Vm(Pm(e, n, t), t)), Gm = (e, t, n) => Nm(e, t, n) ?? e[0];
function Xy(e, t) {
  const { element: n, edge: s } = Um();
  return { ...Gm(zm(s, e), e, t), view: null, on: n };
}
function Fo() {
  var s;
  const e = Ft(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(fm);
  if (!t) return { ...Ho(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Ho() {
  const e = Ft();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const Km = { climb: 90 };
function Qy(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: h = 0, room: m = 0, pogo: k = !1 } = {}) {
  (o || r) && (a = Math.max(a, jo));
  const S = (H) => {
    const M = wt(H, n, _n[H.posture].travels);
    return { x: M.left, y: M.top };
  }, P = t.ladder ?? e.ladder;
  if (P && !(t.ladder && e.ladder)) return Ym(S(e), S(t), S({ ...P.foot, posture: "stand" }), P.way, !!t.ladder, n, a);
  const [L, ...w] = [e, ...c, t].map(S), b = pn(L, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: h, room: m, pogo: k }), U = w.slice(1).map((H, M) => {
    var g;
    return (g = pn(w[M], H, n.size, { random: i, memory: u, now: h, room: m })) == null ? void 0 : g.legs.find((D) => D.hopping);
  });
  return b && { ...b, legs: [...b.legs, ...U.filter(Boolean)] };
}
function Ym(e, t, n, s, a, o, r) {
  const i = (h, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - h.x, m.y - h.y) / Km.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? pn(e, n, o.size, { pace: r }) : pn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const Jm = "[data-figure-bubble]", Zm = 250;
let At = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Uo = 0;
const Vo = () => At, Fn = /* @__PURE__ */ new WeakMap();
let Xm = 0;
function zo(e) {
  return Fn.has(e) || Fn.set(e, `floor-${++Xm}`), Fn.get(e);
}
const Qm = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, eg = () => {
  var e, t;
  return ((t = (e = Ft()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function tg(e, t) {
  var s;
  const n = (s = e.querySelector(pm)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function ng(e, t) {
  const n = e && tg(e, t), s = e ? [...e.querySelectorAll(Jm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Qm(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: zo(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const sg = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Zm ? (t.top - s.top) / a * 1e3 : 0;
};
function ag(e = At, t = performance.now()) {
  const n = kt(), s = eg(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = Fo(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = Ho();
  return u.element && c.push({ id: zo(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...ng(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((h) => Object.freeze({ ...h, vy: sg(e, h, t) }))) });
}
const fs = /* @__PURE__ */ new Set();
function og(e) {
  return fs.add(e), () => fs.delete(e);
}
function rg() {
  Go();
  const e = () => {
    Uo = requestAnimationFrame(e), !document.hidden && (At = ag(At), fs.forEach((t) => t(At)));
  };
  e();
}
function Go() {
  cancelAnimationFrame(Uo);
}
const ig = (e, t) => e.find((n) => n.id === t) ?? null;
function ew(e, t, n = Vo().floors) {
  const s = ig(n, "home");
  return e.posture === "hang" && s && wt(e, t).bottom >= s.top ? !1 : qo(e, t);
}
const lg = ["data-kind"], cg = { class: "figure-floor-name" }, ug = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", cg, y(e.floor.kind), 1)
    ], 12, lg));
  }
}, dg = /* @__PURE__ */ Y(ug, [["__scopeId", "data-v-8f6132da"]]), hg = {
  class: "figure-floors",
  "aria-hidden": "true"
}, fg = {
  __name: "FigureFloors",
  setup(e) {
    const t = vn(Vo().floors);
    let n = () => {
    };
    return De(() => {
      n = og((s) => t.value = s.floors), rg();
    }), Ae(() => {
      n(), Go();
    }), (s, a) => (l(), d("div", hg, [
      (l(!0), d(Z, null, re(t.value, (o) => (l(), G(dg, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, tw = /* @__PURE__ */ Y(fg, [["__scopeId", "data-v-e519168b"]]), Hn = (e) => typeof e == "number" ? e : Date.parse(e);
function nw(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Hn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Hn(a.row.created_at) - Hn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const pg = 3, Un = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function mg(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Un[n.grouping]) == null ? void 0 : s.call(Un, e.row, n)) || "";
}
function gg(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function sw(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= pg ? [gg(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = mg(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const vg = 1e3;
function aw() {
  const e = R(Date.now()), t = setInterval(() => e.value = Date.now(), vg);
  return vt(() => clearInterval(t)), e;
}
function ow(e) {
  const t = yn(), n = R(null), s = R("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const Zt = /* @__PURE__ */ new Map();
function yg(e, t) {
  if (Zt.has(e)) return Zt.get(e);
  const n = t().finally(() => Zt.delete(e));
  return Zt.set(e, n), n;
}
function rw() {
  const e = yn(), t = R(null), n = R("");
  async function s() {
    const a = await yg(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const wg = {
  class: "cards-page",
  "data-window-flush": ""
}, kg = { class: "cards-bar" }, bg = { class: "cards-count" }, $g = { class: "cards" }, xg = {
  key: 1,
  class: "cards-note"
}, Mg = {
  key: 2,
  class: "cards-note"
}, _g = ["data-row", "onClick"], Sg = { class: "card-head" }, Eg = { class: "card-age" }, Cg = { class: "card-title" }, Ag = { class: "card-foot" }, Og = {
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
    return (s, a) => (l(), d("div", wg, [
      p("div", kg, [
        p("span", bg, y(e.rows.length) + " " + y(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        F(ve, rt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: V(() => [
            F(ke, {
              name: "plus",
              size: 12
            }),
            he(" New " + y(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", $g, [
        e.loaded ? e.failure ? (l(), d("p", xg, y(e.failure), 1)) : e.rows.length ? I("", !0) : (l(), d("p", Mg, "No " + y(e.noun) + "s yet", 1)) : (l(), G(yt, {
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
          p("span", Sg, [
            F(ke, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            he(" " + y(e.head(o)), 1),
            p("span", Eg, y(z(Qn)(o.created_at)), 1)
          ]),
          p("span", Cg, y(e.title(o)), 1),
          p("span", Ag, y(e.foot(o)), 1)
        ], 8, _g))), 128))
      ]),
      we(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, iw = /* @__PURE__ */ Y(Og, [["__scopeId", "data-v-d72d528d"]]), ba = "newest";
function lw(e, { title: t, isOpen: n = null }) {
  const s = R(""), a = R(ba), o = R("all"), r = O(() => {
    const i = s.value.trim().toLowerCase(), c = e.value.filter((u) => (!i || JSON.stringify(u).toLowerCase().includes(i)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === ba ? c : [...c].sort((u, h) => t(u).localeCompare(t(h)));
  });
  return { words: s, order: a, state: o, shown: r, hasStates: !!n };
}
const Tg = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Ig = 40, Bg = "top", Rg = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var m;
    const n = e, s = (m = Ce(Ne, null)) == null ? void 0 : m.autoScroll, a = O(() => s === Bg), o = R(null), r = R(!1), i = (k) => a.value ? k.scrollTop : k.scrollHeight - k.scrollTop - k.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function h() {
      r.value = i(o.value) >= Ig;
    }
    return be(() => n.rowCount, async () => {
      await Dt(), !r.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (k, S) => (l(), d("div", Tg, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: ee(["auto-scroll-pane", e.paneClass]),
        onScroll: h
      }, [
        we(k.$slots, "default", {}, void 0, !0)
      ], 34),
      F(Lt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: V(() => [
          it(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            F(ke, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            S[0] || (S[0] = he(" Newest ", -1))
          ], 512), [
            [ur, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, cw = /* @__PURE__ */ Y(Rg, [["__scopeId", "data-v-3accb764"]]), Lg = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, Dg = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Ce(Ne, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (l(), d("div", Lg, [
      (l(!0), d(Z, null, re(z(s), (i) => {
        var c;
        return l(), G(ve, {
          key: i.key,
          kind: "text",
          class: ee(["inner-tab", { on: ((c = e.active) == null ? void 0 : c.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: V(() => [
            he(y(i.label) + " " + y(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, uw = /* @__PURE__ */ Y(Dg, [["__scopeId", "data-v-cf3bb39f"]]), Ng = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, jg = {
  key: 1,
  class: "menu-item-text"
}, Pg = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), d("span", Ng, y(e.checked ? "✓" : ""), 1)) : I("", !0),
      e.description ? (l(), d("span", jg, [
        p("span", null, [
          we(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, y(e.description), 1)
      ])) : we(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ps = /* @__PURE__ */ Y(Pg, [["__scopeId", "data-v-fec99974"]]), qg = {}, Wg = { class: "menu-label" };
function Fg(e, t) {
  return l(), d("span", Wg, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ms = /* @__PURE__ */ Y(qg, [["render", Fg], ["__scopeId", "data-v-aa955b3e"]]), Ko = /* @__PURE__ */ new WeakMap(), Hg = (e, t) => Ko.set(e, t);
function Ug(e, t) {
  for (let n = t; n; n = Ko.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Vg(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Ug(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const ft = 8, zg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = R(null), o = (f) => f ? `${f}px` : void 0, r = O(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = R({ w: 0, h: 0 }), c = R(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), h = (f) => ({
      left: Math.max(0, f.left),
      top: Math.max(0, f.top),
      right: Math.min(window.innerWidth, f.right),
      bottom: Math.min(window.innerHeight, f.bottom)
    }), m = (f) => {
      const C = f.closest(".pane, .float-window");
      return C ? h(C.getBoundingClientRect()) : u();
    }, k = (f, C) => `${Math.max(0, f ? Math.min(f, C) : C)}px`;
    function S(f, C) {
      return {
        below: f.bottom - C.bottom - s.gap - ft,
        above: C.top - f.top - s.gap - ft,
        across: f.right - f.left - 2 * ft
      };
    }
    function P(f) {
      const C = m(s.anchor), A = S(C, f);
      return i.value.w <= A.across && i.value.h <= Math.max(A.below, A.above) ? C : u();
    }
    const L = O(() => {
      if (!c.value) return r.value;
      const f = c.value, C = P(f), A = S(C, f), { w: q, h: ie } = i.value, le = s.align === "auto" ? f.left + f.right > C.left + C.right : s.align === "right", te = Ti(le ? f.right - q : f.left, C.left + ft, Math.max(C.left + ft, C.right - q - ft)), Q = ie > A.below && A.above > A.below ? { bottom: `${window.innerHeight - f.top + s.gap}px`, maxHeight: k(s.maxHeight, A.above) } : { top: `${f.bottom + s.gap}px`, maxHeight: k(s.maxHeight, A.below) };
      return { ...r.value, ...Q, left: `${te}px`, maxWidth: k(s.maxWidth, A.across) };
    }), w = n, b = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function U(f) {
      const C = b(), A = C.indexOf(document.activeElement);
      C[(A + f + C.length) % C.length].focus();
    }
    const H = { ArrowDown: () => U(1), ArrowUp: () => U(-1), Escape: () => w("close") }, M = (f) => H[f.key] && (f.preventDefault(), H[f.key]()), g = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let D = 0;
    const _ = new ResizeObserver(() => {
      cancelAnimationFrame(D), D = requestAnimationFrame(g);
    });
    Vg(a, (f) => s.anchor && !s.anchor.contains(f.target) && w("close"));
    const N = (f, C) => ["top", "left", "right", "bottom"].some((A) => Math.abs(f[A] - C[A]) > 1), $ = (f) => f.bottom < 0 || f.top > window.innerHeight;
    let E = 0;
    function v() {
      if (s.anchor) {
        const f = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || $(f)) return w("close");
        N(f, c.value) && (c.value = f);
      }
      E = requestAnimationFrame(v);
    }
    return De(() => {
      s.anchor && a.value && Hg(a.value, s.anchor), g(), a.value && _.observe(a.value), !s.plain && b()[0] && b()[0].focus(), v();
    }), Ae(() => {
      _.disconnect(), cancelAnimationFrame(E), cancelAnimationFrame(D);
    }), t({ element: a }), (f, C) => (l(), G(Sa, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", rt({
        ref_key: "panel",
        ref: a
      }, f.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: L.value,
        onKeydown: M
      }), [
        we(f.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Yo = /* @__PURE__ */ Y(zg, [["__scopeId", "data-v-3d203970"]]), Gg = {
  class: "search-bar",
  "data-search-bar": ""
}, Kg = { class: "search-bar-control" }, Yg = ["value", "placeholder", "aria-label"], Jg = ["aria-expanded"], Zg = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: n }) {
    const s = n, a = dr(), o = R(null), r = R(null), i = (u) => r.value = r.value ? null : u.currentTarget;
    function c() {
      var u;
      s("update:modelValue", ""), (u = o.value) == null || u.focus();
    }
    return t({ focus: () => {
      var u;
      return (u = o.value) == null ? void 0 : u.focus();
    } }), (u, h) => (l(), d("div", Gg, [
      p("div", Kg, [
        F(ke, {
          class: "search-bar-icon",
          name: "search",
          size: 14
        }),
        p("input", {
          ref_key: "field",
          ref: o,
          class: "search-bar-input",
          type: "text",
          "data-search-input": "",
          value: e.modelValue,
          placeholder: e.placeholder,
          "aria-label": e.placeholder,
          onInput: h[0] || (h[0] = (m) => s("update:modelValue", m.target.value)),
          onKeydown: Ot(c, ["esc"])
        }, null, 40, Yg),
        e.modelValue ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-clear",
          "data-search-clear": "",
          "aria-label": "Clear the search",
          onClick: c
        }, [
          F(ke, {
            name: "close",
            size: 12
          })
        ])) : I("", !0),
        z(a).menu ? (l(), d("button", {
          key: 1,
          type: "button",
          class: "search-bar-menu",
          "data-search-menu": "",
          "aria-label": "Options",
          title: "Options",
          "aria-expanded": !!r.value,
          onClick: i
        }, [
          F(ke, {
            name: "caret",
            size: 12
          })
        ], 8, Jg)) : I("", !0)
      ]),
      we(u.$slots, "default", {}, void 0, !0),
      r.value ? (l(), G(Yo, {
        key: 0,
        anchor: r.value,
        align: "end",
        "min-width": 220,
        "max-width": 320,
        onClick: h[1] || (h[1] = Me(() => {
        }, ["stop"])),
        onClose: h[2] || (h[2] = (m) => r.value = null)
      }, {
        default: V(() => [
          we(u.$slots, "menu", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : I("", !0)
    ]));
  }
}, Xg = /* @__PURE__ */ Y(Zg, [["__scopeId", "data-v-c2f6060d"]]), Qg = {
  class: "list-tools",
  "data-list-tools": ""
}, e0 = {
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
    return (s, a) => (l(), d("div", Qg, [
      F(Xg, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, {
        menu: V(() => [
          F(ms, null, {
            default: V(() => [...a[1] || (a[1] = [
              he("Order", -1)
            ])]),
            _: 1
          }),
          (l(), d(Z, null, re(t, (o) => F(ps, {
            key: o.key,
            checked: e.tools.order.value === o.key,
            "data-list-order": o.key,
            onClick: (r) => e.tools.order.value = o.key
          }, {
            default: V(() => [
              he(y(o.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (l(), d(Z, { key: 0 }, [
            F(ms, null, {
              default: V(() => [...a[2] || (a[2] = [
                he("Show", -1)
              ])]),
              _: 1
            }),
            (l(), d(Z, null, re(n, (o) => F(ps, {
              key: o.key,
              checked: e.tools.state.value === o.key,
              "data-list-state": o.key,
              onClick: (r) => e.tools.state.value = o.key
            }, {
              default: V(() => [
                he(y(o.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : I("", !0)
        ]),
        default: V(() => [
          we(s.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, dw = /* @__PURE__ */ Y(e0, [["__scopeId", "data-v-9a3cea5b"]]);
function hw() {
  const e = R(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const t0 = 86400, gs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function n0(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((gs(t) - gs(e)) / t0);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function fw(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = gs(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: n0(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Vn = 280, zn = 240, Gn = 120, s0 = 6, a0 = 14, Rt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function o0(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${a0}px)` }), e.offsetHeight, e.style.transition = `height ${Vn}ms ${Rt}`, e.style.height = `${r}px`;
  const i = a();
  let c = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const h = a() - i;
    if (!c && h >= Vn && (c = !0, e.style.transition = `opacity ${zn}ms ease-out, transform ${zn}ms ${Rt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), h < Vn + zn) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function pw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${s0}px)` }), e.offsetHeight, e.style.transition = `opacity ${Gn}ms ease-out, transform ${Gn}ms ${Rt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - r < Gn) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const r0 = 140, Xt = 220, i0 = 5;
function mw({ gap: e = r0, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, i0);
    if (s = i.length > 0, !s) return;
    let c = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), c -= 1, c || t(o, e);
      });
  }
  const r = (i, c, u, h = o0) => {
    if (!c.pane || !c.follows()) return u();
    const m = { el: i, options: c, done: u, arrival: h, display: i.style.display || "" };
    if (!s)
      return s = !0, h(i, c, () => a(m));
    i.style.display = "none", n.push(m);
  };
  return r.flush = () => {
    for (const i of n.splice(0))
      i.el.style.display = i.display, i.done();
  }, r;
}
function gw(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Xt}ms ${Rt}, opacity ${Xt}ms ease-in, margin ${Xt}ms ${Rt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Xt);
}
const Jo = "chat.pins.minimised", nn = R(Tt(Jo, !1));
function $a(e) {
  nn.value = e, wn(Jo, e);
}
function l0(e) {
  const t = O(() => e()), n = O(() => nn.value ? [] : e()), s = () => $a(!nn.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => ja(o) > a).length,
    (o, r) => o > r && $a(!1)
  ), { pins: t, visible: n, minimised: nn, toggle: s };
}
const c0 = ["title"], u0 = {
  key: 0,
  class: "pins-count"
}, d0 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = l0(() => t.pinRows);
    return (o, r) => z(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: ee(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = Me((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      F(ke, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (l(), d("span", u0, y(z(n).length), 1)) : I("", !0)
    ], 10, c0)) : I("", !0);
  }
}, vw = /* @__PURE__ */ Y(d0, [["__scopeId", "data-v-d073c504"]]), h0 = ["title"], f0 = ["title"], p0 = { class: "diff-card-dir" }, m0 = { class: "diff-card-name" }, g0 = { class: "diff-card-ago" }, v0 = ["title"], y0 = ["title"], w0 = {
  key: 0,
  class: "diff-card-note"
}, k0 = ["href"], b0 = ["src", "alt"], $0 = { class: "diff-card-rows" }, x0 = { class: "diff-row-num" }, M0 = { class: "diff-row-sign" }, _0 = { class: "diff-row-code" }, S0 = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = O(() => n.path.lastIndexOf("/") + 1), u = O(() => n.path.slice(0, c.value)), h = O(() => n.path.slice(c.value)), m = O(() => n.kind === "deleted"), k = O(() => r[n.kind]), S = O(() => new Set(n.rows.filter((E) => E.line_type === "add").map((E) => E.line))), P = R("after"), L = O(() => P.value === "before" ? n.whole.old : n.whole.text), w = O(() => n.whole && n.whole.text !== void 0 ? L.value.split(`
`).map((E, v) => ({ line_type: P.value === "after" && S.value.has(v + 1) ? "add" : "ctx", line: v + 1, text: E })) : n.rows.filter(
      (E) => !(n.editsOnly && ["ctx", "fold"].includes(E.line_type)) && !(n.hideRemovals && E.line_type === "del")
    )), b = R(!1), U = O(() => n.lines && !b.value && !n.whole), H = O(() => U.value ? w.value.slice(0, n.lines) : w.value), M = O(() => w.value.length - H.value.length), g = (E) => E.line === null || E.line_type === "del" ? "" : E.line, D = (E) => E.line_type === "fold" ? E.hidden ? `⋯ ${E.hidden} lines` : "⋯" : E.text, _ = R(null), N = R(null);
    let $ = null;
    return De(() => {
      if (!N.value) return;
      let E = !0;
      $ = new ResizeObserver(() => {
        !_.value || !N.value || (_.value.style.transition = E ? "none" : "", _.value.style.height = `${N.value.offsetHeight}px`, E = !1);
      }), $.observe(N.value);
    }), Ae(() => $ && $.disconnect()), (E, v) => (l(), d("section", {
      class: ee(["diff-card", { half: e.half, gone: m.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: m.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: v[2] || (v[2] = (f) => !m.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${z(a)}-click to open it`,
          onClick: o
        }, [
          p("span", p0, y(u.value), 1),
          p("span", m0, y(h.value), 1),
          k.value ? (l(), d("span", {
            key: 0,
            class: ee(["diff-card-badge", e.kind])
          }, y(k.value), 3)) : I("", !0)
        ], 8, f0),
        p("span", {
          class: ee(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + y(e.added), 3),
        p("span", {
          class: ee(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + y(e.removed), 3),
        p("span", g0, y(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: P.value === "after" ? "Show the file before" : "Show the file after",
          onClick: v[0] || (v[0] = Me((f) => P.value = P.value === "after" ? "before" : "after", ["stop"]))
        }, y(P.value === "after" ? "After" : "Before"), 9, v0)) : I("", !0),
        m.value ? I("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: ee(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: v[1] || (v[1] = Me((f) => s("whole"), ["stop"]))
        }, [
          F(ke, {
            name: "file",
            size: 12
          })
        ], 10, y0))
      ], 8, h0),
      e.whole && e.whole.error ? (l(), d("p", w0, y(e.whole.error), 1)) : I("", !0),
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
            alt: h.value,
            loading: "lazy"
          }, null, 8, b0)
        ], 8, k0)) : (l(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: _,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: N,
            class: "diff-card-diff"
          }, [
            p("div", $0, [
              (l(!0), d(Z, null, re(H.value, (f, C) => (l(), d("div", {
                key: C,
                class: ee(["diff-row", f.line_type, { fresh: e.fresh && f.edit === e.fresh }])
              }, [
                p("span", x0, y(g(f)), 1),
                p("span", M0, y(i[f.line_type]), 1),
                p("span", _0, y(D(f)), 1)
              ], 2))), 128)),
              M.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: v[3] || (v[3] = Me((f) => b.value = !0, ["stop"]))
              }, y(M.value) + " more " + y(M.value === 1 ? "line" : "lines"), 1)) : I("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : I("", !0)
    ], 2));
  }
}, yw = /* @__PURE__ */ Y(S0, [["__scopeId", "data-v-b6424f6e"]]), E0 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), G(ve, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: V(() => [
        F(ke, {
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
}, A0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, O0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], T0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], I0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], B0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], R0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], L0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? R0(t) : e === "agent" ? [...I0(t), ...T0(t)] : e === "check" ? B0(t) : e === "question" ? O0(t) : ((n = { plan: C0, task: A0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, D0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, N0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, j0 = { class: "ask-text" }, P0 = ["placeholder", "aria-label"], q0 = ["placeholder", "aria-label"], W0 = {
  key: 3,
  class: "moves"
}, F0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = O(() => L0(s.kind, s.row)), r = R(""), i = R(null), c = R(""), u = R("");
    be(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function h(S, P = "") {
      const L = await s.read([S.noun ?? s.kind, S.word, String(s.id), ...S.flag ? [S.flag, P] : S.positional ? [P] : [], ...S.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = L.ok ? "" : L.error, L.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const m = (S) => S.confirm ? i.value = S : S.said ? h(S, S.said) : S.flag || S.positional ? (i.value = S, c.value = "") : h(S), k = () => c.value.trim() && h(i.value, c.value.trim());
    return t({ moves: o, press: m }), (S, P) => {
      var L;
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: ee(["foot", { inline: e.inline }])
      }, [
        r.value ? (l(), d("p", D0, y(r.value), 1)) : I("", !0),
        (L = i.value) != null && L.confirm ? (l(), d("div", N0, [
          p("span", j0, y(i.value.confirm), 1),
          F(ve, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: P[0] || (P[0] = (w) => h(i.value))
          }, {
            default: V(() => [
              he(y(i.value.label), 1)
            ]),
            _: 1
          }),
          F(ve, {
            small: "",
            kind: "ghost",
            onClick: P[1] || (P[1] = (w) => i.value = null)
          }, {
            default: V(() => [...P[7] || (P[7] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (l(), d("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: Me(k, ["prevent"])
        }, [
          it(p("input", {
            "onUpdate:modelValue": P[2] || (P[2] = (w) => c.value = w),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: P[3] || (P[3] = Ot(Me((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, P0), [
            [Zn, c.value]
          ]),
          i.value.opener ? it((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": P[4] || (P[4] = (w) => u.value = w),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: P[5] || (P[5] = Ot(Me((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, q0)), [
            [Zn, u.value]
          ]) : I("", !0),
          F(ve, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: V(() => [
              he(y(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(ve, {
            small: "",
            kind: "ghost",
            onClick: P[6] || (P[6] = (w) => i.value = null)
          }, {
            default: V(() => [...P[8] || (P[8] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", W0, [
          (l(!0), d(Z, null, re(o.value, (w) => (l(), G(ve, {
            key: w.word,
            small: "",
            kind: w.main ? "primary" : "ghost",
            "data-move": w.word,
            onClick: (b) => m(w)
          }, {
            default: V(() => [
              he(y(w.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : I("", !0);
    };
  }
}, H0 = /* @__PURE__ */ Y(F0, [["__scopeId", "data-v-fffa0bf6"]]), U0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, V0 = { ...U0, done: "Completed" }, z0 = { class: "task-status-icon" }, G0 = ["width", "height", "aria-label"], K0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", z0, [
      F(Lt, {
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
            "aria-label": z(V0)[e.status]
          }, [
            F(ws, { value: e.status }, {
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
}, Zo = /* @__PURE__ */ Y(K0, [["__scopeId", "data-v-2ab7e404"]]), Y0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), J0 = (e) => Y0.has(e), Xo = (e) => J0(e) ? "done" : e, Z0 = { class: "facts" }, X0 = { class: "fact wide" }, Q0 = { class: "fact-value" }, ev = {
  key: 0,
  class: "fact"
}, tv = { class: "fact-value" }, nv = {
  key: 1,
  class: "fact"
}, sv = { class: "fact-value" }, av = { class: "fact wide" }, ov = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, rv = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = un.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return l(), d("div", Z0, [
        p("div", X0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", Q0, y((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", ev, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", tv, y(e.place.phase_number) + " of " + y(e.place.phase_total) + ": " + y(e.place.phase_title), 1)
        ])) : I("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", nv, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", sv, "Agent " + y(e.task.holder_id), 1)
        ])) : I("", !0),
        p("div", av, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          F(Xh, {
            options: z(n),
            value: String(z(vo)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", ov, y(e.refusal), 1)) : I("", !0)
        ])
      ]);
    };
  }
}, iv = /* @__PURE__ */ Y(rv, [["__scopeId", "data-v-2018762d"]]), lv = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, cv = ["onClick"], uv = { class: "wait-id" }, dv = { class: "wait-title" }, hv = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, fv = { class: "text" }, pv = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, mv = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, gv = 180, vv = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = R(!1);
    return (a, o) => (l(), d(Z, null, [
      e.task.waits.length ? (l(), d("section", lv, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (l(!0), d(Z, null, re(e.task.waits, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          F(Zo, {
            status: z(Xo)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", uv, y(r.id), 1),
          p("span", dv, y(r.title), 1)
        ], 8, cv))), 128))
      ])) : I("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", hv, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", fv, y(e.task.outcome), 1)
      ])) : I("", !0),
      e.task.brief ? (l(), d("section", pv, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: ee(["text", { clamped: !s.value }])
        }, y(e.task.brief), 3),
        e.task.brief.length > gv && !s.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : I("", !0)
      ])) : I("", !0),
      e.task.logs.length ? (l(), d("section", mv, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(Z, null, re(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, y(r.line), 1))), 128))
      ])) : I("", !0)
    ], 64));
  }
}, yv = /* @__PURE__ */ Y(vv, [["__scopeId", "data-v-f411ce35"]]), wv = { class: "comment-side-head" }, kv = {
  key: 0,
  class: "comment-none"
}, bv = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), d("aside", {
      class: ee(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", wv, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        F(ks, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? I("", !0) : (l(), d("p", kv, "No comments yet")),
      (l(!0), d(Z, null, re(e.comments, (s) => (l(), d("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, y(e.words(s)), 1))), 128))
    ], 2));
  }
}, $v = /* @__PURE__ */ Y(bv, [["__scopeId", "data-v-19fdbdd4"]]), xv = ["data-comments-below"], Mv = 600, _v = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = R(null), n = R(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < Mv);
    return De(() => s.observe(t.value)), vt(() => s.disconnect()), (a, o) => (l(), d("div", {
      ref_key: "root",
      ref: t,
      class: ee(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      we(a.$slots, "default"),
      e.open ? (l(), G($v, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : I("", !0)
    ], 10, xv));
  }
}, Sv = /* @__PURE__ */ Y(_v, [["__scopeId", "data-v-6c850df0"]]), Ev = ["placeholder"], Cv = { class: "actions" }, Av = { class: "error" }, Ov = {
  key: 1,
  class: "card closed"
}, Tv = { class: "mark" }, Iv = { class: "prompt" }, Bv = {
  key: 0,
  class: "draft"
}, Rv = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Jn({
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
  emits: /* @__PURE__ */ Jn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Yn(e, "draft"), r = Yn(e, "error"), i = R(!!r.value), c = R(!1), u = R(!1), h = R(null);
    async function m() {
      var L, w;
      i.value = !0, c.value = !1, await Dt(), (w = ((L = h.value) == null ? void 0 : L.querySelector("input")) || h.value) == null || w.focus();
    }
    function k() {
      i.value = !1, r.value = "";
    }
    function S(L) {
      L.shiftKey || L.isComposing || (L.preventDefault(), P());
    }
    async function P() {
      const L = o.value.trim();
      if (!(!L || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(L), i.value = !1, c.value = !0;
        } catch (w) {
          o.value = L, r.value = w.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: m }), (L, w) => (l(), d("div", {
      class: ee(["comment-bar", { open: i.value }])
    }, [
      i.value ? (l(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: Me(P, ["prevent"]),
        onKeydown: Ot(k, ["esc"])
      }, [
        we(L.$slots, "who", {}, void 0, !0),
        it(p("textarea", {
          ref_key: "box",
          ref: h,
          "onUpdate:modelValue": w[0] || (w[0] = (b) => o.value = b),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Ot(S, ["enter"])
        }, null, 40, Ev), [
          [Zn, o.value]
        ]),
        p("div", Cv, [
          p("span", Av, y(r.value), 1),
          F(ve, {
            small: "",
            onClick: k
          }, {
            default: V(() => [...w[2] || (w[2] = [
              he("Cancel", -1)
            ])]),
            _: 1
          }),
          F(ve, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: P
          }, {
            default: V(() => [...w[3] || (w[3] = [
              he("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (l(), d("div", Ov, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          p("span", Tv, [
            F(ke, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", Iv, y(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", Bv, "Draft kept")) : I("", !0)
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = (b) => a("show"))
        }, [
          p("span", null, y(z(Ii)(e.count, "comment")), 1),
          F(ke, {
            name: "down",
            size: 12
          })
        ])) : I("", !0)
      ]))
    ], 2));
  }
}, Lv = /* @__PURE__ */ Y(Rv, [["__scopeId", "data-v-79db0c2d"]]);
function Dv(e, t) {
  const n = R([]), s = R(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: h, id: m, title: k } = e(), S = `On ${h} ${m}, ${k}: `;
    return u.text.startsWith(S) ? u.text.slice(S.length) : u.text;
  };
  async function i() {
    const { kind: u, id: h } = e();
    if (!h) return;
    const m = ++o, k = await t([u, "comments", String(h)]);
    m === o && (n.value = k.ok ? k.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: h, id: m } = e(), k = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, k], s.value = !0;
    const S = await t([h, "comment", String(m), u]);
    if (!S.ok)
      throw n.value = n.value.filter((P) => P !== k && P.id !== k.id), new Error(S.error);
    await i();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: c, load: i };
}
const Nv = { class: "top" }, jv = {
  class: "crumb",
  "data-task-crumb": ""
}, Pv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, qv = {
  key: 1,
  class: "body"
}, Wv = { class: "stamp" }, Fv = {
  class: "title",
  "data-resource-title": ""
}, Hv = { class: "since" }, Uv = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Vv = { class: "text" }, zv = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Gv = {
  key: 1,
  class: "note"
}, Kv = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Yv = { class: "text" }, Jv = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = R(null), r = R(null), i = R(""), c = R(""), u = R(null), h = R(null), m = Dv(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (M) => s.read(M));
    be(m.open, (M) => a("comments", M));
    let k = 0;
    const S = Xo, P = (M) => M.slice(0, 1).toUpperCase() + M.slice(1), L = O(() => {
      var M;
      return (M = r.value) != null && M.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function w() {
      const M = ++k, [g, D] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      M === k && (i.value = g.ok ? "" : g.error, o.value = g.ok ? g.value : null, r.value = D.ok ? D.value : null);
    }
    be(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, w();
    }, { immediate: !0 }), be(() => s.changes, w);
    async function b(M) {
      const g = o.value.priority;
      o.value.priority = Number(M);
      const D = await s.read(["task", "edit", String(s.id), "--priority", M]);
      if (c.value = D.ok ? "" : D.error, D.ok) return w();
      o.value.priority = g;
    }
    function U(M) {
      u.value = null, h.value.press(M);
    }
    const H = (M) => {
      var g;
      return ((g = h.value) == null ? void 0 : g.moves.length) && (u.value = M);
    };
    return t({ openStatus: H }), (M, g) => (l(), d("aside", {
      class: ee(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", Nv, [
        e.backed ? (l(), G(E0, {
          key: 0,
          onBack: g[0] || (g[0] = (D) => a("back"))
        })) : I("", !0),
        p("span", jv, y(L.value), 1),
        g[9] || (g[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(Z, { key: 1 }, [
          F(ve, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: g[1] || (g[1] = (D) => a("step", -1))
          }, {
            default: V(() => [
              F(ke, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          F(ve, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: g[2] || (g[2] = (D) => a("step", 1))
          }, {
            default: V(() => [
              F(ke, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : I("", !0),
        F(ve, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: g[3] || (g[3] = (D) => a("close"))
        }, {
          default: V(() => [
            F(ke, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (l(), d("p", Pv, y(i.value), 1)) : o.value ? (l(), d(Z, { key: 2 }, [
        F(Sv, {
          open: z(m).open.value,
          comments: z(m).comments.value,
          words: z(m).words,
          onClose: g[6] || (g[6] = (D) => z(m).open.value = !1)
        }, {
          default: V(() => {
            var D;
            return [
              (l(), d("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", Wv, "Task " + y(o.value.id) + " · updated " + y(z(Qn)(z(rn)(o.value)) || "just now"), 1),
                p("h3", Fv, y(o.value.title), 1),
                p("div", {
                  class: ee(["state-line", z(S)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: g[4] || (g[4] = (_) => H(_.currentTarget))
                  }, [
                    F(Zo, {
                      status: z(S)(o.value.state)
                    }, null, 8, ["status"]),
                    he(" " + y(P(o.value.state)), 1)
                  ]),
                  p("span", Hv, "since " + y(z(Qn)(z(rn)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", Uv, [
                  g[10] || (g[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", Vv, y(o.value.reason || "Other tasks"), 1),
                  (D = o.value.openers) != null && D.length ? (l(), d("p", zv, "Opens by itself when " + y(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", Gv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", Kv, [
                  g[11] || (g[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", Yv, y(o.value.reason), 1)
                ])) : I("", !0),
                F(iv, {
                  task: o.value,
                  place: r.value,
                  refusal: c.value,
                  onPriority: b
                }, null, 8, ["task", "place", "refusal"]),
                F(yv, {
                  task: o.value,
                  onSelect: g[5] || (g[5] = (_) => a("select", _))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        F(Lv, {
          send: z(m).send,
          count: z(m).comments.value.length,
          onShow: g[7] || (g[7] = (D) => z(m).open.value = !z(m).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", qv, [
        F(yt)
      ])),
      F(H0, {
        ref_key: "footer",
        ref: h,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: w
      }, null, 8, ["id", "row", "read"]),
      u.value ? (l(), G(Yo, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: g[8] || (g[8] = (D) => u.value = null)
      }, {
        default: V(() => [
          F(ms, null, {
            default: V(() => [
              he("Change the status of task " + y(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(Z, null, re(h.value.moves, (D) => (l(), G(ps, {
            key: D.word,
            onClick: (_) => U(D)
          }, {
            default: V(() => [
              he(y(D.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : I("", !0)
    ], 2));
  }
}, ww = /* @__PURE__ */ Y(Jv, [["__scopeId", "data-v-c76befc4"]]);
function Zv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Kn = { exports: {} }, xa;
function Xv() {
  return xa || (xa = 1, (function(e, t) {
    var n = (function() {
      var s = function(g, D) {
        var _ = 236, N = 17, $ = g, E = o[D], v = null, f = 0, C = null, A = [], q = {}, ie = function(T, B) {
          f = $ * 4 + 17, v = (function(x) {
            for (var j = new Array(x), W = 0; W < x; W += 1) {
              j[W] = new Array(x);
              for (var X = 0; X < x; X += 1)
                j[W][X] = null;
            }
            return j;
          })(f), le(0, 0), le(f - 7, 0), le(0, f - 7), Q(), J(), qe(T, B), $ >= 7 && Se(T), C == null && (C = Qo($, E, A)), We(C, B);
        }, le = function(T, B) {
          for (var x = -1; x <= 7; x += 1)
            if (!(T + x <= -1 || f <= T + x))
              for (var j = -1; j <= 7; j += 1)
                B + j <= -1 || f <= B + j || (0 <= x && x <= 6 && (j == 0 || j == 6) || 0 <= j && j <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= j && j <= 4 ? v[T + x][B + j] = !0 : v[T + x][B + j] = !1);
        }, te = function() {
          for (var T = 0, B = 0, x = 0; x < 8; x += 1) {
            ie(!0, x);
            var j = i.getLostPoint(q);
            (x == 0 || T > j) && (T = j, B = x);
          }
          return B;
        }, J = function() {
          for (var T = 8; T < f - 8; T += 1)
            v[T][6] == null && (v[T][6] = T % 2 == 0);
          for (var B = 8; B < f - 8; B += 1)
            v[6][B] == null && (v[6][B] = B % 2 == 0);
        }, Q = function() {
          for (var T = i.getPatternPosition($), B = 0; B < T.length; B += 1)
            for (var x = 0; x < T.length; x += 1) {
              var j = T[B], W = T[x];
              if (v[j][W] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    X == -2 || X == 2 || oe == -2 || oe == 2 || X == 0 && oe == 0 ? v[j + X][W + oe] = !0 : v[j + X][W + oe] = !1;
            }
        }, Se = function(T) {
          for (var B = i.getBCHTypeNumber($), x = 0; x < 18; x += 1) {
            var j = !T && (B >> x & 1) == 1;
            v[Math.floor(x / 3)][x % 3 + f - 8 - 3] = j;
          }
          for (var x = 0; x < 18; x += 1) {
            var j = !T && (B >> x & 1) == 1;
            v[x % 3 + f - 8 - 3][Math.floor(x / 3)] = j;
          }
        }, qe = function(T, B) {
          for (var x = E << 3 | B, j = i.getBCHTypeInfo(x), W = 0; W < 15; W += 1) {
            var X = !T && (j >> W & 1) == 1;
            W < 6 ? v[W][8] = X : W < 8 ? v[W + 1][8] = X : v[f - 15 + W][8] = X;
          }
          for (var W = 0; W < 15; W += 1) {
            var X = !T && (j >> W & 1) == 1;
            W < 8 ? v[8][f - W - 1] = X : W < 9 ? v[8][15 - W - 1 + 1] = X : v[8][15 - W - 1] = X;
          }
          v[f - 8][8] = !T;
        }, We = function(T, B) {
          for (var x = -1, j = f - 1, W = 7, X = 0, oe = i.getMaskFunction(B), ae = f - 1; ae > 0; ae -= 2)
            for (ae == 6 && (ae -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (v[j][ae - ge] == null) {
                  var xe = !1;
                  X < T.length && (xe = (T[X] >>> W & 1) == 1);
                  var ce = oe(j, ae - ge);
                  ce && (xe = !xe), v[j][ae - ge] = xe, W -= 1, W == -1 && (X += 1, W = 7);
                }
              if (j += x, j < 0 || f <= j) {
                j -= x, x = -x;
                break;
              }
            }
        }, ut = function(T, B) {
          for (var x = 0, j = 0, W = 0, X = new Array(B.length), oe = new Array(B.length), ae = 0; ae < B.length; ae += 1) {
            var ge = B[ae].dataCount, xe = B[ae].totalCount - ge;
            j = Math.max(j, ge), W = Math.max(W, xe), X[ae] = new Array(ge);
            for (var ce = 0; ce < X[ae].length; ce += 1)
              X[ae][ce] = 255 & T.getBuffer()[ce + x];
            x += ge;
            var Oe = i.getErrorCorrectPolynomial(xe), Te = u(X[ae], Oe.getLength() - 1), Ts = Te.mod(Oe);
            oe[ae] = new Array(Oe.getLength() - 1);
            for (var ce = 0; ce < oe[ae].length; ce += 1) {
              var Is = ce + Ts.getLength() - oe[ae].length;
              oe[ae][ce] = Is >= 0 ? Ts.getAt(Is) : 0;
            }
          }
          for (var Bs = 0, ce = 0; ce < B.length; ce += 1)
            Bs += B[ce].totalCount;
          for (var Sn = new Array(Bs), Ht = 0, ce = 0; ce < j; ce += 1)
            for (var ae = 0; ae < B.length; ae += 1)
              ce < X[ae].length && (Sn[Ht] = X[ae][ce], Ht += 1);
          for (var ce = 0; ce < W; ce += 1)
            for (var ae = 0; ae < B.length; ae += 1)
              ce < oe[ae].length && (Sn[Ht] = oe[ae][ce], Ht += 1);
          return Sn;
        }, Qo = function(T, B, x) {
          for (var j = h.getRSBlocks(T, B), W = m(), X = 0; X < x.length; X += 1) {
            var oe = x[X];
            W.put(oe.getMode(), 4), W.put(oe.getLength(), i.getLengthInBits(oe.getMode(), T)), oe.write(W);
          }
          for (var ae = 0, X = 0; X < j.length; X += 1)
            ae += j[X].dataCount;
          if (W.getLengthInBits() > ae * 8)
            throw "code length overflow. (" + W.getLengthInBits() + ">" + ae * 8 + ")";
          for (W.getLengthInBits() + 4 <= ae * 8 && W.put(0, 4); W.getLengthInBits() % 8 != 0; )
            W.putBit(!1);
          for (; !(W.getLengthInBits() >= ae * 8 || (W.put(_, 8), W.getLengthInBits() >= ae * 8)); )
            W.put(N, 8);
          return ut(W, j);
        };
        q.addData = function(T, B) {
          B = B || "Byte";
          var x = null;
          switch (B) {
            case "Numeric":
              x = k(T);
              break;
            case "Alphanumeric":
              x = S(T);
              break;
            case "Byte":
              x = P(T);
              break;
            case "Kanji":
              x = L(T);
              break;
            default:
              throw "mode:" + B;
          }
          A.push(x), C = null;
        }, q.isDark = function(T, B) {
          if (T < 0 || f <= T || B < 0 || f <= B)
            throw T + "," + B;
          return v[T][B];
        }, q.getModuleCount = function() {
          return f;
        }, q.make = function() {
          if ($ < 1) {
            for (var T = 1; T < 40; T++) {
              for (var B = h.getRSBlocks(T, E), x = m(), j = 0; j < A.length; j++) {
                var W = A[j];
                x.put(W.getMode(), 4), x.put(W.getLength(), i.getLengthInBits(W.getMode(), T)), W.write(x);
              }
              for (var X = 0, j = 0; j < B.length; j++)
                X += B[j].dataCount;
              if (x.getLengthInBits() <= X * 8)
                break;
            }
            $ = T;
          }
          ie(!1, te());
        }, q.createTableTag = function(T, B) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + B + "px;", x += '">', x += "<tbody>";
          for (var j = 0; j < q.getModuleCount(); j += 1) {
            x += "<tr>";
            for (var W = 0; W < q.getModuleCount(); W += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + T + "px;", x += " height: " + T + "px;", x += " background-color: ", x += q.isDark(j, W) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, q.createSvgTag = function(T, B, x, j) {
          var W = {};
          typeof arguments[0] == "object" && (W = arguments[0], T = W.cellSize, B = W.margin, x = W.alt, j = W.title), T = T || 2, B = typeof B > "u" ? T * 4 : B, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, j = typeof j == "string" ? { text: j } : j || {}, j.text = j.text || null, j.id = j.text ? j.id || "qrcode-title" : null;
          var X = q.getModuleCount() * T + B * 2, oe, ae, ge, xe, ce = "", Oe;
          for (Oe = "l" + T + ",0 0," + T + " -" + T + ",0 0,-" + T + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += W.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ce += ' viewBox="0 0 ' + X + " " + X + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += j.text || x.text ? ' role="img" aria-labelledby="' + dt([j.id, x.id].join(" ").trim()) + '"' : "", ce += ">", ce += j.text ? '<title id="' + dt(j.id) + '">' + dt(j.text) + "</title>" : "", ce += x.text ? '<description id="' + dt(x.id) + '">' + dt(x.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ge = 0; ge < q.getModuleCount(); ge += 1)
            for (xe = ge * T + B, oe = 0; oe < q.getModuleCount(); oe += 1)
              q.isDark(ge, oe) && (ae = oe * T + B, ce += "M" + ae + "," + xe + Oe);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, q.createDataURL = function(T, B) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var x = q.getModuleCount() * T + B * 2, j = B, W = x - B;
          return M(x, x, function(X, oe) {
            if (j <= X && X < W && j <= oe && oe < W) {
              var ae = Math.floor((X - j) / T), ge = Math.floor((oe - j) / T);
              return q.isDark(ge, ae) ? 0 : 1;
            } else
              return 1;
          });
        }, q.createImgTag = function(T, B, x) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var j = q.getModuleCount() * T + B * 2, W = "";
          return W += "<img", W += ' src="', W += q.createDataURL(T, B), W += '"', W += ' width="', W += j, W += '"', W += ' height="', W += j, W += '"', x && (W += ' alt="', W += dt(x), W += '"'), W += "/>", W;
        };
        var dt = function(T) {
          for (var B = "", x = 0; x < T.length; x += 1) {
            var j = T.charAt(x);
            switch (j) {
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
                B += j;
                break;
            }
          }
          return B;
        }, er = function(T) {
          var B = 1;
          T = typeof T > "u" ? B * 2 : T;
          var x = q.getModuleCount() * B + T * 2, j = T, W = x - T, X, oe, ae, ge, xe, ce = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Oe = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Te = "";
          for (X = 0; X < x; X += 2) {
            for (ae = Math.floor((X - j) / B), ge = Math.floor((X + 1 - j) / B), oe = 0; oe < x; oe += 1)
              xe = "█", j <= oe && oe < W && j <= X && X < W && q.isDark(ae, Math.floor((oe - j) / B)) && (xe = " "), j <= oe && oe < W && j <= X + 1 && X + 1 < W && q.isDark(ge, Math.floor((oe - j) / B)) ? xe += " " : xe += "█", Te += T < 1 && X + 1 >= W ? Oe[xe] : ce[xe];
            Te += `
`;
          }
          return x % 2 && T > 0 ? Te.substring(0, Te.length - x - 1) + Array(x + 1).join("▀") : Te.substring(0, Te.length - 1);
        };
        return q.createASCII = function(T, B) {
          if (T = T || 1, T < 2)
            return er(B);
          T -= 1, B = typeof B > "u" ? T * 2 : B;
          var x = q.getModuleCount() * T + B * 2, j = B, W = x - B, X, oe, ae, ge, xe = Array(T + 1).join("██"), ce = Array(T + 1).join("  "), Oe = "", Te = "";
          for (X = 0; X < x; X += 1) {
            for (ae = Math.floor((X - j) / T), Te = "", oe = 0; oe < x; oe += 1)
              ge = 1, j <= oe && oe < W && j <= X && X < W && q.isDark(ae, Math.floor((oe - j) / T)) && (ge = 0), Te += ge ? xe : ce;
            for (ae = 0; ae < T; ae += 1)
              Oe += Te + `
`;
          }
          return Oe.substring(0, Oe.length - 1);
        }, q.renderTo2dContext = function(T, B) {
          B = B || 2;
          for (var x = q.getModuleCount(), j = 0; j < x; j++)
            for (var W = 0; W < x; W++)
              T.fillStyle = q.isDark(j, W) ? "black" : "white", T.fillRect(j * B, W * B, B, B);
        }, q;
      };
      s.stringToBytesFuncs = {
        default: function(g) {
          for (var D = [], _ = 0; _ < g.length; _ += 1) {
            var N = g.charCodeAt(_);
            D.push(N & 255);
          }
          return D;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(g, D) {
        var _ = (function() {
          for (var $ = U(g), E = function() {
            var J = $.read();
            if (J == -1) throw "eof";
            return J;
          }, v = 0, f = {}; ; ) {
            var C = $.read();
            if (C == -1) break;
            var A = E(), q = E(), ie = E(), le = String.fromCharCode(C << 8 | A), te = q << 8 | ie;
            f[le] = te, v += 1;
          }
          if (v != D)
            throw v + " != " + D;
          return f;
        })(), N = 63;
        return function($) {
          for (var E = [], v = 0; v < $.length; v += 1) {
            var f = $.charCodeAt(v);
            if (f < 128)
              E.push(f);
            else {
              var C = _[$.charAt(v)];
              typeof C == "number" ? (C & 255) == C ? E.push(C) : (E.push(C >>> 8), E.push(C & 255)) : E.push(N);
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
        var g = [
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
        ], D = 1335, _ = 7973, N = 21522, $ = {}, E = function(v) {
          for (var f = 0; v != 0; )
            f += 1, v >>>= 1;
          return f;
        };
        return $.getBCHTypeInfo = function(v) {
          for (var f = v << 10; E(f) - E(D) >= 0; )
            f ^= D << E(f) - E(D);
          return (v << 10 | f) ^ N;
        }, $.getBCHTypeNumber = function(v) {
          for (var f = v << 12; E(f) - E(_) >= 0; )
            f ^= _ << E(f) - E(_);
          return v << 12 | f;
        }, $.getPatternPosition = function(v) {
          return g[v - 1];
        }, $.getMaskFunction = function(v) {
          switch (v) {
            case r.PATTERN000:
              return function(f, C) {
                return (f + C) % 2 == 0;
              };
            case r.PATTERN001:
              return function(f, C) {
                return f % 2 == 0;
              };
            case r.PATTERN010:
              return function(f, C) {
                return C % 3 == 0;
              };
            case r.PATTERN011:
              return function(f, C) {
                return (f + C) % 3 == 0;
              };
            case r.PATTERN100:
              return function(f, C) {
                return (Math.floor(f / 2) + Math.floor(C / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(f, C) {
                return f * C % 2 + f * C % 3 == 0;
              };
            case r.PATTERN110:
              return function(f, C) {
                return (f * C % 2 + f * C % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(f, C) {
                return (f * C % 3 + (f + C) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + v;
          }
        }, $.getErrorCorrectPolynomial = function(v) {
          for (var f = u([1], 0), C = 0; C < v; C += 1)
            f = f.multiply(u([1, c.gexp(C)], 0));
          return f;
        }, $.getLengthInBits = function(v, f) {
          if (1 <= f && f < 10)
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
          else if (f < 27)
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
          else if (f < 41)
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
            throw "type:" + f;
        }, $.getLostPoint = function(v) {
          for (var f = v.getModuleCount(), C = 0, A = 0; A < f; A += 1)
            for (var q = 0; q < f; q += 1) {
              for (var ie = 0, le = v.isDark(A, q), te = -1; te <= 1; te += 1)
                if (!(A + te < 0 || f <= A + te))
                  for (var J = -1; J <= 1; J += 1)
                    q + J < 0 || f <= q + J || te == 0 && J == 0 || le == v.isDark(A + te, q + J) && (ie += 1);
              ie > 5 && (C += 3 + ie - 5);
            }
          for (var A = 0; A < f - 1; A += 1)
            for (var q = 0; q < f - 1; q += 1) {
              var Q = 0;
              v.isDark(A, q) && (Q += 1), v.isDark(A + 1, q) && (Q += 1), v.isDark(A, q + 1) && (Q += 1), v.isDark(A + 1, q + 1) && (Q += 1), (Q == 0 || Q == 4) && (C += 3);
            }
          for (var A = 0; A < f; A += 1)
            for (var q = 0; q < f - 6; q += 1)
              v.isDark(A, q) && !v.isDark(A, q + 1) && v.isDark(A, q + 2) && v.isDark(A, q + 3) && v.isDark(A, q + 4) && !v.isDark(A, q + 5) && v.isDark(A, q + 6) && (C += 40);
          for (var q = 0; q < f; q += 1)
            for (var A = 0; A < f - 6; A += 1)
              v.isDark(A, q) && !v.isDark(A + 1, q) && v.isDark(A + 2, q) && v.isDark(A + 3, q) && v.isDark(A + 4, q) && !v.isDark(A + 5, q) && v.isDark(A + 6, q) && (C += 40);
          for (var Se = 0, q = 0; q < f; q += 1)
            for (var A = 0; A < f; A += 1)
              v.isDark(A, q) && (Se += 1);
          var qe = Math.abs(100 * Se / f / f - 50) / 5;
          return C += qe * 10, C;
        }, $;
      })(), c = (function() {
        for (var g = new Array(256), D = new Array(256), _ = 0; _ < 8; _ += 1)
          g[_] = 1 << _;
        for (var _ = 8; _ < 256; _ += 1)
          g[_] = g[_ - 4] ^ g[_ - 5] ^ g[_ - 6] ^ g[_ - 8];
        for (var _ = 0; _ < 255; _ += 1)
          D[g[_]] = _;
        var N = {};
        return N.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return D[$];
        }, N.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return g[$];
        }, N;
      })();
      function u(g, D) {
        if (typeof g.length > "u")
          throw g.length + "/" + D;
        var _ = (function() {
          for (var $ = 0; $ < g.length && g[$] == 0; )
            $ += 1;
          for (var E = new Array(g.length - $ + D), v = 0; v < g.length - $; v += 1)
            E[v] = g[v + $];
          return E;
        })(), N = {};
        return N.getAt = function($) {
          return _[$];
        }, N.getLength = function() {
          return _.length;
        }, N.multiply = function($) {
          for (var E = new Array(N.getLength() + $.getLength() - 1), v = 0; v < N.getLength(); v += 1)
            for (var f = 0; f < $.getLength(); f += 1)
              E[v + f] ^= c.gexp(c.glog(N.getAt(v)) + c.glog($.getAt(f)));
          return u(E, 0);
        }, N.mod = function($) {
          if (N.getLength() - $.getLength() < 0)
            return N;
          for (var E = c.glog(N.getAt(0)) - c.glog($.getAt(0)), v = new Array(N.getLength()), f = 0; f < N.getLength(); f += 1)
            v[f] = N.getAt(f);
          for (var f = 0; f < $.getLength(); f += 1)
            v[f] ^= c.gexp(c.glog($.getAt(f)) + E);
          return u(v, 0).mod($);
        }, N;
      }
      var h = (function() {
        var g = [
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
        ], D = function($, E) {
          var v = {};
          return v.totalCount = $, v.dataCount = E, v;
        }, _ = {}, N = function($, E) {
          switch (E) {
            case o.L:
              return g[($ - 1) * 4 + 0];
            case o.M:
              return g[($ - 1) * 4 + 1];
            case o.Q:
              return g[($ - 1) * 4 + 2];
            case o.H:
              return g[($ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return _.getRSBlocks = function($, E) {
          var v = N($, E);
          if (typeof v > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + E;
          for (var f = v.length / 3, C = [], A = 0; A < f; A += 1)
            for (var q = v[A * 3 + 0], ie = v[A * 3 + 1], le = v[A * 3 + 2], te = 0; te < q; te += 1)
              C.push(D(ie, le));
          return C;
        }, _;
      })(), m = function() {
        var g = [], D = 0, _ = {};
        return _.getBuffer = function() {
          return g;
        }, _.getAt = function(N) {
          var $ = Math.floor(N / 8);
          return (g[$] >>> 7 - N % 8 & 1) == 1;
        }, _.put = function(N, $) {
          for (var E = 0; E < $; E += 1)
            _.putBit((N >>> $ - E - 1 & 1) == 1);
        }, _.getLengthInBits = function() {
          return D;
        }, _.putBit = function(N) {
          var $ = Math.floor(D / 8);
          g.length <= $ && g.push(0), N && (g[$] |= 128 >>> D % 8), D += 1;
        }, _;
      }, k = function(g) {
        var D = a.MODE_NUMBER, _ = g, N = {};
        N.getMode = function() {
          return D;
        }, N.getLength = function(v) {
          return _.length;
        }, N.write = function(v) {
          for (var f = _, C = 0; C + 2 < f.length; )
            v.put($(f.substring(C, C + 3)), 10), C += 3;
          C < f.length && (f.length - C == 1 ? v.put($(f.substring(C, C + 1)), 4) : f.length - C == 2 && v.put($(f.substring(C, C + 2)), 7));
        };
        var $ = function(v) {
          for (var f = 0, C = 0; C < v.length; C += 1)
            f = f * 10 + E(v.charAt(C));
          return f;
        }, E = function(v) {
          if ("0" <= v && v <= "9")
            return v.charCodeAt(0) - 48;
          throw "illegal char :" + v;
        };
        return N;
      }, S = function(g) {
        var D = a.MODE_ALPHA_NUM, _ = g, N = {};
        N.getMode = function() {
          return D;
        }, N.getLength = function(E) {
          return _.length;
        }, N.write = function(E) {
          for (var v = _, f = 0; f + 1 < v.length; )
            E.put(
              $(v.charAt(f)) * 45 + $(v.charAt(f + 1)),
              11
            ), f += 2;
          f < v.length && E.put($(v.charAt(f)), 6);
        };
        var $ = function(E) {
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
        return N;
      }, P = function(g) {
        var D = a.MODE_8BIT_BYTE, _ = s.stringToBytes(g), N = {};
        return N.getMode = function() {
          return D;
        }, N.getLength = function($) {
          return _.length;
        }, N.write = function($) {
          for (var E = 0; E < _.length; E += 1)
            $.put(_[E], 8);
        }, N;
      }, L = function(g) {
        var D = a.MODE_KANJI, _ = s.stringToBytesFuncs.SJIS;
        if (!_)
          throw "sjis not supported.";
        (function(E, v) {
          var f = _(E);
          if (f.length != 2 || (f[0] << 8 | f[1]) != v)
            throw "sjis not supported.";
        })("友", 38726);
        var N = _(g), $ = {};
        return $.getMode = function() {
          return D;
        }, $.getLength = function(E) {
          return ~~(N.length / 2);
        }, $.write = function(E) {
          for (var v = N, f = 0; f + 1 < v.length; ) {
            var C = (255 & v[f]) << 8 | 255 & v[f + 1];
            if (33088 <= C && C <= 40956)
              C -= 33088;
            else if (57408 <= C && C <= 60351)
              C -= 49472;
            else
              throw "illegal char at " + (f + 1) + "/" + C;
            C = (C >>> 8 & 255) * 192 + (C & 255), E.put(C, 13), f += 2;
          }
          if (f < v.length)
            throw "illegal char at " + (f + 1);
        }, $;
      }, w = function() {
        var g = [], D = {};
        return D.writeByte = function(_) {
          g.push(_ & 255);
        }, D.writeShort = function(_) {
          D.writeByte(_), D.writeByte(_ >>> 8);
        }, D.writeBytes = function(_, N, $) {
          N = N || 0, $ = $ || _.length;
          for (var E = 0; E < $; E += 1)
            D.writeByte(_[E + N]);
        }, D.writeString = function(_) {
          for (var N = 0; N < _.length; N += 1)
            D.writeByte(_.charCodeAt(N));
        }, D.toByteArray = function() {
          return g;
        }, D.toString = function() {
          var _ = "";
          _ += "[";
          for (var N = 0; N < g.length; N += 1)
            N > 0 && (_ += ","), _ += g[N];
          return _ += "]", _;
        }, D;
      }, b = function() {
        var g = 0, D = 0, _ = 0, N = "", $ = {}, E = function(f) {
          N += String.fromCharCode(v(f & 63));
        }, v = function(f) {
          if (!(f < 0)) {
            if (f < 26)
              return 65 + f;
            if (f < 52)
              return 97 + (f - 26);
            if (f < 62)
              return 48 + (f - 52);
            if (f == 62)
              return 43;
            if (f == 63)
              return 47;
          }
          throw "n:" + f;
        };
        return $.writeByte = function(f) {
          for (g = g << 8 | f & 255, D += 8, _ += 1; D >= 6; )
            E(g >>> D - 6), D -= 6;
        }, $.flush = function() {
          if (D > 0 && (E(g << 6 - D), g = 0, D = 0), _ % 3 != 0)
            for (var f = 3 - _ % 3, C = 0; C < f; C += 1)
              N += "=";
        }, $.toString = function() {
          return N;
        }, $;
      }, U = function(g) {
        var D = g, _ = 0, N = 0, $ = 0, E = {};
        E.read = function() {
          for (; $ < 8; ) {
            if (_ >= D.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var f = D.charAt(_);
            if (_ += 1, f == "=")
              return $ = 0, -1;
            if (f.match(/^\s$/))
              continue;
            N = N << 6 | v(f.charCodeAt(0)), $ += 6;
          }
          var C = N >>> $ - 8 & 255;
          return $ -= 8, C;
        };
        var v = function(f) {
          if (65 <= f && f <= 90)
            return f - 65;
          if (97 <= f && f <= 122)
            return f - 97 + 26;
          if (48 <= f && f <= 57)
            return f - 48 + 52;
          if (f == 43)
            return 62;
          if (f == 47)
            return 63;
          throw "c:" + f;
        };
        return E;
      }, H = function(g, D) {
        var _ = g, N = D, $ = new Array(g * D), E = {};
        E.setPixel = function(A, q, ie) {
          $[q * _ + A] = ie;
        }, E.write = function(A) {
          A.writeString("GIF87a"), A.writeShort(_), A.writeShort(N), A.writeByte(128), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(255), A.writeByte(255), A.writeByte(255), A.writeString(","), A.writeShort(0), A.writeShort(0), A.writeShort(_), A.writeShort(N), A.writeByte(0);
          var q = 2, ie = f(q);
          A.writeByte(q);
          for (var le = 0; ie.length - le > 255; )
            A.writeByte(255), A.writeBytes(ie, le, 255), le += 255;
          A.writeByte(ie.length - le), A.writeBytes(ie, le, ie.length - le), A.writeByte(0), A.writeString(";");
        };
        var v = function(A) {
          var q = A, ie = 0, le = 0, te = {};
          return te.write = function(J, Q) {
            if (J >>> Q)
              throw "length over";
            for (; ie + Q >= 8; )
              q.writeByte(255 & (J << ie | le)), Q -= 8 - ie, J >>>= 8 - ie, le = 0, ie = 0;
            le = J << ie | le, ie = ie + Q;
          }, te.flush = function() {
            ie > 0 && q.writeByte(le);
          }, te;
        }, f = function(A) {
          for (var q = 1 << A, ie = (1 << A) + 1, le = A + 1, te = C(), J = 0; J < q; J += 1)
            te.add(String.fromCharCode(J));
          te.add(String.fromCharCode(q)), te.add(String.fromCharCode(ie));
          var Q = w(), Se = v(Q);
          Se.write(q, le);
          var qe = 0, We = String.fromCharCode($[qe]);
          for (qe += 1; qe < $.length; ) {
            var ut = String.fromCharCode($[qe]);
            qe += 1, te.contains(We + ut) ? We = We + ut : (Se.write(te.indexOf(We), le), te.size() < 4095 && (te.size() == 1 << le && (le += 1), te.add(We + ut)), We = ut);
          }
          return Se.write(te.indexOf(We), le), Se.write(ie, le), Se.flush(), Q.toByteArray();
        }, C = function() {
          var A = {}, q = 0, ie = {};
          return ie.add = function(le) {
            if (ie.contains(le))
              throw "dup key:" + le;
            A[le] = q, q += 1;
          }, ie.size = function() {
            return q;
          }, ie.indexOf = function(le) {
            return A[le];
          }, ie.contains = function(le) {
            return typeof A[le] < "u";
          }, ie;
        };
        return E;
      }, M = function(g, D, _) {
        for (var N = H(g, D), $ = 0; $ < D; $ += 1)
          for (var E = 0; E < g; E += 1)
            N.setPixel(E, $, _(E, $));
        var v = w();
        N.write(v);
        for (var f = b(), C = v.toByteArray(), A = 0; A < C.length; A += 1)
          f.writeByte(C[A]);
        return f.flush(), "data:image/gif;base64," + f;
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
  })(Kn)), Kn.exports;
}
var Qv = Xv();
const ey = /* @__PURE__ */ Zv(Qv), ty = ["width", "height", "viewBox"], ny = ["width", "height"], sy = ["d"], ay = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = O(() => {
      const s = ey(0, "M");
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
      }, null, 8, ny),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, sy)
    ], 8, ty));
  }
}, kw = /* @__PURE__ */ Y(ay, [["__scopeId", "data-v-489f0852"]]), bw = hr(() => import("./VoiceFigure-CAFSA_oN.js").then((e) => e.V)), $w = "1.0.0", xw = "3.5";
export {
  uy as $,
  Dy as A,
  Je as B,
  zy as C,
  Ry as D,
  Vy as E,
  Ey as F,
  Go as G,
  rg as H,
  ag as I,
  Xy as J,
  wt as K,
  Fy as L,
  Ie as M,
  Et as N,
  jy as O,
  _n as P,
  Py as Q,
  Fp as R,
  No as S,
  Ly as T,
  Uy as U,
  ya as V,
  Um as W,
  Nm as X,
  Qy as Y,
  Gy as Z,
  Y as _,
  ue as a,
  aw as a$,
  cw as a0,
  ve as a1,
  ks as a2,
  dy as a3,
  rd as a4,
  yw as a5,
  _y as a6,
  sn as a7,
  tw as a8,
  ry as a9,
  ws as aA,
  ww as aB,
  Zo as aC,
  at as aD,
  vy as aE,
  bw as aF,
  Ne as aG,
  dl as aH,
  Qn as aI,
  mw as aJ,
  pw as aK,
  gw as aL,
  My as aM,
  $y as aN,
  ky as aO,
  sw as aP,
  Vh as aQ,
  gy as aR,
  nw as aS,
  j1 as aT,
  cy as aU,
  my as aV,
  Ze as aW,
  fy as aX,
  wy as aY,
  yg as aZ,
  lw as a_,
  Bt as aa,
  ke as ab,
  uw as ac,
  $w as ad,
  xw as ae,
  dw as af,
  cs as ag,
  by as ah,
  V1 as ai,
  ps as aj,
  ms as ak,
  Yo as al,
  hy as am,
  Br as an,
  vw as ao,
  py as ap,
  kw as aq,
  iw as ar,
  si as as,
  iy as at,
  xy as au,
  Xg as av,
  Xh as aw,
  yt as ax,
  yy as ay,
  ly as az,
  Xe as b,
  hw as b0,
  Vg as b1,
  l0 as b2,
  So as b3,
  ow as b4,
  nf as b5,
  rw as b6,
  yn as b7,
  fw as b8,
  Ny as c,
  Ay as d,
  Oy as e,
  Cy as f,
  Yy as g,
  To as h,
  qy as i,
  Wy as j,
  Hy as k,
  Jy as l,
  Ty as m,
  Sy as n,
  Iy as o,
  fn as p,
  ew as q,
  Ky as r,
  By as s,
  je as t,
  Dm as u,
  Zy as v,
  Pm as w,
  Cs as x,
  im as y,
  lm as z
};
