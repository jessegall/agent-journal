/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as we, createElementVNode as p, normalizeClass as ee, Fragment as Z, renderList as re, normalizeStyle as $e, defineComponent as Yo, Comment as Jo, h as ps, cloneVNode as Zo, createBlock as G, withCtx as U, unref as z, createVNode as H, toDisplayString as y, createCommentVNode as B, inject as Ce, computed as O, resolveDynamicComponent as lt, Transition as Lt, watch as be, ref as N, shallowRef as mn, TransitionGroup as wa, mergeProps as rt, reactive as ms, createTextVNode as he, onMounted as De, onUnmounted as Ae, nextTick as Dt, useId as ka, Teleport as ba, withModifiers as Me, isRef as Bs, onBeforeUnmount as yt, resolveDirective as Xo, withDirectives as it, useModel as zn, useAttrs as $a, getCurrentInstance as Qo, mergeModels as Gn, getCurrentScope as xa, onScopeDispose as Ma, provide as er, onErrorCaptured as tr, toHandlers as nr, createSlots as sr, vShow as ar, useSlots as or, withKeys as Ot, vModelText as Kn, defineAsyncComponent as rr } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, ir = { class: "skeleton-line" }, lr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", ir, [
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
}, et = /* @__PURE__ */ Y(lr, [["__scopeId", "data-v-0ebb6933"]]), gs = Yo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Jo);
      return s.length !== 1 ? ps(Z, { key: n }, s) : s[0].key == null ? Zo(s[0], { key: n }) : s[0];
    };
  }
}), cr = ["aria-label"], ur = ["aria-label"], dr = ["aria-label"], hr = ["aria-label"], fr = ["aria-label"], pr = ["aria-label"], mr = ["aria-label"], gr = {
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
      messages: U(() => [
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
        ], 8, cr)
      ]),
      older: U(() => [
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
        ], 8, ur)
      ]),
      cards: U(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (h) => (l(), d("div", {
            key: h,
            class: "skeleton-card"
          }, [
            (l(), d(Z, null, re(n, (g) => H(et, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, dr)
      ]),
      file: U(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (h) => (l(), d("div", {
            key: h,
            class: "skeleton-file"
          }, [
            H(et, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), d(Z, null, re(a, (g) => H(et, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, hr)
      ]),
      page: U(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          H(et, {
            class: "skeleton-heading",
            bars: i
          }),
          (l(!0), d(Z, null, re(e.count, (h) => (l(), G(et, {
            key: h,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, fr)
      ]),
      text: U(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Z, null, re(e.count, (h) => (l(), G(et, {
            key: h,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, pr)
      ]),
      default: U(() => [
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
        ], 8, mr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, wt = /* @__PURE__ */ Y(gr, [["__scopeId", "data-v-c687fb85"]]), vr = {
  key: 1,
  class: "empty-state titled"
}, yr = { class: "empty-state-title" }, wr = { class: "empty-state-text" }, kr = {
  key: 2,
  class: "empty-state"
}, br = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), G(wt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", vr, [
      p("p", yr, y(e.title), 1),
      p("p", wr, [
        we(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", kr, [
      we(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, nn = /* @__PURE__ */ Y(br, [["__scopeId", "data-v-b27e89b0"]]), $r = { class: "fold-group" }, xr = ["aria-expanded"], Mr = { class: "fold-label" }, _r = {
  key: 0,
  class: "fold-count"
}, Sr = {
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
    return (s, a) => (l(), d("div", $r, [
      p("button", {
        type: "button",
        class: ee(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", Mr, y(e.label), 1),
        e.count !== "" ? (l(), d("span", _r, y(e.count), 1)) : B("", !0),
        p("span", {
          class: ee(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, xr),
      e.open ? we(s.$slots, "default", {}, void 0, !0, 0) : B("", !0)
    ]));
  }
}, qv = /* @__PURE__ */ Y(Sr, [["__scopeId", "data-v-9ef1865c"]]), Er = Symbol("open-view"), Ne = Symbol.for("journal.window-context");
function vs() {
  const e = Ce(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Cr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Ar = /* @__PURE__ */ Y(Cr, [["__scopeId", "data-v-eb453d6f"]]), Or = {
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
      default: U(() => [
        p("span", {
          class: ee(["btn-label", { hidden: e.busy }])
        }, [
          we(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (l(), G(Ar, {
          key: 0,
          class: "btn-spinner"
        })) : B("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ve = /* @__PURE__ */ Y(Or, [["__scopeId", "data-v-a2dc4bda"]]), Tr = {
  class: "running",
  "data-running-command": ""
}, Br = ["title"], Ir = {
  key: "idle",
  class: "running-idle"
}, Rr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", Tr, [
      H(Lt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: U(() => [
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, y(e.text), 9, Br)) : (l(), d("span", Ir, y(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Wv = /* @__PURE__ */ Y(Rr, [["__scopeId", "data-v-d3240219"]]), Lr = ["aria-checked", "aria-label", "title"], Dr = {
  key: 0,
  class: "switch-inner"
}, Nr = {
  key: 0,
  class: "switch-word"
}, jr = {
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
        e.labelled ? (l(), d("span", Dr, y(e.word), 1)) : B("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Nr, y(e.word), 1)) : B("", !0)
    ], 10, Lr));
  }
}, Fv = /* @__PURE__ */ Y(jr, [["__scopeId", "data-v-1bfb90f3"]]);
function _a(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Tt(e, t) {
  return _a(() => localStorage, e, t);
}
function Sa(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function gn(e, t) {
  return Sa(() => localStorage, e, t);
}
function Ea(e, t) {
  be(t, (n) => gn(e, n), { deep: !0 });
}
function Pr(e, t) {
  return _a(() => sessionStorage, e, t);
}
function qr(e, t) {
  return Sa(() => sessionStorage, e, t);
}
const sn = "journal.environment", Ca = N(Pr(sn, Tt(sn, "")));
function Wr(e) {
  Ca.value = e, qr(sn, e), gn(sn, e);
}
const an = N(location.hash), Is = mn(null), Rs = { integrations: "mcp", library: "team" };
function Fr() {
  if (!Is.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Rs[n]) {
    location.replace(`#/${[Rs[n], ...s].join("/")}${t ? `?${t}` : ""}`), an.value = location.hash;
    return;
  }
  !n || Is.value(n) || (Wr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), an.value = location.hash);
}
window.addEventListener("hashchange", () => {
  an.value = location.hash, Fr();
});
const Pe = O(() => {
  const [e, t = ""] = an.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", h = "", g = ""] = i.split(":");
    return { table: u, id: Number(h), comment: Number(g) || 0, env: c };
  });
  return {
    env: Ca.value,
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
function Hr(e = "", t = 0, n = "") {
  location.hash = vn.page(e, t, n);
}
const Ur = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Aa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Ur).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function Hv(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Oa(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = gt[e]) != null && r.call(gt, t))) return;
  const a = Pe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Aa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Vr(e, t, n, s = 0, a = "") {
  if (e === Pe.value.env) return Oa(t, n, s, a);
  const o = Pe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Aa([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Ze(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Vr(s, a, Number(o), 0, t) : Oa(a, Number(o), 0, t);
}
function zr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function mt(e) {
  const t = zr(e);
  t && Ze(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Gr = ["stroke-width", "innerHTML"], ke = {
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
    }, null, 12, Gr));
  }
}, ys = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), G(ve, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: U(() => [
        H(ke, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Kr = {
  key: 1,
  class: "row-list-failure"
}, Yr = ["data-row"], Jr = {
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
    const t = e, n = O(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = N(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (l(), G(wt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", Kr, y(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), G(nn, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(Z, { key: 3 }, [
      (l(), G(lt(e.arrival ? wa : "ul"), rt(n.value, { class: "row-list" }), {
        default: U(() => [
          (l(!0), d(Z, null, re(e.rows, (i) => (l(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            we(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Yr))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : B("", !0)
    ], 64));
  }
}, Zr = /* @__PURE__ */ Y(Jr, [["__scopeId", "data-v-a096d68d"]]), Xr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Qr = {
  key: 1,
  class: "agent-rows-note"
}, ei = {
  key: 2,
  class: "agent-rows-note"
}, ti = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, ni = ["data-agent-row", "onClick"], si = { class: "agent-row-name" }, ai = { class: "agent-row-state" }, oi = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = O(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", Xr, [
      e.loaded ? e.failure ? (l(), d("p", Qr, y(e.failure), 1)) : e.rows.length ? (l(), d(Z, { key: 3 }, [
        p("p", ti, y(s.value) + " running", 1),
        (l(!0), d(Z, null, re(n.value, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(Ze)(`agents:${r.id}`)
        }, [
          p("span", si, "#" + y(r.id) + " " + y(r.session), 1),
          p("span", ai, y(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, ni))), 128))
      ], 64)) : (l(), d("p", ei, y(e.none), 1)) : (l(), G(wt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Uv = /* @__PURE__ */ Y(oi, [["__scopeId", "data-v-a01e5a17"]]), ri = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["badge", e.tone])
    }, y(e.text), 3));
  }
}, Ta = /* @__PURE__ */ Y(ri, [["__scopeId", "data-v-9e7e1157"]]), ii = ["aria-valuenow", "aria-valuemax"], li = {
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
    ], 10, ii));
  }
}, ci = /* @__PURE__ */ Y(li, [["__scopeId", "data-v-9eba6a85"]]), ui = { class: "bars" }, di = { class: "bar-name" }, hi = { class: "bar-value" }, fi = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = O(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", ui, [
      (l(!0), d(Z, null, re(e.items, (c, u) => (l(), G(lt(c.open ? "button" : "div"), {
        key: `${u}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: ee(["bar-row", c.tone, { opens: c.open }]),
        onClick: (h) => c.open && s("open", c.open)
      }, {
        default: U(() => [
          p("span", di, y(c.label), 1),
          H(ci, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", hi, y(c.value) + y(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, pi = /* @__PURE__ */ Y(fi, [["__scopeId", "data-v-663427f4"]]), mi = { class: "bars" }, gi = {
  key: 0,
  class: "bars-title"
}, vi = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", mi, [
      e.node.title ? (l(), d("span", gi, y(e.node.title), 1)) : B("", !0),
      H(pi, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, yi = /* @__PURE__ */ Y(vi, [["__scopeId", "data-v-7135bb11"]]), wi = {
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
      (l(!0), d(Z, null, re(e.node.children || [], (c, u) => (l(), G(ro, {
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (h) => a("open", h)),
        onFile: i[1] || (i[1] = (h) => a("file", h))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Xt = /* @__PURE__ */ Y(wi, [["__scopeId", "data-v-d142a3f4"]]), ki = {
  key: 0,
  class: "card-head"
}, bi = { class: "card-title" }, $i = {
  key: 0,
  class: "card-note"
}, xi = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: ee(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), d("header", ki, [
        p("span", bi, y(e.node.title), 1),
        e.node.note ? (l(), d("span", $i, y(e.node.note), 1)) : B("", !0)
      ])) : B("", !0),
      H(Xt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Mi = /* @__PURE__ */ Y(xi, [["__scopeId", "data-v-67b72d40"]]), _i = (e, t, n) => Math.max(t, Math.min(n, e)), Si = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, _e = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ls = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Mn = 80;
function Ds(e) {
  return e.length <= Mn ? e : `${e.slice(0, Mn + 1).replace(/\s+\S*$/, "") || e.slice(0, Mn)}…`;
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
}, Ei = (e) => (Ns[e.table] ? Ns[e.table](e) : e.title || "") || "", Ci = ["done", "cancelled"], Yn = {
  tasks: (e) => _e(e.completed_at) || (e.state === "cancelled" ? _e(e.updated_at) : 0),
  questions: (e) => e.answer ? _e(e.updated_at) : 0,
  plans: (e) => Ci.includes(e.state) ? _e(e.updated_at) : 0,
  notices: (e) => _e(e.closed_at),
  secrets: (e) => _e(e.deleted_at),
  workers: (e) => e.state === "stopped" ? _e(e.updated_at) : 0,
  shares: (e) => _e(e.stopped_at),
  dumps: (e) => _e(e.completed_at),
  agents: (e) => e.state === "ended" ? _e(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? _e(e.created_at) : 0
}, Ai = (e) => Yn[e.table] ? Yn[e.table](e) : 0, Ba = (e) => Ai(e) > 0, Oi = (e) => !!Yn[e], Ia = (e) => _e(e.created_at), on = (e) => _e(e.updated_at) || Ia(e), Ti = (e) => "task_ids" in e, yn = typeof document < "u" && document.documentElement.classList.contains("phone"), Bi = "Files are attached on the computer; the phone sends text.", Ra = 1024, Ii = Ra * 1024 * 1024, Ri = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ra} MB limit for one file.`;
function Li() {
  return () => {
  };
}
function js(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Di(e = window) {
  if (!js(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    js(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const La = "status.summary", ye = ms({
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
}), Ni = () => !!(ye.version || ye.external) && !ye.failure && !ye.late, Da = () => !!ye.countdown || Ni() || ye.starting;
function ji(e, t = "") {
  ye.starting = e === !1, ye.bootStep = ye.starting ? t : "";
}
function Pi(e) {
  e && e.version && (ye.target = e.version), ye.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function qi() {
  Object.assign(ye, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Wi(e, t = "") {
  return e && t && (ye.step = t), ye.version || (e && !ye.external && Object.assign(ye, { external: !0, since: Date.now() / 1e3 }), e || !ye.external) ? !1 : (qi(), !0);
}
let Ut = { version: "", started: 0 };
function Fi(e) {
  return e.version ? (Ut.version || (Ut = { version: e.version, started: e.started || 0 }), e.version !== Ut.version || (e.started || 0) !== Ut.started) : !1;
}
function Hi(e) {
  Pi(e.countdown), ji(e.ready, e.step), (Wi(!!e.updating, e.step) || !e.updating && !Ui(e) && Fi(e)) && Di(window);
}
const Ui = (e) => !!ye.version && !ye.failure && !ye.late && e.version !== ye.version, Ps = 2e4, Vi = 3e5, Fe = 6e5, Vt = 6, zi = 500, Gi = "/journal/summary", qs = yn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ki = (e) => e.split("?")[0].endsWith(Gi), Na = (e, t) => Object.assign(new Error(t), { status: e });
async function Yi(e, t, n = Na) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Ji = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Zi {
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
        headers: { ...qs, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Ji(s),
        signal: AbortSignal.timeout(a || (i ? Vi : Ps))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, zi)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Vt, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Li(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Yi(c, `${c.status} ${c.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: qs, signal: AbortSignal.timeout(Ps) });
    if (!n.ok) throw Na(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Vt, o).then((c) => (this.written(n), c));
    if (Da() && !Ki(n))
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
const je = new Zi(), Ee = (e) => encodeURIComponent(e);
function fe(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const $t = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), xt = "the page does not know its environment yet", Xi = "X-Journal-Env", Qi = "X-Journal-Request-At", _n = "/viewer/voices/figures/";
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
    return { [Qi]: String(Date.now()), ...this.env() ? { [Xi]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === xt ? Promise.reject(new Error(xt)) : je.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === xt ? Promise.reject(new Error(xt)) : je.request("POST", this.url(t), n, s, this.headers());
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
    return this.get(h, `${t}.${$t({ before: s, after: a, since: o, ids: r, tasks: i, closed: c, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${fe({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
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
    if (yn) return Promise.reject(Object.assign(new Error(Bi), { status: 403 }));
    if (s.size > Ii) return Promise.reject(new Error(Ri(s)));
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
    return this.get(this.here(`${a}${fe(s)}`), `${a}.${$t(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${fe(n)}`), `/verifiers/${t}/transcript.${$t(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${fe(n)}`), `/workers/${t}/transcript.${$t(n)}`);
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
    return je.request("GET", _n + "figures.json");
  }
  voiceFigureUrl(t) {
    return _n + t;
  }
  figureDecoderUrl() {
    return _n + "draco/";
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
    return `${this.base}/${t ? `?env=${Ee(t)}` : ""}${vn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ue = new ws({ base: yn ? "/p" : "" }), el = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ue.base.length).split("/")[2]);
}), tl = { claude: "Claude Code", codex: "Codex" };
Object.entries(tl).map(([e, t]) => ({ key: e, label: t }));
const Ws = (e) => e.status === "stopped" ? 1 : 0, nl = "main", sl = (e) => e.filter((t) => t.role === nl).sort((t, n) => Ws(t) - Ws(n) || _e(n.heard_at) - _e(t.heard_at))[0] || null, al = { me: 1, people: [] }, K = ms({
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
  people: al,
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
Ea("journal.activity", () => K.activity);
Ea("journal.side.mini", () => K.sideMini);
const vt = O(() => sl(K.agents));
O(() => !!vt.value && K.live.some((e) => e.agent.session === vt.value.session && e.environment === Pe.value.env));
O(() => !!vt.value && ["busy", "working"].includes(vt.value.status));
function ol(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Jn(e) {
  const t = ol(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function ja(e) {
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
const Sn = (e) => String(e).padStart(2, "0");
function rl(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Sn(t % 60)}s` : `${Math.floor(t / 3600)}h ${Sn(Math.floor(t % 3600 / 60))}m ${Sn(t % 60)}s`;
}
const il = ["working", "busy", "waiting", "compacting"], ll = (e) => il.includes(e), cl = "builder";
O(() => !K.settings || K.settings.features.file_feed !== !1);
const ul = O(() => !K.settings || K.settings.features.status_bar !== !1);
O(() => K.settings && K.settings.workers && K.settings.workers.mode || cl);
O(() => !K.settings || !K.settings.tasks || K.settings.tasks.auto !== !1);
O(() => !!(K.settings && K.settings.reviewing && K.settings.reviewing.reviewer));
O(() => !K.settings || K.settings.features.sharing !== !1);
const rn = 50, ks = 100, dl = { messages: 25 }, Le = (e) => dl[e] || rn;
function hl(e, t) {
  if (e !== "messages") return Math.max(t.length - Le(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Le(e)) return s;
  return 0;
}
const fl = "review_step", pl = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === fl).sort((t, n) => t.id - n.id), ml = 5, gl = 500, vl = 3e3, yl = () => K.entries.length ? K.entries[K.entries.length - 1].id : 0, Qt = { env: "", id: 0 }, wl = () => !!(K.bar && K.bar.length) || ll(vt.value && vt.value.status);
function kl({ session: e }) {
  return (e ? ue.chat(e, { docked: !0 }) : ue.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function bl() {
  return ue.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ue.chat(t.session, { limit: ks })))).then(pl);
}
function $l() {
  return Qt.env !== ue.env() && Object.assign(Qt, { env: ue.env(), id: yl() }), ue.entries(Qt.id);
}
function xl(e) {
  e.length && (Qt.id = e[e.length - 1].id, pc(e));
}
async function Ml({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", rn);
}
const Zn = /* @__PURE__ */ new Map();
async function Xn(e, t) {
  const n = `${e}:${ue.env()}`, s = Zn.get(n);
  if (!s) return Hs(n, (await ue.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(on)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ue.list("workers", { limit: t, since: a, after: o });
  if (!r.is_last_page)
    return Zn.delete(n), Xn(e, t);
  const i = new Set(r.rows.map((c) => c.id));
  return Hs(
    n,
    [...s.filter((c) => !i.has(c.id)), ...r.rows].sort((c, u) => c.id - u.id)
  );
}
const Hs = (e, t) => (Zn.set(e, t), t);
async function Us(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Vs = Object.freeze({
  "status.bar": {
    read: () => ue.bar(),
    every: () => wl() ? gl : vl,
    take: (e) => Array.isArray(e) && (K.bar = e),
    active: () => ul.value
  },
  "agents.index": { read: () => Us(ue, ml), every: 1e3, take: (e) => K.agents = e.rows },
  "agents.live": { read: () => ue.liveAgents(), every: 5e3, take: (e) => K.live = e },
  "status.summary": {
    read: () => ue.summary(),
    every: () => ye.countdown || ye.external || ye.version ? 1e3 : 4e3,
    take: (e) => {
      K.summary = e, Hi(e);
    }
  },
  "journal.manifest": { read: () => ue.manifest(), every: 3e4, take: (e) => K.spec = e },
  "journals.index": { read: () => ue.journals(), every: 1e4, take: (e) => K.journals = e },
  "people.index": { read: () => ue.people(), every: 3e4, take: (e) => e && e.people && (K.people = e) },
  "entries.recent": { read: $l, every: 1e3, take: xl },
  "outputs.running": { read: () => ue.runningOutputs(), every: 3e3 },
  "messages.docked": { read: kl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ue.mcp(), every: 3e4 },
  "developer.readers": { read: () => ue.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Xn("workers.index", Le("workers")), every: 5e3 },
  "workers.activity": { read: () => ue.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Xn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ue.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ue.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: bl, every: 3e3 },
  "tests.turns": { read: () => ue.list("test_turns", { limit: Le("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ue.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ue.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ue.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ue.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: Ml, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Us(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
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
}), _l = 6e4, Sl = 3e3, El = 4, Cl = 300, Al = 5e3, Pa = /* @__PURE__ */ new Map();
function wn(e) {
  if (!(e in Vs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Vs[e];
}
function Ol(e) {
  const t = wn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Al;
  }
}
const Tl = (e) => e / 2 + Math.random() * e / 2, qa = (e) => [...e.users.values()].pop(), bs = (e) => Pa.get(e.place) === e, Bl = () => Math.random() * Cl, $s = () => document.hidden;
function Il(e) {
  const t = Ol(e);
  return e.failures ? Tl(Math.min(e.key === La ? Sl : _l, t * 2 ** e.failures)) : Math.max(t, El * e.took);
}
function Wa(e, t) {
  clearTimeout(e.timer), !(!bs(e) || e.paused || $s()) && (e.timer = setTimeout(() => Rl(e), t));
}
function Rl(e) {
  return bs(e) ? e.running ? (e.again = !0, e.running) : (e.running = jl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Ll = (e) => {
  var t, n;
  return !e.paused && !$s() && (((n = (t = wn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && qa(e).active() && (!Da() || e.key === La);
};
async function Dl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => wn(e.key).read(qa(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Nl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = wn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function jl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Ll(e) && Nl(e, await Dl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && bs(e) && !e.paused);
  Wa(e, Il(e));
}
const Pl = () => $s() || Pa.forEach((e) => Wa(e, Bl()));
document.addEventListener("visibilitychange", Pl);
const ql = 60, Wl = (e, t) => _e(e.created_at) >= _e(t.created_at) - ql, Fl = (e, t) => e.id > 0 && e.table === t.table && Wl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), xs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Fl(s, n))), En = [
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
    filters: En
  }),
  tasks: pe("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: En
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
  notices: pe("Notice", "band", "One line pinned to the chat while it matters", { filters: En }),
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
}, Hl = ["secrets", "plugins"], Fa = Object.keys(Nt).filter((e) => !(yn && Hl.includes(e)));
O(() => Fa.map((e) => ({ name: e, ...Nt[e] })));
const jt = (e) => Nt[e], Ha = new Map(Fa.flatMap((e) => [e, e.replace(/s$/, ""), Nt[e].title.toLowerCase()].map((t) => [t, e]))), ot = (e) => Ha.get(String(e).toLowerCase()) || "", Ua = [...Ha.keys()].sort((e, t) => t.length - e.length).join("|"), Qe = /* @__PURE__ */ new Set(), Ms = N(0), Pt = /* @__PURE__ */ new Set(), qt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Qn = /* @__PURE__ */ new Set(), Ul = /* @__PURE__ */ new Map(), Vl = /* @__PURE__ */ new Map();
let pt = !1, Mt = null;
const zl = (e, t) => e.id - t.id, Gl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Kl = { messages: Gl }, Va = (e) => Kl[e] || zl;
function za(e) {
  return Ms.value, Qe.has(e) || (Qe.add(e), K.booted && (!Pt.has(e) || qt.has(e)) && queueMicrotask(() => bn([e], !1))), K.rows[e] || [];
}
function Yl(e) {
  const t = K.rows[e] || [], n = hl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  K.rows[e] = t.filter((a) => s.has(a) || Oi(e) && !Ba(a)), K.paging.size[e] = Le(e), K.paging.more[e] = !0;
}
const Jl = /* @__PURE__ */ new Set();
function Zl() {
  Qe.forEach(Yl), Qe.clear(), Ul.clear(), Vl.clear(), Ms.value += 1;
}
be(() => `${Pe.value.env}/${Pe.value.page}/${Pe.value.open ? Pe.value.open.table : ""}`, Zl);
be(
  () => K.booted,
  (e) => e && bn(
    [...Qe].filter((t) => !Pt.has(t)),
    !1
  )
);
const es = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Ti(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Ga(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (es(s) && !es(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Ka(e, t) {
  Pt.add(e), Ms.value += 1;
  const n = K.rows[e] || [];
  K.rows[e] = [...Ga(n, t.rows), ...xs(n.filter((s) => s.id === 0), t.rows)], K.paging.size[e] = K.paging.size[e] || Le(e), K.paging.more[e] = !t.is_last_page;
}
async function Xl(e) {
  const t = new Set((K.rows[e] || []).map((o) => o.id)), n = await ue.list(e, { limit: Le(e) });
  kn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = xs((K.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Ka(e, { ...n, rows: [...n.rows, ...a].sort(Va(e)) }), K.paging.size[e] = Le(e), Ya.has(e) && await Ja(e), K.rows[e];
}
const kn = (e, t) => K.counts = { ...K.counts, [e]: t };
async function Ql(e) {
  const t = K.rows[e] || [], n = Math.max(0, ...t.map(on)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ue.list(e, { limit: Le(e), since: n, after: s });
  if (kn(e, a.counts), !a.is_last_page) return Xl(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = xs(t.filter((i) => !o.has(i.id)), a.rows).concat(Ga(t, a.rows));
  return K.rows[e] = r.sort(Va(e)), K.paging.size[e] = K.rows[e].length, K.rows[e];
}
const Cn = /* @__PURE__ */ new Set();
async function ec(e, t = !1) {
  e.forEach((n) => qt.delete(n)), e.forEach((n) => Qn.add(n));
  try {
    await ic(e, t);
  } finally {
    e.forEach((n) => Qn.delete(n));
  }
}
async function tc(e) {
  const t = await ue.list(e, { limit: Le(e) });
  kn(e, t.counts), Ka(e, t);
}
async function nc(e) {
  kn(e, (await ue.list(e, { limit: 1, closed: !0 })).counts);
}
const Ya = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ja(e) {
  const t = (K.rows[e] || []).filter((a) => es(a) && (e !== "plans" || !Ba(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ue.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  K.rows[e] = (K.rows[e] || []).map((a) => s.get(a.id) || a);
}
const sc = (e, t) => !Pt.has(e) || t && (K.paging.size[e] || Le(e)) === Le(e) && !Jl.has(e);
async function ac(e, t) {
  if (!Qe.has(e)) return nc(e);
  const n = await (sc(e, t) ? tc(e) : Ql(e));
  return Ya.has(e) && await Ja(e), n;
}
async function oc() {
  const [e, t] = await Promise.all([ue.entries(0, ks), ue.settings()]);
  Qa([...Tt(Xa(), []), ...e]), JSON.stringify(t) !== JSON.stringify(K.settings) && (K.settings = t);
}
const rc = (e, t) => ac(e, t).then(
  () => null,
  () => e
);
async function ic(e, t) {
  const n = (await Promise.all(e.map((s) => rc(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), qt.add(s))), t && await oc(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Za = 1e3, lc = 15e3;
let zt = Za;
async function cc() {
  return Mt || (Mt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !Cn.has(e)) || pt; ) {
      const e = pt, t = [...e ? Object.keys(K.rows) : Ke].filter((s) => Nt[s] && (Qe.has(s) || s in K.rows)).filter((s) => e || !Qe.has(s) || qt.has(s) || !Pt.has(s)).filter((s) => !Cn.has(s)), n = [...Ke].filter((s) => Cn.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), pt = !1;
      try {
        await ec(t, e), zt = Za;
      } catch {
        pt = pt || e, await new Promise((a) => setTimeout(a, zt)), zt = Math.min(zt * 2, lc);
      }
    }
  })().finally(() => Mt = null), Mt);
}
function bn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Qn.has(n)).forEach((n) => {
    Ke.add(n), t && qt.add(n);
  }), Ke.has("settings") && (pt = !0), cc();
}
const Xa = () => {
  var e;
  return `typed-entries:${((e = K.identity) == null ? void 0 : e.root) || location.host}:${ue.env()}`;
};
function Qa(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  K.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ks), gn(Xa(), K.entries.slice(-50));
}
const uc = ["created", "updated", "deleted"], dc = { phases: ["phases", "plans"] }, ts = (e) => dc[e] || [e], hc = (e) => uc.includes(e.entry_type) ? [...ts(e.data.table), ...(e.data.joins || []).flatMap(ts)] : [];
function fc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of ts(t.data.table).filter((s) => K.rows[s]))
      K.rows[n] = K.rows[n].filter((s) => s.id !== t.data.id);
}
function pc(e) {
  Qa([...K.entries, ...e]), fc(e), bn([...new Set(e.flatMap(hc))].filter((t) => t && t !== "agents"));
}
el((e) => K.streamOpen || bn([e]));
const ns = [], mc = 2e3, Ge = /* @__PURE__ */ new Map(), gc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, vc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ct(e, { first: t = !1 } = {}) {
  t ? ns.unshift(e) : ns.push(e), Ge.clear();
}
function eo(e, t, n) {
  var a;
  const s = za(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const yc = (e) => za(e.table).find((t) => t.id === e.id) === e.row, wc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function kc(e, t) {
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
function Bt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return bc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function bc(e) {
  return e.split(vc).map((t, n) => n % 2 ? t : t.replace(gc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function zs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function $c(e) {
  const [t, , ...n] = e, s = zs(t).map((o) => `<th>${Bt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${zs(o).map((r) => `<td>${Bt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function xc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Bt(a)}</li>`).join("")}</${s}>`;
}
const Gs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function to(e) {
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
      n.push(`<h${i}>${Bt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Gs(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push($c(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(xc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${to(
          t.slice(s, i).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Gs(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Bt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Mc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, _c = (e) => e.kind !== "text" && !Mc.test(e.html);
function Sc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(to(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : _c(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ss(e, t = { env: "" }) {
  const n = wc(e, t), s = Ge.get(n);
  if (Ge.delete(n), s && s.reads.every(yc))
    return Ge.set(n, s), s.html;
  const a = [], o = Sc(kc(e, { ...t, reads: a }));
  return Ge.set(n, { html: o, reads: a }), Ge.size > mc && Ge.delete(Ge.keys().next().value), o;
}
const no = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, ln = (e) => String(e || "").replace(no, (t, n, s, a) => a), Ec = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Gt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Cc = /^Traceback \(most recent call last\):/m, Ac = 8;
function so(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Ac).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Oc(e) {
  const t = [...e.matchAll(Ec)].map((s) => s.index);
  if (Gt.lastIndex = 0, !t.length || !Gt.test(e)) return null;
  Gt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Gt)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: so(n), tail: "" } : null;
}
function Tc(e) {
  const t = Cc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: so([o]), tail: n.slice(a).join(`
`) };
}
ct((e) => {
  const t = ln(e), n = Tc(t) || Oc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const as = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Bc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Ic = `${as} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Rc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Lc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ks = {
  js: { keywords: as, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Bc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Ic, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: as, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Rc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Lc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Ys(e, t, n) {
  return n && e.startsWith(n, t);
}
function Dc(e, t) {
  const n = Ks[t] || Ks.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Ys(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Ys(e, o, n.block[0])) {
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
      const h = e.slice(o).match(/^[\w$]+/)[0], g = n.lower ? h.toLowerCase() : h, k = n.property && /^\s*:/.test(e.slice(o + h.length));
      r(s.has(g) ? "keyword" : k ? "property" : /^[A-Z]/.test(h) && t !== "text" ? "type" : "plain", h), o += h.length;
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
function Nc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Dc(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Ue(r) : `<span class="tok-${s}">${Ue(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function jc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Pc = 1500, Js = /* @__PURE__ */ new WeakMap();
async function qc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await jc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Js.get(t)), Js.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Pc)
  )));
}
typeof document < "u" && document.addEventListener("click", qc, !0);
const Wc = /^(```|~~~)\s*(\w+)?\s*$/, Fc = /^\s{4,}\S/, Hc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Uc = /^\s*(?:[-*+]|\d+[.)])\s/, ao = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Vc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function oo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function zc(e) {
  const t = oo(e.join(`
`));
  return (Vc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Gc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && ao.test(t) && !Uc.test(t);
};
function Zs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Nc(oo(e.join(`
`)), t || zc(e)).join(`
`)}</code></pre></div>` };
}
function Kc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Wc);
    if (r) {
      const c = t.findIndex((h, g) => g > o && h.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Zs(t.slice(o + 1, u).map(ln), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Gc(s) ? Hc : Fc;
    if (i.test(t[o])) {
      let c = o;
      for (; c < t.length && (i.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && ao.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (c - o + u.length >= 2) {
        a(), n.push(Zs([...u, ...t.slice(o, c)].map(ln), "")), o = c;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ct((e) => Kc(e));
const Yc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Jc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Zc(e) {
  const t = Yc.exec(e);
  if (t && ot(t[1])) return { at: t.index, length: t[0].length, table: ot(t[1]), id: Number(t[2]), label: t[3] };
  const n = Jc.exec(e), s = n && ot(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Xc(e, t, n, s) {
  const a = eo(s, e, t), o = ln(a ? Ei(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(jt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
ct(
  (e, t) => {
    const n = Zc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Xc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Qc = /\.(png|jpe?g|gif|webp|svg)$/i, eu = (e) => Qc.test(e), tu = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, nu = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function su(e, t) {
  const n = tu.exec(e), [, s, a, o, r, i] = n || [], c = n && ot(s || o), u = c && eo(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const h = ue.in(t.env).fileUrl(c, u.id, i), g = `${jt(c).title} ${u.id} · ${Ue(i)}`, k = eu(i) ? `<img class="file-card-image" src="${h}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${h}" data-attached="${Ue(i)}">${k}<span class="file-card-name">${g}</span></a>` };
}
function au(e) {
  const t = nu.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ct(
  (e, t) => {
    if (t.inline) return null;
    const n = su(e, t) || au(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const ou = /`([^`\n]+)`/g;
ct((e) => e.replace(ou, (t, n) => `<code>${n}</code>`));
const Xs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${vn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ct(
  (e, t) => e.replace(no, (n, s, a, o) => Xs[s] ? Xs[s](a, o, t) : o)
);
const ru = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, iu = new RegExp(`\\b(${Ua}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), lu = new RegExp(`\\b(${Ua}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), cu = (e, t) => `<a class="row-pill" href="#" data-peek="${ot(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, uu = (e) => e.replace(lu, (t, n, s) => s.replace(/\d+/g, (a) => cu(n.replace(/s$/i, ""), a))), du = (e) => uu(e).replace(
  iu,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${ot(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
ct(
  (e, t) => t.rowNames === !1 ? e : e.split(ru).map((n, s) => s % 2 ? n : du(n)).join("")
);
const hu = ["innerHTML"], fu = ["innerHTML"], pu = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = O(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = ss(s, { env: Pe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(mt) && z(mt)(...o)),
      innerHTML: n.value
    }, null, 8, hu)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(mt) && z(mt)(...o)),
      innerHTML: n.value
    }, null, 8, fu));
  }
}, at = /* @__PURE__ */ Y(pu, [["__scopeId", "data-v-1a43d211"]]), mu = { class: "fact" }, gu = { class: "fact-label" }, vu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", mu, [
      p("span", gu, y(e.label), 1),
      H(at, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, yu = /* @__PURE__ */ Y(vu, [["__scopeId", "data-v-3a88ecf8"]]), wu = { class: "list" }, ku = { class: "list-label" }, bu = {
  key: 1,
  class: "list-note"
}, $u = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", wu, [
      (l(!0), d(Z, null, re(e.items, (o, r) => (l(), G(lt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: ee(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: U(() => [
          p("span", ku, y(o.label), 1),
          o.badge ? (l(), G(Ta, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : B("", !0),
          o.note ? (l(), d("span", bu, y(o.note), 1)) : B("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, xu = /* @__PURE__ */ Y($u, [["__scopeId", "data-v-ebe2ae0a"]]), Mu = { class: "table" }, _u = {
  key: 0,
  class: "table-row empty"
}, Su = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", Mu, [
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
        default: U(() => [
          (l(!0), d(Z, null, re(i.cells, (u, h) => (l(), d("span", {
            key: h,
            class: "cell"
          }, y(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), d("div", _u, y(e.empty), 1)) : B("", !0)
    ]));
  }
}, Eu = /* @__PURE__ */ Y(Su, [["__scopeId", "data-v-9326a52e"]]), Cu = { class: "stat-value" }, Au = { class: "stat-label" }, Ou = {
  key: 0,
  class: "stat-note"
}, Tu = {
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
      default: U(() => [
        p("span", Cu, y(e.value), 1),
        p("span", Au, y(e.label), 1),
        e.note ? (l(), d("span", Ou, y(e.note), 1)) : B("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Bu = /* @__PURE__ */ Y(Tu, [["__scopeId", "data-v-ad0db6d6"]]), Iu = { class: "code" }, Ru = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (l(), G(gs, {
      value: e.node.type
    }, {
      stack: U(() => [
        H(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: U(() => [
        H(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: U(() => [
        H(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: U(() => [
        H(Mi, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: U(() => [
        p("h3", {
          class: ee(["heading", `level-${e.node.level || 2}`])
        }, y(e.node.text), 3)
      ]),
      divider: U(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: U(() => [
        H(Bu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: U(() => [
        H(yi, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: U(() => [
        H(Eu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: U(() => [
        H(xu, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: U(() => [
        H(at, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: U(() => [
        H(yu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: U(() => [
        H(Ta, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: U(() => [
        p("pre", Iu, [
          p("code", null, y(e.node.text), 1)
        ])
      ]),
      file: U(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, y(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ro = /* @__PURE__ */ Y(Ru, [["__scopeId", "data-v-cbdcf540"]]), Lu = { class: "dashboard" }, Du = { class: "trail" }, Nu = ["onClick"], ju = {
  key: 0,
  class: "gone",
  role: "status"
}, Pu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (k) => k in (n.document.pages || {}), o = N(!!n.page && !a(n.page)), r = N(n.page && !o.value ? [n.page] : []), i = O(() => r.value.at(-1) || n.document.start), c = O(() => (n.document.pages || {})[i.value] || null), u = (k) => ((n.document.pages || {})[k] || {}).title || k, h = (k) => {
      o.value = !1, r.value = [...r.value, k];
    }, g = (k) => {
      o.value = !1, r.value = r.value.slice(0, k);
    };
    return be(
      () => n.document.start,
      () => r.value = []
    ), (k, M) => (l(), d("div", Lu, [
      e.document.broken ? (l(), G(nn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: U(() => [
          he(y(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), G(nn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: U(() => [
          he(y(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(Z, { key: 2 }, [
        p("nav", Du, [
          p("button", {
            type: "button",
            class: ee(["step", { current: !r.value.length }]),
            onClick: M[0] || (M[0] = (P) => g(0))
          }, y(u(e.document.start)), 3),
          (l(!0), d(Z, null, re(r.value, (P, L) => (l(), d(Z, {
            key: `${L}-${P}`
          }, [
            M[2] || (M[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: ee(["step", { current: L === r.value.length - 1 }]),
              onClick: (w) => g(L + 1)
            }, y(u(P)), 11, Nu)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", ju, "What you opened is no longer in this dashboard. Here is its start page.")) : B("", !0),
        H(Lt, {
          name: "page",
          mode: "out-in"
        }, {
          default: U(() => [
            (l(), d("div", {
              key: i.value,
              class: "page"
            }, [
              H(ro, {
                node: c.value.view,
                onOpen: h,
                onFile: M[1] || (M[1] = (P) => s("file", P))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : B("", !0)
    ]));
  }
}, Vv = /* @__PURE__ */ Y(Pu, [["__scopeId", "data-v-fbe83734"]]);
function qu(e, t, n, s = () => window) {
  De(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Wu = (e, t = () => !0) => qu("keydown", (n) => n.key === "Escape" && t() && e());
function Fu(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = N(!1), a = O(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Wu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Hu = 80, ht = ms([]);
function Uu(e) {
  const t = Symbol("layer"), n = () => ht.includes(t) && ht.splice(ht.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !ht.includes(t) && ht.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), O(() => Hu + Math.max(0, ht.indexOf(t)));
}
let io = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return io = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Vu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function zu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Vu)];
    if (!r.length) return o.preventDefault();
    const [i, c] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  De(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : io, document.addEventListener("keydown", a), Dt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Gu = ["aria-modal", "aria-label", "aria-labelledby"], Ku = {
  key: 0,
  class: "dialog-head"
}, Yu = ["id", "tabindex"], Ju = {
  key: 1,
  class: "dialog-foot"
}, Zu = 500, Xu = 400, Qu = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Fu(s, n), i = Uu(a), c = N(null), u = N(null), h = N(null), g = ka(), k = N(!1), M = Date.now();
    n.modal && zu(u, () => s("escape"), h);
    function P() {
      if (!n.modal) return n.closable && o();
      k.value = !0, setTimeout(() => k.value = !1, Xu);
    }
    function L(W) {
      !n.modal || Date.now() - M >= Zu || ![" ", "Enter"].includes(W.key) || (W.preventDefault(), W.stopPropagation());
    }
    const w = () => c.value && (c.value.scrollTop = c.value.scrollHeight), E = new MutationObserver(w);
    return be(c, (W) => {
      E.disconnect(), W && n.follow && (E.observe(W, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Ae(() => E.disconnect()), (W, V) => (l(), G(ba, { to: "body" }, [
      H(Lt, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: U(() => [
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
              "aria-labelledby": e.modal ? z(g) : void 0,
              onKeydownCapture: L
            }, [
              e.bare ? B("", !0) : (l(), d("header", Ku, [
                p("h3", {
                  id: z(g),
                  ref_key: "heading",
                  ref: h,
                  tabindex: e.modal ? -1 : void 0
                }, y(e.title), 9, Yu),
                e.closable ? (l(), G(ys, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : B("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: ee(["dialog-body", { bare: e.bare }])
              }, [
                we(W.$slots, "default", {}, void 0, !0)
              ], 2),
              W.$slots.foot ? (l(), d("footer", Ju, [
                we(W.$slots, "foot", {}, void 0, !0)
              ])) : B("", !0)
            ], 42, Gu)
          ], 6)) : B("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ed = /* @__PURE__ */ Y(Qu, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Re = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ie = { across: 48, down: 110, margin: 32, labelSpace: 14 }, td = 6;
function _s(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const nd = (e) => {
  const t = _s(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
  return { name: e, lines: t, line: ze.line, padY: ze.padY, width: n, height: t.length * ze.line + ze.padY * 2 };
};
function sd(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, c) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(c) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function ad(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function od(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, c) => [i, c]))), o = (r, i) => {
    const c = a(), u = (h) => {
      const g = i(h).map((k) => c.get(k));
      return g.length ? g.reduce((k, M) => k + M, 0) / g.length : c.get(h);
    };
    return [...r].sort((h, g) => u(h) - u(g));
  };
  for (let r = 0; r < td; r++) {
    const i = r % 2 === 0, c = s.map((u, h) => h);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const h = (g) => t.filter((k) => k[i ? 1 : 0] === g).map((k) => k[i ? 0 : 1]);
      s[u] = o(s[u], h);
    });
  }
  return s;
}
function rd(e, t) {
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
function id(e) {
  const t = [...new Set(e.flatMap(([b, m]) => [b, m]))], n = new Set(e.map(([, b]) => b)), s = t.filter((b) => !n.has(b)), a = sd(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((b, m) => !a.has(m)), r = ad(t, o), i = od(t, o, r), c = new Map(t.map((b) => [b, nd(b)])), u = i.map((b) => b.reduce((m, R) => m + c.get(R).width, 0) + Ie.across * (b.length - 1)), h = Math.max(...u) + Ie.margin * 2, g = cd(e, r, i.length), k = /* @__PURE__ */ new Map();
  let M = Ie.margin;
  i.forEach((b, m) => {
    let R = (h - u[m]) / 2;
    const _ = Math.max(...b.map((D) => c.get(D).height));
    b.forEach((D) => {
      const $ = c.get(D);
      k.set(D, { ...$, x: R, y: M + (_ - $.height) / 2 }), R += $.width + Ie.across;
    }), M += _ + (g[m] ?? Ie.down);
  });
  const P = e.map(([b, m, R], _) => ({ from: b, to: m, label: R || "", back: a.has(_) || r.get(m) <= r.get(b) }));
  rd(P, k);
  const L = P.map((b) => ud(b, k.get(b.from), k.get(b.to))), w = [...k.values()], E = pd(L, w), W = Math.max(M - Ie.down, ...E.filter((b) => b.label).map((b) => b.label.y + b.label.height));
  return { width: Math.max(h - Ie.margin, ...E.filter((b) => b.label).map((b) => b.label.x + b.label.width)) + Ie.margin, height: W + Ie.margin, nodes: w, arrows: E };
}
const ld = (e) => e ? _s(e, Re.lineChars).length * Re.line + Re.pad * 2 : 0;
function cd(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Ie.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, h) => u - h);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += ld(r) + Ie.labelSpace);
  }), s.map((a) => Math.max(Ie.down, a));
}
function ud(e, t, n) {
  const s = e.label ? _s(e.label, Re.lineChars) : [], a = s.length ? Math.max(...s.map((k) => k.length)) * Re.charWidth + Re.pad * 2 : 0, o = s.length * Re.line + (s.length ? Re.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, h = (u - i) / 2, g = [{ x: r, y: i }, { x: r, y: i + h }, { x: c, y: u - h }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: g, path: `M${r} ${i} C${r} ${i + h} ${c} ${u - h} ${c} ${u}` };
}
const dd = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, hd = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], fd = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Re.line);
function pd(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, u) => {
      const h = dd(s.curve, c);
      return { x: h.x - s.labelWidth / 2, y: h.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = fd.flatMap((c) => hd.map((u) => a(u, c))).find((c) => !n.some((u) => Qs(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => Qs(i, c)); ) i.y += Re.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Re.line, pad: Re.pad } };
  });
}
const Qs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, md = { class: "flowchart-tools" }, gd = ["width", "height", "viewBox", "aria-label"], vd = ["d"], yd = ["x", "y", "width", "height"], wd = ["x", "y"], kd = ["x", "dy"], bd = {
  key: 0,
  class: "flowchart-label"
}, $d = ["x", "y", "width", "height"], xd = ["x", "y"], Md = ["x", "dy"], _d = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(() => id(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = N(null), i = N({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var E;
      const L = (E = r.value) == null ? void 0 : E.getBoundingClientRect();
      if (!(L != null && L.width)) return;
      const w = Math.min(L.width / a.value.width, L.height / a.value.height, 1.5);
      i.value = { zoom: w, x: (L.width - a.value.width * w) / 2, y: (L.height - a.value.height * w) / 2 };
    }
    function h(L, w, E) {
      const { zoom: W, x: V, y: b } = i.value, m = Math.min(o.most, Math.max(o.least, W * L));
      i.value = { zoom: m, x: w - (w - V) * m / W, y: E - (E - b) * m / W };
    }
    function g(L) {
      const w = r.value.getBoundingClientRect();
      h(L, w.width / 2, w.height / 2);
    }
    function k(L) {
      const w = r.value.getBoundingClientRect();
      L.ctrlKey || L.metaKey ? h(L.deltaY < 0 ? o.step : 1 / o.step, L.clientX - w.left, L.clientY - w.top) : i.value = { ...i.value, x: i.value.x - L.deltaX, y: i.value.y - L.deltaY };
    }
    function M(L) {
      var w, E, W;
      L.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), c = { x: L.clientX - i.value.x, y: L.clientY - i.value.y }, (W = (E = r.value).setPointerCapture) == null || W.call(E, L.pointerId);
    }
    function P(L) {
      c && (i.value = { ...i.value, x: L.clientX - c.x, y: L.clientY - c.y });
    }
    return De(u), (L, w) => (l(), G(ed, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (E) => s("close"))
    }, {
      default: U(() => [
        p("div", md, [
          H(ve, {
            small: "",
            onClick: w[0] || (w[0] = (E) => g(o.step))
          }, {
            default: U(() => [...w[5] || (w[5] = [
              he("Zoom in", -1)
            ])]),
            _: 1
          }),
          H(ve, {
            small: "",
            onClick: w[1] || (w[1] = (E) => g(1 / o.step))
          }, {
            default: U(() => [...w[6] || (w[6] = [
              he("Zoom out", -1)
            ])]),
            _: 1
          }),
          H(ve, {
            small: "",
            onClick: u
          }, {
            default: U(() => [...w[7] || (w[7] = [
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
          onPointerdown: M,
          onPointermove: P,
          onPointerup: w[2] || (w[2] = (E) => Bs(c) ? c.value = null : c = null),
          onPointercancel: w[3] || (w[3] = (E) => Bs(c) ? c.value = null : c = null)
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
            (l(!0), d(Z, null, re(a.value.arrows, (E, W) => (l(), d("path", {
              key: `arrow-${W}`,
              class: "flowchart-arrow",
              d: E.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, vd))), 128)),
            (l(!0), d(Z, null, re(a.value.nodes, (E) => (l(), d("g", {
              key: E.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: E.x,
                y: E.y,
                width: E.width,
                height: E.height,
                rx: "8"
              }, null, 8, yd),
              p("text", {
                x: E.x + E.width / 2,
                y: E.y + E.padY + E.line / 2
              }, [
                (l(!0), d(Z, null, re(E.lines, (W, V) => (l(), d("tspan", {
                  key: V,
                  x: E.x + E.width / 2,
                  dy: V ? E.line : 0
                }, y(W), 9, kd))), 128))
              ], 8, wd)
            ]))), 128)),
            (l(!0), d(Z, null, re(a.value.arrows, (E, W) => (l(), d(Z, {
              key: `label-${W}`
            }, [
              E.label ? (l(), d("g", bd, [
                p("rect", {
                  x: E.label.x,
                  y: E.label.y,
                  width: E.label.width,
                  height: E.label.height,
                  rx: "4"
                }, null, 8, $d),
                p("text", {
                  x: E.label.x + E.label.width / 2,
                  y: E.label.y + E.label.pad + E.label.line / 2
                }, [
                  (l(!0), d(Z, null, re(E.label.lines, (V, b) => (l(), d("tspan", {
                    key: b,
                    x: E.label.x + E.label.width / 2,
                    dy: b ? E.label.line : 0
                  }, y(V), 9, Md))), 128))
                ], 8, xd)
              ])) : B("", !0)
            ], 64))), 128))
          ], 12, gd))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Sd = /* @__PURE__ */ Y(_d, [["__scopeId", "data-v-51d24cfe"]]), ea = {
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
}, Ed = ["innerHTML"], Cd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => ea[t.name] || ea.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Ed));
  }
}, Ve = /* @__PURE__ */ Y(Cd, [["__scopeId", "data-v-beb5935c"]]), Ad = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      H(Ve, { name: "fold" })
    ], 2));
  }
}, It = /* @__PURE__ */ Y(Ad, [["__scopeId", "data-v-d03899bb"]]), Od = ["data-tip", "aria-label"], Td = {
  key: 0,
  class: "mact-word"
}, Bd = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      H(Ve, { name: "open" }),
      e.open ? (l(), d("span", Td, y(e.label), 1)) : B("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Od));
  }
}, lo = /* @__PURE__ */ Y(Bd, [["__scopeId", "data-v-3b292e09"]]), Id = 120, An = 280, Rd = 160, Ld = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function co(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = N(t()), a = N("");
  let o = 0;
  const r = (u, h) => Object.assign(u.style, { width: `${h.width}px`, height: `${h.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const h = e.value, g = ++o;
    if (!h || !h.offsetWidth || Ld()) {
      s.value = u;
      return;
    }
    const k = { width: h.offsetWidth, height: h.offsetHeight };
    if (r(h, k), a.value = "leaving", await n(Id), g !== o) return;
    s.value = u, a.value = "resizing", await Dt(), i(h);
    const M = { width: h.offsetWidth, height: h.offsetHeight };
    r(h, k), h.offsetWidth, h.style.transition = `width ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(h, M), await n(An), g === o && (i(h), a.value = "entering", await n(Rd), g === o && (a.value = ""));
  }
  return be(t, (u) => c(u)), yt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Dd = { class: "growing-card-top" }, Nd = ["aria-expanded"], jd = { class: "growing-card-avatar" }, Pd = { class: "growing-card-title" }, qd = { class: "growing-card-more" }, Wd = { class: "growing-card-body" }, Fd = {
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
    const n = e, s = t, a = N(!1), o = N(null), { folded: r, phase: i } = co(o, () => !a.value), c = O(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = O(() => n.text.split(/\n\s*\n/).filter((h) => h.trim()));
    return (h, g) => (l(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: ee(["growing-card-wrap", z(i), { open: !z(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Dd, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: g[0] || (g[0] = (k) => a.value = !a.value)
        }, [
          p("span", jd, [
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
          p("span", Pd, y(e.title), 1),
          H(It, { open: a.value }, null, 8, ["open"])
        ], 8, Nd),
        e.action ? (l(), G(lo, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: g[1] || (g[1] = (k) => s("act"))
        }, null, 8, ["label", "open"])) : B("", !0),
        e.commentable ? (l(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: g[2] || (g[2] = (k) => s("comment"))
        }, [
          H(ke, {
            name: "bubble",
            size: 13
          })
        ])) : B("", !0)
      ]),
      p("div", qd, [
        p("div", Wd, [
          (l(!0), d(Z, null, re(u.value, (k, M) => (l(), d("p", {
            key: M,
            class: "growing-card-text"
          }, y(k), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Hd = /* @__PURE__ */ Y(Fd, [["__scopeId", "data-v-e31436cb"]]), Ud = ["title", "aria-label"], Vd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, zd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Gd = {
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
      (l(), d("svg", Vd, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", zd)) : B("", !0)
      ]))
    ], 10, Ud));
  }
}, Kd = /* @__PURE__ */ Y(Gd, [["__scopeId", "data-v-6dc92808"]]), Yd = "img,pre,table";
function Jd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Zd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Xd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Yd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Jd(Zd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Qd(e, t) {
  let n = null;
  const s = () => e.value && Xd(e.value);
  De(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const eh = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function th(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const nh = ["data-ref"], sh = ["data-from", "data-ref"], ah = { class: "message-body" }, oh = ["title"], rh = ["innerHTML"], ih = ["title"], lh = ["innerHTML"], ch = {
  class: "message-faces",
  "data-message-faces": ""
}, uh = ["title", "data-face", "onClick"], dh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, hh = ["title", "data-reaction", "onClick"], fh = {
  key: 0,
  class: "message-reaction-count"
}, ph = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, mh = ["href", "title"], gh = ["src", "alt"], vh = ["href"], yh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, wh = {
  key: 1,
  "data-message-links-rows": ""
}, kh = { class: "message-foot" }, bh = { class: "message-time" }, $h = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, xh = 140, Mh = 2, _h = 1500, Sh = "An earlier message", Eh = "about", Ch = 3, Ah = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var le;
    const n = e, s = t, a = N(!1), o = N(null), r = O(() => ["user", "comment"].includes(n.message.type)), i = O(() => {
      const [te, J] = (n.message.commented_row || ":").split(":"), Q = ot(te);
      return Q ? { ref: `${Q}:${J}`, label: `${jt(Q).title.toLowerCase()} ${J}` } : null;
    }), c = O(() => n.message.worker_id ?? null), u = N(!1), h = O(() => c.value !== null && ((n.message.text ?? "").length > xh || (n.message.text ?? "").split(`
`).filter((te) => te.trim()).length > Mh)), g = O(() => r.value && !n.message.read_at && !n.message.local);
    async function k() {
      var te;
      await ((te = navigator.clipboard) == null ? void 0 : te.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, _h);
    }
    const M = O(() => ss(n.message.text ?? "", { env: "" })), P = O(() => JSON.parse(n.message.flowchart_edges || "[]")), L = N(!1), w = O(() => ss(n.quote || Sh, { env: "" }));
    function E() {
      const te = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      te ? te.scrollIntoView({ block: "center", behavior: "smooth" }) : Ze(`messages:${n.message.parent_id}`);
    }
    Qd(o, () => `${n.message.text} ${n.quote}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, V = (te) => `/api/files/message/${n.message.id}/${encodeURIComponent(te)}`, b = O(() => JSON.parse(n.message.captions || "{}")), m = O(() => (n.message.files ?? []).map((te) => ({ name: te, address: V(te), isImage: W.test(te), title: b.value[te] || te }))), R = O(() => ja(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), _ = Ce(Ne, null), D = N([]), $ = N(!1), S = O(() => `Linked: ${D.value.join(", ")}`), v = O(() => D.value.length >= Ch), f = O(() => `${D.value.length} linked ${D.value.every((te) => te.startsWith("task ")) ? "tasks" : "rows"}`);
    async function C() {
      if (!r.value || !(_ != null && _.read) || n.message.local) return;
      const te = await _.read(`link list --source message:${n.message.id}`);
      te.ok && (D.value = (te.value.rows ?? te.value ?? []).filter((J) => J.link_type === Eh).map((J) => `${J.target_model} ${J.target_id}`));
    }
    C(), (le = _ == null ? void 0 : _.follow) == null || le.call(_, ["link.*"], C);
    const A = N(!1), q = O(() => th(n.message.reactions));
    function ie(te) {
      A.value = !1, s("react", n.message, te);
    }
    return (te, J) => e.message.peer || e.message.recipient ? (l(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      H(Hd, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: J[0] || (J[0] = (Q) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, nh)) : (l(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", ah, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: ee(["message-card", "md", { comment: i.value }]),
          onClick: J[6] || (J[6] = (...Q) => z(mt) && z(mt)(...Q))
        }, [
          i.value ? (l(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: J[1] || (J[1] = Me((Q) => z(Ze)(i.value.ref), ["stop"]))
          }, [
            H(ke, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + y(i.value.label), 1)
          ], 8, oh)) : B("", !0),
          e.message.parent_id ? (l(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Me(E, ["stop"]),
            innerHTML: w.value
          }, null, 8, rh)) : B("", !0),
          c.value !== null ? (l(), d("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${c.value}`,
            onClick: J[2] || (J[2] = Me((Q) => z(Ze)(`agents:${c.value}`), ["stop"]))
          }, "Worker " + y(c.value), 9, ih)) : B("", !0),
          p("div", {
            class: ee({ "message-folded": h.value && !u.value }),
            "data-message-text": "",
            innerHTML: M.value
          }, null, 10, lh),
          h.value ? (l(), d("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: J[3] || (J[3] = Me((Q) => u.value = !u.value, ["stop"]))
          }, y(u.value ? "Show less" : "Show more"), 1)) : B("", !0),
          P.value.length ? (l(), d(Z, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[4] || (J[4] = (Q) => L.value = !0)
            }, "Open the flowchart"),
            L.value ? (l(), G(Sd, {
              key: 0,
              title: e.message.text,
              edges: P.value,
              onClose: J[5] || (J[5] = (Q) => L.value = !1)
            }, null, 8, ["title", "edges"])) : B("", !0)
          ], 64)) : B("", !0)
        ], 2),
        p("div", {
          class: ee(["message-tools", { picking: A.value }]),
          "data-message-tools": ""
        }, [
          A.value ? (l(), d(Z, { key: 0 }, [
            p("div", ch, [
              (l(!0), d(Z, null, re(z(eh), (Q) => (l(), d("button", {
                key: Q,
                type: "button",
                class: "message-face",
                title: `React ${Q}`,
                "data-face": Q,
                onClick: (Se) => ie(Q)
              }, y(Q), 9, uh))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[7] || (J[7] = (Q) => A.value = !1)
            }, [
              H(ke, {
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
            g.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: J[10] || (J[10] = (Q) => s("delete", e.message))
            }, "Delete")) : B("", !0)
          ], 64))
        ], 2)
      ]),
      q.value.length ? (l(), d("div", dh, [
        (l(!0), d(Z, null, re(q.value, (Q) => (l(), d("button", {
          key: Q.emoji,
          type: "button",
          class: ee(["message-reaction", { mine: Q.mine }]),
          title: Q.title,
          "data-reaction": Q.emoji,
          onClick: (Se) => s("react", e.message, Q.emoji)
        }, [
          he(y(Q.emoji) + " ", 1),
          Q.count > 1 ? (l(), d("span", fh, y(Q.count), 1)) : B("", !0)
        ], 10, hh))), 128))
      ])) : B("", !0),
      m.value.length ? (l(), d("div", ph, [
        (l(!0), d(Z, null, re(m.value, (Q) => (l(), d(Z, {
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
            }, null, 8, gh)
          ], 8, mh)) : (l(), d("a", {
            key: 1,
            href: Q.address,
            target: "_blank",
            class: "message-file"
          }, y(Q.name), 9, vh))
        ], 64))), 128))
      ])) : B("", !0),
      D.value.length ? (l(), d("div", yh, [
        H(Ve, {
          class: "message-links-icon",
          name: "linked"
        }),
        v.value && !$.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: J[11] || (J[11] = (Q) => $.value = !0)
        }, y(f.value), 1)) : (l(), d("span", wh, [
          H(at, {
            text: S.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : B("", !0),
      p("div", kh, [
        p("time", bh, y(R.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", $h, "message " + y(e.message.id), 1)) : B("", !0),
        r.value ? (l(), G(Kd, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : B("", !0)
      ])
    ], 8, sh));
  }
}, zv = /* @__PURE__ */ Y(Ah, [["__scopeId", "data-v-7e7b0f0d"]]), cn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], On = 200, uo = (e) => {
  var t;
  return ((t = cn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? cn[0].key;
}, Gv = (e) => {
  var t;
  return ((t = cn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Oh = ["aria-label"], Th = 300, ta = 400, Bh = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: On } },
  setup(e) {
    const t = e, n = O(() => uo(t.value)), s = O(() => n.value < On ? [1, 0.25, 0.25] : n.value === On ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: ee(["ico", "prio", { hot: n.value >= ta, high: n.value >= Th && n.value < ta }]),
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
    ], 10, Oh));
  }
}, Kv = /* @__PURE__ */ Y(Bh, [["__scopeId", "data-v-b10e610f"]]), Ih = ["aria-checked", "aria-haspopup", "onClick"], Rh = {
  key: 0,
  class: "segmented-dot"
}, Lh = {
  key: 1,
  class: "segmented-count"
}, Dh = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ka();
    return (a, o) => {
      const r = Xo("tip");
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
          i.dot ? (l(), d("span", Rh)) : B("", !0),
          he(" " + y(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", Lh, y(i.count), 1)) : B("", !0)
        ], 10, Ih)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Nh = /* @__PURE__ */ Y(Dh, [["__scopeId", "data-v-ca953072"]]), na = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, jh = {
  key: 1,
  class: "text-field-label"
}, Ph = {
  key: 2,
  class: "text-field-end"
}, qh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Gn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var h;
    const n = zn(e, "modelValue"), s = $a(), a = "onUpdate:modelValue" in (((h = Qo()) == null ? void 0 : h.vnode.props) || {}), o = O(() => a ? n.value : s.value), r = (g) => a && (n.value = g.target.value), i = O(
      () => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "class" && g !== "style" && g !== "value"))
    ), c = O(() => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "value"))), u = N(null);
    return t({ focus: () => u.value && u.value.focus() }), (g, k) => e.label || e.icon || g.$slots.end ? (l(), d("label", {
      key: 0,
      class: ee(["text-field", { large: e.large, ended: g.$slots.end }, z(s).class]),
      style: $e(z(s).style)
    }, [
      e.icon ? (l(), G(ke, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : B("", !0),
      e.label ? (l(), d("span", jh, y(e.label), 1)) : B("", !0),
      it(p("input", rt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(na), o.value]
      ]),
      g.$slots.end ? (l(), d("span", Ph, [
        we(g.$slots, "end", {}, void 0, !0)
      ])) : B("", !0)
    ], 6)) : it((l(), d("input", rt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
      [z(na), o.value]
    ]);
  }
}), Yv = /* @__PURE__ */ Y(qh, [["__scopeId", "data-v-d9c38ca8"]]), sa = (e) => e.page * e.size < e.total;
function Wh(e, t, { incremental: n = !1 } = {}) {
  const s = vs(), a = N([]), o = N(""), r = N(!1), i = N(!1), c = N(""), u = N(null);
  async function h(w) {
    const E = await s.read(`${e} --before-id ${w + 1} --limit 1`);
    if (!E.ok) return P();
    const W = E.value.rows.find((V) => V.id === w);
    a.value = W ? a.value.map((V) => V.id === w ? W : V) : a.value.filter((V) => V.id !== w);
  }
  async function g(w) {
    if (n && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((m) => m.id !== w.row_id));
    if (n && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && a.value.some((m) => m.id === w.row_id)) return h(w.row_id);
    if (!(n && a.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return P();
    const W = Math.max(...a.value.map((m) => m.id)), V = await s.read(`${e} --after-id ${W}`);
    if (!V.ok) return P();
    const b = new Set(a.value.map((m) => m.id));
    a.value = [...V.value.rows.filter((m) => !b.has(m.id)), ...a.value];
  }
  async function k() {
    if (!a.value.length) return !1;
    const w = Math.min(...a.value.map((V) => V.id)), E = await s.read(`${e} --before-id ${w}`);
    if (!E.ok || !E.value.rows.length) return i.value = !1;
    i.value = sa(E.value);
    const W = new Set(a.value.map((V) => V.id));
    return a.value = [...a.value, ...E.value.rows.filter((V) => !W.has(V.id))], !0;
  }
  let M = 0;
  async function P() {
    const w = ++M, E = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (w !== M) return;
    const W = E.ok ? s.shared ? [E.value] : E.value.rows : [], V = W.length ? Math.min(...W.map((b) => b.id)) : 0;
    a.value = n && E.ok && V ? [...a.value.filter((b) => b.id > Math.max(...W.map((m) => m.id))), ...W, ...a.value.filter((b) => b.id < V)] : W, E.ok && !a.value.some((b) => b.id < V) && (i.value = !s.shared && sa(E.value)), o.value = E.ok ? "" : E.error, r.value = !0;
  }
  async function L(w) {
    const E = await s.run(w);
    return c.value = E.ok ? "" : E.error, u.value = E.ok ? E.value : null, await P(), E;
  }
  return s.follow(t, g), P(), { rows: a, failure: o, loaded: r, more: i, load: P, older: k, act: L, actionFailure: c, answer: u, context: s };
}
const Fh = { class: "title" }, Hh = { class: "state" }, Uh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Wh(t.line, t.events);
    return (o, r) => (l(), G(Zr, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: U(({ row: i }) => [
        p("span", Fh, y(i.title), 1),
        p("span", Hh, y(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Jv = /* @__PURE__ */ Y(Uh, [["__scopeId", "data-v-a69084cd"]]), Tn = N(Date.now() / 1e3);
let aa = 0, Kt = 0;
function Vh() {
  return Kt || (Tn.value = Date.now() / 1e3, aa = setInterval(() => Tn.value = Date.now() / 1e3, 1e3)), Kt += 1, xa() && Ma(() => {
    Kt -= 1, Kt || clearInterval(aa);
  }), Tn;
}
const zh = ["title", "data-figure-mark", "data-folded", "data-open"], Gh = {
  key: 2,
  class: "worker"
}, Kh = { class: "head" }, Yh = { key: 0 }, Jh = {
  key: 3,
  class: "status"
}, Zh = {
  key: 0,
  class: "figure"
}, Xh = {
  key: 1,
  class: "ran-for"
}, Qh = { key: 2 }, ef = {
  key: 3,
  class: "news"
}, tf = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, nf = {
  key: 6,
  class: "settled"
}, sf = {
  key: 1,
  class: "bar"
}, af = {
  key: 3,
  class: "detail body"
}, of = {
  key: 0,
  class: "body-label"
}, rf = ["title"], lf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = $a(), s = ["onClick", "onAct"], a = O(() => Object.fromEntries(Object.entries(n).filter(([J]) => !s.includes(J)))), o = N(!1), r = O(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = O(() => t.open !== void 0), c = O(() => i.value || r.value), u = O(() => i.value ? t.open : o.value), h = O(() => i.value ? !t.open : r.value && !o.value), g = O(() => !!(t.mark.action && n.onAct)), k = O(() => c.value || g.value || !!n.onClick), M = N(null), P = N(null), { folded: L, phase: w } = co(M, () => h.value);
    function E(J) {
      var Q, Se;
      if (!(J.target !== M.value && !P.value.contains(J.target))) {
        if (i.value) return (Q = n.onClick) == null ? void 0 : Q.call(n, J);
        if (r.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(J);
      }
    }
    const W = (J) => n.onAct(J), V = ["failed", "unfinished"], b = O(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? V.includes(t.mark.state) ? "danger" : "good" : ""), m = O(() => t.mark.color ? t.mark.color : b.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : b.value ? `var(--tone-${b.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), R = O(() => m.value || "var(--tone-work)"), _ = O(() => !t.mark.ending && !t.mark.ended && b.value !== "stopped"), D = Vh(), $ = O(
      () => t.mark.began_at && _.value && !t.mark.figure && !t.mark.counting ? rl(D.value - t.mark.began_at) : ""
    ), S = O(() => {
      const { started: J, ended: Q } = t.mark;
      return J ? Q ? `ran ${Fs(Q - J, !0)}` : Fs(D.value - J, !0) : $.value;
    }), v = ["bad", "danger", "warn"], f = O(() => v.includes(b.value) || t.mark.asks ? "attention" : _.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), C = ["bad", "danger"], A = O(() => C.includes(b.value)), q = O(() => f.value === "process" ? "running" : A.value ? "cross" : b.value === "stopped" ? "stopped" : b.value === "good" ? "tick" : ""), ie = O(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || q.value || t.mark.settled || t.mark.news)
    ), le = O(() => [t.mark.title, t.mark.time ? ja(t.mark.time) : ""].filter(Boolean).join(" · ")), te = O(() => ({
      ...m.value ? { "--mark": m.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (J, Q) => (l(), d("div", rt(a.value, {
      ref_key: "root",
      ref: M,
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
          tinted: m.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: te.value,
      title: le.value,
      "data-figure-mark": e.mark.key,
      "data-folded": z(L) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: E
    }), [
      (l(), G(lt(k.value ? "button" : "span"), {
        ref_key: "top",
        ref: P,
        class: "top",
        type: k.value ? "button" : void 0,
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
          e.mark.worker ? (l(), d("span", Gh, y(e.mark.worker), 1)) : B("", !0),
          p("span", Kh, [
            H(at, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", Yh, y(e.mark.name), 1)) : B("", !0),
            c.value ? (l(), G(It, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : B("", !0)
          ]),
          ie.value ? (l(), d("span", Jh, [
            e.mark.figure ? (l(), d("span", Zh, y(e.mark.figure), 1)) : B("", !0),
            S.value ? (l(), d("span", Xh, y(S.value), 1)) : B("", !0),
            e.mark.stopping ? (l(), d("span", Qh, "Stopping")) : B("", !0),
            e.mark.news ? (l(), d("span", ef, y(e.mark.news), 1)) : B("", !0),
            q.value === "running" ? (l(), d("span", tf)) : q.value ? (l(), G(Ve, {
              key: 5,
              class: ee(["sign", q.value]),
              name: q.value
            }, null, 8, ["class", "name"])) : B("", !0),
            e.mark.settled ? (l(), d("span", nf, y(e.mark.settled), 1)) : B("", !0)
          ])) : B("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      g.value ? (l(), G(lo, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: Me(W, ["stop"])
      }, null, 8, ["label", "open"])) : B("", !0),
      (e.mark.figure || e.mark.counting) && _.value ? (l(), d("span", sf, [
        p("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: R.value })
        }, null, 4)
      ])) : B("", !0),
      e.mark.detail && !z(L) ? (l(), G(at, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : B("", !0),
      e.mark.body && !z(L) ? (l(), d("div", af, [
        e.mark.bodyLabel ? (l(), d("p", of, y(e.mark.bodyLabel), 1)) : B("", !0),
        H(at, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : B("", !0),
      e.mark.command && !z(L) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, y(e.mark.command), 9, rf)) : B("", !0),
      e.mark.card ? (l(), G(at, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : B("", !0),
      we(J.$slots, "default", {
        shown: !z(L)
      }, void 0, !0)
    ], 16, zh));
  }
}), ho = /* @__PURE__ */ Y(lf, [["__scopeId", "data-v-f1006e54"]]), cf = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function fo(e) {
  var n;
  const t = cf[e] || ((n = jt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const uf = (e) => fo(String(e).split(":")[0]), po = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), df = { passed: "good", failed: "danger", warned: "warn", running: "" }, hf = { good: "good", warn: "warn", danger: "danger" }, oa = {
  "open row": (e) => Ze(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Hr(e.target_model, e.target_id || 0)
}, ff = { "open row": (e) => uf(e.target_model), "open page": () => fo("pages") };
function pf(e, t) {
  const n = t || {}, s = oa[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? df[e.outcome] || "" : hf[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? ff[s](e) : "",
    handlers: s ? { onAct: () => oa[s](e) } : {}
  };
}
const mf = 24, gf = 1e3, ra = 2e3, vf = 0.25, yf = 5e3;
function wf(e, t = mf, n = () => !0) {
  const s = N(!1), a = N(0), o = N(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, h = () => {
    const b = u();
    return b ? b.scrollHeight - b.scrollTop - b.clientHeight : 0;
  }, g = () => !u() || h() <= t;
  function k(b) {
    if (clearTimeout(r), !b) {
      o.value = !1, c = Date.now();
      return;
    }
    const m = Date.now() - c < ra ? ra : gf;
    r = setTimeout(() => o.value = s.value, m);
  }
  function M() {
    clearTimeout(i), s.value = !1, a.value = 0, k(!1);
  }
  function P(b = !1) {
    const m = u();
    m && b && m.scrollTo ? m.scrollTo({ top: m.scrollHeight, behavior: "smooth" }) : m && (m.scrollTop = m.scrollHeight), M();
  }
  function L() {
    E(), !s.value && (s.value = !0, k(!0));
  }
  const w = () => !!u() && h() <= u().clientHeight * vf;
  function E() {
    clearTimeout(i), w() && (i = setTimeout(() => s.value && w() && n() && P(!0), yf));
  }
  function W() {
    g() ? M() : L();
  }
  function V(b = 1, m = !1) {
    s.value ? a.value += Math.max(0, b) : P(m);
  }
  return xa() && Ma(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: h, atBottom: g, follow: M, toBottom: P, left: L, scrolled: W, arrived: V };
}
const kf = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(null), { away: o, scrolled: r, arrived: i, toBottom: c } = wf(a);
    be(
      () => n.lines.length,
      () => Dt(() => i()),
      { immediate: !0 }
    );
    function u(h) {
      r(), s("older", h.target);
    }
    return (h, g) => (l(), d("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      he(y(e.lines.join(`
`) || e.empty), 1),
      z(o) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: g[0] || (g[0] = (k) => z(c)(!0))
      }, "Follow")) : B("", !0)
    ], 544));
  }
}, bf = /* @__PURE__ */ Y(kf, [["__scopeId", "data-v-09394a20"]]), $f = 1e4;
class xf {
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
    return this.heardAt !== null && t - this.heardAt > $f;
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
const Mf = {
  key: 0,
  class: "frame-note"
}, _f = {
  key: 0,
  class: "frame-note"
}, Sf = ["src", "title"], Ef = 1e3, Cf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = vs(), s = N(null), a = N(!1), o = N(!1);
    let r = null, i = 0;
    return De(() => {
      r = new xf(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Ef);
    }), Ae(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", Mf, "This window was closed because it stopped answering.")) : (l(), d(Z, { key: 1 }, [
      a.value ? (l(), d("div", _f, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        H(ve, {
          onClick: u[0] || (u[0] = (h) => o.value = !0)
        }, {
          default: U(() => [...u[1] || (u[1] = [
            he("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : B("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: z(n).window
      }, null, 8, Sf)
    ], 64));
  }
}, Af = /* @__PURE__ */ Y(Cf, [["__scopeId", "data-v-32a49046"]]), Of = 0, Tf = "/api/lines", Bf = "/api/line";
class If {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Of));
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
        const n = await je.raw(Tf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(Bf, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Rf = new If();
class Lf {
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
      n.patterns.some((s) => mo(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function mo(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Df = Symbol("pane-page"), Nf = { 1: "refused", 2: "usage", 3: "fault" }, jf = 100, Pf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function qf({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = N({}), declared: u = [], page: h = null, setOption: g = () => {
}, autoScroll: k = "", tabs: M = [], readOnly: P = !1, shared: L = null }) {
  const w = /* @__PURE__ */ new Map(), E = new AbortController(), W = (V) => {
    const b = w.get(V);
    if (b && performance.now() - b.at < jf) return b.answer;
    const m = Ct(e, V, t, E.signal);
    return w.set(V, { answer: m, at: performance.now() }), m;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: h,
    visible: O(() => s()),
    permissions: a,
    autoScroll: k,
    tabs: M,
    readOnly: P,
    shared: L,
    read: W,
    run: (V) => Ct(e, V, t, E.signal),
    upload: (V) => Ff(V, E.signal),
    cancel: () => E.abort(),
    follow: (V, b) => r.follow(e, V.filter((m) => o.some((R) => mo(R, m))), b, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (V) => O(() => {
      var b;
      return c.value[V] ?? ((b = u.find((m) => m.key === V)) == null ? void 0 : b.default);
    }),
    setting: async (V, b) => {
      const m = await W(`window setting ${e} ${V}`);
      return m.ok ? m.value.value : b;
    },
    setOption: g,
    keep: (V, b) => Ct(e, ["window", "save-setting", e, V, JSON.stringify(b)], t, E.signal)
  };
}
function Wf(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const un = { ok: !1, failure: "cancelled", error: "" };
async function Ct(e, t, n, s = void 0) {
  try {
    const a = await Rf.add({ window: e, line: Array.isArray(t) ? t : Hf(t), environment: n }, s);
    return s != null && s.aborted ? un : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Nf[a.code] || "fault", error: Wf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? un : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function Ff(e, t = void 0) {
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? un : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? un : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function Hf(e) {
  return [...e.matchAll(Pf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Uf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Vf = {
  class: "allowance-prompt",
  role: "dialog"
}, zf = { class: "allowance-prompt-text" }, Gf = { class: "allowance-prompt-buttons" }, Kf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", Vf, [
      p("p", zf, y(z(Uf)(e.request)), 1),
      p("div", Gf, [
        H(ve, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            he("Allow", -1)
          ])]),
          _: 1
        }),
        H(ve, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            he("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Yf = /* @__PURE__ */ Y(Kf, [["__scopeId", "data-v-102dc765"]]), Bn = {
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
        he(y(e.reason) + " ", 1),
        e.retry ? (l(), G(ve, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            he("Retry", -1)
          ])]),
          _: 1
        })) : B("", !0),
        e.removable ? (l(), G(ve, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            he("Remove tab", -1)
          ])]),
          _: 1
        })) : B("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Jf = ["data-window", "data-agent"], Zf = {
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
    const n = e, s = t, a = N(""), o = N(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Ce(Er, null), c = qf({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: O(() => n.options),
      declared: n.declared,
      page: Ce(Df, null),
      setOption: (g, k) => s("option", g, k),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (g, k) => {
        s("open", g, k), i == null || i(g, k);
      }
    });
    er(Ne, c), be(() => n.visible, (g) => g && n.subscriptions.shown(n.name)), Ae(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), tr((g) => (a.value = g instanceof Error ? g.message : String(g), n.subscriptions.stopAll(n.name), !1));
    const u = () => ps(n.component), h = () => {
      var g, k;
      return ((k = (g = n.prompts) == null ? void 0 : g.current.value) == null ? void 0 : k.window) === n.name ? n.prompts.current.value : null;
    };
    return (g, k) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      h() ? (l(), G(Yf, {
        key: 0,
        request: h(),
        onAnswer: k[0] || (k[0] = (M) => e.prompts.answer(M))
      }, null, 8, ["request"])) : B("", !0),
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
        onRemove: k[1] || (k[1] = (M) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Jf));
  }
}, go = /* @__PURE__ */ Y(Zf, [["__scopeId", "data-v-04dd3be3"]]), Xf = {
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
    const n = e, s = t, a = { render: () => ps(Af, { src: n.entry.entry_url }) };
    return (o, r) => (l(), G(go, {
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
}, os = "journal.stale-build-reload", Qf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function e1(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(os) === e.message) return !1;
    t.setItem(os, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function t1(e = window.sessionStorage) {
  try {
    e.removeItem(os);
  } catch {
    return;
  }
}
const n1 = ["data-window"], s1 = {
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
    const n = e, s = t, a = mn(null), o = N("");
    return be(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, t1();
          } catch (i) {
            if (Qf(i) && e1(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (l(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      H(wt, { shape: "cards" })
    ], 8, n1)) : (l(), G(go, {
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
}, a1 = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new Lf(), s = ((i = Ce(Ne, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = O(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = O(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), G(s1, {
      key: 0,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), G(Xf, {
      key: 1,
      entry: o.value,
      subscriptions: z(n),
      environment: z(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, o1 = { class: "mark-more-inner" }, r1 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, i1 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, l1 = {
  key: 3,
  class: "mark-lines"
}, c1 = "process", ia = "task", u1 = 2e3, d1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ce(Ne), s = O(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = O(() => po.has(t.mark.variant) && t.mark.detail || ""), o = O(() => t.mark.target_model === ia ? t.mark.target_id : 0), r = N([]), i = N(!1), c = N(""), u = O(() => t.mark.target_model === c1 && !!t.mark.target_id);
    async function h() {
      const M = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = M.ok ? "" : M.error, M.ok && (r.value = M.value.lines);
    }
    let g = null;
    const k = () => clearInterval(g);
    return be(() => t.shown && u.value, (M) => {
      k(), M && (h(), t.mark.ended_at || (g = setInterval(h, u1)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (M) => M && t.shown && u.value && (k(), h())), Ae(k), (M, P) => (l(), d("div", {
      class: ee(["mark-more", { open: e.shown }]),
      onClick: P[1] || (P[1] = Me(() => {
      }, ["stop"]))
    }, [
      p("div", o1, [
        e.declaration.body_url ? (l(), G(a1, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(Z, { key: 1 }, [
          a.value ? (l(), d(Z, { key: 0 }, [
            P[2] || (P[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", r1, y(a.value), 1)
          ], 64)) : B("", !0),
          u.value && c.value ? (l(), d("p", i1, y(c.value), 1)) : u.value && i.value ? (l(), d(Z, { key: 2 }, [
            P[3] || (P[3] = p("p", { class: "mark-label" }, "Output", -1)),
            H(bf, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", l1, y(s.value.join(`
`)), 1)) : B("", !0),
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: P[0] || (P[0] = Me((L) => z(Ze)(`${ia}:${o.value}`), ["stop"]))
          }, "Open task " + y(o.value) + " and its proofs", 1)) : B("", !0)
        ], 64))
      ])
    ], 2));
  }
}, rs = /* @__PURE__ */ Y(d1, [["__scopeId", "data-v-51f69bf1"]]), h1 = (e) => `show-${e}`, Zv = (e, t, n) => e.filter((s) => {
  var a;
  return n(h1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), f1 = "messages.chat", p1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), vo = (e, t, n) => Ct(f1, p1(e, t), n), m1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, g1 = ["title", "aria-label", "onClick"], v1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, y1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = O(() => m1(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = N(""), a = Ce(Ne);
    async function o(r) {
      const i = await vo(r, t.mark, a.environment);
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
        H(Ve, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, g1))), 128)),
      s.value ? (l(), d("span", v1, y(s.value), 1)) : B("", !0)
    ], 64));
  }
}, w1 = /* @__PURE__ */ Y(y1, [["__scopeId", "data-v-0dfda102"]]);
function yo(e, t) {
  const n = mn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const wo = yo("/api/marks", "marks"), Xv = wo.fetchAll, k1 = wo.find, b1 = 2e3;
function ko(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, b1);
  };
  De(async () => {
    await e(), s();
  }), yt(() => clearTimeout(n));
}
const $1 = ["data-ref"], x1 = ["data-ref"], M1 = { class: "mark-row" }, _1 = "dock add", S1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = O(() => k1(s.mark.type)), o = Ce(Ne, null), r = O(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = N(null);
    ko(async () => {
      if (!r.value) return;
      const k = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      k.ok && k.value.rows.length && (i.value = k.value.rows[0].progress);
    }, () => r.value);
    const c = O(() => {
      const k = pf(s.mark, a.value), M = !k.figure || k.figure.endsWith("%");
      return i.value && r.value && M ? { ...k, figure: `${i.value}%`, fraction: i.value / 100 } : k;
    }), u = O(() => {
      var k;
      return !!(s.mark.lines || s.mark.detail && po.has(s.mark.variant) || t.has(s.mark.target_model) || (k = a.value) != null && k.body_url);
    }), h = N(!1), g = O(() => {
      var k, M, P;
      return s.docked ? (M = (k = a.value) == null ? void 0 : k.buttons) == null ? void 0 : M.filter((L) => {
        var w;
        return !((w = L.runs) != null && w.startsWith(_1));
      }) : (P = a.value) == null ? void 0 : P.buttons;
    });
    return (k, M) => {
      var P, L;
      return (P = a.value) != null && P.card ? (l(), d("div", {
        key: 0,
        class: ee(["thread-turn", "card", "whole-card", { "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        H(rs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, $1)) : (l(), d("div", {
        key: 1,
        class: ee(["thread-turn", "card", { "full-width": (L = a.value) == null ? void 0 : L.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", M1, [
          H(ho, rt({
            mark: c.value,
            open: u.value ? h.value : void 0
          }, nr(c.value.handlers), {
            onClick: M[0] || (M[0] = (w) => h.value = !h.value)
          }), sr({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: U(({ shown: w }) => [
                H(rs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: w
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          H(w1, {
            buttons: g.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, x1));
    };
  }
}, E1 = /* @__PURE__ */ Y(S1, [["__scopeId", "data-v-2e5fac8c"]]), C1 = ["data-ref"], A1 = ["inert"], O1 = { class: "thread-group" }, T1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = N(!1), s = N(!1);
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
      H(ho, {
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
        p("div", O1, [
          (l(!0), d(Z, null, re(e.group.marks, (i) => (l(), G(E1, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, A1)) : B("", !0)
    ], 8, C1));
  }
}, Qv = /* @__PURE__ */ Y(T1, [["__scopeId", "data-v-8a285510"]]);
function B1(e) {
  const t = N(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return De(() => n.observe(e.value)), yt(() => n.disconnect()), t;
}
const I1 = { class: "chat-dock-fold" }, R1 = ["aria-label"], L1 = { class: "chat-dock-head" }, D1 = { class: "chat-dock-inner" }, bo = 700, N1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = N(null), s = N(null), a = B1(s), o = N(!1);
    let r = 0;
    return De(() => r = setTimeout(() => o.value = !0, bo)), yt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: ee(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", I1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: ee(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          we(i.$slots, "edge"),
          p("header", L1, [
            we(i.$slots, "head")
          ]),
          p("div", {
            class: ee(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", D1, [
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
        ], 10, R1)
      ])
    ], 2));
  }
}, $o = /* @__PURE__ */ Y(N1, [["__scopeId", "data-v-63e4dcfc"]]), j1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, In = 5, P1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(In, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${In}s`, animationDelay: `${(n - In).toFixed(2)}s` };
    return (a, o) => (l(), d("span", j1, [
      p("i", { style: s })
    ]));
  }
}, q1 = /* @__PURE__ */ Y(P1, [["__scopeId", "data-v-d0c4b012"]]), xo = yo("/api/docks", "docks"), ey = xo.fetchAll, is = xo.find, W1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ls = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), F1 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), H1 = (e) => e.kept ? ls("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : ls("keep", "pin", "Pin", `dock keep ${e.id}`), U1 = ["pin", "stop"], V1 = (e) => ({ ...e, iconOnly: U1.includes(e.icon) });
function z1(e, t) {
  var n;
  return [
    ...F1(e, t) ? [H1(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || jt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ls("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(V1);
}
const G1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: W1(e, t),
  buttons: z1(e, t)
}), K1 = { class: "dock-title" }, Y1 = ["aria-expanded", "title"], J1 = { class: "chat-dock-acts dock-acts" }, Z1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, X1 = {
  key: 1,
  class: "dock-text"
}, Q1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = O(() => is(s.item.type)), o = N(null), r = O(() => G1(s.item, a.value)), i = Ce(Ne), c = N(/* @__PURE__ */ new Set()), u = N("");
    async function h(M) {
      if (M.action === "open") return Ze(`${s.item.target_model}:${s.item.target_id}`);
      M.action === "declared" && (c.value = /* @__PURE__ */ new Set([...c.value, M.label])), u.value = "";
      const L = await vo(M, s.item, i.environment);
      (L == null ? void 0 : L.ok) === !1 && (c.value = new Set([...c.value].filter((w) => w !== M.label)), u.value = L.error);
    }
    const g = O(() => r.value.buttons.filter((M) => M.action !== "undock" && !c.value.has(M.label))), k = O(() => r.value.buttons.find((M) => M.action === "undock"));
    return (M, P) => (l(), G($o, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: U(() => [
        e.leaving ? (l(), G(q1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : B("", !0)
      ]),
      head: U(() => {
        var L, w, E;
        return [
          (L = a.value) != null && L.draws_head ? (l(), d("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(Z, { key: 1 }, [
            H(ke, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", K1, y(r.value.title), 1)
          ], 64)),
          (w = a.value) != null && w.badge ? (l(), d("span", {
            key: 2,
            class: ee(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, y(a.value.badge), 3)) : B("", !0),
          (E = a.value) != null && E.draws_head ? B("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: P[0] || (P[0] = (W) => n("fold"))
          }, [
            H(It, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, Y1)),
          p("span", J1, [
            (l(!0), d(Z, null, re(g.value, (W) => (l(), d(Z, {
              key: W.action + W.runs
            }, [
              W.iconOnly ? (l(), G(ve, {
                key: 0,
                kind: "icon",
                "aria-label": W.label,
                title: W.label,
                "data-dock-action": W.action,
                onClick: (V) => h(W)
              }, {
                default: U(() => [
                  H(ke, {
                    name: W.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (l(), G(ve, {
                key: 1,
                small: "",
                kind: W.primary ? "primary" : "ghost",
                bordered: !W.primary,
                "data-dock-action": W.action,
                onClick: (V) => h(W)
              }, {
                default: U(() => [
                  he(y(W.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          H(ys, {
            title: k.value.label,
            "data-dock-action": "undock",
            onClick: P[1] || (P[1] = (W) => h(k.value))
          }, null, 8, ["title"])
        ];
      }),
      default: U(() => {
        var L, w;
        return [
          u.value ? (l(), d("p", Z1, y(u.value), 1)) : B("", !0),
          e.item.text && !((L = a.value) != null && L.body_url) ? (l(), d("p", X1, y(e.item.text), 1)) : B("", !0),
          (w = a.value) != null && w.body_url ? (l(), G(rs, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : B("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded"]));
  }
}, la = /* @__PURE__ */ Y(Q1, [["__scopeId", "data-v-53b368f0"]]), ep = ["title", "aria-label"], tp = { class: "run-chip-in" }, np = {
  key: 0,
  class: "run-chip-ring"
}, sp = { class: "run-chip-name" }, ap = { class: "run-chip-bar" }, op = "processes.output", rp = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var h;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((h = Ce(Ne, null)) == null ? void 0 : h.environment) ?? "", o = N(null), r = O(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = O(() => {
      var g, k;
      return ((g = o.value) == null ? void 0 : g.title) || ((k = o.value) == null ? void 0 : k.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = O(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const g = await Ct(op, ["process", "card", String(s.item.target_id)], a);
      g.ok && (o.value = g.value);
    }
    return ko(u, () => r.value), (g, k) => {
      var M;
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: $e({ "--tone": c.value })
      }, [
        p("span", tp, [
          r.value ? (l(), d("span", np)) : (l(), G(Ve, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", sp, y(i.value), 1)
        ]),
        p("span", ap, [
          p("i", {
            style: $e({ width: r.value ? `${((M = o.value) == null ? void 0 : M.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, ep);
    };
  }
}, ip = /* @__PURE__ */ Y(rp, [["__scopeId", "data-v-2036e274"]]), lp = 24, cp = 8, ty = 420;
function ny({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= lp && e > t ? !0 : e < t && a > cp ? !1 : null;
}
const up = (e, t) => e === void 0 ? t : e, dp = 6, hp = 3, ca = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, St = (e) => !!(e.leaves_at && !e.kept), fp = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!St(e) || t < e.leaves_at || n.has(e.id)), pp = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => fp(s, t, n)).sort((s, a) => s.id - a.id);
function mp(e, t, n = dp) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const gp = (e, t) => e >= hp ? !0 : e <= 1 ? !1 : t, vp = {
  key: "runs-head",
  class: "dock-runs-head"
}, yp = { class: "dock-runs-chips" }, wp = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = N(Date.now() / 1e3), s = N(/* @__PURE__ */ new Set()), a = N(!1), o = N(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ae(() => clearInterval(r));
    const i = O(() => pp(t.items, n.value, s.value)), c = O(() => mp(i.value.filter((W) => ca(W, is)), n.value)), u = O(() => i.value.filter((W) => !c.value.includes(W) && !ca(W, is))), h = O(() => (a.value = gp(c.value.length, a.value)) && !o.value), g = N({}), k = (W) => up(g.value[W.id], t.folded);
    function M(W) {
      g.value = { ...g.value, [W.id]: !k(W) };
    }
    function P(W) {
      g.value = { ...g.value, ...Object.fromEntries(c.value.map((V) => [V.id, V.id !== W.id])) }, o.value = !0;
    }
    function L() {
      g.value = Object.fromEntries(Object.entries(g.value).filter(([W]) => !c.value.some((V) => String(V.id) === W))), o.value = !1;
    }
    function w(W) {
      s.value = /* @__PURE__ */ new Set([...s.value, W.id]);
    }
    function E(W) {
      s.value = new Set([...s.value].filter((V) => V !== W.id));
    }
    return (W, V) => (l(), G(wa, {
      tag: "div",
      name: "dock",
      duration: z(bo),
      class: "dock-stack"
    }, {
      default: U(() => [
        (l(!0), d(Z, null, re(u.value, (b) => (l(), G(la, {
          key: b.id,
          item: b,
          class: ee({ timed: z(St)(b) }),
          leaving: z(St)(b) && !s.value.has(b.id),
          folded: k(b),
          onFold: (m) => M(b),
          onMouseenter: (m) => w(b),
          onMouseleave: (m) => E(b)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (l(), d("div", vp, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: L
          }, [
            he(y(c.value.length) + " runs ", 1),
            H(It, { open: "" })
          ])
        ])) : B("", !0),
        (l(!0), d(Z, null, re(h.value ? [] : c.value, (b) => (l(), G(la, {
          key: b.id,
          item: b,
          class: ee({ timed: z(St)(b) }),
          leaving: z(St)(b) && !s.value.has(b.id),
          folded: k(b),
          onFold: (m) => M(b),
          onMouseenter: (m) => w(b),
          onMouseleave: (m) => E(b)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        h.value ? (l(), G($o, {
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
              onClick: V[0] || (V[0] = (b) => o.value = !0)
            }, [
              H(Ve, { name: "runs" }),
              he(" " + y(c.value.length) + " runs ", 1),
              H(It)
            ]),
            p("span", yp, [
              (l(!0), d(Z, null, re(c.value, (b) => (l(), G(ip, {
                key: b.id,
                item: b,
                onClick: (m) => P(b)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : B("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, sy = /* @__PURE__ */ Y(wp, [["__scopeId", "data-v-98291381"]]), Et = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, en = (e) => Math.min(Math.max(e, 0), 1), kp = (e) => {
  const t = en(e);
  return t * t * (3 - 2 * t);
}, tt = (e, t, n) => kp((e - t) / (n - t));
function ay(e) {
  const t = en(e), n = en((t - 0.12) / 0.76) * Et.shuffles, s = Math.min(Math.floor(n), Et.shuffles - 1), a = n - s, o = tt(a, 0.26, 0.38) * (1 - tt(a, 0.76, 0.96)), r = tt(a, 0.38, 0.76), i = tt(t, 0, 0.12) * (1 - tt(t, 0.88, 1)), c = tt(a, 0.2, 0.34) * (1 - tt(a, 0.84, 1)), u = Math.sin(Math.PI * en((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / Et.shuffles, lift: Et.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const Mo = 2400, bp = 0.05;
function oy({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, bp), r = Math.min(t + Mo * o, a), i = e + r * o;
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
}, cs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), $p = (e) => e * e * (3 - 2 * e), dn = (e, [t, n]) => $p(cs(e, t, n)), xp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Yt = ([e, t], n) => e + n() * (t - e);
function Mp(e) {
  return xp.map(() => {
    const t = Yt(Ye.speed, e), n = Yt(Ye.angle, e) * Math.PI / 180, s = Yt(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Yt(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const _p = Mp(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Sp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function ry(e, t, n = _p) {
  const s = Xe.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = Sp(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const c = Math.min(a, r), u = s.from.map((h, g) => h + o.velocity[g] * c);
  return u[2] -= Ye.gravity * c * c / 2, { at: u, turn: o.spin * c, landed: Math.max(0, a - r) / i };
}
function iy(e, t) {
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
const ly = () => Array.from({ length: Xe.pogo.count }, (e, t) => Xe.pogo.bounce * (t + 1) / Xe.pogo.count), cy = { stride: 0.5 };
function _o(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: cs(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: cs(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function uy(e) {
  const { into: t, out: n } = _o(Xe.rope_swing, e);
  return 1 - dn(t, [0, 1]) * (1 - dn(n, [0, 1]));
}
function dy(e) {
  const t = Xe.rope_swing, { into: n, out: s } = _o(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return dn(n, [0, 1]) * (1 - dn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Ep = { after: 3 }, Cp = 10, Ap = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Op = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Tp = { weight: 19 }, Bp = {
  build: { cooldown: 180 }
}, Ip = { every: 120 }, So = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Eo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Rp = {
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
}, Wt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Cp }), ne = (e, t, n = {}) => Wt(e, "clip", t, n), Rn = (e, t, n = {}) => Wt(e, "look", t, n), ua = (e, t, n = {}) => Wt(e, "gaze", t, n), de = (e, t, n = {}, s = {}) => ({ ...Wt(e, "pick", t, n), ...s }), me = (e) => Wt("nothing", "nothing", e, {}), Lp = 120, Dp = 300, Ln = (e, t) => ({ ...ne(e, t), cooldown: Dp }), Np = 120, se = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), jp = () => [ne("joy", 2)], nt = (e, t, n, s, a = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), st = (e) => ({ ...e, cooldown: Ap[e.name] }), _t = (e) => ({ ...e, shenanigan: !0, lasts: Op[e.name] }), Ss = [
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
  ...se("messaged", { cooldown: Np }, [ne("phone_call", 1)]),
  ...se("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ne("nod", 4), ne("hand_rub", 4), me(7)]),
  ...se("question_asked", { cooldown: 60 }, [ne("ask_sign", 9), ne("look_up", 3), me(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...se("reported", { cooldown: 90 }, [ua("read", 3), ne("nod", 1), me(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...se("read_message", { cooldown: 30 }, [ua("read", 3), me(1)]),
  ...se("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), me(6)]),
  ...se("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), me(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...se("bar_done", { holds: !0 }, jp()),
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
  ...se("answered", { cooldown: 15 }, [Rn("amused", 3), me(2)]),
  ...se("heard", { cooldown: 30 }, [
    ne("bow", 1, { voices: ["butler"] }),
    ne("salute", 1, { voices: ["squire"] }),
    ne("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    me(1)
  ]),
  ...se("long_walk", { cooldown: 90 }, [ne("stumble", 3), me(22)]),
  ...se("card_arrived", { cooldown: 20, toward: "card" }, [ne("glance", 7), me(13)]),
  ...se("typing", { cooldown: 60 }, [Rn("reading", 1), me(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Rp).flatMap(([e, t]) => se(`reacted:${e}`, {}, [Rn(t, 1)])),
  ...Object.entries(So).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => se(`agent_reacted:${n}`, {}, [ne(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Eo).flatMap(([e, t]) => se(`agent_reacted:${e}`, {}, [ne(t, 1)])),
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
  ...se("held:search", { cooldown: Lp }, [Ln("search", 3), { ...Ln("binoculars", 2), when: { home: !0 } }, { ...Ln("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...se("unit", { cooldown: Bp.build.cooldown }, [de("unit", Tp.weight), me(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...se("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...se("carrier", {}, [de("ufo", 3), de("crane", 1)]),
  ...se("crane_from", {}, [de("left", 1), de("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...se("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: Ip.every }, de("stand", 5)]),
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
], Pp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Co = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), qp = (e) => Array.isArray(e) ? e[0] : e, Wp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Fp(e) {
  var u;
  const t = e.has ?? (() => !0), n = (h) => e.now - (e.memory.get(h) ?? -1 / 0), s = (h) => !e.memory || Co(h).every(([g, k]) => n(g) >= qp(k)), a = (h) => !h.shenanigan || h.lasts <= (e.room ?? 0), o = Ss.filter((h) => Pp(h.when, e) && (h.kind !== "clip" || t(h.name)) && s(h) && a(h)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Ep.after && o.some((h) => h.shenanigan) ? o.filter((h) => h.shenanigan) : o, c = i.filter((h) => {
    var g;
    return h.kind === "nothing" || h.name !== ((g = e.tally) == null ? void 0 : g.last);
  });
  return c.some((h) => h.kind !== "nothing") ? c : i;
}
function Hp(e, t) {
  const n = Fp(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Ao(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Ao(e, t, n) {
  var s;
  for (const [a, o] of Co(t)) (s = e.memory) == null || s.set(a, e.now + Wp(o, n));
}
function hy(e, t, n) {
  Ao(e, Ss.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const da = {
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
}, fy = {
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
}, py = 120, my = (e) => da[e] || da.idle;
[.../* @__PURE__ */ new Set([...Object.values(So).flatMap((e) => Object.keys(e)), ...Object.keys(Eo)])];
const Be = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function gy(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Be.ahead * n ? 180 : Math.sign(s) * Be.turn;
}
const ha = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function vy(e, t) {
  const n = Math.min(Be.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Be.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Be.lines, Math.floor((e.bottom - e.top - 2 * s) / Be.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Be.sweep) % a, i = o % Be.sweep, c = Be.sweep - Be.returnSeconds, u = ha((i - c) / Be.returnSeconds), h = i <= c ? ha(i / c) : 1 - u, g = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * h, y: e.top + s + g * Be.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Up = 1, Vp = (e, t, n, s, a, o = 0) => Hp({ moment: "jump", high: e > Up * t, memory: s, now: a, room: o }, n).name === "backflip", fa = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, yy = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, wy = { width: 24, height: 27, top: 3, units: 2 }, zp = "[data-figure-pile]", ky = { amber: [1, 0.69, 0.125], good: fa.colours.good, bad: fa.colours.bad }, Dn = { phases: 4, dim: 0.25 }, by = (e, t, n) => e !== "amber" || (t + n) % Dn.phases < Dn.phases / 2 ? 1 : Dn.dim, Gp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Ss.filter((e) => Gp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const $y = {
  width: 84,
  belly: 13,
  blink: 4
}, pa = "[data-figure-home]", Ft = () => {
  var t;
  const e = document.querySelector(pa);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(pa)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Kp = "[data-figure-docked-bars]", Yp = "[data-figure-chat-foot]", Jp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Zp = "[data-figure-newest]";
function Xp() {
  var s, a;
  const e = (s = Ft()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Zp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
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
function Oo(e, t, n = Xp()) {
  if (!e || !n) return !0;
  const s = kt(e, t), a = Cs(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = Et.gap;
  return !Io(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const Nn = 0.26, Qp = 0.54, $n = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Nn, travels: "stand" },
  lounge: { drop: Nn, travels: "stand" },
  composed: { drop: Nn, travels: "stand" },
  hang: { drop: Qp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, To = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), em = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), xy = (e, t) => (e === "sit" ? em.has(t) : To.has(e)) ? e : "stand", My = 0.25, _y = (e, t) => To.has(e) && $n[t].drop === 0, Bo = 2, tm = 90, nm = 180, sm = 140, am = 280, om = 420, rm = 0.25, im = 290, lm = 600, cm = "cubic-bezier(0.2, 0.7, 0.4, 1)", um = "cubic-bezier(0.55, 0, 0.9, 0.6)", jn = 5;
function hn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: h = 0, room: g = 0, pogo: k = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < jn) return null;
  (r || i) && (o = Math.max(o, Bo));
  const M = o > 1, P = Math.abs(t.x - e.x), L = P < jn ? 0 : P / (tm * o) * 1e3, w = Math.min(L, M ? sm : nm), E = Math.abs(t.y - e.y), W = t.y < e.y, V = W && !k && Vp(E, n, c, u, h, g), b = W ? om + Math.min(E, 400) * rm : Math.sqrt(2 * E / Mo) * 1e3, m = {
    x: t.x,
    y: t.y,
    ms: E > jn ? V ? lm : b : 0,
    lead: V ? im : W ? am : 0,
    easing: W ? cm : um,
    hopping: !0,
    clip: V ? "backflip" : W ? "jump" : "fall"
  }, R = { x: t.x, y: t.y, ms: L + w, lead: 0, easing: "linear", ramp: w, ...M ? { clip: "run" } : {} }, _ = k ? dm(t, n) : m, D = W && !s ? [{ ...R, y: e.y }, _] : [{ ...m, x: e.x }, R];
  return { way: Math.sign(t.x - e.x) || 1, legs: D, lands: !a, pace: o, running: M };
}
const dm = (e, t) => ({ x: e.x, y: e.y, ms: Xe.pogo.frames / Xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), kt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - $n[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Io = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Es = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function bt() {
  var t;
  const e = (t = Ft()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Jt = 0.5, ma = 20;
function Sy(e, t, n = bt()) {
  const s = kt(e, t);
  return s.left >= n.left + ma && s.right <= n.right - ma;
}
function Ro(e, t, n = bt()) {
  const s = kt(e, t), a = s.right - s.left, o = Cs(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Jt && i <= n.right + Jt && s.top >= n.top - Jt && c <= n.bottom + Jt;
}
const fn = [0.35, 0.5, 0.65], pn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: fn[0], right: fn.at(-1), top: pn[0], bottom: pn.at(-1) }, hm = 0.24;
function Cs(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + hm * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function fm(e, { size: t }, n = bt()) {
  const s = Cs(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const pm = (Je.right - Je.left) / 2 + 0.08;
function mm(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !Es(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const c of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[c].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, c), u.setEnd(o, c + 1), [...u.getClientRects()].some((h) => e >= h.left && e <= h.right && t >= h.top && t <= h.bottom)) return !0;
  }
  return !1;
}
const gm = (e) => pn.flatMap(
  (t) => fn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function vm(e, t, n = "") {
  if (!Oo(e, t)) return fn.length * pn.length;
  const s = kt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Jp)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && Io(a, c) && Es(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return gm(a).filter(([i, c]) => r(i, c) || mm(i, c, n)).length;
}
function ym(e, t, n) {
  const s = bt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Ro(r, t, s) && Oo(r, t)).map((r) => ({ spot: r, covered: vm(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Lo = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, wm = pm, km = (e, t, { size: n }, s = wm) => bm(e, Lo[t], s * n, "stand");
function bm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Ey = (e) => ((e + 180) % 360 + 360) % 360 - 180, Cy = { turns: [-20, -10, 0, 10, 20] }, $m = 7;
function xm() {
  const e = [...document.querySelectorAll(zp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const Mm = 4;
function _m() {
  const e = Do(), t = xm(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Mm || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - $m - n, 0) } };
}
const Ay = ({ size: e, below: t }) => (1 - t) * e;
function Sm(e, t) {
  const n = bt(), { size: s, below: a } = t, o = $n[e.posture].drop * s;
  return { ...fm(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Em = (e, t) => Object.keys(Lo).map((n) => Sm(km(e, n, t), t)), Cm = (e, t, n) => ym(e, t, n) ?? e[0];
function Oy(e, t) {
  const { element: n, edge: s } = _m();
  return { ...Cm(Em(s, e), e, t), view: null, on: n };
}
function Do() {
  var s;
  const e = Ft(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Kp);
  if (!t) return { ...No(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function No() {
  const e = Ft();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const Am = { climb: 90 };
function Ty(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: h = 0, room: g = 0, pogo: k = !1 } = {}) {
  (o || r) && (a = Math.max(a, Bo));
  const M = (V) => {
    const b = kt(V, n, $n[V.posture].travels);
    return { x: b.left, y: b.top };
  }, P = t.ladder ?? e.ladder;
  if (P && !(t.ladder && e.ladder)) return Om(M(e), M(t), M({ ...P.foot, posture: "stand" }), P.way, !!t.ladder, n, a);
  const [L, ...w] = [e, ...c, t].map(M), E = hn(L, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: h, room: g, pogo: k }), W = w.slice(1).map((V, b) => {
    var m;
    return (m = hn(w[b], V, n.size, { random: i, memory: u, now: h, room: g })) == null ? void 0 : m.legs.find((R) => R.hopping);
  });
  return E && { ...E, legs: [...E.legs, ...W.filter(Boolean)] };
}
function Om(e, t, n, s, a, o, r) {
  const i = (h, g) => ({ x: g.x, y: g.y, ms: Math.hypot(g.x - h.x, g.y - h.y) / Am.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? hn(e, n, o.size, { pace: r }) : hn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const Tm = "[data-figure-bubble]", Bm = 250;
let At = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), jo = 0;
const Po = () => At, Pn = /* @__PURE__ */ new WeakMap();
let Im = 0;
function qo(e) {
  return Pn.has(e) || Pn.set(e, `floor-${++Im}`), Pn.get(e);
}
const Rm = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Lm = () => {
  var e, t;
  return ((t = (e = Ft()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Dm(e, t) {
  var s;
  const n = (s = e.querySelector(Yp)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Nm(e, t) {
  const n = e && Dm(e, t), s = e ? [...e.querySelectorAll(Tm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Rm(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: qo(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const jm = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Bm ? (t.top - s.top) / a * 1e3 : 0;
};
function Pm(e = At, t = performance.now()) {
  const n = bt(), s = Lm(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = Do(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = No();
  return u.element && c.push({ id: qo(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...Nm(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((h) => Object.freeze({ ...h, vy: jm(e, h, t) }))) });
}
const us = /* @__PURE__ */ new Set();
function qm(e) {
  return us.add(e), () => us.delete(e);
}
function Wm() {
  Wo();
  const e = () => {
    jo = requestAnimationFrame(e), !document.hidden && (At = Pm(At), us.forEach((t) => t(At)));
  };
  e();
}
function Wo() {
  cancelAnimationFrame(jo);
}
const Fm = (e, t) => e.find((n) => n.id === t) ?? null;
function By(e, t, n = Po().floors) {
  const s = Fm(n, "home");
  return e.posture === "hang" && s && kt(e, t).bottom >= s.top ? !1 : Ro(e, t);
}
const Hm = ["data-kind"], Um = { class: "figure-floor-name" }, Vm = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", Um, y(e.floor.kind), 1)
    ], 12, Hm));
  }
}, zm = /* @__PURE__ */ Y(Vm, [["__scopeId", "data-v-8f6132da"]]), Gm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Km = {
  __name: "FigureFloors",
  setup(e) {
    const t = mn(Po().floors);
    let n = () => {
    };
    return De(() => {
      n = qm((s) => t.value = s.floors), Wm();
    }), Ae(() => {
      n(), Wo();
    }), (s, a) => (l(), d("div", Gm, [
      (l(!0), d(Z, null, re(t.value, (o) => (l(), G(zm, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Iy = /* @__PURE__ */ Y(Km, [["__scopeId", "data-v-e519168b"]]), qn = (e) => typeof e == "number" ? e : Date.parse(e);
function Ry(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: qn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => qn(a.row.created_at) - qn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Ym = 3, Wn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Jm(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Wn[n.grouping]) == null ? void 0 : s.call(Wn, e.row, n)) || "";
}
function Zm(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Ly(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Ym ? [Zm(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = Jm(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Xm = 1e3;
function Dy() {
  const e = N(Date.now()), t = setInterval(() => e.value = Date.now(), Xm);
  return yt(() => clearInterval(t)), e;
}
function Ny(e) {
  const t = vs(), n = N(null), s = N("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const Qm = {
  class: "cards-page",
  "data-window-flush": ""
}, eg = { class: "cards-bar" }, tg = { class: "cards-count" }, ng = { class: "cards" }, sg = {
  key: 1,
  class: "cards-note"
}, ag = {
  key: 2,
  class: "cards-note"
}, og = ["data-row", "onClick"], rg = { class: "card-head" }, ig = { class: "card-age" }, lg = { class: "card-title" }, cg = { class: "card-foot" }, ug = {
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
    return (s, a) => (l(), d("div", Qm, [
      p("div", eg, [
        p("span", tg, y(e.rows.length) + " " + y(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        H(ve, rt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: U(() => [
            H(ke, {
              name: "plus",
              size: 12
            }),
            he(" New " + y(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", ng, [
        e.loaded ? e.failure ? (l(), d("p", sg, y(e.failure), 1)) : e.rows.length ? B("", !0) : (l(), d("p", ag, "No " + y(e.noun) + "s yet", 1)) : (l(), G(wt, {
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
          p("span", rg, [
            H(ke, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            he(" " + y(e.head(o)), 1),
            p("span", ig, y(z(Jn)(o.created_at)), 1)
          ]),
          p("span", lg, y(e.title(o)), 1),
          p("span", cg, y(e.foot(o)), 1)
        ], 8, og))), 128))
      ]),
      we(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, jy = /* @__PURE__ */ Y(ug, [["__scopeId", "data-v-d72d528d"]]), ga = "newest";
function Py(e, { title: t, isOpen: n = null }) {
  const s = N(""), a = N(ga), o = N("all"), r = O(() => {
    const i = s.value.trim().toLowerCase(), c = e.value.filter((u) => (!i || JSON.stringify(u).toLowerCase().includes(i)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === ga ? c : [...c].sort((u, h) => t(u).localeCompare(t(h)));
  });
  return { words: s, order: a, state: o, shown: r, hasStates: !!n };
}
const dg = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, hg = 40, fg = "top", pg = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var g;
    const n = e, s = (g = Ce(Ne, null)) == null ? void 0 : g.autoScroll, a = O(() => s === fg), o = N(null), r = N(!1), i = (k) => a.value ? k.scrollTop : k.scrollHeight - k.scrollTop - k.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function h() {
      r.value = i(o.value) >= hg;
    }
    return be(() => n.rowCount, async () => {
      await Dt(), !r.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (k, M) => (l(), d("div", dg, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: ee(["auto-scroll-pane", e.paneClass]),
        onScroll: h
      }, [
        we(k.$slots, "default", {}, void 0, !0)
      ], 34),
      H(Lt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: U(() => [
          it(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            H(ke, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            M[0] || (M[0] = he(" Newest ", -1))
          ], 512), [
            [ar, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, qy = /* @__PURE__ */ Y(pg, [["__scopeId", "data-v-3accb764"]]), mg = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, gg = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Ce(Ne, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (l(), d("div", mg, [
      (l(!0), d(Z, null, re(z(s), (i) => {
        var c;
        return l(), G(ve, {
          key: i.key,
          kind: "text",
          class: ee(["inner-tab", { on: ((c = e.active) == null ? void 0 : c.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: U(() => [
            he(y(i.label) + " " + y(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, Wy = /* @__PURE__ */ Y(gg, [["__scopeId", "data-v-cf3bb39f"]]), vg = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, yg = {
  key: 1,
  class: "menu-item-text"
}, wg = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), d("span", vg, y(e.checked ? "✓" : ""), 1)) : B("", !0),
      e.description ? (l(), d("span", yg, [
        p("span", null, [
          we(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, y(e.description), 1)
      ])) : we(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ds = /* @__PURE__ */ Y(wg, [["__scopeId", "data-v-c91b190e"]]), kg = {}, bg = { class: "menu-label" };
function $g(e, t) {
  return l(), d("span", bg, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const hs = /* @__PURE__ */ Y(kg, [["render", $g], ["__scopeId", "data-v-aa955b3e"]]), Fo = /* @__PURE__ */ new WeakMap(), xg = (e, t) => Fo.set(e, t);
function Mg(e, t) {
  for (let n = t; n; n = Fo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function _g(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Mg(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const ft = 8, Sg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = N(null), o = (f) => f ? `${f}px` : void 0, r = O(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = N({ w: 0, h: 0 }), c = N(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), h = (f) => ({
      left: Math.max(0, f.left),
      top: Math.max(0, f.top),
      right: Math.min(window.innerWidth, f.right),
      bottom: Math.min(window.innerHeight, f.bottom)
    }), g = (f) => {
      const C = f.closest(".pane, .float-window");
      return C ? h(C.getBoundingClientRect()) : u();
    }, k = (f, C) => `${Math.max(0, f ? Math.min(f, C) : C)}px`;
    function M(f, C) {
      return {
        below: f.bottom - C.bottom - s.gap - ft,
        above: C.top - f.top - s.gap - ft,
        across: f.right - f.left - 2 * ft
      };
    }
    function P(f) {
      const C = g(s.anchor), A = M(C, f);
      return i.value.w <= A.across && i.value.h <= Math.max(A.below, A.above) ? C : u();
    }
    const L = O(() => {
      if (!c.value) return r.value;
      const f = c.value, C = P(f), A = M(C, f), { w: q, h: ie } = i.value, le = s.align === "auto" ? f.left + f.right > C.left + C.right : s.align === "right", te = _i(le ? f.right - q : f.left, C.left + ft, Math.max(C.left + ft, C.right - q - ft)), Q = ie > A.below && A.above > A.below ? { bottom: `${window.innerHeight - f.top + s.gap}px`, maxHeight: k(s.maxHeight, A.above) } : { top: `${f.bottom + s.gap}px`, maxHeight: k(s.maxHeight, A.below) };
      return { ...r.value, ...Q, left: `${te}px`, maxWidth: k(s.maxWidth, A.across) };
    }), w = n, E = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function W(f) {
      const C = E(), A = C.indexOf(document.activeElement);
      C[(A + f + C.length) % C.length].focus();
    }
    const V = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => w("close") }, b = (f) => V[f.key] && (f.preventDefault(), V[f.key]()), m = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let R = 0;
    const _ = new ResizeObserver(() => {
      cancelAnimationFrame(R), R = requestAnimationFrame(m);
    });
    _g(a, (f) => s.anchor && !s.anchor.contains(f.target) && w("close"));
    const D = (f, C) => ["top", "left", "right", "bottom"].some((A) => Math.abs(f[A] - C[A]) > 1), $ = (f) => f.bottom < 0 || f.top > window.innerHeight;
    let S = 0;
    function v() {
      if (s.anchor) {
        const f = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || $(f)) return w("close");
        D(f, c.value) && (c.value = f);
      }
      S = requestAnimationFrame(v);
    }
    return De(() => {
      s.anchor && a.value && xg(a.value, s.anchor), m(), a.value && _.observe(a.value), !s.plain && E()[0] && E()[0].focus(), v();
    }), Ae(() => {
      _.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(R);
    }), t({ element: a }), (f, C) => (l(), G(ba, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", rt({
        ref_key: "panel",
        ref: a
      }, f.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: L.value,
        onKeydown: b
      }), [
        we(f.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ho = /* @__PURE__ */ Y(Sg, [["__scopeId", "data-v-3d203970"]]), Eg = {
  class: "search-bar",
  "data-search-bar": ""
}, Cg = { class: "search-bar-control" }, Ag = ["value", "placeholder", "aria-label"], Og = ["aria-expanded"], Tg = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: n }) {
    const s = n, a = or(), o = N(null), r = N(null), i = (u) => r.value = r.value ? null : u.currentTarget;
    function c() {
      var u;
      s("update:modelValue", ""), (u = o.value) == null || u.focus();
    }
    return t({ focus: () => {
      var u;
      return (u = o.value) == null ? void 0 : u.focus();
    } }), (u, h) => (l(), d("div", Eg, [
      p("div", Cg, [
        H(ke, {
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
          onInput: h[0] || (h[0] = (g) => s("update:modelValue", g.target.value)),
          onKeydown: Ot(c, ["esc"])
        }, null, 40, Ag),
        e.modelValue ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-clear",
          "data-search-clear": "",
          "aria-label": "Clear the search",
          onClick: c
        }, [
          H(ke, {
            name: "close",
            size: 12
          })
        ])) : B("", !0),
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
          H(ke, {
            name: "caret",
            size: 12
          })
        ], 8, Og)) : B("", !0)
      ]),
      we(u.$slots, "default", {}, void 0, !0),
      r.value ? (l(), G(Ho, {
        key: 0,
        anchor: r.value,
        align: "end",
        "min-width": 220,
        "max-width": 320,
        onClick: h[1] || (h[1] = Me(() => {
        }, ["stop"])),
        onClose: h[2] || (h[2] = (g) => r.value = null)
      }, {
        default: U(() => [
          we(u.$slots, "menu", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : B("", !0)
    ]));
  }
}, Bg = /* @__PURE__ */ Y(Tg, [["__scopeId", "data-v-c2f6060d"]]), Ig = {
  class: "list-tools",
  "data-list-tools": ""
}, Rg = {
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
    return (s, a) => (l(), d("div", Ig, [
      H(Bg, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, {
        menu: U(() => [
          H(hs, null, {
            default: U(() => [...a[1] || (a[1] = [
              he("Order", -1)
            ])]),
            _: 1
          }),
          (l(), d(Z, null, re(t, (o) => H(ds, {
            key: o.key,
            checked: e.tools.order.value === o.key,
            "data-list-order": o.key,
            onClick: (r) => e.tools.order.value = o.key
          }, {
            default: U(() => [
              he(y(o.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (l(), d(Z, { key: 0 }, [
            H(hs, null, {
              default: U(() => [...a[2] || (a[2] = [
                he("Show", -1)
              ])]),
              _: 1
            }),
            (l(), d(Z, null, re(n, (o) => H(ds, {
              key: o.key,
              checked: e.tools.state.value === o.key,
              "data-list-state": o.key,
              onClick: (r) => e.tools.state.value = o.key
            }, {
              default: U(() => [
                he(y(o.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : B("", !0)
        ]),
        default: U(() => [
          we(s.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, Fy = /* @__PURE__ */ Y(Rg, [["__scopeId", "data-v-9a3cea5b"]]);
function Hy() {
  const e = N(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Lg = 86400, fs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Dg(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((fs(t) - fs(e)) / Lg);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function Uy(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = fs(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Dg(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Fn = 280, Hn = 240, Un = 120, Ng = 6, jg = 14, Rt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Pg(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${jg}px)` }), e.offsetHeight, e.style.transition = `height ${Fn}ms ${Rt}`, e.style.height = `${r}px`;
  const i = a();
  let c = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const h = a() - i;
    if (!c && h >= Fn && (c = !0, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${Rt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), h < Fn + Hn) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function Vy(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Ng}px)` }), e.offsetHeight, e.style.transition = `opacity ${Un}ms ease-out, transform ${Un}ms ${Rt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - r < Un) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const qg = 140, Zt = 220, Wg = 5;
function zy({ gap: e = qg, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, Wg);
    if (s = i.length > 0, !s) return;
    let c = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), c -= 1, c || t(o, e);
      });
  }
  const r = (i, c, u, h = Pg) => {
    if (!c.pane || !c.follows()) return u();
    const g = { el: i, options: c, done: u, arrival: h, display: i.style.display || "" };
    if (!s)
      return s = !0, h(i, c, () => a(g));
    i.style.display = "none", n.push(g);
  };
  return r.flush = () => {
    for (const i of n.splice(0))
      i.el.style.display = i.display, i.done();
  }, r;
}
function Gy(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Zt}ms ${Rt}, opacity ${Zt}ms ease-in, margin ${Zt}ms ${Rt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Zt);
}
const Uo = "chat.pins.minimised", tn = N(Tt(Uo, !1));
function va(e) {
  tn.value = e, gn(Uo, e);
}
function Fg(e) {
  const t = O(() => e()), n = O(() => tn.value ? [] : e()), s = () => va(!tn.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => Ia(o) > a).length,
    (o, r) => o > r && va(!1)
  ), { pins: t, visible: n, minimised: tn, toggle: s };
}
const Hg = ["title"], Ug = {
  key: 0,
  class: "pins-count"
}, Vg = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Fg(() => t.notices);
    return (o, r) => z(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: ee(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = Me((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      H(ke, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (l(), d("span", Ug, y(z(n).length), 1)) : B("", !0)
    ], 10, Hg)) : B("", !0);
  }
}, Ky = /* @__PURE__ */ Y(Vg, [["__scopeId", "data-v-c0d11526"]]), zg = ["title"], Gg = ["title"], Kg = { class: "diff-card-dir" }, Yg = { class: "diff-card-name" }, Jg = { class: "diff-card-ago" }, Zg = ["title"], Xg = ["title"], Qg = {
  key: 0,
  class: "diff-card-note"
}, e0 = ["href"], t0 = ["src", "alt"], n0 = { class: "diff-card-rows" }, s0 = { class: "diff-row-num" }, a0 = { class: "diff-row-sign" }, o0 = { class: "diff-row-code" }, r0 = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = O(() => n.path.lastIndexOf("/") + 1), u = O(() => n.path.slice(0, c.value)), h = O(() => n.path.slice(c.value)), g = O(() => n.kind === "deleted"), k = O(() => r[n.kind]), M = O(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), P = N("after"), L = O(() => P.value === "before" ? n.whole.old : n.whole.text), w = O(() => n.whole && n.whole.text !== void 0 ? L.value.split(`
`).map((S, v) => ({ line_type: P.value === "after" && M.value.has(v + 1) ? "add" : "ctx", line: v + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), E = N(!1), W = O(() => n.lines && !E.value && !n.whole), V = O(() => W.value ? w.value.slice(0, n.lines) : w.value), b = O(() => w.value.length - V.value.length), m = (S) => S.line === null || S.line_type === "del" ? "" : S.line, R = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, _ = N(null), D = N(null);
    let $ = null;
    return De(() => {
      if (!D.value) return;
      let S = !0;
      $ = new ResizeObserver(() => {
        !_.value || !D.value || (_.value.style.transition = S ? "none" : "", _.value.style.height = `${D.value.offsetHeight}px`, S = !1);
      }), $.observe(D.value);
    }), Ae(() => $ && $.disconnect()), (S, v) => (l(), d("section", {
      class: ee(["diff-card", { half: e.half, gone: g.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: g.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: v[2] || (v[2] = (f) => !g.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${z(a)}-click to open it`,
          onClick: o
        }, [
          p("span", Kg, y(u.value), 1),
          p("span", Yg, y(h.value), 1),
          k.value ? (l(), d("span", {
            key: 0,
            class: ee(["diff-card-badge", e.kind])
          }, y(k.value), 3)) : B("", !0)
        ], 8, Gg),
        p("span", {
          class: ee(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + y(e.added), 3),
        p("span", {
          class: ee(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + y(e.removed), 3),
        p("span", Jg, y(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: P.value === "after" ? "Show the file before" : "Show the file after",
          onClick: v[0] || (v[0] = Me((f) => P.value = P.value === "after" ? "before" : "after", ["stop"]))
        }, y(P.value === "after" ? "After" : "Before"), 9, Zg)) : B("", !0),
        g.value ? B("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: ee(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: v[1] || (v[1] = Me((f) => s("whole"), ["stop"]))
        }, [
          H(ke, {
            name: "file",
            size: 12
          })
        ], 10, Xg))
      ], 8, zg),
      e.whole && e.whole.error ? (l(), d("p", Qg, y(e.whole.error), 1)) : B("", !0),
      !g.value && !e.folded ? (l(), d(Z, { key: 1 }, [
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
          }, null, 8, t0)
        ], 8, e0)) : (l(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: _,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: D,
            class: "diff-card-diff"
          }, [
            p("div", n0, [
              (l(!0), d(Z, null, re(V.value, (f, C) => (l(), d("div", {
                key: C,
                class: ee(["diff-row", f.line_type, { fresh: e.fresh && f.edit === e.fresh }])
              }, [
                p("span", s0, y(m(f)), 1),
                p("span", a0, y(i[f.line_type]), 1),
                p("span", o0, y(R(f)), 1)
              ], 2))), 128)),
              b.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: v[3] || (v[3] = Me((f) => E.value = !0, ["stop"]))
              }, y(b.value) + " more " + y(b.value === 1 ? "line" : "lines"), 1)) : B("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : B("", !0)
    ], 2));
  }
}, Yy = /* @__PURE__ */ Y(r0, [["__scopeId", "data-v-b6424f6e"]]), i0 = {
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
      default: U(() => [
        H(ke, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, l0 = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [{ word: "approve", label: "Approve", main: !0 }, He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, c0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, u0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], d0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], h0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], f0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], p0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], m0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? p0(t) : e === "agent" ? [...h0(t), ...d0(t)] : e === "check" ? f0(t) : e === "question" ? u0(t) : ((n = { plan: l0, task: c0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, g0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, v0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, y0 = { class: "ask-text" }, w0 = ["placeholder", "aria-label"], k0 = ["placeholder", "aria-label"], b0 = {
  key: 3,
  class: "moves"
}, $0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = O(() => m0(s.kind, s.row)), r = N(""), i = N(null), c = N(""), u = N("");
    be(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function h(M, P = "") {
      const L = await s.read([M.noun ?? s.kind, M.word, String(s.id), ...M.flag ? [M.flag, P] : M.positional ? [P] : [], ...M.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = L.ok ? "" : L.error, L.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const g = (M) => M.confirm ? i.value = M : M.said ? h(M, M.said) : M.flag || M.positional ? (i.value = M, c.value = "") : h(M), k = () => c.value.trim() && h(i.value, c.value.trim());
    return t({ moves: o, press: g }), (M, P) => {
      var L;
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: ee(["foot", { inline: e.inline }])
      }, [
        r.value ? (l(), d("p", g0, y(r.value), 1)) : B("", !0),
        (L = i.value) != null && L.confirm ? (l(), d("div", v0, [
          p("span", y0, y(i.value.confirm), 1),
          H(ve, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: P[0] || (P[0] = (w) => h(i.value))
          }, {
            default: U(() => [
              he(y(i.value.label), 1)
            ]),
            _: 1
          }),
          H(ve, {
            small: "",
            kind: "ghost",
            onClick: P[1] || (P[1] = (w) => i.value = null)
          }, {
            default: U(() => [...P[7] || (P[7] = [
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
          }, null, 40, w0), [
            [Kn, c.value]
          ]),
          i.value.opener ? it((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": P[4] || (P[4] = (w) => u.value = w),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: P[5] || (P[5] = Ot(Me((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, k0)), [
            [Kn, u.value]
          ]) : B("", !0),
          H(ve, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: U(() => [
              he(y(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          H(ve, {
            small: "",
            kind: "ghost",
            onClick: P[6] || (P[6] = (w) => i.value = null)
          }, {
            default: U(() => [...P[8] || (P[8] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", b0, [
          (l(!0), d(Z, null, re(o.value, (w) => (l(), G(ve, {
            key: w.word,
            small: "",
            kind: w.main ? "primary" : "ghost",
            "data-move": w.word,
            onClick: (E) => g(w)
          }, {
            default: U(() => [
              he(y(w.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : B("", !0);
    };
  }
}, x0 = /* @__PURE__ */ Y($0, [["__scopeId", "data-v-fffa0bf6"]]), M0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, _0 = { ...M0, done: "Completed" }, S0 = { class: "task-status-icon" }, E0 = ["width", "height", "aria-label"], C0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", S0, [
      H(Lt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: U(() => [
          (l(), d("svg", {
            key: e.status,
            class: ee(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": z(_0)[e.status]
          }, [
            H(gs, { value: e.status }, {
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
          ], 10, E0))
        ]),
        _: 1
      })
    ]));
  }
}, Vo = /* @__PURE__ */ Y(C0, [["__scopeId", "data-v-2ab7e404"]]), A0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), O0 = (e) => A0.has(e), zo = (e) => O0(e) ? "done" : e, T0 = { class: "facts" }, B0 = { class: "fact wide" }, I0 = { class: "fact-value" }, R0 = {
  key: 0,
  class: "fact"
}, L0 = { class: "fact-value" }, D0 = {
  key: 1,
  class: "fact"
}, N0 = { class: "fact-value" }, j0 = { class: "fact wide" }, P0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, q0 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = cn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return l(), d("div", T0, [
        p("div", B0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", I0, y((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", R0, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", L0, y(e.place.phase_number) + " of " + y(e.place.phase_total) + ": " + y(e.place.phase_title), 1)
        ])) : B("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", D0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", N0, "Agent " + y(e.task.holder_id), 1)
        ])) : B("", !0),
        p("div", j0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          H(Nh, {
            options: z(n),
            value: String(z(uo)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", P0, y(e.refusal), 1)) : B("", !0)
        ])
      ]);
    };
  }
}, W0 = /* @__PURE__ */ Y(q0, [["__scopeId", "data-v-2018762d"]]), F0 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, H0 = ["onClick"], U0 = { class: "wait-id" }, V0 = { class: "wait-title" }, z0 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, G0 = { class: "text" }, K0 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, Y0 = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, J0 = 180, Z0 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = N(!1);
    return (a, o) => (l(), d(Z, null, [
      e.task.waits.length ? (l(), d("section", F0, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (l(!0), d(Z, null, re(e.task.waits, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          H(Vo, {
            status: z(zo)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", U0, y(r.id), 1),
          p("span", V0, y(r.title), 1)
        ], 8, H0))), 128))
      ])) : B("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", z0, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", G0, y(e.task.outcome), 1)
      ])) : B("", !0),
      e.task.brief ? (l(), d("section", K0, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: ee(["text", { clamped: !s.value }])
        }, y(e.task.brief), 3),
        e.task.brief.length > J0 && !s.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : B("", !0)
      ])) : B("", !0),
      e.task.logs.length ? (l(), d("section", Y0, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(Z, null, re(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, y(r.line), 1))), 128))
      ])) : B("", !0)
    ], 64));
  }
}, X0 = /* @__PURE__ */ Y(Z0, [["__scopeId", "data-v-f411ce35"]]), Q0 = { class: "comment-side-head" }, ev = {
  key: 0,
  class: "comment-none"
}, tv = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), d("aside", {
      class: ee(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", Q0, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        H(ys, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? B("", !0) : (l(), d("p", ev, "No comments yet")),
      (l(!0), d(Z, null, re(e.comments, (s) => (l(), d("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, y(e.words(s)), 1))), 128))
    ], 2));
  }
}, nv = /* @__PURE__ */ Y(tv, [["__scopeId", "data-v-19fdbdd4"]]), sv = ["data-comments-below"], av = 600, ov = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = N(null), n = N(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < av);
    return De(() => s.observe(t.value)), yt(() => s.disconnect()), (a, o) => (l(), d("div", {
      ref_key: "root",
      ref: t,
      class: ee(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      we(a.$slots, "default"),
      e.open ? (l(), G(nv, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : B("", !0)
    ], 10, sv));
  }
}, rv = /* @__PURE__ */ Y(ov, [["__scopeId", "data-v-6c850df0"]]), iv = ["placeholder"], lv = { class: "actions" }, cv = { class: "error" }, uv = {
  key: 1,
  class: "card closed"
}, dv = { class: "mark" }, hv = { class: "prompt" }, fv = {
  key: 0,
  class: "draft"
}, pv = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Gn({
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
  emits: /* @__PURE__ */ Gn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = zn(e, "draft"), r = zn(e, "error"), i = N(!!r.value), c = N(!1), u = N(!1), h = N(null);
    async function g() {
      var L, w;
      i.value = !0, c.value = !1, await Dt(), (w = ((L = h.value) == null ? void 0 : L.querySelector("input")) || h.value) == null || w.focus();
    }
    function k() {
      i.value = !1, r.value = "";
    }
    function M(L) {
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
    return t({ expand: g }), (L, w) => (l(), d("div", {
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
          "onUpdate:modelValue": w[0] || (w[0] = (E) => o.value = E),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Ot(M, ["enter"])
        }, null, 40, iv), [
          [Kn, o.value]
        ]),
        p("div", lv, [
          p("span", cv, y(r.value), 1),
          H(ve, {
            small: "",
            onClick: k
          }, {
            default: U(() => [...w[2] || (w[2] = [
              he("Cancel", -1)
            ])]),
            _: 1
          }),
          H(ve, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: P
          }, {
            default: U(() => [...w[3] || (w[3] = [
              he("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (l(), d("div", uv, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: g
        }, [
          p("span", dv, [
            H(ke, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", hv, y(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", fv, "Draft kept")) : B("", !0)
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = (E) => a("show"))
        }, [
          p("span", null, y(z(Si)(e.count, "comment")), 1),
          H(ke, {
            name: "down",
            size: 12
          })
        ])) : B("", !0)
      ]))
    ], 2));
  }
}, mv = /* @__PURE__ */ Y(pv, [["__scopeId", "data-v-79db0c2d"]]);
function gv(e, t) {
  const n = N([]), s = N(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: h, id: g, title: k } = e(), M = `On ${h} ${g}, ${k}: `;
    return u.text.startsWith(M) ? u.text.slice(M.length) : u.text;
  };
  async function i() {
    const { kind: u, id: h } = e();
    if (!h) return;
    const g = ++o, k = await t([u, "comments", String(h)]);
    g === o && (n.value = k.ok ? k.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: h, id: g } = e(), k = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, k], s.value = !0;
    const M = await t([h, "comment", String(g), u]);
    if (!M.ok)
      throw n.value = n.value.filter((P) => P !== k && P.id !== k.id), new Error(M.error);
    await i();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: c, load: i };
}
const vv = { class: "top" }, yv = {
  class: "crumb",
  "data-task-crumb": ""
}, wv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, kv = {
  key: 1,
  class: "body"
}, bv = { class: "stamp" }, $v = {
  class: "title",
  "data-resource-title": ""
}, xv = { class: "since" }, Mv = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, _v = { class: "text" }, Sv = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Ev = {
  key: 1,
  class: "note"
}, Cv = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Av = { class: "text" }, Ov = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = N(null), r = N(null), i = N(""), c = N(""), u = N(null), h = N(null), g = gv(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (b) => s.read(b));
    be(g.open, (b) => a("comments", b));
    let k = 0;
    const M = zo, P = (b) => b.slice(0, 1).toUpperCase() + b.slice(1), L = O(() => {
      var b;
      return (b = r.value) != null && b.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function w() {
      const b = ++k, [m, R] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      b === k && (i.value = m.ok ? "" : m.error, o.value = m.ok ? m.value : null, r.value = R.ok ? R.value : null);
    }
    be(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, w();
    }, { immediate: !0 }), be(() => s.changes, w);
    async function E(b) {
      const m = o.value.priority;
      o.value.priority = Number(b);
      const R = await s.read(["task", "edit", String(s.id), "--priority", b]);
      if (c.value = R.ok ? "" : R.error, R.ok) return w();
      o.value.priority = m;
    }
    function W(b) {
      u.value = null, h.value.press(b);
    }
    const V = (b) => {
      var m;
      return ((m = h.value) == null ? void 0 : m.moves.length) && (u.value = b);
    };
    return t({ openStatus: V }), (b, m) => (l(), d("aside", {
      class: ee(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", vv, [
        e.backed ? (l(), G(i0, {
          key: 0,
          onBack: m[0] || (m[0] = (R) => a("back"))
        })) : B("", !0),
        p("span", yv, y(L.value), 1),
        m[9] || (m[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(Z, { key: 1 }, [
          H(ve, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: m[1] || (m[1] = (R) => a("step", -1))
          }, {
            default: U(() => [
              H(ke, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          H(ve, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: m[2] || (m[2] = (R) => a("step", 1))
          }, {
            default: U(() => [
              H(ke, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : B("", !0),
        H(ve, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: m[3] || (m[3] = (R) => a("close"))
        }, {
          default: U(() => [
            H(ke, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (l(), d("p", wv, y(i.value), 1)) : o.value ? (l(), d(Z, { key: 2 }, [
        H(rv, {
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
                p("div", bv, "Task " + y(o.value.id) + " · updated " + y(z(Jn)(z(on)(o.value)) || "just now"), 1),
                p("h3", $v, y(o.value.title), 1),
                p("div", {
                  class: ee(["state-line", z(M)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: m[4] || (m[4] = (_) => V(_.currentTarget))
                  }, [
                    H(Vo, {
                      status: z(M)(o.value.state)
                    }, null, 8, ["status"]),
                    he(" " + y(P(o.value.state)), 1)
                  ]),
                  p("span", xv, "since " + y(z(Jn)(z(on)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", Mv, [
                  m[10] || (m[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", _v, y(o.value.reason || "Other tasks"), 1),
                  (R = o.value.openers) != null && R.length ? (l(), d("p", Sv, "Opens by itself when " + y(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", Ev, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", Cv, [
                  m[11] || (m[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", Av, y(o.value.reason), 1)
                ])) : B("", !0),
                H(W0, {
                  task: o.value,
                  place: r.value,
                  refusal: c.value,
                  onPriority: E
                }, null, 8, ["task", "place", "refusal"]),
                H(X0, {
                  task: o.value,
                  onSelect: m[5] || (m[5] = (_) => a("select", _))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        H(mv, {
          send: z(g).send,
          count: z(g).comments.value.length,
          onShow: m[7] || (m[7] = (R) => z(g).open.value = !z(g).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", kv, [
        H(wt)
      ])),
      H(x0, {
        ref_key: "footer",
        ref: h,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: w
      }, null, 8, ["id", "row", "read"]),
      u.value ? (l(), G(Ho, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: m[8] || (m[8] = (R) => u.value = null)
      }, {
        default: U(() => [
          H(hs, null, {
            default: U(() => [
              he("Change the status of task " + y(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(Z, null, re(h.value.moves, (R) => (l(), G(ds, {
            key: R.word,
            onClick: (_) => W(R)
          }, {
            default: U(() => [
              he(y(R.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : B("", !0)
    ], 2));
  }
}, Jy = /* @__PURE__ */ Y(Ov, [["__scopeId", "data-v-c76befc4"]]);
function Tv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Vn = { exports: {} }, ya;
function Bv() {
  return ya || (ya = 1, (function(e, t) {
    var n = (function() {
      var s = function(m, R) {
        var _ = 236, D = 17, $ = m, S = o[R], v = null, f = 0, C = null, A = [], q = {}, ie = function(T, I) {
          f = $ * 4 + 17, v = (function(x) {
            for (var j = new Array(x), F = 0; F < x; F += 1) {
              j[F] = new Array(x);
              for (var X = 0; X < x; X += 1)
                j[F][X] = null;
            }
            return j;
          })(f), le(0, 0), le(f - 7, 0), le(0, f - 7), Q(), J(), qe(T, I), $ >= 7 && Se(T), C == null && (C = Go($, S, A)), We(C, I);
        }, le = function(T, I) {
          for (var x = -1; x <= 7; x += 1)
            if (!(T + x <= -1 || f <= T + x))
              for (var j = -1; j <= 7; j += 1)
                I + j <= -1 || f <= I + j || (0 <= x && x <= 6 && (j == 0 || j == 6) || 0 <= j && j <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= j && j <= 4 ? v[T + x][I + j] = !0 : v[T + x][I + j] = !1);
        }, te = function() {
          for (var T = 0, I = 0, x = 0; x < 8; x += 1) {
            ie(!0, x);
            var j = i.getLostPoint(q);
            (x == 0 || T > j) && (T = j, I = x);
          }
          return I;
        }, J = function() {
          for (var T = 8; T < f - 8; T += 1)
            v[T][6] == null && (v[T][6] = T % 2 == 0);
          for (var I = 8; I < f - 8; I += 1)
            v[6][I] == null && (v[6][I] = I % 2 == 0);
        }, Q = function() {
          for (var T = i.getPatternPosition($), I = 0; I < T.length; I += 1)
            for (var x = 0; x < T.length; x += 1) {
              var j = T[I], F = T[x];
              if (v[j][F] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    X == -2 || X == 2 || oe == -2 || oe == 2 || X == 0 && oe == 0 ? v[j + X][F + oe] = !0 : v[j + X][F + oe] = !1;
            }
        }, Se = function(T) {
          for (var I = i.getBCHTypeNumber($), x = 0; x < 18; x += 1) {
            var j = !T && (I >> x & 1) == 1;
            v[Math.floor(x / 3)][x % 3 + f - 8 - 3] = j;
          }
          for (var x = 0; x < 18; x += 1) {
            var j = !T && (I >> x & 1) == 1;
            v[x % 3 + f - 8 - 3][Math.floor(x / 3)] = j;
          }
        }, qe = function(T, I) {
          for (var x = S << 3 | I, j = i.getBCHTypeInfo(x), F = 0; F < 15; F += 1) {
            var X = !T && (j >> F & 1) == 1;
            F < 6 ? v[F][8] = X : F < 8 ? v[F + 1][8] = X : v[f - 15 + F][8] = X;
          }
          for (var F = 0; F < 15; F += 1) {
            var X = !T && (j >> F & 1) == 1;
            F < 8 ? v[8][f - F - 1] = X : F < 9 ? v[8][15 - F - 1 + 1] = X : v[8][15 - F - 1] = X;
          }
          v[f - 8][8] = !T;
        }, We = function(T, I) {
          for (var x = -1, j = f - 1, F = 7, X = 0, oe = i.getMaskFunction(I), ae = f - 1; ae > 0; ae -= 2)
            for (ae == 6 && (ae -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (v[j][ae - ge] == null) {
                  var xe = !1;
                  X < T.length && (xe = (T[X] >>> F & 1) == 1);
                  var ce = oe(j, ae - ge);
                  ce && (xe = !xe), v[j][ae - ge] = xe, F -= 1, F == -1 && (X += 1, F = 7);
                }
              if (j += x, j < 0 || f <= j) {
                j -= x, x = -x;
                break;
              }
            }
        }, ut = function(T, I) {
          for (var x = 0, j = 0, F = 0, X = new Array(I.length), oe = new Array(I.length), ae = 0; ae < I.length; ae += 1) {
            var ge = I[ae].dataCount, xe = I[ae].totalCount - ge;
            j = Math.max(j, ge), F = Math.max(F, xe), X[ae] = new Array(ge);
            for (var ce = 0; ce < X[ae].length; ce += 1)
              X[ae][ce] = 255 & T.getBuffer()[ce + x];
            x += ge;
            var Oe = i.getErrorCorrectPolynomial(xe), Te = u(X[ae], Oe.getLength() - 1), As = Te.mod(Oe);
            oe[ae] = new Array(Oe.getLength() - 1);
            for (var ce = 0; ce < oe[ae].length; ce += 1) {
              var Os = ce + As.getLength() - oe[ae].length;
              oe[ae][ce] = Os >= 0 ? As.getAt(Os) : 0;
            }
          }
          for (var Ts = 0, ce = 0; ce < I.length; ce += 1)
            Ts += I[ce].totalCount;
          for (var xn = new Array(Ts), Ht = 0, ce = 0; ce < j; ce += 1)
            for (var ae = 0; ae < I.length; ae += 1)
              ce < X[ae].length && (xn[Ht] = X[ae][ce], Ht += 1);
          for (var ce = 0; ce < F; ce += 1)
            for (var ae = 0; ae < I.length; ae += 1)
              ce < oe[ae].length && (xn[Ht] = oe[ae][ce], Ht += 1);
          return xn;
        }, Go = function(T, I, x) {
          for (var j = h.getRSBlocks(T, I), F = g(), X = 0; X < x.length; X += 1) {
            var oe = x[X];
            F.put(oe.getMode(), 4), F.put(oe.getLength(), i.getLengthInBits(oe.getMode(), T)), oe.write(F);
          }
          for (var ae = 0, X = 0; X < j.length; X += 1)
            ae += j[X].dataCount;
          if (F.getLengthInBits() > ae * 8)
            throw "code length overflow. (" + F.getLengthInBits() + ">" + ae * 8 + ")";
          for (F.getLengthInBits() + 4 <= ae * 8 && F.put(0, 4); F.getLengthInBits() % 8 != 0; )
            F.putBit(!1);
          for (; !(F.getLengthInBits() >= ae * 8 || (F.put(_, 8), F.getLengthInBits() >= ae * 8)); )
            F.put(D, 8);
          return ut(F, j);
        };
        q.addData = function(T, I) {
          I = I || "Byte";
          var x = null;
          switch (I) {
            case "Numeric":
              x = k(T);
              break;
            case "Alphanumeric":
              x = M(T);
              break;
            case "Byte":
              x = P(T);
              break;
            case "Kanji":
              x = L(T);
              break;
            default:
              throw "mode:" + I;
          }
          A.push(x), C = null;
        }, q.isDark = function(T, I) {
          if (T < 0 || f <= T || I < 0 || f <= I)
            throw T + "," + I;
          return v[T][I];
        }, q.getModuleCount = function() {
          return f;
        }, q.make = function() {
          if ($ < 1) {
            for (var T = 1; T < 40; T++) {
              for (var I = h.getRSBlocks(T, S), x = g(), j = 0; j < A.length; j++) {
                var F = A[j];
                x.put(F.getMode(), 4), x.put(F.getLength(), i.getLengthInBits(F.getMode(), T)), F.write(x);
              }
              for (var X = 0, j = 0; j < I.length; j++)
                X += I[j].dataCount;
              if (x.getLengthInBits() <= X * 8)
                break;
            }
            $ = T;
          }
          ie(!1, te());
        }, q.createTableTag = function(T, I) {
          T = T || 2, I = typeof I > "u" ? T * 4 : I;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + I + "px;", x += '">', x += "<tbody>";
          for (var j = 0; j < q.getModuleCount(); j += 1) {
            x += "<tr>";
            for (var F = 0; F < q.getModuleCount(); F += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + T + "px;", x += " height: " + T + "px;", x += " background-color: ", x += q.isDark(j, F) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, q.createSvgTag = function(T, I, x, j) {
          var F = {};
          typeof arguments[0] == "object" && (F = arguments[0], T = F.cellSize, I = F.margin, x = F.alt, j = F.title), T = T || 2, I = typeof I > "u" ? T * 4 : I, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, j = typeof j == "string" ? { text: j } : j || {}, j.text = j.text || null, j.id = j.text ? j.id || "qrcode-title" : null;
          var X = q.getModuleCount() * T + I * 2, oe, ae, ge, xe, ce = "", Oe;
          for (Oe = "l" + T + ",0 0," + T + " -" + T + ",0 0,-" + T + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += F.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ce += ' viewBox="0 0 ' + X + " " + X + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += j.text || x.text ? ' role="img" aria-labelledby="' + dt([j.id, x.id].join(" ").trim()) + '"' : "", ce += ">", ce += j.text ? '<title id="' + dt(j.id) + '">' + dt(j.text) + "</title>" : "", ce += x.text ? '<description id="' + dt(x.id) + '">' + dt(x.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ge = 0; ge < q.getModuleCount(); ge += 1)
            for (xe = ge * T + I, oe = 0; oe < q.getModuleCount(); oe += 1)
              q.isDark(ge, oe) && (ae = oe * T + I, ce += "M" + ae + "," + xe + Oe);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, q.createDataURL = function(T, I) {
          T = T || 2, I = typeof I > "u" ? T * 4 : I;
          var x = q.getModuleCount() * T + I * 2, j = I, F = x - I;
          return b(x, x, function(X, oe) {
            if (j <= X && X < F && j <= oe && oe < F) {
              var ae = Math.floor((X - j) / T), ge = Math.floor((oe - j) / T);
              return q.isDark(ge, ae) ? 0 : 1;
            } else
              return 1;
          });
        }, q.createImgTag = function(T, I, x) {
          T = T || 2, I = typeof I > "u" ? T * 4 : I;
          var j = q.getModuleCount() * T + I * 2, F = "";
          return F += "<img", F += ' src="', F += q.createDataURL(T, I), F += '"', F += ' width="', F += j, F += '"', F += ' height="', F += j, F += '"', x && (F += ' alt="', F += dt(x), F += '"'), F += "/>", F;
        };
        var dt = function(T) {
          for (var I = "", x = 0; x < T.length; x += 1) {
            var j = T.charAt(x);
            switch (j) {
              case "<":
                I += "&lt;";
                break;
              case ">":
                I += "&gt;";
                break;
              case "&":
                I += "&amp;";
                break;
              case '"':
                I += "&quot;";
                break;
              default:
                I += j;
                break;
            }
          }
          return I;
        }, Ko = function(T) {
          var I = 1;
          T = typeof T > "u" ? I * 2 : T;
          var x = q.getModuleCount() * I + T * 2, j = T, F = x - T, X, oe, ae, ge, xe, ce = {
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
            for (ae = Math.floor((X - j) / I), ge = Math.floor((X + 1 - j) / I), oe = 0; oe < x; oe += 1)
              xe = "█", j <= oe && oe < F && j <= X && X < F && q.isDark(ae, Math.floor((oe - j) / I)) && (xe = " "), j <= oe && oe < F && j <= X + 1 && X + 1 < F && q.isDark(ge, Math.floor((oe - j) / I)) ? xe += " " : xe += "█", Te += T < 1 && X + 1 >= F ? Oe[xe] : ce[xe];
            Te += `
`;
          }
          return x % 2 && T > 0 ? Te.substring(0, Te.length - x - 1) + Array(x + 1).join("▀") : Te.substring(0, Te.length - 1);
        };
        return q.createASCII = function(T, I) {
          if (T = T || 1, T < 2)
            return Ko(I);
          T -= 1, I = typeof I > "u" ? T * 2 : I;
          var x = q.getModuleCount() * T + I * 2, j = I, F = x - I, X, oe, ae, ge, xe = Array(T + 1).join("██"), ce = Array(T + 1).join("  "), Oe = "", Te = "";
          for (X = 0; X < x; X += 1) {
            for (ae = Math.floor((X - j) / T), Te = "", oe = 0; oe < x; oe += 1)
              ge = 1, j <= oe && oe < F && j <= X && X < F && q.isDark(ae, Math.floor((oe - j) / T)) && (ge = 0), Te += ge ? xe : ce;
            for (ae = 0; ae < T; ae += 1)
              Oe += Te + `
`;
          }
          return Oe.substring(0, Oe.length - 1);
        }, q.renderTo2dContext = function(T, I) {
          I = I || 2;
          for (var x = q.getModuleCount(), j = 0; j < x; j++)
            for (var F = 0; F < x; F++)
              T.fillStyle = q.isDark(j, F) ? "black" : "white", T.fillRect(j * I, F * I, I, I);
        }, q;
      };
      s.stringToBytesFuncs = {
        default: function(m) {
          for (var R = [], _ = 0; _ < m.length; _ += 1) {
            var D = m.charCodeAt(_);
            R.push(D & 255);
          }
          return R;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(m, R) {
        var _ = (function() {
          for (var $ = W(m), S = function() {
            var J = $.read();
            if (J == -1) throw "eof";
            return J;
          }, v = 0, f = {}; ; ) {
            var C = $.read();
            if (C == -1) break;
            var A = S(), q = S(), ie = S(), le = String.fromCharCode(C << 8 | A), te = q << 8 | ie;
            f[le] = te, v += 1;
          }
          if (v != R)
            throw v + " != " + R;
          return f;
        })(), D = 63;
        return function($) {
          for (var S = [], v = 0; v < $.length; v += 1) {
            var f = $.charCodeAt(v);
            if (f < 128)
              S.push(f);
            else {
              var C = _[$.charAt(v)];
              typeof C == "number" ? (C & 255) == C ? S.push(C) : (S.push(C >>> 8), S.push(C & 255)) : S.push(D);
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
        ], R = 1335, _ = 7973, D = 21522, $ = {}, S = function(v) {
          for (var f = 0; v != 0; )
            f += 1, v >>>= 1;
          return f;
        };
        return $.getBCHTypeInfo = function(v) {
          for (var f = v << 10; S(f) - S(R) >= 0; )
            f ^= R << S(f) - S(R);
          return (v << 10 | f) ^ D;
        }, $.getBCHTypeNumber = function(v) {
          for (var f = v << 12; S(f) - S(_) >= 0; )
            f ^= _ << S(f) - S(_);
          return v << 12 | f;
        }, $.getPatternPosition = function(v) {
          return m[v - 1];
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
        for (var m = new Array(256), R = new Array(256), _ = 0; _ < 8; _ += 1)
          m[_] = 1 << _;
        for (var _ = 8; _ < 256; _ += 1)
          m[_] = m[_ - 4] ^ m[_ - 5] ^ m[_ - 6] ^ m[_ - 8];
        for (var _ = 0; _ < 255; _ += 1)
          R[m[_]] = _;
        var D = {};
        return D.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return R[$];
        }, D.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return m[$];
        }, D;
      })();
      function u(m, R) {
        if (typeof m.length > "u")
          throw m.length + "/" + R;
        var _ = (function() {
          for (var $ = 0; $ < m.length && m[$] == 0; )
            $ += 1;
          for (var S = new Array(m.length - $ + R), v = 0; v < m.length - $; v += 1)
            S[v] = m[v + $];
          return S;
        })(), D = {};
        return D.getAt = function($) {
          return _[$];
        }, D.getLength = function() {
          return _.length;
        }, D.multiply = function($) {
          for (var S = new Array(D.getLength() + $.getLength() - 1), v = 0; v < D.getLength(); v += 1)
            for (var f = 0; f < $.getLength(); f += 1)
              S[v + f] ^= c.gexp(c.glog(D.getAt(v)) + c.glog($.getAt(f)));
          return u(S, 0);
        }, D.mod = function($) {
          if (D.getLength() - $.getLength() < 0)
            return D;
          for (var S = c.glog(D.getAt(0)) - c.glog($.getAt(0)), v = new Array(D.getLength()), f = 0; f < D.getLength(); f += 1)
            v[f] = D.getAt(f);
          for (var f = 0; f < $.getLength(); f += 1)
            v[f] ^= c.gexp(c.glog($.getAt(f)) + S);
          return u(v, 0).mod($);
        }, D;
      }
      var h = (function() {
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
        }, _ = {}, D = function($, S) {
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
        return _.getRSBlocks = function($, S) {
          var v = D($, S);
          if (typeof v > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + S;
          for (var f = v.length / 3, C = [], A = 0; A < f; A += 1)
            for (var q = v[A * 3 + 0], ie = v[A * 3 + 1], le = v[A * 3 + 2], te = 0; te < q; te += 1)
              C.push(R(ie, le));
          return C;
        }, _;
      })(), g = function() {
        var m = [], R = 0, _ = {};
        return _.getBuffer = function() {
          return m;
        }, _.getAt = function(D) {
          var $ = Math.floor(D / 8);
          return (m[$] >>> 7 - D % 8 & 1) == 1;
        }, _.put = function(D, $) {
          for (var S = 0; S < $; S += 1)
            _.putBit((D >>> $ - S - 1 & 1) == 1);
        }, _.getLengthInBits = function() {
          return R;
        }, _.putBit = function(D) {
          var $ = Math.floor(R / 8);
          m.length <= $ && m.push(0), D && (m[$] |= 128 >>> R % 8), R += 1;
        }, _;
      }, k = function(m) {
        var R = a.MODE_NUMBER, _ = m, D = {};
        D.getMode = function() {
          return R;
        }, D.getLength = function(v) {
          return _.length;
        }, D.write = function(v) {
          for (var f = _, C = 0; C + 2 < f.length; )
            v.put($(f.substring(C, C + 3)), 10), C += 3;
          C < f.length && (f.length - C == 1 ? v.put($(f.substring(C, C + 1)), 4) : f.length - C == 2 && v.put($(f.substring(C, C + 2)), 7));
        };
        var $ = function(v) {
          for (var f = 0, C = 0; C < v.length; C += 1)
            f = f * 10 + S(v.charAt(C));
          return f;
        }, S = function(v) {
          if ("0" <= v && v <= "9")
            return v.charCodeAt(0) - 48;
          throw "illegal char :" + v;
        };
        return D;
      }, M = function(m) {
        var R = a.MODE_ALPHA_NUM, _ = m, D = {};
        D.getMode = function() {
          return R;
        }, D.getLength = function(S) {
          return _.length;
        }, D.write = function(S) {
          for (var v = _, f = 0; f + 1 < v.length; )
            S.put(
              $(v.charAt(f)) * 45 + $(v.charAt(f + 1)),
              11
            ), f += 2;
          f < v.length && S.put($(v.charAt(f)), 6);
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
        return D;
      }, P = function(m) {
        var R = a.MODE_8BIT_BYTE, _ = s.stringToBytes(m), D = {};
        return D.getMode = function() {
          return R;
        }, D.getLength = function($) {
          return _.length;
        }, D.write = function($) {
          for (var S = 0; S < _.length; S += 1)
            $.put(_[S], 8);
        }, D;
      }, L = function(m) {
        var R = a.MODE_KANJI, _ = s.stringToBytesFuncs.SJIS;
        if (!_)
          throw "sjis not supported.";
        (function(S, v) {
          var f = _(S);
          if (f.length != 2 || (f[0] << 8 | f[1]) != v)
            throw "sjis not supported.";
        })("友", 38726);
        var D = _(m), $ = {};
        return $.getMode = function() {
          return R;
        }, $.getLength = function(S) {
          return ~~(D.length / 2);
        }, $.write = function(S) {
          for (var v = D, f = 0; f + 1 < v.length; ) {
            var C = (255 & v[f]) << 8 | 255 & v[f + 1];
            if (33088 <= C && C <= 40956)
              C -= 33088;
            else if (57408 <= C && C <= 60351)
              C -= 49472;
            else
              throw "illegal char at " + (f + 1) + "/" + C;
            C = (C >>> 8 & 255) * 192 + (C & 255), S.put(C, 13), f += 2;
          }
          if (f < v.length)
            throw "illegal char at " + (f + 1);
        }, $;
      }, w = function() {
        var m = [], R = {};
        return R.writeByte = function(_) {
          m.push(_ & 255);
        }, R.writeShort = function(_) {
          R.writeByte(_), R.writeByte(_ >>> 8);
        }, R.writeBytes = function(_, D, $) {
          D = D || 0, $ = $ || _.length;
          for (var S = 0; S < $; S += 1)
            R.writeByte(_[S + D]);
        }, R.writeString = function(_) {
          for (var D = 0; D < _.length; D += 1)
            R.writeByte(_.charCodeAt(D));
        }, R.toByteArray = function() {
          return m;
        }, R.toString = function() {
          var _ = "";
          _ += "[";
          for (var D = 0; D < m.length; D += 1)
            D > 0 && (_ += ","), _ += m[D];
          return _ += "]", _;
        }, R;
      }, E = function() {
        var m = 0, R = 0, _ = 0, D = "", $ = {}, S = function(f) {
          D += String.fromCharCode(v(f & 63));
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
          for (m = m << 8 | f & 255, R += 8, _ += 1; R >= 6; )
            S(m >>> R - 6), R -= 6;
        }, $.flush = function() {
          if (R > 0 && (S(m << 6 - R), m = 0, R = 0), _ % 3 != 0)
            for (var f = 3 - _ % 3, C = 0; C < f; C += 1)
              D += "=";
        }, $.toString = function() {
          return D;
        }, $;
      }, W = function(m) {
        var R = m, _ = 0, D = 0, $ = 0, S = {};
        S.read = function() {
          for (; $ < 8; ) {
            if (_ >= R.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var f = R.charAt(_);
            if (_ += 1, f == "=")
              return $ = 0, -1;
            if (f.match(/^\s$/))
              continue;
            D = D << 6 | v(f.charCodeAt(0)), $ += 6;
          }
          var C = D >>> $ - 8 & 255;
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
        return S;
      }, V = function(m, R) {
        var _ = m, D = R, $ = new Array(m * R), S = {};
        S.setPixel = function(A, q, ie) {
          $[q * _ + A] = ie;
        }, S.write = function(A) {
          A.writeString("GIF87a"), A.writeShort(_), A.writeShort(D), A.writeByte(128), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(255), A.writeByte(255), A.writeByte(255), A.writeString(","), A.writeShort(0), A.writeShort(0), A.writeShort(_), A.writeShort(D), A.writeByte(0);
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
        return S;
      }, b = function(m, R, _) {
        for (var D = V(m, R), $ = 0; $ < R; $ += 1)
          for (var S = 0; S < m; S += 1)
            D.setPixel(S, $, _(S, $));
        var v = w();
        D.write(v);
        for (var f = E(), C = v.toByteArray(), A = 0; A < C.length; A += 1)
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
  })(Vn)), Vn.exports;
}
var Iv = Bv();
const Rv = /* @__PURE__ */ Tv(Iv), Lv = ["width", "height", "viewBox"], Dv = ["width", "height"], Nv = ["d"], jv = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = O(() => {
      const s = Rv(0, "M");
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
      }, null, 8, Dv),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Nv)
    ], 8, Lv));
  }
}, Zy = /* @__PURE__ */ Y(jv, [["__scopeId", "data-v-489f0852"]]), Xy = rr(() => import("./VoiceFigure-N-UIRWVp.js").then((e) => e.V)), Qy = "1.0.0", ew = "3.5";
export {
  Uv as $,
  py as A,
  Je as B,
  My as C,
  hy as D,
  xy as E,
  oy as F,
  Wo as G,
  Wm as H,
  Pm as I,
  Oy as J,
  kt as K,
  ky as L,
  Be as M,
  Et as N,
  gy as O,
  $n as P,
  vy as Q,
  xp as R,
  To as S,
  fy as T,
  $y as U,
  fa as V,
  _m as W,
  ym as X,
  Ty as Y,
  _y as Z,
  Y as _,
  ue as a,
  ko as a$,
  qy as a0,
  ve as a1,
  ys as a2,
  Vv as a3,
  ed as a4,
  Yy as a5,
  sy as a6,
  nn as a7,
  Iy as a8,
  qv as a9,
  gs as aA,
  Jy as aB,
  Vo as aC,
  at as aD,
  Yv as aE,
  Xy as aF,
  Ne as aG,
  ol as aH,
  Jn as aI,
  zy as aJ,
  Vy as aK,
  Gy as aL,
  ny as aM,
  ey as aN,
  Xv as aO,
  Ly as aP,
  Ry as aQ,
  k1 as aR,
  Hv as aS,
  Ze as aT,
  Gv as aU,
  Zv as aV,
  Py as aW,
  Dy as aX,
  Hy as aY,
  _g as aZ,
  Fg as a_,
  It as aa,
  ke as ab,
  Wy as ac,
  Qy as ad,
  ew as ae,
  Fy as af,
  rs as ag,
  Qv as ah,
  E1 as ai,
  ds as aj,
  hs as ak,
  Ho as al,
  zv as am,
  Er as an,
  Ky as ao,
  Kv as ap,
  Zy as aq,
  jy as ar,
  Zr as as,
  Wv as at,
  ty as au,
  Bg as av,
  Nh as aw,
  wt as ax,
  Jv as ay,
  Fv as az,
  Xe as b,
  Ny as b0,
  Wh as b1,
  vs as b2,
  Uy as b3,
  my as c,
  iy as d,
  ly as e,
  ry as f,
  Ey as g,
  _o as h,
  yy as i,
  wy as j,
  by as k,
  Cy as l,
  cy as m,
  ay as n,
  uy as o,
  dn as p,
  By as q,
  Sy as r,
  dy as s,
  je as t,
  vm as u,
  Ay as v,
  km as w,
  Ss as x,
  Fp as y,
  Hp as z
};
