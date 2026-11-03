/* @code-commandments-generated */
import { openBlock as i, createElementBlock as u, renderSlot as pe, createElementVNode as p, normalizeClass as J, Fragment as Y, renderList as ae, normalizeStyle as $e, defineComponent as Vo, Comment as Ko, h as ds, cloneVNode as Go, createBlock as V, withCtx as z, unref as U, createVNode as F, toDisplayString as v, createCommentVNode as $, inject as _e, computed as T, resolveDynamicComponent as it, Transition as yt, watch as ke, ref as R, shallowRef as fn, createTextVNode as ce, TransitionGroup as ma, mergeProps as Qe, reactive as hs, onMounted as Le, onUnmounted as Ee, nextTick as Dt, useId as ga, Teleport as fs, withModifiers as be, isRef as Os, onBeforeUnmount as wt, resolveDirective as Yo, withDirectives as et, useAttrs as ps, useModel as zn, getCurrentInstance as Jo, mergeModels as Vn, getCurrentScope as va, onScopeDispose as ya, provide as Zo, onErrorCaptured as Xo, toHandlers as Qo, createSlots as er, vShow as tr, useSlots as nr, withKeys as Tt, vModelText as Kn, defineAsyncComponent as sr } from "vue";
const G = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, ar = { class: "skeleton-line" }, or = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (i(), u("span", ar, [
      pe(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (i(!0), u(Y, null, ae(e.bars, (s) => (i(), u("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: $e({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, nt = /* @__PURE__ */ G(or, [["__scopeId", "data-v-0ebb6933"]]), ms = Vo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Ko);
      return s.length !== 1 ? ds(Y, { key: n }, s) : s[0].key == null ? Go(s[0], { key: n }) : s[0];
    };
  }
}), rr = ["aria-label"], lr = ["aria-label"], ir = ["aria-label"], cr = ["aria-label"], ur = ["aria-label"], dr = ["aria-label"], hr = ["aria-label"], fr = {
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
    ], l = ["94%", "88%", "91%", "62%"].map((c) => ({ width: c, height: 10 })), r = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (c, d) => (i(), V(ms, { value: e.shape }, {
      messages: z(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (i(), u(Y, null, ae(t, (h) => p("div", {
            key: h.id,
            class: J(["skeleton-message", { mine: h.mine }]),
            style: $e({ width: `${h.width}%`, height: `${h.height}px` })
          }, null, 6)), 64))
        ], 8, rr)
      ]),
      older: z(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (i(!0), u(Y, null, ae(t.slice(0, 3), (h) => (i(), u("div", {
            key: h.id,
            class: J(["skeleton-message", { mine: h.mine }]),
            style: $e({ width: `${h.width}%`, height: `${h.height}px` })
          }, null, 6))), 128))
        ], 8, lr)
      ]),
      cards: z(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (i(!0), u(Y, null, ae(e.count, (h) => (i(), u("div", {
            key: h,
            class: "skeleton-card"
          }, [
            (i(), u(Y, null, ae(n, (m) => F(nt, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ir)
      ]),
      file: z(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (i(!0), u(Y, null, ae(e.count, (h) => (i(), u("div", {
            key: h,
            class: "skeleton-file"
          }, [
            F(nt, {
              class: "skeleton-file-head",
              bars: s
            }),
            (i(), u(Y, null, ae(a, (m) => F(nt, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, cr)
      ]),
      page: z(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          F(nt, {
            class: "skeleton-heading",
            bars: r
          }),
          (i(!0), u(Y, null, ae(e.count, (h) => (i(), V(nt, {
            key: h,
            bars: U(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, ur)
      ]),
      text: z(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (i(!0), u(Y, null, ae(e.count, (h) => (i(), V(nt, {
            key: h,
            bars: U(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, dr)
      ]),
      default: z(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (i(!0), u(Y, null, ae(e.count, (h) => (i(), V(nt, {
            key: h,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, hr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, kt = /* @__PURE__ */ G(fr, [["__scopeId", "data-v-c687fb85"]]), pr = {
  key: 1,
  class: "empty-state titled"
}, mr = { class: "empty-state-title" }, gr = { class: "empty-state-text" }, vr = {
  key: 2,
  class: "empty-state"
}, yr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (i(), V(kt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (i(), u("div", pr, [
      p("p", mr, v(e.title), 1),
      p("p", gr, [
        pe(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (i(), u("p", vr, [
      pe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, tn = /* @__PURE__ */ G(yr, [["__scopeId", "data-v-b27e89b0"]]), wr = { class: "fold-group" }, kr = ["aria-expanded"], br = { class: "fold-label" }, $r = {
  key: 0,
  class: "fold-count"
}, xr = {
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
    return (s, a) => (i(), u("div", wr, [
      p("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", br, v(e.label), 1),
        e.count !== "" ? (i(), u("span", $r, v(e.count), 1)) : $("", !0),
        p("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, kr),
      e.open ? pe(s.$slots, "default", {}, void 0, !0, 0) : $("", !0)
    ]));
  }
}, ty = /* @__PURE__ */ G(xr, [["__scopeId", "data-v-9ef1865c"]]), Mr = Symbol("open-view"), Ce = Symbol.for("journal.window-context");
function pn() {
  const e = _e(Ce, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const _r = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (i(), u("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Sr = /* @__PURE__ */ G(_r, [["__scopeId", "data-v-eb453d6f"]]), Er = {
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
    const t = e, n = T(() => {
      var s;
      return t.busy || t.disabled || !!((s = _e(Ce, null)) != null && s.readOnly);
    });
    return (s, a) => (i(), V(it(e.href ? "a" : "button"), {
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
          pe(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (i(), V(Sr, {
          key: 0,
          class: "btn-spinner"
        })) : $("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, we = /* @__PURE__ */ G(Er, [["__scopeId", "data-v-a2dc4bda"]]), Cr = {
  class: "running",
  "data-running-command": ""
}, Ar = ["title"], Or = {
  key: "idle",
  class: "running-idle"
}, Tr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (i(), u("span", Cr, [
      F(yt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: z(() => [
          e.text ? (i(), u("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Ar)) : (i(), u("span", Or, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, ny = /* @__PURE__ */ G(Tr, [["__scopeId", "data-v-d3240219"]]), Ir = ["aria-checked", "aria-label", "title"], Br = {
  key: 0,
  class: "switch-inner"
}, Rr = {
  key: 0,
  class: "switch-word"
}, Lr = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("button", {
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
        e.labelled ? (i(), u("span", Br, v(e.word), 1)) : $("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (i(), u("span", Rr, v(e.word), 1)) : $("", !0)
    ], 10, Ir));
  }
}, sy = /* @__PURE__ */ G(Lr, [["__scopeId", "data-v-1bfb90f3"]]);
function wa(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function It(e, t) {
  return wa(() => localStorage, e, t);
}
function ka(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function mn(e, t) {
  return ka(() => localStorage, e, t);
}
function ba(e, t) {
  ke(t, (n) => mn(e, n), { deep: !0 });
}
function Dr(e, t) {
  return wa(() => sessionStorage, e, t);
}
function Nr(e, t) {
  return ka(() => sessionStorage, e, t);
}
const nn = "journal.environment", $a = R(Dr(nn, It(nn, "")));
function jr(e) {
  $a.value = e, Nr(nn, e), mn(nn, e);
}
const sn = R(location.hash), Ts = fn(null), Is = { integrations: "mcp", library: "team" };
function Pr() {
  if (!Ts.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Is[n]) {
    location.replace(`#/${[Is[n], ...s].join("/")}${t ? `?${t}` : ""}`), sn.value = location.hash;
    return;
  }
  !n || Ts.value(n) || (jr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), sn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  sn.value = location.hash, Pr();
});
const Fe = T(() => {
  const [e, t = ""] = sn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, c = ""] = l.split("@"), [d = "", h = "", m = ""] = r.split(":");
    return { table: d, id: Number(h), comment: Number(m) || 0, env: c };
  });
  return {
    env: $a.value,
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
function qr(e = "", t = 0, n = "") {
  location.hash = gn.page(e, t, n);
}
const Wr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function xa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Wr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function ay(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Ma(e, t, n = 0, s = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((l = gt[e]) != null && l.call(gt, t))) return;
  const a = Fe.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  xa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Fr(e, t, n, s = 0, a = "") {
  if (e === Fe.value.env) return Ma(t, n, s, a);
  const o = Fe.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  xa([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: s, env: e }], a);
}
function He(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Fr(s, a, Number(o), 0, t) : Ma(a, Number(o), 0, t);
}
function Hr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function pt(e) {
  const t = Hr(e);
  t && He(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const vn = typeof document < "u" && document.documentElement.classList.contains("phone"), Ur = "Files are attached on the computer; the phone sends text.", xn = [
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
}), Nt = {
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
    filters: xn
  }),
  tasks: me("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: xn
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
  pins: me("Pin", "band", "One line pinned to the chat while it matters", { filters: xn }),
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
}, zr = ["secrets", "plugins"], _a = Object.keys(Nt).filter((e) => !(vn && zr.includes(e)));
T(() => _a.map((e) => ({ name: e, ...Nt[e] })));
const jt = (e) => Nt[e], Sa = new Map(_a.flatMap((e) => [e, e.replace(/s$/, ""), Nt[e].title.toLowerCase()].map((t) => [t, e]))), lt = (e) => Sa.get(String(e).toLowerCase()) || "", Ea = [...Sa.keys()].sort((e, t) => t.length - e.length).join("|"), Vr = ["stroke-width", "innerHTML"], ve = {
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
    return (o, l) => (i(), u("svg", {
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
    }, null, 12, Vr));
  }
}, yn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (i(), V(we, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: z(() => [
        F(ve, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Kr = {
  key: 1,
  class: "row-list-failure"
}, Gr = ["data-row"], Yr = {
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
    const t = e, n = T(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = R(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure ? (i(), V(kt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (i(), u("p", Kr, v(e.failure), 1)) : !e.rows.length && e.loaded ? (i(), V(tn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: z(() => [
        ce(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (i(), u(Y, { key: 3 }, [
      (i(), V(it(e.arrival ? ma : "ul"), Qe(n.value, { class: "row-list" }), {
        default: z(() => [
          (i(!0), u(Y, null, ae(e.rows, (r) => (i(), u("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            pe(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Gr))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (i(), u("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => a(e.older))
      }, "Show more")) : $("", !0)
    ], 64));
  }
}, Jr = /* @__PURE__ */ G(Yr, [["__scopeId", "data-v-aa6ad7ff"]]), Zr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Xr = {
  key: 1,
  class: "agent-rows-note"
}, Qr = {
  key: 2,
  class: "agent-rows-note"
}, el = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, tl = ["data-agent-row", "onClick"], nl = { class: "agent-row-name" }, sl = { class: "agent-row-state" }, al = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = T(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (i(), u("div", Zr, [
      e.loaded ? e.failure ? (i(), u("p", Xr, v(e.failure), 1)) : e.rows.length ? (i(), u(Y, { key: 3 }, [
        p("p", el, v(s.value) + " running", 1),
        (i(!0), u(Y, null, ae(n.value, (l) => (i(), u("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => U(He)(`agents:${l.id}`)
        }, [
          p("span", nl, "#" + v(l.id) + " " + v(l.session), 1),
          p("span", sl, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, tl))), 128))
      ], 64)) : (i(), u("p", Qr, v(e.none), 1)) : (i(), V(kt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, oy = /* @__PURE__ */ G(al, [["__scopeId", "data-v-a01e5a17"]]), ol = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (i(), u("span", {
      class: J(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Ca = /* @__PURE__ */ G(ol, [["__scopeId", "data-v-9e7e1157"]]), rl = ["aria-valuenow", "aria-valuemax"], ll = {
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
    const t = e, n = T(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (i(), u("span", {
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: $e({ width: n.value })
      }, null, 4)
    ], 10, rl));
  }
}, il = /* @__PURE__ */ G(ll, [["__scopeId", "data-v-9eba6a85"]]), cl = { class: "bars" }, ul = { class: "bar-name" }, dl = { class: "bar-value" }, hl = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = T(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (i(), u("div", cl, [
      (i(!0), u(Y, null, ae(e.items, (c, d) => (i(), V(it(c.open ? "button" : "div"), {
        key: `${d}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: J(["bar-row", c.tone, { opens: c.open }]),
        onClick: (h) => c.open && s("open", c.open)
      }, {
        default: z(() => [
          p("span", ul, v(c.label), 1),
          F(il, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", dl, v(c.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, fl = /* @__PURE__ */ G(hl, [["__scopeId", "data-v-663427f4"]]), pl = { class: "bars" }, ml = {
  key: 0,
  class: "bars-title"
}, gl = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("div", pl, [
      e.node.title ? (i(), u("span", ml, v(e.node.title), 1)) : $("", !0),
      F(fl, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, vl = /* @__PURE__ */ G(gl, [["__scopeId", "data-v-7135bb11"]]), yl = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = T(() => n[s.node.type](s.node));
    return (l, r) => (i(), u("div", {
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: $e(o.value)
    }, [
      (i(!0), u(Y, null, ae(e.node.children || [], (c, d) => (i(), V(Qa, {
        key: d,
        node: c,
        onOpen: r[0] || (r[0] = (h) => a("open", h)),
        onFile: r[1] || (r[1] = (h) => a("file", h))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Xt = /* @__PURE__ */ G(yl, [["__scopeId", "data-v-d142a3f4"]]), wl = {
  key: 0,
  class: "card-head"
}, kl = { class: "card-title" }, bl = {
  key: 0,
  class: "card-note"
}, $l = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (i(), u("header", wl, [
        p("span", kl, v(e.node.title), 1),
        e.node.note ? (i(), u("span", bl, v(e.node.note), 1)) : $("", !0)
      ])) : $("", !0),
      F(Xt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, xl = /* @__PURE__ */ G($l, [["__scopeId", "data-v-67b72d40"]]), Me = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Bs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Mn = 80;
function Rs(e) {
  return e.length <= Mn ? e : `${e.slice(0, Mn + 1).replace(/\s+\S*$/, "") || e.slice(0, Mn)}…`;
}
const Ls = {
  messages: (e) => Rs(Bs(e.text)),
  comments: (e) => Rs(Bs(e.text)),
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
}, Ml = (e) => (Ls[e.table] ? Ls[e.table](e) : e.title || "") || "", _l = ["done", "cancelled"], Gn = {
  tasks: (e) => Me(e.completed_at) || (e.state === "cancelled" ? Me(e.updated_at) : 0),
  questions: (e) => e.answer ? Me(e.updated_at) : 0,
  plans: (e) => _l.includes(e.state) ? Me(e.updated_at) : 0,
  pins: (e) => Me(e.closed_at),
  secrets: (e) => Me(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Me(e.updated_at) : 0,
  shares: (e) => Me(e.stopped_at),
  dumps: (e) => Me(e.completed_at),
  agents: (e) => e.state === "ended" ? Me(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Me(e.created_at) : 0
}, Sl = (e) => Gn[e.table] ? Gn[e.table](e) : 0, Aa = (e) => Sl(e) > 0, El = (e) => !!Gn[e], Oa = (e) => Me(e.created_at), Yn = (e) => Me(e.updated_at) || Oa(e), Cl = (e) => "task_ids" in e, Ta = 1024, Al = Ta * 1024 * 1024, Ol = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ta} MB limit for one file.`;
function Tl() {
  return () => {
  };
}
const mt = hs({
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
}), Il = () => !!(mt.version || mt.external) && !mt.failure && !mt.late, Ia = () => !!mt.countdown || Il() || mt.starting, Ds = 2e4, Bl = 3e5, qe = 6e5, Ut = 6, Rl = 500, Ll = "/journal/summary", Ns = vn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Dl = (e) => e.split("?")[0].endsWith(Ll), Ba = (e, t) => Object.assign(new Error(t), { status: e });
async function Nl(e, t, n = Ba) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const jl = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Pl {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Ut;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Ut;
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
  async reach(t, n, s, a, o, l = {}) {
    const r = s instanceof FormData;
    try {
      return await fetch(n, {
        method: t,
        headers: { ...Ns, ...l, ...s === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: jl(s),
        signal: AbortSignal.timeout(a || (r ? Bl : Ds))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((d) => setTimeout(d, Rl)), this.reach(t, n, s, a, o - 1, l);
    }
  }
  async send(t, n, s, a = 0, o = Ut, l = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : Tl(), c = await this.reach(t, n, s, a, o, l).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return Nl(c, `${c.status} ${c.statusText}`).catch((d) => {
      throw d.blocked && t !== "GET" && this.refused(d.message), d;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ns, signal: AbortSignal.timeout(Ds) });
    if (!n.ok) throw Ba(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, l = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Ut, o).then((c) => (this.written(n), c));
    if (Ia() && !Dl(n))
      return Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 }));
    if (this.flying.has(l)) return this.flying.get(l);
    const r = this.send(t, n, s, 0, this.tries, o);
    return this.flying.set(l, r), r.finally(() => this.flying.delete(l)).catch(() => {
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
const De = new Pl(), Se = (e) => encodeURIComponent(e);
function fe(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const xt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: l = !1 }) => [l ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Mt = "the page does not know its environment yet", ql = "X-Journal-Env", Wl = "X-Journal-Request-At", _n = "/viewer/voices/figures/";
class gs {
  constructor({ env: t = () => Fe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new gs({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Wl]: String(Date.now()), ...this.env() ? { [ql]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === Mt ? Promise.reject(new Error(Mt)) : De.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === Mt ? Promise.reject(new Error(Mt)) : De.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : Mt;
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
    return De.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: l = [], tasks: r = [], closed: c = !1, docked: d = !1 } = {}) {
    const h = this.here(`/${t}${fe({ limit: n, before: s, after: a, since: o, ids: l.join(","), tasks: r.join(","), closed: c ? "1" : "", docked: d ? "1" : "" })}`);
    return this.get(h, `${t}.${xt({ before: s, after: a, since: o, ids: l, tasks: r, closed: c, docked: d })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const l = this.here(`/chats/${encodeURIComponent(t)}${fe({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(l, `chats/${t}.${xt({ before: s, since: a, docked: o })}`);
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
    if (vn) return Promise.reject(Object.assign(new Error(Ur), { status: 403 }));
    if (s.size > Al) return Promise.reject(new Error(Ol(s)));
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
    return this.get(`/agents/controls/${Se(t)}${fe({ model: n, effort: s })}`);
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
    return this.get(this.here(`${a}${fe(s)}`), `${a}.${xt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${fe(n)}`), `/verifiers/${t}/transcript.${xt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${fe(n)}`), `/workers/${t}/transcript.${xt(n)}`);
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
    return this.post("/team/connect", t, qe);
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
    return De.request("GET", _n + "figures.json");
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
    return `${this.base}/${t ? `?env=${Se(t)}` : ""}${gn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const je = new gs({ base: vn ? "/p" : "" }), Fl = (e) => De.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(je.base.length).split("/")[2]);
}), js = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), Hl = 6e4, Ul = 4, zl = 300, Vl = 5e3, Ra = /* @__PURE__ */ new Map();
function wn(e) {
  if (!(e in js)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return js[e];
}
function Kl(e) {
  const t = wn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Vl;
  }
}
const Gl = (e) => e / 2 + Math.random() * e / 2, La = (e) => [...e.users.values()].pop(), vs = (e) => Ra.get(e.place) === e, Yl = () => Math.random() * zl, ys = () => document.hidden;
function Jl(e) {
  const t = Kl(e);
  return e.failures ? Gl(Math.min(Hl, t * 2 ** e.failures)) : Math.max(t, Ul * e.took);
}
function Da(e, t) {
  clearTimeout(e.timer), !(!vs(e) || ys()) && (e.timer = setTimeout(() => Zl(e), t));
}
function Zl(e) {
  return vs(e) ? e.running ? (e.again = !0, e.running) : (e.running = ti(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Xl = (e) => {
  var t, n;
  return !ys() && (((n = (t = wn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && La(e).active() && !Ia();
};
async function Ql(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await De.attemptOnce(() => wn(e.key).read(La(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function ei(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = wn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function ti(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Xl(e) && ei(e, await Ql(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && vs(e));
  Da(e, Jl(e));
}
const ni = () => ys() || Ra.forEach((e) => Da(e, Yl()));
document.addEventListener("visibilitychange", ni);
const si = 60, ai = (e, t) => Me(e.created_at) >= Me(t.created_at) - si, oi = (e, t) => e.id > 0 && e.table === t.table && ai(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ws = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => oi(s, n))), ri = { me: 1, people: [] }, ue = hs({
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
  people: ri,
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
ba("journal.activity", () => ue.activity);
ba("journal.side.mini", () => ue.sideMini);
const li = 50, Na = 100, ii = { messages: 25 }, Ne = (e) => ii[e] || li;
function ci(e, t) {
  if (e !== "messages") return Math.max(t.length - Ne(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Ne(e)) return s;
  return 0;
}
const tt = /* @__PURE__ */ new Set(), ks = R(0), Pt = /* @__PURE__ */ new Set(), qt = /* @__PURE__ */ new Set(), Ge = /* @__PURE__ */ new Set(), Jn = /* @__PURE__ */ new Set(), ui = /* @__PURE__ */ new Map(), di = /* @__PURE__ */ new Map();
let _t = !1, St = null;
const hi = (e, t) => e.id - t.id, fi = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, pi = { messages: fi }, ja = (e) => pi[e] || hi;
function Pa(e) {
  return ks.value, tt.has(e) || (tt.add(e), ue.booted && (!Pt.has(e) || qt.has(e)) && queueMicrotask(() => bs([e], !1))), ue.rows[e] || [];
}
function mi(e) {
  const t = ue.rows[e] || [], n = ci(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ue.rows[e] = t.filter((a) => s.has(a) || El(e) && !Aa(a)), ue.paging.size[e] = Ne(e), ue.paging.more[e] = !0;
}
const gi = /* @__PURE__ */ new Set();
function vi() {
  tt.forEach(mi), tt.clear(), ui.clear(), di.clear(), ks.value += 1;
}
ke(() => `${Fe.value.env}/${Fe.value.page}/${Fe.value.open ? Fe.value.open.table : ""}`, vi);
ke(
  () => ue.booted,
  (e) => e && bs(
    [...tt].filter((t) => !Pt.has(t)),
    !1
  )
);
const Zn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Cl(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function qa(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Zn(s) && !Zn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Wa(e, t) {
  Pt.add(e), ks.value += 1;
  const n = ue.rows[e] || [];
  ue.rows[e] = [...qa(n, t.rows), ...ws(n.filter((s) => s.id === 0), t.rows)], ue.paging.size[e] = ue.paging.size[e] || Ne(e), ue.paging.more[e] = !t.is_last_page;
}
async function yi(e) {
  const t = new Set((ue.rows[e] || []).map((o) => o.id)), n = await je.list(e, { limit: Ne(e) });
  kn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ws((ue.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Wa(e, { ...n, rows: [...n.rows, ...a].sort(ja(e)) }), ue.paging.size[e] = Ne(e), Fa.has(e) && await Ha(e), ue.rows[e];
}
const kn = (e, t) => ue.counts = { ...ue.counts, [e]: t };
async function wi(e) {
  const t = ue.rows[e] || [], n = Math.max(0, ...t.map(Yn)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await je.list(e, { limit: Ne(e), since: n, after: s });
  if (kn(e, a.counts), !a.is_last_page) return yi(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), l = ws(t.filter((r) => !o.has(r.id)), a.rows).concat(qa(t, a.rows));
  return ue.rows[e] = l.sort(ja(e)), ue.paging.size[e] = ue.rows[e].length, ue.rows[e];
}
const Sn = /* @__PURE__ */ new Set();
async function ki(e, t = !1) {
  e.forEach((n) => qt.delete(n)), e.forEach((n) => Jn.add(n));
  try {
    await Ei(e, t);
  } finally {
    e.forEach((n) => Jn.delete(n));
  }
}
async function bi(e) {
  const t = await je.list(e, { limit: Ne(e) });
  kn(e, t.counts), Wa(e, t);
}
async function $i(e) {
  kn(e, (await je.list(e, { limit: 1, closed: !0 })).counts);
}
const Fa = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ha(e) {
  const t = (ue.rows[e] || []).filter((a) => Zn(a) && (e !== "plans" || !Aa(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await je.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ue.rows[e] = (ue.rows[e] || []).map((a) => s.get(a.id) || a);
}
const xi = (e, t) => !Pt.has(e) || t && (ue.paging.size[e] || Ne(e)) === Ne(e) && !gi.has(e);
async function Mi(e, t) {
  if (!tt.has(e)) return $i(e);
  const n = await (xi(e, t) ? bi(e) : wi(e));
  return Fa.has(e) && await Ha(e), n;
}
async function Ua() {
  const e = await je.settings();
  JSON.stringify(e) !== JSON.stringify(ue.settings) && (ue.settings = e);
}
async function _i() {
  const [e] = await Promise.all([je.entries(0, Na), Ua()]);
  Oi([...It(Va(), []), ...e]);
}
const Si = (e, t) => Mi(e, t).then(
  () => null,
  () => e
);
async function Ei(e, t) {
  const n = (await Promise.all(e.map((s) => Si(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ge.add(s), qt.add(s))), t && await _i(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const za = 1e3, Ci = 15e3;
let zt = za;
async function Ai() {
  return St || (St = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ge].some((e) => !Sn.has(e)) || _t; ) {
      const e = _t, t = [...e ? Object.keys(ue.rows) : Ge].filter((s) => Nt[s] && (tt.has(s) || s in ue.rows)).filter((s) => e || !tt.has(s) || qt.has(s) || !Pt.has(s)).filter((s) => !Sn.has(s)), n = [...Ge].filter((s) => Sn.has(s));
      Ge.clear(), n.forEach((s) => Ge.add(s)), _t = !1;
      try {
        await ki(t, e), zt = za;
      } catch {
        _t = _t || e, await new Promise((a) => setTimeout(a, zt)), zt = Math.min(zt * 2, Ci);
      }
    }
  })().finally(() => St = null), St);
}
function bs(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Jn.has(n)).forEach((n) => {
    Ge.add(n), t && qt.add(n);
  }), Ge.delete("settings") && Ua(), Ai();
}
const Va = () => {
  var e;
  return `typed-entries:${((e = ue.identity) == null ? void 0 : e.root) || location.host}:${je.env()}`;
};
function Oi(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ue.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Na), mn(Va(), ue.entries.slice(-50));
}
Fl((e) => ue.streamOpen || bs([e]));
const Xn = [], Ti = 2e3, Ke = /* @__PURE__ */ new Map(), Ii = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Bi = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ct(e, { first: t = !1 } = {}) {
  t ? Xn.unshift(e) : Xn.push(e), Ke.clear();
}
function Ka(e, t, n) {
  var a;
  const s = Pa(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Ri = (e) => Pa(e.table).find((t) => t.id === e.id) === e.row, Li = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Di(e, t) {
  const n = [{ kind: "text", text: Ue(e).replace(/\r\n/g, `
`) }];
  for (const s of Xn)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const l = s(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(a, 1, ...l);
    }
  return n;
}
function Bt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Ni(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Ni(e) {
  return e.split(Bi).map((t, n) => n % 2 ? t : t.replace(Ii, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ps(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function ji(e) {
  const [t, , ...n] = e, s = Ps(t).map((o) => `<th>${Bt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Ps(o).map((l) => `<td>${Bt(l)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Pi(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Bt(a)}</li>`).join("")}</${s}>`;
}
const qs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ga(e) {
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
      n.push(`<h${r}>${Bt(o[2])}</h${r}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (qs(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(ji(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(Pi(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Ga(
          t.slice(s, r).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let l = s;
    for (; l < t.length && t[l].trim() && !qs(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${Bt(t.slice(s, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = l;
  }
  return n.join("");
}
const qi = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Wi = (e) => e.kind !== "text" && !qi.test(e.html);
function Fi(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Ga(s).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Wi(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Qn(e, t = { env: "" }) {
  const n = Li(e, t), s = Ke.get(n);
  if (Ke.delete(n), s && s.reads.every(Ri))
    return Ke.set(n, s), s.html;
  const a = [], o = Fi(Di(e, { ...t, reads: a }));
  return Ke.set(n, { html: o, reads: a }), Ke.size > Ti && Ke.delete(Ke.keys().next().value), o;
}
const Ya = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, an = (e) => String(e || "").replace(Ya, (t, n, s, a) => a), Hi = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Vt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Ui = /^Traceback \(most recent call last\):/m, zi = 8;
function Ja(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, zi).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Vi(e) {
  const t = [...e.matchAll(Hi)].map((s) => s.index);
  if (Vt.lastIndex = 0, !t.length || !Vt.test(e)) return null;
  Vt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), l = [...o.matchAll(Vt)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Ja(n), tail: "" } : null;
}
function Ki(e) {
  const t = Ui.exec(e);
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
ct((e) => {
  const t = an(e), n = Ki(t) || Vi(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const es = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Gi = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Yi = `${es} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ji = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Zi = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ws = {
  js: { keywords: es, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Gi, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Yi, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: es, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Ji, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Zi, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Fs(e, t, n) {
  return n && e.startsWith(n, t);
}
function Xi(e, t) {
  const n = Ws[t] || Ws.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const l = (r, c) => c && a.push({ kind: r, value: c });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const d = e.indexOf(`
`, o), h = e.slice(o, d < 0 ? e.length : d);
      l(
        /^#{1,6}\s/.test(h) ? "keyword" : /^(```|~~~)/.test(h) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(h) ? "number" : "plain",
        h
      ), l("plain", d < 0 ? "" : `
`), o = d < 0 ? e.length : d + 1;
      continue;
    }
    if (Fs(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      l("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && Fs(e, o, n.block[0])) {
      const d = e.indexOf(n.block[1], o + n.block[0].length), h = d < 0 ? e.length : d + n.block[1].length;
      l("comment", e.slice(o, h)), o = h;
      continue;
    }
    const c = (n.triple || []).find((d) => e.startsWith(d, o));
    if (c) {
      const d = e.indexOf(c, o + 3), h = d < 0 ? e.length : d + 3;
      l("string", e.slice(o, h)), o = h;
      continue;
    }
    if (n.quotes.includes(r)) {
      let d = o + 1;
      for (; d < e.length && e[d] !== r && (r === "`" || e[d] !== `
`); ) d += e[d] === "\\" ? 2 : 1;
      l("string", e.slice(o, d + 1)), o = d + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const d = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", d[0]), o += d[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const h = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? h.toLowerCase() : h, b = n.property && /^\s*:/.test(e.slice(o + h.length));
      l(s.has(m) ? "keyword" : b ? "property" : /^[A-Z]/.test(h) && t !== "text" ? "type" : "plain", h), o += h.length;
      continue;
    }
    if (/\d/.test(r)) {
      const d = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", d[0]), o += d[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const d = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + d)), o += d;
      continue;
    }
    l("plain", r), o += 1;
  }
  return a;
}
function Qi(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Xi(e, t))
    a.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += s === "plain" ? Ue(l) : `<span class="tok-${s}">${Ue(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function ec(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const tc = 1500, Hs = /* @__PURE__ */ new WeakMap();
async function nc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await ec(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Hs.get(t)), Hs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, tc)
  )));
}
typeof document < "u" && document.addEventListener("click", nc, !0);
const sc = /^(```|~~~)\s*(\w+)?\s*$/, ac = /^\s{4,}\S/, oc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, rc = /^\s*(?:[-*+]|\d+[.)])\s/, Za = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, lc = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Xa(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function ic(e) {
  const t = Xa(e.join(`
`));
  return (lc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const cc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Za.test(t) && !rc.test(t);
};
function Us(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Qi(Xa(e.join(`
`)), t || ic(e)).join(`
`)}</code></pre></div>` };
}
function uc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const l = t[o].match(sc);
    if (l) {
      const c = t.findIndex((h, m) => m > o && h.trim().startsWith(l[1])), d = c < 0 ? t.length : c;
      a(), n.push(Us(t.slice(o + 1, d).map(an), l[2] ? l[2].toLowerCase() : "")), o = d + 1;
      continue;
    }
    const r = cc(s) ? oc : ac;
    if (r.test(t[o])) {
      let c = o;
      for (; c < t.length && (r.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Za.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - o + d.length >= 2) {
        a(), n.push(Us([...d, ...t.slice(o, c)].map(an), "")), o = c;
        continue;
      }
      s.push(...d);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ct((e) => uc(e));
const dc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, hc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function fc(e) {
  const t = dc.exec(e);
  if (t && lt(t[1])) return { at: t.index, length: t[0].length, table: lt(t[1]), id: Number(t[2]), label: t[3] };
  const n = hc.exec(e), s = n && lt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function pc(e, t, n, s) {
  const a = Ka(s, e, t), o = an(a ? Ml(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(jt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
ct(
  (e, t) => {
    const n = fc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: pc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const mc = /\.(png|jpe?g|gif|webp|svg)$/i, gc = (e) => mc.test(e), vc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, yc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function wc(e, t) {
  const n = vc.exec(e), [, s, a, o, l, r] = n || [], c = n && lt(s || o), d = c && Ka(t, c, Number(a || l));
  if (!d || !(d.files || []).includes(r)) return null;
  const h = je.in(t.env).fileUrl(c, d.id, r), m = `${jt(c).title} ${d.id} · ${Ue(r)}`, b = gc(r) ? `<img class="file-card-image" src="${h}" alt="${Ue(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${h}" data-attached="${Ue(r)}">${b}<span class="file-card-name">${m}</span></a>` };
}
function kc(e) {
  const t = yc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ct(
  (e, t) => {
    if (t.inline) return null;
    const n = wc(e, t) || kc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const bc = /`([^`\n]+)`/g;
ct((e) => e.replace(bc, (t, n) => `<code>${n}</code>`));
const zs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${gn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ct(
  (e, t) => e.replace(Ya, (n, s, a, o) => zs[s] ? zs[s](a, o, t) : o)
);
const $c = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, xc = new RegExp(`\\b(${Ea}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Mc = new RegExp(`\\b(${Ea}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), _c = (e, t) => `<a class="row-pill" href="#" data-peek="${lt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Sc = (e) => e.replace(Mc, (t, n, s) => s.replace(/\d+/g, (a) => _c(n.replace(/s$/i, ""), a))), Ec = (e) => Sc(e).replace(
  xc,
  (t, n, s, a = "", o) => {
    const l = s || o;
    return `<a class="row-pill" href="#" data-peek="${lt(n)}:${l}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${l}${a ? `:${a}` : ""}</span></a>`;
  }
);
ct(
  (e, t) => t.rowNames === !1 ? e : e.split($c).map((n, s) => s % 2 ? n : Ec(n)).join("")
);
const Cc = ["innerHTML"], Ac = ["innerHTML"], Oc = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = T(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Qn(s, { env: Fe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (i(), u("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => U(pt) && U(pt)(...o)),
      innerHTML: n.value
    }, null, 8, Cc)) : (i(), u("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(pt) && U(pt)(...o)),
      innerHTML: n.value
    }, null, 8, Ac));
  }
}, Ye = /* @__PURE__ */ G(Oc, [["__scopeId", "data-v-1a43d211"]]), Tc = { class: "fact" }, Ic = { class: "fact-label" }, Bc = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (i(), u("div", Tc, [
      p("span", Ic, v(e.label), 1),
      F(Ye, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Rc = /* @__PURE__ */ G(Bc, [["__scopeId", "data-v-3a88ecf8"]]), Lc = { class: "list" }, Dc = { class: "list-label" }, Nc = {
  key: 1,
  class: "list-note"
}, jc = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("div", Lc, [
      (i(!0), u(Y, null, ae(e.items, (o, l) => (i(), V(it(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: z(() => [
          p("span", Dc, v(o.label), 1),
          o.badge ? (i(), V(Ca, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : $("", !0),
          o.note ? (i(), u("span", Nc, v(o.note), 1)) : $("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Pc = /* @__PURE__ */ G(jc, [["__scopeId", "data-v-ebe2ae0a"]]), qc = { class: "table" }, Wc = {
  key: 0,
  class: "table-row empty"
}, Fc = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (i(), u("div", qc, [
      p("div", {
        class: "table-row head",
        style: $e(a.value)
      }, [
        (i(!0), u(Y, null, ae(e.columns, (r) => (i(), u("span", {
          key: r,
          class: "cell"
        }, v(r), 1))), 128))
      ], 4),
      (i(!0), u(Y, null, ae(e.rows, (r, c) => (i(), V(it(r.open ? "button" : "div"), {
        key: c,
        type: r.open ? "button" : void 0,
        class: J(["table-row", r.tone, { opens: r.open }]),
        style: $e(a.value),
        onClick: (d) => r.open && s("open", r.open)
      }, {
        default: z(() => [
          (i(!0), u(Y, null, ae(r.cells, (d, h) => (i(), u("span", {
            key: h,
            class: "cell"
          }, v(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (i(), u("div", Wc, v(e.empty), 1)) : $("", !0)
    ]));
  }
}, Hc = /* @__PURE__ */ G(Fc, [["__scopeId", "data-v-9326a52e"]]), Uc = { class: "stat-value" }, zc = { class: "stat-label" }, Vc = {
  key: 0,
  class: "stat-note"
}, Kc = {
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
    return (s, a) => (i(), V(it(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: z(() => [
        p("span", Uc, v(e.value), 1),
        p("span", zc, v(e.label), 1),
        e.note ? (i(), u("span", Vc, v(e.note), 1)) : $("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Gc = /* @__PURE__ */ G(Kc, [["__scopeId", "data-v-ad0db6d6"]]), Yc = { class: "code" }, Jc = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, l) => (i(), V(ms, {
      value: e.node.type
    }, {
      stack: z(() => [
        F(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: z(() => [
        F(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: z(() => [
        F(Xt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: z(() => [
        F(xl, {
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
      divider: z(() => [...l[2] || (l[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: z(() => [
        F(Gc, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: z(() => [
        F(vl, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: z(() => [
        F(Hc, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: z(() => [
        F(Pc, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: z(() => [
        F(Ye, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: z(() => [
        F(Rc, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: z(() => [
        F(Ca, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: z(() => [
        p("pre", Yc, [
          p("code", null, v(e.node.text), 1)
        ])
      ]),
      file: z(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => a(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Qa = /* @__PURE__ */ G(Jc, [["__scopeId", "data-v-cbdcf540"]]), Zc = { class: "dashboard" }, Xc = { class: "trail" }, Qc = ["onClick"], eu = {
  key: 0,
  class: "gone",
  role: "status"
}, tu = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (b) => b in (n.document.pages || {}), o = R(!!n.page && !a(n.page)), l = R(n.page && !o.value ? [n.page] : []), r = T(() => l.value.at(-1) || n.document.start), c = T(() => (n.document.pages || {})[r.value] || null), d = (b) => ((n.document.pages || {})[b] || {}).title || b, h = (b) => {
      o.value = !1, l.value = [...l.value, b];
    }, m = (b) => {
      o.value = !1, l.value = l.value.slice(0, b);
    };
    return ke(
      () => n.document.start,
      () => l.value = []
    ), (b, _) => (i(), u("div", Zc, [
      e.document.broken ? (i(), V(tn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: z(() => [
          ce(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (i(), V(tn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: z(() => [
          ce(v(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (i(), u(Y, { key: 2 }, [
        p("nav", Xc, [
          p("button", {
            type: "button",
            class: J(["step", { current: !l.value.length }]),
            onClick: _[0] || (_[0] = (j) => m(0))
          }, v(d(e.document.start)), 3),
          (i(!0), u(Y, null, ae(l.value, (j, D) => (i(), u(Y, {
            key: `${D}-${j}`
          }, [
            _[2] || (_[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: J(["step", { current: D === l.value.length - 1 }]),
              onClick: (k) => m(D + 1)
            }, v(d(j)), 11, Qc)
          ], 64))), 128))
        ]),
        o.value ? (i(), u("p", eu, "What you opened is no longer in this dashboard. Here is its start page.")) : $("", !0),
        F(yt, {
          name: "page",
          mode: "out-in"
        }, {
          default: z(() => [
            (i(), u("div", {
              key: r.value,
              class: "page"
            }, [
              F(Qa, {
                node: c.value.view,
                onOpen: h,
                onFile: _[1] || (_[1] = (j) => s("file", j))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : $("", !0)
    ]));
  }
}, ry = /* @__PURE__ */ G(tu, [["__scopeId", "data-v-fbe83734"]]);
function nu(e, t, n, s = () => window) {
  Le(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ee(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const su = (e, t = () => !0) => nu("keydown", (n) => n.key === "Escape" && t() && e());
function eo(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = R(!1), a = T(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return su(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const au = 80, ht = hs([]);
function to(e) {
  const t = Symbol("layer"), n = () => ht.includes(t) && ht.splice(ht.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !ht.includes(t) && ht.push(t), s || n();
    },
    { immediate: !0 }
  ), Ee(n), T(() => au + Math.max(0, ht.indexOf(t)));
}
let no = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return no = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const ou = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function ru(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(ou)];
    if (!l.length) return o.preventDefault();
    const [r, c] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Le(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : no, document.addEventListener("keydown", a), Dt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ee(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const lu = ["aria-modal", "aria-label", "aria-labelledby"], iu = {
  key: 0,
  class: "dialog-head"
}, cu = ["id", "tabindex"], uu = {
  key: 1,
  class: "dialog-foot"
}, du = 500, hu = 400, fu = {
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
    const n = e, s = t, { visible: a, close: o, closed: l } = eo(s, n), r = to(a), c = R(null), d = R(null), h = R(null), m = ga(), b = R(!1), _ = Date.now();
    n.modal && ru(d, () => s("escape"), h);
    function j() {
      if (!n.modal) return n.closable && o();
      b.value = !0, setTimeout(() => b.value = !1, hu);
    }
    function D(C) {
      !n.modal || Date.now() - _ >= du || ![" ", "Enter"].includes(C.key) || (C.preventDefault(), C.stopPropagation());
    }
    const k = () => c.value && (c.value.scrollTop = c.value.scrollHeight), A = new MutationObserver(k);
    return ke(c, (C) => {
      A.disconnect(), C && n.follow && (A.observe(C, { childList: !0, subtree: !0, characterData: !0 }), k());
    }), Ee(() => A.disconnect()), (C, K) => (i(), V(fs, { to: "body" }, [
      F(yt, {
        name: "dialog",
        appear: "",
        onAfterLeave: U(l)
      }, {
        default: z(() => [
          U(a) ? (i(), u("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: $e({ zIndex: U(r) }),
            onClick: be(j, ["self"])
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
              e.bare ? $("", !0) : (i(), u("header", iu, [
                p("h3", {
                  id: U(m),
                  ref_key: "heading",
                  ref: h,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, cu),
                e.closable ? (i(), V(yn, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : $("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                pe(C.$slots, "default", {}, void 0, !0)
              ], 2),
              C.$slots.foot ? (i(), u("footer", uu, [
                pe(C.$slots, "foot", {}, void 0, !0)
              ])) : $("", !0)
            ], 42, lu)
          ], 6)) : $("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, pu = /* @__PURE__ */ G(fu, [["__scopeId", "data-v-6d1ecd98"]]), Ve = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Re = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, mu = 6;
function $s(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const gu = (e) => {
  const t = $s(e, Ve.lineChars), n = Math.max(Ve.minWidth, Math.max(...t.map((s) => s.length)) * Ve.charWidth + Ve.padX * 2);
  return { name: e, lines: t, line: Ve.line, padY: Ve.padY, width: n, height: t.length * Ve.line + Ve.padY * 2 };
};
function vu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (l) => {
    a.set(l, "open"), t.forEach((r, c) => {
      if (r[0] !== l) return;
      const d = a.get(r[1]);
      d === "open" ? s.add(c) : d || o(r[1]);
    }), a.set(l, "done");
  };
  return [...n, ...e].forEach((l) => a.has(l) || o(l)), s;
}
function yu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function wu(e, t, n) {
  const s = [];
  e.forEach((l) => {
    var r;
    return (s[r = n.get(l)] || (s[r] = [])).push(l);
  });
  const a = () => new Map(s.flatMap((l) => l.map((r, c) => [r, c]))), o = (l, r) => {
    const c = a(), d = (h) => {
      const m = r(h).map((b) => c.get(b));
      return m.length ? m.reduce((b, _) => b + _, 0) / m.length : c.get(h);
    };
    return [...l].sort((h, m) => d(h) - d(m));
  };
  for (let l = 0; l < mu; l++) {
    const r = l % 2 === 0, c = s.map((d, h) => h);
    (r ? c.slice(1) : c.slice(0, -1).reverse()).forEach((d) => {
      const h = (m) => t.filter((b) => b[r ? 1 : 0] === m).map((b) => b[r ? 0 : 1]);
      s[d] = o(s[d], h);
    });
  }
  return s;
}
function ku(e, t) {
  const n = /* @__PURE__ */ new Map(), s = (a, o, l, r) => {
    const c = `${a[o]}:${l}`;
    (n.get(c) || n.set(c, []).get(c)).push({ arrow: a, end: o, other: r });
  };
  e.forEach((a) => {
    s(a, "from", a.back ? "top" : "bottom", a.to), s(a, "to", a.back ? "bottom" : "top", a.from);
  });
  for (const a of n.values())
    a.sort((o, l) => t.get(o.other).x - t.get(l.other).x), a.forEach(({ arrow: o, end: l }, r) => o[`${l}Share`] = (r + 1) / (a.length + 1));
}
function bu(e) {
  const t = [...new Set(e.flatMap(([y, g]) => [y, g]))], n = new Set(e.map(([, y]) => y)), s = t.filter((y) => !n.has(y)), a = vu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((y, g) => !a.has(g)), l = yu(t, o), r = wu(t, o, l), c = new Map(t.map((y) => [y, gu(y)])), d = r.map((y) => y.reduce((g, I) => g + c.get(I).width, 0) + Be.across * (y.length - 1)), h = Math.max(...d) + Be.margin * 2, m = xu(e, l, r.length), b = /* @__PURE__ */ new Map();
  let _ = Be.margin;
  r.forEach((y, g) => {
    let I = (h - d[g]) / 2;
    const S = Math.max(...y.map((P) => c.get(P).height));
    y.forEach((P) => {
      const x = c.get(P);
      b.set(P, { ...x, x: I, y: _ + (S - x.height) / 2 }), I += x.width + Be.across;
    }), _ += S + (m[g] ?? Be.down);
  });
  const j = e.map(([y, g, I], S) => ({ from: y, to: g, label: I || "", back: a.has(S) || l.get(g) <= l.get(y) }));
  ku(j, b);
  const D = j.map((y) => Mu(y, b.get(y.from), b.get(y.to))), k = [...b.values()], A = Cu(D, k), C = Math.max(_ - Be.down, ...A.filter((y) => y.label).map((y) => y.label.y + y.label.height));
  return { width: Math.max(h - Be.margin, ...A.filter((y) => y.label).map((y) => y.label.x + y.label.width)) + Be.margin, height: C + Be.margin, nodes: k, arrows: A };
}
const $u = (e) => e ? $s(e, Re.lineChars).length * Re.line + Re.pad * 2 : 0;
function xu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, l]) => {
    const [r, c] = [t.get(a), t.get(o)].sort((d, h) => d - h);
    c > r && (s[r + Math.floor((c - r - 1) / 2)] += $u(l) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function Mu(e, t, n) {
  const s = e.label ? $s(e.label, Re.lineChars) : [], a = s.length ? Math.max(...s.map((b) => b.length)) * Re.charWidth + Re.pad * 2 : 0, o = s.length * Re.line + (s.length ? Re.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, h = (d - r) / 2, m = [{ x: l, y: r }, { x: l, y: r + h }, { x: c, y: d - h }, { x: c, y: d }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: m, path: `M${l} ${r} C${l} ${r + h} ${c} ${d - h} ${c} ${d}` };
}
const _u = ([e, t, n, s], a) => {
  const o = 1 - a, l = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: l("x"), y: l("y") };
}, Su = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Eu = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Re.line);
function Cu(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: l }) => ({ x: s, y: a, width: o, height: l }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, d) => {
      const h = _u(s.curve, c);
      return { x: h.x - s.labelWidth / 2, y: h.y - s.labelHeight / 2 + d, width: s.labelWidth, height: s.labelHeight };
    }, r = Eu.flatMap((c) => Su.map((d) => a(d, c))).find((c) => !n.some((d) => Vs(c, d))) ?? a(0.5, 0);
    for (; n.some((c) => Vs(r, c)); ) r.y += Re.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: Re.line, pad: Re.pad } };
  });
}
const Vs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Au = { class: "flowchart-tools" }, Ou = ["width", "height", "viewBox", "aria-label"], Tu = ["d"], Iu = ["x", "y", "width", "height"], Bu = ["x", "y"], Ru = ["x", "dy"], Lu = {
  key: 0,
  class: "flowchart-label"
}, Du = ["x", "y", "width", "height"], Nu = ["x", "y"], ju = ["x", "dy"], Pu = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => bu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = R(null), r = R({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function d() {
      var A;
      const D = (A = l.value) == null ? void 0 : A.getBoundingClientRect();
      if (!(D != null && D.width)) return;
      const k = Math.min(D.width / a.value.width, D.height / a.value.height, 1.5);
      r.value = { zoom: k, x: (D.width - a.value.width * k) / 2, y: (D.height - a.value.height * k) / 2 };
    }
    function h(D, k, A) {
      const { zoom: C, x: K, y } = r.value, g = Math.min(o.most, Math.max(o.least, C * D));
      r.value = { zoom: g, x: k - (k - K) * g / C, y: A - (A - y) * g / C };
    }
    function m(D) {
      const k = l.value.getBoundingClientRect();
      h(D, k.width / 2, k.height / 2);
    }
    function b(D) {
      const k = l.value.getBoundingClientRect();
      D.ctrlKey || D.metaKey ? h(D.deltaY < 0 ? o.step : 1 / o.step, D.clientX - k.left, D.clientY - k.top) : r.value = { ...r.value, x: r.value.x - D.deltaX, y: r.value.y - D.deltaY };
    }
    function _(D) {
      var k, A, C;
      D.preventDefault(), (k = window.getSelection()) == null || k.removeAllRanges(), c = { x: D.clientX - r.value.x, y: D.clientY - r.value.y }, (C = (A = l.value).setPointerCapture) == null || C.call(A, D.pointerId);
    }
    function j(D) {
      c && (r.value = { ...r.value, x: D.clientX - c.x, y: D.clientY - c.y });
    }
    return Le(d), (D, k) => (i(), V(pu, {
      title: e.title,
      large: "",
      onClose: k[4] || (k[4] = (A) => s("close"))
    }, {
      default: z(() => [
        p("div", Au, [
          F(we, {
            small: "",
            onClick: k[0] || (k[0] = (A) => m(o.step))
          }, {
            default: z(() => [...k[5] || (k[5] = [
              ce("Zoom in", -1)
            ])]),
            _: 1
          }),
          F(we, {
            small: "",
            onClick: k[1] || (k[1] = (A) => m(1 / o.step))
          }, {
            default: z(() => [...k[6] || (k[6] = [
              ce("Zoom out", -1)
            ])]),
            _: 1
          }),
          F(we, {
            small: "",
            onClick: d
          }, {
            default: z(() => [...k[7] || (k[7] = [
              ce("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: be(b, ["prevent"]),
          onPointerdown: _,
          onPointermove: j,
          onPointerup: k[2] || (k[2] = (A) => Os(c) ? c.value = null : c = null),
          onPointercancel: k[3] || (k[3] = (A) => Os(c) ? c.value = null : c = null)
        }, [
          (i(), u("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: $e({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
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
            (i(!0), u(Y, null, ae(a.value.arrows, (A, C) => (i(), u("path", {
              key: `arrow-${C}`,
              class: "flowchart-arrow",
              d: A.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Tu))), 128)),
            (i(!0), u(Y, null, ae(a.value.nodes, (A) => (i(), u("g", {
              key: A.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: A.x,
                y: A.y,
                width: A.width,
                height: A.height,
                rx: "8"
              }, null, 8, Iu),
              p("text", {
                x: A.x + A.width / 2,
                y: A.y + A.padY + A.line / 2
              }, [
                (i(!0), u(Y, null, ae(A.lines, (C, K) => (i(), u("tspan", {
                  key: K,
                  x: A.x + A.width / 2,
                  dy: K ? A.line : 0
                }, v(C), 9, Ru))), 128))
              ], 8, Bu)
            ]))), 128)),
            (i(!0), u(Y, null, ae(a.value.arrows, (A, C) => (i(), u(Y, {
              key: `label-${C}`
            }, [
              A.label ? (i(), u("g", Lu, [
                p("rect", {
                  x: A.label.x,
                  y: A.label.y,
                  width: A.label.width,
                  height: A.label.height,
                  rx: "4"
                }, null, 8, Du),
                p("text", {
                  x: A.label.x + A.label.width / 2,
                  y: A.label.y + A.label.pad + A.label.line / 2
                }, [
                  (i(!0), u(Y, null, ae(A.label.lines, (K, y) => (i(), u("tspan", {
                    key: y,
                    x: A.label.x + A.label.width / 2,
                    dy: y ? A.label.line : 0
                  }, v(K), 9, ju))), 128))
                ], 8, Nu)
              ])) : $("", !0)
            ], 64))), 128))
          ], 12, Ou))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, qu = /* @__PURE__ */ G(Pu, [["__scopeId", "data-v-51d24cfe"]]), Ks = {
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
}, Wu = ["innerHTML"], Fu = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => Ks[t.name] || Ks.dot);
    return (s, a) => (i(), u("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Wu));
  }
}, ze = /* @__PURE__ */ G(Fu, [["__scopeId", "data-v-beb5935c"]]), Hu = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (i(), u("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      F(ze, { name: "fold" })
    ], 2));
  }
}, Rt = /* @__PURE__ */ G(Hu, [["__scopeId", "data-v-d03899bb"]]), Uu = ["data-tip", "aria-label"], zu = {
  key: 0,
  class: "mact-word"
}, Vu = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (i(), u("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      F(ze, { name: "open" }),
      e.open ? (i(), u("span", zu, v(e.label), 1)) : $("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Uu));
  }
}, so = /* @__PURE__ */ G(Vu, [["__scopeId", "data-v-3b292e09"]]), Ku = 120, En = 280, Gu = 160, Yu = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Ju = ["leaving", "resizing", "entering"];
function Zu(e) {
  const t = Ju.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = { width: e.offsetWidth, height: e.offsetHeight };
  return e.classList.add(...t), n;
}
function ao(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = R(t()), a = R("");
  let o = 0;
  const l = (d, h) => Object.assign(d.style, { width: `${h.width}px`, height: `${h.height}px` }), r = (d) => Object.assign(d.style, { width: "", height: "", transition: "" });
  async function c(d) {
    const h = e.value, m = ++o;
    if (!h || !h.offsetWidth || Yu()) {
      s.value = d;
      return;
    }
    const b = { width: h.offsetWidth, height: h.offsetHeight };
    if (l(h, b), a.value = "leaving", await n(Ku), m !== o) return;
    s.value = d, a.value = "resizing", await Dt(), r(h);
    const _ = Zu(h);
    l(h, b), h.offsetWidth, h.style.transition = `width ${En}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${En}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, _), await n(En), m === o && (r(h), a.value = "entering", await n(Gu), m === o && (a.value = ""));
  }
  return ke(t, (d) => c(d)), wt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Xu = { class: "growing-card-top" }, Qu = ["aria-expanded"], ed = { class: "growing-card-avatar" }, td = { class: "growing-card-title" }, nd = { class: "growing-card-more" }, sd = { class: "growing-card-body" }, ad = {
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
    const n = e, s = t, a = R(!1), o = R(null), { folded: l, phase: r } = ao(o, () => !a.value), c = T(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), d = T(() => n.text.split(/\n\s*\n/).filter((h) => h.trim()));
    return (h, m) => (i(), u("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", U(r), { open: !U(l), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Xu, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: m[0] || (m[0] = (b) => a.value = !a.value)
        }, [
          p("span", ed, [
            e.bad ? (i(), V(ze, {
              key: 0,
              name: "cross"
            })) : c.value ? (i(), u(Y, { key: 1 }, [
              ce(v(c.value), 1)
            ], 64)) : (i(), V(ve, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", td, v(e.title), 1),
          F(Rt, { open: a.value }, null, 8, ["open"])
        ], 8, Qu),
        e.action ? (i(), V(so, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: m[1] || (m[1] = (b) => s("act"))
        }, null, 8, ["label", "open"])) : $("", !0),
        e.commentable ? (i(), u("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: m[2] || (m[2] = (b) => s("comment"))
        }, [
          F(ve, {
            name: "bubble",
            size: 13
          })
        ])) : $("", !0)
      ]),
      p("div", nd, [
        p("div", sd, [
          (i(!0), u(Y, null, ae(d.value, (b, _) => (i(), u("p", {
            key: _,
            class: "growing-card-text"
          }, v(b), 1))), 128))
        ])
      ])
    ], 2));
  }
}, od = /* @__PURE__ */ G(ad, [["__scopeId", "data-v-e31436cb"]]), rd = ["title", "aria-label"], ld = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, id = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, cd = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = T(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (i(), u("span", {
      class: J(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (i(), u("svg", ld, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (i(), u("path", id)) : $("", !0)
      ]))
    ], 10, rd));
  }
}, ud = /* @__PURE__ */ G(cd, [["__scopeId", "data-v-6dc92808"]]);
function dd(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function ts(e) {
  const t = dd(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function oo(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Gs(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const Cn = (e) => String(e).padStart(2, "0");
function hd(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Cn(t % 60)}s` : `${Math.floor(t / 3600)}h ${Cn(Math.floor(t % 3600 / 60))}m ${Cn(t % 60)}s`;
}
const fd = "img,pre,table";
function pd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function md(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function gd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(fd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = pd(md(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function vd(e, t) {
  let n = null;
  const s = () => e.value && gd(e.value);
  Le(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([l]) => {
      l.contentRect.width !== a && (a = l.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ee(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const yd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function wd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const kd = ["data-ref"], bd = ["data-from", "data-ref"], $d = { class: "message-body" }, xd = ["title"], Md = ["innerHTML"], _d = ["title"], Sd = ["innerHTML"], Ed = {
  class: "message-faces",
  "data-message-faces": ""
}, Cd = ["title", "data-face", "onClick"], Ad = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Od = ["title", "data-reaction", "onClick"], Td = {
  key: 0,
  class: "message-reaction-count"
}, Id = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Bd = ["href", "title"], Rd = ["src", "alt"], Ld = ["href"], Dd = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, Nd = {
  key: 1,
  "data-message-links-rows": ""
}, jd = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Pd = ["data-sent-worker", "title", "onClick"], qd = { class: "message-foot" }, Wd = { class: "message-time" }, Fd = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, Hd = 140, Ud = 2, zd = 1500, Vd = "An earlier message", Kd = "about", Gd = "sent_to", Yd = 3, Jd = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var he;
    const n = e, s = t, a = R(!1), o = R(null), l = T(() => ["user", "comment"].includes(n.message.type)), r = T(() => {
      const [Q, ee] = (n.message.commented_row || ":").split(":"), Z = lt(Q);
      return Z ? { ref: `${Z}:${ee}`, label: `${jt(Z).title.toLowerCase()} ${ee}` } : null;
    }), c = T(() => n.message.worker_id ?? null), d = R(!1), h = T(() => c.value !== null && ((n.message.text ?? "").length > Hd || (n.message.text ?? "").split(`
`).filter((Q) => Q.trim()).length > Ud)), m = T(() => l.value && !n.message.read_at && !n.message.local);
    async function b() {
      var Q;
      await ((Q = navigator.clipboard) == null ? void 0 : Q.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, zd);
    }
    const _ = T(() => Qn(n.message.text ?? "", { env: "" })), j = T(() => JSON.parse(n.message.flowchart_edges || "[]")), D = R(!1), k = T(() => Qn(n.quote || Vd, { env: "" }));
    function A() {
      const Q = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Q ? Q.scrollIntoView({ block: "center", behavior: "smooth" }) : He(`messages:${n.message.parent_id}`);
    }
    vd(o, () => `${n.message.text} ${n.quote}`);
    const C = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, K = (Q) => `/api/files/message/${n.message.id}/${encodeURIComponent(Q)}`, y = T(() => JSON.parse(n.message.captions || "{}")), g = T(() => (n.message.files ?? []).map((Q) => ({ name: Q, address: K(Q), isImage: C.test(Q), title: y.value[Q] || Q }))), I = T(() => oo(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), S = _e(Ce, null), P = R([]), x = R([]), E = R(!1), w = T(() => `Linked: ${P.value.join(", ")}`), f = T(() => P.value.length >= Yd), O = T(() => `${P.value.length} linked ${P.value.every((Q) => Q.startsWith("task ")) ? "tasks" : "rows"}`);
    async function B() {
      if (!l.value || !(S != null && S.read) || n.message.local) return;
      const Q = await S.read(`link list --source message:${n.message.id}`);
      if (!Q.ok) return;
      const ee = Q.value.rows ?? Q.value ?? [];
      P.value = ee.filter((Z) => Z.link_type === Kd).map((Z) => `${Z.target_model} ${Z.target_id}`), x.value = ee.filter((Z) => Z.link_type === Gd).map((Z) => Z.target_id);
    }
    B(), (he = S == null ? void 0 : S.follow) == null || he.call(S, ["link.*"], B);
    const q = R(!1), re = T(() => wd(n.message.reactions));
    function ie(Q) {
      q.value = !1, s("react", n.message, Q);
    }
    return (Q, ee) => e.message.peer || e.message.recipient ? (i(), u("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      F(od, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (Z) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, kd)) : (i(), u("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", $d, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: r.value }]),
          onClick: ee[6] || (ee[6] = (...Z) => U(pt) && U(pt)(...Z))
        }, [
          r.value ? (i(), u("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: ee[1] || (ee[1] = be((Z) => U(He)(r.value.ref), ["stop"]))
          }, [
            F(ve, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + v(r.value.label), 1)
          ], 8, xd)) : $("", !0),
          e.message.parent_id ? (i(), u("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(A, ["stop"]),
            innerHTML: k.value
          }, null, 8, Md)) : $("", !0),
          c.value !== null ? (i(), u("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${c.value}`,
            onClick: ee[2] || (ee[2] = be((Z) => U(He)(`agents:${c.value}`), ["stop"]))
          }, "Worker " + v(c.value), 9, _d)) : $("", !0),
          p("div", {
            class: J({ "message-folded": h.value && !d.value }),
            "data-message-text": "",
            innerHTML: _.value
          }, null, 10, Sd),
          h.value ? (i(), u("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ee[3] || (ee[3] = be((Z) => d.value = !d.value, ["stop"]))
          }, v(d.value ? "Show less" : "Show more"), 1)) : $("", !0),
          j.value.length ? (i(), u(Y, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[4] || (ee[4] = (Z) => D.value = !0)
            }, "Open the flowchart"),
            D.value ? (i(), V(qu, {
              key: 0,
              title: e.message.text,
              edges: j.value,
              onClose: ee[5] || (ee[5] = (Z) => D.value = !1)
            }, null, 8, ["title", "edges"])) : $("", !0)
          ], 64)) : $("", !0)
        ], 2),
        p("div", {
          class: J(["message-tools", { picking: q.value }]),
          "data-message-tools": ""
        }, [
          q.value ? (i(), u(Y, { key: 0 }, [
            p("div", Ed, [
              (i(!0), u(Y, null, ae(U(yd), (Z) => (i(), u("button", {
                key: Z,
                type: "button",
                class: "message-face",
                title: `React ${Z}`,
                "data-face": Z,
                onClick: (Ae) => ie(Z)
              }, v(Z), 9, Cd))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[7] || (ee[7] = (Z) => q.value = !1)
            }, [
              F(ve, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (i(), u(Y, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ee[8] || (ee[8] = (Z) => q.value = !0)
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
              onClick: b
            }, v(a.value ? "Copied" : "Copy"), 1),
            m.value ? (i(), u("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ee[10] || (ee[10] = (Z) => s("delete", e.message))
            }, "Delete")) : $("", !0)
          ], 64))
        ], 2)
      ]),
      re.value.length ? (i(), u("div", Ad, [
        (i(!0), u(Y, null, ae(re.value, (Z) => (i(), u("button", {
          key: Z.emoji,
          type: "button",
          class: J(["message-reaction", { mine: Z.mine }]),
          title: Z.title,
          "data-reaction": Z.emoji,
          onClick: (Ae) => s("react", e.message, Z.emoji)
        }, [
          ce(v(Z.emoji) + " ", 1),
          Z.count > 1 ? (i(), u("span", Td, v(Z.count), 1)) : $("", !0)
        ], 10, Od))), 128))
      ])) : $("", !0),
      g.value.length ? (i(), u("div", Id, [
        (i(!0), u(Y, null, ae(g.value, (Z) => (i(), u(Y, {
          key: Z.name
        }, [
          Z.isImage ? (i(), u("a", {
            key: 0,
            href: Z.address,
            target: "_blank",
            class: "message-image",
            title: Z.title
          }, [
            p("img", {
              src: Z.address,
              alt: Z.name
            }, null, 8, Rd)
          ], 8, Bd)) : (i(), u("a", {
            key: 1,
            href: Z.address,
            target: "_blank",
            class: "message-file"
          }, v(Z.name), 9, Ld))
        ], 64))), 128))
      ])) : $("", !0),
      P.value.length ? (i(), u("div", Dd, [
        F(ze, {
          class: "message-links-icon",
          name: "linked"
        }),
        f.value && !E.value ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: ee[11] || (ee[11] = (Z) => E.value = !0)
        }, v(O.value), 1)) : (i(), u("span", Nd, [
          F(Ye, {
            text: w.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : $("", !0),
      x.value.length ? (i(), u("div", jd, [
        F(ve, {
          name: "send",
          size: 12
        }),
        (i(!0), u(Y, null, ae(x.value, (Z) => (i(), u("button", {
          key: Z,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Z,
          title: `Open worker ${Z}`,
          onClick: be((Ae) => U(He)(`agents:${Z}`), ["stop"])
        }, "Also sent to worker " + v(Z), 9, Pd))), 128))
      ])) : $("", !0),
      p("div", qd, [
        p("time", Wd, v(I.value), 1),
        Number.isInteger(e.message.id) ? (i(), u("span", Fd, "message " + v(e.message.id), 1)) : $("", !0),
        l.value ? (i(), V(ud, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : $("", !0)
      ])
    ], 8, bd));
  }
}, ly = /* @__PURE__ */ G(Jd, [["__scopeId", "data-v-895cf9ce"]]), on = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], An = 200, ro = (e) => {
  var t;
  return ((t = on.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? on[0].key;
}, iy = (e) => {
  var t;
  return ((t = on.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Zd = ["aria-label"], Xd = 300, Ys = 400, Qd = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: An } },
  setup(e) {
    const t = e, n = T(() => ro(t.value)), s = T(() => n.value < An ? [1, 0.25, 0.25] : n.value === An ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (i(), u("svg", {
      class: J(["ico", "prio", { hot: n.value >= Ys, high: n.value >= Xd && n.value < Ys }]),
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
    ], 10, Zd));
  }
}, cy = /* @__PURE__ */ G(Qd, [["__scopeId", "data-v-b10e610f"]]), eh = {
  working: { word: "Working", dot: "running" },
  waiting: { word: "Waiting", dot: "you" },
  stuck: { word: "Stuck", dot: "failed" },
  stopped: { word: "Stopped", dot: "" },
  idle: { word: "Idle", dot: "queued" }
}, th = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "stuck", silent: "stuck", stopped: "stopped" }, nh = (e) => {
  const t = th[e.state] || "idle";
  return { key: t, ...eh[t] };
}, sh = [
  { key: "working", label: "Working", icon: "agents", hidden: (e) => `${e} working` },
  { key: "waiting", label: "Blocked", icon: "warn", hidden: (e) => `${e} blocked` },
  { key: "idle", label: "Idle", icon: "pause", hidden: (e) => `${e} idle` },
  { key: "stopped", label: "Not running", icon: "x", hidden: (e) => `${e} not running` }
], ah = [
  { key: "environment", label: "Environment agents", icon: "branch", hidden: (e) => `${e} ${e === 1 ? "environment agent" : "environment agents"}` },
  { key: "worker", label: "Workers", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "worker" : "workers"}` },
  { key: "subagent", label: "Subagents", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "helper" : "helpers"}` }
], oh = { working: "working", waiting: "waiting", stuck: "waiting", idle: "idle", stopped: "stopped" }, rn = (e) => oh[nh(e.card).key] || "idle";
function rh(e, t) {
  return t.states[rn(e)] === !1 ? rn(e) : t.kinds[e.kind] === !1 ? e.kind : "";
}
const lh = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), Js = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Zs = (e, t) => Js[rn(e)] - Js[rn(t)], Xs = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, uy = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => Zs(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || lh(s, a)) : [...e].sort((s, a) => Zs(s, a) || (Xs[t] || Xs.state)(s, a)), ih = Object.fromEntries([...sh, ...ah].map((e) => [e.key, e.hidden]));
function dy(e, t) {
  const n = {};
  return e.forEach((s) => {
    const a = rh(s, t);
    a && (n[a] = (n[a] || 0) + 1);
  }), Object.entries(n).map(([s, a]) => ih[s](a));
}
const ch = ["aria-checked", "aria-haspopup", "onClick"], uh = {
  key: 0,
  class: "segmented-dot"
}, dh = {
  key: 1,
  class: "segmented-count"
}, hh = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ga();
    return (a, o) => {
      const l = Yo("tip");
      return i(), u("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (i(!0), u(Y, null, ae(e.options, (r) => et((i(), u("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: J(["segmented-option", { on: r.key === e.value }]),
          onClick: (c) => n("pick", r.key)
        }, [
          r.dot ? (i(), u("span", uh)) : $("", !0),
          ce(" " + v(r.label) + " ", 1),
          r.count !== void 0 ? (i(), u("em", dh, v(r.count), 1)) : $("", !0)
        ], 10, ch)), [
          [l, r.tip || r.title, `${U(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, fh = /* @__PURE__ */ G(hh, [["__scopeId", "data-v-ca953072"]]), ph = { class: "form-field" }, mh = { class: "form-field-head" }, gh = ["for"], vh = {
  key: 0,
  class: "form-field-aside"
}, yh = {
  key: 0,
  class: "form-field-help"
}, wh = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (i(), u("div", ph, [
      p("div", mh, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, gh),
        t.$slots.aside ? (i(), u("span", vh, [
          pe(t.$slots, "aside", {}, void 0, !0)
        ])) : $("", !0)
      ]),
      pe(t.$slots, "default", {}, void 0, !0),
      e.help ? (i(), u("p", yh, v(e.help), 1)) : $("", !0)
    ]));
  }
}, hy = /* @__PURE__ */ G(wh, [["__scopeId", "data-v-dd7cdcff"]]), kh = { class: "list-row" }, bh = {
  key: 0,
  class: "list-row-kind"
}, $h = { class: "list-row-main" }, xh = {
  key: 0,
  class: "list-row-title"
}, Mh = { class: "list-row-body" }, _h = {
  key: 1,
  class: "list-row-end"
}, Sh = {
  key: 1,
  class: "list-row-text"
}, Eh = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (i(), u("div", kh, [
      e.kind ? (i(), u("span", bh, v(e.kind), 1)) : $("", !0),
      p("div", $h, [
        e.title ? (i(), u("span", xh, v(e.title), 1)) : $("", !0),
        p("div", Mh, [
          pe(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (i(), u("div", _h, [
          pe(t.$slots, "end", {}, void 0, !0)
        ])) : $("", !0)
      ]),
      e.text ? (i(), u("span", Sh, v(e.text), 1)) : $("", !0)
    ]));
  }
}, fy = /* @__PURE__ */ G(Eh, [["__scopeId", "data-v-63155fba"]]), Ch = {
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
}, Ah = { claude: "Claude Code", codex: "Codex" }, Oh = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Th = {
  key: 1,
  class: "menu-item-text"
}, Ih = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (i(), u("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (i(), u("span", Oh, v(e.checked ? "✓" : ""), 1)) : $("", !0),
      e.description ? (i(), u("span", Th, [
        p("span", null, [
          pe(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, v(e.description), 1)
      ])) : pe(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, vt = /* @__PURE__ */ G(Ih, [["__scopeId", "data-v-fec99974"]]), Bh = (e, t, n) => Math.max(t, Math.min(n, e)), Rh = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, lo = /* @__PURE__ */ new WeakMap(), Lh = (e, t) => lo.set(e, t);
function Dh(e, t) {
  for (let n = t; n; n = lo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Nh(e, t) {
  const n = (s) => {
    var o, l;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    a && !Dh(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ee(() => window.removeEventListener("click", n));
}
const ft = 8, jh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = R(null), o = (f) => f ? `${f}px` : void 0, l = T(() => ({
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
      const O = f.closest(".pane, .float-window");
      return O ? h(O.getBoundingClientRect()) : d();
    }, b = (f, O) => `${Math.max(0, f ? Math.min(f, O) : O)}px`;
    function _(f, O) {
      return {
        below: f.bottom - O.bottom - s.gap - ft,
        above: O.top - f.top - s.gap - ft,
        across: f.right - f.left - 2 * ft
      };
    }
    function j(f) {
      const O = m(s.anchor), B = _(O, f);
      return r.value.w <= B.across && r.value.h <= Math.max(B.below, B.above) ? O : d();
    }
    const D = T(() => {
      if (!c.value) return l.value;
      const f = c.value, O = j(f), B = _(O, f), { w: q, h: re } = r.value, ie = s.align === "auto" ? f.left + f.right > O.left + O.right : s.align === "right", he = Bh(ie ? f.right - q : f.left, O.left + ft, Math.max(O.left + ft, O.right - q - ft)), ee = re > B.below && B.above > B.below ? { bottom: `${window.innerHeight - f.top + s.gap}px`, maxHeight: b(s.maxHeight, B.above) } : { top: `${f.bottom + s.gap}px`, maxHeight: b(s.maxHeight, B.below) };
      return { ...l.value, ...ee, left: `${he}px`, maxWidth: b(s.maxWidth, B.across) };
    }), k = n, A = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function C(f) {
      const O = A(), B = O.indexOf(document.activeElement);
      O[(B + f + O.length) % O.length].focus();
    }
    const K = { ArrowDown: () => C(1), ArrowUp: () => C(-1), Escape: () => k("close") }, y = (f) => K[f.key] && (f.preventDefault(), K[f.key]()), g = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let I = 0;
    const S = new ResizeObserver(() => {
      cancelAnimationFrame(I), I = requestAnimationFrame(g);
    });
    Nh(a, (f) => s.anchor && !s.anchor.contains(f.target) && k("close"));
    const P = (f, O) => ["top", "left", "right", "bottom"].some((B) => Math.abs(f[B] - O[B]) > 1), x = (f) => f.bottom < 0 || f.top > window.innerHeight;
    let E = 0;
    function w() {
      if (s.anchor) {
        const f = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || x(f)) return k("close");
        P(f, c.value) && (c.value = f);
      }
      E = requestAnimationFrame(w);
    }
    return Le(() => {
      s.anchor && a.value && Lh(a.value, s.anchor), g(), a.value && S.observe(a.value), !s.plain && A()[0] && A()[0].focus(), w();
    }), Ee(() => {
      S.disconnect(), cancelAnimationFrame(E), cancelAnimationFrame(I);
    }), t({ element: a }), (f, O) => (i(), V(fs, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", Qe({
        ref_key: "panel",
        ref: a
      }, f.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: D.value,
        onKeydown: y
      }), [
        pe(f.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), xs = /* @__PURE__ */ G(jh, [["__scopeId", "data-v-3d203970"]]), Ph = ["aria-expanded"], qh = { class: "drop-label" }, Wh = ["value"], Fh = {
  key: 1,
  class: "drop-lead"
}, Hh = { class: "drop-item-text" }, Uh = {
  key: 2,
  class: "drop-note"
}, zh = {
  key: 1,
  class: "drop-none"
}, Vh = {
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
    const n = e, s = t, a = R(!1), o = R(null), l = R(""), r = T(() => {
      const d = l.value.trim().toLowerCase();
      return d ? n.items.filter((h) => `${h.label} ${h.note || ""}`.toLowerCase().includes(d)) : n.items;
    });
    function c(d) {
      a.value = !1, s("pick", d);
    }
    return (d, h) => (i(), u("div", {
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
        e.icon ? (i(), V(ve, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : $("", !0),
        p("span", qh, v(e.label), 1),
        F(ve, {
          name: "down",
          size: 11
        })
      ], 10, Ph),
      a.value ? (i(), V(xs, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: h[2] || (h[2] = (m) => a.value = !1)
      }, {
        default: z(() => [
          e.searchable ? (i(), u("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: h[1] || (h[1] = (m) => l.value = m.target.value)
          }, null, 40, Wh)) : $("", !0),
          (i(!0), u(Y, null, ae(r.value, (m) => (i(), V(vt, {
            key: m.key,
            on: m.key === e.picked,
            "data-drop-item": m.key,
            onClick: (b) => c(m)
          }, {
            default: z(() => [
              m.running !== void 0 ? (i(), u("span", {
                key: 0,
                class: J(["drop-dot", { live: m.running }])
              }, null, 2)) : $("", !0),
              m.lead ? (i(), u("span", Fh, v(m.lead), 1)) : $("", !0),
              p("span", Hh, v(m.label), 1),
              m.note ? (i(), u("span", Uh, v(m.note), 1)) : $("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? $("", !0) : (i(), u("p", zh, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : $("", !0)
    ], 2));
  }
}, Kh = /* @__PURE__ */ G(Vh, [["__scopeId", "data-v-29dfcce5"]]), py = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => [
      ...Ch[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = T(() => (a.value.find((l) => l.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (l, r) => (i(), V(Kh, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${U(Ah)[e.provider]} model`,
      onPick: r[0] || (r[0] = (c) => s("pick", c.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Gh = ["aria-label"], Yh = { class: "head" }, Jh = { class: "names" }, Zh = { class: "body" }, Xh = {
  key: 0,
  class: "foot"
}, Qh = {
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
    const n = e, s = t, { visible: a, close: o, closed: l } = eo(s, n), r = to(a);
    return (c, d) => (i(), V(fs, { to: "body" }, [
      F(yt, {
        name: "side",
        appear: "",
        onAfterLeave: U(l)
      }, {
        default: z(() => [
          U(a) ? (i(), u("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: $e({ "--depth": e.depth, zIndex: U(r) }),
            "data-side-panel": "",
            onClick: d[0] || (d[0] = be((...h) => U(o) && U(o)(...h), ["self"]))
          }, [
            p("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (i(), u(Y, { key: 0 }, [
                p("header", Yh, [
                  p("div", Jh, [
                    p("h2", null, v(e.title), 1),
                    e.abstract ? (i(), V(Ye, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : $("", !0)
                  ]),
                  pe(c.$slots, "actions", {}, void 0, !0),
                  F(yn, {
                    title: e.closeLabel,
                    onClick: U(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                p("div", Zh, [
                  pe(c.$slots, "default", {}, void 0, !0)
                ]),
                c.$slots.foot ? (i(), u("footer", Xh, [
                  pe(c.$slots, "foot", {}, void 0, !0)
                ])) : $("", !0)
              ], 64)) : pe(c.$slots, "default", {}, void 0, !0, 1)
            ], 10, Gh)
          ], 6)) : $("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, my = /* @__PURE__ */ G(Qh, [["__scopeId", "data-v-c9a3f43a"]]), ns = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, ef = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ps(), n = T(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => et((i(), u("textarea", Qe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [U(ns), U(t).value]
    ]);
  }
}), gy = /* @__PURE__ */ G(ef, [["__scopeId", "data-v-e130a5b9"]]), tf = {
  key: 1,
  class: "text-field-label"
}, nf = {
  key: 2,
  class: "text-field-end"
}, sf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Vn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var h;
    const n = zn(e, "modelValue"), s = ps(), a = "onUpdate:modelValue" in (((h = Jo()) == null ? void 0 : h.vnode.props) || {}), o = T(() => a ? n.value : s.value), l = (m) => a && (n.value = m.target.value), r = T(
      () => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), c = T(() => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "value"))), d = R(null);
    return t({ focus: () => d.value && d.value.focus() }), (m, b) => e.label || e.icon || m.$slots.end ? (i(), u("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: m.$slots.end }, U(s).class]),
      style: $e(U(s).style)
    }, [
      e.icon ? (i(), V(ve, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : $("", !0),
      e.label ? (i(), u("span", tf, v(e.label), 1)) : $("", !0),
      et(p("input", Qe({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [U(ns), o.value]
      ]),
      m.$slots.end ? (i(), u("span", nf, [
        pe(m.$slots, "end", {}, void 0, !0)
      ])) : $("", !0)
    ], 6)) : et((i(), u("input", Qe({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: l }), null, 16)), [
      [U(ns), o.value]
    ]);
  }
}), vy = /* @__PURE__ */ G(sf, [["__scopeId", "data-v-d9c38ca8"]]), Qs = (e) => e.page * e.size < e.total;
function af(e, t, { incremental: n = !1 } = {}) {
  const s = pn(), a = R([]), o = R(""), l = R(!1), r = R(!1), c = R(""), d = R(null);
  async function h(k) {
    const A = await s.read(`${e} --before-id ${k + 1} --limit 1`);
    if (!A.ok) return j();
    const C = A.value.rows.find((K) => K.id === k);
    a.value = C ? a.value.map((K) => K.id === k ? C : K) : a.value.filter((K) => K.id !== k);
  }
  async function m(k) {
    if (n && String((k == null ? void 0 : k.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== k.row_id));
    if (n && (k != null && k.row_id) && !String(k.event ?? "").endsWith(".create") && a.value.some((g) => g.id === k.row_id)) return h(k.row_id);
    if (!(n && a.value.length && String((k == null ? void 0 : k.event) ?? "").endsWith(".create"))) return j();
    const C = Math.max(...a.value.map((g) => g.id)), K = await s.read(`${e} --after-id ${C}`);
    if (!K.ok) return j();
    const y = new Set(a.value.map((g) => g.id));
    a.value = [...K.value.rows.filter((g) => !y.has(g.id)), ...a.value];
  }
  async function b() {
    if (!a.value.length) return !1;
    const k = Math.min(...a.value.map((K) => K.id)), A = await s.read(`${e} --before-id ${k}`);
    if (!A.ok || !A.value.rows.length) return r.value = !1;
    r.value = Qs(A.value);
    const C = new Set(a.value.map((K) => K.id));
    return a.value = [...a.value, ...A.value.rows.filter((K) => !C.has(K.id))], !0;
  }
  let _ = 0;
  async function j() {
    const k = ++_, A = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (k !== _) return;
    const C = A.ok ? s.shared ? [A.value] : A.value.rows : [], K = C.length ? Math.min(...C.map((y) => y.id)) : 0;
    a.value = n && A.ok && K ? [...a.value.filter((y) => y.id > Math.max(...C.map((g) => g.id))), ...C, ...a.value.filter((y) => y.id < K)] : C, A.ok && !a.value.some((y) => y.id < K) && (r.value = !s.shared && Qs(A.value)), o.value = A.ok ? "" : A.error, l.value = !0;
  }
  async function D(k) {
    const A = await s.run(k);
    return c.value = A.ok ? "" : A.error, d.value = A.ok ? A.value : null, await j(), A;
  }
  return s.follow(t, m), j(), { rows: a, failure: o, loaded: l, more: r, load: j, older: b, act: D, actionFailure: c, answer: d, context: s };
}
const of = { class: "title" }, rf = { class: "state" }, lf = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = af(t.line, t.events);
    return (o, l) => (i(), V(Jr, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: z(({ row: r }) => [
        p("span", of, v(r.title), 1),
        p("span", rf, v(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, yy = /* @__PURE__ */ G(lf, [["__scopeId", "data-v-a69084cd"]]);
function cf(e = 1e3, t = null) {
  const n = R(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ke(t, a, { immediate: !0 }) : a(!0), Ee(() => clearInterval(s)), n;
}
const On = R(Date.now() / 1e3);
let ea = 0, Kt = 0;
function uf() {
  return Kt || (On.value = Date.now() / 1e3, ea = setInterval(() => On.value = Date.now() / 1e3, 1e3)), Kt += 1, va() && ya(() => {
    Kt -= 1, Kt || clearInterval(ea);
  }), On;
}
const df = ["title", "data-figure-mark", "data-folded", "data-open"], hf = {
  key: 2,
  class: "worker"
}, ff = { class: "head" }, pf = { key: 0 }, mf = {
  key: 3,
  class: "status"
}, gf = {
  key: 0,
  class: "figure"
}, vf = {
  key: 1,
  class: "ran-for"
}, yf = { key: 2 }, wf = {
  key: 3,
  class: "news"
}, kf = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, bf = {
  key: 6,
  class: "settled"
}, $f = {
  key: 1,
  class: "bar"
}, xf = {
  key: 3,
  class: "detail body"
}, Mf = {
  key: 0,
  class: "body-label"
}, _f = ["title"], Sf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ps(), s = ["onClick", "onAct"], a = T(() => Object.fromEntries(Object.entries(n).filter(([Q]) => !s.includes(Q)))), o = R(!1), l = T(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = T(() => t.open !== void 0), c = T(() => r.value || l.value), d = T(() => r.value ? t.open : o.value), h = T(() => r.value ? !t.open : l.value && !o.value), m = T(() => !!(t.mark.action && n.onAct)), b = T(() => c.value || m.value || !!n.onClick), _ = R(null), j = R(null), { folded: D, phase: k } = ao(_, () => h.value);
    function A(Q) {
      var ee, Z;
      if (!(Q.target !== _.value && !j.value.contains(Q.target))) {
        if (r.value) return (ee = n.onClick) == null ? void 0 : ee.call(n, Q);
        if (l.value) return void (o.value = !o.value);
        (Z = n.onAct || n.onClick) == null || Z(Q);
      }
    }
    const C = (Q) => n.onAct(Q), K = ["failed", "unfinished"], y = T(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? K.includes(t.mark.state) ? "danger" : "good" : ""), g = T(() => t.mark.color ? t.mark.color : y.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : y.value ? `var(--tone-${y.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), I = T(() => g.value || "var(--tone-work)"), S = T(() => !t.mark.ending && !t.mark.ended && y.value !== "stopped"), P = uf(), x = T(
      () => t.mark.began_at && S.value && !t.mark.figure && !t.mark.counting ? hd(P.value - t.mark.began_at) : ""
    ), E = T(() => {
      const { started: Q, ended: ee } = t.mark;
      return Q ? ee ? `ran ${Gs(ee - Q, !0)}` : Gs(P.value - Q, !0) : x.value;
    }), w = ["bad", "danger", "warn"], f = T(() => w.includes(y.value) || t.mark.asks ? "attention" : S.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), O = ["bad", "danger"], B = T(() => O.includes(y.value)), q = T(() => f.value === "process" ? "running" : B.value ? "cross" : y.value === "stopped" ? "stopped" : y.value === "good" ? "tick" : ""), re = T(
      () => !!(t.mark.figure || E.value || t.mark.docked || t.mark.stopping || q.value || t.mark.settled || t.mark.news)
    ), ie = T(() => [t.mark.title, t.mark.time ? oo(t.mark.time) : ""].filter(Boolean).join(" · ")), he = T(() => ({
      ...g.value ? { "--mark": g.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (Q, ee) => (i(), u("div", Qe(a.value, {
      ref_key: "root",
      ref: _,
      class: [
        "mark",
        `w-${f.value}`,
        U(k),
        {
          open: d.value,
          folding: r.value && h.value,
          live: b.value,
          failed: B.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: g.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: he.value,
      title: ie.value,
      "data-figure-mark": e.mark.key,
      "data-folded": U(D) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: A
    }), [
      (i(), V(it(b.value ? "button" : "span"), {
        ref_key: "top",
        ref: j,
        class: "top",
        type: b.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!d.value) : void 0
      }, {
        default: z(() => [
          e.mark.markIcon ? (i(), V(ze, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (i(), V(ve, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (i(), u("span", hf, v(e.mark.worker), 1)) : $("", !0),
          p("span", ff, [
            F(Ye, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (i(), u("strong", pf, v(e.mark.name), 1)) : $("", !0),
            c.value ? (i(), V(Rt, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : $("", !0)
          ]),
          re.value ? (i(), u("span", mf, [
            e.mark.figure ? (i(), u("span", gf, v(e.mark.figure), 1)) : $("", !0),
            E.value ? (i(), u("span", vf, v(E.value), 1)) : $("", !0),
            e.mark.stopping ? (i(), u("span", yf, "Stopping")) : $("", !0),
            e.mark.news ? (i(), u("span", wf, v(e.mark.news), 1)) : $("", !0),
            q.value === "running" ? (i(), u("span", kf)) : q.value ? (i(), V(ze, {
              key: 5,
              class: J(["sign", q.value]),
              name: q.value
            }, null, 8, ["class", "name"])) : $("", !0),
            e.mark.settled ? (i(), u("span", bf, v(e.mark.settled), 1)) : $("", !0)
          ])) : $("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (i(), V(so, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: be(C, ["stop"])
      }, null, 8, ["label", "open"])) : $("", !0),
      (e.mark.figure || e.mark.counting) && S.value ? (i(), u("span", $f, [
        p("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: I.value })
        }, null, 4)
      ])) : $("", !0),
      e.mark.detail && !U(D) ? (i(), V(Ye, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : $("", !0),
      e.mark.body && !U(D) ? (i(), u("div", xf, [
        e.mark.bodyLabel ? (i(), u("p", Mf, v(e.mark.bodyLabel), 1)) : $("", !0),
        F(Ye, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : $("", !0),
      e.mark.command && !U(D) ? (i(), u("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, _f)) : $("", !0),
      e.mark.card ? (i(), V(Ye, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : $("", !0),
      pe(Q.$slots, "default", {
        shown: !U(D)
      }, void 0, !0)
    ], 16, df));
  }
}), io = /* @__PURE__ */ G(Sf, [["__scopeId", "data-v-74d78abb"]]), Ef = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function co(e) {
  var n;
  const t = Ef[e] || ((n = jt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Cf = (e) => co(String(e).split(":")[0]), uo = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Af = { passed: "good", failed: "danger", warned: "warn", running: "" }, Of = { good: "good", warn: "warn", danger: "danger" }, ta = {
  "open row": (e) => He(`${e.target_model}:${e.target_id}`),
  "open page": (e) => qr(e.target_model, e.target_id || 0)
}, Tf = { "open row": (e) => Cf(e.target_model), "open page": () => co("pages") };
function If(e, t) {
  const n = t || {}, s = ta[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Af[e.outcome] || "" : Of[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Tf[s](e) : "",
    handlers: s ? { onAct: () => ta[s](e) } : {}
  };
}
const Bf = 24, Rf = 1e3, na = 2e3, Lf = 0.25, Df = 5e3;
function Nf(e, t = Bf, n = () => !0) {
  const s = R(!1), a = R(0), o = R(!1);
  let l = 0, r = 0, c = 0;
  const d = () => e && "value" in e ? e.value : e, h = () => {
    const y = d();
    return y ? y.scrollHeight - y.scrollTop - y.clientHeight : 0;
  }, m = () => !d() || h() <= t;
  function b(y) {
    if (clearTimeout(l), !y) {
      o.value = !1, c = Date.now();
      return;
    }
    const g = Date.now() - c < na ? na : Rf;
    l = setTimeout(() => o.value = s.value, g);
  }
  function _() {
    clearTimeout(r), s.value = !1, a.value = 0, b(!1);
  }
  function j(y = !1) {
    const g = d();
    g && y && g.scrollTo ? g.scrollTo({ top: g.scrollHeight, behavior: "smooth" }) : g && (g.scrollTop = g.scrollHeight), _();
  }
  function D() {
    A(), !s.value && (s.value = !0, b(!0));
  }
  const k = () => !!d() && h() <= d().clientHeight * Lf;
  function A() {
    clearTimeout(r), k() && (r = setTimeout(() => s.value && k() && n() && j(!0), Df));
  }
  function C() {
    m() ? _() : D();
  }
  function K(y = 1, g = !1) {
    s.value ? a.value += Math.max(0, y) : j(g);
  }
  return va() && ya(() => [l, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: h, atBottom: m, follow: _, toBottom: j, left: D, scrolled: C, arrived: K };
}
const jf = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Pf = (e) => String(e ?? "").replace(jf, ""), qf = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(null), { away: o, scrolled: l, arrived: r, toBottom: c } = Nf(a);
    ke(
      () => n.lines.length,
      () => Dt(() => r()),
      { immediate: !0 }
    );
    function d(h) {
      l(), s("older", h.target);
    }
    return (h, m) => (i(), u("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: d
    }, [
      ce(v(U(Pf)(e.lines.join(`
`)) || e.empty), 1),
      U(o) ? (i(), u("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (b) => U(c)(!0))
      }, "Follow")) : $("", !0)
    ], 544));
  }
}, Wf = /* @__PURE__ */ G(qf, [["__scopeId", "data-v-d9fa8127"]]), Ff = 1e4;
class Hf {
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
    return this.heardAt !== null && t - this.heardAt > Ff;
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
const Uf = {
  key: 0,
  class: "frame-note"
}, zf = {
  key: 0,
  class: "frame-note"
}, Vf = ["src", "title"], Kf = 1e3, Gf = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = pn(), s = R(null), a = R(!1), o = R(!1);
    let l = null, r = 0;
    return Le(() => {
      l = new Hf(s.value, n), l.start(), r = setInterval(() => {
        a.value = l.silent();
      }, Kf);
    }), Ee(() => {
      l == null || l.stop(), clearInterval(r);
    }), (c, d) => o.value ? (i(), u("p", Uf, "This window was closed because it stopped answering.")) : (i(), u(Y, { key: 1 }, [
      a.value ? (i(), u("div", zf, [
        d[2] || (d[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        F(we, {
          onClick: d[0] || (d[0] = (h) => o.value = !0)
        }, {
          default: z(() => [...d[1] || (d[1] = [
            ce("Close the window", -1)
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
      }, null, 8, Vf)
    ], 64));
  }
}, Yf = /* @__PURE__ */ G(Gf, [["__scopeId", "data-v-32a49046"]]), Jf = 0, Zf = "/api/lines", Xf = "/api/line";
class Qf {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Jf));
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
        const n = await De.raw(Zf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await De.raw(Xf, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const e1 = new Qf();
class t1 {
  constructor() {
    this.follows = [], this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, s, a = () => !0) {
    const o = { window: t, patterns: n, heard: s, visible: a };
    return this.follows.push(o), () => this.follows = this.follows.filter((l) => l !== o);
  }
  count(t) {
    return this.follows.filter((n) => n.window === t).length;
  }
  stopAll(t) {
    this.follows = this.follows.filter((n) => n.window !== t), this.held = new Set([...this.held].filter((n) => n.window !== t));
  }
  dispatch(t) {
    for (const n of this.follows)
      n.patterns.some((s) => ho(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ho(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const n1 = Symbol("pane-page"), s1 = { 1: "refused", 2: "usage", 3: "fault" }, a1 = 100, o1 = /"([^"]*)"|'([^']*)'|(\S+)/g;
function r1({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: l, open: r, options: c = R({}), declared: d = [], page: h = null, setOption: m = () => {
}, autoScroll: b = "", tabs: _ = [], search: j = {}, readOnly: D = !1, shared: k = null }) {
  const A = /* @__PURE__ */ new Map(), C = new AbortController(), K = (y) => {
    const g = A.get(y);
    if (g && performance.now() - g.at < a1) return g.answer;
    const I = At(e, y, t, C.signal);
    return A.set(y, { answer: I, at: performance.now() }), I;
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: h,
    visible: T(() => s()),
    permissions: a,
    autoScroll: b,
    tabs: _,
    search: j,
    readOnly: D,
    shared: k,
    read: K,
    run: (y) => At(e, y, t, C.signal),
    upload: (y) => i1(y, C.signal),
    cancel: () => C.abort(),
    follow: (y, g) => l.follow(e, y.filter((I) => o.some((S) => ho(S, I))), g, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (y) => T(() => {
      var g;
      return c.value[y] ?? ((g = d.find((I) => I.key === y)) == null ? void 0 : g.default);
    }),
    setting: async (y, g) => {
      const I = await K(`window setting ${e} ${y}`);
      return I.ok ? I.value.value : g;
    },
    setOption: m,
    keep: (y, g) => At(e, ["window", "save-setting", e, y, JSON.stringify(g)], t, C.signal)
  };
}
function l1(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const ln = { ok: !1, failure: "cancelled", error: "" };
async function At(e, t, n, s = void 0) {
  try {
    const a = await e1.add({ window: e, line: Array.isArray(t) ? t : c1(t), environment: n }, s);
    return s != null && s.aborted ? ln : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: s1[a.code] || "fault", error: l1(a.error) };
  } catch (a) {
    return s != null && s.aborted ? ln : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function i1(e, t = void 0) {
  try {
    const n = await De.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? ln : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? ln : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function c1(e) {
  return [...e.matchAll(o1)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function u1({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const d1 = {
  class: "allowance-prompt",
  role: "dialog"
}, h1 = { class: "allowance-prompt-text" }, f1 = { class: "allowance-prompt-buttons" }, p1 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("div", d1, [
      p("p", h1, v(U(u1)(e.request)), 1),
      p("div", f1, [
        F(we, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: z(() => [...a[2] || (a[2] = [
            ce("Allow", -1)
          ])]),
          _: 1
        }),
        F(we, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: z(() => [...a[3] || (a[3] = [
            ce("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, m1 = /* @__PURE__ */ G(p1, [["__scopeId", "data-v-102dc765"]]), Tn = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), V(tn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: z(() => [
        ce(v(e.reason) + " ", 1),
        e.retry ? (i(), V(we, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: z(() => [...a[2] || (a[2] = [
            ce("Retry", -1)
          ])]),
          _: 1
        })) : $("", !0),
        e.removable ? (i(), V(we, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: z(() => [...a[3] || (a[3] = [
            ce("Remove tab", -1)
          ])]),
          _: 1
        })) : $("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, g1 = ["data-window", "data-agent"], v1 = {
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
    function l() {
      a.value = "", o.value++;
    }
    const r = _e(Mr, null), c = r1({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: T(() => n.options),
      declared: n.declared,
      page: _e(n1, null),
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
    Zo(Ce, c), ke(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ee(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), Xo((m) => (a.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const d = () => ds(n.component), h = () => {
      var m, b;
      return ((b = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : b.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, b) => (i(), u("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      h() ? (i(), V(m1, {
        key: 0,
        request: h(),
        onAnswer: b[0] || (b[0] = (_) => e.prompts.answer(_))
      }, null, 8, ["request"])) : $("", !0),
      e.unavailableReason ? (i(), V(Tn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (i(), V(Tn, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (i(), V(d, { key: o.value })) : (i(), V(Tn, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: b[1] || (b[1] = (_) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, g1));
  }
}, fo = /* @__PURE__ */ G(v1, [["__scopeId", "data-v-32203cbc"]]), y1 = {
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
    const n = e, s = t, a = { render: () => ds(Yf, { src: n.entry.entry_url }) };
    return (o, l) => (i(), V(fo, {
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
      onOption: l[0] || (l[0] = (r, c) => s("option", r, c))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "search", "events", "unavailable-reason"]));
  }
}, ss = "journal.stale-build-reload", w1 = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function k1(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ss) === e.message) return !1;
    t.setItem(ss, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function b1(e = window.sessionStorage) {
  try {
    e.removeItem(ss);
  } catch {
    return;
  }
}
const $1 = ["data-window"], x1 = {
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
    const n = e, s = t, a = fn(null), o = R("");
    return ke(
      () => n.entry.entry_url,
      async (l) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              l
            )).default, b1();
          } catch (r) {
            if (w1(r) && k1(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !a.value && !o.value && !e.entry.unavailable_reason ? (i(), u("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      F(kt, { shape: "cards" })
    ], 8, $1)) : (i(), V(fo, {
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
}, M1 = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new t1(), s = ((r = _e(Ce, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = T(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), l = T(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, d) => l.value ? (i(), V(x1, {
      key: 0,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (i(), V(y1, {
      key: 1,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, _1 = { class: "mark-more-inner" }, S1 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, E1 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, C1 = {
  key: 3,
  class: "mark-lines"
}, A1 = "process", sa = "task", O1 = 2e3, T1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = _e(Ce), s = T(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = T(() => uo.has(t.mark.variant) && t.mark.detail || ""), o = T(() => t.mark.target_model === sa ? t.mark.target_id : 0), l = R([]), r = R(!1), c = R(""), d = T(() => t.mark.target_model === A1 && !!t.mark.target_id);
    async function h() {
      const _ = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, c.value = _.ok ? "" : _.error, _.ok && (l.value = _.value.lines);
    }
    let m = null;
    const b = () => clearInterval(m);
    return ke(() => t.shown && d.value, (_) => {
      b(), _ && (h(), t.mark.ended_at || (m = setInterval(h, O1)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (_) => _ && t.shown && d.value && (b(), h())), Ee(b), (_, j) => (i(), u("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: j[1] || (j[1] = be(() => {
      }, ["stop"]))
    }, [
      p("div", _1, [
        e.declaration.body_url ? (i(), V(M1, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (i(), u(Y, { key: 1 }, [
          a.value ? (i(), u(Y, { key: 0 }, [
            j[2] || (j[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", S1, v(a.value), 1)
          ], 64)) : $("", !0),
          d.value && c.value ? (i(), u("p", E1, v(c.value), 1)) : d.value && r.value ? (i(), u(Y, { key: 2 }, [
            j[3] || (j[3] = p("p", { class: "mark-label" }, "Output", -1)),
            F(Wf, {
              class: "mark-terminal",
              lines: l.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (i(), u("p", C1, v(s.value.join(`
`)), 1)) : $("", !0),
          o.value ? (i(), u("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: j[0] || (j[0] = be((D) => U(He)(`${sa}:${o.value}`), ["stop"]))
          }, "Open task " + v(o.value) + " and its proofs", 1)) : $("", !0)
        ], 64))
      ])
    ], 2));
  }
}, as = /* @__PURE__ */ G(T1, [["__scopeId", "data-v-51f69bf1"]]), I1 = (e) => `show-${e}`, wy = (e, t, n) => e.filter((s) => {
  var a;
  return n(I1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), B1 = "messages.chat", R1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), po = (e, t, n) => At(B1, R1(e, t), n), L1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, D1 = ["title", "aria-label", "onClick"], N1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, j1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = T(() => L1(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), s = R(""), a = _e(Ce);
    async function o(l) {
      const r = await po(l, t.mark, a.environment);
      s.value = r.ok ? "" : r.error;
    }
    return (l, r) => (i(), u(Y, null, [
      (i(!0), u(Y, null, ae(n.value, (c) => (i(), u("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: be((d) => o(c), ["stop"])
      }, [
        F(ze, {
          name: c.icon
        }, null, 8, ["name"])
      ], 8, D1))), 128)),
      s.value ? (i(), u("span", N1, v(s.value), 1)) : $("", !0)
    ], 64));
  }
}, P1 = /* @__PURE__ */ G(j1, [["__scopeId", "data-v-0dfda102"]]);
function mo(e, t) {
  const n = fn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((l) => [l.type, l])), a = async () => {
    try {
      return (await (await De.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const go = mo("/api/marks", "marks"), ky = go.fetchAll, q1 = go.find, W1 = 2e3;
function vo(e, t, n = W1) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  Le(async () => {
    await e(), a();
  }), wt(() => clearTimeout(s));
}
const F1 = ["data-ref"], H1 = ["data-ref"], U1 = { class: "mark-row" }, z1 = "dock add", V1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = T(() => q1(s.mark.type)), o = _e(Ce, null), l = T(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), r = R(null);
    vo(async () => {
      if (!l.value) return;
      const b = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      b.ok && b.value.rows.length && (r.value = b.value.rows[0].progress);
    }, () => l.value);
    const c = T(() => {
      const b = If(s.mark, a.value), _ = !b.figure || b.figure.endsWith("%");
      return r.value && l.value && _ ? { ...b, figure: `${r.value}%`, fraction: r.value / 100 } : b;
    }), d = T(() => {
      var b;
      return !!(s.mark.lines || s.mark.detail && uo.has(s.mark.variant) || t.has(s.mark.target_model) || (b = a.value) != null && b.body_url);
    }), h = R(!1), m = T(() => {
      var b, _, j;
      return s.docked ? (_ = (b = a.value) == null ? void 0 : b.buttons) == null ? void 0 : _.filter((D) => {
        var k;
        return !((k = D.runs) != null && k.startsWith(z1));
      }) : (j = a.value) == null ? void 0 : j.buttons;
    });
    return (b, _) => {
      var j, D;
      return (j = a.value) != null && j.card ? (i(), u("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        F(as, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, F1)) : (i(), u("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (D = a.value) == null ? void 0 : D.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", U1, [
          F(io, Qe({
            mark: c.value,
            open: d.value ? h.value : void 0
          }, Qo(c.value.handlers), {
            onClick: _[0] || (_[0] = (k) => h.value = !h.value)
          }), er({ _: 2 }, [
            d.value ? {
              name: "default",
              fn: z(({ shown: k }) => [
                F(as, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: k
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(P1, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, H1));
    };
  }
}, K1 = /* @__PURE__ */ G(V1, [["__scopeId", "data-v-b3334caa"]]), G1 = ["data-ref"], Y1 = ["inert"], J1 = { class: "thread-group" }, Z1 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = R(!1), s = R(!1);
    ke(n, () => s.value = !0);
    const a = T(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (o, l) => (i(), u("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      F(io, {
        mark: a.value,
        open: n.value,
        onClick: l[0] || (l[0] = (r) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (i(), u("div", {
        key: 0,
        class: J(["group-rows", { open: n.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", J1, [
          (i(!0), u(Y, null, ae(e.group.marks, (r) => (i(), V(K1, {
            key: r.id,
            mark: r
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, Y1)) : $("", !0)
    ], 8, G1));
  }
}, by = /* @__PURE__ */ G(Z1, [["__scopeId", "data-v-8a285510"]]);
function X1(e) {
  const t = R(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Le(() => n.observe(e.value)), wt(() => n.disconnect()), t;
}
const Q1 = { class: "chat-dock-fold" }, ep = ["aria-label"], tp = { class: "chat-dock-head" }, np = { class: "chat-dock-inner" }, yo = 700, sp = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = R(null), s = R(null), a = X1(s), o = R(!1);
    let l = 0;
    return Le(() => l = setTimeout(() => o.value = !0, yo)), wt(() => clearTimeout(l)), t({ card: n }), (r, c) => (i(), u("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", Q1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          pe(r.$slots, "edge"),
          p("header", tp, [
            pe(r.$slots, "head")
          ]),
          p("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", np, [
              p("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: $e(U(a) === null ? null : { height: `${U(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  pe(r.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, ep)
      ])
    ], 2));
  }
}, wo = /* @__PURE__ */ G(sp, [["__scopeId", "data-v-63e4dcfc"]]), ap = {
  class: "dock-leave",
  "aria-hidden": "true"
}, In = 5, op = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(In, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${In}s`, animationDelay: `${(n - In).toFixed(2)}s` };
    return (a, o) => (i(), u("span", ap, [
      p("i", { style: s })
    ]));
  }
}, ko = /* @__PURE__ */ G(op, [["__scopeId", "data-v-d0c4b012"]]), bo = mo("/api/docks", "docks"), $y = bo.fetchAll, os = bo.find, rp = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), rs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), lp = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), ip = (e) => e.kept ? rs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : rs("keep", "pin", "Pin", `dock keep ${e.id}`), cp = ["pin", "stop"], up = (e) => ({ ...e, iconOnly: cp.includes(e.icon) });
function dp(e, t) {
  var n;
  return [
    ...lp(e, t) ? [ip(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || jt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    rs("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(up);
}
const hp = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: rp(e, t),
  buttons: dp(e, t)
}), fp = { class: "dock-title" }, pp = ["aria-expanded", "title"], mp = { class: "chat-dock-acts dock-acts" }, gp = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, vp = {
  key: 1,
  class: "dock-text"
}, yp = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = T(() => os(s.item.type)), o = R(null), l = T(() => hp(s.item, a.value)), r = _e(Ce), c = R(/* @__PURE__ */ new Set()), d = R("");
    async function h(_) {
      if (_.action === "open") return He(`${s.item.target_model}:${s.item.target_id}`);
      _.action === "declared" && (c.value = /* @__PURE__ */ new Set([...c.value, _.label])), d.value = "";
      const D = await po(_, s.item, r.environment);
      (D == null ? void 0 : D.ok) === !1 && (c.value = new Set([...c.value].filter((k) => k !== _.label)), d.value = D.error);
    }
    const m = T(() => l.value.buttons.filter((_) => _.action !== "undock" && !c.value.has(_.label))), b = T(() => l.value.buttons.find((_) => _.action === "undock"));
    return (_, j) => (i(), V(wo, {
      label: l.value.title,
      folded: e.folded
    }, {
      edge: z(() => [
        e.leaving ? (i(), V(ko, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : $("", !0)
      ]),
      head: z(() => {
        var D, k, A;
        return [
          (D = a.value) != null && D.draws_head ? (i(), u("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (i(), u(Y, { key: 1 }, [
            F(ve, {
              name: l.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", fp, v(l.value.title), 1)
          ], 64)),
          (k = a.value) != null && k.badge ? (i(), u("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, v(a.value.badge), 3)) : $("", !0),
          (A = a.value) != null && A.draws_head ? $("", !0) : (i(), u("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: j[0] || (j[0] = (C) => n("fold"))
          }, [
            F(Rt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, pp)),
          p("span", mp, [
            (i(!0), u(Y, null, ae(m.value, (C) => (i(), u(Y, {
              key: C.action + C.runs
            }, [
              C.iconOnly ? (i(), V(we, {
                key: 0,
                kind: "icon",
                "aria-label": C.label,
                title: C.label,
                "data-dock-action": C.action,
                onClick: (K) => h(C)
              }, {
                default: z(() => [
                  F(ve, {
                    name: C.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (i(), V(we, {
                key: 1,
                small: "",
                kind: C.primary ? "primary" : "ghost",
                bordered: !C.primary,
                "data-dock-action": C.action,
                onClick: (K) => h(C)
              }, {
                default: z(() => [
                  ce(v(C.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          F(yn, {
            title: b.value.label,
            "data-dock-action": "undock",
            onClick: j[1] || (j[1] = (C) => h(b.value))
          }, null, 8, ["title"])
        ];
      }),
      default: z(() => {
        var D, k;
        return [
          d.value ? (i(), u("p", gp, v(d.value), 1)) : $("", !0),
          e.item.text && !((D = a.value) != null && D.body_url) ? (i(), u("p", vp, v(e.item.text), 1)) : $("", !0),
          (k = a.value) != null && k.body_url ? (i(), V(as, {
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
}, aa = /* @__PURE__ */ G(yp, [["__scopeId", "data-v-53b368f0"]]), wp = 6, kp = 3, oa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, rt = (e) => !!(e.leaves_at && !e.kept), bp = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!rt(e) || t < e.leaves_at || n.has(e.id)), $p = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => bp(s, t, n)).sort((s, a) => s.id - a.id);
function xp(e, t, n = wp) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const Mp = (e, t, n = e) => n < 2 ? !1 : e >= kp ? !0 : t, _p = ["title", "aria-label"], Sp = { class: "run-chip-in" }, Ep = {
  key: 0,
  class: "run-chip-ring"
}, Cp = { class: "run-chip-name" }, Ap = { class: "run-chip-bar" }, Op = "processes.output", Tp = 5e3, Ip = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var h;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((h = _e(Ce, null)) == null ? void 0 : h.environment) ?? "", o = R(null), l = T(() => !o.value || o.value.state === "running" || o.value.state === "background"), r = T(() => {
      var m, b;
      return ((m = o.value) == null ? void 0 : m.title) || ((b = o.value) == null ? void 0 : b.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = T(() => l.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await At(Op, ["process", "card", String(s.item.target_id)], a);
      m.ok && (o.value = m.value);
    }
    return vo(d, () => l.value, Tp), (m, b) => {
      var _;
      return i(), u("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: r.value,
        "aria-label": `${r.value}; show its card`,
        style: $e({ "--tone": c.value })
      }, [
        U(rt)(e.item) ? (i(), V(ko, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : $("", !0),
        p("span", Sp, [
          l.value ? (i(), u("span", Ep)) : (i(), V(ze, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", Cp, v(r.value), 1)
        ]),
        p("span", Ap, [
          p("i", {
            style: $e({ width: l.value ? `${((_ = o.value) == null ? void 0 : _.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, _p);
    };
  }
}, Bp = /* @__PURE__ */ G(Ip, [["__scopeId", "data-v-597b05d2"]]), Rp = 24, Lp = 8, xy = 420;
function My({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= Rp && e > t ? !0 : e < t && a > Lp ? !1 : null;
}
const Dp = (e, t) => e === void 0 ? t : e, Np = {
  key: "runs-head",
  class: "dock-runs-head"
}, jp = { class: "dock-runs-chips" }, Pp = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = cf(500), s = R(/* @__PURE__ */ new Set()), a = R(!1), o = R(!1), l = T(() => $p(t.items, n.value, s.value)), r = T(() => xp(l.value.filter((C) => oa(C, os)), n.value)), c = T(() => l.value.filter((C) => !r.value.includes(C) && !oa(C, os))), d = T(() => r.value.filter((C) => !rt(C))), h = T(() => (a.value = Mp(r.value.length, a.value, d.value.length)) && !o.value), m = R({}), b = (C) => Dp(m.value[C.id], t.folded);
    function _(C) {
      m.value = { ...m.value, [C.id]: !b(C) };
    }
    function j(C) {
      m.value = { ...m.value, ...Object.fromEntries(r.value.map((K) => [K.id, K.id !== C.id])) }, o.value = !0;
    }
    function D() {
      m.value = Object.fromEntries(Object.entries(m.value).filter(([C]) => !r.value.some((K) => String(K.id) === C))), o.value = !1;
    }
    function k(C) {
      s.value = /* @__PURE__ */ new Set([...s.value, C.id]);
    }
    function A(C) {
      s.value = new Set([...s.value].filter((K) => K !== C.id));
    }
    return (C, K) => (i(), V(ma, {
      tag: "div",
      name: "dock",
      duration: U(yo),
      class: "dock-stack"
    }, {
      default: z(() => [
        (i(!0), u(Y, null, ae(c.value, (y) => (i(), V(aa, {
          key: y.id,
          item: y,
          class: J({ timed: U(rt)(y) }),
          leaving: U(rt)(y) && !s.value.has(y.id),
          folded: b(y),
          onFold: (g) => _(y),
          onMouseenter: (g) => k(y),
          onMouseleave: (g) => A(y)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (i(), u("div", Np, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: D
          }, [
            ce(v(r.value.length) + " runs ", 1),
            F(Rt, { open: "" })
          ])
        ])) : $("", !0),
        (i(!0), u(Y, null, ae(h.value ? [] : r.value, (y) => (i(), V(aa, {
          key: y.id,
          item: y,
          class: J({ timed: U(rt)(y) }),
          leaving: U(rt)(y) && !s.value.has(y.id),
          folded: b(y),
          onFold: (g) => _(y),
          onMouseenter: (g) => k(y),
          onMouseleave: (g) => A(y)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        h.value ? (i(), V(wo, {
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
              onClick: K[0] || (K[0] = (y) => o.value = !0)
            }, [
              F(ze, { name: "runs" }),
              ce(" " + v(r.value.length) + " runs ", 1),
              F(Rt)
            ]),
            p("span", jp, [
              (i(!0), u(Y, null, ae(r.value, (y) => (i(), V(Bp, {
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
}, _y = /* @__PURE__ */ G(Pp, [["__scopeId", "data-v-7081ac82"]]), Ct = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Qt = (e) => Math.min(Math.max(e, 0), 1), qp = (e) => {
  const t = Qt(e);
  return t * t * (3 - 2 * t);
}, st = (e, t, n) => qp((e - t) / (n - t));
function Sy(e) {
  const t = Qt(e), n = Qt((t - 0.12) / 0.76) * Ct.shuffles, s = Math.min(Math.floor(n), Ct.shuffles - 1), a = n - s, o = st(a, 0.26, 0.38) * (1 - st(a, 0.76, 0.96)), l = st(a, 0.38, 0.76), r = st(t, 0, 0.12) * (1 - st(t, 0.88, 1)), c = st(a, 0.2, 0.34) * (1 - st(a, 0.84, 1)), d = Math.sin(Math.PI * Qt((a - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (s + l) / Ct.shuffles, lift: Ct.lift * o, ready: r, weight: c, follow: d, shuffle: s, phase: a };
}
const $o = 2400, Wp = 0.05;
function Ey({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, Wp), l = Math.min(t + $o * o, a), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
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
}, ls = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Fp = (e) => e * e * (3 - 2 * e), cn = (e, [t, n]) => Fp(ls(e, t, n)), Hp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Je = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Gt = ([e, t], n) => e + n() * (t - e);
function Up(e) {
  return Hp.map(() => {
    const t = Gt(Je.speed, e), n = Gt(Je.angle, e) * Math.PI / 180, s = Gt(Je.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Gt(Je.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const zp = Up(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Vp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Je.gravity * (t[2] - Je.floor))) / Je.gravity;
}
function Cy(e, t, n = zp) {
  const s = Xe.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], l = Vp(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= l + r) return null;
  const c = Math.min(a, l), d = s.from.map((h, m) => h + o.velocity[m] * c);
  return d[2] -= Je.gravity * c * c / 2, { at: d, turn: o.spin * c, landed: Math.max(0, a - l) / r };
}
function Ay(e, t) {
  const n = e.map((o) => Math.sqrt(o)), s = n.reduce((o, l) => o + l, 0);
  let a = Math.min(Math.max(t, 0), 1) * s;
  for (const [o, l] of n.entries()) {
    if (a <= l || o === n.length - 1) {
      const r = l > 0 ? Math.min(a / l, 1) : 1;
      return { index: o, s: r, height: e[o] * 4 * r * (1 - r) };
    }
    a -= l;
  }
  return { index: 0, s: 1, height: 0 };
}
const Oy = () => Array.from({ length: Xe.pogo.count }, (e, t) => Xe.pogo.bounce * (t + 1) / Xe.pogo.count), Ty = { stride: 0.5 };
function xo(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: ls(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: ls(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Iy(e) {
  const { into: t, out: n } = xo(Xe.rope_swing, e);
  return 1 - cn(t, [0, 1]) * (1 - cn(n, [0, 1]));
}
function By(e) {
  const t = Xe.rope_swing, { into: n, out: s } = xo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return cn(n, [0, 1]) * (1 - cn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Kp = { after: 3 }, Gp = 10, Yp = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Jp = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Zp = { weight: 19 }, Xp = {
  build: { cooldown: 180 }
}, Qp = { every: 120 }, Mo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, _o = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, em = {
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
}, Wt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Gp }), te = (e, t, n = {}) => Wt(e, "clip", t, n), Bn = (e, t, n = {}) => Wt(e, "look", t, n), ra = (e, t, n = {}) => Wt(e, "gaze", t, n), de = (e, t, n = {}, s = {}) => ({ ...Wt(e, "pick", t, n), ...s }), ge = (e) => Wt("nothing", "nothing", e, {}), tm = 120, nm = 300, Rn = (e, t) => ({ ...te(e, t), cooldown: nm }), sm = 120, ne = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), am = () => [te("joy", 2)], at = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), ot = (e) => ({ ...e, cooldown: Yp[e.name] }), Et = (e) => ({ ...e, shenanigan: !0, lasts: Jp[e.name] }), Ms = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ne("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ne("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...ot(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...ot(te("bug_smash", 2)), toward: "", onto: !1 },
    te("nod", 2)
  ]),
  ...ne("tests_failed", { cooldown: 20, toward: "card" }, [te("startled", 2), te("dismay", 1), te("tantrum", 3), ge(1)]),
  ...ne("committed", { cooldown: 30, toward: "card", onto: !0 }, [te("nod", 2), ge(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ne("sin_fixed", { cooldown: 300 }, [te("halo", 1), ge(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ne("sin_committed", { cooldown: 300 }, [te("repent", 1), ge(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
  ...ne("messaged", { cooldown: sm }, [te("phone_call", 1)]),
  ...ne("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [te("nod", 4), te("hand_rub", 4), ge(7)]),
  ...ne("question_asked", { cooldown: 60 }, [te("ask_sign", 9), te("look_up", 3), ge(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ne("reported", { cooldown: 90 }, [ra("read", 3), te("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ne("read_message", { cooldown: 30 }, [ra("read", 3), ge(1)]),
  ...ne("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ge(6)]),
  ...ne("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ne("bar_done", { holds: !0 }, am()),
  ...ne("bar_failed", { holds: !0 }, [te("fume", 1), te("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ne("standing", { cooldown: 12 }, [te("look_left", 2), te("look_right", 2), te("look_up", 1), ge(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ne("launched", { cooldown: 300 }, [te("tumble", 3), ge(47)]),
  // a break from the hammering now and then
  ...ne("building", { cooldown: 30 }, [te("wipe_brow", 4), te("look_left", 1), te("look_right", 1), ge(69)]),
  ...ne("failed", { cooldown: 20, toward: "card" }, [te("shake", 3), te("tantrum", 2), ge(2)]),
  ...ne("refused", { cooldown: 20 }, [te("shake", 1), ge(1)]),
  ...ne("work_done", { cooldown: 120 }, [te("stretch", 2), ge(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ne("pondering", { cooldown: [30, 60] }, [de("ponder", 1)]),
  ...ne("thought_cloud", { cooldown: 90 }, [de("cloud", 1)]),
  ...ne("light_bulb", { cooldown: 150 }, [de("bulb", 1)]),
  ...ne("answered", { cooldown: 15 }, [Bn("amused", 3), ge(2)]),
  ...ne("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...ne("long_walk", { cooldown: 90 }, [te("stumble", 3), ge(22)]),
  ...ne("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), ge(13)]),
  ...ne("typing", { cooldown: 60 }, [Bn("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(em).flatMap(([e, t]) => ne(`reacted:${e}`, {}, [Bn(t, 1)])),
  ...Object.entries(Mo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ne(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(_o).flatMap(([e, t]) => ne(`agent_reacted:${e}`, {}, [te(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ne("pastime", {}, [
    at("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    at("rest", 3, 180, 120),
    at("yawn", 2, 60, 60),
    at("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    at("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    at("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    at("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Et(ot(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Et(ot(te("disco", 2, { ball: "bubble" }))),
    ge(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ne("held:search", { cooldown: tm }, [Rn("search", 3), { ...Rn("binoculars", 2), when: { home: !0 } }, { ...Rn("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ne("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...ne("held:watch", {}, [te("watch", 2), te("wave_up", 1)]),
  ...ne("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ne("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ne("tickled", {}, [{ ...ot(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ne("eager", {}, [te("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ne("jump", {}, [Et(ot(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ne("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ne("unit", { cooldown: Xp.build.cooldown }, [de("unit", Zp.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ne("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ne("carrier", {}, [de("ufo", 3), de("crane", 1)]),
  ...ne("crane_from", {}, [de("left", 1), de("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ne("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: Qp.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...ne("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ne("roam", {}, [
    de("rest", 35, {}, { stay: [25, 60] }),
    de("seat", 15, {}, { stay: [15, 40] }),
    de("edge", 25, {}, { stay: [8, 20] }),
    Et(de("bubble", 15, {}, { stay: [30, 80] })),
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
    Et(ot(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...ne("laptop", {}, [de("seat", 6, {}, { stay: [60, 150] }), de("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ne("ledge_at", {}, [de("middle", 2, {}, { along: 1 / 2 }), de("third", 1, {}, { along: 1 / 3 }), de("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ne("composed_as", {}, [
    de("facing", 4, {}, { turn: 0, leans: 0 }),
    de("turned_left", 1, {}, { turn: 335, leans: 0 }),
    de("turned_right", 1, {}, { turn: 25, leans: 0 }),
    de("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    de("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], om = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), So = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), rm = (e) => Array.isArray(e) ? e[0] : e, lm = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function im(e) {
  var d;
  const t = e.has ?? (() => !0), n = (h) => e.now - (e.memory.get(h) ?? -1 / 0), s = (h) => !e.memory || So(h).every(([m, b]) => n(m) >= rm(b)), a = (h) => !h.shenanigan || h.lasts <= (e.room ?? 0), o = Ms.filter((h) => om(h.when, e) && (h.kind !== "clip" || t(h.name)) && s(h) && a(h)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= Kp.after && o.some((h) => h.shenanigan) ? o.filter((h) => h.shenanigan) : o, c = r.filter((h) => {
    var m;
    return h.kind === "nothing" || h.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return c.some((h) => h.kind !== "nothing") ? c : r;
}
function cm(e, t) {
  const n = im(e);
  let s = t() * n.reduce((o, l) => o + l.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Eo(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Eo(e, t, n) {
  var s;
  for (const [a, o] of So(t)) (s = e.memory) == null || s.set(a, e.now + lm(o, n));
}
function Ry(e, t, n) {
  Eo(e, Ms.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const la = {
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
}, Dy = 120, Ny = (e) => la[e] || la.idle;
[.../* @__PURE__ */ new Set([...Object.values(Mo).flatMap((e) => Object.keys(e)), ...Object.keys(_o)])];
const Ie = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function jy(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Ie.ahead * n ? 180 : Math.sign(s) * Ie.turn;
}
const ia = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Py(e, t) {
  const n = Math.min(Ie.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Ie.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Ie.lines, Math.floor((e.bottom - e.top - 2 * s) / Ie.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Ie.sweep) % a, r = o % Ie.sweep, c = Ie.sweep - Ie.returnSeconds, d = ia((r - c) / Ie.returnSeconds), h = r <= c ? ia(r / c) : 1 - d, m = l + ((l + 1) % a - l) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * h, y: e.top + s + m * Ie.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const um = 1, dm = (e, t, n, s, a, o = 0) => cm({ moment: "jump", high: e > um * t, memory: s, now: a, room: o }, n).name === "backflip", ca = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, qy = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, Wy = { width: 24, height: 27, top: 3, units: 2 }, hm = "[data-figure-pile]", Fy = { amber: [1, 0.69, 0.125], good: ca.colours.good, bad: ca.colours.bad }, Ln = { phases: 4, dim: 0.25 }, Hy = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, fm = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Ms.filter((e) => fm.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const Uy = {
  width: 84,
  belly: 13,
  blink: 4
}, ua = "[data-figure-home]", Ft = () => {
  var t;
  const e = document.querySelector(ua);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ua)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, pm = "[data-figure-docked-bars]", mm = "[data-figure-chat-foot]", gm = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", vm = "[data-figure-newest]";
function ym() {
  var s, a;
  const e = (s = Ft()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(vm), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !_s(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function Co(e, t, n = ym()) {
  if (!e || !n) return !0;
  const s = bt(e, t), a = Ss(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ze.top * t.size, bottom: s.top + Ze.bottom * t.size }, l = Ct.gap;
  return !To(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
const Dn = 0.26, wm = 0.54, bn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Dn, travels: "stand" },
  lounge: { drop: Dn, travels: "stand" },
  composed: { drop: Dn, travels: "stand" },
  hang: { drop: wm, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Ao = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), km = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), zy = (e, t) => (e === "sit" ? km.has(t) : Ao.has(e)) ? e : "stand", Vy = 0.25, Ky = (e, t) => Ao.has(e) && bn[t].drop === 0, Oo = 2, bm = 90, $m = 180, xm = 140, Mm = 280, _m = 420, Sm = 0.25, Em = 290, Cm = 600, Am = "cubic-bezier(0.2, 0.7, 0.4, 1)", Om = "cubic-bezier(0.55, 0, 0.9, 0.6)", Nn = 5;
function un(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: c = Math.random, memory: d = null, now: h = 0, room: m = 0, pogo: b = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Nn) return null;
  (l || r) && (o = Math.max(o, Oo));
  const _ = o > 1, j = Math.abs(t.x - e.x), D = j < Nn ? 0 : j / (bm * o) * 1e3, k = Math.min(D, _ ? xm : $m), A = Math.abs(t.y - e.y), C = t.y < e.y, K = C && !b && dm(A, n, c, d, h, m), y = C ? _m + Math.min(A, 400) * Sm : Math.sqrt(2 * A / $o) * 1e3, g = {
    x: t.x,
    y: t.y,
    ms: A > Nn ? K ? Cm : y : 0,
    lead: K ? Em : C ? Mm : 0,
    easing: C ? Am : Om,
    hopping: !0,
    clip: K ? "backflip" : C ? "jump" : "fall"
  }, I = { x: t.x, y: t.y, ms: D + k, lead: 0, easing: "linear", ramp: k, ..._ ? { clip: "run" } : {} }, S = b ? Tm(t, n) : g, P = C && !s ? [{ ...I, y: e.y }, S] : [{ ...g, x: e.x }, I];
  return { way: Math.sign(t.x - e.x) || 1, legs: P, lands: !a, pace: o, running: _ };
}
const Tm = (e, t) => ({ x: e.x, y: e.y, ms: Xe.pogo.frames / Xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), bt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - bn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, To = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, _s = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function $t() {
  var t;
  const e = (t = Ft()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Yt = 0.5, da = 20;
function Gy(e, t, n = $t()) {
  const s = bt(e, t);
  return s.left >= n.left + da && s.right <= n.right - da;
}
function Io(e, t, n = $t()) {
  const s = bt(e, t), a = s.right - s.left, o = Ss(e), [l, r] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return l >= n.left - Yt && r <= n.right + Yt && s.top >= n.top - Yt && c <= n.bottom + Yt;
}
const dn = [0.35, 0.5, 0.65], hn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ze = { left: dn[0], right: dn.at(-1), top: hn[0], bottom: hn.at(-1) }, Im = 0.24;
function Ss(e) {
  if (e.posture === "stand") return { left: Ze.left, right: Ze.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Im * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ze.left, t), right: Math.max(Ze.right, t) };
}
function Bm(e, { size: t }, n = $t()) {
  const s = Ss(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Rm = (Ze.right - Ze.left) / 2 + 0.08;
function Lm(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !_s(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, l = Math.min(a.startOffset, o.length - 1);
  for (const c of [l - 1, l].filter((d) => d >= 0)) {
    if (!o.data[c].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, c), d.setEnd(o, c + 1), [...d.getClientRects()].some((h) => e >= h.left && e <= h.right && t >= h.top && t <= h.bottom)) return !0;
  }
  return !1;
}
const Dm = (e) => hn.flatMap(
  (t) => dn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Nm(e, t, n = "") {
  if (!Co(e, t)) return dn.length * hn.length;
  const s = bt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(gm)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: c }) => c.width && c.height && To(a, c) && _s(r)).map(({ rect: r }) => r), l = (r, c) => o.some((d) => r >= d.left && r <= d.right && c >= d.top && c <= d.bottom);
  return Dm(a).filter(([r, c]) => l(r, c) || Lm(r, c, n)).length;
}
function jm(e, t, n) {
  const s = $t(), a = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Io(l, t, s) && Co(l, t)).map((l) => ({ spot: l, covered: Nm(l, t), away: a(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Bo = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Pm = Rm, qm = (e, t, { size: n }, s = Pm) => Wm(e, Bo[t], s * n, "stand");
function Wm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Yy = (e) => ((e + 180) % 360 + 360) % 360 - 180, Jy = { turns: [-20, -10, 0, 10, 20] }, Fm = 7;
function Hm() {
  const e = [...document.querySelectorAll(hm)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const Um = 4;
function zm() {
  const e = Ro(), t = Hm(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Um || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Fm - n, 0) } };
}
const Zy = ({ size: e, below: t }) => (1 - t) * e;
function Vm(e, t) {
  const n = $t(), { size: s, below: a } = t, o = bn[e.posture].drop * s;
  return { ...Bm(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Km = (e, t) => Object.keys(Bo).map((n) => Vm(qm(e, n, t), t)), Gm = (e, t, n) => jm(e, t, n) ?? e[0];
function Xy(e, t) {
  const { element: n, edge: s } = zm();
  return { ...Gm(Km(s, e), e, t), view: null, on: n };
}
function Ro() {
  var s;
  const e = Ft(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(pm);
  if (!t) return { ...Lo(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Lo() {
  const e = Ft();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const Ym = { climb: 90 };
function Qy(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: c = [], memory: d = null, now: h = 0, room: m = 0, pogo: b = !1 } = {}) {
  (o || l) && (a = Math.max(a, Oo));
  const _ = (K) => {
    const y = bt(K, n, bn[K.posture].travels);
    return { x: y.left, y: y.top };
  }, j = t.ladder ?? e.ladder;
  if (j && !(t.ladder && e.ladder)) return Jm(_(e), _(t), _({ ...j.foot, posture: "stand" }), j.way, !!t.ladder, n, a);
  const [D, ...k] = [e, ...c, t].map(_), A = un(D, k[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: l, random: r, memory: d, now: h, room: m, pogo: b }), C = k.slice(1).map((K, y) => {
    var g;
    return (g = un(k[y], K, n.size, { random: r, memory: d, now: h, room: m })) == null ? void 0 : g.legs.find((I) => I.hopping);
  });
  return A && { ...A, legs: [...A.legs, ...C.filter(Boolean)] };
}
function Jm(e, t, n, s, a, o, l) {
  const r = (h, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - h.x, m.y - h.y) / Ym.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? un(e, n, o.size, { pace: l }) : un(n, t, o.size, { pace: l }), d = a ? [...(c == null ? void 0 : c.legs) ?? [], r(n, t)] : [r(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: l, running: l > 1 };
}
const Zm = "[data-figure-bubble]", Xm = 250;
let Ot = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Do = 0;
const No = () => Ot, jn = /* @__PURE__ */ new WeakMap();
let Qm = 0;
function jo(e) {
  return jn.has(e) || jn.set(e, `floor-${++Qm}`), jn.get(e);
}
const eg = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, tg = () => {
  var e, t;
  return ((t = (e = Ft()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function ng(e, t) {
  var s;
  const n = (s = e.querySelector(mm)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function sg(e, t) {
  const n = e && ng(e, t), s = e ? [...e.querySelectorAll(Zm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: l }) => ({ element: o, kind: l, box: o.getBoundingClientRect() })).filter(({ kind: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || eg(l, n))).map(({ element: o, kind: l, box: r }) => ({ id: jo(o), kind: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const ag = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Xm ? (t.top - s.top) / a * 1e3 : 0;
};
function og(e = Ot, t = performance.now()) {
  const n = $t(), s = tg(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = Ro(), c = [];
  o && c.push({ id: "home", kind: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = Lo();
  return d.element && c.push({ id: jo(d.element), kind: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), c.push(...sg(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((h) => Object.freeze({ ...h, vy: ag(e, h, t) }))) });
}
const is = /* @__PURE__ */ new Set();
function rg(e) {
  return is.add(e), () => is.delete(e);
}
function lg() {
  Po();
  const e = () => {
    Do = requestAnimationFrame(e), !document.hidden && (Ot = og(Ot), is.forEach((t) => t(Ot)));
  };
  e();
}
function Po() {
  cancelAnimationFrame(Do);
}
const ig = (e, t) => e.find((n) => n.id === t) ?? null;
function ew(e, t, n = No().floors) {
  const s = ig(n, "home");
  return e.posture === "hang" && s && bt(e, t).bottom >= s.top ? !1 : Io(e, t);
}
const cg = ["data-kind"], ug = { class: "figure-floor-name" }, dg = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (i(), u("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", ug, v(e.floor.kind), 1)
    ], 12, cg));
  }
}, hg = /* @__PURE__ */ G(dg, [["__scopeId", "data-v-8f6132da"]]), fg = {
  class: "figure-floors",
  "aria-hidden": "true"
}, pg = {
  __name: "FigureFloors",
  setup(e) {
    const t = fn(No().floors);
    let n = () => {
    };
    return Le(() => {
      n = rg((s) => t.value = s.floors), lg();
    }), Ee(() => {
      n(), Po();
    }), (s, a) => (i(), u("div", fg, [
      (i(!0), u(Y, null, ae(t.value, (o) => (i(), V(hg, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, tw = /* @__PURE__ */ G(pg, [["__scopeId", "data-v-e519168b"]]), Pn = (e) => typeof e == "number" ? e : Date.parse(e);
function nw(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Pn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Pn(a.row.created_at) - Pn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const mg = 3, qn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function gg(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = qn[n.grouping]) == null ? void 0 : s.call(qn, e.row, n)) || "";
}
function vg(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function sw(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= mg ? [vg(s, t)] : s), s = [];
  };
  for (const l of e) {
    const r = gg(l, t);
    r !== a && o(), a = r, r ? s.push(l) : n.push(l);
  }
  return o(), n;
}
const yg = 1e3;
function aw() {
  const e = R(Date.now()), t = setInterval(() => e.value = Date.now(), yg);
  return wt(() => clearInterval(t)), e;
}
function ow(e) {
  const t = pn(), n = R(null), s = R("");
  async function a(...o) {
    const l = await t.read(e(...o));
    s.value = l.ok ? "" : l.error, l.ok && (n.value = l.value);
  }
  return { value: n, failure: s, load: a };
}
const Jt = /* @__PURE__ */ new Map();
function wg(e, t) {
  if (Jt.has(e)) return Jt.get(e);
  const n = t().finally(() => Jt.delete(e));
  return Jt.set(e, n), n;
}
function rw() {
  const e = pn(), t = R(null), n = R("");
  async function s() {
    const a = await wg(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const kg = {
  class: "cards-page",
  "data-window-flush": ""
}, bg = { class: "cards-bar" }, $g = { class: "cards-count" }, xg = { class: "cards" }, Mg = {
  key: 1,
  class: "cards-note"
}, _g = {
  key: 2,
  class: "cards-note"
}, Sg = ["data-row", "onClick"], Eg = { class: "card-head" }, Cg = { class: "card-age" }, Ag = { class: "card-title" }, Og = { class: "card-foot" }, Tg = {
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
    return (s, a) => (i(), u("div", kg, [
      p("div", bg, [
        p("span", $g, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        F(we, Qe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: z(() => [
            F(ve, {
              name: "plus",
              size: 12
            }),
            ce(" New " + v(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", xg, [
        e.loaded ? e.failure ? (i(), u("p", Mg, v(e.failure), 1)) : e.rows.length ? $("", !0) : (i(), u("p", _g, "No " + v(e.noun) + "s yet", 1)) : (i(), V(kt, {
          key: 0,
          shape: "cards"
        })),
        (i(!0), u(Y, null, ae(e.rows, (o) => (i(), u("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          p("span", Eg, [
            F(ve, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ce(" " + v(e.head(o)), 1),
            p("span", Cg, v(U(ts)(o.created_at)), 1)
          ]),
          p("span", Ag, v(e.title(o)), 1),
          p("span", Og, v(e.foot(o)), 1)
        ], 8, Sg))), 128))
      ]),
      pe(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, lw = /* @__PURE__ */ G(Tg, [["__scopeId", "data-v-d72d528d"]]), ha = "newest";
function iw(e, { title: t, isOpen: n = null }) {
  const s = R(""), a = R(ha), o = R("all"), l = T(() => {
    const c = s.value.trim().toLowerCase(), d = e.value.filter((h) => (!c || JSON.stringify(h).toLowerCase().includes(c)) && (o.value === "all" || !n || n(h) === (o.value === "open")));
    return a.value === ha ? d : [...d].sort((h, m) => t(h).localeCompare(t(m)));
  }), r = T(() => !!s.value.trim() || !!n && o.value !== "all");
  return { words: s, order: a, state: o, shown: l, filtering: r, hasStates: !!n };
}
const Ig = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Bg = 40, Rg = "top", Lg = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var m;
    const n = e, s = (m = _e(Ce, null)) == null ? void 0 : m.autoScroll, a = T(() => s === Rg), o = R(null), l = R(!1), r = (b) => a.value ? b.scrollTop : b.scrollHeight - b.scrollTop - b.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, d = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function h() {
      l.value = r(o.value) >= Bg;
    }
    return ke(() => n.rowCount, async () => {
      await Dt(), !l.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (b, _) => (i(), u("div", Ig, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: h
      }, [
        pe(b.$slots, "default", {}, void 0, !0)
      ], 34),
      F(yt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: z(() => [
          et(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: d
          }, [
            F(ve, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            _[0] || (_[0] = ce(" Newest ", -1))
          ], 512), [
            [tr, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, cw = /* @__PURE__ */ G(Lg, [["__scopeId", "data-v-3accb764"]]), Dg = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, Ng = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = _e(Ce, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, l) => (i(), u("div", Dg, [
      (i(!0), u(Y, null, ae(U(s), (r) => {
        var c;
        return i(), V(we, {
          key: r.key,
          kind: "text",
          class: J(["inner-tab", { on: ((c = e.active) == null ? void 0 : c.key) === r.key }]),
          "data-tab": r.key,
          onClick: (d) => n("choose", r)
        }, {
          default: z(() => [
            ce(v(r.label) + " " + v(e.answer[r.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, uw = /* @__PURE__ */ G(Ng, [["__scopeId", "data-v-cf3bb39f"]]), jg = {}, Pg = { class: "menu-label" };
function qg(e, t) {
  return i(), u("span", Pg, [
    pe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const cs = /* @__PURE__ */ G(jg, [["render", qg], ["__scopeId", "data-v-aa955b3e"]]), Wg = {
  class: "search-bar",
  "data-search-bar": ""
}, Fg = { class: "search-bar-control" }, Hg = ["value", "placeholder", "aria-label"], Ug = ["aria-expanded"], zg = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var A;
    const s = e, a = n, o = nr(), l = ((A = _e(Ce, null)) == null ? void 0 : A.search) ?? {}, r = T(() => l.placeholder || s.placeholder), c = l.context ?? [], d = R(null), h = R(null), m = R([]), b = T(() => m.value.length ? m.value[m.value.length - 1].next : c), _ = T(() => !!o.menu || c.length > 0), j = (C) => {
      m.value = [], h.value = h.value ? null : C.currentTarget;
    };
    function D(C) {
      if (C.next.length) {
        m.value = [...m.value, C];
        return;
      }
      h.value = null, a("pick", C.click);
    }
    function k() {
      var C;
      a("update:modelValue", ""), (C = d.value) == null || C.focus();
    }
    return t({ focus: () => {
      var C;
      return (C = d.value) == null ? void 0 : C.focus();
    } }), (C, K) => (i(), u("div", Wg, [
      p("div", Fg, [
        F(ve, {
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
          onInput: K[0] || (K[0] = (y) => a("update:modelValue", y.target.value)),
          onKeydown: Tt(k, ["esc"])
        }, null, 40, Hg),
        e.modelValue ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "search-bar-clear",
          "data-search-clear": "",
          "aria-label": "Clear the search",
          onClick: k
        }, [
          F(ve, {
            name: "close",
            size: 12
          })
        ])) : $("", !0),
        _.value ? (i(), u("button", {
          key: 1,
          type: "button",
          class: "search-bar-menu",
          "data-search-menu": "",
          "aria-label": "Options",
          title: "Options",
          "aria-expanded": !!h.value,
          onClick: j
        }, [
          F(ve, {
            name: "caret",
            size: 12
          })
        ], 8, Ug)) : $("", !0)
      ]),
      U(l).button ? (i(), u("button", {
        key: 0,
        type: "button",
        class: "search-bar-button",
        "data-search-button": "",
        onClick: K[1] || (K[1] = (y) => a("pick", U(l).button.click))
      }, v(U(l).button.title), 1)) : $("", !0),
      pe(C.$slots, "default", {}, void 0, !0),
      h.value ? (i(), V(xs, {
        key: 1,
        anchor: h.value,
        align: "end",
        "min-width": 220,
        "max-width": 320,
        onClick: K[3] || (K[3] = be(() => {
        }, ["stop"])),
        onClose: K[4] || (K[4] = (y) => h.value = null)
      }, {
        default: z(() => [
          m.value.length ? (i(), V(vt, {
            key: 0,
            "data-search-back": "",
            onClick: K[2] || (K[2] = (y) => m.value = m.value.slice(0, -1))
          }, {
            default: z(() => [
              ce("‹ " + v(m.value[m.value.length - 1].title), 1)
            ]),
            _: 1
          })) : $("", !0),
          (i(!0), u(Y, null, ae(b.value, (y) => (i(), V(vt, {
            key: y.title,
            description: y.subtext,
            "data-search-entry": y.title,
            onClick: (g) => D(y)
          }, {
            default: z(() => [
              ce(v(y.title) + v(y.next.length ? " ›" : ""), 1)
            ]),
            _: 2
          }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
          m.value.length ? $("", !0) : pe(C.$slots, "menu", {}, void 0, !0, 1)
        ]),
        _: 3
      }, 8, ["anchor"])) : $("", !0)
    ]));
  }
}, Vg = /* @__PURE__ */ G(zg, [["__scopeId", "data-v-4c3315ae"]]), Kg = {
  class: "list-tools",
  "data-list-tools": ""
}, Gg = {
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
    return (o, l) => (i(), u("div", Kg, [
      F(Vg, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": "",
        onPick: l[1] || (l[1] = (r) => n("pick", r))
      }, {
        menu: z(() => [
          F(cs, null, {
            default: z(() => [...l[2] || (l[2] = [
              ce("Order", -1)
            ])]),
            _: 1
          }),
          (i(), u(Y, null, ae(s, (r) => F(vt, {
            key: r.key,
            checked: e.tools.order.value === r.key,
            "data-list-order": r.key,
            onClick: (c) => e.tools.order.value = r.key
          }, {
            default: z(() => [
              ce(v(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (i(), u(Y, { key: 0 }, [
            F(cs, null, {
              default: z(() => [...l[3] || (l[3] = [
                ce("Show", -1)
              ])]),
              _: 1
            }),
            (i(), u(Y, null, ae(a, (r) => F(vt, {
              key: r.key,
              checked: e.tools.state.value === r.key,
              "data-list-state": r.key,
              onClick: (c) => e.tools.state.value = r.key
            }, {
              default: z(() => [
                ce(v(r.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : $("", !0)
        ]),
        default: z(() => [
          pe(o.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, dw = /* @__PURE__ */ G(Gg, [["__scopeId", "data-v-24c1740c"]]);
function hw() {
  const e = R(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Yg = 86400, us = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Jg(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((us(t) - us(e)) / Yg);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function fw(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = us(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Jg(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Wn = 280, Fn = 240, Hn = 120, Zg = 6, Xg = 14, Lt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Qg(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function qo(e, t) {
  const n = Math.max(0, Qg(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function e0(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Xg}px)` }), e.offsetHeight, e.style.transition = `height ${Wn}ms ${Lt}`, e.style.height = `${l}px`;
  const r = a();
  let c = !1;
  const d = () => {
    n() && (t.scrollTop = qo(t, e));
    const h = a() - r;
    if (!c && h >= Wn && (c = !0, e.style.transition = `opacity ${Fn}ms ease-out, transform ${Fn}ms ${Lt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), h < Wn + Fn) return s(d);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(d);
}
function pw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Zg}px)` }), e.offsetHeight, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${Lt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = a(), r = () => {
    if (n() && (t.scrollTop = qo(t, e)), a() - l < Hn) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const t0 = 140, Zt = 220, n0 = 5;
function mw({ gap: e = t0, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, n0);
    if (s = r.length > 0, !s) return;
    let c = r.length;
    for (const d of r)
      d.el.style.display = d.display, d.arrival(d.el, d.options, () => {
        d.done(), c -= 1, c || t(o, e);
      });
  }
  const l = (r, c, d, h = e0) => {
    if (!c.pane || !c.follows()) return d();
    const m = { el: r, options: c, done: d, arrival: h, display: r.style.display || "" };
    if (!s)
      return s = !0, h(r, c, () => a(m));
    r.style.display = "none", n.push(m);
  };
  return l.flush = () => {
    for (const r of n.splice(0))
      r.el.style.display = r.display, r.done();
  }, l;
}
function gw(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Zt}ms ${Lt}, opacity ${Zt}ms ease-in, margin ${Zt}ms ${Lt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Zt);
}
const Wo = "chat.pins.minimised", en = R(It(Wo, !1));
function fa(e) {
  en.value = e, mn(Wo, e);
}
function s0(e) {
  const t = T(() => e()), n = T(() => en.value ? [] : e()), s = () => fa(!en.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Oa(o) > a).length,
    (o, l) => o > l && fa(!1)
  ), { pins: t, visible: n, minimised: en, toggle: s };
}
const a0 = ["title"], o0 = {
  key: 0,
  class: "pins-count"
}, r0 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = s0(() => t.pinRows);
    return (o, l) => U(n).length ? (i(), u("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: U(s), inline: e.inline }]),
      title: U(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = be((...r) => U(a) && U(a)(...r), ["stop"]))
    }, [
      F(ve, {
        name: U(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      U(s) ? (i(), u("span", o0, v(U(n).length), 1)) : $("", !0)
    ], 10, a0)) : $("", !0);
  }
}, vw = /* @__PURE__ */ G(r0, [["__scopeId", "data-v-d073c504"]]), l0 = ["title"], i0 = ["title"], c0 = { class: "diff-card-dir" }, u0 = { class: "diff-card-name" }, d0 = { class: "diff-card-ago" }, h0 = ["title"], f0 = ["title"], p0 = {
  key: 0,
  class: "diff-card-note"
}, m0 = ["href"], g0 = ["src", "alt"], v0 = { class: "diff-card-rows" }, y0 = { class: "diff-row-num" }, w0 = { class: "diff-row-sign" }, k0 = { class: "diff-row-code" }, b0 = {
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
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, c = T(() => n.path.lastIndexOf("/") + 1), d = T(() => n.path.slice(0, c.value)), h = T(() => n.path.slice(c.value)), m = T(() => n.kind === "deleted"), b = T(() => l[n.kind]), _ = T(() => new Set(n.rows.filter((E) => E.line_type === "add").map((E) => E.line))), j = R("after"), D = T(() => j.value === "before" ? n.whole.old : n.whole.text), k = T(() => n.whole && n.whole.text !== void 0 ? D.value.split(`
`).map((E, w) => ({ line_type: j.value === "after" && _.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: E })) : n.rows.filter(
      (E) => !(n.editsOnly && ["ctx", "fold"].includes(E.line_type)) && !(n.hideRemovals && E.line_type === "del")
    )), A = R(!1), C = T(() => n.lines && !A.value && !n.whole), K = T(() => C.value ? k.value.slice(0, n.lines) : k.value), y = T(() => k.value.length - K.value.length), g = (E) => E.line === null || E.line_type === "del" ? "" : E.line, I = (E) => E.line_type === "fold" ? E.hidden ? `⋯ ${E.hidden} lines` : "⋯" : E.text, S = R(null), P = R(null);
    let x = null;
    return Le(() => {
      if (!P.value) return;
      let E = !0;
      x = new ResizeObserver(() => {
        !S.value || !P.value || (S.value.style.transition = E ? "none" : "", S.value.style.height = `${P.value.offsetHeight}px`, E = !1);
      }), x.observe(P.value);
    }), Ee(() => x && x.disconnect()), (E, w) => (i(), u("section", {
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
          p("span", c0, v(d.value), 1),
          p("span", u0, v(h.value), 1),
          b.value ? (i(), u("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, v(b.value), 3)) : $("", !0)
        ], 8, i0),
        p("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        p("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        p("span", d0, v(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: j.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = be((f) => j.value = j.value === "after" ? "before" : "after", ["stop"]))
        }, v(j.value === "after" ? "After" : "Before"), 9, h0)) : $("", !0),
        m.value ? $("", !0) : (i(), u("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = be((f) => s("whole"), ["stop"]))
        }, [
          F(ve, {
            name: "file",
            size: 12
          })
        ], 10, f0))
      ], 8, l0),
      e.whole && e.whole.error ? (i(), u("p", p0, v(e.whole.error), 1)) : $("", !0),
      !m.value && !e.folded ? (i(), u(Y, { key: 1 }, [
        e.picture ? (i(), u("a", {
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
          }, null, 8, g0)
        ], 8, m0)) : (i(), u("div", {
          key: 1,
          ref_key: "grow",
          ref: S,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: P,
            class: "diff-card-diff"
          }, [
            p("div", v0, [
              (i(!0), u(Y, null, ae(K.value, (f, O) => (i(), u("div", {
                key: O,
                class: J(["diff-row", f.line_type, { fresh: e.fresh && f.edit === e.fresh }])
              }, [
                p("span", y0, v(g(f)), 1),
                p("span", w0, v(r[f.line_type]), 1),
                p("span", k0, v(I(f)), 1)
              ], 2))), 128)),
              y.value > 0 ? (i(), u("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = be((f) => A.value = !0, ["stop"]))
              }, v(y.value) + " more " + v(y.value === 1 ? "line" : "lines"), 1)) : $("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : $("", !0)
    ], 2));
  }
}, yw = /* @__PURE__ */ G(b0, [["__scopeId", "data-v-b6424f6e"]]), $0 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), V(we, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: z(() => [
        F(ve, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, x0 = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, M0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, _0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], S0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], E0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], C0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], A0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], O0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? A0(t) : e === "agent" ? [...E0(t), ...S0(t)] : e === "check" ? C0(t) : e === "question" ? _0(t) : ((n = { plan: x0, task: M0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, T0 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, I0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, B0 = { class: "ask-text" }, R0 = ["placeholder", "aria-label"], L0 = ["placeholder", "aria-label"], D0 = {
  key: 3,
  class: "moves"
}, N0 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = T(() => O0(s.kind, s.row)), l = R(""), r = R(null), c = R(""), d = R("");
    ke(() => s.id, () => {
      l.value = "", r.value = null;
    });
    async function h(_, j = "") {
      const D = await s.read([_.noun ?? s.kind, _.word, String(s.id), ..._.flag ? [_.flag, j] : _.positional ? [j] : [], ..._.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      l.value = D.ok ? "" : D.error, D.ok && (r.value = null, c.value = "", d.value = "", a("done"));
    }
    const m = (_) => _.confirm ? r.value = _ : _.said ? h(_, _.said) : _.flag || _.positional ? (r.value = _, c.value = "") : h(_), b = () => c.value.trim() && h(r.value, c.value.trim());
    return t({ moves: o, press: m }), (_, j) => {
      var D;
      return o.value.length ? (i(), u("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        l.value ? (i(), u("p", T0, v(l.value), 1)) : $("", !0),
        (D = r.value) != null && D.confirm ? (i(), u("div", I0, [
          p("span", B0, v(r.value.confirm), 1),
          F(we, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: j[0] || (j[0] = (k) => h(r.value))
          }, {
            default: z(() => [
              ce(v(r.value.label), 1)
            ]),
            _: 1
          }),
          F(we, {
            small: "",
            kind: "ghost",
            onClick: j[1] || (j[1] = (k) => r.value = null)
          }, {
            default: z(() => [...j[7] || (j[7] = [
              ce("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (i(), u("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: be(b, ["prevent"])
        }, [
          et(p("input", {
            "onUpdate:modelValue": j[2] || (j[2] = (k) => c.value = k),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: j[3] || (j[3] = Tt(be((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, R0), [
            [Kn, c.value]
          ]),
          r.value.opener ? et((i(), u("input", {
            key: 0,
            "onUpdate:modelValue": j[4] || (j[4] = (k) => d.value = k),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: j[5] || (j[5] = Tt(be((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, L0)), [
            [Kn, d.value]
          ]) : $("", !0),
          F(we, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
            default: z(() => [
              ce(v(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(we, {
            small: "",
            kind: "ghost",
            onClick: j[6] || (j[6] = (k) => r.value = null)
          }, {
            default: z(() => [...j[8] || (j[8] = [
              ce("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (i(), u("div", D0, [
          (i(!0), u(Y, null, ae(o.value, (k) => (i(), V(we, {
            key: k.word,
            small: "",
            kind: k.main ? "primary" : "ghost",
            "data-move": k.word,
            onClick: (A) => m(k)
          }, {
            default: z(() => [
              ce(v(k.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : $("", !0);
    };
  }
}, j0 = /* @__PURE__ */ G(N0, [["__scopeId", "data-v-fffa0bf6"]]), P0 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, q0 = { ...P0, done: "Completed" }, W0 = { class: "task-status-icon" }, F0 = ["width", "height", "aria-label"], H0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (i(), u("span", W0, [
      F(yt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: z(() => [
          (i(), u("svg", {
            key: e.status,
            class: J(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": U(q0)[e.status]
          }, [
            F(ms, { value: e.status }, {
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
          ], 10, F0))
        ]),
        _: 1
      })
    ]));
  }
}, Fo = /* @__PURE__ */ G(H0, [["__scopeId", "data-v-2ab7e404"]]), U0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), z0 = (e) => U0.has(e), Ho = (e) => z0(e) ? "done" : e, V0 = { class: "facts" }, K0 = { class: "fact wide" }, G0 = { class: "fact-value" }, Y0 = {
  key: 0,
  class: "fact"
}, J0 = { class: "fact-value" }, Z0 = {
  key: 1,
  class: "fact"
}, X0 = { class: "fact-value" }, Q0 = { class: "fact wide" }, ev = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, tv = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = on.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var l, r;
      return i(), u("div", V0, [
        p("div", K0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", G0, v((l = e.place) != null && l.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((r = e.place) == null ? void 0 : r.phase_total) > 1 ? (i(), u("div", Y0, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", J0, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : $("", !0),
        e.task.state === "started" && e.task.holder_id ? (i(), u("div", Z0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", X0, "Agent " + v(e.task.holder_id), 1)
        ])) : $("", !0),
        p("div", Q0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          F(fh, {
            options: U(n),
            value: String(U(ro)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (i(), u("p", ev, v(e.refusal), 1)) : $("", !0)
        ])
      ]);
    };
  }
}, nv = /* @__PURE__ */ G(tv, [["__scopeId", "data-v-2018762d"]]), sv = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, av = ["onClick"], ov = { class: "wait-id" }, rv = { class: "wait-title" }, lv = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, iv = { class: "text" }, cv = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, uv = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, dv = 180, hv = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = R(!1);
    return (a, o) => (i(), u(Y, null, [
      e.task.waits.length ? (i(), u("section", sv, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (i(!0), u(Y, null, ae(e.task.waits, (l) => (i(), u("button", {
          key: l.id,
          type: "button",
          class: "wait",
          onClick: (r) => n("select", l.id)
        }, [
          F(Fo, {
            status: U(Ho)(l.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", ov, v(l.id), 1),
          p("span", rv, v(l.title), 1)
        ], 8, av))), 128))
      ])) : $("", !0),
      e.task.state === "completed" && e.task.outcome ? (i(), u("section", lv, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", iv, v(e.task.outcome), 1)
      ])) : $("", !0),
      e.task.brief ? (i(), u("section", cv, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: J(["text", { clamped: !s.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > dv && !s.value ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (l) => s.value = !0)
        }, "Show the whole brief")) : $("", !0)
      ])) : $("", !0),
      e.task.logs.length ? (i(), u("section", uv, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (i(!0), u(Y, null, ae(e.task.logs, (l) => (i(), u("p", {
          key: l.id,
          class: "log"
        }, v(l.line), 1))), 128))
      ])) : $("", !0)
    ], 64));
  }
}, fv = /* @__PURE__ */ G(hv, [["__scopeId", "data-v-f411ce35"]]), pv = { class: "comment-side-head" }, mv = {
  key: 0,
  class: "comment-none"
}, gv = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (i(), u("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", pv, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        F(yn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? $("", !0) : (i(), u("p", mv, "No comments yet")),
      (i(!0), u(Y, null, ae(e.comments, (s) => (i(), u("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, v(e.words(s)), 1))), 128))
    ], 2));
  }
}, vv = /* @__PURE__ */ G(gv, [["__scopeId", "data-v-19fdbdd4"]]), yv = ["data-comments-below"], wv = 600, kv = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = R(null), n = R(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < wv);
    return Le(() => s.observe(t.value)), wt(() => s.disconnect()), (a, o) => (i(), u("div", {
      ref_key: "root",
      ref: t,
      class: J(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      pe(a.$slots, "default"),
      e.open ? (i(), V(vv, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (l) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : $("", !0)
    ], 10, yv));
  }
}, bv = /* @__PURE__ */ G(kv, [["__scopeId", "data-v-6c850df0"]]), $v = ["placeholder"], xv = { class: "actions" }, Mv = { class: "error" }, _v = {
  key: 1,
  class: "card closed"
}, Sv = { class: "mark" }, Ev = { class: "prompt" }, Cv = {
  key: 0,
  class: "draft"
}, Av = {
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
    const s = e, a = n, o = zn(e, "draft"), l = zn(e, "error"), r = R(!!l.value), c = R(!1), d = R(!1), h = R(null);
    async function m() {
      var D, k;
      r.value = !0, c.value = !1, await Dt(), (k = ((D = h.value) == null ? void 0 : D.querySelector("input")) || h.value) == null || k.focus();
    }
    function b() {
      r.value = !1, l.value = "";
    }
    function _(D) {
      D.shiftKey || D.isComposing || (D.preventDefault(), j());
    }
    async function j() {
      const D = o.value.trim();
      if (!(!D || !s.ready || d.value)) {
        l.value = "", d.value = !0, o.value = "";
        try {
          await s.send(D), r.value = !1, c.value = !0;
        } catch (k) {
          o.value = D, l.value = k.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: m }), (D, k) => (i(), u("div", {
      class: J(["comment-bar", { open: r.value }])
    }, [
      r.value ? (i(), u("form", {
        key: 0,
        class: "card compose",
        onSubmit: be(j, ["prevent"]),
        onKeydown: Tt(b, ["esc"])
      }, [
        pe(D.$slots, "who", {}, void 0, !0),
        et(p("textarea", {
          ref_key: "box",
          ref: h,
          "onUpdate:modelValue": k[0] || (k[0] = (A) => o.value = A),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Tt(_, ["enter"])
        }, null, 40, $v), [
          [Kn, o.value]
        ]),
        p("div", xv, [
          p("span", Mv, v(l.value), 1),
          F(we, {
            small: "",
            onClick: b
          }, {
            default: z(() => [...k[2] || (k[2] = [
              ce("Cancel", -1)
            ])]),
            _: 1
          }),
          F(we, {
            kind: "primary",
            small: "",
            busy: d.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: j
          }, {
            default: z(() => [...k[3] || (k[3] = [
              ce("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (i(), u("div", _v, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          p("span", Sv, [
            F(ve, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", Ev, v(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (i(), u("span", Cv, "Draft kept")) : $("", !0)
        ]),
        e.count ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[1] || (k[1] = (A) => a("show"))
        }, [
          p("span", null, v(U(Rh)(e.count, "comment")), 1),
          F(ve, {
            name: "down",
            size: 12
          })
        ])) : $("", !0)
      ]))
    ], 2));
  }
}, Ov = /* @__PURE__ */ G(Av, [["__scopeId", "data-v-79db0c2d"]]);
function Tv(e, t) {
  const n = R([]), s = R(!1);
  let a = 0, o = 0;
  const l = (d) => {
    const { kind: h, id: m, title: b } = e(), _ = `On ${h} ${m}, ${b}: `;
    return d.text.startsWith(_) ? d.text.slice(_.length) : d.text;
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
    const _ = await t([h, "comment", String(m), d]);
    if (!_.ok)
      throw n.value = n.value.filter((j) => j !== b && j.id !== b.id), new Error(_.error);
    await r();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], r();
  }, { immediate: !0 }), { comments: n, open: s, words: l, send: c, load: r };
}
const Iv = { class: "top" }, Bv = {
  class: "crumb",
  "data-task-crumb": ""
}, Rv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Lv = {
  key: 1,
  class: "body"
}, Dv = { class: "stamp" }, Nv = {
  class: "title",
  "data-resource-title": ""
}, jv = { class: "since" }, Pv = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, qv = { class: "text" }, Wv = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Fv = {
  key: 1,
  class: "note"
}, Hv = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Uv = { class: "text" }, zv = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = R(null), l = R(null), r = R(""), c = R(""), d = R(null), h = R(null), m = Tv(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (y) => s.read(y));
    ke(m.open, (y) => a("comments", y));
    let b = 0;
    const _ = Ho, j = (y) => y.slice(0, 1).toUpperCase() + y.slice(1), D = T(() => {
      var y;
      return (y = l.value) != null && y.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function k() {
      const y = ++b, [g, I] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      y === b && (r.value = g.ok ? "" : g.error, o.value = g.ok ? g.value : null, l.value = I.ok ? I.value : null);
    }
    ke(() => s.id, () => {
      o.value = null, l.value = null, d.value = null, k();
    }, { immediate: !0 }), ke(() => s.changes, k);
    async function A(y) {
      const g = o.value.priority;
      o.value.priority = Number(y);
      const I = await s.read(["task", "edit", String(s.id), "--priority", y]);
      if (c.value = I.ok ? "" : I.error, I.ok) return k();
      o.value.priority = g;
    }
    function C(y) {
      d.value = null, h.value.press(y);
    }
    const K = (y) => {
      var g;
      return ((g = h.value) == null ? void 0 : g.moves.length) && (d.value = y);
    };
    return t({ openStatus: K }), (y, g) => (i(), u("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", Iv, [
        e.backed ? (i(), V($0, {
          key: 0,
          onBack: g[0] || (g[0] = (I) => a("back"))
        })) : $("", !0),
        p("span", Bv, v(D.value), 1),
        g[9] || (g[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (i(), u(Y, { key: 1 }, [
          F(we, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: g[1] || (g[1] = (I) => a("step", -1))
          }, {
            default: z(() => [
              F(ve, {
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
            onClick: g[2] || (g[2] = (I) => a("step", 1))
          }, {
            default: z(() => [
              F(ve, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : $("", !0),
        F(we, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: g[3] || (g[3] = (I) => a("close"))
        }, {
          default: z(() => [
            F(ve, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      r.value ? (i(), u("p", Rv, v(r.value), 1)) : o.value ? (i(), u(Y, { key: 2 }, [
        F(bv, {
          open: U(m).open.value,
          comments: U(m).comments.value,
          words: U(m).words,
          onClose: g[6] || (g[6] = (I) => U(m).open.value = !1)
        }, {
          default: z(() => {
            var I;
            return [
              (i(), u("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", Dv, "Task " + v(o.value.id) + " · updated " + v(U(ts)(U(Yn)(o.value)) || "just now"), 1),
                p("h3", Nv, v(o.value.title), 1),
                p("div", {
                  class: J(["state-line", U(_)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: g[4] || (g[4] = (S) => K(S.currentTarget))
                  }, [
                    F(Fo, {
                      status: U(_)(o.value.state)
                    }, null, 8, ["status"]),
                    ce(" " + v(j(o.value.state)), 1)
                  ]),
                  p("span", jv, "since " + v(U(ts)(U(Yn)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (i(), u("section", Pv, [
                  g[10] || (g[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", qv, v(o.value.reason || "Other tasks"), 1),
                  (I = o.value.openers) != null && I.length ? (i(), u("p", Wv, "Opens by itself when " + v(o.value.openers.join(" or ")) + ".", 1)) : (i(), u("p", Fv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (i(), u("section", Hv, [
                  g[11] || (g[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", Uv, v(o.value.reason), 1)
                ])) : $("", !0),
                F(nv, {
                  task: o.value,
                  place: l.value,
                  refusal: c.value,
                  onPriority: A
                }, null, 8, ["task", "place", "refusal"]),
                F(fv, {
                  task: o.value,
                  onSelect: g[5] || (g[5] = (S) => a("select", S))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        F(Ov, {
          send: U(m).send,
          count: U(m).comments.value.length,
          onShow: g[7] || (g[7] = (I) => U(m).open.value = !U(m).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (i(), u("div", Lv, [
        F(kt)
      ])),
      F(j0, {
        ref_key: "footer",
        ref: h,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: k
      }, null, 8, ["id", "row", "read"]),
      d.value ? (i(), V(xs, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: g[8] || (g[8] = (I) => d.value = null)
      }, {
        default: z(() => [
          F(cs, null, {
            default: z(() => [
              ce("Change the status of task " + v(e.id), 1)
            ]),
            _: 1
          }),
          (i(!0), u(Y, null, ae(h.value.moves, (I) => (i(), V(vt, {
            key: I.word,
            onClick: (S) => C(I)
          }, {
            default: z(() => [
              ce(v(I.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : $("", !0)
    ], 2));
  }
}, ww = /* @__PURE__ */ G(zv, [["__scopeId", "data-v-c76befc4"]]);
function Vv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Un = { exports: {} }, pa;
function Kv() {
  return pa || (pa = 1, (function(e, t) {
    var n = (function() {
      var s = function(g, I) {
        var S = 236, P = 17, x = g, E = o[I], w = null, f = 0, O = null, B = [], q = {}, re = function(L, N) {
          f = x * 4 + 17, w = (function(M) {
            for (var W = new Array(M), H = 0; H < M; H += 1) {
              W[H] = new Array(M);
              for (var X = 0; X < M; X += 1)
                W[H][X] = null;
            }
            return W;
          })(f), ie(0, 0), ie(f - 7, 0), ie(0, f - 7), ee(), Q(), Ae(L, N), x >= 7 && Z(L), O == null && (O = Uo(x, E, B)), Pe(O, N);
        }, ie = function(L, N) {
          for (var M = -1; M <= 7; M += 1)
            if (!(L + M <= -1 || f <= L + M))
              for (var W = -1; W <= 7; W += 1)
                N + W <= -1 || f <= N + W || (0 <= M && M <= 6 && (W == 0 || W == 6) || 0 <= W && W <= 6 && (M == 0 || M == 6) || 2 <= M && M <= 4 && 2 <= W && W <= 4 ? w[L + M][N + W] = !0 : w[L + M][N + W] = !1);
        }, he = function() {
          for (var L = 0, N = 0, M = 0; M < 8; M += 1) {
            re(!0, M);
            var W = r.getLostPoint(q);
            (M == 0 || L > W) && (L = W, N = M);
          }
          return N;
        }, Q = function() {
          for (var L = 8; L < f - 8; L += 1)
            w[L][6] == null && (w[L][6] = L % 2 == 0);
          for (var N = 8; N < f - 8; N += 1)
            w[6][N] == null && (w[6][N] = N % 2 == 0);
        }, ee = function() {
          for (var L = r.getPatternPosition(x), N = 0; N < L.length; N += 1)
            for (var M = 0; M < L.length; M += 1) {
              var W = L[N], H = L[M];
              if (w[W][H] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    X == -2 || X == 2 || oe == -2 || oe == 2 || X == 0 && oe == 0 ? w[W + X][H + oe] = !0 : w[W + X][H + oe] = !1;
            }
        }, Z = function(L) {
          for (var N = r.getBCHTypeNumber(x), M = 0; M < 18; M += 1) {
            var W = !L && (N >> M & 1) == 1;
            w[Math.floor(M / 3)][M % 3 + f - 8 - 3] = W;
          }
          for (var M = 0; M < 18; M += 1) {
            var W = !L && (N >> M & 1) == 1;
            w[M % 3 + f - 8 - 3][Math.floor(M / 3)] = W;
          }
        }, Ae = function(L, N) {
          for (var M = E << 3 | N, W = r.getBCHTypeInfo(M), H = 0; H < 15; H += 1) {
            var X = !L && (W >> H & 1) == 1;
            H < 6 ? w[H][8] = X : H < 8 ? w[H + 1][8] = X : w[f - 15 + H][8] = X;
          }
          for (var H = 0; H < 15; H += 1) {
            var X = !L && (W >> H & 1) == 1;
            H < 8 ? w[8][f - H - 1] = X : H < 9 ? w[8][15 - H - 1 + 1] = X : w[8][15 - H - 1] = X;
          }
          w[f - 8][8] = !L;
        }, Pe = function(L, N) {
          for (var M = -1, W = f - 1, H = 7, X = 0, oe = r.getMaskFunction(N), se = f - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (w[W][se - ye] == null) {
                  var xe = !1;
                  X < L.length && (xe = (L[X] >>> H & 1) == 1);
                  var le = oe(W, se - ye);
                  le && (xe = !xe), w[W][se - ye] = xe, H -= 1, H == -1 && (X += 1, H = 7);
                }
              if (W += M, W < 0 || f <= W) {
                W -= M, M = -M;
                break;
              }
            }
        }, ut = function(L, N) {
          for (var M = 0, W = 0, H = 0, X = new Array(N.length), oe = new Array(N.length), se = 0; se < N.length; se += 1) {
            var ye = N[se].dataCount, xe = N[se].totalCount - ye;
            W = Math.max(W, ye), H = Math.max(H, xe), X[se] = new Array(ye);
            for (var le = 0; le < X[se].length; le += 1)
              X[se][le] = 255 & L.getBuffer()[le + M];
            M += ye;
            var Oe = r.getErrorCorrectPolynomial(xe), Te = d(X[se], Oe.getLength() - 1), Es = Te.mod(Oe);
            oe[se] = new Array(Oe.getLength() - 1);
            for (var le = 0; le < oe[se].length; le += 1) {
              var Cs = le + Es.getLength() - oe[se].length;
              oe[se][le] = Cs >= 0 ? Es.getAt(Cs) : 0;
            }
          }
          for (var As = 0, le = 0; le < N.length; le += 1)
            As += N[le].totalCount;
          for (var $n = new Array(As), Ht = 0, le = 0; le < W; le += 1)
            for (var se = 0; se < N.length; se += 1)
              le < X[se].length && ($n[Ht] = X[se][le], Ht += 1);
          for (var le = 0; le < H; le += 1)
            for (var se = 0; se < N.length; se += 1)
              le < oe[se].length && ($n[Ht] = oe[se][le], Ht += 1);
          return $n;
        }, Uo = function(L, N, M) {
          for (var W = h.getRSBlocks(L, N), H = m(), X = 0; X < M.length; X += 1) {
            var oe = M[X];
            H.put(oe.getMode(), 4), H.put(oe.getLength(), r.getLengthInBits(oe.getMode(), L)), oe.write(H);
          }
          for (var se = 0, X = 0; X < W.length; X += 1)
            se += W[X].dataCount;
          if (H.getLengthInBits() > se * 8)
            throw "code length overflow. (" + H.getLengthInBits() + ">" + se * 8 + ")";
          for (H.getLengthInBits() + 4 <= se * 8 && H.put(0, 4); H.getLengthInBits() % 8 != 0; )
            H.putBit(!1);
          for (; !(H.getLengthInBits() >= se * 8 || (H.put(S, 8), H.getLengthInBits() >= se * 8)); )
            H.put(P, 8);
          return ut(H, W);
        };
        q.addData = function(L, N) {
          N = N || "Byte";
          var M = null;
          switch (N) {
            case "Numeric":
              M = b(L);
              break;
            case "Alphanumeric":
              M = _(L);
              break;
            case "Byte":
              M = j(L);
              break;
            case "Kanji":
              M = D(L);
              break;
            default:
              throw "mode:" + N;
          }
          B.push(M), O = null;
        }, q.isDark = function(L, N) {
          if (L < 0 || f <= L || N < 0 || f <= N)
            throw L + "," + N;
          return w[L][N];
        }, q.getModuleCount = function() {
          return f;
        }, q.make = function() {
          if (x < 1) {
            for (var L = 1; L < 40; L++) {
              for (var N = h.getRSBlocks(L, E), M = m(), W = 0; W < B.length; W++) {
                var H = B[W];
                M.put(H.getMode(), 4), M.put(H.getLength(), r.getLengthInBits(H.getMode(), L)), H.write(M);
              }
              for (var X = 0, W = 0; W < N.length; W++)
                X += N[W].dataCount;
              if (M.getLengthInBits() <= X * 8)
                break;
            }
            x = L;
          }
          re(!1, he());
        }, q.createTableTag = function(L, N) {
          L = L || 2, N = typeof N > "u" ? L * 4 : N;
          var M = "";
          M += '<table style="', M += " border-width: 0px; border-style: none;", M += " border-collapse: collapse;", M += " padding: 0px; margin: " + N + "px;", M += '">', M += "<tbody>";
          for (var W = 0; W < q.getModuleCount(); W += 1) {
            M += "<tr>";
            for (var H = 0; H < q.getModuleCount(); H += 1)
              M += '<td style="', M += " border-width: 0px; border-style: none;", M += " border-collapse: collapse;", M += " padding: 0px; margin: 0px;", M += " width: " + L + "px;", M += " height: " + L + "px;", M += " background-color: ", M += q.isDark(W, H) ? "#000000" : "#ffffff", M += ";", M += '"/>';
            M += "</tr>";
          }
          return M += "</tbody>", M += "</table>", M;
        }, q.createSvgTag = function(L, N, M, W) {
          var H = {};
          typeof arguments[0] == "object" && (H = arguments[0], L = H.cellSize, N = H.margin, M = H.alt, W = H.title), L = L || 2, N = typeof N > "u" ? L * 4 : N, M = typeof M == "string" ? { text: M } : M || {}, M.text = M.text || null, M.id = M.text ? M.id || "qrcode-description" : null, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-title" : null;
          var X = q.getModuleCount() * L + N * 2, oe, se, ye, xe, le = "", Oe;
          for (Oe = "l" + L + ",0 0," + L + " -" + L + ",0 0,-" + L + "z ", le += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', le += H.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', le += ' viewBox="0 0 ' + X + " " + X + '" ', le += ' preserveAspectRatio="xMinYMin meet"', le += W.text || M.text ? ' role="img" aria-labelledby="' + dt([W.id, M.id].join(" ").trim()) + '"' : "", le += ">", le += W.text ? '<title id="' + dt(W.id) + '">' + dt(W.text) + "</title>" : "", le += M.text ? '<description id="' + dt(M.id) + '">' + dt(M.text) + "</description>" : "", le += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', le += '<path d="', ye = 0; ye < q.getModuleCount(); ye += 1)
            for (xe = ye * L + N, oe = 0; oe < q.getModuleCount(); oe += 1)
              q.isDark(ye, oe) && (se = oe * L + N, le += "M" + se + "," + xe + Oe);
          return le += '" stroke="transparent" fill="black"/>', le += "</svg>", le;
        }, q.createDataURL = function(L, N) {
          L = L || 2, N = typeof N > "u" ? L * 4 : N;
          var M = q.getModuleCount() * L + N * 2, W = N, H = M - N;
          return y(M, M, function(X, oe) {
            if (W <= X && X < H && W <= oe && oe < H) {
              var se = Math.floor((X - W) / L), ye = Math.floor((oe - W) / L);
              return q.isDark(ye, se) ? 0 : 1;
            } else
              return 1;
          });
        }, q.createImgTag = function(L, N, M) {
          L = L || 2, N = typeof N > "u" ? L * 4 : N;
          var W = q.getModuleCount() * L + N * 2, H = "";
          return H += "<img", H += ' src="', H += q.createDataURL(L, N), H += '"', H += ' width="', H += W, H += '"', H += ' height="', H += W, H += '"', M && (H += ' alt="', H += dt(M), H += '"'), H += "/>", H;
        };
        var dt = function(L) {
          for (var N = "", M = 0; M < L.length; M += 1) {
            var W = L.charAt(M);
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
        }, zo = function(L) {
          var N = 1;
          L = typeof L > "u" ? N * 2 : L;
          var M = q.getModuleCount() * N + L * 2, W = L, H = M - L, X, oe, se, ye, xe, le = {
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
          for (X = 0; X < M; X += 2) {
            for (se = Math.floor((X - W) / N), ye = Math.floor((X + 1 - W) / N), oe = 0; oe < M; oe += 1)
              xe = "█", W <= oe && oe < H && W <= X && X < H && q.isDark(se, Math.floor((oe - W) / N)) && (xe = " "), W <= oe && oe < H && W <= X + 1 && X + 1 < H && q.isDark(ye, Math.floor((oe - W) / N)) ? xe += " " : xe += "█", Te += L < 1 && X + 1 >= H ? Oe[xe] : le[xe];
            Te += `
`;
          }
          return M % 2 && L > 0 ? Te.substring(0, Te.length - M - 1) + Array(M + 1).join("▀") : Te.substring(0, Te.length - 1);
        };
        return q.createASCII = function(L, N) {
          if (L = L || 1, L < 2)
            return zo(N);
          L -= 1, N = typeof N > "u" ? L * 2 : N;
          var M = q.getModuleCount() * L + N * 2, W = N, H = M - N, X, oe, se, ye, xe = Array(L + 1).join("██"), le = Array(L + 1).join("  "), Oe = "", Te = "";
          for (X = 0; X < M; X += 1) {
            for (se = Math.floor((X - W) / L), Te = "", oe = 0; oe < M; oe += 1)
              ye = 1, W <= oe && oe < H && W <= X && X < H && q.isDark(se, Math.floor((oe - W) / L)) && (ye = 0), Te += ye ? xe : le;
            for (se = 0; se < L; se += 1)
              Oe += Te + `
`;
          }
          return Oe.substring(0, Oe.length - 1);
        }, q.renderTo2dContext = function(L, N) {
          N = N || 2;
          for (var M = q.getModuleCount(), W = 0; W < M; W++)
            for (var H = 0; H < M; H++)
              L.fillStyle = q.isDark(W, H) ? "black" : "white", L.fillRect(W * N, H * N, N, N);
        }, q;
      };
      s.stringToBytesFuncs = {
        default: function(g) {
          for (var I = [], S = 0; S < g.length; S += 1) {
            var P = g.charCodeAt(S);
            I.push(P & 255);
          }
          return I;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(g, I) {
        var S = (function() {
          for (var x = C(g), E = function() {
            var Q = x.read();
            if (Q == -1) throw "eof";
            return Q;
          }, w = 0, f = {}; ; ) {
            var O = x.read();
            if (O == -1) break;
            var B = E(), q = E(), re = E(), ie = String.fromCharCode(O << 8 | B), he = q << 8 | re;
            f[ie] = he, w += 1;
          }
          if (w != I)
            throw w + " != " + I;
          return f;
        })(), P = 63;
        return function(x) {
          for (var E = [], w = 0; w < x.length; w += 1) {
            var f = x.charCodeAt(w);
            if (f < 128)
              E.push(f);
            else {
              var O = S[x.charAt(w)];
              typeof O == "number" ? (O & 255) == O ? E.push(O) : (E.push(O >>> 8), E.push(O & 255)) : E.push(P);
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
      }, l = {
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
        ], I = 1335, S = 7973, P = 21522, x = {}, E = function(w) {
          for (var f = 0; w != 0; )
            f += 1, w >>>= 1;
          return f;
        };
        return x.getBCHTypeInfo = function(w) {
          for (var f = w << 10; E(f) - E(I) >= 0; )
            f ^= I << E(f) - E(I);
          return (w << 10 | f) ^ P;
        }, x.getBCHTypeNumber = function(w) {
          for (var f = w << 12; E(f) - E(S) >= 0; )
            f ^= S << E(f) - E(S);
          return w << 12 | f;
        }, x.getPatternPosition = function(w) {
          return g[w - 1];
        }, x.getMaskFunction = function(w) {
          switch (w) {
            case l.PATTERN000:
              return function(f, O) {
                return (f + O) % 2 == 0;
              };
            case l.PATTERN001:
              return function(f, O) {
                return f % 2 == 0;
              };
            case l.PATTERN010:
              return function(f, O) {
                return O % 3 == 0;
              };
            case l.PATTERN011:
              return function(f, O) {
                return (f + O) % 3 == 0;
              };
            case l.PATTERN100:
              return function(f, O) {
                return (Math.floor(f / 2) + Math.floor(O / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(f, O) {
                return f * O % 2 + f * O % 3 == 0;
              };
            case l.PATTERN110:
              return function(f, O) {
                return (f * O % 2 + f * O % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(f, O) {
                return (f * O % 3 + (f + O) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + w;
          }
        }, x.getErrorCorrectPolynomial = function(w) {
          for (var f = d([1], 0), O = 0; O < w; O += 1)
            f = f.multiply(d([1, c.gexp(O)], 0));
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
          for (var f = w.getModuleCount(), O = 0, B = 0; B < f; B += 1)
            for (var q = 0; q < f; q += 1) {
              for (var re = 0, ie = w.isDark(B, q), he = -1; he <= 1; he += 1)
                if (!(B + he < 0 || f <= B + he))
                  for (var Q = -1; Q <= 1; Q += 1)
                    q + Q < 0 || f <= q + Q || he == 0 && Q == 0 || ie == w.isDark(B + he, q + Q) && (re += 1);
              re > 5 && (O += 3 + re - 5);
            }
          for (var B = 0; B < f - 1; B += 1)
            for (var q = 0; q < f - 1; q += 1) {
              var ee = 0;
              w.isDark(B, q) && (ee += 1), w.isDark(B + 1, q) && (ee += 1), w.isDark(B, q + 1) && (ee += 1), w.isDark(B + 1, q + 1) && (ee += 1), (ee == 0 || ee == 4) && (O += 3);
            }
          for (var B = 0; B < f; B += 1)
            for (var q = 0; q < f - 6; q += 1)
              w.isDark(B, q) && !w.isDark(B, q + 1) && w.isDark(B, q + 2) && w.isDark(B, q + 3) && w.isDark(B, q + 4) && !w.isDark(B, q + 5) && w.isDark(B, q + 6) && (O += 40);
          for (var q = 0; q < f; q += 1)
            for (var B = 0; B < f - 6; B += 1)
              w.isDark(B, q) && !w.isDark(B + 1, q) && w.isDark(B + 2, q) && w.isDark(B + 3, q) && w.isDark(B + 4, q) && !w.isDark(B + 5, q) && w.isDark(B + 6, q) && (O += 40);
          for (var Z = 0, q = 0; q < f; q += 1)
            for (var B = 0; B < f; B += 1)
              w.isDark(B, q) && (Z += 1);
          var Ae = Math.abs(100 * Z / f / f - 50) / 5;
          return O += Ae * 10, O;
        }, x;
      })(), c = (function() {
        for (var g = new Array(256), I = new Array(256), S = 0; S < 8; S += 1)
          g[S] = 1 << S;
        for (var S = 8; S < 256; S += 1)
          g[S] = g[S - 4] ^ g[S - 5] ^ g[S - 6] ^ g[S - 8];
        for (var S = 0; S < 255; S += 1)
          I[g[S]] = S;
        var P = {};
        return P.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return I[x];
        }, P.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return g[x];
        }, P;
      })();
      function d(g, I) {
        if (typeof g.length > "u")
          throw g.length + "/" + I;
        var S = (function() {
          for (var x = 0; x < g.length && g[x] == 0; )
            x += 1;
          for (var E = new Array(g.length - x + I), w = 0; w < g.length - x; w += 1)
            E[w] = g[w + x];
          return E;
        })(), P = {};
        return P.getAt = function(x) {
          return S[x];
        }, P.getLength = function() {
          return S.length;
        }, P.multiply = function(x) {
          for (var E = new Array(P.getLength() + x.getLength() - 1), w = 0; w < P.getLength(); w += 1)
            for (var f = 0; f < x.getLength(); f += 1)
              E[w + f] ^= c.gexp(c.glog(P.getAt(w)) + c.glog(x.getAt(f)));
          return d(E, 0);
        }, P.mod = function(x) {
          if (P.getLength() - x.getLength() < 0)
            return P;
          for (var E = c.glog(P.getAt(0)) - c.glog(x.getAt(0)), w = new Array(P.getLength()), f = 0; f < P.getLength(); f += 1)
            w[f] = P.getAt(f);
          for (var f = 0; f < x.getLength(); f += 1)
            w[f] ^= c.gexp(c.glog(x.getAt(f)) + E);
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
        ], I = function(x, E) {
          var w = {};
          return w.totalCount = x, w.dataCount = E, w;
        }, S = {}, P = function(x, E) {
          switch (E) {
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
        return S.getRSBlocks = function(x, E) {
          var w = P(x, E);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + E;
          for (var f = w.length / 3, O = [], B = 0; B < f; B += 1)
            for (var q = w[B * 3 + 0], re = w[B * 3 + 1], ie = w[B * 3 + 2], he = 0; he < q; he += 1)
              O.push(I(re, ie));
          return O;
        }, S;
      })(), m = function() {
        var g = [], I = 0, S = {};
        return S.getBuffer = function() {
          return g;
        }, S.getAt = function(P) {
          var x = Math.floor(P / 8);
          return (g[x] >>> 7 - P % 8 & 1) == 1;
        }, S.put = function(P, x) {
          for (var E = 0; E < x; E += 1)
            S.putBit((P >>> x - E - 1 & 1) == 1);
        }, S.getLengthInBits = function() {
          return I;
        }, S.putBit = function(P) {
          var x = Math.floor(I / 8);
          g.length <= x && g.push(0), P && (g[x] |= 128 >>> I % 8), I += 1;
        }, S;
      }, b = function(g) {
        var I = a.MODE_NUMBER, S = g, P = {};
        P.getMode = function() {
          return I;
        }, P.getLength = function(w) {
          return S.length;
        }, P.write = function(w) {
          for (var f = S, O = 0; O + 2 < f.length; )
            w.put(x(f.substring(O, O + 3)), 10), O += 3;
          O < f.length && (f.length - O == 1 ? w.put(x(f.substring(O, O + 1)), 4) : f.length - O == 2 && w.put(x(f.substring(O, O + 2)), 7));
        };
        var x = function(w) {
          for (var f = 0, O = 0; O < w.length; O += 1)
            f = f * 10 + E(w.charAt(O));
          return f;
        }, E = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return P;
      }, _ = function(g) {
        var I = a.MODE_ALPHA_NUM, S = g, P = {};
        P.getMode = function() {
          return I;
        }, P.getLength = function(E) {
          return S.length;
        }, P.write = function(E) {
          for (var w = S, f = 0; f + 1 < w.length; )
            E.put(
              x(w.charAt(f)) * 45 + x(w.charAt(f + 1)),
              11
            ), f += 2;
          f < w.length && E.put(x(w.charAt(f)), 6);
        };
        var x = function(E) {
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
        return P;
      }, j = function(g) {
        var I = a.MODE_8BIT_BYTE, S = s.stringToBytes(g), P = {};
        return P.getMode = function() {
          return I;
        }, P.getLength = function(x) {
          return S.length;
        }, P.write = function(x) {
          for (var E = 0; E < S.length; E += 1)
            x.put(S[E], 8);
        }, P;
      }, D = function(g) {
        var I = a.MODE_KANJI, S = s.stringToBytesFuncs.SJIS;
        if (!S)
          throw "sjis not supported.";
        (function(E, w) {
          var f = S(E);
          if (f.length != 2 || (f[0] << 8 | f[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var P = S(g), x = {};
        return x.getMode = function() {
          return I;
        }, x.getLength = function(E) {
          return ~~(P.length / 2);
        }, x.write = function(E) {
          for (var w = P, f = 0; f + 1 < w.length; ) {
            var O = (255 & w[f]) << 8 | 255 & w[f + 1];
            if (33088 <= O && O <= 40956)
              O -= 33088;
            else if (57408 <= O && O <= 60351)
              O -= 49472;
            else
              throw "illegal char at " + (f + 1) + "/" + O;
            O = (O >>> 8 & 255) * 192 + (O & 255), E.put(O, 13), f += 2;
          }
          if (f < w.length)
            throw "illegal char at " + (f + 1);
        }, x;
      }, k = function() {
        var g = [], I = {};
        return I.writeByte = function(S) {
          g.push(S & 255);
        }, I.writeShort = function(S) {
          I.writeByte(S), I.writeByte(S >>> 8);
        }, I.writeBytes = function(S, P, x) {
          P = P || 0, x = x || S.length;
          for (var E = 0; E < x; E += 1)
            I.writeByte(S[E + P]);
        }, I.writeString = function(S) {
          for (var P = 0; P < S.length; P += 1)
            I.writeByte(S.charCodeAt(P));
        }, I.toByteArray = function() {
          return g;
        }, I.toString = function() {
          var S = "";
          S += "[";
          for (var P = 0; P < g.length; P += 1)
            P > 0 && (S += ","), S += g[P];
          return S += "]", S;
        }, I;
      }, A = function() {
        var g = 0, I = 0, S = 0, P = "", x = {}, E = function(f) {
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
          for (g = g << 8 | f & 255, I += 8, S += 1; I >= 6; )
            E(g >>> I - 6), I -= 6;
        }, x.flush = function() {
          if (I > 0 && (E(g << 6 - I), g = 0, I = 0), S % 3 != 0)
            for (var f = 3 - S % 3, O = 0; O < f; O += 1)
              P += "=";
        }, x.toString = function() {
          return P;
        }, x;
      }, C = function(g) {
        var I = g, S = 0, P = 0, x = 0, E = {};
        E.read = function() {
          for (; x < 8; ) {
            if (S >= I.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var f = I.charAt(S);
            if (S += 1, f == "=")
              return x = 0, -1;
            if (f.match(/^\s$/))
              continue;
            P = P << 6 | w(f.charCodeAt(0)), x += 6;
          }
          var O = P >>> x - 8 & 255;
          return x -= 8, O;
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
        return E;
      }, K = function(g, I) {
        var S = g, P = I, x = new Array(g * I), E = {};
        E.setPixel = function(B, q, re) {
          x[q * S + B] = re;
        }, E.write = function(B) {
          B.writeString("GIF87a"), B.writeShort(S), B.writeShort(P), B.writeByte(128), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(255), B.writeByte(255), B.writeByte(255), B.writeString(","), B.writeShort(0), B.writeShort(0), B.writeShort(S), B.writeShort(P), B.writeByte(0);
          var q = 2, re = f(q);
          B.writeByte(q);
          for (var ie = 0; re.length - ie > 255; )
            B.writeByte(255), B.writeBytes(re, ie, 255), ie += 255;
          B.writeByte(re.length - ie), B.writeBytes(re, ie, re.length - ie), B.writeByte(0), B.writeString(";");
        };
        var w = function(B) {
          var q = B, re = 0, ie = 0, he = {};
          return he.write = function(Q, ee) {
            if (Q >>> ee)
              throw "length over";
            for (; re + ee >= 8; )
              q.writeByte(255 & (Q << re | ie)), ee -= 8 - re, Q >>>= 8 - re, ie = 0, re = 0;
            ie = Q << re | ie, re = re + ee;
          }, he.flush = function() {
            re > 0 && q.writeByte(ie);
          }, he;
        }, f = function(B) {
          for (var q = 1 << B, re = (1 << B) + 1, ie = B + 1, he = O(), Q = 0; Q < q; Q += 1)
            he.add(String.fromCharCode(Q));
          he.add(String.fromCharCode(q)), he.add(String.fromCharCode(re));
          var ee = k(), Z = w(ee);
          Z.write(q, ie);
          var Ae = 0, Pe = String.fromCharCode(x[Ae]);
          for (Ae += 1; Ae < x.length; ) {
            var ut = String.fromCharCode(x[Ae]);
            Ae += 1, he.contains(Pe + ut) ? Pe = Pe + ut : (Z.write(he.indexOf(Pe), ie), he.size() < 4095 && (he.size() == 1 << ie && (ie += 1), he.add(Pe + ut)), Pe = ut);
          }
          return Z.write(he.indexOf(Pe), ie), Z.write(re, ie), Z.flush(), ee.toByteArray();
        }, O = function() {
          var B = {}, q = 0, re = {};
          return re.add = function(ie) {
            if (re.contains(ie))
              throw "dup key:" + ie;
            B[ie] = q, q += 1;
          }, re.size = function() {
            return q;
          }, re.indexOf = function(ie) {
            return B[ie];
          }, re.contains = function(ie) {
            return typeof B[ie] < "u";
          }, re;
        };
        return E;
      }, y = function(g, I, S) {
        for (var P = K(g, I), x = 0; x < I; x += 1)
          for (var E = 0; E < g; E += 1)
            P.setPixel(E, x, S(E, x));
        var w = k();
        P.write(w);
        for (var f = A(), O = w.toByteArray(), B = 0; B < O.length; B += 1)
          f.writeByte(O[B]);
        return f.flush(), "data:image/gif;base64," + f;
      };
      return s;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(s) {
        function a(o) {
          for (var l = [], r = 0; r < o.length; r++) {
            var c = o.charCodeAt(r);
            c < 128 ? l.push(c) : c < 2048 ? l.push(
              192 | c >> 6,
              128 | c & 63
            ) : c < 55296 || c >= 57344 ? l.push(
              224 | c >> 12,
              128 | c >> 6 & 63,
              128 | c & 63
            ) : (r++, c = 65536 + ((c & 1023) << 10 | o.charCodeAt(r) & 1023), l.push(
              240 | c >> 18,
              128 | c >> 12 & 63,
              128 | c >> 6 & 63,
              128 | c & 63
            ));
          }
          return l;
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
var Gv = Kv();
const Yv = /* @__PURE__ */ Vv(Gv), Jv = ["width", "height", "viewBox"], Zv = ["width", "height"], Xv = ["d"], Qv = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = T(() => {
      const s = Yv(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let l = 0; l < a; l += 1)
        for (let r = 0; r < a; r += 1)
          s.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: a + 8, path: o.join("") };
    });
    return (s, a) => (i(), u("svg", {
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
      }, null, 8, Zv),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Xv)
    ], 8, Jv));
  }
}, kw = /* @__PURE__ */ G(Qv, [["__scopeId", "data-v-489f0852"]]), bw = sr(() => import("./VoiceFigure-CmPr5RXG.js").then((e) => e.V)), $w = "1.0.0", xw = "3.5";
export {
  oy as $,
  Dy as A,
  Ze as B,
  Vy as C,
  Ry as D,
  zy as E,
  Ey as F,
  Po as G,
  lg as H,
  og as I,
  Xy as J,
  bt as K,
  Fy as L,
  Ie as M,
  Ct as N,
  jy as O,
  bn as P,
  Py as Q,
  Hp as R,
  Ao as S,
  Ly as T,
  Uy as U,
  ca as V,
  zm as W,
  jm as X,
  Qy as Y,
  Ky as Z,
  G as _,
  je as a,
  He as a$,
  cw as a0,
  we as a1,
  yn as a2,
  ry as a3,
  pu as a4,
  yw as a5,
  _y as a6,
  tn as a7,
  tw as a8,
  ty as a9,
  my as aA,
  kt as aB,
  yy as aC,
  sy as aD,
  ms as aE,
  ww as aF,
  Fo as aG,
  gy as aH,
  Ye as aI,
  vy as aJ,
  bw as aK,
  Ce as aL,
  dd as aM,
  ts as aN,
  mw as aO,
  pw as aP,
  gw as aQ,
  My as aR,
  $y as aS,
  ky as aT,
  sw as aU,
  rh as aV,
  dy as aW,
  nw as aX,
  q1 as aY,
  ay as aZ,
  uy as a_,
  Rt as aa,
  hy as ab,
  ve as ac,
  uw as ad,
  $w as ae,
  xw as af,
  fy as ag,
  dw as ah,
  as as ai,
  by as aj,
  K1 as ak,
  vt as al,
  cs as am,
  xs as an,
  ly as ao,
  py as ap,
  Mr as aq,
  vw as ar,
  cy as as,
  kw as at,
  lw as au,
  Jr as av,
  ny as aw,
  xy as ax,
  Vg as ay,
  fh as az,
  Xe as b,
  iy as b0,
  wy as b1,
  lt as b2,
  wg as b3,
  iw as b4,
  aw as b5,
  hw as b6,
  Nh as b7,
  s0 as b8,
  vo as b9,
  ow as ba,
  af as bb,
  rw as bc,
  pn as bd,
  fw as be,
  Ny as c,
  Ay as d,
  Oy as e,
  Cy as f,
  Yy as g,
  xo as h,
  qy as i,
  Wy as j,
  Hy as k,
  Jy as l,
  Ty as m,
  Sy as n,
  Iy as o,
  cn as p,
  ew as q,
  Gy as r,
  By as s,
  De as t,
  Nm as u,
  Zy as v,
  qm as w,
  Ms as x,
  im as y,
  cm as z
};
