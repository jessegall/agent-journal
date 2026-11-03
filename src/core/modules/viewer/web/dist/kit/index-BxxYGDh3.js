/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as he, createElementVNode as p, normalizeClass as J, Fragment as Y, renderList as se, normalizeStyle as pe, defineComponent as Ti, Comment as Ii, h as sa, cloneVNode as Ri, createBlock as G, withCtx as U, unref as V, createVNode as P, toDisplayString as k, createCommentVNode as S, inject as Te, computed as R, resolveDynamicComponent as xt, Transition as Bt, watch as be, ref as D, shallowRef as Wn, createTextVNode as ce, TransitionGroup as To, mergeProps as ut, reactive as aa, onMounted as Be, onUnmounted as Ie, nextTick as Lt, useId as Io, Teleport as oa, withModifiers as xe, isRef as Ta, onBeforeUnmount as Dt, resolveComponent as Bi, resolveDirective as Li, withDirectives as dt, useAttrs as ra, useModel as Ts, getCurrentInstance as Di, mergeModels as Is, getCurrentScope as Ro, onScopeDispose as Bo, provide as Ni, onErrorCaptured as Pi, toHandlers as ji, createSlots as qi, vShow as Fi, useSlots as Wi, withKeys as Gt, vModelText as Rs, defineAsyncComponent as Hi } from "vue";
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Ui = { class: "skeleton-line" }, zi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Ui, [
      he(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(Y, null, se(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: pe({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ft = /* @__PURE__ */ K(zi, [["__scopeId", "data-v-0ebb6933"]]), Hn = Ti({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Ii);
      return s.length !== 1 ? sa(Y, { key: n }, s) : s[0].key == null ? Ri(s[0], { key: n }) : s[0];
    };
  }
}), Vi = ["aria-label"], Gi = ["aria-label"], Ki = ["aria-label"], Yi = ["aria-label"], Ji = ["aria-label"], Zi = ["aria-label"], Xi = ["aria-label"], Qi = {
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
    return (l, u) => (c(), G(Hn, { value: e.shape }, {
      messages: U(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(Y, null, se(t, (d) => p("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: pe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, Vi)
      ]),
      older: U(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: pe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, Gi)
      ]),
      cards: U(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(Y, null, se(n, (f) => P(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ki)
      ]),
      file: U(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            P(ft, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(Y, null, se(a, (f) => P(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Yi)
      ]),
      page: U(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          P(ft, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            bars: V(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ji)
      ]),
      text: U(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            bars: V(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Zi)
      ]),
      default: U(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Xi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, rn = /* @__PURE__ */ K(Qi, [["__scopeId", "data-v-1392eacb"]]), el = {
  key: 1,
  class: "empty-state titled"
}, tl = { class: "empty-state-title" }, nl = { class: "empty-state-text" }, sl = {
  key: 2,
  class: "empty-state"
}, al = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(rn, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", el, [
      p("p", tl, k(e.title), 1),
      p("p", nl, [
        he(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", sl, [
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, In = /* @__PURE__ */ K(al, [["__scopeId", "data-v-b27e89b0"]]), ol = { class: "fold-group" }, rl = ["aria-expanded"], il = { class: "fold-label" }, ll = {
  key: 0,
  class: "fold-count"
}, cl = {
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
    return (s, a) => (c(), h("div", ol, [
      p("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", il, k(e.label), 1),
        e.count !== "" ? (c(), h("span", ll, k(e.count), 1)) : S("", !0),
        p("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, rl),
      e.open ? he(s.$slots, "default", {}, void 0, !0, 0) : S("", !0)
    ]));
  }
}, _k = /* @__PURE__ */ K(cl, [["__scopeId", "data-v-9ef1865c"]]), ul = Symbol("open-view"), Le = Symbol.for("journal.window-context");
function Un() {
  const e = Te(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const dl = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: pe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, hl = /* @__PURE__ */ K(dl, [["__scopeId", "data-v-eb453d6f"]]), fl = {
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
      return t.busy || t.disabled || !!((s = Te(Le, null)) != null && s.readOnly);
    });
    return (s, a) => (c(), G(xt(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: J(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
      default: U(() => [
        p("span", {
          class: J(["btn-label", { hidden: e.busy }])
        }, [
          he(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (c(), G(hl, {
          key: 0,
          class: "btn-spinner"
        })) : S("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ke = /* @__PURE__ */ K(fl, [["__scopeId", "data-v-a2dc4bda"]]), ml = {
  class: "running",
  "data-running-command": ""
}, pl = ["title"], gl = {
  key: "idle",
  class: "running-idle"
}, vl = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", ml, [
      P(Bt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: U(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, pl)) : (c(), h("span", gl, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Ek = /* @__PURE__ */ K(vl, [["__scopeId", "data-v-d3240219"]]), yl = ["aria-checked", "aria-label", "title"], wl = {
  key: 0,
  class: "switch-inner"
}, kl = {
  key: 0,
  class: "switch-word"
}, bl = {
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
      p("span", {
        class: J(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", wl, k(e.word), 1)) : S("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", kl, k(e.word), 1)) : S("", !0)
    ], 10, yl));
  }
}, Ak = /* @__PURE__ */ K(bl, [["__scopeId", "data-v-1bfb90f3"]]);
function Lo(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Kt(e, t) {
  return Lo(() => localStorage, e, t);
}
function Do(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function zn(e, t) {
  return Do(() => localStorage, e, t);
}
function No(e, t) {
  be(t, (n) => zn(e, n), { deep: !0 });
}
function xl(e, t) {
  return Lo(() => sessionStorage, e, t);
}
function $l(e, t) {
  return Do(() => sessionStorage, e, t);
}
const Rn = "journal.environment", Po = D(xl(Rn, Kt(Rn, "")));
function Ml(e) {
  Po.value = e, $l(Rn, e), zn(Rn, e);
}
const Bn = D(location.hash), Ia = Wn(null), Ra = { integrations: "mcp", library: "team" };
function Sl() {
  if (!Ia.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ra[n]) {
    location.replace(`#/${[Ra[n], ...s].join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash;
    return;
  }
  !n || Ia.value(n) || (Ml(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Bn.value = location.hash, Sl();
});
const Ze = R(() => {
  const [e, t = ""] = Bn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: Po.value,
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
}), Vn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Vn.page(e)}?open=${t}`
};
function _l(e = "", t = 0, n = "") {
  location.hash = Vn.page(e, t, n);
}
const El = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function jo(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(El).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ot = {};
function Ck(e, t) {
  return Ot[e] = t, () => Ot[e] === t && delete Ot[e];
}
function qo(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Ot[e]) != null && r.call(Ot, t))) return;
  const a = Ze.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  jo([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Al(e, t, n, s = 0, a = "") {
  if (e === Ze.value.env) return qo(t, n, s, a);
  const o = Ze.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  jo([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Xe(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Al(s, a, Number(o), 0, t) : qo(a, Number(o), 0, t);
}
function Cl(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ct(e) {
  const t = Cl(e);
  t && Xe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Gn = typeof document < "u" && document.documentElement.classList.contains("phone"), Ol = "Files are attached on the computer; the phone sends text.", ss = [
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
}), ln = {
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
    filters: ss
  }),
  tasks: ge("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: ss
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
  pins: ge("Pin", "band", "One line pinned to the chat while it matters", { filters: ss }),
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
}, Tl = ["secrets", "plugins"], Fo = Object.keys(ln).filter((e) => !(Gn && Tl.includes(e)));
R(() => Fo.map((e) => ({ name: e, ...ln[e] })));
const cn = (e) => ln[e], Wo = new Map(Fo.flatMap((e) => [e, e.replace(/s$/, ""), ln[e].title.toLowerCase()].map((t) => [t, e]))), kt = (e) => Wo.get(String(e).toLowerCase()) || "", Ho = [...Wo.keys()].sort((e, t) => t.length - e.length).join("|"), Il = ["stroke-width", "innerHTML"], ye = {
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
      style: pe({
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
    }, null, 12, Il));
  }
}, Kn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), G(ke, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: U(() => [
        P(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Rl = {
  key: 1,
  class: "row-list-failure"
}, Bl = ["data-row"], Ll = {
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
    return (o, r) => !e.loaded && !e.failure ? (c(), G(rn, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Rl, k(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(In, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: U(() => [
        ce(k(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(Y, { key: 3 }, [
      (c(), G(xt(e.arrival ? To : "ul"), ut(n.value, { class: "row-list" }), {
        default: U(() => [
          (c(!0), h(Y, null, se(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            he(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Bl))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : S("", !0)
    ], 64));
  }
}, Dl = /* @__PURE__ */ K(Ll, [["__scopeId", "data-v-aa6ad7ff"]]), Nl = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Pl = {
  key: 1,
  class: "agent-rows-note"
}, jl = {
  key: 2,
  class: "agent-rows-note"
}, ql = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Fl = ["data-agent-row", "onClick"], Wl = { class: "agent-row-name" }, Hl = { class: "agent-row-state" }, Ul = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = R(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Nl, [
      e.loaded ? e.failure ? (c(), h("p", Pl, k(e.failure), 1)) : e.rows.length ? (c(), h(Y, { key: 3 }, [
        p("p", ql, k(s.value) + " running", 1),
        (c(!0), h(Y, null, se(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => V(Xe)(`agents:${r.id}`)
        }, [
          p("span", Wl, "#" + k(r.id) + " " + k(r.session), 1),
          p("span", Hl, k(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Fl))), 128))
      ], 64)) : (c(), h("p", jl, k(e.none), 1)) : (c(), G(rn, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Ok = /* @__PURE__ */ K(Ul, [["__scopeId", "data-v-a01e5a17"]]), zl = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["badge", e.tone])
    }, k(e.text), 3));
  }
}, Uo = /* @__PURE__ */ K(zl, [["__scopeId", "data-v-9e7e1157"]]), Vl = ["aria-valuenow", "aria-valuemax"], Gl = {
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
      p("span", {
        class: "fill",
        style: pe({ width: n.value })
      }, null, 4)
    ], 10, Vl));
  }
}, Kl = /* @__PURE__ */ K(Gl, [["__scopeId", "data-v-9eba6a85"]]), Yl = { class: "bars" }, Jl = { class: "bar-name" }, Zl = { class: "bar-value" }, Xl = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", Yl, [
      (c(!0), h(Y, null, se(e.items, (l, u) => (c(), G(xt(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: J(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: U(() => [
          p("span", Jl, k(l.label), 1),
          P(Kl, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", Zl, k(l.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Ql = /* @__PURE__ */ K(Xl, [["__scopeId", "data-v-663427f4"]]), ec = { class: "bars" }, tc = {
  key: 0,
  class: "bars-title"
}, nc = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", ec, [
      e.node.title ? (c(), h("span", tc, k(e.node.title), 1)) : S("", !0),
      P(Ql, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, sc = /* @__PURE__ */ K(nc, [["__scopeId", "data-v-7135bb11"]]), ac = {
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
      style: pe(o.value)
    }, [
      (c(!0), h(Y, null, se(e.node.children || [], (l, u) => (c(), G(wr, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, En = /* @__PURE__ */ K(ac, [["__scopeId", "data-v-d142a3f4"]]), oc = {
  key: 0,
  class: "card-head"
}, rc = { class: "card-title" }, ic = {
  key: 0,
  class: "card-note"
}, lc = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", oc, [
        p("span", rc, k(e.node.title), 1),
        e.node.note ? (c(), h("span", ic, k(e.node.note), 1)) : S("", !0)
      ])) : S("", !0),
      P(En, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, cc = /* @__PURE__ */ K(lc, [["__scopeId", "data-v-67b72d40"]]), uc = (e) => "task_ids" in e, zo = 1024, dc = zo * 1024 * 1024, hc = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${zo} MB limit for one file.`;
function fc() {
  return () => {
  };
}
function Ba(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function mc(e = window) {
  if (!Ba(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ba(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Bs = "journal.stale-build-reload", pc = 'script[type="module"][src*="/assets/index-"]', La = (e) => {
  var t;
  return ((t = e.querySelector(pc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function gc(e = document, t = fetch, n = () => mc(window)) {
  const s = La(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = La(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
const vc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function yc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Bs) === e.message) return !1;
    t.setItem(Bs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function wc(e = window.sessionStorage) {
  try {
    e.removeItem(Bs);
  } catch {
    return;
  }
}
const kc = 2e3, bc = 3e4, Ue = aa({ starting: !1, external: !1, late: !1, offline: !1 }), ia = () => Ue.starting;
let Ls = 0, Vo = 0, Go = [];
async function xc() {
  try {
    const e = await qe.serverState();
    return e.ok ? await e.json() : { restarting: !1, updating: !1 };
  } catch {
    return { restarting: !0, updating: Ue.external };
  }
}
function $c() {
  clearInterval(Ls), clearTimeout(Vo), Ls = 0, Object.assign(Ue, { starting: !1, external: !1, late: !1, offline: !1 }), Go.splice(0).forEach((e) => e()), gc();
}
let as = !1;
async function Mc() {
  if (Ue.offline = !navigator.onLine, as) return;
  as = !0;
  const e = await xc();
  as = !1, Ue.external = e.updating, !e.restarting && !e.updating && $c();
}
function Da() {
  Ue.starting || (Ue.starting = !0, Ue.offline = !navigator.onLine, Ls = setInterval(Mc, kc), Vo = setTimeout(() => Ue.late = !0, bc));
}
const Sc = () => Ue.starting ? new Promise((e) => Go.push(e)) : Promise.resolve(), Na = 2e4, _c = 3e5, Ke = 6e5, yn = 6, Ec = 500, Ac = "/journal/summary", Cc = "/api/server-state", Oc = 5e3, Pa = Gn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Tc = (e) => e.split("?")[0].endsWith(Ac), Ko = (e, t) => Object.assign(new Error(t), { status: e });
async function Ic(e, t, n = Ko) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Rc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Bc {
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
        headers: { ...Pa, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Rc(s),
        signal: AbortSignal.timeout(a || (i ? _c : Na))
      });
    } catch (l) {
      if (l instanceof TypeError && Da(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Ec)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = yn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : fc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Ic(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Pa, signal: AbortSignal.timeout(Na) });
    if (!n.ok) throw Ko(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, yn, o).then((l) => (this.written(n), l));
    if (ia() && !Tc(n))
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
    return fetch(Cc, { cache: "no-store", signal: AbortSignal.timeout(Oc) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (s) {
      throw s instanceof TypeError && Da(), s;
    }
  }
}
const qe = new Bc(), Re = (e) => encodeURIComponent(e);
function fe(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const Pt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), jt = "the page does not know its environment yet", Lc = "X-Journal-Env", Dc = "X-Journal-Request-At", os = "/viewer/voices/figures/";
class la {
  constructor({ env: t = () => Ze.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new la({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Dc]: String(Date.now()), ...this.env() ? { [Lc]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === jt ? Promise.reject(new Error(jt)) : qe.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === jt ? Promise.reject(new Error(jt)) : qe.request("POST", this.url(t), n, s, this.headers());
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
    return qe.stream(this.address("/entries/stream" + n));
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
    return this.post(this.here(t.path), {}, Ke);
  }
  upload(t, n, s) {
    if (Gn) return Promise.reject(Object.assign(new Error(Ol), { status: 403 }));
    if (s.size > dc) return Promise.reject(new Error(hc(s)));
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
    return qe.bytes(t);
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
    return this.post("/team/connect", t, Ke);
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
    return this.post(`/library/items/${encodeURIComponent(t)}/publish`, { reference: n, note: s, description: a, team: o }, Ke);
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
    return qe.request("GET", os + "figures.json");
  }
  voiceFigureUrl(t) {
    return os + t;
  }
  figureDecoderUrl() {
    return os + "draco/";
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
    return this.post(this.here("/plugins/preview"), { source: t }, Ke);
  }
  installPlugin(t) {
    return this.post(this.here("/plugins"), { source: t }, Ke);
  }
  previewUpgrade(t) {
    return this.act("plugins", t, "upgrade-preview", {}, Ke);
  }
  upgradePlugin(t, n) {
    return this.act("plugins", t, "upgrade", { ref: n }, Ke);
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
    return this.post("/mcp/add", t, Ke);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Re(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Ke);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Re(t)}` : ""}${Vn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const Ve = new la({ base: Gn ? "/p" : "" }), Nc = (e) => qe.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), ja = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), Pc = 6e4, jc = 4, qc = 300, Fc = 5e3, Yo = /* @__PURE__ */ new Map();
function Yn(e) {
  if (!(e in ja)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return ja[e];
}
function Wc(e) {
  const t = Yn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Fc;
  }
}
const Hc = (e) => e / 2 + Math.random() * e / 2, Jo = (e) => [...e.users.values()].pop(), ca = (e) => Yo.get(e.place) === e, Uc = () => Math.random() * qc, ua = () => document.hidden;
function zc(e) {
  const t = Wc(e);
  return e.failures ? Hc(Math.min(Pc, t * 2 ** e.failures)) : Math.max(t, jc * e.took);
}
function Zo(e, t) {
  clearTimeout(e.timer), !(!ca(e) || ua()) && (e.timer = setTimeout(() => Vc(e), t));
}
function Vc(e) {
  return ca(e) ? e.running ? (e.again = !0, e.running) : (e.running = Jc(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Gc = (e) => {
  var t, n;
  return !ua() && (((n = (t = Yn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Jo(e).active() && !ia();
};
async function Kc(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await qe.attemptOnce(() => Yn(e.key).read(Jo(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Yc(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Yn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Jc(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Gc(e) && Yc(e, await Kc(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ca(e));
  Zo(e, zc(e));
}
const Zc = () => ua() || Yo.forEach((e) => Zo(e, Uc()));
document.addEventListener("visibilitychange", Zc);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Xo = (e) => `${e.table}:${e.id}`, qa = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", rs = 80;
function Fa(e) {
  return e.length <= rs ? e : `${e.slice(0, rs + 1).replace(/\s+\S*$/, "") || e.slice(0, rs)}…`;
}
const Wa = {
  messages: (e) => Fa(qa(e.text)),
  comments: (e) => Fa(qa(e.text)),
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
}, Xc = (e) => (Wa[e.table] ? Wa[e.table](e) : e.title || "") || "", Qc = ["done", "cancelled"], Ds = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => Qc.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, eu = (e) => Ds[e.table] ? Ds[e.table](e) : 0, Qo = (e) => eu(e) > 0, tu = (e) => !!Ds[e], bt = (e) => Ee(e.created_at), Ns = (e) => Ee(e.updated_at) || bt(e), nu = 60, su = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - nu, au = (e, t) => e.id > 0 && e.table === t.table && su(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), da = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => au(s, n))), ou = { me: 1, people: [] }, ue = aa({
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
  people: ou,
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
No("journal.activity", () => ue.activity);
No("journal.side.mini", () => ue.sideMini);
const ru = 50, er = 100, iu = { messages: 25 }, ze = (e) => iu[e] || ru;
function lu(e, t) {
  if (e !== "messages") return Math.max(t.length - ze(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === ze(e)) return s;
  return 0;
}
const ht = /* @__PURE__ */ new Set(), ha = D(0), un = /* @__PURE__ */ new Set(), dn = /* @__PURE__ */ new Set(), ot = /* @__PURE__ */ new Set(), Ps = /* @__PURE__ */ new Set(), cu = /* @__PURE__ */ new Map(), uu = /* @__PURE__ */ new Map();
let qt = !1, Ft = null;
const du = (e, t) => e.id - t.id, hu = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, fu = { messages: hu }, tr = (e) => fu[e] || du;
function nr(e) {
  return ha.value, ht.has(e) || (ht.add(e), ue.booted && (!un.has(e) || dn.has(e)) && queueMicrotask(() => fa([e], !1))), ue.rows[e] || [];
}
function mu(e) {
  const t = ue.rows[e] || [], n = lu(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ue.rows[e] = t.filter((a) => s.has(a) || tu(e) && !Qo(a)), ue.paging.size[e] = ze(e), ue.paging.more[e] = !0;
}
const pu = /* @__PURE__ */ new Set();
function gu() {
  ht.forEach(mu), ht.clear(), cu.clear(), uu.clear(), ha.value += 1;
}
be(() => `${Ze.value.env}/${Ze.value.page}/${Ze.value.open ? Ze.value.open.table : ""}`, gu);
be(
  () => ue.booted,
  (e) => e && fa(
    [...ht].filter((t) => !un.has(t)),
    !1
  )
);
const js = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !uc(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function sr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (js(s) && !js(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function ar(e, t) {
  un.add(e), ha.value += 1;
  const n = ue.rows[e] || [];
  ue.rows[e] = [...sr(n, t.rows), ...da(n.filter((s) => s.id === 0), t.rows)], ue.paging.size[e] = ue.paging.size[e] || ze(e), ue.paging.more[e] = !t.is_last_page;
}
async function vu(e) {
  const t = new Set((ue.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: ze(e) });
  Jn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = da((ue.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return ar(e, { ...n, rows: [...n.rows, ...a].sort(tr(e)) }), ue.paging.size[e] = ze(e), or.has(e) && await rr(e), ue.rows[e];
}
const Jn = (e, t) => ue.counts = { ...ue.counts, [e]: t };
async function yu(e) {
  const t = ue.rows[e] || [], n = Math.max(0, ...t.map(Ns)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: ze(e), since: n, after: s });
  if (Jn(e, a.counts), !a.is_last_page) return vu(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = da(t.filter((i) => !o.has(i.id)), a.rows).concat(sr(t, a.rows));
  return ue.rows[e] = r.sort(tr(e)), ue.paging.size[e] = ue.rows[e].length, ue.rows[e];
}
const is = /* @__PURE__ */ new Set();
async function wu(e, t = !1) {
  e.forEach((n) => dn.delete(n)), e.forEach((n) => Ps.add(n));
  try {
    await _u(e, t);
  } finally {
    e.forEach((n) => Ps.delete(n));
  }
}
async function ku(e) {
  const t = await Ve.list(e, { limit: ze(e) });
  Jn(e, t.counts), ar(e, t);
}
async function bu(e) {
  Jn(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const or = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function rr(e) {
  const t = (ue.rows[e] || []).filter((a) => js(a) && (e !== "plans" || !Qo(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ue.rows[e] = (ue.rows[e] || []).map((a) => s.get(a.id) || a);
}
const xu = (e, t) => !un.has(e) || t && (ue.paging.size[e] || ze(e)) === ze(e) && !pu.has(e);
async function $u(e, t) {
  if (!ht.has(e)) return bu(e);
  const n = await (xu(e, t) ? ku(e) : yu(e));
  return or.has(e) && await rr(e), n;
}
async function ir() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ue.settings) && (ue.settings = e);
}
async function Mu() {
  const [e] = await Promise.all([Ve.entries(0, er), ir()]);
  Cu([...Kt(cr(), []), ...e]);
}
const Su = (e, t) => $u(e, t).then(
  () => null,
  () => e
);
async function _u(e, t) {
  const n = (await Promise.all(e.map((s) => Su(s, t)))).filter(Boolean);
  if (n.forEach((s) => (ot.add(s), dn.add(s))), t && await Mu(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const lr = 1e3, Eu = 15e3;
let wn = lr;
async function Au() {
  return Ft || (Ft = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...ot].some((e) => !is.has(e)) || qt; ) {
      const e = qt, t = [...e ? Object.keys(ue.rows) : ot].filter((s) => ln[s] && (ht.has(s) || s in ue.rows)).filter((s) => e || !ht.has(s) || dn.has(s) || !un.has(s)).filter((s) => !is.has(s)), n = [...ot].filter((s) => is.has(s));
      ot.clear(), n.forEach((s) => ot.add(s)), qt = !1;
      try {
        await wu(t, e), wn = lr;
      } catch {
        qt = qt || e, await new Promise((a) => setTimeout(a, wn)), wn = Math.min(wn * 2, Eu);
      }
    }
  })().finally(() => Ft = null), Ft);
}
function fa(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Ps.has(n)).forEach((n) => {
    ot.add(n), t && dn.add(n);
  }), ot.delete("settings") && ir(), Au();
}
const cr = () => {
  var e;
  return `typed-entries:${((e = ue.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function Cu(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ue.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-er), zn(cr(), ue.entries.slice(-50));
}
Nc((e) => ue.streamOpen || fa([e]));
const qs = [], Ou = 2e3, at = /* @__PURE__ */ new Map(), Tu = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Iu = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function $t(e, { first: t = !1 } = {}) {
  t ? qs.unshift(e) : qs.push(e), at.clear();
}
function ur(e, t, n) {
  var a;
  const s = nr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Ru = (e) => nr(e.table).find((t) => t.id === e.id) === e.row, Bu = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Lu(e, t) {
  const n = [{ kind: "text", text: et(e).replace(/\r\n/g, `
`) }];
  for (const s of qs)
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
  return Du(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Du(e) {
  return e.split(Iu).map((t, n) => n % 2 ? t : t.replace(Tu, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ha(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Nu(e) {
  const [t, , ...n] = e, s = Ha(t).map((o) => `<th>${Yt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Ha(o).map((r) => `<td>${Yt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Pu(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Yt(a)}</li>`).join("")}</${s}>`;
}
const Ua = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function dr(e) {
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
    if (Ua(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Nu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(Pu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${dr(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Ua(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Yt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const ju = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, qu = (e) => e.kind !== "text" && !ju.test(e.html);
function Fu(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(dr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : qu(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Fs(e, t = { env: "" }) {
  const n = Bu(e, t), s = at.get(n);
  if (at.delete(n), s && s.reads.every(Ru))
    return at.set(n, s), s.html;
  const a = [], o = Fu(Lu(e, { ...t, reads: a }));
  return at.set(n, { html: o, reads: a }), at.size > Ou && at.delete(at.keys().next().value), o;
}
const hr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Jt = (e) => String(e || "").replace(hr, (t, n, s, a) => a), Wu = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), kn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Hu = /^Traceback \(most recent call last\):/m, Uu = 8;
function fr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Uu).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function zu(e) {
  const t = [...e.matchAll(Wu)].map((s) => s.index);
  if (kn.lastIndex = 0, !t.length || !kn.test(e)) return null;
  kn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(kn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: fr(n), tail: "" } : null;
}
function Vu(e) {
  const t = Hu.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: fr([o]), tail: n.slice(a).join(`
`) };
}
$t((e) => {
  const t = Jt(e), n = Vu(t) || zu(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Gu = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Ku = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Yu = /[\w\]]\(/, Ju = /^[\w$.[\]'"]+\s*=\s*[^=]/, Zu = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Xu = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Qu = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, ed = /[[({,]$/, td = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, nd = /^(\t|\s{2,})\S/, sd = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*\/?|<!--)/, ad = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, od = /[{}()[\];=<>$&|*\\@+^~%]/g, mr = /^\s*(?:[-*+]|\d+[.)])\s/, rd = /^\s*>/, id = /^\s*\|/, ld = 0.6, cd = 0.4, ud = 5, dd = 0.03, pr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= ud && t.every((n) => ad.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(od) ?? []).length / e.length < dd;
}, ls = (e) => {
  const t = e.trim();
  return [Gu, Ku, Yu, Ju, Zu, Xu, Qu, ed, td].some((n) => n.test(t)) || /[;{}]$/.test(t) || nd.test(e) && !mr.test(e) && !pr(e);
};
function hd(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || mr.test(t[0]) || t.every((o) => rd.test(o) || id.test(o))) return "text";
  const n = t.filter((o) => !sd.test(o.trim()));
  if (t.length === 1) return !n.length || ls(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(ls).length, a = n.filter((o) => !ls(o) && pr(o)).length;
  return s >= n.length * ld && a <= n.length * cd ? "code" : "text";
}
const Ws = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", fd = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", md = `${Ws} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, pd = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", gd = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", za = {
  js: { keywords: Ws, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: fd, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: md, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ws, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: pd, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: gd, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Va(e, t, n) {
  return n && e.startsWith(n, t);
}
function vd(e, t) {
  const n = za[t] || za.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Va(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Va(e, o, n.block[0])) {
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
function yd(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of vd(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? et(r) : `<span class="tok-${s}">${et(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function wd(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const kd = 1500, Ga = /* @__PURE__ */ new WeakMap();
async function bd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await wd(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ga.get(t)), Ga.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, kd)
  )));
}
typeof document < "u" && document.addEventListener("click", bd, !0);
const xd = /\n\s*\n/, $d = /^(```|~~~)\s*(\w+)?\s*$/, Md = /^\s{4,}\S/, Sd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Hs = /^\s*(?:[-*+]|\d+[.)])\s/, gr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, _d = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ma(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Ed(e) {
  const t = ma(e.join(`
`));
  return (_d.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Ad = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && gr.test(t) && !Hs.test(t);
}, Cd = (e, t) => Hs.test(t) || Hs.test([...e].reverse().find((n) => n.trim()) || "");
function Us(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${yd(ma(e.join(`
`)), t || Ed(e)).join(`
`)}</code></pre></div>` };
}
function Od(e) {
  const t = e.split(xd).map((r) => ({ paragraph: r, kind: hd(ma(r).split(`
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
      a(), n.push(Us(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(Jt), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function Td(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...Od(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match($d);
    if (r) {
      const l = t.findIndex((d, f) => f > o && d.trim().startsWith(r[1])), u = l < 0 ? t.length : l;
      a(), n.push(Us(t.slice(o + 1, u).map(Jt), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Ad(s) ? Sd : Md;
    if (i.test(t[o]) && !Cd(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && gr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (l - o + u.length >= 2) {
        a(), n.push(Us([...u, ...t.slice(o, l)].map(Jt), "")), o = l;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
$t((e) => Td(e));
const Id = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Rd = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Bd(e) {
  const t = Id.exec(e);
  if (t && kt(t[1])) return { at: t.index, length: t[0].length, table: kt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Rd.exec(e), s = n && kt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Ld(e, t, n, s) {
  const a = ur(s, e, t), o = Jt(a ? Xc(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${et(cn(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
$t(
  (e, t) => {
    const n = Bd(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Ld(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Dd = /\.(png|jpe?g|gif|webp|svg)$/i, Nd = (e) => Dd.test(e), Pd = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, jd = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function qd(e, t) {
  const n = Pd.exec(e), [, s, a, o, r, i] = n || [], l = n && kt(s || o), u = l && ur(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = Ve.in(t.env).fileUrl(l, u.id, i), f = `${cn(l).title} ${u.id} · ${et(i)}`, v = Nd(i) ? `<img class="file-card-image" src="${d}" alt="${et(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(i)}">${v}<span class="file-card-name">${f}</span></a>` };
}
function Fd(e) {
  const t = jd.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
$t(
  (e, t) => {
    if (t.inline) return null;
    const n = qd(e, t) || Fd(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Wd = /`([^`\n]+)`/g;
$t((e) => e.replace(Wd, (t, n) => `<code>${n}</code>`));
const Ka = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Vn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
$t(
  (e, t) => e.replace(hr, (n, s, a, o) => Ka[s] ? Ka[s](a, o, t) : o)
);
const Hd = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, vr = new RegExp(`\\b(${Ho}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), yr = new RegExp(`\\b(${Ho}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Ud = new RegExp(`<code>((?:${vr.source}|${yr.source}))</code>`, "gi"), zd = (e) => e.replace(Ud, "$1"), Vd = (e, t) => `<a class="row-pill" href="#" data-peek="${kt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Gd = (e) => e.replace(yr, (t, n, s) => s.replace(/\d+/g, (a) => Vd(n.replace(/s$/i, ""), a))), Kd = (e) => Gd(e).replace(
  vr,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${kt(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
$t(
  (e, t) => t.rowNames === !1 ? e : zd(e).split(Hd).map((n, s) => s % 2 ? n : Kd(n)).join("")
);
const Yd = ["innerHTML"], Jd = ["innerHTML"], Zd = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Fs(s, { env: Ze.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => V(Ct) && V(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, Yd)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => V(Ct) && V(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, Jd));
  }
}, it = /* @__PURE__ */ K(Zd, [["__scopeId", "data-v-1a43d211"]]), Xd = { class: "fact" }, Qd = { class: "fact-label" }, eh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Xd, [
      p("span", Qd, k(e.label), 1),
      P(it, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, th = /* @__PURE__ */ K(eh, [["__scopeId", "data-v-3a88ecf8"]]), nh = { class: "list" }, sh = { class: "list-label" }, ah = {
  key: 1,
  class: "list-note"
}, oh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", nh, [
      (c(!0), h(Y, null, se(e.items, (o, r) => (c(), G(xt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: U(() => [
          p("span", sh, k(o.label), 1),
          o.badge ? (c(), G(Uo, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : S("", !0),
          o.note ? (c(), h("span", ah, k(o.note), 1)) : S("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, rh = /* @__PURE__ */ K(oh, [["__scopeId", "data-v-ebe2ae0a"]]), ih = { class: "table" }, lh = {
  key: 0,
  class: "table-row empty"
}, ch = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", ih, [
      p("div", {
        class: "table-row head",
        style: pe(a.value)
      }, [
        (c(!0), h(Y, null, se(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, k(i), 1))), 128))
      ], 4),
      (c(!0), h(Y, null, se(e.rows, (i, l) => (c(), G(xt(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: J(["table-row", i.tone, { opens: i.open }]),
        style: pe(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: U(() => [
          (c(!0), h(Y, null, se(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, k(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", lh, k(e.empty), 1)) : S("", !0)
    ]));
  }
}, uh = /* @__PURE__ */ K(ch, [["__scopeId", "data-v-9326a52e"]]), dh = { class: "stat-value" }, hh = { class: "stat-label" }, fh = {
  key: 0,
  class: "stat-note"
}, mh = {
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
      default: U(() => [
        p("span", dh, k(e.value), 1),
        p("span", hh, k(e.label), 1),
        e.note ? (c(), h("span", fh, k(e.note), 1)) : S("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ph = /* @__PURE__ */ K(mh, [["__scopeId", "data-v-ad0db6d6"]]), gh = { class: "code" }, vh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), G(Hn, {
      value: e.node.type
    }, {
      stack: U(() => [
        P(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: U(() => [
        P(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: U(() => [
        P(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: U(() => [
        P(cc, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: U(() => [
        p("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: U(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: U(() => [
        P(ph, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: U(() => [
        P(sc, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: U(() => [
        P(uh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: U(() => [
        P(rh, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: U(() => [
        P(it, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: U(() => [
        P(th, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: U(() => [
        P(Uo, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: U(() => [
        p("pre", gh, [
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
}), wr = /* @__PURE__ */ K(vh, [["__scopeId", "data-v-cbdcf540"]]), yh = { class: "dashboard" }, wh = { class: "trail" }, kh = ["onClick"], bh = {
  key: 0,
  class: "gone",
  role: "status"
}, xh = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (v) => v in (n.document.pages || {}), o = D(!!n.page && !a(n.page)), r = D(n.page && !o.value ? [n.page] : []), i = R(() => r.value.at(-1) || n.document.start), l = R(() => (n.document.pages || {})[i.value] || null), u = (v) => ((n.document.pages || {})[v] || {}).title || v, d = (v) => {
      o.value = !1, r.value = [...r.value, v];
    }, f = (v) => {
      o.value = !1, r.value = r.value.slice(0, v);
    };
    return be(
      () => n.document.start,
      () => r.value = []
    ), (v, y) => (c(), h("div", yh, [
      e.document.broken ? (c(), G(In, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: U(() => [
          ce(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(In, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: U(() => [
          ce(k(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(Y, { key: 2 }, [
        p("nav", wh, [
          p("button", {
            type: "button",
            class: J(["step", { current: !r.value.length }]),
            onClick: y[0] || (y[0] = (C) => f(0))
          }, k(u(e.document.start)), 3),
          (c(!0), h(Y, null, se(r.value, (C, M) => (c(), h(Y, {
            key: `${M}-${C}`
          }, [
            y[2] || (y[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: J(["step", { current: M === r.value.length - 1 }]),
              onClick: (w) => f(M + 1)
            }, k(u(C)), 11, kh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", bh, "What you opened is no longer in this dashboard. Here is its start page.")) : S("", !0),
        P(Bt, {
          name: "page",
          mode: "out-in"
        }, {
          default: U(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              P(wr, {
                node: l.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (C) => s("file", C))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : S("", !0)
    ]));
  }
}, Tk = /* @__PURE__ */ K(xh, [["__scopeId", "data-v-fbe83734"]]);
function $h(e, t, n, s = () => window) {
  Be(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ie(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Mh = (e, t = () => !0) => $h("keydown", (n) => n.key === "Escape" && t() && e());
function kr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = D(!1), a = R(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Mh(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Sh = 80, Et = aa([]);
function br(e) {
  const t = Symbol("layer"), n = () => Et.includes(t) && Et.splice(Et.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !Et.includes(t) && Et.push(t), s || n();
    },
    { immediate: !0 }
  ), Ie(n), R(() => Sh + Math.max(0, Et.indexOf(t)));
}
let xr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return xr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const _h = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Eh(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(_h)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Be(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : xr, document.addEventListener("keydown", a), Lt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Ah = ["aria-modal", "aria-label", "aria-labelledby"], Ch = {
  key: 0,
  class: "dialog-head"
}, Oh = ["id", "tabindex"], Th = {
  key: 1,
  class: "dialog-foot"
}, Ih = 500, Rh = 400, Bh = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = kr(s, n), i = br(a), l = D(null), u = D(null), d = D(null), f = Io(), v = D(!1), y = Date.now();
    n.modal && Eh(u, () => s("escape"), d);
    function C() {
      if (!n.modal) return n.closable && o();
      v.value = !0, setTimeout(() => v.value = !1, Rh);
    }
    function M(O) {
      !n.modal || Date.now() - y >= Ih || ![" ", "Enter"].includes(O.key) || (O.preventDefault(), O.stopPropagation());
    }
    const w = () => l.value && (l.value.scrollTop = l.value.scrollHeight), x = new MutationObserver(w);
    return be(l, (O) => {
      x.disconnect(), O && n.follow && (x.observe(O, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Ie(() => x.disconnect()), (O, F) => (c(), G(oa, { to: "body" }, [
      P(Bt, {
        name: "dialog",
        appear: "",
        onAfterLeave: V(r)
      }, {
        default: U(() => [
          V(a) ? (c(), h("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: pe({ zIndex: V(i) }),
            onClick: xe(C, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: v.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? V(f) : void 0,
              onKeydownCapture: M
            }, [
              e.bare ? S("", !0) : (c(), h("header", Ch, [
                p("h3", {
                  id: V(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, Oh),
                e.closable ? (c(), G(Kn, {
                  key: 0,
                  onClick: V(o)
                }, null, 8, ["onClick"])) : S("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: l,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                he(O.$slots, "default", {}, void 0, !0)
              ], 2),
              O.$slots.foot ? (c(), h("footer", Th, [
                he(O.$slots, "foot", {}, void 0, !0)
              ])) : S("", !0)
            ], 42, Ah)
          ], 6)) : S("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Lh = /* @__PURE__ */ K(Bh, [["__scopeId", "data-v-6d1ecd98"]]), st = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Fe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Dh = 6;
function pa(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Nh = (e) => {
  const t = pa(e, st.lineChars), n = Math.max(st.minWidth, Math.max(...t.map((s) => s.length)) * st.charWidth + st.padX * 2);
  return { name: e, lines: t, line: st.line, padY: st.padY, width: n, height: t.length * st.line + st.padY * 2 };
};
function Ph(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function jh(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function qh(e, t, n) {
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
  for (let r = 0; r < Dh; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((v) => v[i ? 1 : 0] === f).map((v) => v[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function Fh(e, t) {
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
function Wh(e) {
  const t = [...new Set(e.flatMap(([T, g]) => [T, g]))], n = new Set(e.map(([, T]) => T)), s = t.filter((T) => !n.has(T)), a = Ph(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((T, g) => !a.has(g)), r = jh(t, o), i = qh(t, o, r), l = new Map(t.map((T) => [T, Nh(T)])), u = i.map((T) => T.reduce((g, B) => g + l.get(B).width, 0) + je.across * (T.length - 1)), d = Math.max(...u) + je.margin * 2, f = Uh(e, r, i.length), v = /* @__PURE__ */ new Map();
  let y = je.margin;
  i.forEach((T, g) => {
    let B = (d - u[g]) / 2;
    const E = Math.max(...T.map((I) => l.get(I).height));
    T.forEach((I) => {
      const $ = l.get(I);
      v.set(I, { ...$, x: B, y: y + (E - $.height) / 2 }), B += $.width + je.across;
    }), y += E + (f[g] ?? je.down);
  });
  const C = e.map(([T, g, B], E) => ({ from: T, to: g, label: B || "", back: a.has(E) || r.get(g) <= r.get(T) }));
  Fh(C, v);
  const M = C.map((T) => zh(T, v.get(T.from), v.get(T.to))), w = [...v.values()], x = Yh(M, w), O = Math.max(y - je.down, ...x.filter((T) => T.label).map((T) => T.label.y + T.label.height));
  return { width: Math.max(d - je.margin, ...x.filter((T) => T.label).map((T) => T.label.x + T.label.width)) + je.margin, height: O + je.margin, nodes: w, arrows: x };
}
const Hh = (e) => e ? pa(e, Fe.lineChars).length * Fe.line + Fe.pad * 2 : 0;
function Uh(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += Hh(r) + je.labelSpace);
  }), s.map((a) => Math.max(je.down, a));
}
function zh(e, t, n) {
  const s = e.label ? pa(e.label, Fe.lineChars) : [], a = s.length ? Math.max(...s.map((v) => v.length)) * Fe.charWidth + Fe.pad * 2 : 0, o = s.length * Fe.line + (s.length ? Fe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const Vh = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, Gh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Kh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Fe.line);
function Yh(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = Vh(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = Kh.flatMap((l) => Gh.map((u) => a(u, l))).find((l) => !n.some((u) => Ya(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => Ya(i, l)); ) i.y += Fe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Fe.line, pad: Fe.pad } };
  });
}
const Ya = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Jh = { class: "flowchart-tools" }, Zh = ["width", "height", "viewBox", "aria-label"], Xh = ["d"], Qh = ["x", "y", "width", "height"], ef = ["x", "y"], tf = ["x", "dy"], nf = {
  key: 0,
  class: "flowchart-label"
}, sf = ["x", "y", "width", "height"], af = ["x", "y"], of = ["x", "dy"], rf = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Wh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = D(null), i = D({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var x;
      const M = (x = r.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(M != null && M.width)) return;
      const w = Math.min(M.width / a.value.width, M.height / a.value.height, 1.5);
      i.value = { zoom: w, x: (M.width - a.value.width * w) / 2, y: (M.height - a.value.height * w) / 2 };
    }
    function d(M, w, x) {
      const { zoom: O, x: F, y: T } = i.value, g = Math.min(o.most, Math.max(o.least, O * M));
      i.value = { zoom: g, x: w - (w - F) * g / O, y: x - (x - T) * g / O };
    }
    function f(M) {
      const w = r.value.getBoundingClientRect();
      d(M, w.width / 2, w.height / 2);
    }
    function v(M) {
      const w = r.value.getBoundingClientRect();
      M.ctrlKey || M.metaKey ? d(M.deltaY < 0 ? o.step : 1 / o.step, M.clientX - w.left, M.clientY - w.top) : i.value = { ...i.value, x: i.value.x - M.deltaX, y: i.value.y - M.deltaY };
    }
    function y(M) {
      var w, x, O;
      M.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), l = { x: M.clientX - i.value.x, y: M.clientY - i.value.y }, (O = (x = r.value).setPointerCapture) == null || O.call(x, M.pointerId);
    }
    function C(M) {
      l && (i.value = { ...i.value, x: M.clientX - l.x, y: M.clientY - l.y });
    }
    return Be(u), (M, w) => (c(), G(Lh, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (x) => s("close"))
    }, {
      default: U(() => [
        p("div", Jh, [
          P(ke, {
            small: "",
            onClick: w[0] || (w[0] = (x) => f(o.step))
          }, {
            default: U(() => [...w[5] || (w[5] = [
              ce("Zoom in", -1)
            ])]),
            _: 1
          }),
          P(ke, {
            small: "",
            onClick: w[1] || (w[1] = (x) => f(1 / o.step))
          }, {
            default: U(() => [...w[6] || (w[6] = [
              ce("Zoom out", -1)
            ])]),
            _: 1
          }),
          P(ke, {
            small: "",
            onClick: u
          }, {
            default: U(() => [...w[7] || (w[7] = [
              ce("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: xe(v, ["prevent"]),
          onPointerdown: y,
          onPointermove: C,
          onPointerup: w[2] || (w[2] = (x) => Ta(l) ? l.value = null : l = null),
          onPointercancel: w[3] || (w[3] = (x) => Ta(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: pe({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (c(!0), h(Y, null, se(a.value.arrows, (x, O) => (c(), h("path", {
              key: `arrow-${O}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Xh))), 128)),
            (c(!0), h(Y, null, se(a.value.nodes, (x) => (c(), h("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, Qh),
              p("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (c(!0), h(Y, null, se(x.lines, (O, F) => (c(), h("tspan", {
                  key: F,
                  x: x.x + x.width / 2,
                  dy: F ? x.line : 0
                }, k(O), 9, tf))), 128))
              ], 8, ef)
            ]))), 128)),
            (c(!0), h(Y, null, se(a.value.arrows, (x, O) => (c(), h(Y, {
              key: `label-${O}`
            }, [
              x.label ? (c(), h("g", nf, [
                p("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, sf),
                p("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (c(!0), h(Y, null, se(x.label.lines, (F, T) => (c(), h("tspan", {
                    key: T,
                    x: x.label.x + x.label.width / 2,
                    dy: T ? x.label.line : 0
                  }, k(F), 9, of))), 128))
                ], 8, af)
              ])) : S("", !0)
            ], 64))), 128))
          ], 12, Zh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, lf = /* @__PURE__ */ K(rf, [["__scopeId", "data-v-51d24cfe"]]), Ja = {
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
}, cf = ["innerHTML"], uf = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => Ja[t.name] || Ja.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, cf));
  }
}, tt = /* @__PURE__ */ K(uf, [["__scopeId", "data-v-beb5935c"]]), df = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      P(tt, { name: "fold" })
    ], 2));
  }
}, Zt = /* @__PURE__ */ K(df, [["__scopeId", "data-v-d03899bb"]]), hf = ["data-tip", "aria-label"], ff = {
  key: 0,
  class: "mact-word"
}, mf = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      P(tt, { name: "open" }),
      e.open ? (c(), h("span", ff, k(e.label), 1)) : S("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, hf));
  }
}, $r = /* @__PURE__ */ K(mf, [["__scopeId", "data-v-3b292e09"]]), pf = 120, cs = 280, gf = 160, vf = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, yf = ["leaving", "resizing", "entering"];
function Mr(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function wf(e) {
  const t = yf.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = Mr(e);
  return e.classList.add(...t), n;
}
function Sr(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = D(t()), a = D("");
  let o = 0;
  const r = (u, d) => Object.assign(u.style, { width: `${d.width}px`, height: `${d.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const d = e.value, f = ++o;
    if (!d || !d.offsetWidth || vf()) {
      s.value = u;
      return;
    }
    const v = Mr(d);
    if (r(d, v), a.value = "leaving", await n(pf), f !== o) return;
    s.value = u, a.value = "resizing", await Lt(), i(d);
    const y = wf(d);
    r(d, v), d.offsetWidth, d.style.transition = `width ${cs}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${cs}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(d, y), await n(cs), f === o && (i(d), a.value = "entering", await n(gf), f === o && (a.value = ""));
  }
  return be(t, (u) => l(u)), Dt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const kf = { class: "growing-card-top" }, bf = ["aria-expanded"], xf = { class: "growing-card-avatar" }, $f = { class: "growing-card-title" }, Mf = { class: "growing-card-more" }, Sf = { class: "growing-card-body" }, _f = {
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
    const n = e, s = t, a = D(!1), o = D(null), { folded: r, phase: i } = Sr(o, () => !a.value), l = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", V(i), { open: !V(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", kf, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (v) => a.value = !a.value)
        }, [
          p("span", xf, [
            e.bad ? (c(), G(tt, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(Y, { key: 1 }, [
              ce(k(l.value), 1)
            ], 64)) : (c(), G(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", $f, k(e.title), 1),
          P(Zt, { open: a.value }, null, 8, ["open"])
        ], 8, bf),
        e.action ? (c(), G($r, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (v) => s("act"))
        }, null, 8, ["label", "open"])) : S("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (v) => s("comment"))
        }, [
          P(ye, {
            name: "bubble",
            size: 13
          })
        ])) : S("", !0)
      ]),
      p("div", Mf, [
        p("div", Sf, [
          (c(!0), h(Y, null, se(u.value, (v, y) => (c(), h("p", {
            key: y,
            class: "growing-card-text"
          }, k(v), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Ef = /* @__PURE__ */ K(_f, [["__scopeId", "data-v-08411e3a"]]), Af = ["title", "aria-label"], Cf = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Of = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Tf = {
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
      (c(), h("svg", Cf, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", Of)) : S("", !0)
      ]))
    ], 10, Af));
  }
}, If = /* @__PURE__ */ K(Tf, [["__scopeId", "data-v-6dc92808"]]);
function Rf(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Bf(e, t = Date.now()) {
  const n = Rf(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
function _r(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Za(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const us = (e) => String(e).padStart(2, "0");
function Lf(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${us(t % 60)}s` : `${Math.floor(t / 3600)}h ${us(Math.floor(t % 3600 / 60))}m ${us(t % 60)}s`;
}
const Df = "img,pre,table";
function Nf(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Pf(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function jf(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Df)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Nf(Pf(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function qf(e, t) {
  let n = null;
  const s = () => e.value && jf(e.value);
  Be(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const Ff = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Wf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Hf = ["data-incoming", "data-ref"], Uf = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], zf = { class: "message-body" }, Vf = ["title"], Gf = ["innerHTML"], Kf = ["title"], Yf = ["innerHTML"], Jf = {
  class: "message-faces",
  "data-message-faces": ""
}, Zf = ["title", "data-face", "onClick"], Xf = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Qf = ["title", "data-reaction", "onClick"], e1 = {
  key: 0,
  class: "message-reaction-count"
}, t1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, n1 = ["href", "title"], s1 = ["src", "alt"], a1 = ["href"], o1 = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, r1 = {
  key: 1,
  "data-message-links-rows": ""
}, i1 = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, l1 = ["data-sent-worker", "title", "onClick"], c1 = { class: "message-foot" }, u1 = { class: "message-time" }, d1 = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, h1 = 140, f1 = 2, m1 = 1500, p1 = "An earlier message", g1 = "about", v1 = "sent_to", y1 = 3, w1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var de;
    const n = e, s = t, a = D(!1), o = D(null), r = R(() => ["user", "comment"].includes(n.message.type)), i = R(() => {
      const [Q, ee] = (n.message.commented_row || ":").split(":"), Z = kt(Q);
      return Z ? { ref: `${Z}:${ee}`, label: `${cn(Z).title.toLowerCase()} ${ee}` } : null;
    }), l = R(() => n.message.worker_id ?? null), u = D(!1), d = R(() => l.value !== null && ((n.message.text ?? "").length > h1 || (n.message.text ?? "").split(`
`).filter((Q) => Q.trim()).length > f1)), f = R(() => r.value && !n.message.read_at && !n.message.local);
    async function v() {
      var Q;
      await ((Q = navigator.clipboard) == null ? void 0 : Q.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, m1);
    }
    const y = R(() => Fs(n.message.text ?? "", { env: "" })), C = R(() => JSON.parse(n.message.flowchart_edges || "[]")), M = D(!1), w = R(() => Fs(n.quote || p1, { env: "" }));
    function x() {
      const Q = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Q ? Q.scrollIntoView({ block: "center", behavior: "smooth" }) : Xe(`messages:${n.message.parent_id}`);
    }
    qf(o, () => `${n.message.text} ${n.quote}`);
    const O = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, F = (Q) => `/api/files/message/${n.message.id}/${encodeURIComponent(Q)}`, T = R(() => JSON.parse(n.message.captions || "{}")), g = R(() => (n.message.files ?? []).map((Q) => ({ name: Q, address: F(Q), isImage: O.test(Q), title: T.value[Q] || Q }))), B = R(() => _r(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Te(Le, null), I = D([]), $ = D([]), _ = D(!1), b = R(() => `Linked: ${I.value.join(", ")}`), m = R(() => I.value.length >= y1), L = R(() => `${I.value.length} linked ${I.value.every((Q) => Q.startsWith("task ")) ? "tasks" : "rows"}`);
    async function N() {
      if (!r.value || !(E != null && E.read) || n.message.local) return;
      const Q = await E.read(`link list --source message:${n.message.id}`);
      if (!Q.ok) return;
      const ee = Q.value.rows ?? Q.value ?? [];
      I.value = ee.filter((Z) => Z.link_type === g1).map((Z) => `${Z.target_model} ${Z.target_id}`), $.value = ee.filter((Z) => Z.link_type === v1).map((Z) => Z.target_id);
    }
    N(), (de = E == null ? void 0 : E.follow) == null || de.call(E, ["link.*"], N);
    const W = D(!1), re = R(() => Wf(n.message.reactions));
    function le(Q) {
      W.value = !1, s("react", n.message, Q);
    }
    return (Q, ee) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      P(Ef, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (Z) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Hf)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", zf, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: i.value }]),
          onClick: ee[6] || (ee[6] = (...Z) => V(Ct) && V(Ct)(...Z))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ee[1] || (ee[1] = xe((Z) => V(Xe)(i.value.ref), ["stop"]))
          }, [
            P(ye, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + k(i.value.label), 1)
          ], 8, Vf)) : S("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(x, ["stop"]),
            innerHTML: w.value
          }, null, 8, Gf)) : S("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: ee[2] || (ee[2] = xe((Z) => V(Xe)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + k(l.value), 9, Kf)) : S("", !0),
          p("div", {
            class: J({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, Yf),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ee[3] || (ee[3] = xe((Z) => u.value = !u.value, ["stop"]))
          }, k(u.value ? "Show less" : "Show more"), 1)) : S("", !0),
          C.value.length ? (c(), h(Y, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[4] || (ee[4] = (Z) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (c(), G(lf, {
              key: 0,
              title: e.message.text,
              edges: C.value,
              onClose: ee[5] || (ee[5] = (Z) => M.value = !1)
            }, null, 8, ["title", "edges"])) : S("", !0)
          ], 64)) : S("", !0)
        ], 2),
        p("div", {
          class: J(["message-tools", { picking: W.value }]),
          "data-message-tools": ""
        }, [
          W.value ? (c(), h(Y, { key: 0 }, [
            p("div", Jf, [
              (c(!0), h(Y, null, se(V(Ff), (Z) => (c(), h("button", {
                key: Z,
                type: "button",
                class: "message-face",
                title: `React ${Z}`,
                "data-face": Z,
                onClick: (De) => le(Z)
              }, k(Z), 9, Zf))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[7] || (ee[7] = (Z) => W.value = !1)
            }, [
              P(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(Y, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ee[8] || (ee[8] = (Z) => W.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ee[9] || (ee[9] = (Z) => s("reply", e.message))
            }, "Reply"),
            p("button", {
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
            }, "Delete")) : S("", !0)
          ], 64))
        ], 2)
      ]),
      re.value.length ? (c(), h("div", Xf, [
        (c(!0), h(Y, null, se(re.value, (Z) => (c(), h("button", {
          key: Z.emoji,
          type: "button",
          class: J(["message-reaction", { mine: Z.mine }]),
          title: Z.title,
          "data-reaction": Z.emoji,
          onClick: (De) => s("react", e.message, Z.emoji)
        }, [
          ce(k(Z.emoji) + " ", 1),
          Z.count > 1 ? (c(), h("span", e1, k(Z.count), 1)) : S("", !0)
        ], 10, Qf))), 128))
      ])) : S("", !0),
      g.value.length ? (c(), h("div", t1, [
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
            p("img", {
              src: Z.address,
              alt: Z.name,
              "data-figure-picture": ""
            }, null, 8, s1)
          ], 8, n1)) : (c(), h("a", {
            key: 1,
            href: Z.address,
            target: "_blank",
            class: "message-file"
          }, k(Z.name), 9, a1))
        ], 64))), 128))
      ])) : S("", !0),
      I.value.length ? (c(), h("div", o1, [
        P(tt, {
          class: "message-links-icon",
          name: "linked"
        }),
        m.value && !_.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: ee[11] || (ee[11] = (Z) => _.value = !0)
        }, k(L.value), 1)) : (c(), h("span", r1, [
          P(it, {
            text: b.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : S("", !0),
      $.value.length ? (c(), h("div", i1, [
        P(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(Y, null, se($.value, (Z) => (c(), h("button", {
          key: Z,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Z,
          title: `Open worker ${Z}`,
          onClick: xe((De) => V(Xe)(`agents:${Z}`), ["stop"])
        }, "Also sent to worker " + k(Z), 9, l1))), 128))
      ])) : S("", !0),
      p("div", c1, [
        p("time", u1, k(B.value), 1),
        Number.isInteger(e.message.id) ? (c(), h("span", d1, "message " + k(e.message.id), 1)) : S("", !0),
        r.value ? (c(), G(If, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : S("", !0)
      ])
    ], 8, Uf));
  }
}, Ik = /* @__PURE__ */ K(w1, [["__scopeId", "data-v-817edd99"]]), k1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = Bi("SkeletonParts", !0);
      return c(!0), h(Y, null, se(e.parts, (l, u) => (c(), h(Y, { key: u }, [
        (c(!0), h(Y, null, se(l.count, (d) => (c(), G(Hn, {
          key: d,
          value: l.shape
        }, {
          line: U(() => [
            p("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: pe({ width: l.width, height: `${t[l.size]}px` })
            }, null, 4)
          ]),
          circle: U(() => [
            p("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: pe({ width: `${n[l.size]}px`, height: `${n[l.size]}px` })
            }, null, 4)
          ]),
          block: U(() => [
            p("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: pe({ width: l.width, height: `${l.height}px` })
            }, null, 4)
          ]),
          grow: U(() => [...r[0] || (r[0] = [
            p("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: U(() => [
            p("div", {
              class: "skeleton-row",
              style: pe(s(l))
            }, [
              P(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: U(() => [
            p("div", {
              class: "skeleton-stack",
              style: pe(s(l))
            }, [
              P(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: U(() => [
            p("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: pe(s(l))
            }, [
              P(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: U(() => [
            p("div", {
              class: "skeleton-grid",
              style: pe(a(l))
            }, [
              P(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), b1 = /* @__PURE__ */ K(k1, [["__scopeId", "data-v-576c95e1"]]), x1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, $1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", x1, [
      P(b1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Er = /* @__PURE__ */ K($1, [["__scopeId", "data-v-52f66b64"]]), Ln = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ds = 200, Ar = (e) => {
  var t;
  return ((t = Ln.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Ln[0].key;
}, Rk = (e) => {
  var t;
  return ((t = Ln.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, M1 = ["aria-label"], S1 = 300, Xa = 400, _1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ds } },
  setup(e) {
    const t = e, n = R(() => Ar(t.value)), s = R(() => n.value < ds ? [1, 0.25, 0.25] : n.value === ds ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: J(["ico", "prio", { hot: n.value >= Xa, high: n.value >= S1 && n.value < Xa }]),
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
        style: pe({ opacity: s.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: pe({ opacity: s.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: pe({ opacity: s.value[2] })
      }, null, 4)
    ], 10, M1));
  }
}, Bk = /* @__PURE__ */ K(_1, [["__scopeId", "data-v-b10e610f"]]), E1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Qa = (e) => E1[e.card.state] || "idle", A1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), eo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, to = (e, t) => eo[Qa(e)] - eo[Qa(t)], no = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, Lk = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => to(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || A1(s, a)) : [...e].sort((s, a) => to(s, a) || (no[t] || no.state)(s, a)), C1 = ["aria-checked", "aria-haspopup", "onClick"], O1 = {
  key: 0,
  class: "segmented-dot"
}, T1 = {
  key: 1,
  class: "segmented-count"
}, I1 = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = Io();
    return (a, o) => {
      const r = Li("tip");
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
          i.dot ? (c(), h("span", O1)) : S("", !0),
          ce(" " + k(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", T1, k(i.count), 1)) : S("", !0)
        ], 10, C1)), [
          [r, i.tip || i.title, `${V(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, R1 = /* @__PURE__ */ K(I1, [["__scopeId", "data-v-ca953072"]]), B1 = { class: "form-field" }, L1 = { class: "form-field-head" }, D1 = ["for"], N1 = {
  key: 0,
  class: "form-field-aside"
}, P1 = {
  key: 0,
  class: "form-field-help"
}, j1 = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", B1, [
      p("div", L1, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, k(e.label), 9, D1),
        t.$slots.aside ? (c(), h("span", N1, [
          he(t.$slots, "aside", {}, void 0, !0)
        ])) : S("", !0)
      ]),
      he(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", P1, k(e.help), 1)) : S("", !0)
    ]));
  }
}, Dk = /* @__PURE__ */ K(j1, [["__scopeId", "data-v-dd7cdcff"]]), q1 = { class: "list-row" }, F1 = {
  key: 0,
  class: "list-row-kind"
}, W1 = { class: "list-row-main" }, H1 = {
  key: 0,
  class: "list-row-title"
}, U1 = { class: "list-row-body" }, z1 = {
  key: 1,
  class: "list-row-end"
}, V1 = {
  key: 1,
  class: "list-row-text"
}, G1 = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", q1, [
      e.kind ? (c(), h("span", F1, k(e.kind), 1)) : S("", !0),
      p("div", W1, [
        e.title ? (c(), h("span", H1, k(e.title), 1)) : S("", !0),
        p("div", U1, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", z1, [
          he(t.$slots, "end", {}, void 0, !0)
        ])) : S("", !0)
      ]),
      e.text ? (c(), h("span", V1, k(e.text), 1)) : S("", !0)
    ]));
  }
}, Nk = /* @__PURE__ */ K(G1, [["__scopeId", "data-v-63155fba"]]), K1 = {
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
}, Y1 = { claude: "Claude Code", codex: "Codex" }, J1 = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Z1 = {
  key: 1,
  class: "menu-item-text"
}, X1 = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", J1, k(e.checked ? "✓" : ""), 1)) : S("", !0),
      e.description ? (c(), h("span", Z1, [
        p("span", null, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, k(e.description), 1)
      ])) : he(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, It = /* @__PURE__ */ K(X1, [["__scopeId", "data-v-fec99974"]]), Q1 = (e, t, n) => Math.max(t, Math.min(n, e)), em = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Cr = /* @__PURE__ */ new WeakMap(), tm = (e, t) => Cr.set(e, t);
function nm(e, t) {
  for (let n = t; n; n = Cr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function sm(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !nm(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const At = 8, am = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = D(null), o = (m) => m ? `${m}px` : void 0, r = R(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = D({ w: 0, h: 0 }), l = D(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (m) => ({
      left: Math.max(0, m.left),
      top: Math.max(0, m.top),
      right: Math.min(window.innerWidth, m.right),
      bottom: Math.min(window.innerHeight, m.bottom)
    }), f = (m) => {
      const L = m.closest(".pane, .float-window");
      return L ? d(L.getBoundingClientRect()) : u();
    }, v = (m, L) => `${Math.max(0, m ? Math.min(m, L) : L)}px`;
    function y(m, L) {
      return {
        below: m.bottom - L.bottom - s.gap - At,
        above: L.top - m.top - s.gap - At,
        across: m.right - m.left - 2 * At
      };
    }
    function C(m) {
      const L = f(s.anchor), N = y(L, m);
      return i.value.w <= N.across && i.value.h <= Math.max(N.below, N.above) ? L : u();
    }
    const M = R(() => {
      if (!l.value) return r.value;
      const m = l.value, L = C(m), N = y(L, m), { w: W, h: re } = i.value, le = s.align === "auto" ? m.left + m.right > L.left + L.right : s.align === "right", de = Q1(le ? m.right - W : m.left, L.left + At, Math.max(L.left + At, L.right - W - At)), ee = re > N.below && N.above > N.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: v(s.maxHeight, N.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: v(s.maxHeight, N.below) };
      return { ...r.value, ...ee, left: `${de}px`, maxWidth: v(s.maxWidth, N.across) };
    }), w = n, x = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function O(m) {
      const L = x(), N = L.indexOf(document.activeElement);
      L[(N + m + L.length) % L.length].focus();
    }
    const F = { ArrowDown: () => O(1), ArrowUp: () => O(-1), Escape: () => w("close") }, T = (m) => F[m.key] && (m.preventDefault(), F[m.key]()), g = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let B = 0;
    const E = new ResizeObserver(() => {
      cancelAnimationFrame(B), B = requestAnimationFrame(g);
    });
    sm(a, (m) => s.anchor && !s.anchor.contains(m.target) && w("close"));
    const I = (m, L) => ["top", "left", "right", "bottom"].some((N) => Math.abs(m[N] - L[N]) > 1), $ = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let _ = 0;
    function b() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || $(m)) return w("close");
        I(m, l.value) && (l.value = m);
      }
      _ = requestAnimationFrame(b);
    }
    return Be(() => {
      s.anchor && a.value && tm(a.value, s.anchor), g(), a.value && E.observe(a.value), !s.plain && x()[0] && x()[0].focus(), b();
    }), Ie(() => {
      E.disconnect(), cancelAnimationFrame(_), cancelAnimationFrame(B);
    }), t({ element: a }), (m, L) => (c(), G(oa, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", ut({
        ref_key: "panel",
        ref: a
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: T
      }), [
        he(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ga = /* @__PURE__ */ K(am, [["__scopeId", "data-v-3d203970"]]), om = ["aria-expanded"], rm = { class: "drop-label" }, im = ["value"], lm = {
  key: 1,
  class: "drop-lead"
}, cm = { class: "drop-item-text" }, um = {
  key: 2,
  class: "drop-note"
}, dm = {
  key: 1,
  class: "drop-none"
}, hm = {
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
      p("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: J(["drop-head", { on: a.value }]),
        "aria-expanded": a.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => a.value = !a.value)
      }, [
        e.icon ? (c(), G(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : S("", !0),
        p("span", rm, k(e.label), 1),
        P(ye, {
          name: "down",
          size: 11
        })
      ], 10, om),
      a.value ? (c(), G(ga, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => a.value = !1)
      }, {
        default: U(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => r.value = f.target.value)
          }, null, 40, im)) : S("", !0),
          (c(!0), h(Y, null, se(i.value, (f) => (c(), G(It, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (v) => l(f)
          }, {
            default: U(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: J(["drop-dot", { live: f.running }])
              }, null, 2)) : S("", !0),
              f.lead ? (c(), h("span", lm, k(f.lead), 1)) : S("", !0),
              p("span", cm, k(f.label), 1),
              f.note ? (c(), h("span", um, k(f.note), 1)) : S("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? S("", !0) : (c(), h("p", dm, k(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : S("", !0)
    ], 2));
  }
}, fm = /* @__PURE__ */ K(hm, [["__scopeId", "data-v-29dfcce5"]]), Pk = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => [
      ...K1[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = R(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (r, i) => (c(), G(fm, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${V(Y1)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, mm = ["aria-label"], pm = { class: "head" }, gm = { class: "names" }, vm = { class: "body" }, ym = {
  key: 0,
  class: "foot"
}, wm = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = kr(s, n), i = br(a);
    return (l, u) => (c(), G(oa, { to: "body" }, [
      P(Bt, {
        name: "side",
        appear: "",
        onAfterLeave: V(r)
      }, {
        default: U(() => [
          V(a) ? (c(), h("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: pe({ "--depth": e.depth, zIndex: V(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = xe((...d) => V(o) && V(o)(...d), ["self"]))
          }, [
            p("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(Y, { key: 0 }, [
                p("header", pm, [
                  p("div", gm, [
                    p("h2", null, k(e.title), 1),
                    e.abstract ? (c(), G(it, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : S("", !0)
                  ]),
                  he(l.$slots, "actions", {}, void 0, !0),
                  P(Kn, {
                    title: e.closeLabel,
                    onClick: V(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                p("div", vm, [
                  he(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", ym, [
                  he(l.$slots, "foot", {}, void 0, !0)
                ])) : S("", !0)
              ], 64)) : he(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, mm)
          ], 6)) : S("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, jk = /* @__PURE__ */ K(wm, [["__scopeId", "data-v-c9a3f43a"]]), zs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, km = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ra(), n = R(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => dt((c(), h("textarea", ut({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [V(zs), V(t).value]
    ]);
  }
}), qk = /* @__PURE__ */ K(km, [["__scopeId", "data-v-e130a5b9"]]), bm = {
  key: 1,
  class: "text-field-label"
}, xm = {
  key: 2,
  class: "text-field-end"
}, $m = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Is({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Ts(e, "modelValue"), s = ra(), a = "onUpdate:modelValue" in (((d = Di()) == null ? void 0 : d.vnode.props) || {}), o = R(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = R(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = R(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = D(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, v) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: f.$slots.end }, V(s).class]),
      style: pe(V(s).style)
    }, [
      e.icon ? (c(), G(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : S("", !0),
      e.label ? (c(), h("span", bm, k(e.label), 1)) : S("", !0),
      dt(p("input", ut({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [V(zs), o.value]
      ]),
      f.$slots.end ? (c(), h("span", xm, [
        he(f.$slots, "end", {}, void 0, !0)
      ])) : S("", !0)
    ], 6)) : dt((c(), h("input", ut({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [V(zs), o.value]
    ]);
  }
}), Fk = /* @__PURE__ */ K($m, [["__scopeId", "data-v-d9c38ca8"]]), so = (e) => e.page * e.size < e.total;
function Mm(e, t, { incremental: n = !1 } = {}) {
  const s = Un(), a = D([]), o = D(""), r = D(!1), i = D(!1), l = D(""), u = D(null);
  async function d(w) {
    const x = await s.read(`${e} --before-id ${w + 1} --limit 1`);
    if (!x.ok) return C();
    const O = x.value.rows.find((F) => F.id === w);
    a.value = O ? a.value.map((F) => F.id === w ? O : F) : a.value.filter((F) => F.id !== w);
  }
  async function f(w) {
    if (n && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== w.row_id));
    if (n && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && a.value.some((g) => g.id === w.row_id)) return d(w.row_id);
    if (!(n && a.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return C();
    const O = Math.max(...a.value.map((g) => g.id)), F = await s.read(`${e} --after-id ${O}`);
    if (!F.ok) return C();
    const T = new Set(a.value.map((g) => g.id));
    a.value = [...F.value.rows.filter((g) => !T.has(g.id)), ...a.value];
  }
  async function v() {
    if (!a.value.length) return !1;
    const w = Math.min(...a.value.map((F) => F.id)), x = await s.read(`${e} --before-id ${w}`);
    if (!x.ok || !x.value.rows.length) return i.value = !1;
    i.value = so(x.value);
    const O = new Set(a.value.map((F) => F.id));
    return a.value = [...a.value, ...x.value.rows.filter((F) => !O.has(F.id))], !0;
  }
  let y = 0;
  async function C() {
    const w = ++y, x = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (w !== y) return;
    const O = x.ok ? s.shared ? [x.value] : x.value.rows : [], F = O.length ? Math.min(...O.map((T) => T.id)) : 0;
    a.value = n && x.ok && F ? [...a.value.filter((T) => T.id > Math.max(...O.map((g) => g.id))), ...O, ...a.value.filter((T) => T.id < F)] : O, x.ok && !a.value.some((T) => T.id < F) && (i.value = !s.shared && so(x.value)), o.value = x.ok ? "" : x.error, r.value = !0;
  }
  async function M(w, x = null) {
    const O = a.value;
    x && (a.value = x(O));
    const F = await s.run(w);
    return x && !F.ok && (a.value = O), l.value = F.ok ? "" : F.error, u.value = F.ok ? F.value : null, await C(), F;
  }
  return s.follow(t, f), C(), { rows: a, failure: o, loaded: r, more: i, load: C, older: v, act: M, actionFailure: l, answer: u, context: s };
}
const Sm = { class: "title" }, _m = { class: "state" }, Em = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Mm(t.line, t.events);
    return (o, r) => (c(), G(Dl, {
      rows: V(n),
      failure: V(s),
      loaded: V(a),
      empty: e.empty
    }, {
      default: U(({ row: i }) => [
        p("span", Sm, k(i.title), 1),
        p("span", _m, k(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Wk = /* @__PURE__ */ K(Em, [["__scopeId", "data-v-a69084cd"]]);
function Am(e = 1e3, t = null) {
  const n = D(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? be(t, a, { immediate: !0 }) : a(!0), Ie(() => clearInterval(s)), n;
}
const hs = D(Date.now() / 1e3);
let ao = 0, bn = 0;
function Cm() {
  return bn || (hs.value = Date.now() / 1e3, ao = setInterval(() => hs.value = Date.now() / 1e3, 1e3)), bn += 1, Ro() && Bo(() => {
    bn -= 1, bn || clearInterval(ao);
  }), hs;
}
const Om = ["title", "data-figure-mark", "data-folded", "data-open"], Tm = {
  key: 2,
  class: "worker"
}, Im = { class: "head" }, Rm = { key: 0 }, Bm = {
  key: 3,
  class: "status"
}, Lm = {
  key: 0,
  class: "figure"
}, Dm = {
  key: 1,
  class: "ran-for"
}, Nm = { key: 2 }, Pm = {
  key: 3,
  class: "news"
}, jm = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, qm = {
  key: 6,
  class: "settled"
}, Fm = {
  key: 1,
  class: "bar"
}, Wm = {
  key: 3,
  class: "detail body"
}, Hm = {
  key: 0,
  class: "body-label"
}, Um = ["title"], zm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ra(), s = ["onClick", "onAct"], a = R(() => Object.fromEntries(Object.entries(n).filter(([Q]) => !s.includes(Q)))), o = D(!1), r = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = R(() => t.open !== void 0), l = R(() => i.value || r.value), u = R(() => i.value ? t.open : o.value), d = R(() => i.value ? !t.open : r.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), v = R(() => l.value || f.value || !!n.onClick), y = D(null), C = D(null), { folded: M, phase: w } = Sr(y, () => d.value);
    function x(Q) {
      var ee, Z;
      if (!(Q.target !== y.value && !C.value.contains(Q.target))) {
        if (i.value) return (ee = n.onClick) == null ? void 0 : ee.call(n, Q);
        if (r.value) return void (o.value = !o.value);
        (Z = n.onAct || n.onClick) == null || Z(Q);
      }
    }
    const O = (Q) => n.onAct(Q), F = ["failed", "unfinished"], T = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? F.includes(t.mark.state) ? "danger" : "good" : ""), g = R(() => t.mark.color ? t.mark.color : T.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : T.value ? `var(--tone-${T.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), B = R(() => g.value || "var(--tone-work)"), E = R(() => !t.mark.ending && !t.mark.ended && T.value !== "stopped"), I = Cm(), $ = R(
      () => t.mark.began_at && E.value && !t.mark.figure && !t.mark.counting ? Lf(I.value - t.mark.began_at) : ""
    ), _ = R(() => {
      const { started: Q, ended: ee } = t.mark;
      return Q ? ee ? `ran ${Za(ee - Q, !0)}` : Za(I.value - Q, !0) : $.value;
    }), b = ["bad", "danger", "warn"], m = R(() => b.includes(T.value) || t.mark.asks ? "attention" : E.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), L = ["bad", "danger"], N = R(() => L.includes(T.value)), W = R(() => m.value === "process" ? "running" : N.value ? "cross" : T.value === "stopped" ? "stopped" : T.value === "good" ? "tick" : ""), re = R(
      () => !!(t.mark.figure || _.value || t.mark.docked || t.mark.stopping || W.value || t.mark.settled || t.mark.news)
    ), le = R(() => [t.mark.title, t.mark.time ? _r(t.mark.time) : ""].filter(Boolean).join(" · ")), de = R(() => ({
      ...g.value ? { "--mark": g.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (Q, ee) => (c(), h("div", ut(a.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${m.value}`,
        V(w),
        {
          open: u.value,
          folding: i.value && d.value,
          live: v.value,
          failed: N.value,
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
      "data-folded": V(M) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (c(), G(xt(v.value ? "button" : "span"), {
        ref_key: "top",
        ref: C,
        class: "top",
        type: v.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: U(() => [
          e.mark.markIcon ? (c(), G(tt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), G(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Tm, k(e.mark.worker), 1)) : S("", !0),
          p("span", Im, [
            P(it, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Rm, k(e.mark.name), 1)) : S("", !0),
            l.value ? (c(), G(Zt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : S("", !0)
          ]),
          re.value ? (c(), h("span", Bm, [
            e.mark.figure ? (c(), h("span", Lm, k(e.mark.figure), 1)) : S("", !0),
            _.value ? (c(), h("span", Dm, k(_.value), 1)) : S("", !0),
            e.mark.stopping ? (c(), h("span", Nm, "Stopping")) : S("", !0),
            e.mark.news ? (c(), h("span", Pm, k(e.mark.news), 1)) : S("", !0),
            W.value === "running" ? (c(), h("span", jm)) : W.value ? (c(), G(tt, {
              key: 5,
              class: J(["sign", W.value]),
              name: W.value
            }, null, 8, ["class", "name"])) : S("", !0),
            e.mark.settled ? (c(), h("span", qm, k(e.mark.settled), 1)) : S("", !0)
          ])) : S("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), G($r, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: xe(O, ["stop"])
      }, null, 8, ["label", "open"])) : S("", !0),
      (e.mark.figure || e.mark.counting) && E.value ? (c(), h("span", Fm, [
        p("span", {
          class: "progress",
          style: pe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: B.value })
        }, null, 4)
      ])) : S("", !0),
      e.mark.detail && !V(M) ? (c(), G(it, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : S("", !0),
      e.mark.body && !V(M) ? (c(), h("div", Wm, [
        e.mark.bodyLabel ? (c(), h("p", Hm, k(e.mark.bodyLabel), 1)) : S("", !0),
        P(it, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : S("", !0),
      e.mark.command && !V(M) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, Um)) : S("", !0),
      e.mark.card ? (c(), G(it, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : S("", !0),
      he(Q.$slots, "default", {
        shown: !V(M)
      }, void 0, !0)
    ], 16, Om));
  }
}), Or = /* @__PURE__ */ K(zm, [["__scopeId", "data-v-74d78abb"]]), Vm = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Tr(e) {
  var n;
  const t = Vm[e] || ((n = cn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Gm = (e) => Tr(String(e).split(":")[0]), Ir = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Km = { passed: "good", failed: "danger", warned: "warn", running: "" }, Ym = { good: "good", warn: "warn", danger: "danger" }, oo = {
  "open row": (e) => Xe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => _l(e.target_model, e.target_id || 0)
}, Jm = { "open row": (e) => Gm(e.target_model), "open page": () => Tr("pages") };
function Zm(e, t) {
  const n = t || {}, s = oo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Km[e.outcome] || "" : Ym[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Jm[s](e) : "",
    handlers: s ? { onAct: () => oo[s](e) } : {}
  };
}
const Xm = 24, Qm = 1e3, ro = 2e3, ep = 0.25, tp = 5e3;
function np(e, t = Xm, n = () => !0) {
  const s = D(!1), a = D(0), o = D(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const T = u();
    return T ? T.scrollHeight - T.scrollTop - T.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function v(T) {
    if (clearTimeout(r), !T) {
      o.value = !1, l = Date.now();
      return;
    }
    const g = Date.now() - l < ro ? ro : Qm;
    r = setTimeout(() => o.value = s.value, g);
  }
  function y() {
    clearTimeout(i), s.value = !1, a.value = 0, v(!1);
  }
  function C(T = !1) {
    const g = u();
    g && T && g.scrollTo ? g.scrollTo({ top: g.scrollHeight, behavior: "smooth" }) : g && (g.scrollTop = g.scrollHeight), y();
  }
  function M() {
    x(), !s.value && (s.value = !0, v(!0));
  }
  const w = () => !!u() && d() <= u().clientHeight * ep;
  function x() {
    clearTimeout(i), w() && (i = setTimeout(() => s.value && w() && n() && C(!0), tp));
  }
  function O() {
    f() ? y() : M();
  }
  function F(T = 1, g = !1) {
    s.value ? a.value += Math.max(0, T) : C(g);
  }
  return Ro() && Bo(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: y, toBottom: C, left: M, scrolled: O, arrived: F };
}
const sp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, ap = (e) => String(e ?? "").replace(sp, ""), op = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(null), { away: o, scrolled: r, arrived: i, toBottom: l } = np(a);
    be(
      () => n.lines.length,
      () => Lt(() => i()),
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
      ce(k(V(ap)(e.lines.join(`
`)) || e.empty), 1),
      V(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (v) => V(l)(!0))
      }, "Follow")) : S("", !0)
    ], 544));
  }
}, rp = /* @__PURE__ */ K(op, [["__scopeId", "data-v-d9fa8127"]]), ip = 1e4;
class lp {
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
    return this.heardAt !== null && t - this.heardAt > ip;
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
const cp = {
  key: 0,
  class: "frame-note"
}, up = {
  key: 0,
  class: "frame-note"
}, dp = ["src", "title"], hp = 1e3, fp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Un(), s = D(null), a = D(!1), o = D(!1);
    let r = null, i = 0;
    return Be(() => {
      r = new lp(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, hp);
    }), Ie(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", cp, "This window was closed because it stopped answering.")) : (c(), h(Y, { key: 1 }, [
      a.value ? (c(), h("div", up, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        P(ke, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: U(() => [...u[1] || (u[1] = [
            ce("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : S("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: V(n).window
      }, null, 8, dp)
    ], 64));
  }
}, mp = /* @__PURE__ */ K(fp, [["__scopeId", "data-v-32a49046"]]), pp = 0, gp = "/api/lines", vp = "/api/line";
class yp {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), pp));
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
        const n = await qe.raw(gp, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await qe.raw(vp, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const wp = new yp();
class kp {
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
      n.patterns.some((s) => Rr(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Rr(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const bp = Symbol("pane-page"), xp = { 1: "refused", 2: "usage", 3: "fault" }, $p = 100, Mp = 50, Sp = /"([^"]*)"|'([^']*)'|(\S+)/g;
function _p({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = D({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: v = "", tabs: y = [], search: C = {}, readOnly: M = !1, shared: w = null }) {
  const x = /* @__PURE__ */ new Map(), O = new AbortController(), F = D(!1);
  let T = 0, g = 0;
  const B = () => {
    clearTimeout(g), g = setTimeout(() => {
      T === 0 && (F.value = !0);
    }, Mp);
  }, E = (I) => {
    const $ = x.get(I);
    if ($ && performance.now() - $.at < $p) return $.answer;
    T += 1;
    const _ = Lr(e, I, t, O.signal).finally(() => {
      T -= 1, B();
    });
    return x.set(I, { answer: _, at: performance.now() }), _;
  };
  return {
    answered: F,
    settle: B,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => s()),
    permissions: a,
    autoScroll: v,
    tabs: y,
    search: C,
    readOnly: M,
    shared: w,
    read: E,
    run: (I) => Qt(e, I, t, O.signal),
    upload: (I) => Ap(I, O.signal),
    cancel: () => O.abort(),
    subscriptions: r,
    follow: (I, $) => r.follow(e, I.filter((_) => o.some((b) => Rr(b, _))), $, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (I) => R(() => {
      var $;
      return l.value[I] ?? (($ = u.find((_) => _.key === I)) == null ? void 0 : $.default);
    }),
    setting: async (I, $) => {
      const _ = await E(`window setting ${e} ${I}`);
      return _.ok ? _.value.value : $;
    },
    setOption: f,
    keep: (I, $) => Qt(e, ["window", "save-setting", e, I, JSON.stringify($)], t, O.signal)
  };
}
function Ep(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Xt = { ok: !1, failure: "cancelled", error: "" }, Br = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Qt(e, t, n, s = void 0) {
  try {
    const a = await wp.add({ window: e, line: Array.isArray(t) ? t : Cp(t), environment: n }, s);
    return s != null && s.aborted ? Xt : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: xp[a.code] || "fault", error: Ep(a.error) };
  } catch {
    return s != null && s.aborted ? Xt : { ok: !1, failure: "unreachable", error: Br };
  }
}
async function Lr(e, t, n, s) {
  const a = await Qt(e, t, n, s);
  return a.failure !== "unreachable" || !ia() ? a : (await Sc(), s.aborted ? Xt : Lr(e, t, n, s));
}
async function Ap(e, t = void 0) {
  try {
    const n = await qe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? Xt : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Xt : { ok: !1, failure: "unreachable", error: Br };
  }
}
function Cp(e) {
  return [...e.matchAll(Sp)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Op({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Tp = {
  class: "allowance-prompt",
  role: "dialog"
}, Ip = { class: "allowance-prompt-text" }, Rp = { class: "allowance-prompt-buttons" }, Bp = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Tp, [
      p("p", Ip, k(V(Op)(e.request)), 1),
      p("div", Rp, [
        P(ke, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            ce("Allow", -1)
          ])]),
          _: 1
        }),
        P(ke, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            ce("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Lp = /* @__PURE__ */ K(Bp, [["__scopeId", "data-v-102dc765"]]), fs = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(In, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: U(() => [
        ce(k(e.reason) + " ", 1),
        e.retry ? (c(), G(ke, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            ce("Retry", -1)
          ])]),
          _: 1
        })) : S("", !0),
        e.removable ? (c(), G(ke, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: U(() => [...a[3] || (a[3] = [
            ce("Remove tab", -1)
          ])]),
          _: 1
        })) : S("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Dp = ["data-window", "data-agent"], Np = {
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
    shared: { type: Object, default: null },
    skeleton: { type: Array, default: () => [] }
  },
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(""), o = D(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Te(ul, null), l = _p({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: Te(bp, null),
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
    Ni(Le, l), be(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Be(l.settle), Ie(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), Pi((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => sa(n.component), d = () => {
      var f, v;
      return ((v = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : v.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, v) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), G(Lp, {
        key: 0,
        request: d(),
        onAnswer: v[0] || (v[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : S("", !0),
      e.unavailableReason ? (c(), G(fs, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), G(fs, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(Y, { key: 4 }, [
        (c(), G(u, { key: o.value })),
        e.skeleton.length && !V(l).answered.value ? (c(), G(Er, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : S("", !0)
      ], 64)) : (c(), G(fs, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: v[1] || (v[1] = (y) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Dp));
  }
}, Dr = /* @__PURE__ */ K(Np, [["__scopeId", "data-v-1db91f82"]]), Pp = {
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
    const n = e, s = t, a = { render: () => sa(mp, { src: n.entry.entry_url }) };
    return (o, r) => (c(), G(Dr, {
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
}, jp = ["data-window"], qp = {
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
    return be(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, wc();
          } catch (i) {
            if (vc(i) && yc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      P(Er, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, jp)) : (c(), G(Dr, {
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
      skeleton: e.entry.skeleton,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: i[0] || (i[0] = (l, u) => s("option", l, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, io = "*.*", Fp = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var u;
    const t = e, n = Te(Le, null), s = new kp(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [io], (d) => s.dispatch(d));
    Ie(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? "", r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = R(() => !!(t.declaration.shipped || t.declaration.trusted)), l = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [io] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), G(qp, {
      key: 0,
      entry: l.value,
      subscriptions: V(s),
      environment: V(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(Pp, {
      key: 1,
      entry: l.value,
      subscriptions: V(s),
      environment: V(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Wp = { class: "mark-more-inner" }, Hp = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Up = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, zp = {
  key: 3,
  class: "mark-lines"
}, Vp = "process", lo = "task", Gp = 2e3, Kp = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Te(Le), s = R(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = R(() => Ir.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === lo ? t.mark.target_id : 0), r = D([]), i = D(!1), l = D(""), u = R(() => t.mark.target_model === Vp && !!t.mark.target_id);
    async function d() {
      const y = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, l.value = y.ok ? "" : y.error, y.ok && (r.value = y.value.lines);
    }
    let f = null;
    const v = () => clearInterval(f);
    return be(() => t.shown && u.value, (y) => {
      v(), y && (d(), t.mark.ended_at || (f = setInterval(d, Gp)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (y) => y && t.shown && u.value && (v(), d())), Ie(v), (y, C) => (c(), h("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: C[1] || (C[1] = xe(() => {
      }, ["stop"]))
    }, [
      p("div", Wp, [
        e.declaration.body_url ? (c(), G(Fp, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(Y, { key: 1 }, [
          a.value ? (c(), h(Y, { key: 0 }, [
            C[2] || (C[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Hp, k(a.value), 1)
          ], 64)) : S("", !0),
          u.value && l.value ? (c(), h("p", Up, k(l.value), 1)) : u.value && i.value ? (c(), h(Y, { key: 2 }, [
            C[3] || (C[3] = p("p", { class: "mark-label" }, "Output", -1)),
            P(rp, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", zp, k(s.value.join(`
`)), 1)) : S("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: C[0] || (C[0] = xe((M) => V(Xe)(`${lo}:${o.value}`), ["stop"]))
          }, "Open task " + k(o.value) + " and its proofs", 1)) : S("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Vs = /* @__PURE__ */ K(Kp, [["__scopeId", "data-v-51f69bf1"]]), Yp = (e) => `show-${e}`, Hk = (e, t, n) => e.filter((s) => {
  var a;
  return n(Yp((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Jp = "messages.chat", Zp = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), Nr = (e, t, n) => Qt(Jp, Zp(e, t), n), Xp = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Qp = ["title", "aria-label", "onClick"], eg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, tg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => Xp(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = D(""), a = Te(Le);
    async function o(r) {
      const i = await Nr(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(Y, null, [
      (c(!0), h(Y, null, se(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: xe((u) => o(l), ["stop"])
      }, [
        P(tt, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Qp))), 128)),
      s.value ? (c(), h("span", eg, k(s.value), 1)) : S("", !0)
    ], 64));
  }
}, ng = /* @__PURE__ */ K(tg, [["__scopeId", "data-v-0dfda102"]]);
function Pr(e, t) {
  const n = Wn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await qe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const jr = Pr("/api/marks", "marks"), Uk = jr.fetchAll, sg = jr.find, ag = 2e3;
function qr(e, t, n = ag) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  Be(async () => {
    await e(), a();
  }), Dt(() => clearTimeout(s));
}
const og = ["data-ref"], rg = ["data-ref"], ig = { class: "mark-row" }, lg = "dock add", cg = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = R(() => sg(s.mark.type)), o = Te(Le, null), r = R(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = D(null);
    qr(async () => {
      if (!r.value) return;
      const y = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      y.ok && y.value.rows.length && (i.value = y.value.rows[0].progress);
    }, () => r.value);
    const l = R(() => {
      const y = Zm(s.mark, a.value), C = !y.figure || y.figure.endsWith("%");
      return i.value && r.value && C ? { ...y, figure: `${i.value}%`, fraction: i.value / 100 } : y;
    }), u = R(() => {
      var y;
      return !!(s.mark.lines || s.mark.detail && Ir.has(s.mark.variant) || t.has(s.mark.target_model) || (y = a.value) != null && y.body_url);
    }), d = D(!1);
    function f(y) {
      if (l.value.handlers.onAct && !y.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const v = R(() => {
      var y, C, M;
      return s.docked ? (C = (y = a.value) == null ? void 0 : y.buttons) == null ? void 0 : C.filter((w) => {
        var x;
        return !((x = w.runs) != null && x.startsWith(lg));
      }) : (M = a.value) == null ? void 0 : M.buttons;
    });
    return (y, C) => {
      var M, w;
      return (M = a.value) != null && M.card ? (c(), h("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": V(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        P(Vs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, og)) : (c(), h("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (w = a.value) == null ? void 0 : w.full_width, docked: e.docked, "user-side": V(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", ig, [
          P(Or, ut({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, ji(l.value.handlers), { onClick: f }), qi({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: U(({ shown: x }) => [
                P(Vs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: x
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          P(ng, {
            buttons: v.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, rg));
    };
  }
}, ug = /* @__PURE__ */ K(cg, [["__scopeId", "data-v-cc29b2a4"]]), dg = ["data-ref"], hg = ["inert"], fg = { class: "group-fold" }, mg = { class: "thread-group" }, pg = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = D(!1), s = D(!1), a = D(!1), o = D(null);
    be(n, async (i) => {
      var l;
      s.value = !0, await Lt(), (l = o.value) == null || l.offsetHeight, a.value = i;
    });
    const r = R(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (i, l) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      P(Or, {
        mark: r.value,
        open: n.value,
        onClick: l[0] || (l[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: J(["group-rows", { open: a.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", fg, [
          p("div", mg, [
            (c(!0), h(Y, null, se(e.group.marks, (u) => (c(), G(ug, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, hg)) : S("", !0)
    ], 8, dg));
  }
}, zk = /* @__PURE__ */ K(pg, [["__scopeId", "data-v-594fc44f"]]);
function gg(e) {
  const t = D(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Be(() => n.observe(e.value)), Dt(() => n.disconnect()), t;
}
const vg = { class: "chat-dock-fold" }, yg = ["aria-label"], wg = { class: "chat-dock-head" }, kg = { class: "chat-dock-inner" }, Fr = 700, bg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = D(null), s = D(null), a = gg(s), o = D(!1);
    let r = 0;
    return Be(() => r = setTimeout(() => o.value = !0, Fr)), Dt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", vg, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          he(i.$slots, "edge"),
          p("header", wg, [
            he(i.$slots, "head")
          ]),
          p("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", kg, [
              p("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: pe(V(a) === null ? null : { height: `${V(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  he(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, yg)
      ])
    ], 2));
  }
}, Wr = /* @__PURE__ */ K(bg, [["__scopeId", "data-v-63e4dcfc"]]), xg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ms = 5, $g = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ms, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${ms}s`, animationDelay: `${(n - ms).toFixed(2)}s` };
    return (a, o) => (c(), h("span", xg, [
      p("i", { style: s })
    ]));
  }
}, Hr = /* @__PURE__ */ K($g, [["__scopeId", "data-v-d0c4b012"]]), Ur = Pr("/api/docks", "docks"), Vk = Ur.fetchAll, Gs = Ur.find, Mg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ks = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), Sg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), _g = (e) => e.kept ? Ks("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : Ks("keep", "pin", "Pin", `dock keep ${e.id}`), Eg = ["pin", "stop"], Ag = (e) => ({ ...e, iconOnly: Eg.includes(e.icon) });
function Cg(e, t) {
  var n;
  return [
    ...Sg(e, t) ? [_g(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || cn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Ks("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(Ag);
}
const Og = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Mg(e, t),
  buttons: Cg(e, t)
}), Tg = { class: "dock-title" }, Ig = ["aria-expanded", "title"], Rg = { class: "chat-dock-acts dock-acts" }, Bg = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Lg = {
  key: 1,
  class: "dock-text"
}, Dg = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = R(() => Gs(s.item.type)), o = D(null), r = R(() => Og(s.item, a.value)), i = Te(Le), l = D(/* @__PURE__ */ new Set()), u = D("");
    async function d(y) {
      if (y.action === "open") return Xe(`${s.item.target_model}:${s.item.target_id}`);
      y.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, y.label])), u.value = "";
      const M = await Nr(y, s.item, i.environment);
      (M == null ? void 0 : M.ok) === !1 && (l.value = new Set([...l.value].filter((w) => w !== y.label)), u.value = M.error);
    }
    const f = R(() => r.value.buttons.filter((y) => y.action !== "undock" && !l.value.has(y.label))), v = R(() => r.value.buttons.find((y) => y.action === "undock"));
    return (y, C) => (c(), G(Wr, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: U(() => [
        e.leaving ? (c(), G(Hr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : S("", !0)
      ]),
      head: U(() => {
        var M, w, x;
        return [
          (M = a.value) != null && M.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(Y, { key: 1 }, [
            P(ye, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", Tg, k(r.value.title), 1)
          ], 64)),
          (w = a.value) != null && w.badge ? (c(), h("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, k(a.value.badge), 3)) : S("", !0),
          (x = a.value) != null && x.draws_head ? S("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: C[0] || (C[0] = (O) => n("fold"))
          }, [
            P(Zt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, Ig)),
          p("span", Rg, [
            (c(!0), h(Y, null, se(f.value, (O) => (c(), h(Y, {
              key: O.action + O.runs
            }, [
              O.iconOnly ? (c(), G(ke, {
                key: 0,
                kind: "icon",
                "aria-label": O.label,
                title: O.label,
                "data-dock-action": O.action,
                onClick: (F) => d(O)
              }, {
                default: U(() => [
                  P(ye, {
                    name: O.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), G(ke, {
                key: 1,
                small: "",
                kind: O.primary ? "primary" : "ghost",
                bordered: !O.primary,
                "data-dock-action": O.action,
                onClick: (F) => d(O)
              }, {
                default: U(() => [
                  ce(k(O.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          P(Kn, {
            title: v.value.label,
            "data-dock-action": "undock",
            onClick: C[1] || (C[1] = (O) => d(v.value))
          }, null, 8, ["title"])
        ];
      }),
      default: U(() => {
        var M, w;
        return [
          u.value ? (c(), h("p", Bg, k(u.value), 1)) : S("", !0),
          e.item.text && !((M = a.value) != null && M.body_url) ? (c(), h("p", Lg, k(e.item.text), 1)) : S("", !0),
          (w = a.value) != null && w.body_url ? (c(), G(Vs, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : S("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded", "data-figure-closing"]));
  }
}, co = /* @__PURE__ */ K(Dg, [["__scopeId", "data-v-109b82ce"]]), Ng = 6, Pg = 3, uo = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, yt = (e) => !!(e.leaves_at && !e.kept), jg = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!yt(e) || t < e.leaves_at || n.has(e.id)), qg = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => jg(s, t, n)).sort((s, a) => s.id - a.id);
function Fg(e, t, n = Ng) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const Wg = (e, t, n = e) => n < 2 ? !1 : e >= Pg ? !0 : t, Hg = ["title", "aria-label"], Ug = { class: "run-chip-in" }, zg = {
  key: 0,
  class: "run-chip-ring"
}, Vg = { class: "run-chip-name" }, Gg = { class: "run-chip-bar" }, Kg = "processes.output", Yg = 5e3, Jg = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = Te(Le, null)) == null ? void 0 : d.environment) ?? "", o = D(null), r = R(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = R(() => {
      var f, v;
      return ((f = o.value) == null ? void 0 : f.title) || ((v = o.value) == null ? void 0 : v.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = R(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await Qt(Kg, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return qr(u, () => r.value, Yg), (f, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: pe({ "--tone": l.value })
      }, [
        V(yt)(e.item) ? (c(), G(Hr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : S("", !0),
        p("span", Ug, [
          r.value ? (c(), h("span", zg)) : (c(), G(tt, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", Vg, k(i.value), 1)
        ]),
        p("span", Gg, [
          p("i", {
            style: pe({ width: r.value ? `${((y = o.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, Hg);
    };
  }
}, Zg = /* @__PURE__ */ K(Jg, [["__scopeId", "data-v-597b05d2"]]), Xg = 24, Qg = 8, Gk = 420;
function Kk({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= Xg && e > t ? !0 : e < t && a > Qg ? !1 : null;
}
const e0 = (e, t) => e === void 0 ? t : e, zr = "journal.viewer.";
function t0(e, t, n) {
  try {
    const s = n.getItem(zr + e);
    return s === null ? t : JSON.parse(s);
  } catch {
    return t;
  }
}
function n0(e, t, n) {
  try {
    n.setItem(zr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function s0(e, t, n = window.localStorage) {
  const s = D(t0(e, t, n));
  return be(s, (a) => n0(e, a, n), { deep: !0 }), s;
}
const a0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, o0 = { class: "dock-runs-chips" }, r0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var O;
    const t = e, n = Am(500), s = D(/* @__PURE__ */ new Set()), a = D(!1), o = D(!1), r = R(() => qg(t.items, n.value, s.value)), i = R(() => Fg(r.value.filter((F) => uo(F, Gs)), n.value)), l = R(() => r.value.filter((F) => !i.value.includes(F) && !uo(F, Gs))), u = R(() => i.value.filter((F) => !yt(F))), d = R(() => (a.value = Wg(i.value.length, a.value, u.value.length)) && !o.value), f = s0(`dock-folded:${((O = ue.identity) == null ? void 0 : O.root) || location.host}`, {}), v = (F) => e0(f.value[F.id], t.folded);
    function y(F) {
      f.value = { ...f.value, [F.id]: !v(F) };
    }
    function C(F) {
      f.value = { ...f.value, ...Object.fromEntries(i.value.map((T) => [T.id, T.id !== F.id])) }, o.value = !0;
    }
    function M() {
      f.value = Object.fromEntries(Object.entries(f.value).filter(([F]) => !i.value.some((T) => String(T.id) === F))), o.value = !1;
    }
    function w(F) {
      s.value = /* @__PURE__ */ new Set([...s.value, F.id]);
    }
    function x(F) {
      s.value = new Set([...s.value].filter((T) => T !== F.id));
    }
    return (F, T) => (c(), G(To, {
      tag: "div",
      name: "dock",
      duration: V(Fr),
      class: "dock-stack"
    }, {
      default: U(() => [
        (c(!0), h(Y, null, se(l.value, (g) => (c(), G(co, {
          key: g.id,
          item: g,
          class: J({ timed: V(yt)(g) }),
          leaving: V(yt)(g) && !s.value.has(g.id),
          folded: v(g),
          onFold: (B) => y(g),
          onMouseenter: (B) => w(g),
          onMouseleave: (B) => x(g)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", a0, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: M
          }, [
            ce(k(i.value.length) + " runs ", 1),
            P(Zt, { open: "" })
          ])
        ])) : S("", !0),
        (c(!0), h(Y, null, se(d.value ? [] : i.value, (g) => (c(), G(co, {
          key: g.id,
          item: g,
          class: J({ timed: V(yt)(g) }),
          leaving: V(yt)(g) && !s.value.has(g.id),
          folded: v(g),
          onFold: (B) => y(g),
          onMouseenter: (B) => w(g),
          onMouseleave: (B) => x(g)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        d.value ? (c(), G(Wr, {
          key: "runs-row",
          label: `${i.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: U(() => [
            p("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: T[0] || (T[0] = (g) => o.value = !0)
            }, [
              P(tt, { name: "runs" }),
              ce(" " + k(i.value.length) + " runs ", 1),
              P(Zt)
            ]),
            p("span", o0, [
              (c(!0), h(Y, null, se(i.value, (g) => (c(), G(Zg, {
                key: g.id,
                item: g,
                onClick: (B) => C(g)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : S("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, Yk = /* @__PURE__ */ K(r0, [["__scopeId", "data-v-d1269c43"]]), wt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, An = (e) => Math.min(Math.max(e, 0), 1), i0 = (e) => {
  const t = An(e);
  return t * t * (3 - 2 * t);
}, mt = (e, t, n) => i0((e - t) / (n - t));
function Jk(e) {
  const t = An(e), n = An((t - 0.12) / 0.76) * wt.shuffles, s = Math.min(Math.floor(n), wt.shuffles - 1), a = n - s, o = mt(a, 0.26, 0.38) * (1 - mt(a, 0.76, 0.96)), r = mt(a, 0.38, 0.76), i = mt(t, 0, 0.12) * (1 - mt(t, 0.88, 1)), l = mt(a, 0.2, 0.34) * (1 - mt(a, 0.84, 1)), u = Math.sin(Math.PI * An((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / wt.shuffles, lift: wt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function Zk(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const ho = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, Xk = (e) => ho[e] ?? ho.butler, va = 2400, l0 = 0.05;
function c0({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, l0), r = Math.min(t + va * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function Qk(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function u0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function eb(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const tb = (e, t) => ({ ...e, stretch: t.stretch }), nb = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Vr = (e, t) => t >= (e.least ?? 0);
function sb(e, t, n) {
  if (!Vr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const ab = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), d0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", fo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), h0 = (e) => e.right > e.left && e.bottom > e.top;
function ob(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(d0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = fo(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = fo(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), h0(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function Gr(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, v] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[f] || e[d] > o[v]) && (i = -1);
      else {
        const C = (o[f] - e[d]) / y, M = (o[v] - e[d]) / y;
        r = Math.max(r, Math.min(C, M)), i = Math.min(i, Math.max(C, M));
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
}, en = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), f0 = (e) => e * e * (3 - 2 * e), _e = (e, [t, n]) => f0(en(e, t, n)), m0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], lt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, xn = ([e, t], n) => e + n() * (t - e);
function p0(e) {
  return m0.map(() => {
    const t = xn(lt.speed, e), n = xn(lt.angle, e) * Math.PI / 180, s = xn(lt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [xn(lt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const g0 = p0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function v0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * lt.gravity * (t[2] - lt.floor))) / lt.gravity;
}
function rb(e, t, n = g0) {
  const s = Se.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = v0(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= lt.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const ib = (e, t) => e && Se[e.name] ? { name: e.name, u: t / e.frames } : null;
function lb(e, t) {
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
const cb = () => Array.from({ length: Se.pogo.count }, (e, t) => Se.pogo.bounce * (t + 1) / Se.pogo.count), Tt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function ub(e, t, n) {
  const { away: s, side: a } = Se.bug_smash, o = a * s * n, [r, i] = [t.left + Tt.margin * n, t.right - Tt.margin * n], l = Math.min(Math.max(e + o + a * Tt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function db(e, t, n) {
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
function hb(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Tt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = c0({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Oe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function fb(e) {
  const t = Oe.least + Math.floor(e() * (Oe.most - Oe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Oe.walls[Math.floor(e() * Oe.walls.length)],
    along: Oe.margin + e() * (1 - 2 * Oe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Ys(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Oe.margin, r = ((e.along - Oe.margin + e.way * Oe.speed * n / s) / a % 2 + 2) % 2, i = Oe.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Oe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Oe.inset : t.right - Oe.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function y0(e, t) {
  const n = Se.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = u0(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function mb(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Se.bug_shot, { frame: r, bug: i, shot: l } = y0(n, e.length), u = e.map((x, O) => ({ ...Ys(x, t, Math.min(n / o.fps, Cn(O).shot)), shot: O < l })), d = _e(r / o.frames, o.aim), [f, v] = [u[Math.max(i - 1, 0)], u[i]], y = e.map((x, O) => ({ bug: x, index: O, seconds: n / o.fps - Cn(O).shot, spot: Ys(x, t, Cn(O).shot) })).filter((x) => x.seconds >= 0), C = y.flatMap((x) => {
    const O = (a == null ? void 0 : a.get(x.index)) ?? $0(x.bug, t, x.spot, a ? [] : s);
    return a == null || a.set(x.index, O), a && M0(O, x.seconds, s), S0(O, x.seconds, s);
  }), M = y.filter((x) => b0(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), w = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (v.x - f.x) * d, y: f.y + (v.y - f.y) * d, back: w }, slush: C, camera: M };
}
function Cn(e) {
  const t = Se.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function pb(e, t, n, s) {
  const { limit: a, margin: o } = Se.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Cn(d), v = Ys(u, t, f.shot), y = Math.abs(v.y - n.y) / Math.tan(a * Math.PI / 180), C = v.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - v.x), M = Math.abs(v.x - l) >= y ? l : v.x + C * y, w = C > 0 ? Math.max(l, Math.min(M, i)) : Math.min(l, Math.max(M, r)), x = { from: l, to: w, begin: f.walk, end: f.aim };
    return l = w, x;
  });
}
function gb(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, w0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function k0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const b0 = (e) => e.along * 97 % 1 < $e.camera, tn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function x0(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += $e.step) {
    const d = Math.min(u + $e.step, r.t), f = tn(e, d), v = Gr(i, f, n);
    if (v) return { ...v, t: u + (d - u) * v.share };
    i = f;
  }
  const l = tn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function $0(e, t, n, s = []) {
  const a = k0(e.along + 1), [o, r] = w0[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: $e.count }, () => {
    const l = i + (a() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + a() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: $e.radius[0] + a() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...x0(d, t, s) };
  });
}
function M0(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += $e.step) {
      const r = Math.min(o + $e.step, a), i = Gr(tn(s, o), tn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function S0(e, t, n = []) {
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
function vb(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Se.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = _e(e, [0, u]), v = _e(e, [u, u + d]);
  return r.map((y) => {
    const C = { x: s.x + y.at[0] * t, y: s.y + y.at[1] * t };
    return {
      x: n.x + (C.x - n.x) * f,
      y: n.y + (C.y - n.y) * f,
      r: y.size * t * (0.15 + 0.85 * f * f),
      run: v * v * t * 1.2,
      fade: 1 - v,
      landed: f >= 1
    };
  });
}
function yb(e, t, n, s, a) {
  const { sway: o, above: r } = Se.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (M) => {
    const [w, x] = [M.x - e.at.x, M.y - e.at.y];
    return { x: i.x + w * u - x * d, y: i.y + w * d + x * u };
  }, [v, y] = [...n].sort((M, w) => M.x - w.x), C = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: C.map((M, w) => ({ from: M, to: w < C.length / 2 ? v : y })) };
}
const wb = (e, t) => _e(t, e.grows) * (1 - _e(t, e.sinks));
function Dn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: en(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: en(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function kb(e, t) {
  const n = Se[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Dn(n, t), r = 1 - (1 - n.small) * _e(s, n.shrinks) * (1 - _e(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Dn(n, t), o = n.flat * _e(s, n.squashes) * (1 - _e(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * en(a, ...n.springs)) * (1 - en(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const bb = (e) => e === "pack_box";
function xb(e) {
  const { into: t, out: n } = Dn(Se.rope_swing, e);
  return 1 - _e(t, [0, 1]) * (1 - _e(n, [0, 1]));
}
function $b(e) {
  const t = Se.rope_swing, { into: n, out: s } = Dn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return _e(n, [0, 1]) * (1 - _e(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const _0 = { after: 3 }, ya = 10, E0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, A0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, C0 = { weight: 19 }, Kr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, O0 = { every: 120 }, Yr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Jr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, T0 = {
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
}, hn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: ya }), te = (e, t, n = {}) => hn(e, "clip", t, n), ps = (e, t, n = {}) => hn(e, "look", t, n), mo = (e, t, n = {}) => hn(e, "gaze", t, n), me = (e, t, n = {}, s = {}) => ({ ...hn(e, "pick", t, n), ...s }), ve = (e) => hn("nothing", "nothing", e, {}), I0 = 120, R0 = 300, gs = (e, t) => ({ ...te(e, t), cooldown: R0 }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), B0 = () => [te("joy", 2)], pt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), gt = (e) => ({ ...e, cooldown: E0[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: A0[e.name] }), Zn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...oe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), ve(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...oe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...gt(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...gt(te("bug_smash", 2)), toward: "", onto: !1 },
    te("nod", 2)
  ]),
  ...oe("tests_failed", { cooldown: 20, toward: "card" }, [te("startled", 2), te("dismay", 1), te("tantrum", 3), ve(1)]),
  ...oe("committed", { cooldown: 30, toward: "card", onto: !0 }, [te("nod", 2), ve(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...oe("sin_fixed", { cooldown: 300 }, [te("halo", 1), ve(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...oe("sin_committed", { cooldown: 300 }, [te("repent", 1), ve(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...oe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [te("nod", 4), te("hand_rub", 4), ve(7)]),
  ...oe("question_asked", { cooldown: 60 }, [te("ask_sign", 9), te("look_up", 3), ve(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...oe("reported", { cooldown: 90 }, [mo("read", 3), te("nod", 1), ve(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...oe("read_message", { cooldown: 30 }, [mo("read", 3), ve(1)]),
  ...oe("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ve(6)]),
  ...oe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ve(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...oe("bar_done", { holds: !0 }, B0()),
  ...oe("bar_failed", { holds: !0 }, [te("fume", 1), te("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...oe("standing", { cooldown: 12 }, [te("look_left", 2), te("look_right", 2), te("look_up", 1), ve(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...oe("launched", { cooldown: 300 }, [te("tumble", 3), ve(47)]),
  // a break from the hammering now and then
  ...oe("building", { cooldown: 30 }, [te("wipe_brow", 4), te("look_left", 1), te("look_right", 1), ve(69)]),
  ...oe("failed", { cooldown: 20, toward: "card" }, [te("shake", 3), te("tantrum", 2), ve(2)]),
  ...oe("refused", { cooldown: 20 }, [te("shake", 1), ve(1)]),
  ...oe("work_done", { cooldown: 120 }, [te("stretch", 2), ve(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...oe("pondering", { cooldown: [30, 60] }, [me("ponder", 1)]),
  ...oe("thought_cloud", { cooldown: 90 }, [me("cloud", 1)]),
  ...oe("light_bulb", { cooldown: 150 }, [me("bulb", 1)]),
  ...oe("answered", { cooldown: 15 }, [ps("amused", 3), ve(2)]),
  ...oe("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ve(1)
  ]),
  ...oe("long_walk", { cooldown: 90 }, [te("stumble", 3), ve(22)]),
  ...oe("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), ve(13)]),
  ...oe("typing", { cooldown: 60 }, [ps("reading", 1), ve(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(T0).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [ps(t, 1)])),
  ...Object.entries(Yr).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Jr).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
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
    { ...Wt(gt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(gt(te("disco", 2, { ball: "bubble" }))),
    ve(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...oe("held:search", { cooldown: I0 }, [gs("search", 3), { ...gs("binoculars", 2), when: { home: !0 } }, { ...gs("glass_bubble", 2), when: { bubble: !0 } }]),
  ...oe("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...oe("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...oe("spell", {}, [me("writing", 12, { state: "writing" }), me("reading", 12, { state: "reading" }), me("searching", 12, { state: "searching" }), ve(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...oe("tickled", {}, [{ ...gt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...oe("eager", {}, [te("eager", 2, { slow: !0 }), ve(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...oe("jump", {}, [Wt(gt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...oe("climb", {}, [me("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...oe("unit", { cooldown: Kr.build.cooldown }, [me("unit", C0.weight), ve(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...me("hang", 1, { hands: !0, free: !0 }), cooldown: O0.every }, me("stand", 5)]),
  // a digit a blow's dust lets out
  ...oe("digit", {}, [me("0", 1), me("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...oe("roam", {}, [
    me("rest", 35, {}, { stay: [25, 60] }),
    me("seat", 15, {}, { stay: [15, 40] }),
    me("edge", 25, {}, { stay: [8, 20] }),
    Wt(me("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    me("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    me("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    me("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    me("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    me("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Wt(gt(me("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...oe("laptop", {}, [me("seat", 6, {}, { stay: [60, 150] }), me("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...oe("ledge_at", {}, [me("middle", 2, {}, { along: 1 / 2 }), me("third", 1, {}, { along: 1 / 3 }), me("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...oe("composed_as", {}, [
    me("facing", 4, {}, { turn: 0, leans: 0 }),
    me("turned_left", 1, {}, { turn: 335, leans: 0 }),
    me("turned_right", 1, {}, { turn: 25, leans: 0 }),
    me("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    me("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Zr = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Xr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), L0 = (e) => Array.isArray(e) ? e[0] : e, D0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, N0 = (e) => Zn.some((t) => t.when.moment === e);
function P0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || Xr(d).every(([f, v]) => n(f) >= L0(v)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Zn.filter((d) => Zr(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= _0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = P0(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Qr(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Qr(e, t, n) {
  var s;
  for (const [a, o] of Xr(t)) (s = e.memory) == null || s.set(a, e.now + D0(o, n));
}
function Mb(e, t, n) {
  Qr(e, Zn.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const Sb = (e) => Object.values(Kr).find((t) => Zr(t.when, e)) ?? null, j0 = (e, t, n) => n - t <= (e.lifetime ?? ya), _b = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Vr(e.clip, t));
class ei {
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
const Js = {
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
}, Eb = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), ti = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), Ab = {
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
}, Cb = 120, q0 = 20, Ob = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < q0), F0 = (e) => Js[e] || Js.idle, Tb = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, ni = "airborne", W0 = "landing", H0 = "travelling", si = "grounded", Ib = ({ airborne: e, landing: t, trip: n }) => e ? ni : t ? W0 : n != null && n.started ? H0 : si;
function Rb(e, t) {
  var a;
  const n = U0(e, t);
  return e.mode === si && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function U0(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: v = null } = e;
  if (n === ni && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...z0(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const y = v !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? v : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : F0(u), facing: y ? v : i.posture === "sit" ? i.face : f };
}
function z0(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const Zs = (e) => e.outcome, V0 = "plugin:code-commandments:sins:", po = (e) => e.type === "plugins.card" && e.markKey.startsWith(V0), G0 = [
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
], Bb = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: Xo(n) })).sort((n, s) => n.time - s.time), go = { user: "reacted", agent: "agent_reacted" };
function Lb(e, t) {
  return e.filter((n) => go[n.author] && bt(n) > t).map((n) => ({ beat: `${go[n.author]}:${n.emoji}`, time: bt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const K0 = [.../* @__PURE__ */ new Set([...Object.values(Yr).flatMap((e) => Object.keys(e)), ...Object.keys(Jr)])];
function Db(e, t) {
  return e.filter((n) => n.author === "agent" && bt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = K0.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: bt(n), card: Xo(n) })).sort((n, s) => n.time - s.time);
}
const Y0 = (e) => new ei(e).isTest(), Nn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Zs(e)] || "";
}, J0 = 1800, Z0 = (e, t) => {
  if (Nn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Nn(n) !== "finished" && Number(e.time) - Number(n.time) <= J0 ? "tests_fixed" : "tests_passed";
};
function Nb(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(Y0), a = s.filter((i) => Nn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Nn(i))), o.map((i) => ({ beat: Z0(i, a), time: Number(i.time), card: i.key }));
}
function Pb(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Zs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: Zs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const jb = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: bt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function qb(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function Fb(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Wb(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = G0.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function wa(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const vo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function X0(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    wa(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function Hb(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : N0(`held:${e}`) ? "idle" : e;
}
const Ce = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function Ub(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Ce.ahead * n ? 180 : Math.sign(s) * Ce.turn;
}
const yo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function zb(e, t) {
  const n = Math.min(Ce.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Ce.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Ce.lines, Math.floor((e.bottom - e.top - 2 * s) / Ce.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ce.sweep) % a, i = o % Ce.sweep, l = Ce.sweep - Ce.returnSeconds, u = yo((i - l) / Ce.returnSeconds), d = i <= l ? yo(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Ce.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const wo = 3, ai = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, ko = 12, Vb = (e, t) => ({ mood: e, began: t, seen: 0 });
function Gb(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!ai(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= wo ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * ko) / ko, lasts: wo } };
}
const Kb = (e) => e.posture === "hang" && !ai(e.face), Q0 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), ev = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function Yb(e, t, n) {
  return Q0.has(e) ? 1 / 0 : !ev.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(oi(n - t.began, t.share) - Qe.lead, 0);
}
const tv = 5;
function Jb(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= tv ? { beat: "long_walk", time: n } : null };
}
const nv = 30, $n = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function Zb(e, t, n, s, a = null) {
  if (t && n < t.until || !$n.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = $n.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + $n.every } : { state: e, began: 0, until: 0, next: n + $n.every };
}
const Xb = (e, t, n) => t && n < t.until && ti.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, oi = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function Qb(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = oi(o, e.share);
  return a ? { eager: sv(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function sv(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const av = 1, ov = { look: "look", gaze: "gaze" };
function rv(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [ov[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const iv = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), lv = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > av * t, memory: s, now: a, room: o }, n).name === "backflip", cv = { work: ["building"], idle: ["standing"] };
function e5(e, t, n, s) {
  const a = Js[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(cv[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), ti.has(e) ? { moments: o, began: n || s } : (n && s - n >= nv && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function uv(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const bo = { pondering: uv };
function t5(e, t, n, s, a, o) {
  if (bo[e.beat]) {
    const i = bo[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = rv(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== ya && { lifetime: r.lifetime } } } : null;
}
function n5(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = iv(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const s5 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function a5(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function o5(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const r5 = (e, t) => !!(e != null && e.watches) && !t.once, i5 = 10, l5 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || j0(s, s.queuedAt, n)), c5 = (e, t) => t ? null : e[0] ?? null;
function u5(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const d5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), dv = 2 * Math.PI, hv = 500;
function h5(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / hv, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), v = dv * r / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, M = (u ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !l ? a && !t.behind && !y.behind ? mv(y, t, n, v, a) : gv(y, t, n, v) : t) ?? y, w = M != null && M.behind && M.mood === "reading" ? fv(e.point, M, n, r, a) : M;
  return { point: w ?? null, toward: w ? { x: w.x - n.x, y: w.y - n.y } : null, amount: f, at: s };
}
function fv(e, t, n, s, a) {
  const o = ($) => $ * 180 / Math.PI, r = ($) => o(Math.atan2(Math.sin($ * Math.PI / 180), Math.cos($ * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), v = f ? r(e.readingFacing - i) : 0, y = f ? e.readingYaw + v : d, C = y + r(u - y), M = Math.min(Math.max(s / 1e3, 0), 0.1), w = Ce.turnSpeed * M, x = f ? y + Math.min(Math.max(C - y, -w), w) : C, O = f ? e.readingFollow + v : x, F = O + (x - O) * (1 - Math.exp(-M / Ce.followSeconds)), T = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, g = o(wa(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), B = Math.min(Math.max(g, -T.up), T.down), E = Ce.tipSpeed * M, I = f ? e.readingPitch + Math.min(Math.max(B - e.readingPitch, -E), E) : B;
  return { ...t, readingYaw: x, readingFollow: F, readingPitch: I, readingFacing: i };
}
function mv(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (O) => {
    const { yaw: F, pitch: T } = wa(O.x - n.x, a, n.y - O.y, o);
    return { yaw: F, pitch: Math.min(Math.max(T, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [vo(i(e)), vo(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [v, y] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [C, M, w] = l.map((O, F) => v * O + y * u[F]), x = a * C / M;
  return { ...t, x: n.x + x, y: n.y - X0(x, a, -Math.asin(Math.min(Math.max(w, -1), 1)), o) };
}
const pv = 0.15;
function f5(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= pv;
}
function gv(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const vv = (e) => !(e != null && e.on);
function m5(e, t, n) {
  if (vv(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const nn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ye = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, vs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), xo = (e) => e * e * (3 - 2 * e);
function yv(e) {
  if (e < 0 || e >= Ye.seconds) return null;
  const t = vs(e, ...Ye.flicker), n = Math.floor(t * Ye.flickers * 2) % 2 === 0, s = e < Ye.flicker[1] ? n ? 0.35 + 0.5 * t : Ye.dim : 1;
  return { strength: 1 - xo(vs(e, ...Ye.fade)), lit: s, white: e < Ye.flash[0] ? 0 : 1 - xo(vs(e, ...Ye.flash)) };
}
const p5 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function g5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = yv(t - e.at);
  return s && { colour: nn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ye.signs[e.tone], ...s } };
}
function v5(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function y5(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= nn.looks || s === null && n - e.since >= nn.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function w5(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, k5 = { behind: 39, figure: 40, ahead: 41 }, wv = "[data-figure-pile]", kv = { amber: [1, 0.69, 0.125], good: nn.colours.good, bad: nn.colours.bad }, On = { phases: 4, ms: 230, dim: 0.25 }, b5 = (e, t, n) => e !== "amber" || (t + n) % On.phases < On.phases / 2 ? 1 : On.dim, x5 = (e) => e === "amber" ? On.phases : 1;
function $5(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const M5 = Object.keys(kv), He = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ht = ([e, t], n) => e + n() * (t - e);
function S5(e) {
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
const ys = { high: 3, gap: 1 };
function _5(e) {
  const t = Math.floor(e / ys.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + ys.gap)), up: e % ys.high * (rt.height - rt.top) };
}
const bv = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, xv = { after: 5 }, $v = (e) => e.filter((t) => t.active && (t.process || t.watch) && new ei(t).isBuild());
function E5(e, t, n) {
  const s = $v(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= xv.after ? a : null;
}
function A5(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: bv(n, s, a) } : null;
}
const $o = { ahead: 140, up: 70 };
function C5(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * $o.ahead, y: s - $o.up } } : o ? { at: { x: n(o), y: s - o.up - rt.height } } : t ? { at: null } : null;
}
const ws = { least: 4e3, most: 1e4 }, Mv = (e) => ws.least + e() * (ws.most - ws.least), vt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function O5(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Mv(t);
    if (n.length >= vt.most || t() >= vt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (vt.at[0] + t() * (vt.at[1] - vt.at[0]));
    n.push({ from: o, to: o + vt.ms }), s = o + vt.ms;
  }
}
const T5 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), I5 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), ri = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), R5 = new Set(Zn.filter((e) => ri.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), Sv = (e) => e.some((t) => t.state === "built"), B5 = (e, t) => Sv(t) ? e.filter((n) => !ri.has(n.beat)) : e, ct = { reach: 40, room: 6 }, _v = (e, t) => t <= e - ct.reach + 2, L5 = (e, t, n) => _v(e, n) ? t - ct.reach : e - ct.reach - ct.room, D5 = (e, t, n, s) => s > 0 && t < e && t + ct.reach >= e - 2 ? Math.min(n, Math.max(e, t + ct.reach)) : e, ks = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, N5 = (e) => Ht(e() < ks.longShare ? ks.long : ks.short, e), Ev = 2 * rt.width;
function P5(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= Ev ? o : e + (o - e + a / 2) % a;
}
const Av = 60, j5 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= Av, Mo = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector(Mo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Mo)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Cv = "[data-figure-docked-bars]", Ov = "[data-figure-chat-foot]", Tv = [0.85, 0.6, 0.35, 0.15], Iv = ["question", "waiting", "suggestion"], q5 = (e, t) => Iv.find((n) => e[n] > 0 && t[n] === "behind") || null;
function F5() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Rv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Bv = "[data-figure-newest]";
function ii() {
  var s, a;
  const e = (s = fn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Bv), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ka(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function sn(e, t, n = ii()) {
  if (!e || !n) return !0;
  const s = nt(e, t), a = Qn(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ae.top * t.size, bottom: s.top + Ae.bottom * t.size }, r = wt.gap;
  return !Xn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function W5(e, t, n, s = ii()) {
  if (!s || sn(t, e, s)) return null;
  const a = Qn(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = Mt(), l = t.posture === "stand" ? xa * e.size : pi * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - wt.gap - r, s.right + wt.gap + o].map((v) => ({ ...t, x: v })).filter((v) => v.x >= u && v.x <= d && sn(v, e, s) && cy(v, e)).sort((v, y) => Math.abs(v.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const bs = 0.26, li = 0.54, Lv = 1.25 / 5.4, mn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: bs, travels: "stand" },
  lounge: { drop: bs, travels: "stand" },
  composed: { drop: bs, travels: "stand" },
  hang: { drop: li, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, H5 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Lv * Math.cos(t * Math.PI / 180),
  y: 1 - n - li
}), Ut = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Dv = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), U5 = (e, t) => (e === "sit" ? Dv.has(t) : Ut.has(e)) ? e : "stand";
function z5(e, t) {
  return e.facing === t.facing || !Ut.has(e.posture) && !Ut.has(t.posture) ? t : { posture: "stand", facing: Ut.has(e.posture) ? e.facing : t.facing };
}
const V5 = 0.25, G5 = (e, t) => Ut.has(e) && mn[t].drop === 0, ci = 2, Nv = 90, Pv = 180, jv = 140, qv = 280, Fv = 420, Wv = 0.25, Hv = 290, Uv = 600, zv = "cubic-bezier(0.2, 0.7, 0.4, 1)", Vv = "cubic-bezier(0.55, 0, 0.9, 0.6)", xs = 5;
function Pn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < xs) return null;
  (r || i) && (o = Math.max(o, ci));
  const y = o > 1, C = Math.abs(t.x - e.x), M = C < xs ? 0 : C / (Nv * o) * 1e3, w = Math.min(M, y ? jv : Pv), x = Math.abs(t.y - e.y), O = t.y < e.y, F = O && !v && lv(x, n, l, u, d, f), T = O ? Fv + Math.min(x, 400) * Wv : Math.sqrt(2 * x / va) * 1e3, g = {
    x: t.x,
    y: t.y,
    ms: x > xs ? F ? Uv : T : 0,
    lead: F ? Hv : O ? qv : 0,
    easing: O ? zv : Vv,
    hopping: !0,
    clip: F ? "backflip" : O ? "jump" : "fall"
  }, B = { x: t.x, y: t.y, ms: M + w, lead: 0, easing: "linear", ramp: w, ...y ? { clip: "run" } : {} }, E = v ? Gv(t, n) : g, I = O && !s ? [{ ...B, y: e.y }, E] : [{ ...g, x: e.x }, B];
  return { way: Math.sign(t.x - e.x) || 1, legs: I, lands: !a, pace: o, running: y };
}
const Gv = (e, t) => ({ x: e.x, y: e.y, ms: Se.pogo.frames / Se.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Kv = (e, t) => e.postures.includes(t) ? t : e.postures[0], K5 = (e, t, n) => e.posture === "walk" && n ? "walk" : Kv(e.clip, t), nt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - mn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Xn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ka = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Mt() {
  var t;
  const e = (t = fn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Mn = 0.5, So = 20;
function Y5(e, t, n = Mt()) {
  const s = nt(e, t);
  return s.left >= n.left + So && s.right <= n.right - So;
}
function ba(e, t, n = Mt()) {
  const s = nt(e, t), a = s.right - s.left, o = Qn(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Mn && i <= n.right + Mn && s.top >= n.top - Mn && l <= n.bottom + Mn;
}
const jn = [0.35, 0.5, 0.65], qn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ae = { left: jn[0], right: jn.at(-1), top: qn[0], bottom: qn.at(-1) }, Yv = 0.24;
function Qn(e) {
  if (e.posture === "stand") return { left: Ae.left, right: Ae.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Yv * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ae.left, t), right: Math.max(Ae.right, t) };
}
function Jv(e, { size: t }, n = Mt()) {
  const s = Qn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const xa = (Ae.right - Ae.left) / 2 + 0.08;
function J5(e, t) {
  return e === "hang" ? Ae : { ...Ae, bottom: Math.min(Ae.bottom, 1 - t - mn[e].drop) };
}
const Zv = "[data-figure-agent]";
function ui(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !ka(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const di = (e) => qn.flatMap(
  (t) => jn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function $a(e, t, n = "") {
  if (!sn(e, t)) return jn.length * qn.length;
  const s = nt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Rv)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && Xn(a, l) && ka(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return di(a).filter(([i, l]) => r(i, l) || ui(i, l, n)).length;
}
function Xv(e, t) {
  const n = nt(e, t);
  return di({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => ui(s, a, "", Zv)).length;
}
const _o = 4;
function Z5(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = _o; o <= a; o += _o)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!Xv(i, e) && sn(i, e)) return i;
    }
  return null;
}
function an(e, t, n) {
  const s = Mt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => ba(r, t, s) && sn(r, t)).map((r) => ({ spot: r, covered: $a(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const hi = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Qv = [0.5, 0.25, 0.75], ey = (e) => hi(e.getBoundingClientRect(), Qv), fi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, ty = xa, ny = (e, t, { size: n }, s = ty) => mi(e, fi[t], s * n, "stand");
function mi(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const sy = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, pi = 0.1, ay = (e, t, { size: n }) => mi(e, sy[t], pi * n, "sit"), oy = (e) => ((e + 180) % 360 + 360) % 360 - 180, $s = 60;
function X5(e, t) {
  const n = oy(t);
  return !e.aside || Math.abs(n) >= $s ? t : n < 0 ? 360 - $s : $s;
}
const zt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, ry = (e) => [.../* @__PURE__ */ new Set([e, ...zt.turns.map((t) => (t + 360) % 360)])];
function Q5(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = ry(t), r = zt.every[0] + s() * (zt.every[1] - zt.every[0]);
  return { face: t, from: a ? iy(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function iy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / zt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function e4(e, t) {
  const { element: n, edge: s } = es(), a = ["left", "right"].map((i) => pn(ay(s, i, e), e)).filter((i) => n && ba(i, e) && !$a(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function t4(e, t, { size: n }) {
  const s = (Ae.right - Ae.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - gi } : e;
}
const gi = 7;
function vi() {
  const e = [...document.querySelectorAll(wv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function ly(e, t) {
  const n = nt(e, t), s = n.right - n.left;
  return { left: n.left + Ae.left * s, right: n.left + Ae.right * s, top: n.top + Ae.top * s, bottom: n.bottom };
}
function cy(e, t) {
  const n = vi();
  return !n || !Xn(ly(e, t), n);
}
const uy = 4;
function es() {
  const e = gn(), t = vi(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > uy || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - gi - n, 0) } };
}
const n4 = ({ size: e, below: t }) => (1 - t) * e;
function pn(e, t) {
  const n = Mt(), { size: s, below: a } = t, o = mn[e.posture].drop * s;
  return { ...Jv(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Xs = (e, t) => Object.keys(fi).map((n) => pn(ny(e, n, t), t)), Ma = (e, t) => hi(e, Tv).map((n) => pn(n, t)), yi = (e, t, n) => an(e, t, n) ?? e[0];
function s4(e, t) {
  const { element: n, edge: s } = es();
  return { ...yi(Xs(s, e), e, t), view: null, on: n };
}
function a4(e, t, n, s) {
  const { element: a, edge: o } = es(), r = (s ? Xs(o, t) : [...Xs(o, t), ...Ma(o, t)]).filter(
    (u) => !Xn(nt(u, t), e)
  ), i = an(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !$a(i, t) ? i : an(r, t, n);
  return l && { ...l, view: null, on: a };
}
function gn() {
  var s;
  const e = fn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Cv);
  if (!t) return { ...ts(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Eo = { within: 2 };
function o4(e) {
  const { element: t, docked: n, edge: s } = gn();
  if (!n || e.on !== t) return !0;
  const a = ts().edge;
  return s.left > a.left + Eo.within || s.left + s.width < a.left + a.width - Eo.within;
}
const dy = "[data-figure-closing]";
function r4() {
  var n;
  const { element: e, docked: t } = gn();
  return t && !!((n = e.firstElementChild) != null && n.matches(dy));
}
const wi = "[data-figure-progress]";
function i4(e) {
  const t = e.querySelector(wi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function l4(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const hy = { across: 300, above: 380, below: 60 };
function c4(e) {
  const { across: t, above: n, below: s } = hy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: fy(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const fy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), ki = "[data-figure-bar]", Qs = { back: 144, along: 0.4 };
function u4(e) {
  const { element: t, docked: n, edge: s } = gn(), a = n ? t.querySelector(ki) : null;
  if (!(a != null && a.querySelector(wi))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...pn({ x: o - Qs.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function d4(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < Qs.along * s.size ? t.x + Qs.along * s.size : e.x, y: e.y, behind: !0 };
}
function h4(e) {
  const t = e.querySelector(ki), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const s = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: s, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ts() {
  const e = fn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function f4(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = ts(), l = n === null ? my(i, e, o === null ? t : { x: o, y: i.top }, s, a) : pn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function my(e, t, n, s, a) {
  const o = Ma(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + rt.width < a && l.x + s - ct.reach - ct.room >= r);
  return an(i.length ? i : o, t, n);
}
const py = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function m4(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  (o || r) && (a = Math.max(a, ci));
  const y = (F) => {
    const T = nt(F, n, mn[F.posture].travels);
    return { x: T.left, y: T.top };
  }, C = t.ladder ?? e.ladder;
  if (C && !(t.ladder && e.ladder)) return gy(y(e), y(t), y({ ...C.foot, posture: "stand" }), C.way, !!t.ladder, n, a);
  const [M, ...w] = [e, ...l, t].map(y), x = Pn(M, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: v }), O = w.slice(1).map((F, T) => {
    var g;
    return (g = Pn(w[T], F, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : g.legs.find((B) => B.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...O.filter(Boolean)] };
}
function gy(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / py.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? Pn(e, n, o.size, { pace: r }) : Pn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function p4(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function g4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && an(ey(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = es();
  return { ...yi(Ma(a, t), t, n), view: null, on: s };
}
const vy = "[data-figure-bubble]", yy = 250;
let Vt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), bi = 0;
const Nt = () => Vt, Ms = /* @__PURE__ */ new WeakMap();
let wy = 0;
function Sa(e) {
  return Ms.has(e) || Ms.set(e, `floor-${++wy}`), Ms.get(e);
}
const ky = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, by = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function xy(e, t) {
  var s;
  const n = (s = e.querySelector(Ov)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function $y(e, t) {
  const n = e && xy(e, t), s = e ? [...e.querySelectorAll(vy)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || ky(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Sa(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const My = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= yy ? (t.top - s.top) / a * 1e3 : 0;
};
function xi(e = Vt, t = performance.now()) {
  const n = Mt(), s = by(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = gn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = ts();
  return u.element && l.push({ id: Sa(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...$y(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: My(e, d, t) }))) });
}
const ea = /* @__PURE__ */ new Set();
function Sy(e) {
  return ea.add(e), () => ea.delete(e);
}
function _y() {
  $i();
  const e = () => {
    bi = requestAnimationFrame(e), !document.hidden && (Vt = xi(Vt), ea.forEach((t) => t(Vt)));
  };
  e();
}
function $i() {
  cancelAnimationFrame(bi);
}
const _a = 5, Ey = 56, Ay = { share: 0.6 }, Cy = (e) => -Math.sqrt(2 * va * Ay.share * e), Rt = (e, t) => e.find((n) => n.id === t) ?? null;
function v4(e, t = xi().floors) {
  const n = Rt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : Sa(e.on) : null, o = a && Rt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function Mi({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Nt().floors) {
  const u = Rt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || Oy(u, d, o)) && Ty(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Ea = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Oy = (e, t, n) => !Ea({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function y4(e, t = Nt().floors) {
  if (!Ea(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= _a && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Ty(e, t, n = Nt().floors) {
  const s = Rt(n, "home");
  return e.posture === "hang" && s && nt(e, t).bottom >= s.top ? !1 : ba(e, t);
}
function w4(e, t, n, s = Nt().floors) {
  const a = Mi(e, n, s);
  if (!e.home) return Iy(e, t, a, s);
  if (!a) return null;
  const o = Rt(s, "home"), r = a.y - t.y, i = r > _a ? "dropping" : -r > Ey ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Iy(e, t, n, s) {
  const a = n ? Rt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Cy(e.risen) };
  if (!n) return null;
  if (Ea(t) && n.y - t.y > _a) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function k4(e, t, n) {
  const s = xa * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function b4(e, t, n, s = Nt().floors) {
  const a = t && Mi(t, n, s);
  return a ? { ...e, ...a } : e;
}
const Ry = ["data-kind"], By = { class: "figure-floor-name" }, Ly = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: pe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", By, k(e.floor.kind), 1)
    ], 12, Ry));
  }
}, Dy = /* @__PURE__ */ K(Ly, [["__scopeId", "data-v-8f6132da"]]), Ny = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Py = {
  __name: "FigureFloors",
  setup(e) {
    const t = Wn(Nt().floors);
    let n = () => {
    };
    return Be(() => {
      n = Sy((s) => t.value = s.floors), _y();
    }), Ie(() => {
      n(), $i();
    }), (s, a) => (c(), h("div", Ny, [
      (c(!0), h(Y, null, se(t.value, (o) => (c(), G(Dy, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, x4 = /* @__PURE__ */ K(Py, [["__scopeId", "data-v-e519168b"]]), Ss = (e) => typeof e == "number" ? e : Date.parse(e);
function $4(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Ss(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Ss(a.row.created_at) - Ss(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const jy = 3, _s = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function qy(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = _s[n.grouping]) == null ? void 0 : s.call(_s, e.row, n)) || "";
}
function Fy(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function M4(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= jy ? [Fy(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = qy(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Wy = 1e3;
function Hy() {
  const e = D(Date.now()), t = setInterval(() => e.value = Date.now(), Wy);
  return Dt(() => clearInterval(t)), e;
}
const Uy = ["datetime", "title"], Fn = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Hy(), s = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, k(V(Bf)(e.at, V(n))), 9, Uy));
  }
}, S4 = (e) => (t) => t.filter((n) => n.id !== e), _4 = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), E4 = (e) => (t) => [...t, e], A4 = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function C4(e) {
  const t = Un(), n = D(null), s = D("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const Sn = /* @__PURE__ */ new Map();
function zy(e, t) {
  if (Sn.has(e)) return Sn.get(e);
  const n = t().finally(() => Sn.delete(e));
  return Sn.set(e, n), n;
}
function O4() {
  const e = Un(), t = D(null), n = D("");
  async function s() {
    const a = await zy(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const Vy = { class: "cards-page" }, Gy = { class: "cards-bar" }, Ky = { class: "cards-count" }, Yy = { class: "cards" }, Jy = {
  key: 1,
  class: "cards-note"
}, Zy = {
  key: 2,
  class: "cards-note"
}, Xy = ["data-row", "onClick"], Qy = { class: "card-head" }, ew = { class: "card-title" }, tw = { class: "card-foot" }, nw = {
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
    return (s, a) => (c(), h("div", Vy, [
      p("div", Gy, [
        p("span", Ky, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        P(ke, ut({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: U(() => [
            P(ye, {
              name: "plus",
              size: 12
            }),
            ce(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", Yy, [
        e.loaded ? e.failure ? (c(), h("p", Jy, k(e.failure), 1)) : e.rows.length ? S("", !0) : (c(), h("p", Zy, "No " + k(e.noun) + "s yet", 1)) : (c(), G(rn, {
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
          p("span", Qy, [
            P(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ce(" " + k(e.head(o)), 1),
            P(Fn, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          p("span", ew, k(e.title(o)), 1),
          p("span", tw, k(e.foot(o)), 1)
        ], 8, Xy))), 128))
      ]),
      he(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, T4 = /* @__PURE__ */ K(nw, [["__scopeId", "data-v-990e6b37"]]), Ao = "newest";
function I4(e, { title: t, isOpen: n = null }) {
  const s = D(""), a = D(Ao), o = D("all"), r = R(() => {
    const l = s.value.trim().toLowerCase(), u = e.value.filter((d) => (!l || JSON.stringify(d).toLowerCase().includes(l)) && (o.value === "all" || !n || n(d) === (o.value === "open")));
    return a.value === Ao ? u : [...u].sort((d, f) => t(d).localeCompare(t(f)));
  }), i = R(() => !!s.value.trim() || !!n && o.value !== "all");
  return { words: s, order: a, state: o, shown: r, filtering: i, hasStates: !!n };
}
const sw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, aw = 40, ow = "top", rw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = Te(Le, null)) == null ? void 0 : f.autoScroll, a = R(() => s === ow), o = D(null), r = D(!1), i = (v) => a.value ? v.scrollTop : v.scrollHeight - v.scrollTop - v.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= aw;
    }
    return be(() => n.rowCount, async () => {
      await Lt(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (v, y) => (c(), h("div", sw, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        he(v.$slots, "default", {}, void 0, !0)
      ], 34),
      P(Bt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: U(() => [
          dt(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            P(ye, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            y[0] || (y[0] = ce(" Newest ", -1))
          ], 512), [
            [Fi, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, R4 = /* @__PURE__ */ K(rw, [["__scopeId", "data-v-3accb764"]]), iw = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, lw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Te(Le, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (c(), h("div", iw, [
      (c(!0), h(Y, null, se(V(s), (i) => {
        var l;
        return c(), G(ke, {
          key: i.key,
          kind: "text",
          class: J(["inner-tab", { on: ((l = e.active) == null ? void 0 : l.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: U(() => [
            ce(k(i.label) + " " + k(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, B4 = /* @__PURE__ */ K(lw, [["__scopeId", "data-v-cf3bb39f"]]), cw = {}, uw = { class: "menu-label" };
function dw(e, t) {
  return c(), h("span", uw, [
    he(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ta = /* @__PURE__ */ K(cw, [["render", dw], ["__scopeId", "data-v-aa955b3e"]]), hw = {
  class: "search-bar",
  "data-search-bar": ""
}, fw = { class: "search-bar-control" }, mw = ["value", "placeholder", "aria-label"], pw = ["aria-expanded"], gw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const s = e, a = n, o = Wi(), r = ((x = Te(Le, null)) == null ? void 0 : x.search) ?? {}, i = R(() => r.placeholder || s.placeholder), l = r.context ?? [], u = D(null), d = D(null), f = D([]), v = R(() => f.value.length ? f.value[f.value.length - 1].next : l), y = R(() => !!o.menu || l.length > 0), C = (O) => {
      f.value = [], d.value = d.value ? null : O.currentTarget;
    };
    function M(O) {
      if (O.next.length) {
        f.value = [...f.value, O];
        return;
      }
      d.value = null, a("pick", O.click);
    }
    function w() {
      var O;
      a("update:modelValue", ""), (O = u.value) == null || O.focus();
    }
    return t({ focus: () => {
      var O;
      return (O = u.value) == null ? void 0 : O.focus();
    } }), (O, F) => {
      var T;
      return c(), h("div", hw, [
        p("div", fw, [
          P(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          p("input", {
            ref_key: "field",
            ref: u,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: F[0] || (F[0] = (g) => a("update:modelValue", g.target.value)),
            onKeydown: Gt(w, ["esc"])
          }, null, 40, mw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: w
          }, [
            P(ye, {
              name: "close",
              size: 12
            })
          ])) : S("", !0),
          y.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: C
          }, [
            P(ye, {
              name: "caret",
              size: 12
            })
          ], 8, pw)) : S("", !0)
        ]),
        (T = V(r).button) != null && T.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: F[1] || (F[1] = (g) => a("pick", V(r).button.click))
        }, k(V(r).button.title), 1)) : S("", !0),
        he(O.$slots, "default", {}, void 0, !0),
        d.value ? (c(), G(ga, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: F[3] || (F[3] = xe(() => {
          }, ["stop"])),
          onClose: F[4] || (F[4] = (g) => d.value = null)
        }, {
          default: U(() => [
            f.value.length ? (c(), G(It, {
              key: 0,
              "data-search-back": "",
              onClick: F[2] || (F[2] = (g) => f.value = f.value.slice(0, -1))
            }, {
              default: U(() => [
                ce("‹ " + k(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : S("", !0),
            (c(!0), h(Y, null, se(v.value, (g) => (c(), G(It, {
              key: g.title,
              description: g.subtext,
              "data-search-entry": g.title,
              onClick: (B) => M(g)
            }, {
              default: U(() => [
                ce(k(g.title) + k(g.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? S("", !0) : he(O.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : S("", !0)
      ]);
    };
  }
}, vw = /* @__PURE__ */ K(gw, [["__scopeId", "data-v-5904a3de"]]), yw = {
  class: "list-tools",
  "data-list-tools": ""
}, ww = {
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
    return (o, r) => (c(), h("div", yw, [
      P(vw, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": "",
        onPick: r[1] || (r[1] = (i) => n("pick", i))
      }, {
        menu: U(() => [
          P(ta, null, {
            default: U(() => [...r[2] || (r[2] = [
              ce("Order", -1)
            ])]),
            _: 1
          }),
          (c(), h(Y, null, se(s, (i) => P(It, {
            key: i.key,
            checked: e.tools.order.value === i.key,
            "data-list-order": i.key,
            onClick: (l) => e.tools.order.value = i.key
          }, {
            default: U(() => [
              ce(k(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (c(), h(Y, { key: 0 }, [
            P(ta, null, {
              default: U(() => [...r[3] || (r[3] = [
                ce("Show", -1)
              ])]),
              _: 1
            }),
            (c(), h(Y, null, se(a, (i) => P(It, {
              key: i.key,
              checked: e.tools.state.value === i.key,
              "data-list-state": i.key,
              onClick: (l) => e.tools.state.value = i.key
            }, {
              default: U(() => [
                ce(k(i.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : S("", !0)
        ]),
        default: U(() => [
          he(o.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, L4 = /* @__PURE__ */ K(ww, [["__scopeId", "data-v-24c1740c"]]);
function D4() {
  const e = D(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const kw = 86400, na = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function bw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((na(t) - na(e)) / kw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function N4(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = na(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: bw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Es = 280, As = 240, Cs = 120, xw = 6, $w = 14, on = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Mw(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Si(e, t) {
  const n = Math.max(0, Mw(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function Sw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${$w}px)` }), e.offsetHeight, e.style.transition = `height ${Es}ms ${on}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1;
  const u = () => {
    n() && (t.scrollTop = Si(t, e));
    const d = a() - i;
    if (!l && d >= Es && (l = !0, e.style.transition = `opacity ${As}ms ease-out, transform ${As}ms ${on}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), d < Es + As) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function P4(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${xw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Cs}ms ease-out, transform ${Cs}ms ${on}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = Si(t, e)), a() - r < Cs) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const _w = 140, _n = 220, Ew = 5;
function j4({ gap: e = _w, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, Ew);
    if (s = i.length > 0, !s) return;
    let l = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), l -= 1, l || t(o, e);
      });
  }
  const r = (i, l, u, d = Sw) => {
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
function q4(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${_n}ms ${on}, opacity ${_n}ms ease-in, margin ${_n}ms ${on}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, _n);
}
const _i = "chat.pins.minimised", Tn = D(Kt(_i, !1));
function Co(e) {
  Tn.value = e, zn(_i, e);
}
function Aw(e) {
  const t = R(() => e()), n = R(() => Tn.value ? [] : e()), s = () => Co(!Tn.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => bt(o) > a).length,
    (o, r) => o > r && Co(!1)
  ), { pins: t, visible: n, minimised: Tn, toggle: s };
}
const Cw = ["title"], Ow = {
  key: 0,
  class: "pins-count"
}, Tw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Aw(() => t.pinRows);
    return (o, r) => V(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: V(s), inline: e.inline }]),
      title: V(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = xe((...i) => V(a) && V(a)(...i), ["stop"]))
    }, [
      P(ye, {
        name: V(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      V(s) ? (c(), h("span", Ow, k(V(n).length), 1)) : S("", !0)
    ], 10, Cw)) : S("", !0);
  }
}, F4 = /* @__PURE__ */ K(Tw, [["__scopeId", "data-v-d073c504"]]), Iw = ["title"], Rw = ["title"], Bw = { class: "diff-card-dir" }, Lw = { class: "diff-card-name" }, Dw = ["title"], Nw = ["title"], Pw = {
  key: 0,
  class: "diff-card-note"
}, jw = ["href"], qw = ["src", "alt"], Fw = { class: "diff-card-rows" }, Ww = { class: "diff-row-num" }, Hw = { class: "diff-row-sign" }, Uw = { class: "diff-row-code" }, zw = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    kind: { type: String, required: !0 },
    added: { type: Number, required: !0 },
    removed: { type: Number, required: !0 },
    at: { type: [String, Number], required: !0 },
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
    function o(_) {
      (_.metaKey || _.ctrlKey) && (_.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, l.value)), d = R(() => n.path.slice(l.value)), f = R(() => n.kind === "deleted"), v = R(() => r[n.kind]), y = R(() => new Set(n.rows.filter((_) => _.line_type === "add").map((_) => _.line))), C = D("after"), M = R(() => C.value === "before" ? n.whole.old : n.whole.text), w = R(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map((_, b) => ({ line_type: C.value === "after" && y.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: _ })) : n.rows.filter(
      (_) => !(n.editsOnly && ["ctx", "fold"].includes(_.line_type)) && !(n.hideRemovals && _.line_type === "del")
    )), x = D(!1), O = R(() => n.lines && !x.value && !n.whole), F = R(() => O.value ? w.value.slice(0, n.lines) : w.value), T = R(() => w.value.length - F.value.length), g = (_) => _.line === null || _.line_type === "del" ? "" : _.line, B = (_) => _.line_type === "fold" ? _.hidden ? `⋯ ${_.hidden} lines` : "⋯" : _.text, E = D(null), I = D(null);
    let $ = null;
    return Be(() => {
      if (!I.value) return;
      let _ = !0;
      $ = new ResizeObserver(() => {
        !E.value || !I.value || (E.value.style.transition = _ ? "none" : "", E.value.style.height = `${I.value.offsetHeight}px`, _ = !1);
      }), $.observe(I.value);
    }), Ie(() => $ && $.disconnect()), (_, b) => (c(), h("section", {
      class: J(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (m) => !f.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${V(a)}-click to open it`,
          onClick: o
        }, [
          p("span", Bw, k(u.value), 1),
          p("span", Lw, k(d.value), 1),
          v.value ? (c(), h("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, k(v.value), 3)) : S("", !0)
        ], 8, Rw),
        p("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        p("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        P(Fn, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: C.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = xe((m) => C.value = C.value === "after" ? "before" : "after", ["stop"]))
        }, k(C.value === "after" ? "After" : "Before"), 9, Dw)) : S("", !0),
        f.value ? S("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = xe((m) => s("whole"), ["stop"]))
        }, [
          P(ye, {
            name: "file",
            size: 12
          })
        ], 10, Nw))
      ], 8, Iw),
      e.whole && e.whole.error ? (c(), h("p", Pw, k(e.whole.error), 1)) : S("", !0),
      !f.value && !e.folded ? (c(), h(Y, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          p("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, qw)
        ], 8, jw)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: E,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: I,
            class: "diff-card-diff"
          }, [
            p("div", Fw, [
              (c(!0), h(Y, null, se(F.value, (m, L) => (c(), h("div", {
                key: L,
                class: J(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                p("span", Ww, k(g(m)), 1),
                p("span", Hw, k(i[m.line_type]), 1),
                p("span", Uw, k(B(m)), 1)
              ], 2))), 128)),
              T.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = xe((m) => x.value = !0, ["stop"]))
              }, k(T.value) + " more " + k(T.value === 1 ? "line" : "lines"), 1)) : S("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : S("", !0)
    ], 2));
  }
}, W4 = /* @__PURE__ */ K(zw, [["__scopeId", "data-v-fed58c18"]]), Vw = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(ke, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: U(() => [
        P(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Je = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Gw = {
  draft: [{ word: "ready", label: "Mark ready" }, Je],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Je],
  approved: [{ word: "start", label: "Start", main: !0 }, Je],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Je],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Je],
  completed: [],
  cancelled: []
}, Kw = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Je],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Je],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, Je],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Je],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Yw = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Jw = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], Zw = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Xw = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Qw = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], e2 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? Qw(t) : e === "agent" ? [...Zw(t), ...Jw(t)] : e === "check" ? Xw(t) : e === "question" ? Yw(t) : ((n = { plan: Gw, task: Kw }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, t2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, n2 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, s2 = { class: "ask-text" }, a2 = ["placeholder", "aria-label"], o2 = ["placeholder", "aria-label"], r2 = {
  key: 3,
  class: "moves"
}, i2 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = R(() => e2(s.kind, s.row)), r = D(""), i = D(null), l = D(""), u = D("");
    be(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(y, C = "") {
      const M = await s.read([y.noun ?? s.kind, y.word, String(s.id), ...y.flag ? [y.flag, C] : y.positional ? [C] : [], ...y.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = M.ok ? "" : M.error, M.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (y) => y.confirm ? i.value = y : y.said ? d(y, y.said) : y.flag || y.positional ? (i.value = y, l.value = "") : d(y), v = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (y, C) => {
      var M;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", t2, k(r.value), 1)) : S("", !0),
        (M = i.value) != null && M.confirm ? (c(), h("div", n2, [
          p("span", s2, k(i.value.confirm), 1),
          P(ke, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: C[0] || (C[0] = (w) => d(i.value))
          }, {
            default: U(() => [
              ce(k(i.value.label), 1)
            ]),
            _: 1
          }),
          P(ke, {
            small: "",
            kind: "ghost",
            onClick: C[1] || (C[1] = (w) => i.value = null)
          }, {
            default: U(() => [...C[7] || (C[7] = [
              ce("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: xe(v, ["prevent"])
        }, [
          dt(p("input", {
            "onUpdate:modelValue": C[2] || (C[2] = (w) => l.value = w),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: C[3] || (C[3] = Gt(xe((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, a2), [
            [Rs, l.value]
          ]),
          i.value.opener ? dt((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": C[4] || (C[4] = (w) => u.value = w),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: C[5] || (C[5] = Gt(xe((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, o2)), [
            [Rs, u.value]
          ]) : S("", !0),
          P(ke, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: U(() => [
              ce(k(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          P(ke, {
            small: "",
            kind: "ghost",
            onClick: C[6] || (C[6] = (w) => i.value = null)
          }, {
            default: U(() => [...C[8] || (C[8] = [
              ce("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", r2, [
          (c(!0), h(Y, null, se(o.value, (w) => (c(), G(ke, {
            key: w.word,
            small: "",
            kind: w.main ? "primary" : "ghost",
            "data-move": w.word,
            onClick: (x) => f(w)
          }, {
            default: U(() => [
              ce(k(w.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : S("", !0);
    };
  }
}, l2 = /* @__PURE__ */ K(i2, [["__scopeId", "data-v-fffa0bf6"]]), c2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, u2 = { ...c2, done: "Completed" }, d2 = { class: "task-status-icon" }, h2 = ["width", "height", "aria-label"], f2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", d2, [
      P(Bt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: U(() => [
          (c(), h("svg", {
            key: e.status,
            class: J(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": V(u2)[e.status]
          }, [
            P(Hn, { value: e.status }, {
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
          ], 10, h2))
        ]),
        _: 1
      })
    ]));
  }
}, Ei = /* @__PURE__ */ K(f2, [["__scopeId", "data-v-2ab7e404"]]), m2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), p2 = (e) => m2.has(e), Ai = (e) => p2(e) ? "done" : e, g2 = { class: "facts" }, v2 = { class: "fact wide" }, y2 = { class: "fact-value" }, w2 = {
  key: 0,
  class: "fact"
}, k2 = { class: "fact-value" }, b2 = {
  key: 1,
  class: "fact"
}, x2 = { class: "fact-value" }, $2 = { class: "fact wide" }, M2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, S2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Ln.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return c(), h("div", g2, [
        p("div", v2, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", y2, k((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", w2, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", k2, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : S("", !0),
        e.task.state === "started" && e.task.holder_id ? (c(), h("div", b2, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", x2, "Agent " + k(e.task.holder_id), 1)
        ])) : S("", !0),
        p("div", $2, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          P(R1, {
            options: V(n),
            value: String(V(Ar)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (l) => s("priority", l))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", M2, k(e.refusal), 1)) : S("", !0)
        ])
      ]);
    };
  }
}, _2 = /* @__PURE__ */ K(S2, [["__scopeId", "data-v-2018762d"]]), E2 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, A2 = ["onClick"], C2 = { class: "wait-id" }, O2 = { class: "wait-title" }, T2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, I2 = { class: "text" }, R2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, B2 = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, L2 = 180, D2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = D(!1);
    return (a, o) => (c(), h(Y, null, [
      e.task.waits.length ? (c(), h("section", E2, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (c(!0), h(Y, null, se(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          P(Ei, {
            status: V(Ai)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", C2, k(r.id), 1),
          p("span", O2, k(r.title), 1)
        ], 8, A2))), 128))
      ])) : S("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", T2, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", I2, k(e.task.outcome), 1)
      ])) : S("", !0),
      e.task.brief ? (c(), h("section", R2, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: J(["text", { clamped: !s.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > L2 && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : S("", !0)
      ])) : S("", !0),
      e.task.logs.length ? (c(), h("section", B2, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (c(!0), h(Y, null, se(e.task.logs, (r) => (c(), h("p", {
          key: r.id,
          class: "log"
        }, k(r.line), 1))), 128))
      ])) : S("", !0)
    ], 64));
  }
}, N2 = /* @__PURE__ */ K(D2, [["__scopeId", "data-v-f411ce35"]]), P2 = { class: "comment-side-head" }, j2 = {
  key: 0,
  class: "comment-none"
}, q2 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", P2, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        P(Kn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? S("", !0) : (c(), h("p", j2, "No comments yet")),
      (c(!0), h(Y, null, se(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, k(e.words(s)), 1))), 128))
    ], 2));
  }
}, F2 = /* @__PURE__ */ K(q2, [["__scopeId", "data-v-19fdbdd4"]]), W2 = ["data-comments-below"], H2 = 600, U2 = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, stacked: Boolean },
  emits: ["close"],
  setup(e) {
    const t = e, n = D(null), s = D(!1), a = R(() => t.stacked || s.value), o = new ResizeObserver(([r]) => s.value = r.contentRect.width < H2);
    return Be(() => o.observe(n.value)), Dt(() => o.disconnect()), (r, i) => (c(), h("div", {
      ref_key: "root",
      ref: n,
      class: J(["commented-row", { below: a.value }]),
      "data-comments-below": a.value || null
    }, [
      he(r.$slots, "default"),
      e.open ? (c(), G(F2, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: a.value,
        onClose: i[0] || (i[0] = (l) => r.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : S("", !0)
    ], 10, W2));
  }
}, z2 = /* @__PURE__ */ K(U2, [["__scopeId", "data-v-301b4377"]]), V2 = ["placeholder"], G2 = { class: "actions" }, K2 = { class: "error" }, Y2 = {
  key: 1,
  class: "card closed"
}, J2 = { class: "mark" }, Z2 = { class: "prompt" }, X2 = {
  key: 0,
  class: "draft"
}, Q2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Is({
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
  emits: /* @__PURE__ */ Is(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Ts(e, "draft"), r = Ts(e, "error"), i = D(!!r.value), l = D(!1), u = D(!1), d = D(null);
    async function f() {
      var M, w;
      i.value = !0, l.value = !1, await Lt(), (w = ((M = d.value) == null ? void 0 : M.querySelector("input")) || d.value) == null || w.focus();
    }
    function v() {
      i.value = !1, r.value = "";
    }
    function y(M) {
      M.shiftKey || M.isComposing || (M.preventDefault(), C());
    }
    async function C() {
      const M = o.value.trim();
      if (!(!M || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(M), i.value = !1, l.value = !0;
        } catch (w) {
          o.value = M, r.value = w.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (M, w) => (c(), h("div", {
      class: J(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(C, ["prevent"]),
        onKeydown: Gt(v, ["esc"])
      }, [
        he(M.$slots, "who", {}, void 0, !0),
        dt(p("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": w[0] || (w[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Gt(y, ["enter"])
        }, null, 40, V2), [
          [Rs, o.value]
        ]),
        p("div", G2, [
          p("span", K2, k(r.value), 1),
          P(ke, {
            small: "",
            onClick: v
          }, {
            default: U(() => [...w[2] || (w[2] = [
              ce("Cancel", -1)
            ])]),
            _: 1
          }),
          P(ke, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: C
          }, {
            default: U(() => [...w[3] || (w[3] = [
              ce("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", Y2, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          p("span", J2, [
            P(ye, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", Z2, k(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", X2, "Draft kept")) : S("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = (x) => a("show"))
        }, [
          p("span", null, k(V(em)(e.count, "comment")), 1),
          P(ye, {
            name: "down",
            size: 12
          })
        ])) : S("", !0)
      ]))
    ], 2));
  }
}, ek = /* @__PURE__ */ K(Q2, [["__scopeId", "data-v-79db0c2d"]]);
function tk(e, t) {
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
      throw n.value = n.value.filter((C) => C !== v && C.id !== v.id), new Error(y.error);
    await i();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const nk = { class: "top" }, sk = {
  class: "crumb",
  "data-task-crumb": ""
}, ak = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, ok = {
  key: 1,
  class: "body"
}, rk = { class: "stamp" }, ik = {
  class: "title",
  "data-resource-title": ""
}, lk = { class: "since" }, ck = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, uk = { class: "text" }, dk = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, hk = {
  key: 1,
  class: "note"
}, fk = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, mk = { class: "text" }, pk = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = D(null), r = D(null), i = D(""), l = D(""), u = D(null), d = D(null), f = tk(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (T) => s.read(T));
    let v = 0;
    const y = Ai, C = (T) => T.slice(0, 1).toUpperCase() + T.slice(1), M = R(() => {
      var T;
      return (T = r.value) != null && T.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function w() {
      const T = ++v, [g, B] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      T === v && (i.value = g.ok ? "" : g.error, o.value = g.ok ? g.value : null, r.value = B.ok ? B.value : null);
    }
    be(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, w();
    }, { immediate: !0 }), be(() => s.changes, w);
    async function x(T) {
      const g = o.value.priority;
      o.value.priority = Number(T);
      const B = await s.read(["task", "edit", String(s.id), "--priority", T]);
      if (l.value = B.ok ? "" : B.error, B.ok) return w();
      o.value.priority = g;
    }
    function O(T) {
      u.value = null, d.value.press(T);
    }
    const F = (T) => {
      var g;
      return ((g = d.value) == null ? void 0 : g.moves.length) && (u.value = T);
    };
    return t({ openStatus: F }), (T, g) => (c(), h("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", nk, [
        e.backed ? (c(), G(Vw, {
          key: 0,
          onBack: g[0] || (g[0] = (B) => a("back"))
        })) : S("", !0),
        p("span", sk, k(M.value), 1),
        g[9] || (g[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(Y, { key: 1 }, [
          P(ke, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: g[1] || (g[1] = (B) => a("step", -1))
          }, {
            default: U(() => [
              P(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          P(ke, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: g[2] || (g[2] = (B) => a("step", 1))
          }, {
            default: U(() => [
              P(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : S("", !0),
        P(ke, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: g[3] || (g[3] = (B) => a("close"))
        }, {
          default: U(() => [
            P(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", ak, k(i.value), 1)) : o.value ? (c(), h(Y, { key: 2 }, [
        P(z2, {
          stacked: "",
          open: V(f).open.value,
          comments: V(f).comments.value,
          words: V(f).words,
          onClose: g[6] || (g[6] = (B) => V(f).open.value = !1)
        }, {
          default: U(() => {
            var B;
            return [
              (c(), h("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", rk, [
                  ce("Task " + k(o.value.id) + " · updated ", 1),
                  P(Fn, {
                    at: V(Ns)(o.value)
                  }, null, 8, ["at"])
                ]),
                p("h3", ik, k(o.value.title), 1),
                p("div", {
                  class: J(["state-line", V(y)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: g[4] || (g[4] = (E) => F(E.currentTarget))
                  }, [
                    P(Ei, {
                      status: V(y)(o.value.state)
                    }, null, 8, ["status"]),
                    ce(" " + k(C(o.value.state)), 1)
                  ]),
                  p("span", lk, [
                    g[10] || (g[10] = ce("since ", -1)),
                    P(Fn, {
                      at: V(Ns)(o.value)
                    }, null, 8, ["at"])
                  ])
                ], 2),
                o.value.state === "blocked" ? (c(), h("section", ck, [
                  g[11] || (g[11] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", uk, k(o.value.reason || "Other tasks"), 1),
                  (B = o.value.openers) != null && B.length ? (c(), h("p", dk, "Opens by itself when " + k(o.value.openers.join(" or ")) + ".", 1)) : (c(), h("p", hk, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (c(), h("section", fk, [
                  g[12] || (g[12] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", mk, k(o.value.reason), 1)
                ])) : S("", !0),
                P(_2, {
                  task: o.value,
                  place: r.value,
                  refusal: l.value,
                  onPriority: x
                }, null, 8, ["task", "place", "refusal"]),
                P(N2, {
                  task: o.value,
                  onSelect: g[5] || (g[5] = (E) => a("select", E))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        P(ek, {
          send: V(f).send,
          count: V(f).comments.value.length,
          onShow: g[7] || (g[7] = (B) => V(f).open.value = !V(f).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", ok, [
        P(rn)
      ])),
      P(l2, {
        ref_key: "footer",
        ref: d,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: w
      }, null, 8, ["id", "row", "read"]),
      u.value ? (c(), G(ga, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: g[8] || (g[8] = (B) => u.value = null)
      }, {
        default: U(() => [
          P(ta, null, {
            default: U(() => [
              ce("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(Y, null, se(d.value.moves, (B) => (c(), G(It, {
            key: B.word,
            onClick: (E) => O(B)
          }, {
            default: U(() => [
              ce(k(B.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : S("", !0)
    ], 2));
  }
}, H4 = /* @__PURE__ */ K(pk, [["__scopeId", "data-v-b1e89192"]]);
function gk(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Os = { exports: {} }, Oo;
function vk() {
  return Oo || (Oo = 1, (function(e, t) {
    var n = (function() {
      var s = function(g, B) {
        var E = 236, I = 17, $ = g, _ = o[B], b = null, m = 0, L = null, N = [], W = {}, re = function(j, q) {
          m = $ * 4 + 17, b = (function(A) {
            for (var H = new Array(A), z = 0; z < A; z += 1) {
              H[z] = new Array(A);
              for (var X = 0; X < A; X += 1)
                H[z][X] = null;
            }
            return H;
          })(m), le(0, 0), le(m - 7, 0), le(0, m - 7), ee(), Q(), De(j, q), $ >= 7 && Z(j), L == null && (L = Ci($, _, N)), Ge(L, q);
        }, le = function(j, q) {
          for (var A = -1; A <= 7; A += 1)
            if (!(j + A <= -1 || m <= j + A))
              for (var H = -1; H <= 7; H += 1)
                q + H <= -1 || m <= q + H || (0 <= A && A <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (A == 0 || A == 6) || 2 <= A && A <= 4 && 2 <= H && H <= 4 ? b[j + A][q + H] = !0 : b[j + A][q + H] = !1);
        }, de = function() {
          for (var j = 0, q = 0, A = 0; A < 8; A += 1) {
            re(!0, A);
            var H = i.getLostPoint(W);
            (A == 0 || j > H) && (j = H, q = A);
          }
          return q;
        }, Q = function() {
          for (var j = 8; j < m - 8; j += 1)
            b[j][6] == null && (b[j][6] = j % 2 == 0);
          for (var q = 8; q < m - 8; q += 1)
            b[6][q] == null && (b[6][q] = q % 2 == 0);
        }, ee = function() {
          for (var j = i.getPatternPosition($), q = 0; q < j.length; q += 1)
            for (var A = 0; A < j.length; A += 1) {
              var H = j[q], z = j[A];
              if (b[H][z] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? b[H + X][z + ae] = !0 : b[H + X][z + ae] = !1;
            }
        }, Z = function(j) {
          for (var q = i.getBCHTypeNumber($), A = 0; A < 18; A += 1) {
            var H = !j && (q >> A & 1) == 1;
            b[Math.floor(A / 3)][A % 3 + m - 8 - 3] = H;
          }
          for (var A = 0; A < 18; A += 1) {
            var H = !j && (q >> A & 1) == 1;
            b[A % 3 + m - 8 - 3][Math.floor(A / 3)] = H;
          }
        }, De = function(j, q) {
          for (var A = _ << 3 | q, H = i.getBCHTypeInfo(A), z = 0; z < 15; z += 1) {
            var X = !j && (H >> z & 1) == 1;
            z < 6 ? b[z][8] = X : z < 8 ? b[z + 1][8] = X : b[m - 15 + z][8] = X;
          }
          for (var z = 0; z < 15; z += 1) {
            var X = !j && (H >> z & 1) == 1;
            z < 8 ? b[8][m - z - 1] = X : z < 9 ? b[8][15 - z - 1 + 1] = X : b[8][15 - z - 1] = X;
          }
          b[m - 8][8] = !j;
        }, Ge = function(j, q) {
          for (var A = -1, H = m - 1, z = 7, X = 0, ae = i.getMaskFunction(q), ne = m - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (b[H][ne - we] == null) {
                  var Me = !1;
                  X < j.length && (Me = (j[X] >>> z & 1) == 1);
                  var ie = ae(H, ne - we);
                  ie && (Me = !Me), b[H][ne - we] = Me, z -= 1, z == -1 && (X += 1, z = 7);
                }
              if (H += A, H < 0 || m <= H) {
                H -= A, A = -A;
                break;
              }
            }
        }, St = function(j, q) {
          for (var A = 0, H = 0, z = 0, X = new Array(q.length), ae = new Array(q.length), ne = 0; ne < q.length; ne += 1) {
            var we = q[ne].dataCount, Me = q[ne].totalCount - we;
            H = Math.max(H, we), z = Math.max(z, Me), X[ne] = new Array(we);
            for (var ie = 0; ie < X[ne].length; ie += 1)
              X[ne][ie] = 255 & j.getBuffer()[ie + A];
            A += we;
            var Ne = i.getErrorCorrectPolynomial(Me), Pe = u(X[ne], Ne.getLength() - 1), Aa = Pe.mod(Ne);
            ae[ne] = new Array(Ne.getLength() - 1);
            for (var ie = 0; ie < ae[ne].length; ie += 1) {
              var Ca = ie + Aa.getLength() - ae[ne].length;
              ae[ne][ie] = Ca >= 0 ? Aa.getAt(Ca) : 0;
            }
          }
          for (var Oa = 0, ie = 0; ie < q.length; ie += 1)
            Oa += q[ie].totalCount;
          for (var ns = new Array(Oa), vn = 0, ie = 0; ie < H; ie += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              ie < X[ne].length && (ns[vn] = X[ne][ie], vn += 1);
          for (var ie = 0; ie < z; ie += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              ie < ae[ne].length && (ns[vn] = ae[ne][ie], vn += 1);
          return ns;
        }, Ci = function(j, q, A) {
          for (var H = d.getRSBlocks(j, q), z = f(), X = 0; X < A.length; X += 1) {
            var ae = A[X];
            z.put(ae.getMode(), 4), z.put(ae.getLength(), i.getLengthInBits(ae.getMode(), j)), ae.write(z);
          }
          for (var ne = 0, X = 0; X < H.length; X += 1)
            ne += H[X].dataCount;
          if (z.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + z.getLengthInBits() + ">" + ne * 8 + ")";
          for (z.getLengthInBits() + 4 <= ne * 8 && z.put(0, 4); z.getLengthInBits() % 8 != 0; )
            z.putBit(!1);
          for (; !(z.getLengthInBits() >= ne * 8 || (z.put(E, 8), z.getLengthInBits() >= ne * 8)); )
            z.put(I, 8);
          return St(z, H);
        };
        W.addData = function(j, q) {
          q = q || "Byte";
          var A = null;
          switch (q) {
            case "Numeric":
              A = v(j);
              break;
            case "Alphanumeric":
              A = y(j);
              break;
            case "Byte":
              A = C(j);
              break;
            case "Kanji":
              A = M(j);
              break;
            default:
              throw "mode:" + q;
          }
          N.push(A), L = null;
        }, W.isDark = function(j, q) {
          if (j < 0 || m <= j || q < 0 || m <= q)
            throw j + "," + q;
          return b[j][q];
        }, W.getModuleCount = function() {
          return m;
        }, W.make = function() {
          if ($ < 1) {
            for (var j = 1; j < 40; j++) {
              for (var q = d.getRSBlocks(j, _), A = f(), H = 0; H < N.length; H++) {
                var z = N[H];
                A.put(z.getMode(), 4), A.put(z.getLength(), i.getLengthInBits(z.getMode(), j)), z.write(A);
              }
              for (var X = 0, H = 0; H < q.length; H++)
                X += q[H].dataCount;
              if (A.getLengthInBits() <= X * 8)
                break;
            }
            $ = j;
          }
          re(!1, de());
        }, W.createTableTag = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var A = "";
          A += '<table style="', A += " border-width: 0px; border-style: none;", A += " border-collapse: collapse;", A += " padding: 0px; margin: " + q + "px;", A += '">', A += "<tbody>";
          for (var H = 0; H < W.getModuleCount(); H += 1) {
            A += "<tr>";
            for (var z = 0; z < W.getModuleCount(); z += 1)
              A += '<td style="', A += " border-width: 0px; border-style: none;", A += " border-collapse: collapse;", A += " padding: 0px; margin: 0px;", A += " width: " + j + "px;", A += " height: " + j + "px;", A += " background-color: ", A += W.isDark(H, z) ? "#000000" : "#ffffff", A += ";", A += '"/>';
            A += "</tr>";
          }
          return A += "</tbody>", A += "</table>", A;
        }, W.createSvgTag = function(j, q, A, H) {
          var z = {};
          typeof arguments[0] == "object" && (z = arguments[0], j = z.cellSize, q = z.margin, A = z.alt, H = z.title), j = j || 2, q = typeof q > "u" ? j * 4 : q, A = typeof A == "string" ? { text: A } : A || {}, A.text = A.text || null, A.id = A.text ? A.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var X = W.getModuleCount() * j + q * 2, ae, ne, we, Me, ie = "", Ne;
          for (Ne = "l" + j + ",0 0," + j + " -" + j + ",0 0,-" + j + "z ", ie += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ie += z.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ie += ' viewBox="0 0 ' + X + " " + X + '" ', ie += ' preserveAspectRatio="xMinYMin meet"', ie += H.text || A.text ? ' role="img" aria-labelledby="' + _t([H.id, A.id].join(" ").trim()) + '"' : "", ie += ">", ie += H.text ? '<title id="' + _t(H.id) + '">' + _t(H.text) + "</title>" : "", ie += A.text ? '<description id="' + _t(A.id) + '">' + _t(A.text) + "</description>" : "", ie += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ie += '<path d="', we = 0; we < W.getModuleCount(); we += 1)
            for (Me = we * j + q, ae = 0; ae < W.getModuleCount(); ae += 1)
              W.isDark(we, ae) && (ne = ae * j + q, ie += "M" + ne + "," + Me + Ne);
          return ie += '" stroke="transparent" fill="black"/>', ie += "</svg>", ie;
        }, W.createDataURL = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var A = W.getModuleCount() * j + q * 2, H = q, z = A - q;
          return T(A, A, function(X, ae) {
            if (H <= X && X < z && H <= ae && ae < z) {
              var ne = Math.floor((X - H) / j), we = Math.floor((ae - H) / j);
              return W.isDark(we, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, W.createImgTag = function(j, q, A) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var H = W.getModuleCount() * j + q * 2, z = "";
          return z += "<img", z += ' src="', z += W.createDataURL(j, q), z += '"', z += ' width="', z += H, z += '"', z += ' height="', z += H, z += '"', A && (z += ' alt="', z += _t(A), z += '"'), z += "/>", z;
        };
        var _t = function(j) {
          for (var q = "", A = 0; A < j.length; A += 1) {
            var H = j.charAt(A);
            switch (H) {
              case "<":
                q += "&lt;";
                break;
              case ">":
                q += "&gt;";
                break;
              case "&":
                q += "&amp;";
                break;
              case '"':
                q += "&quot;";
                break;
              default:
                q += H;
                break;
            }
          }
          return q;
        }, Oi = function(j) {
          var q = 1;
          j = typeof j > "u" ? q * 2 : j;
          var A = W.getModuleCount() * q + j * 2, H = j, z = A - j, X, ae, ne, we, Me, ie = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ne = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Pe = "";
          for (X = 0; X < A; X += 2) {
            for (ne = Math.floor((X - H) / q), we = Math.floor((X + 1 - H) / q), ae = 0; ae < A; ae += 1)
              Me = "█", H <= ae && ae < z && H <= X && X < z && W.isDark(ne, Math.floor((ae - H) / q)) && (Me = " "), H <= ae && ae < z && H <= X + 1 && X + 1 < z && W.isDark(we, Math.floor((ae - H) / q)) ? Me += " " : Me += "█", Pe += j < 1 && X + 1 >= z ? Ne[Me] : ie[Me];
            Pe += `
`;
          }
          return A % 2 && j > 0 ? Pe.substring(0, Pe.length - A - 1) + Array(A + 1).join("▀") : Pe.substring(0, Pe.length - 1);
        };
        return W.createASCII = function(j, q) {
          if (j = j || 1, j < 2)
            return Oi(q);
          j -= 1, q = typeof q > "u" ? j * 2 : q;
          var A = W.getModuleCount() * j + q * 2, H = q, z = A - q, X, ae, ne, we, Me = Array(j + 1).join("██"), ie = Array(j + 1).join("  "), Ne = "", Pe = "";
          for (X = 0; X < A; X += 1) {
            for (ne = Math.floor((X - H) / j), Pe = "", ae = 0; ae < A; ae += 1)
              we = 1, H <= ae && ae < z && H <= X && X < z && W.isDark(ne, Math.floor((ae - H) / j)) && (we = 0), Pe += we ? Me : ie;
            for (ne = 0; ne < j; ne += 1)
              Ne += Pe + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, W.renderTo2dContext = function(j, q) {
          q = q || 2;
          for (var A = W.getModuleCount(), H = 0; H < A; H++)
            for (var z = 0; z < A; z++)
              j.fillStyle = W.isDark(H, z) ? "black" : "white", j.fillRect(H * q, z * q, q, q);
        }, W;
      };
      s.stringToBytesFuncs = {
        default: function(g) {
          for (var B = [], E = 0; E < g.length; E += 1) {
            var I = g.charCodeAt(E);
            B.push(I & 255);
          }
          return B;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(g, B) {
        var E = (function() {
          for (var $ = O(g), _ = function() {
            var Q = $.read();
            if (Q == -1) throw "eof";
            return Q;
          }, b = 0, m = {}; ; ) {
            var L = $.read();
            if (L == -1) break;
            var N = _(), W = _(), re = _(), le = String.fromCharCode(L << 8 | N), de = W << 8 | re;
            m[le] = de, b += 1;
          }
          if (b != B)
            throw b + " != " + B;
          return m;
        })(), I = 63;
        return function($) {
          for (var _ = [], b = 0; b < $.length; b += 1) {
            var m = $.charCodeAt(b);
            if (m < 128)
              _.push(m);
            else {
              var L = E[$.charAt(b)];
              typeof L == "number" ? (L & 255) == L ? _.push(L) : (_.push(L >>> 8), _.push(L & 255)) : _.push(I);
            }
          }
          return _;
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
        ], B = 1335, E = 7973, I = 21522, $ = {}, _ = function(b) {
          for (var m = 0; b != 0; )
            m += 1, b >>>= 1;
          return m;
        };
        return $.getBCHTypeInfo = function(b) {
          for (var m = b << 10; _(m) - _(B) >= 0; )
            m ^= B << _(m) - _(B);
          return (b << 10 | m) ^ I;
        }, $.getBCHTypeNumber = function(b) {
          for (var m = b << 12; _(m) - _(E) >= 0; )
            m ^= E << _(m) - _(E);
          return b << 12 | m;
        }, $.getPatternPosition = function(b) {
          return g[b - 1];
        }, $.getMaskFunction = function(b) {
          switch (b) {
            case r.PATTERN000:
              return function(m, L) {
                return (m + L) % 2 == 0;
              };
            case r.PATTERN001:
              return function(m, L) {
                return m % 2 == 0;
              };
            case r.PATTERN010:
              return function(m, L) {
                return L % 3 == 0;
              };
            case r.PATTERN011:
              return function(m, L) {
                return (m + L) % 3 == 0;
              };
            case r.PATTERN100:
              return function(m, L) {
                return (Math.floor(m / 2) + Math.floor(L / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(m, L) {
                return m * L % 2 + m * L % 3 == 0;
              };
            case r.PATTERN110:
              return function(m, L) {
                return (m * L % 2 + m * L % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(m, L) {
                return (m * L % 3 + (m + L) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + b;
          }
        }, $.getErrorCorrectPolynomial = function(b) {
          for (var m = u([1], 0), L = 0; L < b; L += 1)
            m = m.multiply(u([1, l.gexp(L)], 0));
          return m;
        }, $.getLengthInBits = function(b, m) {
          if (1 <= m && m < 10)
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
          else if (m < 27)
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
          else if (m < 41)
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
            throw "type:" + m;
        }, $.getLostPoint = function(b) {
          for (var m = b.getModuleCount(), L = 0, N = 0; N < m; N += 1)
            for (var W = 0; W < m; W += 1) {
              for (var re = 0, le = b.isDark(N, W), de = -1; de <= 1; de += 1)
                if (!(N + de < 0 || m <= N + de))
                  for (var Q = -1; Q <= 1; Q += 1)
                    W + Q < 0 || m <= W + Q || de == 0 && Q == 0 || le == b.isDark(N + de, W + Q) && (re += 1);
              re > 5 && (L += 3 + re - 5);
            }
          for (var N = 0; N < m - 1; N += 1)
            for (var W = 0; W < m - 1; W += 1) {
              var ee = 0;
              b.isDark(N, W) && (ee += 1), b.isDark(N + 1, W) && (ee += 1), b.isDark(N, W + 1) && (ee += 1), b.isDark(N + 1, W + 1) && (ee += 1), (ee == 0 || ee == 4) && (L += 3);
            }
          for (var N = 0; N < m; N += 1)
            for (var W = 0; W < m - 6; W += 1)
              b.isDark(N, W) && !b.isDark(N, W + 1) && b.isDark(N, W + 2) && b.isDark(N, W + 3) && b.isDark(N, W + 4) && !b.isDark(N, W + 5) && b.isDark(N, W + 6) && (L += 40);
          for (var W = 0; W < m; W += 1)
            for (var N = 0; N < m - 6; N += 1)
              b.isDark(N, W) && !b.isDark(N + 1, W) && b.isDark(N + 2, W) && b.isDark(N + 3, W) && b.isDark(N + 4, W) && !b.isDark(N + 5, W) && b.isDark(N + 6, W) && (L += 40);
          for (var Z = 0, W = 0; W < m; W += 1)
            for (var N = 0; N < m; N += 1)
              b.isDark(N, W) && (Z += 1);
          var De = Math.abs(100 * Z / m / m - 50) / 5;
          return L += De * 10, L;
        }, $;
      })(), l = (function() {
        for (var g = new Array(256), B = new Array(256), E = 0; E < 8; E += 1)
          g[E] = 1 << E;
        for (var E = 8; E < 256; E += 1)
          g[E] = g[E - 4] ^ g[E - 5] ^ g[E - 6] ^ g[E - 8];
        for (var E = 0; E < 255; E += 1)
          B[g[E]] = E;
        var I = {};
        return I.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return B[$];
        }, I.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return g[$];
        }, I;
      })();
      function u(g, B) {
        if (typeof g.length > "u")
          throw g.length + "/" + B;
        var E = (function() {
          for (var $ = 0; $ < g.length && g[$] == 0; )
            $ += 1;
          for (var _ = new Array(g.length - $ + B), b = 0; b < g.length - $; b += 1)
            _[b] = g[b + $];
          return _;
        })(), I = {};
        return I.getAt = function($) {
          return E[$];
        }, I.getLength = function() {
          return E.length;
        }, I.multiply = function($) {
          for (var _ = new Array(I.getLength() + $.getLength() - 1), b = 0; b < I.getLength(); b += 1)
            for (var m = 0; m < $.getLength(); m += 1)
              _[b + m] ^= l.gexp(l.glog(I.getAt(b)) + l.glog($.getAt(m)));
          return u(_, 0);
        }, I.mod = function($) {
          if (I.getLength() - $.getLength() < 0)
            return I;
          for (var _ = l.glog(I.getAt(0)) - l.glog($.getAt(0)), b = new Array(I.getLength()), m = 0; m < I.getLength(); m += 1)
            b[m] = I.getAt(m);
          for (var m = 0; m < $.getLength(); m += 1)
            b[m] ^= l.gexp(l.glog($.getAt(m)) + _);
          return u(b, 0).mod($);
        }, I;
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
        ], B = function($, _) {
          var b = {};
          return b.totalCount = $, b.dataCount = _, b;
        }, E = {}, I = function($, _) {
          switch (_) {
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
        return E.getRSBlocks = function($, _) {
          var b = I($, _);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + _;
          for (var m = b.length / 3, L = [], N = 0; N < m; N += 1)
            for (var W = b[N * 3 + 0], re = b[N * 3 + 1], le = b[N * 3 + 2], de = 0; de < W; de += 1)
              L.push(B(re, le));
          return L;
        }, E;
      })(), f = function() {
        var g = [], B = 0, E = {};
        return E.getBuffer = function() {
          return g;
        }, E.getAt = function(I) {
          var $ = Math.floor(I / 8);
          return (g[$] >>> 7 - I % 8 & 1) == 1;
        }, E.put = function(I, $) {
          for (var _ = 0; _ < $; _ += 1)
            E.putBit((I >>> $ - _ - 1 & 1) == 1);
        }, E.getLengthInBits = function() {
          return B;
        }, E.putBit = function(I) {
          var $ = Math.floor(B / 8);
          g.length <= $ && g.push(0), I && (g[$] |= 128 >>> B % 8), B += 1;
        }, E;
      }, v = function(g) {
        var B = a.MODE_NUMBER, E = g, I = {};
        I.getMode = function() {
          return B;
        }, I.getLength = function(b) {
          return E.length;
        }, I.write = function(b) {
          for (var m = E, L = 0; L + 2 < m.length; )
            b.put($(m.substring(L, L + 3)), 10), L += 3;
          L < m.length && (m.length - L == 1 ? b.put($(m.substring(L, L + 1)), 4) : m.length - L == 2 && b.put($(m.substring(L, L + 2)), 7));
        };
        var $ = function(b) {
          for (var m = 0, L = 0; L < b.length; L += 1)
            m = m * 10 + _(b.charAt(L));
          return m;
        }, _ = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return I;
      }, y = function(g) {
        var B = a.MODE_ALPHA_NUM, E = g, I = {};
        I.getMode = function() {
          return B;
        }, I.getLength = function(_) {
          return E.length;
        }, I.write = function(_) {
          for (var b = E, m = 0; m + 1 < b.length; )
            _.put(
              $(b.charAt(m)) * 45 + $(b.charAt(m + 1)),
              11
            ), m += 2;
          m < b.length && _.put($(b.charAt(m)), 6);
        };
        var $ = function(_) {
          if ("0" <= _ && _ <= "9")
            return _.charCodeAt(0) - 48;
          if ("A" <= _ && _ <= "Z")
            return _.charCodeAt(0) - 65 + 10;
          switch (_) {
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
              throw "illegal char :" + _;
          }
        };
        return I;
      }, C = function(g) {
        var B = a.MODE_8BIT_BYTE, E = s.stringToBytes(g), I = {};
        return I.getMode = function() {
          return B;
        }, I.getLength = function($) {
          return E.length;
        }, I.write = function($) {
          for (var _ = 0; _ < E.length; _ += 1)
            $.put(E[_], 8);
        }, I;
      }, M = function(g) {
        var B = a.MODE_KANJI, E = s.stringToBytesFuncs.SJIS;
        if (!E)
          throw "sjis not supported.";
        (function(_, b) {
          var m = E(_);
          if (m.length != 2 || (m[0] << 8 | m[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var I = E(g), $ = {};
        return $.getMode = function() {
          return B;
        }, $.getLength = function(_) {
          return ~~(I.length / 2);
        }, $.write = function(_) {
          for (var b = I, m = 0; m + 1 < b.length; ) {
            var L = (255 & b[m]) << 8 | 255 & b[m + 1];
            if (33088 <= L && L <= 40956)
              L -= 33088;
            else if (57408 <= L && L <= 60351)
              L -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + L;
            L = (L >>> 8 & 255) * 192 + (L & 255), _.put(L, 13), m += 2;
          }
          if (m < b.length)
            throw "illegal char at " + (m + 1);
        }, $;
      }, w = function() {
        var g = [], B = {};
        return B.writeByte = function(E) {
          g.push(E & 255);
        }, B.writeShort = function(E) {
          B.writeByte(E), B.writeByte(E >>> 8);
        }, B.writeBytes = function(E, I, $) {
          I = I || 0, $ = $ || E.length;
          for (var _ = 0; _ < $; _ += 1)
            B.writeByte(E[_ + I]);
        }, B.writeString = function(E) {
          for (var I = 0; I < E.length; I += 1)
            B.writeByte(E.charCodeAt(I));
        }, B.toByteArray = function() {
          return g;
        }, B.toString = function() {
          var E = "";
          E += "[";
          for (var I = 0; I < g.length; I += 1)
            I > 0 && (E += ","), E += g[I];
          return E += "]", E;
        }, B;
      }, x = function() {
        var g = 0, B = 0, E = 0, I = "", $ = {}, _ = function(m) {
          I += String.fromCharCode(b(m & 63));
        }, b = function(m) {
          if (!(m < 0)) {
            if (m < 26)
              return 65 + m;
            if (m < 52)
              return 97 + (m - 26);
            if (m < 62)
              return 48 + (m - 52);
            if (m == 62)
              return 43;
            if (m == 63)
              return 47;
          }
          throw "n:" + m;
        };
        return $.writeByte = function(m) {
          for (g = g << 8 | m & 255, B += 8, E += 1; B >= 6; )
            _(g >>> B - 6), B -= 6;
        }, $.flush = function() {
          if (B > 0 && (_(g << 6 - B), g = 0, B = 0), E % 3 != 0)
            for (var m = 3 - E % 3, L = 0; L < m; L += 1)
              I += "=";
        }, $.toString = function() {
          return I;
        }, $;
      }, O = function(g) {
        var B = g, E = 0, I = 0, $ = 0, _ = {};
        _.read = function() {
          for (; $ < 8; ) {
            if (E >= B.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var m = B.charAt(E);
            if (E += 1, m == "=")
              return $ = 0, -1;
            if (m.match(/^\s$/))
              continue;
            I = I << 6 | b(m.charCodeAt(0)), $ += 6;
          }
          var L = I >>> $ - 8 & 255;
          return $ -= 8, L;
        };
        var b = function(m) {
          if (65 <= m && m <= 90)
            return m - 65;
          if (97 <= m && m <= 122)
            return m - 97 + 26;
          if (48 <= m && m <= 57)
            return m - 48 + 52;
          if (m == 43)
            return 62;
          if (m == 47)
            return 63;
          throw "c:" + m;
        };
        return _;
      }, F = function(g, B) {
        var E = g, I = B, $ = new Array(g * B), _ = {};
        _.setPixel = function(N, W, re) {
          $[W * E + N] = re;
        }, _.write = function(N) {
          N.writeString("GIF87a"), N.writeShort(E), N.writeShort(I), N.writeByte(128), N.writeByte(0), N.writeByte(0), N.writeByte(0), N.writeByte(0), N.writeByte(0), N.writeByte(255), N.writeByte(255), N.writeByte(255), N.writeString(","), N.writeShort(0), N.writeShort(0), N.writeShort(E), N.writeShort(I), N.writeByte(0);
          var W = 2, re = m(W);
          N.writeByte(W);
          for (var le = 0; re.length - le > 255; )
            N.writeByte(255), N.writeBytes(re, le, 255), le += 255;
          N.writeByte(re.length - le), N.writeBytes(re, le, re.length - le), N.writeByte(0), N.writeString(";");
        };
        var b = function(N) {
          var W = N, re = 0, le = 0, de = {};
          return de.write = function(Q, ee) {
            if (Q >>> ee)
              throw "length over";
            for (; re + ee >= 8; )
              W.writeByte(255 & (Q << re | le)), ee -= 8 - re, Q >>>= 8 - re, le = 0, re = 0;
            le = Q << re | le, re = re + ee;
          }, de.flush = function() {
            re > 0 && W.writeByte(le);
          }, de;
        }, m = function(N) {
          for (var W = 1 << N, re = (1 << N) + 1, le = N + 1, de = L(), Q = 0; Q < W; Q += 1)
            de.add(String.fromCharCode(Q));
          de.add(String.fromCharCode(W)), de.add(String.fromCharCode(re));
          var ee = w(), Z = b(ee);
          Z.write(W, le);
          var De = 0, Ge = String.fromCharCode($[De]);
          for (De += 1; De < $.length; ) {
            var St = String.fromCharCode($[De]);
            De += 1, de.contains(Ge + St) ? Ge = Ge + St : (Z.write(de.indexOf(Ge), le), de.size() < 4095 && (de.size() == 1 << le && (le += 1), de.add(Ge + St)), Ge = St);
          }
          return Z.write(de.indexOf(Ge), le), Z.write(re, le), Z.flush(), ee.toByteArray();
        }, L = function() {
          var N = {}, W = 0, re = {};
          return re.add = function(le) {
            if (re.contains(le))
              throw "dup key:" + le;
            N[le] = W, W += 1;
          }, re.size = function() {
            return W;
          }, re.indexOf = function(le) {
            return N[le];
          }, re.contains = function(le) {
            return typeof N[le] < "u";
          }, re;
        };
        return _;
      }, T = function(g, B, E) {
        for (var I = F(g, B), $ = 0; $ < B; $ += 1)
          for (var _ = 0; _ < g; _ += 1)
            I.setPixel(_, $, E(_, $));
        var b = w();
        I.write(b);
        for (var m = x(), L = b.toByteArray(), N = 0; N < L.length; N += 1)
          m.writeByte(L[N]);
        return m.flush(), "data:image/gif;base64," + m;
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
  })(Os)), Os.exports;
}
var yk = vk();
const wk = /* @__PURE__ */ gk(yk), kk = ["width", "height", "viewBox"], bk = ["width", "height"], xk = ["d"], $k = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const s = wk(0, "M");
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
      p("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, bk),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, xk)
    ], 8, kk));
  }
}, U4 = /* @__PURE__ */ K($k, [["__scopeId", "data-v-489f0852"]]), Mk = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: pe({ padding: e.padding })
    }, [
      he(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, z4 = /* @__PURE__ */ K(Mk, [["__scopeId", "data-v-47e67f04"]]), V4 = Hi(() => import("./VoiceFigure-CvtaMnhC.js").then((e) => e.V)), G4 = "1.0.0", K4 = "3.5";
export {
  $l as $,
  Se as A,
  Ae as B,
  r4 as C,
  Xn as D,
  nt as E,
  a4 as F,
  ny as G,
  Kb as H,
  e4 as I,
  cy as J,
  Mt as K,
  Dv as L,
  xa as M,
  py as N,
  ly as O,
  Zn as P,
  k5 as Q,
  Eb as R,
  On as S,
  S5 as T,
  wb as U,
  _e as V,
  Dn as W,
  yb as X,
  vb as Y,
  xl as Z,
  K as _,
  cb as a,
  W5 as a$,
  fy as a0,
  Ab as a1,
  Cb as a2,
  Le as a3,
  qb as a4,
  jb as a5,
  bt as a6,
  Ob as a7,
  Xb as a8,
  Xk as a9,
  B5 as aA,
  v5 as aB,
  Sv as aC,
  n5 as aD,
  s5 as aE,
  o4 as aF,
  ci as aG,
  M5 as aH,
  fn as aI,
  ab as aJ,
  tb as aK,
  K5 as aL,
  mn as aM,
  X5 as aN,
  Gb as aO,
  y5 as aP,
  w5 as aQ,
  g5 as aR,
  nn as aS,
  wt as aT,
  Qk as aU,
  p0 as aV,
  m5 as aW,
  Sb as aX,
  ii as aY,
  Rt as aZ,
  Nt as a_,
  H5 as aa,
  J5 as ab,
  ib as ac,
  kb as ad,
  bb as ae,
  Nb as af,
  Pb as ag,
  Fb as ah,
  fb as ai,
  Mo as aj,
  Tb as ak,
  Zb as al,
  c4 as am,
  u5 as an,
  l5 as ao,
  i5 as ap,
  Wb as aq,
  Lb as ar,
  Bb as as,
  Db as at,
  $5 as au,
  Jb as av,
  Qb as aw,
  h4 as ax,
  Ut as ay,
  e5 as az,
  _y as b,
  d4 as b$,
  Xv as b0,
  Z5 as b1,
  A5 as b2,
  E5 as b3,
  j0 as b4,
  Kr as b5,
  j5 as b6,
  Yb as b7,
  ts as b8,
  rt as b9,
  O5 as bA,
  D5 as bB,
  ct as bC,
  _5 as bD,
  N5 as bE,
  t5 as bF,
  d5 as bG,
  a5 as bH,
  Ce as bI,
  Vb as bJ,
  P5 as bK,
  k4 as bL,
  b4 as bM,
  Jk as bN,
  y0 as bO,
  Ub as bP,
  T5 as bQ,
  ub as bR,
  l4 as bS,
  C5 as bT,
  I5 as bU,
  R5 as bV,
  Hb as bW,
  _v as bX,
  zb as bY,
  r5 as bZ,
  i4 as b_,
  L5 as ba,
  ys as bb,
  Xo as bc,
  m4 as bd,
  v4 as be,
  x5 as bf,
  G5 as bg,
  Zk as bh,
  c5 as bi,
  p4 as bj,
  Ib as bk,
  Rb as bl,
  pb as bm,
  _b as bn,
  sb as bo,
  z5 as bp,
  db as bq,
  hb as br,
  gb as bs,
  f5 as bt,
  u0 as bu,
  Q5 as bv,
  iy as bw,
  mb as bx,
  ob as by,
  h5 as bz,
  Ve as c,
  Ei as c$,
  nb as c0,
  eb as c1,
  o5 as c2,
  y4 as c3,
  Ea as c4,
  w4 as c5,
  Mi as c6,
  V5 as c7,
  $b as c8,
  xb as c9,
  Nk as cA,
  L4 as cB,
  Vs as cC,
  zk as cD,
  ug as cE,
  It as cF,
  ta as cG,
  ga as cH,
  Ik as cI,
  Pk as cJ,
  ul as cK,
  F4 as cL,
  Bk as cM,
  U4 as cN,
  T4 as cO,
  Dl as cP,
  Ek as cQ,
  Gk as cR,
  vw as cS,
  R1 as cT,
  jk as cU,
  rn as cV,
  b1 as cW,
  Wk as cX,
  Ak as cY,
  Hn as cZ,
  H4 as c_,
  m0 as ca,
  rb as cb,
  oy as cc,
  p5 as cd,
  wa as ce,
  kv as cf,
  b5 as cg,
  zt as ch,
  Tt as ci,
  Ok as cj,
  R4 as ck,
  ke as cl,
  Kn as cm,
  Tk as cn,
  Lh as co,
  W4 as cp,
  Yk as cq,
  In as cr,
  x4 as cs,
  _k as ct,
  Zt as cu,
  Dk as cv,
  ye as cw,
  B4 as cx,
  G4 as cy,
  K4 as cz,
  P0 as d,
  qk as d0,
  it as d1,
  Fk as d2,
  Fn as d3,
  V4 as d4,
  z4 as d5,
  Er as d6,
  E4 as d7,
  Rf as d8,
  Bf as d9,
  C4 as dA,
  Mm as dB,
  O4 as dC,
  Un as dD,
  N4 as dE,
  j4 as da,
  P4 as db,
  q4 as dc,
  Kk as dd,
  Vk as de,
  Uk as df,
  M4 as dg,
  $4 as dh,
  sg as di,
  Ck as dj,
  Lk as dk,
  _4 as dl,
  A4 as dm,
  Xe as dn,
  Rk as dp,
  S4 as dq,
  Hk as dr,
  kt as ds,
  zy as dt,
  I4 as du,
  Hy as dv,
  D4 as dw,
  sm as dx,
  Aw as dy,
  qr as dz,
  We as e,
  c0 as f,
  Mb as g,
  f4 as h,
  sn as i,
  t4 as j,
  g4 as k,
  U5 as l,
  n4 as m,
  Ty as n,
  Y5 as o,
  lb as p,
  $a as q,
  xi as r,
  $i as s,
  qe as t,
  s4 as u,
  F0 as v,
  u4 as w,
  q5 as x,
  F5 as y,
  gn as z
};
