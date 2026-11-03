/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as pe, createElementVNode as m, normalizeClass as J, Fragment as Y, renderList as se, normalizeStyle as xe, defineComponent as yi, Comment as wi, h as ta, cloneVNode as ki, createBlock as G, withCtx as V, unref as U, createVNode as W, toDisplayString as k, createCommentVNode as E, inject as Te, computed as B, resolveDynamicComponent as bt, Transition as Bt, watch as ke, ref as D, shallowRef as Wn, createTextVNode as ce, TransitionGroup as Mo, mergeProps as ct, reactive as na, onMounted as qe, onUnmounted as Re, nextTick as on, useId as So, Teleport as sa, withModifiers as be, isRef as Ca, onBeforeUnmount as Lt, resolveDirective as bi, withDirectives as ut, useAttrs as aa, useModel as Cs, getCurrentInstance as xi, mergeModels as Os, getCurrentScope as _o, onScopeDispose as Eo, provide as $i, onErrorCaptured as Mi, toHandlers as Si, createSlots as _i, vShow as Ei, useSlots as Ai, withKeys as Kt, vModelText as Ts, defineAsyncComponent as Ci } from "vue";
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Oi = { class: "skeleton-line" }, Ti = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Oi, [
      pe(t.$slots, "default", {}, void 0, !0),
      m("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(Y, null, se(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: xe({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ht = /* @__PURE__ */ K(Ti, [["__scopeId", "data-v-0ebb6933"]]), oa = yi({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== wi);
      return s.length !== 1 ? ta(Y, { key: n }, s) : s[0].key == null ? ki(s[0], { key: n }) : s[0];
    };
  }
}), Ii = ["aria-label"], Ri = ["aria-label"], Bi = ["aria-label"], Li = ["aria-label"], Di = ["aria-label"], Ni = ["aria-label"], Pi = ["aria-label"], ji = {
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
            style: xe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, Ii)
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
            style: xe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, Ri)
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
            (c(), h(Y, null, se(n, (f) => W(ht, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Bi)
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
            W(ht, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(Y, null, se(a, (f) => W(ht, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Li)
      ]),
      page: V(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          W(ht, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ht, {
            key: d,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Di)
      ]),
      text: V(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ht, {
            key: d,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ni)
      ]),
      default: V(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ht, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Pi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Dt = /* @__PURE__ */ K(ji, [["__scopeId", "data-v-c687fb85"]]), qi = {
  key: 1,
  class: "empty-state titled"
}, Fi = { class: "empty-state-title" }, Wi = { class: "empty-state-text" }, Hi = {
  key: 2,
  class: "empty-state"
}, Ui = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(Dt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", qi, [
      m("p", Fi, k(e.title), 1),
      m("p", Wi, [
        pe(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Hi, [
      pe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Tn = /* @__PURE__ */ K(Ui, [["__scopeId", "data-v-b27e89b0"]]), zi = { class: "fold-group" }, Vi = ["aria-expanded"], Gi = { class: "fold-label" }, Ki = {
  key: 0,
  class: "fold-count"
}, Yi = {
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
    return (s, a) => (c(), h("div", zi, [
      m("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        m("span", Gi, k(e.label), 1),
        e.count !== "" ? (c(), h("span", Ki, k(e.count), 1)) : E("", !0),
        m("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Vi),
      e.open ? pe(s.$slots, "default", {}, void 0, !0, 0) : E("", !0)
    ]));
  }
}, Xw = /* @__PURE__ */ K(Yi, [["__scopeId", "data-v-9ef1865c"]]), Ji = Symbol("open-view"), Be = Symbol.for("journal.window-context");
function Hn() {
  const e = Te(Be, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Zi = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: xe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Xi = /* @__PURE__ */ K(Zi, [["__scopeId", "data-v-eb453d6f"]]), Qi = {
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
    const t = e, n = B(() => {
      var s;
      return t.busy || t.disabled || !!((s = Te(Be, null)) != null && s.readOnly);
    });
    return (s, a) => (c(), G(bt(e.href ? "a" : "button"), {
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
          pe(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (c(), G(Xi, {
          key: 0,
          class: "btn-spinner"
        })) : E("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, we = /* @__PURE__ */ K(Qi, [["__scopeId", "data-v-a2dc4bda"]]), el = {
  class: "running",
  "data-running-command": ""
}, tl = ["title"], nl = {
  key: "idle",
  class: "running-idle"
}, sl = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", el, [
      W(Bt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: V(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, tl)) : (c(), h("span", nl, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Qw = /* @__PURE__ */ K(sl, [["__scopeId", "data-v-d3240219"]]), al = ["aria-checked", "aria-label", "title"], ol = {
  key: 0,
  class: "switch-inner"
}, rl = {
  key: 0,
  class: "switch-word"
}, il = {
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
        e.labelled ? (c(), h("span", ol, k(e.word), 1)) : E("", !0),
        a[1] || (a[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", rl, k(e.word), 1)) : E("", !0)
    ], 10, al));
  }
}, ek = /* @__PURE__ */ K(il, [["__scopeId", "data-v-1bfb90f3"]]);
function Ao(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Yt(e, t) {
  return Ao(() => localStorage, e, t);
}
function Co(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Un(e, t) {
  return Co(() => localStorage, e, t);
}
function Oo(e, t) {
  ke(t, (n) => Un(e, n), { deep: !0 });
}
function ll(e, t) {
  return Ao(() => sessionStorage, e, t);
}
function cl(e, t) {
  return Co(() => sessionStorage, e, t);
}
const In = "journal.environment", To = D(ll(In, Yt(In, "")));
function ul(e) {
  To.value = e, cl(In, e), Un(In, e);
}
const Rn = D(location.hash), Oa = Wn(null), Ta = { integrations: "mcp", library: "team" };
function dl() {
  if (!Oa.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ta[n]) {
    location.replace(`#/${[Ta[n], ...s].join("/")}${t ? `?${t}` : ""}`), Rn.value = location.hash;
    return;
  }
  !n || Oa.value(n) || (ul(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Rn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Rn.value = location.hash, dl();
});
const Je = B(() => {
  const [e, t = ""] = Rn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: To.value,
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
}), zn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${zn.page(e)}?open=${t}`
};
function hl(e = "", t = 0, n = "") {
  location.hash = zn.page(e, t, n);
}
const fl = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Io(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(fl).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ot = {};
function tk(e, t) {
  return Ot[e] = t, () => Ot[e] === t && delete Ot[e];
}
function Ro(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Ot[e]) != null && r.call(Ot, t))) return;
  const a = Je.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Io([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function pl(e, t, n, s = 0, a = "") {
  if (e === Je.value.env) return Ro(t, n, s, a);
  const o = Je.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Io([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Ze(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? pl(s, a, Number(o), 0, t) : Ro(a, Number(o), 0, t);
}
function ml(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function At(e) {
  const t = ml(e);
  t && Ze(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Vn = typeof document < "u" && document.documentElement.classList.contains("phone"), gl = "Files are attached on the computer; the phone sends text.", ns = [
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
}), rn = {
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
    filters: ns
  }),
  tasks: me("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: ns
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
  pins: me("Pin", "band", "One line pinned to the chat while it matters", { filters: ns }),
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
}, vl = ["secrets", "plugins"], Bo = Object.keys(rn).filter((e) => !(Vn && vl.includes(e)));
B(() => Bo.map((e) => ({ name: e, ...rn[e] })));
const ln = (e) => rn[e], Lo = new Map(Bo.flatMap((e) => [e, e.replace(/s$/, ""), rn[e].title.toLowerCase()].map((t) => [t, e]))), wt = (e) => Lo.get(String(e).toLowerCase()) || "", Do = [...Lo.keys()].sort((e, t) => t.length - e.length).join("|"), yl = ["stroke-width", "innerHTML"], ve = {
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
      style: xe({
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
    }, null, 12, yl));
  }
}, Gn = {
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
}, wl = {
  key: 1,
  class: "row-list-failure"
}, kl = ["data-row"], bl = {
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
    const t = e, n = B(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = D(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), G(Dt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", wl, k(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(Tn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: V(() => [
        ce(k(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(Y, { key: 3 }, [
      (c(), G(bt(e.arrival ? Mo : "ul"), ct(n.value, { class: "row-list" }), {
        default: V(() => [
          (c(!0), h(Y, null, se(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            pe(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, kl))), 128))
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
}, xl = /* @__PURE__ */ K(bl, [["__scopeId", "data-v-aa6ad7ff"]]), $l = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ml = {
  key: 1,
  class: "agent-rows-note"
}, Sl = {
  key: 2,
  class: "agent-rows-note"
}, _l = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, El = ["data-agent-row", "onClick"], Al = { class: "agent-row-name" }, Cl = { class: "agent-row-state" }, Ol = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = B(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", $l, [
      e.loaded ? e.failure ? (c(), h("p", Ml, k(e.failure), 1)) : e.rows.length ? (c(), h(Y, { key: 3 }, [
        m("p", _l, k(s.value) + " running", 1),
        (c(!0), h(Y, null, se(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => U(Ze)(`agents:${r.id}`)
        }, [
          m("span", Al, "#" + k(r.id) + " " + k(r.session), 1),
          m("span", Cl, k(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, El))), 128))
      ], 64)) : (c(), h("p", Sl, k(e.none), 1)) : (c(), G(Dt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, nk = /* @__PURE__ */ K(Ol, [["__scopeId", "data-v-a01e5a17"]]), Tl = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["badge", e.tone])
    }, k(e.text), 3));
  }
}, No = /* @__PURE__ */ K(Tl, [["__scopeId", "data-v-9e7e1157"]]), Il = ["aria-valuenow", "aria-valuemax"], Rl = {
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
    const t = e, n = B(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (c(), h("span", {
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: xe({ width: n.value })
      }, null, 4)
    ], 10, Il));
  }
}, Bl = /* @__PURE__ */ K(Rl, [["__scopeId", "data-v-9eba6a85"]]), Ll = { class: "bars" }, Dl = { class: "bar-name" }, Nl = { class: "bar-value" }, Pl = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = B(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", Ll, [
      (c(!0), h(Y, null, se(e.items, (l, u) => (c(), G(bt(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: J(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: V(() => [
          m("span", Dl, k(l.label), 1),
          W(Bl, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Nl, k(l.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, jl = /* @__PURE__ */ K(Pl, [["__scopeId", "data-v-663427f4"]]), ql = { class: "bars" }, Fl = {
  key: 0,
  class: "bars-title"
}, Wl = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", ql, [
      e.node.title ? (c(), h("span", Fl, k(e.node.title), 1)) : E("", !0),
      W(jl, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Hl = /* @__PURE__ */ K(Wl, [["__scopeId", "data-v-7135bb11"]]), Ul = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = B(() => n[s.node.type](s.node));
    return (r, i) => (c(), h("div", {
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: xe(o.value)
    }, [
      (c(!0), h(Y, null, se(e.node.children || [], (l, u) => (c(), G(dr, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, _n = /* @__PURE__ */ K(Ul, [["__scopeId", "data-v-d142a3f4"]]), zl = {
  key: 0,
  class: "card-head"
}, Vl = { class: "card-title" }, Gl = {
  key: 0,
  class: "card-note"
}, Kl = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", zl, [
        m("span", Vl, k(e.node.title), 1),
        e.node.note ? (c(), h("span", Gl, k(e.node.note), 1)) : E("", !0)
      ])) : E("", !0),
      W(_n, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Yl = /* @__PURE__ */ K(Kl, [["__scopeId", "data-v-67b72d40"]]), Jl = (e) => "task_ids" in e, Po = 1024, Zl = Po * 1024 * 1024, Xl = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Po} MB limit for one file.`;
function Ql() {
  return () => {
  };
}
const Ct = na({
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
}), ec = () => !!(Ct.version || Ct.external) && !Ct.failure && !Ct.late, jo = () => !!Ct.countdown || ec() || Ct.starting, Ia = 2e4, tc = 3e5, Ge = 6e5, vn = 6, nc = 500, sc = "/journal/summary", Ra = Vn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, ac = (e) => e.split("?")[0].endsWith(sc), qo = (e, t) => Object.assign(new Error(t), { status: e });
async function oc(e, t, n = qo) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const rc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class ic {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = vn;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = vn;
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
        headers: { ...Ra, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: rc(s),
        signal: AbortSignal.timeout(a || (i ? tc : Ia))
      });
    } catch (l) {
      if (t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, nc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = vn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Ql(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return oc(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ra, signal: AbortSignal.timeout(Ia) });
    if (!n.ok) throw qo(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, vn, o).then((l) => (this.written(n), l));
    if (jo() && !ac(n))
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
const Fe = new ic(), Ie = (e) => encodeURIComponent(e);
function he(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const Pt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), jt = "the page does not know its environment yet", lc = "X-Journal-Env", cc = "X-Journal-Request-At", ss = "/viewer/voices/figures/";
class ra {
  constructor({ env: t = () => Je.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ra({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [cc]: String(Date.now()), ...this.env() ? { [lc]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === jt ? Promise.reject(new Error(jt)) : Fe.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === jt ? Promise.reject(new Error(jt)) : Fe.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : jt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${Ie(this.env())}`);
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
    return Fe.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: l = !1, docked: u = !1 } = {}) {
    const d = this.here(`/${t}${he({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: l ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(d, `${t}.${Pt({ before: s, after: a, since: o, ids: r, tasks: i, closed: l, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${he({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
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
    if (Vn) return Promise.reject(Object.assign(new Error(gl), { status: 403 }));
    if (s.size > Zl) return Promise.reject(new Error(Xl(s)));
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${Ie(s)}`);
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
    return Fe.bytes(t);
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
    return this.get(`/agents/controls/${Ie(t)}${he({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${Ie(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${Ie(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${he(s)}`), `${a}.${Pt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${he(n)}`), `/verifiers/${t}/transcript.${Pt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${he(n)}`), `/workers/${t}/transcript.${Pt(n)}`);
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
    return this.get(this.here(`/skills/${Ie(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${Ie(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${Ie(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return Fe.request("GET", ss + "figures.json");
  }
  voiceFigureUrl(t) {
    return ss + t;
  }
  figureDecoderUrl() {
    return ss + "draco/";
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
    return this.post(`/profiles/${Ie(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${Ie(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${Ie(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, Ge);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Ie(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Ge);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Ie(t)}` : ""}${zn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ze = new ra({ base: Vn ? "/p" : "" }), uc = (e) => Fe.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ze.base.length).split("/")[2]);
}), Ba = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), dc = 6e4, hc = 4, fc = 300, pc = 5e3, Fo = /* @__PURE__ */ new Map();
function Kn(e) {
  if (!(e in Ba)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ba[e];
}
function mc(e) {
  const t = Kn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return pc;
  }
}
const gc = (e) => e / 2 + Math.random() * e / 2, Wo = (e) => [...e.users.values()].pop(), ia = (e) => Fo.get(e.place) === e, vc = () => Math.random() * fc, la = () => document.hidden;
function yc(e) {
  const t = mc(e);
  return e.failures ? gc(Math.min(dc, t * 2 ** e.failures)) : Math.max(t, hc * e.took);
}
function Ho(e, t) {
  clearTimeout(e.timer), !(!ia(e) || la()) && (e.timer = setTimeout(() => wc(e), t));
}
function wc(e) {
  return ia(e) ? e.running ? (e.again = !0, e.running) : (e.running = $c(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const kc = (e) => {
  var t, n;
  return !la() && (((n = (t = Kn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Wo(e).active() && !jo();
};
async function bc(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Fe.attemptOnce(() => Kn(e.key).read(Wo(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function xc(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Kn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function $c(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      kc(e) && xc(e, await bc(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ia(e));
  Ho(e, yc(e));
}
const Mc = () => la() || Fo.forEach((e) => Ho(e, vc()));
document.addEventListener("visibilitychange", Mc);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Uo = (e) => `${e.table}:${e.id}`, La = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", as = 80;
function Da(e) {
  return e.length <= as ? e : `${e.slice(0, as + 1).replace(/\s+\S*$/, "") || e.slice(0, as)}…`;
}
const Na = {
  messages: (e) => Da(La(e.text)),
  comments: (e) => Da(La(e.text)),
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
}, Sc = (e) => (Na[e.table] ? Na[e.table](e) : e.title || "") || "", _c = ["done", "cancelled"], Is = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => _c.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, Ec = (e) => Is[e.table] ? Is[e.table](e) : 0, zo = (e) => Ec(e) > 0, Ac = (e) => !!Is[e], kt = (e) => Ee(e.created_at), Rs = (e) => Ee(e.updated_at) || kt(e), Cc = 60, Oc = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - Cc, Tc = (e, t) => e.id > 0 && e.table === t.table && Oc(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ca = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Tc(s, n))), Ic = { me: 1, people: [] }, ue = na({
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
  people: Ic,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Yt("journal.activity", !0),
  wide: !1,
  sideMini: Yt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Oo("journal.activity", () => ue.activity);
Oo("journal.side.mini", () => ue.sideMini);
const Rc = 50, Vo = 100, Bc = { messages: 25 }, Ue = (e) => Bc[e] || Rc;
function Lc(e, t) {
  if (e !== "messages") return Math.max(t.length - Ue(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Ue(e)) return s;
  return 0;
}
const dt = /* @__PURE__ */ new Set(), ua = D(0), cn = /* @__PURE__ */ new Set(), un = /* @__PURE__ */ new Set(), at = /* @__PURE__ */ new Set(), Bs = /* @__PURE__ */ new Set(), Dc = /* @__PURE__ */ new Map(), Nc = /* @__PURE__ */ new Map();
let qt = !1, Ft = null;
const Pc = (e, t) => e.id - t.id, jc = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, qc = { messages: jc }, Go = (e) => qc[e] || Pc;
function Ko(e) {
  return ua.value, dt.has(e) || (dt.add(e), ue.booted && (!cn.has(e) || un.has(e)) && queueMicrotask(() => da([e], !1))), ue.rows[e] || [];
}
function Fc(e) {
  const t = ue.rows[e] || [], n = Lc(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ue.rows[e] = t.filter((a) => s.has(a) || Ac(e) && !zo(a)), ue.paging.size[e] = Ue(e), ue.paging.more[e] = !0;
}
const Wc = /* @__PURE__ */ new Set();
function Hc() {
  dt.forEach(Fc), dt.clear(), Dc.clear(), Nc.clear(), ua.value += 1;
}
ke(() => `${Je.value.env}/${Je.value.page}/${Je.value.open ? Je.value.open.table : ""}`, Hc);
ke(
  () => ue.booted,
  (e) => e && da(
    [...dt].filter((t) => !cn.has(t)),
    !1
  )
);
const Ls = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Jl(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Yo(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Ls(s) && !Ls(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Jo(e, t) {
  cn.add(e), ua.value += 1;
  const n = ue.rows[e] || [];
  ue.rows[e] = [...Yo(n, t.rows), ...ca(n.filter((s) => s.id === 0), t.rows)], ue.paging.size[e] = ue.paging.size[e] || Ue(e), ue.paging.more[e] = !t.is_last_page;
}
async function Uc(e) {
  const t = new Set((ue.rows[e] || []).map((o) => o.id)), n = await ze.list(e, { limit: Ue(e) });
  Yn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ca((ue.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Jo(e, { ...n, rows: [...n.rows, ...a].sort(Go(e)) }), ue.paging.size[e] = Ue(e), Zo.has(e) && await Xo(e), ue.rows[e];
}
const Yn = (e, t) => ue.counts = { ...ue.counts, [e]: t };
async function zc(e) {
  const t = ue.rows[e] || [], n = Math.max(0, ...t.map(Rs)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ze.list(e, { limit: Ue(e), since: n, after: s });
  if (Yn(e, a.counts), !a.is_last_page) return Uc(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = ca(t.filter((i) => !o.has(i.id)), a.rows).concat(Yo(t, a.rows));
  return ue.rows[e] = r.sort(Go(e)), ue.paging.size[e] = ue.rows[e].length, ue.rows[e];
}
const os = /* @__PURE__ */ new Set();
async function Vc(e, t = !1) {
  e.forEach((n) => un.delete(n)), e.forEach((n) => Bs.add(n));
  try {
    await Qc(e, t);
  } finally {
    e.forEach((n) => Bs.delete(n));
  }
}
async function Gc(e) {
  const t = await ze.list(e, { limit: Ue(e) });
  Yn(e, t.counts), Jo(e, t);
}
async function Kc(e) {
  Yn(e, (await ze.list(e, { limit: 1, closed: !0 })).counts);
}
const Zo = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Xo(e) {
  const t = (ue.rows[e] || []).filter((a) => Ls(a) && (e !== "plans" || !zo(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ze.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ue.rows[e] = (ue.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Yc = (e, t) => !cn.has(e) || t && (ue.paging.size[e] || Ue(e)) === Ue(e) && !Wc.has(e);
async function Jc(e, t) {
  if (!dt.has(e)) return Kc(e);
  const n = await (Yc(e, t) ? Gc(e) : zc(e));
  return Zo.has(e) && await Xo(e), n;
}
async function Qo() {
  const e = await ze.settings();
  JSON.stringify(e) !== JSON.stringify(ue.settings) && (ue.settings = e);
}
async function Zc() {
  const [e] = await Promise.all([ze.entries(0, Vo), Qo()]);
  nu([...Yt(tr(), []), ...e]);
}
const Xc = (e, t) => Jc(e, t).then(
  () => null,
  () => e
);
async function Qc(e, t) {
  const n = (await Promise.all(e.map((s) => Xc(s, t)))).filter(Boolean);
  if (n.forEach((s) => (at.add(s), un.add(s))), t && await Zc(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const er = 1e3, eu = 15e3;
let yn = er;
async function tu() {
  return Ft || (Ft = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...at].some((e) => !os.has(e)) || qt; ) {
      const e = qt, t = [...e ? Object.keys(ue.rows) : at].filter((s) => rn[s] && (dt.has(s) || s in ue.rows)).filter((s) => e || !dt.has(s) || un.has(s) || !cn.has(s)).filter((s) => !os.has(s)), n = [...at].filter((s) => os.has(s));
      at.clear(), n.forEach((s) => at.add(s)), qt = !1;
      try {
        await Vc(t, e), yn = er;
      } catch {
        qt = qt || e, await new Promise((a) => setTimeout(a, yn)), yn = Math.min(yn * 2, eu);
      }
    }
  })().finally(() => Ft = null), Ft);
}
function da(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Bs.has(n)).forEach((n) => {
    at.add(n), t && un.add(n);
  }), at.delete("settings") && Qo(), tu();
}
const tr = () => {
  var e;
  return `typed-entries:${((e = ue.identity) == null ? void 0 : e.root) || location.host}:${ze.env()}`;
};
function nu(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ue.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Vo), Un(tr(), ue.entries.slice(-50));
}
uc((e) => ue.streamOpen || da([e]));
const Ds = [], su = 2e3, st = /* @__PURE__ */ new Map(), au = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, ou = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function xt(e, { first: t = !1 } = {}) {
  t ? Ds.unshift(e) : Ds.push(e), st.clear();
}
function nr(e, t, n) {
  var a;
  const s = Ko(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const ru = (e) => Ko(e.table).find((t) => t.id === e.id) === e.row, iu = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Qe(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function lu(e, t) {
  const n = [{ kind: "text", text: Qe(e).replace(/\r\n/g, `
`) }];
  for (const s of Ds)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Jt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return cu(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function cu(e) {
  return e.split(ou).map((t, n) => n % 2 ? t : t.replace(au, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Pa(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function uu(e) {
  const [t, , ...n] = e, s = Pa(t).map((o) => `<th>${Jt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Pa(o).map((r) => `<td>${Jt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function du(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Jt(a)}</li>`).join("")}</${s}>`;
}
const ja = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function sr(e) {
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
      n.push(`<h${i}>${Jt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (ja(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(uu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(du(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${sr(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !ja(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Jt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const hu = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, fu = (e) => e.kind !== "text" && !hu.test(e.html);
function pu(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(sr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : fu(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Ns(e, t = { env: "" }) {
  const n = iu(e, t), s = st.get(n);
  if (st.delete(n), s && s.reads.every(ru))
    return st.set(n, s), s.html;
  const a = [], o = pu(lu(e, { ...t, reads: a }));
  return st.set(n, { html: o, reads: a }), st.size > su && st.delete(st.keys().next().value), o;
}
const ar = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Zt = (e) => String(e || "").replace(ar, (t, n, s, a) => a), mu = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), wn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, gu = /^Traceback \(most recent call last\):/m, vu = 8;
function or(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, vu).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function yu(e) {
  const t = [...e.matchAll(mu)].map((s) => s.index);
  if (wn.lastIndex = 0, !t.length || !wn.test(e)) return null;
  wn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(wn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: or(n), tail: "" } : null;
}
function wu(e) {
  const t = gu.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: or([o]), tail: n.slice(a).join(`
`) };
}
xt((e) => {
  const t = Zt(e), n = wu(t) || yu(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const ku = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, bu = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, xu = /[\w\]]\(/, $u = /^[\w$.[\]'"]+\s*=\s*[^=]/, Mu = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Su = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, _u = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Eu = /[[({,]$/, Au = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Cu = /^(\t|\s{2,})\S/, Ou = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*\/?|<!--)/, Tu = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Iu = /[{}()[\];=<>$&|*\\@+^~%]/g, rr = /^\s*(?:[-*+]|\d+[.)])\s/, Ru = /^\s*>/, Bu = /^\s*\|/, Lu = 0.6, Du = 0.4, Nu = 5, Pu = 0.03, ir = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Nu && t.every((n) => Tu.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Iu) ?? []).length / e.length < Pu;
}, rs = (e) => {
  const t = e.trim();
  return [ku, bu, xu, $u, Mu, Su, _u, Eu, Au].some((n) => n.test(t)) || /[;{}]$/.test(t) || Cu.test(e) && !rr.test(e) && !ir(e);
};
function ju(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || rr.test(t[0]) || t.every((o) => Ru.test(o) || Bu.test(o))) return "text";
  const n = t.filter((o) => !Ou.test(o.trim()));
  if (t.length === 1) return !n.length || rs(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(rs).length, a = n.filter((o) => !rs(o) && ir(o)).length;
  return s >= n.length * Lu && a <= n.length * Du ? "code" : "text";
}
const Ps = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", qu = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Fu = `${Ps} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Wu = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Hu = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", qa = {
  js: { keywords: Ps, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: qu, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Fu, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ps, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Wu, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Hu, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Fa(e, t, n) {
  return n && e.startsWith(n, t);
}
function Uu(e, t) {
  const n = qa[t] || qa.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Fa(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Fa(e, o, n.block[0])) {
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
function zu(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Uu(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Qe(r) : `<span class="tok-${s}">${Qe(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Vu(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Gu = 1500, Wa = /* @__PURE__ */ new WeakMap();
async function Ku(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Vu(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Wa.get(t)), Wa.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Gu)
  )));
}
typeof document < "u" && document.addEventListener("click", Ku, !0);
const Yu = /\n\s*\n/, Ju = /^(```|~~~)\s*(\w+)?\s*$/, Zu = /^\s{4,}\S/, Xu = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, js = /^\s*(?:[-*+]|\d+[.)])\s/, lr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Qu = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ha(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function ed(e) {
  const t = ha(e.join(`
`));
  return (Qu.find(([, n]) => n.test(t)) || ["text"])[0];
}
const td = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && lr.test(t) && !js.test(t);
}, nd = (e, t) => js.test(t) || js.test([...e].reverse().find((n) => n.trim()) || "");
function qs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${zu(ha(e.join(`
`)), t || ed(e)).join(`
`)}</code></pre></div>` };
}
function sd(e) {
  const t = e.split(Yu).map((r) => ({ paragraph: r, kind: ju(ha(r).split(`
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
      a(), n.push(qs(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(Zt), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function ad(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...sd(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Ju);
    if (r) {
      const l = t.findIndex((d, f) => f > o && d.trim().startsWith(r[1])), u = l < 0 ? t.length : l;
      a(), n.push(qs(t.slice(o + 1, u).map(Zt), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = td(s) ? Xu : Zu;
    if (i.test(t[o]) && !nd(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && lr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (l - o + u.length >= 2) {
        a(), n.push(qs([...u, ...t.slice(o, l)].map(Zt), "")), o = l;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
xt((e) => ad(e));
const od = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, rd = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function id(e) {
  const t = od.exec(e);
  if (t && wt(t[1])) return { at: t.index, length: t[0].length, table: wt(t[1]), id: Number(t[2]), label: t[3] };
  const n = rd.exec(e), s = n && wt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function ld(e, t, n, s) {
  const a = nr(s, e, t), o = Zt(a ? Sc(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Qe(ln(e).title)} ${t}</span><span class="row-card-title">${Qe(o)}</span></a>`;
}
xt(
  (e, t) => {
    const n = id(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: ld(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const cd = /\.(png|jpe?g|gif|webp|svg)$/i, ud = (e) => cd.test(e), dd = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, hd = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function fd(e, t) {
  const n = dd.exec(e), [, s, a, o, r, i] = n || [], l = n && wt(s || o), u = l && nr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = ze.in(t.env).fileUrl(l, u.id, i), f = `${ln(l).title} ${u.id} · ${Qe(i)}`, v = ud(i) ? `<img class="file-card-image" src="${d}" alt="${Qe(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Qe(i)}">${v}<span class="file-card-name">${f}</span></a>` };
}
function pd(e) {
  const t = hd.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Qe(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
xt(
  (e, t) => {
    if (t.inline) return null;
    const n = fd(e, t) || pd(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const md = /`([^`\n]+)`/g;
xt((e) => e.replace(md, (t, n) => `<code>${n}</code>`));
const Ha = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${zn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
xt(
  (e, t) => e.replace(ar, (n, s, a, o) => Ha[s] ? Ha[s](a, o, t) : o)
);
const gd = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, cr = new RegExp(`\\b(${Do}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), ur = new RegExp(`\\b(${Do}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), vd = new RegExp(`<code>((?:${cr.source}|${ur.source}))</code>`, "gi"), yd = (e) => e.replace(vd, "$1"), wd = (e, t) => `<a class="row-pill" href="#" data-peek="${wt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, kd = (e) => e.replace(ur, (t, n, s) => s.replace(/\d+/g, (a) => wd(n.replace(/s$/i, ""), a))), bd = (e) => kd(e).replace(
  cr,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${wt(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
xt(
  (e, t) => t.rowNames === !1 ? e : yd(e).split(gd).map((n, s) => s % 2 ? n : bd(n)).join("")
);
const xd = ["innerHTML"], $d = ["innerHTML"], Md = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = B(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Ns(s, { env: Je.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => U(At) && U(At)(...o)),
      innerHTML: n.value
    }, null, 8, xd)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(At) && U(At)(...o)),
      innerHTML: n.value
    }, null, 8, $d));
  }
}, rt = /* @__PURE__ */ K(Md, [["__scopeId", "data-v-1a43d211"]]), Sd = { class: "fact" }, _d = { class: "fact-label" }, Ed = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Sd, [
      m("span", _d, k(e.label), 1),
      W(rt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Ad = /* @__PURE__ */ K(Ed, [["__scopeId", "data-v-3a88ecf8"]]), Cd = { class: "list" }, Od = { class: "list-label" }, Td = {
  key: 1,
  class: "list-note"
}, Id = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Cd, [
      (c(!0), h(Y, null, se(e.items, (o, r) => (c(), G(bt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: V(() => [
          m("span", Od, k(o.label), 1),
          o.badge ? (c(), G(No, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : E("", !0),
          o.note ? (c(), h("span", Td, k(o.note), 1)) : E("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Rd = /* @__PURE__ */ K(Id, [["__scopeId", "data-v-ebe2ae0a"]]), Bd = { class: "table" }, Ld = {
  key: 0,
  class: "table-row empty"
}, Dd = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", Bd, [
      m("div", {
        class: "table-row head",
        style: xe(a.value)
      }, [
        (c(!0), h(Y, null, se(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, k(i), 1))), 128))
      ], 4),
      (c(!0), h(Y, null, se(e.rows, (i, l) => (c(), G(bt(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: J(["table-row", i.tone, { opens: i.open }]),
        style: xe(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: V(() => [
          (c(!0), h(Y, null, se(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, k(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", Ld, k(e.empty), 1)) : E("", !0)
    ]));
  }
}, Nd = /* @__PURE__ */ K(Dd, [["__scopeId", "data-v-9326a52e"]]), Pd = { class: "stat-value" }, jd = { class: "stat-label" }, qd = {
  key: 0,
  class: "stat-note"
}, Fd = {
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
    return (s, a) => (c(), G(bt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: V(() => [
        m("span", Pd, k(e.value), 1),
        m("span", jd, k(e.label), 1),
        e.note ? (c(), h("span", qd, k(e.note), 1)) : E("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Wd = /* @__PURE__ */ K(Fd, [["__scopeId", "data-v-ad0db6d6"]]), Hd = { class: "code" }, Ud = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), G(oa, {
      value: e.node.type
    }, {
      stack: V(() => [
        W(_n, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: V(() => [
        W(_n, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: V(() => [
        W(_n, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: V(() => [
        W(Yl, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: V(() => [
        m("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: V(() => [...r[2] || (r[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: V(() => [
        W(Wd, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: V(() => [
        W(Hl, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: V(() => [
        W(Nd, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: V(() => [
        W(Rd, {
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
        W(Ad, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: V(() => [
        W(No, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: V(() => [
        m("pre", Hd, [
          m("code", null, k(e.node.text), 1)
        ])
      ]),
      file: V(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, k(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), dr = /* @__PURE__ */ K(Ud, [["__scopeId", "data-v-cbdcf540"]]), zd = { class: "dashboard" }, Vd = { class: "trail" }, Gd = ["onClick"], Kd = {
  key: 0,
  class: "gone",
  role: "status"
}, Yd = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (v) => v in (n.document.pages || {}), o = D(!!n.page && !a(n.page)), r = D(n.page && !o.value ? [n.page] : []), i = B(() => r.value.at(-1) || n.document.start), l = B(() => (n.document.pages || {})[i.value] || null), u = (v) => ((n.document.pages || {})[v] || {}).title || v, d = (v) => {
      o.value = !1, r.value = [...r.value, v];
    }, f = (v) => {
      o.value = !1, r.value = r.value.slice(0, v);
    };
    return ke(
      () => n.document.start,
      () => r.value = []
    ), (v, y) => (c(), h("div", zd, [
      e.document.broken ? (c(), G(Tn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: V(() => [
          ce(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(Tn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: V(() => [
          ce(k(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(Y, { key: 2 }, [
        m("nav", Vd, [
          m("button", {
            type: "button",
            class: J(["step", { current: !r.value.length }]),
            onClick: y[0] || (y[0] = (O) => f(0))
          }, k(u(e.document.start)), 3),
          (c(!0), h(Y, null, se(r.value, (O, S) => (c(), h(Y, {
            key: `${S}-${O}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: J(["step", { current: S === r.value.length - 1 }]),
              onClick: (w) => f(S + 1)
            }, k(u(O)), 11, Gd)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Kd, "What you opened is no longer in this dashboard. Here is its start page.")) : E("", !0),
        W(Bt, {
          name: "page",
          mode: "out-in"
        }, {
          default: V(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              W(dr, {
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
}, sk = /* @__PURE__ */ K(Yd, [["__scopeId", "data-v-fbe83734"]]);
function Jd(e, t, n, s = () => window) {
  qe(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Re(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Zd = (e, t = () => !0) => Jd("keydown", (n) => n.key === "Escape" && t() && e());
function hr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = D(!1), a = B(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Zd(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Xd = 80, _t = na([]);
function fr(e) {
  const t = Symbol("layer"), n = () => _t.includes(t) && _t.splice(_t.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !_t.includes(t) && _t.push(t), s || n();
    },
    { immediate: !0 }
  ), Re(n), B(() => Xd + Math.max(0, _t.indexOf(t)));
}
let pr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return pr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Qd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function eh(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Qd)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  qe(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : pr, document.addEventListener("keydown", a), on(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const th = ["aria-modal", "aria-label", "aria-labelledby"], nh = {
  key: 0,
  class: "dialog-head"
}, sh = ["id", "tabindex"], ah = {
  key: 1,
  class: "dialog-foot"
}, oh = 500, rh = 400, ih = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = hr(s, n), i = fr(a), l = D(null), u = D(null), d = D(null), f = So(), v = D(!1), y = Date.now();
    n.modal && eh(u, () => s("escape"), d);
    function O() {
      if (!n.modal) return n.closable && o();
      v.value = !0, setTimeout(() => v.value = !1, rh);
    }
    function S(M) {
      !n.modal || Date.now() - y >= oh || ![" ", "Enter"].includes(M.key) || (M.preventDefault(), M.stopPropagation());
    }
    const w = () => l.value && (l.value.scrollTop = l.value.scrollHeight), $ = new MutationObserver(w);
    return ke(l, (M) => {
      $.disconnect(), M && n.follow && ($.observe(M, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Re(() => $.disconnect()), (M, z) => (c(), G(sa, { to: "body" }, [
      W(Bt, {
        name: "dialog",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: V(() => [
          U(a) ? (c(), h("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: xe({ zIndex: U(i) }),
            onClick: be(O, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: u,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: v.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? U(f) : void 0,
              onKeydownCapture: S
            }, [
              e.bare ? E("", !0) : (c(), h("header", nh, [
                m("h3", {
                  id: U(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, sh),
                e.closable ? (c(), G(Gn, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : E("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: l,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                pe(M.$slots, "default", {}, void 0, !0)
              ], 2),
              M.$slots.foot ? (c(), h("footer", ah, [
                pe(M.$slots, "foot", {}, void 0, !0)
              ])) : E("", !0)
            ], 42, th)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, lh = /* @__PURE__ */ K(ih, [["__scopeId", "data-v-6d1ecd98"]]), nt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, je = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, ch = 6;
function fa(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const uh = (e) => {
  const t = fa(e, nt.lineChars), n = Math.max(nt.minWidth, Math.max(...t.map((s) => s.length)) * nt.charWidth + nt.padX * 2);
  return { name: e, lines: t, line: nt.line, padY: nt.padY, width: n, height: t.length * nt.line + nt.padY * 2 };
};
function dh(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function hh(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function fh(e, t, n) {
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
  for (let r = 0; r < ch; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((v) => v[i ? 1 : 0] === f).map((v) => v[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function ph(e, t) {
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
function mh(e) {
  const t = [...new Set(e.flatMap(([x, g]) => [x, g]))], n = new Set(e.map(([, x]) => x)), s = t.filter((x) => !n.has(x)), a = dh(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((x, g) => !a.has(g)), r = hh(t, o), i = fh(t, o, r), l = new Map(t.map((x) => [x, uh(x)])), u = i.map((x) => x.reduce((g, I) => g + l.get(I).width, 0) + Pe.across * (x.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = vh(e, r, i.length), v = /* @__PURE__ */ new Map();
  let y = Pe.margin;
  i.forEach((x, g) => {
    let I = (d - u[g]) / 2;
    const A = Math.max(...x.map((P) => l.get(P).height));
    x.forEach((P) => {
      const _ = l.get(P);
      v.set(P, { ..._, x: I, y: y + (A - _.height) / 2 }), I += _.width + Pe.across;
    }), y += A + (f[g] ?? Pe.down);
  });
  const O = e.map(([x, g, I], A) => ({ from: x, to: g, label: I || "", back: a.has(A) || r.get(g) <= r.get(x) }));
  ph(O, v);
  const S = O.map((x) => yh(x, v.get(x.from), v.get(x.to))), w = [...v.values()], $ = xh(S, w), M = Math.max(y - Pe.down, ...$.filter((x) => x.label).map((x) => x.label.y + x.label.height));
  return { width: Math.max(d - Pe.margin, ...$.filter((x) => x.label).map((x) => x.label.x + x.label.width)) + Pe.margin, height: M + Pe.margin, nodes: w, arrows: $ };
}
const gh = (e) => e ? fa(e, je.lineChars).length * je.line + je.pad * 2 : 0;
function vh(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += gh(r) + Pe.labelSpace);
  }), s.map((a) => Math.max(Pe.down, a));
}
function yh(e, t, n) {
  const s = e.label ? fa(e.label, je.lineChars) : [], a = s.length ? Math.max(...s.map((v) => v.length)) * je.charWidth + je.pad * 2 : 0, o = s.length * je.line + (s.length ? je.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const wh = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, kh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], bh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * je.line);
function xh(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = wh(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = bh.flatMap((l) => kh.map((u) => a(u, l))).find((l) => !n.some((u) => Ua(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => Ua(i, l)); ) i.y += je.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: je.line, pad: je.pad } };
  });
}
const Ua = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, $h = { class: "flowchart-tools" }, Mh = ["width", "height", "viewBox", "aria-label"], Sh = ["d"], _h = ["x", "y", "width", "height"], Eh = ["x", "y"], Ah = ["x", "dy"], Ch = {
  key: 0,
  class: "flowchart-label"
}, Oh = ["x", "y", "width", "height"], Th = ["x", "y"], Ih = ["x", "dy"], Rh = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => mh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = D(null), i = D({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var $;
      const S = ($ = r.value) == null ? void 0 : $.getBoundingClientRect();
      if (!(S != null && S.width)) return;
      const w = Math.min(S.width / a.value.width, S.height / a.value.height, 1.5);
      i.value = { zoom: w, x: (S.width - a.value.width * w) / 2, y: (S.height - a.value.height * w) / 2 };
    }
    function d(S, w, $) {
      const { zoom: M, x: z, y: x } = i.value, g = Math.min(o.most, Math.max(o.least, M * S));
      i.value = { zoom: g, x: w - (w - z) * g / M, y: $ - ($ - x) * g / M };
    }
    function f(S) {
      const w = r.value.getBoundingClientRect();
      d(S, w.width / 2, w.height / 2);
    }
    function v(S) {
      const w = r.value.getBoundingClientRect();
      S.ctrlKey || S.metaKey ? d(S.deltaY < 0 ? o.step : 1 / o.step, S.clientX - w.left, S.clientY - w.top) : i.value = { ...i.value, x: i.value.x - S.deltaX, y: i.value.y - S.deltaY };
    }
    function y(S) {
      var w, $, M;
      S.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), l = { x: S.clientX - i.value.x, y: S.clientY - i.value.y }, (M = ($ = r.value).setPointerCapture) == null || M.call($, S.pointerId);
    }
    function O(S) {
      l && (i.value = { ...i.value, x: S.clientX - l.x, y: S.clientY - l.y });
    }
    return qe(u), (S, w) => (c(), G(lh, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = ($) => s("close"))
    }, {
      default: V(() => [
        m("div", $h, [
          W(we, {
            small: "",
            onClick: w[0] || (w[0] = ($) => f(o.step))
          }, {
            default: V(() => [...w[5] || (w[5] = [
              ce("Zoom in", -1)
            ])]),
            _: 1
          }),
          W(we, {
            small: "",
            onClick: w[1] || (w[1] = ($) => f(1 / o.step))
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
          onWheel: be(v, ["prevent"]),
          onPointerdown: y,
          onPointermove: O,
          onPointerup: w[2] || (w[2] = ($) => Ca(l) ? l.value = null : l = null),
          onPointercancel: w[3] || (w[3] = ($) => Ca(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: xe({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (c(!0), h(Y, null, se(a.value.arrows, ($, M) => (c(), h("path", {
              key: `arrow-${M}`,
              class: "flowchart-arrow",
              d: $.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Sh))), 128)),
            (c(!0), h(Y, null, se(a.value.nodes, ($) => (c(), h("g", {
              key: $.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: $.x,
                y: $.y,
                width: $.width,
                height: $.height,
                rx: "8"
              }, null, 8, _h),
              m("text", {
                x: $.x + $.width / 2,
                y: $.y + $.padY + $.line / 2
              }, [
                (c(!0), h(Y, null, se($.lines, (M, z) => (c(), h("tspan", {
                  key: z,
                  x: $.x + $.width / 2,
                  dy: z ? $.line : 0
                }, k(M), 9, Ah))), 128))
              ], 8, Eh)
            ]))), 128)),
            (c(!0), h(Y, null, se(a.value.arrows, ($, M) => (c(), h(Y, {
              key: `label-${M}`
            }, [
              $.label ? (c(), h("g", Ch, [
                m("rect", {
                  x: $.label.x,
                  y: $.label.y,
                  width: $.label.width,
                  height: $.label.height,
                  rx: "4"
                }, null, 8, Oh),
                m("text", {
                  x: $.label.x + $.label.width / 2,
                  y: $.label.y + $.label.pad + $.label.line / 2
                }, [
                  (c(!0), h(Y, null, se($.label.lines, (z, x) => (c(), h("tspan", {
                    key: x,
                    x: $.label.x + $.label.width / 2,
                    dy: x ? $.label.line : 0
                  }, k(z), 9, Ih))), 128))
                ], 8, Th)
              ])) : E("", !0)
            ], 64))), 128))
          ], 12, Mh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Bh = /* @__PURE__ */ K(Rh, [["__scopeId", "data-v-51d24cfe"]]), za = {
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
}, Lh = ["innerHTML"], Dh = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => za[t.name] || za.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Lh));
  }
}, et = /* @__PURE__ */ K(Dh, [["__scopeId", "data-v-beb5935c"]]), Nh = {
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
}, Xt = /* @__PURE__ */ K(Nh, [["__scopeId", "data-v-d03899bb"]]), Ph = ["data-tip", "aria-label"], jh = {
  key: 0,
  class: "mact-word"
}, qh = {
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
      e.open ? (c(), h("span", jh, k(e.label), 1)) : E("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, Ph));
  }
}, mr = /* @__PURE__ */ K(qh, [["__scopeId", "data-v-3b292e09"]]), Fh = 120, is = 280, Wh = 160, Hh = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Uh = ["leaving", "resizing", "entering"];
function zh(e) {
  const t = Uh.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = { width: e.offsetWidth, height: e.offsetHeight };
  return e.classList.add(...t), n;
}
function gr(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = D(t()), a = D("");
  let o = 0;
  const r = (u, d) => Object.assign(u.style, { width: `${d.width}px`, height: `${d.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const d = e.value, f = ++o;
    if (!d || !d.offsetWidth || Hh()) {
      s.value = u;
      return;
    }
    const v = { width: d.offsetWidth, height: d.offsetHeight };
    if (r(d, v), a.value = "leaving", await n(Fh), f !== o) return;
    s.value = u, a.value = "resizing", await on(), i(d);
    const y = zh(d);
    r(d, v), d.offsetWidth, d.style.transition = `width ${is}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${is}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(d, y), await n(is), f === o && (i(d), a.value = "entering", await n(Wh), f === o && (a.value = ""));
  }
  return ke(t, (u) => l(u)), Lt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Vh = { class: "growing-card-top" }, Gh = ["aria-expanded"], Kh = { class: "growing-card-avatar" }, Yh = { class: "growing-card-title" }, Jh = { class: "growing-card-more" }, Zh = { class: "growing-card-body" }, Xh = {
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
    const n = e, s = t, a = D(!1), o = D(null), { folded: r, phase: i } = gr(o, () => !a.value), l = B(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = B(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", U(i), { open: !U(r), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", Vh, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (v) => a.value = !a.value)
        }, [
          m("span", Kh, [
            e.bad ? (c(), G(et, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(Y, { key: 1 }, [
              ce(k(l.value), 1)
            ], 64)) : (c(), G(ve, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", Yh, k(e.title), 1),
          W(Xt, { open: a.value }, null, 8, ["open"])
        ], 8, Gh),
        e.action ? (c(), G(mr, {
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
      m("div", Jh, [
        m("div", Zh, [
          (c(!0), h(Y, null, se(u.value, (v, y) => (c(), h("p", {
            key: y,
            class: "growing-card-text"
          }, k(v), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Qh = /* @__PURE__ */ K(Xh, [["__scopeId", "data-v-e31436cb"]]), ef = ["title", "aria-label"], tf = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, nf = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, sf = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = B(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: J(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", tf, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", nf)) : E("", !0)
      ]))
    ], 10, ef));
  }
}, af = /* @__PURE__ */ K(sf, [["__scopeId", "data-v-6dc92808"]]);
function of(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Fs(e) {
  const t = of(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function vr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Va(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const ls = (e) => String(e).padStart(2, "0");
function rf(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ls(t % 60)}s` : `${Math.floor(t / 3600)}h ${ls(Math.floor(t % 3600 / 60))}m ${ls(t % 60)}s`;
}
const lf = "img,pre,table";
function cf(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function uf(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function df(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(lf)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = cf(uf(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function hf(e, t) {
  let n = null;
  const s = () => e.value && df(e.value);
  qe(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const ff = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function pf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const mf = ["data-ref"], gf = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], vf = { class: "message-body" }, yf = ["title"], wf = ["innerHTML"], kf = ["title"], bf = ["innerHTML"], xf = {
  class: "message-faces",
  "data-message-faces": ""
}, $f = ["title", "data-face", "onClick"], Mf = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Sf = ["title", "data-reaction", "onClick"], _f = {
  key: 0,
  class: "message-reaction-count"
}, Ef = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Af = ["href", "title"], Cf = ["src", "alt"], Of = ["href"], Tf = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, If = {
  key: 1,
  "data-message-links-rows": ""
}, Rf = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Bf = ["data-sent-worker", "title", "onClick"], Lf = { class: "message-foot" }, Df = { class: "message-time" }, Nf = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, Pf = 140, jf = 2, qf = 1500, Ff = "An earlier message", Wf = "about", Hf = "sent_to", Uf = 3, zf = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var de;
    const n = e, s = t, a = D(!1), o = D(null), r = B(() => ["user", "comment"].includes(n.message.type)), i = B(() => {
      const [Q, ee] = (n.message.commented_row || ":").split(":"), Z = wt(Q);
      return Z ? { ref: `${Z}:${ee}`, label: `${ln(Z).title.toLowerCase()} ${ee}` } : null;
    }), l = B(() => n.message.worker_id ?? null), u = D(!1), d = B(() => l.value !== null && ((n.message.text ?? "").length > Pf || (n.message.text ?? "").split(`
`).filter((Q) => Q.trim()).length > jf)), f = B(() => r.value && !n.message.read_at && !n.message.local);
    async function v() {
      var Q;
      await ((Q = navigator.clipboard) == null ? void 0 : Q.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, qf);
    }
    const y = B(() => Ns(n.message.text ?? "", { env: "" })), O = B(() => JSON.parse(n.message.flowchart_edges || "[]")), S = D(!1), w = B(() => Ns(n.quote || Ff, { env: "" }));
    function $() {
      const Q = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Q ? Q.scrollIntoView({ block: "center", behavior: "smooth" }) : Ze(`messages:${n.message.parent_id}`);
    }
    hf(o, () => `${n.message.text} ${n.quote}`);
    const M = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, z = (Q) => `/api/files/message/${n.message.id}/${encodeURIComponent(Q)}`, x = B(() => JSON.parse(n.message.captions || "{}")), g = B(() => (n.message.files ?? []).map((Q) => ({ name: Q, address: z(Q), isImage: M.test(Q), title: x.value[Q] || Q }))), I = B(() => vr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), A = Te(Be, null), P = D([]), _ = D([]), T = D(!1), b = B(() => `Linked: ${P.value.join(", ")}`), p = B(() => P.value.length >= Uf), R = B(() => `${P.value.length} linked ${P.value.every((Q) => Q.startsWith("task ")) ? "tasks" : "rows"}`);
    async function L() {
      if (!r.value || !(A != null && A.read) || n.message.local) return;
      const Q = await A.read(`link list --source message:${n.message.id}`);
      if (!Q.ok) return;
      const ee = Q.value.rows ?? Q.value ?? [];
      P.value = ee.filter((Z) => Z.link_type === Wf).map((Z) => `${Z.target_model} ${Z.target_id}`), _.value = ee.filter((Z) => Z.link_type === Hf).map((Z) => Z.target_id);
    }
    L(), (de = A == null ? void 0 : A.follow) == null || de.call(A, ["link.*"], L);
    const q = D(!1), re = B(() => pf(n.message.reactions));
    function le(Q) {
      q.value = !1, s("react", n.message, Q);
    }
    return (Q, ee) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      W(Qh, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (Z) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, mf)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", vf, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: i.value }]),
          onClick: ee[6] || (ee[6] = (...Z) => U(At) && U(At)(...Z))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ee[1] || (ee[1] = be((Z) => U(Ze)(i.value.ref), ["stop"]))
          }, [
            W(ve, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + k(i.value.label), 1)
          ], 8, yf)) : E("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be($, ["stop"]),
            innerHTML: w.value
          }, null, 8, wf)) : E("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: ee[2] || (ee[2] = be((Z) => U(Ze)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + k(l.value), 9, kf)) : E("", !0),
          m("div", {
            class: J({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, bf),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ee[3] || (ee[3] = be((Z) => u.value = !u.value, ["stop"]))
          }, k(u.value ? "Show less" : "Show more"), 1)) : E("", !0),
          O.value.length ? (c(), h(Y, { key: 4 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[4] || (ee[4] = (Z) => S.value = !0)
            }, "Open the flowchart"),
            S.value ? (c(), G(Bh, {
              key: 0,
              title: e.message.text,
              edges: O.value,
              onClose: ee[5] || (ee[5] = (Z) => S.value = !1)
            }, null, 8, ["title", "edges"])) : E("", !0)
          ], 64)) : E("", !0)
        ], 2),
        m("div", {
          class: J(["message-tools", { picking: q.value }]),
          "data-message-tools": ""
        }, [
          q.value ? (c(), h(Y, { key: 0 }, [
            m("div", xf, [
              (c(!0), h(Y, null, se(U(ff), (Z) => (c(), h("button", {
                key: Z,
                type: "button",
                class: "message-face",
                title: `React ${Z}`,
                "data-face": Z,
                onClick: (Le) => le(Z)
              }, k(Z), 9, $f))), 128))
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
            }, k(a.value ? "Copied" : "Copy"), 1),
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
      re.value.length ? (c(), h("div", Mf, [
        (c(!0), h(Y, null, se(re.value, (Z) => (c(), h("button", {
          key: Z.emoji,
          type: "button",
          class: J(["message-reaction", { mine: Z.mine }]),
          title: Z.title,
          "data-reaction": Z.emoji,
          onClick: (Le) => s("react", e.message, Z.emoji)
        }, [
          ce(k(Z.emoji) + " ", 1),
          Z.count > 1 ? (c(), h("span", _f, k(Z.count), 1)) : E("", !0)
        ], 10, Sf))), 128))
      ])) : E("", !0),
      g.value.length ? (c(), h("div", Ef, [
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
            }, null, 8, Cf)
          ], 8, Af)) : (c(), h("a", {
            key: 1,
            href: Z.address,
            target: "_blank",
            class: "message-file"
          }, k(Z.name), 9, Of))
        ], 64))), 128))
      ])) : E("", !0),
      P.value.length ? (c(), h("div", Tf, [
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
        }, k(R.value), 1)) : (c(), h("span", If, [
          W(rt, {
            text: b.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : E("", !0),
      _.value.length ? (c(), h("div", Rf, [
        W(ve, {
          name: "send",
          size: 12
        }),
        (c(!0), h(Y, null, se(_.value, (Z) => (c(), h("button", {
          key: Z,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Z,
          title: `Open worker ${Z}`,
          onClick: be((Le) => U(Ze)(`agents:${Z}`), ["stop"])
        }, "Also sent to worker " + k(Z), 9, Bf))), 128))
      ])) : E("", !0),
      m("div", Lf, [
        m("time", Df, k(I.value), 1),
        Number.isInteger(e.message.id) ? (c(), h("span", Nf, "message " + k(e.message.id), 1)) : E("", !0),
        r.value ? (c(), G(af, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : E("", !0)
      ])
    ], 8, gf));
  }
}, ak = /* @__PURE__ */ K(zf, [["__scopeId", "data-v-727a6be5"]]), Bn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], cs = 200, yr = (e) => {
  var t;
  return ((t = Bn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Bn[0].key;
}, ok = (e) => {
  var t;
  return ((t = Bn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Vf = ["aria-label"], Gf = 300, Ga = 400, Kf = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: cs } },
  setup(e) {
    const t = e, n = B(() => yr(t.value)), s = B(() => n.value < cs ? [1, 0.25, 0.25] : n.value === cs ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: J(["ico", "prio", { hot: n.value >= Ga, high: n.value >= Gf && n.value < Ga }]),
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
        style: xe({ opacity: s.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: xe({ opacity: s.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: xe({ opacity: s.value[2] })
      }, null, 4)
    ], 10, Vf));
  }
}, rk = /* @__PURE__ */ K(Kf, [["__scopeId", "data-v-b10e610f"]]), Yf = {
  working: { word: "Working", dot: "running" },
  waiting: { word: "Waiting", dot: "you" },
  stuck: { word: "Stuck", dot: "failed" },
  stopped: { word: "Stopped", dot: "" },
  idle: { word: "Idle", dot: "queued" }
}, Jf = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "stuck", silent: "stuck", stopped: "stopped" }, Zf = (e) => {
  const t = Jf[e.state] || "idle";
  return { key: t, ...Yf[t] };
}, Xf = [
  { key: "working", label: "Working", icon: "agents", hidden: (e) => `${e} working` },
  { key: "waiting", label: "Blocked", icon: "warn", hidden: (e) => `${e} blocked` },
  { key: "idle", label: "Idle", icon: "pause", hidden: (e) => `${e} idle` },
  { key: "stopped", label: "Not running", icon: "x", hidden: (e) => `${e} not running` }
], Qf = [
  { key: "environment", label: "Environment agents", icon: "branch", hidden: (e) => `${e} ${e === 1 ? "environment agent" : "environment agents"}` },
  { key: "worker", label: "Workers", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "worker" : "workers"}` },
  { key: "subagent", label: "Subagents", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "helper" : "helpers"}` }
], e1 = { working: "working", waiting: "waiting", stuck: "waiting", idle: "idle", stopped: "stopped" }, Ln = (e) => e1[Zf(e.card).key] || "idle";
function t1(e, t) {
  return t.states[Ln(e)] === !1 ? Ln(e) : t.kinds[e.kind] === !1 ? e.kind : "";
}
const n1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), Ka = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Ya = (e, t) => Ka[Ln(e)] - Ka[Ln(t)], Ja = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, ik = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => Ya(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || n1(s, a)) : [...e].sort((s, a) => Ya(s, a) || (Ja[t] || Ja.state)(s, a)), s1 = Object.fromEntries([...Xf, ...Qf].map((e) => [e.key, e.hidden]));
function lk(e, t) {
  const n = {};
  return e.forEach((s) => {
    const a = t1(s, t);
    a && (n[a] = (n[a] || 0) + 1);
  }), Object.entries(n).map(([s, a]) => s1[s](a));
}
const a1 = ["aria-checked", "aria-haspopup", "onClick"], o1 = {
  key: 0,
  class: "segmented-dot"
}, r1 = {
  key: 1,
  class: "segmented-count"
}, i1 = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = So();
    return (a, o) => {
      const r = bi("tip");
      return c(), h("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(Y, null, se(e.options, (i) => ut((c(), h("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: J(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), h("span", o1)) : E("", !0),
          ce(" " + k(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", r1, k(i.count), 1)) : E("", !0)
        ], 10, a1)), [
          [r, i.tip || i.title, `${U(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, l1 = /* @__PURE__ */ K(i1, [["__scopeId", "data-v-ca953072"]]), c1 = { class: "form-field" }, u1 = { class: "form-field-head" }, d1 = ["for"], h1 = {
  key: 0,
  class: "form-field-aside"
}, f1 = {
  key: 0,
  class: "form-field-help"
}, p1 = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", c1, [
      m("div", u1, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, k(e.label), 9, d1),
        t.$slots.aside ? (c(), h("span", h1, [
          pe(t.$slots, "aside", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      pe(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", f1, k(e.help), 1)) : E("", !0)
    ]));
  }
}, ck = /* @__PURE__ */ K(p1, [["__scopeId", "data-v-dd7cdcff"]]), m1 = { class: "list-row" }, g1 = {
  key: 0,
  class: "list-row-kind"
}, v1 = { class: "list-row-main" }, y1 = {
  key: 0,
  class: "list-row-title"
}, w1 = { class: "list-row-body" }, k1 = {
  key: 1,
  class: "list-row-end"
}, b1 = {
  key: 1,
  class: "list-row-text"
}, x1 = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", m1, [
      e.kind ? (c(), h("span", g1, k(e.kind), 1)) : E("", !0),
      m("div", v1, [
        e.title ? (c(), h("span", y1, k(e.title), 1)) : E("", !0),
        m("div", w1, [
          pe(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", k1, [
          pe(t.$slots, "end", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      e.text ? (c(), h("span", b1, k(e.text), 1)) : E("", !0)
    ]));
  }
}, uk = /* @__PURE__ */ K(x1, [["__scopeId", "data-v-63155fba"]]), $1 = {
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
}, M1 = { claude: "Claude Code", codex: "Codex" }, S1 = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, _1 = {
  key: 1,
  class: "menu-item-text"
}, E1 = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", S1, k(e.checked ? "✓" : ""), 1)) : E("", !0),
      e.description ? (c(), h("span", _1, [
        m("span", null, [
          pe(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, k(e.description), 1)
      ])) : pe(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, It = /* @__PURE__ */ K(E1, [["__scopeId", "data-v-fec99974"]]), A1 = (e, t, n) => Math.max(t, Math.min(n, e)), C1 = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, wr = /* @__PURE__ */ new WeakMap(), O1 = (e, t) => wr.set(e, t);
function T1(e, t) {
  for (let n = t; n; n = wr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function I1(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !T1(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const Et = 8, R1 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = D(null), o = (p) => p ? `${p}px` : void 0, r = B(() => ({
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
      const R = p.closest(".pane, .float-window");
      return R ? d(R.getBoundingClientRect()) : u();
    }, v = (p, R) => `${Math.max(0, p ? Math.min(p, R) : R)}px`;
    function y(p, R) {
      return {
        below: p.bottom - R.bottom - s.gap - Et,
        above: R.top - p.top - s.gap - Et,
        across: p.right - p.left - 2 * Et
      };
    }
    function O(p) {
      const R = f(s.anchor), L = y(R, p);
      return i.value.w <= L.across && i.value.h <= Math.max(L.below, L.above) ? R : u();
    }
    const S = B(() => {
      if (!l.value) return r.value;
      const p = l.value, R = O(p), L = y(R, p), { w: q, h: re } = i.value, le = s.align === "auto" ? p.left + p.right > R.left + R.right : s.align === "right", de = A1(le ? p.right - q : p.left, R.left + Et, Math.max(R.left + Et, R.right - q - Et)), ee = re > L.below && L.above > L.below ? { bottom: `${window.innerHeight - p.top + s.gap}px`, maxHeight: v(s.maxHeight, L.above) } : { top: `${p.bottom + s.gap}px`, maxHeight: v(s.maxHeight, L.below) };
      return { ...r.value, ...ee, left: `${de}px`, maxWidth: v(s.maxWidth, L.across) };
    }), w = n, $ = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function M(p) {
      const R = $(), L = R.indexOf(document.activeElement);
      R[(L + p + R.length) % R.length].focus();
    }
    const z = { ArrowDown: () => M(1), ArrowUp: () => M(-1), Escape: () => w("close") }, x = (p) => z[p.key] && (p.preventDefault(), z[p.key]()), g = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let I = 0;
    const A = new ResizeObserver(() => {
      cancelAnimationFrame(I), I = requestAnimationFrame(g);
    });
    I1(a, (p) => s.anchor && !s.anchor.contains(p.target) && w("close"));
    const P = (p, R) => ["top", "left", "right", "bottom"].some((L) => Math.abs(p[L] - R[L]) > 1), _ = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let T = 0;
    function b() {
      if (s.anchor) {
        const p = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || _(p)) return w("close");
        P(p, l.value) && (l.value = p);
      }
      T = requestAnimationFrame(b);
    }
    return qe(() => {
      s.anchor && a.value && O1(a.value, s.anchor), g(), a.value && A.observe(a.value), !s.plain && $()[0] && $()[0].focus(), b();
    }), Re(() => {
      A.disconnect(), cancelAnimationFrame(T), cancelAnimationFrame(I);
    }), t({ element: a }), (p, R) => (c(), G(sa, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", ct({
        ref_key: "panel",
        ref: a
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: S.value,
        onKeydown: x
      }), [
        pe(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), pa = /* @__PURE__ */ K(R1, [["__scopeId", "data-v-3d203970"]]), B1 = ["aria-expanded"], L1 = { class: "drop-label" }, D1 = ["value"], N1 = {
  key: 1,
  class: "drop-lead"
}, P1 = { class: "drop-item-text" }, j1 = {
  key: 2,
  class: "drop-note"
}, q1 = {
  key: 1,
  class: "drop-none"
}, F1 = {
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
    const n = e, s = t, a = D(!1), o = D(null), r = D(""), i = B(() => {
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
        m("span", L1, k(e.label), 1),
        W(ve, {
          name: "down",
          size: 11
        })
      ], 10, B1),
      a.value ? (c(), G(pa, {
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
          }, null, 40, D1)) : E("", !0),
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
              f.lead ? (c(), h("span", N1, k(f.lead), 1)) : E("", !0),
              m("span", P1, k(f.label), 1),
              f.note ? (c(), h("span", j1, k(f.note), 1)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? E("", !0) : (c(), h("p", q1, k(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : E("", !0)
    ], 2));
  }
}, W1 = /* @__PURE__ */ K(F1, [["__scopeId", "data-v-29dfcce5"]]), dk = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => [
      ...$1[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = B(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (r, i) => (c(), G(W1, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${U(M1)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, H1 = ["aria-label"], U1 = { class: "head" }, z1 = { class: "names" }, V1 = { class: "body" }, G1 = {
  key: 0,
  class: "foot"
}, K1 = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = hr(s, n), i = fr(a);
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
            style: xe({ "--depth": e.depth, zIndex: U(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = be((...d) => U(o) && U(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(Y, { key: 0 }, [
                m("header", U1, [
                  m("div", z1, [
                    m("h2", null, k(e.title), 1),
                    e.abstract ? (c(), G(rt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : E("", !0)
                  ]),
                  pe(l.$slots, "actions", {}, void 0, !0),
                  W(Gn, {
                    title: e.closeLabel,
                    onClick: U(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                m("div", V1, [
                  pe(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", G1, [
                  pe(l.$slots, "foot", {}, void 0, !0)
                ])) : E("", !0)
              ], 64)) : pe(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, H1)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, hk = /* @__PURE__ */ K(K1, [["__scopeId", "data-v-c9a3f43a"]]), Ws = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Y1 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = aa(), n = B(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => ut((c(), h("textarea", ct({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [U(Ws), U(t).value]
    ]);
  }
}), fk = /* @__PURE__ */ K(Y1, [["__scopeId", "data-v-e130a5b9"]]), J1 = {
  key: 1,
  class: "text-field-label"
}, Z1 = {
  key: 2,
  class: "text-field-end"
}, X1 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Os({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Cs(e, "modelValue"), s = aa(), a = "onUpdate:modelValue" in (((d = xi()) == null ? void 0 : d.vnode.props) || {}), o = B(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = B(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = B(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = D(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, v) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: f.$slots.end }, U(s).class]),
      style: xe(U(s).style)
    }, [
      e.icon ? (c(), G(ve, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : E("", !0),
      e.label ? (c(), h("span", J1, k(e.label), 1)) : E("", !0),
      ut(m("input", ct({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [U(Ws), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Z1, [
        pe(f.$slots, "end", {}, void 0, !0)
      ])) : E("", !0)
    ], 6)) : ut((c(), h("input", ct({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [U(Ws), o.value]
    ]);
  }
}), pk = /* @__PURE__ */ K(X1, [["__scopeId", "data-v-d9c38ca8"]]), Za = (e) => e.page * e.size < e.total;
function Q1(e, t, { incremental: n = !1 } = {}) {
  const s = Hn(), a = D([]), o = D(""), r = D(!1), i = D(!1), l = D(""), u = D(null);
  async function d(w) {
    const $ = await s.read(`${e} --before-id ${w + 1} --limit 1`);
    if (!$.ok) return O();
    const M = $.value.rows.find((z) => z.id === w);
    a.value = M ? a.value.map((z) => z.id === w ? M : z) : a.value.filter((z) => z.id !== w);
  }
  async function f(w) {
    if (n && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== w.row_id));
    if (n && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && a.value.some((g) => g.id === w.row_id)) return d(w.row_id);
    if (!(n && a.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return O();
    const M = Math.max(...a.value.map((g) => g.id)), z = await s.read(`${e} --after-id ${M}`);
    if (!z.ok) return O();
    const x = new Set(a.value.map((g) => g.id));
    a.value = [...z.value.rows.filter((g) => !x.has(g.id)), ...a.value];
  }
  async function v() {
    if (!a.value.length) return !1;
    const w = Math.min(...a.value.map((z) => z.id)), $ = await s.read(`${e} --before-id ${w}`);
    if (!$.ok || !$.value.rows.length) return i.value = !1;
    i.value = Za($.value);
    const M = new Set(a.value.map((z) => z.id));
    return a.value = [...a.value, ...$.value.rows.filter((z) => !M.has(z.id))], !0;
  }
  let y = 0;
  async function O() {
    const w = ++y, $ = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (w !== y) return;
    const M = $.ok ? s.shared ? [$.value] : $.value.rows : [], z = M.length ? Math.min(...M.map((x) => x.id)) : 0;
    a.value = n && $.ok && z ? [...a.value.filter((x) => x.id > Math.max(...M.map((g) => g.id))), ...M, ...a.value.filter((x) => x.id < z)] : M, $.ok && !a.value.some((x) => x.id < z) && (i.value = !s.shared && Za($.value)), o.value = $.ok ? "" : $.error, r.value = !0;
  }
  async function S(w, $ = null) {
    const M = a.value;
    $ && (a.value = $(M));
    const z = await s.run(w);
    return $ && !z.ok && (a.value = M), l.value = z.ok ? "" : z.error, u.value = z.ok ? z.value : null, await O(), z;
  }
  return s.follow(t, f), O(), { rows: a, failure: o, loaded: r, more: i, load: O, older: v, act: S, actionFailure: l, answer: u, context: s };
}
const ep = { class: "title" }, tp = { class: "state" }, np = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Q1(t.line, t.events);
    return (o, r) => (c(), G(xl, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: V(({ row: i }) => [
        m("span", ep, k(i.title), 1),
        m("span", tp, k(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, mk = /* @__PURE__ */ K(np, [["__scopeId", "data-v-a69084cd"]]);
function sp(e = 1e3, t = null) {
  const n = D(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ke(t, a, { immediate: !0 }) : a(!0), Re(() => clearInterval(s)), n;
}
const us = D(Date.now() / 1e3);
let Xa = 0, kn = 0;
function ap() {
  return kn || (us.value = Date.now() / 1e3, Xa = setInterval(() => us.value = Date.now() / 1e3, 1e3)), kn += 1, _o() && Eo(() => {
    kn -= 1, kn || clearInterval(Xa);
  }), us;
}
const op = ["title", "data-figure-mark", "data-folded", "data-open"], rp = {
  key: 2,
  class: "worker"
}, ip = { class: "head" }, lp = { key: 0 }, cp = {
  key: 3,
  class: "status"
}, up = {
  key: 0,
  class: "figure"
}, dp = {
  key: 1,
  class: "ran-for"
}, hp = { key: 2 }, fp = {
  key: 3,
  class: "news"
}, pp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, mp = {
  key: 6,
  class: "settled"
}, gp = {
  key: 1,
  class: "bar"
}, vp = {
  key: 3,
  class: "detail body"
}, yp = {
  key: 0,
  class: "body-label"
}, wp = ["title"], kp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = aa(), s = ["onClick", "onAct"], a = B(() => Object.fromEntries(Object.entries(n).filter(([Q]) => !s.includes(Q)))), o = D(!1), r = B(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = B(() => t.open !== void 0), l = B(() => i.value || r.value), u = B(() => i.value ? t.open : o.value), d = B(() => i.value ? !t.open : r.value && !o.value), f = B(() => !!(t.mark.action && n.onAct)), v = B(() => l.value || f.value || !!n.onClick), y = D(null), O = D(null), { folded: S, phase: w } = gr(y, () => d.value);
    function $(Q) {
      var ee, Z;
      if (!(Q.target !== y.value && !O.value.contains(Q.target))) {
        if (i.value) return (ee = n.onClick) == null ? void 0 : ee.call(n, Q);
        if (r.value) return void (o.value = !o.value);
        (Z = n.onAct || n.onClick) == null || Z(Q);
      }
    }
    const M = (Q) => n.onAct(Q), z = ["failed", "unfinished"], x = B(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? z.includes(t.mark.state) ? "danger" : "good" : ""), g = B(() => t.mark.color ? t.mark.color : x.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : x.value ? `var(--tone-${x.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), I = B(() => g.value || "var(--tone-work)"), A = B(() => !t.mark.ending && !t.mark.ended && x.value !== "stopped"), P = ap(), _ = B(
      () => t.mark.began_at && A.value && !t.mark.figure && !t.mark.counting ? rf(P.value - t.mark.began_at) : ""
    ), T = B(() => {
      const { started: Q, ended: ee } = t.mark;
      return Q ? ee ? `ran ${Va(ee - Q, !0)}` : Va(P.value - Q, !0) : _.value;
    }), b = ["bad", "danger", "warn"], p = B(() => b.includes(x.value) || t.mark.asks ? "attention" : A.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), R = ["bad", "danger"], L = B(() => R.includes(x.value)), q = B(() => p.value === "process" ? "running" : L.value ? "cross" : x.value === "stopped" ? "stopped" : x.value === "good" ? "tick" : ""), re = B(
      () => !!(t.mark.figure || T.value || t.mark.docked || t.mark.stopping || q.value || t.mark.settled || t.mark.news)
    ), le = B(() => [t.mark.title, t.mark.time ? vr(t.mark.time) : ""].filter(Boolean).join(" · ")), de = B(() => ({
      ...g.value ? { "--mark": g.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (Q, ee) => (c(), h("div", ct(a.value, {
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
      "data-folded": U(S) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: $
    }), [
      (c(), G(bt(v.value ? "button" : "span"), {
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
          e.mark.worker ? (c(), h("span", rp, k(e.mark.worker), 1)) : E("", !0),
          m("span", ip, [
            W(rt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", lp, k(e.mark.name), 1)) : E("", !0),
            l.value ? (c(), G(Xt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : E("", !0)
          ]),
          re.value ? (c(), h("span", cp, [
            e.mark.figure ? (c(), h("span", up, k(e.mark.figure), 1)) : E("", !0),
            T.value ? (c(), h("span", dp, k(T.value), 1)) : E("", !0),
            e.mark.stopping ? (c(), h("span", hp, "Stopping")) : E("", !0),
            e.mark.news ? (c(), h("span", fp, k(e.mark.news), 1)) : E("", !0),
            q.value === "running" ? (c(), h("span", pp)) : q.value ? (c(), G(et, {
              key: 5,
              class: J(["sign", q.value]),
              name: q.value
            }, null, 8, ["class", "name"])) : E("", !0),
            e.mark.settled ? (c(), h("span", mp, k(e.mark.settled), 1)) : E("", !0)
          ])) : E("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), G(mr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: be(M, ["stop"])
      }, null, 8, ["label", "open"])) : E("", !0),
      (e.mark.figure || e.mark.counting) && A.value ? (c(), h("span", gp, [
        m("span", {
          class: "progress",
          style: xe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: I.value })
        }, null, 4)
      ])) : E("", !0),
      e.mark.detail && !U(S) ? (c(), G(rt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      e.mark.body && !U(S) ? (c(), h("div", vp, [
        e.mark.bodyLabel ? (c(), h("p", yp, k(e.mark.bodyLabel), 1)) : E("", !0),
        W(rt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : E("", !0),
      e.mark.command && !U(S) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, wp)) : E("", !0),
      e.mark.card ? (c(), G(rt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      pe(Q.$slots, "default", {
        shown: !U(S)
      }, void 0, !0)
    ], 16, op));
  }
}), kr = /* @__PURE__ */ K(kp, [["__scopeId", "data-v-74d78abb"]]), bp = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function br(e) {
  var n;
  const t = bp[e] || ((n = ln(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const xp = (e) => br(String(e).split(":")[0]), xr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), $p = { passed: "good", failed: "danger", warned: "warn", running: "" }, Mp = { good: "good", warn: "warn", danger: "danger" }, Qa = {
  "open row": (e) => Ze(`${e.target_model}:${e.target_id}`),
  "open page": (e) => hl(e.target_model, e.target_id || 0)
}, Sp = { "open row": (e) => xp(e.target_model), "open page": () => br("pages") };
function _p(e, t) {
  const n = t || {}, s = Qa[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? $p[e.outcome] || "" : Mp[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Sp[s](e) : "",
    handlers: s ? { onAct: () => Qa[s](e) } : {}
  };
}
const Ep = 24, Ap = 1e3, eo = 2e3, Cp = 0.25, Op = 5e3;
function Tp(e, t = Ep, n = () => !0) {
  const s = D(!1), a = D(0), o = D(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const x = u();
    return x ? x.scrollHeight - x.scrollTop - x.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function v(x) {
    if (clearTimeout(r), !x) {
      o.value = !1, l = Date.now();
      return;
    }
    const g = Date.now() - l < eo ? eo : Ap;
    r = setTimeout(() => o.value = s.value, g);
  }
  function y() {
    clearTimeout(i), s.value = !1, a.value = 0, v(!1);
  }
  function O(x = !1) {
    const g = u();
    g && x && g.scrollTo ? g.scrollTo({ top: g.scrollHeight, behavior: "smooth" }) : g && (g.scrollTop = g.scrollHeight), y();
  }
  function S() {
    $(), !s.value && (s.value = !0, v(!0));
  }
  const w = () => !!u() && d() <= u().clientHeight * Cp;
  function $() {
    clearTimeout(i), w() && (i = setTimeout(() => s.value && w() && n() && O(!0), Op));
  }
  function M() {
    f() ? y() : S();
  }
  function z(x = 1, g = !1) {
    s.value ? a.value += Math.max(0, x) : O(g);
  }
  return _o() && Eo(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: y, toBottom: O, left: S, scrolled: M, arrived: z };
}
const Ip = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Rp = (e) => String(e ?? "").replace(Ip, ""), Bp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(null), { away: o, scrolled: r, arrived: i, toBottom: l } = Tp(a);
    ke(
      () => n.lines.length,
      () => on(() => i()),
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
      ce(k(U(Rp)(e.lines.join(`
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
}, Lp = /* @__PURE__ */ K(Bp, [["__scopeId", "data-v-d9fa8127"]]), Dp = 1e4;
class Np {
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
    return this.heardAt !== null && t - this.heardAt > Dp;
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
const Pp = {
  key: 0,
  class: "frame-note"
}, jp = {
  key: 0,
  class: "frame-note"
}, qp = ["src", "title"], Fp = 1e3, Wp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Hn(), s = D(null), a = D(!1), o = D(!1);
    let r = null, i = 0;
    return qe(() => {
      r = new Np(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Fp);
    }), Re(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", Pp, "This window was closed because it stopped answering.")) : (c(), h(Y, { key: 1 }, [
      a.value ? (c(), h("div", jp, [
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
      }, null, 8, qp)
    ], 64));
  }
}, Hp = /* @__PURE__ */ K(Wp, [["__scopeId", "data-v-32a49046"]]), Up = 0, zp = "/api/lines", Vp = "/api/line";
class Gp {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Up));
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
        const n = await Fe.raw(zp, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Fe.raw(Vp, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Kp = new Gp();
class Yp {
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
      n.patterns.some((s) => $r(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function $r(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Jp = Symbol("pane-page"), Zp = { 1: "refused", 2: "usage", 3: "fault" }, Xp = 100, Qp = /"([^"]*)"|'([^']*)'|(\S+)/g;
function em({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = D({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: v = "", tabs: y = [], search: O = {}, readOnly: S = !1, shared: w = null }) {
  const $ = /* @__PURE__ */ new Map(), M = new AbortController(), z = (x) => {
    const g = $.get(x);
    if (g && performance.now() - g.at < Xp) return g.answer;
    const I = Ut(e, x, t, M.signal);
    return $.set(x, { answer: I, at: performance.now() }), I;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: B(() => s()),
    permissions: a,
    autoScroll: v,
    tabs: y,
    search: O,
    readOnly: S,
    shared: w,
    read: z,
    run: (x) => Ut(e, x, t, M.signal),
    upload: (x) => nm(x, M.signal),
    cancel: () => M.abort(),
    follow: (x, g) => r.follow(e, x.filter((I) => o.some((A) => $r(A, I))), g, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (x) => B(() => {
      var g;
      return l.value[x] ?? ((g = u.find((I) => I.key === x)) == null ? void 0 : g.default);
    }),
    setting: async (x, g) => {
      const I = await z(`window setting ${e} ${x}`);
      return I.ok ? I.value.value : g;
    },
    setOption: f,
    keep: (x, g) => Ut(e, ["window", "save-setting", e, x, JSON.stringify(g)], t, M.signal)
  };
}
function tm(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Dn = { ok: !1, failure: "cancelled", error: "" };
async function Ut(e, t, n, s = void 0) {
  try {
    const a = await Kp.add({ window: e, line: Array.isArray(t) ? t : sm(t), environment: n }, s);
    return s != null && s.aborted ? Dn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Zp[a.code] || "fault", error: tm(a.error) };
  } catch (a) {
    return s != null && s.aborted ? Dn : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function nm(e, t = void 0) {
  try {
    const n = await Fe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? Dn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? Dn : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function sm(e) {
  return [...e.matchAll(Qp)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function am({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const om = {
  class: "allowance-prompt",
  role: "dialog"
}, rm = { class: "allowance-prompt-text" }, im = { class: "allowance-prompt-buttons" }, lm = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", om, [
      m("p", rm, k(U(am)(e.request)), 1),
      m("div", im, [
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
}, cm = /* @__PURE__ */ K(lm, [["__scopeId", "data-v-102dc765"]]), ds = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(Tn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: V(() => [
        ce(k(e.reason) + " ", 1),
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
}, um = ["data-window", "data-agent"], dm = {
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
    const i = Te(Ji, null), l = em({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: B(() => n.options),
      declared: n.declared,
      page: Te(Jp, null),
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
    $i(Be, l), ke(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Re(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), Mi((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => ta(n.component), d = () => {
      var f, v;
      return ((v = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : v.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, v) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), G(cm, {
        key: 0,
        request: d(),
        onAnswer: v[0] || (v[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : E("", !0),
      e.unavailableReason ? (c(), G(ds, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), G(ds, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), G(u, { key: o.value })) : (c(), G(ds, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: v[1] || (v[1] = (y) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, um));
  }
}, Mr = /* @__PURE__ */ K(dm, [["__scopeId", "data-v-32203cbc"]]), hm = {
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
    const n = e, s = t, a = { render: () => ta(Hp, { src: n.entry.entry_url }) };
    return (o, r) => (c(), G(Mr, {
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
}, Hs = "journal.stale-build-reload", fm = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function pm(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Hs) === e.message) return !1;
    t.setItem(Hs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function mm(e = window.sessionStorage) {
  try {
    e.removeItem(Hs);
  } catch {
    return;
  }
}
const gm = ["data-window"], vm = {
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
    const n = e, s = t, a = Wn(null), o = D("");
    return ke(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, mm();
          } catch (i) {
            if (fm(i) && pm(i)) return;
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
    ], 8, gm)) : (c(), G(Mr, {
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
}, ym = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
    const t = e, n = new Yp(), s = ((i = Te(Be, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = B(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), r = B(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (l, u) => r.value ? (c(), G(vm, {
      key: 0,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(hm, {
      key: 1,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, wm = { class: "mark-more-inner" }, km = {
  class: "mark-lines",
  "data-mark-reason": ""
}, bm = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, xm = {
  key: 3,
  class: "mark-lines"
}, $m = "process", to = "task", Mm = 2e3, Sm = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Te(Be), s = B(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = B(() => xr.has(t.mark.variant) && t.mark.detail || ""), o = B(() => t.mark.target_model === to ? t.mark.target_id : 0), r = D([]), i = D(!1), l = D(""), u = B(() => t.mark.target_model === $m && !!t.mark.target_id);
    async function d() {
      const y = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, l.value = y.ok ? "" : y.error, y.ok && (r.value = y.value.lines);
    }
    let f = null;
    const v = () => clearInterval(f);
    return ke(() => t.shown && u.value, (y) => {
      v(), y && (d(), t.mark.ended_at || (f = setInterval(d, Mm)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (y) => y && t.shown && u.value && (v(), d())), Re(v), (y, O) => (c(), h("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: O[1] || (O[1] = be(() => {
      }, ["stop"]))
    }, [
      m("div", wm, [
        e.declaration.body_url ? (c(), G(ym, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(Y, { key: 1 }, [
          a.value ? (c(), h(Y, { key: 0 }, [
            O[2] || (O[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", km, k(a.value), 1)
          ], 64)) : E("", !0),
          u.value && l.value ? (c(), h("p", bm, k(l.value), 1)) : u.value && i.value ? (c(), h(Y, { key: 2 }, [
            O[3] || (O[3] = m("p", { class: "mark-label" }, "Output", -1)),
            W(Lp, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", xm, k(s.value.join(`
`)), 1)) : E("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: O[0] || (O[0] = be((S) => U(Ze)(`${to}:${o.value}`), ["stop"]))
          }, "Open task " + k(o.value) + " and its proofs", 1)) : E("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Us = /* @__PURE__ */ K(Sm, [["__scopeId", "data-v-51f69bf1"]]), _m = (e) => `show-${e}`, gk = (e, t, n) => e.filter((s) => {
  var a;
  return n(_m((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Em = "messages.chat", Am = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), Sr = (e, t, n) => Ut(Em, Am(e, t), n), Cm = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Om = ["title", "aria-label", "onClick"], Tm = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Im = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = B(() => Cm(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = D(""), a = Te(Be);
    async function o(r) {
      const i = await Sr(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(Y, null, [
      (c(!0), h(Y, null, se(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: be((u) => o(l), ["stop"])
      }, [
        W(et, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Om))), 128)),
      s.value ? (c(), h("span", Tm, k(s.value), 1)) : E("", !0)
    ], 64));
  }
}, Rm = /* @__PURE__ */ K(Im, [["__scopeId", "data-v-0dfda102"]]);
function _r(e, t) {
  const n = Wn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await Fe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const Er = _r("/api/marks", "marks"), vk = Er.fetchAll, Bm = Er.find, Lm = 2e3;
function Ar(e, t, n = Lm) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  qe(async () => {
    await e(), a();
  }), Lt(() => clearTimeout(s));
}
const Dm = ["data-ref"], Nm = ["data-ref"], Pm = { class: "mark-row" }, jm = "dock add", qm = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = B(() => Bm(s.mark.type)), o = Te(Be, null), r = B(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = D(null);
    Ar(async () => {
      if (!r.value) return;
      const y = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      y.ok && y.value.rows.length && (i.value = y.value.rows[0].progress);
    }, () => r.value);
    const l = B(() => {
      const y = _p(s.mark, a.value), O = !y.figure || y.figure.endsWith("%");
      return i.value && r.value && O ? { ...y, figure: `${i.value}%`, fraction: i.value / 100 } : y;
    }), u = B(() => {
      var y;
      return !!(s.mark.lines || s.mark.detail && xr.has(s.mark.variant) || t.has(s.mark.target_model) || (y = a.value) != null && y.body_url);
    }), d = D(!1);
    function f(y) {
      if (l.value.handlers.onAct && !y.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const v = B(() => {
      var y, O, S;
      return s.docked ? (O = (y = a.value) == null ? void 0 : y.buttons) == null ? void 0 : O.filter((w) => {
        var $;
        return !(($ = w.runs) != null && $.startsWith(jm));
      }) : (S = a.value) == null ? void 0 : S.buttons;
    });
    return (y, O) => {
      var S, w;
      return (S = a.value) != null && S.card ? (c(), h("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        W(Us, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Dm)) : (c(), h("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (w = a.value) == null ? void 0 : w.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Pm, [
          W(kr, ct({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, Si(l.value.handlers), { onClick: f }), _i({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: V(({ shown: $ }) => [
                W(Us, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: $
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          W(Rm, {
            buttons: v.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Nm));
    };
  }
}, Fm = /* @__PURE__ */ K(qm, [["__scopeId", "data-v-cc29b2a4"]]), Wm = ["data-ref"], Hm = ["inert"], Um = { class: "thread-group" }, zm = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = D(!1), s = D(!1);
    ke(n, () => s.value = !0);
    const a = B(() => ({
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
      W(kr, {
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
        m("div", Um, [
          (c(!0), h(Y, null, se(e.group.marks, (i) => (c(), G(Fm, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, Hm)) : E("", !0)
    ], 8, Wm));
  }
}, yk = /* @__PURE__ */ K(zm, [["__scopeId", "data-v-8a285510"]]);
function Vm(e) {
  const t = D(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return qe(() => n.observe(e.value)), Lt(() => n.disconnect()), t;
}
const Gm = { class: "chat-dock-fold" }, Km = ["aria-label"], Ym = { class: "chat-dock-head" }, Jm = { class: "chat-dock-inner" }, Cr = 700, Zm = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = D(null), s = D(null), a = Vm(s), o = D(!1);
    let r = 0;
    return qe(() => r = setTimeout(() => o.value = !0, Cr)), Lt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      m("div", Gm, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          pe(i.$slots, "edge"),
          m("header", Ym, [
            pe(i.$slots, "head")
          ]),
          m("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            m("div", Jm, [
              m("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: xe(U(a) === null ? null : { height: `${U(a)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  pe(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, Km)
      ])
    ], 2));
  }
}, Or = /* @__PURE__ */ K(Zm, [["__scopeId", "data-v-63e4dcfc"]]), Xm = {
  class: "dock-leave",
  "aria-hidden": "true"
}, hs = 5, Qm = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(hs, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${hs}s`, animationDelay: `${(n - hs).toFixed(2)}s` };
    return (a, o) => (c(), h("span", Xm, [
      m("i", { style: s })
    ]));
  }
}, Tr = /* @__PURE__ */ K(Qm, [["__scopeId", "data-v-d0c4b012"]]), Ir = _r("/api/docks", "docks"), wk = Ir.fetchAll, zs = Ir.find, eg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Vs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), tg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), ng = (e) => e.kept ? Vs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : Vs("keep", "pin", "Pin", `dock keep ${e.id}`), sg = ["pin", "stop"], ag = (e) => ({ ...e, iconOnly: sg.includes(e.icon) });
function og(e, t) {
  var n;
  return [
    ...tg(e, t) ? [ng(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || ln(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Vs("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(ag);
}
const rg = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: eg(e, t),
  buttons: og(e, t)
}), ig = { class: "dock-title" }, lg = ["aria-expanded", "title"], cg = { class: "chat-dock-acts dock-acts" }, ug = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, dg = {
  key: 1,
  class: "dock-text"
}, hg = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = B(() => zs(s.item.type)), o = D(null), r = B(() => rg(s.item, a.value)), i = Te(Be), l = D(/* @__PURE__ */ new Set()), u = D("");
    async function d(y) {
      if (y.action === "open") return Ze(`${s.item.target_model}:${s.item.target_id}`);
      y.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, y.label])), u.value = "";
      const S = await Sr(y, s.item, i.environment);
      (S == null ? void 0 : S.ok) === !1 && (l.value = new Set([...l.value].filter((w) => w !== y.label)), u.value = S.error);
    }
    const f = B(() => r.value.buttons.filter((y) => y.action !== "undock" && !l.value.has(y.label))), v = B(() => r.value.buttons.find((y) => y.action === "undock"));
    return (y, O) => (c(), G(Or, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: V(() => [
        e.leaving ? (c(), G(Tr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : E("", !0)
      ]),
      head: V(() => {
        var S, w, $;
        return [
          (S = a.value) != null && S.draws_head ? (c(), h("span", {
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
            m("span", ig, k(r.value.title), 1)
          ], 64)),
          (w = a.value) != null && w.badge ? (c(), h("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, k(a.value.badge), 3)) : E("", !0),
          ($ = a.value) != null && $.draws_head ? E("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: O[0] || (O[0] = (M) => n("fold"))
          }, [
            W(Xt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, lg)),
          m("span", cg, [
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
                  ce(k(M.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          W(Gn, {
            title: v.value.label,
            "data-dock-action": "undock",
            onClick: O[1] || (O[1] = (M) => d(v.value))
          }, null, 8, ["title"])
        ];
      }),
      default: V(() => {
        var S, w;
        return [
          u.value ? (c(), h("p", ug, k(u.value), 1)) : E("", !0),
          e.item.text && !((S = a.value) != null && S.body_url) ? (c(), h("p", dg, k(e.item.text), 1)) : E("", !0),
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
}, no = /* @__PURE__ */ K(hg, [["__scopeId", "data-v-109b82ce"]]), fg = 6, pg = 3, so = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, vt = (e) => !!(e.leaves_at && !e.kept), mg = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!vt(e) || t < e.leaves_at || n.has(e.id)), gg = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => mg(s, t, n)).sort((s, a) => s.id - a.id);
function vg(e, t, n = fg) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const yg = (e, t, n = e) => n < 2 ? !1 : e >= pg ? !0 : t, wg = ["title", "aria-label"], kg = { class: "run-chip-in" }, bg = {
  key: 0,
  class: "run-chip-ring"
}, xg = { class: "run-chip-name" }, $g = { class: "run-chip-bar" }, Mg = "processes.output", Sg = 5e3, _g = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = Te(Be, null)) == null ? void 0 : d.environment) ?? "", o = D(null), r = B(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = B(() => {
      var f, v;
      return ((f = o.value) == null ? void 0 : f.title) || ((v = o.value) == null ? void 0 : v.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = B(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await Ut(Mg, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return Ar(u, () => r.value, Sg), (f, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: xe({ "--tone": l.value })
      }, [
        U(vt)(e.item) ? (c(), G(Tr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : E("", !0),
        m("span", kg, [
          r.value ? (c(), h("span", bg)) : (c(), G(et, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          m("span", xg, k(i.value), 1)
        ]),
        m("span", $g, [
          m("i", {
            style: xe({ width: r.value ? `${((y = o.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, wg);
    };
  }
}, Eg = /* @__PURE__ */ K(_g, [["__scopeId", "data-v-597b05d2"]]), Ag = 24, Cg = 8, kk = 420;
function bk({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= Ag && e > t ? !0 : e < t && a > Cg ? !1 : null;
}
const Og = (e, t) => e === void 0 ? t : e, Tg = {
  key: "runs-head",
  class: "dock-runs-head"
}, Ig = { class: "dock-runs-chips" }, Rg = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = sp(500), s = D(/* @__PURE__ */ new Set()), a = D(!1), o = D(!1), r = B(() => gg(t.items, n.value, s.value)), i = B(() => vg(r.value.filter((M) => so(M, zs)), n.value)), l = B(() => r.value.filter((M) => !i.value.includes(M) && !so(M, zs))), u = B(() => i.value.filter((M) => !vt(M))), d = B(() => (a.value = yg(i.value.length, a.value, u.value.length)) && !o.value), f = D({}), v = (M) => Og(f.value[M.id], t.folded);
    function y(M) {
      f.value = { ...f.value, [M.id]: !v(M) };
    }
    function O(M) {
      f.value = { ...f.value, ...Object.fromEntries(i.value.map((z) => [z.id, z.id !== M.id])) }, o.value = !0;
    }
    function S() {
      f.value = Object.fromEntries(Object.entries(f.value).filter(([M]) => !i.value.some((z) => String(z.id) === M))), o.value = !1;
    }
    function w(M) {
      s.value = /* @__PURE__ */ new Set([...s.value, M.id]);
    }
    function $(M) {
      s.value = new Set([...s.value].filter((z) => z !== M.id));
    }
    return (M, z) => (c(), G(Mo, {
      tag: "div",
      name: "dock",
      duration: U(Cr),
      class: "dock-stack"
    }, {
      default: V(() => [
        (c(!0), h(Y, null, se(l.value, (x) => (c(), G(no, {
          key: x.id,
          item: x,
          class: J({ timed: U(vt)(x) }),
          leaving: U(vt)(x) && !s.value.has(x.id),
          folded: v(x),
          onFold: (g) => y(x),
          onMouseenter: (g) => w(x),
          onMouseleave: (g) => $(x)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", Tg, [
          m("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: S
          }, [
            ce(k(i.value.length) + " runs ", 1),
            W(Xt, { open: "" })
          ])
        ])) : E("", !0),
        (c(!0), h(Y, null, se(d.value ? [] : i.value, (x) => (c(), G(no, {
          key: x.id,
          item: x,
          class: J({ timed: U(vt)(x) }),
          leaving: U(vt)(x) && !s.value.has(x.id),
          folded: v(x),
          onFold: (g) => y(x),
          onMouseenter: (g) => w(x),
          onMouseleave: (g) => $(x)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        d.value ? (c(), G(Or, {
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
              onClick: z[0] || (z[0] = (x) => o.value = !0)
            }, [
              W(et, { name: "runs" }),
              ce(" " + k(i.value.length) + " runs ", 1),
              W(Xt)
            ]),
            m("span", Ig, [
              (c(!0), h(Y, null, se(i.value, (x) => (c(), G(Eg, {
                key: x.id,
                item: x,
                onClick: (g) => O(x)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : E("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, xk = /* @__PURE__ */ K(Rg, [["__scopeId", "data-v-7081ac82"]]), yt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, En = (e) => Math.min(Math.max(e, 0), 1), Bg = (e) => {
  const t = En(e);
  return t * t * (3 - 2 * t);
}, ft = (e, t, n) => Bg((e - t) / (n - t));
function $k(e) {
  const t = En(e), n = En((t - 0.12) / 0.76) * yt.shuffles, s = Math.min(Math.floor(n), yt.shuffles - 1), a = n - s, o = ft(a, 0.26, 0.38) * (1 - ft(a, 0.76, 0.96)), r = ft(a, 0.38, 0.76), i = ft(t, 0, 0.12) * (1 - ft(t, 0.88, 1)), l = ft(a, 0.2, 0.34) * (1 - ft(a, 0.84, 1)), u = Math.sin(Math.PI * En((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / yt.shuffles, lift: yt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function Mk(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const ao = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, Sk = (e) => ao[e] ?? ao.butler, ma = 2400, Lg = 0.05;
function Dg({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, Lg), r = Math.min(t + ma * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function _k(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function Ng(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function Ek(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const Ak = (e, t) => ({ ...e, stretch: t.stretch }), Ck = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Rr = (e, t) => t >= (e.least ?? 0);
function Ok(e, t, n) {
  if (!Rr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const Tk = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Pg = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", oo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), jg = (e) => e.right > e.left && e.bottom > e.top;
function Ik(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(Pg)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = oo(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = oo(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), jg(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function Br(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, v] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[f] || e[d] > o[v]) && (i = -1);
      else {
        const O = (o[f] - e[d]) / y, S = (o[v] - e[d]) / y;
        r = Math.max(r, Math.min(O, S)), i = Math.min(i, Math.max(O, S));
      }
    }
    if (r > i || s && r >= s.share) continue;
    const l = e.x + (t.x - e.x) * r, u = e.y + (t.y - e.y) * r;
    s = { share: r, x: l, y: u, on: "surface", surface: a.id, dx: l - a.left, dy: u - a.top };
  }
  return s;
}
const Se = {
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
}, Qt = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), qg = (e) => e * e * (3 - 2 * e), _e = (e, [t, n]) => qg(Qt(e, t, n)), Fg = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, bn = ([e, t], n) => e + n() * (t - e);
function Wg(e) {
  return Fg.map(() => {
    const t = bn(it.speed, e), n = bn(it.angle, e) * Math.PI / 180, s = bn(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [bn(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const Hg = Wg(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Ug(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function Rk(e, t, n = Hg) {
  const s = Se.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = Ug(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= it.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const Bk = (e, t) => e && Se[e.name] ? { name: e.name, u: t / e.frames } : null;
function Lk(e, t) {
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
const Dk = () => Array.from({ length: Se.pogo.count }, (e, t) => Se.pogo.bounce * (t + 1) / Se.pogo.count), Tt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Nk(e, t, n) {
  const { away: s, side: a } = Se.bug_smash, o = a * s * n, [r, i] = [t.left + Tt.margin * n, t.right - Tt.margin * n], l = Math.min(Math.max(e + o + a * Tt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function Pk(e, t, n) {
  const s = Se.bug_smash, a = _e(t, s.walk), o = ([r, i]) => r + (i - r) * a;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Tt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Tt.tall * n * (1 - _e(t, s.emerge)),
      turn: 90 * (1 - _e(t, s.climb)),
      whole: t < s.blow,
      flat: t >= s.blow ? 1 : 0,
      shows: 1 - _e(t, s.gone)
    }
  };
}
function jk(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Tt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = Dg({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Oe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function qk(e) {
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
function zg(e, t) {
  const n = Se.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = Ng(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function Fk(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Se.bug_shot, { frame: r, bug: i, shot: l } = zg(n, e.length), u = e.map(($, M) => ({ ...Gs($, t, Math.min(n / o.fps, An(M).shot)), shot: M < l })), d = _e(r / o.frames, o.aim), [f, v] = [u[Math.max(i - 1, 0)], u[i]], y = e.map(($, M) => ({ bug: $, index: M, seconds: n / o.fps - An(M).shot, spot: Gs($, t, An(M).shot) })).filter(($) => $.seconds >= 0), O = y.flatMap(($) => {
    const M = (a == null ? void 0 : a.get($.index)) ?? Jg($.bug, t, $.spot, a ? [] : s);
    return a == null || a.set($.index, M), a && Zg(M, $.seconds, s), Xg(M, $.seconds, s);
  }), S = y.filter(($) => Kg($.bug)).map(($) => ({ seconds: $.seconds, from: $.spot })), w = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (v.x - f.x) * d, y: f.y + (v.y - f.y) * d, back: w }, slush: O, camera: S };
}
function An(e) {
  const t = Se.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function Wk(e, t, n, s) {
  const { limit: a, margin: o } = Se.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = An(d), v = Gs(u, t, f.shot), y = Math.abs(v.y - n.y) / Math.tan(a * Math.PI / 180), O = v.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - v.x), S = Math.abs(v.x - l) >= y ? l : v.x + O * y, w = O > 0 ? Math.max(l, Math.min(S, i)) : Math.min(l, Math.max(S, r)), $ = { from: l, to: w, begin: f.walk, end: f.aim };
    return l = w, $;
  });
}
function Hk(e, t, n) {
  var o;
  const s = Se.bug_shot.back.stride * n;
  let a = 0;
  for (const r of e) {
    if (t <= r.begin) return { x: r.from, steps: a / s, way: 0 };
    if (t < r.end) {
      const i = r.from + (r.to - r.from) * _e(t, [r.begin, r.end]);
      return { x: i, steps: (a + Math.abs(i - r.from)) / s, way: Math.sign(r.to - r.from) };
    }
    a += Math.abs(r.to - r.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: a / s, way: 0 };
}
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Vg = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Gg(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Kg = (e) => e.along * 97 % 1 < $e.camera, en = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function Yg(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += $e.step) {
    const d = Math.min(u + $e.step, r.t), f = en(e, d), v = Br(i, f, n);
    if (v) return { ...v, t: u + (d - u) * v.share };
    i = f;
  }
  const l = en(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function Jg(e, t, n, s = []) {
  const a = Gg(e.along + 1), [o, r] = Vg[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: $e.count }, () => {
    const l = i + (a() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + a() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: $e.radius[0] + a() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...Yg(d, t, s) };
  });
}
function Zg(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += $e.step) {
      const r = Math.min(o + $e.step, a), i = Br(en(s, o), en(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function Xg(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((s) => {
    if (t < s.t) return [{ ...en(s, t), r: s.r, flying: !0 }];
    const a = t - s.t, o = 1 - Math.min(Math.max((a - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const r = s.on === "surface" ? n.find((d) => d.id === s.surface) : null;
    if (s.on === "surface" && !r) return [];
    const i = r ? r.left + s.dx : s.x, l = r ? r.top + s.dy : s.y, u = r ? Math.min(a * a * 12, 48, Math.max(0, r.bottom - l)) : ["left", "right"].includes(s.on) ? Math.min(a * a * 8, 32) : 0;
    return [{ x: i, y: l, r: s.r * (1 + 1.2 * Math.min(a / 0.1, 1)), flying: !1, on: s.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function Uk(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Se.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = _e(e, [0, u]), v = _e(e, [u, u + d]);
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
function zk(e, t, n, s, a) {
  const { sway: o, above: r } = Se.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (S) => {
    const [w, $] = [S.x - e.at.x, S.y - e.at.y];
    return { x: i.x + w * u - $ * d, y: i.y + w * d + $ * u };
  }, [v, y] = [...n].sort((S, w) => S.x - w.x), O = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: O.map((S, w) => ({ from: S, to: w < O.length / 2 ? v : y })) };
}
const Vk = (e, t) => _e(t, e.grows) * (1 - _e(t, e.sinks));
function Nn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: Qt(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: Qt(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Gk(e, t) {
  const n = Se[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Nn(n, t), r = 1 - (1 - n.small) * _e(s, n.shrinks) * (1 - _e(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Nn(n, t), o = n.flat * _e(s, n.squashes) * (1 - _e(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * Qt(a, ...n.springs)) * (1 - Qt(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const Kk = (e) => e === "pack_box";
function Yk(e) {
  const { into: t, out: n } = Nn(Se.rope_swing, e);
  return 1 - _e(t, [0, 1]) * (1 - _e(n, [0, 1]));
}
function Jk(e) {
  const t = Se.rope_swing, { into: n, out: s } = Nn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return _e(n, [0, 1]) * (1 - _e(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Qg = { after: 3 }, ga = 10, e0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, t0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, n0 = { weight: 19 }, Lr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, s0 = { every: 120 }, Dr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Nr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, a0 = {
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
}, dn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: ga }), te = (e, t, n = {}) => dn(e, "clip", t, n), fs = (e, t, n = {}) => dn(e, "look", t, n), ro = (e, t, n = {}) => dn(e, "gaze", t, n), fe = (e, t, n = {}, s = {}) => ({ ...dn(e, "pick", t, n), ...s }), ge = (e) => dn("nothing", "nothing", e, {}), o0 = 120, r0 = 300, ps = (e, t) => ({ ...te(e, t), cooldown: r0 }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), i0 = () => [te("joy", 2)], pt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), mt = (e) => ({ ...e, cooldown: e0[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: t0[e.name] }), Jn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...oe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...oe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...mt(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...mt(te("bug_smash", 2)), toward: "", onto: !1 },
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
  ...oe("reported", { cooldown: 90 }, [ro("read", 3), te("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...oe("read_message", { cooldown: 30 }, [ro("read", 3), ge(1)]),
  ...oe("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ge(6)]),
  ...oe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...oe("bar_done", { holds: !0 }, i0()),
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
  ...oe("pondering", { cooldown: [30, 60] }, [fe("ponder", 1)]),
  ...oe("thought_cloud", { cooldown: 90 }, [fe("cloud", 1)]),
  ...oe("light_bulb", { cooldown: 150 }, [fe("bulb", 1)]),
  ...oe("answered", { cooldown: 15 }, [fs("amused", 3), ge(2)]),
  ...oe("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...oe("long_walk", { cooldown: 90 }, [te("stumble", 3), ge(22)]),
  ...oe("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), ge(13)]),
  ...oe("typing", { cooldown: 60 }, [fs("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(a0).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [fs(t, 1)])),
  ...Object.entries(Dr).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Nr).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...oe("pastime", {}, [
    pt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    pt("rest", 3, 180, 120),
    pt("yawn", 2, 60, 60),
    pt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    pt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    pt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    pt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Wt(mt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(mt(te("disco", 2, { ball: "bubble" }))),
    ge(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...oe("held:search", { cooldown: o0 }, [ps("search", 3), { ...ps("binoculars", 2), when: { home: !0 } }, { ...ps("glass_bubble", 2), when: { bubble: !0 } }]),
  ...oe("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...oe("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...oe("spell", {}, [fe("writing", 12, { state: "writing" }), fe("reading", 12, { state: "reading" }), fe("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...oe("tickled", {}, [{ ...mt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...oe("eager", {}, [te("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...oe("jump", {}, [Wt(mt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...oe("climb", {}, [fe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...oe("unit", { cooldown: Lr.build.cooldown }, [fe("unit", n0.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...fe("hang", 1, { hands: !0, free: !0 }), cooldown: s0.every }, fe("stand", 5)]),
  // a digit a blow's dust lets out
  ...oe("digit", {}, [fe("0", 1), fe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...oe("roam", {}, [
    fe("rest", 35, {}, { stay: [25, 60] }),
    fe("seat", 15, {}, { stay: [15, 40] }),
    fe("edge", 25, {}, { stay: [8, 20] }),
    Wt(fe("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    fe("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    fe("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    fe("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    fe("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    fe("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Wt(mt(fe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...oe("laptop", {}, [fe("seat", 6, {}, { stay: [60, 150] }), fe("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...oe("ledge_at", {}, [fe("middle", 2, {}, { along: 1 / 2 }), fe("third", 1, {}, { along: 1 / 3 }), fe("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...oe("composed_as", {}, [
    fe("facing", 4, {}, { turn: 0, leans: 0 }),
    fe("turned_left", 1, {}, { turn: 335, leans: 0 }),
    fe("turned_right", 1, {}, { turn: 25, leans: 0 }),
    fe("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    fe("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Pr = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), jr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), l0 = (e) => Array.isArray(e) ? e[0] : e, c0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, u0 = (e) => Jn.some((t) => t.when.moment === e);
function d0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || jr(d).every(([f, v]) => n(f) >= l0(v)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Jn.filter((d) => Pr(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Qg.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = d0(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (qr(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function qr(e, t, n) {
  var s;
  for (const [a, o] of jr(t)) (s = e.memory) == null || s.set(a, e.now + c0(o, n));
}
function Zk(e, t, n) {
  qr(e, Jn.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const Xk = (e) => Object.values(Lr).find((t) => Pr(t.when, e)) ?? null, h0 = (e, t, n) => n - t <= (e.lifetime ?? ga), Qk = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Rr(e.clip, t));
class Fr {
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
}, eb = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Wr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), tb = {
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
}, nb = 120, f0 = 20, sb = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < f0), p0 = (e) => Ks[e] || Ks.idle, ab = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Hr = "airborne", m0 = "landing", g0 = "travelling", Ur = "grounded", ob = ({ airborne: e, landing: t, trip: n }) => e ? Hr : t ? m0 : n != null && n.started ? g0 : Ur;
function rb(e, t) {
  var a;
  const n = v0(e, t);
  return e.mode === Ur && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function v0(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: v = null } = e;
  if (n === Hr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...y0(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const y = v !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? v : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : p0(u), facing: y ? v : i.posture === "sit" ? i.face : f };
}
function y0(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const Ys = (e) => e.outcome, w0 = "plugin:code-commandments:sins:", io = (e) => e.type === "plugins.card" && e.markKey.startsWith(w0), k0 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => io(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => io(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], ib = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: Uo(n) })).sort((n, s) => n.time - s.time), lo = { user: "reacted", agent: "agent_reacted" };
function lb(e, t) {
  return e.filter((n) => lo[n.author] && kt(n) > t).map((n) => ({ beat: `${lo[n.author]}:${n.emoji}`, time: kt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const b0 = [.../* @__PURE__ */ new Set([...Object.values(Dr).flatMap((e) => Object.keys(e)), ...Object.keys(Nr)])];
function cb(e, t) {
  return e.filter((n) => n.author === "agent" && kt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = b0.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: kt(n), card: Uo(n) })).sort((n, s) => n.time - s.time);
}
const x0 = (e) => new Fr(e).isTest(), Pn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Ys(e)] || "";
}, $0 = 1800, M0 = (e, t) => {
  if (Pn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Pn(n) !== "finished" && Number(e.time) - Number(n.time) <= $0 ? "tests_fixed" : "tests_passed";
};
function ub(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(x0), a = s.filter((i) => Pn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Pn(i))), o.map((i) => ({ beat: M0(i, a), time: Number(i.time), card: i.key }));
}
function db(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Ys(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: Ys(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const hb = (e) => e.map((t) => {
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
function fb(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function pb(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function mb(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = k0.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function va(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const co = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function S0(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    va(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function gb(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : u0(`held:${e}`) ? "idle" : e;
}
const Ce = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function vb(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Ce.ahead * n ? 180 : Math.sign(s) * Ce.turn;
}
const uo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function yb(e, t) {
  const n = Math.min(Ce.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Ce.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Ce.lines, Math.floor((e.bottom - e.top - 2 * s) / Ce.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ce.sweep) % a, i = o % Ce.sweep, l = Ce.sweep - Ce.returnSeconds, u = uo((i - l) / Ce.returnSeconds), d = i <= l ? uo(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Ce.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const ho = 3, zr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, fo = 12, wb = (e, t) => ({ mood: e, began: t, seen: 0 });
function kb(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!zr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= ho ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * fo) / fo, lasts: ho } };
}
const bb = (e) => e.posture === "hang" && !zr(e.face), _0 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), E0 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function xb(e, t, n) {
  return _0.has(e) ? 1 / 0 : !E0.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Vr(n - t.began, t.share) - Xe.lead, 0);
}
const A0 = 5;
function $b(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= A0 ? { beat: "long_walk", time: n } : null };
}
const C0 = 30, xn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function Mb(e, t, n, s, a = null) {
  if (t && n < t.until || !xn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = xn.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + xn.every } : { state: e, began: 0, until: 0, next: n + xn.every };
}
const Sb = (e, t, n) => t && n < t.until && Wr.has(e.state) ? { state: t.state, since: t.began } : e, Xe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Vr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function _b(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = Vr(o, e.share);
  return a ? { eager: O0(t, r), moment: null } : r > Xe.lead ? { eager: t, moment: null } : r < Xe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Xe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Xe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function O0(e, t) {
  return e.on && t > Xe.lead + Xe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Xe.lead && t >= Xe.least ? { ...e, on: !0, calm: !1 } : e;
}
const T0 = 1, I0 = { look: "look", gaze: "gaze" };
function R0(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [I0[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const B0 = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), L0 = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > T0 * t, memory: s, now: a, room: o }, n).name === "backflip", D0 = { work: ["building"], idle: ["standing"] };
function Eb(e, t, n, s) {
  const a = Ks[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(D0[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), Wr.has(e) ? { moments: o, began: n || s } : (n && s - n >= C0 && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function N0(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const po = { pondering: N0 };
function Ab(e, t, n, s, a, o) {
  if (po[e.beat]) {
    const i = po[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = R0(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== ga && { lifetime: r.lifetime } } } : null;
}
function Cb(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = B0(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const Ob = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function Tb(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function Ib(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const Rb = (e, t) => !!(e != null && e.watches) && !t.once, Bb = 10, Lb = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || h0(s, s.queuedAt, n)), Db = (e, t) => t ? null : e[0] ?? null;
function Nb(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const Pb = (e, t) => !t.during || !e.some((n) => n.during === t.during), P0 = 2 * Math.PI, j0 = 500;
function jb(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / j0, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), v = P0 * r / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, S = (u ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !l ? a && !t.behind && !y.behind ? F0(y, t, n, v, a) : H0(y, t, n, v) : t) ?? y, w = S != null && S.behind && S.mood === "reading" ? q0(e.point, S, n, r, a) : S;
  return { point: w ?? null, toward: w ? { x: w.x - n.x, y: w.y - n.y } : null, amount: f, at: s };
}
function q0(e, t, n, s, a) {
  const o = (_) => _ * 180 / Math.PI, r = (_) => o(Math.atan2(Math.sin(_ * Math.PI / 180), Math.cos(_ * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), v = f ? r(e.readingFacing - i) : 0, y = f ? e.readingYaw + v : d, O = y + r(u - y), S = Math.min(Math.max(s / 1e3, 0), 0.1), w = Ce.turnSpeed * S, $ = f ? y + Math.min(Math.max(O - y, -w), w) : O, M = f ? e.readingFollow + v : $, z = M + ($ - M) * (1 - Math.exp(-S / Ce.followSeconds)), x = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, g = o(va(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), I = Math.min(Math.max(g, -x.up), x.down), A = Ce.tipSpeed * S, P = f ? e.readingPitch + Math.min(Math.max(I - e.readingPitch, -A), A) : I;
  return { ...t, readingYaw: $, readingFollow: z, readingPitch: P, readingFacing: i };
}
function F0(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (M) => {
    const { yaw: z, pitch: x } = va(M.x - n.x, a, n.y - M.y, o);
    return { yaw: z, pitch: Math.min(Math.max(x, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [co(i(e)), co(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [v, y] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [O, S, w] = l.map((M, z) => v * M + y * u[z]), $ = a * O / S;
  return { ...t, x: n.x + $, y: n.y - S0($, a, -Math.asin(Math.min(Math.max(w, -1), 1)), o) };
}
const W0 = 0.15;
function qb(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= W0;
}
function H0(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const U0 = (e) => !(e != null && e.on);
function Fb(e, t, n) {
  if (U0(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const tn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ke = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ms = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), mo = (e) => e * e * (3 - 2 * e);
function z0(e) {
  if (e < 0 || e >= Ke.seconds) return null;
  const t = ms(e, ...Ke.flicker), n = Math.floor(t * Ke.flickers * 2) % 2 === 0, s = e < Ke.flicker[1] ? n ? 0.35 + 0.5 * t : Ke.dim : 1;
  return { strength: 1 - mo(ms(e, ...Ke.fade)), lit: s, white: e < Ke.flash[0] ? 0 : 1 - mo(ms(e, ...Ke.flash)) };
}
const Wb = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Hb(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = z0(t - e.at);
  return s && { colour: tn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ke.signs[e.tone], ...s } };
}
function Ub(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function zb(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= tn.looks || s === null && n - e.since >= tn.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function Vb(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const ot = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, Gb = { behind: 39, figure: 40, ahead: 41 }, V0 = "[data-figure-pile]", G0 = { amber: [1, 0.69, 0.125], good: tn.colours.good, bad: tn.colours.bad }, Cn = { phases: 4, ms: 230, dim: 0.25 }, Kb = (e, t, n) => e !== "amber" || (t + n) % Cn.phases < Cn.phases / 2 ? 1 : Cn.dim, Yb = (e) => e === "amber" ? Cn.phases : 1;
function Jb(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const Zb = Object.keys(G0), He = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ht = ([e, t], n) => e + n() * (t - e);
function Xb(e) {
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
const gs = { high: 3, gap: 1 };
function Qb(e) {
  const t = Math.floor(e / gs.high);
  return { left: -(ot.inside + ot.width / 2 + t * (ot.width + gs.gap)), up: e % gs.high * (ot.height - ot.top) };
}
const K0 = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, Y0 = { after: 5 }, J0 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Fr(t).isBuild());
function e5(e, t, n) {
  const s = J0(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= Y0.after ? a : null;
}
function t5(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: K0(n, s, a) } : null;
}
const go = { ahead: 140, up: 70 };
function n5(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * go.ahead, y: s - go.up } } : o ? { at: { x: n(o), y: s - o.up - ot.height } } : t ? { at: null } : null;
}
const vs = { least: 4e3, most: 1e4 }, Z0 = (e) => vs.least + e() * (vs.most - vs.least), gt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function s5(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Z0(t);
    if (n.length >= gt.most || t() >= gt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (gt.at[0] + t() * (gt.at[1] - gt.at[0]));
    n.push({ from: o, to: o + gt.ms }), s = o + gt.ms;
  }
}
const a5 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), o5 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Gr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), r5 = new Set(Jn.filter((e) => Gr.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), X0 = (e) => e.some((t) => t.state === "built"), i5 = (e, t) => X0(t) ? e.filter((n) => !Gr.has(n.beat)) : e, lt = { reach: 40, room: 6 }, Q0 = (e, t) => t <= e - lt.reach + 2, l5 = (e, t, n) => Q0(e, n) ? t - lt.reach : e - lt.reach - lt.room, c5 = (e, t, n, s) => s > 0 && t < e && t + lt.reach >= e - 2 ? Math.min(n, Math.max(e, t + lt.reach)) : e, ys = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, u5 = (e) => Ht(e() < ys.longShare ? ys.long : ys.short, e), ev = 2 * ot.width;
function d5(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= ev ? o : e + (o - e + a / 2) % a;
}
const tv = 60, h5 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= tv, vo = "[data-figure-home]", hn = () => {
  var t;
  const e = document.querySelector(vo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(vo)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, nv = "[data-figure-docked-bars]", sv = "[data-figure-chat-foot]", av = [0.85, 0.6, 0.35, 0.15], ov = ["question", "waiting", "suggestion"], f5 = (e, t) => ov.find((n) => e[n] > 0 && t[n] === "behind") || null;
function p5() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const rv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", iv = "[data-figure-newest]";
function Kr() {
  var s, a;
  const e = (s = hn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(iv), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ya(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function nn(e, t, n = Kr()) {
  if (!e || !n) return !0;
  const s = tt(e, t), a = Xn(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ae.top * t.size, bottom: s.top + Ae.bottom * t.size }, r = yt.gap;
  return !Zn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function m5(e, t, n, s = Kr()) {
  if (!s || nn(t, e, s)) return null;
  const a = Xn(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = $t(), l = t.posture === "stand" ? ka * e.size : ni * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - yt.gap - r, s.right + yt.gap + o].map((v) => ({ ...t, x: v })).filter((v) => v.x >= u && v.x <= d && nn(v, e, s) && Dv(v, e)).sort((v, y) => Math.abs(v.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const ws = 0.26, Yr = 0.54, lv = 1.25 / 5.4, fn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ws, travels: "stand" },
  lounge: { drop: ws, travels: "stand" },
  composed: { drop: ws, travels: "stand" },
  hang: { drop: Yr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, g5 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * lv * Math.cos(t * Math.PI / 180),
  y: 1 - n - Yr
}), zt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), cv = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), v5 = (e, t) => (e === "sit" ? cv.has(t) : zt.has(e)) ? e : "stand";
function y5(e, t) {
  return e.facing === t.facing || !zt.has(e.posture) && !zt.has(t.posture) ? t : { posture: "stand", facing: zt.has(e.posture) ? e.facing : t.facing };
}
const w5 = 0.25, k5 = (e, t) => zt.has(e) && fn[t].drop === 0, Jr = 2, uv = 90, dv = 180, hv = 140, fv = 280, pv = 420, mv = 0.25, gv = 290, vv = 600, yv = "cubic-bezier(0.2, 0.7, 0.4, 1)", wv = "cubic-bezier(0.55, 0, 0.9, 0.6)", ks = 5;
function jn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ks) return null;
  (r || i) && (o = Math.max(o, Jr));
  const y = o > 1, O = Math.abs(t.x - e.x), S = O < ks ? 0 : O / (uv * o) * 1e3, w = Math.min(S, y ? hv : dv), $ = Math.abs(t.y - e.y), M = t.y < e.y, z = M && !v && L0($, n, l, u, d, f), x = M ? pv + Math.min($, 400) * mv : Math.sqrt(2 * $ / ma) * 1e3, g = {
    x: t.x,
    y: t.y,
    ms: $ > ks ? z ? vv : x : 0,
    lead: z ? gv : M ? fv : 0,
    easing: M ? yv : wv,
    hopping: !0,
    clip: z ? "backflip" : M ? "jump" : "fall"
  }, I = { x: t.x, y: t.y, ms: S + w, lead: 0, easing: "linear", ramp: w, ...y ? { clip: "run" } : {} }, A = v ? kv(t, n) : g, P = M && !s ? [{ ...I, y: e.y }, A] : [{ ...g, x: e.x }, I];
  return { way: Math.sign(t.x - e.x) || 1, legs: P, lands: !a, pace: o, running: y };
}
const kv = (e, t) => ({ x: e.x, y: e.y, ms: Se.pogo.frames / Se.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), bv = (e, t) => e.postures.includes(t) ? t : e.postures[0], b5 = (e, t, n) => e.posture === "walk" && n ? "walk" : bv(e.clip, t), tt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - fn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Zn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ya = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function $t() {
  var t;
  const e = (t = hn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const $n = 0.5, yo = 20;
function x5(e, t, n = $t()) {
  const s = tt(e, t);
  return s.left >= n.left + yo && s.right <= n.right - yo;
}
function wa(e, t, n = $t()) {
  const s = tt(e, t), a = s.right - s.left, o = Xn(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - $n && i <= n.right + $n && s.top >= n.top - $n && l <= n.bottom + $n;
}
const qn = [0.35, 0.5, 0.65], Fn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ae = { left: qn[0], right: qn.at(-1), top: Fn[0], bottom: Fn.at(-1) }, xv = 0.24;
function Xn(e) {
  if (e.posture === "stand") return { left: Ae.left, right: Ae.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + xv * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ae.left, t), right: Math.max(Ae.right, t) };
}
function $v(e, { size: t }, n = $t()) {
  const s = Xn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const ka = (Ae.right - Ae.left) / 2 + 0.08;
function $5(e, t) {
  return e === "hang" ? Ae : { ...Ae, bottom: Math.min(Ae.bottom, 1 - t - fn[e].drop) };
}
const Mv = "[data-figure-agent]";
function Zr(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !ya(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Xr = (e) => Fn.flatMap(
  (t) => qn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function ba(e, t, n = "") {
  if (!nn(e, t)) return qn.length * Fn.length;
  const s = tt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(rv)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && Zn(a, l) && ya(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return Xr(a).filter(([i, l]) => r(i, l) || Zr(i, l, n)).length;
}
function Sv(e, t) {
  const n = tt(e, t);
  return Xr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => Zr(s, a, "", Mv)).length;
}
const wo = 4;
function M5(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = wo; o <= a; o += wo)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!Sv(i, e) && nn(i, e)) return i;
    }
  return null;
}
function sn(e, t, n) {
  const s = $t(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => wa(r, t, s) && nn(r, t)).map((r) => ({ spot: r, covered: ba(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Qr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), _v = [0.5, 0.25, 0.75], Ev = (e) => Qr(e.getBoundingClientRect(), _v), ei = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Av = ka, Cv = (e, t, { size: n }, s = Av) => ti(e, ei[t], s * n, "stand");
function ti(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Ov = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, ni = 0.1, Tv = (e, t, { size: n }) => ti(e, Ov[t], ni * n, "sit"), Iv = (e) => ((e + 180) % 360 + 360) % 360 - 180, bs = 60;
function S5(e, t) {
  const n = Iv(t);
  return !e.aside || Math.abs(n) >= bs ? t : n < 0 ? 360 - bs : bs;
}
const Vt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Rv = (e) => [.../* @__PURE__ */ new Set([e, ...Vt.turns.map((t) => (t + 360) % 360)])];
function _5(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = Rv(t), r = Vt.every[0] + s() * (Vt.every[1] - Vt.every[0]);
  return { face: t, from: a ? Bv(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function Bv(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Vt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function E5(e, t) {
  const { element: n, edge: s } = Qn(), a = ["left", "right"].map((i) => pn(Tv(s, i, e), e)).filter((i) => n && wa(i, e) && !ba(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function A5(e, t, { size: n }) {
  const s = (Ae.right - Ae.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - si } : e;
}
const si = 7;
function ai() {
  const e = [...document.querySelectorAll(V0)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Lv(e, t) {
  const n = tt(e, t), s = n.right - n.left;
  return { left: n.left + Ae.left * s, right: n.left + Ae.right * s, top: n.top + Ae.top * s, bottom: n.bottom };
}
function Dv(e, t) {
  const n = ai();
  return !n || !Zn(Lv(e, t), n);
}
const Nv = 4;
function Qn() {
  const e = mn(), t = ai(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Nv || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - si - n, 0) } };
}
const C5 = ({ size: e, below: t }) => (1 - t) * e;
function pn(e, t) {
  const n = $t(), { size: s, below: a } = t, o = fn[e.posture].drop * s;
  return { ...$v(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Js = (e, t) => Object.keys(ei).map((n) => pn(Cv(e, n, t), t)), xa = (e, t) => Qr(e, av).map((n) => pn(n, t)), oi = (e, t, n) => sn(e, t, n) ?? e[0];
function O5(e, t) {
  const { element: n, edge: s } = Qn();
  return { ...oi(Js(s, e), e, t), view: null, on: n };
}
function T5(e, t, n, s) {
  const { element: a, edge: o } = Qn(), r = (s ? Js(o, t) : [...Js(o, t), ...xa(o, t)]).filter(
    (u) => !Zn(tt(u, t), e)
  ), i = sn(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !ba(i, t) ? i : sn(r, t, n);
  return l && { ...l, view: null, on: a };
}
function mn() {
  var s;
  const e = hn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(nv);
  if (!t) return { ...es(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const ko = { within: 2 };
function I5(e) {
  const { element: t, docked: n, edge: s } = mn();
  if (!n || e.on !== t) return !0;
  const a = es().edge;
  return s.left > a.left + ko.within || s.left + s.width < a.left + a.width - ko.within;
}
const Pv = "[data-figure-closing]";
function R5() {
  var n;
  const { element: e, docked: t } = mn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Pv));
}
const ri = "[data-figure-progress]";
function B5(e) {
  const t = e.querySelector(ri);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function L5(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const jv = { across: 300, above: 380, below: 60 };
function D5(e) {
  const { across: t, above: n, below: s } = jv;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: qv(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const qv = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), ii = "[data-figure-bar]", Zs = { back: 144, along: 0.4 };
function N5(e) {
  const { element: t, docked: n, edge: s } = mn(), a = n ? t.querySelector(ii) : null;
  if (!(a != null && a.querySelector(ri))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...pn({ x: o - Zs.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function P5(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < Zs.along * s.size ? t.x + Zs.along * s.size : e.x, y: e.y, behind: !0 };
}
function j5(e) {
  const t = e.querySelector(ii), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const s = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: s, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function es() {
  const e = hn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function q5(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = es(), l = n === null ? Fv(i, e, o === null ? t : { x: o, y: i.top }, s, a) : pn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function Fv(e, t, n, s, a) {
  const o = xa(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + ot.width < a && l.x + s - lt.reach - lt.room >= r);
  return sn(i.length ? i : o, t, n);
}
const Wv = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function F5(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  (o || r) && (a = Math.max(a, Jr));
  const y = (z) => {
    const x = tt(z, n, fn[z.posture].travels);
    return { x: x.left, y: x.top };
  }, O = t.ladder ?? e.ladder;
  if (O && !(t.ladder && e.ladder)) return Hv(y(e), y(t), y({ ...O.foot, posture: "stand" }), O.way, !!t.ladder, n, a);
  const [S, ...w] = [e, ...l, t].map(y), $ = jn(S, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: v }), M = w.slice(1).map((z, x) => {
    var g;
    return (g = jn(w[x], z, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : g.legs.find((I) => I.hopping);
  });
  return $ && { ...$, legs: [...$.legs, ...M.filter(Boolean)] };
}
function Hv(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Wv.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? jn(e, n, o.size, { pace: r }) : jn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function W5(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function H5(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && sn(Ev(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = Qn();
  return { ...oi(xa(a, t), t, n), view: null, on: s };
}
const Uv = "[data-figure-bubble]", zv = 250;
let Gt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), li = 0;
const Nt = () => Gt, xs = /* @__PURE__ */ new WeakMap();
let Vv = 0;
function $a(e) {
  return xs.has(e) || xs.set(e, `floor-${++Vv}`), xs.get(e);
}
const Gv = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Kv = () => {
  var e, t;
  return ((t = (e = hn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Yv(e, t) {
  var s;
  const n = (s = e.querySelector(sv)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Jv(e, t) {
  const n = e && Yv(e, t), s = e ? [...e.querySelectorAll(Uv)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Gv(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: $a(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Zv = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= zv ? (t.top - s.top) / a * 1e3 : 0;
};
function ci(e = Gt, t = performance.now()) {
  const n = $t(), s = Kv(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = mn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = es();
  return u.element && l.push({ id: $a(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Jv(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: Zv(e, d, t) }))) });
}
const Xs = /* @__PURE__ */ new Set();
function Xv(e) {
  return Xs.add(e), () => Xs.delete(e);
}
function Qv() {
  ui();
  const e = () => {
    li = requestAnimationFrame(e), !document.hidden && (Gt = ci(Gt), Xs.forEach((t) => t(Gt)));
  };
  e();
}
function ui() {
  cancelAnimationFrame(li);
}
const Ma = 5, ey = 56, ty = { share: 0.6 }, ny = (e) => -Math.sqrt(2 * ma * ty.share * e), Rt = (e, t) => e.find((n) => n.id === t) ?? null;
function U5(e, t = ci().floors) {
  const n = Rt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : $a(e.on) : null, o = a && Rt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function di({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Nt().floors) {
  const u = Rt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || sy(u, d, o)) && ay(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Sa = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, sy = (e, t, n) => !Sa({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function z5(e, t = Nt().floors) {
  if (!Sa(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= Ma && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function ay(e, t, n = Nt().floors) {
  const s = Rt(n, "home");
  return e.posture === "hang" && s && tt(e, t).bottom >= s.top ? !1 : wa(e, t);
}
function V5(e, t, n, s = Nt().floors) {
  const a = di(e, n, s);
  if (!e.home) return oy(e, t, a, s);
  if (!a) return null;
  const o = Rt(s, "home"), r = a.y - t.y, i = r > Ma ? "dropping" : -r > ey ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function oy(e, t, n, s) {
  const a = n ? Rt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: ny(e.risen) };
  if (!n) return null;
  if (Sa(t) && n.y - t.y > Ma) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function G5(e, t, n) {
  const s = ka * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function K5(e, t, n, s = Nt().floors) {
  const a = t && di(t, n, s);
  return a ? { ...e, ...a } : e;
}
const ry = ["data-kind"], iy = { class: "figure-floor-name" }, ly = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: xe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", iy, k(e.floor.kind), 1)
    ], 12, ry));
  }
}, cy = /* @__PURE__ */ K(ly, [["__scopeId", "data-v-8f6132da"]]), uy = {
  class: "figure-floors",
  "aria-hidden": "true"
}, dy = {
  __name: "FigureFloors",
  setup(e) {
    const t = Wn(Nt().floors);
    let n = () => {
    };
    return qe(() => {
      n = Xv((s) => t.value = s.floors), Qv();
    }), Re(() => {
      n(), ui();
    }), (s, a) => (c(), h("div", uy, [
      (c(!0), h(Y, null, se(t.value, (o) => (c(), G(cy, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Y5 = /* @__PURE__ */ K(dy, [["__scopeId", "data-v-e519168b"]]), $s = (e) => typeof e == "number" ? e : Date.parse(e);
function J5(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: $s(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => $s(a.row.created_at) - $s(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const hy = 3, Ms = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function fy(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Ms[n.grouping]) == null ? void 0 : s.call(Ms, e.row, n)) || "";
}
function py(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Z5(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= hy ? [py(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = fy(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const my = 1e3;
function X5() {
  const e = D(Date.now()), t = setInterval(() => e.value = Date.now(), my);
  return Lt(() => clearInterval(t)), e;
}
const Q5 = (e) => (t) => t.filter((n) => n.id !== e), e4 = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), t4 = (e) => (t) => [...t, e], n4 = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function s4(e) {
  const t = Hn(), n = D(null), s = D("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const Mn = /* @__PURE__ */ new Map();
function gy(e, t) {
  if (Mn.has(e)) return Mn.get(e);
  const n = t().finally(() => Mn.delete(e));
  return Mn.set(e, n), n;
}
function a4() {
  const e = Hn(), t = D(null), n = D("");
  async function s() {
    const a = await gy(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const vy = {
  class: "cards-page",
  "data-window-flush": ""
}, yy = { class: "cards-bar" }, wy = { class: "cards-count" }, ky = { class: "cards" }, by = {
  key: 1,
  class: "cards-note"
}, xy = {
  key: 2,
  class: "cards-note"
}, $y = ["data-row", "onClick"], My = { class: "card-head" }, Sy = { class: "card-age" }, _y = { class: "card-title" }, Ey = { class: "card-foot" }, Ay = {
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
    return (s, a) => (c(), h("div", vy, [
      m("div", yy, [
        m("span", wy, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        W(we, ct({
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
            ce(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", ky, [
        e.loaded ? e.failure ? (c(), h("p", by, k(e.failure), 1)) : e.rows.length ? E("", !0) : (c(), h("p", xy, "No " + k(e.noun) + "s yet", 1)) : (c(), G(Dt, {
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
          m("span", My, [
            W(ve, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ce(" " + k(e.head(o)), 1),
            m("span", Sy, k(U(Fs)(o.created_at)), 1)
          ]),
          m("span", _y, k(e.title(o)), 1),
          m("span", Ey, k(e.foot(o)), 1)
        ], 8, $y))), 128))
      ]),
      pe(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, o4 = /* @__PURE__ */ K(Ay, [["__scopeId", "data-v-d72d528d"]]), bo = "newest";
function r4(e, { title: t, isOpen: n = null }) {
  const s = D(""), a = D(bo), o = D("all"), r = B(() => {
    const l = s.value.trim().toLowerCase(), u = e.value.filter((d) => (!l || JSON.stringify(d).toLowerCase().includes(l)) && (o.value === "all" || !n || n(d) === (o.value === "open")));
    return a.value === bo ? u : [...u].sort((d, f) => t(d).localeCompare(t(f)));
  }), i = B(() => !!s.value.trim() || !!n && o.value !== "all");
  return { words: s, order: a, state: o, shown: r, filtering: i, hasStates: !!n };
}
const Cy = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Oy = 40, Ty = "top", Iy = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = Te(Be, null)) == null ? void 0 : f.autoScroll, a = B(() => s === Ty), o = D(null), r = D(!1), i = (v) => a.value ? v.scrollTop : v.scrollHeight - v.scrollTop - v.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= Oy;
    }
    return ke(() => n.rowCount, async () => {
      await on(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (v, y) => (c(), h("div", Cy, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        pe(v.$slots, "default", {}, void 0, !0)
      ], 34),
      W(Bt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: V(() => [
          ut(m("button", {
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
            [Ei, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, i4 = /* @__PURE__ */ K(Iy, [["__scopeId", "data-v-3accb764"]]), Ry = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, By = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Te(Be, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (c(), h("div", Ry, [
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
            ce(k(i.label) + " " + k(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, l4 = /* @__PURE__ */ K(By, [["__scopeId", "data-v-cf3bb39f"]]), Ly = {}, Dy = { class: "menu-label" };
function Ny(e, t) {
  return c(), h("span", Dy, [
    pe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Qs = /* @__PURE__ */ K(Ly, [["render", Ny], ["__scopeId", "data-v-aa955b3e"]]), Py = {
  class: "search-bar",
  "data-search-bar": ""
}, jy = { class: "search-bar-control" }, qy = ["value", "placeholder", "aria-label"], Fy = ["aria-expanded"], Wy = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var $;
    const s = e, a = n, o = Ai(), r = (($ = Te(Be, null)) == null ? void 0 : $.search) ?? {}, i = B(() => r.placeholder || s.placeholder), l = r.context ?? [], u = D(null), d = D(null), f = D([]), v = B(() => f.value.length ? f.value[f.value.length - 1].next : l), y = B(() => !!o.menu || l.length > 0), O = (M) => {
      f.value = [], d.value = d.value ? null : M.currentTarget;
    };
    function S(M) {
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
      var x;
      return c(), h("div", Py, [
        m("div", jy, [
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
            onKeydown: Kt(w, ["esc"])
          }, null, 40, qy),
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
          ], 8, Fy)) : E("", !0)
        ]),
        (x = U(r).button) != null && x.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: z[1] || (z[1] = (g) => a("pick", U(r).button.click))
        }, k(U(r).button.title), 1)) : E("", !0),
        pe(M.$slots, "default", {}, void 0, !0),
        d.value ? (c(), G(pa, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: z[3] || (z[3] = be(() => {
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
                ce("‹ " + k(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : E("", !0),
            (c(!0), h(Y, null, se(v.value, (g) => (c(), G(It, {
              key: g.title,
              description: g.subtext,
              "data-search-entry": g.title,
              onClick: (I) => S(g)
            }, {
              default: V(() => [
                ce(k(g.title) + k(g.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? E("", !0) : pe(M.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : E("", !0)
      ]);
    };
  }
}, Hy = /* @__PURE__ */ K(Wy, [["__scopeId", "data-v-5904a3de"]]), Uy = {
  class: "list-tools",
  "data-list-tools": ""
}, zy = {
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
    return (o, r) => (c(), h("div", Uy, [
      W(Hy, {
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
              ce(k(i.label), 1)
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
                ce(k(i.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : E("", !0)
        ]),
        default: V(() => [
          pe(o.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, c4 = /* @__PURE__ */ K(zy, [["__scopeId", "data-v-24c1740c"]]);
function u4() {
  const e = D(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Vy = 86400, ea = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Gy(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ea(t) - ea(e)) / Vy);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function d4(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ea(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Gy(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Ss = 280, _s = 240, Es = 120, Ky = 6, Yy = 14, an = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Jy(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function hi(e, t) {
  const n = Math.max(0, Jy(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function Zy(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Yy}px)` }), e.offsetHeight, e.style.transition = `height ${Ss}ms ${an}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1;
  const u = () => {
    n() && (t.scrollTop = hi(t, e));
    const d = a() - i;
    if (!l && d >= Ss && (l = !0, e.style.transition = `opacity ${_s}ms ease-out, transform ${_s}ms ${an}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), d < Ss + _s) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function h4(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Ky}px)` }), e.offsetHeight, e.style.transition = `opacity ${Es}ms ease-out, transform ${Es}ms ${an}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = hi(t, e)), a() - r < Es) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const Xy = 140, Sn = 220, Qy = 5;
function f4({ gap: e = Xy, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, Qy);
    if (s = i.length > 0, !s) return;
    let l = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), l -= 1, l || t(o, e);
      });
  }
  const r = (i, l, u, d = Zy) => {
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
function p4(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Sn}ms ${an}, opacity ${Sn}ms ease-in, margin ${Sn}ms ${an}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Sn);
}
const fi = "chat.pins.minimised", On = D(Yt(fi, !1));
function xo(e) {
  On.value = e, Un(fi, e);
}
function e2(e) {
  const t = B(() => e()), n = B(() => On.value ? [] : e()), s = () => xo(!On.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => kt(o) > a).length,
    (o, r) => o > r && xo(!1)
  ), { pins: t, visible: n, minimised: On, toggle: s };
}
const t2 = ["title"], n2 = {
  key: 0,
  class: "pins-count"
}, s2 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = e2(() => t.pinRows);
    return (o, r) => U(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: U(s), inline: e.inline }]),
      title: U(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = be((...i) => U(a) && U(a)(...i), ["stop"]))
    }, [
      W(ve, {
        name: U(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      U(s) ? (c(), h("span", n2, k(U(n).length), 1)) : E("", !0)
    ], 10, t2)) : E("", !0);
  }
}, m4 = /* @__PURE__ */ K(s2, [["__scopeId", "data-v-d073c504"]]), a2 = ["title"], o2 = ["title"], r2 = { class: "diff-card-dir" }, i2 = { class: "diff-card-name" }, l2 = { class: "diff-card-ago" }, c2 = ["title"], u2 = ["title"], d2 = {
  key: 0,
  class: "diff-card-note"
}, h2 = ["href"], f2 = ["src", "alt"], p2 = { class: "diff-card-rows" }, m2 = { class: "diff-row-num" }, g2 = { class: "diff-row-sign" }, v2 = { class: "diff-row-code" }, y2 = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = B(() => n.path.lastIndexOf("/") + 1), u = B(() => n.path.slice(0, l.value)), d = B(() => n.path.slice(l.value)), f = B(() => n.kind === "deleted"), v = B(() => r[n.kind]), y = B(() => new Set(n.rows.filter((T) => T.line_type === "add").map((T) => T.line))), O = D("after"), S = B(() => O.value === "before" ? n.whole.old : n.whole.text), w = B(() => n.whole && n.whole.text !== void 0 ? S.value.split(`
`).map((T, b) => ({ line_type: O.value === "after" && y.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: T })) : n.rows.filter(
      (T) => !(n.editsOnly && ["ctx", "fold"].includes(T.line_type)) && !(n.hideRemovals && T.line_type === "del")
    )), $ = D(!1), M = B(() => n.lines && !$.value && !n.whole), z = B(() => M.value ? w.value.slice(0, n.lines) : w.value), x = B(() => w.value.length - z.value.length), g = (T) => T.line === null || T.line_type === "del" ? "" : T.line, I = (T) => T.line_type === "fold" ? T.hidden ? `⋯ ${T.hidden} lines` : "⋯" : T.text, A = D(null), P = D(null);
    let _ = null;
    return qe(() => {
      if (!P.value) return;
      let T = !0;
      _ = new ResizeObserver(() => {
        !A.value || !P.value || (A.value.style.transition = T ? "none" : "", A.value.style.height = `${P.value.offsetHeight}px`, T = !1);
      }), _.observe(P.value);
    }), Re(() => _ && _.disconnect()), (T, b) => (c(), h("section", {
      class: J(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (p) => !f.value && s("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${U(a)}-click to open it`,
          onClick: o
        }, [
          m("span", r2, k(u.value), 1),
          m("span", i2, k(d.value), 1),
          v.value ? (c(), h("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, k(v.value), 3)) : E("", !0)
        ], 8, o2),
        m("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        m("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        m("span", l2, k(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: O.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = be((p) => O.value = O.value === "after" ? "before" : "after", ["stop"]))
        }, k(O.value === "after" ? "After" : "Before"), 9, c2)) : E("", !0),
        f.value ? E("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = be((p) => s("whole"), ["stop"]))
        }, [
          W(ve, {
            name: "file",
            size: 12
          })
        ], 10, u2))
      ], 8, a2),
      e.whole && e.whole.error ? (c(), h("p", d2, k(e.whole.error), 1)) : E("", !0),
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
          }, null, 8, f2)
        ], 8, h2)) : (c(), h("div", {
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
            m("div", p2, [
              (c(!0), h(Y, null, se(z.value, (p, R) => (c(), h("div", {
                key: R,
                class: J(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                m("span", m2, k(g(p)), 1),
                m("span", g2, k(i[p.line_type]), 1),
                m("span", v2, k(I(p)), 1)
              ], 2))), 128)),
              x.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = be((p) => $.value = !0, ["stop"]))
              }, k(x.value) + " more " + k(x.value === 1 ? "line" : "lines"), 1)) : E("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : E("", !0)
    ], 2));
  }
}, g4 = /* @__PURE__ */ K(y2, [["__scopeId", "data-v-b6424f6e"]]), w2 = {
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
}, Ye = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, k2 = {
  draft: [{ word: "ready", label: "Mark ready" }, Ye],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Ye],
  approved: [{ word: "start", label: "Start", main: !0 }, Ye],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ye],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ye],
  completed: [],
  cancelled: []
}, b2 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Ye],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Ye],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, Ye],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ye],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, x2 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], $2 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], M2 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], S2 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], _2 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], E2 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? _2(t) : e === "agent" ? [...M2(t), ...$2(t)] : e === "check" ? S2(t) : e === "question" ? x2(t) : ((n = { plan: k2, task: b2 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, A2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, C2 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, O2 = { class: "ask-text" }, T2 = ["placeholder", "aria-label"], I2 = ["placeholder", "aria-label"], R2 = {
  key: 3,
  class: "moves"
}, B2 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = B(() => E2(s.kind, s.row)), r = D(""), i = D(null), l = D(""), u = D("");
    ke(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(y, O = "") {
      const S = await s.read([y.noun ?? s.kind, y.word, String(s.id), ...y.flag ? [y.flag, O] : y.positional ? [O] : [], ...y.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = S.ok ? "" : S.error, S.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (y) => y.confirm ? i.value = y : y.said ? d(y, y.said) : y.flag || y.positional ? (i.value = y, l.value = "") : d(y), v = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (y, O) => {
      var S;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", A2, k(r.value), 1)) : E("", !0),
        (S = i.value) != null && S.confirm ? (c(), h("div", C2, [
          m("span", O2, k(i.value.confirm), 1),
          W(we, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: O[0] || (O[0] = (w) => d(i.value))
          }, {
            default: V(() => [
              ce(k(i.value.label), 1)
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
          onSubmit: be(v, ["prevent"])
        }, [
          ut(m("input", {
            "onUpdate:modelValue": O[2] || (O[2] = (w) => l.value = w),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: O[3] || (O[3] = Kt(be((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, T2), [
            [Ts, l.value]
          ]),
          i.value.opener ? ut((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": O[4] || (O[4] = (w) => u.value = w),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: O[5] || (O[5] = Kt(be((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, I2)), [
            [Ts, u.value]
          ]) : E("", !0),
          W(we, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: V(() => [
              ce(k(i.value.label), 1)
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
        ], 32)) : (c(), h("div", R2, [
          (c(!0), h(Y, null, se(o.value, (w) => (c(), G(we, {
            key: w.word,
            small: "",
            kind: w.main ? "primary" : "ghost",
            "data-move": w.word,
            onClick: ($) => f(w)
          }, {
            default: V(() => [
              ce(k(w.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : E("", !0);
    };
  }
}, L2 = /* @__PURE__ */ K(B2, [["__scopeId", "data-v-fffa0bf6"]]), D2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, N2 = { ...D2, done: "Completed" }, P2 = { class: "task-status-icon" }, j2 = ["width", "height", "aria-label"], q2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", P2, [
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
            "aria-label": U(N2)[e.status]
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
          ], 10, j2))
        ]),
        _: 1
      })
    ]));
  }
}, pi = /* @__PURE__ */ K(q2, [["__scopeId", "data-v-2ab7e404"]]), F2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), W2 = (e) => F2.has(e), mi = (e) => W2(e) ? "done" : e, H2 = { class: "facts" }, U2 = { class: "fact wide" }, z2 = { class: "fact-value" }, V2 = {
  key: 0,
  class: "fact"
}, G2 = { class: "fact-value" }, K2 = {
  key: 1,
  class: "fact"
}, Y2 = { class: "fact-value" }, J2 = { class: "fact wide" }, Z2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, X2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Bn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return c(), h("div", H2, [
        m("div", U2, [
          o[1] || (o[1] = m("span", { class: "fact-label" }, "Plan", -1)),
          m("span", z2, k((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", V2, [
          o[2] || (o[2] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", G2, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : E("", !0),
        e.task.state === "started" && e.task.holder_id ? (c(), h("div", K2, [
          o[3] || (o[3] = m("span", { class: "fact-label" }, "Holder", -1)),
          m("span", Y2, "Agent " + k(e.task.holder_id), 1)
        ])) : E("", !0),
        m("div", J2, [
          o[4] || (o[4] = m("span", { class: "fact-label" }, "Priority", -1)),
          W(l1, {
            options: U(n),
            value: String(U(yr)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (l) => s("priority", l))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", Z2, k(e.refusal), 1)) : E("", !0)
        ])
      ]);
    };
  }
}, Q2 = /* @__PURE__ */ K(X2, [["__scopeId", "data-v-2018762d"]]), ew = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, tw = ["onClick"], nw = { class: "wait-id" }, sw = { class: "wait-title" }, aw = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, ow = { class: "text" }, rw = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, iw = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, lw = 180, cw = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = D(!1);
    return (a, o) => (c(), h(Y, null, [
      e.task.waits.length ? (c(), h("section", ew, [
        o[1] || (o[1] = m("h4", null, "Waits on", -1)),
        (c(!0), h(Y, null, se(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          W(pi, {
            status: U(mi)(r.state),
            size: 12
          }, null, 8, ["status"]),
          m("span", nw, k(r.id), 1),
          m("span", sw, k(r.title), 1)
        ], 8, tw))), 128))
      ])) : E("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", aw, [
        o[2] || (o[2] = m("h4", null, "How it was done", -1)),
        m("p", ow, k(e.task.outcome), 1)
      ])) : E("", !0),
      e.task.brief ? (c(), h("section", rw, [
        o[3] || (o[3] = m("h4", null, "The brief", -1)),
        m("p", {
          class: J(["text", { clamped: !s.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > lw && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : E("", !0)
      ])) : E("", !0),
      e.task.logs.length ? (c(), h("section", iw, [
        o[4] || (o[4] = m("h4", null, "Log", -1)),
        (c(!0), h(Y, null, se(e.task.logs, (r) => (c(), h("p", {
          key: r.id,
          class: "log"
        }, k(r.line), 1))), 128))
      ])) : E("", !0)
    ], 64));
  }
}, uw = /* @__PURE__ */ K(cw, [["__scopeId", "data-v-f411ce35"]]), dw = { class: "comment-side-head" }, hw = {
  key: 0,
  class: "comment-none"
}, fw = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", dw, [
        n[1] || (n[1] = m("h3", null, "Comments", -1)),
        W(Gn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? E("", !0) : (c(), h("p", hw, "No comments yet")),
      (c(!0), h(Y, null, se(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, k(e.words(s)), 1))), 128))
    ], 2));
  }
}, pw = /* @__PURE__ */ K(fw, [["__scopeId", "data-v-19fdbdd4"]]), mw = ["data-comments-below"], gw = 600, vw = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = D(null), n = D(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < gw);
    return qe(() => s.observe(t.value)), Lt(() => s.disconnect()), (a, o) => (c(), h("div", {
      ref_key: "root",
      ref: t,
      class: J(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      pe(a.$slots, "default"),
      e.open ? (c(), G(pw, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : E("", !0)
    ], 10, mw));
  }
}, yw = /* @__PURE__ */ K(vw, [["__scopeId", "data-v-6c850df0"]]), ww = ["placeholder"], kw = { class: "actions" }, bw = { class: "error" }, xw = {
  key: 1,
  class: "card closed"
}, $w = { class: "mark" }, Mw = { class: "prompt" }, Sw = {
  key: 0,
  class: "draft"
}, _w = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Os({
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
  emits: /* @__PURE__ */ Os(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Cs(e, "draft"), r = Cs(e, "error"), i = D(!!r.value), l = D(!1), u = D(!1), d = D(null);
    async function f() {
      var S, w;
      i.value = !0, l.value = !1, await on(), (w = ((S = d.value) == null ? void 0 : S.querySelector("input")) || d.value) == null || w.focus();
    }
    function v() {
      i.value = !1, r.value = "";
    }
    function y(S) {
      S.shiftKey || S.isComposing || (S.preventDefault(), O());
    }
    async function O() {
      const S = o.value.trim();
      if (!(!S || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(S), i.value = !1, l.value = !0;
        } catch (w) {
          o.value = S, r.value = w.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (S, w) => (c(), h("div", {
      class: J(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: be(O, ["prevent"]),
        onKeydown: Kt(v, ["esc"])
      }, [
        pe(S.$slots, "who", {}, void 0, !0),
        ut(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": w[0] || (w[0] = ($) => o.value = $),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Kt(y, ["enter"])
        }, null, 40, ww), [
          [Ts, o.value]
        ]),
        m("div", kw, [
          m("span", bw, k(r.value), 1),
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
      ], 32)) : (c(), h("div", xw, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          m("span", $w, [
            W(ve, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", Mw, k(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", Sw, "Draft kept")) : E("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = ($) => a("show"))
        }, [
          m("span", null, k(U(C1)(e.count, "comment")), 1),
          W(ve, {
            name: "down",
            size: 12
          })
        ])) : E("", !0)
      ]))
    ], 2));
  }
}, Ew = /* @__PURE__ */ K(_w, [["__scopeId", "data-v-79db0c2d"]]);
function Aw(e, t) {
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
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const Cw = { class: "top" }, Ow = {
  class: "crumb",
  "data-task-crumb": ""
}, Tw = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Iw = {
  key: 1,
  class: "body"
}, Rw = { class: "stamp" }, Bw = {
  class: "title",
  "data-resource-title": ""
}, Lw = { class: "since" }, Dw = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Nw = { class: "text" }, Pw = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, jw = {
  key: 1,
  class: "note"
}, qw = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Fw = { class: "text" }, Ww = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = D(null), r = D(null), i = D(""), l = D(""), u = D(null), d = D(null), f = Aw(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (x) => s.read(x));
    ke(f.open, (x) => a("comments", x));
    let v = 0;
    const y = mi, O = (x) => x.slice(0, 1).toUpperCase() + x.slice(1), S = B(() => {
      var x;
      return (x = r.value) != null && x.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function w() {
      const x = ++v, [g, I] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      x === v && (i.value = g.ok ? "" : g.error, o.value = g.ok ? g.value : null, r.value = I.ok ? I.value : null);
    }
    ke(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, w();
    }, { immediate: !0 }), ke(() => s.changes, w);
    async function $(x) {
      const g = o.value.priority;
      o.value.priority = Number(x);
      const I = await s.read(["task", "edit", String(s.id), "--priority", x]);
      if (l.value = I.ok ? "" : I.error, I.ok) return w();
      o.value.priority = g;
    }
    function M(x) {
      u.value = null, d.value.press(x);
    }
    const z = (x) => {
      var g;
      return ((g = d.value) == null ? void 0 : g.moves.length) && (u.value = x);
    };
    return t({ openStatus: z }), (x, g) => (c(), h("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      m("div", Cw, [
        e.backed ? (c(), G(w2, {
          key: 0,
          onBack: g[0] || (g[0] = (I) => a("back"))
        })) : E("", !0),
        m("span", Ow, k(S.value), 1),
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
      i.value ? (c(), h("p", Tw, k(i.value), 1)) : o.value ? (c(), h(Y, { key: 2 }, [
        W(yw, {
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
                m("div", Rw, "Task " + k(o.value.id) + " · updated " + k(U(Fs)(U(Rs)(o.value)) || "just now"), 1),
                m("h3", Bw, k(o.value.title), 1),
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
                    W(pi, {
                      status: U(y)(o.value.state)
                    }, null, 8, ["status"]),
                    ce(" " + k(O(o.value.state)), 1)
                  ]),
                  m("span", Lw, "since " + k(U(Fs)(U(Rs)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (c(), h("section", Dw, [
                  g[10] || (g[10] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
                  m("p", Nw, k(o.value.reason || "Other tasks"), 1),
                  (I = o.value.openers) != null && I.length ? (c(), h("p", Pw, "Opens by itself when " + k(o.value.openers.join(" or ")) + ".", 1)) : (c(), h("p", jw, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (c(), h("section", qw, [
                  g[11] || (g[11] = m("span", { class: "label" }, "Why it was cancelled", -1)),
                  m("p", Fw, k(o.value.reason), 1)
                ])) : E("", !0),
                W(Q2, {
                  task: o.value,
                  place: r.value,
                  refusal: l.value,
                  onPriority: $
                }, null, 8, ["task", "place", "refusal"]),
                W(uw, {
                  task: o.value,
                  onSelect: g[5] || (g[5] = (A) => a("select", A))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        W(Ew, {
          send: U(f).send,
          count: U(f).comments.value.length,
          onShow: g[7] || (g[7] = (I) => U(f).open.value = !U(f).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", Iw, [
        W(Dt)
      ])),
      W(L2, {
        ref_key: "footer",
        ref: d,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: w
      }, null, 8, ["id", "row", "read"]),
      u.value ? (c(), G(pa, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: g[8] || (g[8] = (I) => u.value = null)
      }, {
        default: V(() => [
          W(Qs, null, {
            default: V(() => [
              ce("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(Y, null, se(d.value.moves, (I) => (c(), G(It, {
            key: I.word,
            onClick: (A) => M(I)
          }, {
            default: V(() => [
              ce(k(I.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : E("", !0)
    ], 2));
  }
}, v4 = /* @__PURE__ */ K(Ww, [["__scopeId", "data-v-c76befc4"]]);
function Hw(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var As = { exports: {} }, $o;
function Uw() {
  return $o || ($o = 1, (function(e, t) {
    var n = (function() {
      var s = function(g, I) {
        var A = 236, P = 17, _ = g, T = o[I], b = null, p = 0, R = null, L = [], q = {}, re = function(N, j) {
          p = _ * 4 + 17, b = (function(C) {
            for (var F = new Array(C), H = 0; H < C; H += 1) {
              F[H] = new Array(C);
              for (var X = 0; X < C; X += 1)
                F[H][X] = null;
            }
            return F;
          })(p), le(0, 0), le(p - 7, 0), le(0, p - 7), ee(), Q(), Le(N, j), _ >= 7 && Z(N), R == null && (R = gi(_, T, L)), Ve(R, j);
        }, le = function(N, j) {
          for (var C = -1; C <= 7; C += 1)
            if (!(N + C <= -1 || p <= N + C))
              for (var F = -1; F <= 7; F += 1)
                j + F <= -1 || p <= j + F || (0 <= C && C <= 6 && (F == 0 || F == 6) || 0 <= F && F <= 6 && (C == 0 || C == 6) || 2 <= C && C <= 4 && 2 <= F && F <= 4 ? b[N + C][j + F] = !0 : b[N + C][j + F] = !1);
        }, de = function() {
          for (var N = 0, j = 0, C = 0; C < 8; C += 1) {
            re(!0, C);
            var F = i.getLostPoint(q);
            (C == 0 || N > F) && (N = F, j = C);
          }
          return j;
        }, Q = function() {
          for (var N = 8; N < p - 8; N += 1)
            b[N][6] == null && (b[N][6] = N % 2 == 0);
          for (var j = 8; j < p - 8; j += 1)
            b[6][j] == null && (b[6][j] = j % 2 == 0);
        }, ee = function() {
          for (var N = i.getPatternPosition(_), j = 0; j < N.length; j += 1)
            for (var C = 0; C < N.length; C += 1) {
              var F = N[j], H = N[C];
              if (b[F][H] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? b[F + X][H + ae] = !0 : b[F + X][H + ae] = !1;
            }
        }, Z = function(N) {
          for (var j = i.getBCHTypeNumber(_), C = 0; C < 18; C += 1) {
            var F = !N && (j >> C & 1) == 1;
            b[Math.floor(C / 3)][C % 3 + p - 8 - 3] = F;
          }
          for (var C = 0; C < 18; C += 1) {
            var F = !N && (j >> C & 1) == 1;
            b[C % 3 + p - 8 - 3][Math.floor(C / 3)] = F;
          }
        }, Le = function(N, j) {
          for (var C = T << 3 | j, F = i.getBCHTypeInfo(C), H = 0; H < 15; H += 1) {
            var X = !N && (F >> H & 1) == 1;
            H < 6 ? b[H][8] = X : H < 8 ? b[H + 1][8] = X : b[p - 15 + H][8] = X;
          }
          for (var H = 0; H < 15; H += 1) {
            var X = !N && (F >> H & 1) == 1;
            H < 8 ? b[8][p - H - 1] = X : H < 9 ? b[8][15 - H - 1 + 1] = X : b[8][15 - H - 1] = X;
          }
          b[p - 8][8] = !N;
        }, Ve = function(N, j) {
          for (var C = -1, F = p - 1, H = 7, X = 0, ae = i.getMaskFunction(j), ne = p - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (b[F][ne - ye] == null) {
                  var Me = !1;
                  X < N.length && (Me = (N[X] >>> H & 1) == 1);
                  var ie = ae(F, ne - ye);
                  ie && (Me = !Me), b[F][ne - ye] = Me, H -= 1, H == -1 && (X += 1, H = 7);
                }
              if (F += C, F < 0 || p <= F) {
                F -= C, C = -C;
                break;
              }
            }
        }, Mt = function(N, j) {
          for (var C = 0, F = 0, H = 0, X = new Array(j.length), ae = new Array(j.length), ne = 0; ne < j.length; ne += 1) {
            var ye = j[ne].dataCount, Me = j[ne].totalCount - ye;
            F = Math.max(F, ye), H = Math.max(H, Me), X[ne] = new Array(ye);
            for (var ie = 0; ie < X[ne].length; ie += 1)
              X[ne][ie] = 255 & N.getBuffer()[ie + C];
            C += ye;
            var De = i.getErrorCorrectPolynomial(Me), Ne = u(X[ne], De.getLength() - 1), _a = Ne.mod(De);
            ae[ne] = new Array(De.getLength() - 1);
            for (var ie = 0; ie < ae[ne].length; ie += 1) {
              var Ea = ie + _a.getLength() - ae[ne].length;
              ae[ne][ie] = Ea >= 0 ? _a.getAt(Ea) : 0;
            }
          }
          for (var Aa = 0, ie = 0; ie < j.length; ie += 1)
            Aa += j[ie].totalCount;
          for (var ts = new Array(Aa), gn = 0, ie = 0; ie < F; ie += 1)
            for (var ne = 0; ne < j.length; ne += 1)
              ie < X[ne].length && (ts[gn] = X[ne][ie], gn += 1);
          for (var ie = 0; ie < H; ie += 1)
            for (var ne = 0; ne < j.length; ne += 1)
              ie < ae[ne].length && (ts[gn] = ae[ne][ie], gn += 1);
          return ts;
        }, gi = function(N, j, C) {
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
          return Mt(H, F);
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
              C = S(N);
              break;
            default:
              throw "mode:" + j;
          }
          L.push(C), R = null;
        }, q.isDark = function(N, j) {
          if (N < 0 || p <= N || j < 0 || p <= j)
            throw N + "," + j;
          return b[N][j];
        }, q.getModuleCount = function() {
          return p;
        }, q.make = function() {
          if (_ < 1) {
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
            _ = N;
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
          return x(C, C, function(X, ae) {
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
        }, vi = function(N) {
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
            return vi(j);
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
          for (var _ = M(g), T = function() {
            var Q = _.read();
            if (Q == -1) throw "eof";
            return Q;
          }, b = 0, p = {}; ; ) {
            var R = _.read();
            if (R == -1) break;
            var L = T(), q = T(), re = T(), le = String.fromCharCode(R << 8 | L), de = q << 8 | re;
            p[le] = de, b += 1;
          }
          if (b != I)
            throw b + " != " + I;
          return p;
        })(), P = 63;
        return function(_) {
          for (var T = [], b = 0; b < _.length; b += 1) {
            var p = _.charCodeAt(b);
            if (p < 128)
              T.push(p);
            else {
              var R = A[_.charAt(b)];
              typeof R == "number" ? (R & 255) == R ? T.push(R) : (T.push(R >>> 8), T.push(R & 255)) : T.push(P);
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
        ], I = 1335, A = 7973, P = 21522, _ = {}, T = function(b) {
          for (var p = 0; b != 0; )
            p += 1, b >>>= 1;
          return p;
        };
        return _.getBCHTypeInfo = function(b) {
          for (var p = b << 10; T(p) - T(I) >= 0; )
            p ^= I << T(p) - T(I);
          return (b << 10 | p) ^ P;
        }, _.getBCHTypeNumber = function(b) {
          for (var p = b << 12; T(p) - T(A) >= 0; )
            p ^= A << T(p) - T(A);
          return b << 12 | p;
        }, _.getPatternPosition = function(b) {
          return g[b - 1];
        }, _.getMaskFunction = function(b) {
          switch (b) {
            case r.PATTERN000:
              return function(p, R) {
                return (p + R) % 2 == 0;
              };
            case r.PATTERN001:
              return function(p, R) {
                return p % 2 == 0;
              };
            case r.PATTERN010:
              return function(p, R) {
                return R % 3 == 0;
              };
            case r.PATTERN011:
              return function(p, R) {
                return (p + R) % 3 == 0;
              };
            case r.PATTERN100:
              return function(p, R) {
                return (Math.floor(p / 2) + Math.floor(R / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(p, R) {
                return p * R % 2 + p * R % 3 == 0;
              };
            case r.PATTERN110:
              return function(p, R) {
                return (p * R % 2 + p * R % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(p, R) {
                return (p * R % 3 + (p + R) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + b;
          }
        }, _.getErrorCorrectPolynomial = function(b) {
          for (var p = u([1], 0), R = 0; R < b; R += 1)
            p = p.multiply(u([1, l.gexp(R)], 0));
          return p;
        }, _.getLengthInBits = function(b, p) {
          if (1 <= p && p < 10)
            switch (b) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + b;
            }
          else if (p < 27)
            switch (b) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + b;
            }
          else if (p < 41)
            switch (b) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + b;
            }
          else
            throw "type:" + p;
        }, _.getLostPoint = function(b) {
          for (var p = b.getModuleCount(), R = 0, L = 0; L < p; L += 1)
            for (var q = 0; q < p; q += 1) {
              for (var re = 0, le = b.isDark(L, q), de = -1; de <= 1; de += 1)
                if (!(L + de < 0 || p <= L + de))
                  for (var Q = -1; Q <= 1; Q += 1)
                    q + Q < 0 || p <= q + Q || de == 0 && Q == 0 || le == b.isDark(L + de, q + Q) && (re += 1);
              re > 5 && (R += 3 + re - 5);
            }
          for (var L = 0; L < p - 1; L += 1)
            for (var q = 0; q < p - 1; q += 1) {
              var ee = 0;
              b.isDark(L, q) && (ee += 1), b.isDark(L + 1, q) && (ee += 1), b.isDark(L, q + 1) && (ee += 1), b.isDark(L + 1, q + 1) && (ee += 1), (ee == 0 || ee == 4) && (R += 3);
            }
          for (var L = 0; L < p; L += 1)
            for (var q = 0; q < p - 6; q += 1)
              b.isDark(L, q) && !b.isDark(L, q + 1) && b.isDark(L, q + 2) && b.isDark(L, q + 3) && b.isDark(L, q + 4) && !b.isDark(L, q + 5) && b.isDark(L, q + 6) && (R += 40);
          for (var q = 0; q < p; q += 1)
            for (var L = 0; L < p - 6; L += 1)
              b.isDark(L, q) && !b.isDark(L + 1, q) && b.isDark(L + 2, q) && b.isDark(L + 3, q) && b.isDark(L + 4, q) && !b.isDark(L + 5, q) && b.isDark(L + 6, q) && (R += 40);
          for (var Z = 0, q = 0; q < p; q += 1)
            for (var L = 0; L < p; L += 1)
              b.isDark(L, q) && (Z += 1);
          var Le = Math.abs(100 * Z / p / p - 50) / 5;
          return R += Le * 10, R;
        }, _;
      })(), l = (function() {
        for (var g = new Array(256), I = new Array(256), A = 0; A < 8; A += 1)
          g[A] = 1 << A;
        for (var A = 8; A < 256; A += 1)
          g[A] = g[A - 4] ^ g[A - 5] ^ g[A - 6] ^ g[A - 8];
        for (var A = 0; A < 255; A += 1)
          I[g[A]] = A;
        var P = {};
        return P.glog = function(_) {
          if (_ < 1)
            throw "glog(" + _ + ")";
          return I[_];
        }, P.gexp = function(_) {
          for (; _ < 0; )
            _ += 255;
          for (; _ >= 256; )
            _ -= 255;
          return g[_];
        }, P;
      })();
      function u(g, I) {
        if (typeof g.length > "u")
          throw g.length + "/" + I;
        var A = (function() {
          for (var _ = 0; _ < g.length && g[_] == 0; )
            _ += 1;
          for (var T = new Array(g.length - _ + I), b = 0; b < g.length - _; b += 1)
            T[b] = g[b + _];
          return T;
        })(), P = {};
        return P.getAt = function(_) {
          return A[_];
        }, P.getLength = function() {
          return A.length;
        }, P.multiply = function(_) {
          for (var T = new Array(P.getLength() + _.getLength() - 1), b = 0; b < P.getLength(); b += 1)
            for (var p = 0; p < _.getLength(); p += 1)
              T[b + p] ^= l.gexp(l.glog(P.getAt(b)) + l.glog(_.getAt(p)));
          return u(T, 0);
        }, P.mod = function(_) {
          if (P.getLength() - _.getLength() < 0)
            return P;
          for (var T = l.glog(P.getAt(0)) - l.glog(_.getAt(0)), b = new Array(P.getLength()), p = 0; p < P.getLength(); p += 1)
            b[p] = P.getAt(p);
          for (var p = 0; p < _.getLength(); p += 1)
            b[p] ^= l.gexp(l.glog(_.getAt(p)) + T);
          return u(b, 0).mod(_);
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
        ], I = function(_, T) {
          var b = {};
          return b.totalCount = _, b.dataCount = T, b;
        }, A = {}, P = function(_, T) {
          switch (T) {
            case o.L:
              return g[(_ - 1) * 4 + 0];
            case o.M:
              return g[(_ - 1) * 4 + 1];
            case o.Q:
              return g[(_ - 1) * 4 + 2];
            case o.H:
              return g[(_ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return A.getRSBlocks = function(_, T) {
          var b = P(_, T);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + _ + "/errorCorrectionLevel:" + T;
          for (var p = b.length / 3, R = [], L = 0; L < p; L += 1)
            for (var q = b[L * 3 + 0], re = b[L * 3 + 1], le = b[L * 3 + 2], de = 0; de < q; de += 1)
              R.push(I(re, le));
          return R;
        }, A;
      })(), f = function() {
        var g = [], I = 0, A = {};
        return A.getBuffer = function() {
          return g;
        }, A.getAt = function(P) {
          var _ = Math.floor(P / 8);
          return (g[_] >>> 7 - P % 8 & 1) == 1;
        }, A.put = function(P, _) {
          for (var T = 0; T < _; T += 1)
            A.putBit((P >>> _ - T - 1 & 1) == 1);
        }, A.getLengthInBits = function() {
          return I;
        }, A.putBit = function(P) {
          var _ = Math.floor(I / 8);
          g.length <= _ && g.push(0), P && (g[_] |= 128 >>> I % 8), I += 1;
        }, A;
      }, v = function(g) {
        var I = a.MODE_NUMBER, A = g, P = {};
        P.getMode = function() {
          return I;
        }, P.getLength = function(b) {
          return A.length;
        }, P.write = function(b) {
          for (var p = A, R = 0; R + 2 < p.length; )
            b.put(_(p.substring(R, R + 3)), 10), R += 3;
          R < p.length && (p.length - R == 1 ? b.put(_(p.substring(R, R + 1)), 4) : p.length - R == 2 && b.put(_(p.substring(R, R + 2)), 7));
        };
        var _ = function(b) {
          for (var p = 0, R = 0; R < b.length; R += 1)
            p = p * 10 + T(b.charAt(R));
          return p;
        }, T = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return P;
      }, y = function(g) {
        var I = a.MODE_ALPHA_NUM, A = g, P = {};
        P.getMode = function() {
          return I;
        }, P.getLength = function(T) {
          return A.length;
        }, P.write = function(T) {
          for (var b = A, p = 0; p + 1 < b.length; )
            T.put(
              _(b.charAt(p)) * 45 + _(b.charAt(p + 1)),
              11
            ), p += 2;
          p < b.length && T.put(_(b.charAt(p)), 6);
        };
        var _ = function(T) {
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
        }, P.getLength = function(_) {
          return A.length;
        }, P.write = function(_) {
          for (var T = 0; T < A.length; T += 1)
            _.put(A[T], 8);
        }, P;
      }, S = function(g) {
        var I = a.MODE_KANJI, A = s.stringToBytesFuncs.SJIS;
        if (!A)
          throw "sjis not supported.";
        (function(T, b) {
          var p = A(T);
          if (p.length != 2 || (p[0] << 8 | p[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var P = A(g), _ = {};
        return _.getMode = function() {
          return I;
        }, _.getLength = function(T) {
          return ~~(P.length / 2);
        }, _.write = function(T) {
          for (var b = P, p = 0; p + 1 < b.length; ) {
            var R = (255 & b[p]) << 8 | 255 & b[p + 1];
            if (33088 <= R && R <= 40956)
              R -= 33088;
            else if (57408 <= R && R <= 60351)
              R -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + R;
            R = (R >>> 8 & 255) * 192 + (R & 255), T.put(R, 13), p += 2;
          }
          if (p < b.length)
            throw "illegal char at " + (p + 1);
        }, _;
      }, w = function() {
        var g = [], I = {};
        return I.writeByte = function(A) {
          g.push(A & 255);
        }, I.writeShort = function(A) {
          I.writeByte(A), I.writeByte(A >>> 8);
        }, I.writeBytes = function(A, P, _) {
          P = P || 0, _ = _ || A.length;
          for (var T = 0; T < _; T += 1)
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
      }, $ = function() {
        var g = 0, I = 0, A = 0, P = "", _ = {}, T = function(p) {
          P += String.fromCharCode(b(p & 63));
        }, b = function(p) {
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
        return _.writeByte = function(p) {
          for (g = g << 8 | p & 255, I += 8, A += 1; I >= 6; )
            T(g >>> I - 6), I -= 6;
        }, _.flush = function() {
          if (I > 0 && (T(g << 6 - I), g = 0, I = 0), A % 3 != 0)
            for (var p = 3 - A % 3, R = 0; R < p; R += 1)
              P += "=";
        }, _.toString = function() {
          return P;
        }, _;
      }, M = function(g) {
        var I = g, A = 0, P = 0, _ = 0, T = {};
        T.read = function() {
          for (; _ < 8; ) {
            if (A >= I.length) {
              if (_ == 0)
                return -1;
              throw "unexpected end of file./" + _;
            }
            var p = I.charAt(A);
            if (A += 1, p == "=")
              return _ = 0, -1;
            if (p.match(/^\s$/))
              continue;
            P = P << 6 | b(p.charCodeAt(0)), _ += 6;
          }
          var R = P >>> _ - 8 & 255;
          return _ -= 8, R;
        };
        var b = function(p) {
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
        var A = g, P = I, _ = new Array(g * I), T = {};
        T.setPixel = function(L, q, re) {
          _[q * A + L] = re;
        }, T.write = function(L) {
          L.writeString("GIF87a"), L.writeShort(A), L.writeShort(P), L.writeByte(128), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(255), L.writeByte(255), L.writeByte(255), L.writeString(","), L.writeShort(0), L.writeShort(0), L.writeShort(A), L.writeShort(P), L.writeByte(0);
          var q = 2, re = p(q);
          L.writeByte(q);
          for (var le = 0; re.length - le > 255; )
            L.writeByte(255), L.writeBytes(re, le, 255), le += 255;
          L.writeByte(re.length - le), L.writeBytes(re, le, re.length - le), L.writeByte(0), L.writeString(";");
        };
        var b = function(L) {
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
          for (var q = 1 << L, re = (1 << L) + 1, le = L + 1, de = R(), Q = 0; Q < q; Q += 1)
            de.add(String.fromCharCode(Q));
          de.add(String.fromCharCode(q)), de.add(String.fromCharCode(re));
          var ee = w(), Z = b(ee);
          Z.write(q, le);
          var Le = 0, Ve = String.fromCharCode(_[Le]);
          for (Le += 1; Le < _.length; ) {
            var Mt = String.fromCharCode(_[Le]);
            Le += 1, de.contains(Ve + Mt) ? Ve = Ve + Mt : (Z.write(de.indexOf(Ve), le), de.size() < 4095 && (de.size() == 1 << le && (le += 1), de.add(Ve + Mt)), Ve = Mt);
          }
          return Z.write(de.indexOf(Ve), le), Z.write(re, le), Z.flush(), ee.toByteArray();
        }, R = function() {
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
      }, x = function(g, I, A) {
        for (var P = z(g, I), _ = 0; _ < I; _ += 1)
          for (var T = 0; T < g; T += 1)
            P.setPixel(T, _, A(T, _));
        var b = w();
        P.write(b);
        for (var p = $(), R = b.toByteArray(), L = 0; L < R.length; L += 1)
          p.writeByte(R[L]);
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
  })(As)), As.exports;
}
var zw = Uw();
const Vw = /* @__PURE__ */ Hw(zw), Gw = ["width", "height", "viewBox"], Kw = ["width", "height"], Yw = ["d"], Jw = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = B(() => {
      const s = Vw(0, "M");
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
      }, null, 8, Kw),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Yw)
    ], 8, Gw));
  }
}, y4 = /* @__PURE__ */ K(Jw, [["__scopeId", "data-v-489f0852"]]), w4 = Ci(() => import("./VoiceFigure-Cy4BnWo9.js").then((e) => e.V)), k4 = "1.0.0", b4 = "3.5";
export {
  cl as $,
  Se as A,
  Ae as B,
  R5 as C,
  Zn as D,
  tt as E,
  T5 as F,
  Cv as G,
  bb as H,
  E5 as I,
  Dv as J,
  $t as K,
  cv as L,
  ka as M,
  Wv as N,
  Lv as O,
  Jn as P,
  Gb as Q,
  eb as R,
  Cn as S,
  Xb as T,
  Vk as U,
  _e as V,
  Nn as W,
  zk as X,
  Uk as Y,
  ll as Z,
  K as _,
  Dk as a,
  m5 as a$,
  qv as a0,
  tb as a1,
  nb as a2,
  Be as a3,
  fb as a4,
  hb as a5,
  kt as a6,
  sb as a7,
  Sb as a8,
  Sk as a9,
  i5 as aA,
  Ub as aB,
  X0 as aC,
  Cb as aD,
  Ob as aE,
  I5 as aF,
  Jr as aG,
  Zb as aH,
  hn as aI,
  Tk as aJ,
  Ak as aK,
  b5 as aL,
  fn as aM,
  S5 as aN,
  kb as aO,
  zb as aP,
  Vb as aQ,
  Hb as aR,
  tn as aS,
  yt as aT,
  _k as aU,
  Wg as aV,
  Fb as aW,
  Xk as aX,
  Kr as aY,
  Rt as aZ,
  Nt as a_,
  g5 as aa,
  $5 as ab,
  Bk as ac,
  Gk as ad,
  Kk as ae,
  ub as af,
  db as ag,
  pb as ah,
  qk as ai,
  vo as aj,
  ab as ak,
  Mb as al,
  D5 as am,
  Nb as an,
  Lb as ao,
  Bb as ap,
  mb as aq,
  lb as ar,
  ib as as,
  cb as at,
  Jb as au,
  $b as av,
  _b as aw,
  j5 as ax,
  zt as ay,
  Eb as az,
  Qv as b,
  P5 as b$,
  Sv as b0,
  M5 as b1,
  t5 as b2,
  e5 as b3,
  h0 as b4,
  Lr as b5,
  h5 as b6,
  xb as b7,
  es as b8,
  ot as b9,
  s5 as bA,
  c5 as bB,
  lt as bC,
  Qb as bD,
  u5 as bE,
  Ab as bF,
  Pb as bG,
  Tb as bH,
  Ce as bI,
  wb as bJ,
  d5 as bK,
  G5 as bL,
  K5 as bM,
  $k as bN,
  zg as bO,
  vb as bP,
  a5 as bQ,
  Nk as bR,
  L5 as bS,
  n5 as bT,
  o5 as bU,
  r5 as bV,
  gb as bW,
  Q0 as bX,
  yb as bY,
  Rb as bZ,
  B5 as b_,
  l5 as ba,
  gs as bb,
  Uo as bc,
  F5 as bd,
  U5 as be,
  Yb as bf,
  k5 as bg,
  Mk as bh,
  Db as bi,
  W5 as bj,
  ob as bk,
  rb as bl,
  Wk as bm,
  Qk as bn,
  Ok as bo,
  y5 as bp,
  Pk as bq,
  jk as br,
  Hk as bs,
  qb as bt,
  Ng as bu,
  _5 as bv,
  Bv as bw,
  Fk as bx,
  Ik as by,
  jb as bz,
  ze as c,
  fk as c$,
  Ck as c0,
  Ek as c1,
  Ib as c2,
  z5 as c3,
  Sa as c4,
  V5 as c5,
  di as c6,
  w5 as c7,
  Jk as c8,
  Yk as c9,
  uk as cA,
  c4 as cB,
  Us as cC,
  yk as cD,
  Fm as cE,
  It as cF,
  Qs as cG,
  pa as cH,
  ak as cI,
  dk as cJ,
  Ji as cK,
  m4 as cL,
  rk as cM,
  y4 as cN,
  o4 as cO,
  xl as cP,
  Qw as cQ,
  kk as cR,
  Hy as cS,
  l1 as cT,
  hk as cU,
  Dt as cV,
  mk as cW,
  ek as cX,
  oa as cY,
  v4 as cZ,
  pi as c_,
  Fg as ca,
  Rk as cb,
  Iv as cc,
  Wb as cd,
  va as ce,
  G0 as cf,
  Kb as cg,
  Vt as ch,
  Tt as ci,
  nk as cj,
  i4 as ck,
  we as cl,
  Gn as cm,
  sk as cn,
  lh as co,
  g4 as cp,
  xk as cq,
  Tn as cr,
  Y5 as cs,
  Xw as ct,
  Xt as cu,
  ck as cv,
  ve as cw,
  l4 as cx,
  k4 as cy,
  b4 as cz,
  d0 as d,
  rt as d0,
  pk as d1,
  w4 as d2,
  t4 as d3,
  of as d4,
  Fs as d5,
  f4 as d6,
  h4 as d7,
  p4 as d8,
  bk as d9,
  a4 as dA,
  Hn as dB,
  d4 as dC,
  wk as da,
  vk as db,
  Z5 as dc,
  t1 as dd,
  lk as de,
  J5 as df,
  Bm as dg,
  tk as dh,
  ik as di,
  e4 as dj,
  n4 as dk,
  Ze as dl,
  ok as dm,
  Q5 as dn,
  gk as dp,
  wt as dq,
  gy as dr,
  r4 as ds,
  X5 as dt,
  u4 as du,
  I1 as dv,
  e2 as dw,
  Ar as dx,
  s4 as dy,
  Q1 as dz,
  We as e,
  Dg as f,
  Zk as g,
  q5 as h,
  nn as i,
  A5 as j,
  H5 as k,
  v5 as l,
  C5 as m,
  ay as n,
  x5 as o,
  Lk as p,
  ba as q,
  ci as r,
  ui as s,
  Fe as t,
  O5 as u,
  p0 as v,
  N5 as w,
  f5 as x,
  p5 as y,
  mn as z
};
