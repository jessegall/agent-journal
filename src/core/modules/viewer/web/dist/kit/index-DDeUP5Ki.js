/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as be, createElementVNode as g, normalizeClass as X, Fragment as J, renderList as re, normalizeStyle as $e, defineComponent as Ro, Comment as Lo, h as as, cloneVNode as Do, createBlock as K, withCtx as U, unref as G, createVNode as H, toDisplayString as M, createCommentVNode as P, inject as ft, computed as D, resolveDynamicComponent as et, Transition as on, watch as ke, ref as F, shallowRef as rn, TransitionGroup as Io, mergeProps as dt, reactive as os, createTextVNode as ge, onMounted as je, onUnmounted as Ae, nextTick as ln, useId as da, Teleport as ha, withModifiers as Me, isRef as xs, resolveDirective as jo, withDirectives as $t, useModel as Pn, useAttrs as fa, getCurrentInstance as No, mergeModels as qn, getCurrentScope as pa, onScopeDispose as ma, onBeforeUnmount as rs, provide as Po, onErrorCaptured as qo, toHandlers as Wo, createSlots as Fo, withKeys as Wn, vModelText as ga, defineAsyncComponent as Ho } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Uo = { class: "skeleton-line" }, zo = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Uo, [
      be(t.$slots, "default", {}, void 0, !0),
      g("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(J, null, re(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: $e({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Je = /* @__PURE__ */ Y(zo, [["__scopeId", "data-v-0ebb6933"]]), is = Ro({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Lo);
      return s.length !== 1 ? as(J, { key: n }, s) : s[0].key == null ? Do(s[0], { key: n }) : s[0];
    };
  }
}), Vo = ["aria-label"], Go = ["aria-label"], Ko = ["aria-label"], Yo = ["aria-label"], Jo = ["aria-label"], Zo = ["aria-label"], Qo = ["aria-label"], Xo = {
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
    return (l, u) => (c(), K(is, { value: e.shape }, {
      messages: U(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(J, null, re(t, (f) => g("div", {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: $e({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, Vo)
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
            style: $e({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, Go)
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
            (c(), h(J, null, re(n, (k) => H(Je, {
              key: k.id,
              bars: k.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ko)
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
            H(Je, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(J, null, re(a, (k) => H(Je, {
              key: k.id,
              bars: k.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Yo)
      ]),
      page: U(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          H(Je, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(J, null, re(e.count, (f) => (c(), K(Je, {
            key: f,
            bars: G(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, Jo)
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
        ], 8, Zo)
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
        ], 8, Qo)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, At = /* @__PURE__ */ Y(Xo, [["__scopeId", "data-v-c687fb85"]]), er = {
  key: 1,
  class: "empty-state titled"
}, tr = { class: "empty-state-title" }, nr = { class: "empty-state-text" }, sr = {
  key: 2,
  class: "empty-state"
}, ar = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), K(At, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", er, [
      g("p", tr, M(e.title), 1),
      g("p", nr, [
        be(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", sr, [
      be(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Kt = /* @__PURE__ */ Y(ar, [["__scopeId", "data-v-b27e89b0"]]), or = { class: "fold-group" }, rr = ["aria-expanded"], ir = { class: "fold-label" }, lr = {
  key: 0,
  class: "fold-count"
}, cr = {
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
    return (s, a) => (c(), h("div", or, [
      g("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        g("span", ir, M(e.label), 1),
        e.count !== "" ? (c(), h("span", lr, M(e.count), 1)) : P("", !0),
        g("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, rr),
      e.open ? be(s.$slots, "default", {}, void 0, !0, 0) : P("", !0)
    ]));
  }
}, eg = /* @__PURE__ */ Y(cr, [["__scopeId", "data-v-9ef1865c"]]), tt = Symbol.for("journal.window-context");
function va() {
  const e = ft(tt, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const ur = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, dr = /* @__PURE__ */ Y(ur, [["__scopeId", "data-v-eb453d6f"]]), hr = {
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
    const t = e, n = D(() => {
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
        e.busy ? (c(), K(dr, {
          key: 0,
          class: "btn-spinner"
        })) : P("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ Y(hr, [["__scopeId", "data-v-a2dc4bda"]]), fr = {
  class: "running",
  "data-running-command": ""
}, pr = ["title"], mr = {
  key: "idle",
  class: "running-idle"
}, gr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", fr, [
      H(on, {
        name: "roll",
        mode: "out-in"
      }, {
        default: U(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, M(e.text), 9, pr)) : (c(), h("span", mr, M(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, tg = /* @__PURE__ */ Y(gr, [["__scopeId", "data-v-e3ee3449"]]), vr = ["aria-checked", "aria-label", "title"], yr = {
  key: 0,
  class: "switch-inner"
}, wr = {
  key: 0,
  class: "switch-word"
}, kr = {
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
        e.labelled ? (c(), h("span", yr, M(e.word), 1)) : P("", !0),
        a[1] || (a[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", wr, M(e.word), 1)) : P("", !0)
    ], 10, vr));
  }
}, ng = /* @__PURE__ */ Y(kr, [["__scopeId", "data-v-1bfb90f3"]]);
function ya(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Mt(e, t) {
  return ya(() => localStorage, e, t);
}
function wa(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function cn(e, t) {
  return wa(() => localStorage, e, t);
}
function ka(e, t) {
  ke(t, (n) => cn(e, n), { deep: !0 });
}
function br(e, t) {
  return ya(() => sessionStorage, e, t);
}
function xr(e, t) {
  return wa(() => sessionStorage, e, t);
}
const Yt = "journal.environment", ba = F(br(Yt, Mt(Yt, "")));
function $r(e) {
  ba.value = e, xr(Yt, e), cn(Yt, e);
}
const Jt = F(location.hash), $s = rn(null), Ms = { integrations: "mcp", library: "team" };
function Mr() {
  if (!$s.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ms[n]) {
    location.replace(`#/${[Ms[n], ...s].join("/")}${t ? `?${t}` : ""}`), Jt.value = location.hash;
    return;
  }
  !n || $s.value(n) || ($r(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Jt.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Jt.value = location.hash, Mr();
});
const Ie = D(() => {
  const [e, t = ""] = Jt.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((i) => {
    const [r, l = ""] = i.split("@"), [u = "", f = "", k = ""] = r.split(":");
    return { table: u, id: Number(f), comment: Number(k) || 0, env: l };
  });
  return {
    env: ba.value,
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
function _r(e = "", t = 0, n = "") {
  location.hash = un.page(e, t, n);
}
const Sr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function xa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([i]) => i !== "open" && i !== "sub").map(([i, r]) => `${i}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Sr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const yn = {};
function $a(e, t, n = 0, s = "") {
  var i;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((i = yn[e]) != null && i.call(yn, t))) return;
  const a = Ie.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  xa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Er(e, t, n, s = 0, a = "") {
  if (e === Ie.value.env) return $a(t, n, s, a);
  const o = Ie.value.stack, i = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  xa([...i < 0 ? o : o.slice(0, i), { table: t, id: n, comment: s, env: e }], a);
}
function pt(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Er(s, a, Number(o), 0, t) : $a(a, Number(o), 0, t);
}
function Ar(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function lt(e) {
  const t = Ar(e);
  t && pt(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Cr = ["stroke-width", "innerHTML"], Ee = {
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
    }, null, 12, Cr));
  }
}, ls = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), K(ye, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: U(() => [
        H(Ee, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Or = {
  key: 1,
  class: "row-list-failure"
}, Tr = ["data-row"], Br = {
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
    const t = e, n = D(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = F(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, i) => !e.loaded && !e.failure ? (c(), K(At, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Or, M(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), K(Kt, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (c(), h(J, { key: 3 }, [
      (c(), K(et(e.arrival ? Io : "ul"), dt(n.value, { class: "row-list" }), {
        default: U(() => [
          (c(!0), h(J, null, re(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            be(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Tr))), 128))
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
}, Rr = /* @__PURE__ */ Y(Br, [["__scopeId", "data-v-7f34ada7"]]), Lr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Dr = {
  key: 1,
  class: "agent-rows-note"
}, Ir = {
  key: 2,
  class: "agent-rows-note"
}, jr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Nr = ["data-agent-row", "onClick"], Pr = { class: "agent-row-name" }, qr = { class: "agent-row-state" }, Wr = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = D(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = D(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Lr, [
      e.loaded ? e.failure ? (c(), h("p", Dr, M(e.failure), 1)) : e.rows.length ? (c(), h(J, { key: 3 }, [
        g("p", jr, M(s.value) + " running", 1),
        (c(!0), h(J, null, re(n.value, (i) => (c(), h("button", {
          key: i.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": i.id,
          onClick: (r) => G(pt)(`agents:${i.id}`)
        }, [
          g("span", Pr, "#" + M(i.id) + " " + M(i.session), 1),
          g("span", qr, M(i.ended_at ? "Closed" : "Running"), 1)
        ], 8, Nr))), 128))
      ], 64)) : (c(), h("p", Ir, M(e.none), 1)) : (c(), K(At, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, sg = /* @__PURE__ */ Y(Wr, [["__scopeId", "data-v-a01e5a17"]]), Fr = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, M(e.text), 3));
  }
}, Ma = /* @__PURE__ */ Y(Fr, [["__scopeId", "data-v-9e7e1157"]]), Hr = ["aria-valuenow", "aria-valuemax"], Ur = {
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
    const t = e, n = D(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (c(), h("span", {
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: $e({ width: n.value })
      }, null, 4)
    ], 10, Hr));
  }
}, zr = /* @__PURE__ */ Y(Ur, [["__scopeId", "data-v-9eba6a85"]]), Vr = { class: "bars" }, Gr = { class: "bar-name" }, Kr = { class: "bar-value" }, Yr = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => Math.max(1, ...n.items.map((i) => Number(i.value) || 0))), o = D(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (i, r) => (c(), h("div", Vr, [
      (c(!0), h(J, null, re(e.items, (l, u) => (c(), K(et(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: X(["bar-row", l.tone, { opens: l.open }]),
        onClick: (f) => l.open && s("open", l.open)
      }, {
        default: U(() => [
          g("span", Gr, M(l.label), 1),
          H(zr, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", Kr, M(l.value) + M(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Jr = /* @__PURE__ */ Y(Yr, [["__scopeId", "data-v-663427f4"]]), Zr = { class: "bars" }, Qr = {
  key: 0,
  class: "bars-title"
}, Xr = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Zr, [
      e.node.title ? (c(), h("span", Qr, M(e.node.title), 1)) : P("", !0),
      H(Jr, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, ei = /* @__PURE__ */ Y(Xr, [["__scopeId", "data-v-7135bb11"]]), ti = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (i) => ({ gap: `${i.gap || 14}px` }),
      row: (i) => ({ gap: `${i.gap || 12}px` }),
      grid: (i) => ({ gap: `${i.gap || 12}px`, gridTemplateColumns: `repeat(${i.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = D(() => n[s.node.type](s.node));
    return (i, r) => (c(), h("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: $e(o.value)
    }, [
      (c(!0), h(J, null, re(e.node.children || [], (l, u) => (c(), K(Qa, {
        key: u,
        node: l,
        onOpen: r[0] || (r[0] = (f) => a("open", f)),
        onFile: r[1] || (r[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Ht = /* @__PURE__ */ Y(ti, [["__scopeId", "data-v-d142a3f4"]]), ni = {
  key: 0,
  class: "card-head"
}, si = { class: "card-title" }, ai = {
  key: 0,
  class: "card-note"
}, oi = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", ni, [
        g("span", si, M(e.node.title), 1),
        e.node.note ? (c(), h("span", ai, M(e.node.note), 1)) : P("", !0)
      ])) : P("", !0),
      H(Ht, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, ri = /* @__PURE__ */ Y(oi, [["__scopeId", "data-v-67b72d40"]]), ii = (e, t, n) => Math.max(t, Math.min(n, e)), li = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, xe = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, _s = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", wn = 80;
function Ss(e) {
  return e.length <= wn ? e : `${e.slice(0, wn + 1).replace(/\s+\S*$/, "") || e.slice(0, wn)}…`;
}
const Es = {
  messages: (e) => Ss(_s(e.text)),
  comments: (e) => Ss(_s(e.text)),
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
}, ci = (e) => (Es[e.table] ? Es[e.table](e) : e.title || "") || "", ui = ["done", "cancelled"], Fn = {
  tasks: (e) => xe(e.completed_at) || (e.state === "cancelled" ? xe(e.updated_at) : 0),
  questions: (e) => e.answer ? xe(e.updated_at) : 0,
  plans: (e) => ui.includes(e.state) ? xe(e.updated_at) : 0,
  notices: (e) => xe(e.closed_at),
  secrets: (e) => xe(e.deleted_at),
  workers: (e) => e.state === "stopped" ? xe(e.updated_at) : 0,
  shares: (e) => xe(e.stopped_at),
  dumps: (e) => xe(e.completed_at),
  agents: (e) => e.state === "ended" ? xe(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? xe(e.created_at) : 0
}, di = (e) => Fn[e.table] ? Fn[e.table](e) : 0, _a = (e) => di(e) > 0, hi = (e) => !!Fn[e], Sa = (e) => xe(e.created_at), Zt = (e) => xe(e.updated_at) || Sa(e), fi = (e) => "task_ids" in e, dn = typeof document < "u" && document.documentElement.classList.contains("phone"), pi = "Files are attached on the computer; the phone sends text.", Ea = 1024, mi = Ea * 1024 * 1024, gi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ea} MB limit for one file.`;
function vi() {
  return () => {
  };
}
function As(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function yi(e = window) {
  if (!As(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    As(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Aa = "status.summary", ve = os({
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
}), wi = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Ca = () => !!ve.countdown || wi() || ve.starting;
function ki(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function bi(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function xi() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function $i(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (xi(), !0);
}
let Dt = { version: "", started: 0 };
function Mi(e) {
  return e.version ? (Dt.version || (Dt = { version: e.version, started: e.started || 0 }), e.version !== Dt.version || (e.started || 0) !== Dt.started) : !1;
}
function _i(e) {
  bi(e.countdown), ki(e.ready, e.step), ($i(!!e.updating, e.step) || !e.updating && !Si(e) && Mi(e)) && yi(window);
}
const Si = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Cs = 2e4, Ei = 3e5, qe = 6e5, It = 6, Ai = 500, Ci = "/journal/summary", Os = dn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Oi = (e) => e.split("?")[0].endsWith(Ci), Oa = (e, t) => Object.assign(new Error(t), { status: e });
async function Ti(e, t, n = Oa) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Bi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Ri {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = It;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = It;
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
        headers: { ...Os, ...i, ...s === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: Bi(s),
        signal: AbortSignal.timeout(a || (r ? Ei : Cs))
      });
    } catch (l) {
      if (t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Ai)), this.reach(t, n, s, a, o - 1, i);
    }
  }
  async send(t, n, s, a = 0, o = It, i = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : vi(), l = await this.reach(t, n, s, a, o, i).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return Ti(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Os, signal: AbortSignal.timeout(Cs) });
    if (!n.ok) throw Oa(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, i = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, It, o).then((l) => (this.written(n), l));
    if (Ca() && !Oi(n))
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
const De = new Ri(), Se = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const vt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: i = !1 }) => [i ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), yt = "the page does not know its environment yet", Li = "X-Journal-Env", Di = "X-Journal-Request-At", kn = "/viewer/voices/figures/";
class cs {
  constructor({ env: t = () => Ie.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new cs({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Di]: String(Date.now()), ...this.env() ? { [Li]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === yt ? Promise.reject(new Error(yt)) : De.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === yt ? Promise.reject(new Error(yt)) : De.request("POST", this.url(t), n, s, this.headers());
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
    return De.stream(this.address("/entries/stream" + n));
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
    if (dn) return Promise.reject(Object.assign(new Error(pi), { status: 403 }));
    if (s.size > mi) return Promise.reject(new Error(gi(s)));
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
    return De.request("GET", kn + "figures.json");
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
const ie = new cs({ base: dn ? "/p" : "" }), Ii = (e) => De.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), ji = { claude: "Claude Code", codex: "Codex" };
Object.entries(ji).map(([e, t]) => ({ key: e, label: t }));
const Ts = (e) => e.status === "stopped" ? 1 : 0, Ni = "main", Pi = (e) => e.filter((t) => t.role === Ni).sort((t, n) => Ts(t) - Ts(n) || xe(n.heard_at) - xe(t.heard_at))[0] || null, qi = { me: 1, people: [] }, z = os({
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
  people: qi,
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
ka("journal.activity", () => z.activity);
ka("journal.side.mini", () => z.sideMini);
const ht = D(() => Pi(z.agents));
D(() => !!ht.value && z.live.some((e) => e.agent.session === ht.value.session && e.environment === Ie.value.env));
D(() => !!ht.value && ["busy", "working"].includes(ht.value.status));
function Wi(e) {
  if (!e) return "";
  const t = typeof e == "string" ? Date.parse(e) / 1e3 : e, n = Math.max(0, Date.now() / 1e3 - t);
  return n < 60 ? "now" : n < 3600 ? `${Math.floor(n / 60)}m` : n < 86400 ? `${Math.floor(n / 3600)}h` : `${Math.floor(n / 86400)}d`;
}
function Bs(e) {
  const t = Wi(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Ta(e) {
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
function Fi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${bn(t % 60)}s` : `${Math.floor(t / 3600)}h ${bn(Math.floor(t % 3600 / 60))}m ${bn(t % 60)}s`;
}
const Hi = ["working", "busy", "waiting", "compacting"], Ui = (e) => Hi.includes(e), zi = "builder";
D(() => !z.settings || z.settings.features.file_feed !== !1);
const Vi = D(() => !z.settings || z.settings.features.status_bar !== !1);
D(() => z.settings && z.settings.workers && z.settings.workers.mode || zi);
D(() => !z.settings || !z.settings.tasks || z.settings.tasks.auto !== !1);
D(() => !!(z.settings && z.settings.reviewing && z.settings.reviewing.reviewer));
D(() => !z.settings || z.settings.features.sharing !== !1);
const Qt = 50, us = 100, Gi = { messages: 25 }, Le = (e) => Gi[e] || Qt;
function Ki(e, t) {
  if (e !== "messages") return Math.max(t.length - Le(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Le(e)) return s;
  return 0;
}
const Yi = "review_step", Ji = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === Yi).sort((t, n) => t.id - n.id), Zi = 5, Qi = 500, Xi = 3e3, el = () => z.entries.length ? z.entries[z.entries.length - 1].id : 0, Ut = { env: "", id: 0 }, tl = () => !!(z.bar && z.bar.length) || Ui(ht.value && ht.value.status);
function nl({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function sl() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: us })))).then(Ji);
}
function al() {
  return Ut.env !== ie.env() && Object.assign(Ut, { env: ie.env(), id: el() }), ie.entries(Ut.id);
}
function ol(e) {
  e.length && (Ut.id = e[e.length - 1].id, Jl(e));
}
async function rl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", Qt);
}
const Hn = /* @__PURE__ */ new Map();
async function Un(e, t) {
  const n = `${e}:${ie.env()}`, s = Hn.get(n);
  if (!s) return Ls(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(Zt)), o = s.length ? Math.min(...s.map((l) => l.id)) - 1 : 0, i = await ie.list("workers", { limit: t, since: a, after: o });
  if (!i.is_last_page)
    return Hn.delete(n), Un(e, t);
  const r = new Set(i.rows.map((l) => l.id));
  return Ls(
    n,
    [...s.filter((l) => !r.has(l.id)), ...i.rows].sort((l, u) => l.id - u.id)
  );
}
const Ls = (e, t) => (Hn.set(e, t), t);
async function Ds(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Is = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => tl() ? Qi : Xi,
    take: (e) => Array.isArray(e) && (z.bar = e),
    active: () => Vi.value
  },
  "agents.index": { read: () => Ds(ie, Zi), every: 1e3, take: (e) => z.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => z.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      z.summary = e, _i(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => z.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => z.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (z.people = e) },
  "entries.recent": { read: al, every: 1e3, take: ol },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: nl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Un("workers.index", Le("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Un("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: sl, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Le("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: rl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
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
}), il = 6e4, ll = 3e3, cl = 4, ul = 300, dl = 5e3, Ba = /* @__PURE__ */ new Map();
function hn(e) {
  if (!(e in Is)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Is[e];
}
function hl(e) {
  const t = hn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return dl;
  }
}
const fl = (e) => e / 2 + Math.random() * e / 2, Ra = (e) => [...e.users.values()].pop(), ds = (e) => Ba.get(e.place) === e, pl = () => Math.random() * ul, hs = () => document.hidden;
function ml(e) {
  const t = hl(e);
  return e.failures ? fl(Math.min(e.key === Aa ? ll : il, t * 2 ** e.failures)) : Math.max(t, cl * e.took);
}
function La(e, t) {
  clearTimeout(e.timer), !(!ds(e) || e.paused || hs()) && (e.timer = setTimeout(() => gl(e), t));
}
function gl(e) {
  return ds(e) ? e.running ? (e.again = !0, e.running) : (e.running = kl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const vl = (e) => {
  var t, n;
  return !e.paused && !hs() && (((n = (t = hn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Ra(e).active() && (!Ca() || e.key === Aa);
};
async function yl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await De.attemptOnce(() => hn(e.key).read(Ra(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function wl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = hn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function kl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      vl(e) && wl(e, await yl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ds(e) && !e.paused);
  La(e, ml(e));
}
const bl = () => hs() || Ba.forEach((e) => La(e, pl()));
document.addEventListener("visibilitychange", bl);
const xl = 60, $l = (e, t) => xe(e.created_at) >= xe(t.created_at) - xl, Ml = (e, t) => e.id > 0 && e.table === t.table && $l(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), fs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Ml(s, n))), xn = [
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
}, _l = ["secrets", "plugins"], Da = Object.keys(Ct).filter((e) => !(dn && _l.includes(e)));
D(() => Da.map((e) => ({ name: e, ...Ct[e] })));
const fn = (e) => Ct[e], Ia = new Map(Da.flatMap((e) => [e, e.replace(/s$/, ""), Ct[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => Ia.get(String(e).toLowerCase()) || "", ja = [...Ia.keys()].sort((e, t) => t.length - e.length).join("|"), Ye = /* @__PURE__ */ new Set(), ps = F(0), Ot = /* @__PURE__ */ new Set(), Tt = /* @__PURE__ */ new Set(), ze = /* @__PURE__ */ new Set(), zn = /* @__PURE__ */ new Set(), Sl = /* @__PURE__ */ new Map(), El = /* @__PURE__ */ new Map();
let it = !1, wt = null;
const Al = (e, t) => e.id - t.id, Cl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Ol = { messages: Cl }, Na = (e) => Ol[e] || Al;
function Pa(e) {
  return ps.value, Ye.has(e) || (Ye.add(e), z.booted && (!Ot.has(e) || Tt.has(e)) && queueMicrotask(() => mn([e], !1))), z.rows[e] || [];
}
function Tl(e) {
  const t = z.rows[e] || [], n = Ki(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  z.rows[e] = t.filter((a) => s.has(a) || hi(e) && !_a(a)), z.paging.size[e] = Le(e), z.paging.more[e] = !0;
}
const Bl = /* @__PURE__ */ new Set();
function Rl() {
  Ye.forEach(Tl), Ye.clear(), Sl.clear(), El.clear(), ps.value += 1;
}
ke(() => `${Ie.value.env}/${Ie.value.page}/${Ie.value.open ? Ie.value.open.table : ""}`, Rl);
ke(
  () => z.booted,
  (e) => e && mn(
    [...Ye].filter((t) => !Ot.has(t)),
    !1
  )
);
const Vn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !fi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function qa(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Vn(s) && !Vn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Wa(e, t) {
  Ot.add(e), ps.value += 1;
  const n = z.rows[e] || [];
  z.rows[e] = [...qa(n, t.rows), ...fs(n.filter((s) => s.id === 0), t.rows)], z.paging.size[e] = z.paging.size[e] || Le(e), z.paging.more[e] = !t.is_last_page;
}
async function Ll(e) {
  const t = new Set((z.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Le(e) });
  pn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = fs((z.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Wa(e, { ...n, rows: [...n.rows, ...a].sort(Na(e)) }), z.paging.size[e] = Le(e), Fa.has(e) && await Ha(e), z.rows[e];
}
const pn = (e, t) => z.counts = { ...z.counts, [e]: t };
async function Dl(e) {
  const t = z.rows[e] || [], n = Math.max(0, ...t.map(Zt)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await ie.list(e, { limit: Le(e), since: n, after: s });
  if (pn(e, a.counts), !a.is_last_page) return Ll(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), i = fs(t.filter((r) => !o.has(r.id)), a.rows).concat(qa(t, a.rows));
  return z.rows[e] = i.sort(Na(e)), z.paging.size[e] = z.rows[e].length, z.rows[e];
}
const $n = /* @__PURE__ */ new Set();
async function Il(e, t = !1) {
  e.forEach((n) => Tt.delete(n)), e.forEach((n) => zn.add(n));
  try {
    await Hl(e, t);
  } finally {
    e.forEach((n) => zn.delete(n));
  }
}
async function jl(e) {
  const t = await ie.list(e, { limit: Le(e) });
  pn(e, t.counts), Wa(e, t);
}
async function Nl(e) {
  pn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Fa = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ha(e) {
  const t = (z.rows[e] || []).filter((a) => Vn(a) && (e !== "plans" || !_a(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  z.rows[e] = (z.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Pl = (e, t) => !Ot.has(e) || t && (z.paging.size[e] || Le(e)) === Le(e) && !Bl.has(e);
async function ql(e, t) {
  if (!Ye.has(e)) return Nl(e);
  const n = await (Pl(e, t) ? jl(e) : Dl(e));
  return Fa.has(e) && await Ha(e), n;
}
async function Wl() {
  const [e, t] = await Promise.all([ie.entries(0, us), ie.settings()]);
  Va([...Mt(za(), []), ...e]), JSON.stringify(t) !== JSON.stringify(z.settings) && (z.settings = t);
}
const Fl = (e, t) => ql(e, t).then(
  () => null,
  () => e
);
async function Hl(e, t) {
  const n = (await Promise.all(e.map((s) => Fl(s, t)))).filter(Boolean);
  if (n.forEach((s) => (ze.add(s), Tt.add(s))), t && await Wl(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ua = 1e3, Ul = 15e3;
let jt = Ua;
async function zl() {
  return wt || (wt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...ze].some((e) => !$n.has(e)) || it; ) {
      const e = it, t = [...e ? Object.keys(z.rows) : ze].filter((s) => Ct[s] && (Ye.has(s) || s in z.rows)).filter((s) => e || !Ye.has(s) || Tt.has(s) || !Ot.has(s)).filter((s) => !$n.has(s)), n = [...ze].filter((s) => $n.has(s));
      ze.clear(), n.forEach((s) => ze.add(s)), it = !1;
      try {
        await Il(t, e), jt = Ua;
      } catch {
        it = it || e, await new Promise((a) => setTimeout(a, jt)), jt = Math.min(jt * 2, Ul);
      }
    }
  })().finally(() => wt = null), wt);
}
function mn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !zn.has(n)).forEach((n) => {
    ze.add(n), t && Tt.add(n);
  }), ze.has("settings") && (it = !0), zl();
}
const za = () => {
  var e;
  return `typed-entries:${((e = z.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Va(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  z.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-us), cn(za(), z.entries.slice(-50));
}
const Vl = ["created", "updated", "deleted"], Gl = { phases: ["phases", "plans"] }, Gn = (e) => Gl[e] || [e], Kl = (e) => Vl.includes(e.entry_type) ? [...Gn(e.data.table), ...(e.data.joins || []).flatMap(Gn)] : [];
function Yl(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of Gn(t.data.table).filter((s) => z.rows[s]))
      z.rows[n] = z.rows[n].filter((s) => s.id !== t.data.id);
}
function Jl(e) {
  Va([...z.entries, ...e]), Yl(e), mn([...new Set(e.flatMap(Kl))].filter((t) => t && t !== "agents"));
}
Ii((e) => z.streamOpen || mn([e]));
const Kn = [], Zl = 2e3, Ue = /* @__PURE__ */ new Map(), Ql = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Xl = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function nt(e, { first: t = !1 } = {}) {
  t ? Kn.unshift(e) : Kn.push(e), Ue.clear();
}
function Ga(e, t, n) {
  var a;
  const s = Pa(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const ec = (e) => Pa(e.table).find((t) => t.id === e.id) === e.row, tc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Fe(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function nc(e, t) {
  const n = [{ kind: "text", text: Fe(e).replace(/\r\n/g, `
`) }];
  for (const s of Kn)
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
  return sc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function sc(e) {
  return e.split(Xl).map((t, n) => n % 2 ? t : t.replace(Ql, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function js(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function ac(e) {
  const [t, , ...n] = e, s = js(t).map((o) => `<th>${_t(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${js(o).map((i) => `<td>${_t(i)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function oc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${_t(a)}</li>`).join("")}</${s}>`;
}
const Ns = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ka(e) {
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
    if (Ns(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(ac(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(oc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Ka(
          t.slice(s, r).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let i = s;
    for (; i < t.length && t[i].trim() && !Ns(t, i) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[i]); )
      i += 1;
    n.push(`<p>${_t(t.slice(s, i).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = i;
  }
  return n.join("");
}
const rc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ic = (e) => e.kind !== "text" && !rc.test(e.html);
function lc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Ka(s).replace(/\u0001(\d+)\u0001/g, (o, i) => t[Number(i)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : ic(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Yn(e, t = { env: "" }) {
  const n = tc(e, t), s = Ue.get(n);
  if (Ue.delete(n), s && s.reads.every(ec))
    return Ue.set(n, s), s.html;
  const a = [], o = lc(nc(e, { ...t, reads: a }));
  return Ue.set(n, { html: o, reads: a }), Ue.size > Zl && Ue.delete(Ue.keys().next().value), o;
}
const Ya = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Xt = (e) => String(e || "").replace(Ya, (t, n, s, a) => a), cc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Nt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, uc = /^Traceback \(most recent call last\):/m, dc = 8;
function Ja(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, dc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function hc(e) {
  const t = [...e.matchAll(cc)].map((s) => s.index);
  if (Nt.lastIndex = 0, !t.length || !Nt.test(e)) return null;
  Nt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), i = [...o.matchAll(Nt)];
    return { head: i.length ? o.slice(0, i[0].index).trim() : o, frames: i.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Ja(n), tail: "" } : null;
}
function fc(e) {
  const t = uc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Ja([o]), tail: n.slice(a).join(`
`) };
}
nt((e) => {
  const t = Xt(e), n = fc(t) || hc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Jn = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", pc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", mc = `${Jn} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, gc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", vc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ps = {
  js: { keywords: Jn, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: pc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: mc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Jn, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: gc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: vc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function qs(e, t, n) {
  return n && e.startsWith(n, t);
}
function yc(e, t) {
  const n = Ps[t] || Ps.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (qs(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      i("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && qs(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], k = n.lower ? f.toLowerCase() : f, _ = n.property && /^\s*:/.test(e.slice(o + f.length));
      i(s.has(k) ? "keyword" : _ ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function wc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of yc(e, t))
    a.split(`
`).forEach((i, r) => {
      r && n.push(""), i && (n[n.length - 1] += s === "plain" ? Fe(i) : `<span class="tok-${s}">${Fe(i)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function kc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const bc = 1500, Ws = /* @__PURE__ */ new WeakMap();
async function xc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await kc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ws.get(t)), Ws.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, bc)
  )));
}
typeof document < "u" && document.addEventListener("click", xc, !0);
const $c = /^(```|~~~)\s*(\w+)?\s*$/, Fs = /^\s{4,}\S/, Mc = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, _c = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Za(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Sc(e) {
  const t = Za(e.join(`
`));
  return (_c.find(([, n]) => n.test(t)) || ["text"])[0];
}
function Hs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${wc(Za(e.join(`
`)), t || Sc(e)).join(`
`)}</code></pre></div>` };
}
function Ec(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const i = t[o].match($c);
    if (i) {
      const r = t.findIndex((u, f) => f > o && u.trim().startsWith(i[1])), l = r < 0 ? t.length : r;
      a(), n.push(Hs(t.slice(o + 1, l).map(Xt), i[2] ? i[2].toLowerCase() : "")), o = l + 1;
      continue;
    }
    if (Fs.test(t[o])) {
      let r = o;
      for (; r < t.length && (Fs.test(t[r]) || !t[r].trim()); ) r += 1;
      for (; r > o && !t[r - 1].trim(); ) r -= 1;
      const l = [];
      for (; s.length && s[s.length - 1].trim() && Mc.test(s[s.length - 1].trim()); ) l.unshift(s.pop());
      if (r - o + l.length >= 2) {
        a(), n.push(Hs([...l, ...t.slice(o, r)].map(Xt), "")), o = r;
        continue;
      }
      s.push(...l);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
nt((e) => Ec(e));
const Ac = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Cc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Oc(e) {
  const t = Ac.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = Cc.exec(e), s = n && ut(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Tc(e, t, n, s) {
  const a = Ga(s, e, t), o = Xt(a ? ci(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Fe(fn(e).title)} ${t}</span><span class="row-card-title">${Fe(o)}</span></a>`;
}
nt(
  (e, t) => {
    const n = Oc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Tc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Bc = /\.(png|jpe?g|gif|webp|svg)$/i, Rc = (e) => Bc.test(e), Lc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Dc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Ic(e, t) {
  const n = Lc.exec(e), [, s, a, o, i, r] = n || [], l = n && ut(s || o), u = l && Ga(t, l, Number(a || i));
  if (!u || !(u.files || []).includes(r)) return null;
  const f = ie.in(t.env).fileUrl(l, u.id, r), k = `${fn(l).title} ${u.id} · ${Fe(r)}`, _ = Rc(r) ? `<img class="file-card-image" src="${f}" alt="${Fe(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Fe(r)}">${_}<span class="file-card-name">${k}</span></a>` };
}
function jc(e) {
  const t = Dc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Fe(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
nt(
  (e, t) => {
    if (t.inline) return null;
    const n = Ic(e, t) || jc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Nc = /`([^`\n]+)`/g;
nt((e) => e.replace(Nc, (t, n) => `<code>${n}</code>`));
const Us = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${un.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
nt(
  (e, t) => e.replace(Ya, (n, s, a, o) => Us[s] ? Us[s](a, o, t) : o)
);
const Pc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, qc = new RegExp(`\\b(${ja}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Wc = new RegExp(`\\b(${ja}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Fc = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Hc = (e) => e.replace(Wc, (t, n, s) => s.replace(/\d+/g, (a) => Fc(n.replace(/s$/i, ""), a))), Uc = (e) => Hc(e).replace(
  qc,
  (t, n, s, a = "", o) => {
    const i = s || o;
    return `<a class="row-pill" href="#" data-peek="${ut(n)}:${i}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${i}${a ? `:${a}` : ""}</span></a>`;
  }
);
nt(
  (e, t) => t.rowNames === !1 ? e : e.split(Pc).map((n, s) => s % 2 ? n : Uc(n)).join("")
);
const zc = ["innerHTML"], Vc = ["innerHTML"], Gc = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = D(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Yn(s, { env: Ie.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => G(lt) && G(lt)(...o)),
      innerHTML: n.value
    }, null, 8, zc)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => G(lt) && G(lt)(...o)),
      innerHTML: n.value
    }, null, 8, Vc));
  }
}, ct = /* @__PURE__ */ Y(Gc, [["__scopeId", "data-v-30fd9c25"]]), Kc = { class: "fact" }, Yc = { class: "fact-label" }, Jc = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Kc, [
      g("span", Yc, M(e.label), 1),
      H(ct, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Zc = /* @__PURE__ */ Y(Jc, [["__scopeId", "data-v-3a88ecf8"]]), Qc = { class: "list" }, Xc = { class: "list-label" }, eu = {
  key: 1,
  class: "list-note"
}, tu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Qc, [
      (c(!0), h(J, null, re(e.items, (o, i) => (c(), K(et(o.open ? "button" : "div"), {
        key: i,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: U(() => [
          g("span", Xc, M(o.label), 1),
          o.badge ? (c(), K(Ma, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : P("", !0),
          o.note ? (c(), h("span", eu, M(o.note), 1)) : P("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, nu = /* @__PURE__ */ Y(tu, [["__scopeId", "data-v-ebe2ae0a"]]), su = { class: "table" }, au = {
  key: 0,
  class: "table-row empty"
}, ou = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, i) => (c(), h("div", su, [
      g("div", {
        class: "table-row head",
        style: $e(a.value)
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
        style: $e(a.value),
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
      !e.rows.length && e.empty ? (c(), h("div", au, M(e.empty), 1)) : P("", !0)
    ]));
  }
}, ru = /* @__PURE__ */ Y(ou, [["__scopeId", "data-v-9326a52e"]]), iu = { class: "stat-value" }, lu = { class: "stat-label" }, cu = {
  key: 0,
  class: "stat-note"
}, uu = {
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
        g("span", iu, M(e.value), 1),
        g("span", lu, M(e.label), 1),
        e.note ? (c(), h("span", cu, M(e.note), 1)) : P("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, du = /* @__PURE__ */ Y(uu, [["__scopeId", "data-v-ad0db6d6"]]), hu = { class: "code" }, fu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, i) => (c(), K(is, {
      value: e.node.type
    }, {
      stack: U(() => [
        H(Ht, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: U(() => [
        H(Ht, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: U(() => [
        H(Ht, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: U(() => [
        H(ri, {
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
        H(du, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: i[0] || (i[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: U(() => [
        H(ei, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: U(() => [
        H(ru, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: U(() => [
        H(nu, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: U(() => [
        H(ct, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: U(() => [
        H(Zc, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: U(() => [
        H(Ma, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: U(() => [
        g("pre", hu, [
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
}), Qa = /* @__PURE__ */ Y(fu, [["__scopeId", "data-v-cbdcf540"]]), pu = { class: "dashboard" }, mu = { class: "trail" }, gu = ["onClick"], vu = {
  key: 0,
  class: "gone",
  role: "status"
}, yu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (_) => _ in (n.document.pages || {}), o = F(!!n.page && !a(n.page)), i = F(n.page && !o.value ? [n.page] : []), r = D(() => i.value.at(-1) || n.document.start), l = D(() => (n.document.pages || {})[r.value] || null), u = (_) => ((n.document.pages || {})[_] || {}).title || _, f = (_) => {
      o.value = !1, i.value = [...i.value, _];
    }, k = (_) => {
      o.value = !1, i.value = i.value.slice(0, _);
    };
    return ke(
      () => n.document.start,
      () => i.value = []
    ), (_, A) => (c(), h("div", pu, [
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
        g("nav", mu, [
          g("button", {
            type: "button",
            class: X(["step", { current: !i.value.length }]),
            onClick: A[0] || (A[0] = (W) => k(0))
          }, M(u(e.document.start)), 3),
          (c(!0), h(J, null, re(i.value, (W, y) => (c(), h(J, {
            key: `${y}-${W}`
          }, [
            A[2] || (A[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: X(["step", { current: y === i.value.length - 1 }]),
              onClick: (w) => k(y + 1)
            }, M(u(W)), 11, gu)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", vu, "What you opened is no longer in this dashboard. Here is its start page.")) : P("", !0),
        H(on, {
          name: "page",
          mode: "out-in"
        }, {
          default: U(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              H(Qa, {
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
}, ag = /* @__PURE__ */ Y(yu, [["__scopeId", "data-v-fbe83734"]]);
function wu(e, t, n, s = () => window) {
  je(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const ku = (e, t = () => !0) => wu("keydown", (n) => n.key === "Escape" && t() && e());
function bu(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = F(!1), a = D(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return ku(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const xu = 80, ot = os([]);
function $u(e) {
  const t = Symbol("layer"), n = () => ot.includes(t) && ot.splice(ot.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !ot.includes(t) && ot.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), D(() => xu + Math.max(0, ot.indexOf(t)));
}
let Xa = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Xa = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Mu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function _u(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const i = [...e.value.querySelectorAll(Mu)];
    if (!i.length) return o.preventDefault();
    const [r, l] = [i[0], i.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  je(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : Xa, document.addEventListener("keydown", a), ln(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Su = ["aria-modal", "aria-label", "aria-labelledby"], Eu = {
  key: 0,
  class: "dialog-head"
}, Au = ["id", "tabindex"], Cu = {
  key: 1,
  class: "dialog-foot"
}, Ou = 500, Tu = 400, Bu = {
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
    const n = e, s = t, { visible: a, close: o, closed: i } = bu(s, n), r = $u(a), l = F(null), u = F(null), f = F(null), k = da(), _ = F(!1), A = Date.now();
    n.modal && _u(u, () => s("escape"), f);
    function W() {
      if (!n.modal) return n.closable && o();
      _.value = !0, setTimeout(() => _.value = !1, Tu);
    }
    function y(N) {
      !n.modal || Date.now() - A >= Ou || ![" ", "Enter"].includes(N.key) || (N.preventDefault(), N.stopPropagation());
    }
    const w = () => l.value && (l.value.scrollTop = l.value.scrollHeight), E = new MutationObserver(w);
    return ke(l, (N) => {
      E.disconnect(), N && n.follow && (E.observe(N, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Ae(() => E.disconnect()), (N, Q) => (c(), K(ha, { to: "body" }, [
      H(on, {
        name: "dialog",
        appear: "",
        onAfterLeave: G(i)
      }, {
        default: U(() => [
          G(a) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: $e({ zIndex: G(r) }),
            onClick: Me(W, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: _.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? G(k) : void 0,
              onKeydownCapture: y
            }, [
              e.bare ? P("", !0) : (c(), h("header", Eu, [
                g("h3", {
                  id: G(k),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, M(e.title), 9, Au),
                e.closable ? (c(), K(ls, {
                  key: 0,
                  onClick: G(o)
                }, null, 8, ["onClick"])) : P("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: l,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                be(N.$slots, "default", {}, void 0, !0)
              ], 2),
              N.$slots.foot ? (c(), h("footer", Cu, [
                be(N.$slots, "foot", {}, void 0, !0)
              ])) : P("", !0)
            ], 42, Su)
          ], 6)) : P("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ru = /* @__PURE__ */ Y(Bu, [["__scopeId", "data-v-6d1ecd98"]]), He = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Re = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Lu = 6;
function ms(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Du = (e) => {
  const t = ms(e, He.lineChars), n = Math.max(He.minWidth, Math.max(...t.map((s) => s.length)) * He.charWidth + He.padX * 2);
  return { name: e, lines: t, line: He.line, padY: He.padY, width: n, height: t.length * He.line + He.padY * 2 };
};
function Iu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (i) => {
    a.set(i, "open"), t.forEach((r, l) => {
      if (r[0] !== i) return;
      const u = a.get(r[1]);
      u === "open" ? s.add(l) : u || o(r[1]);
    }), a.set(i, "done");
  };
  return [...n, ...e].forEach((i) => a.has(i) || o(i)), s;
}
function ju(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, i]) => {
      n.get(i) < n.get(o) + 1 && (n.set(i, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Nu(e, t, n) {
  const s = [];
  e.forEach((i) => {
    var r;
    return (s[r = n.get(i)] || (s[r] = [])).push(i);
  });
  const a = () => new Map(s.flatMap((i) => i.map((r, l) => [r, l]))), o = (i, r) => {
    const l = a(), u = (f) => {
      const k = r(f).map((_) => l.get(_));
      return k.length ? k.reduce((_, A) => _ + A, 0) / k.length : l.get(f);
    };
    return [...i].sort((f, k) => u(f) - u(k));
  };
  for (let i = 0; i < Lu; i++) {
    const r = i % 2 === 0, l = s.map((u, f) => f);
    (r ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const f = (k) => t.filter((_) => _[r ? 1 : 0] === k).map((_) => _[r ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
function Pu(e, t) {
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
function qu(e) {
  const t = [...new Set(e.flatMap(([q, C]) => [q, C]))], n = new Set(e.map(([, q]) => q)), s = t.filter((q) => !n.has(q)), a = Iu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((q, C) => !a.has(C)), i = ju(t, o), r = Nu(t, o, i), l = new Map(t.map((q) => [q, Du(q)])), u = r.map((q) => q.reduce((C, L) => C + l.get(L).width, 0) + Be.across * (q.length - 1)), f = Math.max(...u) + Be.margin * 2, k = Fu(e, i, r.length), _ = /* @__PURE__ */ new Map();
  let A = Be.margin;
  r.forEach((q, C) => {
    let L = (f - u[C]) / 2;
    const v = Math.max(...q.map((p) => l.get(p).height));
    q.forEach((p) => {
      const b = l.get(p);
      _.set(p, { ...b, x: L, y: A + (v - b.height) / 2 }), L += b.width + Be.across;
    }), A += v + (k[C] ?? Be.down);
  });
  const W = e.map(([q, C, L], v) => ({ from: q, to: C, label: L || "", back: a.has(v) || i.get(C) <= i.get(q) }));
  Pu(W, _);
  const y = W.map((q) => Hu(q, _.get(q.from), _.get(q.to))), w = [..._.values()], E = Gu(y, w), N = Math.max(A - Be.down, ...E.filter((q) => q.label).map((q) => q.label.y + q.label.height));
  return { width: Math.max(f - Be.margin, ...E.filter((q) => q.label).map((q) => q.label.x + q.label.width)) + Be.margin, height: N + Be.margin, nodes: w, arrows: E };
}
const Wu = (e) => e ? ms(e, Re.lineChars).length * Re.line + Re.pad * 2 : 0;
function Fu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, i]) => {
    const [r, l] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    l > r && (s[r + Math.floor((l - r - 1) / 2)] += Wu(i) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function Hu(e, t, n) {
  const s = e.label ? ms(e.label, Re.lineChars) : [], a = s.length ? Math.max(...s.map((_) => _.length)) * Re.charWidth + Re.pad * 2 : 0, o = s.length * Re.line + (s.length ? Re.pad * 2 : 0), i = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - r) / 2, k = [{ x: i, y: r }, { x: i, y: r + f }, { x: l, y: u - f }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: k, path: `M${i} ${r} C${i} ${r + f} ${l} ${u - f} ${l} ${u}` };
}
const Uu = ([e, t, n, s], a) => {
  const o = 1 - a, i = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: i("x"), y: i("y") };
}, zu = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Vu = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Re.line);
function Gu(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: i }) => ({ x: s, y: a, width: o, height: i }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const f = Uu(s.curve, l);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, r = Vu.flatMap((l) => zu.map((u) => a(u, l))).find((l) => !n.some((u) => zs(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => zs(r, l)); ) r.y += Re.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: Re.line, pad: Re.pad } };
  });
}
const zs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Ku = { class: "flowchart-tools" }, Yu = ["width", "height", "viewBox", "aria-label"], Ju = ["d"], Zu = ["x", "y", "width", "height"], Qu = ["x", "y"], Xu = ["x", "dy"], ed = {
  key: 0,
  class: "flowchart-label"
}, td = ["x", "y", "width", "height"], nd = ["x", "y"], sd = ["x", "dy"], ad = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(() => qu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, i = F(null), r = F({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var E;
      const y = (E = i.value) == null ? void 0 : E.getBoundingClientRect();
      if (!(y != null && y.width)) return;
      const w = Math.min(y.width / a.value.width, y.height / a.value.height, 1.5);
      r.value = { zoom: w, x: (y.width - a.value.width * w) / 2, y: (y.height - a.value.height * w) / 2 };
    }
    function f(y, w, E) {
      const { zoom: N, x: Q, y: q } = r.value, C = Math.min(o.most, Math.max(o.least, N * y));
      r.value = { zoom: C, x: w - (w - Q) * C / N, y: E - (E - q) * C / N };
    }
    function k(y) {
      const w = i.value.getBoundingClientRect();
      f(y, w.width / 2, w.height / 2);
    }
    function _(y) {
      const w = i.value.getBoundingClientRect();
      y.ctrlKey || y.metaKey ? f(y.deltaY < 0 ? o.step : 1 / o.step, y.clientX - w.left, y.clientY - w.top) : r.value = { ...r.value, x: r.value.x - y.deltaX, y: r.value.y - y.deltaY };
    }
    function A(y) {
      var w, E, N;
      y.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), l = { x: y.clientX - r.value.x, y: y.clientY - r.value.y }, (N = (E = i.value).setPointerCapture) == null || N.call(E, y.pointerId);
    }
    function W(y) {
      l && (r.value = { ...r.value, x: y.clientX - l.x, y: y.clientY - l.y });
    }
    return je(u), (y, w) => (c(), K(Ru, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (E) => s("close"))
    }, {
      default: U(() => [
        g("div", Ku, [
          H(ye, {
            small: "",
            onClick: w[0] || (w[0] = (E) => k(o.step))
          }, {
            default: U(() => [...w[5] || (w[5] = [
              ge("Zoom in", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            small: "",
            onClick: w[1] || (w[1] = (E) => k(1 / o.step))
          }, {
            default: U(() => [...w[6] || (w[6] = [
              ge("Zoom out", -1)
            ])]),
            _: 1
          }),
          H(ye, {
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
          onPointerup: w[2] || (w[2] = (E) => xs(l) ? l.value = null : l = null),
          onPointercancel: w[3] || (w[3] = (E) => xs(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: $e({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
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
            (c(!0), h(J, null, re(a.value.arrows, (E, N) => (c(), h("path", {
              key: `arrow-${N}`,
              class: "flowchart-arrow",
              d: E.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Ju))), 128)),
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
              }, null, 8, Zu),
              g("text", {
                x: E.x + E.width / 2,
                y: E.y + E.padY + E.line / 2
              }, [
                (c(!0), h(J, null, re(E.lines, (N, Q) => (c(), h("tspan", {
                  key: Q,
                  x: E.x + E.width / 2,
                  dy: Q ? E.line : 0
                }, M(N), 9, Xu))), 128))
              ], 8, Qu)
            ]))), 128)),
            (c(!0), h(J, null, re(a.value.arrows, (E, N) => (c(), h(J, {
              key: `label-${N}`
            }, [
              E.label ? (c(), h("g", ed, [
                g("rect", {
                  x: E.label.x,
                  y: E.label.y,
                  width: E.label.width,
                  height: E.label.height,
                  rx: "4"
                }, null, 8, td),
                g("text", {
                  x: E.label.x + E.label.width / 2,
                  y: E.label.y + E.label.pad + E.label.line / 2
                }, [
                  (c(!0), h(J, null, re(E.label.lines, (Q, q) => (c(), h("tspan", {
                    key: q,
                    x: E.label.x + E.label.width / 2,
                    dy: q ? E.label.line : 0
                  }, M(Q), 9, sd))), 128))
                ], 8, nd)
              ])) : P("", !0)
            ], 64))), 128))
          ], 12, Yu))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, od = /* @__PURE__ */ Y(ad, [["__scopeId", "data-v-51d24cfe"]]), rd = ["title", "aria-label"], id = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, ld = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, cd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = D(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: X(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", id, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", ld)) : P("", !0)
      ]))
    ], 10, rd));
  }
}, ud = /* @__PURE__ */ Y(cd, [["__scopeId", "data-v-6dc92808"]]), dd = "img,pre,table";
function hd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function fd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function pd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(dd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = hd(fd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function md(e, t) {
  let n = null;
  const s = () => e.value && pd(e.value);
  je(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const gd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function vd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const yd = ["data-from", "data-ref"], wd = { class: "message-body" }, kd = ["innerHTML"], bd = ["innerHTML"], xd = {
  class: "message-faces",
  "data-message-faces": ""
}, $d = ["title", "data-face", "onClick"], Md = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, _d = ["title", "data-reaction", "onClick"], Sd = {
  key: 0,
  class: "message-reaction-count"
}, Ed = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Ad = ["href", "title"], Cd = ["src", "alt"], Od = ["href"], Td = { class: "message-foot" }, Bd = { class: "message-time" }, Rd = 1500, Ld = "An earlier message", Dd = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = F(!1), o = F(null), i = D(() => ["user", "comment"].includes(n.message.type)), r = D(() => i.value && !n.message.read_at && !n.message.local);
    async function l() {
      var L;
      await ((L = navigator.clipboard) == null ? void 0 : L.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Rd);
    }
    const u = D(() => Yn(n.message.text ?? "", { env: "" })), f = D(() => JSON.parse(n.message.flowchart_edges || "[]")), k = F(!1), _ = D(() => Yn(n.quote || Ld, { env: "" }));
    function A() {
      const L = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      L ? L.scrollIntoView({ block: "center", behavior: "smooth" }) : pt(`messages:${n.message.parent_id}`);
    }
    md(o, () => `${n.message.text} ${n.quote}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, y = (L) => `/api/files/message/${n.message.id}/${encodeURIComponent(L)}`, w = D(() => JSON.parse(n.message.captions || "{}")), E = D(() => (n.message.files ?? []).map((L) => ({ name: L, address: y(L), isImage: W.test(L), title: w.value[L] || L }))), N = D(() => Ta(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), Q = F(!1), q = D(() => vd(n.message.reactions));
    function C(L) {
      Q.value = !1, s("react", n.message, L);
    }
    return (L, v) => (c(), h("article", {
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": i.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", wd, [
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
          }, null, 8, kd)) : P("", !0),
          g("div", { innerHTML: u.value }, null, 8, bd),
          f.value.length ? (c(), h(J, { key: 1 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: v[0] || (v[0] = (p) => k.value = !0)
            }, "Open the flowchart"),
            k.value ? (c(), K(od, {
              key: 0,
              title: e.message.text,
              edges: f.value,
              onClose: v[1] || (v[1] = (p) => k.value = !1)
            }, null, 8, ["title", "edges"])) : P("", !0)
          ], 64)) : P("", !0)
        ], 512),
        g("div", {
          class: X(["message-tools", { picking: Q.value }]),
          "data-message-tools": ""
        }, [
          Q.value ? (c(), h(J, { key: 0 }, [
            g("div", xd, [
              (c(!0), h(J, null, re(G(gd), (p) => (c(), h("button", {
                key: p,
                type: "button",
                class: "message-face",
                title: `React ${p}`,
                "data-face": p,
                onClick: (b) => C(p)
              }, M(p), 9, $d))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: v[3] || (v[3] = (p) => Q.value = !1)
            }, [
              H(Ee, {
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
      q.value.length ? (c(), h("div", Md, [
        (c(!0), h(J, null, re(q.value, (p) => (c(), h("button", {
          key: p.emoji,
          type: "button",
          class: X(["message-reaction", { mine: p.mine }]),
          title: p.title,
          "data-reaction": p.emoji,
          onClick: (b) => s("react", e.message, p.emoji)
        }, [
          ge(M(p.emoji) + " ", 1),
          p.count > 1 ? (c(), h("span", Sd, M(p.count), 1)) : P("", !0)
        ], 10, _d))), 128))
      ])) : P("", !0),
      E.value.length ? (c(), h("div", Ed, [
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
            }, null, 8, Cd)
          ], 8, Ad)) : (c(), h("a", {
            key: 1,
            href: p.address,
            target: "_blank",
            class: "message-file"
          }, M(p.name), 9, Od))
        ], 64))), 128))
      ])) : P("", !0),
      g("div", Td, [
        g("time", Bd, M(N.value), 1),
        i.value ? (c(), K(ud, {
          key: 0,
          message: e.message
        }, null, 8, ["message"])) : P("", !0)
      ])
    ], 8, yd));
  }
}, og = /* @__PURE__ */ Y(Dd, [["__scopeId", "data-v-204d3dec"]]), Vs = {
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
}, Id = ["innerHTML"], jd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = D(() => Vs[t.name] || Vs.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Id));
  }
}, St = /* @__PURE__ */ Y(jd, [["__scopeId", "data-v-beb5935c"]]), Nd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      H(St, { name: "fold" })
    ], 2));
  }
}, eo = /* @__PURE__ */ Y(Nd, [["__scopeId", "data-v-d03899bb"]]), Pd = ["aria-checked", "aria-haspopup", "onClick"], qd = {
  key: 0,
  class: "segmented-dot"
}, Wd = {
  key: 1,
  class: "segmented-count"
}, Fd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = da();
    return (a, o) => {
      const i = jo("tip");
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
          r.dot ? (c(), h("span", qd)) : P("", !0),
          ge(" " + M(r.label) + " ", 1),
          r.count !== void 0 ? (c(), h("em", Wd, M(r.count), 1)) : P("", !0)
        ], 10, Pd)), [
          [i, r.tip || r.title, `${G(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Zn = /* @__PURE__ */ Y(Fd, [["__scopeId", "data-v-ca953072"]]), Gs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Hd = {
  key: 1,
  class: "text-field-label"
}, Ud = {
  key: 2,
  class: "text-field-end"
}, zd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ qn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Pn(e, "modelValue"), s = fa(), a = "onUpdate:modelValue" in (((f = No()) == null ? void 0 : f.vnode.props) || {}), o = D(() => a ? n.value : s.value), i = (k) => a && (n.value = k.target.value), r = D(
      () => Object.fromEntries(Object.entries(s).filter(([k]) => k !== "class" && k !== "style" && k !== "value"))
    ), l = D(() => Object.fromEntries(Object.entries(s).filter(([k]) => k !== "value"))), u = F(null);
    return t({ focus: () => u.value && u.value.focus() }), (k, _) => e.label || e.icon || k.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: k.$slots.end }, G(s).class]),
      style: $e(G(s).style)
    }, [
      e.icon ? (c(), K(Ee, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : P("", !0),
      e.label ? (c(), h("span", Hd, M(e.label), 1)) : P("", !0),
      $t(g("input", dt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: i }), null, 16), [
        [G(Gs), o.value]
      ]),
      k.$slots.end ? (c(), h("span", Ud, [
        be(k.$slots, "end", {}, void 0, !0)
      ])) : P("", !0)
    ], 6)) : $t((c(), h("input", dt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: i }), null, 16)), [
      [G(Gs), o.value]
    ]);
  }
}), Vd = /* @__PURE__ */ Y(zd, [["__scopeId", "data-v-d9c38ca8"]]);
function Gd(e, t, { incremental: n = !1 } = {}) {
  const s = va(), a = F([]), o = F(""), i = F(!1), r = F(""), l = F(null);
  async function u(y) {
    const w = await s.read(`${e} --before-id ${y + 1} --limit 1`);
    if (!w.ok) return A();
    const E = w.value.rows.find((N) => N.id === y);
    a.value = E ? a.value.map((N) => N.id === y ? E : N) : a.value.filter((N) => N.id !== y);
  }
  async function f(y) {
    if (n && String((y == null ? void 0 : y.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((q) => q.id !== y.row_id));
    if (n && (y != null && y.row_id) && !String(y.event ?? "").endsWith(".create") && a.value.some((q) => q.id === y.row_id)) return u(y.row_id);
    if (!(n && a.value.length && String((y == null ? void 0 : y.event) ?? "").endsWith(".create"))) return A();
    const E = Math.max(...a.value.map((q) => q.id)), N = await s.read(`${e} --after-id ${E}`);
    if (!N.ok) return A();
    const Q = new Set(a.value.map((q) => q.id));
    a.value = [...N.value.rows.filter((q) => !Q.has(q.id)), ...a.value];
  }
  async function k() {
    if (!a.value.length) return !1;
    const y = Math.min(...a.value.map((N) => N.id)), w = await s.read(`${e} --before-id ${y}`);
    if (!w.ok || !w.value.rows.length) return !1;
    const E = new Set(a.value.map((N) => N.id));
    return a.value = [...a.value, ...w.value.rows.filter((N) => !E.has(N.id))], !0;
  }
  let _ = 0;
  async function A() {
    const y = ++_, w = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (y !== _) return;
    const E = w.ok ? s.shared ? [w.value] : w.value.rows : [], N = E.length ? Math.min(...E.map((Q) => Q.id)) : 0;
    a.value = n && w.ok && N ? [...a.value.filter((Q) => Q.id > Math.max(...E.map((q) => q.id))), ...E, ...a.value.filter((Q) => Q.id < N)] : E, o.value = w.ok ? "" : w.error, i.value = !0;
  }
  async function W(y) {
    const w = await s.run(y);
    return r.value = w.ok ? "" : w.error, l.value = w.ok ? w.value : null, await A(), w;
  }
  return s.follow(t, f), A(), { rows: a, failure: o, loaded: i, load: A, older: k, act: W, actionFailure: r, answer: l, context: s };
}
const Kd = { class: "title" }, Yd = { class: "state" }, Jd = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Gd(t.line, t.events);
    return (o, i) => (c(), K(Rr, {
      rows: G(n),
      failure: G(s),
      loaded: G(a),
      empty: e.empty
    }, {
      default: U(({ row: r }) => [
        g("span", Kd, M(r.title), 1),
        g("span", Yd, M(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, rg = /* @__PURE__ */ Y(Jd, [["__scopeId", "data-v-a69084cd"]]), Zd = ["data-tip", "aria-label"], Qd = {
  key: 0,
  class: "mact-word"
}, Xd = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      H(St, { name: "open" }),
      e.open ? (c(), h("span", Qd, M(e.label), 1)) : P("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, Zd));
  }
}, eh = /* @__PURE__ */ Y(Xd, [["__scopeId", "data-v-3b292e09"]]), Mn = F(Date.now() / 1e3);
let Ks = 0, Pt = 0;
function th() {
  return Pt || (Mn.value = Date.now() / 1e3, Ks = setInterval(() => Mn.value = Date.now() / 1e3, 1e3)), Pt += 1, pa() && ma(() => {
    Pt -= 1, Pt || clearInterval(Ks);
  }), Mn;
}
const nh = 120, _n = 280, sh = 160, ah = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function oh(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = F(t()), a = F("");
  let o = 0;
  const i = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), r = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const f = e.value, k = ++o;
    if (!f || !f.offsetWidth || ah()) {
      s.value = u;
      return;
    }
    const _ = { width: f.offsetWidth, height: f.offsetHeight };
    if (i(f, _), a.value = "leaving", await n(nh), k !== o) return;
    s.value = u, a.value = "resizing", await ln(), r(f);
    const A = { width: f.offsetWidth, height: f.offsetHeight };
    i(f, _), f.offsetWidth, f.style.transition = `width ${_n}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${_n}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, i(f, A), await n(_n), k === o && (r(f), a.value = "entering", await n(sh), k === o && (a.value = ""));
  }
  return ke(t, (u) => l(u)), rs(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const rh = ["title", "data-figure-mark", "data-folded", "data-open"], ih = {
  key: 2,
  class: "worker"
}, lh = { class: "head" }, ch = { key: 0 }, uh = {
  key: 3,
  class: "status"
}, dh = {
  key: 0,
  class: "figure"
}, hh = {
  key: 1,
  class: "ran-for"
}, fh = { key: 2 }, ph = { key: 3 }, mh = {
  key: 4,
  class: "news"
}, gh = {
  key: 5,
  class: "spin",
  "aria-label": "Still running"
}, vh = {
  key: 7,
  class: "settled"
}, yh = {
  key: 1,
  class: "bar"
}, wh = {
  key: 3,
  class: "detail body"
}, kh = {
  key: 0,
  class: "body-label"
}, bh = ["title"], xh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = fa(), s = ["onClick", "onAct"], a = D(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = F(!1), i = D(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = D(() => t.open !== void 0), l = D(() => r.value || i.value), u = D(() => r.value ? t.open : o.value), f = D(() => r.value ? !t.open : i.value && !o.value), k = D(() => !!(t.mark.action && n.onAct)), _ = D(() => l.value || k.value || !!n.onClick), A = F(null), W = F(null), { folded: y, phase: w } = oh(A, () => f.value);
    function E(le) {
      var pe, _e;
      if (!(le.target !== A.value && !W.value.contains(le.target))) {
        if (r.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, le);
        if (i.value) return void (o.value = !o.value);
        (_e = n.onAct || n.onClick) == null || _e(le);
      }
    }
    const N = (le) => n.onAct(le), Q = ["failed", "unfinished"], q = D(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Q.includes(t.mark.state) ? "danger" : "good" : ""), C = D(() => t.mark.color ? t.mark.color : q.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : q.value ? `var(--tone-${q.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), L = D(() => C.value || "var(--tone-work)"), v = D(() => !t.mark.ending && !t.mark.ended && q.value !== "stopped"), p = th(), b = D(
      () => t.mark.began_at && v.value && !t.mark.figure && !t.mark.counting ? Fi(p.value - t.mark.began_at) : ""
    ), $ = D(() => {
      const { started: le, ended: pe } = t.mark;
      return le ? pe ? `ran ${Rs(pe - le, !0)}` : Rs(p.value - le, !0) : b.value;
    }), m = ["bad", "danger", "warn"], d = D(() => m.includes(q.value) || t.mark.asks ? "attention" : v.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], O = D(() => S.includes(q.value)), j = D(() => d.value === "process" ? "running" : O.value ? "cross" : q.value === "stopped" ? "stopped" : q.value === "good" ? "tick" : ""), ae = D(
      () => !!(t.mark.figure || $.value || t.mark.docked || t.mark.stopping || j.value || t.mark.settled || t.mark.news)
    ), oe = D(() => [t.mark.title, t.mark.time ? Ta(t.mark.time) : ""].filter(Boolean).join(" · ")), de = D(() => ({
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
          e.mark.worker ? (c(), h("span", ih, M(e.mark.worker), 1)) : P("", !0),
          g("span", lh, [
            H(ct, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", ch, M(e.mark.name), 1)) : P("", !0),
            l.value ? (c(), K(eo, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : P("", !0)
          ]),
          ae.value ? (c(), h("span", uh, [
            e.mark.figure ? (c(), h("span", dh, M(e.mark.figure), 1)) : P("", !0),
            $.value ? (c(), h("span", hh, M($.value), 1)) : P("", !0),
            e.mark.docked ? (c(), h("span", fh, "In the dock")) : P("", !0),
            e.mark.stopping ? (c(), h("span", ph, "Stopping")) : P("", !0),
            e.mark.news ? (c(), h("span", mh, M(e.mark.news), 1)) : P("", !0),
            j.value === "running" ? (c(), h("span", gh)) : j.value ? (c(), K(St, {
              key: 6,
              class: X(["sign", j.value]),
              name: j.value
            }, null, 8, ["class", "name"])) : P("", !0),
            e.mark.settled ? (c(), h("span", vh, M(e.mark.settled), 1)) : P("", !0)
          ])) : P("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      k.value ? (c(), K(eh, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: Me(N, ["stop"])
      }, null, 8, ["label", "open"])) : P("", !0),
      (e.mark.figure || e.mark.counting) && v.value ? (c(), h("span", yh, [
        g("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: L.value })
        }, null, 4)
      ])) : P("", !0),
      e.mark.detail && !G(y) ? (c(), K(ct, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      e.mark.body && !G(y) ? (c(), h("div", wh, [
        e.mark.bodyLabel ? (c(), h("p", kh, M(e.mark.bodyLabel), 1)) : P("", !0),
        H(ct, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : P("", !0),
      e.mark.command && !G(y) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, M(e.mark.command), 9, bh)) : P("", !0),
      e.mark.card ? (c(), K(ct, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : P("", !0),
      be(le.$slots, "default", {
        shown: !G(y)
      }, void 0, !0)
    ], 16, rh));
  }
}), $h = /* @__PURE__ */ Y(xh, [["__scopeId", "data-v-de840831"]]), Mh = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function to(e) {
  var n;
  const t = Mh[e] || ((n = fn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const _h = (e) => to(String(e).split(":")[0]), no = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Sh = { passed: "good", failed: "danger", warned: "warn", running: "" }, Ys = {
  "open row": (e) => pt(`${e.target_model}:${e.target_id}`),
  "open page": (e) => _r(e.target_model, e.target_id || 0)
}, Eh = { "open row": (e) => _h(e.target_model), "open page": () => to("pages") };
function Ah(e, t) {
  const n = t || {}, s = Ys[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" && Sh[e.outcome] || "",
    label: e.text,
    // a mark with a body of its module's own keeps its lines for that body, and its cut-off first part is not a second line
    detail: n.body_url ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Eh[s](e) : "",
    handlers: s ? { onAct: () => Ys[s](e) } : {}
  };
}
const Ch = 24, Oh = 1e3, Js = 2e3, Th = 0.25, Bh = 5e3;
function Rh(e, t = Ch, n = () => !0) {
  const s = F(!1), a = F(0), o = F(!1);
  let i = 0, r = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const q = u();
    return q ? q.scrollHeight - q.scrollTop - q.clientHeight : 0;
  }, k = () => !u() || f() <= t;
  function _(q) {
    if (clearTimeout(i), !q) {
      o.value = !1, l = Date.now();
      return;
    }
    const C = Date.now() - l < Js ? Js : Oh;
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
  const w = () => !!u() && f() <= u().clientHeight * Th;
  function E() {
    clearTimeout(r), w() && (r = setTimeout(() => s.value && w() && n() && W(!0), Bh));
  }
  function N() {
    k() ? A() : y();
  }
  function Q(q = 1, C = !1) {
    s.value ? a.value += Math.max(0, q) : W(C);
  }
  return pa() && ma(() => [i, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: k, follow: A, toBottom: W, left: y, scrolled: N, arrived: Q };
}
const Lh = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = F(null), { away: o, scrolled: i, arrived: r, toBottom: l } = Rh(a);
    ke(
      () => n.lines.length,
      () => ln(() => r()),
      { immediate: !0 }
    );
    function u(f) {
      i(), s("older", f.target);
    }
    return (f, k) => (c(), h("pre", {
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
        onClick: k[0] || (k[0] = (_) => G(l)(!0))
      }, "Follow")) : P("", !0)
    ], 544));
  }
}, Dh = /* @__PURE__ */ Y(Lh, [["__scopeId", "data-v-09394a20"]]), Ih = 1e4;
class jh {
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
    return this.heardAt !== null && t - this.heardAt > Ih;
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
const Nh = {
  key: 0,
  class: "frame-note"
}, Ph = {
  key: 0,
  class: "frame-note"
}, qh = ["src", "title"], Wh = 1e3, Fh = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = va(), s = F(null), a = F(!1), o = F(!1);
    let i = null, r = 0;
    return je(() => {
      i = new jh(s.value, n), i.start(), r = setInterval(() => {
        a.value = i.silent();
      }, Wh);
    }), Ae(() => {
      i == null || i.stop(), clearInterval(r);
    }), (l, u) => o.value ? (c(), h("p", Nh, "This window was closed because it stopped answering.")) : (c(), h(J, { key: 1 }, [
      a.value ? (c(), h("div", Ph, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        H(ye, {
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
      }, null, 8, qh)
    ], 64));
  }
}, Hh = /* @__PURE__ */ Y(Fh, [["__scopeId", "data-v-32a49046"]]), Uh = 0, zh = "/api/lines", Vh = "/api/line";
class Gh {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Uh));
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
        const n = await De.raw(zh, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await De.raw(Vh, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Kh = new Gh();
class Yh {
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
      n.patterns.some((s) => so(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function so(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Jh = { 1: "refused", 2: "usage", 3: "fault" }, Zh = 100, Qh = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Xh({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: i, open: r, options: l = F({}), declared: u = [], readOnly: f = !1, shared: k = null }) {
  const _ = /* @__PURE__ */ new Map(), A = new AbortController(), W = (y) => {
    const w = _.get(y);
    if (w && performance.now() - w.at < Zh) return w.answer;
    const E = zt(e, y, t, A.signal);
    return _.set(y, { answer: E, at: performance.now() }), E;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    visible: D(() => s()),
    permissions: a,
    readOnly: f,
    shared: k,
    read: W,
    run: (y) => zt(e, y, t, A.signal),
    upload: (y) => tf(y, A.signal),
    cancel: () => A.abort(),
    follow: (y, w) => i.follow(e, y.filter((E) => o.some((N) => so(N, E))), w, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (y) => D(() => {
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
function ef(e) {
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
    const a = await Kh.add({ window: e, line: Array.isArray(t) ? t : nf(t), environment: n }, s);
    return s != null && s.aborted ? en : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Jh[a.code] || "fault", error: ef(a.error) };
  } catch (a) {
    return s != null && s.aborted ? en : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function tf(e, t = void 0) {
  try {
    const n = await De.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? en : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? en : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function nf(e) {
  return [...e.matchAll(Qh)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function sf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const af = {
  class: "allowance-prompt",
  role: "dialog"
}, of = { class: "allowance-prompt-text" }, rf = { class: "allowance-prompt-buttons" }, lf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", af, [
      g("p", of, M(G(sf)(e.request)), 1),
      g("div", rf, [
        H(ye, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            ge("Allow", -1)
          ])]),
          _: 1
        }),
        H(ye, {
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
}, cf = /* @__PURE__ */ Y(lf, [["__scopeId", "data-v-102dc765"]]), Sn = {
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
}, uf = ["data-window", "data-agent"], df = {
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
    function i() {
      a.value = "", o.value++;
    }
    const r = Xh({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: D(() => n.options),
      declared: n.declared,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, k) => s("open", f, k)
    });
    Po(tt, r), ke(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ae(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), qo((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const l = () => as(n.component), u = () => {
      var f, k;
      return ((k = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : k.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, k) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      u() ? (c(), K(cf, {
        key: 0,
        request: u(),
        onAnswer: k[0] || (k[0] = (_) => e.prompts.answer(_))
      }, null, 8, ["request"])) : P("", !0),
      e.unavailableReason ? (c(), K(Sn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), K(Sn, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: i
      }, null, 8, ["name", "reason"])) : e.component ? (c(), K(l, { key: o.value })) : (c(), K(Sn, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: k[1] || (k[1] = (_) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, uf));
  }
}, ao = /* @__PURE__ */ Y(df, [["__scopeId", "data-v-590b4583"]]), hf = {
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
    const t = e, n = { render: () => as(Hh, { src: t.entry.entry_url }) };
    return (s, a) => (c(), K(ao, {
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
}, Qn = "journal.stale-build-reload", ff = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function pf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Qn) === e.message) return !1;
    t.setItem(Qn, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function mf(e = window.sessionStorage) {
  try {
    e.removeItem(Qn);
  } catch {
    return;
  }
}
const gf = ["data-window"], vf = {
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
    const t = e, n = rn(null), s = F("");
    return ke(
      () => t.entry.entry_url,
      async (a) => {
        if (n.value = null, s.value = "", !t.entry.unavailable_reason)
          try {
            n.value = (await import(
              /* @vite-ignore */
              a
            )).default, mf();
          } catch (o) {
            if (ff(o) && pf(o)) return;
            s.value = `This window's file could not be loaded: ${o.message}`;
          }
      },
      { immediate: !0 }
    ), (a, o) => !n.value && !s.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      H(At, { shape: "cards" })
    ], 8, gf)) : (c(), K(ao, {
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
}, yf = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new Yh(), s = ((r = ft(tt, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = D(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), i = D(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (l, u) => i.value ? (c(), K(vf, {
      key: 0,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), K(hf, {
      key: 1,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, wf = { class: "mark-more-inner" }, kf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, bf = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, xf = {
  key: 3,
  class: "mark-lines"
}, $f = "process", Zs = "task", Mf = 2e3, _f = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = ft(tt), s = D(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = D(() => no.has(t.mark.variant) && t.mark.detail || ""), o = D(() => t.mark.target_model === Zs ? t.mark.target_id : 0), i = F([]), r = F(!1), l = F(""), u = D(() => t.mark.target_model === $f && !!t.mark.target_id);
    async function f() {
      const A = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, l.value = A.ok ? "" : A.error, A.ok && (i.value = A.value.lines);
    }
    let k = null;
    const _ = () => clearInterval(k);
    return ke(() => t.shown && u.value, (A) => {
      _(), A && (f(), t.mark.ended_at || (k = setInterval(f, Mf)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (A) => A && t.shown && u.value && (_(), f())), Ae(_), (A, W) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: W[1] || (W[1] = Me(() => {
      }, ["stop"]))
    }, [
      g("div", wf, [
        e.declaration.body_url ? (c(), K(yf, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(J, { key: 1 }, [
          a.value ? (c(), h(J, { key: 0 }, [
            W[2] || (W[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", kf, M(a.value), 1)
          ], 64)) : P("", !0),
          u.value && l.value ? (c(), h("p", bf, M(l.value), 1)) : u.value && r.value ? (c(), h(J, { key: 2 }, [
            W[3] || (W[3] = g("p", { class: "mark-label" }, "Output", -1)),
            H(Dh, {
              class: "mark-terminal",
              lines: i.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", xf, M(s.value.join(`
`)), 1)) : P("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: W[0] || (W[0] = Me((y) => G(pt)(`${Zs}:${o.value}`), ["stop"]))
          }, "Open task " + M(o.value) + " and its proofs", 1)) : P("", !0)
        ], 64))
      ])
    ], 2));
  }
}, oo = /* @__PURE__ */ Y(_f, [["__scopeId", "data-v-51f69bf1"]]), Sf = (e) => `show-${e}`, ig = (e, t, n) => e.filter((s) => {
  var a;
  return n(Sf((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Ef = "messages.chat", Af = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), Xn = (e, t, n) => zt(Ef, Af(e, t), n), Cf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Of = ["title", "aria-label", "onClick"], Tf = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Bf = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = D(() => Cf(t.buttons, t.allowedRuns).filter((i) => {
      var r;
      return !((r = i.variants) != null && r.length) || i.variants.includes(t.mark.variant);
    })), s = F(""), a = ft(tt);
    async function o(i) {
      const r = await Xn(i, t.mark, a.environment);
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
        H(St, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Of))), 128)),
      s.value ? (c(), h("span", Tf, M(s.value), 1)) : P("", !0)
    ], 64));
  }
}, Rf = /* @__PURE__ */ Y(Bf, [["__scopeId", "data-v-0dfda102"]]);
function ro(e, t) {
  const n = rn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((i) => [i.type, i])), a = async () => {
    try {
      return (await (await De.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const io = ro("/api/marks", "marks"), lg = io.fetchAll, Lf = io.find, Df = ["data-ref"], If = { class: "mark-row" }, jf = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = e, s = D(() => Lf(n.mark.type)), a = D(() => Ah(n.mark, s.value)), o = D(() => {
      var r;
      return !!(n.mark.lines || n.mark.detail && no.has(n.mark.variant) || t.has(n.mark.target_model) || (r = s.value) != null && r.body_url);
    }), i = F(!1);
    return (r, l) => {
      var u, f;
      return c(), h("div", {
        class: X(["thread-turn", "card", { "full-width": (u = s.value) == null ? void 0 : u.full_width }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", If, [
          H($h, dt({
            mark: a.value,
            open: o.value ? i.value : void 0
          }, Wo(a.value.handlers), {
            onClick: l[0] || (l[0] = (k) => i.value = !i.value)
          }), Fo({ _: 2 }, [
            o.value ? {
              name: "default",
              fn: U(({ shown: k }) => [
                H(oo, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: k
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          H(Rf, {
            buttons: (f = s.value) == null ? void 0 : f.buttons,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Df);
    };
  }
}, cg = /* @__PURE__ */ Y(jf, [["__scopeId", "data-v-a8e93858"]]);
function Nf(e) {
  const t = F(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return je(() => n.observe(e.value)), rs(() => n.disconnect()), t;
}
const Pf = { class: "chat-dock-fold" }, qf = ["aria-label"], Wf = { class: "chat-dock-head" }, Ff = { class: "chat-dock-inner" }, Hf = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = F(null), s = F(null), a = Nf(s);
    return t({ card: n }), (o, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted }])
    }, [
      g("div", Pf, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          be(o.$slots, "edge"),
          g("header", Wf, [
            be(o.$slots, "head")
          ]),
          g("div", {
            class: X(["chat-dock-body", { folded: e.folded }])
          }, [
            g("div", Ff, [
              g("div", {
                class: "chat-dock-grow",
                style: $e(G(a) === null ? null : { height: `${G(a)}px` })
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
        ], 10, qf)
      ])
    ], 2));
  }
}, Uf = /* @__PURE__ */ Y(Hf, [["__scopeId", "data-v-e27493a6"]]), zf = {
  class: "dock-leave",
  "aria-hidden": "true"
}, En = 5, Vf = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(En, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${En}s`, animationDelay: `${(n - En).toFixed(2)}s` };
    return (a, o) => (c(), h("span", zf, [
      g("i", { style: s })
    ]));
  }
}, Gf = /* @__PURE__ */ Y(Vf, [["__scopeId", "data-v-d0c4b012"]]), lo = ro("/api/docks", "docks"), ug = lo.fetchAll, es = lo.find, Kf = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Qs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s });
function Yf(e, t) {
  var n;
  return [
    ...e.leaves_at && !e.kept ? [Qs("keep", "pin", "Keep", `dock keep ${e.id}`)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || fn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Qs("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const Jf = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Kf(e, t),
  buttons: Yf(e, t)
}), Zf = { class: "dock-title" }, Qf = ["aria-expanded", "title"], Xf = { class: "chat-dock-acts dock-acts" }, e1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, t1 = {
  key: 1,
  class: "dock-text"
}, n1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = D(() => es(s.item.type)), o = F(null), i = D(() => Jf(s.item, a.value)), r = ft(tt), l = F(/* @__PURE__ */ new Set()), u = F("");
    async function f(A) {
      if (A.action === "open") return pt(`${s.item.target_model}:${s.item.target_id}`);
      if (A.action !== "declared") return Xn(A, s.item, r.environment);
      l.value = /* @__PURE__ */ new Set([...l.value, A.label]), u.value = "";
      const W = await Xn(A, s.item, r.environment);
      (W == null ? void 0 : W.ok) === !1 && (l.value = new Set([...l.value].filter((y) => y !== A.label)), u.value = W.error);
    }
    const k = D(() => i.value.buttons.filter((A) => A.action !== "undock" && !l.value.has(A.label))), _ = D(() => i.value.buttons.find((A) => A.action === "undock"));
    return (A, W) => (c(), K(Uf, {
      label: i.value.title,
      folded: e.folded
    }, {
      edge: U(() => [
        e.leaving ? (c(), K(Gf, {
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
            H(Ee, {
              name: i.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            g("span", Zf, M(i.value.title), 1)
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
            onClick: W[0] || (W[0] = (N) => n("fold"))
          }, [
            H(eo, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, Qf)),
          g("span", Xf, [
            (c(!0), h(J, null, re(k.value, (N) => (c(), K(ye, {
              key: N.action + N.runs,
              small: "",
              kind: N.primary ? "primary" : "ghost",
              bordered: !N.primary,
              "data-dock-action": N.action,
              onClick: (Q) => f(N)
            }, {
              default: U(() => [
                ge(M(N.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          H(ls, {
            title: _.value.label,
            "data-dock-action": "undock",
            onClick: W[1] || (W[1] = (N) => f(_.value))
          }, null, 8, ["title"])
        ];
      }),
      default: U(() => {
        var y, w;
        return [
          u.value ? (c(), h("p", e1, M(u.value), 1)) : P("", !0),
          e.item.text && !((y = a.value) != null && y.body_url) ? (c(), h("p", t1, M(e.item.text), 1)) : P("", !0),
          (w = a.value) != null && w.body_url ? (c(), K(oo, {
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
}, Xs = /* @__PURE__ */ Y(n1, [["__scopeId", "data-v-608c189e"]]), s1 = 24, a1 = 8, dg = 420;
function hg({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= s1 && e > t ? !0 : e < t && a > a1 ? !1 : null;
}
const o1 = (e, t) => e === void 0 ? t : e, r1 = 6, i1 = 3, ea = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, co = (e) => !!(e.leaves_at && !e.kept), l1 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!co(e) || t < e.leaves_at || n.has(e.id)), c1 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => l1(s, t, n)).sort((s, a) => s.id - a.id);
function u1(e, t, n = r1) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const d1 = (e, t) => e >= i1 ? !0 : e <= 1 ? !1 : t, h1 = { class: "dock-stack" }, f1 = ["onMouseenter", "onMouseleave"], p1 = ["onMouseenter", "onMouseleave"], m1 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = F(Date.now() / 1e3), s = F(/* @__PURE__ */ new Set()), a = F(!1), o = F(!1), i = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ae(() => clearInterval(i));
    const r = D(() => c1(t.items, n.value, s.value)), l = D(() => u1(r.value.filter((w) => ea(w, es)), n.value)), u = D(() => r.value.filter((w) => !l.value.includes(w) && !ea(w, es))), f = D(() => (a.value = d1(l.value.length, a.value)) && !o.value), k = F({}), _ = (w) => o1(k.value[w.id], t.folded);
    function A(w) {
      k.value = { ...k.value, [w.id]: !_(w) };
    }
    function W(w) {
      s.value = /* @__PURE__ */ new Set([...s.value, w.id]);
    }
    function y(w) {
      s.value = new Set([...s.value].filter((E) => E !== w.id));
    }
    return (w, E) => (c(), h("div", h1, [
      (c(!0), h(J, null, re(u.value, (N) => (c(), h("div", {
        key: N.id,
        onMouseenter: (Q) => W(N),
        onMouseleave: (Q) => y(N)
      }, [
        H(Xs, {
          item: N,
          leaving: G(co)(N) && !s.value.has(N.id),
          folded: _(N),
          onFold: (Q) => A(N)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, f1))), 128)),
      (c(!0), h(J, null, re(f.value ? [] : l.value, (N) => (c(), h("div", {
        key: N.id,
        onMouseenter: (Q) => W(N),
        onMouseleave: (Q) => y(N)
      }, [
        H(Xs, {
          item: N,
          folded: _(N),
          onFold: (Q) => A(N)
        }, null, 8, ["item", "folded", "onFold"])
      ], 40, p1))), 128)),
      f.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "dock-runs-row",
        title: "Show each run as its own card",
        onClick: E[0] || (E[0] = (N) => o.value = !0)
      }, M(l.value.length) + " runs", 1)) : P("", !0)
    ]));
  }
}, fg = /* @__PURE__ */ Y(m1, [["__scopeId", "data-v-8ad7aad9"]]), bt = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Vt = (e) => Math.min(Math.max(e, 0), 1), g1 = (e) => {
  const t = Vt(e);
  return t * t * (3 - 2 * t);
}, Ze = (e, t, n) => g1((e - t) / (n - t));
function pg(e) {
  const t = Vt(e), n = Vt((t - 0.12) / 0.76) * bt.shuffles, s = Math.min(Math.floor(n), bt.shuffles - 1), a = n - s, o = Ze(a, 0.26, 0.38) * (1 - Ze(a, 0.76, 0.96)), i = Ze(a, 0.38, 0.76), r = Ze(t, 0, 0.12) * (1 - Ze(t, 0.88, 1)), l = Ze(a, 0.2, 0.34) * (1 - Ze(a, 0.84, 1)), u = Math.sin(Math.PI * Vt((a - 0.45) / 0.55)) ** 2;
  return { moved: i, across: (s + i) / bt.shuffles, lift: bt.lift * o, ready: r, weight: l, follow: u, shuffle: s, phase: a };
}
const uo = 2400, v1 = 0.05;
function mg({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, v1), i = Math.min(t + uo * o, a), r = e + i * o;
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
}, ts = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), y1 = (e) => e * e * (3 - 2 * e), tn = (e, [t, n]) => y1(ts(e, t, n)), w1 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ve = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, qt = ([e, t], n) => e + n() * (t - e);
function k1(e) {
  return w1.map(() => {
    const t = qt(Ve.speed, e), n = qt(Ve.angle, e) * Math.PI / 180, s = qt(Ve.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [qt(Ve.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const b1 = k1(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function x1(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ve.gravity * (t[2] - Ve.floor))) / Ve.gravity;
}
function gg(e, t, n = b1) {
  const s = Ke.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], i = x1(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= i + r) return null;
  const l = Math.min(a, i), u = s.from.map((f, k) => f + o.velocity[k] * l);
  return u[2] -= Ve.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - i) / r };
}
function vg(e, t) {
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
const yg = () => Array.from({ length: Ke.pogo.count }, (e, t) => Ke.pogo.bounce * (t + 1) / Ke.pogo.count), wg = { stride: 0.5 };
function ho(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: ts(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: ts(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function kg(e) {
  const { into: t, out: n } = ho(Ke.rope_swing, e);
  return 1 - tn(t, [0, 1]) * (1 - tn(n, [0, 1]));
}
function bg(e) {
  const t = Ke.rope_swing, { into: n, out: s } = ho(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return tn(n, [0, 1]) * (1 - tn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const $1 = { after: 3 }, M1 = 10, _1 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, S1 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, E1 = { weight: 19 }, A1 = {
  build: { cooldown: 180 }
}, C1 = { every: 120 }, fo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, po = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, O1 = {
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
}, Bt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: M1 }), Z = (e, t, n = {}) => Bt(e, "clip", t, n), An = (e, t, n = {}) => Bt(e, "look", t, n), ta = (e, t, n = {}) => Bt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Bt(e, "pick", t, n), ...s }), fe = (e) => Bt("nothing", "nothing", e, {}), T1 = 120, B1 = 300, Cn = (e, t) => ({ ...Z(e, t), cooldown: B1 }), R1 = 120, ee = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), L1 = () => [Z("joy", 2)], Qe = (e, t, n, s, a = {}) => ({ ...Z(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), Xe = (e) => ({ ...e, cooldown: _1[e.name] }), kt = (e) => ({ ...e, shenanigan: !0, lasts: S1[e.name] }), gs = [
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
  ...ee("messaged", { cooldown: R1 }, [Z("phone_call", 1)]),
  ...ee("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [Z("nod", 4), Z("hand_rub", 4), fe(7)]),
  ...ee("question_asked", { cooldown: 60 }, [Z("ask_sign", 9), Z("look_up", 3), fe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ee("reported", { cooldown: 90 }, [ta("read", 3), Z("nod", 1), fe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ee("read_message", { cooldown: 30 }, [ta("read", 3), fe(1)]),
  ...ee("fact_filed", { cooldown: 120 }, [Z("file_card", 3), Z("nod", 1), fe(6)]),
  ...ee("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [Z("nod", 2), fe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ee("bar_done", { holds: !0 }, L1()),
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
  ...ee("answered", { cooldown: 15 }, [An("amused", 3), fe(2)]),
  ...ee("heard", { cooldown: 30 }, [
    Z("bow", 1, { voices: ["butler"] }),
    Z("salute", 1, { voices: ["squire"] }),
    Z("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    fe(1)
  ]),
  ...ee("long_walk", { cooldown: 90 }, [Z("stumble", 3), fe(22)]),
  ...ee("card_arrived", { cooldown: 20, toward: "card" }, [Z("glance", 7), fe(13)]),
  ...ee("typing", { cooldown: 60 }, [An("reading", 1), fe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(O1).flatMap(([e, t]) => ee(`reacted:${e}`, {}, [An(t, 1)])),
  ...Object.entries(fo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ee(`agent_reacted:${n}`, {}, [Z(s, 1, { voices: [e] })])[0])),
  ...Object.entries(po).flatMap(([e, t]) => ee(`agent_reacted:${e}`, {}, [Z(t, 1)])),
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
  ...ee("held:search", { cooldown: T1 }, [Cn("search", 3), { ...Cn("binoculars", 2), when: { home: !0 } }, { ...Cn("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...ee("unit", { cooldown: A1.build.cooldown }, [ce("unit", E1.weight), fe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ee("progress_jump", { cooldown: 6 }, [Z("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ee("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...ee("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ee("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: C1.every }, ce("stand", 5)]),
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
], D1 = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), mo = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), I1 = (e) => Array.isArray(e) ? e[0] : e, j1 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function N1(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || mo(f).every(([k, _]) => n(k) >= I1(_)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = gs.filter((f) => D1(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= $1.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, l = r.filter((f) => {
    var k;
    return f.kind === "nothing" || f.name !== ((k = e.tally) == null ? void 0 : k.last);
  });
  return l.some((f) => f.kind !== "nothing") ? l : r;
}
function P1(e, t) {
  const n = N1(e);
  let s = t() * n.reduce((o, i) => o + i.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (go(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function go(e, t, n) {
  var s;
  for (const [a, o] of mo(t)) (s = e.memory) == null || s.set(a, e.now + j1(o, n));
}
function xg(e, t, n) {
  go(e, gs.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const na = {
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
}, $g = {
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
}, Mg = 120, _g = (e) => na[e] || na.idle;
[.../* @__PURE__ */ new Set([...Object.values(fo).flatMap((e) => Object.keys(e)), ...Object.keys(po)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function Sg(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Te.ahead * n ? 180 : Math.sign(s) * Te.turn;
}
const sa = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Eg(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), i = Math.floor(o / Te.sweep) % a, r = o % Te.sweep, l = Te.sweep - Te.returnSeconds, u = sa((r - l) / Te.returnSeconds), f = r <= l ? sa(r / l) : 1 - u, k = i + ((i + 1) % a - i) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + k * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const q1 = 1, W1 = (e, t, n, s, a, o = 0) => P1({ moment: "jump", high: e > q1 * t, memory: s, now: a, room: o }, n).name === "backflip", aa = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, Ag = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, Cg = { width: 24, height: 27, top: 3, units: 2 }, F1 = "[data-figure-pile]", Og = { amber: [1, 0.69, 0.125], good: aa.colours.good, bad: aa.colours.bad }, On = { phases: 4, dim: 0.25 }, Tg = (e, t, n) => e !== "amber" || (t + n) % On.phases < On.phases / 2 ? 1 : On.dim, H1 = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(gs.filter((e) => H1.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const Bg = {
  width: 84,
  belly: 13,
  blink: 4
}, oa = "[data-figure-home]", Rt = () => {
  var t;
  const e = document.querySelector(oa);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(oa)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, U1 = "[data-figure-docked-bars]", z1 = "[data-figure-chat-foot]", V1 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", G1 = "[data-figure-newest]";
function K1() {
  var s, a;
  const e = (s = Rt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(G1), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var i, r;
      return !((i = o.closest) != null && i.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !vs(o)) continue;
    const i = o.getBoundingClientRect();
    if (i.right > i.left && i.bottom > i.top) return i;
  }
  return null;
}
function vo(e, t, n = K1()) {
  if (!e || !n) return !0;
  const s = mt(e, t), a = ys(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ge.top * t.size, bottom: s.top + Ge.bottom * t.size }, i = bt.gap;
  return !ko(o, { left: n.left - i, right: n.right + i, top: n.top - i, bottom: n.bottom + i });
}
const Tn = 0.26, Y1 = 0.54, gn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Tn, travels: "stand" },
  lounge: { drop: Tn, travels: "stand" },
  composed: { drop: Tn, travels: "stand" },
  hang: { drop: Y1, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, yo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), J1 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Rg = (e, t) => (e === "sit" ? J1.has(t) : yo.has(e)) ? e : "stand", Lg = 0.25, Dg = (e, t) => yo.has(e) && gn[t].drop === 0, wo = 2, Z1 = 90, Q1 = 180, X1 = 140, ep = 280, tp = 420, np = 0.25, sp = 290, ap = 600, op = "cubic-bezier(0.2, 0.7, 0.4, 1)", rp = "cubic-bezier(0.55, 0, 0.9, 0.6)", Bn = 5;
function nn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: i = !1, sprinting: r = !1, random: l = Math.random, memory: u = null, now: f = 0, room: k = 0, pogo: _ = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Bn) return null;
  (i || r) && (o = Math.max(o, wo));
  const A = o > 1, W = Math.abs(t.x - e.x), y = W < Bn ? 0 : W / (Z1 * o) * 1e3, w = Math.min(y, A ? X1 : Q1), E = Math.abs(t.y - e.y), N = t.y < e.y, Q = N && !_ && W1(E, n, l, u, f, k), q = N ? tp + Math.min(E, 400) * np : Math.sqrt(2 * E / uo) * 1e3, C = {
    x: t.x,
    y: t.y,
    ms: E > Bn ? Q ? ap : q : 0,
    lead: Q ? sp : N ? ep : 0,
    easing: N ? op : rp,
    hopping: !0,
    clip: Q ? "backflip" : N ? "jump" : "fall"
  }, L = { x: t.x, y: t.y, ms: y + w, lead: 0, easing: "linear", ramp: w, ...A ? { clip: "run" } : {} }, v = _ ? ip(t, n) : C, p = N && !s ? [{ ...L, y: e.y }, v] : [{ ...C, x: e.x }, L];
  return { way: Math.sign(t.x - e.x) || 1, legs: p, lands: !a, pace: o, running: A };
}
const ip = (e, t) => ({ x: e.x, y: e.y, ms: Ke.pogo.frames / Ke.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), mt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - gn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, ko = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, vs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function gt() {
  var t;
  const e = (t = Rt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Wt = 0.5, ra = 20;
function Ig(e, t, n = gt()) {
  const s = mt(e, t);
  return s.left >= n.left + ra && s.right <= n.right - ra;
}
function bo(e, t, n = gt()) {
  const s = mt(e, t), a = s.right - s.left, o = ys(e), [i, r] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return i >= n.left - Wt && r <= n.right + Wt && s.top >= n.top - Wt && l <= n.bottom + Wt;
}
const sn = [0.35, 0.5, 0.65], an = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ge = { left: sn[0], right: sn.at(-1), top: an[0], bottom: an.at(-1) }, lp = 0.24;
function ys(e) {
  if (e.posture === "stand") return { left: Ge.left, right: Ge.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + lp * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ge.left, t), right: Math.max(Ge.right, t) };
}
function cp(e, { size: t }, n = gt()) {
  const s = ys(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const up = (Ge.right - Ge.left) / 2 + 0.08;
function dp(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !vs(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, i = Math.min(a.startOffset, o.length - 1);
  for (const l of [i - 1, i].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const hp = (e) => an.flatMap(
  (t) => sn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function fp(e, t, n = "") {
  if (!vo(e, t)) return sn.length * an.length;
  const s = mt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(V1)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: l }) => l.width && l.height && ko(a, l) && vs(r)).map(({ rect: r }) => r), i = (r, l) => o.some((u) => r >= u.left && r <= u.right && l >= u.top && l <= u.bottom);
  return hp(a).filter(([r, l]) => i(r, l) || dp(r, l, n)).length;
}
function pp(e, t, n) {
  const s = gt(), a = (i) => n ? Math.hypot(i.x - n.x, i.y - n.y) : 0, o = e.filter((i) => bo(i, t, s) && vo(i, t)).map((i) => ({ spot: i, covered: fp(i, t), away: a(i) }));
  return o.length ? o.reduce(
    (i, r) => r.covered < i.covered || r.covered === i.covered && r.away < i.away ? r : i
  ).spot : null;
}
const xo = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, mp = up, gp = (e, t, { size: n }, s = mp) => vp(e, xo[t], s * n, "stand");
function vp(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const jg = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ng = { turns: [-20, -10, 0, 10, 20] }, yp = 7;
function wp() {
  const e = [...document.querySelectorAll(F1)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const kp = 4;
function bp() {
  const e = $o(), t = wp(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > kp || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - yp - n, 0) } };
}
const Pg = ({ size: e, below: t }) => (1 - t) * e;
function xp(e, t) {
  const n = gt(), { size: s, below: a } = t, o = gn[e.posture].drop * s;
  return { ...cp(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const $p = (e, t) => Object.keys(xo).map((n) => xp(gp(e, n, t), t)), Mp = (e, t, n) => pp(e, t, n) ?? e[0];
function qg(e, t) {
  const { element: n, edge: s } = bp();
  return { ...Mp($p(s, e), e, t), view: null, on: n };
}
function $o() {
  var s;
  const e = Rt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(U1);
  if (!t) return { ...Mo(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Mo() {
  const e = Rt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const _p = { climb: 90 };
function Wg(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: i = !1, random: r = Math.random, via: l = [], memory: u = null, now: f = 0, room: k = 0, pogo: _ = !1 } = {}) {
  (o || i) && (a = Math.max(a, wo));
  const A = (Q) => {
    const q = mt(Q, n, gn[Q.posture].travels);
    return { x: q.left, y: q.top };
  }, W = t.ladder ?? e.ladder;
  if (W && !(t.ladder && e.ladder)) return Sp(A(e), A(t), A({ ...W.foot, posture: "stand" }), W.way, !!t.ladder, n, a);
  const [y, ...w] = [e, ...l, t].map(A), E = nn(y, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: i, random: r, memory: u, now: f, room: k, pogo: _ }), N = w.slice(1).map((Q, q) => {
    var C;
    return (C = nn(w[q], Q, n.size, { random: r, memory: u, now: f, room: k })) == null ? void 0 : C.legs.find((L) => L.hopping);
  });
  return E && { ...E, legs: [...E.legs, ...N.filter(Boolean)] };
}
function Sp(e, t, n, s, a, o, i) {
  const r = (f, k) => ({ x: k.x, y: k.y, ms: Math.hypot(k.x - f.x, k.y - f.y) / _p.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? nn(e, n, o.size, { pace: i }) : nn(n, t, o.size, { pace: i }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], r(n, t)] : [r(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: i, running: i > 1 };
}
const Ep = "[data-figure-bubble]", Ap = 250;
let xt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), _o = 0;
const So = () => xt, Rn = /* @__PURE__ */ new WeakMap();
let Cp = 0;
function Eo(e) {
  return Rn.has(e) || Rn.set(e, `floor-${++Cp}`), Rn.get(e);
}
const Op = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Tp = () => {
  var e, t;
  return ((t = (e = Rt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Bp(e, t) {
  var s;
  const n = (s = e.querySelector(z1)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Rp(e, t) {
  const n = e && Bp(e, t), s = e ? [...e.querySelectorAll(Ep)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: i }) => ({ element: o, kind: i, box: o.getBoundingClientRect() })).filter(({ kind: o, box: i }) => i.width > 0 && i.height > 0 && (o !== "bubble" || Op(i, n))).map(({ element: o, kind: i, box: r }) => ({ id: Eo(o), kind: i, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Lp = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Ap ? (t.top - s.top) / a * 1e3 : 0;
};
function Dp(e = xt, t = performance.now()) {
  const n = gt(), s = Tp(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: i, edge: r } = $o(), l = [];
  o && l.push({ id: "home", kind: i ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = Mo();
  return u.element && l.push({ id: Eo(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Rp(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((f) => Object.freeze({ ...f, vy: Lp(e, f, t) }))) });
}
const ns = /* @__PURE__ */ new Set();
function Ip(e) {
  return ns.add(e), () => ns.delete(e);
}
function jp() {
  Ao();
  const e = () => {
    _o = requestAnimationFrame(e), !document.hidden && (xt = Dp(xt), ns.forEach((t) => t(xt)));
  };
  e();
}
function Ao() {
  cancelAnimationFrame(_o);
}
const Np = (e, t) => e.find((n) => n.id === t) ?? null;
function Fg(e, t, n = So().floors) {
  const s = Np(n, "home");
  return e.posture === "hang" && s && mt(e, t).bottom >= s.top ? !1 : bo(e, t);
}
const Pp = ["data-kind"], qp = { class: "figure-floor-name" }, Wp = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", qp, M(e.floor.kind), 1)
    ], 12, Pp));
  }
}, Fp = /* @__PURE__ */ Y(Wp, [["__scopeId", "data-v-8f6132da"]]), Hp = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Up = {
  __name: "FigureFloors",
  setup(e) {
    const t = rn(So().floors);
    let n = () => {
    };
    return je(() => {
      n = Ip((s) => t.value = s.floors), jp();
    }), Ae(() => {
      n(), Ao();
    }), (s, a) => (c(), h("div", Hp, [
      (c(!0), h(J, null, re(t.value, (o) => (c(), K(Fp, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Hg = /* @__PURE__ */ Y(Up, [["__scopeId", "data-v-e519168b"]]), Ln = (e) => typeof e == "number" ? e : Date.parse(e);
function Ug(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Ln(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Ln(a.row.created_at) - Ln(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const zp = 2e3;
function zg(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, zp);
  };
  je(async () => {
    await e(), s();
  }), rs(() => clearTimeout(n));
}
const ia = "newest";
function Vg(e, { title: t, isOpen: n = null }) {
  const s = F(""), a = F(ia), o = F("all"), i = D(() => {
    const r = s.value.trim().toLowerCase(), l = e.value.filter((u) => (!r || JSON.stringify(u).toLowerCase().includes(r)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === ia ? l : [...l].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: i, hasStates: !!n };
}
const Vp = {
  class: "list-tools",
  "data-list-tools": ""
}, Gp = {
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
    return (s, a) => (c(), h("div", Vp, [
      H(Vd, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        icon: "search",
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
      }, null, 8, ["modelValue", "placeholder"]),
      H(Zn, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (c(), K(Zn, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : P("", !0)
    ]));
  }
}, Gg = /* @__PURE__ */ Y(Gp, [["__scopeId", "data-v-b2dd0a0d"]]);
function Kg() {
  const e = F(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Kp = 86400, ss = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Yp(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ss(t) - ss(e)) / Kp);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function Yg(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ss(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Yp(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Dn = 280, In = 240, jn = 120, Jp = 6, Zp = 14, Et = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Qp(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const i = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Zp}px)` }), e.offsetHeight, e.style.transition = `height ${Dn}ms ${Et}`, e.style.height = `${i}px`;
  const r = a();
  let l = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - r;
    if (!l && f >= Dn && (l = !0, e.style.transition = `opacity ${In}ms ease-out, transform ${In}ms ${Et}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Dn + In) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function Jg(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Jp}px)` }), e.offsetHeight, e.style.transition = `opacity ${jn}ms ease-out, transform ${jn}ms ${Et}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const i = a(), r = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - i < jn) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const Xp = 140, Ft = 220, em = 5;
function Zg({ gap: e = Xp, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, em);
    if (s = r.length > 0, !s) return;
    let l = r.length;
    for (const u of r)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), l -= 1, l || t(o, e);
      });
  }
  const i = (r, l, u, f = Qp) => {
    if (!l.pane || !l.follows()) return u();
    const k = { el: r, options: l, done: u, arrival: f, display: r.style.display || "" };
    if (!s)
      return s = !0, f(r, l, () => a(k));
    r.style.display = "none", n.push(k);
  };
  return i.flush = () => {
    for (const r of n.splice(0))
      r.el.style.display = r.display, r.done();
  }, i;
}
function Qg(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Ft}ms ${Et}, opacity ${Ft}ms ease-in, margin ${Ft}ms ${Et}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Ft);
}
const Co = "chat.pins.minimised", Gt = F(Mt(Co, !1));
function la(e) {
  Gt.value = e, cn(Co, e);
}
function tm(e) {
  const t = D(() => e()), n = D(() => Gt.value ? [] : e()), s = () => la(!Gt.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Sa(o) > a).length,
    (o, i) => o > i && la(!1)
  ), { pins: t, visible: n, minimised: Gt, toggle: s };
}
const nm = ["title"], sm = {
  key: 0,
  class: "pins-count"
}, am = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = tm(() => t.notices);
    return (o, i) => G(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: G(s), inline: e.inline }]),
      title: G(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: i[0] || (i[0] = Me((...r) => G(a) && G(a)(...r), ["stop"]))
    }, [
      H(Ee, {
        name: G(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      G(s) ? (c(), h("span", sm, M(G(n).length), 1)) : P("", !0)
    ], 10, nm)) : P("", !0);
  }
}, Xg = /* @__PURE__ */ Y(am, [["__scopeId", "data-v-c0d11526"]]), om = ["title"], rm = ["title"], im = { class: "diff-card-dir" }, lm = { class: "diff-card-name" }, cm = { class: "diff-card-ago" }, um = ["title"], dm = ["title"], hm = {
  key: 0,
  class: "diff-card-note"
}, fm = ["href"], pm = ["src", "alt"], mm = { class: "diff-card-rows" }, gm = { class: "diff-row-num" }, vm = { class: "diff-row-sign" }, ym = { class: "diff-row-code" }, wm = {
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
    const i = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, l = D(() => n.path.lastIndexOf("/") + 1), u = D(() => n.path.slice(0, l.value)), f = D(() => n.path.slice(l.value)), k = D(() => n.kind === "deleted"), _ = D(() => i[n.kind]), A = D(() => new Set(n.rows.filter(($) => $.line_type === "add").map(($) => $.line))), W = F("after"), y = D(() => W.value === "before" ? n.whole.old : n.whole.text), w = D(() => n.whole && n.whole.text !== void 0 ? y.value.split(`
`).map(($, m) => ({ line_type: W.value === "after" && A.value.has(m + 1) ? "add" : "ctx", line: m + 1, text: $ })) : n.rows.filter(
      ($) => !(n.editsOnly && ["ctx", "fold"].includes($.line_type)) && !(n.hideRemovals && $.line_type === "del")
    )), E = F(!1), N = D(() => n.lines && !E.value && !n.whole), Q = D(() => N.value ? w.value.slice(0, n.lines) : w.value), q = D(() => w.value.length - Q.value.length), C = ($) => $.line === null || $.line_type === "del" ? "" : $.line, L = ($) => $.line_type === "fold" ? $.hidden ? `⋯ ${$.hidden} lines` : "⋯" : $.text, v = F(null), p = F(null);
    let b = null;
    return je(() => {
      if (!p.value) return;
      let $ = !0;
      b = new ResizeObserver(() => {
        !v.value || !p.value || (v.value.style.transition = $ ? "none" : "", v.value.style.height = `${p.value.offsetHeight}px`, $ = !1);
      }), b.observe(p.value);
    }), Ae(() => b && b.disconnect()), ($, m) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: k.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: k.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: m[2] || (m[2] = (d) => !k.value && s("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${G(a)}-click to open it`,
          onClick: o
        }, [
          g("span", im, M(u.value), 1),
          g("span", lm, M(f.value), 1),
          _.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.kind])
          }, M(_.value), 3)) : P("", !0)
        ], 8, rm),
        g("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + M(e.added), 3),
        g("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + M(e.removed), 3),
        g("span", cm, M(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: W.value === "after" ? "Show the file before" : "Show the file after",
          onClick: m[0] || (m[0] = Me((d) => W.value = W.value === "after" ? "before" : "after", ["stop"]))
        }, M(W.value === "after" ? "After" : "Before"), 9, um)) : P("", !0),
        k.value ? P("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: m[1] || (m[1] = Me((d) => s("whole"), ["stop"]))
        }, [
          H(Ee, {
            name: "file",
            size: 12
          })
        ], 10, dm))
      ], 8, om),
      e.whole && e.whole.error ? (c(), h("p", hm, M(e.whole.error), 1)) : P("", !0),
      !k.value && !e.folded ? (c(), h(J, { key: 1 }, [
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
          }, null, 8, pm)
        ], 8, fm)) : (c(), h("div", {
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
            g("div", mm, [
              (c(!0), h(J, null, re(Q.value, (d, S) => (c(), h("div", {
                key: S,
                class: X(["diff-row", d.line_type, { fresh: e.fresh && d.edit === e.fresh }])
              }, [
                g("span", gm, M(C(d)), 1),
                g("span", vm, M(r[d.line_type]), 1),
                g("span", ym, M(L(d)), 1)
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
}, ev = /* @__PURE__ */ Y(wm, [["__scopeId", "data-v-b6424f6e"]]), km = {
  key: 0,
  class: "menu-item-text"
}, bm = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.description ? (c(), h("span", km, [
        g("span", null, [
          be(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, M(e.description), 1)
      ])) : be(t.$slots, "default", {}, void 0, !0, 1)
    ], 2));
  }
}, xm = /* @__PURE__ */ Y(bm, [["__scopeId", "data-v-5b5c4fd9"]]), $m = {}, Mm = { class: "menu-label" };
function _m(e, t) {
  return c(), h("span", Mm, [
    be(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Sm = /* @__PURE__ */ Y($m, [["render", _m], ["__scopeId", "data-v-aa955b3e"]]), Oo = /* @__PURE__ */ new WeakMap(), Em = (e, t) => Oo.set(e, t);
function Am(e, t) {
  for (let n = t; n; n = Oo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Cm(e, t) {
  const n = (s) => {
    var o, i;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((i = e.value) == null ? void 0 : i.$el) || e.value;
    a && !Am(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const rt = 8, Om = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = F(null), o = (d) => d ? `${d}px` : void 0, i = D(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), r = F({ w: 0, h: 0 }), l = F(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), k = (d) => {
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
      const S = k(s.anchor), O = A(S, d);
      return r.value.w <= O.across && r.value.h <= Math.max(O.below, O.above) ? S : u();
    }
    const y = D(() => {
      if (!l.value) return i.value;
      const d = l.value, S = W(d), O = A(S, d), { w: j, h: ae } = r.value, oe = s.align === "auto" ? d.left + d.right > S.left + S.right : s.align === "right", de = ii(oe ? d.right - j : d.left, S.left + rt, Math.max(S.left + rt, S.right - j - rt)), pe = ae > O.below && O.above > O.below ? { bottom: `${window.innerHeight - d.top + s.gap}px`, maxHeight: _(s.maxHeight, O.above) } : { top: `${d.bottom + s.gap}px`, maxHeight: _(s.maxHeight, O.below) };
      return { ...i.value, ...pe, left: `${de}px`, maxWidth: _(s.maxWidth, O.across) };
    }), w = n, E = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function N(d) {
      const S = E(), O = S.indexOf(document.activeElement);
      S[(O + d + S.length) % S.length].focus();
    }
    const Q = { ArrowDown: () => N(1), ArrowUp: () => N(-1), Escape: () => w("close") }, q = (d) => Q[d.key] && (d.preventDefault(), Q[d.key]()), C = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let L = 0;
    const v = new ResizeObserver(() => {
      cancelAnimationFrame(L), L = requestAnimationFrame(C);
    });
    Cm(a, (d) => s.anchor && !s.anchor.contains(d.target) && w("close"));
    const p = (d, S) => ["top", "left", "right", "bottom"].some((O) => Math.abs(d[O] - S[O]) > 1), b = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let $ = 0;
    function m() {
      if (s.anchor) {
        const d = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || b(d)) return w("close");
        p(d, l.value) && (l.value = d);
      }
      $ = requestAnimationFrame(m);
    }
    return je(() => {
      s.anchor && a.value && Em(a.value, s.anchor), C(), a.value && v.observe(a.value), !s.plain && E()[0] && E()[0].focus(), m();
    }), Ae(() => {
      v.disconnect(), cancelAnimationFrame($), cancelAnimationFrame(L);
    }), t({ element: a }), (d, S) => (c(), K(ha, {
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
}), Tm = /* @__PURE__ */ Y(Om, [["__scopeId", "data-v-3d203970"]]), Bm = {
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
        H(Ee, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Rm = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, Lm = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?" }, We],
  started: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?" }, We],
  testing: [{ word: "close", label: "Close", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Dm = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Im = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], jm = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Nm = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Pm = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], qm = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? Pm(t) : e === "agent" ? [...jm(t), ...Im(t)] : e === "check" ? Nm(t) : e === "question" ? Dm(t) : ((n = { plan: Rm, task: Lm }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, Wm = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Fm = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Hm = { class: "ask-text" }, Um = ["placeholder", "aria-label"], zm = {
  key: 3,
  class: "moves"
}, Vm = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = D(() => qm(s.kind, s.row)), i = F(""), r = F(null), l = F("");
    ke(() => s.id, () => {
      i.value = "", r.value = null;
    });
    async function u(_, A = "") {
      const W = await s.read([_.noun ?? s.kind, _.word, String(s.id), ..._.flag ? [_.flag, A] : _.positional ? [A] : []]);
      i.value = W.ok ? "" : W.error, W.ok && (r.value = null, l.value = "", a("done"));
    }
    const f = (_) => _.confirm ? r.value = _ : _.said ? u(_, _.said) : _.flag || _.positional ? (r.value = _, l.value = "") : u(_), k = () => l.value.trim() && u(r.value, l.value.trim());
    return t({ moves: o, press: f }), (_, A) => {
      var W;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: X(["foot", { inline: e.inline }])
      }, [
        i.value ? (c(), h("p", Wm, M(i.value), 1)) : P("", !0),
        (W = r.value) != null && W.confirm ? (c(), h("div", Fm, [
          g("span", Hm, M(r.value.confirm), 1),
          H(ye, {
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
          H(ye, {
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
          onSubmit: Me(k, ["prevent"])
        }, [
          $t(g("input", {
            "onUpdate:modelValue": A[2] || (A[2] = (y) => l.value = y),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: A[3] || (A[3] = Wn(Me((y) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, Um), [
            [ga, l.value]
          ]),
          H(ye, {
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
          H(ye, {
            small: "",
            kind: "ghost",
            onClick: A[4] || (A[4] = (y) => r.value = null)
          }, {
            default: U(() => [...A[6] || (A[6] = [
              ge("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", zm, [
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
}, Gm = /* @__PURE__ */ Y(Vm, [["__scopeId", "data-v-14c7da8d"]]), Km = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, Ym = { ...Km, done: "Completed" }, Jm = { class: "task-status-icon" }, Zm = ["width", "height", "aria-label"], Qm = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", Jm, [
      H(on, {
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
            "aria-label": G(Ym)[e.status]
          }, [
            H(is, { value: e.status }, {
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
          ], 10, Zm))
        ]),
        _: 1
      })
    ]));
  }
}, ca = /* @__PURE__ */ Y(Qm, [["__scopeId", "data-v-2ab7e404"]]), Xm = {
  class: "comment-side",
  "data-comment-side": "",
  "aria-label": "Comments"
}, e0 = { class: "comment-side-head" }, t0 = {
  key: 0,
  class: "comment-none"
}, n0 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", Xm, [
      g("header", e0, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        H(ls, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? P("", !0) : (c(), h("p", t0, "No comments yet")),
      (c(!0), h(J, null, re(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, M(e.words(s)), 1))), 128))
    ]));
  }
}, s0 = /* @__PURE__ */ Y(n0, [["__scopeId", "data-v-234cce45"]]), a0 = ["placeholder"], o0 = { class: "actions" }, r0 = { class: "error" }, i0 = {
  key: 1,
  class: "card closed"
}, l0 = { class: "mark" }, c0 = { class: "prompt" }, u0 = {
  key: 0,
  class: "draft"
}, d0 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ qn({
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
  emits: /* @__PURE__ */ qn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Pn(e, "draft"), i = Pn(e, "error"), r = F(!!i.value), l = F(!1), u = F(!1), f = F(null);
    async function k() {
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
    return t({ expand: k }), (y, w) => (c(), h("div", {
      class: X(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: Me(W, ["prevent"]),
        onKeydown: Wn(_, ["esc"])
      }, [
        be(y.$slots, "who", {}, void 0, !0),
        $t(g("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": w[0] || (w[0] = (E) => o.value = E),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Wn(A, ["enter"])
        }, null, 40, a0), [
          [ga, o.value]
        ]),
        g("div", o0, [
          g("span", r0, M(i.value), 1),
          H(ye, {
            small: "",
            onClick: _
          }, {
            default: U(() => [...w[2] || (w[2] = [
              ge("Cancel", -1)
            ])]),
            _: 1
          }),
          H(ye, {
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
      ], 32)) : (c(), h("div", i0, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: k
        }, [
          g("span", l0, [
            H(Ee, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", c0, M(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", u0, "Draft kept")) : P("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = (E) => a("show"))
        }, [
          g("span", null, M(G(li)(e.count, "comment")), 1),
          H(Ee, {
            name: "down",
            size: 12
          })
        ])) : P("", !0)
      ]))
    ], 2));
  }
}, h0 = /* @__PURE__ */ Y(d0, [["__scopeId", "data-v-4d1d3a74"]]);
function f0(e, t) {
  const n = F([]), s = F(!1);
  let a = 0;
  const o = (l) => {
    const { kind: u, id: f, title: k } = e(), _ = `On ${u} ${f}, ${k}: `;
    return l.text.startsWith(_) ? l.text.slice(_.length) : l.text;
  };
  async function i() {
    const { kind: l, id: u } = e();
    if (!u) return;
    const f = await t([l, "comments", String(u)]);
    n.value = f.ok ? f.value.rows ?? [] : [];
  }
  async function r(l) {
    const { kind: u, id: f } = e(), k = { id: `sending-${++a}`, text: l };
    n.value = [...n.value, k], s.value = !0;
    const _ = await t([u, "comment", String(f), l]);
    if (!_.ok)
      throw n.value = n.value.filter((A) => A !== k && A.id !== k.id), new Error(_.error);
    await i();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: o, send: r, load: i };
}
const p0 = { class: "top" }, m0 = {
  class: "crumb",
  "data-task-crumb": ""
}, g0 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, v0 = {
  key: 1,
  class: "body"
}, y0 = { class: "body-row" }, w0 = { class: "stamp" }, k0 = {
  class: "title",
  "data-resource-title": ""
}, b0 = { class: "since" }, x0 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, $0 = { class: "text" }, M0 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, _0 = { class: "text" }, S0 = { class: "facts" }, E0 = { class: "fact wide" }, A0 = { class: "fact-value" }, C0 = {
  key: 0,
  class: "fact"
}, O0 = { class: "fact-value" }, T0 = {
  key: 1,
  class: "fact"
}, B0 = { class: "fact-value" }, R0 = {
  key: 2,
  class: "fact wide"
}, L0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, D0 = {
  key: 2,
  class: "part",
  "data-resource-waits": ""
}, I0 = ["onClick"], j0 = { class: "wait-id" }, N0 = { class: "wait-title" }, P0 = {
  key: 3,
  class: "part",
  "data-task-outcome": ""
}, q0 = { class: "text" }, W0 = {
  key: 4,
  class: "part",
  "data-task-brief": ""
}, F0 = {
  key: 5,
  class: "part",
  "data-resource-logs": ""
}, H0 = 180, U0 = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = [
      { key: "low", label: "Low" },
      { key: "normal", label: "Normal" },
      { key: "high", label: "High" }
    ], a = /* @__PURE__ */ new Set(["completed", "cancelled"]), o = e, i = n, r = F(null), l = F(null), u = F(""), f = F(""), k = F(!1), _ = F(null), A = F(null), W = f0(() => r.value ? { kind: "task", id: o.id, title: r.value.title } : {}, (v) => o.read(v));
    ke(W.open, (v) => i("comments", v));
    let y = 0;
    const w = (v) => a.has(v) ? "done" : v, E = (v) => v.slice(0, 1).toUpperCase() + v.slice(1), N = D(() => {
      var v;
      return (v = l.value) != null && v.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function Q() {
      const v = ++y, [p, b] = await Promise.all([o.read(["task", "inspect", String(o.id)]), o.read(["plan", "place", String(o.id)])]);
      v === y && (u.value = p.ok ? "" : p.error, r.value = p.ok ? p.value : null, l.value = b.ok ? b.value : null);
    }
    ke(() => o.id, () => {
      r.value = null, l.value = null, k.value = !1, _.value = null, Q();
    }, { immediate: !0 }), ke(() => o.changes, Q);
    async function q(v) {
      const p = await o.read(["task", "edit", String(o.id), "--priority", v]);
      if (f.value = p.ok ? "" : p.error, p.ok) return Q();
    }
    function C(v) {
      _.value = null, A.value.press(v);
    }
    const L = (v) => {
      var p;
      return ((p = A.value) == null ? void 0 : p.moves.length) && (_.value = v);
    };
    return t({ openStatus: L }), (v, p) => {
      var b, $;
      return c(), h("aside", {
        class: X(["task-inspector", { lone: e.lone }]),
        "data-task-inspector": ""
      }, [
        g("div", p0, [
          e.backed ? (c(), K(Bm, {
            key: 0,
            onBack: p[0] || (p[0] = (m) => i("back"))
          })) : P("", !0),
          g("span", m0, M(N.value), 1),
          p[9] || (p[9] = g("span", { class: "grow" }, null, -1)),
          e.stepped ? (c(), h(J, { key: 1 }, [
            H(ye, {
              small: "",
              title: "Previous task (K)",
              "aria-label": "Previous task",
              onClick: p[1] || (p[1] = (m) => i("step", -1))
            }, {
              default: U(() => [
                H(Ee, {
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
              onClick: p[2] || (p[2] = (m) => i("step", 1))
            }, {
              default: U(() => [
                H(Ee, {
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
            onClick: p[3] || (p[3] = (m) => i("close"))
          }, {
            default: U(() => [
              H(Ee, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          })
        ]),
        u.value ? (c(), h("p", g0, M(u.value), 1)) : r.value ? (c(), h(J, { key: 2 }, [
          g("div", y0, [
            (c(), h("div", {
              key: r.value.id,
              class: "body"
            }, [
              g("div", w0, "Task " + M(r.value.id) + " · updated " + M(G(Bs)(G(Zt)(r.value)) || "just now"), 1),
              g("h3", k0, M(r.value.title), 1),
              g("div", {
                class: X(["state-line", w(r.value.state)])
              }, [
                g("button", {
                  type: "button",
                  class: "state",
                  "data-task-state": "",
                  title: "Change the status (S)",
                  onClick: p[4] || (p[4] = (m) => L(m.currentTarget))
                }, [
                  H(ca, {
                    status: w(r.value.state)
                  }, null, 8, ["status"]),
                  ge(" " + M(E(r.value.state)), 1)
                ]),
                g("span", b0, "since " + M(G(Bs)(G(Zt)(r.value)) || "just now"), 1)
              ], 2),
              r.value.state === "blocked" ? (c(), h("section", x0, [
                p[10] || (p[10] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
                g("p", $0, M(r.value.reason || "Other tasks"), 1),
                p[11] || (p[11] = g("p", { class: "note" }, "Nothing opens it by itself. Unblock it when that is done.", -1))
              ])) : r.value.state === "cancelled" && r.value.reason ? (c(), h("section", M0, [
                p[12] || (p[12] = g("span", { class: "label" }, "Why it was cancelled", -1)),
                g("p", _0, M(r.value.reason), 1)
              ])) : P("", !0),
              g("div", S0, [
                g("div", E0, [
                  p[13] || (p[13] = g("span", { class: "fact-label" }, "Plan", -1)),
                  g("span", A0, M((b = l.value) != null && b.plan_id ? `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan"), 1)
                ]),
                (($ = l.value) == null ? void 0 : $.phase_total) > 1 ? (c(), h("div", C0, [
                  p[14] || (p[14] = g("span", { class: "fact-label" }, "Phase", -1)),
                  g("span", O0, M(l.value.phase_number) + " of " + M(l.value.phase_total) + ": " + M(l.value.phase_title), 1)
                ])) : P("", !0),
                r.value.state === "started" && r.value.holder_id ? (c(), h("div", T0, [
                  p[15] || (p[15] = g("span", { class: "fact-label" }, "Holder", -1)),
                  g("span", B0, "Agent " + M(r.value.holder_id), 1)
                ])) : P("", !0),
                G(a).has(r.value.state) ? P("", !0) : (c(), h("div", R0, [
                  p[16] || (p[16] = g("span", { class: "fact-label" }, "Priority", -1)),
                  H(Zn, {
                    options: s,
                    value: r.value.priority,
                    "data-task-priority": "",
                    onPick: q
                  }, null, 8, ["value"]),
                  f.value ? (c(), h("p", L0, M(f.value), 1)) : P("", !0)
                ]))
              ]),
              r.value.waits.length ? (c(), h("section", D0, [
                p[17] || (p[17] = g("h4", null, "Waits on", -1)),
                (c(!0), h(J, null, re(r.value.waits, (m) => (c(), h("button", {
                  key: m.id,
                  type: "button",
                  class: "wait",
                  onClick: (d) => i("select", m.id)
                }, [
                  H(ca, {
                    status: w(m.state),
                    size: 12
                  }, null, 8, ["status"]),
                  g("span", j0, M(m.id), 1),
                  g("span", N0, M(m.title), 1)
                ], 8, I0))), 128))
              ])) : P("", !0),
              r.value.state === "completed" && r.value.outcome ? (c(), h("section", P0, [
                p[18] || (p[18] = g("h4", null, "How it was done", -1)),
                g("p", q0, M(r.value.outcome), 1)
              ])) : P("", !0),
              r.value.brief ? (c(), h("section", W0, [
                p[19] || (p[19] = g("h4", null, "The brief", -1)),
                g("p", {
                  class: X(["text", { clamped: !k.value }])
                }, M(r.value.brief), 3),
                r.value.brief.length > H0 && !k.value ? (c(), h("button", {
                  key: 0,
                  type: "button",
                  class: "more",
                  onClick: p[5] || (p[5] = (m) => k.value = !0)
                }, "Show the whole brief")) : P("", !0)
              ])) : P("", !0),
              r.value.logs.length ? (c(), h("section", F0, [
                p[20] || (p[20] = g("h4", null, "Log", -1)),
                (c(!0), h(J, null, re(r.value.logs, (m) => (c(), h("p", {
                  key: m.id,
                  class: "log"
                }, M(m.line), 1))), 128))
              ])) : P("", !0)
            ])),
            G(W).open.value ? (c(), K(s0, {
              key: 0,
              comments: G(W).comments.value,
              words: G(W).words,
              onClose: p[6] || (p[6] = (m) => G(W).open.value = !1)
            }, null, 8, ["comments", "words"])) : P("", !0)
          ]),
          H(h0, {
            send: G(W).send,
            count: G(W).comments.value.length,
            onShow: p[7] || (p[7] = (m) => G(W).open.value = !G(W).open.value)
          }, null, 8, ["send", "count"])
        ], 64)) : (c(), h("div", v0, [
          H(At)
        ])),
        H(Gm, {
          ref_key: "footer",
          ref: A,
          kind: "task",
          id: e.id,
          row: r.value,
          read: e.read,
          onDone: Q
        }, null, 8, ["id", "row", "read"]),
        _.value ? (c(), K(Tm, {
          key: 3,
          anchor: _.value,
          "min-width": 220,
          "max-width": 300,
          onClose: p[8] || (p[8] = (m) => _.value = null)
        }, {
          default: U(() => [
            H(Sm, null, {
              default: U(() => [
                ge("Change the status of task " + M(e.id), 1)
              ]),
              _: 1
            }),
            (c(!0), h(J, null, re(A.value.moves, (m) => (c(), K(xm, {
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
}, tv = /* @__PURE__ */ Y(U0, [["__scopeId", "data-v-f0bc942a"]]);
function z0(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Nn = { exports: {} }, ua;
function V0() {
  return ua || (ua = 1, (function(e, t) {
    var n = (function() {
      var s = function(C, L) {
        var v = 236, p = 17, b = C, $ = o[L], m = null, d = 0, S = null, O = [], j = {}, ae = function(T, B) {
          d = b * 4 + 17, m = (function(x) {
            for (var R = new Array(x), I = 0; I < x; I += 1) {
              R[I] = new Array(x);
              for (var V = 0; V < x; V += 1)
                R[I][V] = null;
            }
            return R;
          })(d), oe(0, 0), oe(d - 7, 0), oe(0, d - 7), pe(), le(), Ne(T, B), b >= 7 && _e(T), S == null && (S = To(b, $, O)), Pe(S, B);
        }, oe = function(T, B) {
          for (var x = -1; x <= 7; x += 1)
            if (!(T + x <= -1 || d <= T + x))
              for (var R = -1; R <= 7; R += 1)
                B + R <= -1 || d <= B + R || (0 <= x && x <= 6 && (R == 0 || R == 6) || 0 <= R && R <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= R && R <= 4 ? m[T + x][B + R] = !0 : m[T + x][B + R] = !1);
        }, de = function() {
          for (var T = 0, B = 0, x = 0; x < 8; x += 1) {
            ae(!0, x);
            var R = r.getLostPoint(j);
            (x == 0 || T > R) && (T = R, B = x);
          }
          return B;
        }, le = function() {
          for (var T = 8; T < d - 8; T += 1)
            m[T][6] == null && (m[T][6] = T % 2 == 0);
          for (var B = 8; B < d - 8; B += 1)
            m[6][B] == null && (m[6][B] = B % 2 == 0);
        }, pe = function() {
          for (var T = r.getPatternPosition(b), B = 0; B < T.length; B += 1)
            for (var x = 0; x < T.length; x += 1) {
              var R = T[B], I = T[x];
              if (m[R][I] == null)
                for (var V = -2; V <= 2; V += 1)
                  for (var ne = -2; ne <= 2; ne += 1)
                    V == -2 || V == 2 || ne == -2 || ne == 2 || V == 0 && ne == 0 ? m[R + V][I + ne] = !0 : m[R + V][I + ne] = !1;
            }
        }, _e = function(T) {
          for (var B = r.getBCHTypeNumber(b), x = 0; x < 18; x += 1) {
            var R = !T && (B >> x & 1) == 1;
            m[Math.floor(x / 3)][x % 3 + d - 8 - 3] = R;
          }
          for (var x = 0; x < 18; x += 1) {
            var R = !T && (B >> x & 1) == 1;
            m[x % 3 + d - 8 - 3][Math.floor(x / 3)] = R;
          }
        }, Ne = function(T, B) {
          for (var x = $ << 3 | B, R = r.getBCHTypeInfo(x), I = 0; I < 15; I += 1) {
            var V = !T && (R >> I & 1) == 1;
            I < 6 ? m[I][8] = V : I < 8 ? m[I + 1][8] = V : m[d - 15 + I][8] = V;
          }
          for (var I = 0; I < 15; I += 1) {
            var V = !T && (R >> I & 1) == 1;
            I < 8 ? m[8][d - I - 1] = V : I < 9 ? m[8][15 - I - 1 + 1] = V : m[8][15 - I - 1] = V;
          }
          m[d - 8][8] = !T;
        }, Pe = function(T, B) {
          for (var x = -1, R = d - 1, I = 7, V = 0, ne = r.getMaskFunction(B), te = d - 1; te > 0; te -= 2)
            for (te == 6 && (te -= 1); ; ) {
              for (var me = 0; me < 2; me += 1)
                if (m[R][te - me] == null) {
                  var we = !1;
                  V < T.length && (we = (T[V] >>> I & 1) == 1);
                  var se = ne(R, te - me);
                  se && (we = !we), m[R][te - me] = we, I -= 1, I == -1 && (V += 1, I = 7);
                }
              if (R += x, R < 0 || d <= R) {
                R -= x, x = -x;
                break;
              }
            }
        }, st = function(T, B) {
          for (var x = 0, R = 0, I = 0, V = new Array(B.length), ne = new Array(B.length), te = 0; te < B.length; te += 1) {
            var me = B[te].dataCount, we = B[te].totalCount - me;
            R = Math.max(R, me), I = Math.max(I, we), V[te] = new Array(me);
            for (var se = 0; se < V[te].length; se += 1)
              V[te][se] = 255 & T.getBuffer()[se + x];
            x += me;
            var Ce = r.getErrorCorrectPolynomial(we), Oe = u(V[te], Ce.getLength() - 1), ws = Oe.mod(Ce);
            ne[te] = new Array(Ce.getLength() - 1);
            for (var se = 0; se < ne[te].length; se += 1) {
              var ks = se + ws.getLength() - ne[te].length;
              ne[te][se] = ks >= 0 ? ws.getAt(ks) : 0;
            }
          }
          for (var bs = 0, se = 0; se < B.length; se += 1)
            bs += B[se].totalCount;
          for (var vn = new Array(bs), Lt = 0, se = 0; se < R; se += 1)
            for (var te = 0; te < B.length; te += 1)
              se < V[te].length && (vn[Lt] = V[te][se], Lt += 1);
          for (var se = 0; se < I; se += 1)
            for (var te = 0; te < B.length; te += 1)
              se < ne[te].length && (vn[Lt] = ne[te][se], Lt += 1);
          return vn;
        }, To = function(T, B, x) {
          for (var R = f.getRSBlocks(T, B), I = k(), V = 0; V < x.length; V += 1) {
            var ne = x[V];
            I.put(ne.getMode(), 4), I.put(ne.getLength(), r.getLengthInBits(ne.getMode(), T)), ne.write(I);
          }
          for (var te = 0, V = 0; V < R.length; V += 1)
            te += R[V].dataCount;
          if (I.getLengthInBits() > te * 8)
            throw "code length overflow. (" + I.getLengthInBits() + ">" + te * 8 + ")";
          for (I.getLengthInBits() + 4 <= te * 8 && I.put(0, 4); I.getLengthInBits() % 8 != 0; )
            I.putBit(!1);
          for (; !(I.getLengthInBits() >= te * 8 || (I.put(v, 8), I.getLengthInBits() >= te * 8)); )
            I.put(p, 8);
          return st(I, R);
        };
        j.addData = function(T, B) {
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
        }, j.isDark = function(T, B) {
          if (T < 0 || d <= T || B < 0 || d <= B)
            throw T + "," + B;
          return m[T][B];
        }, j.getModuleCount = function() {
          return d;
        }, j.make = function() {
          if (b < 1) {
            for (var T = 1; T < 40; T++) {
              for (var B = f.getRSBlocks(T, $), x = k(), R = 0; R < O.length; R++) {
                var I = O[R];
                x.put(I.getMode(), 4), x.put(I.getLength(), r.getLengthInBits(I.getMode(), T)), I.write(x);
              }
              for (var V = 0, R = 0; R < B.length; R++)
                V += B[R].dataCount;
              if (x.getLengthInBits() <= V * 8)
                break;
            }
            b = T;
          }
          ae(!1, de());
        }, j.createTableTag = function(T, B) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + B + "px;", x += '">', x += "<tbody>";
          for (var R = 0; R < j.getModuleCount(); R += 1) {
            x += "<tr>";
            for (var I = 0; I < j.getModuleCount(); I += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + T + "px;", x += " height: " + T + "px;", x += " background-color: ", x += j.isDark(R, I) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, j.createSvgTag = function(T, B, x, R) {
          var I = {};
          typeof arguments[0] == "object" && (I = arguments[0], T = I.cellSize, B = I.margin, x = I.alt, R = I.title), T = T || 2, B = typeof B > "u" ? T * 4 : B, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, R = typeof R == "string" ? { text: R } : R || {}, R.text = R.text || null, R.id = R.text ? R.id || "qrcode-title" : null;
          var V = j.getModuleCount() * T + B * 2, ne, te, me, we, se = "", Ce;
          for (Ce = "l" + T + ",0 0," + T + " -" + T + ",0 0,-" + T + "z ", se += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', se += I.scalable ? "" : ' width="' + V + 'px" height="' + V + 'px"', se += ' viewBox="0 0 ' + V + " " + V + '" ', se += ' preserveAspectRatio="xMinYMin meet"', se += R.text || x.text ? ' role="img" aria-labelledby="' + at([R.id, x.id].join(" ").trim()) + '"' : "", se += ">", se += R.text ? '<title id="' + at(R.id) + '">' + at(R.text) + "</title>" : "", se += x.text ? '<description id="' + at(x.id) + '">' + at(x.text) + "</description>" : "", se += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', se += '<path d="', me = 0; me < j.getModuleCount(); me += 1)
            for (we = me * T + B, ne = 0; ne < j.getModuleCount(); ne += 1)
              j.isDark(me, ne) && (te = ne * T + B, se += "M" + te + "," + we + Ce);
          return se += '" stroke="transparent" fill="black"/>', se += "</svg>", se;
        }, j.createDataURL = function(T, B) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var x = j.getModuleCount() * T + B * 2, R = B, I = x - B;
          return q(x, x, function(V, ne) {
            if (R <= V && V < I && R <= ne && ne < I) {
              var te = Math.floor((V - R) / T), me = Math.floor((ne - R) / T);
              return j.isDark(me, te) ? 0 : 1;
            } else
              return 1;
          });
        }, j.createImgTag = function(T, B, x) {
          T = T || 2, B = typeof B > "u" ? T * 4 : B;
          var R = j.getModuleCount() * T + B * 2, I = "";
          return I += "<img", I += ' src="', I += j.createDataURL(T, B), I += '"', I += ' width="', I += R, I += '"', I += ' height="', I += R, I += '"', x && (I += ' alt="', I += at(x), I += '"'), I += "/>", I;
        };
        var at = function(T) {
          for (var B = "", x = 0; x < T.length; x += 1) {
            var R = T.charAt(x);
            switch (R) {
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
                B += R;
                break;
            }
          }
          return B;
        }, Bo = function(T) {
          var B = 1;
          T = typeof T > "u" ? B * 2 : T;
          var x = j.getModuleCount() * B + T * 2, R = T, I = x - T, V, ne, te, me, we, se = {
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
            for (te = Math.floor((V - R) / B), me = Math.floor((V + 1 - R) / B), ne = 0; ne < x; ne += 1)
              we = "█", R <= ne && ne < I && R <= V && V < I && j.isDark(te, Math.floor((ne - R) / B)) && (we = " "), R <= ne && ne < I && R <= V + 1 && V + 1 < I && j.isDark(me, Math.floor((ne - R) / B)) ? we += " " : we += "█", Oe += T < 1 && V + 1 >= I ? Ce[we] : se[we];
            Oe += `
`;
          }
          return x % 2 && T > 0 ? Oe.substring(0, Oe.length - x - 1) + Array(x + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return j.createASCII = function(T, B) {
          if (T = T || 1, T < 2)
            return Bo(B);
          T -= 1, B = typeof B > "u" ? T * 2 : B;
          var x = j.getModuleCount() * T + B * 2, R = B, I = x - B, V, ne, te, me, we = Array(T + 1).join("██"), se = Array(T + 1).join("  "), Ce = "", Oe = "";
          for (V = 0; V < x; V += 1) {
            for (te = Math.floor((V - R) / T), Oe = "", ne = 0; ne < x; ne += 1)
              me = 1, R <= ne && ne < I && R <= V && V < I && j.isDark(te, Math.floor((ne - R) / T)) && (me = 0), Oe += me ? we : se;
            for (te = 0; te < T; te += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, j.renderTo2dContext = function(T, B) {
          B = B || 2;
          for (var x = j.getModuleCount(), R = 0; R < x; R++)
            for (var I = 0; I < x; I++)
              T.fillStyle = j.isDark(R, I) ? "black" : "white", T.fillRect(R * B, I * B, B, B);
        }, j;
      };
      s.stringToBytesFuncs = {
        default: function(C) {
          for (var L = [], v = 0; v < C.length; v += 1) {
            var p = C.charCodeAt(v);
            L.push(p & 255);
          }
          return L;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(C, L) {
        var v = (function() {
          for (var b = N(C), $ = function() {
            var le = b.read();
            if (le == -1) throw "eof";
            return le;
          }, m = 0, d = {}; ; ) {
            var S = b.read();
            if (S == -1) break;
            var O = $(), j = $(), ae = $(), oe = String.fromCharCode(S << 8 | O), de = j << 8 | ae;
            d[oe] = de, m += 1;
          }
          if (m != L)
            throw m + " != " + L;
          return d;
        })(), p = 63;
        return function(b) {
          for (var $ = [], m = 0; m < b.length; m += 1) {
            var d = b.charCodeAt(m);
            if (d < 128)
              $.push(d);
            else {
              var S = v[b.charAt(m)];
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
        ], L = 1335, v = 7973, p = 21522, b = {}, $ = function(m) {
          for (var d = 0; m != 0; )
            d += 1, m >>>= 1;
          return d;
        };
        return b.getBCHTypeInfo = function(m) {
          for (var d = m << 10; $(d) - $(L) >= 0; )
            d ^= L << $(d) - $(L);
          return (m << 10 | d) ^ p;
        }, b.getBCHTypeNumber = function(m) {
          for (var d = m << 12; $(d) - $(v) >= 0; )
            d ^= v << $(d) - $(v);
          return m << 12 | d;
        }, b.getPatternPosition = function(m) {
          return C[m - 1];
        }, b.getMaskFunction = function(m) {
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
        }, b.getErrorCorrectPolynomial = function(m) {
          for (var d = u([1], 0), S = 0; S < m; S += 1)
            d = d.multiply(u([1, l.gexp(S)], 0));
          return d;
        }, b.getLengthInBits = function(m, d) {
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
        }, b.getLostPoint = function(m) {
          for (var d = m.getModuleCount(), S = 0, O = 0; O < d; O += 1)
            for (var j = 0; j < d; j += 1) {
              for (var ae = 0, oe = m.isDark(O, j), de = -1; de <= 1; de += 1)
                if (!(O + de < 0 || d <= O + de))
                  for (var le = -1; le <= 1; le += 1)
                    j + le < 0 || d <= j + le || de == 0 && le == 0 || oe == m.isDark(O + de, j + le) && (ae += 1);
              ae > 5 && (S += 3 + ae - 5);
            }
          for (var O = 0; O < d - 1; O += 1)
            for (var j = 0; j < d - 1; j += 1) {
              var pe = 0;
              m.isDark(O, j) && (pe += 1), m.isDark(O + 1, j) && (pe += 1), m.isDark(O, j + 1) && (pe += 1), m.isDark(O + 1, j + 1) && (pe += 1), (pe == 0 || pe == 4) && (S += 3);
            }
          for (var O = 0; O < d; O += 1)
            for (var j = 0; j < d - 6; j += 1)
              m.isDark(O, j) && !m.isDark(O, j + 1) && m.isDark(O, j + 2) && m.isDark(O, j + 3) && m.isDark(O, j + 4) && !m.isDark(O, j + 5) && m.isDark(O, j + 6) && (S += 40);
          for (var j = 0; j < d; j += 1)
            for (var O = 0; O < d - 6; O += 1)
              m.isDark(O, j) && !m.isDark(O + 1, j) && m.isDark(O + 2, j) && m.isDark(O + 3, j) && m.isDark(O + 4, j) && !m.isDark(O + 5, j) && m.isDark(O + 6, j) && (S += 40);
          for (var _e = 0, j = 0; j < d; j += 1)
            for (var O = 0; O < d; O += 1)
              m.isDark(O, j) && (_e += 1);
          var Ne = Math.abs(100 * _e / d / d - 50) / 5;
          return S += Ne * 10, S;
        }, b;
      })(), l = (function() {
        for (var C = new Array(256), L = new Array(256), v = 0; v < 8; v += 1)
          C[v] = 1 << v;
        for (var v = 8; v < 256; v += 1)
          C[v] = C[v - 4] ^ C[v - 5] ^ C[v - 6] ^ C[v - 8];
        for (var v = 0; v < 255; v += 1)
          L[C[v]] = v;
        var p = {};
        return p.glog = function(b) {
          if (b < 1)
            throw "glog(" + b + ")";
          return L[b];
        }, p.gexp = function(b) {
          for (; b < 0; )
            b += 255;
          for (; b >= 256; )
            b -= 255;
          return C[b];
        }, p;
      })();
      function u(C, L) {
        if (typeof C.length > "u")
          throw C.length + "/" + L;
        var v = (function() {
          for (var b = 0; b < C.length && C[b] == 0; )
            b += 1;
          for (var $ = new Array(C.length - b + L), m = 0; m < C.length - b; m += 1)
            $[m] = C[m + b];
          return $;
        })(), p = {};
        return p.getAt = function(b) {
          return v[b];
        }, p.getLength = function() {
          return v.length;
        }, p.multiply = function(b) {
          for (var $ = new Array(p.getLength() + b.getLength() - 1), m = 0; m < p.getLength(); m += 1)
            for (var d = 0; d < b.getLength(); d += 1)
              $[m + d] ^= l.gexp(l.glog(p.getAt(m)) + l.glog(b.getAt(d)));
          return u($, 0);
        }, p.mod = function(b) {
          if (p.getLength() - b.getLength() < 0)
            return p;
          for (var $ = l.glog(p.getAt(0)) - l.glog(b.getAt(0)), m = new Array(p.getLength()), d = 0; d < p.getLength(); d += 1)
            m[d] = p.getAt(d);
          for (var d = 0; d < b.getLength(); d += 1)
            m[d] ^= l.gexp(l.glog(b.getAt(d)) + $);
          return u(m, 0).mod(b);
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
        ], L = function(b, $) {
          var m = {};
          return m.totalCount = b, m.dataCount = $, m;
        }, v = {}, p = function(b, $) {
          switch ($) {
            case o.L:
              return C[(b - 1) * 4 + 0];
            case o.M:
              return C[(b - 1) * 4 + 1];
            case o.Q:
              return C[(b - 1) * 4 + 2];
            case o.H:
              return C[(b - 1) * 4 + 3];
            default:
              return;
          }
        };
        return v.getRSBlocks = function(b, $) {
          var m = p(b, $);
          if (typeof m > "u")
            throw "bad rs block @ typeNumber:" + b + "/errorCorrectionLevel:" + $;
          for (var d = m.length / 3, S = [], O = 0; O < d; O += 1)
            for (var j = m[O * 3 + 0], ae = m[O * 3 + 1], oe = m[O * 3 + 2], de = 0; de < j; de += 1)
              S.push(L(ae, oe));
          return S;
        }, v;
      })(), k = function() {
        var C = [], L = 0, v = {};
        return v.getBuffer = function() {
          return C;
        }, v.getAt = function(p) {
          var b = Math.floor(p / 8);
          return (C[b] >>> 7 - p % 8 & 1) == 1;
        }, v.put = function(p, b) {
          for (var $ = 0; $ < b; $ += 1)
            v.putBit((p >>> b - $ - 1 & 1) == 1);
        }, v.getLengthInBits = function() {
          return L;
        }, v.putBit = function(p) {
          var b = Math.floor(L / 8);
          C.length <= b && C.push(0), p && (C[b] |= 128 >>> L % 8), L += 1;
        }, v;
      }, _ = function(C) {
        var L = a.MODE_NUMBER, v = C, p = {};
        p.getMode = function() {
          return L;
        }, p.getLength = function(m) {
          return v.length;
        }, p.write = function(m) {
          for (var d = v, S = 0; S + 2 < d.length; )
            m.put(b(d.substring(S, S + 3)), 10), S += 3;
          S < d.length && (d.length - S == 1 ? m.put(b(d.substring(S, S + 1)), 4) : d.length - S == 2 && m.put(b(d.substring(S, S + 2)), 7));
        };
        var b = function(m) {
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
        var L = a.MODE_ALPHA_NUM, v = C, p = {};
        p.getMode = function() {
          return L;
        }, p.getLength = function($) {
          return v.length;
        }, p.write = function($) {
          for (var m = v, d = 0; d + 1 < m.length; )
            $.put(
              b(m.charAt(d)) * 45 + b(m.charAt(d + 1)),
              11
            ), d += 2;
          d < m.length && $.put(b(m.charAt(d)), 6);
        };
        var b = function($) {
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
        var L = a.MODE_8BIT_BYTE, v = s.stringToBytes(C), p = {};
        return p.getMode = function() {
          return L;
        }, p.getLength = function(b) {
          return v.length;
        }, p.write = function(b) {
          for (var $ = 0; $ < v.length; $ += 1)
            b.put(v[$], 8);
        }, p;
      }, y = function(C) {
        var L = a.MODE_KANJI, v = s.stringToBytesFuncs.SJIS;
        if (!v)
          throw "sjis not supported.";
        (function($, m) {
          var d = v($);
          if (d.length != 2 || (d[0] << 8 | d[1]) != m)
            throw "sjis not supported.";
        })("友", 38726);
        var p = v(C), b = {};
        return b.getMode = function() {
          return L;
        }, b.getLength = function($) {
          return ~~(p.length / 2);
        }, b.write = function($) {
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
        }, b;
      }, w = function() {
        var C = [], L = {};
        return L.writeByte = function(v) {
          C.push(v & 255);
        }, L.writeShort = function(v) {
          L.writeByte(v), L.writeByte(v >>> 8);
        }, L.writeBytes = function(v, p, b) {
          p = p || 0, b = b || v.length;
          for (var $ = 0; $ < b; $ += 1)
            L.writeByte(v[$ + p]);
        }, L.writeString = function(v) {
          for (var p = 0; p < v.length; p += 1)
            L.writeByte(v.charCodeAt(p));
        }, L.toByteArray = function() {
          return C;
        }, L.toString = function() {
          var v = "";
          v += "[";
          for (var p = 0; p < C.length; p += 1)
            p > 0 && (v += ","), v += C[p];
          return v += "]", v;
        }, L;
      }, E = function() {
        var C = 0, L = 0, v = 0, p = "", b = {}, $ = function(d) {
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
        return b.writeByte = function(d) {
          for (C = C << 8 | d & 255, L += 8, v += 1; L >= 6; )
            $(C >>> L - 6), L -= 6;
        }, b.flush = function() {
          if (L > 0 && ($(C << 6 - L), C = 0, L = 0), v % 3 != 0)
            for (var d = 3 - v % 3, S = 0; S < d; S += 1)
              p += "=";
        }, b.toString = function() {
          return p;
        }, b;
      }, N = function(C) {
        var L = C, v = 0, p = 0, b = 0, $ = {};
        $.read = function() {
          for (; b < 8; ) {
            if (v >= L.length) {
              if (b == 0)
                return -1;
              throw "unexpected end of file./" + b;
            }
            var d = L.charAt(v);
            if (v += 1, d == "=")
              return b = 0, -1;
            if (d.match(/^\s$/))
              continue;
            p = p << 6 | m(d.charCodeAt(0)), b += 6;
          }
          var S = p >>> b - 8 & 255;
          return b -= 8, S;
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
      }, Q = function(C, L) {
        var v = C, p = L, b = new Array(C * L), $ = {};
        $.setPixel = function(O, j, ae) {
          b[j * v + O] = ae;
        }, $.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(v), O.writeShort(p), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(v), O.writeShort(p), O.writeByte(0);
          var j = 2, ae = d(j);
          O.writeByte(j);
          for (var oe = 0; ae.length - oe > 255; )
            O.writeByte(255), O.writeBytes(ae, oe, 255), oe += 255;
          O.writeByte(ae.length - oe), O.writeBytes(ae, oe, ae.length - oe), O.writeByte(0), O.writeString(";");
        };
        var m = function(O) {
          var j = O, ae = 0, oe = 0, de = {};
          return de.write = function(le, pe) {
            if (le >>> pe)
              throw "length over";
            for (; ae + pe >= 8; )
              j.writeByte(255 & (le << ae | oe)), pe -= 8 - ae, le >>>= 8 - ae, oe = 0, ae = 0;
            oe = le << ae | oe, ae = ae + pe;
          }, de.flush = function() {
            ae > 0 && j.writeByte(oe);
          }, de;
        }, d = function(O) {
          for (var j = 1 << O, ae = (1 << O) + 1, oe = O + 1, de = S(), le = 0; le < j; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(j)), de.add(String.fromCharCode(ae));
          var pe = w(), _e = m(pe);
          _e.write(j, oe);
          var Ne = 0, Pe = String.fromCharCode(b[Ne]);
          for (Ne += 1; Ne < b.length; ) {
            var st = String.fromCharCode(b[Ne]);
            Ne += 1, de.contains(Pe + st) ? Pe = Pe + st : (_e.write(de.indexOf(Pe), oe), de.size() < 4095 && (de.size() == 1 << oe && (oe += 1), de.add(Pe + st)), Pe = st);
          }
          return _e.write(de.indexOf(Pe), oe), _e.write(ae, oe), _e.flush(), pe.toByteArray();
        }, S = function() {
          var O = {}, j = 0, ae = {};
          return ae.add = function(oe) {
            if (ae.contains(oe))
              throw "dup key:" + oe;
            O[oe] = j, j += 1;
          }, ae.size = function() {
            return j;
          }, ae.indexOf = function(oe) {
            return O[oe];
          }, ae.contains = function(oe) {
            return typeof O[oe] < "u";
          }, ae;
        };
        return $;
      }, q = function(C, L, v) {
        for (var p = Q(C, L), b = 0; b < L; b += 1)
          for (var $ = 0; $ < C; $ += 1)
            p.setPixel($, b, v($, b));
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
  })(Nn)), Nn.exports;
}
var G0 = V0();
const K0 = /* @__PURE__ */ z0(G0), Y0 = ["width", "height", "viewBox"], J0 = ["width", "height"], Z0 = ["d"], Q0 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = D(() => {
      const s = K0(0, "M");
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
      }, null, 8, J0),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Z0)
    ], 8, Y0));
  }
}, nv = /* @__PURE__ */ Y(Q0, [["__scopeId", "data-v-489f0852"]]), sv = Ho(() => import("./VoiceFigure-D5I1Oxi7.js").then((e) => e.V)), av = "1.0.0", ov = "3.5";
export {
  sg as $,
  Mg as A,
  Ge as B,
  Lg as C,
  xg as D,
  Rg as E,
  mg as F,
  Ao as G,
  jp as H,
  Dp as I,
  qg as J,
  mt as K,
  Og as L,
  Te as M,
  bt as N,
  Sg as O,
  gn as P,
  Eg as Q,
  w1 as R,
  yo as S,
  $g as T,
  Bg as U,
  aa as V,
  bp as W,
  pp as X,
  Wg as Y,
  Dg as Z,
  Y as _,
  ie as a,
  ye as a0,
  ls as a1,
  ag as a2,
  Ru as a3,
  ev as a4,
  fg as a5,
  Kt as a6,
  Hg as a7,
  eg as a8,
  eo as a9,
  Jg as aA,
  Qg as aB,
  hg as aC,
  ug as aD,
  lg as aE,
  Ug as aF,
  Lf as aG,
  pt as aH,
  ig as aI,
  Vg as aJ,
  Kg as aK,
  Cm as aL,
  tm as aM,
  zg as aN,
  Gd as aO,
  va as aP,
  Yg as aQ,
  Ee as aa,
  av as ab,
  ov as ac,
  Gg as ad,
  cg as ae,
  xm as af,
  Sm as ag,
  Tm as ah,
  og as ai,
  Xg as aj,
  nv as ak,
  Rr as al,
  tg as am,
  dg as an,
  Zn as ao,
  At as ap,
  rg as aq,
  ng as ar,
  tv as as,
  ca as at,
  ct as au,
  Vd as av,
  sv as aw,
  tt as ax,
  Bs as ay,
  Zg as az,
  Ke as b,
  _g as c,
  vg as d,
  yg as e,
  gg as f,
  jg as g,
  ho as h,
  Ag as i,
  Cg as j,
  Tg as k,
  Ng as l,
  wg as m,
  pg as n,
  kg as o,
  tn as p,
  Fg as q,
  Ig as r,
  bg as s,
  De as t,
  fp as u,
  Pg as v,
  gp as w,
  gs as x,
  N1 as y,
  P1 as z
};
