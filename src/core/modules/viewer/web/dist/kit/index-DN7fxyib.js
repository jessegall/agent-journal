/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as he, createElementVNode as m, normalizeClass as J, Fragment as Y, renderList as se, normalizeStyle as me, defineComponent as Ai, Comment as Ci, h as na, cloneVNode as Oi, createBlock as G, withCtx as H, unref as z, createVNode as j, toDisplayString as k, createCommentVNode as E, inject as Te, computed as R, resolveDynamicComponent as xt, Transition as Bt, watch as xe, ref as D, shallowRef as Fn, createTextVNode as ce, TransitionGroup as Oo, mergeProps as ut, reactive as sa, onMounted as Be, onUnmounted as Ie, nextTick as on, useId as To, Teleport as aa, withModifiers as be, isRef as Oa, onBeforeUnmount as Lt, resolveComponent as Ti, resolveDirective as Ii, withDirectives as dt, useAttrs as oa, useModel as Cs, getCurrentInstance as Ri, mergeModels as Os, getCurrentScope as Io, onScopeDispose as Ro, provide as Bi, onErrorCaptured as Li, toHandlers as Di, createSlots as Ni, vShow as Pi, useSlots as ji, withKeys as Vt, vModelText as Ts, defineAsyncComponent as qi } from "vue";
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Fi = { class: "skeleton-line" }, Wi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Fi, [
      he(t.$slots, "default", {}, void 0, !0),
      m("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(Y, null, se(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: me({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ft = /* @__PURE__ */ K(Wi, [["__scopeId", "data-v-0ebb6933"]]), Wn = Ai({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Ci);
      return s.length !== 1 ? na(Y, { key: n }, s) : s[0].key == null ? Oi(s[0], { key: n }) : s[0];
    };
  }
}), Hi = ["aria-label"], Ui = ["aria-label"], zi = ["aria-label"], Vi = ["aria-label"], Gi = ["aria-label"], Ki = ["aria-label"], Yi = ["aria-label"], Ji = {
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
    return (l, u) => (c(), G(Wn, { value: e.shape }, {
      messages: H(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(Y, null, se(t, (d) => m("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: me({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, Hi)
      ]),
      older: H(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: me({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, Ui)
      ]),
      cards: H(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(Y, null, se(n, (f) => j(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, zi)
      ]),
      file: H(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            j(ft, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(Y, null, se(a, (f) => j(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Vi)
      ]),
      page: H(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          j(ft, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Gi)
      ]),
      text: H(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(Y, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ki)
      ]),
      default: H(() => [
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
        ], 8, Yi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, rn = /* @__PURE__ */ K(Ji, [["__scopeId", "data-v-1392eacb"]]), Zi = {
  key: 1,
  class: "empty-state titled"
}, Xi = { class: "empty-state-title" }, Qi = { class: "empty-state-text" }, el = {
  key: 2,
  class: "empty-state"
}, tl = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(rn, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Zi, [
      m("p", Xi, k(e.title), 1),
      m("p", Qi, [
        he(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", el, [
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, In = /* @__PURE__ */ K(tl, [["__scopeId", "data-v-b27e89b0"]]), nl = { class: "fold-group" }, sl = ["aria-expanded"], al = { class: "fold-label" }, ol = {
  key: 0,
  class: "fold-count"
}, rl = {
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
    return (s, a) => (c(), h("div", nl, [
      m("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        m("span", al, k(e.label), 1),
        e.count !== "" ? (c(), h("span", ol, k(e.count), 1)) : E("", !0),
        m("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, sl),
      e.open ? he(s.$slots, "default", {}, void 0, !0, 0) : E("", !0)
    ]));
  }
}, vk = /* @__PURE__ */ K(rl, [["__scopeId", "data-v-9ef1865c"]]), il = Symbol("open-view"), Le = Symbol.for("journal.window-context");
function Hn() {
  const e = Te(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const ll = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: me({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, cl = /* @__PURE__ */ K(ll, [["__scopeId", "data-v-eb453d6f"]]), ul = {
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
      default: H(() => [
        m("span", {
          class: J(["btn-label", { hidden: e.busy }])
        }, [
          he(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (c(), G(cl, {
          key: 0,
          class: "btn-spinner"
        })) : E("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, ke = /* @__PURE__ */ K(ul, [["__scopeId", "data-v-a2dc4bda"]]), dl = {
  class: "running",
  "data-running-command": ""
}, hl = ["title"], fl = {
  key: "idle",
  class: "running-idle"
}, pl = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", dl, [
      j(Bt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: H(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, hl)) : (c(), h("span", fl, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, yk = /* @__PURE__ */ K(pl, [["__scopeId", "data-v-d3240219"]]), ml = ["aria-checked", "aria-label", "title"], gl = {
  key: 0,
  class: "switch-inner"
}, vl = {
  key: 0,
  class: "switch-word"
}, yl = {
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
        e.labelled ? (c(), h("span", gl, k(e.word), 1)) : E("", !0),
        a[1] || (a[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", vl, k(e.word), 1)) : E("", !0)
    ], 10, ml));
  }
}, wk = /* @__PURE__ */ K(yl, [["__scopeId", "data-v-1bfb90f3"]]);
function Bo(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Gt(e, t) {
  return Bo(() => localStorage, e, t);
}
function Lo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Un(e, t) {
  return Lo(() => localStorage, e, t);
}
function Do(e, t) {
  xe(t, (n) => Un(e, n), { deep: !0 });
}
function wl(e, t) {
  return Bo(() => sessionStorage, e, t);
}
function kl(e, t) {
  return Lo(() => sessionStorage, e, t);
}
const Rn = "journal.environment", No = D(wl(Rn, Gt(Rn, "")));
function bl(e) {
  No.value = e, kl(Rn, e), Un(Rn, e);
}
const Bn = D(location.hash), Ta = Fn(null), Ia = { integrations: "mcp", library: "team" };
function xl() {
  if (!Ta.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ia[n]) {
    location.replace(`#/${[Ia[n], ...s].join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash;
    return;
  }
  !n || Ta.value(n) || (bl(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Bn.value = location.hash, xl();
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
}), zn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${zn.page(e)}?open=${t}`
};
function $l(e = "", t = 0, n = "") {
  location.hash = zn.page(e, t, n);
}
const Ml = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Po(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Ml).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ot = {};
function kk(e, t) {
  return Ot[e] = t, () => Ot[e] === t && delete Ot[e];
}
function jo(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Ot[e]) != null && r.call(Ot, t))) return;
  const a = Je.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Po([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function _l(e, t, n, s = 0, a = "") {
  if (e === Je.value.env) return jo(t, n, s, a);
  const o = Je.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Po([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Ze(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? _l(s, a, Number(o), 0, t) : jo(a, Number(o), 0, t);
}
function Sl(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ct(e) {
  const t = Sl(e);
  t && Ze(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Vn = typeof document < "u" && document.documentElement.classList.contains("phone"), El = "Files are attached on the computer; the phone sends text.", ns = [
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
    filters: ns
  }),
  tasks: ge("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: ns
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
  pins: ge("Pin", "band", "One line pinned to the chat while it matters", { filters: ns }),
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
}, Al = ["secrets", "plugins"], qo = Object.keys(ln).filter((e) => !(Vn && Al.includes(e)));
R(() => qo.map((e) => ({ name: e, ...ln[e] })));
const cn = (e) => ln[e], Fo = new Map(qo.flatMap((e) => [e, e.replace(/s$/, ""), ln[e].title.toLowerCase()].map((t) => [t, e]))), kt = (e) => Fo.get(String(e).toLowerCase()) || "", Wo = [...Fo.keys()].sort((e, t) => t.length - e.length).join("|"), Cl = ["stroke-width", "innerHTML"], ye = {
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
      style: me({
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
    }, null, 12, Cl));
  }
}, Gn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), G(ke, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: H(() => [
        j(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Ol = {
  key: 1,
  class: "row-list-failure"
}, Tl = ["data-row"], Il = {
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
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Ol, k(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(In, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: H(() => [
        ce(k(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(Y, { key: 3 }, [
      (c(), G(xt(e.arrival ? Oo : "ul"), ut(n.value, { class: "row-list" }), {
        default: H(() => [
          (c(!0), h(Y, null, se(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            he(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Tl))), 128))
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
}, Rl = /* @__PURE__ */ K(Il, [["__scopeId", "data-v-aa6ad7ff"]]), Bl = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ll = {
  key: 1,
  class: "agent-rows-note"
}, Dl = {
  key: 2,
  class: "agent-rows-note"
}, Nl = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Pl = ["data-agent-row", "onClick"], jl = { class: "agent-row-name" }, ql = { class: "agent-row-state" }, Fl = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = R(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Bl, [
      e.loaded ? e.failure ? (c(), h("p", Ll, k(e.failure), 1)) : e.rows.length ? (c(), h(Y, { key: 3 }, [
        m("p", Nl, k(s.value) + " running", 1),
        (c(!0), h(Y, null, se(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(Ze)(`agents:${r.id}`)
        }, [
          m("span", jl, "#" + k(r.id) + " " + k(r.session), 1),
          m("span", ql, k(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Pl))), 128))
      ], 64)) : (c(), h("p", Dl, k(e.none), 1)) : (c(), G(rn, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, bk = /* @__PURE__ */ K(Fl, [["__scopeId", "data-v-a01e5a17"]]), Wl = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["badge", e.tone])
    }, k(e.text), 3));
  }
}, Ho = /* @__PURE__ */ K(Wl, [["__scopeId", "data-v-9e7e1157"]]), Hl = ["aria-valuenow", "aria-valuemax"], Ul = {
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
        style: me({ width: n.value })
      }, null, 4)
    ], 10, Hl));
  }
}, zl = /* @__PURE__ */ K(Ul, [["__scopeId", "data-v-9eba6a85"]]), Vl = { class: "bars" }, Gl = { class: "bar-name" }, Kl = { class: "bar-value" }, Yl = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", Vl, [
      (c(!0), h(Y, null, se(e.items, (l, u) => (c(), G(xt(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: J(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: H(() => [
          m("span", Gl, k(l.label), 1),
          j(zl, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Kl, k(l.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Jl = /* @__PURE__ */ K(Yl, [["__scopeId", "data-v-663427f4"]]), Zl = { class: "bars" }, Xl = {
  key: 0,
  class: "bars-title"
}, Ql = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Zl, [
      e.node.title ? (c(), h("span", Xl, k(e.node.title), 1)) : E("", !0),
      j(Jl, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, ec = /* @__PURE__ */ K(Ql, [["__scopeId", "data-v-7135bb11"]]), tc = {
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
      style: me(o.value)
    }, [
      (c(!0), h(Y, null, se(e.node.children || [], (l, u) => (c(), G(yr, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, En = /* @__PURE__ */ K(tc, [["__scopeId", "data-v-d142a3f4"]]), nc = {
  key: 0,
  class: "card-head"
}, sc = { class: "card-title" }, ac = {
  key: 0,
  class: "card-note"
}, oc = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", nc, [
        m("span", sc, k(e.node.title), 1),
        e.node.note ? (c(), h("span", ac, k(e.node.note), 1)) : E("", !0)
      ])) : E("", !0),
      j(En, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, rc = /* @__PURE__ */ K(oc, [["__scopeId", "data-v-67b72d40"]]), ic = (e) => "task_ids" in e, Uo = 1024, lc = Uo * 1024 * 1024, cc = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Uo} MB limit for one file.`;
function uc() {
  return () => {
  };
}
function Ra(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function dc(e = window) {
  if (!Ra(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ra(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Is = "journal.stale-build-reload", hc = 'script[type="module"][src*="/assets/index-"]', Ba = (e) => {
  var t;
  return ((t = e.querySelector(hc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function fc(e = document, t = fetch, n = () => dc(window)) {
  const s = Ba(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = Ba(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
const pc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function mc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Is) === e.message) return !1;
    t.setItem(Is, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function gc(e = window.sessionStorage) {
  try {
    e.removeItem(Is);
  } catch {
    return;
  }
}
const vc = 2e3, yc = 3e4, lt = sa({ starting: !1, external: !1, late: !1 }), ra = () => lt.starting;
let Rs = 0, zo = 0, Vo = [];
async function wc() {
  try {
    const e = await qe.serverState();
    return e.ok ? await e.json() : { restarting: !1, updating: !1 };
  } catch {
    return { restarting: !0, updating: lt.external };
  }
}
function kc() {
  clearInterval(Rs), clearTimeout(zo), Rs = 0, Object.assign(lt, { starting: !1, external: !1, late: !1 }), Vo.splice(0).forEach((e) => e()), fc();
}
async function bc() {
  const e = await wc();
  lt.external = e.updating, !e.restarting && !e.updating && kc();
}
function La() {
  lt.starting || (lt.starting = !0, Rs = setInterval(bc, vc), zo = setTimeout(() => lt.late = !0, yc));
}
const xc = () => lt.starting ? new Promise((e) => Vo.push(e)) : Promise.resolve(), Da = 2e4, $c = 3e5, Ge = 6e5, yn = 6, Mc = 500, _c = "/journal/summary", Sc = "/api/server-state", Na = Vn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ec = (e) => e.split("?")[0].endsWith(_c), Go = (e, t) => Object.assign(new Error(t), { status: e });
async function Ac(e, t, n = Go) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Cc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Oc {
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
        body: Cc(s),
        signal: AbortSignal.timeout(a || (i ? $c : Da))
      });
    } catch (l) {
      if (l instanceof TypeError && La(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Mc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = yn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : uc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Ac(l, `${l.status} ${l.statusText}`).catch((u) => {
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
    if (ra() && !Ec(n))
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
    return fetch(Sc, { cache: "no-store" });
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
const qe = new Oc(), Re = (e) => encodeURIComponent(e);
function fe(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const Nt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Pt = "the page does not know its environment yet", Tc = "X-Journal-Env", Ic = "X-Journal-Request-At", ss = "/viewer/voices/figures/";
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
    return { [Ic]: String(Date.now()), ...this.env() ? { [Tc]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === Pt ? Promise.reject(new Error(Pt)) : qe.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === Pt ? Promise.reject(new Error(Pt)) : qe.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : Pt;
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
    return this.get(d, `${t}.${Nt({ before: s, after: a, since: o, ids: r, tasks: i, closed: l, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${fe({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${Nt({ before: s, since: a, docked: o })}`);
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
    if (Vn) return Promise.reject(Object.assign(new Error(El), { status: 403 }));
    if (s.size > lc) return Promise.reject(new Error(cc(s)));
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
    return this.get(this.here(`${a}${fe(s)}`), `${a}.${Nt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${fe(n)}`), `/verifiers/${t}/transcript.${Nt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${fe(n)}`), `/workers/${t}/transcript.${Nt(n)}`);
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
    return qe.request("GET", ss + "figures.json");
  }
  voiceFigureUrl(t) {
    return ss + t;
  }
  figureDecoderUrl() {
    return ss + "draco/";
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
    return `${this.base}/${t ? `?env=${Re(t)}` : ""}${zn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const ze = new ia({ base: Vn ? "/p" : "" }), Rc = (e) => qe.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ze.base.length).split("/")[2]);
}), Pa = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), Bc = 6e4, Lc = 4, Dc = 300, Nc = 5e3, Ko = /* @__PURE__ */ new Map();
function Kn(e) {
  if (!(e in Pa)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Pa[e];
}
function Pc(e) {
  const t = Kn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Nc;
  }
}
const jc = (e) => e / 2 + Math.random() * e / 2, Yo = (e) => [...e.users.values()].pop(), la = (e) => Ko.get(e.place) === e, qc = () => Math.random() * Dc, ca = () => document.hidden;
function Fc(e) {
  const t = Pc(e);
  return e.failures ? jc(Math.min(Bc, t * 2 ** e.failures)) : Math.max(t, Lc * e.took);
}
function Jo(e, t) {
  clearTimeout(e.timer), !(!la(e) || ca()) && (e.timer = setTimeout(() => Wc(e), t));
}
function Wc(e) {
  return la(e) ? e.running ? (e.again = !0, e.running) : (e.running = Vc(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Hc = (e) => {
  var t, n;
  return !ca() && (((n = (t = Kn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Yo(e).active() && !ra();
};
async function Uc(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await qe.attemptOnce(() => Kn(e.key).read(Yo(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function zc(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Kn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Vc(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Hc(e) && zc(e, await Uc(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && la(e));
  Jo(e, Fc(e));
}
const Gc = () => ca() || Ko.forEach((e) => Jo(e, qc()));
document.addEventListener("visibilitychange", Gc);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Zo = (e) => `${e.table}:${e.id}`, ja = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", as = 80;
function qa(e) {
  return e.length <= as ? e : `${e.slice(0, as + 1).replace(/\s+\S*$/, "") || e.slice(0, as)}…`;
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
}, Kc = (e) => (Fa[e.table] ? Fa[e.table](e) : e.title || "") || "", Yc = ["done", "cancelled"], Bs = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => Yc.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, Jc = (e) => Bs[e.table] ? Bs[e.table](e) : 0, Xo = (e) => Jc(e) > 0, Zc = (e) => !!Bs[e], bt = (e) => Ee(e.created_at), Ls = (e) => Ee(e.updated_at) || bt(e), Xc = 60, Qc = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - Xc, eu = (e, t) => e.id > 0 && e.table === t.table && Qc(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ua = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => eu(s, n))), tu = { me: 1, people: [] }, ue = sa({
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
  people: tu,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Gt("journal.activity", !0),
  wide: !1,
  sideMini: Gt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Do("journal.activity", () => ue.activity);
Do("journal.side.mini", () => ue.sideMini);
const nu = 50, Qo = 100, su = { messages: 25 }, Ue = (e) => su[e] || nu;
function au(e, t) {
  if (e !== "messages") return Math.max(t.length - Ue(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Ue(e)) return s;
  return 0;
}
const ht = /* @__PURE__ */ new Set(), da = D(0), un = /* @__PURE__ */ new Set(), dn = /* @__PURE__ */ new Set(), at = /* @__PURE__ */ new Set(), Ds = /* @__PURE__ */ new Set(), ou = /* @__PURE__ */ new Map(), ru = /* @__PURE__ */ new Map();
let jt = !1, qt = null;
const iu = (e, t) => e.id - t.id, lu = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, cu = { messages: lu }, er = (e) => cu[e] || iu;
function tr(e) {
  return da.value, ht.has(e) || (ht.add(e), ue.booted && (!un.has(e) || dn.has(e)) && queueMicrotask(() => ha([e], !1))), ue.rows[e] || [];
}
function uu(e) {
  const t = ue.rows[e] || [], n = au(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ue.rows[e] = t.filter((a) => s.has(a) || Zc(e) && !Xo(a)), ue.paging.size[e] = Ue(e), ue.paging.more[e] = !0;
}
const du = /* @__PURE__ */ new Set();
function hu() {
  ht.forEach(uu), ht.clear(), ou.clear(), ru.clear(), da.value += 1;
}
xe(() => `${Je.value.env}/${Je.value.page}/${Je.value.open ? Je.value.open.table : ""}`, hu);
xe(
  () => ue.booted,
  (e) => e && ha(
    [...ht].filter((t) => !un.has(t)),
    !1
  )
);
const Ns = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !ic(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function nr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Ns(s) && !Ns(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function sr(e, t) {
  un.add(e), da.value += 1;
  const n = ue.rows[e] || [];
  ue.rows[e] = [...nr(n, t.rows), ...ua(n.filter((s) => s.id === 0), t.rows)], ue.paging.size[e] = ue.paging.size[e] || Ue(e), ue.paging.more[e] = !t.is_last_page;
}
async function fu(e) {
  const t = new Set((ue.rows[e] || []).map((o) => o.id)), n = await ze.list(e, { limit: Ue(e) });
  Yn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ua((ue.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return sr(e, { ...n, rows: [...n.rows, ...a].sort(er(e)) }), ue.paging.size[e] = Ue(e), ar.has(e) && await or(e), ue.rows[e];
}
const Yn = (e, t) => ue.counts = { ...ue.counts, [e]: t };
async function pu(e) {
  const t = ue.rows[e] || [], n = Math.max(0, ...t.map(Ls)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ze.list(e, { limit: Ue(e), since: n, after: s });
  if (Yn(e, a.counts), !a.is_last_page) return fu(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = ua(t.filter((i) => !o.has(i.id)), a.rows).concat(nr(t, a.rows));
  return ue.rows[e] = r.sort(er(e)), ue.paging.size[e] = ue.rows[e].length, ue.rows[e];
}
const os = /* @__PURE__ */ new Set();
async function mu(e, t = !1) {
  e.forEach((n) => dn.delete(n)), e.forEach((n) => Ds.add(n));
  try {
    await xu(e, t);
  } finally {
    e.forEach((n) => Ds.delete(n));
  }
}
async function gu(e) {
  const t = await ze.list(e, { limit: Ue(e) });
  Yn(e, t.counts), sr(e, t);
}
async function vu(e) {
  Yn(e, (await ze.list(e, { limit: 1, closed: !0 })).counts);
}
const ar = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function or(e) {
  const t = (ue.rows[e] || []).filter((a) => Ns(a) && (e !== "plans" || !Xo(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await ze.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ue.rows[e] = (ue.rows[e] || []).map((a) => s.get(a.id) || a);
}
const yu = (e, t) => !un.has(e) || t && (ue.paging.size[e] || Ue(e)) === Ue(e) && !du.has(e);
async function wu(e, t) {
  if (!ht.has(e)) return vu(e);
  const n = await (yu(e, t) ? gu(e) : pu(e));
  return ar.has(e) && await or(e), n;
}
async function rr() {
  const e = await ze.settings();
  JSON.stringify(e) !== JSON.stringify(ue.settings) && (ue.settings = e);
}
async function ku() {
  const [e] = await Promise.all([ze.entries(0, Qo), rr()]);
  _u([...Gt(lr(), []), ...e]);
}
const bu = (e, t) => wu(e, t).then(
  () => null,
  () => e
);
async function xu(e, t) {
  const n = (await Promise.all(e.map((s) => bu(s, t)))).filter(Boolean);
  if (n.forEach((s) => (at.add(s), dn.add(s))), t && await ku(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const ir = 1e3, $u = 15e3;
let wn = ir;
async function Mu() {
  return qt || (qt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...at].some((e) => !os.has(e)) || jt; ) {
      const e = jt, t = [...e ? Object.keys(ue.rows) : at].filter((s) => ln[s] && (ht.has(s) || s in ue.rows)).filter((s) => e || !ht.has(s) || dn.has(s) || !un.has(s)).filter((s) => !os.has(s)), n = [...at].filter((s) => os.has(s));
      at.clear(), n.forEach((s) => at.add(s)), jt = !1;
      try {
        await mu(t, e), wn = ir;
      } catch {
        jt = jt || e, await new Promise((a) => setTimeout(a, wn)), wn = Math.min(wn * 2, $u);
      }
    }
  })().finally(() => qt = null), qt);
}
function ha(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Ds.has(n)).forEach((n) => {
    at.add(n), t && dn.add(n);
  }), at.delete("settings") && rr(), Mu();
}
const lr = () => {
  var e;
  return `typed-entries:${((e = ue.identity) == null ? void 0 : e.root) || location.host}:${ze.env()}`;
};
function _u(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ue.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Qo), Un(lr(), ue.entries.slice(-50));
}
Rc((e) => ue.streamOpen || ha([e]));
const Ps = [], Su = 2e3, st = /* @__PURE__ */ new Map(), Eu = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Au = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function $t(e, { first: t = !1 } = {}) {
  t ? Ps.unshift(e) : Ps.push(e), st.clear();
}
function cr(e, t, n) {
  var a;
  const s = tr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Cu = (e) => tr(e.table).find((t) => t.id === e.id) === e.row, Ou = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Qe(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Tu(e, t) {
  const n = [{ kind: "text", text: Qe(e).replace(/\r\n/g, `
`) }];
  for (const s of Ps)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Kt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Iu(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Iu(e) {
  return e.split(Au).map((t, n) => n % 2 ? t : t.replace(Eu, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Wa(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Ru(e) {
  const [t, , ...n] = e, s = Wa(t).map((o) => `<th>${Kt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Wa(o).map((r) => `<td>${Kt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Bu(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Kt(a)}</li>`).join("")}</${s}>`;
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
      n.push(`<h${i}>${Kt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ha(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Ru(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(Bu(t.slice(s, i))), s = i;
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
    n.push(`<p>${Kt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Lu = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Du = (e) => e.kind !== "text" && !Lu.test(e.html);
function Nu(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(ur(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Du(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function js(e, t = { env: "" }) {
  const n = Ou(e, t), s = st.get(n);
  if (st.delete(n), s && s.reads.every(Cu))
    return st.set(n, s), s.html;
  const a = [], o = Nu(Tu(e, { ...t, reads: a }));
  return st.set(n, { html: o, reads: a }), st.size > Su && st.delete(st.keys().next().value), o;
}
const dr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Yt = (e) => String(e || "").replace(dr, (t, n, s, a) => a), Pu = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), kn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, ju = /^Traceback \(most recent call last\):/m, qu = 8;
function hr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, qu).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Fu(e) {
  const t = [...e.matchAll(Pu)].map((s) => s.index);
  if (kn.lastIndex = 0, !t.length || !kn.test(e)) return null;
  kn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(kn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: hr(n), tail: "" } : null;
}
function Wu(e) {
  const t = ju.exec(e);
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
  const t = Yt(e), n = Wu(t) || Fu(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Hu = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Uu = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, zu = /[\w\]]\(/, Vu = /^[\w$.[\]'"]+\s*=\s*[^=]/, Gu = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Ku = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Yu = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Ju = /[[({,]$/, Zu = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Xu = /^(\t|\s{2,})\S/, Qu = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*\/?|<!--)/, ed = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, td = /[{}()[\];=<>$&|*\\@+^~%]/g, fr = /^\s*(?:[-*+]|\d+[.)])\s/, nd = /^\s*>/, sd = /^\s*\|/, ad = 0.6, od = 0.4, rd = 5, id = 0.03, pr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= rd && t.every((n) => ed.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(td) ?? []).length / e.length < id;
}, rs = (e) => {
  const t = e.trim();
  return [Hu, Uu, zu, Vu, Gu, Ku, Yu, Ju, Zu].some((n) => n.test(t)) || /[;{}]$/.test(t) || Xu.test(e) && !fr.test(e) && !pr(e);
};
function ld(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || fr.test(t[0]) || t.every((o) => nd.test(o) || sd.test(o))) return "text";
  const n = t.filter((o) => !Qu.test(o.trim()));
  if (t.length === 1) return !n.length || rs(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(rs).length, a = n.filter((o) => !rs(o) && pr(o)).length;
  return s >= n.length * ad && a <= n.length * od ? "code" : "text";
}
const qs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", cd = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", ud = `${qs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, dd = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", hd = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ua = {
  js: { keywords: qs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: cd, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: ud, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: qs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: dd, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: hd, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function za(e, t, n) {
  return n && e.startsWith(n, t);
}
function fd(e, t) {
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
function pd(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of fd(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Qe(r) : `<span class="tok-${s}">${Qe(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function md(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const gd = 1500, Va = /* @__PURE__ */ new WeakMap();
async function vd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await md(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Va.get(t)), Va.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, gd)
  )));
}
typeof document < "u" && document.addEventListener("click", vd, !0);
const yd = /\n\s*\n/, wd = /^(```|~~~)\s*(\w+)?\s*$/, kd = /^\s{4,}\S/, bd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Fs = /^\s*(?:[-*+]|\d+[.)])\s/, mr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, xd = [
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
function $d(e) {
  const t = fa(e.join(`
`));
  return (xd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Md = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && mr.test(t) && !Fs.test(t);
}, _d = (e, t) => Fs.test(t) || Fs.test([...e].reverse().find((n) => n.trim()) || "");
function Ws(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${pd(fa(e.join(`
`)), t || $d(e)).join(`
`)}</code></pre></div>` };
}
function Sd(e) {
  const t = e.split(yd).map((r) => ({ paragraph: r, kind: ld(fa(r).split(`
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
      a(), n.push(Ws(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(Yt), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function Ed(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...Sd(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(wd);
    if (r) {
      const l = t.findIndex((d, f) => f > o && d.trim().startsWith(r[1])), u = l < 0 ? t.length : l;
      a(), n.push(Ws(t.slice(o + 1, u).map(Yt), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Md(s) ? bd : kd;
    if (i.test(t[o]) && !_d(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && mr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (l - o + u.length >= 2) {
        a(), n.push(Ws([...u, ...t.slice(o, l)].map(Yt), "")), o = l;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
$t((e) => Ed(e));
const Ad = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Cd = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Od(e) {
  const t = Ad.exec(e);
  if (t && kt(t[1])) return { at: t.index, length: t[0].length, table: kt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Cd.exec(e), s = n && kt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Td(e, t, n, s) {
  const a = cr(s, e, t), o = Yt(a ? Kc(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Qe(cn(e).title)} ${t}</span><span class="row-card-title">${Qe(o)}</span></a>`;
}
$t(
  (e, t) => {
    const n = Od(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Td(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Id = /\.(png|jpe?g|gif|webp|svg)$/i, Rd = (e) => Id.test(e), Bd = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Ld = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Dd(e, t) {
  const n = Bd.exec(e), [, s, a, o, r, i] = n || [], l = n && kt(s || o), u = l && cr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = ze.in(t.env).fileUrl(l, u.id, i), f = `${cn(l).title} ${u.id} · ${Qe(i)}`, v = Rd(i) ? `<img class="file-card-image" src="${d}" alt="${Qe(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Qe(i)}">${v}<span class="file-card-name">${f}</span></a>` };
}
function Nd(e) {
  const t = Ld.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Qe(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
$t(
  (e, t) => {
    if (t.inline) return null;
    const n = Dd(e, t) || Nd(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Pd = /`([^`\n]+)`/g;
$t((e) => e.replace(Pd, (t, n) => `<code>${n}</code>`));
const Ga = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${zn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
$t(
  (e, t) => e.replace(dr, (n, s, a, o) => Ga[s] ? Ga[s](a, o, t) : o)
);
const jd = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, gr = new RegExp(`\\b(${Wo}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), vr = new RegExp(`\\b(${Wo}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), qd = new RegExp(`<code>((?:${gr.source}|${vr.source}))</code>`, "gi"), Fd = (e) => e.replace(qd, "$1"), Wd = (e, t) => `<a class="row-pill" href="#" data-peek="${kt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Hd = (e) => e.replace(vr, (t, n, s) => s.replace(/\d+/g, (a) => Wd(n.replace(/s$/i, ""), a))), Ud = (e) => Hd(e).replace(
  gr,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${kt(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
$t(
  (e, t) => t.rowNames === !1 ? e : Fd(e).split(jd).map((n, s) => s % 2 ? n : Ud(n)).join("")
);
const zd = ["innerHTML"], Vd = ["innerHTML"], Gd = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = js(s, { env: Je.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(Ct) && z(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, zd)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(Ct) && z(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, Vd));
  }
}, rt = /* @__PURE__ */ K(Gd, [["__scopeId", "data-v-1a43d211"]]), Kd = { class: "fact" }, Yd = { class: "fact-label" }, Jd = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Kd, [
      m("span", Yd, k(e.label), 1),
      j(rt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Zd = /* @__PURE__ */ K(Jd, [["__scopeId", "data-v-3a88ecf8"]]), Xd = { class: "list" }, Qd = { class: "list-label" }, eh = {
  key: 1,
  class: "list-note"
}, th = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Xd, [
      (c(!0), h(Y, null, se(e.items, (o, r) => (c(), G(xt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: H(() => [
          m("span", Qd, k(o.label), 1),
          o.badge ? (c(), G(Ho, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : E("", !0),
          o.note ? (c(), h("span", eh, k(o.note), 1)) : E("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, nh = /* @__PURE__ */ K(th, [["__scopeId", "data-v-ebe2ae0a"]]), sh = { class: "table" }, ah = {
  key: 0,
  class: "table-row empty"
}, oh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", sh, [
      m("div", {
        class: "table-row head",
        style: me(a.value)
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
        style: me(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: H(() => [
          (c(!0), h(Y, null, se(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, k(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", ah, k(e.empty), 1)) : E("", !0)
    ]));
  }
}, rh = /* @__PURE__ */ K(oh, [["__scopeId", "data-v-9326a52e"]]), ih = { class: "stat-value" }, lh = { class: "stat-label" }, ch = {
  key: 0,
  class: "stat-note"
}, uh = {
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
      default: H(() => [
        m("span", ih, k(e.value), 1),
        m("span", lh, k(e.label), 1),
        e.note ? (c(), h("span", ch, k(e.note), 1)) : E("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, dh = /* @__PURE__ */ K(uh, [["__scopeId", "data-v-ad0db6d6"]]), hh = { class: "code" }, fh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), G(Wn, {
      value: e.node.type
    }, {
      stack: H(() => [
        j(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: H(() => [
        j(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: H(() => [
        j(En, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: H(() => [
        j(rc, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: H(() => [
        m("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: H(() => [...r[2] || (r[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: H(() => [
        j(dh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: H(() => [
        j(ec, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: H(() => [
        j(rh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: H(() => [
        j(nh, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: H(() => [
        j(rt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: H(() => [
        j(Zd, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: H(() => [
        j(Ho, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: H(() => [
        m("pre", hh, [
          m("code", null, k(e.node.text), 1)
        ])
      ]),
      file: H(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, k(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), yr = /* @__PURE__ */ K(fh, [["__scopeId", "data-v-cbdcf540"]]), ph = { class: "dashboard" }, mh = { class: "trail" }, gh = ["onClick"], vh = {
  key: 0,
  class: "gone",
  role: "status"
}, yh = {
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
    ), (v, y) => (c(), h("div", ph, [
      e.document.broken ? (c(), G(In, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: H(() => [
          ce(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(In, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: H(() => [
          ce(k(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(Y, { key: 2 }, [
        m("nav", mh, [
          m("button", {
            type: "button",
            class: J(["step", { current: !r.value.length }]),
            onClick: y[0] || (y[0] = (T) => f(0))
          }, k(u(e.document.start)), 3),
          (c(!0), h(Y, null, se(r.value, (T, S) => (c(), h(Y, {
            key: `${S}-${T}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: J(["step", { current: S === r.value.length - 1 }]),
              onClick: (w) => f(S + 1)
            }, k(u(T)), 11, gh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", vh, "What you opened is no longer in this dashboard. Here is its start page.")) : E("", !0),
        j(Bt, {
          name: "page",
          mode: "out-in"
        }, {
          default: H(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              j(yr, {
                node: l.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (T) => s("file", T))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : E("", !0)
    ]));
  }
}, xk = /* @__PURE__ */ K(yh, [["__scopeId", "data-v-fbe83734"]]);
function wh(e, t, n, s = () => window) {
  Be(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ie(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const kh = (e, t = () => !0) => wh("keydown", (n) => n.key === "Escape" && t() && e());
function wr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = D(!1), a = R(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return kh(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const bh = 80, Et = sa([]);
function kr(e) {
  const t = Symbol("layer"), n = () => Et.includes(t) && Et.splice(Et.indexOf(t), 1);
  return xe(
    e,
    (s) => {
      s && !Et.includes(t) && Et.push(t), s || n();
    },
    { immediate: !0 }
  ), Ie(n), R(() => bh + Math.max(0, Et.indexOf(t)));
}
let br = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return br = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const xh = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function $h(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(xh)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Be(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : br, document.addEventListener("keydown", a), on(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Mh = ["aria-modal", "aria-label", "aria-labelledby"], _h = {
  key: 0,
  class: "dialog-head"
}, Sh = ["id", "tabindex"], Eh = {
  key: 1,
  class: "dialog-foot"
}, Ah = 500, Ch = 400, Oh = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = wr(s, n), i = kr(a), l = D(null), u = D(null), d = D(null), f = To(), v = D(!1), y = Date.now();
    n.modal && $h(u, () => s("escape"), d);
    function T() {
      if (!n.modal) return n.closable && o();
      v.value = !0, setTimeout(() => v.value = !1, Ch);
    }
    function S(M) {
      !n.modal || Date.now() - y >= Ah || ![" ", "Enter"].includes(M.key) || (M.preventDefault(), M.stopPropagation());
    }
    const w = () => l.value && (l.value.scrollTop = l.value.scrollHeight), x = new MutationObserver(w);
    return xe(l, (M) => {
      x.disconnect(), M && n.follow && (x.observe(M, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Ie(() => x.disconnect()), (M, V) => (c(), G(aa, { to: "body" }, [
      j(Bt, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: H(() => [
          z(a) ? (c(), h("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: me({ zIndex: z(i) }),
            onClick: be(T, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: u,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: v.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(f) : void 0,
              onKeydownCapture: S
            }, [
              e.bare ? E("", !0) : (c(), h("header", _h, [
                m("h3", {
                  id: z(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, Sh),
                e.closable ? (c(), G(Gn, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : E("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: l,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                he(M.$slots, "default", {}, void 0, !0)
              ], 2),
              M.$slots.foot ? (c(), h("footer", Eh, [
                he(M.$slots, "foot", {}, void 0, !0)
              ])) : E("", !0)
            ], 42, Mh)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Th = /* @__PURE__ */ K(Oh, [["__scopeId", "data-v-6d1ecd98"]]), nt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Fe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Ih = 6;
function pa(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Rh = (e) => {
  const t = pa(e, nt.lineChars), n = Math.max(nt.minWidth, Math.max(...t.map((s) => s.length)) * nt.charWidth + nt.padX * 2);
  return { name: e, lines: t, line: nt.line, padY: nt.padY, width: n, height: t.length * nt.line + nt.padY * 2 };
};
function Bh(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function Lh(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Dh(e, t, n) {
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
  for (let r = 0; r < Ih; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((v) => v[i ? 1 : 0] === f).map((v) => v[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function Nh(e, t) {
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
function Ph(e) {
  const t = [...new Set(e.flatMap(([_, g]) => [_, g]))], n = new Set(e.map(([, _]) => _)), s = t.filter((_) => !n.has(_)), a = Bh(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((_, g) => !a.has(g)), r = Lh(t, o), i = Dh(t, o, r), l = new Map(t.map((_) => [_, Rh(_)])), u = i.map((_) => _.reduce((g, N) => g + l.get(N).width, 0) + je.across * (_.length - 1)), d = Math.max(...u) + je.margin * 2, f = qh(e, r, i.length), v = /* @__PURE__ */ new Map();
  let y = je.margin;
  i.forEach((_, g) => {
    let N = (d - u[g]) / 2;
    const C = Math.max(..._.map((I) => l.get(I).height));
    _.forEach((I) => {
      const $ = l.get(I);
      v.set(I, { ...$, x: N, y: y + (C - $.height) / 2 }), N += $.width + je.across;
    }), y += C + (f[g] ?? je.down);
  });
  const T = e.map(([_, g, N], C) => ({ from: _, to: g, label: N || "", back: a.has(C) || r.get(g) <= r.get(_) }));
  Nh(T, v);
  const S = T.map((_) => Fh(_, v.get(_.from), v.get(_.to))), w = [...v.values()], x = zh(S, w), M = Math.max(y - je.down, ...x.filter((_) => _.label).map((_) => _.label.y + _.label.height));
  return { width: Math.max(d - je.margin, ...x.filter((_) => _.label).map((_) => _.label.x + _.label.width)) + je.margin, height: M + je.margin, nodes: w, arrows: x };
}
const jh = (e) => e ? pa(e, Fe.lineChars).length * Fe.line + Fe.pad * 2 : 0;
function qh(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += jh(r) + je.labelSpace);
  }), s.map((a) => Math.max(je.down, a));
}
function Fh(e, t, n) {
  const s = e.label ? pa(e.label, Fe.lineChars) : [], a = s.length ? Math.max(...s.map((v) => v.length)) * Fe.charWidth + Fe.pad * 2 : 0, o = s.length * Fe.line + (s.length ? Fe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const Wh = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, Hh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Uh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Fe.line);
function zh(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = Wh(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = Uh.flatMap((l) => Hh.map((u) => a(u, l))).find((l) => !n.some((u) => Ka(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => Ka(i, l)); ) i.y += Fe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Fe.line, pad: Fe.pad } };
  });
}
const Ka = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Vh = { class: "flowchart-tools" }, Gh = ["width", "height", "viewBox", "aria-label"], Kh = ["d"], Yh = ["x", "y", "width", "height"], Jh = ["x", "y"], Zh = ["x", "dy"], Xh = {
  key: 0,
  class: "flowchart-label"
}, Qh = ["x", "y", "width", "height"], ef = ["x", "y"], tf = ["x", "dy"], nf = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Ph(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = D(null), i = D({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var x;
      const S = (x = r.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(S != null && S.width)) return;
      const w = Math.min(S.width / a.value.width, S.height / a.value.height, 1.5);
      i.value = { zoom: w, x: (S.width - a.value.width * w) / 2, y: (S.height - a.value.height * w) / 2 };
    }
    function d(S, w, x) {
      const { zoom: M, x: V, y: _ } = i.value, g = Math.min(o.most, Math.max(o.least, M * S));
      i.value = { zoom: g, x: w - (w - V) * g / M, y: x - (x - _) * g / M };
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
      var w, x, M;
      S.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), l = { x: S.clientX - i.value.x, y: S.clientY - i.value.y }, (M = (x = r.value).setPointerCapture) == null || M.call(x, S.pointerId);
    }
    function T(S) {
      l && (i.value = { ...i.value, x: S.clientX - l.x, y: S.clientY - l.y });
    }
    return Be(u), (S, w) => (c(), G(Th, {
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (x) => s("close"))
    }, {
      default: H(() => [
        m("div", Vh, [
          j(ke, {
            small: "",
            onClick: w[0] || (w[0] = (x) => f(o.step))
          }, {
            default: H(() => [...w[5] || (w[5] = [
              ce("Zoom in", -1)
            ])]),
            _: 1
          }),
          j(ke, {
            small: "",
            onClick: w[1] || (w[1] = (x) => f(1 / o.step))
          }, {
            default: H(() => [...w[6] || (w[6] = [
              ce("Zoom out", -1)
            ])]),
            _: 1
          }),
          j(ke, {
            small: "",
            onClick: u
          }, {
            default: H(() => [...w[7] || (w[7] = [
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
          onPointermove: T,
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
            style: me({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            }, null, 8, Kh))), 128)),
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
              }, null, 8, Yh),
              m("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (c(!0), h(Y, null, se(x.lines, (M, V) => (c(), h("tspan", {
                  key: V,
                  x: x.x + x.width / 2,
                  dy: V ? x.line : 0
                }, k(M), 9, Zh))), 128))
              ], 8, Jh)
            ]))), 128)),
            (c(!0), h(Y, null, se(a.value.arrows, (x, M) => (c(), h(Y, {
              key: `label-${M}`
            }, [
              x.label ? (c(), h("g", Xh, [
                m("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, Qh),
                m("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (c(!0), h(Y, null, se(x.label.lines, (V, _) => (c(), h("tspan", {
                    key: _,
                    x: x.label.x + x.label.width / 2,
                    dy: _ ? x.label.line : 0
                  }, k(V), 9, tf))), 128))
                ], 8, ef)
              ])) : E("", !0)
            ], 64))), 128))
          ], 12, Gh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, sf = /* @__PURE__ */ K(nf, [["__scopeId", "data-v-51d24cfe"]]), Ya = {
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
}, af = ["innerHTML"], of = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => Ya[t.name] || Ya.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, af));
  }
}, et = /* @__PURE__ */ K(of, [["__scopeId", "data-v-beb5935c"]]), rf = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      j(et, { name: "fold" })
    ], 2));
  }
}, Jt = /* @__PURE__ */ K(rf, [["__scopeId", "data-v-d03899bb"]]), lf = ["data-tip", "aria-label"], cf = {
  key: 0,
  class: "mact-word"
}, uf = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      j(et, { name: "open" }),
      e.open ? (c(), h("span", cf, k(e.label), 1)) : E("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, lf));
  }
}, xr = /* @__PURE__ */ K(uf, [["__scopeId", "data-v-3b292e09"]]), df = 120, is = 280, hf = 160, ff = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, pf = ["leaving", "resizing", "entering"];
function mf(e) {
  const t = pf.filter((s) => e.classList.contains(s));
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
    if (!d || !d.offsetWidth || ff()) {
      s.value = u;
      return;
    }
    const v = { width: d.offsetWidth, height: d.offsetHeight };
    if (r(d, v), a.value = "leaving", await n(df), f !== o) return;
    s.value = u, a.value = "resizing", await on(), i(d);
    const y = mf(d);
    r(d, v), d.offsetWidth, d.style.transition = `width ${is}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${is}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(d, y), await n(is), f === o && (i(d), a.value = "entering", await n(hf), f === o && (a.value = ""));
  }
  return xe(t, (u) => l(u)), Lt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const gf = { class: "growing-card-top" }, vf = ["aria-expanded"], yf = { class: "growing-card-avatar" }, wf = { class: "growing-card-title" }, kf = { class: "growing-card-more" }, bf = { class: "growing-card-body" }, xf = {
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
      class: J(["growing-card-wrap", z(i), { open: !z(r), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", gf, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (v) => a.value = !a.value)
        }, [
          m("span", yf, [
            e.bad ? (c(), G(et, {
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
          m("span", wf, k(e.title), 1),
          j(Jt, { open: a.value }, null, 8, ["open"])
        ], 8, vf),
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
          j(ye, {
            name: "bubble",
            size: 13
          })
        ])) : E("", !0)
      ]),
      m("div", kf, [
        m("div", bf, [
          (c(!0), h(Y, null, se(u.value, (v, y) => (c(), h("p", {
            key: y,
            class: "growing-card-text"
          }, k(v), 1))), 128))
        ])
      ])
    ], 2));
  }
}, $f = /* @__PURE__ */ K(xf, [["__scopeId", "data-v-08411e3a"]]), Mf = ["title", "aria-label"], _f = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Sf = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Ef = {
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
      (c(), h("svg", _f, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", Sf)) : E("", !0)
      ]))
    ], 10, Mf));
  }
}, Af = /* @__PURE__ */ K(Ef, [["__scopeId", "data-v-6dc92808"]]);
function Cf(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Hs(e) {
  const t = Cf(e);
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
const ls = (e) => String(e).padStart(2, "0");
function Of(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ls(t % 60)}s` : `${Math.floor(t / 3600)}h ${ls(Math.floor(t % 3600 / 60))}m ${ls(t % 60)}s`;
}
const Tf = "img,pre,table";
function If(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Rf(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Bf(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Tf)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = If(Rf(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Lf(e, t) {
  let n = null;
  const s = () => e.value && Bf(e.value);
  Be(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), xe(t, s, { flush: "post" });
}
const Df = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Nf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Pf = ["data-incoming", "data-ref"], jf = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], qf = { class: "message-body" }, Ff = ["title"], Wf = ["innerHTML"], Hf = ["title"], Uf = ["innerHTML"], zf = {
  class: "message-faces",
  "data-message-faces": ""
}, Vf = ["title", "data-face", "onClick"], Gf = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Kf = ["title", "data-reaction", "onClick"], Yf = {
  key: 0,
  class: "message-reaction-count"
}, Jf = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Zf = ["href", "title"], Xf = ["src", "alt"], Qf = ["href"], e1 = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, t1 = {
  key: 1,
  "data-message-links-rows": ""
}, n1 = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, s1 = ["data-sent-worker", "title", "onClick"], a1 = { class: "message-foot" }, o1 = { class: "message-time" }, r1 = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, i1 = 140, l1 = 2, c1 = 1500, u1 = "An earlier message", d1 = "about", h1 = "sent_to", f1 = 3, p1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var de;
    const n = e, s = t, a = D(!1), o = D(null), r = R(() => ["user", "comment"].includes(n.message.type)), i = R(() => {
      const [Q, ee] = (n.message.commented_row || ":").split(":"), Z = kt(Q);
      return Z ? { ref: `${Z}:${ee}`, label: `${cn(Z).title.toLowerCase()} ${ee}` } : null;
    }), l = R(() => n.message.worker_id ?? null), u = D(!1), d = R(() => l.value !== null && ((n.message.text ?? "").length > i1 || (n.message.text ?? "").split(`
`).filter((Q) => Q.trim()).length > l1)), f = R(() => r.value && !n.message.read_at && !n.message.local);
    async function v() {
      var Q;
      await ((Q = navigator.clipboard) == null ? void 0 : Q.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, c1);
    }
    const y = R(() => js(n.message.text ?? "", { env: "" })), T = R(() => JSON.parse(n.message.flowchart_edges || "[]")), S = D(!1), w = R(() => js(n.quote || u1, { env: "" }));
    function x() {
      const Q = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Q ? Q.scrollIntoView({ block: "center", behavior: "smooth" }) : Ze(`messages:${n.message.parent_id}`);
    }
    Lf(o, () => `${n.message.text} ${n.quote}`);
    const M = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, V = (Q) => `/api/files/message/${n.message.id}/${encodeURIComponent(Q)}`, _ = R(() => JSON.parse(n.message.captions || "{}")), g = R(() => (n.message.files ?? []).map((Q) => ({ name: Q, address: V(Q), isImage: M.test(Q), title: _.value[Q] || Q }))), N = R(() => Mr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), C = Te(Le, null), I = D([]), $ = D([]), A = D(!1), b = R(() => `Linked: ${I.value.join(", ")}`), p = R(() => I.value.length >= f1), B = R(() => `${I.value.length} linked ${I.value.every((Q) => Q.startsWith("task ")) ? "tasks" : "rows"}`);
    async function L() {
      if (!r.value || !(C != null && C.read) || n.message.local) return;
      const Q = await C.read(`link list --source message:${n.message.id}`);
      if (!Q.ok) return;
      const ee = Q.value.rows ?? Q.value ?? [];
      I.value = ee.filter((Z) => Z.link_type === d1).map((Z) => `${Z.target_model} ${Z.target_id}`), $.value = ee.filter((Z) => Z.link_type === h1).map((Z) => Z.target_id);
    }
    L(), (de = C == null ? void 0 : C.follow) == null || de.call(C, ["link.*"], L);
    const F = D(!1), re = R(() => Nf(n.message.reactions));
    function le(Q) {
      F.value = !1, s("react", n.message, Q);
    }
    return (Q, ee) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      j($f, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (Z) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Pf)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", qf, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: i.value }]),
          onClick: ee[6] || (ee[6] = (...Z) => z(Ct) && z(Ct)(...Z))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ee[1] || (ee[1] = be((Z) => z(Ze)(i.value.ref), ["stop"]))
          }, [
            j(ye, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + k(i.value.label), 1)
          ], 8, Ff)) : E("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(x, ["stop"]),
            innerHTML: w.value
          }, null, 8, Wf)) : E("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: ee[2] || (ee[2] = be((Z) => z(Ze)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + k(l.value), 9, Hf)) : E("", !0),
          m("div", {
            class: J({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, Uf),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ee[3] || (ee[3] = be((Z) => u.value = !u.value, ["stop"]))
          }, k(u.value ? "Show less" : "Show more"), 1)) : E("", !0),
          T.value.length ? (c(), h(Y, { key: 4 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[4] || (ee[4] = (Z) => S.value = !0)
            }, "Open the flowchart"),
            S.value ? (c(), G(sf, {
              key: 0,
              title: e.message.text,
              edges: T.value,
              onClose: ee[5] || (ee[5] = (Z) => S.value = !1)
            }, null, 8, ["title", "edges"])) : E("", !0)
          ], 64)) : E("", !0)
        ], 2),
        m("div", {
          class: J(["message-tools", { picking: F.value }]),
          "data-message-tools": ""
        }, [
          F.value ? (c(), h(Y, { key: 0 }, [
            m("div", zf, [
              (c(!0), h(Y, null, se(z(Df), (Z) => (c(), h("button", {
                key: Z,
                type: "button",
                class: "message-face",
                title: `React ${Z}`,
                "data-face": Z,
                onClick: (De) => le(Z)
              }, k(Z), 9, Vf))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[7] || (ee[7] = (Z) => F.value = !1)
            }, [
              j(ye, {
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
              onClick: ee[8] || (ee[8] = (Z) => F.value = !0)
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
      re.value.length ? (c(), h("div", Gf, [
        (c(!0), h(Y, null, se(re.value, (Z) => (c(), h("button", {
          key: Z.emoji,
          type: "button",
          class: J(["message-reaction", { mine: Z.mine }]),
          title: Z.title,
          "data-reaction": Z.emoji,
          onClick: (De) => s("react", e.message, Z.emoji)
        }, [
          ce(k(Z.emoji) + " ", 1),
          Z.count > 1 ? (c(), h("span", Yf, k(Z.count), 1)) : E("", !0)
        ], 10, Kf))), 128))
      ])) : E("", !0),
      g.value.length ? (c(), h("div", Jf, [
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
            }, null, 8, Xf)
          ], 8, Zf)) : (c(), h("a", {
            key: 1,
            href: Z.address,
            target: "_blank",
            class: "message-file"
          }, k(Z.name), 9, Qf))
        ], 64))), 128))
      ])) : E("", !0),
      I.value.length ? (c(), h("div", e1, [
        j(et, {
          class: "message-links-icon",
          name: "linked"
        }),
        p.value && !A.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: ee[11] || (ee[11] = (Z) => A.value = !0)
        }, k(B.value), 1)) : (c(), h("span", t1, [
          j(rt, {
            text: b.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : E("", !0),
      $.value.length ? (c(), h("div", n1, [
        j(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(Y, null, se($.value, (Z) => (c(), h("button", {
          key: Z,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Z,
          title: `Open worker ${Z}`,
          onClick: be((De) => z(Ze)(`agents:${Z}`), ["stop"])
        }, "Also sent to worker " + k(Z), 9, s1))), 128))
      ])) : E("", !0),
      m("div", a1, [
        m("time", o1, k(N.value), 1),
        Number.isInteger(e.message.id) ? (c(), h("span", r1, "message " + k(e.message.id), 1)) : E("", !0),
        r.value ? (c(), G(Af, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : E("", !0)
      ])
    ], 8, jf));
  }
}, $k = /* @__PURE__ */ K(p1, [["__scopeId", "data-v-817edd99"]]), m1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = Ti("SkeletonParts", !0);
      return c(!0), h(Y, null, se(e.parts, (l, u) => (c(), h(Y, { key: u }, [
        (c(!0), h(Y, null, se(l.count, (d) => (c(), G(Wn, {
          key: d,
          value: l.shape
        }, {
          line: H(() => [
            m("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: me({ width: l.width, height: `${t[l.size]}px` })
            }, null, 4)
          ]),
          circle: H(() => [
            m("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: me({ width: `${n[l.size]}px`, height: `${n[l.size]}px` })
            }, null, 4)
          ]),
          block: H(() => [
            m("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: me({ width: l.width, height: `${l.height}px` })
            }, null, 4)
          ]),
          grow: H(() => [...r[0] || (r[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: H(() => [
            m("div", {
              class: "skeleton-row",
              style: me(s(l))
            }, [
              j(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: H(() => [
            m("div", {
              class: "skeleton-stack",
              style: me(s(l))
            }, [
              j(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: H(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: me(s(l))
            }, [
              j(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: H(() => [
            m("div", {
              class: "skeleton-grid",
              style: me(a(l))
            }, [
              j(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), g1 = /* @__PURE__ */ K(m1, [["__scopeId", "data-v-576c95e1"]]), v1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, y1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", v1, [
      j(g1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, _r = /* @__PURE__ */ K(y1, [["__scopeId", "data-v-52f66b64"]]), Ln = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], cs = 200, Sr = (e) => {
  var t;
  return ((t = Ln.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Ln[0].key;
}, Mk = (e) => {
  var t;
  return ((t = Ln.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, w1 = ["aria-label"], k1 = 300, Za = 400, b1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: cs } },
  setup(e) {
    const t = e, n = R(() => Sr(t.value)), s = R(() => n.value < cs ? [1, 0.25, 0.25] : n.value === cs ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: J(["ico", "prio", { hot: n.value >= Za, high: n.value >= k1 && n.value < Za }]),
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
        style: me({ opacity: s.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: me({ opacity: s.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: me({ opacity: s.value[2] })
      }, null, 4)
    ], 10, w1));
  }
}, _k = /* @__PURE__ */ K(b1, [["__scopeId", "data-v-b10e610f"]]), x1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Xa = (e) => x1[e.card.state] || "idle", $1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), Qa = { working: 0, waiting: 1, idle: 2, stopped: 3 }, eo = (e, t) => Qa[Xa(e)] - Qa[Xa(t)], to = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, Sk = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => eo(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || $1(s, a)) : [...e].sort((s, a) => eo(s, a) || (to[t] || to.state)(s, a)), M1 = ["aria-checked", "aria-haspopup", "onClick"], _1 = {
  key: 0,
  class: "segmented-dot"
}, S1 = {
  key: 1,
  class: "segmented-count"
}, E1 = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = To();
    return (a, o) => {
      const r = Ii("tip");
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
          i.dot ? (c(), h("span", _1)) : E("", !0),
          ce(" " + k(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", S1, k(i.count), 1)) : E("", !0)
        ], 10, M1)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, A1 = /* @__PURE__ */ K(E1, [["__scopeId", "data-v-ca953072"]]), C1 = { class: "form-field" }, O1 = { class: "form-field-head" }, T1 = ["for"], I1 = {
  key: 0,
  class: "form-field-aside"
}, R1 = {
  key: 0,
  class: "form-field-help"
}, B1 = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", C1, [
      m("div", O1, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, k(e.label), 9, T1),
        t.$slots.aside ? (c(), h("span", I1, [
          he(t.$slots, "aside", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      he(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", R1, k(e.help), 1)) : E("", !0)
    ]));
  }
}, Ek = /* @__PURE__ */ K(B1, [["__scopeId", "data-v-dd7cdcff"]]), L1 = { class: "list-row" }, D1 = {
  key: 0,
  class: "list-row-kind"
}, N1 = { class: "list-row-main" }, P1 = {
  key: 0,
  class: "list-row-title"
}, j1 = { class: "list-row-body" }, q1 = {
  key: 1,
  class: "list-row-end"
}, F1 = {
  key: 1,
  class: "list-row-text"
}, W1 = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", L1, [
      e.kind ? (c(), h("span", D1, k(e.kind), 1)) : E("", !0),
      m("div", N1, [
        e.title ? (c(), h("span", P1, k(e.title), 1)) : E("", !0),
        m("div", j1, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", q1, [
          he(t.$slots, "end", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      e.text ? (c(), h("span", F1, k(e.text), 1)) : E("", !0)
    ]));
  }
}, Ak = /* @__PURE__ */ K(W1, [["__scopeId", "data-v-63155fba"]]), H1 = {
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
}, U1 = { claude: "Claude Code", codex: "Codex" }, z1 = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, V1 = {
  key: 1,
  class: "menu-item-text"
}, G1 = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", z1, k(e.checked ? "✓" : ""), 1)) : E("", !0),
      e.description ? (c(), h("span", V1, [
        m("span", null, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, k(e.description), 1)
      ])) : he(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, It = /* @__PURE__ */ K(G1, [["__scopeId", "data-v-fec99974"]]), K1 = (e, t, n) => Math.max(t, Math.min(n, e)), Y1 = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Er = /* @__PURE__ */ new WeakMap(), J1 = (e, t) => Er.set(e, t);
function Z1(e, t) {
  for (let n = t; n; n = Er.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function X1(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Z1(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const At = 8, Q1 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    function T(p) {
      const B = f(s.anchor), L = y(B, p);
      return i.value.w <= L.across && i.value.h <= Math.max(L.below, L.above) ? B : u();
    }
    const S = R(() => {
      if (!l.value) return r.value;
      const p = l.value, B = T(p), L = y(B, p), { w: F, h: re } = i.value, le = s.align === "auto" ? p.left + p.right > B.left + B.right : s.align === "right", de = K1(le ? p.right - F : p.left, B.left + At, Math.max(B.left + At, B.right - F - At)), ee = re > L.below && L.above > L.below ? { bottom: `${window.innerHeight - p.top + s.gap}px`, maxHeight: v(s.maxHeight, L.above) } : { top: `${p.bottom + s.gap}px`, maxHeight: v(s.maxHeight, L.below) };
      return { ...r.value, ...ee, left: `${de}px`, maxWidth: v(s.maxWidth, L.across) };
    }), w = n, x = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function M(p) {
      const B = x(), L = B.indexOf(document.activeElement);
      B[(L + p + B.length) % B.length].focus();
    }
    const V = { ArrowDown: () => M(1), ArrowUp: () => M(-1), Escape: () => w("close") }, _ = (p) => V[p.key] && (p.preventDefault(), V[p.key]()), g = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let N = 0;
    const C = new ResizeObserver(() => {
      cancelAnimationFrame(N), N = requestAnimationFrame(g);
    });
    X1(a, (p) => s.anchor && !s.anchor.contains(p.target) && w("close"));
    const I = (p, B) => ["top", "left", "right", "bottom"].some((L) => Math.abs(p[L] - B[L]) > 1), $ = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let A = 0;
    function b() {
      if (s.anchor) {
        const p = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || $(p)) return w("close");
        I(p, l.value) && (l.value = p);
      }
      A = requestAnimationFrame(b);
    }
    return Be(() => {
      s.anchor && a.value && J1(a.value, s.anchor), g(), a.value && C.observe(a.value), !s.plain && x()[0] && x()[0].focus(), b();
    }), Ie(() => {
      C.disconnect(), cancelAnimationFrame(A), cancelAnimationFrame(N);
    }), t({ element: a }), (p, B) => (c(), G(aa, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", ut({
        ref_key: "panel",
        ref: a
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: S.value,
        onKeydown: _
      }), [
        he(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ma = /* @__PURE__ */ K(Q1, [["__scopeId", "data-v-3d203970"]]), ep = ["aria-expanded"], tp = { class: "drop-label" }, np = ["value"], sp = {
  key: 1,
  class: "drop-lead"
}, ap = { class: "drop-item-text" }, op = {
  key: 2,
  class: "drop-note"
}, rp = {
  key: 1,
  class: "drop-none"
}, ip = {
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
        e.icon ? (c(), G(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : E("", !0),
        m("span", tp, k(e.label), 1),
        j(ye, {
          name: "down",
          size: 11
        })
      ], 10, ep),
      a.value ? (c(), G(ma, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => a.value = !1)
      }, {
        default: H(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => r.value = f.target.value)
          }, null, 40, np)) : E("", !0),
          (c(!0), h(Y, null, se(i.value, (f) => (c(), G(It, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (v) => l(f)
          }, {
            default: H(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: J(["drop-dot", { live: f.running }])
              }, null, 2)) : E("", !0),
              f.lead ? (c(), h("span", sp, k(f.lead), 1)) : E("", !0),
              m("span", ap, k(f.label), 1),
              f.note ? (c(), h("span", op, k(f.note), 1)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? E("", !0) : (c(), h("p", rp, k(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : E("", !0)
    ], 2));
  }
}, lp = /* @__PURE__ */ K(ip, [["__scopeId", "data-v-29dfcce5"]]), Ck = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => [
      ...H1[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = R(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (r, i) => (c(), G(lp, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${z(U1)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, cp = ["aria-label"], up = { class: "head" }, dp = { class: "names" }, hp = { class: "body" }, fp = {
  key: 0,
  class: "foot"
}, pp = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = wr(s, n), i = kr(a);
    return (l, u) => (c(), G(aa, { to: "body" }, [
      j(Bt, {
        name: "side",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: H(() => [
          z(a) ? (c(), h("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: me({ "--depth": e.depth, zIndex: z(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = be((...d) => z(o) && z(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(Y, { key: 0 }, [
                m("header", up, [
                  m("div", dp, [
                    m("h2", null, k(e.title), 1),
                    e.abstract ? (c(), G(rt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : E("", !0)
                  ]),
                  he(l.$slots, "actions", {}, void 0, !0),
                  j(Gn, {
                    title: e.closeLabel,
                    onClick: z(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                m("div", hp, [
                  he(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", fp, [
                  he(l.$slots, "foot", {}, void 0, !0)
                ])) : E("", !0)
              ], 64)) : he(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, cp)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ok = /* @__PURE__ */ K(pp, [["__scopeId", "data-v-c9a3f43a"]]), Us = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, mp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = oa(), n = R(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => dt((c(), h("textarea", ut({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [z(Us), z(t).value]
    ]);
  }
}), Tk = /* @__PURE__ */ K(mp, [["__scopeId", "data-v-e130a5b9"]]), gp = {
  key: 1,
  class: "text-field-label"
}, vp = {
  key: 2,
  class: "text-field-end"
}, yp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Os({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Cs(e, "modelValue"), s = oa(), a = "onUpdate:modelValue" in (((d = Ri()) == null ? void 0 : d.vnode.props) || {}), o = R(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = R(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = R(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = D(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, v) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: f.$slots.end }, z(s).class]),
      style: me(z(s).style)
    }, [
      e.icon ? (c(), G(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : E("", !0),
      e.label ? (c(), h("span", gp, k(e.label), 1)) : E("", !0),
      dt(m("input", ut({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(Us), o.value]
      ]),
      f.$slots.end ? (c(), h("span", vp, [
        he(f.$slots, "end", {}, void 0, !0)
      ])) : E("", !0)
    ], 6)) : dt((c(), h("input", ut({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [z(Us), o.value]
    ]);
  }
}), Ik = /* @__PURE__ */ K(yp, [["__scopeId", "data-v-d9c38ca8"]]), no = (e) => e.page * e.size < e.total;
function wp(e, t, { incremental: n = !1 } = {}) {
  const s = Hn(), a = D([]), o = D(""), r = D(!1), i = D(!1), l = D(""), u = D(null);
  async function d(w) {
    const x = await s.read(`${e} --before-id ${w + 1} --limit 1`);
    if (!x.ok) return T();
    const M = x.value.rows.find((V) => V.id === w);
    a.value = M ? a.value.map((V) => V.id === w ? M : V) : a.value.filter((V) => V.id !== w);
  }
  async function f(w) {
    if (n && String((w == null ? void 0 : w.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== w.row_id));
    if (n && (w != null && w.row_id) && !String(w.event ?? "").endsWith(".create") && a.value.some((g) => g.id === w.row_id)) return d(w.row_id);
    if (!(n && a.value.length && String((w == null ? void 0 : w.event) ?? "").endsWith(".create"))) return T();
    const M = Math.max(...a.value.map((g) => g.id)), V = await s.read(`${e} --after-id ${M}`);
    if (!V.ok) return T();
    const _ = new Set(a.value.map((g) => g.id));
    a.value = [...V.value.rows.filter((g) => !_.has(g.id)), ...a.value];
  }
  async function v() {
    if (!a.value.length) return !1;
    const w = Math.min(...a.value.map((V) => V.id)), x = await s.read(`${e} --before-id ${w}`);
    if (!x.ok || !x.value.rows.length) return i.value = !1;
    i.value = no(x.value);
    const M = new Set(a.value.map((V) => V.id));
    return a.value = [...a.value, ...x.value.rows.filter((V) => !M.has(V.id))], !0;
  }
  let y = 0;
  async function T() {
    const w = ++y, x = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (w !== y) return;
    const M = x.ok ? s.shared ? [x.value] : x.value.rows : [], V = M.length ? Math.min(...M.map((_) => _.id)) : 0;
    a.value = n && x.ok && V ? [...a.value.filter((_) => _.id > Math.max(...M.map((g) => g.id))), ...M, ...a.value.filter((_) => _.id < V)] : M, x.ok && !a.value.some((_) => _.id < V) && (i.value = !s.shared && no(x.value)), o.value = x.ok ? "" : x.error, r.value = !0;
  }
  async function S(w, x = null) {
    const M = a.value;
    x && (a.value = x(M));
    const V = await s.run(w);
    return x && !V.ok && (a.value = M), l.value = V.ok ? "" : V.error, u.value = V.ok ? V.value : null, await T(), V;
  }
  return s.follow(t, f), T(), { rows: a, failure: o, loaded: r, more: i, load: T, older: v, act: S, actionFailure: l, answer: u, context: s };
}
const kp = { class: "title" }, bp = { class: "state" }, xp = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = wp(t.line, t.events);
    return (o, r) => (c(), G(Rl, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: H(({ row: i }) => [
        m("span", kp, k(i.title), 1),
        m("span", bp, k(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Rk = /* @__PURE__ */ K(xp, [["__scopeId", "data-v-a69084cd"]]);
function $p(e = 1e3, t = null) {
  const n = D(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? xe(t, a, { immediate: !0 }) : a(!0), Ie(() => clearInterval(s)), n;
}
const us = D(Date.now() / 1e3);
let so = 0, bn = 0;
function Mp() {
  return bn || (us.value = Date.now() / 1e3, so = setInterval(() => us.value = Date.now() / 1e3, 1e3)), bn += 1, Io() && Ro(() => {
    bn -= 1, bn || clearInterval(so);
  }), us;
}
const _p = ["title", "data-figure-mark", "data-folded", "data-open"], Sp = {
  key: 2,
  class: "worker"
}, Ep = { class: "head" }, Ap = { key: 0 }, Cp = {
  key: 3,
  class: "status"
}, Op = {
  key: 0,
  class: "figure"
}, Tp = {
  key: 1,
  class: "ran-for"
}, Ip = { key: 2 }, Rp = {
  key: 3,
  class: "news"
}, Bp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Lp = {
  key: 6,
  class: "settled"
}, Dp = {
  key: 1,
  class: "bar"
}, Np = {
  key: 3,
  class: "detail body"
}, Pp = {
  key: 0,
  class: "body-label"
}, jp = ["title"], qp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = oa(), s = ["onClick", "onAct"], a = R(() => Object.fromEntries(Object.entries(n).filter(([Q]) => !s.includes(Q)))), o = D(!1), r = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = R(() => t.open !== void 0), l = R(() => i.value || r.value), u = R(() => i.value ? t.open : o.value), d = R(() => i.value ? !t.open : r.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), v = R(() => l.value || f.value || !!n.onClick), y = D(null), T = D(null), { folded: S, phase: w } = $r(y, () => d.value);
    function x(Q) {
      var ee, Z;
      if (!(Q.target !== y.value && !T.value.contains(Q.target))) {
        if (i.value) return (ee = n.onClick) == null ? void 0 : ee.call(n, Q);
        if (r.value) return void (o.value = !o.value);
        (Z = n.onAct || n.onClick) == null || Z(Q);
      }
    }
    const M = (Q) => n.onAct(Q), V = ["failed", "unfinished"], _ = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? V.includes(t.mark.state) ? "danger" : "good" : ""), g = R(() => t.mark.color ? t.mark.color : _.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : _.value ? `var(--tone-${_.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), N = R(() => g.value || "var(--tone-work)"), C = R(() => !t.mark.ending && !t.mark.ended && _.value !== "stopped"), I = Mp(), $ = R(
      () => t.mark.began_at && C.value && !t.mark.figure && !t.mark.counting ? Of(I.value - t.mark.began_at) : ""
    ), A = R(() => {
      const { started: Q, ended: ee } = t.mark;
      return Q ? ee ? `ran ${Ja(ee - Q, !0)}` : Ja(I.value - Q, !0) : $.value;
    }), b = ["bad", "danger", "warn"], p = R(() => b.includes(_.value) || t.mark.asks ? "attention" : C.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), B = ["bad", "danger"], L = R(() => B.includes(_.value)), F = R(() => p.value === "process" ? "running" : L.value ? "cross" : _.value === "stopped" ? "stopped" : _.value === "good" ? "tick" : ""), re = R(
      () => !!(t.mark.figure || A.value || t.mark.docked || t.mark.stopping || F.value || t.mark.settled || t.mark.news)
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
        z(w),
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
      "data-folded": z(S) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (c(), G(xt(v.value ? "button" : "span"), {
        ref_key: "top",
        ref: T,
        class: "top",
        type: v.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: H(() => [
          e.mark.markIcon ? (c(), G(et, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), G(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Sp, k(e.mark.worker), 1)) : E("", !0),
          m("span", Ep, [
            j(rt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Ap, k(e.mark.name), 1)) : E("", !0),
            l.value ? (c(), G(Jt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : E("", !0)
          ]),
          re.value ? (c(), h("span", Cp, [
            e.mark.figure ? (c(), h("span", Op, k(e.mark.figure), 1)) : E("", !0),
            A.value ? (c(), h("span", Tp, k(A.value), 1)) : E("", !0),
            e.mark.stopping ? (c(), h("span", Ip, "Stopping")) : E("", !0),
            e.mark.news ? (c(), h("span", Rp, k(e.mark.news), 1)) : E("", !0),
            F.value === "running" ? (c(), h("span", Bp)) : F.value ? (c(), G(et, {
              key: 5,
              class: J(["sign", F.value]),
              name: F.value
            }, null, 8, ["class", "name"])) : E("", !0),
            e.mark.settled ? (c(), h("span", Lp, k(e.mark.settled), 1)) : E("", !0)
          ])) : E("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), G(xr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: be(M, ["stop"])
      }, null, 8, ["label", "open"])) : E("", !0),
      (e.mark.figure || e.mark.counting) && C.value ? (c(), h("span", Dp, [
        m("span", {
          class: "progress",
          style: me({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: N.value })
        }, null, 4)
      ])) : E("", !0),
      e.mark.detail && !z(S) ? (c(), G(rt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      e.mark.body && !z(S) ? (c(), h("div", Np, [
        e.mark.bodyLabel ? (c(), h("p", Pp, k(e.mark.bodyLabel), 1)) : E("", !0),
        j(rt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : E("", !0),
      e.mark.command && !z(S) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, jp)) : E("", !0),
      e.mark.card ? (c(), G(rt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      he(Q.$slots, "default", {
        shown: !z(S)
      }, void 0, !0)
    ], 16, _p));
  }
}), Ar = /* @__PURE__ */ K(qp, [["__scopeId", "data-v-74d78abb"]]), Fp = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Cr(e) {
  var n;
  const t = Fp[e] || ((n = cn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Wp = (e) => Cr(String(e).split(":")[0]), Or = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Hp = { passed: "good", failed: "danger", warned: "warn", running: "" }, Up = { good: "good", warn: "warn", danger: "danger" }, ao = {
  "open row": (e) => Ze(`${e.target_model}:${e.target_id}`),
  "open page": (e) => $l(e.target_model, e.target_id || 0)
}, zp = { "open row": (e) => Wp(e.target_model), "open page": () => Cr("pages") };
function Vp(e, t) {
  const n = t || {}, s = ao[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Hp[e.outcome] || "" : Up[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? zp[s](e) : "",
    handlers: s ? { onAct: () => ao[s](e) } : {}
  };
}
const Gp = 24, Kp = 1e3, oo = 2e3, Yp = 0.25, Jp = 5e3;
function Zp(e, t = Gp, n = () => !0) {
  const s = D(!1), a = D(0), o = D(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const _ = u();
    return _ ? _.scrollHeight - _.scrollTop - _.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function v(_) {
    if (clearTimeout(r), !_) {
      o.value = !1, l = Date.now();
      return;
    }
    const g = Date.now() - l < oo ? oo : Kp;
    r = setTimeout(() => o.value = s.value, g);
  }
  function y() {
    clearTimeout(i), s.value = !1, a.value = 0, v(!1);
  }
  function T(_ = !1) {
    const g = u();
    g && _ && g.scrollTo ? g.scrollTo({ top: g.scrollHeight, behavior: "smooth" }) : g && (g.scrollTop = g.scrollHeight), y();
  }
  function S() {
    x(), !s.value && (s.value = !0, v(!0));
  }
  const w = () => !!u() && d() <= u().clientHeight * Yp;
  function x() {
    clearTimeout(i), w() && (i = setTimeout(() => s.value && w() && n() && T(!0), Jp));
  }
  function M() {
    f() ? y() : S();
  }
  function V(_ = 1, g = !1) {
    s.value ? a.value += Math.max(0, _) : T(g);
  }
  return Io() && Ro(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: y, toBottom: T, left: S, scrolled: M, arrived: V };
}
const Xp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Qp = (e) => String(e ?? "").replace(Xp, ""), em = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = D(null), { away: o, scrolled: r, arrived: i, toBottom: l } = Zp(a);
    xe(
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
      ce(k(z(Qp)(e.lines.join(`
`)) || e.empty), 1),
      z(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (v) => z(l)(!0))
      }, "Follow")) : E("", !0)
    ], 544));
  }
}, tm = /* @__PURE__ */ K(em, [["__scopeId", "data-v-d9fa8127"]]), nm = 1e4;
class sm {
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
    return this.heardAt !== null && t - this.heardAt > nm;
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
const am = {
  key: 0,
  class: "frame-note"
}, om = {
  key: 0,
  class: "frame-note"
}, rm = ["src", "title"], im = 1e3, lm = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Hn(), s = D(null), a = D(!1), o = D(!1);
    let r = null, i = 0;
    return Be(() => {
      r = new sm(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, im);
    }), Ie(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", am, "This window was closed because it stopped answering.")) : (c(), h(Y, { key: 1 }, [
      a.value ? (c(), h("div", om, [
        u[2] || (u[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        j(ke, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: H(() => [...u[1] || (u[1] = [
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
        title: z(n).window
      }, null, 8, rm)
    ], 64));
  }
}, cm = /* @__PURE__ */ K(lm, [["__scopeId", "data-v-32a49046"]]), um = 0, dm = "/api/lines", hm = "/api/line";
class fm {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), um));
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
        const n = await qe.raw(dm, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await qe.raw(hm, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const pm = new fm();
class mm {
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
      n.patterns.some((s) => Tr(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Tr(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const gm = Symbol("pane-page"), vm = { 1: "refused", 2: "usage", 3: "fault" }, ym = 100, wm = 50, km = /"([^"]*)"|'([^']*)'|(\S+)/g;
function bm({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = D({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: v = "", tabs: y = [], search: T = {}, readOnly: S = !1, shared: w = null }) {
  const x = /* @__PURE__ */ new Map(), M = new AbortController(), V = D(!1);
  let _ = 0, g = 0;
  const N = () => {
    clearTimeout(g), g = setTimeout(() => V.value = _ === 0, wm);
  }, C = (I) => {
    const $ = x.get(I);
    if ($ && performance.now() - $.at < ym) return $.answer;
    _ += 1;
    const A = Rr(e, I, t, M.signal).finally(() => {
      _ -= 1, N();
    });
    return x.set(I, { answer: A, at: performance.now() }), A;
  };
  return {
    answered: V,
    settle: N,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => s()),
    permissions: a,
    autoScroll: v,
    tabs: y,
    search: T,
    readOnly: S,
    shared: w,
    read: C,
    run: (I) => Xt(e, I, t, M.signal),
    upload: (I) => $m(I, M.signal),
    cancel: () => M.abort(),
    subscriptions: r,
    follow: (I, $) => r.follow(e, I.filter((A) => o.some((b) => Tr(b, A))), $, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (I) => R(() => {
      var $;
      return l.value[I] ?? (($ = u.find((A) => A.key === I)) == null ? void 0 : $.default);
    }),
    setting: async (I, $) => {
      const A = await C(`window setting ${e} ${I}`);
      return A.ok ? A.value.value : $;
    },
    setOption: f,
    keep: (I, $) => Xt(e, ["window", "save-setting", e, I, JSON.stringify($)], t, M.signal)
  };
}
function xm(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Zt = { ok: !1, failure: "cancelled", error: "" }, Ir = "The journal did not answer, so this did not go through. Try again.";
async function Xt(e, t, n, s = void 0) {
  try {
    const a = await pm.add({ window: e, line: Array.isArray(t) ? t : Mm(t), environment: n }, s);
    return s != null && s.aborted ? Zt : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: vm[a.code] || "fault", error: xm(a.error) };
  } catch {
    return s != null && s.aborted ? Zt : { ok: !1, failure: "unreachable", error: Ir };
  }
}
async function Rr(e, t, n, s) {
  const a = await Xt(e, t, n, s);
  return a.failure !== "unreachable" || !ra() ? a : (await xc(), s.aborted ? Zt : Rr(e, t, n, s));
}
async function $m(e, t = void 0) {
  try {
    const n = await qe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? Zt : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Zt : { ok: !1, failure: "unreachable", error: Ir };
  }
}
function Mm(e) {
  return [...e.matchAll(km)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function _m({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Sm = {
  class: "allowance-prompt",
  role: "dialog"
}, Em = { class: "allowance-prompt-text" }, Am = { class: "allowance-prompt-buttons" }, Cm = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Sm, [
      m("p", Em, k(z(_m)(e.request)), 1),
      m("div", Am, [
        j(ke, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: H(() => [...a[2] || (a[2] = [
            ce("Allow", -1)
          ])]),
          _: 1
        }),
        j(ke, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: H(() => [...a[3] || (a[3] = [
            ce("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Om = /* @__PURE__ */ K(Cm, [["__scopeId", "data-v-102dc765"]]), ds = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(In, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: H(() => [
        ce(k(e.reason) + " ", 1),
        e.retry ? (c(), G(ke, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: H(() => [...a[2] || (a[2] = [
            ce("Retry", -1)
          ])]),
          _: 1
        })) : E("", !0),
        e.removable ? (c(), G(ke, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: H(() => [...a[3] || (a[3] = [
            ce("Remove tab", -1)
          ])]),
          _: 1
        })) : E("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Tm = ["data-window", "data-agent"], Im = {
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
    const i = Te(il, null), l = bm({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: Te(gm, null),
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
    Bi(Le, l), xe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Be(l.settle), Ie(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), Li((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => na(n.component), d = () => {
      var f, v;
      return ((v = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : v.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, v) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), G(Om, {
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
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(Y, { key: 4 }, [
        (c(), G(u, { key: o.value })),
        e.skeleton.length && !z(l).answered.value ? (c(), G(_r, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : E("", !0)
      ], 64)) : (c(), G(ds, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: v[1] || (v[1] = (y) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Tm));
  }
}, Br = /* @__PURE__ */ K(Im, [["__scopeId", "data-v-1db91f82"]]), Rm = {
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
    const n = e, s = t, a = { render: () => na(cm, { src: n.entry.entry_url }) };
    return (o, r) => (c(), G(Br, {
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
}, Bm = ["data-window"], Lm = {
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
            )).default, gc();
          } catch (i) {
            if (pc(i) && mc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      j(_r, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Bm)) : (c(), G(Br, {
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
}, ro = "*.*", Dm = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var u;
    const t = e, n = Te(Le, null), s = new mm(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [ro], (d) => s.dispatch(d));
    Ie(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? "", r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = R(() => !!(t.declaration.shipped || t.declaration.trusted)), l = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [ro] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), G(Lm, {
      key: 0,
      entry: l.value,
      subscriptions: z(s),
      environment: z(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(Rm, {
      key: 1,
      entry: l.value,
      subscriptions: z(s),
      environment: z(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Nm = { class: "mark-more-inner" }, Pm = {
  class: "mark-lines",
  "data-mark-reason": ""
}, jm = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, qm = {
  key: 3,
  class: "mark-lines"
}, Fm = "process", io = "task", Wm = 2e3, Hm = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Te(Le), s = R(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = R(() => Or.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === io ? t.mark.target_id : 0), r = D([]), i = D(!1), l = D(""), u = R(() => t.mark.target_model === Fm && !!t.mark.target_id);
    async function d() {
      const y = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, l.value = y.ok ? "" : y.error, y.ok && (r.value = y.value.lines);
    }
    let f = null;
    const v = () => clearInterval(f);
    return xe(() => t.shown && u.value, (y) => {
      v(), y && (d(), t.mark.ended_at || (f = setInterval(d, Wm)));
    }, { immediate: !0 }), xe(() => t.mark.ended_at, (y) => y && t.shown && u.value && (v(), d())), Ie(v), (y, T) => (c(), h("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: T[1] || (T[1] = be(() => {
      }, ["stop"]))
    }, [
      m("div", Nm, [
        e.declaration.body_url ? (c(), G(Dm, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(Y, { key: 1 }, [
          a.value ? (c(), h(Y, { key: 0 }, [
            T[2] || (T[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Pm, k(a.value), 1)
          ], 64)) : E("", !0),
          u.value && l.value ? (c(), h("p", jm, k(l.value), 1)) : u.value && i.value ? (c(), h(Y, { key: 2 }, [
            T[3] || (T[3] = m("p", { class: "mark-label" }, "Output", -1)),
            j(tm, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", qm, k(s.value.join(`
`)), 1)) : E("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: T[0] || (T[0] = be((S) => z(Ze)(`${io}:${o.value}`), ["stop"]))
          }, "Open task " + k(o.value) + " and its proofs", 1)) : E("", !0)
        ], 64))
      ])
    ], 2));
  }
}, zs = /* @__PURE__ */ K(Hm, [["__scopeId", "data-v-51f69bf1"]]), Um = (e) => `show-${e}`, Bk = (e, t, n) => e.filter((s) => {
  var a;
  return n(Um((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), zm = "messages.chat", Vm = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), Lr = (e, t, n) => Xt(zm, Vm(e, t), n), Gm = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Km = ["title", "aria-label", "onClick"], Ym = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Jm = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => Gm(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = D(""), a = Te(Le);
    async function o(r) {
      const i = await Lr(r, t.mark, a.environment);
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
        j(et, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Km))), 128)),
      s.value ? (c(), h("span", Ym, k(s.value), 1)) : E("", !0)
    ], 64));
  }
}, Zm = /* @__PURE__ */ K(Jm, [["__scopeId", "data-v-0dfda102"]]);
function Dr(e, t) {
  const n = Fn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await qe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const Nr = Dr("/api/marks", "marks"), Lk = Nr.fetchAll, Xm = Nr.find, Qm = 2e3;
function Pr(e, t, n = Qm) {
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
  }), Lt(() => clearTimeout(s));
}
const eg = ["data-ref"], tg = ["data-ref"], ng = { class: "mark-row" }, sg = "dock add", ag = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = R(() => Xm(s.mark.type)), o = Te(Le, null), r = R(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = D(null);
    Pr(async () => {
      if (!r.value) return;
      const y = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      y.ok && y.value.rows.length && (i.value = y.value.rows[0].progress);
    }, () => r.value);
    const l = R(() => {
      const y = Vp(s.mark, a.value), T = !y.figure || y.figure.endsWith("%");
      return i.value && r.value && T ? { ...y, figure: `${i.value}%`, fraction: i.value / 100 } : y;
    }), u = R(() => {
      var y;
      return !!(s.mark.lines || s.mark.detail && Or.has(s.mark.variant) || t.has(s.mark.target_model) || (y = a.value) != null && y.body_url);
    }), d = D(!1);
    function f(y) {
      if (l.value.handlers.onAct && !y.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const v = R(() => {
      var y, T, S;
      return s.docked ? (T = (y = a.value) == null ? void 0 : y.buttons) == null ? void 0 : T.filter((w) => {
        var x;
        return !((x = w.runs) != null && x.startsWith(sg));
      }) : (S = a.value) == null ? void 0 : S.buttons;
    });
    return (y, T) => {
      var S, w;
      return (S = a.value) != null && S.card ? (c(), h("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        j(zs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, eg)) : (c(), h("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (w = a.value) == null ? void 0 : w.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", ng, [
          j(Ar, ut({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, Di(l.value.handlers), { onClick: f }), Ni({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: H(({ shown: x }) => [
                j(zs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: x
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          j(Zm, {
            buttons: v.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, tg));
    };
  }
}, og = /* @__PURE__ */ K(ag, [["__scopeId", "data-v-cc29b2a4"]]), rg = ["data-ref"], ig = ["inert"], lg = { class: "thread-group" }, cg = {
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
      j(Ar, {
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
        m("div", lg, [
          (c(!0), h(Y, null, se(e.group.marks, (i) => (c(), G(og, {
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, ig)) : E("", !0)
    ], 8, rg));
  }
}, Dk = /* @__PURE__ */ K(cg, [["__scopeId", "data-v-8a285510"]]);
function ug(e) {
  const t = D(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Be(() => n.observe(e.value)), Lt(() => n.disconnect()), t;
}
const dg = { class: "chat-dock-fold" }, hg = ["aria-label"], fg = { class: "chat-dock-head" }, pg = { class: "chat-dock-inner" }, jr = 700, mg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = D(null), s = D(null), a = ug(s), o = D(!1);
    let r = 0;
    return Be(() => r = setTimeout(() => o.value = !0, jr)), Lt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      m("div", dg, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          he(i.$slots, "edge"),
          m("header", fg, [
            he(i.$slots, "head")
          ]),
          m("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            m("div", pg, [
              m("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: me(z(a) === null ? null : { height: `${z(a)}px` })
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
        ], 10, hg)
      ])
    ], 2));
  }
}, qr = /* @__PURE__ */ K(mg, [["__scopeId", "data-v-63e4dcfc"]]), gg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, hs = 5, vg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(hs, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${hs}s`, animationDelay: `${(n - hs).toFixed(2)}s` };
    return (a, o) => (c(), h("span", gg, [
      m("i", { style: s })
    ]));
  }
}, Fr = /* @__PURE__ */ K(vg, [["__scopeId", "data-v-d0c4b012"]]), Wr = Dr("/api/docks", "docks"), Nk = Wr.fetchAll, Vs = Wr.find, yg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Gs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), wg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), kg = (e) => e.kept ? Gs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : Gs("keep", "pin", "Pin", `dock keep ${e.id}`), bg = ["pin", "stop"], xg = (e) => ({ ...e, iconOnly: bg.includes(e.icon) });
function $g(e, t) {
  var n;
  return [
    ...wg(e, t) ? [kg(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || cn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Gs("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(xg);
}
const Mg = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: yg(e, t),
  buttons: $g(e, t)
}), _g = { class: "dock-title" }, Sg = ["aria-expanded", "title"], Eg = { class: "chat-dock-acts dock-acts" }, Ag = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Cg = {
  key: 1,
  class: "dock-text"
}, Og = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = R(() => Vs(s.item.type)), o = D(null), r = R(() => Mg(s.item, a.value)), i = Te(Le), l = D(/* @__PURE__ */ new Set()), u = D("");
    async function d(y) {
      if (y.action === "open") return Ze(`${s.item.target_model}:${s.item.target_id}`);
      y.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, y.label])), u.value = "";
      const S = await Lr(y, s.item, i.environment);
      (S == null ? void 0 : S.ok) === !1 && (l.value = new Set([...l.value].filter((w) => w !== y.label)), u.value = S.error);
    }
    const f = R(() => r.value.buttons.filter((y) => y.action !== "undock" && !l.value.has(y.label))), v = R(() => r.value.buttons.find((y) => y.action === "undock"));
    return (y, T) => (c(), G(qr, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: H(() => [
        e.leaving ? (c(), G(Fr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : E("", !0)
      ]),
      head: H(() => {
        var S, w, x;
        return [
          (S = a.value) != null && S.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(Y, { key: 1 }, [
            j(ye, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            m("span", _g, k(r.value.title), 1)
          ], 64)),
          (w = a.value) != null && w.badge ? (c(), h("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, k(a.value.badge), 3)) : E("", !0),
          (x = a.value) != null && x.draws_head ? E("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: T[0] || (T[0] = (M) => n("fold"))
          }, [
            j(Jt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, Sg)),
          m("span", Eg, [
            (c(!0), h(Y, null, se(f.value, (M) => (c(), h(Y, {
              key: M.action + M.runs
            }, [
              M.iconOnly ? (c(), G(ke, {
                key: 0,
                kind: "icon",
                "aria-label": M.label,
                title: M.label,
                "data-dock-action": M.action,
                onClick: (V) => d(M)
              }, {
                default: H(() => [
                  j(ye, {
                    name: M.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), G(ke, {
                key: 1,
                small: "",
                kind: M.primary ? "primary" : "ghost",
                bordered: !M.primary,
                "data-dock-action": M.action,
                onClick: (V) => d(M)
              }, {
                default: H(() => [
                  ce(k(M.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          j(Gn, {
            title: v.value.label,
            "data-dock-action": "undock",
            onClick: T[1] || (T[1] = (M) => d(v.value))
          }, null, 8, ["title"])
        ];
      }),
      default: H(() => {
        var S, w;
        return [
          u.value ? (c(), h("p", Ag, k(u.value), 1)) : E("", !0),
          e.item.text && !((S = a.value) != null && S.body_url) ? (c(), h("p", Cg, k(e.item.text), 1)) : E("", !0),
          (w = a.value) != null && w.body_url ? (c(), G(zs, {
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
}, lo = /* @__PURE__ */ K(Og, [["__scopeId", "data-v-109b82ce"]]), Tg = 6, Ig = 3, co = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, yt = (e) => !!(e.leaves_at && !e.kept), Rg = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!yt(e) || t < e.leaves_at || n.has(e.id)), Bg = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => Rg(s, t, n)).sort((s, a) => s.id - a.id);
function Lg(e, t, n = Tg) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const Dg = (e, t, n = e) => n < 2 ? !1 : e >= Ig ? !0 : t, Ng = ["title", "aria-label"], Pg = { class: "run-chip-in" }, jg = {
  key: 0,
  class: "run-chip-ring"
}, qg = { class: "run-chip-name" }, Fg = { class: "run-chip-bar" }, Wg = "processes.output", Hg = 5e3, Ug = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = Te(Le, null)) == null ? void 0 : d.environment) ?? "", o = D(null), r = R(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = R(() => {
      var f, v;
      return ((f = o.value) == null ? void 0 : f.title) || ((v = o.value) == null ? void 0 : v.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = R(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await Xt(Wg, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return Pr(u, () => r.value, Hg), (f, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: me({ "--tone": l.value })
      }, [
        z(yt)(e.item) ? (c(), G(Fr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : E("", !0),
        m("span", Pg, [
          r.value ? (c(), h("span", jg)) : (c(), G(et, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          m("span", qg, k(i.value), 1)
        ]),
        m("span", Fg, [
          m("i", {
            style: me({ width: r.value ? `${((y = o.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, Ng);
    };
  }
}, zg = /* @__PURE__ */ K(Ug, [["__scopeId", "data-v-597b05d2"]]), Vg = 24, Gg = 8, Pk = 420;
function jk({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= Vg && e > t ? !0 : e < t && a > Gg ? !1 : null;
}
const Kg = (e, t) => e === void 0 ? t : e, Yg = {
  key: "runs-head",
  class: "dock-runs-head"
}, Jg = { class: "dock-runs-chips" }, Zg = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = $p(500), s = D(/* @__PURE__ */ new Set()), a = D(!1), o = D(!1), r = R(() => Bg(t.items, n.value, s.value)), i = R(() => Lg(r.value.filter((M) => co(M, Vs)), n.value)), l = R(() => r.value.filter((M) => !i.value.includes(M) && !co(M, Vs))), u = R(() => i.value.filter((M) => !yt(M))), d = R(() => (a.value = Dg(i.value.length, a.value, u.value.length)) && !o.value), f = D({}), v = (M) => Kg(f.value[M.id], t.folded);
    function y(M) {
      f.value = { ...f.value, [M.id]: !v(M) };
    }
    function T(M) {
      f.value = { ...f.value, ...Object.fromEntries(i.value.map((V) => [V.id, V.id !== M.id])) }, o.value = !0;
    }
    function S() {
      f.value = Object.fromEntries(Object.entries(f.value).filter(([M]) => !i.value.some((V) => String(V.id) === M))), o.value = !1;
    }
    function w(M) {
      s.value = /* @__PURE__ */ new Set([...s.value, M.id]);
    }
    function x(M) {
      s.value = new Set([...s.value].filter((V) => V !== M.id));
    }
    return (M, V) => (c(), G(Oo, {
      tag: "div",
      name: "dock",
      duration: z(jr),
      class: "dock-stack"
    }, {
      default: H(() => [
        (c(!0), h(Y, null, se(l.value, (_) => (c(), G(lo, {
          key: _.id,
          item: _,
          class: J({ timed: z(yt)(_) }),
          leaving: z(yt)(_) && !s.value.has(_.id),
          folded: v(_),
          onFold: (g) => y(_),
          onMouseenter: (g) => w(_),
          onMouseleave: (g) => x(_)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", Yg, [
          m("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: S
          }, [
            ce(k(i.value.length) + " runs ", 1),
            j(Jt, { open: "" })
          ])
        ])) : E("", !0),
        (c(!0), h(Y, null, se(d.value ? [] : i.value, (_) => (c(), G(lo, {
          key: _.id,
          item: _,
          class: J({ timed: z(yt)(_) }),
          leaving: z(yt)(_) && !s.value.has(_.id),
          folded: v(_),
          onFold: (g) => y(_),
          onMouseenter: (g) => w(_),
          onMouseleave: (g) => x(_)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        d.value ? (c(), G(qr, {
          key: "runs-row",
          label: `${i.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: H(() => [
            m("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: V[0] || (V[0] = (_) => o.value = !0)
            }, [
              j(et, { name: "runs" }),
              ce(" " + k(i.value.length) + " runs ", 1),
              j(Jt)
            ]),
            m("span", Jg, [
              (c(!0), h(Y, null, se(i.value, (_) => (c(), G(zg, {
                key: _.id,
                item: _,
                onClick: (g) => T(_)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : E("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, qk = /* @__PURE__ */ K(Zg, [["__scopeId", "data-v-7081ac82"]]), wt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, An = (e) => Math.min(Math.max(e, 0), 1), Xg = (e) => {
  const t = An(e);
  return t * t * (3 - 2 * t);
}, pt = (e, t, n) => Xg((e - t) / (n - t));
function Fk(e) {
  const t = An(e), n = An((t - 0.12) / 0.76) * wt.shuffles, s = Math.min(Math.floor(n), wt.shuffles - 1), a = n - s, o = pt(a, 0.26, 0.38) * (1 - pt(a, 0.76, 0.96)), r = pt(a, 0.38, 0.76), i = pt(t, 0, 0.12) * (1 - pt(t, 0.88, 1)), l = pt(a, 0.2, 0.34) * (1 - pt(a, 0.84, 1)), u = Math.sin(Math.PI * An((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / wt.shuffles, lift: wt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function Wk(e, t, n, s, a) {
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
}, Hk = (e) => uo[e] ?? uo.butler, ga = 2400, Qg = 0.05;
function e0({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, Qg), r = Math.min(t + ga * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function Uk(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function t0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function zk(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const Vk = (e, t) => ({ ...e, stretch: t.stretch }), Gk = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Hr = (e, t) => t >= (e.least ?? 0);
function Kk(e, t, n) {
  if (!Hr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const Yk = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), n0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ho = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), s0 = (e) => e.right > e.left && e.bottom > e.top;
function Jk(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(n0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = ho(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = ho(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), s0(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function Ur(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, v] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[f] || e[d] > o[v]) && (i = -1);
      else {
        const T = (o[f] - e[d]) / y, S = (o[v] - e[d]) / y;
        r = Math.max(r, Math.min(T, S)), i = Math.min(i, Math.max(T, S));
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
}, Qt = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), a0 = (e) => e * e * (3 - 2 * e), Se = (e, [t, n]) => a0(Qt(e, t, n)), o0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, xn = ([e, t], n) => e + n() * (t - e);
function r0(e) {
  return o0.map(() => {
    const t = xn(it.speed, e), n = xn(it.angle, e) * Math.PI / 180, s = xn(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [xn(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const i0 = r0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function l0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function Zk(e, t, n = i0) {
  const s = _e.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = l0(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= it.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const Xk = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function Qk(e, t) {
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
const eb = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Tt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function tb(e, t, n) {
  const { away: s, side: a } = _e.bug_smash, o = a * s * n, [r, i] = [t.left + Tt.margin * n, t.right - Tt.margin * n], l = Math.min(Math.max(e + o + a * Tt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function nb(e, t, n) {
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
function sb(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Tt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = e0({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Oe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function ab(e) {
  const t = Oe.least + Math.floor(e() * (Oe.most - Oe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Oe.walls[Math.floor(e() * Oe.walls.length)],
    along: Oe.margin + e() * (1 - 2 * Oe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Ks(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Oe.margin, r = ((e.along - Oe.margin + e.way * Oe.speed * n / s) / a % 2 + 2) % 2, i = Oe.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Oe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Oe.inset : t.right - Oe.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function c0(e, t) {
  const n = _e.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = t0(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function ob(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = _e.bug_shot, { frame: r, bug: i, shot: l } = c0(n, e.length), u = e.map((x, M) => ({ ...Ks(x, t, Math.min(n / o.fps, Cn(M).shot)), shot: M < l })), d = Se(r / o.frames, o.aim), [f, v] = [u[Math.max(i - 1, 0)], u[i]], y = e.map((x, M) => ({ bug: x, index: M, seconds: n / o.fps - Cn(M).shot, spot: Ks(x, t, Cn(M).shot) })).filter((x) => x.seconds >= 0), T = y.flatMap((x) => {
    const M = (a == null ? void 0 : a.get(x.index)) ?? p0(x.bug, t, x.spot, a ? [] : s);
    return a == null || a.set(x.index, M), a && m0(M, x.seconds, s), g0(M, x.seconds, s);
  }), S = y.filter((x) => h0(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), w = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (v.x - f.x) * d, y: f.y + (v.y - f.y) * d, back: w }, slush: T, camera: S };
}
function Cn(e) {
  const t = _e.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function rb(e, t, n, s) {
  const { limit: a, margin: o } = _e.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Cn(d), v = Ks(u, t, f.shot), y = Math.abs(v.y - n.y) / Math.tan(a * Math.PI / 180), T = v.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - v.x), S = Math.abs(v.x - l) >= y ? l : v.x + T * y, w = T > 0 ? Math.max(l, Math.min(S, i)) : Math.min(l, Math.max(S, r)), x = { from: l, to: w, begin: f.walk, end: f.aim };
    return l = w, x;
  });
}
function ib(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, u0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function d0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const h0 = (e) => e.along * 97 % 1 < $e.camera, en = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function f0(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += $e.step) {
    const d = Math.min(u + $e.step, r.t), f = en(e, d), v = Ur(i, f, n);
    if (v) return { ...v, t: u + (d - u) * v.share };
    i = f;
  }
  const l = en(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function p0(e, t, n, s = []) {
  const a = d0(e.along + 1), [o, r] = u0[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: $e.count }, () => {
    const l = i + (a() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + a() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: $e.radius[0] + a() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...f0(d, t, s) };
  });
}
function m0(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += $e.step) {
      const r = Math.min(o + $e.step, a), i = Ur(en(s, o), en(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function g0(e, t, n = []) {
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
function lb(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = _e.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = Se(e, [0, u]), v = Se(e, [u, u + d]);
  return r.map((y) => {
    const T = { x: s.x + y.at[0] * t, y: s.y + y.at[1] * t };
    return {
      x: n.x + (T.x - n.x) * f,
      y: n.y + (T.y - n.y) * f,
      r: y.size * t * (0.15 + 0.85 * f * f),
      run: v * v * t * 1.2,
      fade: 1 - v,
      landed: f >= 1
    };
  });
}
function cb(e, t, n, s, a) {
  const { sway: o, above: r } = _e.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (S) => {
    const [w, x] = [S.x - e.at.x, S.y - e.at.y];
    return { x: i.x + w * u - x * d, y: i.y + w * d + x * u };
  }, [v, y] = [...n].sort((S, w) => S.x - w.x), T = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: T.map((S, w) => ({ from: S, to: w < T.length / 2 ? v : y })) };
}
const ub = (e, t) => Se(t, e.grows) * (1 - Se(t, e.sinks));
function Dn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: Qt(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: Qt(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function db(e, t) {
  const n = _e[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Dn(n, t), r = 1 - (1 - n.small) * Se(s, n.shrinks) * (1 - Se(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Dn(n, t), o = n.flat * Se(s, n.squashes) * (1 - Se(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * Qt(a, ...n.springs)) * (1 - Qt(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const hb = (e) => e === "pack_box";
function fb(e) {
  const { into: t, out: n } = Dn(_e.rope_swing, e);
  return 1 - Se(t, [0, 1]) * (1 - Se(n, [0, 1]));
}
function pb(e) {
  const t = _e.rope_swing, { into: n, out: s } = Dn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Se(n, [0, 1]) * (1 - Se(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const v0 = { after: 3 }, va = 10, y0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, w0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, k0 = { weight: 19 }, zr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, b0 = { every: 120 }, Vr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Gr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, x0 = {
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
}, hn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: va }), te = (e, t, n = {}) => hn(e, "clip", t, n), fs = (e, t, n = {}) => hn(e, "look", t, n), fo = (e, t, n = {}) => hn(e, "gaze", t, n), pe = (e, t, n = {}, s = {}) => ({ ...hn(e, "pick", t, n), ...s }), ve = (e) => hn("nothing", "nothing", e, {}), $0 = 120, M0 = 300, ps = (e, t) => ({ ...te(e, t), cooldown: M0 }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), _0 = () => [te("joy", 2)], mt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), gt = (e) => ({ ...e, cooldown: y0[e.name] }), Ft = (e) => ({ ...e, shenanigan: !0, lasts: w0[e.name] }), Jn = [
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
  ...oe("reported", { cooldown: 90 }, [fo("read", 3), te("nod", 1), ve(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...oe("read_message", { cooldown: 30 }, [fo("read", 3), ve(1)]),
  ...oe("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ve(6)]),
  ...oe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ve(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...oe("bar_done", { holds: !0 }, _0()),
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
  ...oe("pondering", { cooldown: [30, 60] }, [pe("ponder", 1)]),
  ...oe("thought_cloud", { cooldown: 90 }, [pe("cloud", 1)]),
  ...oe("light_bulb", { cooldown: 150 }, [pe("bulb", 1)]),
  ...oe("answered", { cooldown: 15 }, [fs("amused", 3), ve(2)]),
  ...oe("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ve(1)
  ]),
  ...oe("long_walk", { cooldown: 90 }, [te("stumble", 3), ve(22)]),
  ...oe("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), ve(13)]),
  ...oe("typing", { cooldown: 60 }, [fs("reading", 1), ve(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(x0).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [fs(t, 1)])),
  ...Object.entries(Vr).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Gr).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
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
    { ...Ft(gt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Ft(gt(te("disco", 2, { ball: "bubble" }))),
    ve(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...oe("held:search", { cooldown: $0 }, [ps("search", 3), { ...ps("binoculars", 2), when: { home: !0 } }, { ...ps("glass_bubble", 2), when: { bubble: !0 } }]),
  ...oe("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...oe("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...oe("spell", {}, [pe("writing", 12, { state: "writing" }), pe("reading", 12, { state: "reading" }), pe("searching", 12, { state: "searching" }), ve(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...oe("tickled", {}, [{ ...gt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...oe("eager", {}, [te("eager", 2, { slow: !0 }), ve(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...oe("jump", {}, [Ft(gt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...oe("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...oe("unit", { cooldown: zr.build.cooldown }, [pe("unit", k0.weight), ve(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: b0.every }, pe("stand", 5)]),
  // a digit a blow's dust lets out
  ...oe("digit", {}, [pe("0", 1), pe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...oe("roam", {}, [
    pe("rest", 35, {}, { stay: [25, 60] }),
    pe("seat", 15, {}, { stay: [15, 40] }),
    pe("edge", 25, {}, { stay: [8, 20] }),
    Ft(pe("bubble", 15, {}, { stay: [30, 80] })),
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
    Ft(gt(pe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], Kr = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Yr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), S0 = (e) => Array.isArray(e) ? e[0] : e, E0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, A0 = (e) => Jn.some((t) => t.when.moment === e);
function C0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || Yr(d).every(([f, v]) => n(f) >= S0(v)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Jn.filter((d) => Kr(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= v0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = C0(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Jr(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Jr(e, t, n) {
  var s;
  for (const [a, o] of Yr(t)) (s = e.memory) == null || s.set(a, e.now + E0(o, n));
}
function mb(e, t, n) {
  Jr(e, Jn.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const gb = (e) => Object.values(zr).find((t) => Kr(t.when, e)) ?? null, O0 = (e, t, n) => n - t <= (e.lifetime ?? va), vb = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Hr(e.clip, t));
class Zr {
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
const Ys = {
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
}, yb = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Xr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), wb = {
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
}, kb = 120, T0 = 20, bb = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < T0), I0 = (e) => Ys[e] || Ys.idle, xb = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Qr = "airborne", R0 = "landing", B0 = "travelling", ei = "grounded", $b = ({ airborne: e, landing: t, trip: n }) => e ? Qr : t ? R0 : n != null && n.started ? B0 : ei;
function Mb(e, t) {
  var a;
  const n = L0(e, t);
  return e.mode === ei && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function L0(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: v = null } = e;
  if (n === Qr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...D0(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const y = v !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? v : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : I0(u), facing: y ? v : i.posture === "sit" ? i.face : f };
}
function D0(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const Js = (e) => e.outcome, N0 = "plugin:code-commandments:sins:", po = (e) => e.type === "plugins.card" && e.markKey.startsWith(N0), P0 = [
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
], _b = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: Zo(n) })).sort((n, s) => n.time - s.time), mo = { user: "reacted", agent: "agent_reacted" };
function Sb(e, t) {
  return e.filter((n) => mo[n.author] && bt(n) > t).map((n) => ({ beat: `${mo[n.author]}:${n.emoji}`, time: bt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const j0 = [.../* @__PURE__ */ new Set([...Object.values(Vr).flatMap((e) => Object.keys(e)), ...Object.keys(Gr)])];
function Eb(e, t) {
  return e.filter((n) => n.author === "agent" && bt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = j0.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: bt(n), card: Zo(n) })).sort((n, s) => n.time - s.time);
}
const q0 = (e) => new Zr(e).isTest(), Nn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Js(e)] || "";
}, F0 = 1800, W0 = (e, t) => {
  if (Nn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Nn(n) !== "finished" && Number(e.time) - Number(n.time) <= F0 ? "tests_fixed" : "tests_passed";
};
function Ab(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(q0), a = s.filter((i) => Nn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Nn(i))), o.map((i) => ({ beat: W0(i, a), time: Number(i.time), card: i.key }));
}
function Cb(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Js(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: Js(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const Ob = (e) => e.map((t) => {
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
function Tb(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function Ib(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Rb(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = P0.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function ya(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const go = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function H0(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    ya(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function Bb(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : A0(`held:${e}`) ? "idle" : e;
}
const Ce = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function Lb(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Ce.ahead * n ? 180 : Math.sign(s) * Ce.turn;
}
const vo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Db(e, t) {
  const n = Math.min(Ce.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Ce.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Ce.lines, Math.floor((e.bottom - e.top - 2 * s) / Ce.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ce.sweep) % a, i = o % Ce.sweep, l = Ce.sweep - Ce.returnSeconds, u = vo((i - l) / Ce.returnSeconds), d = i <= l ? vo(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Ce.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const yo = 3, ti = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, wo = 12, Nb = (e, t) => ({ mood: e, began: t, seen: 0 });
function Pb(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!ti(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= yo ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * wo) / wo, lasts: yo } };
}
const jb = (e) => e.posture === "hang" && !ti(e.face), U0 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), z0 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function qb(e, t, n) {
  return U0.has(e) ? 1 / 0 : !z0.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(ni(n - t.began, t.share) - Xe.lead, 0);
}
const V0 = 5;
function Fb(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= V0 ? { beat: "long_walk", time: n } : null };
}
const G0 = 30, $n = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function Wb(e, t, n, s, a = null) {
  if (t && n < t.until || !$n.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = $n.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + $n.every } : { state: e, began: 0, until: 0, next: n + $n.every };
}
const Hb = (e, t, n) => t && n < t.until && Xr.has(e.state) ? { state: t.state, since: t.began } : e, Xe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, ni = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function Ub(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = ni(o, e.share);
  return a ? { eager: K0(t, r), moment: null } : r > Xe.lead ? { eager: t, moment: null } : r < Xe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Xe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Xe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function K0(e, t) {
  return e.on && t > Xe.lead + Xe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Xe.lead && t >= Xe.least ? { ...e, on: !0, calm: !1 } : e;
}
const Y0 = 1, J0 = { look: "look", gaze: "gaze" };
function Z0(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [J0[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const X0 = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), Q0 = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > Y0 * t, memory: s, now: a, room: o }, n).name === "backflip", ev = { work: ["building"], idle: ["standing"] };
function zb(e, t, n, s) {
  const a = Ys[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(ev[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), Xr.has(e) ? { moments: o, began: n || s } : (n && s - n >= G0 && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function tv(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const ko = { pondering: tv };
function Vb(e, t, n, s, a, o) {
  if (ko[e.beat]) {
    const i = ko[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = Z0(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== va && { lifetime: r.lifetime } } } : null;
}
function Gb(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = X0(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const Kb = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function Yb(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function Jb(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const Zb = (e, t) => !!(e != null && e.watches) && !t.once, Xb = 10, Qb = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || O0(s, s.queuedAt, n)), e5 = (e, t) => t ? null : e[0] ?? null;
function t5(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const n5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), nv = 2 * Math.PI, sv = 500;
function s5(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / sv, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), v = nv * r / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, S = (u ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !l ? a && !t.behind && !y.behind ? ov(y, t, n, v, a) : iv(y, t, n, v) : t) ?? y, w = S != null && S.behind && S.mood === "reading" ? av(e.point, S, n, r, a) : S;
  return { point: w ?? null, toward: w ? { x: w.x - n.x, y: w.y - n.y } : null, amount: f, at: s };
}
function av(e, t, n, s, a) {
  const o = ($) => $ * 180 / Math.PI, r = ($) => o(Math.atan2(Math.sin($ * Math.PI / 180), Math.cos($ * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), v = f ? r(e.readingFacing - i) : 0, y = f ? e.readingYaw + v : d, T = y + r(u - y), S = Math.min(Math.max(s / 1e3, 0), 0.1), w = Ce.turnSpeed * S, x = f ? y + Math.min(Math.max(T - y, -w), w) : T, M = f ? e.readingFollow + v : x, V = M + (x - M) * (1 - Math.exp(-S / Ce.followSeconds)), _ = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, g = o(ya(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), N = Math.min(Math.max(g, -_.up), _.down), C = Ce.tipSpeed * S, I = f ? e.readingPitch + Math.min(Math.max(N - e.readingPitch, -C), C) : N;
  return { ...t, readingYaw: x, readingFollow: V, readingPitch: I, readingFacing: i };
}
function ov(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (M) => {
    const { yaw: V, pitch: _ } = ya(M.x - n.x, a, n.y - M.y, o);
    return { yaw: V, pitch: Math.min(Math.max(_, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [go(i(e)), go(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [v, y] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [T, S, w] = l.map((M, V) => v * M + y * u[V]), x = a * T / S;
  return { ...t, x: n.x + x, y: n.y - H0(x, a, -Math.asin(Math.min(Math.max(w, -1), 1)), o) };
}
const rv = 0.15;
function a5(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= rv;
}
function iv(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const lv = (e) => !(e != null && e.on);
function o5(e, t, n) {
  if (lv(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const tn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ke = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ms = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), bo = (e) => e * e * (3 - 2 * e);
function cv(e) {
  if (e < 0 || e >= Ke.seconds) return null;
  const t = ms(e, ...Ke.flicker), n = Math.floor(t * Ke.flickers * 2) % 2 === 0, s = e < Ke.flicker[1] ? n ? 0.35 + 0.5 * t : Ke.dim : 1;
  return { strength: 1 - bo(ms(e, ...Ke.fade)), lit: s, white: e < Ke.flash[0] ? 0 : 1 - bo(ms(e, ...Ke.flash)) };
}
const r5 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function i5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = cv(t - e.at);
  return s && { colour: tn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ke.signs[e.tone], ...s } };
}
function l5(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function c5(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= tn.looks || s === null && n - e.since >= tn.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function u5(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const ot = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, d5 = { behind: 39, figure: 40, ahead: 41 }, uv = "[data-figure-pile]", dv = { amber: [1, 0.69, 0.125], good: tn.colours.good, bad: tn.colours.bad }, On = { phases: 4, ms: 230, dim: 0.25 }, h5 = (e, t, n) => e !== "amber" || (t + n) % On.phases < On.phases / 2 ? 1 : On.dim, f5 = (e) => e === "amber" ? On.phases : 1;
function p5(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const m5 = Object.keys(dv), He = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Wt = ([e, t], n) => e + n() * (t - e);
function g5(e) {
  const t = He.least + Math.floor(e() * (He.most - He.least + 1));
  return Array.from({ length: Math.min(t, He.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * He.spread, [s, a] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Wt(He.start, e), r = Wt(He.reach, e);
    return {
      text: We({ moment: "digit" }, e).name,
      x: s * o,
      y: He.middle + a * o,
      dx: s * r,
      dy: a * r,
      moveMs: Math.round(Wt(He.moveMs, e)),
      fadeMs: Math.round(Wt(He.fadeMs, e))
    };
  });
}
const gs = { high: 3, gap: 1 };
function v5(e) {
  const t = Math.floor(e / gs.high);
  return { left: -(ot.inside + ot.width / 2 + t * (ot.width + gs.gap)), up: e % gs.high * (ot.height - ot.top) };
}
const hv = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, fv = { after: 5 }, pv = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Zr(t).isBuild());
function y5(e, t, n) {
  const s = pv(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= fv.after ? a : null;
}
function w5(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: hv(n, s, a) } : null;
}
const xo = { ahead: 140, up: 70 };
function k5(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * xo.ahead, y: s - xo.up } } : o ? { at: { x: n(o), y: s - o.up - ot.height } } : t ? { at: null } : null;
}
const vs = { least: 4e3, most: 1e4 }, mv = (e) => vs.least + e() * (vs.most - vs.least), vt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function b5(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = mv(t);
    if (n.length >= vt.most || t() >= vt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (vt.at[0] + t() * (vt.at[1] - vt.at[0]));
    n.push({ from: o, to: o + vt.ms }), s = o + vt.ms;
  }
}
const x5 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), $5 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), si = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), M5 = new Set(Jn.filter((e) => si.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), gv = (e) => e.some((t) => t.state === "built"), _5 = (e, t) => gv(t) ? e.filter((n) => !si.has(n.beat)) : e, ct = { reach: 40, room: 6 }, vv = (e, t) => t <= e - ct.reach + 2, S5 = (e, t, n) => vv(e, n) ? t - ct.reach : e - ct.reach - ct.room, E5 = (e, t, n, s) => s > 0 && t < e && t + ct.reach >= e - 2 ? Math.min(n, Math.max(e, t + ct.reach)) : e, ys = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, A5 = (e) => Wt(e() < ys.longShare ? ys.long : ys.short, e), yv = 2 * ot.width;
function C5(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= yv ? o : e + (o - e + a / 2) % a;
}
const wv = 60, O5 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= wv, $o = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector($o);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll($o)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, kv = "[data-figure-docked-bars]", bv = "[data-figure-chat-foot]", xv = [0.85, 0.6, 0.35, 0.15], $v = ["question", "waiting", "suggestion"], T5 = (e, t) => $v.find((n) => e[n] > 0 && t[n] === "behind") || null;
function I5() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Mv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", _v = "[data-figure-newest]";
function ai() {
  var s, a;
  const e = (s = fn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(_v), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
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
function nn(e, t, n = ai()) {
  if (!e || !n) return !0;
  const s = tt(e, t), a = Xn(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ae.top * t.size, bottom: s.top + Ae.bottom * t.size }, r = wt.gap;
  return !Zn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function R5(e, t, n, s = ai()) {
  if (!s || nn(t, e, s)) return null;
  const a = Xn(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = Mt(), l = t.posture === "stand" ? ba * e.size : hi * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - wt.gap - r, s.right + wt.gap + o].map((v) => ({ ...t, x: v })).filter((v) => v.x >= u && v.x <= d && nn(v, e, s) && ey(v, e)).sort((v, y) => Math.abs(v.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const ws = 0.26, oi = 0.54, Sv = 1.25 / 5.4, pn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ws, travels: "stand" },
  lounge: { drop: ws, travels: "stand" },
  composed: { drop: ws, travels: "stand" },
  hang: { drop: oi, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, B5 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Sv * Math.cos(t * Math.PI / 180),
  y: 1 - n - oi
}), Ht = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Ev = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), L5 = (e, t) => (e === "sit" ? Ev.has(t) : Ht.has(e)) ? e : "stand";
function D5(e, t) {
  return e.facing === t.facing || !Ht.has(e.posture) && !Ht.has(t.posture) ? t : { posture: "stand", facing: Ht.has(e.posture) ? e.facing : t.facing };
}
const N5 = 0.25, P5 = (e, t) => Ht.has(e) && pn[t].drop === 0, ri = 2, Av = 90, Cv = 180, Ov = 140, Tv = 280, Iv = 420, Rv = 0.25, Bv = 290, Lv = 600, Dv = "cubic-bezier(0.2, 0.7, 0.4, 1)", Nv = "cubic-bezier(0.55, 0, 0.9, 0.6)", ks = 5;
function Pn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ks) return null;
  (r || i) && (o = Math.max(o, ri));
  const y = o > 1, T = Math.abs(t.x - e.x), S = T < ks ? 0 : T / (Av * o) * 1e3, w = Math.min(S, y ? Ov : Cv), x = Math.abs(t.y - e.y), M = t.y < e.y, V = M && !v && Q0(x, n, l, u, d, f), _ = M ? Iv + Math.min(x, 400) * Rv : Math.sqrt(2 * x / ga) * 1e3, g = {
    x: t.x,
    y: t.y,
    ms: x > ks ? V ? Lv : _ : 0,
    lead: V ? Bv : M ? Tv : 0,
    easing: M ? Dv : Nv,
    hopping: !0,
    clip: V ? "backflip" : M ? "jump" : "fall"
  }, N = { x: t.x, y: t.y, ms: S + w, lead: 0, easing: "linear", ramp: w, ...y ? { clip: "run" } : {} }, C = v ? Pv(t, n) : g, I = M && !s ? [{ ...N, y: e.y }, C] : [{ ...g, x: e.x }, N];
  return { way: Math.sign(t.x - e.x) || 1, legs: I, lands: !a, pace: o, running: y };
}
const Pv = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), jv = (e, t) => e.postures.includes(t) ? t : e.postures[0], j5 = (e, t, n) => e.posture === "walk" && n ? "walk" : jv(e.clip, t), tt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - pn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Zn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, wa = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Mt() {
  var t;
  const e = (t = fn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Mn = 0.5, Mo = 20;
function q5(e, t, n = Mt()) {
  const s = tt(e, t);
  return s.left >= n.left + Mo && s.right <= n.right - Mo;
}
function ka(e, t, n = Mt()) {
  const s = tt(e, t), a = s.right - s.left, o = Xn(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Mn && i <= n.right + Mn && s.top >= n.top - Mn && l <= n.bottom + Mn;
}
const jn = [0.35, 0.5, 0.65], qn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ae = { left: jn[0], right: jn.at(-1), top: qn[0], bottom: qn.at(-1) }, qv = 0.24;
function Xn(e) {
  if (e.posture === "stand") return { left: Ae.left, right: Ae.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + qv * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ae.left, t), right: Math.max(Ae.right, t) };
}
function Fv(e, { size: t }, n = Mt()) {
  const s = Xn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const ba = (Ae.right - Ae.left) / 2 + 0.08;
function F5(e, t) {
  return e === "hang" ? Ae : { ...Ae, bottom: Math.min(Ae.bottom, 1 - t - pn[e].drop) };
}
const Wv = "[data-figure-agent]";
function ii(e, t, n = "", s = "") {
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
const li = (e) => qn.flatMap(
  (t) => jn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function xa(e, t, n = "") {
  if (!nn(e, t)) return jn.length * qn.length;
  const s = tt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Mv)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && Zn(a, l) && wa(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return li(a).filter(([i, l]) => r(i, l) || ii(i, l, n)).length;
}
function Hv(e, t) {
  const n = tt(e, t);
  return li({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => ii(s, a, "", Wv)).length;
}
const _o = 4;
function W5(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = _o; o <= a; o += _o)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!Hv(i, e) && nn(i, e)) return i;
    }
  return null;
}
function sn(e, t, n) {
  const s = Mt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => ka(r, t, s) && nn(r, t)).map((r) => ({ spot: r, covered: xa(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const ci = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Uv = [0.5, 0.25, 0.75], zv = (e) => ci(e.getBoundingClientRect(), Uv), ui = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Vv = ba, Gv = (e, t, { size: n }, s = Vv) => di(e, ui[t], s * n, "stand");
function di(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Kv = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, hi = 0.1, Yv = (e, t, { size: n }) => di(e, Kv[t], hi * n, "sit"), Jv = (e) => ((e + 180) % 360 + 360) % 360 - 180, bs = 60;
function H5(e, t) {
  const n = Jv(t);
  return !e.aside || Math.abs(n) >= bs ? t : n < 0 ? 360 - bs : bs;
}
const Ut = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Zv = (e) => [.../* @__PURE__ */ new Set([e, ...Ut.turns.map((t) => (t + 360) % 360)])];
function U5(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = Zv(t), r = Ut.every[0] + s() * (Ut.every[1] - Ut.every[0]);
  return { face: t, from: a ? Xv(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function Xv(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Ut.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function z5(e, t) {
  const { element: n, edge: s } = Qn(), a = ["left", "right"].map((i) => mn(Yv(s, i, e), e)).filter((i) => n && ka(i, e) && !xa(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function V5(e, t, { size: n }) {
  const s = (Ae.right - Ae.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - fi } : e;
}
const fi = 7;
function pi() {
  const e = [...document.querySelectorAll(uv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Qv(e, t) {
  const n = tt(e, t), s = n.right - n.left;
  return { left: n.left + Ae.left * s, right: n.left + Ae.right * s, top: n.top + Ae.top * s, bottom: n.bottom };
}
function ey(e, t) {
  const n = pi();
  return !n || !Zn(Qv(e, t), n);
}
const ty = 4;
function Qn() {
  const e = gn(), t = pi(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > ty || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - fi - n, 0) } };
}
const G5 = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = Mt(), { size: s, below: a } = t, o = pn[e.posture].drop * s;
  return { ...Fv(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Zs = (e, t) => Object.keys(ui).map((n) => mn(Gv(e, n, t), t)), $a = (e, t) => ci(e, xv).map((n) => mn(n, t)), mi = (e, t, n) => sn(e, t, n) ?? e[0];
function K5(e, t) {
  const { element: n, edge: s } = Qn();
  return { ...mi(Zs(s, e), e, t), view: null, on: n };
}
function Y5(e, t, n, s) {
  const { element: a, edge: o } = Qn(), r = (s ? Zs(o, t) : [...Zs(o, t), ...$a(o, t)]).filter(
    (u) => !Zn(tt(u, t), e)
  ), i = sn(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !xa(i, t) ? i : sn(r, t, n);
  return l && { ...l, view: null, on: a };
}
function gn() {
  var s;
  const e = fn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(kv);
  if (!t) return { ...es(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const So = { within: 2 };
function J5(e) {
  const { element: t, docked: n, edge: s } = gn();
  if (!n || e.on !== t) return !0;
  const a = es().edge;
  return s.left > a.left + So.within || s.left + s.width < a.left + a.width - So.within;
}
const ny = "[data-figure-closing]";
function Z5() {
  var n;
  const { element: e, docked: t } = gn();
  return t && !!((n = e.firstElementChild) != null && n.matches(ny));
}
const gi = "[data-figure-progress]";
function X5(e) {
  const t = e.querySelector(gi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Q5(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const sy = { across: 300, above: 380, below: 60 };
function e4(e) {
  const { across: t, above: n, below: s } = sy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: ay(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const ay = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), vi = "[data-figure-bar]", Xs = { back: 144, along: 0.4 };
function t4(e) {
  const { element: t, docked: n, edge: s } = gn(), a = n ? t.querySelector(vi) : null;
  if (!(a != null && a.querySelector(gi))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...mn({ x: o - Xs.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function n4(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < Xs.along * s.size ? t.x + Xs.along * s.size : e.x, y: e.y, behind: !0 };
}
function s4(e) {
  const t = e.querySelector(vi), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const s = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: s, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function es() {
  const e = fn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function a4(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = es(), l = n === null ? oy(i, e, o === null ? t : { x: o, y: i.top }, s, a) : mn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function oy(e, t, n, s, a) {
  const o = $a(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + ot.width < a && l.x + s - ct.reach - ct.room >= r);
  return sn(i.length ? i : o, t, n);
}
const ry = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function o4(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  (o || r) && (a = Math.max(a, ri));
  const y = (V) => {
    const _ = tt(V, n, pn[V.posture].travels);
    return { x: _.left, y: _.top };
  }, T = t.ladder ?? e.ladder;
  if (T && !(t.ladder && e.ladder)) return iy(y(e), y(t), y({ ...T.foot, posture: "stand" }), T.way, !!t.ladder, n, a);
  const [S, ...w] = [e, ...l, t].map(y), x = Pn(S, w[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: v }), M = w.slice(1).map((V, _) => {
    var g;
    return (g = Pn(w[_], V, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : g.legs.find((N) => N.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...M.filter(Boolean)] };
}
function iy(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / ry.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? Pn(e, n, o.size, { pace: r }) : Pn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function r4(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function i4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && sn(zv(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = Qn();
  return { ...mi($a(a, t), t, n), view: null, on: s };
}
const ly = "[data-figure-bubble]", cy = 250;
let zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), yi = 0;
const Dt = () => zt, xs = /* @__PURE__ */ new WeakMap();
let uy = 0;
function Ma(e) {
  return xs.has(e) || xs.set(e, `floor-${++uy}`), xs.get(e);
}
const dy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, hy = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function fy(e, t) {
  var s;
  const n = (s = e.querySelector(bv)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function py(e, t) {
  const n = e && fy(e, t), s = e ? [...e.querySelectorAll(ly)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || dy(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Ma(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const my = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= cy ? (t.top - s.top) / a * 1e3 : 0;
};
function wi(e = zt, t = performance.now()) {
  const n = Mt(), s = hy(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = gn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = es();
  return u.element && l.push({ id: Ma(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...py(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: my(e, d, t) }))) });
}
const Qs = /* @__PURE__ */ new Set();
function gy(e) {
  return Qs.add(e), () => Qs.delete(e);
}
function vy() {
  ki();
  const e = () => {
    yi = requestAnimationFrame(e), !document.hidden && (zt = wi(zt), Qs.forEach((t) => t(zt)));
  };
  e();
}
function ki() {
  cancelAnimationFrame(yi);
}
const _a = 5, yy = 56, wy = { share: 0.6 }, ky = (e) => -Math.sqrt(2 * ga * wy.share * e), Rt = (e, t) => e.find((n) => n.id === t) ?? null;
function l4(e, t = wi().floors) {
  const n = Rt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : Ma(e.on) : null, o = a && Rt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function bi({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Dt().floors) {
  const u = Rt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || by(u, d, o)) && xy(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Sa = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, by = (e, t, n) => !Sa({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function c4(e, t = Dt().floors) {
  if (!Sa(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= _a && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function xy(e, t, n = Dt().floors) {
  const s = Rt(n, "home");
  return e.posture === "hang" && s && tt(e, t).bottom >= s.top ? !1 : ka(e, t);
}
function u4(e, t, n, s = Dt().floors) {
  const a = bi(e, n, s);
  if (!e.home) return $y(e, t, a, s);
  if (!a) return null;
  const o = Rt(s, "home"), r = a.y - t.y, i = r > _a ? "dropping" : -r > yy ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function $y(e, t, n, s) {
  const a = n ? Rt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: ky(e.risen) };
  if (!n) return null;
  if (Sa(t) && n.y - t.y > _a) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function d4(e, t, n) {
  const s = ba * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function h4(e, t, n, s = Dt().floors) {
  const a = t && bi(t, n, s);
  return a ? { ...e, ...a } : e;
}
const My = ["data-kind"], _y = { class: "figure-floor-name" }, Sy = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: me({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", _y, k(e.floor.kind), 1)
    ], 12, My));
  }
}, Ey = /* @__PURE__ */ K(Sy, [["__scopeId", "data-v-8f6132da"]]), Ay = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Cy = {
  __name: "FigureFloors",
  setup(e) {
    const t = Fn(Dt().floors);
    let n = () => {
    };
    return Be(() => {
      n = gy((s) => t.value = s.floors), vy();
    }), Ie(() => {
      n(), ki();
    }), (s, a) => (c(), h("div", Ay, [
      (c(!0), h(Y, null, se(t.value, (o) => (c(), G(Ey, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, f4 = /* @__PURE__ */ K(Cy, [["__scopeId", "data-v-e519168b"]]), $s = (e) => typeof e == "number" ? e : Date.parse(e);
function p4(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: $s(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => $s(a.row.created_at) - $s(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Oy = 3, Ms = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Ty(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Ms[n.grouping]) == null ? void 0 : s.call(Ms, e.row, n)) || "";
}
function Iy(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function m4(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Oy ? [Iy(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = Ty(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Ry = 1e3;
function g4() {
  const e = D(Date.now()), t = setInterval(() => e.value = Date.now(), Ry);
  return Lt(() => clearInterval(t)), e;
}
const v4 = (e) => (t) => t.filter((n) => n.id !== e), y4 = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), w4 = (e) => (t) => [...t, e], k4 = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function b4(e) {
  const t = Hn(), n = D(null), s = D("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const _n = /* @__PURE__ */ new Map();
function By(e, t) {
  if (_n.has(e)) return _n.get(e);
  const n = t().finally(() => _n.delete(e));
  return _n.set(e, n), n;
}
function x4() {
  const e = Hn(), t = D(null), n = D("");
  async function s() {
    const a = await By(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const Ly = { class: "cards-page" }, Dy = { class: "cards-bar" }, Ny = { class: "cards-count" }, Py = { class: "cards" }, jy = {
  key: 1,
  class: "cards-note"
}, qy = {
  key: 2,
  class: "cards-note"
}, Fy = ["data-row", "onClick"], Wy = { class: "card-head" }, Hy = { class: "card-age" }, Uy = { class: "card-title" }, zy = { class: "card-foot" }, Vy = {
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
    return (s, a) => (c(), h("div", Ly, [
      m("div", Dy, [
        m("span", Ny, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        j(ke, ut({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: H(() => [
            j(ye, {
              name: "plus",
              size: 12
            }),
            ce(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", Py, [
        e.loaded ? e.failure ? (c(), h("p", jy, k(e.failure), 1)) : e.rows.length ? E("", !0) : (c(), h("p", qy, "No " + k(e.noun) + "s yet", 1)) : (c(), G(rn, {
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
          m("span", Wy, [
            j(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ce(" " + k(e.head(o)), 1),
            m("span", Hy, k(z(Hs)(o.created_at)), 1)
          ]),
          m("span", Uy, k(e.title(o)), 1),
          m("span", zy, k(e.foot(o)), 1)
        ], 8, Fy))), 128))
      ]),
      he(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, $4 = /* @__PURE__ */ K(Vy, [["__scopeId", "data-v-decaab9b"]]), Eo = "newest";
function M4(e, { title: t, isOpen: n = null }) {
  const s = D(""), a = D(Eo), o = D("all"), r = R(() => {
    const l = s.value.trim().toLowerCase(), u = e.value.filter((d) => (!l || JSON.stringify(d).toLowerCase().includes(l)) && (o.value === "all" || !n || n(d) === (o.value === "open")));
    return a.value === Eo ? u : [...u].sort((d, f) => t(d).localeCompare(t(f)));
  }), i = R(() => !!s.value.trim() || !!n && o.value !== "all");
  return { words: s, order: a, state: o, shown: r, filtering: i, hasStates: !!n };
}
const Gy = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Ky = 40, Yy = "top", Jy = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = Te(Le, null)) == null ? void 0 : f.autoScroll, a = R(() => s === Yy), o = D(null), r = D(!1), i = (v) => a.value ? v.scrollTop : v.scrollHeight - v.scrollTop - v.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= Ky;
    }
    return xe(() => n.rowCount, async () => {
      await on(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (v, y) => (c(), h("div", Gy, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        he(v.$slots, "default", {}, void 0, !0)
      ], 34),
      j(Bt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: H(() => [
          dt(m("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            j(ye, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            y[0] || (y[0] = ce(" Newest ", -1))
          ], 512), [
            [Pi, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, _4 = /* @__PURE__ */ K(Jy, [["__scopeId", "data-v-3accb764"]]), Zy = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, Xy = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Te(Le, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (c(), h("div", Zy, [
      (c(!0), h(Y, null, se(z(s), (i) => {
        var l;
        return c(), G(ke, {
          key: i.key,
          kind: "text",
          class: J(["inner-tab", { on: ((l = e.active) == null ? void 0 : l.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: H(() => [
            ce(k(i.label) + " " + k(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, S4 = /* @__PURE__ */ K(Xy, [["__scopeId", "data-v-cf3bb39f"]]), Qy = {}, ew = { class: "menu-label" };
function tw(e, t) {
  return c(), h("span", ew, [
    he(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ea = /* @__PURE__ */ K(Qy, [["render", tw], ["__scopeId", "data-v-aa955b3e"]]), nw = {
  class: "search-bar",
  "data-search-bar": ""
}, sw = { class: "search-bar-control" }, aw = ["value", "placeholder", "aria-label"], ow = ["aria-expanded"], rw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const s = e, a = n, o = ji(), r = ((x = Te(Le, null)) == null ? void 0 : x.search) ?? {}, i = R(() => r.placeholder || s.placeholder), l = r.context ?? [], u = D(null), d = D(null), f = D([]), v = R(() => f.value.length ? f.value[f.value.length - 1].next : l), y = R(() => !!o.menu || l.length > 0), T = (M) => {
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
    } }), (M, V) => {
      var _;
      return c(), h("div", nw, [
        m("div", sw, [
          j(ye, {
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
            onInput: V[0] || (V[0] = (g) => a("update:modelValue", g.target.value)),
            onKeydown: Vt(w, ["esc"])
          }, null, 40, aw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: w
          }, [
            j(ye, {
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
            onClick: T
          }, [
            j(ye, {
              name: "caret",
              size: 12
            })
          ], 8, ow)) : E("", !0)
        ]),
        (_ = z(r).button) != null && _.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: V[1] || (V[1] = (g) => a("pick", z(r).button.click))
        }, k(z(r).button.title), 1)) : E("", !0),
        he(M.$slots, "default", {}, void 0, !0),
        d.value ? (c(), G(ma, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: V[3] || (V[3] = be(() => {
          }, ["stop"])),
          onClose: V[4] || (V[4] = (g) => d.value = null)
        }, {
          default: H(() => [
            f.value.length ? (c(), G(It, {
              key: 0,
              "data-search-back": "",
              onClick: V[2] || (V[2] = (g) => f.value = f.value.slice(0, -1))
            }, {
              default: H(() => [
                ce("‹ " + k(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : E("", !0),
            (c(!0), h(Y, null, se(v.value, (g) => (c(), G(It, {
              key: g.title,
              description: g.subtext,
              "data-search-entry": g.title,
              onClick: (N) => S(g)
            }, {
              default: H(() => [
                ce(k(g.title) + k(g.next.length ? " ›" : ""), 1)
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
}, iw = /* @__PURE__ */ K(rw, [["__scopeId", "data-v-5904a3de"]]), lw = {
  class: "list-tools",
  "data-list-tools": ""
}, cw = {
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
    return (o, r) => (c(), h("div", lw, [
      j(iw, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": "",
        onPick: r[1] || (r[1] = (i) => n("pick", i))
      }, {
        menu: H(() => [
          j(ea, null, {
            default: H(() => [...r[2] || (r[2] = [
              ce("Order", -1)
            ])]),
            _: 1
          }),
          (c(), h(Y, null, se(s, (i) => j(It, {
            key: i.key,
            checked: e.tools.order.value === i.key,
            "data-list-order": i.key,
            onClick: (l) => e.tools.order.value = i.key
          }, {
            default: H(() => [
              ce(k(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (c(), h(Y, { key: 0 }, [
            j(ea, null, {
              default: H(() => [...r[3] || (r[3] = [
                ce("Show", -1)
              ])]),
              _: 1
            }),
            (c(), h(Y, null, se(a, (i) => j(It, {
              key: i.key,
              checked: e.tools.state.value === i.key,
              "data-list-state": i.key,
              onClick: (l) => e.tools.state.value = i.key
            }, {
              default: H(() => [
                ce(k(i.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : E("", !0)
        ]),
        default: H(() => [
          he(o.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, E4 = /* @__PURE__ */ K(cw, [["__scopeId", "data-v-24c1740c"]]);
function A4() {
  const e = D(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const uw = 86400, ta = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function dw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ta(t) - ta(e)) / uw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function C4(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ta(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: dw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const _s = 280, Ss = 240, Es = 120, hw = 6, fw = 14, an = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function pw(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function xi(e, t) {
  const n = Math.max(0, pw(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function mw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${fw}px)` }), e.offsetHeight, e.style.transition = `height ${_s}ms ${an}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1;
  const u = () => {
    n() && (t.scrollTop = xi(t, e));
    const d = a() - i;
    if (!l && d >= _s && (l = !0, e.style.transition = `opacity ${Ss}ms ease-out, transform ${Ss}ms ${an}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), d < _s + Ss) return s(u);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
function O4(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${hw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Es}ms ease-out, transform ${Es}ms ${an}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = xi(t, e)), a() - r < Es) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const gw = 140, Sn = 220, vw = 5;
function T4({ gap: e = gw, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
    const i = n.splice(0, vw);
    if (s = i.length > 0, !s) return;
    let l = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), l -= 1, l || t(o, e);
      });
  }
  const r = (i, l, u, d = mw) => {
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
function I4(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Sn}ms ${an}, opacity ${Sn}ms ease-in, margin ${Sn}ms ${an}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Sn);
}
const $i = "chat.pins.minimised", Tn = D(Gt($i, !1));
function Ao(e) {
  Tn.value = e, Un($i, e);
}
function yw(e) {
  const t = R(() => e()), n = R(() => Tn.value ? [] : e()), s = () => Ao(!Tn.value), a = Date.now() / 1e3;
  return xe(
    () => t.value.filter((o) => bt(o) > a).length,
    (o, r) => o > r && Ao(!1)
  ), { pins: t, visible: n, minimised: Tn, toggle: s };
}
const ww = ["title"], kw = {
  key: 0,
  class: "pins-count"
}, bw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = yw(() => t.pinRows);
    return (o, r) => z(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = be((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      j(ye, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (c(), h("span", kw, k(z(n).length), 1)) : E("", !0)
    ], 10, ww)) : E("", !0);
  }
}, R4 = /* @__PURE__ */ K(bw, [["__scopeId", "data-v-d073c504"]]), xw = ["title"], $w = ["title"], Mw = { class: "diff-card-dir" }, _w = { class: "diff-card-name" }, Sw = { class: "diff-card-ago" }, Ew = ["title"], Aw = ["title"], Cw = {
  key: 0,
  class: "diff-card-note"
}, Ow = ["href"], Tw = ["src", "alt"], Iw = { class: "diff-card-rows" }, Rw = { class: "diff-row-num" }, Bw = { class: "diff-row-sign" }, Lw = { class: "diff-row-code" }, Dw = {
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
    function o(A) {
      (A.metaKey || A.ctrlKey) && (A.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, l.value)), d = R(() => n.path.slice(l.value)), f = R(() => n.kind === "deleted"), v = R(() => r[n.kind]), y = R(() => new Set(n.rows.filter((A) => A.line_type === "add").map((A) => A.line))), T = D("after"), S = R(() => T.value === "before" ? n.whole.old : n.whole.text), w = R(() => n.whole && n.whole.text !== void 0 ? S.value.split(`
`).map((A, b) => ({ line_type: T.value === "after" && y.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: A })) : n.rows.filter(
      (A) => !(n.editsOnly && ["ctx", "fold"].includes(A.line_type)) && !(n.hideRemovals && A.line_type === "del")
    )), x = D(!1), M = R(() => n.lines && !x.value && !n.whole), V = R(() => M.value ? w.value.slice(0, n.lines) : w.value), _ = R(() => w.value.length - V.value.length), g = (A) => A.line === null || A.line_type === "del" ? "" : A.line, N = (A) => A.line_type === "fold" ? A.hidden ? `⋯ ${A.hidden} lines` : "⋯" : A.text, C = D(null), I = D(null);
    let $ = null;
    return Be(() => {
      if (!I.value) return;
      let A = !0;
      $ = new ResizeObserver(() => {
        !C.value || !I.value || (C.value.style.transition = A ? "none" : "", C.value.style.height = `${I.value.offsetHeight}px`, A = !1);
      }), $.observe(I.value);
    }), Ie(() => $ && $.disconnect()), (A, b) => (c(), h("section", {
      class: J(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (p) => !f.value && s("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${z(a)}-click to open it`,
          onClick: o
        }, [
          m("span", Mw, k(u.value), 1),
          m("span", _w, k(d.value), 1),
          v.value ? (c(), h("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, k(v.value), 3)) : E("", !0)
        ], 8, $w),
        m("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        m("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        m("span", Sw, k(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: T.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = be((p) => T.value = T.value === "after" ? "before" : "after", ["stop"]))
        }, k(T.value === "after" ? "After" : "Before"), 9, Ew)) : E("", !0),
        f.value ? E("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = be((p) => s("whole"), ["stop"]))
        }, [
          j(ye, {
            name: "file",
            size: 12
          })
        ], 10, Aw))
      ], 8, xw),
      e.whole && e.whole.error ? (c(), h("p", Cw, k(e.whole.error), 1)) : E("", !0),
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
          }, null, 8, Tw)
        ], 8, Ow)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: C,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: I,
            class: "diff-card-diff"
          }, [
            m("div", Iw, [
              (c(!0), h(Y, null, se(V.value, (p, B) => (c(), h("div", {
                key: B,
                class: J(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                m("span", Rw, k(g(p)), 1),
                m("span", Bw, k(i[p.line_type]), 1),
                m("span", Lw, k(N(p)), 1)
              ], 2))), 128)),
              _.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = be((p) => x.value = !0, ["stop"]))
              }, k(_.value) + " more " + k(_.value === 1 ? "line" : "lines"), 1)) : E("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : E("", !0)
    ], 2));
  }
}, B4 = /* @__PURE__ */ K(Dw, [["__scopeId", "data-v-b6424f6e"]]), Nw = {
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
      default: H(() => [
        j(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Ye = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Pw = {
  draft: [{ word: "ready", label: "Mark ready" }, Ye],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Ye],
  approved: [{ word: "start", label: "Start", main: !0 }, Ye],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ye],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ye],
  completed: [],
  cancelled: []
}, jw = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Ye],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Ye],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, Ye],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ye],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, qw = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Fw = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], Ww = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Hw = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Uw = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], zw = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? Uw(t) : e === "agent" ? [...Ww(t), ...Fw(t)] : e === "check" ? Hw(t) : e === "question" ? qw(t) : ((n = { plan: Pw, task: jw }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, Vw = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Gw = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Kw = { class: "ask-text" }, Yw = ["placeholder", "aria-label"], Jw = ["placeholder", "aria-label"], Zw = {
  key: 3,
  class: "moves"
}, Xw = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = R(() => zw(s.kind, s.row)), r = D(""), i = D(null), l = D(""), u = D("");
    xe(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(y, T = "") {
      const S = await s.read([y.noun ?? s.kind, y.word, String(s.id), ...y.flag ? [y.flag, T] : y.positional ? [T] : [], ...y.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = S.ok ? "" : S.error, S.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (y) => y.confirm ? i.value = y : y.said ? d(y, y.said) : y.flag || y.positional ? (i.value = y, l.value = "") : d(y), v = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (y, T) => {
      var S;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", Vw, k(r.value), 1)) : E("", !0),
        (S = i.value) != null && S.confirm ? (c(), h("div", Gw, [
          m("span", Kw, k(i.value.confirm), 1),
          j(ke, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: T[0] || (T[0] = (w) => d(i.value))
          }, {
            default: H(() => [
              ce(k(i.value.label), 1)
            ]),
            _: 1
          }),
          j(ke, {
            small: "",
            kind: "ghost",
            onClick: T[1] || (T[1] = (w) => i.value = null)
          }, {
            default: H(() => [...T[7] || (T[7] = [
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
          dt(m("input", {
            "onUpdate:modelValue": T[2] || (T[2] = (w) => l.value = w),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: T[3] || (T[3] = Vt(be((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, Yw), [
            [Ts, l.value]
          ]),
          i.value.opener ? dt((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": T[4] || (T[4] = (w) => u.value = w),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: T[5] || (T[5] = Vt(be((w) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, Jw)), [
            [Ts, u.value]
          ]) : E("", !0),
          j(ke, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: H(() => [
              ce(k(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          j(ke, {
            small: "",
            kind: "ghost",
            onClick: T[6] || (T[6] = (w) => i.value = null)
          }, {
            default: H(() => [...T[8] || (T[8] = [
              ce("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Zw, [
          (c(!0), h(Y, null, se(o.value, (w) => (c(), G(ke, {
            key: w.word,
            small: "",
            kind: w.main ? "primary" : "ghost",
            "data-move": w.word,
            onClick: (x) => f(w)
          }, {
            default: H(() => [
              ce(k(w.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : E("", !0);
    };
  }
}, Qw = /* @__PURE__ */ K(Xw, [["__scopeId", "data-v-fffa0bf6"]]), e2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, t2 = { ...e2, done: "Completed" }, n2 = { class: "task-status-icon" }, s2 = ["width", "height", "aria-label"], a2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", n2, [
      j(Bt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: H(() => [
          (c(), h("svg", {
            key: e.status,
            class: J(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": z(t2)[e.status]
          }, [
            j(Wn, { value: e.status }, {
              blocked: H(() => [...n[0] || (n[0] = [
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
              done: H(() => [...n[1] || (n[1] = [
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
              started: H(() => [...n[2] || (n[2] = [
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
              asked: H(() => [...n[3] || (n[3] = [
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
              paused: H(() => [...n[4] || (n[4] = [
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
              planned: H(() => [...n[5] || (n[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: H(() => [...n[6] || (n[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, s2))
        ]),
        _: 1
      })
    ]));
  }
}, Mi = /* @__PURE__ */ K(a2, [["__scopeId", "data-v-2ab7e404"]]), o2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), r2 = (e) => o2.has(e), _i = (e) => r2(e) ? "done" : e, i2 = { class: "facts" }, l2 = { class: "fact wide" }, c2 = { class: "fact-value" }, u2 = {
  key: 0,
  class: "fact"
}, d2 = { class: "fact-value" }, h2 = {
  key: 1,
  class: "fact"
}, f2 = { class: "fact-value" }, p2 = { class: "fact wide" }, m2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, g2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Ln.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return c(), h("div", i2, [
        m("div", l2, [
          o[1] || (o[1] = m("span", { class: "fact-label" }, "Plan", -1)),
          m("span", c2, k((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", u2, [
          o[2] || (o[2] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", d2, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : E("", !0),
        e.task.state === "started" && e.task.holder_id ? (c(), h("div", h2, [
          o[3] || (o[3] = m("span", { class: "fact-label" }, "Holder", -1)),
          m("span", f2, "Agent " + k(e.task.holder_id), 1)
        ])) : E("", !0),
        m("div", p2, [
          o[4] || (o[4] = m("span", { class: "fact-label" }, "Priority", -1)),
          j(A1, {
            options: z(n),
            value: String(z(Sr)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (l) => s("priority", l))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", m2, k(e.refusal), 1)) : E("", !0)
        ])
      ]);
    };
  }
}, v2 = /* @__PURE__ */ K(g2, [["__scopeId", "data-v-2018762d"]]), y2 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, w2 = ["onClick"], k2 = { class: "wait-id" }, b2 = { class: "wait-title" }, x2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, $2 = { class: "text" }, M2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, _2 = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, S2 = 180, E2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = D(!1);
    return (a, o) => (c(), h(Y, null, [
      e.task.waits.length ? (c(), h("section", y2, [
        o[1] || (o[1] = m("h4", null, "Waits on", -1)),
        (c(!0), h(Y, null, se(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          j(Mi, {
            status: z(_i)(r.state),
            size: 12
          }, null, 8, ["status"]),
          m("span", k2, k(r.id), 1),
          m("span", b2, k(r.title), 1)
        ], 8, w2))), 128))
      ])) : E("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", x2, [
        o[2] || (o[2] = m("h4", null, "How it was done", -1)),
        m("p", $2, k(e.task.outcome), 1)
      ])) : E("", !0),
      e.task.brief ? (c(), h("section", M2, [
        o[3] || (o[3] = m("h4", null, "The brief", -1)),
        m("p", {
          class: J(["text", { clamped: !s.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > S2 && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : E("", !0)
      ])) : E("", !0),
      e.task.logs.length ? (c(), h("section", _2, [
        o[4] || (o[4] = m("h4", null, "Log", -1)),
        (c(!0), h(Y, null, se(e.task.logs, (r) => (c(), h("p", {
          key: r.id,
          class: "log"
        }, k(r.line), 1))), 128))
      ])) : E("", !0)
    ], 64));
  }
}, A2 = /* @__PURE__ */ K(E2, [["__scopeId", "data-v-f411ce35"]]), C2 = { class: "comment-side-head" }, O2 = {
  key: 0,
  class: "comment-none"
}, T2 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", C2, [
        n[1] || (n[1] = m("h3", null, "Comments", -1)),
        j(Gn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? E("", !0) : (c(), h("p", O2, "No comments yet")),
      (c(!0), h(Y, null, se(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, k(e.words(s)), 1))), 128))
    ], 2));
  }
}, I2 = /* @__PURE__ */ K(T2, [["__scopeId", "data-v-19fdbdd4"]]), R2 = ["data-comments-below"], B2 = 600, L2 = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, stacked: Boolean },
  emits: ["close"],
  setup(e) {
    const t = e, n = D(null), s = D(!1), a = R(() => t.stacked || s.value), o = new ResizeObserver(([r]) => s.value = r.contentRect.width < B2);
    return Be(() => o.observe(n.value)), Lt(() => o.disconnect()), (r, i) => (c(), h("div", {
      ref_key: "root",
      ref: n,
      class: J(["commented-row", { below: a.value }]),
      "data-comments-below": a.value || null
    }, [
      he(r.$slots, "default"),
      e.open ? (c(), G(I2, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: a.value,
        onClose: i[0] || (i[0] = (l) => r.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : E("", !0)
    ], 10, R2));
  }
}, D2 = /* @__PURE__ */ K(L2, [["__scopeId", "data-v-301b4377"]]), N2 = ["placeholder"], P2 = { class: "actions" }, j2 = { class: "error" }, q2 = {
  key: 1,
  class: "card closed"
}, F2 = { class: "mark" }, W2 = { class: "prompt" }, H2 = {
  key: 0,
  class: "draft"
}, U2 = {
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
      S.shiftKey || S.isComposing || (S.preventDefault(), T());
    }
    async function T() {
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
        onSubmit: be(T, ["prevent"]),
        onKeydown: Vt(v, ["esc"])
      }, [
        he(S.$slots, "who", {}, void 0, !0),
        dt(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": w[0] || (w[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Vt(y, ["enter"])
        }, null, 40, N2), [
          [Ts, o.value]
        ]),
        m("div", P2, [
          m("span", j2, k(r.value), 1),
          j(ke, {
            small: "",
            onClick: v
          }, {
            default: H(() => [...w[2] || (w[2] = [
              ce("Cancel", -1)
            ])]),
            _: 1
          }),
          j(ke, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: T
          }, {
            default: H(() => [...w[3] || (w[3] = [
              ce("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", q2, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          m("span", F2, [
            j(ye, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", W2, k(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", H2, "Draft kept")) : E("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[1] || (w[1] = (x) => a("show"))
        }, [
          m("span", null, k(z(Y1)(e.count, "comment")), 1),
          j(ye, {
            name: "down",
            size: 12
          })
        ])) : E("", !0)
      ]))
    ], 2));
  }
}, z2 = /* @__PURE__ */ K(U2, [["__scopeId", "data-v-79db0c2d"]]);
function V2(e, t) {
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
      throw n.value = n.value.filter((T) => T !== v && T.id !== v.id), new Error(y.error);
    await i();
  }
  return xe(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const G2 = { class: "top" }, K2 = {
  class: "crumb",
  "data-task-crumb": ""
}, Y2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, J2 = {
  key: 1,
  class: "body"
}, Z2 = { class: "stamp" }, X2 = {
  class: "title",
  "data-resource-title": ""
}, Q2 = { class: "since" }, ek = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, tk = { class: "text" }, nk = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, sk = {
  key: 1,
  class: "note"
}, ak = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, ok = { class: "text" }, rk = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = D(null), r = D(null), i = D(""), l = D(""), u = D(null), d = D(null), f = V2(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (_) => s.read(_));
    let v = 0;
    const y = _i, T = (_) => _.slice(0, 1).toUpperCase() + _.slice(1), S = R(() => {
      var _;
      return (_ = r.value) != null && _.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function w() {
      const _ = ++v, [g, N] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      _ === v && (i.value = g.ok ? "" : g.error, o.value = g.ok ? g.value : null, r.value = N.ok ? N.value : null);
    }
    xe(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, w();
    }, { immediate: !0 }), xe(() => s.changes, w);
    async function x(_) {
      const g = o.value.priority;
      o.value.priority = Number(_);
      const N = await s.read(["task", "edit", String(s.id), "--priority", _]);
      if (l.value = N.ok ? "" : N.error, N.ok) return w();
      o.value.priority = g;
    }
    function M(_) {
      u.value = null, d.value.press(_);
    }
    const V = (_) => {
      var g;
      return ((g = d.value) == null ? void 0 : g.moves.length) && (u.value = _);
    };
    return t({ openStatus: V }), (_, g) => (c(), h("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      m("div", G2, [
        e.backed ? (c(), G(Nw, {
          key: 0,
          onBack: g[0] || (g[0] = (N) => a("back"))
        })) : E("", !0),
        m("span", K2, k(S.value), 1),
        g[9] || (g[9] = m("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(Y, { key: 1 }, [
          j(ke, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: g[1] || (g[1] = (N) => a("step", -1))
          }, {
            default: H(() => [
              j(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          j(ke, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: g[2] || (g[2] = (N) => a("step", 1))
          }, {
            default: H(() => [
              j(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : E("", !0),
        j(ke, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: g[3] || (g[3] = (N) => a("close"))
        }, {
          default: H(() => [
            j(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", Y2, k(i.value), 1)) : o.value ? (c(), h(Y, { key: 2 }, [
        j(D2, {
          stacked: "",
          open: z(f).open.value,
          comments: z(f).comments.value,
          words: z(f).words,
          onClose: g[6] || (g[6] = (N) => z(f).open.value = !1)
        }, {
          default: H(() => {
            var N;
            return [
              (c(), h("div", {
                key: o.value.id,
                class: "body"
              }, [
                m("div", Z2, "Task " + k(o.value.id) + " · updated " + k(z(Hs)(z(Ls)(o.value)) || "just now"), 1),
                m("h3", X2, k(o.value.title), 1),
                m("div", {
                  class: J(["state-line", z(y)(o.value.state)])
                }, [
                  m("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: g[4] || (g[4] = (C) => V(C.currentTarget))
                  }, [
                    j(Mi, {
                      status: z(y)(o.value.state)
                    }, null, 8, ["status"]),
                    ce(" " + k(T(o.value.state)), 1)
                  ]),
                  m("span", Q2, "since " + k(z(Hs)(z(Ls)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (c(), h("section", ek, [
                  g[10] || (g[10] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
                  m("p", tk, k(o.value.reason || "Other tasks"), 1),
                  (N = o.value.openers) != null && N.length ? (c(), h("p", nk, "Opens by itself when " + k(o.value.openers.join(" or ")) + ".", 1)) : (c(), h("p", sk, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (c(), h("section", ak, [
                  g[11] || (g[11] = m("span", { class: "label" }, "Why it was cancelled", -1)),
                  m("p", ok, k(o.value.reason), 1)
                ])) : E("", !0),
                j(v2, {
                  task: o.value,
                  place: r.value,
                  refusal: l.value,
                  onPriority: x
                }, null, 8, ["task", "place", "refusal"]),
                j(A2, {
                  task: o.value,
                  onSelect: g[5] || (g[5] = (C) => a("select", C))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        j(z2, {
          send: z(f).send,
          count: z(f).comments.value.length,
          onShow: g[7] || (g[7] = (N) => z(f).open.value = !z(f).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", J2, [
        j(rn)
      ])),
      j(Qw, {
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
        onClose: g[8] || (g[8] = (N) => u.value = null)
      }, {
        default: H(() => [
          j(ea, null, {
            default: H(() => [
              ce("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(Y, null, se(d.value.moves, (N) => (c(), G(It, {
            key: N.word,
            onClick: (C) => M(N)
          }, {
            default: H(() => [
              ce(k(N.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : E("", !0)
    ], 2));
  }
}, L4 = /* @__PURE__ */ K(rk, [["__scopeId", "data-v-eee5a443"]]);
function ik(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var As = { exports: {} }, Co;
function lk() {
  return Co || (Co = 1, (function(e, t) {
    var n = (function() {
      var s = function(g, N) {
        var C = 236, I = 17, $ = g, A = o[N], b = null, p = 0, B = null, L = [], F = {}, re = function(P, q) {
          p = $ * 4 + 17, b = (function(O) {
            for (var W = new Array(O), U = 0; U < O; U += 1) {
              W[U] = new Array(O);
              for (var X = 0; X < O; X += 1)
                W[U][X] = null;
            }
            return W;
          })(p), le(0, 0), le(p - 7, 0), le(0, p - 7), ee(), Q(), De(P, q), $ >= 7 && Z(P), B == null && (B = Si($, A, L)), Ve(B, q);
        }, le = function(P, q) {
          for (var O = -1; O <= 7; O += 1)
            if (!(P + O <= -1 || p <= P + O))
              for (var W = -1; W <= 7; W += 1)
                q + W <= -1 || p <= q + W || (0 <= O && O <= 6 && (W == 0 || W == 6) || 0 <= W && W <= 6 && (O == 0 || O == 6) || 2 <= O && O <= 4 && 2 <= W && W <= 4 ? b[P + O][q + W] = !0 : b[P + O][q + W] = !1);
        }, de = function() {
          for (var P = 0, q = 0, O = 0; O < 8; O += 1) {
            re(!0, O);
            var W = i.getLostPoint(F);
            (O == 0 || P > W) && (P = W, q = O);
          }
          return q;
        }, Q = function() {
          for (var P = 8; P < p - 8; P += 1)
            b[P][6] == null && (b[P][6] = P % 2 == 0);
          for (var q = 8; q < p - 8; q += 1)
            b[6][q] == null && (b[6][q] = q % 2 == 0);
        }, ee = function() {
          for (var P = i.getPatternPosition($), q = 0; q < P.length; q += 1)
            for (var O = 0; O < P.length; O += 1) {
              var W = P[q], U = P[O];
              if (b[W][U] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? b[W + X][U + ae] = !0 : b[W + X][U + ae] = !1;
            }
        }, Z = function(P) {
          for (var q = i.getBCHTypeNumber($), O = 0; O < 18; O += 1) {
            var W = !P && (q >> O & 1) == 1;
            b[Math.floor(O / 3)][O % 3 + p - 8 - 3] = W;
          }
          for (var O = 0; O < 18; O += 1) {
            var W = !P && (q >> O & 1) == 1;
            b[O % 3 + p - 8 - 3][Math.floor(O / 3)] = W;
          }
        }, De = function(P, q) {
          for (var O = A << 3 | q, W = i.getBCHTypeInfo(O), U = 0; U < 15; U += 1) {
            var X = !P && (W >> U & 1) == 1;
            U < 6 ? b[U][8] = X : U < 8 ? b[U + 1][8] = X : b[p - 15 + U][8] = X;
          }
          for (var U = 0; U < 15; U += 1) {
            var X = !P && (W >> U & 1) == 1;
            U < 8 ? b[8][p - U - 1] = X : U < 9 ? b[8][15 - U - 1 + 1] = X : b[8][15 - U - 1] = X;
          }
          b[p - 8][8] = !P;
        }, Ve = function(P, q) {
          for (var O = -1, W = p - 1, U = 7, X = 0, ae = i.getMaskFunction(q), ne = p - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (b[W][ne - we] == null) {
                  var Me = !1;
                  X < P.length && (Me = (P[X] >>> U & 1) == 1);
                  var ie = ae(W, ne - we);
                  ie && (Me = !Me), b[W][ne - we] = Me, U -= 1, U == -1 && (X += 1, U = 7);
                }
              if (W += O, W < 0 || p <= W) {
                W -= O, O = -O;
                break;
              }
            }
        }, _t = function(P, q) {
          for (var O = 0, W = 0, U = 0, X = new Array(q.length), ae = new Array(q.length), ne = 0; ne < q.length; ne += 1) {
            var we = q[ne].dataCount, Me = q[ne].totalCount - we;
            W = Math.max(W, we), U = Math.max(U, Me), X[ne] = new Array(we);
            for (var ie = 0; ie < X[ne].length; ie += 1)
              X[ne][ie] = 255 & P.getBuffer()[ie + O];
            O += we;
            var Ne = i.getErrorCorrectPolynomial(Me), Pe = u(X[ne], Ne.getLength() - 1), Ea = Pe.mod(Ne);
            ae[ne] = new Array(Ne.getLength() - 1);
            for (var ie = 0; ie < ae[ne].length; ie += 1) {
              var Aa = ie + Ea.getLength() - ae[ne].length;
              ae[ne][ie] = Aa >= 0 ? Ea.getAt(Aa) : 0;
            }
          }
          for (var Ca = 0, ie = 0; ie < q.length; ie += 1)
            Ca += q[ie].totalCount;
          for (var ts = new Array(Ca), vn = 0, ie = 0; ie < W; ie += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              ie < X[ne].length && (ts[vn] = X[ne][ie], vn += 1);
          for (var ie = 0; ie < U; ie += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              ie < ae[ne].length && (ts[vn] = ae[ne][ie], vn += 1);
          return ts;
        }, Si = function(P, q, O) {
          for (var W = d.getRSBlocks(P, q), U = f(), X = 0; X < O.length; X += 1) {
            var ae = O[X];
            U.put(ae.getMode(), 4), U.put(ae.getLength(), i.getLengthInBits(ae.getMode(), P)), ae.write(U);
          }
          for (var ne = 0, X = 0; X < W.length; X += 1)
            ne += W[X].dataCount;
          if (U.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + U.getLengthInBits() + ">" + ne * 8 + ")";
          for (U.getLengthInBits() + 4 <= ne * 8 && U.put(0, 4); U.getLengthInBits() % 8 != 0; )
            U.putBit(!1);
          for (; !(U.getLengthInBits() >= ne * 8 || (U.put(C, 8), U.getLengthInBits() >= ne * 8)); )
            U.put(I, 8);
          return _t(U, W);
        };
        F.addData = function(P, q) {
          q = q || "Byte";
          var O = null;
          switch (q) {
            case "Numeric":
              O = v(P);
              break;
            case "Alphanumeric":
              O = y(P);
              break;
            case "Byte":
              O = T(P);
              break;
            case "Kanji":
              O = S(P);
              break;
            default:
              throw "mode:" + q;
          }
          L.push(O), B = null;
        }, F.isDark = function(P, q) {
          if (P < 0 || p <= P || q < 0 || p <= q)
            throw P + "," + q;
          return b[P][q];
        }, F.getModuleCount = function() {
          return p;
        }, F.make = function() {
          if ($ < 1) {
            for (var P = 1; P < 40; P++) {
              for (var q = d.getRSBlocks(P, A), O = f(), W = 0; W < L.length; W++) {
                var U = L[W];
                O.put(U.getMode(), 4), O.put(U.getLength(), i.getLengthInBits(U.getMode(), P)), U.write(O);
              }
              for (var X = 0, W = 0; W < q.length; W++)
                X += q[W].dataCount;
              if (O.getLengthInBits() <= X * 8)
                break;
            }
            $ = P;
          }
          re(!1, de());
        }, F.createTableTag = function(P, q) {
          P = P || 2, q = typeof q > "u" ? P * 4 : q;
          var O = "";
          O += '<table style="', O += " border-width: 0px; border-style: none;", O += " border-collapse: collapse;", O += " padding: 0px; margin: " + q + "px;", O += '">', O += "<tbody>";
          for (var W = 0; W < F.getModuleCount(); W += 1) {
            O += "<tr>";
            for (var U = 0; U < F.getModuleCount(); U += 1)
              O += '<td style="', O += " border-width: 0px; border-style: none;", O += " border-collapse: collapse;", O += " padding: 0px; margin: 0px;", O += " width: " + P + "px;", O += " height: " + P + "px;", O += " background-color: ", O += F.isDark(W, U) ? "#000000" : "#ffffff", O += ";", O += '"/>';
            O += "</tr>";
          }
          return O += "</tbody>", O += "</table>", O;
        }, F.createSvgTag = function(P, q, O, W) {
          var U = {};
          typeof arguments[0] == "object" && (U = arguments[0], P = U.cellSize, q = U.margin, O = U.alt, W = U.title), P = P || 2, q = typeof q > "u" ? P * 4 : q, O = typeof O == "string" ? { text: O } : O || {}, O.text = O.text || null, O.id = O.text ? O.id || "qrcode-description" : null, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-title" : null;
          var X = F.getModuleCount() * P + q * 2, ae, ne, we, Me, ie = "", Ne;
          for (Ne = "l" + P + ",0 0," + P + " -" + P + ",0 0,-" + P + "z ", ie += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ie += U.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ie += ' viewBox="0 0 ' + X + " " + X + '" ', ie += ' preserveAspectRatio="xMinYMin meet"', ie += W.text || O.text ? ' role="img" aria-labelledby="' + St([W.id, O.id].join(" ").trim()) + '"' : "", ie += ">", ie += W.text ? '<title id="' + St(W.id) + '">' + St(W.text) + "</title>" : "", ie += O.text ? '<description id="' + St(O.id) + '">' + St(O.text) + "</description>" : "", ie += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ie += '<path d="', we = 0; we < F.getModuleCount(); we += 1)
            for (Me = we * P + q, ae = 0; ae < F.getModuleCount(); ae += 1)
              F.isDark(we, ae) && (ne = ae * P + q, ie += "M" + ne + "," + Me + Ne);
          return ie += '" stroke="transparent" fill="black"/>', ie += "</svg>", ie;
        }, F.createDataURL = function(P, q) {
          P = P || 2, q = typeof q > "u" ? P * 4 : q;
          var O = F.getModuleCount() * P + q * 2, W = q, U = O - q;
          return _(O, O, function(X, ae) {
            if (W <= X && X < U && W <= ae && ae < U) {
              var ne = Math.floor((X - W) / P), we = Math.floor((ae - W) / P);
              return F.isDark(we, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, F.createImgTag = function(P, q, O) {
          P = P || 2, q = typeof q > "u" ? P * 4 : q;
          var W = F.getModuleCount() * P + q * 2, U = "";
          return U += "<img", U += ' src="', U += F.createDataURL(P, q), U += '"', U += ' width="', U += W, U += '"', U += ' height="', U += W, U += '"', O && (U += ' alt="', U += St(O), U += '"'), U += "/>", U;
        };
        var St = function(P) {
          for (var q = "", O = 0; O < P.length; O += 1) {
            var W = P.charAt(O);
            switch (W) {
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
                q += W;
                break;
            }
          }
          return q;
        }, Ei = function(P) {
          var q = 1;
          P = typeof P > "u" ? q * 2 : P;
          var O = F.getModuleCount() * q + P * 2, W = P, U = O - P, X, ae, ne, we, Me, ie = {
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
          for (X = 0; X < O; X += 2) {
            for (ne = Math.floor((X - W) / q), we = Math.floor((X + 1 - W) / q), ae = 0; ae < O; ae += 1)
              Me = "█", W <= ae && ae < U && W <= X && X < U && F.isDark(ne, Math.floor((ae - W) / q)) && (Me = " "), W <= ae && ae < U && W <= X + 1 && X + 1 < U && F.isDark(we, Math.floor((ae - W) / q)) ? Me += " " : Me += "█", Pe += P < 1 && X + 1 >= U ? Ne[Me] : ie[Me];
            Pe += `
`;
          }
          return O % 2 && P > 0 ? Pe.substring(0, Pe.length - O - 1) + Array(O + 1).join("▀") : Pe.substring(0, Pe.length - 1);
        };
        return F.createASCII = function(P, q) {
          if (P = P || 1, P < 2)
            return Ei(q);
          P -= 1, q = typeof q > "u" ? P * 2 : q;
          var O = F.getModuleCount() * P + q * 2, W = q, U = O - q, X, ae, ne, we, Me = Array(P + 1).join("██"), ie = Array(P + 1).join("  "), Ne = "", Pe = "";
          for (X = 0; X < O; X += 1) {
            for (ne = Math.floor((X - W) / P), Pe = "", ae = 0; ae < O; ae += 1)
              we = 1, W <= ae && ae < U && W <= X && X < U && F.isDark(ne, Math.floor((ae - W) / P)) && (we = 0), Pe += we ? Me : ie;
            for (ne = 0; ne < P; ne += 1)
              Ne += Pe + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, F.renderTo2dContext = function(P, q) {
          q = q || 2;
          for (var O = F.getModuleCount(), W = 0; W < O; W++)
            for (var U = 0; U < O; U++)
              P.fillStyle = F.isDark(W, U) ? "black" : "white", P.fillRect(W * q, U * q, q, q);
        }, F;
      };
      s.stringToBytesFuncs = {
        default: function(g) {
          for (var N = [], C = 0; C < g.length; C += 1) {
            var I = g.charCodeAt(C);
            N.push(I & 255);
          }
          return N;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(g, N) {
        var C = (function() {
          for (var $ = M(g), A = function() {
            var Q = $.read();
            if (Q == -1) throw "eof";
            return Q;
          }, b = 0, p = {}; ; ) {
            var B = $.read();
            if (B == -1) break;
            var L = A(), F = A(), re = A(), le = String.fromCharCode(B << 8 | L), de = F << 8 | re;
            p[le] = de, b += 1;
          }
          if (b != N)
            throw b + " != " + N;
          return p;
        })(), I = 63;
        return function($) {
          for (var A = [], b = 0; b < $.length; b += 1) {
            var p = $.charCodeAt(b);
            if (p < 128)
              A.push(p);
            else {
              var B = C[$.charAt(b)];
              typeof B == "number" ? (B & 255) == B ? A.push(B) : (A.push(B >>> 8), A.push(B & 255)) : A.push(I);
            }
          }
          return A;
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
        ], N = 1335, C = 7973, I = 21522, $ = {}, A = function(b) {
          for (var p = 0; b != 0; )
            p += 1, b >>>= 1;
          return p;
        };
        return $.getBCHTypeInfo = function(b) {
          for (var p = b << 10; A(p) - A(N) >= 0; )
            p ^= N << A(p) - A(N);
          return (b << 10 | p) ^ I;
        }, $.getBCHTypeNumber = function(b) {
          for (var p = b << 12; A(p) - A(C) >= 0; )
            p ^= C << A(p) - A(C);
          return b << 12 | p;
        }, $.getPatternPosition = function(b) {
          return g[b - 1];
        }, $.getMaskFunction = function(b) {
          switch (b) {
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
              throw "bad maskPattern:" + b;
          }
        }, $.getErrorCorrectPolynomial = function(b) {
          for (var p = u([1], 0), B = 0; B < b; B += 1)
            p = p.multiply(u([1, l.gexp(B)], 0));
          return p;
        }, $.getLengthInBits = function(b, p) {
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
        }, $.getLostPoint = function(b) {
          for (var p = b.getModuleCount(), B = 0, L = 0; L < p; L += 1)
            for (var F = 0; F < p; F += 1) {
              for (var re = 0, le = b.isDark(L, F), de = -1; de <= 1; de += 1)
                if (!(L + de < 0 || p <= L + de))
                  for (var Q = -1; Q <= 1; Q += 1)
                    F + Q < 0 || p <= F + Q || de == 0 && Q == 0 || le == b.isDark(L + de, F + Q) && (re += 1);
              re > 5 && (B += 3 + re - 5);
            }
          for (var L = 0; L < p - 1; L += 1)
            for (var F = 0; F < p - 1; F += 1) {
              var ee = 0;
              b.isDark(L, F) && (ee += 1), b.isDark(L + 1, F) && (ee += 1), b.isDark(L, F + 1) && (ee += 1), b.isDark(L + 1, F + 1) && (ee += 1), (ee == 0 || ee == 4) && (B += 3);
            }
          for (var L = 0; L < p; L += 1)
            for (var F = 0; F < p - 6; F += 1)
              b.isDark(L, F) && !b.isDark(L, F + 1) && b.isDark(L, F + 2) && b.isDark(L, F + 3) && b.isDark(L, F + 4) && !b.isDark(L, F + 5) && b.isDark(L, F + 6) && (B += 40);
          for (var F = 0; F < p; F += 1)
            for (var L = 0; L < p - 6; L += 1)
              b.isDark(L, F) && !b.isDark(L + 1, F) && b.isDark(L + 2, F) && b.isDark(L + 3, F) && b.isDark(L + 4, F) && !b.isDark(L + 5, F) && b.isDark(L + 6, F) && (B += 40);
          for (var Z = 0, F = 0; F < p; F += 1)
            for (var L = 0; L < p; L += 1)
              b.isDark(L, F) && (Z += 1);
          var De = Math.abs(100 * Z / p / p - 50) / 5;
          return B += De * 10, B;
        }, $;
      })(), l = (function() {
        for (var g = new Array(256), N = new Array(256), C = 0; C < 8; C += 1)
          g[C] = 1 << C;
        for (var C = 8; C < 256; C += 1)
          g[C] = g[C - 4] ^ g[C - 5] ^ g[C - 6] ^ g[C - 8];
        for (var C = 0; C < 255; C += 1)
          N[g[C]] = C;
        var I = {};
        return I.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return N[$];
        }, I.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return g[$];
        }, I;
      })();
      function u(g, N) {
        if (typeof g.length > "u")
          throw g.length + "/" + N;
        var C = (function() {
          for (var $ = 0; $ < g.length && g[$] == 0; )
            $ += 1;
          for (var A = new Array(g.length - $ + N), b = 0; b < g.length - $; b += 1)
            A[b] = g[b + $];
          return A;
        })(), I = {};
        return I.getAt = function($) {
          return C[$];
        }, I.getLength = function() {
          return C.length;
        }, I.multiply = function($) {
          for (var A = new Array(I.getLength() + $.getLength() - 1), b = 0; b < I.getLength(); b += 1)
            for (var p = 0; p < $.getLength(); p += 1)
              A[b + p] ^= l.gexp(l.glog(I.getAt(b)) + l.glog($.getAt(p)));
          return u(A, 0);
        }, I.mod = function($) {
          if (I.getLength() - $.getLength() < 0)
            return I;
          for (var A = l.glog(I.getAt(0)) - l.glog($.getAt(0)), b = new Array(I.getLength()), p = 0; p < I.getLength(); p += 1)
            b[p] = I.getAt(p);
          for (var p = 0; p < $.getLength(); p += 1)
            b[p] ^= l.gexp(l.glog($.getAt(p)) + A);
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
        ], N = function($, A) {
          var b = {};
          return b.totalCount = $, b.dataCount = A, b;
        }, C = {}, I = function($, A) {
          switch (A) {
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
        return C.getRSBlocks = function($, A) {
          var b = I($, A);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + A;
          for (var p = b.length / 3, B = [], L = 0; L < p; L += 1)
            for (var F = b[L * 3 + 0], re = b[L * 3 + 1], le = b[L * 3 + 2], de = 0; de < F; de += 1)
              B.push(N(re, le));
          return B;
        }, C;
      })(), f = function() {
        var g = [], N = 0, C = {};
        return C.getBuffer = function() {
          return g;
        }, C.getAt = function(I) {
          var $ = Math.floor(I / 8);
          return (g[$] >>> 7 - I % 8 & 1) == 1;
        }, C.put = function(I, $) {
          for (var A = 0; A < $; A += 1)
            C.putBit((I >>> $ - A - 1 & 1) == 1);
        }, C.getLengthInBits = function() {
          return N;
        }, C.putBit = function(I) {
          var $ = Math.floor(N / 8);
          g.length <= $ && g.push(0), I && (g[$] |= 128 >>> N % 8), N += 1;
        }, C;
      }, v = function(g) {
        var N = a.MODE_NUMBER, C = g, I = {};
        I.getMode = function() {
          return N;
        }, I.getLength = function(b) {
          return C.length;
        }, I.write = function(b) {
          for (var p = C, B = 0; B + 2 < p.length; )
            b.put($(p.substring(B, B + 3)), 10), B += 3;
          B < p.length && (p.length - B == 1 ? b.put($(p.substring(B, B + 1)), 4) : p.length - B == 2 && b.put($(p.substring(B, B + 2)), 7));
        };
        var $ = function(b) {
          for (var p = 0, B = 0; B < b.length; B += 1)
            p = p * 10 + A(b.charAt(B));
          return p;
        }, A = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return I;
      }, y = function(g) {
        var N = a.MODE_ALPHA_NUM, C = g, I = {};
        I.getMode = function() {
          return N;
        }, I.getLength = function(A) {
          return C.length;
        }, I.write = function(A) {
          for (var b = C, p = 0; p + 1 < b.length; )
            A.put(
              $(b.charAt(p)) * 45 + $(b.charAt(p + 1)),
              11
            ), p += 2;
          p < b.length && A.put($(b.charAt(p)), 6);
        };
        var $ = function(A) {
          if ("0" <= A && A <= "9")
            return A.charCodeAt(0) - 48;
          if ("A" <= A && A <= "Z")
            return A.charCodeAt(0) - 65 + 10;
          switch (A) {
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
              throw "illegal char :" + A;
          }
        };
        return I;
      }, T = function(g) {
        var N = a.MODE_8BIT_BYTE, C = s.stringToBytes(g), I = {};
        return I.getMode = function() {
          return N;
        }, I.getLength = function($) {
          return C.length;
        }, I.write = function($) {
          for (var A = 0; A < C.length; A += 1)
            $.put(C[A], 8);
        }, I;
      }, S = function(g) {
        var N = a.MODE_KANJI, C = s.stringToBytesFuncs.SJIS;
        if (!C)
          throw "sjis not supported.";
        (function(A, b) {
          var p = C(A);
          if (p.length != 2 || (p[0] << 8 | p[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var I = C(g), $ = {};
        return $.getMode = function() {
          return N;
        }, $.getLength = function(A) {
          return ~~(I.length / 2);
        }, $.write = function(A) {
          for (var b = I, p = 0; p + 1 < b.length; ) {
            var B = (255 & b[p]) << 8 | 255 & b[p + 1];
            if (33088 <= B && B <= 40956)
              B -= 33088;
            else if (57408 <= B && B <= 60351)
              B -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + B;
            B = (B >>> 8 & 255) * 192 + (B & 255), A.put(B, 13), p += 2;
          }
          if (p < b.length)
            throw "illegal char at " + (p + 1);
        }, $;
      }, w = function() {
        var g = [], N = {};
        return N.writeByte = function(C) {
          g.push(C & 255);
        }, N.writeShort = function(C) {
          N.writeByte(C), N.writeByte(C >>> 8);
        }, N.writeBytes = function(C, I, $) {
          I = I || 0, $ = $ || C.length;
          for (var A = 0; A < $; A += 1)
            N.writeByte(C[A + I]);
        }, N.writeString = function(C) {
          for (var I = 0; I < C.length; I += 1)
            N.writeByte(C.charCodeAt(I));
        }, N.toByteArray = function() {
          return g;
        }, N.toString = function() {
          var C = "";
          C += "[";
          for (var I = 0; I < g.length; I += 1)
            I > 0 && (C += ","), C += g[I];
          return C += "]", C;
        }, N;
      }, x = function() {
        var g = 0, N = 0, C = 0, I = "", $ = {}, A = function(p) {
          I += String.fromCharCode(b(p & 63));
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
        return $.writeByte = function(p) {
          for (g = g << 8 | p & 255, N += 8, C += 1; N >= 6; )
            A(g >>> N - 6), N -= 6;
        }, $.flush = function() {
          if (N > 0 && (A(g << 6 - N), g = 0, N = 0), C % 3 != 0)
            for (var p = 3 - C % 3, B = 0; B < p; B += 1)
              I += "=";
        }, $.toString = function() {
          return I;
        }, $;
      }, M = function(g) {
        var N = g, C = 0, I = 0, $ = 0, A = {};
        A.read = function() {
          for (; $ < 8; ) {
            if (C >= N.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var p = N.charAt(C);
            if (C += 1, p == "=")
              return $ = 0, -1;
            if (p.match(/^\s$/))
              continue;
            I = I << 6 | b(p.charCodeAt(0)), $ += 6;
          }
          var B = I >>> $ - 8 & 255;
          return $ -= 8, B;
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
        return A;
      }, V = function(g, N) {
        var C = g, I = N, $ = new Array(g * N), A = {};
        A.setPixel = function(L, F, re) {
          $[F * C + L] = re;
        }, A.write = function(L) {
          L.writeString("GIF87a"), L.writeShort(C), L.writeShort(I), L.writeByte(128), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(255), L.writeByte(255), L.writeByte(255), L.writeString(","), L.writeShort(0), L.writeShort(0), L.writeShort(C), L.writeShort(I), L.writeByte(0);
          var F = 2, re = p(F);
          L.writeByte(F);
          for (var le = 0; re.length - le > 255; )
            L.writeByte(255), L.writeBytes(re, le, 255), le += 255;
          L.writeByte(re.length - le), L.writeBytes(re, le, re.length - le), L.writeByte(0), L.writeString(";");
        };
        var b = function(L) {
          var F = L, re = 0, le = 0, de = {};
          return de.write = function(Q, ee) {
            if (Q >>> ee)
              throw "length over";
            for (; re + ee >= 8; )
              F.writeByte(255 & (Q << re | le)), ee -= 8 - re, Q >>>= 8 - re, le = 0, re = 0;
            le = Q << re | le, re = re + ee;
          }, de.flush = function() {
            re > 0 && F.writeByte(le);
          }, de;
        }, p = function(L) {
          for (var F = 1 << L, re = (1 << L) + 1, le = L + 1, de = B(), Q = 0; Q < F; Q += 1)
            de.add(String.fromCharCode(Q));
          de.add(String.fromCharCode(F)), de.add(String.fromCharCode(re));
          var ee = w(), Z = b(ee);
          Z.write(F, le);
          var De = 0, Ve = String.fromCharCode($[De]);
          for (De += 1; De < $.length; ) {
            var _t = String.fromCharCode($[De]);
            De += 1, de.contains(Ve + _t) ? Ve = Ve + _t : (Z.write(de.indexOf(Ve), le), de.size() < 4095 && (de.size() == 1 << le && (le += 1), de.add(Ve + _t)), Ve = _t);
          }
          return Z.write(de.indexOf(Ve), le), Z.write(re, le), Z.flush(), ee.toByteArray();
        }, B = function() {
          var L = {}, F = 0, re = {};
          return re.add = function(le) {
            if (re.contains(le))
              throw "dup key:" + le;
            L[le] = F, F += 1;
          }, re.size = function() {
            return F;
          }, re.indexOf = function(le) {
            return L[le];
          }, re.contains = function(le) {
            return typeof L[le] < "u";
          }, re;
        };
        return A;
      }, _ = function(g, N, C) {
        for (var I = V(g, N), $ = 0; $ < N; $ += 1)
          for (var A = 0; A < g; A += 1)
            I.setPixel(A, $, C(A, $));
        var b = w();
        I.write(b);
        for (var p = x(), B = b.toByteArray(), L = 0; L < B.length; L += 1)
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
  })(As)), As.exports;
}
var ck = lk();
const uk = /* @__PURE__ */ ik(ck), dk = ["width", "height", "viewBox"], hk = ["width", "height"], fk = ["d"], pk = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const s = uk(0, "M");
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
      }, null, 8, hk),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, fk)
    ], 8, dk));
  }
}, D4 = /* @__PURE__ */ K(pk, [["__scopeId", "data-v-489f0852"]]), mk = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: me({ padding: e.padding })
    }, [
      he(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, N4 = /* @__PURE__ */ K(mk, [["__scopeId", "data-v-47e67f04"]]), P4 = qi(() => import("./VoiceFigure-Cb6HnsCv.js").then((e) => e.V)), j4 = "1.0.0", q4 = "3.5";
export {
  kl as $,
  _e as A,
  Ae as B,
  Z5 as C,
  Zn as D,
  tt as E,
  Y5 as F,
  Gv as G,
  jb as H,
  z5 as I,
  ey as J,
  Mt as K,
  Ev as L,
  ba as M,
  ry as N,
  Qv as O,
  Jn as P,
  d5 as Q,
  yb as R,
  On as S,
  g5 as T,
  ub as U,
  Se as V,
  Dn as W,
  cb as X,
  lb as Y,
  wl as Z,
  K as _,
  eb as a,
  R5 as a$,
  ay as a0,
  wb as a1,
  kb as a2,
  Le as a3,
  Tb as a4,
  Ob as a5,
  bt as a6,
  bb as a7,
  Hb as a8,
  Hk as a9,
  _5 as aA,
  l5 as aB,
  gv as aC,
  Gb as aD,
  Kb as aE,
  J5 as aF,
  ri as aG,
  m5 as aH,
  fn as aI,
  Yk as aJ,
  Vk as aK,
  j5 as aL,
  pn as aM,
  H5 as aN,
  Pb as aO,
  c5 as aP,
  u5 as aQ,
  i5 as aR,
  tn as aS,
  wt as aT,
  Uk as aU,
  r0 as aV,
  o5 as aW,
  gb as aX,
  ai as aY,
  Rt as aZ,
  Dt as a_,
  B5 as aa,
  F5 as ab,
  Xk as ac,
  db as ad,
  hb as ae,
  Ab as af,
  Cb as ag,
  Ib as ah,
  ab as ai,
  $o as aj,
  xb as ak,
  Wb as al,
  e4 as am,
  t5 as an,
  Qb as ao,
  Xb as ap,
  Rb as aq,
  Sb as ar,
  _b as as,
  Eb as at,
  p5 as au,
  Fb as av,
  Ub as aw,
  s4 as ax,
  Ht as ay,
  zb as az,
  vy as b,
  n4 as b$,
  Hv as b0,
  W5 as b1,
  w5 as b2,
  y5 as b3,
  O0 as b4,
  zr as b5,
  O5 as b6,
  qb as b7,
  es as b8,
  ot as b9,
  b5 as bA,
  E5 as bB,
  ct as bC,
  v5 as bD,
  A5 as bE,
  Vb as bF,
  n5 as bG,
  Yb as bH,
  Ce as bI,
  Nb as bJ,
  C5 as bK,
  d4 as bL,
  h4 as bM,
  Fk as bN,
  c0 as bO,
  Lb as bP,
  x5 as bQ,
  tb as bR,
  Q5 as bS,
  k5 as bT,
  $5 as bU,
  M5 as bV,
  Bb as bW,
  vv as bX,
  Db as bY,
  Zb as bZ,
  X5 as b_,
  S5 as ba,
  gs as bb,
  Zo as bc,
  o4 as bd,
  l4 as be,
  f5 as bf,
  P5 as bg,
  Wk as bh,
  e5 as bi,
  r4 as bj,
  $b as bk,
  Mb as bl,
  rb as bm,
  vb as bn,
  Kk as bo,
  D5 as bp,
  nb as bq,
  sb as br,
  ib as bs,
  a5 as bt,
  t0 as bu,
  U5 as bv,
  Xv as bw,
  ob as bx,
  Jk as by,
  s5 as bz,
  ze as c,
  Mi as c$,
  Gk as c0,
  zk as c1,
  Jb as c2,
  c4 as c3,
  Sa as c4,
  u4 as c5,
  bi as c6,
  N5 as c7,
  pb as c8,
  fb as c9,
  Ak as cA,
  E4 as cB,
  zs as cC,
  Dk as cD,
  og as cE,
  It as cF,
  ea as cG,
  ma as cH,
  $k as cI,
  Ck as cJ,
  il as cK,
  R4 as cL,
  _k as cM,
  D4 as cN,
  $4 as cO,
  Rl as cP,
  yk as cQ,
  Pk as cR,
  iw as cS,
  A1 as cT,
  Ok as cU,
  rn as cV,
  g1 as cW,
  Rk as cX,
  wk as cY,
  Wn as cZ,
  L4 as c_,
  o0 as ca,
  Zk as cb,
  Jv as cc,
  r5 as cd,
  ya as ce,
  dv as cf,
  h5 as cg,
  Ut as ch,
  Tt as ci,
  bk as cj,
  _4 as ck,
  ke as cl,
  Gn as cm,
  xk as cn,
  Th as co,
  B4 as cp,
  qk as cq,
  In as cr,
  f4 as cs,
  vk as ct,
  Jt as cu,
  Ek as cv,
  ye as cw,
  S4 as cx,
  j4 as cy,
  q4 as cz,
  C0 as d,
  Tk as d0,
  rt as d1,
  Ik as d2,
  P4 as d3,
  N4 as d4,
  _r as d5,
  w4 as d6,
  Cf as d7,
  Hs as d8,
  T4 as d9,
  wp as dA,
  x4 as dB,
  Hn as dC,
  C4 as dD,
  O4 as da,
  I4 as db,
  jk as dc,
  Nk as dd,
  Lk as de,
  m4 as df,
  p4 as dg,
  Xm as dh,
  kk as di,
  Sk as dj,
  y4 as dk,
  k4 as dl,
  Ze as dm,
  Mk as dn,
  v4 as dp,
  Bk as dq,
  kt as dr,
  By as ds,
  M4 as dt,
  g4 as du,
  A4 as dv,
  X1 as dw,
  yw as dx,
  Pr as dy,
  b4 as dz,
  We as e,
  e0 as f,
  mb as g,
  a4 as h,
  nn as i,
  V5 as j,
  i4 as k,
  L5 as l,
  G5 as m,
  xy as n,
  q5 as o,
  Qk as p,
  xa as q,
  wi as r,
  ki as s,
  qe as t,
  K5 as u,
  I0 as v,
  t4 as w,
  T5 as x,
  I5 as y,
  gn as z
};
