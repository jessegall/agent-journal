/* @code-commandments-generated */
import { openBlock as l, createElementBlock as u, renderSlot as me, createElementVNode as p, normalizeClass as J, Fragment as Y, renderList as oe, normalizeStyle as _e, defineComponent as or, Comment as rr, h as ws, cloneVNode as ir, createBlock as V, withCtx as z, unref as U, createVNode as F, toDisplayString as v, createCommentVNode as $, inject as Ee, computed as M, resolveDynamicComponent as ct, Transition as wt, watch as $e, ref as R, shallowRef as yn, createTextVNode as ue, TransitionGroup as Ea, mergeProps as et, reactive as ks, onMounted as je, onUnmounted as Ae, nextTick as Nt, useId as Ca, Teleport as bs, withModifiers as xe, isRef as js, onBeforeUnmount as kt, resolveDirective as lr, withDirectives as tt, useAttrs as $s, useModel as Zn, getCurrentInstance as cr, mergeModels as Xn, getCurrentScope as Aa, onScopeDispose as Oa, provide as ur, onErrorCaptured as dr, toHandlers as hr, createSlots as fr, vShow as pr, useSlots as mr, withKeys as Bt, vModelText as Qn, defineAsyncComponent as gr } from "vue";
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, vr = { class: "skeleton-line" }, yr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), u("span", vr, [
      me(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (l(!0), u(Y, null, oe(e.bars, (s) => (l(), u("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: _e({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, st = /* @__PURE__ */ K(yr, [["__scopeId", "data-v-0ebb6933"]]), xs = or({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== rr);
      return s.length !== 1 ? ws(Y, { key: n }, s) : s[0].key == null ? ir(s[0], { key: n }) : s[0];
    };
  }
}), wr = ["aria-label"], kr = ["aria-label"], br = ["aria-label"], $r = ["aria-label"], xr = ["aria-label"], _r = ["aria-label"], Mr = ["aria-label"], Sr = {
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
    return (c, d) => (l(), V(xs, { value: e.shape }, {
      messages: z(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), u(Y, null, oe(t, (h) => p("div", {
            key: h.id,
            class: J(["skeleton-message", { mine: h.mine }]),
            style: _e({ width: `${h.width}%`, height: `${h.height}px` })
          }, null, 6)), 64))
        ], 8, wr)
      ]),
      older: z(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), u(Y, null, oe(t.slice(0, 3), (h) => (l(), u("div", {
            key: h.id,
            class: J(["skeleton-message", { mine: h.mine }]),
            style: _e({ width: `${h.width}%`, height: `${h.height}px` })
          }, null, 6))), 128))
        ], 8, kr)
      ]),
      cards: z(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), u(Y, null, oe(e.count, (h) => (l(), u("div", {
            key: h,
            class: "skeleton-card"
          }, [
            (l(), u(Y, null, oe(n, (m) => F(st, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, br)
      ]),
      file: z(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), u(Y, null, oe(e.count, (h) => (l(), u("div", {
            key: h,
            class: "skeleton-file"
          }, [
            F(st, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), u(Y, null, oe(a, (m) => F(st, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, $r)
      ]),
      page: z(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          F(st, {
            class: "skeleton-heading",
            bars: r
          }),
          (l(!0), u(Y, null, oe(e.count, (h) => (l(), V(st, {
            key: h,
            bars: U(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, xr)
      ]),
      text: z(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), u(Y, null, oe(e.count, (h) => (l(), V(st, {
            key: h,
            bars: U(i)
          }, null, 8, ["bars"]))), 128))
        ], 8, _r)
      ]),
      default: z(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), u(Y, null, oe(e.count, (h) => (l(), V(st, {
            key: h,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Mr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, bt = /* @__PURE__ */ K(Sr, [["__scopeId", "data-v-c687fb85"]]), Er = {
  key: 1,
  class: "empty-state titled"
}, Cr = { class: "empty-state-title" }, Ar = { class: "empty-state-text" }, Or = {
  key: 2,
  class: "empty-state"
}, Tr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), V(bt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (l(), u("div", Er, [
      p("p", Cr, v(e.title), 1),
      p("p", Ar, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), u("p", Or, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, an = /* @__PURE__ */ K(Tr, [["__scopeId", "data-v-b27e89b0"]]), Br = { class: "fold-group" }, Ir = ["aria-expanded"], Rr = { class: "fold-label" }, Lr = {
  key: 0,
  class: "fold-count"
}, Dr = {
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
    return (s, a) => (l(), u("div", Br, [
      p("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", Rr, v(e.label), 1),
        e.count !== "" ? (l(), u("span", Lr, v(e.count), 1)) : $("", !0),
        p("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Ir),
      e.open ? me(s.$slots, "default", {}, void 0, !0, 0) : $("", !0)
    ]));
  }
}, zy = /* @__PURE__ */ K(Dr, [["__scopeId", "data-v-9ef1865c"]]), Nr = Symbol("open-view"), Oe = Symbol.for("journal.window-context");
function wn() {
  const e = Ee(Oe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const jr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), u("span", {
      class: "spinner",
      style: _e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Pr = /* @__PURE__ */ K(jr, [["__scopeId", "data-v-eb453d6f"]]), qr = {
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
    const t = e, n = M(() => {
      var s;
      return t.busy || t.disabled || !!((s = Ee(Oe, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), V(ct(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: J(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: z(() => [
        p("span", {
          class: J(["btn-label", { hidden: e.busy }])
        }, [
          me(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (l(), V(Pr, {
          key: 0,
          class: "btn-spinner"
        })) : $("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ke = /* @__PURE__ */ K(qr, [["__scopeId", "data-v-a2dc4bda"]]), Wr = {
  class: "running",
  "data-running-command": ""
}, Fr = ["title"], Hr = {
  key: "idle",
  class: "running-idle"
}, Ur = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), u("span", Wr, [
      F(wt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: z(() => [
          e.text ? (l(), u("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Fr)) : (l(), u("span", Hr, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Vy = /* @__PURE__ */ K(Ur, [["__scopeId", "data-v-d3240219"]]), zr = ["aria-checked", "aria-label", "title"], Vr = {
  key: 0,
  class: "switch-inner"
}, Gr = {
  key: 0,
  class: "switch-word"
}, Kr = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), u("button", {
      type: "button",
      class: J(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: J(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (l(), u("span", Vr, v(e.word), 1)) : $("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), u("span", Gr, v(e.word), 1)) : $("", !0)
    ], 10, zr));
  }
}, Gy = /* @__PURE__ */ K(Kr, [["__scopeId", "data-v-1bfb90f3"]]);
function Ta(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function It(e, t) {
  return Ta(() => localStorage, e, t);
}
function Ba(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function kn(e, t) {
  return Ba(() => localStorage, e, t);
}
function Ia(e, t) {
  $e(t, (n) => kn(e, n), { deep: !0 });
}
function Yr(e, t) {
  return Ta(() => sessionStorage, e, t);
}
function Jr(e, t) {
  return Ba(() => sessionStorage, e, t);
}
const on = "journal.environment", Ra = R(Yr(on, It(on, "")));
function Zr(e) {
  Ra.value = e, Jr(on, e), kn(on, e);
}
const rn = R(location.hash), Ps = yn(null), qs = { integrations: "mcp", library: "team" };
function Xr() {
  if (!Ps.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (qs[n]) {
    location.replace(`#/${[qs[n], ...s].join("/")}${t ? `?${t}` : ""}`), rn.value = location.hash;
    return;
  }
  !n || Ps.value(n) || (Zr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), rn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  rn.value = location.hash, Xr();
});
const qe = M(() => {
  const [e, t = ""] = rn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((i) => {
    const [r, c = ""] = i.split("@"), [d = "", h = "", m = ""] = r.split(":");
    return { table: d, id: Number(h), comment: Number(m) || 0, env: c };
  });
  return {
    env: Ra.value,
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
}), bn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${bn.page(e)}?open=${t}`
};
function Qr(e = "", t = 0, n = "") {
  location.hash = bn.page(e, t, n);
}
const ei = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function La(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([i]) => i !== "open" && i !== "sub").map(([i, r]) => `${i}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(ei).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function Ky(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Da(e, t, n = 0, s = "") {
  var i;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((i = gt[e]) != null && i.call(gt, t))) return;
  const a = qe.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  La([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function ti(e, t, n, s = 0, a = "") {
  if (e === qe.value.env) return Da(t, n, s, a);
  const o = qe.value.stack, i = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  La([...i < 0 ? o : o.slice(0, i), { table: t, id: n, comment: s, env: e }], a);
}
function Ue(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? ti(s, a, Number(o), 0, t) : Da(a, Number(o), 0, t);
}
function ni(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function mt(e) {
  const t = ni(e);
  t && Ue(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const $n = typeof document < "u" && document.documentElement.classList.contains("phone"), si = "Files are attached on the computer; the phone sends text.", An = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], ge = (e, t, n, s = {}) => ({
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
}), jt = {
  messages: ge("Message", "mail", "What the user left for the agent, or the agent for the user", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: ge("Question", "help", "Something the agent asks the user, with choices to pick", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: ge("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: An
  }),
  tasks: ge("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: An
  }),
  reports: ge("Report", "report", "What was checked and what was found, written for the user", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: ge("Collection", "folder", "Rows that belong together, gathered under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: ge("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: ge("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: ge("Rule", "list", "A ruling that binds every environment of the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: ge("Reminder", "clock", "An instruction said again until it is retired", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: ge("Pin", "band", "One line pinned to the chat while it matters", { filters: An }),
  reactions: ge("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: ge("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", { scope: "project" }),
  environments: ge("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", { scope: "project" }),
  agents: ge("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: ge("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: ge("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
  verifiers: ge("Verifier", "verifier", "An agent the journal sends by itself to judge whether a dismissed reader report was dismissed rightly"),
  test_turns: ge("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: ge("Reviewer", "reviewer", "An agent the journal sends by itself, in orchestrator mode with the reviewer on, to test and check each worker's work and report each point to the agent"),
  subagents: ge("Subagent", "bot", "A helper the agent started inside its own session for one job", { nested: !0 }),
  sequences: ge("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: ge("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: ge("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: ge("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: ge("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: ge("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: ge("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, ai = ["secrets", "plugins"], Na = Object.keys(jt).filter((e) => !($n && ai.includes(e)));
M(() => Na.map((e) => ({ name: e, ...jt[e] })));
const Pt = (e) => jt[e], ja = new Map(Na.flatMap((e) => [e, e.replace(/s$/, ""), jt[e].title.toLowerCase()].map((t) => [t, e]))), lt = (e) => ja.get(String(e).toLowerCase()) || "", Pa = [...ja.keys()].sort((e, t) => t.length - e.length).join("|"), oi = ["stroke-width", "innerHTML"], ye = {
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
    return (o, i) => (l(), u("svg", {
      class: "ico",
      style: _e({
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
    }, null, 12, oi));
  }
}, xn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), V(ke, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: z(() => [
        F(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, ri = {
  key: 1,
  class: "row-list-failure"
}, ii = ["data-row"], li = {
  __name: "RowList",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    // what is empty, in the window's own terms, and under it the sentence that says what brings rows there
    empty: { type: String, required: !0 },
    hint: { type: String, default: "" },
    // whether a search or a filter is on: with it, and no row left, the list says nothing matches (`matches` names it in the window's words) and what to try, not that it is empty
    searching: Boolean,
    matches: { type: String, default: "Nothing matches" },
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
    const t = e, n = M(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = R(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, i) => !e.loaded && !e.failure ? (l(), V(bt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (l(), u("p", ri, v(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), V(an, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: z(() => [
        ue(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (l(), u(Y, { key: 3 }, [
      (l(), V(ct(e.arrival ? Ea : "ul"), et(n.value, { class: "row-list" }), {
        default: z(() => [
          (l(!0), u(Y, null, oe(e.rows, (r) => (l(), u("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            me(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, ii))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (l(), u("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: i[0] || (i[0] = (r) => a(e.older))
      }, "Show more")) : $("", !0)
    ], 64));
  }
}, ci = /* @__PURE__ */ K(li, [["__scopeId", "data-v-aa6ad7ff"]]), ui = {
  class: "agent-rows",
  "data-agent-rows": ""
}, di = {
  key: 1,
  class: "agent-rows-note"
}, hi = {
  key: 2,
  class: "agent-rows-note"
}, fi = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, pi = ["data-agent-row", "onClick"], mi = { class: "agent-row-name" }, gi = { class: "agent-row-state" }, vi = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = M(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), u("div", ui, [
      e.loaded ? e.failure ? (l(), u("p", di, v(e.failure), 1)) : e.rows.length ? (l(), u(Y, { key: 3 }, [
        p("p", fi, v(s.value) + " running", 1),
        (l(!0), u(Y, null, oe(n.value, (i) => (l(), u("button", {
          key: i.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": i.id,
          onClick: (r) => U(Ue)(`agents:${i.id}`)
        }, [
          p("span", mi, "#" + v(i.id) + " " + v(i.session), 1),
          p("span", gi, v(i.ended_at ? "Closed" : "Running"), 1)
        ], 8, pi))), 128))
      ], 64)) : (l(), u("p", hi, v(e.none), 1)) : (l(), V(bt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Yy = /* @__PURE__ */ K(vi, [["__scopeId", "data-v-a01e5a17"]]), yi = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), u("span", {
      class: J(["badge", e.tone])
    }, v(e.text), 3));
  }
}, qa = /* @__PURE__ */ K(yi, [["__scopeId", "data-v-9e7e1157"]]), wi = ["aria-valuenow", "aria-valuemax"], ki = {
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
    const t = e, n = M(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (l(), u("span", {
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: _e({ width: n.value })
      }, null, 4)
    ], 10, wi));
  }
}, bi = /* @__PURE__ */ K(ki, [["__scopeId", "data-v-9eba6a85"]]), $i = { class: "bars" }, xi = { class: "bar-name" }, _i = { class: "bar-value" }, Mi = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = M(() => Math.max(1, ...n.items.map((i) => Number(i.value) || 0))), o = M(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (i, r) => (l(), u("div", $i, [
      (l(!0), u(Y, null, oe(e.items, (c, d) => (l(), V(ct(c.open ? "button" : "div"), {
        key: `${d}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: J(["bar-row", c.tone, { opens: c.open }]),
        onClick: (h) => c.open && s("open", c.open)
      }, {
        default: z(() => [
          p("span", xi, v(c.label), 1),
          F(bi, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", _i, v(c.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Si = /* @__PURE__ */ K(Mi, [["__scopeId", "data-v-663427f4"]]), Ei = { class: "bars" }, Ci = {
  key: 0,
  class: "bars-title"
}, Ai = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), u("div", Ei, [
      e.node.title ? (l(), u("span", Ci, v(e.node.title), 1)) : $("", !0),
      F(Si, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Oi = /* @__PURE__ */ K(Ai, [["__scopeId", "data-v-7135bb11"]]), Ti = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (i) => ({ gap: `${i.gap || 14}px` }),
      row: (i) => ({ gap: `${i.gap || 12}px` }),
      grid: (i) => ({ gap: `${i.gap || 12}px`, gridTemplateColumns: `repeat(${i.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = M(() => n[s.node.type](s.node));
    return (i, r) => (l(), u("div", {
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: _e(o.value)
    }, [
      (l(!0), u(Y, null, oe(e.node.children || [], (c, d) => (l(), V(po, {
        key: d,
        node: c,
        onOpen: r[0] || (r[0] = (h) => a("open", h)),
        onFile: r[1] || (r[1] = (h) => a("file", h))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, en = /* @__PURE__ */ K(Ti, [["__scopeId", "data-v-d142a3f4"]]), Bi = {
  key: 0,
  class: "card-head"
}, Ii = { class: "card-title" }, Ri = {
  key: 0,
  class: "card-note"
}, Li = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), u("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (l(), u("header", Bi, [
        p("span", Ii, v(e.node.title), 1),
        e.node.note ? (l(), u("span", Ri, v(e.node.note), 1)) : $("", !0)
      ])) : $("", !0),
      F(en, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Di = /* @__PURE__ */ K(Li, [["__scopeId", "data-v-67b72d40"]]), Ni = (e, t, n) => Math.max(t, Math.min(n, e)), ji = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Se = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ws = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", On = 80;
function Fs(e) {
  return e.length <= On ? e : `${e.slice(0, On + 1).replace(/\s+\S*$/, "") || e.slice(0, On)}…`;
}
const Hs = {
  messages: (e) => Fs(Ws(e.text)),
  comments: (e) => Fs(Ws(e.text)),
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
}, Pi = (e) => (Hs[e.table] ? Hs[e.table](e) : e.title || "") || "", qi = ["done", "cancelled"], es = {
  tasks: (e) => Se(e.completed_at) || (e.state === "cancelled" ? Se(e.updated_at) : 0),
  questions: (e) => e.answer ? Se(e.updated_at) : 0,
  plans: (e) => qi.includes(e.state) ? Se(e.updated_at) : 0,
  pins: (e) => Se(e.closed_at),
  secrets: (e) => Se(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Se(e.updated_at) : 0,
  shares: (e) => Se(e.stopped_at),
  dumps: (e) => Se(e.completed_at),
  agents: (e) => e.state === "ended" ? Se(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Se(e.created_at) : 0
}, Wi = (e) => es[e.table] ? es[e.table](e) : 0, Wa = (e) => Wi(e) > 0, Fi = (e) => !!es[e], Fa = (e) => Se(e.created_at), ln = (e) => Se(e.updated_at) || Fa(e), Hi = (e) => "task_ids" in e, Ha = 1024, Ui = Ha * 1024 * 1024, zi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ha} MB limit for one file.`;
function Vi() {
  return () => {
  };
}
function Us(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Gi(e = window) {
  if (!Us(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Us(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ua = "status.summary", be = ks({
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
}), Ki = () => !!(be.version || be.external) && !be.failure && !be.late, za = () => !!be.countdown || Ki() || be.starting;
function Yi(e, t = "") {
  be.starting = e === !1, be.bootStep = be.starting ? t : "";
}
function Ji(e) {
  e && e.version && (be.target = e.version), be.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Zi() {
  Object.assign(be, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Xi(e, t = "") {
  return e && t && (be.step = t), be.version || (e && !be.external && Object.assign(be, { external: !0, since: Date.now() / 1e3 }), e || !be.external) ? !1 : (Zi(), !0);
}
let zt = { version: "", started: 0 };
function Qi(e) {
  return e.version ? (zt.version || (zt = { version: e.version, started: e.started || 0 }), e.version !== zt.version || (e.started || 0) !== zt.started) : !1;
}
function el(e) {
  Ji(e.countdown), Yi(e.ready, e.step), (Xi(!!e.updating, e.step) || !e.updating && !tl(e) && Qi(e)) && Gi(window);
}
const tl = (e) => !!be.version && !be.failure && !be.late && e.version !== be.version, zs = 2e4, nl = 3e5, Fe = 6e5, Vt = 6, sl = 500, al = "/journal/summary", Vs = $n ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, ol = (e) => e.split("?")[0].endsWith(al), Va = (e, t) => Object.assign(new Error(t), { status: e });
async function rl(e, t, n = Va) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const il = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class ll {
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
  async reach(t, n, s, a, o, i = {}) {
    const r = s instanceof FormData;
    try {
      return await fetch(n, {
        method: t,
        headers: { ...Vs, ...i, ...s === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: il(s),
        signal: AbortSignal.timeout(a || (r ? nl : zs))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((d) => setTimeout(d, sl)), this.reach(t, n, s, a, o - 1, i);
    }
  }
  async send(t, n, s, a = 0, o = Vt, i = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : Vi(), c = await this.reach(t, n, s, a, o, i).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return rl(c, `${c.status} ${c.statusText}`).catch((d) => {
      throw d.blocked && t !== "GET" && this.refused(d.message), d;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Vs, signal: AbortSignal.timeout(zs) });
    if (!n.ok) throw Va(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, i = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Vt, o).then((c) => (this.written(n), c));
    if (za() && !ol(n))
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
const Pe = new ll(), Ce = (e) => encodeURIComponent(e);
function pe(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const _t = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: i = !1 }) => [i ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Mt = "the page does not know its environment yet", cl = "X-Journal-Env", ul = "X-Journal-Request-At", Tn = "/viewer/voices/figures/";
class _s {
  constructor({ env: t = () => qe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new _s({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [ul]: String(Date.now()), ...this.env() ? { [cl]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === Mt ? Promise.reject(new Error(Mt)) : Pe.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === Mt ? Promise.reject(new Error(Mt)) : Pe.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : Mt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${Ce(this.env())}`);
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
    return this.get(`/updates/changelog${pe({ skip: t })}`);
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
    return this.get(this.here(`/entries${pe({ since: t, last: n })}`));
  }
  stream(t = 0) {
    const n = t ? `?since=${t}` : "";
    return Pe.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: i = [], tasks: r = [], closed: c = !1, docked: d = !1 } = {}) {
    const h = this.here(`/${t}${pe({ limit: n, before: s, after: a, since: o, ids: i.join(","), tasks: r.join(","), closed: c ? "1" : "", docked: d ? "1" : "" })}`);
    return this.get(h, `${t}.${_t({ before: s, after: a, since: o, ids: i, tasks: r, closed: c, docked: d })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const i = this.here(`/chats/${encodeURIComponent(t)}${pe({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(i, `chats/${t}.${_t({ before: s, since: a, docked: o })}`);
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
    if ($n) return Promise.reject(Object.assign(new Error(si), { status: 403 }));
    if (s.size > Ui) return Promise.reject(new Error(zi(s)));
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${Ce(s)}`);
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
    return Pe.bytes(t);
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
    return this.get(this.here(`/messages${pe({ on: t })}`), "messages.on");
  }
  // every row and conversation line here that holds all the words
  search(t, { models: n = [], conversations: s = !1 } = {}) {
    const a = { words: t, models: n.join(","), conversations: s ? 1 : "" };
    return this.get(this.here(`/search${pe(a)}`));
  }
  // the documents a search finds, best first, and the files attached to messages, a page at a time
  locateDocs(t) {
    return this.get(this.here(`/docs/search${pe({ words: t })}`));
  }
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: o }) {
    return this.get(this.here(`/attachments${pe({ file_type: t, shelf: n, search: s, last: a, skip: o })}`));
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
    return this.get(`/agents/controls/${Ce(t)}${pe({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${Ce(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${Ce(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${pe(s)}`), `${a}.${_t(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${pe(n)}`), `/verifiers/${t}/transcript.${_t(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${pe(n)}`), `/workers/${t}/transcript.${_t(n)}`);
  }
  edits(t, n, s = {}) {
    return this.get(this.here(`/agents/${t}/edits${pe({ since: n, ...s })}`));
  }
  editedText(t, n) {
    return this.get(this.here(`/agents/${t}/edits/text${pe({ edit: n })}`));
  }
  editedImageUrl(t, n) {
    return this.address(`/agents/${t}/edits/image${pe({ edit: n })}`);
  }
  terminal(t, n = 0) {
    return this.get(this.here(`/agents/${t}/terminal${pe({ after: n })}`));
  }
  // who the viewer is and who else is on the journal, so it says you only for its own person
  people() {
    return this.get("/people");
  }
  // whether this journal is connected to a team, and as whom; the one team, or the team named
  team(t = "") {
    return this.get(`/team${pe({ team: t })}`);
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
    return this.get(`/team/devices${pe({ team: t })}`);
  }
  revokeTeamDevice(t, n = "") {
    return this.post("/team/revoke", { device: t, team: n });
  }
  teamPeople(t = "") {
    return this.get(`/team/people${pe({ team: t })}`);
  }
  // changes this person's own password on the team
  changeTeamPassword(t, n, s = "") {
    return this.post("/team/password", { old: t, new: n, team: s });
  }
  // the library's items, each with its newest version and the version this journal imported, by kind and words
  libraryItems(t, n, s = "") {
    return this.get(`/library/items${pe({ type: t, search: n, team: s })}`);
  }
  // one library item with every version and its note, and the version this journal imported
  libraryItem(t, n, s = "") {
    return this.get(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}${pe({ team: s })}`);
  }
  // every copy here that came from the library, with the version it came from and the row or file it is
  libraryCopies(t = "") {
    return this.get(`/library/copies${pe({ team: t })}`);
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
    const a = this.here(`/outputs/${t}${pe({ after: n, before: s })}`);
    return this.get(a, a);
  }
  activeCards(t) {
    return this.get(this.here(`/cards/active?ids=${t.join(",")}`));
  }
  // skills and voices
  skills(t = 0) {
    return this.get(this.here(`/skills${pe({ agent: t })}`));
  }
  skill(t) {
    return this.get(this.here(`/skills/${Ce(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${Ce(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${Ce(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return Pe.request("GET", Tn + "figures.json");
  }
  voiceFigureUrl(t) {
    return Tn + t;
  }
  figureDecoderUrl() {
    return Tn + "draco/";
  }
  // the project's files
  projectFiles(t = "") {
    return this.get(this.here(`/project-files${pe({ folder: t })}`));
  }
  findFiles(t) {
    return this.get(this.here(`/project-files/find${pe({ q: t })}`));
  }
  projectFile(t) {
    return this.get(this.here(`/project-files/file${pe({ path: t })}`));
  }
  projectFileUrl(t) {
    return this.address(`/project-files/raw${pe({ path: t })}`);
  }
  fileDiff(t) {
    return this.get(this.here(`/project-files/diff${pe({ path: t })}`));
  }
  // the project's repository
  gitBranches(t = 0, n = 30) {
    return this.get(this.here(`/git/branches${pe({ skip: t, last: n })}`));
  }
  gitCommits(t = 0, n = 30) {
    return this.get(this.here(`/git/commits${pe({ skip: t, last: n })}`));
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
    return this.get(this.here(`/plugins/${t}/log${pe({ lines: n })}`));
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
    return this.post(`/profiles/${Ce(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${Ce(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${Ce(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, Fe);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Ce(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Fe);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Ce(t)}` : ""}${bn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const de = new _s({ base: $n ? "/p" : "" }), dl = (e) => Pe.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(de.base.length).split("/")[2]);
}), hl = { claude: "Claude Code", codex: "Codex" };
Object.entries(hl).map(([e, t]) => ({ key: e, label: t }));
const Gs = (e) => e.status === "stopped" ? 1 : 0, fl = "main", pl = (e) => e.filter((t) => t.role === fl).sort((t, n) => Gs(t) - Gs(n) || Se(n.heard_at) - Se(t.heard_at))[0] || null, ml = { me: 1, people: [] }, Z = ks({
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
  people: ml,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: It("journal.activity", !0),
  wide: !1,
  sideMini: It("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ia("journal.activity", () => Z.activity);
Ia("journal.side.mini", () => Z.sideMini);
const vt = M(() => pl(Z.agents));
M(() => !!vt.value && Z.live.some((e) => e.agent.session === vt.value.session && e.environment === qe.value.env));
M(() => !!vt.value && ["busy", "working"].includes(vt.value.status));
function gl(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function ts(e) {
  const t = gl(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Ga(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Ks(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const Bn = (e) => String(e).padStart(2, "0");
function vl(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Bn(t % 60)}s` : `${Math.floor(t / 3600)}h ${Bn(Math.floor(t % 3600 / 60))}m ${Bn(t % 60)}s`;
}
const yl = ["working", "busy", "waiting", "compacting"], wl = (e) => yl.includes(e), kl = "builder";
M(() => !Z.settings || Z.settings.features.file_feed !== !1);
const bl = M(() => !Z.settings || Z.settings.features.status_bar !== !1);
M(() => Z.settings && Z.settings.workers && Z.settings.workers.mode || kl);
M(() => !Z.settings || !Z.settings.tasks || Z.settings.tasks.auto !== !1);
M(() => !!(Z.settings && Z.settings.reviewing && Z.settings.reviewing.reviewer));
M(() => !Z.settings || Z.settings.features.sharing !== !1);
const cn = 50, Ms = 100, $l = { messages: 25 }, Ne = (e) => $l[e] || cn;
function xl(e, t) {
  if (e !== "messages") return Math.max(t.length - Ne(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Ne(e)) return s;
  return 0;
}
const _l = "review_step", Ml = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === _l).sort((t, n) => t.id - n.id), Sl = 5, El = 500, Cl = 3e3, Al = () => Z.entries.length ? Z.entries[Z.entries.length - 1].id : 0, tn = { env: "", id: 0 }, Ol = () => !!(Z.bar && Z.bar.length) || wl(vt.value && vt.value.status);
function Tl({ session: e }) {
  return (e ? de.chat(e, { docked: !0 }) : de.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function Bl() {
  return de.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => de.chat(t.session, { limit: Ms })))).then(Ml);
}
function Il() {
  return tn.env !== de.env() && Object.assign(tn, { env: de.env(), id: Al() }), de.entries(tn.id);
}
function Rl(e) {
  e.length && (tn.id = e[e.length - 1].id, _c(e));
}
async function Ll({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", cn);
}
const ns = /* @__PURE__ */ new Map();
async function ss(e, t) {
  const n = `${e}:${de.env()}`, s = ns.get(n);
  if (!s) return Ys(n, (await de.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(ln)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, i = await de.list("workers", { limit: t, since: a, after: o });
  if (!i.is_last_page)
    return ns.delete(n), ss(e, t);
  const r = new Set(i.rows.map((c) => c.id));
  return Ys(
    n,
    [...s.filter((c) => !r.has(c.id)), ...i.rows].sort((c, d) => c.id - d.id)
  );
}
const Ys = (e, t) => (ns.set(e, t), t);
async function Js(e, t) {
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const Zs = Object.freeze({
  "status.bar": {
    read: () => de.bar(),
    every: () => Ol() ? El : Cl,
    take: (e) => Array.isArray(e) && (Z.bar = e),
    active: () => bl.value
  },
  "agents.index": { read: () => Js(de, Sl), every: 1e3, take: (e) => Z.agents = e.rows },
  "agents.live": { read: () => de.liveAgents(), every: 5e3, take: (e) => Z.live = e },
  "status.summary": {
    read: () => de.summary(),
    every: () => be.countdown || be.external || be.version ? 1e3 : 4e3,
    take: (e) => {
      Z.summary = e, el(e);
    }
  },
  "journal.manifest": { read: () => de.manifest(), every: 3e4, take: (e) => Z.spec = e },
  "journals.index": { read: () => de.journals(), every: 1e4, take: (e) => Z.journals = e },
  "people.index": { read: () => de.people(), every: 3e4, take: (e) => e && e.people && (Z.people = e) },
  "entries.recent": { read: Il, every: 1e3, take: Rl },
  "outputs.running": { read: () => de.runningOutputs(), every: 3e3 },
  "messages.docked": { read: Tl, every: 1e3, by: ({ session: e }) => e || "main" },
  "mcp.servers": { read: () => de.mcp(), every: 3e4 },
  "developer.readers": { read: () => de.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
  "workers.index": { read: () => ss("workers.index", Ne("workers")), every: 5e3 },
  "workers.activity": { read: () => de.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => ss("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => de.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => de.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewer.steps": { read: Bl, every: 3e3 },
  "tests.turns": { read: () => de.list("test_turns", { limit: Ne("test_turns") }).then((e) => e.rows || []), every: 3e3 },
  "rows.shown": { read: ({ table: e, ids: t }) => de.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? de.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? de.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => de.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
  "reader.elsewhere": { read: Ll, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Js(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: cn }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: cn }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
}), Dl = 6e4, Nl = 3e3, jl = 4, Pl = 300, ql = 5e3, Ka = /* @__PURE__ */ new Map();
function _n(e) {
  if (!(e in Zs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Zs[e];
}
function Wl(e) {
  const t = _n(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return ql;
  }
}
const Fl = (e) => e / 2 + Math.random() * e / 2, Ya = (e) => [...e.users.values()].pop(), Ss = (e) => Ka.get(e.place) === e, Hl = () => Math.random() * Pl, Es = () => document.hidden;
function Ul(e) {
  const t = Wl(e);
  return e.failures ? Fl(Math.min(e.key === Ua ? Nl : Dl, t * 2 ** e.failures)) : Math.max(t, jl * e.took);
}
function Ja(e, t) {
  clearTimeout(e.timer), !(!Ss(e) || e.paused || Es()) && (e.timer = setTimeout(() => zl(e), t));
}
function zl(e) {
  return Ss(e) ? e.running ? (e.again = !0, e.running) : (e.running = Yl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Vl = (e) => {
  var t, n;
  return !e.paused && !Es() && (((n = (t = _n(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Ya(e).active() && (!za() || e.key === Ua);
};
async function Gl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Pe.attemptOnce(() => _n(e.key).read(Ya(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Kl(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = _n(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Yl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Vl(e) && Kl(e, await Gl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && Ss(e) && !e.paused);
  Ja(e, Ul(e));
}
const Jl = () => Es() || Ka.forEach((e) => Ja(e, Hl()));
document.addEventListener("visibilitychange", Jl);
const Zl = 60, Xl = (e, t) => Se(e.created_at) >= Se(t.created_at) - Zl, Ql = (e, t) => e.id > 0 && e.table === t.table && Xl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), Cs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Ql(s, n))), nt = /* @__PURE__ */ new Set(), As = R(0), qt = /* @__PURE__ */ new Set(), Wt = /* @__PURE__ */ new Set(), Ye = /* @__PURE__ */ new Set(), as = /* @__PURE__ */ new Set(), ec = /* @__PURE__ */ new Map(), tc = /* @__PURE__ */ new Map();
let St = !1, Et = null;
const nc = (e, t) => e.id - t.id, sc = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, ac = { messages: sc }, Za = (e) => ac[e] || nc;
function Xa(e) {
  return As.value, nt.has(e) || (nt.add(e), Z.booted && (!qt.has(e) || Wt.has(e)) && queueMicrotask(() => Sn([e], !1))), Z.rows[e] || [];
}
function oc(e) {
  const t = Z.rows[e] || [], n = xl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  Z.rows[e] = t.filter((a) => s.has(a) || Fi(e) && !Wa(a)), Z.paging.size[e] = Ne(e), Z.paging.more[e] = !0;
}
const rc = /* @__PURE__ */ new Set();
function ic() {
  nt.forEach(oc), nt.clear(), ec.clear(), tc.clear(), As.value += 1;
}
$e(() => `${qe.value.env}/${qe.value.page}/${qe.value.open ? qe.value.open.table : ""}`, ic);
$e(
  () => Z.booted,
  (e) => e && Sn(
    [...nt].filter((t) => !qt.has(t)),
    !1
  )
);
const os = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Hi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Qa(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (os(s) && !os(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function eo(e, t) {
  qt.add(e), As.value += 1;
  const n = Z.rows[e] || [];
  Z.rows[e] = [...Qa(n, t.rows), ...Cs(n.filter((s) => s.id === 0), t.rows)], Z.paging.size[e] = Z.paging.size[e] || Ne(e), Z.paging.more[e] = !t.is_last_page;
}
async function lc(e) {
  const t = new Set((Z.rows[e] || []).map((o) => o.id)), n = await de.list(e, { limit: Ne(e) });
  Mn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = Cs((Z.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return eo(e, { ...n, rows: [...n.rows, ...a].sort(Za(e)) }), Z.paging.size[e] = Ne(e), to.has(e) && await no(e), Z.rows[e];
}
const Mn = (e, t) => Z.counts = { ...Z.counts, [e]: t };
async function cc(e) {
  const t = Z.rows[e] || [], n = Math.max(0, ...t.map(ln)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await de.list(e, { limit: Ne(e), since: n, after: s });
  if (Mn(e, a.counts), !a.is_last_page) return lc(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), i = Cs(t.filter((r) => !o.has(r.id)), a.rows).concat(Qa(t, a.rows));
  return Z.rows[e] = i.sort(Za(e)), Z.paging.size[e] = Z.rows[e].length, Z.rows[e];
}
const In = /* @__PURE__ */ new Set();
async function uc(e, t = !1) {
  e.forEach((n) => Wt.delete(n)), e.forEach((n) => as.add(n));
  try {
    await vc(e, t);
  } finally {
    e.forEach((n) => as.delete(n));
  }
}
async function dc(e) {
  const t = await de.list(e, { limit: Ne(e) });
  Mn(e, t.counts), eo(e, t);
}
async function hc(e) {
  Mn(e, (await de.list(e, { limit: 1, closed: !0 })).counts);
}
const to = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function no(e) {
  const t = (Z.rows[e] || []).filter((a) => os(a) && (e !== "plans" || !Wa(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await de.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  Z.rows[e] = (Z.rows[e] || []).map((a) => s.get(a.id) || a);
}
const fc = (e, t) => !qt.has(e) || t && (Z.paging.size[e] || Ne(e)) === Ne(e) && !rc.has(e);
async function pc(e, t) {
  if (!nt.has(e)) return hc(e);
  const n = await (fc(e, t) ? dc(e) : cc(e));
  return to.has(e) && await no(e), n;
}
async function so() {
  const e = await de.settings();
  JSON.stringify(e) !== JSON.stringify(Z.settings) && (Z.settings = e);
}
async function mc() {
  const [e] = await Promise.all([de.entries(0, Ms), so()]);
  ro([...It(oo(), []), ...e]);
}
const gc = (e, t) => pc(e, t).then(
  () => null,
  () => e
);
async function vc(e, t) {
  const n = (await Promise.all(e.map((s) => gc(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ye.add(s), Wt.add(s))), t && await mc(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const ao = 1e3, yc = 15e3;
let Gt = ao;
async function wc() {
  return Et || (Et = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ye].some((e) => !In.has(e)) || St; ) {
      const e = St, t = [...e ? Object.keys(Z.rows) : Ye].filter((s) => jt[s] && (nt.has(s) || s in Z.rows)).filter((s) => e || !nt.has(s) || Wt.has(s) || !qt.has(s)).filter((s) => !In.has(s)), n = [...Ye].filter((s) => In.has(s));
      Ye.clear(), n.forEach((s) => Ye.add(s)), St = !1;
      try {
        await uc(t, e), Gt = ao;
      } catch {
        St = St || e, await new Promise((a) => setTimeout(a, Gt)), Gt = Math.min(Gt * 2, yc);
      }
    }
  })().finally(() => Et = null), Et);
}
function Sn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !as.has(n)).forEach((n) => {
    Ye.add(n), t && Wt.add(n);
  }), Ye.delete("settings") && so(), wc();
}
const oo = () => {
  var e;
  return `typed-entries:${((e = Z.identity) == null ? void 0 : e.root) || location.host}:${de.env()}`;
};
function ro(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  Z.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Ms), kn(oo(), Z.entries.slice(-50));
}
const kc = ["created", "updated", "deleted"], bc = { phases: ["phases", "plans"] }, rs = (e) => bc[e] || [e], $c = (e) => kc.includes(e.entry_type) ? [...rs(e.data.table), ...(e.data.joins || []).flatMap(rs)] : [];
function xc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of rs(t.data.table).filter((s) => Z.rows[s]))
      Z.rows[n] = Z.rows[n].filter((s) => s.id !== t.data.id);
}
function _c(e) {
  ro([...Z.entries, ...e]), xc(e), Sn([...new Set(e.flatMap($c))].filter((t) => t && t !== "agents"));
}
dl((e) => Z.streamOpen || Sn([e]));
const is = [], Mc = 2e3, Ke = /* @__PURE__ */ new Map(), Sc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Ec = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ut(e, { first: t = !1 } = {}) {
  t ? is.unshift(e) : is.push(e), Ke.clear();
}
function io(e, t, n) {
  var a;
  const s = Xa(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Cc = (e) => Xa(e.table).find((t) => t.id === e.id) === e.row, Ac = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function ze(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Oc(e, t) {
  const n = [{ kind: "text", text: ze(e).replace(/\r\n/g, `
`) }];
  for (const s of is)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const i = s(o.text, t);
      typeof i == "string" ? o.text = i : i && n.splice(a, 1, ...i);
    }
  return n;
}
function Rt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Tc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Tc(e) {
  return e.split(Ec).map((t, n) => n % 2 ? t : t.replace(Sc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Xs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Bc(e) {
  const [t, , ...n] = e, s = Xs(t).map((o) => `<th>${Rt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Xs(o).map((i) => `<td>${Rt(i)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Ic(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Rt(a)}</li>`).join("")}</${s}>`;
}
const Qs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function lo(e) {
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
      const r = t.findIndex((d, h) => h > s && /^(```|~~~)/.test(d)), c = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(s + 1, c).join(`
`)}</code></pre>`), s = c + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${Rt(o[2])}</h${r}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Qs(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Bc(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(Ic(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${lo(
          t.slice(s, r).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let i = s;
    for (; i < t.length && t[i].trim() && !Qs(t, i) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[i]); )
      i += 1;
    n.push(`<p>${Rt(t.slice(s, i).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = i;
  }
  return n.join("");
}
const Rc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Lc = (e) => e.kind !== "text" && !Rc.test(e.html);
function Dc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(lo(s).replace(/\u0001(\d+)\u0001/g, (o, i) => t[Number(i)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Lc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ls(e, t = { env: "" }) {
  const n = Ac(e, t), s = Ke.get(n);
  if (Ke.delete(n), s && s.reads.every(Cc))
    return Ke.set(n, s), s.html;
  const a = [], o = Dc(Oc(e, { ...t, reads: a }));
  return Ke.set(n, { html: o, reads: a }), Ke.size > Mc && Ke.delete(Ke.keys().next().value), o;
}
const co = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, un = (e) => String(e || "").replace(co, (t, n, s, a) => a), Nc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Kt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, jc = /^Traceback \(most recent call last\):/m, Pc = 8;
function uo(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Pc).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function qc(e) {
  const t = [...e.matchAll(Nc)].map((s) => s.index);
  if (Kt.lastIndex = 0, !t.length || !Kt.test(e)) return null;
  Kt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), i = [...o.matchAll(Kt)];
    return { head: i.length ? o.slice(0, i[0].index).trim() : o, frames: i.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: uo(n), tail: "" } : null;
}
function Wc(e) {
  const t = jc.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: uo([o]), tail: n.slice(a).join(`
`) };
}
ut((e) => {
  const t = un(e), n = Wc(t) || qc(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const cs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Fc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Hc = `${cs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Uc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", zc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", ea = {
  js: { keywords: cs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Fc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Hc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: cs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Uc, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: zc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function ta(e, t, n) {
  return n && e.startsWith(n, t);
}
function Vc(e, t) {
  const n = ea[t] || ea.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const i = (r, c) => c && a.push({ kind: r, value: c });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const d = e.indexOf(`
`, o), h = e.slice(o, d < 0 ? e.length : d);
      i(
        /^#{1,6}\s/.test(h) ? "keyword" : /^(```|~~~)/.test(h) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(h) ? "number" : "plain",
        h
      ), i("plain", d < 0 ? "" : `
`), o = d < 0 ? e.length : d + 1;
      continue;
    }
    if (ta(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      i("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && ta(e, o, n.block[0])) {
      const d = e.indexOf(n.block[1], o + n.block[0].length), h = d < 0 ? e.length : d + n.block[1].length;
      i("comment", e.slice(o, h)), o = h;
      continue;
    }
    const c = (n.triple || []).find((d) => e.startsWith(d, o));
    if (c) {
      const d = e.indexOf(c, o + 3), h = d < 0 ? e.length : d + 3;
      i("string", e.slice(o, h)), o = h;
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
      const h = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? h.toLowerCase() : h, b = n.property && /^\s*:/.test(e.slice(o + h.length));
      i(s.has(m) ? "keyword" : b ? "property" : /^[A-Z]/.test(h) && t !== "text" ? "type" : "plain", h), o += h.length;
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
function Gc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Vc(e, t))
    a.split(`
`).forEach((i, r) => {
      r && n.push(""), i && (n[n.length - 1] += s === "plain" ? ze(i) : `<span class="tok-${s}">${ze(i)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Kc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Yc = 1500, na = /* @__PURE__ */ new WeakMap();
async function Jc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Kc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(na.get(t)), na.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Yc)
  )));
}
typeof document < "u" && document.addEventListener("click", Jc, !0);
const Zc = /^(```|~~~)\s*(\w+)?\s*$/, Xc = /^\s{4,}\S/, Qc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, eu = /^\s*(?:[-*+]|\d+[.)])\s/, ho = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, tu = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function fo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function nu(e) {
  const t = fo(e.join(`
`));
  return (tu.find(([, n]) => n.test(t)) || ["text"])[0];
}
const su = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && ho.test(t) && !eu.test(t);
};
function sa(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Gc(fo(e.join(`
`)), t || nu(e)).join(`
`)}</code></pre></div>` };
}
function au(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const i = t[o].match(Zc);
    if (i) {
      const c = t.findIndex((h, m) => m > o && h.trim().startsWith(i[1])), d = c < 0 ? t.length : c;
      a(), n.push(sa(t.slice(o + 1, d).map(un), i[2] ? i[2].toLowerCase() : "")), o = d + 1;
      continue;
    }
    const r = su(s) ? Qc : Xc;
    if (r.test(t[o])) {
      let c = o;
      for (; c < t.length && (r.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && ho.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - o + d.length >= 2) {
        a(), n.push(sa([...d, ...t.slice(o, c)].map(un), "")), o = c;
        continue;
      }
      s.push(...d);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ut((e) => au(e));
const ou = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, ru = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function iu(e) {
  const t = ou.exec(e);
  if (t && lt(t[1])) return { at: t.index, length: t[0].length, table: lt(t[1]), id: Number(t[2]), label: t[3] };
  const n = ru.exec(e), s = n && lt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function lu(e, t, n, s) {
  const a = io(s, e, t), o = un(a ? Pi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${ze(Pt(e).title)} ${t}</span><span class="row-card-title">${ze(o)}</span></a>`;
}
ut(
  (e, t) => {
    const n = iu(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: lu(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const cu = /\.(png|jpe?g|gif|webp|svg)$/i, uu = (e) => cu.test(e), du = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, hu = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function fu(e, t) {
  const n = du.exec(e), [, s, a, o, i, r] = n || [], c = n && lt(s || o), d = c && io(t, c, Number(a || i));
  if (!d || !(d.files || []).includes(r)) return null;
  const h = de.in(t.env).fileUrl(c, d.id, r), m = `${Pt(c).title} ${d.id} · ${ze(r)}`, b = uu(r) ? `<img class="file-card-image" src="${h}" alt="${ze(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${h}" data-attached="${ze(r)}">${b}<span class="file-card-name">${m}</span></a>` };
}
function pu(e) {
  const t = hu.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ze(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ut(
  (e, t) => {
    if (t.inline) return null;
    const n = fu(e, t) || pu(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const mu = /`([^`\n]+)`/g;
ut((e) => e.replace(mu, (t, n) => `<code>${n}</code>`));
const aa = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${bn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ut(
  (e, t) => e.replace(co, (n, s, a, o) => aa[s] ? aa[s](a, o, t) : o)
);
const gu = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, vu = new RegExp(`\\b(${Pa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), yu = new RegExp(`\\b(${Pa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), wu = (e, t) => `<a class="row-pill" href="#" data-peek="${lt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, ku = (e) => e.replace(yu, (t, n, s) => s.replace(/\d+/g, (a) => wu(n.replace(/s$/i, ""), a))), bu = (e) => ku(e).replace(
  vu,
  (t, n, s, a = "", o) => {
    const i = s || o;
    return `<a class="row-pill" href="#" data-peek="${lt(n)}:${i}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${i}${a ? `:${a}` : ""}</span></a>`;
  }
);
ut(
  (e, t) => t.rowNames === !1 ? e : e.split(gu).map((n, s) => s % 2 ? n : bu(n)).join("")
);
const $u = ["innerHTML"], xu = ["innerHTML"], _u = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = M(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = ls(s, { env: qe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), u("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => U(mt) && U(mt)(...o)),
      innerHTML: n.value
    }, null, 8, $u)) : (l(), u("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(mt) && U(mt)(...o)),
      innerHTML: n.value
    }, null, 8, xu));
  }
}, Je = /* @__PURE__ */ K(_u, [["__scopeId", "data-v-1a43d211"]]), Mu = { class: "fact" }, Su = { class: "fact-label" }, Eu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), u("div", Mu, [
      p("span", Su, v(e.label), 1),
      F(Je, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Cu = /* @__PURE__ */ K(Eu, [["__scopeId", "data-v-3a88ecf8"]]), Au = { class: "list" }, Ou = { class: "list-label" }, Tu = {
  key: 1,
  class: "list-note"
}, Bu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), u("div", Au, [
      (l(!0), u(Y, null, oe(e.items, (o, i) => (l(), V(ct(o.open ? "button" : "div"), {
        key: i,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: z(() => [
          p("span", Ou, v(o.label), 1),
          o.badge ? (l(), V(qa, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : $("", !0),
          o.note ? (l(), u("span", Tu, v(o.note), 1)) : $("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Iu = /* @__PURE__ */ K(Bu, [["__scopeId", "data-v-ebe2ae0a"]]), Ru = { class: "table" }, Lu = {
  key: 0,
  class: "table-row empty"
}, Du = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = M(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, i) => (l(), u("div", Ru, [
      p("div", {
        class: "table-row head",
        style: _e(a.value)
      }, [
        (l(!0), u(Y, null, oe(e.columns, (r) => (l(), u("span", {
          key: r,
          class: "cell"
        }, v(r), 1))), 128))
      ], 4),
      (l(!0), u(Y, null, oe(e.rows, (r, c) => (l(), V(ct(r.open ? "button" : "div"), {
        key: c,
        type: r.open ? "button" : void 0,
        class: J(["table-row", r.tone, { opens: r.open }]),
        style: _e(a.value),
        onClick: (d) => r.open && s("open", r.open)
      }, {
        default: z(() => [
          (l(!0), u(Y, null, oe(r.cells, (d, h) => (l(), u("span", {
            key: h,
            class: "cell"
          }, v(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (l(), u("div", Lu, v(e.empty), 1)) : $("", !0)
    ]));
  }
}, Nu = /* @__PURE__ */ K(Du, [["__scopeId", "data-v-9326a52e"]]), ju = { class: "stat-value" }, Pu = { class: "stat-label" }, qu = {
  key: 0,
  class: "stat-note"
}, Wu = {
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
    return (s, a) => (l(), V(ct(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: z(() => [
        p("span", ju, v(e.value), 1),
        p("span", Pu, v(e.label), 1),
        e.note ? (l(), u("span", qu, v(e.note), 1)) : $("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Fu = /* @__PURE__ */ K(Wu, [["__scopeId", "data-v-ad0db6d6"]]), Hu = { class: "code" }, Uu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, i) => (l(), V(xs, {
      value: e.node.type
    }, {
      stack: z(() => [
        F(en, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: z(() => [
        F(en, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: z(() => [
        F(en, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: z(() => [
        F(Di, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: z(() => [
        p("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: z(() => [...i[2] || (i[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: z(() => [
        F(Fu, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: i[0] || (i[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: z(() => [
        F(Oi, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: z(() => [
        F(Nu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: z(() => [
        F(Iu, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: z(() => [
        F(Je, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: z(() => [
        F(Cu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: z(() => [
        F(qa, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: z(() => [
        p("pre", Hu, [
          p("code", null, v(e.node.text), 1)
        ])
      ]),
      file: z(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: i[1] || (i[1] = (r) => a(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), po = /* @__PURE__ */ K(Uu, [["__scopeId", "data-v-cbdcf540"]]), zu = { class: "dashboard" }, Vu = { class: "trail" }, Gu = ["onClick"], Ku = {
  key: 0,
  class: "gone",
  role: "status"
}, Yu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (b) => b in (n.document.pages || {}), o = R(!!n.page && !a(n.page)), i = R(n.page && !o.value ? [n.page] : []), r = M(() => i.value.at(-1) || n.document.start), c = M(() => (n.document.pages || {})[r.value] || null), d = (b) => ((n.document.pages || {})[b] || {}).title || b, h = (b) => {
      o.value = !1, i.value = [...i.value, b];
    }, m = (b) => {
      o.value = !1, i.value = i.value.slice(0, b);
    };
    return $e(
      () => n.document.start,
      () => i.value = []
    ), (b, S) => (l(), u("div", zu, [
      e.document.broken ? (l(), V(an, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: z(() => [
          ue(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), V(an, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: z(() => [
          ue(v(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), u(Y, { key: 2 }, [
        p("nav", Vu, [
          p("button", {
            type: "button",
            class: J(["step", { current: !i.value.length }]),
            onClick: S[0] || (S[0] = (j) => m(0))
          }, v(d(e.document.start)), 3),
          (l(!0), u(Y, null, oe(i.value, (j, D) => (l(), u(Y, {
            key: `${D}-${j}`
          }, [
            S[2] || (S[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: J(["step", { current: D === i.value.length - 1 }]),
              onClick: (k) => m(D + 1)
            }, v(d(j)), 11, Gu)
          ], 64))), 128))
        ]),
        o.value ? (l(), u("p", Ku, "What you opened is no longer in this dashboard. Here is its start page.")) : $("", !0),
        F(wt, {
          name: "page",
          mode: "out-in"
        }, {
          default: z(() => [
            (l(), u("div", {
              key: r.value,
              class: "page"
            }, [
              F(po, {
                node: c.value.view,
                onOpen: h,
                onFile: S[1] || (S[1] = (j) => s("file", j))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : $("", !0)
    ]));
  }
}, Jy = /* @__PURE__ */ K(Yu, [["__scopeId", "data-v-fbe83734"]]);
function Ju(e, t, n, s = () => window) {
  je(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ae(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Zu = (e, t = () => !0) => Ju("keydown", (n) => n.key === "Escape" && t() && e());
function mo(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = R(!1), a = M(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Zu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Xu = 80, ft = ks([]);
function go(e) {
  const t = Symbol("layer"), n = () => ft.includes(t) && ft.splice(ft.indexOf(t), 1);
  return $e(
    e,
    (s) => {
      s && !ft.includes(t) && ft.push(t), s || n();
    },
    { immediate: !0 }
  ), Ae(n), M(() => Xu + Math.max(0, ft.indexOf(t)));
}
let vo = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return vo = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Qu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function ed(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const i = [...e.value.querySelectorAll(Qu)];
    if (!i.length) return o.preventDefault();
    const [r, c] = [i[0], i.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  je(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : vo, document.addEventListener("keydown", a), Nt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const td = ["aria-modal", "aria-label", "aria-labelledby"], nd = {
  key: 0,
  class: "dialog-head"
}, sd = ["id", "tabindex"], ad = {
  key: 1,
  class: "dialog-foot"
}, od = 500, rd = 400, id = {
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
    const n = e, s = t, { visible: a, close: o, closed: i } = mo(s, n), r = go(a), c = R(null), d = R(null), h = R(null), m = Ca(), b = R(!1), S = Date.now();
    n.modal && ed(d, () => s("escape"), h);
    function j() {
      if (!n.modal) return n.closable && o();
      b.value = !0, setTimeout(() => b.value = !1, rd);
    }
    function D(A) {
      !n.modal || Date.now() - S >= od || ![" ", "Enter"].includes(A.key) || (A.preventDefault(), A.stopPropagation());
    }
    const k = () => c.value && (c.value.scrollTop = c.value.scrollHeight), O = new MutationObserver(k);
    return $e(c, (A) => {
      O.disconnect(), A && n.follow && (O.observe(A, { childList: !0, subtree: !0, characterData: !0 }), k());
    }), Ae(() => O.disconnect()), (A, G) => (l(), V(bs, { to: "body" }, [
      F(wt, {
        name: "dialog",
        appear: "",
        onAfterLeave: U(i)
      }, {
        default: z(() => [
          U(a) ? (l(), u("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: _e({ zIndex: U(r) }),
            onClick: xe(j, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: d,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: b.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? U(m) : void 0,
              onKeydownCapture: D
            }, [
              e.bare ? $("", !0) : (l(), u("header", nd, [
                p("h3", {
                  id: U(m),
                  ref_key: "heading",
                  ref: h,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, sd),
                e.closable ? (l(), V(xn, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : $("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                me(A.$slots, "default", {}, void 0, !0)
              ], 2),
              A.$slots.foot ? (l(), u("footer", ad, [
                me(A.$slots, "foot", {}, void 0, !0)
              ])) : $("", !0)
            ], 42, td)
          ], 6)) : $("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ld = /* @__PURE__ */ K(id, [["__scopeId", "data-v-6d1ecd98"]]), Ge = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, De = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Le = { across: 48, down: 110, margin: 32, labelSpace: 14 }, cd = 6;
function Os(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const ud = (e) => {
  const t = Os(e, Ge.lineChars), n = Math.max(Ge.minWidth, Math.max(...t.map((s) => s.length)) * Ge.charWidth + Ge.padX * 2);
  return { name: e, lines: t, line: Ge.line, padY: Ge.padY, width: n, height: t.length * Ge.line + Ge.padY * 2 };
};
function dd(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (i) => {
    a.set(i, "open"), t.forEach((r, c) => {
      if (r[0] !== i) return;
      const d = a.get(r[1]);
      d === "open" ? s.add(c) : d || o(r[1]);
    }), a.set(i, "done");
  };
  return [...n, ...e].forEach((i) => a.has(i) || o(i)), s;
}
function hd(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, i]) => {
      n.get(i) < n.get(o) + 1 && (n.set(i, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function fd(e, t, n) {
  const s = [];
  e.forEach((i) => {
    var r;
    return (s[r = n.get(i)] || (s[r] = [])).push(i);
  });
  const a = () => new Map(s.flatMap((i) => i.map((r, c) => [r, c]))), o = (i, r) => {
    const c = a(), d = (h) => {
      const m = r(h).map((b) => c.get(b));
      return m.length ? m.reduce((b, S) => b + S, 0) / m.length : c.get(h);
    };
    return [...i].sort((h, m) => d(h) - d(m));
  };
  for (let i = 0; i < cd; i++) {
    const r = i % 2 === 0, c = s.map((d, h) => h);
    (r ? c.slice(1) : c.slice(0, -1).reverse()).forEach((d) => {
      const h = (m) => t.filter((b) => b[r ? 1 : 0] === m).map((b) => b[r ? 0 : 1]);
      s[d] = o(s[d], h);
    });
  }
  return s;
}
function pd(e, t) {
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
function md(e) {
  const t = [...new Set(e.flatMap(([y, g]) => [y, g]))], n = new Set(e.map(([, y]) => y)), s = t.filter((y) => !n.has(y)), a = dd(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((y, g) => !a.has(g)), i = hd(t, o), r = fd(t, o, i), c = new Map(t.map((y) => [y, ud(y)])), d = r.map((y) => y.reduce((g, B) => g + c.get(B).width, 0) + Le.across * (y.length - 1)), h = Math.max(...d) + Le.margin * 2, m = vd(e, i, r.length), b = /* @__PURE__ */ new Map();
  let S = Le.margin;
  r.forEach((y, g) => {
    let B = (h - d[g]) / 2;
    const E = Math.max(...y.map((P) => c.get(P).height));
    y.forEach((P) => {
      const x = c.get(P);
      b.set(P, { ...x, x: B, y: S + (E - x.height) / 2 }), B += x.width + Le.across;
    }), S += E + (m[g] ?? Le.down);
  });
  const j = e.map(([y, g, B], E) => ({ from: y, to: g, label: B || "", back: a.has(E) || i.get(g) <= i.get(y) }));
  pd(j, b);
  const D = j.map((y) => yd(y, b.get(y.from), b.get(y.to))), k = [...b.values()], O = $d(D, k), A = Math.max(S - Le.down, ...O.filter((y) => y.label).map((y) => y.label.y + y.label.height));
  return { width: Math.max(h - Le.margin, ...O.filter((y) => y.label).map((y) => y.label.x + y.label.width)) + Le.margin, height: A + Le.margin, nodes: k, arrows: O };
}
const gd = (e) => e ? Os(e, De.lineChars).length * De.line + De.pad * 2 : 0;
function vd(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Le.labelSpace);
  return e.forEach(([a, o, i]) => {
    const [r, c] = [t.get(a), t.get(o)].sort((d, h) => d - h);
    c > r && (s[r + Math.floor((c - r - 1) / 2)] += gd(i) + Le.labelSpace);
  }), s.map((a) => Math.max(Le.down, a));
}
function yd(e, t, n) {
  const s = e.label ? Os(e.label, De.lineChars) : [], a = s.length ? Math.max(...s.map((b) => b.length)) * De.charWidth + De.pad * 2 : 0, o = s.length * De.line + (s.length ? De.pad * 2 : 0), i = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, h = (d - r) / 2, m = [{ x: i, y: r }, { x: i, y: r + h }, { x: c, y: d - h }, { x: c, y: d }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: m, path: `M${i} ${r} C${i} ${r + h} ${c} ${d - h} ${c} ${d}` };
}
const wd = ([e, t, n, s], a) => {
  const o = 1 - a, i = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: i("x"), y: i("y") };
}, kd = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], bd = [0, -1, 1, -2, 2, -3, 3].map((e) => e * De.line);
function $d(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: i }) => ({ x: s, y: a, width: o, height: i }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, d) => {
      const h = wd(s.curve, c);
      return { x: h.x - s.labelWidth / 2, y: h.y - s.labelHeight / 2 + d, width: s.labelWidth, height: s.labelHeight };
    }, r = bd.flatMap((c) => kd.map((d) => a(d, c))).find((c) => !n.some((d) => oa(c, d))) ?? a(0.5, 0);
    for (; n.some((c) => oa(r, c)); ) r.y += De.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: De.line, pad: De.pad } };
  });
}
const oa = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, xd = { class: "flowchart-tools" }, _d = ["width", "height", "viewBox", "aria-label"], Md = ["d"], Sd = ["x", "y", "width", "height"], Ed = ["x", "y"], Cd = ["x", "dy"], Ad = {
  key: 0,
  class: "flowchart-label"
}, Od = ["x", "y", "width", "height"], Td = ["x", "y"], Bd = ["x", "dy"], Id = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = M(() => md(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, i = R(null), r = R({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function d() {
      var O;
      const D = (O = i.value) == null ? void 0 : O.getBoundingClientRect();
      if (!(D != null && D.width)) return;
      const k = Math.min(D.width / a.value.width, D.height / a.value.height, 1.5);
      r.value = { zoom: k, x: (D.width - a.value.width * k) / 2, y: (D.height - a.value.height * k) / 2 };
    }
    function h(D, k, O) {
      const { zoom: A, x: G, y } = r.value, g = Math.min(o.most, Math.max(o.least, A * D));
      r.value = { zoom: g, x: k - (k - G) * g / A, y: O - (O - y) * g / A };
    }
    function m(D) {
      const k = i.value.getBoundingClientRect();
      h(D, k.width / 2, k.height / 2);
    }
    function b(D) {
      const k = i.value.getBoundingClientRect();
      D.ctrlKey || D.metaKey ? h(D.deltaY < 0 ? o.step : 1 / o.step, D.clientX - k.left, D.clientY - k.top) : r.value = { ...r.value, x: r.value.x - D.deltaX, y: r.value.y - D.deltaY };
    }
    function S(D) {
      var k, O, A;
      D.preventDefault(), (k = window.getSelection()) == null || k.removeAllRanges(), c = { x: D.clientX - r.value.x, y: D.clientY - r.value.y }, (A = (O = i.value).setPointerCapture) == null || A.call(O, D.pointerId);
    }
    function j(D) {
      c && (r.value = { ...r.value, x: D.clientX - c.x, y: D.clientY - c.y });
    }
    return je(d), (D, k) => (l(), V(ld, {
      title: e.title,
      large: "",
      onClose: k[4] || (k[4] = (O) => s("close"))
    }, {
      default: z(() => [
        p("div", xd, [
          F(ke, {
            small: "",
            onClick: k[0] || (k[0] = (O) => m(o.step))
          }, {
            default: z(() => [...k[5] || (k[5] = [
              ue("Zoom in", -1)
            ])]),
            _: 1
          }),
          F(ke, {
            small: "",
            onClick: k[1] || (k[1] = (O) => m(1 / o.step))
          }, {
            default: z(() => [...k[6] || (k[6] = [
              ue("Zoom out", -1)
            ])]),
            _: 1
          }),
          F(ke, {
            small: "",
            onClick: d
          }, {
            default: z(() => [...k[7] || (k[7] = [
              ue("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: i,
          class: "flowchart-frame",
          onWheel: xe(b, ["prevent"]),
          onPointerdown: S,
          onPointermove: j,
          onPointerup: k[2] || (k[2] = (O) => js(c) ? c.value = null : c = null),
          onPointercancel: k[3] || (k[3] = (O) => js(c) ? c.value = null : c = null)
        }, [
          (l(), u("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: _e({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
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
            (l(!0), u(Y, null, oe(a.value.arrows, (O, A) => (l(), u("path", {
              key: `arrow-${A}`,
              class: "flowchart-arrow",
              d: O.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Md))), 128)),
            (l(!0), u(Y, null, oe(a.value.nodes, (O) => (l(), u("g", {
              key: O.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: O.x,
                y: O.y,
                width: O.width,
                height: O.height,
                rx: "8"
              }, null, 8, Sd),
              p("text", {
                x: O.x + O.width / 2,
                y: O.y + O.padY + O.line / 2
              }, [
                (l(!0), u(Y, null, oe(O.lines, (A, G) => (l(), u("tspan", {
                  key: G,
                  x: O.x + O.width / 2,
                  dy: G ? O.line : 0
                }, v(A), 9, Cd))), 128))
              ], 8, Ed)
            ]))), 128)),
            (l(!0), u(Y, null, oe(a.value.arrows, (O, A) => (l(), u(Y, {
              key: `label-${A}`
            }, [
              O.label ? (l(), u("g", Ad, [
                p("rect", {
                  x: O.label.x,
                  y: O.label.y,
                  width: O.label.width,
                  height: O.label.height,
                  rx: "4"
                }, null, 8, Od),
                p("text", {
                  x: O.label.x + O.label.width / 2,
                  y: O.label.y + O.label.pad + O.label.line / 2
                }, [
                  (l(!0), u(Y, null, oe(O.label.lines, (G, y) => (l(), u("tspan", {
                    key: y,
                    x: O.label.x + O.label.width / 2,
                    dy: y ? O.label.line : 0
                  }, v(G), 9, Bd))), 128))
                ], 8, Td)
              ])) : $("", !0)
            ], 64))), 128))
          ], 12, _d))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Rd = /* @__PURE__ */ K(Id, [["__scopeId", "data-v-51d24cfe"]]), ra = {
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
}, Ld = ["innerHTML"], Dd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => ra[t.name] || ra.dot);
    return (s, a) => (l(), u("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Ld));
  }
}, Ve = /* @__PURE__ */ K(Dd, [["__scopeId", "data-v-beb5935c"]]), Nd = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), u("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      F(Ve, { name: "fold" })
    ], 2));
  }
}, Lt = /* @__PURE__ */ K(Nd, [["__scopeId", "data-v-d03899bb"]]), jd = ["data-tip", "aria-label"], Pd = {
  key: 0,
  class: "mact-word"
}, qd = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), u("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      F(Ve, { name: "open" }),
      e.open ? (l(), u("span", Pd, v(e.label), 1)) : $("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, jd));
  }
}, yo = /* @__PURE__ */ K(qd, [["__scopeId", "data-v-3b292e09"]]), Wd = 120, Rn = 280, Fd = 160, Hd = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Ud = ["leaving", "resizing", "entering"];
function zd(e) {
  const t = Ud.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = { width: e.offsetWidth, height: e.offsetHeight };
  return e.classList.add(...t), n;
}
function wo(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = R(t()), a = R("");
  let o = 0;
  const i = (d, h) => Object.assign(d.style, { width: `${h.width}px`, height: `${h.height}px` }), r = (d) => Object.assign(d.style, { width: "", height: "", transition: "" });
  async function c(d) {
    const h = e.value, m = ++o;
    if (!h || !h.offsetWidth || Hd()) {
      s.value = d;
      return;
    }
    const b = { width: h.offsetWidth, height: h.offsetHeight };
    if (i(h, b), a.value = "leaving", await n(Wd), m !== o) return;
    s.value = d, a.value = "resizing", await Nt(), r(h);
    const S = zd(h);
    i(h, b), h.offsetWidth, h.style.transition = `width ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, i(h, S), await n(Rn), m === o && (r(h), a.value = "entering", await n(Fd), m === o && (a.value = ""));
  }
  return $e(t, (d) => c(d)), kt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Vd = { class: "growing-card-top" }, Gd = ["aria-expanded"], Kd = { class: "growing-card-avatar" }, Yd = { class: "growing-card-title" }, Jd = { class: "growing-card-more" }, Zd = { class: "growing-card-body" }, Xd = {
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
    const n = e, s = t, a = R(!1), o = R(null), { folded: i, phase: r } = wo(o, () => !a.value), c = M(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), d = M(() => n.text.split(/\n\s*\n/).filter((h) => h.trim()));
    return (h, m) => (l(), u("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", U(r), { open: !U(i), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Vd, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: m[0] || (m[0] = (b) => a.value = !a.value)
        }, [
          p("span", Kd, [
            e.bad ? (l(), V(Ve, {
              key: 0,
              name: "cross"
            })) : c.value ? (l(), u(Y, { key: 1 }, [
              ue(v(c.value), 1)
            ], 64)) : (l(), V(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Yd, v(e.title), 1),
          F(Lt, { open: a.value }, null, 8, ["open"])
        ], 8, Gd),
        e.action ? (l(), V(yo, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: m[1] || (m[1] = (b) => s("act"))
        }, null, 8, ["label", "open"])) : $("", !0),
        e.commentable ? (l(), u("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: m[2] || (m[2] = (b) => s("comment"))
        }, [
          F(ye, {
            name: "bubble",
            size: 13
          })
        ])) : $("", !0)
      ]),
      p("div", Jd, [
        p("div", Zd, [
          (l(!0), u(Y, null, oe(d.value, (b, S) => (l(), u("p", {
            key: S,
            class: "growing-card-text"
          }, v(b), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Qd = /* @__PURE__ */ K(Xd, [["__scopeId", "data-v-e31436cb"]]), eh = ["title", "aria-label"], th = {
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
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = M(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), u("span", {
      class: J(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (l(), u("svg", th, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), u("path", nh)) : $("", !0)
      ]))
    ], 10, eh));
  }
}, ah = /* @__PURE__ */ K(sh, [["__scopeId", "data-v-6dc92808"]]), oh = "img,pre,table";
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
  je(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), $e(t, s, { flush: "post" });
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
const hh = ["data-ref"], fh = ["data-from", "data-ref"], ph = { class: "message-body" }, mh = ["title"], gh = ["innerHTML"], vh = ["title"], yh = ["innerHTML"], wh = {
  class: "message-faces",
  "data-message-faces": ""
}, kh = ["title", "data-face", "onClick"], bh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, $h = ["title", "data-reaction", "onClick"], xh = {
  key: 0,
  class: "message-reaction-count"
}, _h = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Mh = ["href", "title"], Sh = ["src", "alt"], Eh = ["href"], Ch = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, Ah = {
  key: 1,
  "data-message-links-rows": ""
}, Oh = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Th = ["data-sent-worker", "title", "onClick"], Bh = { class: "message-foot" }, Ih = { class: "message-time" }, Rh = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, Lh = 140, Dh = 2, Nh = 1500, jh = "An earlier message", Ph = "about", qh = "sent_to", Wh = 3, Fh = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var fe;
    const n = e, s = t, a = R(!1), o = R(null), i = M(() => ["user", "comment"].includes(n.message.type)), r = M(() => {
      const [ee, te] = (n.message.commented_row || ":").split(":"), X = lt(ee);
      return X ? { ref: `${X}:${te}`, label: `${Pt(X).title.toLowerCase()} ${te}` } : null;
    }), c = M(() => n.message.worker_id ?? null), d = R(!1), h = M(() => c.value !== null && ((n.message.text ?? "").length > Lh || (n.message.text ?? "").split(`
`).filter((ee) => ee.trim()).length > Dh)), m = M(() => i.value && !n.message.read_at && !n.message.local);
    async function b() {
      var ee;
      await ((ee = navigator.clipboard) == null ? void 0 : ee.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Nh);
    }
    const S = M(() => ls(n.message.text ?? "", { env: "" })), j = M(() => JSON.parse(n.message.flowchart_edges || "[]")), D = R(!1), k = M(() => ls(n.quote || jh, { env: "" }));
    function O() {
      const ee = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ee ? ee.scrollIntoView({ block: "center", behavior: "smooth" }) : Ue(`messages:${n.message.parent_id}`);
    }
    ch(o, () => `${n.message.text} ${n.quote}`);
    const A = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, G = (ee) => `/api/files/message/${n.message.id}/${encodeURIComponent(ee)}`, y = M(() => JSON.parse(n.message.captions || "{}")), g = M(() => (n.message.files ?? []).map((ee) => ({ name: ee, address: G(ee), isImage: A.test(ee), title: y.value[ee] || ee }))), B = M(() => Ga(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Ee(Oe, null), P = R([]), x = R([]), C = R(!1), w = M(() => `Linked: ${P.value.join(", ")}`), f = M(() => P.value.length >= Wh), T = M(() => `${P.value.length} linked ${P.value.every((ee) => ee.startsWith("task ")) ? "tasks" : "rows"}`);
    async function I() {
      if (!i.value || !(E != null && E.read) || n.message.local) return;
      const ee = await E.read(`link list --source message:${n.message.id}`);
      if (!ee.ok) return;
      const te = ee.value.rows ?? ee.value ?? [];
      P.value = te.filter((X) => X.link_type === Ph).map((X) => `${X.target_model} ${X.target_id}`), x.value = te.filter((X) => X.link_type === qh).map((X) => X.target_id);
    }
    I(), (fe = E == null ? void 0 : E.follow) == null || fe.call(E, ["link.*"], I);
    const q = R(!1), ie = M(() => dh(n.message.reactions));
    function ce(ee) {
      q.value = !1, s("react", n.message, ee);
    }
    return (ee, te) => e.message.peer || e.message.recipient ? (l(), u("div", {
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
        commentable: "",
        onComment: te[0] || (te[0] = (X) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, hh)) : (l(), u("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": i.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", ph, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: r.value }]),
          onClick: te[6] || (te[6] = (...X) => U(mt) && U(mt)(...X))
        }, [
          r.value ? (l(), u("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: te[1] || (te[1] = xe((X) => U(Ue)(r.value.ref), ["stop"]))
          }, [
            F(ye, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + v(r.value.label), 1)
          ], 8, mh)) : $("", !0),
          e.message.parent_id ? (l(), u("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(O, ["stop"]),
            innerHTML: k.value
          }, null, 8, gh)) : $("", !0),
          c.value !== null ? (l(), u("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${c.value}`,
            onClick: te[2] || (te[2] = xe((X) => U(Ue)(`agents:${c.value}`), ["stop"]))
          }, "Worker " + v(c.value), 9, vh)) : $("", !0),
          p("div", {
            class: J({ "message-folded": h.value && !d.value }),
            "data-message-text": "",
            innerHTML: S.value
          }, null, 10, yh),
          h.value ? (l(), u("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: te[3] || (te[3] = xe((X) => d.value = !d.value, ["stop"]))
          }, v(d.value ? "Show less" : "Show more"), 1)) : $("", !0),
          j.value.length ? (l(), u(Y, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: te[4] || (te[4] = (X) => D.value = !0)
            }, "Open the flowchart"),
            D.value ? (l(), V(Rd, {
              key: 0,
              title: e.message.text,
              edges: j.value,
              onClose: te[5] || (te[5] = (X) => D.value = !1)
            }, null, 8, ["title", "edges"])) : $("", !0)
          ], 64)) : $("", !0)
        ], 2),
        p("div", {
          class: J(["message-tools", { picking: q.value }]),
          "data-message-tools": ""
        }, [
          q.value ? (l(), u(Y, { key: 0 }, [
            p("div", wh, [
              (l(!0), u(Y, null, oe(U(uh), (X) => (l(), u("button", {
                key: X,
                type: "button",
                class: "message-face",
                title: `React ${X}`,
                "data-face": X,
                onClick: (Te) => ce(X)
              }, v(X), 9, kh))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: te[7] || (te[7] = (X) => q.value = !1)
            }, [
              F(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (l(), u(Y, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: te[8] || (te[8] = (X) => q.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: te[9] || (te[9] = (X) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: b
            }, v(a.value ? "Copied" : "Copy"), 1),
            m.value ? (l(), u("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: te[10] || (te[10] = (X) => s("delete", e.message))
            }, "Delete")) : $("", !0)
          ], 64))
        ], 2)
      ]),
      ie.value.length ? (l(), u("div", bh, [
        (l(!0), u(Y, null, oe(ie.value, (X) => (l(), u("button", {
          key: X.emoji,
          type: "button",
          class: J(["message-reaction", { mine: X.mine }]),
          title: X.title,
          "data-reaction": X.emoji,
          onClick: (Te) => s("react", e.message, X.emoji)
        }, [
          ue(v(X.emoji) + " ", 1),
          X.count > 1 ? (l(), u("span", xh, v(X.count), 1)) : $("", !0)
        ], 10, $h))), 128))
      ])) : $("", !0),
      g.value.length ? (l(), u("div", _h, [
        (l(!0), u(Y, null, oe(g.value, (X) => (l(), u(Y, {
          key: X.name
        }, [
          X.isImage ? (l(), u("a", {
            key: 0,
            href: X.address,
            target: "_blank",
            class: "message-image",
            title: X.title
          }, [
            p("img", {
              src: X.address,
              alt: X.name
            }, null, 8, Sh)
          ], 8, Mh)) : (l(), u("a", {
            key: 1,
            href: X.address,
            target: "_blank",
            class: "message-file"
          }, v(X.name), 9, Eh))
        ], 64))), 128))
      ])) : $("", !0),
      P.value.length ? (l(), u("div", Ch, [
        F(Ve, {
          class: "message-links-icon",
          name: "linked"
        }),
        f.value && !C.value ? (l(), u("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: te[11] || (te[11] = (X) => C.value = !0)
        }, v(T.value), 1)) : (l(), u("span", Ah, [
          F(Je, {
            text: w.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : $("", !0),
      x.value.length ? (l(), u("div", Oh, [
        F(ye, {
          name: "send",
          size: 12
        }),
        (l(!0), u(Y, null, oe(x.value, (X) => (l(), u("button", {
          key: X,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": X,
          title: `Open worker ${X}`,
          onClick: xe((Te) => U(Ue)(`agents:${X}`), ["stop"])
        }, "Also sent to worker " + v(X), 9, Th))), 128))
      ])) : $("", !0),
      p("div", Bh, [
        p("time", Ih, v(B.value), 1),
        Number.isInteger(e.message.id) ? (l(), u("span", Rh, "message " + v(e.message.id), 1)) : $("", !0),
        i.value ? (l(), V(ah, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : $("", !0)
      ])
    ], 8, fh));
  }
}, Zy = /* @__PURE__ */ K(Fh, [["__scopeId", "data-v-895cf9ce"]]), dn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ln = 200, ko = (e) => {
  var t;
  return ((t = dn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? dn[0].key;
}, Xy = (e) => {
  var t;
  return ((t = dn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Hh = ["aria-label"], Uh = 300, ia = 400, zh = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ln } },
  setup(e) {
    const t = e, n = M(() => ko(t.value)), s = M(() => n.value < Ln ? [1, 0.25, 0.25] : n.value === Ln ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), u("svg", {
      class: J(["ico", "prio", { hot: n.value >= ia, high: n.value >= Uh && n.value < ia }]),
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
        style: _e({ opacity: s.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: _e({ opacity: s.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: _e({ opacity: s.value[2] })
      }, null, 4)
    ], 10, Hh));
  }
}, Qy = /* @__PURE__ */ K(zh, [["__scopeId", "data-v-b10e610f"]]), Vh = {
  working: { word: "Working", dot: "running" },
  waiting: { word: "Waiting", dot: "you" },
  stuck: { word: "Stuck", dot: "failed" },
  stopped: { word: "Stopped", dot: "" },
  idle: { word: "Idle", dot: "queued" }
}, Gh = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "stuck", silent: "stuck", stopped: "stopped" }, Kh = (e) => {
  const t = Gh[e.state] || "idle";
  return { key: t, ...Vh[t] };
}, Yh = [
  { key: "working", label: "Working", icon: "agents", hidden: (e) => `${e} working` },
  { key: "waiting", label: "Blocked", icon: "warn", hidden: (e) => `${e} blocked` },
  { key: "idle", label: "Idle", icon: "pause", hidden: (e) => `${e} idle` },
  { key: "stopped", label: "Not running", icon: "x", hidden: (e) => `${e} not running` }
], Jh = [
  { key: "environment", label: "Environment agents", icon: "branch", hidden: (e) => `${e} ${e === 1 ? "environment agent" : "environment agents"}` },
  { key: "worker", label: "Workers", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "worker" : "workers"}` },
  { key: "subagent", label: "Subagents", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "helper" : "helpers"}` }
], Zh = { working: "working", waiting: "waiting", stuck: "waiting", idle: "idle", stopped: "stopped" }, hn = (e) => Zh[Kh(e.card).key] || "idle";
function Xh(e, t) {
  return t.states[hn(e)] === !1 ? hn(e) : t.kinds[e.kind] === !1 ? e.kind : "";
}
const Qh = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), la = { working: 0, waiting: 1, idle: 2, stopped: 3 }, ca = (e, t) => la[hn(e)] - la[hn(t)], ua = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, ew = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => ca(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || Qh(s, a)) : [...e].sort((s, a) => ca(s, a) || (ua[t] || ua.state)(s, a)), ef = Object.fromEntries([...Yh, ...Jh].map((e) => [e.key, e.hidden]));
function tw(e, t) {
  const n = {};
  return e.forEach((s) => {
    const a = Xh(s, t);
    a && (n[a] = (n[a] || 0) + 1);
  }), Object.entries(n).map(([s, a]) => ef[s](a));
}
const tf = ["aria-checked", "aria-haspopup", "onClick"], nf = {
  key: 0,
  class: "segmented-dot"
}, sf = {
  key: 1,
  class: "segmented-count"
}, af = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = Ca();
    return (a, o) => {
      const i = lr("tip");
      return l(), u("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), u(Y, null, oe(e.options, (r) => tt((l(), u("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: J(["segmented-option", { on: r.key === e.value }]),
          onClick: (c) => n("pick", r.key)
        }, [
          r.dot ? (l(), u("span", nf)) : $("", !0),
          ue(" " + v(r.label) + " ", 1),
          r.count !== void 0 ? (l(), u("em", sf, v(r.count), 1)) : $("", !0)
        ], 10, tf)), [
          [i, r.tip || r.title, `${U(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, of = /* @__PURE__ */ K(af, [["__scopeId", "data-v-ca953072"]]), rf = { class: "form-field" }, lf = { class: "form-field-head" }, cf = ["for"], uf = {
  key: 0,
  class: "form-field-aside"
}, df = {
  key: 0,
  class: "form-field-help"
}, hf = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (l(), u("div", rf, [
      p("div", lf, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, cf),
        t.$slots.aside ? (l(), u("span", uf, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : $("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0),
      e.help ? (l(), u("p", df, v(e.help), 1)) : $("", !0)
    ]));
  }
}, nw = /* @__PURE__ */ K(hf, [["__scopeId", "data-v-dd7cdcff"]]), ff = { class: "list-row" }, pf = {
  key: 0,
  class: "list-row-kind"
}, mf = { class: "list-row-main" }, gf = {
  key: 0,
  class: "list-row-title"
}, vf = { class: "list-row-body" }, yf = {
  key: 1,
  class: "list-row-end"
}, wf = {
  key: 1,
  class: "list-row-text"
}, kf = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (l(), u("div", ff, [
      e.kind ? (l(), u("span", pf, v(e.kind), 1)) : $("", !0),
      p("div", mf, [
        e.title ? (l(), u("span", gf, v(e.title), 1)) : $("", !0),
        p("div", vf, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (l(), u("div", yf, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : $("", !0)
      ]),
      e.text ? (l(), u("span", wf, v(e.text), 1)) : $("", !0)
    ]));
  }
}, sw = /* @__PURE__ */ K(kf, [["__scopeId", "data-v-63155fba"]]), bf = {
  claude: [
    { key: "haiku", label: "haiku", note: "fast, for mechanical work" },
    { key: "sonnet", label: "sonnet", note: "careful work without invention" },
    { key: "opus", label: "opus", note: "judgement" }
  ],
  codex: [
    { key: "gpt-6.1-sol", label: "gpt-6.1-sol", note: "the workhorse for coding, Codex's default" },
    { key: "gpt-6-astra", label: "gpt-6-astra", note: "frontier, for the most demanding work" },
    { key: "gpt-6-luna", label: "gpt-6-luna", note: "fast and affordable, for easier tasks" },
    { key: "gpt-5.6-sol", label: "gpt-5.6-sol", note: "the older workhorse" },
    { key: "gpt-5.6-terra", label: "gpt-5.6-terra", note: "older and balanced" },
    { key: "gpt-5.6-luna", label: "gpt-5.6-luna", note: "older and fast" }
  ]
}, $f = { claude: "Claude Code", codex: "Codex" }, xf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, _f = {
  key: 1,
  class: "menu-item-text"
}, Mf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), u("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), u("span", xf, v(e.checked ? "✓" : ""), 1)) : $("", !0),
      e.description ? (l(), u("span", _f, [
        p("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, v(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, yt = /* @__PURE__ */ K(Mf, [["__scopeId", "data-v-fec99974"]]), bo = /* @__PURE__ */ new WeakMap(), Sf = (e, t) => bo.set(e, t);
function Ef(e, t) {
  for (let n = t; n; n = bo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Cf(e, t) {
  const n = (s) => {
    var o, i;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((i = e.value) == null ? void 0 : i.$el) || e.value;
    a && !Ef(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const pt = 8, Af = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = R(null), o = (f) => f ? `${f}px` : void 0, i = M(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), r = R({ w: 0, h: 0 }), c = R(s.anchor ? s.anchor.getBoundingClientRect() : null), d = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), h = (f) => ({
      left: Math.max(0, f.left),
      top: Math.max(0, f.top),
      right: Math.min(window.innerWidth, f.right),
      bottom: Math.min(window.innerHeight, f.bottom)
    }), m = (f) => {
      const T = f.closest(".pane, .float-window");
      return T ? h(T.getBoundingClientRect()) : d();
    }, b = (f, T) => `${Math.max(0, f ? Math.min(f, T) : T)}px`;
    function S(f, T) {
      return {
        below: f.bottom - T.bottom - s.gap - pt,
        above: T.top - f.top - s.gap - pt,
        across: f.right - f.left - 2 * pt
      };
    }
    function j(f) {
      const T = m(s.anchor), I = S(T, f);
      return r.value.w <= I.across && r.value.h <= Math.max(I.below, I.above) ? T : d();
    }
    const D = M(() => {
      if (!c.value) return i.value;
      const f = c.value, T = j(f), I = S(T, f), { w: q, h: ie } = r.value, ce = s.align === "auto" ? f.left + f.right > T.left + T.right : s.align === "right", fe = Ni(ce ? f.right - q : f.left, T.left + pt, Math.max(T.left + pt, T.right - q - pt)), te = ie > I.below && I.above > I.below ? { bottom: `${window.innerHeight - f.top + s.gap}px`, maxHeight: b(s.maxHeight, I.above) } : { top: `${f.bottom + s.gap}px`, maxHeight: b(s.maxHeight, I.below) };
      return { ...i.value, ...te, left: `${fe}px`, maxWidth: b(s.maxWidth, I.across) };
    }), k = n, O = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function A(f) {
      const T = O(), I = T.indexOf(document.activeElement);
      T[(I + f + T.length) % T.length].focus();
    }
    const G = { ArrowDown: () => A(1), ArrowUp: () => A(-1), Escape: () => k("close") }, y = (f) => G[f.key] && (f.preventDefault(), G[f.key]()), g = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let B = 0;
    const E = new ResizeObserver(() => {
      cancelAnimationFrame(B), B = requestAnimationFrame(g);
    });
    Cf(a, (f) => s.anchor && !s.anchor.contains(f.target) && k("close"));
    const P = (f, T) => ["top", "left", "right", "bottom"].some((I) => Math.abs(f[I] - T[I]) > 1), x = (f) => f.bottom < 0 || f.top > window.innerHeight;
    let C = 0;
    function w() {
      if (s.anchor) {
        const f = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || x(f)) return k("close");
        P(f, c.value) && (c.value = f);
      }
      C = requestAnimationFrame(w);
    }
    return je(() => {
      s.anchor && a.value && Sf(a.value, s.anchor), g(), a.value && E.observe(a.value), !s.plain && O()[0] && O()[0].focus(), w();
    }), Ae(() => {
      E.disconnect(), cancelAnimationFrame(C), cancelAnimationFrame(B);
    }), t({ element: a }), (f, T) => (l(), V(bs, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", et({
        ref_key: "panel",
        ref: a
      }, f.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: D.value,
        onKeydown: y
      }), [
        me(f.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ts = /* @__PURE__ */ K(Af, [["__scopeId", "data-v-3d203970"]]), Of = ["aria-expanded"], Tf = { class: "drop-label" }, Bf = ["value"], If = {
  key: 1,
  class: "drop-lead"
}, Rf = { class: "drop-item-text" }, Lf = {
  key: 2,
  class: "drop-note"
}, Df = {
  key: 1,
  class: "drop-none"
}, Nf = {
  __name: "DropList",
  props: {
    label: { type: String, default: "" },
    icon: { type: String, default: "" },
    items: { type: Array, default: () => [] },
    picked: { type: String, default: "" },
    empty: { type: String, default: "Nothing here" },
    wide: Boolean,
    bare: Boolean,
    menuWidth: { type: Number, default: 260 },
    searchable: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(!1), o = R(null), i = R(""), r = M(() => {
      const d = i.value.trim().toLowerCase();
      return d ? n.items.filter((h) => `${h.label} ${h.note || ""}`.toLowerCase().includes(d)) : n.items;
    });
    function c(d) {
      a.value = !1, s("pick", d);
    }
    return (d, h) => (l(), u("div", {
      class: J(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      p("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: J(["drop-head", { on: a.value }]),
        "aria-expanded": a.value,
        "data-drop-head": "",
        onClick: h[0] || (h[0] = (m) => a.value = !a.value)
      }, [
        e.icon ? (l(), V(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : $("", !0),
        p("span", Tf, v(e.label), 1),
        F(ye, {
          name: "down",
          size: 11
        })
      ], 10, Of),
      a.value ? (l(), V(Ts, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: h[2] || (h[2] = (m) => a.value = !1)
      }, {
        default: z(() => [
          e.searchable ? (l(), u("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: i.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: h[1] || (h[1] = (m) => i.value = m.target.value)
          }, null, 40, Bf)) : $("", !0),
          (l(!0), u(Y, null, oe(r.value, (m) => (l(), V(yt, {
            key: m.key,
            on: m.key === e.picked,
            "data-drop-item": m.key,
            onClick: (b) => c(m)
          }, {
            default: z(() => [
              m.running !== void 0 ? (l(), u("span", {
                key: 0,
                class: J(["drop-dot", { live: m.running }])
              }, null, 2)) : $("", !0),
              m.lead ? (l(), u("span", If, v(m.lead), 1)) : $("", !0),
              p("span", Rf, v(m.label), 1),
              m.note ? (l(), u("span", Lf, v(m.note), 1)) : $("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? $("", !0) : (l(), u("p", Df, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : $("", !0)
    ], 2));
  }
}, jf = /* @__PURE__ */ K(Nf, [["__scopeId", "data-v-29dfcce5"]]), aw = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = M(() => [
      ...bf[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = M(() => (a.value.find((i) => i.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (i, r) => (l(), V(jf, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${U($f)[e.provider]} model`,
      onPick: r[0] || (r[0] = (c) => s("pick", c.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Pf = ["aria-label"], qf = { class: "head" }, Wf = { class: "names" }, Ff = { class: "body" }, Hf = {
  key: 0,
  class: "foot"
}, Uf = {
  __name: "SidePanel",
  props: {
    title: { type: String, default: "" },
    abstract: { type: String, default: "" },
    width: { type: String, default: "normal" },
    open: { type: Boolean, default: null },
    depth: { type: Number, default: 0 },
    over: { type: Boolean, default: !1 },
    closeLabel: { type: String, default: "Close the panel" }
  },
  emits: ["close", "dismiss"],
  setup(e, { emit: t }) {
    const n = e, s = t, { visible: a, close: o, closed: i } = mo(s, n), r = go(a);
    return (c, d) => (l(), V(bs, { to: "body" }, [
      F(wt, {
        name: "side",
        appear: "",
        onAfterLeave: U(i)
      }, {
        default: z(() => [
          U(a) ? (l(), u("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: _e({ "--depth": e.depth, zIndex: U(r) }),
            "data-side-panel": "",
            onClick: d[0] || (d[0] = xe((...h) => U(o) && U(o)(...h), ["self"]))
          }, [
            p("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (l(), u(Y, { key: 0 }, [
                p("header", qf, [
                  p("div", Wf, [
                    p("h2", null, v(e.title), 1),
                    e.abstract ? (l(), V(Je, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : $("", !0)
                  ]),
                  me(c.$slots, "actions", {}, void 0, !0),
                  F(xn, {
                    title: e.closeLabel,
                    onClick: U(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                p("div", Ff, [
                  me(c.$slots, "default", {}, void 0, !0)
                ]),
                c.$slots.foot ? (l(), u("footer", Hf, [
                  me(c.$slots, "foot", {}, void 0, !0)
                ])) : $("", !0)
              ], 64)) : me(c.$slots, "default", {}, void 0, !0, 1)
            ], 10, Pf)
          ], 6)) : $("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ow = /* @__PURE__ */ K(Uf, [["__scopeId", "data-v-c9a3f43a"]]), us = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, zf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = $s(), n = M(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => tt((l(), u("textarea", et({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [U(us), U(t).value]
    ]);
  }
}), rw = /* @__PURE__ */ K(zf, [["__scopeId", "data-v-e130a5b9"]]), Vf = {
  key: 1,
  class: "text-field-label"
}, Gf = {
  key: 2,
  class: "text-field-end"
}, Kf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Xn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var h;
    const n = Zn(e, "modelValue"), s = $s(), a = "onUpdate:modelValue" in (((h = cr()) == null ? void 0 : h.vnode.props) || {}), o = M(() => a ? n.value : s.value), i = (m) => a && (n.value = m.target.value), r = M(
      () => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), c = M(() => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "value"))), d = R(null);
    return t({ focus: () => d.value && d.value.focus() }), (m, b) => e.label || e.icon || m.$slots.end ? (l(), u("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: m.$slots.end }, U(s).class]),
      style: _e(U(s).style)
    }, [
      e.icon ? (l(), V(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : $("", !0),
      e.label ? (l(), u("span", Vf, v(e.label), 1)) : $("", !0),
      tt(p("input", et({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: i }), null, 16), [
        [U(us), o.value]
      ]),
      m.$slots.end ? (l(), u("span", Gf, [
        me(m.$slots, "end", {}, void 0, !0)
      ])) : $("", !0)
    ], 6)) : tt((l(), u("input", et({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: i }), null, 16)), [
      [U(us), o.value]
    ]);
  }
}), iw = /* @__PURE__ */ K(Kf, [["__scopeId", "data-v-d9c38ca8"]]), da = (e) => e.page * e.size < e.total;
function Yf(e, t, { incremental: n = !1 } = {}) {
  const s = wn(), a = R([]), o = R(""), i = R(!1), r = R(!1), c = R(""), d = R(null);
  async function h(k) {
    const O = await s.read(`${e} --before-id ${k + 1} --limit 1`);
    if (!O.ok) return j();
    const A = O.value.rows.find((G) => G.id === k);
    a.value = A ? a.value.map((G) => G.id === k ? A : G) : a.value.filter((G) => G.id !== k);
  }
  async function m(k) {
    if (n && String((k == null ? void 0 : k.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== k.row_id));
    if (n && (k != null && k.row_id) && !String(k.event ?? "").endsWith(".create") && a.value.some((g) => g.id === k.row_id)) return h(k.row_id);
    if (!(n && a.value.length && String((k == null ? void 0 : k.event) ?? "").endsWith(".create"))) return j();
    const A = Math.max(...a.value.map((g) => g.id)), G = await s.read(`${e} --after-id ${A}`);
    if (!G.ok) return j();
    const y = new Set(a.value.map((g) => g.id));
    a.value = [...G.value.rows.filter((g) => !y.has(g.id)), ...a.value];
  }
  async function b() {
    if (!a.value.length) return !1;
    const k = Math.min(...a.value.map((G) => G.id)), O = await s.read(`${e} --before-id ${k}`);
    if (!O.ok || !O.value.rows.length) return r.value = !1;
    r.value = da(O.value);
    const A = new Set(a.value.map((G) => G.id));
    return a.value = [...a.value, ...O.value.rows.filter((G) => !A.has(G.id))], !0;
  }
  let S = 0;
  async function j() {
    const k = ++S, O = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (k !== S) return;
    const A = O.ok ? s.shared ? [O.value] : O.value.rows : [], G = A.length ? Math.min(...A.map((y) => y.id)) : 0;
    a.value = n && O.ok && G ? [...a.value.filter((y) => y.id > Math.max(...A.map((g) => g.id))), ...A, ...a.value.filter((y) => y.id < G)] : A, O.ok && !a.value.some((y) => y.id < G) && (r.value = !s.shared && da(O.value)), o.value = O.ok ? "" : O.error, i.value = !0;
  }
  async function D(k) {
    const O = await s.run(k);
    return c.value = O.ok ? "" : O.error, d.value = O.ok ? O.value : null, await j(), O;
  }
  return s.follow(t, m), j(), { rows: a, failure: o, loaded: i, more: r, load: j, older: b, act: D, actionFailure: c, answer: d, context: s };
}
const Jf = { class: "title" }, Zf = { class: "state" }, Xf = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Yf(t.line, t.events);
    return (o, i) => (l(), V(ci, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: z(({ row: r }) => [
        p("span", Jf, v(r.title), 1),
        p("span", Zf, v(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, lw = /* @__PURE__ */ K(Xf, [["__scopeId", "data-v-a69084cd"]]);
function Qf(e = 1e3, t = null) {
  const n = R(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? $e(t, a, { immediate: !0 }) : a(!0), Ae(() => clearInterval(s)), n;
}
const Dn = R(Date.now() / 1e3);
let ha = 0, Yt = 0;
function e1() {
  return Yt || (Dn.value = Date.now() / 1e3, ha = setInterval(() => Dn.value = Date.now() / 1e3, 1e3)), Yt += 1, Aa() && Oa(() => {
    Yt -= 1, Yt || clearInterval(ha);
  }), Dn;
}
const t1 = ["title", "data-figure-mark", "data-folded", "data-open"], n1 = {
  key: 2,
  class: "worker"
}, s1 = { class: "head" }, a1 = { key: 0 }, o1 = {
  key: 3,
  class: "status"
}, r1 = {
  key: 0,
  class: "figure"
}, i1 = {
  key: 1,
  class: "ran-for"
}, l1 = { key: 2 }, c1 = {
  key: 3,
  class: "news"
}, u1 = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, d1 = {
  key: 6,
  class: "settled"
}, h1 = {
  key: 1,
  class: "bar"
}, f1 = {
  key: 3,
  class: "detail body"
}, p1 = {
  key: 0,
  class: "body-label"
}, m1 = ["title"], g1 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = $s(), s = ["onClick", "onAct"], a = M(() => Object.fromEntries(Object.entries(n).filter(([ee]) => !s.includes(ee)))), o = R(!1), i = M(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = M(() => t.open !== void 0), c = M(() => r.value || i.value), d = M(() => r.value ? t.open : o.value), h = M(() => r.value ? !t.open : i.value && !o.value), m = M(() => !!(t.mark.action && n.onAct)), b = M(() => c.value || m.value || !!n.onClick), S = R(null), j = R(null), { folded: D, phase: k } = wo(S, () => h.value);
    function O(ee) {
      var te, X;
      if (!(ee.target !== S.value && !j.value.contains(ee.target))) {
        if (r.value) return (te = n.onClick) == null ? void 0 : te.call(n, ee);
        if (i.value) return void (o.value = !o.value);
        (X = n.onAct || n.onClick) == null || X(ee);
      }
    }
    const A = (ee) => n.onAct(ee), G = ["failed", "unfinished"], y = M(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? G.includes(t.mark.state) ? "danger" : "good" : ""), g = M(() => t.mark.color ? t.mark.color : y.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : y.value ? `var(--tone-${y.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), B = M(() => g.value || "var(--tone-work)"), E = M(() => !t.mark.ending && !t.mark.ended && y.value !== "stopped"), P = e1(), x = M(
      () => t.mark.began_at && E.value && !t.mark.figure && !t.mark.counting ? vl(P.value - t.mark.began_at) : ""
    ), C = M(() => {
      const { started: ee, ended: te } = t.mark;
      return ee ? te ? `ran ${Ks(te - ee, !0)}` : Ks(P.value - ee, !0) : x.value;
    }), w = ["bad", "danger", "warn"], f = M(() => w.includes(y.value) || t.mark.asks ? "attention" : E.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), T = ["bad", "danger"], I = M(() => T.includes(y.value)), q = M(() => f.value === "process" ? "running" : I.value ? "cross" : y.value === "stopped" ? "stopped" : y.value === "good" ? "tick" : ""), ie = M(
      () => !!(t.mark.figure || C.value || t.mark.docked || t.mark.stopping || q.value || t.mark.settled || t.mark.news)
    ), ce = M(() => [t.mark.title, t.mark.time ? Ga(t.mark.time) : ""].filter(Boolean).join(" · ")), fe = M(() => ({
      ...g.value ? { "--mark": g.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ee, te) => (l(), u("div", et(a.value, {
      ref_key: "root",
      ref: S,
      class: [
        "mark",
        `w-${f.value}`,
        U(k),
        {
          open: d.value,
          folding: r.value && h.value,
          live: b.value,
          failed: I.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: g.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: fe.value,
      title: ce.value,
      "data-figure-mark": e.mark.key,
      "data-folded": U(D) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: O
    }), [
      (l(), V(ct(b.value ? "button" : "span"), {
        ref_key: "top",
        ref: j,
        class: "top",
        type: b.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!d.value) : void 0
      }, {
        default: z(() => [
          e.mark.markIcon ? (l(), V(Ve, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), V(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (l(), u("span", n1, v(e.mark.worker), 1)) : $("", !0),
          p("span", s1, [
            F(Je, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), u("strong", a1, v(e.mark.name), 1)) : $("", !0),
            c.value ? (l(), V(Lt, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : $("", !0)
          ]),
          ie.value ? (l(), u("span", o1, [
            e.mark.figure ? (l(), u("span", r1, v(e.mark.figure), 1)) : $("", !0),
            C.value ? (l(), u("span", i1, v(C.value), 1)) : $("", !0),
            e.mark.stopping ? (l(), u("span", l1, "Stopping")) : $("", !0),
            e.mark.news ? (l(), u("span", c1, v(e.mark.news), 1)) : $("", !0),
            q.value === "running" ? (l(), u("span", u1)) : q.value ? (l(), V(Ve, {
              key: 5,
              class: J(["sign", q.value]),
              name: q.value
            }, null, 8, ["class", "name"])) : $("", !0),
            e.mark.settled ? (l(), u("span", d1, v(e.mark.settled), 1)) : $("", !0)
          ])) : $("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (l(), V(yo, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: xe(A, ["stop"])
      }, null, 8, ["label", "open"])) : $("", !0),
      (e.mark.figure || e.mark.counting) && E.value ? (l(), u("span", h1, [
        p("span", {
          class: "progress",
          style: _e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: B.value })
        }, null, 4)
      ])) : $("", !0),
      e.mark.detail && !U(D) ? (l(), V(Je, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : $("", !0),
      e.mark.body && !U(D) ? (l(), u("div", f1, [
        e.mark.bodyLabel ? (l(), u("p", p1, v(e.mark.bodyLabel), 1)) : $("", !0),
        F(Je, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : $("", !0),
      e.mark.command && !U(D) ? (l(), u("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, m1)) : $("", !0),
      e.mark.card ? (l(), V(Je, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : $("", !0),
      me(ee.$slots, "default", {
        shown: !U(D)
      }, void 0, !0)
    ], 16, t1));
  }
}), $o = /* @__PURE__ */ K(g1, [["__scopeId", "data-v-74d78abb"]]), v1 = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function xo(e) {
  var n;
  const t = v1[e] || ((n = Pt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const y1 = (e) => xo(String(e).split(":")[0]), _o = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), w1 = { passed: "good", failed: "danger", warned: "warn", running: "" }, k1 = { good: "good", warn: "warn", danger: "danger" }, fa = {
  "open row": (e) => Ue(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Qr(e.target_model, e.target_id || 0)
}, b1 = { "open row": (e) => y1(e.target_model), "open page": () => xo("pages") };
function $1(e, t) {
  const n = t || {}, s = fa[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? w1[e.outcome] || "" : k1[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? b1[s](e) : "",
    handlers: s ? { onAct: () => fa[s](e) } : {}
  };
}
const x1 = 24, _1 = 1e3, pa = 2e3, M1 = 0.25, S1 = 5e3;
function E1(e, t = x1, n = () => !0) {
  const s = R(!1), a = R(0), o = R(!1);
  let i = 0, r = 0, c = 0;
  const d = () => e && "value" in e ? e.value : e, h = () => {
    const y = d();
    return y ? y.scrollHeight - y.scrollTop - y.clientHeight : 0;
  }, m = () => !d() || h() <= t;
  function b(y) {
    if (clearTimeout(i), !y) {
      o.value = !1, c = Date.now();
      return;
    }
    const g = Date.now() - c < pa ? pa : _1;
    i = setTimeout(() => o.value = s.value, g);
  }
  function S() {
    clearTimeout(r), s.value = !1, a.value = 0, b(!1);
  }
  function j(y = !1) {
    const g = d();
    g && y && g.scrollTo ? g.scrollTo({ top: g.scrollHeight, behavior: "smooth" }) : g && (g.scrollTop = g.scrollHeight), S();
  }
  function D() {
    O(), !s.value && (s.value = !0, b(!0));
  }
  const k = () => !!d() && h() <= d().clientHeight * M1;
  function O() {
    clearTimeout(r), k() && (r = setTimeout(() => s.value && k() && n() && j(!0), S1));
  }
  function A() {
    m() ? S() : D();
  }
  function G(y = 1, g = !1) {
    s.value ? a.value += Math.max(0, y) : j(g);
  }
  return Aa() && Oa(() => [i, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: h, atBottom: m, follow: S, toBottom: j, left: D, scrolled: A, arrived: G };
}
const C1 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, A1 = (e) => String(e ?? "").replace(C1, ""), O1 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(null), { away: o, scrolled: i, arrived: r, toBottom: c } = E1(a);
    $e(
      () => n.lines.length,
      () => Nt(() => r()),
      { immediate: !0 }
    );
    function d(h) {
      i(), s("older", h.target);
    }
    return (h, m) => (l(), u("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: d
    }, [
      ue(v(U(A1)(e.lines.join(`
`)) || e.empty), 1),
      U(o) ? (l(), u("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (b) => U(c)(!0))
      }, "Follow")) : $("", !0)
    ], 544));
  }
}, T1 = /* @__PURE__ */ K(O1, [["__scopeId", "data-v-d9fa8127"]]), B1 = 1e4;
class I1 {
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
    return this.heardAt !== null && t - this.heardAt > B1;
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
const R1 = {
  key: 0,
  class: "frame-note"
}, L1 = {
  key: 0,
  class: "frame-note"
}, D1 = ["src", "title"], N1 = 1e3, j1 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = wn(), s = R(null), a = R(!1), o = R(!1);
    let i = null, r = 0;
    return je(() => {
      i = new I1(s.value, n), i.start(), r = setInterval(() => {
        a.value = i.silent();
      }, N1);
    }), Ae(() => {
      i == null || i.stop(), clearInterval(r);
    }), (c, d) => o.value ? (l(), u("p", R1, "This window was closed because it stopped answering.")) : (l(), u(Y, { key: 1 }, [
      a.value ? (l(), u("div", L1, [
        d[2] || (d[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        F(ke, {
          onClick: d[0] || (d[0] = (h) => o.value = !0)
        }, {
          default: z(() => [...d[1] || (d[1] = [
            ue("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : $("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: U(n).window
      }, null, 8, D1)
    ], 64));
  }
}, P1 = /* @__PURE__ */ K(j1, [["__scopeId", "data-v-32a49046"]]), q1 = 0, W1 = "/api/lines", F1 = "/api/line";
class H1 {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), q1));
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
        const n = await Pe.raw(W1, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Pe.raw(F1, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const U1 = new H1();
class z1 {
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
      n.patterns.some((s) => Mo(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Mo(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const V1 = Symbol("pane-page"), G1 = { 1: "refused", 2: "usage", 3: "fault" }, K1 = 100, Y1 = /"([^"]*)"|'([^']*)'|(\S+)/g;
function J1({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: i, open: r, options: c = R({}), declared: d = [], page: h = null, setOption: m = () => {
}, autoScroll: b = "", tabs: S = [], search: j = {}, readOnly: D = !1, shared: k = null }) {
  const O = /* @__PURE__ */ new Map(), A = new AbortController(), G = (y) => {
    const g = O.get(y);
    if (g && performance.now() - g.at < K1) return g.answer;
    const B = Ot(e, y, t, A.signal);
    return O.set(y, { answer: B, at: performance.now() }), B;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: h,
    visible: M(() => s()),
    permissions: a,
    autoScroll: b,
    tabs: S,
    search: j,
    readOnly: D,
    shared: k,
    read: G,
    run: (y) => Ot(e, y, t, A.signal),
    upload: (y) => X1(y, A.signal),
    cancel: () => A.abort(),
    follow: (y, g) => i.follow(e, y.filter((B) => o.some((E) => Mo(E, B))), g, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (y) => M(() => {
      var g;
      return c.value[y] ?? ((g = d.find((B) => B.key === y)) == null ? void 0 : g.default);
    }),
    setting: async (y, g) => {
      const B = await G(`window setting ${e} ${y}`);
      return B.ok ? B.value.value : g;
    },
    setOption: m,
    keep: (y, g) => Ot(e, ["window", "save-setting", e, y, JSON.stringify(g)], t, A.signal)
  };
}
function Z1(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const fn = { ok: !1, failure: "cancelled", error: "" };
async function Ot(e, t, n, s = void 0) {
  try {
    const a = await U1.add({ window: e, line: Array.isArray(t) ? t : Q1(t), environment: n }, s);
    return s != null && s.aborted ? fn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: G1[a.code] || "fault", error: Z1(a.error) };
  } catch (a) {
    return s != null && s.aborted ? fn : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function X1(e, t = void 0) {
  try {
    const n = await Pe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? fn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? fn : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function Q1(e) {
  return [...e.matchAll(Y1)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function ep({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const tp = {
  class: "allowance-prompt",
  role: "dialog"
}, np = { class: "allowance-prompt-text" }, sp = { class: "allowance-prompt-buttons" }, ap = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), u("div", tp, [
      p("p", np, v(U(ep)(e.request)), 1),
      p("div", sp, [
        F(ke, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: z(() => [...a[2] || (a[2] = [
            ue("Allow", -1)
          ])]),
          _: 1
        }),
        F(ke, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: z(() => [...a[3] || (a[3] = [
            ue("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, op = /* @__PURE__ */ K(ap, [["__scopeId", "data-v-102dc765"]]), Nn = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), V(an, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: z(() => [
        ue(v(e.reason) + " ", 1),
        e.retry ? (l(), V(ke, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: z(() => [...a[2] || (a[2] = [
            ue("Retry", -1)
          ])]),
          _: 1
        })) : $("", !0),
        e.removable ? (l(), V(ke, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: z(() => [...a[3] || (a[3] = [
            ue("Remove tab", -1)
          ])]),
          _: 1
        })) : $("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, rp = ["data-window", "data-agent"], ip = {
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
    search: { type: Object, default: () => ({}) },
    readOnly: Boolean,
    shared: { type: Object, default: null }
  },
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(""), o = R(0);
    function i() {
      a.value = "", o.value++;
    }
    const r = Ee(Nr, null), c = J1({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: M(() => n.options),
      declared: n.declared,
      page: Ee(V1, null),
      setOption: (m, b) => s("option", m, b),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (m, b) => {
        s("open", m, b), r == null || r(m, b);
      }
    });
    ur(Oe, c), $e(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ae(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), dr((m) => (a.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const d = () => ws(n.component), h = () => {
      var m, b;
      return ((b = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : b.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, b) => (l(), u("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      h() ? (l(), V(op, {
        key: 0,
        request: h(),
        onAnswer: b[0] || (b[0] = (S) => e.prompts.answer(S))
      }, null, 8, ["request"])) : $("", !0),
      e.unavailableReason ? (l(), V(Nn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), V(Nn, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: i
      }, null, 8, ["name", "reason"])) : e.component ? (l(), V(d, { key: o.value })) : (l(), V(Nn, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: b[1] || (b[1] = (S) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, rp));
  }
}, So = /* @__PURE__ */ K(ip, [["__scopeId", "data-v-32203cbc"]]), lp = {
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
    const n = e, s = t, a = { render: () => ws(P1, { src: n.entry.entry_url }) };
    return (o, i) => (l(), V(So, {
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
      search: e.entry.search,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: i[0] || (i[0] = (r, c) => s("option", r, c))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "search", "events", "unavailable-reason"]));
  }
}, ds = "journal.stale-build-reload", cp = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function up(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ds) === e.message) return !1;
    t.setItem(ds, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function dp(e = window.sessionStorage) {
  try {
    e.removeItem(ds);
  } catch {
    return;
  }
}
const hp = ["data-window"], fp = {
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
    const n = e, s = t, a = yn(null), o = R("");
    return $e(
      () => n.entry.entry_url,
      async (i) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              i
            )).default, dp();
          } catch (r) {
            if (cp(r) && up(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (i, r) => !a.value && !o.value && !e.entry.unavailable_reason ? (l(), u("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      F(bt, { shape: "cards" })
    ], 8, hp)) : (l(), V(So, {
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
      search: e.entry.search,
      events: e.entry.events,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: r[0] || (r[0] = (c, d) => s("option", c, d))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "search", "events", "unavailable-reason"]));
  }
}, pp = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new z1(), s = ((r = Ee(Oe, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = M(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), i = M(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, d) => i.value ? (l(), V(fp, {
      key: 0,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), V(lp, {
      key: 1,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, mp = { class: "mark-more-inner" }, gp = {
  class: "mark-lines",
  "data-mark-reason": ""
}, vp = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, yp = {
  key: 3,
  class: "mark-lines"
}, wp = "process", ma = "task", kp = 2e3, bp = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ee(Oe), s = M(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = M(() => _o.has(t.mark.variant) && t.mark.detail || ""), o = M(() => t.mark.target_model === ma ? t.mark.target_id : 0), i = R([]), r = R(!1), c = R(""), d = M(() => t.mark.target_model === wp && !!t.mark.target_id);
    async function h() {
      const S = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, c.value = S.ok ? "" : S.error, S.ok && (i.value = S.value.lines);
    }
    let m = null;
    const b = () => clearInterval(m);
    return $e(() => t.shown && d.value, (S) => {
      b(), S && (h(), t.mark.ended_at || (m = setInterval(h, kp)));
    }, { immediate: !0 }), $e(() => t.mark.ended_at, (S) => S && t.shown && d.value && (b(), h())), Ae(b), (S, j) => (l(), u("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: j[1] || (j[1] = xe(() => {
      }, ["stop"]))
    }, [
      p("div", mp, [
        e.declaration.body_url ? (l(), V(pp, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (l(), u(Y, { key: 1 }, [
          a.value ? (l(), u(Y, { key: 0 }, [
            j[2] || (j[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", gp, v(a.value), 1)
          ], 64)) : $("", !0),
          d.value && c.value ? (l(), u("p", vp, v(c.value), 1)) : d.value && r.value ? (l(), u(Y, { key: 2 }, [
            j[3] || (j[3] = p("p", { class: "mark-label" }, "Output", -1)),
            F(T1, {
              class: "mark-terminal",
              lines: i.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), u("p", yp, v(s.value.join(`
`)), 1)) : $("", !0),
          o.value ? (l(), u("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: j[0] || (j[0] = xe((D) => U(Ue)(`${ma}:${o.value}`), ["stop"]))
          }, "Open task " + v(o.value) + " and its proofs", 1)) : $("", !0)
        ], 64))
      ])
    ], 2));
  }
}, hs = /* @__PURE__ */ K(bp, [["__scopeId", "data-v-51f69bf1"]]), $p = (e) => `show-${e}`, cw = (e, t, n) => e.filter((s) => {
  var a;
  return n($p((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), xp = "messages.chat", _p = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), Eo = (e, t, n) => Ot(xp, _p(e, t), n), Mp = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Sp = ["title", "aria-label", "onClick"], Ep = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Cp = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = M(() => Mp(t.buttons, t.allowedRuns).filter((i) => {
      var r;
      return !((r = i.variants) != null && r.length) || i.variants.includes(t.mark.variant);
    })), s = R(""), a = Ee(Oe);
    async function o(i) {
      const r = await Eo(i, t.mark, a.environment);
      s.value = r.ok ? "" : r.error;
    }
    return (i, r) => (l(), u(Y, null, [
      (l(!0), u(Y, null, oe(n.value, (c) => (l(), u("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: xe((d) => o(c), ["stop"])
      }, [
        F(Ve, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, Sp))), 128)),
      s.value ? (l(), u("span", Ep, v(s.value), 1)) : $("", !0)
    ], 64));
  }
}, Ap = /* @__PURE__ */ K(Cp, [["__scopeId", "data-v-0dfda102"]]);
function Co(e, t) {
  const n = yn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((i) => [i.type, i])), a = async () => {
    try {
      return (await (await Pe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const Ao = Co("/api/marks", "marks"), uw = Ao.fetchAll, Op = Ao.find, Tp = 2e3;
function Oo(e, t, n = Tp) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  je(async () => {
    await e(), a();
  }), kt(() => clearTimeout(s));
}
const Bp = ["data-ref"], Ip = ["data-ref"], Rp = { class: "mark-row" }, Lp = "dock add", Dp = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = M(() => Op(s.mark.type)), o = Ee(Oe, null), i = M(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), r = R(null);
    Oo(async () => {
      if (!i.value) return;
      const b = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      b.ok && b.value.rows.length && (r.value = b.value.rows[0].progress);
    }, () => i.value);
    const c = M(() => {
      const b = $1(s.mark, a.value), S = !b.figure || b.figure.endsWith("%");
      return r.value && i.value && S ? { ...b, figure: `${r.value}%`, fraction: r.value / 100 } : b;
    }), d = M(() => {
      var b;
      return !!(s.mark.lines || s.mark.detail && _o.has(s.mark.variant) || t.has(s.mark.target_model) || (b = a.value) != null && b.body_url);
    }), h = R(!1), m = M(() => {
      var b, S, j;
      return s.docked ? (S = (b = a.value) == null ? void 0 : b.buttons) == null ? void 0 : S.filter((D) => {
        var k;
        return !((k = D.runs) != null && k.startsWith(Lp));
      }) : (j = a.value) == null ? void 0 : j.buttons;
    });
    return (b, S) => {
      var j, D;
      return (j = a.value) != null && j.card ? (l(), u("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        F(hs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Bp)) : (l(), u("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (D = a.value) == null ? void 0 : D.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", Rp, [
          F($o, et({
            mark: c.value,
            open: d.value ? h.value : void 0
          }, hr(c.value.handlers), {
            onClick: S[0] || (S[0] = (k) => h.value = !h.value)
          }), fr({ _: 2 }, [
            d.value ? {
              name: "default",
              fn: z(({ shown: k }) => [
                F(hs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: k
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(Ap, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Ip));
    };
  }
}, Np = /* @__PURE__ */ K(Dp, [["__scopeId", "data-v-b3334caa"]]), jp = ["data-ref"], Pp = ["inert"], qp = { class: "thread-group" }, Wp = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = R(!1), s = R(!1);
    $e(n, () => s.value = !0);
    const a = M(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (o, i) => (l(), u("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      F($o, {
        mark: a.value,
        open: n.value,
        onClick: i[0] || (i[0] = (r) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (l(), u("div", {
        key: 0,
        class: J(["group-rows", { open: n.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", qp, [
          (l(!0), u(Y, null, oe(e.group.marks, (r) => (l(), V(Np, {
            key: r.id,
            mark: r
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, Pp)) : $("", !0)
    ], 8, jp));
  }
}, dw = /* @__PURE__ */ K(Wp, [["__scopeId", "data-v-8a285510"]]);
function Fp(e) {
  const t = R(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return je(() => n.observe(e.value)), kt(() => n.disconnect()), t;
}
const Hp = { class: "chat-dock-fold" }, Up = ["aria-label"], zp = { class: "chat-dock-head" }, Vp = { class: "chat-dock-inner" }, To = 700, Gp = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = R(null), s = R(null), a = Fp(s), o = R(!1);
    let i = 0;
    return je(() => i = setTimeout(() => o.value = !0, To)), kt(() => clearTimeout(i)), t({ card: n }), (r, c) => (l(), u("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", Hp, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          me(r.$slots, "edge"),
          p("header", zp, [
            me(r.$slots, "head")
          ]),
          p("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", Vp, [
              p("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: _e(U(a) === null ? null : { height: `${U(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  me(r.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, Up)
      ])
    ], 2));
  }
}, Bo = /* @__PURE__ */ K(Gp, [["__scopeId", "data-v-63e4dcfc"]]), Kp = {
  class: "dock-leave",
  "aria-hidden": "true"
}, jn = 5, Yp = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(jn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${jn}s`, animationDelay: `${(n - jn).toFixed(2)}s` };
    return (a, o) => (l(), u("span", Kp, [
      p("i", { style: s })
    ]));
  }
}, Io = /* @__PURE__ */ K(Yp, [["__scopeId", "data-v-d0c4b012"]]), Ro = Co("/api/docks", "docks"), hw = Ro.fetchAll, fs = Ro.find, Jp = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ps = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), Zp = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Xp = (e) => e.kept ? ps("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : ps("keep", "pin", "Pin", `dock keep ${e.id}`), Qp = ["pin", "stop"], em = (e) => ({ ...e, iconOnly: Qp.includes(e.icon) });
function tm(e, t) {
  var n;
  return [
    ...Zp(e, t) ? [Xp(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Pt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ps("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(em);
}
const nm = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Jp(e, t),
  buttons: tm(e, t)
}), sm = { class: "dock-title" }, am = ["aria-expanded", "title"], om = { class: "chat-dock-acts dock-acts" }, rm = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, im = {
  key: 1,
  class: "dock-text"
}, lm = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = M(() => fs(s.item.type)), o = R(null), i = M(() => nm(s.item, a.value)), r = Ee(Oe), c = R(/* @__PURE__ */ new Set()), d = R("");
    async function h(S) {
      if (S.action === "open") return Ue(`${s.item.target_model}:${s.item.target_id}`);
      S.action === "declared" && (c.value = /* @__PURE__ */ new Set([...c.value, S.label])), d.value = "";
      const D = await Eo(S, s.item, r.environment);
      (D == null ? void 0 : D.ok) === !1 && (c.value = new Set([...c.value].filter((k) => k !== S.label)), d.value = D.error);
    }
    const m = M(() => i.value.buttons.filter((S) => S.action !== "undock" && !c.value.has(S.label))), b = M(() => i.value.buttons.find((S) => S.action === "undock"));
    return (S, j) => (l(), V(Bo, {
      label: i.value.title,
      folded: e.folded
    }, {
      edge: z(() => [
        e.leaving ? (l(), V(Io, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : $("", !0)
      ]),
      head: z(() => {
        var D, k, O;
        return [
          (D = a.value) != null && D.draws_head ? (l(), u("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), u(Y, { key: 1 }, [
            F(ye, {
              name: i.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", sm, v(i.value.title), 1)
          ], 64)),
          (k = a.value) != null && k.badge ? (l(), u("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, v(a.value.badge), 3)) : $("", !0),
          (O = a.value) != null && O.draws_head ? $("", !0) : (l(), u("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: j[0] || (j[0] = (A) => n("fold"))
          }, [
            F(Lt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, am)),
          p("span", om, [
            (l(!0), u(Y, null, oe(m.value, (A) => (l(), u(Y, {
              key: A.action + A.runs
            }, [
              A.iconOnly ? (l(), V(ke, {
                key: 0,
                kind: "icon",
                "aria-label": A.label,
                title: A.label,
                "data-dock-action": A.action,
                onClick: (G) => h(A)
              }, {
                default: z(() => [
                  F(ye, {
                    name: A.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (l(), V(ke, {
                key: 1,
                small: "",
                kind: A.primary ? "primary" : "ghost",
                bordered: !A.primary,
                "data-dock-action": A.action,
                onClick: (G) => h(A)
              }, {
                default: z(() => [
                  ue(v(A.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          F(xn, {
            title: b.value.label,
            "data-dock-action": "undock",
            onClick: j[1] || (j[1] = (A) => h(b.value))
          }, null, 8, ["title"])
        ];
      }),
      default: z(() => {
        var D, k;
        return [
          d.value ? (l(), u("p", rm, v(d.value), 1)) : $("", !0),
          e.item.text && !((D = a.value) != null && D.body_url) ? (l(), u("p", im, v(e.item.text), 1)) : $("", !0),
          (k = a.value) != null && k.body_url ? (l(), V(hs, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : $("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded"]));
  }
}, ga = /* @__PURE__ */ K(lm, [["__scopeId", "data-v-53b368f0"]]), cm = 6, um = 3, va = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, it = (e) => !!(e.leaves_at && !e.kept), dm = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!it(e) || t < e.leaves_at || n.has(e.id)), hm = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => dm(s, t, n)).sort((s, a) => s.id - a.id);
function fm(e, t, n = cm) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const pm = (e, t, n = e) => n < 2 ? !1 : e >= um ? !0 : t, mm = ["title", "aria-label"], gm = { class: "run-chip-in" }, vm = {
  key: 0,
  class: "run-chip-ring"
}, ym = { class: "run-chip-name" }, wm = { class: "run-chip-bar" }, km = "processes.output", bm = 5e3, $m = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var h;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((h = Ee(Oe, null)) == null ? void 0 : h.environment) ?? "", o = R(null), i = M(() => !o.value || o.value.state === "running" || o.value.state === "background"), r = M(() => {
      var m, b;
      return ((m = o.value) == null ? void 0 : m.title) || ((b = o.value) == null ? void 0 : b.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = M(() => i.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await Ot(km, ["process", "card", String(s.item.target_id)], a);
      m.ok && (o.value = m.value);
    }
    return Oo(d, () => i.value, bm), (m, b) => {
      var S;
      return l(), u("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: r.value,
        "aria-label": `${r.value}; show its card`,
        style: _e({ "--tone": c.value })
      }, [
        U(it)(e.item) ? (l(), V(Io, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : $("", !0),
        p("span", gm, [
          i.value ? (l(), u("span", vm)) : (l(), V(Ve, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", ym, v(r.value), 1)
        ]),
        p("span", wm, [
          p("i", {
            style: _e({ width: i.value ? `${((S = o.value) == null ? void 0 : S.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, mm);
    };
  }
}, xm = /* @__PURE__ */ K($m, [["__scopeId", "data-v-597b05d2"]]), _m = 24, Mm = 8, fw = 420;
function pw({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= _m && e > t ? !0 : e < t && a > Mm ? !1 : null;
}
const Sm = (e, t) => e === void 0 ? t : e, Em = {
  key: "runs-head",
  class: "dock-runs-head"
}, Cm = { class: "dock-runs-chips" }, Am = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = Qf(500), s = R(/* @__PURE__ */ new Set()), a = R(!1), o = R(!1), i = M(() => hm(t.items, n.value, s.value)), r = M(() => fm(i.value.filter((A) => va(A, fs)), n.value)), c = M(() => i.value.filter((A) => !r.value.includes(A) && !va(A, fs))), d = M(() => r.value.filter((A) => !it(A))), h = M(() => (a.value = pm(r.value.length, a.value, d.value.length)) && !o.value), m = R({}), b = (A) => Sm(m.value[A.id], t.folded);
    function S(A) {
      m.value = { ...m.value, [A.id]: !b(A) };
    }
    function j(A) {
      m.value = { ...m.value, ...Object.fromEntries(r.value.map((G) => [G.id, G.id !== A.id])) }, o.value = !0;
    }
    function D() {
      m.value = Object.fromEntries(Object.entries(m.value).filter(([A]) => !r.value.some((G) => String(G.id) === A))), o.value = !1;
    }
    function k(A) {
      s.value = /* @__PURE__ */ new Set([...s.value, A.id]);
    }
    function O(A) {
      s.value = new Set([...s.value].filter((G) => G !== A.id));
    }
    return (A, G) => (l(), V(Ea, {
      tag: "div",
      name: "dock",
      duration: U(To),
      class: "dock-stack"
    }, {
      default: z(() => [
        (l(!0), u(Y, null, oe(c.value, (y) => (l(), V(ga, {
          key: y.id,
          item: y,
          class: J({ timed: U(it)(y) }),
          leaving: U(it)(y) && !s.value.has(y.id),
          folded: b(y),
          onFold: (g) => S(y),
          onMouseenter: (g) => k(y),
          onMouseleave: (g) => O(y)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (l(), u("div", Em, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: D
          }, [
            ue(v(r.value.length) + " runs ", 1),
            F(Lt, { open: "" })
          ])
        ])) : $("", !0),
        (l(!0), u(Y, null, oe(h.value ? [] : r.value, (y) => (l(), V(ga, {
          key: y.id,
          item: y,
          class: J({ timed: U(it)(y) }),
          leaving: U(it)(y) && !s.value.has(y.id),
          folded: b(y),
          onFold: (g) => S(y),
          onMouseenter: (g) => k(y),
          onMouseleave: (g) => O(y)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        h.value ? (l(), V(Bo, {
          key: "runs-row",
          label: `${r.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: z(() => [
            p("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: G[0] || (G[0] = (y) => o.value = !0)
            }, [
              F(Ve, { name: "runs" }),
              ue(" " + v(r.value.length) + " runs ", 1),
              F(Lt)
            ]),
            p("span", Cm, [
              (l(!0), u(Y, null, oe(r.value, (y) => (l(), V(xm, {
                key: y.id,
                item: y,
                onClick: (g) => j(y)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : $("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, mw = /* @__PURE__ */ K(Am, [["__scopeId", "data-v-7081ac82"]]), At = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, nn = (e) => Math.min(Math.max(e, 0), 1), Om = (e) => {
  const t = nn(e);
  return t * t * (3 - 2 * t);
}, at = (e, t, n) => Om((e - t) / (n - t));
function gw(e) {
  const t = nn(e), n = nn((t - 0.12) / 0.76) * At.shuffles, s = Math.min(Math.floor(n), At.shuffles - 1), a = n - s, o = at(a, 0.26, 0.38) * (1 - at(a, 0.76, 0.96)), i = at(a, 0.38, 0.76), r = at(t, 0, 0.12) * (1 - at(t, 0.88, 1)), c = at(a, 0.2, 0.34) * (1 - at(a, 0.84, 1)), d = Math.sin(Math.PI * nn((a - 0.45) / 0.55)) ** 2;
  return { moved: i, across: (s + i) / At.shuffles, lift: At.lift * o, ready: r, weight: c, follow: d, shuffle: s, phase: a };
}
const Lo = 2400, Tm = 0.05;
function vw({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, Tm), i = Math.min(t + Lo * o, a), r = e + i * o;
  return r < n ? { y: r, speed: i, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
const Qe = {
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
}, ms = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Bm = (e) => e * e * (3 - 2 * e), pn = (e, [t, n]) => Bm(ms(e, t, n)), Im = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ze = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Jt = ([e, t], n) => e + n() * (t - e);
function Rm(e) {
  return Im.map(() => {
    const t = Jt(Ze.speed, e), n = Jt(Ze.angle, e) * Math.PI / 180, s = Jt(Ze.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Jt(Ze.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const Lm = Rm(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Dm(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ze.gravity * (t[2] - Ze.floor))) / Ze.gravity;
}
function yw(e, t, n = Lm) {
  const s = Qe.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], i = Dm(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= i + r) return null;
  const c = Math.min(a, i), d = s.from.map((h, m) => h + o.velocity[m] * c);
  return d[2] -= Ze.gravity * c * c / 2, { at: d, turn: o.spin * c, landed: Math.max(0, a - i) / r };
}
function ww(e, t) {
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
const kw = () => Array.from({ length: Qe.pogo.count }, (e, t) => Qe.pogo.bounce * (t + 1) / Qe.pogo.count), bw = { stride: 0.5 };
function Do(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: ms(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: ms(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function $w(e) {
  const { into: t, out: n } = Do(Qe.rope_swing, e);
  return 1 - pn(t, [0, 1]) * (1 - pn(n, [0, 1]));
}
function xw(e) {
  const t = Qe.rope_swing, { into: n, out: s } = Do(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return pn(n, [0, 1]) * (1 - pn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Nm = { after: 3 }, jm = 10, Pm = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, qm = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Wm = { weight: 19 }, Fm = {
  build: { cooldown: 180 }
}, Hm = { every: 120 }, No = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, jo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Um = {
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
}, Ft = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: jm }), ne = (e, t, n = {}) => Ft(e, "clip", t, n), Pn = (e, t, n = {}) => Ft(e, "look", t, n), ya = (e, t, n = {}) => Ft(e, "gaze", t, n), he = (e, t, n = {}, s = {}) => ({ ...Ft(e, "pick", t, n), ...s }), ve = (e) => Ft("nothing", "nothing", e, {}), zm = 120, Vm = 300, qn = (e, t) => ({ ...ne(e, t), cooldown: Vm }), Gm = 120, se = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Km = () => [ne("joy", 2)], ot = (e, t, n, s, a = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), rt = (e) => ({ ...e, cooldown: Pm[e.name] }), Ct = (e) => ({ ...e, shenanigan: !0, lasts: qm[e.name] }), Bs = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...se("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ne("nod", 2), ve(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...se("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...rt(ne("bug_shot", 3)), toward: "", onto: !1 },
    { ...rt(ne("bug_smash", 2)), toward: "", onto: !1 },
    ne("nod", 2)
  ]),
  ...se("tests_failed", { cooldown: 20, toward: "card" }, [ne("startled", 2), ne("dismay", 1), ne("tantrum", 3), ve(1)]),
  ...se("committed", { cooldown: 30, toward: "card", onto: !0 }, [ne("nod", 2), ve(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...se("sin_fixed", { cooldown: 300 }, [ne("halo", 1), ve(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...se("sin_committed", { cooldown: 300 }, [ne("repent", 1), ve(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...se("messaged", { cooldown: Gm }, [ne("phone_call", 1)]),
  ...se("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ne("nod", 4), ne("hand_rub", 4), ve(7)]),
  ...se("question_asked", { cooldown: 60 }, [ne("ask_sign", 9), ne("look_up", 3), ve(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...se("reported", { cooldown: 90 }, [ya("read", 3), ne("nod", 1), ve(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...se("read_message", { cooldown: 30 }, [ya("read", 3), ve(1)]),
  ...se("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), ve(6)]),
  ...se("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), ve(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...se("bar_done", { holds: !0 }, Km()),
  ...se("bar_failed", { holds: !0 }, [ne("fume", 1), ne("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...se("standing", { cooldown: 12 }, [ne("look_left", 2), ne("look_right", 2), ne("look_up", 1), ve(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...se("launched", { cooldown: 300 }, [ne("tumble", 3), ve(47)]),
  // a break from the hammering now and then
  ...se("building", { cooldown: 30 }, [ne("wipe_brow", 4), ne("look_left", 1), ne("look_right", 1), ve(69)]),
  ...se("failed", { cooldown: 20, toward: "card" }, [ne("shake", 3), ne("tantrum", 2), ve(2)]),
  ...se("refused", { cooldown: 20 }, [ne("shake", 1), ve(1)]),
  ...se("work_done", { cooldown: 120 }, [ne("stretch", 2), ve(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...se("pondering", { cooldown: [30, 60] }, [he("ponder", 1)]),
  ...se("thought_cloud", { cooldown: 90 }, [he("cloud", 1)]),
  ...se("light_bulb", { cooldown: 150 }, [he("bulb", 1)]),
  ...se("answered", { cooldown: 15 }, [Pn("amused", 3), ve(2)]),
  ...se("heard", { cooldown: 30 }, [
    ne("bow", 1, { voices: ["butler"] }),
    ne("salute", 1, { voices: ["squire"] }),
    ne("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ve(1)
  ]),
  ...se("long_walk", { cooldown: 90 }, [ne("stumble", 3), ve(22)]),
  ...se("card_arrived", { cooldown: 20, toward: "card" }, [ne("glance", 7), ve(13)]),
  ...se("typing", { cooldown: 60 }, [Pn("reading", 1), ve(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Um).flatMap(([e, t]) => se(`reacted:${e}`, {}, [Pn(t, 1)])),
  ...Object.entries(No).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => se(`agent_reacted:${n}`, {}, [ne(s, 1, { voices: [e] })])[0])),
  ...Object.entries(jo).flatMap(([e, t]) => se(`agent_reacted:${e}`, {}, [ne(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...se("pastime", {}, [
    ot("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    ot("rest", 3, 180, 120),
    ot("yawn", 2, 60, 60),
    ot("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    ot("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    ot("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    ot("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Ct(rt(ne("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Ct(rt(ne("disco", 2, { ball: "bubble" }))),
    ve(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...se("held:search", { cooldown: zm }, [qn("search", 3), { ...qn("binoculars", 2), when: { home: !0 } }, { ...qn("glass_bubble", 2), when: { bubble: !0 } }]),
  ...se("held:type", {}, [ne("type", 3), ne("type_ponder", 1)]),
  ...se("held:watch", {}, [ne("watch", 2), ne("wave_up", 1)]),
  ...se("held:compacting", {}, [ne("pack_box", 3), ne("vacuum", 2), ne("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...se("spell", {}, [he("writing", 12, { state: "writing" }), he("reading", 12, { state: "reading" }), he("searching", 12, { state: "searching" }), ve(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...se("tickled", {}, [{ ...rt(ne("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...se("eager", {}, [ne("eager", 2, { slow: !0 }), ve(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...se("jump", {}, [Ct(rt(ne("backflip", 7, { high: !0 }))), ne("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...se("climb", {}, [he("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...se("unit", { cooldown: Fm.build.cooldown }, [he("unit", Wm.weight), ve(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...se("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...se("carrier", {}, [he("ufo", 3), he("crane", 1)]),
  ...se("crane_from", {}, [he("left", 1), he("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...se("perch", {}, [{ ...he("hang", 1, { hands: !0, free: !0 }), cooldown: Hm.every }, he("stand", 5)]),
  // a digit a blow's dust lets out
  ...se("digit", {}, [he("0", 1), he("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...se("roam", {}, [
    he("rest", 35, {}, { stay: [25, 60] }),
    he("seat", 15, {}, { stay: [15, 40] }),
    he("edge", 25, {}, { stay: [8, 20] }),
    Ct(he("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    he("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    he("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    he("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    he("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    he("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Ct(rt(he("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...se("laptop", {}, [he("seat", 6, {}, { stay: [60, 150] }), he("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...se("ledge_at", {}, [he("middle", 2, {}, { along: 1 / 2 }), he("third", 1, {}, { along: 1 / 3 }), he("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...se("composed_as", {}, [
    he("facing", 4, {}, { turn: 0, leans: 0 }),
    he("turned_left", 1, {}, { turn: 335, leans: 0 }),
    he("turned_right", 1, {}, { turn: 25, leans: 0 }),
    he("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    he("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Ym = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Po = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Jm = (e) => Array.isArray(e) ? e[0] : e, Zm = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Xm(e) {
  var d;
  const t = e.has ?? (() => !0), n = (h) => e.now - (e.memory.get(h) ?? -1 / 0), s = (h) => !e.memory || Po(h).every(([m, b]) => n(m) >= Jm(b)), a = (h) => !h.shenanigan || h.lasts <= (e.room ?? 0), o = Bs.filter((h) => Ym(h.when, e) && (h.kind !== "clip" || t(h.name)) && s(h) && a(h)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= Nm.after && o.some((h) => h.shenanigan) ? o.filter((h) => h.shenanigan) : o, c = r.filter((h) => {
    var m;
    return h.kind === "nothing" || h.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return c.some((h) => h.kind !== "nothing") ? c : r;
}
function Qm(e, t) {
  const n = Xm(e);
  let s = t() * n.reduce((o, i) => o + i.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (qo(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function qo(e, t, n) {
  var s;
  for (const [a, o] of Po(t)) (s = e.memory) == null || s.set(a, e.now + Zm(o, n));
}
function _w(e, t, n) {
  qo(e, Bs.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const wa = {
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
}, Mw = {
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
}, Sw = 120, Ew = (e) => wa[e] || wa.idle;
[.../* @__PURE__ */ new Set([...Object.values(No).flatMap((e) => Object.keys(e)), ...Object.keys(jo)])];
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function Cw(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Re.ahead * n ? 180 : Math.sign(s) * Re.turn;
}
const ka = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Aw(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * s) / Re.line) + 1)), o = Math.max(t, 0), i = Math.floor(o / Re.sweep) % a, r = o % Re.sweep, c = Re.sweep - Re.returnSeconds, d = ka((r - c) / Re.returnSeconds), h = r <= c ? ka(r / c) : 1 - d, m = i + ((i + 1) % a - i) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * h, y: e.top + s + m * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const eg = 1, tg = (e, t, n, s, a, o = 0) => Qm({ moment: "jump", high: e > eg * t, memory: s, now: a, room: o }, n).name === "backflip", ba = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, Ow = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, Tw = { width: 24, height: 27, top: 3, units: 2 }, ng = "[data-figure-pile]", Bw = { amber: [1, 0.69, 0.125], good: ba.colours.good, bad: ba.colours.bad }, Wn = { phases: 4, dim: 0.25 }, Iw = (e, t, n) => e !== "amber" || (t + n) % Wn.phases < Wn.phases / 2 ? 1 : Wn.dim, sg = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Bs.filter((e) => sg.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const Rw = {
  width: 84,
  belly: 13,
  blink: 4
}, $a = "[data-figure-home]", Ht = () => {
  var t;
  const e = document.querySelector($a);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll($a)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, ag = "[data-figure-docked-bars]", og = "[data-figure-chat-foot]", rg = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", ig = "[data-figure-newest]";
function lg() {
  var s, a;
  const e = (s = Ht()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(ig), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var i, r;
      return !((i = o.closest) != null && i.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Is(o)) continue;
    const i = o.getBoundingClientRect();
    if (i.right > i.left && i.bottom > i.top) return i;
  }
  return null;
}
function Wo(e, t, n = lg()) {
  if (!e || !n) return !0;
  const s = $t(e, t), a = Rs(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Xe.top * t.size, bottom: s.top + Xe.bottom * t.size }, i = At.gap;
  return !Uo(o, { left: n.left - i, right: n.right + i, top: n.top - i, bottom: n.bottom + i });
}
const Fn = 0.26, cg = 0.54, En = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Fn, travels: "stand" },
  lounge: { drop: Fn, travels: "stand" },
  composed: { drop: Fn, travels: "stand" },
  hang: { drop: cg, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Fo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), ug = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Lw = (e, t) => (e === "sit" ? ug.has(t) : Fo.has(e)) ? e : "stand", Dw = 0.25, Nw = (e, t) => Fo.has(e) && En[t].drop === 0, Ho = 2, dg = 90, hg = 180, fg = 140, pg = 280, mg = 420, gg = 0.25, vg = 290, yg = 600, wg = "cubic-bezier(0.2, 0.7, 0.4, 1)", kg = "cubic-bezier(0.55, 0, 0.9, 0.6)", Hn = 5;
function mn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: i = !1, sprinting: r = !1, random: c = Math.random, memory: d = null, now: h = 0, room: m = 0, pogo: b = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Hn) return null;
  (i || r) && (o = Math.max(o, Ho));
  const S = o > 1, j = Math.abs(t.x - e.x), D = j < Hn ? 0 : j / (dg * o) * 1e3, k = Math.min(D, S ? fg : hg), O = Math.abs(t.y - e.y), A = t.y < e.y, G = A && !b && tg(O, n, c, d, h, m), y = A ? mg + Math.min(O, 400) * gg : Math.sqrt(2 * O / Lo) * 1e3, g = {
    x: t.x,
    y: t.y,
    ms: O > Hn ? G ? yg : y : 0,
    lead: G ? vg : A ? pg : 0,
    easing: A ? wg : kg,
    hopping: !0,
    clip: G ? "backflip" : A ? "jump" : "fall"
  }, B = { x: t.x, y: t.y, ms: D + k, lead: 0, easing: "linear", ramp: k, ...S ? { clip: "run" } : {} }, E = b ? bg(t, n) : g, P = A && !s ? [{ ...B, y: e.y }, E] : [{ ...g, x: e.x }, B];
  return { way: Math.sign(t.x - e.x) || 1, legs: P, lands: !a, pace: o, running: S };
}
const bg = (e, t) => ({ x: e.x, y: e.y, ms: Qe.pogo.frames / Qe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), $t = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - En[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Uo = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Is = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function xt() {
  var t;
  const e = (t = Ht()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Zt = 0.5, xa = 20;
function jw(e, t, n = xt()) {
  const s = $t(e, t);
  return s.left >= n.left + xa && s.right <= n.right - xa;
}
function zo(e, t, n = xt()) {
  const s = $t(e, t), a = s.right - s.left, o = Rs(e), [i, r] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return i >= n.left - Zt && r <= n.right + Zt && s.top >= n.top - Zt && c <= n.bottom + Zt;
}
const gn = [0.35, 0.5, 0.65], vn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Xe = { left: gn[0], right: gn.at(-1), top: vn[0], bottom: vn.at(-1) }, $g = 0.24;
function Rs(e) {
  if (e.posture === "stand") return { left: Xe.left, right: Xe.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + $g * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Xe.left, t), right: Math.max(Xe.right, t) };
}
function xg(e, { size: t }, n = xt()) {
  const s = Rs(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const _g = (Xe.right - Xe.left) / 2 + 0.08;
function Mg(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !Is(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, i = Math.min(a.startOffset, o.length - 1);
  for (const c of [i - 1, i].filter((d) => d >= 0)) {
    if (!o.data[c].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, c), d.setEnd(o, c + 1), [...d.getClientRects()].some((h) => e >= h.left && e <= h.right && t >= h.top && t <= h.bottom)) return !0;
  }
  return !1;
}
const Sg = (e) => vn.flatMap(
  (t) => gn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Eg(e, t, n = "") {
  if (!Wo(e, t)) return gn.length * vn.length;
  const s = $t(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(rg)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: c }) => c.width && c.height && Uo(a, c) && Is(r)).map(({ rect: r }) => r), i = (r, c) => o.some((d) => r >= d.left && r <= d.right && c >= d.top && c <= d.bottom);
  return Sg(a).filter(([r, c]) => i(r, c) || Mg(r, c, n)).length;
}
function Cg(e, t, n) {
  const s = xt(), a = (i) => n ? Math.hypot(i.x - n.x, i.y - n.y) : 0, o = e.filter((i) => zo(i, t, s) && Wo(i, t)).map((i) => ({ spot: i, covered: Eg(i, t), away: a(i) }));
  return o.length ? o.reduce(
    (i, r) => r.covered < i.covered || r.covered === i.covered && r.away < i.away ? r : i
  ).spot : null;
}
const Vo = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Ag = _g, Og = (e, t, { size: n }, s = Ag) => Tg(e, Vo[t], s * n, "stand");
function Tg(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Pw = (e) => ((e + 180) % 360 + 360) % 360 - 180, qw = { turns: [-20, -10, 0, 10, 20] }, Bg = 7;
function Ig() {
  const e = [...document.querySelectorAll(ng)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const Rg = 4;
function Lg() {
  const e = Go(), t = Ig(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Rg || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Bg - n, 0) } };
}
const Ww = ({ size: e, below: t }) => (1 - t) * e;
function Dg(e, t) {
  const n = xt(), { size: s, below: a } = t, o = En[e.posture].drop * s;
  return { ...xg(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Ng = (e, t) => Object.keys(Vo).map((n) => Dg(Og(e, n, t), t)), jg = (e, t, n) => Cg(e, t, n) ?? e[0];
function Fw(e, t) {
  const { element: n, edge: s } = Lg();
  return { ...jg(Ng(s, e), e, t), view: null, on: n };
}
function Go() {
  var s;
  const e = Ht(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(ag);
  if (!t) return { ...Ko(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Ko() {
  const e = Ht();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const Pg = { climb: 90 };
function Hw(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: i = !1, random: r = Math.random, via: c = [], memory: d = null, now: h = 0, room: m = 0, pogo: b = !1 } = {}) {
  (o || i) && (a = Math.max(a, Ho));
  const S = (G) => {
    const y = $t(G, n, En[G.posture].travels);
    return { x: y.left, y: y.top };
  }, j = t.ladder ?? e.ladder;
  if (j && !(t.ladder && e.ladder)) return qg(S(e), S(t), S({ ...j.foot, posture: "stand" }), j.way, !!t.ladder, n, a);
  const [D, ...k] = [e, ...c, t].map(S), O = mn(D, k[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: i, random: r, memory: d, now: h, room: m, pogo: b }), A = k.slice(1).map((G, y) => {
    var g;
    return (g = mn(k[y], G, n.size, { random: r, memory: d, now: h, room: m })) == null ? void 0 : g.legs.find((B) => B.hopping);
  });
  return O && { ...O, legs: [...O.legs, ...A.filter(Boolean)] };
}
function qg(e, t, n, s, a, o, i) {
  const r = (h, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - h.x, m.y - h.y) / Pg.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? mn(e, n, o.size, { pace: i }) : mn(n, t, o.size, { pace: i }), d = a ? [...(c == null ? void 0 : c.legs) ?? [], r(n, t)] : [r(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: i, running: i > 1 };
}
const Wg = "[data-figure-bubble]", Fg = 250;
let Tt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Yo = 0;
const Jo = () => Tt, Un = /* @__PURE__ */ new WeakMap();
let Hg = 0;
function Zo(e) {
  return Un.has(e) || Un.set(e, `floor-${++Hg}`), Un.get(e);
}
const Ug = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, zg = () => {
  var e, t;
  return ((t = (e = Ht()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Vg(e, t) {
  var s;
  const n = (s = e.querySelector(og)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Gg(e, t) {
  const n = e && Vg(e, t), s = e ? [...e.querySelectorAll(Wg)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: i }) => ({ element: o, kind: i, box: o.getBoundingClientRect() })).filter(({ kind: o, box: i }) => i.width > 0 && i.height > 0 && (o !== "bubble" || Ug(i, n))).map(({ element: o, kind: i, box: r }) => ({ id: Zo(o), kind: i, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Kg = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Fg ? (t.top - s.top) / a * 1e3 : 0;
};
function Yg(e = Tt, t = performance.now()) {
  const n = xt(), s = zg(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: i, edge: r } = Go(), c = [];
  o && c.push({ id: "home", kind: i ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = Ko();
  return d.element && c.push({ id: Zo(d.element), kind: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), c.push(...Gg(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((h) => Object.freeze({ ...h, vy: Kg(e, h, t) }))) });
}
const gs = /* @__PURE__ */ new Set();
function Jg(e) {
  return gs.add(e), () => gs.delete(e);
}
function Zg() {
  Xo();
  const e = () => {
    Yo = requestAnimationFrame(e), !document.hidden && (Tt = Yg(Tt), gs.forEach((t) => t(Tt)));
  };
  e();
}
function Xo() {
  cancelAnimationFrame(Yo);
}
const Xg = (e, t) => e.find((n) => n.id === t) ?? null;
function Uw(e, t, n = Jo().floors) {
  const s = Xg(n, "home");
  return e.posture === "hang" && s && $t(e, t).bottom >= s.top ? !1 : zo(e, t);
}
const Qg = ["data-kind"], e0 = { class: "figure-floor-name" }, t0 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), u("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: _e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", e0, v(e.floor.kind), 1)
    ], 12, Qg));
  }
}, n0 = /* @__PURE__ */ K(t0, [["__scopeId", "data-v-8f6132da"]]), s0 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, a0 = {
  __name: "FigureFloors",
  setup(e) {
    const t = yn(Jo().floors);
    let n = () => {
    };
    return je(() => {
      n = Jg((s) => t.value = s.floors), Zg();
    }), Ae(() => {
      n(), Xo();
    }), (s, a) => (l(), u("div", s0, [
      (l(!0), u(Y, null, oe(t.value, (o) => (l(), V(n0, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, zw = /* @__PURE__ */ K(a0, [["__scopeId", "data-v-e519168b"]]), zn = (e) => typeof e == "number" ? e : Date.parse(e);
function Vw(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: zn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => zn(a.row.created_at) - zn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const o0 = 3, Vn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function r0(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Vn[n.grouping]) == null ? void 0 : s.call(Vn, e.row, n)) || "";
}
function i0(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Gw(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= o0 ? [i0(s, t)] : s), s = [];
  };
  for (const i of e) {
    const r = r0(i, t);
    r !== a && o(), a = r, r ? s.push(i) : n.push(i);
  }
  return o(), n;
}
const l0 = 1e3;
function Kw() {
  const e = R(Date.now()), t = setInterval(() => e.value = Date.now(), l0);
  return kt(() => clearInterval(t)), e;
}
function Yw(e) {
  const t = wn(), n = R(null), s = R("");
  async function a(...o) {
    const i = await t.read(e(...o));
    s.value = i.ok ? "" : i.error, i.ok && (n.value = i.value);
  }
  return { value: n, failure: s, load: a };
}
const Xt = /* @__PURE__ */ new Map();
function c0(e, t) {
  if (Xt.has(e)) return Xt.get(e);
  const n = t().finally(() => Xt.delete(e));
  return Xt.set(e, n), n;
}
function Jw() {
  const e = wn(), t = R(null), n = R("");
  async function s() {
    const a = await c0(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const u0 = {
  class: "cards-page",
  "data-window-flush": ""
}, d0 = { class: "cards-bar" }, h0 = { class: "cards-count" }, f0 = { class: "cards" }, p0 = {
  key: 1,
  class: "cards-note"
}, m0 = {
  key: 2,
  class: "cards-note"
}, g0 = ["data-row", "onClick"], v0 = { class: "card-head" }, y0 = { class: "card-age" }, w0 = { class: "card-title" }, k0 = { class: "card-foot" }, b0 = {
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
    return (s, a) => (l(), u("div", u0, [
      p("div", d0, [
        p("span", h0, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        F(ke, et({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: z(() => [
            F(ye, {
              name: "plus",
              size: 12
            }),
            ue(" New " + v(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", f0, [
        e.loaded ? e.failure ? (l(), u("p", p0, v(e.failure), 1)) : e.rows.length ? $("", !0) : (l(), u("p", m0, "No " + v(e.noun) + "s yet", 1)) : (l(), V(bt, {
          key: 0,
          shape: "cards"
        })),
        (l(!0), u(Y, null, oe(e.rows, (o) => (l(), u("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (i) => n("open", o)
        }, [
          p("span", v0, [
            F(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ue(" " + v(e.head(o)), 1),
            p("span", y0, v(U(ts)(o.created_at)), 1)
          ]),
          p("span", w0, v(e.title(o)), 1),
          p("span", k0, v(e.foot(o)), 1)
        ], 8, g0))), 128))
      ]),
      me(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Zw = /* @__PURE__ */ K(b0, [["__scopeId", "data-v-d72d528d"]]), _a = "newest";
function Xw(e, { title: t, isOpen: n = null }) {
  const s = R(""), a = R(_a), o = R("all"), i = M(() => {
    const c = s.value.trim().toLowerCase(), d = e.value.filter((h) => (!c || JSON.stringify(h).toLowerCase().includes(c)) && (o.value === "all" || !n || n(h) === (o.value === "open")));
    return a.value === _a ? d : [...d].sort((h, m) => t(h).localeCompare(t(m)));
  }), r = M(() => !!s.value.trim() || !!n && o.value !== "all");
  return { words: s, order: a, state: o, shown: i, filtering: r, hasStates: !!n };
}
const $0 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, x0 = 40, _0 = "top", M0 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var m;
    const n = e, s = (m = Ee(Oe, null)) == null ? void 0 : m.autoScroll, a = M(() => s === _0), o = R(null), i = R(!1), r = (b) => a.value ? b.scrollTop : b.scrollHeight - b.scrollTop - b.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, d = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function h() {
      i.value = r(o.value) >= x0;
    }
    return $e(() => n.rowCount, async () => {
      await Nt(), !i.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (b, S) => (l(), u("div", $0, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: h
      }, [
        me(b.$slots, "default", {}, void 0, !0)
      ], 34),
      F(wt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: z(() => [
          tt(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: d
          }, [
            F(ye, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            S[0] || (S[0] = ue(" Newest ", -1))
          ], 512), [
            [pr, i.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Qw = /* @__PURE__ */ K(M0, [["__scopeId", "data-v-3accb764"]]), S0 = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, E0 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Ee(Oe, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, i) => (l(), u("div", S0, [
      (l(!0), u(Y, null, oe(U(s), (r) => {
        var c;
        return l(), V(ke, {
          key: r.key,
          kind: "text",
          class: J(["inner-tab", { on: ((c = e.active) == null ? void 0 : c.key) === r.key }]),
          "data-tab": r.key,
          onClick: (d) => n("choose", r)
        }, {
          default: z(() => [
            ue(v(r.label) + " " + v(e.answer[r.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, e2 = /* @__PURE__ */ K(E0, [["__scopeId", "data-v-cf3bb39f"]]), C0 = {}, A0 = { class: "menu-label" };
function O0(e, t) {
  return l(), u("span", A0, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const vs = /* @__PURE__ */ K(C0, [["render", O0], ["__scopeId", "data-v-aa955b3e"]]), T0 = {
  class: "search-bar",
  "data-search-bar": ""
}, B0 = { class: "search-bar-control" }, I0 = ["value", "placeholder", "aria-label"], R0 = ["aria-expanded"], L0 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var O;
    const s = e, a = n, o = mr(), i = ((O = Ee(Oe, null)) == null ? void 0 : O.search) ?? {}, r = M(() => i.placeholder || s.placeholder), c = i.context ?? [], d = R(null), h = R(null), m = R([]), b = M(() => m.value.length ? m.value[m.value.length - 1].next : c), S = M(() => !!o.menu || c.length > 0), j = (A) => {
      m.value = [], h.value = h.value ? null : A.currentTarget;
    };
    function D(A) {
      if (A.next.length) {
        m.value = [...m.value, A];
        return;
      }
      h.value = null, a("pick", A.click);
    }
    function k() {
      var A;
      a("update:modelValue", ""), (A = d.value) == null || A.focus();
    }
    return t({ focus: () => {
      var A;
      return (A = d.value) == null ? void 0 : A.focus();
    } }), (A, G) => (l(), u("div", T0, [
      p("div", B0, [
        F(ye, {
          class: "search-bar-icon",
          name: "search",
          size: 14
        }),
        p("input", {
          ref_key: "field",
          ref: d,
          class: "search-bar-input",
          type: "text",
          "data-search-input": "",
          value: e.modelValue,
          placeholder: r.value,
          "aria-label": r.value,
          onInput: G[0] || (G[0] = (y) => a("update:modelValue", y.target.value)),
          onKeydown: Bt(k, ["esc"])
        }, null, 40, I0),
        e.modelValue ? (l(), u("button", {
          key: 0,
          type: "button",
          class: "search-bar-clear",
          "data-search-clear": "",
          "aria-label": "Clear the search",
          onClick: k
        }, [
          F(ye, {
            name: "close",
            size: 12
          })
        ])) : $("", !0),
        S.value ? (l(), u("button", {
          key: 1,
          type: "button",
          class: "search-bar-menu",
          "data-search-menu": "",
          "aria-label": "Options",
          title: "Options",
          "aria-expanded": !!h.value,
          onClick: j
        }, [
          F(ye, {
            name: "caret",
            size: 12
          })
        ], 8, R0)) : $("", !0)
      ]),
      U(i).button ? (l(), u("button", {
        key: 0,
        type: "button",
        class: "search-bar-button",
        "data-search-button": "",
        onClick: G[1] || (G[1] = (y) => a("pick", U(i).button.click))
      }, v(U(i).button.title), 1)) : $("", !0),
      me(A.$slots, "default", {}, void 0, !0),
      h.value ? (l(), V(Ts, {
        key: 1,
        anchor: h.value,
        align: "end",
        "min-width": 220,
        "max-width": 320,
        onClick: G[3] || (G[3] = xe(() => {
        }, ["stop"])),
        onClose: G[4] || (G[4] = (y) => h.value = null)
      }, {
        default: z(() => [
          m.value.length ? (l(), V(yt, {
            key: 0,
            "data-search-back": "",
            onClick: G[2] || (G[2] = (y) => m.value = m.value.slice(0, -1))
          }, {
            default: z(() => [
              ue("‹ " + v(m.value[m.value.length - 1].title), 1)
            ]),
            _: 1
          })) : $("", !0),
          (l(!0), u(Y, null, oe(b.value, (y) => (l(), V(yt, {
            key: y.title,
            description: y.subtext,
            "data-search-entry": y.title,
            onClick: (g) => D(y)
          }, {
            default: z(() => [
              ue(v(y.title) + v(y.next.length ? " ›" : ""), 1)
            ]),
            _: 2
          }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
          m.value.length ? $("", !0) : me(A.$slots, "menu", {}, void 0, !0, 1)
        ]),
        _: 3
      }, 8, ["anchor"])) : $("", !0)
    ]));
  }
}, D0 = /* @__PURE__ */ K(L0, [["__scopeId", "data-v-4c3315ae"]]), N0 = {
  class: "list-tools",
  "data-list-tools": ""
}, j0 = {
  __name: "ListTools",
  props: { tools: { type: Object, required: !0 }, placeholder: { type: String, default: "Search" } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ];
    return (o, i) => (l(), u("div", N0, [
      F(D0, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": i[0] || (i[0] = (r) => e.tools.words.value = r),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": "",
        onPick: i[1] || (i[1] = (r) => n("pick", r))
      }, {
        menu: z(() => [
          F(vs, null, {
            default: z(() => [...i[2] || (i[2] = [
              ue("Order", -1)
            ])]),
            _: 1
          }),
          (l(), u(Y, null, oe(s, (r) => F(yt, {
            key: r.key,
            checked: e.tools.order.value === r.key,
            "data-list-order": r.key,
            onClick: (c) => e.tools.order.value = r.key
          }, {
            default: z(() => [
              ue(v(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (l(), u(Y, { key: 0 }, [
            F(vs, null, {
              default: z(() => [...i[3] || (i[3] = [
                ue("Show", -1)
              ])]),
              _: 1
            }),
            (l(), u(Y, null, oe(a, (r) => F(yt, {
              key: r.key,
              checked: e.tools.state.value === r.key,
              "data-list-state": r.key,
              onClick: (c) => e.tools.state.value = r.key
            }, {
              default: z(() => [
                ue(v(r.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : $("", !0)
        ]),
        default: z(() => [
          me(o.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, t2 = /* @__PURE__ */ K(j0, [["__scopeId", "data-v-24c1740c"]]);
function n2() {
  const e = R(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const P0 = 86400, ys = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function q0(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ys(t) - ys(e)) / P0);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function s2(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ys(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: q0(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Gn = 280, Kn = 240, Yn = 120, W0 = 6, F0 = 14, Dt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function H0(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Qo(e, t) {
  const n = Math.max(0, H0(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function U0(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const i = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${F0}px)` }), e.offsetHeight, e.style.transition = `height ${Gn}ms ${Dt}`, e.style.height = `${i}px`;
  const r = a();
  let c = !1;
  const d = () => {
    n() && (t.scrollTop = Qo(t, e));
    const h = a() - r;
    if (!c && h >= Gn && (c = !0, e.style.transition = `opacity ${Kn}ms ease-out, transform ${Kn}ms ${Dt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), h < Gn + Kn) return s(d);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(d);
}
function a2(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${W0}px)` }), e.offsetHeight, e.style.transition = `opacity ${Yn}ms ease-out, transform ${Yn}ms ${Dt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const i = a(), r = () => {
    if (n() && (t.scrollTop = Qo(t, e)), a() - i < Yn) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const z0 = 140, Qt = 220, V0 = 5;
function o2({ gap: e = z0, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, V0);
    if (s = r.length > 0, !s) return;
    let c = r.length;
    for (const d of r)
      d.el.style.display = d.display, d.arrival(d.el, d.options, () => {
        d.done(), c -= 1, c || t(o, e);
      });
  }
  const i = (r, c, d, h = U0) => {
    if (!c.pane || !c.follows()) return d();
    const m = { el: r, options: c, done: d, arrival: h, display: r.style.display || "" };
    if (!s)
      return s = !0, h(r, c, () => a(m));
    r.style.display = "none", n.push(m);
  };
  return i.flush = () => {
    for (const r of n.splice(0))
      r.el.style.display = r.display, r.done();
  }, i;
}
function r2(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Qt}ms ${Dt}, opacity ${Qt}ms ease-in, margin ${Qt}ms ${Dt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Qt);
}
const er = "chat.pins.minimised", sn = R(It(er, !1));
function Ma(e) {
  sn.value = e, kn(er, e);
}
function G0(e) {
  const t = M(() => e()), n = M(() => sn.value ? [] : e()), s = () => Ma(!sn.value), a = Date.now() / 1e3;
  return $e(
    () => t.value.filter((o) => Fa(o) > a).length,
    (o, i) => o > i && Ma(!1)
  ), { pins: t, visible: n, minimised: sn, toggle: s };
}
const K0 = ["title"], Y0 = {
  key: 0,
  class: "pins-count"
}, J0 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = G0(() => t.pinRows);
    return (o, i) => U(n).length ? (l(), u("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: U(s), inline: e.inline }]),
      title: U(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: i[0] || (i[0] = xe((...r) => U(a) && U(a)(...r), ["stop"]))
    }, [
      F(ye, {
        name: U(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      U(s) ? (l(), u("span", Y0, v(U(n).length), 1)) : $("", !0)
    ], 10, K0)) : $("", !0);
  }
}, i2 = /* @__PURE__ */ K(J0, [["__scopeId", "data-v-d073c504"]]), Z0 = ["title"], X0 = ["title"], Q0 = { class: "diff-card-dir" }, ev = { class: "diff-card-name" }, tv = { class: "diff-card-ago" }, nv = ["title"], sv = ["title"], av = {
  key: 0,
  class: "diff-card-note"
}, ov = ["href"], rv = ["src", "alt"], iv = { class: "diff-card-rows" }, lv = { class: "diff-row-num" }, cv = { class: "diff-row-sign" }, uv = { class: "diff-row-code" }, dv = {
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
    function o(C) {
      (C.metaKey || C.ctrlKey) && (C.stopPropagation(), s("open", n.path));
    }
    const i = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, c = M(() => n.path.lastIndexOf("/") + 1), d = M(() => n.path.slice(0, c.value)), h = M(() => n.path.slice(c.value)), m = M(() => n.kind === "deleted"), b = M(() => i[n.kind]), S = M(() => new Set(n.rows.filter((C) => C.line_type === "add").map((C) => C.line))), j = R("after"), D = M(() => j.value === "before" ? n.whole.old : n.whole.text), k = M(() => n.whole && n.whole.text !== void 0 ? D.value.split(`
`).map((C, w) => ({ line_type: j.value === "after" && S.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: C })) : n.rows.filter(
      (C) => !(n.editsOnly && ["ctx", "fold"].includes(C.line_type)) && !(n.hideRemovals && C.line_type === "del")
    )), O = R(!1), A = M(() => n.lines && !O.value && !n.whole), G = M(() => A.value ? k.value.slice(0, n.lines) : k.value), y = M(() => k.value.length - G.value.length), g = (C) => C.line === null || C.line_type === "del" ? "" : C.line, B = (C) => C.line_type === "fold" ? C.hidden ? `⋯ ${C.hidden} lines` : "⋯" : C.text, E = R(null), P = R(null);
    let x = null;
    return je(() => {
      if (!P.value) return;
      let C = !0;
      x = new ResizeObserver(() => {
        !E.value || !P.value || (E.value.style.transition = C ? "none" : "", E.value.style.height = `${P.value.offsetHeight}px`, C = !1);
      }), x.observe(P.value);
    }), Ae(() => x && x.disconnect()), (C, w) => (l(), u("section", {
      class: J(["diff-card", { half: e.half, gone: m.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: m.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (f) => !m.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${U(a)}-click to open it`,
          onClick: o
        }, [
          p("span", Q0, v(d.value), 1),
          p("span", ev, v(h.value), 1),
          b.value ? (l(), u("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, v(b.value), 3)) : $("", !0)
        ], 8, X0),
        p("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        p("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        p("span", tv, v(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (l(), u("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: j.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = xe((f) => j.value = j.value === "after" ? "before" : "after", ["stop"]))
        }, v(j.value === "after" ? "After" : "Before"), 9, nv)) : $("", !0),
        m.value ? $("", !0) : (l(), u("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = xe((f) => s("whole"), ["stop"]))
        }, [
          F(ye, {
            name: "file",
            size: 12
          })
        ], 10, sv))
      ], 8, Z0),
      e.whole && e.whole.error ? (l(), u("p", av, v(e.whole.error), 1)) : $("", !0),
      !m.value && !e.folded ? (l(), u(Y, { key: 1 }, [
        e.picture ? (l(), u("a", {
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
          }, null, 8, rv)
        ], 8, ov)) : (l(), u("div", {
          key: 1,
          ref_key: "grow",
          ref: E,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: P,
            class: "diff-card-diff"
          }, [
            p("div", iv, [
              (l(!0), u(Y, null, oe(G.value, (f, T) => (l(), u("div", {
                key: T,
                class: J(["diff-row", f.line_type, { fresh: e.fresh && f.edit === e.fresh }])
              }, [
                p("span", lv, v(g(f)), 1),
                p("span", cv, v(r[f.line_type]), 1),
                p("span", uv, v(B(f)), 1)
              ], 2))), 128)),
              y.value > 0 ? (l(), u("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = xe((f) => O.value = !0, ["stop"]))
              }, v(y.value) + " more " + v(y.value === 1 ? "line" : "lines"), 1)) : $("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : $("", !0)
    ], 2));
  }
}, l2 = /* @__PURE__ */ K(dv, [["__scopeId", "data-v-b6424f6e"]]), hv = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), V(ke, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: z(() => [
        F(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, fv = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [{ word: "approve", label: "Approve", main: !0 }, He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, pv = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, mv = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], gv = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], vv = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], yv = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], wv = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], kv = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? wv(t) : e === "agent" ? [...vv(t), ...gv(t)] : e === "check" ? yv(t) : e === "question" ? mv(t) : ((n = { plan: fv, task: pv }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, bv = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, $v = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, xv = { class: "ask-text" }, _v = ["placeholder", "aria-label"], Mv = ["placeholder", "aria-label"], Sv = {
  key: 3,
  class: "moves"
}, Ev = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = M(() => kv(s.kind, s.row)), i = R(""), r = R(null), c = R(""), d = R("");
    $e(() => s.id, () => {
      i.value = "", r.value = null;
    });
    async function h(S, j = "") {
      const D = await s.read([S.noun ?? s.kind, S.word, String(s.id), ...S.flag ? [S.flag, j] : S.positional ? [j] : [], ...S.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      i.value = D.ok ? "" : D.error, D.ok && (r.value = null, c.value = "", d.value = "", a("done"));
    }
    const m = (S) => S.confirm ? r.value = S : S.said ? h(S, S.said) : S.flag || S.positional ? (r.value = S, c.value = "") : h(S), b = () => c.value.trim() && h(r.value, c.value.trim());
    return t({ moves: o, press: m }), (S, j) => {
      var D;
      return o.value.length ? (l(), u("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        i.value ? (l(), u("p", bv, v(i.value), 1)) : $("", !0),
        (D = r.value) != null && D.confirm ? (l(), u("div", $v, [
          p("span", xv, v(r.value.confirm), 1),
          F(ke, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: j[0] || (j[0] = (k) => h(r.value))
          }, {
            default: z(() => [
              ue(v(r.value.label), 1)
            ]),
            _: 1
          }),
          F(ke, {
            small: "",
            kind: "ghost",
            onClick: j[1] || (j[1] = (k) => r.value = null)
          }, {
            default: z(() => [...j[7] || (j[7] = [
              ue("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (l(), u("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: xe(b, ["prevent"])
        }, [
          tt(p("input", {
            "onUpdate:modelValue": j[2] || (j[2] = (k) => c.value = k),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: j[3] || (j[3] = Bt(xe((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, _v), [
            [Qn, c.value]
          ]),
          r.value.opener ? tt((l(), u("input", {
            key: 0,
            "onUpdate:modelValue": j[4] || (j[4] = (k) => d.value = k),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: j[5] || (j[5] = Bt(xe((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, Mv)), [
            [Qn, d.value]
          ]) : $("", !0),
          F(ke, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: z(() => [
              ue(v(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(ke, {
            small: "",
            kind: "ghost",
            onClick: j[6] || (j[6] = (k) => r.value = null)
          }, {
            default: z(() => [...j[8] || (j[8] = [
              ue("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), u("div", Sv, [
          (l(!0), u(Y, null, oe(o.value, (k) => (l(), V(ke, {
            key: k.word,
            small: "",
            kind: k.main ? "primary" : "ghost",
            "data-move": k.word,
            onClick: (O) => m(k)
          }, {
            default: z(() => [
              ue(v(k.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : $("", !0);
    };
  }
}, Cv = /* @__PURE__ */ K(Ev, [["__scopeId", "data-v-fffa0bf6"]]), Av = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, Ov = { ...Av, done: "Completed" }, Tv = { class: "task-status-icon" }, Bv = ["width", "height", "aria-label"], Iv = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), u("span", Tv, [
      F(wt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: z(() => [
          (l(), u("svg", {
            key: e.status,
            class: J(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": U(Ov)[e.status]
          }, [
            F(xs, { value: e.status }, {
              blocked: z(() => [...n[0] || (n[0] = [
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
              done: z(() => [...n[1] || (n[1] = [
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
              started: z(() => [...n[2] || (n[2] = [
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
              asked: z(() => [...n[3] || (n[3] = [
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
              paused: z(() => [...n[4] || (n[4] = [
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
              planned: z(() => [...n[5] || (n[5] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: z(() => [...n[6] || (n[6] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Bv))
        ]),
        _: 1
      })
    ]));
  }
}, tr = /* @__PURE__ */ K(Iv, [["__scopeId", "data-v-2ab7e404"]]), Rv = /* @__PURE__ */ new Set(["completed", "cancelled"]), Lv = (e) => Rv.has(e), nr = (e) => Lv(e) ? "done" : e, Dv = { class: "facts" }, Nv = { class: "fact wide" }, jv = { class: "fact-value" }, Pv = {
  key: 0,
  class: "fact"
}, qv = { class: "fact-value" }, Wv = {
  key: 1,
  class: "fact"
}, Fv = { class: "fact-value" }, Hv = { class: "fact wide" }, Uv = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, zv = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = dn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var i, r;
      return l(), u("div", Dv, [
        p("div", Nv, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", jv, v((i = e.place) != null && i.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((r = e.place) == null ? void 0 : r.phase_total) > 1 ? (l(), u("div", Pv, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", qv, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : $("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), u("div", Wv, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", Fv, "Agent " + v(e.task.holder_id), 1)
        ])) : $("", !0),
        p("div", Hv, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          F(of, {
            options: U(n),
            value: String(U(ko)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), u("p", Uv, v(e.refusal), 1)) : $("", !0)
        ])
      ]);
    };
  }
}, Vv = /* @__PURE__ */ K(zv, [["__scopeId", "data-v-2018762d"]]), Gv = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, Kv = ["onClick"], Yv = { class: "wait-id" }, Jv = { class: "wait-title" }, Zv = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Xv = { class: "text" }, Qv = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, ey = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, ty = 180, ny = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = R(!1);
    return (a, o) => (l(), u(Y, null, [
      e.task.waits.length ? (l(), u("section", Gv, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (l(!0), u(Y, null, oe(e.task.waits, (i) => (l(), u("button", {
          key: i.id,
          type: "button",
          class: "wait",
          onClick: (r) => n("select", i.id)
        }, [
          F(tr, {
            status: U(nr)(i.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", Yv, v(i.id), 1),
          p("span", Jv, v(i.title), 1)
        ], 8, Kv))), 128))
      ])) : $("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), u("section", Zv, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", Xv, v(e.task.outcome), 1)
      ])) : $("", !0),
      e.task.brief ? (l(), u("section", Qv, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: J(["text", { clamped: !s.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > ty && !s.value ? (l(), u("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (i) => s.value = !0)
        }, "Show the whole brief")) : $("", !0)
      ])) : $("", !0),
      e.task.logs.length ? (l(), u("section", ey, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), u(Y, null, oe(e.task.logs, (i) => (l(), u("p", {
          key: i.id,
          class: "log"
        }, v(i.line), 1))), 128))
      ])) : $("", !0)
    ], 64));
  }
}, sy = /* @__PURE__ */ K(ny, [["__scopeId", "data-v-f411ce35"]]), ay = { class: "comment-side-head" }, oy = {
  key: 0,
  class: "comment-none"
}, ry = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), u("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", ay, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        F(xn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? $("", !0) : (l(), u("p", oy, "No comments yet")),
      (l(!0), u(Y, null, oe(e.comments, (s) => (l(), u("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, v(e.words(s)), 1))), 128))
    ], 2));
  }
}, iy = /* @__PURE__ */ K(ry, [["__scopeId", "data-v-19fdbdd4"]]), ly = ["data-comments-below"], cy = 600, uy = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = R(null), n = R(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < cy);
    return je(() => s.observe(t.value)), kt(() => s.disconnect()), (a, o) => (l(), u("div", {
      ref_key: "root",
      ref: t,
      class: J(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      me(a.$slots, "default"),
      e.open ? (l(), V(iy, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (i) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : $("", !0)
    ], 10, ly));
  }
}, dy = /* @__PURE__ */ K(uy, [["__scopeId", "data-v-6c850df0"]]), hy = ["placeholder"], fy = { class: "actions" }, py = { class: "error" }, my = {
  key: 1,
  class: "card closed"
}, gy = { class: "mark" }, vy = { class: "prompt" }, yy = {
  key: 0,
  class: "draft"
}, wy = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Xn({
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
  emits: /* @__PURE__ */ Xn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Zn(e, "draft"), i = Zn(e, "error"), r = R(!!i.value), c = R(!1), d = R(!1), h = R(null);
    async function m() {
      var D, k;
      r.value = !0, c.value = !1, await Nt(), (k = ((D = h.value) == null ? void 0 : D.querySelector("input")) || h.value) == null || k.focus();
    }
    function b() {
      r.value = !1, i.value = "";
    }
    function S(D) {
      D.shiftKey || D.isComposing || (D.preventDefault(), j());
    }
    async function j() {
      const D = o.value.trim();
      if (!(!D || !s.ready || d.value)) {
        i.value = "", d.value = !0, o.value = "";
        try {
          await s.send(D), r.value = !1, c.value = !0;
        } catch (k) {
          o.value = D, i.value = k.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: m }), (D, k) => (l(), u("div", {
      class: J(["comment-bar", { open: r.value }])
    }, [
      r.value ? (l(), u("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(j, ["prevent"]),
        onKeydown: Bt(b, ["esc"])
      }, [
        me(D.$slots, "who", {}, void 0, !0),
        tt(p("textarea", {
          ref_key: "box",
          ref: h,
          "onUpdate:modelValue": k[0] || (k[0] = (O) => o.value = O),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Bt(S, ["enter"])
        }, null, 40, hy), [
          [Qn, o.value]
        ]),
        p("div", fy, [
          p("span", py, v(i.value), 1),
          F(ke, {
            small: "",
            onClick: b
          }, {
            default: z(() => [...k[2] || (k[2] = [
              ue("Cancel", -1)
            ])]),
            _: 1
          }),
          F(ke, {
            kind: "primary",
            small: "",
            busy: d.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: j
          }, {
            default: z(() => [...k[3] || (k[3] = [
              ue("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (l(), u("div", my, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          p("span", gy, [
            F(ye, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", vy, v(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), u("span", yy, "Draft kept")) : $("", !0)
        ]),
        e.count ? (l(), u("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[1] || (k[1] = (O) => a("show"))
        }, [
          p("span", null, v(U(ji)(e.count, "comment")), 1),
          F(ye, {
            name: "down",
            size: 12
          })
        ])) : $("", !0)
      ]))
    ], 2));
  }
}, ky = /* @__PURE__ */ K(wy, [["__scopeId", "data-v-79db0c2d"]]);
function by(e, t) {
  const n = R([]), s = R(!1);
  let a = 0, o = 0;
  const i = (d) => {
    const { kind: h, id: m, title: b } = e(), S = `On ${h} ${m}, ${b}: `;
    return d.text.startsWith(S) ? d.text.slice(S.length) : d.text;
  };
  async function r() {
    const { kind: d, id: h } = e();
    if (!h) return;
    const m = ++o, b = await t([d, "comments", String(h)]);
    m === o && (n.value = b.ok ? b.value.rows ?? [] : []);
  }
  async function c(d) {
    const { kind: h, id: m } = e(), b = { id: `sending-${++a}`, text: d };
    n.value = [...n.value, b], s.value = !0;
    const S = await t([h, "comment", String(m), d]);
    if (!S.ok)
      throw n.value = n.value.filter((j) => j !== b && j.id !== b.id), new Error(S.error);
    await r();
  }
  return $e(() => e().id, () => {
    s.value = !1, n.value = [], r();
  }, { immediate: !0 }), { comments: n, open: s, words: i, send: c, load: r };
}
const $y = { class: "top" }, xy = {
  class: "crumb",
  "data-task-crumb": ""
}, _y = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, My = {
  key: 1,
  class: "body"
}, Sy = { class: "stamp" }, Ey = {
  class: "title",
  "data-resource-title": ""
}, Cy = { class: "since" }, Ay = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Oy = { class: "text" }, Ty = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, By = {
  key: 1,
  class: "note"
}, Iy = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Ry = { class: "text" }, Ly = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = R(null), i = R(null), r = R(""), c = R(""), d = R(null), h = R(null), m = by(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (y) => s.read(y));
    $e(m.open, (y) => a("comments", y));
    let b = 0;
    const S = nr, j = (y) => y.slice(0, 1).toUpperCase() + y.slice(1), D = M(() => {
      var y;
      return (y = i.value) != null && y.plan_id ? i.value.phase_total > 1 ? `Plan ${i.value.plan_id} › Phase ${i.value.phase_number}: ${i.value.phase_title}` : `Plan ${i.value.plan_id}: ${i.value.plan_title}` : "Not in a plan";
    });
    async function k() {
      const y = ++b, [g, B] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      y === b && (r.value = g.ok ? "" : g.error, o.value = g.ok ? g.value : null, i.value = B.ok ? B.value : null);
    }
    $e(() => s.id, () => {
      o.value = null, i.value = null, d.value = null, k();
    }, { immediate: !0 }), $e(() => s.changes, k);
    async function O(y) {
      const g = o.value.priority;
      o.value.priority = Number(y);
      const B = await s.read(["task", "edit", String(s.id), "--priority", y]);
      if (c.value = B.ok ? "" : B.error, B.ok) return k();
      o.value.priority = g;
    }
    function A(y) {
      d.value = null, h.value.press(y);
    }
    const G = (y) => {
      var g;
      return ((g = h.value) == null ? void 0 : g.moves.length) && (d.value = y);
    };
    return t({ openStatus: G }), (y, g) => (l(), u("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", $y, [
        e.backed ? (l(), V(hv, {
          key: 0,
          onBack: g[0] || (g[0] = (B) => a("back"))
        })) : $("", !0),
        p("span", xy, v(D.value), 1),
        g[9] || (g[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), u(Y, { key: 1 }, [
          F(ke, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: g[1] || (g[1] = (B) => a("step", -1))
          }, {
            default: z(() => [
              F(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          F(ke, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: g[2] || (g[2] = (B) => a("step", 1))
          }, {
            default: z(() => [
              F(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : $("", !0),
        F(ke, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: g[3] || (g[3] = (B) => a("close"))
        }, {
          default: z(() => [
            F(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      r.value ? (l(), u("p", _y, v(r.value), 1)) : o.value ? (l(), u(Y, { key: 2 }, [
        F(dy, {
          open: U(m).open.value,
          comments: U(m).comments.value,
          words: U(m).words,
          onClose: g[6] || (g[6] = (B) => U(m).open.value = !1)
        }, {
          default: z(() => {
            var B;
            return [
              (l(), u("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", Sy, "Task " + v(o.value.id) + " · updated " + v(U(ts)(U(ln)(o.value)) || "just now"), 1),
                p("h3", Ey, v(o.value.title), 1),
                p("div", {
                  class: J(["state-line", U(S)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: g[4] || (g[4] = (E) => G(E.currentTarget))
                  }, [
                    F(tr, {
                      status: U(S)(o.value.state)
                    }, null, 8, ["status"]),
                    ue(" " + v(j(o.value.state)), 1)
                  ]),
                  p("span", Cy, "since " + v(U(ts)(U(ln)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), u("section", Ay, [
                  g[10] || (g[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", Oy, v(o.value.reason || "Other tasks"), 1),
                  (B = o.value.openers) != null && B.length ? (l(), u("p", Ty, "Opens by itself when " + v(o.value.openers.join(" or ")) + ".", 1)) : (l(), u("p", By, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), u("section", Iy, [
                  g[11] || (g[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", Ry, v(o.value.reason), 1)
                ])) : $("", !0),
                F(Vv, {
                  task: o.value,
                  place: i.value,
                  refusal: c.value,
                  onPriority: O
                }, null, 8, ["task", "place", "refusal"]),
                F(sy, {
                  task: o.value,
                  onSelect: g[5] || (g[5] = (E) => a("select", E))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        F(ky, {
          send: U(m).send,
          count: U(m).comments.value.length,
          onShow: g[7] || (g[7] = (B) => U(m).open.value = !U(m).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), u("div", My, [
        F(bt)
      ])),
      F(Cv, {
        ref_key: "footer",
        ref: h,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: k
      }, null, 8, ["id", "row", "read"]),
      d.value ? (l(), V(Ts, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: g[8] || (g[8] = (B) => d.value = null)
      }, {
        default: z(() => [
          F(vs, null, {
            default: z(() => [
              ue("Change the status of task " + v(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), u(Y, null, oe(h.value.moves, (B) => (l(), V(yt, {
            key: B.word,
            onClick: (E) => A(B)
          }, {
            default: z(() => [
              ue(v(B.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : $("", !0)
    ], 2));
  }
}, c2 = /* @__PURE__ */ K(Ly, [["__scopeId", "data-v-c76befc4"]]);
function Dy(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Jn = { exports: {} }, Sa;
function Ny() {
  return Sa || (Sa = 1, (function(e, t) {
    var n = (function() {
      var s = function(g, B) {
        var E = 236, P = 17, x = g, C = o[B], w = null, f = 0, T = null, I = [], q = {}, ie = function(L, N) {
          f = x * 4 + 17, w = (function(_) {
            for (var W = new Array(_), H = 0; H < _; H += 1) {
              W[H] = new Array(_);
              for (var Q = 0; Q < _; Q += 1)
                W[H][Q] = null;
            }
            return W;
          })(f), ce(0, 0), ce(f - 7, 0), ce(0, f - 7), te(), ee(), Te(L, N), x >= 7 && X(L), T == null && (T = sr(x, C, I)), We(T, N);
        }, ce = function(L, N) {
          for (var _ = -1; _ <= 7; _ += 1)
            if (!(L + _ <= -1 || f <= L + _))
              for (var W = -1; W <= 7; W += 1)
                N + W <= -1 || f <= N + W || (0 <= _ && _ <= 6 && (W == 0 || W == 6) || 0 <= W && W <= 6 && (_ == 0 || _ == 6) || 2 <= _ && _ <= 4 && 2 <= W && W <= 4 ? w[L + _][N + W] = !0 : w[L + _][N + W] = !1);
        }, fe = function() {
          for (var L = 0, N = 0, _ = 0; _ < 8; _ += 1) {
            ie(!0, _);
            var W = r.getLostPoint(q);
            (_ == 0 || L > W) && (L = W, N = _);
          }
          return N;
        }, ee = function() {
          for (var L = 8; L < f - 8; L += 1)
            w[L][6] == null && (w[L][6] = L % 2 == 0);
          for (var N = 8; N < f - 8; N += 1)
            w[6][N] == null && (w[6][N] = N % 2 == 0);
        }, te = function() {
          for (var L = r.getPatternPosition(x), N = 0; N < L.length; N += 1)
            for (var _ = 0; _ < L.length; _ += 1) {
              var W = L[N], H = L[_];
              if (w[W][H] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var re = -2; re <= 2; re += 1)
                    Q == -2 || Q == 2 || re == -2 || re == 2 || Q == 0 && re == 0 ? w[W + Q][H + re] = !0 : w[W + Q][H + re] = !1;
            }
        }, X = function(L) {
          for (var N = r.getBCHTypeNumber(x), _ = 0; _ < 18; _ += 1) {
            var W = !L && (N >> _ & 1) == 1;
            w[Math.floor(_ / 3)][_ % 3 + f - 8 - 3] = W;
          }
          for (var _ = 0; _ < 18; _ += 1) {
            var W = !L && (N >> _ & 1) == 1;
            w[_ % 3 + f - 8 - 3][Math.floor(_ / 3)] = W;
          }
        }, Te = function(L, N) {
          for (var _ = C << 3 | N, W = r.getBCHTypeInfo(_), H = 0; H < 15; H += 1) {
            var Q = !L && (W >> H & 1) == 1;
            H < 6 ? w[H][8] = Q : H < 8 ? w[H + 1][8] = Q : w[f - 15 + H][8] = Q;
          }
          for (var H = 0; H < 15; H += 1) {
            var Q = !L && (W >> H & 1) == 1;
            H < 8 ? w[8][f - H - 1] = Q : H < 9 ? w[8][15 - H - 1 + 1] = Q : w[8][15 - H - 1] = Q;
          }
          w[f - 8][8] = !L;
        }, We = function(L, N) {
          for (var _ = -1, W = f - 1, H = 7, Q = 0, re = r.getMaskFunction(N), ae = f - 1; ae > 0; ae -= 2)
            for (ae == 6 && (ae -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (w[W][ae - we] == null) {
                  var Me = !1;
                  Q < L.length && (Me = (L[Q] >>> H & 1) == 1);
                  var le = re(W, ae - we);
                  le && (Me = !Me), w[W][ae - we] = Me, H -= 1, H == -1 && (Q += 1, H = 7);
                }
              if (W += _, W < 0 || f <= W) {
                W -= _, _ = -_;
                break;
              }
            }
        }, dt = function(L, N) {
          for (var _ = 0, W = 0, H = 0, Q = new Array(N.length), re = new Array(N.length), ae = 0; ae < N.length; ae += 1) {
            var we = N[ae].dataCount, Me = N[ae].totalCount - we;
            W = Math.max(W, we), H = Math.max(H, Me), Q[ae] = new Array(we);
            for (var le = 0; le < Q[ae].length; le += 1)
              Q[ae][le] = 255 & L.getBuffer()[le + _];
            _ += we;
            var Be = r.getErrorCorrectPolynomial(Me), Ie = d(Q[ae], Be.getLength() - 1), Ls = Ie.mod(Be);
            re[ae] = new Array(Be.getLength() - 1);
            for (var le = 0; le < re[ae].length; le += 1) {
              var Ds = le + Ls.getLength() - re[ae].length;
              re[ae][le] = Ds >= 0 ? Ls.getAt(Ds) : 0;
            }
          }
          for (var Ns = 0, le = 0; le < N.length; le += 1)
            Ns += N[le].totalCount;
          for (var Cn = new Array(Ns), Ut = 0, le = 0; le < W; le += 1)
            for (var ae = 0; ae < N.length; ae += 1)
              le < Q[ae].length && (Cn[Ut] = Q[ae][le], Ut += 1);
          for (var le = 0; le < H; le += 1)
            for (var ae = 0; ae < N.length; ae += 1)
              le < re[ae].length && (Cn[Ut] = re[ae][le], Ut += 1);
          return Cn;
        }, sr = function(L, N, _) {
          for (var W = h.getRSBlocks(L, N), H = m(), Q = 0; Q < _.length; Q += 1) {
            var re = _[Q];
            H.put(re.getMode(), 4), H.put(re.getLength(), r.getLengthInBits(re.getMode(), L)), re.write(H);
          }
          for (var ae = 0, Q = 0; Q < W.length; Q += 1)
            ae += W[Q].dataCount;
          if (H.getLengthInBits() > ae * 8)
            throw "code length overflow. (" + H.getLengthInBits() + ">" + ae * 8 + ")";
          for (H.getLengthInBits() + 4 <= ae * 8 && H.put(0, 4); H.getLengthInBits() % 8 != 0; )
            H.putBit(!1);
          for (; !(H.getLengthInBits() >= ae * 8 || (H.put(E, 8), H.getLengthInBits() >= ae * 8)); )
            H.put(P, 8);
          return dt(H, W);
        };
        q.addData = function(L, N) {
          N = N || "Byte";
          var _ = null;
          switch (N) {
            case "Numeric":
              _ = b(L);
              break;
            case "Alphanumeric":
              _ = S(L);
              break;
            case "Byte":
              _ = j(L);
              break;
            case "Kanji":
              _ = D(L);
              break;
            default:
              throw "mode:" + N;
          }
          I.push(_), T = null;
        }, q.isDark = function(L, N) {
          if (L < 0 || f <= L || N < 0 || f <= N)
            throw L + "," + N;
          return w[L][N];
        }, q.getModuleCount = function() {
          return f;
        }, q.make = function() {
          if (x < 1) {
            for (var L = 1; L < 40; L++) {
              for (var N = h.getRSBlocks(L, C), _ = m(), W = 0; W < I.length; W++) {
                var H = I[W];
                _.put(H.getMode(), 4), _.put(H.getLength(), r.getLengthInBits(H.getMode(), L)), H.write(_);
              }
              for (var Q = 0, W = 0; W < N.length; W++)
                Q += N[W].dataCount;
              if (_.getLengthInBits() <= Q * 8)
                break;
            }
            x = L;
          }
          ie(!1, fe());
        }, q.createTableTag = function(L, N) {
          L = L || 2, N = typeof N > "u" ? L * 4 : N;
          var _ = "";
          _ += '<table style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: " + N + "px;", _ += '">', _ += "<tbody>";
          for (var W = 0; W < q.getModuleCount(); W += 1) {
            _ += "<tr>";
            for (var H = 0; H < q.getModuleCount(); H += 1)
              _ += '<td style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: 0px;", _ += " width: " + L + "px;", _ += " height: " + L + "px;", _ += " background-color: ", _ += q.isDark(W, H) ? "#000000" : "#ffffff", _ += ";", _ += '"/>';
            _ += "</tr>";
          }
          return _ += "</tbody>", _ += "</table>", _;
        }, q.createSvgTag = function(L, N, _, W) {
          var H = {};
          typeof arguments[0] == "object" && (H = arguments[0], L = H.cellSize, N = H.margin, _ = H.alt, W = H.title), L = L || 2, N = typeof N > "u" ? L * 4 : N, _ = typeof _ == "string" ? { text: _ } : _ || {}, _.text = _.text || null, _.id = _.text ? _.id || "qrcode-description" : null, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-title" : null;
          var Q = q.getModuleCount() * L + N * 2, re, ae, we, Me, le = "", Be;
          for (Be = "l" + L + ",0 0," + L + " -" + L + ",0 0,-" + L + "z ", le += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', le += H.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', le += ' viewBox="0 0 ' + Q + " " + Q + '" ', le += ' preserveAspectRatio="xMinYMin meet"', le += W.text || _.text ? ' role="img" aria-labelledby="' + ht([W.id, _.id].join(" ").trim()) + '"' : "", le += ">", le += W.text ? '<title id="' + ht(W.id) + '">' + ht(W.text) + "</title>" : "", le += _.text ? '<description id="' + ht(_.id) + '">' + ht(_.text) + "</description>" : "", le += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', le += '<path d="', we = 0; we < q.getModuleCount(); we += 1)
            for (Me = we * L + N, re = 0; re < q.getModuleCount(); re += 1)
              q.isDark(we, re) && (ae = re * L + N, le += "M" + ae + "," + Me + Be);
          return le += '" stroke="transparent" fill="black"/>', le += "</svg>", le;
        }, q.createDataURL = function(L, N) {
          L = L || 2, N = typeof N > "u" ? L * 4 : N;
          var _ = q.getModuleCount() * L + N * 2, W = N, H = _ - N;
          return y(_, _, function(Q, re) {
            if (W <= Q && Q < H && W <= re && re < H) {
              var ae = Math.floor((Q - W) / L), we = Math.floor((re - W) / L);
              return q.isDark(we, ae) ? 0 : 1;
            } else
              return 1;
          });
        }, q.createImgTag = function(L, N, _) {
          L = L || 2, N = typeof N > "u" ? L * 4 : N;
          var W = q.getModuleCount() * L + N * 2, H = "";
          return H += "<img", H += ' src="', H += q.createDataURL(L, N), H += '"', H += ' width="', H += W, H += '"', H += ' height="', H += W, H += '"', _ && (H += ' alt="', H += ht(_), H += '"'), H += "/>", H;
        };
        var ht = function(L) {
          for (var N = "", _ = 0; _ < L.length; _ += 1) {
            var W = L.charAt(_);
            switch (W) {
              case "<":
                N += "&lt;";
                break;
              case ">":
                N += "&gt;";
                break;
              case "&":
                N += "&amp;";
                break;
              case '"':
                N += "&quot;";
                break;
              default:
                N += W;
                break;
            }
          }
          return N;
        }, ar = function(L) {
          var N = 1;
          L = typeof L > "u" ? N * 2 : L;
          var _ = q.getModuleCount() * N + L * 2, W = L, H = _ - L, Q, re, ae, we, Me, le = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Be = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ie = "";
          for (Q = 0; Q < _; Q += 2) {
            for (ae = Math.floor((Q - W) / N), we = Math.floor((Q + 1 - W) / N), re = 0; re < _; re += 1)
              Me = "█", W <= re && re < H && W <= Q && Q < H && q.isDark(ae, Math.floor((re - W) / N)) && (Me = " "), W <= re && re < H && W <= Q + 1 && Q + 1 < H && q.isDark(we, Math.floor((re - W) / N)) ? Me += " " : Me += "█", Ie += L < 1 && Q + 1 >= H ? Be[Me] : le[Me];
            Ie += `
`;
          }
          return _ % 2 && L > 0 ? Ie.substring(0, Ie.length - _ - 1) + Array(_ + 1).join("▀") : Ie.substring(0, Ie.length - 1);
        };
        return q.createASCII = function(L, N) {
          if (L = L || 1, L < 2)
            return ar(N);
          L -= 1, N = typeof N > "u" ? L * 2 : N;
          var _ = q.getModuleCount() * L + N * 2, W = N, H = _ - N, Q, re, ae, we, Me = Array(L + 1).join("██"), le = Array(L + 1).join("  "), Be = "", Ie = "";
          for (Q = 0; Q < _; Q += 1) {
            for (ae = Math.floor((Q - W) / L), Ie = "", re = 0; re < _; re += 1)
              we = 1, W <= re && re < H && W <= Q && Q < H && q.isDark(ae, Math.floor((re - W) / L)) && (we = 0), Ie += we ? Me : le;
            for (ae = 0; ae < L; ae += 1)
              Be += Ie + `
`;
          }
          return Be.substring(0, Be.length - 1);
        }, q.renderTo2dContext = function(L, N) {
          N = N || 2;
          for (var _ = q.getModuleCount(), W = 0; W < _; W++)
            for (var H = 0; H < _; H++)
              L.fillStyle = q.isDark(W, H) ? "black" : "white", L.fillRect(W * N, H * N, N, N);
        }, q;
      };
      s.stringToBytesFuncs = {
        default: function(g) {
          for (var B = [], E = 0; E < g.length; E += 1) {
            var P = g.charCodeAt(E);
            B.push(P & 255);
          }
          return B;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(g, B) {
        var E = (function() {
          for (var x = A(g), C = function() {
            var ee = x.read();
            if (ee == -1) throw "eof";
            return ee;
          }, w = 0, f = {}; ; ) {
            var T = x.read();
            if (T == -1) break;
            var I = C(), q = C(), ie = C(), ce = String.fromCharCode(T << 8 | I), fe = q << 8 | ie;
            f[ce] = fe, w += 1;
          }
          if (w != B)
            throw w + " != " + B;
          return f;
        })(), P = 63;
        return function(x) {
          for (var C = [], w = 0; w < x.length; w += 1) {
            var f = x.charCodeAt(w);
            if (f < 128)
              C.push(f);
            else {
              var T = E[x.charAt(w)];
              typeof T == "number" ? (T & 255) == T ? C.push(T) : (C.push(T >>> 8), C.push(T & 255)) : C.push(P);
            }
          }
          return C;
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
        ], B = 1335, E = 7973, P = 21522, x = {}, C = function(w) {
          for (var f = 0; w != 0; )
            f += 1, w >>>= 1;
          return f;
        };
        return x.getBCHTypeInfo = function(w) {
          for (var f = w << 10; C(f) - C(B) >= 0; )
            f ^= B << C(f) - C(B);
          return (w << 10 | f) ^ P;
        }, x.getBCHTypeNumber = function(w) {
          for (var f = w << 12; C(f) - C(E) >= 0; )
            f ^= E << C(f) - C(E);
          return w << 12 | f;
        }, x.getPatternPosition = function(w) {
          return g[w - 1];
        }, x.getMaskFunction = function(w) {
          switch (w) {
            case i.PATTERN000:
              return function(f, T) {
                return (f + T) % 2 == 0;
              };
            case i.PATTERN001:
              return function(f, T) {
                return f % 2 == 0;
              };
            case i.PATTERN010:
              return function(f, T) {
                return T % 3 == 0;
              };
            case i.PATTERN011:
              return function(f, T) {
                return (f + T) % 3 == 0;
              };
            case i.PATTERN100:
              return function(f, T) {
                return (Math.floor(f / 2) + Math.floor(T / 3)) % 2 == 0;
              };
            case i.PATTERN101:
              return function(f, T) {
                return f * T % 2 + f * T % 3 == 0;
              };
            case i.PATTERN110:
              return function(f, T) {
                return (f * T % 2 + f * T % 3) % 2 == 0;
              };
            case i.PATTERN111:
              return function(f, T) {
                return (f * T % 3 + (f + T) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + w;
          }
        }, x.getErrorCorrectPolynomial = function(w) {
          for (var f = d([1], 0), T = 0; T < w; T += 1)
            f = f.multiply(d([1, c.gexp(T)], 0));
          return f;
        }, x.getLengthInBits = function(w, f) {
          if (1 <= f && f < 10)
            switch (w) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + w;
            }
          else if (f < 27)
            switch (w) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + w;
            }
          else if (f < 41)
            switch (w) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + w;
            }
          else
            throw "type:" + f;
        }, x.getLostPoint = function(w) {
          for (var f = w.getModuleCount(), T = 0, I = 0; I < f; I += 1)
            for (var q = 0; q < f; q += 1) {
              for (var ie = 0, ce = w.isDark(I, q), fe = -1; fe <= 1; fe += 1)
                if (!(I + fe < 0 || f <= I + fe))
                  for (var ee = -1; ee <= 1; ee += 1)
                    q + ee < 0 || f <= q + ee || fe == 0 && ee == 0 || ce == w.isDark(I + fe, q + ee) && (ie += 1);
              ie > 5 && (T += 3 + ie - 5);
            }
          for (var I = 0; I < f - 1; I += 1)
            for (var q = 0; q < f - 1; q += 1) {
              var te = 0;
              w.isDark(I, q) && (te += 1), w.isDark(I + 1, q) && (te += 1), w.isDark(I, q + 1) && (te += 1), w.isDark(I + 1, q + 1) && (te += 1), (te == 0 || te == 4) && (T += 3);
            }
          for (var I = 0; I < f; I += 1)
            for (var q = 0; q < f - 6; q += 1)
              w.isDark(I, q) && !w.isDark(I, q + 1) && w.isDark(I, q + 2) && w.isDark(I, q + 3) && w.isDark(I, q + 4) && !w.isDark(I, q + 5) && w.isDark(I, q + 6) && (T += 40);
          for (var q = 0; q < f; q += 1)
            for (var I = 0; I < f - 6; I += 1)
              w.isDark(I, q) && !w.isDark(I + 1, q) && w.isDark(I + 2, q) && w.isDark(I + 3, q) && w.isDark(I + 4, q) && !w.isDark(I + 5, q) && w.isDark(I + 6, q) && (T += 40);
          for (var X = 0, q = 0; q < f; q += 1)
            for (var I = 0; I < f; I += 1)
              w.isDark(I, q) && (X += 1);
          var Te = Math.abs(100 * X / f / f - 50) / 5;
          return T += Te * 10, T;
        }, x;
      })(), c = (function() {
        for (var g = new Array(256), B = new Array(256), E = 0; E < 8; E += 1)
          g[E] = 1 << E;
        for (var E = 8; E < 256; E += 1)
          g[E] = g[E - 4] ^ g[E - 5] ^ g[E - 6] ^ g[E - 8];
        for (var E = 0; E < 255; E += 1)
          B[g[E]] = E;
        var P = {};
        return P.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return B[x];
        }, P.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return g[x];
        }, P;
      })();
      function d(g, B) {
        if (typeof g.length > "u")
          throw g.length + "/" + B;
        var E = (function() {
          for (var x = 0; x < g.length && g[x] == 0; )
            x += 1;
          for (var C = new Array(g.length - x + B), w = 0; w < g.length - x; w += 1)
            C[w] = g[w + x];
          return C;
        })(), P = {};
        return P.getAt = function(x) {
          return E[x];
        }, P.getLength = function() {
          return E.length;
        }, P.multiply = function(x) {
          for (var C = new Array(P.getLength() + x.getLength() - 1), w = 0; w < P.getLength(); w += 1)
            for (var f = 0; f < x.getLength(); f += 1)
              C[w + f] ^= c.gexp(c.glog(P.getAt(w)) + c.glog(x.getAt(f)));
          return d(C, 0);
        }, P.mod = function(x) {
          if (P.getLength() - x.getLength() < 0)
            return P;
          for (var C = c.glog(P.getAt(0)) - c.glog(x.getAt(0)), w = new Array(P.getLength()), f = 0; f < P.getLength(); f += 1)
            w[f] = P.getAt(f);
          for (var f = 0; f < x.getLength(); f += 1)
            w[f] ^= c.gexp(c.glog(x.getAt(f)) + C);
          return d(w, 0).mod(x);
        }, P;
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
        ], B = function(x, C) {
          var w = {};
          return w.totalCount = x, w.dataCount = C, w;
        }, E = {}, P = function(x, C) {
          switch (C) {
            case o.L:
              return g[(x - 1) * 4 + 0];
            case o.M:
              return g[(x - 1) * 4 + 1];
            case o.Q:
              return g[(x - 1) * 4 + 2];
            case o.H:
              return g[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return E.getRSBlocks = function(x, C) {
          var w = P(x, C);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + C;
          for (var f = w.length / 3, T = [], I = 0; I < f; I += 1)
            for (var q = w[I * 3 + 0], ie = w[I * 3 + 1], ce = w[I * 3 + 2], fe = 0; fe < q; fe += 1)
              T.push(B(ie, ce));
          return T;
        }, E;
      })(), m = function() {
        var g = [], B = 0, E = {};
        return E.getBuffer = function() {
          return g;
        }, E.getAt = function(P) {
          var x = Math.floor(P / 8);
          return (g[x] >>> 7 - P % 8 & 1) == 1;
        }, E.put = function(P, x) {
          for (var C = 0; C < x; C += 1)
            E.putBit((P >>> x - C - 1 & 1) == 1);
        }, E.getLengthInBits = function() {
          return B;
        }, E.putBit = function(P) {
          var x = Math.floor(B / 8);
          g.length <= x && g.push(0), P && (g[x] |= 128 >>> B % 8), B += 1;
        }, E;
      }, b = function(g) {
        var B = a.MODE_NUMBER, E = g, P = {};
        P.getMode = function() {
          return B;
        }, P.getLength = function(w) {
          return E.length;
        }, P.write = function(w) {
          for (var f = E, T = 0; T + 2 < f.length; )
            w.put(x(f.substring(T, T + 3)), 10), T += 3;
          T < f.length && (f.length - T == 1 ? w.put(x(f.substring(T, T + 1)), 4) : f.length - T == 2 && w.put(x(f.substring(T, T + 2)), 7));
        };
        var x = function(w) {
          for (var f = 0, T = 0; T < w.length; T += 1)
            f = f * 10 + C(w.charAt(T));
          return f;
        }, C = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return P;
      }, S = function(g) {
        var B = a.MODE_ALPHA_NUM, E = g, P = {};
        P.getMode = function() {
          return B;
        }, P.getLength = function(C) {
          return E.length;
        }, P.write = function(C) {
          for (var w = E, f = 0; f + 1 < w.length; )
            C.put(
              x(w.charAt(f)) * 45 + x(w.charAt(f + 1)),
              11
            ), f += 2;
          f < w.length && C.put(x(w.charAt(f)), 6);
        };
        var x = function(C) {
          if ("0" <= C && C <= "9")
            return C.charCodeAt(0) - 48;
          if ("A" <= C && C <= "Z")
            return C.charCodeAt(0) - 65 + 10;
          switch (C) {
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
              throw "illegal char :" + C;
          }
        };
        return P;
      }, j = function(g) {
        var B = a.MODE_8BIT_BYTE, E = s.stringToBytes(g), P = {};
        return P.getMode = function() {
          return B;
        }, P.getLength = function(x) {
          return E.length;
        }, P.write = function(x) {
          for (var C = 0; C < E.length; C += 1)
            x.put(E[C], 8);
        }, P;
      }, D = function(g) {
        var B = a.MODE_KANJI, E = s.stringToBytesFuncs.SJIS;
        if (!E)
          throw "sjis not supported.";
        (function(C, w) {
          var f = E(C);
          if (f.length != 2 || (f[0] << 8 | f[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var P = E(g), x = {};
        return x.getMode = function() {
          return B;
        }, x.getLength = function(C) {
          return ~~(P.length / 2);
        }, x.write = function(C) {
          for (var w = P, f = 0; f + 1 < w.length; ) {
            var T = (255 & w[f]) << 8 | 255 & w[f + 1];
            if (33088 <= T && T <= 40956)
              T -= 33088;
            else if (57408 <= T && T <= 60351)
              T -= 49472;
            else
              throw "illegal char at " + (f + 1) + "/" + T;
            T = (T >>> 8 & 255) * 192 + (T & 255), C.put(T, 13), f += 2;
          }
          if (f < w.length)
            throw "illegal char at " + (f + 1);
        }, x;
      }, k = function() {
        var g = [], B = {};
        return B.writeByte = function(E) {
          g.push(E & 255);
        }, B.writeShort = function(E) {
          B.writeByte(E), B.writeByte(E >>> 8);
        }, B.writeBytes = function(E, P, x) {
          P = P || 0, x = x || E.length;
          for (var C = 0; C < x; C += 1)
            B.writeByte(E[C + P]);
        }, B.writeString = function(E) {
          for (var P = 0; P < E.length; P += 1)
            B.writeByte(E.charCodeAt(P));
        }, B.toByteArray = function() {
          return g;
        }, B.toString = function() {
          var E = "";
          E += "[";
          for (var P = 0; P < g.length; P += 1)
            P > 0 && (E += ","), E += g[P];
          return E += "]", E;
        }, B;
      }, O = function() {
        var g = 0, B = 0, E = 0, P = "", x = {}, C = function(f) {
          P += String.fromCharCode(w(f & 63));
        }, w = function(f) {
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
        return x.writeByte = function(f) {
          for (g = g << 8 | f & 255, B += 8, E += 1; B >= 6; )
            C(g >>> B - 6), B -= 6;
        }, x.flush = function() {
          if (B > 0 && (C(g << 6 - B), g = 0, B = 0), E % 3 != 0)
            for (var f = 3 - E % 3, T = 0; T < f; T += 1)
              P += "=";
        }, x.toString = function() {
          return P;
        }, x;
      }, A = function(g) {
        var B = g, E = 0, P = 0, x = 0, C = {};
        C.read = function() {
          for (; x < 8; ) {
            if (E >= B.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var f = B.charAt(E);
            if (E += 1, f == "=")
              return x = 0, -1;
            if (f.match(/^\s$/))
              continue;
            P = P << 6 | w(f.charCodeAt(0)), x += 6;
          }
          var T = P >>> x - 8 & 255;
          return x -= 8, T;
        };
        var w = function(f) {
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
        return C;
      }, G = function(g, B) {
        var E = g, P = B, x = new Array(g * B), C = {};
        C.setPixel = function(I, q, ie) {
          x[q * E + I] = ie;
        }, C.write = function(I) {
          I.writeString("GIF87a"), I.writeShort(E), I.writeShort(P), I.writeByte(128), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(255), I.writeByte(255), I.writeByte(255), I.writeString(","), I.writeShort(0), I.writeShort(0), I.writeShort(E), I.writeShort(P), I.writeByte(0);
          var q = 2, ie = f(q);
          I.writeByte(q);
          for (var ce = 0; ie.length - ce > 255; )
            I.writeByte(255), I.writeBytes(ie, ce, 255), ce += 255;
          I.writeByte(ie.length - ce), I.writeBytes(ie, ce, ie.length - ce), I.writeByte(0), I.writeString(";");
        };
        var w = function(I) {
          var q = I, ie = 0, ce = 0, fe = {};
          return fe.write = function(ee, te) {
            if (ee >>> te)
              throw "length over";
            for (; ie + te >= 8; )
              q.writeByte(255 & (ee << ie | ce)), te -= 8 - ie, ee >>>= 8 - ie, ce = 0, ie = 0;
            ce = ee << ie | ce, ie = ie + te;
          }, fe.flush = function() {
            ie > 0 && q.writeByte(ce);
          }, fe;
        }, f = function(I) {
          for (var q = 1 << I, ie = (1 << I) + 1, ce = I + 1, fe = T(), ee = 0; ee < q; ee += 1)
            fe.add(String.fromCharCode(ee));
          fe.add(String.fromCharCode(q)), fe.add(String.fromCharCode(ie));
          var te = k(), X = w(te);
          X.write(q, ce);
          var Te = 0, We = String.fromCharCode(x[Te]);
          for (Te += 1; Te < x.length; ) {
            var dt = String.fromCharCode(x[Te]);
            Te += 1, fe.contains(We + dt) ? We = We + dt : (X.write(fe.indexOf(We), ce), fe.size() < 4095 && (fe.size() == 1 << ce && (ce += 1), fe.add(We + dt)), We = dt);
          }
          return X.write(fe.indexOf(We), ce), X.write(ie, ce), X.flush(), te.toByteArray();
        }, T = function() {
          var I = {}, q = 0, ie = {};
          return ie.add = function(ce) {
            if (ie.contains(ce))
              throw "dup key:" + ce;
            I[ce] = q, q += 1;
          }, ie.size = function() {
            return q;
          }, ie.indexOf = function(ce) {
            return I[ce];
          }, ie.contains = function(ce) {
            return typeof I[ce] < "u";
          }, ie;
        };
        return C;
      }, y = function(g, B, E) {
        for (var P = G(g, B), x = 0; x < B; x += 1)
          for (var C = 0; C < g; C += 1)
            P.setPixel(C, x, E(C, x));
        var w = k();
        P.write(w);
        for (var f = O(), T = w.toByteArray(), I = 0; I < T.length; I += 1)
          f.writeByte(T[I]);
        return f.flush(), "data:image/gif;base64," + f;
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
  })(Jn)), Jn.exports;
}
var jy = Ny();
const Py = /* @__PURE__ */ Dy(jy), qy = ["width", "height", "viewBox"], Wy = ["width", "height"], Fy = ["d"], Hy = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = M(() => {
      const s = Py(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let i = 0; i < a; i += 1)
        for (let r = 0; r < a; r += 1)
          s.isDark(i, r) && o.push(`M${r + 4} ${i + 4}h1v1h-1z`);
      return { count: a + 8, path: o.join("") };
    });
    return (s, a) => (l(), u("svg", {
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
      }, null, 8, Wy),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Fy)
    ], 8, qy));
  }
}, u2 = /* @__PURE__ */ K(Hy, [["__scopeId", "data-v-489f0852"]]), d2 = gr(() => import("./VoiceFigure-Cipbatky.js").then((e) => e.V)), h2 = "1.0.0", f2 = "3.5";
export {
  Yy as $,
  Sw as A,
  Xe as B,
  Dw as C,
  _w as D,
  Lw as E,
  vw as F,
  Xo as G,
  Zg as H,
  Yg as I,
  Fw as J,
  $t as K,
  Bw as L,
  Re as M,
  At as N,
  Cw as O,
  En as P,
  Aw as Q,
  Im as R,
  Fo as S,
  Mw as T,
  Rw as U,
  ba as V,
  Lg as W,
  Cg as X,
  Hw as Y,
  Nw as Z,
  K as _,
  de as a,
  Ue as a$,
  Qw as a0,
  ke as a1,
  xn as a2,
  Jy as a3,
  ld as a4,
  l2 as a5,
  mw as a6,
  an as a7,
  zw as a8,
  zy as a9,
  ow as aA,
  bt as aB,
  lw as aC,
  Gy as aD,
  xs as aE,
  c2 as aF,
  tr as aG,
  rw as aH,
  Je as aI,
  iw as aJ,
  d2 as aK,
  Oe as aL,
  gl as aM,
  ts as aN,
  o2 as aO,
  a2 as aP,
  r2 as aQ,
  pw as aR,
  hw as aS,
  uw as aT,
  Gw as aU,
  Xh as aV,
  tw as aW,
  Vw as aX,
  Op as aY,
  Ky as aZ,
  ew as a_,
  Lt as aa,
  nw as ab,
  ye as ac,
  e2 as ad,
  h2 as ae,
  f2 as af,
  sw as ag,
  t2 as ah,
  hs as ai,
  dw as aj,
  Np as ak,
  yt as al,
  vs as am,
  Ts as an,
  Zy as ao,
  aw as ap,
  Nr as aq,
  i2 as ar,
  Qy as as,
  u2 as at,
  Zw as au,
  ci as av,
  Vy as aw,
  fw as ax,
  D0 as ay,
  of as az,
  Qe as b,
  Xy as b0,
  cw as b1,
  lt as b2,
  c0 as b3,
  Xw as b4,
  Kw as b5,
  n2 as b6,
  Cf as b7,
  G0 as b8,
  Oo as b9,
  Yw as ba,
  Yf as bb,
  Jw as bc,
  wn as bd,
  s2 as be,
  Ew as c,
  ww as d,
  kw as e,
  yw as f,
  Pw as g,
  Do as h,
  Ow as i,
  Tw as j,
  Iw as k,
  qw as l,
  bw as m,
  gw as n,
  $w as o,
  pn as p,
  Uw as q,
  jw as r,
  xw as s,
  Pe as t,
  Eg as u,
  Ww as v,
  Og as w,
  Bs as x,
  Xm as y,
  Qm as z
};
