/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as he, createElementVNode as m, normalizeClass as J, Fragment as Y, renderList as se, normalizeStyle as be, defineComponent as Ei, Comment as Ai, h as ta, cloneVNode as Ci, createBlock as G, withCtx as V, unref as U, createVNode as W, toDisplayString as b, createCommentVNode as E, inject as Te, computed as R, resolveDynamicComponent as xt, Transition as Bt, watch as xe, ref as D, shallowRef as Fn, createTextVNode as ce, TransitionGroup as Oo, mergeProps as ut, reactive as na, onMounted as Fe, onUnmounted as Ie, nextTick as rn, useId as To, Teleport as sa, withModifiers as ke, isRef as Oa, onBeforeUnmount as Lt, resolveDirective as Oi, withDirectives as dt, useAttrs as aa, useModel as As, getCurrentInstance as Ti, mergeModels as Cs, getCurrentScope as Io, onScopeDispose as Ro, provide as Ii, onErrorCaptured as Ri, toHandlers as Bi, createSlots as Li, vShow as Di, useSlots as Ni, withKeys as Gt, vModelText as Os, defineAsyncComponent as Pi } from "vue";
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, ji = { class: "skeleton-line" }, qi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", ji, [
      he(t.$slots, "default", {}, void 0, !0),
      m("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(Y, null, se(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: be({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ft = /* @__PURE__ */ K(qi, [["__scopeId", "data-v-0ebb6933"]]), oa = Ei({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Ai);
      return s.length !== 1 ? ta(Y, { key: n }, s) : s[0].key == null ? Ci(s[0], { key: n }) : s[0];
    };
  }
}), Fi = ["aria-label"], Wi = ["aria-label"], Hi = ["aria-label"], Ui = ["aria-label"], zi = ["aria-label"], Vi = ["aria-label"], Gi = ["aria-label"], Ki = {
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
    ], r = ["94%", "88%", "91%", "62%"].map((l) => ({ width: l, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (l, u) => (c(), G(oa, { value: e.shape }, {
      messages: V(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(Y, null, se(t, (d) => m("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: be({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, Fi)
      ]),
      older: V(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: be({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, Wi)
      ]),
      cards: V(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(Y, null, se(n, (f) => W(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Hi)
      ]),
      file: V(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            W(ft, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(Y, null, se(a, (f) => W(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ui)
      ]),
      page: V(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          W(ft, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, zi)
      ]),
      text: V(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Vi)
      ]),
      default: V(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Gi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Dt = /* @__PURE__ */ K(Ki, [["__scopeId", "data-v-c687fb85"]]), Yi = {
  key: 1,
  class: "empty-state titled"
}, Ji = { class: "empty-state-title" }, Zi = { class: "empty-state-text" }, Xi = {
  key: 2,
  class: "empty-state"
}, Qi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(Dt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Yi, [
      m("p", Ji, b(e.title), 1),
      m("p", Zi, [
        he(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Xi, [
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, In = /* @__PURE__ */ K(Qi, [["__scopeId", "data-v-b27e89b0"]]), el = { class: "fold-group" }, tl = ["aria-expanded"], nl = { class: "fold-label" }, sl = {
  key: 0,
  class: "fold-count"
}, al = {
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
    return (s, a) => (c(), h("div", el, [
      m("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        m("span", nl, b(e.label), 1),
        e.count !== "" ? (c(), h("span", sl, b(e.count), 1)) : E("", !0),
        m("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, tl),
      e.open ? he(s.$slots, "default", {}, void 0, !0, 0) : E("", !0)
    ]));
  }
}, ub = /* @__PURE__ */ K(al, [["__scopeId", "data-v-9ef1865c"]]), ol = Symbol("open-view"), Be = Symbol.for("journal.window-context");
function Wn() {
  const e = Te(Be, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const rl = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: be({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, il = /* @__PURE__ */ K(rl, [["__scopeId", "data-v-eb453d6f"]]), ll = {
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
    const t = e, n = R(() => {
      var s;
      return t.busy || t.disabled || !!((s = Te(Be, null)) != null && s.readOnly);
    });
    return (s, a) => (c(), G(xt(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: J(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: V(() => [
        m("span", {
          class: J(["btn-label", { hidden: e.busy }])
        }, [
          he(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (c(), G(il, {
          key: 0,
          class: "btn-spinner"
        })) : E("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, we = /* @__PURE__ */ K(ll, [["__scopeId", "data-v-a2dc4bda"]]), cl = {
  class: "running",
  "data-running-command": ""
}, ul = ["title"], dl = {
  key: "idle",
  class: "running-idle"
}, hl = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", cl, [
      W(Bt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: V(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, ul)) : (c(), h("span", dl, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, db = /* @__PURE__ */ K(hl, [["__scopeId", "data-v-d3240219"]]), fl = ["aria-checked", "aria-label", "title"], pl = {
  key: 0,
  class: "switch-inner"
}, ml = {
  key: 0,
  class: "switch-word"
}, gl = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("button", {
      type: "button",
      class: J(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: J(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", pl, b(e.word), 1)) : E("", !0),
        a[1] || (a[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", ml, b(e.word), 1)) : E("", !0)
    ], 10, fl));
  }
}, hb = /* @__PURE__ */ K(gl, [["__scopeId", "data-v-1bfb90f3"]]);
function Bo(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Kt(e, t) {
  return Bo(() => localStorage, e, t);
}
function Lo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Hn(e, t) {
  return Lo(() => localStorage, e, t);
}
function Do(e, t) {
  xe(t, (n) => Hn(e, n), { deep: !0 });
}
function vl(e, t) {
  return Bo(() => sessionStorage, e, t);
}
function yl(e, t) {
  return Lo(() => sessionStorage, e, t);
}
const Rn = "journal.environment", No = D(vl(Rn, Kt(Rn, "")));
function wl(e) {
  No.value = e, yl(Rn, e), Hn(Rn, e);
}
const Bn = D(location.hash), Ta = Fn(null), Ia = { integrations: "mcp", library: "team" };
function bl() {
  if (!Ta.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ia[n]) {
    location.replace(`#/${[Ia[n], ...s].join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash;
    return;
  }
  !n || Ta.value(n) || (wl(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Bn.value = location.hash, bl();
});
const Je = R(() => {
  const [e, t = ""] = Bn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: No.value,
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
}), Un = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Un.page(e)}?open=${t}`
};
function kl(e = "", t = 0, n = "") {
  location.hash = Un.page(e, t, n);
}
const xl = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Po(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(xl).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ot = {};
function fb(e, t) {
  return Ot[e] = t, () => Ot[e] === t && delete Ot[e];
}
function jo(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Ot[e]) != null && r.call(Ot, t))) return;
  const a = Je.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Po([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function $l(e, t, n, s = 0, a = "") {
  if (e === Je.value.env) return jo(t, n, s, a);
  const o = Je.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Po([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Ze(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? $l(s, a, Number(o), 0, t) : jo(a, Number(o), 0, t);
}
function Ml(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ct(e) {
  const t = Ml(e);
  t && Ze(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const zn = typeof document < "u" && document.documentElement.classList.contains("phone"), _l = "Files are attached on the computer; the phone sends text.", ts = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], me = (e, t, n, s = {}) => ({
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
}), ln = {
  messages: me("Message", "mail", "What the user left for the agent, or the agent for the user", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: me("Question", "help", "Something the agent asks the user, with choices to pick", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: me("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: ts
  }),
  tasks: me("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: ts
  }),
  reports: me("Report", "report", "What was checked and what was found, written for the user", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: me("Collection", "folder", "Rows that belong together, gathered under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: me("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: me("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: me("Rule", "list", "A ruling that binds every environment of the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: me("Reminder", "clock", "An instruction said again until it is retired", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: me("Pin", "band", "One line pinned to the chat while it matters", { filters: ts }),
  reactions: me("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: me("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", { scope: "project" }),
  environments: me("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", { scope: "project" }),
  agents: me("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: me("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: me("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
  verifiers: me("Verifier", "verifier", "An agent the journal sends by itself to judge whether a dismissed reader report was dismissed rightly"),
  test_turns: me("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: me("Reviewer", "reviewer", "An agent the journal sends by itself, in orchestrator mode with the reviewer on, to test and check each worker's work and report each point to the agent"),
  subagents: me("Subagent", "bot", "A helper the agent started inside its own session for one job", { nested: !0 }),
  sequences: me("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: me("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: me("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: me("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: me("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: me("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: me("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Sl = ["secrets", "plugins"], qo = Object.keys(ln).filter((e) => !(zn && Sl.includes(e)));
R(() => qo.map((e) => ({ name: e, ...ln[e] })));
const cn = (e) => ln[e], Fo = new Map(qo.flatMap((e) => [e, e.replace(/s$/, ""), ln[e].title.toLowerCase()].map((t) => [t, e]))), bt = (e) => Fo.get(String(e).toLowerCase()) || "", Wo = [...Fo.keys()].sort((e, t) => t.length - e.length).join("|"), El = ["stroke-width", "innerHTML"], ve = {
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
    return (o, r) => (c(), h("svg", {
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
    }, null, 12, El));
  }
}, Vn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), G(we, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: V(() => [
        W(ve, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Al = {
  key: 1,
  class: "row-list-failure"
}, Cl = ["data-row"], Ol = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = D(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), G(Dt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Al, b(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(In, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: V(() => [
        ce(b(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(Y, { key: 3 }, [
      (c(), G(xt(e.arrival ? Oo : "ul"), ut(n.value, { class: "row-list" }), {
        default: V(() => [
          (c(!0), h(Y, null, se(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            he(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Cl))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : E("", !0)
    ], 64));
  }
}, Tl = /* @__PURE__ */ K(Ol, [["__scopeId", "data-v-aa6ad7ff"]]), Il = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Rl = {
  key: 1,
  class: "agent-rows-note"
}, Bl = {
  key: 2,
  class: "agent-rows-note"
}, Ll = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Dl = ["data-agent-row", "onClick"], Nl = { class: "agent-row-name" }, Pl = { class: "agent-row-state" }, jl = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = R(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Il, [
      e.loaded ? e.failure ? (c(), h("p", Rl, b(e.failure), 1)) : e.rows.length ? (c(), h(Y, { key: 3 }, [
        m("p", Ll, b(s.value) + " running", 1),
        (c(!0), h(Y, null, se(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => U(Ze)(`agents:${r.id}`)
        }, [
          m("span", Nl, "#" + b(r.id) + " " + b(r.session), 1),
          m("span", Pl, b(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Dl))), 128))
      ], 64)) : (c(), h("p", Bl, b(e.none), 1)) : (c(), G(Dt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, pb = /* @__PURE__ */ K(jl, [["__scopeId", "data-v-a01e5a17"]]), ql = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["badge", e.tone])
    }, b(e.text), 3));
  }
}, Ho = /* @__PURE__ */ K(ql, [["__scopeId", "data-v-9e7e1157"]]), Fl = ["aria-valuenow", "aria-valuemax"], Wl = {
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
    const t = e, n = R(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (c(), h("span", {
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: be({ width: n.value })
      }, null, 4)
    ], 10, Fl));
  }
}, Hl = /* @__PURE__ */ K(Wl, [["__scopeId", "data-v-9eba6a85"]]), Ul = { class: "bars" }, zl = { class: "bar-name" }, Vl = { class: "bar-value" }, Gl = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", Ul, [
      (c(!0), h(Y, null, se(e.items, (l, u) => (c(), G(xt(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: J(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: V(() => [
          m("span", zl, b(l.label), 1),
          W(Hl, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Vl, b(l.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Kl = /* @__PURE__ */ K(Gl, [["__scopeId", "data-v-663427f4"]]), Yl = { class: "bars" }, Jl = {
  key: 0,
  class: "bars-title"
}, Zl = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Yl, [
      e.node.title ? (c(), h("span", Jl, b(e.node.title), 1)) : E("", !0),
      W(Kl, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Xl = /* @__PURE__ */ K(Zl, [["__scopeId", "data-v-7135bb11"]]), Ql = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = R(() => n[s.node.type](s.node));
    return (r, i) => (c(), h("div", {
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: be(o.value)
    }, [
      (c(!0), h(Y, null, se(e.node.children || [], (l, u) => (c(), G(yr, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, En = /* @__PURE__ */ K(Ql, [["__scopeId", "data-v-d142a3f4"]]), ec = {
  key: 0,
  class: "card-head"
}, tc = { class: "card-title" }, nc = {
  key: 0,
  class: "card-note"
}, sc = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", ec, [
        m("span", tc, b(e.node.title), 1),
        e.node.note ? (c(), h("span", nc, b(e.node.note), 1)) : E("", !0)
      ])) : E("", !0),
      W(En, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, ac = /* @__PURE__ */ K(sc, [["__scopeId", "data-v-67b72d40"]]), oc = (e) => "task_ids" in e, Uo = 1024, rc = Uo * 1024 * 1024, ic = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Uo} MB limit for one file.`;
function lc() {
  return () => {
  };
}
function Ra(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function cc(e = window) {
  if (!Ra(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ra(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ts = "journal.stale-build-reload", uc = 'script[type="module"][src*="/assets/index-"]', Ba = (e) => {
  var t;
  return ((t = e.querySelector(uc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function dc(e = document, t = fetch, n = () => cc(window)) {
  const s = Ba(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = Ba(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
const hc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function fc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ts) === e.message) return !1;
    t.setItem(Ts, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function pc(e = window.sessionStorage) {
  try {
    e.removeItem(Ts);
  } catch {
    return;
  }
}
const mc = 2e3, gc = 3e4, lt = na({ starting: !1, external: !1, late: !1 }), ra = () => lt.starting;
let Is = 0, zo = 0, Vo = [];
async function vc() {
  try {
    const e = await je.serverState();
    return e.ok ? await e.json() : { restarting: !1, updating: !1 };
  } catch {
    return { restarting: !0, updating: lt.external };
  }
}
function yc() {
  clearInterval(Is), clearTimeout(zo), Is = 0, Object.assign(lt, { starting: !1, external: !1, late: !1 }), Vo.splice(0).forEach((e) => e()), dc();
}
async function wc() {
  const e = await vc();
  lt.external = e.updating, !e.restarting && !e.updating && yc();
}
function La() {
  lt.starting || (lt.starting = !0, Is = setInterval(wc, mc), zo = setTimeout(() => lt.late = !0, gc));
}
const bc = () => lt.starting ? new Promise((e) => Vo.push(e)) : Promise.resolve(), Da = 2e4, kc = 3e5, Ge = 6e5, yn = 6, xc = 500, $c = "/journal/summary", Mc = "/api/server-state", Na = zn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, _c = (e) => e.split("?")[0].endsWith($c), Go = (e, t) => Object.assign(new Error(t), { status: e });
async function Sc(e, t, n = Go) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Ec = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Ac {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = yn;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = yn;
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
        headers: { ...Na, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Ec(s),
        signal: AbortSignal.timeout(a || (i ? kc : Da))
      });
    } catch (l) {
      if (l instanceof TypeError && La(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, xc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = yn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : lc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Sc(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Na, signal: AbortSignal.timeout(Da) });
    if (!n.ok) throw Go(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, yn, o).then((l) => (this.written(n), l));
    if (ra() && !_c(n))
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
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return fetch(Mc, { cache: "no-store" });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (s) {
      throw s instanceof TypeError && La(), s;
    }
  }
}
const je = new Ac(), Re = (e) => encodeURIComponent(e);
function fe(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const Pt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), jt = "the page does not know its environment yet", Cc = "X-Journal-Env", Oc = "X-Journal-Request-At", ns = "/viewer/voices/figures/";
class ia {
  constructor({ env: t = () => Je.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ia({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Oc]: String(Date.now()), ...this.env() ? { [Cc]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === jt ? Promise.reject(new Error(jt)) : je.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === jt ? Promise.reject(new Error(jt)) : je.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : jt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${Re(this.env())}`);
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
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: l = !1, docked: u = !1 } = {}) {
    const d = this.here(`/${t}${fe({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: l ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(d, `${t}.${Pt({ before: s, after: a, since: o, ids: r, tasks: i, closed: l, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${fe({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${Pt({ before: s, since: a, docked: o })}`);
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
    return this.post(this.here(t.path), {}, Ge);
  }
  upload(t, n, s) {
    if (zn) return Promise.reject(Object.assign(new Error(_l), { status: 403 }));
    if (s.size > rc) return Promise.reject(new Error(ic(s)));
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${Re(s)}`);
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
    return this.get(`/agents/controls/${Re(t)}${fe({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${Re(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${Re(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${fe(s)}`), `${a}.${Pt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${fe(n)}`), `/verifiers/${t}/transcript.${Pt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${fe(n)}`), `/workers/${t}/transcript.${Pt(n)}`);
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
    return this.post("/team/connect", t, Ge);
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
    return this.post(`/library/items/${encodeURIComponent(t)}/publish`, { reference: n, note: s, description: a, team: o }, Ge);
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
    return this.get(this.here(`/skills/${Re(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${Re(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${Re(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return je.request("GET", ns + "figures.json");
  }
  voiceFigureUrl(t) {
    return ns + t;
  }
  figureDecoderUrl() {
    return ns + "draco/";
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
    return this.post(this.here("/plugins/preview"), { source: t }, Ge);
  }
  installPlugin(t) {
    return this.post(this.here("/plugins"), { source: t }, Ge);
  }
  previewUpgrade(t) {
    return this.act("plugins", t, "upgrade-preview", {}, Ge);
  }
  upgradePlugin(t, n) {
    return this.act("plugins", t, "upgrade", { ref: n }, Ge);
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
    return this.post(`/profiles/${Re(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${Re(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${Re(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, Ge);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Re(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Ge);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Re(t)}` : ""}${Un.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ze = new ia({ base: zn ? "/p" : "" }), Tc = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ze.base.length).split("/")[2]);
}), Pa = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), Ic = 6e4, Rc = 4, Bc = 300, Lc = 5e3, Ko = /* @__PURE__ */ new Map();
function Gn(e) {
  if (!(e in Pa)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Pa[e];
}
function Dc(e) {
  const t = Gn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Lc;
  }
}
const Nc = (e) => e / 2 + Math.random() * e / 2, Yo = (e) => [...e.users.values()].pop(), la = (e) => Ko.get(e.place) === e, Pc = () => Math.random() * Bc, ca = () => document.hidden;
function jc(e) {
  const t = Dc(e);
  return e.failures ? Nc(Math.min(Ic, t * 2 ** e.failures)) : Math.max(t, Rc * e.took);
}
function Jo(e, t) {
  clearTimeout(e.timer), !(!la(e) || ca()) && (e.timer = setTimeout(() => qc(e), t));
}
function qc(e) {
  return la(e) ? e.running ? (e.again = !0, e.running) : (e.running = Uc(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Fc = (e) => {
  var t, n;
  return !ca() && (((n = (t = Gn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Yo(e).active() && !ra();
};
async function Wc(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => Gn(e.key).read(Yo(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Hc(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Gn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Uc(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Fc(e) && Hc(e, await Wc(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && la(e));
  Jo(e, jc(e));
}
const zc = () => ca() || Ko.forEach((e) => Jo(e, Pc()));
document.addEventListener("visibilitychange", zc);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Zo = (e) => `${e.table}:${e.id}`, ja = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ss = 80;
function qa(e) {
  return e.length <= ss ? e : `${e.slice(0, ss + 1).replace(/\s+\S*$/, "") || e.slice(0, ss)}…`;
}
const Fa = {
  messages: (e) => qa(ja(e.text)),
  comments: (e) => qa(ja(e.text)),
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
}, Vc = (e) => (Fa[e.table] ? Fa[e.table](e) : e.title || "") || "", Gc = ["done", "cancelled"], Rs = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => Gc.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, Kc = (e) => Rs[e.table] ? Rs[e.table](e) : 0, Xo = (e) => Kc(e) > 0, Yc = (e) => !!Rs[e], kt = (e) => Ee(e.created_at), Bs = (e) => Ee(e.updated_at) || kt(e), Jc = 60, Zc = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - Jc, Xc = (e, t) => e.id > 0 && e.table === t.table && Zc(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ua = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Xc(s, n))), Qc = { me: 1, people: [] }, ue = na({
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
  people: Qc,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Kt("journal.activity", !0),
  wide: !1,
  sideMini: Kt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Do("journal.activity", () => ue.activity);
Do("journal.side.mini", () => ue.sideMini);
const eu = 50, Qo = 100, tu = { messages: 25 }, Ue = (e) => tu[e] || eu;
function nu(e, t) {
  if (e !== "messages") return Math.max(t.length - Ue(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Ue(e)) return s;
  return 0;
}
const ht = /* @__PURE__ */ new Set(), da = D(0), un = /* @__PURE__ */ new Set(), dn = /* @__PURE__ */ new Set(), at = /* @__PURE__ */ new Set(), Ls = /* @__PURE__ */ new Set(), su = /* @__PURE__ */ new Map(), au = /* @__PURE__ */ new Map();
let qt = !1, Ft = null;
const ou = (e, t) => e.id - t.id, ru = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, iu = { messages: ru }, er = (e) => iu[e] || ou;
function tr(e) {
  return da.value, ht.has(e) || (ht.add(e), ue.booted && (!un.has(e) || dn.has(e)) && queueMicrotask(() => ha([e], !1))), ue.rows[e] || [];
}
function lu(e) {
  const t = ue.rows[e] || [], n = nu(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ue.rows[e] = t.filter((a) => s.has(a) || Yc(e) && !Xo(a)), ue.paging.size[e] = Ue(e), ue.paging.more[e] = !0;
}
const cu = /* @__PURE__ */ new Set();
function uu() {
  ht.forEach(lu), ht.clear(), su.clear(), au.clear(), da.value += 1;
}
xe(() => `${Je.value.env}/${Je.value.page}/${Je.value.open ? Je.value.open.table : ""}`, uu);
xe(
  () => ue.booted,
  (e) => e && ha(
    [...ht].filter((t) => !un.has(t)),
    !1
  )
);
const Ds = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !oc(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function nr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Ds(s) && !Ds(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function sr(e, t) {
  un.add(e), da.value += 1;
  const n = ue.rows[e] || [];
  ue.rows[e] = [...nr(n, t.rows), ...ua(n.filter((s) => s.id === 0), t.rows)], ue.paging.size[e] = ue.paging.size[e] || Ue(e), ue.paging.more[e] = !t.is_last_page;
}
async function du(e) {
  const t = new Set((ue.rows[e] || []).map((o) => o.id)), n = await ze.list(e, { limit: Ue(e) });
  Kn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ua((ue.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return sr(e, { ...n, rows: [...n.rows, ...a].sort(er(e)) }), ue.paging.size[e] = Ue(e), ar.has(e) && await or(e), ue.rows[e];
}
const Kn = (e, t) => ue.counts = { ...ue.counts, [e]: t };
async function hu(e) {
  const t = ue.rows[e] || [], n = Math.max(0, ...t.map(Bs)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ze.list(e, { limit: Ue(e), since: n, after: s });
  if (Kn(e, a.counts), !a.is_last_page) return du(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = ua(t.filter((i) => !o.has(i.id)), a.rows).concat(nr(t, a.rows));
  return ue.rows[e] = r.sort(er(e)), ue.paging.size[e] = ue.rows[e].length, ue.rows[e];
}
const as = /* @__PURE__ */ new Set();
async function fu(e, t = !1) {
  e.forEach((n) => dn.delete(n)), e.forEach((n) => Ls.add(n));
  try {
    await bu(e, t);
  } finally {
    e.forEach((n) => Ls.delete(n));
  }
}
async function pu(e) {
  const t = await ze.list(e, { limit: Ue(e) });
  Kn(e, t.counts), sr(e, t);
}
async function mu(e) {
  Kn(e, (await ze.list(e, { limit: 1, closed: !0 })).counts);
}
const ar = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function or(e) {
  const t = (ue.rows[e] || []).filter((a) => Ds(a) && (e !== "plans" || !Xo(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ze.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ue.rows[e] = (ue.rows[e] || []).map((a) => s.get(a.id) || a);
}
const gu = (e, t) => !un.has(e) || t && (ue.paging.size[e] || Ue(e)) === Ue(e) && !cu.has(e);
async function vu(e, t) {
  if (!ht.has(e)) return mu(e);
  const n = await (gu(e, t) ? pu(e) : hu(e));
  return ar.has(e) && await or(e), n;
}
async function rr() {
  const e = await ze.settings();
  JSON.stringify(e) !== JSON.stringify(ue.settings) && (ue.settings = e);
}
async function yu() {
  const [e] = await Promise.all([ze.entries(0, Qo), rr()]);
  $u([...Kt(lr(), []), ...e]);
}
const wu = (e, t) => vu(e, t).then(
  () => null,
  () => e
);
async function bu(e, t) {
  const n = (await Promise.all(e.map((s) => wu(s, t)))).filter(Boolean);
  if (n.forEach((s) => (at.add(s), dn.add(s))), t && await yu(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const ir = 1e3, ku = 15e3;
let wn = ir;
async function xu() {
  return Ft || (Ft = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...at].some((e) => !as.has(e)) || qt; ) {
      const e = qt, t = [...e ? Object.keys(ue.rows) : at].filter((s) => ln[s] && (ht.has(s) || s in ue.rows)).filter((s) => e || !ht.has(s) || dn.has(s) || !un.has(s)).filter((s) => !as.has(s)), n = [...at].filter((s) => as.has(s));
      at.clear(), n.forEach((s) => at.add(s)), qt = !1;
      try {
        await fu(t, e), wn = ir;
      } catch {
        qt = qt || e, await new Promise((a) => setTimeout(a, wn)), wn = Math.min(wn * 2, ku);
      }
    }
  })().finally(() => Ft = null), Ft);
}
function ha(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Ls.has(n)).forEach((n) => {
    at.add(n), t && dn.add(n);
  }), at.delete("settings") && rr(), xu();
}
const lr = () => {
  var e;
  return `typed-entries:${((e = ue.identity) == null ? void 0 : e.root) || location.host}:${ze.env()}`;
};
function $u(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ue.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Qo), Hn(lr(), ue.entries.slice(-50));
}
Tc((e) => ue.streamOpen || ha([e]));
const Ns = [], Mu = 2e3, st = /* @__PURE__ */ new Map(), _u = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Su = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function $t(e, { first: t = !1 } = {}) {
  t ? Ns.unshift(e) : Ns.push(e), st.clear();
}
function cr(e, t, n) {
  var a;
  const s = tr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Eu = (e) => tr(e.table).find((t) => t.id === e.id) === e.row, Au = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Qe(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Cu(e, t) {
  const n = [{ kind: "text", text: Qe(e).replace(/\r\n/g, `
`) }];
  for (const s of Ns)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Yt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Ou(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Ou(e) {
  return e.split(Su).map((t, n) => n % 2 ? t : t.replace(_u, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Wa(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Tu(e) {
  const [t, , ...n] = e, s = Wa(t).map((o) => `<th>${Yt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Wa(o).map((r) => `<td>${Yt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Iu(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Yt(a)}</li>`).join("")}</${s}>`;
}
const Ha = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function ur(e) {
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
      const i = t.findIndex((u, d) => d > s && /^(```|~~~)/.test(u)), l = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(s + 1, l).join(`
`)}</code></pre>`), s = l + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${Yt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ha(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Tu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(Iu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${ur(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Ha(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Yt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Ru = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Bu = (e) => e.kind !== "text" && !Ru.test(e.html);
function Lu(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(ur(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Bu(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Ps(e, t = { env: "" }) {
  const n = Au(e, t), s = st.get(n);
  if (st.delete(n), s && s.reads.every(Eu))
    return st.set(n, s), s.html;
  const a = [], o = Lu(Cu(e, { ...t, reads: a }));
  return st.set(n, { html: o, reads: a }), st.size > Mu && st.delete(st.keys().next().value), o;
}
const dr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Jt = (e) => String(e || "").replace(dr, (t, n, s, a) => a), Du = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), bn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Nu = /^Traceback \(most recent call last\):/m, Pu = 8;
function hr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Pu).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function ju(e) {
  const t = [...e.matchAll(Du)].map((s) => s.index);
  if (bn.lastIndex = 0, !t.length || !bn.test(e)) return null;
  bn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(bn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: hr(n), tail: "" } : null;
}
function qu(e) {
  const t = Nu.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: hr([o]), tail: n.slice(a).join(`
`) };
}
$t((e) => {
  const t = Jt(e), n = qu(t) || ju(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Fu = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Wu = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Hu = /[\w\]]\(/, Uu = /^[\w$.[\]'"]+\s*=\s*[^=]/, zu = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Vu = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Gu = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Ku = /[[({,]$/, Yu = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Ju = /^(\t|\s{2,})\S/, Zu = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*\/?|<!--)/, Xu = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Qu = /[{}()[\];=<>$&|*\\@+^~%]/g, fr = /^\s*(?:[-*+]|\d+[.)])\s/, ed = /^\s*>/, td = /^\s*\|/, nd = 0.6, sd = 0.4, ad = 5, od = 0.03, pr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= ad && t.every((n) => Xu.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Qu) ?? []).length / e.length < od;
}, os = (e) => {
  const t = e.trim();
  return [Fu, Wu, Hu, Uu, zu, Vu, Gu, Ku, Yu].some((n) => n.test(t)) || /[;{}]$/.test(t) || Ju.test(e) && !fr.test(e) && !pr(e);
};
function rd(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || fr.test(t[0]) || t.every((o) => ed.test(o) || td.test(o))) return "text";
  const n = t.filter((o) => !Zu.test(o.trim()));
  if (t.length === 1) return !n.length || os(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(os).length, a = n.filter((o) => !os(o) && pr(o)).length;
  return s >= n.length * nd && a <= n.length * sd ? "code" : "text";
}
const js = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", id = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", ld = `${js} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, cd = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", ud = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ua = {
  js: { keywords: js, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: id, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: ld, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: js, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: cd, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: ud, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function za(e, t, n) {
  return n && e.startsWith(n, t);
}
function dd(e, t) {
  const n = Ua[t] || Ua.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const r = (i, l) => l && a.push({ kind: i, value: l });
  for (; o < e.length; ) {
    const i = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), d = e.slice(o, u < 0 ? e.length : u);
      r(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), r("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (za(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && za(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), d = u < 0 ? e.length : u + n.block[1].length;
      r("comment", e.slice(o, d)), o = d;
      continue;
    }
    const l = (n.triple || []).find((u) => e.startsWith(u, o));
    if (l) {
      const u = e.indexOf(l, o + 3), d = u < 0 ? e.length : u + 3;
      r("string", e.slice(o, d)), o = d;
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
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, v = n.property && /^\s*:/.test(e.slice(o + d.length));
      r(s.has(f) ? "keyword" : v ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function hd(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of dd(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Qe(r) : `<span class="tok-${s}">${Qe(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function fd(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const pd = 1500, Va = /* @__PURE__ */ new WeakMap();
async function md(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await fd(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Va.get(t)), Va.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, pd)
  )));
}
typeof document < "u" && document.addEventListener("click", md, !0);
const gd = /\n\s*\n/, vd = /^(```|~~~)\s*(\w+)?\s*$/, yd = /^\s{4,}\S/, wd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, qs = /^\s*(?:[-*+]|\d+[.)])\s/, mr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, bd = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function fa(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function kd(e) {
  const t = fa(e.join(`
`));
  return (bd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const xd = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && mr.test(t) && !qs.test(t);
}, $d = (e, t) => qs.test(t) || qs.test([...e].reverse().find((n) => n.trim()) || "");
function Fs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${hd(fa(e.join(`
`)), t || kd(e)).join(`
`)}</code></pre></div>` };
}
function Md(e) {
  const t = e.split(gd).map((r) => ({ paragraph: r, kind: rd(fa(r).split(`
`)) })), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`

`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let r = o;
    for (; r < t.length && t[r].kind !== "text"; ) r += 1;
    const i = t.slice(o, r);
    if (i.some(({ kind: l }) => l === "code") || i.length > 1) {
      a(), n.push(Fs(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(Jt), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function _d(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...Md(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(vd);
    if (r) {
      const l = t.findIndex((d, f) => f > o && d.trim().startsWith(r[1])), u = l < 0 ? t.length : l;
      a(), n.push(Fs(t.slice(o + 1, u).map(Jt), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = xd(s) ? wd : yd;
    if (i.test(t[o]) && !$d(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && mr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (l - o + u.length >= 2) {
        a(), n.push(Fs([...u, ...t.slice(o, l)].map(Jt), "")), o = l;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
$t((e) => _d(e));
const Sd = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Ed = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Ad(e) {
  const t = Sd.exec(e);
  if (t && bt(t[1])) return { at: t.index, length: t[0].length, table: bt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Ed.exec(e), s = n && bt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Cd(e, t, n, s) {
  const a = cr(s, e, t), o = Jt(a ? Vc(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Qe(cn(e).title)} ${t}</span><span class="row-card-title">${Qe(o)}</span></a>`;
}
$t(
  (e, t) => {
    const n = Ad(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Cd(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Od = /\.(png|jpe?g|gif|webp|svg)$/i, Td = (e) => Od.test(e), Id = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Rd = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Bd(e, t) {
  const n = Id.exec(e), [, s, a, o, r, i] = n || [], l = n && bt(s || o), u = l && cr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = ze.in(t.env).fileUrl(l, u.id, i), f = `${cn(l).title} ${u.id} · ${Qe(i)}`, v = Td(i) ? `<img class="file-card-image" src="${d}" alt="${Qe(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Qe(i)}">${v}<span class="file-card-name">${f}</span></a>` };
}
function Ld(e) {
  const t = Rd.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Qe(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
$t(
  (e, t) => {
    if (t.inline) return null;
    const n = Bd(e, t) || Ld(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Dd = /`([^`\n]+)`/g;
$t((e) => e.replace(Dd, (t, n) => `<code>${n}</code>`));
const Ga = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Un.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
$t(
  (e, t) => e.replace(dr, (n, s, a, o) => Ga[s] ? Ga[s](a, o, t) : o)
);
const Nd = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, gr = new RegExp(`\\b(${Wo}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), vr = new RegExp(`\\b(${Wo}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Pd = new RegExp(`<code>((?:${gr.source}|${vr.source}))</code>`, "gi"), jd = (e) => e.replace(Pd, "$1"), qd = (e, t) => `<a class="row-pill" href="#" data-peek="${bt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Fd = (e) => e.replace(vr, (t, n, s) => s.replace(/\d+/g, (a) => qd(n.replace(/s$/i, ""), a))), Wd = (e) => Fd(e).replace(
  gr,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${bt(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
$t(
  (e, t) => t.rowNames === !1 ? e : jd(e).split(Nd).map((n, s) => s % 2 ? n : Wd(n)).join("")
);
const Hd = ["innerHTML"], Ud = ["innerHTML"], zd = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Ps(s, { env: Je.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => U(Ct) && U(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, Hd)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(Ct) && U(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, Ud));
  }
}, rt = /* @__PURE__ */ K(zd, [["__scopeId", "data-v-1a43d211"]]), Vd = { class: "fact" }, Gd = { class: "fact-label" }, Kd = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Vd, [
      m("span", Gd, b(e.label), 1),
      W(rt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Yd = /* @__PURE__ */ K(Kd, [["__scopeId", "data-v-3a88ecf8"]]), Jd = { class: "list" }, Zd = { class: "list-label" }, Xd = {
  key: 1,
  class: "list-note"
}, Qd = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Jd, [
      (c(!0), h(Y, null, se(e.items, (o, r) => (c(), G(xt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          m("span", Zd, b(o.label), 1),
          o.badge ? (c(), G(Ho, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : E("", !0),
          o.note ? (c(), h("span", Xd, b(o.note), 1)) : E("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, eh = /* @__PURE__ */ K(Qd, [["__scopeId", "data-v-ebe2ae0a"]]), th = { class: "table" }, nh = {
  key: 0,
  class: "table-row empty"
}, sh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", th, [
      m("div", {
        class: "table-row head",
        style: be(a.value)
      }, [
        (c(!0), h(Y, null, se(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, b(i), 1))), 128))
      ], 4),
      (c(!0), h(Y, null, se(e.rows, (i, l) => (c(), G(xt(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: J(["table-row", i.tone, { opens: i.open }]),
        style: be(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: V(() => [
          (c(!0), h(Y, null, se(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", nh, b(e.empty), 1)) : E("", !0)
    ]));
  }
}, ah = /* @__PURE__ */ K(sh, [["__scopeId", "data-v-9326a52e"]]), oh = { class: "stat-value" }, rh = { class: "stat-label" }, ih = {
  key: 0,
  class: "stat-note"
}, lh = {
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
    return (s, a) => (c(), G(xt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        m("span", oh, b(e.value), 1),
        m("span", rh, b(e.label), 1),
        e.note ? (c(), h("span", ih, b(e.note), 1)) : E("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ch = /* @__PURE__ */ K(lh, [["__scopeId", "data-v-ad0db6d6"]]), uh = { class: "code" }, dh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), G(oa, {
      value: e.node.type
    }, {
      stack: V(() => [
        W(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: V(() => [
        W(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: V(() => [
        W(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: V(() => [
        W(ac, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: V(() => [
        m("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, b(e.node.text), 3)
      ]),
      divider: V(() => [...r[2] || (r[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: V(() => [
        W(ch, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: V(() => [
        W(Xl, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: V(() => [
        W(ah, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: V(() => [
        W(eh, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: V(() => [
        W(rt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: V(() => [
        W(Yd, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: V(() => [
        W(Ho, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: V(() => [
        m("pre", uh, [
          m("code", null, b(e.node.text), 1)
        ])
      ]),
      file: V(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, b(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), yr = /* @__PURE__ */ K(dh, [["__scopeId", "data-v-cbdcf540"]]), hh = { class: "dashboard" }, fh = { class: "trail" }, ph = ["onClick"], mh = {
  key: 0,
  class: "gone",
  role: "status"
}, gh = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (v) => v in (n.document.pages || {}), o = D(!!n.page && !a(n.page)), r = D(n.page && !o.value ? [n.page] : []), i = R(() => r.value.at(-1) || n.document.start), l = R(() => (n.document.pages || {})[i.value] || null), u = (v) => ((n.document.pages || {})[v] || {}).title || v, d = (v) => {
      o.value = !1, r.value = [...r.value, v];
    }, f = (v) => {
      o.value = !1, r.value = r.value.slice(0, v);
    };
    return xe(
      () => n.document.start,
      () => r.value = []
    ), (v, y) => (c(), h("div", hh, [
      e.document.broken ? (c(), G(In, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          ce(b(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(In, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: V(() => [
          ce(b(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(Y, { key: 2 }, [
        m("nav", fh, [
          m("button", {
            type: "button",
            class: J(["step", { current: !r.value.length }]),
            onClick: y[0] || (y[0] = (O) => f(0))
          }, b(u(e.document.start)), 3),
          (c(!0), h(Y, null, se(r.value, (O, _) => (c(), h(Y, {
            key: `${_}-${O}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: J(["step", { current: _ === r.value.length - 1 }]),
              onClick: (w) => f(_ + 1)
            }, b(u(O)), 11, ph)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", mh, "What you opened is no longer in this dashboard. Here is its start page.")) : E("", !0),
        W(Bt, {
          name: "page",
          mode: "out-in"
        }, {
          default: V(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              W(yr, {
                node: l.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (O) => s("file", O))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : E("", !0)
    ]));
  }
}, mb = /* @__PURE__ */ K(gh, [["__scopeId", "data-v-fbe83734"]]);
function vh(e, t, n, s = () => window) {
  Fe(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ie(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const yh = (e, t = () => !0) => vh("keydown", (n) => n.key === "Escape" && t() && e());
function wr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = D(!1), a = R(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return yh(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const wh = 80, Et = na([]);
function br(e) {
  const t = Symbol("layer"), n = () => Et.includes(t) && Et.splice(Et.indexOf(t), 1);
  return xe(
    e,
    (s) => {
      s && !Et.includes(t) && Et.push(t), s || n();
    },
    { immediate: !0 }
  ), Ie(n), R(() => wh + Math.max(0, Et.indexOf(t)));
}
let kr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return kr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const bh = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function kh(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(bh)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Fe(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : kr, document.addEventListener("keydown", a), rn(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const xh = ["aria-modal", "aria-label", "aria-labelledby"], $h = {
  key: 0,
  class: "dialog-head"
}, Mh = ["id", "tabindex"], _h = {
  key: 1,
  class: "dialog-foot"
}, Sh = 500, Eh = 400, Ah = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = wr(s, n), i = br(a), l = D(null), u = D(null), d = D(null), f = To(), v = D(!1), y = Date.now();
    n.modal && kh(u, () => s("escape"), d);
    function O() {
      if (!n.modal) return n.closable && o();
      v.value = !0, setTimeout(() => v.value = !1, Eh);
    }
    function _(M) {
      !n.modal || Date.now() - y >= Sh || ![" ", "Enter"].includes(M.key) || (M.preventDefault(), M.stopPropagation());
    }
    const w = () => l.value && (l.value.scrollTop = l.value.scrollHeight), x = new MutationObserver(w);
    return xe(l, (M) => {
      x.disconnect(), M && n.follow && (x.observe(M, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Ie(() => x.disconnect()), (M, z) => (c(), G(sa, { to: "body" }, [
      W(Bt, {
        name: "dialog",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: V(() => [
          U(a) ? (c(), h("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: be({ zIndex: U(i) }),
            onClick: ke(O, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: u,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: v.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? U(f) : void 0,
              onKeydownCapture: _
            }, [
              e.bare ? E("", !0) : (c(), h("header", $h, [
                m("h3", {
                  id: U(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, Mh),
                e.closable ? (c(), G(Vn, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : E("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: l,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                he(M.$slots, "default", {}, void 0, !0)
              ], 2),
              M.$slots.foot ? (c(), h("footer", _h, [
                he(M.$slots, "foot", {}, void 0, !0)
              ])) : E("", !0)
            ], 42, xh)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ch = /* @__PURE__ */ K(Ah, [["__scopeId", "data-v-6d1ecd98"]]), nt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Oh = 6;
function pa(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Th = (e) => {
  const t = pa(e, nt.lineChars), n = Math.max(nt.minWidth, Math.max(...t.map((s) => s.length)) * nt.charWidth + nt.padX * 2);
  return { name: e, lines: t, line: nt.line, padY: nt.padY, width: n, height: t.length * nt.line + nt.padY * 2 };
};
function Ih(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function Rh(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Bh(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, l) => [i, l]))), o = (r, i) => {
    const l = a(), u = (d) => {
      const f = i(d).map((v) => l.get(v));
      return f.length ? f.reduce((v, y) => v + y, 0) / f.length : l.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < Oh; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((v) => v[i ? 1 : 0] === f).map((v) => v[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function Lh(e, t) {
  const n = /* @__PURE__ */ new Map(), s = (a, o, r, i) => {
    const l = `${a[o]}:${r}`;
    (n.get(l) || n.set(l, []).get(l)).push({ arrow: a, end: o, other: i });
  };
  e.forEach((a) => {
    s(a, "from", a.back ? "top" : "bottom", a.to), s(a, "to", a.back ? "bottom" : "top", a.from);
  });
  for (const a of n.values())
    a.sort((o, r) => t.get(o.other).x - t.get(r.other).x), a.forEach(({ arrow: o, end: r }, i) => o[`${r}Share`] = (i + 1) / (a.length + 1));
}
function Dh(e) {
  const t = [...new Set(e.flatMap(([$, g]) => [$, g]))], n = new Set(e.map(([, $]) => $)), s = t.filter(($) => !n.has($)), a = Ih(t, e, s.length ? s : t.slice(0, 1)), o = e.filter(($, g) => !a.has(g)), r = Rh(t, o), i = Bh(t, o, r), l = new Map(t.map(($) => [$, Th($)])), u = i.map(($) => $.reduce((g, I) => g + l.get(I).width, 0) + Pe.across * ($.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = Ph(e, r, i.length), v = /* @__PURE__ */ new Map();
  let y = Pe.margin;
  i.forEach(($, g) => {
    let I = (d - u[g]) / 2;
    const A = Math.max(...$.map((P) => l.get(P).height));
    $.forEach((P) => {
      const S = l.get(P);
      v.set(P, { ...S, x: I, y: y + (A - S.height) / 2 }), I += S.width + Pe.across;
    }), y += A + (f[g] ?? Pe.down);
  });
  const O = e.map(([$, g, I], A) => ({ from: $, to: g, label: I || "", back: a.has(A) || r.get(g) <= r.get($) }));
  Lh(O, v);
  const _ = O.map(($) => jh($, v.get($.from), v.get($.to))), w = [...v.values()], x = Hh(_, w), M = Math.max(y - Pe.down, ...x.filter(($) => $.label).map(($) => $.label.y + $.label.height));
  return { width: Math.max(d - Pe.margin, ...x.filter(($) => $.label).map(($) => $.label.x + $.label.width)) + Pe.margin, height: M + Pe.margin, nodes: w, arrows: x };
}
const Nh = (e) => e ? pa(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function Ph(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += Nh(r) + Pe.labelSpace);
  }), s.map((a) => Math.max(Pe.down, a));
}
function jh(e, t, n) {
  const s = e.label ? pa(e.label, qe.lineChars) : [], a = s.length ? Math.max(...s.map((v) => v.length)) * qe.charWidth + qe.pad * 2 : 0, o = s.length * qe.line + (s.length ? qe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const qh = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, Fh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Wh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function Hh(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = qh(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = Wh.flatMap((l) => Fh.map((u) => a(u, l))).find((l) => !n.some((u) => Ka(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => Ka(i, l)); ) i.y += qe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: qe.line, pad: qe.pad } };
  });
}
const Ka = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Uh = { class: "flowchart-tools" }, zh = ["width", "height", "viewBox", "aria-label"], Vh = ["d"], Gh = ["x", "y", "width", "height"], Kh = ["x", "y"], Yh = ["x", "dy"], Jh = {
  key: 0,
  class: "flowchart-label"
}, Zh = ["x", "y", "width", "height"], Xh = ["x", "y"], Qh = ["x", "dy"], ef = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Dh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = D(null), i = D({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var x;
      const _ = (x = r.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(_ != null && _.width)) return;
      const w = Math.min(_.width / a.value.width, _.height / a.value.height, 1.5);
      i.value = { zoom: w, x: (_.width - a.value.width * w) / 2, y: (_.height - a.value.height * w) / 2 };
    }
    function d(_, w, x) {
      const { zoom: M, x: z, y: $ } = i.value, g = Math.min(o.most, Math.max(o.least, M * _));
      i.value = { zoom: g, x: w - (w - z) * g / M, y: x - (x - $) * g / M };
    }
    function f(_) {
      const w = r.value.getBoundingClientRect();
      d(_, w.width / 2, w.height / 2);
    }
    function v(_) {
      const w = r.value.getBoundingClientRect();
      _.ctrlKey || _.metaKey ? d(_.deltaY < 0 ? o.step : 1 / o.step, _.clientX - w.left, _.clientY - w.top) : i.value = { ...i.value, x: i.value.x - _.deltaX, y: i.value.y - _.deltaY };
    }
    function y(_) {
      var w, x, M;
      _.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), l = { x: _.clientX - i.value.x, y: _.clientY - i.value.y }, (M = (x = r.value).setPointerCapture) == null || M.call(x, _.pointerId);
    }
    function O(_) {
      l && (i.value = { ...i.value, x: _.clientX - l.x, y: _.clientY - l.y });
    }
    return Fe(u), (_, w) => (c(), G(Ch, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (x) => s("close"))
    }, {
      default: V(() => [
        m("div", Uh, [
          W(we, {
            small: "",
            onClick: w[0] || (w[0] = (x) => f(o.step))
          }, {
            default: V(() => [...w[5] || (w[5] = [
              ce("Zoom in", -1)
            ])]),
            _: 1
          }),
          W(we, {
            small: "",
            onClick: w[1] || (w[1] = (x) => f(1 / o.step))
          }, {
            default: V(() => [...w[6] || (w[6] = [
              ce("Zoom out", -1)
            ])]),
            _: 1
          }),
          W(we, {
            small: "",
            onClick: u
          }, {
            default: V(() => [...w[7] || (w[7] = [
              ce("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: ke(v, ["prevent"]),
          onPointerdown: y,
          onPointermove: O,
          onPointerup: w[2] || (w[2] = (x) => Oa(l) ? l.value = null : l = null),
          onPointercancel: w[3] || (w[3] = (x) => Oa(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: be({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            w[8] || (w[8] = m("defs", null, [
              m("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                m("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (c(!0), h(Y, null, se(a.value.arrows, (x, M) => (c(), h("path", {
              key: `arrow-${M}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Vh))), 128)),
            (c(!0), h(Y, null, se(a.value.nodes, (x) => (c(), h("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, Gh),
              m("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (c(!0), h(Y, null, se(x.lines, (M, z) => (c(), h("tspan", {
                  key: z,
                  x: x.x + x.width / 2,
                  dy: z ? x.line : 0
                }, b(M), 9, Yh))), 128))
              ], 8, Kh)
            ]))), 128)),
            (c(!0), h(Y, null, se(a.value.arrows, (x, M) => (c(), h(Y, {
              key: `label-${M}`
            }, [
              x.label ? (c(), h("g", Jh, [
                m("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, Zh),
                m("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (c(!0), h(Y, null, se(x.label.lines, (z, $) => (c(), h("tspan", {
                    key: $,
                    x: x.label.x + x.label.width / 2,
                    dy: $ ? x.label.line : 0
                  }, b(z), 9, Qh))), 128))
                ], 8, Xh)
              ])) : E("", !0)
            ], 64))), 128))
          ], 12, zh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, tf = /* @__PURE__ */ K(ef, [["__scopeId", "data-v-51d24cfe"]]), Ya = {
  words: '<rect x="2.5" y="3" width="11" height="8" rx="2"/><polyline points="5,11 5,13.5 8,11"/>',
  summary: '<line x1="3" y1="4.5" x2="13" y2="4.5"/><line x1="3" y1="8" x2="11" y2="8"/><line x1="3" y1="11.5" x2="8" y2="11.5"/>',
  warning: '<polygon points="8,2.5 14,13 2,13"/><line x1="8" y1="6.5" x2="8" y2="9.3"/><circle class="f" cx="8" cy="11.2" r=".75"/>',
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
}, nf = ["innerHTML"], sf = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => Ya[t.name] || Ya.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, nf));
  }
}, et = /* @__PURE__ */ K(sf, [["__scopeId", "data-v-beb5935c"]]), af = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      W(et, { name: "fold" })
    ], 2));
  }
}, Zt = /* @__PURE__ */ K(af, [["__scopeId", "data-v-d03899bb"]]), of = ["data-tip", "aria-label"], rf = {
  key: 0,
  class: "mact-word"
}, lf = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      W(et, { name: "open" }),
      e.open ? (c(), h("span", rf, b(e.label), 1)) : E("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, of));
  }
}, xr = /* @__PURE__ */ K(lf, [["__scopeId", "data-v-3b292e09"]]), cf = 120, rs = 280, uf = 160, df = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, hf = ["leaving", "resizing", "entering"];
function ff(e) {
  const t = hf.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = { width: e.offsetWidth, height: e.offsetHeight };
  return e.classList.add(...t), n;
}
function $r(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = D(t()), a = D("");
  let o = 0;
  const r = (u, d) => Object.assign(u.style, { width: `${d.width}px`, height: `${d.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const d = e.value, f = ++o;
    if (!d || !d.offsetWidth || df()) {
      s.value = u;
      return;
    }
    const v = { width: d.offsetWidth, height: d.offsetHeight };
    if (r(d, v), a.value = "leaving", await n(cf), f !== o) return;
    s.value = u, a.value = "resizing", await rn(), i(d);
    const y = ff(d);
    r(d, v), d.offsetWidth, d.style.transition = `width ${rs}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${rs}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(d, y), await n(rs), f === o && (i(d), a.value = "entering", await n(uf), f === o && (a.value = ""));
  }
  return xe(t, (u) => l(u)), Lt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const pf = { class: "growing-card-top" }, mf = ["aria-expanded"], gf = { class: "growing-card-avatar" }, vf = { class: "growing-card-title" }, yf = { class: "growing-card-more" }, wf = { class: "growing-card-body" }, bf = {
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
    const n = e, s = t, a = D(!1), o = D(null), { folded: r, phase: i } = $r(o, () => !a.value), l = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", U(i), { open: !U(r), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", pf, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (v) => a.value = !a.value)
        }, [
          m("span", gf, [
            e.bad ? (c(), G(et, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(Y, { key: 1 }, [
              ce(b(l.value), 1)
            ], 64)) : (c(), G(ve, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", vf, b(e.title), 1),
          W(Zt, { open: a.value }, null, 8, ["open"])
        ], 8, mf),
        e.action ? (c(), G(xr, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (v) => s("act"))
        }, null, 8, ["label", "open"])) : E("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (v) => s("comment"))
        }, [
          W(ve, {
            name: "bubble",
            size: 13
          })
        ])) : E("", !0)
      ]),
      m("div", yf, [
        m("div", wf, [
          (c(!0), h(Y, null, se(u.value, (v, y) => (c(), h("p", {
            key: y,
            class: "growing-card-text"
          }, b(v), 1))), 128))
        ])
      ])
    ], 2));
  }
}, kf = /* @__PURE__ */ K(bf, [["__scopeId", "data-v-08411e3a"]]), xf = ["title", "aria-label"], $f = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Mf = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, _f = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: J(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", $f, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", Mf)) : E("", !0)
      ]))
    ], 10, xf));
  }
}, Sf = /* @__PURE__ */ K(_f, [["__scopeId", "data-v-6dc92808"]]);
function Ef(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Ws(e) {
  const t = Ef(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Mr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Ja(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const is = (e) => String(e).padStart(2, "0");
function Af(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${is(t % 60)}s` : `${Math.floor(t / 3600)}h ${is(Math.floor(t % 3600 / 60))}m ${is(t % 60)}s`;
}
const Cf = "img,pre,table";
function Of(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Tf(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function If(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Cf)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Of(Tf(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Rf(e, t) {
  let n = null;
  const s = () => e.value && If(e.value);
  Fe(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), xe(t, s, { flush: "post" });
}
const Bf = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Lf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Df = ["data-incoming", "data-ref"], Nf = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Pf = { class: "message-body" }, jf = ["title"], qf = ["innerHTML"], Ff = ["title"], Wf = ["innerHTML"], Hf = {
  class: "message-faces",
  "data-message-faces": ""
}, Uf = ["title", "data-face", "onClick"], zf = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Vf = ["title", "data-reaction", "onClick"], Gf = {
  key: 0,
  class: "message-reaction-count"
}, Kf = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Yf = ["href", "title"], Jf = ["src", "alt"], Zf = ["href"], Xf = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, Qf = {
  key: 1,
  "data-message-links-rows": ""
}, e1 = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, t1 = ["data-sent-worker", "title", "onClick"], n1 = { class: "message-foot" }, s1 = { class: "message-time" }, a1 = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, o1 = 140, r1 = 2, i1 = 1500, l1 = "An earlier message", c1 = "about", u1 = "sent_to", d1 = 3, h1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var de;
    const n = e, s = t, a = D(!1), o = D(null), r = R(() => ["user", "comment"].includes(n.message.type)), i = R(() => {
      const [Q, ee] = (n.message.commented_row || ":").split(":"), Z = bt(Q);
      return Z ? { ref: `${Z}:${ee}`, label: `${cn(Z).title.toLowerCase()} ${ee}` } : null;
    }), l = R(() => n.message.worker_id ?? null), u = D(!1), d = R(() => l.value !== null && ((n.message.text ?? "").length > o1 || (n.message.text ?? "").split(`
`).filter((Q) => Q.trim()).length > r1)), f = R(() => r.value && !n.message.read_at && !n.message.local);
    async function v() {
      var Q;
      await ((Q = navigator.clipboard) == null ? void 0 : Q.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, i1);
    }
    const y = R(() => Ps(n.message.text ?? "", { env: "" })), O = R(() => JSON.parse(n.message.flowchart_edges || "[]")), _ = D(!1), w = R(() => Ps(n.quote || l1, { env: "" }));
    function x() {
      const Q = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Q ? Q.scrollIntoView({ block: "center", behavior: "smooth" }) : Ze(`messages:${n.message.parent_id}`);
    }
    Rf(o, () => `${n.message.text} ${n.quote}`);
    const M = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, z = (Q) => `/api/files/message/${n.message.id}/${encodeURIComponent(Q)}`, $ = R(() => JSON.parse(n.message.captions || "{}")), g = R(() => (n.message.files ?? []).map((Q) => ({ name: Q, address: z(Q), isImage: M.test(Q), title: $.value[Q] || Q }))), I = R(() => Mr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), A = Te(Be, null), P = D([]), S = D([]), T = D(!1), k = R(() => `Linked: ${P.value.join(", ")}`), p = R(() => P.value.length >= d1), B = R(() => `${P.value.length} linked ${P.value.every((Q) => Q.startsWith("task ")) ? "tasks" : "rows"}`);
    async function L() {
      if (!r.value || !(A != null && A.read) || n.message.local) return;
      const Q = await A.read(`link list --source message:${n.message.id}`);
      if (!Q.ok) return;
      const ee = Q.value.rows ?? Q.value ?? [];
      P.value = ee.filter((Z) => Z.link_type === c1).map((Z) => `${Z.target_model} ${Z.target_id}`), S.value = ee.filter((Z) => Z.link_type === u1).map((Z) => Z.target_id);
    }
    L(), (de = A == null ? void 0 : A.follow) == null || de.call(A, ["link.*"], L);
    const q = D(!1), re = R(() => Lf(n.message.reactions));
    function le(Q) {
      q.value = !1, s("react", n.message, Q);
    }
    return (Q, ee) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      W(kf, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (Z) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Df)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Pf, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: i.value }]),
          onClick: ee[6] || (ee[6] = (...Z) => U(Ct) && U(Ct)(...Z))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ee[1] || (ee[1] = ke((Z) => U(Ze)(i.value.ref), ["stop"]))
          }, [
            W(ve, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + b(i.value.label), 1)
          ], 8, jf)) : E("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: ke(x, ["stop"]),
            innerHTML: w.value
          }, null, 8, qf)) : E("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: ee[2] || (ee[2] = ke((Z) => U(Ze)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + b(l.value), 9, Ff)) : E("", !0),
          m("div", {
            class: J({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, Wf),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ee[3] || (ee[3] = ke((Z) => u.value = !u.value, ["stop"]))
          }, b(u.value ? "Show less" : "Show more"), 1)) : E("", !0),
          O.value.length ? (c(), h(Y, { key: 4 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[4] || (ee[4] = (Z) => _.value = !0)
            }, "Open the flowchart"),
            _.value ? (c(), G(tf, {
              key: 0,
              title: e.message.text,
              edges: O.value,
              onClose: ee[5] || (ee[5] = (Z) => _.value = !1)
            }, null, 8, ["title", "edges"])) : E("", !0)
          ], 64)) : E("", !0)
        ], 2),
        m("div", {
          class: J(["message-tools", { picking: q.value }]),
          "data-message-tools": ""
        }, [
          q.value ? (c(), h(Y, { key: 0 }, [
            m("div", Hf, [
              (c(!0), h(Y, null, se(U(Bf), (Z) => (c(), h("button", {
                key: Z,
                type: "button",
                class: "message-face",
                title: `React ${Z}`,
                "data-face": Z,
                onClick: (Le) => le(Z)
              }, b(Z), 9, Uf))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[7] || (ee[7] = (Z) => q.value = !1)
            }, [
              W(ve, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(Y, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ee[8] || (ee[8] = (Z) => q.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ee[9] || (ee[9] = (Z) => s("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: v
            }, b(a.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ee[10] || (ee[10] = (Z) => s("delete", e.message))
            }, "Delete")) : E("", !0)
          ], 64))
        ], 2)
      ]),
      re.value.length ? (c(), h("div", zf, [
        (c(!0), h(Y, null, se(re.value, (Z) => (c(), h("button", {
          key: Z.emoji,
          type: "button",
          class: J(["message-reaction", { mine: Z.mine }]),
          title: Z.title,
          "data-reaction": Z.emoji,
          onClick: (Le) => s("react", e.message, Z.emoji)
        }, [
          ce(b(Z.emoji) + " ", 1),
          Z.count > 1 ? (c(), h("span", Gf, b(Z.count), 1)) : E("", !0)
        ], 10, Vf))), 128))
      ])) : E("", !0),
      g.value.length ? (c(), h("div", Kf, [
        (c(!0), h(Y, null, se(g.value, (Z) => (c(), h(Y, {
          key: Z.name
        }, [
          Z.isImage ? (c(), h("a", {
            key: 0,
            href: Z.address,
            target: "_blank",
            class: "message-image",
            title: Z.title
          }, [
            m("img", {
              src: Z.address,
              alt: Z.name,
              "data-figure-picture": ""
            }, null, 8, Jf)
          ], 8, Yf)) : (c(), h("a", {
            key: 1,
            href: Z.address,
            target: "_blank",
            class: "message-file"
          }, b(Z.name), 9, Zf))
        ], 64))), 128))
      ])) : E("", !0),
      P.value.length ? (c(), h("div", Xf, [
        W(et, {
          class: "message-links-icon",
          name: "linked"
        }),
        p.value && !T.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: ee[11] || (ee[11] = (Z) => T.value = !0)
        }, b(B.value), 1)) : (c(), h("span", Qf, [
          W(rt, {
            text: k.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : E("", !0),
      S.value.length ? (c(), h("div", e1, [
        W(ve, {
          name: "send",
          size: 12
        }),
        (c(!0), h(Y, null, se(S.value, (Z) => (c(), h("button", {
          key: Z,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Z,
          title: `Open worker ${Z}`,
          onClick: ke((Le) => U(Ze)(`agents:${Z}`), ["stop"])
        }, "Also sent to worker " + b(Z), 9, t1))), 128))
      ])) : E("", !0),
      m("div", n1, [
        m("time", s1, b(I.value), 1),
        Number.isInteger(e.message.id) ? (c(), h("span", a1, "message " + b(e.message.id), 1)) : E("", !0),
        r.value ? (c(), G(Sf, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : E("", !0)
      ])
    ], 8, Nf));
  }
}, gb = /* @__PURE__ */ K(h1, [["__scopeId", "data-v-817edd99"]]), Ln = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ls = 200, _r = (e) => {
  var t;
  return ((t = Ln.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Ln[0].key;
}, vb = (e) => {
  var t;
  return ((t = Ln.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, f1 = ["aria-label"], p1 = 300, Za = 400, m1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ls } },
  setup(e) {
    const t = e, n = R(() => _r(t.value)), s = R(() => n.value < ls ? [1, 0.25, 0.25] : n.value === ls ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: J(["ico", "prio", { hot: n.value >= Za, high: n.value >= p1 && n.value < Za }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      m("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: be({ opacity: s.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: be({ opacity: s.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: be({ opacity: s.value[2] })
      }, null, 4)
    ], 10, f1));
  }
}, yb = /* @__PURE__ */ K(m1, [["__scopeId", "data-v-b10e610f"]]), g1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Xa = (e) => g1[e.card.state] || "idle", v1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), Qa = { working: 0, waiting: 1, idle: 2, stopped: 3 }, eo = (e, t) => Qa[Xa(e)] - Qa[Xa(t)], to = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, wb = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => eo(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || v1(s, a)) : [...e].sort((s, a) => eo(s, a) || (to[t] || to.state)(s, a)), y1 = ["aria-checked", "aria-haspopup", "onClick"], w1 = {
  key: 0,
  class: "segmented-dot"
}, b1 = {
  key: 1,
  class: "segmented-count"
}, k1 = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = To();
    return (a, o) => {
      const r = Oi("tip");
      return c(), h("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(Y, null, se(e.options, (i) => dt((c(), h("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: J(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), h("span", w1)) : E("", !0),
          ce(" " + b(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", b1, b(i.count), 1)) : E("", !0)
        ], 10, y1)), [
          [r, i.tip || i.title, `${U(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, x1 = /* @__PURE__ */ K(k1, [["__scopeId", "data-v-ca953072"]]), $1 = { class: "form-field" }, M1 = { class: "form-field-head" }, _1 = ["for"], S1 = {
  key: 0,
  class: "form-field-aside"
}, E1 = {
  key: 0,
  class: "form-field-help"
}, A1 = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", $1, [
      m("div", M1, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, b(e.label), 9, _1),
        t.$slots.aside ? (c(), h("span", S1, [
          he(t.$slots, "aside", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      he(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", E1, b(e.help), 1)) : E("", !0)
    ]));
  }
}, bb = /* @__PURE__ */ K(A1, [["__scopeId", "data-v-dd7cdcff"]]), C1 = { class: "list-row" }, O1 = {
  key: 0,
  class: "list-row-kind"
}, T1 = { class: "list-row-main" }, I1 = {
  key: 0,
  class: "list-row-title"
}, R1 = { class: "list-row-body" }, B1 = {
  key: 1,
  class: "list-row-end"
}, L1 = {
  key: 1,
  class: "list-row-text"
}, D1 = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", C1, [
      e.kind ? (c(), h("span", O1, b(e.kind), 1)) : E("", !0),
      m("div", T1, [
        e.title ? (c(), h("span", I1, b(e.title), 1)) : E("", !0),
        m("div", R1, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", B1, [
          he(t.$slots, "end", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      e.text ? (c(), h("span", L1, b(e.text), 1)) : E("", !0)
    ]));
  }
}, kb = /* @__PURE__ */ K(D1, [["__scopeId", "data-v-63155fba"]]), N1 = {
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
}, P1 = { claude: "Claude Code", codex: "Codex" }, j1 = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, q1 = {
  key: 1,
  class: "menu-item-text"
}, F1 = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", j1, b(e.checked ? "✓" : ""), 1)) : E("", !0),
      e.description ? (c(), h("span", q1, [
        m("span", null, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, b(e.description), 1)
      ])) : he(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, It = /* @__PURE__ */ K(F1, [["__scopeId", "data-v-fec99974"]]), W1 = (e, t, n) => Math.max(t, Math.min(n, e)), H1 = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Sr = /* @__PURE__ */ new WeakMap(), U1 = (e, t) => Sr.set(e, t);
function z1(e, t) {
  for (let n = t; n; n = Sr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function V1(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !z1(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const At = 8, G1 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = D(null), o = (p) => p ? `${p}px` : void 0, r = R(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = D({ w: 0, h: 0 }), l = D(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const B = p.closest(".pane, .float-window");
      return B ? d(B.getBoundingClientRect()) : u();
    }, v = (p, B) => `${Math.max(0, p ? Math.min(p, B) : B)}px`;
    function y(p, B) {
      return {
        below: p.bottom - B.bottom - s.gap - At,
        above: B.top - p.top - s.gap - At,
        across: p.right - p.left - 2 * At
      };
    }
    function O(p) {
      const B = f(s.anchor), L = y(B, p);
      return i.value.w <= L.across && i.value.h <= Math.max(L.below, L.above) ? B : u();
    }
    const _ = R(() => {
      if (!l.value) return r.value;
      const p = l.value, B = O(p), L = y(B, p), { w: q, h: re } = i.value, le = s.align === "auto" ? p.left + p.right > B.left + B.right : s.align === "right", de = W1(le ? p.right - q : p.left, B.left + At, Math.max(B.left + At, B.right - q - At)), ee = re > L.below && L.above > L.below ? { bottom: `${window.innerHeight - p.top + s.gap}px`, maxHeight: v(s.maxHeight, L.above) } : { top: `${p.bottom + s.gap}px`, maxHeight: v(s.maxHeight, L.below) };
      return { ...r.value, ...ee, left: `${de}px`, maxWidth: v(s.maxWidth, L.across) };
    }), w = n, x = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function M(p) {
      const B = x(), L = B.indexOf(document.activeElement);
      B[(L + p + B.length) % B.length].focus();
    }
    const z = { ArrowDown: () => M(1), ArrowUp: () => M(-1), Escape: () => w("close") }, $ = (p) => z[p.key] && (p.preventDefault(), z[p.key]()), g = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let I = 0;
    const A = new ResizeObserver(() => {
      cancelAnimationFrame(I), I = requestAnimationFrame(g);
    });
    V1(a, (p) => s.anchor && !s.anchor.contains(p.target) && w("close"));
    const P = (p, B) => ["top", "left", "right", "bottom"].some((L) => Math.abs(p[L] - B[L]) > 1), S = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let T = 0;
    function k() {
      if (s.anchor) {
        const p = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || S(p)) return w("close");
        P(p, l.value) && (l.value = p);
      }
      T = requestAnimationFrame(k);
    }
    return Fe(() => {
      s.anchor && a.value && U1(a.value, s.anchor), g(), a.value && A.observe(a.value), !s.plain && x()[0] && x()[0].focus(), k();
    }), Ie(() => {
      A.disconnect(), cancelAnimationFrame(T), cancelAnimationFrame(I);
    }), t({ element: a }), (p, B) => (c(), G(sa, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", ut({
        ref_key: "panel",
        ref: a
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: _.value,
        onKeydown: $
      }), [
        he(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ma = /* @__PURE__ */ K(G1, [["__scopeId", "data-v-3d203970"]]), K1 = ["aria-expanded"], Y1 = { class: "drop-label" }, J1 = ["value"], Z1 = {
  key: 1,
  class: "drop-lead"
}, X1 = { class: "drop-item-text" }, Q1 = {
  key: 2,
  class: "drop-note"
}, ep = {
  key: 1,
  class: "drop-none"
}, tp = {
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
    const n = e, s = t, a = D(!1), o = D(null), r = D(""), i = R(() => {
      const u = r.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function l(u) {
      a.value = !1, s("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: J(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      m("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: J(["drop-head", { on: a.value }]),
        "aria-expanded": a.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => a.value = !a.value)
      }, [
        e.icon ? (c(), G(ve, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : E("", !0),
        m("span", Y1, b(e.label), 1),
        W(ve, {
          name: "down",
          size: 11
        })
      ], 10, K1),
      a.value ? (c(), G(ma, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => a.value = !1)
      }, {
        default: V(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => r.value = f.target.value)
          }, null, 40, J1)) : E("", !0),
          (c(!0), h(Y, null, se(i.value, (f) => (c(), G(It, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (v) => l(f)
          }, {
            default: V(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: J(["drop-dot", { live: f.running }])
              }, null, 2)) : E("", !0),
              f.lead ? (c(), h("span", Z1, b(f.lead), 1)) : E("", !0),
              m("span", X1, b(f.label), 1),
              f.note ? (c(), h("span", Q1, b(f.note), 1)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? E("", !0) : (c(), h("p", ep, b(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : E("", !0)
    ], 2));
  }
}, np = /* @__PURE__ */ K(tp, [["__scopeId", "data-v-29dfcce5"]]), xb = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => [
      ...N1[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = R(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (r, i) => (c(), G(np, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${U(P1)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, sp = ["aria-label"], ap = { class: "head" }, op = { class: "names" }, rp = { class: "body" }, ip = {
  key: 0,
  class: "foot"
}, lp = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = wr(s, n), i = br(a);
    return (l, u) => (c(), G(sa, { to: "body" }, [
      W(Bt, {
        name: "side",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: V(() => [
          U(a) ? (c(), h("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: be({ "--depth": e.depth, zIndex: U(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = ke((...d) => U(o) && U(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(Y, { key: 0 }, [
                m("header", ap, [
                  m("div", op, [
                    m("h2", null, b(e.title), 1),
                    e.abstract ? (c(), G(rt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : E("", !0)
                  ]),
                  he(l.$slots, "actions", {}, void 0, !0),
                  W(Vn, {
                    title: e.closeLabel,
                    onClick: U(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                m("div", rp, [
                  he(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", ip, [
                  he(l.$slots, "foot", {}, void 0, !0)
                ])) : E("", !0)
              ], 64)) : he(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, sp)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, $b = /* @__PURE__ */ K(lp, [["__scopeId", "data-v-c9a3f43a"]]), Hs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, cp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = aa(), n = R(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => dt((c(), h("textarea", ut({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [U(Hs), U(t).value]
    ]);
  }
}), Mb = /* @__PURE__ */ K(cp, [["__scopeId", "data-v-e130a5b9"]]), up = {
  key: 1,
  class: "text-field-label"
}, dp = {
  key: 2,
  class: "text-field-end"
}, hp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Cs({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = As(e, "modelValue"), s = aa(), a = "onUpdate:modelValue" in (((d = Ti()) == null ? void 0 : d.vnode.props) || {}), o = R(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = R(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = R(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = D(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, v) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: f.$slots.end }, U(s).class]),
      style: be(U(s).style)
    }, [
      e.icon ? (c(), G(ve, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : E("", !0),
      e.label ? (c(), h("span", up, b(e.label), 1)) : E("", !0),
      dt(m("input", ut({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [U(Hs), o.value]
      ]),
      f.$slots.end ? (c(), h("span", dp, [
        he(f.$slots, "end", {}, void 0, !0)
      ])) : E("", !0)
    ], 6)) : dt((c(), h("input", ut({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [U(Hs), o.value]
    ]);
  }
}), _b = /* @__PURE__ */ K(hp, [["__scopeId", "data-v-d9c38ca8"]]), no = (e) => e.page * e.size < e.total;
function fp(e, t, { incremental: n = !1 } = {}) {
  const s = Wn(), a = D([]), o = D(""), r = D(!1), i = D(!1), l = D(""), u = D(null);
  async function d(w) {
    const x = await s.read(`${e} --before-id ${w + 1} --limit 1`);
    if (!x.ok) return O();
    const M = x.value.rows.find((z) => z.id === w);
    a.value = M ? a.value.map((z) => z.id === w ? M : z) : a.value.filter((z) => z.id !== w);
  }
  async function f(w) {
    if (n && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== w.row_id));
    if (n && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && a.value.some((g) => g.id === w.row_id)) return d(w.row_id);
    if (!(n && a.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return O();
    const M = Math.max(...a.value.map((g) => g.id)), z = await s.read(`${e} --after-id ${M}`);
    if (!z.ok) return O();
    const $ = new Set(a.value.map((g) => g.id));
    a.value = [...z.value.rows.filter((g) => !$.has(g.id)), ...a.value];
  }
  async function v() {
    if (!a.value.length) return !1;
    const w = Math.min(...a.value.map((z) => z.id)), x = await s.read(`${e} --before-id ${w}`);
    if (!x.ok || !x.value.rows.length) return i.value = !1;
    i.value = no(x.value);
    const M = new Set(a.value.map((z) => z.id));
    return a.value = [...a.value, ...x.value.rows.filter((z) => !M.has(z.id))], !0;
  }
  let y = 0;
  async function O() {
    const w = ++y, x = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (w !== y) return;
    const M = x.ok ? s.shared ? [x.value] : x.value.rows : [], z = M.length ? Math.min(...M.map(($) => $.id)) : 0;
    a.value = n && x.ok && z ? [...a.value.filter(($) => $.id > Math.max(...M.map((g) => g.id))), ...M, ...a.value.filter(($) => $.id < z)] : M, x.ok && !a.value.some(($) => $.id < z) && (i.value = !s.shared && no(x.value)), o.value = x.ok ? "" : x.error, r.value = !0;
  }
  async function _(w, x = null) {
    const M = a.value;
    x && (a.value = x(M));
    const z = await s.run(w);
    return x && !z.ok && (a.value = M), l.value = z.ok ? "" : z.error, u.value = z.ok ? z.value : null, await O(), z;
  }
  return s.follow(t, f), O(), { rows: a, failure: o, loaded: r, more: i, load: O, older: v, act: _, actionFailure: l, answer: u, context: s };
}
const pp = { class: "title" }, mp = { class: "state" }, gp = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = fp(t.line, t.events);
    return (o, r) => (c(), G(Tl, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: V(({ row: i }) => [
        m("span", pp, b(i.title), 1),
        m("span", mp, b(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Sb = /* @__PURE__ */ K(gp, [["__scopeId", "data-v-a69084cd"]]);
function vp(e = 1e3, t = null) {
  const n = D(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? xe(t, a, { immediate: !0 }) : a(!0), Ie(() => clearInterval(s)), n;
}
const cs = D(Date.now() / 1e3);
let so = 0, kn = 0;
function yp() {
  return kn || (cs.value = Date.now() / 1e3, so = setInterval(() => cs.value = Date.now() / 1e3, 1e3)), kn += 1, Io() && Ro(() => {
    kn -= 1, kn || clearInterval(so);
  }), cs;
}
const wp = ["title", "data-figure-mark", "data-folded", "data-open"], bp = {
  key: 2,
  class: "worker"
}, kp = { class: "head" }, xp = { key: 0 }, $p = {
  key: 3,
  class: "status"
}, Mp = {
  key: 0,
  class: "figure"
}, _p = {
  key: 1,
  class: "ran-for"
}, Sp = { key: 2 }, Ep = {
  key: 3,
  class: "news"
}, Ap = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Cp = {
  key: 6,
  class: "settled"
}, Op = {
  key: 1,
  class: "bar"
}, Tp = {
  key: 3,
  class: "detail body"
}, Ip = {
  key: 0,
  class: "body-label"
}, Rp = ["title"], Bp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = aa(), s = ["onClick", "onAct"], a = R(() => Object.fromEntries(Object.entries(n).filter(([Q]) => !s.includes(Q)))), o = D(!1), r = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = R(() => t.open !== void 0), l = R(() => i.value || r.value), u = R(() => i.value ? t.open : o.value), d = R(() => i.value ? !t.open : r.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), v = R(() => l.value || f.value || !!n.onClick), y = D(null), O = D(null), { folded: _, phase: w } = $r(y, () => d.value);
    function x(Q) {
      var ee, Z;
      if (!(Q.target !== y.value && !O.value.contains(Q.target))) {
        if (i.value) return (ee = n.onClick) == null ? void 0 : ee.call(n, Q);
        if (r.value) return void (o.value = !o.value);
        (Z = n.onAct || n.onClick) == null || Z(Q);
      }
    }
    const M = (Q) => n.onAct(Q), z = ["failed", "unfinished"], $ = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? z.includes(t.mark.state) ? "danger" : "good" : ""), g = R(() => t.mark.color ? t.mark.color : $.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : $.value ? `var(--tone-${$.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), I = R(() => g.value || "var(--tone-work)"), A = R(() => !t.mark.ending && !t.mark.ended && $.value !== "stopped"), P = yp(), S = R(
      () => t.mark.began_at && A.value && !t.mark.figure && !t.mark.counting ? Af(P.value - t.mark.began_at) : ""
    ), T = R(() => {
      const { started: Q, ended: ee } = t.mark;
      return Q ? ee ? `ran ${Ja(ee - Q, !0)}` : Ja(P.value - Q, !0) : S.value;
    }), k = ["bad", "danger", "warn"], p = R(() => k.includes($.value) || t.mark.asks ? "attention" : A.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), B = ["bad", "danger"], L = R(() => B.includes($.value)), q = R(() => p.value === "process" ? "running" : L.value ? "cross" : $.value === "stopped" ? "stopped" : $.value === "good" ? "tick" : ""), re = R(
      () => !!(t.mark.figure || T.value || t.mark.docked || t.mark.stopping || q.value || t.mark.settled || t.mark.news)
    ), le = R(() => [t.mark.title, t.mark.time ? Mr(t.mark.time) : ""].filter(Boolean).join(" · ")), de = R(() => ({
      ...g.value ? { "--mark": g.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (Q, ee) => (c(), h("div", ut(a.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${p.value}`,
        U(w),
        {
          open: u.value,
          folding: i.value && d.value,
          live: v.value,
          failed: L.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: g.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: de.value,
      title: le.value,
      "data-figure-mark": e.mark.key,
      "data-folded": U(_) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (c(), G(xt(v.value ? "button" : "span"), {
        ref_key: "top",
        ref: O,
        class: "top",
        type: v.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: V(() => [
          e.mark.markIcon ? (c(), G(et, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), G(ve, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", bp, b(e.mark.worker), 1)) : E("", !0),
          m("span", kp, [
            W(rt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", xp, b(e.mark.name), 1)) : E("", !0),
            l.value ? (c(), G(Zt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : E("", !0)
          ]),
          re.value ? (c(), h("span", $p, [
            e.mark.figure ? (c(), h("span", Mp, b(e.mark.figure), 1)) : E("", !0),
            T.value ? (c(), h("span", _p, b(T.value), 1)) : E("", !0),
            e.mark.stopping ? (c(), h("span", Sp, "Stopping")) : E("", !0),
            e.mark.news ? (c(), h("span", Ep, b(e.mark.news), 1)) : E("", !0),
            q.value === "running" ? (c(), h("span", Ap)) : q.value ? (c(), G(et, {
              key: 5,
              class: J(["sign", q.value]),
              name: q.value
            }, null, 8, ["class", "name"])) : E("", !0),
            e.mark.settled ? (c(), h("span", Cp, b(e.mark.settled), 1)) : E("", !0)
          ])) : E("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), G(xr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: ke(M, ["stop"])
      }, null, 8, ["label", "open"])) : E("", !0),
      (e.mark.figure || e.mark.counting) && A.value ? (c(), h("span", Op, [
        m("span", {
          class: "progress",
          style: be({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: I.value })
        }, null, 4)
      ])) : E("", !0),
      e.mark.detail && !U(_) ? (c(), G(rt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      e.mark.body && !U(_) ? (c(), h("div", Tp, [
        e.mark.bodyLabel ? (c(), h("p", Ip, b(e.mark.bodyLabel), 1)) : E("", !0),
        W(rt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : E("", !0),
      e.mark.command && !U(_) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, Rp)) : E("", !0),
      e.mark.card ? (c(), G(rt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      he(Q.$slots, "default", {
        shown: !U(_)
      }, void 0, !0)
    ], 16, wp));
  }
}), Er = /* @__PURE__ */ K(Bp, [["__scopeId", "data-v-74d78abb"]]), Lp = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Ar(e) {
  var n;
  const t = Lp[e] || ((n = cn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Dp = (e) => Ar(String(e).split(":")[0]), Cr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Np = { passed: "good", failed: "danger", warned: "warn", running: "" }, Pp = { good: "good", warn: "warn", danger: "danger" }, ao = {
  "open row": (e) => Ze(`${e.target_model}:${e.target_id}`),
  "open page": (e) => kl(e.target_model, e.target_id || 0)
}, jp = { "open row": (e) => Dp(e.target_model), "open page": () => Ar("pages") };
function qp(e, t) {
  const n = t || {}, s = ao[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Np[e.outcome] || "" : Pp[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? jp[s](e) : "",
    handlers: s ? { onAct: () => ao[s](e) } : {}
  };
}
const Fp = 24, Wp = 1e3, oo = 2e3, Hp = 0.25, Up = 5e3;
function zp(e, t = Fp, n = () => !0) {
  const s = D(!1), a = D(0), o = D(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const $ = u();
    return $ ? $.scrollHeight - $.scrollTop - $.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function v($) {
    if (clearTimeout(r), !$) {
      o.value = !1, l = Date.now();
      return;
    }
    const g = Date.now() - l < oo ? oo : Wp;
    r = setTimeout(() => o.value = s.value, g);
  }
  function y() {
    clearTimeout(i), s.value = !1, a.value = 0, v(!1);
  }
  function O($ = !1) {
    const g = u();
    g && $ && g.scrollTo ? g.scrollTo({ top: g.scrollHeight, behavior: "smooth" }) : g && (g.scrollTop = g.scrollHeight), y();
  }
  function _() {
    x(), !s.value && (s.value = !0, v(!0));
  }
  const w = () => !!u() && d() <= u().clientHeight * Hp;
  function x() {
    clearTimeout(i), w() && (i = setTimeout(() => s.value && w() && n() && O(!0), Up));
  }
  function M() {
    f() ? y() : _();
  }
  function z($ = 1, g = !1) {
    s.value ? a.value += Math.max(0, $) : O(g);
  }
  return Io() && Ro(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: y, toBottom: O, left: _, scrolled: M, arrived: z };
}
const Vp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Gp = (e) => String(e ?? "").replace(Vp, ""), Kp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(null), { away: o, scrolled: r, arrived: i, toBottom: l } = zp(a);
    xe(
      () => n.lines.length,
      () => rn(() => i()),
      { immediate: !0 }
    );
    function u(d) {
      r(), s("older", d.target);
    }
    return (d, f) => (c(), h("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      ce(b(U(Gp)(e.lines.join(`
`)) || e.empty), 1),
      U(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (v) => U(l)(!0))
      }, "Follow")) : E("", !0)
    ], 544));
  }
}, Yp = /* @__PURE__ */ K(Kp, [["__scopeId", "data-v-d9fa8127"]]), Jp = 1e4;
class Zp {
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
    return this.heardAt !== null && t - this.heardAt > Jp;
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
const Xp = {
  key: 0,
  class: "frame-note"
}, Qp = {
  key: 0,
  class: "frame-note"
}, em = ["src", "title"], tm = 1e3, nm = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Wn(), s = D(null), a = D(!1), o = D(!1);
    let r = null, i = 0;
    return Fe(() => {
      r = new Zp(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, tm);
    }), Ie(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", Xp, "This window was closed because it stopped answering.")) : (c(), h(Y, { key: 1 }, [
      a.value ? (c(), h("div", Qp, [
        u[2] || (u[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        W(we, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: V(() => [...u[1] || (u[1] = [
            ce("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : E("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: U(n).window
      }, null, 8, em)
    ], 64));
  }
}, sm = /* @__PURE__ */ K(nm, [["__scopeId", "data-v-32a49046"]]), am = 0, om = "/api/lines", rm = "/api/line";
class im {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), am));
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
        const n = await je.raw(om, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(rm, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const lm = new im();
class cm {
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
      n.patterns.some((s) => Or(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Or(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const um = Symbol("pane-page"), dm = { 1: "refused", 2: "usage", 3: "fault" }, hm = 100, fm = /"([^"]*)"|'([^']*)'|(\S+)/g;
function pm({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = D({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: v = "", tabs: y = [], search: O = {}, readOnly: _ = !1, shared: w = null }) {
  const x = /* @__PURE__ */ new Map(), M = new AbortController(), z = ($) => {
    const g = x.get($);
    if (g && performance.now() - g.at < hm) return g.answer;
    const I = Ir(e, $, t, M.signal);
    return x.set($, { answer: I, at: performance.now() }), I;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => s()),
    permissions: a,
    autoScroll: v,
    tabs: y,
    search: O,
    readOnly: _,
    shared: w,
    read: z,
    run: ($) => Qt(e, $, t, M.signal),
    upload: ($) => gm($, M.signal),
    cancel: () => M.abort(),
    subscriptions: r,
    follow: ($, g) => r.follow(e, $.filter((I) => o.some((A) => Or(A, I))), g, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: ($) => R(() => {
      var g;
      return l.value[$] ?? ((g = u.find((I) => I.key === $)) == null ? void 0 : g.default);
    }),
    setting: async ($, g) => {
      const I = await z(`window setting ${e} ${$}`);
      return I.ok ? I.value.value : g;
    },
    setOption: f,
    keep: ($, g) => Qt(e, ["window", "save-setting", e, $, JSON.stringify(g)], t, M.signal)
  };
}
function mm(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Xt = { ok: !1, failure: "cancelled", error: "" }, Tr = "The journal did not answer, so this did not go through. Try again.";
async function Qt(e, t, n, s = void 0) {
  try {
    const a = await lm.add({ window: e, line: Array.isArray(t) ? t : vm(t), environment: n }, s);
    return s != null && s.aborted ? Xt : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: dm[a.code] || "fault", error: mm(a.error) };
  } catch {
    return s != null && s.aborted ? Xt : { ok: !1, failure: "unreachable", error: Tr };
  }
}
async function Ir(e, t, n, s) {
  const a = await Qt(e, t, n, s);
  return a.failure !== "unreachable" || !ra() ? a : (await bc(), s.aborted ? Xt : Ir(e, t, n, s));
}
async function gm(e, t = void 0) {
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? Xt : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Xt : { ok: !1, failure: "unreachable", error: Tr };
  }
}
function vm(e) {
  return [...e.matchAll(fm)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function ym({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const wm = {
  class: "allowance-prompt",
  role: "dialog"
}, bm = { class: "allowance-prompt-text" }, km = { class: "allowance-prompt-buttons" }, xm = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", wm, [
      m("p", bm, b(U(ym)(e.request)), 1),
      m("div", km, [
        W(we, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            ce("Allow", -1)
          ])]),
          _: 1
        }),
        W(we, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            ce("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, $m = /* @__PURE__ */ K(xm, [["__scopeId", "data-v-102dc765"]]), us = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(In, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: V(() => [
        ce(b(e.reason) + " ", 1),
        e.retry ? (c(), G(we, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: V(() => [...a[2] || (a[2] = [
            ce("Retry", -1)
          ])]),
          _: 1
        })) : E("", !0),
        e.removable ? (c(), G(we, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: V(() => [...a[3] || (a[3] = [
            ce("Remove tab", -1)
          ])]),
          _: 1
        })) : E("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Mm = ["data-window", "data-agent"], _m = {
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
    const n = e, s = t, a = D(""), o = D(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Te(ol, null), l = pm({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: Te(um, null),
      setOption: (f, v) => s("option", f, v),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, v) => {
        s("open", f, v), i == null || i(f, v);
      }
    });
    Ii(Be, l), xe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ie(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), Ri((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => ta(n.component), d = () => {
      var f, v;
      return ((v = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : v.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, v) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), G($m, {
        key: 0,
        request: d(),
        onAnswer: v[0] || (v[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : E("", !0),
      e.unavailableReason ? (c(), G(us, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), G(us, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), G(u, { key: o.value })) : (c(), G(us, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: v[1] || (v[1] = (y) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Mm));
  }
}, Rr = /* @__PURE__ */ K(_m, [["__scopeId", "data-v-32203cbc"]]), Sm = {
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
    const n = e, s = t, a = { render: () => ta(sm, { src: n.entry.entry_url }) };
    return (o, r) => (c(), G(Rr, {
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
      onOption: r[0] || (r[0] = (i, l) => s("option", i, l))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "search", "events", "unavailable-reason"]));
  }
}, Em = ["data-window"], Am = {
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
    const n = e, s = t, a = Fn(null), o = D("");
    return xe(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, pc();
          } catch (i) {
            if (hc(i) && fc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      W(Dt, { shape: "cards" })
    ], 8, Em)) : (c(), G(Rr, {
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
      onOption: i[0] || (i[0] = (l, u) => s("option", l, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "search", "events", "unavailable-reason"]));
  }
}, ro = "*.*", Cm = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var u;
    const t = e, n = Te(Be, null), s = new cm(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [ro], (d) => s.dispatch(d));
    Ie(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? "", r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = R(() => !!(t.declaration.shipped || t.declaration.trusted)), l = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [ro] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), G(Am, {
      key: 0,
      entry: l.value,
      subscriptions: U(s),
      environment: U(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(Sm, {
      key: 1,
      entry: l.value,
      subscriptions: U(s),
      environment: U(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Om = { class: "mark-more-inner" }, Tm = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Im = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Rm = {
  key: 3,
  class: "mark-lines"
}, Bm = "process", io = "task", Lm = 2e3, Dm = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Te(Be), s = R(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = R(() => Cr.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === io ? t.mark.target_id : 0), r = D([]), i = D(!1), l = D(""), u = R(() => t.mark.target_model === Bm && !!t.mark.target_id);
    async function d() {
      const y = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, l.value = y.ok ? "" : y.error, y.ok && (r.value = y.value.lines);
    }
    let f = null;
    const v = () => clearInterval(f);
    return xe(() => t.shown && u.value, (y) => {
      v(), y && (d(), t.mark.ended_at || (f = setInterval(d, Lm)));
    }, { immediate: !0 }), xe(() => t.mark.ended_at, (y) => y && t.shown && u.value && (v(), d())), Ie(v), (y, O) => (c(), h("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: O[1] || (O[1] = ke(() => {
      }, ["stop"]))
    }, [
      m("div", Om, [
        e.declaration.body_url ? (c(), G(Cm, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(Y, { key: 1 }, [
          a.value ? (c(), h(Y, { key: 0 }, [
            O[2] || (O[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Tm, b(a.value), 1)
          ], 64)) : E("", !0),
          u.value && l.value ? (c(), h("p", Im, b(l.value), 1)) : u.value && i.value ? (c(), h(Y, { key: 2 }, [
            O[3] || (O[3] = m("p", { class: "mark-label" }, "Output", -1)),
            W(Yp, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", Rm, b(s.value.join(`
`)), 1)) : E("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: O[0] || (O[0] = ke((_) => U(Ze)(`${io}:${o.value}`), ["stop"]))
          }, "Open task " + b(o.value) + " and its proofs", 1)) : E("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Us = /* @__PURE__ */ K(Dm, [["__scopeId", "data-v-51f69bf1"]]), Nm = (e) => `show-${e}`, Eb = (e, t, n) => e.filter((s) => {
  var a;
  return n(Nm((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Pm = "messages.chat", jm = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), Br = (e, t, n) => Qt(Pm, jm(e, t), n), qm = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Fm = ["title", "aria-label", "onClick"], Wm = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Hm = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => qm(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = D(""), a = Te(Be);
    async function o(r) {
      const i = await Br(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(Y, null, [
      (c(!0), h(Y, null, se(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: ke((u) => o(l), ["stop"])
      }, [
        W(et, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Fm))), 128)),
      s.value ? (c(), h("span", Wm, b(s.value), 1)) : E("", !0)
    ], 64));
  }
}, Um = /* @__PURE__ */ K(Hm, [["__scopeId", "data-v-0dfda102"]]);
function Lr(e, t) {
  const n = Fn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const Dr = Lr("/api/marks", "marks"), Ab = Dr.fetchAll, zm = Dr.find, Vm = 2e3;
function Nr(e, t, n = Vm) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  Fe(async () => {
    await e(), a();
  }), Lt(() => clearTimeout(s));
}
const Gm = ["data-ref"], Km = ["data-ref"], Ym = { class: "mark-row" }, Jm = "dock add", Zm = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = R(() => zm(s.mark.type)), o = Te(Be, null), r = R(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = D(null);
    Nr(async () => {
      if (!r.value) return;
      const y = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      y.ok && y.value.rows.length && (i.value = y.value.rows[0].progress);
    }, () => r.value);
    const l = R(() => {
      const y = qp(s.mark, a.value), O = !y.figure || y.figure.endsWith("%");
      return i.value && r.value && O ? { ...y, figure: `${i.value}%`, fraction: i.value / 100 } : y;
    }), u = R(() => {
      var y;
      return !!(s.mark.lines || s.mark.detail && Cr.has(s.mark.variant) || t.has(s.mark.target_model) || (y = a.value) != null && y.body_url);
    }), d = D(!1);
    function f(y) {
      if (l.value.handlers.onAct && !y.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const v = R(() => {
      var y, O, _;
      return s.docked ? (O = (y = a.value) == null ? void 0 : y.buttons) == null ? void 0 : O.filter((w) => {
        var x;
        return !((x = w.runs) != null && x.startsWith(Jm));
      }) : (_ = a.value) == null ? void 0 : _.buttons;
    });
    return (y, O) => {
      var _, w;
      return (_ = a.value) != null && _.card ? (c(), h("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        W(Us, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Gm)) : (c(), h("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (w = a.value) == null ? void 0 : w.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Ym, [
          W(Er, ut({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, Bi(l.value.handlers), { onClick: f }), Li({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: V(({ shown: x }) => [
                W(Us, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: x
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          W(Um, {
            buttons: v.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Km));
    };
  }
}, Xm = /* @__PURE__ */ K(Zm, [["__scopeId", "data-v-cc29b2a4"]]), Qm = ["data-ref"], eg = ["inert"], tg = { class: "thread-group" }, ng = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = D(!1), s = D(!1);
    xe(n, () => s.value = !0);
    const a = R(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (o, r) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      W(Er, {
        mark: a.value,
        open: n.value,
        onClick: r[0] || (r[0] = (i) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (c(), h("div", {
        key: 0,
        class: J(["group-rows", { open: n.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        m("div", tg, [
          (c(!0), h(Y, null, se(e.group.marks, (i) => (c(), G(Xm, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, eg)) : E("", !0)
    ], 8, Qm));
  }
}, Cb = /* @__PURE__ */ K(ng, [["__scopeId", "data-v-8a285510"]]);
function sg(e) {
  const t = D(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Fe(() => n.observe(e.value)), Lt(() => n.disconnect()), t;
}
const ag = { class: "chat-dock-fold" }, og = ["aria-label"], rg = { class: "chat-dock-head" }, ig = { class: "chat-dock-inner" }, Pr = 700, lg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = D(null), s = D(null), a = sg(s), o = D(!1);
    let r = 0;
    return Fe(() => r = setTimeout(() => o.value = !0, Pr)), Lt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      m("div", ag, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          he(i.$slots, "edge"),
          m("header", rg, [
            he(i.$slots, "head")
          ]),
          m("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            m("div", ig, [
              m("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: be(U(a) === null ? null : { height: `${U(a)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  he(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, og)
      ])
    ], 2));
  }
}, jr = /* @__PURE__ */ K(lg, [["__scopeId", "data-v-63e4dcfc"]]), cg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ds = 5, ug = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ds, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${ds}s`, animationDelay: `${(n - ds).toFixed(2)}s` };
    return (a, o) => (c(), h("span", cg, [
      m("i", { style: s })
    ]));
  }
}, qr = /* @__PURE__ */ K(ug, [["__scopeId", "data-v-d0c4b012"]]), Fr = Lr("/api/docks", "docks"), Ob = Fr.fetchAll, zs = Fr.find, dg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Vs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), hg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), fg = (e) => e.kept ? Vs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : Vs("keep", "pin", "Pin", `dock keep ${e.id}`), pg = ["pin", "stop"], mg = (e) => ({ ...e, iconOnly: pg.includes(e.icon) });
function gg(e, t) {
  var n;
  return [
    ...hg(e, t) ? [fg(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || cn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Vs("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(mg);
}
const vg = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: dg(e, t),
  buttons: gg(e, t)
}), yg = { class: "dock-title" }, wg = ["aria-expanded", "title"], bg = { class: "chat-dock-acts dock-acts" }, kg = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, xg = {
  key: 1,
  class: "dock-text"
}, $g = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = R(() => zs(s.item.type)), o = D(null), r = R(() => vg(s.item, a.value)), i = Te(Be), l = D(/* @__PURE__ */ new Set()), u = D("");
    async function d(y) {
      if (y.action === "open") return Ze(`${s.item.target_model}:${s.item.target_id}`);
      y.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, y.label])), u.value = "";
      const _ = await Br(y, s.item, i.environment);
      (_ == null ? void 0 : _.ok) === !1 && (l.value = new Set([...l.value].filter((w) => w !== y.label)), u.value = _.error);
    }
    const f = R(() => r.value.buttons.filter((y) => y.action !== "undock" && !l.value.has(y.label))), v = R(() => r.value.buttons.find((y) => y.action === "undock"));
    return (y, O) => (c(), G(jr, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: V(() => [
        e.leaving ? (c(), G(qr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : E("", !0)
      ]),
      head: V(() => {
        var _, w, x;
        return [
          (_ = a.value) != null && _.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(Y, { key: 1 }, [
            W(ve, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            m("span", yg, b(r.value.title), 1)
          ], 64)),
          (w = a.value) != null && w.badge ? (c(), h("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, b(a.value.badge), 3)) : E("", !0),
          (x = a.value) != null && x.draws_head ? E("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: O[0] || (O[0] = (M) => n("fold"))
          }, [
            W(Zt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, wg)),
          m("span", bg, [
            (c(!0), h(Y, null, se(f.value, (M) => (c(), h(Y, {
              key: M.action + M.runs
            }, [
              M.iconOnly ? (c(), G(we, {
                key: 0,
                kind: "icon",
                "aria-label": M.label,
                title: M.label,
                "data-dock-action": M.action,
                onClick: (z) => d(M)
              }, {
                default: V(() => [
                  W(ve, {
                    name: M.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), G(we, {
                key: 1,
                small: "",
                kind: M.primary ? "primary" : "ghost",
                bordered: !M.primary,
                "data-dock-action": M.action,
                onClick: (z) => d(M)
              }, {
                default: V(() => [
                  ce(b(M.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          W(Vn, {
            title: v.value.label,
            "data-dock-action": "undock",
            onClick: O[1] || (O[1] = (M) => d(v.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var _, w;
        return [
          u.value ? (c(), h("p", kg, b(u.value), 1)) : E("", !0),
          e.item.text && !((_ = a.value) != null && _.body_url) ? (c(), h("p", xg, b(e.item.text), 1)) : E("", !0),
          (w = a.value) != null && w.body_url ? (c(), G(Us, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : E("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded", "data-figure-closing"]));
  }
}, lo = /* @__PURE__ */ K($g, [["__scopeId", "data-v-109b82ce"]]), Mg = 6, _g = 3, co = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, yt = (e) => !!(e.leaves_at && !e.kept), Sg = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!yt(e) || t < e.leaves_at || n.has(e.id)), Eg = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => Sg(s, t, n)).sort((s, a) => s.id - a.id);
function Ag(e, t, n = Mg) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const Cg = (e, t, n = e) => n < 2 ? !1 : e >= _g ? !0 : t, Og = ["title", "aria-label"], Tg = { class: "run-chip-in" }, Ig = {
  key: 0,
  class: "run-chip-ring"
}, Rg = { class: "run-chip-name" }, Bg = { class: "run-chip-bar" }, Lg = "processes.output", Dg = 5e3, Ng = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = Te(Be, null)) == null ? void 0 : d.environment) ?? "", o = D(null), r = R(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = R(() => {
      var f, v;
      return ((f = o.value) == null ? void 0 : f.title) || ((v = o.value) == null ? void 0 : v.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = R(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await Qt(Lg, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return Nr(u, () => r.value, Dg), (f, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: be({ "--tone": l.value })
      }, [
        U(yt)(e.item) ? (c(), G(qr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : E("", !0),
        m("span", Tg, [
          r.value ? (c(), h("span", Ig)) : (c(), G(et, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          m("span", Rg, b(i.value), 1)
        ]),
        m("span", Bg, [
          m("i", {
            style: be({ width: r.value ? `${((y = o.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, Og);
    };
  }
}, Pg = /* @__PURE__ */ K(Ng, [["__scopeId", "data-v-597b05d2"]]), jg = 24, qg = 8, Tb = 420;
function Ib({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= jg && e > t ? !0 : e < t && a > qg ? !1 : null;
}
const Fg = (e, t) => e === void 0 ? t : e, Wg = {
  key: "runs-head",
  class: "dock-runs-head"
}, Hg = { class: "dock-runs-chips" }, Ug = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = vp(500), s = D(/* @__PURE__ */ new Set()), a = D(!1), o = D(!1), r = R(() => Eg(t.items, n.value, s.value)), i = R(() => Ag(r.value.filter((M) => co(M, zs)), n.value)), l = R(() => r.value.filter((M) => !i.value.includes(M) && !co(M, zs))), u = R(() => i.value.filter((M) => !yt(M))), d = R(() => (a.value = Cg(i.value.length, a.value, u.value.length)) && !o.value), f = D({}), v = (M) => Fg(f.value[M.id], t.folded);
    function y(M) {
      f.value = { ...f.value, [M.id]: !v(M) };
    }
    function O(M) {
      f.value = { ...f.value, ...Object.fromEntries(i.value.map((z) => [z.id, z.id !== M.id])) }, o.value = !0;
    }
    function _() {
      f.value = Object.fromEntries(Object.entries(f.value).filter(([M]) => !i.value.some((z) => String(z.id) === M))), o.value = !1;
    }
    function w(M) {
      s.value = /* @__PURE__ */ new Set([...s.value, M.id]);
    }
    function x(M) {
      s.value = new Set([...s.value].filter((z) => z !== M.id));
    }
    return (M, z) => (c(), G(Oo, {
      tag: "div",
      name: "dock",
      duration: U(Pr),
      class: "dock-stack"
    }, {
      default: V(() => [
        (c(!0), h(Y, null, se(l.value, ($) => (c(), G(lo, {
          key: $.id,
          item: $,
          class: J({ timed: U(yt)($) }),
          leaving: U(yt)($) && !s.value.has($.id),
          folded: v($),
          onFold: (g) => y($),
          onMouseenter: (g) => w($),
          onMouseleave: (g) => x($)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", Wg, [
          m("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: _
          }, [
            ce(b(i.value.length) + " runs ", 1),
            W(Zt, { open: "" })
          ])
        ])) : E("", !0),
        (c(!0), h(Y, null, se(d.value ? [] : i.value, ($) => (c(), G(lo, {
          key: $.id,
          item: $,
          class: J({ timed: U(yt)($) }),
          leaving: U(yt)($) && !s.value.has($.id),
          folded: v($),
          onFold: (g) => y($),
          onMouseenter: (g) => w($),
          onMouseleave: (g) => x($)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        d.value ? (c(), G(jr, {
          key: "runs-row",
          label: `${i.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: V(() => [
            m("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: z[0] || (z[0] = ($) => o.value = !0)
            }, [
              W(et, { name: "runs" }),
              ce(" " + b(i.value.length) + " runs ", 1),
              W(Zt)
            ]),
            m("span", Hg, [
              (c(!0), h(Y, null, se(i.value, ($) => (c(), G(Pg, {
                key: $.id,
                item: $,
                onClick: (g) => O($)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : E("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, Rb = /* @__PURE__ */ K(Ug, [["__scopeId", "data-v-7081ac82"]]), wt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, An = (e) => Math.min(Math.max(e, 0), 1), zg = (e) => {
  const t = An(e);
  return t * t * (3 - 2 * t);
}, pt = (e, t, n) => zg((e - t) / (n - t));
function Bb(e) {
  const t = An(e), n = An((t - 0.12) / 0.76) * wt.shuffles, s = Math.min(Math.floor(n), wt.shuffles - 1), a = n - s, o = pt(a, 0.26, 0.38) * (1 - pt(a, 0.76, 0.96)), r = pt(a, 0.38, 0.76), i = pt(t, 0, 0.12) * (1 - pt(t, 0.88, 1)), l = pt(a, 0.2, 0.34) * (1 - pt(a, 0.84, 1)), u = Math.sin(Math.PI * An((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / wt.shuffles, lift: wt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function Lb(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const uo = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, Db = (e) => uo[e] ?? uo.butler, ga = 2400, Vg = 0.05;
function Gg({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, Vg), r = Math.min(t + ga * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function Nb(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function Kg(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function Pb(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const jb = (e, t) => ({ ...e, stretch: t.stretch }), qb = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Wr = (e, t) => t >= (e.least ?? 0);
function Fb(e, t, n) {
  if (!Wr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const Wb = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Yg = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ho = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Jg = (e) => e.right > e.left && e.bottom > e.top;
function Hb(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(Yg)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = ho(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = ho(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), Jg(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function Hr(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, v] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[f] || e[d] > o[v]) && (i = -1);
      else {
        const O = (o[f] - e[d]) / y, _ = (o[v] - e[d]) / y;
        r = Math.max(r, Math.min(O, _)), i = Math.min(i, Math.max(O, _));
      }
    }
    if (r > i || s && r >= s.share) continue;
    const l = e.x + (t.x - e.x) * r, u = e.y + (t.y - e.y) * r;
    s = { share: r, x: l, y: u, on: "surface", surface: a.id, dx: l - a.left, dy: u - a.top };
  }
  return s;
}
const _e = {
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
  phone_call: { frames: 108, fps: 12, poof: [0, 0.06], above: 0.7, drop: [0.015, 0.055], settle: [0.055, 0.12], squash: 0.24, wobbles: 3, reach: [0.13, 0.2], lift: [0.2, 0.28], finger: [0.28, 0.33], dial: [0.33, 0.42], turn: 250, back: [0.42, 0.5], release: 0.25, talk: [0.5, 0.72], nods: 3, hang: [0.72, 0.84], goes: [0.92, 1], seated: { finger: [0.28, 0.33], dial: [0.33, 0.42], back: [0.42, 0.5], reach: [0.13, 0.2], lift: [0.2, 0.28], beside: 1.2, behind: 0.95, wide: 0.82, turn: 45, lean: 20, backLean: 8 } },
  // a question asked: it raises a sign with a question mark on a stick over its head and waggles it
  ask_sign: { frames: 42, fps: 12, raise: [0, 0.22], waggle: [0.22, 0.78], waggles: 3, lower: [0.78, 1] },
  // a report: it brings the rolled scroll up before its chest over `raise`, a roller in each hand, the free hand's on top; pulls the
  // rollers apart over `unrolls`, the written side toward itself and the parchment's plain back to the viewer (figure.js SCROLL); reads
  // it `lines` lines down, its head going slowly along each; rolls it closed between its hands over `rolls` and lowers it over `lower`
  scroll: { frames: 96, fps: 12, raise: [0, 0.09], unrolls: [0.09, 0.22], rolls: [0.85, 0.93], lower: [0.93, 1], lines: 3 },
  // a task finished, a job well done: standing, it brings its hands together before its chest over `together`, rubs them round each
  // other `rubs` times, slowly, a stroke and a half a second at most, nodding a little with each, and lowers them over `apart`; `puffs`
  // small puffs rise from the hands once each over `puff`, with `sparkles` sparkles among them (chat/act/HandRub.vue)
  hand_rub: { frames: 48, fps: 12, together: [0, 0.12], rubs: 2, apart: [0.88, 1], puff: [0.2, 0.9], puffs: 2, sparkles: 1 },
  // stopping to think at the laptop (figure.js type_ponder), under the thought cloud, its dots pulsing three times a loop
  type_ponder: { frames: 24, fps: 6, pulse: 4 / 3 },
  // The thinking act, now and then while the agent thinks (figure.js thinkingClip, reactions.js thinkingAct), in its three plays. With
  // the cloud: it raises its finger to its cheek over `into`, tilting its head up, swaying `sways` times; three puffs rise from its head
  // over `puffs` into a small thought cloud over it, held over `cloud`, its three dots pulsing one after another, `pulse` seconds round
  // (chat/FigureAct.vue), and over `rise` its hand comes away. With the bulb: over `rise` the finger comes up, "got it", the light bulb
  // over the head (figure.js LIGHT_BULB) appears over `appears`, switches on over `lights`, glows, goes out over `fades` and is gone over
  // `goes`. "ponder" has both, the bulb at its end; "think_cloud" the cloud alone, its hand going down; "got_it" the bulb alone.
  ponder: { frames: 84, fps: 12, into: [0, 0.1], puffs: [0.06, 0.24], cloud: [0.06, 0.72], pulse: 1.2, sways: 2, rise: [0.72, 0.8], appears: [0.75, 0.78], lights: [0.79, 0.82], fades: [0.9, 0.96], goes: [0.95, 1] },
  think_cloud: { frames: 66, fps: 12, into: [0, 0.12], puffs: [0.07, 0.29], cloud: [0.07, 0.86], pulse: 1.2, sways: 2, rise: [0.86, 1] },
  got_it: { frames: 30, fps: 12, rise: [0, 0.25], appears: [0.05, 0.15], lights: [0.18, 0.26], fades: [0.72, 0.88], goes: [0.86, 1] },
  // a fact or a reminder: a small cabinet grows beside it, its drawer slides out, it files a card in it and the drawer shuts
  file_card: { frames: 42, fps: 12, grows: [0, 0.15], opens: [0.12, 0.28], reach: [0.2, 0.44], filed: [0.44, 0.56], back: [0.56, 0.72], shuts: [0.58, 0.72], sinks: [0.86, 1] },
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
  fume: { frames: 54, fps: 12, crushed: [0, 0.36], mad: [0.36, 0.96], stamps: 6, steam: [0.42, 0.96] },
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
  pogo: { frames: 54, fps: 12, draw: [0, 0.18], bounces: [0.18, 0.62], count: 3, bounce: 0.45, spring: [0.62, 0.82], over: 0.3, release: [0.82, 0.86], drop: [0.82, 1], stick: 0.62, handles: 0.2455 },
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
    turn: [0.25, 0.55],
    aim: [0.25, 0.32],
    shots: [0.33, 0.48],
    count: 2,
    splat: 0.48,
    fly: [0.56, 0.64],
    drops: [0.64, 1],
    back: { limit: 55, margin: 0.25, stride: 0.5 },
    lens: [{ at: [-1.3, -1.6], size: 0.2 }, { at: [0.9, -0.9], size: 0.14 }, { at: [-0.4, 0.2], size: 0.16 }, { at: [1.6, -2.1], size: 0.1 }]
  },
  // a fixed run's bug smashed with a big wooden mallet on the floor the figure stands on (smashPlan): the bug climbs up the back of the
  // floor's box, out of sight behind it, over `emerge`, comes over its top edge onto it over `climb`, and it and the figure walk to meet
  // each other over `walk`, until it is `away` of the picture out on the figure's left (`side`); the figure raises the mallet high before
  // its head over `raise` and holds it there for the wind-up until `swing`, swings it down over `swing` and flattens the bug at `blow`,
  // which lies flat and fades over `gone`, and lowers the mallet over `lower`
  bug_smash: {
    frames: 96,
    fps: 12,
    side: 1,
    emerge: [0, 0.09],
    climb: [0.09, 0.16],
    walk: [0.16, 0.38],
    raise: [0.46, 0.58],
    swing: [0.66, 0.72],
    blow: 0.72,
    gone: [0.84, 0.95],
    lower: [0.88, 0.95],
    away: 0.42
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
  disco: { frames: 96, fps: 12, beats: 8, ball: 0.24, clear: 0.08, tie: 0.1, far: 2.2 },
  // leaning against a wall to rest (perches.js leanSpot): the wall `wall` of the picture out from its middle, the hand flat against it
  // `contact` of the figure's units above its feet; the whole body tilted `tilt` degrees toward it from the feet, its weight on that hand;
  // the other hand on its hip at `hip` (across, forward, up); the ankles crossed, the inner leg turned in `inner` degrees and the outer
  // `outer`, swung `over` degrees before the inner so its foot crosses over in front
  lean: { wall: 0.33, contact: 1.95, tilt: 16, hip: [0.62, 0.05, 1.5], inner: 20, outer: 42, over: 12 },
  // coming down on a parachute, swaying `sway` degrees under it, its canopy (figure.js canopyOf) `width` of the picture across with its
  // rim `above` of the picture over the eyes, the lines running from the rim down to the hands
  chute: { frames: 24, fps: 8, sway: 8, width: 0.66, above: 0.5 },
  // compacting: a box appears, it hops into it and the box shrinks with it inside; once the compaction is over the box grows back and
  // pops in a puff, and it jumps out. Its frames are an intro, a held stretch looped while the compaction lasts, and an outro
  pack_box: { intro: 36, hold: 24, outro: 26, fps: 12, appears: [0, 0.3], hop: [0.3, 0.62], into: [0.55, 0.88], shrinks: [0.86, 1], grows: [0, 0.3], pops: 0.38, leap: [0.38, 0.88], small: 0.5 },
  // compacting: a press comes down onto its head, it holds it up with both hands and is squashed under it, and springs back once it lifts
  press: { intro: 24, hold: 24, outro: 24, fps: 12, lowers: [0, 0.55], squashes: [0.5, 1], frees: [0, 0.3], springs: [0.25, 0.7], lifts: [0.3, 1], flat: 0.42 },
  // compacting: it vacuums up the words flying in from beside it, the canister on the floor and the nozzle in its hand
  vacuum: { intro: 10, hold: 40, outro: 10, fps: 10, words: 5 }
}, en = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Zg = (e) => e * e * (3 - 2 * e), Se = (e, [t, n]) => Zg(en(e, t, n)), Xg = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, xn = ([e, t], n) => e + n() * (t - e);
function Qg(e) {
  return Xg.map(() => {
    const t = xn(it.speed, e), n = xn(it.angle, e) * Math.PI / 180, s = xn(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [xn(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const e0 = Qg(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function t0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function Ub(e, t, n = e0) {
  const s = _e.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = t0(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= it.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const zb = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function Vb(e, t) {
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
const Gb = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Tt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Kb(e, t, n) {
  const { away: s, side: a } = _e.bug_smash, o = a * s * n, [r, i] = [t.left + Tt.margin * n, t.right - Tt.margin * n], l = Math.min(Math.max(e + o + a * Tt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function Yb(e, t, n) {
  const s = _e.bug_smash, a = Se(t, s.walk), o = ([r, i]) => r + (i - r) * a;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Tt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Tt.tall * n * (1 - Se(t, s.emerge)),
      turn: 90 * (1 - Se(t, s.climb)),
      whole: t < s.blow,
      flat: t >= s.blow ? 1 : 0,
      shows: 1 - Se(t, s.gone)
    }
  };
}
function Jb(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Tt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = Gg({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Oe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function Zb(e) {
  const t = Oe.least + Math.floor(e() * (Oe.most - Oe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Oe.walls[Math.floor(e() * Oe.walls.length)],
    along: Oe.margin + e() * (1 - 2 * Oe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Gs(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Oe.margin, r = ((e.along - Oe.margin + e.way * Oe.speed * n / s) / a % 2 + 2) % 2, i = Oe.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Oe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Oe.inset : t.right - Oe.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function n0(e, t) {
  const n = _e.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = Kg(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function Xb(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = _e.bug_shot, { frame: r, bug: i, shot: l } = n0(n, e.length), u = e.map((x, M) => ({ ...Gs(x, t, Math.min(n / o.fps, Cn(M).shot)), shot: M < l })), d = Se(r / o.frames, o.aim), [f, v] = [u[Math.max(i - 1, 0)], u[i]], y = e.map((x, M) => ({ bug: x, index: M, seconds: n / o.fps - Cn(M).shot, spot: Gs(x, t, Cn(M).shot) })).filter((x) => x.seconds >= 0), O = y.flatMap((x) => {
    const M = (a == null ? void 0 : a.get(x.index)) ?? i0(x.bug, t, x.spot, a ? [] : s);
    return a == null || a.set(x.index, M), a && l0(M, x.seconds, s), c0(M, x.seconds, s);
  }), _ = y.filter((x) => o0(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), w = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (v.x - f.x) * d, y: f.y + (v.y - f.y) * d, back: w }, slush: O, camera: _ };
}
function Cn(e) {
  const t = _e.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function Qb(e, t, n, s) {
  const { limit: a, margin: o } = _e.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Cn(d), v = Gs(u, t, f.shot), y = Math.abs(v.y - n.y) / Math.tan(a * Math.PI / 180), O = v.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - v.x), _ = Math.abs(v.x - l) >= y ? l : v.x + O * y, w = O > 0 ? Math.max(l, Math.min(_, i)) : Math.min(l, Math.max(_, r)), x = { from: l, to: w, begin: f.walk, end: f.aim };
    return l = w, x;
  });
}
function ek(e, t, n) {
  var o;
  const s = _e.bug_shot.back.stride * n;
  let a = 0;
  for (const r of e) {
    if (t <= r.begin) return { x: r.from, steps: a / s, way: 0 };
    if (t < r.end) {
      const i = r.from + (r.to - r.from) * Se(t, [r.begin, r.end]);
      return { x: i, steps: (a + Math.abs(i - r.from)) / s, way: Math.sign(r.to - r.from) };
    }
    a += Math.abs(r.to - r.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: a / s, way: 0 };
}
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, s0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function a0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const o0 = (e) => e.along * 97 % 1 < $e.camera, tn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function r0(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += $e.step) {
    const d = Math.min(u + $e.step, r.t), f = tn(e, d), v = Hr(i, f, n);
    if (v) return { ...v, t: u + (d - u) * v.share };
    i = f;
  }
  const l = tn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function i0(e, t, n, s = []) {
  const a = a0(e.along + 1), [o, r] = s0[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: $e.count }, () => {
    const l = i + (a() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + a() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: $e.radius[0] + a() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...r0(d, t, s) };
  });
}
function l0(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += $e.step) {
      const r = Math.min(o + $e.step, a), i = Hr(tn(s, o), tn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function c0(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((s) => {
    if (t < s.t) return [{ ...tn(s, t), r: s.r, flying: !0 }];
    const a = t - s.t, o = 1 - Math.min(Math.max((a - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const r = s.on === "surface" ? n.find((d) => d.id === s.surface) : null;
    if (s.on === "surface" && !r) return [];
    const i = r ? r.left + s.dx : s.x, l = r ? r.top + s.dy : s.y, u = r ? Math.min(a * a * 12, 48, Math.max(0, r.bottom - l)) : ["left", "right"].includes(s.on) ? Math.min(a * a * 8, 32) : 0;
    return [{ x: i, y: l, r: s.r * (1 + 1.2 * Math.min(a / 0.1, 1)), flying: !1, on: s.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function tk(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = _e.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = Se(e, [0, u]), v = Se(e, [u, u + d]);
  return r.map((y) => {
    const O = { x: s.x + y.at[0] * t, y: s.y + y.at[1] * t };
    return {
      x: n.x + (O.x - n.x) * f,
      y: n.y + (O.y - n.y) * f,
      r: y.size * t * (0.15 + 0.85 * f * f),
      run: v * v * t * 1.2,
      fade: 1 - v,
      landed: f >= 1
    };
  });
}
function nk(e, t, n, s, a) {
  const { sway: o, above: r } = _e.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (_) => {
    const [w, x] = [_.x - e.at.x, _.y - e.at.y];
    return { x: i.x + w * u - x * d, y: i.y + w * d + x * u };
  }, [v, y] = [...n].sort((_, w) => _.x - w.x), O = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: O.map((_, w) => ({ from: _, to: w < O.length / 2 ? v : y })) };
}
const sk = (e, t) => Se(t, e.grows) * (1 - Se(t, e.sinks));
function Dn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: en(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: en(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function ak(e, t) {
  const n = _e[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Dn(n, t), r = 1 - (1 - n.small) * Se(s, n.shrinks) * (1 - Se(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Dn(n, t), o = n.flat * Se(s, n.squashes) * (1 - Se(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * en(a, ...n.springs)) * (1 - en(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const ok = (e) => e === "pack_box";
function rk(e) {
  const { into: t, out: n } = Dn(_e.rope_swing, e);
  return 1 - Se(t, [0, 1]) * (1 - Se(n, [0, 1]));
}
function ik(e) {
  const t = _e.rope_swing, { into: n, out: s } = Dn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Se(n, [0, 1]) * (1 - Se(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const u0 = { after: 3 }, va = 10, d0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, h0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, f0 = { weight: 19 }, Ur = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, p0 = { every: 120 }, zr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Vr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, m0 = {
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
}, hn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: va }), te = (e, t, n = {}) => hn(e, "clip", t, n), hs = (e, t, n = {}) => hn(e, "look", t, n), fo = (e, t, n = {}) => hn(e, "gaze", t, n), pe = (e, t, n = {}, s = {}) => ({ ...hn(e, "pick", t, n), ...s }), ge = (e) => hn("nothing", "nothing", e, {}), g0 = 120, v0 = 300, fs = (e, t) => ({ ...te(e, t), cooldown: v0 }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), y0 = () => [te("joy", 2)], mt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), gt = (e) => ({ ...e, cooldown: d0[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: h0[e.name] }), Yn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...oe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...oe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...gt(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...gt(te("bug_smash", 2)), toward: "", onto: !1 },
    te("nod", 2)
  ]),
  ...oe("tests_failed", { cooldown: 20, toward: "card" }, [te("startled", 2), te("dismay", 1), te("tantrum", 3), ge(1)]),
  ...oe("committed", { cooldown: 30, toward: "card", onto: !0 }, [te("nod", 2), ge(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...oe("sin_fixed", { cooldown: 300 }, [te("halo", 1), ge(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...oe("sin_committed", { cooldown: 300 }, [te("repent", 1), ge(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...oe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [te("nod", 4), te("hand_rub", 4), ge(7)]),
  ...oe("question_asked", { cooldown: 60 }, [te("ask_sign", 9), te("look_up", 3), ge(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...oe("reported", { cooldown: 90 }, [fo("read", 3), te("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...oe("read_message", { cooldown: 30 }, [fo("read", 3), ge(1)]),
  ...oe("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ge(6)]),
  ...oe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...oe("bar_done", { holds: !0 }, y0()),
  ...oe("bar_failed", { holds: !0 }, [te("fume", 1), te("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...oe("standing", { cooldown: 12 }, [te("look_left", 2), te("look_right", 2), te("look_up", 1), ge(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...oe("launched", { cooldown: 300 }, [te("tumble", 3), ge(47)]),
  // a break from the hammering now and then
  ...oe("building", { cooldown: 30 }, [te("wipe_brow", 4), te("look_left", 1), te("look_right", 1), ge(69)]),
  ...oe("failed", { cooldown: 20, toward: "card" }, [te("shake", 3), te("tantrum", 2), ge(2)]),
  ...oe("refused", { cooldown: 20 }, [te("shake", 1), ge(1)]),
  ...oe("work_done", { cooldown: 120 }, [te("stretch", 2), ge(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...oe("pondering", { cooldown: [30, 60] }, [pe("ponder", 1)]),
  ...oe("thought_cloud", { cooldown: 90 }, [pe("cloud", 1)]),
  ...oe("light_bulb", { cooldown: 150 }, [pe("bulb", 1)]),
  ...oe("answered", { cooldown: 15 }, [hs("amused", 3), ge(2)]),
  ...oe("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...oe("long_walk", { cooldown: 90 }, [te("stumble", 3), ge(22)]),
  ...oe("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), ge(13)]),
  ...oe("typing", { cooldown: 60 }, [hs("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(m0).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [hs(t, 1)])),
  ...Object.entries(zr).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Vr).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...oe("pastime", {}, [
    mt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    mt("rest", 3, 180, 120),
    mt("yawn", 2, 60, 60),
    mt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    mt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    mt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    mt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Wt(gt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(gt(te("disco", 2, { ball: "bubble" }))),
    ge(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...oe("held:search", { cooldown: g0 }, [fs("search", 3), { ...fs("binoculars", 2), when: { home: !0 } }, { ...fs("glass_bubble", 2), when: { bubble: !0 } }]),
  ...oe("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...oe("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...oe("spell", {}, [pe("writing", 12, { state: "writing" }), pe("reading", 12, { state: "reading" }), pe("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...oe("tickled", {}, [{ ...gt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...oe("eager", {}, [te("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...oe("jump", {}, [Wt(gt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...oe("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...oe("unit", { cooldown: Ur.build.cooldown }, [pe("unit", f0.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: p0.every }, pe("stand", 5)]),
  // a digit a blow's dust lets out
  ...oe("digit", {}, [pe("0", 1), pe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...oe("roam", {}, [
    pe("rest", 35, {}, { stay: [25, 60] }),
    pe("seat", 15, {}, { stay: [15, 40] }),
    pe("edge", 25, {}, { stay: [8, 20] }),
    Wt(pe("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    pe("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    pe("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    pe("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    pe("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    pe("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Wt(gt(pe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...oe("laptop", {}, [pe("seat", 6, {}, { stay: [60, 150] }), pe("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...oe("ledge_at", {}, [pe("middle", 2, {}, { along: 1 / 2 }), pe("third", 1, {}, { along: 1 / 3 }), pe("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...oe("composed_as", {}, [
    pe("facing", 4, {}, { turn: 0, leans: 0 }),
    pe("turned_left", 1, {}, { turn: 335, leans: 0 }),
    pe("turned_right", 1, {}, { turn: 25, leans: 0 }),
    pe("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    pe("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Gr = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Kr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), w0 = (e) => Array.isArray(e) ? e[0] : e, b0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, k0 = (e) => Yn.some((t) => t.when.moment === e);
function x0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || Kr(d).every(([f, v]) => n(f) >= w0(v)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Yn.filter((d) => Gr(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= u0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = x0(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Yr(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Yr(e, t, n) {
  var s;
  for (const [a, o] of Kr(t)) (s = e.memory) == null || s.set(a, e.now + b0(o, n));
}
function lk(e, t, n) {
  Yr(e, Yn.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const ck = (e) => Object.values(Ur).find((t) => Gr(t.when, e)) ?? null, $0 = (e, t, n) => n - t <= (e.lifetime ?? va), uk = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Wr(e.clip, t));
class Jr {
  constructor(t) {
    this.card = t;
  }
  isTest() {
    var t;
    return !!((t = this.card.guesses) != null && t.test);
  }
  isBuild() {
    var t;
    return !!((t = this.card.guesses) != null && t.build);
  }
  isUpload() {
    var t;
    return !!((t = this.card.guesses) != null && t.upload);
  }
}
const Ks = {
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
}, dk = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Zr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), hk = {
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
}, fk = 120, M0 = 20, pk = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < M0), _0 = (e) => Ks[e] || Ks.idle, mk = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Xr = "airborne", S0 = "landing", E0 = "travelling", Qr = "grounded", gk = ({ airborne: e, landing: t, trip: n }) => e ? Xr : t ? S0 : n != null && n.started ? E0 : Qr;
function vk(e, t) {
  var a;
  const n = A0(e, t);
  return e.mode === Qr && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function A0(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: v = null } = e;
  if (n === Xr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...C0(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const y = v !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? v : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : _0(u), facing: y ? v : i.posture === "sit" ? i.face : f };
}
function C0(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const Ys = (e) => e.outcome, O0 = "plugin:code-commandments:sins:", po = (e) => e.type === "plugins.card" && e.markKey.startsWith(O0), T0 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => po(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => po(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], yk = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: Zo(n) })).sort((n, s) => n.time - s.time), mo = { user: "reacted", agent: "agent_reacted" };
function wk(e, t) {
  return e.filter((n) => mo[n.author] && kt(n) > t).map((n) => ({ beat: `${mo[n.author]}:${n.emoji}`, time: kt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const I0 = [.../* @__PURE__ */ new Set([...Object.values(zr).flatMap((e) => Object.keys(e)), ...Object.keys(Vr)])];
function bk(e, t) {
  return e.filter((n) => n.author === "agent" && kt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = I0.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: kt(n), card: Zo(n) })).sort((n, s) => n.time - s.time);
}
const R0 = (e) => new Jr(e).isTest(), Nn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Ys(e)] || "";
}, B0 = 1800, L0 = (e, t) => {
  if (Nn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Nn(n) !== "finished" && Number(e.time) - Number(n.time) <= B0 ? "tests_fixed" : "tests_passed";
};
function kk(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(R0), a = s.filter((i) => Nn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Nn(i))), o.map((i) => ({ beat: L0(i, a), time: Number(i.time), card: i.key }));
}
function xk(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Ys(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: Ys(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const $k = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: kt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function Mk(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function _k(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Sk(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = T0.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function ya(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const go = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function D0(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    ya(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function Ek(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : k0(`held:${e}`) ? "idle" : e;
}
const Ce = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function Ak(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Ce.ahead * n ? 180 : Math.sign(s) * Ce.turn;
}
const vo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Ck(e, t) {
  const n = Math.min(Ce.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Ce.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Ce.lines, Math.floor((e.bottom - e.top - 2 * s) / Ce.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ce.sweep) % a, i = o % Ce.sweep, l = Ce.sweep - Ce.returnSeconds, u = vo((i - l) / Ce.returnSeconds), d = i <= l ? vo(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Ce.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const yo = 3, ei = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, wo = 12, Ok = (e, t) => ({ mood: e, began: t, seen: 0 });
function Tk(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!ei(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= yo ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * wo) / wo, lasts: yo } };
}
const Ik = (e) => e.posture === "hang" && !ei(e.face), N0 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), P0 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function Rk(e, t, n) {
  return N0.has(e) ? 1 / 0 : !P0.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(ti(n - t.began, t.share) - Xe.lead, 0);
}
const j0 = 5;
function Bk(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= j0 ? { beat: "long_walk", time: n } : null };
}
const q0 = 30, $n = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function Lk(e, t, n, s, a = null) {
  if (t && n < t.until || !$n.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = $n.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + $n.every } : { state: e, began: 0, until: 0, next: n + $n.every };
}
const Dk = (e, t, n) => t && n < t.until && Zr.has(e.state) ? { state: t.state, since: t.began } : e, Xe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, ti = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function Nk(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = ti(o, e.share);
  return a ? { eager: F0(t, r), moment: null } : r > Xe.lead ? { eager: t, moment: null } : r < Xe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Xe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Xe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function F0(e, t) {
  return e.on && t > Xe.lead + Xe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Xe.lead && t >= Xe.least ? { ...e, on: !0, calm: !1 } : e;
}
const W0 = 1, H0 = { look: "look", gaze: "gaze" };
function U0(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [H0[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const z0 = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), V0 = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > W0 * t, memory: s, now: a, room: o }, n).name === "backflip", G0 = { work: ["building"], idle: ["standing"] };
function Pk(e, t, n, s) {
  const a = Ks[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(G0[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), Zr.has(e) ? { moments: o, began: n || s } : (n && s - n >= q0 && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function K0(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const bo = { pondering: K0 };
function jk(e, t, n, s, a, o) {
  if (bo[e.beat]) {
    const i = bo[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = U0(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== va && { lifetime: r.lifetime } } } : null;
}
function qk(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = z0(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const Fk = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function Wk(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function Hk(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const Uk = (e, t) => !!(e != null && e.watches) && !t.once, zk = 10, Vk = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || $0(s, s.queuedAt, n)), Gk = (e, t) => t ? null : e[0] ?? null;
function Kk(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const Yk = (e, t) => !t.during || !e.some((n) => n.during === t.during), Y0 = 2 * Math.PI, J0 = 500;
function Jk(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / J0, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), v = Y0 * r / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, _ = (u ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !l ? a && !t.behind && !y.behind ? X0(y, t, n, v, a) : ev(y, t, n, v) : t) ?? y, w = _ != null && _.behind && _.mood === "reading" ? Z0(e.point, _, n, r, a) : _;
  return { point: w ?? null, toward: w ? { x: w.x - n.x, y: w.y - n.y } : null, amount: f, at: s };
}
function Z0(e, t, n, s, a) {
  const o = (S) => S * 180 / Math.PI, r = (S) => o(Math.atan2(Math.sin(S * Math.PI / 180), Math.cos(S * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), v = f ? r(e.readingFacing - i) : 0, y = f ? e.readingYaw + v : d, O = y + r(u - y), _ = Math.min(Math.max(s / 1e3, 0), 0.1), w = Ce.turnSpeed * _, x = f ? y + Math.min(Math.max(O - y, -w), w) : O, M = f ? e.readingFollow + v : x, z = M + (x - M) * (1 - Math.exp(-_ / Ce.followSeconds)), $ = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, g = o(ya(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), I = Math.min(Math.max(g, -$.up), $.down), A = Ce.tipSpeed * _, P = f ? e.readingPitch + Math.min(Math.max(I - e.readingPitch, -A), A) : I;
  return { ...t, readingYaw: x, readingFollow: z, readingPitch: P, readingFacing: i };
}
function X0(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (M) => {
    const { yaw: z, pitch: $ } = ya(M.x - n.x, a, n.y - M.y, o);
    return { yaw: z, pitch: Math.min(Math.max($, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [go(i(e)), go(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [v, y] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [O, _, w] = l.map((M, z) => v * M + y * u[z]), x = a * O / _;
  return { ...t, x: n.x + x, y: n.y - D0(x, a, -Math.asin(Math.min(Math.max(w, -1), 1)), o) };
}
const Q0 = 0.15;
function Zk(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= Q0;
}
function ev(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const tv = (e) => !(e != null && e.on);
function Xk(e, t, n) {
  if (tv(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const nn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ke = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ps = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), ko = (e) => e * e * (3 - 2 * e);
function nv(e) {
  if (e < 0 || e >= Ke.seconds) return null;
  const t = ps(e, ...Ke.flicker), n = Math.floor(t * Ke.flickers * 2) % 2 === 0, s = e < Ke.flicker[1] ? n ? 0.35 + 0.5 * t : Ke.dim : 1;
  return { strength: 1 - ko(ps(e, ...Ke.fade)), lit: s, white: e < Ke.flash[0] ? 0 : 1 - ko(ps(e, ...Ke.flash)) };
}
const Qk = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function e5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = nv(t - e.at);
  return s && { colour: nn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ke.signs[e.tone], ...s } };
}
function t5(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function n5(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= nn.looks || s === null && n - e.since >= nn.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function s5(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const ot = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, a5 = { behind: 39, figure: 40, ahead: 41 }, sv = "[data-figure-pile]", av = { amber: [1, 0.69, 0.125], good: nn.colours.good, bad: nn.colours.bad }, On = { phases: 4, ms: 230, dim: 0.25 }, o5 = (e, t, n) => e !== "amber" || (t + n) % On.phases < On.phases / 2 ? 1 : On.dim, r5 = (e) => e === "amber" ? On.phases : 1;
function i5(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const l5 = Object.keys(av), He = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ht = ([e, t], n) => e + n() * (t - e);
function c5(e) {
  const t = He.least + Math.floor(e() * (He.most - He.least + 1));
  return Array.from({ length: Math.min(t, He.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * He.spread, [s, a] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Ht(He.start, e), r = Ht(He.reach, e);
    return {
      text: We({ moment: "digit" }, e).name,
      x: s * o,
      y: He.middle + a * o,
      dx: s * r,
      dy: a * r,
      moveMs: Math.round(Ht(He.moveMs, e)),
      fadeMs: Math.round(Ht(He.fadeMs, e))
    };
  });
}
const ms = { high: 3, gap: 1 };
function u5(e) {
  const t = Math.floor(e / ms.high);
  return { left: -(ot.inside + ot.width / 2 + t * (ot.width + ms.gap)), up: e % ms.high * (ot.height - ot.top) };
}
const ov = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, rv = { after: 5 }, iv = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Jr(t).isBuild());
function d5(e, t, n) {
  const s = iv(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= rv.after ? a : null;
}
function h5(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: ov(n, s, a) } : null;
}
const xo = { ahead: 140, up: 70 };
function f5(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * xo.ahead, y: s - xo.up } } : o ? { at: { x: n(o), y: s - o.up - ot.height } } : t ? { at: null } : null;
}
const gs = { least: 4e3, most: 1e4 }, lv = (e) => gs.least + e() * (gs.most - gs.least), vt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function p5(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = lv(t);
    if (n.length >= vt.most || t() >= vt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (vt.at[0] + t() * (vt.at[1] - vt.at[0]));
    n.push({ from: o, to: o + vt.ms }), s = o + vt.ms;
  }
}
const m5 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), g5 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), ni = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), v5 = new Set(Yn.filter((e) => ni.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), cv = (e) => e.some((t) => t.state === "built"), y5 = (e, t) => cv(t) ? e.filter((n) => !ni.has(n.beat)) : e, ct = { reach: 40, room: 6 }, uv = (e, t) => t <= e - ct.reach + 2, w5 = (e, t, n) => uv(e, n) ? t - ct.reach : e - ct.reach - ct.room, b5 = (e, t, n, s) => s > 0 && t < e && t + ct.reach >= e - 2 ? Math.min(n, Math.max(e, t + ct.reach)) : e, vs = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, k5 = (e) => Ht(e() < vs.longShare ? vs.long : vs.short, e), dv = 2 * ot.width;
function x5(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= dv ? o : e + (o - e + a / 2) % a;
}
const hv = 60, $5 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= hv, $o = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector($o);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll($o)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, fv = "[data-figure-docked-bars]", pv = "[data-figure-chat-foot]", mv = [0.85, 0.6, 0.35, 0.15], gv = ["question", "waiting", "suggestion"], M5 = (e, t) => gv.find((n) => e[n] > 0 && t[n] === "behind") || null;
function _5() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const vv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", yv = "[data-figure-newest]";
function si() {
  var s, a;
  const e = (s = fn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(yv), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !wa(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function sn(e, t, n = si()) {
  if (!e || !n) return !0;
  const s = tt(e, t), a = Zn(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ae.top * t.size, bottom: s.top + Ae.bottom * t.size }, r = wt.gap;
  return !Jn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function S5(e, t, n, s = si()) {
  if (!s || sn(t, e, s)) return null;
  const a = Zn(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = Mt(), l = t.posture === "stand" ? ka * e.size : di * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - wt.gap - r, s.right + wt.gap + o].map((v) => ({ ...t, x: v })).filter((v) => v.x >= u && v.x <= d && sn(v, e, s) && Gv(v, e)).sort((v, y) => Math.abs(v.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const ys = 0.26, ai = 0.54, wv = 1.25 / 5.4, pn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ys, travels: "stand" },
  lounge: { drop: ys, travels: "stand" },
  composed: { drop: ys, travels: "stand" },
  hang: { drop: ai, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, E5 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * wv * Math.cos(t * Math.PI / 180),
  y: 1 - n - ai
}), Ut = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), bv = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), A5 = (e, t) => (e === "sit" ? bv.has(t) : Ut.has(e)) ? e : "stand";
function C5(e, t) {
  return e.facing === t.facing || !Ut.has(e.posture) && !Ut.has(t.posture) ? t : { posture: "stand", facing: Ut.has(e.posture) ? e.facing : t.facing };
}
const O5 = 0.25, T5 = (e, t) => Ut.has(e) && pn[t].drop === 0, oi = 2, kv = 90, xv = 180, $v = 140, Mv = 280, _v = 420, Sv = 0.25, Ev = 290, Av = 600, Cv = "cubic-bezier(0.2, 0.7, 0.4, 1)", Ov = "cubic-bezier(0.55, 0, 0.9, 0.6)", ws = 5;
function Pn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ws) return null;
  (r || i) && (o = Math.max(o, oi));
  const y = o > 1, O = Math.abs(t.x - e.x), _ = O < ws ? 0 : O / (kv * o) * 1e3, w = Math.min(_, y ? $v : xv), x = Math.abs(t.y - e.y), M = t.y < e.y, z = M && !v && V0(x, n, l, u, d, f), $ = M ? _v + Math.min(x, 400) * Sv : Math.sqrt(2 * x / ga) * 1e3, g = {
    x: t.x,
    y: t.y,
    ms: x > ws ? z ? Av : $ : 0,
    lead: z ? Ev : M ? Mv : 0,
    easing: M ? Cv : Ov,
    hopping: !0,
    clip: z ? "backflip" : M ? "jump" : "fall"
  }, I = { x: t.x, y: t.y, ms: _ + w, lead: 0, easing: "linear", ramp: w, ...y ? { clip: "run" } : {} }, A = v ? Tv(t, n) : g, P = M && !s ? [{ ...I, y: e.y }, A] : [{ ...g, x: e.x }, I];
  return { way: Math.sign(t.x - e.x) || 1, legs: P, lands: !a, pace: o, running: y };
}
const Tv = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Iv = (e, t) => e.postures.includes(t) ? t : e.postures[0], I5 = (e, t, n) => e.posture === "walk" && n ? "walk" : Iv(e.clip, t), tt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - pn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Jn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, wa = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Mt() {
  var t;
  const e = (t = fn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Mn = 0.5, Mo = 20;
function R5(e, t, n = Mt()) {
  const s = tt(e, t);
  return s.left >= n.left + Mo && s.right <= n.right - Mo;
}
function ba(e, t, n = Mt()) {
  const s = tt(e, t), a = s.right - s.left, o = Zn(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Mn && i <= n.right + Mn && s.top >= n.top - Mn && l <= n.bottom + Mn;
}
const jn = [0.35, 0.5, 0.65], qn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ae = { left: jn[0], right: jn.at(-1), top: qn[0], bottom: qn.at(-1) }, Rv = 0.24;
function Zn(e) {
  if (e.posture === "stand") return { left: Ae.left, right: Ae.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Rv * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ae.left, t), right: Math.max(Ae.right, t) };
}
function Bv(e, { size: t }, n = Mt()) {
  const s = Zn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const ka = (Ae.right - Ae.left) / 2 + 0.08;
function B5(e, t) {
  return e === "hang" ? Ae : { ...Ae, bottom: Math.min(Ae.bottom, 1 - t - pn[e].drop) };
}
const Lv = "[data-figure-agent]";
function ri(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !wa(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const ii = (e) => qn.flatMap(
  (t) => jn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function xa(e, t, n = "") {
  if (!sn(e, t)) return jn.length * qn.length;
  const s = tt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(vv)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && Jn(a, l) && wa(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return ii(a).filter(([i, l]) => r(i, l) || ri(i, l, n)).length;
}
function Dv(e, t) {
  const n = tt(e, t);
  return ii({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => ri(s, a, "", Lv)).length;
}
const _o = 4;
function L5(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = _o; o <= a; o += _o)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!Dv(i, e) && sn(i, e)) return i;
    }
  return null;
}
function an(e, t, n) {
  const s = Mt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => ba(r, t, s) && sn(r, t)).map((r) => ({ spot: r, covered: xa(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const li = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Nv = [0.5, 0.25, 0.75], Pv = (e) => li(e.getBoundingClientRect(), Nv), ci = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, jv = ka, qv = (e, t, { size: n }, s = jv) => ui(e, ci[t], s * n, "stand");
function ui(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Fv = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, di = 0.1, Wv = (e, t, { size: n }) => ui(e, Fv[t], di * n, "sit"), Hv = (e) => ((e + 180) % 360 + 360) % 360 - 180, bs = 60;
function D5(e, t) {
  const n = Hv(t);
  return !e.aside || Math.abs(n) >= bs ? t : n < 0 ? 360 - bs : bs;
}
const zt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Uv = (e) => [.../* @__PURE__ */ new Set([e, ...zt.turns.map((t) => (t + 360) % 360)])];
function N5(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = Uv(t), r = zt.every[0] + s() * (zt.every[1] - zt.every[0]);
  return { face: t, from: a ? zv(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function zv(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / zt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function P5(e, t) {
  const { element: n, edge: s } = Xn(), a = ["left", "right"].map((i) => mn(Wv(s, i, e), e)).filter((i) => n && ba(i, e) && !xa(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function j5(e, t, { size: n }) {
  const s = (Ae.right - Ae.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - hi } : e;
}
const hi = 7;
function fi() {
  const e = [...document.querySelectorAll(sv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Vv(e, t) {
  const n = tt(e, t), s = n.right - n.left;
  return { left: n.left + Ae.left * s, right: n.left + Ae.right * s, top: n.top + Ae.top * s, bottom: n.bottom };
}
function Gv(e, t) {
  const n = fi();
  return !n || !Jn(Vv(e, t), n);
}
const Kv = 4;
function Xn() {
  const e = gn(), t = fi(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Kv || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - hi - n, 0) } };
}
const q5 = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = Mt(), { size: s, below: a } = t, o = pn[e.posture].drop * s;
  return { ...Bv(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Js = (e, t) => Object.keys(ci).map((n) => mn(qv(e, n, t), t)), $a = (e, t) => li(e, mv).map((n) => mn(n, t)), pi = (e, t, n) => an(e, t, n) ?? e[0];
function F5(e, t) {
  const { element: n, edge: s } = Xn();
  return { ...pi(Js(s, e), e, t), view: null, on: n };
}
function W5(e, t, n, s) {
  const { element: a, edge: o } = Xn(), r = (s ? Js(o, t) : [...Js(o, t), ...$a(o, t)]).filter(
    (u) => !Jn(tt(u, t), e)
  ), i = an(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !xa(i, t) ? i : an(r, t, n);
  return l && { ...l, view: null, on: a };
}
function gn() {
  var s;
  const e = fn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(fv);
  if (!t) return { ...Qn(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const So = { within: 2 };
function H5(e) {
  const { element: t, docked: n, edge: s } = gn();
  if (!n || e.on !== t) return !0;
  const a = Qn().edge;
  return s.left > a.left + So.within || s.left + s.width < a.left + a.width - So.within;
}
const Yv = "[data-figure-closing]";
function U5() {
  var n;
  const { element: e, docked: t } = gn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Yv));
}
const mi = "[data-figure-progress]";
function z5(e) {
  const t = e.querySelector(mi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function V5(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const Jv = { across: 300, above: 380, below: 60 };
function G5(e) {
  const { across: t, above: n, below: s } = Jv;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: Zv(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const Zv = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), gi = "[data-figure-bar]", Zs = { back: 144, along: 0.4 };
function K5(e) {
  const { element: t, docked: n, edge: s } = gn(), a = n ? t.querySelector(gi) : null;
  if (!(a != null && a.querySelector(mi))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...mn({ x: o - Zs.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Y5(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < Zs.along * s.size ? t.x + Zs.along * s.size : e.x, y: e.y, behind: !0 };
}
function J5(e) {
  const t = e.querySelector(gi), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const s = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: s, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Qn() {
  const e = fn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function Z5(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = Qn(), l = n === null ? Xv(i, e, o === null ? t : { x: o, y: i.top }, s, a) : mn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function Xv(e, t, n, s, a) {
  const o = $a(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + ot.width < a && l.x + s - ct.reach - ct.room >= r);
  return an(i.length ? i : o, t, n);
}
const Qv = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function X5(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  (o || r) && (a = Math.max(a, oi));
  const y = (z) => {
    const $ = tt(z, n, pn[z.posture].travels);
    return { x: $.left, y: $.top };
  }, O = t.ladder ?? e.ladder;
  if (O && !(t.ladder && e.ladder)) return ey(y(e), y(t), y({ ...O.foot, posture: "stand" }), O.way, !!t.ladder, n, a);
  const [_, ...w] = [e, ...l, t].map(y), x = Pn(_, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: v }), M = w.slice(1).map((z, $) => {
    var g;
    return (g = Pn(w[$], z, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : g.legs.find((I) => I.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...M.filter(Boolean)] };
}
function ey(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Qv.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? Pn(e, n, o.size, { pace: r }) : Pn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function Q5(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function e4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && an(Pv(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = Xn();
  return { ...pi($a(a, t), t, n), view: null, on: s };
}
const ty = "[data-figure-bubble]", ny = 250;
let Vt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), vi = 0;
const Nt = () => Vt, ks = /* @__PURE__ */ new WeakMap();
let sy = 0;
function Ma(e) {
  return ks.has(e) || ks.set(e, `floor-${++sy}`), ks.get(e);
}
const ay = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, oy = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function ry(e, t) {
  var s;
  const n = (s = e.querySelector(pv)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function iy(e, t) {
  const n = e && ry(e, t), s = e ? [...e.querySelectorAll(ty)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || ay(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Ma(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const ly = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= ny ? (t.top - s.top) / a * 1e3 : 0;
};
function yi(e = Vt, t = performance.now()) {
  const n = Mt(), s = oy(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = gn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = Qn();
  return u.element && l.push({ id: Ma(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...iy(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: ly(e, d, t) }))) });
}
const Xs = /* @__PURE__ */ new Set();
function cy(e) {
  return Xs.add(e), () => Xs.delete(e);
}
function uy() {
  wi();
  const e = () => {
    vi = requestAnimationFrame(e), !document.hidden && (Vt = yi(Vt), Xs.forEach((t) => t(Vt)));
  };
  e();
}
function wi() {
  cancelAnimationFrame(vi);
}
const _a = 5, dy = 56, hy = { share: 0.6 }, fy = (e) => -Math.sqrt(2 * ga * hy.share * e), Rt = (e, t) => e.find((n) => n.id === t) ?? null;
function t4(e, t = yi().floors) {
  const n = Rt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : Ma(e.on) : null, o = a && Rt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function bi({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Nt().floors) {
  const u = Rt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || py(u, d, o)) && my(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Sa = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, py = (e, t, n) => !Sa({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function n4(e, t = Nt().floors) {
  if (!Sa(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= _a && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function my(e, t, n = Nt().floors) {
  const s = Rt(n, "home");
  return e.posture === "hang" && s && tt(e, t).bottom >= s.top ? !1 : ba(e, t);
}
function s4(e, t, n, s = Nt().floors) {
  const a = bi(e, n, s);
  if (!e.home) return gy(e, t, a, s);
  if (!a) return null;
  const o = Rt(s, "home"), r = a.y - t.y, i = r > _a ? "dropping" : -r > dy ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function gy(e, t, n, s) {
  const a = n ? Rt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: fy(e.risen) };
  if (!n) return null;
  if (Sa(t) && n.y - t.y > _a) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function a4(e, t, n) {
  const s = ka * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function o4(e, t, n, s = Nt().floors) {
  const a = t && bi(t, n, s);
  return a ? { ...e, ...a } : e;
}
const vy = ["data-kind"], yy = { class: "figure-floor-name" }, wy = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: be({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", yy, b(e.floor.kind), 1)
    ], 12, vy));
  }
}, by = /* @__PURE__ */ K(wy, [["__scopeId", "data-v-8f6132da"]]), ky = {
  class: "figure-floors",
  "aria-hidden": "true"
}, xy = {
  __name: "FigureFloors",
  setup(e) {
    const t = Fn(Nt().floors);
    let n = () => {
    };
    return Fe(() => {
      n = cy((s) => t.value = s.floors), uy();
    }), Ie(() => {
      n(), wi();
    }), (s, a) => (c(), h("div", ky, [
      (c(!0), h(Y, null, se(t.value, (o) => (c(), G(by, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, r4 = /* @__PURE__ */ K(xy, [["__scopeId", "data-v-e519168b"]]), xs = (e) => typeof e == "number" ? e : Date.parse(e);
function i4(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: xs(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => xs(a.row.created_at) - xs(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const $y = 3, $s = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function My(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = $s[n.grouping]) == null ? void 0 : s.call($s, e.row, n)) || "";
}
function _y(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function l4(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= $y ? [_y(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = My(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Sy = 1e3;
function c4() {
  const e = D(Date.now()), t = setInterval(() => e.value = Date.now(), Sy);
  return Lt(() => clearInterval(t)), e;
}
const u4 = (e) => (t) => t.filter((n) => n.id !== e), d4 = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), h4 = (e) => (t) => [...t, e], f4 = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function p4(e) {
  const t = Wn(), n = D(null), s = D("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const _n = /* @__PURE__ */ new Map();
function Ey(e, t) {
  if (_n.has(e)) return _n.get(e);
  const n = t().finally(() => _n.delete(e));
  return _n.set(e, n), n;
}
function m4() {
  const e = Wn(), t = D(null), n = D("");
  async function s() {
    const a = await Ey(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const Ay = { class: "cards-page" }, Cy = { class: "cards-bar" }, Oy = { class: "cards-count" }, Ty = { class: "cards" }, Iy = {
  key: 1,
  class: "cards-note"
}, Ry = {
  key: 2,
  class: "cards-note"
}, By = ["data-row", "onClick"], Ly = { class: "card-head" }, Dy = { class: "card-age" }, Ny = { class: "card-title" }, Py = { class: "card-foot" }, jy = {
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
    return (s, a) => (c(), h("div", Ay, [
      m("div", Cy, [
        m("span", Oy, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        W(we, ut({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: V(() => [
            W(ve, {
              name: "plus",
              size: 12
            }),
            ce(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", Ty, [
        e.loaded ? e.failure ? (c(), h("p", Iy, b(e.failure), 1)) : e.rows.length ? E("", !0) : (c(), h("p", Ry, "No " + b(e.noun) + "s yet", 1)) : (c(), G(Dt, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(Y, null, se(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          m("span", Ly, [
            W(ve, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ce(" " + b(e.head(o)), 1),
            m("span", Dy, b(U(Ws)(o.created_at)), 1)
          ]),
          m("span", Ny, b(e.title(o)), 1),
          m("span", Py, b(e.foot(o)), 1)
        ], 8, By))), 128))
      ]),
      he(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, g4 = /* @__PURE__ */ K(jy, [["__scopeId", "data-v-decaab9b"]]), Eo = "newest";
function v4(e, { title: t, isOpen: n = null }) {
  const s = D(""), a = D(Eo), o = D("all"), r = R(() => {
    const l = s.value.trim().toLowerCase(), u = e.value.filter((d) => (!l || JSON.stringify(d).toLowerCase().includes(l)) && (o.value === "all" || !n || n(d) === (o.value === "open")));
    return a.value === Eo ? u : [...u].sort((d, f) => t(d).localeCompare(t(f)));
  }), i = R(() => !!s.value.trim() || !!n && o.value !== "all");
  return { words: s, order: a, state: o, shown: r, filtering: i, hasStates: !!n };
}
const qy = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Fy = 40, Wy = "top", Hy = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = Te(Be, null)) == null ? void 0 : f.autoScroll, a = R(() => s === Wy), o = D(null), r = D(!1), i = (v) => a.value ? v.scrollTop : v.scrollHeight - v.scrollTop - v.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= Fy;
    }
    return xe(() => n.rowCount, async () => {
      await rn(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (v, y) => (c(), h("div", qy, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        he(v.$slots, "default", {}, void 0, !0)
      ], 34),
      W(Bt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: V(() => [
          dt(m("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            W(ve, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            y[0] || (y[0] = ce(" Newest ", -1))
          ], 512), [
            [Di, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, y4 = /* @__PURE__ */ K(Hy, [["__scopeId", "data-v-3accb764"]]), Uy = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, zy = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Te(Be, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (c(), h("div", Uy, [
      (c(!0), h(Y, null, se(U(s), (i) => {
        var l;
        return c(), G(we, {
          key: i.key,
          kind: "text",
          class: J(["inner-tab", { on: ((l = e.active) == null ? void 0 : l.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: V(() => [
            ce(b(i.label) + " " + b(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, w4 = /* @__PURE__ */ K(zy, [["__scopeId", "data-v-cf3bb39f"]]), Vy = {}, Gy = { class: "menu-label" };
function Ky(e, t) {
  return c(), h("span", Gy, [
    he(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Qs = /* @__PURE__ */ K(Vy, [["render", Ky], ["__scopeId", "data-v-aa955b3e"]]), Yy = {
  class: "search-bar",
  "data-search-bar": ""
}, Jy = { class: "search-bar-control" }, Zy = ["value", "placeholder", "aria-label"], Xy = ["aria-expanded"], Qy = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const s = e, a = n, o = Ni(), r = ((x = Te(Be, null)) == null ? void 0 : x.search) ?? {}, i = R(() => r.placeholder || s.placeholder), l = r.context ?? [], u = D(null), d = D(null), f = D([]), v = R(() => f.value.length ? f.value[f.value.length - 1].next : l), y = R(() => !!o.menu || l.length > 0), O = (M) => {
      f.value = [], d.value = d.value ? null : M.currentTarget;
    };
    function _(M) {
      if (M.next.length) {
        f.value = [...f.value, M];
        return;
      }
      d.value = null, a("pick", M.click);
    }
    function w() {
      var M;
      a("update:modelValue", ""), (M = u.value) == null || M.focus();
    }
    return t({ focus: () => {
      var M;
      return (M = u.value) == null ? void 0 : M.focus();
    } }), (M, z) => {
      var $;
      return c(), h("div", Yy, [
        m("div", Jy, [
          W(ve, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          m("input", {
            ref_key: "field",
            ref: u,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: z[0] || (z[0] = (g) => a("update:modelValue", g.target.value)),
            onKeydown: Gt(w, ["esc"])
          }, null, 40, Zy),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: w
          }, [
            W(ve, {
              name: "close",
              size: 12
            })
          ])) : E("", !0),
          y.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: O
          }, [
            W(ve, {
              name: "caret",
              size: 12
            })
          ], 8, Xy)) : E("", !0)
        ]),
        ($ = U(r).button) != null && $.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: z[1] || (z[1] = (g) => a("pick", U(r).button.click))
        }, b(U(r).button.title), 1)) : E("", !0),
        he(M.$slots, "default", {}, void 0, !0),
        d.value ? (c(), G(ma, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: z[3] || (z[3] = ke(() => {
          }, ["stop"])),
          onClose: z[4] || (z[4] = (g) => d.value = null)
        }, {
          default: V(() => [
            f.value.length ? (c(), G(It, {
              key: 0,
              "data-search-back": "",
              onClick: z[2] || (z[2] = (g) => f.value = f.value.slice(0, -1))
            }, {
              default: V(() => [
                ce("‹ " + b(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : E("", !0),
            (c(!0), h(Y, null, se(v.value, (g) => (c(), G(It, {
              key: g.title,
              description: g.subtext,
              "data-search-entry": g.title,
              onClick: (I) => _(g)
            }, {
              default: V(() => [
                ce(b(g.title) + b(g.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? E("", !0) : he(M.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : E("", !0)
      ]);
    };
  }
}, e2 = /* @__PURE__ */ K(Qy, [["__scopeId", "data-v-5904a3de"]]), t2 = {
  class: "list-tools",
  "data-list-tools": ""
}, n2 = {
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
    return (o, r) => (c(), h("div", t2, [
      W(e2, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": "",
        onPick: r[1] || (r[1] = (i) => n("pick", i))
      }, {
        menu: V(() => [
          W(Qs, null, {
            default: V(() => [...r[2] || (r[2] = [
              ce("Order", -1)
            ])]),
            _: 1
          }),
          (c(), h(Y, null, se(s, (i) => W(It, {
            key: i.key,
            checked: e.tools.order.value === i.key,
            "data-list-order": i.key,
            onClick: (l) => e.tools.order.value = i.key
          }, {
            default: V(() => [
              ce(b(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (c(), h(Y, { key: 0 }, [
            W(Qs, null, {
              default: V(() => [...r[3] || (r[3] = [
                ce("Show", -1)
              ])]),
              _: 1
            }),
            (c(), h(Y, null, se(a, (i) => W(It, {
              key: i.key,
              checked: e.tools.state.value === i.key,
              "data-list-state": i.key,
              onClick: (l) => e.tools.state.value = i.key
            }, {
              default: V(() => [
                ce(b(i.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : E("", !0)
        ]),
        default: V(() => [
          he(o.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, b4 = /* @__PURE__ */ K(n2, [["__scopeId", "data-v-24c1740c"]]);
function k4() {
  const e = D(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const s2 = 86400, ea = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function a2(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ea(t) - ea(e)) / s2);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function x4(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ea(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: a2(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Ms = 280, _s = 240, Ss = 120, o2 = 6, r2 = 14, on = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function i2(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function ki(e, t) {
  const n = Math.max(0, i2(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function l2(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${r2}px)` }), e.offsetHeight, e.style.transition = `height ${Ms}ms ${on}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1;
  const u = () => {
    n() && (t.scrollTop = ki(t, e));
    const d = a() - i;
    if (!l && d >= Ms && (l = !0, e.style.transition = `opacity ${_s}ms ease-out, transform ${_s}ms ${on}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), d < Ms + _s) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function $4(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${o2}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ss}ms ease-out, transform ${Ss}ms ${on}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = ki(t, e)), a() - r < Ss) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const c2 = 140, Sn = 220, u2 = 5;
function M4({ gap: e = c2, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, u2);
    if (s = i.length > 0, !s) return;
    let l = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), l -= 1, l || t(o, e);
      });
  }
  const r = (i, l, u, d = l2) => {
    if (!l.pane || !l.follows()) return u();
    const f = { el: i, options: l, done: u, arrival: d, display: i.style.display || "" };
    if (!s)
      return s = !0, d(i, l, () => a(f));
    i.style.display = "none", n.push(f);
  };
  return r.flush = () => {
    for (const i of n.splice(0))
      i.el.style.display = i.display, i.done();
  }, r;
}
function _4(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Sn}ms ${on}, opacity ${Sn}ms ease-in, margin ${Sn}ms ${on}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Sn);
}
const xi = "chat.pins.minimised", Tn = D(Kt(xi, !1));
function Ao(e) {
  Tn.value = e, Hn(xi, e);
}
function d2(e) {
  const t = R(() => e()), n = R(() => Tn.value ? [] : e()), s = () => Ao(!Tn.value), a = Date.now() / 1e3;
  return xe(
    () => t.value.filter((o) => kt(o) > a).length,
    (o, r) => o > r && Ao(!1)
  ), { pins: t, visible: n, minimised: Tn, toggle: s };
}
const h2 = ["title"], f2 = {
  key: 0,
  class: "pins-count"
}, p2 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = d2(() => t.pinRows);
    return (o, r) => U(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: U(s), inline: e.inline }]),
      title: U(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = ke((...i) => U(a) && U(a)(...i), ["stop"]))
    }, [
      W(ve, {
        name: U(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      U(s) ? (c(), h("span", f2, b(U(n).length), 1)) : E("", !0)
    ], 10, h2)) : E("", !0);
  }
}, S4 = /* @__PURE__ */ K(p2, [["__scopeId", "data-v-d073c504"]]), m2 = ["title"], g2 = ["title"], v2 = { class: "diff-card-dir" }, y2 = { class: "diff-card-name" }, w2 = { class: "diff-card-ago" }, b2 = ["title"], k2 = ["title"], x2 = {
  key: 0,
  class: "diff-card-note"
}, $2 = ["href"], M2 = ["src", "alt"], _2 = { class: "diff-card-rows" }, S2 = { class: "diff-row-num" }, E2 = { class: "diff-row-sign" }, A2 = { class: "diff-row-code" }, C2 = {
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
    function o(T) {
      (T.metaKey || T.ctrlKey) && (T.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, l.value)), d = R(() => n.path.slice(l.value)), f = R(() => n.kind === "deleted"), v = R(() => r[n.kind]), y = R(() => new Set(n.rows.filter((T) => T.line_type === "add").map((T) => T.line))), O = D("after"), _ = R(() => O.value === "before" ? n.whole.old : n.whole.text), w = R(() => n.whole && n.whole.text !== void 0 ? _.value.split(`
`).map((T, k) => ({ line_type: O.value === "after" && y.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: T })) : n.rows.filter(
      (T) => !(n.editsOnly && ["ctx", "fold"].includes(T.line_type)) && !(n.hideRemovals && T.line_type === "del")
    )), x = D(!1), M = R(() => n.lines && !x.value && !n.whole), z = R(() => M.value ? w.value.slice(0, n.lines) : w.value), $ = R(() => w.value.length - z.value.length), g = (T) => T.line === null || T.line_type === "del" ? "" : T.line, I = (T) => T.line_type === "fold" ? T.hidden ? `⋯ ${T.hidden} lines` : "⋯" : T.text, A = D(null), P = D(null);
    let S = null;
    return Fe(() => {
      if (!P.value) return;
      let T = !0;
      S = new ResizeObserver(() => {
        !A.value || !P.value || (A.value.style.transition = T ? "none" : "", A.value.style.height = `${P.value.offsetHeight}px`, T = !1);
      }), S.observe(P.value);
    }), Ie(() => S && S.disconnect()), (T, k) => (c(), h("section", {
      class: J(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (p) => !f.value && s("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${U(a)}-click to open it`,
          onClick: o
        }, [
          m("span", v2, b(u.value), 1),
          m("span", y2, b(d.value), 1),
          v.value ? (c(), h("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, b(v.value), 3)) : E("", !0)
        ], 8, g2),
        m("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        m("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        m("span", w2, b(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: O.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = ke((p) => O.value = O.value === "after" ? "before" : "after", ["stop"]))
        }, b(O.value === "after" ? "After" : "Before"), 9, b2)) : E("", !0),
        f.value ? E("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = ke((p) => s("whole"), ["stop"]))
        }, [
          W(ve, {
            name: "file",
            size: 12
          })
        ], 10, k2))
      ], 8, m2),
      e.whole && e.whole.error ? (c(), h("p", x2, b(e.whole.error), 1)) : E("", !0),
      !f.value && !e.folded ? (c(), h(Y, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          m("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, M2)
        ], 8, $2)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: A,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: P,
            class: "diff-card-diff"
          }, [
            m("div", _2, [
              (c(!0), h(Y, null, se(z.value, (p, B) => (c(), h("div", {
                key: B,
                class: J(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                m("span", S2, b(g(p)), 1),
                m("span", E2, b(i[p.line_type]), 1),
                m("span", A2, b(I(p)), 1)
              ], 2))), 128)),
              $.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = ke((p) => x.value = !0, ["stop"]))
              }, b($.value) + " more " + b($.value === 1 ? "line" : "lines"), 1)) : E("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : E("", !0)
    ], 2));
  }
}, E4 = /* @__PURE__ */ K(C2, [["__scopeId", "data-v-b6424f6e"]]), O2 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(we, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: V(() => [
        W(ve, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Ye = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, T2 = {
  draft: [{ word: "ready", label: "Mark ready" }, Ye],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Ye],
  approved: [{ word: "start", label: "Start", main: !0 }, Ye],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ye],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ye],
  completed: [],
  cancelled: []
}, I2 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Ye],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Ye],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, Ye],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ye],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, R2 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], B2 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], L2 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], D2 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], N2 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], P2 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? N2(t) : e === "agent" ? [...L2(t), ...B2(t)] : e === "check" ? D2(t) : e === "question" ? R2(t) : ((n = { plan: T2, task: I2 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, j2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, q2 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, F2 = { class: "ask-text" }, W2 = ["placeholder", "aria-label"], H2 = ["placeholder", "aria-label"], U2 = {
  key: 3,
  class: "moves"
}, z2 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = R(() => P2(s.kind, s.row)), r = D(""), i = D(null), l = D(""), u = D("");
    xe(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(y, O = "") {
      const _ = await s.read([y.noun ?? s.kind, y.word, String(s.id), ...y.flag ? [y.flag, O] : y.positional ? [O] : [], ...y.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = _.ok ? "" : _.error, _.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (y) => y.confirm ? i.value = y : y.said ? d(y, y.said) : y.flag || y.positional ? (i.value = y, l.value = "") : d(y), v = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (y, O) => {
      var _;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", j2, b(r.value), 1)) : E("", !0),
        (_ = i.value) != null && _.confirm ? (c(), h("div", q2, [
          m("span", F2, b(i.value.confirm), 1),
          W(we, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: O[0] || (O[0] = (w) => d(i.value))
          }, {
            default: V(() => [
              ce(b(i.value.label), 1)
            ]),
            _: 1
          }),
          W(we, {
            small: "",
            kind: "ghost",
            onClick: O[1] || (O[1] = (w) => i.value = null)
          }, {
            default: V(() => [...O[7] || (O[7] = [
              ce("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: ke(v, ["prevent"])
        }, [
          dt(m("input", {
            "onUpdate:modelValue": O[2] || (O[2] = (w) => l.value = w),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: O[3] || (O[3] = Gt(ke((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, W2), [
            [Os, l.value]
          ]),
          i.value.opener ? dt((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": O[4] || (O[4] = (w) => u.value = w),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: O[5] || (O[5] = Gt(ke((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, H2)), [
            [Os, u.value]
          ]) : E("", !0),
          W(we, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: V(() => [
              ce(b(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          W(we, {
            small: "",
            kind: "ghost",
            onClick: O[6] || (O[6] = (w) => i.value = null)
          }, {
            default: V(() => [...O[8] || (O[8] = [
              ce("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", U2, [
          (c(!0), h(Y, null, se(o.value, (w) => (c(), G(we, {
            key: w.word,
            small: "",
            kind: w.main ? "primary" : "ghost",
            "data-move": w.word,
            onClick: (x) => f(w)
          }, {
            default: V(() => [
              ce(b(w.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : E("", !0);
    };
  }
}, V2 = /* @__PURE__ */ K(z2, [["__scopeId", "data-v-fffa0bf6"]]), G2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, K2 = { ...G2, done: "Completed" }, Y2 = { class: "task-status-icon" }, J2 = ["width", "height", "aria-label"], Z2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", Y2, [
      W(Bt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: V(() => [
          (c(), h("svg", {
            key: e.status,
            class: J(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": U(K2)[e.status]
          }, [
            W(oa, { value: e.status }, {
              blocked: V(() => [...n[0] || (n[0] = [
                m("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                m("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: V(() => [...n[1] || (n[1] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                m("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: V(() => [...n[2] || (n[2] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: V(() => [...n[3] || (n[3] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                m("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: V(() => [...n[4] || (n[4] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                m("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: V(() => [...n[5] || (n[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: V(() => [...n[6] || (n[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, J2))
        ]),
        _: 1
      })
    ]));
  }
}, $i = /* @__PURE__ */ K(Z2, [["__scopeId", "data-v-2ab7e404"]]), X2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), Q2 = (e) => X2.has(e), Mi = (e) => Q2(e) ? "done" : e, ew = { class: "facts" }, tw = { class: "fact wide" }, nw = { class: "fact-value" }, sw = {
  key: 0,
  class: "fact"
}, aw = { class: "fact-value" }, ow = {
  key: 1,
  class: "fact"
}, rw = { class: "fact-value" }, iw = { class: "fact wide" }, lw = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, cw = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Ln.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return c(), h("div", ew, [
        m("div", tw, [
          o[1] || (o[1] = m("span", { class: "fact-label" }, "Plan", -1)),
          m("span", nw, b((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", sw, [
          o[2] || (o[2] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", aw, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : E("", !0),
        e.task.state === "started" && e.task.holder_id ? (c(), h("div", ow, [
          o[3] || (o[3] = m("span", { class: "fact-label" }, "Holder", -1)),
          m("span", rw, "Agent " + b(e.task.holder_id), 1)
        ])) : E("", !0),
        m("div", iw, [
          o[4] || (o[4] = m("span", { class: "fact-label" }, "Priority", -1)),
          W(x1, {
            options: U(n),
            value: String(U(_r)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (l) => s("priority", l))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", lw, b(e.refusal), 1)) : E("", !0)
        ])
      ]);
    };
  }
}, uw = /* @__PURE__ */ K(cw, [["__scopeId", "data-v-2018762d"]]), dw = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, hw = ["onClick"], fw = { class: "wait-id" }, pw = { class: "wait-title" }, mw = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, gw = { class: "text" }, vw = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, yw = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, ww = 180, bw = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = D(!1);
    return (a, o) => (c(), h(Y, null, [
      e.task.waits.length ? (c(), h("section", dw, [
        o[1] || (o[1] = m("h4", null, "Waits on", -1)),
        (c(!0), h(Y, null, se(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          W($i, {
            status: U(Mi)(r.state),
            size: 12
          }, null, 8, ["status"]),
          m("span", fw, b(r.id), 1),
          m("span", pw, b(r.title), 1)
        ], 8, hw))), 128))
      ])) : E("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", mw, [
        o[2] || (o[2] = m("h4", null, "How it was done", -1)),
        m("p", gw, b(e.task.outcome), 1)
      ])) : E("", !0),
      e.task.brief ? (c(), h("section", vw, [
        o[3] || (o[3] = m("h4", null, "The brief", -1)),
        m("p", {
          class: J(["text", { clamped: !s.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > ww && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : E("", !0)
      ])) : E("", !0),
      e.task.logs.length ? (c(), h("section", yw, [
        o[4] || (o[4] = m("h4", null, "Log", -1)),
        (c(!0), h(Y, null, se(e.task.logs, (r) => (c(), h("p", {
          key: r.id,
          class: "log"
        }, b(r.line), 1))), 128))
      ])) : E("", !0)
    ], 64));
  }
}, kw = /* @__PURE__ */ K(bw, [["__scopeId", "data-v-f411ce35"]]), xw = { class: "comment-side-head" }, $w = {
  key: 0,
  class: "comment-none"
}, Mw = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", xw, [
        n[1] || (n[1] = m("h3", null, "Comments", -1)),
        W(Vn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? E("", !0) : (c(), h("p", $w, "No comments yet")),
      (c(!0), h(Y, null, se(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, b(e.words(s)), 1))), 128))
    ], 2));
  }
}, _w = /* @__PURE__ */ K(Mw, [["__scopeId", "data-v-19fdbdd4"]]), Sw = ["data-comments-below"], Ew = 600, Aw = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, stacked: Boolean },
  emits: ["close"],
  setup(e) {
    const t = e, n = D(null), s = D(!1), a = R(() => t.stacked || s.value), o = new ResizeObserver(([r]) => s.value = r.contentRect.width < Ew);
    return Fe(() => o.observe(n.value)), Lt(() => o.disconnect()), (r, i) => (c(), h("div", {
      ref_key: "root",
      ref: n,
      class: J(["commented-row", { below: a.value }]),
      "data-comments-below": a.value || null
    }, [
      he(r.$slots, "default"),
      e.open ? (c(), G(_w, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: a.value,
        onClose: i[0] || (i[0] = (l) => r.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : E("", !0)
    ], 10, Sw));
  }
}, Cw = /* @__PURE__ */ K(Aw, [["__scopeId", "data-v-301b4377"]]), Ow = ["placeholder"], Tw = { class: "actions" }, Iw = { class: "error" }, Rw = {
  key: 1,
  class: "card closed"
}, Bw = { class: "mark" }, Lw = { class: "prompt" }, Dw = {
  key: 0,
  class: "draft"
}, Nw = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Cs({
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
  emits: /* @__PURE__ */ Cs(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = As(e, "draft"), r = As(e, "error"), i = D(!!r.value), l = D(!1), u = D(!1), d = D(null);
    async function f() {
      var _, w;
      i.value = !0, l.value = !1, await rn(), (w = ((_ = d.value) == null ? void 0 : _.querySelector("input")) || d.value) == null || w.focus();
    }
    function v() {
      i.value = !1, r.value = "";
    }
    function y(_) {
      _.shiftKey || _.isComposing || (_.preventDefault(), O());
    }
    async function O() {
      const _ = o.value.trim();
      if (!(!_ || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(_), i.value = !1, l.value = !0;
        } catch (w) {
          o.value = _, r.value = w.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (_, w) => (c(), h("div", {
      class: J(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: ke(O, ["prevent"]),
        onKeydown: Gt(v, ["esc"])
      }, [
        he(_.$slots, "who", {}, void 0, !0),
        dt(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": w[0] || (w[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Gt(y, ["enter"])
        }, null, 40, Ow), [
          [Os, o.value]
        ]),
        m("div", Tw, [
          m("span", Iw, b(r.value), 1),
          W(we, {
            small: "",
            onClick: v
          }, {
            default: V(() => [...w[2] || (w[2] = [
              ce("Cancel", -1)
            ])]),
            _: 1
          }),
          W(we, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: O
          }, {
            default: V(() => [...w[3] || (w[3] = [
              ce("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", Rw, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          m("span", Bw, [
            W(ve, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", Lw, b(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", Dw, "Draft kept")) : E("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = (x) => a("show"))
        }, [
          m("span", null, b(U(H1)(e.count, "comment")), 1),
          W(ve, {
            name: "down",
            size: 12
          })
        ])) : E("", !0)
      ]))
    ], 2));
  }
}, Pw = /* @__PURE__ */ K(Nw, [["__scopeId", "data-v-79db0c2d"]]);
function jw(e, t) {
  const n = D([]), s = D(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: f, title: v } = e(), y = `On ${d} ${f}, ${v}: `;
    return u.text.startsWith(y) ? u.text.slice(y.length) : u.text;
  };
  async function i() {
    const { kind: u, id: d } = e();
    if (!d) return;
    const f = ++o, v = await t([u, "comments", String(d)]);
    f === o && (n.value = v.ok ? v.value.rows ?? [] : []);
  }
  async function l(u) {
    const { kind: d, id: f } = e(), v = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, v], s.value = !0;
    const y = await t([d, "comment", String(f), u]);
    if (!y.ok)
      throw n.value = n.value.filter((O) => O !== v && O.id !== v.id), new Error(y.error);
    await i();
  }
  return xe(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const qw = { class: "top" }, Fw = {
  class: "crumb",
  "data-task-crumb": ""
}, Ww = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Hw = {
  key: 1,
  class: "body"
}, Uw = { class: "stamp" }, zw = {
  class: "title",
  "data-resource-title": ""
}, Vw = { class: "since" }, Gw = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Kw = { class: "text" }, Yw = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Jw = {
  key: 1,
  class: "note"
}, Zw = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Xw = { class: "text" }, Qw = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = D(null), r = D(null), i = D(""), l = D(""), u = D(null), d = D(null), f = jw(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, ($) => s.read($));
    let v = 0;
    const y = Mi, O = ($) => $.slice(0, 1).toUpperCase() + $.slice(1), _ = R(() => {
      var $;
      return ($ = r.value) != null && $.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function w() {
      const $ = ++v, [g, I] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      $ === v && (i.value = g.ok ? "" : g.error, o.value = g.ok ? g.value : null, r.value = I.ok ? I.value : null);
    }
    xe(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, w();
    }, { immediate: !0 }), xe(() => s.changes, w);
    async function x($) {
      const g = o.value.priority;
      o.value.priority = Number($);
      const I = await s.read(["task", "edit", String(s.id), "--priority", $]);
      if (l.value = I.ok ? "" : I.error, I.ok) return w();
      o.value.priority = g;
    }
    function M($) {
      u.value = null, d.value.press($);
    }
    const z = ($) => {
      var g;
      return ((g = d.value) == null ? void 0 : g.moves.length) && (u.value = $);
    };
    return t({ openStatus: z }), ($, g) => (c(), h("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      m("div", qw, [
        e.backed ? (c(), G(O2, {
          key: 0,
          onBack: g[0] || (g[0] = (I) => a("back"))
        })) : E("", !0),
        m("span", Fw, b(_.value), 1),
        g[9] || (g[9] = m("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(Y, { key: 1 }, [
          W(we, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: g[1] || (g[1] = (I) => a("step", -1))
          }, {
            default: V(() => [
              W(ve, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          W(we, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: g[2] || (g[2] = (I) => a("step", 1))
          }, {
            default: V(() => [
              W(ve, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : E("", !0),
        W(we, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: g[3] || (g[3] = (I) => a("close"))
        }, {
          default: V(() => [
            W(ve, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", Ww, b(i.value), 1)) : o.value ? (c(), h(Y, { key: 2 }, [
        W(Cw, {
          stacked: "",
          open: U(f).open.value,
          comments: U(f).comments.value,
          words: U(f).words,
          onClose: g[6] || (g[6] = (I) => U(f).open.value = !1)
        }, {
          default: V(() => {
            var I;
            return [
              (c(), h("div", {
                key: o.value.id,
                class: "body"
              }, [
                m("div", Uw, "Task " + b(o.value.id) + " · updated " + b(U(Ws)(U(Bs)(o.value)) || "just now"), 1),
                m("h3", zw, b(o.value.title), 1),
                m("div", {
                  class: J(["state-line", U(y)(o.value.state)])
                }, [
                  m("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: g[4] || (g[4] = (A) => z(A.currentTarget))
                  }, [
                    W($i, {
                      status: U(y)(o.value.state)
                    }, null, 8, ["status"]),
                    ce(" " + b(O(o.value.state)), 1)
                  ]),
                  m("span", Vw, "since " + b(U(Ws)(U(Bs)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (c(), h("section", Gw, [
                  g[10] || (g[10] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
                  m("p", Kw, b(o.value.reason || "Other tasks"), 1),
                  (I = o.value.openers) != null && I.length ? (c(), h("p", Yw, "Opens by itself when " + b(o.value.openers.join(" or ")) + ".", 1)) : (c(), h("p", Jw, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (c(), h("section", Zw, [
                  g[11] || (g[11] = m("span", { class: "label" }, "Why it was cancelled", -1)),
                  m("p", Xw, b(o.value.reason), 1)
                ])) : E("", !0),
                W(uw, {
                  task: o.value,
                  place: r.value,
                  refusal: l.value,
                  onPriority: x
                }, null, 8, ["task", "place", "refusal"]),
                W(kw, {
                  task: o.value,
                  onSelect: g[5] || (g[5] = (A) => a("select", A))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        W(Pw, {
          send: U(f).send,
          count: U(f).comments.value.length,
          onShow: g[7] || (g[7] = (I) => U(f).open.value = !U(f).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", Hw, [
        W(Dt)
      ])),
      W(V2, {
        ref_key: "footer",
        ref: d,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: w
      }, null, 8, ["id", "row", "read"]),
      u.value ? (c(), G(ma, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: g[8] || (g[8] = (I) => u.value = null)
      }, {
        default: V(() => [
          W(Qs, null, {
            default: V(() => [
              ce("Change the status of task " + b(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(Y, null, se(d.value.moves, (I) => (c(), G(It, {
            key: I.word,
            onClick: (A) => M(I)
          }, {
            default: V(() => [
              ce(b(I.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : E("", !0)
    ], 2));
  }
}, A4 = /* @__PURE__ */ K(Qw, [["__scopeId", "data-v-eee5a443"]]);
function eb(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Es = { exports: {} }, Co;
function tb() {
  return Co || (Co = 1, (function(e, t) {
    var n = (function() {
      var s = function(g, I) {
        var A = 236, P = 17, S = g, T = o[I], k = null, p = 0, B = null, L = [], q = {}, re = function(N, j) {
          p = S * 4 + 17, k = (function(C) {
            for (var F = new Array(C), H = 0; H < C; H += 1) {
              F[H] = new Array(C);
              for (var X = 0; X < C; X += 1)
                F[H][X] = null;
            }
            return F;
          })(p), le(0, 0), le(p - 7, 0), le(0, p - 7), ee(), Q(), Le(N, j), S >= 7 && Z(N), B == null && (B = _i(S, T, L)), Ve(B, j);
        }, le = function(N, j) {
          for (var C = -1; C <= 7; C += 1)
            if (!(N + C <= -1 || p <= N + C))
              for (var F = -1; F <= 7; F += 1)
                j + F <= -1 || p <= j + F || (0 <= C && C <= 6 && (F == 0 || F == 6) || 0 <= F && F <= 6 && (C == 0 || C == 6) || 2 <= C && C <= 4 && 2 <= F && F <= 4 ? k[N + C][j + F] = !0 : k[N + C][j + F] = !1);
        }, de = function() {
          for (var N = 0, j = 0, C = 0; C < 8; C += 1) {
            re(!0, C);
            var F = i.getLostPoint(q);
            (C == 0 || N > F) && (N = F, j = C);
          }
          return j;
        }, Q = function() {
          for (var N = 8; N < p - 8; N += 1)
            k[N][6] == null && (k[N][6] = N % 2 == 0);
          for (var j = 8; j < p - 8; j += 1)
            k[6][j] == null && (k[6][j] = j % 2 == 0);
        }, ee = function() {
          for (var N = i.getPatternPosition(S), j = 0; j < N.length; j += 1)
            for (var C = 0; C < N.length; C += 1) {
              var F = N[j], H = N[C];
              if (k[F][H] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? k[F + X][H + ae] = !0 : k[F + X][H + ae] = !1;
            }
        }, Z = function(N) {
          for (var j = i.getBCHTypeNumber(S), C = 0; C < 18; C += 1) {
            var F = !N && (j >> C & 1) == 1;
            k[Math.floor(C / 3)][C % 3 + p - 8 - 3] = F;
          }
          for (var C = 0; C < 18; C += 1) {
            var F = !N && (j >> C & 1) == 1;
            k[C % 3 + p - 8 - 3][Math.floor(C / 3)] = F;
          }
        }, Le = function(N, j) {
          for (var C = T << 3 | j, F = i.getBCHTypeInfo(C), H = 0; H < 15; H += 1) {
            var X = !N && (F >> H & 1) == 1;
            H < 6 ? k[H][8] = X : H < 8 ? k[H + 1][8] = X : k[p - 15 + H][8] = X;
          }
          for (var H = 0; H < 15; H += 1) {
            var X = !N && (F >> H & 1) == 1;
            H < 8 ? k[8][p - H - 1] = X : H < 9 ? k[8][15 - H - 1 + 1] = X : k[8][15 - H - 1] = X;
          }
          k[p - 8][8] = !N;
        }, Ve = function(N, j) {
          for (var C = -1, F = p - 1, H = 7, X = 0, ae = i.getMaskFunction(j), ne = p - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (k[F][ne - ye] == null) {
                  var Me = !1;
                  X < N.length && (Me = (N[X] >>> H & 1) == 1);
                  var ie = ae(F, ne - ye);
                  ie && (Me = !Me), k[F][ne - ye] = Me, H -= 1, H == -1 && (X += 1, H = 7);
                }
              if (F += C, F < 0 || p <= F) {
                F -= C, C = -C;
                break;
              }
            }
        }, _t = function(N, j) {
          for (var C = 0, F = 0, H = 0, X = new Array(j.length), ae = new Array(j.length), ne = 0; ne < j.length; ne += 1) {
            var ye = j[ne].dataCount, Me = j[ne].totalCount - ye;
            F = Math.max(F, ye), H = Math.max(H, Me), X[ne] = new Array(ye);
            for (var ie = 0; ie < X[ne].length; ie += 1)
              X[ne][ie] = 255 & N.getBuffer()[ie + C];
            C += ye;
            var De = i.getErrorCorrectPolynomial(Me), Ne = u(X[ne], De.getLength() - 1), Ea = Ne.mod(De);
            ae[ne] = new Array(De.getLength() - 1);
            for (var ie = 0; ie < ae[ne].length; ie += 1) {
              var Aa = ie + Ea.getLength() - ae[ne].length;
              ae[ne][ie] = Aa >= 0 ? Ea.getAt(Aa) : 0;
            }
          }
          for (var Ca = 0, ie = 0; ie < j.length; ie += 1)
            Ca += j[ie].totalCount;
          for (var es = new Array(Ca), vn = 0, ie = 0; ie < F; ie += 1)
            for (var ne = 0; ne < j.length; ne += 1)
              ie < X[ne].length && (es[vn] = X[ne][ie], vn += 1);
          for (var ie = 0; ie < H; ie += 1)
            for (var ne = 0; ne < j.length; ne += 1)
              ie < ae[ne].length && (es[vn] = ae[ne][ie], vn += 1);
          return es;
        }, _i = function(N, j, C) {
          for (var F = d.getRSBlocks(N, j), H = f(), X = 0; X < C.length; X += 1) {
            var ae = C[X];
            H.put(ae.getMode(), 4), H.put(ae.getLength(), i.getLengthInBits(ae.getMode(), N)), ae.write(H);
          }
          for (var ne = 0, X = 0; X < F.length; X += 1)
            ne += F[X].dataCount;
          if (H.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + H.getLengthInBits() + ">" + ne * 8 + ")";
          for (H.getLengthInBits() + 4 <= ne * 8 && H.put(0, 4); H.getLengthInBits() % 8 != 0; )
            H.putBit(!1);
          for (; !(H.getLengthInBits() >= ne * 8 || (H.put(A, 8), H.getLengthInBits() >= ne * 8)); )
            H.put(P, 8);
          return _t(H, F);
        };
        q.addData = function(N, j) {
          j = j || "Byte";
          var C = null;
          switch (j) {
            case "Numeric":
              C = v(N);
              break;
            case "Alphanumeric":
              C = y(N);
              break;
            case "Byte":
              C = O(N);
              break;
            case "Kanji":
              C = _(N);
              break;
            default:
              throw "mode:" + j;
          }
          L.push(C), B = null;
        }, q.isDark = function(N, j) {
          if (N < 0 || p <= N || j < 0 || p <= j)
            throw N + "," + j;
          return k[N][j];
        }, q.getModuleCount = function() {
          return p;
        }, q.make = function() {
          if (S < 1) {
            for (var N = 1; N < 40; N++) {
              for (var j = d.getRSBlocks(N, T), C = f(), F = 0; F < L.length; F++) {
                var H = L[F];
                C.put(H.getMode(), 4), C.put(H.getLength(), i.getLengthInBits(H.getMode(), N)), H.write(C);
              }
              for (var X = 0, F = 0; F < j.length; F++)
                X += j[F].dataCount;
              if (C.getLengthInBits() <= X * 8)
                break;
            }
            S = N;
          }
          re(!1, de());
        }, q.createTableTag = function(N, j) {
          N = N || 2, j = typeof j > "u" ? N * 4 : j;
          var C = "";
          C += '<table style="', C += " border-width: 0px; border-style: none;", C += " border-collapse: collapse;", C += " padding: 0px; margin: " + j + "px;", C += '">', C += "<tbody>";
          for (var F = 0; F < q.getModuleCount(); F += 1) {
            C += "<tr>";
            for (var H = 0; H < q.getModuleCount(); H += 1)
              C += '<td style="', C += " border-width: 0px; border-style: none;", C += " border-collapse: collapse;", C += " padding: 0px; margin: 0px;", C += " width: " + N + "px;", C += " height: " + N + "px;", C += " background-color: ", C += q.isDark(F, H) ? "#000000" : "#ffffff", C += ";", C += '"/>';
            C += "</tr>";
          }
          return C += "</tbody>", C += "</table>", C;
        }, q.createSvgTag = function(N, j, C, F) {
          var H = {};
          typeof arguments[0] == "object" && (H = arguments[0], N = H.cellSize, j = H.margin, C = H.alt, F = H.title), N = N || 2, j = typeof j > "u" ? N * 4 : j, C = typeof C == "string" ? { text: C } : C || {}, C.text = C.text || null, C.id = C.text ? C.id || "qrcode-description" : null, F = typeof F == "string" ? { text: F } : F || {}, F.text = F.text || null, F.id = F.text ? F.id || "qrcode-title" : null;
          var X = q.getModuleCount() * N + j * 2, ae, ne, ye, Me, ie = "", De;
          for (De = "l" + N + ",0 0," + N + " -" + N + ",0 0,-" + N + "z ", ie += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ie += H.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ie += ' viewBox="0 0 ' + X + " " + X + '" ', ie += ' preserveAspectRatio="xMinYMin meet"', ie += F.text || C.text ? ' role="img" aria-labelledby="' + St([F.id, C.id].join(" ").trim()) + '"' : "", ie += ">", ie += F.text ? '<title id="' + St(F.id) + '">' + St(F.text) + "</title>" : "", ie += C.text ? '<description id="' + St(C.id) + '">' + St(C.text) + "</description>" : "", ie += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ie += '<path d="', ye = 0; ye < q.getModuleCount(); ye += 1)
            for (Me = ye * N + j, ae = 0; ae < q.getModuleCount(); ae += 1)
              q.isDark(ye, ae) && (ne = ae * N + j, ie += "M" + ne + "," + Me + De);
          return ie += '" stroke="transparent" fill="black"/>', ie += "</svg>", ie;
        }, q.createDataURL = function(N, j) {
          N = N || 2, j = typeof j > "u" ? N * 4 : j;
          var C = q.getModuleCount() * N + j * 2, F = j, H = C - j;
          return $(C, C, function(X, ae) {
            if (F <= X && X < H && F <= ae && ae < H) {
              var ne = Math.floor((X - F) / N), ye = Math.floor((ae - F) / N);
              return q.isDark(ye, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, q.createImgTag = function(N, j, C) {
          N = N || 2, j = typeof j > "u" ? N * 4 : j;
          var F = q.getModuleCount() * N + j * 2, H = "";
          return H += "<img", H += ' src="', H += q.createDataURL(N, j), H += '"', H += ' width="', H += F, H += '"', H += ' height="', H += F, H += '"', C && (H += ' alt="', H += St(C), H += '"'), H += "/>", H;
        };
        var St = function(N) {
          for (var j = "", C = 0; C < N.length; C += 1) {
            var F = N.charAt(C);
            switch (F) {
              case "<":
                j += "&lt;";
                break;
              case ">":
                j += "&gt;";
                break;
              case "&":
                j += "&amp;";
                break;
              case '"':
                j += "&quot;";
                break;
              default:
                j += F;
                break;
            }
          }
          return j;
        }, Si = function(N) {
          var j = 1;
          N = typeof N > "u" ? j * 2 : N;
          var C = q.getModuleCount() * j + N * 2, F = N, H = C - N, X, ae, ne, ye, Me, ie = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, De = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ne = "";
          for (X = 0; X < C; X += 2) {
            for (ne = Math.floor((X - F) / j), ye = Math.floor((X + 1 - F) / j), ae = 0; ae < C; ae += 1)
              Me = "█", F <= ae && ae < H && F <= X && X < H && q.isDark(ne, Math.floor((ae - F) / j)) && (Me = " "), F <= ae && ae < H && F <= X + 1 && X + 1 < H && q.isDark(ye, Math.floor((ae - F) / j)) ? Me += " " : Me += "█", Ne += N < 1 && X + 1 >= H ? De[Me] : ie[Me];
            Ne += `
`;
          }
          return C % 2 && N > 0 ? Ne.substring(0, Ne.length - C - 1) + Array(C + 1).join("▀") : Ne.substring(0, Ne.length - 1);
        };
        return q.createASCII = function(N, j) {
          if (N = N || 1, N < 2)
            return Si(j);
          N -= 1, j = typeof j > "u" ? N * 2 : j;
          var C = q.getModuleCount() * N + j * 2, F = j, H = C - j, X, ae, ne, ye, Me = Array(N + 1).join("██"), ie = Array(N + 1).join("  "), De = "", Ne = "";
          for (X = 0; X < C; X += 1) {
            for (ne = Math.floor((X - F) / N), Ne = "", ae = 0; ae < C; ae += 1)
              ye = 1, F <= ae && ae < H && F <= X && X < H && q.isDark(ne, Math.floor((ae - F) / N)) && (ye = 0), Ne += ye ? Me : ie;
            for (ne = 0; ne < N; ne += 1)
              De += Ne + `
`;
          }
          return De.substring(0, De.length - 1);
        }, q.renderTo2dContext = function(N, j) {
          j = j || 2;
          for (var C = q.getModuleCount(), F = 0; F < C; F++)
            for (var H = 0; H < C; H++)
              N.fillStyle = q.isDark(F, H) ? "black" : "white", N.fillRect(F * j, H * j, j, j);
        }, q;
      };
      s.stringToBytesFuncs = {
        default: function(g) {
          for (var I = [], A = 0; A < g.length; A += 1) {
            var P = g.charCodeAt(A);
            I.push(P & 255);
          }
          return I;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(g, I) {
        var A = (function() {
          for (var S = M(g), T = function() {
            var Q = S.read();
            if (Q == -1) throw "eof";
            return Q;
          }, k = 0, p = {}; ; ) {
            var B = S.read();
            if (B == -1) break;
            var L = T(), q = T(), re = T(), le = String.fromCharCode(B << 8 | L), de = q << 8 | re;
            p[le] = de, k += 1;
          }
          if (k != I)
            throw k + " != " + I;
          return p;
        })(), P = 63;
        return function(S) {
          for (var T = [], k = 0; k < S.length; k += 1) {
            var p = S.charCodeAt(k);
            if (p < 128)
              T.push(p);
            else {
              var B = A[S.charAt(k)];
              typeof B == "number" ? (B & 255) == B ? T.push(B) : (T.push(B >>> 8), T.push(B & 255)) : T.push(P);
            }
          }
          return T;
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
        ], I = 1335, A = 7973, P = 21522, S = {}, T = function(k) {
          for (var p = 0; k != 0; )
            p += 1, k >>>= 1;
          return p;
        };
        return S.getBCHTypeInfo = function(k) {
          for (var p = k << 10; T(p) - T(I) >= 0; )
            p ^= I << T(p) - T(I);
          return (k << 10 | p) ^ P;
        }, S.getBCHTypeNumber = function(k) {
          for (var p = k << 12; T(p) - T(A) >= 0; )
            p ^= A << T(p) - T(A);
          return k << 12 | p;
        }, S.getPatternPosition = function(k) {
          return g[k - 1];
        }, S.getMaskFunction = function(k) {
          switch (k) {
            case r.PATTERN000:
              return function(p, B) {
                return (p + B) % 2 == 0;
              };
            case r.PATTERN001:
              return function(p, B) {
                return p % 2 == 0;
              };
            case r.PATTERN010:
              return function(p, B) {
                return B % 3 == 0;
              };
            case r.PATTERN011:
              return function(p, B) {
                return (p + B) % 3 == 0;
              };
            case r.PATTERN100:
              return function(p, B) {
                return (Math.floor(p / 2) + Math.floor(B / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(p, B) {
                return p * B % 2 + p * B % 3 == 0;
              };
            case r.PATTERN110:
              return function(p, B) {
                return (p * B % 2 + p * B % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(p, B) {
                return (p * B % 3 + (p + B) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + k;
          }
        }, S.getErrorCorrectPolynomial = function(k) {
          for (var p = u([1], 0), B = 0; B < k; B += 1)
            p = p.multiply(u([1, l.gexp(B)], 0));
          return p;
        }, S.getLengthInBits = function(k, p) {
          if (1 <= p && p < 10)
            switch (k) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + k;
            }
          else if (p < 27)
            switch (k) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + k;
            }
          else if (p < 41)
            switch (k) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + k;
            }
          else
            throw "type:" + p;
        }, S.getLostPoint = function(k) {
          for (var p = k.getModuleCount(), B = 0, L = 0; L < p; L += 1)
            for (var q = 0; q < p; q += 1) {
              for (var re = 0, le = k.isDark(L, q), de = -1; de <= 1; de += 1)
                if (!(L + de < 0 || p <= L + de))
                  for (var Q = -1; Q <= 1; Q += 1)
                    q + Q < 0 || p <= q + Q || de == 0 && Q == 0 || le == k.isDark(L + de, q + Q) && (re += 1);
              re > 5 && (B += 3 + re - 5);
            }
          for (var L = 0; L < p - 1; L += 1)
            for (var q = 0; q < p - 1; q += 1) {
              var ee = 0;
              k.isDark(L, q) && (ee += 1), k.isDark(L + 1, q) && (ee += 1), k.isDark(L, q + 1) && (ee += 1), k.isDark(L + 1, q + 1) && (ee += 1), (ee == 0 || ee == 4) && (B += 3);
            }
          for (var L = 0; L < p; L += 1)
            for (var q = 0; q < p - 6; q += 1)
              k.isDark(L, q) && !k.isDark(L, q + 1) && k.isDark(L, q + 2) && k.isDark(L, q + 3) && k.isDark(L, q + 4) && !k.isDark(L, q + 5) && k.isDark(L, q + 6) && (B += 40);
          for (var q = 0; q < p; q += 1)
            for (var L = 0; L < p - 6; L += 1)
              k.isDark(L, q) && !k.isDark(L + 1, q) && k.isDark(L + 2, q) && k.isDark(L + 3, q) && k.isDark(L + 4, q) && !k.isDark(L + 5, q) && k.isDark(L + 6, q) && (B += 40);
          for (var Z = 0, q = 0; q < p; q += 1)
            for (var L = 0; L < p; L += 1)
              k.isDark(L, q) && (Z += 1);
          var Le = Math.abs(100 * Z / p / p - 50) / 5;
          return B += Le * 10, B;
        }, S;
      })(), l = (function() {
        for (var g = new Array(256), I = new Array(256), A = 0; A < 8; A += 1)
          g[A] = 1 << A;
        for (var A = 8; A < 256; A += 1)
          g[A] = g[A - 4] ^ g[A - 5] ^ g[A - 6] ^ g[A - 8];
        for (var A = 0; A < 255; A += 1)
          I[g[A]] = A;
        var P = {};
        return P.glog = function(S) {
          if (S < 1)
            throw "glog(" + S + ")";
          return I[S];
        }, P.gexp = function(S) {
          for (; S < 0; )
            S += 255;
          for (; S >= 256; )
            S -= 255;
          return g[S];
        }, P;
      })();
      function u(g, I) {
        if (typeof g.length > "u")
          throw g.length + "/" + I;
        var A = (function() {
          for (var S = 0; S < g.length && g[S] == 0; )
            S += 1;
          for (var T = new Array(g.length - S + I), k = 0; k < g.length - S; k += 1)
            T[k] = g[k + S];
          return T;
        })(), P = {};
        return P.getAt = function(S) {
          return A[S];
        }, P.getLength = function() {
          return A.length;
        }, P.multiply = function(S) {
          for (var T = new Array(P.getLength() + S.getLength() - 1), k = 0; k < P.getLength(); k += 1)
            for (var p = 0; p < S.getLength(); p += 1)
              T[k + p] ^= l.gexp(l.glog(P.getAt(k)) + l.glog(S.getAt(p)));
          return u(T, 0);
        }, P.mod = function(S) {
          if (P.getLength() - S.getLength() < 0)
            return P;
          for (var T = l.glog(P.getAt(0)) - l.glog(S.getAt(0)), k = new Array(P.getLength()), p = 0; p < P.getLength(); p += 1)
            k[p] = P.getAt(p);
          for (var p = 0; p < S.getLength(); p += 1)
            k[p] ^= l.gexp(l.glog(S.getAt(p)) + T);
          return u(k, 0).mod(S);
        }, P;
      }
      var d = (function() {
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
        ], I = function(S, T) {
          var k = {};
          return k.totalCount = S, k.dataCount = T, k;
        }, A = {}, P = function(S, T) {
          switch (T) {
            case o.L:
              return g[(S - 1) * 4 + 0];
            case o.M:
              return g[(S - 1) * 4 + 1];
            case o.Q:
              return g[(S - 1) * 4 + 2];
            case o.H:
              return g[(S - 1) * 4 + 3];
            default:
              return;
          }
        };
        return A.getRSBlocks = function(S, T) {
          var k = P(S, T);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + S + "/errorCorrectionLevel:" + T;
          for (var p = k.length / 3, B = [], L = 0; L < p; L += 1)
            for (var q = k[L * 3 + 0], re = k[L * 3 + 1], le = k[L * 3 + 2], de = 0; de < q; de += 1)
              B.push(I(re, le));
          return B;
        }, A;
      })(), f = function() {
        var g = [], I = 0, A = {};
        return A.getBuffer = function() {
          return g;
        }, A.getAt = function(P) {
          var S = Math.floor(P / 8);
          return (g[S] >>> 7 - P % 8 & 1) == 1;
        }, A.put = function(P, S) {
          for (var T = 0; T < S; T += 1)
            A.putBit((P >>> S - T - 1 & 1) == 1);
        }, A.getLengthInBits = function() {
          return I;
        }, A.putBit = function(P) {
          var S = Math.floor(I / 8);
          g.length <= S && g.push(0), P && (g[S] |= 128 >>> I % 8), I += 1;
        }, A;
      }, v = function(g) {
        var I = a.MODE_NUMBER, A = g, P = {};
        P.getMode = function() {
          return I;
        }, P.getLength = function(k) {
          return A.length;
        }, P.write = function(k) {
          for (var p = A, B = 0; B + 2 < p.length; )
            k.put(S(p.substring(B, B + 3)), 10), B += 3;
          B < p.length && (p.length - B == 1 ? k.put(S(p.substring(B, B + 1)), 4) : p.length - B == 2 && k.put(S(p.substring(B, B + 2)), 7));
        };
        var S = function(k) {
          for (var p = 0, B = 0; B < k.length; B += 1)
            p = p * 10 + T(k.charAt(B));
          return p;
        }, T = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return P;
      }, y = function(g) {
        var I = a.MODE_ALPHA_NUM, A = g, P = {};
        P.getMode = function() {
          return I;
        }, P.getLength = function(T) {
          return A.length;
        }, P.write = function(T) {
          for (var k = A, p = 0; p + 1 < k.length; )
            T.put(
              S(k.charAt(p)) * 45 + S(k.charAt(p + 1)),
              11
            ), p += 2;
          p < k.length && T.put(S(k.charAt(p)), 6);
        };
        var S = function(T) {
          if ("0" <= T && T <= "9")
            return T.charCodeAt(0) - 48;
          if ("A" <= T && T <= "Z")
            return T.charCodeAt(0) - 65 + 10;
          switch (T) {
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
              throw "illegal char :" + T;
          }
        };
        return P;
      }, O = function(g) {
        var I = a.MODE_8BIT_BYTE, A = s.stringToBytes(g), P = {};
        return P.getMode = function() {
          return I;
        }, P.getLength = function(S) {
          return A.length;
        }, P.write = function(S) {
          for (var T = 0; T < A.length; T += 1)
            S.put(A[T], 8);
        }, P;
      }, _ = function(g) {
        var I = a.MODE_KANJI, A = s.stringToBytesFuncs.SJIS;
        if (!A)
          throw "sjis not supported.";
        (function(T, k) {
          var p = A(T);
          if (p.length != 2 || (p[0] << 8 | p[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var P = A(g), S = {};
        return S.getMode = function() {
          return I;
        }, S.getLength = function(T) {
          return ~~(P.length / 2);
        }, S.write = function(T) {
          for (var k = P, p = 0; p + 1 < k.length; ) {
            var B = (255 & k[p]) << 8 | 255 & k[p + 1];
            if (33088 <= B && B <= 40956)
              B -= 33088;
            else if (57408 <= B && B <= 60351)
              B -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + B;
            B = (B >>> 8 & 255) * 192 + (B & 255), T.put(B, 13), p += 2;
          }
          if (p < k.length)
            throw "illegal char at " + (p + 1);
        }, S;
      }, w = function() {
        var g = [], I = {};
        return I.writeByte = function(A) {
          g.push(A & 255);
        }, I.writeShort = function(A) {
          I.writeByte(A), I.writeByte(A >>> 8);
        }, I.writeBytes = function(A, P, S) {
          P = P || 0, S = S || A.length;
          for (var T = 0; T < S; T += 1)
            I.writeByte(A[T + P]);
        }, I.writeString = function(A) {
          for (var P = 0; P < A.length; P += 1)
            I.writeByte(A.charCodeAt(P));
        }, I.toByteArray = function() {
          return g;
        }, I.toString = function() {
          var A = "";
          A += "[";
          for (var P = 0; P < g.length; P += 1)
            P > 0 && (A += ","), A += g[P];
          return A += "]", A;
        }, I;
      }, x = function() {
        var g = 0, I = 0, A = 0, P = "", S = {}, T = function(p) {
          P += String.fromCharCode(k(p & 63));
        }, k = function(p) {
          if (!(p < 0)) {
            if (p < 26)
              return 65 + p;
            if (p < 52)
              return 97 + (p - 26);
            if (p < 62)
              return 48 + (p - 52);
            if (p == 62)
              return 43;
            if (p == 63)
              return 47;
          }
          throw "n:" + p;
        };
        return S.writeByte = function(p) {
          for (g = g << 8 | p & 255, I += 8, A += 1; I >= 6; )
            T(g >>> I - 6), I -= 6;
        }, S.flush = function() {
          if (I > 0 && (T(g << 6 - I), g = 0, I = 0), A % 3 != 0)
            for (var p = 3 - A % 3, B = 0; B < p; B += 1)
              P += "=";
        }, S.toString = function() {
          return P;
        }, S;
      }, M = function(g) {
        var I = g, A = 0, P = 0, S = 0, T = {};
        T.read = function() {
          for (; S < 8; ) {
            if (A >= I.length) {
              if (S == 0)
                return -1;
              throw "unexpected end of file./" + S;
            }
            var p = I.charAt(A);
            if (A += 1, p == "=")
              return S = 0, -1;
            if (p.match(/^\s$/))
              continue;
            P = P << 6 | k(p.charCodeAt(0)), S += 6;
          }
          var B = P >>> S - 8 & 255;
          return S -= 8, B;
        };
        var k = function(p) {
          if (65 <= p && p <= 90)
            return p - 65;
          if (97 <= p && p <= 122)
            return p - 97 + 26;
          if (48 <= p && p <= 57)
            return p - 48 + 52;
          if (p == 43)
            return 62;
          if (p == 47)
            return 63;
          throw "c:" + p;
        };
        return T;
      }, z = function(g, I) {
        var A = g, P = I, S = new Array(g * I), T = {};
        T.setPixel = function(L, q, re) {
          S[q * A + L] = re;
        }, T.write = function(L) {
          L.writeString("GIF87a"), L.writeShort(A), L.writeShort(P), L.writeByte(128), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(255), L.writeByte(255), L.writeByte(255), L.writeString(","), L.writeShort(0), L.writeShort(0), L.writeShort(A), L.writeShort(P), L.writeByte(0);
          var q = 2, re = p(q);
          L.writeByte(q);
          for (var le = 0; re.length - le > 255; )
            L.writeByte(255), L.writeBytes(re, le, 255), le += 255;
          L.writeByte(re.length - le), L.writeBytes(re, le, re.length - le), L.writeByte(0), L.writeString(";");
        };
        var k = function(L) {
          var q = L, re = 0, le = 0, de = {};
          return de.write = function(Q, ee) {
            if (Q >>> ee)
              throw "length over";
            for (; re + ee >= 8; )
              q.writeByte(255 & (Q << re | le)), ee -= 8 - re, Q >>>= 8 - re, le = 0, re = 0;
            le = Q << re | le, re = re + ee;
          }, de.flush = function() {
            re > 0 && q.writeByte(le);
          }, de;
        }, p = function(L) {
          for (var q = 1 << L, re = (1 << L) + 1, le = L + 1, de = B(), Q = 0; Q < q; Q += 1)
            de.add(String.fromCharCode(Q));
          de.add(String.fromCharCode(q)), de.add(String.fromCharCode(re));
          var ee = w(), Z = k(ee);
          Z.write(q, le);
          var Le = 0, Ve = String.fromCharCode(S[Le]);
          for (Le += 1; Le < S.length; ) {
            var _t = String.fromCharCode(S[Le]);
            Le += 1, de.contains(Ve + _t) ? Ve = Ve + _t : (Z.write(de.indexOf(Ve), le), de.size() < 4095 && (de.size() == 1 << le && (le += 1), de.add(Ve + _t)), Ve = _t);
          }
          return Z.write(de.indexOf(Ve), le), Z.write(re, le), Z.flush(), ee.toByteArray();
        }, B = function() {
          var L = {}, q = 0, re = {};
          return re.add = function(le) {
            if (re.contains(le))
              throw "dup key:" + le;
            L[le] = q, q += 1;
          }, re.size = function() {
            return q;
          }, re.indexOf = function(le) {
            return L[le];
          }, re.contains = function(le) {
            return typeof L[le] < "u";
          }, re;
        };
        return T;
      }, $ = function(g, I, A) {
        for (var P = z(g, I), S = 0; S < I; S += 1)
          for (var T = 0; T < g; T += 1)
            P.setPixel(T, S, A(T, S));
        var k = w();
        P.write(k);
        for (var p = x(), B = k.toByteArray(), L = 0; L < B.length; L += 1)
          p.writeByte(B[L]);
        return p.flush(), "data:image/gif;base64," + p;
      };
      return s;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(s) {
        function a(o) {
          for (var r = [], i = 0; i < o.length; i++) {
            var l = o.charCodeAt(i);
            l < 128 ? r.push(l) : l < 2048 ? r.push(
              192 | l >> 6,
              128 | l & 63
            ) : l < 55296 || l >= 57344 ? r.push(
              224 | l >> 12,
              128 | l >> 6 & 63,
              128 | l & 63
            ) : (i++, l = 65536 + ((l & 1023) << 10 | o.charCodeAt(i) & 1023), r.push(
              240 | l >> 18,
              128 | l >> 12 & 63,
              128 | l >> 6 & 63,
              128 | l & 63
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
  })(Es)), Es.exports;
}
var nb = tb();
const sb = /* @__PURE__ */ eb(nb), ab = ["width", "height", "viewBox"], ob = ["width", "height"], rb = ["d"], ib = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const s = sb(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let r = 0; r < a; r += 1)
        for (let i = 0; i < a; i += 1)
          s.isDark(r, i) && o.push(`M${i + 4} ${r + 4}h1v1h-1z`);
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
      m("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, ob),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, rb)
    ], 8, ab));
  }
}, C4 = /* @__PURE__ */ K(ib, [["__scopeId", "data-v-489f0852"]]), lb = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: be({ padding: e.padding })
    }, [
      he(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, O4 = /* @__PURE__ */ K(lb, [["__scopeId", "data-v-47e67f04"]]), T4 = Pi(() => import("./VoiceFigure-DfROfklK.js").then((e) => e.V)), I4 = "1.0.0", R4 = "3.5";
export {
  yl as $,
  _e as A,
  Ae as B,
  U5 as C,
  Jn as D,
  tt as E,
  W5 as F,
  qv as G,
  Ik as H,
  P5 as I,
  Gv as J,
  Mt as K,
  bv as L,
  ka as M,
  Qv as N,
  Vv as O,
  Yn as P,
  a5 as Q,
  dk as R,
  On as S,
  c5 as T,
  sk as U,
  Se as V,
  Dn as W,
  nk as X,
  tk as Y,
  vl as Z,
  K as _,
  Gb as a,
  S5 as a$,
  Zv as a0,
  hk as a1,
  fk as a2,
  Be as a3,
  Mk as a4,
  $k as a5,
  kt as a6,
  pk as a7,
  Dk as a8,
  Db as a9,
  y5 as aA,
  t5 as aB,
  cv as aC,
  qk as aD,
  Fk as aE,
  H5 as aF,
  oi as aG,
  l5 as aH,
  fn as aI,
  Wb as aJ,
  jb as aK,
  I5 as aL,
  pn as aM,
  D5 as aN,
  Tk as aO,
  n5 as aP,
  s5 as aQ,
  e5 as aR,
  nn as aS,
  wt as aT,
  Nb as aU,
  Qg as aV,
  Xk as aW,
  ck as aX,
  si as aY,
  Rt as aZ,
  Nt as a_,
  E5 as aa,
  B5 as ab,
  zb as ac,
  ak as ad,
  ok as ae,
  kk as af,
  xk as ag,
  _k as ah,
  Zb as ai,
  $o as aj,
  mk as ak,
  Lk as al,
  G5 as am,
  Kk as an,
  Vk as ao,
  zk as ap,
  Sk as aq,
  wk as ar,
  yk as as,
  bk as at,
  i5 as au,
  Bk as av,
  Nk as aw,
  J5 as ax,
  Ut as ay,
  Pk as az,
  uy as b,
  Y5 as b$,
  Dv as b0,
  L5 as b1,
  h5 as b2,
  d5 as b3,
  $0 as b4,
  Ur as b5,
  $5 as b6,
  Rk as b7,
  Qn as b8,
  ot as b9,
  p5 as bA,
  b5 as bB,
  ct as bC,
  u5 as bD,
  k5 as bE,
  jk as bF,
  Yk as bG,
  Wk as bH,
  Ce as bI,
  Ok as bJ,
  x5 as bK,
  a4 as bL,
  o4 as bM,
  Bb as bN,
  n0 as bO,
  Ak as bP,
  m5 as bQ,
  Kb as bR,
  V5 as bS,
  f5 as bT,
  g5 as bU,
  v5 as bV,
  Ek as bW,
  uv as bX,
  Ck as bY,
  Uk as bZ,
  z5 as b_,
  w5 as ba,
  ms as bb,
  Zo as bc,
  X5 as bd,
  t4 as be,
  r5 as bf,
  T5 as bg,
  Lb as bh,
  Gk as bi,
  Q5 as bj,
  gk as bk,
  vk as bl,
  Qb as bm,
  uk as bn,
  Fb as bo,
  C5 as bp,
  Yb as bq,
  Jb as br,
  ek as bs,
  Zk as bt,
  Kg as bu,
  N5 as bv,
  zv as bw,
  Xb as bx,
  Hb as by,
  Jk as bz,
  ze as c,
  Mb as c$,
  qb as c0,
  Pb as c1,
  Hk as c2,
  n4 as c3,
  Sa as c4,
  s4 as c5,
  bi as c6,
  O5 as c7,
  ik as c8,
  rk as c9,
  kb as cA,
  b4 as cB,
  Us as cC,
  Cb as cD,
  Xm as cE,
  It as cF,
  Qs as cG,
  ma as cH,
  gb as cI,
  xb as cJ,
  ol as cK,
  S4 as cL,
  yb as cM,
  C4 as cN,
  g4 as cO,
  Tl as cP,
  db as cQ,
  Tb as cR,
  e2 as cS,
  x1 as cT,
  $b as cU,
  Dt as cV,
  Sb as cW,
  hb as cX,
  oa as cY,
  A4 as cZ,
  $i as c_,
  Xg as ca,
  Ub as cb,
  Hv as cc,
  Qk as cd,
  ya as ce,
  av as cf,
  o5 as cg,
  zt as ch,
  Tt as ci,
  pb as cj,
  y4 as ck,
  we as cl,
  Vn as cm,
  mb as cn,
  Ch as co,
  E4 as cp,
  Rb as cq,
  In as cr,
  r4 as cs,
  ub as ct,
  Zt as cu,
  bb as cv,
  ve as cw,
  w4 as cx,
  I4 as cy,
  R4 as cz,
  x0 as d,
  rt as d0,
  _b as d1,
  T4 as d2,
  O4 as d3,
  h4 as d4,
  Ef as d5,
  Ws as d6,
  M4 as d7,
  $4 as d8,
  _4 as d9,
  Wn as dA,
  x4 as dB,
  Ib as da,
  Ob as db,
  Ab as dc,
  l4 as dd,
  i4 as de,
  zm as df,
  fb as dg,
  wb as dh,
  d4 as di,
  f4 as dj,
  Ze as dk,
  vb as dl,
  u4 as dm,
  Eb as dn,
  bt as dp,
  Ey as dq,
  v4 as dr,
  c4 as ds,
  k4 as dt,
  V1 as du,
  d2 as dv,
  Nr as dw,
  p4 as dx,
  fp as dy,
  m4 as dz,
  We as e,
  Gg as f,
  lk as g,
  Z5 as h,
  sn as i,
  j5 as j,
  e4 as k,
  A5 as l,
  q5 as m,
  my as n,
  R5 as o,
  Vb as p,
  xa as q,
  yi as r,
  wi as s,
  je as t,
  F5 as u,
  _0 as v,
  K5 as w,
  M5 as x,
  _5 as y,
  gn as z
};
