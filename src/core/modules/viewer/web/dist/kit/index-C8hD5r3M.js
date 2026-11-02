/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as ye, createElementVNode as p, normalizeClass as te, Fragment as ee, renderList as re, normalizeStyle as $e, defineComponent as Jo, Comment as Zo, h as ms, cloneVNode as Xo, createBlock as G, withCtx as U, unref as z, createVNode as F, toDisplayString as k, createCommentVNode as I, inject as Ce, computed as C, resolveDynamicComponent as lt, Transition as Dt, watch as be, ref as D, shallowRef as mn, TransitionGroup as ka, mergeProps as ot, reactive as gs, createTextVNode as de, onMounted as De, onUnmounted as Ae, nextTick as yt, useId as ba, Teleport as $a, withModifiers as Me, isRef as Is, useModel as zn, withKeys as Tt, withDirectives as rt, vModelText as Gn, mergeModels as Kn, onBeforeUnmount as wt, resolveDirective as Qo, useAttrs as xa, getCurrentInstance as er, getCurrentScope as _a, onScopeDispose as Ma, provide as tr, onErrorCaptured as nr, toHandlers as sr, createSlots as ar, vShow as or, useSlots as rr, defineAsyncComponent as ir } from "vue";
const J = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, lr = { class: "skeleton-line" }, cr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", lr, [
      ye(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: te(["bars", { faded: e.filled }])
      }, [
        (l(!0), d(ee, null, re(e.bars, (s) => (l(), d("span", {
          key: s.width,
          class: te(["bar", { still: e.still }]),
          style: $e({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Qe = /* @__PURE__ */ J(cr, [["__scopeId", "data-v-0ebb6933"]]), vs = Jo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Zo);
      return s.length !== 1 ? ms(ee, { key: n }, s) : s[0].key == null ? Xo(s[0], { key: n }) : s[0];
    };
  }
}), ur = ["aria-label"], dr = ["aria-label"], hr = ["aria-label"], fr = ["aria-label"], pr = ["aria-label"], mr = ["aria-label"], gr = ["aria-label"], vr = {
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
    return (c, u) => (l(), G(vs, { value: e.shape }, {
      messages: U(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), d(ee, null, re(t, (f) => p("div", {
            key: f.id,
            class: te(["skeleton-message", { mine: f.mine }]),
            style: $e({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, ur)
      ]),
      older: U(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(ee, null, re(t.slice(0, 3), (f) => (l(), d("div", {
            key: f.id,
            class: te(["skeleton-message", { mine: f.mine }]),
            style: $e({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, dr)
      ]),
      cards: U(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(ee, null, re(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (l(), d(ee, null, re(n, (g) => F(Qe, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, hr)
      ]),
      file: U(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(ee, null, re(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            F(Qe, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), d(ee, null, re(a, (g) => F(Qe, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, fr)
      ]),
      page: U(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          F(Qe, {
            class: "skeleton-heading",
            bars: i
          }),
          (l(!0), d(ee, null, re(e.count, (f) => (l(), G(Qe, {
            key: f,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, pr)
      ]),
      text: U(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(ee, null, re(e.count, (f) => (l(), G(Qe, {
            key: f,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, mr)
      ]),
      default: U(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(ee, null, re(e.count, (f) => (l(), G(Qe, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, gr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, kt = /* @__PURE__ */ J(vr, [["__scopeId", "data-v-c687fb85"]]), yr = {
  key: 1,
  class: "empty-state titled"
}, wr = { class: "empty-state-title" }, kr = { class: "empty-state-text" }, br = {
  key: 2,
  class: "empty-state"
}, $r = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), G(kt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", yr, [
      p("p", wr, k(e.title), 1),
      p("p", kr, [
        ye(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", br, [
      ye(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, nn = /* @__PURE__ */ J($r, [["__scopeId", "data-v-b27e89b0"]]), xr = { class: "fold-group" }, _r = ["aria-expanded"], Mr = { class: "fold-label" }, Sr = {
  key: 0,
  class: "fold-count"
}, Er = {
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
    return (s, a) => (l(), d("div", xr, [
      p("button", {
        type: "button",
        class: te(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", Mr, k(e.label), 1),
        e.count !== "" ? (l(), d("span", Sr, k(e.count), 1)) : I("", !0),
        p("span", {
          class: te(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, _r),
      e.open ? ye(s.$slots, "default", {}, void 0, !0, 0) : I("", !0)
    ]));
  }
}, Dv = /* @__PURE__ */ J(Er, [["__scopeId", "data-v-9ef1865c"]]), Cr = Symbol("open-view"), Ne = Symbol.for("journal.window-context");
function ys() {
  const e = Ce(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Ar = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Or = /* @__PURE__ */ J(Ar, [["__scopeId", "data-v-eb453d6f"]]), Tr = {
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
    const t = e, n = C(() => {
      var s;
      return t.busy || t.disabled || !!((s = Ce(Ne, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), G(lt(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: te(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: U(() => [
        p("span", {
          class: te(["btn-label", { hidden: e.busy }])
        }, [
          ye(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (l(), G(Or, {
          key: 0,
          class: "btn-spinner"
        })) : I("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, we = /* @__PURE__ */ J(Tr, [["__scopeId", "data-v-a2dc4bda"]]), Br = {
  class: "running",
  "data-running-command": ""
}, Ir = ["title"], Rr = {
  key: "idle",
  class: "running-idle"
}, Lr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", Br, [
      F(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: U(() => [
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, Ir)) : (l(), d("span", Rr, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Nv = /* @__PURE__ */ J(Lr, [["__scopeId", "data-v-d3240219"]]), Dr = ["aria-checked", "aria-label", "title"], Nr = {
  key: 0,
  class: "switch-inner"
}, jr = {
  key: 0,
  class: "switch-word"
}, Pr = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("button", {
      type: "button",
      class: te(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: te(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (l(), d("span", Nr, k(e.word), 1)) : I("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", jr, k(e.word), 1)) : I("", !0)
    ], 10, Dr));
  }
}, jv = /* @__PURE__ */ J(Pr, [["__scopeId", "data-v-1bfb90f3"]]);
function Sa(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Bt(e, t) {
  return Sa(() => localStorage, e, t);
}
function Ea(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function gn(e, t) {
  return Ea(() => localStorage, e, t);
}
function Ca(e, t) {
  be(t, (n) => gn(e, n), { deep: !0 });
}
function qr(e, t) {
  return Sa(() => sessionStorage, e, t);
}
function Wr(e, t) {
  return Ea(() => sessionStorage, e, t);
}
const sn = "journal.environment", Aa = D(qr(sn, Bt(sn, "")));
function Fr(e) {
  Aa.value = e, Wr(sn, e), gn(sn, e);
}
const an = D(location.hash), Rs = mn(null), Ls = { integrations: "mcp", library: "team" };
function Hr() {
  if (!Rs.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ls[n]) {
    location.replace(`#/${[Ls[n], ...s].join("/")}${t ? `?${t}` : ""}`), an.value = location.hash;
    return;
  }
  !n || Rs.value(n) || (Fr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), an.value = location.hash);
}
window.addEventListener("hashchange", () => {
  an.value = location.hash, Hr();
});
const Pe = C(() => {
  const [e, t = ""] = an.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", f = "", g = ""] = i.split(":");
    return { table: u, id: Number(f), comment: Number(g) || 0, env: c };
  });
  return {
    env: Aa.value,
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
}), vn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${vn.page(e)}?open=${t}`
};
function Ur(e = "", t = 0, n = "") {
  location.hash = vn.page(e, t, n);
}
const Vr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Oa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Vr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function Pv(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Ta(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = gt[e]) != null && r.call(gt, t))) return;
  const a = Pe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Oa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function zr(e, t, n, s = 0, a = "") {
  if (e === Pe.value.env) return Ta(t, n, s, a);
  const o = Pe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Oa([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function it(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? zr(s, a, Number(o), 0, t) : Ta(a, Number(o), 0, t);
}
function Gr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function mt(e) {
  const t = Gr(e);
  t && it(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Kr = ["stroke-width", "innerHTML"], ke = {
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
    }, null, 12, Kr));
  }
}, ws = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), G(we, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: U(() => [
        F(ke, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Yr = {
  key: 1,
  class: "row-list-failure"
}, Jr = ["data-row"], Zr = {
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
    const t = e, n = C(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = D(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (l(), G(kt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", Yr, k(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), G(nn, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(ee, { key: 3 }, [
      (l(), G(lt(e.arrival ? ka : "ul"), ot(n.value, { class: "row-list" }), {
        default: U(() => [
          (l(!0), d(ee, null, re(e.rows, (i) => (l(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ye(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Jr))), 128))
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
}, Xr = /* @__PURE__ */ J(Zr, [["__scopeId", "data-v-a096d68d"]]), Qr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, ei = {
  key: 1,
  class: "agent-rows-note"
}, ti = {
  key: 2,
  class: "agent-rows-note"
}, ni = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, si = ["data-agent-row", "onClick"], ai = { class: "agent-row-name" }, oi = { class: "agent-row-state" }, ri = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = C(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", Qr, [
      e.loaded ? e.failure ? (l(), d("p", ei, k(e.failure), 1)) : e.rows.length ? (l(), d(ee, { key: 3 }, [
        p("p", ni, k(s.value) + " running", 1),
        (l(!0), d(ee, null, re(n.value, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(it)(`agents:${r.id}`)
        }, [
          p("span", ai, "#" + k(r.id) + " " + k(r.session), 1),
          p("span", oi, k(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, si))), 128))
      ], 64)) : (l(), d("p", ti, k(e.none), 1)) : (l(), G(kt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, qv = /* @__PURE__ */ J(ri, [["__scopeId", "data-v-a01e5a17"]]), ii = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: te(["badge", e.tone])
    }, k(e.text), 3));
  }
}, Ba = /* @__PURE__ */ J(ii, [["__scopeId", "data-v-9e7e1157"]]), li = ["aria-valuenow", "aria-valuemax"], ci = {
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
    const t = e, n = C(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (l(), d("span", {
      class: te(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: $e({ width: n.value })
      }, null, 4)
    ], 10, li));
  }
}, ui = /* @__PURE__ */ J(ci, [["__scopeId", "data-v-9eba6a85"]]), di = { class: "bars" }, hi = { class: "bar-name" }, fi = { class: "bar-value" }, pi = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = C(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = C(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", di, [
      (l(!0), d(ee, null, re(e.items, (c, u) => (l(), G(lt(c.open ? "button" : "div"), {
        key: `${u}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: te(["bar-row", c.tone, { opens: c.open }]),
        onClick: (f) => c.open && s("open", c.open)
      }, {
        default: U(() => [
          p("span", hi, k(c.label), 1),
          F(ui, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", fi, k(c.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, mi = /* @__PURE__ */ J(pi, [["__scopeId", "data-v-663427f4"]]), gi = { class: "bars" }, vi = {
  key: 0,
  class: "bars-title"
}, yi = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", gi, [
      e.node.title ? (l(), d("span", vi, k(e.node.title), 1)) : I("", !0),
      F(mi, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, wi = /* @__PURE__ */ J(yi, [["__scopeId", "data-v-7135bb11"]]), ki = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = C(() => n[s.node.type](s.node));
    return (r, i) => (l(), d("div", {
      class: te([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: $e(o.value)
    }, [
      (l(!0), d(ee, null, re(e.node.children || [], (c, u) => (l(), G(io, {
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (f) => a("open", f)),
        onFile: i[1] || (i[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Xt = /* @__PURE__ */ J(ki, [["__scopeId", "data-v-d142a3f4"]]), bi = {
  key: 0,
  class: "card-head"
}, $i = { class: "card-title" }, xi = {
  key: 0,
  class: "card-note"
}, _i = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: te(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), d("header", bi, [
        p("span", $i, k(e.node.title), 1),
        e.node.note ? (l(), d("span", xi, k(e.node.note), 1)) : I("", !0)
      ])) : I("", !0),
      F(Xt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Mi = /* @__PURE__ */ J(_i, [["__scopeId", "data-v-67b72d40"]]), Si = (e, t, n) => Math.max(t, Math.min(n, e)), Ei = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, _e = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ds = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", _n = 80;
function Ns(e) {
  return e.length <= _n ? e : `${e.slice(0, _n + 1).replace(/\s+\S*$/, "") || e.slice(0, _n)}…`;
}
const js = {
  messages: (e) => Ns(Ds(e.text)),
  comments: (e) => Ns(Ds(e.text)),
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
}, Ci = (e) => (js[e.table] ? js[e.table](e) : e.title || "") || "", Ai = ["done", "cancelled"], Yn = {
  tasks: (e) => _e(e.completed_at) || (e.state === "cancelled" ? _e(e.updated_at) : 0),
  questions: (e) => e.answer ? _e(e.updated_at) : 0,
  plans: (e) => Ai.includes(e.state) ? _e(e.updated_at) : 0,
  notices: (e) => _e(e.closed_at),
  secrets: (e) => _e(e.deleted_at),
  workers: (e) => e.state === "stopped" ? _e(e.updated_at) : 0,
  shares: (e) => _e(e.stopped_at),
  dumps: (e) => _e(e.completed_at),
  agents: (e) => e.state === "ended" ? _e(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? _e(e.created_at) : 0
}, Oi = (e) => Yn[e.table] ? Yn[e.table](e) : 0, Ia = (e) => Oi(e) > 0, Ti = (e) => !!Yn[e], Ra = (e) => _e(e.created_at), on = (e) => _e(e.updated_at) || Ra(e), Bi = (e) => "task_ids" in e, yn = typeof document < "u" && document.documentElement.classList.contains("phone"), Ii = "Files are attached on the computer; the phone sends text.", La = 1024, Ri = La * 1024 * 1024, Li = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${La} MB limit for one file.`;
function Di() {
  return () => {
  };
}
function Ps(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Ni(e = window) {
  if (!Ps(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ps(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Da = "status.summary", ve = gs({
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
}), ji = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Na = () => !!ve.countdown || ji() || ve.starting;
function Pi(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function qi(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Wi() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Fi(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Wi(), !0);
}
let Ut = { version: "", started: 0 };
function Hi(e) {
  return e.version ? (Ut.version || (Ut = { version: e.version, started: e.started || 0 }), e.version !== Ut.version || (e.started || 0) !== Ut.started) : !1;
}
function Ui(e) {
  qi(e.countdown), Pi(e.ready, e.step), (Fi(!!e.updating, e.step) || !e.updating && !Vi(e) && Hi(e)) && Ni(window);
}
const Vi = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, qs = 2e4, zi = 3e5, Fe = 6e5, Vt = 6, Gi = 500, Ki = "/journal/summary", Ws = yn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Yi = (e) => e.split("?")[0].endsWith(Ki), ja = (e, t) => Object.assign(new Error(t), { status: e });
async function Ji(e, t, n = ja) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Zi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Xi {
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
        headers: { ...Ws, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Zi(s),
        signal: AbortSignal.timeout(a || (i ? zi : qs))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, Gi)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Vt, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Di(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Ji(c, `${c.status} ${c.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ws, signal: AbortSignal.timeout(qs) });
    if (!n.ok) throw ja(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Vt, o).then((c) => (this.written(n), c));
    if (Na() && !Yi(n))
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
const je = new Xi(), Ee = (e) => encodeURIComponent(e);
function he(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const xt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), _t = "the page does not know its environment yet", Qi = "X-Journal-Env", el = "X-Journal-Request-At", Mn = "/viewer/voices/figures/";
class ks {
  constructor({ env: t = () => Pe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ks({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [el]: String(Date.now()), ...this.env() ? { [Qi]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === _t ? Promise.reject(new Error(_t)) : je.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === _t ? Promise.reject(new Error(_t)) : je.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : _t;
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
    return this.get(`/updates/changelog${he({ skip: t })}`);
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
    return this.get(this.here(`/entries${he({ since: t, last: n })}`));
  }
  stream(t = 0) {
    const n = t ? `?since=${t}` : "";
    return je.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: c = !1, docked: u = !1 } = {}) {
    const f = this.here(`/${t}${he({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: c ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(f, `${t}.${xt({ before: s, after: a, since: o, ids: r, tasks: i, closed: c, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${he({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${xt({ before: s, since: a, docked: o })}`);
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
    if (yn) return Promise.reject(Object.assign(new Error(Ii), { status: 403 }));
    if (s.size > Ri) return Promise.reject(new Error(Li(s)));
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
    return this.get(this.here(`/messages${he({ on: t })}`), "messages.on");
  }
  // every row and conversation line here that holds all the words
  search(t, { models: n = [], conversations: s = !1 } = {}) {
    const a = { words: t, models: n.join(","), conversations: s ? 1 : "" };
    return this.get(this.here(`/search${he(a)}`));
  }
  // the documents a search finds, best first, and the files attached to messages, a page at a time
  locateDocs(t) {
    return this.get(this.here(`/docs/search${he({ words: t })}`));
  }
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: o }) {
    return this.get(this.here(`/attachments${he({ file_type: t, shelf: n, search: s, last: a, skip: o })}`));
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
    return this.get(`/agents/controls/${Ee(t)}${he({ model: n, effort: s })}`);
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
    return this.get(this.here(`${a}${he(s)}`), `${a}.${xt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${he(n)}`), `/verifiers/${t}/transcript.${xt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${he(n)}`), `/workers/${t}/transcript.${xt(n)}`);
  }
  edits(t, n, s = {}) {
    return this.get(this.here(`/agents/${t}/edits${he({ since: n, ...s })}`));
  }
  editedText(t, n) {
    return this.get(this.here(`/agents/${t}/edits/text${he({ edit: n })}`));
  }
  editedImageUrl(t, n) {
    return this.address(`/agents/${t}/edits/image${he({ edit: n })}`);
  }
  terminal(t, n = 0) {
    return this.get(this.here(`/agents/${t}/terminal${he({ after: n })}`));
  }
  // who the viewer is and who else is on the journal, so it says you only for its own person
  people() {
    return this.get("/people");
  }
  // whether this journal is connected to a team, and as whom; the one team, or the team named
  team(t = "") {
    return this.get(`/team${he({ team: t })}`);
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
    return this.get(`/team/devices${he({ team: t })}`);
  }
  revokeTeamDevice(t, n = "") {
    return this.post("/team/revoke", { device: t, team: n });
  }
  teamPeople(t = "") {
    return this.get(`/team/people${he({ team: t })}`);
  }
  // changes this person's own password on the team
  changeTeamPassword(t, n, s = "") {
    return this.post("/team/password", { old: t, new: n, team: s });
  }
  // the library's items, each with its newest version and the version this journal imported, by kind and words
  libraryItems(t, n, s = "") {
    return this.get(`/library/items${he({ type: t, search: n, team: s })}`);
  }
  // one library item with every version and its note, and the version this journal imported
  libraryItem(t, n, s = "") {
    return this.get(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}${he({ team: s })}`);
  }
  // every copy here that came from the library, with the version it came from and the row or file it is
  libraryCopies(t = "") {
    return this.get(`/library/copies${he({ team: t })}`);
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
    const a = this.here(`/outputs/${t}${he({ after: n, before: s })}`);
    return this.get(a, a);
  }
  activeCards(t) {
    return this.get(this.here(`/cards/active?ids=${t.join(",")}`));
  }
  // skills and voices
  skills(t = 0) {
    return this.get(this.here(`/skills${he({ agent: t })}`));
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
    return je.request("GET", Mn + "figures.json");
  }
  voiceFigureUrl(t) {
    return Mn + t;
  }
  figureDecoderUrl() {
    return Mn + "draco/";
  }
  // the project's files
  projectFiles(t = "") {
    return this.get(this.here(`/project-files${he({ folder: t })}`));
  }
  findFiles(t) {
    return this.get(this.here(`/project-files/find${he({ q: t })}`));
  }
  projectFile(t) {
    return this.get(this.here(`/project-files/file${he({ path: t })}`));
  }
  projectFileUrl(t) {
    return this.address(`/project-files/raw${he({ path: t })}`);
  }
  fileDiff(t) {
    return this.get(this.here(`/project-files/diff${he({ path: t })}`));
  }
  // the project's repository
  gitBranches(t = 0, n = 30) {
    return this.get(this.here(`/git/branches${he({ skip: t, last: n })}`));
  }
  gitCommits(t = 0, n = 30) {
    return this.get(this.here(`/git/commits${he({ skip: t, last: n })}`));
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
    return this.get(this.here(`/plugins/${t}/log${he({ lines: n })}`));
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
    return `${this.base}/${t ? `?env=${Ee(t)}` : ""}${vn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ce = new ks({ base: yn ? "/p" : "" }), tl = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ce.base.length).split("/")[2]);
}), nl = { claude: "Claude Code", codex: "Codex" };
Object.entries(nl).map(([e, t]) => ({ key: e, label: t }));
const Fs = (e) => e.status === "stopped" ? 1 : 0, sl = "main", al = (e) => e.filter((t) => t.role === sl).sort((t, n) => Fs(t) - Fs(n) || _e(n.heard_at) - _e(t.heard_at))[0] || null, ol = { me: 1, people: [] }, Y = gs({
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
  people: ol,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Bt("journal.activity", !0),
  wide: !1,
  sideMini: Bt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ca("journal.activity", () => Y.activity);
Ca("journal.side.mini", () => Y.sideMini);
const vt = C(() => al(Y.agents));
C(() => !!vt.value && Y.live.some((e) => e.agent.session === vt.value.session && e.environment === Pe.value.env));
C(() => !!vt.value && ["busy", "working"].includes(vt.value.status));
function rl(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Jn(e) {
  const t = rl(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Pa(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Hs(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const Sn = (e) => String(e).padStart(2, "0");
function il(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Sn(t % 60)}s` : `${Math.floor(t / 3600)}h ${Sn(Math.floor(t % 3600 / 60))}m ${Sn(t % 60)}s`;
}
const ll = ["working", "busy", "waiting", "compacting"], cl = (e) => ll.includes(e), ul = "builder";
C(() => !Y.settings || Y.settings.features.file_feed !== !1);
const dl = C(() => !Y.settings || Y.settings.features.status_bar !== !1);
C(() => Y.settings && Y.settings.workers && Y.settings.workers.mode || ul);
C(() => !Y.settings || !Y.settings.tasks || Y.settings.tasks.auto !== !1);
C(() => !!(Y.settings && Y.settings.reviewing && Y.settings.reviewing.reviewer));
C(() => !Y.settings || Y.settings.features.sharing !== !1);
const rn = 50, bs = 100, hl = { messages: 25 }, Le = (e) => hl[e] || rn;
function fl(e, t) {
  if (e !== "messages") return Math.max(t.length - Le(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Le(e)) return s;
  return 0;
}
const pl = "review_step", ml = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === pl).sort((t, n) => t.id - n.id), gl = 5, vl = 500, yl = 3e3, wl = () => Y.entries.length ? Y.entries[Y.entries.length - 1].id : 0, Qt = { env: "", id: 0 }, kl = () => !!(Y.bar && Y.bar.length) || cl(vt.value && vt.value.status);
function bl({ session: e }) {
  return (e ? ce.chat(e, { docked: !0 }) : ce.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function $l() {
  return ce.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ce.chat(t.session, { limit: bs })))).then(ml);
}
function xl() {
  return Qt.env !== ce.env() && Object.assign(Qt, { env: ce.env(), id: wl() }), ce.entries(Qt.id);
}
function _l(e) {
  e.length && (Qt.id = e[e.length - 1].id, mc(e));
}
async function Ml({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", rn);
}
const Zn = /* @__PURE__ */ new Map();
async function Xn(e, t) {
  const n = `${e}:${ce.env()}`, s = Zn.get(n);
  if (!s) return Us(n, (await ce.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(on)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ce.list("workers", { limit: t, since: a, after: o });
  if (!r.is_last_page)
    return Zn.delete(n), Xn(e, t);
  const i = new Set(r.rows.map((c) => c.id));
  return Us(
    n,
    [...s.filter((c) => !i.has(c.id)), ...r.rows].sort((c, u) => c.id - u.id)
  );
}
const Us = (e, t) => (Zn.set(e, t), t);
async function Vs(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const zs = Object.freeze({
  "status.bar": {
    read: () => ce.bar(),
    every: () => kl() ? vl : yl,
    take: (e) => Array.isArray(e) && (Y.bar = e),
    active: () => dl.value
  },
  "agents.index": { read: () => Vs(ce, gl), every: 1e3, take: (e) => Y.agents = e.rows },
  "agents.live": { read: () => ce.liveAgents(), every: 5e3, take: (e) => Y.live = e },
  "status.summary": {
    read: () => ce.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      Y.summary = e, Ui(e);
    }
  },
  "journal.manifest": { read: () => ce.manifest(), every: 3e4, take: (e) => Y.spec = e },
  "journals.index": { read: () => ce.journals(), every: 1e4, take: (e) => Y.journals = e },
  "people.index": { read: () => ce.people(), every: 3e4, take: (e) => e && e.people && (Y.people = e) },
  "entries.recent": { read: xl, every: 1e3, take: _l },
  "outputs.running": { read: () => ce.runningOutputs(), every: 3e3 },
  "messages.docked": { read: bl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ce.mcp(), every: 3e4 },
  "developer.readers": { read: () => ce.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Xn("workers.index", Le("workers")), every: 5e3 },
  "workers.activity": { read: () => ce.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Xn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ce.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ce.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: $l, every: 3e3 },
  "tests.turns": { read: () => ce.list("test_turns", { limit: Le("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ce.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ce.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ce.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ce.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: Ml, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Vs(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: rn }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: rn }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), Sl = 6e4, El = 3e3, Cl = 4, Al = 300, Ol = 5e3, qa = /* @__PURE__ */ new Map();
function wn(e) {
  if (!(e in zs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return zs[e];
}
function Tl(e) {
  const t = wn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Ol;
  }
}
const Bl = (e) => e / 2 + Math.random() * e / 2, Wa = (e) => [...e.users.values()].pop(), $s = (e) => qa.get(e.place) === e, Il = () => Math.random() * Al, xs = () => document.hidden;
function Rl(e) {
  const t = Tl(e);
  return e.failures ? Bl(Math.min(e.key === Da ? El : Sl, t * 2 ** e.failures)) : Math.max(t, Cl * e.took);
}
function Fa(e, t) {
  clearTimeout(e.timer), !(!$s(e) || e.paused || xs()) && (e.timer = setTimeout(() => Ll(e), t));
}
function Ll(e) {
  return $s(e) ? e.running ? (e.again = !0, e.running) : (e.running = Pl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Dl = (e) => {
  var t, n;
  return !e.paused && !xs() && (((n = (t = wn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Wa(e).active() && (!Na() || e.key === Da);
};
async function Nl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => wn(e.key).read(Wa(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function jl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = wn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Pl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Dl(e) && jl(e, await Nl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && $s(e) && !e.paused);
  Fa(e, Rl(e));
}
const ql = () => xs() || qa.forEach((e) => Fa(e, Il()));
document.addEventListener("visibilitychange", ql);
const Wl = 60, Fl = (e, t) => _e(e.created_at) >= _e(t.created_at) - Wl, Hl = (e, t) => e.id > 0 && e.table === t.table && Fl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), _s = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Hl(s, n))), En = [
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
}), Nt = {
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
    filters: En
  }),
  tasks: fe("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: En
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
  notices: fe("Notice", "band", "One line pinned to the chat while it matters", { filters: En }),
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
}, Ul = ["secrets", "plugins"], Ha = Object.keys(Nt).filter((e) => !(yn && Ul.includes(e)));
C(() => Ha.map((e) => ({ name: e, ...Nt[e] })));
const jt = (e) => Nt[e], Ua = new Map(Ha.flatMap((e) => [e, e.replace(/s$/, ""), Nt[e].title.toLowerCase()].map((t) => [t, e]))), at = (e) => Ua.get(String(e).toLowerCase()) || "", Va = [...Ua.keys()].sort((e, t) => t.length - e.length).join("|"), Xe = /* @__PURE__ */ new Set(), Ms = D(0), Pt = /* @__PURE__ */ new Set(), qt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Qn = /* @__PURE__ */ new Set(), Vl = /* @__PURE__ */ new Map(), zl = /* @__PURE__ */ new Map();
let pt = !1, Mt = null;
const Gl = (e, t) => e.id - t.id, Kl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Yl = { messages: Kl }, za = (e) => Yl[e] || Gl;
function Ga(e) {
  return Ms.value, Xe.has(e) || (Xe.add(e), Y.booted && (!Pt.has(e) || qt.has(e)) && queueMicrotask(() => bn([e], !1))), Y.rows[e] || [];
}
function Jl(e) {
  const t = Y.rows[e] || [], n = fl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  Y.rows[e] = t.filter((a) => s.has(a) || Ti(e) && !Ia(a)), Y.paging.size[e] = Le(e), Y.paging.more[e] = !0;
}
const Zl = /* @__PURE__ */ new Set();
function Xl() {
  Xe.forEach(Jl), Xe.clear(), Vl.clear(), zl.clear(), Ms.value += 1;
}
be(() => `${Pe.value.env}/${Pe.value.page}/${Pe.value.open ? Pe.value.open.table : ""}`, Xl);
be(
  () => Y.booted,
  (e) => e && bn(
    [...Xe].filter((t) => !Pt.has(t)),
    !1
  )
);
const es = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Bi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Ka(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (es(s) && !es(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Ya(e, t) {
  Pt.add(e), Ms.value += 1;
  const n = Y.rows[e] || [];
  Y.rows[e] = [...Ka(n, t.rows), ..._s(n.filter((s) => s.id === 0), t.rows)], Y.paging.size[e] = Y.paging.size[e] || Le(e), Y.paging.more[e] = !t.is_last_page;
}
async function Ql(e) {
  const t = new Set((Y.rows[e] || []).map((o) => o.id)), n = await ce.list(e, { limit: Le(e) });
  kn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = _s((Y.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Ya(e, { ...n, rows: [...n.rows, ...a].sort(za(e)) }), Y.paging.size[e] = Le(e), Ja.has(e) && await Za(e), Y.rows[e];
}
const kn = (e, t) => Y.counts = { ...Y.counts, [e]: t };
async function ec(e) {
  const t = Y.rows[e] || [], n = Math.max(0, ...t.map(on)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ce.list(e, { limit: Le(e), since: n, after: s });
  if (kn(e, a.counts), !a.is_last_page) return Ql(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = _s(t.filter((i) => !o.has(i.id)), a.rows).concat(Ka(t, a.rows));
  return Y.rows[e] = r.sort(za(e)), Y.paging.size[e] = Y.rows[e].length, Y.rows[e];
}
const Cn = /* @__PURE__ */ new Set();
async function tc(e, t = !1) {
  e.forEach((n) => qt.delete(n)), e.forEach((n) => Qn.add(n));
  try {
    await lc(e, t);
  } finally {
    e.forEach((n) => Qn.delete(n));
  }
}
async function nc(e) {
  const t = await ce.list(e, { limit: Le(e) });
  kn(e, t.counts), Ya(e, t);
}
async function sc(e) {
  kn(e, (await ce.list(e, { limit: 1, closed: !0 })).counts);
}
const Ja = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Za(e) {
  const t = (Y.rows[e] || []).filter((a) => es(a) && (e !== "plans" || !Ia(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ce.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  Y.rows[e] = (Y.rows[e] || []).map((a) => s.get(a.id) || a);
}
const ac = (e, t) => !Pt.has(e) || t && (Y.paging.size[e] || Le(e)) === Le(e) && !Zl.has(e);
async function oc(e, t) {
  if (!Xe.has(e)) return sc(e);
  const n = await (ac(e, t) ? nc(e) : ec(e));
  return Ja.has(e) && await Za(e), n;
}
async function rc() {
  const [e, t] = await Promise.all([ce.entries(0, bs), ce.settings()]);
  eo([...Bt(Qa(), []), ...e]), JSON.stringify(t) !== JSON.stringify(Y.settings) && (Y.settings = t);
}
const ic = (e, t) => oc(e, t).then(
  () => null,
  () => e
);
async function lc(e, t) {
  const n = (await Promise.all(e.map((s) => ic(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), qt.add(s))), t && await rc(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Xa = 1e3, cc = 15e3;
let zt = Xa;
async function uc() {
  return Mt || (Mt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !Cn.has(e)) || pt; ) {
      const e = pt, t = [...e ? Object.keys(Y.rows) : Ke].filter((s) => Nt[s] && (Xe.has(s) || s in Y.rows)).filter((s) => e || !Xe.has(s) || qt.has(s) || !Pt.has(s)).filter((s) => !Cn.has(s)), n = [...Ke].filter((s) => Cn.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), pt = !1;
      try {
        await tc(t, e), zt = Xa;
      } catch {
        pt = pt || e, await new Promise((a) => setTimeout(a, zt)), zt = Math.min(zt * 2, cc);
      }
    }
  })().finally(() => Mt = null), Mt);
}
function bn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Qn.has(n)).forEach((n) => {
    Ke.add(n), t && qt.add(n);
  }), Ke.has("settings") && (pt = !0), uc();
}
const Qa = () => {
  var e;
  return `typed-entries:${((e = Y.identity) == null ? void 0 : e.root) || location.host}:${ce.env()}`;
};
function eo(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  Y.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-bs), gn(Qa(), Y.entries.slice(-50));
}
const dc = ["created", "updated", "deleted"], hc = { phases: ["phases", "plans"] }, ts = (e) => hc[e] || [e], fc = (e) => dc.includes(e.entry_type) ? [...ts(e.data.table), ...(e.data.joins || []).flatMap(ts)] : [];
function pc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of ts(t.data.table).filter((s) => Y.rows[s]))
      Y.rows[n] = Y.rows[n].filter((s) => s.id !== t.data.id);
}
function mc(e) {
  eo([...Y.entries, ...e]), pc(e), bn([...new Set(e.flatMap(fc))].filter((t) => t && t !== "agents"));
}
tl((e) => Y.streamOpen || bn([e]));
const ns = [], gc = 2e3, Ge = /* @__PURE__ */ new Map(), vc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, yc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ct(e, { first: t = !1 } = {}) {
  t ? ns.unshift(e) : ns.push(e), Ge.clear();
}
function to(e, t, n) {
  var a;
  const s = Ga(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const wc = (e) => Ga(e.table).find((t) => t.id === e.id) === e.row, kc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function bc(e, t) {
  const n = [{ kind: "text", text: Ue(e).replace(/\r\n/g, `
`) }];
  for (const s of ns)
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
  return $c(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function $c(e) {
  return e.split(yc).map((t, n) => n % 2 ? t : t.replace(vc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Gs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function xc(e) {
  const [t, , ...n] = e, s = Gs(t).map((o) => `<th>${It(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Gs(o).map((r) => `<td>${It(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function _c(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${It(a)}</li>`).join("")}</${s}>`;
}
const Ks = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function no(e) {
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
      n.push(`<h${i}>${It(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ks(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(xc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(_c(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${no(
          t.slice(s, i).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Ks(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${It(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Mc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Sc = (e) => e.kind !== "text" && !Mc.test(e.html);
function Ec(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(no(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Sc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ss(e, t = { env: "" }) {
  const n = kc(e, t), s = Ge.get(n);
  if (Ge.delete(n), s && s.reads.every(wc))
    return Ge.set(n, s), s.html;
  const a = [], o = Ec(bc(e, { ...t, reads: a }));
  return Ge.set(n, { html: o, reads: a }), Ge.size > gc && Ge.delete(Ge.keys().next().value), o;
}
const so = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, ln = (e) => String(e || "").replace(so, (t, n, s, a) => a), Cc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Gt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Ac = /^Traceback \(most recent call last\):/m, Oc = 8;
function ao(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Oc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Tc(e) {
  const t = [...e.matchAll(Cc)].map((s) => s.index);
  if (Gt.lastIndex = 0, !t.length || !Gt.test(e)) return null;
  Gt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Gt)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: ao(n), tail: "" } : null;
}
function Bc(e) {
  const t = Ac.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: ao([o]), tail: n.slice(a).join(`
`) };
}
ct((e) => {
  const t = ln(e), n = Bc(t) || Tc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const as = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Ic = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Rc = `${as} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Lc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Dc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ys = {
  js: { keywords: as, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Ic, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Rc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: as, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Lc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Dc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Js(e, t, n) {
  return n && e.startsWith(n, t);
}
function Nc(e, t) {
  const n = Ys[t] || Ys.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Js(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Js(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], g = n.lower ? f.toLowerCase() : f, b = n.property && /^\s*:/.test(e.slice(o + f.length));
      r(s.has(g) ? "keyword" : b ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function jc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Nc(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Ue(r) : `<span class="tok-${s}">${Ue(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Pc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const qc = 1500, Zs = /* @__PURE__ */ new WeakMap();
async function Wc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Pc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Zs.get(t)), Zs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, qc)
  )));
}
typeof document < "u" && document.addEventListener("click", Wc, !0);
const Fc = /^(```|~~~)\s*(\w+)?\s*$/, Hc = /^\s{4,}\S/, Uc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Vc = /^\s*(?:[-*+]|\d+[.)])\s/, oo = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, zc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ro(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Gc(e) {
  const t = ro(e.join(`
`));
  return (zc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Kc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && oo.test(t) && !Vc.test(t);
};
function Xs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${jc(ro(e.join(`
`)), t || Gc(e)).join(`
`)}</code></pre></div>` };
}
function Yc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Fc);
    if (r) {
      const c = t.findIndex((f, g) => g > o && f.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Xs(t.slice(o + 1, u).map(ln), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Kc(s) ? Uc : Hc;
    if (i.test(t[o])) {
      let c = o;
      for (; c < t.length && (i.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && oo.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (c - o + u.length >= 2) {
        a(), n.push(Xs([...u, ...t.slice(o, c)].map(ln), "")), o = c;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ct((e) => Yc(e));
const Jc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Zc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Xc(e) {
  const t = Jc.exec(e);
  if (t && at(t[1])) return { at: t.index, length: t[0].length, table: at(t[1]), id: Number(t[2]), label: t[3] };
  const n = Zc.exec(e), s = n && at(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Qc(e, t, n, s) {
  const a = to(s, e, t), o = ln(a ? Ci(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(jt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
ct(
  (e, t) => {
    const n = Xc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Qc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const eu = /\.(png|jpe?g|gif|webp|svg)$/i, tu = (e) => eu.test(e), nu = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, su = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function au(e, t) {
  const n = nu.exec(e), [, s, a, o, r, i] = n || [], c = n && at(s || o), u = c && to(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const f = ce.in(t.env).fileUrl(c, u.id, i), g = `${jt(c).title} ${u.id} · ${Ue(i)}`, b = tu(i) ? `<img class="file-card-image" src="${f}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Ue(i)}">${b}<span class="file-card-name">${g}</span></a>` };
}
function ou(e) {
  const t = su.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ct(
  (e, t) => {
    if (t.inline) return null;
    const n = au(e, t) || ou(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const ru = /`([^`\n]+)`/g;
ct((e) => e.replace(ru, (t, n) => `<code>${n}</code>`));
const Qs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${vn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ct(
  (e, t) => e.replace(so, (n, s, a, o) => Qs[s] ? Qs[s](a, o, t) : o)
);
const iu = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, lu = new RegExp(`\\b(${Va}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), cu = new RegExp(`\\b(${Va}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), uu = (e, t) => `<a class="row-pill" href="#" data-peek="${at(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, du = (e) => e.replace(cu, (t, n, s) => s.replace(/\d+/g, (a) => uu(n.replace(/s$/i, ""), a))), hu = (e) => du(e).replace(
  lu,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${at(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
ct(
  (e, t) => t.rowNames === !1 ? e : e.split(iu).map((n, s) => s % 2 ? n : hu(n)).join("")
);
const fu = ["innerHTML"], pu = ["innerHTML"], mu = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = C(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = ss(s, { env: Pe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(mt) && z(mt)(...o)),
      innerHTML: n.value
    }, null, 8, fu)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(mt) && z(mt)(...o)),
      innerHTML: n.value
    }, null, 8, pu));
  }
}, st = /* @__PURE__ */ J(mu, [["__scopeId", "data-v-1a43d211"]]), gu = { class: "fact" }, vu = { class: "fact-label" }, yu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", gu, [
      p("span", vu, k(e.label), 1),
      F(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, wu = /* @__PURE__ */ J(yu, [["__scopeId", "data-v-3a88ecf8"]]), ku = { class: "list" }, bu = { class: "list-label" }, $u = {
  key: 1,
  class: "list-note"
}, xu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", ku, [
      (l(!0), d(ee, null, re(e.items, (o, r) => (l(), G(lt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: te(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: U(() => [
          p("span", bu, k(o.label), 1),
          o.badge ? (l(), G(Ba, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : I("", !0),
          o.note ? (l(), d("span", $u, k(o.note), 1)) : I("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, _u = /* @__PURE__ */ J(xu, [["__scopeId", "data-v-ebe2ae0a"]]), Mu = { class: "table" }, Su = {
  key: 0,
  class: "table-row empty"
}, Eu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = C(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", Mu, [
      p("div", {
        class: "table-row head",
        style: $e(a.value)
      }, [
        (l(!0), d(ee, null, re(e.columns, (i) => (l(), d("span", {
          key: i,
          class: "cell"
        }, k(i), 1))), 128))
      ], 4),
      (l(!0), d(ee, null, re(e.rows, (i, c) => (l(), G(lt(i.open ? "button" : "div"), {
        key: c,
        type: i.open ? "button" : void 0,
        class: te(["table-row", i.tone, { opens: i.open }]),
        style: $e(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: U(() => [
          (l(!0), d(ee, null, re(i.cells, (u, f) => (l(), d("span", {
            key: f,
            class: "cell"
          }, k(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), d("div", Su, k(e.empty), 1)) : I("", !0)
    ]));
  }
}, Cu = /* @__PURE__ */ J(Eu, [["__scopeId", "data-v-9326a52e"]]), Au = { class: "stat-value" }, Ou = { class: "stat-label" }, Tu = {
  key: 0,
  class: "stat-note"
}, Bu = {
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
      class: te(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: U(() => [
        p("span", Au, k(e.value), 1),
        p("span", Ou, k(e.label), 1),
        e.note ? (l(), d("span", Tu, k(e.note), 1)) : I("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Iu = /* @__PURE__ */ J(Bu, [["__scopeId", "data-v-ad0db6d6"]]), Ru = { class: "code" }, Lu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (l(), G(vs, {
      value: e.node.type
    }, {
      stack: U(() => [
        F(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: U(() => [
        F(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: U(() => [
        F(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: U(() => [
        F(Mi, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: U(() => [
        p("h3", {
          class: te(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: U(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: U(() => [
        F(Iu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: U(() => [
        F(wi, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: U(() => [
        F(Cu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: U(() => [
        F(_u, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: U(() => [
        F(st, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: U(() => [
        F(wu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: U(() => [
        F(Ba, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: U(() => [
        p("pre", Ru, [
          p("code", null, k(e.node.text), 1)
        ])
      ]),
      file: U(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, k(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), io = /* @__PURE__ */ J(Lu, [["__scopeId", "data-v-cbdcf540"]]), Du = { class: "dashboard" }, Nu = { class: "trail" }, ju = ["onClick"], Pu = {
  key: 0,
  class: "gone",
  role: "status"
}, qu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (b) => b in (n.document.pages || {}), o = D(!!n.page && !a(n.page)), r = D(n.page && !o.value ? [n.page] : []), i = C(() => r.value.at(-1) || n.document.start), c = C(() => (n.document.pages || {})[i.value] || null), u = (b) => ((n.document.pages || {})[b] || {}).title || b, f = (b) => {
      o.value = !1, r.value = [...r.value, b];
    }, g = (b) => {
      o.value = !1, r.value = r.value.slice(0, b);
    };
    return be(
      () => n.document.start,
      () => r.value = []
    ), (b, _) => (l(), d("div", Du, [
      e.document.broken ? (l(), G(nn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: U(() => [
          de(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), G(nn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: U(() => [
          de(k(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(ee, { key: 2 }, [
        p("nav", Nu, [
          p("button", {
            type: "button",
            class: te(["step", { current: !r.value.length }]),
            onClick: _[0] || (_[0] = (A) => g(0))
          }, k(u(e.document.start)), 3),
          (l(!0), d(ee, null, re(r.value, (A, N) => (l(), d(ee, {
            key: `${N}-${A}`
          }, [
            _[2] || (_[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: te(["step", { current: N === r.value.length - 1 }]),
              onClick: (w) => g(N + 1)
            }, k(u(A)), 11, ju)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Pu, "What you opened is no longer in this dashboard. Here is its start page.")) : I("", !0),
        F(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: U(() => [
            (l(), d("div", {
              key: i.value,
              class: "page"
            }, [
              F(io, {
                node: c.value.view,
                onOpen: f,
                onFile: _[1] || (_[1] = (A) => s("file", A))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : I("", !0)
    ]));
  }
}, Wv = /* @__PURE__ */ J(qu, [["__scopeId", "data-v-fbe83734"]]);
function Wu(e, t, n, s = () => window) {
  De(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Fu = (e, t = () => !0) => Wu("keydown", (n) => n.key === "Escape" && t() && e());
function Hu(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = D(!1), a = C(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Fu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Uu = 80, ht = gs([]);
function Vu(e) {
  const t = Symbol("layer"), n = () => ht.includes(t) && ht.splice(ht.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !ht.includes(t) && ht.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), C(() => Uu + Math.max(0, ht.indexOf(t)));
}
let lo = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return lo = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const zu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Gu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(zu)];
    if (!r.length) return o.preventDefault();
    const [i, c] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  De(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : lo, document.addEventListener("keydown", a), yt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Ku = ["aria-modal", "aria-label", "aria-labelledby"], Yu = {
  key: 0,
  class: "dialog-head"
}, Ju = ["id", "tabindex"], Zu = {
  key: 1,
  class: "dialog-foot"
}, Xu = 500, Qu = 400, ed = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Hu(s, n), i = Vu(a), c = D(null), u = D(null), f = D(null), g = ba(), b = D(!1), _ = Date.now();
    n.modal && Gu(u, () => s("escape"), f);
    function A() {
      if (!n.modal) return n.closable && o();
      b.value = !0, setTimeout(() => b.value = !1, Qu);
    }
    function N(H) {
      !n.modal || Date.now() - _ >= Xu || ![" ", "Enter"].includes(H.key) || (H.preventDefault(), H.stopPropagation());
    }
    const w = () => c.value && (c.value.scrollTop = c.value.scrollHeight), M = new MutationObserver(w);
    return be(c, (H) => {
      M.disconnect(), H && n.follow && (M.observe(H, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Ae(() => M.disconnect()), (H, V) => (l(), G($a, { to: "body" }, [
      F(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: U(() => [
          z(a) ? (l(), d("div", {
            key: 0,
            class: te(["dialog", { large: e.large, sheet: e.sheet }]),
            style: $e({ zIndex: z(i) }),
            onClick: Me(A, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: te(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: b.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(g) : void 0,
              onKeydownCapture: N
            }, [
              e.bare ? I("", !0) : (l(), d("header", Yu, [
                p("h3", {
                  id: z(g),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, Ju),
                e.closable ? (l(), G(ws, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : I("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: te(["dialog-body", { bare: e.bare }])
              }, [
                ye(H.$slots, "default", {}, void 0, !0)
              ], 2),
              H.$slots.foot ? (l(), d("footer", Zu, [
                ye(H.$slots, "foot", {}, void 0, !0)
              ])) : I("", !0)
            ], 42, Ku)
          ], 6)) : I("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, td = /* @__PURE__ */ J(ed, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Re = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ie = { across: 48, down: 110, margin: 32, labelSpace: 14 }, nd = 6;
function Ss(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const sd = (e) => {
  const t = Ss(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
  return { name: e, lines: t, line: ze.line, padY: ze.padY, width: n, height: t.length * ze.line + ze.padY * 2 };
};
function ad(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, c) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(c) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function od(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function rd(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, c) => [i, c]))), o = (r, i) => {
    const c = a(), u = (f) => {
      const g = i(f).map((b) => c.get(b));
      return g.length ? g.reduce((b, _) => b + _, 0) / g.length : c.get(f);
    };
    return [...r].sort((f, g) => u(f) - u(g));
  };
  for (let r = 0; r < nd; r++) {
    const i = r % 2 === 0, c = s.map((u, f) => f);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const f = (g) => t.filter((b) => b[i ? 1 : 0] === g).map((b) => b[i ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
function id(e, t) {
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
function ld(e) {
  const t = [...new Set(e.flatMap(([y, m]) => [y, m]))], n = new Set(e.map(([, y]) => y)), s = t.filter((y) => !n.has(y)), a = ad(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((y, m) => !a.has(m)), r = od(t, o), i = rd(t, o, r), c = new Map(t.map((y) => [y, sd(y)])), u = i.map((y) => y.reduce((m, R) => m + c.get(R).width, 0) + Ie.across * (y.length - 1)), f = Math.max(...u) + Ie.margin * 2, g = ud(e, r, i.length), b = /* @__PURE__ */ new Map();
  let _ = Ie.margin;
  i.forEach((y, m) => {
    let R = (f - u[m]) / 2;
    const O = Math.max(...y.map((q) => c.get(q).height));
    y.forEach((q) => {
      const $ = c.get(q);
      b.set(q, { ...$, x: R, y: _ + (O - $.height) / 2 }), R += $.width + Ie.across;
    }), _ += O + (g[m] ?? Ie.down);
  });
  const A = e.map(([y, m, R], O) => ({ from: y, to: m, label: R || "", back: a.has(O) || r.get(m) <= r.get(y) }));
  id(A, b);
  const N = A.map((y) => dd(y, b.get(y.from), b.get(y.to))), w = [...b.values()], M = md(N, w), H = Math.max(_ - Ie.down, ...M.filter((y) => y.label).map((y) => y.label.y + y.label.height));
  return { width: Math.max(f - Ie.margin, ...M.filter((y) => y.label).map((y) => y.label.x + y.label.width)) + Ie.margin, height: H + Ie.margin, nodes: w, arrows: M };
}
const cd = (e) => e ? Ss(e, Re.lineChars).length * Re.line + Re.pad * 2 : 0;
function ud(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Ie.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += cd(r) + Ie.labelSpace);
  }), s.map((a) => Math.max(Ie.down, a));
}
function dd(e, t, n) {
  const s = e.label ? Ss(e.label, Re.lineChars) : [], a = s.length ? Math.max(...s.map((b) => b.length)) * Re.charWidth + Re.pad * 2 : 0, o = s.length * Re.line + (s.length ? Re.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - i) / 2, g = [{ x: r, y: i }, { x: r, y: i + f }, { x: c, y: u - f }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: g, path: `M${r} ${i} C${r} ${i + f} ${c} ${u - f} ${c} ${u}` };
}
const hd = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, fd = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], pd = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Re.line);
function md(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, u) => {
      const f = hd(s.curve, c);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = pd.flatMap((c) => fd.map((u) => a(u, c))).find((c) => !n.some((u) => ea(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => ea(i, c)); ) i.y += Re.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Re.line, pad: Re.pad } };
  });
}
const ea = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, gd = { class: "flowchart-tools" }, vd = ["width", "height", "viewBox", "aria-label"], yd = ["d"], wd = ["x", "y", "width", "height"], kd = ["x", "y"], bd = ["x", "dy"], $d = {
  key: 0,
  class: "flowchart-label"
}, xd = ["x", "y", "width", "height"], _d = ["x", "y"], Md = ["x", "dy"], Sd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = C(() => ld(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = D(null), i = D({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var M;
      const N = (M = r.value) == null ? void 0 : M.getBoundingClientRect();
      if (!(N != null && N.width)) return;
      const w = Math.min(N.width / a.value.width, N.height / a.value.height, 1.5);
      i.value = { zoom: w, x: (N.width - a.value.width * w) / 2, y: (N.height - a.value.height * w) / 2 };
    }
    function f(N, w, M) {
      const { zoom: H, x: V, y } = i.value, m = Math.min(o.most, Math.max(o.least, H * N));
      i.value = { zoom: m, x: w - (w - V) * m / H, y: M - (M - y) * m / H };
    }
    function g(N) {
      const w = r.value.getBoundingClientRect();
      f(N, w.width / 2, w.height / 2);
    }
    function b(N) {
      const w = r.value.getBoundingClientRect();
      N.ctrlKey || N.metaKey ? f(N.deltaY < 0 ? o.step : 1 / o.step, N.clientX - w.left, N.clientY - w.top) : i.value = { ...i.value, x: i.value.x - N.deltaX, y: i.value.y - N.deltaY };
    }
    function _(N) {
      var w, M, H;
      N.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), c = { x: N.clientX - i.value.x, y: N.clientY - i.value.y }, (H = (M = r.value).setPointerCapture) == null || H.call(M, N.pointerId);
    }
    function A(N) {
      c && (i.value = { ...i.value, x: N.clientX - c.x, y: N.clientY - c.y });
    }
    return De(u), (N, w) => (l(), G(td, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (M) => s("close"))
    }, {
      default: U(() => [
        p("div", gd, [
          F(we, {
            small: "",
            onClick: w[0] || (w[0] = (M) => g(o.step))
          }, {
            default: U(() => [...w[5] || (w[5] = [
              de("Zoom in", -1)
            ])]),
            _: 1
          }),
          F(we, {
            small: "",
            onClick: w[1] || (w[1] = (M) => g(1 / o.step))
          }, {
            default: U(() => [...w[6] || (w[6] = [
              de("Zoom out", -1)
            ])]),
            _: 1
          }),
          F(we, {
            small: "",
            onClick: u
          }, {
            default: U(() => [...w[7] || (w[7] = [
              de("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: Me(b, ["prevent"]),
          onPointerdown: _,
          onPointermove: A,
          onPointerup: w[2] || (w[2] = (M) => Is(c) ? c.value = null : c = null),
          onPointercancel: w[3] || (w[3] = (M) => Is(c) ? c.value = null : c = null)
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
            (l(!0), d(ee, null, re(a.value.arrows, (M, H) => (l(), d("path", {
              key: `arrow-${H}`,
              class: "flowchart-arrow",
              d: M.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, yd))), 128)),
            (l(!0), d(ee, null, re(a.value.nodes, (M) => (l(), d("g", {
              key: M.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: M.x,
                y: M.y,
                width: M.width,
                height: M.height,
                rx: "8"
              }, null, 8, wd),
              p("text", {
                x: M.x + M.width / 2,
                y: M.y + M.padY + M.line / 2
              }, [
                (l(!0), d(ee, null, re(M.lines, (H, V) => (l(), d("tspan", {
                  key: V,
                  x: M.x + M.width / 2,
                  dy: V ? M.line : 0
                }, k(H), 9, bd))), 128))
              ], 8, kd)
            ]))), 128)),
            (l(!0), d(ee, null, re(a.value.arrows, (M, H) => (l(), d(ee, {
              key: `label-${H}`
            }, [
              M.label ? (l(), d("g", $d, [
                p("rect", {
                  x: M.label.x,
                  y: M.label.y,
                  width: M.label.width,
                  height: M.label.height,
                  rx: "4"
                }, null, 8, xd),
                p("text", {
                  x: M.label.x + M.label.width / 2,
                  y: M.label.y + M.label.pad + M.label.line / 2
                }, [
                  (l(!0), d(ee, null, re(M.label.lines, (V, y) => (l(), d("tspan", {
                    key: y,
                    x: M.label.x + M.label.width / 2,
                    dy: y ? M.label.line : 0
                  }, k(V), 9, Md))), 128))
                ], 8, _d)
              ])) : I("", !0)
            ], 64))), 128))
          ], 12, vd))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Ed = /* @__PURE__ */ J(Sd, [["__scopeId", "data-v-51d24cfe"]]), ta = {
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
}, Cd = ["innerHTML"], Ad = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => ta[t.name] || ta.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Cd));
  }
}, Ve = /* @__PURE__ */ J(Ad, [["__scopeId", "data-v-beb5935c"]]), Od = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: te(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      F(Ve, { name: "fold" })
    ], 2));
  }
}, Rt = /* @__PURE__ */ J(Od, [["__scopeId", "data-v-d03899bb"]]), Td = ["data-tip", "aria-label"], Bd = {
  key: 0,
  class: "mact-word"
}, Id = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: te(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      F(Ve, { name: "open" }),
      e.open ? (l(), d("span", Bd, k(e.label), 1)) : I("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Td));
  }
}, co = /* @__PURE__ */ J(Id, [["__scopeId", "data-v-3b292e09"]]), Rd = ["placeholder"], Ld = { class: "actions" }, Dd = { class: "error" }, Nd = {
  key: 1,
  class: "card closed"
}, jd = { class: "mark" }, Pd = { class: "prompt" }, qd = {
  key: 0,
  class: "draft"
}, Wd = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Kn({
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
  emits: /* @__PURE__ */ Kn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = zn(e, "draft"), r = zn(e, "error"), i = D(!!r.value), c = D(!1), u = D(!1), f = D(null);
    async function g() {
      var N, w;
      i.value = !0, c.value = !1, await yt(), (w = ((N = f.value) == null ? void 0 : N.querySelector("input")) || f.value) == null || w.focus();
    }
    function b() {
      i.value = !1, r.value = "";
    }
    function _(N) {
      N.shiftKey || N.isComposing || (N.preventDefault(), A());
    }
    async function A() {
      const N = o.value.trim();
      if (!(!N || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(N), i.value = !1, c.value = !0;
        } catch (w) {
          o.value = N, r.value = w.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: g }), (N, w) => (l(), d("div", {
      class: te(["comment-bar", { open: i.value }])
    }, [
      i.value ? (l(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: Me(A, ["prevent"]),
        onKeydown: Tt(b, ["esc"])
      }, [
        ye(N.$slots, "who", {}, void 0, !0),
        rt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": w[0] || (w[0] = (M) => o.value = M),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Tt(_, ["enter"])
        }, null, 40, Rd), [
          [Gn, o.value]
        ]),
        p("div", Ld, [
          p("span", Dd, k(r.value), 1),
          F(we, {
            small: "",
            onClick: b
          }, {
            default: U(() => [...w[2] || (w[2] = [
              de("Cancel", -1)
            ])]),
            _: 1
          }),
          F(we, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: A
          }, {
            default: U(() => [...w[3] || (w[3] = [
              de("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (l(), d("div", Nd, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: g
        }, [
          p("span", jd, [
            F(ke, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", Pd, k(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", qd, "Draft kept")) : I("", !0)
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = (M) => a("show"))
        }, [
          p("span", null, k(z(Ei)(e.count, "comment")), 1),
          F(ke, {
            name: "down",
            size: 12
          })
        ])) : I("", !0)
      ]))
    ], 2));
  }
}, uo = /* @__PURE__ */ J(Wd, [["__scopeId", "data-v-79db0c2d"]]), Fd = 120, An = 280, Hd = 160, Ud = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function ho(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = D(t()), a = D("");
  let o = 0;
  const r = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const f = e.value, g = ++o;
    if (!f || !f.offsetWidth || Ud()) {
      s.value = u;
      return;
    }
    const b = { width: f.offsetWidth, height: f.offsetHeight };
    if (r(f, b), a.value = "leaving", await n(Fd), g !== o) return;
    s.value = u, a.value = "resizing", await yt(), i(f);
    const _ = { width: f.offsetWidth, height: f.offsetHeight };
    r(f, b), f.offsetWidth, f.style.transition = `width ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, _), await n(An), g === o && (i(f), a.value = "entering", await n(Hd), g === o && (a.value = ""));
  }
  return be(t, (u) => c(u)), wt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Vd = { class: "growing-card-top" }, zd = ["aria-expanded"], Gd = { class: "growing-card-avatar" }, Kd = { class: "growing-card-title" }, Yd = {
  key: 0,
  class: "growing-card-comment-bar",
  "data-growing-comment-bar": ""
}, Jd = { class: "growing-card-more" }, Zd = { class: "growing-card-body" }, Xd = {
  __name: "GrowingCard",
  props: {
    title: { type: String, required: !0 },
    text: { type: String, default: "" },
    icon: { type: String, default: "agents" },
    person: { type: String, default: "" },
    bad: Boolean,
    action: { type: String, default: "" },
    incoming: Boolean,
    send: { type: Function, default: null }
  },
  emits: ["act"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(!1), o = D(!1), r = D(null);
    async function i() {
      var A;
      o.value = !0, await yt(), (A = r.value) == null || A.expand();
    }
    async function c(A) {
      await n.send(A), o.value = !1;
    }
    const u = D(null), { folded: f, phase: g } = ho(u, () => !a.value), b = C(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), _ = C(() => n.text.split(/\n\s*\n/).filter((A) => A.trim()));
    return (A, N) => (l(), d("div", {
      ref_key: "wrap",
      ref: u,
      class: te(["growing-card-wrap", z(g), { open: !z(f), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Vd, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: N[0] || (N[0] = (w) => a.value = !a.value)
        }, [
          p("span", Gd, [
            e.bad ? (l(), G(Ve, {
              key: 0,
              name: "cross"
            })) : b.value ? (l(), d(ee, { key: 1 }, [
              de(k(b.value), 1)
            ], 64)) : (l(), G(ke, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Kd, k(e.title), 1),
          F(Rt, { open: a.value }, null, 8, ["open"])
        ], 8, zd),
        e.action ? (l(), G(co, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: N[1] || (N[1] = (w) => s("act"))
        }, null, 8, ["label", "open"])) : I("", !0),
        e.send ? (l(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: i
        }, [
          F(ke, {
            name: "bubble",
            size: 13
          })
        ])) : I("", !0)
      ]),
      o.value ? (l(), d("div", Yd, [
        F(uo, {
          ref_key: "bar",
          ref: r,
          send: c
        }, null, 512)
      ])) : I("", !0),
      p("div", Jd, [
        p("div", Zd, [
          (l(!0), d(ee, null, re(_.value, (w, M) => (l(), d("p", {
            key: M,
            class: "growing-card-text"
          }, k(w), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Qd = /* @__PURE__ */ J(Xd, [["__scopeId", "data-v-0dd4622f"]]), eh = ["title", "aria-label"], th = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, nh = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, sh = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = C(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), d("span", {
      class: te(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), d("svg", th, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", nh)) : I("", !0)
      ]))
    ], 10, eh));
  }
}, ah = /* @__PURE__ */ J(sh, [["__scopeId", "data-v-6dc92808"]]), oh = "img,pre,table";
function rh(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function ih(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function lh(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(oh)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = rh(ih(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function ch(e, t) {
  let n = null;
  const s = () => e.value && lh(e.value);
  De(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const uh = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function dh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const hh = ["data-ref"], fh = ["data-from", "data-ref"], ph = { class: "message-body" }, mh = ["title"], gh = ["innerHTML"], vh = ["innerHTML"], yh = {
  class: "message-faces",
  "data-message-faces": ""
}, wh = ["title", "data-face", "onClick"], kh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, bh = ["title", "data-reaction", "onClick"], $h = {
  key: 0,
  class: "message-reaction-count"
}, xh = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, _h = ["href", "title"], Mh = ["src", "alt"], Sh = ["href"], Eh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, Ch = {
  key: 1,
  "data-message-links-rows": ""
}, Ah = { class: "message-foot" }, Oh = { class: "message-time" }, Th = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, Bh = 1500, Ih = "An earlier message", Rh = "about", Lh = 3, Dh = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    var P;
    const n = e, s = t, a = D(!1), o = D(null), r = C(() => ["user", "comment"].includes(n.message.type)), i = C(() => {
      const [Z, K] = (n.message.commented_row || ":").split(":"), X = at(Z);
      return X ? { ref: `${X}:${K}`, label: `${jt(X).title.toLowerCase()} ${K}` } : null;
    }), c = C(() => r.value && !n.message.read_at && !n.message.local);
    async function u() {
      var Z;
      await ((Z = navigator.clipboard) == null ? void 0 : Z.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Bh);
    }
    const f = C(() => ss(n.message.text ?? "", { env: "" })), g = C(() => JSON.parse(n.message.flowchart_edges || "[]")), b = D(!1), _ = C(() => ss(n.quote || Ih, { env: "" }));
    function A() {
      const Z = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Z ? Z.scrollIntoView({ block: "center", behavior: "smooth" }) : it(`messages:${n.message.parent_id}`);
    }
    ch(o, () => `${n.message.text} ${n.quote}`);
    const N = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, w = (Z) => `/api/files/message/${n.message.id}/${encodeURIComponent(Z)}`, M = C(() => JSON.parse(n.message.captions || "{}")), H = C(() => (n.message.files ?? []).map((Z) => ({ name: Z, address: w(Z), isImage: N.test(Z), title: M.value[Z] || Z }))), V = C(() => Pa(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), y = Ce(Ne, null), m = D([]), R = D(!1), O = C(() => `Linked: ${m.value.join(", ")}`), q = C(() => m.value.length >= Lh), $ = C(() => `${m.value.length} linked ${m.value.every((Z) => Z.startsWith("task ")) ? "tasks" : "rows"}`);
    async function S() {
      if (!r.value || !(y != null && y.read) || n.message.local) return;
      const Z = await y.read(`link list --source message:${n.message.id}`);
      Z.ok && (m.value = (Z.value.rows ?? Z.value ?? []).filter((K) => K.link_type === Rh).map((K) => `${K.target_model} ${K.target_id}`));
    }
    S(), (P = y == null ? void 0 : y.follow) == null || P.call(y, ["link.*"], S);
    async function v(Z) {
      const K = await y.run(["message", "comment", String(n.message.id), Z]);
      if (!K.ok) throw new Error(K.error);
    }
    const h = D(!1), E = C(() => dh(n.message.reactions));
    function T(Z) {
      h.value = !1, s("react", n.message, Z);
    }
    return (Z, K) => e.message.peer || e.message.recipient ? (l(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      F(Qd, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        send: v
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, hh)) : (l(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", ph, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: te(["message-card", "md", { comment: i.value }]),
          onClick: K[3] || (K[3] = (...X) => z(mt) && z(mt)(...X))
        }, [
          i.value ? (l(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: K[0] || (K[0] = Me((X) => z(it)(i.value.ref), ["stop"]))
          }, [
            F(ke, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + k(i.value.label), 1)
          ], 8, mh)) : I("", !0),
          e.message.parent_id ? (l(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Me(A, ["stop"]),
            innerHTML: _.value
          }, null, 8, gh)) : I("", !0),
          p("div", { innerHTML: f.value }, null, 8, vh),
          g.value.length ? (l(), d(ee, { key: 2 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: K[1] || (K[1] = (X) => b.value = !0)
            }, "Open the flowchart"),
            b.value ? (l(), G(Ed, {
              key: 0,
              title: e.message.text,
              edges: g.value,
              onClose: K[2] || (K[2] = (X) => b.value = !1)
            }, null, 8, ["title", "edges"])) : I("", !0)
          ], 64)) : I("", !0)
        ], 2),
        p("div", {
          class: te(["message-tools", { picking: h.value }]),
          "data-message-tools": ""
        }, [
          h.value ? (l(), d(ee, { key: 0 }, [
            p("div", yh, [
              (l(!0), d(ee, null, re(z(uh), (X) => (l(), d("button", {
                key: X,
                type: "button",
                class: "message-face",
                title: `React ${X}`,
                "data-face": X,
                onClick: (le) => T(X)
              }, k(X), 9, wh))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: K[4] || (K[4] = (X) => h.value = !1)
            }, [
              F(ke, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (l(), d(ee, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: K[5] || (K[5] = (X) => h.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: K[6] || (K[6] = (X) => s("reply", e.message))
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
              onClick: K[7] || (K[7] = (X) => s("delete", e.message))
            }, "Delete")) : I("", !0)
          ], 64))
        ], 2)
      ]),
      E.value.length ? (l(), d("div", kh, [
        (l(!0), d(ee, null, re(E.value, (X) => (l(), d("button", {
          key: X.emoji,
          type: "button",
          class: te(["message-reaction", { mine: X.mine }]),
          title: X.title,
          "data-reaction": X.emoji,
          onClick: (le) => s("react", e.message, X.emoji)
        }, [
          de(k(X.emoji) + " ", 1),
          X.count > 1 ? (l(), d("span", $h, k(X.count), 1)) : I("", !0)
        ], 10, bh))), 128))
      ])) : I("", !0),
      H.value.length ? (l(), d("div", xh, [
        (l(!0), d(ee, null, re(H.value, (X) => (l(), d(ee, {
          key: X.name
        }, [
          X.isImage ? (l(), d("a", {
            key: 0,
            href: X.address,
            target: "_blank",
            class: "message-image",
            title: X.title
          }, [
            p("img", {
              src: X.address,
              alt: X.name
            }, null, 8, Mh)
          ], 8, _h)) : (l(), d("a", {
            key: 1,
            href: X.address,
            target: "_blank",
            class: "message-file"
          }, k(X.name), 9, Sh))
        ], 64))), 128))
      ])) : I("", !0),
      m.value.length ? (l(), d("div", Eh, [
        F(Ve, {
          class: "message-links-icon",
          name: "linked"
        }),
        q.value && !R.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: K[8] || (K[8] = (X) => R.value = !0)
        }, k($.value), 1)) : (l(), d("span", Ch, [
          F(st, {
            text: O.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : I("", !0),
      p("div", Ah, [
        p("time", Oh, k(V.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", Th, "message " + k(e.message.id), 1)) : I("", !0),
        r.value ? (l(), G(ah, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : I("", !0)
      ])
    ], 8, fh));
  }
}, Fv = /* @__PURE__ */ J(Dh, [["__scopeId", "data-v-d39ce534"]]), cn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], On = 200, fo = (e) => {
  var t;
  return ((t = cn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? cn[0].key;
}, Hv = (e) => {
  var t;
  return ((t = cn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Nh = ["aria-label"], jh = 300, na = 400, Ph = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: On } },
  setup(e) {
    const t = e, n = C(() => fo(t.value)), s = C(() => n.value < On ? [1, 0.25, 0.25] : n.value === On ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: te(["ico", "prio", { hot: n.value >= na, high: n.value >= jh && n.value < na }]),
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
    ], 10, Nh));
  }
}, Uv = /* @__PURE__ */ J(Ph, [["__scopeId", "data-v-b10e610f"]]), qh = ["aria-checked", "aria-haspopup", "onClick"], Wh = {
  key: 0,
  class: "segmented-dot"
}, Fh = {
  key: 1,
  class: "segmented-count"
}, Hh = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ba();
    return (a, o) => {
      const r = Qo("tip");
      return l(), d("span", {
        class: te(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), d(ee, null, re(e.options, (i) => rt((l(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: te(["segmented-option", { on: i.key === e.value }]),
          onClick: (c) => n("pick", i.key)
        }, [
          i.dot ? (l(), d("span", Wh)) : I("", !0),
          de(" " + k(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", Fh, k(i.count), 1)) : I("", !0)
        ], 10, qh)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Uh = /* @__PURE__ */ J(Hh, [["__scopeId", "data-v-ca953072"]]), sa = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Vh = {
  key: 1,
  class: "text-field-label"
}, zh = {
  key: 2,
  class: "text-field-end"
}, Gh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Kn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = zn(e, "modelValue"), s = xa(), a = "onUpdate:modelValue" in (((f = er()) == null ? void 0 : f.vnode.props) || {}), o = C(() => a ? n.value : s.value), r = (g) => a && (n.value = g.target.value), i = C(
      () => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "class" && g !== "style" && g !== "value"))
    ), c = C(() => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "value"))), u = D(null);
    return t({ focus: () => u.value && u.value.focus() }), (g, b) => e.label || e.icon || g.$slots.end ? (l(), d("label", {
      key: 0,
      class: te(["text-field", { large: e.large, ended: g.$slots.end }, z(s).class]),
      style: $e(z(s).style)
    }, [
      e.icon ? (l(), G(ke, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : I("", !0),
      e.label ? (l(), d("span", Vh, k(e.label), 1)) : I("", !0),
      rt(p("input", ot({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(sa), o.value]
      ]),
      g.$slots.end ? (l(), d("span", zh, [
        ye(g.$slots, "end", {}, void 0, !0)
      ])) : I("", !0)
    ], 6)) : rt((l(), d("input", ot({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
      [z(sa), o.value]
    ]);
  }
}), Vv = /* @__PURE__ */ J(Gh, [["__scopeId", "data-v-d9c38ca8"]]), aa = (e) => e.page * e.size < e.total;
function Kh(e, t, { incremental: n = !1 } = {}) {
  const s = ys(), a = D([]), o = D(""), r = D(!1), i = D(!1), c = D(""), u = D(null);
  async function f(w) {
    const M = await s.read(`${e} --before-id ${w + 1} --limit 1`);
    if (!M.ok) return A();
    const H = M.value.rows.find((V) => V.id === w);
    a.value = H ? a.value.map((V) => V.id === w ? H : V) : a.value.filter((V) => V.id !== w);
  }
  async function g(w) {
    if (n && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((m) => m.id !== w.row_id));
    if (n && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && a.value.some((m) => m.id === w.row_id)) return f(w.row_id);
    if (!(n && a.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return A();
    const H = Math.max(...a.value.map((m) => m.id)), V = await s.read(`${e} --after-id ${H}`);
    if (!V.ok) return A();
    const y = new Set(a.value.map((m) => m.id));
    a.value = [...V.value.rows.filter((m) => !y.has(m.id)), ...a.value];
  }
  async function b() {
    if (!a.value.length) return !1;
    const w = Math.min(...a.value.map((V) => V.id)), M = await s.read(`${e} --before-id ${w}`);
    if (!M.ok || !M.value.rows.length) return i.value = !1;
    i.value = aa(M.value);
    const H = new Set(a.value.map((V) => V.id));
    return a.value = [...a.value, ...M.value.rows.filter((V) => !H.has(V.id))], !0;
  }
  let _ = 0;
  async function A() {
    const w = ++_, M = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (w !== _) return;
    const H = M.ok ? s.shared ? [M.value] : M.value.rows : [], V = H.length ? Math.min(...H.map((y) => y.id)) : 0;
    a.value = n && M.ok && V ? [...a.value.filter((y) => y.id > Math.max(...H.map((m) => m.id))), ...H, ...a.value.filter((y) => y.id < V)] : H, M.ok && !a.value.some((y) => y.id < V) && (i.value = !s.shared && aa(M.value)), o.value = M.ok ? "" : M.error, r.value = !0;
  }
  async function N(w) {
    const M = await s.run(w);
    return c.value = M.ok ? "" : M.error, u.value = M.ok ? M.value : null, await A(), M;
  }
  return s.follow(t, g), A(), { rows: a, failure: o, loaded: r, more: i, load: A, older: b, act: N, actionFailure: c, answer: u, context: s };
}
const Yh = { class: "title" }, Jh = { class: "state" }, Zh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Kh(t.line, t.events);
    return (o, r) => (l(), G(Xr, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: U(({ row: i }) => [
        p("span", Yh, k(i.title), 1),
        p("span", Jh, k(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, zv = /* @__PURE__ */ J(Zh, [["__scopeId", "data-v-a69084cd"]]), Tn = D(Date.now() / 1e3);
let oa = 0, Kt = 0;
function Xh() {
  return Kt || (Tn.value = Date.now() / 1e3, oa = setInterval(() => Tn.value = Date.now() / 1e3, 1e3)), Kt += 1, _a() && Ma(() => {
    Kt -= 1, Kt || clearInterval(oa);
  }), Tn;
}
const Qh = ["title", "data-figure-mark", "data-folded", "data-open"], ef = {
  key: 2,
  class: "worker"
}, tf = { class: "head" }, nf = { key: 0 }, sf = {
  key: 3,
  class: "status"
}, af = {
  key: 0,
  class: "figure"
}, of = {
  key: 1,
  class: "ran-for"
}, rf = { key: 2 }, lf = {
  key: 3,
  class: "news"
}, cf = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, uf = {
  key: 6,
  class: "settled"
}, df = {
  key: 1,
  class: "bar"
}, hf = {
  key: 3,
  class: "detail body"
}, ff = {
  key: 0,
  class: "body-label"
}, pf = ["title"], mf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = xa(), s = ["onClick", "onAct"], a = C(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = D(!1), r = C(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = C(() => t.open !== void 0), c = C(() => i.value || r.value), u = C(() => i.value ? t.open : o.value), f = C(() => i.value ? !t.open : r.value && !o.value), g = C(() => !!(t.mark.action && n.onAct)), b = C(() => c.value || g.value || !!n.onClick), _ = D(null), A = D(null), { folded: N, phase: w } = ho(_, () => f.value);
    function M(le) {
      var me, Se;
      if (!(le.target !== _.value && !A.value.contains(le.target))) {
        if (i.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(le);
      }
    }
    const H = (le) => n.onAct(le), V = ["failed", "unfinished"], y = C(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? V.includes(t.mark.state) ? "danger" : "good" : ""), m = C(() => t.mark.color ? t.mark.color : y.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : y.value ? `var(--tone-${y.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), R = C(() => m.value || "var(--tone-work)"), O = C(() => !t.mark.ending && !t.mark.ended && y.value !== "stopped"), q = Xh(), $ = C(
      () => t.mark.began_at && O.value && !t.mark.figure && !t.mark.counting ? il(q.value - t.mark.began_at) : ""
    ), S = C(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${Hs(me - le, !0)}` : Hs(q.value - le, !0) : $.value;
    }), v = ["bad", "danger", "warn"], h = C(() => v.includes(y.value) || t.mark.asks ? "attention" : O.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), E = ["bad", "danger"], T = C(() => E.includes(y.value)), P = C(() => h.value === "process" ? "running" : T.value ? "cross" : y.value === "stopped" ? "stopped" : y.value === "good" ? "tick" : ""), Z = C(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || P.value || t.mark.settled || t.mark.news)
    ), K = C(() => [t.mark.title, t.mark.time ? Pa(t.mark.time) : ""].filter(Boolean).join(" · ")), X = C(() => ({
      ...m.value ? { "--mark": m.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (l(), d("div", ot(a.value, {
      ref_key: "root",
      ref: _,
      class: [
        "mark",
        `w-${h.value}`,
        z(w),
        {
          open: u.value,
          live: b.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: m.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: X.value,
      title: K.value,
      "data-figure-mark": e.mark.key,
      "data-folded": z(N) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: M
    }), [
      (l(), G(lt(b.value ? "button" : "span"), {
        ref_key: "top",
        ref: A,
        class: "top",
        type: b.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!u.value) : void 0
      }, {
        default: U(() => [
          e.mark.markIcon ? (l(), G(Ve, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), G(ke, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), d("span", ef, k(e.mark.worker), 1)) : I("", !0),
          p("span", tf, [
            F(st, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", nf, k(e.mark.name), 1)) : I("", !0),
            c.value ? (l(), G(Rt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : I("", !0)
          ]),
          Z.value ? (l(), d("span", sf, [
            e.mark.figure ? (l(), d("span", af, k(e.mark.figure), 1)) : I("", !0),
            S.value ? (l(), d("span", of, k(S.value), 1)) : I("", !0),
            e.mark.stopping ? (l(), d("span", rf, "Stopping")) : I("", !0),
            e.mark.news ? (l(), d("span", lf, k(e.mark.news), 1)) : I("", !0),
            P.value === "running" ? (l(), d("span", cf)) : P.value ? (l(), G(Ve, {
              key: 5,
              class: te(["sign", P.value]),
              name: P.value
            }, null, 8, ["class", "name"])) : I("", !0),
            e.mark.settled ? (l(), d("span", uf, k(e.mark.settled), 1)) : I("", !0)
          ])) : I("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      g.value ? (l(), G(co, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: Me(H, ["stop"])
      }, null, 8, ["label", "open"])) : I("", !0),
      (e.mark.figure || e.mark.counting) && O.value ? (l(), d("span", df, [
        p("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: R.value })
        }, null, 4)
      ])) : I("", !0),
      e.mark.detail && !z(N) ? (l(), G(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : I("", !0),
      e.mark.body && !z(N) ? (l(), d("div", hf, [
        e.mark.bodyLabel ? (l(), d("p", ff, k(e.mark.bodyLabel), 1)) : I("", !0),
        F(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : I("", !0),
      e.mark.command && !z(N) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, pf)) : I("", !0),
      e.mark.card ? (l(), G(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : I("", !0),
      ye(le.$slots, "default", {
        shown: !z(N)
      }, void 0, !0)
    ], 16, Qh));
  }
}), po = /* @__PURE__ */ J(mf, [["__scopeId", "data-v-5ce1e3c8"]]), gf = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function mo(e) {
  var n;
  const t = gf[e] || ((n = jt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const vf = (e) => mo(String(e).split(":")[0]), go = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), yf = { passed: "good", failed: "danger", warned: "warn", running: "" }, wf = { good: "good", warn: "warn", danger: "danger" }, ra = {
  "open row": (e) => it(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Ur(e.target_model, e.target_id || 0)
}, kf = { "open row": (e) => vf(e.target_model), "open page": () => mo("pages") };
function bf(e, t) {
  const n = t || {}, s = ra[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? yf[e.outcome] || "" : wf[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? kf[s](e) : "",
    handlers: s ? { onAct: () => ra[s](e) } : {}
  };
}
const $f = 24, xf = 1e3, ia = 2e3, _f = 0.25, Mf = 5e3;
function Sf(e, t = $f, n = () => !0) {
  const s = D(!1), a = D(0), o = D(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const y = u();
    return y ? y.scrollHeight - y.scrollTop - y.clientHeight : 0;
  }, g = () => !u() || f() <= t;
  function b(y) {
    if (clearTimeout(r), !y) {
      o.value = !1, c = Date.now();
      return;
    }
    const m = Date.now() - c < ia ? ia : xf;
    r = setTimeout(() => o.value = s.value, m);
  }
  function _() {
    clearTimeout(i), s.value = !1, a.value = 0, b(!1);
  }
  function A(y = !1) {
    const m = u();
    m && y && m.scrollTo ? m.scrollTo({ top: m.scrollHeight, behavior: "smooth" }) : m && (m.scrollTop = m.scrollHeight), _();
  }
  function N() {
    M(), !s.value && (s.value = !0, b(!0));
  }
  const w = () => !!u() && f() <= u().clientHeight * _f;
  function M() {
    clearTimeout(i), w() && (i = setTimeout(() => s.value && w() && n() && A(!0), Mf));
  }
  function H() {
    g() ? _() : N();
  }
  function V(y = 1, m = !1) {
    s.value ? a.value += Math.max(0, y) : A(m);
  }
  return _a() && Ma(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: g, follow: _, toBottom: A, left: N, scrolled: H, arrived: V };
}
const Ef = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(null), { away: o, scrolled: r, arrived: i, toBottom: c } = Sf(a);
    be(
      () => n.lines.length,
      () => yt(() => i()),
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
      de(k(e.lines.join(`
`) || e.empty), 1),
      z(o) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: g[0] || (g[0] = (b) => z(c)(!0))
      }, "Follow")) : I("", !0)
    ], 544));
  }
}, Cf = /* @__PURE__ */ J(Ef, [["__scopeId", "data-v-09394a20"]]), Af = 1e4;
class Of {
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
    return this.heardAt !== null && t - this.heardAt > Af;
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
const Tf = {
  key: 0,
  class: "frame-note"
}, Bf = {
  key: 0,
  class: "frame-note"
}, If = ["src", "title"], Rf = 1e3, Lf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ys(), s = D(null), a = D(!1), o = D(!1);
    let r = null, i = 0;
    return De(() => {
      r = new Of(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Rf);
    }), Ae(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", Tf, "This window was closed because it stopped answering.")) : (l(), d(ee, { key: 1 }, [
      a.value ? (l(), d("div", Bf, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        F(we, {
          onClick: u[0] || (u[0] = (f) => o.value = !0)
        }, {
          default: U(() => [...u[1] || (u[1] = [
            de("Close the window", -1)
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
      }, null, 8, If)
    ], 64));
  }
}, Df = /* @__PURE__ */ J(Lf, [["__scopeId", "data-v-32a49046"]]), Nf = 0, jf = "/api/lines", Pf = "/api/line";
class qf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Nf));
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
        const n = await je.raw(jf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(Pf, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Wf = new qf();
class Ff {
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
      n.patterns.some((s) => vo(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function vo(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Hf = Symbol("pane-page"), Uf = { 1: "refused", 2: "usage", 3: "fault" }, Vf = 100, zf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Gf({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = D({}), declared: u = [], page: f = null, setOption: g = () => {
}, autoScroll: b = "", tabs: _ = [], readOnly: A = !1, shared: N = null }) {
  const w = /* @__PURE__ */ new Map(), M = new AbortController(), H = (V) => {
    const y = w.get(V);
    if (y && performance.now() - y.at < Vf) return y.answer;
    const m = At(e, V, t, M.signal);
    return w.set(V, { answer: m, at: performance.now() }), m;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: C(() => s()),
    permissions: a,
    autoScroll: b,
    tabs: _,
    readOnly: A,
    shared: N,
    read: H,
    run: (V) => At(e, V, t, M.signal),
    upload: (V) => Yf(V, M.signal),
    cancel: () => M.abort(),
    follow: (V, y) => r.follow(e, V.filter((m) => o.some((R) => vo(R, m))), y, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (V) => C(() => {
      var y;
      return c.value[V] ?? ((y = u.find((m) => m.key === V)) == null ? void 0 : y.default);
    }),
    setting: async (V, y) => {
      const m = await H(`window setting ${e} ${V}`);
      return m.ok ? m.value.value : y;
    },
    setOption: g,
    keep: (V, y) => At(e, ["window", "save-setting", e, V, JSON.stringify(y)], t, M.signal)
  };
}
function Kf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const un = { ok: !1, failure: "cancelled", error: "" };
async function At(e, t, n, s = void 0) {
  try {
    const a = await Wf.add({ window: e, line: Array.isArray(t) ? t : Jf(t), environment: n }, s);
    return s != null && s.aborted ? un : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Uf[a.code] || "fault", error: Kf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? un : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function Yf(e, t = void 0) {
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? un : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? un : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function Jf(e) {
  return [...e.matchAll(zf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Zf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Xf = {
  class: "allowance-prompt",
  role: "dialog"
}, Qf = { class: "allowance-prompt-text" }, e1 = { class: "allowance-prompt-buttons" }, t1 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", Xf, [
      p("p", Qf, k(z(Zf)(e.request)), 1),
      p("div", e1, [
        F(we, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            de("Allow", -1)
          ])]),
          _: 1
        }),
        F(we, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            de("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, n1 = /* @__PURE__ */ J(t1, [["__scopeId", "data-v-102dc765"]]), Bn = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), G(nn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: U(() => [
        de(k(e.reason) + " ", 1),
        e.retry ? (l(), G(we, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            de("Retry", -1)
          ])]),
          _: 1
        })) : I("", !0),
        e.removable ? (l(), G(we, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            de("Remove tab", -1)
          ])]),
          _: 1
        })) : I("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, s1 = ["data-window", "data-agent"], a1 = {
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
    const n = e, s = t, a = D(""), o = D(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Ce(Cr, null), c = Gf({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: C(() => n.options),
      declared: n.declared,
      page: Ce(Hf, null),
      setOption: (g, b) => s("option", g, b),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (g, b) => {
        s("open", g, b), i == null || i(g, b);
      }
    });
    tr(Ne, c), be(() => n.visible, (g) => g && n.subscriptions.shown(n.name)), Ae(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), nr((g) => (a.value = g instanceof Error ? g.message : String(g), n.subscriptions.stopAll(n.name), !1));
    const u = () => ms(n.component), f = () => {
      var g, b;
      return ((b = (g = n.prompts) == null ? void 0 : g.current.value) == null ? void 0 : b.window) === n.name ? n.prompts.current.value : null;
    };
    return (g, b) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (l(), G(n1, {
        key: 0,
        request: f(),
        onAnswer: b[0] || (b[0] = (_) => e.prompts.answer(_))
      }, null, 8, ["request"])) : I("", !0),
      e.unavailableReason ? (l(), G(Bn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), G(Bn, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (l(), G(u, { key: o.value })) : (l(), G(Bn, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: b[1] || (b[1] = (_) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, s1));
  }
}, yo = /* @__PURE__ */ J(a1, [["__scopeId", "data-v-04dd3be3"]]), o1 = {
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
    const n = e, s = t, a = { render: () => ms(Df, { src: n.entry.entry_url }) };
    return (o, r) => (l(), G(yo, {
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
}, os = "journal.stale-build-reload", r1 = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function i1(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(os) === e.message) return !1;
    t.setItem(os, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function l1(e = window.sessionStorage) {
  try {
    e.removeItem(os);
  } catch {
    return;
  }
}
const c1 = ["data-window"], u1 = {
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
    const n = e, s = t, a = mn(null), o = D("");
    return be(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, l1();
          } catch (i) {
            if (r1(i) && i1(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (l(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      F(kt, { shape: "cards" })
    ], 8, c1)) : (l(), G(yo, {
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
}, d1 = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new Ff(), s = ((i = Ce(Ne, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = C(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = C(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), G(u1, {
      key: 0,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), G(o1, {
      key: 1,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, h1 = { class: "mark-more-inner" }, f1 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, p1 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, m1 = {
  key: 3,
  class: "mark-lines"
}, g1 = "process", la = "task", v1 = 2e3, y1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ce(Ne), s = C(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = C(() => go.has(t.mark.variant) && t.mark.detail || ""), o = C(() => t.mark.target_model === la ? t.mark.target_id : 0), r = D([]), i = D(!1), c = D(""), u = C(() => t.mark.target_model === g1 && !!t.mark.target_id);
    async function f() {
      const _ = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = _.ok ? "" : _.error, _.ok && (r.value = _.value.lines);
    }
    let g = null;
    const b = () => clearInterval(g);
    return be(() => t.shown && u.value, (_) => {
      b(), _ && (f(), t.mark.ended_at || (g = setInterval(f, v1)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (_) => _ && t.shown && u.value && (b(), f())), Ae(b), (_, A) => (l(), d("div", {
      class: te(["mark-more", { open: e.shown }]),
      onClick: A[1] || (A[1] = Me(() => {
      }, ["stop"]))
    }, [
      p("div", h1, [
        e.declaration.body_url ? (l(), G(d1, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(ee, { key: 1 }, [
          a.value ? (l(), d(ee, { key: 0 }, [
            A[2] || (A[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", f1, k(a.value), 1)
          ], 64)) : I("", !0),
          u.value && c.value ? (l(), d("p", p1, k(c.value), 1)) : u.value && i.value ? (l(), d(ee, { key: 2 }, [
            A[3] || (A[3] = p("p", { class: "mark-label" }, "Output", -1)),
            F(Cf, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", m1, k(s.value.join(`
`)), 1)) : I("", !0),
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: A[0] || (A[0] = Me((N) => z(it)(`${la}:${o.value}`), ["stop"]))
          }, "Open task " + k(o.value) + " and its proofs", 1)) : I("", !0)
        ], 64))
      ])
    ], 2));
  }
}, rs = /* @__PURE__ */ J(y1, [["__scopeId", "data-v-51f69bf1"]]), w1 = (e) => `show-${e}`, Gv = (e, t, n) => e.filter((s) => {
  var a;
  return n(w1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), k1 = "messages.chat", b1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), is = (e, t, n) => At(k1, b1(e, t), n), $1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, x1 = ["title", "aria-label", "onClick"], _1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, M1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = C(() => $1(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = D(""), a = Ce(Ne);
    async function o(r) {
      const i = await is(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (l(), d(ee, null, [
      (l(!0), d(ee, null, re(n.value, (c) => (l(), d("button", {
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
      ], 8, x1))), 128)),
      s.value ? (l(), d("span", _1, k(s.value), 1)) : I("", !0)
    ], 64));
  }
}, S1 = /* @__PURE__ */ J(M1, [["__scopeId", "data-v-0dfda102"]]);
function wo(e, t) {
  const n = mn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const ko = wo("/api/marks", "marks"), Kv = ko.fetchAll, E1 = ko.find, C1 = 2e3;
function bo(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, C1);
  };
  De(async () => {
    await e(), s();
  }), wt(() => clearTimeout(n));
}
const A1 = ["data-ref"], O1 = ["data-ref"], T1 = { class: "mark-row" }, B1 = "dock add", I1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = C(() => E1(s.mark.type)), o = Ce(Ne, null), r = C(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = D(null);
    bo(async () => {
      if (!r.value) return;
      const b = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      b.ok && b.value.rows.length && (i.value = b.value.rows[0].progress);
    }, () => r.value);
    const c = C(() => {
      const b = bf(s.mark, a.value), _ = !b.figure || b.figure.endsWith("%");
      return i.value && r.value && _ ? { ...b, figure: `${i.value}%`, fraction: i.value / 100 } : b;
    }), u = C(() => {
      var b;
      return !!(s.mark.lines || s.mark.detail && go.has(s.mark.variant) || t.has(s.mark.target_model) || (b = a.value) != null && b.body_url);
    }), f = D(!1), g = C(() => {
      var b, _, A;
      return s.docked ? (_ = (b = a.value) == null ? void 0 : b.buttons) == null ? void 0 : _.filter((N) => {
        var w;
        return !((w = N.runs) != null && w.startsWith(B1));
      }) : (A = a.value) == null ? void 0 : A.buttons;
    });
    return (b, _) => {
      var A, N;
      return (A = a.value) != null && A.card ? (l(), d("div", {
        key: 0,
        class: "thread-turn card whole-card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        F(rs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 8, A1)) : (l(), d("div", {
        key: 1,
        class: te(["thread-turn", "card", { "full-width": (N = a.value) == null ? void 0 : N.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", T1, [
          F(po, ot({
            mark: c.value,
            open: u.value ? f.value : void 0
          }, sr(c.value.handlers), {
            onClick: _[0] || (_[0] = (w) => f.value = !f.value)
          }), ar({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: U(({ shown: w }) => [
                F(rs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: w
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(S1, {
            buttons: g.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, O1));
    };
  }
}, R1 = /* @__PURE__ */ J(I1, [["__scopeId", "data-v-b143e18d"]]), L1 = ["data-ref"], D1 = ["inert"], N1 = { class: "thread-group" }, j1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = D(!1), s = D(!1);
    be(n, () => s.value = !0);
    const a = C(() => ({
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
      F(po, {
        mark: a.value,
        open: n.value,
        onClick: r[0] || (r[0] = (i) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (l(), d("div", {
        key: 0,
        class: te(["group-rows", { open: n.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", N1, [
          (l(!0), d(ee, null, re(e.group.marks, (i) => (l(), G(R1, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, D1)) : I("", !0)
    ], 8, L1));
  }
}, Yv = /* @__PURE__ */ J(j1, [["__scopeId", "data-v-8a285510"]]);
function P1(e) {
  const t = D(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return De(() => n.observe(e.value)), wt(() => n.disconnect()), t;
}
const q1 = { class: "chat-dock-fold" }, W1 = ["aria-label"], F1 = { class: "chat-dock-head" }, H1 = { class: "chat-dock-inner" }, $o = 700, U1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = D(null), s = D(null), a = P1(s), o = D(!1);
    let r = 0;
    return De(() => r = setTimeout(() => o.value = !0, $o)), wt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: te(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", q1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: te(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          ye(i.$slots, "edge"),
          p("header", F1, [
            ye(i.$slots, "head")
          ]),
          p("div", {
            class: te(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", H1, [
              p("div", {
                class: te(["chat-dock-grow", { settled: o.value }]),
                style: $e(z(a) === null ? null : { height: `${z(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  ye(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, W1)
      ])
    ], 2));
  }
}, xo = /* @__PURE__ */ J(U1, [["__scopeId", "data-v-63e4dcfc"]]), V1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, In = 5, z1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(In, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${In}s`, animationDelay: `${(n - In).toFixed(2)}s` };
    return (a, o) => (l(), d("span", V1, [
      p("i", { style: s })
    ]));
  }
}, G1 = /* @__PURE__ */ J(z1, [["__scopeId", "data-v-d0c4b012"]]), _o = wo("/api/docks", "docks"), Jv = _o.fetchAll, ls = _o.find, K1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), cs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), Y1 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), J1 = (e) => e.kept ? cs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : cs("keep", "pin", "Pin", `dock keep ${e.id}`);
function Z1(e, t) {
  var n;
  return [
    ...Y1(e, t) ? [J1(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || jt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    cs("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const X1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: K1(e, t),
  buttons: Z1(e, t)
}), Q1 = { class: "dock-title" }, ep = ["aria-expanded", "title"], tp = { class: "chat-dock-acts dock-acts" }, np = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, sp = {
  key: 1,
  class: "dock-text"
}, ap = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = C(() => ls(s.item.type)), o = D(null), r = C(() => X1(s.item, a.value)), i = Ce(Ne), c = D(/* @__PURE__ */ new Set()), u = D("");
    async function f(_) {
      if (_.action === "open") return it(`${s.item.target_model}:${s.item.target_id}`);
      if (_.action !== "declared") return is(_, s.item, i.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, _.label]), u.value = "";
      const A = await is(_, s.item, i.environment);
      (A == null ? void 0 : A.ok) === !1 && (c.value = new Set([...c.value].filter((N) => N !== _.label)), u.value = A.error);
    }
    const g = C(() => r.value.buttons.filter((_) => _.action !== "undock" && !c.value.has(_.label))), b = C(() => r.value.buttons.find((_) => _.action === "undock"));
    return (_, A) => (l(), G(xo, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: U(() => [
        e.leaving ? (l(), G(G1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : I("", !0)
      ]),
      head: U(() => {
        var N, w, M;
        return [
          (N = a.value) != null && N.draws_head ? (l(), d("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(ee, { key: 1 }, [
            F(ke, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", Q1, k(r.value.title), 1)
          ], 64)),
          (w = a.value) != null && w.badge ? (l(), d("span", {
            key: 2,
            class: te(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, k(a.value.badge), 3)) : I("", !0),
          (M = a.value) != null && M.draws_head ? I("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: A[0] || (A[0] = (H) => n("fold"))
          }, [
            F(Rt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, ep)),
          p("span", tp, [
            (l(!0), d(ee, null, re(g.value, (H) => (l(), G(we, {
              key: H.action + H.runs,
              small: "",
              kind: H.primary ? "primary" : "ghost",
              bordered: !H.primary,
              "data-dock-action": H.action,
              onClick: (V) => f(H)
            }, {
              default: U(() => [
                de(k(H.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          F(ws, {
            title: b.value.label,
            "data-dock-action": "undock",
            onClick: A[1] || (A[1] = (H) => f(b.value))
          }, null, 8, ["title"])
        ];
      }),
      default: U(() => {
        var N, w;
        return [
          u.value ? (l(), d("p", np, k(u.value), 1)) : I("", !0),
          e.item.text && !((N = a.value) != null && N.body_url) ? (l(), d("p", sp, k(e.item.text), 1)) : I("", !0),
          (w = a.value) != null && w.body_url ? (l(), G(rs, {
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
}, ca = /* @__PURE__ */ J(ap, [["__scopeId", "data-v-608c189e"]]), op = ["title", "aria-label"], rp = { class: "run-chip-in" }, ip = {
  key: 0,
  class: "run-chip-ring"
}, lp = { class: "run-chip-name" }, cp = { class: "run-chip-bar" }, up = "processes.output", dp = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var f;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((f = Ce(Ne, null)) == null ? void 0 : f.environment) ?? "", o = D(null), r = C(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = C(() => {
      var g, b;
      return ((g = o.value) == null ? void 0 : g.title) || ((b = o.value) == null ? void 0 : b.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = C(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const g = await At(up, ["process", "card", String(s.item.target_id)], a);
      g.ok && (o.value = g.value);
    }
    return bo(u, () => r.value), (g, b) => {
      var _;
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: $e({ "--tone": c.value })
      }, [
        p("span", rp, [
          r.value ? (l(), d("span", ip)) : (l(), G(Ve, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", lp, k(i.value), 1)
        ]),
        p("span", cp, [
          p("i", {
            style: $e({ width: r.value ? `${((_ = o.value) == null ? void 0 : _.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, op);
    };
  }
}, hp = /* @__PURE__ */ J(dp, [["__scopeId", "data-v-2036e274"]]), fp = 24, pp = 8, Zv = 420;
function Xv({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= fp && e > t ? !0 : e < t && a > pp ? !1 : null;
}
const mp = (e, t) => e === void 0 ? t : e, gp = 6, vp = 3, ua = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Et = (e) => !!(e.leaves_at && !e.kept), yp = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Et(e) || t < e.leaves_at || n.has(e.id)), wp = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => yp(s, t, n)).sort((s, a) => s.id - a.id);
function kp(e, t, n = gp) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const bp = (e, t) => e >= vp ? !0 : e <= 1 ? !1 : t, $p = {
  key: "runs-head",
  class: "dock-runs-head"
}, xp = { class: "dock-runs-chips" }, _p = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = D(Date.now() / 1e3), s = D(/* @__PURE__ */ new Set()), a = D(!1), o = D(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ae(() => clearInterval(r));
    const i = C(() => wp(t.items, n.value, s.value)), c = C(() => kp(i.value.filter((H) => ua(H, ls)), n.value)), u = C(() => i.value.filter((H) => !c.value.includes(H) && !ua(H, ls))), f = C(() => (a.value = bp(c.value.length, a.value)) && !o.value), g = D({}), b = (H) => mp(g.value[H.id], t.folded);
    function _(H) {
      g.value = { ...g.value, [H.id]: !b(H) };
    }
    function A(H) {
      g.value = { ...g.value, ...Object.fromEntries(c.value.map((V) => [V.id, V.id !== H.id])) }, o.value = !0;
    }
    function N() {
      g.value = Object.fromEntries(Object.entries(g.value).filter(([H]) => !c.value.some((V) => String(V.id) === H))), o.value = !1;
    }
    function w(H) {
      s.value = /* @__PURE__ */ new Set([...s.value, H.id]);
    }
    function M(H) {
      s.value = new Set([...s.value].filter((V) => V !== H.id));
    }
    return (H, V) => (l(), G(ka, {
      tag: "div",
      name: "dock",
      duration: z($o),
      class: "dock-stack"
    }, {
      default: U(() => [
        (l(!0), d(ee, null, re(u.value, (y) => (l(), G(ca, {
          key: y.id,
          item: y,
          class: te({ timed: z(Et)(y) }),
          leaving: z(Et)(y) && !s.value.has(y.id),
          folded: b(y),
          onFold: (m) => _(y),
          onMouseenter: (m) => w(y),
          onMouseleave: (m) => M(y)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (l(), d("div", $p, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: N
          }, [
            de(k(c.value.length) + " runs ", 1),
            F(Rt, { open: "" })
          ])
        ])) : I("", !0),
        (l(!0), d(ee, null, re(f.value ? [] : c.value, (y) => (l(), G(ca, {
          key: y.id,
          item: y,
          class: te({ timed: z(Et)(y) }),
          leaving: z(Et)(y) && !s.value.has(y.id),
          folded: b(y),
          onFold: (m) => _(y),
          onMouseenter: (m) => w(y),
          onMouseleave: (m) => M(y)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        f.value ? (l(), G(xo, {
          key: "runs-row",
          label: `${c.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: U(() => [
            p("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: V[0] || (V[0] = (y) => o.value = !0)
            }, [
              F(Ve, { name: "runs" }),
              de(" " + k(c.value.length) + " runs ", 1),
              F(Rt)
            ]),
            p("span", xp, [
              (l(!0), d(ee, null, re(c.value, (y) => (l(), G(hp, {
                key: y.id,
                item: y,
                onClick: (m) => A(y)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : I("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, Qv = /* @__PURE__ */ J(_p, [["__scopeId", "data-v-98291381"]]), Ct = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, en = (e) => Math.min(Math.max(e, 0), 1), Mp = (e) => {
  const t = en(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => Mp((e - t) / (n - t));
function ey(e) {
  const t = en(e), n = en((t - 0.12) / 0.76) * Ct.shuffles, s = Math.min(Math.floor(n), Ct.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), r = et(a, 0.38, 0.76), i = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), c = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), u = Math.sin(Math.PI * en((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / Ct.shuffles, lift: Ct.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const Mo = 2400, Sp = 0.05;
function ty({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, Sp), r = Math.min(t + Mo * o, a), i = e + r * o;
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
}, us = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Ep = (e) => e * e * (3 - 2 * e), dn = (e, [t, n]) => Ep(us(e, t, n)), Cp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Yt = ([e, t], n) => e + n() * (t - e);
function Ap(e) {
  return Cp.map(() => {
    const t = Yt(Ye.speed, e), n = Yt(Ye.angle, e) * Math.PI / 180, s = Yt(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Yt(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const Op = Ap(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Tp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function ny(e, t, n = Op) {
  const s = Ze.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = Tp(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const c = Math.min(a, r), u = s.from.map((f, g) => f + o.velocity[g] * c);
  return u[2] -= Ye.gravity * c * c / 2, { at: u, turn: o.spin * c, landed: Math.max(0, a - r) / i };
}
function sy(e, t) {
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
const ay = () => Array.from({ length: Ze.pogo.count }, (e, t) => Ze.pogo.bounce * (t + 1) / Ze.pogo.count), oy = { stride: 0.5 };
function So(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: us(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: us(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function ry(e) {
  const { into: t, out: n } = So(Ze.rope_swing, e);
  return 1 - dn(t, [0, 1]) * (1 - dn(n, [0, 1]));
}
function iy(e) {
  const t = Ze.rope_swing, { into: n, out: s } = So(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return dn(n, [0, 1]) * (1 - dn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Bp = { after: 3 }, Ip = 10, Rp = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Lp = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Dp = { weight: 19 }, Np = {
  build: { cooldown: 180 }
}, jp = { every: 120 }, Eo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Co = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Pp = {
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
}, Wt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Ip }), ne = (e, t, n = {}) => Wt(e, "clip", t, n), Rn = (e, t, n = {}) => Wt(e, "look", t, n), da = (e, t, n = {}) => Wt(e, "gaze", t, n), ue = (e, t, n = {}, s = {}) => ({ ...Wt(e, "pick", t, n), ...s }), pe = (e) => Wt("nothing", "nothing", e, {}), qp = 120, Wp = 300, Ln = (e, t) => ({ ...ne(e, t), cooldown: Wp }), Fp = 120, se = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Hp = () => [ne("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: Rp[e.name] }), St = (e) => ({ ...e, shenanigan: !0, lasts: Lp[e.name] }), Es = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...se("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ne("nod", 2), pe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...se("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...nt(ne("bug_shot", 3)), toward: "", onto: !1 },
    { ...nt(ne("bug_smash", 2)), toward: "", onto: !1 },
    ne("nod", 2)
  ]),
  ...se("tests_failed", { cooldown: 20, toward: "card" }, [ne("startled", 2), ne("dismay", 1), ne("tantrum", 3), pe(1)]),
  ...se("committed", { cooldown: 30, toward: "card", onto: !0 }, [ne("nod", 2), pe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...se("sin_fixed", { cooldown: 300 }, [ne("halo", 1), pe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...se("sin_committed", { cooldown: 300 }, [ne("repent", 1), pe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...se("messaged", { cooldown: Fp }, [ne("phone_call", 1)]),
  ...se("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ne("nod", 4), ne("hand_rub", 4), pe(7)]),
  ...se("question_asked", { cooldown: 60 }, [ne("ask_sign", 9), ne("look_up", 3), pe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...se("reported", { cooldown: 90 }, [da("read", 3), ne("nod", 1), pe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...se("read_message", { cooldown: 30 }, [da("read", 3), pe(1)]),
  ...se("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), pe(6)]),
  ...se("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), pe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...se("bar_done", { holds: !0 }, Hp()),
  ...se("bar_failed", { holds: !0 }, [ne("fume", 1), ne("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...se("standing", { cooldown: 12 }, [ne("look_left", 2), ne("look_right", 2), ne("look_up", 1), pe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...se("launched", { cooldown: 300 }, [ne("tumble", 3), pe(47)]),
  // a break from the hammering now and then
  ...se("building", { cooldown: 30 }, [ne("wipe_brow", 4), ne("look_left", 1), ne("look_right", 1), pe(69)]),
  ...se("failed", { cooldown: 20, toward: "card" }, [ne("shake", 3), ne("tantrum", 2), pe(2)]),
  ...se("refused", { cooldown: 20 }, [ne("shake", 1), pe(1)]),
  ...se("work_done", { cooldown: 120 }, [ne("stretch", 2), pe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...se("pondering", { cooldown: [30, 60] }, [ue("ponder", 1)]),
  ...se("thought_cloud", { cooldown: 90 }, [ue("cloud", 1)]),
  ...se("light_bulb", { cooldown: 150 }, [ue("bulb", 1)]),
  ...se("answered", { cooldown: 15 }, [Rn("amused", 3), pe(2)]),
  ...se("heard", { cooldown: 30 }, [
    ne("bow", 1, { voices: ["butler"] }),
    ne("salute", 1, { voices: ["squire"] }),
    ne("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    pe(1)
  ]),
  ...se("long_walk", { cooldown: 90 }, [ne("stumble", 3), pe(22)]),
  ...se("card_arrived", { cooldown: 20, toward: "card" }, [ne("glance", 7), pe(13)]),
  ...se("typing", { cooldown: 60 }, [Rn("reading", 1), pe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Pp).flatMap(([e, t]) => se(`reacted:${e}`, {}, [Rn(t, 1)])),
  ...Object.entries(Eo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => se(`agent_reacted:${n}`, {}, [ne(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Co).flatMap(([e, t]) => se(`agent_reacted:${e}`, {}, [ne(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...se("pastime", {}, [
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
    { ...St(nt(ne("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    St(nt(ne("disco", 2, { ball: "bubble" }))),
    pe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...se("held:search", { cooldown: qp }, [Ln("search", 3), { ...Ln("binoculars", 2), when: { home: !0 } }, { ...Ln("glass_bubble", 2), when: { bubble: !0 } }]),
  ...se("held:type", {}, [ne("type", 3), ne("type_ponder", 1)]),
  ...se("held:watch", {}, [ne("watch", 2), ne("wave_up", 1)]),
  ...se("held:compacting", {}, [ne("pack_box", 3), ne("vacuum", 2), ne("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...se("spell", {}, [ue("writing", 12, { state: "writing" }), ue("reading", 12, { state: "reading" }), ue("searching", 12, { state: "searching" }), pe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...se("tickled", {}, [{ ...nt(ne("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...se("eager", {}, [ne("eager", 2, { slow: !0 }), pe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...se("jump", {}, [St(nt(ne("backflip", 7, { high: !0 }))), ne("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...se("climb", {}, [ue("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...se("unit", { cooldown: Np.build.cooldown }, [ue("unit", Dp.weight), pe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...se("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...se("carrier", {}, [ue("ufo", 3), ue("crane", 1)]),
  ...se("crane_from", {}, [ue("left", 1), ue("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...se("perch", {}, [{ ...ue("hang", 1, { hands: !0, free: !0 }), cooldown: jp.every }, ue("stand", 5)]),
  // a digit a blow's dust lets out
  ...se("digit", {}, [ue("0", 1), ue("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...se("roam", {}, [
    ue("rest", 35, {}, { stay: [25, 60] }),
    ue("seat", 15, {}, { stay: [15, 40] }),
    ue("edge", 25, {}, { stay: [8, 20] }),
    St(ue("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ue("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ue("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ue("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ue("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ue("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    St(nt(ue("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...se("laptop", {}, [ue("seat", 6, {}, { stay: [60, 150] }), ue("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...se("ledge_at", {}, [ue("middle", 2, {}, { along: 1 / 2 }), ue("third", 1, {}, { along: 1 / 3 }), ue("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...se("composed_as", {}, [
    ue("facing", 4, {}, { turn: 0, leans: 0 }),
    ue("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ue("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ue("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ue("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Up = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Ao = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Vp = (e) => Array.isArray(e) ? e[0] : e, zp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Gp(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || Ao(f).every(([g, b]) => n(g) >= Vp(b)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Es.filter((f) => Up(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Bp.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = i.filter((f) => {
    var g;
    return f.kind === "nothing" || f.name !== ((g = e.tally) == null ? void 0 : g.last);
  });
  return c.some((f) => f.kind !== "nothing") ? c : i;
}
function Kp(e, t) {
  const n = Gp(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Oo(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Oo(e, t, n) {
  var s;
  for (const [a, o] of Ao(t)) (s = e.memory) == null || s.set(a, e.now + zp(o, n));
}
function ly(e, t, n) {
  Oo(e, Es.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const ha = {
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
}, cy = {
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
}, uy = 120, dy = (e) => ha[e] || ha.idle;
[.../* @__PURE__ */ new Set([...Object.values(Eo).flatMap((e) => Object.keys(e)), ...Object.keys(Co)])];
const Be = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function hy(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Be.ahead * n ? 180 : Math.sign(s) * Be.turn;
}
const fa = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function fy(e, t) {
  const n = Math.min(Be.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Be.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Be.lines, Math.floor((e.bottom - e.top - 2 * s) / Be.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Be.sweep) % a, i = o % Be.sweep, c = Be.sweep - Be.returnSeconds, u = fa((i - c) / Be.returnSeconds), f = i <= c ? fa(i / c) : 1 - u, g = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + g * Be.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Yp = 1, Jp = (e, t, n, s, a, o = 0) => Kp({ moment: "jump", high: e > Yp * t, memory: s, now: a, room: o }, n).name === "backflip", pa = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, py = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, my = { width: 24, height: 27, top: 3, units: 2 }, Zp = "[data-figure-pile]", gy = { amber: [1, 0.69, 0.125], good: pa.colours.good, bad: pa.colours.bad }, Dn = { phases: 4, dim: 0.25 }, vy = (e, t, n) => e !== "amber" || (t + n) % Dn.phases < Dn.phases / 2 ? 1 : Dn.dim, Xp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Es.filter((e) => Xp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const yy = {
  width: 84,
  belly: 13,
  blink: 4
}, ma = "[data-figure-home]", Ft = () => {
  var t;
  const e = document.querySelector(ma);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ma)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Qp = "[data-figure-docked-bars]", em = "[data-figure-chat-foot]", tm = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", nm = "[data-figure-newest]";
function sm() {
  var s, a;
  const e = (s = Ft()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(nm), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Cs(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function To(e, t, n = sm()) {
  if (!e || !n) return !0;
  const s = bt(e, t), a = As(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = Ct.gap;
  return !Ro(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const Nn = 0.26, am = 0.54, $n = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Nn, travels: "stand" },
  lounge: { drop: Nn, travels: "stand" },
  composed: { drop: Nn, travels: "stand" },
  hang: { drop: am, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Bo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), om = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), wy = (e, t) => (e === "sit" ? om.has(t) : Bo.has(e)) ? e : "stand", ky = 0.25, by = (e, t) => Bo.has(e) && $n[t].drop === 0, Io = 2, rm = 90, im = 180, lm = 140, cm = 280, um = 420, dm = 0.25, hm = 290, fm = 600, pm = "cubic-bezier(0.2, 0.7, 0.4, 1)", mm = "cubic-bezier(0.55, 0, 0.9, 0.6)", jn = 5;
function hn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: f = 0, room: g = 0, pogo: b = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < jn) return null;
  (r || i) && (o = Math.max(o, Io));
  const _ = o > 1, A = Math.abs(t.x - e.x), N = A < jn ? 0 : A / (rm * o) * 1e3, w = Math.min(N, _ ? lm : im), M = Math.abs(t.y - e.y), H = t.y < e.y, V = H && !b && Jp(M, n, c, u, f, g), y = H ? um + Math.min(M, 400) * dm : Math.sqrt(2 * M / Mo) * 1e3, m = {
    x: t.x,
    y: t.y,
    ms: M > jn ? V ? fm : y : 0,
    lead: V ? hm : H ? cm : 0,
    easing: H ? pm : mm,
    hopping: !0,
    clip: V ? "backflip" : H ? "jump" : "fall"
  }, R = { x: t.x, y: t.y, ms: N + w, lead: 0, easing: "linear", ramp: w, ..._ ? { clip: "run" } : {} }, O = b ? gm(t, n) : m, q = H && !s ? [{ ...R, y: e.y }, O] : [{ ...m, x: e.x }, R];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !a, pace: o, running: _ };
}
const gm = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), bt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - $n[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Ro = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Cs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function $t() {
  var t;
  const e = (t = Ft()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Jt = 0.5, ga = 20;
function $y(e, t, n = $t()) {
  const s = bt(e, t);
  return s.left >= n.left + ga && s.right <= n.right - ga;
}
function Lo(e, t, n = $t()) {
  const s = bt(e, t), a = s.right - s.left, o = As(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Jt && i <= n.right + Jt && s.top >= n.top - Jt && c <= n.bottom + Jt;
}
const fn = [0.35, 0.5, 0.65], pn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: fn[0], right: fn.at(-1), top: pn[0], bottom: pn.at(-1) }, vm = 0.24;
function As(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + vm * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function ym(e, { size: t }, n = $t()) {
  const s = As(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const wm = (Je.right - Je.left) / 2 + 0.08;
function km(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !Cs(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const c of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[c].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, c), u.setEnd(o, c + 1), [...u.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const bm = (e) => pn.flatMap(
  (t) => fn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function $m(e, t, n = "") {
  if (!To(e, t)) return fn.length * pn.length;
  const s = bt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(tm)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && Ro(a, c) && Cs(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return bm(a).filter(([i, c]) => r(i, c) || km(i, c, n)).length;
}
function xm(e, t, n) {
  const s = $t(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Lo(r, t, s) && To(r, t)).map((r) => ({ spot: r, covered: $m(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Do = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, _m = wm, Mm = (e, t, { size: n }, s = _m) => Sm(e, Do[t], s * n, "stand");
function Sm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const xy = (e) => ((e + 180) % 360 + 360) % 360 - 180, _y = { turns: [-20, -10, 0, 10, 20] }, Em = 7;
function Cm() {
  const e = [...document.querySelectorAll(Zp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const Am = 4;
function Om() {
  const e = No(), t = Cm(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Am || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Em - n, 0) } };
}
const My = ({ size: e, below: t }) => (1 - t) * e;
function Tm(e, t) {
  const n = $t(), { size: s, below: a } = t, o = $n[e.posture].drop * s;
  return { ...ym(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Bm = (e, t) => Object.keys(Do).map((n) => Tm(Mm(e, n, t), t)), Im = (e, t, n) => xm(e, t, n) ?? e[0];
function Sy(e, t) {
  const { element: n, edge: s } = Om();
  return { ...Im(Bm(s, e), e, t), view: null, on: n };
}
function No() {
  var s;
  const e = Ft(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Qp);
  if (!t) return { ...jo(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function jo() {
  const e = Ft();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const Rm = { climb: 90 };
function Ey(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: f = 0, room: g = 0, pogo: b = !1 } = {}) {
  (o || r) && (a = Math.max(a, Io));
  const _ = (V) => {
    const y = bt(V, n, $n[V.posture].travels);
    return { x: y.left, y: y.top };
  }, A = t.ladder ?? e.ladder;
  if (A && !(t.ladder && e.ladder)) return Lm(_(e), _(t), _({ ...A.foot, posture: "stand" }), A.way, !!t.ladder, n, a);
  const [N, ...w] = [e, ...c, t].map(_), M = hn(N, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: f, room: g, pogo: b }), H = w.slice(1).map((V, y) => {
    var m;
    return (m = hn(w[y], V, n.size, { random: i, memory: u, now: f, room: g })) == null ? void 0 : m.legs.find((R) => R.hopping);
  });
  return M && { ...M, legs: [...M.legs, ...H.filter(Boolean)] };
}
function Lm(e, t, n, s, a, o, r) {
  const i = (f, g) => ({ x: g.x, y: g.y, ms: Math.hypot(g.x - f.x, g.y - f.y) / Rm.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? hn(e, n, o.size, { pace: r }) : hn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const Dm = "[data-figure-bubble]", Nm = 250;
let Ot = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Po = 0;
const qo = () => Ot, Pn = /* @__PURE__ */ new WeakMap();
let jm = 0;
function Wo(e) {
  return Pn.has(e) || Pn.set(e, `floor-${++jm}`), Pn.get(e);
}
const Pm = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, qm = () => {
  var e, t;
  return ((t = (e = Ft()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Wm(e, t) {
  var s;
  const n = (s = e.querySelector(em)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Fm(e, t) {
  const n = e && Wm(e, t), s = e ? [...e.querySelectorAll(Dm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Pm(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Wo(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Hm = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Nm ? (t.top - s.top) / a * 1e3 : 0;
};
function Um(e = Ot, t = performance.now()) {
  const n = $t(), s = qm(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = No(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = jo();
  return u.element && c.push({ id: Wo(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...Fm(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((f) => Object.freeze({ ...f, vy: Hm(e, f, t) }))) });
}
const ds = /* @__PURE__ */ new Set();
function Vm(e) {
  return ds.add(e), () => ds.delete(e);
}
function zm() {
  Fo();
  const e = () => {
    Po = requestAnimationFrame(e), !document.hidden && (Ot = Um(Ot), ds.forEach((t) => t(Ot)));
  };
  e();
}
function Fo() {
  cancelAnimationFrame(Po);
}
const Gm = (e, t) => e.find((n) => n.id === t) ?? null;
function Cy(e, t, n = qo().floors) {
  const s = Gm(n, "home");
  return e.posture === "hang" && s && bt(e, t).bottom >= s.top ? !1 : Lo(e, t);
}
const Km = ["data-kind"], Ym = { class: "figure-floor-name" }, Jm = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", Ym, k(e.floor.kind), 1)
    ], 12, Km));
  }
}, Zm = /* @__PURE__ */ J(Jm, [["__scopeId", "data-v-8f6132da"]]), Xm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Qm = {
  __name: "FigureFloors",
  setup(e) {
    const t = mn(qo().floors);
    let n = () => {
    };
    return De(() => {
      n = Vm((s) => t.value = s.floors), zm();
    }), Ae(() => {
      n(), Fo();
    }), (s, a) => (l(), d("div", Xm, [
      (l(!0), d(ee, null, re(t.value, (o) => (l(), G(Zm, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Ay = /* @__PURE__ */ J(Qm, [["__scopeId", "data-v-e519168b"]]), qn = (e) => typeof e == "number" ? e : Date.parse(e);
function Oy(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: qn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => qn(a.row.created_at) - qn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const eg = 3, Wn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function tg(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Wn[n.grouping]) == null ? void 0 : s.call(Wn, e.row, n)) || "";
}
function ng(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Ty(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= eg ? [ng(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = tg(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const sg = 1e3;
function By() {
  const e = D(Date.now()), t = setInterval(() => e.value = Date.now(), sg);
  return wt(() => clearInterval(t)), e;
}
function Iy(e) {
  const t = ys(), n = D(null), s = D("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const ag = {
  class: "cards-page",
  "data-window-flush": ""
}, og = { class: "cards-bar" }, rg = { class: "cards-count" }, ig = { class: "cards" }, lg = {
  key: 1,
  class: "cards-note"
}, cg = {
  key: 2,
  class: "cards-note"
}, ug = ["data-row", "onClick"], dg = { class: "card-head" }, hg = { class: "card-age" }, fg = { class: "card-title" }, pg = { class: "card-foot" }, mg = {
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
    return (s, a) => (l(), d("div", ag, [
      p("div", og, [
        p("span", rg, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        F(we, ot({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: U(() => [
            F(ke, {
              name: "plus",
              size: 12
            }),
            de(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", ig, [
        e.loaded ? e.failure ? (l(), d("p", lg, k(e.failure), 1)) : e.rows.length ? I("", !0) : (l(), d("p", cg, "No " + k(e.noun) + "s yet", 1)) : (l(), G(kt, {
          key: 0,
          shape: "cards"
        })),
        (l(!0), d(ee, null, re(e.rows, (o) => (l(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          p("span", dg, [
            F(ke, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            de(" " + k(e.head(o)), 1),
            p("span", hg, k(z(Jn)(o.created_at)), 1)
          ]),
          p("span", fg, k(e.title(o)), 1),
          p("span", pg, k(e.foot(o)), 1)
        ], 8, ug))), 128))
      ]),
      ye(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Ry = /* @__PURE__ */ J(mg, [["__scopeId", "data-v-d72d528d"]]), va = "newest";
function Ly(e, { title: t, isOpen: n = null }) {
  const s = D(""), a = D(va), o = D("all"), r = C(() => {
    const i = s.value.trim().toLowerCase(), c = e.value.filter((u) => (!i || JSON.stringify(u).toLowerCase().includes(i)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === va ? c : [...c].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: r, hasStates: !!n };
}
const gg = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, vg = 40, yg = "top", wg = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var g;
    const n = e, s = (g = Ce(Ne, null)) == null ? void 0 : g.autoScroll, a = C(() => s === yg), o = D(null), r = D(!1), i = (b) => a.value ? b.scrollTop : b.scrollHeight - b.scrollTop - b.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function f() {
      r.value = i(o.value) >= vg;
    }
    return be(() => n.rowCount, async () => {
      await yt(), !r.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (b, _) => (l(), d("div", gg, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: te(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ye(b.$slots, "default", {}, void 0, !0)
      ], 34),
      F(Dt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: U(() => [
          rt(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            F(ke, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            _[0] || (_[0] = de(" Newest ", -1))
          ], 512), [
            [or, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Dy = /* @__PURE__ */ J(wg, [["__scopeId", "data-v-3accb764"]]), kg = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, bg = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Ce(Ne, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (l(), d("div", kg, [
      (l(!0), d(ee, null, re(z(s), (i) => {
        var c;
        return l(), G(we, {
          key: i.key,
          kind: "text",
          class: te(["inner-tab", { on: ((c = e.active) == null ? void 0 : c.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: U(() => [
            de(k(i.label) + " " + k(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, Ny = /* @__PURE__ */ J(bg, [["__scopeId", "data-v-cf3bb39f"]]), $g = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, xg = {
  key: 1,
  class: "menu-item-text"
}, _g = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: te(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), d("span", $g, k(e.checked ? "✓" : ""), 1)) : I("", !0),
      e.description ? (l(), d("span", xg, [
        p("span", null, [
          ye(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, k(e.description), 1)
      ])) : ye(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, hs = /* @__PURE__ */ J(_g, [["__scopeId", "data-v-c91b190e"]]), Mg = {}, Sg = { class: "menu-label" };
function Eg(e, t) {
  return l(), d("span", Sg, [
    ye(e.$slots, "default", {}, void 0, !0)
  ]);
}
const fs = /* @__PURE__ */ J(Mg, [["render", Eg], ["__scopeId", "data-v-aa955b3e"]]), Ho = /* @__PURE__ */ new WeakMap(), Cg = (e, t) => Ho.set(e, t);
function Ag(e, t) {
  for (let n = t; n; n = Ho.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Og(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Ag(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const ft = 8, Tg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = D(null), o = (h) => h ? `${h}px` : void 0, r = C(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = D({ w: 0, h: 0 }), c = D(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), g = (h) => {
      const E = h.closest(".pane, .float-window");
      return E ? f(E.getBoundingClientRect()) : u();
    }, b = (h, E) => `${Math.max(0, h ? Math.min(h, E) : E)}px`;
    function _(h, E) {
      return {
        below: h.bottom - E.bottom - s.gap - ft,
        above: E.top - h.top - s.gap - ft,
        across: h.right - h.left - 2 * ft
      };
    }
    function A(h) {
      const E = g(s.anchor), T = _(E, h);
      return i.value.w <= T.across && i.value.h <= Math.max(T.below, T.above) ? E : u();
    }
    const N = C(() => {
      if (!c.value) return r.value;
      const h = c.value, E = A(h), T = _(E, h), { w: P, h: Z } = i.value, K = s.align === "auto" ? h.left + h.right > E.left + E.right : s.align === "right", X = Si(K ? h.right - P : h.left, E.left + ft, Math.max(E.left + ft, E.right - P - ft)), me = Z > T.below && T.above > T.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: b(s.maxHeight, T.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: b(s.maxHeight, T.below) };
      return { ...r.value, ...me, left: `${X}px`, maxWidth: b(s.maxWidth, T.across) };
    }), w = n, M = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function H(h) {
      const E = M(), T = E.indexOf(document.activeElement);
      E[(T + h + E.length) % E.length].focus();
    }
    const V = { ArrowDown: () => H(1), ArrowUp: () => H(-1), Escape: () => w("close") }, y = (h) => V[h.key] && (h.preventDefault(), V[h.key]()), m = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let R = 0;
    const O = new ResizeObserver(() => {
      cancelAnimationFrame(R), R = requestAnimationFrame(m);
    });
    Og(a, (h) => s.anchor && !s.anchor.contains(h.target) && w("close"));
    const q = (h, E) => ["top", "left", "right", "bottom"].some((T) => Math.abs(h[T] - E[T]) > 1), $ = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let S = 0;
    function v() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || $(h)) return w("close");
        q(h, c.value) && (c.value = h);
      }
      S = requestAnimationFrame(v);
    }
    return De(() => {
      s.anchor && a.value && Cg(a.value, s.anchor), m(), a.value && O.observe(a.value), !s.plain && M()[0] && M()[0].focus(), v();
    }), Ae(() => {
      O.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(R);
    }), t({ element: a }), (h, E) => (l(), G($a, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", ot({
        ref_key: "panel",
        ref: a
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: N.value,
        onKeydown: y
      }), [
        ye(h.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Uo = /* @__PURE__ */ J(Tg, [["__scopeId", "data-v-3d203970"]]), Bg = {
  class: "search-bar",
  "data-search-bar": ""
}, Ig = { class: "search-bar-control" }, Rg = ["value", "placeholder", "aria-label"], Lg = ["aria-expanded"], Dg = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: n }) {
    const s = n, a = rr(), o = D(null), r = D(null), i = (u) => r.value = r.value ? null : u.currentTarget;
    function c() {
      var u;
      s("update:modelValue", ""), (u = o.value) == null || u.focus();
    }
    return t({ focus: () => {
      var u;
      return (u = o.value) == null ? void 0 : u.focus();
    } }), (u, f) => (l(), d("div", Bg, [
      p("div", Ig, [
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
          onInput: f[0] || (f[0] = (g) => s("update:modelValue", g.target.value)),
          onKeydown: Tt(c, ["esc"])
        }, null, 40, Rg),
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
        ], 8, Lg)) : I("", !0)
      ]),
      ye(u.$slots, "default", {}, void 0, !0),
      r.value ? (l(), G(Uo, {
        key: 0,
        anchor: r.value,
        align: "end",
        "min-width": 220,
        "max-width": 320,
        onClick: f[1] || (f[1] = Me(() => {
        }, ["stop"])),
        onClose: f[2] || (f[2] = (g) => r.value = null)
      }, {
        default: U(() => [
          ye(u.$slots, "menu", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : I("", !0)
    ]));
  }
}, Ng = /* @__PURE__ */ J(Dg, [["__scopeId", "data-v-c2f6060d"]]), jg = {
  class: "list-tools",
  "data-list-tools": ""
}, Pg = {
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
    return (s, a) => (l(), d("div", jg, [
      F(Ng, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, {
        menu: U(() => [
          F(fs, null, {
            default: U(() => [...a[1] || (a[1] = [
              de("Order", -1)
            ])]),
            _: 1
          }),
          (l(), d(ee, null, re(t, (o) => F(hs, {
            key: o.key,
            checked: e.tools.order.value === o.key,
            "data-list-order": o.key,
            onClick: (r) => e.tools.order.value = o.key
          }, {
            default: U(() => [
              de(k(o.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (l(), d(ee, { key: 0 }, [
            F(fs, null, {
              default: U(() => [...a[2] || (a[2] = [
                de("Show", -1)
              ])]),
              _: 1
            }),
            (l(), d(ee, null, re(n, (o) => F(hs, {
              key: o.key,
              checked: e.tools.state.value === o.key,
              "data-list-state": o.key,
              onClick: (r) => e.tools.state.value = o.key
            }, {
              default: U(() => [
                de(k(o.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : I("", !0)
        ]),
        default: U(() => [
          ye(s.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, jy = /* @__PURE__ */ J(Pg, [["__scopeId", "data-v-9a3cea5b"]]);
function Py() {
  const e = D(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const qg = 86400, ps = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Wg(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ps(t) - ps(e)) / qg);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function qy(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ps(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Wg(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Fn = 280, Hn = 240, Un = 120, Fg = 6, Hg = 14, Lt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Ug(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Hg}px)` }), e.offsetHeight, e.style.transition = `height ${Fn}ms ${Lt}`, e.style.height = `${r}px`;
  const i = a();
  let c = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - i;
    if (!c && f >= Fn && (c = !0, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${Lt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Fn + Hn) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function Wy(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Fg}px)` }), e.offsetHeight, e.style.transition = `opacity ${Un}ms ease-out, transform ${Un}ms ${Lt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - r < Un) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const Vg = 140, Zt = 220, zg = 5;
function Fy({ gap: e = Vg, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, zg);
    if (s = i.length > 0, !s) return;
    let c = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), c -= 1, c || t(o, e);
      });
  }
  const r = (i, c, u, f = Ug) => {
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
function Hy(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Zt}ms ${Lt}, opacity ${Zt}ms ease-in, margin ${Zt}ms ${Lt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Zt);
}
const Vo = "chat.pins.minimised", tn = D(Bt(Vo, !1));
function ya(e) {
  tn.value = e, gn(Vo, e);
}
function Gg(e) {
  const t = C(() => e()), n = C(() => tn.value ? [] : e()), s = () => ya(!tn.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => Ra(o) > a).length,
    (o, r) => o > r && ya(!1)
  ), { pins: t, visible: n, minimised: tn, toggle: s };
}
const Kg = ["title"], Yg = {
  key: 0,
  class: "pins-count"
}, Jg = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Gg(() => t.notices);
    return (o, r) => z(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: te(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = Me((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      F(ke, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (l(), d("span", Yg, k(z(n).length), 1)) : I("", !0)
    ], 10, Kg)) : I("", !0);
  }
}, Uy = /* @__PURE__ */ J(Jg, [["__scopeId", "data-v-c0d11526"]]), Zg = ["title"], Xg = ["title"], Qg = { class: "diff-card-dir" }, e0 = { class: "diff-card-name" }, t0 = { class: "diff-card-ago" }, n0 = ["title"], s0 = ["title"], a0 = {
  key: 0,
  class: "diff-card-note"
}, o0 = ["href"], r0 = ["src", "alt"], i0 = { class: "diff-card-rows" }, l0 = { class: "diff-row-num" }, c0 = { class: "diff-row-sign" }, u0 = { class: "diff-row-code" }, d0 = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = C(() => n.path.lastIndexOf("/") + 1), u = C(() => n.path.slice(0, c.value)), f = C(() => n.path.slice(c.value)), g = C(() => n.kind === "deleted"), b = C(() => r[n.kind]), _ = C(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), A = D("after"), N = C(() => A.value === "before" ? n.whole.old : n.whole.text), w = C(() => n.whole && n.whole.text !== void 0 ? N.value.split(`
`).map((S, v) => ({ line_type: A.value === "after" && _.value.has(v + 1) ? "add" : "ctx", line: v + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), M = D(!1), H = C(() => n.lines && !M.value && !n.whole), V = C(() => H.value ? w.value.slice(0, n.lines) : w.value), y = C(() => w.value.length - V.value.length), m = (S) => S.line === null || S.line_type === "del" ? "" : S.line, R = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, O = D(null), q = D(null);
    let $ = null;
    return De(() => {
      if (!q.value) return;
      let S = !0;
      $ = new ResizeObserver(() => {
        !O.value || !q.value || (O.value.style.transition = S ? "none" : "", O.value.style.height = `${q.value.offsetHeight}px`, S = !1);
      }), $.observe(q.value);
    }), Ae(() => $ && $.disconnect()), (S, v) => (l(), d("section", {
      class: te(["diff-card", { half: e.half, gone: g.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: g.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: v[2] || (v[2] = (h) => !g.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${z(a)}-click to open it`,
          onClick: o
        }, [
          p("span", Qg, k(u.value), 1),
          p("span", e0, k(f.value), 1),
          b.value ? (l(), d("span", {
            key: 0,
            class: te(["diff-card-badge", e.kind])
          }, k(b.value), 3)) : I("", !0)
        ], 8, Xg),
        p("span", {
          class: te(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        p("span", {
          class: te(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        p("span", t0, k(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: A.value === "after" ? "Show the file before" : "Show the file after",
          onClick: v[0] || (v[0] = Me((h) => A.value = A.value === "after" ? "before" : "after", ["stop"]))
        }, k(A.value === "after" ? "After" : "Before"), 9, n0)) : I("", !0),
        g.value ? I("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: te(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: v[1] || (v[1] = Me((h) => s("whole"), ["stop"]))
        }, [
          F(ke, {
            name: "file",
            size: 12
          })
        ], 10, s0))
      ], 8, Zg),
      e.whole && e.whole.error ? (l(), d("p", a0, k(e.whole.error), 1)) : I("", !0),
      !g.value && !e.folded ? (l(), d(ee, { key: 1 }, [
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
          }, null, 8, r0)
        ], 8, o0)) : (l(), d("div", {
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
            p("div", i0, [
              (l(!0), d(ee, null, re(V.value, (h, E) => (l(), d("div", {
                key: E,
                class: te(["diff-row", h.line_type, { fresh: e.fresh && h.edit === e.fresh }])
              }, [
                p("span", l0, k(m(h)), 1),
                p("span", c0, k(i[h.line_type]), 1),
                p("span", u0, k(R(h)), 1)
              ], 2))), 128)),
              y.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: v[3] || (v[3] = Me((h) => M.value = !0, ["stop"]))
              }, k(y.value) + " more " + k(y.value === 1 ? "line" : "lines"), 1)) : I("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : I("", !0)
    ], 2));
  }
}, Vy = /* @__PURE__ */ J(d0, [["__scopeId", "data-v-b6424f6e"]]), h0 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), G(we, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: U(() => [
        F(ke, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, f0 = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [{ word: "approve", label: "Approve", main: !0 }, He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, p0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, m0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], g0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], v0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], y0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], w0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], k0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? w0(t) : e === "agent" ? [...v0(t), ...g0(t)] : e === "check" ? y0(t) : e === "question" ? m0(t) : ((n = { plan: f0, task: p0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, b0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, $0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, x0 = { class: "ask-text" }, _0 = ["placeholder", "aria-label"], M0 = ["placeholder", "aria-label"], S0 = {
  key: 3,
  class: "moves"
}, E0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = C(() => k0(s.kind, s.row)), r = D(""), i = D(null), c = D(""), u = D("");
    be(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function f(_, A = "") {
      const N = await s.read([_.noun ?? s.kind, _.word, String(s.id), ..._.flag ? [_.flag, A] : _.positional ? [A] : [], ..._.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = N.ok ? "" : N.error, N.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const g = (_) => _.confirm ? i.value = _ : _.said ? f(_, _.said) : _.flag || _.positional ? (i.value = _, c.value = "") : f(_), b = () => c.value.trim() && f(i.value, c.value.trim());
    return t({ moves: o, press: g }), (_, A) => {
      var N;
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: te(["foot", { inline: e.inline }])
      }, [
        r.value ? (l(), d("p", b0, k(r.value), 1)) : I("", !0),
        (N = i.value) != null && N.confirm ? (l(), d("div", $0, [
          p("span", x0, k(i.value.confirm), 1),
          F(we, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: A[0] || (A[0] = (w) => f(i.value))
          }, {
            default: U(() => [
              de(k(i.value.label), 1)
            ]),
            _: 1
          }),
          F(we, {
            small: "",
            kind: "ghost",
            onClick: A[1] || (A[1] = (w) => i.value = null)
          }, {
            default: U(() => [...A[7] || (A[7] = [
              de("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (l(), d("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: Me(b, ["prevent"])
        }, [
          rt(p("input", {
            "onUpdate:modelValue": A[2] || (A[2] = (w) => c.value = w),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: A[3] || (A[3] = Tt(Me((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, _0), [
            [Gn, c.value]
          ]),
          i.value.opener ? rt((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": A[4] || (A[4] = (w) => u.value = w),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: A[5] || (A[5] = Tt(Me((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, M0)), [
            [Gn, u.value]
          ]) : I("", !0),
          F(we, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: U(() => [
              de(k(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(we, {
            small: "",
            kind: "ghost",
            onClick: A[6] || (A[6] = (w) => i.value = null)
          }, {
            default: U(() => [...A[8] || (A[8] = [
              de("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", S0, [
          (l(!0), d(ee, null, re(o.value, (w) => (l(), G(we, {
            key: w.word,
            small: "",
            kind: w.main ? "primary" : "ghost",
            "data-move": w.word,
            onClick: (M) => g(w)
          }, {
            default: U(() => [
              de(k(w.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : I("", !0);
    };
  }
}, C0 = /* @__PURE__ */ J(E0, [["__scopeId", "data-v-fffa0bf6"]]), A0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, O0 = { ...A0, done: "Completed" }, T0 = { class: "task-status-icon" }, B0 = ["width", "height", "aria-label"], I0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", T0, [
      F(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: U(() => [
          (l(), d("svg", {
            key: e.status,
            class: te(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": z(O0)[e.status]
          }, [
            F(vs, { value: e.status }, {
              blocked: U(() => [...n[0] || (n[0] = [
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
              done: U(() => [...n[1] || (n[1] = [
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
              started: U(() => [...n[2] || (n[2] = [
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
              asked: U(() => [...n[3] || (n[3] = [
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
              paused: U(() => [...n[4] || (n[4] = [
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
              planned: U(() => [...n[5] || (n[5] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: U(() => [...n[6] || (n[6] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, B0))
        ]),
        _: 1
      })
    ]));
  }
}, zo = /* @__PURE__ */ J(I0, [["__scopeId", "data-v-2ab7e404"]]), R0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), L0 = (e) => R0.has(e), Go = (e) => L0(e) ? "done" : e, D0 = { class: "facts" }, N0 = { class: "fact wide" }, j0 = { class: "fact-value" }, P0 = {
  key: 0,
  class: "fact"
}, q0 = { class: "fact-value" }, W0 = {
  key: 1,
  class: "fact"
}, F0 = { class: "fact-value" }, H0 = { class: "fact wide" }, U0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, V0 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = cn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return l(), d("div", D0, [
        p("div", N0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", j0, k((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", P0, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", q0, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : I("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", W0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", F0, "Agent " + k(e.task.holder_id), 1)
        ])) : I("", !0),
        p("div", H0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          F(Uh, {
            options: z(n),
            value: String(z(fo)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", U0, k(e.refusal), 1)) : I("", !0)
        ])
      ]);
    };
  }
}, z0 = /* @__PURE__ */ J(V0, [["__scopeId", "data-v-2018762d"]]), G0 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, K0 = ["onClick"], Y0 = { class: "wait-id" }, J0 = { class: "wait-title" }, Z0 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, X0 = { class: "text" }, Q0 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, ev = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, tv = 180, nv = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = D(!1);
    return (a, o) => (l(), d(ee, null, [
      e.task.waits.length ? (l(), d("section", G0, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (l(!0), d(ee, null, re(e.task.waits, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          F(zo, {
            status: z(Go)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", Y0, k(r.id), 1),
          p("span", J0, k(r.title), 1)
        ], 8, K0))), 128))
      ])) : I("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", Z0, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", X0, k(e.task.outcome), 1)
      ])) : I("", !0),
      e.task.brief ? (l(), d("section", Q0, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: te(["text", { clamped: !s.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > tv && !s.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : I("", !0)
      ])) : I("", !0),
      e.task.logs.length ? (l(), d("section", ev, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(ee, null, re(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, k(r.line), 1))), 128))
      ])) : I("", !0)
    ], 64));
  }
}, sv = /* @__PURE__ */ J(nv, [["__scopeId", "data-v-f411ce35"]]), av = { class: "comment-side-head" }, ov = {
  key: 0,
  class: "comment-none"
}, rv = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), d("aside", {
      class: te(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", av, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        F(ws, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? I("", !0) : (l(), d("p", ov, "No comments yet")),
      (l(!0), d(ee, null, re(e.comments, (s) => (l(), d("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, k(e.words(s)), 1))), 128))
    ], 2));
  }
}, iv = /* @__PURE__ */ J(rv, [["__scopeId", "data-v-19fdbdd4"]]), lv = ["data-comments-below"], cv = 600, uv = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = D(null), n = D(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < cv);
    return De(() => s.observe(t.value)), wt(() => s.disconnect()), (a, o) => (l(), d("div", {
      ref_key: "root",
      ref: t,
      class: te(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      ye(a.$slots, "default"),
      e.open ? (l(), G(iv, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : I("", !0)
    ], 10, lv));
  }
}, dv = /* @__PURE__ */ J(uv, [["__scopeId", "data-v-6c850df0"]]);
function hv(e, t) {
  const n = D([]), s = D(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: f, id: g, title: b } = e(), _ = `On ${f} ${g}, ${b}: `;
    return u.text.startsWith(_) ? u.text.slice(_.length) : u.text;
  };
  async function i() {
    const { kind: u, id: f } = e();
    if (!f) return;
    const g = ++o, b = await t([u, "comments", String(f)]);
    g === o && (n.value = b.ok ? b.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: f, id: g } = e(), b = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, b], s.value = !0;
    const _ = await t([f, "comment", String(g), u]);
    if (!_.ok)
      throw n.value = n.value.filter((A) => A !== b && A.id !== b.id), new Error(_.error);
    await i();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: c, load: i };
}
const fv = { class: "top" }, pv = {
  class: "crumb",
  "data-task-crumb": ""
}, mv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, gv = {
  key: 1,
  class: "body"
}, vv = { class: "stamp" }, yv = {
  class: "title",
  "data-resource-title": ""
}, wv = { class: "since" }, kv = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, bv = { class: "text" }, $v = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, xv = {
  key: 1,
  class: "note"
}, _v = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Mv = { class: "text" }, Sv = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = D(null), r = D(null), i = D(""), c = D(""), u = D(null), f = D(null), g = hv(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (y) => s.read(y));
    be(g.open, (y) => a("comments", y));
    let b = 0;
    const _ = Go, A = (y) => y.slice(0, 1).toUpperCase() + y.slice(1), N = C(() => {
      var y;
      return (y = r.value) != null && y.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function w() {
      const y = ++b, [m, R] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      y === b && (i.value = m.ok ? "" : m.error, o.value = m.ok ? m.value : null, r.value = R.ok ? R.value : null);
    }
    be(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, w();
    }, { immediate: !0 }), be(() => s.changes, w);
    async function M(y) {
      const m = o.value.priority;
      o.value.priority = Number(y);
      const R = await s.read(["task", "edit", String(s.id), "--priority", y]);
      if (c.value = R.ok ? "" : R.error, R.ok) return w();
      o.value.priority = m;
    }
    function H(y) {
      u.value = null, f.value.press(y);
    }
    const V = (y) => {
      var m;
      return ((m = f.value) == null ? void 0 : m.moves.length) && (u.value = y);
    };
    return t({ openStatus: V }), (y, m) => (l(), d("aside", {
      class: te(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", fv, [
        e.backed ? (l(), G(h0, {
          key: 0,
          onBack: m[0] || (m[0] = (R) => a("back"))
        })) : I("", !0),
        p("span", pv, k(N.value), 1),
        m[9] || (m[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(ee, { key: 1 }, [
          F(we, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: m[1] || (m[1] = (R) => a("step", -1))
          }, {
            default: U(() => [
              F(ke, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          F(we, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: m[2] || (m[2] = (R) => a("step", 1))
          }, {
            default: U(() => [
              F(ke, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : I("", !0),
        F(we, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: m[3] || (m[3] = (R) => a("close"))
        }, {
          default: U(() => [
            F(ke, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (l(), d("p", mv, k(i.value), 1)) : o.value ? (l(), d(ee, { key: 2 }, [
        F(dv, {
          open: z(g).open.value,
          comments: z(g).comments.value,
          words: z(g).words,
          onClose: m[6] || (m[6] = (R) => z(g).open.value = !1)
        }, {
          default: U(() => {
            var R;
            return [
              (l(), d("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", vv, "Task " + k(o.value.id) + " · updated " + k(z(Jn)(z(on)(o.value)) || "just now"), 1),
                p("h3", yv, k(o.value.title), 1),
                p("div", {
                  class: te(["state-line", z(_)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: m[4] || (m[4] = (O) => V(O.currentTarget))
                  }, [
                    F(zo, {
                      status: z(_)(o.value.state)
                    }, null, 8, ["status"]),
                    de(" " + k(A(o.value.state)), 1)
                  ]),
                  p("span", wv, "since " + k(z(Jn)(z(on)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", kv, [
                  m[10] || (m[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", bv, k(o.value.reason || "Other tasks"), 1),
                  (R = o.value.openers) != null && R.length ? (l(), d("p", $v, "Opens by itself when " + k(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", xv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", _v, [
                  m[11] || (m[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", Mv, k(o.value.reason), 1)
                ])) : I("", !0),
                F(z0, {
                  task: o.value,
                  place: r.value,
                  refusal: c.value,
                  onPriority: M
                }, null, 8, ["task", "place", "refusal"]),
                F(sv, {
                  task: o.value,
                  onSelect: m[5] || (m[5] = (O) => a("select", O))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        F(uo, {
          send: z(g).send,
          count: z(g).comments.value.length,
          onShow: m[7] || (m[7] = (R) => z(g).open.value = !z(g).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", gv, [
        F(kt)
      ])),
      F(C0, {
        ref_key: "footer",
        ref: f,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: w
      }, null, 8, ["id", "row", "read"]),
      u.value ? (l(), G(Uo, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: m[8] || (m[8] = (R) => u.value = null)
      }, {
        default: U(() => [
          F(fs, null, {
            default: U(() => [
              de("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(ee, null, re(f.value.moves, (R) => (l(), G(hs, {
            key: R.word,
            onClick: (O) => H(R)
          }, {
            default: U(() => [
              de(k(R.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : I("", !0)
    ], 2));
  }
}, zy = /* @__PURE__ */ J(Sv, [["__scopeId", "data-v-c76befc4"]]);
function Ev(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Vn = { exports: {} }, wa;
function Cv() {
  return wa || (wa = 1, (function(e, t) {
    var n = (function() {
      var s = function(m, R) {
        var O = 236, q = 17, $ = m, S = o[R], v = null, h = 0, E = null, T = [], P = {}, Z = function(B, L) {
          h = $ * 4 + 17, v = (function(x) {
            for (var j = new Array(x), W = 0; W < x; W += 1) {
              j[W] = new Array(x);
              for (var Q = 0; Q < x; Q += 1)
                j[W][Q] = null;
            }
            return j;
          })(h), K(0, 0), K(h - 7, 0), K(0, h - 7), me(), le(), qe(B, L), $ >= 7 && Se(B), E == null && (E = Ko($, S, T)), We(E, L);
        }, K = function(B, L) {
          for (var x = -1; x <= 7; x += 1)
            if (!(B + x <= -1 || h <= B + x))
              for (var j = -1; j <= 7; j += 1)
                L + j <= -1 || h <= L + j || (0 <= x && x <= 6 && (j == 0 || j == 6) || 0 <= j && j <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= j && j <= 4 ? v[B + x][L + j] = !0 : v[B + x][L + j] = !1);
        }, X = function() {
          for (var B = 0, L = 0, x = 0; x < 8; x += 1) {
            Z(!0, x);
            var j = i.getLostPoint(P);
            (x == 0 || B > j) && (B = j, L = x);
          }
          return L;
        }, le = function() {
          for (var B = 8; B < h - 8; B += 1)
            v[B][6] == null && (v[B][6] = B % 2 == 0);
          for (var L = 8; L < h - 8; L += 1)
            v[6][L] == null && (v[6][L] = L % 2 == 0);
        }, me = function() {
          for (var B = i.getPatternPosition($), L = 0; L < B.length; L += 1)
            for (var x = 0; x < B.length; x += 1) {
              var j = B[L], W = B[x];
              if (v[j][W] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? v[j + Q][W + oe] = !0 : v[j + Q][W + oe] = !1;
            }
        }, Se = function(B) {
          for (var L = i.getBCHTypeNumber($), x = 0; x < 18; x += 1) {
            var j = !B && (L >> x & 1) == 1;
            v[Math.floor(x / 3)][x % 3 + h - 8 - 3] = j;
          }
          for (var x = 0; x < 18; x += 1) {
            var j = !B && (L >> x & 1) == 1;
            v[x % 3 + h - 8 - 3][Math.floor(x / 3)] = j;
          }
        }, qe = function(B, L) {
          for (var x = S << 3 | L, j = i.getBCHTypeInfo(x), W = 0; W < 15; W += 1) {
            var Q = !B && (j >> W & 1) == 1;
            W < 6 ? v[W][8] = Q : W < 8 ? v[W + 1][8] = Q : v[h - 15 + W][8] = Q;
          }
          for (var W = 0; W < 15; W += 1) {
            var Q = !B && (j >> W & 1) == 1;
            W < 8 ? v[8][h - W - 1] = Q : W < 9 ? v[8][15 - W - 1 + 1] = Q : v[8][15 - W - 1] = Q;
          }
          v[h - 8][8] = !B;
        }, We = function(B, L) {
          for (var x = -1, j = h - 1, W = 7, Q = 0, oe = i.getMaskFunction(L), ae = h - 1; ae > 0; ae -= 2)
            for (ae == 6 && (ae -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (v[j][ae - ge] == null) {
                  var xe = !1;
                  Q < B.length && (xe = (B[Q] >>> W & 1) == 1);
                  var ie = oe(j, ae - ge);
                  ie && (xe = !xe), v[j][ae - ge] = xe, W -= 1, W == -1 && (Q += 1, W = 7);
                }
              if (j += x, j < 0 || h <= j) {
                j -= x, x = -x;
                break;
              }
            }
        }, ut = function(B, L) {
          for (var x = 0, j = 0, W = 0, Q = new Array(L.length), oe = new Array(L.length), ae = 0; ae < L.length; ae += 1) {
            var ge = L[ae].dataCount, xe = L[ae].totalCount - ge;
            j = Math.max(j, ge), W = Math.max(W, xe), Q[ae] = new Array(ge);
            for (var ie = 0; ie < Q[ae].length; ie += 1)
              Q[ae][ie] = 255 & B.getBuffer()[ie + x];
            x += ge;
            var Oe = i.getErrorCorrectPolynomial(xe), Te = u(Q[ae], Oe.getLength() - 1), Os = Te.mod(Oe);
            oe[ae] = new Array(Oe.getLength() - 1);
            for (var ie = 0; ie < oe[ae].length; ie += 1) {
              var Ts = ie + Os.getLength() - oe[ae].length;
              oe[ae][ie] = Ts >= 0 ? Os.getAt(Ts) : 0;
            }
          }
          for (var Bs = 0, ie = 0; ie < L.length; ie += 1)
            Bs += L[ie].totalCount;
          for (var xn = new Array(Bs), Ht = 0, ie = 0; ie < j; ie += 1)
            for (var ae = 0; ae < L.length; ae += 1)
              ie < Q[ae].length && (xn[Ht] = Q[ae][ie], Ht += 1);
          for (var ie = 0; ie < W; ie += 1)
            for (var ae = 0; ae < L.length; ae += 1)
              ie < oe[ae].length && (xn[Ht] = oe[ae][ie], Ht += 1);
          return xn;
        }, Ko = function(B, L, x) {
          for (var j = f.getRSBlocks(B, L), W = g(), Q = 0; Q < x.length; Q += 1) {
            var oe = x[Q];
            W.put(oe.getMode(), 4), W.put(oe.getLength(), i.getLengthInBits(oe.getMode(), B)), oe.write(W);
          }
          for (var ae = 0, Q = 0; Q < j.length; Q += 1)
            ae += j[Q].dataCount;
          if (W.getLengthInBits() > ae * 8)
            throw "code length overflow. (" + W.getLengthInBits() + ">" + ae * 8 + ")";
          for (W.getLengthInBits() + 4 <= ae * 8 && W.put(0, 4); W.getLengthInBits() % 8 != 0; )
            W.putBit(!1);
          for (; !(W.getLengthInBits() >= ae * 8 || (W.put(O, 8), W.getLengthInBits() >= ae * 8)); )
            W.put(q, 8);
          return ut(W, j);
        };
        P.addData = function(B, L) {
          L = L || "Byte";
          var x = null;
          switch (L) {
            case "Numeric":
              x = b(B);
              break;
            case "Alphanumeric":
              x = _(B);
              break;
            case "Byte":
              x = A(B);
              break;
            case "Kanji":
              x = N(B);
              break;
            default:
              throw "mode:" + L;
          }
          T.push(x), E = null;
        }, P.isDark = function(B, L) {
          if (B < 0 || h <= B || L < 0 || h <= L)
            throw B + "," + L;
          return v[B][L];
        }, P.getModuleCount = function() {
          return h;
        }, P.make = function() {
          if ($ < 1) {
            for (var B = 1; B < 40; B++) {
              for (var L = f.getRSBlocks(B, S), x = g(), j = 0; j < T.length; j++) {
                var W = T[j];
                x.put(W.getMode(), 4), x.put(W.getLength(), i.getLengthInBits(W.getMode(), B)), W.write(x);
              }
              for (var Q = 0, j = 0; j < L.length; j++)
                Q += L[j].dataCount;
              if (x.getLengthInBits() <= Q * 8)
                break;
            }
            $ = B;
          }
          Z(!1, X());
        }, P.createTableTag = function(B, L) {
          B = B || 2, L = typeof L > "u" ? B * 4 : L;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + L + "px;", x += '">', x += "<tbody>";
          for (var j = 0; j < P.getModuleCount(); j += 1) {
            x += "<tr>";
            for (var W = 0; W < P.getModuleCount(); W += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + B + "px;", x += " height: " + B + "px;", x += " background-color: ", x += P.isDark(j, W) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, P.createSvgTag = function(B, L, x, j) {
          var W = {};
          typeof arguments[0] == "object" && (W = arguments[0], B = W.cellSize, L = W.margin, x = W.alt, j = W.title), B = B || 2, L = typeof L > "u" ? B * 4 : L, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, j = typeof j == "string" ? { text: j } : j || {}, j.text = j.text || null, j.id = j.text ? j.id || "qrcode-title" : null;
          var Q = P.getModuleCount() * B + L * 2, oe, ae, ge, xe, ie = "", Oe;
          for (Oe = "l" + B + ",0 0," + B + " -" + B + ",0 0,-" + B + "z ", ie += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ie += W.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', ie += ' viewBox="0 0 ' + Q + " " + Q + '" ', ie += ' preserveAspectRatio="xMinYMin meet"', ie += j.text || x.text ? ' role="img" aria-labelledby="' + dt([j.id, x.id].join(" ").trim()) + '"' : "", ie += ">", ie += j.text ? '<title id="' + dt(j.id) + '">' + dt(j.text) + "</title>" : "", ie += x.text ? '<description id="' + dt(x.id) + '">' + dt(x.text) + "</description>" : "", ie += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ie += '<path d="', ge = 0; ge < P.getModuleCount(); ge += 1)
            for (xe = ge * B + L, oe = 0; oe < P.getModuleCount(); oe += 1)
              P.isDark(ge, oe) && (ae = oe * B + L, ie += "M" + ae + "," + xe + Oe);
          return ie += '" stroke="transparent" fill="black"/>', ie += "</svg>", ie;
        }, P.createDataURL = function(B, L) {
          B = B || 2, L = typeof L > "u" ? B * 4 : L;
          var x = P.getModuleCount() * B + L * 2, j = L, W = x - L;
          return y(x, x, function(Q, oe) {
            if (j <= Q && Q < W && j <= oe && oe < W) {
              var ae = Math.floor((Q - j) / B), ge = Math.floor((oe - j) / B);
              return P.isDark(ge, ae) ? 0 : 1;
            } else
              return 1;
          });
        }, P.createImgTag = function(B, L, x) {
          B = B || 2, L = typeof L > "u" ? B * 4 : L;
          var j = P.getModuleCount() * B + L * 2, W = "";
          return W += "<img", W += ' src="', W += P.createDataURL(B, L), W += '"', W += ' width="', W += j, W += '"', W += ' height="', W += j, W += '"', x && (W += ' alt="', W += dt(x), W += '"'), W += "/>", W;
        };
        var dt = function(B) {
          for (var L = "", x = 0; x < B.length; x += 1) {
            var j = B.charAt(x);
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
        }, Yo = function(B) {
          var L = 1;
          B = typeof B > "u" ? L * 2 : B;
          var x = P.getModuleCount() * L + B * 2, j = B, W = x - B, Q, oe, ae, ge, xe, ie = {
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
          for (Q = 0; Q < x; Q += 2) {
            for (ae = Math.floor((Q - j) / L), ge = Math.floor((Q + 1 - j) / L), oe = 0; oe < x; oe += 1)
              xe = "█", j <= oe && oe < W && j <= Q && Q < W && P.isDark(ae, Math.floor((oe - j) / L)) && (xe = " "), j <= oe && oe < W && j <= Q + 1 && Q + 1 < W && P.isDark(ge, Math.floor((oe - j) / L)) ? xe += " " : xe += "█", Te += B < 1 && Q + 1 >= W ? Oe[xe] : ie[xe];
            Te += `
`;
          }
          return x % 2 && B > 0 ? Te.substring(0, Te.length - x - 1) + Array(x + 1).join("▀") : Te.substring(0, Te.length - 1);
        };
        return P.createASCII = function(B, L) {
          if (B = B || 1, B < 2)
            return Yo(L);
          B -= 1, L = typeof L > "u" ? B * 2 : L;
          var x = P.getModuleCount() * B + L * 2, j = L, W = x - L, Q, oe, ae, ge, xe = Array(B + 1).join("██"), ie = Array(B + 1).join("  "), Oe = "", Te = "";
          for (Q = 0; Q < x; Q += 1) {
            for (ae = Math.floor((Q - j) / B), Te = "", oe = 0; oe < x; oe += 1)
              ge = 1, j <= oe && oe < W && j <= Q && Q < W && P.isDark(ae, Math.floor((oe - j) / B)) && (ge = 0), Te += ge ? xe : ie;
            for (ae = 0; ae < B; ae += 1)
              Oe += Te + `
`;
          }
          return Oe.substring(0, Oe.length - 1);
        }, P.renderTo2dContext = function(B, L) {
          L = L || 2;
          for (var x = P.getModuleCount(), j = 0; j < x; j++)
            for (var W = 0; W < x; W++)
              B.fillStyle = P.isDark(j, W) ? "black" : "white", B.fillRect(j * L, W * L, L, L);
        }, P;
      };
      s.stringToBytesFuncs = {
        default: function(m) {
          for (var R = [], O = 0; O < m.length; O += 1) {
            var q = m.charCodeAt(O);
            R.push(q & 255);
          }
          return R;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(m, R) {
        var O = (function() {
          for (var $ = H(m), S = function() {
            var le = $.read();
            if (le == -1) throw "eof";
            return le;
          }, v = 0, h = {}; ; ) {
            var E = $.read();
            if (E == -1) break;
            var T = S(), P = S(), Z = S(), K = String.fromCharCode(E << 8 | T), X = P << 8 | Z;
            h[K] = X, v += 1;
          }
          if (v != R)
            throw v + " != " + R;
          return h;
        })(), q = 63;
        return function($) {
          for (var S = [], v = 0; v < $.length; v += 1) {
            var h = $.charCodeAt(v);
            if (h < 128)
              S.push(h);
            else {
              var E = O[$.charAt(v)];
              typeof E == "number" ? (E & 255) == E ? S.push(E) : (S.push(E >>> 8), S.push(E & 255)) : S.push(q);
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
        ], R = 1335, O = 7973, q = 21522, $ = {}, S = function(v) {
          for (var h = 0; v != 0; )
            h += 1, v >>>= 1;
          return h;
        };
        return $.getBCHTypeInfo = function(v) {
          for (var h = v << 10; S(h) - S(R) >= 0; )
            h ^= R << S(h) - S(R);
          return (v << 10 | h) ^ q;
        }, $.getBCHTypeNumber = function(v) {
          for (var h = v << 12; S(h) - S(O) >= 0; )
            h ^= O << S(h) - S(O);
          return v << 12 | h;
        }, $.getPatternPosition = function(v) {
          return m[v - 1];
        }, $.getMaskFunction = function(v) {
          switch (v) {
            case r.PATTERN000:
              return function(h, E) {
                return (h + E) % 2 == 0;
              };
            case r.PATTERN001:
              return function(h, E) {
                return h % 2 == 0;
              };
            case r.PATTERN010:
              return function(h, E) {
                return E % 3 == 0;
              };
            case r.PATTERN011:
              return function(h, E) {
                return (h + E) % 3 == 0;
              };
            case r.PATTERN100:
              return function(h, E) {
                return (Math.floor(h / 2) + Math.floor(E / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(h, E) {
                return h * E % 2 + h * E % 3 == 0;
              };
            case r.PATTERN110:
              return function(h, E) {
                return (h * E % 2 + h * E % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(h, E) {
                return (h * E % 3 + (h + E) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + v;
          }
        }, $.getErrorCorrectPolynomial = function(v) {
          for (var h = u([1], 0), E = 0; E < v; E += 1)
            h = h.multiply(u([1, c.gexp(E)], 0));
          return h;
        }, $.getLengthInBits = function(v, h) {
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
        }, $.getLostPoint = function(v) {
          for (var h = v.getModuleCount(), E = 0, T = 0; T < h; T += 1)
            for (var P = 0; P < h; P += 1) {
              for (var Z = 0, K = v.isDark(T, P), X = -1; X <= 1; X += 1)
                if (!(T + X < 0 || h <= T + X))
                  for (var le = -1; le <= 1; le += 1)
                    P + le < 0 || h <= P + le || X == 0 && le == 0 || K == v.isDark(T + X, P + le) && (Z += 1);
              Z > 5 && (E += 3 + Z - 5);
            }
          for (var T = 0; T < h - 1; T += 1)
            for (var P = 0; P < h - 1; P += 1) {
              var me = 0;
              v.isDark(T, P) && (me += 1), v.isDark(T + 1, P) && (me += 1), v.isDark(T, P + 1) && (me += 1), v.isDark(T + 1, P + 1) && (me += 1), (me == 0 || me == 4) && (E += 3);
            }
          for (var T = 0; T < h; T += 1)
            for (var P = 0; P < h - 6; P += 1)
              v.isDark(T, P) && !v.isDark(T, P + 1) && v.isDark(T, P + 2) && v.isDark(T, P + 3) && v.isDark(T, P + 4) && !v.isDark(T, P + 5) && v.isDark(T, P + 6) && (E += 40);
          for (var P = 0; P < h; P += 1)
            for (var T = 0; T < h - 6; T += 1)
              v.isDark(T, P) && !v.isDark(T + 1, P) && v.isDark(T + 2, P) && v.isDark(T + 3, P) && v.isDark(T + 4, P) && !v.isDark(T + 5, P) && v.isDark(T + 6, P) && (E += 40);
          for (var Se = 0, P = 0; P < h; P += 1)
            for (var T = 0; T < h; T += 1)
              v.isDark(T, P) && (Se += 1);
          var qe = Math.abs(100 * Se / h / h - 50) / 5;
          return E += qe * 10, E;
        }, $;
      })(), c = (function() {
        for (var m = new Array(256), R = new Array(256), O = 0; O < 8; O += 1)
          m[O] = 1 << O;
        for (var O = 8; O < 256; O += 1)
          m[O] = m[O - 4] ^ m[O - 5] ^ m[O - 6] ^ m[O - 8];
        for (var O = 0; O < 255; O += 1)
          R[m[O]] = O;
        var q = {};
        return q.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return R[$];
        }, q.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return m[$];
        }, q;
      })();
      function u(m, R) {
        if (typeof m.length > "u")
          throw m.length + "/" + R;
        var O = (function() {
          for (var $ = 0; $ < m.length && m[$] == 0; )
            $ += 1;
          for (var S = new Array(m.length - $ + R), v = 0; v < m.length - $; v += 1)
            S[v] = m[v + $];
          return S;
        })(), q = {};
        return q.getAt = function($) {
          return O[$];
        }, q.getLength = function() {
          return O.length;
        }, q.multiply = function($) {
          for (var S = new Array(q.getLength() + $.getLength() - 1), v = 0; v < q.getLength(); v += 1)
            for (var h = 0; h < $.getLength(); h += 1)
              S[v + h] ^= c.gexp(c.glog(q.getAt(v)) + c.glog($.getAt(h)));
          return u(S, 0);
        }, q.mod = function($) {
          if (q.getLength() - $.getLength() < 0)
            return q;
          for (var S = c.glog(q.getAt(0)) - c.glog($.getAt(0)), v = new Array(q.getLength()), h = 0; h < q.getLength(); h += 1)
            v[h] = q.getAt(h);
          for (var h = 0; h < $.getLength(); h += 1)
            v[h] ^= c.gexp(c.glog($.getAt(h)) + S);
          return u(v, 0).mod($);
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
        ], R = function($, S) {
          var v = {};
          return v.totalCount = $, v.dataCount = S, v;
        }, O = {}, q = function($, S) {
          switch (S) {
            case o.L:
              return m[($ - 1) * 4 + 0];
            case o.M:
              return m[($ - 1) * 4 + 1];
            case o.Q:
              return m[($ - 1) * 4 + 2];
            case o.H:
              return m[($ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return O.getRSBlocks = function($, S) {
          var v = q($, S);
          if (typeof v > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + S;
          for (var h = v.length / 3, E = [], T = 0; T < h; T += 1)
            for (var P = v[T * 3 + 0], Z = v[T * 3 + 1], K = v[T * 3 + 2], X = 0; X < P; X += 1)
              E.push(R(Z, K));
          return E;
        }, O;
      })(), g = function() {
        var m = [], R = 0, O = {};
        return O.getBuffer = function() {
          return m;
        }, O.getAt = function(q) {
          var $ = Math.floor(q / 8);
          return (m[$] >>> 7 - q % 8 & 1) == 1;
        }, O.put = function(q, $) {
          for (var S = 0; S < $; S += 1)
            O.putBit((q >>> $ - S - 1 & 1) == 1);
        }, O.getLengthInBits = function() {
          return R;
        }, O.putBit = function(q) {
          var $ = Math.floor(R / 8);
          m.length <= $ && m.push(0), q && (m[$] |= 128 >>> R % 8), R += 1;
        }, O;
      }, b = function(m) {
        var R = a.MODE_NUMBER, O = m, q = {};
        q.getMode = function() {
          return R;
        }, q.getLength = function(v) {
          return O.length;
        }, q.write = function(v) {
          for (var h = O, E = 0; E + 2 < h.length; )
            v.put($(h.substring(E, E + 3)), 10), E += 3;
          E < h.length && (h.length - E == 1 ? v.put($(h.substring(E, E + 1)), 4) : h.length - E == 2 && v.put($(h.substring(E, E + 2)), 7));
        };
        var $ = function(v) {
          for (var h = 0, E = 0; E < v.length; E += 1)
            h = h * 10 + S(v.charAt(E));
          return h;
        }, S = function(v) {
          if ("0" <= v && v <= "9")
            return v.charCodeAt(0) - 48;
          throw "illegal char :" + v;
        };
        return q;
      }, _ = function(m) {
        var R = a.MODE_ALPHA_NUM, O = m, q = {};
        q.getMode = function() {
          return R;
        }, q.getLength = function(S) {
          return O.length;
        }, q.write = function(S) {
          for (var v = O, h = 0; h + 1 < v.length; )
            S.put(
              $(v.charAt(h)) * 45 + $(v.charAt(h + 1)),
              11
            ), h += 2;
          h < v.length && S.put($(v.charAt(h)), 6);
        };
        var $ = function(S) {
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
      }, A = function(m) {
        var R = a.MODE_8BIT_BYTE, O = s.stringToBytes(m), q = {};
        return q.getMode = function() {
          return R;
        }, q.getLength = function($) {
          return O.length;
        }, q.write = function($) {
          for (var S = 0; S < O.length; S += 1)
            $.put(O[S], 8);
        }, q;
      }, N = function(m) {
        var R = a.MODE_KANJI, O = s.stringToBytesFuncs.SJIS;
        if (!O)
          throw "sjis not supported.";
        (function(S, v) {
          var h = O(S);
          if (h.length != 2 || (h[0] << 8 | h[1]) != v)
            throw "sjis not supported.";
        })("友", 38726);
        var q = O(m), $ = {};
        return $.getMode = function() {
          return R;
        }, $.getLength = function(S) {
          return ~~(q.length / 2);
        }, $.write = function(S) {
          for (var v = q, h = 0; h + 1 < v.length; ) {
            var E = (255 & v[h]) << 8 | 255 & v[h + 1];
            if (33088 <= E && E <= 40956)
              E -= 33088;
            else if (57408 <= E && E <= 60351)
              E -= 49472;
            else
              throw "illegal char at " + (h + 1) + "/" + E;
            E = (E >>> 8 & 255) * 192 + (E & 255), S.put(E, 13), h += 2;
          }
          if (h < v.length)
            throw "illegal char at " + (h + 1);
        }, $;
      }, w = function() {
        var m = [], R = {};
        return R.writeByte = function(O) {
          m.push(O & 255);
        }, R.writeShort = function(O) {
          R.writeByte(O), R.writeByte(O >>> 8);
        }, R.writeBytes = function(O, q, $) {
          q = q || 0, $ = $ || O.length;
          for (var S = 0; S < $; S += 1)
            R.writeByte(O[S + q]);
        }, R.writeString = function(O) {
          for (var q = 0; q < O.length; q += 1)
            R.writeByte(O.charCodeAt(q));
        }, R.toByteArray = function() {
          return m;
        }, R.toString = function() {
          var O = "";
          O += "[";
          for (var q = 0; q < m.length; q += 1)
            q > 0 && (O += ","), O += m[q];
          return O += "]", O;
        }, R;
      }, M = function() {
        var m = 0, R = 0, O = 0, q = "", $ = {}, S = function(h) {
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
        return $.writeByte = function(h) {
          for (m = m << 8 | h & 255, R += 8, O += 1; R >= 6; )
            S(m >>> R - 6), R -= 6;
        }, $.flush = function() {
          if (R > 0 && (S(m << 6 - R), m = 0, R = 0), O % 3 != 0)
            for (var h = 3 - O % 3, E = 0; E < h; E += 1)
              q += "=";
        }, $.toString = function() {
          return q;
        }, $;
      }, H = function(m) {
        var R = m, O = 0, q = 0, $ = 0, S = {};
        S.read = function() {
          for (; $ < 8; ) {
            if (O >= R.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var h = R.charAt(O);
            if (O += 1, h == "=")
              return $ = 0, -1;
            if (h.match(/^\s$/))
              continue;
            q = q << 6 | v(h.charCodeAt(0)), $ += 6;
          }
          var E = q >>> $ - 8 & 255;
          return $ -= 8, E;
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
      }, V = function(m, R) {
        var O = m, q = R, $ = new Array(m * R), S = {};
        S.setPixel = function(T, P, Z) {
          $[P * O + T] = Z;
        }, S.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(O), T.writeShort(q), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(O), T.writeShort(q), T.writeByte(0);
          var P = 2, Z = h(P);
          T.writeByte(P);
          for (var K = 0; Z.length - K > 255; )
            T.writeByte(255), T.writeBytes(Z, K, 255), K += 255;
          T.writeByte(Z.length - K), T.writeBytes(Z, K, Z.length - K), T.writeByte(0), T.writeString(";");
        };
        var v = function(T) {
          var P = T, Z = 0, K = 0, X = {};
          return X.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; Z + me >= 8; )
              P.writeByte(255 & (le << Z | K)), me -= 8 - Z, le >>>= 8 - Z, K = 0, Z = 0;
            K = le << Z | K, Z = Z + me;
          }, X.flush = function() {
            Z > 0 && P.writeByte(K);
          }, X;
        }, h = function(T) {
          for (var P = 1 << T, Z = (1 << T) + 1, K = T + 1, X = E(), le = 0; le < P; le += 1)
            X.add(String.fromCharCode(le));
          X.add(String.fromCharCode(P)), X.add(String.fromCharCode(Z));
          var me = w(), Se = v(me);
          Se.write(P, K);
          var qe = 0, We = String.fromCharCode($[qe]);
          for (qe += 1; qe < $.length; ) {
            var ut = String.fromCharCode($[qe]);
            qe += 1, X.contains(We + ut) ? We = We + ut : (Se.write(X.indexOf(We), K), X.size() < 4095 && (X.size() == 1 << K && (K += 1), X.add(We + ut)), We = ut);
          }
          return Se.write(X.indexOf(We), K), Se.write(Z, K), Se.flush(), me.toByteArray();
        }, E = function() {
          var T = {}, P = 0, Z = {};
          return Z.add = function(K) {
            if (Z.contains(K))
              throw "dup key:" + K;
            T[K] = P, P += 1;
          }, Z.size = function() {
            return P;
          }, Z.indexOf = function(K) {
            return T[K];
          }, Z.contains = function(K) {
            return typeof T[K] < "u";
          }, Z;
        };
        return S;
      }, y = function(m, R, O) {
        for (var q = V(m, R), $ = 0; $ < R; $ += 1)
          for (var S = 0; S < m; S += 1)
            q.setPixel(S, $, O(S, $));
        var v = w();
        q.write(v);
        for (var h = M(), E = v.toByteArray(), T = 0; T < E.length; T += 1)
          h.writeByte(E[T]);
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
  })(Vn)), Vn.exports;
}
var Av = Cv();
const Ov = /* @__PURE__ */ Ev(Av), Tv = ["width", "height", "viewBox"], Bv = ["width", "height"], Iv = ["d"], Rv = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = C(() => {
      const s = Ov(0, "M");
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
      }, null, 8, Bv),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Iv)
    ], 8, Tv));
  }
}, Gy = /* @__PURE__ */ J(Rv, [["__scopeId", "data-v-489f0852"]]), Ky = ir(() => import("./VoiceFigure-BNjvRaNj.js").then((e) => e.V)), Yy = "1.0.0", Jy = "3.5";
export {
  qv as $,
  uy as A,
  Je as B,
  ky as C,
  ly as D,
  wy as E,
  ty as F,
  Fo as G,
  zm as H,
  Um as I,
  Sy as J,
  bt as K,
  gy as L,
  Be as M,
  Ct as N,
  hy as O,
  $n as P,
  fy as Q,
  Cp as R,
  Bo as S,
  cy as T,
  yy as U,
  pa as V,
  Om as W,
  xm as X,
  Ey as Y,
  by as Z,
  J as _,
  ce as a,
  bo as a$,
  Dy as a0,
  we as a1,
  ws as a2,
  Wv as a3,
  td as a4,
  Vy as a5,
  Qv as a6,
  nn as a7,
  Ay as a8,
  Dv as a9,
  vs as aA,
  zy as aB,
  zo as aC,
  st as aD,
  Vv as aE,
  Ky as aF,
  Ne as aG,
  rl as aH,
  Jn as aI,
  Fy as aJ,
  Wy as aK,
  Hy as aL,
  Xv as aM,
  Jv as aN,
  Kv as aO,
  Ty as aP,
  Oy as aQ,
  E1 as aR,
  Pv as aS,
  it as aT,
  Hv as aU,
  Gv as aV,
  Ly as aW,
  By as aX,
  Py as aY,
  Og as aZ,
  Gg as a_,
  Rt as aa,
  ke as ab,
  Ny as ac,
  Yy as ad,
  Jy as ae,
  jy as af,
  rs as ag,
  Yv as ah,
  R1 as ai,
  hs as aj,
  fs as ak,
  Uo as al,
  Fv as am,
  Cr as an,
  Uy as ao,
  Uv as ap,
  Gy as aq,
  Ry as ar,
  Xr as as,
  Nv as at,
  Zv as au,
  Ng as av,
  Uh as aw,
  kt as ax,
  zv as ay,
  jv as az,
  Ze as b,
  Iy as b0,
  Kh as b1,
  ys as b2,
  qy as b3,
  dy as c,
  sy as d,
  ay as e,
  ny as f,
  xy as g,
  So as h,
  py as i,
  my as j,
  vy as k,
  _y as l,
  oy as m,
  ey as n,
  ry as o,
  dn as p,
  Cy as q,
  $y as r,
  iy as s,
  je as t,
  $m as u,
  My as v,
  Mm as w,
  Es as x,
  Gp as y,
  Kp as z
};
