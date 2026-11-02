/* @code-commandments-generated */
import { openBlock as l, createElementBlock as d, renderSlot as we, createElementVNode as p, normalizeClass as ee, Fragment as Q, renderList as re, normalizeStyle as be, defineComponent as zo, Comment as Vo, h as ps, cloneVNode as Go, createBlock as K, withCtx as V, unref as G, createVNode as H, toDisplayString as b, createCommentVNode as N, inject as Ae, computed as C, resolveDynamicComponent as lt, Transition as It, watch as ke, ref as j, shallowRef as pn, TransitionGroup as Ko, mergeProps as ot, reactive as ms, createTextVNode as he, onMounted as De, onUnmounted as Ce, nextTick as Rt, useId as wa, Teleport as ka, withModifiers as _e, isRef as Bs, onBeforeUnmount as yt, resolveDirective as Yo, withDirectives as rt, useModel as zn, useAttrs as ba, getCurrentInstance as Jo, mergeModels as Vn, getCurrentScope as $a, onScopeDispose as xa, provide as Zo, onErrorCaptured as Xo, toHandlers as Qo, createSlots as er, vShow as tr, withKeys as en, vModelText as Gn, defineAsyncComponent as nr } from "vue";
const Z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, sr = { class: "skeleton-line" }, ar = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", sr, [
      we(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: ee(["bars", { faded: e.filled }])
      }, [
        (l(!0), d(Q, null, re(e.bars, (s) => (l(), d("span", {
          key: s.width,
          class: ee(["bar", { still: e.still }]),
          style: be({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Qe = /* @__PURE__ */ Z(ar, [["__scopeId", "data-v-0ebb6933"]]), gs = zo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Vo);
      return s.length !== 1 ? ps(Q, { key: n }, s) : s[0].key == null ? Go(s[0], { key: n }) : s[0];
    };
  }
}), or = ["aria-label"], rr = ["aria-label"], ir = ["aria-label"], lr = ["aria-label"], cr = ["aria-label"], ur = ["aria-label"], dr = ["aria-label"], hr = {
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
    return (c, u) => (l(), K(gs, { value: e.shape }, {
      messages: V(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), d(Q, null, re(t, (f) => p("div", {
            key: f.id,
            class: ee(["skeleton-message", { mine: f.mine }]),
            style: be({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, or)
      ]),
      older: V(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, re(t.slice(0, 3), (f) => (l(), d("div", {
            key: f.id,
            class: ee(["skeleton-message", { mine: f.mine }]),
            style: be({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, rr)
      ]),
      cards: V(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, re(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (l(), d(Q, null, re(n, (g) => H(Qe, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ir)
      ]),
      file: V(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, re(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            H(Qe, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), d(Q, null, re(a, (g) => H(Qe, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, lr)
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
          (l(!0), d(Q, null, re(e.count, (f) => (l(), K(Qe, {
            key: f,
            bars: G(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, cr)
      ]),
      text: V(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, re(e.count, (f) => (l(), K(Qe, {
            key: f,
            bars: G(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ur)
      ]),
      default: V(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, re(e.count, (f) => (l(), K(Qe, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, dr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, wt = /* @__PURE__ */ Z(hr, [["__scopeId", "data-v-c687fb85"]]), fr = {
  key: 1,
  class: "empty-state titled"
}, pr = { class: "empty-state-title" }, mr = { class: "empty-state-text" }, gr = {
  key: 2,
  class: "empty-state"
}, vr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), K(wt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", fr, [
      p("p", pr, b(e.title), 1),
      p("p", mr, [
        we(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", gr, [
      we(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, tn = /* @__PURE__ */ Z(vr, [["__scopeId", "data-v-b27e89b0"]]), yr = { class: "fold-group" }, wr = ["aria-expanded"], kr = { class: "fold-label" }, br = {
  key: 0,
  class: "fold-count"
}, $r = {
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
    return (s, a) => (l(), d("div", yr, [
      p("button", {
        type: "button",
        class: ee(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", kr, b(e.label), 1),
        e.count !== "" ? (l(), d("span", br, b(e.count), 1)) : N("", !0),
        p("span", {
          class: ee(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, wr),
      e.open ? we(s.$slots, "default", {}, void 0, !0, 0) : N("", !0)
    ]));
  }
}, Bv = /* @__PURE__ */ Z($r, [["__scopeId", "data-v-9ef1865c"]]), xr = Symbol("open-view"), Ne = Symbol.for("journal.window-context");
function vs() {
  const e = Ae(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Mr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: be({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, _r = /* @__PURE__ */ Z(Mr, [["__scopeId", "data-v-eb453d6f"]]), Sr = {
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
      return t.busy || t.disabled || !!((s = Ae(Ne, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), K(lt(e.href ? "a" : "button"), {
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
        e.busy ? (l(), K(_r, {
          key: 0,
          class: "btn-spinner"
        })) : N("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ye = /* @__PURE__ */ Z(Sr, [["__scopeId", "data-v-a2dc4bda"]]), Er = {
  class: "running",
  "data-running-command": ""
}, Ar = ["title"], Cr = {
  key: "idle",
  class: "running-idle"
}, Or = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", Er, [
      H(It, {
        name: "roll",
        mode: "out-in"
      }, {
        default: V(() => [
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, Ar)) : (l(), d("span", Cr, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Iv = /* @__PURE__ */ Z(Or, [["__scopeId", "data-v-d3240219"]]), Tr = ["aria-checked", "aria-label", "title"], Br = {
  key: 0,
  class: "switch-inner"
}, Ir = {
  key: 0,
  class: "switch-word"
}, Rr = {
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
        e.labelled ? (l(), d("span", Br, b(e.word), 1)) : N("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Ir, b(e.word), 1)) : N("", !0)
    ], 10, Tr));
  }
}, Rv = /* @__PURE__ */ Z(Rr, [["__scopeId", "data-v-1bfb90f3"]]);
function Ma(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Ct(e, t) {
  return Ma(() => localStorage, e, t);
}
function _a(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function mn(e, t) {
  return _a(() => localStorage, e, t);
}
function Sa(e, t) {
  ke(t, (n) => mn(e, n), { deep: !0 });
}
function Lr(e, t) {
  return Ma(() => sessionStorage, e, t);
}
function Dr(e, t) {
  return _a(() => sessionStorage, e, t);
}
const nn = "journal.environment", Ea = j(Lr(nn, Ct(nn, "")));
function Nr(e) {
  Ea.value = e, Dr(nn, e), mn(nn, e);
}
const sn = j(location.hash), Is = pn(null), Rs = { integrations: "mcp", library: "team" };
function jr() {
  if (!Is.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Rs[n]) {
    location.replace(`#/${[Rs[n], ...s].join("/")}${t ? `?${t}` : ""}`), sn.value = location.hash;
    return;
  }
  !n || Is.value(n) || (Nr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), sn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  sn.value = location.hash, jr();
});
const Pe = C(() => {
  const [e, t = ""] = sn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", f = "", g = ""] = i.split(":");
    return { table: u, id: Number(f), comment: Number(g) || 0, env: c };
  });
  return {
    env: Ea.value,
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
function Pr(e = "", t = 0, n = "") {
  location.hash = gn.page(e, t, n);
}
const qr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Aa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(qr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function Lv(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Ca(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = gt[e]) != null && r.call(gt, t))) return;
  const a = Pe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Aa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Wr(e, t, n, s = 0, a = "") {
  if (e === Pe.value.env) return Ca(t, n, s, a);
  const o = Pe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Aa([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function it(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Wr(s, a, Number(o), 0, t) : Ca(a, Number(o), 0, t);
}
function Fr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function mt(e) {
  const t = Fr(e);
  t && it(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Hr = ["stroke-width", "innerHTML"], xe = {
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
    }, null, 12, Hr));
  }
}, ys = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), K(ye, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: V(() => [
        H(xe, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Ur = {
  key: 1,
  class: "row-list-failure"
}, zr = ["data-row"], Vr = {
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
    const t = e, n = C(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = j(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (l(), K(wt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", Ur, b(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), K(tn, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(Q, { key: 3 }, [
      (l(), K(lt(e.arrival ? Ko : "ul"), ot(n.value, { class: "row-list" }), {
        default: V(() => [
          (l(!0), d(Q, null, re(e.rows, (i) => (l(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            we(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, zr))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : N("", !0)
    ], 64));
  }
}, Gr = /* @__PURE__ */ Z(Vr, [["__scopeId", "data-v-a096d68d"]]), Kr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Yr = {
  key: 1,
  class: "agent-rows-note"
}, Jr = {
  key: 2,
  class: "agent-rows-note"
}, Zr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Xr = ["data-agent-row", "onClick"], Qr = { class: "agent-row-name" }, ei = { class: "agent-row-state" }, ti = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = C(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", Kr, [
      e.loaded ? e.failure ? (l(), d("p", Yr, b(e.failure), 1)) : e.rows.length ? (l(), d(Q, { key: 3 }, [
        p("p", Zr, b(s.value) + " running", 1),
        (l(!0), d(Q, null, re(n.value, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => G(it)(`agents:${r.id}`)
        }, [
          p("span", Qr, "#" + b(r.id) + " " + b(r.session), 1),
          p("span", ei, b(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Xr))), 128))
      ], 64)) : (l(), d("p", Jr, b(e.none), 1)) : (l(), K(wt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Dv = /* @__PURE__ */ Z(ti, [["__scopeId", "data-v-a01e5a17"]]), ni = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["badge", e.tone])
    }, b(e.text), 3));
  }
}, Oa = /* @__PURE__ */ Z(ni, [["__scopeId", "data-v-9e7e1157"]]), si = ["aria-valuenow", "aria-valuemax"], ai = {
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
      class: ee(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: be({ width: n.value })
      }, null, 4)
    ], 10, si));
  }
}, oi = /* @__PURE__ */ Z(ai, [["__scopeId", "data-v-9eba6a85"]]), ri = { class: "bars" }, ii = { class: "bar-name" }, li = { class: "bar-value" }, ci = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = C(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = C(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", ri, [
      (l(!0), d(Q, null, re(e.items, (c, u) => (l(), K(lt(c.open ? "button" : "div"), {
        key: `${u}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: ee(["bar-row", c.tone, { opens: c.open }]),
        onClick: (f) => c.open && s("open", c.open)
      }, {
        default: V(() => [
          p("span", ii, b(c.label), 1),
          H(oi, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", li, b(c.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ui = /* @__PURE__ */ Z(ci, [["__scopeId", "data-v-663427f4"]]), di = { class: "bars" }, hi = {
  key: 0,
  class: "bars-title"
}, fi = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", di, [
      e.node.title ? (l(), d("span", hi, b(e.node.title), 1)) : N("", !0),
      H(ui, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, pi = /* @__PURE__ */ Z(fi, [["__scopeId", "data-v-7135bb11"]]), mi = {
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
      class: ee([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: be(o.value)
    }, [
      (l(!0), d(Q, null, re(e.node.children || [], (c, u) => (l(), K(oo, {
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (f) => a("open", f)),
        onFile: i[1] || (i[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Jt = /* @__PURE__ */ Z(mi, [["__scopeId", "data-v-d142a3f4"]]), gi = {
  key: 0,
  class: "card-head"
}, vi = { class: "card-title" }, yi = {
  key: 0,
  class: "card-note"
}, wi = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: ee(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), d("header", gi, [
        p("span", vi, b(e.node.title), 1),
        e.node.note ? (l(), d("span", yi, b(e.node.note), 1)) : N("", !0)
      ])) : N("", !0),
      H(Jt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, ki = /* @__PURE__ */ Z(wi, [["__scopeId", "data-v-67b72d40"]]), bi = (e, t, n) => Math.max(t, Math.min(n, e)), $i = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Me = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ls = (e) => (e || "").split(`
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
}, xi = (e) => (Ns[e.table] ? Ns[e.table](e) : e.title || "") || "", Mi = ["done", "cancelled"], Kn = {
  tasks: (e) => Me(e.completed_at) || (e.state === "cancelled" ? Me(e.updated_at) : 0),
  questions: (e) => e.answer ? Me(e.updated_at) : 0,
  plans: (e) => Mi.includes(e.state) ? Me(e.updated_at) : 0,
  notices: (e) => Me(e.closed_at),
  secrets: (e) => Me(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Me(e.updated_at) : 0,
  shares: (e) => Me(e.stopped_at),
  dumps: (e) => Me(e.completed_at),
  agents: (e) => e.state === "ended" ? Me(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Me(e.created_at) : 0
}, _i = (e) => Kn[e.table] ? Kn[e.table](e) : 0, Ta = (e) => _i(e) > 0, Si = (e) => !!Kn[e], Ba = (e) => Me(e.created_at), an = (e) => Me(e.updated_at) || Ba(e), Ei = (e) => "task_ids" in e, vn = typeof document < "u" && document.documentElement.classList.contains("phone"), Ai = "Files are attached on the computer; the phone sends text.", Ia = 1024, Ci = Ia * 1024 * 1024, Oi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ia} MB limit for one file.`;
function Ti() {
  return () => {
  };
}
function js(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Bi(e = window) {
  if (!js(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    js(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ra = "status.summary", ve = ms({
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
}), Ii = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, La = () => !!ve.countdown || Ii() || ve.starting;
function Ri(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function Li(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Di() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Ni(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Di(), !0);
}
let Ft = { version: "", started: 0 };
function ji(e) {
  return e.version ? (Ft.version || (Ft = { version: e.version, started: e.started || 0 }), e.version !== Ft.version || (e.started || 0) !== Ft.started) : !1;
}
function Pi(e) {
  Li(e.countdown), Ri(e.ready, e.step), (Ni(!!e.updating, e.step) || !e.updating && !qi(e) && ji(e)) && Bi(window);
}
const qi = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Ps = 2e4, Wi = 3e5, Fe = 6e5, Ht = 6, Fi = 500, Hi = "/journal/summary", qs = vn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ui = (e) => e.split("?")[0].endsWith(Hi), Da = (e, t) => Object.assign(new Error(t), { status: e });
async function zi(e, t, n = Da) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Vi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Gi {
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
        signal: AbortSignal.timeout(a || (i ? Wi : Ps))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, Fi)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Ht, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Ti(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return zi(c, `${c.status} ${c.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: qs, signal: AbortSignal.timeout(Ps) });
    if (!n.ok) throw Da(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Ht, o).then((c) => (this.written(n), c));
    if (La() && !Ui(n))
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
const je = new Gi(), Ee = (e) => encodeURIComponent(e);
function de(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const $t = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), xt = "the page does not know its environment yet", Ki = "X-Journal-Env", Yi = "X-Journal-Request-At", Mn = "/viewer/voices/figures/";
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
    return { [Yi]: String(Date.now()), ...this.env() ? { [Ki]: this.env() } : {} };
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
    return je.stream(this.address("/entries/stream" + n));
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
    if (vn) return Promise.reject(Object.assign(new Error(Ai), { status: 403 }));
    if (s.size > Ci) return Promise.reject(new Error(Oi(s)));
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
const ie = new ws({ base: vn ? "/p" : "" }), Ji = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Zi = { claude: "Claude Code", codex: "Codex" };
Object.entries(Zi).map(([e, t]) => ({ key: e, label: t }));
const Ws = (e) => e.status === "stopped" ? 1 : 0, Xi = "main", Qi = (e) => e.filter((t) => t.role === Xi).sort((t, n) => Ws(t) - Ws(n) || Me(n.heard_at) - Me(t.heard_at))[0] || null, el = { me: 1, people: [] }, Y = ms({
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
  people: el,
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
Sa("journal.activity", () => Y.activity);
Sa("journal.side.mini", () => Y.sideMini);
const vt = C(() => Qi(Y.agents));
C(() => !!vt.value && Y.live.some((e) => e.agent.session === vt.value.session && e.environment === Pe.value.env));
C(() => !!vt.value && ["busy", "working"].includes(vt.value.status));
function tl(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Yn(e) {
  const t = tl(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Na(e) {
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
function nl(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${_n(t % 60)}s` : `${Math.floor(t / 3600)}h ${_n(Math.floor(t % 3600 / 60))}m ${_n(t % 60)}s`;
}
const sl = ["working", "busy", "waiting", "compacting"], al = (e) => sl.includes(e), ol = "builder";
C(() => !Y.settings || Y.settings.features.file_feed !== !1);
const rl = C(() => !Y.settings || Y.settings.features.status_bar !== !1);
C(() => Y.settings && Y.settings.workers && Y.settings.workers.mode || ol);
C(() => !Y.settings || !Y.settings.tasks || Y.settings.tasks.auto !== !1);
C(() => !!(Y.settings && Y.settings.reviewing && Y.settings.reviewing.reviewer));
C(() => !Y.settings || Y.settings.features.sharing !== !1);
const on = 50, ks = 100, il = { messages: 25 }, Le = (e) => il[e] || on;
function ll(e, t) {
  if (e !== "messages") return Math.max(t.length - Le(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Le(e)) return s;
  return 0;
}
const cl = "review_step", ul = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === cl).sort((t, n) => t.id - n.id), dl = 5, hl = 500, fl = 3e3, pl = () => Y.entries.length ? Y.entries[Y.entries.length - 1].id : 0, Zt = { env: "", id: 0 }, ml = () => !!(Y.bar && Y.bar.length) || al(vt.value && vt.value.status);
function gl({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function vl() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: ks })))).then(ul);
}
function yl() {
  return Zt.env !== ie.env() && Object.assign(Zt, { env: ie.env(), id: pl() }), ie.entries(Zt.id);
}
function wl(e) {
  e.length && (Zt.id = e[e.length - 1].id, uc(e));
}
async function kl({ scope: e, table: t, id: n }) {
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
const zs = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
    every: () => ml() ? hl : fl,
    take: (e) => Array.isArray(e) && (Y.bar = e),
    active: () => rl.value
  },
  "agents.index": { read: () => Us(ie, dl), every: 1e3, take: (e) => Y.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => Y.live = e },
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
      Y.summary = e, Pi(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => Y.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => Y.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (Y.people = e) },
  "entries.recent": { read: yl, every: 1e3, take: wl },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: gl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => Zn("workers.index", Le("workers")), every: 5e3 },
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Zn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: vl, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Le("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: kl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
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
}), bl = 6e4, $l = 3e3, xl = 4, Ml = 300, _l = 5e3, ja = /* @__PURE__ */ new Map();
function yn(e) {
  if (!(e in zs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return zs[e];
}
function Sl(e) {
  const t = yn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return _l;
  }
}
const El = (e) => e / 2 + Math.random() * e / 2, Pa = (e) => [...e.users.values()].pop(), bs = (e) => ja.get(e.place) === e, Al = () => Math.random() * Ml, $s = () => document.hidden;
function Cl(e) {
  const t = Sl(e);
  return e.failures ? El(Math.min(e.key === Ra ? $l : bl, t * 2 ** e.failures)) : Math.max(t, xl * e.took);
}
function qa(e, t) {
  clearTimeout(e.timer), !(!bs(e) || e.paused || $s()) && (e.timer = setTimeout(() => Ol(e), t));
}
function Ol(e) {
  return bs(e) ? e.running ? (e.again = !0, e.running) : (e.running = Rl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Tl = (e) => {
  var t, n;
  return !e.paused && !$s() && (((n = (t = yn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Pa(e).active() && (!La() || e.key === Ra);
};
async function Bl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => yn(e.key).read(Pa(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Il(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = yn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Rl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Tl(e) && Il(e, await Bl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && bs(e) && !e.paused);
  qa(e, Cl(e));
}
const Ll = () => $s() || ja.forEach((e) => qa(e, Al()));
document.addEventListener("visibilitychange", Ll);
const Dl = 60, Nl = (e, t) => Me(e.created_at) >= Me(t.created_at) - Dl, jl = (e, t) => e.id > 0 && e.table === t.table && Nl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), xs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => jl(s, n))), Sn = [
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
}, Pl = ["secrets", "plugins"], Wa = Object.keys(Lt).filter((e) => !(vn && Pl.includes(e)));
C(() => Wa.map((e) => ({ name: e, ...Lt[e] })));
const Dt = (e) => Lt[e], Fa = new Map(Wa.flatMap((e) => [e, e.replace(/s$/, ""), Lt[e].title.toLowerCase()].map((t) => [t, e]))), at = (e) => Fa.get(String(e).toLowerCase()) || "", Ha = [...Fa.keys()].sort((e, t) => t.length - e.length).join("|"), Xe = /* @__PURE__ */ new Set(), Ms = j(0), Nt = /* @__PURE__ */ new Set(), jt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Xn = /* @__PURE__ */ new Set(), ql = /* @__PURE__ */ new Map(), Wl = /* @__PURE__ */ new Map();
let pt = !1, Mt = null;
const Fl = (e, t) => e.id - t.id, Hl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Ul = { messages: Hl }, Ua = (e) => Ul[e] || Fl;
function za(e) {
  return Ms.value, Xe.has(e) || (Xe.add(e), Y.booted && (!Nt.has(e) || jt.has(e)) && queueMicrotask(() => kn([e], !1))), Y.rows[e] || [];
}
function zl(e) {
  const t = Y.rows[e] || [], n = ll(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  Y.rows[e] = t.filter((a) => s.has(a) || Si(e) && !Ta(a)), Y.paging.size[e] = Le(e), Y.paging.more[e] = !0;
}
const Vl = /* @__PURE__ */ new Set();
function Gl() {
  Xe.forEach(zl), Xe.clear(), ql.clear(), Wl.clear(), Ms.value += 1;
}
ke(() => `${Pe.value.env}/${Pe.value.page}/${Pe.value.open ? Pe.value.open.table : ""}`, Gl);
ke(
  () => Y.booted,
  (e) => e && kn(
    [...Xe].filter((t) => !Nt.has(t)),
    !1
  )
);
const Qn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Ei(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Va(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Qn(s) && !Qn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Ga(e, t) {
  Nt.add(e), Ms.value += 1;
  const n = Y.rows[e] || [];
  Y.rows[e] = [...Va(n, t.rows), ...xs(n.filter((s) => s.id === 0), t.rows)], Y.paging.size[e] = Y.paging.size[e] || Le(e), Y.paging.more[e] = !t.is_last_page;
}
async function Kl(e) {
  const t = new Set((Y.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Le(e) });
  wn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = xs((Y.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Ga(e, { ...n, rows: [...n.rows, ...a].sort(Ua(e)) }), Y.paging.size[e] = Le(e), Ka.has(e) && await Ya(e), Y.rows[e];
}
const wn = (e, t) => Y.counts = { ...Y.counts, [e]: t };
async function Yl(e) {
  const t = Y.rows[e] || [], n = Math.max(0, ...t.map(an)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ie.list(e, { limit: Le(e), since: n, after: s });
  if (wn(e, a.counts), !a.is_last_page) return Kl(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = xs(t.filter((i) => !o.has(i.id)), a.rows).concat(Va(t, a.rows));
  return Y.rows[e] = r.sort(Ua(e)), Y.paging.size[e] = Y.rows[e].length, Y.rows[e];
}
const En = /* @__PURE__ */ new Set();
async function Jl(e, t = !1) {
  e.forEach((n) => jt.delete(n)), e.forEach((n) => Xn.add(n));
  try {
    await sc(e, t);
  } finally {
    e.forEach((n) => Xn.delete(n));
  }
}
async function Zl(e) {
  const t = await ie.list(e, { limit: Le(e) });
  wn(e, t.counts), Ga(e, t);
}
async function Xl(e) {
  wn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Ka = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ya(e) {
  const t = (Y.rows[e] || []).filter((a) => Qn(a) && (e !== "plans" || !Ta(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  Y.rows[e] = (Y.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Ql = (e, t) => !Nt.has(e) || t && (Y.paging.size[e] || Le(e)) === Le(e) && !Vl.has(e);
async function ec(e, t) {
  if (!Xe.has(e)) return Xl(e);
  const n = await (Ql(e, t) ? Zl(e) : Yl(e));
  return Ka.has(e) && await Ya(e), n;
}
async function tc() {
  const [e, t] = await Promise.all([ie.entries(0, ks), ie.settings()]);
  Xa([...Ct(Za(), []), ...e]), JSON.stringify(t) !== JSON.stringify(Y.settings) && (Y.settings = t);
}
const nc = (e, t) => ec(e, t).then(
  () => null,
  () => e
);
async function sc(e, t) {
  const n = (await Promise.all(e.map((s) => nc(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), jt.add(s))), t && await tc(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ja = 1e3, ac = 15e3;
let Ut = Ja;
async function oc() {
  return Mt || (Mt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !En.has(e)) || pt; ) {
      const e = pt, t = [...e ? Object.keys(Y.rows) : Ke].filter((s) => Lt[s] && (Xe.has(s) || s in Y.rows)).filter((s) => e || !Xe.has(s) || jt.has(s) || !Nt.has(s)).filter((s) => !En.has(s)), n = [...Ke].filter((s) => En.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), pt = !1;
      try {
        await Jl(t, e), Ut = Ja;
      } catch {
        pt = pt || e, await new Promise((a) => setTimeout(a, Ut)), Ut = Math.min(Ut * 2, ac);
      }
    }
  })().finally(() => Mt = null), Mt);
}
function kn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Xn.has(n)).forEach((n) => {
    Ke.add(n), t && jt.add(n);
  }), Ke.has("settings") && (pt = !0), oc();
}
const Za = () => {
  var e;
  return `typed-entries:${((e = Y.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
function Xa(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  Y.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ks), mn(Za(), Y.entries.slice(-50));
}
const rc = ["created", "updated", "deleted"], ic = { phases: ["phases", "plans"] }, es = (e) => ic[e] || [e], lc = (e) => rc.includes(e.entry_type) ? [...es(e.data.table), ...(e.data.joins || []).flatMap(es)] : [];
function cc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of es(t.data.table).filter((s) => Y.rows[s]))
      Y.rows[n] = Y.rows[n].filter((s) => s.id !== t.data.id);
}
function uc(e) {
  Xa([...Y.entries, ...e]), cc(e), kn([...new Set(e.flatMap(lc))].filter((t) => t && t !== "agents"));
}
Ji((e) => Y.streamOpen || kn([e]));
const ts = [], dc = 2e3, Ge = /* @__PURE__ */ new Map(), hc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, fc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ct(e, { first: t = !1 } = {}) {
  t ? ts.unshift(e) : ts.push(e), Ge.clear();
}
function Qa(e, t, n) {
  var a;
  const s = za(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const pc = (e) => za(e.table).find((t) => t.id === e.id) === e.row, mc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function gc(e, t) {
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
  return vc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function vc(e) {
  return e.split(fc).map((t, n) => n % 2 ? t : t.replace(hc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Vs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function yc(e) {
  const [t, , ...n] = e, s = Vs(t).map((o) => `<th>${Ot(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Vs(o).map((r) => `<td>${Ot(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function wc(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Ot(a)}</li>`).join("")}</${s}>`;
}
const Gs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function eo(e) {
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
      n.push(yc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(wc(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${eo(
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
const kc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, bc = (e) => e.kind !== "text" && !kc.test(e.html);
function $c(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(eo(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : bc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ns(e, t = { env: "" }) {
  const n = mc(e, t), s = Ge.get(n);
  if (Ge.delete(n), s && s.reads.every(pc))
    return Ge.set(n, s), s.html;
  const a = [], o = $c(gc(e, { ...t, reads: a }));
  return Ge.set(n, { html: o, reads: a }), Ge.size > dc && Ge.delete(Ge.keys().next().value), o;
}
const to = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, rn = (e) => String(e || "").replace(to, (t, n, s, a) => a), xc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), zt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Mc = /^Traceback \(most recent call last\):/m, _c = 8;
function no(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, _c).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Sc(e) {
  const t = [...e.matchAll(xc)].map((s) => s.index);
  if (zt.lastIndex = 0, !t.length || !zt.test(e)) return null;
  zt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(zt)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: no(n), tail: "" } : null;
}
function Ec(e) {
  const t = Mc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: no([o]), tail: n.slice(a).join(`
`) };
}
ct((e) => {
  const t = rn(e), n = Ec(t) || Sc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const ss = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Ac = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Cc = `${ss} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Oc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Tc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ks = {
  js: { keywords: ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Ac, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Cc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Oc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Tc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Ys(e, t, n) {
  return n && e.startsWith(n, t);
}
function Bc(e, t) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], g = n.lower ? f.toLowerCase() : f, w = n.property && /^\s*:/.test(e.slice(o + f.length));
      r(s.has(g) ? "keyword" : w ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function Ic(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Bc(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Ue(r) : `<span class="tok-${s}">${Ue(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Rc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Lc = 1500, Js = /* @__PURE__ */ new WeakMap();
async function Dc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Rc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Js.get(t)), Js.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Lc)
  )));
}
typeof document < "u" && document.addEventListener("click", Dc, !0);
const Nc = /^(```|~~~)\s*(\w+)?\s*$/, jc = /^\s{4,}\S/, Pc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, qc = /^\s*(?:[-*+]|\d+[.)])\s/, so = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Wc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ao(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Fc(e) {
  const t = ao(e.join(`
`));
  return (Wc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Hc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && so.test(t) && !qc.test(t);
};
function Zs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Ic(ao(e.join(`
`)), t || Fc(e)).join(`
`)}</code></pre></div>` };
}
function Uc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Nc);
    if (r) {
      const c = t.findIndex((f, g) => g > o && f.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Zs(t.slice(o + 1, u).map(rn), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Hc(s) ? Pc : jc;
    if (i.test(t[o])) {
      let c = o;
      for (; c < t.length && (i.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && so.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
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
ct((e) => Uc(e));
const zc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Vc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Gc(e) {
  const t = zc.exec(e);
  if (t && at(t[1])) return { at: t.index, length: t[0].length, table: at(t[1]), id: Number(t[2]), label: t[3] };
  const n = Vc.exec(e), s = n && at(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Kc(e, t, n, s) {
  const a = Qa(s, e, t), o = rn(a ? xi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(Dt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
ct(
  (e, t) => {
    const n = Gc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Kc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Yc = /\.(png|jpe?g|gif|webp|svg)$/i, Jc = (e) => Yc.test(e), Zc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Xc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Qc(e, t) {
  const n = Zc.exec(e), [, s, a, o, r, i] = n || [], c = n && at(s || o), u = c && Qa(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const f = ie.in(t.env).fileUrl(c, u.id, i), g = `${Dt(c).title} ${u.id} · ${Ue(i)}`, w = Jc(i) ? `<img class="file-card-image" src="${f}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Ue(i)}">${w}<span class="file-card-name">${g}</span></a>` };
}
function eu(e) {
  const t = Xc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ct(
  (e, t) => {
    if (t.inline) return null;
    const n = Qc(e, t) || eu(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const tu = /`([^`\n]+)`/g;
ct((e) => e.replace(tu, (t, n) => `<code>${n}</code>`));
const Xs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${gn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ct(
  (e, t) => e.replace(to, (n, s, a, o) => Xs[s] ? Xs[s](a, o, t) : o)
);
const nu = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, su = new RegExp(`\\b(${Ha}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), au = new RegExp(`\\b(${Ha}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), ou = (e, t) => `<a class="row-pill" href="#" data-peek="${at(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, ru = (e) => e.replace(au, (t, n, s) => s.replace(/\d+/g, (a) => ou(n.replace(/s$/i, ""), a))), iu = (e) => ru(e).replace(
  su,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${at(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
ct(
  (e, t) => t.rowNames === !1 ? e : e.split(nu).map((n, s) => s % 2 ? n : iu(n)).join("")
);
const lu = ["innerHTML"], cu = ["innerHTML"], uu = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = C(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = ns(s, { env: Pe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => G(mt) && G(mt)(...o)),
      innerHTML: n.value
    }, null, 8, lu)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => G(mt) && G(mt)(...o)),
      innerHTML: n.value
    }, null, 8, cu));
  }
}, st = /* @__PURE__ */ Z(uu, [["__scopeId", "data-v-1a43d211"]]), du = { class: "fact" }, hu = { class: "fact-label" }, fu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", du, [
      p("span", hu, b(e.label), 1),
      H(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, pu = /* @__PURE__ */ Z(fu, [["__scopeId", "data-v-3a88ecf8"]]), mu = { class: "list" }, gu = { class: "list-label" }, vu = {
  key: 1,
  class: "list-note"
}, yu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", mu, [
      (l(!0), d(Q, null, re(e.items, (o, r) => (l(), K(lt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: ee(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          p("span", gu, b(o.label), 1),
          o.badge ? (l(), K(Oa, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : N("", !0),
          o.note ? (l(), d("span", vu, b(o.note), 1)) : N("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, wu = /* @__PURE__ */ Z(yu, [["__scopeId", "data-v-ebe2ae0a"]]), ku = { class: "table" }, bu = {
  key: 0,
  class: "table-row empty"
}, $u = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = C(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", ku, [
      p("div", {
        class: "table-row head",
        style: be(a.value)
      }, [
        (l(!0), d(Q, null, re(e.columns, (i) => (l(), d("span", {
          key: i,
          class: "cell"
        }, b(i), 1))), 128))
      ], 4),
      (l(!0), d(Q, null, re(e.rows, (i, c) => (l(), K(lt(i.open ? "button" : "div"), {
        key: c,
        type: i.open ? "button" : void 0,
        class: ee(["table-row", i.tone, { opens: i.open }]),
        style: be(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: V(() => [
          (l(!0), d(Q, null, re(i.cells, (u, f) => (l(), d("span", {
            key: f,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), d("div", bu, b(e.empty), 1)) : N("", !0)
    ]));
  }
}, xu = /* @__PURE__ */ Z($u, [["__scopeId", "data-v-9326a52e"]]), Mu = { class: "stat-value" }, _u = { class: "stat-label" }, Su = {
  key: 0,
  class: "stat-note"
}, Eu = {
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
    return (s, a) => (l(), K(lt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: ee(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        p("span", Mu, b(e.value), 1),
        p("span", _u, b(e.label), 1),
        e.note ? (l(), d("span", Su, b(e.note), 1)) : N("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Au = /* @__PURE__ */ Z(Eu, [["__scopeId", "data-v-ad0db6d6"]]), Cu = { class: "code" }, Ou = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (l(), K(gs, {
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
        H(ki, {
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
        H(Au, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: V(() => [
        H(pi, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: V(() => [
        H(xu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: V(() => [
        H(wu, {
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
        H(pu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: V(() => [
        H(Oa, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: V(() => [
        p("pre", Cu, [
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
}), oo = /* @__PURE__ */ Z(Ou, [["__scopeId", "data-v-cbdcf540"]]), Tu = { class: "dashboard" }, Bu = { class: "trail" }, Iu = ["onClick"], Ru = {
  key: 0,
  class: "gone",
  role: "status"
}, Lu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (w) => w in (n.document.pages || {}), o = j(!!n.page && !a(n.page)), r = j(n.page && !o.value ? [n.page] : []), i = C(() => r.value.at(-1) || n.document.start), c = C(() => (n.document.pages || {})[i.value] || null), u = (w) => ((n.document.pages || {})[w] || {}).title || w, f = (w) => {
      o.value = !1, r.value = [...r.value, w];
    }, g = (w) => {
      o.value = !1, r.value = r.value.slice(0, w);
    };
    return ke(
      () => n.document.start,
      () => r.value = []
    ), (w, M) => (l(), d("div", Tu, [
      e.document.broken ? (l(), K(tn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          he(b(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), K(tn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: V(() => [
          he(b(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(Q, { key: 2 }, [
        p("nav", Bu, [
          p("button", {
            type: "button",
            class: ee(["step", { current: !r.value.length }]),
            onClick: M[0] || (M[0] = (L) => g(0))
          }, b(u(e.document.start)), 3),
          (l(!0), d(Q, null, re(r.value, (L, P) => (l(), d(Q, {
            key: `${P}-${L}`
          }, [
            M[2] || (M[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: ee(["step", { current: P === r.value.length - 1 }]),
              onClick: (k) => g(P + 1)
            }, b(u(L)), 11, Iu)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Ru, "What you opened is no longer in this dashboard. Here is its start page.")) : N("", !0),
        H(It, {
          name: "page",
          mode: "out-in"
        }, {
          default: V(() => [
            (l(), d("div", {
              key: i.value,
              class: "page"
            }, [
              H(oo, {
                node: c.value.view,
                onOpen: f,
                onFile: M[1] || (M[1] = (L) => s("file", L))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : N("", !0)
    ]));
  }
}, Nv = /* @__PURE__ */ Z(Lu, [["__scopeId", "data-v-fbe83734"]]);
function Du(e, t, n, s = () => window) {
  De(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ce(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Nu = (e, t = () => !0) => Du("keydown", (n) => n.key === "Escape" && t() && e());
function ju(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = j(!1), a = C(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Nu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Pu = 80, ht = ms([]);
function qu(e) {
  const t = Symbol("layer"), n = () => ht.includes(t) && ht.splice(ht.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !ht.includes(t) && ht.push(t), s || n();
    },
    { immediate: !0 }
  ), Ce(n), C(() => Pu + Math.max(0, ht.indexOf(t)));
}
let ro = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ro = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Wu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Fu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Wu)];
    if (!r.length) return o.preventDefault();
    const [i, c] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  De(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : ro, document.addEventListener("keydown", a), Rt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ce(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Hu = ["aria-modal", "aria-label", "aria-labelledby"], Uu = {
  key: 0,
  class: "dialog-head"
}, zu = ["id", "tabindex"], Vu = {
  key: 1,
  class: "dialog-foot"
}, Gu = 500, Ku = 400, Yu = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = ju(s, n), i = qu(a), c = j(null), u = j(null), f = j(null), g = wa(), w = j(!1), M = Date.now();
    n.modal && Fu(u, () => s("escape"), f);
    function L() {
      if (!n.modal) return n.closable && o();
      w.value = !0, setTimeout(() => w.value = !1, Ku);
    }
    function P(F) {
      !n.modal || Date.now() - M >= Gu || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const k = () => c.value && (c.value.scrollTop = c.value.scrollHeight), E = new MutationObserver(k);
    return ke(c, (F) => {
      E.disconnect(), F && n.follow && (E.observe(F, { childList: !0, subtree: !0, characterData: !0 }), k());
    }), Ce(() => E.disconnect()), (F, U) => (l(), K(ka, { to: "body" }, [
      H(It, {
        name: "dialog",
        appear: "",
        onAfterLeave: G(r)
      }, {
        default: V(() => [
          G(a) ? (l(), d("div", {
            key: 0,
            class: ee(["dialog", { large: e.large, sheet: e.sheet }]),
            style: be({ zIndex: G(i) }),
            onClick: _e(L, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: ee(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: w.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? G(g) : void 0,
              onKeydownCapture: P
            }, [
              e.bare ? N("", !0) : (l(), d("header", Uu, [
                p("h3", {
                  id: G(g),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, zu),
                e.closable ? (l(), K(ys, {
                  key: 0,
                  onClick: G(o)
                }, null, 8, ["onClick"])) : N("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: ee(["dialog-body", { bare: e.bare }])
              }, [
                we(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (l(), d("footer", Vu, [
                we(F.$slots, "foot", {}, void 0, !0)
              ])) : N("", !0)
            ], 42, Hu)
          ], 6)) : N("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ju = /* @__PURE__ */ Z(Yu, [["__scopeId", "data-v-6d1ecd98"]]), Ve = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Re = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ie = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Zu = 6;
function _s(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Xu = (e) => {
  const t = _s(e, Ve.lineChars), n = Math.max(Ve.minWidth, Math.max(...t.map((s) => s.length)) * Ve.charWidth + Ve.padX * 2);
  return { name: e, lines: t, line: Ve.line, padY: Ve.padY, width: n, height: t.length * Ve.line + Ve.padY * 2 };
};
function Qu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, c) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(c) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function ed(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function td(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, c) => [i, c]))), o = (r, i) => {
    const c = a(), u = (f) => {
      const g = i(f).map((w) => c.get(w));
      return g.length ? g.reduce((w, M) => w + M, 0) / g.length : c.get(f);
    };
    return [...r].sort((f, g) => u(f) - u(g));
  };
  for (let r = 0; r < Zu; r++) {
    const i = r % 2 === 0, c = s.map((u, f) => f);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const f = (g) => t.filter((w) => w[i ? 1 : 0] === g).map((w) => w[i ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
function nd(e, t) {
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
function sd(e) {
  const t = [...new Set(e.flatMap(([y, m]) => [y, m]))], n = new Set(e.map(([, y]) => y)), s = t.filter((y) => !n.has(y)), a = Qu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((y, m) => !a.has(m)), r = ed(t, o), i = td(t, o, r), c = new Map(t.map((y) => [y, Xu(y)])), u = i.map((y) => y.reduce((m, I) => m + c.get(I).width, 0) + Ie.across * (y.length - 1)), f = Math.max(...u) + Ie.margin * 2, g = od(e, r, i.length), w = /* @__PURE__ */ new Map();
  let M = Ie.margin;
  i.forEach((y, m) => {
    let I = (f - u[m]) / 2;
    const O = Math.max(...y.map((q) => c.get(q).height));
    y.forEach((q) => {
      const $ = c.get(q);
      w.set(q, { ...$, x: I, y: M + (O - $.height) / 2 }), I += $.width + Ie.across;
    }), M += O + (g[m] ?? Ie.down);
  });
  const L = e.map(([y, m, I], O) => ({ from: y, to: m, label: I || "", back: a.has(O) || r.get(m) <= r.get(y) }));
  nd(L, w);
  const P = L.map((y) => rd(y, w.get(y.from), w.get(y.to))), k = [...w.values()], E = ud(P, k), F = Math.max(M - Ie.down, ...E.filter((y) => y.label).map((y) => y.label.y + y.label.height));
  return { width: Math.max(f - Ie.margin, ...E.filter((y) => y.label).map((y) => y.label.x + y.label.width)) + Ie.margin, height: F + Ie.margin, nodes: k, arrows: E };
}
const ad = (e) => e ? _s(e, Re.lineChars).length * Re.line + Re.pad * 2 : 0;
function od(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Ie.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += ad(r) + Ie.labelSpace);
  }), s.map((a) => Math.max(Ie.down, a));
}
function rd(e, t, n) {
  const s = e.label ? _s(e.label, Re.lineChars) : [], a = s.length ? Math.max(...s.map((w) => w.length)) * Re.charWidth + Re.pad * 2 : 0, o = s.length * Re.line + (s.length ? Re.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - i) / 2, g = [{ x: r, y: i }, { x: r, y: i + f }, { x: c, y: u - f }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: g, path: `M${r} ${i} C${r} ${i + f} ${c} ${u - f} ${c} ${u}` };
}
const id = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, ld = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], cd = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Re.line);
function ud(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, u) => {
      const f = id(s.curve, c);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = cd.flatMap((c) => ld.map((u) => a(u, c))).find((c) => !n.some((u) => Qs(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => Qs(i, c)); ) i.y += Re.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Re.line, pad: Re.pad } };
  });
}
const Qs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, dd = { class: "flowchart-tools" }, hd = ["width", "height", "viewBox", "aria-label"], fd = ["d"], pd = ["x", "y", "width", "height"], md = ["x", "y"], gd = ["x", "dy"], vd = {
  key: 0,
  class: "flowchart-label"
}, yd = ["x", "y", "width", "height"], wd = ["x", "y"], kd = ["x", "dy"], bd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = C(() => sd(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = j(null), i = j({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var E;
      const P = (E = r.value) == null ? void 0 : E.getBoundingClientRect();
      if (!(P != null && P.width)) return;
      const k = Math.min(P.width / a.value.width, P.height / a.value.height, 1.5);
      i.value = { zoom: k, x: (P.width - a.value.width * k) / 2, y: (P.height - a.value.height * k) / 2 };
    }
    function f(P, k, E) {
      const { zoom: F, x: U, y } = i.value, m = Math.min(o.most, Math.max(o.least, F * P));
      i.value = { zoom: m, x: k - (k - U) * m / F, y: E - (E - y) * m / F };
    }
    function g(P) {
      const k = r.value.getBoundingClientRect();
      f(P, k.width / 2, k.height / 2);
    }
    function w(P) {
      const k = r.value.getBoundingClientRect();
      P.ctrlKey || P.metaKey ? f(P.deltaY < 0 ? o.step : 1 / o.step, P.clientX - k.left, P.clientY - k.top) : i.value = { ...i.value, x: i.value.x - P.deltaX, y: i.value.y - P.deltaY };
    }
    function M(P) {
      var k, E, F;
      P.preventDefault(), (k = window.getSelection()) == null || k.removeAllRanges(), c = { x: P.clientX - i.value.x, y: P.clientY - i.value.y }, (F = (E = r.value).setPointerCapture) == null || F.call(E, P.pointerId);
    }
    function L(P) {
      c && (i.value = { ...i.value, x: P.clientX - c.x, y: P.clientY - c.y });
    }
    return De(u), (P, k) => (l(), K(Ju, {
      title: e.title,
      large: "",
      onClose: k[4] || (k[4] = (E) => s("close"))
    }, {
      default: V(() => [
        p("div", dd, [
          H(ye, {
            small: "",
            onClick: k[0] || (k[0] = (E) => g(o.step))
          }, {
            default: V(() => [...k[5] || (k[5] = [
              he("Zoom in", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            small: "",
            onClick: k[1] || (k[1] = (E) => g(1 / o.step))
          }, {
            default: V(() => [...k[6] || (k[6] = [
              he("Zoom out", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            small: "",
            onClick: u
          }, {
            default: V(() => [...k[7] || (k[7] = [
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
          onPointerdown: M,
          onPointermove: L,
          onPointerup: k[2] || (k[2] = (E) => Bs(c) ? c.value = null : c = null),
          onPointercancel: k[3] || (k[3] = (E) => Bs(c) ? c.value = null : c = null)
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
            k[8] || (k[8] = p("defs", null, [
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
            (l(!0), d(Q, null, re(a.value.arrows, (E, F) => (l(), d("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: E.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, fd))), 128)),
            (l(!0), d(Q, null, re(a.value.nodes, (E) => (l(), d("g", {
              key: E.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: E.x,
                y: E.y,
                width: E.width,
                height: E.height,
                rx: "8"
              }, null, 8, pd),
              p("text", {
                x: E.x + E.width / 2,
                y: E.y + E.padY + E.line / 2
              }, [
                (l(!0), d(Q, null, re(E.lines, (F, U) => (l(), d("tspan", {
                  key: U,
                  x: E.x + E.width / 2,
                  dy: U ? E.line : 0
                }, b(F), 9, gd))), 128))
              ], 8, md)
            ]))), 128)),
            (l(!0), d(Q, null, re(a.value.arrows, (E, F) => (l(), d(Q, {
              key: `label-${F}`
            }, [
              E.label ? (l(), d("g", vd, [
                p("rect", {
                  x: E.label.x,
                  y: E.label.y,
                  width: E.label.width,
                  height: E.label.height,
                  rx: "4"
                }, null, 8, yd),
                p("text", {
                  x: E.label.x + E.label.width / 2,
                  y: E.label.y + E.label.pad + E.label.line / 2
                }, [
                  (l(!0), d(Q, null, re(E.label.lines, (U, y) => (l(), d("tspan", {
                    key: y,
                    x: E.label.x + E.label.width / 2,
                    dy: y ? E.label.line : 0
                  }, b(U), 9, kd))), 128))
                ], 8, wd)
              ])) : N("", !0)
            ], 64))), 128))
          ], 12, hd))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, $d = /* @__PURE__ */ Z(bd, [["__scopeId", "data-v-51d24cfe"]]), ea = {
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
}, xd = ["innerHTML"], Md = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => ea[t.name] || ea.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, xd));
  }
}, ze = /* @__PURE__ */ Z(Md, [["__scopeId", "data-v-beb5935c"]]), _d = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: ee(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      H(ze, { name: "fold" })
    ], 2));
  }
}, Tt = /* @__PURE__ */ Z(_d, [["__scopeId", "data-v-d03899bb"]]), Sd = ["data-tip", "aria-label"], Ed = {
  key: 0,
  class: "mact-word"
}, Ad = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      H(ze, { name: "open" }),
      e.open ? (l(), d("span", Ed, b(e.label), 1)) : N("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Sd));
  }
}, io = /* @__PURE__ */ Z(Ad, [["__scopeId", "data-v-3b292e09"]]), Cd = 120, An = 280, Od = 160, Td = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function lo(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = j(t()), a = j("");
  let o = 0;
  const r = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const f = e.value, g = ++o;
    if (!f || !f.offsetWidth || Td()) {
      s.value = u;
      return;
    }
    const w = { width: f.offsetWidth, height: f.offsetHeight };
    if (r(f, w), a.value = "leaving", await n(Cd), g !== o) return;
    s.value = u, a.value = "resizing", await Rt(), i(f);
    const M = { width: f.offsetWidth, height: f.offsetHeight };
    r(f, w), f.offsetWidth, f.style.transition = `width ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, M), await n(An), g === o && (i(f), a.value = "entering", await n(Od), g === o && (a.value = ""));
  }
  return ke(t, (u) => c(u)), yt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Bd = { class: "growing-card-top" }, Id = ["aria-expanded"], Rd = { class: "growing-card-avatar" }, Ld = { class: "growing-card-title" }, Dd = { class: "growing-card-more" }, Nd = { class: "growing-card-body" }, jd = {
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
    const n = e, s = t, a = j(!1), o = j(null), { folded: r, phase: i } = lo(o, () => !a.value), c = C(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = C(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, g) => (l(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: ee(["growing-card-wrap", G(i), { open: !G(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Bd, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: g[0] || (g[0] = (w) => a.value = !a.value)
        }, [
          p("span", Rd, [
            e.bad ? (l(), K(ze, {
              key: 0,
              name: "cross"
            })) : c.value ? (l(), d(Q, { key: 1 }, [
              he(b(c.value), 1)
            ], 64)) : (l(), K(xe, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Ld, b(e.title), 1),
          H(Tt, { open: a.value }, null, 8, ["open"])
        ], 8, Id),
        e.action ? (l(), K(io, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: g[1] || (g[1] = (w) => s("act"))
        }, null, 8, ["label", "open"])) : N("", !0)
      ]),
      p("div", Dd, [
        p("div", Nd, [
          (l(!0), d(Q, null, re(u.value, (w, M) => (l(), d("p", {
            key: M,
            class: "growing-card-text"
          }, b(w), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Pd = /* @__PURE__ */ Z(jd, [["__scopeId", "data-v-c09abbcf"]]), qd = ["title", "aria-label"], Wd = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Fd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Hd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = C(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), d("span", {
      class: ee(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), d("svg", Wd, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", Fd)) : N("", !0)
      ]))
    ], 10, qd));
  }
}, Ud = /* @__PURE__ */ Z(Hd, [["__scopeId", "data-v-6dc92808"]]), zd = "img,pre,table";
function Vd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Gd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Kd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(zd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Vd(Gd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Yd(e, t) {
  let n = null;
  const s = () => e.value && Kd(e.value);
  De(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ce(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const Jd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Zd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Xd = ["data-ref"], Qd = ["data-from", "data-ref"], eh = { class: "message-body" }, th = ["title"], nh = ["innerHTML"], sh = ["innerHTML"], ah = {
  class: "message-faces",
  "data-message-faces": ""
}, oh = ["title", "data-face", "onClick"], rh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, ih = ["title", "data-reaction", "onClick"], lh = {
  key: 0,
  class: "message-reaction-count"
}, ch = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, uh = ["href", "title"], dh = ["src", "alt"], hh = ["href"], fh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, ph = {
  key: 1,
  "data-message-links-rows": ""
}, mh = { class: "message-foot" }, gh = { class: "message-time" }, vh = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, yh = 1500, wh = "An earlier message", kh = "about", bh = 3, $h = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
    var T;
    const n = e, s = t, a = j(!1), o = j(null), r = C(() => ["user", "comment"].includes(n.message.type)), i = C(() => {
      const [_, J] = (n.message.commented_row || ":").split(":"), z = at(_);
      return z ? { ref: `${z}:${J}`, label: `${Dt(z).title.toLowerCase()} ${J}` } : null;
    }), c = C(() => r.value && !n.message.read_at && !n.message.local);
    async function u() {
      var _;
      await ((_ = navigator.clipboard) == null ? void 0 : _.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, yh);
    }
    const f = C(() => ns(n.message.text ?? "", { env: "" })), g = C(() => JSON.parse(n.message.flowchart_edges || "[]")), w = j(!1), M = C(() => ns(n.quote || wh, { env: "" }));
    function L() {
      const _ = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      _ ? _.scrollIntoView({ block: "center", behavior: "smooth" }) : it(`messages:${n.message.parent_id}`);
    }
    Yd(o, () => `${n.message.text} ${n.quote}`);
    const P = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, k = (_) => `/api/files/message/${n.message.id}/${encodeURIComponent(_)}`, E = C(() => JSON.parse(n.message.captions || "{}")), F = C(() => (n.message.files ?? []).map((_) => ({ name: _, address: k(_), isImage: P.test(_), title: E.value[_] || _ }))), U = C(() => Na(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), y = Ae(Ne, null), m = j([]), I = j(!1), O = C(() => `Linked: ${m.value.join(", ")}`), q = C(() => m.value.length >= bh), $ = C(() => `${m.value.length} linked ${m.value.every((_) => _.startsWith("task ")) ? "tasks" : "rows"}`);
    async function S() {
      if (!r.value || !(y != null && y.read) || n.message.local) return;
      const _ = await y.read(`link list --source message:${n.message.id}`);
      _.ok && (m.value = (_.value.rows ?? _.value ?? []).filter((J) => J.link_type === kh).map((J) => `${J.target_model} ${J.target_id}`));
    }
    S(), (T = y == null ? void 0 : y.follow) == null || T.call(y, ["link.*"], S);
    const v = j(!1), h = C(() => Zd(n.message.reactions));
    function A(_) {
      v.value = !1, s("react", n.message, _);
    }
    return (_, J) => e.message.peer || e.message.recipient ? (l(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      H(Pd, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Xd)) : (l(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", eh, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: ee(["message-card", "md", { comment: i.value }]),
          onClick: J[3] || (J[3] = (...z) => G(mt) && G(mt)(...z))
        }, [
          i.value ? (l(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: J[0] || (J[0] = _e((z) => G(it)(i.value.ref), ["stop"]))
          }, [
            H(xe, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + b(i.value.label), 1)
          ], 8, th)) : N("", !0),
          e.message.parent_id ? (l(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: _e(L, ["stop"]),
            innerHTML: M.value
          }, null, 8, nh)) : N("", !0),
          p("div", { innerHTML: f.value }, null, 8, sh),
          g.value.length ? (l(), d(Q, { key: 2 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[1] || (J[1] = (z) => w.value = !0)
            }, "Open the flowchart"),
            w.value ? (l(), K($d, {
              key: 0,
              title: e.message.text,
              edges: g.value,
              onClose: J[2] || (J[2] = (z) => w.value = !1)
            }, null, 8, ["title", "edges"])) : N("", !0)
          ], 64)) : N("", !0)
        ], 2),
        p("div", {
          class: ee(["message-tools", { picking: v.value }]),
          "data-message-tools": ""
        }, [
          v.value ? (l(), d(Q, { key: 0 }, [
            p("div", ah, [
              (l(!0), d(Q, null, re(G(Jd), (z) => (l(), d("button", {
                key: z,
                type: "button",
                class: "message-face",
                title: `React ${z}`,
                "data-face": z,
                onClick: (ue) => A(z)
              }, b(z), 9, oh))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[4] || (J[4] = (z) => v.value = !1)
            }, [
              H(xe, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (l(), d(Q, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: J[5] || (J[5] = (z) => v.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: J[6] || (J[6] = (z) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: u
            }, b(a.value ? "Copied" : "Copy"), 1),
            c.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: J[7] || (J[7] = (z) => s("delete", e.message))
            }, "Delete")) : N("", !0)
          ], 64))
        ], 2)
      ]),
      h.value.length ? (l(), d("div", rh, [
        (l(!0), d(Q, null, re(h.value, (z) => (l(), d("button", {
          key: z.emoji,
          type: "button",
          class: ee(["message-reaction", { mine: z.mine }]),
          title: z.title,
          "data-reaction": z.emoji,
          onClick: (ue) => s("react", e.message, z.emoji)
        }, [
          he(b(z.emoji) + " ", 1),
          z.count > 1 ? (l(), d("span", lh, b(z.count), 1)) : N("", !0)
        ], 10, ih))), 128))
      ])) : N("", !0),
      F.value.length ? (l(), d("div", ch, [
        (l(!0), d(Q, null, re(F.value, (z) => (l(), d(Q, {
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
            }, null, 8, dh)
          ], 8, uh)) : (l(), d("a", {
            key: 1,
            href: z.address,
            target: "_blank",
            class: "message-file"
          }, b(z.name), 9, hh))
        ], 64))), 128))
      ])) : N("", !0),
      m.value.length ? (l(), d("div", fh, [
        H(ze, {
          class: "message-links-icon",
          name: "linked"
        }),
        q.value && !I.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: J[8] || (J[8] = (z) => I.value = !0)
        }, b($.value), 1)) : (l(), d("span", ph, [
          H(st, {
            text: O.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : N("", !0),
      p("div", mh, [
        p("time", gh, b(U.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", vh, "message " + b(e.message.id), 1)) : N("", !0),
        r.value ? (l(), K(Ud, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : N("", !0)
      ])
    ], 8, Qd));
  }
}, jv = /* @__PURE__ */ Z($h, [["__scopeId", "data-v-eb1d7000"]]), ln = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Cn = 200, co = (e) => {
  var t;
  return ((t = ln.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ln[0].key;
}, Pv = (e) => {
  var t;
  return ((t = ln.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, xh = ["aria-label"], Mh = 300, ta = 400, _h = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Cn } },
  setup(e) {
    const t = e, n = C(() => co(t.value)), s = C(() => n.value < Cn ? [1, 0.25, 0.25] : n.value === Cn ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: ee(["ico", "prio", { hot: n.value >= ta, high: n.value >= Mh && n.value < ta }]),
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
    ], 10, xh));
  }
}, qv = /* @__PURE__ */ Z(_h, [["__scopeId", "data-v-b10e610f"]]), Sh = ["aria-checked", "aria-haspopup", "onClick"], Eh = {
  key: 0,
  class: "segmented-dot"
}, Ah = {
  key: 1,
  class: "segmented-count"
}, Ch = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = wa();
    return (a, o) => {
      const r = Yo("tip");
      return l(), d("span", {
        class: ee(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), d(Q, null, re(e.options, (i) => rt((l(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: ee(["segmented-option", { on: i.key === e.value }]),
          onClick: (c) => n("pick", i.key)
        }, [
          i.dot ? (l(), d("span", Eh)) : N("", !0),
          he(" " + b(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", Ah, b(i.count), 1)) : N("", !0)
        ], 10, Sh)), [
          [r, i.tip || i.title, `${G(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, as = /* @__PURE__ */ Z(Ch, [["__scopeId", "data-v-ca953072"]]), na = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Oh = {
  key: 1,
  class: "text-field-label"
}, Th = {
  key: 2,
  class: "text-field-end"
}, Bh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Vn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = zn(e, "modelValue"), s = ba(), a = "onUpdate:modelValue" in (((f = Jo()) == null ? void 0 : f.vnode.props) || {}), o = C(() => a ? n.value : s.value), r = (g) => a && (n.value = g.target.value), i = C(
      () => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "class" && g !== "style" && g !== "value"))
    ), c = C(() => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "value"))), u = j(null);
    return t({ focus: () => u.value && u.value.focus() }), (g, w) => e.label || e.icon || g.$slots.end ? (l(), d("label", {
      key: 0,
      class: ee(["text-field", { large: e.large, ended: g.$slots.end }, G(s).class]),
      style: be(G(s).style)
    }, [
      e.icon ? (l(), K(xe, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : N("", !0),
      e.label ? (l(), d("span", Oh, b(e.label), 1)) : N("", !0),
      rt(p("input", ot({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [G(na), o.value]
      ]),
      g.$slots.end ? (l(), d("span", Th, [
        we(g.$slots, "end", {}, void 0, !0)
      ])) : N("", !0)
    ], 6)) : rt((l(), d("input", ot({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
      [G(na), o.value]
    ]);
  }
}), Ih = /* @__PURE__ */ Z(Bh, [["__scopeId", "data-v-d9c38ca8"]]), sa = (e) => e.page * e.size < e.total;
function Rh(e, t, { incremental: n = !1 } = {}) {
  const s = vs(), a = j([]), o = j(""), r = j(!1), i = j(!1), c = j(""), u = j(null);
  async function f(k) {
    const E = await s.read(`${e} --before-id ${k + 1} --limit 1`);
    if (!E.ok) return L();
    const F = E.value.rows.find((U) => U.id === k);
    a.value = F ? a.value.map((U) => U.id === k ? F : U) : a.value.filter((U) => U.id !== k);
  }
  async function g(k) {
    if (n && String((k == null ? void 0 : k.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((m) => m.id !== k.row_id));
    if (n && (k != null && k.row_id) && !String(k.event ?? "").endsWith(".create") && a.value.some((m) => m.id === k.row_id)) return f(k.row_id);
    if (!(n && a.value.length && String((k == null ? void 0 : k.event) ?? "").endsWith(".create"))) return L();
    const F = Math.max(...a.value.map((m) => m.id)), U = await s.read(`${e} --after-id ${F}`);
    if (!U.ok) return L();
    const y = new Set(a.value.map((m) => m.id));
    a.value = [...U.value.rows.filter((m) => !y.has(m.id)), ...a.value];
  }
  async function w() {
    if (!a.value.length) return !1;
    const k = Math.min(...a.value.map((U) => U.id)), E = await s.read(`${e} --before-id ${k}`);
    if (!E.ok || !E.value.rows.length) return i.value = !1;
    i.value = sa(E.value);
    const F = new Set(a.value.map((U) => U.id));
    return a.value = [...a.value, ...E.value.rows.filter((U) => !F.has(U.id))], !0;
  }
  let M = 0;
  async function L() {
    const k = ++M, E = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (k !== M) return;
    const F = E.ok ? s.shared ? [E.value] : E.value.rows : [], U = F.length ? Math.min(...F.map((y) => y.id)) : 0;
    a.value = n && E.ok && U ? [...a.value.filter((y) => y.id > Math.max(...F.map((m) => m.id))), ...F, ...a.value.filter((y) => y.id < U)] : F, E.ok && !a.value.some((y) => y.id < U) && (i.value = !s.shared && sa(E.value)), o.value = E.ok ? "" : E.error, r.value = !0;
  }
  async function P(k) {
    const E = await s.run(k);
    return c.value = E.ok ? "" : E.error, u.value = E.ok ? E.value : null, await L(), E;
  }
  return s.follow(t, g), L(), { rows: a, failure: o, loaded: r, more: i, load: L, older: w, act: P, actionFailure: c, answer: u, context: s };
}
const Lh = { class: "title" }, Dh = { class: "state" }, Nh = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Rh(t.line, t.events);
    return (o, r) => (l(), K(Gr, {
      rows: G(n),
      failure: G(s),
      loaded: G(a),
      empty: e.empty
    }, {
      default: V(({ row: i }) => [
        p("span", Lh, b(i.title), 1),
        p("span", Dh, b(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Wv = /* @__PURE__ */ Z(Nh, [["__scopeId", "data-v-a69084cd"]]), On = j(Date.now() / 1e3);
let aa = 0, Vt = 0;
function jh() {
  return Vt || (On.value = Date.now() / 1e3, aa = setInterval(() => On.value = Date.now() / 1e3, 1e3)), Vt += 1, $a() && xa(() => {
    Vt -= 1, Vt || clearInterval(aa);
  }), On;
}
const Ph = ["title", "data-figure-mark", "data-folded", "data-open"], qh = {
  key: 2,
  class: "worker"
}, Wh = { class: "head" }, Fh = { key: 0 }, Hh = {
  key: 3,
  class: "status"
}, Uh = {
  key: 0,
  class: "figure"
}, zh = {
  key: 1,
  class: "ran-for"
}, Vh = { key: 2 }, Gh = {
  key: 3,
  class: "news"
}, Kh = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Yh = {
  key: 6,
  class: "settled"
}, Jh = {
  key: 1,
  class: "bar"
}, Zh = {
  key: 3,
  class: "detail body"
}, Xh = {
  key: 0,
  class: "body-label"
}, Qh = ["title"], ef = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ba(), s = ["onClick", "onAct"], a = C(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = j(!1), r = C(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = C(() => t.open !== void 0), c = C(() => i.value || r.value), u = C(() => i.value ? t.open : o.value), f = C(() => i.value ? !t.open : r.value && !o.value), g = C(() => !!(t.mark.action && n.onAct)), w = C(() => c.value || g.value || !!n.onClick), M = j(null), L = j(null), { folded: P, phase: k } = lo(M, () => f.value);
    function E(le) {
      var me, Se;
      if (!(le.target !== M.value && !L.value.contains(le.target))) {
        if (i.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(le);
      }
    }
    const F = (le) => n.onAct(le), U = ["failed", "unfinished"], y = C(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? U.includes(t.mark.state) ? "danger" : "good" : ""), m = C(() => t.mark.color ? t.mark.color : y.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : y.value ? `var(--tone-${y.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), I = C(() => m.value || "var(--tone-work)"), O = C(() => !t.mark.ending && !t.mark.ended && y.value !== "stopped"), q = jh(), $ = C(
      () => t.mark.began_at && O.value && !t.mark.figure && !t.mark.counting ? nl(q.value - t.mark.began_at) : ""
    ), S = C(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${Fs(me - le, !0)}` : Fs(q.value - le, !0) : $.value;
    }), v = ["bad", "danger", "warn"], h = C(() => v.includes(y.value) || t.mark.asks ? "attention" : O.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), A = ["bad", "danger"], T = C(() => A.includes(y.value)), _ = C(() => h.value === "process" ? "running" : T.value ? "cross" : y.value === "stopped" ? "stopped" : y.value === "good" ? "tick" : ""), J = C(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || _.value || t.mark.settled || t.mark.news)
    ), z = C(() => [t.mark.title, t.mark.time ? Na(t.mark.time) : ""].filter(Boolean).join(" · ")), ue = C(() => ({
      ...m.value ? { "--mark": m.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (l(), d("div", ot(a.value, {
      ref_key: "root",
      ref: M,
      class: [
        "mark",
        `w-${h.value}`,
        G(k),
        {
          open: u.value,
          live: w.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: m.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ue.value,
      title: z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": G(P) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: E
    }), [
      (l(), K(lt(w.value ? "button" : "span"), {
        ref_key: "top",
        ref: L,
        class: "top",
        type: w.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!u.value) : void 0
      }, {
        default: V(() => [
          e.mark.markIcon ? (l(), K(ze, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), K(xe, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), d("span", qh, b(e.mark.worker), 1)) : N("", !0),
          p("span", Wh, [
            H(st, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", Fh, b(e.mark.name), 1)) : N("", !0),
            c.value ? (l(), K(Tt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : N("", !0)
          ]),
          J.value ? (l(), d("span", Hh, [
            e.mark.figure ? (l(), d("span", Uh, b(e.mark.figure), 1)) : N("", !0),
            S.value ? (l(), d("span", zh, b(S.value), 1)) : N("", !0),
            e.mark.stopping ? (l(), d("span", Vh, "Stopping")) : N("", !0),
            e.mark.news ? (l(), d("span", Gh, b(e.mark.news), 1)) : N("", !0),
            _.value === "running" ? (l(), d("span", Kh)) : _.value ? (l(), K(ze, {
              key: 5,
              class: ee(["sign", _.value]),
              name: _.value
            }, null, 8, ["class", "name"])) : N("", !0),
            e.mark.settled ? (l(), d("span", Yh, b(e.mark.settled), 1)) : N("", !0)
          ])) : N("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      g.value ? (l(), K(io, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: _e(F, ["stop"])
      }, null, 8, ["label", "open"])) : N("", !0),
      (e.mark.figure || e.mark.counting) && O.value ? (l(), d("span", Jh, [
        p("span", {
          class: "progress",
          style: be({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: I.value })
        }, null, 4)
      ])) : N("", !0),
      e.mark.detail && !G(P) ? (l(), K(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : N("", !0),
      e.mark.body && !G(P) ? (l(), d("div", Zh, [
        e.mark.bodyLabel ? (l(), d("p", Xh, b(e.mark.bodyLabel), 1)) : N("", !0),
        H(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : N("", !0),
      e.mark.command && !G(P) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, Qh)) : N("", !0),
      e.mark.card ? (l(), K(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : N("", !0),
      we(le.$slots, "default", {
        shown: !G(P)
      }, void 0, !0)
    ], 16, Ph));
  }
}), uo = /* @__PURE__ */ Z(ef, [["__scopeId", "data-v-1bcf640e"]]), tf = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function ho(e) {
  var n;
  const t = tf[e] || ((n = Dt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const nf = (e) => ho(String(e).split(":")[0]), fo = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), sf = { passed: "good", failed: "danger", warned: "warn", running: "" }, af = { good: "good", warn: "warn", danger: "danger" }, oa = {
  "open row": (e) => it(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Pr(e.target_model, e.target_id || 0)
}, of = { "open row": (e) => nf(e.target_model), "open page": () => ho("pages") };
function rf(e, t) {
  const n = t || {}, s = oa[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? sf[e.outcome] || "" : af[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? of[s](e) : "",
    handlers: s ? { onAct: () => oa[s](e) } : {}
  };
}
const lf = 24, cf = 1e3, ra = 2e3, uf = 0.25, df = 5e3;
function hf(e, t = lf, n = () => !0) {
  const s = j(!1), a = j(0), o = j(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const y = u();
    return y ? y.scrollHeight - y.scrollTop - y.clientHeight : 0;
  }, g = () => !u() || f() <= t;
  function w(y) {
    if (clearTimeout(r), !y) {
      o.value = !1, c = Date.now();
      return;
    }
    const m = Date.now() - c < ra ? ra : cf;
    r = setTimeout(() => o.value = s.value, m);
  }
  function M() {
    clearTimeout(i), s.value = !1, a.value = 0, w(!1);
  }
  function L(y = !1) {
    const m = u();
    m && y && m.scrollTo ? m.scrollTo({ top: m.scrollHeight, behavior: "smooth" }) : m && (m.scrollTop = m.scrollHeight), M();
  }
  function P() {
    E(), !s.value && (s.value = !0, w(!0));
  }
  const k = () => !!u() && f() <= u().clientHeight * uf;
  function E() {
    clearTimeout(i), k() && (i = setTimeout(() => s.value && k() && n() && L(!0), df));
  }
  function F() {
    g() ? M() : P();
  }
  function U(y = 1, m = !1) {
    s.value ? a.value += Math.max(0, y) : L(m);
  }
  return $a() && xa(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: g, follow: M, toBottom: L, left: P, scrolled: F, arrived: U };
}
const ff = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = j(null), { away: o, scrolled: r, arrived: i, toBottom: c } = hf(a);
    ke(
      () => n.lines.length,
      () => Rt(() => i()),
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
      he(b(e.lines.join(`
`) || e.empty), 1),
      G(o) ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: g[0] || (g[0] = (w) => G(c)(!0))
      }, "Follow")) : N("", !0)
    ], 544));
  }
}, pf = /* @__PURE__ */ Z(ff, [["__scopeId", "data-v-09394a20"]]), mf = 1e4;
class gf {
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
    return this.heardAt !== null && t - this.heardAt > mf;
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
const vf = {
  key: 0,
  class: "frame-note"
}, yf = {
  key: 0,
  class: "frame-note"
}, wf = ["src", "title"], kf = 1e3, bf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = vs(), s = j(null), a = j(!1), o = j(!1);
    let r = null, i = 0;
    return De(() => {
      r = new gf(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, kf);
    }), Ce(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", vf, "This window was closed because it stopped answering.")) : (l(), d(Q, { key: 1 }, [
      a.value ? (l(), d("div", yf, [
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
        title: G(n).window
      }, null, 8, wf)
    ], 64));
  }
}, $f = /* @__PURE__ */ Z(bf, [["__scopeId", "data-v-32a49046"]]), xf = 0, Mf = "/api/lines", _f = "/api/line";
class Sf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), xf));
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
        const n = await je.raw(Mf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(_f, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Ef = new Sf();
class Af {
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
      n.patterns.some((s) => po(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function po(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Cf = Symbol("pane-page"), Of = { 1: "refused", 2: "usage", 3: "fault" }, Tf = 100, Bf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function If({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = j({}), declared: u = [], page: f = null, setOption: g = () => {
}, autoScroll: w = "", tabs: M = [], readOnly: L = !1, shared: P = null }) {
  const k = /* @__PURE__ */ new Map(), E = new AbortController(), F = (U) => {
    const y = k.get(U);
    if (y && performance.now() - y.at < Tf) return y.answer;
    const m = Et(e, U, t, E.signal);
    return k.set(U, { answer: m, at: performance.now() }), m;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: C(() => s()),
    permissions: a,
    autoScroll: w,
    tabs: M,
    readOnly: L,
    shared: P,
    read: F,
    run: (U) => Et(e, U, t, E.signal),
    upload: (U) => Lf(U, E.signal),
    cancel: () => E.abort(),
    follow: (U, y) => r.follow(e, U.filter((m) => o.some((I) => po(I, m))), y, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (U) => C(() => {
      var y;
      return c.value[U] ?? ((y = u.find((m) => m.key === U)) == null ? void 0 : y.default);
    }),
    setting: async (U, y) => {
      const m = await F(`window setting ${e} ${U}`);
      return m.ok ? m.value.value : y;
    },
    setOption: g,
    keep: (U, y) => Et(e, ["window", "save-setting", e, U, JSON.stringify(y)], t, E.signal)
  };
}
function Rf(e) {
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
    const a = await Ef.add({ window: e, line: Array.isArray(t) ? t : Df(t), environment: n }, s);
    return s != null && s.aborted ? cn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Of[a.code] || "fault", error: Rf(a.error) };
  } catch (a) {
    return s != null && s.aborted ? cn : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function Lf(e, t = void 0) {
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? cn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? cn : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function Df(e) {
  return [...e.matchAll(Bf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Nf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const jf = {
  class: "allowance-prompt",
  role: "dialog"
}, Pf = { class: "allowance-prompt-text" }, qf = { class: "allowance-prompt-buttons" }, Wf = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("div", jf, [
      p("p", Pf, b(G(Nf)(e.request)), 1),
      p("div", qf, [
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
}, Ff = /* @__PURE__ */ Z(Wf, [["__scopeId", "data-v-102dc765"]]), Tn = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), K(tn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: V(() => [
        he(b(e.reason) + " ", 1),
        e.retry ? (l(), K(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            he("Retry", -1)
          ])]),
          _: 1
        })) : N("", !0),
        e.removable ? (l(), K(ye, {
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
}, Hf = ["data-window", "data-agent"], Uf = {
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
    const n = e, s = t, a = j(""), o = j(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Ae(xr, null), c = If({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: C(() => n.options),
      declared: n.declared,
      page: Ae(Cf, null),
      setOption: (g, w) => s("option", g, w),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (g, w) => {
        s("open", g, w), i == null || i(g, w);
      }
    });
    Zo(Ne, c), ke(() => n.visible, (g) => g && n.subscriptions.shown(n.name)), Ce(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), Xo((g) => (a.value = g instanceof Error ? g.message : String(g), n.subscriptions.stopAll(n.name), !1));
    const u = () => ps(n.component), f = () => {
      var g, w;
      return ((w = (g = n.prompts) == null ? void 0 : g.current.value) == null ? void 0 : w.window) === n.name ? n.prompts.current.value : null;
    };
    return (g, w) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (l(), K(Ff, {
        key: 0,
        request: f(),
        onAnswer: w[0] || (w[0] = (M) => e.prompts.answer(M))
      }, null, 8, ["request"])) : N("", !0),
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
        onRemove: w[1] || (w[1] = (M) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Hf));
  }
}, mo = /* @__PURE__ */ Z(Uf, [["__scopeId", "data-v-04dd3be3"]]), zf = {
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
    const n = e, s = t, a = { render: () => ps($f, { src: n.entry.entry_url }) };
    return (o, r) => (l(), K(mo, {
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
}, os = "journal.stale-build-reload", Vf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Gf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(os) === e.message) return !1;
    t.setItem(os, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Kf(e = window.sessionStorage) {
  try {
    e.removeItem(os);
  } catch {
    return;
  }
}
const Yf = ["data-window"], Jf = {
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
    const n = e, s = t, a = pn(null), o = j("");
    return ke(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, Kf();
          } catch (i) {
            if (Vf(i) && Gf(i)) return;
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
    ], 8, Yf)) : (l(), K(mo, {
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
}, Zf = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new Af(), s = ((i = Ae(Ne, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = C(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = C(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), K(Jf, {
      key: 0,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), K(zf, {
      key: 1,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Xf = { class: "mark-more-inner" }, Qf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, e1 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, t1 = {
  key: 3,
  class: "mark-lines"
}, n1 = "process", ia = "task", s1 = 2e3, a1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ae(Ne), s = C(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = C(() => fo.has(t.mark.variant) && t.mark.detail || ""), o = C(() => t.mark.target_model === ia ? t.mark.target_id : 0), r = j([]), i = j(!1), c = j(""), u = C(() => t.mark.target_model === n1 && !!t.mark.target_id);
    async function f() {
      const M = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = M.ok ? "" : M.error, M.ok && (r.value = M.value.lines);
    }
    let g = null;
    const w = () => clearInterval(g);
    return ke(() => t.shown && u.value, (M) => {
      w(), M && (f(), t.mark.ended_at || (g = setInterval(f, s1)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (M) => M && t.shown && u.value && (w(), f())), Ce(w), (M, L) => (l(), d("div", {
      class: ee(["mark-more", { open: e.shown }]),
      onClick: L[1] || (L[1] = _e(() => {
      }, ["stop"]))
    }, [
      p("div", Xf, [
        e.declaration.body_url ? (l(), K(Zf, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(Q, { key: 1 }, [
          a.value ? (l(), d(Q, { key: 0 }, [
            L[2] || (L[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Qf, b(a.value), 1)
          ], 64)) : N("", !0),
          u.value && c.value ? (l(), d("p", e1, b(c.value), 1)) : u.value && i.value ? (l(), d(Q, { key: 2 }, [
            L[3] || (L[3] = p("p", { class: "mark-label" }, "Output", -1)),
            H(pf, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", t1, b(s.value.join(`
`)), 1)) : N("", !0),
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: L[0] || (L[0] = _e((P) => G(it)(`${ia}:${o.value}`), ["stop"]))
          }, "Open task " + b(o.value) + " and its proofs", 1)) : N("", !0)
        ], 64))
      ])
    ], 2));
  }
}, rs = /* @__PURE__ */ Z(a1, [["__scopeId", "data-v-51f69bf1"]]), o1 = (e) => `show-${e}`, Fv = (e, t, n) => e.filter((s) => {
  var a;
  return n(o1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), r1 = "messages.chat", i1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), is = (e, t, n) => Et(r1, i1(e, t), n), l1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, c1 = ["title", "aria-label", "onClick"], u1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, d1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = C(() => l1(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = j(""), a = Ae(Ne);
    async function o(r) {
      const i = await is(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (l(), d(Q, null, [
      (l(!0), d(Q, null, re(n.value, (c) => (l(), d("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: _e((u) => o(c), ["stop"])
      }, [
        H(ze, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, c1))), 128)),
      s.value ? (l(), d("span", u1, b(s.value), 1)) : N("", !0)
    ], 64));
  }
}, h1 = /* @__PURE__ */ Z(d1, [["__scopeId", "data-v-0dfda102"]]);
function go(e, t) {
  const n = pn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const vo = go("/api/marks", "marks"), Hv = vo.fetchAll, f1 = vo.find, p1 = 2e3;
function yo(e, t) {
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
    }, p1);
  };
  De(async () => {
    await e(), s();
  }), yt(() => clearTimeout(n));
}
const m1 = ["data-ref"], g1 = ["data-ref"], v1 = { class: "mark-row" }, y1 = "dock add", w1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = C(() => f1(s.mark.type)), o = Ae(Ne, null), r = C(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = j(null);
    yo(async () => {
      if (!r.value) return;
      const w = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      w.ok && w.value.rows.length && (i.value = w.value.rows[0].progress);
    }, () => r.value);
    const c = C(() => {
      const w = rf(s.mark, a.value), M = !w.figure || w.figure.endsWith("%");
      return i.value && r.value && M ? { ...w, figure: `${i.value}%`, fraction: i.value / 100 } : w;
    }), u = C(() => {
      var w;
      return !!(s.mark.lines || s.mark.detail && fo.has(s.mark.variant) || t.has(s.mark.target_model) || (w = a.value) != null && w.body_url);
    }), f = j(!1), g = C(() => {
      var w, M, L;
      return s.docked ? (M = (w = a.value) == null ? void 0 : w.buttons) == null ? void 0 : M.filter((P) => {
        var k;
        return !((k = P.runs) != null && k.startsWith(y1));
      }) : (L = a.value) == null ? void 0 : L.buttons;
    });
    return (w, M) => {
      var L, P;
      return (L = a.value) != null && L.card ? (l(), d("div", {
        key: 0,
        class: "thread-turn card whole-card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        H(rs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 8, m1)) : (l(), d("div", {
        key: 1,
        class: ee(["thread-turn", "card", { "full-width": (P = a.value) == null ? void 0 : P.full_width, docked: e.docked, "user-side": G(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", v1, [
          H(uo, ot({
            mark: c.value,
            open: u.value ? f.value : void 0
          }, Qo(c.value.handlers), {
            onClick: M[0] || (M[0] = (k) => f.value = !f.value)
          }), er({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: V(({ shown: k }) => [
                H(rs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: k
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          H(h1, {
            buttons: g.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, g1));
    };
  }
}, k1 = /* @__PURE__ */ Z(w1, [["__scopeId", "data-v-b5431d49"]]), b1 = ["data-ref"], $1 = ["inert"], x1 = { class: "thread-group" }, M1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = j(!1), s = j(!1);
    ke(n, () => s.value = !0);
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
      H(uo, {
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
        p("div", x1, [
          (l(!0), d(Q, null, re(e.group.marks, (i) => (l(), K(k1, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, $1)) : N("", !0)
    ], 8, b1));
  }
}, Uv = /* @__PURE__ */ Z(M1, [["__scopeId", "data-v-8a285510"]]);
function _1(e) {
  const t = j(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return De(() => n.observe(e.value)), yt(() => n.disconnect()), t;
}
const S1 = { class: "chat-dock-fold" }, E1 = ["aria-label"], A1 = { class: "chat-dock-head" }, C1 = { class: "chat-dock-inner" }, O1 = 700, T1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = j(null), s = j(null), a = _1(s), o = j(!1);
    let r = 0;
    return De(() => r = setTimeout(() => o.value = !0, O1)), yt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: ee(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", S1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: ee(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          we(i.$slots, "edge"),
          p("header", A1, [
            we(i.$slots, "head")
          ]),
          p("div", {
            class: ee(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", C1, [
              p("div", {
                class: ee(["chat-dock-grow", { settled: o.value }]),
                style: be(G(a) === null ? null : { height: `${G(a)}px` })
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
        ], 10, E1)
      ])
    ], 2));
  }
}, wo = /* @__PURE__ */ Z(T1, [["__scopeId", "data-v-63e4dcfc"]]), B1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Bn = 5, I1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Bn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Bn}s`, animationDelay: `${(n - Bn).toFixed(2)}s` };
    return (a, o) => (l(), d("span", B1, [
      p("i", { style: s })
    ]));
  }
}, R1 = /* @__PURE__ */ Z(I1, [["__scopeId", "data-v-d0c4b012"]]), ko = go("/api/docks", "docks"), zv = ko.fetchAll, ls = ko.find, L1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), cs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), D1 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), N1 = (e) => e.kept ? cs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : cs("keep", "pin", "Pin", `dock keep ${e.id}`);
function j1(e, t) {
  var n;
  return [
    ...D1(e, t) ? [N1(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Dt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    cs("undock", "close", "Undock", `dock remove ${e.id}`)
  ];
}
const P1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: L1(e, t),
  buttons: j1(e, t)
}), q1 = { class: "dock-title" }, W1 = ["aria-expanded", "title"], F1 = { class: "chat-dock-acts dock-acts" }, H1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, U1 = {
  key: 1,
  class: "dock-text"
}, z1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = C(() => ls(s.item.type)), o = j(null), r = C(() => P1(s.item, a.value)), i = Ae(Ne), c = j(/* @__PURE__ */ new Set()), u = j("");
    async function f(M) {
      if (M.action === "open") return it(`${s.item.target_model}:${s.item.target_id}`);
      if (M.action !== "declared") return is(M, s.item, i.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, M.label]), u.value = "";
      const L = await is(M, s.item, i.environment);
      (L == null ? void 0 : L.ok) === !1 && (c.value = new Set([...c.value].filter((P) => P !== M.label)), u.value = L.error);
    }
    const g = C(() => r.value.buttons.filter((M) => M.action !== "undock" && !c.value.has(M.label))), w = C(() => r.value.buttons.find((M) => M.action === "undock"));
    return (M, L) => (l(), K(wo, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: V(() => [
        e.leaving ? (l(), K(R1, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : N("", !0)
      ]),
      head: V(() => {
        var P, k, E;
        return [
          (P = a.value) != null && P.draws_head ? (l(), d("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(Q, { key: 1 }, [
            H(xe, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", q1, b(r.value.title), 1)
          ], 64)),
          (k = a.value) != null && k.badge ? (l(), d("span", {
            key: 2,
            class: ee(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, b(a.value.badge), 3)) : N("", !0),
          (E = a.value) != null && E.draws_head ? N("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: L[0] || (L[0] = (F) => n("fold"))
          }, [
            H(Tt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, W1)),
          p("span", F1, [
            (l(!0), d(Q, null, re(g.value, (F) => (l(), K(ye, {
              key: F.action + F.runs,
              small: "",
              kind: F.primary ? "primary" : "ghost",
              bordered: !F.primary,
              "data-dock-action": F.action,
              onClick: (U) => f(F)
            }, {
              default: V(() => [
                he(b(F.label), 1)
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          H(ys, {
            title: w.value.label,
            "data-dock-action": "undock",
            onClick: L[1] || (L[1] = (F) => f(w.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var P, k;
        return [
          u.value ? (l(), d("p", H1, b(u.value), 1)) : N("", !0),
          e.item.text && !((P = a.value) != null && P.body_url) ? (l(), d("p", U1, b(e.item.text), 1)) : N("", !0),
          (k = a.value) != null && k.body_url ? (l(), K(rs, {
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
}, la = /* @__PURE__ */ Z(z1, [["__scopeId", "data-v-608c189e"]]), V1 = ["title", "aria-label"], G1 = { class: "run-chip-in" }, K1 = {
  key: 0,
  class: "run-chip-ring"
}, Y1 = { class: "run-chip-name" }, J1 = { class: "run-chip-bar" }, Z1 = "processes.output", X1 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var f;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((f = Ae(Ne, null)) == null ? void 0 : f.environment) ?? "", o = j(null), r = C(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = C(() => {
      var g, w;
      return ((g = o.value) == null ? void 0 : g.title) || ((w = o.value) == null ? void 0 : w.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = C(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const g = await Et(Z1, ["process", "card", String(s.item.target_id)], a);
      g.ok && (o.value = g.value);
    }
    return yo(u, () => r.value), (g, w) => {
      var M;
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: be({ "--tone": c.value })
      }, [
        p("span", G1, [
          r.value ? (l(), d("span", K1)) : (l(), K(ze, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", Y1, b(i.value), 1)
        ]),
        p("span", J1, [
          p("i", {
            style: be({ width: r.value ? `${((M = o.value) == null ? void 0 : M.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, V1);
    };
  }
}, Q1 = /* @__PURE__ */ Z(X1, [["__scopeId", "data-v-2036e274"]]), ep = 24, tp = 8, Vv = 420;
function Gv({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= ep && e > t ? !0 : e < t && a > tp ? !1 : null;
}
const np = (e, t) => e === void 0 ? t : e, sp = 6, ap = 3, ca = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, us = (e) => !!(e.leaves_at && !e.kept), op = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!us(e) || t < e.leaves_at || n.has(e.id)), rp = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => op(s, t, n)).sort((s, a) => s.id - a.id);
function ip(e, t, n = sp) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const lp = (e, t) => e >= ap ? !0 : e <= 1 ? !1 : t, cp = { class: "dock-stack" }, up = ["onMouseenter", "onMouseleave"], dp = {
  key: 0,
  class: "dock-runs-head"
}, hp = ["onMouseenter", "onMouseleave"], fp = { class: "dock-runs-chips" }, pp = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = j(Date.now() / 1e3), s = j(/* @__PURE__ */ new Set()), a = j(!1), o = j(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ce(() => clearInterval(r));
    const i = C(() => rp(t.items, n.value, s.value)), c = C(() => ip(i.value.filter((F) => ca(F, ls)), n.value)), u = C(() => i.value.filter((F) => !c.value.includes(F) && !ca(F, ls))), f = C(() => (a.value = lp(c.value.length, a.value)) && !o.value), g = j({}), w = (F) => np(g.value[F.id], t.folded);
    function M(F) {
      g.value = { ...g.value, [F.id]: !w(F) };
    }
    function L(F) {
      g.value = { ...g.value, ...Object.fromEntries(c.value.map((U) => [U.id, U.id !== F.id])) }, o.value = !0;
    }
    function P() {
      g.value = Object.fromEntries(Object.entries(g.value).filter(([F]) => !c.value.some((U) => String(U.id) === F))), o.value = !1;
    }
    function k(F) {
      s.value = /* @__PURE__ */ new Set([...s.value, F.id]);
    }
    function E(F) {
      s.value = new Set([...s.value].filter((U) => U !== F.id));
    }
    return (F, U) => (l(), d("div", cp, [
      (l(!0), d(Q, null, re(u.value, (y) => (l(), d("div", {
        key: y.id,
        onMouseenter: (m) => k(y),
        onMouseleave: (m) => E(y)
      }, [
        H(la, {
          item: y,
          leaving: G(us)(y) && !s.value.has(y.id),
          folded: w(y),
          onFold: (m) => M(y)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, up))), 128)),
      a.value && o.value ? (l(), d("div", dp, [
        p("button", {
          type: "button",
          class: "dock-runs-toggle",
          "aria-expanded": "true",
          title: "Fold the runs into one line",
          "data-dock-runs-fold": "",
          onClick: P
        }, [
          he(b(c.value.length) + " runs ", 1),
          H(Tt, { open: "" })
        ])
      ])) : N("", !0),
      (l(!0), d(Q, null, re(f.value ? [] : c.value, (y) => (l(), d("div", {
        key: y.id,
        onMouseenter: (m) => k(y),
        onMouseleave: (m) => E(y)
      }, [
        H(la, {
          item: y,
          leaving: G(us)(y) && !s.value.has(y.id),
          folded: w(y),
          onFold: (m) => M(y)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, hp))), 128)),
      f.value ? (l(), K(wo, {
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
            onClick: U[0] || (U[0] = (y) => o.value = !0)
          }, [
            H(ze, { name: "runs" }),
            he(" " + b(c.value.length) + " runs ", 1),
            H(Tt)
          ]),
          p("span", fp, [
            (l(!0), d(Q, null, re(c.value, (y) => (l(), K(Q1, {
              key: y.id,
              item: y,
              onClick: (m) => L(y)
            }, null, 8, ["item", "onClick"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["label"])) : N("", !0)
    ]));
  }
}, Kv = /* @__PURE__ */ Z(pp, [["__scopeId", "data-v-11842ee6"]]), St = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Xt = (e) => Math.min(Math.max(e, 0), 1), mp = (e) => {
  const t = Xt(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => mp((e - t) / (n - t));
function Yv(e) {
  const t = Xt(e), n = Xt((t - 0.12) / 0.76) * St.shuffles, s = Math.min(Math.floor(n), St.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), r = et(a, 0.38, 0.76), i = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), c = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), u = Math.sin(Math.PI * Xt((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / St.shuffles, lift: St.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const bo = 2400, gp = 0.05;
function Jv({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, gp), r = Math.min(t + bo * o, a), i = e + r * o;
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
}, ds = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), vp = (e) => e * e * (3 - 2 * e), un = (e, [t, n]) => vp(ds(e, t, n)), yp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Gt = ([e, t], n) => e + n() * (t - e);
function wp(e) {
  return yp.map(() => {
    const t = Gt(Ye.speed, e), n = Gt(Ye.angle, e) * Math.PI / 180, s = Gt(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Gt(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const kp = wp(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function bp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function Zv(e, t, n = kp) {
  const s = Ze.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = bp(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const c = Math.min(a, r), u = s.from.map((f, g) => f + o.velocity[g] * c);
  return u[2] -= Ye.gravity * c * c / 2, { at: u, turn: o.spin * c, landed: Math.max(0, a - r) / i };
}
function Xv(e, t) {
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
const Qv = () => Array.from({ length: Ze.pogo.count }, (e, t) => Ze.pogo.bounce * (t + 1) / Ze.pogo.count), ey = { stride: 0.5 };
function $o(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: ds(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: ds(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function ty(e) {
  const { into: t, out: n } = $o(Ze.rope_swing, e);
  return 1 - un(t, [0, 1]) * (1 - un(n, [0, 1]));
}
function ny(e) {
  const t = Ze.rope_swing, { into: n, out: s } = $o(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return un(n, [0, 1]) * (1 - un(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const $p = { after: 3 }, xp = 10, Mp = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, _p = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Sp = { weight: 19 }, Ep = {
  build: { cooldown: 180 }
}, Ap = { every: 120 }, xo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Mo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Cp = {
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
}, Pt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: xp }), te = (e, t, n = {}) => Pt(e, "clip", t, n), In = (e, t, n = {}) => Pt(e, "look", t, n), ua = (e, t, n = {}) => Pt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...Pt(e, "pick", t, n), ...s }), pe = (e) => Pt("nothing", "nothing", e, {}), Op = 120, Tp = 300, Rn = (e, t) => ({ ...te(e, t), cooldown: Tp }), Bp = 120, ne = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Ip = () => [te("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: Mp[e.name] }), _t = (e) => ({ ...e, shenanigan: !0, lasts: _p[e.name] }), Ss = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ne("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), pe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ne("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...nt(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...nt(te("bug_smash", 2)), toward: "", onto: !1 },
    te("nod", 2)
  ]),
  ...ne("tests_failed", { cooldown: 20, toward: "card" }, [te("startled", 2), te("dismay", 1), te("tantrum", 3), pe(1)]),
  ...ne("committed", { cooldown: 30, toward: "card", onto: !0 }, [te("nod", 2), pe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ne("sin_fixed", { cooldown: 300 }, [te("halo", 1), pe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ne("sin_committed", { cooldown: 300 }, [te("repent", 1), pe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...ne("messaged", { cooldown: Bp }, [te("phone_call", 1)]),
  ...ne("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [te("nod", 4), te("hand_rub", 4), pe(7)]),
  ...ne("question_asked", { cooldown: 60 }, [te("ask_sign", 9), te("look_up", 3), pe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ne("reported", { cooldown: 90 }, [ua("read", 3), te("nod", 1), pe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ne("read_message", { cooldown: 30 }, [ua("read", 3), pe(1)]),
  ...ne("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), pe(6)]),
  ...ne("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), pe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ne("bar_done", { holds: !0 }, Ip()),
  ...ne("bar_failed", { holds: !0 }, [te("fume", 1), te("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ne("standing", { cooldown: 12 }, [te("look_left", 2), te("look_right", 2), te("look_up", 1), pe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ne("launched", { cooldown: 300 }, [te("tumble", 3), pe(47)]),
  // a break from the hammering now and then
  ...ne("building", { cooldown: 30 }, [te("wipe_brow", 4), te("look_left", 1), te("look_right", 1), pe(69)]),
  ...ne("failed", { cooldown: 20, toward: "card" }, [te("shake", 3), te("tantrum", 2), pe(2)]),
  ...ne("refused", { cooldown: 20 }, [te("shake", 1), pe(1)]),
  ...ne("work_done", { cooldown: 120 }, [te("stretch", 2), pe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ne("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...ne("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...ne("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...ne("answered", { cooldown: 15 }, [In("amused", 3), pe(2)]),
  ...ne("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    pe(1)
  ]),
  ...ne("long_walk", { cooldown: 90 }, [te("stumble", 3), pe(22)]),
  ...ne("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), pe(13)]),
  ...ne("typing", { cooldown: 60 }, [In("reading", 1), pe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Cp).flatMap(([e, t]) => ne(`reacted:${e}`, {}, [In(t, 1)])),
  ...Object.entries(xo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ne(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Mo).flatMap(([e, t]) => ne(`agent_reacted:${e}`, {}, [te(t, 1)])),
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
    { ..._t(nt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    _t(nt(te("disco", 2, { ball: "bubble" }))),
    pe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ne("held:search", { cooldown: Op }, [Rn("search", 3), { ...Rn("binoculars", 2), when: { home: !0 } }, { ...Rn("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ne("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...ne("held:watch", {}, [te("watch", 2), te("wave_up", 1)]),
  ...ne("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ne("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), pe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ne("tickled", {}, [{ ...nt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ne("eager", {}, [te("eager", 2, { slow: !0 }), pe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ne("jump", {}, [_t(nt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ne("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ne("unit", { cooldown: Ep.build.cooldown }, [ce("unit", Sp.weight), pe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ne("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ne("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...ne("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ne("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: Ap.every }, ce("stand", 5)]),
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
], Rp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), _o = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Lp = (e) => Array.isArray(e) ? e[0] : e, Dp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Np(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || _o(f).every(([g, w]) => n(g) >= Lp(w)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Ss.filter((f) => Rp(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= $p.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = i.filter((f) => {
    var g;
    return f.kind === "nothing" || f.name !== ((g = e.tally) == null ? void 0 : g.last);
  });
  return c.some((f) => f.kind !== "nothing") ? c : i;
}
function jp(e, t) {
  const n = Np(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (So(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function So(e, t, n) {
  var s;
  for (const [a, o] of _o(t)) (s = e.memory) == null || s.set(a, e.now + Dp(o, n));
}
function sy(e, t, n) {
  So(e, Ss.find((s) => s.when.moment === e.moment && s.name === t), n);
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
}, ay = {
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
}, oy = 120, ry = (e) => da[e] || da.idle;
[.../* @__PURE__ */ new Set([...Object.values(xo).flatMap((e) => Object.keys(e)), ...Object.keys(Mo)])];
const Be = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function iy(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Be.ahead * n ? 180 : Math.sign(s) * Be.turn;
}
const ha = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function ly(e, t) {
  const n = Math.min(Be.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Be.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Be.lines, Math.floor((e.bottom - e.top - 2 * s) / Be.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Be.sweep) % a, i = o % Be.sweep, c = Be.sweep - Be.returnSeconds, u = ha((i - c) / Be.returnSeconds), f = i <= c ? ha(i / c) : 1 - u, g = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + g * Be.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Pp = 1, qp = (e, t, n, s, a, o = 0) => jp({ moment: "jump", high: e > Pp * t, memory: s, now: a, room: o }, n).name === "backflip", fa = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, cy = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, uy = { width: 24, height: 27, top: 3, units: 2 }, Wp = "[data-figure-pile]", dy = { amber: [1, 0.69, 0.125], good: fa.colours.good, bad: fa.colours.bad }, Ln = { phases: 4, dim: 0.25 }, hy = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, Fp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Ss.filter((e) => Fp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const fy = {
  width: 84,
  belly: 13,
  blink: 4
}, pa = "[data-figure-home]", qt = () => {
  var t;
  const e = document.querySelector(pa);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(pa)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Hp = "[data-figure-docked-bars]", Up = "[data-figure-chat-foot]", zp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Vp = "[data-figure-newest]";
function Gp() {
  var s, a;
  const e = (s = qt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Vp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
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
function Eo(e, t, n = Gp()) {
  if (!e || !n) return !0;
  const s = kt(e, t), a = As(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = St.gap;
  return !Oo(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const Dn = 0.26, Kp = 0.54, bn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Dn, travels: "stand" },
  lounge: { drop: Dn, travels: "stand" },
  composed: { drop: Dn, travels: "stand" },
  hang: { drop: Kp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Ao = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Yp = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), py = (e, t) => (e === "sit" ? Yp.has(t) : Ao.has(e)) ? e : "stand", my = 0.25, gy = (e, t) => Ao.has(e) && bn[t].drop === 0, Co = 2, Jp = 90, Zp = 180, Xp = 140, Qp = 280, em = 420, tm = 0.25, nm = 290, sm = 600, am = "cubic-bezier(0.2, 0.7, 0.4, 1)", om = "cubic-bezier(0.55, 0, 0.9, 0.6)", Nn = 5;
function dn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: f = 0, room: g = 0, pogo: w = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Nn) return null;
  (r || i) && (o = Math.max(o, Co));
  const M = o > 1, L = Math.abs(t.x - e.x), P = L < Nn ? 0 : L / (Jp * o) * 1e3, k = Math.min(P, M ? Xp : Zp), E = Math.abs(t.y - e.y), F = t.y < e.y, U = F && !w && qp(E, n, c, u, f, g), y = F ? em + Math.min(E, 400) * tm : Math.sqrt(2 * E / bo) * 1e3, m = {
    x: t.x,
    y: t.y,
    ms: E > Nn ? U ? sm : y : 0,
    lead: U ? nm : F ? Qp : 0,
    easing: F ? am : om,
    hopping: !0,
    clip: U ? "backflip" : F ? "jump" : "fall"
  }, I = { x: t.x, y: t.y, ms: P + k, lead: 0, easing: "linear", ramp: k, ...M ? { clip: "run" } : {} }, O = w ? rm(t, n) : m, q = F && !s ? [{ ...I, y: e.y }, O] : [{ ...m, x: e.x }, I];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !a, pace: o, running: M };
}
const rm = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), kt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - bn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Oo = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Es = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function bt() {
  var t;
  const e = (t = qt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Kt = 0.5, ma = 20;
function vy(e, t, n = bt()) {
  const s = kt(e, t);
  return s.left >= n.left + ma && s.right <= n.right - ma;
}
function To(e, t, n = bt()) {
  const s = kt(e, t), a = s.right - s.left, o = As(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Kt && i <= n.right + Kt && s.top >= n.top - Kt && c <= n.bottom + Kt;
}
const hn = [0.35, 0.5, 0.65], fn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: hn[0], right: hn.at(-1), top: fn[0], bottom: fn.at(-1) }, im = 0.24;
function As(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + im * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function lm(e, { size: t }, n = bt()) {
  const s = As(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const cm = (Je.right - Je.left) / 2 + 0.08;
function um(e, t, n = "", s = "") {
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
const dm = (e) => fn.flatMap(
  (t) => hn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function hm(e, t, n = "") {
  if (!Eo(e, t)) return hn.length * fn.length;
  const s = kt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(zp)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && Oo(a, c) && Es(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return dm(a).filter(([i, c]) => r(i, c) || um(i, c, n)).length;
}
function fm(e, t, n) {
  const s = bt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => To(r, t, s) && Eo(r, t)).map((r) => ({ spot: r, covered: hm(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Bo = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, pm = cm, mm = (e, t, { size: n }, s = pm) => gm(e, Bo[t], s * n, "stand");
function gm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const yy = (e) => ((e + 180) % 360 + 360) % 360 - 180, wy = { turns: [-20, -10, 0, 10, 20] }, vm = 7;
function ym() {
  const e = [...document.querySelectorAll(Wp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const wm = 4;
function km() {
  const e = Io(), t = ym(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > wm || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - vm - n, 0) } };
}
const ky = ({ size: e, below: t }) => (1 - t) * e;
function bm(e, t) {
  const n = bt(), { size: s, below: a } = t, o = bn[e.posture].drop * s;
  return { ...lm(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const $m = (e, t) => Object.keys(Bo).map((n) => bm(mm(e, n, t), t)), xm = (e, t, n) => fm(e, t, n) ?? e[0];
function by(e, t) {
  const { element: n, edge: s } = km();
  return { ...xm($m(s, e), e, t), view: null, on: n };
}
function Io() {
  var s;
  const e = qt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Hp);
  if (!t) return { ...Ro(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Ro() {
  const e = qt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const Mm = { climb: 90 };
function $y(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: f = 0, room: g = 0, pogo: w = !1 } = {}) {
  (o || r) && (a = Math.max(a, Co));
  const M = (U) => {
    const y = kt(U, n, bn[U.posture].travels);
    return { x: y.left, y: y.top };
  }, L = t.ladder ?? e.ladder;
  if (L && !(t.ladder && e.ladder)) return _m(M(e), M(t), M({ ...L.foot, posture: "stand" }), L.way, !!t.ladder, n, a);
  const [P, ...k] = [e, ...c, t].map(M), E = dn(P, k[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: f, room: g, pogo: w }), F = k.slice(1).map((U, y) => {
    var m;
    return (m = dn(k[y], U, n.size, { random: i, memory: u, now: f, room: g })) == null ? void 0 : m.legs.find((I) => I.hopping);
  });
  return E && { ...E, legs: [...E.legs, ...F.filter(Boolean)] };
}
function _m(e, t, n, s, a, o, r) {
  const i = (f, g) => ({ x: g.x, y: g.y, ms: Math.hypot(g.x - f.x, g.y - f.y) / Mm.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? dn(e, n, o.size, { pace: r }) : dn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const Sm = "[data-figure-bubble]", Em = 250;
let At = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Lo = 0;
const Do = () => At, jn = /* @__PURE__ */ new WeakMap();
let Am = 0;
function No(e) {
  return jn.has(e) || jn.set(e, `floor-${++Am}`), jn.get(e);
}
const Cm = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Om = () => {
  var e, t;
  return ((t = (e = qt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Tm(e, t) {
  var s;
  const n = (s = e.querySelector(Up)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Bm(e, t) {
  const n = e && Tm(e, t), s = e ? [...e.querySelectorAll(Sm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Cm(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: No(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Im = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Em ? (t.top - s.top) / a * 1e3 : 0;
};
function Rm(e = At, t = performance.now()) {
  const n = bt(), s = Om(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = Io(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = Ro();
  return u.element && c.push({ id: No(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...Bm(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((f) => Object.freeze({ ...f, vy: Im(e, f, t) }))) });
}
const hs = /* @__PURE__ */ new Set();
function Lm(e) {
  return hs.add(e), () => hs.delete(e);
}
function Dm() {
  jo();
  const e = () => {
    Lo = requestAnimationFrame(e), !document.hidden && (At = Rm(At), hs.forEach((t) => t(At)));
  };
  e();
}
function jo() {
  cancelAnimationFrame(Lo);
}
const Nm = (e, t) => e.find((n) => n.id === t) ?? null;
function xy(e, t, n = Do().floors) {
  const s = Nm(n, "home");
  return e.posture === "hang" && s && kt(e, t).bottom >= s.top ? !1 : To(e, t);
}
const jm = ["data-kind"], Pm = { class: "figure-floor-name" }, qm = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: be({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", Pm, b(e.floor.kind), 1)
    ], 12, jm));
  }
}, Wm = /* @__PURE__ */ Z(qm, [["__scopeId", "data-v-8f6132da"]]), Fm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Hm = {
  __name: "FigureFloors",
  setup(e) {
    const t = pn(Do().floors);
    let n = () => {
    };
    return De(() => {
      n = Lm((s) => t.value = s.floors), Dm();
    }), Ce(() => {
      n(), jo();
    }), (s, a) => (l(), d("div", Fm, [
      (l(!0), d(Q, null, re(t.value, (o) => (l(), K(Wm, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, My = /* @__PURE__ */ Z(Hm, [["__scopeId", "data-v-e519168b"]]), Pn = (e) => typeof e == "number" ? e : Date.parse(e);
function _y(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Pn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Pn(a.row.created_at) - Pn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Um = 3, qn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function zm(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = qn[n.grouping]) == null ? void 0 : s.call(qn, e.row, n)) || "";
}
function Vm(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Sy(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Um ? [Vm(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = zm(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Gm = 1e3;
function Ey() {
  const e = j(Date.now()), t = setInterval(() => e.value = Date.now(), Gm);
  return yt(() => clearInterval(t)), e;
}
function Ay(e) {
  const t = vs(), n = j(null), s = j("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const Km = {
  class: "cards-page",
  "data-window-flush": ""
}, Ym = { class: "cards-bar" }, Jm = { class: "cards-count" }, Zm = { class: "cards" }, Xm = {
  key: 1,
  class: "cards-note"
}, Qm = {
  key: 2,
  class: "cards-note"
}, eg = ["data-row", "onClick"], tg = { class: "card-head" }, ng = { class: "card-age" }, sg = { class: "card-title" }, ag = { class: "card-foot" }, og = {
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
    return (s, a) => (l(), d("div", Km, [
      p("div", Ym, [
        p("span", Jm, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
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
            he(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", Zm, [
        e.loaded ? e.failure ? (l(), d("p", Xm, b(e.failure), 1)) : e.rows.length ? N("", !0) : (l(), d("p", Qm, "No " + b(e.noun) + "s yet", 1)) : (l(), K(wt, {
          key: 0,
          shape: "cards"
        })),
        (l(!0), d(Q, null, re(e.rows, (o) => (l(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          p("span", tg, [
            H(xe, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            he(" " + b(e.head(o)), 1),
            p("span", ng, b(G(Yn)(o.created_at)), 1)
          ]),
          p("span", sg, b(e.title(o)), 1),
          p("span", ag, b(e.foot(o)), 1)
        ], 8, eg))), 128))
      ]),
      we(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Cy = /* @__PURE__ */ Z(og, [["__scopeId", "data-v-d72d528d"]]), ga = "newest";
function Oy(e, { title: t, isOpen: n = null }) {
  const s = j(""), a = j(ga), o = j("all"), r = C(() => {
    const i = s.value.trim().toLowerCase(), c = e.value.filter((u) => (!i || JSON.stringify(u).toLowerCase().includes(i)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === ga ? c : [...c].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: r, hasStates: !!n };
}
const rg = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, ig = 40, lg = "top", cg = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var g;
    const n = e, s = (g = Ae(Ne, null)) == null ? void 0 : g.autoScroll, a = C(() => s === lg), o = j(null), r = j(!1), i = (w) => a.value ? w.scrollTop : w.scrollHeight - w.scrollTop - w.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function f() {
      r.value = i(o.value) >= ig;
    }
    return ke(() => n.rowCount, async () => {
      await Rt(), !r.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (w, M) => (l(), d("div", rg, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: ee(["auto-scroll-pane", e.paneClass]),
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
            M[0] || (M[0] = he(" Newest ", -1))
          ], 512), [
            [tr, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Ty = /* @__PURE__ */ Z(cg, [["__scopeId", "data-v-3accb764"]]), ug = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, dg = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Ae(Ne, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (l(), d("div", ug, [
      (l(!0), d(Q, null, re(G(s), (i) => {
        var c;
        return l(), K(ye, {
          key: i.key,
          kind: "text",
          class: ee(["inner-tab", { on: ((c = e.active) == null ? void 0 : c.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: V(() => [
            he(b(i.label) + " " + b(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, By = /* @__PURE__ */ Z(dg, [["__scopeId", "data-v-cf3bb39f"]]), hg = {
  class: "list-tools",
  "data-list-tools": ""
}, fg = {
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
    return (s, a) => (l(), d("div", hg, [
      H(Ih, {
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
      }, null, 8, ["value"])) : N("", !0)
    ]));
  }
}, Iy = /* @__PURE__ */ Z(fg, [["__scopeId", "data-v-b2dd0a0d"]]);
function Ry() {
  const e = j(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const pg = 86400, fs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function mg(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((fs(t) - fs(e)) / pg);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function Ly(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = fs(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: mg(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Wn = 280, Fn = 240, Hn = 120, gg = 6, vg = 14, Bt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function yg(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${vg}px)` }), e.offsetHeight, e.style.transition = `height ${Wn}ms ${Bt}`, e.style.height = `${r}px`;
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
function Dy(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${gg}px)` }), e.offsetHeight, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${Bt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - r < Hn) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const wg = 140, Yt = 220, kg = 5;
function Ny({ gap: e = wg, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, kg);
    if (s = i.length > 0, !s) return;
    let c = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), c -= 1, c || t(o, e);
      });
  }
  const r = (i, c, u, f = yg) => {
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
function jy(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Yt}ms ${Bt}, opacity ${Yt}ms ease-in, margin ${Yt}ms ${Bt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Yt);
}
const Po = "chat.pins.minimised", Qt = j(Ct(Po, !1));
function va(e) {
  Qt.value = e, mn(Po, e);
}
function bg(e) {
  const t = C(() => e()), n = C(() => Qt.value ? [] : e()), s = () => va(!Qt.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Ba(o) > a).length,
    (o, r) => o > r && va(!1)
  ), { pins: t, visible: n, minimised: Qt, toggle: s };
}
const $g = ["title"], xg = {
  key: 0,
  class: "pins-count"
}, Mg = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = bg(() => t.notices);
    return (o, r) => G(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: ee(["pins-toggle", { minimised: G(s), inline: e.inline }]),
      title: G(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = _e((...i) => G(a) && G(a)(...i), ["stop"]))
    }, [
      H(xe, {
        name: G(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      G(s) ? (l(), d("span", xg, b(G(n).length), 1)) : N("", !0)
    ], 10, $g)) : N("", !0);
  }
}, Py = /* @__PURE__ */ Z(Mg, [["__scopeId", "data-v-c0d11526"]]), _g = ["title"], Sg = ["title"], Eg = { class: "diff-card-dir" }, Ag = { class: "diff-card-name" }, Cg = { class: "diff-card-ago" }, Og = ["title"], Tg = ["title"], Bg = {
  key: 0,
  class: "diff-card-note"
}, Ig = ["href"], Rg = ["src", "alt"], Lg = { class: "diff-card-rows" }, Dg = { class: "diff-row-num" }, Ng = { class: "diff-row-sign" }, jg = { class: "diff-row-code" }, Pg = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = C(() => n.path.lastIndexOf("/") + 1), u = C(() => n.path.slice(0, c.value)), f = C(() => n.path.slice(c.value)), g = C(() => n.kind === "deleted"), w = C(() => r[n.kind]), M = C(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), L = j("after"), P = C(() => L.value === "before" ? n.whole.old : n.whole.text), k = C(() => n.whole && n.whole.text !== void 0 ? P.value.split(`
`).map((S, v) => ({ line_type: L.value === "after" && M.value.has(v + 1) ? "add" : "ctx", line: v + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), E = j(!1), F = C(() => n.lines && !E.value && !n.whole), U = C(() => F.value ? k.value.slice(0, n.lines) : k.value), y = C(() => k.value.length - U.value.length), m = (S) => S.line === null || S.line_type === "del" ? "" : S.line, I = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, O = j(null), q = j(null);
    let $ = null;
    return De(() => {
      if (!q.value) return;
      let S = !0;
      $ = new ResizeObserver(() => {
        !O.value || !q.value || (O.value.style.transition = S ? "none" : "", O.value.style.height = `${q.value.offsetHeight}px`, S = !1);
      }), $.observe(q.value);
    }), Ce(() => $ && $.disconnect()), (S, v) => (l(), d("section", {
      class: ee(["diff-card", { half: e.half, gone: g.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
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
          p("span", Eg, b(u.value), 1),
          p("span", Ag, b(f.value), 1),
          w.value ? (l(), d("span", {
            key: 0,
            class: ee(["diff-card-badge", e.kind])
          }, b(w.value), 3)) : N("", !0)
        ], 8, Sg),
        p("span", {
          class: ee(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        p("span", {
          class: ee(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        p("span", Cg, b(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: L.value === "after" ? "Show the file before" : "Show the file after",
          onClick: v[0] || (v[0] = _e((h) => L.value = L.value === "after" ? "before" : "after", ["stop"]))
        }, b(L.value === "after" ? "After" : "Before"), 9, Og)) : N("", !0),
        g.value ? N("", !0) : (l(), d("button", {
          key: 1,
          type: "button",
          class: ee(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: v[1] || (v[1] = _e((h) => s("whole"), ["stop"]))
        }, [
          H(xe, {
            name: "file",
            size: 12
          })
        ], 10, Tg))
      ], 8, _g),
      e.whole && e.whole.error ? (l(), d("p", Bg, b(e.whole.error), 1)) : N("", !0),
      !g.value && !e.folded ? (l(), d(Q, { key: 1 }, [
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
          }, null, 8, Rg)
        ], 8, Ig)) : (l(), d("div", {
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
            p("div", Lg, [
              (l(!0), d(Q, null, re(U.value, (h, A) => (l(), d("div", {
                key: A,
                class: ee(["diff-row", h.line_type, { fresh: e.fresh && h.edit === e.fresh }])
              }, [
                p("span", Dg, b(m(h)), 1),
                p("span", Ng, b(i[h.line_type]), 1),
                p("span", jg, b(I(h)), 1)
              ], 2))), 128)),
              y.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: v[3] || (v[3] = _e((h) => E.value = !0, ["stop"]))
              }, b(y.value) + " more " + b(y.value === 1 ? "line" : "lines"), 1)) : N("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : N("", !0)
    ], 2));
  }
}, qy = /* @__PURE__ */ Z(Pg, [["__scopeId", "data-v-b6424f6e"]]), qg = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Wg = {
  key: 1,
  class: "menu-item-text"
}, Fg = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), d("span", qg, b(e.checked ? "✓" : ""), 1)) : N("", !0),
      e.description ? (l(), d("span", Wg, [
        p("span", null, [
          we(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, b(e.description), 1)
      ])) : we(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Hg = /* @__PURE__ */ Z(Fg, [["__scopeId", "data-v-c91b190e"]]), Ug = {}, zg = { class: "menu-label" };
function Vg(e, t) {
  return l(), d("span", zg, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Gg = /* @__PURE__ */ Z(Ug, [["render", Vg], ["__scopeId", "data-v-aa955b3e"]]), qo = /* @__PURE__ */ new WeakMap(), Kg = (e, t) => qo.set(e, t);
function Yg(e, t) {
  for (let n = t; n; n = qo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Jg(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Yg(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ce(() => window.removeEventListener("click", n));
}
const ft = 8, Zg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = j(null), o = (h) => h ? `${h}px` : void 0, r = C(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = j({ w: 0, h: 0 }), c = j(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), g = (h) => {
      const A = h.closest(".pane, .float-window");
      return A ? f(A.getBoundingClientRect()) : u();
    }, w = (h, A) => `${Math.max(0, h ? Math.min(h, A) : A)}px`;
    function M(h, A) {
      return {
        below: h.bottom - A.bottom - s.gap - ft,
        above: A.top - h.top - s.gap - ft,
        across: h.right - h.left - 2 * ft
      };
    }
    function L(h) {
      const A = g(s.anchor), T = M(A, h);
      return i.value.w <= T.across && i.value.h <= Math.max(T.below, T.above) ? A : u();
    }
    const P = C(() => {
      if (!c.value) return r.value;
      const h = c.value, A = L(h), T = M(A, h), { w: _, h: J } = i.value, z = s.align === "auto" ? h.left + h.right > A.left + A.right : s.align === "right", ue = bi(z ? h.right - _ : h.left, A.left + ft, Math.max(A.left + ft, A.right - _ - ft)), me = J > T.below && T.above > T.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: w(s.maxHeight, T.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: w(s.maxHeight, T.below) };
      return { ...r.value, ...me, left: `${ue}px`, maxWidth: w(s.maxWidth, T.across) };
    }), k = n, E = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function F(h) {
      const A = E(), T = A.indexOf(document.activeElement);
      A[(T + h + A.length) % A.length].focus();
    }
    const U = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => k("close") }, y = (h) => U[h.key] && (h.preventDefault(), U[h.key]()), m = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let I = 0;
    const O = new ResizeObserver(() => {
      cancelAnimationFrame(I), I = requestAnimationFrame(m);
    });
    Jg(a, (h) => s.anchor && !s.anchor.contains(h.target) && k("close"));
    const q = (h, A) => ["top", "left", "right", "bottom"].some((T) => Math.abs(h[T] - A[T]) > 1), $ = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let S = 0;
    function v() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || $(h)) return k("close");
        q(h, c.value) && (c.value = h);
      }
      S = requestAnimationFrame(v);
    }
    return De(() => {
      s.anchor && a.value && Kg(a.value, s.anchor), m(), a.value && O.observe(a.value), !s.plain && E()[0] && E()[0].focus(), v();
    }), Ce(() => {
      O.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(I);
    }), t({ element: a }), (h, A) => (l(), K(ka, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", ot({
        ref_key: "panel",
        ref: a
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: P.value,
        onKeydown: y
      }), [
        we(h.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Xg = /* @__PURE__ */ Z(Zg, [["__scopeId", "data-v-3d203970"]]), Qg = {
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
        H(xe, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, e0 = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [{ word: "approve", label: "Approve", main: !0 }, He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, t0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, n0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], s0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], a0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], o0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], r0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], i0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? r0(t) : e === "agent" ? [...a0(t), ...s0(t)] : e === "check" ? o0(t) : e === "question" ? n0(t) : ((n = { plan: e0, task: t0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, l0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, c0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, u0 = { class: "ask-text" }, d0 = ["placeholder", "aria-label"], h0 = ["placeholder", "aria-label"], f0 = {
  key: 3,
  class: "moves"
}, p0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = C(() => i0(s.kind, s.row)), r = j(""), i = j(null), c = j(""), u = j("");
    ke(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function f(M, L = "") {
      const P = await s.read([M.noun ?? s.kind, M.word, String(s.id), ...M.flag ? [M.flag, L] : M.positional ? [L] : [], ...M.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = P.ok ? "" : P.error, P.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const g = (M) => M.confirm ? i.value = M : M.said ? f(M, M.said) : M.flag || M.positional ? (i.value = M, c.value = "") : f(M), w = () => c.value.trim() && f(i.value, c.value.trim());
    return t({ moves: o, press: g }), (M, L) => {
      var P;
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: ee(["foot", { inline: e.inline }])
      }, [
        r.value ? (l(), d("p", l0, b(r.value), 1)) : N("", !0),
        (P = i.value) != null && P.confirm ? (l(), d("div", c0, [
          p("span", u0, b(i.value.confirm), 1),
          H(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: L[0] || (L[0] = (k) => f(i.value))
          }, {
            default: V(() => [
              he(b(i.value.label), 1)
            ]),
            _: 1
          }),
          H(ye, {
            small: "",
            kind: "ghost",
            onClick: L[1] || (L[1] = (k) => i.value = null)
          }, {
            default: V(() => [...L[7] || (L[7] = [
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
            "onUpdate:modelValue": L[2] || (L[2] = (k) => c.value = k),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: L[3] || (L[3] = en(_e((k) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, d0), [
            [Gn, c.value]
          ]),
          i.value.opener ? rt((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": L[4] || (L[4] = (k) => u.value = k),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: L[5] || (L[5] = en(_e((k) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, h0)), [
            [Gn, u.value]
          ]) : N("", !0),
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
            onClick: L[6] || (L[6] = (k) => i.value = null)
          }, {
            default: V(() => [...L[8] || (L[8] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", f0, [
          (l(!0), d(Q, null, re(o.value, (k) => (l(), K(ye, {
            key: k.word,
            small: "",
            kind: k.main ? "primary" : "ghost",
            "data-move": k.word,
            onClick: (E) => g(k)
          }, {
            default: V(() => [
              he(b(k.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : N("", !0);
    };
  }
}, m0 = /* @__PURE__ */ Z(p0, [["__scopeId", "data-v-fffa0bf6"]]), g0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, v0 = { ...g0, done: "Completed" }, y0 = { class: "task-status-icon" }, w0 = ["width", "height", "aria-label"], k0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", y0, [
      H(It, {
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
            "aria-label": G(v0)[e.status]
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
          ], 10, w0))
        ]),
        _: 1
      })
    ]));
  }
}, Wo = /* @__PURE__ */ Z(k0, [["__scopeId", "data-v-2ab7e404"]]), b0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), $0 = (e) => b0.has(e), Fo = (e) => $0(e) ? "done" : e, x0 = { class: "facts" }, M0 = { class: "fact wide" }, _0 = { class: "fact-value" }, S0 = {
  key: 0,
  class: "fact"
}, E0 = { class: "fact-value" }, A0 = {
  key: 1,
  class: "fact"
}, C0 = { class: "fact-value" }, O0 = { class: "fact wide" }, T0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, B0 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = ln.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return l(), d("div", x0, [
        p("div", M0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", _0, b((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", S0, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", E0, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : N("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", A0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", C0, "Agent " + b(e.task.holder_id), 1)
        ])) : N("", !0),
        p("div", O0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          H(as, {
            options: G(n),
            value: String(G(co)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", T0, b(e.refusal), 1)) : N("", !0)
        ])
      ]);
    };
  }
}, I0 = /* @__PURE__ */ Z(B0, [["__scopeId", "data-v-2018762d"]]), R0 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, L0 = ["onClick"], D0 = { class: "wait-id" }, N0 = { class: "wait-title" }, j0 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, P0 = { class: "text" }, q0 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, W0 = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, F0 = 180, H0 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = j(!1);
    return (a, o) => (l(), d(Q, null, [
      e.task.waits.length ? (l(), d("section", R0, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (l(!0), d(Q, null, re(e.task.waits, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          H(Wo, {
            status: G(Fo)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", D0, b(r.id), 1),
          p("span", N0, b(r.title), 1)
        ], 8, L0))), 128))
      ])) : N("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", j0, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", P0, b(e.task.outcome), 1)
      ])) : N("", !0),
      e.task.brief ? (l(), d("section", q0, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: ee(["text", { clamped: !s.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > F0 && !s.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : N("", !0)
      ])) : N("", !0),
      e.task.logs.length ? (l(), d("section", W0, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(Q, null, re(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, b(r.line), 1))), 128))
      ])) : N("", !0)
    ], 64));
  }
}, U0 = /* @__PURE__ */ Z(H0, [["__scopeId", "data-v-f411ce35"]]), z0 = { class: "comment-side-head" }, V0 = {
  key: 0,
  class: "comment-none"
}, G0 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), d("aside", {
      class: ee(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", z0, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        H(ys, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? N("", !0) : (l(), d("p", V0, "No comments yet")),
      (l(!0), d(Q, null, re(e.comments, (s) => (l(), d("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, b(e.words(s)), 1))), 128))
    ], 2));
  }
}, K0 = /* @__PURE__ */ Z(G0, [["__scopeId", "data-v-19fdbdd4"]]), Y0 = ["data-comments-below"], J0 = 600, Z0 = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = j(null), n = j(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < J0);
    return De(() => s.observe(t.value)), yt(() => s.disconnect()), (a, o) => (l(), d("div", {
      ref_key: "root",
      ref: t,
      class: ee(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      we(a.$slots, "default"),
      e.open ? (l(), K(K0, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : N("", !0)
    ], 10, Y0));
  }
}, X0 = /* @__PURE__ */ Z(Z0, [["__scopeId", "data-v-6c850df0"]]), Q0 = ["placeholder"], ev = { class: "actions" }, tv = { class: "error" }, nv = {
  key: 1,
  class: "card closed"
}, sv = { class: "mark" }, av = { class: "prompt" }, ov = {
  key: 0,
  class: "draft"
}, rv = {
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
    const s = e, a = n, o = zn(e, "draft"), r = zn(e, "error"), i = j(!!r.value), c = j(!1), u = j(!1), f = j(null);
    async function g() {
      var P, k;
      i.value = !0, c.value = !1, await Rt(), (k = ((P = f.value) == null ? void 0 : P.querySelector("input")) || f.value) == null || k.focus();
    }
    function w() {
      i.value = !1, r.value = "";
    }
    function M(P) {
      P.shiftKey || P.isComposing || (P.preventDefault(), L());
    }
    async function L() {
      const P = o.value.trim();
      if (!(!P || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(P), i.value = !1, c.value = !0;
        } catch (k) {
          o.value = P, r.value = k.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: g }), (P, k) => (l(), d("div", {
      class: ee(["comment-bar", { open: i.value }])
    }, [
      i.value ? (l(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: _e(L, ["prevent"]),
        onKeydown: en(w, ["esc"])
      }, [
        we(P.$slots, "who", {}, void 0, !0),
        rt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": k[0] || (k[0] = (E) => o.value = E),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: en(M, ["enter"])
        }, null, 40, Q0), [
          [Gn, o.value]
        ]),
        p("div", ev, [
          p("span", tv, b(r.value), 1),
          H(ye, {
            small: "",
            onClick: w
          }, {
            default: V(() => [...k[2] || (k[2] = [
              he("Cancel", -1)
            ])]),
            _: 1
          }),
          H(ye, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: L
          }, {
            default: V(() => [...k[3] || (k[3] = [
              he("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (l(), d("div", nv, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: g
        }, [
          p("span", sv, [
            H(xe, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", av, b(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", ov, "Draft kept")) : N("", !0)
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[1] || (k[1] = (E) => a("show"))
        }, [
          p("span", null, b(G($i)(e.count, "comment")), 1),
          H(xe, {
            name: "down",
            size: 12
          })
        ])) : N("", !0)
      ]))
    ], 2));
  }
}, iv = /* @__PURE__ */ Z(rv, [["__scopeId", "data-v-79db0c2d"]]);
function lv(e, t) {
  const n = j([]), s = j(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: f, id: g, title: w } = e(), M = `On ${f} ${g}, ${w}: `;
    return u.text.startsWith(M) ? u.text.slice(M.length) : u.text;
  };
  async function i() {
    const { kind: u, id: f } = e();
    if (!f) return;
    const g = ++o, w = await t([u, "comments", String(f)]);
    g === o && (n.value = w.ok ? w.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: f, id: g } = e(), w = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, w], s.value = !0;
    const M = await t([f, "comment", String(g), u]);
    if (!M.ok)
      throw n.value = n.value.filter((L) => L !== w && L.id !== w.id), new Error(M.error);
    await i();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: c, load: i };
}
const cv = { class: "top" }, uv = {
  class: "crumb",
  "data-task-crumb": ""
}, dv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, hv = {
  key: 1,
  class: "body"
}, fv = { class: "stamp" }, pv = {
  class: "title",
  "data-resource-title": ""
}, mv = { class: "since" }, gv = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, vv = { class: "text" }, yv = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, wv = {
  key: 1,
  class: "note"
}, kv = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, bv = { class: "text" }, $v = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = j(null), r = j(null), i = j(""), c = j(""), u = j(null), f = j(null), g = lv(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (y) => s.read(y));
    ke(g.open, (y) => a("comments", y));
    let w = 0;
    const M = Fo, L = (y) => y.slice(0, 1).toUpperCase() + y.slice(1), P = C(() => {
      var y;
      return (y = r.value) != null && y.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function k() {
      const y = ++w, [m, I] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      y === w && (i.value = m.ok ? "" : m.error, o.value = m.ok ? m.value : null, r.value = I.ok ? I.value : null);
    }
    ke(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, k();
    }, { immediate: !0 }), ke(() => s.changes, k);
    async function E(y) {
      const m = o.value.priority;
      o.value.priority = Number(y);
      const I = await s.read(["task", "edit", String(s.id), "--priority", y]);
      if (c.value = I.ok ? "" : I.error, I.ok) return k();
      o.value.priority = m;
    }
    function F(y) {
      u.value = null, f.value.press(y);
    }
    const U = (y) => {
      var m;
      return ((m = f.value) == null ? void 0 : m.moves.length) && (u.value = y);
    };
    return t({ openStatus: U }), (y, m) => (l(), d("aside", {
      class: ee(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", cv, [
        e.backed ? (l(), K(Qg, {
          key: 0,
          onBack: m[0] || (m[0] = (I) => a("back"))
        })) : N("", !0),
        p("span", uv, b(P.value), 1),
        m[9] || (m[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(Q, { key: 1 }, [
          H(ye, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: m[1] || (m[1] = (I) => a("step", -1))
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
            onClick: m[2] || (m[2] = (I) => a("step", 1))
          }, {
            default: V(() => [
              H(xe, {
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
          onClick: m[3] || (m[3] = (I) => a("close"))
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
      i.value ? (l(), d("p", dv, b(i.value), 1)) : o.value ? (l(), d(Q, { key: 2 }, [
        H(X0, {
          open: G(g).open.value,
          comments: G(g).comments.value,
          words: G(g).words,
          onClose: m[6] || (m[6] = (I) => G(g).open.value = !1)
        }, {
          default: V(() => {
            var I;
            return [
              (l(), d("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", fv, "Task " + b(o.value.id) + " · updated " + b(G(Yn)(G(an)(o.value)) || "just now"), 1),
                p("h3", pv, b(o.value.title), 1),
                p("div", {
                  class: ee(["state-line", G(M)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: m[4] || (m[4] = (O) => U(O.currentTarget))
                  }, [
                    H(Wo, {
                      status: G(M)(o.value.state)
                    }, null, 8, ["status"]),
                    he(" " + b(L(o.value.state)), 1)
                  ]),
                  p("span", mv, "since " + b(G(Yn)(G(an)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", gv, [
                  m[10] || (m[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", vv, b(o.value.reason || "Other tasks"), 1),
                  (I = o.value.openers) != null && I.length ? (l(), d("p", yv, "Opens by itself when " + b(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", wv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", kv, [
                  m[11] || (m[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", bv, b(o.value.reason), 1)
                ])) : N("", !0),
                H(I0, {
                  task: o.value,
                  place: r.value,
                  refusal: c.value,
                  onPriority: E
                }, null, 8, ["task", "place", "refusal"]),
                H(U0, {
                  task: o.value,
                  onSelect: m[5] || (m[5] = (O) => a("select", O))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        H(iv, {
          send: G(g).send,
          count: G(g).comments.value.length,
          onShow: m[7] || (m[7] = (I) => G(g).open.value = !G(g).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", hv, [
        H(wt)
      ])),
      H(m0, {
        ref_key: "footer",
        ref: f,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: k
      }, null, 8, ["id", "row", "read"]),
      u.value ? (l(), K(Xg, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: m[8] || (m[8] = (I) => u.value = null)
      }, {
        default: V(() => [
          H(Gg, null, {
            default: V(() => [
              he("Change the status of task " + b(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(Q, null, re(f.value.moves, (I) => (l(), K(Hg, {
            key: I.word,
            onClick: (O) => F(I)
          }, {
            default: V(() => [
              he(b(I.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : N("", !0)
    ], 2));
  }
}, Wy = /* @__PURE__ */ Z($v, [["__scopeId", "data-v-c76befc4"]]);
function xv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Un = { exports: {} }, ya;
function Mv() {
  return ya || (ya = 1, (function(e, t) {
    var n = (function() {
      var s = function(m, I) {
        var O = 236, q = 17, $ = m, S = o[I], v = null, h = 0, A = null, T = [], _ = {}, J = function(B, R) {
          h = $ * 4 + 17, v = (function(x) {
            for (var D = new Array(x), W = 0; W < x; W += 1) {
              D[W] = new Array(x);
              for (var X = 0; X < x; X += 1)
                D[W][X] = null;
            }
            return D;
          })(h), z(0, 0), z(h - 7, 0), z(0, h - 7), me(), le(), qe(B, R), $ >= 7 && Se(B), A == null && (A = Ho($, S, T)), We(A, R);
        }, z = function(B, R) {
          for (var x = -1; x <= 7; x += 1)
            if (!(B + x <= -1 || h <= B + x))
              for (var D = -1; D <= 7; D += 1)
                R + D <= -1 || h <= R + D || (0 <= x && x <= 6 && (D == 0 || D == 6) || 0 <= D && D <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= D && D <= 4 ? v[B + x][R + D] = !0 : v[B + x][R + D] = !1);
        }, ue = function() {
          for (var B = 0, R = 0, x = 0; x < 8; x += 1) {
            J(!0, x);
            var D = i.getLostPoint(_);
            (x == 0 || B > D) && (B = D, R = x);
          }
          return R;
        }, le = function() {
          for (var B = 8; B < h - 8; B += 1)
            v[B][6] == null && (v[B][6] = B % 2 == 0);
          for (var R = 8; R < h - 8; R += 1)
            v[6][R] == null && (v[6][R] = R % 2 == 0);
        }, me = function() {
          for (var B = i.getPatternPosition($), R = 0; R < B.length; R += 1)
            for (var x = 0; x < B.length; x += 1) {
              var D = B[R], W = B[x];
              if (v[D][W] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? v[D + X][W + ae] = !0 : v[D + X][W + ae] = !1;
            }
        }, Se = function(B) {
          for (var R = i.getBCHTypeNumber($), x = 0; x < 18; x += 1) {
            var D = !B && (R >> x & 1) == 1;
            v[Math.floor(x / 3)][x % 3 + h - 8 - 3] = D;
          }
          for (var x = 0; x < 18; x += 1) {
            var D = !B && (R >> x & 1) == 1;
            v[x % 3 + h - 8 - 3][Math.floor(x / 3)] = D;
          }
        }, qe = function(B, R) {
          for (var x = S << 3 | R, D = i.getBCHTypeInfo(x), W = 0; W < 15; W += 1) {
            var X = !B && (D >> W & 1) == 1;
            W < 6 ? v[W][8] = X : W < 8 ? v[W + 1][8] = X : v[h - 15 + W][8] = X;
          }
          for (var W = 0; W < 15; W += 1) {
            var X = !B && (D >> W & 1) == 1;
            W < 8 ? v[8][h - W - 1] = X : W < 9 ? v[8][15 - W - 1 + 1] = X : v[8][15 - W - 1] = X;
          }
          v[h - 8][8] = !B;
        }, We = function(B, R) {
          for (var x = -1, D = h - 1, W = 7, X = 0, ae = i.getMaskFunction(R), se = h - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (v[D][se - ge] == null) {
                  var $e = !1;
                  X < B.length && ($e = (B[X] >>> W & 1) == 1);
                  var oe = ae(D, se - ge);
                  oe && ($e = !$e), v[D][se - ge] = $e, W -= 1, W == -1 && (X += 1, W = 7);
                }
              if (D += x, D < 0 || h <= D) {
                D -= x, x = -x;
                break;
              }
            }
        }, ut = function(B, R) {
          for (var x = 0, D = 0, W = 0, X = new Array(R.length), ae = new Array(R.length), se = 0; se < R.length; se += 1) {
            var ge = R[se].dataCount, $e = R[se].totalCount - ge;
            D = Math.max(D, ge), W = Math.max(W, $e), X[se] = new Array(ge);
            for (var oe = 0; oe < X[se].length; oe += 1)
              X[se][oe] = 255 & B.getBuffer()[oe + x];
            x += ge;
            var Oe = i.getErrorCorrectPolynomial($e), Te = u(X[se], Oe.getLength() - 1), Cs = Te.mod(Oe);
            ae[se] = new Array(Oe.getLength() - 1);
            for (var oe = 0; oe < ae[se].length; oe += 1) {
              var Os = oe + Cs.getLength() - ae[se].length;
              ae[se][oe] = Os >= 0 ? Cs.getAt(Os) : 0;
            }
          }
          for (var Ts = 0, oe = 0; oe < R.length; oe += 1)
            Ts += R[oe].totalCount;
          for (var $n = new Array(Ts), Wt = 0, oe = 0; oe < D; oe += 1)
            for (var se = 0; se < R.length; se += 1)
              oe < X[se].length && ($n[Wt] = X[se][oe], Wt += 1);
          for (var oe = 0; oe < W; oe += 1)
            for (var se = 0; se < R.length; se += 1)
              oe < ae[se].length && ($n[Wt] = ae[se][oe], Wt += 1);
          return $n;
        }, Ho = function(B, R, x) {
          for (var D = f.getRSBlocks(B, R), W = g(), X = 0; X < x.length; X += 1) {
            var ae = x[X];
            W.put(ae.getMode(), 4), W.put(ae.getLength(), i.getLengthInBits(ae.getMode(), B)), ae.write(W);
          }
          for (var se = 0, X = 0; X < D.length; X += 1)
            se += D[X].dataCount;
          if (W.getLengthInBits() > se * 8)
            throw "code length overflow. (" + W.getLengthInBits() + ">" + se * 8 + ")";
          for (W.getLengthInBits() + 4 <= se * 8 && W.put(0, 4); W.getLengthInBits() % 8 != 0; )
            W.putBit(!1);
          for (; !(W.getLengthInBits() >= se * 8 || (W.put(O, 8), W.getLengthInBits() >= se * 8)); )
            W.put(q, 8);
          return ut(W, D);
        };
        _.addData = function(B, R) {
          R = R || "Byte";
          var x = null;
          switch (R) {
            case "Numeric":
              x = w(B);
              break;
            case "Alphanumeric":
              x = M(B);
              break;
            case "Byte":
              x = L(B);
              break;
            case "Kanji":
              x = P(B);
              break;
            default:
              throw "mode:" + R;
          }
          T.push(x), A = null;
        }, _.isDark = function(B, R) {
          if (B < 0 || h <= B || R < 0 || h <= R)
            throw B + "," + R;
          return v[B][R];
        }, _.getModuleCount = function() {
          return h;
        }, _.make = function() {
          if ($ < 1) {
            for (var B = 1; B < 40; B++) {
              for (var R = f.getRSBlocks(B, S), x = g(), D = 0; D < T.length; D++) {
                var W = T[D];
                x.put(W.getMode(), 4), x.put(W.getLength(), i.getLengthInBits(W.getMode(), B)), W.write(x);
              }
              for (var X = 0, D = 0; D < R.length; D++)
                X += R[D].dataCount;
              if (x.getLengthInBits() <= X * 8)
                break;
            }
            $ = B;
          }
          J(!1, ue());
        }, _.createTableTag = function(B, R) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + R + "px;", x += '">', x += "<tbody>";
          for (var D = 0; D < _.getModuleCount(); D += 1) {
            x += "<tr>";
            for (var W = 0; W < _.getModuleCount(); W += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + B + "px;", x += " height: " + B + "px;", x += " background-color: ", x += _.isDark(D, W) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, _.createSvgTag = function(B, R, x, D) {
          var W = {};
          typeof arguments[0] == "object" && (W = arguments[0], B = W.cellSize, R = W.margin, x = W.alt, D = W.title), B = B || 2, R = typeof R > "u" ? B * 4 : R, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, D = typeof D == "string" ? { text: D } : D || {}, D.text = D.text || null, D.id = D.text ? D.id || "qrcode-title" : null;
          var X = _.getModuleCount() * B + R * 2, ae, se, ge, $e, oe = "", Oe;
          for (Oe = "l" + B + ",0 0," + B + " -" + B + ",0 0,-" + B + "z ", oe += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', oe += W.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', oe += ' viewBox="0 0 ' + X + " " + X + '" ', oe += ' preserveAspectRatio="xMinYMin meet"', oe += D.text || x.text ? ' role="img" aria-labelledby="' + dt([D.id, x.id].join(" ").trim()) + '"' : "", oe += ">", oe += D.text ? '<title id="' + dt(D.id) + '">' + dt(D.text) + "</title>" : "", oe += x.text ? '<description id="' + dt(x.id) + '">' + dt(x.text) + "</description>" : "", oe += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', oe += '<path d="', ge = 0; ge < _.getModuleCount(); ge += 1)
            for ($e = ge * B + R, ae = 0; ae < _.getModuleCount(); ae += 1)
              _.isDark(ge, ae) && (se = ae * B + R, oe += "M" + se + "," + $e + Oe);
          return oe += '" stroke="transparent" fill="black"/>', oe += "</svg>", oe;
        }, _.createDataURL = function(B, R) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var x = _.getModuleCount() * B + R * 2, D = R, W = x - R;
          return y(x, x, function(X, ae) {
            if (D <= X && X < W && D <= ae && ae < W) {
              var se = Math.floor((X - D) / B), ge = Math.floor((ae - D) / B);
              return _.isDark(ge, se) ? 0 : 1;
            } else
              return 1;
          });
        }, _.createImgTag = function(B, R, x) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var D = _.getModuleCount() * B + R * 2, W = "";
          return W += "<img", W += ' src="', W += _.createDataURL(B, R), W += '"', W += ' width="', W += D, W += '"', W += ' height="', W += D, W += '"', x && (W += ' alt="', W += dt(x), W += '"'), W += "/>", W;
        };
        var dt = function(B) {
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
        }, Uo = function(B) {
          var R = 1;
          B = typeof B > "u" ? R * 2 : B;
          var x = _.getModuleCount() * R + B * 2, D = B, W = x - B, X, ae, se, ge, $e, oe = {
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
            for (se = Math.floor((X - D) / R), ge = Math.floor((X + 1 - D) / R), ae = 0; ae < x; ae += 1)
              $e = "█", D <= ae && ae < W && D <= X && X < W && _.isDark(se, Math.floor((ae - D) / R)) && ($e = " "), D <= ae && ae < W && D <= X + 1 && X + 1 < W && _.isDark(ge, Math.floor((ae - D) / R)) ? $e += " " : $e += "█", Te += B < 1 && X + 1 >= W ? Oe[$e] : oe[$e];
            Te += `
`;
          }
          return x % 2 && B > 0 ? Te.substring(0, Te.length - x - 1) + Array(x + 1).join("▀") : Te.substring(0, Te.length - 1);
        };
        return _.createASCII = function(B, R) {
          if (B = B || 1, B < 2)
            return Uo(R);
          B -= 1, R = typeof R > "u" ? B * 2 : R;
          var x = _.getModuleCount() * B + R * 2, D = R, W = x - R, X, ae, se, ge, $e = Array(B + 1).join("██"), oe = Array(B + 1).join("  "), Oe = "", Te = "";
          for (X = 0; X < x; X += 1) {
            for (se = Math.floor((X - D) / B), Te = "", ae = 0; ae < x; ae += 1)
              ge = 1, D <= ae && ae < W && D <= X && X < W && _.isDark(se, Math.floor((ae - D) / B)) && (ge = 0), Te += ge ? $e : oe;
            for (se = 0; se < B; se += 1)
              Oe += Te + `
`;
          }
          return Oe.substring(0, Oe.length - 1);
        }, _.renderTo2dContext = function(B, R) {
          R = R || 2;
          for (var x = _.getModuleCount(), D = 0; D < x; D++)
            for (var W = 0; W < x; W++)
              B.fillStyle = _.isDark(D, W) ? "black" : "white", B.fillRect(D * R, W * R, R, R);
        }, _;
      };
      s.stringToBytesFuncs = {
        default: function(m) {
          for (var I = [], O = 0; O < m.length; O += 1) {
            var q = m.charCodeAt(O);
            I.push(q & 255);
          }
          return I;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(m, I) {
        var O = (function() {
          for (var $ = F(m), S = function() {
            var le = $.read();
            if (le == -1) throw "eof";
            return le;
          }, v = 0, h = {}; ; ) {
            var A = $.read();
            if (A == -1) break;
            var T = S(), _ = S(), J = S(), z = String.fromCharCode(A << 8 | T), ue = _ << 8 | J;
            h[z] = ue, v += 1;
          }
          if (v != I)
            throw v + " != " + I;
          return h;
        })(), q = 63;
        return function($) {
          for (var S = [], v = 0; v < $.length; v += 1) {
            var h = $.charCodeAt(v);
            if (h < 128)
              S.push(h);
            else {
              var A = O[$.charAt(v)];
              typeof A == "number" ? (A & 255) == A ? S.push(A) : (S.push(A >>> 8), S.push(A & 255)) : S.push(q);
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
        ], I = 1335, O = 7973, q = 21522, $ = {}, S = function(v) {
          for (var h = 0; v != 0; )
            h += 1, v >>>= 1;
          return h;
        };
        return $.getBCHTypeInfo = function(v) {
          for (var h = v << 10; S(h) - S(I) >= 0; )
            h ^= I << S(h) - S(I);
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
              throw "bad maskPattern:" + v;
          }
        }, $.getErrorCorrectPolynomial = function(v) {
          for (var h = u([1], 0), A = 0; A < v; A += 1)
            h = h.multiply(u([1, c.gexp(A)], 0));
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
          for (var h = v.getModuleCount(), A = 0, T = 0; T < h; T += 1)
            for (var _ = 0; _ < h; _ += 1) {
              for (var J = 0, z = v.isDark(T, _), ue = -1; ue <= 1; ue += 1)
                if (!(T + ue < 0 || h <= T + ue))
                  for (var le = -1; le <= 1; le += 1)
                    _ + le < 0 || h <= _ + le || ue == 0 && le == 0 || z == v.isDark(T + ue, _ + le) && (J += 1);
              J > 5 && (A += 3 + J - 5);
            }
          for (var T = 0; T < h - 1; T += 1)
            for (var _ = 0; _ < h - 1; _ += 1) {
              var me = 0;
              v.isDark(T, _) && (me += 1), v.isDark(T + 1, _) && (me += 1), v.isDark(T, _ + 1) && (me += 1), v.isDark(T + 1, _ + 1) && (me += 1), (me == 0 || me == 4) && (A += 3);
            }
          for (var T = 0; T < h; T += 1)
            for (var _ = 0; _ < h - 6; _ += 1)
              v.isDark(T, _) && !v.isDark(T, _ + 1) && v.isDark(T, _ + 2) && v.isDark(T, _ + 3) && v.isDark(T, _ + 4) && !v.isDark(T, _ + 5) && v.isDark(T, _ + 6) && (A += 40);
          for (var _ = 0; _ < h; _ += 1)
            for (var T = 0; T < h - 6; T += 1)
              v.isDark(T, _) && !v.isDark(T + 1, _) && v.isDark(T + 2, _) && v.isDark(T + 3, _) && v.isDark(T + 4, _) && !v.isDark(T + 5, _) && v.isDark(T + 6, _) && (A += 40);
          for (var Se = 0, _ = 0; _ < h; _ += 1)
            for (var T = 0; T < h; T += 1)
              v.isDark(T, _) && (Se += 1);
          var qe = Math.abs(100 * Se / h / h - 50) / 5;
          return A += qe * 10, A;
        }, $;
      })(), c = (function() {
        for (var m = new Array(256), I = new Array(256), O = 0; O < 8; O += 1)
          m[O] = 1 << O;
        for (var O = 8; O < 256; O += 1)
          m[O] = m[O - 4] ^ m[O - 5] ^ m[O - 6] ^ m[O - 8];
        for (var O = 0; O < 255; O += 1)
          I[m[O]] = O;
        var q = {};
        return q.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return I[$];
        }, q.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return m[$];
        }, q;
      })();
      function u(m, I) {
        if (typeof m.length > "u")
          throw m.length + "/" + I;
        var O = (function() {
          for (var $ = 0; $ < m.length && m[$] == 0; )
            $ += 1;
          for (var S = new Array(m.length - $ + I), v = 0; v < m.length - $; v += 1)
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
        ], I = function($, S) {
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
          for (var h = v.length / 3, A = [], T = 0; T < h; T += 1)
            for (var _ = v[T * 3 + 0], J = v[T * 3 + 1], z = v[T * 3 + 2], ue = 0; ue < _; ue += 1)
              A.push(I(J, z));
          return A;
        }, O;
      })(), g = function() {
        var m = [], I = 0, O = {};
        return O.getBuffer = function() {
          return m;
        }, O.getAt = function(q) {
          var $ = Math.floor(q / 8);
          return (m[$] >>> 7 - q % 8 & 1) == 1;
        }, O.put = function(q, $) {
          for (var S = 0; S < $; S += 1)
            O.putBit((q >>> $ - S - 1 & 1) == 1);
        }, O.getLengthInBits = function() {
          return I;
        }, O.putBit = function(q) {
          var $ = Math.floor(I / 8);
          m.length <= $ && m.push(0), q && (m[$] |= 128 >>> I % 8), I += 1;
        }, O;
      }, w = function(m) {
        var I = a.MODE_NUMBER, O = m, q = {};
        q.getMode = function() {
          return I;
        }, q.getLength = function(v) {
          return O.length;
        }, q.write = function(v) {
          for (var h = O, A = 0; A + 2 < h.length; )
            v.put($(h.substring(A, A + 3)), 10), A += 3;
          A < h.length && (h.length - A == 1 ? v.put($(h.substring(A, A + 1)), 4) : h.length - A == 2 && v.put($(h.substring(A, A + 2)), 7));
        };
        var $ = function(v) {
          for (var h = 0, A = 0; A < v.length; A += 1)
            h = h * 10 + S(v.charAt(A));
          return h;
        }, S = function(v) {
          if ("0" <= v && v <= "9")
            return v.charCodeAt(0) - 48;
          throw "illegal char :" + v;
        };
        return q;
      }, M = function(m) {
        var I = a.MODE_ALPHA_NUM, O = m, q = {};
        q.getMode = function() {
          return I;
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
      }, L = function(m) {
        var I = a.MODE_8BIT_BYTE, O = s.stringToBytes(m), q = {};
        return q.getMode = function() {
          return I;
        }, q.getLength = function($) {
          return O.length;
        }, q.write = function($) {
          for (var S = 0; S < O.length; S += 1)
            $.put(O[S], 8);
        }, q;
      }, P = function(m) {
        var I = a.MODE_KANJI, O = s.stringToBytesFuncs.SJIS;
        if (!O)
          throw "sjis not supported.";
        (function(S, v) {
          var h = O(S);
          if (h.length != 2 || (h[0] << 8 | h[1]) != v)
            throw "sjis not supported.";
        })("友", 38726);
        var q = O(m), $ = {};
        return $.getMode = function() {
          return I;
        }, $.getLength = function(S) {
          return ~~(q.length / 2);
        }, $.write = function(S) {
          for (var v = q, h = 0; h + 1 < v.length; ) {
            var A = (255 & v[h]) << 8 | 255 & v[h + 1];
            if (33088 <= A && A <= 40956)
              A -= 33088;
            else if (57408 <= A && A <= 60351)
              A -= 49472;
            else
              throw "illegal char at " + (h + 1) + "/" + A;
            A = (A >>> 8 & 255) * 192 + (A & 255), S.put(A, 13), h += 2;
          }
          if (h < v.length)
            throw "illegal char at " + (h + 1);
        }, $;
      }, k = function() {
        var m = [], I = {};
        return I.writeByte = function(O) {
          m.push(O & 255);
        }, I.writeShort = function(O) {
          I.writeByte(O), I.writeByte(O >>> 8);
        }, I.writeBytes = function(O, q, $) {
          q = q || 0, $ = $ || O.length;
          for (var S = 0; S < $; S += 1)
            I.writeByte(O[S + q]);
        }, I.writeString = function(O) {
          for (var q = 0; q < O.length; q += 1)
            I.writeByte(O.charCodeAt(q));
        }, I.toByteArray = function() {
          return m;
        }, I.toString = function() {
          var O = "";
          O += "[";
          for (var q = 0; q < m.length; q += 1)
            q > 0 && (O += ","), O += m[q];
          return O += "]", O;
        }, I;
      }, E = function() {
        var m = 0, I = 0, O = 0, q = "", $ = {}, S = function(h) {
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
          for (m = m << 8 | h & 255, I += 8, O += 1; I >= 6; )
            S(m >>> I - 6), I -= 6;
        }, $.flush = function() {
          if (I > 0 && (S(m << 6 - I), m = 0, I = 0), O % 3 != 0)
            for (var h = 3 - O % 3, A = 0; A < h; A += 1)
              q += "=";
        }, $.toString = function() {
          return q;
        }, $;
      }, F = function(m) {
        var I = m, O = 0, q = 0, $ = 0, S = {};
        S.read = function() {
          for (; $ < 8; ) {
            if (O >= I.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var h = I.charAt(O);
            if (O += 1, h == "=")
              return $ = 0, -1;
            if (h.match(/^\s$/))
              continue;
            q = q << 6 | v(h.charCodeAt(0)), $ += 6;
          }
          var A = q >>> $ - 8 & 255;
          return $ -= 8, A;
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
      }, U = function(m, I) {
        var O = m, q = I, $ = new Array(m * I), S = {};
        S.setPixel = function(T, _, J) {
          $[_ * O + T] = J;
        }, S.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(O), T.writeShort(q), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(O), T.writeShort(q), T.writeByte(0);
          var _ = 2, J = h(_);
          T.writeByte(_);
          for (var z = 0; J.length - z > 255; )
            T.writeByte(255), T.writeBytes(J, z, 255), z += 255;
          T.writeByte(J.length - z), T.writeBytes(J, z, J.length - z), T.writeByte(0), T.writeString(";");
        };
        var v = function(T) {
          var _ = T, J = 0, z = 0, ue = {};
          return ue.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; J + me >= 8; )
              _.writeByte(255 & (le << J | z)), me -= 8 - J, le >>>= 8 - J, z = 0, J = 0;
            z = le << J | z, J = J + me;
          }, ue.flush = function() {
            J > 0 && _.writeByte(z);
          }, ue;
        }, h = function(T) {
          for (var _ = 1 << T, J = (1 << T) + 1, z = T + 1, ue = A(), le = 0; le < _; le += 1)
            ue.add(String.fromCharCode(le));
          ue.add(String.fromCharCode(_)), ue.add(String.fromCharCode(J));
          var me = k(), Se = v(me);
          Se.write(_, z);
          var qe = 0, We = String.fromCharCode($[qe]);
          for (qe += 1; qe < $.length; ) {
            var ut = String.fromCharCode($[qe]);
            qe += 1, ue.contains(We + ut) ? We = We + ut : (Se.write(ue.indexOf(We), z), ue.size() < 4095 && (ue.size() == 1 << z && (z += 1), ue.add(We + ut)), We = ut);
          }
          return Se.write(ue.indexOf(We), z), Se.write(J, z), Se.flush(), me.toByteArray();
        }, A = function() {
          var T = {}, _ = 0, J = {};
          return J.add = function(z) {
            if (J.contains(z))
              throw "dup key:" + z;
            T[z] = _, _ += 1;
          }, J.size = function() {
            return _;
          }, J.indexOf = function(z) {
            return T[z];
          }, J.contains = function(z) {
            return typeof T[z] < "u";
          }, J;
        };
        return S;
      }, y = function(m, I, O) {
        for (var q = U(m, I), $ = 0; $ < I; $ += 1)
          for (var S = 0; S < m; S += 1)
            q.setPixel(S, $, O(S, $));
        var v = k();
        q.write(v);
        for (var h = E(), A = v.toByteArray(), T = 0; T < A.length; T += 1)
          h.writeByte(A[T]);
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
var _v = Mv();
const Sv = /* @__PURE__ */ xv(_v), Ev = ["width", "height", "viewBox"], Av = ["width", "height"], Cv = ["d"], Ov = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = C(() => {
      const s = Sv(0, "M");
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
      }, null, 8, Av),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Cv)
    ], 8, Ev));
  }
}, Fy = /* @__PURE__ */ Z(Ov, [["__scopeId", "data-v-489f0852"]]), Hy = nr(() => import("./VoiceFigure-BdR2l2A1.js").then((e) => e.V)), Uy = "1.0.0", zy = "3.5";
export {
  Dv as $,
  oy as A,
  Je as B,
  my as C,
  sy as D,
  py as E,
  Jv as F,
  jo as G,
  Dm as H,
  Rm as I,
  by as J,
  kt as K,
  dy as L,
  Be as M,
  St as N,
  iy as O,
  bn as P,
  ly as Q,
  yp as R,
  Ao as S,
  ay as T,
  fy as U,
  fa as V,
  km as W,
  fm as X,
  $y as Y,
  gy as Z,
  Z as _,
  ie as a,
  Ay as a$,
  Ty as a0,
  ye as a1,
  ys as a2,
  Nv as a3,
  Ju as a4,
  qy as a5,
  Kv as a6,
  tn as a7,
  My as a8,
  Bv as a9,
  Wy as aA,
  Wo as aB,
  st as aC,
  Ih as aD,
  Hy as aE,
  Ne as aF,
  tl as aG,
  Yn as aH,
  Ny as aI,
  Dy as aJ,
  jy as aK,
  Gv as aL,
  zv as aM,
  Hv as aN,
  Sy as aO,
  _y as aP,
  f1 as aQ,
  Lv as aR,
  it as aS,
  Pv as aT,
  Fv as aU,
  Oy as aV,
  Ey as aW,
  Ry as aX,
  Jg as aY,
  bg as aZ,
  yo as a_,
  Tt as aa,
  xe as ab,
  By as ac,
  Uy as ad,
  zy as ae,
  Iy as af,
  rs as ag,
  Uv as ah,
  k1 as ai,
  Hg as aj,
  Gg as ak,
  Xg as al,
  jv as am,
  xr as an,
  Py as ao,
  qv as ap,
  Fy as aq,
  Cy as ar,
  Gr as as,
  Iv as at,
  Vv as au,
  as as av,
  wt as aw,
  Wv as ax,
  Rv as ay,
  gs as az,
  Ze as b,
  Rh as b0,
  vs as b1,
  Ly as b2,
  ry as c,
  Xv as d,
  Qv as e,
  Zv as f,
  yy as g,
  $o as h,
  cy as i,
  uy as j,
  hy as k,
  wy as l,
  ey as m,
  Yv as n,
  ty as o,
  un as p,
  xy as q,
  vy as r,
  ny as s,
  je as t,
  hm as u,
  ky as v,
  mm as w,
  Ss as x,
  Np as y,
  jp as z
};
